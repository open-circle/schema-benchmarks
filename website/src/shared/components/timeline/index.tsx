import type { ReactNode } from "react";
import bem from "react-bem-helper";

import type { DateInput } from "#/shared/components/date";
import { DateDisplay } from "#/shared/components/date";
import { classed } from "#/shared/components/utils";

const cls = bem("timeline");

export const Timeline = classed.ol(cls().className);

export interface TimelineItemProps {
  date: DateInput;
  icon?: {
    children: ReactNode;
    color: "info" | "success" | "warning" | "error";
  };
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}

export function TimelineItem({ date, icon, title, subtitle, children }: TimelineItemProps) {
  return (
    <li {...cls("item")}>
      <div {...cls({ element: "container" })}>
        {icon && (
          <div {...cls({ element: "icon" })} style={{ color: `var(--${icon.color})` }}>
            {icon.children}
          </div>
        )}
        <hgroup {...cls("header")}>
          <p {...cls({ element: "date", extra: "typo-caption" })}>
            <DateDisplay date={date} />
          </p>
          <h3 {...cls({ element: "title", extra: "typo-headline5" })}>{title}</h3>
          {!!subtitle && (
            <p {...cls({ element: "subtitle", extra: "typo-subtitle2" })}>{subtitle}</p>
          )}
        </hgroup>
        <div {...cls({ element: "body" })}>{children}</div>
      </div>
    </li>
  );
}
