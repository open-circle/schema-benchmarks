import type { ReactNode } from "react";
import bem from "react-bem-helper";

import { classed } from "#src/shared/components/utils";

const cls = bem("page-filters");

export const PageFilters = classed.div(cls().className);

PageFilters.displayName = "PageFilters";

export interface PageFilterProps {
  title: ReactNode;
  titleId?: string;
  children: ReactNode;
}

export function PageFilter({ title, titleId, children }: PageFilterProps) {
  return (
    <div {...cls("group")}>
      <h6 className="typo-caption" id={titleId}>
        {title}
      </h6>
      {children}
    </div>
  );
}
