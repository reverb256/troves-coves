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
    // Seed categories
    const crystalNecklacesCategory: Category = {
      id: this.currentCategoryId++,
      name: "Crystal Necklaces",
      slug: "crystal-necklaces", 
      description: "Handcrafted crystal necklaces for healing and beauty",
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    };
    
    const healingCrystalsCategory: Category = {
      id: this.currentCategoryId++,
      name: "Healing Crystals",
      slug: "healing-crystals",
      description: "Powerful crystals for wellness and spiritual growth",
      imageUrl: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    };

    const wirewrappedCategory: Category = {
      id: this.currentCategoryId++,
      name: "Wire Wrapped",
      slug: "wire-wrapped",
      description: "Unique wire-wrapped crystal pendants and jewelry",
      imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    };

    this.categories.set(crystalNecklacesCategory.id, crystalNecklacesCategory);
    this.categories.set(healingCrystalsCategory.id, healingCrystalsCategory);
    this.categories.set(wirewrappedCategory.id, wirewrappedCategory);

    // Seed products based on actual Troves and Coves Etsy shop
    const lepidoliteNecklace: Product = {
      id: this.currentProductId++,
      name: "Lepidolite 14k Gold Filled Necklace",
      description: "Lepidolite 14k Gold Filled Necklace with Curb Chain and Upcycled Flower Pendant. Wire wrapped for peace, nurturing, and mood stabilizing properties. Handcrafted crystal jewelry from Winnipeg.",
      price: "68.64",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
      ],
      sku: "TC-LEP-001",
      stockQuantity: 3,
      weight: "15.0",
      materials: ["14K Gold Filled", "Lepidolite Crystal", "Wire Wrap"],
      gemstones: ["Lepidolite"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const turquoiseBeadedNecklace: Product = {
      id: this.currentProductId++,
      name: "Unique Turquoise Beaded Necklace",
      description: "Unique Turquoise Beaded Necklace with Pearl Strung, Lapis Lazuli, Pink Pearl, Hematite, and Leaf details. Handmade, Gold Filled, one of a kind crystal healing jewelry.",
      price: "53.39",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
      ],
      sku: "TC-TUR-001",
      stockQuantity: 1,
      weight: "25.0",
      materials: ["Gold Filled", "Turquoise", "Pearl", "Lapis Lazuli", "Hematite"],
      gemstones: ["Turquoise", "Lapis Lazuli", "Pearl", "Hematite"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const citrineNecklace: Product = {
      id: this.currentProductId++,
      name: "Pretty Handwrapped Citrine Crystal Necklace",
      description: "Pretty Handwrapped Citrine, Pearl, Hematite Crystal Necklace. Perfect gift for her - Mother's Day, girlfriend, mom, sister, birthday. Handcrafted healing crystal jewelry.",
      price: "152.53",
      categoryId: healingCrystalsCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
      ],
      sku: "TC-CIT-001",
      stockQuantity: 2,
      weight: "20.0",
      materials: ["Wire Wrap", "Citrine", "Pearl", "Hematite"],
      gemstones: ["Citrine", "Pearl", "Hematite"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const lapisLazuliPendant: Product = {
      id: this.currentProductId++,
      name: "Lapis Lazuli Wire Wrapped Pendant",
      description: "Lapis Lazuli Wire wrapped pendant on brown leather cord. Spiritual jewelry for psychic abilities, protection, and royal energy. Handcrafted talisman and amulet from Winnipeg.",
      price: "30.51",
      categoryId: wirewrappedCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
      ],
      sku: "TC-LAP-001",
      stockQuantity: 5,
      weight: "12.0",
      materials: ["Wire Wrap", "Lapis Lazuli", "Brown Leather"],
      gemstones: ["Lapis Lazuli"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const roseQuartzPendant: Product = {
      id: this.currentProductId++,
      name: "Rose Quartz Wire Wrapped Pendant",
      description: "Medium Rose Quartz pendant, wire wrapped on brown leather cord. For love, relationships, self love, compassion, empathy, grace, confidence, and healing. Handcrafted crystal jewelry.",
      price: "30.51",
      categoryId: wirewrappedCategory.id,
      imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
      ],
      sku: "TC-ROS-001",
      stockQuantity: 4,
      weight: "10.0",
      materials: ["Wire Wrap", "Rose Quartz", "Brown Leather"],
      gemstones: ["Rose Quartz"],
      isActive: true,
      isFeatured: false,
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
    const category: Category = { ...insertCategory, id };
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
