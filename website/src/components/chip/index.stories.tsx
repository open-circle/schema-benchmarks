import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MdSymbol } from "../symbol";
import { Chip, ChipCollection } from ".";

function ChipDemo() {
  const [selected, setSelected] = useState("foo");
  return (
    <ChipCollection>
      <Chip activated={selected === "foo"} onClick={() => setSelected("foo")}>
        <MdSymbol>edit</MdSymbol>
        Foo
      </Chip>
      <Chip activated={selected === "bar"} onClick={() => setSelected("bar")}>
        <MdSymbol>edit</MdSymbol>
        Bar
      </Chip>
    </ChipCollection>
  );
}

const meta = {
  title: "Components/Chip",
  render: () => <ChipDemo />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
