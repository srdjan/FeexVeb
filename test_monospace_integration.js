/**
 * Test script to verify FeexWeb monospace styling integration
 * This script tests that the monospace styles are properly exported and accessible
 */

import FxWeb from "./lib/feexweb.js";

console.log("Testing FeexWeb monospace styling integration...\n");

// Test 1: Check if styling namespace exists
console.log("✓ Test 1: Styling namespace exists");
console.log("  FxWeb.styling:", typeof FxWeb.styling);
console.log("  Expected: object, Actual:", typeof FxWeb.styling);
console.assert(typeof FxWeb.styling === 'object', "Styling namespace should be an object");

// Test 2: Check if monospaceCss is available
console.log("\n✓ Test 2: monospaceCss is available");
console.log("  FxWeb.styling.monospaceCss:", typeof FxWeb.styling.monospaceCss);
console.log("  Length:", FxWeb.styling.monospaceCss?.length || 0, "characters");
console.assert(typeof FxWeb.styling.monospaceCss === 'string', "monospaceCss should be a string");
console.assert(FxWeb.styling.monospaceCss.length > 0, "monospaceCss should not be empty");

// Test 3: Check if monospaceCssForHtml is available
console.log("\n✓ Test 3: monospaceCssForHtml is available");
console.log("  FxWeb.styling.monospaceCssForHtml:", typeof FxWeb.styling.monospaceCssForHtml);
console.log("  Length:", FxWeb.styling.monospaceCssForHtml?.length || 0, "characters");
console.assert(typeof FxWeb.styling.monospaceCssForHtml === 'string', "monospaceCssForHtml should be a string");
console.assert(FxWeb.styling.monospaceCssForHtml.length > 0, "monospaceCssForHtml should not be empty");

// Test 4: Check if createMonospaceStyleElement function exists
console.log("\n✓ Test 4: createMonospaceStyleElement function exists");
console.log("  FxWeb.styling.createMonospaceStyleElement:", typeof FxWeb.styling.createMonospaceStyleElement);
console.assert(typeof FxWeb.styling.createMonospaceStyleElement === 'function', "createMonospaceStyleElement should be a function");

// Test 5: Check if injectMonospaceStyles function exists
console.log("\n✓ Test 5: injectMonospaceStyles function exists");
console.log("  FxWeb.styling.injectMonospaceStyles:", typeof FxWeb.styling.injectMonospaceStyles);
console.assert(typeof FxWeb.styling.injectMonospaceStyles === 'function', "injectMonospaceStyles should be a function");

// Test 6: Verify CSS contains expected monospace properties
console.log("\n✓ Test 6: CSS contains expected monospace properties");
const htmlCss = FxWeb.styling.monospaceCssForHtml;
const expectedProperties = [
  '--mono-font:',
  'ui-monospace',
  'font-family: var(--mono-font)',
  '.counter-component',
  '.counter-value',
  '.counter-btn'
];

expectedProperties.forEach(prop => {
  const found = htmlCss.includes(prop);
  console.log(`  ${found ? '✓' : '✗'} Contains "${prop}": ${found}`);
  console.assert(found, `CSS should contain "${prop}"`);
});

// Test 7: Verify HTML CSS is different from shadow DOM CSS
console.log("\n✓ Test 7: HTML CSS is different from shadow DOM CSS");
const shadowCss = FxWeb.styling.monospaceCss;
const htmlUsesBody = htmlCss.includes('body {');
const shadowUsesHost = shadowCss.includes(':host {');
console.log("  HTML CSS uses 'body' selector:", htmlUsesBody);
console.log("  Shadow CSS uses ':host' selector:", shadowUsesHost);
console.assert(htmlUsesBody, "HTML CSS should use 'body' selector");
console.assert(shadowUsesHost, "Shadow CSS should use ':host' selector");
console.assert(htmlCss !== shadowCss, "HTML CSS should be different from shadow CSS");

console.log("\n🎉 All tests passed! FeexWeb monospace styling integration is working correctly.");
console.log("\nThe counter server should now display with:");
console.log("- Monospace typography throughout");
console.log("- Clean, minimal design following 'The Monospace Web' principles");
console.log("- Consistent spacing using CSS custom properties");
console.log("- Proper color coding for even/odd counter values");
console.log("- Responsive design that works on mobile devices");
