import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import preview from "#storybook/preview";

import { SupportMatrixCard } from "./card";

import "./card.css";

const library = "valibot";
const { version, matrix: supportMatrix } = jsonSchemaResults.conversion.toJsonSupport[library]!;

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Conversion/ToJson/Matrix/Card",
  component: SupportMatrixCard,
  args: {
    library,
    version,
    supportMatrix,
  },
});

export const Default = meta.story({});
