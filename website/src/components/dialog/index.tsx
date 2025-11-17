import { bem, mergeRefs } from "@schema-benchmarks/utils";
import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { resolveValue, type ValueOrFunction } from "react-hot-toast";

export interface DialogProps
  extends Omit<ComponentPropsWithRef<"dialog">, "children"> {
  children: ValueOrFunction<ReactNode, () => void>;
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
      {resolveValue(children, (returnValue?: string) =>
        dialogRef.current?.close(returnValue),
      )}
    </dialog>
  );
}
