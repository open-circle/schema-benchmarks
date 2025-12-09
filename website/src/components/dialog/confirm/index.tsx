import type { DistributiveOmit } from "@schema-benchmarks/utils";
import { mergeRefs } from "@schema-benchmarks/utils/react";
import { useRef } from "react";
import { useExternalStore } from "@/hooks/store.ts";
import { AlertDialog, type AlertDialogProps } from "../alert.tsx";
import { confirmQueue } from "./queue";

export interface ConfirmDialogProps
  extends DistributiveOmit<
    AlertDialogProps,
    "onConfirm" | "onCancel" | "open"
  > {}

export function ConfirmDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = useExternalStore(confirmQueue, ([current]) => current);

  return (
    current && (
      <AlertDialog
        {...current.props}
        ref={mergeRefs(dialogRef, current.props.ref)}
        open={!current.closing}
        onConfirm={(close) => {
          close();
          confirmQueue.resolve(current.id, dialogRef.current?.returnValue);
        }}
        onCancel={() => {
          confirmQueue.reject(current.id, dialogRef.current?.returnValue);
        }}
      />
    )
  );
}
