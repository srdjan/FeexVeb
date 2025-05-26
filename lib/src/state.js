/**
 * @module state
 * @description This module provides functions for state management within FeexVeb applications,
 * including reactive states, computed states, and side effects. Built on top of Maverick.js Signals.
 */

import { signal, computed, effect, tick } from '@maverick-js/signals';

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
  const $signal = signal(initialValue);

  return {
    /**
     * Gets the current value of the state.
     * @returns {*} The current state value.
     */
    get: () => $signal(),

    /**
     * Sets a new value for the state.
     * Notifies all subscribers if the value changes.
     * @param {(*|function(*): *)} newValue - The new value or a function that takes the previous value and returns the new value.
     */
    set: (newValue) => {
      const actualNewValue = typeof newValue === 'function' ? newValue($signal()) : newValue;
      $signal.set(actualNewValue);
      // Flush updates synchronously to maintain FeexVeb's immediate update behavior
      tick();
    },

    /**
     * Subscribes to state changes.
     * @param {function(*): void} callback - The function to call when the state changes. It receives the new state value.
     * @returns {function(): void} A function to unsubscribe the callback.
     */
    subscribe: (callback) => {
      const stopEffect = effect(() => {
        const value = $signal();
        callback(value);
      });
      return stopEffect;
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
export const useComputed = (computeFn, _dependencies) => {
  // Create a computed signal that automatically tracks dependencies
  // Note: Maverick.js Signals automatically tracks dependencies, so the dependencies parameter is ignored
  const $computed = computed(() => {
    // Call the compute function which will automatically track any signals it reads
    return computeFn();
  });

  return {
    /**
     * Gets the current value of the computed state.
     * @returns {*} The current computed value.
     */
    get: () => $computed(),

    /**
     * Subscribes to computed state changes.
     * @param {function(*): void} callback - The function to call when the computed state changes. It receives the new computed value.
     * @returns {function(): void} A function to unsubscribe the callback.
     */
    subscribe: (callback) => {
      const stopEffect = effect(() => {
        const value = $computed();
        callback(value);
      });
      return stopEffect;
    }
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
  if (Array.isArray(dependencies) && dependencies.length === 0) {
    // Run once - no dependencies
    const cleanup = effectFn();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }

  // Use Maverick.js effect which automatically tracks dependencies
  // Note: dependencies parameter is ignored as Maverick.js automatically tracks signal reads
  const stopEffect = effect(() => {
    const cleanup = effectFn();

    // Return cleanup function to be called when effect re-runs or is disposed
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  });

  return stopEffect;
};
