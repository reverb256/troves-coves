# Quick Deployment Guide - trovesandcoves.ca

## Option 1: Automated GitHub Pages Deployment

Run the automated script:
```bash
./deploy-github-pages.sh
```

This script will:
- Create the GitHub repository
- Deploy the Canadian jewellery demo
- Configure custom domain settings
- Set up proper Canadian spelling throughout

## Option 2: Manual DNS & GitHub Setup

### DNS Configuration (15 minutes)

1. **Register domain**: Purchase trovesandcoves.ca from any Canadian registrar
2. **Point to Cloudflare**: Change nameservers to:
   - alma.ns.cloudflare.com
   - chad.ns.cloudflare.com
3. **Add DNS records in Cloudflare**:
   ```
   A @ 192.0.2.1 (Proxied)
   CNAME demo yourusername.github.io (Proxied)
   ```

### GitHub Pages Setup (10 minutes)

1. **Create repository**: `troves-coves-demo` (must be public)
2. **Upload files**:
   - Copy static-demo.html as index.html
   - Add CNAME file with: demo.trovesandcoves.ca
3. **Enable Pages**: Settings → Pages → Deploy from main branch
4. **Add custom domain**: demo.trovesandcoves.ca

### Cloudflare Worker Deployment (10 minutes)

1. **Create worker**: Use code from cloudflare-fallback-config.js
2. **Update origins**:
   ```javascript
   const primaryOrigin = 'https://your-repl-url.replit.app';
   const fallbackOrigin = 'https://yourusername.github.io/troves-coves-demo';
   ```
3. **Add routes**:
   - trovesandcoves.ca/*
   - demo.trovesandcoves.ca/*

## Testing Checklist

- [ ] Primary domain loads full platform
- [ ] Demo subdomain loads GitHub Pages
- [ ] Canadian spelling visible throughout
- [ ] Fallback works when primary is down
- [ ] Mobile responsive design
- [ ] SSL certificates active

## Timeline
- DNS propagation: 24-48 hours
- GitHub Pages deployment: 5-10 minutes
- Cloudflare worker activation: Immediate
- Full system operational: 1-2 days maximum

Your hybrid deployment provides enterprise reliability with zero hosting costs beyond domain registration.