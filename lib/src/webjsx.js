/**
 * @file Native JSX Integration - Direct mono-jsx usage without custom wrappers
 * Eliminates custom VNode handling and leverages mono-jsx capabilities directly
 */

// JSX functions from jsx-runtime
export { Fragment, jsx as createElement, jsxs } from "mono-jsx/jsx-runtime";

// Render functions - need to find the correct import or implement
export function render(vdom) {
  // Simple DOM element creation for mono-jsx compatibility
  if (typeof vdom === "string") return document.createTextNode(vdom);
  if (typeof vdom === "number") return document.createTextNode(String(vdom));
  if (!vdom) return document.createTextNode("");

  const { type, props } = vdom;
  if (typeof type === "string") {
    const element = document.createElement(type);
    const { children, ...attrs } = props || {};

    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
      if (key.startsWith("on") && typeof value === "function") {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    // Append children
    if (children) {
      const childElements = Array.isArray(children) ? children : [children];
      childElements.forEach((child) => {
        const childElement = render(child);
        if (childElement) element.appendChild(childElement);
      });
    }

    return element;
  }

  return document.createTextNode("");
}

export function hydrate(vdom, container) {
  // Simple hydration - just render and replace
  const element = render(vdom);
  container.innerHTML = "";
  if (element) container.appendChild(element);
}

// Server-side rendering support using mono-jsx
// mono-jsx renders JSX directly to Response objects
export function renderToString(jsx) {
  // For mono-jsx, JSX elements are rendered as HTML strings directly
  // This is mainly for compatibility with existing FeexVeb patterns
  if (jsx && typeof jsx.toString === "function") {
    return jsx.toString();
  }
  return String(jsx);
}

/**
 * Enhanced render function that handles HTMX processing
 * @param {*} vdom - Virtual DOM element
 * @param {HTMLElement} container - Target container
 */
export function renderWithHtmx(vdom, container) {
  const element = render(vdom);

  if (element) {
    container.appendChild(element);

    // Process HTMX attributes if HTMX is available
    if (globalThis.htmx) {
      globalThis.htmx.process(container);
    }
  }

  return element;
}

/**
 * Utility for creating HTMX-compatible attribute objects
 * @param {Object} attrs - Attribute object (supports camelCase)
 * @returns {Object} Dash-cased attributes for HTML
 */
export function htmxAttrs(attrs = {}) {
  const result = {};

  Object.entries(attrs).forEach(([key, value]) => {
    // Convert camelCase to dash-case for HTMX attributes
    const dashKey = key.startsWith("hx")
      ? key.replace(/([A-Z])/g, "-$1").toLowerCase()
      : key;

    result[dashKey] = value;
  });

  return result;
}

/**
 * Legacy compatibility function for existing code
 * @param {HTMLElement} container - Container element
 * @param {*} vdom - Virtual DOM
 */
export function applyDiff(container, vdom) {
  // Clear container and render new content
  container.innerHTML = "";
  const element = render(vdom);
  if (element) {
    container.appendChild(element);
  }
}

/**
 * Legacy compatibility function
 * @param {*} vnode - Virtual node
 * @returns {HTMLElement} DOM element
 */
export function createDomNode(vnode) {
  return render(vnode);
}
