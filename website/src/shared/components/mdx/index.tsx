import { mergeRefs } from "@schema-benchmarks/utils/react";
import clsx from "clsx";
import { useRef, type ComponentPropsWithRef } from "react";

import { trackedLinkProps } from "#/shared/lib/analytics";

import { ToggleButton } from "../button/toggle";
import { toastWithHaptics } from "../snackbar/toast";
import { MdSymbol } from "../symbol";

interface PreProps extends ComponentPropsWithRef<"pre"> {
  title?: string;
  disableCopy?: boolean;
}

export function pre({ title, children, className, disableCopy, ref, ...props }: PreProps) {
  const innerRef = useRef<HTMLPreElement>(null);
  return (
    <pre
      {...props}
      ref={mergeRefs(ref, innerRef)}
      className={clsx(className?.includes("language-") ? "" : "language-text", className)}
    >
      {(title || !disableCopy) && (
        <div className="code-block__title">
          {title}
          {!disableCopy && (
            <ToggleButton
              className="code-block__copy"
              tooltip="Copy to clipboard"
              onClick={() => {
                const text = innerRef.current?.querySelector("code")?.textContent;
                if (text) {
                  navigator.clipboard.writeText(text).then(
                    () => toastWithHaptics.success("Copied code to clipboard"),
                    () => toastWithHaptics.error("Failed to copy"),
                  );
                }
              }}
            >
              <MdSymbol>content_copy</MdSymbol>
            </ToggleButton>
          )}
        </div>
      )}
      {children}
    </pre>
  );
}

export function code({ children, className, ...props }: ComponentPropsWithRef<"code">) {
  return (
    <code
      {...props}
      className={clsx(className?.includes("language-") ? "" : "language-text", className)}
    >
      {children}
    </code>
  );
}

export function a({ href, children, ...props }: ComponentPropsWithRef<"a">) {
  return (
    <a {...(href?.startsWith("http") ? trackedLinkProps(href) : { href })} {...props}>
      {children}
    </a>
  );
}
