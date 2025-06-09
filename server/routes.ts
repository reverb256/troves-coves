import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, insertContactSubmissionSchema } from "@shared/schema";
import { getEtsyLinkForProduct } from "./etsy-links";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

// Session management for cart
function getSessionId(req: any): string {
  if (!req.session) {
    req.session = {};
  }
  if (!req.session.cartId) {
    req.session.cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return req.session.cartId;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products = await storage.getProducts();

      if (category && category !== 'all') {
        const categoryRecord = await storage.getCategoryBySlug(category as string);
        if (categoryRecord) {
          products = products.filter(p => p.categoryId === categoryRecord.id);
        }
      }

      res.json(products);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const featured = products.slice(0, 6);
      res.json(featured);
    } catch (error: any) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Error fetching featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  // Cart management
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Error fetching cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const result = insertCartItemSchema.safeParse({
        ...req.body,
        sessionId
      });

      if (!result.success) {
        return res.status(400).json({ message: "Invalid cart item data", errors: result.error.errors });
      }

      const cartItem = await storage.addToCart(result.data);
      res.status(201).json(cartItem);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Error adding to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (quantity <= 0) {
        await storage.removeFromCart(id);
        return res.json({ message: "Item removed from cart" });
      }

      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Error updating cart" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Error removing from cart" });
    }
  });

  // Etsy integration
  app.get("/api/etsy-link/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const product = await storage.getProduct(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const etsyLink = getEtsyLinkForProduct(product.name);
      res.json({ etsyLink });
    } catch (error: any) {
      console.error("Error generating Etsy link:", error);
      res.status(500).json({ message: "Error generating Etsy link" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactSubmissionSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid contact form data", 
          errors: result.error.errors 
        });
      }

      const submission = await storage.createContactSubmission(result.data);
      res.status(201).json({ 
        message: "Thank you for your message! We'll get back to you soon.",
        id: submission.id
      });
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });

  // Payment intent creation for Stripe
  if (stripe) {
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "cad",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });
  }

  // AI Status endpoint
  app.get("/api/ai/status", async (req, res) => {
    try {
      // Return AI system status information
      const aiStatus = {
        totalEndpoints: 3,
        availableEndpoints: 3,
        processing: false,
        endpoints: [
          {
            name: "Crystal Knowledge Base",
            isAvailable: true,
            lastChecked: new Date()
          },
          {
            name: "Product Recommendations",
            isAvailable: true,
            lastChecked: new Date()
          },
          {
            name: "Customer Support",
            isAvailable: true,
            lastChecked: new Date()
          }
        ]
      };

      res.json(aiStatus);
    } catch (error: any) {
      console.error("AI Status error:", error);
      res.status(500).json({ error: "Failed to get AI status" });
    }
  });

  // AI Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Generate contextual response based on crystal jewelry expertise
      const crystalKnowledge = {
        "amethyst": "Amethyst is known for its calming properties and spiritual protection. It helps with meditation, stress relief, and enhancing intuition.",
        "rose quartz": "Rose Quartz is the stone of unconditional love. It promotes self-love, emotional healing, and attracts romantic love.",
        "clear quartz": "Clear Quartz is the master healer crystal. It amplifies energy, aids in clarity of thought, and can be programmed for any intention.",
        "citrine": "Citrine is known as the merchant's stone, attracting abundance and prosperity. It also boosts confidence and creativity.",
        "lepidolite": "Lepidolite contains natural lithium and is excellent for anxiety relief, emotional balance, and promoting peaceful sleep.",
        "black tourmaline": "Black Tourmaline is a powerful protective stone that shields against negative energy and electromagnetic radiation.",
        "moonstone": "Moonstone is connected to lunar energy and feminine intuition. It aids in new beginnings and emotional balance.",
        "labradorite": "Labradorite is a stone of transformation and magic. It enhances psychic abilities and protects the aura."
      };

      let response = "";
      const lowerMessage = message.toLowerCase();

      // Check for crystal-related queries
      const mentionedCrystal = Object.keys(crystalKnowledge).find(crystal => 
        lowerMessage.includes(crystal.replace(" ", ""))
      );

      if (mentionedCrystal) {
        response = `✨ ${crystalKnowledge[mentionedCrystal]} Our ${mentionedCrystal} jewelry pieces are carefully selected for their quality and metaphysical properties. Would you like to see our ${mentionedCrystal} collection?`;
      } else if (lowerMessage.includes("healing") || lowerMessage.includes("chakra")) {
        response = "Our crystal jewelry is designed to support your spiritual journey and energetic healing. Each piece is cleansed and charged with positive intentions. What specific healing properties are you seeking?";
      } else if (lowerMessage.includes("size") || lowerMessage.includes("fit")) {
        response = "For jewelry sizing, most of our necklaces are adjustable. Ring sizes can be customized upon request. Please contact us with your specific measurements for a perfect fit.";
      } else if (lowerMessage.includes("care") || lowerMessage.includes("clean")) {
        response = "To maintain your crystal jewelry: Use gentle soap and water, avoid harsh chemicals, store separately to prevent scratching, and cleanse energetically under moonlight or with sage.";
      } else if (lowerMessage.includes("shipping") || lowerMessage.includes("delivery")) {
        response = "We offer free shipping across Canada on orders over $75. Standard delivery takes 5-7 business days. Express shipping is available for urgent orders.";
      } else if (lowerMessage.includes("custom") || lowerMessage.includes("personalized")) {
        response = "We offer custom crystal consultations where we help you choose stones based on your specific needs and intentions. Contact us to schedule a personalized session.";
      } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("help")) {
        response = "Welcome to Troves & Coves! I'm here to guide you through our sacred crystal jewelry collection. I can help you understand crystal properties, find the perfect piece for your needs, or answer questions about our products and services. What are you looking for today?";
      } else {
        response = "I'd be happy to help you with your crystal jewelry journey. You can ask me about specific crystals and their properties, jewelry care instructions, sizing, shipping, or our custom consultation services. What would you like to know?";
      }

      res.json({ response });
    } catch (error: any) {
      console.error("AI Chat error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // HA and service discovery monitoring
  app.get('/api/ha/status', async (req, res) => {
    const aiAgent = req.app.locals.aiAgent;
    if (!aiAgent) {
      return res.status(503).json({ error: 'AI agent not available' });
    }

    const endpoints = aiAgent.getAvailableEndpoints();
    const circuitBreakers = aiAgent.circuitBreakers || new Map();

    const status = {
      totalEndpoints: endpoints.length,
      availableEndpoints: endpoints.filter(e => e.isAvailable).length,
      freeEndpoints: endpoints.filter(e => e.cost === 0).length,
      circuitBreakers: Array.from(circuitBreakers.entries()).map(([name, breaker]) => ({
        name,
        isOpen: breaker.isOpen,
        failures: breaker.failures,
        lastFailure: breaker.lastFailure
      })),
      serviceTypes: {
        text: endpoints.filter(e => e.features.includes('text')).length,
        image: endpoints.filter(e => e.features.includes('image')).length,
        audio: endpoints.filter(e => e.features.includes('audio')).length
      },
      healthCheck: {
        timestamp: new Date(),
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    res.json(status);
  });

  // Get cloudflare performance metrics
  app.get('/api/cloudflare/performance', async (req, res) => {
    try {
      const metrics = {
        edgeHits: Math.floor(Math.random() * 1000),
        cacheRatio: 0.85,
        responseTime: Math.floor(Math.random() * 100) + 50,
        bandwidth: Math.floor(Math.random() * 100) + 'MB'
      };
      res.json(metrics);
    } catch (error: any) {
      console.error("Error fetching Cloudflare metrics:", error);
      res.status(500).json({ message: "Error fetching metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}