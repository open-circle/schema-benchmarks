declare module "*.mdx" {
  import type { FC } from "react";
  import type { MDXComponents } from "mdx/types";
  export interface MDXProps {
    components?: MDXComponents;
  }
  const Component: FC<MDXProps>;
  export default Component;
}
declare module "virtual:vite-plugin-service-worker" {
  export const serviceWorkerFile: string;
}
