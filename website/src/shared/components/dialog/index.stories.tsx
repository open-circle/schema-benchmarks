import { Button } from "#src/shared/components/button";
import preview from "#storybook/preview";

import {
  type CloseDialog,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogMessage,
} from ".";

const meta = preview.meta({
  title: "Components/Dialog",
  component: Dialog,
  argTypes: {
    closedby: {
      control: {
        type: "inline-radio",
      },
      options: ["any", "closerequest", "none"],
    },
  },
  args: {
    open: true,
    children: ({ close }: CloseDialog) => (
      <>
        <DialogContent className="dialog__content">
          <DialogTitle className="dialog__title">Hello world</DialogTitle>
          <DialogMessage className="dialog__message">This is a dialog</DialogMessage>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close()}>Close</Button>
        </DialogActions>
      </>
    ),
    closedby: "any",
  } as const,
});

export const Default = meta.story();
