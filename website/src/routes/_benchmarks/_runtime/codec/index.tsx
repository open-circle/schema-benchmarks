import { shallowFilter } from "@schema-benchmarks/utils";
import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { CodeBlock } from "#/shared/components/code";
import { generateMetadata } from "#/shared/data/meta";
import { sortParams } from "#/shared/lib/sort";

import { optionalOptimizeTypeSchema } from "../-constants";
import { getBenchResults } from "../-query";
import { DownloadCount } from "../../-components/count";
import { sortableKeys } from "./-constants";
import Content from "./content.mdx";

import admonitionCss from "../../../blog/-components/admonition/index.css?url";

const searchSchema = v.object({
  optimizeType: optionalOptimizeTypeSchema,
  ...sortParams(v.optional(v.picklist(sortableKeys), "encode")),
});

export const Route = createFileRoute("/_benchmarks/_runtime/codec/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { optimizeType } }) => ({ optimizeType }),
  async loader({ context: { queryClient }, deps: { optimizeType }, abortController }) {
    const benchResults = await queryClient.ensureQueryData(getBenchResults(abortController.signal));
    await Promise.all(
      Object.values(benchResults.codec.filter(shallowFilter({ optimizeType }))).flatMap(
        ({ encode, decode, libraryName }) => [
          DownloadCount.prefetch(libraryName, {
            queryClient,
            signal: abortController.signal,
          }),
          CodeBlock.prefetch(
            { code: encode.snippet },
            { queryClient, signal: abortController.signal },
          ),
          CodeBlock.prefetch(
            { code: decode.snippet },
            { queryClient, signal: abortController.signal },
          ),
        ],
      ),
    );
  },
  head: () =>
    generateMetadata({
      title: "Codec",
      description: "Benchmark results for encoding and decoding data.",
      openGraph: {
        url: "/codec/",
      },
      links: [
        {
          rel: "stylesheet",
          href: admonitionCss,
        },
      ],
    }),
  staticData: { crumb: "Codec" },
});

function RouteComponent() {
  return <Content components={{ wrapper: "div" }} />;
}
