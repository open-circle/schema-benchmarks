import clsx from "clsx";

export interface ButtonProps {
  variant?: "text" | "outlined" | "contained" | "toggle";
  color?: "primary" | "secondary" | "danger";
}

export const getButtonClasses = ({
  variant = "text",
  color = "primary",
}: ButtonProps = {}) =>
  clsx("button", `button--${variant}`, `button--${color}`);
