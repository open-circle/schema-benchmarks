import { bem } from "@schema-benchmarks/utils";
import { useFocusGroup } from "@/hooks/use-focus-group";

export interface ToggleButtonProps {
  variant: "toggle";
  color?: never;
  activeColor?: ButtonColor;
}

export interface FloatingActionButtonProps {
  variant: "floating-action";
  color?: never;
  activeColor?: never;
}

type ButtonColor = "primary" | "secondary" | "danger" | "success" | "error";

export interface ButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?: ButtonColor;
  activeColor?: never;
}

const buttonCls = bem("button");

export const getButtonClasses = ({
  variant = "text",
  color = variant !== "toggle" ? "primary" : undefined,
  activeColor = "primary",
}: ButtonProps | ToggleButtonProps | FloatingActionButtonProps = {}) =>
  buttonCls({ modifiers: [variant, color ?? "", `active-${activeColor}`] });

const buttonGroupCls = bem("button-group");

export function ButtonGroup({
  children,
  variant = "text",
  className,
}: {
  children: React.ReactNode;
  variant?: "text" | "outlined";
  className?: string;
}) {
  const group = useFocusGroup();
  return (
    <div
      className={buttonGroupCls({ modifiers: [variant], extra: className })}
      ref={group}
    >
      {children}
    </div>
  );
}
