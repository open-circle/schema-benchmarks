import { createContext, useState } from "react";

interface SidebarExpandedContext {
  expanded: boolean;
  setExpanded: (newValue: boolean) => void;
}

// biome-ignore lint/style/useComponentExportOnlyModules: exporting context
export const SidebarExpandedContext = createContext<SidebarExpandedContext>({
  expanded: true,
  setExpanded: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <SidebarExpandedContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarExpandedContext.Provider>
  );
}
