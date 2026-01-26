import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarList } from ".";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: {
    label: "EskiMojo14",
    size: "md",
  },
  argTypes: {
    size: {
      control: {
        type: "inline-radio",
      },
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Image: Story = {
  args: {
    src: "https://github.com/EskiMojo14.png",
  },
};

export const List: Story = {
  render: ({ size }) => (
    <AvatarList
      items={[
        { label: "EskiMojo14", src: "https://github.com/EskiMojo14.png" },
        { label: "fabian-hiller", src: "https://github.com/fabian-hiller.png" },
        { label: "open-circle" },
      ]}
      size={size}
    />
  ),
};
