import {
  getAjv,
  getAjvSchema,
} from "@schema-benchmarks/schemas/libraries/ajv/index.ts";
import { getArkTypeSchema } from "@schema-benchmarks/schemas/libraries/arktype/index.ts";
import { getEffectSchema } from "@schema-benchmarks/schemas/libraries/effect/index.ts";
import { getTypeboxSchema } from "@schema-benchmarks/schemas/libraries/typebox/index.ts";
import type { TypiaSchema } from "@schema-benchmarks/schemas/libraries/typia/index.ts";
import { getValibotSchema } from "@schema-benchmarks/schemas/libraries/valibot/index.ts";
import { getYupSchema } from "@schema-benchmarks/schemas/libraries/yup/index.ts";
import ts from "dedent";
import * as Schema from "effect/Schema";
import Value from "typebox/value";
import typia from "typia";
import * as v from "valibot";
import { errorData, successData } from "../src/data";
import type { DataType } from "../src/results/types";
import { makeBenchFactory } from "../src/utils/bench-factory";

declare module "../src/utils/registry" {
  export interface MetaRegistry {
    validation: {
      bench: {
        dataType: DataType;
      };
      case: unknown;
    };
  }
}

const bench = makeBenchFactory("validation");

for (const [dataType, data] of [
  ["valid", successData],
  ["invalid", errorData],
] as const) {
  bench({ dataType, libraryType: "runtime" }, ({ library }) => {
    library("arktype", ({ add }) => {
      const arktypeSchema = getArkTypeSchema();
      add(
        () => {
          arktypeSchema.allows(data);
        },
        {
          snippet: ts`schema.allows(data)`,
        },
      );
    });

    library("valibot", ({ add }) => {
      const valibotSchema = getValibotSchema();
      add(
        () => {
          v.is(valibotSchema, data);
        },
        {
          snippet: ts`v.is(schema, data)`,
        },
      );
    });

    library("effect", ({ add }) => {
      const effectSchema = getEffectSchema();
      const is = Schema.is(effectSchema);
      add(
        () => {
          is(data);
        },
        {
          snippet: ts`
						// const is = Schema.is(schema); 
						is(data);
					`,
        },
      );
    });

    library("typebox", ({ add }) => {
      const typeboxSchema = getTypeboxSchema();
      add(
        () => {
          try {
            Value.Check(typeboxSchema, data);
          } catch {}
        },
        { snippet: ts`Value.Check(schema, data)` },
      );
    });

    library("yup", ({ add }) => {
      const yupSchema = getYupSchema();
      add(
        () => {
          try {
            yupSchema.isValidSync(data);
          } catch {}
        },
        { snippet: ts`schema.isValidSync(data)` },
      );
    });

    library("ajv", ({ add }) => {
      const ajvSchema = getAjvSchema();
      const ajv = getAjv();
      add(
        () => {
          ajv.validate(ajvSchema, data);
        },
        { note: "validate", snippet: ts`ajv.validate(schema, data)` },
      );

      const ajvValidate = ajv.compile(ajvSchema);
      add(
        () => {
          ajvValidate(data);
        },
        {
          note: "compile",
          snippet: ts`
						// const validate = ajv.compile(schema);
						validate(data);
					`,
        },
      );
    });
  });

  bench({ dataType, libraryType: "precompiled" }, ({ addLibrary }) => {
    addLibrary(
      "typia",
      () => {
        typia.is<TypiaSchema>(data);
      },
      { snippet: ts`typia.is<TypiaSchema>(data)` },
    );
  });
}
