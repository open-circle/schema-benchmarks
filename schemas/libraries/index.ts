/// <reference types="vite/client" />

import type { BenchmarksConfig } from "../src/types.ts";

export const libraries = import.meta.glob<BenchmarksConfig<unknown>>(
  ["./**/benchmarks.ts", "!**/__template__/**/*"],
  {
    import: "default",
  },
);
