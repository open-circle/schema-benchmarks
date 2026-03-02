import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as E from "fp-ts/lib/Either.js";
import * as t from "io-ts";

import { defineBenchmarks } from "#src";

import { getIotsSchema } from ".";

const schema = getIotsSchema();
const DateFromString = new t.Type<Date, string, string>(
  "DateFromString",
  (u) => u instanceof Date,
  (u, c) => {
    const d = new Date(u);
    return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
  },
  (a) => a.toISOString(),
);

export default defineBenchmarks({
  library: {
    name: "io-ts",
    git: "gcanti/io-ts",
    optimizeType: "none",
    version: await getVersion("io-ts"),
  },
  initialization: {
    run() {
      return getIotsSchema();
    },
    snippet: ts`t.type(...)`,
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
      snippet: ts`schema.decode(data)`,
    },
  },
  codec: {
    encode: {
      run: (data) => {
        return DateFromString.encode(data);
      },
      snippet: ts`
        // const DateFromString = new t.Type<Date, string, string>(...)
        DateFromString.encode(data)
      `,
    },
    decode: {
      run: (data) => {
        return (DateFromString.decode(data) as unknown as E.Right<Date>).right;
      },
      snippet: ts`
        // const DateFromString = new t.Type<Date, string, string>(...)
        DateFromString.decode(data)
      `,
    },
  },
});
