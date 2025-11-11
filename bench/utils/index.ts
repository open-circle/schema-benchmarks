export function partition<T, U extends T>(
  array: ReadonlyArray<T>,
  predicate: (value: T) => value is U,
): [truthy: Array<U>, falsy: Array<Exclude<T, U>>];
export function partition<T>(
  array: ReadonlyArray<T>,
  predicate: (value: T) => boolean,
): [truthy: Array<T>, falsy: Array<T>];
export function partition<T>(
  array: ReadonlyArray<T>,
  predicate: (value: T) => boolean,
): [truthy: Array<T>, falsy: Array<T>] {
  const results: [truthy: Array<T>, falsy: Array<T>] = [[], []];
  for (const value of array) {
    results[predicate(value) ? 0 : 1].push(value);
  }
  return results;
}
