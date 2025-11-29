import type { Meta, StoryObj } from "@storybook/react-vite";
import "./animation.stories.css";

const curves = [
  "enter",
  "exit-permanent",
  "standard",
  "exit-temporary",
] as const;
type Curve = (typeof curves)[number];

const meta = {
  title: "Theme/Animation",
  render: ({ curve }) => (
    <div className="animation-container">
      <div
        className="animation-box card"
        style={{ animationTimingFunction: `var(--${curve}-curve)` }}
      >
        {curve}
      </div>
    </div>
  ),
  argTypes: {
    curve: {
      control: {
        type: "radio",
      },
      options: curves,
    },
  },
  args: {
    curve: "standard",
  },
} satisfies Meta<{ curve: Curve }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
