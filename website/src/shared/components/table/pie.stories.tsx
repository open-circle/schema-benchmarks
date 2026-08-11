import preview from "#storybook/preview";

import { Pie } from "./pie";

const meta = preview.meta({
  title: "Components/Table/Pie",
  component: Pie,
  argTypes: {
    value: {
      control: {
        type: "range",
        min: 0,
        max: 100,
      },
    },
  },
  args: {
    value: 50,
    max: 100,
    lowerBetter: false,
    showIcon: true,
  },
});

export const Default = meta.story();
