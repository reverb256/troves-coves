/**
 * Cloudflare Worker for Troves and Coves
 * Handles AI orchestration, caching, and edge optimization
 */

import { AIOrchestrator } from './ai-orchestrator';

class CloudflareAIOrchestrator {
  constructor(env) {
    this.env = env;
    this.cache = env.CACHE;
    this.aiOrchestrator = new AIOrchestrator();
  }

  async handleRequest(request) {
    const url = new URL(request.url);
    const cacheKey = `cache:${url.pathname}:${url.search}`;

    // Check cache first
    if (request.method === 'GET') {
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return new Response(cached, {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    }

    // Route AI requests through orchestrator
    if (url.pathname.startsWith('/api/ai/')) {
      return this.handleAIRequest(request, cacheKey);
    }

    // Route product recommendations
    if (url.pathname === '/api/recommendations') {
      return this.handleRecommendations(request, cacheKey);
    }

    // Route market research
    if (url.pathname.startsWith('/api/scrape/')) {
      return this.handleMarketResearch(request, cacheKey);
    }

    // Forward to origin
    return fetch(request);
  }

  async handleAIRequest(request, cacheKey) {
    try {
      const body = await request.json();
      
      // Use AI orchestrator to find best available endpoint
      const response = await this.aiOrchestrator.processRequest({
        prompt: body.prompt,
        type: body.type || 'text',
        priority: body.priority || 'medium',
        maxTokens: body.maxTokens || 1024
      });

      const result = JSON.stringify(response);
      
      // Cache successful responses
      if (response && !response.error) {
        await this.cache.put(cacheKey, result, { expirationTtl: 1800 });
      }

      return new Response(result, {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'AI orchestration failed',
        fallback: true,
        message: 'Using local processing'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async handleRecommendations(request, cacheKey) {
    try {
      const url = new URL(request.url);
      const productId = url.searchParams.get('productId');
      const userId = url.searchParams.get('userId');

      // Generate personalized recommendations using AI
      const prompt = `Generate 3 crystal jewelry recommendations for user viewing product ${productId}. Focus on complementary healing properties and mystical aesthetics.`;
      
      const aiResponse = await this.aiOrchestrator.processRequest({
        prompt,
        type: 'text',
        priority: 'low'
      });

      const recommendations = this.parseRecommendations(aiResponse.content);
      const result = JSON.stringify({ recommendations });

      await this.cache.put(cacheKey, result, { expirationTtl: 3600 });

      return new Response(result, {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        recommendations: [],
        error: 'Recommendation system unavailable'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async handleMarketResearch(request, cacheKey) {
    try {
      const body = await request.json();
      
      const prompt = `Analyze crystal jewelry market trends for: ${body.query}. Provide insights on pricing, consumer preferences, and competitive landscape.`;
      
      const aiResponse = await this.aiOrchestrator.processRequest({
        prompt,
        type: 'text',
        priority: 'low',
        maxTokens: 2048
      });

      const result = JSON.stringify({
        insights: aiResponse.content,
        timestamp: new Date().toISOString(),
        source: aiResponse.provider
      });

      await this.cache.put(cacheKey, result, { expirationTtl: 7200 });

      return new Response(result, {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Market research unavailable',
        insights: 'Unable to fetch market data at this time'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  parseRecommendations(content) {
    try {
      // Extract product recommendations from AI response
      const lines = content.split('\n').filter(line => line.trim());
      return lines.slice(0, 3).map((line, index) => ({
        id: index + 1,
        title: line.replace(/^\d+\.?\s*/, ''),
        reason: 'Complementary healing properties'
      }));
    } catch {
      return [];
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    const orchestrator = new CloudflareAIOrchestrator(env);
    return orchestrator.handleRequest(request);
  }
};