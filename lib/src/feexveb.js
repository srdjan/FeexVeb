/**
 * @file FeexVeb Simplified - Main entry point for the refactored library
 * Eliminates redundant abstractions and embraces native dependencies
 */

// Direct dependency exports - no custom wrappers
export { Fragment, jsx as createElement, jsxs } from "mono-jsx/jsx-runtime";

export { hydrate, render } from "./webjsx.js";

// Use preact's renderToString for server-side rendering
export { render as renderToString } from "https://esm.sh/preact-render-to-string@6.4.0";

export { batch, tick, useComputed, useEffect, useState } from "./state.js";

// Simplified FeexVeb modules
export { component, defineComponent } from "./component.js";
export { createStates, getValues } from "./state.js";
export {
  applyDiff,
  createDomNode,
  htmxAttrs,
  renderWithHtmx,
} from "./webjsx.js";

export {
  addHtmxListener,
  configureHtmx,
  htmxAttrs as normalizeAttrs,
  htmxEvents,
  htmxPatterns,
  initHtmx,
  processHtmx,
  triggerHtmx,
} from "./htmx_integration.js";

export {
  addMonospaceClass,
  createMonospaceStyleElement,
  createRegularStyleElement,
  createShadowStyleElement,
  getRegularDomCss,
  getShadowDomCss,
  injectMonospaceStyles,
  // Legacy exports
  monospaceCss,
  monospaceCssForHtml,
} from "./monospace-styles.js";

/**
 * Main FeexVeb namespace with simplified API surface
 */
const FeexVeb = {
  // Core JSX functions (from jsx-runtime)
  createElement: (await import("mono-jsx/jsx-runtime")).jsx,
  Fragment: (await import("mono-jsx/jsx-runtime")).Fragment,
  render: (await import("./webjsx.js")).render,
  renderToString:
    (await import("https://esm.sh/preact-render-to-string@6.4.0")).render,

  // State management (custom lightweight signals)
  useState: (await import("./state.js")).useState,
  useComputed: (await import("./state.js")).useComputed,
  useEffect: (await import("./state.js")).useEffect,
  tick: (await import("./state.js")).tick,
  batch: (await import("./state.js")).batch,

  // Component API (unified)
  component: (await import("./component.js")).component,
  defineComponent: (await import("./component.js")).defineComponent,

  // Utilities
  createStates: (await import("./state.js")).createStates,
  getValues: (await import("./state.js")).getValues,
  applyDiff: (await import("./webjsx.js")).applyDiff,
  createDomNode: (await import("./webjsx.js")).createDomNode,

  // HTMX integration
  htmx: {
    init: (await import("./htmx_integration.js")).initHtmx,
    process: (await import("./htmx_integration.js")).processHtmx,
    trigger: (await import("./htmx_integration.js")).triggerHtmx,
    attrs: (await import("./htmx_integration.js")).htmxAttrs,
    patterns: (await import("./htmx_integration.js")).htmxPatterns,
    events: (await import("./htmx_integration.js")).htmxEvents,
    listen: (await import("./htmx_integration.js")).addHtmxListener,
    configure: (await import("./htmx_integration.js")).configureHtmx,
  },

  // Styling
  styling: {
    shadowCss: (await import("./monospace-styles.js")).getShadowDomCss,
    regularCss: (await import("./monospace-styles.js")).getRegularDomCss,
    inject: (await import("./monospace-styles.js")).injectMonospaceStyles,
    createStyleElement:
      (await import("./monospace-styles.js")).createShadowStyleElement,
    addMonospaceClass:
      (await import("./monospace-styles.js")).addMonospaceClass,

    // Legacy compatibility
    monospaceCss: (await import("./monospace-styles.js")).monospaceCss,
    monospaceCssForHtml:
      (await import("./monospace-styles.js")).monospaceCssForHtml,
    createMonospaceStyleElement:
      (await import("./monospace-styles.js")).createMonospaceStyleElement,
    injectMonospaceStyles:
      (await import("./monospace-styles.js")).injectMonospaceStyles,
  },

  /**
   * Enhanced render function with HTMX processing
   * @param {HTMLElement} container - Target container
   * @param {*} vdom - Virtual DOM element
   */
  render: async (container, vdom) => {
    const { render } = await import("mono-jsx");
    const element = render(vdom);

    if (element) {
      container.appendChild(element);

      // Process HTMX attributes if available
      if (globalThis.htmx) {
        globalThis.htmx.process(container);
      }
    }

    return element;
  },
};

// Global registration for backward compatibility
if (typeof globalThis !== "undefined") {
  globalThis.FeexVeb = FeexVeb;
}

export default FeexVeb;
