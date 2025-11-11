import type { ProcessedResult } from "@schema-benchmarks/bench";
import { CodeBlock } from "../code";

export interface ResultsTableProps {
	results: ProcessedResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
	return (
		<div className="card">
			<table className="results-table">
				<thead>
					<tr>
						<th data-numeric>Rank</th>
						<th>Library</th>
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
