import prism from "prismjs";
import { useMemo } from "react";

export interface CodeProps {
  children: string;
  language?: string;
}

function useHighlight(code: string, language: string) {
  const grammar = prism.languages[language];
  if (!grammar) throw new Error(`Language not found: ${language}`);
  return useMemo(
    () => prism.highlight(code, grammar, language),
    [code, grammar, language],
  );
}

export function InlineCode({ children, language = "typescript" }: CodeProps) {
  const highlighted = useHighlight(children, language);
  return (
    <code
      dir="ltr"
      className={`language-${language}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
      dangerouslySetInnerHTML={{ __html: highlighted }}
      suppressHydrationWarning
    />
  );
}

export function CodeBlock({ children, language = "typescript" }: CodeProps) {
  const highlighted = useHighlight(children, language);
  return (
    <pre dir="ltr" className={`language-${language}`} suppressHydrationWarning>
      <code
        className={`language-${language}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
        dangerouslySetInnerHTML={{ __html: highlighted }}
        suppressHydrationWarning
      />
    </pre>
  );
}
