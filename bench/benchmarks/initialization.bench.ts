import {
  getAjv,
  getAjvSchema,
} from "@schema-benchmarks/schemas/libraries/ajv/index.ts";
import { getArkTypeSchema } from "@schema-benchmarks/schemas/libraries/arktype/index.ts";
import { getEffectSchema } from "@schema-benchmarks/schemas/libraries/effect/index.ts";
import { getJoiSchema } from "@schema-benchmarks/schemas/libraries/joi/index.ts";
import { getTypeboxSchema } from "@schema-benchmarks/schemas/libraries/typebox/index.ts";
import type { TypiaSchema } from "@schema-benchmarks/schemas/libraries/typia/index.ts";
import { getValibotSchema } from "@schema-benchmarks/schemas/libraries/valibot/index.ts";
import { getYupSchema } from "@schema-benchmarks/schemas/libraries/yup/index.ts";
import { getZodSchema } from "@schema-benchmarks/schemas/libraries/zod/index.ts";
import { getZodMiniSchema } from "@schema-benchmarks/schemas/libraries/zod/mini.ts";
import ts from "dedent";
import * as Schema from "effect/Schema";
import typia from "typia";
import z from "zod";
import * as zMini from "zod/mini";
import { makeBenchFactory } from "../src/utils/bench-factory";

declare module "../src/utils/registry" {
  export interface MetaRegistry {
    initialization: {
      bench: unknown;
      case: unknown;
    };
  }
}

const bench = makeBenchFactory("initialization");

bench({ libraryType: "runtime" }, ({ addLibrary, library }) => {
  addLibrary(
    "arktype",
    () => {
      getArkTypeSchema();
    },
    { snippet: ts`type(...)` },
  );

  addLibrary(
    "valibot",
    () => {
      getValibotSchema();
    },
    { snippet: ts`v.object(...)` },
  );

  library("zod", ({ add }) => {
    add(
      () => {
        getZodSchema();
      },
      { snippet: ts`z.object(...)` },
    );

    add(
      () => {
        getZodSchema();
      },
      {
        note: "jitless",
        snippet: ts`
					// z.config({ jitless: true });
					z.object(...)
				`,
      },
      {
        beforeAll() {
          z.config({ jitless: true });
        },
        afterAll() {
          z.config({ jitless: false });
        },
      },
    );

    add(
      () => {
        getZodMiniSchema();
      },
      { note: "mini", snippet: ts`z.object(...)` },
    );

    add(
      () => {
        getZodMiniSchema();
      },
      {
        note: "mini, jitless",
        snippet: ts`
					// z.config({ jitless: true });
					z.object(...)
				`,
      },
      {
        beforeAll() {
          zMini.config({ jitless: true });
        },
        afterAll() {
          zMini.config({ jitless: false });
        },
      },
    );
  });

  library("effect", ({ add }) => {
    add(
      () => {
        getEffectSchema();
      },
      { snippet: ts`Schema.struct(...)` },
    );
    add(
      () => {
        Schema.decodeUnknownEither(getEffectSchema());
      },
      {
        note: "decodeUnknownEither",
        snippet: ts`
        Schema.decodeUnknownEither(
          Schema.struct(...)
        )
        `,
      },
    );
  });

  addLibrary(
    "typebox",
    () => {
      getTypeboxSchema();
    },
    { snippet: ts`Type.Object(...)` },
  );

  addLibrary(
    "yup",
    () => {
      getYupSchema();
    },
    { snippet: ts`object(...)` },
  );

  addLibrary(
    "joi",
    () => {
      getJoiSchema();
    },
    { snippet: ts`object(...)` },
  );

  library("ajv", ({ add }) => {
    const ajv = getAjv();
    add(
      () => {
        ajv.compile(getAjvSchema());
      },
      { note: "compile", snippet: ts`ajv.compile({...})` },
    );
  });
});

bench({ libraryType: "precompiled" }, ({ addLibrary }) => {
  addLibrary(
    "typia",
    () => {
      typia.createValidate<TypiaSchema>();
    },
    { snippet: ts`typia.createValidate<TypiaSchema>()` },
  );
});
