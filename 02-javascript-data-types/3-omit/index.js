/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let object = {};

  for (let elem of Object.entries(obj)) {
    if (!fields.includes(elem[0])) {
        object[elem[0]] = elem[1];
    }
  }
  return object;
};
