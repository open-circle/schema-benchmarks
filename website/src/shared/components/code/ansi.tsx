import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { createFromReadableStream, renderToReadableStream } from "@tanstack/react-start/rsc";
import * as v from "valibot";

import { highlightAnsi } from "#/shared/lib/highlight";

const ansiBlockProps = v.object({ children: v.string(), lineNumbers: v.optional(v.boolean()) });

type AnsiBlockProps = v.InferOutput<typeof ansiBlockProps>;

export const AnsiBlock = createServerOnlyFn(async function AnsiBlock({
  children,
  lineNumbers = false,
}: AnsiBlockProps) {
  return (
    <pre dir="ltr" className={`language-ansi ${lineNumbers ? "line-numbers" : ""}`}>
      <code
        className="language-ansi"
        dangerouslySetInnerHTML={{ __html: highlightAnsi({ input: children, lineNumbers }) }}
      />
    </pre>
  );
});

export const getAnsiBlockFn = createServerFn({ method: "POST" })
  .inputValidator(ansiBlockProps)
  .handler(({ data: props }) => renderToReadableStream(<AnsiBlock {...props} />));

export const getAnsiBlock = (
  { children, lineNumbers = false }: AnsiBlockProps,
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["ansi-rsc", children, lineNumbers],
    queryFn: async ({ signal }) =>
      await createFromReadableStream(
        await getAnsiBlockFn({
          data: { children, lineNumbers },
          signal: anyAbortSignal(signal, signalOpt),
        }),
      ),
  });
