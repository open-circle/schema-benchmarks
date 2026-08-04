import * as fs from "node:fs/promises";

import degit from "degit";

import sha from "#constants/sha.gen.ts";

const source = `github:json-schema-org/json-schema-test-suite/tests#${sha}`;

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
