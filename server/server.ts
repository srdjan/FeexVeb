let counter = 0;

import FeexVeb from "../lib/feexveb.js";
import { Layout } from "./layout.jsx";
import { render } from "preact-render-to-string";
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
    // Render the layout using JSX server-side rendering
    const layoutHtml = render(Layout());

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
            "@maverick-js/signals": "https://esm.sh/@maverick-js/signals@5.11.5",
            "preact": "https://esm.sh/preact@10.19.3",
            "preact/jsx-runtime": "https://esm.sh/preact@10.19.3/jsx-runtime"
          }
        }
        </script>
        <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
        <style>
          ${FeexVeb.styling.monospaceCssForHtml}
        </style>
      </head>
      <body>
        ${layoutHtml}

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