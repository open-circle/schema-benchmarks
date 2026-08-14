import type { Override } from "@schema-benchmarks/utils";
import { createLink, useNavigate } from "@tanstack/react-router";
import type { NavigateOptions } from "@tanstack/react-router";
import { useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import bem from "react-bem-helper";

import { ExternalLinkButton, Button, ButtonGroup } from "#src/shared/components/button";

export type TabVariant = "fullwidth" | "responsive";

declare global {
  interface Element {
    // experimental: https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition
    startViewTransition?(callback: ViewTransitionUpdateCallback): ViewTransition;
    startViewTransition?(options: StartViewTransitionOptions): ViewTransition;
  }
}

export function useTabs<T extends string>(tabs: ReadonlyArray<T>, initialValue: NoInfer<T>) {
  const [selectedTab, setSelectedTab] = useState<T>(initialValue);
  const panelsRef = useRef<HTMLDivElement>(null);

  const getTabProps = (tabId: T) =>
    ({
      id: `${tabId}-tab`,
      selected: selectedTab === tabId,
      panelId: `${tabId}-panel`,
      onClick: () => {
        if (!panelsRef.current?.startViewTransition || selectedTab === tabId) {
          setSelectedTab(tabId);
          return;
        }

        const direction = tabs.indexOf(tabId) > tabs.indexOf(selectedTab) ? "next" : "prev";
        panelsRef.current.startViewTransition({
          update: () => setSelectedTab(tabId),
          types: [direction],
        });
      },
    }) satisfies Partial<TabProps>;

  const getPanelProps = (tabId: T) =>
    ({
      selected: selectedTab === tabId,
      id: `${tabId}-panel`,
      tabId: `${tabId}-tab`,
    }) satisfies Partial<TabPanelProps>;

  return { selectedTab, getTabProps, getPanelProps, panelsRef };
}

export function useTabLinks<T extends string>(tabs: ReadonlyArray<T>, currentTabId: T) {
  const panelsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getTabLinkProps = <const TOptions extends NavigateOptions>(tabId: T, opts: TOptions) => ({
    id: `${tabId}-tab`,
    panelId: `${tabId}-panel`,
    ...opts,
    onClick: (e: React.MouseEvent) => {
      // let browser handle modifier-key clicks (new tab, etc.)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      const doNavigate = (viewTransition = true) => navigate({ ...opts, viewTransition });
      if (!panelsRef.current?.startViewTransition || currentTabId === tabId) {
        void doNavigate();
        return;
      }
      const direction = tabs.indexOf(tabId) > tabs.indexOf(currentTabId) ? "next" : "prev";
      panelsRef.current.startViewTransition({
        update: () => doNavigate(false),
        types: [direction],
      });
    },
  });

  const getPanelProps = (tabId: T) =>
    ({
      selected: currentTabId === tabId,
      id: `${tabId}-panel`,
      tabId: `${tabId}-tab`,
    }) satisfies Partial<TabPanelProps>;

  return { panelsRef, getTabLinkProps, getPanelProps };
}

const cls = bem("tabs");

type TabsProps = Override<
  ComponentPropsWithRef<typeof ButtonGroup>,
  {
    variant?: TabVariant;
  }
>;

export function Tabs({ children, className, variant = "fullwidth", ...props }: TabsProps) {
  return (
    <ButtonGroup {...props} role="tablist" {...cls({ modifier: variant, extra: className })}>
      {children}
    </ButtonGroup>
  );
}

export interface TabProps extends ComponentPropsWithRef<typeof Button> {
  children: ReactNode;
  selected?: boolean;
  id: string;
  panelId: string;
  hasPopup?: "menu" | true;
}

export function Tab({
  children,
  selected = false,
  panelId,
  hasPopup,
  className,
  ...props
}: TabProps) {
  return (
    <Button
      {...props}
      role="tab"
      aria-selected={selected}
      aria-controls={panelId}
      aria-haspopup={hasPopup}
      {...cls({ element: "tab", extra: className })}
    >
      {children}
    </Button>
  );
}

export interface TabLinkProps extends ComponentPropsWithRef<typeof ExternalLinkButton> {
  children: ReactNode;
  id: string;
  panelId: string;
}

export function ExternalTabLink({ children, panelId, className, ...props }: TabLinkProps) {
  return (
    <ExternalLinkButton
      {...props}
      role="tab"
      aria-controls={panelId}
      {...cls({ element: "tab", extra: className })}
    >
      {children}
    </ExternalLinkButton>
  );
}

const InternalTabLinkInner = createLink(ExternalTabLink);

export const InternalTabLink: typeof InternalTabLinkInner = ({ activeProps, ...props }) => (
  // @ts-expect-error
  <InternalTabLinkInner
    {...props}
    activeProps={() => ({
      "aria-selected": true,
      ...(typeof activeProps === "function" ? activeProps() : activeProps),
    })}
  />
);

export interface TabPanelsProps extends ComponentPropsWithRef<"div"> {
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
  containerProps?: ComponentPropsWithRef<"div">;
}

export function TabPanels({
  orientation = "horizontal",
  children,
  containerProps,
  className,
  ...props
}: TabPanelsProps) {
  return (
    <div
      {...containerProps}
      {...cls({ element: "panels-container", extra: containerProps?.className })}
    >
      <div {...props} {...cls({ element: "panels", modifier: orientation, extra: className })}>
        {children}
      </div>
    </div>
  );
}

export interface TabPanelProps extends ComponentPropsWithRef<"div"> {
  children: ReactNode;
  selected?: boolean;
  id: string;
  tabId: string;
}

export function TabPanel({ children, selected = false, tabId, ...props }: TabPanelProps) {
  return (
    <div {...props} role="tabpanel" aria-labelledby={tabId} {...cls("panel", { selected })}>
      <div {...cls("panel-content")} aria-hidden={!selected}>
        {children}
      </div>
    </div>
  );
}
