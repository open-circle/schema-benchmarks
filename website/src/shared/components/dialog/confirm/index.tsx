import type { DistributiveOmit } from "@schema-benchmarks/utils";
import { mergeRefs } from "@schema-benchmarks/utils/react";
import { useSelector } from "@tanstack/react-store";
import { useRef } from "react";

import { AlertDialog, type AlertDialogProps } from "../alert.tsx";
import { confirmQueue } from "./queue.ts";

export interface ConfirmDialogProps extends DistributiveOmit<
  AlertDialogProps,
  "onConfirm" | "onCancel" | "open"
> {}

export function ConfirmDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = useSelector(confirmQueue, ([current]) => current);

  return (
    current && (
      <AlertDialog
        {...current.props}
        ref={mergeRefs(dialogRef, current.props.ref)}
        open={!current.closing}
        onConfirm={(close) => {
          close();
          confirmQueue.actions.resolve(current.id, dialogRef.current?.returnValue);
        }}
        onCancel={() => {
          confirmQueue.actions.reject(current.id, dialogRef.current?.returnValue);
        }}
      />
    )
  );
}
