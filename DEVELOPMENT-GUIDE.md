# Development Guide - Troves and Coves

Technical guide for developers working on the Troves and Coves e-commerce platform.

## Development Environment Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd troves-and-coves

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

## Project Architecture

### Folder Structure
```
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── lib/           # Utilities and configurations
│   ├── hooks/         # Custom React hooks
│   └── assets/        # Static assets
├── server/
│   ├── routes.ts      # API endpoint definitions
│   ├── storage.ts     # Data layer abstraction
│   └── services/      # Business logic services
├── shared/
│   ├── schema.ts      # Database schemas with Zod validation
│   └── types.ts       # Shared TypeScript types
```

### Tech Stack Details

#### Frontend
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible components
- **Wouter** - Lightweight React router
- **React Hook Form** - Form handling with validation
- **TanStack Query** - Data fetching and caching
- **Zod** - Runtime type validation

#### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Type-safe database ORM
- **Zod** - Request validation

## Development Workflow

### Adding New Features

1. **Define Data Schema** (if needed)
   ```typescript
   // shared/schema.ts
   export const productSchema = pgTable('products', {
     id: serial('id').primaryKey(),
     name: varchar('name', { length: 255 }).notNull(),
     // ... other fields
   });
   ```

2. **Create API Endpoints**
   ```typescript
   // server/routes.ts
   app.get('/api/products', async (req, res) => {
     const products = await storage.getProducts();
     res.json(products);
   });
   ```

3. **Build Frontend Components**
   ```typescript
   // client/src/components/ProductList.tsx
   export function ProductList() {
     const { data: products } = useQuery({
       queryKey: ['/api/products'],
       queryFn: () => apiRequest('GET', '/api/products')
     });
     // Component implementation
   }
   ```

### Code Style Guidelines

#### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use Zod schemas for runtime validation
- Prefer type inference over explicit typing when clear

#### React Components
- Use functional components with hooks
- Extract custom hooks for reusable logic
- Use TypeScript for prop definitions
- Follow single responsibility principle

#### CSS/Styling
- Use Tailwind utility classes primarily
- Create custom CSS classes only when necessary
- Follow mobile-first responsive design
- Maintain consistent spacing and colors

### Brand Design Implementation

#### Color System
```css
/* Primary brand colors */
:root {
  --troves-turquoise: #40E0D0;
  --coves-blue: #4169E1;
  --mystical-purple: #8A2BE2;
  --wood-brown: #8B4513;
}
```

#### Typography
- **Troves**: Clean, modern sans-serif
- **Coves**: Elegant script/cursive font
- Body text: Readable sans-serif
- Headings: Bold, impactful styling

#### Design Principles
- Authentic wooden sign aesthetic
- Mystical skull artwork influences
- Natural, earthy color palette
- Modern UI with spiritual themes

## Data Management

### Storage Layer
The application uses an abstraction layer for data storage:

```typescript
// server/storage.ts
interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | null>;
  // ... other methods
}
```

### Database Schema
All data models are defined using Drizzle ORM:

```typescript
// shared/schema.ts
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: varchar('price', { length: 20 }).notNull(),
  // ... additional fields
});
```

### Validation
Request validation using Zod schemas:

```typescript
// Validation schema
const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.string().regex(/^\d+\.\d{2}$/),
});

// Usage in API endpoint
const result = createProductSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.errors });
}
```

## Component Development

### UI Component Structure
```typescript
interface ComponentProps {
  // Define prop types
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* Component JSX */}
    </div>
  );
}
```

### Custom Hooks
```typescript
function useProducts(category?: string) {
  return useQuery({
    queryKey: ['/api/products', category],
    queryFn: () => apiRequest('GET', `/api/products?category=${category}`)
  });
}
```

### Form Handling
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: '',
    email: '',
  }
});

function onSubmit(data: FormData) {
  // Handle form submission
}
```

## API Development

### Endpoint Structure
```typescript
app.get('/api/resource', async (req, res) => {
  try {
    // Input validation
    const { param } = req.query;
    
    // Business logic
    const result = await storage.getResource(param);
    
    // Response
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
```

### Error Handling
- Use try-catch blocks for all async operations
- Return consistent error response format
- Log errors for debugging
- Provide user-friendly error messages

## Testing Strategy

### Unit Testing
- Test individual components and functions
- Mock external dependencies
- Focus on business logic and edge cases

### Integration Testing
- Test API endpoints
- Verify database operations
- Test component interactions

### E2E Testing
- Test complete user workflows
- Verify shopping cart functionality
- Test contact form submissions

## Performance Optimization

### Frontend Optimization
- Lazy load components and images
- Implement virtual scrolling for large lists
- Use React.memo for expensive components
- Optimize bundle size with code splitting

### Backend Optimization
- Implement API response caching
- Use database indexing
- Optimize query performance
- Implement rate limiting

### Cloudflare Integration
- Cache static assets at edge
- Optimize images automatically
- Use Workers for edge computing
- Implement global CDN

## Security Considerations

### Input Validation
- Validate all user inputs with Zod
- Sanitize data before database operations
- Implement proper error handling

### API Security
- Implement rate limiting
- Use HTTPS in production
- Validate request origins
- Sanitize response data

### Data Protection
- No sensitive data in client-side code
- Secure environment variable handling
- Regular security audits

## Deployment Process

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Production build working
- [ ] Environment variables configured
- [ ] Database migrations applied

### Deployment Steps
1. Build production version: `npm run build`
2. Deploy to hosting platform
3. Configure environment variables
4. Verify deployment functionality
5. Monitor for errors

## Troubleshooting

### Common Issues

**TypeScript Errors**
```bash
# Check for type errors
npm run type-check

# Fix common issues
# - Missing type definitions
# - Incorrect prop types
# - Import/export issues
```

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**API Issues**
- Check network requests in browser dev tools
- Verify API endpoint URLs
- Check server logs for errors
- Validate request/response formats

### Debugging Tools
- React Developer Tools
- Browser DevTools Network tab
- Server logs and console output
- TypeScript compiler output

## Best Practices

### Code Quality
- Write self-documenting code
- Use meaningful variable names
- Keep functions small and focused
- Comment complex business logic

### Performance
- Optimize images and assets
- Implement proper caching strategies
- Use efficient algorithms
- Monitor performance metrics

### Maintainability
- Follow consistent code style
- Write comprehensive tests
- Document complex functionality
- Regular dependency updates

---

*This development guide provides the foundation for building and maintaining the Troves and Coves platform.*