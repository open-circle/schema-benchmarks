import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";
import { shallowFilter } from "@schema-benchmarks/utils";

import preview from "#storybook/preview";

import { BaseJsonConversionPlot } from ".";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Plot",
  component: BaseJsonConversionPlot,
});

export const JsonSchema = meta.story({
  args: {
    data: jsonSchemaResults.conversion.toJson.filter(
      shallowFilter({
        target: "draft-2020-12",
        direction: "input",
      }),
    ),
  },
});
