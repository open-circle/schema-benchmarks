import { getTransitionName, longDateFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AvatarList } from "@/components/avatar";
import { generateMetadata } from "@/data/meta";
import { getBlog, getBlogs } from "@/features/blog/query";
import { preloadImage } from "@/lib/fetch";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
  async loader({ context: { queryClient }, abortController }) {
    const blogs = await queryClient.ensureQueryData(
      getBlogs(abortController.signal),
    );
    const authors = new Set<string>();
    for (const blog of blogs) {
      queryClient.setQueryData(getBlog(blog.slug).queryKey, blog);
      for (const author of blog.authors) {
        authors.add(author);
      }
    }
    await Promise.all(
      Array.from(authors).map((author) =>
        preloadImage(`https://github.com/${author}.png`),
      ),
    );
  },
  head: () =>
    generateMetadata({
      title: "Blog",
      description: "Blog for Schema Benchmarks.",
      openGraph: {
        url: "/blog/",
      },
    }),
  staticData: { crumb: undefined },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(getBlogs());
  return (
    <ul className="blog-list">
      {data.map((blog) => {
        const getTransitionStyle = (element: string) => ({
          style: {
            viewTransitionName: `${getTransitionName("blog-header", {
              slug: blog.slug,
            })}-${element}`,
          },
        });
        return (
          <li key={blog.slug} className="blog-card">
            <Link to="/blog/$slug" params={{ slug: blog.slug }}>
              <div className="blog-dateline typo-overline">
                <AvatarList
                  {...getTransitionStyle("author")}
                  items={blog.authors.map((author) => ({
                    label: author,
                    src: `https://github.com/${author}.png`,
                  }))}
                  size="sm"
                />
                <p suppressHydrationWarning {...getTransitionStyle("date")}>
                  {longDateFormatter.format(blog.published)}
                </p>
              </div>
              <h2 className="typo-headline5" {...getTransitionStyle("title")}>
                {blog.title}
              </h2>
              <div
                role="img"
                className="blog-cover"
                {...getTransitionStyle("cover")}
              >
                {typeof blog.cover === "string" ? (
                  <p
                    className="typo-headline2"
                    {...getTransitionStyle("cover-text")}
                  >
                    {blog.cover}
                  </p>
                ) : (
                  <img
                    src={blog.cover.src}
                    alt={blog.cover.alt}
                    style={{ objectFit: blog.cover.fit ?? "cover" }}
                  />
                )}
              </div>
              <p>{blog.description}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
