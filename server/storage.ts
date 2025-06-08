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
      imageUrl: crystalJewelryImages.lepidolite[0]
    };
    
    const healingCrystalsCategory: Category = {
      id: this.currentCategoryId++,
      name: "Healing Crystals",
      slug: "healing-crystals",
      description: categoryDescriptions.healingCrystals,
      imageUrl: crystalJewelryImages.turquoise[0]
    };

    const wirewrappedCategory: Category = {
      id: this.currentCategoryId++,
      name: "Wire Wrapped Jewelry",
      slug: "wire-wrapped",
      description: categoryDescriptions.wirewrapped,
      imageUrl: crystalJewelryImages.citrine[0]
    };

    this.categories.set(crystalNecklacesCategory.id, crystalNecklacesCategory);
    this.categories.set(healingCrystalsCategory.id, healingCrystalsCategory);
    this.categories.set(wirewrappedCategory.id, wirewrappedCategory);

    // Authentic product inventory from TrovesandCoves Etsy store
    const lepidoliteNecklace: Product = {
      id: this.currentProductId++,
      name: "Lepidolite 14k Gold Filled Necklace, Curb Chain, Upcycled Flower Pendant, Wire Wrapped",
      description: "Sacred lepidolite talisman embracing your spirit with divine lilac essence and ancient lithium wisdom. This celestial crystal radiates profound tranquility, dissolving anxiety while awakening crown chakra consciousness. Blessed upcycled enamel flower pendant transformed through sacred intention, channeling peace, nurturing divine feminine energy, and emotional alchemy. Wire-wrapped with golden light on luminous 14k gold filled chain, carrying ethereal vibrations of serenity and cosmic healing.",
      price: "90.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.lepidolite[0],
      imageUrls: crystalJewelryImages.lepidolite,
      sku: "TC-LEP-001",
      stockQuantity: 1,
      weight: "25g",
      materials: ["Brass", "Stone", "Yellow gold", "14k Gold Filled", "Recycled metal"],
      gemstones: ["Lepidolite"],
      careInstructions: "Honor this sacred talisman with moonlight cleansing and sage blessing. Store in sacred space away from harsh energies.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const turquoiseBeadedNecklace: Product = {
      id: this.currentProductId++,
      name: "Unique Turquoise Beaded Necklace, Pearl Strung, Lapis Lazuli, Pink Pearl, Hematite, Leaf",
      description: "Divine turquoise vessel of ancient oceanic wisdom, adorned with celestial pearl strung ceremony. Sacred lapis lazuli awakens third eye consciousness while luminous pink pearls channel heart chakra healing. Grounding hematite creates protective earthen connection as blessed leaf charm carries nature's eternal whispers. This one-of-a-kind spiritual companion weaves together ocean, earth, and sky energies in perfect harmonic balance. 21 inches of sacred protection with golden blessed closure.",
      price: "70.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.turquoise[0],
      imageUrls: crystalJewelryImages.turquoise,
      sku: "TC-TUR-001",
      stockQuantity: 1,
      weight: "30g",
      materials: ["Stone", "Gold Filled", "Pearl"],
      gemstones: ["Turquoise", "Lapis Lazuli", "Hematite"],
      careInstructions: "Protect from water's harsh embrace - honor your divine vessel's sacred materials. Lovingly cleanse with gentle cloth and charge in moonlight's celestial blessing.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const citrineNecklace: Product = {
      id: this.currentProductId++,
      name: "Pretty Handwrapped Citrine, Pearl, Hematite, Crystal Necklace Set",
      description: "Divine twin vessel set channeling abundant solar manifestation through sacred citrine alchemy! The ethereal choker embraces throat chakra consciousness with luminous pink pearls and protective hematite grounding. The ceremonial companion radiates wire-wrapped citrine sunstone energy, weaving golden light through blessed pearls and earthen hematite protection. Perfect sacred offering for divine feminine awakening, goddess ceremonies, soul sister blessings, and manifestation rituals.",
      price: "200.00",
      categoryId: healingCrystalsCategory.id,
      imageUrl: crystalJewelryImages.citrine[0],
      imageUrls: crystalJewelryImages.citrine,
      sku: "TC-CIT-SET-001",
      stockQuantity: 1,
      weight: "45g",
      materials: ["Citrine", "Pearl strung", "Gold filled", "14k", "14k gold filled", "Pearl", "Hematite", "EMF protecting", "Crystal", "Stone", "Mineral"],
      gemstones: ["Citrine", "Hematite", "Pearl"],
      careInstructions: "Honor with gentle reverence. Protect from moisture's harsh energy. Cleanse in sacred moonlight or blessed sage smoke ceremonies.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const lapisLazuliPendant: Product = {
      id: this.currentProductId++,
      name: "Lapis Lazuli, Wire Wrapped Necklace, Leather, Spiritual, Royal, Psychic Abilities",
      description: "Sacred Lapis Lazuli vessel channeling ancient Egyptian royal consciousness through celestial blue depths. This divine talisman awakens third eye perception and psychic gifts while the blessed brown leather cord grounds earthen wisdom. Wire-wrapped through sacred ceremony to amplify protection, spiritual guidance, and mystical abilities. 15 inches of divine armor with leather closure blessing.",
      price: "40.00",
      categoryId: wirewrappedCategory.id,
      imageUrl: crystalJewelryImages.lapisLazuli[0],
      imageUrls: crystalJewelryImages.lapisLazuli,
      sku: "TC-LAP-001",
      stockQuantity: 1,
      weight: "20g",
      materials: ["Leather", "Stone"],
      gemstones: ["Lapis Lazuli"],
      careInstructions: "Protect from water's harsh energy and chemical disruption. Cradle in blessed soft cloth sanctuary.",
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
      careInstructions: "Handle with gentle care. Keep away from harsh chemicals. Cleanse with moonlight.",
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
      imageUrl: crystalJewelryImages.lapisLeather[0],
      imageUrls: crystalJewelryImages.lapisLeather,
      sku: "TC-LAP-MEN-001",
      stockQuantity: 1,
      weight: "25g",
      materials: ["Leather", "Stone"],
      gemstones: ["Lapis Lazuli"],
      careInstructions: "Keep leather dry. Store in cool place. Cleanse stone with sage.",
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
      imageUrl: crystalJewelryImages.lapisOnyx[0],
      imageUrls: crystalJewelryImages.lapisOnyx,
      sku: "TC-LAP-ONY-001",
      stockQuantity: 1,
      weight: "35g",
      materials: ["Stone"],
      gemstones: ["Lapis Lazuli", "Onyx", "Smoky Quartz", "Jade", "Lava Stone"],
      careInstructions: "Lava stone can absorb essential oils. Store separately. Cleanse under moonlight.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const turquoiseLapisNecklace: Product = {
      id: this.currentProductId++,
      name: "Unique Turquoise Beaded Necklace, Pearl Strung, lapis Lazuli, Pink Pearl, Hematite, Leaf, Handmade, Gold Filled, one of a kind",
      description: "**Handmade Turquoise, Lapis Lazuli, Pink Hematite, and Pink Pearl Necklace** Infuse your style with a burst of color and a touch of serenity with this exquisite handmade necklace. Featuring a harmonious blend of turquoise, lapis lazuli, pink hematite, and pink pearl, this piece is not only a statement accessory but also a treasure trove of positive energies and healing properties. 💙**Turquoise:** Revered as a stone of protection and good fortune, turquoise is known for its calming energies. It enhances communication, aids in clear and honest expression, and brings peace to the wearer. 💙**Lapis Lazuli:** This deep blue stone is celebrated for its ability to promote truth, wisdom, and spiritual enlightenment. It encourages self-awareness, helps alleviate stress, and fosters a deeper connection to the inner self. 💗**Pink Hematite:** Pink hematite is a unique variant that combines the grounding properties of hematite with the loving energy of the heart chakra. It promotes balance, grounding, and protection while enhancing self-esteem and willpower. 💗**Pink Pearl:** Pearls symbolize purity, love, and wisdom. Pink pearls, in particular, resonate with gentle energy, fostering love, compassion, and nurturing feelings. They are believed to attract prosperity and provide emotional balance. **Details:** 🔹️**Stones:** Genuine turquoise, lapis lazuli, pink hematite, and pink pearl 🔹️**Length:** 21\" 🔹️**Closure:** Gold Filled Clasp 🔹️**Accent:** Elegant leaf pendant adds a touch of nature-inspired charm",
      price: "70.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.turquoiseBeaded[0],
      imageUrls: crystalJewelryImages.turquoiseBeaded,
      sku: "TC-TUR-LAP-001",
      stockQuantity: 1,
      weight: "32g",
      materials: ["Stone", "Turquoise", "Lapis Lazuli", "Pink Pearl", "Hematite", "Gold Filled"],
      gemstones: ["Turquoise", "Lapis Lazuli", "Hematite", "Pink Pearl"],
      careInstructions: "Avoid water exposure. Handle pearls gently. Store in soft cloth pouch.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const upcycledEnamelPendant: Product = {
      id: this.currentProductId++,
      name: "Upcycled Gold Plated Enamel Pendant, 14k Gold Filled Necklace, Chain, 18KGF Lobster Clasp, Citrine, Peridot, Good Fortune, Lucky, Confident",
      description: "Beautiful Upcycled Enamel and Gold Plated Flower Earring transformed into a Stationary Pendant. Peridot, pearl, and citrine chips strategically placed together embody the energy of confidence, luck and good fortune, inviting wealth and abundance to flow into the life of the wearer. The back serves as a holding place for the 18K Gold Filled lobster clasp to clip onto the 1\" extender with ease. Chain is 5mm Gold Filled curb chain 14\" in length. Gorgeous piece and completely one of a kind! Each piece is cleansed on Selenite lamp prior to sending to their new homes.",
      price: "80.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.upcycledEnamel[0],
      imageUrls: crystalJewelryImages.upcycledEnamel,
      sku: "TC-UPC-ENA-001",
      stockQuantity: 1,
      weight: "18g",
      materials: ["14k Gold Filled", "Gold Plated Enamel", "18KGF", "5mm Curb Chain"],
      gemstones: ["Citrine", "Peridot", "Pearl"],
      careInstructions: "Don't wear in shower/pool to increase longevity. Wipe with soft cloth to shine. Not recommended for sleeping wear.",
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
