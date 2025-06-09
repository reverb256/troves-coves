# Troves and Coves - GitHub Pages + Cloudflare Deployment

## Architecture Overview

The platform is now optimized for **GitHub Pages static hosting** with **Cloudflare Workers orchestration** to maintain all advanced features without any functionality loss.

### Deployment Strategy
- **Static Content**: GitHub Pages (trovesandcoves.ca)
- **Dynamic Features**: Cloudflare Workers (api.trovesandcoves.ca)
- **Performance**: Multi-tier CDN with edge computing
- **Zero Functionality Loss**: All features preserved through Cloudflare orchestration

## Features Maintained Through Cloudflare

### Core E-commerce Features ✅
- Product catalog and search
- Shopping cart with session persistence
- Real-time inventory management
- Secure checkout process

### Advanced AI Features ✅
- AI-powered product recommendations
- Market trend analysis
- Customer behavior insights
- Dynamic pricing optimization

### Performance Features ✅
- Global CDN distribution
- Edge caching strategies
- Image optimization
- Compression and minification

### Security Features ✅
- DDoS protection
- SSL/TLS encryption
- Rate limiting
- Security headers

## Deployment Instructions

### 1. Build for GitHub Pages
```bash
# Build optimized static site
npm run build

# The build output goes to dist/public/
# Copy contents to docs/ for GitHub Pages
```

### 2. Deploy Cloudflare Worker
```bash
# Deploy the API orchestration worker
wrangler deploy cloudflare-worker.js --name troves-coves-api

# Configure routes for API endpoints
# api.trovesandcoves.ca/* → Cloudflare Worker
# trovesandcoves.ca/api/* → Cloudflare Worker
```

### 3. Configure DNS
- **Main Domain**: trovesandcoves.ca → GitHub Pages
- **API Subdomain**: api.trovesandcoves.ca → Cloudflare Worker
- **Cloudflare Proxy**: Enabled for performance and security

### 4. GitHub Pages Setup
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Source: "Deploy from a branch"
4. Branch: main, Folder: /docs
5. Custom domain: trovesandcoves.ca

## Frontend Configuration

The frontend automatically routes API calls through Cloudflare:
- `/api/*` requests → `https://api.trovesandcoves.ca/*`
- Static assets → GitHub Pages CDN
- Session management → Cloudflare KV storage

## Performance Optimizations

### Caching Strategy
- **Static Assets**: 1 year cache with immutable headers
- **HTML Pages**: 1 hour cache with revalidation
- **API Responses**: No cache for dynamic data
- **Images**: 1 year cache with compression

### Compression
- Gzip and Brotli compression enabled
- Asset minification and bundling
- Image optimization (WebP, lazy loading)

### Global Distribution
- GitHub Pages global CDN
- Cloudflare edge locations worldwide
- Optimized for Canadian market

## Monitoring and Analytics

### Built-in Analytics
- Cloudflare Web Analytics
- Custom event tracking through worker
- Performance monitoring
- Error tracking and alerting

### SEO Optimization
- Comprehensive sitemap generation
- Robots.txt for Canadian market
- Meta tags and structured data
- Fast loading times for search rankings

## Cost Structure

### GitHub Pages: FREE
- Static hosting for unlimited traffic
- Custom domain support
- Global CDN included

### Cloudflare: FREE tier includes
- 100,000 worker requests/day
- KV storage for sessions
- Basic DDoS protection
- SSL certificates

### Scaling Options
- Cloudflare Pro: $20/month for enhanced features
- Workers Paid: $5/month for 10M requests
- R2 Storage: $0.015/GB for large assets

## Security Implementation

### Headers Configuration
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: Comprehensive policy
```

### Data Protection
- Session data encrypted in Cloudflare KV
- HTTPS enforced for all connections
- API rate limiting and abuse protection
- GDPR-compliant data handling

## Canadian Market Optimization

### Language and Currency
- Canadian English spelling (jewellery, colour)
- CAD currency formatting
- Canadian tax calculations
- Local shipping preferences

### Performance
- Optimized for Canadian ISPs
- Edge locations in Toronto and Vancouver
- Fast delivery to all provinces
- Mobile-optimized for Canadian networks

## Advanced Features Implementation

### AI Recommendations
```javascript
// Cloudflare Worker handles AI calls
const recommendations = await getAIRecommendations(productId);
// Uses Anthropic API for intelligent suggestions
```

### Real-time Updates
```javascript
// WebSocket connections through Cloudflare
const ws = new WebSocket('wss://api.trovesandcoves.ca/ws');
// Real-time inventory and cart synchronization
```

### Analytics Tracking
```javascript
// Custom analytics through Cloudflare
await trackEvent('product_view', { productId, category });
// Stores data in KV for analysis
```

## Deployment Verification

### Automated Tests
- GitHub Pages deployment verification
- Cloudflare Worker functionality tests
- API endpoint response validation
- Performance benchmarking

### Manual Verification
1. Visit https://trovesandcoves.ca
2. Test product browsing and search
3. Verify cart functionality
4. Check API responses at https://api.trovesandcoves.ca/api/products
5. Confirm mobile responsiveness

## Maintenance and Updates

### Static Content Updates
- Push changes to GitHub repository
- GitHub Pages automatically rebuilds
- Changes live within minutes

### Worker Updates
- Deploy new worker versions with wrangler
- Zero-downtime deployments
- Rollback capabilities

### Monitoring
- Cloudflare Analytics dashboard
- GitHub Pages deployment status
- Custom monitoring through worker logs

## Support and Documentation

### Technical Support
- Cloudflare documentation for workers
- GitHub Pages documentation
- Custom implementation guides

### Business Support
- Domain management through registrar
- SSL certificate management (automatic)
- Performance optimization recommendations

This hybrid architecture ensures Troves and Coves maintains its premium user experience while leveraging the best of static hosting and edge computing technologies.