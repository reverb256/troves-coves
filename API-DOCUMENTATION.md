# API Documentation - Troves and Coves

Complete API reference for the Troves and Coves e-commerce platform.

## Base URL
```
https://your-domain.com/api
```

## Authentication
No authentication required for public endpoints. All endpoints are publicly accessible for browsing products and managing shopping carts.

## Response Format
All responses return JSON with the following structure:
```json
{
  "data": "...",  // Response data
  "message": "...",  // Success/error message (when applicable)
  "errors": []  // Validation errors (when applicable)
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

---

## Products

### Get All Products
Retrieve all products with optional category filtering.

```http
GET /api/products
```

**Query Parameters:**
- `category` (optional) - Filter by category slug (`necklaces`, `bracelets`, `earrings`, `rings`, `raw-crystals`)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Lepidolite 14k Gold Filled Necklace",
    "description": "Calming lepidolite stone with gold filled chain",
    "price": "89.99",
    "imageUrl": "/assets/lepidolite-necklace.jpg",
    "categoryId": 1,
    "imageUrls": ["/assets/lepidolite-1.jpg", "/assets/lepidolite-2.jpg"],
    "sku": "LN001",
    "stockQuantity": 5,
    "weight": "15g",
    "dimensions": "45cm chain",
    "materials": ["Lepidolite", "14k Gold Filled"],
    "gemstones": ["Lepidolite"],
    "isActive": true,
    "careInstructions": "Clean with soft cloth, avoid chemicals",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Featured Products
Retrieve a curated selection of featured products for the homepage.

```http
GET /api/products/featured
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Lepidolite 14k Gold Filled Necklace",
    "description": "Calming lepidolite stone with gold filled chain",
    "price": "89.99",
    "imageUrl": "/assets/lepidolite-necklace.jpg"
  }
]
```

### Get Single Product
Retrieve detailed information about a specific product.

```http
GET /api/products/:id
```

**Parameters:**
- `id` (required) - Product ID

**Response:**
```json
{
  "id": 1,
  "name": "Lepidolite 14k Gold Filled Necklace",
  "description": "Calming lepidolite stone with gold filled chain",
  "price": "89.99",
  "imageUrl": "/assets/lepidolite-necklace.jpg",
  "categoryId": 1,
  "imageUrls": ["/assets/lepidolite-1.jpg"],
  "sku": "LN001",
  "stockQuantity": 5,
  "weight": "15g",
  "dimensions": "45cm chain",
  "materials": ["Lepidolite", "14k Gold Filled"],
  "gemstones": ["Lepidolite"],
  "isActive": true,
  "careInstructions": "Clean with soft cloth, avoid chemicals",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Categories

### Get All Categories
Retrieve all product categories.

```http
GET /api/categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Necklaces",
    "slug": "necklaces",
    "description": "Beautiful crystal necklaces and pendants",
    "imageUrl": "/assets/category-necklaces.jpg"
  },
  {
    "id": 2,
    "name": "Bracelets",
    "slug": "bracelets",
    "description": "Healing crystal bracelets and bangles",
    "imageUrl": "/assets/category-bracelets.jpg"
  }
]
```

---

## Shopping Cart

### Get Cart Items
Retrieve all items in the current session's shopping cart.

```http
GET /api/cart
```

**Response:**
```json
[
  {
    "id": 1,
    "sessionId": "cart_1234567890_abc123",
    "productId": 1,
    "quantity": 2,
    "addedAt": "2024-01-01T00:00:00.000Z",
    "product": {
      "id": 1,
      "name": "Lepidolite 14k Gold Filled Necklace",
      "price": "89.99",
      "imageUrl": "/assets/lepidolite-necklace.jpg"
    }
  }
]
```

### Add Item to Cart
Add a product to the shopping cart.

```http
POST /api/cart
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "id": 1,
  "sessionId": "cart_1234567890_abc123",
  "productId": 1,
  "quantity": 2,
  "addedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Cart Item
Update the quantity of an item in the cart.

```http
PUT /api/cart/:id
```

**Parameters:**
- `id` (required) - Cart item ID

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "id": 1,
  "sessionId": "cart_1234567890_abc123",
  "productId": 1,
  "quantity": 3,
  "addedAt": "2024-01-01T00:00:00.000Z"
}
```

### Remove Item from Cart
Remove an item from the shopping cart.

```http
DELETE /api/cart/:id
```

**Parameters:**
- `id` (required) - Cart item ID

**Response:**
```json
{
  "message": "Item removed from cart"
}
```

---

## Etsy Integration

### Get Etsy Link
Generate an Etsy store link for a specific product.

```http
GET /api/etsy-link/:productId
```

**Parameters:**
- `productId` (required) - Product ID

**Response:**
```json
{
  "etsyLink": "https://www.etsy.com/ca/shop/TrovesandCoves?search_query=Lepidolite+Necklace"
}
```

---

## Contact & Communication

### Submit Contact Form
Send a message or consultation request.

```http
POST /api/contact
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0123",
  "subject": "Crystal Consultation",
  "message": "I'm interested in healing crystals for anxiety.",
  "isConsultation": true,
  "preferredDate": "2024-01-15T10:00:00.000Z"
}
```

**Required Fields:**
- `name` - Customer name
- `email` - Valid email address
- `subject` - Message subject
- `message` - Message content

**Optional Fields:**
- `phone` - Contact phone number
- `isConsultation` - Boolean for consultation requests
- `preferredDate` - Preferred consultation date

**Response:**
```json
{
  "message": "Thank you for your message! We'll get back to you soon.",
  "id": 1
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "message": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "quantity",
      "message": "Quantity must be greater than 0"
    }
  ]
}
```

### Not Found (404)
```json
{
  "message": "Product not found"
}
```

### Server Error (500)
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting
- No rate limiting currently implemented
- All endpoints are publicly accessible
- Cloudflare provides DDoS protection and basic rate limiting

## Data Types

### Product Object
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: number | null;
  imageUrls: string[] | null;
  sku: string;
  stockQuantity: number;
  weight: string | null;
  dimensions: string | null;
  materials: string[] | null;
  gemstones: string[] | null;
  isActive: boolean;
  careInstructions: string | null;
  createdAt: Date | null;
}
```

### Category Object
```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}
```

### Cart Item Object
```typescript
interface CartItem {
  id: number;
  sessionId: string;
  productId: number | null;
  quantity: number;
  addedAt: Date | null;
  product?: Product;
}
```

### Contact Submission Object
```typescript
interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isConsultation: boolean;
  preferredDate: Date | null;
  createdAt: Date | null;
}
```

---

## Examples

### Browse Products by Category
```bash
# Get all necklaces
curl "https://your-domain.com/api/products?category=necklaces"

# Get all products
curl "https://your-domain.com/api/products"
```

### Complete Shopping Flow
```bash
# 1. Add item to cart
curl -X POST "https://your-domain.com/api/cart" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 1}'

# 2. View cart
curl "https://your-domain.com/api/cart"

# 3. Get Etsy link for checkout
curl "https://your-domain.com/api/etsy-link/1"
```

### Submit Contact Form
```bash
curl -X POST "https://your-domain.com/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Product Inquiry",
    "message": "I love your lepidolite necklaces!"
  }'
```

---

*This API documentation covers all available endpoints for the Troves and Coves e-commerce platform.*