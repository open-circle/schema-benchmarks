import ts from "dedent";
import * as Schema from "effect/Schema";
import typia from "typia";
import z from "zod";
import * as zMini from "zod/mini";
import { getAjv, getAjvSchema } from "../schemas/benchmarks/ajv";
import { getArkTypeSchema } from "../schemas/benchmarks/arktype";
import { getEffectSchema } from "../schemas/benchmarks/effect";
import { getJoiSchema } from "../schemas/benchmarks/joi";
import { getTypeboxSchema } from "../schemas/benchmarks/typebox";
import type { TypiaSchema } from "../schemas/benchmarks/typia";
import { getValibotSchema } from "../schemas/benchmarks/valibot";
import { getYupSchema } from "../schemas/benchmarks/yup";
import { getZodSchema } from "../schemas/benchmarks/zod";
import { getZodMiniSchema } from "../schemas/benchmarks/zod/mini";
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
  });

  library("zod/mini", ({ add }) => {
    add(
      () => {
        getZodMiniSchema();
      },
      { snippet: ts`z.object(...)` },
    );

    add(
      () => {
        getZodMiniSchema();
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
        snippet: ts`Schema.decodeUnknownEither(Schema.struct(...))`,
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
