import type { DistributiveOmit } from "@schema-benchmarks/utils";
import { type ComponentProps, useState } from "react";
import { fn } from "storybook/test";
import { defaultPatterns } from "web-haptics";

import preview from "#storybook/preview";

import { ButtonGroup } from ".";
import { MdSymbol } from "../symbol";
import { ToggleButton } from "./toggle";

function ToggleButtonDemo(props: DistributiveOmit<ComponentProps<typeof ToggleButton>, "active">) {
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
  argTypes: {
    haptic: {
      control: {
        type: "inline-radio",
      },
      options: [true, "light", "medium", "heavy", undefined],
      mapping: {
        light: defaultPatterns.light.pattern,
        medium: defaultPatterns.medium.pattern,
        heavy: defaultPatterns.heavy.pattern,
      },
    },
  },
  args: {
    loading: false,
    disabled: false,
    children: <MdSymbol>favorite</MdSymbol>,
    tooltip: "Favorite",
    onClick: fn(),
    haptic: undefined,
  } as const,
});

export const Default = meta.story();

function ToggleButtonGroupDemo({ orientation }: { orientation?: "horizontal" | "vertical" }) {
  const [active, setActive] = useState(0);
  return (
    <ButtonGroup variant="outlined" orientation={orientation} ariaLabel="Emotion">
      <ToggleButton active={active === 0} onClick={() => setActive(0)} tooltip="Happy" haptic>
        <MdSymbol>sentiment_very_satisfied</MdSymbol>
      </ToggleButton>
      <ToggleButton active={active === 1} onClick={() => setActive(1)} tooltip="Sad" haptic>
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

export const VerticalGroup = Group.extend({
  render: () => <ToggleButtonGroupDemo orientation="vertical" />,
});
