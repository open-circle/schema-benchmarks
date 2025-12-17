import type { ComponentPropsWithRef, ReactNode } from "react";
import bem from "react-bem-helper";

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
  style,
  ...props
}: TextFieldProps) {
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
        <input {...props} {...cls("input")} />
        {suffix && <span {...cls("suffix")}>{suffix}</span>}
        {endIcon &&
          (endIconIsButton ? (
            <div {...cls("end-button")}>{endIcon}</div>
          ) : (
            <div {...cls("end-icon")}>{endIcon}</div>
          ))}
      </div>
      {errorMessage || helpText ? (
        <div {...cls("message-container")}>
          <p
            {...cls({
              element: "message",
              extra: "typo-caption",
            })}
          >
            {errorMessage || helpText}
          </p>
        </div>
      ) : null}
    </label>
  );
}
