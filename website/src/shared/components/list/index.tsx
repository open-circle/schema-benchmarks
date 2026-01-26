import type { OneOf } from "@schema-benchmarks/utils";
import { createLink } from "@tanstack/react-router";
import type { ComponentPropsWithRef, ReactNode } from "react";
import bem from "react-bem-helper";
import { Button, ExternalLinkButton } from "../button";

const listCls = bem("list");

export interface UnorderedListProps extends ComponentPropsWithRef<"ul"> {
  ordered?: false;
}

export interface OrderedListProps extends ComponentPropsWithRef<"ol"> {
  ordered: true;
}

// no visual difference, but semantically important
export type ListProps = UnorderedListProps | OrderedListProps;

export function List({ ordered, className, ref, ...props }: ListProps) {
  const Component = ordered ? "ol" : "ul";
  return (
    <Component
      {...props}
      {...listCls({ extra: className })}
      ref={ref as never}
    />
  );
}

const itemCls = bem("list-item");

export interface ListItemProps extends ComponentPropsWithRef<"li"> {}

export function ListItem({ className, ...props }: ListItemProps) {
  return <li {...props} {...itemCls({ extra: className })} />;
}

export interface ListItemButtonProps
  extends ComponentPropsWithRef<typeof Button> {}

export function ListItemButton({ className, ...props }: ListItemButtonProps) {
  return (
    <Button {...props} {...itemCls({ element: "button", extra: className })} />
  );
}

export interface ListItemExternalLinkProps
  extends ComponentPropsWithRef<typeof ExternalLinkButton> {}

export function ListItemExternalLink({
  className,
  ...props
}: ListItemExternalLinkProps) {
  return (
    <ExternalLinkButton
      {...props}
      {...itemCls({ element: "button", extra: className })}
    />
  );
}

// biome-ignore lint/style/useComponentExportOnlyModules: this is a component
export const ListItemInternalLink = createLink(ListItemExternalLink);

export namespace ListItemContentProps {
  export interface BaseProps {
    leading?: ReactNode;
    trailing?: ReactNode;
    className?: string;
  }

  export interface SingleLine extends BaseProps {
    lines?: 1;
    children?: ReactNode;
  }

  export interface TwoLine extends BaseProps {
    lines: 2;
    primary: ReactNode;
    supporting: ReactNode;
  }

  export interface ThreeLine extends BaseProps {
    lines: 3;
    primary: ReactNode;
    supporting: ReactNode;
  }
}

export type ListItemContentProps = OneOf<
  | ListItemContentProps.SingleLine
  | ListItemContentProps.TwoLine
  | ListItemContentProps.ThreeLine
>;

const num = ["single", "two", "three"] as const;

export function ListItemContent({
  className,
  leading,
  trailing,
  lines = 1,
  primary,
  supporting,
  children,
}: ListItemContentProps) {
  return (
    <div {...itemCls("content", num[lines - 1], className)}>
      {leading && <div {...itemCls("leading")}>{leading}</div>}
      <div {...itemCls({ element: "text", extra: "typo-subtitle1" })}>
        {lines === 1 ? (
          children
        ) : (
          <>
            <div {...itemCls("primary-text")}>{primary}</div>
            <div
              {...itemCls({
                element: "supporting-text",
                extra: "typo-caption",
              })}
            >
              {supporting}
            </div>
          </>
        )}
      </div>
      {trailing && <div {...itemCls("trailing")}>{trailing}</div>}
    </div>
  );
}
