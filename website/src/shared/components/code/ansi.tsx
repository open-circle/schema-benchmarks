import { useSuspenseQuery } from "@tanstack/react-query";

import type { PrefetchContext } from "#/shared/lib/fetch";
import { getHighlightedAnsi } from "#/shared/lib/highlight";

export interface AnsiProps {
  children: string;
  lineNumbers?: boolean;
}

export function AnsiBlock({ children, lineNumbers = false }: AnsiProps) {
  const { data } = useSuspenseQuery(getHighlightedAnsi({ input: children, lineNumbers }));
  return (
    <pre dir="ltr" className={`language-ansi ${lineNumbers ? "line-numbers" : ""}`}>
      <code className="language-ansi" dangerouslySetInnerHTML={{ __html: data }} />
    </pre>
  );
}

AnsiBlock.prefetch = (
  { input, lineNumbers }: { input: string; lineNumbers?: boolean },
  { queryClient, signal }: PrefetchContext,
) => queryClient.prefetchQuery(getHighlightedAnsi({ input, lineNumbers }, signal));
