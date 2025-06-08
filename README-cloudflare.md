# Cloudflare Ultra-Lightweight Deployment Guide

## Overview
Complete deployment system optimized for Cloudflare's free tier with ultra-lightweight resource usage and maximum cost efficiency.

## Performance Targets
- **CPU Usage**: 3-5ms per request (50% below free tier limit)
- **Memory Usage**: ~20MB (85% below free tier limit)
- **Cache Hit Rate**: 80-90% 
- **Origin Load Reduction**: 80%
- **Daily Requests**: Up to 80,000 (80% of free tier)
- **KV Operations**: <1,000/day (99% below limit)

## Prerequisites

### 1. Cloudflare API Token
Create at: https://dash.cloudflare.com/profile/api-tokens

**Required Permissions:**
- Account:Read
- Workers Scripts:Edit
- Workers KV Storage:Edit
- Zone:Read
- Zone Settings:Edit (optional)
- Cache Purge (optional)

### 2. Environment Variables
```bash
# Required
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ZONE_ID=your_zone_id

# Optional
CLOUDFLARE_KV_NAMESPACE_ID=auto_generated
CLOUDFLARE_WORKER_URL=auto_generated
```

## Deployment Steps

### 1. Initialize Wrangler
```bash
npx wrangler login
npx wrangler whoami
```

### 2. Create KV Namespace
```bash
npx wrangler kv:namespace create "CACHE" --preview false
```

### 3. Deploy Worker
```bash
npx wrangler deploy
```

### 4. Configure Routes (Optional)
```bash
# For custom domain
npx wrangler route create "yourdomain.com/*" your-worker-name
```

## Architecture

### Edge Processing Flow
1. **Rate Limiting** (1ms CPU) - 30 requests/minute per IP
2. **Static Assets** (2ms CPU) - 24hr cache with compression
3. **API Optimization** (2-3ms CPU) - Smart caching and recommendations
4. **Origin Fallback** - Only when edge cannot serve

### Caching Strategy
- **Static Assets**: 24 hours
- **API Responses**: 1 hour  
- **Product Data**: 2 hours
- **Market Insights**: 2 hours
- **User Data**: 15 minutes

### Memory Management
- Rate limiter auto-clears at 1000 entries
- Lazy loading of AI orchestrator
- Minimal object instantiation
- Efficient string operations

## Cost Monitoring

### Free Tier Limits
- **Requests**: 100,000/day
- **CPU Time**: 10ms per request
- **Memory**: 128MB
- **KV Operations**: 100,000/day
- **KV Storage**: 1GB

### Usage Tracking
Monitor via `/api/cloudflare/performance`:
```json
{
  "cacheHitRate": 85,
  "requestCount": 15420,
  "edgeOffloadRate": 82,
  "originServerLoad": 18,
  "estimatedCostSavings": 67
}
```

## Optimization Features

### 1. Backend Orchestration
- Automatic edge offloading for heavy operations
- Smart caching with TTL optimization
- Performance metrics tracking
- Origin server load reduction

### 2. Edge Processing
- Ultra-fast rate limiting
- Static asset optimization
- API response caching
- Content recommendation generation

### 3. Resource Management
- Memory-efficient operations
- CPU time optimization
- KV operation minimization
- Automatic cleanup routines

## API Endpoints

### Performance Monitoring
```bash
GET /api/cloudflare/performance
```

### Content Optimization
```bash
POST /api/cloudflare/optimize
Content-Type: application/json
{
  "content": "text to optimize",
  "type": "product|category|general"
}
```

### Market Insights
```bash
GET /api/cloudflare/market?query=crystal-trends
```

### Asset Preloading
```bash
POST /api/cloudflare/preload
```

## Advanced Configuration

### Custom Caching Rules
Edit `cloudflare.toml`:
```toml
[env.production]
AI_ORCHESTRATOR_ENABLED = "true"
CACHE_TTL = "3600"
API_RATE_LIMIT = "30"
```

### Security Headers
Automatic security headers:
- Rate limiting
- Origin validation
- Cache control
- Content type headers

## Troubleshooting

### High CPU Usage
- Check rate limiting effectiveness
- Verify static asset caching
- Monitor heavy operations

### Low Cache Hit Rate
- Verify KV namespace configuration
- Check caching TTL values
- Monitor cache key patterns

### Origin Server Load
- Verify edge offloading
- Check fallback frequency
- Monitor API response times

## Production Checklist

- [ ] API token created with correct permissions
- [ ] KV namespace deployed
- [ ] Worker deployed and tested
- [ ] Custom domain configured (if applicable)
- [ ] Rate limiting tested
- [ ] Cache performance verified
- [ ] Monitoring endpoints accessible
- [ ] Cost tracking enabled

## Support

### Performance Metrics
Access real-time metrics at `/api/cloudflare/performance`

### Health Checks
Monitor system health via admin dashboard at `/api/admin/stats`

### Edge Optimization
Content optimization available at `/api/cloudflare/optimize`

This deployment provides enterprise-grade edge performance while maintaining zero infrastructure costs through intelligent resource management and Cloudflare free tier optimization.