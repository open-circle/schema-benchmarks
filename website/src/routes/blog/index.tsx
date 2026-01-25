import { createFileRoute } from "@tanstack/react-router";
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
  return <div>Hello "/blog/"!</div>;
}
