/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const setArr = new Set(arr);
  const result = [];

  for (let item of setArr) {
    result.push(item);
  }
  return result;
}
