import preview from "#storybook/preview";
import { Spinner } from ".";

const meta = preview.meta({
  title: "Components/Spinner",
  component: Spinner,
  argTypes: {
    dir: {
      table: {
        disable: true,
      },
    },
    size: {
      control: {
        type: "range",
        min: 16,
        max: 64,
      },
    },
    segmentCount: {
      control: {
        type: "range",
        min: 1,
        max: 5,
      },
    },
    inheritColor: {
      control: {
        type: "boolean",
      },
    },
  },
  args: {
    size: 24,
    segmentCount: 5,
    inheritColor: false,
  },
});

export const Default = meta.story();
