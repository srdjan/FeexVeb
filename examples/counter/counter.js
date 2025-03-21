/**
 * HTMX Counter Example
 * 
 * This example demonstrates using FxWeb with HTMX to create a hybrid application
 * that uses both client-side reactivity and server-driven updates.
 */
import FxWeb from "../../lib/fxweb.js";

// Add styles for the application
const addStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .counter-component {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin: 1rem 0;
    }
    
    .counter-title {
      margin-top: 0;
      color: #2c3e50;
    }
    
    .counter-value {
      font-size: 2rem;
      font-weight: bold;
      margin: 1rem 0;
    }
    
    .counter-value.even { color: #3498db; }
    .counter-value.odd { color: #e74c3c; }
    
    .counter-controls {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .counter-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #3498db;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .counter-btn:hover { background: #2980b9; }
    .counter-btn.decrement { background: #e74c3c; }
    .counter-btn.decrement:hover { background: #c0392b; }
    .counter-btn.reset { background: #95a5a6; }
    .counter-btn.reset:hover { background: #7f8c8d; }
    
    .counter-server {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
  `;
  document.head.appendChild(style);
};

// Create a global event bus for communication between components
const EventBus = FxWeb.createEventBus();

// Register the Counter component with local state
FxWeb.component({
  tag: 'fx-counter',

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
      <div class="counter-component">
        <h2 class="counter-title">{title}</h2>

        <div class={valueClass}>
          {ctx.count.get()}
        </div>

        <div class="counter-controls">
          <button class="counter-btn decrement" onclick={ctx.decrement}>
            Decrement
          </button>

          <button class="counter-btn" onclick={ctx.increment}>
            Increment
          </button>

          <button class="counter-btn reset" onclick={ctx.reset}>
            Reset
          </button>
        </div>

        {/* HTMX-powered server counter */}
        <div class="counter-server">
          <h3>Server-side Counter</h3>
          <p>This part is powered by HTMX and the server:</p>

          <div id="server-counter-value">
            Current value: 0
          </div>

          <div class="counter-controls">
            <button
              class="counter-btn decrement"
              hx-post="/api/counter/decrement"
              hx-target="#server-counter-value"
              hx-swap="innerHTML"
            >
              Decrement (Server)
            </button>

            <button
              class="counter-btn"
              hx-post="/api/counter/increment"
              hx-target="#server-counter-value"
              hx-swap="innerHTML"
            >
              Increment (Server)
            </button>

            <button
              class="counter-btn reset"
              hx-post="/api/counter/reset"
              hx-target="#server-counter-value"
              hx-swap="innerHTML"
            >
              Reset (Server)
            </button>
          </div>

          <div class="counter-controls">
            <button
              class="counter-btn"
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