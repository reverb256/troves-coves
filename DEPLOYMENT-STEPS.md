# Step-by-Step Deployment Guide

## Phase 1: Domain Registration & DNS Setup

### Step 1: Register trovesandcoves.ca
1. Go to a Canadian registrar (Namecheap.ca, GoDaddy.ca, or Web.com)
2. Search for "trovesandcoves.ca"
3. Complete registration with your business information
4. Enable domain privacy protection

### Step 2: Point Domain to Cloudflare
1. Log into your domain registrar
2. Go to Domain Management → Nameservers
3. Change nameservers to Cloudflare:
   ```
   alma.ns.cloudflare.com
   chad.ns.cloudflare.com
   ```
4. Save changes (DNS propagation takes 24-48 hours)

### Step 3: Configure Cloudflare DNS
1. Log into Cloudflare dashboard
2. Add site: trovesandcoves.ca
3. Select Free plan
4. Add DNS records:

**A Record (Primary Domain)**
```
Type: A
Name: @
Content: 192.0.2.1 (placeholder - will be handled by Worker)
TTL: Auto
Proxy: ☑️ Proxied (orange cloud)
```

**CNAME Record (Demo Subdomain)**
```
Type: CNAME
Name: demo
Content: username.github.io
TTL: Auto
Proxy: ☑️ Proxied (orange cloud)
```

### Step 4: Deploy Cloudflare Worker
1. In Cloudflare dashboard, go to Workers & Pages
2. Create Worker → Create Service
3. Name: `troves-coves-fallback`
4. Copy the worker code from `cloudflare-fallback-config.js`
5. Update these variables in the worker:
   ```javascript
   const primaryOrigin = 'https://your-repl-name.replit.app';
   const fallbackOrigin = 'https://username.github.io/troves-coves-demo';
   ```
6. Save and Deploy

### Step 5: Configure Worker Routes
1. Go to Website → trovesandcoves.ca → Workers Routes
2. Add routes:
   ```
   trovesandcoves.ca/*
   demo.trovesandcoves.ca/*
   ```
3. Assign worker: troves-coves-fallback

## Phase 2: GitHub Pages Setup

### Step 1: Create GitHub Repository
1. Go to GitHub.com
2. Create new repository:
   - Repository name: `troves-coves-demo`
   - Description: `Static demo for Troves & Coves Canadian jewellery`
   - Visibility: **Public** (required for free Pages)
   - Initialize with README: ☑️

### Step 2: Deploy Static Demo
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/troves-coves-demo.git
   cd troves-coves-demo
   ```

2. Copy your static demo file:
   ```bash
   cp /path/to/static-demo.html index.html
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Deploy Canadian jewellery demo"
   git push origin main
   ```

### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Scroll to Pages section
3. Configure:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. Save

### Step 4: Configure Custom Domain
1. In Pages settings, add custom domain: `demo.trovesandcoves.ca`
2. Create CNAME file in repository:
   ```bash
   echo "demo.trovesandcoves.ca" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push origin main
   ```

## Phase 3: Replit Platform Setup

### Step 1: Update Environment Variables
Add these to your Replit secrets:
```
DOMAIN_NAME=trovesandcoves.ca
FALLBACK_DOMAIN=demo.trovesandcoves.ca
CLOUDFLARE_WORKER_URL=https://troves-coves-fallback.yourusername.workers.dev
```

### Step 2: Deploy Your Replit App
1. Click "Deploy" button in Replit
2. Choose deployment type (Autoscale recommended)
3. Configure custom domain: trovesandcoves.ca
4. Enable HTTPS

### Step 3: Update Worker Configuration
Once your Replit app is deployed, update the worker:
1. Get your Replit deployment URL
2. Update worker code:
   ```javascript
   const primaryOrigin = 'https://your-actual-replit-url.replit.app';
   ```
3. Redeploy worker

## Phase 4: Testing & Verification

### DNS Propagation Check
1. Use tools like whatsmydns.net
2. Check A record for trovesandcoves.ca
3. Check CNAME record for demo.trovesandcoves.ca
4. Wait for global propagation (up to 48 hours)

### Functionality Tests
1. **Primary domain test**: Visit https://trovesandcoves.ca
   - Should load full Replit platform
   - Test shopping cart, product pages
   - Verify Canadian spelling throughout

2. **Fallback test**: 
   - Temporarily stop Replit deployment
   - Visit https://trovesandcoves.ca
   - Should automatically redirect to GitHub Pages demo
   - Verify static content loads properly

3. **Demo subdomain test**: Visit https://demo.trovesandcoves.ca
   - Should load GitHub Pages directly
   - Verify custom domain works
   - Check SSL certificate

### Performance Verification
1. Test loading speeds from different locations
2. Verify Cloudflare caching is active
3. Check mobile responsiveness
4. Test across different browsers

## Phase 5: Ongoing Management

### Content Updates
- **Replit platform**: Deploy through Replit interface
- **GitHub Pages demo**: Push changes to main branch
- **Worker logic**: Update through Cloudflare dashboard

### Monitoring
- Cloudflare Analytics for traffic patterns
- GitHub Pages usage in repository insights
- Replit deployment logs for primary platform

### Backup Strategy
- GitHub repository serves as static backup
- Cloudflare worker provides automatic failover
- Zero downtime during updates or maintenance

## Troubleshooting Common Issues

### Domain Not Resolving
- Check nameserver configuration
- Verify DNS records in Cloudflare
- Allow 24-48 hours for propagation

### GitHub Pages Not Loading
- Ensure repository is public
- Check CNAME file is present
- Verify custom domain in repository settings

### Worker Not Triggering
- Check worker routes configuration
- Verify worker code has correct origins
- Test worker directly via workers.dev URL

### SSL Certificate Issues
- Cloudflare provides automatic SSL
- GitHub Pages SSL may take time to provision
- Check certificate status in both dashboards

This deployment strategy provides enterprise-level reliability with zero hosting costs beyond domain registration, while maintaining your Canadian market focus and professional presentation.