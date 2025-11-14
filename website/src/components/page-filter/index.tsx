import { bem } from "@schema-benchmarks/utils";
import {
  Link,
  type RegisteredRouter,
  type ValidateLinkOptions,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useFocusGroup } from "@/hooks/use-focus-group";
import { MdSymbol } from "../symbol";

export interface OptionLabel {
  label: ReactNode;
  icon: ReactNode;
}

export interface PageFilterGroupProps<
  Options extends string,
  LinkOptions = unknown,
> {
  title: ReactNode;
  options: ReadonlyArray<Options>;
  labels: Record<Options, OptionLabel>;
  getLinkOptions: (
    option: Options,
  ) => ValidateLinkOptions<RegisteredRouter, LinkOptions>;
}

const cls = bem("page-filters");

export function PageFilterGroup<Options extends string, LinkOptions>({
  title,
  options,
  labels,
  getLinkOptions,
}: PageFilterGroupProps<Options, LinkOptions>) {
  const groupRef = useFocusGroup();
  return (
    <div className={cls("group")}>
      <h6 className="typo-caption">{title}</h6>
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
    </div>
  );
}
