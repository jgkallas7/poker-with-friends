# 🃏 Poker with Friends

A real-time multiplayer poker application for web and mobile, designed for friends to play cash games remotely with proper buy-in/cash-out tracking for real-money settlements outside the app.

## Features

✅ **Cryptographically Secure Random Card Dealing** - Uses Node.js `crypto.randomBytes()` for true randomness
✅ **2-10 Player Support** - Fully customizable table sizes
✅ **Real-time Gameplay** - WebSocket-based instant updates
✅ **Discord-like Chat** - Built-in messaging system with history
✅ **Buy-in/Cash-out Tracking** - Comprehensive transaction logging for settlements
✅ **Customizable Game Settings** - Configure blinds, buy-ins, and chip amounts
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Cash Game Tracking** - Perfect for tracking who owes whom after the session

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **Socket.io** - Real-time WebSocket communication
- **PostgreSQL** - Database for users, games, and transactions
- **Crypto** - Secure random number generation

### Frontend (Web)
- **React** + **Vite** - Modern, fast web app
- **Socket.io Client** - Real-time updates
- **React Router** - Navigation

### Frontend (Mobile)
- **React Native** - Cross-platform mobile app (iOS & Android)
- *(Coming soon - shared logic with web version)*

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
cd "c:\Users\jgkal\OneDrive\BrushHill Trading\Poker"
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Set up PostgreSQL database**
```bash
# Create database
createdb poker_app

# Run schema
psql -d poker_app -f server/database/schema.sql
```

4. **Configure environment variables**
```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
```

5. **Start the application**

**Terminal 1 - Backend Server:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Web Client:**
```bash
cd web
npm install
npm run dev
```

6. **Access the app**
- Web: http://localhost:3000
- API: http://localhost:3001

## 🌐 Playing with Friends Across Different States

**⚠️ The local setup above only works on your WiFi network.** To play with friends in different locations:

👉 **See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide**

**Quick Summary:**
1. Deploy backend to [Render.com](https://render.com) (free)
2. Deploy frontend to [Vercel.com](https://vercel.com) (free)
3. Share the Vercel URL with friends
4. Play from anywhere! 🌍

**Total cost: $0/month** with free tiers

## How to Play

### Creating a Game
1. Enter your name on the lobby screen
2. Click "Create New Game"
3. Configure settings:
   - Room name
   - Max players (2-10)
   - Small/Big blinds
   - Default buy-in amount
4. Share the **Game ID** with friends

### Joining a Game
1. Enter your name
2. Paste the Game ID you received
3. Set your buy-in amount
4. Click "Join Game"

### Playing
- **Start Hand** - Begin a new round (any player can start)
- **Actions**: Fold, Check, Call, Raise, All-In
- **Buy-in** - Add more chips during the game
- **Cash Out** - End your session and see your profit/loss

### Chat
- Click the chat icon in the bottom-right
- Send messages to all players at the table
- Full message history

### Settlement Tracking
When you cash out, the app shows:
- Total buy-in amount
- Cash-out amount
- Net profit/loss

**Important**: The app does NOT handle real money. You settle up outside the app using the transaction history as a reference.

## Game Flow

1. Players join the room
2. Anyone clicks "Start Hand" to deal cards
3. Blinds are automatically posted
4. Players receive 2 hole cards
5. Betting round (Preflop)
6. Flop (3 community cards)
7. Betting round
8. Turn (1 community card)
9. Betting round
10. River (1 community card)
11. Final betting round
12. Showdown - Winner takes the pot

## Project Structure

```
poker-friends-app/
├── server/                 # Backend Node.js server
│   ├── database/          # PostgreSQL schemas
│   ├── utils/             # Poker engine & card deck
│   ├── index.js           # Main server & Socket.io
│   └── package.json
├── web/                   # React web client
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main app component
│   │   └── styles.css    # Styling
│   └── package.json
├── mobile/                # React Native (future)
└── README.md
```

## Security Notes

🔒 **Card Shuffling**: Uses `crypto.randomBytes()` for cryptographically secure randomness
🔒 **No Cheating**: Players only see their own cards until showdown
🔒 **Transaction Logging**: All buy-ins and cash-outs are tracked

## Future Enhancements

- [ ] User authentication & persistent accounts
- [ ] Friend lists
- [ ] Hand history review
- [ ] Mobile app (React Native)
- [ ] Tournament mode
- [ ] Different poker variants (Omaha, etc.)
- [ ] Enhanced hand evaluation library
- [ ] Video/voice chat integration
- [ ] Auto-settlement calculation (Venmo/PayPal links)

## Development

### Running in Development Mode

```bash
# Server with auto-reload
cd server
npm run dev

# Web client with hot-reload
cd web
npm run dev
```

### Building for Production

```bash
# Build web client
cd web
npm run build

# Serve with production server
cd server
npm start
```

## Contributing

This is a personal project for playing poker with friends. Feel free to fork and customize for your own group!

## License

MIT

## Support

For issues or questions, create an issue on GitHub or contact the developer.

---

**Remember**: This app is for tracking chips only. All real-money transactions happen outside the app. Play responsibly! 🎰
