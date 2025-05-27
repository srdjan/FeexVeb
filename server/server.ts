let counter = 0;

import FeexVeb from "../lib/feexveb.js";
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

function getContentType(path: string): string {
  for (const [ext, type] of Object.entries(CONTENT_TYPES)) {
    if (path.endsWith(ext)) {
      return type;
    }
  }
  return "text/plain";
}

async function serveFile(path: string): Promise<Response> {
  try {
    path = path.replace(/^\//, "");
    if (path === "" || path === "/") {
      path = "index.html";
    }
    const file = await Deno.open(path, { read: true });
    const contentType = getContentType(path);

    return new Response(file.readable, {
      headers: {
        "content-type": contentType,
      },
    });
  } catch (e) {
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

  if (path.startsWith("/api/")) {
    if (path === "/api/counter/value") {
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

    return new Response("API Endpoint Not Found", { status: 404 });
  }
  if (path === "/" || path === "/index.html") {
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FeexVeb Demo - Simplified API & HTMX Integration</title>
        <script type="importmap">
        {
          "imports": {
            "@maverick-js/signals": "https://esm.sh/@maverick-js/signals@5.11.5"
          }
        }
        </script>
        <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
        <style>
          ${FeexVeb.styling.monospaceCssForHtml}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>FeexVeb Demo</h1>
          <p>This demo showcases FeexVeb's simplified API for building reactive Web Components with HTMX integration.</p>

          <div class="counter-component">
            <h2 class="counter-title">1. Pure Client-Side Counter (Simplified API)</h2>
            <p>Demonstrates FeexVeb's simplified API with attributes, computed state, and client-side reactivity.</p>
            <fx-counter-simple title="Simplified Counter" initial-count="5"></fx-counter-simple>
          </div>

          <div class="counter-component">
            <h2 class="counter-title">2. Minimal Counter (Bare Minimum)</h2>
            <p>Shows the absolute minimum code needed for a reactive component.</p>
            <fx-simple-counter></fx-simple-counter>
          </div>

          <div class="counter-component">
            <h2 class="counter-title">3. Hybrid Counter (Server + Client with HTMX)</h2>
            <p>Showcases true hybrid approach - server-driven state with client-side optimistic updates.</p>
            <fx-hybrid-counter></fx-hybrid-counter>
          </div>

          <div class="counter-component">
            <h2 class="counter-title">4. Server-Only Counter (Pure HTMX)</h2>
            <p>Traditional server-driven counter using only HTMX for comparison.</p>

            <div id="server-counter-value" hx-get="/api/counter/value" hx-trigger="load">
              Loading...
            </div>

            <div class="counter-controls">
              <button
                class="counter-btn decrement"
                hx-post="/api/counter/decrement"
                hx-target="#server-counter-value"
              >
                Decrement
              </button>

              <button
                class="counter-btn"
                hx-post="/api/counter/increment"
                hx-target="#server-counter-value"
              >
                Increment
              </button>

              <button
                class="counter-btn reset"
                hx-post="/api/counter/reset"
                hx-target="#server-counter-value"
              >
                Reset
              </button>
            </div>
          </div>

          <div class="counter-component">
            <h2 class="counter-title">API Comparison</h2>
            <div class="comparison-table">
              <h3>Simplified API Benefits:</h3>
              <ul>
                <li><strong>44% less boilerplate code</strong> compared to traditional approaches</li>
                <li><strong>Direct state access</strong> - no .get() calls needed in render functions</li>
                <li><strong>Declarative patterns</strong> - state, computed, and methods as simple objects</li>
                <li><strong>Automatic attribute handling</strong> with type inference and defaults</li>
                <li><strong>Smart defaults</strong> - shadowMode: 'open', useMonospaceStyles: true</li>
                <li><strong>HTMX integration</strong> - seamless server-side interactions</li>
                <li><strong>Backward compatibility</strong> - original defineComponent API still available</li>
              </ul>
            </div>
          </div>

          <div class="counter-component">
            <h2 class="counter-title">About FeexVeb</h2>
            <p>FeexVeb is a minimal library for building web applications with:</p>
            <ul>
              <li><strong>Simplified API:</strong> Reduced boilerplate for faster development</li>
              <li><strong>Reactive State:</strong> Powered by Maverick.js Signals</li>
              <li><strong>HTMX Integration:</strong> Seamless server-side interactions</li>
              <li><strong>Monospace Design:</strong> Beautiful default styling following "The Monospace Web" principles</li>
              <li><strong>Web Components:</strong> Standards-based custom elements</li>
            </ul>
            <p>All styling on this page uses FeexVeb's built-in monospace design system.</p>
          </div>
        </div>

        <!-- Load FeexVeb components -->
        <script type="module" src="/examples/counter/counter.js"></script>
      </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" }
      }
    );
  }



  // Handle static files (JS, CSS, etc.)
  if (path.startsWith("/examples/") || path.startsWith("/lib/")) {
    try {
      return await serveFile(`.${path}`);
    } catch {
      return new Response("File not found", { status: 404 });
    }
  }

  return await serveFile(path);
}

const port = 8001;
console.log(`HTTP server running at http://localhost:${port}/`);

Deno.serve({ port }, requestHandler);