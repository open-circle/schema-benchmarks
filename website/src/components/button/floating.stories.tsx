import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { FloatingActionButton } from "./floating";

const meta = {
  title: "Components/Button/Floating",
  component: FloatingActionButton,
  args: {
    onClick: fn(),
    icon: "edit",
    children: "Edit",
  },
} satisfies Meta<typeof FloatingActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
