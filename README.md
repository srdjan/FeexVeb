# FeexWeb - Functional Web Components Library

## What is FeexWeb?

FeexWeb is a minimal functional library for building web applications with JSX and Web Components. It uses HTMX for server-side driven reactivity. This guide explains how to use **FeexWeb** to create powerful web applications that combine client-side state management with server-driven HTML updates.

It was created during a one-hour vibe coding session 😊 with Claude. Simply amazing what can be accomplished these days in a short time. Kudos to my sidekick 🙌

**This is not going anywhere, just a little play around.**
**Disclaimer:** It works on my machine :) - no other guarantees

## Getting Started

### Installation

1. Clone the repository
2. Navigate to an example directory: `cd examples/counter`
3. Start the server: `deno run --allow-net --allow-read ../../server/server.ts`
4. Open your browser to `http://localhost:8000`

### Project Structure

- `lib/feexweb.js` - Core library
- `lib/src/` - Modular implementation files
  - `lib/src/monospace-styles.js` - Default monospace styling system
- `examples/` - Example implementations
- `server/` - Deno HTTP server for examples

## About FeexWeb and HTMX

FeexWeb is a minimal library for building web applications with JSX and Web Components. It provides:

- **Component Creation**: Define custom elements with reactive state
- **State Management**: Reactive state with `useState` and `useComputed`
- **Side Effects**: Manage effects with cleanup functions
- **HTMX Integration**: Seamless integration with HTMX for server interactions
- **Monospace Styling**: Default styling based on "The Monospace Web" design principles

HTMX is a dependency-free JavaScript library that allows you to access modern browser features directly from HTML, rather than using JavaScript. It extends HTML with attributes like `hx-get`, `hx-post`, and `hx-swap` that allow you to make AJAX requests and update the page dynamically.

## Why Use FeexWeb with HTMX?

FeexWeb and HTMX complement each other perfectly:

- **FeexWeb**: Provides client-side state management and component lifecycle, using a functional approach with custom elements.
- **HTMX**: Provides HTML-driven server communication and page updates.

Together, they create a powerful approach that offers:

1. **Progressive enhancement**: Applications work with or without JavaScript
2. **Reduced JavaScript**: Much less client-side code to maintain
3. **Component encapsulation**: Clean organization of UI elements
4. **Server-driven updates**: Server-rendered HTML instead of complex JSON APIs
5. **Improved performance**: Smaller JS payload, faster loading times
6. **Simplified mental model**: HTML-driven approach is easier to reason about

## Creating Components

### Basic Component

```javascript
FxWeb.component({
  tag: 'my-counter',
  
  setup: (ctx) => {
    const count = FxWeb.useState(0);
    
    return {
      state: { count },
      methods: {
        increment: () => count.set(count.get() + 1)
      }
    };
  },
  
  render: (ctx) => (
    <div>
      <div>Count: {ctx.count.get()}</div>
      <button onclick={ctx.increment}>Increment</button>
    </div>
  )
});
```

### Component with Shadow DOM and Monospace Styling

```javascript
FxWeb.component({
  tag: 'styled-counter',
  shadowMode: 'open', // Enable shadow DOM
  useMonospaceStyles: true, // Apply monospace styling (default is true)
  
  setup: (ctx) => {
    const count = FxWeb.useState(0);
    
    return {
      state: { count },
      methods: {
        increment: () => count.set(count.get() + 1)
      }
    };
  },
  
  render: (ctx) => (
    <div class="container">
      <h2>Monospace Styled Counter</h2>
      <div>Count: {ctx.count.get()}</div>
      <button onclick={ctx.increment}>Increment</button>
    </div>
  )
});
```

### HTMX Integration

```javascript
FxWeb.htmx.component({
  tag: 'server-counter',
  
  setup: (ctx) => {
    return {
      methods: {
        resetCounter: () => {
          if (window.htmx) {
            window.htmx.ajax('POST', '/api/counter/reset', {
              target: '#counter-value',
              swap: 'innerHTML'
            });
          }
        }
      }
    };
  },
  
  render: (ctx) => (
    <div>
      <div id="counter-value" hx-get="/api/counter/value" hx-trigger="load">
        Loading...
      </div>
      
      <button 
        hx-post="/api/counter/increment" 
        hx-target="#counter-value"
      >
        Increment
      </button>
      
      <button onclick={ctx.resetCounter}>Reset</button>
    </div>
  )
});
```

## Styling Components

FeexWeb provides a default monospace styling system based on "The Monospace Web" design principles. This styling is automatically applied to components that use Shadow DOM.

### Using Default Monospace Styles

```javascript
// Enable shadow DOM with default monospace styling
FxWeb.component({
  tag: 'styled-component',
  shadowMode: 'open', // Enable shadow DOM
  useMonospaceStyles: true, // Apply monospace styling (default is true)
  
  // Component implementation...
});
```

### Disabling Default Styles

```javascript
// Enable shadow DOM without default styling
FxWeb.component({
  tag: 'unstyled-component',
  shadowMode: 'open',
  useMonospaceStyles: false, // Disable default monospace styling
  
  // Component implementation...
});
```

### Accessing Styling Utilities

```javascript
// Get the monospace CSS as a string
const css = FxWeb.styling.monospaceCss;

// Create a style element with monospace CSS
const styleElement = FxWeb.styling.createMonospaceStyleElement();

// Inject monospace styles into an element or shadow root
FxWeb.styling.injectMonospaceStyles(element);
```

## HTMX Events

FeexWeb can listen to HTMX events for enhanced integration:

```javascript
// Listen for HTMX events
document.body.addEventListener('htmx:afterSwap', (event) => {
  console.log('Content swapped', event.detail.elt);
});

// Custom HTMX event handling in components
FxWeb.component({
  tag: 'data-loader',
  
  setup: (ctx) => {
    const element = ctx.element;
    
    // Create effect to handle HTMX events
    const setupHtmxHandlers = () => {
      const handleAfterRequest = (event) => {
        console.log('Request completed', event.detail);
      };
      
      element.addEventListener('htmx:afterRequest', handleAfterRequest);
      
      // Return cleanup function
      return () => {
        element.removeEventListener('htmx:afterRequest', handleAfterRequest);
      };
    };
    
    return {
      effects: [setupHtmxHandlers]
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
  )
});
```

## Best Practices

1. **Use attributes for configuration**: Make components configurable with attributes.
2. **Keep local state minimal**: Use server state for shared data.
3. **Progressive enhancement**: Ensure basic functionality works without JavaScript.
4. **Use HTMX for server communication**: Let HTMX handle all AJAX requests.
5. **Use events for cross-component communication**: The event bus can coordinate between components.
6. **Cache selectors**: Use `document.getElementById` once and store the reference.
7. **Avoid shadow DOM for HTMX-heavy components**: Shadow DOM can complicate HTMX targeting.
8. **Process HTMX after DOM updates**: Use `htmx.process` after manual DOM manipulation.
9. **Use shadow DOM with monospace styling for UI components**: Get consistent, clean styling with minimal effort.
10. **Disable default styling when needed**: Use `useMonospaceStyles: false` for components that need custom styling.

## Resources

- [HTMX Documentation](https://htmx.org/docs/)
- [The Monospace Web](https://owickstrom.github.io/the-monospace-web/) - Design principles for the default styling
