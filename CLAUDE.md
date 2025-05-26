# CLAUDE.md - FxWeb Development Guide

## Build & Development
- Start dev server: `deno task dev`
- Server: Run with `deno run --allow-net --allow-read server/server.ts`
- To test the counter example: `cd examples/counter && deno run --allow-net --allow-read ../../server/server.ts`

## Project Structure
- `lib/feexweb.js` - Core library
- `lib/src/` - Modular implementation files
  - `lib/src/component.js` - Component definition system
  - `lib/src/state.js` - Reactive state management
  - `lib/src/eventbus.js` - Event bus for component communication
  - `lib/src/htmx_integration.js` - HTMX integration utilities
  - `lib/src/monospace-styles.js` - Default monospace styling system
  - `lib/src/utils.js` - Utility functions
  - `lib/src/webjsx.js` - JSX implementation
- `examples/` - Example implementations
- `server/` - Deno HTTP server for examples

## Code Style
- JSX syntax with Web Components
- Functional programming approach with hooks-like patterns
- Kebab-case for HTML custom element tags
- CamelCase for JavaScript identifiers
- TypeScript with strict typing

## Component Conventions
1. Components defined with `FxWeb.component({...})` 
2. Required options: `tag`, `setup`, `render`
3. State management via `FxWeb.useState()` and `FxWeb.useComputed()`
4. Side effects with `FxWeb.useEffect()`
5. Component properties configured via HTML attributes

## Styling System
1. Default monospace styling based on "The Monospace Web" design principles
2. Automatically applied to components using Shadow DOM
3. Can be disabled with `useMonospaceStyles: false` option
4. Access styling utilities via `FxWeb.styling` namespace:
   - `FxWeb.styling.monospaceCss` - CSS string
   - `FxWeb.styling.createMonospaceStyleElement()` - Create style element
   - `FxWeb.styling.injectMonospaceStyles(root)` - Inject styles into element/shadow root
5. Custom styles can be added to components using standard CSS

## Component Options
```javascript
FxWeb.component({
  // Required options
  tag: 'my-component',           // HTML tag name (must contain a hyphen)
  setup: (ctx) => { ... },       // Setup function that initializes state, methods, effects
  render: (ctx) => { ... },      // Render function that returns JSX

  // Optional options
  shadowMode: 'open',            // 'open', 'closed', or null (default)
  useMonospaceStyles: true,      // Apply default monospace styling (default: true)
  attributesSchema: {            // Schema for attribute-to-state mapping
    'initial-count': 'number',   // Attribute types: 'string', 'number', 'boolean'
    'title': 'string'
  },
  attributes: ['title'],         // Alternative to attributesSchema (simpler)
  processHtmxInShadow: true      // Process HTMX in shadow DOM (default: true)
});
```

## Error Handling
- Functions should return cleanup functions where appropriate
- Validate component options and throw descriptive errors
- Use try/catch blocks for error handling in async operations

## HTMX Integration
- Use `FxWeb.htmx.init()` to initialize HTMX
- Use `FxWeb.htmx.component()` for HTMX-specific components
- HTMX attributes are automatically processed after rendering
- Shadow DOM can complicate HTMX targeting - use with caution
