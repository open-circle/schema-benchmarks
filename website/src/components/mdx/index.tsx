import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";

interface PreProps extends ComponentPropsWithRef<"pre"> {
  title?: string;
}

export function pre({ title, children, className, ...props }: PreProps) {
  return (
    <pre
      {...props}
      className={clsx(
        className?.includes("language-") ? "" : "language-text",
        className,
      )}
    >
      {title && <h6 className="code-block__title">{title}</h6>}
      {children}
    </pre>
  );
}

export function code({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"code">) {
  return (
    <code
      {...props}
      className={clsx(
        className?.includes("language-") ? "" : "language-text",
        className,
      )}
    >
      {children}
    </code>
  );
}
