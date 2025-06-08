#!/bin/bash
# Ultra-Lightweight Cloudflare Deployment Script
# Automated deployment for maximum free tier efficiency

set -e

echo "🚀 Starting Ultra-Lightweight Cloudflare Deployment"
echo "=================================================="

# Check required environment variables
if [[ -z "$CLOUDFLARE_API_TOKEN" ]]; then
    echo "❌ Error: CLOUDFLARE_API_TOKEN is required"
    echo "Get your API token from: https://dash.cloudflare.com/profile/api-tokens"
    exit 1
fi

if [[ -z "$CLOUDFLARE_ACCOUNT_ID" ]]; then
    echo "❌ Error: CLOUDFLARE_ACCOUNT_ID is required"
    echo "Find your Account ID in Cloudflare dashboard sidebar"
    exit 1
fi

echo "✅ Environment variables validated"

# Install wrangler if not present
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

echo "🔐 Authenticating with Cloudflare..."
wrangler auth api-token

echo "🏗️  Building production assets..."
npm run build

echo "🌐 Creating KV namespace for ultra-lightweight caching..."
KV_NAMESPACE=$(wrangler kv:namespace create "TROVES_CACHE" --preview false | grep "id" | cut -d'"' -f4)
echo "KV Namespace ID: $KV_NAMESPACE"

# Update wrangler.toml with KV namespace
sed -i "s/binding = \"CACHE\"/binding = \"CACHE\"\nid = \"$KV_NAMESPACE\"/" cloudflare.toml

echo "🚀 Deploying ultra-lightweight worker..."
wrangler deploy

echo "📊 Optimizing edge performance..."
# Pre-populate cache with static assets
curl -X POST "https://your-worker.your-subdomain.workers.dev/api/cloudflare/preload" \
  -H "Content-Type: application/json" \
  -d '{"type": "static", "assets": ["css", "js", "images"]}'

echo "🎯 Deployment completed successfully!"
echo "=================================================="
echo "🌍 Your site is now live with ultra-lightweight edge optimization"
echo "📈 Performance targets:"
echo "   • Cache hit rate: 80-90%"
echo "   • Response time: <50ms globally"
echo "   • CPU usage: 3-5ms per request"
echo "   • Daily requests: 80,000+ (free tier)"
echo ""
echo "📊 Monitor performance at:"
echo "   https://your-worker.your-subdomain.workers.dev/api/cloudflare/performance"
echo ""
echo "💰 Cost: $0/month with intelligent free tier optimization"