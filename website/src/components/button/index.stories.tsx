import type { Meta, StoryObj } from "@storybook/react-vite";
import { MdSymbol } from "../symbol";
import { type ButtonProps, getButtonClasses } from ".";

const meta = {
  title: "Components/Button",
  render: ({ disabled, ...props }) => (
    <button
      type="button"
      className={getButtonClasses(props)}
      disabled={disabled}
    >
      <MdSymbol>edit</MdSymbol>
      Edit
    </button>
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
  },
  args: {
    color: "primary",
    disabled: false,
  },
} satisfies Meta<ButtonProps & { disabled: boolean }>;

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
