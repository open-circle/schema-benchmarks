import type { ComponentPropsWithoutRef, Ref } from "react";
import bem from "react-bem-helper";
import type { HapticPattern } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { withTooltip } from "#src/shared/components/tooltip/index.tsx";

const cls = bem("checkbox");

export interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  ref?: Ref<HTMLLabelElement>;
  inputRef?: Ref<HTMLInputElement>;
  labelProps?: Omit<ComponentPropsWithoutRef<"label">, "className">;
  haptic?: boolean | HapticPattern;
}

export const Checkbox = withTooltip(function Checkbox({
  className,
  haptic = true,
  labelProps,
  ref,
  inputRef,
  ...props
}: CheckboxProps) {
  const haptics = useWebHaptics();
  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events jsx-a11y/no-noninteractive-element-interactions
    <label
      {...labelProps}
      {...cls({ extra: className })}
      onClick={(e) => {
        if (haptic) void haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
        labelProps?.onClick?.(e);
      }}
      ref={ref}
    >
      <input type="checkbox" ref={inputRef} {...props} />
      <div {...cls("icon")}>
        <MdSymbol>check_small</MdSymbol>
      </div>
    </label>
  );
});
