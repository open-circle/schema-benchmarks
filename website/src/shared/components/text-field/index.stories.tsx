import preview from "#storybook/preview";

import { TextField } from ".";
import { ToggleButton } from "../button/toggle";
import { MdSymbol } from "../symbol";

const meta = preview.meta({
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
});

export const Default = meta.story();

export const Errored = meta.story({
  args: {
    errorMessage: "Field is required",
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

export const StartIcon = meta.story({
  args: {
    startIcon: <MdSymbol>speed</MdSymbol>,
  },
});

export const EndIcon = meta.story({
  args: {
    endIcon: <MdSymbol>speed</MdSymbol>,
  },
});

export const EndButton = meta.story({
  args: {
    endIcon: (
      <ToggleButton tooltip="Clear">
        <MdSymbol>cancel</MdSymbol>
      </ToggleButton>
    ),
    endIconIsButton: true,
  },
});

export const Prefix = meta.story({
  args: {
    type: "number",
    prefix: "$",
  },
});

export const Suffix = meta.story({
  args: {
    type: "number",
    suffix: "/ 100",
  },
});
