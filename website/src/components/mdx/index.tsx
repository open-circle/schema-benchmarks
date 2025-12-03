import clsx from "clsx";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithRef } from "react";

interface PreProps extends ComponentPropsWithRef<"pre"> {
  title?: string;
}

function pre({ title, children, ...props }: PreProps) {
  return (
    <pre {...props}>
      {title && <h6 className="code-block__title">{title}</h6>}
      {children}
    </pre>
  );
}

function code({
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

export default {
  pre,
  code,
} satisfies MDXComponents;
