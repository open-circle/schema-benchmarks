import { fn } from "storybook/test";

import { MdSymbol } from "#src/shared/components/symbol";
import preview from "#storybook/preview";

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
