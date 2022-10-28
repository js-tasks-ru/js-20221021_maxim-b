/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */

export const pick = (obj, ...fields) => {
  const object = {};
  for (const elem of Object.entries(obj)) {
    if (fields.includes(elem[0])) {
      object[elem[0]] = elem[1];
    }
  }
  return object;
};
