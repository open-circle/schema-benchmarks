import { fn } from "storybook/test";

import { Button } from "#/shared/components/button";
import preview from "#storybook/preview";

import { ConfirmDialog } from ".";
import { confirm } from "./queue";

const meta = preview.meta({
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
});

export const Default = meta.story();
