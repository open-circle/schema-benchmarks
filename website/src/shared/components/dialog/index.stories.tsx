import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Dialog, DialogActions } from ".";

const meta = {
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
    children: (close) => (
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
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
