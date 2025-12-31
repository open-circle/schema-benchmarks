import { useEffect } from "react";
import { useBreakpoints } from "@/hooks/use-breakpoints";
import { closeBanner, openBanner } from "./queue";

export function useSmallScreenBanner() {
  const isSmall = useBreakpoints(["phone", "tabletSmall"]);
  useEffect(() => {
    if (isSmall) {
      openBanner({
        children: "This site is not currently optimized for small screens.",
      });
      return () => closeBanner();
    }
  }, [isSmall]);
}
