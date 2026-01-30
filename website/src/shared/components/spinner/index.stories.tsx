import { colors } from "#/shared/styles/colors";
import preview from "../../../../.storybook/preview";
import { Spinner } from ".";

const meta = preview.meta({
  title: "Components/Spinner",
  component: Spinner,
  argTypes: {
    dir: {
      table: {
        disable: true,
      },
    },
    ...Object.fromEntries(
      ["color1", "color2", "color3", "color4", "singleColor"].map((color) => [
        color,
        {
          control: {
            type: "select",
          },
          options: colors,
        },
      ]),
    ),
  },
});

export const Default = meta.story();

export const SingleColor = meta.story({
  args: {
    singleColor: "primary",
  },
});
