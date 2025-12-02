import benchResults from "@schema-benchmarks/bench/bench.json";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BenchTable } from "./index.js";

const meta = {
  title: "Features/Benchmark/Table",
  component: BenchTable,
  args: {
    results: benchResults.validation.invalid,
  },
} satisfies Meta<typeof BenchTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
