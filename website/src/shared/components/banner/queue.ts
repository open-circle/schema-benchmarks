import { hasAtLeast } from "@schema-benchmarks/utils";
import { defaultPatterns } from "web-haptics";

import { haptics } from "#/shared/lib/haptics";
import { createStore } from "#/shared/lib/store";

import type { BannerProps } from ".";

interface BannerWithId extends BannerProps {
  id: string;
}

function getBannerHaptic({ color }: Pick<BannerProps, "color">) {
  switch (color) {
    case "success":
    case "error":
      return defaultPatterns[color].pattern;
    default:
      return defaultPatterns.nudge.pattern;
  }
}

const removeDelay = 150;

export const bannerStore = createStore([] as Array<BannerWithId>, ({ updateState }) => ({
  open: (banner: BannerProps) => {
    const id = crypto.randomUUID();
    updateState((banners) => {
      banners.push({ ...banner, id });
      // if there was no banner before, trigger a haptic
      if (banners.length === 1) void haptics?.trigger(getBannerHaptic(banner));
    });
    return id;
  },
  close: (id?: string) => {
    if (id) {
      updateState((banners) => {
        const index = banners.findIndex((banner) => banner.id === id);
        if (index === -1) return;
        const banner = banners[index];
        if (!banner) return;
        banner.closing = true;
      });
      setTimeout(() => {
        updateState((banners) => {
          const index = banners.findIndex((banner) => banner.id === id);
          if (index === -1) return;
          banners.splice(index, 1);
          if (index === 0 && banners.length !== 0)
            void haptics?.trigger(getBannerHaptic(banners[0]!));
        });
      }, removeDelay);
    } else {
      updateState((banners) => {
        if (!hasAtLeast(banners, 1)) return;
        banners[0].closing = true;
      });
      setTimeout(() => {
        updateState((banners) => {
          banners.shift();
          if (banners.length !== 0) void haptics?.trigger(getBannerHaptic(banners[0]!));
        });
      }, removeDelay);
    }
  },
}));
