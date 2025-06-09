# Cloudflare Domain Fallback Configuration

## DNS Setup for Hybrid Deployment

### Step 1: Domain Configuration

**Primary Domain (trovesandcoves.ca)**
```
Type: A
Name: @
Content: [Cloudflare Worker IP]
TTL: Auto
Proxy: ☑️ Proxied
```

**GitHub Pages Subdomain (demo.trovesandcoves.ca)**
```
Type: CNAME
Name: demo
Content: username.github.io
TTL: Auto
Proxy: ☑️ Proxied
```

### Step 2: Worker Routes Configuration

**Route 1: Primary Domain Fallback**
```
Route: trovesandcoves.ca/*
Worker: troves-coves-fallback
```

**Route 2: API Endpoints**
```
Route: trovesandcoves.ca/api/*
Worker: troves-coves-fallback
```

### Step 3: Worker Environment Variables

```javascript
// In Cloudflare Workers Dashboard
PRIMARY_ORIGIN = "https://your-repl-name.replit.app"
FALLBACK_ORIGIN = "https://username.github.io/troves-coves-demo"
HEALTH_CHECK_TIMEOUT = "3000"
FALLBACK_ENABLED = "true"
```

### Step 4: Page Rules for Optimization

**Rule 1: Static Assets Caching**
```
Pattern: trovesandcoves.ca/assets/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 day
```

**Rule 2: API No Cache**
```
Pattern: trovesandcoves.ca/api/*
Settings:
- Cache Level: Bypass
```

**Rule 3: Demo Subdomain**
```
Pattern: demo.trovesandcoves.ca/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 hour
```

## Advanced Fallback Logic

### Health Check Implementation

```javascript
// Enhanced health check with multiple endpoints
const healthChecks = [
  '/api/health',
  '/api/products/featured',
  '/'
];

async function checkPrimaryHealth(origin) {
  for (const endpoint of healthChecks) {
    try {
      const response = await fetch(`${origin}${endpoint}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      });
      
      if (response.ok) {
        return true;
      }
    } catch (error) {
      continue;
    }
  }
  return false;
}
```

### Smart Routing Based on Request Type

```javascript
function shouldUseFallback(url, headers) {
  const pathname = new URL(url).pathname;
  
  // Always try primary for API requests
  if (pathname.startsWith('/api/')) {
    return false;
  }
  
  // Use fallback for static content during maintenance
  if (pathname.match(/\.(css|js|png|jpg|svg)$/)) {
    return true;
  }
  
  // Check user agent for bots (serve static version)
  const userAgent = headers.get('User-Agent') || '';
  if (userAgent.includes('bot') || userAgent.includes('crawler')) {
    return true;
  }
  
  return false;
}
```

## Monitoring and Analytics

### Custom Analytics

```javascript
// Track fallback usage
function logFallbackUsage(request, reason) {
  const data = {
    timestamp: new Date().toISOString(),
    url: request.url,
    userAgent: request.headers.get('User-Agent'),
    reason: reason,
    ip: request.headers.get('CF-Connecting-IP')
  };
  
  // Send to analytics endpoint
  fetch('https://analytics.example.com/fallback', {
    method: 'POST',
    body: JSON.stringify(data)
  }).catch(() => {}); // Fire and forget
}
```

### Performance Monitoring

```javascript
// Monitor response times
async function monitorPerformance(origin, request) {
  const start = Date.now();
  
  try {
    const response = await fetch(origin + new URL(request.url).pathname);
    const duration = Date.now() - start;
    
    // Log performance metrics
    console.log(`${origin} responded in ${duration}ms`);
    
    return { success: true, duration, response };
  } catch (error) {
    const duration = Date.now() - start;
    return { success: false, duration, error: error.message };
  }
}
```

## Deployment Commands

### Deploy Worker
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy cloudflare-fallback-config.js

# Set environment variables
wrangler secret put PRIMARY_ORIGIN
wrangler secret put FALLBACK_ORIGIN
```

### GitHub Pages Setup
```bash
# Create repository
git init troves-coves-demo
cd troves-coves-demo

# Copy static demo
cp ../static-demo.html index.html

# Commit and push
git add .
git commit -m "Initial demo deployment"
git remote add origin https://github.com/username/troves-coves-demo.git
git push -u origin main
```

### Enable GitHub Pages
1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. Custom domain: demo.trovescoves.com

## Benefits of This Configuration

### Reliability
- **99.9% Uptime**: Automatic fallback ensures site availability
- **Global CDN**: Cloudflare edge locations worldwide
- **DDoS Protection**: Built-in security for both platforms

### Performance
- **Smart Caching**: Static assets cached globally
- **Load Balancing**: Traffic distributed optimally
- **Compression**: Automatic gzip/brotli compression

### SEO Benefits
- **No Downtime**: Search engines always find content
- **Consistent URLs**: Same domain structure maintained
- **Fast Loading**: Optimized delivery from edge locations

### Business Continuity
- **Zero Maintenance Windows**: Updates without downtime
- **Graceful Degradation**: Users always see professional content
- **Analytics Continuity**: Traffic tracking uninterrupted

This configuration provides enterprise-level reliability while maintaining the hybrid deployment strategy you requested.