import results from "@schema-benchmarks/bench/bench.json";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResultsTable } from ".";

const meta = {
  title: "Components/Results Table",
  parameters: {
    layout: "centered",
  },
  component: ResultsTable,
  args: {
    results: results.validation.runtime.invalid,
  },
} satisfies Meta<typeof ResultsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
