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
    <section {...cls({ modifiers: type })}>
      <h6 {...cls({ element: "title", extra: "typo-caption" })}>
        <span {...cls("icon")}>{icon ?? <MdSymbol>{admonitionDefaults[type].icon}</MdSymbol>}</span>
        {title ?? admonitionDefaults[type].title}
      </h6>
      {children}
    </section>
  );
}
