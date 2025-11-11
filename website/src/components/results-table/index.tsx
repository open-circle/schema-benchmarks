import type { ProcessedResult } from "@schema-benchmarks/bench";

export interface ResultsTableProps {
	results: ProcessedResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
	return (
		<div className="card">
			<table className="results-table">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Library</th>
						<th>Code</th>
					</tr>
				</thead>
				<tbody>
					{results.map((result) => (
						<tr key={result.libraryName + (result.note ?? "")}>
							<td>{result.rank}</td>
							<td>
								<code>{result.libraryName}</code>
								{result.note ? (
									<>
										{" "}
										<span>({result.note})</span>
									</>
								) : null}
							</td>
							<td>
								<pre>
									<code>{result.snippet}</code>
								</pre>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
