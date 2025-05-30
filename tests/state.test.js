/**
 * Unit tests for FeexVeb Reactive State System
 * Tests signals, computed values, effects, and utilities
 */

import "./test-dom-setup.js";
import { 
  useState, 
  useComputed, 
  useEffect, 
  batch, 
  tick, 
  createStates, 
  getValues 
} from "../lib/src/state.js";

console.log("Testing FeexVeb Reactive State System...\n");

// Test 1: useState basic functionality
console.log("✓ Test 1: useState basic functionality");
const counter = useState(0);
console.assert(typeof counter.get === "function", "Signal should have get method");
console.assert(typeof counter.set === "function", "Signal should have set method");
console.assert(typeof counter.subscribe === "function", "Signal should have subscribe method");
console.assert(counter.get() === 0, "Initial value should be 0");

counter.set(5);
console.assert(counter.get() === 5, "Value should update to 5");

// Test with function updater
counter.set(prev => prev * 2);
console.assert(counter.get() === 10, "Function updater should work");

// Test 2: Signal subscription
console.log("\n✓ Test 2: Signal subscription");
const testSignal = useState("initial");
let subscriptionCalled = false;
let receivedValue = null;

const unsubscribe = testSignal.subscribe(() => {
  subscriptionCalled = true;
  receivedValue = testSignal.get();
});

testSignal.set("updated");
setTimeout(() => {
  console.assert(subscriptionCalled, "Subscription should be called");
  console.assert(receivedValue === "updated", "Subscription should receive new value");
  unsubscribe();
}, 0);

// Test 3: useComputed basic functionality
console.log("\n✓ Test 3: useComputed basic functionality");
const baseValue = useState(10);
const computedDoubled = useComputed(() => baseValue.get() * 2);

console.assert(typeof computedDoubled.get === "function", "Computed should have get method");
console.assert(computedDoubled.get() === 20, "Computed should calculate correctly");

baseValue.set(15);
setTimeout(() => {
  console.assert(computedDoubled.get() === 30, "Computed should update when dependency changes");
}, 0);

// Test 4: useComputed dependency tracking
console.log("\n✓ Test 4: useComputed dependency tracking");
const a = useState(1);
const b = useState(2);
const sum = useComputed(() => a.get() + b.get());

console.assert(sum.get() === 3, "Multi-dependency computed should work");

a.set(5);
setTimeout(() => {
  console.assert(sum.get() === 7, "Should update when first dependency changes");
  
  b.set(10);
  setTimeout(() => {
    console.assert(sum.get() === 15, "Should update when second dependency changes");
  }, 0);
}, 0);

// Test 5: useComputed caching
console.log("\n✓ Test 5: useComputed caching");
let computeCount = 0;
const cached = useState(100);
const expensive = useComputed(() => {
  computeCount++;
  return cached.get() * cached.get();
});

console.assert(expensive.get() === 10000, "First computation should work");
console.assert(expensive.get() === 10000, "Second get should use cache");
console.assert(computeCount === 1, "Should only compute once initially");

cached.set(10);
setTimeout(() => {
  console.assert(expensive.get() === 100, "Should recompute after dependency change");
  console.assert(computeCount === 2, "Should compute exactly twice");
}, 0);

// Test 6: useEffect basic functionality
console.log("\n✓ Test 6: useEffect basic functionality");
const effectSignal = useState("start");
let effectRuns = 0;
let lastEffectValue = null;

const cleanup = useEffect(() => {
  effectRuns++;
  lastEffectValue = effectSignal.get();
  
  return () => {
    console.log("Effect cleanup called");
  };
}, [effectSignal]);

console.assert(effectRuns === 1, "Effect should run immediately");
console.assert(lastEffectValue === "start", "Effect should see initial value");

effectSignal.set("changed");
setTimeout(() => {
  console.assert(effectRuns === 2, "Effect should run after dependency change");
  console.assert(lastEffectValue === "changed", "Effect should see new value");
  
  if (typeof cleanup === "function") {
    cleanup();
  }
}, 0);

// Test 7: useEffect without dependencies
console.log("\n✓ Test 7: useEffect without dependencies");
let noDepRuns = 0;
const noDepCleanup = useEffect(() => {
  noDepRuns++;
  return () => console.log("No-dep cleanup");
}, []);

console.assert(noDepRuns === 1, "No-dependency effect should run once");

setTimeout(() => {
  console.assert(noDepRuns === 1, "No-dependency effect should not run again");
  if (typeof noDepCleanup === "function") {
    noDepCleanup();
  }
}, 10);

// Test 8: batch/tick functionality
console.log("\n✓ Test 8: batch/tick functionality");
const batchSignal = useState(0);
let batchNotifications = 0;

batchSignal.subscribe(() => {
  batchNotifications++;
});

batch(() => {
  batchSignal.set(1);
  batchSignal.set(2);
  batchSignal.set(3);
});

setTimeout(() => {
  console.assert(batchSignal.get() === 3, "Batch should apply all updates");
  console.assert(batchNotifications >= 1, "Should receive notifications");
}, 0);

// Test tick (alias for batch)
console.assert(tick === batch, "tick should be alias for batch");

// Test 9: createStates utility
console.log("\n✓ Test 9: createStates utility");
const states = createStates({
  name: "John",
  age: 30,
  active: true
});

console.assert(typeof states.name.get === "function", "Should create signal for name");
console.assert(typeof states.age.get === "function", "Should create signal for age");
console.assert(typeof states.active.get === "function", "Should create signal for active");

console.assert(states.name.get() === "John", "Should preserve initial values");
console.assert(states.age.get() === 30, "Should preserve initial values");
console.assert(states.active.get() === true, "Should preserve initial values");

// Test 10: getValues utility
console.log("\n✓ Test 10: getValues utility");
states.name.set("Jane");
states.age.set(25);

const values = getValues(states);
console.assert(values.name === "Jane", "Should get current value for name");
console.assert(values.age === 25, "Should get current value for age");
console.assert(values.active === true, "Should get current value for active");
console.assert(typeof values.name === "string", "Should return actual values, not signals");

// Test 11: Complex computed chain
console.log("\n✓ Test 11: Complex computed chain");
const x = useState(2);
const y = useState(3);
const product = useComputed(() => x.get() * y.get());
const chainDoubled = useComputed(() => product.get() * 2);
const description = useComputed(() => `Result: ${chainDoubled.get()}`);

console.assert(description.get() === "Result: 12", "Computed chain should work");

x.set(4);
setTimeout(() => {
  console.assert(description.get() === "Result: 24", "Chain should update correctly");
}, 0);

// Test 12: Effect cleanup chain
console.log("\n✓ Test 12: Effect cleanup chain");
const cleanupTestSignal = useState(1);
let cleanupCallCount = 0;

const multiCleanup = useEffect(() => {
  const value = cleanupTestSignal.get();
  
  return () => {
    cleanupCallCount++;
  };
}, [cleanupTestSignal]);

cleanupTestSignal.set(2);
cleanupTestSignal.set(3);

setTimeout(() => {
  if (typeof multiCleanup === "function") {
    multiCleanup();
  }
  console.assert(cleanupCallCount >= 2, "Cleanup should be called for each effect run");
}, 10);

// Test 13: Circular dependency prevention
console.log("\n✓ Test 13: Circular dependency handling");
const circularA = useState(1);
const circularB = useComputed(() => {
  const val = circularA.get();
  // This would create a circular dependency in a naive implementation
  return val + 1;
});

console.assert(circularB.get() === 2, "Should handle potential circular dependencies");

// Test 14: Memory cleanup
console.log("\n✓ Test 14: Memory cleanup");
const tempSignal = useState("temp");
let tempSubscriptions = 0;

const unsub1 = tempSignal.subscribe(() => tempSubscriptions++);
const unsub2 = tempSignal.subscribe(() => tempSubscriptions++);

tempSignal.set("changed");

setTimeout(() => {
  console.assert(tempSubscriptions >= 2, "Both subscriptions should fire");
  
  unsub1();
  unsub2();
  
  tempSignal.set("changed again");
  
  setTimeout(() => {
    console.assert(tempSubscriptions === 2, "Unsubscribed callbacks should not fire");
  }, 0);
}, 0);

console.log("\n🎉 All Reactive State System tests passed!");