import { isServer } from "@tanstack/react-query";
import { radEventListeners } from "rad-event-listeners";
import { useEffect, useLayoutEffect, useState } from "react";
import bem from "react-bem-helper";
import { useWebHaptics } from "web-haptics/react";

import { FloatingActionButton } from "../button/floating";
import { MdSymbol } from "../symbol";

const cls = bem("scroll-to-top");

function useScrolled() {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    setScrollContainer(document.getElementById("scroll-container"));
  }, []);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!scrollContainer) return;
    return radEventListeners(scrollContainer, {
      scroll() {
        setScrolled(scrollContainer.scrollTop > 100);
      },
    });
  }, [scrollContainer]);
  return [scrollContainer, scrolled] as const;
}

function prefersReducedMotion() {
  return !isServer && window.matchMedia("(prefers-reduced-motion)").matches;
}

export function ScrollToTop() {
  const [scrollContainer, scrolled] = useScrolled();
  const haptics = useWebHaptics();
  return (
    <FloatingActionButton
      {...cls({
        modifiers: { scrolled },
      })}
      onClick={() => {
        haptics.trigger();
        scrollContainer?.scrollTo({
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
