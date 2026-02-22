import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import vine from "@vinejs/vine";
import ts from "dedent" with { type: "macro" };

import { defineBenchmarks } from "#src";

import { getVineSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "@vinejs/vine",
    git: "vinejs/vine",
    optimizeType: "jit",
    version: await getVersion("@vinejs/vine"),
  },
  createContext: () => {
    const schema = getVineSchema();
    const validator = vine.create(schema);
    const noBailSchema = getVineSchema().bail(false);
    const noBailValidator = vine.create(noBailSchema);
    return { schema, validator, noBailSchema, noBailValidator };
  },
  initialization: [
    {
      run() {
        getVineSchema();
      },
      snippet: ts`vine.object(...)`,
    },
    {
      run() {
        vine.create(getVineSchema());
      },
      snippet: ts`vine.create(vine.object(...))`,
      note: "create",
    },
  ],
  parsing: {
    abortEarly: [
      {
        run(data, { schema }) {
          void vine.tryValidate({ schema, data });
        },
        snippet: ts`vine.tryValidate({ schema, data })`,
      },
      {
        run(data, { validator }) {
          void validator.validate(data);
        },
        snippet: ts`
        // const validator = vine.create(schema);
        validator.validate(data);
      `,
        note: "create",
      },
    ],
    allErrors: [
      {
        run(data, { noBailSchema }) {
          void vine.tryValidate({ schema: noBailSchema, data });
        },
        snippet: ts`vine.tryValidate({ schema: schema.bail(false), data })`,
      },
      {
        run(data, { noBailValidator }) {
          void noBailValidator.validate(data);
        },
        snippet: ts`
        // const noBailValidator = vine.create(schema.bail(false));
        noBailValidator.validate(data);
      `,
        note: "create",
      },
    ],
  },
  standard: {
    abortEarly: {
      getSchema: ({ validator }) => validator,
      snippet: ts`
      // const validator = vine.create(schema);
      upfetch(url, { schema: validator })
    `,
    },
    allErrors: {
      getSchema: ({ noBailValidator }) => noBailValidator,
      snippet: ts`
      // const validator = vine.create(schema.bail(false));
      upfetch(url, { schema: validator })
    `,
    },
  },
});
