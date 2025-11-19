export type Compute<T> = { [K in keyof T]: T[K] } & unknown;
export type Satisfies<T extends U, U> = T;
export type NonOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

export namespace NonReducible {
  export type String = string & {};
  // biome-ignore lint/complexity/noBannedTypes: Necessary for autocomplete
  export type Unknown = {} | null | undefined;
  export type PropertyKey = String | number | symbol;
}
export type LooseAutocomplete<
  KnownValues extends BaseType,
  BaseType = NonReducible.String,
> = KnownValues | BaseType;

export type HasRequiredProps<T, True, False> = NonOptionalKeys<T> extends never
  ? False
  : True;
export type DistributiveOmit<
  T,
  K extends LooseAutocomplete<keyof T, NonReducible.PropertyKey>,
> = T extends T ? Omit<T, K> : never;
