import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";

import { useLoadImage } from "#/shared/hooks/use-load-image";

import { withTooltip } from "../tooltip";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  src?: string;
  label: string;
  size?: AvatarSize;
  "~as"?: "div" | "li";
}

const cls = bem("avatar");

const TooltipDiv = withTooltip("div");
const TooltipLi = withTooltip("li");

export function Avatar({ src, label, size = "md", "~as": asProp }: AvatarProps) {
  const loadState = useLoadImage(src);
  const Component = asProp === "li" ? TooltipLi : TooltipDiv;
  return (
    <Component tooltip={label} {...cls({ modifiers: size })}>
      {loadState === "loaded" ? (
        <img src={src} alt={label} {...cls("image")} />
      ) : (
        <div {...cls("initial")}>{label.charAt(0).toUpperCase()}</div>
      )}
    </Component>
  );
}

export interface AvatarListProps extends ComponentPropsWithRef<"ul"> {
  items: Array<Omit<AvatarProps, "~as" | "size">>;
  size?: AvatarSize;
}

const listCls = bem("avatar-list");

export function AvatarList({ items, size = "md", ...props }: AvatarListProps) {
  return (
    <ul {...listCls({ modifiers: size })} {...props}>
      {items
        .slice()
        .reverse()
        .map((item) => (
          <Avatar key={item.label} {...item} size={size} {...{ "~as": "li" }} />
        ))}
    </ul>
  );
}
