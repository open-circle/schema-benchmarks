import { bem } from "@schema-benchmarks/utils";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import {
  type RegisteredRouter,
  useNavigate,
  type ValidateLinkOptions,
} from "@tanstack/react-router";
import { type ChangeEvent, type ReactNode, useCallback } from "react";
import { TextField, type TextFieldProps } from "../text-field";

export interface PageFilterTextFieldProps<LinkOptions = unknown>
  extends Omit<TextFieldProps, "title"> {
  title: ReactNode;
  /**
   * Create the new link options based on the current event.
   *
   * *Should be a stable reference, as will be debounced.*
   */
  getLinkOptions: (
    event: ChangeEvent<HTMLInputElement>,
  ) => ValidateLinkOptions<RegisteredRouter, LinkOptions>;
}

const cls = bem("page-filters");

export function PageFilterTextField<LinkOptions>({
  title,
  getLinkOptions,
  ...props
}: PageFilterTextFieldProps<LinkOptions>) {
  const navigate = useNavigate();
  const debouncedOnChange = useDebouncedCallback(
    useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        navigate({ ...getLinkOptions(event), replace: true });
      },
      [getLinkOptions, navigate],
    ),
    { wait: 200 },
  );
  return (
    <div className={cls("group")}>
      <h6 className="typo-subtitle2">{title}</h6>
      <TextField {...props} onChange={debouncedOnChange} />
    </div>
  );
}
