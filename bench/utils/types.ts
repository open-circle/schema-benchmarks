export type Compute<T> = { [K in keyof T]: T[K] } & unknown;
export type Satisfies<T extends U, U> = T;
export type StripIndexSignature<T> = {
	[K in keyof T as string extends K
		? never
		: number extends K
			? never
			: K]: T[K];
};
export type NonOptionalKeys<T> = {
	[K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

export type HasRequiredProps<T, True, False> = NonOptionalKeys<T> extends never
	? False
	: True;
