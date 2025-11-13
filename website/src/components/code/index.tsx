export interface CodeProps {
  children: string;
  language?: string;
}

export function InlineCode({ children, language = "typescript" }: CodeProps) {
  return (
    <code
      dir="ltr"
      className={`language-${language}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}

export function CodeBlock({ children, language = "typescript" }: CodeProps) {
  return (
    <pre dir="ltr" className={`language-${language}`}>
      <code
        className={`language-${language}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </pre>
  );
}
