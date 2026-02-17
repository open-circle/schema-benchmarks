import { fn } from "storybook/test";

import preview from "#storybook/preview";

import { SortableHeaderButton } from "./sort";

const meta = preview.meta({
  title: "Components/Table/Sort",
  component: SortableHeaderButton,
  argTypes: {
    "aria-sort": {
      control: {
        type: "inline-radio",
      },
      options: ["ascending", "descending", "none", "other", undefined],
    },
  },
  args: {
    "aria-sort": undefined,
    children: "Name",
    onClick: fn(),
  },
});

export const Default = meta.story();
