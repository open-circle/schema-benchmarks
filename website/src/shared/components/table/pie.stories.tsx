import { getOrInsertComputed } from "@schema-benchmarks/utils";

import preview from "#storybook/preview";

import { Pie } from "./pie";

const pieScale = new Map<boolean, ReturnType<typeof Pie.getScale>>();

const meta = preview
  .type<{ args: { percentage: number; lowerBetter: boolean; showIcon: boolean } }>()
  .meta({
    title: "Components/Table/Pie",
    render: ({ percentage, lowerBetter, showIcon }) => (
      <Pie
        {...getOrInsertComputed(pieScale, lowerBetter, () =>
          Pie.getScale([0, 100], { lowerBetter }),
        )(percentage)}
        {...{ lowerBetter, showIcon }}
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
      showIcon: true,
    },
  });

export const Default = meta.story();
