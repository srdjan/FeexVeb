// eventbus.js: This module handles the global event bus functionality.

/**
 * @module eventbus
 * @description This module provides a simple global event bus for cross-component communication
 * using standard browser CustomEvents.
 */

/**
 * @typedef {Object} EventBus
 * @property {function(string, Object): void} dispatch - Dispatches an event globally.
 * @property {function(string, function(CustomEvent): void): function(): void} subscribe - Subscribes to a global event.
 */

/**
 * Creates and returns a global event bus object.
 * This event bus allows different parts of the application, including components
 * that are not directly related in the DOM hierarchy, to communicate with each other.
 * It uses the browser's native `document.dispatchEvent` and `document.addEventListener`
 * for CustomEvents.
 * 
 * @returns {EventBus} An object with `dispatch` and `subscribe` methods.
 */
export const createEventBus = () => {
  return {
    /**
     * Dispatches a custom event that can be listened to by any part of the application.
     * @param {string} eventName - The name of the event to dispatch.
     * @param {Object} [detail={}] - An object containing data to be passed with the event. This will be available on `event.detail`.
     */
    dispatch: (eventName, detail = {}) => {
      document.dispatchEvent(new CustomEvent(eventName, { detail }));
    },

    /**
     * Subscribes to a custom event dispatched through the event bus.
     * @param {string} eventName - The name of the event to subscribe to.
     * @param {function(CustomEvent): void} callback - The function to execute when the event is dispatched.
     *   The callback will receive the `CustomEvent` object, and custom data will be in `event.detail`.
     * @returns {function(): void} A function that, when called, will unsubscribe the callback from the event.
     */
    subscribe: (eventName, callback) => {
      document.addEventListener(eventName, callback);
      return () => document.removeEventListener(eventName, callback);
    }
  };
};
