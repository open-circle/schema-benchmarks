export type * from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function msToNs(ms: number) {
  return Math.round(ms * 10e6);
}

export const numFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

export const objectKeyCount = (obj: object) => Object.keys(obj).length;
export const isEmpty = (obj: object) =>
  Array.isArray(obj) ? obj.length === 0 : objectKeyCount(obj) === 0;

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
) {
  const results: [truthy: Array<T>, falsy: Array<T>] = [[], []];
  for (const value of array) {
    results[predicate(value) ? 0 : 1].push(value);
  }
  return results;
}
