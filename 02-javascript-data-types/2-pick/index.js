/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
import {re} from "@babel/core/lib/vendor/import-meta-resolve";

export const pick = (obj, ...fields) => {
  let object = {};
  for (let str of fields) {
    for (let elem of Object.entries(obj)) {
      if (elem[0] === str) {
        object[elem[0]] = elem[1];
      }
    }
  }
  return object;
};
