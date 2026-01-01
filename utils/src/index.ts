export type * from "./libs.ts";
export type * from "./types.ts";

// Polyfill because Netlify is using Node v22
import "@formatjs/intl-durationformat/polyfill.js";
import "@formatjs/intl-numberformat/polyfill.js";
import "@formatjs/intl-numberformat/locale-data/en.js";

import type { WithPartial } from "./types.ts";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function msToNs(ms: number) {
  return Math.round(ms * 10e6);
}

export const numFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

export const unsafeKeys: <T extends object>(obj: T) => Array<keyof T> =
  Object.keys;
export const unsafeEntries: <T extends object>(
  obj: T,
) => Array<[keyof T, T[keyof T]]> = Object.entries;
export const unsafeFromEntries: <
  const TEntries extends ReadonlyArray<readonly [PropertyKey, unknown]>,
>(
  entries: TEntries,
) => {
  -readonly [TEntry in TEntries[number] as TEntry[0]]: TEntry[1];
} = Object.fromEntries;

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

export function getOrInsert<K extends object, V>(
  map: WeakMap<K, V>,
  key: NoInfer<K>,
  value: NoInfer<V>,
): NoInfer<V>;
export function getOrInsert<K, V>(
  map: Map<K, V>,
  key: NoInfer<K>,
  value: NoInfer<V>,
): NoInfer<V>;
export function getOrInsert<K extends object, V>(
  map: Map<K, V> | WeakMap<K, V>,
  key: NoInfer<K>,
  value: NoInfer<V>,
): NoInfer<V> {
  if (map.has(key)) return map.get(key) as V;

  return map.set(key, value).get(key) as V;
}

export function getOrInsertComputed<K extends object, V>(
  map: WeakMap<K, V>,
  key: NoInfer<K>,
  compute: (key: K) => NoInfer<V>,
): NoInfer<V>;
export function getOrInsertComputed<K, V>(
  map: Map<K, V>,
  key: NoInfer<K>,
  compute: (key: K) => NoInfer<V>,
): NoInfer<V>;
export function getOrInsertComputed<K extends object, V>(
  map: Map<K, V> | WeakMap<K, V>,
  key: NoInfer<K>,
  compute: (key: K) => NoInfer<V>,
): NoInfer<V> {
  if (map.has(key)) return map.get(key) as V;

  return map.set(key, compute(key)).get(key) as V;
}

const byteUnits = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
export function formatBytes(bytes: number, formatter = numFormatter) {
  if (bytes < 1) return "0 B";
  const unit = Math.floor(Math.log2(bytes) / 10);
  return `${formatter.format(bytes / 2 ** (10 * unit))} ${byteUnits[unit]}`;
}

export const durationFormatter = new Intl.DurationFormat();

const units: Array<[threshold: number, Intl.DurationTimeFormatUnit]> = [
  [3_600_000, "hours"],
  [60_000, "minutes"],
  [1_000, "seconds"],
  [1, "milliseconds"],
  [0.001, "microseconds"],
  // fallback to nanoseconds
];

export const getDuration = (ms: number): Intl.DurationType => {
  for (const [threshold, unit] of units) {
    if (ms >= threshold) return { [unit]: Math.round(ms / threshold) };
  }
  return { nanoseconds: Math.round(ms * 1_000_000) };
};

const enumerableKeys = <T extends object>(obj: T) =>
  Reflect.ownKeys(obj).filter(
    (key) => Object.getOwnPropertyDescriptor(obj, key)?.enumerable,
  );

export const promiseAllKeyed = async <T extends Record<PropertyKey, unknown>>(
  keyed: T,
): Promise<{
  [K in keyof T]: Awaited<T[K]>;
}> =>
  unsafeFromEntries(
    await Promise.all(
      enumerableKeys(keyed).map(async (key) => [key, await keyed[key]]),
    ),
  ) as never;

export const promiseAllSettledKeyed = async <
  T extends Record<PropertyKey, unknown>,
>(
  keyed: T,
): Promise<{
  [K in keyof T]: PromiseSettledResult<Awaited<T[K]>>;
}> => {
  const keys = enumerableKeys(keyed);
  const results = await Promise.allSettled(keys.map((key) => keyed[key]));
  return unsafeFromEntries(
    // biome-ignore lint/style/noNonNullAssertion: we know the keys are there
    results.map((result, i) => [keys[i]!, result]),
  ) as never;
};

/**
 * Sets an interval that is automatically cleared when the signal is aborted.
 * @param fn The function to call every `ms` milliseconds.
 * @param delay The number of milliseconds to wait between each call.
 * @param signal The abort signal to use.
 * @returns The interval ID.
 * @see {setInterval}
 */

// biome-ignore lint/suspicious/noExplicitAny: contravariant
export const setAbortableInterval = <TArgs extends Array<any>>(
  fn: (...args: TArgs) => void,
  delay: number,
  signal: AbortSignal,
  ...args: TArgs
): ReturnType<typeof setInterval> => {
  const interval = setInterval(fn, delay, ...args);
  signal.addEventListener("abort", () => clearInterval(interval), {
    once: true,
  });
  return interval;
};

/**
 * Sets a timeout that is automatically cleared when the signal is aborted.
 * @param fn The function to call after the timeout.
 * @param delay The number of milliseconds to wait before calling the function.
 * @param signal The abort signal to use.
 * @returns The timeout ID.
 * @see {setTimeout}
 */
// biome-ignore lint/suspicious/noExplicitAny: contravariant
export const setAbortableTimeout = <TArgs extends Array<any>>(
  fn: (...args: TArgs) => void,
  delay: number,
  signal: AbortSignal,
  ...args: TArgs
): ReturnType<typeof setTimeout> => {
  const timeout = setTimeout(fn, delay, ...args);
  signal.addEventListener("abort", () => clearTimeout(timeout), {
    once: true,
    signal: AbortSignal.timeout(delay),
  });
  return timeout;
};

export type TupleOfLength<
  T,
  N extends number,
  Acc extends Array<T> = [],
> = Acc["length"] extends N ? Acc : TupleOfLength<T, N, [T, ...Acc]>;

export function hasLength<T, N extends number>(
  array: Array<T>,
  length: N,
): array is TupleOfLength<T, N> {
  return array.length === length;
}

export type TupleOfAtLeast<T, N extends number> = TupleOfLength<T, N> &
  Array<T>;

export function hasAtLeast<T, N extends number>(
  array: Array<T>,
  length: N,
): array is TupleOfAtLeast<T, N> {
  return array.length >= length;
}
export default function isPlainObject(obj: unknown): obj is object {
  if (typeof obj !== "object" || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return (
    Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null
  );
}

export function serialize(value: unknown): string {
  return JSON.stringify(value, (_key, value) => {
    if (typeof value === "bigint") return { $bigint: value.toString() };
    // sort the object keys before serialization, so { a: 1, b: 2 } === { b: 2, a: 1 }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).sort(([a], [b]) => a.localeCompare(b)),
      );
    }
    return value;
  });
}

export const ensureArray = <T>(value: T) =>
  (Array.isArray(value) ? value : [value]) as T extends ReadonlyArray<unknown>
    ? T
    : Array<T>;

export const anyAbortSignal = (...signals: Array<AbortSignal | undefined>) =>
  AbortSignal.any(signals.filter((s) => !!s));

export function toggleFilter<K extends string, const V extends string>(
  key: K,
  newValue: V,
  defaultValue: V,
): <T extends Record<K, V>>(filter: T) => T;
export function toggleFilter<K extends string, const V extends string>(
  key: K,
  newValue: V,
  defaultValue?: V,
): <T extends Partial<Record<K, V>>>(filter: T) => WithPartial<T, K>;
export function toggleFilter(
  key: string,
  newValue: unknown,
  defaultValue?: unknown,
) {
  return (filter: Record<string, unknown>) => ({
    ...filter,
    [key]: filter[key] === newValue ? defaultValue : newValue,
  });
}

/**
 * Filter an array of objects by a set of key-value pairs.
 * @param filter The key-value pairs to filter by.
 * @returns A function that takes an object and returns true if it matches the filter.
 * @example
 * const array = [{ a: 1, b: 2 }, { a: 1, b: 3 }, { a: 2, b: 2 }];
 * const result = array.filter(shallowFilter({ a: [1, 2], b: 2 }));
 * // [{ a: 1, b: 2 }, { a: 2, b: 2 }]
 */
export function shallowFilter<T>(
  filter: {
    [K in keyof T]?: T[K] | ReadonlyArray<T[K]> | Set<T[K]>;
  },
): (item: T) => boolean {
  const entries = unsafeEntries(filter).map(
    ([key, value]) =>
      [key, Array.isArray(value) ? new Set(value) : value] as const,
  );
  return (item) => {
    for (const [key, value] of entries) {
      if (value === undefined) continue;
      if (value instanceof Set) {
        if (!value.has(item[key])) return false;
      } else if (item[key] !== value) return false;
    }
    return true;
  };
}

export function getTransitionName(
  prefix: string,
  values: Record<string, unknown>,
) {
  let name = prefix;
  for (const [key, value] of Object.entries(values)) {
    name += `-${key}-${value ?? ""}`;
  }
  return name.replace(/[^a-zA-Z0-9]/g, "-");
}
