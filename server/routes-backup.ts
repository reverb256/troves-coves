import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, insertContactSubmissionSchema } from "@shared/schema";
import { getEtsyLinkForProduct } from "./etsy-links";
import { z } from "zod";

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
      
      const updatedItem = await storage.updateCartQuantity(id, quantity);
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
      
      const etsyLink = getEtsyLinkForProduct(product);
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

  const httpServer = createServer(app);
  return httpServer;
}