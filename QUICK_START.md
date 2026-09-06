# 🚀 Quick Start - Deploy to Render NOW!

## ⚡ Fast Track Deployment (5 Minutes)

Follow these exact commands in order:

### STEP 1: Commit Your Code (2 minutes)

Open PowerShell in your project folder and run:

```powershell
# Add all files to git
git add .

# Commit with message
git commit -m "Add deployment configuration and documentation"

# Push to GitHub
git push origin main
```

**Wait for:** Push to complete successfully ✅

---

### STEP 2: Create Render Account (1 minute)

1. Open browser: https://render.com/
2. Click "Get Started"
3. Click "Sign in with GitHub" 
4. Authorize Render
5. Done! ✅

---

### STEP 3: Deploy Static Site (2 minutes)

1. In Render Dashboard, click **"New +"** → **"Static Site"**

2. Connect Repository:
   - Find: `NEWSMANIA-V4`
   - Click **"Connect"**

3. Fill Configuration:
   ```
   Name: newsmania
   Branch: main
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. Add ALL Environment Variables (copy-paste these):

```
VITE_NEWS_API_KEY=4d9ec4d7869a4862a82dabc81cf0e00c
VITE_GOOGLE_PLACE_API_KEY=AIzaSyBX5YRgPsBvjLs4Lqa8b_kfLcNW0gZRNEM
VITE_GOOGLE_GEMINI_AI_API_KEY=AIzaSyCp4haRHm3ayV5qnq8EYHRLKbY-EKEXPYw
VITE_GEMINI_API_KEY=AIzaSyARMzVzxdTHu5ikXpbojTbBeJvSqFJuNl8
VITE_FIREBASE_API_KEY=AIzaSyDUocYjQzxOgrf9NVEcqBNG6_rq7n1lNxc
VITE_FIREBASE_AUTH_DOMAIN=newsmania-v1-85756.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=newsmania-v1-85756
VITE_FIREBASE_STORAGE_BUCKET=newsmania-v1-85756.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=215597408976
VITE_FIREBASE_APP_ID=1:215597408976:web:63073e968b0a45d2bc74d5
VITE_FIREBASE_MEASUREMENT_ID=G-QKTFYRCH4Z
VITE_GOOGLE_AUTH_CLIENT_ID=861216395718-et3enlu6p0dmmkteprf78g8ebk6f5k6n.apps.googleusercontent.com
```

5. Click **"Create Static Site"**

6. Wait 3-5 minutes for build ⏳

7. **DONE!** Your site is live! 🎉

---

### STEP 4: Update Firebase (1 minute)

1. Go to: https://console.firebase.google.com/
2. Select project: `newsmania-v1-85756`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add: `newsmania.onrender.com` (or your Render URL)
6. Save ✅

---

## ✅ That's It!

Your app is now LIVE at: `https://newsmania.onrender.com`

---

## 🐛 If Something Goes Wrong:

**Build Failed?**
```bash
# Test locally first:
npm install
npm run build

# If works, push again:
git add .
git commit -m "Fix build"
git push
```

**White Screen?**
- Check environment variables in Render
- Make sure all VITE_ variables are added
- Click "Manual Deploy" in Render dashboard

**Login Not Working?**
- Add your Render domain to Firebase authorized domains
- Update OAuth redirect URIs in Google Cloud Console

---

## 📱 Share Your Live App:

```
https://newsmania.onrender.com
```

Tweet it, share it, add to portfolio! 🚀

---

**Need detailed guide?** Read `DEPLOYMENT_GUIDE.md`

**Questions?** Email: pranavkapratwar106@gmail.com
