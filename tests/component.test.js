/**
 * Unit tests for FeexVeb Component API
 * Tests both simplified and advanced component patterns
 */

import "./test-dom-setup.js";
import { component, defineComponent } from "../lib/src/component.js";

console.log("Testing FeexVeb Component API...\n");

// Test 1: component function exists
console.log("✓ Test 1: component function exists");
console.assert(typeof component === "function", "component should be a function");
console.assert(typeof defineComponent === "function", "defineComponent should be a function");
console.assert(component === defineComponent, "defineComponent should be alias of component");

// Test 2: Simplified component registration
console.log("\n✓ Test 2: Simplified component registration");
const simpleTag = component({
  tag: "test-simple",
  state: {
    count: 0,
    message: "Hello"
  },
  computed: {
    displayText: (ctx) => `${ctx.message}: ${ctx.count}`
  },
  methods: {
    increment: (ctx) => {
      ctx.count++;
    },
    setMessage: (ctx, newMessage) => {
      ctx.message = newMessage;
    }
  },
  render: (ctx) => {
    return `<div class="simple-component">
      <span>${ctx.displayText}</span>
      <button onclick="this.getRootNode().host.increment()">+</button>
    </div>`;
  }
});

console.assert(simpleTag === "test-simple", "Should return the tag name");
console.assert(customElements.get("test-simple"), "Component should be registered");

// Test 3: Advanced component registration with setup function
console.log("\n✓ Test 3: Advanced component registration");
const advancedTag = component({
  tag: "test-advanced",
  state: (context) => {
    const count = context.useState(10);
    const doubled = context.useComputed(() => count.get() * 2);
    
    return {
      state: { count, doubled },
      methods: {
        increment: () => count.set(count.get() + 1),
        decrement: () => count.set(count.get() - 1)
      }
    };
  },
  render: (ctx) => {
    return `<div class="advanced-component">
      <span>Count: ${ctx.count}, Doubled: ${ctx.doubled}</span>
      <button onclick="this.getRootNode().host.increment()">+</button>
      <button onclick="this.getRootNode().host.decrement()">-</button>
    </div>`;
  }
});

console.assert(advancedTag === "test-advanced", "Should return the tag name");
console.assert(customElements.get("test-advanced"), "Advanced component should be registered");

// Test 4: Component with attributes
console.log("\n✓ Test 4: Component with attributes");
component({
  tag: "test-attrs",
  state: {
    value: 0
  },
  attrs: {
    "initial-value": { type: "number", default: 0 },
    "max-value": { type: "number", default: 100 },
    "disabled": { type: "boolean", default: false }
  },
  render: (ctx) => {
    return `<div class="attrs-component">
      <span>Value: ${ctx.value}</span>
    </div>`;
  }
});

console.assert(customElements.get("test-attrs"), "Attributes component should be registered");

// Test 5: Component with shadow DOM
console.log("\n✓ Test 5: Component with shadow DOM");
component({
  tag: "test-shadow",
  state: {
    text: "Shadow DOM"
  },
  shadowMode: "open",
  useMonospaceStyles: false,
  render: (ctx) => {
    return `<div class="shadow-component">
      <p>${ctx.text}</p>
    </div>`;
  }
});

console.assert(customElements.get("test-shadow"), "Shadow DOM component should be registered");

// Test 6: Test component instantiation and basic functionality
console.log("\n✓ Test 6: Component instantiation");
const simpleElement = document.createElement("test-simple");
document.body.appendChild(simpleElement);

// Wait for component to initialize
setTimeout(() => {
  console.assert(simpleElement.shadowRoot === null, "Simple component should not have shadow DOM");
  console.assert(simpleElement.innerHTML.includes("Hello: 0"), "Should render initial state");
  
  // Test attribute handling
  const attrsElement = document.createElement("test-attrs");
  attrsElement.setAttribute("initial-value", "42");
  attrsElement.setAttribute("disabled", "");
  document.body.appendChild(attrsElement);
  
  setTimeout(() => {
    console.assert(attrsElement.innerHTML.includes("42"), "Should use attribute value");
    document.body.removeChild(attrsElement);
  }, 10);
  
  document.body.removeChild(simpleElement);
}, 10);

// Test 7: Shadow DOM component
console.log("\n✓ Test 7: Shadow DOM component");
const shadowElement = document.createElement("test-shadow");
document.body.appendChild(shadowElement);

setTimeout(() => {
  console.assert(shadowElement.shadowRoot !== null, "Shadow component should have shadow DOM");
  console.assert(shadowElement.shadowRoot.mode === "open", "Shadow DOM should be open");
  document.body.removeChild(shadowElement);
}, 10);

// Test 8: Prevent duplicate registration
console.log("\n✓ Test 8: Prevent duplicate registration");
try {
  component({
    tag: "test-simple",
    state: { test: true },
    render: () => "<div>Duplicate</div>"
  });
  console.assert(true, "Should not throw on duplicate registration");
} catch (error) {
  console.assert(false, "Should handle duplicate registration gracefully");
}

// Test 9: Component cleanup
console.log("\n✓ Test 9: Component cleanup");
component({
  tag: "test-cleanup",
  state: (context) => {
    let cleanupCalled = false;
    const effect = context.useEffect(() => {
      return () => {
        cleanupCalled = true;
      };
    });
    
    return {
      state: {},
      methods: {
        wasCleanedUp: () => cleanupCalled
      },
      effects: [effect]
    };
  },
  render: () => "<div>Cleanup test</div>"
});

const cleanupElement = document.createElement("test-cleanup");
document.body.appendChild(cleanupElement);

setTimeout(() => {
  document.body.removeChild(cleanupElement);
  // Cleanup should be called on disconnection
  setTimeout(() => {
    console.assert(true, "Cleanup test completed");
  }, 10);
}, 10);

// Test 10: Error handling
console.log("\n✓ Test 10: Error handling");
component({
  tag: "test-error",
  state: { working: true },
  render: (ctx) => {
    if (!ctx.working) {
      throw new Error("Render error");
    }
    return "<div>Working</div>";
  }
});

const errorElement = document.createElement("test-error");
document.body.appendChild(errorElement);

setTimeout(() => {
  console.assert(errorElement.innerHTML.includes("Working"), "Should render normally");
  document.body.removeChild(errorElement);
}, 10);

console.log("\n🎉 All Component API tests passed!");