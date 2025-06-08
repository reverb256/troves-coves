import { EventEmitter } from 'events';

// Free AI API Endpoints Configuration
interface APIEndpoint {
  name: string;
  baseUrl: string;
  models: string[];
  isAvailable: boolean;
  lastChecked: Date;
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
}

interface AIRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface AIResponse {
  content: string;
  model: string;
  provider: string;
  tokensUsed: number;
  timestamp: Date;
}

class APIDiscoveryAgent extends EventEmitter {
  private endpoints: APIEndpoint[] = [
    {
      name: 'Hugging Face Inference',
      baseUrl: 'https://api-inference.huggingface.co',
      models: ['microsoft/DialoGPT-medium', 'gpt2', 'facebook/blenderbot-400M-distill'],
      isAvailable: true,
      lastChecked: new Date()
    },
    {
      name: 'OpenAI Community',
      baseUrl: 'https://api.openai-hk.com',
      models: ['gpt-3.5-turbo'],
      isAvailable: true,
      lastChecked: new Date()
    },
    {
      name: 'Groq Free',
      baseUrl: 'https://api.groq.com',
      models: ['llama3-8b-8192', 'mixtral-8x7b-32768'],
      isAvailable: true,
      lastChecked: new Date()
    },
    {
      name: 'Together AI Free',
      baseUrl: 'https://api.together.xyz',
      models: ['togethercomputer/RedPajama-INCITE-7B-Chat'],
      isAvailable: true,
      lastChecked: new Date()
    }
  ];

  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startPeriodicChecks();
  }

  private startPeriodicChecks() {
    // Check API availability every 5 minutes
    this.checkInterval = setInterval(() => {
      this.checkAllEndpoints();
    }, 5 * 60 * 1000);

    // Initial check
    this.checkAllEndpoints();
  }

  private async checkEndpoint(endpoint: APIEndpoint): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${endpoint.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      endpoint.isAvailable = response.ok;
      endpoint.lastChecked = new Date();
      
      // Parse rate limit headers if available
      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
      const rateLimitReset = response.headers.get('x-ratelimit-reset');
      
      if (rateLimitRemaining) {
        endpoint.rateLimitRemaining = parseInt(rateLimitRemaining);
      }
      
      if (rateLimitReset) {
        endpoint.rateLimitReset = new Date(parseInt(rateLimitReset) * 1000);
      }
      
      return endpoint.isAvailable;
    } catch (error) {
      console.warn(`API check failed for ${endpoint.name}:`, error);
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

  public getBestEndpoint(priority: 'low' | 'medium' | 'high' = 'medium'): APIEndpoint | null {
    const available = this.getAvailableEndpoints();
    
    if (available.length === 0) return null;
    
    // Sort by rate limit remaining and last checked time
    return available.sort((a, b) => {
      const aScore = (a.rateLimitRemaining || 1000) + (Date.now() - a.lastChecked.getTime()) / 1000;
      const bScore = (b.rateLimitRemaining || 1000) + (Date.now() - b.lastChecked.getTime()) / 1000;
      return bScore - aScore;
    })[0];
  }

  public async discoverNewEndpoints(): Promise<APIEndpoint[]> {
    // List of potential free AI API endpoints to discover
    const potentialEndpoints = [
      'https://api.deepai.org',
      'https://api.cohere.ai',
      'https://api.replicate.com',
      'https://api.banana.dev'
    ];

    const discovered: APIEndpoint[] = [];

    for (const url of potentialEndpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${url}/models`, { 
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (data.models && Array.isArray(data.models)) {
            discovered.push({
              name: `Discovered: ${new URL(url).hostname}`,
              baseUrl: url,
              models: data.models.map((m: any) => m.id || m.name).slice(0, 5),
              isAvailable: true,
              lastChecked: new Date()
            });
          }
        }
      } catch (error) {
        // Endpoint not available or doesn't follow expected format
      }
    }

    return discovered;
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
      const endpoint = this.discoveryAgent.getBestEndpoint(request.priority);
      
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
    const model = request.model || endpoint.models[0];
    
    let requestBody: any = {
      prompt: request.prompt,
      max_tokens: request.maxTokens || 150,
      temperature: request.temperature || 0.7
    };

    // Adapt request format based on endpoint
    if (endpoint.name.includes('Hugging Face')) {
      requestBody = {
        inputs: request.prompt,
        parameters: {
          max_length: request.maxTokens || 150,
          temperature: request.temperature || 0.7
        }
      };
    } else if (endpoint.name.includes('OpenAI')) {
      requestBody = {
        model: model,
        messages: [{ role: 'user', content: request.prompt }],
        max_tokens: request.maxTokens || 150,
        temperature: request.temperature || 0.7
      };
    }

    const response = await fetch(`${endpoint.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse response based on endpoint format
    let content = '';
    let tokensUsed = 0;

    if (data.choices && data.choices[0]) {
      content = data.choices[0].message?.content || data.choices[0].text || '';
      tokensUsed = data.usage?.total_tokens || 0;
    } else if (data.generated_text) {
      content = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      content = data[0].generated_text;
    }

    return {
      content: content.trim(),
      model: model,
      provider: endpoint.name,
      tokensUsed,
      timestamp: new Date()
    };
  }

  private generateCacheKey(request: AIRequest): string {
    return `${request.prompt.substring(0, 100)}_${request.maxTokens}_${request.temperature}`;
  }

  private generateLocalResponse(request: AIRequest): AIResponse {
    // Simple local response generation for fallback
    const responses = [
      "I understand your request. Let me help you with that based on the information available.",
      "I'll assist you with this task. Here's what I can provide based on current data.",
      "Based on your request, I can offer the following guidance and assistance.",
      "I'm here to help. Let me provide you with the best information I have available."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      content: `[Local Fallback] ${randomResponse}`,
      model: 'local-fallback',
      provider: 'Local System',
      tokensUsed: 0,
      timestamp: new Date()
    };
  }

  public async getSystemStatus() {
    const endpoints = this.discoveryAgent.getAvailableEndpoints();
    return {
      availableEndpoints: endpoints.length,
      totalEndpoints: this.discoveryAgent['endpoints'].length,
      queueLength: this.requestQueue.length,
      lastUpdate: new Date(),
      endpoints: endpoints.map(e => ({
        name: e.name,
        models: e.models,
        available: e.isAvailable,
        rateLimitRemaining: e.rateLimitRemaining
      }))
    };
  }

  public destroy() {
    this.discoveryAgent.destroy();
  }
}

export { AIOrchestrator, APIDiscoveryAgent, AIRequest, AIResponse };