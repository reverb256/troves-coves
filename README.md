# Troves and Coves - Crystal Jewelry E-commerce Platform
## Premium Mystical E-commerce Built with Vibecoding Methodology

A sophisticated crystal jewelry e-commerce platform that seamlessly blends authentic mystical aesthetics with cutting-edge web technologies. Built using the vibecoding methodology, this platform delivers a premium shopping experience that honors the spiritual nature of crystal jewelry while maintaining technical excellence.

## 🌟 Features

- **Authentic Crystal Jewelry Catalog** - Browse our curated collection of handcrafted pieces
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Shopping Cart** - Add items and manage your selections
- **Etsy Integration** - Seamless redirect to official Etsy store for checkout
- **Contact & Consultation** - Crystal guidance and custom jewelry consultations
- **SEO Optimized** - Full search engine optimization with structured data
- **Performance Optimized** - Fast loading times with Cloudflare edge optimization

## 🏗️ Architecture

### Frontend
- **React** with TypeScript for type-safe development
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Wouter** for lightweight routing
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching and caching

### Backend
- **Node.js** with Express server
- **TypeScript** for type safety
- **In-memory storage** for development (easily replaceable with PostgreSQL)
- **Stripe** integration ready for payments
- **RESTful API** design

### Styling & Design
- **Authentic Brand Design** - Inspired by wooden sign reference with turquoise "Troves" and cursive blue "Coves"
- **Mystical Aesthetic** - Skull artwork influences and spiritual crystal themes
- **Modern UI Components** - Built with shadcn/ui components
- **Dark/Light Mode** support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd troves-and-coves
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following environment variables:
   ```env
   # Optional - Stripe integration
   STRIPE_SECRET_KEY=sk_...
   VITE_STRIPE_PUBLIC_KEY=pk_...
   
   # Optional - AI features
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-...
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage layer
│   └── etsy-links.ts     # Etsy integration logic
├── shared/               # Shared types and schemas
│   ├── schema.ts         # Database schema definitions
│   └── brand-config.ts   # Brand configuration
└── attached_assets/      # Product images and media
```

## 🛍️ E-commerce Features

### Product Catalog
- **Categories**: Necklaces, Bracelets, Earrings, Rings, Raw Crystals
- **Product Details**: High-quality images, descriptions, pricing, materials
- **Crystal Properties**: Healing properties and spiritual meanings
- **Care Instructions**: Proper jewelry maintenance guidance

### Shopping Experience
- **Browse by Category**: Filter products by jewelry type
- **Product Search**: Find specific items or crystals
- **Shopping Cart**: Add/remove items, adjust quantities
- **Etsy Checkout**: Secure redirect to official Etsy store

### Customer Service
- **Contact Form**: General inquiries and support
- **Crystal Consultation**: Personalized crystal guidance
- **Social Media Integration**: Links to Instagram, Facebook, Etsy

## 🎨 Brand & Design

### Visual Identity
- **"Troves"**: Clean turquoise print typography
- **"Coves"**: Elegant cursive blue styling
- **Skull Artwork**: Mystical turquoise skull influences
- **Wooden Sign Aesthetic**: Authentic, handcrafted appearance

### Color Palette
- **Primary Turquoise**: `#40E0D0` (Troves brand color)
- **Cursive Blue**: `#4169E1` (Coves accent color)
- **Mystical Purple**: `#8A2BE2` (Spiritual themes)
- **Warm Wood**: `#8B4513` (Natural background tones)

## 🔧 API Endpoints

### Products
- `GET /api/products` - List all products (with category filter)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product details

### Categories
- `GET /api/categories` - List all product categories

### Shopping Cart
- `GET /api/cart` - Get cart items for session
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Integration
- `GET /api/etsy-link/:productId` - Get Etsy link for product
- `POST /api/contact` - Submit contact form

## 🌐 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Cloudflare Deployment
The application is optimized for Cloudflare deployment with:
- Edge caching for static assets
- API response caching
- Image optimization
- Global CDN distribution

## 🔐 Environment Variables

### Required
None - the application works out of the box

### Optional
- `STRIPE_SECRET_KEY` - For payment processing
- `VITE_STRIPE_PUBLIC_KEY` - Client-side Stripe key
- `OPENAI_API_KEY` - For AI-powered features
- `ANTHROPIC_API_KEY` - Alternative AI provider

## 📱 Social Media Links

- **Instagram**: [@Troves_and_Coves](https://instagram.com/Troves_and_Coves)
- **Facebook**: [TrovesandCoves](https://www.facebook.com/TrovesandCoves)
- **Etsy Store**: [TrovesandCoves](https://www.etsy.com/ca/shop/TrovesandCoves)
- **Link Tree**: [TrovesandCoves](https://linktr.ee/TrovesandCoves)

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: In-memory storage (development), PostgreSQL ready
- **Styling**: Tailwind CSS, shadcn/ui components
- **Validation**: Zod schemas with React Hook Form
- **State Management**: TanStack Query
- **Routing**: Wouter (lightweight React router)
- **Build Tool**: Vite with TypeScript support

## 📄 License

This project is proprietary software for Troves and Coves business operations.

## 🤝 Support

For technical support or business inquiries:
- Contact form on website
- Social media channels
- Email through Etsy store

---

*Handcrafted with mystical energy for the crystal jewelry community* ✨