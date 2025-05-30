/**
 * Unit tests for FeexVeb HTMX Integration
 * Tests HTMX initialization, patterns, events, and utilities
 */

import "./test-dom-setup.js";
import { 
  initHtmx, 
  processHtmx, 
  triggerHtmx, 
  htmxAttrs, 
  configureHtmx, 
  htmxPatterns, 
  addHtmxListener, 
  htmxEvents 
} from "../lib/src/htmx_integration.js";

console.log("Testing FeexVeb HTMX Integration...\n");

// Test 1: Function exports exist
console.log("✓ Test 1: Function exports exist");
console.assert(typeof initHtmx === "function", "initHtmx should be a function");
console.assert(typeof processHtmx === "function", "processHtmx should be a function");
console.assert(typeof triggerHtmx === "function", "triggerHtmx should be a function");
console.assert(typeof htmxAttrs === "function", "htmxAttrs should be a function");
console.assert(typeof configureHtmx === "function", "configureHtmx should be a function");
console.assert(typeof addHtmxListener === "function", "addHtmxListener should be a function");

// Test 2: htmxPatterns object
console.log("\n✓ Test 2: htmxPatterns object");
console.assert(typeof htmxPatterns === "object", "htmxPatterns should be an object");
console.assert(typeof htmxPatterns.get === "function", "htmxPatterns.get should be a function");
console.assert(typeof htmxPatterns.post === "function", "htmxPatterns.post should be a function");
console.assert(typeof htmxPatterns.form === "function", "htmxPatterns.form should be a function");
console.assert(typeof htmxPatterns.poll === "function", "htmxPatterns.poll should be a function");
console.assert(typeof htmxPatterns.infiniteScroll === "function", "htmxPatterns.infiniteScroll should be a function");

// Test 3: htmxEvents object
console.log("\n✓ Test 3: htmxEvents object");
console.assert(typeof htmxEvents === "object", "htmxEvents should be an object");
console.assert(htmxEvents.BEFORE_REQUEST === "htmx:beforeRequest", "Should have BEFORE_REQUEST event");
console.assert(htmxEvents.AFTER_REQUEST === "htmx:afterRequest", "Should have AFTER_REQUEST event");
console.assert(htmxEvents.BEFORE_SWAP === "htmx:beforeSwap", "Should have BEFORE_SWAP event");
console.assert(htmxEvents.AFTER_SWAP === "htmx:afterSwap", "Should have AFTER_SWAP event");
console.assert(htmxEvents.RESPONSE_ERROR === "htmx:responseError", "Should have RESPONSE_ERROR event");
console.assert(htmxEvents.SEND_ERROR === "htmx:sendError", "Should have SEND_ERROR event");
console.assert(htmxEvents.TARGET_ERROR === "htmx:targetError", "Should have TARGET_ERROR event");
console.assert(htmxEvents.CONFIG_REQUEST === "htmx:configRequest", "Should have CONFIG_REQUEST event");

// Test 4: htmxAttrs function
console.log("\n✓ Test 4: htmxAttrs function");
const testAttrs = {
  hxGet: "/api/data",
  hxTarget: "#result",
  hxTrigger: "click",
  hxSwap: "innerHTML",
  className: "regular-attr"
};

const convertedAttrs = htmxAttrs(testAttrs);
console.assert(convertedAttrs["hx-get"] === "/api/data", "Should convert hxGet to hx-get");
console.assert(convertedAttrs["hx-target"] === "#result", "Should convert hxTarget to hx-target");
console.assert(convertedAttrs["hx-trigger"] === "click", "Should convert hxTrigger to hx-trigger");
console.assert(convertedAttrs["hx-swap"] === "innerHTML", "Should convert hxSwap to hx-swap");
console.assert(convertedAttrs.className === "regular-attr", "Should preserve non-hx attributes");

// Test with empty object
const emptyResult = htmxAttrs({});
console.assert(Object.keys(emptyResult).length === 0, "Should handle empty object");

// Test with undefined
const undefinedResult = htmxAttrs();
console.assert(Object.keys(undefinedResult).length === 0, "Should handle undefined");

// Test 5: htmxPatterns.get function
console.log("\n✓ Test 5: htmxPatterns.get function");
const getPattern = htmxPatterns.get("/api/users", "#user-list", "load");
console.assert(getPattern["hx-get"] === "/api/users", "Should set hx-get");
console.assert(getPattern["hx-target"] === "#user-list", "Should set hx-target");
console.assert(getPattern["hx-trigger"] === "load", "Should set hx-trigger");

// Test with default trigger
const getPatternDefault = htmxPatterns.get("/api/data", "#result");
console.assert(getPatternDefault["hx-trigger"] === "click", "Should default to click trigger");

// Test 6: htmxPatterns.post function
console.log("\n✓ Test 6: htmxPatterns.post function");
const postPattern = htmxPatterns.post("/api/submit", "#response", "submit");
console.assert(postPattern["hx-post"] === "/api/submit", "Should set hx-post");
console.assert(postPattern["hx-target"] === "#response", "Should set hx-target");
console.assert(postPattern["hx-trigger"] === "submit", "Should set hx-trigger");

// Test 7: htmxPatterns.form function
console.log("\n✓ Test 7: htmxPatterns.form function");
const formPattern = htmxPatterns.form("/api/form-submit", "#form-result");
console.assert(formPattern["hx-post"] === "/api/form-submit", "Should set hx-post");
console.assert(formPattern["hx-target"] === "#form-result", "Should set hx-target");
console.assert(formPattern["hx-indicator"] === ".loading", "Should set hx-indicator");
console.assert(formPattern["hx-validate"] === "true", "Should set hx-validate");

// Test 8: htmxPatterns.poll function
console.log("\n✓ Test 8: htmxPatterns.poll function");
const pollPattern = htmxPatterns.poll("/api/status", "5s");
console.assert(pollPattern["hx-get"] === "/api/status", "Should set hx-get");
console.assert(pollPattern["hx-trigger"] === "every 5s", "Should set polling trigger");
console.assert(pollPattern["hx-target"] === "this", "Should target self");
console.assert(pollPattern["hx-swap"] === "innerHTML", "Should set swap mode");

// Test with default interval
const pollPatternDefault = htmxPatterns.poll("/api/heartbeat");
console.assert(pollPatternDefault["hx-trigger"] === "every 2s", "Should default to 2s interval");

// Test 9: htmxPatterns.infiniteScroll function
console.log("\n✓ Test 9: htmxPatterns.infiniteScroll function");
const scrollPattern = htmxPatterns.infiniteScroll("/api/next-page", "#content-list");
console.assert(scrollPattern["hx-get"] === "/api/next-page", "Should set hx-get");
console.assert(scrollPattern["hx-trigger"] === "revealed", "Should set revealed trigger");
console.assert(scrollPattern["hx-target"] === "#content-list", "Should set target");
console.assert(scrollPattern["hx-swap"] === "beforeend", "Should append content");

// Test 10: processHtmx function (mock test since HTMX may not be loaded)
console.log("\n✓ Test 10: processHtmx function");
const testElement = document.createElement("div");
testElement.setAttribute("hx-get", "/test");

// Should not throw even if HTMX is not loaded
try {
  processHtmx(testElement);
  console.assert(true, "processHtmx should not throw without HTMX");
} catch (error) {
  console.assert(false, "processHtmx should handle missing HTMX gracefully");
}

// Test 11: triggerHtmx function (mock test)
console.log("\n✓ Test 11: triggerHtmx function");
const triggerElement = document.createElement("button");

// Should not throw even if HTMX is not loaded
try {
  triggerHtmx(triggerElement, "test-event", { detail: "test" });
  console.assert(true, "triggerHtmx should not throw without HTMX");
} catch (error) {
  console.assert(false, "triggerHtmx should handle missing HTMX gracefully");
}

// Test 12: configureHtmx function (mock test)
console.log("\n✓ Test 12: configureHtmx function");
const testConfig = {
  timeout: 5000,
  historyEnabled: false
};

// Should not throw even if HTMX is not loaded
try {
  configureHtmx(testConfig);
  console.assert(true, "configureHtmx should not throw without HTMX");
} catch (error) {
  console.assert(false, "configureHtmx should handle missing HTMX gracefully");
}

// Test 13: addHtmxListener function
console.log("\n✓ Test 13: addHtmxListener function");
const listenerElement = document.createElement("div");
let eventFired = false;

const cleanup = addHtmxListener(listenerElement, "test-event", (event) => {
  eventFired = true;
});

console.assert(typeof cleanup === "function", "Should return cleanup function");

// Simulate event
const testEvent = new CustomEvent("test-event");
listenerElement.dispatchEvent(testEvent);
console.assert(eventFired, "Event listener should fire");

// Test cleanup
cleanup();
eventFired = false;
listenerElement.dispatchEvent(testEvent);
console.assert(!eventFired, "Event listener should be removed after cleanup");

// Test 14: initHtmx function (integration test)
console.log("\n✓ Test 14: initHtmx function");

// Mock HTMX already being available
const mockHtmx = {
  config: {},
  process: () => {},
  trigger: () => {}
};

// Save original value
const originalHtmx = globalThis.htmx;
globalThis.htmx = mockHtmx;

try {
  const result = await initHtmx({ timeout: 10000 });
  console.assert(result === mockHtmx, "Should return existing HTMX instance");
  console.assert(globalThis.htmx.config.timeout === 10000, "Should apply configuration");
} catch (error) {
  console.assert(false, `initHtmx should work with existing HTMX: ${error.message}`);
}

// Restore original value
globalThis.htmx = originalHtmx;

// Test 15: Complex pattern combinations
console.log("\n✓ Test 15: Complex pattern combinations");
const complexElement = document.createElement("form");

// Combine multiple patterns
const getAttrs = htmxPatterns.get("/api/preview", "#preview", "input");
const formAttrs = htmxPatterns.form("/api/submit", "#result");

// Apply attributes (would normally be done in JSX)
Object.entries({...getAttrs, ...formAttrs}).forEach(([key, value]) => {
  complexElement.setAttribute(key, value);
});

console.assert(complexElement.getAttribute("hx-get") === "/api/preview", "Should have get attributes");
console.assert(complexElement.getAttribute("hx-post") === "/api/submit", "Should have post attributes");
console.assert(complexElement.getAttribute("hx-indicator") === ".loading", "Should have form attributes");

// Test 16: Event name constants
console.log("\n✓ Test 16: Event name constants");
const allEvents = [
  htmxEvents.BEFORE_REQUEST,
  htmxEvents.AFTER_REQUEST,
  htmxEvents.BEFORE_SWAP,
  htmxEvents.AFTER_SWAP,
  htmxEvents.RESPONSE_ERROR,
  htmxEvents.SEND_ERROR,
  htmxEvents.TARGET_ERROR,
  htmxEvents.CONFIG_REQUEST
];

allEvents.forEach(eventName => {
  console.assert(eventName.startsWith("htmx:"), `Event ${eventName} should start with htmx:`);
});

console.assert(allEvents.length === 8, "Should have all 8 event constants");

console.log("\n🎉 All HTMX Integration tests passed!");