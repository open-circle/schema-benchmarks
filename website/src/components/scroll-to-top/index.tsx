import { bem } from "@schema-benchmarks/utils";
import { radEventListeners } from "rad-event-listeners";
import { useEffect, useState } from "react";
import { getButtonClasses } from "../button";
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
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion)").matches
  );
}

export function ScrollToTop() {
  const scrolled = useScrolled();
  return (
    <button
      type="button"
      className={cls({
        modifiers: { scrolled },
        extra: getButtonClasses({ variant: "floating-action" }),
      })}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        })
      }
      tabIndex={scrolled ? 0 : -1}
    >
      <MdSymbol>arrow_upward</MdSymbol>
      Scroll to top
    </button>
  );
}
