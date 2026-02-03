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
    singleColor: {
      control: "text",
    },
  },
});

export const Default = meta.story();

export const SingleColor = meta.story({
  args: {
    singleColor: "spinner1",
  },
});
