/**
 * Server-side layout component using JSX with mono-jsx
 */

export const Layout = () => (
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
);
