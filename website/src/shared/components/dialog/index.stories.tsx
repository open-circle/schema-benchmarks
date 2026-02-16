import preview from "#storybook/preview";

import { type CloseDialog, Dialog, DialogActions } from ".";
import { Button } from "../button";

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
    children: (close: CloseDialog) => (
      <>
        <div className="dialog__content">
          <h2 className="dialog__title">Hello world</h2>
          <p className="dialog__message">This is a dialog</p>
        </div>
        <DialogActions>
          <Button onClick={() => close()}>Close</Button>
        </DialogActions>
      </>
    ),
    closedby: "any",
  } as const,
});

export const Default = meta.story();
