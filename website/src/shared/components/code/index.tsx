import { anyAbortSignal, Override } from "@schema-benchmarks/utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import { ReactNode } from "react";
import * as v from "valibot";

import { highlightCode } from "#/shared/lib/highlight";

import { ToggleButton } from "../button/toggle";
import { toastWithHaptics } from "../snackbar/toast";
import { MdSymbol } from "../symbol";

const codeProps = v.object({
  children: v.string(),
  language: v.optional(v.string()),
  lineNumbers: v.optional(v.boolean()),
});
type InlineCodeProps = v.InferOutput<typeof codeProps>;

export const InlineCode = createServerOnlyFn(async function InlineCode({
  children,
  language = "typescript",
  lineNumbers,
}: InlineCodeProps) {
  if (!Prism.languages[language]) loadLanguages(language);
  return (
    <code
      dir="ltr"
      className={`language-${language}`}
      dangerouslySetInnerHTML={{ __html: highlightCode({ code: children, language, lineNumbers }) }}
    />
  );
});

export const getCodeBlockFn = createServerFn({ method: "POST" })
  .inputValidator(codeProps)
  .handler(({ data }) => renderServerComponent(<InlineCode {...data} />));

export const getCodeBlock = (
  { children, language, lineNumbers }: InlineCodeProps,
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["code-rsc", language, children, lineNumbers],
    queryFn: ({ signal }) =>
      getCodeBlockFn({
        data: { children, language, lineNumbers },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });

export interface CodeProps extends InlineCodeProps {
  title?: string;
  copy?: boolean;
}

export function CodeBlockContainer({
  children,
  title,
  lineNumbers = false,
  language = "typescript",
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
  const { data } = useSuspenseQuery(getCodeBlock({ children, ...props }));
  return (
    <CodeBlockContainer {...props} raw={children}>
      {data}
    </CodeBlockContainer>
  );
}
