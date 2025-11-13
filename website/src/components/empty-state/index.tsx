import { bem } from "@schema-benchmarks/utils";
import type { ReactNode } from "react";
import { MdSymbol } from "../symbol";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

const cls = bem("empty-state");

export function EmptyState({
  icon,
  title,
  subtitle,
  children,
}: EmptyStateProps) {
  return (
    <div className={cls()}>
      {icon && <MdSymbol className={cls("icon")}>{icon}</MdSymbol>}
      <p className={cls({ element: "title", extra: "typo-headline5" })}>
        {title}
      </p>
      {subtitle && (
        <p className={cls({ element: "subtitle", extra: "typo-body2" })}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
