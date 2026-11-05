import "zod";
import "zod/mini";
interface SafeParseSuccess<T> {
  success: true;
  data: T;
}
interface SafeParseError {
  success: false;
  error: ZodErrorLike;
}
type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseError;
interface ZodIssueLike {
  code: string;
  path: (string | number)[];
  message: string;
  [key: string]: unknown;
}
interface ZodErrorLike {
  issues: ZodIssueLike[];
}
interface CompiledSchema<T> {
  parse(input: unknown): T;
  parseAsync(input: unknown): Promise<T>;
  safeParse(input: unknown): SafeParseResult<T>;
  safeParseAsync(input: unknown): Promise<SafeParseResult<T>>;
  /**
   * Zero-allocation boolean type guard. For schemas with a total Fast Path
   * (the common case — objects, primitives, arrays, enums without
   * coerce/default/catch/transform), this IS the compiled fast-check function:
   * one boolean expression, no result object, no issues array — the cheapest
   * possible "does this match?" check, on par with typia's `is<T>()`. Schemas
   * without a total Fast Path fall back to `safeParse(input).success`
   * (correct, still allocation-light). Narrows `input` to `T` on `true`.
   */
  is(input: unknown): input is T;
}
export { CompiledSchema as t };
//# sourceMappingURL=index-CalR2c7a.d.mts.map