import clsx from "clsx";

export interface MdSymbolProps {
  children: string;
  flipRtl?: boolean;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;

  // provided for convenience, but prefer using CSS vars where possible
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: number;
  opticalSize?: number;
  size?: number;
}

export function MdSymbol({
  children,
  fill,
  weight,
  grade,
  opticalSize,
  size,
  flipRtl,
  className,
  style,
  "aria-label": ariaLabel,
}: MdSymbolProps) {
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-label works i promise
    <span
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      className={clsx("md-symbol material-symbols-sharp", className)}
      data-flip-rtl={flipRtl ? true : undefined}
      style={
        {
          "--icon-fill": typeof fill === "boolean" ? (fill ? 1 : 0) : undefined,
          "--icon-weight": weight,
          "--icon-grade": grade,
          "--icon-optical-size": opticalSize,
          "--icon-size": size,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}
