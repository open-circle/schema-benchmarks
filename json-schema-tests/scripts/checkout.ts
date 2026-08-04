import * as fs from "node:fs/promises";

import degit from "degit";

import { JSON_SCHEMA_TEST_SUITE_COMMIT } from "./test-suite-ref.ts";

const source = `github:json-schema-org/json-schema-test-suite/tests#${JSON_SCHEMA_TEST_SUITE_COMMIT}`;

const emitter = degit(source, {
  cache: false,
  force: true,
  verbose: true,
});

emitter.on("info", (info) => {
  if (info.message) {
    console.log(info.message);
  }
});

await fs.rm("tests", { recursive: true, force: true });
await emitter.clone("tests");
await fs.rm("tests/latest", { recursive: true, force: true });
