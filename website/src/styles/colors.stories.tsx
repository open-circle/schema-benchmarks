import type { Meta, StoryObj } from "@storybook/react-vite";
import "./colors.stories.css";

const colors = [
	"primary",
	"secondary",
	"pink",
	"red",
	"deep-orange",
	"orange",
	"amber",
	"yellow",
	"lime",
	"light-green",
	"green",
	"teal",
];

const meta = {
	title: "Theme/Colors",
	render: () => (
		<div className="colors-container">
			{colors.map((color) => (
				<div
					key={color}
					className="color-box"
					style={{
						backgroundColor: `var(--${color})`,
						color: `var(--on-${color})`,
					}}
				>
					{color}
				</div>
			))}
		</div>
	),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
