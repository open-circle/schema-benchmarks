import "./benchmarks/initialization.bench";
import "./benchmarks/validation.bench";
import "./benchmarks/parsing.bench";
import { registry } from "./utils/registry";

const allBenchmarks = Array.from(registry.benches.keys());
Promise.all(
	allBenchmarks.map(async (bench) => {
		console.log("running bench", registry.getBenchMeta(bench));
		const tasks = await bench.run();
		return [bench, tasks] as const;
	}),
).then((benches) => {
	console.log(
		benches.map(([bench, tasks]) => ({
			benchMeta: registry.getBenchMeta(bench),
			results: tasks.map((task) => ({
				meta: registry.getCaseMeta(task.name),
				result: task.result,
			})),
		})),
	);
});
