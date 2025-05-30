/**
 * @file FeexVeb Simplified - Main entry point for the refactored library
 * Eliminates redundant abstractions and embraces native dependencies
 */

// Direct dependency exports - no custom wrappers
// Core JSX exports directly from mono-jsx
export { Fragment, jsx as createElement, jsxs, renderToString } from "mono-jsx/jsx-runtime";

// Reactive state management
export { batch, tick, useComputed, useEffect, useState, createStates, getValues } from "./state.js";

// Simplified FeexVeb modules
// Component API
export { component, defineComponent } from "./component.js";
// No custom DOM wrappers; users can import directly from mono-jsx or use HTMX integration

// HTMX integration
export {
  addHtmxListener,
  configureHtmx,
  htmxAttrs,
  htmxEvents,
  htmxPatterns,
  initHtmx,
  processHtmx,
  triggerHtmx,
} from "./htmx_integration.js";

// Styling and theming
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

// Default export of the FeexVeb namespace
import {
  Fragment,
  jsx as createElement,
  jsxs,
  renderToString,
} from "mono-jsx/jsx-runtime";
import {
  batch,
  tick,
  useComputed,
  useEffect,
  useState,
  createStates,
  getValues,
} from "./state.js";
import { component, defineComponent } from "./component.js";
import * as htmx from "./htmx_integration.js";
import * as styling from "./monospace-styles.js";

const FeexVeb = {
  // Core JSX functions
  createElement,
  Fragment,
  renderToString,

  // State management
  useState,
  useComputed,
  useEffect,
  tick,
  batch,
  createStates,
  getValues,

  // Component API
  component,
  defineComponent,

  // HTMX integration
  htmx: {
    init: htmx.initHtmx,
    process: htmx.processHtmx,
    trigger: htmx.triggerHtmx,
    attrs: htmx.htmxAttrs,
    patterns: htmx.htmxPatterns,
    events: htmx.htmxEvents,
    listen: htmx.addHtmxListener,
    configure: htmx.configureHtmx,
  },

  // Styling system
  styling: {
    shadowCss: styling.getShadowDomCss,
    regularCss: styling.getRegularDomCss,
    inject: styling.injectMonospaceStyles,
    createStyleElement: styling.createShadowStyleElement,
    addMonospaceClass: styling.addMonospaceClass,

    // Legacy compatibility
    monospaceCss: styling.monospaceCss,
    monospaceCssForHtml: styling.monospaceCssForHtml,
    createMonospaceStyleElement: styling.createMonospaceStyleElement,
    injectMonospaceStyles: styling.injectMonospaceStyles,
  },
};

// Global registration for backward compatibility
if (typeof globalThis !== "undefined") {
  globalThis.FeexVeb = FeexVeb;
}

export {
  Fragment,
  createElement,
  jsxs,
  renderToString,
  batch,
  tick,
  useComputed,
  useEffect,
  useState,
  createStates,
  getValues,
  component,
  defineComponent,
  addHtmxListener,
  configureHtmx,
  htmxAttrs,
  htmxEvents,
  htmxPatterns,
  initHtmx,
  processHtmx,
  triggerHtmx,
  addMonospaceClass,
  createMonospaceStyleElement,
  createRegularStyleElement,
  createShadowStyleElement,
  getRegularDomCss,
  getShadowDomCss,
  injectMonospaceStyles,
  monospaceCss,
  monospaceCssForHtml,
};
export default FeexVeb;
