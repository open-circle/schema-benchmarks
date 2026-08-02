import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";
import type { HapticPattern } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

import { MdSymbol } from "#src/shared/components/symbol/index.tsx";

const cls = bem("checkbox");

export interface CheckboxProps extends ComponentPropsWithRef<"input"> {
  haptic?: boolean | HapticPattern;
}

export function Checkbox({ className, haptic = true, ...props }: CheckboxProps) {
  const haptics = useWebHaptics();
  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events jsx-a11y/no-noninteractive-element-interactions
    <label
      {...cls({ extra: className })}
      onClick={() => {
        if (haptic) void haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
      }}
    >
      <input type="checkbox" {...props} />
      <div {...cls("icon")}>
        <MdSymbol>check_small</MdSymbol>
      </div>
    </label>
  );
}
