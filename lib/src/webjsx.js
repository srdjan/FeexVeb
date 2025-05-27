/**
 * @module webjsx
 * @description This module provides JSX functionality using Preact for server-side rendering
 * and client-side hydration. It bridges FeexVeb's component system with Preact's JSX handling.
 */

import { jsx, jsxs, Fragment as PreactFragment } from 'preact/jsx-runtime';

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
 * Uses Preact's Fragment implementation.
 *
 * @type {Symbol}
 */
export const Fragment = PreactFragment;

/**
 * Creates a real DOM node from a mono-jsx virtual DOM node.
 * This function handles the conversion from mono-jsx's VNode structure to actual DOM elements.
 *
 * @param {VNode|string|number} vnode - The virtual DOM node or a primitive value to convert to a DOM node.
 * @returns {HTMLElement|Text|DocumentFragment} The created DOM Node.
 */
export const createDomNode = (vnode) => {
  // Handle primitive values (strings, numbers)
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  // Handle null/undefined
  if (!vnode) {
    return document.createComment("Empty VNode");
  }

  // Handle mono-jsx VNode structure
  if (typeof vnode === 'object' && vnode.type) {
    // Handle Fragment
    if (vnode.type === Fragment) {
      const fragment = document.createDocumentFragment();
      const children = Array.isArray(vnode.props?.children) ? vnode.props.children : [vnode.props?.children];
      children.filter(child => child != null).forEach(child => {
        fragment.appendChild(createDomNode(child));
      });
      return fragment;
    }

    // Handle regular elements
    if (typeof vnode.type === 'string') {
      const el = document.createElement(vnode.type);

      // Set attributes and event listeners
      if (vnode.props) {
        for (const [key, value] of Object.entries(vnode.props)) {
          if (key === 'children') {
            // Handle children separately
            continue;
          } else if (key.startsWith('on') && typeof value === 'function') {
            // Event listeners
            el.addEventListener(key.substring(2).toLowerCase(), value);
          } else if (key === 'className') {
            el.setAttribute('class', String(value));
          } else if (key === 'class') {
            el.setAttribute('class', String(value));
          } else if (typeof value === 'boolean') {
            if (value === true) {
              el.setAttribute(key, '');
            }
            // Don't set false boolean attributes
          } else if (value !== null && value !== undefined) {
            el.setAttribute(key, String(value));
          }
        }

        // Handle children
        if (vnode.props.children) {
          const children = Array.isArray(vnode.props.children) ? vnode.props.children : [vnode.props.children];
          children.filter(child => child != null).forEach(child => {
            el.appendChild(createDomNode(child));
          });
        }
      }

      return el;
    }
  }

  // Fallback for unknown structures
  console.error("Unknown vnode structure:", vnode);
  return document.createComment("Unknown VNode");
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
 * This uses mono-jsx's server-side rendering capabilities.
 *
 * @param {VNode} vnode - The virtual DOM node to render to HTML.
 * @returns {string} The HTML string representation.
 */
export const renderToString = (vnode) => {
  // For now, we'll implement a basic HTML string renderer
  // In a full implementation, this would use mono-jsx's server rendering
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return String(vnode);
  }

  if (!vnode || !vnode.type) {
    return '';
  }

  if (vnode.type === Fragment) {
    const children = Array.isArray(vnode.props?.children) ? vnode.props.children : [vnode.props?.children];
    return children.filter(child => child != null).map(child => renderToString(child)).join('');
  }

  if (typeof vnode.type === 'string') {
    const tag = vnode.type;
    let html = `<${tag}`;

    // Add attributes
    if (vnode.props) {
      for (const [key, value] of Object.entries(vnode.props)) {
        if (key === 'children') continue;
        if (key === 'className') {
          html += ` class="${value}"`;
        } else if (key === 'class') {
          html += ` class="${value}"`;
        } else if (typeof value === 'boolean') {
          if (value === true) {
            html += ` ${key}`;
          }
        } else if (value !== null && value !== undefined && !key.startsWith('on')) {
          html += ` ${key}="${String(value)}"`;
        }
      }
    }

    html += '>';

    // Add children
    if (vnode.props?.children) {
      const children = Array.isArray(vnode.props.children) ? vnode.props.children : [vnode.props.children];
      html += children.filter(child => child != null).map(child => renderToString(child)).join('');
    }

    html += `</${tag}>`;
    return html;
  }

  return '';
};
