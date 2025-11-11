import type { Meta, StoryObj } from "@storybook/react-vite";
import ts from "dedent";
import { CodeBlock, type CodeProps, InlineCode } from ".";

const meta = {
  title: "Components/Code",
  component: CodeBlock,
  args: {
    language: "typescript",
  },
} satisfies Meta<CodeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Block: Story = {
  args: {
    children: ts`
      function add(a: number, b: number) {
        return a + b;
      }
    `,
  },
};

export const Inline: Story = {
  render: ({ children, language }) => (
    <p>
      Do something like <InlineCode {...{ language }}>{children}</InlineCode>.
    </p>
  ),
  args: {
    children: ts`add(1, 2)`,
  },
};
