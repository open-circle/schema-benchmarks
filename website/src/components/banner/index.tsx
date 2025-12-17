import type { ReactNode } from "react";
import bem from "react-bem-helper";
import { useExternalStore } from "@/hooks/store";
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
    <div {...cls({ modifiers: { closing, [color]: !!color } })}>
      <div {...cls("container")}>
        {icon && <div {...cls("icon")}>{icon}</div>}
        <p {...cls({ element: "message", extra: "typo-body2" })}>{children}</p>
      </div>
      {actions && <div {...cls("actions")}>{actions}</div>}
    </div>
  );
}
