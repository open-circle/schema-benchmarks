import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { generateMetadata } from "@/data/meta";
import { BlogCard } from "@/features/blog/components/card";
import { getBlog, getBlogs, preloadAvatars } from "@/features/blog/query";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
  async loader({ context: { queryClient }, abortController }) {
    const blogs = await queryClient.ensureQueryData(
      getBlogs(abortController.signal),
    );
    const authors = new Set<string>();
    for (const blog of blogs) {
      queryClient.setQueryData(getBlog(blog.slug).queryKey, blog);
      for (const author of blog.authors) authors.add(author);
    }
    await preloadAvatars(Array.from(authors));
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
      {data.map((blog) => (
        <BlogCard key={blog.slug} blog={blog} />
      ))}
    </ul>
  );
}
