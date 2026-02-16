import type { ComponentPropsWithRef } from "react";
import bem from "react-bem-helper";

export interface SpinnerProps extends ComponentPropsWithRef<"div"> {
  size?: number;
  segmentCount?: number;
  inheritColor?: boolean;
}

const cls = bem("spinner");

const maxSegments = 5;

export function Spinner({
  size,
  className,
  segmentCount = maxSegments,
  inheritColor = false,
  style,
  ...props
}: SpinnerProps) {
  return (
    <div
      {...props}
      role="progressbar"
      {...cls({
        modifiers: { "inherit-color": inheritColor },
        extra: className,
      })}
      style={{ fontSize: size ? `${size}px` : undefined, ...style }}
    >
      {Array.from({ length: Math.min(segmentCount, maxSegments) }, (_, i) => (
        <div key={i} {...cls("segment")} />
      ))}
    </div>
  );
}
