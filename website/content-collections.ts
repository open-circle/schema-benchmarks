import { defineCollection, defineConfig } from "@content-collections/core";
import * as vUtils from "@schema-benchmarks/utils/valibot";
import * as v from "valibot";

const blog = defineCollection({
  name: "blog",
  directory: "src/routes/blog/-content",
  include: "*.mdx",
  schema: v.object({
    cover: v.union([
      v.string(),
      v.object({
        src: v.string(),
        src_light: v.optional(v.string()),
        src_dark: v.optional(v.string()),
        alt: v.string(),
        fit: v.optional(v.picklist(["cover", "contain"])),
      }),
    ]),
    title: v.string(),
    description: v.string(),
    published: vUtils.coerceDate,
    /** GitHub usernames */
    authors: v.union([
      v.array(v.string()),
      v.pipe(
        v.string(),
        v.transform((s) => [s]),
      ),
    ]),
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
