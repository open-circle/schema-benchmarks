export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function msToNs(ms: number) {
  return Math.round(ms * 10e6);
}

export const numFormatter = new Intl.NumberFormat(undefined);

export const objectKeyCount = (obj: object) => Object.keys(obj).length;
export const isEmpty = (obj: object) =>
  Array.isArray(obj) ? obj.length === 0 : objectKeyCount(obj) === 0;
export const firstNonEmpty = <K extends PropertyKey>(
  obj: Record<K, object>,
  keysOrder: ReadonlyArray<K>,
) => {
  for (const key of keysOrder) {
    if (!isEmpty(obj[key])) return key;
  }
};
