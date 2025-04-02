// Counter state (in a real app, this would be in a database)
let counter = 0;

// Content types for different file extensions
const CONTENT_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

/**
 * Get the content type for a file based on its extension
 */
function getContentType(path: string): string {
  for (const [ext, type] of Object.entries(CONTENT_TYPES)) {
    if (path.endsWith(ext)) {
      return type;
    }
  }
  return "text/plain";
}

/**
 * Serve a static file from the file system
 */
async function serveFile(path: string): Promise<Response> {
  try {
    // Remove leading slash and normalize path
    path = path.replace(/^\//, "");
    // Default to index.html for root path
    if (path === "" || path === "/") {
      path = "index.html";
    }

    // Try to read the file
    const file = await Deno.open(path, { read: true });
    const contentType = getContentType(path);

    // Return the file as a streaming response
    return new Response(file.readable, {
      headers: {
        "content-type": contentType,
      },
    });
  } catch (e) {
    // File not found or can't be read
    console.error(`Error serving file: ${path}`, e);
    return new Response("Not Found", { status: 404 });
  }
}

/**
 * Main request handler
 */
async function requestHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Check if it's an HTMX request
  const isHtmx = req.headers.get("HX-Request") === "true";

  // Handle API requests
  if (path.startsWith("/api/")) {
    // Counter API
    if (path === "/api/counter/value") {
      // Get counter value
      const className = counter % 2 === 0 ? "counter-value even" : "counter-value odd";

      if (isHtmx) {
        return new Response(
          `<div class="${className}">${counter}</div>`,
          {
            headers: { "Content-Type": "text/html" }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ value: counter }),
          {
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    } else if (path === "/api/counter/increment" && method === "POST") {
      // Increment counter
      counter++;

      const className = counter % 2 === 0 ? "counter-value even" : "counter-value odd";

      if (isHtmx) {
        return new Response(
          `<div class="${className}">${counter}</div>`,
          {
            headers: { "Content-Type": "text/html" }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ value: counter }),
          {
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    } else if (path === "/api/counter/decrement" && method === "POST") {
      // Decrement counter
      counter--;

      const className = counter % 2 === 0 ? "counter-value even" : "counter-value odd";

      if (isHtmx) {
        return new Response(
          `<div class="${className}">${counter}</div>`,
          {
            headers: { "Content-Type": "text/html" }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ value: counter }),
          {
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    } else if (path === "/api/counter/reset" && method === "POST") {
      // Reset counter
      counter = 0;

      const className = counter % 2 === 0 ? "counter-value even" : "counter-value odd";

      if (isHtmx) {
        return new Response(
          `<div class="${className}">${counter}</div>`,
          {
            headers: { "Content-Type": "text/html" }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ value: counter }),
          {
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    } else if (path === "/api/counter/oob" && method === "POST") {
      // Update all counter instances at once with out-of-band swaps
      counter++;

      const className = counter % 2 === 0 ? "counter-value even" : "counter-value odd";

      if (isHtmx) {
        return new Response(
          `<div id="counter-value" hx-swap-oob="true" class="${className}">${counter}</div>
           <div id="realtime-counter" hx-swap-oob="true" class="${className}">${counter}</div>
           <span id="counter-oob" hx-swap-oob="true">${counter}</span>
           <div>Counter updated to: ${counter}</div>`,
          {
            headers: { "Content-Type": "text/html" }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ value: counter }),
          {
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // Unknown API endpoint
    return new Response("API Endpoint Not Found", { status: 404 });
  }

  // Serve the main HTML page
  if (path === "/" || path === "/index.html") {
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deno HTMX Counter</title>
        <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
          
          .counter-component {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin: 1rem 0;
          }
          
          .counter-title {
            margin-top: 0;
            color: #2c3e50;
          }
          
          .counter-value {
            font-size: 2rem;
            font-weight: bold;
            margin: 1rem 0;
          }
          
          .counter-value.even { color: #3498db; }
          .counter-value.odd { color: #e74c3c; }
          
          .counter-controls {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          
          .counter-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            background: #3498db;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
          }
          
          .counter-btn:hover { background: #2980b9; }
          .counter-btn.decrement { background: #e74c3c; }
          .counter-btn.decrement:hover { background: #c0392b; }
          .counter-btn.reset { background: #95a5a6; }
          .counter-btn.reset:hover { background: #7f8c8d; }
        </style>
      </head>
      <body>
        <h1>Deno HTMX Counter Example</h1>
        
        <p>This example demonstrates using HTMX with Deno's native HTTP server.</p>
        
        <div class="counter-component">
          <h2 class="counter-title">Server-side Counter</h2>
          
          <div id="counter-value" hx-get="/api/counter/value" hx-trigger="load">
            Loading...
          </div>
          
          <div class="counter-controls">
            <button 
              class="counter-btn decrement" 
              hx-post="/api/counter/decrement" 
              hx-target="#counter-value"
            >
              Decrement
            </button>
            
            <button 
              class="counter-btn" 
              hx-post="/api/counter/increment" 
              hx-target="#counter-value"
            >
              Increment
            </button>
            
            <button 
              class="counter-btn reset" 
              hx-post="/api/counter/reset" 
              hx-target="#counter-value"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div class="counter-component">
          <h2 class="counter-title">Real-time Counter</h2>
          <p>Updates every 2 seconds from the server</p>
          
          <div 
            id="realtime-counter"
            hx-get="/api/counter/value" 
            hx-trigger="load, every 2s"
          >
            Loading...
          </div>
        </div>
        
        <div class="counter-component">
          <h2 class="counter-title">Out-of-band Counter Update</h2>
          <p>Demonstrates how to update multiple elements at once</p>
          
          <div id="counter-display">
            Current value: <span id="counter-oob">Loading...</span>
          </div>
          
          <div class="counter-controls">
            <button 
              class="counter-btn" 
              hx-post="/api/counter/oob" 
              hx-target="#counter-display"
            >
              Update All Counters
            </button>
          </div>
        </div>
      </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" }
      }
    );
  }

  // Try to serve a static file
  return await serveFile(path);
}

// Start the HTTP server
const port = 8000;
console.log(`HTTP server running at http://localhost:${port}/`);

// Use the native Deno.serve API
Deno.serve({ port }, requestHandler);