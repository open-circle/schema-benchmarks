import { createIsomorphicFn } from "@tanstack/react-start";
import { createContext, useLayoutEffect, useState } from "react";

interface SidebarExpandedContext {
  expanded: boolean;
  setExpanded: (newValue: boolean) => void;
}

const getInitialExpanded = createIsomorphicFn()
  .server(() => false)
  .client(() => window.innerWidth > 1239);

// biome-ignore lint/style/useComponentExportOnlyModules: exporting context
export const SidebarExpandedContext = createContext<SidebarExpandedContext>({
  expanded: getInitialExpanded(),
  setExpanded: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(getInitialExpanded);
  useLayoutEffect(() => {
    setExpanded(getInitialExpanded);
  }, []);
  return (
    <SidebarExpandedContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarExpandedContext.Provider>
  );
}
