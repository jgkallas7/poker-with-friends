import React, { useState, useEffect, useRef } from 'react';

function Chat({ gameId, user, socket }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Request chat history when component mounts
    socket.emit('get-chat-history', { gameId });

    socket.on('chat-history', ({ messages }) => {
      setMessages(messages);
    });

    socket.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('chat-history');
      socket.off('chat-message');
    };
  }, [gameId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('send-message', {
        gameId,
        playerId: user.id,
        playerName: user.name,
        message: inputMessage
      });
      setInputMessage('');
    }
  };

  return (
    <div className={`chat-container ${isOpen ? 'open' : ''}`}>
      <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>💬 Chat {isOpen ? '▼' : '▲'}</h3>
      </div>

      {isOpen && (
        <>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.playerId === user.id ? 'own-message' : ''}`}
              >
                <div className="message-author">{msg.playerName}</div>
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Chat;
