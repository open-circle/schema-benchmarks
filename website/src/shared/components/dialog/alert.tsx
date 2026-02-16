import type { DistributiveOmit } from "@schema-benchmarks/utils";
import type { ReactNode } from "react";
import bem from "react-bem-helper";

import { useIdDefault } from "#/shared/hooks/use-id-default";

import { type CloseDialog, Dialog, DialogActions, type DialogProps } from ".";
import { Button, type ButtonProps } from "../button";

type ActionProps = DistributiveOmit<ButtonProps, "children" | "onClick">;

export interface AlertDialogProps extends DistributiveOmit<
  DialogProps,
  "children" | "title" | "onCancel"
> {
  title?: ReactNode;
  titleId?: string;
  message: ReactNode;
  messageId?: string;
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
  titleId: titleIdProp,
  message,
  messageId: messageIdProp,
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
  const titleId = useIdDefault(titleIdProp);
  const messageId = useIdDefault(messageIdProp);
  return (
    <Dialog
      {...props}
      role="alertdialog"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={messageId}
      {...cls({ extra: className })}
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
              {...cancelProps}
              {...cls("button", "cancel", cancelProps?.className)}
              onClick={() => {
                const returnValue =
                  typeof cancelProps?.value === "string" ? cancelProps.value : undefined;
                if (closeOnCancel) close(returnValue);
                onCancel?.((newReturnValue) => close(newReturnValue ?? returnValue));
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              {...confirmProps}
              {...cls("button", "confirm", confirmProps?.className)}
              onClick={() => {
                onConfirm((returnValue) => {
                  close(
                    returnValue ??
                      (typeof confirmProps?.value === "string" ? confirmProps.value : undefined),
                  );
                });
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
