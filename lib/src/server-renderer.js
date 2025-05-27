/**
 * @file Server-Side Renderer for FeexVeb Components
 * @description Renders FeexVeb components to HTML strings on the server
 */

/**
 * Server-side component registry
 */
const serverComponents = new Map();

/**
 * Register a component for server-side rendering
 * @param {string} tagName - Component tag name
 * @param {Object} componentDef - Component definition
 */
export function registerServerComponent(tagName, componentDef) {
  serverComponents.set(tagName, componentDef);
}

/**
 * Create a server-side FeexVeb instance for SSR
 */
export const ServerFeexVeb = {
  /**
   * createElement function for server-side rendering
   * @param {string} type - Element type
   * @param {Object} props - Element properties
   * @param {...any} children - Child elements
   * @returns {Object} - Virtual element object
   */
  createElement(type, props, ...children) {
    return {
      type,
      props: props || {},
      children: children.flat().filter(child => child != null)
    };
  },

  /**
   * Register a component for server-side rendering
   * @param {Object} config - Component configuration
   */
  component(config) {
    registerServerComponent(config.tag, config);
    
    // Return the component definition for potential client-side use
    return config;
  },

  /**
   * Render a virtual element to HTML string
   * @param {Object} vnode - Virtual node
   * @param {Object} context - Rendering context
   * @returns {string} - HTML string
   */
  renderToString(vnode, context = {}) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      return String(vnode);
    }

    if (!vnode || typeof vnode !== 'object') {
      return '';
    }

    const { type, props, children } = vnode;

    // Handle custom components
    if (serverComponents.has(type)) {
      return this.renderComponent(type, props, context);
    }

    // Handle regular HTML elements
    return this.renderHTMLElement(type, props, children, context);
  },

  /**
   * Render a custom component
   * @param {string} tagName - Component tag name
   * @param {Object} props - Component props
   * @param {Object} context - Rendering context
   * @returns {string} - HTML string
   */
  renderComponent(tagName, props = {}, context = {}) {
    const componentDef = serverComponents.get(tagName);
    if (!componentDef) {
      return `<!-- Component ${tagName} not found -->`;
    }

    try {
      // Initialize component state
      const state = { ...componentDef.state };
      
      // Apply attributes to state
      if (componentDef.attrs) {
        Object.keys(componentDef.attrs).forEach(attrName => {
          const attrDef = componentDef.attrs[attrName];
          const propValue = props[attrName] || props[attrName.replace(/-/g, '')];
          
          if (propValue !== undefined) {
            state[attrName.replace(/-/g, '')] = this.convertAttributeValue(propValue, attrDef.type);
          } else if (attrDef.default !== undefined) {
            state[attrName.replace(/-/g, '')] = attrDef.default;
          }
        });
      }

      // Compute derived state
      const computed = {};
      if (componentDef.computed) {
        Object.keys(componentDef.computed).forEach(key => {
          computed[key] = componentDef.computed[key](state);
        });
      }

      // Create render context
      const renderContext = {
        ...state,
        ...computed,
        ...componentDef.methods
      };

      // Render the component
      const vnode = componentDef.render(renderContext);
      const html = this.renderToString(vnode, context);

      // Wrap in custom element for client-side hydration
      const attributes = this.serializeAttributes(props);
      return `<${tagName}${attributes} data-ssr="true">${html}</${tagName}>`;

    } catch (error) {
      console.error(`Error rendering component ${tagName}:`, error);
      return `<!-- Error rendering ${tagName}: ${error.message} -->`;
    }
  },

  /**
   * Render an HTML element
   * @param {string} type - Element type
   * @param {Object} props - Element properties
   * @param {Array} children - Child elements
   * @param {Object} context - Rendering context
   * @returns {string} - HTML string
   */
  renderHTMLElement(type, props, children, context) {
    const attributes = this.serializeAttributes(props);
    const childrenHTML = children
      .map(child => this.renderToString(child, context))
      .join('');

    // Self-closing elements
    const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    
    if (selfClosing.includes(type)) {
      return `<${type}${attributes} />`;
    }

    return `<${type}${attributes}>${childrenHTML}</${type}>`;
  },

  /**
   * Serialize props to HTML attributes
   * @param {Object} props - Properties object
   * @returns {string} - Attribute string
   */
  serializeAttributes(props) {
    if (!props || typeof props !== 'object') {
      return '';
    }

    return Object.keys(props)
      .filter(key => props[key] != null && key !== 'children')
      .map(key => {
        const value = props[key];
        
        // Handle boolean attributes
        if (typeof value === 'boolean') {
          return value ? ` ${key}` : '';
        }
        
        // Handle function attributes (skip for SSR)
        if (typeof value === 'function') {
          return '';
        }
        
        // Handle regular attributes
        const escapedValue = String(value)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
          
        return ` ${key}="${escapedValue}"`;
      })
      .join('');
  },

  /**
   * Convert attribute value to the specified type
   * @param {any} value - Raw value
   * @param {string} type - Target type
   * @returns {any} - Converted value
   */
  convertAttributeValue(value, type) {
    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true' || value === true;
      case 'string':
      default:
        return String(value);
    }
  },

  /**
   * Render a component by tag name with props
   * @param {string} tagName - Component tag name
   * @param {Object} props - Component props
   * @returns {string} - HTML string
   */
  renderComponentByTag(tagName, props = {}) {
    return this.renderComponent(tagName, props);
  },

  /**
   * Get all registered components
   * @returns {Map} - Component registry
   */
  getRegisteredComponents() {
    return new Map(serverComponents);
  },

  /**
   * Clear component registry (useful for testing)
   */
  clearRegistry() {
    serverComponents.clear();
  }
};

/**
 * Create a server-side rendering context
 * @param {Object} options - Rendering options
 * @returns {Object} - Rendering context
 */
export function createSSRContext(options = {}) {
  return {
    isServer: true,
    ...options
  };
}

/**
 * Hydration marker for client-side
 * @param {string} componentTag - Component tag name
 * @param {Object} props - Component props
 * @returns {string} - Hydration marker
 */
export function createHydrationMarker(componentTag, props = {}) {
  const serializedProps = JSON.stringify(props);
  return `<script type="application/json" data-hydrate="${componentTag}">${serializedProps}</script>`;
}

/**
 * Render a complete page with SSR components
 * @param {Object} pageConfig - Page configuration
 * @returns {string} - Complete HTML page
 */
export function renderPage(pageConfig) {
  const { title, components, layout } = pageConfig;
  
  let html = layout || '<!DOCTYPE html><html><head><title>{title}</title></head><body>{content}</body></html>';
  
  // Replace title
  html = html.replace('{title}', title || 'FeexVeb App');
  
  // Render components
  const componentHTML = components
    .map(({ tag, props }) => ServerFeexVeb.renderComponentByTag(tag, props))
    .join('\n');
  
  // Replace content
  html = html.replace('{content}', componentHTML);
  
  return html;
}
