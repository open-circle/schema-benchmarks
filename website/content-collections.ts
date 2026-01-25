import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import * as vUtils from "@schema-benchmarks/utils/valibot";
import * as v from "valibot";
import { rehypePlugins } from "./vite/mdx";

const blog = defineCollection({
  name: "blog",
  directory: "src/content/blog",
  include: "*.mdx",
  schema: v.object({
    title: v.string(),
    description: v.string(),
    published: vUtils.coerceDate,
    authors: v.array(v.string()),
    content: v.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, { rehypePlugins });
    return {
      ...document,
      mdx,
      slug: document._meta.path,
    };
  },
});

export default defineConfig({
  collections: [blog],
});
