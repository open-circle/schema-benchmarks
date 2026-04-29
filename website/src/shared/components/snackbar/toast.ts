import { safeAssign } from "@schema-benchmarks/utils";
import { toast } from "react-hot-toast";
import type { HapticPattern } from "web-haptics";
import { defaultPatterns } from "web-haptics";

import { haptics } from "#/shared/lib/haptics";

function withHaptics<Args extends Array<any>, Return>(
  fn: (...args: Args) => Return,
  pattern: HapticPattern,
) {
  return (...args: Args) => {
    haptics?.trigger(pattern);
    return fn(...args);
  };
}

export const toastWithHaptics = safeAssign<typeof toast>(
  withHaptics(toast, defaultPatterns.nudge.pattern) as typeof toast,
  toast,
  {
    success: withHaptics(toast.success, defaultPatterns.success.pattern),
    error: withHaptics(toast.error, defaultPatterns.error.pattern),
    loading: withHaptics(toast.loading, defaultPatterns.nudge.pattern),
    custom: withHaptics(toast.custom, defaultPatterns.nudge.pattern),
    promise: (promise, msgs, opts) => {
      haptics?.trigger(defaultPatterns.nudge.pattern);
      return toast.promise(
        () => {
          const p = typeof promise === "function" ? promise() : promise;
          p.then(
            () => haptics?.trigger(defaultPatterns.success.pattern),
            () => haptics?.trigger(defaultPatterns.error.pattern),
          );
          return p;
        },
        msgs,
        opts,
      );
    },
  },
);
