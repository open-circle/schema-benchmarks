import { fn } from "storybook/test";

import preview from "#storybook/preview";

import { MdSymbol } from "../symbol";
import { FloatingActionButton } from "./floating";

const meta = preview.meta({
  title: "Components/Button/Floating",
  component: FloatingActionButton,
  args: {
    onClick: fn(),
    icon: <MdSymbol>edit</MdSymbol>,
    children: "Edit",
  },
});

export const Default = meta.story();
