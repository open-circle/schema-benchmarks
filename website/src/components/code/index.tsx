import { useSuspenseQuery } from "@tanstack/react-query";
import { getHighlightedCode } from "@/data/highlight";

export interface CodeProps {
  children: string;
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

export function CodeBlock({ children, language = "typescript" }: CodeProps) {
  const { data } = useSuspenseQuery(
    getHighlightedCode({ code: children, language }),
  );
  return (
    <pre dir="ltr" className={`language-${language}`}>
      <code
        className={`language-${language}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </pre>
  );
}
