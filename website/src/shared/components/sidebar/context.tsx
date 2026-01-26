import { isServer } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { createContext, useState } from "react";

interface SidebarOpenContext {
  open: boolean;
  setOpen: (newValue: boolean) => void;
}

const storageKey = "benchmarks::sidebar-open";
const breakpoint = 1240;

const getInitialOpen = createIsomorphicFn()
  .server(() => false)
  .client(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) return stored === "true";
    return window.innerWidth >= breakpoint;
  });

// biome-ignore lint/style/useComponentExportOnlyModules: exporting context
export const SidebarOpenContext = createContext<SidebarOpenContext>({
  open: getInitialOpen(),
  setOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, _setOpen] = useState(getInitialOpen);
  function setOpen(newValue: boolean) {
    if (!isServer && window.innerWidth >= breakpoint) {
      localStorage.setItem(storageKey, newValue.toString());
    }
    _setOpen(newValue);
  }
  return (
    <SidebarOpenContext value={{ open, setOpen }}>
      {children}
    </SidebarOpenContext>
  );
}
