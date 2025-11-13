import type { Meta, StoryObj } from "@storybook/react-vite";
import clsx from "clsx";
import type { ContextType } from "react";
import { fn } from "storybook/test";
import { MdSymbol } from "../symbol";
import { Sidebar } from ".";
import { SidebarExpandedContext } from "./context";

const meta = {
  title: "Components/Sidebar",
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="sidebar-container">
      <SidebarExpandedContext.Provider value={args}>
        <Sidebar>
          <nav>
            <ul className="typo-subtitle2">
              {Sidebar.links.map(({ name, icon, to }) => (
                <li key={to}>
                  <a href={to} className={clsx({ active: to === "/" })}>
                    <MdSymbol>{icon}</MdSymbol>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Sidebar>
      </SidebarExpandedContext.Provider>
    </div>
  ),
  args: {
    expanded: true,
    setExpanded: fn(),
  },
} satisfies Meta<ContextType<typeof SidebarExpandedContext>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
