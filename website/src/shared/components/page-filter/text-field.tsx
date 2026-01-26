import { useDebouncedCallback } from "@tanstack/react-pacer";
import {
  type RegisteredRouter,
  useNavigate,
  type ValidateLinkOptions,
} from "@tanstack/react-router";
import { type ChangeEvent, useEffect, useState } from "react";
import { useIdDefault } from "@/shared/hooks/use-id-default";
import { TextField, type TextFieldProps } from "../text-field";
import type { PageFilterProps } from ".";
import { PageFilter } from ".";

export interface PageFilterTextFieldProps<LinkOptions = unknown>
  extends Omit<TextFieldProps, "title" | "defaultValue">,
    Omit<PageFilterProps, "children"> {
  /**
   * Create the new link options based on the current event.
   */
  getLinkOptions: (
    event: ChangeEvent<HTMLInputElement>,
  ) => ValidateLinkOptions<RegisteredRouter, LinkOptions>;
}

export function PageFilterTextField<LinkOptions>({
  title,
  titleId: titleIdProp,
  getLinkOptions,
  value: searchValue,
  ...props
}: PageFilterTextFieldProps<LinkOptions>) {
  const titleId = useIdDefault(titleIdProp);
  const navigate = useNavigate();
  const debouncedOnChange = useDebouncedCallback(
    (event) => {
      navigate({ ...getLinkOptions(event), replace: true });
    },
    { wait: 200 },
  );
  const [value, setValue] = useState(searchValue);
  useEffect(() => {
    setValue(searchValue);
  }, [searchValue]);
  return (
    <PageFilter title={title} titleId={titleId}>
      <TextField
        {...props}
        aria-labelledby={titleId}
        value={value}
        onChange={(event) => {
          setValue(event.target.valueAsNumber);
          debouncedOnChange(event);
        }}
      />
    </PageFilter>
  );
}
