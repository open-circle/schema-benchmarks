import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { allBlogs } from "content-collections";
import * as v from "valibot";
import { preloadImage } from "@/lib/fetch";

export const getBlogsFn = createServerFn().handler(() =>
  allBlogs
    .slice()
    .sort(
      (a, b) =>
        b.published.getTime() - a.published.getTime() ||
        a.slug.localeCompare(b.slug),
    ),
);

export const getBlogs = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["blog"],
    queryFn: ({ signal }) =>
      getBlogsFn({
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });

export const getBlogFn = createServerFn()
  .inputValidator(v.object({ slug: v.string() }))
  .handler(({ data: { slug } }) => {
    const blog = allBlogs.find((blog) => blog.slug === slug);
    if (!blog) throw notFound();
    return blog;
  });

export const getBlog = (slug: string, signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["blog", slug],
    queryFn: ({ signal }) =>
      getBlogFn({
        data: { slug },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });

export const getAvatarUrl = (author: string) =>
  `https://github.com/${author}.png`;

export const preloadAvatars = (authors: Array<string>) =>
  Promise.all(authors.map((author) => preloadImage(getAvatarUrl(author))));
