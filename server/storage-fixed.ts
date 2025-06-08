import { 
  User, 
  Category, 
  Product, 
  CartItem, 
  Order, 
  OrderItem, 
  ContactSubmission,
  ProductWithCategory,
  CartItemWithProduct,
  OrderWithItems,
  InsertUser,
  InsertCategory,
  InsertProduct,
  InsertCartItem,
  InsertOrder,
  InsertOrderItem,
  InsertContactSubmission
} from '@shared/schema';
import { crystalJewelryImages, categoryDescriptions } from './mock-data';

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
      careInstructions: "Handle with care. Cleanse with moonlight or sage. Store away from direct sunlight.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const turquoiseBeadedNecklace: Product = {
      id: this.currentProductId++,
      name: "Unique Turquoise Beaded Necklace, Pearl Strung, lapis Lazuli, Pink Pearl, Hematite, Leaf, Handmade, Gold Filled, one of a kind",
      description: "**Handmade Turquoise, Lapis Lazuli, Pink Hematite, and Pink Pearl Necklace** Infuse your style with a burst of color and a touch of serenity with this exquisite handmade necklace. Featuring a harmonious blend of turquoise, lapis lazuli, pink hematite, and pink pearl, this piece is not only a statement accessory but also a treasure trove of positive energies and healing properties. 💙**Turquoise:** Revered as a stone of protection and good fortune, turquoise is known for its calming energies. It enhances communication, aids in clear and honest expression, and brings peace to the wearer. 💙**Lapis Lazuli:** This deep blue stone is celebrated for its ability to promote truth, wisdom, and spiritual enlightenment. It encourages self-awareness, helps alleviate stress, and fosters a deeper connection to the inner self. 💗**Pink Hematite:** Pink hematite is a unique variant that combines the grounding properties of hematite with the loving energy of the heart chakra. It promotes balance, grounding, and protection while enhancing self-esteem and willpower. 💗**Pink Pearl:** Pearls symbolize purity, love, and wisdom. Pink pearls, in particular, resonate with gentle energy, fostering love, compassion, and nurturing feelings. They are believed to attract prosperity and provide emotional balance. **Details:** 🔹️**Stones:** Genuine turquoise, lapis lazuli, pink hematite, and pink pearl 🔹️**Length:** 21\" 🔹️**Closure:** Gold Filled Clasp 🔹️**Accent:** Elegant leaf pendant adds a touch of nature-inspired charm",
      price: "70.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.turquoiseBeaded[0],
      imageUrls: crystalJewelryImages.turquoiseBeaded,
      sku: "TC-TUR-BEAD-001",
      stockQuantity: 1,
      weight: "30g",
      materials: ["Stone", "Turquoise", "Lapis Lazuli", "Pink Pearl", "Hematite", "Gold Filled"],
      gemstones: ["Turquoise", "Lapis Lazuli", "Hematite", "Pearl"],
      careInstructions: "Keep dry to preserve gold filled components. Handle pearls gently. Store in protective pouch.",
      isActive: true,
      isFeatured: false,
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
      careInstructions: "Handle with care. Store away from moisture. Cleanse with moonlight or sage smoke.",
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
      imageUrl: crystalJewelryImages.lapisLazuli[0],
      imageUrls: crystalJewelryImages.lapisLazuli,
      sku: "TC-LAP-001",
      stockQuantity: 1,
      weight: "20g",
      materials: ["Leather", "Stone"],
      gemstones: ["Lapis Lazuli"],
      careInstructions: "Keep away from water and chemicals. Store in soft cloth.",
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
      careInstructions: "Cleanse on selenite before wearing. Keep gold filled dry. Store in protective pouch.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    // Store all products in the system
    [lepidoliteNecklace, turquoiseBeadedNecklace, citrineNecklace, lapisLazuliPendant, roseQuartzPendant, lapisLazuliMensNecklace, upcycledEnamelPendant].forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      id: this.currentUserId++, 
      ...insertUser,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date() 
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.stripeCustomerId = customerId;
    if (subscriptionId) {
      user.stripeSubscriptionId = subscriptionId;
    }
    this.users.set(userId, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    for (const category of this.categories.values()) {
      if (category.slug === slug) {
        return category;
      }
    }
    return undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = { 
      id: this.currentCategoryId++, 
      ...insertCategory 
    };
    this.categories.set(category.id, category);
    return category;
  }

  // Product operations
  async getProducts(categoryId?: number): Promise<ProductWithCategory[]> {
    const products = Array.from(this.products.values()).filter(p => p.isActive);
    const filteredProducts = categoryId ? products.filter(p => p.categoryId === categoryId) : products;
    
    return filteredProducts.map(product => ({
      ...product,
      category: this.categories.get(product.categoryId!)!
    }));
  }

  async getProduct(id: number): Promise<ProductWithCategory | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    return {
      ...product,
      category: this.categories.get(product.categoryId!)!
    };
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    for (const product of this.products.values()) {
      if (product.sku === sku) {
        return product;
      }
    }
    return undefined;
  }

  async getFeaturedProducts(): Promise<ProductWithCategory[]> {
    const featuredProducts = Array.from(this.products.values()).filter(p => p.isFeatured && p.isActive);
    
    return featuredProducts.map(product => ({
      ...product,
      category: this.categories.get(product.categoryId!)!
    }));
  }

  async searchProducts(query: string): Promise<ProductWithCategory[]> {
    const lowercaseQuery = query.toLowerCase();
    const matchingProducts = Array.from(this.products.values()).filter(product => 
      product.isActive && (
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.materials?.some(material => material.toLowerCase().includes(lowercaseQuery)) ||
        product.gemstones?.some(gemstone => gemstone.toLowerCase().includes(lowercaseQuery))
      )
    );

    return matchingProducts.map(product => ({
      ...product,
      category: this.categories.get(product.categoryId!)!
    }));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = { 
      id: this.currentProductId++, 
      ...insertProduct,
      createdAt: new Date() 
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProductStock(productId: number, quantity: number): Promise<Product> {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    product.stockQuantity = quantity;
    this.products.set(productId, product);
    return product;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const cartItems = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    
    return cartItems.map(item => {
      const product = this.products.get(item.productId)!;
      const category = this.categories.get(product.categoryId!)!;
      return {
        ...item,
        product: {
          ...product,
          category
        }
      };
    });
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const cartItem: CartItem = { 
      id: this.currentCartItemId++, 
      ...insertItem,
      createdAt: new Date() 
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    for (const [id, item] of this.cartItems.entries()) {
      if (item.sessionId === sessionId) {
        this.cartItems.delete(id);
      }
    }
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = { 
      id: this.currentOrderId++, 
      ...insertOrder,
      createdAt: new Date() 
    };
    this.orders.set(order.id, order);
    return order;
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const orderItem: OrderItem = { 
      id: this.currentOrderItemId++, 
      ...insertOrderItem,
      createdAt: new Date() 
    };
    this.orderItems.set(orderItem.id, orderItem);
    return orderItem;
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const orderItems = Array.from(this.orderItems.values()).filter(item => item.orderId === id);
    const orderItemsWithProducts = orderItems.map(item => {
      const product = this.products.get(item.productId)!;
      const category = this.categories.get(product.categoryId!)!;
      return {
        ...item,
        product: {
          ...product,
          category
        }
      };
    });

    return {
      ...order,
      items: orderItemsWithProducts
    };
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    this.orders.set(id, order);
    return order;
  }

  // Contact operations
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const submission: ContactSubmission = { 
      id: this.currentContactId++, 
      ...insertSubmission,
      createdAt: new Date() 
    };
    this.contactSubmissions.set(submission.id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
}

export const storage = new MemStorage();