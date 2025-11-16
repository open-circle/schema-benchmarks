import { bem } from "@schema-benchmarks/utils";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { MdSymbol } from "../symbol";

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
      className={cls({
        modifiers: {
          error: !!errorMessage,
        },
        extra: className,
      })}
      style={style}
    >
      <div className={cls({ element: "container", extra: "typo-subtitle1" })}>
        {startIcon && (
          <MdSymbol className={cls("start-icon")}>{startIcon}</MdSymbol>
        )}
        {prefix && <span className={cls("prefix")}>{prefix}</span>}
        <input {...props} className={cls("input")} />
        {suffix && <span className={cls("suffix")}>{suffix}</span>}
        {endIcon &&
          (endIconIsButton ? (
            <div className={cls("end-button")}>{endIcon}</div>
          ) : (
            <MdSymbol className={cls("end-icon")}>{endIcon}</MdSymbol>
          ))}
      </div>
      {errorMessage || helpText ? (
        <div className={cls("message-container")}>
          <p
            className={cls({
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
