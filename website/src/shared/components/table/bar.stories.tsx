import { getOrInsertComputed } from "@schema-benchmarks/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar } from "./bar";

const barScale = new Map<boolean, ReturnType<typeof Bar.getScale>>();

const meta = {
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
} satisfies Meta<{ percentage: number; lowerBetter: boolean }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
