import { getTransitionName, longDateFormatter } from "@schema-benchmarks/utils";
import { Link } from "@tanstack/react-router";
import type { Blog } from "content-collections";
import { AvatarList } from "#/shared/components/avatar";
import { useDateFormatter } from "#/shared/hooks/format/use-date-formatter";
import { getAvatarUrl } from "../../-query";

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
  const formatDate = useDateFormatter(longDateFormatter);
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
          {/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: label is needed */}
          <time
            dateTime={blog.published.toISOString().split("T")[0]}
            suppressHydrationWarning
            {...getTransitionStyle("date")}
            aria-label={longDateFormatter.format(blog.published)}
          >
            {formatDate(blog.published)}
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
            <picture>
              {blog.cover.src_light && (
                <source
                  media="(prefers-color-scheme: light)"
                  srcSet={blog.cover.src_light}
                />
              )}
              <img
                src={blog.cover.src}
                alt={blog.cover.alt}
                style={{ objectFit: blog.cover.fit ?? "cover" }}
              />
            </picture>
          )}
        </div>
        <p>{blog.description}</p>
      </Link>
    </li>
  );
}
