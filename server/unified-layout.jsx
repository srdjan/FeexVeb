/**
 * Unified Home Page Layout - Consolidates all FeexVeb examples and documentation
 */

export const UnifiedLayout = () => (
  <div class="unified-layout">
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
          FeexVeb combines the developer experience of JSX with the performance
          of server-side rendering and the simplicity of HTMX for building
          modern web applications without complex client-side frameworks.
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
              FeexVeb is a minimal library for building modern web applications
              that combines the best of three worlds: JSX for developer
              experience, server-side rendering for performance, and HTMX for
              reactive interactions without complex JavaScript frameworks.
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
                44% less boilerplate code with intuitive component creation and
                automatic attribute handling.
              </p>
            </div>

            <div class="feature-card">
              <h4>⚛️ JSX Syntax Support</h4>
              <p>
                Write components using familiar JSX syntax with Preact-powered
                server-side rendering.
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
                Powered by Maverick.js Signals for efficient reactive updates
                and computed properties.
              </p>
            </div>

            <div class="feature-card">
              <h4>🌐 Web Components Standard</h4>
              <p>
                Built on standard Web Components API for maximum compatibility
                and encapsulation.
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
              Demonstrates FeexVeb's simplified API with attributes, computed
              state, and client-side reactivity.
            </p>
            <div class="example-demo">
              <div
                class="component-placeholder"
                data-component="fx-counter-simple"
                data-title="Simplified Counter"
                data-initial-count="5"
              >
                <div class="loading-component">
                  <div class="loading-spinner">⏳</div>
                  <p>Loading Simplified Counter...</p>
                </div>
              </div>
            </div>
          </div>

          <div class="example-card">
            <div class="example-header">
              <h3 class="example-title">2. Minimal Counter</h3>
              <span class="example-badge minimal">Minimal</span>
            </div>
            <p class="example-description">
              Shows the absolute minimum code needed for a reactive component
              with FeexVeb.
            </p>
            <div class="example-demo">
              <div
                class="component-placeholder"
                data-component="fx-simple-counter"
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
              Traditional server-driven counter using only HTMX for comparison
              with client-side approaches.
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
          demonstrating real-world use cases and advanced patterns for modern
          web applications.
        </p>

        <div class="components-grid">
          {/* Todo Management */}
          <div class="component-category">
            <h3 class="category-title">📝 Todo Management</h3>
            <p class="category-description">
              Interactive todo lists showcasing state management, dynamic lists,
              and HTMX server integration.
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
              Weather components demonstrating external API integration, loading
              states, and error handling.
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
              Advanced form handling with real-time validation, error states,
              and user feedback.
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
              Feature-rich data table with sorting, filtering, pagination, and
              bulk operations.
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
              Chat components with simulated real-time updates and HTMX-powered
              messaging.
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
  </div>
);
