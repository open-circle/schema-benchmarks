import { bem } from "@schema-benchmarks/utils";
import { resolveValue, Toaster } from "react-hot-toast";
import { Spinner } from "../spinner";
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
          {t.type === "loading" && (
            <Spinner className={cls("icon")} size={24} />
          )}
          {resolveValue(t.message, t)}
        </div>
      )}
    </Toaster>
  );
}
