import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from './Card';
import Chat from './Chat';
import socket from '../socket';

function PokerTable({ user }) {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [showBuyIn, setShowBuyIn] = useState(false);
  const [buyInAmount, setBuyInAmount] = useState(1000);

  useEffect(() => {
    console.log('PokerTable: Setting up socket listeners');
    console.log('Socket ID:', socket.id);
    console.log('Socket connected:', socket.connected);

    // Listen for game updates
    socket.on('hand-started', ({ gameState }) => {
      console.log('✅ Received hand-started event!', gameState);
      setGameState(gameState);
    });

    socket.on('game-updated', ({ gameState, action }) => {
      setGameState(gameState);
    });

    socket.on('player-joined', ({ gameState }) => {
      setGameState(gameState);
    });

    socket.on('player-bought-in', ({ playerId, amount, newChips }) => {
      setGameState(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        const player = updated.players.find(p => p.id === playerId);
        if (player) player.chips = newChips;
        return updated;
      });
    });

    socket.on('cash-out-complete', ({ cashOutAmount, totalBuyIn, netResult }) => {
      alert(`Cash out complete!\nCash out: ${cashOutAmount}\nTotal buy-in: ${totalBuyIn}\nNet: ${netResult >= 0 ? '+' : ''}${netResult}`);
    });

    socket.on('error', ({ message }) => {
      alert(`Error: ${message}`);
    });

    return () => {
      socket.off('hand-started');
      socket.off('game-updated');
      socket.off('player-joined');
      socket.off('player-bought-in');
      socket.off('cash-out-complete');
      socket.off('error');
    };
  }, []);

  const startHand = () => {
    console.log('🎲 Starting hand...', { gameId, playerId: user.id });
    console.log('Socket connected:', socket.connected);
    socket.emit('start-hand', { gameId, playerId: user.id });
  };

  const performAction = (action, amount = 0) => {
    socket.emit('player-action', { gameId, playerId: user.id, action, amount });
  };

  const handleBuyIn = () => {
    socket.emit('buy-in', { gameId, playerId: user.id, amount: buyInAmount });
    setShowBuyIn(false);
  };

  const handleCashOut = () => {
    if (confirm('Are you sure you want to cash out?')) {
      socket.emit('cash-out', { gameId, playerId: user.id });
    }
  };

  const currentPlayer = gameState?.players?.find(p => p.id === user.id);
  const isMyTurn = gameState?.players?.[gameState.currentPlayerIndex]?.id === user.id;

  if (!gameState) {
    return (
      <div className="poker-table-container">
        <div className="loading">
          <h2>Waiting for game to start...</h2>
          <button onClick={startHand} className="btn btn-primary">
            Start Hand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="poker-table-container">
      <div className="game-info">
        <h3>Game ID: {gameId}</h3>
        <div className="blinds-info">
          Blinds: {gameState.smallBlind}/{gameState.bigBlind} | Pot: {gameState.pot}
        </div>
      </div>

      <div className="poker-table">
        {/* Community Cards */}
        <div className="community-cards">
          <h3>Community Cards</h3>
          <div className="cards">
            {gameState.communityCards.map((card, i) => (
              <Card key={i} suit={card.suit} rank={card.rank} />
            ))}
          </div>
          <div className="pot-display">Pot: ${gameState.pot}</div>
        </div>

        {/* Players */}
        <div className="players-container">
          {gameState.players.map((player, index) => (
            <div
              key={player.id}
              className={`player-seat ${
                index === gameState.currentPlayerIndex ? 'active-player' : ''
              } ${index === gameState.dealerIndex ? 'dealer' : ''} ${
                player.folded ? 'folded' : ''
              }`}
            >
              <div className="player-info">
                <div className="player-name">
                  {player.name}
                  {index === gameState.dealerIndex && ' (D)'}
                  {player.id === user.id && ' (You)'}
                </div>
                <div className="player-chips">Chips: ${player.chips}</div>
                {player.bet > 0 && <div className="player-bet">Bet: ${player.bet}</div>}
                {player.folded && <div className="folded-label">Folded</div>}
              </div>

              {/* Show player's cards only for current user */}
              {player.id === user.id && player.cards.length > 0 && (
                <div className="player-cards">
                  {player.cards.map((card, i) => (
                    <Card key={i} suit={card.suit} rank={card.rank} />
                  ))}
                </div>
              )}

              {/* Show all cards during showdown */}
              {gameState.gameState === 'showdown' && player.cards.length > 0 && (
                <div className="player-cards">
                  {player.cards.map((card, i) => (
                    <Card key={i} suit={card.suit} rank={card.rank} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Player's Cards (Bottom Center) */}
        {currentPlayer && currentPlayer.cards.length > 0 && (
          <div className="my-cards">
            <h4>Your Hand</h4>
            <div className="cards">
              {currentPlayer.cards.map((card, i) => (
                <Card key={i} suit={card.suit} rank={card.rank} />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          {gameState.gameState === 'waiting' && (
            <button onClick={startHand} className="btn btn-primary btn-large">
              Start New Hand
            </button>
          )}

          {isMyTurn && !currentPlayer?.folded && (
            <>
              <button
                onClick={() => performAction('fold')}
                className="btn btn-danger"
              >
                Fold
              </button>

              {gameState.currentBet === currentPlayer?.bet && (
                <button
                  onClick={() => performAction('check')}
                  className="btn btn-secondary"
                >
                  Check
                </button>
              )}

              {gameState.currentBet > currentPlayer?.bet && (
                <button
                  onClick={() => performAction('call')}
                  className="btn btn-primary"
                >
                  Call ${gameState.currentBet - currentPlayer.bet}
                </button>
              )}

              <div className="raise-controls">
                <input
                  type="number"
                  value={raiseAmount}
                  onChange={(e) => setRaiseAmount(Number(e.target.value))}
                  min={gameState.currentBet * 2}
                  max={currentPlayer?.chips}
                  className="input"
                  placeholder="Raise amount"
                />
                <button
                  onClick={() => performAction('raise', raiseAmount)}
                  className="btn btn-success"
                  disabled={raiseAmount < gameState.currentBet * 2}
                >
                  Raise
                </button>
              </div>

              <button
                onClick={() => performAction('raise', currentPlayer?.chips)}
                className="btn btn-warning"
              >
                All In (${currentPlayer?.chips})
              </button>
            </>
          )}

          {!isMyTurn && gameState.gameState !== 'waiting' && (
            <div className="waiting-message">Waiting for other players...</div>
          )}
        </div>

        {/* Buy-in and Cash-out */}
        <div className="game-controls">
          <button onClick={() => setShowBuyIn(!showBuyIn)} className="btn btn-secondary">
            Buy-in
          </button>
          <button onClick={handleCashOut} className="btn btn-danger">
            Cash Out
          </button>

          {showBuyIn && (
            <div className="buy-in-modal">
              <input
                type="number"
                value={buyInAmount}
                onChange={(e) => setBuyInAmount(Number(e.target.value))}
                className="input"
                placeholder="Buy-in amount"
                min="1"
              />
              <button onClick={handleBuyIn} className="btn btn-primary">
                Confirm Buy-in
              </button>
              <button onClick={() => setShowBuyIn(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Component */}
      <Chat gameId={gameId} user={user} socket={socket} />
    </div>
  );
}

export default PokerTable;
