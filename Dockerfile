# 🐾✨ NEKO DEFENSE DASHBOARD - Multi-Stage Docker Build ✨🐾
# Production-ready React application with nginx serving, nyaa~!

# ═══════════════════════════════════════════════════════════
# STAGE 1: BUILD STAGE
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency caching
COPY package*.json ./

# Install dependencies with clean install for reproducible builds
RUN npm ci --legacy-peer-deps && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the React application for production
RUN npm run build

# ═══════════════════════════════════════════════════════════
# STAGE 2: PRODUCTION STAGE
# ═══════════════════════════════════════════════════════════
FROM nginx:alpine

# Install nodejs for the backend server
RUN apk add --no-cache nodejs npm

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy backend server
COPY --from=builder /app/server /app/server
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Create non-root user for security
RUN addgroup -g 1001 -S nekousergroup && \
    adduser -S nekouser -u 1001 -G nekousergroup && \
    chown -R nekouser:nekousergroup /app && \
    chown -R nekouser:nekousergroup /usr/share/nginx/html

# Expose ports
# 80 for nginx (React frontend)
# 4000 for Express backend (GraphQL API)
EXPOSE 80 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Create startup script
RUN echo '#!/bin/sh' > /app/startup.sh && \
    echo 'echo "🐾 Starting Neko Defense Dashboard, nyaa~!"' >> /app/startup.sh && \
    echo 'export API_PORT=4000' >> /app/startup.sh && \
    echo 'cd /app && node server/index.js &' >> /app/startup.sh && \
    echo 'nginx -g "daemon off;"' >> /app/startup.sh && \
    chmod +x /app/startup.sh

# Start both backend and nginx
CMD ["/app/startup.sh"]
