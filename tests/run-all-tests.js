/**
 * Test runner for all FeexVeb unit tests
 * Runs all test files and reports results
 */

// Suppress Deno runtime warnings for test environment
globalThis.addEventListener = globalThis.addEventListener || (() => {});
globalThis.removeEventListener = globalThis.removeEventListener || (() => {});

console.log("🧪 Running FeexVeb Unit Test Suite\n");
console.log("=" .repeat(50));

const testFiles = [
  "./feexveb.test.js",
  "./state.test.js",
  // Removed webjsx.test.js since wrappers are dropped
  "./component.test.js",
  "./htmx_integration.test.js",
  "./test_monospace_integration.js"
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const testFile of testFiles) {
  console.log(`\n📁 Running ${testFile}:`);
  console.log("-".repeat(30));
  
  try {
    await import(testFile);
    console.log(`✅ ${testFile} completed`);
    passedTests++;
  } catch (error) {
    console.error(`❌ ${testFile} failed:`, error.message);
    failedTests++;
  }
  totalTests++;
}

console.log("\n" + "=".repeat(50));
console.log("📊 Test Results Summary:");
console.log(`Total test files: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
  console.log("\n🎉 All tests passed! FeexVeb library is working correctly.");
} else {
  console.log(`\n⚠️  ${failedTests} test file(s) failed. Please check the errors above.`);
}

console.log("\n📋 Test Coverage Areas:");
console.log("• Main FeexVeb namespace and exports");
console.log("• Reactive state management (signals, computed, effects)");
console.log("• JSX/Virtual DOM rendering system");
console.log("• Component API (simplified and advanced)");
console.log("• HTMX integration and patterns");
console.log("• Monospace styling system");

// Clean exit to prevent Deno runtime warnings
if (failedTests === 0) {
  Deno.exit(0);
} else {
  Deno.exit(1);
}

export { totalTests, passedTests, failedTests };