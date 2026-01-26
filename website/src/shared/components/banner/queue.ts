import { hasAtLeast } from "@schema-benchmarks/utils";
import { ExternalStore } from "@/shared/hooks/store";
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
    const id = crypto.randomUUID();
    this.setState((banners) => {
      banners.push({ ...banner, id });
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
