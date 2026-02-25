import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as Type from "typebox";
import Compile from "typebox/compile";
import * as Schema from "typebox/schema";
import * as Value from "typebox/value";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getTypeboxSchema } from ".";

const createStringBenchmark = (format: Type.TFormat): StringBenchmarkConfig<unknown> => ({
  create() {
    const schema = Type.String({ format });
    return (testString) => Schema.Check(schema, testString);
  },
  snippet: ts`Type.String({ format: "${format}" })`,
});

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
        return getTypeboxSchema();
      },
      snippet: ts`Type.Object(...)`,
    },
    {
      run() {
        return Compile(getTypeboxSchema());
      },
      snippet: ts`Compile(Type.Object(...))`,
      note: "compile",
    },
    {
      run() {
        return Schema.Compile(getTypeboxSchema());
      },
      snippet: ts`Schema.Compile(Type.Object(...))`,
      note: "schema compile",
    },
  ],
  validation: [
    {
      run(data, { schema }) {
        return Value.Check(schema, data);
      },
      snippet: ts`Value.Check(schema, data)`,
    },
    {
      run(data, { compiled }) {
        return compiled.Check(data);
      },
      snippet: ts`
        // const compiled = Compile(schema);
        compiled.Check(data);
      `,
      note: "compile",
    },
    {
      run(data, { schema }) {
        return Schema.Check(schema, data);
      },
      snippet: ts`Schema.Check(schema, data)`,
      note: "schema",
    },
    {
      run(data, { compiledSchema }) {
        return compiledSchema.Check(data);
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
            return true;
          } catch {
            return false;
          }
        },
        validateResult: (result) => result,
        snippet: ts`Value.Parse(schema, data)`,
        throws: true,
      },
      {
        run(data, { compiled }) {
          try {
            compiled.Parse(data);
            return true;
          } catch {
            return false;
          }
        },
        validateResult: (result) => result,
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
            return true;
          } catch {
            return false;
          }
        },
        validateResult: (result) => result,
        snippet: ts`Schema.Parse(schema, data)`,
        note: "schema",
        throws: true,
      },
      {
        run(data, { compiledSchema }) {
          try {
            compiledSchema.Parse(data);
            return true;
          } catch {
            return false;
          }
        },
        validateResult: (result) => result,
        snippet: ts`
          // const compiledSchema = Schema.Compile(schema);
          compiledSchema.Parse(data);
        `,
        note: "schema compile",
        throws: true,
      },
    ],
  },
  string: {
    "date-time": createStringBenchmark("date-time"),
    date: createStringBenchmark("date"),
    time: createStringBenchmark("time"),
    duration: createStringBenchmark("duration"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ipv4"),
    ipv6: createStringBenchmark("ipv6"),
  },
});
