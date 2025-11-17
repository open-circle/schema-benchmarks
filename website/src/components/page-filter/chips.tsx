import {
  Link,
  type RegisteredRouter,
  type ValidateLinkOptions,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useFocusGroup } from "@/hooks/use-focus-group";
import { MdSymbol } from "../symbol";
import type { PageFilterProps } from ".";
import { PageFilter } from ".";

export interface OptionLabel {
  label: ReactNode;
  icon: ReactNode;
}

export interface PageFilterChipsProps<
  Options extends string,
  LinkOptions = unknown,
> extends Omit<PageFilterProps, "children"> {
  options: ReadonlyArray<Options>;
  labels: Record<Options, OptionLabel>;
  getLinkOptions: (
    option: Options,
  ) => ValidateLinkOptions<RegisteredRouter, LinkOptions>;
}

export function PageFilterChips<Options extends string, LinkOptions>({
  title,
  options,
  labels,
  getLinkOptions,
}: PageFilterChipsProps<Options, LinkOptions>) {
  const groupRef = useFocusGroup();
  return (
    <PageFilter title={title}>
      <div className="chip-collection" ref={groupRef}>
        {options.map((option) => (
          <Link
            key={option}
            {...(getLinkOptions(option) as ValidateLinkOptions)}
            className="chip"
            replace
          >
            <MdSymbol>{labels[option].icon}</MdSymbol>
            {labels[option].label}
          </Link>
        ))}
      </div>
    </PageFilter>
  );
}
