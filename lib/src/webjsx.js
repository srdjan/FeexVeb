/**
 * @module webjsx
 * @description This module provides JSX functionality using mono-jsx
 * for server-side rendering and client-side hydration.
 */

import { jsx, jsxs, Fragment } from 'mono-jsx/jsx-runtime';

/**
 * @typedef {Object} VNode
 * @property {string|Function|Symbol} type - The type of the virtual node (e.g., 'div', a component function, or Fragment).
 * @property {Object} props - The properties (attributes and event listeners) of the node.
 * @property {Array<VNode|string>} children - The children of the node.
 */

/**
 * JSX factory function that creates virtual DOM nodes using mono-jsx.
 * This function is used by the JSX transpiler to create elements.
 *
 * @param {string|Function|Symbol} type - The type of the element (e.g., 'div', a component function, or `Fragment`).
 * @param {Object} [props={}] - The properties/attributes of the element.
 * @param {...(VNode|string)} children - The children of the element.
 * @returns {VNode} A virtual DOM node object.
 */
export const createElement = (type, props, ...children) => {
  // Flatten children and filter out null/undefined
  const flatChildren = children.flat().filter(child => child !== null && child !== undefined);

  // Use mono-jsx's jsx function for single child or jsxs for multiple children
  if (flatChildren.length === 0) {
    return jsx(type, props || {});
  } else if (flatChildren.length === 1) {
    return jsx(type, { ...(props || {}), children: flatChildren[0] });
  } else {
    return jsxs(type, { ...(props || {}), children: flatChildren });
  }
};

/**
 * Fragment component for grouping multiple elements without adding an extra DOM node.
 * Uses mono-jsx's Fragment implementation.
 *
 * @type {Symbol}
 */
export { Fragment };

/**
 * Creates a real DOM node from a mono-jsx virtual DOM node.
 * This function handles the conversion from mono-jsx's VNode structure to actual DOM elements.
 *
 * @param {VNode|string|number} vnode - The virtual DOM node or a primitive value to convert to a DOM node.
 * @returns {HTMLElement|Text|DocumentFragment} The created DOM Node.
 */
export const createDomNode = (vnode) => {
  // For now, return a simple implementation
  // In a full mono-jsx integration, this would use mono-jsx's client-side rendering
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  if (!vnode || typeof vnode !== 'object') {
    return document.createComment('Empty VNode');
  }

  // Handle mono-jsx VNode structure [tag, props, symbol]
  if (Array.isArray(vnode) && vnode.length === 3) {
    const [tag, props] = vnode;

    if (tag === Fragment) {
      const fragment = document.createDocumentFragment();
      if (props && props.children) {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach(child => {
          fragment.appendChild(createDomNode(child));
        });
      }
      return fragment;
    }

    if (typeof tag === 'string') {
      const element = document.createElement(tag);

      if (props) {
        for (const [key, value] of Object.entries(props)) {
          if (key === 'children') continue;

          if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.substring(2).toLowerCase();
            element.addEventListener(eventName, value);
          } else if (key === 'className') {
            element.className = value;
          } else if (key === 'htmlFor') {
            element.setAttribute('for', value);
          } else if (typeof value === 'boolean') {
            if (value) {
              element.setAttribute(key, '');
            }
          } else if (value !== null && value !== undefined) {
            element.setAttribute(key, String(value));
          }
        }

        if (props.children) {
          const children = Array.isArray(props.children) ? props.children : [props.children];
          children.forEach(child => {
            element.appendChild(createDomNode(child));
          });
        }
      }

      return element;
    }
  }

  return document.createComment('Unknown VNode');
};

/**
 * Applies a virtual DOM to a container element using mono-jsx.
 * This function performs a simple replace operation for now, but could be enhanced
 * with more sophisticated diffing in the future.
 *
 * @param {HTMLElement} element - The container DOM element to update.
 * @param {VNode} vdom - The new virtual DOM structure to render.
 */
export const applyDiff = (element, vdom) => {
  if (!element) {
    console.error("applyDiff requires a valid DOM element.");
    return;
  }

  // Simple implementation: clear and re-render
  // In a production environment, this could be enhanced with proper diffing
  element.innerHTML = '';

  if (vdom) {
    const newNode = createDomNode(vdom);
    if (newNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      element.appendChild(newNode);
    } else {
      element.appendChild(newNode);
    }
  }
};

/**
 * Server-side rendering function that converts a VNode to HTML string.
 * This uses mono-jsx's VNode structure for server-side rendering.
 *
 * @param {VNode} vnode - The virtual DOM node to render to HTML.
 * @returns {string} The HTML string representation.
 */
export const renderToString = (vnode) => {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return escapeHtml(String(vnode));
  }

  if (!vnode || typeof vnode !== 'object') {
    return '';
  }

  // Handle mono-jsx VNode structure [tag, props, symbol]
  if (Array.isArray(vnode) && vnode.length === 3) {
    const [tag, props] = vnode;

    if (tag === Fragment) {
      if (props && props.children) {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        return children.map(child => renderToString(child)).join('');
      }
      return '';
    }

    if (typeof tag === 'string') {
      let html = `<${tag}`;

      if (props) {
        for (const [key, value] of Object.entries(props)) {
          if (key === 'children') continue;

          if (key === 'className') {
            html += ` class="${escapeHtml(value)}"`;
          } else if (key === 'htmlFor') {
            html += ` for="${escapeHtml(value)}"`;
          } else if (typeof value === 'boolean') {
            if (value) {
              html += ` ${key}`;
            }
          } else if (value !== null && value !== undefined && !key.startsWith('on')) {
            html += ` ${key}="${escapeHtml(String(value))}"`;
          }
        }
      }

      // Self-closing tags
      const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
      if (selfClosingTags.includes(tag)) {
        html += ' />';
        return html;
      }

      html += '>';

      if (props && props.children) {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        html += children.map(child => renderToString(child)).join('');
      }

      html += `</${tag}>`;
      return html;
    }
  }

  return '';
};

/**
 * Escapes HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return String(str).replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}
