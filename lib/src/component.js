/**
 * @file Unified Component API - Single smart API that adapts to usage patterns
 * Combines the best of both simplified and advanced APIs while eliminating redundancy
 */

import { useComputed, useEffect, useState } from "./state.js";
import { injectMonospaceStyles } from "./monospace-styles.js";

/**
 * @typedef {Object} ComponentOptions
 * @property {string} tag - The custom element tag name
 * @property {Object|Function} [state] - State definition (object) or setup function
 * @property {Object} [computed] - Computed properties (simplified API only)
 * @property {Object} [methods] - Component methods (simplified API only)
 * @property {Object} [attrs] - Attribute definitions with types and defaults
 * @property {Function} render - Render function
 * @property {string} [shadowMode] - Shadow DOM mode ('open', 'closed', or null)
 * @property {boolean} [useMonospaceStyles=true] - Whether to apply monospace styling
 */

/**
 * Unified component API that auto-detects usage pattern
 * @param {ComponentOptions} options - Component configuration
 * @returns {string} The registered tag name
 */
export function component(options) {
  const {
    tag,
    state,
    computed: computedDefs = {},
    methods = {},
    attrs = {},
    render,
    shadowMode = null,
    useMonospaceStyles = true,
  } = options;

  // Auto-detect if this is advanced usage (setup function) or simplified (object)
  const isAdvanced = typeof state === "function";

  class FeexComponent extends HTMLElement {
    constructor() {
      super();

      this.signals = new Map();
      this.computedSignals = new Map();
      this.effects = [];
      this.renderContext = {};

      if (shadowMode) {
        this.attachShadow({ mode: shadowMode });
        if (useMonospaceStyles) {
          injectMonospaceStyles(this.shadowRoot);
        }
      }

      this.setupComponent();
    }

    setupComponent() {
      if (isAdvanced) {
        // Advanced API: call setup function
        const context = {
          element: this,
          useState: (initial) => useState(initial),
          useComputed: (fn, deps) => useComputed(fn),
          useEffect: (fn, deps) => {
            const cleanup = useEffect(fn, deps);
            this.effects.push(cleanup);
            return cleanup;
          },
        };

        const setupResult = state(context);

        // Extract state, methods, and effects from setup result
        if (setupResult.state) {
          Object.entries(setupResult.state).forEach(([key, sig]) => {
            this.signals.set(key, sig);
            Object.defineProperty(this.renderContext, key, {
              get: () => sig.get(),
              enumerable: true,
            });
          });
        }

        if (setupResult.methods) {
          Object.assign(this.renderContext, setupResult.methods);
        }

        if (setupResult.effects) {
          this.effects.push(...setupResult.effects);
        }
      } else {
        // Simplified API: process state object
        this.setupSimplifiedState();
        this.setupComputedProperties();
        this.setupMethods();
      }

      this.setupAttributes();
      this.setupReactiveRender();
    }

    setupSimplifiedState() {
      if (!state || typeof state !== "object") return;

      Object.entries(state).forEach(([key, initialValue]) => {
        // Check for attribute override
        const attrValue = this.getAttributeValue(key, initialValue);
        const sig = useState(attrValue);

        this.signals.set(key, sig);

        // Direct property access for simplified API
        Object.defineProperty(this.renderContext, key, {
          get: () => sig.get(),
          set: (value) => sig.set(value),
          enumerable: true,
        });
      });
    }

    setupComputedProperties() {
      Object.entries(computedDefs).forEach(([key, computeFn]) => {
        const computedSig = useComputed(() => computeFn(this.renderContext));
        this.computedSignals.set(key, computedSig);

        Object.defineProperty(this.renderContext, key, {
          get: () => computedSig.get(),
          enumerable: true,
        });
      });
    }

    setupMethods() {
      Object.entries(methods).forEach(([key, method]) => {
        this.renderContext[key] = (...args) =>
          method(this.renderContext, ...args);
      });
    }

    setupAttributes() {
      if (Object.keys(attrs).length === 0) return;

      // Set up observed attributes for native Web Components attribute handling
      const attrNames = Object.keys(attrs);

      // Define static observedAttributes if not already defined
      if (!this.constructor.observedAttributes) {
        this.constructor.observedAttributes = attrNames;
      }
    }

    getAttributeValue(key, defaultValue) {
      const attrName = key.replace(
        /[A-Z]/g,
        (letter) => `-${letter.toLowerCase()}`,
      );
      const attrDef = attrs[attrName] || attrs[key];

      if (!this.hasAttribute(attrName)) {
        return attrDef?.default ?? defaultValue;
      }

      const value = this.getAttribute(attrName);

      if (attrDef?.type === "number") {
        const num = Number(value);
        return isNaN(num) ? (attrDef.default ?? defaultValue) : num;
      }

      if (attrDef?.type === "boolean") {
        return value !== null;
      }

      return value || (attrDef?.default ?? defaultValue);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;

      // Find corresponding state property
      const stateKey = Object.keys(state || {}).find((key) => {
        const attrName = key.replace(
          /[A-Z]/g,
          (letter) => `-${letter.toLowerCase()}`,
        );
        return attrName === name || key === name;
      });

      if (stateKey && this.signals.has(stateKey)) {
        const newVal = this.getAttributeValue(
          stateKey,
          this.signals.get(stateKey).get(),
        );
        this.signals.get(stateKey).set(newVal);
      }
    }

    setupReactiveRender() {
      // Create a reactive effect that re-renders when any state changes
      const renderEffect = useEffect(() => {
        this.performRender();
      }, []);

      this.effects.push(renderEffect);
    }

    performRender() {
      try {
        const vdom = render(this.renderContext);
        const target = this.shadowRoot || this;

        // Use mono-jsx native rendering
        import("mono-jsx").then(({ render: monoRender }) => {
          // Clear and re-render (mono-jsx handles efficient updates)
          target.innerHTML = "";
          if (typeof vdom === "string") {
            target.innerHTML = vdom;
          } else {
            const element = monoRender(vdom);
            if (element) {
              target.appendChild(element);
            }
          }
        });
      } catch (error) {
        console.error(`Error rendering ${tag}:`, error);
      }
    }

    connectedCallback() {
      // Initial render
      this.performRender();
    }

    disconnectedCallback() {
      // Cleanup all effects
      this.effects.forEach((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
      this.effects = [];
    }
  }

  // Register the custom element
  if (!customElements.get(tag)) {
    customElements.define(tag, FeexComponent);
  }

  return tag;
}

/**
 * Legacy alias for backward compatibility
 */
export const defineComponent = component;
