import preview from "#storybook/preview";
import { MdSymbol, type MdSymbolProps } from ".";

const meta = preview.type<{ args: MdSymbolProps }>().meta({
  title: "Components/MdSymbol",
  component: MdSymbol,
  argTypes: {
    weight: {
      control: {
        type: "range",
        min: 100,
        max: 700,
        step: 100,
      },
    },
    grade: {
      control: {
        type: "range",
        min: -25,
        max: 200,
      },
    },
    size: {
      control: {
        type: "range",
        min: 20,
        max: 48,
      },
    },
    opticalSize: {
      control: {
        type: "range",
        min: 20,
        max: 48,
      },
    },
    dir: {
      control: {
        type: "inline-radio",
      },
      options: ["ltr", "rtl"],
    },
  },
  args: {
    children: "edit",
    fill: false,
    weight: 400,
    grade: undefined,
    opticalSize: undefined,
    size: 24,
    flipRtl: false,
    dir: "ltr",
  } as const,
});

export const Default = meta.story();
