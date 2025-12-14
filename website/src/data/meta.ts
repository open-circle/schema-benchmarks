import { createMetadataGenerator } from "tanstack-meta";

export const generateMetadata = createMetadataGenerator({
  titleTemplate: {
    default: "Schema Benchmarks",
    template: "%s | Schema Benchmarks",
  },
});
