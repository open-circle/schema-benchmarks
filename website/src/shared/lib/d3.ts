import type * as d3 from "d3";

type Scale<Return> = (number: d3.NumberValue) => Return;

/**
 * Combine multiple scales into a single scale.
 * @param scales The scales to combine.
 * @returns A function that takes a number and returns an object with the same keys as the input scales.
 * @example
 * const scales = combineScales({
 *   color: d3.scaleQuantile(d3.extent(values), scales.color),
 *   icon: d3.scaleQuantile(d3.extent(values), scales.sentiment),
 * });
 * const result = scales(0.5); // { color: "var(--pink)", icon: "sentiment_very_dissatisfied" }
 */
export const combineScales =
  <T>(scales: {
    [K in keyof T]: Scale<T[K]>;
  }): Scale<T> =>
  (number) =>
    Object.fromEntries(
      Object.entries<Scale<unknown>>(scales).map(([key, scale]) => [key, scale(number)]),
    ) as T;

export const reverseIf = <T>(reverse: boolean, array: ReadonlyArray<T>) =>
  reverse ? array.toReversed() : array;
