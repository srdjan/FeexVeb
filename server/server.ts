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
        <title>FeexVeb HTMX Counter - Monospace Design</title>
        <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
        <style>
          ${FeexVeb.styling.monospaceCssForHtml}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>FeexVeb HTMX Counter Example</h1>

          <p>This example demonstrates using HTMX with Deno's native HTTP server and FeexVeb's monospace design system.</p>

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

          <div class="counter-component">
            <h2 class="counter-title">About FeexVeb Monospace Design</h2>
            <p>This page demonstrates the FeexVeb monospace design system, which follows "The Monospace Web" principles:</p>
            <ul>
              <li>Monospace typography for improved readability</li>
              <li>Clean, minimal color scheme</li>
              <li>Consistent spacing using CSS custom properties</li>
              <li>Responsive design with mobile-first approach</li>
              <li>Focus on content over decoration</li>
            </ul>
            <p>The counter values use monospace fonts and the library's color system to distinguish between even (blue) and odd (purple) values.</p>
          </div>
        </div>
      </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" }
      }
    );
  }

  return await serveFile(path);
}

const port = 8000;
console.log(`HTTP server running at http://localhost:${port}/`);

Deno.serve({ port }, requestHandler);