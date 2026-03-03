import { hasAtLeast } from "@schema-benchmarks/utils";
import { defaultPatterns } from "web-haptics";

import { ExternalStore } from "#/shared/hooks/store";
import { haptics } from "#/shared/lib/haptics";

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

class BannerStore extends ExternalStore<Array<BannerWithId>> {
  constructor() {
    super([]);
  }
  add(banner: BannerProps) {
    const id = crypto.randomUUID();
    this.setState((banners) => {
      banners.push({ ...banner, id });
      // if there was no banner before, trigger a haptic
      if (banners.length === 1) haptics?.trigger(getBannerHaptic(banner));
    });
    return id;
  }
  pop() {
    this.setState((banners) => {
      if (!hasAtLeast(banners, 1)) return;
      banners[0].closing = true;
    });
    setTimeout(() => {
      this.setState((banners) => {
        banners.shift();
        if (banners.length !== 0) haptics?.trigger(getBannerHaptic(banners[0]!));
      });
    }, removeDelay);
  }
  remove(id: string) {
    this.setState((banners) => {
      const index = banners.findIndex((banner) => banner.id === id);
      if (index === -1) return;
      const banner = banners[index];
      if (!banner) return;
      banner.closing = true;
    });
    setTimeout(() => {
      this.setState((banners) => {
        const index = banners.findIndex((banner) => banner.id === id);
        if (index === -1) return;
        banners.splice(index, 1);
        if (index === 0 && banners.length !== 0) haptics?.trigger(getBannerHaptic(banners[0]!));
      });
    }, removeDelay);
  }
}

export const bannerQueue = new BannerStore();

export const openBanner = (banner: BannerProps) => bannerQueue.add(banner);

export const closeBanner = (id?: string) => {
  if (id) {
    bannerQueue.remove(id);
  } else {
    bannerQueue.pop();
  }
};
