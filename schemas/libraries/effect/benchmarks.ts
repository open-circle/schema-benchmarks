import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import * as Schema from "effect/Schema";
import { getEffectSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "effect",
    type: "runtime",
    version: await getVersion("effect"),
  },
  createContext: () => {
    const schema = getEffectSchema();
    const is = Schema.is(schema);
    const decodeAll = Schema.decodeUnknownEither(schema, { errors: "all" });
    const decodeFirst = Schema.decodeUnknownEither(schema, { errors: "first" });
    return { schema, is, decodeAll, decodeFirst };
  },
  initialization: [
    {
      run() {
        getEffectSchema();
      },
      snippet: ts`Schema.struct(...)`,
    },
    {
      run() {
        Schema.decodeUnknownEither(getEffectSchema());
      },
      snippet: ts`
        Schema.decodeUnknownEither(
          Schema.struct(...)
        )
      `,
    },
  ],
  validation: {
    run(data, { is }) {
      is(data);
    },
    snippet: ts`
      // const is = Schema.is(schema);
      is(data);
    `,
  },
  parsing: {
    allErrors: {
      run(data, { decodeAll }) {
        decodeAll(data);
      },
      snippet: ts`
        // const decodeAll = Schema.decodeUnknownEither(
        //  schema, 
        //  { errors: "all" }
        // );
        decodeAll(data)
      `,
    },
    abortEarly: {
      run(data, { decodeFirst }) {
        decodeFirst(data);
      },
      snippet: ts`
        // const decodeFirst = Schema.decodeUnknownEither(
        //  schema, 
        //  { errors: "first" }
        // );
        decodeFirst(data)
      `,
    },
  },
});
