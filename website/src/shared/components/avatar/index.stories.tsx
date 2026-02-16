import preview from "#storybook/preview";

import { Avatar, AvatarList } from ".";

const meta = preview.meta({
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      control: {
        type: "inline-radio",
      },
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    label: "EskiMojo14",
    size: "md",
  } as const,
});

export const Default = meta.story();

export const Image = meta.story({
  args: {
    src: "https://github.com/EskiMojo14.png",
  },
});

export const List = meta.story({
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
});
