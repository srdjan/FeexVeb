/**
 * @module monospaceStyling
 * @description Provides default monospace styling for FeexVeb components based on "The Monospace Web" design principles.
 * These styles emphasize readability, simplicity, and a focus on content through monospace typography.
 * @see {@link https://owickstrom.github.io/the-monospace-web/}
 */

/**
 * Default monospace styles as a CSS string.
 * These styles implement "The Monospace Web" design principles with:
 * - Monospace typography with appropriate line heights and text sizes
 * - Clean, minimal color scheme
 * - Proper spacing, margins, and padding
 * - Responsive design considerations
 *
 * @type {string}
 */
export const monospaceCss = `
  :host {
    --mono-font: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    --mono-font-size: 16px;
    --mono-line-height: 1.5;
    --mono-bg: #ffffff;
    --mono-text: #222222;
    --mono-link: #0000ee;
    --mono-link-visited: #551a8b;
    --mono-border: #dddddd;
    --mono-accent: #f0f0f0;
    --mono-code-bg: #f5f5f5;
    --mono-spacing-unit: 1rem;
    --mono-max-width: 70ch;
  }

  /* Base styles */
  :host {
    font-family: var(--mono-font);
    font-size: var(--mono-font-size);
    line-height: var(--mono-line-height);
    color: var(--mono-text);
    background-color: var(--mono-bg);
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--mono-font);
    font-weight: 700;
    line-height: 1.2;
    margin-top: calc(var(--mono-spacing-unit) * 2);
    margin-bottom: var(--mono-spacing-unit);
  }

  h1 {
    font-size: 1.8rem;
    border-bottom: 1px solid var(--mono-border);
    padding-bottom: calc(var(--mono-spacing-unit) / 2);
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.3rem;
  }

  h4, h5, h6 {
    font-size: 1rem;
  }

  p, ul, ol, dl, table, blockquote {
    margin-top: var(--mono-spacing-unit);
    margin-bottom: var(--mono-spacing-unit);
  }

  /* Links */
  a {
    color: var(--mono-link);
    text-decoration: underline;
  }

  a:visited {
    color: var(--mono-link-visited);
  }

  a:hover, a:focus {
    text-decoration: none;
  }

  /* Lists */
  ul, ol {
    padding-left: calc(var(--mono-spacing-unit) * 2);
  }

  li {
    margin-bottom: calc(var(--mono-spacing-unit) / 2);
  }

  /* Code */
  code, pre {
    font-family: var(--mono-font);
    background-color: var(--mono-code-bg);
    border-radius: 3px;
  }

  code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
  }

  pre {
    padding: var(--mono-spacing-unit);
    overflow-x: auto;
    border: 1px solid var(--mono-border);
  }

  pre code {
    padding: 0;
    background-color: transparent;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  th, td {
    padding: calc(var(--mono-spacing-unit) / 2);
    border: 1px solid var(--mono-border);
    text-align: left;
  }

  th {
    background-color: var(--mono-accent);
    font-weight: bold;
  }

  /* Buttons and inputs */
  button, input, select, textarea {
    font-family: var(--mono-font);
    font-size: var(--mono-font-size);
    line-height: var(--mono-line-height);
    margin: 0;
  }

  button, input[type="button"], input[type="reset"], input[type="submit"] {
    padding: calc(var(--mono-spacing-unit) / 2) var(--mono-spacing-unit);
    background-color: var(--mono-accent);
    border: 1px solid var(--mono-border);
    cursor: pointer;
  }

  button:hover, input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover {
    background-color: var(--mono-border);
  }

  input[type="text"], input[type="email"], input[type="url"], input[type="password"],
  input[type="search"], input[type="number"], input[type="tel"], input[type="range"],
  input[type="date"], input[type="month"], input[type="week"], input[type="time"],
  input[type="datetime"], input[type="datetime-local"], input[type="color"], textarea, select {
    padding: calc(var(--mono-spacing-unit) / 2);
    border: 1px solid var(--mono-border);
    width: 100%;
  }

  /* Layout helpers */
  .container {
    max-width: var(--mono-max-width);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--mono-spacing-unit);
    padding-right: var(--mono-spacing-unit);
  }

  .full-width {
    width: 100%;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    :host {
      --mono-font-size: 14px;
      --mono-spacing-unit: 0.8rem;
    }
  }
`;

/**
 * Creates a style element with monospace CSS and returns it.
 * This is used internally by the component system to inject styles into shadow DOM.
 *
 * @returns {HTMLStyleElement} A style element containing monospace CSS
 */
export const createMonospaceStyleElement = () => {
  const style = document.createElement('style');
  style.textContent = monospaceCss;
  return style;
};

/**
 * Monospace styles adapted for regular HTML (not shadow DOM).
 * This version replaces :host selectors with body/html selectors.
 *
 * @type {string}
 */
export const monospaceCssForHtml = `
  :root {
    --mono-font: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    --mono-font-size: 16px;
    --mono-line-height: 1.5;
    --mono-bg: #ffffff;
    --mono-text: #222222;
    --mono-link: #0000ee;
    --mono-link-visited: #551a8b;
    --mono-border: #dddddd;
    --mono-accent: #f0f0f0;
    --mono-code-bg: #f5f5f5;
    --mono-spacing-unit: 1rem;
    --mono-max-width: 70ch;
  }

  /* Base styles */
  body {
    font-family: var(--mono-font);
    font-size: var(--mono-font-size);
    line-height: var(--mono-line-height);
    color: var(--mono-text);
    background-color: var(--mono-bg);
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--mono-font);
    font-weight: 700;
    line-height: 1.2;
    margin-top: calc(var(--mono-spacing-unit) * 2);
    margin-bottom: var(--mono-spacing-unit);
  }

  h1 {
    font-size: 1.8rem;
    border-bottom: 1px solid var(--mono-border);
    padding-bottom: calc(var(--mono-spacing-unit) / 2);
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.3rem;
  }

  h4, h5, h6 {
    font-size: 1rem;
  }

  p, ul, ol, dl, table, blockquote {
    margin-top: var(--mono-spacing-unit);
    margin-bottom: var(--mono-spacing-unit);
  }

  /* Links */
  a {
    color: var(--mono-link);
    text-decoration: underline;
  }

  a:visited {
    color: var(--mono-link-visited);
  }

  a:hover, a:focus {
    text-decoration: none;
  }

  /* Lists */
  ul, ol {
    padding-left: calc(var(--mono-spacing-unit) * 2);
  }

  li {
    margin-bottom: calc(var(--mono-spacing-unit) / 2);
  }

  /* Code */
  code, pre {
    font-family: var(--mono-font);
    background-color: var(--mono-code-bg);
    border-radius: 3px;
  }

  code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
  }

  pre {
    padding: var(--mono-spacing-unit);
    overflow-x: auto;
    border: 1px solid var(--mono-border);
  }

  pre code {
    padding: 0;
    background-color: transparent;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  th, td {
    padding: calc(var(--mono-spacing-unit) / 2);
    border: 1px solid var(--mono-border);
    text-align: left;
  }

  th {
    background-color: var(--mono-accent);
    font-weight: bold;
  }

  /* Buttons and inputs */
  button, input, select, textarea {
    font-family: var(--mono-font);
    font-size: var(--mono-font-size);
    line-height: var(--mono-line-height);
    margin: 0;
  }

  button, input[type="button"], input[type="reset"], input[type="submit"] {
    padding: calc(var(--mono-spacing-unit) / 2) var(--mono-spacing-unit);
    background-color: var(--mono-accent);
    border: 1px solid var(--mono-border);
    cursor: pointer;
  }

  button:hover, input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover {
    background-color: var(--mono-border);
  }

  input[type="text"], input[type="email"], input[type="url"], input[type="password"],
  input[type="search"], input[type="number"], input[type="tel"], input[type="range"],
  input[type="date"], input[type="month"], input[type="week"], input[type="time"],
  input[type="datetime"], input[type="datetime-local"], input[type="color"], textarea, select {
    padding: calc(var(--mono-spacing-unit) / 2);
    border: 1px solid var(--mono-border);
    width: 100%;
  }

  /* Layout helpers */
  .container {
    max-width: var(--mono-max-width);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--mono-spacing-unit);
    padding-right: var(--mono-spacing-unit);
  }

  .full-width {
    width: 100%;
  }

  /* Counter-specific styles */
  .counter-component {
    background: var(--mono-bg);
    border: 1px solid var(--mono-border);
    padding: var(--mono-spacing-unit);
    margin: var(--mono-spacing-unit) 0;
  }

  .counter-title {
    margin-top: 0;
    color: var(--mono-text);
  }

  .counter-value {
    font-size: 2rem;
    font-weight: bold;
    margin: var(--mono-spacing-unit) 0;
    font-family: var(--mono-font);
  }

  .counter-value.even {
    color: var(--mono-link);
  }

  .counter-value.odd {
    color: var(--mono-link-visited);
  }

  .counter-controls {
    display: flex;
    gap: calc(var(--mono-spacing-unit) / 2);
    margin-bottom: var(--mono-spacing-unit);
    flex-wrap: wrap;
  }

  .counter-btn {
    padding: calc(var(--mono-spacing-unit) / 2) var(--mono-spacing-unit);
    border: 1px solid var(--mono-border);
    background: var(--mono-accent);
    color: var(--mono-text);
    font-weight: bold;
    cursor: pointer;
    font-family: var(--mono-font);
    font-size: var(--mono-font-size);
  }

  .counter-btn:hover {
    background: var(--mono-border);
  }

  .counter-btn.decrement {
    background: var(--mono-code-bg);
  }

  .counter-btn.decrement:hover {
    background: var(--mono-border);
  }

  .counter-btn.reset {
    background: var(--mono-accent);
  }

  .counter-btn.reset:hover {
    background: var(--mono-border);
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    :root {
      --mono-font-size: 14px;
      --mono-spacing-unit: 0.8rem;
    }

    .counter-controls {
      flex-direction: column;
    }

    .counter-btn {
      width: 100%;
    }
  }
`;

/**
 * Injects monospace styles into a shadow root.
 *
 * @param {ShadowRoot} shadowRoot - The shadow root to inject styles into
 */
export const injectMonospaceStyles = (shadowRoot) => {
  if (shadowRoot) {
    shadowRoot.appendChild(createMonospaceStyleElement());
  }
};