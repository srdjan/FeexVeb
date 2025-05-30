# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

```bash
# Start development server with hot reload
deno task dev

# Run tests (if available)
deno test

# Check formatting
deno fmt --check

# Format code
deno fmt
```

## Architecture Overview

FeexVeb is a minimal functional library for building web applications with JSX
and Web Components that integrates seamlessly with HTMX. The codebase follows a
modular architecture:

### Core Library Structure (`lib/src/`)

- **`feexveb.js`** - Main entry point that aggregates all modules
- **`component.js`** - Two-tier component API: simplified `component()` and
  advanced `defineComponent()`
- **`state.js`** - Reactive state management using Maverick.js Signals with
  `useState`, `useComputed`, `useEffect`
- **`webjsx.js`** - Virtual DOM implementation for JSX rendering
- **`server-renderer.js`** - Server-side rendering utilities for SSR
- **`htmx_integration.js`** - HTMX integration utilities and event handling
- **`monospace-styles.js`** - "The Monospace Web" design system CSS
- **`eventbus.js`** - Cross-component communication system
- **`utils.js`** - Attribute helpers and utilities

### Component APIs

**Simplified API (`FeexVeb.component`)** - Recommended for most components:

- Declarative state, computed values, and methods
- Direct state access in render functions (no `.get()` calls)
- Automatic attribute binding with type inference
- Minimal boilerplate

**Advanced API (`FeexVeb.defineComponent`)** - For complex components:

- Full control over component lifecycle
- Manual state management with explicit `.get()/.set()` calls
- Advanced effect management

### State Management Philosophy

- Uses lightweight reactive signals inspired by mono-jsx patterns
- Automatic dependency tracking for computed values
- Synchronous updates with batching via `tick()`
- Built-in cleanup and garbage collection
- Zero external dependencies for state management

### HTMX Integration

- Components can listen to HTMX events (`htmx:beforeRequest`,
  `htmx:afterRequest`, etc.)
- Server endpoints return JSX that gets auto-converted to HTML strings
- Hybrid approach: server as source of truth, client for optimistic updates
- Use `processHtmx()` after manual DOM manipulation

### Styling System

- Default monospace styling based on "The Monospace Web" design principles
- `monospaceCss` for Shadow DOM components
- `monospaceCssForHtml` for regular HTML documents
- Can be disabled with `useMonospaceStyles: false`

### Server Architecture (`server/server.ts`)

- Deno HTTP server with mono-jsx for JSX-to-HTML conversion
- API routes under `/api/` pattern
- Detects HTMX requests via `HX-Request` header
- Returns JSX for HTMX requests, JSON for regular API calls
- File serving for static assets and JavaScript modules

### Examples Structure

- `examples/todo-ssr/` - Demonstrates SSR with HTMX for a todo application
- Uses `UnifiedLayout` component for page structure
- Server-side state management with client-side optimistic updates

## Key Development Patterns

1. **Component Registration**: Always check if component is already registered
   before calling `FeexVeb.component()` or `FeexVeb.defineComponent()`

2. **HTMX Response Handling**: Return JSX directly from server handlers -
   mono-jsx automatically converts to HTML strings

3. **State Initialization**: Use attribute binding in simplified API to override
   default state values

4. **Effect Cleanup**: Return cleanup functions from effects, especially for
   event listeners

5. **Server-Client Coordination**: Use HTMX events to coordinate between server
   updates and client state

## Dependencies

- **Deno** - Runtime and package manager
- **mono-jsx** - JSX runtime for both client and server
- **HTMX** - HTML-driven server communication (loaded via CDN)

Note: FeexVeb now includes its own lightweight reactive signals implementation,
eliminating the need for external state management libraries.

## Testing

Use `test_monospace_integration.js` as reference for component testing patterns.
Tests should verify:

- Component registration and rendering
- State reactivity and updates
- HTMX integration
- Attribute binding
