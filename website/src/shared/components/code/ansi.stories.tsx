import { decorations } from "ansi-sequence-parser";
import ansi from "dedent";

import preview from "#storybook/preview";

import { AnsiBlock } from "./ansi";

const colors = {
  black: [30, 40],
  red: [31, 41],
  green: [32, 42],
  yellow: [33, 43],
  blue: [34, 44],
  magenta: [35, 45],
  cyan: [36, 46],
  white: [37, 47],
  brightBlack: [90, 100],
  brightRed: [91, 101],
  brightGreen: [92, 102],
  brightYellow: [93, 103],
  brightBlue: [94, 104],
  brightMagenta: [95, 105],
  brightCyan: [96, 106],
  brightWhite: [97, 107],
};

const meta = preview.meta({
  title: "Components/Code/Ansi",
  component: AnsiBlock,
  args: {
    children: ansi(`
      ${Object.entries(decorations)
        .map(([n, name]) => `\x1b[${n}m${name}\x1b[0m`)
        .join("\n")}
      ${Object.entries(colors)
        .map(([name, [fg, bg]]) => `\x1b[${fg}m${name}\x1b[0m \x1b[${bg}m${name}\x1b[0m`)
        .join("\n")}

      
      \x1b[7mReversed\x1b[0m
      ${Object.entries(colors)
        .map(
          ([name, [fg, bg]]) => `\x1b[7m\x1b[${fg}m${name}\x1b[0m \x1b[7m\x1b[${bg}m${name}\x1b[0m`,
        )
        .join("\n")}
    `),
    lineNumbers: true,
  },
});

export const Default = meta.story();
