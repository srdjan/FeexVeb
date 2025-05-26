/**
 * @module htmxIntegration
 * @description This module provides functions for integrating and interacting with the HTMX library.
 * It includes utilities for initializing HTMX, configuring it, processing HTMX attributes in the DOM,
 * and creating HTMX-specific attribute objects for JSX.
 */

/**
 * @typedef {Object} HtmxInitOptions
 * @property {string} [src='https://unpkg.com/htmx.org@2.0.4'] - The URL from which to load the HTMX script.
 * @property {string} [integrity='sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+'] - The subresource integrity hash for the HTMX script.
 * @property {string} [crossOrigin='anonymous'] - The CORS policy for the script.
 * @property {Object<string, any>} [config] - Any additional HTMX configuration options (e.g., `defaultSwapStyle`, `historyCacheSize`).
 *   These will be applied to `htmx.config` after HTMX is loaded.
 */

/**
 * Initializes HTMX. If HTMX is not already loaded on the page, this function will
 * load it from a CDN (or a specified source). It also applies any provided HTMX
 * configuration options.
 *
 * @param {HtmxInitOptions} [options={}] - Options for initializing HTMX, including source URL, integrity hash, and configuration settings.
 * @returns {Promise<Object>} A promise that resolves with the global `htmx` object once HTMX is loaded and configured.
 *   Rejects if HTMX fails to load.
 */
export const initHtmx = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (globalThis.htmx) {
      configureHtmx(options.config || options); // Pass config if nested, else direct options
      resolve(globalThis.htmx);
      return;
    }

    const script = document.createElement('script');
    script.src = options.src || 'https://unpkg.com/htmx.org@2.0.4';
    script.integrity = options.integrity || 'sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+';
    script.crossOrigin = options.crossOrigin || 'anonymous';

    script.onload = () => {
      configureHtmx(options.config || options); // Pass config if nested, else direct options
      resolve(globalThis.htmx);
    };

    script.onerror = () => {
      reject(new Error('Failed to load HTMX from ' + script.src));
    };

    document.head.appendChild(script);
  });
};

/**
 * Configures global HTMX settings. This function should be called after HTMX has been loaded.
 * It merges the provided options into `htmx.config`.
 *
 * @param {Object<string, any>} [options={}] - An object containing HTMX configuration settings (e.g., `defaultSwapStyle`, `indicatorClass`).
 *   Properties `src`, `integrity`, and `crossOrigin` are ignored here as they are for `initHtmx`.
 */
export const configureHtmx = (options = {}) => {
  if (!globalThis.htmx || !globalThis.htmx.config) {
    console.warn('HTMX is not loaded or htmx.config is not available. Cannot apply configuration.');
    return;
  }

  Object.entries(options).forEach(([key, value]) => {
    if (key !== 'src' && key !== 'integrity' && key !== 'crossOrigin') {
      globalThis.htmx.config[key] = value;
    }
  });
};

/**
 * Processes an HTML element and its children for HTMX attributes, making them active.
 * This is useful when new content is added to the DOM dynamically after the initial page load.
 *
 * @param {HTMLElement} element - The HTML element to process for HTMX attributes.
 */
export const processHtmx = (element) => {
  if (globalThis.htmx && typeof globalThis.htmx.process === 'function') {
    globalThis.htmx.process(element);
  } else {
    console.warn('HTMX is not loaded or htmx.process is not available.');
  }
};

/**
 * Creates an object of HTMX attributes suitable for use in JSX or with `createElement`.
 * It converts camelCased HTMX attribute names (e.g., `hxGet`, `hxTarget`) to their
 * dash-cased equivalents (e.g., `hx-get`, `hx-target`).
 *
 * @param {Object<string, string>} [attrs={}] - An object where keys are HTMX attribute names (camelCase or dash-case)
 *   and values are their corresponding string values.
 * @returns {Object<string, string>} An object with dash-cased HTMX attributes.
 * @example
 * // returns { 'hx-get': '/data', 'hx-swap': 'outerHTML' }
 * htmxAttrs({ hxGet: '/data', hxSwap: 'outerHTML' });
 */
export const htmxAttrs = (attrs = {}) => {
  const result = {};
  Object.entries(attrs).forEach(([key, value]) => {
    if (key.startsWith('hx') && /[A-Z]/.test(key)) {
      const hxAttr = key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
      result[hxAttr] = value;
    } else {
      result[key] = value;
    }
  });
  return result;
};

/**
 * Triggers an HTMX event on a specified HTML element.
 * This can be used to initiate HTMX behaviors programmatically.
 *
 * @param {HTMLElement} element - The HTML element on which to trigger the event.
 * @param {string} eventName - The name of the HTMX event to trigger (e.g., 'htmx:load', 'htmx:configRequest').
 * @param {Object} [detail={}] - An object containing details to be passed with the event.
 */
export const triggerHtmx = (element, eventName, detail = {}) => {
  if (globalThis.htmx && typeof globalThis.htmx.trigger === 'function') {
    globalThis.htmx.trigger(element, eventName, detail);
  } else {
    console.warn('HTMX is not loaded or htmx.trigger is not available.');
  }
};
