import type { Override } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";
import type { ReactNode } from "react";
import bem from "react-bem-helper";

import { ToggleButton } from "#src/shared/components/button/toggle";
import { toastWithHaptics } from "#src/shared/components/snackbar/toast";
import { MdSymbol } from "#src/shared/components/symbol";
import { getHighlightedCode, getResponsiveFormattedCode } from "#src/shared/lib/highlight";

const defaultLanguage = "typescript";

interface InlineCodeProps {
  children: string;
  language?: string;
  lineNumbers?: boolean;
  className?: string;
}

export function InlineCode({
  children,
  language = defaultLanguage,
  lineNumbers,
  className,
}: InlineCodeProps) {
  const { data } = useSuspenseQuery(getHighlightedCode({ code: children, language, lineNumbers }));
  return (
    <code
      dir="ltr"
      className={clsx(`language-${language}`, className)}
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}

export interface CodeProps extends InlineCodeProps {
  title?: string;
  showCopy?: boolean;
  actions?: ReactNode;
}

export function CodeBlockContainer({
  children,
  title,
  lineNumbers = false,
  language = defaultLanguage,
  showCopy,
  raw,
  actions,
  className,
}: Override<CodeProps, { children: ReactNode; raw: string }>) {
  return (
    <pre
      dir="ltr"
      className={clsx(`language-${language}`, lineNumbers && "line-numbers", className)}
    >
      {(title || showCopy || actions) && (
        <div className="code-block__title">
          <span className="code-block__title-text">{title}</span>
          {actions || showCopy ? (
            <div className="code-block__actions">
              {actions}
              {showCopy && (
                <ToggleButton
                  className="code-block__copy"
                  tooltip="Copy to clipboard"
                  onClick={() => {
                    navigator.clipboard.writeText(raw).then(
                      () => toastWithHaptics.success("Copied code to clipboard"),
                      () => toastWithHaptics.error("Failed to copy"),
                    );
                  }}
                >
                  <MdSymbol>content_copy</MdSymbol>
                </ToggleButton>
              )}
            </div>
          ) : null}
        </div>
      )}
      {children}
    </pre>
  );
}

export function CodeBlock({ children, ...props }: CodeProps) {
  return (
    <CodeBlockContainer {...props} raw={children}>
      <InlineCode {...props}>{children}</InlineCode>
    </CodeBlockContainer>
  );
}

export interface ResponsiveCodeBlockProps extends CodeProps {
  fileName: string;
}

const cls = bem("responsive-code-block");

export function ResponsiveCodeBlock({
  children,
  fileName,
  className,
  ...props
}: ResponsiveCodeBlockProps) {
  const { data } = useSuspenseQuery(getResponsiveFormattedCode({ fileName, sourceText: children }));
  return (
    <div {...cls()}>
      {data.map(({ code, widths }) => (
        <CodeBlock
          key={widths.join()}
          {...cls({
            element: "block",
            modifiers: widths.map(String),
            extra: className,
          })}
          {...props}
        >
          {code}
        </CodeBlock>
      ))}
    </div>
  );
}
