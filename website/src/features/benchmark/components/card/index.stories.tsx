import benchResults from "@schema-benchmarks/bench/bench.json";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BenchCard } from ".";
import "./index.css";
import { Bar } from "@/shared/components/table/bar";

const meta = {
  title: "Features/Benchmark/Card",
  component: BenchCard,
} satisfies Meta<typeof BenchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initialization: Story = {
  args: {
    // biome-ignore lint/style/noNonNullAssertion: demo data
    result: benchResults.initialization[0]!,
    barScale: Bar.getScale(
      benchResults.initialization.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
};

export const Validation: Story = {
  args: {
    // biome-ignore lint/style/noNonNullAssertion: demo data
    result: benchResults.validation.valid[0]!,
    barScale: Bar.getScale(
      benchResults.validation.valid.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
};

export const Parsing: Story = {
  args: {
    // biome-ignore lint/style/noNonNullAssertion: demo data
    result: benchResults.parsing.valid[0]!,
    barScale: Bar.getScale(
      benchResults.parsing.valid.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
};
