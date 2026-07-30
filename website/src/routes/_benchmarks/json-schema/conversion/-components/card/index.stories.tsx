import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import { Bar } from "#src/shared/components/table/bar";
import preview from "#storybook/preview";

import "./index.css";
import { ConversionCard } from ".";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Conversion/Card",
  component: ConversionCard,
});

export const Default = meta.story({
  args: {
    result: jsonSchemaResults.bench[0]!,
    meanScaler: Bar.getScale(
      jsonSchemaResults.bench.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
