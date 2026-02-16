import preview from "#storybook/preview";

import { Radio } from ".";

const meta = preview.meta({
  title: "Components/Radio",
  render: (args) => (
    <>
      <Radio name="group" defaultChecked value="foo" {...args} />
      <Radio name="group" value="bar" {...args} />
      <Radio name="group" value="baz" {...args} />
    </>
  ),
  args: {
    disabled: false,
  },
});

export const Default = meta.story();
