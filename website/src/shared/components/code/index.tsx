import { Override } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import * as v from "valibot";

import { getHighlightedCode } from "#/shared/lib/highlight";

import { ToggleButton } from "../button/toggle";
import { toastWithHaptics } from "../snackbar/toast";
import { MdSymbol } from "../symbol";

const defaultLanguage = "typescript";

const codeProps = v.object({
  children: v.string(),
  language: v.optional(v.string(), defaultLanguage),
  lineNumbers: v.optional(v.boolean()),
});
type InlineCodeProps = v.InferInput<typeof codeProps>;

export function InlineCode({ children, language = defaultLanguage, lineNumbers }: InlineCodeProps) {
  const { data } = useSuspenseQuery(getHighlightedCode({ code: children, language, lineNumbers }));
  return (
    <code dir="ltr" className={`language-${language}`} dangerouslySetInnerHTML={{ __html: data }} />
  );
}

export interface CodeProps extends InlineCodeProps {
  title?: string;
  copy?: boolean;
}

export function CodeBlockContainer({
  children,
  title,
  lineNumbers = false,
  language = defaultLanguage,
  copy,
  raw,
}: Override<CodeProps, { children: ReactNode; raw: string }>) {
  return (
    <pre dir="ltr" className={`language-${language} ${lineNumbers ? "line-numbers" : ""}`}>
      {(title || copy) && (
        <div className="code-block__title">
          {title}
          {copy && (
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
