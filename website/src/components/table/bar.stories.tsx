import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar } from "./bar";

const scale = Bar.getScale([0, 100]);

const meta = {
  title: "Components/Table/Bar",
  render: (args) => <Bar {...scale(args.percentage)} />,
  argTypes: {
    percentage: {
      control: {
        type: "range",
        min: 0,
        max: 100,
      },
    },
  },
  args: {
    percentage: 50,
  },
} satisfies Meta<{ percentage: number }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
