import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";

import { getHighlightedAnsi } from "#/shared/lib/highlight";

const ansiBlockProps = v.object({ children: v.string(), lineNumbers: v.optional(v.boolean()) });

type AnsiBlockProps = v.InferOutput<typeof ansiBlockProps>;

export function AnsiBlock({ children, lineNumbers = false }: AnsiBlockProps) {
  const { data } = useSuspenseQuery(getHighlightedAnsi({ input: children, lineNumbers }));
  return (
    <pre dir="ltr" className={`language-ansi ${lineNumbers ? "line-numbers" : ""}`}>
      <code className="language-ansi" dangerouslySetInnerHTML={{ __html: data }} />
    </pre>
  );
}
