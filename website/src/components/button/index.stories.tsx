import type { Meta, StoryObj } from "@storybook/react-vite";
import clsx from "clsx";
import { useState } from "react";
import { MdSymbol } from "../symbol";
import { type ButtonProps, getButtonClasses, type ToggleButtonProps } from ".";

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
} satisfies Meta<(ButtonProps | ToggleButtonProps) & { disabled: boolean }>;

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

function ToggleButton({ disabled }: { disabled: boolean }) {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      className={clsx(getButtonClasses({ variant: "toggle" }), {
        active,
      })}
      onClick={() => setActive(!active)}
      disabled={disabled}
    >
      <MdSymbol>favorite</MdSymbol>
    </button>
  );
}

export const Toggle: Story = {
  render: ({ disabled }) => <ToggleButton disabled={disabled} />,
  argTypes: {
    variant: {
      table: {
        disable: true,
      },
    },
    color: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    variant: "toggle",
    color: undefined,
  },
};

export const Link: Story = {
  render: ({ disabled, ...props }) => (
    <a className={getButtonClasses(props)} aria-disabled={disabled}>
      <MdSymbol>edit</MdSymbol>
      Edit
    </a>
  ),
  args: {
    variant: "contained",
  },
};

export const LinkToggle: Story = {
  render: ({ disabled }) => (
    <a
      className={getButtonClasses({ variant: "toggle" })}
      aria-disabled={disabled}
    >
      <MdSymbol>favorite</MdSymbol>
    </a>
  ),
  argTypes: {
    variant: {
      table: {
        disable: true,
      },
    },
    color: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    variant: "toggle",
    color: undefined,
  },
};
