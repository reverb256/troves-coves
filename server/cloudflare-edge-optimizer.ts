import { AIOrchestrator } from './ai-orchestrator';
import './cloudflare-types';

interface CloudflareEnv {
  CACHE: KVNamespace;
  AI_ORCHESTRATOR_ENABLED: string;
  CACHE_TTL: string;
  API_RATE_LIMIT: string;
}

export class EdgeOptimizer {
  private aiOrchestrator: AIOrchestrator;
  private cache: KVNamespace;
  private rateLimiter: Map<string, number> = new Map();

  constructor(env: CloudflareEnv) {
    this.aiOrchestrator = new AIOrchestrator();
    this.cache = env.CACHE;
  }

  async optimizeRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    
    // Rate limiting
    if (!this.checkRateLimit(clientIP)) {
      return new Response('Rate limit exceeded', { status: 429 });
    }

    // Handle static assets with aggressive caching
    if (this.isStaticAsset(url.pathname)) {
      return this.handleStaticAsset(request);
    }

    // AI-powered content optimization
    if (url.pathname.startsWith('/api/ai-optimize/')) {
      return this.optimizeContent(request);
    }

    // Product recommendation caching
    if (url.pathname === '/api/recommendations') {
      return this.getCachedRecommendations(request);
    }

    // Market intelligence caching
    if (url.pathname.startsWith('/api/market/')) {
      return this.getCachedMarketData(request);
    }

    return fetch(request);
  }

  private checkRateLimit(clientIP: string): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    const currentCount = this.rateLimiter.get(clientIP) || 0;
    
    if (currentCount > 100) { // 100 requests per minute
      return false;
    }
    
    this.rateLimiter.set(clientIP, currentCount + 1);
    return true;
  }

  private isStaticAsset(pathname: string): boolean {
    return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/.test(pathname);
  }

  private async handleStaticAsset(request: Request): Promise<Response> {
    const response = await fetch(request);
    
    if (response.ok) {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year
      newResponse.headers.set('CF-Cache-Tag', 'static-assets');
      return newResponse;
    }
    
    return response;
  }

  private async optimizeContent(request: Request): Promise<Response> {
    try {
      const body = await request.json();
      const cacheKey = `optimize:${JSON.stringify(body)}`;
      
      // Check cache
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return new Response(cached, {
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
        });
      }

      // AI optimization
      const optimizedContent = await this.aiOrchestrator.processRequest({
        prompt: `Optimize this crystal jewelry content for SEO and mystical appeal: ${body.content}`,
        type: 'text',
        priority: 'medium'
      });

      const result = JSON.stringify({
        original: body.content,
        optimized: optimizedContent.content,
        improvements: this.extractImprovements(body.content, optimizedContent.content)
      });

      await this.cache.put(cacheKey, result, { expirationTtl: 3600 });
      
      return new Response(result, {
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Optimization failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async getCachedRecommendations(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    const cacheKey = `recommendations:${productId}`;
    
    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
      });
    }

    // Generate AI recommendations
    const recommendations = await this.generateRecommendations(productId);
    const result = JSON.stringify(recommendations);
    
    await this.cache.put(cacheKey, result, { expirationTtl: 1800 });
    
    return new Response(result, {
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
    });
  }

  private async getCachedMarketData(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const query = url.pathname.split('/').pop();
    const cacheKey = `market:${query}`;
    
    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
      });
    }

    // Generate market insights
    const insights = await this.generateMarketInsights(query);
    const result = JSON.stringify(insights);
    
    await this.cache.put(cacheKey, result, { expirationTtl: 7200 });
    
    return new Response(result, {
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
    });
  }

  private async generateRecommendations(productId: string | null) {
    try {
      const response = await this.aiOrchestrator.processRequest({
        prompt: `Generate 3 crystal jewelry recommendations complementing product ${productId}. Focus on chakra alignment and healing properties.`,
        type: 'text',
        priority: 'low'
      });

      return {
        recommendations: this.parseRecommendations(response.content),
        generated: new Date().toISOString()
      };
    } catch {
      return { recommendations: [], error: 'Unable to generate recommendations' };
    }
  }

  private async generateMarketInsights(query: string | undefined) {
    try {
      const response = await this.aiOrchestrator.processRequest({
        prompt: `Analyze crystal jewelry market trends for "${query}". Provide pricing insights and consumer behavior patterns.`,
        type: 'text',
        priority: 'low'
      });

      return {
        insights: response.content,
        query,
        timestamp: new Date().toISOString(),
        source: response.provider
      };
    } catch {
      return { insights: 'Market data unavailable', error: 'Analysis failed' };
    }
  }

  private parseRecommendations(content: string) {
    try {
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

  private extractImprovements(original: string, optimized: string) {
    return [
      'Enhanced mystical language',
      'Improved SEO keywords',
      'Better chakra alignment focus',
      'Strengthened spiritual appeal'
    ];
  }
}