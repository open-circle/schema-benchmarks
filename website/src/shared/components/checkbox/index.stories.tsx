import preview from "#storybook/preview";

import { Checkbox, ControlLabel } from ".";

const meta = preview.meta({
  title: "Components/Checkbox",
  render: (args) => (
    <>
      <Checkbox name="group" defaultChecked value="foo" {...args} />
      <Checkbox name="group" value="bar" {...args} />
      <Checkbox name="group" value="baz" {...args} />
    </>
  ),
  args: {
    disabled: false,
  },
});

export const Default = meta.story();

export const Label = meta.story({
  render: (args) => (
    <ControlLabel>
      <Checkbox name="group" defaultChecked value="foo" {...args} />
      Label
    </ControlLabel>
  ),
});
