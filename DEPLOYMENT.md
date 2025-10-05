# 🚀 Deployment Guide - Play from Anywhere

To play poker with friends across different states/countries, you need to deploy the server to the internet.

## 📋 Quick Overview

1. **Backend** → Deploy to a cloud platform (Render, Railway, Heroku)
2. **Frontend** → Deploy to Vercel or Netlify
3. **Share link** → Friends access from anywhere!

---

## 🎯 Option 1: Free Deployment (Recommended)

### Step 1: Deploy Backend to Render (Free)

1. **Create account** at [render.com](https://render.com)

2. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial poker app"
   # Create a repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/poker-app.git
   git push -u origin main
   ```

3. **On Render dashboard**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name**: poker-server
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variables**:
       - `NODE_ENV` = `production`
       - `PORT` = `3001`
       - `CLIENT_URL` = `*` (or your frontend URL later)

4. **Deploy** and copy your server URL (e.g., `https://poker-server-abc123.onrender.com`)

### Step 2: Deploy Frontend to Vercel (Free)

1. **Create account** at [vercel.com](https://vercel.com)

2. **Create `.env` file in `/web` folder**:
   ```bash
   cd web
   echo "VITE_SERVER_URL=https://your-poker-server.onrender.com" > .env
   ```
   *(Replace with your Render URL from Step 1)*

3. **On Vercel dashboard**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `web`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Environment Variables**:
       - `VITE_SERVER_URL` = Your Render backend URL

4. **Deploy** and get your live URL (e.g., `https://poker-app.vercel.app`)

### Step 3: Update CORS in Backend

Update `server/index.js` to allow your frontend URL:

```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://poker-app.vercel.app',
    methods: ['GET', 'POST']
  }
});
```

Redeploy the backend on Render.

### Step 4: Share with Friends!

Send them your Vercel URL: `https://poker-app.vercel.app`

Everyone can now play from anywhere! 🎉

---

## 🎯 Option 2: Railway (Alternative Free Platform)

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway auto-detects and deploys both services
5. Get your public URLs and update environment variables

---

## 🎯 Option 3: Self-Host on Your Computer (Advanced)

**Use ngrok to expose your local server to the internet:**

1. **Install ngrok**: [ngrok.com/download](https://ngrok.com/download)

2. **Start your local server**:
   ```bash
   cd server
   npm run dev
   ```

3. **In another terminal, expose it**:
   ```bash
   ngrok http 3001
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Update web client**:
   ```bash
   cd web
   echo "VITE_SERVER_URL=https://abc123.ngrok.io" > .env
   npm run dev
   ```

6. **Share your web client URL** with friends

**Note**: ngrok URLs change each restart (unless you pay). Good for testing, not permanent.

---

## 🎯 Option 4: Full Production Setup

### Backend: Render/Railway/Heroku + PostgreSQL

1. Add PostgreSQL database on your hosting platform
2. Run the schema: `server/database/schema.sql`
3. Update environment variables with DB credentials
4. Deploy backend

### Frontend: Vercel/Netlify

1. Connect GitHub repo
2. Set environment variable for backend URL
3. Deploy

### Domain (Optional)
- Buy domain on Namecheap/GoDaddy
- Point to your Vercel/Render URLs
- Now friends visit `poker.yourdomain.com`!

---

## 🔧 Environment Variables Summary

### Backend (.env)
```bash
PORT=3001
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend (.env)
```bash
VITE_SERVER_URL=https://your-backend-url.onrender.com
```

---

## ✅ Testing Multi-State Gameplay

1. Deploy both backend and frontend
2. Open your frontend URL on your computer
3. Send URL to friend in another state
4. Both create/join same game using Game ID
5. Play in real-time! 🎰

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Render** | 750 hrs/month | $7/mo for always-on |
| **Vercel** | Unlimited | $20/mo pro features |
| **Railway** | $5 free credit/mo | Pay as you go |
| **Ngrok** | Free (rotating URL) | $8/mo (static URL) |

**Recommended**: Start with Render + Vercel free tiers!

---

## 🐛 Troubleshooting

**"Can't connect to server"**
- Check CORS settings in `server/index.js`
- Verify `VITE_SERVER_URL` in frontend `.env`
- Check Render logs for errors

**"WebSocket connection failed"**
- Ensure your hosting supports WebSockets (Render does)
- Check firewall settings

**"Cards not dealing"**
- Check browser console for errors
- Verify Socket.io connection in Network tab

---

## 📞 Need Help?

Check server logs on your hosting platform's dashboard. Most issues are CORS or environment variable related.

Happy gaming! 🃏
