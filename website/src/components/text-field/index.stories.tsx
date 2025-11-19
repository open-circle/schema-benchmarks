import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleButton } from "../button";
import { MdSymbol } from "../symbol";
import { TextField } from ".";

const meta = {
  title: "Components/Text Field",
  component: TextField,
  argTypes: {
    type: {
      control: {
        type: "inline-radio",
      },
      options: ["text", "number", "email", "password"],
    },
  },
  args: {
    type: "text",
    placeholder: "Placeholder",
    helpText: "Some help text",
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Errored: Story = {
  args: {
    errorMessage: "Field is required",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const StartIcon: Story = {
  args: {
    startIcon: "speed",
  },
};

export const EndIcon: Story = {
  args: {
    endIcon: "speed",
  },
};

export const EndButton: Story = {
  args: {
    endIcon: (
      <ToggleButton>
        <MdSymbol>cancel</MdSymbol>
      </ToggleButton>
    ),
    endIconIsButton: true,
  },
};

export const Prefix: Story = {
  args: {
    type: "number",
    prefix: "$",
  },
};

export const Suffix: Story = {
  args: {
    type: "number",
    suffix: "/ 100",
  },
};
