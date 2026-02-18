import preview from "#storybook/preview";

import { CodeBlock, InlineCode } from "./index.js";

const meta = preview.meta({
  title: "Components/Code",
  component: CodeBlock,
  args: {
    children: "const foo = 'bar';",
    language: "typescript",
    lineNumbers: false,
    title: "CodeBlock",
  },
});

export const Default = meta.story();

export const Inline = meta.story({
  argTypes: {
    title: {
      table: {
        disable: true,
      },
    },
    lineNumbers: {
      table: {
        disable: true,
      },
    },
  },
  render: ({ children, language }) => <InlineCode language={language}>{children}</InlineCode>,
});
