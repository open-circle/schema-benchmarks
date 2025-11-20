import type { BannerProps } from ".";

interface BannerWithId extends BannerProps {
  id: string;
}

const removeDelay = 150;

class BannerStore extends EventTarget {
  #banners: Array<BannerWithId> = [];
  #setBanners(recipe: (banners: Array<BannerWithId>) => Array<BannerWithId>) {
    const nextBanners = recipe(this.#banners);
    if (nextBanners !== this.#banners) {
      this.#banners = nextBanners;
      this.dispatchEvent(new Event("change"));
    }
  }
  get current() {
    return this.#banners[0];
  }
  flush() {
    this.#setBanners(() => []);
  }
  add(banner: BannerProps) {
    this.#setBanners((banners) => [
      ...banners,
      { ...banner, id: crypto.randomUUID() },
    ]);
  }
  pop() {
    if (!this.#banners.length) return;
    this.#setBanners(([first, ...rest]) => [
      // biome-ignore lint/style/noNonNullAssertion: we've checked that there is a banner
      { ...first!, closing: true },
      ...rest,
    ]);
    setTimeout(() => {
      this.#setBanners(([, ...rest]) => rest);
    }, removeDelay);
  }
  subscribe(callback: () => void) {
    this.addEventListener("change", callback);
    return () => this.removeEventListener("change", callback);
  }
}

export const bannerQueue = new BannerStore();

export const openBanner = (banner: BannerProps) => {
  bannerQueue.add(banner);
};
export const closeBanner = () => {
  bannerQueue.pop();
};
