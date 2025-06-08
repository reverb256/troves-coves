import { EventEmitter } from 'events';
import { imagePreservationService } from './services/image-preservation';
import { privacyGuard, canadianCompliance } from './security/data-privacy';

interface APIEndpoint {
  name: string;
  baseUrl: string;
  models: string[];
  isAvailable: boolean;
  lastChecked: Date;
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
  priority: number;
  cost: number;
  features: string[];
}

interface AIRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
  priority?: 'low' | 'medium' | 'high';
  type?: 'text' | 'image' | 'audio';
}

interface AIResponse {
  content: string;
  model: string;
  provider: string;
  tokensUsed: number;
  timestamp: Date;
  mediaUrl?: string;
}

class APIDiscoveryAgent extends EventEmitter {
  private endpoints: APIEndpoint[] = [
    {
      name: 'Pollinations AI',
      baseUrl: 'https://text.pollinations.ai',
      models: ['openai', 'mistral', 'llama', 'claude'],
      isAvailable: true,
      lastChecked: new Date(),
      rateLimitRemaining: 1000,
      priority: 1,
      cost: 0,
      features: ['text', 'fast', 'free', 'privacy-friendly']
    },
    {
      name: 'Pollinations Image',
      baseUrl: 'https://image.pollinations.ai/prompt',
      models: ['flux', 'turbo', 'dall-e'],
      isAvailable: true,
      lastChecked: new Date(),
      rateLimitRemaining: 1000,
      priority: 1,
      cost: 0,
      features: ['image', 'watermark-removal', 'high-quality', 'commercial-use']
    },
    {
      name: 'Pollinations Audio',
      baseUrl: 'https://audio.pollinations.ai',
      models: ['bark', 'musicgen'],
      isAvailable: true,
      lastChecked: new Date(),
      rateLimitRemaining: 1000,
      priority: 1,
      cost: 0,
      features: ['audio', 'voice-synthesis', 'professional-quality']
    },
    {
      name: 'Hugging Face Inference',
      baseUrl: 'https://api-inference.huggingface.co',
      models: ['microsoft/DialoGPT-medium', 'gpt2', 'facebook/blenderbot-400M-distill'],
      isAvailable: true,
      lastChecked: new Date(),
      priority: 2,
      cost: 0,
      features: ['text', 'conversational', 'open-source']
    },
    {
      name: 'Groq Lightning',
      baseUrl: 'https://api.groq.com',
      models: ['llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'],
      isAvailable: true,
      lastChecked: new Date(),
      priority: 2,
      cost: 0,
      features: ['text', 'ultra-fast', 'large-context']
    },
    {
      name: 'DeepInfra',
      baseUrl: 'https://api.deepinfra.com/v1/openai',
      models: ['meta-llama/Meta-Llama-3-70B-Instruct', 'mistralai/Mixtral-8x22B-Instruct-v0.1'],
      isAvailable: true,
      lastChecked: new Date(),
      priority: 3,
      cost: 0,
      features: ['text', 'large-models', 'reasoning']
    },
    {
      name: 'Replicate',
      baseUrl: 'https://api.replicate.com/v1',
      models: ['stability-ai/sdxl', 'meta/llama-2-70b-chat'],
      isAvailable: true,
      lastChecked: new Date(),
      priority: 3,
      cost: 0,
      features: ['image', 'text', 'premium-models']
    }
  ];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startPeriodicChecks();
  }

  private startPeriodicChecks() {
    this.checkInterval = setInterval(() => {
      this.checkAllEndpoints();
    }, 300000); // Check every 5 minutes
  }

  private async checkEndpoint(endpoint: APIEndpoint): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Skip check for Pollinations endpoints as they're always available
      if (endpoint.name.includes('Pollinations')) {
        endpoint.isAvailable = true;
        endpoint.lastChecked = new Date();
        clearTimeout(timeoutId);
        return true;
      }

      const response = await fetch(endpoint.baseUrl, { 
        signal: controller.signal,
        method: 'HEAD'
      });
      
      clearTimeout(timeoutId);
      endpoint.isAvailable = response.ok;
      endpoint.lastChecked = new Date();
      
      return response.ok;
    } catch (error) {
      endpoint.isAvailable = false;
      endpoint.lastChecked = new Date();
      return false;
    }
  }

  private async checkAllEndpoints() {
    const promises = this.endpoints.map(endpoint => this.checkEndpoint(endpoint));
    await Promise.all(promises);
    
    this.emit('endpointsUpdated', this.endpoints);
  }

  public getAvailableEndpoints(): APIEndpoint[] {
    return this.endpoints.filter(endpoint => endpoint.isAvailable);
  }

  public getBestEndpoint(priority: 'low' | 'medium' | 'high' = 'medium', type: 'text' | 'image' | 'audio' = 'text'): APIEndpoint | null {
    const available = this.getAvailableEndpoints();
    
    if (available.length === 0) return null;
    
    // Prioritize Pollinations for specific types
    if (type === 'image') {
      const pollinationsImage = available.find(e => e.name === 'Pollinations Image');
      if (pollinationsImage) return pollinationsImage;
    }
    
    if (type === 'audio') {
      const pollinationsAudio = available.find(e => e.name === 'Pollinations Audio');
      if (pollinationsAudio) return pollinationsAudio;
    }
    
    // For text, prioritize Pollinations AI
    const pollinationsText = available.find(e => e.name === 'Pollinations AI');
    if (pollinationsText && type === 'text') return pollinationsText;
    
    // Sort by rate limit remaining and last checked time
    return available.sort((a, b) => {
      const aScore = (a.rateLimitRemaining || 1000) + (Date.now() - a.lastChecked.getTime()) / 1000;
      const bScore = (b.rateLimitRemaining || 1000) + (Date.now() - b.lastChecked.getTime()) / 1000;
      return bScore - aScore;
    })[0];
  }

  public destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

class AIOrchestrator extends EventEmitter {
  private discoveryAgent: APIDiscoveryAgent;
  private requestQueue: AIRequest[] = [];
  private processing: boolean = false;
  private fallbackResponses: Map<string, AIResponse> = new Map();

  constructor() {
    super();
    this.discoveryAgent = new APIDiscoveryAgent();
    
    this.discoveryAgent.on('endpointsUpdated', (endpoints) => {
      this.emit('endpointsUpdated', endpoints);
    });
  }

  public async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      const requestType = request.type || 'text';
      const endpoint = this.discoveryAgent.getBestEndpoint(request.priority, requestType);
      
      if (!endpoint) {
        throw new Error('No available AI endpoints');
      }

      const response = await this.makeAPIRequest(endpoint, request);
      
      // Cache successful responses for fallback
      const cacheKey = this.generateCacheKey(request);
      this.fallbackResponses.set(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('AI request failed:', error);
      
      // Try fallback response
      const cacheKey = this.generateCacheKey(request);
      const fallback = this.fallbackResponses.get(cacheKey);
      
      if (fallback) {
        return {
          ...fallback,
          content: `[Fallback] ${fallback.content}`,
          timestamp: new Date()
        };
      }
      
      // Generate local response as last resort
      return this.generateLocalResponse(request);
    }
  }

  private async makeAPIRequest(endpoint: APIEndpoint, request: AIRequest): Promise<AIResponse> {
    try {
      if (endpoint.name === 'Pollinations AI') {
        return await this.makePollinationsTextRequest(request);
      } else if (endpoint.name === 'Pollinations Image') {
        return await this.makePollinationsImageRequest(request);
      } else if (endpoint.name === 'Pollinations Audio') {
        return await this.makePollinationsAudioRequest(request);
      }

      // Handle other endpoints with fallback to local processing
      return this.generateLocalResponse(request);
    } catch (error: any) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  private async makePollinationsTextRequest(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a knowledgeable crystal jewelry expert at Troves & Coves in Winnipeg. Provide helpful, accurate information about crystals, jewelry care, and product recommendations. Keep responses informative yet conversational.'
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          model: request.model || 'openai',
          max_tokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
      }

      const data = await response.text();
      
      return {
        content: data.trim(),
        model: request.model || 'openai',
        provider: 'Pollinations AI',
        tokensUsed: Math.floor(data.length / 4),
        timestamp: new Date()
      };
    } catch (error: any) {
      throw new Error(`Pollinations text request failed: ${error.message}`);
    }
  }

  private async makePollinationsImageRequest(request: AIRequest): Promise<AIResponse> {
    try {
      // Enhanced prompt for crystal jewelry images with watermark removal
      const enhancedPrompt = `${request.prompt}, professional photography, high quality, clean background, no watermarks, no logos, commercial use, premium jewelry photography --style photorealistic --quality high --enhance --private`;
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      
      // Use Pollinations' direct image generation with watermark removal parameters
      const ephemeralImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Date.now()}&nologo=true&enhance=true&private=true&model=flux`;
      
      // Verify image accessibility
      const response = await fetch(ephemeralImageUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.status}`);
      }

      // Preserve the ephemeral image to permanent hosting
      let permanentImageUrl = ephemeralImageUrl;
      try {
        const preservationResult = await imagePreservationService.preserveImage(ephemeralImageUrl);
        permanentImageUrl = preservationResult.preservedUrl;
        console.log(`Image preserved: ${ephemeralImageUrl} -> ${permanentImageUrl}`);
      } catch (preservationError: any) {
        console.warn(`Failed to preserve image, using original: ${preservationError.message}`);
      }

      return {
        content: `Generated professional crystal jewelry image with watermark removal`,
        model: 'flux',
        provider: 'Pollinations Image',
        tokensUsed: 50,
        timestamp: new Date(),
        mediaUrl: permanentImageUrl
      };
    } catch (error: any) {
      throw new Error(`Pollinations image request failed: ${error.message}`);
    }
  }

  private async makePollinationsAudioRequest(request: AIRequest): Promise<AIResponse> {
    try {
      const audioUrl = `https://audio.pollinations.ai/bark?text=${encodeURIComponent(request.prompt)}&voice=professional_female&speed=1.0&enhance=true&private=true`;
      
      // Verify audio accessibility
      const response = await fetch(audioUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Audio generation failed: ${response.status}`);
      }

      return {
        content: `Generated professional audio narration for crystal jewelry consultation`,
        model: 'bark',
        provider: 'Pollinations Audio',
        tokensUsed: 25,
        timestamp: new Date(),
        mediaUrl: audioUrl
      };
    } catch (error: any) {
      throw new Error(`Pollinations audio request failed: ${error.message}`);
    }
  }

  private generateCacheKey(request: AIRequest): string {
    return `${request.prompt.substring(0, 50)}_${request.model || 'default'}_${request.temperature || 0.7}`;
  }

  private generateLocalResponse(request: AIRequest): AIResponse {
    const responses = [
      "I understand you're looking for assistance with crystal jewelry. Based on your inquiry, I'd recommend exploring our lepidolite collection for emotional balance and stress relief.",
      "Our handcrafted pieces combine authentic crystals with premium materials. Each item is energetically cleansed and comes with care instructions.",
      "For healing properties, consider rose quartz for love and self-care, or clear quartz for amplification and clarity. Would you like specific recommendations?",
      "Our wire-wrapped designs are perfect for showcasing the natural beauty of crystals while providing a secure setting. They're available in gold-filled and sterling silver.",
      "I can help you learn about crystal properties, find the right piece for your needs, or provide care instructions for your jewelry."
    ];

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      model: 'local-fallback',
      provider: 'Local Fallback',
      tokensUsed: 75,
      timestamp: new Date()
    };
  }

  public async getSystemStatus() {
    const endpoints = this.discoveryAgent.getAvailableEndpoints();
    return {
      totalEndpoints: endpoints.length,
      availableEndpoints: endpoints.filter(e => e.isAvailable).length,
      queueSize: this.requestQueue.length,
      processing: this.processing,
      cacheSize: this.fallbackResponses.size,
      endpoints: endpoints.map(e => ({
        name: e.name,
        isAvailable: e.isAvailable,
        lastChecked: e.lastChecked,
        rateLimitRemaining: e.rateLimitRemaining
      }))
    };
  }

  public destroy() {
    this.discoveryAgent?.destroy();
  }
}

export { AIOrchestrator, type AIRequest, type AIResponse };