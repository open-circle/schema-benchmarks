import { Link, type LinkOptions, linkOptions } from "@tanstack/react-router";
import clsx from "clsx";
import { type ReactNode, useContext } from "react";
import { MdSymbol } from "../symbol";
import { SidebarExpandedContext } from "./context";

const sidebarLinks = [
  { ...linkOptions({ to: "/" }), name: "Home", icon: "home" },
  {
    ...linkOptions({ to: "/initialization" }),
    name: "Initialization",
    icon: "timer",
  },
  {
    ...linkOptions({ to: "/validation" }),
    name: "Validation",
    icon: "check_circle",
  },
  {
    ...linkOptions({ to: "/parsing" }),
    name: "Parsing",
    icon: "output_circle",
  },
] satisfies Array<LinkOptions & { name: string; icon: string }>;

export function Sidebar({ children }: { children?: ReactNode }) {
  const { expanded, setExpanded } = useContext(SidebarExpandedContext);
  return (
    <aside className={clsx("sidebar", expanded && "sidebar--expanded")}>
      <div className="logo sidebar__logo">
        <img src="/logo.svg" alt="Logo" />
        <h2 className="typo-subtitle1">Schema{"\n"}Benchmarks</h2>
        <button
          type="button"
          className="button button--toggle sidebar__toggle"
          onClick={() => setExpanded(false)}
          aria-label="Collapse sidebar"
          tabIndex={expanded ? 0 : -1}
        >
          <MdSymbol flipRtl>chevron_left</MdSymbol>
        </button>
      </div>
      {children}
    </aside>
  );
}

Sidebar.links = sidebarLinks;

export function TanstackSidebar() {
  return (
    <Sidebar>
      <nav>
        <ul className="typo-subtitle1">
          {sidebarLinks.map(({ name, icon, ...link }) => (
            <li key={link.to}>
              <Link {...link} activeOptions={{ includeSearch: false }}>
                <MdSymbol>{icon}</MdSymbol>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Sidebar>
  );
}
