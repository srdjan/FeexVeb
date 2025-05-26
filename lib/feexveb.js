// lib/feexveb.js: Main library file, re-exporting from refactored modules.

/**
 * @file FeexVeb - Fully Functional WebJSX Library with HTMX Integration.
 * This is the main entry point for the FeexVeb library, which provides a comprehensive
 * suite of tools for building reactive web components, managing state, handling events,
 * and integrating with HTMX.
 */

import * as webjsx from './src/webjsx.js';
import * as state from './src/state.js';
import { defineComponent } from './src/component.js';
import { createEventBus } from './src/eventbus.js';
import * as utils from './src/utils.js';
import * as htmxIntegration from './src/htmx_integration.js';
import * as monospaceStyling from './src/monospace-styles.js';

/**
 * @namespace FeexVeb
 * @description The main namespace for the FeexVeb library. It aggregates various modules
 * for building modern web applications, including WebJSX for templating, state management hooks,
 * a component model, event bus, utilities, and HTMX integration.
 */
const FeexVeb = {
  /**
   * @memberof FeexVeb
   * @function createElement
   * @description Creates a virtual DOM element. Re-exported from `webjsx` module.
   * @param {string|Function} type - The type of the element (e.g., 'div', 'span', or a component function).
   * @param {Object} props - The properties of the element.
   * @param {...any} children - The children of the element.
   * @returns {Object} A virtual DOM node.
   * @see {@link module:webjsx.createElement}
   */
  createElement: webjsx.createElement,

  /**
   * @memberof FeexVeb
   * @constant Fragment
   * @description Represents a fragment in the virtual DOM. Re-exported from `webjsx` module.
   * Useful for returning multiple elements from a component's render function without a wrapper.
   * @type {Symbol}
   * @see {@link module:webjsx.Fragment}
   */
  Fragment: webjsx.Fragment,

  /**
   * @memberof FeexVeb
   * @function createDomNode
   * @description Creates a real DOM node from a virtual DOM node. Re-exported from `webjsx` module.
   * @param {Object} vnode - The virtual DOM node.
   * @returns {Node} The created DOM node.
   * @see {@link module:webjsx.createDomNode}
   */
  createDomNode: webjsx.createDomNode,

  /**
   * @memberof FeexVeb
   * @function applyDiff
   * @description Applies differences from a virtual DOM to a real DOM element. Re-exported from `webjsx` module.
   * @param {HTMLElement} element - The target DOM element to update.
   * @param {Object} vdom - The new virtual DOM structure.
   * @see {@link module:webjsx.applyDiff}
   */
  applyDiff: webjsx.applyDiff,

  /**
   * @memberof FeexVeb
   * @function useState
   * @description Creates a reactive state variable. Re-exported from `state` module.
   * @param {*} initialValue - The initial value of the state.
   * @returns {import('./src/state.js').StateObject} A state object with `get`, `set`, and `subscribe` methods.
   * @see {@link module:state.useState}
   */
  useState: state.useState,

  /**
   * @memberof FeexVeb
   * @function useComputed
   * @description Creates a derived state that automatically updates when its dependencies change. Re-exported from `state` module.
   * @param {Function} computeFn - A function that computes the value of the derived state.
   * @param {Array<import('./src/state.js').StateObject>} dependencies - An array of state objects that this computed state depends on.
   * @returns {import('./src/state.js').StateObject} A state object with a `get` method.
   * @see {@link module:state.useComputed}
   */
  useComputed: state.useComputed,

  /**
   * @memberof FeexVeb
   * @function useEffect
   * @description Registers a side effect function that runs when its dependencies change. Re-exported from `state` module.
   * @param {Function} effectFn - The function to run as a side effect. It can optionally return a cleanup function.
   * @param {Array<import('./src/state.js').StateObject>} dependencies - An array of state objects to watch for changes.
   * @returns {Function} A cleanup function that can be called to remove the effect and its subscriptions.
   * @see {@link module:state.useEffect}
   */
  useEffect: state.useEffect,

  /**
   * @memberof FeexVeb
   * @function component
   * @description Defines and registers a new custom element (Web Component). Re-exported from `component` module.
   * @param {import('./src/component.js').ComponentOptions} options - Configuration options for the component.
   * @returns {string} The tag name of the registered custom element.
   * @see {@link module:component.defineComponent}
   */
  component: defineComponent,

  /**
   * @memberof FeexVeb
   * @function createEventBus
   * @description Creates a global event bus for cross-component communication. Re-exported from `eventbus` module.
   * @returns {import('./src/eventbus.js').EventBus} An event bus object with `dispatch` and `subscribe` methods.
   * @see {@link module:eventbus.createEventBus}
   */
  createEventBus: createEventBus,

  /**
   * @memberof FeexVeb
   * @function attr
   * @description Helper to get an attribute value from an HTML element. Re-exported from `utils` module.
   * @param {HTMLElement} element - The HTML element.
   * @param {string} name - The attribute name.
   * @param {*} [defaultValue=''] - The default value if the attribute is not found.
   * @returns {string} The attribute value or default.
   * @see {@link module:utils.attr}
   */
  attr: utils.attr,

  /**
   * @memberof FeexVeb
   * @function numAttr
   * @description Helper to get a numeric attribute value from an HTML element. Re-exported from `utils` module.
   * @param {HTMLElement} element - The HTML element.
   * @param {string} name - The attribute name.
   * @param {number} [defaultValue=0] - The default value if the attribute is not found or is not a number.
   * @returns {number} The numeric attribute value or default.
   * @see {@link module:utils.numAttr}
   */
  numAttr: utils.numAttr,

  /**
   * @memberof FeexVeb
   * @namespace htmx
   * @description Provides HTMX integration functionalities.
   */
  htmx: {
    /**
     * @memberof FeexVeb.htmx
     * @function init
     * @description Initializes HTMX, loading it if not already present. Re-exported from `htmxIntegration` module.
     * @param {import('./src/htmx_integration.js').HtmxInitOptions} [options={}] - HTMX initialization options.
     * @returns {Promise<Object>} A promise that resolves with the global `htmx` object when ready.
     * @see {@link module:htmxIntegration.initHtmx}
     */
    init: htmxIntegration.initHtmx,

    /**
     * @memberof FeexVeb.htmx
     * @function configure
     * @description Configures HTMX with specified settings. Re-exported from `htmxIntegration` module.
     * @param {Object} [options={}] - HTMX configuration options.
     * @see {@link module:htmxIntegration.configureHtmx}
     */
    configure: htmxIntegration.configureHtmx,

    /**
     * @memberof FeexVeb.htmx
     * @function process
     * @description Processes HTMX attributes on a given DOM element. Re-exported from `htmxIntegration` module.
     * @param {HTMLElement} element - The element to process for HTMX attributes.
     * @see {@link module:htmxIntegration.processHtmx}
     */
    process: htmxIntegration.processHtmx,

    /**
     * @memberof FeexVeb.htmx
     * @function attrs
     * @description Creates an HTMX attribute object suitable for JSX. Re-exported from `htmxIntegration` module.
     * @param {Object} [attrs={}] - An object where keys are HTMX attributes (can be camelCase).
     * @returns {Object} An object with dash-cased HTMX attributes.
     * @see {@link module:htmxIntegration.htmxAttrs}
     */
    attrs: htmxIntegration.htmxAttrs,

    /**
     * @memberof FeexVeb.htmx
     * @function trigger
     * @description Triggers an HTMX event on an element. Re-exported from `htmxIntegration` module.
     * @param {HTMLElement} element - The element to trigger the event on.
     * @param {string} eventName - The name of the event.
     * @param {Object} [detail={}] - Event detail object.
     * @see {@link module:htmxIntegration.triggerHtmx}
     */
    trigger: htmxIntegration.triggerHtmx,
  },

  /**
   * @memberof FeexVeb
   * @namespace styling
   * @description Provides styling utilities and monospace design system.
   */
  styling: {
    /**
     * @memberof FeexVeb.styling
     * @constant monospaceCss
     * @description The monospace CSS as a string for shadow DOM. Re-exported from `monospaceStyling` module.
     * @type {string}
     * @see {@link module:monospaceStyling.monospaceCss}
     */
    monospaceCss: monospaceStyling.monospaceCss,

    /**
     * @memberof FeexVeb.styling
     * @constant monospaceCssForHtml
     * @description The monospace CSS adapted for regular HTML (not shadow DOM). Re-exported from `monospaceStyling` module.
     * @type {string}
     * @see {@link module:monospaceStyling.monospaceCssForHtml}
     */
    monospaceCssForHtml: monospaceStyling.monospaceCssForHtml,

    /**
     * @memberof FeexVeb.styling
     * @function createMonospaceStyleElement
     * @description Creates a style element with monospace CSS. Re-exported from `monospaceStyling` module.
     * @returns {HTMLStyleElement} A style element containing monospace CSS
     * @see {@link module:monospaceStyling.createMonospaceStyleElement}
     */
    createMonospaceStyleElement: monospaceStyling.createMonospaceStyleElement,

    /**
     * @memberof FeexVeb.styling
     * @function injectMonospaceStyles
     * @description Injects monospace styles into a shadow root or element. Re-exported from `monospaceStyling` module.
     * @param {ShadowRoot|HTMLElement} target - The target to inject styles into
     * @see {@link module:monospaceStyling.injectMonospaceStyles}
     */
    injectMonospaceStyles: monospaceStyling.injectMonospaceStyles,
  },

  /**
   * @memberof FeexVeb
   * @function render
   * @description Renders a virtual DOM into a container element and processes HTMX attributes.
   * It uses `webjsx.applyDiff` for rendering and `htmxIntegration.processHtmx` for HTMX processing.
   * @param {HTMLElement} container - The container element to render into.
   * @param {Object} vdom - The virtual DOM to render.
   */
  render: (container, vdom) => {
    webjsx.applyDiff(container, vdom);
    if (globalThis.htmx) {
      htmxIntegration.processHtmx(container);
    }
  }
};

export default FeexVeb;
