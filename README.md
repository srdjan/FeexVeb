# FeexVeb - Functional Web Components Library

## What is FeexVeb?

FeexVeb is a minimal functional library for building web applications with JSX
and Web Components. It uses HTMX for server-side driven reactivity. This guide
explains how to use **FeexVeb** to create powerful web applications that combine
client-side state management with server-driven HTML updates.

It was created during a one-hour vibe coding session 😊 with Claude. Simply
amazing what can be accomplished these days in a short time. Kudos to my
sidekick 🙌

**This is not going anywhere, just a little play around.** **Disclaimer:** It
works on my machine :) - no other guarantees

## Getting Started

### Installation

1. Clone the repository
2. Start the development server:

   ```bash
   deno task dev
   ```

3. Open your browser to `http://localhost:8000`

### Demo Features

The single demo page (`/`) showcases all FeexVeb features:

- **Pure client-side counter** - Simplified API with attributes and computed
  state
- **Minimal counter** - Bare minimum code demonstration
- **Hybrid counter** - Server + client with HTMX integration and optimistic
  updates
- **Server-only counter** - Pure HTMX for comparison

All components use FeexVeb's built-in monospace design system with no custom CSS
required.

### Project Structure

- `lib/feexveb.js` - Core library
- `lib/src/` - Modular implementation files
  - `lib/src/monospace-styles.js` - Default monospace styling system
- `examples/` - Example implementations
- `server/` - Deno HTTP server for examples

## About FeexVeb and HTMX

FeexVeb is a minimal library for building web applications with JSX and Web
Components. It provides:

- **Component Creation**: Define custom elements with reactive state
- **State Management**: Reactive state with `useState` and `useComputed`,
  powered by Maverick.js Signals
- **Side Effects**: Manage effects with cleanup functions
- **HTMX Integration**: Seamless integration with HTMX for server interactions
- **Monospace Styling**: Default styling based on "The Monospace Web" design
  principles

HTMX is a dependency-free JavaScript library that allows you to access modern
browser features directly from HTML, rather than using JavaScript. It extends
HTML with attributes like `hx-get`, `hx-post`, and `hx-swap` that allow you to
make AJAX requests and update the page dynamically.

## Why Use FeexVeb with HTMX?

FeexVeb and HTMX complement each other perfectly:

- **FeexVeb**: Provides client-side state management and component lifecycle,
  using a functional approach with custom elements.
- **HTMX**: Provides HTML-driven server communication and page updates.

Together, they create a powerful approach that offers:

1. **Progressive enhancement**: Applications work with or without JavaScript
2. **Reduced JavaScript**: Much less client-side code to maintain
3. **Component encapsulation**: Clean organization of UI elements
4. **Server-driven updates**: Server-rendered HTML instead of complex JSON APIs
5. **Improved performance**: Smaller JS payload, faster loading times
6. **Simplified mental model**: HTML-driven approach is easier to reason about

## Creating Components

FeexVeb offers two APIs for creating components: a **simplified API** for quick
development and an **advanced API** for full control.

### Simplified API (Recommended)

The simplified API reduces boilerplate and makes state directly accessible:

```javascript
FeexVeb.component({
  tag: "my-counter",

  // Declarative state definition
  state: {
    count: 0,
  },

  // Declarative methods with direct state access
  methods: {
    increment: (state) => state.count++,
  },

  // Direct state access in render (no .get() calls needed)
  render: ({ count, increment }) => (
    <div>
      <div>Count: {count}</div>
      <button onclick={increment}>Increment</button>
    </div>
  ),
});
```

### Advanced API (Full Control)

For complex components requiring full control:

```javascript
FeexVeb.defineComponent({
  tag: "advanced-counter",

  setup: (ctx) => {
    const count = FeexVeb.useState(0);

    return {
      state: { count },
      methods: {
        increment: () => count.set(count.get() + 1),
      },
    };
  },

  render: (ctx) => (
    <div>
      <div>Count: {ctx.count.get()}</div>
      <button onclick={ctx.increment}>Increment</button>
    </div>
  ),
});
```

### Simplified API with Computed State and Attributes

```javascript
FeexVeb.component({
  tag: "smart-counter",

  // State with automatic attribute binding
  state: {
    count: 0, // Will be overridden by 'initial-count' attribute
  },

  // Computed state with automatic dependency tracking
  computed: {
    isEven: (state) => state.count % 2 === 0,
    doubled: (state) => state.count * 2,
  },

  // Methods with direct state access
  methods: {
    increment: (state) => state.count++,
    decrement: (state) => state.count--,
    reset: (state) => state.count = 0,
  },

  // Automatic attribute handling with type inference
  attrs: {
    "title": { type: "string", default: "Smart Counter" },
    "initial-count": { type: "number", default: 0 },
    "step": { type: "number", default: 1 },
  },

  // Direct access to all state, computed values, methods, and attributes
  render: (
    { count, isEven, doubled, increment, decrement, reset, title, step },
  ) => (
    <div class="container">
      <h2>{title}</h2>
      <div class={isEven ? "even" : "odd"}>Count: {count}</div>
      <div>Doubled: {doubled}</div>
      <div>
        <button onclick={decrement}>-{step}</button>
        <button onclick={increment}>+{step}</button>
        <button onclick={reset}>Reset</button>
      </div>
    </div>
  ),
});
```

### Advanced API with Full Control

```javascript
FeexVeb.defineComponent({
  tag: "advanced-counter",
  shadowMode: "open",
  useMonospaceStyles: true,

  setup: (ctx) => {
    const count = FeexVeb.useState(0);

    return {
      state: { count },
      methods: {
        increment: () => count.set(count.get() + 1),
      },
    };
  },

  render: (ctx) => (
    <div class="container">
      <h2>Advanced Counter</h2>
      <div>Count: {ctx.count.get()}</div>
      <button onclick={ctx.increment}>Increment</button>
    </div>
  ),
});
```

### API Comparison

| Feature              | Simplified API           | Advanced API                           |
| -------------------- | ------------------------ | -------------------------------------- |
| **Boilerplate**      | Minimal                  | More verbose                           |
| **State Access**     | Direct (`count`)         | Method calls (`ctx.count.get()`)       |
| **State Definition** | Declarative object       | Manual `useState()` calls              |
| **Computed State**   | Declarative functions    | Manual `useComputed()` calls           |
| **Methods**          | Direct state access      | Context parameter required             |
| **Attributes**       | Automatic type inference | Manual attribute handling              |
| **Learning Curve**   | Gentle                   | Steeper                                |
| **Use Case**         | Most components          | Complex components with advanced needs |

### When to Use Each API

**Use Simplified API (`FeexVeb.component`) when:**

- Building most components (recommended default)
- You want minimal boilerplate
- State management is straightforward
- You prefer declarative patterns

**Use Advanced API (`FeexVeb.defineComponent`) when:**

- You need fine-grained control over component lifecycle
- Complex state initialization is required
- You're migrating existing components
- You need advanced effect management

### HTMX Integration (Hybrid Approach)

The simplified API works seamlessly with HTMX for server-driven updates while
maintaining client-side reactivity:

```javascript
FeexVeb.component({
  tag: "hybrid-counter",

  // Minimal client state for optimistic updates and UI feedback
  state: {
    isLoading: false,
    lastAction: "",
    optimisticCount: null,
  },

  // Computed state for UI feedback
  computed: {
    statusMessage: (state) => {
      if (state.isLoading) return `${state.lastAction}...`;
      return "Ready";
    },
  },

  // Client-side methods for optimistic updates
  methods: {
    optimisticIncrement: (state) => {
      state.isLoading = true;
      state.lastAction = "Incrementing";
      if (state.optimisticCount !== null) {
        state.optimisticCount++;
      }
    },

    onServerResponse: (state) => {
      state.isLoading = false;
      state.optimisticCount = null; // Server response updates actual display
    },
  },

  // Custom setup for HTMX event coordination
  setup: (ctx) => {
    const element = ctx.element;

    // Listen for HTMX events to coordinate client-side state
    const handleBeforeRequest = (event) => {
      const url = event.detail.requestConfig.path;
      if (url.includes("increment")) {
        ctx.optimisticIncrement();
      }
    };

    const handleAfterRequest = () => {
      ctx.onServerResponse();
    };

    element.addEventListener("htmx:beforeRequest", handleBeforeRequest);
    element.addEventListener("htmx:afterRequest", handleAfterRequest);

    return {
      effects: [
        () => {
          element.removeEventListener(
            "htmx:beforeRequest",
            handleBeforeRequest,
          );
          element.removeEventListener("htmx:afterRequest", handleAfterRequest);
        },
      ],
    };
  },

  render: ({ statusMessage, isLoading, optimisticCount }) => (
    <div class="hybrid-counter">
      <h3>Hybrid Counter (Server + Client)</h3>

      {/* Server-driven counter value */}
      <div
        id="server-value"
        hx-get="/api/counter/value"
        hx-trigger="load"
      >
        Loading...
      </div>

      {/* Client-side optimistic preview */}
      <div class="optimistic-preview">
        Preview: {optimisticCount !== null ? optimisticCount : "Synced"}
        <div class="status">{statusMessage}</div>
      </div>

      {/* HTMX-powered buttons with optimistic updates */}
      <button
        hx-post="/api/counter/increment"
        hx-target="#server-value"
        hx-swap="innerHTML"
        disabled={isLoading}
      >
        Increment (Server)
      </button>

      <button
        hx-post="/api/counter/reset"
        hx-target="#server-value"
        hx-swap="innerHTML"
        disabled={isLoading}
      >
        Reset (Server)
      </button>
    </div>
  ),
});
```

This hybrid approach demonstrates:

- **Server as source of truth**: All mutations go through server endpoints
- **Optimistic updates**: UI updates immediately for better user experience
- **HTMX integration**: Declarative server communication with `hx-*` attributes
- **Client-side reactivity**: Loading states and status messages
- **Event coordination**: HTMX events trigger client-side state updates

## State Management

FeexVeb's state management system is built on top of
[Maverick.js Signals](https://github.com/maverick-js/signals), a
high-performance reactive signals library. This provides automatic dependency
tracking, efficient updates, and excellent performance while maintaining a
simple, familiar API.

### Basic State

```javascript
// Create reactive state
const count = FeexVeb.useState(0);

// Read state
console.log(count.get()); // 0

// Update state
count.set(5);
count.set((prev) => prev + 1); // Function updates

// Subscribe to changes
const unsubscribe = count.subscribe((newValue) => {
  console.log("Count changed to:", newValue);
});

// Cleanup
unsubscribe();
```

### Computed State

```javascript
const firstName = FeexVeb.useState("John");
const lastName = FeexVeb.useState("Doe");

// Computed state automatically tracks dependencies
const fullName = FeexVeb.useComputed(() => {
  return `${firstName.get()} ${lastName.get()}`;
}, [firstName, lastName]); // Dependencies array is optional with Maverick.js

console.log(fullName.get()); // "John Doe"

firstName.set("Jane");
console.log(fullName.get()); // "Jane Doe" - automatically updated
```

### Effects

```javascript
const user = FeexVeb.useState(null);

// Effect runs when dependencies change
const cleanup = FeexVeb.useEffect(() => {
  console.log("User changed:", user.get());

  // Optional cleanup function
  return () => {
    console.log("Cleaning up previous effect");
  };
}, [user]);

// Effect with no dependencies (runs once)
const onceCleanup = FeexVeb.useEffect(() => {
  console.log("This runs once");

  return () => {
    console.log("Cleanup on unmount");
  };
}, []); // Empty dependencies array

// Manual cleanup
cleanup();
onceCleanup();
```

### State in Components

```javascript
FeexVeb.component({
  tag: "user-profile",

  setup: (ctx) => {
    const user = FeexVeb.useState({ name: "John", age: 30 });
    const isAdult = FeexVeb.useComputed(() => user.get().age >= 18, [user]);

    // Effect for side effects
    const logEffect = FeexVeb.useEffect(() => {
      console.log("User updated:", user.get());
    }, [user]);

    return {
      state: { user, isAdult },
      methods: {
        updateAge: (newAge) => {
          user.set((prev) => ({ ...prev, age: newAge }));
        },
      },
      effects: [logEffect], // Cleanup handled automatically
    };
  },

  render: (ctx) => (
    <div>
      <h2>{ctx.user.get().name}</h2>
      <p>Age: {ctx.user.get().age}</p>
      <p>Status: {ctx.isAdult.get() ? "Adult" : "Minor"}</p>
      <button onclick={() => ctx.updateAge(ctx.user.get().age + 1)}>
        Birthday
      </button>
    </div>
  ),
});
```

### Benefits of Maverick.js Signals

1. **Automatic Dependency Tracking** - No need to manually specify dependencies
   in most cases
2. **High Performance** - Optimized for minimal re-computations and updates
3. **Memory Efficient** - Automatic cleanup and garbage collection
4. **Synchronous Updates** - Predictable update timing with `tick()` for
   batching
5. **Battle Tested** - Used in production applications and media players

The state system maintains full backward compatibility with existing FeexVeb
components while providing these performance and developer experience
improvements under the hood.

## Styling Components

FeexVeb provides a default monospace styling system based on "The Monospace Web"
design principles. This styling is automatically applied to components that use
Shadow DOM.

### Using Default Monospace Styles

```javascript
// Enable shadow DOM with default monospace styling
FeexVeb.component({
  tag: "styled-component",
  shadowMode: "open", // Enable shadow DOM
  useMonospaceStyles: true, // Apply monospace styling (default is true)
  // Component implementation...
});
```

### Disabling Default Styles

```javascript
// Enable shadow DOM without default styling
FeexVeb.component({
  tag: "unstyled-component",
  shadowMode: "open",
  useMonospaceStyles: false, // Disable default monospace styling
  // Component implementation...
});
```

### Accessing Styling Utilities

```javascript
// Get the monospace CSS as a string
const css = FeexVeb.styling.monospaceCss;

// Create a style element with monospace CSS
const styleElement = FeexVeb.styling.createMonospaceStyleElement();

// Inject monospace styles into an element or shadow root
FeexVeb.styling.injectMonospaceStyles(element);
```

## Design Philosophy

FeexVeb's default styling system is built upon **"The Monospace Web"** design
principles created by
[Oskar Wickström](https://owickstrom.github.io/the-monospace-web/). This design
philosophy emphasizes simplicity, readability, and content-focused web
experiences through the strategic use of monospace typography and minimal visual
design.

### About "The Monospace Web"

"The Monospace Web" advocates for:

- **Monospace typography** as the foundation for improved readability and
  consistent visual rhythm
- **Minimal color schemes** that prioritize content over decoration
- **Consistent spacing** using systematic measurements
- **Focus on content** rather than complex visual elements
- **Accessibility** through high contrast and clear typography

### FeexVeb's Implementation

FeexVeb implements these principles through two main CSS exports:

- **`FeexVeb.styling.monospaceCss`** - Optimized for Shadow DOM components using
  `:host` selectors
- **`FeexVeb.styling.monospaceCssForHtml`** - Adapted for regular HTML documents
  using `body` and element selectors

Both implementations provide:

```css
/* Core monospace font stack */
--mono-font:
  ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono",
  monospace;

/* Systematic spacing and sizing */
--mono-spacing-unit: 1rem;
--mono-line-height: 1.5;
--mono-max-width: 70ch;

/* Minimal, accessible color palette */
--mono-text: #222222;
--mono-bg: #ffffff;
--mono-link: #0000ee;
--mono-border: #dddddd;
```

### Benefits for FeexVeb Applications

1. **Instant Professional Appearance** - Components look polished without custom
   CSS
2. **Consistent User Experience** - Unified design language across all
   components
3. **Improved Readability** - Monospace fonts enhance text scanning and
   comprehension
4. **Accessibility** - High contrast ratios and clear typography
5. **Responsive Design** - Built-in mobile-first responsive behavior
6. **Developer Productivity** - Focus on functionality rather than styling
   decisions

### Customization and Flexibility

While FeexVeb defaults to monospace styling, you maintain full control:

```javascript
// Use default monospace styling
FeexVeb.component({
  tag: "clean-component",
  shadowMode: "open",
  useMonospaceStyles: true, // Default behavior
  // ...
});

// Disable for custom styling
FeexVeb.component({
  tag: "custom-component",
  shadowMode: "open",
  useMonospaceStyles: false, // Opt out of defaults
  // ...
});
```

This approach allows you to leverage the proven design principles of "The
Monospace Web" while maintaining the flexibility to customize when needed. We're
grateful to Oskar Wickström for creating and sharing these thoughtful design
principles that make the web more readable and accessible.

## HTMX Events

FeexVeb can listen to HTMX events for enhanced integration:

```javascript
// Listen for HTMX events
document.body.addEventListener("htmx:afterSwap", (event) => {
  console.log("Content swapped", event.detail.elt);
});

// Custom HTMX event handling in components
FeexVeb.component({
  tag: "data-loader",

  setup: (ctx) => {
    const element = ctx.element;

    // Create effect to handle HTMX events
    const setupHtmxHandlers = () => {
      const handleAfterRequest = (event) => {
        console.log("Request completed", event.detail);
      };

      element.addEventListener("htmx:afterRequest", handleAfterRequest);

      // Return cleanup function
      return () => {
        element.removeEventListener("htmx:afterRequest", handleAfterRequest);
      };
    };

    return {
      effects: [setupHtmxHandlers],
    };
  },

  render: (ctx) => (
    <div>
      <div
        hx-get="/api/data"
        hx-trigger="load"
        hx-indicator="#loading"
      >
        Loading...
      </div>
      <div id="loading" class="htmx-indicator">
        Processing...
      </div>
    </div>
  ),
});
```

## Best Practices

1. **Use attributes for configuration**: Make components configurable with
   attributes.
2. **Keep local state minimal**: Use server state for shared data.
3. **Progressive enhancement**: Ensure basic functionality works without
   JavaScript.
4. **Use HTMX for server communication**: Let HTMX handle all AJAX requests.
5. **Use events for cross-component communication**: The event bus can
   coordinate between components.
6. **Cache selectors**: Use `document.getElementById` once and store the
   reference.
7. **Avoid shadow DOM for HTMX-heavy components**: Shadow DOM can complicate
   HTMX targeting.
8. **Process HTMX after DOM updates**: Use `htmx.process` after manual DOM
   manipulation.
9. **Use shadow DOM with monospace styling for UI components**: Get consistent,
   clean styling with minimal effort.
10. **Disable default styling when needed**: Use `useMonospaceStyles: false` for
    components that need custom styling.

## Resources

- [HTMX Documentation](https://htmx.org/docs/)
- [The Monospace Web](https://owickstrom.github.io/the-monospace-web/) - Design
  principles for the default styling
