import { mergeRefs } from "@schema-benchmarks/utils/react";
import { type ComponentPropsWithRef, type ReactNode, useEffect, useRef, useState } from "react";
import bem from "react-bem-helper";
import { resolveValue, type ValueOrFunction } from "react-hot-toast";

import { classed } from "#src/shared/components/utils";
import { useFocusGroup } from "#src/shared/hooks/use-focus-group";

export type CloseDialog = Record<"close" | "requestClose", (returnValue?: string) => void>;

export interface DialogProps extends Omit<ComponentPropsWithRef<"dialog">, "children"> {
  children: ValueOrFunction<ReactNode, CloseDialog>;
}

const cls = bem("dialog");

export function Dialog({ open, children, ref, className, ...props }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dialogElement, setDialogElement] = useState<HTMLDialogElement | null>(null);
  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);
  return (
    <dialog
      {...props}
      {...cls({ extra: className })}
      ref={mergeRefs(ref, dialogRef, setDialogElement)}
    >
      {resolveValue(children, {
        close(returnValue) {
          return dialogElement?.close(returnValue);
        },
        requestClose(returnValue) {
          return dialogElement?.requestClose(returnValue);
        },
      })}
    </dialog>
  );
}

export function DialogActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const group = useFocusGroup();
  return (
    <div ref={group} {...cls({ element: "actions", extra: className })}>
      {children}
    </div>
  );
}

export const DialogContent = classed.div(cls("content").className);

DialogContent.displayName = "DialogContent";

export const DialogTitle = classed.h2(cls("title").className);

DialogTitle.displayName = "DialogTitle";

export const DialogMessage = classed.p(cls("message").className);

DialogMessage.displayName = "DialogMessage";
