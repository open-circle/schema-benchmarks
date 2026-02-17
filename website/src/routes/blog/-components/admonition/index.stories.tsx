import preview from "#storybook/preview";

import { admonitionTypes } from "./constants.js";
import { Admonition } from "./index.js";

import "./index.css";

const meta = preview.meta({
  title: "Features/Blog/Admonition",
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
