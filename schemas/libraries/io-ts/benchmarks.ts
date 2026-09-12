import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as E from "fp-ts/lib/Either.js";
import * as t from "io-ts";

import { defineBenchmarks } from "#src";

import { getIotsSchema } from ".";

const schema = getIotsSchema();
const BigIntFromString = new t.Type<bigint, string, string>(
  "BigIntFromString",
  (u) => typeof u === "bigint",
  (u, c) => {
    try {
      return t.success(BigInt(u));
    } catch {
      return t.failure(u, c);
    }
  },
  (a) => a.toString(),
);

export default defineBenchmarks({
  library: {
    name: "io-ts",
    optimizeType: "none",
    version: await getVersion("io-ts"),
  },
  initialization: {
    run() {
      return getIotsSchema();
    },
    snippet: ts`t.type(props)`,
  },
  validation: {
    run(data) {
      return schema.is(data);
    },
    snippet: ts`schema.is(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        return schema.decode(data);
      },
      validateResult: E.isRight,
      getData: E.getOrElseW(() => undefined),
      snippet: ts`schema.decode(data)`,
    },
  },
  codec: {
    encode: {
      run: (data) => {
        return BigIntFromString.encode(data);
      },
      snippet: ts`
        // setup-start
        const BigIntFromString = new t.Type<bigint, string, string>(name, is, validate, encode);
        // setup-end
        BigIntFromString.encode(data)
      `,
    },
    decode: {
      run: (data) => {
        return (BigIntFromString.decode(data) as unknown as E.Right<bigint>).right;
      },
      snippet: ts`
        // setup-start
        const BigIntFromString = new t.Type<bigint, string, string>(name, is, validate, encode);
        // setup-end
        BigIntFromString.decode(data)
      `,
    },
  },
  types: {
    imports: ts`
      import * as t from "io-ts";
      import { getIotsSchema } from ".";
    `,
    schema: "getIotsSchema()",
    input: "t.OutputOf<typeof probeSchema>",
    output: "t.TypeOf<typeof probeSchema>",
    fromType: {
      style: "annotation",
      schema: ts`
        const probeSchema: t.Type<Product> = t.type({ id: t.number, name: t.string, price: t.number });
      `,
    },
  },
});
