import type { DistributiveOmit } from "@schema-benchmarks/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { fn } from "storybook/test";
import { MdSymbol } from "../symbol";
import { ButtonGroup } from ".";
import { ToggleButton } from "./toggle";

function ToggleButtonDemo(
  props: DistributiveOmit<ComponentProps<typeof ToggleButton>, "active">,
) {
  const [active, setActive] = useState(false);
  return (
    <ToggleButton
      active={active}
      {...props}
      onClick={(e) => {
        setActive((b) => !b);
        props.onClick?.(e);
      }}
    />
  );
}

const meta = {
  title: "Components/Button/Toggle",
  component: ToggleButton,
  render: (args) => <ToggleButtonDemo {...args} />,
  argTypes: {
    activeColor: {
      control: {
        type: "inline-radio",
      },
      options: ["primary", "secondary", "danger", undefined],
    },
  },
  args: {
    activeColor: undefined,
    children: <MdSymbol>favorite</MdSymbol>,
    title: "Favorite",
    onClick: fn(),
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function ToggleButtonGroupDemo({
  activeColor,
}: Pick<ComponentProps<typeof ToggleButton>, "activeColor">) {
  const [active, setActive] = useState(0);
  return (
    <ButtonGroup variant="outlined">
      <ToggleButton
        activeColor={activeColor}
        active={active === 0}
        onClick={() => setActive(0)}
        title="Happy"
      >
        <MdSymbol>sentiment_very_satisfied</MdSymbol>
      </ToggleButton>
      <ToggleButton
        activeColor={activeColor}
        active={active === 1}
        onClick={() => setActive(1)}
        title="Sad"
      >
        <MdSymbol>sentiment_very_dissatisfied</MdSymbol>
      </ToggleButton>
    </ButtonGroup>
  );
}

export const Group: Story = {
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    title: {
      table: {
        disable: true,
      },
    },
    active: {
      table: {
        disable: true,
      },
    },
    onClick: {
      table: {
        disable: true,
      },
    },
  },
  render: () => <ToggleButtonGroupDemo />,
};
