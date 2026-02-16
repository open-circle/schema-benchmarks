/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.mdx" {
  import type { MDXComponents } from "mdx/types";
  import type { FC } from "react";
  export interface MDXProps {
    components?: MDXComponents;
  }
  const Component: FC<MDXProps>;
  export default Component;
}
