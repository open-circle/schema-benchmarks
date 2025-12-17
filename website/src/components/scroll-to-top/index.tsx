import { isServer } from "@tanstack/react-query";
import { radEventListeners } from "rad-event-listeners";
import { useEffect, useState } from "react";
import bem from "react-bem-helper";
import { FloatingActionButton } from "../button/floating";
import { MdSymbol } from "../symbol";

const cls = bem("scroll-to-top");

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(
    () =>
      radEventListeners(window, {
        scroll() {
          setScrolled(window.scrollY > 100);
        },
      }),
    [],
  );
  return scrolled;
}

function prefersReducedMotion() {
  return !isServer && window.matchMedia("(prefers-reduced-motion)").matches;
}

export function ScrollToTop() {
  const scrolled = useScrolled();
  return (
    <FloatingActionButton
      {...cls({
        modifiers: { scrolled },
      })}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        })
      }
      tabIndex={scrolled ? 0 : -1}
      icon={<MdSymbol>arrow_upward</MdSymbol>}
    >
      Scroll to top
    </FloatingActionButton>
  );
}
