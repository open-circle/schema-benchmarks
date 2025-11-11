import type { Meta, StoryObj } from "@storybook/react-vite";
import "./elevation.stories.css";

const meta = {
	title: "Theme/Elevation",
	render: () => (
		<div className="elevation-container">
			{Array.from({ length: 25 }, (_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: Not dynamic
					key={i}
					className="elevation-box"
					style={{ boxShadow: `var(--elevation-${i})` } as React.CSSProperties}
				>
					{i}
				</div>
			))}
		</div>
	),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Transition: Story = {
	render: () => (
		<div className="elevation-container">
			<div className="elevation-box elevation-transition">Hover me</div>
		</div>
	),
};
