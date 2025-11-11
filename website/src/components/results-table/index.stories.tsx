import results from "@schema-benchmarks/bench/results.json";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResultsTable } from ".";

const meta = {
	title: "Components/ResultsTable",
	component: ResultsTable,
	args: {
		results: results.validation.runtime.error,
	},
} satisfies Meta<typeof ResultsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
