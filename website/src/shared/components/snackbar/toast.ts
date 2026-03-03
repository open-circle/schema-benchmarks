import { safeAssign } from "@schema-benchmarks/utils";
import { createIsomorphicFn } from "@tanstack/react-start";
import { toast } from "react-hot-toast";
import { defaultPatterns, WebHaptics } from "web-haptics";

const haptics = createIsomorphicFn().client(() => new WebHaptics())();

export const toastWithHaptics = safeAssign<typeof toast>(
  function toastWithHaptics(message, opts) {
    haptics?.trigger(defaultPatterns.nudge.pattern);
    return toast(message, opts);
  } as typeof toast,
  toast,
  {
    success: (message, opts) => {
      haptics?.trigger(defaultPatterns.success.pattern);
      return toast.success(message, opts);
    },
    error: (message, opts) => {
      haptics?.trigger(defaultPatterns.error.pattern);
      return toast.error(message, opts);
    },
    loading: (message, opts) => {
      haptics?.trigger(defaultPatterns.nudge.pattern);
      return toast.loading(message, opts);
    },
    custom: (message, opts) => {
      haptics?.trigger(defaultPatterns.nudge.pattern);
      return toast.custom(message, opts);
    },
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
