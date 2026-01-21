import { useSuspenseQuery } from "@tanstack/react-query";
import { getHighlightedCode } from "@/lib/highlight";

export interface CodeProps {
  children: string;
  lineNumbers?: boolean;
  language?: string;
}

export function InlineCode({ children, language = "typescript" }: CodeProps) {
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
  lineNumbers = false,
  language = "typescript",
}: CodeProps) {
  const { data } = useSuspenseQuery(
    getHighlightedCode({ code: children, lineNumbers, language }),
  );
  return (
    <pre dir="ltr" className={`language-${language} line-numbers`}>
      <code
        className={`language-${language}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </pre>
  );
}
