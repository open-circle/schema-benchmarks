import clsx from "clsx";

export interface ToggleButtonProps {
  variant: "toggle";
  color?: never;
}

export interface FloatingActionButtonProps {
  variant: "floating-action";
  color?: never;
}

export interface ButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "danger" | "success" | "error";
}

export const getButtonClasses = ({
  variant = "text",
  color = variant !== "toggle" ? "primary" : undefined,
}: ButtonProps | ToggleButtonProps | FloatingActionButtonProps = {}) =>
  clsx("button", `button--${variant}`, color && `button--${color}`);
