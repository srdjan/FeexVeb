# CLAUDE.md - FxWeb Development Guide

## Build & Development
- Start dev server: `deno task dev`
- Server: Run with `deno run --allow-net --allow-read server/server.ts`
- To test the counter example: `cd examples/counter && deno run --allow-net --allow-read ../../server/server.ts`

## Project Structure
- `lib/fxweb.js` - Core library
- `lib/deps/webjsx` - JSX implementation dependency
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

## Error Handling
- Functions should return cleanup functions where appropriate
- Validate component options and throw descriptive errors
- Use try/catch blocks for error handling in async operations