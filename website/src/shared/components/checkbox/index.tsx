import type { ComponentPropsWithoutRef, Ref } from "react";
import bem from "react-bem-helper";
import type { HapticPattern } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { withTooltip } from "#src/shared/components/tooltip/index.tsx";

const cls = bem("checkbox");

type LabelProps =
  | {
      asLabel?: true;
      labelProps?: Omit<ComponentPropsWithoutRef<"label">, "className">;
      ref?: Ref<HTMLLabelElement>;
    }
  | {
      asLabel?: false;
      labelProps?: Omit<ComponentPropsWithoutRef<"div">, "className">;
      ref?: Ref<HTMLDivElement>;
    };

export type CheckboxProps = ComponentPropsWithoutRef<"input"> & {
  inputRef?: Ref<HTMLInputElement>;
  haptic?: boolean | HapticPattern;
} & LabelProps;

export const Checkbox = withTooltip(function Checkbox({
  className,
  haptic = true,
  labelProps,
  ref,
  inputRef,
  asLabel = true,
  ...props
}: CheckboxProps) {
  const haptics = useWebHaptics();
  const Label = asLabel ? "label" : "div";
  return (
    <Label
      {...(labelProps as {})}
      {...cls({ extra: className })}
      onClick={(e) => {
        if (haptic) void haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
        labelProps?.onClick?.(e as never);
      }}
      ref={ref as never}
    >
      <input type="checkbox" ref={inputRef} {...props} />
      <div {...cls("icon")}>
        <MdSymbol>check_small</MdSymbol>
      </div>
    </Label>
  );
});

export function ControlLabel({ children, ...props }: ComponentPropsWithoutRef<"label">) {
  return (
    <label {...cls({ element: "control-label", extra: "typo-subtitle2" })} {...props}>
      {children}
    </label>
  );
}
