import { fn } from "storybook/test";
import preview from "#storybook/preview";
import { AlertDialog } from "./alert";

const meta = preview.meta({
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
});

export const Default = meta.story();
