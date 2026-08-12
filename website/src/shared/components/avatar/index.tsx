import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";

import type { RichTooltipProps } from "#src/shared/components/tooltip";
import { withTooltip } from "#src/shared/components/tooltip";
import { useLoadImage } from "#src/shared/hooks/use-load-image";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  src?: string;
  label: string;
  size?: AvatarSize;
  "~as"?: "div" | "li";
}

const cls = bem("avatar");

export function Avatar({ src, label, size = "md", "~as": asProp = "div" }: AvatarProps) {
  const loadState = useLoadImage(src);
  const Component = asProp;
  return (
    <Component {...cls({ modifiers: size })}>
      {loadState === "loaded" ? (
        <img src={src} alt="" {...cls("image")} />
      ) : (
        <div {...cls("initial")}>{label.charAt(0).toUpperCase()}</div>
      )}
    </Component>
  );
}

interface AvatarLinkProps
  extends Omit<AvatarProps, "label">, Omit<ComponentPropsWithRef<"a">, "children"> {
  tooltip: string | RichTooltipProps;
}

export const AvatarExternalLink = withTooltip(
  function AvatarExternalLink({ src, size, "~as": asProp, tooltip, ...props }: AvatarLinkProps) {
    const label = typeof tooltip === "string" ? tooltip : (tooltip.subhead ?? "");
    return (
      <a className="avatar-link" {...props}>
        <Avatar {...{ src, size, label, "~as": asProp }} />
      </a>
    );
  },
  {
    required: true,
  },
);

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
        .toReversed()
        .map((item) => (
          <Avatar key={item.label} {...item} size={size} {...{ "~as": "li" }} />
        ))}
    </ul>
  );
}

export interface AvatarLinkListProps extends ComponentPropsWithRef<"ul"> {
  items: Array<Omit<AvatarLinkProps, "~as" | "size">>;
  size?: AvatarSize;
}

export function AvatarLinkList({ items, size = "md", ...props }: AvatarLinkListProps) {
  return (
    <ul {...listCls({ modifiers: size })} {...props}>
      {items
        .slice()
        .toReversed()
        .map((item) => (
          <AvatarExternalLink
            key={
              item.href ??
              (typeof item.tooltip === "string" ? item.tooltip : (item.tooltip.subhead ?? ""))
            }
            {...item}
            size={size}
            {...{ "~as": "li" }}
          />
        ))}
    </ul>
  );
}
