import clsx from "clsx";
import { resolveValue, Toaster } from "react-hot-toast";
import { MdSymbol } from "../symbol";

export function Snackbars() {
  return (
    <Toaster
      position="bottom-center"
      containerClassName="snackbar-queue"
      toastOptions={{
        success: {
          icon: "check_circle",
        },
        error: {
          icon: "error",
        },
        loading: {
          icon: "hourglass_bottom",
        },
        removeDelay: 75,
      }}
    >
      {(t) => (
        <div
          className={clsx(
            "snackbar",
            `snackbar--${t.type}`,
            t.visible && "snackbar--visible",
            t.className,
          )}
          style={t.style}
          {...t.ariaProps}
        >
          {t.icon && <MdSymbol className="snackbar__icon">{t.icon}</MdSymbol>}
          {resolveValue(t.message, t)}
        </div>
      )}
    </Toaster>
  );
}
