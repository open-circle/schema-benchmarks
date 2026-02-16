import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";

export interface MdSymbolProps extends ComponentPropsWithRef<"span"> {
  children: string;
  flipRtl?: boolean;

  // provided for convenience, but prefer using CSS vars where possible
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: number;
  opticalSize?: number;
  size?: number;
}

/**
 * A Material Symbols component.
 *
 * **Important**: this component is inspected by the compiler to determine which symbols are used, to reduce the size of the font request.
 * If you use a symbol in a dynamic way (e.g. `<MdSymbol>{icon}</MdSymbol>`), you will need to manually add it to the list of known symbols in `vite.config.ts`.
 */
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
  ...props
}: MdSymbolProps) {
  return (
    <span
      {...props}
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
