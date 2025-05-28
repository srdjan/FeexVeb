/** @jsxImportSource npm:mono-jsx */
import { html } from "npm:mono-jsx";
import FeexVeb from "../lib/feexveb.js";
import { ServerFeexVeb } from "../lib/src/server-renderer.js";
// Import the UnifiedLayout component
import { UnifiedLayout } from "./unified-layout.jsx";
// Imports for Todo SSR
import { TodoPage, addTodo, toggleTodo, deleteTodo, TodoItem, todos as todoState } from "../examples/todo-ssr/todo-ssr.jsx";


let counter = 0;

// mono-jsx handles rendering automatically when returning JSX from fetch handler
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

    const contentType = getContentType(path);

    // Handle JavaScript files - serve directly with mono-jsx
    if (path.endsWith('.js') && (path.startsWith('examples/') || path.startsWith('lib/'))) {
      const fileContent = await Deno.readTextFile(path);

      return new Response(fileContent, {
        headers: {
          "content-type": contentType,
          "cache-control": "no-cache", // Disable caching during development
        },
      });
    }

    // Handle other files normally
    const file = await Deno.open(path, { read: true });
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
          (<div class={className}>{counter}</div>).toString(),
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
          (<div class={className}>{counter}</div>).toString(),
          (<div class={className}>{counter}</div>).toString(),
          (<div class={className}>{counter}</div>).toString(),
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
        // Example of using JSX for HTMX partials
        // Note: html`` might be needed if mono-jsx doesn't auto-convert fragment to string for Response
        const partial = (
          <>
            <div id="counter-value" hx-swap-oob="true" class={className}>{counter}</div>
            <div id="realtime-counter" hx-swap-oob="true" class={className}>{counter}</div>
            <span id="counter-oob" hx-swap-oob="true">{counter}</span>
            <div>Counter updated to: {counter}</div>
          </>
        );
        return new Response(
          partial.toString(),
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
    // Define a mock/simple component definition for 'feex-counter' for ServerFeexVeb
    // In a real scenario, this definition would come from the component's file.
    const feexCounterDefinition = { // Renamed variable
      tag: 'feex-counter', // Changed tag name
      state: { count: 0, title: 'Demo Counter' }, // Default state
      attrs: {
        'initial-count': { type: 'number' },
        'title': { type: 'string' },
      },
      methods: {
        increment: (state) => state.count++,
        decrement: (state) => state.count--,
      },
      // ServerFeexVeb's render needs to return a VNode-like structure or use its createElement
      render: ({ count, title }) => ServerFeexVeb.createElement('div', {},
        ServerFeexVeb.createElement('h3', {}, title),
        ServerFeexVeb.createElement('p', {}, `Current count: ${count}`),
        ServerFeexVeb.createElement('button', {}, 'Increment (SSR)'),
        ServerFeexVeb.createElement('button', {}, 'Decrement (SSR)')
      )
    };

    // Register the component with ServerFeexVeb if not already registered
    if (!ServerFeexVeb.getRegisteredComponents().has('feex-counter')) { // Changed to 'feex-counter'
      ServerFeexVeb.component(feexCounterDefinition); // Use renamed definition
    }
    
    // Render the 'feex-counter' component using ServerFeexVeb
    const feexCounterHtml = ServerFeexVeb.renderComponentByTag('feex-counter', { // Changed to 'feex-counter'
      'initial-count': 0, 
      'title': "SSR Demo Counter" // Props for feex-counter
    });

    const page = (
      // Pass the server-rendered HTML and monospace CSS to UnifiedLayout
      <UnifiedLayout 
        feexCounterSlotHtml={feexCounterHtml} 
        monospaceCss={FeexVeb.styling.monospaceCssForHtml} 
      />
    );

    return new Response(page.toString(), { headers: { "Content-Type": "text/html" } });
  }





  // --- TODO SSR Routes ---
  if (pathname === "/todo-ssr" && method === "GET") {
    // Note: TodoPage already includes <html>, <head> with styles & htmx script, and <body>
    return new Response(TodoPage().toString(), {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (pathname === "/todo-ssr/add" && method === "POST") {
    const formData = await req.formData();
    const text = formData.get("todo")?.toString() || "";
    if (text) {
      const newTodo = addTodo(text); // addTodo from todo-ssr.jsx
      // TodoItem is expected to be a function that takes { todo: Todo }
      // and returns JSX for a single <li> item.
      return new Response(TodoItem(newTodo).toString(), {
        headers: { "Content-Type": "text/html" },
      });
    }
    return new Response("Todo text cannot be empty", { status: 400 });
  }

  const toggleMatch = pathname.match(/^\/todo-ssr\/toggle\/(\d+)$/);
  if (toggleMatch && method === "PUT") {
    const id = parseInt(toggleMatch[1]);
    const updatedTodo = toggleTodo(id); // toggleTodo from todo-ssr.jsx
    if (updatedTodo) {
      return new Response(TodoItem(updatedTodo).toString(), {
        headers: { "Content-Type": "text/html" },
      });
    }
    return new Response("Todo not found", { status: 404 });
  }

  const deleteMatch = pathname.match(/^\/todo-ssr\/delete\/(\d+)$/);
  if (deleteMatch && method === "DELETE") {
    const id = parseInt(deleteMatch[1]);
    deleteTodo(id); // deleteTodo from todo-ssr.jsx
    // Return an empty response, HTMX will remove the element from the DOM
    // based on hx-swap="outerHTML" in the TodoItem component.
    return new Response("", { status: 200 });
  }

  // Serve htmx.min.js if requested from root (as linked in TodoPage)
  if (pathname === "/htmx.min.js") {
    try {
      // Assuming htmx.min.js is in the root of the project or a known path
      // For this example, let's assume it's in a 'static' folder or similar
      // Adjust the path as per your project structure.
      // If it's in ./static/htmx.min.js:
      // return await serveFile("./static/htmx.min.js");
      // If it's at the root of where Deno serves files from:
      return await serveFile("./htmx.min.js"); // This might require htmx.min.js to be in the app root.
    } catch (e) {
      console.error("Error serving htmx.min.js:", e);
      return new Response("htmx.min.js not found", { status: 404 });
    }
  }


  // Handle static files (JS, CSS, etc.)
  // Updated to ensure /todo-ssr specific JS/CSS are not caught here if any were added.
  // The current todo-ssr.jsx uses inline styles and no specific JS file other than htmx.min.js
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