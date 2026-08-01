import { getOrInsertComputed } from "@schema-benchmarks/utils";

import preview from "#storybook/preview";

import { Pie } from "./pie";

const pieScale = new Map<boolean, ReturnType<typeof Pie.getScale>>();

const meta = preview.type<{ args: { percentage: number; lowerBetter: boolean } }>().meta({
  title: "Components/Table/Pie",
  render: ({ percentage, lowerBetter }) => (
    <Pie
      {...getOrInsertComputed(pieScale, lowerBetter, () => Pie.getScale([0, 100], { lowerBetter }))(
        percentage,
      )}
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
