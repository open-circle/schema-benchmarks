import type {
  RegisteredRouter,
  ValidateLinkOptions,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useIdDefault } from "@/hooks/use-id-default";
import { ChipCollection, LinkChip } from "../chip";
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
          >
            <MdSymbol>{labels[option].icon}</MdSymbol>
            {labels[option].label}
          </LinkChip>
        ))}
      </ChipCollection>
    </PageFilter>
  );
}
