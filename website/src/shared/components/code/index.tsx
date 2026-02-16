import { useSuspenseQuery } from "@tanstack/react-query";
import type { PrefetchContext } from "#/shared/lib/fetch";
import { getHighlightedCode } from "#/shared/lib/highlight";

export interface CodeProps {
  children: string;
  language?: string;

  lineNumbers?: boolean;
  title?: string;
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
}: CodeProps) {
  const { data } = useSuspenseQuery(getHighlightedCode({ code: children, lineNumbers, language }));
  return (
    <pre dir="ltr" className={`language-${language} ${lineNumbers ? "line-numbers" : ""}`}>
      {title && <h6 className="code-block__title">{title}</h6>}
      <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: data }} />
    </pre>
  );
}

CodeBlock.prefetch = prefetchCode;
