//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region ../node_modules/.pnpm/@ata-project+keywords@0.1.3_ata-validator@0.5.0/node_modules/@ata-project/keywords/index.js
var require_keywords = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const CONSTRUCTORS = {
		Object,
		Array,
		Function,
		Number,
		String,
		Date,
		RegExp,
		Promise,
		Map,
		Set,
		WeakMap,
		WeakSet,
		Buffer: typeof Buffer !== "undefined" ? Buffer : void 0,
		Uint8Array,
		ArrayBuffer
	};
	function collectErrors(data, schema, path, errors) {
		if (!schema || typeof schema !== "object") return;
		const props = schema.properties;
		if (!props) return;
		for (const [key, prop] of Object.entries(props)) {
			if (!prop || typeof prop !== "object") continue;
			const val = data[key];
			const currentPath = path ? path + "/" + key : "/" + key;
			if (prop.instanceof && val !== void 0) {
				const types = Array.isArray(prop.instanceof) ? prop.instanceof : [prop.instanceof];
				let match = false;
				for (const t of types) {
					const ctor = CONSTRUCTORS[t];
					if (ctor && val instanceof ctor) {
						match = true;
						break;
					}
				}
				if (!match) errors.push({
					code: "instanceof_mismatch",
					path: currentPath,
					message: "expected instanceof " + types.join(" | ")
				});
			}
			if (prop.typeof && val !== void 0) {
				const types = Array.isArray(prop.typeof) ? prop.typeof : [prop.typeof];
				let match = false;
				for (const t of types) if (typeof val === t) {
					match = true;
					break;
				}
				if (!match) errors.push({
					code: "typeof_mismatch",
					path: currentPath,
					message: "expected typeof " + types.join(" | ")
				});
			}
			if (prop.properties && val && typeof val === "object" && !Array.isArray(val)) collectErrors(val, prop, currentPath, errors);
		}
	}
	function withKeywords(validator) {
		const schema = validator._schemaObj;
		validator.validate({});
		const compiledValidate = validator.validate;
		validator.validate = function(data) {
			if (typeof data === "object" && data !== null && !Array.isArray(data)) {
				const errors = [];
				collectErrors(data, schema, "", errors);
				if (errors.length > 0) return {
					valid: false,
					errors
				};
			}
			return compiledValidate(data);
		};
		return validator;
	}
	withKeywords.CONSTRUCTORS = CONSTRUCTORS;
	module.exports = {
		withKeywords,
		CONSTRUCTORS
	};
}));
//#endregion
//#region ../node_modules/.pnpm/node-gyp-build@4.8.4/node_modules/node-gyp-build/node-gyp-build.js
var require_node_gyp_build$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs = __require("fs");
	var path = __require("path");
	var os = __require("os");
	var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
	var vars = process.config && process.config.variables || {};
	var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
	var abi = process.versions.modules;
	var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
	var arch = process.env.npm_config_arch || os.arch();
	var platform = process.env.npm_config_platform || os.platform();
	var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
	var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
	var uv = (process.versions.uv || "").split(".")[0];
	module.exports = load;
	function load(dir) {
		return runtimeRequire(load.resolve(dir));
	}
	load.resolve = load.path = function(dir) {
		dir = path.resolve(dir || ".");
		try {
			var name = runtimeRequire(path.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
			if (process.env[name + "_PREBUILD"]) dir = process.env[name + "_PREBUILD"];
		} catch (err) {}
		if (!prebuildsOnly) {
			var release = getFirst(path.join(dir, "build/Release"), matchBuild);
			if (release) return release;
			var debug = getFirst(path.join(dir, "build/Debug"), matchBuild);
			if (debug) return debug;
		}
		var prebuild = resolve(dir);
		if (prebuild) return prebuild;
		var nearby = resolve(path.dirname(process.execPath));
		if (nearby) return nearby;
		var target = [
			"platform=" + platform,
			"arch=" + arch,
			"runtime=" + runtime,
			"abi=" + abi,
			"uv=" + uv,
			armv ? "armv=" + armv : "",
			"libc=" + libc,
			"node=" + process.versions.node,
			process.versions.electron ? "electron=" + process.versions.electron : "",
			typeof __webpack_require__ === "function" ? "webpack=true" : ""
		].filter(Boolean).join(" ");
		throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
		function resolve(dir) {
			var tuple = readdirSync(path.join(dir, "prebuilds")).map(parseTuple).filter(matchTuple(platform, arch)).sort(compareTuples)[0];
			if (!tuple) return;
			var prebuilds = path.join(dir, "prebuilds", tuple.name);
			var winner = readdirSync(prebuilds).map(parseTags).filter(matchTags(runtime, abi)).sort(compareTags(runtime))[0];
			if (winner) return path.join(prebuilds, winner.file);
		}
	};
	function readdirSync(dir) {
		try {
			return fs.readdirSync(dir);
		} catch (err) {
			return [];
		}
	}
	function getFirst(dir, filter) {
		var files = readdirSync(dir).filter(filter);
		return files[0] && path.join(dir, files[0]);
	}
	function matchBuild(name) {
		return /\.node$/.test(name);
	}
	function parseTuple(name) {
		var arr = name.split("-");
		if (arr.length !== 2) return;
		var platform = arr[0];
		var architectures = arr[1].split("+");
		if (!platform) return;
		if (!architectures.length) return;
		if (!architectures.every(Boolean)) return;
		return {
			name,
			platform,
			architectures
		};
	}
	function matchTuple(platform, arch) {
		return function(tuple) {
			if (tuple == null) return false;
			if (tuple.platform !== platform) return false;
			return tuple.architectures.includes(arch);
		};
	}
	function compareTuples(a, b) {
		return a.architectures.length - b.architectures.length;
	}
	function parseTags(file) {
		var arr = file.split(".");
		var extension = arr.pop();
		var tags = {
			file,
			specificity: 0
		};
		if (extension !== "node") return;
		for (var i = 0; i < arr.length; i++) {
			var tag = arr[i];
			if (tag === "node" || tag === "electron" || tag === "node-webkit") tags.runtime = tag;
			else if (tag === "napi") tags.napi = true;
			else if (tag.slice(0, 3) === "abi") tags.abi = tag.slice(3);
			else if (tag.slice(0, 2) === "uv") tags.uv = tag.slice(2);
			else if (tag.slice(0, 4) === "armv") tags.armv = tag.slice(4);
			else if (tag === "glibc" || tag === "musl") tags.libc = tag;
			else continue;
			tags.specificity++;
		}
		return tags;
	}
	function matchTags(runtime, abi) {
		return function(tags) {
			if (tags == null) return false;
			if (tags.runtime && tags.runtime !== runtime && !runtimeAgnostic(tags)) return false;
			if (tags.abi && tags.abi !== abi && !tags.napi) return false;
			if (tags.uv && tags.uv !== uv) return false;
			if (tags.armv && tags.armv !== armv) return false;
			if (tags.libc && tags.libc !== libc) return false;
			return true;
		};
	}
	function runtimeAgnostic(tags) {
		return tags.runtime === "node" && tags.napi;
	}
	function compareTags(runtime) {
		return function(a, b) {
			if (a.runtime !== b.runtime) return a.runtime === runtime ? -1 : 1;
			else if (a.abi !== b.abi) return a.abi ? -1 : 1;
			else if (a.specificity !== b.specificity) return a.specificity > b.specificity ? -1 : 1;
			else return 0;
		};
	}
	function isNwjs() {
		return !!(process.versions && process.versions.nw);
	}
	function isElectron() {
		if (process.versions && process.versions.electron) return true;
		if (process.env.ELECTRON_RUN_AS_NODE) return true;
		return typeof window !== "undefined" && window.process && window.process.type === "renderer";
	}
	function isAlpine(platform) {
		return platform === "linux" && fs.existsSync("/etc/alpine-release");
	}
	load.parseTags = parseTags;
	load.matchTags = matchTags;
	load.compareTags = compareTags;
	load.parseTuple = parseTuple;
	load.matchTuple = matchTuple;
	load.compareTuples = compareTuples;
}));
//#endregion
//#region ../node_modules/.pnpm/node-gyp-build@4.8.4/node_modules/node-gyp-build/index.js
var require_node_gyp_build = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
	if (typeof runtimeRequire.addon === "function") module.exports = runtimeRequire.addon.bind(runtimeRequire);
	else module.exports = require_node_gyp_build$1();
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@0.5.0/node_modules/ata-validator/lib/js-compiler.js
var require_js_compiler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function compileToJS(schema, defs, schemaMap) {
		if (typeof schema === "boolean") return schema ? () => true : () => false;
		if (typeof schema !== "object" || schema === null) return null;
		if (!defs && !codegenSafe(schema, schemaMap)) return null;
		const rootDefs = defs || collectDefs(schema);
		if (schema.patternProperties || schema.dependentSchemas || schema.propertyNames) return null;
		const checks = [];
		if (schema.$ref) {
			const refFn = resolveRef(schema.$ref, rootDefs, schemaMap);
			if (!refFn) return null;
			checks.push(refFn);
		}
		if (schema.type) {
			const types = Array.isArray(schema.type) ? schema.type : [schema.type];
			checks.push(buildTypeCheck(types));
		}
		if (schema.enum) {
			const vals = schema.enum;
			const primitives = vals.filter((v) => v === null || typeof v !== "object");
			const objects = vals.filter((v) => v !== null && typeof v === "object");
			const primSet = new Set(primitives.map((v) => v === null ? "null" : typeof v === "string" ? "s:" + v : "n:" + v));
			const objStrs = objects.map((v) => JSON.stringify(v));
			checks.push((d) => {
				const key = d === null ? "null" : typeof d === "string" ? "s:" + d : typeof d === "number" || typeof d === "boolean" ? "n:" + d : null;
				if (key !== null && primSet.has(key)) return true;
				const ds = JSON.stringify(d);
				for (let i = 0; i < objStrs.length; i++) if (ds === objStrs[i]) return true;
				for (let i = 0; i < primitives.length; i++) if (d === primitives[i]) return true;
				return false;
			});
		}
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") checks.push((d) => d === cv);
			else {
				const cs = JSON.stringify(cv);
				checks.push((d) => JSON.stringify(d) === cs);
			}
		}
		if (schema.required && Array.isArray(schema.required)) for (const key of schema.required) checks.push((d) => typeof d === "object" && d !== null && key in d);
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const propCheck = compileToJS(prop, rootDefs);
			if (!propCheck) return null;
			checks.push((d) => {
				if (typeof d !== "object" || d === null || !(key in d)) return true;
				return propCheck(d[key]);
			});
		}
		if (schema.additionalProperties !== void 0 && schema.properties) {
			if (schema.additionalProperties === false) {
				const allowed = new Set(Object.keys(schema.properties));
				checks.push((d) => {
					if (typeof d !== "object" || d === null || Array.isArray(d)) return true;
					const keys = Object.keys(d);
					for (let i = 0; i < keys.length; i++) if (!allowed.has(keys[i])) return false;
					return true;
				});
			} else if (typeof schema.additionalProperties === "object") {
				const apCheck = compileToJS(schema.additionalProperties, rootDefs);
				if (!apCheck) return null;
				const known = new Set(Object.keys(schema.properties || {}));
				checks.push((d) => {
					if (typeof d !== "object" || d === null || Array.isArray(d)) return true;
					const keys = Object.keys(d);
					for (let i = 0; i < keys.length; i++) if (!known.has(keys[i]) && !apCheck(d[keys[i]])) return false;
					return true;
				});
			}
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) checks.push((d) => {
			if (typeof d !== "object" || d === null || !(key in d)) return true;
			for (let i = 0; i < deps.length; i++) if (!(deps[i] in d)) return false;
			return true;
		});
		if (schema.items) {
			const itemCheck = compileToJS(schema.items, rootDefs);
			if (!itemCheck) return null;
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				for (let i = 0; i < d.length; i++) if (!itemCheck(d[i])) return false;
				return true;
			});
		}
		if (schema.prefixItems) {
			const prefixChecks = [];
			for (const ps of schema.prefixItems) {
				const pc = compileToJS(ps, rootDefs);
				if (!pc) return null;
				prefixChecks.push(pc);
			}
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				for (let i = 0; i < prefixChecks.length && i < d.length; i++) if (!prefixChecks[i](d[i])) return false;
				return true;
			});
		}
		if (schema.contains) {
			const containsCheck = compileToJS(schema.contains, rootDefs);
			if (!containsCheck) return null;
			const minC = schema.minContains !== void 0 ? schema.minContains : 1;
			const maxC = schema.maxContains !== void 0 ? schema.maxContains : Infinity;
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				let count = 0;
				for (let i = 0; i < d.length; i++) if (containsCheck(d[i])) count++;
				return count >= minC && count <= maxC;
			});
		}
		if (schema.uniqueItems) {
			const canonical = (x) => {
				if (x === null || typeof x !== "object") return typeof x + ":" + x;
				if (Array.isArray(x)) return "[" + x.map(canonical).join(",") + "]";
				return "{" + Object.keys(x).sort().map((k) => JSON.stringify(k) + ":" + canonical(x[k])).join(",") + "}";
			};
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				const seen = /* @__PURE__ */ new Set();
				for (let i = 0; i < d.length; i++) {
					const key = canonical(d[i]);
					if (seen.has(key)) return false;
					seen.add(key);
				}
				return true;
			});
		}
		if (schema.minimum !== void 0) {
			const min = schema.minimum;
			checks.push((d) => typeof d !== "number" || d >= min);
		}
		if (schema.maximum !== void 0) {
			const max = schema.maximum;
			checks.push((d) => typeof d !== "number" || d <= max);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const min = schema.exclusiveMinimum;
			checks.push((d) => typeof d !== "number" || d > min);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const max = schema.exclusiveMaximum;
			checks.push((d) => typeof d !== "number" || d < max);
		}
		if (schema.multipleOf !== void 0) {
			const div = schema.multipleOf;
			checks.push((d) => typeof d !== "number" || d % div === 0);
		}
		if (schema.minLength !== void 0) {
			const min = schema.minLength;
			checks.push((d) => typeof d !== "string" || d.length >= min);
		}
		if (schema.maxLength !== void 0) {
			const max = schema.maxLength;
			checks.push((d) => typeof d !== "string" || d.length <= max);
		}
		if (schema.pattern) try {
			const re = new RegExp(schema.pattern);
			checks.push((d) => typeof d !== "string" || re.test(d));
		} catch {
			return null;
		}
		if (schema.format) {
			const fc = FORMAT_CHECKS[schema.format];
			if (fc) checks.push((d) => typeof d !== "string" || fc(d));
		}
		if (schema.minItems !== void 0) {
			const min = schema.minItems;
			checks.push((d) => !Array.isArray(d) || d.length >= min);
		}
		if (schema.maxItems !== void 0) {
			const max = schema.maxItems;
			checks.push((d) => !Array.isArray(d) || d.length <= max);
		}
		if (schema.minProperties !== void 0) {
			const min = schema.minProperties;
			checks.push((d) => typeof d !== "object" || d === null || Object.keys(d).length >= min);
		}
		if (schema.maxProperties !== void 0) {
			const max = schema.maxProperties;
			checks.push((d) => typeof d !== "object" || d === null || Object.keys(d).length <= max);
		}
		if (schema.allOf) {
			const subs = [];
			for (const s of schema.allOf) {
				const fn = compileToJS(s, rootDefs);
				if (!fn) return null;
				subs.push(fn);
			}
			checks.push((d) => {
				for (let i = 0; i < subs.length; i++) if (!subs[i](d)) return false;
				return true;
			});
		}
		if (schema.anyOf) {
			const subs = [];
			for (const s of schema.anyOf) {
				const fn = compileToJS(s, rootDefs);
				if (!fn) return null;
				subs.push(fn);
			}
			checks.push((d) => {
				for (let i = 0; i < subs.length; i++) if (subs[i](d)) return true;
				return false;
			});
		}
		if (schema.oneOf) {
			const subs = [];
			for (const s of schema.oneOf) {
				const fn = compileToJS(s, rootDefs);
				if (!fn) return null;
				subs.push(fn);
			}
			checks.push((d) => {
				let count = 0;
				for (let i = 0; i < subs.length; i++) {
					if (subs[i](d)) count++;
					if (count > 1) return false;
				}
				return count === 1;
			});
		}
		if (schema.not) {
			const notFn = compileToJS(schema.not, rootDefs);
			if (!notFn) return null;
			checks.push((d) => !notFn(d));
		}
		if (schema.if) {
			const ifFn = compileToJS(schema.if, rootDefs);
			if (!ifFn) return null;
			const thenFn = schema.then ? compileToJS(schema.then, rootDefs) : null;
			const elseFn = schema.else ? compileToJS(schema.else, rootDefs) : null;
			if (schema.then && !thenFn) return null;
			if (schema.else && !elseFn) return null;
			checks.push((d) => {
				if (ifFn(d)) return thenFn ? thenFn(d) : true;
				else return elseFn ? elseFn(d) : true;
			});
		}
		if (checks.length === 0) return () => true;
		if (checks.length === 1) return checks[0];
		return (data) => {
			for (let i = 0; i < checks.length; i++) if (!checks[i](data)) return false;
			return true;
		};
	}
	function collectDefs(schema) {
		const defs = {};
		const raw = schema.$defs || schema.definitions;
		if (raw && typeof raw === "object") for (const [name, def] of Object.entries(raw)) {
			let cached = void 0;
			defs[name] = {
				get fn() {
					if (cached === void 0) {
						cached = null;
						cached = compileToJS(def, defs);
					}
					return cached || (() => true);
				},
				raw: def
			};
		}
		return defs;
	}
	function resolveRef(ref, defs, schemaMap) {
		if (defs) {
			const m = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m) {
				const entry = defs[m[1]];
				if (entry) return (d) => {
					const fn = entry.fn;
					return fn ? fn(d) : true;
				};
			}
		}
		if (schemaMap && schemaMap.has(ref)) return compileToJS(schemaMap.get(ref), null, schemaMap) || (() => true);
		return null;
	}
	function buildTypeCheck(types) {
		if (types.length === 1) return TYPE_CHECKS[types[0]] || (() => true);
		const fns = types.map((t) => TYPE_CHECKS[t]).filter(Boolean);
		return (d) => {
			for (let i = 0; i < fns.length; i++) if (fns[i](d)) return true;
			return false;
		};
	}
	const TYPE_CHECKS = {
		string: (d) => typeof d === "string",
		number: (d) => typeof d === "number" && isFinite(d),
		integer: (d) => Number.isInteger(d),
		boolean: (d) => typeof d === "boolean",
		null: (d) => d === null,
		array: (d) => Array.isArray(d),
		object: (d) => typeof d === "object" && d !== null && !Array.isArray(d)
	};
	const FORMAT_CHECKS = {
		email: (s) => {
			const at = s.indexOf("@");
			return at > 0 && at < s.length - 1 && s.indexOf(".", at) > at + 1;
		},
		date: (s) => s.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(s),
		uuid: (s) => s.length === 36 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s),
		ipv4: (s) => {
			const p = s.split(".");
			return p.length === 4 && p.every((n) => {
				const v = +n;
				return v >= 0 && v <= 255 && String(v) === n;
			});
		},
		hostname: (s) => s.length > 0 && s.length <= 253 && /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i.test(s)
	};
	const UNSAFE_KEYS = new Set([
		"__proto__",
		"constructor",
		"toString",
		"valueOf",
		"hasOwnProperty",
		"isPrototypeOf",
		"propertyIsEnumerable",
		"toLocaleString"
	]);
	function codegenSafe(schema, schemaMap) {
		if (typeof schema === "boolean") return true;
		if (typeof schema !== "object" || schema === null) return true;
		if (schema.items === false || schema.items === true) return false;
		if (schema.additionalProperties === true) return true;
		if (schema.properties) for (const v of Object.values(schema.properties)) {
			if (typeof v === "boolean") return false;
			if (!codegenSafe(v, schemaMap)) return false;
		}
		if (schema.required) {
			for (const k of schema.required) if (UNSAFE_KEYS.has(k)) return false;
		}
		if (schema.properties) for (const k of Object.keys(schema.properties)) {
			if (UNSAFE_KEYS.has(k)) return false;
			if (k === "$ref") return false;
		}
		if (schema.pattern && /\\[pP]\{/.test(schema.pattern)) return false;
		if (schema.$ref) {
			const isLocal = /^#\/(?:\$defs|definitions)\/[^/]+$/.test(schema.$ref);
			const isResolvable = !isLocal && schemaMap && schemaMap.has(schema.$ref);
			if (!isLocal && !isResolvable) return false;
			if (Object.keys(schema).filter((k) => k !== "$ref" && k !== "$defs" && k !== "definitions" && k !== "$schema" && k !== "$id").length > 0) return false;
		}
		if (typeof schema.additionalProperties === "object") return false;
		if (schema.additionalProperties === false && !schema.properties) return false;
		if (schema.propertyNames === false) return false;
		const defs = schema.$defs || schema.definitions;
		if (defs) for (const [name, def] of Object.entries(defs)) {
			if (/[~/"']/.test(name)) return false;
			if (typeof def === "boolean") return false;
			if (typeof def === "object" && def !== null) {
				if (def.$id) return false;
				if (def.$ref) return false;
				if (!codegenSafe(def, schemaMap)) return false;
			}
		}
		const subs = [
			schema.items,
			schema.contains,
			schema.not,
			schema.if,
			schema.then,
			schema.else,
			...schema.prefixItems || [],
			...schema.allOf || [],
			...schema.anyOf || [],
			...schema.oneOf || []
		];
		if (typeof schema.additionalProperties === "object") subs.push(schema.additionalProperties);
		for (const s of subs) {
			if (s === void 0 || s === null) continue;
			if (typeof s === "boolean") return false;
			if (!codegenSafe(s, schemaMap)) return false;
		}
		return true;
	}
	function compileToJSCodegen(schema, schemaMap) {
		if (typeof schema === "boolean") return schema ? () => true : () => false;
		if (typeof schema !== "object" || schema === null) return null;
		if (!codegenSafe(schema, schemaMap)) return null;
		const rootDefs = schema.$defs || schema.definitions || null;
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			if (typeof sub === "boolean") return null;
			if (/\\[pP]\{/.test(pat)) return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) for (const sub of Object.values(schema.dependentSchemas)) {
			if (typeof sub === "boolean") return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames) {
			if (typeof schema.propertyNames === "boolean") return null;
			const pn = schema.propertyNames;
			const supported = [
				"maxLength",
				"minLength",
				"pattern",
				"const",
				"enum"
			];
			if (Object.keys(pn).filter((k) => k !== "$schema").some((k) => !supported.includes(k))) return null;
		}
		const ctx = {
			varCounter: 0,
			helpers: [],
			helperCode: [],
			closureVars: [],
			closureVals: [],
			rootDefs,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null
		};
		const lines = [];
		genCode(schema, "d", lines, ctx);
		if (lines.length === 0) return () => true;
		if (ctx.deferredChecks) for (const dc of ctx.deferredChecks) lines.push(dc);
		const checkStr = lines.join("\n  ");
		const closureNames = ctx.closureVars;
		const closureValues = ctx.closureVals;
		for (const code of ctx.helperCode) {
			const match = code.match(/^const (_re\d+)=new RegExp\((.+)\)$/);
			if (match) {
				closureNames.push(match[1]);
				closureValues.push(new RegExp(JSON.parse(match[2])));
			}
		}
		const body = checkStr + "\n  return true";
		try {
			let boolFn;
			if (closureNames.length > 0) boolFn = new Function(...closureNames, `return function(d){${body}}`)(...closureValues);
			else boolFn = new Function("d", body);
			const hybridBody = replaceTopLevel(checkStr + "\n  return R");
			try {
				const hybridFactory = new Function(...closureNames, "R", "E", `return function(d){${hybridBody}}`);
				boolFn._hybridFactory = (R, E) => hybridFactory(...closureValues, R, E);
			} catch {}
			const helperStr = ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "";
			boolFn._source = helperStr + body;
			boolFn._hybridSource = helperStr + hybridBody;
			return boolFn;
		} catch {
			return null;
		}
	}
	function replaceTopLevel(code) {
		let result = "", i = 0;
		while (i < code.length) if (code.startsWith("function", i) && (i === 0 || /[^a-zA-Z_$]/.test(code[i - 1]))) {
			let j = i + 8;
			while (j < code.length && code[j] !== "{") j++;
			result += code.slice(i, j + 1);
			i = j + 1;
			let braceDepth = 1;
			while (i < code.length && braceDepth > 0) {
				if (code[i] === "{") braceDepth++;
				else if (code[i] === "}") braceDepth--;
				if (braceDepth > 0) result += code[i];
				else result += "}";
				i++;
			}
		} else if (code.startsWith("return false", i)) {
			result += "return E(d)";
			i += 12;
		} else if (code.startsWith("return true", i) && (i + 11 >= code.length || !/[a-zA-Z_$]/.test(code[i + 11]))) {
			result += "return R";
			i += 11;
		} else {
			result += code[i];
			i++;
		}
		return result;
	}
	function genCode(schema, v, lines, ctx, knownType) {
		if (typeof schema !== "object" || schema === null) return;
		if (schema.$ref) {
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCode(ctx.rootDefs[m[1]], v, lines, ctx, knownType);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (ctx.schemaMap && ctx.schemaMap.has(schema.$ref)) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCode(ctx.schemaMap.get(schema.$ref), v, lines, ctx, knownType);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			return;
		}
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		let effectiveType = knownType;
		if (types) {
			if (!knownType) {
				const conds = types.map((t) => {
					switch (t) {
						case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
						case "array": return `Array.isArray(${v})`;
						case "string": return `typeof ${v}==='string'`;
						case "number": return `(typeof ${v}==='number'&&isFinite(${v}))`;
						case "integer": return `Number.isInteger(${v})`;
						case "boolean": return `(${v}===true||${v}===false)`;
						case "null": return `${v}===null`;
						default: return "true";
					}
				});
				lines.push(`if(!(${conds.join("||")}))return false`);
			}
			if (types.length === 1) effectiveType = types[0];
		}
		const isObj = effectiveType === "object";
		const isArr = effectiveType === "array";
		const isStr = effectiveType === "string";
		const isNum = effectiveType === "number" || effectiveType === "integer";
		const objGuard = isObj ? "" : `typeof ${v}==='object'&&${v}!==null&&`;
		isObj || `${v}${v}`;
		if (schema.enum) {
			const vals = schema.enum;
			const primitives = vals.filter((v) => v === null || typeof v !== "object");
			const objects = vals.filter((v) => v !== null && typeof v === "object");
			const allChecks = [primitives.map((p) => `${v}===${JSON.stringify(p)}`).join("||"), objects.map((o) => `JSON.stringify(${v})===${JSON.stringify(JSON.stringify(o))}`).join("||")].filter(Boolean).join("||");
			lines.push(`if(!(${allChecks || "false"}))return false`);
		}
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)})return false`);
			else lines.push(`if(JSON.stringify(${v})!==${JSON.stringify(JSON.stringify(cv))})return false`);
		}
		const requiredSet = new Set(schema.required || []);
		const hoisted = {};
		if (schema.required && schema.properties && isObj) {
			const reqChecks = [];
			for (const key of schema.required) {
				hoisted[key] = `${v}[${JSON.stringify(key)}]`;
				const prop = schema.properties[key];
				if (!(prop && (prop.type || prop.enum || prop.const !== void 0))) reqChecks.push(`${v}[${JSON.stringify(key)}]===undefined`);
			}
			if (reqChecks.length > 0) lines.push(`if(${reqChecks.join("||")})return false`);
		} else if (schema.required) if (isObj) {
			const checks = schema.required.map((key) => `${v}[${JSON.stringify(key)}]===undefined`);
			lines.push(`if(${checks.join("||")})return false`);
		} else for (const key of schema.required) lines.push(`if(typeof ${v}!=='object'||${v}===null||!(${JSON.stringify(key)} in ${v}))return false`);
		if (schema.minimum !== void 0) lines.push(isNum ? `if(${v}<${schema.minimum})return false` : `if(typeof ${v}==='number'&&${v}<${schema.minimum})return false`);
		if (schema.maximum !== void 0) lines.push(isNum ? `if(${v}>${schema.maximum})return false` : `if(typeof ${v}==='number'&&${v}>${schema.maximum})return false`);
		if (schema.exclusiveMinimum !== void 0) lines.push(isNum ? `if(${v}<=${schema.exclusiveMinimum})return false` : `if(typeof ${v}==='number'&&${v}<=${schema.exclusiveMinimum})return false`);
		if (schema.exclusiveMaximum !== void 0) lines.push(isNum ? `if(${v}>=${schema.exclusiveMaximum})return false` : `if(typeof ${v}==='number'&&${v}>=${schema.exclusiveMaximum})return false`);
		if (schema.multipleOf !== void 0) lines.push(isNum ? `if(${v}%${schema.multipleOf}!==0)return false` : `if(typeof ${v}==='number'&&${v}%${schema.multipleOf}!==0)return false`);
		if (schema.minLength !== void 0) lines.push(isStr ? `if(${v}.length<${schema.minLength})return false` : `if(typeof ${v}==='string'&&${v}.length<${schema.minLength})return false`);
		if (schema.maxLength !== void 0) lines.push(isStr ? `if(${v}.length>${schema.maxLength})return false` : `if(typeof ${v}==='string'&&${v}.length>${schema.maxLength})return false`);
		if (schema.minItems !== void 0) lines.push(isArr ? `if(${v}.length<${schema.minItems})return false` : `if(Array.isArray(${v})&&${v}.length<${schema.minItems})return false`);
		if (schema.maxItems !== void 0) lines.push(isArr ? `if(${v}.length>${schema.maxItems})return false` : `if(Array.isArray(${v})&&${v}.length>${schema.maxItems})return false`);
		if (schema.minProperties !== void 0) lines.push(`if(${objGuard}Object.keys(${v}).length<${schema.minProperties})return false`);
		if (schema.maxProperties !== void 0) lines.push(`if(${objGuard}Object.keys(${v}).length>${schema.maxProperties})return false`);
		if (schema.pattern) {
			const ri = ctx.varCounter++;
			ctx.helperCode.push(`const _re${ri}=new RegExp(${JSON.stringify(schema.pattern)})`);
			lines.push(isStr ? `if(!_re${ri}.test(${v}))return false` : `if(typeof ${v}==='string'&&!_re${ri}.test(${v}))return false`);
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) lines.push(fc(v, isStr));
		}
		if (schema.uniqueItems) {
			const si = ctx.varCounter++;
			const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
			const isPrimItems = itemType === "string" || itemType === "number" || itemType === "integer";
			const maxItems = schema.maxItems;
			const inner = isPrimItems && maxItems && maxItems <= 16 ? `for(let _i=1;_i<${v}.length;_i++){for(let _k=0;_k<_i;_k++){if(${v}[_i]===${v}[_k])return false}}` : isPrimItems ? `const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){if(_s${si}.has(${v}[_i]))return false;_s${si}.add(${v}[_i])}` : `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);if(_s${si}.has(_k))return false;_s${si}.add(_k)}`;
			lines.push(isArr ? `{${inner}}` : `if(Array.isArray(${v})){${inner}}`);
		}
		if (schema.additionalProperties === false && schema.properties && !schema.patternProperties) {
			const propCount = Object.keys(schema.properties).length;
			const inner = schema.required && schema.required.length === propCount ? `var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false` : `for(var _k in ${v})if(${Object.keys(schema.properties).map((k) => `_k!==${JSON.stringify(k)}`).join("&&")})return false`;
			if (!ctx.deferredChecks) ctx.deferredChecks = [];
			ctx.deferredChecks.push(isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) {
			const depChecks = deps.map((d) => `!('${esc(d)}' in ${v})`).join("||");
			lines.push(`if(${objGuard}'${esc(key)}' in ${v}&&(${depChecks}))return false`);
		}
		if (schema.patternProperties) {
			const ppEntries = Object.entries(schema.patternProperties);
			const pn = schema.propertyNames && typeof schema.propertyNames === "object" ? schema.propertyNames : null;
			const pi = ctx.varCounter++;
			const kVar = `_ppk${pi}`;
			const matchers = [];
			for (const [pat] of ppEntries) {
				const fast = fastPrefixCheck(pat, kVar);
				if (fast) matchers.push({ check: fast });
				else {
					const ri = ctx.varCounter++;
					ctx.closureVars.push(`_re${ri}`);
					ctx.closureVals.push(new RegExp(pat));
					matchers.push({ check: `_re${ri}.test(${kVar})` });
				}
			}
			for (let i = 0; i < ppEntries.length; i++) {
				const [, sub] = ppEntries[i];
				const subLines = [];
				genCode(sub, `_ppv`, subLines, ctx);
				const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
				const fnVar = `_ppf${pi}_${i}`;
				ctx.closureVars.push(fnVar);
				ctx.closureVals.push(new Function("_ppv", fnBody));
			}
			const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
			if (schema.additionalProperties === false && schema.properties) {
				ctx._ppHandledAdditional = true;
				ctx._ppHandledPropertyNames = !!pn;
				const propKeys = Object.keys(schema.properties);
				const keyCheck = propKeys.length <= 8 ? propKeys.map((k) => `${kVar}===${JSON.stringify(k)}`).join("||") : null;
				if (!keyCheck) {
					const allowedSet = `_as${pi}`;
					ctx.closureVars.push(allowedSet);
					ctx.closureVals.push(new Set(propKeys));
				}
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength})return false`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength})return false`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast}))return false`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(new RegExp(pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar}))return false`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)})return false`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar}))return false`);
					}
				}
				const matchExpr = keyCheck || `_as${pi}.has(${kVar})`;
				lines.push(`let _m${pi}=${matchExpr}`);
				for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}){_m${pi}=true;if(!_ppf${pi}_${i}(${v}[${kVar}]))return false}`);
				lines.push(`if(!_m${pi})return false`);
				lines.push(`}}`);
			} else {
				ctx._ppHandledPropertyNames = !!pn;
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength})return false`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength})return false`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast}))return false`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(new RegExp(pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar}))return false`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)})return false`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar}))return false`);
					}
				}
				for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}&&!_ppf${pi}_${i}(${v}[${kVar}]))return false`);
				lines.push(`}}`);
			}
		}
		if (schema.dependentSchemas) for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			const guard = isObj ? "" : `typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&`;
			lines.push(`if(${guard}${JSON.stringify(key)} in ${v}){`);
			genCode(depSchema, v, lines, ctx, effectiveType);
			lines.push(`}`);
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !ctx._ppHandledPropertyNames) {
			const pn = schema.propertyNames;
			const ki = ctx.varCounter++;
			const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
			lines.push(`${guard}{for(const _k${ki} in ${v}){`);
			if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength})return false`);
			if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength})return false`);
			if (pn.pattern) {
				const fast = fastPrefixCheck(pn.pattern, `_k${ki}`);
				if (fast) lines.push(`if(!(${fast}))return false`);
				else {
					const ri = ctx.varCounter++;
					ctx.closureVars.push(`_re${ri}`);
					ctx.closureVals.push(new RegExp(pn.pattern));
					lines.push(`if(!_re${ri}.test(_k${ki}))return false`);
				}
			}
			if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)})return false`);
			if (pn.enum) {
				const ei = ctx.varCounter++;
				ctx.closureVars.push(`_es${ei}`);
				ctx.closureVals.push(new Set(pn.enum));
				lines.push(`if(!_es${ei}.has(_k${ki}))return false`);
			}
			lines.push(`}}`);
		}
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) if (requiredSet.has(key) && isObj) genCode(prop, hoisted[key] || `${v}[${JSON.stringify(key)}]`, lines, ctx);
		else if (isObj) {
			const local = `_o${ctx.varCounter++}`;
			lines.push(`{const ${local}=${v}[${JSON.stringify(key)}];if(${local}!==undefined){`);
			genCode(prop, local, lines, ctx);
			lines.push(`}}`);
		} else {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}){`);
			genCode(prop, `${v}[${JSON.stringify(key)}]`, lines, ctx);
			lines.push(`}`);
		}
		if (schema.items) {
			const idx = `_j${ctx.varCounter}`;
			const elem = `_e${ctx.varCounter}`;
			ctx.varCounter++;
			lines.push(isArr ? `for(let ${idx}=0;${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]` : `if(Array.isArray(${v})){for(let ${idx}=0;${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCode(schema.items, elem, lines, ctx);
			lines.push(isArr ? `}` : `}}`);
		}
		if (schema.prefixItems) {
			for (let i = 0; i < schema.prefixItems.length; i++) {
				const elem = `_p${ctx.varCounter}_${i}`;
				lines.push(isArr ? `if(${v}.length>${i}){const ${elem}=${v}[${i}]` : `if(Array.isArray(${v})&&${v}.length>${i}){const ${elem}=${v}[${i}]`);
				genCode(schema.prefixItems[i], elem, lines, ctx);
				lines.push(`}`);
			}
			ctx.varCounter++;
		}
		if (schema.contains) {
			const ci = ctx.varCounter++;
			const minC = schema.minContains !== void 0 ? schema.minContains : 1;
			const maxC = schema.maxContains !== void 0 ? schema.maxContains : Infinity;
			const subLines = [];
			genCode(schema.contains, `_cv`, subLines, ctx);
			const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
			const guard = isArr ? "" : `if(!Array.isArray(${v})){}else `;
			lines.push(`${guard}{const _cf${ci}=function(_cv){${fnBody}};let _cc${ci}=0`);
			lines.push(`for(let _ci${ci}=0;_ci${ci}<${v}.length;_ci${ci}++){if(_cf${ci}(${v}[_ci${ci}]))_cc${ci}++}`);
			if (maxC === Infinity) lines.push(`if(_cc${ci}<${minC})return false}`);
			else lines.push(`if(_cc${ci}<${minC}||_cc${ci}>${maxC})return false}`);
		}
		if (schema.allOf) for (const sub of schema.allOf) genCode(sub, v, lines, ctx, effectiveType);
		if (schema.anyOf) {
			const fns = [];
			for (let i = 0; i < schema.anyOf.length; i++) {
				const subLines = [];
				genCode(schema.anyOf[i], "_av", subLines, ctx);
				if (subLines.length === 0) fns.push(`function(_av){return true}`);
				else fns.push(`function(_av){${subLines.join(";")};return true}`);
			}
			const fi = ctx.varCounter++;
			lines.push(`{const _af${fi}=[${fns.join(",")}];let _am${fi}=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am${fi}=true;break}}if(!_am${fi})return false}`);
		}
		if (schema.oneOf) {
			const fns = [];
			for (let i = 0; i < schema.oneOf.length; i++) {
				const subLines = [];
				genCode(schema.oneOf[i], "_ov", subLines, ctx);
				if (subLines.length === 0) fns.push(`function(_ov){return true}`);
				else fns.push(`function(_ov){${subLines.join(";")};return true}`);
			}
			const fi = ctx.varCounter++;
			lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc${fi}=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc${fi}++;if(_oc${fi}>1)return false}if(_oc${fi}!==1)return false}`);
		}
		if (schema.not) {
			const subLines = [];
			genCode(schema.not, "_nv", subLines, ctx);
			if (subLines.length === 0) lines.push(`return false`);
			else {
				const fi = ctx.varCounter++;
				lines.push(`{const _nf${fi}=(function(_nv){${subLines.join(";")};return true});if(_nf${fi}(${v}))return false}`);
			}
		}
		if (schema.if) {
			const ifLines = [];
			genCode(schema.if, "_iv", ifLines, ctx);
			const fi = ctx.varCounter++;
			const ifFn = ifLines.length === 0 ? `function(_iv){return true}` : `function(_iv){${ifLines.join(";")};return true}`;
			let thenFn = "null", elseFn = "null";
			if (schema.then) {
				const thenLines = [];
				genCode(schema.then, "_tv", thenLines, ctx);
				thenFn = thenLines.length === 0 ? `function(_tv){return true}` : `function(_tv){${thenLines.join(";")};return true}`;
			}
			if (schema.else) {
				const elseLines = [];
				genCode(schema.else, "_ev", elseLines, ctx);
				elseFn = elseLines.length === 0 ? `function(_ev){return true}` : `function(_ev){${elseLines.join(";")};return true}`;
			}
			lines.push(`{const _if${fi}=${ifFn};const _th${fi}=${thenFn};const _el${fi}=${elseFn}`);
			lines.push(`if(_if${fi}(${v})){if(_th${fi}&&!_th${fi}(${v}))return false}else{if(_el${fi}&&!_el${fi}(${v}))return false}}`);
		}
	}
	const FORMAT_CODEGEN = {
		email: (v, isStr) => {
			isStr || `${v}`;
			return isStr ? `{const _at=${v}.indexOf('@');if(_at<=0||_at>=${v}.length-1||${v}.indexOf('.',_at)<=_at+1)return false}` : `if(typeof ${v}==='string'){const _at=${v}.indexOf('@');if(_at<=0||_at>=${v}.length-1||${v}.indexOf('.',_at)<=_at+1)return false}`;
		},
		date: (v, isStr) => isStr ? `if(${v}.length!==10||!/^\\d{4}-\\d{2}-\\d{2}$/.test(${v}))return false` : `if(typeof ${v}==='string'&&(${v}.length!==10||!/^\\d{4}-\\d{2}-\\d{2}$/.test(${v})))return false`,
		uuid: (v, isStr) => isStr ? `if(${v}.length!==36||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(${v}))return false` : `if(typeof ${v}==='string'&&(${v}.length!==36||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(${v})))return false`,
		"date-time": (v, isStr) => isStr ? `if(!/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$/.test(${v})||isNaN(Date.parse(${v})))return false` : `if(typeof ${v}==='string'&&(!/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$/.test(${v})||isNaN(Date.parse(${v}))))return false`,
		time: (v, isStr) => isStr ? `if(!/^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})?$/.test(${v}))return false` : `if(typeof ${v}==='string'&&!/^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})?$/.test(${v}))return false`,
		duration: (v, isStr) => isStr ? `if(!/^P(?:\\d+Y)?(?:\\d+M)?(?:\\d+W)?(?:\\d+D)?(?:T(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?$/.test(${v})||${v}==='P')return false` : `if(typeof ${v}==='string'&&(!/^P(?:\\d+Y)?(?:\\d+M)?(?:\\d+W)?(?:\\d+D)?(?:T(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?$/.test(${v})||${v}==='P'))return false`,
		uri: (v, isStr) => isStr ? `if(!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(${v}))return false` : `if(typeof ${v}==='string'&&!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(${v}))return false`,
		"uri-reference": (v, isStr) => isStr ? `if(${v}===''||/\\s/.test(${v}))return false` : `if(typeof ${v}==='string'&&(${v}===''||/\\s/.test(${v})))return false`,
		ipv4: (v, isStr) => isStr ? `{const _p=${v}.split('.');if(_p.length!==4||!_p.every(function(n){var x=+n;return x>=0&&x<=255&&String(x)===n}))return false}` : `if(typeof ${v}==='string'){const _p=${v}.split('.');if(_p.length!==4||!_p.every(function(n){var x=+n;return x>=0&&x<=255&&String(x)===n}))return false}`,
		ipv6: (v, isStr) => isStr ? `{const _s=${v};if(_s===''||!/^[0-9a-fA-F:]+$/.test(_s)||_s.split(':').length<3||_s.split(':').length>8)return false}` : `if(typeof ${v}==='string'){const _s=${v};if(_s===''||!/^[0-9a-fA-F:]+$/.test(_s)||_s.split(':').length<3||_s.split(':').length>8)return false}`,
		hostname: (v, isStr) => isStr ? `if(!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(${v}))return false` : `if(typeof ${v}==='string'&&!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(${v}))return false`
	};
	function esc(s) {
		return JSON.stringify(s).slice(1, -1);
	}
	function fastPrefixCheck(pattern, keyVar) {
		const m = pattern.match(/^\^([a-zA-Z0-9_\-./]+)$/);
		if (!m) return null;
		const prefix = m[1];
		if (prefix.length === 0 || prefix.length > 8) return null;
		if (prefix.length === 1) return `${keyVar}.charCodeAt(0)===${prefix.charCodeAt(0)}`;
		if (prefix.length === 2) return `${keyVar}.charCodeAt(0)===${prefix.charCodeAt(0)}&&${keyVar}.charCodeAt(1)===${prefix.charCodeAt(1)}`;
		return `${keyVar}.startsWith(${JSON.stringify(prefix)})`;
	}
	function compileToJSCodegenWithErrors(schema, schemaMap) {
		if (typeof schema === "boolean") return schema ? () => ({
			valid: true,
			errors: []
		}) : () => ({
			valid: false,
			errors: [{
				code: "type_mismatch",
				path: "",
				message: "schema is false"
			}]
		});
		if (typeof schema !== "object" || schema === null) return null;
		if (!codegenSafe(schema, schemaMap)) return null;
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			if (typeof sub === "boolean") return null;
			if (/\\[pP]\{/.test(pat)) return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) for (const sub of Object.values(schema.dependentSchemas)) {
			if (typeof sub === "boolean") return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames) {
			if (typeof schema.propertyNames === "boolean") return null;
			const pn = schema.propertyNames;
			const supported = [
				"maxLength",
				"minLength",
				"pattern",
				"const",
				"enum"
			];
			if (Object.keys(pn).filter((k) => k !== "$schema").some((k) => !supported.includes(k))) return null;
		}
		const ctx = {
			varCounter: 0,
			helperCode: [],
			rootDefs: schema.$defs || schema.definitions || null,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null
		};
		const lines = [];
		genCodeE(schema, "d", "", lines, ctx);
		if (lines.length === 0) return (d) => ({
			valid: true,
			errors: []
		});
		const body = `const _e=[];\n  ` + (ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "") + lines.join("\n  ") + `\n  return{valid:_e.length===0,errors:_e}`;
		try {
			const fn = new Function("d", "_all", body);
			fn._errSource = body;
			return fn;
		} catch {
			return null;
		}
	}
	function genCodeE(schema, v, pathExpr, lines, ctx) {
		if (typeof schema !== "object" || schema === null) return;
		if (schema.$ref) {
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeE(ctx.rootDefs[m[1]], v, pathExpr, lines, ctx);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (ctx.schemaMap && ctx.schemaMap.has(schema.$ref)) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeE(ctx.schemaMap.get(schema.$ref), v, pathExpr, lines, ctx);
				ctx.refStack.delete(schema.$ref);
				return;
			}
		}
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		if (types) {
			const conds = types.map((t) => {
				switch (t) {
					case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
					case "array": return `Array.isArray(${v})`;
					case "string": return `typeof ${v}==='string'`;
					case "number": return `(typeof ${v}==='number'&&isFinite(${v}))`;
					case "integer": return `Number.isInteger(${v})`;
					case "boolean": return `(${v}===true||${v}===false)`;
					case "null": return `${v}===null`;
					default: return "true";
				}
			});
			const expected = types.join(", ");
			lines.push(`if(!(${conds.join("||")})){_e.push({code:'type_mismatch',path:${pathExpr || "\"\""},message:'expected ${expected}'});if(!_all)return{valid:false,errors:_e}}`);
		}
		const isStr = false;
		const fail = (code, msg) => `_e.push({code:'${code}',path:${pathExpr || "\"\""},message:${msg}});if(!_all)return{valid:false,errors:_e}`;
		if (schema.enum) {
			const vals = schema.enum;
			const primitives = vals.filter((v) => v === null || typeof v !== "object");
			const objects = vals.filter((v) => v !== null && typeof v === "object");
			const allChecks = [primitives.map((p) => `${v}===${JSON.stringify(p)}`).join("||"), objects.map((o) => `JSON.stringify(${v})===${JSON.stringify(JSON.stringify(o))}`).join("||")].filter(Boolean).join("||");
			lines.push(`if(!(${allChecks || "false"})){${fail("enum_mismatch", "'value not in enum'")}}`);
		}
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)}){${fail("const_mismatch", "'value does not match const'")}}`);
			else {
				const canonFn = `_cnE${ctx.varCounter++}`;
				ctx.helperCode.push(`const ${canonFn}=function(x){if(x===null||typeof x!=='object')return JSON.stringify(x);if(Array.isArray(x))return'['+x.map(${canonFn}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+${canonFn}(x[k])}).join(',')+'}'};`);
				const expected = canonFn + "(" + JSON.stringify(cv) + ")";
				lines.push(`if(${canonFn}(${v})!==${expected}){${fail("const_mismatch", "'value does not match const'")}}`);
			}
		}
		new Set(schema.required || []);
		if (schema.required) for (const key of schema.required) {
			const p = pathExpr ? `${pathExpr}+'/${esc(key)}'` : `'/${esc(key)}'`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!(${JSON.stringify(key)} in ${v})){_e.push({code:'required_missing',path:${p},message:'missing required: ${esc(key)}'});if(!_all)return{valid:false,errors:_e}}`);
		}
		if (schema.minimum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}<${schema.minimum}`;
			lines.push(`if(${c}){${fail("minimum_violation", `'minimum ${schema.minimum}'`)}}`);
		}
		if (schema.maximum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}>${schema.maximum}`;
			lines.push(`if(${c}){${fail("maximum_violation", `'maximum ${schema.maximum}'`)}}`);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}<=${schema.exclusiveMinimum}`;
			lines.push(`if(${c}){${fail("exclusive_minimum_violation", `'exclusiveMinimum ${schema.exclusiveMinimum}'`)}}`);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}>=${schema.exclusiveMaximum}`;
			lines.push(`if(${c}){${fail("exclusive_maximum_violation", `'exclusiveMaximum ${schema.exclusiveMaximum}'`)}}`);
		}
		if (schema.multipleOf !== void 0) {
			const m = schema.multipleOf;
			const ci = ctx.varCounter++;
			lines.push(`{const _r${ci}=typeof ${v}==='number'?${v}%${m}:NaN;if(typeof ${v}==='number'&&Math.abs(_r${ci})>1e-8&&Math.abs(_r${ci}-${m})>1e-8){${fail("multiple_of_violation", `'multipleOf ${m}'`)}}}`);
		}
		if (schema.minLength !== void 0) {
			const c = `typeof ${v}==='string'&&${v}.length<${schema.minLength}`;
			lines.push(`if(${c}){${fail("min_length_violation", `'minLength ${schema.minLength}'`)}}`);
		}
		if (schema.maxLength !== void 0) {
			const c = `typeof ${v}==='string'&&${v}.length>${schema.maxLength}`;
			lines.push(`if(${c}){${fail("max_length_violation", `'maxLength ${schema.maxLength}'`)}}`);
		}
		if (schema.pattern) {
			const ri = ctx.varCounter++;
			ctx.helperCode.push(`const _re${ri}=new RegExp(${JSON.stringify(schema.pattern)})`);
			const c = `typeof ${v}==='string'&&!_re${ri}.test(${v})`;
			lines.push(`if(${c}){${fail("pattern_mismatch", `'pattern mismatch'`)}}`);
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) {
				ctx.varCounter++;
				const boolLines = [];
				boolLines.push(fc(v, isStr));
				const fmtCode = boolLines.join(";").replace(/return false/g, `{_e.push({code:'format_mismatch',path:${pathExpr || "\"\""},message:'format ${esc(schema.format)}'});if(!_all)return{valid:false,errors:_e}}`);
				lines.push(fmtCode);
			}
		}
		if (schema.minItems !== void 0) {
			const c = `Array.isArray(${v})&&${v}.length<${schema.minItems}`;
			lines.push(`if(${c}){${fail("min_items_violation", `'minItems ${schema.minItems}'`)}}`);
		}
		if (schema.maxItems !== void 0) {
			const c = `Array.isArray(${v})&&${v}.length>${schema.maxItems}`;
			lines.push(`if(${c}){${fail("max_items_violation", `'maxItems ${schema.maxItems}'`)}}`);
		}
		if (schema.uniqueItems) {
			const si = ctx.varCounter++;
			const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
			const inner = itemType === "string" || itemType === "number" || itemType === "integer" ? `const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){if(_s${si}.has(${v}[_i])){${fail("unique_items_violation", "'duplicate items'")};break};_s${si}.add(${v}[_i])}` : `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);if(_s${si}.has(_k)){${fail("unique_items_violation", "'duplicate items'")};break};_s${si}.add(_k)}`;
			lines.push(`if(Array.isArray(${v})){${inner}}`);
		}
		if (schema.minProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length<${schema.minProperties}){${fail("min_properties_violation", `'minProperties ${schema.minProperties}'`)}}`);
		if (schema.maxProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length>${schema.maxProperties}){${fail("max_properties_violation", `'maxProperties ${schema.maxProperties}'`)}}`);
		if (schema.additionalProperties === false && schema.properties) {
			const allowed = Object.keys(schema.properties).map((k) => `${JSON.stringify(k)}`).join(",");
			const ci = ctx.varCounter++;
			const inner = `const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++){if(!_a${ci}.has(_k${ci}[_i])){_e.push({code:'additional_property',path:${pathExpr || "\"\""},message:'additional property: '+_k${ci}[_i]});if(!_all)return{valid:false,errors:_e}}}`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) for (const dep of deps) {
			const p = pathExpr ? `${pathExpr}+'/${esc(dep)}'` : `'/${esc(dep)}'`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}&&!(${JSON.stringify(dep)} in ${v})){_e.push({code:'required_missing',path:${p},message:'${esc(key)} requires ${esc(dep)}'});if(!_all)return{valid:false,errors:_e}}`);
		}
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const childPath = pathExpr ? `${pathExpr}+'/${esc(key)}'` : `'/${esc(key)}'`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeE(prop, `${v}[${JSON.stringify(key)}]`, childPath, lines, ctx);
			lines.push(`}`);
		}
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			const ri = ctx.varCounter++;
			ctx.helperCode.push(`const _re${ri}=new RegExp(${JSON.stringify(pat)})`);
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){if(_re${ri}.test(_k${ki})){`);
			const p = pathExpr ? `${pathExpr}+'/'+_k${ki}` : `'/'+_k${ki}`;
			genCodeE(sub, `${v}[_k${ki}]`, p, lines, ctx);
			lines.push(`}}}`);
		}
		if (schema.dependentSchemas) for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeE(depSchema, v, pathExpr, lines, ctx);
			lines.push(`}`);
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object") {
			const pn = schema.propertyNames;
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){`);
			if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength}){${fail("min_length_violation", `'propertyNames: key too short: '+_k${ki}`)}}`);
			if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength}){${fail("max_length_violation", `'propertyNames: key too long: '+_k${ki}`)}}`);
			if (pn.pattern) {
				const ri = ctx.varCounter++;
				ctx.helperCode.push(`const _re${ri}=new RegExp(${JSON.stringify(pn.pattern)})`);
				lines.push(`if(!_re${ri}.test(_k${ki})){${fail("pattern_mismatch", `'propertyNames: pattern mismatch: '+_k${ki}`)}}`);
			}
			if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)}){${fail("const_mismatch", `'propertyNames: expected '+${JSON.stringify(pn.const)}`)}}`);
			if (pn.enum) {
				const ei = ctx.varCounter++;
				ctx.helperCode.push(`const _es${ei}=new Set(${JSON.stringify(pn.enum)})`);
				lines.push(`if(!_es${ei}.has(_k${ki})){${fail("enum_mismatch", `'propertyNames: key not in enum: '+_k${ki}`)}}`);
			}
			lines.push(`}}`);
		}
		if (schema.items) {
			const startIdx = schema.prefixItems ? schema.prefixItems.length : 0;
			const idx = `_j${ctx.varCounter}`;
			const elem = `_ei${ctx.varCounter}`;
			ctx.varCounter++;
			const childPath = pathExpr ? `${pathExpr}+'/'+${idx}` : `'/'+${idx}`;
			lines.push(`if(Array.isArray(${v})){for(let ${idx}=${startIdx};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCodeE(schema.items, elem, childPath, lines, ctx);
			lines.push(`}}`);
		}
		if (schema.prefixItems) for (let i = 0; i < schema.prefixItems.length; i++) {
			const childPath = pathExpr ? `${pathExpr}+'/${i}'` : `'/${i}'`;
			lines.push(`if(Array.isArray(${v})&&${v}.length>${i}){`);
			genCodeE(schema.prefixItems[i], `${v}[${i}]`, childPath, lines, ctx);
			lines.push(`}`);
		}
		if (schema.contains) {
			const ci = ctx.varCounter++;
			const subLines = [];
			genCode(schema.contains, `_cv`, subLines, ctx);
			const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
			const minC = schema.minContains !== void 0 ? schema.minContains : 1;
			const maxC = schema.maxContains;
			lines.push(`if(Array.isArray(${v})){const _cf${ci}=function(_cv){${fnBody}};let _cc${ci}=0;for(let _ci${ci}=0;_ci${ci}<${v}.length;_ci${ci}++){if(_cf${ci}(${v}[_ci${ci}]))_cc${ci}++}`);
			lines.push(`if(_cc${ci}<${minC}){${fail("contains_violation", `'contains: need at least ${minC} match(es)'`)}}`);
			if (maxC !== void 0) lines.push(`if(_cc${ci}>${maxC}){${fail("contains_violation", `'contains: at most ${maxC} match(es)'`)}}`);
			lines.push(`}`);
		}
		if (schema.allOf) for (const sub of schema.allOf) genCodeE(sub, v, pathExpr, lines, ctx);
		if (schema.anyOf) {
			const fi = ctx.varCounter++;
			const fns = schema.anyOf.map((sub, i) => {
				const subLines = [];
				genCode(sub, "_av", subLines, ctx);
				return subLines.length === 0 ? `function(_av){return true}` : `function(_av){${subLines.join(";")};return true}`;
			});
			lines.push(`{const _af${fi}=[${fns.join(",")}];let _am${fi}=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am${fi}=true;break}}if(!_am${fi}){${fail("any_of_failed", "'no anyOf matched'")}}}`);
		}
		if (schema.oneOf) {
			const fi = ctx.varCounter++;
			const fns = schema.oneOf.map((sub, i) => {
				const subLines = [];
				genCode(sub, "_ov", subLines, ctx);
				return subLines.length === 0 ? `function(_ov){return true}` : `function(_ov){${subLines.join(";")};return true}`;
			});
			lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc${fi}=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc${fi}++;if(_oc${fi}>1)break}if(_oc${fi}!==1){${fail("one_of_failed", "'oneOf: expected 1 match, got '+_oc" + fi)}}}`);
		}
		if (schema.not) {
			const subLines = [];
			genCode(schema.not, "_nv", subLines, ctx);
			const nfn = subLines.length === 0 ? `function(_nv){return true}` : `function(_nv){${subLines.join(";")};return true}`;
			const fi = ctx.varCounter++;
			lines.push(`{const _nf${fi}=${nfn};if(_nf${fi}(${v})){${fail("not_failed", "'should not match'")}}}`);
		}
		if (schema.if) {
			const ifLines = [];
			genCode(schema.if, "_iv", ifLines, ctx);
			const fi = ctx.varCounter++;
			const ifFn = ifLines.length === 0 ? `function(_iv){return true}` : `function(_iv){${ifLines.join(";")};return true}`;
			lines.push(`{const _if${fi}=${ifFn}`);
			if (schema.then) {
				lines.push(`if(_if${fi}(${v})){`);
				genCodeE(schema.then, v, pathExpr, lines, ctx);
				lines.push(`}`);
			}
			if (schema.else) {
				lines.push(`${schema.then ? "else" : `if(!_if${fi}(${v}))`}{`);
				genCodeE(schema.else, v, pathExpr, lines, ctx);
				lines.push(`}`);
			}
			lines.push(`}`);
		}
	}
	function compileToJSCombined(schema, VALID_RESULT, schemaMap) {
		if (typeof schema === "boolean") return schema ? () => VALID_RESULT : () => ({
			valid: false,
			errors: [{
				code: "type_mismatch",
				path: "",
				message: "schema is false"
			}]
		});
		if (typeof schema !== "object" || schema === null) return null;
		if (!codegenSafe(schema, schemaMap)) return null;
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			if (typeof sub === "boolean") return null;
			if (/\\[pP]\{/.test(pat)) return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) for (const sub of Object.values(schema.dependentSchemas)) {
			if (typeof sub === "boolean") return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames) {
			if (typeof schema.propertyNames === "boolean") return null;
			const pn = schema.propertyNames;
			const supported = [
				"maxLength",
				"minLength",
				"pattern",
				"const",
				"enum"
			];
			if (Object.keys(pn).filter((k) => k !== "$schema").some((k) => !supported.includes(k))) return null;
		}
		const ctx = {
			varCounter: 0,
			helperCode: [],
			closureVars: [],
			closureVals: [],
			rootDefs: schema.$defs || schema.definitions || null,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null
		};
		const lines = [];
		genCodeC(schema, "d", "", lines, ctx);
		if (lines.length === 0) return () => VALID_RESULT;
		const closureParams = ctx.closureVars.join(",");
		const inner = `let _e;\n  ` + (ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "") + lines.join("\n  ") + `\n  return _e?{valid:false,errors:_e}:R`;
		try {
			return new Function("R" + (closureParams ? "," + closureParams : ""), `return function(d){${inner}}`)(VALID_RESULT, ...ctx.closureVals);
		} catch (e) {
			if (process.env.ATA_DEBUG) console.error("compileToJSCombined error:", e.message, "\n", inner.slice(0, 500));
			return null;
		}
	}
	function genCodeC(schema, v, pathExpr, lines, ctx) {
		if (typeof schema !== "object" || schema === null) return;
		if (schema.$ref) {
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeC(ctx.rootDefs[m[1]], v, pathExpr, lines, ctx);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (ctx.schemaMap && ctx.schemaMap.has(schema.$ref)) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeC(ctx.schemaMap.get(schema.$ref), v, pathExpr, lines, ctx);
				ctx.refStack.delete(schema.$ref);
				return;
			}
		}
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		let isObj = false, isArr = false, isStr = false, isNum = false;
		const isStaticPath = !pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+");
		const fail = (code, msg) => {
			if (isStaticPath && msg.startsWith("'") && !msg.includes("+")) {
				const errVar = `_E${ctx.varCounter++}`;
				const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
				const msgVal = msg.slice(1, -1);
				ctx.closureVars.push(errVar);
				ctx.closureVals.push(Object.freeze({
					code,
					path: pathVal,
					message: msgVal
				}));
				return `(_e||(_e=[])).push(${errVar})`;
			}
			return `(_e||(_e=[])).push({code:'${code}',path:${pathExpr || "\"\""},message:${msg}})`;
		};
		if (types) {
			const conds = types.map((t) => {
				switch (t) {
					case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
					case "array": return `Array.isArray(${v})`;
					case "string": return `typeof ${v}==='string'`;
					case "number": return `(typeof ${v}==='number'&&isFinite(${v}))`;
					case "integer": return `Number.isInteger(${v})`;
					case "boolean": return `(${v}===true||${v}===false)`;
					case "null": return `${v}===null`;
					default: return "true";
				}
			});
			const expected = types.join(", ");
			const typeOk = `_tok${ctx.varCounter++}`;
			lines.push(`const ${typeOk}=${conds.join("||")}`);
			lines.push(`if(!${typeOk}){${fail("type_mismatch", `'expected ${expected}'`)}}`);
			if (types.length === 1) {
				isObj = types[0] === "object";
				isArr = types[0] === "array";
				isStr = types[0] === "string";
				isNum = types[0] === "number" || types[0] === "integer";
			}
			lines.push(`if(${typeOk}){`);
		}
		if (schema.enum) {
			const vals = schema.enum;
			const primitives = vals.filter((v) => v === null || typeof v !== "object");
			const objects = vals.filter((v) => v !== null && typeof v === "object");
			const allChecks = [primitives.map((p) => `${v}===${JSON.stringify(p)}`).join("||"), objects.map((o) => `JSON.stringify(${v})===${JSON.stringify(JSON.stringify(o))}`).join("||")].filter(Boolean).join("||");
			lines.push(`if(!(${allChecks || "false"})){${fail("enum_mismatch", "'value not in enum'")}}`);
		}
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)}){${fail("const_mismatch", "'const mismatch'")}}`);
			else {
				const canonFn = `_cn${ctx.varCounter++}`;
				ctx.helperCode.push(`const ${canonFn}=function(x){if(x===null||typeof x!=='object')return JSON.stringify(x);if(Array.isArray(x))return'['+x.map(${canonFn}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+${canonFn}(x[k])}).join(',')+'}'};`);
				lines.push(`if(${canonFn}(${v})!==${canonFn}(${JSON.stringify(cv)})){${fail("const_mismatch", "'const mismatch'")}}`);
			}
		}
		const requiredSet = new Set(schema.required || []);
		const hoisted = {};
		if (schema.required && schema.properties && isObj) {
			const destructKeys = [];
			for (const key of schema.required) if (schema.properties[key]) {
				const lv = `_h${ctx.varCounter++}`;
				hoisted[key] = lv;
				destructKeys.push(`${JSON.stringify(key)}:${lv}`);
			}
			if (destructKeys.length > 0) lines.push(`const{${destructKeys.join(",")}}=${v}`);
			for (const key of schema.required) {
				const check = hoisted[key] ? `${hoisted[key]}===undefined` : `${v}[${JSON.stringify(key)}]===undefined`;
				const p = pathExpr ? `${pathExpr}+'/${esc(key)}'` : `'/${esc(key)}'`;
				lines.push(`if(${check}){${`(_e||(_e=[])).push({code:'required_missing',path:${p},message:'missing: ${esc(key)}'})`}}`);
			}
		} else if (schema.required) for (const key of schema.required) {
			const p = pathExpr ? `${pathExpr}+'/${esc(key)}'` : `'/${esc(key)}'`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!(${JSON.stringify(key)} in ${v})){(_e||(_e=[])).push({code:'required_missing',path:${p},message:'missing: ${esc(key)}'})}`);
		}
		if (schema.minimum !== void 0) {
			const c = isNum ? `${v}<${schema.minimum}` : `typeof ${v}==='number'&&${v}<${schema.minimum}`;
			lines.push(`if(${c}){${fail("minimum_violation", `'min ${schema.minimum}'`)}}`);
		}
		if (schema.maximum !== void 0) {
			const c = isNum ? `${v}>${schema.maximum}` : `typeof ${v}==='number'&&${v}>${schema.maximum}`;
			lines.push(`if(${c}){${fail("maximum_violation", `'max ${schema.maximum}'`)}}`);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const c = isNum ? `${v}<=${schema.exclusiveMinimum}` : `typeof ${v}==='number'&&${v}<=${schema.exclusiveMinimum}`;
			lines.push(`if(${c}){${fail("exclusive_minimum_violation", `'excMin ${schema.exclusiveMinimum}'`)}}`);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const c = isNum ? `${v}>=${schema.exclusiveMaximum}` : `typeof ${v}==='number'&&${v}>=${schema.exclusiveMaximum}`;
			lines.push(`if(${c}){${fail("exclusive_maximum_violation", `'excMax ${schema.exclusiveMaximum}'`)}}`);
		}
		if (schema.multipleOf !== void 0) {
			const m = schema.multipleOf;
			const ci = ctx.varCounter++;
			lines.push(`{const _r${ci}=typeof ${v}==='number'?${v}%${m}:NaN;if(typeof ${v}==='number'&&Math.abs(_r${ci})>1e-8&&Math.abs(_r${ci}-${m})>1e-8){${fail("multiple_of_violation", `'multipleOf ${m}'`)}}}`);
		}
		if (schema.minLength !== void 0) {
			const c = isStr ? `${v}.length<${schema.minLength}` : `typeof ${v}==='string'&&${v}.length<${schema.minLength}`;
			lines.push(`if(${c}){${fail("min_length_violation", `'minLength ${schema.minLength}'`)}}`);
		}
		if (schema.maxLength !== void 0) {
			const c = isStr ? `${v}.length>${schema.maxLength}` : `typeof ${v}==='string'&&${v}.length>${schema.maxLength}`;
			lines.push(`if(${c}){${fail("max_length_violation", `'maxLength ${schema.maxLength}'`)}}`);
		}
		if (schema.pattern) {
			const reVar = `_re${ctx.varCounter++}`;
			ctx.closureVars.push(reVar);
			ctx.closureVals.push(new RegExp(schema.pattern));
			const c = isStr ? `!${reVar}.test(${v})` : `typeof ${v}==='string'&&!${reVar}.test(${v})`;
			lines.push(`if(${c}){${fail("pattern_mismatch", "'pattern mismatch'")}}`);
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) {
				const code = fc(v, isStr).replace(/return false/g, `{${fail("format_mismatch", `'format ${esc(schema.format)}'`)}}`);
				lines.push(code);
			}
		}
		if (schema.minItems !== void 0) {
			const c = isArr ? `${v}.length<${schema.minItems}` : `Array.isArray(${v})&&${v}.length<${schema.minItems}`;
			lines.push(`if(${c}){${fail("min_items_violation", `'minItems ${schema.minItems}'`)}}`);
		}
		if (schema.maxItems !== void 0) {
			const c = isArr ? `${v}.length>${schema.maxItems}` : `Array.isArray(${v})&&${v}.length>${schema.maxItems}`;
			lines.push(`if(${c}){${fail("max_items_violation", `'maxItems ${schema.maxItems}'`)}}`);
		}
		if (schema.uniqueItems) {
			const si = ctx.varCounter++;
			const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
			const inner = itemType === "string" || itemType === "number" || itemType === "integer" ? `const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){if(_s${si}.has(${v}[_i])){${fail("unique_items_violation", "'duplicates'")};break};_s${si}.add(${v}[_i])}` : `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);if(_s${si}.has(_k)){${fail("unique_items_violation", "'duplicates'")};break};_s${si}.add(_k)}`;
			lines.push(isArr ? `{${inner}}` : `if(Array.isArray(${v})){${inner}}`);
		}
		if (schema.minProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length<${schema.minProperties}){${fail("min_properties_violation", `'minProperties ${schema.minProperties}'`)}}`);
		if (schema.maxProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length>${schema.maxProperties}){${fail("max_properties_violation", `'maxProperties ${schema.maxProperties}'`)}}`);
		if (schema.additionalProperties === false && schema.properties && !schema.patternProperties) {
			const allowed = Object.keys(schema.properties).map((k) => JSON.stringify(k)).join(",");
			const ci = ctx.varCounter++;
			lines.push(isObj ? `{const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++)if(!_a${ci}.has(_k${ci}[_i])){${fail("additional_property", `'extra: '+_k${ci}[_i]`)}}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++)if(!_a${ci}.has(_k${ci}[_i])){${fail("additional_property", `'extra: '+_k${ci}[_i]`)}}}`);
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) for (const dep of deps) {
			const p = pathExpr ? `${pathExpr}+'/${esc(dep)}'` : `'/${esc(dep)}'`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}&&!(${JSON.stringify(dep)} in ${v})){(_e||(_e=[])).push({code:'required_missing',path:${p},message:'${esc(key)} requires ${esc(dep)}'})}`);
		}
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const pv = hoisted[key] || `${v}[${JSON.stringify(key)}]`;
			const childPath = pathExpr ? `${pathExpr}+'/${esc(key)}'` : `'/${esc(key)}'`;
			if (requiredSet.has(key) && isObj) {
				lines.push(`if(${pv}!==undefined){`);
				genCodeC(prop, pv, childPath, lines, ctx);
				lines.push(`}`);
			} else if (isObj) {
				const oi = ctx.varCounter++;
				lines.push(`{const _o${oi}=${v}[${JSON.stringify(key)}];if(_o${oi}!==undefined){`);
				genCodeC(prop, `_o${oi}`, childPath, lines, ctx);
				lines.push(`}}`);
			} else {
				lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
				genCodeC(prop, `${v}[${JSON.stringify(key)}]`, childPath, lines, ctx);
				lines.push(`}`);
			}
		}
		if (schema.patternProperties) {
			const ppEntries = Object.entries(schema.patternProperties);
			const pn = schema.propertyNames && typeof schema.propertyNames === "object" ? schema.propertyNames : null;
			const pi = ctx.varCounter++;
			const matchers = [];
			for (const [pat] of ppEntries) {
				const fast = fastPrefixCheck(pat, `_k${pi}`);
				if (fast) matchers.push({ check: fast });
				else {
					const ri = ctx.varCounter++;
					ctx.closureVars.push(`_re${ri}`);
					ctx.closureVals.push(new RegExp(pat));
					matchers.push({ check: `_re${ri}.test(_k${pi})` });
				}
			}
			for (let i = 0; i < ppEntries.length; i++) {
				const [, sub] = ppEntries[i];
				const subLines = [];
				genCode(sub, `_ppv`, subLines, ctx);
				const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
				const fnVar = `_ppf${pi}_${i}`;
				ctx.closureVars.push(fnVar);
				ctx.closureVals.push(new Function("_ppv", fnBody));
			}
			const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
			const kVar = `_k${pi}`;
			if (schema.additionalProperties === false && schema.properties) {
				ctx._ppHandledPropertyNamesC = !!pn;
				const propKeys = Object.keys(schema.properties);
				const keyCheck = propKeys.length <= 8 ? propKeys.map((k) => `${kVar}===${JSON.stringify(k)}`).join("||") : null;
				if (!keyCheck) {
					const allowedSet = `_as${pi}`;
					ctx.closureVars.push(allowedSet);
					ctx.closureVals.push(new Set(propKeys));
				}
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength}){${fail("min_length_violation", `'propertyNames: key too short: '+${kVar}`)}}`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength}){${fail("max_length_violation", `'propertyNames: key too long: '+${kVar}`)}}`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast})){${fail("pattern_mismatch", `'propertyNames: pattern mismatch: '+${kVar}`)}}`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(new RegExp(pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar})){${fail("pattern_mismatch", `'propertyNames: pattern mismatch: '+${kVar}`)}}`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)}){${fail("const_mismatch", `'propertyNames: expected '+${JSON.stringify(pn.const)}`)}}`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar})){${fail("enum_mismatch", `'propertyNames: key not in enum: '+${kVar}`)}}`);
					}
				}
				const matchExpr = keyCheck || `_as${pi}.has(${kVar})`;
				lines.push(`let _m${pi}=${matchExpr}`);
				for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}){_m${pi}=true;if(!_ppf${pi}_${i}(${v}[${kVar}])){${fail("pattern_mismatch", `'patternProperties: value invalid for key '+${kVar}`)}}}`);
				lines.push(`if(!_m${pi}){${fail("additional_property", `'extra: '+${kVar}`)}}`);
				lines.push(`}}`);
			} else {
				ctx._ppHandledPropertyNamesC = !!pn;
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength}){${fail("min_length_violation", `'propertyNames: key too short: '+${kVar}`)}}`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength}){${fail("max_length_violation", `'propertyNames: key too long: '+${kVar}`)}}`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast})){${fail("pattern_mismatch", `'propertyNames: pattern mismatch: '+${kVar}`)}}`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(new RegExp(pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar})){${fail("pattern_mismatch", `'propertyNames: pattern mismatch: '+${kVar}`)}}`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)}){${fail("const_mismatch", `'propertyNames: expected '+${JSON.stringify(pn.const)}`)}}`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar})){${fail("enum_mismatch", `'propertyNames: key not in enum: '+${kVar}`)}}`);
					}
				}
				for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}&&!_ppf${pi}_${i}(${v}[${kVar}])){${fail("pattern_mismatch", `'patternProperties: value invalid for key '+${kVar}`)}}`);
				lines.push(`}}`);
			}
		}
		if (schema.dependentSchemas) for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeC(depSchema, v, pathExpr, lines, ctx);
			lines.push(`}`);
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !ctx._ppHandledPropertyNamesC) {
			const pn = schema.propertyNames;
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){`);
			if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength}){${fail("min_length_violation", `'propertyNames: key too short: '+_k${ki}`)}}`);
			if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength}){${fail("max_length_violation", `'propertyNames: key too long: '+_k${ki}`)}}`);
			if (pn.pattern) {
				const ri = ctx.varCounter++;
				ctx.closureVars.push(`_re${ri}`);
				ctx.closureVals.push(new RegExp(pn.pattern));
				lines.push(`if(!_re${ri}.test(_k${ki})){${fail("pattern_mismatch", `'propertyNames: pattern mismatch: '+_k${ki}`)}}`);
			}
			if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)}){${fail("const_mismatch", `'propertyNames: expected '+${JSON.stringify(pn.const)}`)}}`);
			if (pn.enum) {
				const ei = ctx.varCounter++;
				ctx.closureVars.push(`_es${ei}`);
				ctx.closureVals.push(new Set(pn.enum));
				lines.push(`if(!_es${ei}.has(_k${ki})){${fail("enum_mismatch", `'propertyNames: key not in enum: '+_k${ki}`)}}`);
			}
			lines.push(`}}`);
		}
		if (schema.items) {
			const startIdx = schema.prefixItems ? schema.prefixItems.length : 0;
			const idx = `_j${ctx.varCounter}`, elem = `_ei${ctx.varCounter}`;
			ctx.varCounter++;
			const childPath = pathExpr ? `${pathExpr}+'/'+${idx}` : `'/'+${idx}`;
			lines.push(`if(Array.isArray(${v})){for(let ${idx}=${startIdx};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCodeC(schema.items, elem, childPath, lines, ctx);
			lines.push(`}}`);
		}
		if (schema.prefixItems) for (let i = 0; i < schema.prefixItems.length; i++) {
			const childPath = pathExpr ? `${pathExpr}+'/${i}'` : `'/${i}'`;
			lines.push(`if(Array.isArray(${v})&&${v}.length>${i}){`);
			genCodeC(schema.prefixItems[i], `${v}[${i}]`, childPath, lines, ctx);
			lines.push(`}`);
		}
		if (schema.contains) {
			const ci = ctx.varCounter++;
			const subLines = [];
			genCode(schema.contains, `_cv`, subLines, ctx);
			const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
			const minC = schema.minContains !== void 0 ? schema.minContains : 1;
			const maxC = schema.maxContains;
			lines.push(`if(Array.isArray(${v})){const _cf${ci}=function(_cv){${fnBody}};let _cc${ci}=0;for(let _ci${ci}=0;_ci${ci}<${v}.length;_ci${ci}++){if(_cf${ci}(${v}[_ci${ci}]))_cc${ci}++}`);
			lines.push(`if(_cc${ci}<${minC}){${fail("contains_violation", `'need ${minC}+ matches'`)}}`);
			if (maxC !== void 0) lines.push(`if(_cc${ci}>${maxC}){${fail("contains_violation", `'max ${maxC} matches'`)}}`);
			lines.push(`}`);
		}
		if (schema.allOf) for (const sub of schema.allOf) genCodeC(sub, v, pathExpr, lines, ctx);
		if (schema.anyOf) {
			const fi = ctx.varCounter++;
			const fns = schema.anyOf.map((sub) => {
				const sl = [];
				genCode(sub, "_av", sl, ctx);
				return sl.length === 0 ? `function(_av){return true}` : `function(_av){${sl.join(";")};return true}`;
			});
			lines.push(`{const _af${fi}=[${fns.join(",")}];let _am=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am=true;break}}if(!_am){${fail("any_of_failed", "'no match'")}}}`);
		}
		if (schema.oneOf) {
			const fi = ctx.varCounter++;
			const fns = schema.oneOf.map((sub) => {
				const sl = [];
				genCode(sub, "_ov", sl, ctx);
				return sl.length === 0 ? `function(_ov){return true}` : `function(_ov){${sl.join(";")};return true}`;
			});
			lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc++;if(_oc>1)break}if(_oc!==1){${fail("one_of_failed", "'need exactly 1'")}}}`);
		}
		if (schema.not) {
			const sl = [];
			genCode(schema.not, "_nv", sl, ctx);
			const nfn = sl.length === 0 ? `function(_nv){return true}` : `function(_nv){${sl.join(";")};return true}`;
			const fi = ctx.varCounter++;
			lines.push(`{const _nf${fi}=${nfn};if(_nf${fi}(${v})){${fail("not_failed", "'should not match'")}}}`);
		}
		if (schema.if) {
			const sl = [];
			genCode(schema.if, "_iv", sl, ctx);
			const fi = ctx.varCounter++;
			const ifFn = sl.length === 0 ? `function(_iv){return true}` : `function(_iv){${sl.join(";")};return true}`;
			lines.push(`{const _if${fi}=${ifFn}`);
			if (schema.then) {
				lines.push(`if(_if${fi}(${v})){`);
				genCodeC(schema.then, v, pathExpr, lines, ctx);
				lines.push(`}`);
			}
			if (schema.else) {
				lines.push(`${schema.then ? "else" : `if(!_if${fi}(${v}))`}{`);
				genCodeC(schema.else, v, pathExpr, lines, ctx);
				lines.push(`}`);
			}
			lines.push(`}`);
		}
		if (types) lines.push(`}`);
	}
	module.exports = {
		compileToJS,
		compileToJSCodegen,
		compileToJSCodegenWithErrors,
		compileToJSCombined
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@0.5.0/node_modules/ata-validator/lib/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DRAFT7_SCHEMAS = new Set(["http://json-schema.org/draft-07/schema#", "http://json-schema.org/draft-07/schema"]);
	function isDraft7(schema) {
		return !!(schema && schema.$schema && DRAFT7_SCHEMAS.has(schema.$schema));
	}
	function normalizeDraft7(schema) {
		if (!isDraft7(schema)) return schema;
		_normalize(schema);
		return schema;
	}
	function _normalize(schema) {
		if (typeof schema !== "object" || schema === null) return;
		if (schema.definitions && !schema.$defs) {
			schema.$defs = schema.definitions;
			delete schema.definitions;
		}
		if (schema.dependencies) {
			for (const [key, value] of Object.entries(schema.dependencies)) if (Array.isArray(value)) {
				if (!schema.dependentRequired) schema.dependentRequired = {};
				schema.dependentRequired[key] = value;
			} else {
				if (!schema.dependentSchemas) schema.dependentSchemas = {};
				schema.dependentSchemas[key] = value;
			}
			delete schema.dependencies;
		}
		if (Array.isArray(schema.items)) {
			schema.prefixItems = schema.items;
			if (schema.additionalItems !== void 0) {
				schema.items = schema.additionalItems;
				delete schema.additionalItems;
			} else delete schema.items;
		}
		for (const key of [
			"properties",
			"patternProperties",
			"$defs",
			"definitions",
			"dependentSchemas"
		]) if (schema[key] && typeof schema[key] === "object") {
			for (const v of Object.values(schema[key])) if (typeof v === "object" && v !== null) _normalize(v);
		}
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]) if (Array.isArray(schema[key])) {
			for (const s of schema[key]) if (typeof s === "object" && s !== null) _normalize(s);
		}
		for (const key of [
			"items",
			"contains",
			"not",
			"if",
			"then",
			"else",
			"additionalProperties",
			"propertyNames"
		]) if (typeof schema[key] === "object" && schema[key] !== null) _normalize(schema[key]);
	}
	module.exports = {
		isDraft7,
		normalizeDraft7
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@0.5.0/node_modules/ata-validator/index.js
var require_ata_validator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const native = require_node_gyp_build()(__dirname);
	const { compileToJS, compileToJSCodegen, compileToJSCodegenWithErrors, compileToJSCombined } = require_js_compiler();
	const { normalizeDraft7 } = require_draft7();
	function buildDefaultsApplier(schema) {
		if (typeof schema !== "object" || schema === null) return null;
		const actions = [];
		collectDefaults(schema, actions);
		if (actions.length === 0) return null;
		return (data) => {
			for (let i = 0; i < actions.length; i++) actions[i](data);
		};
	}
	function collectDefaults(schema, actions, path) {
		if (typeof schema !== "object" || schema === null) return;
		const props = schema.properties;
		if (!props) return;
		for (const [key, prop] of Object.entries(props)) {
			if (prop && typeof prop === "object" && prop.default !== void 0) {
				const defaultVal = prop.default;
				if (!path) actions.push((data) => {
					if (typeof data === "object" && data !== null && !(key in data)) data[key] = typeof defaultVal === "object" && defaultVal !== null ? JSON.parse(JSON.stringify(defaultVal)) : defaultVal;
				});
				else {
					const parentPath = path;
					actions.push((data) => {
						let target = data;
						for (let j = 0; j < parentPath.length; j++) {
							if (typeof target !== "object" || target === null) return;
							target = target[parentPath[j]];
						}
						if (typeof target === "object" && target !== null && !(key in target)) target[key] = typeof defaultVal === "object" && defaultVal !== null ? JSON.parse(JSON.stringify(defaultVal)) : defaultVal;
					});
				}
			}
			if (prop && typeof prop === "object" && prop.properties) collectDefaults(prop, actions, (path || []).concat(key));
		}
	}
	function buildCoercer(schema) {
		if (typeof schema !== "object" || schema === null) return null;
		const actions = [];
		collectCoercions(schema, actions);
		if (actions.length === 0) return null;
		return (data) => {
			for (let i = 0; i < actions.length; i++) actions[i](data);
		};
	}
	function collectCoercions(schema, actions, path) {
		if (typeof schema !== "object" || schema === null) return;
		const props = schema.properties;
		if (!props) return;
		for (const [key, prop] of Object.entries(props)) {
			if (!prop || typeof prop !== "object" || !prop.type) continue;
			const targetType = Array.isArray(prop.type) ? null : prop.type;
			if (!targetType) continue;
			const coerce = buildSingleCoercion(targetType);
			if (!coerce) continue;
			if (!path) actions.push((data) => {
				if (typeof data === "object" && data !== null && key in data) {
					const coerced = coerce(data[key]);
					if (coerced !== void 0) data[key] = coerced;
				}
			});
			else {
				const parentPath = path;
				actions.push((data) => {
					let target = data;
					for (let j = 0; j < parentPath.length; j++) {
						if (typeof target !== "object" || target === null) return;
						target = target[parentPath[j]];
					}
					if (typeof target === "object" && target !== null && key in target) {
						const coerced = coerce(target[key]);
						if (coerced !== void 0) target[key] = coerced;
					}
				});
			}
			if (prop.properties) collectCoercions(prop, actions, (path || []).concat(key));
		}
	}
	function buildSingleCoercion(targetType) {
		switch (targetType) {
			case "number": return (v) => {
				if (typeof v === "string") {
					const n = Number(v);
					if (v !== "" && !isNaN(n)) return n;
				}
				if (typeof v === "boolean") return v ? 1 : 0;
			};
			case "integer": return (v) => {
				if (typeof v === "string") {
					const n = Number(v);
					if (v !== "" && Number.isInteger(n)) return n;
				}
				if (typeof v === "boolean") return v ? 1 : 0;
			};
			case "string": return (v) => {
				if (typeof v === "number" || typeof v === "boolean") return String(v);
			};
			case "boolean": return (v) => {
				if (v === "true" || v === "1") return true;
				if (v === "false" || v === "0") return false;
			};
			default: return null;
		}
	}
	function buildRemover(schema) {
		if (typeof schema !== "object" || schema === null) return null;
		const actions = [];
		collectRemovals(schema, actions);
		if (actions.length === 0) return null;
		return (data) => {
			for (let i = 0; i < actions.length; i++) actions[i](data);
		};
	}
	function collectRemovals(schema, actions, path) {
		if (typeof schema !== "object" || schema === null || !schema.properties) return;
		if (schema.additionalProperties === false) {
			const allowed = new Set(Object.keys(schema.properties));
			if (!path) actions.push((data) => {
				if (typeof data !== "object" || data === null || Array.isArray(data)) return;
				const keys = Object.keys(data);
				for (let i = 0; i < keys.length; i++) if (!allowed.has(keys[i])) delete data[keys[i]];
			});
			else {
				const parentPath = path;
				actions.push((data) => {
					let target = data;
					for (let j = 0; j < parentPath.length; j++) {
						if (typeof target !== "object" || target === null) return;
						target = target[parentPath[j]];
					}
					if (typeof target !== "object" || target === null || Array.isArray(target)) return;
					const keys = Object.keys(target);
					for (let i = 0; i < keys.length; i++) if (!allowed.has(keys[i])) delete target[keys[i]];
				});
			}
		}
		for (const [key, prop] of Object.entries(schema.properties)) if (prop && typeof prop === "object" && prop.properties) collectRemovals(prop, actions, (path || []).concat(key));
	}
	function buildPreprocessCodegen(schema, options) {
		if (typeof schema !== "object" || schema === null || !schema.properties) return null;
		const lines = [];
		const props = schema.properties;
		const keys = Object.keys(props);
		if (options.removeAdditional && schema.additionalProperties === false) {
			const checks = keys.map((k) => `_k!==${JSON.stringify(k)}`).join("&&");
			lines.push(`for(var _k in d)if(${checks})delete d[_k]`);
		}
		if (options.coerceTypes) for (const [key, prop] of Object.entries(props)) {
			if (!prop || typeof prop !== "object" || !prop.type) continue;
			const t = Array.isArray(prop.type) ? null : prop.type;
			if (!t) continue;
			const k = JSON.stringify(key);
			if (t === "integer") {
				lines.push(`if(typeof d[${k}]==='string'){var _n=Number(d[${k}]);if(d[${k}]!==''&&Number.isInteger(_n))d[${k}]=_n}`);
				lines.push(`if(typeof d[${k}]==='boolean')d[${k}]=d[${k}]?1:0`);
			} else if (t === "number") {
				lines.push(`if(typeof d[${k}]==='string'){var _n=Number(d[${k}]);if(d[${k}]!==''&&!isNaN(_n))d[${k}]=_n}`);
				lines.push(`if(typeof d[${k}]==='boolean')d[${k}]=d[${k}]?1:0`);
			} else if (t === "string") lines.push(`if(typeof d[${k}]==='number'||typeof d[${k}]==='boolean')d[${k}]=String(d[${k}])`);
			else if (t === "boolean") {
				lines.push(`if(d[${k}]==='true'||d[${k}]==='1')d[${k}]=true`);
				lines.push(`if(d[${k}]==='false'||d[${k}]==='0')d[${k}]=false`);
			}
		}
		for (const [key, prop] of Object.entries(props)) if (prop && typeof prop === "object" && prop.default !== void 0) {
			const k = JSON.stringify(key);
			const def = JSON.stringify(prop.default);
			lines.push(`if(!(${k} in d))d[${k}]=${def}`);
		}
		if (lines.length === 0) return null;
		try {
			return new Function("d", lines.join("\n"));
		} catch {
			return null;
		}
	}
	const _compileCache = /* @__PURE__ */ new Map();
	const SIMDJSON_PADDING = 64;
	const VALID_RESULT = Object.freeze({
		valid: true,
		errors: Object.freeze([])
	});
	const SIMDJSON_THRESHOLD = 8192;
	function parsePointerPath(path) {
		if (!path) return [];
		return path.split("/").filter(Boolean).map((seg) => ({ key: seg.replace(/~1/g, "/").replace(/~0/g, "~") }));
	}
	function createPaddedBuffer(jsonStr) {
		const jsonBuf = Buffer.from(jsonStr);
		const padded = Buffer.allocUnsafe(jsonBuf.length + SIMDJSON_PADDING);
		jsonBuf.copy(padded);
		padded.fill(0, jsonBuf.length);
		return {
			buffer: padded,
			length: jsonBuf.length
		};
	}
	function buildSchemaMap(schemas) {
		if (!schemas) return null;
		const map = /* @__PURE__ */ new Map();
		if (Array.isArray(schemas)) for (const s of schemas) {
			normalizeDraft7(s);
			const id = s.$id;
			if (!id) throw new Error("Schema in schemas option must have $id");
			map.set(id, s);
		}
		else for (const [key, s] of Object.entries(schemas)) {
			normalizeDraft7(s);
			map.set(s.$id || key, s);
		}
		return map;
	}
	var Validator = class Validator {
		constructor(schema, opts) {
			const options = opts || {};
			const schemaObj = typeof schema === "string" ? JSON.parse(schema) : schema;
			normalizeDraft7(schemaObj);
			this._schemaStr = JSON.stringify(schemaObj);
			this._schemaObj = schemaObj;
			this._options = options;
			this._initialized = false;
			this._nativeReady = false;
			this._compiled = null;
			this._fastSlot = -1;
			this._jsFn = null;
			this._preprocess = null;
			this._applyDefaults = null;
			this._schemaMap = buildSchemaMap(options.schemas) || /* @__PURE__ */ new Map();
			this.validate = (data) => {
				this._ensureCompiled();
				return this.validate(data);
			};
			this.isValidObject = (data) => {
				this._ensureCodegen();
				return this.isValidObject(data);
			};
			this.validateJSON = (jsonStr) => {
				this._ensureCompiled();
				return this.validateJSON(jsonStr);
			};
			this.isValidJSON = (jsonStr) => {
				this._ensureCompiled();
				return this.isValidJSON(jsonStr);
			};
			const self = this;
			Object.defineProperty(this, "~standard", {
				value: Object.freeze({
					version: 1,
					vendor: "ata-validator",
					validate(value) {
						const result = self.validate(value);
						if (result.valid) return { value };
						return { issues: result.errors.map((err) => ({
							message: err.message,
							path: parsePointerPath(err.path)
						})) };
					}
				}),
				writable: false,
				enumerable: false,
				configurable: false
			});
		}
		_ensureCompiled() {
			if (this._initialized) return;
			this._initialized = true;
			const schemaObj = this._schemaObj;
			const options = this._options;
			const sm = this._schemaMap.size > 0 ? this._schemaMap : null;
			const mapKey = this._schemaMap.size > 0 ? this._schemaStr + "\0" + [...this._schemaMap.keys()].sort().join("\0") : this._schemaStr;
			const cached = _compileCache.get(mapKey);
			let jsFn, jsCombinedFn, jsErrFn;
			if (cached && !process.env.ATA_FORCE_NAPI) {
				jsFn = cached.jsFn;
				jsCombinedFn = cached.combined;
				jsErrFn = cached.errFn;
			} else if (!process.env.ATA_FORCE_NAPI) {
				jsFn = compileToJSCodegen(schemaObj, sm) || compileToJS(schemaObj, null, sm);
				jsCombinedFn = compileToJSCombined(schemaObj, VALID_RESULT, sm);
				jsErrFn = compileToJSCodegenWithErrors(schemaObj, sm);
				_compileCache.set(mapKey, {
					jsFn,
					combined: jsCombinedFn,
					errFn: jsErrFn
				});
			} else {
				jsFn = null;
				jsCombinedFn = null;
				jsErrFn = null;
			}
			this._jsFn = jsFn;
			let preprocess = buildPreprocessCodegen(schemaObj, options);
			if (!preprocess) {
				const applyDefaults = buildDefaultsApplier(schemaObj);
				const applyCoerce = options.coerceTypes ? buildCoercer(schemaObj) : null;
				const mutators = [
					options.removeAdditional ? buildRemover(schemaObj) : null,
					applyCoerce,
					applyDefaults
				].filter(Boolean);
				preprocess = mutators.length === 0 ? null : mutators.length === 1 ? mutators[0] : (data) => {
					for (let i = 0; i < mutators.length; i++) mutators[i](data);
				};
			}
			this._applyDefaults = preprocess;
			this._preprocess = preprocess;
			const useSimdjsonForLarge = !(schemaObj && (schemaObj.items || schemaObj.prefixItems || schemaObj.contains || schemaObj.properties && Object.values(schemaObj.properties).some((p) => p && (p.items || p.prefixItems || p.contains))));
			if (jsFn) {
				let safeErrFn = null;
				if (jsErrFn) try {
					jsErrFn({}, true);
					safeErrFn = (d) => jsErrFn(d, true);
				} catch {}
				const errFn = safeErrFn || ((d) => {
					this._ensureNative();
					return this._compiled.validate(d);
				});
				let safeCombinedFn = null;
				if (jsCombinedFn) try {
					const probe = {};
					if (schemaObj && schemaObj.properties) for (const k of Object.keys(schemaObj.properties)) probe[k] = "";
					if (schemaObj && schemaObj.if && schemaObj.if.properties) for (const k of Object.keys(schemaObj.if.properties)) probe[k] = "";
					jsCombinedFn(probe);
					jsCombinedFn({});
					jsCombinedFn(null);
					jsCombinedFn(0);
					safeCombinedFn = jsCombinedFn;
				} catch {}
				if (safeCombinedFn && jsFn) this.validate = preprocess ? (data) => {
					preprocess(data);
					return jsFn(data) ? VALID_RESULT : safeCombinedFn(data);
				} : (data) => jsFn(data) ? VALID_RESULT : safeCombinedFn(data);
				else if (safeCombinedFn) this.validate = preprocess ? (data) => {
					preprocess(data);
					return safeCombinedFn(data);
				} : safeCombinedFn;
				else {
					const hybridFn = jsFn._hybridFactory ? jsFn._hybridFactory(VALID_RESULT, errFn) : null;
					this.validate = hybridFn ? preprocess ? (data) => {
						preprocess(data);
						return hybridFn(data);
					} : hybridFn : preprocess ? (data) => {
						preprocess(data);
						return jsFn(data) ? VALID_RESULT : errFn(data);
					} : (data) => jsFn(data) ? VALID_RESULT : errFn(data);
				}
				this.isValidObject = jsFn;
				const hybridFn = jsFn._hybridFactory ? jsFn._hybridFactory(VALID_RESULT, errFn) : null;
				const jsonValidateFn = safeCombinedFn || hybridFn || ((obj) => jsFn(obj) ? VALID_RESULT : errFn(obj));
				this.validateJSON = useSimdjsonForLarge ? (jsonStr) => {
					if (jsonStr.length >= SIMDJSON_THRESHOLD) {
						this._ensureNative();
						const buf = Buffer.from(jsonStr);
						if (native.rawFastValidate(this._fastSlot, buf)) return VALID_RESULT;
						return this._compiled.validateJSON(jsonStr);
					}
					try {
						return jsonValidateFn(JSON.parse(jsonStr));
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
					}
					this._ensureNative();
					return this._compiled.validateJSON(jsonStr);
				} : (jsonStr) => {
					try {
						return jsonValidateFn(JSON.parse(jsonStr));
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
					}
					this._ensureNative();
					return this._compiled.validateJSON(jsonStr);
				};
				this.isValidJSON = useSimdjsonForLarge ? (jsonStr) => {
					if (jsonStr.length >= SIMDJSON_THRESHOLD) {
						this._ensureNative();
						return native.rawFastValidate(this._fastSlot, Buffer.from(jsonStr));
					}
					try {
						return jsFn(JSON.parse(jsonStr));
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
						return false;
					}
				} : (jsonStr) => {
					try {
						return jsFn(JSON.parse(jsonStr));
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
						return false;
					}
				};
			} else {
				this._ensureNative();
				this.validate = preprocess ? (data) => {
					preprocess(data);
					return this._compiled.validate(data);
				} : (data) => this._compiled.validate(data);
				this.isValidObject = (data) => this._compiled.validate(data).valid;
				this.validateJSON = (jsonStr) => this._compiled.validateJSON(jsonStr);
				this.isValidJSON = (jsonStr) => this._compiled.isValidJSON(jsonStr);
			}
		}
		_ensureNative() {
			if (this._nativeReady) return;
			this._nativeReady = true;
			let nativeSchemaStr = this._schemaStr;
			if (this._schemaMap.size > 0) {
				const merged = JSON.parse(this._schemaStr);
				if (!merged.$defs) merged.$defs = {};
				for (const [id, s] of this._schemaMap) merged.$defs["__ext_" + id.replace(/[^a-zA-Z0-9]/g, "_")] = s;
				nativeSchemaStr = JSON.stringify(merged);
			}
			this._compiled = new native.CompiledSchema(nativeSchemaStr);
			this._fastSlot = native.fastRegister(nativeSchemaStr);
		}
		addSchema(schema) {
			if (this._initialized) throw new Error("Cannot add schema after compilation — call addSchema() before validate()");
			if (!schema || !schema.$id) throw new Error("Schema must have $id");
			normalizeDraft7(schema);
			this._schemaMap.set(schema.$id, schema);
		}
		_ensureCodegen() {
			if (this._jsFn) return;
			if (process.env.ATA_FORCE_NAPI) return;
			const sm = this._schemaMap.size > 0 ? this._schemaMap : null;
			const mapKey = this._schemaMap.size > 0 ? this._schemaStr + "\0" + [...this._schemaMap.keys()].sort().join("\0") : this._schemaStr;
			const cached = _compileCache.get(mapKey);
			if (cached && cached.jsFn) {
				this._jsFn = cached.jsFn;
				this.isValidObject = cached.jsFn;
				return;
			}
			const jsFn = compileToJSCodegen(this._schemaObj, sm) || compileToJS(this._schemaObj, null, sm);
			this._jsFn = jsFn;
			if (jsFn) {
				this.isValidObject = jsFn;
				if (!cached) _compileCache.set(mapKey, {
					jsFn,
					combined: null,
					errFn: null
				});
				else cached.jsFn = jsFn;
			}
		}
		toStandalone() {
			this._ensureCompiled();
			const jsFn = this._jsFn;
			if (!jsFn || !jsFn._source) return null;
			const src = jsFn._source;
			const hybridSrc = jsFn._hybridSource || "";
			const jsErrFn = compileToJSCodegenWithErrors(typeof this._schemaObj === "object" ? this._schemaObj : {});
			const errSrc = jsErrFn && jsErrFn._errSource ? jsErrFn._errSource : "";
			return `// Auto-generated by ata-validator — do not edit
'use strict';
const boolFn = function(d) {
  ${src}
};
const hybridFactory = function(R, E) {
  return function(d) {
    ${hybridSrc}
  };
};
${errSrc ? `const errFn = function(d, _all) {\n  ${errSrc}\n};` : "const errFn = null;"}
module.exports = { boolFn, hybridFactory, errFn };
`;
		}
		static fromStandalone(mod, schema, opts) {
			const options = opts || {};
			const schemaObj = typeof schema === "string" ? JSON.parse(schema) : schema;
			const v = Object.create(Validator.prototype);
			v._jsFn = mod.boolFn;
			v._compiled = null;
			v._fastSlot = -1;
			const applyDefaults = buildDefaultsApplier(schemaObj);
			const applyCoerce = options.coerceTypes ? buildCoercer(schemaObj) : null;
			const mutators = [
				options.removeAdditional ? buildRemover(schemaObj) : null,
				applyCoerce,
				applyDefaults
			].filter(Boolean);
			const preprocess = mutators.length === 0 ? null : mutators.length === 1 ? mutators[0] : (data) => {
				for (let i = 0; i < mutators.length; i++) mutators[i](data);
			};
			v._preprocess = preprocess;
			let errFn = (d) => ({
				valid: false,
				errors: [{
					code: "validation_failed",
					path: "",
					message: "validation failed"
				}]
			});
			if (mod.errFn) errFn = (d) => mod.errFn(d, true);
			else {
				const jsErrFn = compileToJSCodegenWithErrors(schemaObj);
				if (jsErrFn) try {
					jsErrFn({}, true);
					errFn = (d) => jsErrFn(d, true);
				} catch {}
			}
			const hybridFn = mod.hybridFactory ? mod.hybridFactory(VALID_RESULT, errFn) : null;
			v.validate = hybridFn ? preprocess ? (data) => {
				preprocess(data);
				return hybridFn(data);
			} : hybridFn : preprocess ? (data) => {
				preprocess(data);
				return mod.boolFn(data) ? VALID_RESULT : errFn(data);
			} : (data) => mod.boolFn(data) ? VALID_RESULT : errFn(data);
			v.isValidObject = mod.boolFn;
			v.isValidJSON = (jsonStr) => {
				try {
					return mod.boolFn(JSON.parse(jsonStr));
				} catch {
					return false;
				}
			};
			v.validateJSON = (jsonStr) => {
				try {
					const obj = JSON.parse(jsonStr);
					return hybridFn ? hybridFn(obj) : mod.boolFn(obj) ? VALID_RESULT : errFn(obj);
				} catch {
					return {
						valid: false,
						errors: [{
							code: "invalid_json",
							path: "",
							message: "invalid JSON"
						}]
					};
				}
			};
			Object.defineProperty(v, "~standard", {
				value: Object.freeze({
					version: 1,
					vendor: "ata-validator",
					validate(value) {
						const result = v.validate(value);
						if (result.valid) return { value };
						return { issues: result.errors.map((e) => ({
							message: e.message,
							path: parsePointerPath(e.path)
						})) };
					}
				}),
				writable: false,
				enumerable: false,
				configurable: false
			});
			return v;
		}
		isValid(input) {
			this._ensureNative();
			return native.rawFastValidate(this._fastSlot, input);
		}
		isValidPrepadded(paddedBuffer, jsonLength) {
			this._ensureNative();
			return native.rawFastValidate(this._fastSlot, paddedBuffer, jsonLength);
		}
		isValidParallel(buffer) {
			this._ensureNative();
			return native.rawParallelValidate(this._fastSlot, buffer);
		}
		countValid(buffer) {
			this._ensureNative();
			return native.rawParallelCount(this._fastSlot, buffer);
		}
		isValidNDJSON(buffer) {
			this._ensureNative();
			return native.rawNDJSONValidate(this._fastSlot, buffer);
		}
	};
	function validate(schema, data) {
		const schemaStr = typeof schema === "string" ? schema : JSON.stringify(schema);
		return native.validate(schemaStr, data);
	}
	function version() {
		return native.version();
	}
	Validator.bundle = function(schemas, opts) {
		return "'use strict';\nmodule.exports = [\n" + schemas.map((schema) => {
			const standalone = new Validator(schema, opts).toStandalone();
			if (!standalone) return "null";
			return "(function(){" + standalone.replace("'use strict';", "").replace("module.exports = ", "return ") + "})()";
		}).join(",\n") + "\n];\n";
	};
	Validator.bundleStandalone = function(schemas, opts) {
		return `'use strict';\nvar R=Object.freeze({valid:true,errors:Object.freeze([])});\nmodule.exports=[${schemas.map((schema) => {
			const v = new Validator(schema, opts);
			v._ensureCompiled();
			const jsFn = v._jsFn;
			if (!jsFn || !jsFn._hybridSource) return "null";
			const jsErrFn = compileToJSCodegenWithErrors(typeof schema === "string" ? JSON.parse(schema) : schema);
			return `(function(R){var E=function(d){var _all=true;${jsErrFn && jsErrFn._errSource ? jsErrFn._errSource : "return{valid:false,errors:[{code:'error',path:'',message:'validation failed'}]}"}};return function(d){${jsFn._hybridSource}}})(R)`;
		}).join(",")}];\n`;
	};
	Validator.bundleCompact = function(schemas, opts) {
		const entries = schemas.map((schema) => {
			const v = new Validator(schema, opts);
			v._ensureCompiled();
			const jsFn = v._jsFn;
			if (!jsFn || !jsFn._hybridSource) return null;
			const jsErrFn = compileToJSCodegenWithErrors(typeof schema === "string" ? JSON.parse(schema) : schema);
			return {
				hybrid: jsFn._hybridSource,
				err: jsErrFn && jsErrFn._errSource ? jsErrFn._errSource : null
			};
		});
		const bodyMap = /* @__PURE__ */ new Map();
		const bodies = [];
		const errMap = /* @__PURE__ */ new Map();
		const errBodies = [];
		const indices = entries.map((e) => {
			if (!e) return [-1, -1];
			let hi = bodyMap.get(e.hybrid);
			if (hi === void 0) {
				hi = bodies.length;
				bodies.push(e.hybrid);
				bodyMap.set(e.hybrid, hi);
			}
			let ei = -1;
			if (e.err) {
				ei = errMap.get(e.err);
				if (ei === void 0) {
					ei = errBodies.length;
					errBodies.push(e.err);
					errMap.set(e.err, ei);
				}
			}
			return [hi, ei];
		});
		let out = "'use strict';\n";
		out += "var R=Object.freeze({valid:true,errors:Object.freeze([])});\n";
		out += "var H=[\n";
		out += bodies.map((b) => `function(R,E){return function(d){${b}}}`).join(",\n");
		out += "\n];\n";
		out += "var EF=[\n";
		out += errBodies.map((b) => `function(d){var _all=true;${b}}`).join(",\n");
		out += "\n];\n";
		out += "module.exports=[";
		out += indices.map(([hi, ei]) => {
			if (hi < 0) return "null";
			if (ei >= 0) return `H[${hi}](R,EF[${ei}])`;
			return `H[${hi}](R,function(){return{valid:false,errors:[]}})`;
		}).join(",");
		out += "];\n";
		return out;
	};
	Validator.loadBundle = function(mods, schemas, opts) {
		return schemas.map((schema, i) => {
			if (mods[i]) return Validator.fromStandalone(mods[i], schema, opts);
			return new Validator(schema, opts);
		});
	};
	module.exports = {
		Validator,
		validate,
		version,
		createPaddedBuffer,
		SIMDJSON_PADDING
	};
}));
//#endregion
//#region ../schemas/libraries/ata-validator/download.ts
var import_keywords = require_keywords();
var import_ata_validator = require_ata_validator();
const dateSchema = {
	type: "object",
	instanceof: "Date",
	required: []
};
const imageSchema = {
	type: "object",
	properties: {
		id: { type: "number" },
		created: dateSchema,
		title: {
			type: "string",
			minLength: 1,
			maxLength: 100
		},
		type: {
			type: "string",
			enum: ["jpg", "png"]
		},
		size: { type: "number" },
		url: {
			type: "string",
			format: "url"
		}
	},
	required: [
		"id",
		"created",
		"title",
		"type",
		"size",
		"url"
	]
};
(0, import_keywords.withKeywords)(new import_ata_validator.Validator({
	type: "object",
	properties: {
		id: { type: "number" },
		created: dateSchema,
		title: {
			type: "string",
			minLength: 1,
			maxLength: 100
		},
		brand: {
			type: "string",
			minLength: 1,
			maxLength: 30
		},
		description: {
			type: "string",
			minLength: 1,
			maxLength: 500
		},
		price: {
			type: "number",
			minimum: 1,
			maximum: 1e4
		},
		discount: { oneOf: [{
			type: "number",
			minimum: 1,
			maximum: 100
		}, { type: "null" }] },
		quantity: {
			type: "number",
			minimum: 0,
			maximum: 10
		},
		tags: {
			type: "array",
			items: {
				type: "string",
				minLength: 1,
				maxLength: 30
			}
		},
		images: {
			type: "array",
			items: imageSchema
		},
		ratings: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "number" },
					stars: {
						type: "number",
						minimum: 0,
						maximum: 5
					},
					title: {
						type: "string",
						minLength: 1,
						maxLength: 100
					},
					text: {
						type: "string",
						minLength: 1,
						maxLength: 1e3
					},
					images: {
						type: "array",
						items: imageSchema
					}
				},
				required: [
					"id",
					"stars",
					"title",
					"text",
					"images"
				]
			}
		}
	},
	required: [
		"id",
		"created",
		"title",
		"brand",
		"description",
		"price",
		"discount",
		"quantity",
		"tags",
		"images",
		"ratings"
	]
})).validate({});
//#endregion
