import { createContext, useState } from "react";

interface SidebarOpenContext {
  open: boolean;
  setOpen: (newValue: boolean) => void;
}

// biome-ignore lint/style/useComponentExportOnlyModules: exporting context
export const SidebarOpenContext = createContext<SidebarOpenContext>({
  open: false,
  setOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SidebarOpenContext value={{ open, setOpen }}>
      {children}
    </SidebarOpenContext>
  );
}
