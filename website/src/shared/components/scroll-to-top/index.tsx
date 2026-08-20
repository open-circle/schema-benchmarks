import { environmentManager } from "@tanstack/react-query";
import { radEventListeners } from "rad-event-listeners";
import { useEffect, useState } from "react";
import bem from "react-bem-helper";

import { FloatingActionButton } from "#src/shared/components/button/floating";
import { MdSymbol } from "#src/shared/components/symbol";

const cls = bem("scroll-to-top");

export function useScrolled({ threshold = 100 } = {}) {
  const [scrollContainer, setScrollContainerState] = useState<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  function setScrollContainer(container: HTMLElement | null) {
    setScrollContainerState(container);
    setScrolled(container ? container.scrollTop > threshold : false);
  }

  useEffect(() => {
    if (!scrollContainer) return;
    return radEventListeners(scrollContainer, {
      scroll() {
        setScrolled(scrollContainer.scrollTop > threshold);
      },
    });
  }, [scrollContainer, threshold]);

  function scrollToTop(behavior: ScrollBehavior) {
    if (!scrollContainer) return;
    scrollContainer.scrollTo({ top: 0, behavior });
  }

  return {
    scrolled,
    setScrollContainer,
    scrollToTop,
  };
}

export function prefersReducedMotion() {
  return (
    !environmentManager.isServer() && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ScrollToTop({
  scrollToTop,
  scrolled,
}: Omit<ReturnType<typeof useScrolled>, "setScrollContainer">) {
  return (
    <FloatingActionButton
      {...cls({
        modifiers: { scrolled },
      })}
      onClick={() => {
        scrollToTop(prefersReducedMotion() ? "auto" : "smooth");
      }}
      tabIndex={scrolled ? 0 : -1}
      icon={<MdSymbol>arrow_upward</MdSymbol>}
    >
      Scroll to top
    </FloatingActionButton>
  );
}
