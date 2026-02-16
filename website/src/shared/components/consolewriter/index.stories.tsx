import preview from "#storybook/preview";

import { ConsoleWriter } from ".";

const meta = preview.meta({
  title: "Components/ConsoleWriter",
  component: ConsoleWriter,
  args: {
    children: "Hello World",
  },
});

export const Default = meta.story();
