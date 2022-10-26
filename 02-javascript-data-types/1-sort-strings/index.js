/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];
  arrCopy.sort(function (a, b) {
    if (param === 'asc') {
      if (a.slice(0, 1) !== b.slice(0, 1) && a.slice(0, 1).toLowerCase() === b.slice(0, 1).toLowerCase()) {
        return 1;
      }
      return a.localeCompare(b);
    } else {
      if (a.slice(0, 1) !== b.slice(0, 1) && a.slice(0, 1).toLowerCase() === b.slice(0, 1).toLowerCase()) {
        return 1;
      }
      return b.localeCompare(a);
    }
  });
  return arrCopy;
}
