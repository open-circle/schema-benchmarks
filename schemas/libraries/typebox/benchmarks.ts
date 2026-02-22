import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import { Compile as TypemapCompile } from "@sinclair/typemap";
import ts from "dedent" with { type: "macro" };
import Compile from "typebox/compile";
import * as Schema from "typebox/schema";
import * as Value from "typebox/value";

import { defineBenchmarks } from "#src";

import { getTypeboxSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "typebox",
    git: "sinclairzx81/typebox",
    optimizeType: "jit",
    version: await getVersion("typebox"),
  },
  createContext: () => {
    const schema = getTypeboxSchema();
    const compiled = Compile(schema);
    const compiledSchema = Schema.Compile(schema);
    return { schema, compiled, compiledSchema };
  },
  initialization: [
    {
      run() {
        getTypeboxSchema();
      },
      snippet: ts`Type.Object(...)`,
    },
    {
      run() {
        Compile(getTypeboxSchema());
      },
      snippet: ts`Compile(Type.Object(...))`,
      note: "compile",
    },
    {
      run() {
        Schema.Compile(getTypeboxSchema());
      },
      snippet: ts`Schema.Compile(Type.Object(...))`,
      note: "schema compile",
    },
  ],
  validation: [
    {
      run(data, { schema }) {
        Value.Check(schema, data);
      },
      snippet: ts`Value.Check(schema, data)`,
    },
    {
      run(data, { compiled }) {
        compiled.Check(data);
      },
      snippet: ts`
        // const compiled = Compile(schema);
        compiled.Check(data);
      `,
      note: "compile",
    },
    {
      run(data, { schema }) {
        Schema.Check(schema, data);
      },
      snippet: ts`Schema.Check(schema, data)`,
      note: "schema",
    },
    {
      run(data, { compiledSchema }) {
        compiledSchema.Check(data);
      },
      snippet: ts`
        // const compiledSchema = Schema.Compile(schema);
        compiledSchema.Check(data);
      `,
      note: "schema compile",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data, { schema }) {
          try {
            Value.Parse(schema, data);
          } catch {}
        },
        snippet: ts`Value.Parse(schema, data)`,
        throws: true,
      },
      {
        run(data, { compiled }) {
          try {
            compiled.Parse(data);
          } catch {}
        },
        snippet: ts`
          // const compiled = Compile(schema);
          compiled.Parse(data);
        `,
        note: "compile",
        throws: true,
      },
      {
        run(data, { schema }) {
          try {
            Schema.Parse(schema, data);
          } catch {}
        },
        snippet: ts`Schema.Parse(schema, data)`,
        note: "schema",
        throws: true,
      },
      {
        run(data, { compiledSchema }) {
          try {
            compiledSchema.Parse(data);
          } catch {}
        },
        snippet: ts`
          // const compiledSchema = Schema.Compile(schema);
          compiledSchema.Parse(data);
        `,
        note: "schema compile",
        throws: true,
      },
    ],
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => TypemapCompile(schema),
      snippet: ts`
      // import { Compile } from "@sinclair/typemap";
      // const validator = Compile(schema);
      upfetch(url, { schema: validator })
    `,
    },
  },
});
