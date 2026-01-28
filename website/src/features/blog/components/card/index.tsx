import { getTransitionName, longDateFormatter } from "@schema-benchmarks/utils";
import { Link } from "@tanstack/react-router";
import type { Blog } from "content-collections";
import { getAvatarUrl } from "#/features/blog/query";
import { AvatarList } from "#/shared/components/avatar";

export interface BlogCardProps {
  blog: Pick<
    Blog,
    // being more specific about what we need means we don't have to specify unused properties in tests/stories
    "slug" | "title" | "description" | "published" | "authors" | "cover"
  >;
}

export function BlogCard({ blog }: BlogCardProps) {
  const getTransitionStyle = (element: string) => ({
    style: {
      viewTransitionName: `${getTransitionName("blog-header", {
        slug: blog.slug,
      })}-${element}`,
    },
  });
  return (
    <li className="blog-card">
      <Link to="/blog/$slug" params={{ slug: blog.slug }}>
        <div className="blog-dateline typo-overline">
          <AvatarList
            {...getTransitionStyle("author")}
            items={blog.authors.map((author) => ({
              label: author,
              src: getAvatarUrl(author),
            }))}
            size="sm"
          />
          <time
            dateTime={blog.published.toISOString().split("T")[0]}
            suppressHydrationWarning
            {...getTransitionStyle("date")}
          >
            {longDateFormatter.format(blog.published)}
          </time>
        </div>
        <h2 className="typo-headline5" {...getTransitionStyle("title")}>
          {blog.title}
        </h2>
        <div role="img" className="blog-cover" {...getTransitionStyle("cover")}>
          {typeof blog.cover === "string" ? (
            <p className="typo-headline2" {...getTransitionStyle("cover-text")}>
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
}
