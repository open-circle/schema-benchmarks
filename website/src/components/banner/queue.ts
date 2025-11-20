import { hasAtLeast } from "@schema-benchmarks/utils";
import { ExternalStore } from "@/hooks/store";
import type { BannerProps } from ".";

interface BannerWithId extends BannerProps {
  id: string;
}

const removeDelay = 150;

class BannerStore extends ExternalStore<Array<BannerWithId>> {
  constructor() {
    super([]);
  }
  add(banner: BannerProps) {
    this.setState((banners) => {
      banners.push({ ...banner, id: crypto.randomUUID() });
    });
  }
  pop() {
    this.setState((banners) => {
      if (!hasAtLeast(banners, 1)) return;
      banners[0].closing = true;
    });
    setTimeout(() => {
      this.setState((banners) => {
        banners.shift();
      });
    }, removeDelay);
  }
}

export const bannerQueue = new BannerStore();

export const openBanner = (banner: BannerProps) => {
  bannerQueue.add(banner);
};
export const closeBanner = () => {
  bannerQueue.pop();
};
