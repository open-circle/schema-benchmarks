import { bem } from "@schema-benchmarks/utils";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import {
  type RegisteredRouter,
  useNavigate,
  type ValidateLinkOptions,
} from "@tanstack/react-router";
import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";
import { TextField, type TextFieldProps } from "../text-field";

export interface PageFilterTextFieldProps<LinkOptions = unknown>
  extends Omit<TextFieldProps, "title" | "defaultValue"> {
  title: ReactNode;
  /**
   * Create the new link options based on the current event.
   */
  getLinkOptions: (
    event: ChangeEvent<HTMLInputElement>,
  ) => ValidateLinkOptions<RegisteredRouter, LinkOptions>;
}

const cls = bem("page-filters");

export function PageFilterTextField<LinkOptions>({
  title,
  getLinkOptions,
  value: searchValue,
  ...props
}: PageFilterTextFieldProps<LinkOptions>) {
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
    <div className={cls("group")}>
      <h6 className="typo-caption">{title}</h6>
      <TextField
        {...props}
        value={value}
        onChange={(event) => {
          setValue(event.target.valueAsNumber);
          debouncedOnChange(event);
        }}
      />
    </div>
  );
}
