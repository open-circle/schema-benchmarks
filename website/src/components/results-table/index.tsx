import type { ProcessedResult } from "@schema-benchmarks/bench";
import { useMemo } from "react";
import { getBounds, getColor } from "@/data/scale";
import { CodeBlock } from "../code";

export interface ResultsTableProps {
	results: ProcessedResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
	const meanBounds = useMemo(
		() => getBounds(results, (result) => result.mean),
		[results],
	);
	return (
		<div className="card">
			<table>
				<thead>
					<tr>
						<th data-numeric>Rank</th>
						<th>Library</th>
						<th data-numeric>Mean (ms)</th>
						<th>Code</th>
					</tr>
				</thead>
				<tbody>
					{results.map((result) => (
						<tr key={result.libraryName + (result.note ?? "")}>
							<td data-numeric>{result.rank}</td>
							<td>
								<code className="language-text">{result.libraryName}</code>
								{result.note ? (
									<>
										{" "}
										<span>({result.note})</span>
									</>
								) : null}
							</td>
							<td
								data-numeric
								style={{
									color: `var(--${getColor(result.mean, meanBounds, true)})`,
								}}
							>
								{result.mean.toFixed(2)}
							</td>
							<td>
								{result.snippet && <CodeBlock>{result.snippet}</CodeBlock>}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
