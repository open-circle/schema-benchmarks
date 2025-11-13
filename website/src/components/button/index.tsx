import clsx from "clsx";

export interface ToggleButtonProps {
  variant: "toggle";
  color?: never;
}

export interface ButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "danger";
}

export const getButtonClasses = ({
  variant = "text",
  color = variant !== "toggle" ? "primary" : undefined,
}: ButtonProps | ToggleButtonProps = {}) =>
  clsx("button", `button--${variant}`, color && `button--${color}`);
