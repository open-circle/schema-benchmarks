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
  return (
    <section {...cls({ modifiers: [type] })}>
      <h6 {...cls("title-row")}>
        <span {...cls("icon")}>{icon ?? <MdSymbol>{admonitionDefaults[type].icon}</MdSymbol>}</span>
        <span {...cls("title")}>{title ?? admonitionDefaults[type].title}</span>
      </h6>
      <div {...cls("content")}>{children}</div>
    </section>
  );
}
