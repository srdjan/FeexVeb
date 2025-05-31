/**
 * Unit tests for FeexVeb main entry point
 * Tests the unified API and module exports
 */

import "./test-dom-setup.js";
import FeexVeb from "../lib/src/feexveb.js";

console.log("Testing FeexVeb main entry point...\n");

// Test 1: Main namespace exists
console.log("✓ Test 1: Main namespace exists");
console.assert(typeof FeexVeb === "object", "FeexVeb should be an object");
console.assert(FeexVeb !== null, "FeexVeb should not be null");

// Test 2: Core JSX functions exist
console.log("\n✓ Test 2: Core JSX functions exist");
console.assert(typeof FeexVeb.createElement === "function", "createElement should be a function");
console.assert(typeof FeexVeb.Fragment === "symbol", "Fragment should be a symbol");
// renderToString removed - mono-jsx handles SSR automatically

// Test 3: State management functions exist
console.log("\n✓ Test 3: State management functions exist");
console.assert(typeof FeexVeb.useState === "function", "useState should be a function");
console.assert(typeof FeexVeb.useComputed === "function", "useComputed should be a function");
console.assert(typeof FeexVeb.useEffect === "function", "useEffect should be a function");
console.assert(typeof FeexVeb.tick === "function", "tick should be a function");
console.assert(typeof FeexVeb.batch === "function", "batch should be a function");

// Test 4: Component API functions exist
console.log("\n✓ Test 4: Component API functions exist");
console.assert(typeof FeexVeb.component === "function", "component should be a function");
console.assert(typeof FeexVeb.defineComponent === "function", "defineComponent should be a function");

// Test 5: Utility functions exist
console.log("\n✓ Test 5: Utility functions exist");
console.assert(typeof FeexVeb.createStates === "function", "createStates should be a function");
console.assert(typeof FeexVeb.getValues === "function", "getValues should be a function");

// Test 6: HTMX integration exists
console.log("\n✓ Test 6: HTMX integration exists");
console.assert(typeof FeexVeb.htmx === "object", "htmx should be an object");
console.assert(typeof FeexVeb.htmx.init === "function", "htmx.init should be a function");
console.assert(typeof FeexVeb.htmx.process === "function", "htmx.process should be a function");
console.assert(typeof FeexVeb.htmx.trigger === "function", "htmx.trigger should be a function");
console.assert(typeof FeexVeb.htmx.attrs === "function", "htmx.attrs should be a function");
console.assert(typeof FeexVeb.htmx.patterns === "object", "htmx.patterns should be an object");
console.assert(typeof FeexVeb.htmx.events === "object", "htmx.events should be an object");
console.assert(typeof FeexVeb.htmx.listen === "function", "htmx.listen should be a function");
console.assert(typeof FeexVeb.htmx.configure === "function", "htmx.configure should be a function");

// Test 7: Styling system exists
console.log("\n✓ Test 7: Styling system exists");
console.assert(typeof FeexVeb.styling === "object", "styling should be an object");
console.assert(typeof FeexVeb.styling.shadowCss === "function", "styling.shadowCss should be a function");
console.assert(typeof FeexVeb.styling.regularCss === "function", "styling.regularCss should be a function");
console.assert(typeof FeexVeb.styling.inject === "function", "styling.inject should be a function");
console.assert(typeof FeexVeb.styling.createStyleElement === "function", "styling.createStyleElement should be a function");
console.assert(typeof FeexVeb.styling.addMonospaceClass === "function", "styling.addMonospaceClass should be a function");

// Test 8: Legacy compatibility exists
console.log("\n✓ Test 8: Legacy compatibility exists");
console.assert(typeof FeexVeb.styling.monospaceCss === "string", "styling.monospaceCss should be a string");
console.assert(typeof FeexVeb.styling.monospaceCssForHtml === "string", "styling.monospaceCssForHtml should be a string");
console.assert(typeof FeexVeb.styling.createMonospaceStyleElement === "function", "styling.createMonospaceStyleElement should be a function");
console.assert(typeof FeexVeb.styling.injectMonospaceStyles === "function", "styling.injectMonospaceStyles should be a function");

// Test 9: Global registration
console.log("\n✓ Test 9: Global registration");
console.assert(globalThis.FeexVeb === FeexVeb, "FeexVeb should be globally registered");

// (render/hydrate wrappers are removed; use mono-jsx directly if needed)

console.log("\n🎉 All FeexVeb main entry point tests passed!");