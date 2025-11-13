# 🐾✨ Vercel Production Deployment Guide ✨🐾

**Last Updated**: 2025-11-12
**Version**: 1.0.0
**Workflow**: `.github/workflows/deploy-vercel.yml`

---

## 📋 Overview

This guide explains how to configure and use the Vercel production deployment workflow for the Neko Defense Dashboard.

### What's Deployed

- **Frontend**: Next.js 14 dashboard (App Router)
- **Platform**: Vercel (serverless, global CDN)
- **Backend Integration**: Unified Gateway (Docker Compose) via environment variables
- **Trigger**: Automatic on push to `main`/`master` branches

---

## 🔐 Required GitHub Secrets

You need to configure **3 required secrets** in your GitHub repository:

### 1. VERCEL_TOKEN

- **Description**: Your Vercel authentication token
- **Where to Get**: https://vercel.com/account/tokens
- **Steps**:
  1. Go to Vercel Dashboard → Account Settings → Tokens
  2. Click "Create Token"
  3. Name: `GitHub Actions - Neko Defense Dashboard`
  4. Scope: `Full Account` (or specific team/project)
  5. Expiration: Set based on security policy (recommend 1 year)
  6. Copy the token (you'll only see it once!)

### 2. VERCEL_ORG_ID

- **Description**: Your Vercel organization ID
- **Where to Get**: Project settings or `.vercel/project.json`
- **Steps**:
  1. **Option A - From Vercel Dashboard**:
     - Go to your Vercel team/account settings
     - Copy the "Team ID" or "Account ID"

  2. **Option B - From Local Project** (RECOMMENDED):
     ```bash
     cd /home/wakibaka/Documents/github/neko-defense-dashboard
     npm install -g vercel  # If not already installed
     vercel link  # Link to your Vercel project
     cat .vercel/project.json
     ```

     - Look for `"orgId": "team_xxxxxxxxx"` or similar
     - Copy the value

### 3. VERCEL_PROJECT_ID

- **Description**: Your Vercel project ID
- **Where to Get**: Project settings or `.vercel/project.json`
- **Steps**:
  1. **Option A - From Vercel Dashboard**:
     - Go to Project Settings → General
     - Scroll to "Project ID"
     - Copy the ID

  2. **Option B - From Local Project** (RECOMMENDED):
     ```bash
     cat .vercel/project.json
     ```

     - Look for `"projectId": "prj_xxxxxxxxx"`
     - Copy the value

### 4. NEXT_PUBLIC_GATEWAY_URL (Optional)

- **Description**: Production unified gateway URL
- **Default**: `http://localhost:3100` (for development)
- **Production**: Update to your production backend URL when ready
- **Example**: `https://neko-defense-gateway.railway.app`

---

## ⚙️ GitHub Secrets Configuration

### Step 1: Navigate to Repository Settings

1. Go to: https://github.com/YOUR_USERNAME/neko-defense-dashboard
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**

### Step 2: Add Each Secret

For each of the 3 required secrets:

1. Click **"New repository secret"**
2. Enter the **Name** exactly as shown:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Paste the **Value** from steps above
4. Click **"Add secret"**

### Step 3: Verify Secrets

After adding all secrets, you should see:

- ✅ VERCEL_TOKEN
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID
- ⚠️ NEXT_PUBLIC_GATEWAY_URL (optional - add when production backend is ready)

---

## 🚀 Deployment Workflow

### Automatic Deployment

The workflow **automatically triggers** on:

- Push to `main` branch
- Push to `master` branch

### Manual Deployment

You can also trigger manually:

1. Go to **Actions** tab in GitHub
2. Select **"🚀 Deploy to Vercel"** workflow
3. Click **"Run workflow"**
4. Select branch: `main` or `master`
5. Click **"Run workflow"** button

---

## 📊 Workflow Steps

The deployment workflow performs these steps:

### 1️⃣ Build & Verify (Job 1)

- ✅ Checkout code
- ✅ Setup Node.js 20
- ✅ Install dependencies (`npm ci`)
- ✅ Pre-deployment validation:
  - Check `app/` directory exists
  - Check `next.config.js` exists
- ✅ Build Next.js application
- ✅ Upload build artifacts

**Duration**: ~3-5 minutes

### 2️⃣ Deploy to Vercel (Job 2)

- ✅ Pull Vercel environment information
- ✅ Build project artifacts with Vercel CLI
- ✅ Deploy to production with `--prebuilt` flag
- ✅ Verify deployment is accessible
- ✅ Display deployment URL

**Duration**: ~2-4 minutes

**Total Deployment Time**: ~5-10 minutes

---

## 🔍 Monitoring Deployments

### GitHub Actions

1. Go to **Actions** tab
2. Click on the latest workflow run
3. View logs for each job:
   - **🏗️ Build Next.js for Vercel**
   - **🚀 Deploy to Vercel**

### Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project
3. View deployments, logs, and analytics

---

## 🌐 Environment Variables

### Build-Time Variables (Configured in Workflow)

These are injected during the Vercel build:

```yaml
NEXT_PUBLIC_GATEWAY_URL: http://localhost:3100
NEXT_PUBLIC_FORENSIC_URL: http://localhost:3100/forensic
NEXT_PUBLIC_WORKER_DEFENSE_URL: http://localhost:3100/worker-defense
NEXT_PUBLIC_FRAME_GENERATOR_URL: http://localhost:3100/frames
NEXT_PUBLIC_LAW_RAG_URL: http://localhost:3100/legal
```

### Production Backend Configuration

When you deploy the unified gateway to production (Railway, Cloud Run, etc.):

1. Get production gateway URL (e.g., `https://neko-defense-gateway.railway.app`)
2. Add GitHub secret: `NEXT_PUBLIC_GATEWAY_URL` = production URL
3. Workflow will automatically use it for all endpoint URLs

**Example**:

```yaml
# With NEXT_PUBLIC_GATEWAY_URL = https://neko-defense-gateway.railway.app
NEXT_PUBLIC_FORENSIC_URL: https://neko-defense-gateway.railway.app/forensic
NEXT_PUBLIC_WORKER_DEFENSE_URL: https://neko-defense-gateway.railway.app/worker-defense
# ... etc
```

---

## 🧪 Testing the Deployment

### Step 1: First Deployment

After configuring secrets, trigger a manual deployment:

```bash
# From local repository
git checkout main
git pull origin main
git push origin main  # Or use GitHub Actions UI
```

### Step 2: Monitor Workflow

1. Go to Actions tab
2. Watch the workflow run
3. Check for any errors in logs

### Step 3: Verify Deployment

1. Get deployment URL from workflow logs (or Vercel dashboard)
2. Visit the URL in browser
3. Check:
   - ✅ Dashboard loads successfully
   - ✅ Six personalities visible
   - ✅ No console errors
   - ✅ API calls to backend working (if backend is deployed)

### Step 4: Production Checklist

- [ ] Vercel deployment accessible
- [ ] Dashboard UI renders correctly
- [ ] Six personalities displayed
- [ ] Backend API integration working (if production backend exists)
- [ ] No critical console errors
- [ ] Performance acceptable (check Vercel analytics)
- [ ] Custom domain configured (if desired)

---

## 🔧 Troubleshooting

### Error: "VERCEL_TOKEN not set"

**Cause**: Missing GitHub secret
**Fix**:

1. Go to GitHub Settings → Secrets → Actions
2. Add `VERCEL_TOKEN` secret with your Vercel token
3. Re-run workflow

### Error: "VERCEL_ORG_ID or VERCEL_PROJECT_ID not set"

**Cause**: Missing GitHub secrets
**Fix**:

1. Run `vercel link` locally to get IDs
2. Check `.vercel/project.json` for values
3. Add both secrets to GitHub
4. Re-run workflow

### Error: Build Failed

**Cause**: TypeScript errors or linting issues
**Fix**:

1. Check workflow logs for specific error
2. Run locally: `npm run build`
3. Fix errors
4. Commit and push

### Error: Deployment 404 or Blank Page

**Cause**: Incorrect build configuration or routing issue
**Fix**:

1. Check Vercel deployment logs
2. Verify `next.config.js` is correct
3. Check `app/` directory structure
4. Test locally: `npm run dev`

### Backend Integration Not Working

**Cause**: Backend not deployed or CORS issues
**Fix**:

1. Verify unified gateway is deployed and accessible
2. Update `NEXT_PUBLIC_GATEWAY_URL` to production URL
3. Check CORS configuration in gateway allows Vercel domain
4. Check browser console for specific error

---

## 📝 Quick Start Checklist

Use this checklist to set up Vercel deployment from scratch:

- [ ] **Step 1**: Get Vercel credentials
  - [ ] Create Vercel account (if needed)
  - [ ] Generate VERCEL_TOKEN
  - [ ] Run `vercel link` locally
  - [ ] Get VERCEL_ORG_ID from `.vercel/project.json`
  - [ ] Get VERCEL_PROJECT_ID from `.vercel/project.json`

- [ ] **Step 2**: Configure GitHub secrets
  - [ ] Add VERCEL_TOKEN
  - [ ] Add VERCEL_ORG_ID
  - [ ] Add VERCEL_PROJECT_ID
  - [ ] (Optional) Add NEXT_PUBLIC_GATEWAY_URL for production

- [ ] **Step 3**: Test deployment
  - [ ] Push to main branch OR trigger manually
  - [ ] Monitor workflow in Actions tab
  - [ ] Verify deployment URL works
  - [ ] Check dashboard loads correctly

- [ ] **Step 4**: Production configuration
  - [ ] Configure custom domain (optional)
  - [ ] Set up production backend URL
  - [ ] Update NEXT_PUBLIC_GATEWAY_URL secret
  - [ ] Test full-stack integration

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **GitHub Actions**: https://github.com/YOUR_USERNAME/neko-defense-dashboard/actions
- **Workflow File**: `.github/workflows/deploy-vercel.yml`

---

## 🐾 Next Steps

1. **Get Vercel Credentials**: Follow "Required GitHub Secrets" section
2. **Configure Secrets**: Add to GitHub repository settings
3. **Test Deployment**: Push to main or trigger manually
4. **Deploy Backend**: Use Docker Compose (RULE 55) on Railway/Cloud Run
5. **Update Gateway URL**: Point frontend to production backend
6. **Monitor**: Check Vercel analytics and logs

---

## 📞 Support

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Check Vercel deployment logs in dashboard
3. Review this guide's troubleshooting section
4. Check DEPLOYMENT.md for backend deployment issues

---

🐾✨ **Generated with Claude Code by Neko-Arc**
**Six-Personality Collaborative Deployment**
