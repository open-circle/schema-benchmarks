import { useDebouncedCallback } from "@tanstack/react-pacer";
import {
  type RegisteredRouter,
  useNavigate,
  type ValidateLinkOptions,
} from "@tanstack/react-router";
import { castDraft } from "mutative";
import { type ChangeEvent } from "react";

import { TextField, type TextFieldProps } from "#src/shared/components/text-field";
import { useIdDefault } from "#src/shared/hooks/use-id-default";
import type { PayloadAction } from "#src/shared/hooks/use-local-slice";
import { useLocalSlice } from "#src/shared/hooks/use-local-slice";

import type { PageFilterProps } from ".";
import { PageFilter } from ".";

export interface PageFilterTextFieldProps<LinkOptions = unknown>
  extends Omit<TextFieldProps, "title" | "defaultValue">, Omit<PageFilterProps, "children"> {
  /**
   * Create the new link options based on the current event.
   */
  getLinkOptions: (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => ValidateLinkOptions<RegisteredRouter, LinkOptions>;
}

export function PageFilterTextField<LinkOptions>({
  title,
  titleId: titleIdProp,
  getLinkOptions,
  value: searchValue,
  ...props
}: PageFilterTextFieldProps<LinkOptions>) {
  const [{ local, snapshot }, dispatchAction] = useLocalSlice({
    initialState: { snapshot: searchValue, local: searchValue },
    reducers: {
      resync: (state, { payload }: PayloadAction<typeof searchValue>) => {
        state.snapshot = castDraft(payload);
        state.local = castDraft(payload);
      },
      setLocal: (state, { payload }: PayloadAction<typeof searchValue>) => {
        state.local = castDraft(payload);
      },
    },
  });
  if (!Object.is(searchValue, snapshot)) {
    dispatchAction.resync(searchValue);
  }
  const titleId = useIdDefault(titleIdProp);
  const navigate = useNavigate();
  const debouncedOnChange = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      void navigate({ ...getLinkOptions(event), replace: true });
    },
    { wait: 200 },
  );
  return (
    <PageFilter title={title} titleId={titleId}>
      <TextField
        {...props}
        aria-labelledby={titleId}
        value={local}
        onChange={(event) => {
          debouncedOnChange(event);
          dispatchAction.setLocal(
            typeof searchValue === "number" ? event.target.valueAsNumber : event.target.value,
          );
        }}
      />
    </PageFilter>
  );
}
