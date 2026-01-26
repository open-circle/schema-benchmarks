import { defineCollection, defineConfig } from "@content-collections/core";
import * as vUtils from "@schema-benchmarks/utils/valibot";
import * as v from "valibot";

const blog = defineCollection({
  name: "blog",
  directory: "src/features/blog/content",
  include: "*.mdx",
  schema: v.object({
    cover: v.union([
      v.string(),
      v.object({
        src: v.string(),
        alt: v.string(),
        fit: v.optional(v.picklist(["cover", "contain"])),
      }),
    ]),
    title: v.string(),
    description: v.string(),
    published: vUtils.coerceDate,
    /** GitHub usernames */
    authors: v.array(v.string()),
    content: v.string(),
  }),
  transform: (document) => ({
    ...document,
    slug: document._meta.path,
  }),
});

export default defineConfig({
  collections: [blog],
});
