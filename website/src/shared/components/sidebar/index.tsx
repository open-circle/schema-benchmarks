import { ClientOnly } from "@tanstack/react-router";
import { clsx } from "clsx";
import { radEventListeners } from "rad-event-listeners";
import { type ReactNode, useContext, useEffect } from "react";
import bem from "react-bem-helper";

import { useBreakpoints } from "#/shared/hooks/use-breakpoints";
import { useScrollLockEffect } from "#/shared/hooks/use-scroll-lock";

import { List, ListItem, ListItemContent, ListItemInternalLink } from "../list";
import { MdSymbol } from "../symbol";
import { SidebarOpenContext } from "./context";
import { sidebarGroups } from "./groups";

const cls = bem("sidebar");
const backdropCls = bem("sidebar-backdrop");

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
      {/* oxlint-disable-next-line jsx_a11y/click-events-have-key-events, jsx_a11y/no-static-element-interactions */}
      <div {...backdropCls({ modifiers: { visible: open } })} onClick={() => setOpen(false)} />
      <aside {...cls({ modifiers: { open } })}>
        <div {...cls("logo")}>
          <img {...cls("logo-dark")} src="/logo_dark.svg" alt="Logo" />
          <img {...cls("logo-light")} src="/logo_light.svg" alt="Logo" />
          <h2 className="typo-subtitle1">Schema Benchmarks</h2>
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
        <ul {...cls("groups")}>
          {sidebarGroups.map((group, index) => (
            <li key={group.key} {...cls("group")}>
              <List>
                {group.links.map(({ name, icon, ...link }) => (
                  <ListItem key={link.to}>
                    <ListItemInternalLink {...link} activeOptions={{ includeSearch: false }}>
                      <ListItemContent leading={<MdSymbol>{icon}</MdSymbol>}>
                        {name}
                      </ListItemContent>
                    </ListItemInternalLink>
                  </ListItem>
                ))}
              </List>
              {index !== sidebarGroups.length - 1 && (
                <hr className={clsx({ inset: group.inset })} />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </BreakpointSidebar>
  );
}
