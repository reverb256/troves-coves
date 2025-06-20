# Troves & Coves - Mystical Crystal Jewelry Platform

[![Deploy to GitHub Pages](https://github.com/reverb256/trovesandcoves/workflows/Deploy%20to%20GitHub%20Pages%20and%20Cloudflare%20Workers/badge.svg)](https://github.com/reverb256/trovesandcoves/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, full-stack e-commerce platform for authentic crystal jewelry, built with React, Node.js, and deployed on GitHub Pages + Cloudflare Workers.

## 🌟 Features

- **Modern Stack**: React 18, TypeScript, Node.js, Tailwind CSS
- **Hybrid Deployment**: GitHub Pages (frontend) + Cloudflare Workers (API)
- **AI Integration**: Personalized recommendations and customer service
- **Enterprise Security**: OWASP compliant, secure payment processing
- **Mobile Optimized**: Responsive design with PWA capabilities
- **Zero Cost Hosting**: Maximizes free tiers of GitHub Pages and Cloudflare

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- GitHub account
- Cloudflare account (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/reverb256/trovesandcoves.git
cd trovesandcoves

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deployment

1. **Set up GitHub Pages**: Enable GitHub Actions in repository settings
2. **Configure Cloudflare**: Add API tokens to GitHub secrets
3. **Deploy**: Push to main branch triggers automatic deployment

For detailed deployment instructions, see [Deployment Guide](docs/deployment/README.md).

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
│   └── public/            # Static assets
├── server/                # Node.js backend (for local development)
├── docs/                  # Documentation
│   ├── deployment/        # Deployment guides
│   ├── development/       # Development guides
│   ├── api/              # API documentation
│   └── guides/           # User guides
├── scripts/              # Build and utility scripts
├── .github/              # GitHub Actions workflows
├── cloudflare-worker.js  # Cloudflare Worker (production API)
└── cloudflare.toml       # Cloudflare configuration
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy:all` | Deploy to both platforms |
| `npm run cf:dev` | Test Cloudflare Worker locally |

### Development Workflow

1. **Local Development**: `npm run dev` - Full-stack development with hot reload
2. **Testing**: `npm run build` - Verify builds work correctly
3. **Deployment**: Push to main - Automatic deployment via GitHub Actions

See [Development Guide](docs/development/README.md) for detailed instructions.

## 🌐 Architecture

### Hybrid Deployment Strategy

- **GitHub Pages**: Hosts static React frontend with global CDN
- **Cloudflare Workers**: Handles dynamic API requests and features
- **Cloudflare KV**: Stores product data, cart sessions, and analytics

### Free Tier Optimization

- **GitHub Pages**: 1GB storage, 100GB bandwidth/month
- **Cloudflare Workers**: 100k requests/day with automatic rate limiting
- **Cloudflare KV**: 1GB storage with TTL optimization

## 📖 Documentation

- [**Deployment Guide**](docs/deployment/README.md) - Complete deployment instructions
- [**Development Guide**](docs/development/README.md) - Local development setup
- [**API Documentation**](docs/api/README.md) - API endpoints and usage
- [**User Guides**](docs/guides/README.md) - End-user documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [trovesandcoves.ca](https://trovesandcoves.ca)
- **GitHub Pages**: [GitHub Pages Site](https://reverb256.github.io/trovesandcoves)
- **Cloudflare Worker**: [API Endpoint](https://troves-coves-api.your-subdomain.workers.dev)
- **Documentation**: [Full Documentation](docs/)

## 📞 Support

For support, email support@trovesandcoves.ca or create an issue in this repository.

---

Built with ❤️ for the crystal healing community
