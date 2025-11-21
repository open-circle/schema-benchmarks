/// <reference types="vite/client" />

import type { BenchmarkConfig } from "../src/types";

export const libraries = import.meta.glob<BenchmarkConfig>(
  ["./**/benchmarks.ts", "./**/benchmarks/*.ts", "!**/__template__/**/*"],
  {
    import: "default",
  },
);
