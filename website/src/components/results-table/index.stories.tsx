import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResultsTable } from ".";

const meta = {
	title: "Components/ResultsTable",
	component: ResultsTable,
	args: {
		results: [
			{ libraryName: "ajv", note: "validate", rank: 1 },
			{ libraryName: "ajv", note: "compile", rank: 2 },
			{ libraryName: "valibot", note: undefined, rank: 3 },
			{ libraryName: "zod", note: undefined, rank: 4 },
			{ libraryName: "zod", note: "jitless", rank: 5 },
			{ libraryName: "zod/mini", note: undefined, rank: 6 },
			{ libraryName: "zod/mini", note: "jitless", rank: 7 },
		],
	},
} satisfies Meta<typeof ResultsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
