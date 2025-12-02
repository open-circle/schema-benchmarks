declare module "*.mdx" {
  import type { FC } from "react";
  import type { MDXComponents } from "mdx/types";
  export interface MDXProps {
    components?: MDXComponents;
  }
  const Component: FC<MDXProps>;
  export default Component;
}
