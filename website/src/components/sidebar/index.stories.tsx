import type { Meta, StoryObj } from "@storybook/react-vite";
import clsx from "clsx";
import type { ContextType } from "react";
import { fn } from "storybook/test";
import { MdSymbol } from "../symbol";
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
        <Sidebar>
          <nav className="typo-subtitle1">
            <ul className="sidebar__groups">
              {Sidebar.groups.map((groups, index) => (
                <div key={groups.key} className="sidebar__group">
                  {groups.subheader && (
                    <h3 className="sidebar__subheader typo-subtitle2">
                      {groups.subheader}
                    </h3>
                  )}
                  <ul>
                    {groups.links.map(({ name, icon, ...link }) => (
                      <li key={link.to}>
                        <a
                          href={link.to}
                          className={clsx({ active: link.to === "/" })}
                        >
                          <MdSymbol>{icon}</MdSymbol>
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                  {index !== Sidebar.groups.length - 1 && <hr />}
                </div>
              ))}
            </ul>
          </nav>
        </Sidebar>
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
