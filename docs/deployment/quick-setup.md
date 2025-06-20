# Quick Setup Guide - Cloudflare Secrets Configuration

## 🚀 You're Almost Ready!

Since you have the Cloudflare secrets, here's how to configure them for automatic deployment:

## 1. Add GitHub Secrets

Go to your GitHub repository: `https://github.com/reverb256/trovesandcoves`

1. **Navigate to Settings**:
   - Click on the "Settings" tab
   - Go to "Secrets and variables" → "Actions"

2. **Add Required Secrets**:
   Click "New repository secret" for each:

   ```
   Name: CLOUDFLARE_API_TOKEN
   Value: [Your Cloudflare API Token]
   
   Name: CLOUDFLARE_ACCOUNT_ID  
   Value: [Your Cloudflare Account ID]
   ```

3. **Optional Secrets** (for AI features):
   ```
   Name: ANTHROPIC_API_KEY
   Value: [Your Anthropic API Key] (optional)
   
   Name: OPENAI_API_KEY
   Value: [Your OpenAI API Key] (optional)
   ```

## 2. Get Your Cloudflare Credentials

### API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" with these permissions:
   - **Account**: `Cloudflare Workers:Edit`
   - **Zone**: `Zone:Read` (if using custom domain)
   - **Account**: `Account Settings:Read`

### Account ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select any domain (or go to Workers & Pages)
3. Copy the "Account ID" from the right sidebar

## 3. Verify Setup

After adding the secrets:

1. **Trigger Deployment**:
   ```bash
   git commit --allow-empty -m "Test deployment with Cloudflare secrets"
   git push origin main
   ```

2. **Check GitHub Actions**:
   - Go to the "Actions" tab in your repository
   - Watch the deployment progress
   - All jobs should now complete successfully

## 4. Expected Results

### ✅ GitHub Pages
- **URL**: https://reverb256.github.io/trovesandcoves
- **Status**: Should be live with HTTPS
- **Content**: Complete React application

### ✅ Cloudflare Worker
- **URL**: https://troves-coves-api.reverb256.workers.dev
- **Status**: API endpoints responding
- **Features**: Cart, search, AI recommendations

### ✅ KV Namespaces
- `PRODUCTS_KV`: Product catalog storage
- `CART_KV`: Shopping cart sessions
- `ANALYTICS_KV`: Usage analytics
- `TROVES_CACHE`: Request caching

## 5. Test Your Deployment

### Test GitHub Pages
```bash
curl -I https://reverb256.github.io/trovesandcoves
# Should return: HTTP/2 200
```

### Test Cloudflare Worker API
```bash
curl https://troves-coves-api.reverb256.workers.dev/api/products
# Should return: JSON array of products
```

### Test Cart Functionality
```bash
curl -X POST https://troves-coves-api.reverb256.workers.dev/api/cart \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: test-session" \
  -d '{"productId": 1, "quantity": 1}'
# Should return: {"success": true}
```

## 6. Troubleshooting

### If Deployment Still Fails

1. **Check Secret Names**: Ensure exact spelling:
   - `CLOUDFLARE_API_TOKEN` (not `CLOUDFLARE_TOKEN`)
   - `CLOUDFLARE_ACCOUNT_ID` (not `ACCOUNT_ID`)

2. **Verify Token Permissions**: API token needs Workers:Edit permission

3. **Check Logs**: View detailed error messages in GitHub Actions

### Common Issues

**"Workers subdomain required"**:
- Go to Cloudflare Dashboard → Workers & Pages
- Set up your `*.workers.dev` subdomain

**"Insufficient permissions"**:
- Recreate API token with correct permissions
- Ensure Account-level access

**"Account ID not found"**:
- Double-check Account ID from Cloudflare dashboard
- Remove any extra spaces or characters

## 7. Success Indicators

Once properly configured, you'll see:

- ✅ All GitHub Actions jobs complete successfully
- ✅ Green checkmarks on your commits
- ✅ Both websites accessible via HTTPS
- ✅ API endpoints responding correctly
- ✅ Free tier usage tracking active

## 🎉 You're Live!

With the secrets configured, your hybrid deployment is:
- **Frontend**: Hosted on GitHub Pages with global CDN
- **Backend**: Running on Cloudflare Workers edge network
- **Storage**: Using Cloudflare KV for cart and analytics
- **Security**: Full HTTPS with enterprise headers
- **Cost**: $0/month using free tiers

---

**Need help?** Check the GitHub Actions logs or refer to the [full deployment guide](README.md).
