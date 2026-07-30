import preview from "#storybook/preview";

import { Admonition } from ".";
import { admonitionTypes } from "./constants.js";

import "./index.css";

const meta = preview.meta({
  title: "Components/Admonition",
  component: Admonition,
  argTypes: {
    type: {
      control: {
        type: "inline-radio",
      },
      options: admonitionTypes,
    },
  },
  args: {
    type: "note",
    children: "Hello World",
  },
});

export const Default = meta.story();
