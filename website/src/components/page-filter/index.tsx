import { bem } from "@schema-benchmarks/utils/react";
import type { ReactNode } from "react";

const cls = bem("page-filters");

export function PageFilters({ children }: { children: ReactNode }) {
  return <div className={cls()}>{children}</div>;
}

export interface PageFilterProps {
  title: ReactNode;
  titleId?: string;
  children: ReactNode;
}

export function PageFilter({ title, titleId, children }: PageFilterProps) {
  return (
    <div className={cls("group")}>
      <h6 className="typo-caption" id={titleId}>
        {title}
      </h6>
      {children}
    </div>
  );
}
