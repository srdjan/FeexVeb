/**
 * HTMX Counter Example
 * 
 * This example demonstrates using FxWeb with HTMX to create a hybrid application
 * that uses both client-side reactivity and server-driven updates.
 * 
 * This example also showcases the default monospace styling for components.
 */
import FxWeb from "../../lib/feexweb.js";

// We'll remove the custom styles and rely on the default monospace styling
// for components that use shadow DOM

// Register the Counter component with local state and shadow DOM
FxWeb.component({
  tag: 'fx-counter',
  shadowMode: 'open', // Enable shadow DOM to use monospace styles
  useMonospaceStyles: true, // Explicitly enable monospace styles (default is true)

  setup: (ctx) => {
    const element = ctx.element;

    // Get initial values from attributes
    const initialCount = FxWeb.numAttr(element, 'initial-count', 0);

    // Create reactive state
    const count = FxWeb.useState(initialCount);

    // Create computed state for even/odd
    const isEven = FxWeb.useComputed(
      () => count.get() % 2 === 0,
      [count]
    );

    // Subscribe to reset event
    const resetListener = EventBus.subscribe('counters:reset-all', () => {
      count.set(initialCount);
    });

    return {
      state: {
        count,
        isEven
      },
      methods: {
        increment: () => {
          count.set(count.get() + 1);
        },
        decrement: () => {
          count.set(count.get() - 1);
        },
        reset: () => {
          count.set(initialCount);
        }
      },
      effects: [
        resetListener
      ]
    };
  },

  render: (ctx) => {
    const element = ctx.element;
    const title = FxWeb.attr(element, 'title', 'Counter');
    const valueClass = ctx.isEven.get() ? 'counter-value even' : 'counter-value odd';

    return (
      <div class="container">
        <h2>{title}</h2>

        <div class={valueClass}>
          {ctx.count.get()}
        </div>

        <div>
          <button class="counter-btn" onclick={ctx.decrement}>
            Decrement
          </button>

          <button class="counter-btn" onclick={ctx.increment}>
            Increment
          </button>

          <button class="counter-btn" onclick={ctx.reset}>
            Reset
          </button>
        </div>

        {/* HTMX-powered server counter */}
        <div>
          <h3>Server-side Counter</h3>
          <p>This part is powered by HTMX and the server:</p>

          <div id="server-counter-value">
            Current value: 0
          </div>

          <div>
            <button
              hx-post="/api/counter/decrement"
              hx-target="#server-counter-value"
              hx-swap="innerHTML"
            >
              Decrement (Server)
            </button>

            <button
              hx-post="/api/counter/increment"
              hx-target="#server-counter-value"
              hx-swap="innerHTML"
            >
              Increment (Server)
            </button>

            <button
              hx-post="/api/counter/reset"
              hx-target="#server-counter-value"
              hx-swap="innerHTML"
            >
              Reset (Server)
            </button>
          </div>

          <div>
            <button
              hx-get="/api/counter/sync"
              hx-target="#server-counter-value"
              hx-swap="innerHTML"
              hx-trigger="every 2s"
            >
              Sync with Server
            </button>
          </div>
        </div>
      </div>
    );
  },

  attributes: ['title', 'initial-count']
});

// Create a hybrid app component
FxWeb.htmx.component({
  tag: 'fx-htmx-app',

  setup: (ctx) => {
    return {
      methods: {
        resetAllCounters: () => {
          EventBus.dispatch('counters:reset-all');

          // Also reset server counter via HTMX
          if (window.htmx) {
            window.htmx.ajax('POST', '/api/counter/reset', {
              target: '#server-counter-value',
              swap: 'innerHTML'
            });
          }
        }
      }
    };
  },

  render: (ctx) => {
    return (
      <div>
        <h1>FxWeb with HTMX Example</h1>

        <p>
          This example demonstrates how to use FxWeb with HTMX to create
          a hybrid application that uses both client-side reactivity and
          server-driven updates.
        </p>

        <div class="counter-controls">
          <button class="counter-btn reset" onclick={ctx.resetAllCounters}>
            Reset All Counters
          </button>
        </div>

        <fx-counter title="Local Counter" initial-count="0"></fx-counter>

        <div class="counter-component">
          <h2 class="counter-title">Pure HTMX Counter</h2>

          <div id="htmx-counter">
            <div class="counter-value" hx-get="/api/counter/value" hx-trigger="load"></div>

            <div class="counter-controls">
              <button
                class="counter-btn decrement"
                hx-post="/api/counter/decrement"
                hx-target="#htmx-counter"
                hx-swap="innerHTML"
              >
                Decrement
              </button>

              <button
                class="counter-btn"
                hx-post="/api/counter/increment"
                hx-target="#htmx-counter"
                hx-swap="innerHTML"
              >
                Increment
              </button>

              <button
                class="counter-btn reset"
                hx-post="/api/counter/reset"
                hx-target="#htmx-counter"
                hx-swap="innerHTML"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

// Initialize HTMX and the application
const init = async () => {
  // Add styles
  addStyles();

  // Initialize HTMX
  try {
    await FxWeb.htmx.init({
      defaultSwapStyle: 'innerHTML',
      historyCacheSize: 10,
      scrollIntoViewOnBoost: true
    });

    console.log('HTMX initialized successfully');
  } catch (error) {
    console.error('Failed to initialize HTMX:', error);
  }

  // Render the app
  const root = document.getElementById('app') || document.body;
  FxWeb.render(root, <fx-htmx-app></fx-htmx-app>);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
