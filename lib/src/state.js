/**
 * @module state
 * @description This module provides functions for state management within FeexVeb applications,
 * including reactive states, computed states, and side effects.
 */

/**
 * @typedef {Object} StateObject
 * @property {Function} get - Returns the current value of the state.
 * @property {Function} set - Sets a new value for the state. Can accept a direct value or a function that receives the previous value and returns the new value.
 * @property {Function} subscribe - Registers a callback function to be executed whenever the state changes. Returns an unsubscribe function.
 */

/**
 * Creates a reactive state variable. When the state's value changes,
 * all subscribed components or effects are notified.
 *
 * @param {*} initialValue - The initial value of the state.
 * @returns {StateObject} An object with `get`, `set`, and `subscribe` methods to interact with the state.
 */
export const useState = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  return {
    /**
     * Gets the current value of the state.
     * @returns {*} The current state value.
     */
    get: () => value,

    /**
     * Sets a new value for the state.
     * Notifies all subscribers if the value changes.
     * @param {(*|function(*): *)} newValue - The new value or a function that takes the previous value and returns the new value.
     */
    set: (newValue) => {
      const actualNewValue = typeof newValue === 'function' ? newValue(value) : newValue;
      if (value === actualNewValue) return;
      value = actualNewValue;
      subscribers.forEach(fn => fn(value));
    },

    /**
     * Subscribes to state changes.
     * @param {function(*): void} callback - The function to call when the state changes. It receives the new state value.
     * @returns {function(): void} A function to unsubscribe the callback.
     */
    subscribe: (callback) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    }
  };
};

/**
 * @typedef {Object} ComputedStateObject
 * @property {Function} get - Returns the current value of the computed state.
 * @property {Function} subscribe - Registers a callback function to be executed whenever the computed state changes. Returns an unsubscribe function.
 */

/**
 * Creates a computed state that derives its value from other state dependencies.
 * The computed value is automatically updated when any of its dependencies change.
 *
 * @param {Function} computeFn - A function that calculates the value of the computed state. It receives no arguments.
 * @param {Array<StateObject|ComputedStateObject>} dependencies - An array of state objects (`useState` or `useComputed` results) that this computed state depends on.
 * @returns {ComputedStateObject} An object with `get` and `subscribe` methods. Note: `set` is not available for computed states.
 */
export const useComputed = (computeFn, dependencies) => {
  const state = useState(computeFn());

  // Subscribe to all dependencies
  dependencies.forEach(dep => {
    if (dep && typeof dep.subscribe === 'function') {
      dep.subscribe(() => state.set(computeFn()));
    } else {
      console.warn('A dependency provided to useComputed is not a valid state object with a subscribe method.');
    }
  });


  return {
    get: state.get,
    subscribe: state.subscribe
  };
};

/**
 * Registers a side effect function to run after component render and when specified dependencies change.
 *
 * @param {Function} effectFn - The function to run as a side effect. This function can optionally
 * return a cleanup function. The cleanup function will be executed before the effect runs again
 * or when the component is unmounted/effect is re-run.
 * @param {Array<StateObject|ComputedStateObject>} dependencies - An array of state objects. The `effectFn` will re-run
 * only if any of these dependencies' values change. If an empty array `[]` is provided,
 * the effect runs once after the initial render and the cleanup runs on unmount.
 * If no array is provided (or `null`/`undefined`), the effect runs after every render.
 * @returns {Function} A cleanup function that, when called, will execute the last returned
 * cleanup logic from `effectFn` and remove all internal subscriptions for this effect. This is useful
 * for manual cleanup if the effect is managed outside a component lifecycle.
 */
export const useEffect = (effectFn, dependencies) => {
  let cleanup;

  const runEffect = () => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
    cleanup = effectFn();
  };

  if (Array.isArray(dependencies)) {
    if (dependencies.length === 0) {
      cleanup = effectFn();
    } else {
      runEffect();
      const unsubscribes = dependencies.map(dep => {
        if (dep && typeof dep.subscribe === 'function') {
          return dep.subscribe(runEffect);
        }
        console.warn('A dependency provided to useEffect is not a valid state object with a subscribe method.');
        return () => { };
      });

      return () => {
        unsubscribes.forEach(unsub => unsub());
        if (typeof cleanup === 'function') {
          cleanup();
        }
      };
    }
  } else {
    // No dependency array: run after every render (or when subscriptions trigger if used externally)
    runEffect();
  }
  return () => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
  };
};
