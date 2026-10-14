import type { ComponentPropsWithRef, ReactNode } from "react";
import bem from "react-bem-helper";

const cls = bem("page-filters");

export function PageFilters({ className, ...props }: ComponentPropsWithRef<"search">) {
  return <search {...props} {...cls({ extra: className })} aria-label="Filters" />;
}

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
