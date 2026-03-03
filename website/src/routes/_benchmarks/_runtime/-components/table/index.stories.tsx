import benchResults from "@schema-benchmarks/bench/bench.json";

import { Bar } from "#/shared/components/table/bar";
import preview from "#storybook/preview";

import { BenchTable } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Runtime/Table",
  component: BenchTable,
  args: {
    sortBy: "mean",
    sortDir: "ascending",
  } as const,
});

export const Initialization = meta.story({
  args: {
    results: benchResults.initialization,
    meanScaler: Bar.getScale(
      benchResults.initialization.map((r) => r.mean),
      { lowerBetter: true },
    ),
    to: "/initialization",
  },
});

export const Validation = meta.story({
  args: {
    results: benchResults.validation.valid,
    meanScaler: Bar.getScale(
      benchResults.validation.valid.map((r) => r.mean),
      { lowerBetter: true },
    ),
    to: "/validation",
  },
});

export const Parsing = meta.story({
  args: {
    results: benchResults.parsing.valid,
    meanScaler: Bar.getScale(
      benchResults.parsing.valid.map((r) => r.mean),
      { lowerBetter: true },
    ),
    to: "/parsing",
  },
});

export const Standard = meta.story({
  args: {
    results: benchResults.standard.valid,
    meanScaler: Bar.getScale(
      benchResults.standard.valid.map((r) => r.mean),
      { lowerBetter: true },
    ),
    to: "/standard",
  },
});

export const String = meta.story({
  args: {
    results: benchResults.string["date-time"].valid,
    meanScaler: Bar.getScale(
      benchResults.string["date-time"].valid.map((r) => r.mean),
      { lowerBetter: true },
    ),
    to: "/string",
  },
});
