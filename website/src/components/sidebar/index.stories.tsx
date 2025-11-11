import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from ".";

const meta = {
	title: "Components/Sidebar",
	component: Sidebar,
	parameters: {
		layout: "fullscreen",
	},
	render: () => (
		<div className="sidebar-container">
			<Sidebar />
		</div>
	),
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
