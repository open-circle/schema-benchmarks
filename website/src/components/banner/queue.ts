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
    this.setState((banners) => [
      ...banners,
      { ...banner, id: crypto.randomUUID() },
    ]);
  }
  pop() {
    if (!this.state.length) return;
    this.setState(([first, ...rest]) => [
      // biome-ignore lint/style/noNonNullAssertion: we've checked that there is a banner
      { ...first!, closing: true },
      ...rest,
    ]);
    setTimeout(() => {
      this.setState(([, ...rest]) => rest);
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
