/**
 * FxWeb - Fully Functional WebJSX Library with HTMX Integration
 * 
 * A lightweight library for creating functional Web Components with WebJSX
 * that integrates smoothly with HTMX for server-side driven reactivity.
 */

// Import WebJSX library (if needed)
import * as webjsx from "./deps/webjsx/dist/index.js";

/**
 * Main namespace for the library
 */
const FxWeb = {
  /**
   * Original WebJSX functions
   */
  createElement: webjsx.createElement,
  Fragment: webjsx.Fragment,
  createDomNode: webjsx.createDomNode,
  applyDiff: webjsx.applyDiff,

  /**
   * Create reactive state with automatic re-rendering
   * 
   * @param {any} initialValue - Initial state value
   * @returns {Object} State object with get/set methods
   */
  useState: (initialValue) => {
    let value = initialValue;
    const subscribers = new Set();

    return {
      // Get current value
      get: () => value,

      // Set new value and notify subscribers
      set: (newValue) => {
        if (value === newValue) return; // Skip if unchanged
        value = newValue;
        subscribers.forEach(fn => fn(value));
      },

      // Subscribe to changes
      subscribe: (callback) => {
        subscribers.add(callback);
        return () => subscribers.delete(callback); // Return unsubscribe function
      }
    };
  },

  /**
   * Create computed state based on other state dependencies
   * 
   * @param {Function} computeFn - Function to compute the derived value
   * @param {Array} dependencies - Array of state objects this depends on
   * @returns {Object} Computed state object
   */
  useComputed: (computeFn, dependencies) => {
    const state = FxWeb.useState(computeFn());

    // Subscribe to all dependencies
    dependencies.forEach(dep => {
      dep.subscribe(() => state.set(computeFn()));
    });

    return state;
  },

  /**
   * Register a side effect when dependencies change
   * 
   * @param {Function} effectFn - Function to run when dependencies change
   * @param {Array} dependencies - Array of state objects to watch
   */
  useEffect: (effectFn, dependencies) => {
    // Run effect initially and get cleanup function
    let cleanup = effectFn();

    // Subscribe to all dependencies
    dependencies.forEach(dep => {
      dep.subscribe(() => {
        // Run cleanup if it exists
        if (typeof cleanup === 'function') {
          cleanup();
        }
        // Run effect again
        cleanup = effectFn();
      });
    });

    // Return function to clean up all effects
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  },

  /**
   * Create a functional component
   * 
   * @param {Object} options - Component options
   * @returns {String} The registered custom element tag name
   */
  component: (options) => {
    const {
      tag,            // Required: HTML tag name for the component
      setup,          // Required: Setup function that returns state and methods
      render,         // Required: Render function that returns JSX
      attributes = [] // Optional: Attributes to observe
    } = options;

    if (!tag || !setup || !render) {
      throw new Error('Component requires tag, setup, and render functions');
    }

    // Skip if already registered
    if (customElements.get(tag)) {
      return tag;
    }

    // Define the custom element
    customElements.define(tag, class extends HTMLElement {
      constructor() {
        super();

        // Create component context to avoid 'this'
        const ctx = {
          element: this,
          states: {},
          methods: {},
          cleanup: []
        };

        // Setup the component
        const setupResult = setup(ctx);

        // Process state
        if (setupResult && setupResult.state) {
          Object.entries(setupResult.state).forEach(([key, state]) => {
            // Store state in context
            ctx.states[key] = state;

            // Create a getter/setter function for accessing state
            const getState = () => state.get();
            const setState = (val) => state.set(val);

            // Store getter/setter on context
            ctx[key] = {
              get: getState,
              set: setState
            };

            // Auto-render on state change
            const unsubscribe = state.subscribe(() => this.render());
            ctx.cleanup.push(unsubscribe);
          });
        }

        // Process methods
        if (setupResult && setupResult.methods) {
          Object.entries(setupResult.methods).forEach(([key, fn]) => {
            // Store method in context with bound context
            const method = (...args) => fn(ctx, ...args);
            ctx.methods[key] = method;
            ctx[key] = method;
          });
        }

        // Process effects
        if (setupResult && setupResult.effects) {
          setupResult.effects.forEach(effect => {
            ctx.cleanup.push(effect);
          });
        }

        // Store context
        this._ctx = ctx;

        // Create render method that uses the render function
        this.render = () => {
          const vdom = render(ctx);
          FxWeb.applyDiff(this, vdom);
        };
      }

      // Lifecycle callbacks
      static get observedAttributes() {
        return attributes;
      }

      connectedCallback() {
        this.render();

        // Process HTMX in the element
        if (window.htmx) {
          window.htmx.process(this);
        }
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        // Handle numeric attributes with data-number- prefix
        if (name.startsWith('data-number-')) {
          const propName = name.replace('data-number-', '');
          if (this._ctx[propName]) {
            this._ctx[propName].set(Number(newValue));
          }
        }

        this.render();
      }

      disconnectedCallback() {
        // Run all cleanup functions
        if (this._ctx && this._ctx.cleanup) {
          this._ctx.cleanup.forEach(fn => {
            if (typeof fn === 'function') {
              fn();
            }
          });
          this._ctx.cleanup = [];
        }
      }
    });

    return tag;
  },

  /**
   * Create a global event bus for cross-component communication
   * 
   * @returns {Object} Event bus with dispatch and subscribe methods
   */
  createEventBus: () => {
    return {
      // Dispatch event
      dispatch: (eventName, detail = {}) => {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
      },

      // Subscribe to event
      subscribe: (eventName, callback) => {
        document.addEventListener(eventName, callback);
        return () => document.removeEventListener(eventName, callback);
      }
    };
  },

  /**
   * Helper to get attribute value from element
   * 
   * @param {HTMLElement} element - Element to get attribute from
   * @param {String} name - Attribute name
   * @param {any} defaultValue - Default value if attribute doesn't exist
   * @returns {String} Attribute value
   */
  attr: (element, name, defaultValue = '') => {
    return element.getAttribute(name) || defaultValue;
  },

  /**
   * Helper to get numeric attribute value
   * 
   * @param {HTMLElement} element - Element to get attribute from
   * @param {String} name - Attribute name
   * @param {Number} defaultValue - Default value if attribute doesn't exist or isn't a number
   * @returns {Number} Numeric attribute value
   */
  numAttr: (element, name, defaultValue = 0) => {
    const value = element.getAttribute(name);
    return value ? Number(value) : defaultValue;
  },

  /**
   * Render a component or virtual DOM to a container
   * 
   * @param {HTMLElement} container - Container element to render into
   * @param {Object} vdom - Virtual DOM to render
   */
  render: (container, vdom) => {
    webjsx.applyDiff(container, vdom);

    // Process HTMX in the container after rendering
    if (window.htmx) {
      window.htmx.process(container);
    }
  },

  /**
   * HTMX Integration
   */
  htmx: {
    /**
     * Initialize HTMX, load it if not present
     * @param {Object} options - HTMX configuration options
     * @returns {Promise} Promise that resolves when HTMX is ready
     */
    init: (options = {}) => {
      return new Promise((resolve, reject) => {
        // If HTMX is already loaded, configure and resolve
        if (window.htmx) {
          FxWeb.htmx.configure(options);
          resolve(window.htmx);
          return;
        }

        // Load HTMX
        const script = document.createElement('script');
        script.src = options.src || 'https://unpkg.com/htmx.org@2.0.4';
        script.integrity = options.integrity || 'sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+';
        script.crossOrigin = 'anonymous';

        script.onload = () => {
          FxWeb.htmx.configure(options);
          resolve(window.htmx);
        };

        script.onerror = () => {
          reject(new Error('Failed to load HTMX'));
        };

        document.head.appendChild(script);
      });
    },

    /**
     * Configure HTMX with settings
     * @param {Object} options - HTMX configuration options
     */
    configure: (options = {}) => {
      if (!window.htmx || !window.htmx.config) {
        return;
      }

      // Apply configuration settings
      Object.entries(options).forEach(([key, value]) => {
        if (key !== 'src' && key !== 'integrity') {
          window.htmx.config[key] = value;
        }
      });
    },

    /**
     * Process all HTMX attributes in an element
     * @param {HTMLElement} element - Element to process
     */
    process: (element) => {
      if (window.htmx && window.htmx.process) {
        window.htmx.process(element);
      }
    },

    /**
     * Register an HTMX component with Shadow DOM support
     * @param {Object} options - Component options
     */
    component: (options) => {
      const {
        tag,            // Required: HTML tag name for the component
        setup,          // Required: Setup function that returns state and methods
        render,         // Required: Render function that returns JSX
        attributes = [], // Optional: Attributes to observe
        shadowMode = null // Optional: Shadow DOM mode, null means no Shadow DOM
      } = options;

      if (!tag || !setup || !render) {
        throw new Error('Component requires tag, setup, and render functions');
      }

      // Skip if already registered
      if (customElements.get(tag)) {
        return tag;
      }

      // Define the custom element with HTMX support
      customElements.define(tag, class extends HTMLElement {
        constructor() {
          super();

          // Setup Shadow DOM if requested
          if (shadowMode) {
            this.attachShadow({ mode: shadowMode });
          }

          // Create component context to avoid 'this'
          const ctx = {
            element: this,
            shadow: this.shadowRoot,
            states: {},
            methods: {},
            cleanup: []
          };

          // Setup the component
          const setupResult = setup(ctx);

          // Process state
          if (setupResult && setupResult.state) {
            Object.entries(setupResult.state).forEach(([key, state]) => {
              // Store state in context
              ctx.states[key] = state;

              // Create a getter/setter function for accessing state
              const getState = () => state.get();
              const setState = (val) => state.set(val);

              // Store getter/setter on context
              ctx[key] = {
                get: getState,
                set: setState
              };

              // Auto-render on state change
              const unsubscribe = state.subscribe(() => this.render());
              ctx.cleanup.push(unsubscribe);
            });
          }

          // Process methods
          if (setupResult && setupResult.methods) {
            Object.entries(setupResult.methods).forEach(([key, fn]) => {
              // Store method in context with bound context
              const method = (...args) => fn(ctx, ...args);
              ctx.methods[key] = method;
              ctx[key] = method;
            });
          }

          // Process effects
          if (setupResult && setupResult.effects) {
            setupResult.effects.forEach(effect => {
              ctx.cleanup.push(effect);
            });
          }

          // Store context
          this._ctx = ctx;

          // Create render method that uses the render function
          this.render = () => {
            const vdom = render(ctx);
            const target = ctx.shadow || this;
            FxWeb.applyDiff(target, vdom);

            // Process HTMX attributes
            if (window.htmx) {
              if (ctx.shadow) {
                window.htmx.process(ctx.shadow);
              } else {
                window.htmx.process(this);
              }
            }
          };
        }

        // Lifecycle callbacks
        static get observedAttributes() {
          return attributes;
        }

        connectedCallback() {
          this.render();
        }

        attributeChangedCallback(name, oldValue, newValue) {
          if (oldValue === newValue) return;

          // Handle numeric attributes with data-number- prefix
          if (name.startsWith('data-number-')) {
            const propName = name.replace('data-number-', '');
            if (this._ctx[propName]) {
              this._ctx[propName].set(Number(newValue));
            }
          }

          this.render();
        }

        disconnectedCallback() {
          // Run all cleanup functions
          if (this._ctx && this._ctx.cleanup) {
            this._ctx.cleanup.forEach(fn => {
              if (typeof fn === 'function') {
                fn();
              }
            });
            this._ctx.cleanup = [];
          }
        }
      });

      return tag;
    },

    /**
     * Create an HTMX attribute object for JSX
     * @param {Object} attrs - HTMX attributes
     * @returns {Object} Attributed object for JSX
     */
    attrs: (attrs = {}) => {
      const result = {};

      // Map regular attributes
      Object.entries(attrs).forEach(([key, value]) => {
        // Convert camelCase to dash-case for HTMX attributes
        if (key.startsWith('hx')) {
          const hxAttr = key.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`);
          result[hxAttr] = value;
        } else {
          result[key] = value;
        }
      });

      return result;
    },

    /**
     * Trigger an HTMX event on an element
     * @param {HTMLElement} element - Element to trigger event on
     * @param {String} eventName - Name of the event
     * @param {Object} detail - Event detail object
     */
    trigger: (element, eventName, detail = {}) => {
      if (window.htmx && window.htmx.trigger) {
        window.htmx.trigger(element, eventName, detail);
      }
    }
  }
};

// Export the library
export default FxWeb;
