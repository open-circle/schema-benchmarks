import type { ReactNode } from "react";
import bem from "react-bem-helper";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

const cls = bem("empty-state");

export function EmptyState({ icon, title, subtitle, children }: EmptyStateProps) {
  return (
    <div {...cls()}>
      {icon && <div {...cls("icon")}>{icon}</div>}
      <p {...cls({ element: "title", extra: "typo-headline5" })}>{title}</p>
      {subtitle && <p {...cls({ element: "subtitle", extra: "typo-body2" })}>{subtitle}</p>}
      {children}
    </div>
  );
}
