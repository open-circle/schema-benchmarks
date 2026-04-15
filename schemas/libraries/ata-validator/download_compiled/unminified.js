//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region ../node_modules/.pnpm/@ata-project+keywords@0.1.8_ata-validator@0.9.3/node_modules/@ata-project/keywords/index.js
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
	function compileChecks(schema, path) {
		const checks = [];
		if (!schema || typeof schema !== "object" || !schema.properties) return checks;
		for (const [key, prop] of Object.entries(schema.properties)) {
			if (!prop || typeof prop !== "object") continue;
			const currentPath = path ? path + "/" + key : "/" + key;
			if (prop.instanceof) {
				const types = Array.isArray(prop.instanceof) ? prop.instanceof : [prop.instanceof];
				const ctors = types.map((t) => CONSTRUCTORS[t]).filter(Boolean);
				if (ctors.length > 0) {
					const frozenError = Object.freeze({
						keyword: "instanceof",
						instancePath: currentPath,
						schemaPath: "",
						params: Object.freeze({ expected: types.join(" | ") }),
						message: "expected instanceof " + types.join(" | ")
					});
					checks.push({
						key,
						ctors,
						type: "instanceof",
						error: frozenError
					});
				}
			}
			if (prop.typeof) {
				const types = Array.isArray(prop.typeof) ? prop.typeof : [prop.typeof];
				const frozenError = Object.freeze({
					keyword: "typeof",
					instancePath: currentPath,
					schemaPath: "",
					params: Object.freeze({ expected: types.join(" | ") }),
					message: "expected typeof " + types.join(" | ")
				});
				checks.push({
					key,
					types,
					type: "typeof",
					error: frozenError
				});
			}
			if (prop.properties) {
				const sub = compileChecks(prop, currentPath);
				if (sub.length > 0) checks.push({
					key,
					type: "nested",
					sub
				});
			}
		}
		return checks;
	}
	function runChecks(data, checks, errors) {
		for (let i = 0; i < checks.length; i++) {
			const c = checks[i];
			const val = data[c.key];
			if (val === void 0) continue;
			if (c.type === "instanceof") {
				let match = false;
				for (let j = 0; j < c.ctors.length; j++) if (val instanceof c.ctors[j]) {
					match = true;
					break;
				}
				if (!match) errors.push(c.error);
			} else if (c.type === "typeof") {
				let match = false;
				for (let j = 0; j < c.types.length; j++) if (typeof val === c.types[j]) {
					match = true;
					break;
				}
				if (!match) errors.push(c.error);
			} else if (c.type === "nested" && val && typeof val === "object" && !Array.isArray(val)) runChecks(val, c.sub, errors);
		}
	}
	function withKeywords(validator) {
		const schema = validator._schemaObj;
		const checks = compileChecks(schema, "");
		validator.validate({});
		const compiledValidate = validator.validate;
		if (checks.length === 0) return validator;
		validator.validate = function(data) {
			if (typeof data === "object" && data !== null && !Array.isArray(data)) {
				const errors = [];
				runChecks(data, checks, errors);
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
//#region (ignored) ../node_modules/.pnpm/ata-validator@0.9.3/node_modules/ata-validator
var require_ata_validator$1 = /* @__PURE__ */ __commonJSMin((() => {}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@0.9.3/node_modules/ata-validator/binding-options.js
var require_binding_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		name: "ata",
		napi_versions: [10]
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@0.9.3/node_modules/ata-validator/lib/js-compiler.js
var require_js_compiler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const AJV_MESSAGES = {
		type: (p) => `must be ${p.type}`,
		required: (p) => `must have required property '${p.missingProperty}'`,
		additionalProperties: () => "must NOT have additional properties",
		enum: () => "must be equal to one of the allowed values",
		const: () => "must be equal to constant",
		minimum: (p) => `must be >= ${p.limit}`,
		maximum: (p) => `must be <= ${p.limit}`,
		exclusiveMinimum: (p) => `must be > ${p.limit}`,
		exclusiveMaximum: (p) => `must be < ${p.limit}`,
		minLength: (p) => `must NOT have fewer than ${p.limit} characters`,
		maxLength: (p) => `must NOT have more than ${p.limit} characters`,
		pattern: (p) => `must match pattern "${p.pattern}"`,
		format: (p) => `must match format "${p.format}"`,
		minItems: (p) => `must NOT have fewer than ${p.limit} items`,
		maxItems: (p) => `must NOT have more than ${p.limit} items`,
		uniqueItems: (p) => `must NOT have duplicate items (items ## ${p.j} and ${p.i} are identical)`,
		minProperties: (p) => `must NOT have fewer than ${p.limit} properties`,
		maxProperties: (p) => `must NOT have more than ${p.limit} properties`,
		multipleOf: (p) => `must be multiple of ${p.multipleOf}`,
		oneOf: () => "must match exactly one schema in oneOf",
		anyOf: () => "must match a schema in anyOf",
		allOf: () => "must match all schemas in allOf",
		not: () => "must NOT be valid",
		if: (p) => `must match "${p.failingKeyword}" schema`
	};
	function compileToJS(schema, defs, schemaMap) {
		if (typeof schema === "boolean") return schema ? () => true : () => false;
		if (typeof schema !== "object" || schema === null) return null;
		if (!defs && !codegenSafe(schema, schemaMap)) {
			const str = JSON.stringify(schema);
			if (!str.includes("\"$dynamicRef\"") && !str.includes("\"$dynamicAnchor\"") && !str.includes("\"$anchor\"")) return null;
		}
		const rootDefs = defs || collectDefs(schema);
		if (schema.patternProperties || schema.dependentSchemas || schema.propertyNames) return null;
		const checks = [];
		if (schema.$ref) {
			const refFn = resolveRef(schema.$ref, rootDefs, schemaMap);
			if (!refFn) return null;
			checks.push(refFn);
		}
		if (schema.$dynamicRef) {
			const ref = schema.$dynamicRef;
			const anchorName = ref.startsWith("#") ? ref : "#" + ref;
			if (rootDefs && rootDefs[anchorName]) {
				const entry = rootDefs[anchorName];
				checks.push((d) => {
					const fn = entry.fn;
					return fn ? fn(d) : true;
				});
			} else {
				const m = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
				if (m && rootDefs && rootDefs[m[1]]) {
					const entry = rootDefs[m[1]];
					checks.push((d) => {
						const fn = entry.fn;
						return fn ? fn(d) : true;
					});
				}
			}
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
			if (def && typeof def === "object") {
				if (def.$anchor) {
					const anchorDef = def;
					let anchorCached = void 0;
					defs["#" + def.$anchor] = {
						get fn() {
							if (anchorCached === void 0) {
								anchorCached = null;
								anchorCached = compileToJS(anchorDef, defs);
							}
							return anchorCached || (() => true);
						},
						raw: anchorDef
					};
				}
				if (def.$dynamicAnchor) {
					const daDef = def;
					let daCached = void 0;
					defs["#" + def.$dynamicAnchor] = {
						get fn() {
							if (daCached === void 0) {
								daCached = null;
								daCached = compileToJS(daDef, defs);
							}
							return daCached || (() => true);
						},
						raw: daDef
					};
				}
			}
		}
		if (schema.$anchor && !defs["#" + schema.$anchor]) {
			const rootAnchorSchema = schema;
			let rootACached = void 0;
			defs["#" + schema.$anchor] = {
				get fn() {
					if (rootACached === void 0) {
						rootACached = null;
						rootACached = compileToJS(rootAnchorSchema, defs);
					}
					return rootACached || (() => true);
				},
				raw: rootAnchorSchema
			};
		}
		if (schema.$dynamicAnchor && !defs["#" + schema.$dynamicAnchor]) {
			const rootDASchema = schema;
			let rootDACached = void 0;
			defs["#" + schema.$dynamicAnchor] = {
				get fn() {
					if (rootDACached === void 0) {
						rootDACached = null;
						rootDACached = compileToJS(rootDASchema, defs);
					}
					return rootDACached || (() => true);
				},
				raw: rootDASchema
			};
		}
		return defs;
	}
	function resolveRef(ref, defs, schemaMap) {
		if (ref === "#") return () => true;
		if (defs) {
			const m = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m) {
				const entry = defs[m[1]];
				if (entry) return (d) => {
					const fn = entry.fn;
					return fn ? fn(d) : true;
				};
			}
			if (ref.startsWith("#") && !ref.startsWith("#/")) {
				const entry = defs[ref];
				if (entry) return (d) => {
					const fn = entry.fn;
					return fn ? fn(d) : true;
				};
			}
		}
		if (schemaMap && schemaMap.has(ref)) return compileToJS(schemaMap.get(ref), null, schemaMap) || (() => true);
		if (schemaMap && !ref.includes("://") && !ref.startsWith("#")) {
			for (const [id] of schemaMap) if (id.endsWith("/" + ref)) return compileToJS(schemaMap.get(id), null, schemaMap) || (() => true);
		}
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
		date: (s) => {
			if (s.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
			const m = +s.slice(5, 7), d = +s.slice(8, 10);
			return m >= 1 && m <= 12 && d >= 1 && d <= 31;
		},
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
	function canResolveDynamicRefs(target, callingSchema, schemaMap) {
		const anchors = /* @__PURE__ */ new Set();
		if (callingSchema.$dynamicAnchor) anchors.add(callingSchema.$dynamicAnchor);
		const defs = callingSchema.$defs || callingSchema.definitions;
		if (defs) {
			for (const def of Object.values(defs)) if (def && typeof def === "object" && def.$dynamicAnchor) anchors.add(def.$dynamicAnchor);
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object" && ext.$dynamicAnchor) anchors.add(ext.$dynamicAnchor);
		}
		const refs = [];
		const findDynRefs = (s) => {
			if (typeof s !== "object" || s === null) return;
			if (s.$dynamicRef) {
				const name = s.$dynamicRef.startsWith("#") ? s.$dynamicRef.slice(1) : s.$dynamicRef;
				refs.push(name);
			}
			for (const v of Object.values(s)) if (Array.isArray(v)) v.forEach(findDynRefs);
			else if (typeof v === "object" && v !== null) findDynRefs(v);
		};
		findDynRefs(target);
		return refs.every((r) => anchors.has(r));
	}
	function codegenSafe(schema, schemaMap) {
		if (typeof schema === "boolean") return true;
		if (typeof schema !== "object" || schema === null) return true;
		if (schema.$dynamicRef && !schema.$dynamicRef.startsWith("#")) return false;
		if (schema.items === false) return false;
		if (schema.items === true && !schema.unevaluatedItems) return false;
		if (schema.additionalProperties === true) return true;
		if (schema.properties) for (const v of Object.values(schema.properties)) {
			if (v === false) return false;
			if (v === true) continue;
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
			if (schema.$ref === "#") return true;
			const isLocal = /^#\/(?:\$defs|definitions)\/[^/]+$/.test(schema.$ref);
			let isResolvable = !isLocal && schemaMap && schemaMap.has(schema.$ref);
			let resolvedTarget = null;
			if (!isLocal && !isResolvable && schemaMap && !schema.$ref.includes("://") && !schema.$ref.startsWith("#")) {
				for (const [id] of schemaMap) if (id.endsWith("/" + schema.$ref)) {
					isResolvable = true;
					resolvedTarget = schemaMap.get(id);
					break;
				}
			}
			const isAnchorRef = !isLocal && !isResolvable && schema.$ref.length > 1 && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/");
			if (!isLocal && !isResolvable && !isAnchorRef) return false;
			if (!resolvedTarget && isResolvable) resolvedTarget = schemaMap.get(schema.$ref);
			if (resolvedTarget && JSON.stringify(resolvedTarget).includes("\"$dynamicRef\"")) {
				if (!(canResolveDynamicRefs(resolvedTarget, schema, schemaMap) && resolvedTarget.additionalProperties === void 0 && !resolvedTarget.patternProperties && !resolvedTarget.dependentSchemas && !resolvedTarget.propertyNames) && schema.unevaluatedProperties === void 0 && schema.unevaluatedItems === void 0) return false;
			}
			const SCHEMA_ORG_KEYS = new Set([
				"$ref",
				"$defs",
				"definitions",
				"$schema",
				"$id",
				"$dynamicAnchor",
				"$anchor"
			]);
			if (Object.keys(schema).filter((k) => !SCHEMA_ORG_KEYS.has(k)).length > 0 && schema.unevaluatedProperties === void 0 && schema.unevaluatedItems === void 0) return false;
		}
		if (typeof schema.additionalProperties === "object") return false;
		if (schema.additionalProperties === false && !schema.properties) return false;
		if (schema.propertyNames === false) return false;
		if (schema.unevaluatedProperties !== void 0) {
			if (typeof schema.unevaluatedProperties === "object" && schema.unevaluatedProperties !== null) {
				if (!codegenSafe(schema.unevaluatedProperties, schemaMap)) return false;
			}
		}
		if (schema.unevaluatedItems !== void 0) {
			if (typeof schema.unevaluatedItems === "object" && schema.unevaluatedItems !== null) {
				if (!codegenSafe(schema.unevaluatedItems, schemaMap)) return false;
			}
		}
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
			if (s === false) return false;
			if (s === true) continue;
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
		const anchors = {};
		if (schema.$dynamicAnchor) anchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) anchors["#" + schema.$anchor] = schema;
		if (rootDefs) {
			for (const def of Object.values(rootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) anchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) anchors["#" + def.$anchor] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !anchors["#" + ext.$dynamicAnchor]) anchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !anchors["#" + ext.$anchor]) anchors["#" + ext.$anchor] = ext;
			}
		}
		const ctx = {
			varCounter: 0,
			helpers: [],
			helperCode: [],
			closureVars: [],
			closureVals: [],
			rootDefs,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null,
			anchors,
			rootSchema: schema
		};
		const lines = [];
		genCode(schema, "d", lines, ctx);
		if (ctx.deferredChecks) for (const dc of ctx.deferredChecks) lines.push(dc);
		if (lines.length === 0) return () => true;
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
		let body, hybridBody;
		if (ctx.usesRecursion) {
			body = `function _validate(d){\n  ${checkStr}\n  return true\n  }\n  return _validate(d)`;
			hybridBody = `function _validate(d){\n  ${checkStr}\n  return true\n  }\n  return _validate(d)?R:E(d)`;
		} else {
			body = checkStr + "\n  return true";
			hybridBody = replaceTopLevel(checkStr + "\n  return R");
		}
		try {
			let boolFn;
			if (closureNames.length > 0) boolFn = new Function(...closureNames, `return function(d){${body}}`)(...closureValues);
			else boolFn = new Function("d", body);
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
	function needsLocal(schema) {
		if (typeof schema !== "object" || schema === null) return false;
		if (schema.$ref || schema.allOf || schema.anyOf || schema.oneOf || schema.if) return false;
		if (schema.properties || schema.items || schema.prefixItems) return false;
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		if (!types || types.length !== 1) return false;
		const t = types[0];
		let checkCount = 1;
		if (t === "string") {
			if (schema.minLength !== void 0) checkCount++;
			if (schema.maxLength !== void 0) checkCount++;
			if (schema.pattern) checkCount++;
			if (schema.format) checkCount++;
		} else if (t === "integer" || t === "number") {
			if (schema.minimum !== void 0) checkCount++;
			if (schema.maximum !== void 0) checkCount++;
			if (schema.exclusiveMinimum !== void 0) checkCount++;
			if (schema.exclusiveMaximum !== void 0) checkCount++;
			if (schema.multipleOf !== void 0) checkCount++;
		}
		return checkCount >= 2;
	}
	function tryGenCombined(schema, access, ctx) {
		if (typeof schema !== "object" || schema === null) return null;
		if (schema.$ref || schema.allOf || schema.anyOf || schema.oneOf || schema.if) return null;
		if (schema.properties || schema.items || schema.prefixItems || schema.patternProperties) return null;
		if (schema.enum || schema.const !== void 0) return null;
		if (schema.not || schema.dependentRequired || schema.dependentSchemas) return null;
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		if (!types || types.length !== 1) return null;
		const t = types[0];
		if (t === "string") {
			const conds = [`typeof _v!=='string'`];
			if (schema.minLength !== void 0) conds.push(`_v.length<${schema.minLength}`);
			if (schema.maxLength !== void 0) conds.push(`_v.length>${schema.maxLength}`);
			if (conds.length < 2 && !schema.pattern && !schema.format) return null;
			if (schema.pattern || schema.format) return null;
			ctx.varCounter++;
			return `{const _v=${access};if(${conds.join("||")})return false}`;
		}
		if (t === "integer") {
			const conds = [`!Number.isInteger(_v)`];
			if (schema.minimum !== void 0) conds.push(`_v<${schema.minimum}`);
			if (schema.maximum !== void 0) conds.push(`_v>${schema.maximum}`);
			if (schema.exclusiveMinimum !== void 0) conds.push(`_v<=${schema.exclusiveMinimum}`);
			if (schema.exclusiveMaximum !== void 0) conds.push(`_v>=${schema.exclusiveMaximum}`);
			if (schema.multipleOf !== void 0) conds.push(`_v%${schema.multipleOf}!==0`);
			if (conds.length < 2) return null;
			ctx.varCounter++;
			return `{const _v=${access};if(${conds.join("||")})return false}`;
		}
		if (t === "number") {
			const conds = [`typeof _v!=='number'||!isFinite(_v)`];
			if (schema.minimum !== void 0) conds.push(`_v<${schema.minimum}`);
			if (schema.maximum !== void 0) conds.push(`_v>${schema.maximum}`);
			if (schema.exclusiveMinimum !== void 0) conds.push(`_v<=${schema.exclusiveMinimum}`);
			if (schema.exclusiveMaximum !== void 0) conds.push(`_v>=${schema.exclusiveMaximum}`);
			if (schema.multipleOf !== void 0) conds.push(`_v%${schema.multipleOf}!==0`);
			if (conds.length < 2) return null;
			ctx.varCounter++;
			return `{const _v=${access};if(${conds.join("||")})return false}`;
		}
		return null;
	}
	function genCode(schema, v, lines, ctx, knownType) {
		if (typeof schema !== "object" || schema === null) return;
		const hasSiblings = schema.$ref && (schema.unevaluatedProperties !== void 0 || schema.unevaluatedItems !== void 0);
		if (schema.$ref) {
			if (schema.$ref === "#") {
				ctx.usesRecursion = true;
				lines.push(`if(!_validate(${v}))return false`);
				if (!hasSiblings) return;
			}
			const m = schema.$ref !== "#" && schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) if (ctx.refStack.has(schema.$ref)) {
				if (!hasSiblings) return;
			} else {
				ctx.refStack.add(schema.$ref);
				genCode(ctx.rootDefs[m[1]], v, lines, ctx, knownType);
				ctx.refStack.delete(schema.$ref);
				if (!hasSiblings) return;
			}
			else if (schema.$ref !== "#" && !m && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/")) {
				const entry = ctx.rootDefs && ctx.rootDefs[schema.$ref];
				const anchorTarget = entry && entry.raw ? entry.raw : ctx.anchors && ctx.anchors[schema.$ref];
				if (anchorTarget) if (ctx.refStack.has(schema.$ref)) {
					if (!hasSiblings) return;
				} else {
					ctx.refStack.add(schema.$ref);
					genCode(anchorTarget, v, lines, ctx, knownType);
					ctx.refStack.delete(schema.$ref);
					if (!hasSiblings) return;
				}
			} else if (schema.$ref !== "#" && ctx.schemaMap) {
				let resolved = ctx.schemaMap.get(schema.$ref);
				if (!resolved && !schema.$ref.includes("://") && !schema.$ref.startsWith("#")) {
					for (const [id, s] of ctx.schemaMap) if (id.endsWith("/" + schema.$ref)) {
						resolved = s;
						break;
					}
				}
				if (resolved) if (ctx.refStack.has(schema.$ref)) {
					if (!hasSiblings) return;
				} else {
					ctx.refStack.add(schema.$ref);
					genCode(resolved, v, lines, ctx, knownType);
					ctx.refStack.delete(schema.$ref);
					if (!hasSiblings) return;
				}
				else if (!hasSiblings) return;
			} else if (!hasSiblings) return;
		}
		if (schema.$dynamicRef) {
			const anchorKey = schema.$dynamicRef.startsWith("#") ? schema.$dynamicRef : "#" + schema.$dynamicRef;
			if (ctx.anchors && ctx.anchors[anchorKey]) {
				const target = ctx.anchors[anchorKey];
				if (target === ctx.rootSchema) {
					ctx.usesRecursion = true;
					lines.push(`if(!_validate(${v}))return false`);
				} else {
					const refKey = "$dynamicRef:" + anchorKey;
					if (!ctx.refStack.has(refKey)) {
						ctx.refStack.add(refKey);
						genCode(target, v, lines, ctx, knownType);
						ctx.refStack.delete(refKey);
					}
				}
			}
		}
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		let effectiveType = knownType;
		if (types) {
			if (!knownType) if (types.length === 1) switch (types[0]) {
				case "object":
					lines.push(`if(typeof ${v}!=='object'||${v}===null||Array.isArray(${v}))return false`);
					break;
				case "array":
					lines.push(`if(!Array.isArray(${v}))return false`);
					break;
				case "string":
					lines.push(`if(typeof ${v}!=='string')return false`);
					break;
				case "number":
					lines.push(`if(typeof ${v}!=='number'||!isFinite(${v}))return false`);
					break;
				case "integer":
					lines.push(`if(!Number.isInteger(${v}))return false`);
					break;
				case "boolean":
					lines.push(`if(typeof ${v}!=='boolean')return false`);
					break;
				case "null":
					lines.push(`if(${v}!==null)return false`);
					break;
			}
			else {
				const conds = types.map((t) => {
					switch (t) {
						case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
						case "array": return `Array.isArray(${v})`;
						case "string": return `typeof ${v}==='string'`;
						case "number": return `(typeof ${v}==='number'&&isFinite(${v}))`;
						case "integer": return `Number.isInteger(${v})`;
						case "boolean": return `typeof ${v}==='boolean'`;
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
		} else if (schema.required && schema.required.length > 0) if (isObj) {
			const checks = schema.required.map((key) => `${v}[${JSON.stringify(key)}]===undefined`);
			lines.push(`if(${checks.join("||")})return false`);
		} else for (const key of schema.required) lines.push(`if(typeof ${v}!=='object'||${v}===null||!(${JSON.stringify(key)} in ${v}))return false`);
		if (schema.unevaluatedProperties === false && schema.properties && schema.required && isObj) {
			const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
			if (!evalResult.dynamic && !evalResult.allProps) {
				const knownKeys = evalResult.props;
				const propCount = knownKeys.length;
				if (schema.required.length >= propCount && knownKeys.every((k) => schema.required.includes(k)) && propCount > 0) {
					if (propCount <= 15) lines.push(`var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false`);
					else lines.push(`if(Object.keys(${v}).length!==${propCount})return false`);
					ctx._earlyKeyCount = true;
				}
			}
		}
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
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) lines.push(isStr ? `if(!(${inlineCheck}))return false` : `if(typeof ${v}==='string'&&!(${inlineCheck}))return false`);
			else {
				const ri = ctx.varCounter++;
				ctx.helperCode.push(`const _re${ri}=new RegExp(${JSON.stringify(schema.pattern)})`);
				lines.push(isStr ? `if(!_re${ri}.test(${v}))return false` : `if(typeof ${v}==='string'&&!_re${ri}.test(${v}))return false`);
			}
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
			const inner = schema.required && schema.required.length === propCount ? propCount <= 15 ? `var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false` : `if(Object.keys(${v}).length!==${propCount})return false` : `for(var _k in ${v})if(${Object.keys(schema.properties).map((k) => `_k!==${JSON.stringify(k)}`).join("&&")})return false`;
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
				const switchCases = propKeys.map((k) => `case ${JSON.stringify(k)}:`).join("");
				lines.push(`switch(${kVar}){${switchCases}break;default:`);
				let patternChecks = [];
				for (let i = 0; i < ppEntries.length; i++) patternChecks.push(`if(${matchers[i].check}){if(!_ppf${pi}_${i}(${v}[${kVar}]))return false}else{return false}`);
				if (patternChecks.length > 0) lines.push(patternChecks.join(""));
				else lines.push(`return false`);
				lines.push(`}`);
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
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) if (requiredSet.has(key) && isObj) {
			const access = hoisted[key] || `${v}[${JSON.stringify(key)}]`;
			const combined = tryGenCombined(prop, access, ctx);
			if (combined) lines.push(combined);
			else if (needsLocal(prop)) {
				const local = `_r${ctx.varCounter++}`;
				lines.push(`{const ${local}=${access}`);
				genCode(prop, local, lines, ctx);
				lines.push(`}`);
			} else genCode(prop, access, lines, ctx);
		} else if (isObj) {
			const local = `_o${ctx.varCounter++}`;
			lines.push(`{const ${local}=${v}[${JSON.stringify(key)}];if(${local}!==undefined){`);
			const combined = tryGenCombined(prop, local, ctx);
			if (combined) lines.push(combined);
			else genCode(prop, local, lines, ctx);
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
			const pfxVar = ctx.varCounter++;
			for (let i = 0; i < schema.prefixItems.length; i++) {
				const elem = `_p${pfxVar}_${i}`;
				lines.push(isArr ? `if(${v}.length>${i}){const ${elem}=${v}[${i}]` : `if(Array.isArray(${v})&&${v}.length>${i}){const ${elem}=${v}[${i}]`);
				genCode(schema.prefixItems[i], elem, lines, ctx);
				lines.push(`}`);
			}
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
		if (schema.anyOf && schema.unevaluatedProperties === void 0) {
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
		if (schema.unevaluatedProperties !== void 0) {
			const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
			if (evalResult.allProps || schema.unevaluatedProperties === true) {} else if (!evalResult.dynamic) {
				const knownKeys = evalResult.props;
				const propCount = knownKeys.length;
				if (schema.unevaluatedProperties === false) {
					const allRequired = schema.required && schema.required.length >= propCount && knownKeys.every((k) => schema.required.includes(k));
					let inner;
					if (allRequired && propCount > 0) {
						if (!ctx._earlyKeyCount) {
							inner = propCount <= 15 ? `var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false` : `if(Object.keys(${v}).length!==${propCount})return false`;
							if (!ctx.deferredChecks) ctx.deferredChecks = [];
							ctx.deferredChecks.push(isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
						}
					} else if (propCount > 0) {
						inner = genCharCodeSwitch(knownKeys, v);
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
					} else {
						inner = `for(var _k in ${v})return false`;
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
					}
				} else if (typeof schema.unevaluatedProperties === "object") {
					const ukVar = `_uk${ctx.varCounter++}`;
					const subLines = [];
					genCode(schema.unevaluatedProperties, `${v}[${ukVar}]`, subLines, ctx);
					if (subLines.length > 0) {
						const check = subLines.join(";");
						const keyChecks = knownKeys.map((k) => `${ukVar}===${JSON.stringify(k)}`).join("||");
						const inner = `for(var ${ukVar} in ${v}){${knownKeys.length > 0 ? `if(${keyChecks})continue;` : ""}${check}}`;
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
					}
				}
			} else {
				const baseResult = {
					props: [],
					items: null,
					allProps: false,
					allItems: false,
					dynamic: false
				};
				if (schema.properties) {
					for (const k of Object.keys(schema.properties)) if (!baseResult.props.includes(k)) baseResult.props.push(k);
				}
				if (schema.allOf) for (const sub of schema.allOf) {
					const subR = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
					if (!subR.dynamic && subR.props) {
						for (const k of subR.props) if (!baseResult.props.includes(k)) baseResult.props.push(k);
					}
				}
				const baseProps = baseResult.props;
				const branchKeyword = schema.anyOf ? "anyOf" : schema.oneOf ? "oneOf" : null;
				if (schema.unevaluatedProperties === false) if (schema.if && (schema.then || schema.else) && !branchKeyword && !schema.patternProperties && !schema.dependentSchemas) {
					const ifLines2 = [];
					genCode(schema.if, "_iv2", ifLines2, ctx);
					const ufi = ctx.varCounter++;
					const ifFn2 = ifLines2.length === 0 ? `function(_iv2){return true}` : `function(_iv2){${ifLines2.join(";")};return true}`;
					const ifProps = [];
					if (schema.if && schema.if.properties) ifProps.push(...Object.keys(schema.if.properties));
					const thenEval = schema.then ? collectEvaluated(schema.then, ctx.schemaMap, ctx.rootDefs) : { props: [] };
					const elseEval = schema.else ? collectEvaluated(schema.else, ctx.schemaMap, ctx.rootDefs) : { props: [] };
					const uniqueThen = [...new Set([
						...baseProps,
						...ifProps,
						...thenEval.props || []
					])];
					const uniqueElse = [...new Set([...baseProps, ...elseEval.props || []])];
					const thenCheck = genCharCodeSwitch(uniqueThen, v);
					const elseCheck = genCharCodeSwitch(uniqueElse, v);
					const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
					lines.push(`${guard}{const _uif${ufi}=${ifFn2};if(_uif${ufi}(${v})){${thenCheck}}else{${elseCheck}}}`);
				} else if (branchKeyword) {
					const branches = schema[branchKeyword];
					const branchProps = [];
					for (const sub of branches) {
						const subResult = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
						branchProps.push(subResult.props || []);
					}
					const dynamicOnly = [...new Set(branchProps.flat())].filter((k) => !baseProps.includes(k));
					if (dynamicOnly.length > 0 && dynamicOnly.length <= 32) {
						const evVar = `_ev${ctx.varCounter++}`;
						const bitMap = /* @__PURE__ */ new Map();
						dynamicOnly.forEach((k, i) => bitMap.set(k, i));
						const branchMasks = branchProps.map((props) => {
							let mask = 0;
							for (const p of props) if (bitMap.has(p)) mask |= 1 << bitMap.get(p);
							return mask;
						});
						const bfi = ctx.varCounter++;
						lines.push(`{let ${evVar}=0`);
						const fnVars = [];
						for (let i = 0; i < branches.length; i++) {
							const subLines2 = [];
							genCode(branches[i], "_bv", subLines2, ctx);
							const fnVar = `_bf${bfi}_${i}`;
							fnVars.push(fnVar);
							const fnBody = subLines2.length === 0 ? `function(_bv){return true}` : `function(_bv){${subLines2.join(";")};return true}`;
							lines.push(`const ${fnVar}=${fnBody}`);
						}
						if (branchKeyword === "oneOf") {
							lines.push(`let _oc${bfi}=0`);
							for (let i = 0; i < branches.length; i++) lines.push(`if(${fnVars[i]}(${v})){_oc${bfi}++;${evVar}=${branchMasks[i]};if(_oc${bfi}>1)return false}`);
							lines.push(`if(_oc${bfi}!==1)return false`);
						} else {
							lines.push(`let _am${bfi}=false`);
							for (let i = 0; i < branches.length; i++) lines.push(`if(${fnVars[i]}(${v})){_am${bfi}=true;${evVar}|=${branchMasks[i]}}`);
							lines.push(`if(!_am${bfi})return false`);
						}
						const staticCheck = baseProps.length > 0 ? baseProps.map((k) => `_k===${JSON.stringify(k)}`).join("||") : "";
						const groups = /* @__PURE__ */ new Map();
						for (const k of dynamicOnly) {
							const cc = k.charCodeAt(0);
							if (!groups.has(cc)) groups.set(cc, []);
							groups.get(cc).push(k);
						}
						let switchCases = "";
						for (const [cc, groupKeys] of groups) {
							const cond = groupKeys.map((k) => `_k===${JSON.stringify(k)}&&(${evVar}&${1 << bitMap.get(k)})`).join("||");
							switchCases += `case ${cc}:if(${cond})continue;break;`;
						}
						const dynamicCheck = `switch(_k.charCodeAt(0)){${switchCases}default:break}`;
						const inner = staticCheck ? `for(var _k in ${v}){if(${staticCheck})continue;${dynamicCheck}return false}` : `for(var _k in ${v}){${dynamicCheck}return false}`;
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
					} else {
						const evVar = `_ev${ctx.varCounter++}`;
						const fns = [];
						for (let i = 0; i < branches.length; i++) {
							const subLines2 = [];
							genCode(branches[i], "_bv", subLines2, ctx);
							fns.push(subLines2.length === 0 ? `function(_bv){return true}` : `function(_bv){${subLines2.join(";")};return true}`);
						}
						const bfi = ctx.varCounter++;
						ctx.closureVars.push(`_bk${bfi}`);
						ctx.closureVals.push(branchProps);
						lines.push(`{const ${evVar}={}`);
						for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
						lines.push(`const _bf${bfi}=[${fns.join(",")}]`);
						if (branchKeyword === "oneOf") lines.push(`let _oc${bfi}=0;for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){_oc${bfi}++;for(const _p of _bk${bfi}[_bi])${evVar}[_p]=1;if(_oc${bfi}>1)return false}}if(_oc${bfi}!==1)return false`);
						else lines.push(`let _am${bfi}=false;for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){_am${bfi}=true;for(const _p of _bk${bfi}[_bi])${evVar}[_p]=1}}if(!_am${bfi})return false`);
						const inner = `for(var _k in ${v}){if(!${evVar}[_k])return false}`;
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
					}
				} else if (schema.dependentSchemas) {
					const evVar = `_ev${ctx.varCounter++}`;
					lines.push(`{const ${evVar}={}`);
					for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
					for (const [trigger, depSchema] of Object.entries(schema.dependentSchemas)) {
						const depResult = collectEvaluated(depSchema, ctx.schemaMap, ctx.rootDefs);
						if (depResult.props && depResult.props.length > 0) lines.push(`if(${JSON.stringify(trigger)} in ${v}){${depResult.props.map((k) => `${evVar}[${JSON.stringify(k)}]=1`).join(";")}}`);
					}
					const inner = `for(var _k in ${v}){if(!${evVar}[_k])return false}`;
					if (!ctx.deferredChecks) ctx.deferredChecks = [];
					ctx.deferredChecks.push(isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
				} else {
					const allPatterns = [];
					if (schema.patternProperties) allPatterns.push(...Object.keys(schema.patternProperties));
					if (schema.allOf) {
						for (const sub of schema.allOf) if (sub && sub.patternProperties) allPatterns.push(...Object.keys(sub.patternProperties));
					}
					if (schema.if && !schema.then && !schema.else && schema.if.patternProperties) allPatterns.push(...Object.keys(schema.if.patternProperties));
					if (allPatterns.length > 0) {
						const evVar = `_ev${ctx.varCounter++}`;
						lines.push(`{const ${evVar}={}`);
						for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
						const reVars = [];
						for (const pat of allPatterns) {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_ure${ri}`);
							ctx.closureVals.push(new RegExp(pat));
							reVars.push(`_ure${ri}`);
						}
						if (schema.if && !schema.then && !schema.else) {
							const ifLines2 = [];
							genCode(schema.if, "_iv2", ifLines2, ctx);
							const ufi = ctx.varCounter++;
							const ifFn = ifLines2.length === 0 ? `function(_iv2){return true}` : `function(_iv2){${ifLines2.join(";")};return true}`;
							const ifPatterns = schema.if.patternProperties ? Object.keys(schema.if.patternProperties) : [];
							const ifReVars = [];
							for (const pat of ifPatterns) {
								const ri = ctx.varCounter++;
								ctx.closureVars.push(`_ure${ri}`);
								ctx.closureVals.push(new RegExp(pat));
								ifReVars.push(`_ure${ri}`);
							}
							const rootReVars = [];
							if (schema.patternProperties) for (const pat of Object.keys(schema.patternProperties)) {
								const ri = ctx.varCounter++;
								ctx.closureVars.push(`_ure${ri}`);
								ctx.closureVals.push(new RegExp(pat));
								rootReVars.push(`_ure${ri}`);
							}
							const rootPatCheck = rootReVars.map((rv) => `if(${rv}.test(_k))continue;`).join("");
							const inner = `const _uif${ufi}=${ifFn};if(_uif${ufi}(${v})){for(var _k in ${v}){if(${evVar}[_k])continue;${rootPatCheck}${ifReVars.map((rv) => `if(${rv}.test(_k))continue;`).join("")}return false}}else{for(var _k in ${v}){if(${evVar}[_k])continue;${rootPatCheck}return false}}`;
							if (!ctx.deferredChecks) ctx.deferredChecks = [];
							ctx.deferredChecks.push(isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
						} else {
							const inner = `for(var _k in ${v}){if(${evVar}[_k])continue;${reVars.map((rv) => `if(${rv}.test(_k)){${evVar}[_k]=1;continue}`).join("")}return false}`;
							if (!ctx.deferredChecks) ctx.deferredChecks = [];
							ctx.deferredChecks.push(isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
						}
					}
				}
				else if (typeof schema.unevaluatedProperties === "object") {
					const ei = ctx.varCounter++;
					const evVar = `_ev${ei}`;
					const ukVar = `_uk${ei}`;
					lines.push(`{const ${evVar}={}`);
					for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
					if (branchKeyword) {
						const branches = schema[branchKeyword];
						const branchProps = [];
						for (const sub of branches) {
							const subResult = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
							branchProps.push(subResult.props || []);
						}
						const fns = [];
						for (let i = 0; i < branches.length; i++) {
							const subLines2 = [];
							genCode(branches[i], "_bv", subLines2, ctx);
							fns.push(subLines2.length === 0 ? `function(_bv){return true}` : `function(_bv){${subLines2.join(";")};return true}`);
						}
						const bfi = ctx.varCounter++;
						ctx.closureVars.push(`_bk${bfi}`);
						ctx.closureVals.push(branchProps);
						lines.push(`const _bf${bfi}=[${fns.join(",")}]`);
						if (branchKeyword === "oneOf") lines.push(`for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){for(const _p of _bk${bfi}[_bi])${evVar}[_p]=1;break}}`);
						else lines.push(`for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){for(const _p of _bk${bfi}[_bi])${evVar}[_p]=1}}`);
					}
					const subLines2 = [];
					genCode(schema.unevaluatedProperties, `${v}[${ukVar}]`, subLines2, ctx);
					if (subLines2.length > 0) {
						const inner = `for(var ${ukVar} in ${v}){if(${evVar}[${ukVar}])continue;${subLines2.join(";")}}`;
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
					} else lines.push("}");
				}
			}
		}
		if (schema.unevaluatedItems !== void 0) {
			const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
			const branchKw = schema.anyOf ? "anyOf" : schema.oneOf ? "oneOf" : null;
			const hasConditionalItems = evalResult.allItems && evalResult.dynamic && branchKw && schema[branchKw].some((sub) => sub && typeof sub === "object" && (sub.items && typeof sub.items === "object" || sub.items === true));
			if (schema.unevaluatedItems === true || evalResult.allItems && !hasConditionalItems) {} else if (!evalResult.dynamic) {
				if (schema.unevaluatedItems === false) {
					const inner = `if(${v}.length>${evalResult.items || 0})return false`;
					if (!ctx.deferredChecks) ctx.deferredChecks = [];
					ctx.deferredChecks.push(isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
				} else if (typeof schema.unevaluatedItems === "object") {
					const maxIdx = evalResult.items || 0;
					const ui = ctx.varCounter++;
					const elemVar = `_ue${ui}`;
					const idxVar = `_ui${ui}`;
					const subLines = [];
					genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
					if (subLines.length > 0) {
						const inner = `for(let ${idxVar}=${maxIdx};${idxVar}<${v}.length;${idxVar}++){const ${elemVar}=${v}[${idxVar}];${subLines.join(";")}}`;
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
					}
				}
			} else {
				let baseIdx = 0;
				if (schema.prefixItems) baseIdx = Math.max(baseIdx, schema.prefixItems.length);
				if (schema.items && typeof schema.items === "object") baseIdx = Infinity;
				if (schema.allOf) for (const sub of schema.allOf) {
					const subR = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
					if (subR.items !== null) baseIdx = Math.max(baseIdx, subR.items);
					if (subR.allItems) baseIdx = Infinity;
				}
				if (baseIdx === Infinity) baseIdx = 0;
				const branchKeyword = schema.anyOf ? "anyOf" : schema.oneOf ? "oneOf" : null;
				if (branchKeyword && (schema.unevaluatedItems === false || typeof schema.unevaluatedItems === "object")) {
					const branches = schema[branchKeyword];
					const branchMaxIdx = [];
					const branchAllItems = [];
					for (const sub of branches) {
						const subR = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
						branchMaxIdx.push(subR.items || 0);
						branchAllItems.push(subR.allItems);
					}
					const fns = [];
					for (let i = 0; i < branches.length; i++) {
						const subLines2 = [];
						genCode(branches[i], "_bv", subLines2, ctx);
						fns.push(subLines2.length === 0 ? `function(_bv){return true}` : `function(_bv){${subLines2.join(";")};return true}`);
					}
					const bfi = ctx.varCounter++;
					const evVar = `_eidx${ctx.varCounter++}`;
					lines.push(`{let ${evVar}=${baseIdx}`);
					lines.push(`const _bf${bfi}=[${fns.join(",")}]`);
					const maxExprs = branchMaxIdx.map((m, i) => {
						if (branchAllItems[i]) return `_bi===${i}?${v}.length`;
						return `_bi===${i}?${Math.max(m, baseIdx)}`;
					}).join(":") + `:${baseIdx}`;
					if (branchKeyword === "oneOf") lines.push(`for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){${evVar}=${maxExprs};break}}`);
					else lines.push(`for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){const _m=${maxExprs};if(_m>${evVar})${evVar}=_m}}`);
					if (schema.unevaluatedItems === false) {
						const inner = `if(${v}.length>${evVar})return false`;
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(isArr ? inner + "}" : `if(Array.isArray(${v})){${inner}}}`);
					} else {
						const ui = ctx.varCounter++;
						const elemVar = `_ue${ui}`;
						const idxVar = `_ui${ui}`;
						const subLines = [];
						genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
						if (subLines.length > 0) {
							const inner = `for(let ${idxVar}=${evVar};${idxVar}<${v}.length;${idxVar}++){const ${elemVar}=${v}[${idxVar}];${subLines.join(";")}}`;
							if (!ctx.deferredChecks) ctx.deferredChecks = [];
							ctx.deferredChecks.push(isArr ? inner + "}" : `if(Array.isArray(${v})){${inner}}}`);
						} else lines.push("}");
					}
				} else if (schema.if && (schema.unevaluatedItems === false || typeof schema.unevaluatedItems === "object")) {
					const ifEval = collectEvaluated(schema.if, ctx.schemaMap, ctx.rootDefs);
					const thenEval = schema.then ? collectEvaluated(schema.then, ctx.schemaMap, ctx.rootDefs) : { items: null };
					const elseEval = schema.else ? collectEvaluated(schema.else, ctx.schemaMap, ctx.rootDefs) : { items: null };
					const ifIdx = ifEval.items || 0;
					const thenIdx = Math.max(baseIdx, ifIdx, thenEval.items || 0);
					const elseIdx = Math.max(baseIdx, elseEval.items || 0);
					const ifLines2 = [];
					genCode(schema.if, "_iv3", ifLines2, ctx);
					const ufi = ctx.varCounter++;
					const ifFn3 = ifLines2.length === 0 ? `function(_iv3){return true}` : `function(_iv3){${ifLines2.join(";")};return true}`;
					if (schema.unevaluatedItems === false) {
						const guard = isArr ? "" : `if(Array.isArray(${v}))`;
						lines.push(`${guard}{const _uif${ufi}=${ifFn3};if(_uif${ufi}(${v})){if(${v}.length>${thenIdx})return false}else{if(${v}.length>${elseIdx})return false}}`);
					}
				} else if ((schema.contains || schema.allOf && schema.allOf.some((s) => s && s.contains)) && (schema.unevaluatedItems === false || typeof schema.unevaluatedItems === "object")) {
					const allContains = [];
					if (schema.contains) allContains.push(schema.contains);
					if (schema.allOf) {
						for (const sub of schema.allOf) if (sub && sub.contains) allContains.push(sub.contains);
					}
					const ci = ctx.varCounter++;
					const evArr = `_cev${ci}`;
					const containsFns = [];
					for (const c of allContains) {
						const cLines = [];
						genCode(c, "_cv", cLines, ctx);
						containsFns.push(cLines.length === 0 ? `function(_cv){return true}` : `function(_cv){${cLines.join(";")};return true}`);
					}
					const cfnArr = `_cfn${ci}`;
					lines.push(`{const ${cfnArr}=[${containsFns.join(",")}]`);
					lines.push(`const ${evArr}=[]`);
					if (baseIdx > 0) lines.push(`for(let _i=0;_i<${Math.min(baseIdx, 1e3)};_i++)${evArr}[_i]=true`);
					lines.push(`if(Array.isArray(${v})){for(let _ci=0;_ci<${v}.length;_ci++){for(let _cj=0;_cj<${cfnArr}.length;_cj++){if(${cfnArr}[_cj](${v}[_ci])){${evArr}[_ci]=true;break}}}}`);
					if (schema.unevaluatedItems === false) {
						const inner = `if(Array.isArray(${v})){for(let _ci=0;_ci<${v}.length;_ci++){if(!${evArr}[_ci])return false}}`;
						if (!ctx.deferredChecks) ctx.deferredChecks = [];
						ctx.deferredChecks.push(inner + "}");
					} else {
						const elemVar = `_ue${ctx.varCounter++}`;
						const subLines = [];
						genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
						if (subLines.length > 0) {
							const inner = `if(Array.isArray(${v})){for(let _ci=0;_ci<${v}.length;_ci++){if(!${evArr}[_ci]){const ${elemVar}=${v}[_ci];${subLines.join(";")}}}}`;
							if (!ctx.deferredChecks) ctx.deferredChecks = [];
							ctx.deferredChecks.push(inner + "}");
						} else lines.push("}");
					}
				} else if (schema.unevaluatedItems === false) {
					const inner = `if(${v}.length>${evalResult.items || 0})return false`;
					if (!ctx.deferredChecks) ctx.deferredChecks = [];
					ctx.deferredChecks.push(isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
				}
			}
		}
	}
	const FORMAT_CODEGEN = {
		email: (v, isStr) => {
			isStr || `${v}`;
			return isStr ? `{const _at=${v}.indexOf('@');if(_at<=0||_at>=${v}.length-1||${v}.indexOf('.',_at)<=_at+1)return false}` : `if(typeof ${v}==='string'){const _at=${v}.indexOf('@');if(_at<=0||_at>=${v}.length-1||${v}.indexOf('.',_at)<=_at+1)return false}`;
		},
		date: (v, isStr) => isStr ? `{if(${v}.length!==10||!/^\\d{4}-\\d{2}-\\d{2}$/.test(${v}))return false;const _dm=+${v}.slice(5,7),_dd=+${v}.slice(8,10);if(_dm<1||_dm>12||_dd<1||_dd>31)return false}` : `if(typeof ${v}==='string'){if(${v}.length!==10||!/^\\d{4}-\\d{2}-\\d{2}$/.test(${v}))return false;const _dm=+${v}.slice(5,7),_dd=+${v}.slice(8,10);if(_dm<1||_dm>12||_dd<1||_dd>31)return false}`,
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
	function childPathExpr(parentExpr, suffix) {
		if (!parentExpr) return `'/${suffix}'`;
		if (parentExpr.startsWith("'") && !parentExpr.includes("+")) return `'${parentExpr.slice(1, -1)}/${suffix}'`;
		return `${parentExpr}+'/${suffix}'`;
	}
	function compilePatternInline(pattern, varName) {
		let m = pattern.match(/^\^(\[[\w\-]+\])\{(\d+)\}\$$/);
		if (m) {
			const rangeCheck = charClassToCheck(m[1], `${varName}.charCodeAt(_pi)`);
			if (!rangeCheck) return null;
			const len = parseInt(m[2]);
			return `${varName}.length===${len}&&(()=>{for(let _pi=0;_pi<${len};_pi++){if(!(${rangeCheck}))return false}return true})()`;
		}
		m = pattern.match(/^\^(\[[\w\-]+\])\+\$$/);
		if (m) {
			const rangeCheck = charClassToCheck(m[1], `${varName}.charCodeAt(_pi)`);
			if (!rangeCheck) return null;
			return `${varName}.length>0&&(()=>{for(let _pi=0;_pi<${varName}.length;_pi++){if(!(${rangeCheck}))return false}return true})()`;
		}
		m = pattern.match(/^\^(\[[\w\-]+\])\{(\d+),(\d+)\}\$$/);
		if (m) {
			const rangeCheck = charClassToCheck(m[1], `${varName}.charCodeAt(_pi)`);
			if (!rangeCheck) return null;
			return `${varName}.length>=${parseInt(m[2])}&&${varName}.length<=${parseInt(m[3])}&&(()=>{for(let _pi=0;_pi<${varName}.length;_pi++){if(!(${rangeCheck}))return false}return true})()`;
		}
		return null;
	}
	function charClassToCheck(charClass, codeExpr) {
		const inner = charClass.slice(1, -1);
		const ranges = [];
		let i = 0;
		while (i < inner.length) if (i + 2 < inner.length && inner[i + 1] === "-") {
			ranges.push([inner.charCodeAt(i), inner.charCodeAt(i + 2)]);
			i += 3;
		} else {
			ranges.push([inner.charCodeAt(i), inner.charCodeAt(i)]);
			i++;
		}
		if (ranges.length === 0) return null;
		return ranges.map(([lo, hi]) => lo === hi ? `${codeExpr}===${lo}` : `(${codeExpr}>=${lo}&&${codeExpr}<=${hi})`).join("||");
	}
	function childPathDynExpr(parentExpr, indexExpr) {
		if (!parentExpr) return `'/'+${indexExpr}`;
		return `${parentExpr}+'/'+${indexExpr}`;
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
	function genCharCodeSwitch(keys, v) {
		if (keys.length === 0) return `for(var _k in ${v})return false`;
		if (keys.length <= 3) return `for(var _k in ${v})if(${keys.map((k) => `_k!==${JSON.stringify(k)}`).join("&&")})return false`;
		const groups = /* @__PURE__ */ new Map();
		for (const k of keys) {
			const cc = k.charCodeAt(0);
			if (!groups.has(cc)) groups.set(cc, []);
			groups.get(cc).push(k);
		}
		let cases = "";
		for (const [cc, groupKeys] of groups) {
			const cond = groupKeys.map((k) => `_k===${JSON.stringify(k)}`).join("||");
			cases += `case ${cc}:if(${cond})continue;break;`;
		}
		return `for(var _k in ${v}){switch(_k.charCodeAt(0)){${cases}default:break}return false}`;
	}
	function compileToJSCodegenWithErrors(schema, schemaMap) {
		if (typeof schema === "object" && schema !== null) {
			const s = JSON.stringify(schema);
			if (s.includes("unevaluatedProperties") || s.includes("unevaluatedItems")) return null;
			if (s.includes("\"$ref\":\"#\"")) return null;
		}
		if (typeof schema === "boolean") return schema ? () => ({
			valid: true,
			errors: []
		}) : () => ({
			valid: false,
			errors: [{
				keyword: "false schema",
				instancePath: "",
				schemaPath: "#",
				params: {},
				message: "boolean schema is false"
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
		const eRootDefs = schema.$defs || schema.definitions || null;
		const eAnchors = {};
		if (schema.$dynamicAnchor) eAnchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) eAnchors["#" + schema.$anchor] = schema;
		if (eRootDefs) {
			for (const def of Object.values(eRootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) eAnchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) eAnchors["#" + def.$anchor] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !eAnchors["#" + ext.$dynamicAnchor]) eAnchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !eAnchors["#" + ext.$anchor]) eAnchors["#" + ext.$anchor] = ext;
			}
		}
		const ctx = {
			varCounter: 0,
			helperCode: [],
			rootDefs: eRootDefs,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null,
			anchors: eAnchors,
			rootSchema: schema
		};
		const lines = [];
		genCodeE(schema, "d", "", lines, ctx, "#");
		if (lines.length === 0) return (d) => ({
			valid: true,
			errors: []
		});
		const checkStr = lines.join("\n  ");
		let body;
		if (ctx.usesRecursion) body = `const _e=[];\n  ` + (ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "") + `function _validateE(d,_all,_e){\n  ${checkStr}\n  }\n  _validateE(d,_all,_e);\n  return{valid:_e.length===0,errors:_e}`;
		else body = `const _e=[];\n  ` + (ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "") + checkStr + `\n  return{valid:_e.length===0,errors:_e}`;
		try {
			const fn = new Function("d", "_all", body);
			fn._errSource = body;
			return fn;
		} catch {
			return null;
		}
	}
	function genCodeE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		if (!schemaPrefix) schemaPrefix = "#";
		if (typeof schema !== "object" || schema === null) return;
		if (schema.$ref) {
			if (schema.$ref === "#") return;
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeE(ctx.rootDefs[m[1]], v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (!m && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/")) {
				const entry = ctx.rootDefs && ctx.rootDefs[schema.$ref];
				const anchorTarget = entry && entry.raw ? entry.raw : ctx.anchors && ctx.anchors[schema.$ref];
				if (anchorTarget) {
					if (ctx.refStack.has(schema.$ref)) return;
					ctx.refStack.add(schema.$ref);
					genCodeE(anchorTarget, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
			if (ctx.schemaMap && ctx.schemaMap.has(schema.$ref)) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeE(ctx.schemaMap.get(schema.$ref), v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
		}
		if (schema.$dynamicRef) {
			const anchorKey = schema.$dynamicRef.startsWith("#") ? schema.$dynamicRef : "#" + schema.$dynamicRef;
			if (ctx.anchors && ctx.anchors[anchorKey]) {
				const target = ctx.anchors[anchorKey];
				if (target === ctx.rootSchema) {
					ctx.usesRecursion = true;
					lines.push(`_validateE(${v},_all,_e)`);
				} else {
					const refKey = "$dynamicRef:" + anchorKey;
					if (!ctx.refStack.has(refKey)) {
						ctx.refStack.add(refKey);
						genCodeE(target, v, pathExpr, lines, ctx, schemaPrefix);
						ctx.refStack.delete(refKey);
					}
				}
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
					case "boolean": return `typeof ${v}==='boolean'`;
					case "null": return `${v}===null`;
					default: return "true";
				}
			});
			const expected = types.join(", ");
			lines.push(`if(!(${conds.join("||")})){_e.push({keyword:'type',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/type',params:{type:'${expected}'},message:'must be ${expected}'});if(!_all)return{valid:false,errors:_e}}`);
		}
		const isStr = false;
		const fail = (keyword, schemaSuffix, paramsCode, msgCode) => {
			const sp = schemaPrefix + "/" + schemaSuffix;
			return `_e.push({keyword:'${keyword}',instancePath:${pathExpr || "\"\""},schemaPath:'${sp}',params:${paramsCode},message:${msgCode}});if(!_all)return{valid:false,errors:_e}`;
		};
		if (schema.enum) {
			const vals = schema.enum;
			const primitives = vals.filter((v) => v === null || typeof v !== "object");
			const objects = vals.filter((v) => v !== null && typeof v === "object");
			const allChecks = [primitives.map((p) => `${v}===${JSON.stringify(p)}`).join("||"), objects.map((o) => `JSON.stringify(${v})===${JSON.stringify(JSON.stringify(o))}`).join("||")].filter(Boolean).join("||");
			lines.push(`if(!(${allChecks || "false"})){${fail("enum", "enum", `{allowedValues:${JSON.stringify(schema.enum)}}`, "'must be equal to one of the allowed values'")}}`);
		}
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)}){${fail("const", "const", `{allowedValue:${JSON.stringify(schema.const)}}`, "'must be equal to constant'")}}`);
			else {
				const canonFn = `_cnE${ctx.varCounter++}`;
				ctx.helperCode.push(`const ${canonFn}=function(x){if(x===null||typeof x!=='object')return JSON.stringify(x);if(Array.isArray(x))return'['+x.map(${canonFn}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+${canonFn}(x[k])}).join(',')+'}'};`);
				const expected = canonFn + "(JSON.parse(" + JSON.stringify(JSON.stringify(cv)) + "))";
				lines.push(`if(${canonFn}(${v})!==${expected}){${fail("const", "const", `{allowedValue:JSON.parse(${JSON.stringify(JSON.stringify(schema.const))})}`, "'must be equal to constant'")}}`);
			}
		}
		new Set(schema.required || []);
		if (schema.required) for (const key of schema.required) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!(${JSON.stringify(key)} in ${v})){_e.push({keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/required',params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'"});if(!_all)return{valid:false,errors:_e}}`);
		if (schema.minimum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}<${schema.minimum}`;
			lines.push(`if(${c}){${fail("minimum", "minimum", `{comparison:'>=',limit:${schema.minimum}}`, `'must be >= ${schema.minimum}'`)}}`);
		}
		if (schema.maximum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}>${schema.maximum}`;
			lines.push(`if(${c}){${fail("maximum", "maximum", `{comparison:'<=',limit:${schema.maximum}}`, `'must be <= ${schema.maximum}'`)}}`);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}<=${schema.exclusiveMinimum}`;
			lines.push(`if(${c}){${fail("exclusiveMinimum", "exclusiveMinimum", `{comparison:'>',limit:${schema.exclusiveMinimum}}`, `'must be > ${schema.exclusiveMinimum}'`)}}`);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}>=${schema.exclusiveMaximum}`;
			lines.push(`if(${c}){${fail("exclusiveMaximum", "exclusiveMaximum", `{comparison:'<',limit:${schema.exclusiveMaximum}}`, `'must be < ${schema.exclusiveMaximum}'`)}}`);
		}
		if (schema.multipleOf !== void 0) {
			const m = schema.multipleOf;
			const ci = ctx.varCounter++;
			lines.push(`{const _r${ci}=typeof ${v}==='number'?${v}%${m}:NaN;if(typeof ${v}==='number'&&Math.abs(_r${ci})>1e-8&&Math.abs(_r${ci}-${m})>1e-8){${fail("multipleOf", "multipleOf", `{multipleOf:${m}}`, `'must be multiple of ${m}'`)}}}`);
		}
		if (schema.minLength !== void 0) {
			const c = `typeof ${v}==='string'&&${v}.length<${schema.minLength}`;
			lines.push(`if(${c}){${fail("minLength", "minLength", `{limit:${schema.minLength}}`, `'must NOT have fewer than ${schema.minLength} characters'`)}}`);
		}
		if (schema.maxLength !== void 0) {
			const c = `typeof ${v}==='string'&&${v}.length>${schema.maxLength}`;
			lines.push(`if(${c}){${fail("maxLength", "maxLength", `{limit:${schema.maxLength}}`, `'must NOT have more than ${schema.maxLength} characters'`)}}`);
		}
		if (schema.pattern) {
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) {
				const c = `typeof ${v}==='string'&&!(${inlineCheck})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, `'must match pattern "${schema.pattern}"'`)}}`);
			} else {
				const ri = ctx.varCounter++;
				ctx.helperCode.push(`const _re${ri}=new RegExp(${JSON.stringify(schema.pattern)})`);
				const c = `typeof ${v}==='string'&&!_re${ri}.test(${v})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, `'must match pattern "${schema.pattern}"'`)}}`);
			}
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) {
				ctx.varCounter++;
				const boolLines = [];
				boolLines.push(fc(v, isStr));
				const fmtCode = boolLines.join(";").replace(/return false/g, `{_e.push({keyword:'format',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/format',params:{format:'${esc(schema.format)}'},message:'must match format "${esc(schema.format)}"'});if(!_all)return{valid:false,errors:_e}}`);
				lines.push(fmtCode);
			}
		}
		if (schema.minItems !== void 0) {
			const c = `Array.isArray(${v})&&${v}.length<${schema.minItems}`;
			lines.push(`if(${c}){${fail("minItems", "minItems", `{limit:${schema.minItems}}`, `'must NOT have fewer than ${schema.minItems} items'`)}}`);
		}
		if (schema.maxItems !== void 0) {
			const c = `Array.isArray(${v})&&${v}.length>${schema.maxItems}`;
			lines.push(`if(${c}){${fail("maxItems", "maxItems", `{limit:${schema.maxItems}}`, `'must NOT have more than ${schema.maxItems} items'`)}}`);
		}
		if (schema.uniqueItems) {
			const si = ctx.varCounter++;
			const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
			const isPrim = itemType === "string" || itemType === "number" || itemType === "integer";
			const maxItems = schema.maxItems;
			const failExpr = (iVar, jVar) => fail("uniqueItems", "uniqueItems", `{i:${iVar},j:${jVar}}`, `'must NOT have duplicate items (items ## '+${jVar}+' and '+${iVar}+' are identical)'`);
			let inner;
			if (isPrim && maxItems && maxItems <= 16) inner = `for(let _i=1;_i<${v}.length;_i++){for(let _k=0;_k<_i;_k++){if(${v}[_i]===${v}[_k]){${failExpr("_k", "_i")};break}}}`;
			else if (isPrim) inner = `const _s${si}=new Map();for(let _i=0;_i<${v}.length;_i++){const _prev=_s${si}.get(${v}[_i]);if(_prev!==undefined){${failExpr("_prev", "_i")};break};_s${si}.set(${v}[_i],_i)}`;
			else inner = `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Map();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);const _prev=_s${si}.get(_k);if(_prev!==undefined){${failExpr("_prev", "_i")};break};_s${si}.set(_k,_i)}`;
			lines.push(`if(Array.isArray(${v})){${inner}}`);
		}
		if (schema.minProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length<${schema.minProperties}){${fail("minProperties", "minProperties", `{limit:${schema.minProperties}}`, `'must NOT have fewer than ${schema.minProperties} properties'`)}}`);
		if (schema.maxProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length>${schema.maxProperties}){${fail("maxProperties", "maxProperties", `{limit:${schema.maxProperties}}`, `'must NOT have more than ${schema.maxProperties} properties'`)}}`);
		if (schema.additionalProperties === false && schema.properties) {
			const allowed = Object.keys(schema.properties).map((k) => `${JSON.stringify(k)}`).join(",");
			const ci = ctx.varCounter++;
			const inner = `const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++){if(!_a${ci}.has(_k${ci}[_i])){_e.push({keyword:'additionalProperties',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/additionalProperties',params:{additionalProperty:_k${ci}[_i]},message:'must NOT have additional properties'});if(!_all)return{valid:false,errors:_e}}}`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) for (const dep of deps) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}&&!(${JSON.stringify(dep)} in ${v})){_e.push({keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/dependentRequired',params:{missingProperty:'${esc(dep)}'},message:"must have required property '${esc(dep)}'"});if(!_all)return{valid:false,errors:_e}}`);
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const childPath = childPathExpr(pathExpr, esc(key));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeE(prop, `${v}[${JSON.stringify(key)}]`, childPath, lines, ctx, schemaPrefix + "/properties/" + key);
			lines.push(`}`);
		}
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			const ri = ctx.varCounter++;
			ctx.helperCode.push(`const _re${ri}=new RegExp(${JSON.stringify(pat)})`);
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){if(_re${ri}.test(_k${ki})){`);
			const p = pathExpr ? `${pathExpr}+'/'+_k${ki}` : `'/'+_k${ki}`;
			genCodeE(sub, `${v}[_k${ki}]`, p, lines, ctx, schemaPrefix + "/patternProperties");
			lines.push(`}}}`);
		}
		if (schema.dependentSchemas) for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeE(depSchema, v, pathExpr, lines, ctx, schemaPrefix + "/dependentSchemas/" + key);
			lines.push(`}`);
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object") {
			const pn = schema.propertyNames;
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){`);
			if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
			if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
			if (pn.pattern) {
				const ri = ctx.varCounter++;
				ctx.helperCode.push(`const _re${ri}=new RegExp(${JSON.stringify(pn.pattern)})`);
				lines.push(`if(!_re${ri}.test(_k${ki})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
			}
			if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
			if (pn.enum) {
				const ei = ctx.varCounter++;
				ctx.helperCode.push(`const _es${ei}=new Set(${JSON.stringify(pn.enum)})`);
				lines.push(`if(!_es${ei}.has(_k${ki})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
			}
			lines.push(`}}`);
		}
		if (schema.items) {
			const startIdx = schema.prefixItems ? schema.prefixItems.length : 0;
			const idx = `_j${ctx.varCounter}`;
			const elem = `_ei${ctx.varCounter}`;
			ctx.varCounter++;
			const childPath = childPathDynExpr(pathExpr, idx);
			lines.push(`if(Array.isArray(${v})){for(let ${idx}=${startIdx};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCodeE(schema.items, elem, childPath, lines, ctx, schemaPrefix + "/items");
			lines.push(`}}`);
		}
		if (schema.prefixItems) for (let i = 0; i < schema.prefixItems.length; i++) {
			const childPath = childPathExpr(pathExpr, String(i));
			lines.push(`if(Array.isArray(${v})&&${v}.length>${i}){`);
			genCodeE(schema.prefixItems[i], `${v}[${i}]`, childPath, lines, ctx, schemaPrefix + "/prefixItems/" + i);
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
			lines.push(`if(_cc${ci}<${minC}){${fail("contains", "contains", `{limit:${minC}}`, `'contains: need at least ${minC} match(es)'`)}}`);
			if (maxC !== void 0) lines.push(`if(_cc${ci}>${maxC}){${fail("contains", "contains", `{limit:${maxC}}`, `'contains: at most ${maxC} match(es)'`)}}`);
			lines.push(`}`);
		}
		if (schema.allOf) for (let _ai = 0; _ai < schema.allOf.length; _ai++) genCodeE(schema.allOf[_ai], v, pathExpr, lines, ctx, schemaPrefix + "/allOf/" + _ai);
		if (schema.anyOf) {
			const fi = ctx.varCounter++;
			const fns = schema.anyOf.map((sub, i) => {
				const subLines = [];
				genCode(sub, "_av", subLines, ctx);
				return subLines.length === 0 ? `function(_av){return true}` : `function(_av){${subLines.join(";")};return true}`;
			});
			lines.push(`{const _af${fi}=[${fns.join(",")}];let _am${fi}=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am${fi}=true;break}}if(!_am${fi}){${fail("anyOf", "anyOf", "{}", "'must match a schema in anyOf'")}}}`);
		}
		if (schema.oneOf) {
			const fi = ctx.varCounter++;
			const fns = schema.oneOf.map((sub, i) => {
				const subLines = [];
				genCode(sub, "_ov", subLines, ctx);
				return subLines.length === 0 ? `function(_ov){return true}` : `function(_ov){${subLines.join(";")};return true}`;
			});
			lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc${fi}=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc${fi}++;if(_oc${fi}>1)break}if(_oc${fi}!==1){${fail("oneOf", "oneOf", "{}", "'must match exactly one schema in oneOf'")}}}`);
		}
		if (schema.not) {
			const subLines = [];
			genCode(schema.not, "_nv", subLines, ctx);
			const nfn = subLines.length === 0 ? `function(_nv){return true}` : `function(_nv){${subLines.join(";")};return true}`;
			const fi = ctx.varCounter++;
			lines.push(`{const _nf${fi}=${nfn};if(_nf${fi}(${v})){${fail("not", "not", "{}", "'must NOT be valid'")}}}`);
		}
		if (schema.if) {
			const ifLines = [];
			genCode(schema.if, "_iv", ifLines, ctx);
			const fi = ctx.varCounter++;
			const ifFn = ifLines.length === 0 ? `function(_iv){return true}` : `function(_iv){${ifLines.join(";")};return true}`;
			lines.push(`{const _if${fi}=${ifFn}`);
			if (schema.then) {
				lines.push(`if(_if${fi}(${v})){`);
				genCodeE(schema.then, v, pathExpr, lines, ctx, schemaPrefix + "/then");
				lines.push(`}`);
			}
			if (schema.else) {
				lines.push(`${schema.then ? "else" : `if(!_if${fi}(${v}))`}{`);
				genCodeE(schema.else, v, pathExpr, lines, ctx, schemaPrefix + "/else");
				lines.push(`}`);
			}
			lines.push(`}`);
		}
	}
	function compileToJSCombined(schema, VALID_RESULT, schemaMap) {
		if (typeof schema === "object" && schema !== null) {
			const s = JSON.stringify(schema);
			if (s.includes("unevaluatedProperties") || s.includes("unevaluatedItems")) return null;
			if (s.includes("\"$ref\":\"#\"")) return null;
		}
		if (typeof schema === "boolean") return schema ? () => VALID_RESULT : () => ({
			valid: false,
			errors: [{
				keyword: "false schema",
				instancePath: "",
				schemaPath: "#",
				params: {},
				message: "boolean schema is false"
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
		const cRootDefs = schema.$defs || schema.definitions || null;
		const cAnchors = {};
		if (schema.$dynamicAnchor) cAnchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) cAnchors["#" + schema.$anchor] = schema;
		if (cRootDefs) {
			for (const def of Object.values(cRootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) cAnchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) cAnchors["#" + def.$anchor] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !cAnchors["#" + ext.$dynamicAnchor]) cAnchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !cAnchors["#" + ext.$anchor]) cAnchors["#" + ext.$anchor] = ext;
			}
		}
		const ctx = {
			varCounter: 0,
			helperCode: [],
			closureVars: [],
			closureVals: [],
			rootDefs: cRootDefs,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null,
			anchors: cAnchors,
			rootSchema: schema
		};
		const lines = [];
		genCodeC(schema, "d", "", lines, ctx, "#");
		if (lines.length === 0) return () => VALID_RESULT;
		const closureParams = ctx.closureVars.join(",");
		const inner = `let _e;\n  ` + (ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "") + lines.join("\n  ") + `\n  return _e?{valid:false,errors:_e}:R`;
		try {
			if (process.env.ATA_DUMP_CODEGEN) console.log("=== COMBINED CODEGEN ===\n" + inner + "\n=== CLOSURE VARS: " + ctx.closureVars.length + " ===");
			return new Function("R" + (closureParams ? "," + closureParams : ""), `return function(d){${inner}}`)(VALID_RESULT, ...ctx.closureVals);
		} catch (e) {
			if (process.env.ATA_DEBUG) console.error("compileToJSCombined error:", e.message, "\n", inner.slice(0, 500));
			return null;
		}
	}
	function genCodeC(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		if (!schemaPrefix) schemaPrefix = "#";
		if (typeof schema !== "object" || schema === null) return;
		if (schema.$ref) {
			if (schema.$ref === "#") return;
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeC(ctx.rootDefs[m[1]], v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (!m && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/")) {
				const entry = ctx.rootDefs && ctx.rootDefs[schema.$ref];
				const anchorTarget = entry && entry.raw ? entry.raw : ctx.anchors && ctx.anchors[schema.$ref];
				if (anchorTarget) {
					if (ctx.refStack.has(schema.$ref)) return;
					ctx.refStack.add(schema.$ref);
					genCodeC(anchorTarget, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
			if (ctx.schemaMap && ctx.schemaMap.has(schema.$ref)) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeC(ctx.schemaMap.get(schema.$ref), v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
		}
		if (schema.$dynamicRef) {
			const anchorKey = schema.$dynamicRef.startsWith("#") ? schema.$dynamicRef : "#" + schema.$dynamicRef;
			if (ctx.anchors && ctx.anchors[anchorKey]) {
				const target = ctx.anchors[anchorKey];
				if (target === ctx.rootSchema) {} else {
					const refKey = "$dynamicRef:" + anchorKey;
					if (!ctx.refStack.has(refKey)) {
						ctx.refStack.add(refKey);
						genCodeC(target, v, pathExpr, lines, ctx, schemaPrefix);
						ctx.refStack.delete(refKey);
					}
				}
			}
		}
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		let isObj = false, isArr = false, isStr = false, isNum = false;
		const isStaticPath = !pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+");
		const fail = (keyword, schemaSuffix, paramsCode, msgCode) => {
			const sp = schemaPrefix + "/" + schemaSuffix;
			if (isStaticPath && msgCode.startsWith("'") && !msgCode.includes("+")) {
				let paramsVal;
				try {
					paramsVal = Function("return " + paramsCode)();
				} catch {}
				if (paramsVal !== void 0) {
					const errVar = `_E${ctx.varCounter++}`;
					const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
					const msgVal = msgCode.slice(1, -1);
					ctx.closureVars.push(errVar);
					ctx.closureVals.push(Object.freeze({
						keyword,
						instancePath: pathVal,
						schemaPath: sp,
						params: Object.freeze(paramsVal),
						message: msgVal
					}));
					return `(_e||(_e=[])).push(${errVar})`;
				}
			}
			return `(_e||(_e=[])).push({keyword:'${keyword}',instancePath:${pathExpr || "\"\""},schemaPath:'${sp}',params:${paramsCode},message:${msgCode}})`;
		};
		if (types) {
			const conds = types.map((t) => {
				switch (t) {
					case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
					case "array": return `Array.isArray(${v})`;
					case "string": return `typeof ${v}==='string'`;
					case "number": return `(typeof ${v}==='number'&&isFinite(${v}))`;
					case "integer": return `Number.isInteger(${v})`;
					case "boolean": return `typeof ${v}==='boolean'`;
					case "null": return `${v}===null`;
					default: return "true";
				}
			});
			const expected = types.join(", ");
			const typeOk = `_tok${ctx.varCounter++}`;
			lines.push(`const ${typeOk}=${conds.join("||")}`);
			lines.push(`if(!${typeOk}){${fail("type", "type", `{type:'${expected}'}`, `'must be ${expected}'`)}}`);
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
			lines.push(`if(!(${allChecks || "false"})){${fail("enum", "enum", `{allowedValues:${JSON.stringify(schema.enum)}}`, "'must be equal to one of the allowed values'")}}`);
		}
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)}){${fail("const", "const", `{allowedValue:${JSON.stringify(schema.const)}}`, "'must be equal to constant'")}}`);
			else {
				const canonFn = `_cn${ctx.varCounter++}`;
				ctx.helperCode.push(`const ${canonFn}=function(x){if(x===null||typeof x!=='object')return JSON.stringify(x);if(Array.isArray(x))return'['+x.map(${canonFn}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+${canonFn}(x[k])}).join(',')+'}'};`);
				lines.push(`if(${canonFn}(${v})!==${canonFn}(JSON.parse(${JSON.stringify(JSON.stringify(cv))}))){${fail("const", "const", `{allowedValue:JSON.parse(${JSON.stringify(JSON.stringify(schema.const))})}`, "'must be equal to constant'")}}`);
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
				if (isStaticPath) {
					const errVar = `_E${ctx.varCounter++}`;
					const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
					ctx.closureVars.push(errVar);
					ctx.closureVals.push(Object.freeze({
						keyword: "required",
						instancePath: pathVal,
						schemaPath: `${schemaPrefix}/required`,
						params: Object.freeze({ missingProperty: key }),
						message: `must have required property '${key}'`
					}));
					lines.push(`if(${check}){(_e||(_e=[])).push(${errVar})}`);
				} else lines.push(`if(${check}){(_e||(_e=[])).push({keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/required',params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'"})}`);
			}
		} else if (schema.required) for (const key of schema.required) if (!pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+")) {
			const errVar = `_E${ctx.varCounter++}`;
			const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
			ctx.closureVars.push(errVar);
			ctx.closureVals.push(Object.freeze({
				keyword: "required",
				instancePath: pathVal,
				schemaPath: `${schemaPrefix}/required`,
				params: Object.freeze({ missingProperty: key }),
				message: `must have required property '${key}'`
			}));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!(${JSON.stringify(key)} in ${v})){(_e||(_e=[])).push(${errVar})}`);
		} else lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!(${JSON.stringify(key)} in ${v})){(_e||(_e=[])).push({keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/required',params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'"})}`);
		if (schema.minimum !== void 0) {
			const c = isNum ? `${v}<${schema.minimum}` : `typeof ${v}==='number'&&${v}<${schema.minimum}`;
			lines.push(`if(${c}){${fail("minimum", "minimum", `{comparison:'>=',limit:${schema.minimum}}`, `'must be >= ${schema.minimum}'`)}}`);
		}
		if (schema.maximum !== void 0) {
			const c = isNum ? `${v}>${schema.maximum}` : `typeof ${v}==='number'&&${v}>${schema.maximum}`;
			lines.push(`if(${c}){${fail("maximum", "maximum", `{comparison:'<=',limit:${schema.maximum}}`, `'must be <= ${schema.maximum}'`)}}`);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const c = isNum ? `${v}<=${schema.exclusiveMinimum}` : `typeof ${v}==='number'&&${v}<=${schema.exclusiveMinimum}`;
			lines.push(`if(${c}){${fail("exclusiveMinimum", "exclusiveMinimum", `{comparison:'>',limit:${schema.exclusiveMinimum}}`, `'must be > ${schema.exclusiveMinimum}'`)}}`);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const c = isNum ? `${v}>=${schema.exclusiveMaximum}` : `typeof ${v}==='number'&&${v}>=${schema.exclusiveMaximum}`;
			lines.push(`if(${c}){${fail("exclusiveMaximum", "exclusiveMaximum", `{comparison:'<',limit:${schema.exclusiveMaximum}}`, `'must be < ${schema.exclusiveMaximum}'`)}}`);
		}
		if (schema.multipleOf !== void 0) {
			const m = schema.multipleOf;
			const ci = ctx.varCounter++;
			lines.push(`{const _r${ci}=typeof ${v}==='number'?${v}%${m}:NaN;if(typeof ${v}==='number'&&Math.abs(_r${ci})>1e-8&&Math.abs(_r${ci}-${m})>1e-8){${fail("multipleOf", "multipleOf", `{multipleOf:${m}}`, `'must be multiple of ${m}'`)}}}`);
		}
		if (schema.minLength !== void 0) {
			const c = isStr ? `${v}.length<${schema.minLength}` : `typeof ${v}==='string'&&${v}.length<${schema.minLength}`;
			lines.push(`if(${c}){${fail("minLength", "minLength", `{limit:${schema.minLength}}`, `'must NOT have fewer than ${schema.minLength} characters'`)}}`);
		}
		if (schema.maxLength !== void 0) {
			const c = isStr ? `${v}.length>${schema.maxLength}` : `typeof ${v}==='string'&&${v}.length>${schema.maxLength}`;
			lines.push(`if(${c}){${fail("maxLength", "maxLength", `{limit:${schema.maxLength}}`, `'must NOT have more than ${schema.maxLength} characters'`)}}`);
		}
		if (schema.pattern) {
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) {
				const c = isStr ? `!(${inlineCheck})` : `typeof ${v}==='string'&&!(${inlineCheck})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, `'must match pattern "${schema.pattern}"'`)}}`);
			} else {
				const reVar = `_re${ctx.varCounter++}`;
				ctx.closureVars.push(reVar);
				ctx.closureVals.push(new RegExp(schema.pattern));
				const c = isStr ? `!${reVar}.test(${v})` : `typeof ${v}==='string'&&!${reVar}.test(${v})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, `'must match pattern "${schema.pattern}"'`)}}`);
			}
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) {
				const code = fc(v, isStr).replace(/return false/g, `{${fail("format", "format", `{format:'${esc(schema.format)}'}`, `'must match format "${esc(schema.format)}"'`)}}`);
				lines.push(code);
			}
		}
		if (schema.minItems !== void 0) {
			const c = isArr ? `${v}.length<${schema.minItems}` : `Array.isArray(${v})&&${v}.length<${schema.minItems}`;
			lines.push(`if(${c}){${fail("minItems", "minItems", `{limit:${schema.minItems}}`, `'must NOT have fewer than ${schema.minItems} items'`)}}`);
		}
		if (schema.maxItems !== void 0) {
			const c = isArr ? `${v}.length>${schema.maxItems}` : `Array.isArray(${v})&&${v}.length>${schema.maxItems}`;
			lines.push(`if(${c}){${fail("maxItems", "maxItems", `{limit:${schema.maxItems}}`, `'must NOT have more than ${schema.maxItems} items'`)}}`);
		}
		if (schema.uniqueItems) {
			const si = ctx.varCounter++;
			const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
			const isPrim = itemType === "string" || itemType === "number" || itemType === "integer";
			const maxItems = schema.maxItems;
			const failExpr = (iVar, jVar) => fail("uniqueItems", "uniqueItems", `{i:${iVar},j:${jVar}}`, `'must NOT have duplicate items (items ## '+${jVar}+' and '+${iVar}+' are identical)'`);
			let inner;
			if (isPrim && maxItems && maxItems <= 16) inner = `for(let _i=1;_i<${v}.length;_i++){for(let _k=0;_k<_i;_k++){if(${v}[_i]===${v}[_k]){${failExpr("_k", "_i")};break}}}`;
			else if (isPrim) inner = `const _s${si}=new Map();for(let _i=0;_i<${v}.length;_i++){const _prev=_s${si}.get(${v}[_i]);if(_prev!==undefined){${failExpr("_prev", "_i")};break};_s${si}.set(${v}[_i],_i)}`;
			else inner = `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Map();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);const _prev=_s${si}.get(_k);if(_prev!==undefined){${failExpr("_prev", "_i")};break};_s${si}.set(_k,_i)}`;
			lines.push(isArr ? `{${inner}}` : `if(Array.isArray(${v})){${inner}}`);
		}
		if (schema.minProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length<${schema.minProperties}){${fail("minProperties", "minProperties", `{limit:${schema.minProperties}}`, `'must NOT have fewer than ${schema.minProperties} properties'`)}}`);
		if (schema.maxProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length>${schema.maxProperties}){${fail("maxProperties", "maxProperties", `{limit:${schema.maxProperties}}`, `'must NOT have more than ${schema.maxProperties} properties'`)}}`);
		if (schema.additionalProperties === false && schema.properties && !schema.patternProperties) {
			const propKeys = Object.keys(schema.properties);
			const ci = ctx.varCounter++;
			if (propKeys.length <= 8) {
				const checks = propKeys.map((k) => `_k${ci}[_i]!==${JSON.stringify(k)}`).join("&&");
				lines.push(isObj ? `{const _k${ci}=Object.keys(${v});for(let _i=0;_i<_k${ci}.length;_i++)if(${checks}){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){const _k${ci}=Object.keys(${v});for(let _i=0;_i<_k${ci}.length;_i++)if(${checks}){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}}`);
			} else {
				const allowed = propKeys.map((k) => JSON.stringify(k)).join(",");
				lines.push(isObj ? `{const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++)if(!_a${ci}.has(_k${ci}[_i])){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++)if(!_a${ci}.has(_k${ci}[_i])){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}}`);
			}
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) for (const dep of deps) if (!pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+")) {
			const errVar = `_E${ctx.varCounter++}`;
			const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
			ctx.closureVars.push(errVar);
			ctx.closureVals.push(Object.freeze({
				keyword: "required",
				instancePath: pathVal,
				schemaPath: `${schemaPrefix}/dependentRequired`,
				params: Object.freeze({ missingProperty: dep }),
				message: `must have required property '${dep}'`
			}));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}&&!(${JSON.stringify(dep)} in ${v})){(_e||(_e=[])).push(${errVar})}`);
		} else lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}&&!(${JSON.stringify(dep)} in ${v})){(_e||(_e=[])).push({keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/dependentRequired',params:{missingProperty:'${esc(dep)}'},message:"must have required property '${esc(dep)}'"})}`);
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const pv = hoisted[key] || `${v}[${JSON.stringify(key)}]`;
			const childPath = childPathExpr(pathExpr, esc(key));
			if (requiredSet.has(key) && isObj) {
				lines.push(`if(${pv}!==undefined){`);
				genCodeC(prop, pv, childPath, lines, ctx, schemaPrefix + "/properties/" + key);
				lines.push(`}`);
			} else if (isObj) {
				const oi = ctx.varCounter++;
				lines.push(`{const _o${oi}=${v}[${JSON.stringify(key)}];if(_o${oi}!==undefined){`);
				genCodeC(prop, `_o${oi}`, childPath, lines, ctx, schemaPrefix + "/properties/" + key);
				lines.push(`}}`);
			} else {
				lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
				genCodeC(prop, `${v}[${JSON.stringify(key)}]`, childPath, lines, ctx, schemaPrefix + "/properties/" + key);
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
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(new RegExp(pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
					}
				}
				const matchExpr = keyCheck || `_as${pi}.has(${kVar})`;
				lines.push(`let _m${pi}=${matchExpr}`);
				for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}){_m${pi}=true;if(!_ppf${pi}_${i}(${v}[${kVar}])){${fail("pattern", "patternProperties", `{pattern:'${ppEntries[i][0]}'}`, `'patternProperties: value invalid for key '+${kVar}`)}}}`);
				lines.push(`if(!_m${pi}){${fail("additionalProperties", "additionalProperties", `{additionalProperty:${kVar}}`, "'must NOT have additional properties'")}}`);
				lines.push(`}}`);
			} else {
				ctx._ppHandledPropertyNamesC = !!pn;
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(new RegExp(pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
					}
				}
				for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}&&!_ppf${pi}_${i}(${v}[${kVar}])){${fail("pattern", "patternProperties", `{pattern:'${ppEntries[i][0]}'}`, `'patternProperties: value invalid for key '+${kVar}`)}}`);
				lines.push(`}}`);
			}
		}
		if (schema.dependentSchemas) for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeC(depSchema, v, pathExpr, lines, ctx, schemaPrefix + "/dependentSchemas/" + key);
			lines.push(`}`);
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !ctx._ppHandledPropertyNamesC) {
			const pn = schema.propertyNames;
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){`);
			if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
			if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
			if (pn.pattern) {
				const ri = ctx.varCounter++;
				ctx.closureVars.push(`_re${ri}`);
				ctx.closureVals.push(new RegExp(pn.pattern));
				lines.push(`if(!_re${ri}.test(_k${ki})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
			}
			if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
			if (pn.enum) {
				const ei = ctx.varCounter++;
				ctx.closureVars.push(`_es${ei}`);
				ctx.closureVals.push(new Set(pn.enum));
				lines.push(`if(!_es${ei}.has(_k${ki})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
			}
			lines.push(`}}`);
		}
		if (schema.items) {
			const startIdx = schema.prefixItems ? schema.prefixItems.length : 0;
			const idx = `_j${ctx.varCounter}`, elem = `_ei${ctx.varCounter}`;
			ctx.varCounter++;
			const childPath = childPathDynExpr(pathExpr, idx);
			lines.push(`if(Array.isArray(${v})){for(let ${idx}=${startIdx};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCodeC(schema.items, elem, childPath, lines, ctx, schemaPrefix + "/items");
			lines.push(`}}`);
		}
		if (schema.prefixItems) for (let i = 0; i < schema.prefixItems.length; i++) {
			const childPath = childPathExpr(pathExpr, String(i));
			lines.push(`if(Array.isArray(${v})&&${v}.length>${i}){`);
			genCodeC(schema.prefixItems[i], `${v}[${i}]`, childPath, lines, ctx, schemaPrefix + "/prefixItems/" + i);
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
			lines.push(`if(_cc${ci}<${minC}){${fail("contains", "contains", `{limit:${minC}}`, `'contains: need at least ${minC} match(es)'`)}}`);
			if (maxC !== void 0) lines.push(`if(_cc${ci}>${maxC}){${fail("contains", "contains", `{limit:${maxC}}`, `'contains: at most ${maxC} match(es)'`)}}`);
			lines.push(`}`);
		}
		if (schema.allOf) for (let _ai = 0; _ai < schema.allOf.length; _ai++) genCodeC(schema.allOf[_ai], v, pathExpr, lines, ctx, schemaPrefix + "/allOf/" + _ai);
		if (schema.anyOf) {
			const fi = ctx.varCounter++;
			const fns = schema.anyOf.map((sub) => {
				const sl = [];
				genCode(sub, "_av", sl, ctx);
				return sl.length === 0 ? `function(_av){return true}` : `function(_av){${sl.join(";")};return true}`;
			});
			lines.push(`{const _af${fi}=[${fns.join(",")}];let _am=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am=true;break}}if(!_am){${fail("anyOf", "anyOf", "{}", "'must match a schema in anyOf'")}}}`);
		}
		if (schema.oneOf) {
			const fi = ctx.varCounter++;
			const fns = schema.oneOf.map((sub) => {
				const sl = [];
				genCode(sub, "_ov", sl, ctx);
				return sl.length === 0 ? `function(_ov){return true}` : `function(_ov){${sl.join(";")};return true}`;
			});
			lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc++;if(_oc>1)break}if(_oc!==1){${fail("oneOf", "oneOf", "{}", "'must match exactly one schema in oneOf'")}}}`);
		}
		if (schema.not) {
			const sl = [];
			genCode(schema.not, "_nv", sl, ctx);
			const nfn = sl.length === 0 ? `function(_nv){return true}` : `function(_nv){${sl.join(";")};return true}`;
			const fi = ctx.varCounter++;
			lines.push(`{const _nf${fi}=${nfn};if(_nf${fi}(${v})){${fail("not", "not", "{}", "'must NOT be valid'")}}}`);
		}
		if (schema.if) {
			const sl = [];
			genCode(schema.if, "_iv", sl, ctx);
			const fi = ctx.varCounter++;
			const ifFn = sl.length === 0 ? `function(_iv){return true}` : `function(_iv){${sl.join(";")};return true}`;
			lines.push(`{const _if${fi}=${ifFn}`);
			if (schema.then) {
				lines.push(`if(_if${fi}(${v})){`);
				genCodeC(schema.then, v, pathExpr, lines, ctx, schemaPrefix + "/then");
				lines.push(`}`);
			}
			if (schema.else) {
				lines.push(`${schema.then ? "else" : `if(!_if${fi}(${v}))`}{`);
				genCodeC(schema.else, v, pathExpr, lines, ctx, schemaPrefix + "/else");
				lines.push(`}`);
			}
			lines.push(`}`);
		}
		if (types) lines.push(`}`);
	}
	function collectEvaluated(schema, schemaMap, rootDefs) {
		if (typeof schema !== "object" || schema === null) return {
			props: [],
			items: null,
			allProps: false,
			allItems: false,
			dynamic: false
		};
		const defs = rootDefs || schema.$defs || schema.definitions || null;
		const result = {
			props: [],
			items: null,
			allProps: false,
			allItems: false,
			dynamic: false
		};
		_collectEval(schema, result, defs, schemaMap, /* @__PURE__ */ new Set(), true);
		return result;
	}
	function _collectEval(schema, result, defs, schemaMap, refStack, isRoot) {
		if (typeof schema !== "object" || schema === null) return;
		if (result.allProps && result.allItems) return;
		if (schema.$ref) {
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && defs && defs[m[1]]) {
				if (refStack.has(schema.$ref)) {
					result.dynamic = true;
					return;
				}
				refStack.add(schema.$ref);
				_collectEval(defs[m[1]], result, defs, schemaMap, refStack);
				refStack.delete(schema.$ref);
			} else if (schemaMap && typeof schemaMap.get === "function") {
				let resolved = schemaMap.has(schema.$ref) ? schemaMap.get(schema.$ref) : null;
				if (!resolved && !schema.$ref.includes("://") && !schema.$ref.startsWith("#")) {
					for (const [id, s] of schemaMap) if (id.endsWith("/" + schema.$ref)) {
						resolved = s;
						break;
					}
				}
				if (resolved) {
					if (refStack.has(schema.$ref)) {
						result.dynamic = true;
						return;
					}
					refStack.add(schema.$ref);
					_collectEval(resolved, result, defs, schemaMap, refStack);
					refStack.delete(schema.$ref);
				}
			}
			if (!Object.keys(schema).some((k) => k !== "$ref" && k !== "$defs" && k !== "definitions" && k !== "$schema" && k !== "$id")) return;
		}
		if (schema.properties) {
			for (const k of Object.keys(schema.properties)) if (!result.props.includes(k)) result.props.push(k);
		}
		if (schema.additionalProperties !== void 0 && schema.additionalProperties !== false) result.allProps = true;
		if (schema.patternProperties) result.dynamic = true;
		if (schema.prefixItems) {
			const count = schema.prefixItems.length;
			result.items = result.items === null ? count : Math.max(result.items, count);
		}
		if (schema.items && typeof schema.items === "object") result.allItems = true;
		if (schema.items === true) result.allItems = true;
		if (schema.contains) result.dynamic = true;
		if (!isRoot && (schema.unevaluatedProperties === true || typeof schema.unevaluatedProperties === "object" && schema.unevaluatedProperties !== null)) result.allProps = true;
		if (!isRoot && (schema.unevaluatedItems === true || typeof schema.unevaluatedItems === "object" && schema.unevaluatedItems !== null)) result.allItems = true;
		if (schema.allOf) for (const sub of schema.allOf) _collectEval(sub, result, defs, schemaMap, refStack);
		if (schema.anyOf || schema.oneOf) {
			result.dynamic = true;
			const branches = schema.anyOf || schema.oneOf;
			for (const sub of branches) _collectEval(sub, result, defs, schemaMap, refStack);
		}
		if (schema.if && (schema.then || schema.else)) {
			result.dynamic = true;
			_collectEval(schema.if, result, defs, schemaMap, refStack);
			if (schema.then) _collectEval(schema.then, result, defs, schemaMap, refStack);
			if (schema.else) _collectEval(schema.else, result, defs, schemaMap, refStack);
		} else if (schema.if) {
			result.dynamic = true;
			if (schema.if.properties) {
				for (const k of Object.keys(schema.if.properties)) if (!result.props.includes(k)) result.props.push(k);
			}
			if (schema.if.patternProperties) {}
		}
		if (schema.dependentSchemas) {
			result.dynamic = true;
			for (const sub of Object.values(schema.dependentSchemas)) _collectEval(sub, result, defs, schemaMap, refStack);
		}
	}
	module.exports = {
		compileToJS,
		compileToJSCodegen,
		compileToJSCodegenWithErrors,
		compileToJSCombined,
		collectEvaluated,
		AJV_MESSAGES
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@0.9.3/node_modules/ata-validator/lib/draft7.js
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
//#region ../node_modules/.pnpm/ata-validator@0.9.3/node_modules/ata-validator/package.json
var require_package = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"name": "ata-validator",
		"version": "0.9.3",
		"description": "Ultra-fast JSON Schema validator. 4.7x faster validation, 1,800x faster compilation. Works without native addon. Cross-schema $ref, Draft 2020-12 + Draft 7, V8-optimized JS codegen, simdjson, RE2, multi-core. Standard Schema V1 compatible.",
		"main": "index.js",
		"module": "index.mjs",
		"types": "index.d.ts",
		"exports": {
			".": {
				"types": "./index.d.ts",
				"browser": {
					"import": "./index.browser.mjs",
					"require": "./index.js"
				},
				"import": "./index.mjs",
				"require": "./index.js"
			},
			"./compat": {
				"types": "./compat.d.ts",
				"import": "./compat.mjs",
				"require": "./compat.js"
			},
			"./package.json": "./package.json"
		},
		"sideEffects": false,
		"browser": { "pkg-prebuilds": false },
		"scripts": {
			"install": "node scripts/install.js",
			"build": "cmake-js build --target ata",
			"rebuild": "cmake-js rebuild --target ata",
			"prebuild": "pkg-prebuilds-copy --baseDir build/Release --source ata.node --name=ata --strip --napi_version=10",
			"prebuild-all": "npm run prebuild -- --arch x64 && npm run prebuild -- --arch arm64",
			"test": "node test.js",
			"test:suite": "node tests/run_suite.js",
			"test:compat": "node tests/test_compat.js",
			"test:standard-schema": "node tests/test_standard_schema.js",
			"test:browser": "node tests/test_browser.js",
			"bench": "node benchmark/bench_large.js",
			"fuzz": "node tests/fuzz_differential.js",
			"fuzz:long": "FUZZ_ITERATIONS=100000 node tests/fuzz_differential.js",
			"test:json-suite": "node tests/run_json_test_suite.js"
		},
		"keywords": [
			"json",
			"json-schema",
			"schema",
			"validator",
			"validation",
			"fast",
			"native",
			"simdjson",
			"napi",
			"ajv",
			"ajv-alternative",
			"standard-schema",
			"fastify"
		],
		"author": "Mert Can Altin <mertcanaltin01@gmail.com>",
		"license": "MIT",
		"repository": {
			"type": "git",
			"url": "git+https://github.com/mertcanaltin/ata-validator.git"
		},
		"bugs": { "url": "https://github.com/mertcanaltin/ata-validator/issues" },
		"homepage": "https://ata-validator.com",
		"engines": { "node": ">=18.0.0" },
		"files": [
			"index.js",
			"index.mjs",
			"index.browser.mjs",
			"index.d.ts",
			"lib/",
			"compat.js",
			"compat.mjs",
			"compat.d.ts",
			"binding-options.js",
			"binding/",
			"include/",
			"src/",
			"deps/",
			"prebuilds/",
			"scripts/",
			"CMakeLists.txt",
			"README.md",
			"LICENSE"
		],
		"dependencies": {
			"node-addon-api": "^8.7.0",
			"node-api-headers": "^1.8.0",
			"pkg-prebuilds": "^1.0.0"
		},
		"devDependencies": {
			"@sinclair/typebox": "^0.34.49",
			"cmake-js": "^8.0.0",
			"mitata": "^1.0.34",
			"typebox": "^1.1.7",
			"valibot": "^1.3.1",
			"zod": "^4.3.6"
		},
		"binary": { "napi_versions": [10] }
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@0.9.3/node_modules/ata-validator/index.js
var require_ata_validator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let native;
	try {
		native = require_ata_validator$1()(__dirname, require_binding_options());
	} catch {}
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
	const _identityCache = /* @__PURE__ */ new WeakMap();
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
		if (typeof Buffer === "undefined") throw new Error("createPaddedBuffer requires Node.js Buffer");
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
			if (!opts && typeof schema === "object" && schema !== null) {
				const hit = _identityCache.get(schema);
				if (hit) return hit;
			}
			normalizeDraft7(schemaObj);
			this._schemaStr = null;
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
			this.validateAndParse = (jsonStr) => {
				if (!native) throw new Error("Native addon required for validateAndParse()");
				this._ensureCompiled();
				return this.validateAndParse(jsonStr);
			};
			this.isValid = (buf) => {
				if (!native) throw new Error("Native addon required for isValid() — use validate() or isValidObject() instead");
				this._ensureCompiled();
				return this.isValid(buf);
			};
			this.countValid = (ndjsonBuf) => {
				if (!native) throw new Error("Native addon required for countValid()");
				this._ensureCompiled();
				return this.countValid(ndjsonBuf);
			};
			this.batchIsValid = (buffers) => {
				if (!native) throw new Error("Native addon required for batchIsValid()");
				this._ensureCompiled();
				return this.batchIsValid(buffers);
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
							path: parsePointerPath(err.instancePath)
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
			if (!this._schemaStr) this._schemaStr = JSON.stringify(schemaObj);
			const sm = this._schemaMap.size > 0 ? this._schemaMap : null;
			const mapKey = this._schemaMap.size > 0 ? this._schemaStr + "\0" + [...this._schemaMap.keys()].sort().join("\0") : this._schemaStr;
			const cached = _compileCache.get(mapKey);
			let jsFn, jsCombinedFn, jsErrFn, _isCodegen = false;
			var _forceNapi = typeof process !== "undefined" && process.env && process.env.ATA_FORCE_NAPI;
			if (cached && !_forceNapi) {
				jsFn = cached.jsFn;
				jsCombinedFn = cached.combined;
				jsErrFn = cached.errFn;
				_isCodegen = !!cached.isCodegen;
			} else if (!_forceNapi) {
				const _cgFn = compileToJSCodegen(schemaObj, sm);
				jsFn = _cgFn || compileToJS(schemaObj, null, sm);
				jsCombinedFn = compileToJSCombined(schemaObj, VALID_RESULT, sm);
				jsErrFn = compileToJSCodegenWithErrors(schemaObj, sm);
				_isCodegen = !!_cgFn;
				_compileCache.set(mapKey, {
					jsFn,
					combined: jsCombinedFn,
					errFn: jsErrFn,
					isCodegen: _isCodegen
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
				const hasUnevaluated = schemaObj && (schemaObj.unevaluatedProperties !== void 0 || schemaObj.unevaluatedItems !== void 0 || this._schemaStr.includes("unevaluatedProperties") || this._schemaStr.includes("unevaluatedItems"));
				const hasDynRef = this._schemaStr.includes("\"$dynamicRef\"") || this._schemaStr.includes("\"$dynamicAnchor\"");
				const errFn = safeErrFn || (hasUnevaluated ? (d) => ({
					valid: jsFn(d),
					errors: jsFn(d) ? [] : [{
						code: "unevaluated",
						path: "",
						message: "unevaluated property or item"
					}]
				}) : hasDynRef ? (d) => {
					this._ensureNative();
					return this._compiled.validateJSON(JSON.stringify(d));
				} : (d) => {
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
				if (hasDynRef && _isCodegen && jsFn) {
					const _fn = jsFn, _efn = safeErrFn || errFn, _R = VALID_RESULT;
					this.validate = preprocess ? (data) => {
						preprocess(data);
						return _fn(data) ? _R : _efn(data);
					} : (data) => _fn(data) ? _R : _efn(data);
				} else if (hasDynRef) this.validate = preprocess ? (data) => {
					preprocess(data);
					return errFn(data);
				} : errFn;
				else if (jsFn && jsFn._hybridFactory) {
					const hybridFn = jsFn._hybridFactory(VALID_RESULT, safeCombinedFn || errFn);
					this.validate = preprocess ? (data) => {
						preprocess(data);
						return hybridFn(data);
					} : hybridFn;
				} else if (safeCombinedFn) this.validate = preprocess ? (data) => {
					preprocess(data);
					return safeCombinedFn(data);
				} : safeCombinedFn;
				else {
					const hybridFn = jsFn && jsFn._hybridFactory ? jsFn._hybridFactory(VALID_RESULT, errFn) : null;
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
				this.validateJSON = useSimdjsonForLarge && native ? (jsonStr) => {
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
						if (!native) return {
							valid: false,
							errors: [{
								keyword: "syntax",
								instancePath: "",
								schemaPath: "#",
								params: {},
								message: e.message
							}]
						};
					}
					this._ensureNative();
					return this._compiled.validateJSON(jsonStr);
				};
				this.isValidJSON = useSimdjsonForLarge && native ? (jsonStr) => {
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
				if (native) {
					const self = this;
					this.validateAndParse = (jsonStr) => {
						self._ensureNative();
						self.validateAndParse = (s) => self._compiled.validateAndParse(s);
						return self.validateAndParse(jsonStr);
					};
				} else this.validateAndParse = () => {
					throw new Error("Native addon required for validateAndParse()");
				};
				if (native) {
					const self = this;
					this.isValid = (buf) => {
						self._ensureNative();
						const slot = self._fastSlot;
						self.isValid = (b) => {
							if (typeof b === "string") b = Buffer.from(b);
							return native.rawFastValidate(slot, b);
						};
						return self.isValid(buf);
					};
					this.countValid = (ndjsonBuf) => {
						self._ensureNative();
						const slot = self._fastSlot;
						self.countValid = (b) => {
							if (typeof b === "string") b = Buffer.from(b);
							const r = native.rawNDJSONValidate(slot, b);
							let c = 0;
							for (let i = 0; i < r.length; i++) if (r[i]) c++;
							return c;
						};
						return self.countValid(ndjsonBuf);
					};
					this.batchIsValid = (buffers) => {
						self._ensureNative();
						const slot = self._fastSlot;
						self.batchIsValid = (bufs) => {
							let v = 0;
							for (const b of bufs) if (native.rawFastValidate(slot, b)) v++;
							return v;
						};
						return self.batchIsValid(buffers);
					};
				}
			} else if (native) {
				this._ensureNative();
				const _validate = this._schemaStr.includes("\"$dynamicRef\"") || this._schemaStr.includes("\"$dynamicAnchor\"") || this._schemaStr.includes("\"$anchor\"") ? (data) => this._compiled.validateJSON(JSON.stringify(data)) : (data) => this._compiled.validate(data);
				this.validate = preprocess ? (data) => {
					preprocess(data);
					return _validate(data);
				} : _validate;
				this.isValidObject = (data) => _validate(data).valid;
				this.validateJSON = (jsonStr) => this._compiled.validateJSON(jsonStr);
				this.isValidJSON = (jsonStr) => this._compiled.isValidJSON(jsonStr);
				this.validateAndParse = (jsonStr) => this._compiled.validateAndParse(jsonStr);
				{
					const slot = this._fastSlot;
					this.isValid = (buf) => {
						if (typeof buf === "string") buf = Buffer.from(buf);
						return native.rawFastValidate(slot, buf);
					};
				}
				{
					const slot = this._fastSlot;
					this.countValid = (ndjsonBuf) => {
						if (typeof ndjsonBuf === "string") ndjsonBuf = Buffer.from(ndjsonBuf);
						const results = native.rawNDJSONValidate(slot, ndjsonBuf);
						let count = 0;
						for (let i = 0; i < results.length; i++) if (results[i]) count++;
						return count;
					};
				}
				{
					const slot = this._fastSlot;
					this.batchIsValid = (buffers) => {
						let valid = 0;
						for (const buf of buffers) if (native.rawFastValidate(slot, buf)) valid++;
						return valid;
					};
				}
			}
			if (this._schemaObj && typeof this._schemaObj === "object") _identityCache.set(this._schemaObj, this);
		}
		_ensureNative() {
			if (this._nativeReady) return;
			this._nativeReady = true;
			if (!native) return;
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
			if (typeof process !== "undefined" && process.env && process.env.ATA_FORCE_NAPI) return;
			if (!this._schemaStr) this._schemaStr = JSON.stringify(this._schemaObj);
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
			v.validateAndParse = native ? (jsonStr) => {
				v._ensureNative();
				v.validateAndParse = (s) => v._compiled.validateAndParse(s);
				return v.validateAndParse(jsonStr);
			} : () => {
				throw new Error("Native addon required for validateAndParse()");
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
							path: parsePointerPath(e.instancePath)
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
			if (!native) throw new Error("Native addon required for isValid() — install build tools or use validate() instead");
			this._ensureNative();
			return native.rawFastValidate(this._fastSlot, input);
		}
		isValidPrepadded(paddedBuffer, jsonLength) {
			if (!native) throw new Error("Native addon required for isValidPrepadded()");
			this._ensureNative();
			return native.rawFastValidate(this._fastSlot, paddedBuffer, jsonLength);
		}
		isValidParallel(buffer) {
			if (!native) throw new Error("Native addon required for isValidParallel()");
			this._ensureNative();
			return native.rawParallelValidate(this._fastSlot, buffer);
		}
		countValid(buffer) {
			if (!native) throw new Error("Native addon required for countValid()");
			this._ensureNative();
			return native.rawParallelCount(this._fastSlot, buffer);
		}
		isValidNDJSON(buffer) {
			if (!native) throw new Error("Native addon required for isValidNDJSON()");
			this._ensureNative();
			return native.rawNDJSONValidate(this._fastSlot, buffer);
		}
	};
	function validate(schema, data) {
		if (native) {
			const schemaStr = typeof schema === "string" ? schema : JSON.stringify(schema);
			return native.validate(schemaStr, data);
		}
		return new Validator(typeof schema === "string" ? JSON.parse(schema) : schema).validate(data);
	}
	function version() {
		if (native) return native.version();
		try {
			return require_package().version;
		} catch {
			return "unknown";
		}
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
	const parseJSON = native ? native.parseJSON : JSON.parse;
	const _compileFnCache = /* @__PURE__ */ new WeakMap();
	function compile(schema, opts) {
		if (!opts && typeof schema === "object" && schema !== null) {
			const hit = _compileFnCache.get(schema);
			if (hit) return hit;
		}
		const v = new Validator(schema, opts);
		v._ensureCompiled();
		const fn = v.validate;
		if (!opts && typeof schema === "object" && schema !== null) _compileFnCache.set(schema, fn);
		return fn;
	}
	module.exports = {
		Validator,
		compile,
		validate,
		version,
		createPaddedBuffer,
		SIMDJSON_PADDING,
		parseJSON
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@0.9.3/node_modules/ata-validator/index.browser.mjs
var import_keywords = require_keywords();
const { Validator, validate, version, createPaddedBuffer, SIMDJSON_PADDING } = (/* @__PURE__ */ __toESM(require_ata_validator(), 1)).default;
//#endregion
//#region ../schemas/libraries/ata-validator/download.ts
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
(0, import_keywords.withKeywords)(new Validator({
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
