import type { DistributiveOmit } from "@schema-benchmarks/utils";
import { type ComponentProps, useState } from "react";
import { fn } from "storybook/test";
import preview from "#storybook/preview";
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

const meta = preview.meta({
  title: "Components/Button/Toggle",
  component: ToggleButton,
  render: (args) => <ToggleButtonDemo {...args} />,
  args: {
    loading: false,
    disabled: false,
    children: <MdSymbol>favorite</MdSymbol>,
    tooltip: "Favorite",
    onClick: fn(),
  },
});

export const Default = meta.story();

function ToggleButtonGroupDemo({
  orientation,
}: {
  orientation?: "horizontal" | "vertical";
}) {
  const [active, setActive] = useState(0);
  return (
    <ButtonGroup
      variant="outlined"
      orientation={orientation}
      ariaLabel="Emotion"
    >
      <ToggleButton
        active={active === 0}
        onClick={() => setActive(0)}
        tooltip="Happy"
      >
        <MdSymbol>sentiment_very_satisfied</MdSymbol>
      </ToggleButton>
      <ToggleButton
        active={active === 1}
        onClick={() => setActive(1)}
        tooltip="Sad"
      >
        <MdSymbol>sentiment_very_dissatisfied</MdSymbol>
      </ToggleButton>
    </ButtonGroup>
  );
}

export const Group = meta.story({
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    tooltip: {
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
});

export const VerticalGroup = meta.story({
  ...Group.input,
  render: () => <ToggleButtonGroupDemo orientation="vertical" />,
});
