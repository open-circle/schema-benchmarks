export function partition<T, U extends T>(
	array: readonly T[],
	predicate: (value: T) => value is U,
): [truthy: U[], falsy: Exclude<T, U>[]];
export function partition<T>(
	array: readonly T[],
	predicate: (value: T) => boolean,
): [truthy: T[], falsy: T[]];
export function partition<T>(
	array: readonly T[],
	predicate: (value: T) => boolean,
): [truthy: T[], falsy: T[]] {
	const results: [truthy: T[], falsy: T[]] = [[], []];
	for (const value of array) {
		results[predicate(value) ? 0 : 1].push(value);
	}
	return results;
}
