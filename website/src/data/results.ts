import results from "@schema-benchmarks/bench/results.json";
import { createServerFn } from "@tanstack/react-start";

export const getResults = createServerFn().handler(async () => {
	if (process.env.NODE_ENV === "production") {
		const response = await fetch(
			"https://raw.githubusercontent.com/open-circle/schema-benchmarks/refs/heads/main/bench/results.json",
		);
		return (await response.json()) as typeof results;
	}

	return results;
});
