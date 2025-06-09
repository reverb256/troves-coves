/**
 * Cloudflare Worker for Domain Fallback to GitHub Pages
 * 
 * This worker provides automatic failover from the primary Replit platform
 * to the GitHub Pages static demo when the main service is unavailable.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Primary platform configuration
    const primaryOrigin = 'https://your-repl-name.replit.app';
    const fallbackOrigin = 'https://username.github.io/troves-coves-demo';
    
    // Health check timeout (3 seconds)
    const healthCheckTimeout = 3000;
    
    try {
      // Attempt to reach primary platform
      const primaryRequest = new Request(primaryOrigin + url.pathname + url.search, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      
      // Set timeout for primary request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), healthCheckTimeout);
      
      const primaryResponse = await fetch(primaryRequest, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // If primary platform responds successfully, return its response
      if (primaryResponse.ok) {
        return primaryResponse;
      }
      
      // If primary platform returns error, fall back to GitHub Pages
      throw new Error(`Primary platform returned ${primaryResponse.status}`);
      
    } catch (error) {
      console.log(`Primary platform unavailable: ${error.message}`);
      
      // Fallback to GitHub Pages static demo
      const fallbackRequest = new Request(fallbackOrigin + url.pathname + url.search, {
        method: 'GET', // GitHub Pages only supports GET requests
        headers: {
          'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
          'Accept': request.headers.get('Accept') || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      
      try {
        const fallbackResponse = await fetch(fallbackRequest);
        
        if (fallbackResponse.ok) {
          // Add header to indicate fallback mode
          const response = new Response(fallbackResponse.body, fallbackResponse);
          response.headers.set('X-Fallback-Mode', 'github-pages');
          response.headers.set('X-Fallback-Notice', 'Serving static demo from GitHub Pages');
          
          return response;
        }
        
        // If both primary and fallback fail, return error page
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Troves & Coves - Temporarily Unavailable</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                background: linear-gradient(135deg, hsl(43, 40%, 95%), hsl(43, 35%, 92%));
                color: hsl(25, 30%, 3%);
                text-align: center; 
                padding: 2rem;
                margin: 0;
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: hsl(43, 45%, 97%);
                padding: 3rem;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              }
              h1 { 
                color: hsl(174, 75%, 20%); 
                font-size: 2.5rem;
                margin-bottom: 1rem;
              }
              .logo {
                font-size: 3rem;
                margin-bottom: 2rem;
              }
              .troves {
                color: hsl(174, 75%, 20%);
                font-weight: bold;
                font-family: 'Arial Black', sans-serif;
              }
              .coves {
                color: hsl(200, 65%, 20%);
                font-style: italic;
                font-family: cursive;
              }
              p { 
                font-size: 1.2rem; 
                line-height: 1.6;
                margin-bottom: 2rem;
              }
              .retry-btn {
                background: hsl(174, 75%, 20%);
                color: white;
                padding: 1rem 2rem;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: background 0.3s;
              }
              .retry-btn:hover {
                background: hsl(174, 85%, 25%);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <span class="troves">TROVES</span> & <span class="coves">Coves</span>
              </div>
              <h1>Temporarily Unavailable</h1>
              <p>
                Our mystical sanctuary is currently undergoing spiritual maintenance. 
                Please try again in a few moments as we restore the sacred connection.
              </p>
              <button class="retry-btn" onclick="window.location.reload()">
                Reconnect to Sacred Space
              </button>
            </div>
          </body>
          </html>
        `, {
          status: 503,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Retry-After': '60',
          },
        });
        
      } catch (fallbackError) {
        console.log(`Fallback also failed: ${fallbackError.message}`);
        return new Response('Service temporarily unavailable', { status: 503 });
      }
    }
  },
};