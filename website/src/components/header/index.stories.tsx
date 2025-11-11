import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from ".";

const meta = {
	title: "Header",
	component: Header,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		name: "Page name",
	},
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
