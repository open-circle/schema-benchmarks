import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleButton } from "../button/toggle";
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
    startIcon: <MdSymbol>speed</MdSymbol>,
  },
};

export const EndIcon: Story = {
  args: {
    endIcon: <MdSymbol>speed</MdSymbol>,
  },
};

export const EndButton: Story = {
  args: {
    endIcon: (
      <ToggleButton tooltip="Clear">
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
