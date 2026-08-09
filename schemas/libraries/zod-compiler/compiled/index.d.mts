import * as z from "zod";
//#region ../node_modules/.pnpm/zod-compiler@1.23.8_esbuild@0.28.1_rolldown@1.2.3_rollup@4.62.2_vite@8.2.0_@types+node@_7ddaf82a813b11a942b0748cec96a183/node_modules/zod-compiler/dist/core/types.d.ts
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
//#endregion
//#region libraries/zod-compiler/index.d.ts
declare const compiledProductSchema: z.ZodObject<{
  id: z.ZodNumber;
  created: z.ZodDate;
  title: z.ZodString;
  brand: z.ZodString;
  description: z.ZodString;
  price: z.ZodNumber;
  discount: z.ZodNullable<z.ZodNumber>;
  quantity: z.ZodNumber;
  tags: z.ZodArray<z.ZodString>;
  images: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    created: z.ZodDate;
    title: z.ZodString;
    type: z.ZodEnum<{
      jpg: "jpg";
      png: "png";
    }>;
    size: z.ZodNumber;
    url: z.ZodURL;
  }, z.core.$strip>>;
  ratings: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    stars: z.ZodNumber;
    title: z.ZodString;
    text: z.ZodString;
    images: z.ZodArray<z.ZodObject<{
      id: z.ZodNumber;
      created: z.ZodDate;
      title: z.ZodString;
      type: z.ZodEnum<{
        jpg: "jpg";
        png: "png";
      }>;
      size: z.ZodNumber;
      url: z.ZodURL;
    }, z.core.$strip>>;
  }, z.core.$strip>>;
}, z.core.$strip> & CompiledSchema<{
  id: number;
  created: Date;
  title: string;
  brand: string;
  description: string;
  price: number;
  discount: number | null;
  quantity: number;
  tags: string[];
  images: {
    id: number;
    created: Date;
    title: string;
    type: "jpg" | "png";
    size: number;
    url: string;
  }[];
  ratings: {
    id: number;
    stars: number;
    title: string;
    text: string;
    images: {
      id: number;
      created: Date;
      title: string;
      type: "jpg" | "png";
      size: number;
      url: string;
    }[];
  }[];
}>;
//#endregion
export { compiledProductSchema };
//# sourceMappingURL=index.d.mts.map