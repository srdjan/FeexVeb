/**
 * @file Simplified HTMX Integration - Essential helpers without over-abstraction
 * Focuses on native HTMX usage patterns with minimal wrapper code
 */

/**
 * Initialize HTMX with minimal configuration
 * @param {Object} config - HTMX configuration options
 * @returns {Promise<Object>} Promise resolving to htmx object when ready
 */
export async function initHtmx(config = {}) {
  // Check if HTMX is already loaded
  if (globalThis.htmx) {
    if (Object.keys(config).length > 0) {
      globalThis.htmx.config = { ...globalThis.htmx.config, ...config };
    }
    return globalThis.htmx;
  }

  // Load HTMX from CDN if not available
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/htmx.org@1.9.10";
    script.onload = () => {
      if (Object.keys(config).length > 0) {
        globalThis.htmx.config = { ...globalThis.htmx.config, ...config };
      }
      resolve(globalThis.htmx);
    };
    script.onerror = () => reject(new Error("Failed to load HTMX"));
    document.head.appendChild(script);
  });
}

/**
 * Process HTMX attributes on elements (wrapper for htmx.process)
 * @param {HTMLElement} element - Element to process
 */
export function processHtmx(element) {
  if (globalThis.htmx) {
    globalThis.htmx.process(element);
  }
}

/**
 * Trigger HTMX request on element
 * @param {HTMLElement} element - Target element
 * @param {string} eventName - Event name to trigger
 * @param {Object} detail - Optional event details
 */
export function triggerHtmx(element, eventName, detail = {}) {
  if (globalThis.htmx) {
    globalThis.htmx.trigger(element, eventName, detail);
  }
}

/**
 * Convert camelCase attributes to dash-case for HTMX
 * @param {Object} attrs - Attribute object
 * @returns {Object} Converted attribute object
 */
export function htmxAttrs(attrs = {}) {
  const normalized = {};

  Object.entries(attrs).forEach(([key, value]) => {
    // Convert camelCase to dash-case for HTMX attributes
    const normalizedKey = key.startsWith("hx")
      ? key.replace(/([A-Z])/g, "-$1").toLowerCase()
      : key;

    normalized[normalizedKey] = value;
  });

  return normalized;
}

/**
 * Configure HTMX with provided options
 * @param {Object} options - HTMX configuration options
 */
export function configureHtmx(options = {}) {
  if (globalThis.htmx) {
    Object.assign(globalThis.htmx.config, options);
  }
}

/**
 * Create common HTMX attribute sets for frequent patterns
 */
export const htmxPatterns = {
  /**
   * Get request that updates target element
   * @param {string} url - Request URL
   * @param {string} target - Target selector
   * @param {string} trigger - Trigger event (default: 'click')
   */
  get: (url, target, trigger = "click") => ({
    "hx-get": url,
    "hx-target": target,
    "hx-trigger": trigger,
  }),

  /**
   * Post request that updates target element
   * @param {string} url - Request URL
   * @param {string} target - Target selector
   * @param {string} trigger - Trigger event (default: 'click')
   */
  post: (url, target, trigger = "click") => ({
    "hx-post": url,
    "hx-target": target,
    "hx-trigger": trigger,
  }),

  /**
   * Form submission with validation
   * @param {string} url - Submit URL
   * @param {string} target - Target selector for response
   */
  form: (url, target) => ({
    "hx-post": url,
    "hx-target": target,
    "hx-indicator": ".loading",
    "hx-validate": "true",
  }),

  /**
   * Auto-updating element (polling)
   * @param {string} url - Polling URL
   * @param {string} interval - Polling interval (e.g., '2s', '5s')
   */
  poll: (url, interval = "2s") => ({
    "hx-get": url,
    "hx-trigger": `every ${interval}`,
    "hx-target": "this",
    "hx-swap": "innerHTML",
  }),

  /**
   * Infinite scroll pattern
   * @param {string} url - Next page URL
   * @param {string} target - Container selector
   */
  infiniteScroll: (url, target) => ({
    "hx-get": url,
    "hx-trigger": "revealed",
    "hx-target": target,
    "hx-swap": "beforeend",
  }),
};

/**
 * Add HTMX event listeners with automatic cleanup
 * @param {HTMLElement} element - Element to add listener to
 * @param {string} eventType - HTMX event type (e.g., 'htmx:afterRequest')
 * @param {Function} handler - Event handler function
 * @returns {Function} Cleanup function
 */
export function addHtmxListener(element, eventType, handler) {
  element.addEventListener(eventType, handler);

  // Return cleanup function
  return () => element.removeEventListener(eventType, handler);
}

/**
 * Common HTMX event types for easy reference
 */
export const htmxEvents = {
  BEFORE_REQUEST: "htmx:beforeRequest",
  AFTER_REQUEST: "htmx:afterRequest",
  BEFORE_SWAP: "htmx:beforeSwap",
  AFTER_SWAP: "htmx:afterSwap",
  RESPONSE_ERROR: "htmx:responseError",
  SEND_ERROR: "htmx:sendError",
  TARGET_ERROR: "htmx:targetError",
  CONFIG_REQUEST: "htmx:configRequest",
};
