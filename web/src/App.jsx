import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lobby from './components/Lobby';
import PokerTable from './components/PokerTable';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<Lobby user={user} setUser={setUser} />}
          />
          <Route
            path="/game/:gameId"
            element={user ? <PokerTable user={user} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
