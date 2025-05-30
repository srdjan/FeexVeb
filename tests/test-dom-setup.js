/**
 * DOM setup for tests running in Deno
 * Provides minimal DOM API for testing
 */

// Simple DOM polyfill for testing
globalThis.document = {
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    setAttribute: function(name, value) { this[name] = value; },
    getAttribute: function(name) { return this[name]; },
    hasAttribute: function(name) { return this[name] !== undefined; },
    removeAttribute: function(name) { delete this[name]; },
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {},
    appendChild: function(child) {
      this.children = this.children || [];
      this.childNodes = this.childNodes || [];
      if (child.nodeType === 1) this.children.push(child);
      this.childNodes.push(child);
      child.parentNode = this;
    },
    removeChild: function(child) {
      if (this.children) {
        const index = this.children.indexOf(child);
        if (index > -1) this.children.splice(index, 1);
      }
      if (this.childNodes) {
        const index = this.childNodes.indexOf(child);
        if (index > -1) this.childNodes.splice(index, 1);
      }
    },
    querySelector: function(selector) {
      return this.children && this.children[0];
    },
    querySelectorAll: function(selector) {
      return this.children || [];
    },
    get innerHTML() { return this._innerHTML || ""; },
    set innerHTML(value) { 
      this._innerHTML = value;
      this.children = [];
      this.childNodes = [];
    },
    get textContent() { return this._textContent || ""; },
    set textContent(value) { this._textContent = value; },
    get className() { return this._className || ""; },
    set className(value) { this._className = value; },
    get id() { return this._id || ""; },
    set id(value) { this._id = value; },
    get shadowRoot() { return this._shadowRoot; },
    attachShadow: function(options) {
      this._shadowRoot = {
        mode: options.mode,
        appendChild: function(child) {
          this.children = this.children || [];
          this.children.push(child);
        },
        innerHTML: ""
      };
      return this._shadowRoot;
    },
    nodeType: 1,
    children: [],
    childNodes: []
  }),
  
  createTextNode: (text) => ({
    textContent: text,
    nodeType: 3
  }),
  
  body: {
    appendChild: function(child) {
      this.children = this.children || [];
      this.children.push(child);
    },
    removeChild: function(child) {
      if (this.children) {
        const index = this.children.indexOf(child);
        if (index > -1) this.children.splice(index, 1);
      }
    },
    children: []
  },
  
  head: {
    appendChild: function() {}
  }
};

// Node constants
globalThis.Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};

// Event constructor
globalThis.Event = class Event {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = options.bubbles || false;
    this.cancelable = options.cancelable || false;
  }
};

globalThis.CustomEvent = class CustomEvent extends Event {
  constructor(type, options = {}) {
    super(type, options);
    this.detail = options.detail;
  }
};

// HTMLElement base class
globalThis.HTMLElement = class HTMLElement {
  constructor() {
    this.attributes = new Map();
    this.children = [];
    this.childNodes = [];
    this.signals = new Map();
    this.effects = [];
  }
  
  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
  
  getAttribute(name) {
    return this.attributes.get(name);
  }
  
  hasAttribute(name) {
    return this.attributes.has(name);
  }
  
  removeAttribute(name) {
    this.attributes.delete(name);
  }
  
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {}
  
  appendChild(child) {
    this.children.push(child);
    this.childNodes.push(child);
  }
  
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) this.children.splice(index, 1);
    const nodeIndex = this.childNodes.indexOf(child);
    if (nodeIndex > -1) this.childNodes.splice(nodeIndex, 1);
  }
  
  get innerHTML() { return this._innerHTML || ""; }
  set innerHTML(value) { 
    this._innerHTML = value;
    this.children = [];
    this.childNodes = [];
  }
  
  get textContent() { return this._textContent || ""; }
  set textContent(value) { this._textContent = value; }
  
  get shadowRoot() { return this._shadowRoot; }
  
  attachShadow(options) {
    this._shadowRoot = {
      mode: options.mode,
      appendChild: (child) => {
        this._shadowRoot.children = this._shadowRoot.children || [];
        this._shadowRoot.children.push(child);
      }
    };
    return this._shadowRoot;
  }
  
  // Lifecycle methods for testing
  connectedCallback() {}
  disconnectedCallback() {}
  attributeChangedCallback() {}
};

// CustomElements registry
globalThis.customElements = {
  registry: new Map(),
  
  define(name, constructor) {
    if (!this.registry.has(name)) {
      this.registry.set(name, constructor);
    }
  },
  
  get(name) {
    return this.registry.get(name);
  }
};

console.log("✓ DOM environment set up for testing");