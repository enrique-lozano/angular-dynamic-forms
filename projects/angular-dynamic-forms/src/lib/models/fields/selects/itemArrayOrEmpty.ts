/**
 * Returns an array containing the provided item or items if the
 * condition is true, otherwise an empty array
 *
 * @template T - The type of the item(s) in the array.
 * @param {T | T[]} item - The item or items to be included in the array.
 * @param {boolean} condition - The condition determining whether to include the item or items in the array.
 */
export function itemArrayOrEmpty<T>(item: T | T[], condition: boolean) {
  return condition ? (Array.isArray(item) ? item : [item]) : ([] as T[]);
}
