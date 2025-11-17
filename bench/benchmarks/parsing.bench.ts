import ts from "dedent";
import * as Schema from "effect/Schema";
import Value from "typebox/value";
import typia from "typia";
import * as v from "valibot";
import { getArkTypeSchema } from "../schemas/benchmarks/arktype";
import { getEffectSchema } from "../schemas/benchmarks/effect";
import { getJoiSchema } from "../schemas/benchmarks/joi";
import { getTypeboxSchema } from "../schemas/benchmarks/typebox";
import type { TypiaSchema } from "../schemas/benchmarks/typia";
import { getValibotSchema } from "../schemas/benchmarks/valibot";
import { getYupSchema } from "../schemas/benchmarks/yup";
import { getZodSchema } from "../schemas/benchmarks/zod";
import { getZodMiniSchema } from "../schemas/benchmarks/zod/mini";
import { errorData, successData } from "../src/data";
import type { DataType, ErrorType } from "../src/results/types";
import { makeBenchFactory } from "../src/utils/bench-factory";

declare module "../src/utils/registry" {
  export interface MetaRegistry {
    parse: {
      bench: {
        dataType: DataType;
        abortType: ErrorType;
      };
      case: unknown;
    };
  }
}

const bench = makeBenchFactory("parse");

for (const [dataType, data] of [
  ["valid", successData],
  ["invalid", errorData],
] as const) {
  bench(
    { dataType, libraryType: "runtime", abortType: "allErrors" },
    ({ library }) => {
      library("arktype", ({ add }) => {
        const arktypeSchema = getArkTypeSchema();
        add(
          () => {
            arktypeSchema(data);
          },
          {
            snippet: ts`schema(data)`,
          },
        );
      });

      library("valibot", ({ add }) => {
        const valibotSchema = getValibotSchema();
        add(
          () => {
            v.safeParse(valibotSchema, data);
          },
          {
            snippet: ts`v.safeParse(schema, data)`,
          },
        );
      });

      library("zod", ({ add }) => {
        const zodSchema = getZodSchema();
        add(
          () => {
            zodSchema.safeParse(data);
          },
          {
            snippet: ts`schema.safeParse(data)`,
          },
        );

        add(
          () => {
            zodSchema.safeParse(data, { jitless: true });
          },
          {
            note: "jitless",
            snippet: ts`schema.safeParse(data, { jitless: true })`,
          },
        );

        const zodMiniSchema = getZodMiniSchema();
        add(
          () => {
            zodMiniSchema.safeParse(data);
          },
          {
            note: "mini",
            snippet: ts`schema.safeParse(data)`,
          },
        );

        add(
          () => {
            zodMiniSchema.safeParse(data, { jitless: true });
          },
          {
            note: "mini, jitless",
            snippet: ts`schema.safeParse(data, { jitless: true })`,
          },
        );
      });

      library("effect", ({ add }) => {
        const effectSchema = getEffectSchema();
        const decode = Schema.decodeUnknownEither(effectSchema, {
          errors: "all",
        });
        add(
          () => {
            decode(data);
          },
          {
            // workaround: dedent does weird things with multiline comments
            snippet: ts`
							/*\nconst decode = Schema.decodeUnknownEither(\n  schema,\n  { errors: "all" }\n);\n*/
							decode(data);
						`,
          },
        );
      });

      library("typebox", ({ add }) => {
        const typeboxSchema = getTypeboxSchema();
        add(
          () => {
            try {
              Value.Parse(typeboxSchema, data);
            } catch {}
          },
          {
            snippet: ts`Value.Parse(schema, data)`,
          },
        );
      });

      library("yup", ({ add }) => {
        const yupSchema = getYupSchema();
        add(
          () => {
            try {
              yupSchema.validateSync(data, { abortEarly: false });
            } catch {}
          },
          {
            snippet: ts`schema.validateSync(data, { abortEarly: false })`,
          },
        );
      });

      library("joi", ({ add }) => {
        const joiSchema = getJoiSchema();
        add(
          () => {
            joiSchema.validate(data, { abortEarly: false });
          },
          {
            snippet: ts`schema.validate(data, { abortEarly: false })`,
          },
        );
      });
    },
  );

  bench(
    { dataType, libraryType: "runtime", abortType: "abortEarly" },
    ({ library }) => {
      library("valibot", ({ add }) => {
        const valibotSchema = getValibotSchema();
        add(
          () => {
            v.safeParse(valibotSchema, data, { abortEarly: true });
          },
          {
            snippet: ts`v.safeParse(schema, data, { abortEarly: true })`,
          },
        );
        add(
          () => {
            v.safeParse(valibotSchema, data, { abortPipeEarly: true });
          },
          {
            note: "abortPipeEarly only",
            snippet: ts`v.safeParse(schema, data, { abortPipeEarly: true })`,
          },
        );
      });

      library("effect", ({ add }) => {
        const effectSchema = getEffectSchema();
        const decode = Schema.decodeUnknownEither(effectSchema, {
          errors: "first",
        });
        add(
          () => {
            decode(data);
          },
          {
            // workaround: dedent does weird things with multiline comments
            snippet: ts`
							/*\nconst decode = Schema.decodeUnknownEither(\n  schema,\n  { errors: "first" }\n);\n*/
							decode(data);
						`,
          },
        );
      });

      library("yup", ({ add }) => {
        const yupSchema = getYupSchema();
        add(
          () => {
            try {
              yupSchema.validateSync(data, { abortEarly: true });
            } catch {}
          },
          {
            snippet: ts`schema.validateSync(data, { abortEarly: true })`,
          },
        );
      });

      library("joi", ({ add }) => {
        const joiSchema = getJoiSchema();
        add(
          () => {
            joiSchema.validate(data, { abortEarly: true });
          },
          {
            snippet: ts`schema.validate(data, { abortEarly: true });`,
          },
        );
      });
    },
  );

  bench(
    { dataType, libraryType: "precompiled", abortType: "allErrors" },
    ({ library }) => {
      library("typia", ({ add }) => {
        add(
          () => {
            typia.validate<TypiaSchema>(data);
          },
          { note: "validate", snippet: ts`typia.validate<TypiaSchema>(data);` },
        );

        const typiaValidate = typia.createValidate<TypiaSchema>();
        add(
          () => {
            typiaValidate(data);
          },
          {
            note: "createValidate",
            snippet: ts`
							// const validate = typia.createValidate<TypiaSchema>();
							validate(data);
						`,
          },
        );
      });
    },
  );
}
