import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";
import type { HapticPattern } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

const cls = bem("radio");

export interface RadioProps extends ComponentPropsWithRef<"input"> {
  haptic?: boolean | HapticPattern;
}

export function Radio({ className, haptic = true, ...props }: RadioProps) {
  const haptics = useWebHaptics();
  return (
    <label
      {...cls({ extra: className })}
      onClick={() => {
        if (haptic) haptics.trigger(typeof haptic === "boolean" ? undefined : haptic);
      }}
    >
      <input type="radio" {...props} />
      <span {...cls("icon")} />
    </label>
  );
}
