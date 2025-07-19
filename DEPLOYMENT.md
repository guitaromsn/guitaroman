# Deployment Guide: Amanat Al-Kalima ERP System

## Overview
This guide provides step-by-step instructions for deploying the Amanat Al-Kalima ERP system with Azure SQL Database integration.

## Prerequisites

### System Requirements
- **Node.js**: Version 16.0.0 or higher
- **NPM**: Latest stable version
- **Azure SQL Database**: Configured and accessible
- **SSL Certificate**: For HTTPS in production

### Azure SQL Database Setup
1. **Database Server**: `roman-zatca-server.database.windows.net`
2. **Database Name**: `InvoiceMakerPro`
3. **Port**: `1433`
4. **Authentication**: SQL Server Authentication
5. **Encryption**: TLS/SSL enabled

## Installation Steps

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/guitaromsn/guitaroman.git
cd guitaroman

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### 2. Environment Configuration
Edit `.env` file with your specific settings:

```env
# Environment
NODE_ENV=production
PORT=3000

# Azure SQL Database Configuration
DB_USER=rh7
DB_PASSWORD=Whyme7121$
DB_SERVER=roman-zatca-server.database.windows.net
DB_NAME=InvoiceMakerPro
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
DB_CONNECTION_TIMEOUT=30000
DB_REQUEST_TIMEOUT=15000

# JWT Configuration (CHANGE IN PRODUCTION)
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-256-bits
JWT_EXPIRES_IN=24h

# Application Configuration
APP_NAME=Amanat Al-Kalima ERP
LOG_LEVEL=info

# ZATCA Configuration
ZATCA_ENVIRONMENT=production
ZATCA_API_URL=https://gw-fatoora.zatca.gov.sa/e-invoicing/core
```

### 3. Database Migration
```bash
# Run database schema migration
npm run migrate

# Verify database connection
node -e "require('./config/database').dbConnection.healthCheck().then(console.log)"
```

### 4. Security Configuration

#### Generate Secure JWT Secret
```bash
# Generate a secure 256-bit key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Configure Firewall Rules
Ensure your Azure SQL Database allows connections from your deployment server:
1. Open Azure Portal
2. Navigate to your SQL Database
3. Configure firewall rules
4. Add your server's IP address

### 5. Production Deployment

#### Option A: Direct Deployment
```bash
# Build the application
npm run build

# Start in production mode
npm start
```

#### Option B: PM2 Process Manager
```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'amanat-kalima-erp',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Option C: Docker Deployment
```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
EOF

# Create .dockerignore
cat > .dockerignore << EOF
node_modules
npm-debug.log
.env
.git
logs
*.log
EOF

# Build and run
docker build -t amanat-kalima-erp .
docker run -d --name erp-app --env-file .env -p 3000:3000 amanat-kalima-erp
```

## Load Balancer Configuration

### Nginx Configuration
```nginx
upstream erp_backend {
    server 127.0.0.1:3000;
    # Add more servers for load balancing
    # server 127.0.0.1:3001;
    # server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://erp_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        proxy_pass http://erp_backend/health;
        access_log off;
    }
}
```

## Monitoring and Logging

### Health Check Monitoring
```bash
# Setup health check monitoring
curl -f http://localhost:3000/health || exit 1

# Create monitoring script
cat > health-check.sh << EOF
#!/bin/bash
HEALTH_URL="http://localhost:3000/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Health check passed"
else
    echo "$(date): Health check failed with status $RESPONSE"
    # Add alerting logic here
fi
EOF

chmod +x health-check.sh

# Add to crontab for regular monitoring
echo "*/5 * * * * /path/to/health-check.sh >> /var/log/erp-health.log" | crontab -
```

### Log Management
```bash
# Configure log rotation
sudo cat > /etc/logrotate.d/amanat-erp << EOF
/path/to/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 node node
    postrotate
        pm2 reload amanat-kalima-erp
    endscript
}
EOF
```

## Database Backup and Maintenance

### Automated Backup Script
```bash
cat > backup-database.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/amanat-erp"
BACKUP_FILE="$BACKUP_DIR/InvoiceMakerPro_$DATE.bacpac"

mkdir -p $BACKUP_DIR

# Export Azure SQL Database (requires Azure CLI)
az sql db export \
    --resource-group your-resource-group \
    --server roman-zatca-server \
    --name InvoiceMakerPro \
    --storage-key-type StorageAccessKey \
    --storage-key your-storage-key \
    --storage-uri "https://yourstorageaccount.blob.core.windows.net/backups/InvoiceMakerPro_$DATE.bacpac"

echo "$(date): Database backup completed: $BACKUP_FILE"

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.bacpac" -mtime +30 -delete
EOF

chmod +x backup-database.sh

# Schedule daily backups
echo "0 2 * * * /path/to/backup-database.sh >> /var/log/erp-backup.log" | crontab -
```

## Security Checklist

### Pre-deployment Security
- [ ] Change default JWT secret
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall rules for Azure SQL
- [ ] Set up proper user roles and permissions
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set up CORS properly
- [ ] Validate all input parameters
- [ ] Enable SQL Server encryption
- [ ] Use environment variables for sensitive data

### Network Security
- [ ] Configure VPN/Private endpoints for Azure SQL
- [ ] Set up Web Application Firewall (WAF)
- [ ] Enable DDoS protection
- [ ] Configure IP whitelisting
- [ ] Use Azure Key Vault for secrets management

## Performance Optimization

### Database Optimization
```sql
-- Add performance indexes
CREATE INDEX IX_Invoices_CustomerId_Date ON Invoices(CustomerId, InvoiceDate);
CREATE INDEX IX_InvoiceItems_InvoiceId_Item ON InvoiceItems(InvoiceId, InventoryItemId);
CREATE INDEX IX_InventoryTransactions_Date ON InventoryTransactions(CreatedAt);

-- Update statistics
UPDATE STATISTICS Users;
UPDATE STATISTICS Customers;
UPDATE STATISTICS Invoices;
UPDATE STATISTICS InventoryItems;
```

### Application Optimization
```javascript
// Add to server.js for production optimizations
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
}
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Test database connectivity
telnet roman-zatca-server.database.windows.net 1433

# Check firewall rules
az sql server firewall-rule list --resource-group your-rg --server roman-zatca-server

# Test connection with SQL command line
sqlcmd -S roman-zatca-server.database.windows.net -d InvoiceMakerPro -U rh7 -P
```

#### Application Issues
```bash
# Check application logs
tail -f logs/combined.log

# Check PM2 status
pm2 status
pm2 logs amanat-kalima-erp

# Monitor system resources
htop
df -h
free -m
```

#### Performance Issues
```bash
# Monitor database performance
az sql db show-usage --resource-group your-rg --server roman-zatca-server --name InvoiceMakerPro

# Check application metrics
curl http://localhost:3000/health
```

## Maintenance Schedule

### Daily Tasks
- [ ] Check application health
- [ ] Monitor database performance
- [ ] Review error logs
- [ ] Verify backup completion

### Weekly Tasks
- [ ] Update system packages
- [ ] Review security logs
- [ ] Check disk space usage
- [ ] Analyze performance metrics

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review and rotate SSL certificates
- [ ] Audit user access and permissions
- [ ] Performance optimization review

## Support and Maintenance

### Emergency Contacts
- **System Administrator**: [contact info]
- **Database Administrator**: [contact info]
- **Application Developer**: [contact info]

### Escalation Procedures
1. **Level 1**: Application restart, basic troubleshooting
2. **Level 2**: Database connectivity, configuration issues
3. **Level 3**: Code-level debugging, major system issues

### Documentation Updates
Keep this deployment guide updated with any configuration changes, new procedures, or lessons learned during operations.