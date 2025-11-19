import { bem, type DistributiveOmit } from "@schema-benchmarks/utils";
import { type ReactNode, useId } from "react";
import { Button, type ButtonProps } from "../button";
import { type CloseDialog, Dialog, DialogActions, type DialogProps } from ".";

type ActionProps = DistributiveOmit<ButtonProps, "children" | "onClick">;

export interface AlertDialogProps
  extends DistributiveOmit<DialogProps, "children" | "title" | "onCancel"> {
  title?: ReactNode;
  message: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  onConfirm: (close: CloseDialog) => void;
  onCancel?: (close: CloseDialog) => void;
  /** @default true */
  closeOnCancel?: boolean;
  cancelProps?: ActionProps;
  confirmProps?: ActionProps;
}

const cls = bem("alert-dialog");

export function AlertDialog({
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel,
  cancelProps,
  confirmProps,
  className,
  onConfirm,
  onCancel,
  closeOnCancel = true,
  ...props
}: AlertDialogProps) {
  const titleId = useId();
  const messageId = useId();
  return (
    <Dialog
      {...props}
      role="alertdialog"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={messageId}
      className={cls({ extra: className })}
    >
      {(close) => (
        <>
          <div className="dialog__content">
            {title && (
              <h2 id={titleId} className="dialog__title">
                {title}
              </h2>
            )}
            <p id={messageId} className="dialog__message">
              {message}
            </p>
          </div>
          <DialogActions>
            <Button
              autoFocus
              {...cancelProps}
              className={cls("button", "cancel", cancelProps?.className)}
              onClick={() => {
                onCancel?.(close);
                if (closeOnCancel) close();
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              {...confirmProps}
              className={cls("button", "confirm", confirmProps?.className)}
              onClick={() => {
                onConfirm(close);
              }}
            >
              {confirmLabel}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
