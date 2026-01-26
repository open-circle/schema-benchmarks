import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from ".";

const meta = {
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
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
