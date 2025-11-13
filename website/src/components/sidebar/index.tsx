import { bem } from "@schema-benchmarks/utils";
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
import { SidebarOpenContext } from "./context";

const cls = bem("sidebar");

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
  open,
  setOpen,
}: {
  children?: ReactNode;
  open: boolean;
  setOpen: (newValue: boolean) => void;
}) {
  useEffect(
    () =>
      radEventListeners(document, {
        keydown(event) {
          if (event.key === "Escape") {
            setOpen(false);
          }
        },
      }),
    [setOpen],
  );

  return (
    <>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: we have an escape listener */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: we have an escape listener */}
      <div
        className={clsx(
          "sidebar-backdrop",
          open && "sidebar-backdrop--visible",
        )}
        onClick={() => setOpen(false)}
      />
      <aside className={clsx(cls(), { open })}>
        <div className={cls("logo")}>
          <img src="/logo.svg" alt="Logo" />
          <h2 className="typo-subtitle1">Schema{"\n"}Benchmarks</h2>
          <button
            type="button"
            className={cls({
              element: "toggle",
              extra: "button button--toggle",
            })}
            onClick={() => setOpen(false)}
            aria-label="Collapse sidebar"
            tabIndex={open ? 0 : -1}
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
  const { open, setOpen } = useContext(SidebarOpenContext);
  return (
    <ClientOnly
      fallback={
        <SidebarWithoutContext open={false} setOpen={() => {}}>
          {children}
        </SidebarWithoutContext>
      }
    >
      <SidebarWithoutContext open={open} setOpen={setOpen}>
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
