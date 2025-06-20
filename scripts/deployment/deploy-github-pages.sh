#!/bin/bash

# GitHub Pages Deployment Script for Troves & Coves
# Run this script to automatically deploy the static demo

set -e

echo "🍁 Deploying Troves & Coves Canadian Jewellery Demo to GitHub Pages"

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Get user input
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: troves-coves-demo): " REPO_NAME
REPO_NAME=${REPO_NAME:-troves-coves-demo}

# Create deployment directory
DEPLOY_DIR="github-pages-deploy"
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# Clone or create repository
if [ -d "$REPO_NAME" ]; then
    echo "📁 Repository exists, updating..."
    cd $REPO_NAME
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git || {
        echo "❌ Repository not found. Please create it first at https://github.com/new"
        echo "   Repository name: $REPO_NAME"
        echo "   Visibility: Public"
        echo "   Initialize with README: Yes"
        exit 1
    }
    cd $REPO_NAME
fi

# Create the static demo HTML
echo "📝 Creating Canadian jewellery demo page..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Troves & Coves - Sacred Crystal Jewellery | Winnipeg, Manitoba</title>
    <meta name="description" content="Sacred crystal jewellery and healing gemstone talismans handcrafted in Winnipeg. Divine wire-wrapped pendants, blessed necklaces, and consecrated stones for spiritual transformation.">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, hsl(43, 60%, 88%), hsl(43, 55%, 85%));
            color: hsl(25, 30%, 3%);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            text-align: center;
            padding: 60px 0;
            background: linear-gradient(rgba(0,0,0,0.1), transparent);
        }
        
        .logo {
            font-size: 4rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .troves {
            color: hsl(174, 75%, 20%);
            font-weight: bold;
            font-family: 'Arial Black', sans-serif;
        }
        
        .coves {
            color: hsl(200, 65%, 20%);
            font-style: italic;
            font-family: cursive;
        }
        
        .tagline {
            font-size: 1.5rem;
            color: hsl(25, 30%, 15%);
            margin-bottom: 2rem;
        }
        
        .location {
            background: hsl(43, 30%, 96%);
            padding: 12px 24px;
            border-radius: 25px;
            display: inline-block;
            margin-bottom: 3rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .notice {
            background: hsl(174, 75%, 95%);
            border: 2px solid hsl(174, 75%, 20%);
            border-radius: 12px;
            padding: 2rem;
            margin: 3rem 0;
            text-align: center;
        }
        
        .notice h2 {
            color: hsl(174, 75%, 20%);
            margin-bottom: 1rem;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
        }
        
        .product-card {
            background: hsl(43, 30%, 96%);
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
        }
        
        .product-card h3 {
            color: hsl(174, 75%, 20%);
            margin-bottom: 1rem;
        }
        
        .etsy-button {
            background: hsl(174, 75%, 20%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 2rem;
            transition: background 0.3s ease;
        }
        
        .etsy-button:hover {
            background: hsl(174, 85%, 25%);
        }
        
        footer {
            background: hsl(43, 50%, 82%);
            padding: 3rem 0;
            text-align: center;
            margin-top: 4rem;
        }
        
        .social-links {
            margin: 2rem 0;
        }
        
        .social-links a {
            color: hsl(174, 75%, 20%);
            text-decoration: none;
            margin: 0 15px;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .logo {
                font-size: 2.5rem;
            }
            
            .tagline {
                font-size: 1.2rem;
            }
            
            .gallery {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                <span class="troves">TROVES</span> & <span class="coves">Coves</span>
            </div>
            <p class="tagline">Sacred Crystal Jewellery & Healing Gemstone Talismans</p>
            <div class="location">📍 Winnipeg, Manitoba, Canada</div>
        </div>
    </header>

    <main class="container">
        <div class="notice">
            <h2>🌟 Welcome to Our Sacred Sanctuary</h2>
            <p>This is a preview of our mystical crystal jewellery collection. For the complete interactive experience with AI guidance, spiritual consultations, and secure checkout, visit our full platform.</p>
            <p><strong>Canadian customers enjoy free shipping on orders over $75 CAD</strong></p>
        </div>

        <section class="gallery">
            <div class="product-card">
                <h3>Wire Wrapped Crystal Pendants</h3>
                <p>Each pendant is lovingly hand-wrapped with precious metals, creating unique talismans that amplify crystal energies and connect you to ancient wisdom.</p>
            </div>
            
            <div class="product-card">
                <h3>Healing Crystal Necklaces</h3>
                <p>Sacred gemstones carefully selected for their metaphysical properties, designed to support emotional healing, spiritual growth, and energetic protection.</p>
            </div>
            
            <div class="product-card">
                <h3>Chakra Balancing Sets</h3>
                <p>Thoughtfully curated crystal combinations to harmonise your energy centres, promote spiritual alignment, and enhance your meditation practice.</p>
            </div>
            
            <div class="product-card">
                <h3>Custom Crystal Consultations</h3>
                <p>Personalised guidance to help you discover which sacred stones align with your soul's vibration and support your unique spiritual journey.</p>
            </div>
        </section>

        <div style="text-align: center;">
            <h2 style="margin-bottom: 2rem; color: hsl(174, 75%, 20%);">Shop Our Collection</h2>
            <a href="https://www.etsy.com/ca/shop/TrovesandCoves" class="etsy-button" target="_blank">
                Visit Our Etsy Shop 🛒
            </a>
            <p style="margin-top: 1rem; font-style: italic;">Serving crystal lovers across Canada with secure shipping and Canadian customer support</p>
        </div>
    </main>

    <footer>
        <div class="container">
            <div class="logo" style="font-size: 2rem; margin-bottom: 1rem;">
                <span class="troves">TROVES</span> & <span class="coves">Coves</span>
            </div>
            
            <div class="social-links">
                <a href="https://www.facebook.com/TrovesandCoves" target="_blank">Facebook</a>
                <a href="https://instagram.com/Troves_and_Coves" target="_blank">Instagram</a>
                <a href="https://www.etsy.com/ca/shop/TrovesandCoves" target="_blank">Etsy Shop</a>
                <a href="https://linktr.ee/TrovesandCoves" target="_blank">All Links</a>
            </div>
            
            <p>&copy; 2024 Troves & Coves. Sacred crystal jewellery handcrafted in Winnipeg, Manitoba.</p>
            <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                Serving spiritual seekers across Canada with authentic healing crystals and mystical guidance.
            </p>
        </div>
    </footer>
</body>
</html>
EOF

# Create CNAME file for custom domain
echo "🌐 Setting up custom domain..."
echo "demo.trovesandcoves.ca" > CNAME

# Create README
cat > README.md << EOF
# Troves & Coves - Canadian Crystal Jewellery Demo

This is the static demo site for Troves & Coves, showcasing our sacred crystal jewellery collection from Winnipeg, Manitoba.

## Features
- Canadian English spelling throughout
- Mobile-responsive design
- Integration with Etsy shop
- Social media links
- Professional fallback experience

## Deployment
- Hosted on GitHub Pages
- Custom domain: demo.trovesandcoves.ca
- Automatic SSL via GitHub Pages
- Global CDN distribution

## Live Sites
- **Full Platform**: https://trovesandcoves.ca
- **Static Demo**: https://demo.trovesandcoves.ca
- **Etsy Shop**: https://www.etsy.com/ca/shop/TrovesandCoves

Built with ❤️ in Winnipeg, Manitoba
EOF

# Commit and push
echo "🚀 Deploying to GitHub Pages..."
git add .
git commit -m "Deploy Canadian jewellery demo site

- Added responsive static demo
- Canadian English spelling throughout
- Integration with Etsy shop
- Custom domain configuration
- Professional fallback experience"

git push origin main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. Set source to 'Deploy from a branch'"
echo "3. Select branch 'main' and folder '/ (root)'"
echo "4. Add custom domain: demo.trovesandcoves.ca"
echo "5. Wait 5-10 minutes for deployment"
echo ""
echo "🌍 Your demo will be available at:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo "   https://demo.trovesandcoves.ca (after DNS setup)"
echo ""
echo "🔗 Configure your main domain at Cloudflare to complete the setup!"

cd ../..
EOF