import type { Override } from "@schema-benchmarks/utils";
import { Activity, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import bem from "react-bem-helper";

import { Button, ButtonGroup } from "#src/shared/components/button";

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
      selected: selectedTab === tabId,
      panelId: `${tabId}-panel`,
      onClick: () => {
        if (!panelsRef.current?.startViewTransition || selectedTab === tabId) {
          setSelectedTab(tabId);
          return;
        }

        const direction =
          tabs.indexOf(tabId) > tabs.indexOf(selectedTab) ? "forwards" : "backwards";
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
      tabId,
    }) satisfies Partial<TabPanelProps>;

  return { selectedTab, getTabProps, getPanelProps, panelsRef };
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
    <div {...props} role="tabpanel" aria-labelledby={tabId} {...cls("panel")}>
      <Activity mode={selected ? "visible" : "hidden"}>{children}</Activity>
    </div>
  );
}
