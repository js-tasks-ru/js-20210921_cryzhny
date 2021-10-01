/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArr = path.split('.');

  return function a(obj) {
    const prop = pathArr[0];
    if (typeof obj[pathArr[0]] !== 'object') {
      return obj[pathArr[0]]
    }

    pathArr.shift();
    return a(obj[prop]);
  }
}
