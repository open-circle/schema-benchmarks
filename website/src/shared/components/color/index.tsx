import bem from "react-bem-helper";

export interface ColorDisplayProps {
  color: string;
  size?: "small" | "medium" | "large";
}

const cls = bem("color-display");

export function ColorDisplay({ color, size = "medium" }: ColorDisplayProps) {
  return (
    <div
      {...cls({ modifier: size })}
      style={{
        backgroundColor: color,
      }}
    />
  );
}
