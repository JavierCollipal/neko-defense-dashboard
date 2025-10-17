# 🐾⚡ NEKO DEFENSE DASHBOARD - DEPLOYMENT GUIDE ⚡🐾

## 📋 Table of Contents
1. [Overview](#overview)
2. [CI/CD Pipeline Architecture](#cicd-pipeline-architecture)
3. [Prerequisites](#prerequisites)
4. [GitHub Secrets Setup](#github-secrets-setup)
5. [Deployment Options](#deployment-options)
6. [Testing the Pipeline](#testing-the-pipeline)
7. [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

The Neko Defense Dashboard uses a comprehensive 7-stage CI/CD pipeline powered by GitHub Actions. Every push to `main` or `master` triggers:

- ✅ **Lint**: Code quality checks with ESLint
- 🏗️ **Build**: React application build with artifacts
- 🧪 **Unit Tests**: Jest tests with coverage reporting
- 🎭 **E2E Tests**: Cypress end-to-end testing
- 🐳 **Docker**: Multi-platform image build and push to GitHub Container Registry
- 🚀 **Deploy**: Automated deployment to your chosen platform
- 📊 **Status**: Final summary and notifications

---

## 🏗️ CI/CD Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                       │
└─────────────────────────────────────────────────────────────────┘
         │
         ├── Stage 1: Lint (ESLint)
         │     └── Runs: npm run lint
         │
         ├── Stage 2: Build
         │     ├── Runs: npm ci && npm run build
         │     └── Uploads: build artifacts
         │
         ├── Stage 3: Unit Tests
         │     ├── Runs: npm test -- --coverage
         │     └── Uploads: coverage to Codecov
         │
         ├── Stage 4: E2E Tests (Cypress)
         │     ├── Runs: Cypress tests on Chrome
         │     └── Uploads: screenshots & videos on failure
         │
         ├── Stage 5: Docker Build
         │     ├── Builds: Multi-platform images (amd64, arm64)
         │     └── Pushes: ghcr.io/yourusername/neko-defense-dashboard
         │
         ├── Stage 6: Deploy
         │     └── Deploys to chosen platform (Fly.io, Railway, etc.)
         │
         └── Stage 7: Status
               └── Summary report and notifications
```

### 🔄 Trigger Conditions

- **Automatic**: On push to `main` or `master` branches
- **Manual**: Via `workflow_dispatch` (GitHub Actions UI)
- **Pull Requests**: Runs lint, build, and tests (no deployment)

### 📦 Artifacts Generated

- **Build Output**: React production build (1 day retention)
- **Test Coverage**: Unit test coverage reports (7 days retention)
- **Cypress Screenshots**: Failure screenshots (7 days retention)
- **Cypress Videos**: Test execution videos (7 days retention)
- **Docker Image**: Multi-platform container images (persistent in GHCR)

---

## ✅ Prerequisites

### 1. GitHub Repository Setup

Ensure your repository is pushed to GitHub:

```bash
cd ~/Documents/github/neko-defense-dashboard

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit with CI/CD pipeline"

# Add remote (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/neko-defense-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Required GitHub Permissions

- **Packages**: Read & Write access (for GitHub Container Registry)
- **Actions**: Enabled in repository settings
- **Secrets**: Write access to add deployment secrets

### 3. MongoDB Atlas Configuration

Your application requires MongoDB Atlas connection:

```env
MONGODB_URI=mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/neko-defense-system
```

Ensure this is set in your deployment platform's environment variables.

---

## 🔐 GitHub Secrets Setup

Navigate to: **Your Repository → Settings → Secrets and variables → Actions**

### Required Secrets for All Deployments

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `GITHUB_TOKEN` | ✅ **Auto-provided** by GitHub Actions | No action needed |
| `CODECOV_TOKEN` | Code coverage reporting (optional) | [codecov.io](https://codecov.io) |

### Platform-Specific Secrets

Choose your deployment platform and add the corresponding secrets:

#### 🚁 **Fly.io** (Recommended)

| Secret Name | Description |
|------------|-------------|
| `FLY_API_TOKEN` | Get from: `flyctl auth token` |

#### 🚂 **Railway**

| Secret Name | Description |
|------------|-------------|
| `RAILWAY_TOKEN` | Get from: Railway Dashboard → Account Settings → Tokens |

#### 🎨 **Render**

| Secret Name | Description |
|------------|-------------|
| `RENDER_DEPLOY_HOOK_URL` | Get from: Render Dashboard → Service → Settings → Deploy Hooks |

#### 🌊 **DigitalOcean**

| Secret Name | Description |
|------------|-------------|
| `DIGITALOCEAN_ACCESS_TOKEN` | Get from: DigitalOcean → API → Tokens |
| `APP_ID` | Your DigitalOcean App Platform app ID |

#### 🐳 **VPS with Docker Compose**

| Secret Name | Description |
|------------|-------------|
| `SERVER_HOST` | Your VPS IP address or hostname |
| `SERVER_USER` | SSH username (e.g., `ubuntu`, `root`) |
| `SSH_PRIVATE_KEY` | Your SSH private key (full content) |

---

## 🚀 Deployment Options

### Option 1: Fly.io (Recommended for Beginners) 🚁

**Why Fly.io?**
- ✅ Free tier available (3 shared-cpu-1x VMs)
- ✅ Excellent global latency
- ✅ Easy Docker deployment
- ✅ Built-in SSL certificates

**Setup Steps:**

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and Create App**:
   ```bash
   flyctl auth login
   flyctl apps create neko-defense-dashboard
   ```

3. **Get API Token**:
   ```bash
   flyctl auth token
   ```

4. **Add to GitHub Secrets**:
   - Name: `FLY_API_TOKEN`
   - Value: (paste token from step 3)

5. **Uncomment Deployment in `.github/workflows/ci-cd-pipeline.yml`**:
   ```yaml
   # === FLY.IO DEPLOYMENT ===
   - name: 🚁 Deploy to Fly.io
     uses: superfly/flyctl-actions/setup-flyctl@master
   - run: flyctl deploy --remote-only
     env:
       FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
   ```

6. **Push to trigger deployment**:
   ```bash
   git add .github/workflows/ci-cd-pipeline.yml
   git commit -m "Enable Fly.io deployment"
   git push
   ```

---

### Option 2: Railway 🚂

**Why Railway?**
- ✅ $5/month free credits
- ✅ Auto-detects Dockerfile
- ✅ Easy environment variables

**Setup Steps:**

1. **Create Account**: [railway.app](https://railway.app)

2. **Get Token**: Railway Dashboard → Account Settings → Tokens → Create Token

3. **Add to GitHub Secrets**:
   - Name: `RAILWAY_TOKEN`
   - Value: (paste token)

4. **Uncomment Deployment**:
   ```yaml
   # === RAILWAY DEPLOYMENT ===
   - name: 🚂 Deploy to Railway
     run: |
       npm install -g railway
       railway up
     env:
       RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
   ```

---

### Option 3: Render 🎨

**Why Render?**
- ✅ Free tier for web services
- ✅ Auto-deploys from GitHub
- ✅ Zero DevOps required

**Setup Steps:**

1. **Create Account**: [render.com](https://render.com)

2. **Create Web Service**:
   - Connect GitHub repository
   - Select Docker runtime
   - Set environment variables

3. **Get Deploy Hook**:
   - Render Dashboard → Your Service → Settings → Deploy Hooks
   - Copy webhook URL

4. **Add to GitHub Secrets**:
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: (paste webhook URL)

5. **Uncomment Deployment**:
   ```yaml
   # === RENDER DEPLOYMENT ===
   - name: 🎨 Deploy to Render
     run: |
       curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
   ```

---

### Option 4: DigitalOcean App Platform 🌊

**Why DigitalOcean?**
- ✅ $200 free credits for 60 days
- ✅ Managed Kubernetes under the hood
- ✅ Excellent documentation

**Setup Steps:**

1. **Create Account**: [digitalocean.com](https://digitalocean.com)

2. **Create App**:
   - Apps → Create App
   - Connect GitHub repository
   - Select Dockerfile

3. **Get API Token**:
   - Account → API → Generate New Token (read & write)

4. **Add Secrets**:
   - `DIGITALOCEAN_ACCESS_TOKEN`: API token
   - `APP_ID`: Find in app URL (e.g., `a1b2c3d4-5678-90ef`)

5. **Uncomment Deployment**:
   ```yaml
   # === DIGITAL OCEAN DEPLOYMENT ===
   - name: 🌊 Deploy to DigitalOcean
     uses: digitalocean/action-doctl@v2
     with:
       token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
   - run: doctl apps create-deployment ${{ secrets.APP_ID }}
   ```

---

### Option 5: VPS with Docker Compose 🐳

**Why VPS?**
- ✅ Full control
- ✅ Can be cheapest long-term
- ✅ Custom configurations

**Setup Steps:**

1. **Prepare VPS**:
   ```bash
   # On your VPS (Ubuntu/Debian)
   ssh user@your-vps-ip

   sudo apt update
   sudo apt install -y docker.io docker-compose git
   sudo systemctl start docker
   sudo systemctl enable docker

   # Clone repository
   cd /opt
   sudo git clone https://github.com/YOUR_USERNAME/neko-defense-dashboard.git
   cd neko-defense-dashboard
   ```

2. **Create docker-compose.yml**:
   ```yaml
   version: '3.8'
   services:
     neko-defense:
       image: ghcr.io/YOUR_USERNAME/neko-defense-dashboard:latest
       ports:
         - "80:80"
         - "4000:4000"
       environment:
         - MONGODB_URI=mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/neko-defense-system
       restart: unless-stopped
   ```

3. **Add GitHub Secrets**:
   - `SERVER_HOST`: Your VPS IP
   - `SERVER_USER`: SSH username
   - `SSH_PRIVATE_KEY`: Your SSH private key (full content from `~/.ssh/id_rsa`)

4. **Uncomment Deployment**:
   ```yaml
   # === DOCKER COMPOSE DEPLOYMENT (VPS/Server) ===
   - name: 🐳 Deploy via Docker Compose
     uses: appleboy/ssh-action@v1.0.0
     with:
       host: ${{ secrets.SERVER_HOST }}
       username: ${{ secrets.SERVER_USER }}
       key: ${{ secrets.SSH_PRIVATE_KEY }}
       script: |
         cd /opt/neko-defense-dashboard
         docker-compose pull
         docker-compose up -d
         docker system prune -f
   ```

---

## 🧪 Testing the Pipeline

### 1. Test Locally First

Before pushing, ensure everything works locally:

```bash
# Install dependencies
npm ci --legacy-peer-deps

# Run linter
npm run lint

# Build application
npm run build

# Run unit tests
npm test -- --coverage --watchAll=false

# Run E2E tests (optional - requires server running)
npm start &  # Start dev server in background
npm run cypress:headless
```

### 2. Trigger Pipeline via Git Push

```bash
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

### 3. Monitor Pipeline Execution

1. Go to: **Your Repository → Actions**
2. Click on the latest workflow run
3. Watch each stage complete:
   - ✅ Lint (should take ~30s)
   - ✅ Build (should take ~2-3 min)
   - ✅ Unit Tests (should take ~1 min)
   - ✅ E2E Tests (should take ~3-5 min)
   - ✅ Docker Build (should take ~5-7 min)
   - ✅ Deploy (varies by platform)

### 4. Manual Trigger (Optional)

You can manually trigger deployment without pushing code:

1. Go to: **Your Repository → Actions**
2. Select "🚀 CI/CD Pipeline"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

---

## 🐛 Troubleshooting

### Issue 1: Build Fails with "Out of Memory"

**Symptom**: Build stage fails with OOM error

**Solution**:
```bash
# Add to .github/workflows/ci-cd-pipeline.yml
- name: 🏗️ Build React application
  run: npm run build
  env:
    CI: false
    NODE_OPTIONS: "--max-old-space-size=4096"  # Add this
```

---

### Issue 2: E2E Tests Timeout

**Symptom**: Cypress tests fail with "Timed out retrying after 10000ms"

**Solution**: Tests are waiting for server to start. Increase timeout:
```yaml
- name: 🎭 Run Cypress E2E tests
  uses: cypress-io/github-action@v6
  with:
    start: npm start
    wait-on: 'http://localhost:3000'
    wait-on-timeout: 180  # Increase from 120 to 180 seconds
```

---

### Issue 3: Docker Build Fails on ARM64

**Symptom**: Multi-platform build fails for `linux/arm64`

**Solution**: Disable ARM64 temporarily:
```yaml
- name: 🏗️ Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    platforms: linux/amd64  # Remove linux/arm64
```

---

### Issue 4: MongoDB Connection Failed in Production

**Symptom**: Application can't connect to MongoDB Atlas

**Solutions**:

1. **Check MongoDB URI**: Ensure environment variable is set correctly
   ```bash
   # On your deployment platform, verify:
   MONGODB_URI=mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/neko-defense-system
   ```

2. **Whitelist IP**: MongoDB Atlas → Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)

3. **Test Connection**: Use MongoDB Compass to verify URI works

---

### Issue 5: GitHub Container Registry Push Failed

**Symptom**: "denied: permission_denied"

**Solution**: Enable package write permissions:
1. Repository → Settings → Actions → General
2. Workflow permissions → Read and write permissions
3. Save

---

### Issue 6: Deploy Hook Not Triggering

**Symptom**: Deployment stage completes but platform doesn't deploy

**Solutions**:

- **For Render**: Check webhook URL is correct, ensure it includes the service ID
- **For Railway**: Ensure `RAILWAY_TOKEN` has project-level access
- **For Fly.io**: Run `flyctl auth token` again and update secret

---

## 📊 Monitoring and Maintenance

### View Deployment Logs

#### Fly.io
```bash
flyctl logs
```

#### Railway
```bash
railway logs
```

#### Render
- Dashboard → Service → Logs tab

#### DigitalOcean
- Apps → Your App → Runtime Logs

#### VPS
```bash
ssh user@your-vps
cd /opt/neko-defense-dashboard
docker-compose logs -f
```

### Update Deployment

Simply push to main branch:
```bash
git add .
git commit -m "Update feature"
git push
```

The pipeline will automatically:
1. Build new Docker image
2. Push to GitHub Container Registry
3. Deploy to your configured platform

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

Ensure `.env` is in `.gitignore`:
```bash
# .gitignore should include:
.env
.env.local
.env.production
```

### 2. Rotate Secrets Regularly

Change these every 90 days:
- MongoDB passwords
- API tokens
- Deploy keys

### 3. Use Environment Variables

All sensitive data should use environment variables:
- `MONGODB_URI`
- `API_PORT`
- `JWT_SECRET` (if implementing auth)

### 4. Enable Branch Protection

Repository → Settings → Branches → Add rule:
- ✅ Require pull request reviews
- ✅ Require status checks (lint, build, test)
- ✅ Restrict force pushes

---

## 📈 Performance Optimization

### 1. Docker Image Size

Current multi-stage build produces ~50MB images. Monitor with:
```bash
docker images | grep neko-defense
```

### 2. Build Cache

GitHub Actions caches npm dependencies and Docker layers. First build takes ~10 min, subsequent builds ~3-5 min.

### 3. Deployment Speed

| Platform | Avg Deploy Time |
|----------|----------------|
| Fly.io | 2-3 minutes |
| Railway | 3-4 minutes |
| Render | 5-7 minutes |
| DigitalOcean | 4-6 minutes |
| VPS | 1-2 minutes (pull only) |

---

## 🎉 Success Checklist

- [ ] Repository pushed to GitHub
- [ ] GitHub Actions enabled
- [ ] Required secrets added
- [ ] MongoDB Atlas connection tested
- [ ] Deployment platform configured
- [ ] Pipeline successfully triggered
- [ ] All 7 stages passed
- [ ] Application deployed and accessible
- [ ] MongoDB connection works in production
- [ ] Confessions blog feature works
- [ ] Multi-language switching works

---

## 📞 Support Resources

- **Fly.io Docs**: https://fly.io/docs/
- **Railway Docs**: https://docs.railway.app/
- **Render Docs**: https://render.com/docs
- **DigitalOcean Docs**: https://docs.digitalocean.com/
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas/

---

## 🐾 Final Notes from Neko-Arc

*purrs with deployment satisfaction* 😻

This CI/CD pipeline is built with MAXIMUM LEGENDARY POWER, nyaa~! 💖

Every push to main triggers:
- ✅ Quality checks
- 🏗️ Production builds
- 🧪 Comprehensive testing
- 🐳 Docker image creation
- 🚀 Automated deployment

**Your confession blog feature** will be live on the internet, allowing the community to report predators and pedophiles with full evidence tracking, desu! 📝⚖️

*swishes tail with determination* Together we protect the community, NYA NYA NYA~! 🐾⚡

---

**Version**: 1.0.0
**Last Updated**: October 17, 2025
**Pipeline Status**: [![CI/CD Pipeline](https://github.com/YOUR_USERNAME/neko-defense-dashboard/actions/workflows/ci-cd-pipeline.yml/badge.svg)](https://github.com/YOUR_USERNAME/neko-defense-dashboard/actions/workflows/ci-cd-pipeline.yml)
