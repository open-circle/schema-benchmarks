import { bem } from "@schema-benchmarks/utils";
import type { ReactNode } from "react";
import { useExternalStore } from "@/hooks/store";
import { MdSymbol } from "../symbol";
import { bannerQueue } from "./queue";

export type BannerColor = "success" | "error" | "warning";

export interface BannerProps {
  icon?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  closing?: boolean;
  color?: BannerColor;
}

const cls = bem("banner");

export function Banner() {
  const banner = useExternalStore(bannerQueue, ([current]) => current);
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
