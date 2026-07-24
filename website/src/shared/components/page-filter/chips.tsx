import type { RegisteredRouter, ValidateLinkOptions } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { ChipCollection, LinkChip } from "#src/shared/components/chip";
import { MdSymbol } from "#src/shared/components/symbol";
import { useIdDefault } from "#src/shared/hooks/use-id-default";

import type { PageFilterProps } from ".";
import { PageFilter } from ".";

export interface OptionLabel {
  label: ReactNode;
  icon: string;
}

export interface PageFilterChipsProps<Options extends string, LinkOptions = unknown> extends Omit<
  PageFilterProps,
  "children"
> {
  options: ReadonlyArray<Options>;
  labels: Record<Options, OptionLabel>;
  getLinkOptions: (option: Options) => ValidateLinkOptions<RegisteredRouter, LinkOptions>;
}

export function PageFilterChips<Options extends string, LinkOptions>({
  title,
  titleId: titleIdProp,
  options,
  labels,
  getLinkOptions,
}: PageFilterChipsProps<Options, LinkOptions>) {
  const titleId = useIdDefault(titleIdProp);
  return (
    <PageFilter title={title} titleId={titleId}>
      <ChipCollection aria-labelledby={titleId}>
        {options.map((option) => (
          <LinkChip
            key={option}
            {...(getLinkOptions(option) as ValidateLinkOptions)}
            replace
            haptic
          >
            <MdSymbol>{labels[option].icon}</MdSymbol>
            {labels[option].label}
          </LinkChip>
        ))}
      </ChipCollection>
    </PageFilter>
  );
}
