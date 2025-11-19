import type { Meta, StoryObj } from "@storybook/react-vite";
import { MdSymbol } from "../symbol";
import { Button, type ButtonProps } from ".";

const meta = {
  title: "Components/Button",
  render: (props) => (
    <Button {...props}>
      <MdSymbol>edit</MdSymbol>
      Edit
    </Button>
  ),
  argTypes: {
    variant: {
      control: {
        type: "inline-radio",
      },
      options: ["text", "outlined", "contained"],
    },
    color: {
      control: {
        type: "inline-radio",
      },
      options: ["primary", "secondary", "danger"],
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
  },
  args: {
    color: "primary",
    disabled: false,
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: "text",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};

export const Contained: Story = {
  args: {
    variant: "contained",
  },
};
