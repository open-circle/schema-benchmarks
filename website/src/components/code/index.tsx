import { ClientOnly } from "@tanstack/react-router";
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
    <ClientOnly
      fallback={
        <code dir="ltr" className={`language-${language}`}>
          {children}
        </code>
      }
    >
      <code
        dir="ltr"
        className={`language-${language}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </ClientOnly>
  );
}

export function CodeBlock({ children, language = "typescript" }: CodeProps) {
  const highlighted = useHighlight(children, language);
  return (
    <ClientOnly
      fallback={
        <pre dir="ltr" className={`language-${language}`}>
          {children}
        </pre>
      }
    >
      <pre dir="ltr" className={`language-${language}`}>
        <code
          className={`language-${language}`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </ClientOnly>
  );
}
