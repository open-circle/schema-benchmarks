import type { Meta, StoryObj } from "@storybook/react-vite";
import ts from "dedent";
import { ResultsTable } from ".";

const meta = {
	title: "Components/ResultsTable",
	component: ResultsTable,
	args: {
		results: [
			{
				libraryName: "ajv",
				note: "validate",
				rank: 1,
				snippet: ts`ajv.validate(schema, data)`,
			},
			{
				libraryName: "ajv",
				note: "compile",
				rank: 2,
				snippet: ts`
					// const validate = ajv.compile(schema);
					validate(data);
				`,
			},
			{ libraryName: "valibot", rank: 3, snippet: ts`v.is(schema, data)` },
			{ libraryName: "arktype", rank: 4, snippet: ts`schema.allows(data)` },
			{
				libraryName: "effect",
				rank: 5,
				snippet: ts`
					// const is = Schema.is(schema);
					is(data);
				`,
			},
			{
				libraryName: "typebox",
				rank: 6,
				snippet: ts`Value.Check(schema, data)`,
			},
			{ libraryName: "yup", rank: 7, snippet: ts`schema.isValidSync(data)` },
		],
	},
} satisfies Meta<typeof ResultsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
