import {
  createGetValidationErrorsFn,
  createJsonSchemaFn,
  createPrepareForJsonFn,
  createRestoreFromJsonFn,
  createStandardSchema,
  createValidateFn,
} from "@mionjs/run-types";
import type * as TF from "@mionjs/run-types/formats";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
// @ts-expect-error imported for type portability
// oxlint-disable-next-line no-unused-vars
import type { StandardSchemaV1 } from "@standard-schema/spec";
import ts from "dedent";

import type { JsonSchemaInputData } from "#src";
import { assertJsonSchemaDirection, assertJsonSchemaTarget, defineBenchmarks } from "#src";

import type { MionSchema } from ".";

const validate = createValidateFn<MionSchema>();
const getErrors = createGetValidationErrorsFn<MionSchema>();
const standardSchema = createStandardSchema<MionSchema>();
const encodeBigInt = createPrepareForJsonFn<bigint>();
const decodeBigInt = createRestoreFromJsonFn<bigint>();

// mion validates without transforming, so its single document only matches the subject's input side
const toJsonSchema = createJsonSchemaFn<JsonSchemaInputData>();

export default defineBenchmarks({
  library: {
    name: "@mionjs/run-types",
    optimizeType: "precompiled",
    version: await getVersion("@mionjs/run-types"),
  },
  initialization: [
    {
      run() {
        return createValidateFn<MionSchema>();
      },
      note: "createValidateFn",
      snippet: ts`createValidateFn<MionSchema>()`,
    },
    {
      run() {
        return createGetValidationErrorsFn<MionSchema>();
      },
      note: "createGetValidationErrorsFn",
      snippet: ts`createGetValidationErrorsFn<MionSchema>()`,
    },
  ],
  validation: {
    run(data) {
      return validate(data);
    },
    snippet: ts`
      // setup-start
      const validate = createValidateFn<MionSchema>();
      // setup-end
      validate(data);
    `,
  },
  parsing: {
    allErrors: {
      run(data) {
        if (validate(data)) return { success: true, data } as const;
        return { success: false, errors: getErrors(data) } as const;
      },
      validateResult: (result) => result.success,
      getData: (result) => (result.success ? result.data : undefined),
      snippet: ts`
        // setup-start
        const validate = createValidateFn<MionSchema>();
        const getErrors = createGetValidationErrorsFn<MionSchema>();
        // setup-end
        validate(data) ? data : getErrors(data);
      `,
    },
  },
  standard: {
    allErrors: {
      schema: standardSchema,
      snippet: ts`
        // setup-start
        const schema = createStandardSchema<MionSchema>();
        // setup-end
        upfetch(url, { schema })
      `,
    },
  },
  jsonSchema: {
    conversion: {
      toJson: {
        generate: ({ target, direction }) => {
          assertJsonSchemaTarget(target, ["draft-2020-12"]);
          assertJsonSchemaDirection(direction, ["input"]);
          return toJsonSchema({ target });
        },
        snippet: ({ target }) => ts`
          // setup-start
          const toJsonSchema = createJsonSchemaFn<Schema>();
          // setup-end
          toJsonSchema({ target: "${target}" })
        `,
        source: { type: "native" },
      },
    },
  },
  string: {
    "date-time": {
      create() {
        return createValidateFn<TF.StringDateTime>();
      },
      snippet: ts`createValidateFn<TF.StringDateTime>()`,
    },
    date: {
      create() {
        return createValidateFn<TF.StringDate>();
      },
      snippet: ts`createValidateFn<TF.StringDate>()`,
    },
    time: {
      create() {
        return createValidateFn<TF.StringTime>();
      },
      snippet: ts`createValidateFn<TF.StringTime>()`,
    },
    duration: {
      create() {
        return createValidateFn<TF.StringDuration>();
      },
      snippet: ts`createValidateFn<TF.StringDuration>()`,
    },
    email: {
      create() {
        return createValidateFn<TF.Email>();
      },
      snippet: ts`createValidateFn<TF.Email>()`,
    },
    url: {
      create() {
        return createValidateFn<TF.StringUrl>();
      },
      snippet: ts`createValidateFn<TF.StringUrl>()`,
    },
    uuid: {
      create() {
        return createValidateFn<TF.UUID>();
      },
      snippet: ts`createValidateFn<TF.UUID>()`,
    },
    ipv4: {
      create() {
        return createValidateFn<TF.IPv4>();
      },
      snippet: ts`createValidateFn<TF.IPv4>()`,
    },
    ipv6: {
      create() {
        return createValidateFn<TF.IPv6>();
      },
      snippet: ts`createValidateFn<TF.IPv6>()`,
    },
  },
  codec: {
    encode: {
      run: (data) => encodeBigInt(data),
      snippet: ts`
        // setup-start
        const encode = createPrepareForJsonFn<bigint>();
        // setup-end
        encode(data)
      `,
    },
    decode: {
      run: (data) => decodeBigInt(data),
      snippet: ts`
        // setup-start
        const decode = createRestoreFromJsonFn<bigint>();
        // setup-end
        decode(data)
      `,
    },
  },
});
