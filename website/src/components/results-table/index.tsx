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
					</tr>
				</thead>
				<tbody>
					{results.map((result) => (
						<tr key={result.libraryName + (result.note ?? "")}>
							<td>{result.rank}</td>
							<td>
								<code>
									{result.libraryName}
									{result.note ? (
										<>
											{" "}
											<span>({result.note})</span>
										</>
									) : null}
								</code>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
