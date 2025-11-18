import {
  getAjv,
  getAjvSchema,
} from "@schema-benchmarks/schemas/libraries/ajv/initialize";
import { getArkTypeSchema } from "@schema-benchmarks/schemas/libraries/arktype/initialize";
import { getEffectSchema } from "@schema-benchmarks/schemas/libraries/effect/initialize";
import { getJoiSchema } from "@schema-benchmarks/schemas/libraries/joi/initialize";
import { getTypeboxSchema } from "@schema-benchmarks/schemas/libraries/typebox/initialize";
import type { TypiaSchema } from "@schema-benchmarks/schemas/libraries/typia/initialize";
import { getValibotSchema } from "@schema-benchmarks/schemas/libraries/valibot/initialize";
import { getYupSchema } from "@schema-benchmarks/schemas/libraries/yup/initialize";
import { getZodSchema } from "@schema-benchmarks/schemas/libraries/zod/initialize/index";
import { getZodMiniSchema } from "@schema-benchmarks/schemas/libraries/zod/initialize/mini";
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
