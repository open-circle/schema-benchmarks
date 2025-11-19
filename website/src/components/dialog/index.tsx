import { bem, mergeRefs } from "@schema-benchmarks/utils";
import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { resolveValue, type ValueOrFunction } from "react-hot-toast";
import { useFocusGroup } from "@/hooks/use-focus-group";

export type CloseDialog = (returnValue?: string) => void;

export interface DialogProps
  extends Omit<ComponentPropsWithRef<"dialog">, "children"> {
  children: ValueOrFunction<ReactNode, CloseDialog>;
}

const cls = bem("dialog");

export function Dialog({
  open,
  children,
  ref,
  className,
  ...props
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
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
      className={cls({ extra: className })}
      ref={mergeRefs(ref, dialogRef)}
    >
      {resolveValue(children, (returnValue) =>
        dialogRef.current?.close(returnValue),
      )}
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
    <div ref={group} className={cls({ element: "actions", extra: className })}>
      {children}
    </div>
  );
}
