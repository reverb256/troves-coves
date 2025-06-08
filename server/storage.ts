import { 
  users, categories, products, cartItems, orders, orderItems, contactSubmissions,
  type User, type InsertUser, 
  type Category, type InsertCategory,
  type Product, type InsertProduct, type ProductWithCategory,
  type CartItem, type InsertCartItem, type CartItemWithProduct,
  type Order, type InsertOrder, type OrderWithItems,
  type OrderItem, type InsertOrderItem,
  type ContactSubmission, type InsertContactSubmission
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product operations
  getProducts(categoryId?: number): Promise<ProductWithCategory[]>;
  getProduct(id: number): Promise<ProductWithCategory | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<ProductWithCategory[]>;
  searchProducts(query: string): Promise<ProductWithCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(productId: number, quantity: number): Promise<Product>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order>;

  // Contact operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private contactSubmissions: Map<number, ContactSubmission>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.contactSubmissions = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentContactId = 1;

    this.seedData();
  }

  private seedData() {
    // Product categories will be created by admin with authentic information:
    // - Category names reflecting actual product lines (e.g., "Crystal Necklaces", "Healing Stones")
    // - URL-friendly slugs automatically generated from category names
    // - Descriptions explaining crystal properties, healing benefits, and jewelry techniques
    // - Professional product photography showcasing each category's offerings
    const crystalNecklacesCategory: Category = {
      id: this.currentCategoryId++,
      name: "[Admin will input: Category name like 'Crystal Necklaces']",
      slug: "[Auto-generated from name: 'crystal-necklaces']", 
      description: "[Admin will input: Description of crystal properties and jewelry styles in this category]",
      imageUrl: "[Admin will upload: Professional category showcase image]"
    };
    
    const healingCrystalsCategory: Category = {
      id: this.currentCategoryId++,
      name: "[Admin will input: Category name like 'Healing Crystals']",
      slug: "[Auto-generated from name: 'healing-crystals']",
      description: "[Admin will input: Description of healing properties and wellness benefits]",
      imageUrl: "[Admin will upload: Professional category showcase image]"
    };

    const wirewrappedCategory: Category = {
      id: this.currentCategoryId++,
      name: "[Admin will input: Category name like 'Wire Wrapped']",
      slug: "[Auto-generated from name: 'wire-wrapped']",
      description: "[Admin will input: Description of wire-wrapping techniques and artisan craftsmanship]",
      imageUrl: "[Admin will upload: Professional category showcase image]"
    };

    this.categories.set(crystalNecklacesCategory.id, crystalNecklacesCategory);
    this.categories.set(healingCrystalsCategory.id, healingCrystalsCategory);
    this.categories.set(wirewrappedCategory.id, wirewrappedCategory);

    // Product inventory will be created by admin with authentic information:
    // - Product names reflecting actual handcrafted crystal jewelry pieces
    // - Detailed descriptions including crystal properties, healing benefits, materials, and craftsmanship details
    // - CAD pricing based on material costs, labor time, and market positioning
    // - Professional product photography from multiple angles
    // - Accurate inventory tracking with current stock levels
    // - Unique SKU codes following business naming conventions
    // - Weight specifications for shipping calculations
    // - Complete material and gemstone lists for customer education
    const lepidoliteNecklace: Product = {
      id: this.currentProductId++,
      name: "[Admin will input: Product name like 'Lepidolite 14k Gold Filled Necklace']",
      description: "[Admin will input: Detailed description including crystal properties, healing benefits, materials, craftsmanship techniques, and care instructions]",
      price: "[Admin will input: CAD price based on material costs and labor - e.g., '68.64']",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: "[Admin will upload: Primary high-resolution product image]",
      imageUrls: [
        "[Admin will upload: Array of product images from multiple angles and lighting conditions]"
      ],
      sku: "[Admin will input: Unique SKU code following business conventions - e.g., 'TC-LEP-001']",
      stockQuantity: 0, // [Admin will input: Current inventory count]
      weight: "[Admin will input: Product weight in grams for shipping calculations]",
      materials: ["[Admin will input: Complete list of materials used]"],
      gemstones: ["[Admin will input: List of all crystals and gemstones included]"],
      isActive: true,
      isFeatured: false, // [Admin will set: Whether product should be featured on homepage]
      createdAt: new Date(),
    };

    const turquoiseBeadedNecklace: Product = {
      id: this.currentProductId++,
      name: "[Admin will input: Product name reflecting actual inventory piece]",
      description: "[Admin will input: Detailed description including crystal metaphysical properties, materials, craftsmanship techniques, and intended benefits]",
      price: "[Admin will input: CAD price based on material costs and artisan labor time]",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: "[Admin will upload: Primary product image with professional lighting]",
      imageUrls: [
        "[Admin will upload: Multiple product angles and detail shots]"
      ],
      sku: "[Admin will input: Unique inventory tracking code]",
      stockQuantity: 0, // [Admin will input: Current available quantity]
      weight: "[Admin will input: Actual product weight for shipping]",
      materials: ["[Admin will input: Complete materials list]"],
      gemstones: ["[Admin will input: All crystals and stones used]"],
      isActive: true,
      isFeatured: false, // [Admin will set: Homepage feature status]
      createdAt: new Date(),
    };

    // Additional products will follow the same pattern - each representing actual inventory items
    const citrineNecklace: Product = {
      id: this.currentProductId++,
      name: "[Admin will input: Specific product name from actual inventory]",
      description: "[Admin will input: Complete description with crystal healing properties, gift occasions, and craftsmanship details]",
      price: "[Admin will input: CAD pricing reflecting true material and labor costs]",
      categoryId: healingCrystalsCategory.id,
      imageUrl: "[Admin will upload: Professional product photography]",
      imageUrls: [
        "[Admin will upload: Multiple angles and lighting conditions]"
      ],
      sku: "[Admin will input: Business SKU tracking code]",
      stockQuantity: 0, // [Admin will input: Real inventory count]
      weight: "[Admin will input: Accurate weight for shipping]",
      materials: ["[Admin will input: All materials used in production]"],
      gemstones: ["[Admin will input: Crystal types with their metaphysical properties]"],
      isActive: true,
      isFeatured: false, // [Admin will set: Homepage featuring decision]
      createdAt: new Date(),
    };

    const lapisLazuliPendant: Product = {
      id: this.currentProductId++,
      name: "[Admin will input: Wire-wrapped pendant name from inventory]",
      description: "[Admin will input: Description including crystal spiritual properties, protection benefits, and artisan craftsmanship from Winnipeg]",
      price: "[Admin will input: CAD price for wire-wrapped pieces]",
      categoryId: wirewrappedCategory.id,
      imageUrl: "[Admin will upload: Professional pendant photography]",
      imageUrls: [
        "[Admin will upload: Detail shots of wire work and crystal]"
      ],
      sku: "[Admin will input: Unique pendant tracking code]",
      stockQuantity: 0, // [Admin will input: Available quantity]
      weight: "[Admin will input: Pendant weight including cord]",
      materials: ["[Admin will input: Wire type, crystal, cord materials]"],
      gemstones: ["[Admin will input: Primary crystal with properties]"],
      isActive: true,
      isFeatured: false, // [Admin will set: Feature status]
      createdAt: new Date(),
    };

    const roseQuartzPendant: Product = {
      id: this.currentProductId++,
      name: "[Admin will input: Rose Quartz pendant name]",
      description: "[Admin will input: Love and healing properties description with emotional benefits and handcrafted details]",
      price: "[Admin will input: CAD price for rose quartz pieces]",
      categoryId: wirewrappedCategory.id,
      imageUrl: "[Admin will upload: Rose quartz pendant image]",
      imageUrls: [
        "[Admin will upload: Multiple views of pendant and wire work]"
      ],
      sku: "[Admin will input: Rose quartz SKU code]",
      stockQuantity: 0, // [Admin will input: Current stock level]
      weight: "[Admin will input: Total pendant weight]",
      materials: ["[Admin will input: Wire, crystal, cord specifications]"],
      gemstones: ["[Admin will input: Rose Quartz with love properties]"],
      isActive: true,
      isFeatured: false, // [Admin will set: Homepage display choice]
      createdAt: new Date(),
    };

    this.products.set(lepidoliteNecklace.id, lepidoliteNecklace);
    this.products.set(turquoiseBeadedNecklace.id, turquoiseBeadedNecklace);
    this.products.set(citrineNecklace.id, citrineNecklace);
    this.products.set(lapisLazuliPendant.id, lapisLazuliPendant);
    this.products.set(roseQuartzPendant.id, roseQuartzPendant);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId || null
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null,
      imageUrl: insertCategory.imageUrl || null
    };
    this.categories.set(id, category);
    return category;
  }

  // Product operations
  async getProducts(categoryId?: number): Promise<ProductWithCategory[]> {
    let products = Array.from(this.products.values());
    
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }

    return products.map(product => ({
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    }));
  }

  async getProduct(id: number): Promise<ProductWithCategory | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    return {
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    };
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.sku === sku);
  }

  async getFeaturedProducts(): Promise<ProductWithCategory[]> {
    const products = Array.from(this.products.values()).filter(p => p.isFeatured);
    return products.map(product => ({
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    }));
  }

  async searchProducts(query: string): Promise<ProductWithCategory[]> {
    const lowerQuery = query.toLowerCase();
    const products = Array.from(this.products.values()).filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.materials?.some(m => m.toLowerCase().includes(lowerQuery)) ||
      p.gemstones?.some(g => g.toLowerCase().includes(lowerQuery))
    );

    return products.map(product => ({
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    }));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      categoryId: insertProduct.categoryId || null,
      imageUrls: insertProduct.imageUrls || null,
      stockQuantity: insertProduct.stockQuantity || 0,
      weight: insertProduct.weight || null,
      materials: insertProduct.materials || null,
      gemstones: insertProduct.gemstones || null,
      isActive: insertProduct.isActive !== undefined ? insertProduct.isActive : true,
      isFeatured: insertProduct.isFeatured !== undefined ? insertProduct.isFeatured : false,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProductStock(productId: number, quantity: number): Promise<Product> {
    const product = this.products.get(productId);
    if (!product) throw new Error("Product not found");
    
    const updatedProduct = { ...product, stockQuantity: quantity };
    this.products.set(productId, updatedProduct);
    return updatedProduct;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    
    return items.map(item => {
      const product = this.products.get(item.productId!);
      if (!product) throw new Error("Product not found");
      
      return {
        ...item,
        product
      };
    });
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity instead of creating new item
      const updatedItem = { 
        ...existingItem, 
        quantity: existingItem.quantity + insertItem.quantity 
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { 
      ...insertItem, 
      id,
      addedAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const item = this.cartItems.get(id);
    if (!item) throw new Error("Cart item not found");
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id, _]) => id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id)
      .map(item => {
        const product = this.products.get(item.productId!);
        if (!product) throw new Error("Product not found");
        
        return {
          ...item,
          product
        };
      });

    return {
      ...order,
      items
    };
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Contact operations
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id,
      createdAt: new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
}

export const storage = new MemStorage();
