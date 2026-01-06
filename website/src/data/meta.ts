import type { PickNonNullable } from "@schema-benchmarks/utils";
import type { AnyRouteMatch } from "@tanstack/react-router";
import { castDraft, create } from "mutative";
import {
  createMetadataGenerator,
  type GeneratorInputMetadata,
} from "tanstack-meta";

const baseTitle = "Schema Benchmarks";

const _generateMetadata = createMetadataGenerator({
  titleTemplate: {
    default: baseTitle,
    template: `%s | ${baseTitle}`,
  },
  baseUrl: "https://schemabenchmarks.dev",
});

export const generateMetadata = ({
  title,
  description,
  image = { url: "/logo512.png", alt: baseTitle },
  links,
  ...meta
}: PickNonNullable<GeneratorInputMetadata, "description"> & {
  image?:
    | {
        url: string;
        alt?: string;
      }
    | string;
  /** Extra links to add, e.g. stylesheets */
  links?: NonNullable<AnyRouteMatch["links"]>;
}) => {
  let resolvedTitle = baseTitle;
  if (title) {
    resolvedTitle =
      typeof title === "string" ? `${title} | ${baseTitle}` : title.absolute;
  }
  if (resolvedTitle.length > 70) {
    console.error(`Title is too long: ${resolvedTitle}`);
  }
  if (description.length > 200) {
    console.error(`Description is too long: ${description}`);
  }
  return create(
    _generateMetadata({
      ...meta,
      title: { absolute: resolvedTitle },
      description,
      twitter: {
        site: "@eskimojo",
        creator: "@eskimojo",
        title: resolvedTitle,
        description,
        images: image,
        card: "summary",
        ...(meta.twitter ?? {}),
      },
      openGraph: {
        type: "website",
        title: resolvedTitle,
        description,
        images: image,
        ...(meta.openGraph ?? {}),
      },
    }),
    (head) => {
      head.meta.push({
        name: "twitter:url",
        content: head.meta.find((m) => m?.property === "og:url")?.content ?? "",
      });
      if (links) head.links.push(...castDraft(links));
    },
  );
};
