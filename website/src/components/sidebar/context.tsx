import { createIsomorphicFn } from "@tanstack/react-start";
import { createContext, useState } from "react";

interface SidebarExpandedContext {
  expanded: boolean;
  setExpanded: (newValue: boolean) => void;
}

const storageKey = "benchmarks::sidebar-expanded";
const breakpoint = 1240;

const getInitialExpanded = createIsomorphicFn()
  .server(() => false)
  .client(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) return stored === "true";
    return window.innerWidth >= breakpoint;
  });

// biome-ignore lint/style/useComponentExportOnlyModules: exporting context
export const SidebarExpandedContext = createContext<SidebarExpandedContext>({
  expanded: getInitialExpanded(),
  setExpanded: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, _setExpanded] = useState(getInitialExpanded);
  function setExpanded(newValue: boolean) {
    if (typeof window !== "undefined" && window.innerWidth >= breakpoint) {
      localStorage.setItem(storageKey, newValue.toString());
    }
    _setExpanded(newValue);
  }
  return (
    <SidebarExpandedContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarExpandedContext.Provider>
  );
}
