/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.mdx" {
  import type { MDXContent } from "mdx/types";
  const Content: MDXContent;
  export default Content;
}

declare module "*.md" {
  import type { MDXContent } from "mdx/types";
  const Content: MDXContent;
  export default Content;
}
