import { clamp } from "@schema-benchmarks/utils";
import { radEventListeners } from "rad-event-listeners";
import { useEffect, useState } from "react";

const keys = {
  horizontal: {
    ltr: {
      prev: "ArrowLeft",
      next: "ArrowRight",
    },
    rtl: {
      prev: "ArrowRight",
      next: "ArrowLeft",
    },
  },
  vertical: {
    prev: "ArrowUp",
    next: "ArrowDown",
  },
};

function getFocusables(element: HTMLElement) {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, [tabindex="0"]',
    ),
  ).filter((element) => !element.matches(":disabled"));
}

export function useFocusGroup({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical";
} = {}) {
  const [groupRef, setGroupRef] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (groupRef) {
      return radEventListeners(groupRef, {
        keydown(event) {
          if (
            !document.activeElement ||
            !groupRef.contains(document.activeElement)
          )
            return;
          const { prev, next } =
            orientation === "horizontal"
              ? keys.horizontal[groupRef.matches(":dir(ltr)") ? "ltr" : "rtl"]
              : keys.vertical;
          if (event.key === prev || event.key === next) {
            event.preventDefault();
            const focusable = getFocusables(groupRef);
            const index = focusable.indexOf(
              document.activeElement as HTMLElement,
            );
            const nextIndex = event.key === prev ? index - 1 : index + 1;
            focusable[clamp(nextIndex, 0, focusable.length - 1)]?.focus();
          } else if (event.key === "Tab") {
            // should skip the rest of the group
            event.preventDefault();
            const innerFocusable = getFocusables(groupRef).at(
              event.shiftKey ? 0 : -1,
            );
            const allFocusables = getFocusables(document.body);
            const index = allFocusables.indexOf(innerFocusable as HTMLElement);
            const nextIndex = event.shiftKey ? index - 1 : index + 1;
            allFocusables[
              clamp(nextIndex, 0, allFocusables.length - 1)
            ]?.focus();
          }
        },
      });
    }
  }, [groupRef, orientation]);
  return setGroupRef;
}
