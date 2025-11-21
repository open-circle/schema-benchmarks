/// <reference types="vite/client" />

import type { BenchmarkConfig } from "../src/types";

const benchmarks = import.meta.glob<BenchmarkConfig>(
  ["./*/benchmarks.ts", "!**/__template__/**/*"],
  {
    import: "default",
  },
);

export const libraries = Object.fromEntries<(typeof benchmarks)[string]>(
  Object.entries(benchmarks).map(([key, value]) => [
    key.split("/").at(-2) as string,
    value,
  ]),
);
