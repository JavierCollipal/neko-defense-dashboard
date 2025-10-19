# 🐾⚡ GitHub Secrets Setup Guide ⚡🐾

**Required for automatic CI/CD deployment via GitHub Actions**

---

## 📋 What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that you set in your repository settings. They're used by GitHub Actions workflows to authenticate with deployment platforms without exposing credentials in your code.

---

## 🔒 Secrets You Need to Add

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### **1. MongoDB Atlas** 🗄️

```
Name: MONGODB_URI
Value: mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/neko-defense-system
```

**Why:** Allows deployed apps to connect to your MongoDB database

**⚠️ IMPORTANT:** Must include database name `/neko-defense-system` at the end!

---

### **2. Vercel (Frontend Deployment)** ☁️

#### **VERCEL_TOKEN** (Required)
```
Name: VERCEL_TOKEN
Value: <your-vercel-token>
```

**How to get:**
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token

#### **VERCEL_ORG_ID** (Required)
```
Name: VERCEL_ORG_ID
Value: <your-org-id>
```

**How to get:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel login`
3. Run: `vercel link`
4. Open: `.vercel/project.json`
5. Copy the `orgId` value

#### **VERCEL_PROJECT_ID** (Required)
```
Name: VERCEL_PROJECT_ID
Value: <your-project-id>
```

**How to get:**
1. From the same `.vercel/project.json` file
2. Copy the `projectId` value

---

### **3. Cypress Cloud (E2E Testing)** ☁️🧪

#### **CYPRESS_RECORD_KEY** (Required for test recording)
```
Name: CYPRESS_RECORD_KEY
Value: 72f44521-8447-4cc2-8d48-a6112813ce57
```

**How to get:**
1. Go to https://cloud.cypress.io/projects/9xzw4h/settings
2. Navigate to "Record Keys" section
3. Copy the existing key or create a new one

**Why:** Enables parallel test recording to Cypress Cloud dashboard

**Project ID:** `9xzw4h` (already configured in cypress.config.js)

**Dashboard URL:** https://cloud.cypress.io/projects/9xzw4h

---

### **4. Railway (API Deployment)** 🚂

#### **RAILWAY_TOKEN** (Required)
```
Name: RAILWAY_TOKEN
Value: <your-railway-token>
```

**How to get:**
1. Go to https://railway.app/account/tokens
2. Click "Create New Token"
3. Name it "GitHub Actions"
4. Copy the token

---

### **5. Production API URLs** 🌐

After deploying your APIs to Railway, set these:

#### **NEXT_PUBLIC_API_URL**
```
Name: NEXT_PUBLIC_API_URL
Value: https://neko-api.up.railway.app
```

#### **NEXT_PUBLIC_GRAPHQL_URL**
```
Name: NEXT_PUBLIC_GRAPHQL_URL
Value: https://neko-graphql.up.railway.app
```

**Note:** Replace with your actual Railway deployment URLs

---

## ✅ Verification Checklist

- [ ] MONGODB_URI secret added (with `/neko-defense-system` database!)
- [ ] CYPRESS_RECORD_KEY secret added (for Cypress Cloud ☁️)
- [ ] VERCEL_TOKEN secret added
- [ ] VERCEL_ORG_ID secret added
- [ ] VERCEL_PROJECT_ID secret added
- [ ] RAILWAY_TOKEN secret added
- [ ] NEXT_PUBLIC_API_URL secret added (after deploying APIs)
- [ ] NEXT_PUBLIC_GRAPHQL_URL secret added (after deploying APIs)

---

## 🚀 Testing the Pipeline

Once all secrets are added:

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: Add CI/CD pipeline"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Go to your repo → **Actions** tab
   - You should see "🚀 CI/CD Pipeline (Optimized)" workflow running
   - Click on it to see live logs

3. **Verify Deployments:**
   - Frontend: Check Vercel dashboard (vercel.com/dashboard)
   - APIs: Check Railway dashboard (railway.app/dashboard)
   - Cypress Tests: Check Cypress Cloud (cloud.cypress.io/projects/9xzw4h)

---

## 🔧 Troubleshooting

### Workflow fails with "VERCEL_TOKEN is not set"
- Make sure you added the secret in GitHub repo settings
- Secret name must be EXACTLY `VERCEL_TOKEN` (case-sensitive)

### Workflow fails with "Railway authentication failed"
- Verify RAILWAY_TOKEN is correct
- Token may have expired - create a new one

### Frontend can't connect to API
- Check NEXT_PUBLIC_API_URL points to correct Railway URL
- Verify CORS is enabled in REST API server (already configured!)
- Check API is actually running on Railway

---

## 💡 Pro Tips

1. **Use different Railway projects** for REST API and GraphQL API (easier to manage)
2. **Enable auto-deploy** in Railway: Settings → Connect GitHub repo
3. **Set up custom domains** in Vercel and Railway for professional URLs
4. **Monitor deployments** via email notifications in GitHub Actions

---

*purrs with CI/CD wisdom* Your deployment pipeline is now LEGENDARY, desu~! 🐾💖
