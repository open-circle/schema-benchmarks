import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
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
) =>
  queryClient.prefetchQuery(
    getHighlightedCode({ code, lineNumbers, language }, signal),
  );

type InlineCodeProps = Pick<CodeProps, "children" | "language">;

function InlineCodeInner({ children, language }: InlineCodeProps) {
  const { data } = useSuspenseQuery(
    getHighlightedCode({ code: children, language }),
  );
  return (
    <code
      dir="ltr"
      className={`language-${language}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}

export function InlineCode({
  children,
  language = "typescript",
  ...props
}: InlineCodeProps) {
  return (
    <ErrorBoundary
      fallback={
        <code dir="ltr" className={`language-${language}`}>
          {children}
        </code>
      }
    >
      <InlineCodeInner {...props} language={language}>
        {children}
      </InlineCodeInner>
    </ErrorBoundary>
  );
}

InlineCode.prefetch = prefetchCode;

function CodeBlockInner({
  children,
  title,
  language,
  lineNumbers = false,
}: CodeProps) {
  const { data } = useSuspenseQuery(
    getHighlightedCode({ code: children, lineNumbers, language }),
  );
  return (
    <pre
      dir="ltr"
      className={`language-${language} ${lineNumbers ? "line-numbers" : ""}`}
    >
      {title && <h6 className="code-block__title">{title}</h6>}
      <code
        className={`language-${language}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </pre>
  );
}

export function CodeBlock({
  language = "typescript",
  children,
  ...props
}: CodeProps) {
  return (
    <ErrorBoundary
      fallback={
        <pre dir="ltr" className={`language-${language}`}>
          <code className={`language-${language}`}>{children}</code>
        </pre>
      }
    >
      <CodeBlockInner {...props} language={language}>
        {children}
      </CodeBlockInner>
    </ErrorBoundary>
  );
}

CodeBlock.prefetch = prefetchCode;
