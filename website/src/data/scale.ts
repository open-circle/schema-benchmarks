export interface Bounds {
  highest: number;
  lowest: number;
}

export function getBounds(values: ReadonlyArray<number>): Bounds {
  if (!values.length) return { highest: 0, lowest: 0 };
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
  (value: number, bounds: Bounds, reverse = false) => {
    const scale = reverse ? [...ogScale].reverse() : ogScale;
    // if the bounds are the same, return the middle of the scale
    if (bounds.highest === bounds.lowest)
      return scale[Math.floor(scale.length / 2)]!;

    const scaleNumber = getScaleNumber(value, bounds);
    const index = Math.round(scaleNumber * (scale.length - 1));
    return scale[index]!;
  };
// biome-ignore-end lint/style/noNonNullAssertion: scale is finite and index is clamped

const colorScale = [
  "pink",
  "red",
  "deep-orange",
  "orange",
  "amber",
  "yellow",
  "lime",
  "light-green",
  "green",
  "teal",
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
