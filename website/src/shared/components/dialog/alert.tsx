import type { DistributiveOmit } from "@schema-benchmarks/utils";
import type { ReactNode } from "react";
import bem from "react-bem-helper";

import { useIdDefault } from "#/shared/hooks/use-id-default";

import {
  type CloseDialog,
  Dialog,
  DialogActions,
  DialogContent,
  DialogMessage,
  type DialogProps,
  DialogTitle,
} from ".";
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
      {({ close, requestClose }) => (
        <>
          <DialogContent>
            {title && <DialogTitle id={titleId}>{title}</DialogTitle>}
            <DialogMessage id={messageId}>{message}</DialogMessage>
          </DialogContent>
          <DialogActions>
            <Button
              {...cancelProps}
              {...cls("button", "cancel", cancelProps?.className)}
              onClick={() => {
                const returnValue =
                  typeof cancelProps?.value === "string" ? cancelProps.value : undefined;
                if (closeOnCancel) requestClose(returnValue);
                onCancel?.({
                  close(newReturnValue) {
                    close(newReturnValue ?? returnValue);
                  },
                  requestClose(newReturnValue) {
                    requestClose(newReturnValue ?? returnValue);
                  },
                });
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              {...confirmProps}
              {...cls("button", "confirm", confirmProps?.className)}
              onClick={() => {
                const returnValue =
                  typeof confirmProps?.value === "string" ? confirmProps.value : undefined;
                onConfirm({
                  close(newReturnValue) {
                    close(newReturnValue ?? returnValue);
                  },
                  requestClose(newReturnValue) {
                    requestClose(newReturnValue ?? returnValue);
                  },
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
