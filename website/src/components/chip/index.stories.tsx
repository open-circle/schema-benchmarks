import type { Meta, StoryObj } from "@storybook/react-vite";
import clsx from "clsx";
import { useState } from "react";
import { MdSymbol } from "../symbol";

// biome-ignore lint/style/useComponentExportOnlyModules: demo component
function ChipDemo() {
  const [selected, setSelected] = useState("foo");
  return (
    <div className="chip-collection">
      <button
        type="button"
        className={clsx("chip", selected === "foo" && "selected")}
        onClick={() => setSelected("foo")}
      >
        <MdSymbol>edit</MdSymbol>
        Foo
      </button>
      <button
        type="button"
        className={clsx("chip", selected === "bar" && "selected")}
        onClick={() => setSelected("bar")}
      >
        <MdSymbol>edit</MdSymbol>
        Bar
      </button>
    </div>
  );
}

const meta = {
  title: "Components/Chip",
  render: () => <ChipDemo />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
