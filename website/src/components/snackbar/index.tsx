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
          icon: <MdSymbol>check_circle</MdSymbol>,
        },
        error: {
          icon: <MdSymbol>error</MdSymbol>,
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
          {t.icon && <div className={cls("icon")}>{t.icon}</div>}
          {t.type === "loading" && (
            <Spinner className={cls("icon")} size={24} />
          )}
          {resolveValue(t.message, t)}
        </div>
      )}
    </Toaster>
  );
}
