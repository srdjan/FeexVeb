/**
 * Unit tests for FeexVeb JSX/Virtual DOM System
 * Tests JSX rendering, DOM creation, and HTMX integration
 */

import "./test-dom-setup.js";
import { 
  createElement, 
  Fragment, 
  render, 
  hydrate, 
  renderToString, 
  renderWithHtmx, 
  htmxAttrs, 
  applyDiff, 
  createDomNode 
} from "../lib/src/webjsx.js";

console.log("Testing FeexVeb JSX/Virtual DOM System...\n");

// Test 1: createElement function exists
console.log("✓ Test 1: createElement and Fragment exist");
console.assert(typeof createElement === "function", "createElement should be a function");
console.assert(typeof Fragment === "function", "Fragment should be a function");

// Test 2: Basic rendering functions
console.log("\n✓ Test 2: Basic rendering functions exist");
console.assert(typeof render === "function", "render should be a function");
console.assert(typeof hydrate === "function", "hydrate should be a function");
console.assert(typeof renderToString === "function", "renderToString should be a function");
console.assert(typeof renderWithHtmx === "function", "renderWithHtmx should be a function");

// Test 3: Utility functions
console.log("\n✓ Test 3: Utility functions exist");
console.assert(typeof htmxAttrs === "function", "htmxAttrs should be a function");
console.assert(typeof applyDiff === "function", "applyDiff should be a function");
console.assert(typeof createDomNode === "function", "createDomNode should be a function");

// Test 4: render function with simple text
console.log("\n✓ Test 4: render function with simple text");
const textResult = render("Hello World");
console.assert(textResult.nodeType === Node.TEXT_NODE, "Should create text node");
console.assert(textResult.textContent === "Hello World", "Should contain correct text");

const numberResult = render(42);
console.assert(numberResult.nodeType === Node.TEXT_NODE, "Should create text node from number");
console.assert(numberResult.textContent === "42", "Should convert number to string");

const nullResult = render(null);
console.assert(nullResult.nodeType === Node.TEXT_NODE, "Should create text node for null");
console.assert(nullResult.textContent === "", "Should be empty text for null");

// Test 5: render function with simple element
console.log("\n✓ Test 5: render function with simple element");
const simpleVdom = {
  type: "div",
  props: {
    className: "test-class",
    id: "test-id"
  }
};

const simpleElement = render(simpleVdom);
console.assert(simpleElement.tagName === "DIV", "Should create div element");
console.assert(simpleElement.className === "test-class", "Should set className");
console.assert(simpleElement.id === "test-id", "Should set id");

// Test 6: render function with children
console.log("\n✓ Test 6: render function with children");
const withChildrenVdom = {
  type: "div",
  props: {
    children: [
      "Text child",
      {
        type: "span",
        props: {
          children: "Span content"
        }
      }
    ]
  }
};

const parentElement = render(withChildrenVdom);
console.assert(parentElement.children.length === 1, "Should have one element child");
console.assert(parentElement.childNodes.length === 2, "Should have two total children");
console.assert(parentElement.childNodes[0].textContent === "Text child", "First child should be text");
console.assert(parentElement.children[0].tagName === "SPAN", "Second child should be span");
console.assert(parentElement.children[0].textContent === "Span content", "Span should have correct content");

// Test 7: render function with event handlers
console.log("\n✓ Test 7: render function with event handlers");
let clickCalled = false;
const withEventVdom = {
  type: "button",
  props: {
    onClick: () => { clickCalled = true; },
    children: "Click me"
  }
};

const buttonElement = render(withEventVdom);
console.assert(buttonElement.tagName === "BUTTON", "Should create button element");
console.assert(buttonElement.textContent === "Click me", "Should have correct text");

// Simulate click event
const clickEvent = new Event("click");
buttonElement.dispatchEvent(clickEvent);
console.assert(clickCalled, "Click handler should be called");

// Test 8: hydrate function
console.log("\n✓ Test 8: hydrate function");
const container = document.createElement("div");
container.innerHTML = "<p>Old content</p>";

const hydrateVdom = {
  type: "div",
  props: {
    children: "New content"
  }
};

hydrate(hydrateVdom, container);
console.assert(container.children.length === 1, "Should have one child");
console.assert(container.children[0].tagName === "DIV", "Should be div element");
console.assert(container.children[0].textContent === "New content", "Should have new content");

// Test 9: renderToString function
console.log("\n✓ Test 9: renderToString function");
const stringVdom = {
  type: "div",
  props: {
    children: "Test content"
  }
};

const stringResult = renderToString(stringVdom);
console.assert(typeof stringResult === "string", "Should return string");

// Test with object that has toString method
const withToString = {
  toString: () => "<div>Custom toString</div>"
};
const toStringResult = renderToString(withToString);
console.assert(toStringResult === "<div>Custom toString</div>", "Should use toString method");

// Test 10: renderWithHtmx function
console.log("\n✓ Test 10: renderWithHtmx function");
const htmxContainer = document.createElement("div");
const htmxVdom = {
  type: "div",
  props: {
    "hx-get": "/api/test",
    children: "HTMX content"
  }
};

const htmxElement = renderWithHtmx(htmxVdom, htmxContainer);
console.assert(htmxContainer.children.length === 1, "Should append to container");
console.assert(htmxElement.tagName === "DIV", "Should create div element");
console.assert(htmxElement.textContent === "HTMX content", "Should have correct content");

// Test 11: htmxAttrs function
console.log("\n✓ Test 11: htmxAttrs function");
const camelCaseAttrs = {
  hxGet: "/api/data",
  hxTarget: "#result",
  hxTrigger: "click",
  regularAttr: "value"
};

const convertedAttrs = htmxAttrs(camelCaseAttrs);
console.assert(convertedAttrs["hx-get"] === "/api/data", "Should convert hxGet to hx-get");
console.assert(convertedAttrs["hx-target"] === "#result", "Should convert hxTarget to hx-target");
console.assert(convertedAttrs["hx-trigger"] === "click", "Should convert hxTrigger to hx-trigger");
console.assert(convertedAttrs.regularAttr === "value", "Should preserve regular attributes");

// Test with empty attrs
const emptyAttrs = htmxAttrs({});
console.assert(Object.keys(emptyAttrs).length === 0, "Should handle empty attributes");

const undefinedAttrs = htmxAttrs();
console.assert(Object.keys(undefinedAttrs).length === 0, "Should handle undefined attributes");

// Test 12: applyDiff function
console.log("\n✓ Test 12: applyDiff function");
const diffContainer = document.createElement("div");
diffContainer.innerHTML = "<p>Old content</p><span>More old</span>";

const newVdom = {
  type: "div",
  props: {
    children: "Replaced content"
  }
};

applyDiff(diffContainer, newVdom);
console.assert(diffContainer.children.length === 1, "Should replace all content");
console.assert(diffContainer.children[0].tagName === "DIV", "Should have new element");
console.assert(diffContainer.children[0].textContent === "Replaced content", "Should have new content");

// Test 13: createDomNode function (alias for render)
console.log("\n✓ Test 13: createDomNode function");
const nodeVdom = {
  type: "section",
  props: {
    className: "test-section",
    children: "Section content"
  }
};

const sectionNode = createDomNode(nodeVdom);
console.assert(sectionNode.tagName === "SECTION", "Should create section element");
console.assert(sectionNode.className === "test-section", "Should set class");
console.assert(sectionNode.textContent === "Section content", "Should have content");

// Test 14: Nested component rendering
console.log("\n✓ Test 14: Nested component rendering");
const nestedVdom = {
  type: "article",
  props: {
    children: [
      {
        type: "header",
        props: {
          children: {
            type: "h1",
            props: {
              children: "Article Title"
            }
          }
        }
      },
      {
        type: "main",
        props: {
          children: [
            {
              type: "p",
              props: {
                children: "Paragraph 1"
              }
            },
            {
              type: "p",
              props: {
                children: "Paragraph 2"
              }
            }
          ]
        }
      }
    ]
  }
};

const articleElement = render(nestedVdom);
console.assert(articleElement.tagName === "ARTICLE", "Should create article element");
console.assert(articleElement.children.length === 2, "Should have header and main");
console.assert(articleElement.querySelector("h1").textContent === "Article Title", "Should have nested h1");
console.assert(articleElement.querySelectorAll("p").length === 2, "Should have two paragraphs");

// Test 15: Edge cases
console.log("\n✓ Test 15: Edge cases");
// Test undefined vdom
const undefinedResult = render(undefined);
console.assert(undefinedResult.nodeType === Node.TEXT_NODE, "Should handle undefined");
console.assert(undefinedResult.textContent === "", "Should be empty for undefined");

// Test with no props
const noPropsVdom = {
  type: "div",
  props: null
};
const noPropsElement = render(noPropsVdom);
console.assert(noPropsElement.tagName === "DIV", "Should handle null props");

// Test with invalid element type
const invalidTypeVdom = {
  type: null,
  props: {}
};
const invalidResult = render(invalidTypeVdom);
console.assert(invalidResult.nodeType === Node.TEXT_NODE, "Should handle invalid type");

console.log("\n🎉 All JSX/Virtual DOM System tests passed!");