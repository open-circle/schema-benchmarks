import { MDXContent } from "@content-collections/mdx/react";
import { useMDXComponents } from "@mdx-js/react";
import { getTransitionName, longDateFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { generateMetadata } from "@/data/meta";
import { getBlog } from "@/features/blog/query";

export const Route = createFileRoute("/blog/$slug")({
  component: RouteComponent,
  async loader({
    context: { queryClient },
    params: { slug },
    abortController,
  }) {
    const data = await queryClient.ensureQueryData(
      getBlog(slug, abortController.signal),
    );
    return { crumb: data.title, ...data };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? generateMetadata({
          title: loaderData.title,
          description: loaderData.summary,
          openGraph: {
            url: `/blog/${params.slug}`,
          },
        })
      : {},
  staticData: { crumb: undefined },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(getBlog(slug));
  const components = useMDXComponents({ wrapper: "div" });
  const getTransitionStyle = (element: string) => ({
    style: {
      viewTransitionName: `${getTransitionName("blog-header", { slug })}-${element}`,
    },
  });
  return (
    <>
      <header className="blog-header">
        <p
          className="typo-overline"
          suppressHydrationWarning
          {...getTransitionStyle("date")}
        >
          {longDateFormatter.format(data.date)}
        </p>
        <h1 className="typo-headline4" {...getTransitionStyle("title")}>
          {data.title}
        </h1>
        <p className="typo-caption" {...getTransitionStyle("author")}>
          {data.author}
        </p>
      </header>
      <MDXContent code={data.mdx} components={components} />
    </>
  );
}
