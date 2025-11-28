import type { Meta, StoryObj } from "@storybook/react-vite";
import { colors } from "@/styles/colors";
import { Spinner } from ".";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  argTypes: {
    dir: {
      table: {
        disable: true,
      },
    },
    ...Object.fromEntries(
      ["color1", "color2", "color3", "color4", "singleColor"].map((color) => [
        color,
        {
          control: {
            type: "select",
          },
          options: colors,
        },
      ]),
    ),
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleColor: Story = {
  args: {
    singleColor: "primary",
  },
};
