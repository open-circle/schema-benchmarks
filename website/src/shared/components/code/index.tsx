import { useSuspenseQuery } from "@tanstack/react-query";

import type { PrefetchContext } from "#/shared/lib/fetch";
import { getHighlightedCode } from "#/shared/lib/highlight";

import { ToggleButton } from "../button/toggle";
import { toastWithHaptics } from "../snackbar/toast";
import { MdSymbol } from "../symbol";

export interface CodeProps {
  children: string;
  language?: string;

  lineNumbers?: boolean;
  title?: string;
  copy?: boolean;
}

const prefetchCode = (
  {
    code,
    lineNumbers,
    language,
  }: {
    code: string;
    lineNumbers?: boolean;
    language?: string;
  },
  { queryClient, signal }: PrefetchContext,
) => queryClient.prefetchQuery(getHighlightedCode({ code, lineNumbers, language }, signal));

export function InlineCode({
  children,
  language = "typescript",
}: Pick<CodeProps, "children" | "language">) {
  const { data } = useSuspenseQuery(getHighlightedCode({ code: children, language }));
  return (
    <code dir="ltr" className={`language-${language}`} dangerouslySetInnerHTML={{ __html: data }} />
  );
}

InlineCode.prefetch = prefetchCode;

export function CodeBlock({
  children,
  title,
  lineNumbers = false,
  language = "typescript",
  copy,
}: CodeProps) {
  const { data } = useSuspenseQuery(getHighlightedCode({ code: children, lineNumbers, language }));
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
                navigator.clipboard.writeText(children).then(
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
      <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: data }} />
    </pre>
  );
}

CodeBlock.prefetch = prefetchCode;
