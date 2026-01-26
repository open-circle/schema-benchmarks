import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "@/shared/components/button";
import { ConfirmDialog } from ".";
import { confirm } from "./queue";

const meta = {
  title: "Components/Dialog/Alert/Confirm",
  render: ({ onConfirm, onCancel, onFinally }) => (
    <>
      <Button
        onClick={() => {
          confirm({
            title: "Discard draft?",
            message: "This cannot be undone.",
            confirmLabel: "Discard",
          })
            .then(onConfirm)
            .otherwise(onCancel)
            .finally(onFinally);
        }}
      >
        Open
      </Button>
      <ConfirmDialog />
    </>
  ),
  args: {
    onConfirm: fn(),
    onCancel: fn(),
    onFinally: fn(),
  },
} satisfies Meta<{
  onConfirm: () => void;
  onCancel: () => void;
  onFinally: () => void;
}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
