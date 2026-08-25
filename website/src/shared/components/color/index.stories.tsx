import preview from "#storybook/preview";

import { ColorDisplay } from ".";

const meta = preview.meta({
  title: "Components/ColorDisplay",
  component: ColorDisplay,
  args: {
    color: "#ff0000",
    size: "medium" as const,
  },
  argTypes: {
    size: {
      control: {
        type: "inline-radio",
        options: ["small", "medium", "large"],
      },
    },
    color: {
      control: "color",
    },
  },
});

export default meta;

export const Default = meta.story();
