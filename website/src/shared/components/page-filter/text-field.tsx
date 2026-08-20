import { TextField, type TextFieldProps } from "#src/shared/components/text-field";
import { useDebouncedSync } from "#src/shared/hooks/use-debounced-sync.ts";
import { useIdDefault } from "#src/shared/hooks/use-id-default";

import type { PageFilterProps } from ".";
import { PageFilter } from ".";

type SupportedValue = string | number;

export interface PageFilterTextFieldProps<Value extends SupportedValue>
  extends
    Omit<TextFieldProps, "title" | "defaultValue" | "onChange">,
    Omit<PageFilterProps, "children"> {
  value: Value;
  /** Callback fired when the value changes. Will be debounced with a 200ms delay. */
  onChange: (value: Value) => void;
}

export function PageFilterTextField<Value extends SupportedValue>({
  title,
  titleId: titleIdProp,
  value: searchValue,
  onChange,
  ...props
}: PageFilterTextFieldProps<Value>) {
  const [local, setLocal] = useDebouncedSync(searchValue, onChange);
  const titleId = useIdDefault(titleIdProp);
  return (
    <PageFilter title={title} titleId={titleId}>
      <TextField
        {...props}
        aria-labelledby={titleId}
        value={local}
        onChange={(event) => {
          const value = (
            typeof searchValue === "number" ? event.target.valueAsNumber : event.target.value
          ) as Value;
          setLocal(value);
        }}
      />
    </PageFilter>
  );
}
