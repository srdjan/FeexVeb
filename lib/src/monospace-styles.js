/**
 * @file Unified Styling System - Consolidated monospace design system
 * Eliminates duplicate CSS and uses CSS custom properties for better maintainability
 */

/**
 * Core monospace design tokens as CSS custom properties
 */
const designTokens = `
  :root {
    --mono-font: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    --mono-spacing-unit: 1rem;
    --mono-line-height: 1.5;
    --mono-max-width: 70ch;
    
    /* Colors */
    --mono-text: #222222;
    --mono-bg: #ffffff;
    --mono-link: #0000ee;
    --mono-border: #dddddd;
    --mono-accent: #f5f5f5;
    
    /* Interactive states */
    --mono-button-bg: #f8f8f8;
    --mono-button-hover: #e8e8e8;
    --mono-button-active: #d8d8d8;
    
    /* Form elements */
    --mono-input-bg: #ffffff;
    --mono-input-border: #cccccc;
    --mono-input-focus: #0066cc;
  }
`;

/**
 * Base monospace styles that work in any context
 */
const baseStyles = `
  ${designTokens}
  
  .mono-base,
  .mono-base * {
    font-family: var(--mono-font);
    line-height: var(--mono-line-height);
    box-sizing: border-box;
  }
  
  .mono-container {
    max-width: var(--mono-max-width);
    margin: 0 auto;
    padding: var(--mono-spacing-unit);
    color: var(--mono-text);
    background: var(--mono-bg);
  }
  
  .mono-button {
    background: var(--mono-button-bg);
    border: 1px solid var(--mono-border);
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
  }
  
  .mono-button:hover {
    background: var(--mono-button-hover);
  }
  
  .mono-button:active {
    background: var(--mono-button-active);
  }
  
  .mono-input {
    background: var(--mono-input-bg);
    border: 1px solid var(--mono-input-border);
    padding: 0.5rem;
    margin: 0.25rem;
    font-family: inherit;
    font-size: inherit;
    width: 100%;
  }
  
  .mono-input:focus {
    outline: 2px solid var(--mono-input-focus);
    outline-offset: -2px;
  }
  
  .mono-link {
    color: var(--mono-link);
    text-decoration: underline;
  }
  
  .mono-divider {
    border: none;
    border-top: 1px solid var(--mono-border);
    margin: var(--mono-spacing-unit) 0;
  }
  
  /* Counter component styles */
  .counter-component {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border: 1px solid var(--mono-border);
    background: var(--mono-bg);
  }
  
  .counter-value {
    font-weight: bold;
    padding: 0.25rem 0.5rem;
    min-width: 3rem;
    text-align: center;
    border: 1px solid var(--mono-border);
    background: var(--mono-accent);
  }
  
  .counter-btn {
    background: var(--mono-button-bg);
    border: 1px solid var(--mono-border);
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
  }
  
  .counter-btn:hover {
    background: var(--mono-button-hover);
  }
  
  .counter-btn:active {
    background: var(--mono-button-active);
  }
`;

/**
 * Shadow DOM specific styles (scoped with :host)
 */
const shadowDomStyles = `
  :host {
    display: block;
    font-family: var(--mono-font);
    line-height: var(--mono-line-height);
    color: var(--mono-text);
    background: var(--mono-bg);
  }
  
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: border-box;
  }
  
  ${baseStyles.replace(/\.mono-/g, ".")}
`;

/**
 * Regular DOM styles (scoped to body)
 */
const regularDomStyles = `
  body {
    font-family: var(--mono-font);
    line-height: var(--mono-line-height);
    max-width: var(--mono-max-width);
    margin: 0 auto;
    padding: var(--mono-spacing-unit);
    color: var(--mono-text);
    background: var(--mono-bg);
  }
  
  ${baseStyles}
`;

/**
 * Get CSS for shadow DOM components
 * @returns {string} CSS string for shadow DOM
 */
export function getShadowDomCss() {
  return shadowDomStyles;
}

/**
 * Get CSS for regular HTML documents
 * @returns {string} CSS string for regular DOM
 */
export function getRegularDomCss() {
  return regularDomStyles;
}

/**
 * Create a style element with shadow DOM CSS
 * @returns {HTMLStyleElement} Style element
 */
export function createShadowStyleElement() {
  const style = document.createElement("style");
  style.textContent = getShadowDomCss();
  return style;
}

/**
 * Create a style element with regular DOM CSS
 * @returns {HTMLStyleElement} Style element
 */
export function createRegularStyleElement() {
  const style = document.createElement("style");
  style.textContent = getRegularDomCss();
  return style;
}

/**
 * Inject monospace styles into a shadow root or document head
 * @param {ShadowRoot|Document|HTMLElement} target - Target to inject styles into
 */
export function injectMonospaceStyles(target) {
  if (target instanceof ShadowRoot) {
    target.appendChild(createShadowStyleElement());
  } else if (target === document || target instanceof HTMLHeadElement) {
    const head = target === document ? document.head : target;
    head.appendChild(createRegularStyleElement());
  } else {
    // Assume it's a regular element, inject as shadow DOM styles
    target.appendChild(createShadowStyleElement());
  }
}

/**
 * Utility to add monospace class to elements
 * @param {HTMLElement} element - Element to add class to
 */
export function addMonospaceClass(element) {
  element.classList.add("mono-base");
}

/**
 * Legacy exports for backward compatibility
 */
export const monospaceCss = getShadowDomCss();
export const monospaceCssForHtml = getRegularDomCss();
export const createMonospaceStyleElement = createShadowStyleElement;
