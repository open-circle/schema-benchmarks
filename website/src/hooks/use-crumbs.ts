import { useMatches } from "@tanstack/react-router";
import { useMemo } from "react";

export function useCrumbs() {
	const matches = useMatches();
	return useMemo(() => {
		return matches
			.filter(
				(match): match is typeof match & { loaderData: { crumb: string } } =>
					!!match.loaderData?.crumb,
			)
			.map((match) => ({
				to: match.pathname,
				params: match.params,
				name: match.loaderData.crumb,
			}));
	}, [matches]);
}
