# CineAI — Script-based AI Filmmaking Tool Suggester

A BCA research project on AI inclusivity in filmmaking.
Paste any film script and get personalized AI + editing tool suggestions.

---

## Project Structure

```
film-tool-suggester/
├── server.js          ← Node.js backend (Express)
├── package.json       ← Project config
├── .env               ← Your API key (never upload this)
├── .gitignore         ← Keeps .env out of GitHub
└── public/
    └── index.html     ← Frontend (served by Express)
```

---

## Step 1 — Get your FREE Gemini API Key

1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Copy the key (looks like: AIza...)

---

## Step 2 — Set up locally

1. Make sure Node.js is installed: https://nodejs.org (download LTS)
2. Open terminal in this project folder
3. Run: npm install
4. Open the .env file and replace: your_gemini_api_key_here with your actual key
5. Run: node server.js
6. Open browser → http://localhost:3000

---

## Step 3 — Deploy to Render.com (FREE hosting)

### 3a. Push to GitHub
1. Create account at github.com
2. Create a new repository called "film-tool-suggester"
3. In your terminal (inside the project folder):

   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/film-tool-suggester.git
   git push -u origin main

### 3b. Deploy on Render
1. Go to https://render.com → sign up (free)
2. Click "New" → "Web Service"
3. Connect your GitHub account → select your repo
4. Fill in:
   - Name: film-tool-suggester
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
5. Click "Advanced" → "Add Environment Variable"
   - Key: GEMINI_API_KEY
   - Value: (paste your Gemini API key here)
6. Click "Create Web Service"
7. Wait 2-3 minutes → you get a live URL like: https://film-tool-suggester.onrender.com

---

## Notes
- The .env file is in .gitignore so your API key is NEVER uploaded to GitHub
- On Render, the key is stored securely as an environment variable
- Free tier on Render may sleep after 15 minutes of inactivity (first load takes ~30s to wake)
