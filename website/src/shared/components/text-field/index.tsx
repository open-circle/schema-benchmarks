import { mergeListeners } from "@schema-benchmarks/utils/react";
import { useState, type ComponentPropsWithRef, type ReactNode } from "react";
import bem from "react-bem-helper";

import { useIdDefault } from "#src/shared/hooks/use-id-default";

export interface TextFieldProps extends ComponentPropsWithRef<"input"> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  endIconIsButton?: boolean;
  prefix?: string;
  suffix?: string;
  helpText?: ReactNode;
  errorMessage?: ReactNode;
}

declare module "react" {
  interface CSSProperties {
    "--text-field-min-width"?: string | number;
  }
}

const cls = bem("text-field");

export function TextField({
  className,
  startIcon,
  prefix,
  suffix,
  endIcon,
  endIconIsButton,
  errorMessage,
  helpText,
  id: idProp,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  onBlur,
  onChange,
  style,
  ...props
}: TextFieldProps) {
  const id = useIdDefault(idProp);
  const messageId = `${id}-message`;
  const [nativeInvalid, setNativeInvalid] = useState(false);
  function calcNativeInvalid(event: React.SyntheticEvent<HTMLInputElement>) {
    setNativeInvalid(event.currentTarget.matches(":user-invalid"));
  }
  const message = errorMessage || helpText;
  const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(" ");

  return (
    <label
      {...cls({
        modifiers: {
          error: !!errorMessage,
        },
        extra: className,
      })}
      style={style}
    >
      <div {...cls({ element: "container", extra: "typo-subtitle1" })}>
        {startIcon && <div {...cls("start-icon")}>{startIcon}</div>}
        {prefix && <span {...cls("prefix")}>{prefix}</span>}
        <input
          {...props}
          id={id}
          aria-describedby={describedBy || undefined}
          aria-invalid={errorMessage ? true : (ariaInvalid ?? (nativeInvalid ? true : undefined))}
          onBlur={mergeListeners(onBlur, calcNativeInvalid)}
          onChange={mergeListeners(onChange, calcNativeInvalid)}
          {...cls("input")}
        />
        {suffix && <span {...cls("suffix")}>{suffix}</span>}
        {endIcon &&
          (endIconIsButton ? (
            <div {...cls("end-button")}>{endIcon}</div>
          ) : (
            <div {...cls("end-icon")}>{endIcon}</div>
          ))}
      </div>
      {message ? (
        <div {...cls("message-container")}>
          <p
            id={messageId}
            {...cls({
              element: "message",
              extra: "typo-caption",
            })}
          >
            {message}
          </p>
        </div>
      ) : null}
    </label>
  );
}
