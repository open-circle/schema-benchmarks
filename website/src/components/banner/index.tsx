import { bem } from "@schema-benchmarks/utils";
import { type ReactNode, useSyncExternalStore } from "react";
import { MdSymbol } from "../symbol";

export type BannerColor = "success" | "error" | "warning";

export interface BannerProps {
  icon?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  closing?: boolean;
  color?: BannerColor;
}

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
  getCurrent() {
    return this.#banners[0];
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

const bannerStore = new BannerStore();

export const openBanner = (banner: BannerProps) => {
  bannerStore.add(banner);
};
export const closeBanner = () => {
  bannerStore.pop();
};

const cls = bem("banner");

export function Banner() {
  const banner = useSyncExternalStore(
    (onStoreChange) => bannerStore.subscribe(onStoreChange),
    () => bannerStore.getCurrent(),
    () => bannerStore.getCurrent(),
  );
  if (!banner) return null;
  const { color = "", closing = false, icon, children, actions } = banner;
  return (
    <div className={cls({ modifiers: { closing, [color]: !!color } })}>
      <div className={cls("container")}>
        {icon && <MdSymbol className={cls("icon")}>{icon}</MdSymbol>}
        <p className={cls({ element: "message", extra: "typo-body2" })}>
          {children}
        </p>
      </div>
      {actions && <div className={cls("actions")}>{actions}</div>}
    </div>
  );
}
