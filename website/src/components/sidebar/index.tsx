import {
  ClientOnly,
  Link,
  type LinkOptions,
  linkOptions,
} from "@tanstack/react-router";
import clsx from "clsx";
import { radEventListeners } from "rad-event-listeners";
import { type ReactNode, useContext, useEffect } from "react";
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

function SidebarWithoutContext({
  children,
  expanded,
  setExpanded,
}: {
  children?: ReactNode;
  expanded: boolean;
  setExpanded: (newValue: boolean) => void;
}) {
  useEffect(
    () =>
      radEventListeners(document, {
        keydown(event) {
          if (event.key === "Escape") {
            setExpanded(false);
          }
        },
      }),
    [setExpanded],
  );

  return (
    <>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: we have an escape listener */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: we have an escape listener */}
      <div
        className={clsx(
          "sidebar-backdrop",
          expanded && "sidebar-backdrop--visible",
        )}
        onClick={() => setExpanded(false)}
      />
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
    </>
  );
}

export function Sidebar({ children }: { children?: ReactNode }) {
  const { expanded, setExpanded } = useContext(SidebarExpandedContext);
  return (
    <ClientOnly
      fallback={
        <SidebarWithoutContext expanded={false} setExpanded={() => {}}>
          {children}
        </SidebarWithoutContext>
      }
    >
      <SidebarWithoutContext expanded={expanded} setExpanded={setExpanded}>
        {children}
      </SidebarWithoutContext>
    </ClientOnly>
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
