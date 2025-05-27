/**
 * @module webjsx
 * @description This module provides placeholder implementations for the core WebJSX functionalities.
 * The actual WebJSX library (expected at `"./deps/webjsx/dist/index.js"`) is responsible for
 * JSX transformation, virtual DOM creation, and DOM diffing/patching.
 * These functions mimic the API of a typical JSX library.
 */

/**
 * @typedef {Object} VNode
 * @property {string|Function|Symbol} type - The type of the virtual node (e.g., 'div', a component function, or Fragment).
 * @property {Object} props - The properties (attributes and event listeners) of the node.
 * @property {Array<VNode|string>} children - The children of the node.
 */

/**
 * **Placeholder Function:** Creates a virtual DOM node, typically used as the JSX factory function.
 * The actual implementation would come from the WebJSX library. This placeholder
 * returns a basic object structure representing a VNode.
 *
 * @param {string|Function|Symbol} type - The type of the element (e.g., 'div', a component function, or `Fragment`).
 * @param {Object} [props={}] - The properties/attributes of the element.
 * @param {...(VNode|string)} children - The children of the element.
 * @returns {VNode} A virtual DOM node object.
 */
export const createElement = (type, props, ...children) => {
  return {
    type,
    props: props || {},
    children: children.flat().filter(child => child !== null && child !== undefined)
  };
};

/**
 * **Placeholder Constant:** Represents a Fragment, allowing multiple elements to be grouped
 * without adding an extra node to the DOM. The actual implementation would be a unique symbol
 * provided by the WebJSX library.
 *
 * @type {Symbol}
 */
export const Fragment = Symbol("Fragment");

/**
 * **Placeholder Function:** Creates a real DOM node from a virtual DOM node (VNode).
 * The actual implementation would come from the WebJSX library and would handle
 * various VNode types, attributes, and event listeners. This placeholder provides
 * a very basic implementation for common HTML elements and text nodes.
 *
 * @param {VNode|string|number} vnode - The virtual DOM node or a primitive value to convert to a DOM node.
 * @returns {Node} The created DOM Node (e.g., HTMLElement, TextNode, DocumentFragment).
 */
export const createDomNode = (vnode) => {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }
  if (!vnode || typeof vnode.type === 'undefined') {
    console.error("Invalid vnode structure passed to createDomNode:", vnode);
    return document.createComment("Invalid VNode");
  }

  if (vnode.type === Fragment) {
    const fragment = document.createDocumentFragment();
    (vnode.children || []).forEach(child => fragment.appendChild(createDomNode(child)));
    return fragment;
  }

  const el = document.createElement(vnode.type);

  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      if (key.startsWith('on') && typeof value === 'function') {
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
  }
  (vnode.children || []).forEach(child => el.appendChild(createDomNode(child)));
  return el;
};

/**
 * **Placeholder Function:** Applies differences between a new virtual DOM and an existing DOM element.
 * The actual implementation would come from the WebJSX library and perform an efficient
 * diffing algorithm to update only the necessary parts of the DOM. This placeholder
 * provides a very naive implementation by clearing the container and appending the new content.
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
