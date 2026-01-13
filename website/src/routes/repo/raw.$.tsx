import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code";
import { getRaw } from "@/features/repo/query";
import { HTTPError } from "@/lib/fetch";
import { getHighlightedCode } from "@/lib/highlight";

export const Route = createFileRoute("/repo/raw/$")({
  component: RouteComponent,
  staticData: { crumb: "Raw" },
  async loader({
    context: { queryClient },
    params: { _splat: fileName },
    abortController,
  }) {
    if (!fileName) throw notFound();
    try {
      const code = await queryClient.ensureQueryData(
        getRaw({ fileName }, abortController.signal),
      );
      await queryClient.prefetchQuery(
        getHighlightedCode({ code }, abortController.signal),
      );
    } catch (e) {
      if (e instanceof HTTPError && e.response.status === 404) throw notFound();
      throw e;
    }
  },
});

function RouteComponent() {
  const { _splat: fileName = "" } = Route.useParams();
  const { data } = useSuspenseQuery(getRaw({ fileName }));
  return (
    <>
      <h6 style={{ margin: 0 }}>
        <code className="language-text">{fileName}</code>
      </h6>
      <CodeBlock>{data}</CodeBlock>
    </>
  );
}
