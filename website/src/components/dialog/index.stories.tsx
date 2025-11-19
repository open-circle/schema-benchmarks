import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Dialog } from ".";

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
      <div>
        <p>Hello World</p>
        <Button onClick={() => close()}>Close</Button>
      </div>
    ),
    closedby: "any",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
