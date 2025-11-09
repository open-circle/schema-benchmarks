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

/**
 * Get the color for a given value on the scale
 * @param value Value from 0 to 100, inclusive
 * @returns Color name
 */
export function getColor(value: number): ScaleColor {
	const index = clamp(Math.floor(value / 10), 0, colorScale.length - 1);
	// biome-ignore lint/style/noNonNullAssertion: We've clamped the index
	return colorScale[index]!;
}
