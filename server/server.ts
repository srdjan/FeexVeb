let counter = 0;

import FeexVeb from "../lib/feexveb.js";
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
    // For now, let's use a simple approach and render the layout as a string
    // mono-jsx will be used for component-level JSX rendering
    const layoutHtml = `<div class="unified-layout">
      <nav class="main-nav">
        <div class="nav-container">
          <div class="nav-brand">
            <h1 class="brand-title">FeexVeb</h1>
            <span class="brand-tagline">JSX + SSR + HTMX</span>
          </div>
          <div class="nav-menu">
            <a href="#about" class="nav-link">About</a>
            <a href="#examples" class="nav-link">Examples</a>
            <a href="#components" class="nav-link">Components</a>
            <a href="#docs" class="nav-link">Documentation</a>
          </div>
        </div>
      </nav>

      <main class="main-content">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">
              Build Modern Web Apps with <span class="highlight">FeexVeb</span>
            </h1>
            <p class="hero-description">
              A lightweight framework combining JSX, Server-Side Rendering, and HTMX for reactive web applications without the complexity.
            </p>

            <div class="hero-features">
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <div class="feature-text">
                  <strong>Lightning Fast</strong><br>
                  Minimal runtime, maximum performance
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <div class="feature-text">
                  <strong>Zero Build Step</strong><br>
                  Write JSX, run immediately
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔄</span>
                <div class="feature-text">
                  <strong>Reactive</strong><br>
                  HTMX-powered interactivity
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎨</span>
                <div class="feature-text">
                  <strong>Monospace Design</strong><br>
                  Beautiful, consistent styling
                </div>
              </div>
            </div>

            <div class="hero-actions">
              <a href="#examples" class="cta-button primary">See Examples</a>
              <a href="#docs" class="cta-button secondary">Documentation</a>
            </div>
          </div>
        </section>

        <!-- Examples Section -->
        <section id="examples" class="section-container">
          <h2 class="section-title">Interactive Examples</h2>
          <p class="section-description">
            Explore FeexVeb's capabilities through these live, interactive examples.
          </p>

          <div class="examples-grid">
            <!-- Counter Example -->
            <div class="example-card">
              <div class="example-header">
                <h3 class="example-title">Interactive Counter</h3>
                <span class="example-badge client">Client-Side</span>
              </div>
              <p class="example-description">
                A simple counter demonstrating reactive state management and event handling.
              </p>
              <div class="example-demo">
                <div class="component-placeholder" data-component="feex-counter" data-initial-count="0" data-title="Demo Counter">
                  <div class="loading-component">
                    <div class="loading-spinner">⏳</div>
                    <p>Loading Counter Component...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Components Section -->
        <section id="components" class="section-container">
          <h2 class="section-title">Component Library</h2>
          <p class="section-description">
            A collection of reusable components built with FeexVeb's component system.
          </p>

          <div class="components-grid">
            <!-- Interactive Components Category -->
            <div class="component-category">
              <h3 class="category-title">Interactive Components</h3>
              <p class="category-description">
                Components that demonstrate client-side interactivity and state management.
              </p>

              <div class="component-demos">
                <!-- Todo List Component -->
                <div class="component-demo">
                  <h4 class="demo-title">Todo List</h4>
                  <div class="component-placeholder" data-component="todo-list">
                    <div class="loading-component">
                      <div class="loading-spinner">⏳</div>
                      <p>Loading Todo List Component...</p>
                    </div>
                  </div>
                </div>

                <!-- Weather Widget Component -->
                <div class="component-demo">
                  <h4 class="demo-title">Weather Widget</h4>
                  <div class="component-placeholder" data-component="weather-widget">
                    <div class="loading-component">
                      <div class="loading-spinner">⏳</div>
                      <p>Loading Weather Widget Component...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Components Category -->
            <div class="component-category">
              <h3 class="category-title">Form Components</h3>
              <p class="category-description">
                Form handling and validation components with real-time feedback.
              </p>

              <div class="component-demos">
                <!-- Form Validation Component -->
                <div class="component-demo">
                  <h4 class="demo-title">Form Validation</h4>
                  <div class="component-placeholder" data-component="form-validation">
                    <div class="loading-component">
                      <div class="loading-spinner">⏳</div>
                      <p>Loading Form Validation Component...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Components Category -->
            <div class="component-category">
              <h3 class="category-title">Data Components</h3>
              <p class="category-description">
                Components for displaying and manipulating data with advanced features.
              </p>

              <div class="component-demos">
                <!-- Data Table Component -->
                <div class="component-demo">
                  <h4 class="demo-title">Data Table</h4>
                  <div class="component-placeholder" data-component="data-table">
                    <div class="loading-component">
                      <div class="loading-spinner">⏳</div>
                      <p>Loading Data Table Component...</p>
                    </div>
                  </div>
                </div>

                <!-- Chat Component -->
                <div class="component-demo">
                  <h4 class="demo-title">Chat Interface</h4>
                  <div class="component-placeholder" data-component="chat-component">
                    <div class="loading-component">
                      <div class="loading-spinner">⏳</div>
                      <p>Loading Chat Component...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="main-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>FeexVeb</h4>
            <p>Modern web development made simple.</p>
          </div>
          <div class="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#examples">Examples</a></li>
              <li><a href="#components">Components</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Community</h4>
            <ul>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Discord</a></li>
              <li><a href="#">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 FeexVeb. Built with ❤️ and modern web technologies.</p>
        </div>
      </footer>
    </div>`;

    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FeexVeb - Modern Web Development with JSX, SSR & HTMX</title>
        <script type="importmap">
        {
          "imports": {
            "@maverick-js/signals": "https://esm.sh/@maverick-js/signals@5.11.5",
            "mono-jsx": "https://esm.sh/mono-jsx@0.5.0"
          }
        }
        </script>
        <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
        <style>
          ${FeexVeb.styling.monospaceCssForHtml}

          /* Unified Layout Styles */
          .unified-layout {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          /* Navigation */
          .main-nav {
            position: sticky;
            top: 0;
            background: var(--mono-bg-primary);
            border-bottom: 2px solid var(--mono-border-color);
            z-index: 100;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .nav-brand {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .brand-title {
            margin: 0;
            font-size: 1.5rem;
            color: var(--mono-accent-color);
          }

          .brand-tagline {
            font-size: 0.9rem;
            color: var(--mono-text-muted);
            font-weight: 500;
          }

          .nav-menu {
            display: flex;
            gap: 2rem;
          }

          .nav-link {
            text-decoration: none;
            color: var(--mono-text-primary);
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .nav-link:hover {
            background: var(--mono-bg-secondary);
            color: var(--mono-accent-color);
          }

          /* Hero Section */
          .hero-section {
            background: linear-gradient(135deg, var(--mono-bg-primary) 0%, var(--mono-bg-secondary) 100%);
            padding: 4rem 2rem;
            text-align: center;
          }

          .hero-content {
            max-width: 1000px;
            margin: 0 auto;
          }

          .hero-title {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            line-height: 1.2;
          }

          .highlight {
            color: var(--mono-accent-color);
            font-weight: bold;
          }

          .hero-description {
            font-size: 1.2rem;
            color: var(--mono-text-muted);
            margin-bottom: 3rem;
            line-height: 1.6;
          }

          .hero-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            background: var(--mono-bg-primary);
            border-radius: 8px;
            border: 1px solid var(--mono-border-color);
          }

          .feature-icon {
            font-size: 2rem;
          }

          .feature-text {
            text-align: left;
          }

          .hero-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 3rem;
          }

          .cta-button {
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            transition: all 0.2s ease;
          }

          .cta-button.primary {
            background: var(--mono-accent-color);
            color: white;
          }

          .cta-button.secondary {
            background: transparent;
            color: var(--mono-accent-color);
            border: 2px solid var(--mono-accent-color);
          }

          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }

          /* Section Styles */
          .section-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 4rem 2rem;
          }

          .section-title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--mono-accent-color);
            text-align: center;
          }

          .section-description {
            font-size: 1.1rem;
            color: var(--mono-text-muted);
            text-align: center;
            margin-bottom: 3rem;
            line-height: 1.6;
          }

          /* About Section */
          .about-section {
            background: var(--mono-bg-secondary);
          }

          .about-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 4rem;
            margin: 3rem 0;
          }

          .about-intro {
            font-size: 1.1rem;
            line-height: 1.7;
            margin-bottom: 2rem;
          }

          .philosophy-list {
            list-style: none;
            padding: 0;
          }

          .philosophy-list li {
            margin: 1rem 0;
            padding-left: 1.5rem;
            position: relative;
          }

          .philosophy-list li::before {
            content: "→";
            position: absolute;
            left: 0;
            color: var(--mono-accent-color);
            font-weight: bold;
          }

          .feature-card {
            background: var(--mono-bg-primary);
            padding: 1.5rem;
            border-radius: 6px;
            border: 1px solid var(--mono-border-color);
            margin-bottom: 1rem;
          }

          .feature-card h4 {
            margin-top: 0;
            color: var(--mono-accent-color);
          }

          .code-comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem 0;
          }

          .code-block {
            background: var(--mono-bg-code);
            padding: 1.5rem;
            border-radius: 6px;
            border: 1px solid var(--mono-border-color);
          }

          .code-block h4 {
            margin-top: 0;
            margin-bottom: 1rem;
          }

          .code-block pre {
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.4;
          }

          /* Examples Grid */
          .examples-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
          }

          .example-card {
            background: var(--mono-bg-primary);
            border: 1px solid var(--mono-border-color);
            border-radius: 8px;
            overflow: hidden;
          }

          .example-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--mono-border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .example-title {
            margin: 0;
            color: var(--mono-accent-color);
          }

          .example-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
          }

          .example-badge.client { background: #e3f2fd; color: #1976d2; }
          .example-badge.minimal { background: #f3e5f5; color: #7b1fa2; }
          .example-badge.hybrid { background: #fff3e0; color: #f57c00; }
          .example-badge.server { background: #e8f5e8; color: #388e3c; }

          .example-description {
            padding: 0 1.5rem;
            color: var(--mono-text-muted);
          }

          .example-demo {
            padding: 1.5rem;
            background: var(--mono-bg-secondary);
          }

          /* Components Section */
          .components-grid {
            margin: 3rem 0;
          }

          .component-category {
            margin: 4rem 0;
            padding: 2rem;
            background: var(--mono-bg-primary);
            border: 1px solid var(--mono-border-color);
            border-radius: 8px;
          }

          .category-title {
            color: var(--mono-accent-color);
            margin-bottom: 1rem;
          }

          .category-description {
            color: var(--mono-text-muted);
            margin-bottom: 2rem;
          }

          .component-demos {
            display: grid;
            gap: 2rem;
          }

          .component-demo {
            padding: 2rem;
            background: var(--mono-bg-secondary);
            border-radius: 6px;
            border: 1px solid var(--mono-border-color);
          }

          .demo-title {
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: var(--mono-accent-color);
          }

          /* Documentation Section */
          .docs-section {
            background: var(--mono-bg-secondary);
          }

          .docs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
          }

          .doc-category {
            background: var(--mono-bg-primary);
            padding: 1.5rem;
            border-radius: 6px;
            border: 1px solid var(--mono-border-color);
          }

          .doc-category h3 {
            margin-top: 0;
            color: var(--mono-accent-color);
          }

          .doc-links {
            list-style: none;
            padding: 0;
          }

          .doc-links li {
            margin: 0.5rem 0;
          }

          .doc-links a {
            color: var(--mono-text-primary);
            text-decoration: none;
          }

          .doc-links a:hover {
            color: var(--mono-accent-color);
          }

          .api-summary {
            margin: 3rem 0;
            padding: 2rem;
            background: var(--mono-bg-primary);
            border-radius: 8px;
            border: 1px solid var(--mono-border-color);
          }

          .api-examples {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
          }

          .api-example {
            background: var(--mono-bg-code);
            padding: 1.5rem;
            border-radius: 6px;
            border: 1px solid var(--mono-border-color);
          }

          .api-example h4 {
            margin-top: 0;
            color: var(--mono-accent-color);
          }

          .api-example pre {
            margin: 0;
            font-size: 0.85rem;
            line-height: 1.4;
          }

          /* Footer */
          .main-footer {
            background: var(--mono-bg-primary);
            border-top: 2px solid var(--mono-border-color);
            margin-top: auto;
          }

          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
          }

          .footer-section h4 {
            color: var(--mono-accent-color);
            margin-bottom: 1rem;
          }

          .footer-section ul {
            list-style: none;
            padding: 0;
          }

          .footer-section li {
            margin: 0.5rem 0;
          }

          .footer-section a {
            color: var(--mono-text-muted);
            text-decoration: none;
          }

          .footer-section a:hover {
            color: var(--mono-accent-color);
          }

          .footer-bottom {
            text-align: center;
            padding: 1rem 2rem;
            border-top: 1px solid var(--mono-border-color);
            color: var(--mono-text-muted);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .nav-container {
              flex-direction: column;
              gap: 1rem;
            }

            .nav-menu {
              gap: 1rem;
            }

            .hero-title {
              font-size: 2rem;
            }

            .hero-actions {
              flex-direction: column;
              align-items: center;
            }

            .about-grid {
              grid-template-columns: 1fr;
              gap: 2rem;
            }

            .code-comparison {
              grid-template-columns: 1fr;
            }

            .examples-grid {
              grid-template-columns: 1fr;
            }

            .api-examples {
              grid-template-columns: 1fr;
            }
          }

          /* Smooth scrolling for anchor links */
          html {
            scroll-behavior: smooth;
          }

          /* Section spacing */
          section {
            scroll-margin-top: 80px;
          }

          /* Component placeholder styles */
          .component-placeholder {
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--mono-bg-secondary);
            border: 2px dashed var(--mono-border-color);
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .loading-component {
            text-align: center;
            color: var(--mono-text-muted);
          }

          .loading-spinner {
            font-size: 2rem;
            margin-bottom: 1rem;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .loading-component p {
            margin: 0;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        ${layoutHtml}

        <!-- Load all FeexVeb components -->
        <script type="module" src="/examples/counter/counter.js"></script>
        <script type="module" src="/examples/components/todo-list.js"></script>
        <script type="module" src="/examples/components/weather-widget.js"></script>
        <script type="module" src="/examples/components/form-validation.js"></script>
        <script type="module" src="/examples/components/data-table.js"></script>
        <script type="module" src="/examples/components/chat.js"></script>

        <!-- Component placeholder replacement script -->
        <script type="module">
          // Wait for all components to be defined, then replace placeholders
          function replaceComponentPlaceholders() {
            const placeholders = document.querySelectorAll('.component-placeholder');

            placeholders.forEach(placeholder => {
              const componentTag = placeholder.dataset.component;

              // Check if the custom element is defined
              if (customElements.get(componentTag)) {
                // Create the actual component element
                const componentElement = document.createElement(componentTag);

                // Copy all data attributes as regular attributes
                Object.keys(placeholder.dataset).forEach(key => {
                  if (key !== 'component') {
                    const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    componentElement.setAttribute(attrName, placeholder.dataset[key]);
                  }
                });

                // Replace the placeholder with the actual component
                placeholder.parentNode.replaceChild(componentElement, placeholder);
              }
            });
          }

          // Try to replace placeholders immediately
          replaceComponentPlaceholders();

          // Also try after a short delay to catch any components that load later
          setTimeout(replaceComponentPlaceholders, 100);
          setTimeout(replaceComponentPlaceholders, 500);
          setTimeout(replaceComponentPlaceholders, 1000);

          // Listen for custom element definitions and replace placeholders as they become available
          const observer = new MutationObserver(() => {
            replaceComponentPlaceholders();
          });

          // Start observing when components are added to the DOM
          observer.observe(document.body, { childList: true, subtree: true });
        </script>
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