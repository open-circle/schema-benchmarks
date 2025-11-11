import { clamp } from "../utils";

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

interface Bounds {
	highest: number;
	lowest: number;
}

export function getBounds<T>(
	results: T[],
	getValue: (result: T) => number,
): Bounds {
	const values = results.map(getValue);
	return {
		highest: Math.max(...values),
		lowest: Math.min(...values),
	};
}

/**
 * Get the color for a given value on the scale
 * @param value Value from bounds.lowest to bounds.highest, inclusive
 * @param bounds Bounds of the scale (lowest and highest)
 * @returns Color name
 */
export function getColor(
	value: number,
	{ highest, lowest }: Bounds,
	reverse = false,
): ScaleColor {
	// biome-ignore lint/style/noNonNullAssertion: will always be defined
	if (highest === lowest) return reverse ? colorScale.at(-1)! : colorScale[0];
	const scaleNumber = ((value - lowest) / (highest - lowest)) * 10;
	let index = clamp(Math.floor(scaleNumber), 0, colorScale.length - 1);
	if (reverse) index = colorScale.length - 1 - index;
	// biome-ignore lint/style/noNonNullAssertion: We've clamped the index
	return colorScale[index]!;
}
