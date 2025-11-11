import { successData } from "@schema-benchmarks/data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/valid")({
  server: {
    handlers: {
      GET: () => Response.json(successData),
    },
  },
});
