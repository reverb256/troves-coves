# GitHub Pages Setup for Domain Fallback

## Quick Setup for Static Demo

### 1. Create New Repository
```bash
# Create new repository on GitHub
Repository name: troves-coves-demo
Description: Static demo for Troves & Coves jewelry platform
Visibility: Public (required for free GitHub Pages)
```

### 2. Deploy Static Demo
```bash
# Clone your new repository
git clone https://github.com/username/troves-coves-demo.git
cd troves-coves-demo

# Copy the static demo file
cp /path/to/static-demo.html index.html

# Add and commit
git add .
git commit -m "Deploy Troves & Coves static demo"
git push origin main
```

### 3. Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: main
4. **Folder**: / (root)
5. **Custom domain**: demo.trovescoves.com (optional)

### 4. Cloudflare Integration
Your existing Cloudflare orchestration will automatically handle:
- Primary domain routing to Replit platform
- Fallback routing to GitHub Pages demo
- Health checks and automatic switching
- Global CDN caching for both platforms

## Benefits of This Setup

### Free and Unlimited
- **GitHub Pages**: 100% free for public repositories
- **Unlimited bandwidth**: No usage limits
- **Global CDN**: Fast delivery worldwide
- **SSL included**: Automatic HTTPS certificates

### Professional Presentation
- **Custom domain**: Uses your brand domain
- **Seamless fallback**: Users never see downtime
- **Consistent experience**: Same visual design
- **Client showcase**: Perfect for presentations

### Business Continuity
- **Zero maintenance**: GitHub handles all infrastructure
- **Automatic updates**: Push changes via git
- **Version control**: Full history tracking
- **Instant deployment**: Live within minutes

## Domain Configuration

### Primary Domain (trovescoves.com)
- Routes to Replit platform (full e-commerce)
- Handles all dynamic functionality
- Payment processing enabled
- User accounts and authentication

### Fallback Domain (demo.trovescoves.com)
- Routes to GitHub Pages (static showcase)
- Product gallery and brand story
- Contact information and Etsy link
- Graceful degradation messaging

### Automatic Switching
Your Cloudflare orchestrator manages:
```javascript
// Health check logic already implemented
if (primaryPlatformDown) {
  route → GitHub Pages demo
} else {
  route → Replit platform
}
```

## Update Process

### Static Demo Updates
```bash
# Make changes to static-demo.html
# Then update GitHub Pages
git add index.html
git commit -m "Update product showcase"
git push origin main
# Live in 1-2 minutes
```

### Platform Updates
- Replit platform updates automatically
- Cloudflare orchestration handles routing
- No manual intervention required

This gives you enterprise-level reliability with zero additional hosting costs while maintaining your hybrid deployment strategy.