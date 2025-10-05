import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const socket = io(SERVER_URL);

function Lobby({ user, setUser }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [smallBlind, setSmallBlind] = useState(5);
  const [bigBlind, setBigBlind] = useState(10);
  const [buyInAmount, setBuyInAmount] = useState(1000);
  const [gameIdToJoin, setGameIdToJoin] = useState('');

  useEffect(() => {
    socket.on('game-created', ({ gameId }) => {
      navigate(`/game/${gameId}`);
    });

    socket.on('joined-game', ({ gameId }) => {
      navigate(`/game/${gameId}`);
    });

    return () => {
      socket.off('game-created');
      socket.off('joined-game');
    };
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const userId = `user-${Date.now()}`;
      setUser({ id: userId, name: username });
    }
  };

  const createGame = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please enter your username first');
      return;
    }

    socket.emit('create-game', {
      roomName,
      hostId: user.id,
      hostName: user.name,
      maxPlayers,
      smallBlind,
      bigBlind,
      buyInAmount
    });
  };

  const joinGame = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please enter your username first');
      return;
    }

    socket.emit('join-game', {
      gameId: gameIdToJoin,
      playerId: user.id,
      playerName: user.name,
      buyInAmount
    });
  };

  if (!user) {
    return (
      <div className="lobby-container">
        <div className="login-card">
          <h1>🃏 Poker with Friends</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <h1>Welcome, {user.name}! 🃏</h1>

        <div className="lobby-section">
          <h2>Create New Game</h2>
          <form onSubmit={createGame} className="game-form">
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="input"
              required
            />

            <div className="form-row">
              <div className="form-group">
                <label>Max Players</label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="input"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Small Blind</label>
                <input
                  type="number"
                  value={smallBlind}
                  onChange={(e) => setSmallBlind(Number(e.target.value))}
                  className="input"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Big Blind</label>
                <input
                  type="number"
                  value={bigBlind}
                  onChange={(e) => setBigBlind(Number(e.target.value))}
                  className="input"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Buy-in Amount</label>
                <input
                  type="number"
                  value={buyInAmount}
                  onChange={(e) => setBuyInAmount(Number(e.target.value))}
                  className="input"
                  min="1"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Game
            </button>
          </form>
        </div>

        <div className="lobby-section">
          <h2>Join Existing Game</h2>
          <form onSubmit={joinGame} className="game-form">
            <input
              type="text"
              placeholder="Game ID"
              value={gameIdToJoin}
              onChange={(e) => setGameIdToJoin(e.target.value)}
              className="input"
              required
            />

            <div className="form-group">
              <label>Buy-in Amount</label>
              <input
                type="number"
                value={buyInAmount}
                onChange={(e) => setBuyInAmount(Number(e.target.value))}
                className="input"
                min="1"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Join Game
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
