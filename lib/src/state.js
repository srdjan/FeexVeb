/**
 * @file Lightweight Reactive Signals - Inspired by mono-jsx but standalone
 * Simple reactive primitives that work with FeexVeb components
 */

// Track the current execution context for dependency tracking
let currentComputation = null;
let computationDepth = 0;

/**
 * Create a reactive signal
 * @param {*} initialValue - Initial value for the signal
 * @returns {Object} Signal object with get, set, and subscribe methods
 */
export function useState(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  const signal = {
    get() {
      // Track this signal as a dependency if we're in a computation
      if (currentComputation) {
        currentComputation.dependencies.add(signal);
        subscribers.add(currentComputation);
      }
      return value;
    },

    set(newValue) {
      if (typeof newValue === "function") {
        newValue = newValue(value);
      }

      if (newValue !== value) {
        value = newValue;

        // Notify all subscribers
        const toNotify = Array.from(subscribers);
        subscribers.clear();

        toNotify.forEach((computation) => {
          if (typeof computation === "function") {
            computation();
          } else if (computation.run) {
            computation.run();
          }
        });
      }
    },

    subscribe(callback) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
  };

  return signal;
}

/**
 * Create a computed signal that derives its value from other signals
 * @param {Function} computeFn - Function that computes the derived value
 * @returns {Object} Computed signal object
 */
export function useComputed(computeFn) {
  const dependencies = new Set();
  let cachedValue;
  let isStale = true;

  const computation = {
    dependencies,
    run() {
      isStale = true;
      // Re-run the computation
      getValue();
    },
  };

  function getValue() {
    if (isStale) {
      // Clear old dependencies
      dependencies.clear();

      // Set up dependency tracking
      const prevComputation = currentComputation;
      currentComputation = computation;
      computationDepth++;

      try {
        cachedValue = computeFn();
        isStale = false;
      } finally {
        computationDepth--;
        currentComputation = prevComputation;
      }
    }
    return cachedValue;
  }

  // Initial computation
  getValue();

  return {
    get: getValue,
    subscribe(callback) {
      // Subscribe to all dependencies
      const unsubscribers = Array.from(dependencies).map((dep) =>
        dep.subscribe ? dep.subscribe(callback) : () => {}
      );

      return () => unsubscribers.forEach((unsub) => unsub());
    },
  };
}

/**
 * Create a side effect that runs when dependencies change
 * @param {Function} effectFn - Effect function to run
 * @param {Array} deps - Optional dependency array
 * @returns {Function} Cleanup function
 */
export function useEffect(effectFn, deps = []) {
  let cleanup = null;
  let isFirstRun = true;

  function runEffect() {
    // Run cleanup from previous effect
    if (cleanup && typeof cleanup === "function") {
      cleanup();
    }

    // Run the effect
    cleanup = effectFn();
  }

  if (deps.length === 0) {
    // No dependencies - run once
    runEffect();
    return () => {
      if (cleanup && typeof cleanup === "function") {
        cleanup();
      }
    };
  }

  // Subscribe to dependencies
  const unsubscribers = deps.map((dep) => {
    if (dep && dep.subscribe) {
      return dep.subscribe(() => {
        if (!isFirstRun) {
          runEffect();
        }
      });
    }
    return () => {};
  });

  // Run initial effect
  runEffect();
  isFirstRun = false;

  // Return cleanup function
  return () => {
    unsubscribers.forEach((unsub) => unsub());
    if (cleanup && typeof cleanup === "function") {
      cleanup();
    }
  };
}

/**
 * Batch multiple signal updates together
 * @param {Function} fn - Function containing signal updates
 */
export function batch(fn) {
  // Simple implementation - in a real system this would batch updates
  fn();
}

/**
 * Alias for batch - often used for scheduling updates
 */
export const tick = batch;

/**
 * Utility to create multiple state signals from an object
 * @param {Object} stateObj - Object with initial state values
 * @returns {Object} Object with signal instances
 */
export function createStates(stateObj) {
  const states = {};
  Object.entries(stateObj).forEach(([key, value]) => {
    states[key] = useState(value);
  });
  return states;
}

/**
 * Utility to get current values from multiple signals
 * @param {Object} signals - Object containing signal instances
 * @returns {Object} Object with current signal values
 */
export function getValues(signals) {
  const values = {};
  Object.entries(signals).forEach(([key, signal]) => {
    values[key] = signal.get();
  });
  return values;
}
