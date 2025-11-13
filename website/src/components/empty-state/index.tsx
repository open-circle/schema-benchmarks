import { MdSymbol } from "../symbol";

export interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  children,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <MdSymbol className="empty-state__icon">{icon}</MdSymbol>}
      <p className="typo-headline5 empty-state__title">{title}</p>
      {subtitle && (
        <p className="typo-body2 empty-state__subtitle">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
