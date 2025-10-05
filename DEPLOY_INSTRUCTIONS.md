# 🚀 Step-by-Step Deployment Instructions

Follow these exact steps to get your poker app live!

---

## ✅ STEP 1: Create GitHub Repository (5 minutes)

### Option A: Using GitHub Website (Easiest)

1. **Open**: https://github.com/new
2. **Login** with your GitHub account (username: jgkallas7)
3. **Fill in**:
   - **Repository name**: `poker-with-friends`
   - **Description**: `Real-time poker app for playing with friends`
   - **Visibility**: ✅ **Public** (required for free Render/Vercel)
   - ❌ **DON'T check** "Add a README file"
   - ❌ **DON'T add** .gitignore or license (we have them)
4. **Click**: "Create repository"

### After Creating the Repo:

GitHub will show you setup commands. **IGNORE THOSE** and run these instead:

**Open Terminal/Command Prompt and run:**

```bash
cd "c:\Users\jgkal\OneDrive\BrushHill Trading\Poker"
git remote add origin https://github.com/jgkallas7/poker-with-friends.git
git branch -M main
git push -u origin main
```

**Expected output**: Should say "Branch 'main' set up to track remote branch 'main' from 'origin'"

✅ **Verify**: Refresh your GitHub repo page - you should see all your code!

---

## ✅ STEP 2: Deploy Backend to Render (10 minutes)

### A. Sign Up for Render

1. **Go to**: https://render.com
2. **Click**: "Get Started for Free"
3. **Sign up with GitHub** (easiest - one click!)
4. **Authorize Render** to access your GitHub

### B. Create Web Service

1. **Click**: "New +" (top right) → "Web Service"
2. **Connect Repository**: Find and select `poker-with-friends`
3. **Click**: "Connect" next to your repo

### C. Configure Service

Fill in these **EXACT** settings:

| Setting | Value |
|---------|-------|
| **Name** | `poker-server` (or any name you like) |
| **Region** | Oregon (US West) |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### D. Add Environment Variables

1. **Scroll down** to "Environment Variables"
2. **Click**: "Add Environment Variable"
3. **Add these TWO variables**:

   **Variable 1:**
   - Key: `NODE_ENV`
   - Value: `production`

   **Variable 2:**
   - Key: `CLIENT_URL`
   - Value: `*` (we'll update this later)

4. **Click**: "Create Web Service"

### E. Wait for Deployment

- **Status** will show "Building..." then "Deploying..."
- **Wait 2-3 minutes** (free tier can be slow)
- **When done**, you'll see "Live" with a green dot ✅

### F. Copy Your Backend URL

1. **Look at top of page** - you'll see your URL
2. **Example**: `https://poker-server-abc123.onrender.com`
3. **COPY THIS URL** - you'll need it for Vercel!

📝 **Write it down**: _______________________________________

---

## ✅ STEP 3: Deploy Frontend to Vercel (10 minutes)

### A. Sign Up for Vercel

1. **Go to**: https://vercel.com
2. **Click**: "Sign Up"
3. **Sign up with GitHub** (one click!)
4. **Authorize Vercel**

### B. Import Project

1. **Click**: "Add New..." → "Project"
2. **Find**: `poker-with-friends` repository
3. **Click**: "Import"

### C. Configure Project

Fill in these **EXACT** settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `web` (click "Edit" to change) |
| **Build Command** | `npm run build` (auto-filled) |
| **Output Directory** | `dist` (auto-filled) |

### D. Add Environment Variable

1. **Click**: "Environment Variables" (expand section)
2. **Add ONE variable**:
   - **Name**: `VITE_SERVER_URL`
   - **Value**: YOUR RENDER URL from Step 2 (paste the full URL)
   - **Example**: `https://poker-server-abc123.onrender.com`
3. **Make sure** to paste YOUR actual Render URL!

### E. Deploy

1. **Click**: "Deploy"
2. **Wait 1-2 minutes** (Vercel is fast!)
3. **When done**: You'll see "Congratulations!" 🎉

### F. Copy Your Frontend URL

1. **Click**: "Visit" or copy the URL shown
2. **Example**: `https://poker-with-friends.vercel.app`
3. **COPY THIS URL** - this is what you share with friends!

📝 **Write it down**: _______________________________________

---

## ✅ STEP 4: Update Backend CORS (2 minutes)

**IMPORTANT**: Go back to Render and update the CORS setting!

1. **Go to**: https://dashboard.render.com
2. **Click**: Your `poker-server` service
3. **Click**: "Environment" tab (left sidebar)
4. **Find**: `CLIENT_URL` variable
5. **Click**: Edit (pencil icon)
6. **Change from**: `*`
7. **Change to**: Your Vercel URL (e.g., `https://poker-with-friends.vercel.app`)
8. **Click**: "Save Changes"
9. **Service will auto-redeploy** (wait 1 minute)

---

## 🎉 YOU'RE DONE!

### Test It:

1. **Open your Vercel URL**: `https://poker-with-friends.vercel.app`
2. **Enter your name**
3. **Create a game**
4. **Copy the Game ID**
5. **Send to a friend**: "Go to [your-vercel-url] and join with Game ID: [the-id]"
6. **Play poker!** 🃏

---

## 📱 Share With Friends:

**Message to copy/paste:**

```
Hey! Let's play poker online!

1. Go to: https://poker-with-friends.vercel.app
2. Enter your name
3. Join with Game ID: [PASTE-GAME-ID-HERE]

We can play from anywhere - no downloads needed!
```

---

## ❓ Troubleshooting

### "Can't connect to server"
- Check that `CLIENT_URL` in Render matches your Vercel URL EXACTLY
- Check Render logs: Dashboard → poker-server → Logs

### "Deployment failed"
- Make sure `server` and `web` folders have package.json files
- Check Render/Vercel build logs for errors

### "WebSocket connection failed"
- Render free tier can take 30-60 seconds to wake up if inactive
- Just refresh the page after a minute

---

## 💰 Costs

- **Render Free Tier**: 750 hours/month (plenty for your poker games!)
- **Vercel Free Tier**: Unlimited hosting
- **Total Cost**: $0/month 🎉

---

## 🔄 Future Updates

When you make code changes:

```bash
cd "c:\Users\jgkal\OneDrive\BrushHill Trading\Poker"
git add .
git commit -m "Your update message"
git push
```

Both Render and Vercel will **auto-deploy** your changes!

---

**Need help? Check the main DEPLOYMENT.md or create an issue on GitHub!**
