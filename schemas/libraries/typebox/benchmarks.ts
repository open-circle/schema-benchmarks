import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as Type from "typebox";
import Compile from "typebox/compile";
import * as Schema from "typebox/schema";
import * as Value from "typebox/value";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getTypeboxSchema, getTypeboxScriptSchema } from ".";

const createStringBenchmark = (format: Type.TFormat): StringBenchmarkConfig => ({
  create() {
    const schema = Type.String({ format });
    return (testString) => Schema.Check(schema, testString);
  },
  snippet: ts`Type.String({ format: "${format}" })`,
});

const schema = getTypeboxSchema();
const compiled = Compile(schema);
const compiledSchema = Schema.Compile(schema);
const DateFromString = Type.Codec(Type.String({ format: "date-time" }))
  .Decode((a) => new Date(a))
  .Encode((a) => a.toISOString());

const scriptSchema = getTypeboxScriptSchema();
const compiledScriptSchema = Schema.Compile(scriptSchema);

export default defineBenchmarks({
  library: {
    name: "typebox",
    git: "sinclairzx81/typebox",
    optimizeType: "jit",
    version: await getVersion("typebox"),
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
    {
      run() {
        return getTypeboxScriptSchema();
      },
      snippet: ts`Type.Script(...)`,
      note: "script",
    },
    {
      run() {
        return Schema.Compile(getTypeboxScriptSchema());
      },
      snippet: ts`Schema.Compile(Type.Script(...))`,
      note: "script compile",
    },
  ],
  validation: [
    {
      run(data) {
        return Value.Check(schema, data);
      },
      snippet: ts`Value.Check(schema, data)`,
    },
    {
      run(data) {
        return compiled.Check(data);
      },
      snippet: ts`
        // const compiled = Compile(schema);
        compiled.Check(data);
      `,
      note: "compile",
    },
    {
      run(data) {
        return Schema.Check(schema, data);
      },
      snippet: ts`Schema.Check(schema, data)`,
      note: "schema",
    },
    {
      run(data) {
        return compiledSchema.Check(data);
      },
      snippet: ts`
        // const compiledSchema = Schema.Compile(schema);
        compiledSchema.Check(data);
      `,
      note: "schema compile",
    },
    {
      run(data) {
        return compiledScriptSchema.Check(data);
      },
      snippet: ts`
        // const compiledScriptSchema = Schema.Compile(scriptSchema);
        compiledScriptSchema.Check(data);
      `,
      note: "script compile",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data) {
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
        run(data) {
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
        run(data) {
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
        run(data) {
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
      {
        run(data) {
          try {
            compiledScriptSchema.Parse(data);
            return true;
          } catch {
            return false;
          }
        },
        validateResult: (result) => result,
        snippet: ts`
          // const compiledScriptSchema = Schema.Compile(scriptSchema);
          compiledScriptSchema.Parse(data);
        `,
        note: "script compile",
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
  stack: {
    throw: (data) => {
      Value.Parse(schema, data);
      assertNotReached();
    },
    snippet: ts`Value.Parse(schema, data)`,
  },
  codec: {
    encode: {
      run: (data) => {
        return Value.Encode(DateFromString, data);
      },
      snippet: ts`
        // const DateFromString = Type.Codec(...).Decode(...).Encode(...);
        Value.Encode(DateFromString, data)
      `,
    },
    decode: {
      run: (data) => {
        return Value.Decode(DateFromString, data);
      },
      snippet: ts`
        // const DateFromString = Type.Codec(...).Decode(...).Encode(...);
        Value.Decode(DateFromString, data)
      `,
    },
    acceptsUnknown: true,
  },
});
