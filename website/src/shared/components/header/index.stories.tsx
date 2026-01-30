import preview from "#storybook/preview";
import { Header } from ".";

const meta = preview.meta({
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
});

export const Default = meta.story();
