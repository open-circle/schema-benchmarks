import { fn } from "storybook/test";

import preview from "#storybook/preview";

import { Button, ButtonGroup } from ".";
import { MdSymbol } from "../symbol";

const meta = preview.meta({
  title: "Components/Button",
  component: Button,
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
      options: ["success", "error", "warning", "info", undefined],
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
  },
  args: {
    color: undefined,
    disabled: false,
    loading: false,
    tooltip: "Hello World",
    onClick: fn(),
    variant: "text",
    icon: <MdSymbol>edit</MdSymbol>,
    children: "Edit",
  },
});

export const Text = meta.story({
  args: {
    variant: "text",
  },
});

export const Outlined = meta.story({
  args: {
    variant: "outlined",
  },
});

export const Contained = meta.story({
  args: {
    variant: "contained",
  },
});

export const Group = meta.story({
  argTypes: {
    variant: {
      options: ["text", "outlined"],
    },
  },
  render: ({ variant, ...props }) => (
    <ButtonGroup variant={variant === "contained" ? "outlined" : variant} ariaLabel="Group">
      <Button {...props}>One</Button>
      <Button {...props}>Two</Button>
      <Button {...props}>Three</Button>
    </ButtonGroup>
  ),
  args: {
    variant: "text",
  },
});

export const VerticalGroup = Group.extend({
  render: ({ variant, ...props }) => (
    <ButtonGroup
      variant={variant === "contained" ? "outlined" : variant}
      orientation="vertical"
      ariaLabel="Group"
    >
      <Button {...props}>One</Button>
      <Button {...props}>Two</Button>
      <Button {...props}>Three</Button>
    </ButtonGroup>
  ),
});

export const RichTooltip = meta.story({
  args: {
    tooltip: {
      subhead: "Hello World",
      supporting: "This is a tooltip",
      actions: <Button>OK</Button>,
    },
  },
});
