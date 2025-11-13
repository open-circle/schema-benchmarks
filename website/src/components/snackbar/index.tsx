import { bem } from "@schema-benchmarks/utils";
import { resolveValue, Toaster } from "react-hot-toast";
import { MdSymbol } from "../symbol";

const cls = bem("snackbar");

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
          className={cls({
            modifiers: {
              visible: t.visible,
              [t.type]: true,
            },
            extra: t.className,
          })}
          style={t.style}
          {...t.ariaProps}
        >
          {t.icon && <MdSymbol className={cls("icon")}>{t.icon}</MdSymbol>}
          {resolveValue(t.message, t)}
        </div>
      )}
    </Toaster>
  );
}
