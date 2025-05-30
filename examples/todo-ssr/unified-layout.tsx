/** @jsxImportSource mono-jsx */

/**
 * Unified Home Page Layout - Consolidates all FeexVeb examples and documentation
 */

// Modified to accept feexCounterSlotHtml and monospaceCss, and to render a full HTML document
export const UnifiedLayout = (
  { feexCounterSlotHtml, monospaceCss }: {
    feexCounterSlotHtml?: string;
    monospaceCss?: string;
  },
) => (
  <html>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>FeexVeb - Modern Web Development with JSX, SSR & HTMX</title>
      <script type="importmap">
        {`{
          "imports": {
            "@maverick-js/signals": "https://esm.sh/@maverick-js/signals@5.11.5",
            "mono-jsx": "https://esm.sh/mono-jsx@0.5.0"
          }
        }`}
      </script>
      <script
        src="https://unpkg.com/htmx.org@2.0.4"
        integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+"
        crossOrigin="anonymous"
      >
      </script>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        ${monospaceCss}

        /* Unified Layout Styles (previously in server.ts) */
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
        .nav-brand { display: flex; align-items: center; gap: 1rem; }
        .brand-title { margin: 0; font-size: 1.5rem; color: var(--mono-accent-color); }
        .brand-tagline { font-size: 0.9rem; color: var(--mono-text-muted); font-weight: 500; }
        .nav-menu { display: flex; gap: 2rem; }
        .nav-link { text-decoration: none; color: var(--mono-text-primary); font-weight: 500; padding: 0.5rem 1rem; border-radius: 4px; transition: all 0.2s ease; }
        .nav-link:hover { background: var(--mono-bg-secondary); color: var(--mono-accent-color); }
        /* Hero Section */
        .hero-section { background: linear-gradient(135deg, var(--mono-bg-primary) 0%, var(--mono-bg-secondary) 100%); padding: 4rem 2rem; text-align: center; }
        .hero-content { max-width: 1000px; margin: 0 auto; }
        .hero-title { font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.2; }
        .highlight { color: var(--mono-accent-color); font-weight: bold; }
        .hero-description { font-size: 1.2rem; color: var(--mono-text-muted); margin-bottom: 3rem; line-height: 1.6; }
        .hero-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 3rem 0; }
        .feature-item { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: var(--mono-bg-primary); border-radius: 8px; border: 1px solid var(--mono-border-color); }
        .feature-icon { font-size: 2rem; }
        .feature-text { text-align: left; }
        .hero-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 3rem; }
        .cta-button { padding: 1rem 2rem; text-decoration: none; border-radius: 6px; font-weight: bold; transition: all 0.2s ease; }
        .cta-button.primary { background: var(--mono-accent-color); color: white; }
        .cta-button.secondary { background: transparent; color: var(--mono-accent-color); border: 2px solid var(--mono-accent-color); }
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        /* Section Styles */
        .section-container { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }
        .section-title { font-size: 2.5rem; margin-bottom: 1rem; color: var(--mono-accent-color); text-align: center; }
        .section-description { font-size: 1.1rem; color: var(--mono-text-muted); text-align: center; margin-bottom: 3rem; line-height: 1.6; }
        /* About Section specific styles from unified-layout.jsx */
        .about-section { background: var(--mono-bg-secondary); /* Example, ensure all specific styles are here or inherited */ }
        .about-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 4rem; margin: 3rem 0; }
        .about-intro { font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem; }
        .philosophy-list { list-style: none; padding: 0; }
        .philosophy-list li { margin: 1rem 0; padding-left: 1.5rem; position: relative; }
        .philosophy-list li::before { content: "→"; position: absolute; left: 0; color: var(--mono-accent-color); font-weight: bold; }
        .feature-card { background: var(--mono-bg-primary); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--mono-border-color); margin-bottom: 1rem; }
        .feature-card h4 { margin-top: 0; color: var(--mono-accent-color); }
        .code-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0; }
        .code-block { background: var(--mono-bg-code); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--mono-border-color); }
        .code-block h4 { margin-top: 0; margin-bottom: 1rem; }
        .code-block pre { margin: 0; font-size: 0.9rem; line-height: 1.4; }
        /* Examples Grid */
        .examples-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin: 3rem 0; }
        .example-card { background: var(--mono-bg-primary); border: 1px solid var(--mono-border-color); border-radius: 8px; overflow: hidden; }
        .example-header { padding: 1.5rem; border-bottom: 1px solid var(--mono-border-color); display: flex; justify-content: space-between; align-items: center; }
        .example-title { margin: 0; color: var(--mono-accent-color); }
        .example-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
        .example-badge.client { background: #e3f2fd; color: #1976d2; }
        .example-badge.minimal { background: #f3e5f5; color: #7b1fa2; }
        .example-badge.hybrid { background: #fff3e0; color: #f57c00; }
        .example-badge.server { background: #e8f5e8; color: #388e3c; }
        .example-description { padding: 0 1.5rem; color: var(--mono-text-muted); }
        .example-demo { padding: 1.5rem; background: var(--mono-bg-secondary); }
        /* Components Section */
        .components-grid { margin: 3rem 0; }
        .component-category { margin: 4rem 0; padding: 2rem; background: var(--mono-bg-primary); border: 1px solid var(--mono-border-color); border-radius: 8px; }
        .category-title { color: var(--mono-accent-color); margin-bottom: 1rem; }
        .category-description { color: var(--mono-text-muted); margin-bottom: 2rem; }
        .component-demos { display: grid; gap: 2rem; }
        .component-demo { padding: 2rem; background: var(--mono-bg-secondary); border-radius: 6px; border: 1px solid var(--mono-border-color); }
        .demo-title { margin-top: 0; margin-bottom: 1.5rem; color: var(--mono-accent-color); }
        /* Docs Section */
        .docs-section { background: var(--mono-bg-secondary); }
        .docs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 3rem 0; }
        .doc-category { background: var(--mono-bg-primary); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--mono-border-color); }
        .doc-category h3 { margin-top: 0; color: var(--mono-accent-color); }
        .doc-links { list-style: none; padding: 0; }
        .doc-links li { margin: 0.5rem 0; }
        .doc-links a { color: var(--mono-text-primary); text-decoration: none; }
        .doc-links a:hover { color: var(--mono-accent-color); }
        .api-summary { margin: 3rem 0; padding: 2rem; background: var(--mono-bg-primary); border-radius: 8px; border: 1px solid var(--mono-border-color); }
        .api-examples { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .api-example { background: var(--mono-bg-code); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--mono-border-color); }
        .api-example h4 { margin-top: 0; color: var(--mono-accent-color); }
        .api-example pre { margin: 0; font-size: 0.85rem; line-height: 1.4; }
        /* Footer */
        .main-footer { background: var(--mono-bg-primary); border-top: 2px solid var(--mono-border-color); margin-top: auto; }
        .footer-content { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
        .footer-section h4 { color: var(--mono-accent-color); margin-bottom: 1rem; }
        .footer-section ul { list-style: none; padding: 0; }
        .footer-section li { margin: 0.5rem 0; }
        .footer-section a { color: var(--mono-text-muted); text-decoration: none; }
        .footer-section a:hover { color: var(--mono-accent-color); }
        .footer-bottom { text-align: center; padding: 1rem 2rem; border-top: 1px solid var(--mono-border-color); color: var(--mono-text-muted); }
        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-container { flex-direction: column; gap: 1rem; }
          .nav-menu { gap: 1rem; }
          .hero-title { font-size: 2rem; }
          .hero-actions { flex-direction: column; align-items: center; }
          .about-grid { grid-template-columns: 1fr; gap: 2rem; }
          .code-comparison { grid-template-columns: 1fr; }
          .examples-grid { grid-template-columns: 1fr; }
          .api-examples { grid-template-columns: 1fr; }
        }
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        section { scroll-margin-top: 80px; /* Adjust based on nav height */ }
        /* Component placeholder styles */
        .component-placeholder { min-height: 200px; display: flex; align-items: center; justify-content: center; background: var(--mono-bg-secondary); border: 2px dashed var(--mono-border-color); border-radius: 8px; transition: all 0.3s ease; }
        .loading-component { text-align: center; color: var(--mono-text-muted); }
        .loading-spinner { font-size: 2rem; margin-bottom: 1rem; animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .loading-component p { margin: 0; font-style: italic; }
      `,
        }}
      />
    </head>
    <body>
      <div class="unified-layout">
        {/* This div wraps the visual content */}
        {/* Navigation Header */}
        <nav class="main-nav">
          <div class="nav-container">
            <div class="nav-brand">
              <h1 class="brand-title">FeexVeb</h1>
              <span class="brand-tagline">JSX • SSR • HTMX</span>
            </div>

            <div class="nav-menu">
              <a href="#home" class="nav-link">🏠 Home</a>
              <a href="#about" class="nav-link">📖 About</a>
              <a href="#counters" class="nav-link">🔢 Counters</a>
              <a href="#components" class="nav-link">🎨 Components</a>
              <a href="#docs" class="nav-link">📚 Docs</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">
              Build Web Apps with <span class="highlight">JSX</span>,{" "}
              <span class="highlight">SSR</span> &{" "}
              <span class="highlight">HTMX</span>
            </h1>
            <p class="hero-description">
              FeexVeb combines the developer experience of JSX with the
              performance of server-side rendering and the simplicity of HTMX
              for building modern web applications without complex client-side
              frameworks.
            </p>

            <div class="hero-features">
              <div class="feature-item">
                <div class="feature-icon">⚡</div>
                <div class="feature-text">
                  <strong>Lightning Fast</strong>
                  <br />
                  Server-side rendering for optimal performance
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">🎯</div>
                <div class="feature-text">
                  <strong>Developer Friendly</strong>
                  <br />
                  Natural JSX syntax with simplified API
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">🔄</div>
                <div class="feature-text">
                  <strong>Reactive</strong>
                  <br />
                  HTMX integration for seamless interactions
                </div>
              </div>
            </div>

            <div class="hero-actions">
              <a href="#counters" class="cta-button primary">
                🚀 See Examples
              </a>
              <a href="#about" class="cta-button secondary">
                📖 Learn More
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" class="about-section">
          <div class="section-container">
            <h2 class="section-title">What is FeexVeb?</h2>

            <div class="about-grid">
              <div class="about-main">
                <p class="about-intro">
                  FeexVeb is a minimal library for building modern web
                  applications that combines the best of three worlds: JSX for
                  developer experience, server-side rendering for performance,
                  and HTMX for reactive interactions without complex JavaScript
                  frameworks.
                </p>

                <h3>🎯 Core Philosophy</h3>
                <ul class="philosophy-list">
                  <li>
                    <strong>Simplicity First:</strong>{" "}
                    Minimal API surface with maximum functionality
                  </li>
                  <li>
                    <strong>Performance by Default:</strong>{" "}
                    Server-side rendering for fast initial loads
                  </li>
                  <li>
                    <strong>Progressive Enhancement:</strong>{" "}
                    HTMX for reactive features without heavy JavaScript
                  </li>
                  <li>
                    <strong>Developer Experience:</strong>{" "}
                    Natural JSX syntax instead of verbose function calls
                  </li>
                </ul>
              </div>

              <div class="about-features">
                <h3>✨ Key Features</h3>

                <div class="feature-card">
                  <h4>🔧 Simplified Component API</h4>
                  <p>
                    44% less boilerplate code with intuitive component creation
                    and automatic attribute handling.
                  </p>
                </div>

                <div class="feature-card">
                  <h4>⚛️ JSX Syntax Support</h4>
                  <p>
                    Write components using familiar JSX syntax with
                    Preact-powered server-side rendering.
                  </p>
                </div>

                <div class="feature-card">
                  <h4>📡 HTMX Integration</h4>
                  <p>
                    Seamless server-side interactions with automatic fragment
                    updates and real-time data sync.
                  </p>
                </div>

                <div class="feature-card">
                  <h4>🎨 Monospace Design System</h4>
                  <p>
                    Beautiful default styling following "The Monospace Web"
                    principles for consistent UI.
                  </p>
                </div>

                <div class="feature-card">
                  <h4>🔄 Reactive State Management</h4>
                  <p>
                    Powered by Maverick.js Signals for efficient reactive
                    updates and computed properties.
                  </p>
                </div>

                <div class="feature-card">
                  <h4>🌐 Web Components Standard</h4>
                  <p>
                    Built on standard Web Components API for maximum
                    compatibility and encapsulation.
                  </p>
                </div>
              </div>
            </div>

            <div class="comparison-section">
              <h3>📊 JSX vs createElement Comparison</h3>
              <div class="code-comparison">
                <div class="code-block">
                  <h4>✅ With FeexVeb JSX</h4>
                  <pre><code>{`<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>
  <button onclick={handleClick}>
    {buttonText}
  </button>
</div>`}</code></pre>
                </div>

                <div class="code-block">
                  <h4>❌ Without JSX</h4>
                  <pre><code>{`createElement('div', {class: 'card'},
  createElement('h3', null, title),
  createElement('p', null, description),
  createElement('button', {
    onclick: handleClick
  }, buttonText)
)`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Counter Examples Section */}
        <section id="counters" class="counters-section">
          <div class="section-container">
            <h2 class="section-title">🔢 Counter Examples</h2>
            <p class="section-description">
              Explore different approaches to building reactive components, from
              basic client-side counters to hybrid server-client implementations
              with HTMX integration.
            </p>

            <div class="examples-grid">
              <div class="example-card">
                <div class="example-header">
                  <h3 class="example-title">1. Simplified API Counter</h3>
                  <span class="example-badge client">Client-Side</span>
                </div>
                <p class="example-description">
                  Demonstrates FeexVeb's simplified API with attributes,
                  computed state, and client-side reactivity.
                </p>
                <div class="example-demo">
                  {
                    /* Use the slot for feex-counter.
                  If feexCounterSlotHtml is provided, use it for SSR.
                  Otherwise, fall back to the client-side placeholder for feex-counter. */
                  }
                  {feexCounterSlotHtml
                    ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: feexCounterSlotHtml,
                        }}
                      />
                    )
                    : (
                      <div
                        class="component-placeholder"
                        data-component="feex-counter" // Changed from fx-counter-simple to feex-counter
                        data-title="Demo Counter" // Adjusted title to be more generic for feex-counter
                        data-initial-count="0" // Adjusted initial-count
                      >
                        <div class="loading-component">
                          <div class="loading-spinner">⏳</div>
                          <p>Loading Counter Component...</p>{" "}
                          {/* Adjusted text */}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* The following counter examples remain client-side rendered via placeholders */}
              <div class="example-card">
                <div class="example-header">
                  <h3 class="example-title">2. Minimal Counter (Client)</h3>
                  <span class="example-badge minimal">Minimal</span>
                </div>
                <p class="example-description">
                  Shows the absolute minimum code needed for a reactive
                  component with FeexVeb (client-side).
                </p>
                <div class="example-demo">
                  <div
                    class="component-placeholder"
                    data-component="fx-simple-counter" // This remains as is, not SSR'd for this task
                  >
                    <div class="loading-component">
                      <div class="loading-spinner">⏳</div>
                      <p>Loading Minimal Counter...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="example-card">
                <div class="example-header">
                  <h3 class="example-title">3. Hybrid Counter</h3>
                  <span class="example-badge hybrid">Hybrid</span>
                </div>
                <p class="example-description">
                  Showcases true hybrid approach - server-driven state with
                  client-side optimistic updates.
                </p>
                <div class="example-demo">
                  <div
                    class="component-placeholder"
                    data-component="fx-hybrid-counter"
                  >
                    <div class="loading-component">
                      <div class="loading-spinner">⏳</div>
                      <p>Loading Hybrid Counter...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="example-card">
                <div class="example-header">
                  <h3 class="example-title">4. Server-Only Counter</h3>
                  <span class="example-badge server">Server-Side</span>
                </div>
                <p class="example-description">
                  Traditional server-driven counter using only HTMX for
                  comparison with client-side approaches.
                </p>
                <div class="example-demo">
                  <div
                    id="server-counter-value"
                    hx-get="/api/counter/value"
                    hx-trigger="load"
                  >
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
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Components Section */}
        <section id="components" class="components-section">
          <div class="section-container">
            <h2 class="section-title">🎨 Advanced JSX Components</h2>
            <p class="section-description">
              Explore sophisticated components built with restored JSX syntax,
              demonstrating real-world use cases and advanced patterns for
              modern web applications.
            </p>

            <div class="components-grid">
              {/* Todo Management */}
              <div class="component-category">
                <h3 class="category-title">📝 Todo Management</h3>
                <p class="category-description">
                  Interactive todo lists showcasing state management, dynamic
                  lists, and HTMX server integration.
                </p>

                <div class="component-demos">
                  <div class="component-demo">
                    <h4 class="demo-title">Client-Side Todo List</h4>
                    <div
                      class="component-placeholder"
                      data-component="fx-todo-list"
                    >
                      <div class="loading-component">
                        <div class="loading-spinner">⏳</div>
                        <p>Loading Todo List...</p>
                      </div>
                    </div>
                  </div>

                  <div class="component-demo">
                    <h4 class="demo-title">Server-Integrated Todo (HTMX)</h4>
                    <div
                      class="component-placeholder"
                      data-component="fx-todo-htmx"
                    >
                      <div class="loading-component">
                        <div class="loading-spinner">⏳</div>
                        <p>Loading HTMX Todo...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Widgets */}
              <div class="component-category">
                <h3 class="category-title">🌤️ Weather Widgets</h3>
                <p class="category-description">
                  Weather components demonstrating external API integration,
                  loading states, and error handling.
                </p>

                <div class="component-demos">
                  <div class="component-demo">
                    <h4 class="demo-title">Single Weather Widget</h4>
                    <div
                      class="component-placeholder"
                      data-component="fx-weather-widget"
                      data-city="New York"
                    >
                      <div class="loading-component">
                        <div class="loading-spinner">⏳</div>
                        <p>Loading Weather Widget...</p>
                      </div>
                    </div>
                  </div>

                  <div class="component-demo">
                    <h4 class="demo-title">Weather Dashboard</h4>
                    <div
                      class="component-placeholder"
                      data-component="fx-weather-dashboard"
                    >
                      <div class="loading-component">
                        <div class="loading-spinner">⏳</div>
                        <p>Loading Weather Dashboard...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Validation */}
              <div class="component-category">
                <h3 class="category-title">📋 Form Validation</h3>
                <p class="category-description">
                  Advanced form handling with real-time validation, error
                  states, and user feedback.
                </p>

                <div class="component-demos">
                  <div class="component-demo">
                    <div
                      class="component-placeholder"
                      data-component="fx-contact-form"
                    >
                      <div class="loading-component">
                        <div class="loading-spinner">⏳</div>
                        <p>Loading Contact Form...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div class="component-category">
                <h3 class="category-title">📊 Data Management</h3>
                <p class="category-description">
                  Feature-rich data table with sorting, filtering, pagination,
                  and bulk operations.
                </p>

                <div class="component-demos">
                  <div class="component-demo">
                    <div
                      class="component-placeholder"
                      data-component="fx-data-table"
                    >
                      <div class="loading-component">
                        <div class="loading-spinner">⏳</div>
                        <p>Loading Data Table...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Chat */}
              <div class="component-category">
                <h3 class="category-title">💬 Real-time Chat</h3>
                <p class="category-description">
                  Chat components with simulated real-time updates and
                  HTMX-powered messaging.
                </p>

                <div class="component-demos">
                  <div class="component-demo">
                    <h4 class="demo-title">Interactive Chat Widget</h4>
                    <div
                      class="component-placeholder"
                      data-component="fx-chat-widget"
                      data-username="Demo User"
                    >
                      <div class="loading-component">
                        <div class="loading-spinner">⏳</div>
                        <p>Loading Chat Widget...</p>
                      </div>
                    </div>
                  </div>

                  <div class="component-demo">
                    <h4 class="demo-title">HTMX Chat Room</h4>
                    <div
                      class="component-placeholder"
                      data-component="fx-chat-room"
                      data-room-id="showcase"
                    >
                      <div class="loading-component">
                        <div class="loading-spinner">⏳</div>
                        <p>Loading Chat Room...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section id="docs" class="docs-section">
          <div class="section-container">
            <h2 class="section-title">📚 Documentation & API Reference</h2>

            <div class="docs-grid">
              <div class="doc-category">
                <h3>🚀 Getting Started</h3>
                <ul class="doc-links">
                  <li>
                    <a href="#installation">Installation & Setup</a>
                  </li>
                  <li>
                    <a href="#first-component">Your First Component</a>
                  </li>
                  <li>
                    <a href="#jsx-setup">JSX Configuration</a>
                  </li>
                  <li>
                    <a href="#server-setup">Server-Side Rendering</a>
                  </li>
                </ul>
              </div>

              <div class="doc-category">
                <h3>🔧 Component API</h3>
                <ul class="doc-links">
                  <li>
                    <a href="#simplified-api">Simplified Component API</a>
                  </li>
                  <li>
                    <a href="#state-management">State Management</a>
                  </li>
                  <li>
                    <a href="#computed-properties">Computed Properties</a>
                  </li>
                  <li>
                    <a href="#lifecycle-methods">Lifecycle Methods</a>
                  </li>
                </ul>
              </div>

              <div class="doc-category">
                <h3>📡 HTMX Integration</h3>
                <ul class="doc-links">
                  <li>
                    <a href="#htmx-basics">HTMX Basics</a>
                  </li>
                  <li>
                    <a href="#server-endpoints">Server Endpoints</a>
                  </li>
                  <li>
                    <a href="#fragment-updates">Fragment Updates</a>
                  </li>
                  <li>
                    <a href="#real-time-updates">Real-time Updates</a>
                  </li>
                </ul>
              </div>

              <div class="doc-category">
                <h3>🎨 Styling & Theming</h3>
                <ul class="doc-links">
                  <li>
                    <a href="#monospace-design">Monospace Design System</a>
                  </li>
                  <li>
                    <a href="#custom-styling">Custom Styling</a>
                  </li>
                  <li>
                    <a href="#css-variables">CSS Variables</a>
                  </li>
                  <li>
                    <a href="#responsive-design">Responsive Design</a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="api-summary">
              <h3>⚡ Quick API Reference</h3>
              <div class="api-examples">
                <div class="api-example">
                  <h4>Basic Component</h4>
                  <pre><code>{`FeexVeb.component({
  tag: 'my-component',
  state: { count: 0 },
  methods: {
    increment: (state) => state.count++
  },
  render: ({ count, increment }) => (
    <div>
      <span>{count}</span>
      <button onclick={increment}>+</button>
    </div>
  )
});`}</code></pre>
                </div>

                <div class="api-example">
                  <h4>With Attributes</h4>
                  <pre><code>{`FeexVeb.component({
  tag: 'user-card',
  attrs: {
    'name': { type: 'string', default: 'Anonymous' },
    'age': { type: 'number', default: 0 }
  },
  render: ({ name, age }) => (
    <div class="user-card">
      <h3>{name}</h3>
      <p>Age: {age}</p>
    </div>
  )
});`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer class="main-footer">
          <div class="footer-content">
            <div class="footer-section">
              <h4>FeexVeb</h4>
              <p>Modern web development with JSX, SSR, and HTMX</p>
            </div>

            <div class="footer-section">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="#docs">Documentation</a>
                </li>
                <li>
                  <a href="#examples">Examples</a>
                </li>
                <li>
                  <a href="#api">API Reference</a>
                </li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Community</h4>
              <ul>
                <li>
                  <a href="#">GitHub</a>
                </li>
                <li>
                  <a href="#">Discord</a>
                </li>
                <li>
                  <a href="#">Twitter</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p>&copy; 2024 FeexVeb. Built with ❤️ and modern web standards.</p>
          </div>
        </footer>
      </div>{" "}
      {/* End of .unified-layout div */}

      {/* Load all FeexVeb component definitions */}
      <script type="module" src="/examples/counter/counter.js"></script>
      <script type="module" src="/examples/components/todo-list.js"></script>
      <script type="module" src="/examples/components/weather-widget.js">
      </script>
      <script type="module" src="/examples/components/form-validation.js">
      </script>
      <script type="module" src="/examples/components/data-table.js"></script>
      <script type="module" src="/examples/components/chat.js"></script>

      {/* Component placeholder replacement script */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: `
      // Wait for all components to be defined, then replace placeholders
      function replaceComponentPlaceholders() {
        const placeholders = document.querySelectorAll('.component-placeholder');

        placeholders.forEach(placeholder => {
          const componentTag = placeholder.dataset.component;

          // Check if the custom element is defined
          if (customElements.get(componentTag)) {
            const componentElement = document.createElement(componentTag);

            // Copy all data attributes as regular attributes
            Object.keys(placeholder.dataset).forEach(key => {
              if (key !== 'component') { // 'component' is not an actual attribute for the element
                const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                componentElement.setAttribute(attrName, placeholder.dataset[key]);
              }
            });

            // Replace the placeholder with the actual component
            placeholder.parentNode.replaceChild(componentElement, placeholder);
            console.log(\`Replaced placeholder for \${componentTag}\`);
          } else {
            // console.warn(\`Custom element \${componentTag} not defined yet.\`);
          }
        });
      }

      // Try to replace placeholders immediately on script load
      replaceComponentPlaceholders();

      // Set up a MutationObserver to watch for new elements being added to the DOM,
      // and also to retry for components that might define themselves later.
      const observer = new MutationObserver((mutationsList, obs) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            replaceComponentPlaceholders();
            break; 
          }
        }
        replaceComponentPlaceholders(); 
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Fallback attempts for components that might load with delay
      setTimeout(replaceComponentPlaceholders, 100);
      setTimeout(replaceComponentPlaceholders, 500);
      setTimeout(replaceComponentPlaceholders, 1500);
    `,
        }}
      />
    </body>
  </html>
);
