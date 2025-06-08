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
import { crystalJewelryImages, categoryDescriptions } from "./mock-data";

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
    // Product categories featuring authentic crystal jewelry collections
    const crystalNecklacesCategory: Category = {
      id: this.currentCategoryId++,
      name: "Crystal Necklaces",
      slug: "crystal-necklaces",
      description: categoryDescriptions.crystalNecklaces,
      imageUrl: crystalJewelryImages.mixed[0]
    };
    
    const healingCrystalsCategory: Category = {
      id: this.currentCategoryId++,
      name: "Healing Crystals",
      slug: "healing-crystals",
      description: categoryDescriptions.healingCrystals,
      imageUrl: crystalJewelryImages.mixed[1]
    };

    const wirewrappedCategory: Category = {
      id: this.currentCategoryId++,
      name: "Wire Wrapped Jewelry",
      slug: "wire-wrapped",
      description: categoryDescriptions.wireWrapped,
      imageUrl: crystalJewelryImages.mixed[2]
    };

    this.categories.set(crystalNecklacesCategory.id, crystalNecklacesCategory);
    this.categories.set(healingCrystalsCategory.id, healingCrystalsCategory);
    this.categories.set(wirewrappedCategory.id, wirewrappedCategory);

    // Authentic product inventory from TrovesandCoves Etsy store
    const lepidoliteNecklace: Product = {
      id: this.currentProductId++,
      name: "Lepidolite 14k Gold Filled Necklace, Curb Chain, Upcycled Flower Pendant, Wire Wrapped",
      description: "Lepidolite crystal is known for its mood stabilizing properties. This stone has naturally occurring lithium which is known for relief of anxieties, promoting calming energy and inner peace. Beautiful upcycled enamel and gold plated flower earring transformed into a stationary pendant. Features peace, nurturing, and mood stabilizing properties.",
      price: "90.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.lepidolite[0],
      imageUrls: crystalJewelryImages.lepidolite,
      sku: "TC-LEP-001",
      stockQuantity: 1,
      weight: "25g",
      materials: ["Brass", "Stone", "Yellow gold", "14k Gold Filled", "Recycled metal"],
      gemstones: ["Lepidolite"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const turquoiseBeadedNecklace: Product = {
      id: this.currentProductId++,
      name: "Unique Turquoise Beaded Necklace, Pearl Strung, Lapis Lazuli, Pink Pearl, Hematite, Leaf",
      description: "Sacred turquoise beaded talisman featuring divine pearl strung ceremony with mystical lapis lazuli, luminous pink pearl, grounding hematite, and sacred leaf charm. This one-of-a-kind spiritual companion channels ancient wisdom with blessed gold filled clasp. 21 inches of divine protection with sacred closure.",
      price: "70.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.turquoise[0],
      imageUrls: crystalJewelryImages.turquoise,
      sku: "TC-TUR-001",
      stockQuantity: 1,
      weight: "30g",
      materials: ["Stone", "Gold Filled", "Pearl"],
      gemstones: ["Turquoise", "Lapis Lazuli", "Hematite"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const citrineNecklace: Product = {
      id: this.currentProductId++,
      name: "Pretty Handwrapped Citrine, Pearl, Hematite, Crystal Necklace Set",
      description: "Divine twin talisman set channeling abundant manifestation energy! The sacred choker embraces your throat chakra with luminous pink pearl and protective hematite. The ceremonial companion features wire-wrapped citrine sunstone centerpiece on blessed pink pearl and grounding hematite with gold filled clasp. Perfect for divine feminine awakening, mother goddess honoring, soul sister gifts, and sacred celebration rituals.",
      price: "200.00",
      categoryId: healingCrystalsCategory.id,
      imageUrl: crystalJewelryImages.citrine[0],
      imageUrls: crystalJewelryImages.citrine,
      sku: "TC-CIT-SET-001",
      stockQuantity: 1,
      weight: "45g",
      materials: ["Citrine", "Pearl strung", "Gold filled", "14k", "14k gold filled", "Pearl", "Hematite", "EMF protecting", "Crystal", "Stone", "Mineral"],
      gemstones: ["Citrine", "Hematite", "Pearl"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const lapisLazuliPendant: Product = {
      id: this.currentProductId++,
      name: "Lapis Lazuli, Wire Wrapped Necklace, Leather, Spiritual, Royal, Psychic Abilities",
      description: "Sacred Lapis Lazuli talisman on blessed brown leather cord. The mystical blue essence channels ancient royal energies and divine psychic abilities. Wire wrapped through sacred ceremonies with protection, spiritual guidance, and amulet properties. 15 inches with blessed closure.",
      price: "40.00",
      categoryId: wirewrappedCategory.id,
      imageUrl: crystalJewelryImages.lapis[0],
      imageUrls: crystalJewelryImages.lapis,
      sku: "TC-LAP-001",
      stockQuantity: 1,
      weight: "20g",
      materials: ["Leather", "Stone"],
      gemstones: ["Lapis Lazuli"],
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
    };

    const roseQuartzPendant: Product = {
      id: this.currentProductId++,
      name: "Medium Rose Quartz Pendant, Wire Wrapped, Brown Leather",
      description: "Divine Rose Quartz talisman on sacred brown leather cord. Embrace the infinite loving vibrations of this ethereal piece featuring a raw Rose Quartz pendant blessed with healing light. The gentle pink essence harmonizes with the earthen leather to channel unconditional love, soul connections, divine self-love, compassion, empathy, grace, confidence, and heart chakra healing. 18 inches with sacred closure.",
      price: "40.00",
      categoryId: wirewrappedCategory.id,
      imageUrl: crystalJewelryImages.roseQuartz[0],
      imageUrls: crystalJewelryImages.roseQuartz,
      sku: "TC-ROS-001",
      stockQuantity: 1,
      weight: "22g",
      materials: ["Leather", "Stone"],
      gemstones: ["Rose Quartz"],
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
    };

    const lapisLazuliMensNecklace: Product = {
      id: this.currentProductId++,
      name: "Lapis Lazuli, Brown Leather, Masculine, Men's Necklace",
      description: "Handmade Lapis Lazuli necklace on brown leather cord designed for men. The striking blue hues are steeped in rich metaphysical properties cherished for centuries. Psychic abilities, protection, royal, Egypt connection. Hand wrapped, wire wrapped. 26 inches in length.",
      price: "40.00",
      categoryId: wirewrappedCategory.id,
      imageUrl: crystalJewelryImages.lapis[1],
      imageUrls: crystalJewelryImages.lapis,
      sku: "TC-LAP-MEN-001",
      stockQuantity: 1,
      weight: "25g",
      materials: ["Leather", "Stone"],
      gemstones: ["Lapis Lazuli"],
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
    };

    const lapisLazuliOnyx: Product = {
      id: this.currentProductId++,
      name: "Unique Lapis Lazuli, Onyx, Smoky Quartz, Jade, Lava Stone Crystal Necklace",
      description: "Handmade Lapis Lazuli, Smoky Quartz, Jade, and Lava Stone Necklace. Discover the harmonious blend of powerful gemstones with this exquisite handmade necklace. Featuring a striking combination of lapis lazuli, smoky quartz, and lava stone. Gift for her, one of a kind piece.",
      price: "80.00",
      categoryId: healingCrystalsCategory.id,
      imageUrl: crystalJewelryImages.lapis[2],
      imageUrls: crystalJewelryImages.lapis,
      sku: "TC-LAP-ONY-001",
      stockQuantity: 1,
      weight: "35g",
      materials: ["Stone"],
      gemstones: ["Lapis Lazuli", "Onyx", "Smoky Quartz", "Jade", "Lava Stone"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const turquoiseLapisNecklace: Product = {
      id: this.currentProductId++,
      name: "Turquoise, Lapis Lazuli, Pearl Strung, Hematite, Healing, Crystals",
      description: "Turquoise/Lapis Lazuli/Pink Pearl/Hematite necklace for healing, crystals, social connections, spirit guides, powerful combo. Features brass, copper, silver, yellow gold materials. Gemstone: Turquoise. Lobster claw closure. Bead chain style. 23.5 inches length.",
      price: "70.00",
      categoryId: healingCrystalsCategory.id,
      imageUrl: crystalJewelryImages.turquoise[1],
      imageUrls: crystalJewelryImages.turquoise,
      sku: "TC-TUR-LAP-001",
      stockQuantity: 1,
      weight: "32g",
      materials: ["Brass", "Copper", "Silver", "Yellow gold"],
      gemstones: ["Turquoise", "Lapis Lazuli", "Hematite"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const upcycledEnamelPendant: Product = {
      id: this.currentProductId++,
      name: "Upcycled Gold Plated Enamel Pendant, 14k Gold Filled Necklace, Chain, 18KGF Lobster Clasp, Citrine, Peridot, Good Fortune, Lucky, Confident",
      description: "Sacred transformation of vintage enamel flower into divine talisman. This ethereal piece channels ancient wisdom through sustainable upcycling, adorned with luminous citrine for manifestation and peridot for heart healing. The sacred white magnolia blossom represents purity, nobility, and spiritual awakening. 14k gold filled chain with 18KGF lobster clasp ensures divine durability while honoring the Earth through conscious creation.",
      price: "85.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.enamelPendant[0],
      imageUrls: crystalJewelryImages.enamelPendant,
      sku: "TC-UPC-ENA-001",
      stockQuantity: 1,
      weight: "18g",
      materials: ["14k Gold Filled", "Gold Plated Enamel", "18KGF"],
      gemstones: ["Citrine", "Peridot"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    // Store all products in the system
    [lepidoliteNecklace, turquoiseBeadedNecklace, citrineNecklace, lapisLazuliPendant, roseQuartzPendant, lapisLazuliMensNecklace, lapisLazuliOnyx, turquoiseLapisNecklace, upcycledEnamelPendant].forEach(product => {
      this.products.set(product.id, product);
    });
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
        quantity: existingItem.quantity + (insertItem.quantity || 1)
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { 
      ...insertItem, 
      id,
      addedAt: new Date(),
      productId: insertItem.productId || null,
      quantity: insertItem.quantity || 1
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
      createdAt: new Date(),
      status: insertOrder.status || "pending",
      sessionId: insertOrder.sessionId || null,
      userId: insertOrder.userId || null,
      currency: insertOrder.currency || "CAD",
      customerPhone: insertOrder.customerPhone || null,
      stripePaymentIntentId: insertOrder.stripePaymentIntentId || null
    };
    this.orders.set(id, order);
    return order;
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id,
      productId: insertOrderItem.productId || null,
      orderId: insertOrderItem.orderId || null
    };
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
      createdAt: new Date(),
      phone: insertSubmission.phone || null,
      isConsultation: insertSubmission.isConsultation || false,
      preferredDate: insertSubmission.preferredDate || null
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
}

export const storage = new MemStorage();
