import { getTransitionName, longDateFormatter } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { generateMetadata } from "@/data/meta";
import { getBlog, getBlogs } from "@/features/blog/query";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
  async loader({ context: { queryClient }, abortController }) {
    const blogs = await queryClient.ensureQueryData(
      getBlogs(abortController.signal),
    );
    for (const blog of blogs) {
      queryClient.setQueryData(getBlog(blog.slug).queryKey, blog);
    }
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
          <li key={blog.slug}>
            <header className="blog-header">
              <p
                className="typo-overline"
                suppressHydrationWarning
                {...getTransitionStyle("date")}
              >
                {longDateFormatter.format(blog.date)}
              </p>
              <Link to="/blog/$slug" params={{ slug: blog.slug }}>
                <h2 className="typo-headline5" {...getTransitionStyle("title")}>
                  {blog.title}
                </h2>
              </Link>
              <p className="typo-caption" {...getTransitionStyle("author")}>
                {blog.author}
              </p>
            </header>
            <p>{blog.summary}</p>
          </li>
        );
      })}
    </ul>
  );
}
