import { useEffect } from "react";

export function useScrollLock(): {
  lockScroll: () => void;
  unlockScroll: () => void;
} {
  return {
    lockScroll() {
      const scrollbarWidth = window.innerWidth - document.body.offsetWidth;
      document.body.dataset.modalOpen = "true";
      document.body.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`,
      );
    },
    unlockScroll() {
      delete document.body.dataset.modalOpen;
      document.body.style.removeProperty("--scrollbar-width");
    },
  };
}

export function useScrollLockEffect(shouldLock = true) {
  const { lockScroll, unlockScroll } = useScrollLock();
  useEffect(() => {
    if (shouldLock) {
      lockScroll();
    }
    return () => unlockScroll();
  }, [lockScroll, unlockScroll, shouldLock]);
}
