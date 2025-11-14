import type { Meta, StoryObj } from "@storybook/react-vite";
import { Scaler } from ".";

const meta = {
  title: "Components/Scaler",
  component: Scaler,
  render: (props) => <Scaler {...props}>{props.value}</Scaler>,
  argTypes: {
    value: {
      control: {
        type: "range",
        min: 0,
        max: 100,
      },
    },
    type: {
      control: {
        type: "inline-radio",
      },
      options: ["sentiment", "stat"],
    },
  },
  args: {
    value: 0,
    bounds: {
      highest: 100,
      lowest: 0,
    },
    type: "sentiment",
    lowerBetter: false,
  },
} satisfies Meta<typeof Scaler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
