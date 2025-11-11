import { clamp } from "../utils";

export interface Bounds {
	highest: number;
	lowest: number;
}

export function getBounds(values: readonly number[]): Bounds {
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
	if (bounds.highest === bounds.lowest) return 0;
	if (value < bounds.lowest) return 0;
	if (value > bounds.highest) return 1;
	return (value - bounds.lowest) / (bounds.highest - bounds.lowest);
}

const getScalerFunction =
	<T>(scale: readonly T[]) =>
	(value: number, bounds: Bounds, reverse = false) => {
		let index = clamp(
			Math.floor(getScaleNumber(value, bounds) * scale.length),
			0,
			scale.length - 1,
		);
		if (reverse) index = scale.length - 1 - index;
		// biome-ignore lint/style/noNonNullAssertion: We've clamped the index
		return scale[index]!;
	};

const colorScale = [
	"pink", // 0-9
	"red", // 10-19
	"deep-orange", // 20-29
	"orange", // 30-39
	"amber", // 40-49
	"yellow", // 50-59
	"lime", // 60-69
	"light-green", // 70-79
	"green", // 80-89
	"teal", // 90-100
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
