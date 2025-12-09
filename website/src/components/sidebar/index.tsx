import { bem } from "@schema-benchmarks/utils/react";
import { ClientOnly, createLink } from "@tanstack/react-router";
import { radEventListeners } from "rad-event-listeners";
import type { ComponentProps } from "react";
import { type ReactNode, useContext, useEffect } from "react";
import { useBreakpoints } from "@/hooks/use-breakpoints";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrollLockEffect } from "@/hooks/use-scroll-lock";
import { ToggleButton } from "../button/toggle";
import { MdSymbol } from "../symbol";
import { withTooltip } from "../tooltip";
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

const LinkWithTooltip = createLink(
  withTooltip((props: ComponentProps<"a">) => <a {...props} />),
);

export function Sidebar() {
  const { open } = useContext(SidebarOpenContext);
  const isModal = useIsModal();
  const isLtr = useMediaQuery("(dir: ltr)");
  return (
    <BreakpointSidebar>
      <nav className="typo-subtitle1">
        <ul className={cls("groups")}>
          {sidebarGroups.map((groups, index) => (
            <div key={groups.key} className={cls("group")}>
              <ul>
                {groups.links.map(({ name, icon, ...link }) => (
                  <li key={link.to}>
                    <LinkWithTooltip
                      {...link}
                      tooltip={!isModal && !open ? name : undefined}
                      tooltipOpts={{
                        placement: isLtr ? "right" : "left",
                      }}
                      activeOptions={{ includeSearch: false }}
                    >
                      <MdSymbol>{icon}</MdSymbol>
                      {name}
                    </LinkWithTooltip>
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
