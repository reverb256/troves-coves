# Troves & Coves - Hybrid Deployment Setup

## Quick Start: GitHub Pages Repository

Create a new GitHub repository with this structure:

```
troves-coves-demo/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       └── hero-bg.jpg
├── README.md
└── _config.yml (optional for Jekyll)
```

## Step 1: Copy Static Demo Content

Use the `static-demo.html` file as your `index.html`:

```bash
git init
git add .
git commit -m "Initial commit: Troves & Coves portfolio demo"
git branch -M main
git remote add origin https://github.com/yourusername/troves-coves-demo.git
git push -u origin main
```

## Step 2: Enable GitHub Pages

1. Go to repository Settings
2. Navigate to Pages section
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)
6. Save

Your demo will be available at: `https://yourusername.github.io/troves-coves-demo/`

## Step 3: Update Platform URLs

Replace placeholder URLs in the HTML with your actual Replit app URL:

```html
<!-- Change this -->
<a href="https://replit.com/@username/troves-coves" target="_blank">

<!-- To your actual Replit URL -->
<a href="https://your-repl-name.replit.app" target="_blank">
```

## Benefits of Hybrid Architecture

### GitHub Pages (Marketing Frontend)
- Professional portfolio presentation
- SEO optimization for crystal jewelry keywords
- Fast global CDN delivery
- Zero hosting costs
- Professional domain capability

### Replit Platform (Full E-commerce)
- Complete shopping cart and checkout
- Enterprise security compliance
- AI-powered customer service
- Real-time inventory management
- Secure payment processing
- Admin dashboard functionality

## Integration Points

The GitHub Pages demo includes:
- Clear call-to-action buttons to full platform
- Technical capability showcase
- Security compliance demonstration
- Brand consistency with main platform
- Performance metrics highlighting

## Analytics Tracking

Add Google Analytics to both platforms:

```html
<!-- GitHub Pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Track conversions from demo to full platform with custom events.

## Custom Domain Setup (Optional)

1. Purchase domain (trovescoves.com)
2. Add CNAME file to repository root:
   ```
   demo.trovescoves.com
   ```
3. Configure DNS with your domain provider
4. Enable HTTPS in GitHub Pages settings

## Maintenance Workflow

1. Update product showcases quarterly
2. Sync design changes from full platform
3. Monitor conversion rates demo → full platform
4. Update security compliance badges
5. Refresh performance metrics

## Success Metrics

Track these KPIs:
- GitHub Pages traffic and engagement
- Conversion rate to full platform
- Time spent on technical showcase
- Contact form completions on Replit
- Shopping cart conversions

The hybrid deployment maximizes both visibility and functionality while maintaining cost efficiency and performance optimization.