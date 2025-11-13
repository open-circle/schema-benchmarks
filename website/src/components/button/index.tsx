import clsx from "clsx";

export interface ButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "danger";
}

export const getButtonClasses = ({
  variant = "text",
  color = "primary",
}: ButtonProps = {}) =>
  clsx("button", `button__${variant}`, `button__${color}`);
