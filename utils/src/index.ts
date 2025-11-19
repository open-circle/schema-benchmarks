export type * from "./libs";
export * from "./react";
export type * from "./types";

import bemHelper from "react-bem-helper";

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

export const bem = bemHelper.withDefaults({ outputIsString: true });

export function getOrInsert<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  value: V,
): V;
export function getOrInsert<K, V>(map: Map<K, V>, key: K, value: V): V;
export function getOrInsert<K extends object, V>(
  map: Map<K, V> | WeakMap<K, V>,
  key: K,
  value: V,
): V {
  if (map.has(key)) return map.get(key) as V;

  return map.set(key, value).get(key) as V;
}

export function getOrInsertComputed<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  compute: (key: K) => V,
): V;
export function getOrInsertComputed<K, V>(
  map: Map<K, V>,
  key: K,
  compute: (key: K) => V,
): V;
export function getOrInsertComputed<K extends object, V>(
  map: Map<K, V> | WeakMap<K, V>,
  key: K,
  compute: (key: K) => V,
): V {
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

export const getDuration = (ms: number): Intl.DurationType => {
  if (ms < 1) {
    return { nanoseconds: Math.round(ms * 1000000) };
  }
  if (ms < 1_000) {
    return { milliseconds: Math.round(ms) };
  }
  if (ms < 60_000) {
    return { seconds: Math.round(ms / 1000) };
  }
  if (ms < 3_600_000) {
    return { minutes: Math.round(ms / 60000) };
  }
  return { hours: Math.round(ms / 3600000) };
};

export const promiseAllKeyed = async <T extends Record<string, unknown>>(
  keyed: T,
): Promise<{
  [K in keyof T]: Awaited<T[K]>;
}> =>
  Object.fromEntries(
    await Promise.all(
      unsafeEntries(keyed).map(async ([key, value]) => [key, await value]),
    ),
  );

/**
 * Sets an interval that is automatically cleared when the signal is aborted.
 * @param fn The function to call every `ms` milliseconds.
 * @param delay The number of milliseconds to wait between each call.
 * @param signal The abort signal to use.
 * @returns The interval ID.
 * @see {setInterval}
 */
export const setAbortableInterval = (
  fn: () => void,
  delay: number,
  signal: AbortSignal,
): ReturnType<typeof setInterval> => {
  const interval = setInterval(fn, delay);
  signal.addEventListener("abort", () => clearInterval(interval), {
    once: true,
    signal: AbortSignal.timeout(delay),
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
export const setAbortableTimeout = (
  fn: () => void,
  delay: number,
  signal: AbortSignal,
): ReturnType<typeof setTimeout> => {
  const timeout = setTimeout(fn, delay);
  signal.addEventListener("abort", () => clearTimeout(timeout), {
    once: true,
    signal: AbortSignal.timeout(delay),
  });
  return timeout;
};
