import type { Meta, StoryObj } from "@storybook/react-vite";
import clsx from "clsx";
import { MdSymbol } from "../symbol";
import { Sidebar } from ".";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="sidebar-container">
      <Sidebar>
        <nav>
          <ul className="subtitle2">
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
    </div>
  ),
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
