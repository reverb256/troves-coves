# Deployment Guide - Troves and Coves

Complete deployment instructions for the Troves and Coves e-commerce platform.

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured (optional)
- [ ] Application builds without errors (`npm run build`)
- [ ] Application runs locally (`npm run dev`)

### 2. Performance Verification
- [ ] All pages load under 3 seconds
- [ ] Images optimized and compressed
- [ ] Cart functionality working
- [ ] Contact form submissions working
- [ ] Etsy links redirecting properly

### 3. SEO & Content
- [ ] All pages have proper meta titles and descriptions
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Favicon files present
- [ ] Structured data markup implemented

## Cloudflare Deployment (Recommended)

### Step 1: Prepare Build
```bash
npm run build
```

### Step 2: Configure Cloudflare
1. Create Cloudflare account
2. Add domain to Cloudflare
3. Update nameservers
4. Enable Cloudflare Pages

### Step 3: Deploy to Cloudflare Pages
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Step 4: Configure Environment Variables
In Cloudflare Pages dashboard:
- `NODE_ENV=production`
- `STRIPE_SECRET_KEY` (if using payments)
- `VITE_STRIPE_PUBLIC_KEY` (if using payments)

### Step 5: Enable Cloudflare Features
- **Caching**: Set cache TTL for static assets
- **Minification**: Enable CSS, JS, HTML minification
- **Compression**: Enable Gzip/Brotli
- **Image Optimization**: Enable Polish

## Alternative Deployment Options

### Replit Deployment
1. Click "Deploy" in Replit dashboard
2. Configure custom domain (optional)
3. Monitor deployment status

### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

### Netlify Deployment
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

## Post-Deployment Configuration

### 1. Domain Setup
- Configure custom domain
- Enable SSL/TLS certificate
- Set up domain redirects (www to non-www)

### 2. Performance Monitoring
- Set up analytics tracking
- Configure uptime monitoring
- Enable error logging

### 3. Security Configuration
- Enable HTTPS enforcement
- Configure security headers
- Set up rate limiting

### 4. SEO Setup
- Submit sitemap to Google Search Console
- Verify domain ownership
- Set up Google Analytics

## Production Environment Variables

### Required for Full Functionality
```env
NODE_ENV=production
```

### Optional Integrations
```env
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# AI Features (if enabled)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
```

## Monitoring & Maintenance

### Performance Metrics to Track
- Page load times
- Core Web Vitals
- Cart conversion rates
- Contact form submissions
- Etsy click-through rates

### Regular Maintenance Tasks
- Update dependencies monthly
- Monitor security vulnerabilities
- Review analytics data
- Update product catalog
- Backup contact form submissions

## Troubleshooting Common Issues

### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variable Issues
- Verify all required variables are set
- Check variable naming (VITE_ prefix for client-side)
- Restart deployment after changes

### Performance Issues
- Enable Cloudflare caching
- Optimize images
- Enable compression
- Use CDN for static assets

### SSL Certificate Issues
- Verify domain DNS configuration
- Check Cloudflare SSL settings
- Allow 24-48 hours for propagation

## Rollback Procedure

### Cloudflare Pages
1. Go to Deployments tab
2. Select previous working deployment
3. Click "Rollback to this deployment"

### General Rollback
1. Revert to previous Git commit
2. Rebuild and redeploy
3. Verify functionality

## Support & Maintenance

### Technical Support
- Monitor deployment logs
- Set up error alerting
- Document any custom configurations

### Business Continuity
- Ensure Etsy store remains primary checkout
- Maintain social media link accuracy
- Keep contact information updated

## Security Best Practices

### Code Security
- No sensitive data in client-side code
- Environment variables properly configured
- Regular dependency updates

### Infrastructure Security
- HTTPS enforcement
- Security headers configured
- Rate limiting enabled
- Regular security audits

---

*This deployment guide ensures a smooth transition to production for the Troves and Coves platform.*