import { getTransitionName, longDateFormatter } from "@schema-benchmarks/utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { MDXModule } from "mdx/types";
import { AvatarList } from "#/shared/components/avatar";
import { generateMetadata } from "#/shared/data/meta";
import { preloadImages } from "#/shared/lib/fetch";
import { getAvatarUrl, getBlog } from "./-query";

const importMdx = (filePath: string) =>
  queryOptions({
    queryKey: ["mdx", filePath],
    queryFn: (): Promise<MDXModule> =>
      import(`./-content/${filePath.replace(/\.mdx$/, "")}.mdx`),
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
    const images = data.authors.map(getAvatarUrl);
    if (typeof data.cover !== "string") images.push(data.cover.src);
    await Promise.all([
      preloadImages(images),
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
        <time
          dateTime={data.published.toISOString().split("T")[0]}
          suppressHydrationWarning
          {...getTransitionStyle("date")}
        >
          {longDateFormatter.format(data.published)}
        </time>
      </div>
      <div role="img" className="blog-cover" {...getTransitionStyle("cover")}>
        {typeof data.cover === "string" ? (
          <p className="typo-headline2" {...getTransitionStyle("cover-text")}>
            {data.cover}
          </p>
        ) : (
          <picture>
            {data.cover.src_light && (
              <source
                media="(prefers-color-scheme: light)"
                srcSet={data.cover.src_light}
              />
            )}
            {data.cover.src_dark && (
              <source
                media="(prefers-color-scheme: dark)"
                srcSet={data.cover.src_dark}
              />
            )}
            <img
              src={data.cover.src}
              alt={data.cover.alt}
              style={{ objectFit: data.cover.fit ?? "cover" }}
            />
          </picture>
        )}
      </div>
      <MDXContent components={{ wrapper: "div" }} />
    </>
  );
}
