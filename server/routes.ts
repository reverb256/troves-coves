import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { AIOrchestrator } from "./ai-orchestrator";
import { RAGAgent } from "./agents/rag-agent";
import { CustomerServiceAgent } from "./agents/customer-service-agent";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

// Initialize AI System
const aiOrchestrator = new AIOrchestrator();
const ragAgent = new RAGAgent(aiOrchestrator);
const customerServiceAgent = new CustomerServiceAgent(aiOrchestrator, ragAgent);

// Session management for cart
function getSessionId(req: any): string {
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
      res.status(500).json({ message: "Error fetching categories: " + error.message });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching category: " + error.message });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, search } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else if (category) {
        const categoryObj = await storage.getCategoryBySlug(category as string);
        products = await storage.getProducts(categoryObj?.id);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Cart operations
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching cart: " + error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding to cart: " + error.message });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(itemId, quantity);
      res.json(updatedItem);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating cart item: " + error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.removeFromCart(itemId);
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      res.status(500).json({ message: "Error removing from cart: " + error.message });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error: any) {
      res.status(500).json({ message: "Error clearing cart: " + error.message });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable." });
    }

    try {
      const { amount, currency = 'cad' } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: {
          sessionId: getSessionId(req)
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Order creation
  app.post("/api/orders", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const validatedOrderData = insertOrderSchema.parse({
        ...req.body,
        sessionId
      });
      
      // Get cart items to create order
      const cartItems = await storage.getCartItems(sessionId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate total
      const totalAmount = cartItems.reduce((sum, item) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0
      );
      
      // Create order
      const order = await storage.createOrder({
        ...validatedOrderData,
        totalAmount: totalAmount.toString()
      });
      
      // Add order items
      for (const cartItem of cartItems) {
        await storage.addOrderItem({
          orderId: order.id,
          productId: cartItem.productId!,
          quantity: cartItem.quantity,
          price: cartItem.product.price
        });
        
        // Update product stock
        const newStock = cartItem.product.stockQuantity - cartItem.quantity;
        await storage.updateProductStock(cartItem.productId!, Math.max(0, newStock));
      }
      
      // Clear cart after successful order
      await storage.clearCart(sessionId);
      
      res.json(order);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order: " + error.message });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Here you would typically send an email notification
      // For now, we'll just log it
      console.log("New contact submission:", submission);
      
      res.json({ message: "Contact form submitted successfully", id: submission.id });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error submitting contact form: " + error.message });
    }
  });

  // AI Assistant Endpoints
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await customerServiceAgent.handleCustomerInquiry(message, context);
      
      res.json({ 
        response,
        timestamp: new Date().toISOString(),
        agent: 'customer-service',
        suggestions: [
          "Tell me about crystal properties",
          "Help me find jewelry for anxiety relief",
          "What's your shipping to Winnipeg?",
          "Schedule a crystal consultation"
        ]
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "AI assistant temporarily unavailable", 
        fallback: "Please contact us directly for assistance"
      });
    }
  });

  app.get("/api/ai/crystal-info/:name", async (req, res) => {
    try {
      const crystalName = req.params.name;
      const crystalInfo = await ragAgent.lookupCrystalProperties(crystalName);
      
      res.json(crystalInfo);
    } catch (error: any) {
      res.status(500).json({ message: "Error retrieving crystal information" });
    }
  });

  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { intention, priceRange, style, crystalType } = req.body;
      
      const recommendTool = customerServiceAgent['tools'].get('recommend_products');
      if (!recommendTool) {
        return res.status(500).json({ message: "Recommendation service unavailable" });
      }
      
      const recommendations = await recommendTool.execute({
        intention,
        priceRange,
        style,
        crystalType
      });
      
      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ message: "Error generating recommendations" });
    }
  });

  app.get("/api/ai/shipping-info", async (req, res) => {
    try {
      const { location, orderValue } = req.query;
      
      const shippingInfo = await ragAgent.getShippingInfo(location as string);
      
      // Calculate costs if order value provided
      if (orderValue) {
        const value = parseFloat(orderValue as string);
        let cost = 0;
        
        if (shippingInfo.type === 'local' && value >= 75) {
          cost = 0;
        } else if (shippingInfo.type === 'local') {
          cost = 10;
        } else if (shippingInfo.type === 'national') {
          cost = Math.max(15, value * 0.08);
        } else {
          cost = Math.max(25, value * 0.12);
        }
        
        shippingInfo.calculatedCost = cost.toFixed(2);
        shippingInfo.freeShippingEligible = cost === 0;
      }
      
      res.json(shippingInfo);
    } catch (error: any) {
      res.status(500).json({ message: "Error retrieving shipping information" });
    }
  });

  app.get("/api/ai/system-status", async (req, res) => {
    try {
      const systemStatus = await aiOrchestrator.getSystemStatus();
      const agentStatuses = {
        ragAgent: ragAgent.getStatus(),
        customerService: customerServiceAgent.getStatus()
      };
      
      res.json({
        orchestrator: systemStatus,
        agents: agentStatuses,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error retrieving system status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
