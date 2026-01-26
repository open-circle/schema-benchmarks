import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ContextType } from "react";
import { fn } from "storybook/test";
import { Sidebar } from ".";
import { SidebarOpenContext } from "./context";

const meta = {
  title: "Components/Sidebar",
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="sidebar-container">
      <SidebarOpenContext value={args}>
        <Sidebar />
      </SidebarOpenContext>
    </div>
  ),
  args: {
    open: true,
    setOpen: fn(),
  },
} satisfies Meta<ContextType<typeof SidebarOpenContext>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
