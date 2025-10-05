-- PostgreSQL Database Schema for Poker App

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Friends relationships
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

-- Game sessions
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_name VARCHAR(100) NOT NULL,
    host_id UUID REFERENCES users(id),
    max_players INTEGER DEFAULT 6,
    small_blind INTEGER NOT NULL,
    big_blind INTEGER NOT NULL,
    default_buy_in INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

-- Player sessions (tracks buy-ins and cash-outs)
CREATE TABLE player_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    total_buy_in INTEGER DEFAULT 0,
    total_cash_out INTEGER DEFAULT 0,
    net_result INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP
);

-- Transaction log (for settlement tracking)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_session_id UUID REFERENCES player_sessions(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- buy_in, cash_out
    amount INTEGER NOT NULL,
    chips_after INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Hand history
CREATE TABLE hand_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    hand_number INTEGER NOT NULL,
    winner_id UUID REFERENCES users(id),
    pot_size INTEGER NOT NULL,
    community_cards JSONB,
    player_hands JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
CREATE INDEX idx_player_sessions_game ON player_sessions(game_session_id);
CREATE INDEX idx_player_sessions_user ON player_sessions(user_id);
CREATE INDEX idx_transactions_session ON transactions(player_session_id);
CREATE INDEX idx_hand_history_game ON hand_history(game_session_id);
CREATE INDEX idx_chat_messages_game ON chat_messages(game_session_id);
