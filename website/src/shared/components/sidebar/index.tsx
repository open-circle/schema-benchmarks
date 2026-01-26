import { ClientOnly } from "@tanstack/react-router";
import { radEventListeners } from "rad-event-listeners";
import { type ReactNode, useContext, useEffect } from "react";
import bem from "react-bem-helper";
import { useBreakpoints } from "@/shared/hooks/use-breakpoints";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { useScrollLockEffect } from "@/shared/hooks/use-scroll-lock";
import { ToggleButton } from "../button/toggle";
import { List, ListItem, ListItemContent, ListItemInternalLink } from "../list";
import { MdSymbol } from "../symbol";
import { SidebarOpenContext } from "./context";
import { sidebarGroups } from "./groups";

const cls = bem("sidebar");
const backdropCls = bem("sidebar-backdrop");

const useIsModal = () =>
  useBreakpoints(["phone", "tabletSmall", "tabletLarge"], true);

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
        {...backdropCls({ modifiers: { visible: open } })}
        onClick={() => setOpen(false)}
      />
      <aside {...cls({ modifiers: { open } })}>
        <div {...cls("logo")}>
          <img src="/logo.svg" alt="Logo" />
          <h2 className="typo-subtitle1">Schema{"\n"}Benchmarks</h2>
          <ToggleButton
            {...cls({
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
  const isModal = useIsModal();
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
  const { open } = useContext(SidebarOpenContext);
  const isModal = useIsModal();
  const isLtr = useMediaQuery("(dir: ltr)");
  return (
    <BreakpointSidebar>
      <nav className="typo-subtitle1">
        <ul {...cls("groups")}>
          {sidebarGroups.map((groups, index) => (
            <div key={groups.key} {...cls("group")}>
              <List>
                {groups.links.map(({ name, icon, ...link }) => (
                  <ListItem key={link.to}>
                    <ListItemInternalLink
                      {...link}
                      tooltip={!isModal && !open ? name : undefined}
                      tooltipOpts={{
                        placement: isLtr ? "right" : "left",
                      }}
                      activeOptions={{ includeSearch: false }}
                    >
                      <ListItemContent leading={<MdSymbol>{icon}</MdSymbol>}>
                        {name}
                      </ListItemContent>
                    </ListItemInternalLink>
                  </ListItem>
                ))}
              </List>
              {index !== sidebarGroups.length - 1 && <hr />}
            </div>
          ))}
        </ul>
      </nav>
    </BreakpointSidebar>
  );
}
