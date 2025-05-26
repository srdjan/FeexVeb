// lib/src/component.js: This module contains the unified component factory.

/**
 * @module component
 * @description This module provides the `defineComponent` function for creating and registering
 * custom elements (Web Components) with reactive state, methods, and HTMX integration.
 */

import { applyDiff } from './webjsx.js';
import { processHtmx } from './htmx_integration.js';

/**
 * Converts a dash-cased string to camelCase.
 * e.g., 'initial-count' -> 'initialCount'
 * @param {string} str The dash-cased string.
 * @returns {string} The camelCased string.
 */
const dashToCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * @typedef {Object} ComponentContext
 * @property {HTMLElement} element - The custom element instance itself.
 * @property {ShadowRoot|null} shadow - The shadow root, if `shadowMode` is enabled. Null otherwise.
 * @property {Object<string, import('./state.js').StateObject>} states - An object to store reactive states returned by the `setup` function.
 * @property {Object<string, Function>} methods - An object to store methods returned by the `setup` function.
 * @property {Array<Function>} cleanup - An array to store cleanup functions (e.g., from `useEffect` or state subscriptions).
 * @property {Object<string, {get: Function, set: Function}>} [any] - Direct access to state getters/setters can be added to the context.
 * @property {Object<string, Function>} [any] - Direct access to methods can be added to the context.
 */

/**
 * @typedef {Object} SetupResult
 * @property {Object<string, import('./state.js').StateObject>} [state] - Key-value pairs of reactive states.
 * @property {Object<string, Function>} [methods] - Key-value pairs of methods. These methods will receive `ComponentContext` as their first argument.
 * @property {Array<Function>} [effects] - An array of cleanup functions returned by `useEffect` calls.
 */

/**
 * @typedef {Object} ComponentOptions
 * @property {string} tag - Required. The HTML tag name for the custom element (e.g., 'my-counter'). Must include a hyphen.
 * @property {function(ComponentContext): SetupResult} setup - Required. A function that initializes the component's state, methods, and effects.
 *   It receives a `ComponentContext` object.
 * @property {function(ComponentContext): Object} render - Required. A function that returns the virtual DOM (JSX-like structure) for the component.
 *   It receives the `ComponentContext` object.
 * @property {Object<string, 'string'|'number'|'boolean'>} [attributesSchema] - Optional. An object defining attributes to observe and their types.
 *   Keys are HTML attribute names (e.g., 'initial-count'), and values are types ('string', 'number', 'boolean').
 *   These attributes will be automatically synced with corresponding camelCased state properties.
 * @property {Array<string>} [attributes=[]] - Optional. An array of attribute names to observe if `attributesSchema` is not provided.
 *   Changes to these attributes will trigger `attributeChangedCallback` and a re-render.
 * @property {'open'|'closed'|null} [shadowMode=null] - Optional. If set to 'open' or 'closed', a shadow DOM will be attached to the component.
 *   If `null`, the component renders in the light DOM.
 * @property {boolean} [processHtmxInShadow=true] - Optional. If `shadowMode` is enabled, this controls whether `htmx.process()`
 *   is called on the `shadowRoot` after rendering. Defaults to `true`. If `false`, HTMX processing is skipped for the shadow content.
 */

/**
 * Defines and registers a new custom element (Web Component) with the browser.
 * This function encapsulates the logic for creating components with reactive state,
 * methods, lifecycle callbacks, optional shadow DOM, and HTMX integration.
 * 
 * @param {ComponentOptions} options - Configuration options for the component.
 * @returns {string} The tag name of the registered custom element.
 * @throws {Error} If `tag`, `setup`, or `render` functions are not provided in options.
 */
export const defineComponent = (options) => {
  const {
    tag,
    setup,
    render: renderFn, // Renamed to avoid conflict with class method
    attributesSchema, // New option
    attributes = [], // Fallback if attributesSchema is not provided
    shadowMode = null,
    processHtmxInShadow: processHtmxInShadowOption // Renamed for clarity
  } = options;

  if (!tag || !setup || !renderFn) {
    throw new Error('Component requires tag, setup, and render functions');
  }

  // Skip if already registered
  if (customElements.get(tag)) {
    console.warn(`Custom element ${tag} is already defined. Skipping registration.`);
    return tag;
  }

  const processHtmxInShadow = shadowMode !== null && processHtmxInShadowOption !== false;

  customElements.define(tag, class extends HTMLElement {
    /**
     * @private
     * The component's context object, containing its element, shadow root (if any),
     * states, methods, and cleanup functions.
     * @type {ComponentContext}
     */
    _ctx;

    /**
     * @private
     * The main render function for the component. It calls the user-provided `renderFn`,
     * applies the resulting VDOM to the DOM, and processes HTMX attributes.
     */
    render;

    constructor() {
      super();

      /** @type {ComponentContext} */
      const ctx = {
        element: this,
        shadow: null,
        states: {},
        methods: {},
        cleanup: []
      };

      if (shadowMode) {
        this.attachShadow({ mode: shadowMode });
        ctx.shadow = this.shadowRoot;
      }

      const setupResult = setup(ctx);

      // Process and store states from setup
      if (setupResult && setupResult.state) {
        Object.entries(setupResult.state).forEach(([key, stateObj]) => {
          ctx.states[key] = stateObj;
          // Make states directly accessible on ctx as { get, set }
          if (stateObj && typeof stateObj.get === 'function' && typeof stateObj.set === 'function') {
            ctx[key] = { get: stateObj.get, set: stateObj.set };
          }
          // Subscribe to state changes for automatic re-rendering
          const unsubscribe = stateObj.subscribe(() => this.render());
          ctx.cleanup.push(unsubscribe);
        });
      }

      // Initialize states from attributes based on schema
      if (attributesSchema) {
        Object.entries(attributesSchema).forEach(([attrName, attrType]) => {
          if (this.hasAttribute(attrName)) {
            const value = this.getAttribute(attrName);
            const camelCaseName = dashToCamelCase(attrName);

            if (ctx.states[camelCaseName] && typeof ctx.states[camelCaseName].set === 'function') {
              let coercedValue;
              switch (attrType) {
                case 'string':
                  coercedValue = String(value);
                  break;
                case 'number':
                  coercedValue = Number(value);
                  break;
                case 'boolean':
                  coercedValue = value !== null && value !== 'false';
                  break;
                default:
                  coercedValue = value; // Or handle error/warning
              }
              ctx.states[camelCaseName].set(coercedValue);
            }
          }
        });
      }

      // Process and store methods from setup
      if (setupResult && setupResult.methods) {
        Object.entries(setupResult.methods).forEach(([key, methodFn]) => {
          // Bind method to component context
          const method = (...args) => methodFn(ctx, ...args);
          ctx.methods[key] = method;
          // Make methods directly accessible on ctx
          ctx[key] = method;
        });
      }

      // Store cleanup functions from effects
      if (setupResult && setupResult.effects) {
        setupResult.effects.forEach(effectCleanupFn => {
          if (typeof effectCleanupFn === 'function') {
            ctx.cleanup.push(effectCleanupFn);
          } else if (effectCleanupFn && typeof effectCleanupFn.unsubscribe === 'function') { 
             // Handle cases where an effect might return an object with an unsubscribe method
             ctx.cleanup.push(() => effectCleanupFn.unsubscribe());
          }
        });
      }

      this._ctx = ctx;

      this.render = () => {
        const vdom = renderFn(this._ctx);
        const target = this._ctx.shadow || this; // Render to shadow DOM if available, else light DOM
        applyDiff(target, vdom);

        // Process HTMX attributes after rendering
        if (globalThis.htmx && globalThis.htmx.process) {
          if (this._ctx.shadow && processHtmxInShadow) {
            processHtmx(this._ctx.shadow);
          } else if (!this._ctx.shadow) { // Only process light DOM if no shadow DOM, or if shadow processing is explicitly on main element
            processHtmx(this);
          }
        }
      };
    }

    /**
     * Standard custom element lifecycle callback.
     * @returns {Array<string>} The array of observed attribute names.
     */
    static get observedAttributes() {
      if (attributesSchema && Object.keys(attributesSchema).length > 0) {
        return Object.keys(attributesSchema);
      }
      return attributes; // Fallback to manually listed attributes
    }

    /**
     * Standard custom element lifecycle callback, called when the element is connected to the DOM.
     * Triggers the initial render.
     */
    connectedCallback() {
      this.render();
    }

    /**
     * Standard custom element lifecycle callback, called when an observed attribute changes.
     * Handles special 'data-number-' prefixed attributes by attempting to convert them to numbers
     * and set them on the corresponding state property if it exists and has a `set` method.
     * Triggers a re-render.
     * @param {string} name - The name of the attribute that changed.
     * @param {string|null} oldValue - The old value of the attribute.
     * @param {string|null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;

      if (attributesSchema && attributesSchema[name]) {
        const attrType = attributesSchema[name];
        const camelCaseName = dashToCamelCase(name);

        if (this._ctx && this._ctx.states[camelCaseName] && typeof this._ctx.states[camelCaseName].set === 'function') {
          let coercedValue;
          switch (attrType) {
            case 'string':
              coercedValue = String(newValue);
              break;
            case 'number':
              coercedValue = Number(newValue);
              break;
            case 'boolean':
              coercedValue = newValue !== null && newValue !== 'false';
              break;
            default:
              coercedValue = newValue; // Or handle error/warning
          }
          this._ctx.states[camelCaseName].set(coercedValue);
        }
      }
      // The render() call will be triggered by the state's subscribe mechanism if the state was updated.
      // If an attribute changes that is observed but not tied to a state via attributesSchema,
      // and a re-render is desired, render() might need to be called explicitly here.
      // However, the current design implies attributes in attributesSchema manage state, which triggers render.
      // For attributes listed in `attributes` array but not in schema, we might need explicit render.
      // For now, relying on state subscription. If direct render is needed for non-schema attributes:
      // else if (attributes.includes(name)) {
      // this.render();
      // }
      // The problem statement implies removing data-number-* and relying on schema.
      // The state change should trigger render.
    }

    /**
     * Standard custom element lifecycle callback, called when the element is disconnected from the DOM.
     * Runs all cleanup functions (e.g., unsubscribing from states, cleaning up effects).
     */
    disconnectedCallback() {
      if (this._ctx && this._ctx.cleanup) {
        this._ctx.cleanup.forEach(fn => {
          if (typeof fn === 'function') {
            fn();
          }
        });
        this._ctx.cleanup = []; // Clear cleanup array
      }
    }
  });

  return tag;
};
