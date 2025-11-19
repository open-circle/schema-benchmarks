import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { AlertDialog } from "./alert";

const meta = {
  title: "Components/Dialog/Alert",
  component: AlertDialog,
  args: {
    open: true,
    title: "Discard draft?",
    message: "This cannot be undone.",
    confirmLabel: "Discard",
    onConfirm: fn(),
    onCancel: fn(),
    closeOnCancel: true,
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
