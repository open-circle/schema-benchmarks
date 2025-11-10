import "./benchmarks/initialization.bench";
import "./benchmarks/validation.bench";
import "./benchmarks/parsing.bench";
import { processResults } from "./utils/process";
import { registry } from "./utils/registry";

const allBenchmarks = Array.from(registry.benches.keys());
Promise.all(
	allBenchmarks.map(async (bench) => {
		console.log("running bench", registry.getBenchMeta(bench));
		const tasks = await bench.run();
		return [bench, tasks] as const;
	}),
).then((benches) => {
	console.log(processResults(benches));
});
