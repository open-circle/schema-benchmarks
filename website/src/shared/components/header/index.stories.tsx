import { fn } from "storybook/test";

import preview from "#storybook/preview";

import { Header } from ".";

const meta = preview.meta({
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onPrefs: fn(),
  },
});

export const Default = meta.story();
