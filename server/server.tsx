/** @jsxImportSource mono-jsx */

// Import the simplified FeexVeb components
import "../lib/src/feexveb.js";

// Import examples
import {
  addTodo,
  deleteTodo,
  TodoItem,
  TodoPage,
  // todos as todoState,
  toggleTodo,
} from "../examples/todo-ssr/todo-ssr.tsx";
import { UnifiedLayout } from "../examples/todo-ssr/unified-layout.tsx";

// Simple in-memory counter for demo
let counter = 0;

/**
 * Content type mapping for static files
 */
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
} as const;

function getContentType(path: string): string {
  for (const [ext, type] of Object.entries(CONTENT_TYPES)) {
    if (path.endsWith(ext)) return type;
  }
  return "text/plain";
}

/**
 * Serve static files with proper content types
 */
async function serveStaticFile(path: string): Promise<Response> {
  try {
    // Normalize path
    path = path.replace(/^\//, "");
    if (path === "" || path === "/") path = "index.html";

    const contentType = getContentType(path);
    const file = await Deno.open(path, { read: true });

    return new Response(file.readable, {
      headers: {
        "content-type": contentType,
        "cache-control": "no-cache", // Development mode
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

/**
 * Utility to check if request is from HTMX
 */
function isHtmxRequest(req: Request): boolean {
  return req.headers.get("HX-Request") === "true";
}

/**
 * Utility to create JSON response
 */
function jsonResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Main request handler using native mono-jsx patterns
 */
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  console.log(`${method} ${pathname}`);

  // --- API Routes ---
  if (pathname.startsWith("/api/")) {
    return handleApiRoutes(pathname, method, req);
  }

  // --- Page Routes ---
  if (pathname === "/" || pathname === "/index.html") {
    return handleHomePage();
  }

  if (pathname === "/todo-ssr") {
    return <TodoPage />;
  }

  // --- Todo SSR API Routes ---
  if (pathname.startsWith("/todo-ssr/")) {
    return handleTodoRoutes(pathname, method, req);
  }

  // --- Static Files ---
  if (
    pathname.startsWith("/examples/") || pathname.startsWith("/lib/") ||
    pathname === "/htmx.min.js"
  ) {
    return serveStaticFile(`.${pathname}`);
  }

  return serveStaticFile(pathname);
}

/**
 * Handle API routes for counter demo
 */
async function handleApiRoutes(
  pathname: string,
  method: string,
  req: Request,
): Promise<Response> {
  const isHtmx = isHtmxRequest(req);

  // Counter value endpoint
  if (pathname === "/api/counter/value") {
    const counterElement = (
      <div class={`counter-value ${counter % 2 === 0 ? "even" : "odd"}`}>
        {counter}
      </div>
    );
    return isHtmx ? counterElement : jsonResponse({ value: counter });
  }

  // Counter increment
  if (pathname === "/api/counter/increment" && method === "POST") {
    counter++;
    const counterElement = (
      <div class={`counter-value ${counter % 2 === 0 ? "even" : "odd"}`}>
        {counter}
      </div>
    );
    return isHtmx ? counterElement : jsonResponse({ value: counter });
  }

  // Counter decrement
  if (pathname === "/api/counter/decrement" && method === "POST") {
    counter--;
    const counterElement = (
      <div class={`counter-value ${counter % 2 === 0 ? "even" : "odd"}`}>
        {counter}
      </div>
    );
    return isHtmx ? counterElement : jsonResponse({ value: counter });
  }

  // Counter reset
  if (pathname === "/api/counter/reset" && method === "POST") {
    counter = 0;
    const counterElement = (
      <div class={`counter-value ${counter % 2 === 0 ? "even" : "odd"}`}>
        {counter}
      </div>
    );
    return isHtmx ? counterElement : jsonResponse({ value: counter });
  }

  // Out-of-band update demo
  if (pathname === "/api/counter/oob" && method === "POST") {
    counter++;
    const className = `counter-value ${counter % 2 === 0 ? "even" : "odd"}`;

    if (isHtmx) {
      // HTMX out-of-band updates using native JSX
      const oobUpdates = (
        <>
          <div id="counter-value" hx-swap-oob="true" class={className}>
            {counter}
          </div>
          <div id="realtime-counter" hx-swap-oob="true" class={className}>
            {counter}
          </div>
          <span id="counter-oob" hx-swap-oob="true">{counter}</span>
          <div>Counter updated to: {counter}</div>
        </>
      );
      return oobUpdates;
    }

    return jsonResponse({ value: counter });
  }

  return new Response("API Endpoint Not Found", { status: 404 });
}

/**
 * Handle home page with unified layout
 */
function handleHomePage(): Response {
  // Simple server-side component rendering without complex SSR machinery
  const counterHtml = (
    <div class="ssr-counter">
      <h3>SSR Demo Counter</h3>
      <p>Current count: 0</p>
      <button>Increment (SSR)</button>
      <button>Decrement (SSR)</button>
    </div>
  );

  return (
    <UnifiedLayout
      feexCounterSlotHtml={String(counterHtml)}
      monospaceCss={getMonospaceCssForHtml()}
    />
  );
}

/**
 * Handle todo app routes
 */
async function handleTodoRoutes(
  pathname: string,
  method: string,
  req: Request,
): Promise<Response> {
  // Add new todo
  if (pathname === "/todo-ssr/add" && method === "POST") {
    const formData = await req.formData();
    const text = formData.get("todo")?.toString() || "";

    if (!text) {
      return new Response("Todo text cannot be empty", { status: 400 });
    }

    const newTodo = addTodo(text);
    return <TodoItem {...newTodo} />;
  }

  // Toggle todo
  const toggleMatch = pathname.match(/^\/todo-ssr\/toggle\/(\d+)$/);
  if (toggleMatch && method === "PUT") {
    const id = parseInt(toggleMatch[1]);
    const updatedTodo = toggleTodo(id);

    if (!updatedTodo) {
      return new Response("Todo not found", { status: 404 });
    }

    return <TodoItem {...updatedTodo} />;
  }

  // Delete todo
  const deleteMatch = pathname.match(/^\/todo-ssr\/delete\/(\d+)$/);
  if (deleteMatch && method === "DELETE") {
    const id = parseInt(deleteMatch[1]);
    deleteTodo(id);
    // Empty response for HTMX to remove element
    return new Response("", { status: 200 });
  }

  return new Response("Todo route not found", { status: 404 });
}

/**
 * Get monospace CSS for HTML documents
 * Simplified inline version - in real implementation this would come from the styling module
 */
function getMonospaceCssForHtml(): string {
  return `
    body {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
      line-height: 1.5;
      max-width: 70ch;
      margin: 0 auto;
      padding: 1rem;
      color: #222222;
      background: #ffffff;
    }
    
    .counter-value.even {
      background: #f0f8ff;
      color: #000080;
    }
    
    .counter-value.odd {
      background: #fff5f5;
      color: #8b0000;
    }
  `;
}

// Start server
const port = 8001;
console.log(`Simplified FeexVeb server running at http://localhost:${port}/`);
console.log(`Using native mono-jsx rendering and HTMX integration`);

Deno.serve({ port }, handleRequest);
