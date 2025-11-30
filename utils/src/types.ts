import * as v from "valibot";

export type Compute<T> = { [K in keyof T]: T[K] } & unknown;
export type Satisfies<T extends U, U> = T;
export type NonOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];
export type Override<T, U> = Compute<Omit<T, keyof U> & U>;
export type WithRequired<T, K extends keyof T> = Compute<
  Omit<T, K> & Required<Pick<T, K>>
>;

export namespace LooseAutocomplete {
  export type String = string & {};
  // biome-ignore lint/complexity/noBannedTypes: Necessary for autocomplete
  export type Unknown = {} | null | undefined;
  export type PropertyKey = String | number | symbol;
}

/**
 * Accept anything assigable to the BaseType, but *suggest* using one of the KnownValues.
 * @example
 * function parse<TSchema extends v.GenericSchema>(schema: TSchema, input: LooseAutocomplete<v.InferInput<TSchema>, LooseAutocomplete.Unknown>) {}
 * parse(v.picklist(["foo", "bar"]), "") // accepts any value without type errors, but suggests "foo" or "bar"
 *
 * @example
 * function hasKey<T extends object>(obj: T, key: LooseAutocomplete<keyof T, LooseAutocomplete.PropertyKey>) {}
 * hasKey({ foo: 1, bar: 2 }, "foo") // accepts any value without type errors, but suggests "foo" or "bar"
 */
export type LooseAutocomplete<
  KnownValues extends BaseType,
  BaseType = LooseAutocomplete.String,
> = KnownValues | BaseType;

export type HasRequiredProps<T, True, False> = NonOptionalKeys<T> extends never
  ? False
  : True;
export type DistributiveOmit<
  T,
  K extends LooseAutocomplete<keyof T, LooseAutocomplete.PropertyKey>,
> = T extends T ? Omit<T, K> : never;

export type MaybeArray<T> = T | Array<T>;
