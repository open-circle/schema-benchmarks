import rehypeCodeProps from "rehype-mdx-code-props";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";

export const rehypePlugins = [rehypePrism, rehypeSlug, rehypeCodeProps];
