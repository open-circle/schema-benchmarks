import type { ContextType } from "react";
import { fn } from "storybook/test";
import preview from "#storybook/preview";
import { Sidebar } from ".";
import { SidebarOpenContext } from "./context";

const meta = preview.type<{ args: ContextType<typeof SidebarOpenContext> }>().meta({
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
});

export const Default = meta.story();
