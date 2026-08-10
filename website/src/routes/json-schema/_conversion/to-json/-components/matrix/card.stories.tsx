import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import preview from "#storybook/preview";

import { SupportMatrixCard } from "./card";

import "./card.css";

const library = "valibot";
const { matrix: supportMatrix, ...props } = jsonSchemaResults.conversion.toJsonSupport[library]!;

const meta = preview.meta({
  title: "Features/JsonSchema/Conversion/ToJson/Matrix/Card",
  component: SupportMatrixCard,
  args: {
    library,
    supportMatrix,
    ...props,
  },
});

export const Default = meta.story({});
