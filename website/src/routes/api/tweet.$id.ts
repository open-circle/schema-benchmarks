import { createFileRoute } from "@tanstack/react-router";
import { getTweet } from "react-tweet/api";

export const Route = createFileRoute("/api/tweet/$id")({
  server: {
    handlers: {
      GET: async ({ params: { id } }) => {
        try {
          const tweet = await getTweet(id);
          return Response.json(
            { data: tweet ?? null },
            { status: tweet ? 200 : 404 },
          );
        } catch (error) {
          console.error("Failed to fetch tweet:", error);
          return Response.json(
            { error: Error.isError(error) ? error.message : "Bad request." },
            { status: 500 },
          );
        }
      },
    },
  },
  staticData: { crumb: undefined },
});
