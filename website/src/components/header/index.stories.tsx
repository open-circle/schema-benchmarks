import type { Meta, StoryObj } from "@storybook/react-vite";
import { MdSymbol } from "../symbol";
import { Header } from ".";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    children: (
      <nav className="breadcrumbs">
        <a href="/">Home</a>
        <MdSymbol>chevron_right</MdSymbol>
        <span>Page name</span>
      </nav>
    ),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
