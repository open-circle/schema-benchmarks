import { bem } from "@schema-benchmarks/utils";
import {
  ClientOnly,
  Link,
  type LinkOptions,
  linkOptions,
} from "@tanstack/react-router";
import { radEventListeners } from "rad-event-listeners";
import { type Key, type ReactNode, useContext, useEffect } from "react";
import { useBreakpoints } from "@/hooks/use-breakpoints";
import { useScrollLockEffect } from "@/hooks/use-scroll-lock";
import { ToggleButton } from "../button/toggle";
import { MdSymbol } from "../symbol";
import { SidebarOpenContext } from "./context";

const cls = bem("sidebar");
const backdropCls = bem("sidebar-backdrop");

interface SidebarGroup {
  key: Key;
  subheader?: string;
  links: Array<LinkOptions & { name: string; icon: string }>;
}

const sidebarGroups: Array<SidebarGroup> = [
  {
    key: "core",
    links: [
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
      {
        ...linkOptions({ to: "/download" }),
        name: "Download",
        icon: "download_2",
      },
    ],
  },
];

function BaseSidebar({
  children,
  open,
  setOpen,
  isModal,
}: {
  children?: ReactNode;
  open: boolean;
  setOpen: (newValue: boolean) => void;
  isModal?: boolean;
}) {
  useEffect(() => {
    if (isModal) {
      return radEventListeners(document, {
        keydown(event) {
          if (event.key === "Escape") {
            setOpen(false);
          }
        },
      });
    }
  }, [setOpen, isModal]);

  return (
    <>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: we have an escape listener */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: we have an escape listener */}
      <div
        className={backdropCls({ modifiers: { visible: open } })}
        onClick={() => setOpen(false)}
      />
      <aside className={cls({ modifiers: { open } })}>
        <div className={cls("logo")}>
          <img src="/logo.svg" alt="Logo" />
          <h2 className="typo-subtitle1">Schema{"\n"}Benchmarks</h2>
          <ToggleButton
            className={cls({
              element: "toggle",
            })}
            onClick={() => setOpen(false)}
            tooltip="Collapse"
            tabIndex={open ? 0 : -1}
          >
            <MdSymbol flipRtl>chevron_left</MdSymbol>
          </ToggleButton>
        </div>
        {children}
      </aside>
    </>
  );
}

function BreakpointSidebar({ children }: { children?: ReactNode }) {
  const { open, setOpen } = useContext(SidebarOpenContext);
  const isModal = useBreakpoints(["phone", "tabletSmall", "tabletLarge"], true);
  useScrollLockEffect(isModal && open);
  return (
    <ClientOnly
      fallback={
        <BaseSidebar open={false} setOpen={() => {}}>
          {children}
        </BaseSidebar>
      }
    >
      <BaseSidebar open={open} setOpen={setOpen} isModal={isModal}>
        {children}
      </BaseSidebar>
    </ClientOnly>
  );
}

export function Sidebar() {
  return (
    <BreakpointSidebar>
      <nav className="typo-subtitle1">
        <ul className={cls("groups")}>
          {sidebarGroups.map((groups, index) => (
            <div key={groups.key} className={cls("group")}>
              {groups.subheader && (
                <h3
                  className={cls({
                    element: "subheader",
                    extra: "typo-subtitle2",
                  })}
                >
                  {groups.subheader}
                </h3>
              )}
              <ul>
                {groups.links.map(({ name, icon, ...link }) => (
                  <li key={link.to}>
                    <Link {...link} activeOptions={{ includeSearch: false }}>
                      <MdSymbol>{icon}</MdSymbol>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
              {index !== sidebarGroups.length - 1 && <hr />}
            </div>
          ))}
        </ul>
      </nav>
    </BreakpointSidebar>
  );
}
