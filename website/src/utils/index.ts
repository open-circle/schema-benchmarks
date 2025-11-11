export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function msToNs(ms: number) {
	return Math.round(ms * 10e6);
}

export const numFormatter = new Intl.NumberFormat(undefined);
