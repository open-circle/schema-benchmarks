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
  /**
   * Accept anything assigable to `string`, but *suggest* using one of the KnownValues.
   * @example
   * function parseString<TSchema extends v.GenericSchema<string>>(schema: TSchema, input: LooseAutocomplete.String<v.InferInput<TSchema>>) {}
   * parseString(v.picklist(["foo", "bar"]), "") // accepts any value without type errors, but suggests "foo" or "bar"
   */
  export type String<KnownValues extends string> = KnownValues | (string & {});
  /**
   * Accept anything assigable to `unknown`, but *suggest* using one of the KnownValues.
   * @example
   * function parse<TSchema extends v.GenericSchema>(schema: TSchema, input: LooseAutocomplete.Unknown<v.InferInput<TSchema>>) {}
   * parse(v.picklist(["foo", "bar"]), "") // accepts any value without type errors, but suggests "foo" or "bar"
   */
  export type Unknown<KnownValues> =
    | KnownValues
    // biome-ignore lint/complexity/noBannedTypes: Necessary for autocomplete
    | {}
    | null
    | undefined;
  /**
   * Accept anything assigable to `PropertyKey`, but *suggest* using one of the KnownValues.
   * @example
   * function hasKey<T extends object>(obj: T, key: LooseAutocomplete.PropertyKey<keyof T>) {}
   * hasKey({ foo: 1, bar: 2 }, "foo") // accepts any value without type errors, but suggests "foo" or "bar"
   */
  export type PropertyKey<KnownValues extends string | number | symbol> =
    | KnownValues
    | (string & {})
    | number
    | symbol;
}

export type HasRequiredProps<T, True, False> = NonOptionalKeys<T> extends never
  ? False
  : True;
export type DistributiveOmit<
  T,
  K extends LooseAutocomplete.PropertyKey<keyof T>,
> = T extends T ? Omit<T, K> : never;

export type MaybeArray<T> = T | Array<T>;
