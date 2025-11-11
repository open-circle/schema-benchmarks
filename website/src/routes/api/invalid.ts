import { errorData } from "@schema-benchmarks/data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/invalid")({
  server: {
    handlers: {
      GET: () => Response.json(errorData),
    },
  },
});
