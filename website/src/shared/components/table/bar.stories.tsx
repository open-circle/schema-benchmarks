import { getOrInsertComputed } from "@schema-benchmarks/utils";
import preview from "#storybook/preview";
import { Bar } from "./bar";

const barScale = new Map<boolean, ReturnType<typeof Bar.getScale>>();

const meta = preview
  .type<{ args: { percentage: number; lowerBetter: boolean } }>()
  .meta({
    title: "Components/Table/Bar",
    render: ({ percentage, lowerBetter }) => (
      <Bar
        {...getOrInsertComputed(barScale, lowerBetter, () =>
          Bar.getScale([0, 100], { lowerBetter }),
        )(percentage)}
      />
    ),
    argTypes: {
      percentage: {
        control: {
          type: "range",
          min: 0,
          max: 100,
        },
      },
    },
    args: {
      percentage: 50,
      lowerBetter: false,
    },
  });

export const Default = meta.story();
