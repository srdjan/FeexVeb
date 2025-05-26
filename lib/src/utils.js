/**
 * @module utils
 * @description This module offers miscellaneous utility functions, primarily for working with HTML attributes.
 */

/**
 * Retrieves the value of an attribute from an HTML element.
 * If the attribute does not exist, it returns a specified default value.
 *
 * @param {HTMLElement} element - The HTML element from which to get the attribute.
 * @param {string} name - The name of the attribute to retrieve.
 * @param {*} [defaultValue=''] - The value to return if the attribute is not found on the element.
 * @returns {string} The value of the attribute, or the `defaultValue` if the attribute is not set.
 *                   Note: All attribute values are returned as strings.
 */
export const attr = (element, name, defaultValue = '') => {
  const value = element.getAttribute(name);
  return value !== null ? value : defaultValue;
};

/**
 * Retrieves the numeric value of an attribute from an HTML element.
 * It attempts to convert the attribute's string value to a number.
 * If the attribute does not exist or its value cannot be converted to a number,
 * it returns a specified default numeric value.
 *
 * @param {HTMLElement} element - The HTML element from which to get the numeric attribute.
 * @param {string} name - The name of the attribute to retrieve.
 * @param {number} [defaultValue=0] - The numeric value to return if the attribute is not found
 *                                    or if its value is not a valid number.
 * @returns {number} The numeric value of the attribute, or the `defaultValue`.
 */
export const numAttr = (element, name, defaultValue = 0) => {
  const value = element.getAttribute(name);
  if (value === null || value.trim() === '') {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};
