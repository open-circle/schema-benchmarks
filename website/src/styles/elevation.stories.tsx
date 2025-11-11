import type { Meta, StoryObj } from "@storybook/react-vite";
import clsx from "clsx";
import "./elevation.stories.css";

const meta = {
	title: "Theme/Elevation",
	render: () => (
		<div className="elevation-container">
			{Array.from({ length: 25 }, (_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: Not dynamic
					key={i}
					className={clsx("elevation-box", i === 0 && "bordered")}
					style={
						{
							boxShadow: `var(--elevation-${i})`,
							"--elevation-overlay-opacity": `var(--elevation-${i}-overlay-opacity)`,
						} as React.CSSProperties
					}
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
		<div className="elevation-box elevation-transition">Hover me</div>
	),
};
