import * as path from "path";

import { promiseAllKeyed } from "@schema-benchmarks/utils";
import type { UserConfig } from "tsdown";
import { build } from "tsdown";
import zodCompiler from "zod-compiler/rolldown";

import baseTsdownConfig from "../../tsdown.config.ts";

const sharedConfig: UserConfig = {
  ...baseTsdownConfig,
  entry: [path.resolve(import.meta.dirname, "./index.ts")],
};

await promiseAllKeyed({
  base: build({
    ...sharedConfig,
    outDir: path.resolve(import.meta.dirname, "./compiled"),
    plugins: [zodCompiler({ schemas: "explicit" })],
  }),
  bag: build({
    ...sharedConfig,
    outDir: path.resolve(import.meta.dirname, "./compiled-bag"),
    plugins: [zodCompiler({ schemas: "explicit", output: "bag" })],
  }),
  compact: build({
    ...sharedConfig,
    outDir: path.resolve(import.meta.dirname, "./compiled-compact"),
    plugins: [zodCompiler({ schemas: "explicit", output: "compact" })],
  }),
});
