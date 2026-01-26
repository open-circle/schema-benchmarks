import { getTransitionName, longDateFormatter } from "@schema-benchmarks/utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { MDXModule } from "mdx/types";
import { getAvatarUrl, getBlog, preloadAvatars } from "@/features/blog/query";
import { AvatarList } from "@/shared/components/avatar";
import { generateMetadata } from "@/shared/data/meta";

const importMdx = (filePath: string) =>
  queryOptions({
    queryKey: ["mdx", filePath],
    queryFn: (): Promise<MDXModule> =>
      import(
        `../../features/blog/content/${filePath.replace(/\.mdx$/, "")}.mdx`
      ),
  });

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
    await Promise.all([
      preloadAvatars(data.authors),
      queryClient.prefetchQuery(importMdx(data._meta.filePath)),
    ]);
    return { crumb: data.title, ...data };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? generateMetadata({
          title: loaderData.title,
          description: loaderData.description,
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
  const {
    data: { default: MDXContent },
  } = useSuspenseQuery(importMdx(data._meta.filePath));
  const getTransitionStyle = (element: string) => ({
    style: {
      viewTransitionName: `${getTransitionName("blog-header", { slug })}-${element}`,
    },
  });
  return (
    <>
      <h1
        className="blog-title typo-headline4"
        {...getTransitionStyle("title")}
      >
        {data.title}
      </h1>
      <div className="blog-dateline typo-subtitle2">
        <AvatarList
          {...getTransitionStyle("author")}
          items={data.authors.map((author) => ({
            label: author,
            src: getAvatarUrl(author),
          }))}
          size="lg"
        />
        <p suppressHydrationWarning {...getTransitionStyle("date")}>
          {longDateFormatter.format(data.published)}
        </p>
      </div>
      <div role="img" className="blog-cover" {...getTransitionStyle("cover")}>
        {typeof data.cover === "string" ? (
          <p className="typo-headline2" {...getTransitionStyle("cover-text")}>
            {data.cover}
          </p>
        ) : (
          <img
            src={data.cover.src}
            alt={data.cover.alt}
            style={{ objectFit: data.cover.fit ?? "cover" }}
          />
        )}
      </div>
      <MDXContent components={{ wrapper: "div" }} />
    </>
  );
}
