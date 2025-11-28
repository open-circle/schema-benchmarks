import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button, ButtonGroup } from ".";

const meta = {
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
    loading: false,
    tooltip: "Hello World",
    onClick: fn(),
    variant: "text",
    icon: "edit",
    children: "Edit",
  },
} satisfies Meta<typeof Button>;

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

export const Group: Story = {
  argTypes: {
    variant: {
      options: ["text", "outlined"],
    },
  },
  render: ({ variant, ...props }) => (
    <ButtonGroup variant={variant === "contained" ? "outlined" : variant}>
      <Button {...props}>One</Button>
      <Button {...props}>Two</Button>
      <Button {...props}>Three</Button>
    </ButtonGroup>
  ),
  args: {
    variant: "text",
  },
};

export const RichTooltip = {
  args: {
    tooltip: {
      subhead: "Hello World",
      supporting: "This is a tooltip",
      actions: <Button>OK</Button>,
    },
  },
};
