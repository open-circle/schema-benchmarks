import { useEffect } from "react";

export function useScrollLock(): {
  lockScroll: () => void;
  unlockScroll: () => void;
} {
  return {
    lockScroll() {
      document.body.dataset.modalOpen = "true";
    },
    unlockScroll() {
      delete document.body.dataset.modalOpen;
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
