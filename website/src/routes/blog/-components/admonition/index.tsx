import type { ReactNode } from "react";
import bem from "react-bem-helper";

import { MdSymbol } from "#/shared/components/symbol";

import { type AdmonitionType, admonitionDefaults } from "./constants";

export interface AdmonitionProps {
  type?: AdmonitionType;
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
}

const cls = bem("admonition");

export function Admonition({ type = "info", icon, title, children }: AdmonitionProps) {
  const isString = typeof children === "string";
  return (
    <section {...cls({ modifiers: { [type]: true, string: isString } })}>
      <div {...cls("title-row")}>
        <span {...cls("icon")}>{icon ?? <MdSymbol>{admonitionDefaults[type].icon}</MdSymbol>}</span>
        <h6 {...cls("title")}>{title ?? admonitionDefaults[type].title}</h6>
      </div>
      <div {...cls("content")}>{isString ? <p>{children}</p> : children}</div>
    </section>
  );
}
