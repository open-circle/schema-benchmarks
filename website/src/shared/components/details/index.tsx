import { useState } from "react";

export function useAccordionGroup<T extends string>(initialOpen?: T) {
  const [open, setOpen] = useState<T | undefined>(initialOpen);
  function handleToggle(id: T) {
    return (e: { newState: "open" | "closed" }) => {
      setOpen((prev) => {
        if (e.newState === "open") {
          return id;
        }
        if (prev === id) {
          return undefined;
        }
        return prev;
      });
    };
  }
  return { open, handleToggle };
}
