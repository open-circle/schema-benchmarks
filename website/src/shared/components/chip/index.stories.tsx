import { useState } from "react";
import preview from "../../../../.storybook/preview";
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

const meta = preview.meta({
  title: "Components/Chip",
  render: () => <ChipDemo />,
});

export const Default = meta.story();
