export interface Bounds {
  highest: number;
  lowest: number;
}

/**
 * Calculate a percentile value from an array of numbers.
 * @param values - Array of numbers (will be sorted internally)
 * @param percentile - Percentile to calculate (0-100)
 */
function getPercentile(
  values: ReadonlyArray<number>,
  percentile: number,
): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  const lowerValue = sorted[lower];
  const upperValue = sorted[upper];

  if (lowerValue === undefined || upperValue === undefined) return 0;
  if (lower === upper) return lowerValue;
  return lowerValue * (1 - weight) + upperValue * weight;
}

export interface BoundsOptions {
  /**
   * Use percentiles instead of absolute min/max to avoid outliers.
   * For example, { low: 0, high: 95 } will use min and 95th percentile.
   */
  percentiles?: { low: number; high: number };
}

export function getBounds(
  values: ReadonlyArray<number>,
  options?: BoundsOptions,
): Bounds {
  if (!values.length) return { highest: 0, lowest: 0 };

  if (options?.percentiles) {
    return {
      highest: getPercentile(values, options.percentiles.high),
      lowest: getPercentile(values, options.percentiles.low),
    };
  }

  return {
    highest: Math.max(...values),
    lowest: Math.min(...values),
  };
}

/**
 * Transform a value from the bounds to a number from 0 to 1.
 */
function getScaleNumber(value: number, bounds: Bounds) {
  if (value < bounds.lowest) return 0;
  if (value > bounds.highest) return 1;
  return (value - bounds.lowest) / (bounds.highest - bounds.lowest);
}

// biome-ignore-start lint/style/noNonNullAssertion: scale is finite and index is clamped
const getScalerFunction =
  <T>(ogScale: ReadonlyArray<T>) =>
  (value: number, bounds: Bounds, lowerBetter = false) => {
    const scale = lowerBetter ? [...ogScale].reverse() : ogScale;
    // if the bounds are the same, return the middle of the scale
    if (bounds.highest === bounds.lowest)
      return scale[Math.floor(scale.length / 2)]!;

    const scaleNumber = getScaleNumber(value, bounds);
    const index = Math.round(scaleNumber * (scale.length - 1));
    return scale[index]!;
  };
// biome-ignore-end lint/style/noNonNullAssertion: scale is finite and index is clamped

export const colorScale = [
  "var(--pink)",
  "var(--red)",
  "var(--deep-orange)",
  "var(--orange)",
  "var(--amber)",
  "var(--yellow)",
  "var(--lime)",
  "var(--light-green)",
  "var(--green)",
  "var(--teal)",
] as const;
export type ScaleColor = (typeof colorScale)[number];
export const getColor = getScalerFunction(colorScale);

const iconScale = [
  "sentiment_very_dissatisfied",
  "sentiment_dissatisfied",
  "sentiment_neutral",
  "sentiment_satisfied",
  "sentiment_very_satisfied",
] as const;

export const getIcon = getScalerFunction(iconScale);

const statScale = [
  "stat_minus_3",
  "stat_minus_2",
  "stat_minus_1",
  "stat_0",
  "stat_1",
  "stat_2",
  "stat_3",
] as const;

export const getStatIcon = getScalerFunction(statScale);
