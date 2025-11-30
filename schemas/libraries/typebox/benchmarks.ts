import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import { Compile } from "typebox/compile";
import Value from "typebox/value";
import { getTypeboxSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "typebox",
    type: "runtime",
    version: await getVersion("typebox"),
  },
  createContext: () => {
    const schema = getTypeboxSchema();
    const compiled = Compile(schema);
    return { schema, compiled };
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
      },
    ],
  },
});
