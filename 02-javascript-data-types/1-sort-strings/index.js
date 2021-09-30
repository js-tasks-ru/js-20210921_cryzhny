/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const collator = Intl.Collator(undefined, { caseFirst: 'upper' });
  const arrCopy = [...arr];
  const sorted = arrCopy.sort(
    (a,b) => param === 'asc' ? collator.compare(a, b) : collator.compare(b, a)
  );

  return sorted;
}
