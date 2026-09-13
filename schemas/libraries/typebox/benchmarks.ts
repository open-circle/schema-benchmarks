import remotes from "@schema-benchmarks/json-schema-tests/remotes";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as Type from "typebox";
import Compile from "typebox/compile";
import * as Schema from "typebox/schema";
import * as Value from "typebox/value";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks, success } from "#src";

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
const BigIntFromString = Type.Codec(Type.String())
  .Decode((a) => BigInt(a))
  .Encode((a) => a.toString());

const scriptSchema = getTypeboxScriptSchema();
const compiledScriptSchema = Schema.Compile(scriptSchema);

export default defineBenchmarks({
  library: {
    name: "typebox",
    optimizeType: "jit",
    version: await getVersion("typebox"),
  },
  initialization: [
    {
      run() {
        return getTypeboxSchema();
      },
      snippet: ts`Type.Object(properties)`,
    },
    {
      run() {
        return Compile(getTypeboxSchema());
      },
      snippet: ts`Compile(Type.Object(properties))`,
      note: "compile",
    },
    {
      run() {
        return Schema.Compile(getTypeboxSchema());
      },
      snippet: ts`Schema.Compile(Type.Object(properties))`,
      note: "schema compile",
    },
    {
      run() {
        return getTypeboxScriptSchema();
      },
      snippet: ts`Type.Script(context, input)`,
      note: "script",
    },
    {
      run() {
        return Schema.Compile(getTypeboxScriptSchema());
      },
      snippet: ts`Schema.Compile(Type.Script(context, input))`,
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
        // setup-start
        const compiled = Compile(schema);
        // setup-end
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
        // setup-start
        const compiledSchema = Schema.Compile(schema);
        // setup-end
        compiledSchema.Check(data);
      `,
      note: "schema compile",
    },
    {
      run(data) {
        return compiledScriptSchema.Check(data);
      },
      snippet: ts`
        // setup-start
        const compiledScriptSchema = Schema.Compile(scriptSchema);
        // setup-end
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
            return success.true(Value.Parse(schema, data));
          } catch {
            return success.false;
          }
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`Value.Parse(schema, data)`,
        throws: true,
      },
      {
        run(data) {
          try {
            return success.true(compiled.Parse(data));
          } catch {
            return success.false;
          }
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`
          // setup-start
          const compiled = Compile(schema);
          // setup-end
          compiled.Parse(data);
        `,
        note: "compile",
        throws: true,
      },
      {
        run(data) {
          try {
            return success.true(Schema.Parse(schema, data));
          } catch {
            return success.false;
          }
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`Schema.Parse(schema, data)`,
        note: "schema",
        throws: true,
      },
      {
        run(data) {
          try {
            return success.true(compiledSchema.Parse(data));
          } catch {
            return success.false;
          }
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`
          // setup-start
          const compiledSchema = Schema.Compile(schema);
          // setup-end
          compiledSchema.Parse(data);
        `,
        note: "schema compile",
        throws: true,
      },
      {
        run(data) {
          try {
            return success.true(compiledScriptSchema.Parse(data));
          } catch {
            return success.false;
          }
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`
          // setup-start
          const compiledScriptSchema = Schema.Compile(scriptSchema);
          // setup-end
          compiledScriptSchema.Parse(data);
        `,
        note: "script compile",
        throws: true,
      },
    ],
  },
  jsonSchema: {
    compliance: {
      validation: [
        {
          run(schema, data) {
            return Value.Check(
              {
                ...Schema.Meta,
                ...remotes,
              },
              schema,
              data,
            );
          },
          snippet: () => ts`Value.Check({ ...Schema.Meta, ...remotes }, schema, data)`,
          note: "value",
          source: { type: "native" },
        },
        {
          run(schema, data) {
            return Schema.Check(
              {
                ...Schema.Meta,
                ...remotes,
              },
              schema,
              data,
            );
          },
          snippet: () => ts`Schema.Check({ ...Schema.Meta, ...remotes }, schema, data)`,
          note: "schema",
          source: { type: "native" },
        },
      ],
    },
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
        return Value.Encode(BigIntFromString, data);
      },
      snippet: ts`
        // setup-start
        const BigIntFromString = Type.Codec(type).Decode(callback).Encode(callback);
        // setup-end
        Value.Encode(BigIntFromString, data)
      `,
    },
    decode: {
      run: (data) => {
        return Value.Decode(BigIntFromString, data);
      },
      snippet: ts`
        // setup-start
        const BigIntFromString = Type.Codec(type).Decode(callback).Encode(callback);
        // setup-end
        Value.Decode(BigIntFromString, data)
      `,
    },
    acceptsUnknown: true,
  },
  types: {
    imports: ts`
      import type { Satisfies } from "@schema-benchmarks/utils";
      import * as Type from "typebox";
      import { getTypeboxSchema } from ".";
    `,
    schema: "getTypeboxSchema()",
    input: "Type.StaticEncode<typeof probeSchema>",
    output: "Type.StaticDecode<typeof probeSchema>",
    fromType: {
      style: "annotation",
      schema: ts`
        const probeSchema = Type.Object({ id: Type.Number(), name: Type.String(), price: Type.Number() });
        type ProbeChecked = Satisfies<Type.Static<typeof probeSchema>, Product>;
      `,
    },
  },
});
