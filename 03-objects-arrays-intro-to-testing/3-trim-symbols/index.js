/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const stringArray = Array.from(string);
  if (size === 0) {
    return "";
  }
  if (!size) {
    return string;
  }
  let index = 1;
  let resultArray = [];
  for (let i = 0; i < stringArray.length; i++) {
    if (stringArray[i] === stringArray[i + 1]) {
      if (index++ < size) {
        resultArray.push(stringArray[i]);
      }
    } else {
      index = 1;
      resultArray.push(stringArray[i]);
    }

  }

  return resultArray.join("");
}
