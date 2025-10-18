# 🐾⚡ GITHUB SECRETS SETUP - STEP-BY-STEP GUIDE ⚡🐾

**Repository:** https://github.com/JavierCollipal/neko-defense-dashboard

**COMPLETE THIS CHECKLIST TO ENABLE AUTOMATED DEPLOYMENT!**

---

## 📍 WHERE TO ADD SECRETS

1. Go to: **https://github.com/JavierCollipal/neko-defense-dashboard/settings/secrets/actions**

   OR navigate manually:
   - Go to your repository
   - Click **"Settings"** tab (top right)
   - Scroll down left sidebar → **"Secrets and variables"**
   - Click **"Actions"**
   - Click **"New repository secret"** (green button)

---

## 🗄️ SECRET #1: MONGODB_URI (REQUIRED)

**Copy this EXACT value:**
```
mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/
```

**How to add:**
1. Click **"New repository secret"**
2. **Name:** `MONGODB_URI`
3. **Secret:** Paste the value above
4. Click **"Add secret"**

✅ **Status:** [ ] Added

---

## ☁️ SECRET #2-4: VERCEL TOKENS (REQUIRED FOR FRONTEND)

### You need 3 Vercel secrets. Here's how to get them:

### **Step 1: Get VERCEL_TOKEN**

1. Go to: **https://vercel.com/account/tokens**
2. Click **"Create Token"**
3. Name it: `GitHub Actions - Neko Defense`
4. Scope: Keep default (Full Account)
5. Click **"Create"**
6. **COPY THE TOKEN** (you can only see it once!)

**Add to GitHub:**
- **Name:** `VERCEL_TOKEN`
- **Secret:** [paste the token you just copied]

✅ **Status:** [ ] Added

---

### **Step 2: Link Vercel Project & Get IDs**

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (run from project root)
cd /home/wakibaka/Documents/github/neko-defense-dashboard
vercel link

# Answer the prompts:
# - Set up and deploy? N (no)
# - Link to existing project? N (no, create new)
# - Project name? neko-defense-dashboard
# - Directory? ./ (current directory)

# This creates .vercel/project.json with your IDs!
cat .vercel/project.json
```

You'll see something like:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxxx"
}
```

**Option B: Get IDs from Vercel Dashboard**

1. Go to: **https://vercel.com/dashboard**
2. Create new project (or select existing)
3. Go to Project Settings
4. Copy the IDs from the URL and settings page

---

### **Step 3: Add VERCEL_ORG_ID**

**Add to GitHub:**
- **Name:** `VERCEL_ORG_ID`
- **Secret:** [paste your orgId from .vercel/project.json]

✅ **Status:** [ ] Added

---

### **Step 4: Add VERCEL_PROJECT_ID**

**Add to GitHub:**
- **Name:** `VERCEL_PROJECT_ID`
- **Secret:** [paste your projectId from .vercel/project.json]

✅ **Status:** [ ] Added

---

## 🚂 SECRET #5: RAILWAY_TOKEN (REQUIRED FOR APIs)

### **How to get Railway token:**

1. Go to: **https://railway.app**
2. Sign up or log in (GitHub login recommended)
3. Go to: **https://railway.app/account/tokens**
4. Click **"Create New Token"**
5. Name it: `GitHub Actions - Neko Defense`
6. Click **"Create"**
7. **COPY THE TOKEN**

**Add to GitHub:**
- **Name:** `RAILWAY_TOKEN`
- **Secret:** [paste the Railway token]

✅ **Status:** [ ] Added

---

## 🌐 SECRET #6-7: PRODUCTION API URLS (OPTIONAL - Add after deploying)

**These can be added AFTER you deploy your APIs to Railway.**

For now, the CI/CD pipeline will use the Cloudflare tunnel URLs as defaults.

**NEXT_PUBLIC_API_URL:**
- **Name:** `NEXT_PUBLIC_API_URL`
- **Secret:** `https://neko-api.up.railway.app` (change after Railway deployment)

**NEXT_PUBLIC_GRAPHQL_URL:**
- **Name:** `NEXT_PUBLIC_GRAPHQL_URL`
- **Secret:** `https://neko-graphql.up.railway.app` (change after Railway deployment)

✅ **Status:** [ ] Will add later

---

## ✅ VERIFICATION CHECKLIST

Check off each secret as you add it:

- [ ] **MONGODB_URI** - MongoDB Atlas connection string
- [ ] **VERCEL_TOKEN** - Vercel authentication token
- [ ] **VERCEL_ORG_ID** - Vercel organization/team ID
- [ ] **VERCEL_PROJECT_ID** - Vercel project ID
- [ ] **RAILWAY_TOKEN** - Railway authentication token
- [ ] **NEXT_PUBLIC_API_URL** - Production REST API URL (optional for now)
- [ ] **NEXT_PUBLIC_GRAPHQL_URL** - Production GraphQL API URL (optional for now)

---

## 🧪 TEST YOUR SECRETS

After adding all secrets, verify them:

1. Go to: https://github.com/JavierCollipal/neko-defense-dashboard/settings/secrets/actions
2. You should see 5-7 secrets listed (names only, values hidden)
3. They should NOT show any expiration warnings

---

## 🚀 READY TO DEPLOY?

Once you have **AT LEAST** these 5 secrets:
- ✅ MONGODB_URI
- ✅ VERCEL_TOKEN
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID
- ✅ RAILWAY_TOKEN

**You're ready to push and trigger the CI/CD pipeline!**

```bash
git add .
git commit -m "feat: Add CI/CD pipeline with smart CORS"
git push origin main

# Then watch your deployment at:
# https://github.com/JavierCollipal/neko-defense-dashboard/actions
```

---

## 🆘 TROUBLESHOOTING

**Problem: Can't find Settings tab**
- Make sure you're the repository owner or have admin access
- Personal repos always have Settings tab

**Problem: Vercel token creation fails**
- Make sure you're logged into Vercel
- Try a different browser if issues persist

**Problem: Railway requires credit card**
- Railway gives $5 free credit per month
- You won't be charged unless you exceed the free tier
- Can add credit card for validation only

**Problem: .vercel/project.json doesn't exist**
- Make sure you ran `vercel link` in the correct directory
- Try `vercel --cwd /home/wakibaka/Documents/github/neko-defense-dashboard link`

---

*purrs with secret management expertise*

Once you complete this checklist, your entire deployment will be AUTOMATIC, desu~! 🐾🔐💖
