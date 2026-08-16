import { environmentManager } from "@tanstack/react-query";
import { radEventListeners } from "rad-event-listeners";
import { useRef, useState, useMemo } from "react";
import bem from "react-bem-helper";

import { FloatingActionButton } from "#src/shared/components/button/floating";
import { MdSymbol } from "#src/shared/components/symbol";

const cls = bem("scroll-to-top");

export function useScrolled({ threshold = 100 } = {}) {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const scrollHandle = useMemo(
    () =>
      new Proxy({} as Pick<HTMLElement, Extract<keyof HTMLElement, `scroll${string}`>>, {
        get: (_, prop) => {
          if (!scrollContainerRef.current) throw new Error("Scroll container is not set");
          const value = Reflect.get(scrollContainerRef.current, prop);
          return typeof value === "function" ? value.bind(scrollContainerRef.current) : value;
        },
      }),
    [],
  );
  const [scrolled, setScrolled] = useState(false);
  function setScrollContainer(container: HTMLElement | null) {
    scrollContainerRef.current = container;
    if (!container) return;
    return radEventListeners(container, {
      scroll() {
        setScrolled(container.scrollTop > threshold);
      },
    });
  }
  return {
    scrollHandle,
    scrolled,
    setScrollContainer,
  };
}

export function prefersReducedMotion() {
  return (
    !environmentManager.isServer() && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ScrollToTop({
  scrollHandle,
  scrolled,
}: Omit<ReturnType<typeof useScrolled>, "setScrollContainer">) {
  return (
    <FloatingActionButton
      {...cls({
        modifiers: { scrolled },
      })}
      onClick={() => {
        scrollHandle.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }}
      tabIndex={scrolled ? 0 : -1}
      icon={<MdSymbol>arrow_upward</MdSymbol>}
    >
      Scroll to top
    </FloatingActionButton>
  );
}
