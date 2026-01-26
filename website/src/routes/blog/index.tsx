import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BlogCard } from "@/features/blog/components/card";
import { getBlog, getBlogs, preloadAvatars } from "@/features/blog/query";
import { EmptyState } from "@/shared/components/empty-state";
import { MdSymbol } from "@/shared/components/symbol";
import { generateMetadata } from "@/shared/data/meta";

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
      description: "Blog posts for Schema Benchmarks.",
      openGraph: {
        url: "/blog/",
      },
    }),
  staticData: { crumb: undefined },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(getBlogs());
  if (!data.length)
    return (
      <EmptyState
        icon={<MdSymbol>article</MdSymbol>}
        title="No blog posts found"
        subtitle="Content coming soon!"
      />
    );
  return (
    <ul className="blog-list">
      {data.map((blog) => (
        <BlogCard key={blog.slug} blog={blog} />
      ))}
    </ul>
  );
}
