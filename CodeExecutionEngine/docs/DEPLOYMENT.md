# Deployment Guide

This guide provides comprehensive instructions for deploying the Coding Platform Backend to production environments.

## Deployment Overview

The application can be deployed using various methods:
- Traditional server deployment
- Docker containerization
- Cloud platforms (AWS, Google Cloud, Azure)
- Platform-as-a-Service (Heroku, Vercel)

## Prerequisites

### System Requirements

- **Node.js**: v16.0.0 or higher
- **MongoDB**: v4.4 or higher
- **Redis**: v6.0 or higher (optional, for caching)
- **Nginx**: v1.18 or higher (for reverse proxy)
- **SSL Certificate**: For HTTPS
- **Domain Name**: For production access

### Environment Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Redis
sudo apt install redis-server

# Install Nginx
sudo apt install nginx

# Install PM2 for process management
sudo npm install -g pm2
```

## Traditional Server Deployment

### 1. Server Setup

```bash
# Create application user
sudo useradd -m -s /bin/bash appuser
sudo usermod -aG sudo appuser

# Switch to application user
sudo su - appuser

# Create application directory
mkdir -p /home/appuser/codingplatform
cd /home/appuser/codingplatform
```

### 2. Application Deployment

```bash
# Clone repository
git clone <repository-url> .

# Install dependencies
npm install --production

# Create production environment file
cat > .env << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/codingplatform_prod
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
CLIENT_URL=https://yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EOF

# Create uploads directory
mkdir -p uploads/images uploads/documents

# Set proper permissions
chmod 755 uploads
chmod 755 uploads/images
chmod 755 uploads/documents
```

### 3. Process Management with PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'coding-platform-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 4. Nginx Configuration

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/codingplatform << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=auth:10m rate=5r/m;

    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    location /api/auth {
        limit_req zone=auth burst=10 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        alias /home/appuser/codingplatform/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate max-age=0;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/codingplatform /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 5. SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Docker Deployment

### 1. Dockerfile

```dockerfile
# filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/images uploads/documents

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of uploads directory
RUN chown -R nextjs:nodejs uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
# filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/codingplatform
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - mongo
      - redis
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped
    networks:
      - app-network

  mongo:
    image: mongo:6.0
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    ports:
      - "27017:27017"
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  mongo-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

### 3. Docker Deployment Commands

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3

# Update application
docker-compose pull
docker-compose up -d

# Backup database
docker exec -it $(docker-compose ps -q mongo) mongodump --out /backup

# Restore database
docker exec -it $(docker-compose ps -q mongo) mongorestore /backup/codingplatform
```

## Cloud Deployment

### AWS Deployment

#### 1. EC2 Instance Setup

```bash
# Launch EC2 instance with Ubuntu 20.04
# Configure security groups:
# - HTTP (80) - 0.0.0.0/0
# - HTTPS (443) - 0.0.0.0/0
# - SSH (22) - Your IP
# - Custom TCP (3000) - Security Group

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow traditional deployment steps
```

#### 2. RDS MongoDB Setup

```bash
# Create MongoDB Atlas cluster or use DocumentDB
# Update connection string in environment variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codingplatform
```

#### 3. S3 for File Storage

```javascript
// filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/config/aws.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = (file, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: `uploads/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  return s3.upload(params).promise();
};

module.exports = { uploadToS3 };
```

### Heroku Deployment

#### 1. Heroku Setup

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Add Redis addon
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
```

#### 2. Procfile

```
# filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/Procfile
web: npm start
```

#### 3. Deploy

```bash
# Deploy to Heroku
git push heroku main

# Scale dynos
heroku ps:scale web=2

# View logs
heroku logs --tail
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/.github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
      
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
      env:
        NODE_ENV: test
        MONGODB_URI: mongodb://localhost:27017/codingplatform_test
        JWT_SECRET: test-secret
    
    - name: Run linting
      run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /home/appuser/codingplatform
          git pull origin main
          npm install --production
          pm2 reload ecosystem.config.js
          pm2 save
```

### GitLab CI

```yaml
# filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/.gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  services:
    - mongo:6.0
    - redis:7-alpine
  script:
    - npm ci
    - npm run test
    - npm run lint
  only:
    - main

build:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  script:
    - ssh $DEPLOY_USER@$DEPLOY_HOST "cd /home/appuser/codingplatform && git pull origin main && pm2 reload ecosystem.config.js"
  only:
    - main
```

## Monitoring and Logging

### Application Monitoring

```javascript
// filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/monitoring/monitoring.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware to collect metrics
const collectMetrics = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

module.exports = { collectMetrics };
```

### Health Check Endpoint

```javascript
// filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/routes/health.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    healthCheck.database = dbState === 1 ? 'connected' : 'disconnected';
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    healthCheck.memory = {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100
    };
    
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'ERROR';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});

module.exports = router;
```

## Database Backup and Recovery

### Automated Backup Script

```bash
# filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/scripts/backup.sh
#!/bin/bash

# Configuration
BACKUP_DIR="/home/appuser/backups"
DB_NAME="codingplatform"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --out $BACKUP_FILE

# Compress backup
tar -czf $BACKUP_FILE.tar.gz -C $BACKUP_DIR mongodb_backup_$DATE

# Remove uncompressed backup
rm -rf $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mongodb_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.tar.gz"
```

### Cron Job Setup

```bash
# Add to crontab
crontab -e

# Add line for daily backup at 2 AM
0 2 * * * /home/appuser/codingplatform/scripts/backup.sh
```

## Performance Optimization

### Production Optimizations

```javascript
// filepath: /Users/sarthakchaudhary/Documents/WebD/mern/freelanceProjects/codingPlatformBackend/config/production.js
const compression = require('compression');
const helmet = require('helmet');

const productionConfig = (app) => {
  // Enable compression
  app.use(compression());
  
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false
  }));
  
  // Trust proxy
  app.set('trust proxy', 1);
};

module.exports = productionConfig;
```

## Troubleshooting

### Common Production Issues

#### 1. High Memory Usage
```bash
# Monitor memory usage
pm2 monit

# Restart application if memory usage is high
pm2 restart ecosystem.config.js
```

#### 2. Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection limits
mongo --eval "db.serverStatus().connections"
```

#### 3. SSL Certificate Issues
```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run
```

This deployment guide provides comprehensive instructions for deploying the application to various environments with proper monitoring, security, and backup procedures.