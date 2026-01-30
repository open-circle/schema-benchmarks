import { useSuspenseQuery } from "@tanstack/react-query";
import { getHighlightedCode } from "#/shared/lib/highlight";

export interface CodeProps {
  children: string;
  language?: string;

  lineNumbers?: boolean;
  title?: string;
}

export function InlineCode({
  children,
  language = "typescript",
}: Pick<CodeProps, "children" | "language">) {
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

export function CodeBlock({
  children,
  title,
  lineNumbers = false,
  language = "typescript",
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
