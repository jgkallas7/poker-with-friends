const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const PokerEngine = require('./utils/pokerEngine');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// In-memory storage for active games (replace with Redis in production)
const activeGames = new Map();
const playerSockets = new Map(); // playerId -> socketId

// REST API routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', activeGames: activeGames.size });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  console.log('   Origin:', socket.handshake.headers.origin);

  // Create a new game room
  socket.on('create-game', ({ roomName, hostId, hostName, maxPlayers, smallBlind, bigBlind, buyInAmount }) => {
    const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const game = new PokerEngine(
      gameId,
      [{ id: hostId, name: hostName }],
      buyInAmount,
      smallBlind,
      bigBlind
    );

    game.maxPlayers = maxPlayers;
    game.roomName = roomName;
    game.chatHistory = [];

    activeGames.set(gameId, game);
    socket.join(gameId);
    playerSockets.set(hostId, socket.id);

    socket.emit('game-created', {
      gameId,
      roomName,
      gameState: game.getGameState(hostId)
    });

    console.log(`Game created: ${gameId} by ${hostName}`);
  });

  // Join an existing game
  socket.on('join-game', ({ gameId, playerId, playerName, buyInAmount }) => {
    const game = activeGames.get(gameId);

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.players.length >= game.maxPlayers) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    // Add player to game
    game.players.push({
      id: playerId,
      name: playerName,
      chips: buyInAmount,
      cards: [],
      bet: 0,
      folded: false,
      allIn: false,
      position: game.players.length,
      totalBuyIn: buyInAmount,
      totalCashOut: 0
    });

    socket.join(gameId);
    playerSockets.set(playerId, socket.id);

    // Notify all players
    io.to(gameId).emit('player-joined', {
      playerId,
      playerName,
      gameState: game.getGameState()
    });

    socket.emit('joined-game', {
      gameId,
      gameState: game.getGameState(playerId)
    });

    console.log(`${playerName} joined game ${gameId}`);
  });

  // Start a new hand
  socket.on('start-hand', ({ gameId, playerId }) => {
    const game = activeGames.get(gameId);

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const gameState = game.startHand();

    // Send personalized game state to each player (only show their own cards)
    game.players.forEach(player => {
      const playerSocketId = playerSockets.get(player.id);
      if (playerSocketId) {
        io.to(playerSocketId).emit('hand-started', {
          gameState: game.getGameState(player.id)
        });
      }
    });

    console.log(`Hand started in game ${gameId}`);
  });

  // Player action (fold, check, call, raise)
  socket.on('player-action', ({ gameId, playerId, action, amount }) => {
    const game = activeGames.get(gameId);

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const result = game.playerAction(playerId, action, amount);

    if (!result.success) {
      socket.emit('error', { message: result.error });
      return;
    }

    // Send updated game state to all players
    game.players.forEach(player => {
      const playerSocketId = playerSockets.get(player.id);
      if (playerSocketId) {
        io.to(playerSocketId).emit('game-updated', {
          gameState: game.getGameState(player.id),
          action: { playerId, action, amount }
        });
      }
    });

    console.log(`${playerId} performed ${action} in game ${gameId}`);
  });

  // Buy-in during game
  socket.on('buy-in', ({ gameId, playerId, amount }) => {
    const game = activeGames.get(gameId);

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const result = game.buyIn(playerId, amount);

    if (result.success) {
      io.to(gameId).emit('player-bought-in', {
        playerId,
        amount,
        newChips: result.newChips
      });

      // Log transaction (in production, save to database)
      console.log(`${playerId} bought in ${amount} chips in game ${gameId}`);
    }
  });

  // Cash out
  socket.on('cash-out', ({ gameId, playerId }) => {
    const game = activeGames.get(gameId);

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const result = game.cashOut(playerId);

    if (result.success) {
      socket.emit('cash-out-complete', {
        cashOutAmount: result.cashOutAmount,
        totalBuyIn: result.totalBuyIn,
        netResult: result.netResult
      });

      io.to(gameId).emit('player-cashed-out', {
        playerId,
        netResult: result.netResult
      });

      console.log(`${playerId} cashed out: ${result.netResult >= 0 ? '+' : ''}${result.netResult} in game ${gameId}`);
    }
  });

  // Chat message
  socket.on('send-message', ({ gameId, playerId, playerName, message }) => {
    const game = activeGames.get(gameId);

    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const chatMessage = {
      id: Date.now(),
      playerId,
      playerName,
      message,
      timestamp: new Date().toISOString()
    };

    game.chatHistory.push(chatMessage);

    io.to(gameId).emit('chat-message', chatMessage);
  });

  // Get chat history
  socket.on('get-chat-history', ({ gameId }) => {
    const game = activeGames.get(gameId);

    if (game) {
      socket.emit('chat-history', { messages: game.chatHistory });
    }
  });

  // Leave game
  socket.on('leave-game', ({ gameId, playerId }) => {
    const game = activeGames.get(gameId);

    if (game) {
      socket.leave(gameId);
      playerSockets.delete(playerId);

      io.to(gameId).emit('player-left', { playerId });

      console.log(`${playerId} left game ${gameId}`);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Find and remove player from active games
    for (const [playerId, socketId] of playerSockets.entries()) {
      if (socketId === socket.id) {
        playerSockets.delete(playerId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🃏 Poker server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
