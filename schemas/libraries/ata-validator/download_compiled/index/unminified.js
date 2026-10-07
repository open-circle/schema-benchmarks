//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region ../node_modules/.pnpm/@ata-project+keywords@0.3.3_ata-validator@1.45.0_yaml@2.9.1_/node_modules/@ata-project/keywords/index.js
var require_keywords$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
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
	function compileNode(schema) {
		const ops = [];
		if (!schema || typeof schema !== "object") return ops;
		if (schema.instanceof) {
			const types = Array.isArray(schema.instanceof) ? schema.instanceof : [schema.instanceof];
			const ctors = types.map((t) => CONSTRUCTORS[t]).filter(Boolean);
			if (ctors.length > 0) ops.push({
				type: "instanceof",
				ctors,
				types
			});
		}
		if (schema.typeof) {
			const types = Array.isArray(schema.typeof) ? schema.typeof : [schema.typeof];
			ops.push({
				type: "typeof",
				types
			});
		}
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const child = compileNode(prop);
			if (child.length > 0) ops.push({
				type: "prop",
				key,
				ops: child
			});
		}
		if (schema.items && typeof schema.items === "object" && !Array.isArray(schema.items)) {
			const item = compileNode(schema.items);
			if (item.length > 0) ops.push({
				type: "items",
				ops: item
			});
		}
		if (Array.isArray(schema.prefixItems)) {
			const tuple = schema.prefixItems.map(compileNode);
			if (tuple.some((o) => o.length > 0)) ops.push({
				type: "prefixItems",
				tuple
			});
		}
		return ops;
	}
	function makeError(keyword, path, types) {
		const expected = types.join(" | ");
		return {
			keyword,
			instancePath: path,
			schemaPath: "",
			params: { expected },
			message: "expected " + keyword + " " + expected
		};
	}
	function runOps(value, ops, path, errors) {
		for (let i = 0; i < ops.length; i++) {
			const op = ops[i];
			if (op.type === "instanceof") {
				let match = false;
				for (let j = 0; j < op.ctors.length; j++) if (value instanceof op.ctors[j]) {
					match = true;
					break;
				}
				if (!match) errors.push(makeError("instanceof", path, op.types));
			} else if (op.type === "typeof") {
				let match = false;
				for (let j = 0; j < op.types.length; j++) if (typeof value === op.types[j]) {
					match = true;
					break;
				}
				if (!match) errors.push(makeError("typeof", path, op.types));
			} else if (op.type === "prop") {
				if (value && typeof value === "object") {
					const v = value[op.key];
					if (v !== void 0) runOps(v, op.ops, path + "/" + op.key, errors);
				}
			} else if (op.type === "items") {
				if (Array.isArray(value)) for (let k = 0; k < value.length; k++) runOps(value[k], op.ops, path + "/" + k, errors);
			} else if (op.type === "prefixItems") {
				if (Array.isArray(value)) {
					const n = op.tuple.length < value.length ? op.tuple.length : value.length;
					for (let k = 0; k < n; k++) if (op.tuple[k].length > 0) runOps(value[k], op.tuple[k], path + "/" + k, errors);
				}
			}
		}
	}
	function buildCheck(ops) {
		const checks = [];
		for (let i = 0; i < ops.length; i++) {
			const op = ops[i];
			if (op.type === "instanceof") {
				const ctors = op.ctors;
				if (ctors.length === 1) {
					const C = ctors[0];
					checks.push((v) => v instanceof C);
				} else checks.push((v) => {
					for (let j = 0; j < ctors.length; j++) if (v instanceof ctors[j]) return true;
					return false;
				});
			} else if (op.type === "typeof") {
				const types = op.types;
				if (types.length === 1) {
					const t = types[0];
					checks.push((v) => typeof v === t);
				} else checks.push((v) => {
					for (let j = 0; j < types.length; j++) if (typeof v === types[j]) return true;
					return false;
				});
			} else if (op.type === "prop") {
				const key = op.key;
				const child = buildCheck(op.ops);
				checks.push((v) => {
					if (v === null || typeof v !== "object") return true;
					const inner = v[key];
					return inner === void 0 ? true : child(inner);
				});
			} else if (op.type === "items") {
				const child = buildCheck(op.ops);
				checks.push((v) => {
					if (!Array.isArray(v)) return true;
					for (let k = 0; k < v.length; k++) if (!child(v[k])) return false;
					return true;
				});
			} else if (op.type === "prefixItems") {
				const tuple = op.tuple.map((o) => o.length > 0 ? buildCheck(o) : null);
				checks.push((v) => {
					if (!Array.isArray(v)) return true;
					const n = tuple.length < v.length ? tuple.length : v.length;
					for (let k = 0; k < n; k++) {
						const c = tuple[k];
						if (c !== null && !c(v[k])) return false;
					}
					return true;
				});
			}
		}
		if (checks.length === 1) return checks[0];
		return (v) => {
			for (let i = 0; i < checks.length; i++) if (!checks[i](v)) return false;
			return true;
		};
	}
	function buildSource(ops) {
		const ctors = [];
		let n = 0;
		const name = () => "_" + n++;
		const ctorRef = (C) => {
			let i = ctors.indexOf(C);
			if (i === -1) i = ctors.push(C) - 1;
			return "c" + i;
		};
		const emit = (list, expr) => {
			let out = "";
			for (let i = 0; i < list.length; i++) {
				const op = list[i];
				if (op.type === "instanceof") {
					const test = op.ctors.map((C) => expr + " instanceof " + ctorRef(C)).join("||");
					out += "if(!(" + test + "))return false\n";
				} else if (op.type === "typeof") {
					const test = op.types.map((t) => "typeof " + expr + "===" + JSON.stringify(t)).join("||");
					out += "if(!(" + test + "))return false\n";
				} else if (op.type === "prop") {
					const v = name();
					out += "if(" + expr + "!==null&&typeof " + expr + "==='object'){";
					out += "const " + v + "=" + expr + "[" + JSON.stringify(op.key) + "]\n";
					out += "if(" + v + "!==undefined){\n" + emit(op.ops, v) + "}}\n";
				} else if (op.type === "items") {
					const k = name();
					const e = name();
					out += "if(Array.isArray(" + expr + ")){";
					out += "for(let " + k + "=0;" + k + "<" + expr + ".length;" + k + "++){";
					out += "const " + e + "=" + expr + "[" + k + "]\n" + emit(op.ops, e) + "}}\n";
				} else if (op.type === "prefixItems") for (let j = 0; j < op.tuple.length; j++) {
					if (op.tuple[j].length === 0) continue;
					const e = name();
					out += "if(Array.isArray(" + expr + ")&&" + expr + ".length>" + j + "){";
					out += "const " + e + "=" + expr + "[" + j + "]\n" + emit(op.tuple[j], e) + "}\n";
				}
			}
			return out;
		};
		const body = emit(ops, "d");
		const head = ctors.map((_, i) => "const c" + i + "=C[" + i + "]").join("\n");
		try {
			return new Function("C", head + "\nreturn function(d){\n" + body + "return true\n}")(ctors);
		} catch {
			return null;
		}
	}
	function buildErrorsSource(ops) {
		const ctors = [];
		const typeLists = [];
		let n = 0;
		const name = () => "_" + n++;
		const ctorRef = (C) => {
			let i = ctors.indexOf(C);
			if (i === -1) i = ctors.push(C) - 1;
			return "c" + i;
		};
		const typesRef = (types) => {
			typeLists.push(types);
			return "t" + (typeLists.length - 1);
		};
		const pathExpr = (parts) => {
			if (parts.length === 0) return "\"\"";
			return parts.map((p) => p.v ? p.v : JSON.stringify(p.s)).join("+");
		};
		const addLit = (parts, text) => {
			const last = parts[parts.length - 1];
			if (last && !last.v) return parts.slice(0, -1).concat({ s: last.s + text });
			return parts.concat({ s: text });
		};
		const emit = (list, expr, parts) => {
			let out = "";
			for (let i = 0; i < list.length; i++) {
				const op = list[i];
				if (op.type === "instanceof") {
					const test = op.ctors.map((C) => expr + " instanceof " + ctorRef(C)).join("||");
					out += "if(!(" + test + "))_e.push(mk(\"instanceof\"," + pathExpr(parts) + "," + typesRef(op.types) + "))\n";
				} else if (op.type === "typeof") {
					const test = op.types.map((t) => "typeof " + expr + "===" + JSON.stringify(t)).join("||");
					out += "if(!(" + test + "))_e.push(mk(\"typeof\"," + pathExpr(parts) + "," + typesRef(op.types) + "))\n";
				} else if (op.type === "prop") {
					const v = name();
					out += "if(" + expr + "&&typeof " + expr + "==='object'){";
					out += "const " + v + "=" + expr + "[" + JSON.stringify(op.key) + "]\n";
					out += "if(" + v + "!==undefined){\n" + emit(op.ops, v, addLit(parts, "/" + op.key)) + "}}\n";
				} else if (op.type === "items") {
					const k = name();
					const e = name();
					out += "if(Array.isArray(" + expr + ")){";
					out += "for(let " + k + "=0;" + k + "<" + expr + ".length;" + k + "++){";
					out += "const " + e + "=" + expr + "[" + k + "]\n" + emit(op.ops, e, addLit(parts, "/").concat({ v: k })) + "}}\n";
				} else if (op.type === "prefixItems") {
					const m = name();
					out += "if(Array.isArray(" + expr + ")){const " + m + "=" + expr + ".length\n";
					for (let j = 0; j < op.tuple.length; j++) {
						if (op.tuple[j].length === 0) continue;
						const e = name();
						out += "if(" + m + ">" + j + "){const " + e + "=" + expr + "[" + j + "]\n" + emit(op.tuple[j], e, addLit(parts, "/" + j)) + "}\n";
					}
					out += "}\n";
				}
			}
			return out;
		};
		const body = emit(ops, "d", []);
		const head = ctors.map((_, i) => "const c" + i + "=C[" + i + "]").join("\n") + "\n" + typeLists.map((_, i) => "const t" + i + "=T[" + i + "]").join("\n");
		try {
			return new Function("C", "T", "mk", head + "\nreturn function(d){const _e=[]\n" + body + "return _e.length>0?_e:null\n}")(ctors, typeLists, makeError);
		} catch {
			return null;
		}
	}
	const ENTRIES = [
		["validate", {}],
		["isValidObject", {}],
		["validateJSON", "{}"],
		["isValidJSON", "{}"],
		["validateAndParse", "{}"]
	];
	function installEntries(validator, make, shouldWrap, skip) {
		const slots = /* @__PURE__ */ new Map();
		const state = {
			depth: 0,
			settled: false
		};
		const proto = Object.getPrototypeOf(validator);
		for (let i = 0; i < ENTRIES.length; i++) {
			const name = ENTRIES[i][0];
			if (skip && skip.has(name)) continue;
			const desc = Object.getOwnPropertyDescriptor(validator, name) || (proto ? Object.getOwnPropertyDescriptor(proto, name) : void 0);
			if (!desc) continue;
			const value = "value" in desc ? desc.value : void 0;
			if (value !== void 0 && typeof value !== "function") continue;
			slots.set(name, {
				probe: ENTRIES[i][1],
				impl: value,
				call: null
			});
		}
		function define(name) {
			const slot = slots.get(name);
			Object.defineProperty(validator, name, {
				configurable: true,
				enumerable: true,
				get() {
					if (!state.settled) settle();
					return slot.call;
				},
				set(fn) {
					slot.impl = fn;
				}
			});
		}
		function settle() {
			state.settled = true;
			for (const [name, slot] of slots) {
				delete validator[name];
				if (slot.impl !== void 0) validator[name] = slot.impl;
			}
			for (const [name, slot] of slots) {
				try {
					validator[name](slot.probe);
				} catch {}
				slot.impl = validator[name];
			}
			if (shouldWrap && !shouldWrap()) {
				for (const [name, slot] of slots) {
					delete validator[name];
					if (slot.impl !== void 0) validator[name] = slot.impl;
					slot.call = slot.impl;
				}
				return;
			}
			for (const name of slots.keys()) {
				delete validator[name];
				define(name);
			}
		}
		for (const [name, slot] of slots) {
			const wrapper = make(name, (data) => slot.impl(data));
			slot.call = function(data) {
				if (state.depth > 0) return slot.impl(data);
				state.depth++;
				try {
					return wrapper(data);
				} finally {
					state.depth--;
				}
			};
			define(name);
		}
	}
	function KeywordResult(inner, data, collect) {
		this.valid = false;
		this._inner = inner;
		this._data = data;
		this._collect = collect;
		this._errors = null;
	}
	Object.defineProperty(KeywordResult.prototype, "errors", {
		configurable: true,
		get() {
			if (this._errors === null) {
				const errors = this._collect(this._data) || [];
				const inner = this._inner;
				this._errors = inner.valid ? errors : inner.errors.concat(errors);
			}
			return this._errors;
		}
	});
	KeywordResult.prototype.toJSON = function() {
		return {
			valid: false,
			errors: this.errors
		};
	};
	KeywordResult.prototype._ataRaw = function() {
		const inner = this._inner;
		const kw = this._collect(this._data) || [];
		if (inner.valid) return kw;
		return (typeof inner._ataRaw === "function" ? inner._ataRaw() : inner.errors).concat(kw);
	};
	function registerChecks(validator) {
		let compiled = null;
		validator._extendChecks(() => {
			if (compiled === null) {
				const ops = compileNode(validator._schemaObj);
				if (ops.length === 0) compiled = false;
				else {
					const errors = buildErrorsSource(ops) || ((data) => {
						const out = [];
						runOps(data, ops, "", out);
						return out.length > 0 ? out : null;
					});
					compiled = {
						check: buildSource(ops) || buildCheck(ops),
						errors
					};
				}
			}
			return compiled || null;
		});
		return validator;
	}
	function withKeywords(validator) {
		if (typeof validator._extendChecks === "function" && !validator._initialized) return registerChecks(validator);
		let compiled = null;
		const compile = () => {
			if (compiled === null) {
				const ops = compileNode(validator._schemaObj);
				compiled = ops.length === 0 ? false : {
					ops,
					check: buildSource(ops) || buildCheck(ops),
					errors: buildErrorsSource(ops)
				};
			}
			return compiled;
		};
		function keywordErrors(data) {
			const c = compile();
			if (c.errors) return c.errors(data);
			const errors = [];
			runOps(data, c.ops, "", errors);
			return errors.length > 0 ? errors : null;
		}
		const check = (data) => compile().check(data);
		const wrappers = {
			validate: (inner) => (data) => {
				const res = inner(data);
				if (res.valid && check(data)) return res;
				return new KeywordResult(res, data, keywordErrors);
			},
			isValidObject: (inner) => (data) => inner(data) && check(data),
			validateJSON: (inner) => (jsonStr) => {
				const res = inner(jsonStr);
				if (!res.valid) return res;
				let data;
				try {
					data = JSON.parse(jsonStr);
				} catch {
					return res;
				}
				if (check(data)) return res;
				const errors = keywordErrors(data);
				return errors ? {
					valid: false,
					errors
				} : res;
			},
			isValidJSON: (inner) => (jsonStr) => {
				if (!inner(jsonStr)) return false;
				let data;
				try {
					data = JSON.parse(jsonStr);
				} catch {
					return true;
				}
				return check(data);
			},
			validateAndParse: (inner) => (jsonStr) => {
				const res = inner(jsonStr);
				if (!res.valid) return res;
				if (check(res.value)) return res;
				const errors = keywordErrors(res.value);
				return errors ? {
					valid: false,
					value: res.value,
					errors
				} : res;
			}
		};
		const skip = /* @__PURE__ */ new Set();
		if (typeof validator._extendVerdict === "function") {
			validator._extendVerdict(() => {
				const c = compile();
				return c === false ? null : c.check;
			});
			skip.add("isValidObject");
		}
		if (typeof validator._extendValidate === "function" && !validator._initialized) {
			validator._extendValidate(() => {
				const c = compile();
				return c === false ? null : {
					check: c.check,
					errors: keywordErrors
				};
			});
			for (const name of [
				"validate",
				"validateJSON",
				"isValidJSON",
				"validateAndParse"
			]) skip.add(name);
		}
		installEntries(validator, (name, inner) => wrappers[name](inner), () => compile() !== false, skip);
		Object.defineProperty(validator, "_externalChecks", {
			get: () => compile() !== false,
			configurable: true
		});
		return validator;
	}
	withKeywords.CONSTRUCTORS = CONSTRUCTORS;
	module.exports = {
		withKeywords,
		CONSTRUCTORS
	};
	Object.defineProperty(module.exports, "_internals", {
		value: {
			compileNode,
			runOps,
			buildErrorsSource
		},
		enumerable: false
	});
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/native-load.browser.js
var require_native_load_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function loadNative() {
		return null;
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/keywords.js
var require_keywords = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const RESERVED = /* @__PURE__ */ new Set([
		"$id",
		"$schema",
		"$ref",
		"$defs",
		"$anchor",
		"$dynamicRef",
		"$dynamicAnchor",
		"$vocabulary",
		"$comment",
		"definitions",
		"type",
		"enum",
		"const",
		"properties",
		"patternProperties",
		"additionalProperties",
		"required",
		"items",
		"prefixItems",
		"additionalItems",
		"contains",
		"allOf",
		"anyOf",
		"oneOf",
		"not",
		"if",
		"then",
		"else",
		"format",
		"pattern",
		"unevaluatedProperties",
		"unevaluatedItems",
		"dependentSchemas",
		"dependentRequired",
		"dependencies",
		"propertyNames",
		"propertyDependencies",
		"minimum",
		"maximum",
		"exclusiveMinimum",
		"exclusiveMaximum",
		"multipleOf",
		"minLength",
		"maxLength",
		"minItems",
		"maxItems",
		"uniqueItems",
		"minContains",
		"maxContains",
		"minProperties",
		"maxProperties"
	]);
	function normalizeKeywords(defs) {
		if (!defs || typeof defs !== "object") return null;
		const names = Object.keys(defs);
		if (names.length === 0) return null;
		const out = Object.create(null);
		for (const name of names) {
			const raw = defs[name];
			const def = typeof raw === "function" ? { validate: raw } : raw;
			if (!def || typeof def !== "object") throw new Error(`keyword "${name}": definition must be a function or an object`);
			if (RESERVED.has(name)) throw new Error(`keyword "${name}" is a JSON Schema keyword and cannot be redefined`);
			const hasValidate = typeof def.validate === "function";
			const hasCompile = typeof def.compile === "function";
			const hasMacro = typeof def.macro === "function";
			if (!hasValidate && !hasCompile && !hasMacro) throw new Error(`keyword "${name}": definition needs validate, compile or macro` + (typeof def.code === "function" ? " (code-generating keywords are not supported)" : ""));
			let types = null;
			if (def.type !== void 0) {
				types = Array.isArray(def.type) ? def.type.slice() : [def.type];
				for (const t of types) if (typeof t !== "string") throw new Error(`keyword "${name}": type must be a string or a list of strings`);
			}
			out[name] = {
				name,
				types,
				validate: hasValidate ? def.validate : null,
				compile: hasCompile ? def.compile : null,
				macro: hasMacro ? def.macro : null
			};
		}
		return out;
	}
	function schemaUsesKeywords(schema, keywords) {
		if (!keywords) return false;
		const seen = /* @__PURE__ */ new Set();
		const walk = (node, keysAreNames) => {
			if (node === null || typeof node !== "object") return false;
			if (seen.has(node)) return false;
			seen.add(node);
			if (Array.isArray(node)) {
				for (const item of node) if (walk(item, false)) return true;
				return false;
			}
			for (const key of Object.keys(node)) {
				if (!keysAreNames && keywords[key] !== void 0) return true;
				const v = node[key];
				if (v !== null && typeof v === "object") {
					if (walk(v, !keysAreNames && NAME_MAPS.has(key))) return true;
				}
			}
			return false;
		};
		return walk(schema, false);
	}
	const NAME_MAPS = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"$defs",
		"definitions",
		"dependentSchemas",
		"dependentRequired",
		"dependencies",
		"propertyDependencies"
	]);
	module.exports = {
		normalizeKeywords,
		schemaUsesKeywords
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DRAFT7_SCHEMAS = /* @__PURE__ */ new Set(["http://json-schema.org/draft-07/schema#", "http://json-schema.org/draft-07/schema"]);
	function isDraft7(schema) {
		return !!(schema && schema.$schema && DRAFT7_SCHEMAS.has(schema.$schema));
	}
	function normalizeDraft7(schema, force) {
		if (!force && !isDraft7(schema)) return schema;
		_normalize(schema);
		return schema;
	}
	const REF_SIBLINGS_KEPT = /* @__PURE__ */ new Set([
		"$ref",
		"$defs",
		"definitions",
		"$schema",
		"$comment",
		"title",
		"description",
		"examples",
		"default",
		"readOnly",
		"writeOnly"
	]);
	function _normalize(schema) {
		if (typeof schema !== "object" || schema === null) return;
		if (typeof schema.$ref === "string") {
			for (const key of Object.keys(schema)) if (!REF_SIBLINGS_KEPT.has(key)) delete schema[key];
		}
		if (typeof schema.$id === "string" && /^#[A-Za-z][A-Za-z0-9_.:-]*$/.test(schema.$id)) {
			if (schema.$anchor === void 0) schema.$anchor = schema.$id.slice(1);
			delete schema.$id;
		}
		if (schema.definitions && !schema.$defs) {
			schema.$defs = schema.definitions;
			delete schema.definitions;
		}
		if (schema.dependencies) {
			for (const [key, value] of Object.entries(schema.dependencies)) {
				const target = Array.isArray(value) ? "dependentRequired" : "dependentSchemas";
				if (!schema[target]) schema[target] = {};
				Object.defineProperty(schema[target], key, {
					value,
					writable: true,
					enumerable: true,
					configurable: true
				});
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
	function normalizeExclusiveBounds(schema) {
		_walkExclusive(schema, /* @__PURE__ */ new Set());
		return schema;
	}
	function _walkExclusive(node, seen) {
		if (typeof node !== "object" || node === null) return;
		if (Array.isArray(node)) {
			for (const item of node) _walkExclusive(item, seen);
			return;
		}
		if (seen.has(node)) return;
		seen.add(node);
		if (typeof node.exclusiveMinimum === "boolean") {
			if (node.exclusiveMinimum === true && typeof node.minimum === "number") {
				node.exclusiveMinimum = node.minimum;
				delete node.minimum;
			} else delete node.exclusiveMinimum;
		}
		if (typeof node.exclusiveMaximum === "boolean") {
			if (node.exclusiveMaximum === true && typeof node.maximum === "number") {
				node.exclusiveMaximum = node.maximum;
				delete node.maximum;
			} else delete node.exclusiveMaximum;
		}
		for (const key of Object.keys(node)) _walkExclusive(node[key], seen);
	}
	function normalizeNullable(schema) {
		if (typeof schema !== "object" || schema === null) return schema;
		_normalizeNullable(schema);
		return schema;
	}
	function _normalizeNullable(schema) {
		if (typeof schema !== "object" || schema === null) return;
		if (schema.nullable === true && schema.type !== void 0) {
			if (Array.isArray(schema.type)) {
				if (!schema.type.includes("null")) schema.type = schema.type.concat("null");
			} else schema.type = [schema.type, "null"];
		}
		if ("nullable" in schema) delete schema.nullable;
		if (/^#.*%/.test(schema.$ref)) try {
			const decoded = decodeURIComponent(schema.$ref);
			if (!decoded.includes("%")) schema.$ref = decoded;
		} catch {}
		for (const key of [
			"properties",
			"patternProperties",
			"$defs",
			"definitions",
			"dependentSchemas"
		]) if (schema[key] && typeof schema[key] === "object") {
			for (const v of Object.values(schema[key])) if (typeof v === "object" && v !== null) _normalizeNullable(v);
		}
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]) if (Array.isArray(schema[key])) {
			for (const s of schema[key]) if (typeof s === "object" && s !== null) _normalizeNullable(s);
		}
		for (const key of [
			"items",
			"contains",
			"not",
			"if",
			"then",
			"else",
			"additionalProperties",
			"propertyNames",
			"unevaluatedItems",
			"unevaluatedProperties"
		]) if (typeof schema[key] === "object" && schema[key] !== null) _normalizeNullable(schema[key]);
	}
	function stripFormatAssertions(schema) {
		if (typeof schema !== "object" || schema === null) return schema;
		_stripFormat(schema, /* @__PURE__ */ new Set());
		return schema;
	}
	function _stripFormat(schema, seen) {
		if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return;
		if (seen.has(schema)) return;
		seen.add(schema);
		if (typeof schema.format === "string") delete schema.format;
		for (const key of [
			"properties",
			"patternProperties",
			"$defs",
			"definitions",
			"dependentSchemas"
		]) if (schema[key] && typeof schema[key] === "object" && !Array.isArray(schema[key])) for (const v of Object.values(schema[key])) _stripFormat(v, seen);
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]) if (Array.isArray(schema[key])) for (const s of schema[key]) _stripFormat(s, seen);
		for (const key of [
			"items",
			"additionalItems",
			"contains",
			"not",
			"if",
			"then",
			"else",
			"additionalProperties",
			"propertyNames",
			"unevaluatedItems",
			"unevaluatedProperties",
			"contentSchema"
		]) if (Array.isArray(schema[key])) for (const s of schema[key]) _stripFormat(s, seen);
		else _stripFormat(schema[key], seen);
	}
	module.exports = {
		isDraft7,
		normalizeDraft7,
		normalizeNullable,
		normalizeExclusiveBounds,
		stripFormatAssertions
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/metaschemas.js
var require_metaschemas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = { METASCHEMAS: /* @__PURE__ */ new Map([
		["https://json-schema.org/draft/2020-12/schema", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/schema",
			"$vocabulary": {
				"https://json-schema.org/draft/2020-12/vocab/core": true,
				"https://json-schema.org/draft/2020-12/vocab/applicator": true,
				"https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
				"https://json-schema.org/draft/2020-12/vocab/validation": true,
				"https://json-schema.org/draft/2020-12/vocab/meta-data": true,
				"https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
				"https://json-schema.org/draft/2020-12/vocab/content": true
			},
			"$dynamicAnchor": "meta",
			"title": "Core and Validation specifications meta-schema",
			"allOf": [
				{ "$ref": "meta/core" },
				{ "$ref": "meta/applicator" },
				{ "$ref": "meta/unevaluated" },
				{ "$ref": "meta/validation" },
				{ "$ref": "meta/meta-data" },
				{ "$ref": "meta/format-annotation" },
				{ "$ref": "meta/content" }
			],
			"type": ["object", "boolean"],
			"$comment": "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
			"properties": {
				"definitions": {
					"$comment": "\"definitions\" has been replaced by \"$defs\".",
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" },
					"deprecated": true,
					"default": {}
				},
				"dependencies": {
					"$comment": "\"dependencies\" has been split and replaced by \"dependentSchemas\" and \"dependentRequired\" in order to serve their differing semantics.",
					"type": "object",
					"additionalProperties": { "anyOf": [{ "$dynamicRef": "#meta" }, { "$ref": "meta/validation#/$defs/stringArray" }] },
					"deprecated": true,
					"default": {}
				},
				"$recursiveAnchor": {
					"$comment": "\"$recursiveAnchor\" has been replaced by \"$dynamicAnchor\".",
					"$ref": "meta/core#/$defs/anchorString",
					"deprecated": true
				},
				"$recursiveRef": {
					"$comment": "\"$recursiveRef\" has been replaced by \"$dynamicRef\".",
					"$ref": "meta/core#/$defs/uriReferenceString",
					"deprecated": true
				}
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/core", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/core",
			"$dynamicAnchor": "meta",
			"title": "Core vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"$id": {
					"$ref": "#/$defs/uriReferenceString",
					"$comment": "Non-empty fragments not allowed.",
					"pattern": "^[^#]*#?$"
				},
				"$schema": { "$ref": "#/$defs/uriString" },
				"$ref": { "$ref": "#/$defs/uriReferenceString" },
				"$anchor": { "$ref": "#/$defs/anchorString" },
				"$dynamicRef": { "$ref": "#/$defs/uriReferenceString" },
				"$dynamicAnchor": { "$ref": "#/$defs/anchorString" },
				"$vocabulary": {
					"type": "object",
					"propertyNames": { "$ref": "#/$defs/uriString" },
					"additionalProperties": { "type": "boolean" }
				},
				"$comment": { "type": "string" },
				"$defs": {
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" }
				}
			},
			"$defs": {
				"anchorString": {
					"type": "string",
					"pattern": "^[A-Za-z_][-A-Za-z0-9._]*$"
				},
				"uriString": {
					"type": "string",
					"format": "uri"
				},
				"uriReferenceString": {
					"type": "string",
					"format": "uri-reference"
				}
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/applicator", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/applicator",
			"$dynamicAnchor": "meta",
			"title": "Applicator vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"prefixItems": { "$ref": "#/$defs/schemaArray" },
				"items": { "$dynamicRef": "#meta" },
				"contains": { "$dynamicRef": "#meta" },
				"additionalProperties": { "$dynamicRef": "#meta" },
				"properties": {
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" },
					"default": {}
				},
				"patternProperties": {
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" },
					"propertyNames": { "format": "regex" },
					"default": {}
				},
				"dependentSchemas": {
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" },
					"default": {}
				},
				"propertyNames": { "$dynamicRef": "#meta" },
				"if": { "$dynamicRef": "#meta" },
				"then": { "$dynamicRef": "#meta" },
				"else": { "$dynamicRef": "#meta" },
				"allOf": { "$ref": "#/$defs/schemaArray" },
				"anyOf": { "$ref": "#/$defs/schemaArray" },
				"oneOf": { "$ref": "#/$defs/schemaArray" },
				"not": { "$dynamicRef": "#meta" }
			},
			"$defs": { "schemaArray": {
				"type": "array",
				"minItems": 1,
				"items": { "$dynamicRef": "#meta" }
			} }
		}],
		["https://json-schema.org/draft/2020-12/meta/validation", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/validation",
			"$dynamicAnchor": "meta",
			"title": "Validation vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"type": { "anyOf": [{ "$ref": "#/$defs/simpleTypes" }, {
					"type": "array",
					"items": { "$ref": "#/$defs/simpleTypes" },
					"minItems": 1,
					"uniqueItems": true
				}] },
				"const": true,
				"enum": {
					"type": "array",
					"items": true
				},
				"multipleOf": {
					"type": "number",
					"exclusiveMinimum": 0
				},
				"maximum": { "type": "number" },
				"exclusiveMaximum": { "type": "number" },
				"minimum": { "type": "number" },
				"exclusiveMinimum": { "type": "number" },
				"maxLength": { "$ref": "#/$defs/nonNegativeInteger" },
				"minLength": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
				"pattern": {
					"type": "string",
					"format": "regex"
				},
				"maxItems": { "$ref": "#/$defs/nonNegativeInteger" },
				"minItems": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
				"uniqueItems": {
					"type": "boolean",
					"default": false
				},
				"maxContains": { "$ref": "#/$defs/nonNegativeInteger" },
				"minContains": {
					"$ref": "#/$defs/nonNegativeInteger",
					"default": 1
				},
				"maxProperties": { "$ref": "#/$defs/nonNegativeInteger" },
				"minProperties": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
				"required": { "$ref": "#/$defs/stringArray" },
				"dependentRequired": {
					"type": "object",
					"additionalProperties": { "$ref": "#/$defs/stringArray" }
				}
			},
			"$defs": {
				"nonNegativeInteger": {
					"type": "integer",
					"minimum": 0
				},
				"nonNegativeIntegerDefault0": {
					"$ref": "#/$defs/nonNegativeInteger",
					"default": 0
				},
				"simpleTypes": { "enum": [
					"array",
					"boolean",
					"integer",
					"null",
					"number",
					"object",
					"string"
				] },
				"stringArray": {
					"type": "array",
					"items": { "type": "string" },
					"uniqueItems": true,
					"default": []
				}
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/meta-data", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/meta-data",
			"$dynamicAnchor": "meta",
			"title": "Meta-data vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"title": { "type": "string" },
				"description": { "type": "string" },
				"default": true,
				"deprecated": {
					"type": "boolean",
					"default": false
				},
				"readOnly": {
					"type": "boolean",
					"default": false
				},
				"writeOnly": {
					"type": "boolean",
					"default": false
				},
				"examples": {
					"type": "array",
					"items": true
				}
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/format-annotation", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/format-annotation",
			"$dynamicAnchor": "meta",
			"title": "Format vocabulary meta-schema for annotation results",
			"type": ["object", "boolean"],
			"properties": { "format": { "type": "string" } }
		}],
		["https://json-schema.org/draft/2020-12/meta/content", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/content",
			"$dynamicAnchor": "meta",
			"title": "Content vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"contentEncoding": { "type": "string" },
				"contentMediaType": { "type": "string" },
				"contentSchema": { "$dynamicRef": "#meta" }
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/unevaluated", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/unevaluated",
			"$dynamicAnchor": "meta",
			"title": "Unevaluated applicator vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"unevaluatedItems": { "$dynamicRef": "#meta" },
				"unevaluatedProperties": { "$dynamicRef": "#meta" }
			}
		}],
		["http://json-schema.org/draft-07/schema#", {
			"$schema": "http://json-schema.org/draft-07/schema#",
			"$id": "http://json-schema.org/draft-07/schema#",
			"title": "Core schema meta-schema",
			"definitions": {
				"schemaArray": {
					"type": "array",
					"minItems": 1,
					"items": { "$ref": "#" }
				},
				"nonNegativeInteger": {
					"type": "integer",
					"minimum": 0
				},
				"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
				"simpleTypes": { "enum": [
					"array",
					"boolean",
					"integer",
					"null",
					"number",
					"object",
					"string"
				] },
				"stringArray": {
					"type": "array",
					"items": { "type": "string" },
					"uniqueItems": true,
					"default": []
				}
			},
			"type": ["object", "boolean"],
			"properties": {
				"$id": {
					"type": "string",
					"format": "uri-reference"
				},
				"$schema": {
					"type": "string",
					"format": "uri"
				},
				"$ref": {
					"type": "string",
					"format": "uri-reference"
				},
				"$comment": { "type": "string" },
				"title": { "type": "string" },
				"description": { "type": "string" },
				"default": true,
				"readOnly": {
					"type": "boolean",
					"default": false
				},
				"writeOnly": {
					"type": "boolean",
					"default": false
				},
				"examples": {
					"type": "array",
					"items": true
				},
				"multipleOf": {
					"type": "number",
					"exclusiveMinimum": 0
				},
				"maximum": { "type": "number" },
				"exclusiveMaximum": { "type": "number" },
				"minimum": { "type": "number" },
				"exclusiveMinimum": { "type": "number" },
				"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
				"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
				"pattern": {
					"type": "string",
					"format": "regex"
				},
				"additionalItems": { "$ref": "#" },
				"items": {
					"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
					"default": true
				},
				"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
				"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
				"uniqueItems": {
					"type": "boolean",
					"default": false
				},
				"contains": { "$ref": "#" },
				"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
				"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
				"required": { "$ref": "#/definitions/stringArray" },
				"additionalProperties": { "$ref": "#" },
				"definitions": {
					"type": "object",
					"additionalProperties": { "$ref": "#" },
					"default": {}
				},
				"properties": {
					"type": "object",
					"additionalProperties": { "$ref": "#" },
					"default": {}
				},
				"patternProperties": {
					"type": "object",
					"additionalProperties": { "$ref": "#" },
					"propertyNames": { "format": "regex" },
					"default": {}
				},
				"dependencies": {
					"type": "object",
					"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
				},
				"propertyNames": { "$ref": "#" },
				"const": true,
				"enum": {
					"type": "array",
					"items": true,
					"minItems": 1,
					"uniqueItems": true
				},
				"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
					"type": "array",
					"items": { "$ref": "#/definitions/simpleTypes" },
					"minItems": 1,
					"uniqueItems": true
				}] },
				"format": { "type": "string" },
				"contentMediaType": { "type": "string" },
				"contentEncoding": { "type": "string" },
				"if": { "$ref": "#" },
				"then": { "$ref": "#" },
				"else": { "$ref": "#" },
				"allOf": { "$ref": "#/definitions/schemaArray" },
				"anyOf": { "$ref": "#/definitions/schemaArray" },
				"oneOf": { "$ref": "#/definitions/schemaArray" },
				"not": { "$ref": "#" }
			},
			"default": true
		}]
	]) };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/vocabularies.js
var require_vocabularies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const CORE_VOCABULARY = "https://json-schema.org/draft/2020-12/vocab/core";
	let KEYWORDS_BY_VOCABULARY = null;
	function keywordsByVocabulary() {
		if (KEYWORDS_BY_VOCABULARY) return KEYWORDS_BY_VOCABULARY;
		const byVocabulary = /* @__PURE__ */ new Map();
		for (const name of [
			"core",
			"applicator",
			"unevaluated",
			"validation",
			"meta-data",
			"format-annotation",
			"content"
		]) {
			const meta = require_metaschemas().METASCHEMAS.get(`https://json-schema.org/draft/2020-12/meta/${name}`);
			if (!meta || !meta.properties) continue;
			byVocabulary.set(`https://json-schema.org/draft/2020-12/vocab/${name}`, new Set(Object.keys(meta.properties)));
		}
		byVocabulary.set("https://json-schema.org/draft/2020-12/vocab/format-assertion", /* @__PURE__ */ new Set(["format"]));
		KEYWORDS_BY_VOCABULARY = byVocabulary;
		return byVocabulary;
	}
	function allVocabularyKeywords() {
		const all = /* @__PURE__ */ new Set();
		for (const keywords of keywordsByVocabulary().values()) for (const keyword of keywords) all.add(keyword);
		return all;
	}
	function enabledKeywords(metaschema) {
		if (!metaschema || typeof metaschema !== "object") return null;
		const vocabularies = metaschema.$vocabulary;
		if (!vocabularies || typeof vocabularies !== "object") return null;
		const known = keywordsByVocabulary();
		const enabled = /* @__PURE__ */ new Set();
		for (const [uri, required] of Object.entries(vocabularies)) {
			const keywords = known.get(uri);
			if (keywords) for (const keyword of keywords) enabled.add(keyword);
			else if (required === true) return null;
		}
		for (const keyword of known.get(CORE_VOCABULARY) || []) enabled.add(keyword);
		for (const keyword of allVocabularyKeywords()) if (!enabled.has(keyword)) return enabled;
		return null;
	}
	function stripDisabledKeywords(schema, enabled) {
		const removable = allVocabularyKeywords();
		const disabled = /* @__PURE__ */ new Set();
		for (const keyword of removable) if (!enabled.has(keyword)) disabled.add(keyword);
		if (disabled.size === 0) return schema;
		_strip(schema, disabled, /* @__PURE__ */ new Set(), true);
		return schema;
	}
	function _strip(schema, disabled, seen, isRoot) {
		if (typeof schema !== "object" || schema === null) return;
		if (Array.isArray(schema)) {
			for (const each of schema) _strip(each, disabled, seen, false);
			return;
		}
		if (seen.has(schema)) return;
		seen.add(schema);
		if (!isRoot && typeof schema.$schema === "string") return;
		for (const keyword of disabled) if (keyword in schema) delete schema[keyword];
		for (const key of [
			"properties",
			"patternProperties",
			"$defs",
			"definitions",
			"dependentSchemas"
		]) {
			const box = schema[key];
			if (box && typeof box === "object" && !Array.isArray(box)) for (const each of Object.values(box)) _strip(each, disabled, seen, false);
		}
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]) if (Array.isArray(schema[key])) for (const each of schema[key]) _strip(each, disabled, seen, false);
		for (const key of [
			"items",
			"additionalItems",
			"contains",
			"not",
			"if",
			"then",
			"else",
			"additionalProperties",
			"propertyNames",
			"unevaluatedItems",
			"unevaluatedProperties",
			"contentSchema"
		]) {
			const sub = schema[key];
			if (Array.isArray(sub)) for (const each of sub) _strip(each, disabled, seen, false);
			else _strip(sub, disabled, seen, false);
		}
	}
	module.exports = {
		enabledKeywords,
		stripDisabledKeywords,
		keywordsByVocabulary
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/schema-scan.js
var require_schema_scan = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const NULLABLE = 1;
	const REF_SIBLINGS = 2;
	const ANCHOR_ID = 4;
	const DEFINITIONS = 8;
	const DEPENDENCIES = 16;
	const TUPLE_ITEMS = 32;
	const EXCLUSIVE_BOOL = 64;
	const ENCODED_REF = 128;
	const DRAFT7_WORK = 62;
	const REF_SIBLINGS_KEPT = /* @__PURE__ */ new Set([
		"$ref",
		"$defs",
		"definitions",
		"$schema",
		"$comment",
		"title",
		"description",
		"examples",
		"default",
		"readOnly",
		"writeOnly"
	]);
	const ANCHOR_ID_RE = /^#[A-Za-z][A-Za-z0-9_.:-]*$/;
	const CACHE = /* @__PURE__ */ new WeakMap();
	function scan(schema) {
		if (typeof schema !== "object" || schema === null) return 0;
		const hit = CACHE.get(schema);
		if (hit !== void 0) return hit;
		let bits = 0;
		const seen = /* @__PURE__ */ new Set();
		const walk = (node) => {
			if (typeof node !== "object" || node === null) return;
			if (Array.isArray(node)) {
				for (let i = 0; i < node.length; i++) walk(node[i]);
				return;
			}
			if (seen.has(node)) return;
			seen.add(node);
			if ("nullable" in node) bits |= NULLABLE;
			if (node.definitions !== void 0 && node.$defs === void 0) bits |= DEFINITIONS;
			if (node.dependencies !== void 0) bits |= DEPENDENCIES;
			if (Array.isArray(node.items)) bits |= TUPLE_ITEMS;
			if (typeof node.exclusiveMinimum === "boolean" || typeof node.exclusiveMaximum === "boolean") bits |= EXCLUSIVE_BOOL;
			if (typeof node.$id === "string" && ANCHOR_ID_RE.test(node.$id)) bits |= ANCHOR_ID;
			const keys = Object.keys(node);
			if (typeof node.$ref === "string") {
				if (node.$ref[0] === "#" && node.$ref.includes("%")) bits |= ENCODED_REF;
				for (let i = 0; i < keys.length; i++) if (!REF_SIBLINGS_KEPT.has(keys[i])) {
					bits |= REF_SIBLINGS;
					break;
				}
			}
			for (let i = 0; i < keys.length; i++) walk(node[keys[i]]);
		};
		walk(schema);
		CACHE.set(schema, bits);
		return bits;
	}
	function needsNormalization(schema, isDraft7) {
		const bits = scan(schema);
		if (bits & 193) return true;
		return isDraft7 ? (bits & DRAFT7_WORK) !== 0 : false;
	}
	module.exports = {
		scan,
		needsNormalization,
		NULLABLE,
		REF_SIBLINGS,
		ANCHOR_ID,
		DEFINITIONS,
		DEPENDENCIES,
		TUPLE_ITEMS,
		EXCLUSIVE_BOOL,
		ENCODED_REF,
		DRAFT7_WORK
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/dialect.js
var require_dialect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const V1_DIALECTS = /* @__PURE__ */ new Set([
		"https://json-schema.org/v1",
		"https://json-schema.org/v1/schema",
		"https://json-schema.org/v1/2026",
		"https://json-schema.org/draft/next/schema"
	]);
	function isV1Dialect(schema) {
		if (typeof schema !== "object" || schema === null) return false;
		if (typeof schema.$schema !== "string") return false;
		const uri = schema.$schema.endsWith("#") ? schema.$schema.slice(0, -1) : schema.$schema;
		return V1_DIALECTS.has(uri);
	}
	module.exports = {
		isV1Dialect,
		V1_DIALECTS
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/shape-classifier.js
var require_shape_classifier = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const PRIMITIVE_TYPES = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean"
	]);
	const META_KEYS = /* @__PURE__ */ new Set([
		"$schema",
		"$id",
		"$comment",
		"title",
		"description",
		"default",
		"examples",
		"deprecated",
		"readOnly",
		"writeOnly"
	]);
	const TIER0_OBJECT_ALLOWED = /* @__PURE__ */ new Set([
		"type",
		"properties",
		"required",
		"additionalProperties",
		...META_KEYS
	]);
	const TIER0_PRIMITIVE_ALLOWED = /* @__PURE__ */ new Set([
		"type",
		"enum",
		"const",
		"minLength",
		"maxLength",
		"minimum",
		"maximum",
		"exclusiveMinimum",
		"exclusiveMaximum",
		"multipleOf",
		...META_KEYS
	]);
	const MAX_TIER0_PROPS = 10;
	const MAX_TIER0_ENUM = 256;
	function isPrimitiveType(t) {
		return typeof t === "string" && PRIMITIVE_TYPES.has(t);
	}
	function isPrimitiveEnumValue(v) {
		const t = typeof v;
		return v === null || t === "string" || t === "number" || t === "boolean";
	}
	function isTier0Primitive(schema) {
		if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return false;
		if (!isPrimitiveType(schema.type)) return false;
		for (const k of Object.keys(schema)) if (!TIER0_PRIMITIVE_ALLOWED.has(k)) return false;
		if (schema.enum !== void 0) {
			if (!Array.isArray(schema.enum)) return false;
			if (schema.enum.length === 0 || schema.enum.length > MAX_TIER0_ENUM) return false;
			for (const v of schema.enum) if (!isPrimitiveEnumValue(v)) return false;
		}
		if (schema.const !== void 0 && !isPrimitiveEnumValue(schema.const)) return false;
		return true;
	}
	function isTier0Object(schema) {
		if (schema.type !== "object") return false;
		for (const k of Object.keys(schema)) if (!TIER0_OBJECT_ALLOWED.has(k)) return false;
		const ap = schema.additionalProperties;
		if (ap !== void 0 && ap !== true && ap !== false) return false;
		if (schema.required !== void 0) {
			if (!Array.isArray(schema.required)) return false;
			for (const r of schema.required) if (typeof r !== "string") return false;
		}
		const props = schema.properties;
		if (schema.required !== void 0) {
			for (const r of schema.required) if (props === void 0 || props === null || typeof props !== "object" || !Object.prototype.hasOwnProperty.call(props, r)) return false;
		}
		if (props === void 0) return true;
		if (typeof props !== "object" || props === null || Array.isArray(props)) return false;
		const keys = Object.keys(props);
		if (keys.length > MAX_TIER0_PROPS) return false;
		for (const k of keys) if (!isTier0Primitive(props[k])) return false;
		return true;
	}
	function classify(schema) {
		if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return {
			tier: 2,
			plan: null
		};
		if (isTier0Primitive(schema)) return {
			tier: 0,
			plan: null
		};
		if (isTier0Object(schema)) return {
			tier: 0,
			plan: null
		};
		return {
			tier: 2,
			plan: null
		};
	}
	module.exports = {
		classify,
		MAX_TIER0_PROPS,
		MAX_TIER0_ENUM,
		PRIMITIVE_TYPES
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/tier0.js
var require_tier0 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const TYPE_MASK = {
		string: 1,
		number: 2,
		integer: 4,
		boolean: 8
	};
	const T_STRING = TYPE_MASK.string;
	const T_NUMBER = TYPE_MASK.number;
	const T_INTEGER = TYPE_MASK.integer;
	const T_BOOLEAN = TYPE_MASK.boolean;
	function codePointLength(s) {
		const len = s.length;
		for (let i = 0; i < len; i++) if (s.charCodeAt(i) >= 55296 && s.charCodeAt(i) <= 56319) {
			let n = 0;
			for (const _ of s) n++;
			return n;
		}
		return len;
	}
	const F_MIN = 1;
	const F_MAX = 2;
	const F_EXCL_MIN = 4;
	const F_EXCL_MAX = 8;
	const F_MULT = 16;
	const PROTO_NAMES = /* @__PURE__ */ new Set([...Object.getOwnPropertyNames(Object.prototype), "__proto__"]);
	const _hop = Object.prototype.hasOwnProperty;
	const _PN = {}.__proto__ === Object.prototype;
	function primConstraint(key, propSchema) {
		const t = propSchema.type;
		const hasEnum = Array.isArray(propSchema.enum);
		const hasConst = propSchema.const !== void 0;
		let numFlags = 0;
		if (typeof propSchema.minimum === "number") numFlags |= F_MIN;
		if (typeof propSchema.maximum === "number") numFlags |= F_MAX;
		if (typeof propSchema.exclusiveMinimum === "number") numFlags |= F_EXCL_MIN;
		if (typeof propSchema.exclusiveMaximum === "number") numFlags |= F_EXCL_MAX;
		if (typeof propSchema.multipleOf === "number") numFlags |= F_MULT;
		return {
			key,
			protoName: PROTO_NAMES.has(key),
			typeMask: TYPE_MASK[t] | 0,
			numFlags,
			hasEnum,
			hasConst,
			enumSet: hasEnum ? new Set(propSchema.enum) : null,
			constVal: hasConst ? propSchema.const : void 0,
			minLen: typeof propSchema.minLength === "number" ? propSchema.minLength : -1,
			maxLen: typeof propSchema.maxLength === "number" ? propSchema.maxLength : -1,
			min: typeof propSchema.minimum === "number" ? propSchema.minimum : 0,
			max: typeof propSchema.maximum === "number" ? propSchema.maximum : 0,
			exclMin: typeof propSchema.exclusiveMinimum === "number" ? propSchema.exclusiveMinimum : 0,
			exclMax: typeof propSchema.exclusiveMaximum === "number" ? propSchema.exclusiveMaximum : 0,
			multipleOf: typeof propSchema.multipleOf === "number" ? propSchema.multipleOf : 0
		};
	}
	function buildTier0Plan(schema) {
		if (schema.type !== "object") return {
			isPrimitive: true,
			constraints: [primConstraint("__root__", schema)],
			requiredMask: 0,
			additionalAllowed: true,
			knownKeys: null
		};
		const props = schema.properties || {};
		const keys = Object.keys(props);
		const required = schema.required ? new Set(schema.required) : null;
		const constraints = new Array(keys.length);
		const knownKeys = /* @__PURE__ */ new Set();
		let requiredMask = 0;
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			constraints[i] = primConstraint(k, props[k]);
			knownKeys.add(k);
			if (required && required.has(k)) requiredMask |= 1 << i;
		}
		return {
			isPrimitive: false,
			constraints,
			requiredMask,
			additionalAllowed: schema.additionalProperties !== false,
			knownKeys
		};
	}
	function _multipleOk(v, m) {
		if (m === 0) return false;
		const q = v / m;
		return Number.isInteger(q) || Math.abs(q - Math.round(q)) < 1e-9;
	}
	function checkPrimitive(c, v) {
		const m = c.typeMask;
		if (m === T_STRING) {
			if (typeof v !== "string") return false;
			const minLen = c.minLen;
			const maxLen = c.maxLen;
			if (minLen >= 0) {
				const l = v.length;
				if (l < minLen) return false;
				if (l < minLen * 2 && codePointLength(v) < minLen) return false;
			}
			if (maxLen >= 0) {
				if (v.length > maxLen && codePointLength(v) > maxLen) return false;
			}
		} else if (m === T_INTEGER) {
			if (typeof v !== "number" || !Number.isInteger(v)) return false;
			const f = c.numFlags;
			if (f !== 0) {
				if (f & F_MIN && v < c.min) return false;
				if (f & F_MAX && v > c.max) return false;
				if (f & F_EXCL_MIN && v <= c.exclMin) return false;
				if (f & F_EXCL_MAX && v >= c.exclMax) return false;
				if (f & F_MULT && !_multipleOk(v, c.multipleOf)) return false;
			}
		} else if (m === T_NUMBER) {
			if (!Number.isFinite(v)) return false;
			const f = c.numFlags;
			if (f !== 0) {
				if (f & F_MIN && v < c.min) return false;
				if (f & F_MAX && v > c.max) return false;
				if (f & F_EXCL_MIN && v <= c.exclMin) return false;
				if (f & F_EXCL_MAX && v >= c.exclMax) return false;
				if (f & F_MULT && !_multipleOk(v, c.multipleOf)) return false;
			}
		} else if (m === T_BOOLEAN) {
			if (typeof v !== "boolean") return false;
		} else return false;
		if (c.hasEnum && !c.enumSet.has(v)) return false;
		if (c.hasConst && v !== c.constVal) return false;
		return true;
	}
	function tier0ValidateObject(plan, data) {
		if (typeof data !== "object" || data === null || Array.isArray(data)) return false;
		const cs = plan.constraints;
		const n = cs.length;
		const reqMask = plan.requiredMask;
		let seenMask = 0;
		for (let i = 0; i < n; i++) {
			const c = cs[i];
			let v = data[c.key];
			if (v !== void 0 && (c.protoName || (_PN ? data.__proto__ : Object.getPrototypeOf(data)) !== Object.prototype) && !_hop.call(data, c.key)) v = void 0;
			if (v === void 0) {
				if (reqMask & 1 << i) return false;
				continue;
			}
			seenMask |= 1 << i;
			const m = c.typeMask;
			if (m === T_STRING) {
				if (typeof v !== "string") return false;
				const minLen = c.minLen;
				const maxLen = c.maxLen;
				if (minLen >= 0) {
					const l = v.length;
					if (l < minLen) return false;
					if (l < minLen * 2 && codePointLength(v) < minLen) return false;
				}
				if (maxLen >= 0) {
					if (v.length > maxLen && codePointLength(v) > maxLen) return false;
				}
			} else if (m === T_INTEGER) {
				if (typeof v !== "number" || !Number.isInteger(v)) return false;
				const f = c.numFlags;
				if (f !== 0) {
					if (f & F_MIN && v < c.min) return false;
					if (f & F_MAX && v > c.max) return false;
					if (f & F_EXCL_MIN && v <= c.exclMin) return false;
					if (f & F_EXCL_MAX && v >= c.exclMax) return false;
					if (f & F_MULT && !_multipleOk(v, c.multipleOf)) return false;
				}
			} else if (m === T_NUMBER) {
				if (!Number.isFinite(v)) return false;
				const f = c.numFlags;
				if (f !== 0) {
					if (f & F_MIN && v < c.min) return false;
					if (f & F_MAX && v > c.max) return false;
					if (f & F_EXCL_MIN && v <= c.exclMin) return false;
					if (f & F_EXCL_MAX && v >= c.exclMax) return false;
					if (f & F_MULT && !_multipleOk(v, c.multipleOf)) return false;
				}
			} else if (m === T_BOOLEAN) {
				if (typeof v !== "boolean") return false;
			} else return false;
			if (c.hasEnum && !c.enumSet.has(v)) return false;
			if (c.hasConst && v !== c.constVal) return false;
		}
		if ((seenMask & reqMask) !== reqMask) return false;
		if (!plan.additionalAllowed) {
			const known = plan.knownKeys;
			for (const k in data) {
				if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
				if (!known.has(k)) return false;
			}
		}
		return true;
	}
	function tier0Validate(plan, data) {
		if (plan.isPrimitive) return checkPrimitive(plan.constraints[0], data);
		return tier0ValidateObject(plan, data);
	}
	module.exports = {
		buildTier0Plan,
		tier0Validate,
		tier0ValidateObject,
		checkPrimitive,
		TYPE_MASK
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function buildDefaultsApplier(schema) {
		if (typeof schema !== "object" || schema === null) return null;
		const actions = [];
		collectDefaults(schema, actions);
		if (actions.length === 0) return null;
		return (data) => {
			for (let i = 0; i < actions.length; i++) actions[i](data);
		};
	}
	function setOwn(obj, key, val) {
		if (key === "__proto__") Object.defineProperty(obj, key, {
			value: val,
			writable: true,
			enumerable: true,
			configurable: true
		});
		else obj[key] = val;
	}
	function collectDefaults(schema, actions, path) {
		if (typeof schema !== "object" || schema === null) return;
		const props = schema.properties;
		if (!props) return;
		for (const [key, prop] of Object.entries(props)) {
			if (prop && typeof prop === "object" && prop.default !== void 0) {
				const defaultVal = prop.default;
				if (!path) actions.push((data) => {
					if (typeof data === "object" && data !== null && !Object.hasOwn(data, key)) setOwn(data, key, typeof defaultVal === "object" && defaultVal !== null ? JSON.parse(JSON.stringify(defaultVal)) : defaultVal);
				});
				else {
					const parentPath = path;
					actions.push((data) => {
						let target = data;
						for (let j = 0; j < parentPath.length; j++) {
							if (typeof target !== "object" || target === null) return;
							if (!Object.hasOwn(target, parentPath[j])) return;
							target = target[parentPath[j]];
						}
						if (typeof target === "object" && target !== null && !Object.hasOwn(target, key)) setOwn(target, key, typeof defaultVal === "object" && defaultVal !== null ? JSON.parse(JSON.stringify(defaultVal)) : defaultVal);
					});
				}
			}
			if (prop && typeof prop === "object" && prop.properties) collectDefaults(prop, actions, (path || []).concat(key));
		}
	}
	module.exports = {
		buildDefaultsApplier,
		setOwn
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/schema-order.js
var require_schema_order = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const _keyIndexCache = /* @__PURE__ */ new WeakMap();
	const _rankCache = /* @__PURE__ */ new WeakMap();
	const _ordinalCache = /* @__PURE__ */ new WeakMap();
	function keyIndex(node, seg) {
		let index = _keyIndexCache.get(node);
		if (index === void 0) {
			index = /* @__PURE__ */ new Map();
			const keys = Object.keys(node);
			for (let i = 0; i < keys.length; i++) index.set(keys[i], i);
			_keyIndexCache.set(node, index);
		}
		const at = index.get(seg);
		return at === void 0 ? -1 : at;
	}
	function unescapePointerSegment(seg) {
		return seg.indexOf("~") < 0 ? seg : seg.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	function escapePointerSegment(seg) {
		return seg.indexOf("~") < 0 && seg.indexOf("/") < 0 ? seg : seg.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	function rankFor(rootSchema, schemaPath) {
		if (!schemaPath || typeof schemaPath !== "string" || !schemaPath.startsWith("#")) return null;
		if (rootSchema === null || typeof rootSchema !== "object") return null;
		let byPath = _rankCache.get(rootSchema);
		if (byPath === void 0) {
			byPath = /* @__PURE__ */ new Map();
			_rankCache.set(rootSchema, byPath);
		}
		const hit = byPath.get(schemaPath);
		if (hit !== void 0) return hit;
		const rank = computeRank(rootSchema, schemaPath);
		byPath.set(schemaPath, rank);
		return rank;
	}
	function computeRank(rootSchema, schemaPath) {
		const rank = [];
		let node = rootSchema;
		let start = 1;
		let hops = 0;
		while (start <= schemaPath.length) {
			let end = schemaPath.indexOf("/", start);
			if (end < 0) end = schemaPath.length;
			if (end === start) {
				start = end + 1;
				continue;
			}
			const seg = unescapePointerSegment(schemaPath.slice(start, end));
			if (node == null || typeof node !== "object") break;
			if (Array.isArray(node)) {
				const idx = Number(seg);
				if (!Number.isInteger(idx) || idx < 0 || idx >= node.length) break;
				rank.push(idx);
				node = node[idx];
			} else {
				const idx = keyIndex(node, seg);
				if (idx < 0) {
					const target = hops < 64 ? localTarget(rootSchema, node) : null;
					if (target === null) break;
					hops++;
					rank.push(keyIndex(node, "$ref"));
					node = target;
					continue;
				}
				rank.push(idx);
				node = node[seg];
			}
			start = end + 1;
		}
		return rank;
	}
	function localTarget(rootSchema, node) {
		const ref = node.$ref;
		if (typeof ref !== "string" || ref.charCodeAt(0) !== 35) return null;
		if (ref.length > 1 && ref.charCodeAt(1) !== 47) return null;
		let t = rootSchema;
		let start = 2;
		while (start <= ref.length && ref.length > 1) {
			let end = ref.indexOf("/", start);
			if (end < 0) end = ref.length;
			let seg = ref.slice(start, end);
			if (seg.indexOf("%") >= 0) try {
				seg = decodeURIComponent(seg);
			} catch {
				return null;
			}
			seg = unescapePointerSegment(seg);
			if (t === null || typeof t !== "object") return null;
			if (!Object.prototype.hasOwnProperty.call(t, seg)) {
				const alias = seg === "definitions" ? "$defs" : seg === "$defs" ? "definitions" : null;
				if (alias === null || !Object.prototype.hasOwnProperty.call(t, alias)) return null;
				seg = alias;
			}
			t = t[seg];
			start = end + 1;
		}
		return t !== null && typeof t === "object" && t !== node ? t : null;
	}
	function ordinals(rootSchema) {
		let map = _ordinalCache.get(rootSchema);
		if (map !== void 0) return map;
		map = /* @__PURE__ */ new Map();
		const seen = /* @__PURE__ */ new Set();
		let next = 0;
		const walk = (node, pointer) => {
			map.set(pointer, next++);
			if (node === null || typeof node !== "object") return;
			if (seen.has(node)) return;
			seen.add(node);
			if (Array.isArray(node)) for (let i = 0; i < node.length; i++) walk(node[i], pointer + "/" + i);
			else for (const key of Object.keys(node)) walk(node[key], pointer + "/" + escapePointerSegment(key));
		};
		walk(rootSchema, "#");
		_ordinalCache.set(rootSchema, map);
		return map;
	}
	function ordinalFor(rootSchema, schemaPath) {
		if (!schemaPath || typeof schemaPath !== "string" || schemaPath.charCodeAt(0) !== 35) return null;
		if (rootSchema === null || typeof rootSchema !== "object") return null;
		const map = ordinals(rootSchema);
		const hit = map.get(schemaPath);
		if (hit !== void 0) return hit;
		let misses = _missCache.get(rootSchema);
		if (misses === void 0) {
			misses = /* @__PURE__ */ new Map();
			_missCache.set(rootSchema, misses);
		}
		const known = misses.get(schemaPath);
		if (known !== void 0) return known;
		let p = schemaPath;
		let found = 0;
		while (true) {
			const cut = p.lastIndexOf("/");
			if (cut < 0) break;
			p = p.slice(0, cut);
			const o = map.get(p);
			if (o !== void 0) {
				const r = map.get(p + "/$ref");
				found = r !== void 0 ? r : o;
				break;
			}
		}
		if (misses.size < MISS_CACHE_LIMIT) misses.set(schemaPath, found);
		return found;
	}
	const _missCache = /* @__PURE__ */ new WeakMap();
	const MISS_CACHE_LIMIT = 4096;
	module.exports = {
		rankFor,
		ordinalFor,
		unescapePointerSegment
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/diagnostic-source.js
var require_diagnostic_source = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const KEY = Symbol.for("ata.diagnosticSource");
	const DESCRIPTOR = {
		value: null,
		enumerable: false,
		configurable: true,
		writable: true
	};
	function setDiagnosticSource(errors, payload) {
		if (!Array.isArray(errors) || !payload || !Object.isExtensible(errors)) return errors;
		const prev = errors[KEY];
		let value = payload;
		if (prev) {
			value = Object.assign({}, prev);
			for (const k of Object.keys(payload)) if (payload[k] !== void 0) value[k] = payload[k];
		}
		try {
			DESCRIPTOR.value = value;
			Object.defineProperty(errors, KEY, DESCRIPTOR);
			DESCRIPTOR.value = null;
		} catch {}
		return errors;
	}
	function getDiagnosticSource(errors) {
		return Array.isArray(errors) && errors[KEY] || null;
	}
	module.exports = {
		setDiagnosticSource,
		getDiagnosticSource
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/error-codes.js
var require_error_codes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const CODES = Object.freeze({
		ATA1001: {
			keyword: "type",
			category: "type",
			headline: "value has wrong type"
		},
		ATA1002: {
			keyword: "type",
			category: "type",
			headline: "value is not an object"
		},
		ATA2001: {
			keyword: "minLength",
			category: "constraint",
			headline: "string shorter than minLength"
		},
		ATA2002: {
			keyword: "maxLength",
			category: "constraint",
			headline: "string longer than maxLength"
		},
		ATA2003: {
			keyword: "minimum",
			category: "constraint",
			headline: "number below minimum"
		},
		ATA2004: {
			keyword: "maximum",
			category: "constraint",
			headline: "number above maximum"
		},
		ATA2005: {
			keyword: "exclusiveMinimum",
			category: "constraint",
			headline: "number not above exclusiveMinimum"
		},
		ATA2006: {
			keyword: "exclusiveMaximum",
			category: "constraint",
			headline: "number not below exclusiveMaximum"
		},
		ATA2007: {
			keyword: "multipleOf",
			category: "constraint",
			headline: "number not a multiple of expected divisor"
		},
		ATA2008: {
			keyword: "minItems",
			category: "constraint",
			headline: "array shorter than minItems"
		},
		ATA2009: {
			keyword: "maxItems",
			category: "constraint",
			headline: "array longer than maxItems"
		},
		ATA2010: {
			keyword: "minProperties",
			category: "constraint",
			headline: "object has fewer than minProperties"
		},
		ATA2011: {
			keyword: "maxProperties",
			category: "constraint",
			headline: "object has more than maxProperties"
		},
		ATA2012: {
			keyword: "uniqueItems",
			category: "constraint",
			headline: "array has duplicate items"
		},
		ATA2013: {
			keyword: "pattern",
			category: "constraint",
			headline: "string does not match pattern"
		},
		ATA3001: {
			keyword: "format",
			format: "email",
			category: "format",
			headline: "value does not match format \"email\""
		},
		ATA3002: {
			keyword: "format",
			format: "date",
			category: "format",
			headline: "value does not match format \"date\""
		},
		ATA3003: {
			keyword: "format",
			format: "date-time",
			category: "format",
			headline: "value does not match format \"date-time\""
		},
		ATA3004: {
			keyword: "format",
			format: "time",
			category: "format",
			headline: "value does not match format \"time\""
		},
		ATA3005: {
			keyword: "format",
			format: "uri",
			category: "format",
			headline: "value does not match format \"uri\""
		},
		ATA3006: {
			keyword: "format",
			format: "uri-reference",
			category: "format",
			headline: "value does not match format \"uri-reference\""
		},
		ATA3007: {
			keyword: "format",
			format: "ipv4",
			category: "format",
			headline: "value does not match format \"ipv4\""
		},
		ATA3008: {
			keyword: "format",
			format: "ipv6",
			category: "format",
			headline: "value does not match format \"ipv6\""
		},
		ATA3009: {
			keyword: "format",
			format: "uuid",
			category: "format",
			headline: "value does not match format \"uuid\""
		},
		ATA3010: {
			keyword: "format",
			format: "hostname",
			category: "format",
			headline: "value does not match format \"hostname\""
		},
		ATA3099: {
			keyword: "format",
			category: "format",
			headline: "value does not match user-defined format"
		},
		ATA4001: {
			keyword: "oneOf",
			category: "composition",
			headline: "value matched 0 of N oneOf variants"
		},
		ATA4002: {
			keyword: "oneOf",
			category: "composition",
			headline: "value matched more than one oneOf variant"
		},
		ATA4003: {
			keyword: "anyOf",
			category: "composition",
			headline: "value matched none of the anyOf variants"
		},
		ATA4004: {
			keyword: "allOf",
			category: "composition",
			headline: "value failed one or more allOf branches"
		},
		ATA4005: {
			keyword: "not",
			category: "composition",
			headline: "value matched a forbidden schema"
		},
		ATA4006: {
			keyword: "if",
			category: "composition",
			headline: "value violated then/else branch"
		},
		ATA5001: {
			keyword: "$ref",
			category: "ref",
			headline: "$ref could not be resolved"
		},
		ATA5002: {
			keyword: "$ref",
			category: "ref",
			headline: "recursive $ref cycle detected at validate time"
		},
		ATA6001: {
			keyword: "enum",
			category: "enum",
			headline: "value is not one of the allowed enum values"
		},
		ATA6002: {
			keyword: "const",
			category: "enum",
			headline: "value does not equal const"
		},
		ATA7001: {
			keyword: "required",
			category: "shape",
			headline: "object missing required property"
		},
		ATA7002: {
			keyword: "additionalProperties",
			category: "shape",
			headline: "object has property not allowed by schema"
		},
		ATA7003: {
			keyword: "unevaluatedProperties",
			category: "shape",
			headline: "object has unevaluated property"
		},
		ATA7004: {
			keyword: "unevaluatedItems",
			category: "shape",
			headline: "array has unevaluated items"
		},
		ATA7005: {
			keyword: "dependentRequired",
			category: "shape",
			headline: "dependentRequired property missing"
		},
		ATA7006: {
			keyword: "propertyNames",
			category: "shape",
			headline: "property name violates schema"
		},
		ATA7007: {
			keyword: "contains",
			category: "shape",
			headline: "array does not contain a matching item"
		},
		ATA9000: {
			keyword: "__abort_early__",
			category: "system",
			headline: "validation failed (abortEarly)"
		},
		ATA9001: {
			keyword: "__parse__",
			category: "system",
			headline: "input is not valid JSON"
		},
		ATA9002: {
			keyword: "__compile__",
			category: "system",
			headline: "schema failed to compile"
		}
	});
	function get(code) {
		return CODES[code];
	}
	function all() {
		return Object.keys(CODES).sort();
	}
	const BY_KEYWORD = /* @__PURE__ */ new Map();
	const BY_FORMAT = /* @__PURE__ */ new Map();
	for (const c of Object.keys(CODES).sort()) {
		const meta = CODES[c];
		if (!BY_KEYWORD.has(meta.keyword)) BY_KEYWORD.set(meta.keyword, c);
		if (meta.keyword === "format" && meta.format && !BY_FORMAT.has(meta.format)) BY_FORMAT.set(meta.format, c);
	}
	function codeFor(keyword, format) {
		if (keyword === "format" && format) {
			const hit = BY_FORMAT.get(format);
			return hit === void 0 ? "ATA3099" : hit;
		}
		const hit = BY_KEYWORD.get(keyword);
		return hit === void 0 ? null : hit;
	}
	const NATIVE_KEYWORDS = [
		null,
		"__parse__",
		"__compile__",
		"type",
		"required",
		"additionalProperties",
		"enum",
		"const",
		"minimum",
		"maximum",
		"exclusiveMinimum",
		"exclusiveMaximum",
		"minLength",
		"maxLength",
		"pattern",
		"format",
		"minItems",
		"maxItems",
		"uniqueItems",
		"minProperties",
		"maxProperties",
		"multipleOf",
		"allOf",
		"anyOf",
		"oneOf",
		"not",
		"$ref",
		"if"
	];
	function fromNative(ordinal, format) {
		if (typeof ordinal !== "number" || !Number.isInteger(ordinal)) return null;
		const keyword = NATIVE_KEYWORDS[ordinal];
		if (!keyword) return null;
		return {
			keyword,
			code: keyword === "format" ? format ? codeFor("format", format) || "ATA3099" : "ATA3099" : codeFor(keyword) || "ATA9001"
		};
	}
	module.exports = {
		CODES,
		get,
		all,
		codeFor,
		fromNative,
		NATIVE_KEYWORDS
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/levenshtein.js
var require_levenshtein = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let scratchA = /* @__PURE__ */ new Int32Array(64);
	let scratchB = /* @__PURE__ */ new Int32Array(64);
	function levenshtein(a, b, maxDistance) {
		if (a === b) return 0;
		const n = a.length;
		const m = b.length;
		const max = maxDistance == null || maxDistance > n + m ? n + m : maxDistance;
		if (Math.abs(n - m) > max) return Infinity;
		if (n === 0) return m;
		if (m === 0) return n;
		const big = max + 1;
		if (scratchA.length < m + 2) {
			scratchA = new Int32Array(m + 2);
			scratchB = new Int32Array(m + 2);
		}
		let prev = scratchA;
		let curr = scratchB;
		for (let j = 0; j <= m; j++) prev[j] = j <= max ? j : big;
		for (let i = 1; i <= n; i++) {
			const lo = i - max > 1 ? i - max : 1;
			const hi = i + max < m ? i + max : m;
			curr[lo - 1] = lo === 1 ? i : big;
			let rowMin = curr[lo - 1];
			const ca = a.charCodeAt(i - 1);
			for (let j = lo; j <= hi; j++) {
				let v = prev[j - 1] + (ca === b.charCodeAt(j - 1) ? 0 : 1);
				const del = curr[j - 1] + 1;
				if (del < v) v = del;
				const ins = prev[j] + 1;
				if (ins < v) v = ins;
				if (v > big) v = big;
				curr[j] = v;
				if (v < rowMin) rowMin = v;
			}
			if (hi < m) curr[hi + 1] = big;
			if (rowMin > max) return Infinity;
			const t = prev;
			prev = curr;
			curr = t;
		}
		return prev[m] > max ? Infinity : prev[m];
	}
	module.exports = { levenshtein };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/pointer.js
var require_pointer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Resolve a JSON pointer against a document, for the diagnostic paths that run
	* once per error on a rejected payload.
	*
	* Segments are read straight out of the pointer string: no leading-slash
	* regex, no parts array, and no unescape pass on the segments that carry no
	* `~`. A pointer that leaves the document returns rather than throwing,
	* because a diagnostic must not fail where validation succeeded.
	*
	* `missing` separates the two ways a pointer yields nothing: a key that is
	* absent from a container that exists resolves to undefined, while a pointer
	* that walks through a null or a primitive returns `missing`. Callers that
	* format the value need that apart, since the first is a value worth printing
	* and the second is a path that was never in the document.
	*
	* @param {*} data the document the pointer is read against
	* @param {string} pointer an RFC 6901 pointer, '' for the document itself
	* @param {*} [missing] returned when the walk leaves the document
	* @returns {*} the value at the pointer, `missing` if the walk broke
	*/
	function resolvePointer(data, pointer, missing) {
		if (!pointer) return data;
		const len = pointer.length;
		let cur = data;
		let i = pointer.charCodeAt(0) === 47 ? 1 : 0;
		for (;;) {
			let j = pointer.indexOf("/", i);
			if (j === -1) j = len;
			let seg = pointer.slice(i, j);
			if (seg.indexOf("~") !== -1) seg = seg.replace(/~1/g, "/").replace(/~0/g, "~");
			if (cur == null) return missing;
			cur = cur[seg];
			if (j === len) break;
			i = j + 1;
		}
		return cur;
	}
	module.exports = {
		resolvePointer,
		UNRESOLVED: Symbol("ata.pointer.unresolved")
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/suggestions.js
var require_suggestions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { levenshtein } = require_levenshtein();
	const { resolvePointer: walk, UNRESOLVED } = require_pointer();
	const FORMAT_HINTS = {
		email: (val) => {
			if (typeof val !== "string") return null;
			if (!val.includes("@")) return "missing '@' and domain part";
			if (val.split("@").length > 2) return "multiple '@' characters";
			const [, dom] = val.split("@");
			if (!dom || !dom.includes(".")) return "domain part missing dot";
			return null;
		},
		date: (val) => {
			if (typeof val !== "string") return null;
			const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
			if (!m) return "expected YYYY-MM-DD layout";
			const mo = +m[2];
			if (mo < 1 || mo > 12) return "month must be 01-12";
			const d = +m[3];
			if (d < 1 || d > 31) return "day must be 01-31";
			return null;
		},
		uuid: (val) => {
			if (typeof val !== "string") return null;
			if (!/^[0-9a-fA-F-]+$/.test(val)) return "expected hex digits and dashes";
			return "expected 8-4-4-4-12 hex layout";
		},
		ipv4: (val) => typeof val === "string" ? "expected four 0-255 octets separated by dots" : null
	};
	function typoBudget(name) {
		const n = name.length;
		return n < 3 ? 0 : n < 5 ? 1 : 2;
	}
	function nearest(target, candidates) {
		const budget = typoBudget(target);
		let best = null;
		let bestDist = budget + 1;
		let tied = false;
		for (const c of candidates) {
			if (typeof c !== "string") continue;
			const d = levenshtein(target, c, budget);
			if (d === 0 || d > budget) continue;
			if (d < bestDist) {
				best = c;
				bestDist = d;
				tied = false;
			} else if (d === bestDist) tied = true;
		}
		return tied ? null : best;
	}
	function suggestEnumTypo(received, enumValues) {
		if (typeof received !== "string") return null;
		if (!Array.isArray(enumValues) || enumValues.length === 0 || enumValues.length > 30) return null;
		const best = nearest(received, enumValues);
		return best === null ? null : {
			text: `did you mean \`${best}\`?`,
			kind: "typo"
		};
	}
	const MAX_TYPO_CANDIDATES = 64;
	function suggestRequiredTypo(missing, presentKeys) {
		if (!missing || !Array.isArray(presentKeys)) return null;
		if (presentKeys.length > MAX_TYPO_CANDIDATES) return null;
		const best = nearest(missing, presentKeys);
		return best === null ? null : {
			text: `did you mean \`${missing}\` instead of \`${best}\`?`,
			kind: "similar-key"
		};
	}
	function suggestFormat(format, raw) {
		const fn = FORMAT_HINTS[format];
		if (!fn) return null;
		const text = fn(raw);
		return text ? {
			text,
			kind: "format"
		} : null;
	}
	function suggestCoercion(expectedType, raw) {
		if (typeof raw !== "string") return null;
		if (expectedType === "integer" && /^-?\d+$/.test(raw)) return {
			text: "value would coerce; enable `coerceTypes` or pass an integer",
			kind: "coercion"
		};
		if (expectedType === "number" && /^-?\d+(\.\d+)?$/.test(raw)) return {
			text: "value would coerce; enable `coerceTypes` or pass a number",
			kind: "coercion"
		};
		if (expectedType === "boolean" && (raw === "true" || raw === "false")) return {
			text: "value would coerce; enable `coerceTypes` or pass a boolean",
			kind: "coercion"
		};
		return null;
	}
	/**
	* Apply suggestion sources in priority order. Returns the first hit, or null.
	* @param err Enriched ValidationError (with `received`, `params`, `keyword`)
	* @param data The full input data (for required-typo)
	* @param at The value at `err.path`, already resolved by the caller, or
	*   UNRESOLVED when the caller has none to offer
	*/
	function suggestFor(err, data, at = UNRESOLVED) {
		const raw = at !== UNRESOLVED ? at : parseReceived(err.received);
		if (err.keyword === "enum") return suggestEnumTypo(raw, err.params && err.params.allowedValues);
		if (err.keyword === "required") {
			const missing = err.params && err.params.missingProperty;
			const path = err.path || "";
			let parentPath = path;
			if (parentPath.endsWith("/" + missing)) parentPath = parentPath.slice(0, -missing.length - 1);
			const parent = parentPath === path && at !== UNRESOLVED ? at : walk(data, parentPath);
			if (parent && typeof parent === "object") return suggestRequiredTypo(missing, Object.keys(parent));
			return null;
		}
		if (err.keyword === "format") return suggestFormat(err.params && err.params.format, raw);
		if (err.keyword === "type") return suggestCoercion(err.params && err.params.type, raw);
		return null;
	}
	function parseReceived(r) {
		if (typeof r !== "string") return r;
		if (r.startsWith("\"") && r.endsWith("\"")) try {
			return JSON.parse(r);
		} catch {
			return r;
		}
		return r;
	}
	module.exports = {
		suggestFor,
		suggestEnumTypo,
		suggestRequiredTypo,
		suggestFormat,
		suggestCoercion
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/enrich-error.js
var require_enrich_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { CODES, codeFor, fromNative } = require_error_codes();
	const { suggestFor } = require_suggestions();
	const { resolvePointer } = require_pointer();
	const MISSING = Symbol("ata.received.missing");
	const DOC_BASE = "https://ata-validator.com/e/";
	function jsonSizeWithin(v, budget) {
		if (budget < 0) return -1;
		if (v === null) return 4;
		const t = typeof v;
		if (t === "number") return Number.isFinite(v) ? String(v).length : 4;
		if (t === "boolean") return v ? 4 : 5;
		if (t === "string") return v.length + 2 > budget ? -1 : v.length + 2;
		if (t !== "object") return -1;
		if (typeof v.toJSON === "function") return 2;
		if (Array.isArray(v)) {
			let n = 2;
			for (let i = 0; i < v.length; i++) {
				n += i === 0 ? 0 : 1;
				if (n > budget) return -1;
				const c = jsonSizeWithin(v[i], budget - n);
				if (c < 0) return -1;
				n += c;
				if (n > budget) return -1;
			}
			return n;
		}
		const proto = Object.getPrototypeOf(v);
		if (proto !== Object.prototype && proto !== null) return -1;
		let n = 2;
		let first = true;
		for (const k in v) {
			const val = v[k];
			if (val === void 0 || typeof val === "function" || typeof val === "symbol") continue;
			n += k.length + 3 + (first ? 0 : 1);
			if (n > budget) return -1;
			first = false;
			const c = jsonSizeWithin(val, budget - n);
			if (c < 0) return -1;
			n += c;
			if (n > budget) return -1;
		}
		return n;
	}
	function reprValue(v) {
		if (v === void 0) return "undefined";
		if (v === null) return "null";
		const t = typeof v;
		if (t === "string") {
			const s = JSON.stringify(v);
			return s.length > 60 ? s.slice(0, 57) + "...\"" : s;
		}
		if (t === "number" || t === "boolean") return String(v);
		if (Array.isArray(v)) return `[array, ${v.length} items]`;
		if (t === "object") {
			if (jsonSizeWithin(v, 60) >= 0) try {
				const s = JSON.stringify(v);
				if (s !== void 0 && s.length <= 60) return s;
			} catch {
				return "[object, unserializable]";
			}
			let n;
			try {
				n = Object.keys(v).length;
			} catch {
				return "[object, unserializable]";
			}
			return `[object, ${n} ${n === 1 ? "key" : "keys"}]`;
		}
		return `[${t}]`;
	}
	function expectedFor(err) {
		switch (err.keyword) {
			case "type": return err.params && err.params.type ? String(err.params.type) : void 0;
			case "minLength": return err.params && err.params.limit != null ? `string with ≥${err.params.limit} chars` : void 0;
			case "maxLength": return err.params && err.params.limit != null ? `string with ≤${err.params.limit} chars` : void 0;
			case "minimum": return err.params && err.params.limit != null ? `≥${err.params.limit}` : void 0;
			case "maximum": return err.params && err.params.limit != null ? `≤${err.params.limit}` : void 0;
			case "format": return err.params && err.params.format ? `format '${err.params.format}'` : void 0;
			case "pattern": return err.params && err.params.pattern ? `string matching /${err.params.pattern}/` : void 0;
			case "enum": return err.params && err.params.allowedValues ? `one of [${err.params.allowedValues.map(reprValue).join(", ")}]` : void 0;
			case "const": return err.params && "allowedValue" in err.params ? reprValue(err.params.allowedValue) : void 0;
			case "required": return err.params && err.params.missingProperty ? `property '${err.params.missingProperty}'` : void 0;
			default: return;
		}
	}
	function resolveAt(err, data) {
		if (!data && data !== 0 && data !== false) return MISSING;
		const p = err.instancePath || err.path || "";
		if (!p) return data;
		return resolvePointer(data, p, MISSING);
	}
	/**
	* Enrich a raw codegen error with code/path/expected/received/docUrl.
	* Pure: returns a new object. Source frames and suggestions are added by
	* other helpers later in the pipeline.
	*/
	function detailFor(err, out) {
		const p = err.params || {};
		switch (err.keyword) {
			case "type": return `expected ${p.type}, found ${typeNameOf(out.received)}`;
			case "required": return `missing required property "${p.missingProperty}"`;
			case "additionalProperties": return `unknown property "${p.additionalProperty}"`;
			case "unevaluatedProperties": return `unevaluated property "${p.unevaluatedProperty}"`;
			case "enum": return out.expected ? `expected ${out.expected}, found ${out.received}` : void 0;
			case "const": return out.expected ? `expected ${out.expected}, found ${out.received}` : void 0;
			case "format": return `not a valid ${p.format}: ${out.received}`;
			case "minimum":
			case "maximum":
			case "exclusiveMinimum":
			case "exclusiveMaximum": return `expected ${out.expected}, found ${out.received}`;
			case "minLength":
			case "maxLength": return `expected ${out.expected}, found ${out.received}`;
			default: return out.expected ? `expected ${out.expected}, found ${out.received}` : void 0;
		}
	}
	function typeNameOf(received) {
		if (received === void 0) return "nothing";
		if (received === "null") return "null";
		if (received === "true" || received === "false") return "boolean";
		if (received.startsWith("\"")) return "string";
		if (received.startsWith("[array")) return "array";
		if (received.startsWith("{") || received.startsWith("[object")) return "object";
		if (/^-?\d/.test(received)) return "number";
		return "value";
	}
	const RANK = {
		required: 0,
		additionalProperties: 0,
		unevaluatedProperties: 0,
		unevaluatedItems: 0,
		dependentRequired: 0,
		propertyNames: 0,
		type: 1,
		oneOf: 3,
		anyOf: 3,
		allOf: 3,
		not: 3
	};
	function rankFor(keyword) {
		const r = RANK[keyword];
		return r === void 0 ? 2 : r;
	}
	function enrich(rawErr, opts) {
		const data = opts && opts.data;
		const positions = opts && opts.positions;
		let st = rawErr._t;
		if (st === void 0 || st.code === void 0) {
			const format = rawErr.params && rawErr.params.format;
			const fromAddon = typeof rawErr.code === "number" ? fromNative(rawErr.code, format) : null;
			const keyword = rawErr.keyword || fromAddon && fromAddon.keyword;
			const dependent = keyword === "required" && typeof rawErr.schemaPath === "string" && rawErr.schemaPath.endsWith("/dependentRequired");
			const code = fromAddon && fromAddon.code || typeof rawErr.code === "string" && rawErr.code || dependent && "ATA7005" || codeFor(keyword, format) || "ATA9001";
			const meta = CODES[code];
			const fixed = {
				code,
				message: rawErr.message || meta && meta.headline || "validation failed",
				keyword,
				path: rawErr.instancePath != null ? rawErr.instancePath : rawErr.path || "",
				expected: expectedFor(rawErr),
				docUrl: DOC_BASE + code,
				rank: rankFor(keyword)
			};
			if (st !== void 0 && !fromAddon) Object.assign(st, fixed);
			st = fixed;
		}
		const path = st.path;
		const at = data !== void 0 ? resolveAt(rawErr, data) : MISSING;
		const out = {
			code: st.code,
			message: st.message,
			keyword: st.keyword,
			path,
			expected: st.expected,
			received: at === MISSING ? void 0 : reprValue(at),
			schemaPath: rawErr.schemaPath,
			docUrl: st.docUrl,
			instancePath: path,
			dataPath: path,
			params: rawErr.params,
			parentSchema: rawErr.parentSchema
		};
		if ("data" in rawErr) out.data = rawErr.data;
		if ("schema" in rawErr) out.schema = rawErr.schema;
		if (rawErr.branchErrors) out.branchErrors = rawErr.branchErrors.map((b) => enrich(b, data !== void 0 ? { data } : null));
		if (positions && positions[path]) {
			const p = positions[path];
			out.dataFrame = {
				byteOffset: p.byteOffset,
				length: p.length,
				line: p.line,
				col: p.col,
				text: p.text
			};
		}
		if (opts && opts.schemaPositions && rawErr.schemaPath) {
			const sp = rawErr.schemaPath;
			const ptr = sp.startsWith("#") ? sp.slice(1) : sp;
			const hit = opts.schemaPositions[ptr] || opts.schemaPositions[ptr + "#key"];
			if (hit) out.schemaSource = {
				file: opts.schemaFile,
				line: hit.line,
				col: hit.col,
				text: hit.text
			};
		}
		const sugg = suggestFor(out, data, at === MISSING ? void 0 : at);
		if (sugg) out.suggestion = sugg;
		const detail = detailFor(rawErr, out);
		if (detail !== void 0) out.detail = detail;
		out.rank = st.rank;
		if (opts && opts.positions) {
			const named = rawErr.params && (rawErr.params.additionalProperty || rawErr.params.unevaluatedProperty) || null;
			const own = opts.positions[path];
			const src = (named ? opts.positions[(path === "" ? "" : path) + "/" + named] : null) || own;
			if (src) {
				out.anchor = {
					line: src.line,
					col: src.col,
					length: src.length
				};
				if (src.keyOffset !== void 0) {
					out.anchor.keyLine = src.keyLine;
					out.anchor.keyCol = src.keyCol;
					out.anchor.keyLength = src.keyLength;
				}
			}
		}
		return out;
	}
	module.exports = {
		enrich,
		reprValue,
		expectedFor,
		detailFor,
		rankFor,
		MISSING,
		DOC_BASE
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/correlate.js
var require_correlate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { levenshtein } = require_levenshtein();
	const MAX_DISTANCE = 2;
	/**
	* Pair a `required` error naming a missing property with an
	* `additionalProperties` error naming an extra property, when the two names
	* are close enough to be one typo and nothing else in the same container is
	* equally close.
	*
	* The tie checks are the point. `suggestRequiredTypo` in lib/suggestions.js
	* takes the first key within distance 2 and does not check for ties, which is
	* fine for a hint appended to an error that stands on its own. It is not fine
	* as a reason to present two errors as one problem: an ambiguous pairing would
	* tell the reader a confident story about the wrong key.
	*
	* Nothing is deleted. The result is a symmetric index map that callers may use
	* to group; every error stays in the array.
	*
	* @param {Array} errors enriched or raw validation errors
	* @returns {Map<number, number>|null} symmetric index pairs, null when there are none
	*/
	function correlateTypos(errors) {
		if (!Array.isArray(errors) || errors.length < 2) return null;
		let sawMissing = false;
		let sawExtra = false;
		for (let i = 0; i < errors.length; i++) {
			const e = errors[i];
			if (!e) continue;
			if (e.keyword === "required") sawMissing = true;
			else if (e.keyword === "additionalProperties") sawExtra = true;
			if (sawMissing && sawExtra) break;
		}
		if (!sawMissing || !sawExtra) return null;
		const out = /* @__PURE__ */ new Map();
		const byContainer = /* @__PURE__ */ new Map();
		for (let i = 0; i < errors.length; i++) {
			const e = errors[i];
			if (!e || !e.params) continue;
			const missing = e.keyword === "required" ? e.params.missingProperty : void 0;
			const additional = e.keyword === "additionalProperties" ? e.params.additionalProperty : void 0;
			if (typeof missing !== "string" && typeof additional !== "string") continue;
			const key = e.instancePath != null ? e.instancePath : e.path || "";
			let bucket = byContainer.get(key);
			if (!bucket) {
				bucket = {
					missing: [],
					extra: []
				};
				byContainer.set(key, bucket);
			}
			if (typeof missing === "string") bucket.missing.push({
				index: i,
				name: missing
			});
			else bucket.extra.push({
				index: i,
				name: additional
			});
		}
		for (const bucket of byContainer.values()) {
			if (bucket.missing.length === 0 || bucket.extra.length === 0) continue;
			const dist = [];
			for (let m = 0; m < bucket.missing.length; m++) {
				dist.push([]);
				for (let x = 0; x < bucket.extra.length; x++) {
					const d = levenshtein(bucket.missing[m].name, bucket.extra[x].name, MAX_DISTANCE);
					dist[m].push(d);
				}
			}
			for (let m = 0; m < bucket.missing.length; m++) {
				let bestX = -1;
				let bestD = Infinity;
				let tied = false;
				for (let x = 0; x < bucket.extra.length; x++) {
					const d = dist[m][x];
					if (d < bestD) {
						bestD = d;
						bestX = x;
						tied = false;
					} else if (d === bestD && d !== Infinity) tied = true;
				}
				if (bestX === -1 || tied) continue;
				if (!(bestD > 0 && bestD <= MAX_DISTANCE)) continue;
				let backM = -1;
				let backD = Infinity;
				let backTied = false;
				for (let m2 = 0; m2 < bucket.missing.length; m2++) {
					const d = dist[m2][bestX];
					if (d < backD) {
						backD = d;
						backM = m2;
						backTied = false;
					} else if (d === backD && d !== Infinity) backTied = true;
				}
				if (backTied || backM !== m) continue;
				out.set(bucket.missing[m].index, bucket.extra[bestX].index);
				out.set(bucket.extra[bestX].index, bucket.missing[m].index);
			}
		}
		return out.size === 0 ? null : out;
	}
	module.exports = { correlateTypos };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/rejections.js
var require_rejections = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { ordinalFor: schemaOrdinal, rankFor: schemaRank } = require_schema_order();
	const { setDiagnosticSource: attachDiagnosticSource } = require_diagnostic_source();
	var LazyRejection = class {
		constructor(build, data, buildRaw) {
			this.valid = false;
			this._build = build;
			this._data = data;
			this._errors = null;
			this._buildRaw = buildRaw;
		}
		toJSON() {
			return {
				valid: false,
				errors: this.errors
			};
		}
		_ataRaw() {
			return this._buildRaw ? this._buildRaw(this._data) : this.errors;
		}
	};
	Object.defineProperty(LazyRejection.prototype, "errors", {
		enumerable: true,
		configurable: true,
		get() {
			if (this._errors === null) this._errors = this._build(this._data);
			return this._errors;
		}
	});
	let _enrichFn = null;
	function _enrichLazy(e, opts) {
		if (_enrichFn === null) _enrichFn = require_enrich_error().enrich;
		return _enrichFn(e, opts);
	}
	var RichRejection = class {
		constructor(result, data, rawInput, self, root, enrich) {
			this.valid = false;
			this._result = result;
			this._data = data;
			this._rawInput = rawInput;
			this._self = self;
			this._root = root;
			this._enrich = enrich;
			this._cached = null;
		}
		toJSON() {
			return {
				valid: false,
				errors: this.errors
			};
		}
		_ataRaw() {
			let raw = this._result.errors || [];
			if (needsOrdering(raw)) raw = sortErrorsBySchemaOrder(this._root, raw);
			return raw;
		}
	};
	function presentErrors(raw, data, rawInput, self, root, enrich) {
		if (needsOrdering(raw)) raw = sortErrorsBySchemaOrder(root, raw);
		let positions = null;
		if (enrich && raw.length && rawInput != null) {
			positions = self._pos().targeted(rawInput, wantedPointersFor(raw));
			if (positions) self._posCache.reset();
		}
		const opts = enrich && raw.length ? {
			data,
			positions,
			schemaPositions: self._schemaPositions,
			schemaFile: self._source ? self._source.path : void 0
		} : null;
		const cached = opts ? raw.map((e) => enrich(e, opts)) : raw.map(stripOrdinal);
		if (enrich && cached.length > 1) attachRelated(cached);
		return cached;
	}
	Object.defineProperty(RichRejection.prototype, "errors", {
		enumerable: true,
		configurable: true,
		get() {
			if (this._cached === null) this._cached = presentErrors(this._result.errors || [], this._data, this._rawInput, this._self, this._root, this._enrich);
			return this._cached;
		}
	});
	var LazyJsonRejection = class {
		constructor(result, jsonStr, self, enrich, parsed) {
			this.valid = false;
			this._result = result;
			this._jsonStr = jsonStr;
			this._self = self;
			this._enrich = enrich;
			this._cached = null;
			this._parsed = parsed;
		}
		toJSON() {
			return {
				valid: false,
				errors: this.errors
			};
		}
	};
	Object.defineProperty(LazyJsonRejection.prototype, "errors", {
		enumerable: true,
		configurable: true,
		get() {
			if (this._cached !== null) return this._cached;
			const self = this._self;
			const enrich = this._enrich;
			const jsonStr = this._jsonStr;
			const raw = this._result.errors || [];
			if (!raw.length) {
				this._cached = raw;
				return raw;
			}
			let parsedData = this._parsed;
			if (parsedData === void 0) {
				try {
					parsedData = JSON.parse(jsonStr);
				} catch {
					parsedData = void 0;
				}
				if (parsedData !== void 0 && self._preprocess) self._preprocess(parsedData);
			}
			if (!raw[0] || !("received" in raw[0])) {
				const positions = self._pos().targeted(jsonStr, wantedPointersFor(raw));
				const ordered = needsOrdering(raw) ? sortErrorsBySchemaOrder(self._schemaObj, raw) : raw;
				const enrichOpts = {
					data: parsedData,
					positions,
					schemaPositions: self._schemaPositions,
					schemaFile: self._source ? self._source.path : void 0
				};
				const enriched = ordered.map((e) => enrich(e, enrichOpts));
				if (enriched.length > 1) attachRelated(enriched);
				attachDiagnosticSource(enriched, {
					data: parsedData,
					text: jsonStr,
					positions,
					schema: self._schemaObj,
					mutatesInput: self._mutatesInput === true
				});
				if (positions) self._posCache.reset();
				this._cached = enriched;
				return enriched;
			}
			if (raw.some((e) => e && !e.dataFrame)) {
				const positions = self._pos().targeted(jsonStr, wantedPointersFor(raw.filter((e) => e && !e.dataFrame)));
				if (positions) {
					for (const e of raw) if (e && !e.dataFrame) {
						const p = positions[e.path != null ? e.path : e.instancePath || ""];
						if (p) e.dataFrame = {
							byteOffset: p.byteOffset,
							length: p.length,
							line: p.line,
							col: p.col,
							text: p.text
						};
					}
					self._posCache.reset();
				}
			}
			if (raw.length > 1) attachRelated(raw);
			attachDiagnosticSource(raw, {
				data: parsedData,
				text: jsonStr,
				schema: self._schemaObj,
				mutatesInput: self._mutatesInput === true
			});
			this._cached = raw;
			return raw;
		}
	});
	function wantedPointersFor(errors) {
		const wanted = /* @__PURE__ */ new Set();
		for (const e of errors) {
			if (!e) continue;
			const path = e.path != null ? e.path : e.instancePath || "";
			wanted.add(path);
			if (e.instancePath != null && e.instancePath !== path) wanted.add(e.instancePath);
			const params = e.params;
			const named = params && (params.additionalProperty || params.unevaluatedProperty);
			if (typeof named === "string") {
				wanted.add(path + "/" + named);
				if (named.indexOf("~") !== -1 || named.indexOf("/") !== -1) wanted.add(path + "/" + named.replace(/~/g, "~0").replace(/\//g, "~1"));
			}
		}
		return wanted;
	}
	const COLLAPSE_CODES = /* @__PURE__ */ new Set([
		"ATA4001",
		"ATA4002",
		"ATA4003"
	]);
	function stripOrdinal(e) {
		if (e === null || typeof e !== "object") return e;
		if (e._s === true && e.code === void 0 && e.docUrl === void 0 && e.branchErrors === void 0) return {
			keyword: e.keyword,
			instancePath: e.instancePath,
			schemaPath: e.schemaPath,
			params: e.params,
			message: e.message
		};
		if (e.path !== void 0 && e.docUrl === void 0 && COLLAPSE_CODES.has(e.code)) {
			const out = {
				code: e.code,
				keyword: e.keyword,
				instancePath: e.instancePath,
				path: e.path,
				schemaPath: e.schemaPath,
				message: e.message,
				params: e.params
			};
			if ("branchErrors" in e) out.branchErrors = Array.isArray(e.branchErrors) ? e.branchErrors.map(stripOrdinal) : e.branchErrors;
			return out;
		}
		if (e._o === void 0 && e.docUrl === void 0 && (e.code === void 0 || COLLAPSE_CODES.has(e.code)) && !e.branchErrors) return e._s === true ? { ...e } : e;
		const out = {};
		for (const k in e) {
			if (k === "_o" || k === "docUrl") continue;
			if (k === "code" && !COLLAPSE_CODES.has(e.code)) continue;
			out[k] = k === "branchErrors" && Array.isArray(e[k]) ? e[k].map(stripOrdinal) : e[k];
		}
		return out;
	}
	function needsOrdering(raw) {
		if (raw.length > 1) return true;
		const e = raw[0];
		return raw.length === 1 && e !== null && typeof e === "object" && Array.isArray(e.branchErrors) && needsOrdering(e.branchErrors);
	}
	function sortBranchErrors(rootSchema, errors) {
		let out = null;
		for (let i = 0; i < errors.length; i++) {
			const e = errors[i];
			const b = e !== null && typeof e === "object" ? e.branchErrors : void 0;
			if (!Array.isArray(b) || b.length === 0) continue;
			const sb = sortErrorsBySchemaOrder(rootSchema, b);
			if (sb === b) continue;
			if (out === null) out = errors.slice();
			out[i] = Object.assign({}, e, { branchErrors: sb });
		}
		return out === null ? errors : out;
	}
	function sortErrorsBySchemaOrder(rootSchema, errors) {
		errors = sortBranchErrors(rootSchema, errors);
		const n = errors.length;
		const keys = new Array(n);
		let sorted = true;
		let prev = -1;
		let prevPath = null;
		for (let i = 0; i < n; i++) {
			const e = errors[i];
			let o = typeof e._o === "number" ? e._o : schemaOrdinal(rootSchema, e.schemaPath);
			if (o === null) o = prev < 0 ? 0 : prev;
			keys[i] = o;
			if (o < prev || o === prev && sorted && e.schemaPath !== prevPath && tieOrder(rootSchema, prevPath, e.schemaPath) > 0) sorted = false;
			prev = o;
			prevPath = e.schemaPath;
		}
		if (sorted) return errors;
		const out = errors.slice();
		for (let i = 1; i < n; i++) {
			const k = keys[i];
			const e = out[i];
			let j = i - 1;
			while (j >= 0 && (keys[j] > k || keys[j] === k && tieOrder(rootSchema, out[j].schemaPath, e.schemaPath) > 0)) {
				keys[j + 1] = keys[j];
				out[j + 1] = out[j];
				j--;
			}
			keys[j + 1] = k;
			out[j + 1] = e;
		}
		return out;
	}
	function tieOrder(rootSchema, a, b) {
		if (a === b) return 0;
		const ra = schemaRank(rootSchema, a), rb = schemaRank(rootSchema, b);
		if (ra === null || rb === null) return 0;
		const m = Math.min(ra.length, rb.length);
		for (let k = 0; k < m; k++) if (ra[k] !== rb[k]) return ra[k] - rb[k];
		return ra.length - rb.length;
	}
	let _correlateTypos = null;
	function attachRelated(errors) {
		if (_correlateTypos === null) _correlateTypos = require_correlate().correlateTypos;
		const pairs = _correlateTypos(errors);
		if (pairs === null) return errors;
		for (const [from, to] of pairs) {
			const e = errors[from];
			if (!e) continue;
			if (e.related) {
				if (!e.related.includes(to)) e.related.push(to);
			} else e.related = [to];
		}
		return errors;
	}
	module.exports = {
		LazyRejection,
		RichRejection,
		presentErrors,
		needsOrdering,
		LazyJsonRejection,
		_enrichLazy,
		attachRelated,
		sortErrorsBySchemaOrder,
		stripOrdinal,
		wantedPointersFor
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/strict-check.js
var require_strict_check = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { METASCHEMAS } = require_metaschemas();
	const { levenshtein } = require_levenshtein();
	const ATA_KEYWORDS = [
		"nullable",
		"errorMessage",
		"propertyDependencies",
		"discriminator"
	];
	let SPEC_KEYWORDS = null;
	function specKeywords() {
		if (SPEC_KEYWORDS === null) {
			SPEC_KEYWORDS = new Set(ATA_KEYWORDS);
			for (const doc of METASCHEMAS.values()) if (doc && doc.properties) for (const k of Object.keys(doc.properties)) SPEC_KEYWORDS.add(k);
		}
		return SPEC_KEYWORDS;
	}
	const KEYWORD_TYPES = new Map(Object.entries({
		minLength: ["string"],
		maxLength: ["string"],
		pattern: ["string"],
		minimum: ["number"],
		maximum: ["number"],
		exclusiveMinimum: ["number"],
		exclusiveMaximum: ["number"],
		multipleOf: ["number"],
		items: ["array"],
		prefixItems: ["array"],
		additionalItems: ["array"],
		minItems: ["array"],
		maxItems: ["array"],
		uniqueItems: ["array"],
		contains: ["array"],
		minContains: ["array"],
		maxContains: ["array"],
		unevaluatedItems: ["array"],
		properties: ["object"],
		patternProperties: ["object"],
		additionalProperties: ["object"],
		required: ["object"],
		minProperties: ["object"],
		maxProperties: ["object"],
		propertyNames: ["object"],
		dependentRequired: ["object"],
		dependentSchemas: ["object"],
		unevaluatedProperties: ["object"]
	}));
	function typeAllows(declared, wanted) {
		const list = Array.isArray(declared) ? declared : [declared];
		for (const t of list) {
			if (t === wanted) return true;
			if (wanted === "number" && t === "integer") return true;
		}
		return false;
	}
	const SCHEMA_MAPS = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"$defs",
		"definitions",
		"dependentSchemas"
	]);
	const SCHEMA_LISTS = /* @__PURE__ */ new Set([
		"allOf",
		"anyOf",
		"oneOf",
		"prefixItems"
	]);
	const SCHEMA_SINGLE = /* @__PURE__ */ new Set([
		"items",
		"additionalItems",
		"additionalProperties",
		"unevaluatedProperties",
		"unevaluatedItems",
		"contains",
		"propertyNames",
		"not",
		"if",
		"then",
		"else",
		"contentSchema"
	]);
	const DATA_VALUED = /* @__PURE__ */ new Set([
		"enum",
		"const",
		"default",
		"examples",
		"required",
		"type",
		"$vocabulary"
	]);
	function nearest(word, known) {
		let best = null;
		let bestD = Infinity;
		for (const k of known) {
			const d = levenshtein(word, k);
			if (d < bestD) {
				bestD = d;
				best = k;
			}
		}
		return bestD > 0 && bestD <= 2 && best !== null ? best : null;
	}
	function resolveLocalPointer(root, ref) {
		let node = root;
		for (const raw of ref.slice(2).split("/")) {
			const token = raw.replace(/~1/g, "/").replace(/~0/g, "~");
			if (node === null || typeof node !== "object") return false;
			if (Array.isArray(node)) {
				if (!/^\d+$/.test(token) || Number(token) >= node.length) return false;
				node = node[Number(token)];
			} else {
				if (!Object.prototype.hasOwnProperty.call(node, token)) return false;
				node = node[token];
			}
		}
		return node !== void 0;
	}
	/**
	* Walks a schema and reports the authoring mistakes the validator would
	* otherwise ignore. Returns an array of { path, message }, empty when clean.
	*
	* `userKeywords` are names registered through the `keywords` option, and
	* `x-` prefixed names pass without comment: they are the conventional
	* extension namespace and rejecting them would flag real documents.
	*/
	function checkSchemaStrict(root, options) {
		const known = specKeywords();
		const user = options && options.userKeywords ? options.userKeywords : null;
		const problems = [];
		const seen = /* @__PURE__ */ new Set();
		function isKnown(key) {
			if (known.has(key)) return true;
			if (user && (Array.isArray(user) ? user.includes(key) : Object.prototype.hasOwnProperty.call(user, key))) return true;
			if (key.startsWith("x-")) return true;
			return false;
		}
		function walkSchema(node, path) {
			if (node === null || typeof node !== "object" || Array.isArray(node)) return;
			if (seen.has(node)) return;
			seen.add(node);
			for (const key of Object.keys(node)) {
				const value = node[key];
				const at = path + "/" + key;
				if (!isKnown(key)) {
					const hint = nearest(key, known);
					problems.push({
						path: at,
						message: hint ? `unknown keyword "${key}" (did you mean "${hint}"?)` : `unknown keyword "${key}"`
					});
					continue;
				}
				if (key === "$ref" && typeof value === "string" && value.startsWith("#/") && !resolveLocalPointer(root, value)) {
					problems.push({
						path: at,
						message: `$ref "${value}" does not resolve in this document`
					});
					continue;
				}
				if (typeof node.type === "string" || Array.isArray(node.type)) {
					const acts = KEYWORD_TYPES.get(key);
					if (acts && !acts.some((t) => typeAllows(node.type, t))) {
						problems.push({
							path: at,
							message: `"${key}" has no effect here: it applies to ${acts.join("/")} and this node's type is ${JSON.stringify(node.type)}`
						});
						continue;
					}
				}
				if (key === "required" && Array.isArray(value) && node.properties && typeof node.properties === "object" && node.additionalProperties === false && !node.patternProperties) {
					for (const name of value) if (typeof name === "string" && !Object.prototype.hasOwnProperty.call(node.properties, name)) problems.push({
						path: at,
						message: `required property "${name}" is not defined in properties and additionalProperties is false, so nothing can satisfy this schema`
					});
				}
				if (DATA_VALUED.has(key)) continue;
				if (SCHEMA_MAPS.has(key)) {
					if (value !== null && typeof value === "object" && !Array.isArray(value)) for (const name of Object.keys(value)) walkSchema(value[name], at + "/" + name.replace(/~/g, "~0").replace(/\//g, "~1"));
				} else if (SCHEMA_LISTS.has(key)) {
					if (Array.isArray(value)) for (let i = 0; i < value.length; i++) walkSchema(value[i], at + "/" + i);
				} else if (SCHEMA_SINGLE.has(key)) {
					if (Array.isArray(value)) for (let i = 0; i < value.length; i++) walkSchema(value[i], at + "/" + i);
					else walkSchema(value, at);
				} else if (key === "dependencies") {
					if (value !== null && typeof value === "object" && !Array.isArray(value)) {
						for (const name of Object.keys(value)) if (!Array.isArray(value[name])) walkSchema(value[name], at + "/" + name);
					}
				}
			}
		}
		walkSchema(root, "#");
		return problems;
	}
	module.exports = { checkSchemaStrict };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/source-positions.js
var require_source_positions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Build a map of JSON pointer → { line, col, text } by scanning JSON text.
	*
	* Approach: use JSON.parse for correctness, then do one structural scan
	* tracking bracket depth and key positions. This avoids hand-rolling a
	* full JSON parser while delivering keyword-level positions sufficient
	* for source frames.
	*
	* Limitations (acceptable for source frames):
	*  - Duplicate keys: last wins.
	*  - Whitespace inside string values does not affect tracking (strings
	*    are skipped over wholesale).
	*  - Comments / trailing commas: JSON only, no JSON5.
	*/
	function escapePtr(s) {
		return s.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	function buildPositionMap(text) {
		const map = Object.create(null);
		const lines = text.split("\n");
		const lineStart = new Array(lines.length + 1);
		lineStart[0] = 0;
		for (let i = 0; i < lines.length; i++) lineStart[i + 1] = lineStart[i] + lines[i].length + 1;
		function offsetToLineCol(off) {
			let lo = 0, hi = lineStart.length - 1;
			while (lo < hi) {
				const mid = lo + hi + 1 >> 1;
				if (lineStart[mid] <= off) lo = mid;
				else hi = mid - 1;
			}
			return {
				line: lo + 1,
				col: off - lineStart[lo] + 1,
				text: lines[lo] || ""
			};
		}
		let i = 0;
		const n = text.length;
		function skipWs() {
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 32 || ch === 9 || ch === 10 || ch === 13) i++;
				else break;
			}
		}
		function readString() {
			const start = i;
			i++;
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 92) {
					i += 2;
					continue;
				}
				if (ch === 34) {
					i++;
					return JSON.parse(text.slice(start, i));
				}
				i++;
			}
			throw new Error("unterminated string at offset " + start);
		}
		function skipValue() {
			skipWs();
			if (i >= n) return;
			const ch = text.charCodeAt(i);
			if (ch === 34) {
				readString();
				return;
			}
			if (ch === 123 || ch === 91) {
				const open = ch;
				const close = open === 123 ? 125 : 93;
				let depth = 1;
				i++;
				while (i < n && depth > 0) {
					const c = text.charCodeAt(i);
					if (c === 34) {
						readString();
						continue;
					}
					if (c === open) depth++;
					else if (c === close) depth--;
					i++;
				}
				return;
			}
			while (i < n) {
				const c = text.charCodeAt(i);
				if (c === 44 || c === 125 || c === 93 || c === 32 || c === 9 || c === 10 || c === 13) return;
				i++;
			}
		}
		function pointerOf(path) {
			if (path.length === 0) return "";
			return "/" + path.map(escapePtr).join("/");
		}
		function walk(path) {
			skipWs();
			if (i >= n) return;
			const pos = offsetToLineCol(i);
			map[pointerOf(path)] = pos;
			const ch = text.charCodeAt(i);
			if (ch === 123) {
				i++;
				while (true) {
					skipWs();
					if (text.charCodeAt(i) === 125) {
						i++;
						return;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					skipWs();
					const keyStart = i;
					const key = readString();
					const keyPos = offsetToLineCol(keyStart);
					skipWs();
					if (text.charCodeAt(i) !== 58) throw new Error("expected \":\" at offset " + i);
					i++;
					const childPath = path.concat([key]);
					map[pointerOf(childPath) + "#key"] = keyPos;
					walk(childPath);
				}
			} else if (ch === 91) {
				i++;
				let idx = 0;
				while (true) {
					skipWs();
					if (text.charCodeAt(i) === 93) {
						i++;
						return;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					walk(path.concat([String(idx)]));
					idx++;
				}
			} else skipValue();
		}
		if (text.charCodeAt(0) === 65279) i = 1;
		walk([]);
		return map;
	}
	module.exports = {
		buildPositionMap,
		escapePtr
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/data-positions.js
var require_data_positions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Build pointer → { byteOffset, length, line, col, text } from a JSON
	* input buffer. Called only when validation fails AND richErrors is on
	* AND abortEarly is off. Zero cost on the valid path.
	*/
	function buildDataPositionMap(input) {
		const text = typeof Buffer !== "undefined" && Buffer.isBuffer(input) ? input.toString("utf8") : String(input);
		const map = Object.create(null);
		const n = text.length;
		const ptrs = [];
		const starts = [];
		const lens = [];
		const keyStarts = [];
		const keyLens = [];
		let i = 0;
		function skipWs() {
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 32 || ch === 9 || ch === 10 || ch === 13) i++;
				else break;
			}
		}
		function readString(decode) {
			const start = i;
			let simple = text.charCodeAt(i) === 34;
			i++;
			let closed = false;
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 92) {
					simple = false;
					i += 2;
					continue;
				}
				if (ch === 34) {
					i++;
					closed = true;
					break;
				}
				if (ch < 32) simple = false;
				i++;
			}
			if (!closed) throw new Error("unterminated string at offset " + start);
			if (simple) return decode ? text.slice(start + 1, i - 1) : null;
			const decoded = JSON.parse(text.slice(start, i));
			return decode ? decoded : null;
		}
		function walk(ptr, keyStart, keyLen) {
			skipWs();
			if (i >= n) return;
			const start = i;
			const ch = text.charCodeAt(i);
			if (ch === 123) {
				i++;
				while (true) {
					skipWs();
					if (i >= n) break;
					if (text.charCodeAt(i) === 125) {
						i++;
						break;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					skipWs();
					const memberKeyStart = i;
					const key = readString(true);
					const memberKeyLen = i - memberKeyStart;
					skipWs();
					if (text.charCodeAt(i) !== 58) throw new Error("expected \":\" at offset " + i);
					i++;
					const seg = key.indexOf("~") === -1 && key.indexOf("/") === -1 ? key : key.replace(/~/g, "~0").replace(/\//g, "~1");
					walk(ptr + "/" + seg, memberKeyStart, memberKeyLen);
				}
			} else if (ch === 91) {
				i++;
				let idx = 0;
				while (true) {
					skipWs();
					if (i >= n) break;
					if (text.charCodeAt(i) === 93) {
						i++;
						break;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					const before = i;
					walk(ptr + "/" + idx, -1, 0);
					if (i === before) break;
					idx++;
				}
			} else if (ch === 34) readString(false);
			else while (i < n) {
				const c = text.charCodeAt(i);
				if (c === 44 || c === 125 || c === 93 || c === 32 || c === 9 || c === 10 || c === 13) break;
				i++;
			}
			ptrs.push(ptr);
			starts.push(start);
			lens.push(i - start);
			keyStarts.push(keyStart);
			keyLens.push(keyLen);
		}
		if (text.charCodeAt(0) === 65279) i = 1;
		walk("", -1, 0);
		if (ptrs.length === 0) return map;
		const lines = text.split("\n");
		const lineStart = new Array(lines.length + 1);
		lineStart[0] = 0;
		for (let k = 0; k < lines.length; k++) lineStart[k + 1] = lineStart[k] + lines[k].length + 1;
		function lineOf(off) {
			let lo = 0, hi = lineStart.length - 1;
			while (lo < hi) {
				const mid = lo + hi + 1 >> 1;
				if (lineStart[mid] <= off) lo = mid;
				else hi = mid - 1;
			}
			return lo;
		}
		for (let k = 0; k < ptrs.length; k++) {
			const off = starts[k];
			const line = lineOf(off);
			const entry = {
				byteOffset: off,
				length: lens[k],
				line: line + 1,
				col: off - lineStart[line] + 1,
				text: lines[line] || ""
			};
			if (keyStarts[k] >= 0) {
				const keyLine = lineOf(keyStarts[k]);
				entry.keyOffset = keyStarts[k];
				entry.keyLength = keyLens[k];
				entry.keyLine = keyLine + 1;
				entry.keyCol = keyStarts[k] - lineStart[keyLine] + 1;
			}
			map[ptrs[k]] = entry;
		}
		return map;
	}
	/**
	* The same map, for a known set of pointers.
	*
	* A rejection names two or three pointers and nothing reads any other entry, so
	* recording one per node in the document is nearly all waste: on a 149 KB config
	* the full map was 1330 microseconds of a 2457 microsecond error read. Here a
	* subtree that cannot contain a wanted pointer is scanned to its end and never
	* walked, and the walk stops once every wanted pointer has been recorded.
	* Measured against the full map: 11.5x on pointers near the start of the
	* document, and 3.7x in the worst case for the technique, a single pointer at
	* the very end.
	*
	* Deliberately a second function rather than an option on the first. That one is
	* embedded verbatim into standalone modules via Function.prototype.toString, and
	* adding per-node checks to it cost 8% on the full-map path for callers that want
	* every entry. The price is two walks of the same grammar, which
	* `tests/test_targeted_positions.js` holds to identical output.
	*
	* Entries are identical to the full map's for every pointer in `wanted`. A
	* pointer absent from the document is absent here too, exactly as it would be.
	*/
	function buildTargetedPositionMap(input, wanted) {
		const text = typeof Buffer !== "undefined" && Buffer.isBuffer(input) ? input.toString("utf8") : String(input);
		const map = Object.create(null);
		const n = text.length;
		const interest = /* @__PURE__ */ new Set([""]);
		for (const w of wanted) {
			let at = 0;
			for (;;) {
				const next = w.indexOf("/", at + 1);
				if (next === -1) break;
				interest.add(w.slice(0, next));
				at = next;
			}
			interest.add(w);
		}
		let remaining = wanted.size;
		const ptrs = [];
		const starts = [];
		const lens = [];
		const keyStarts = [];
		const keyLens = [];
		let i = 0;
		function skipWs() {
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 32 || ch === 9 || ch === 10 || ch === 13) i++;
				else break;
			}
		}
		function readString(decode) {
			const start = i;
			let simple = text.charCodeAt(i) === 34;
			i++;
			let closed = false;
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 92) {
					simple = false;
					i += 2;
					continue;
				}
				if (ch === 34) {
					i++;
					closed = true;
					break;
				}
				if (ch < 32) simple = false;
				i++;
			}
			if (!closed) throw new Error("unterminated string at offset " + start);
			if (simple) return decode ? text.slice(start + 1, i - 1) : null;
			const decoded = JSON.parse(text.slice(start, i));
			return decode ? decoded : null;
		}
		function skipValue() {
			skipWs();
			if (i >= n) return;
			const ch = text.charCodeAt(i);
			if (ch === 34) {
				readString(false);
				return;
			}
			if (ch === 123 || ch === 91) {
				let depth = 0;
				while (i < n) {
					const c = text.charCodeAt(i);
					if (c === 34) {
						readString(false);
						continue;
					}
					if (c === 123 || c === 91) {
						depth++;
						i++;
						continue;
					}
					if (c === 125 || c === 93) {
						depth--;
						i++;
						if (depth <= 0) return;
						continue;
					}
					i++;
				}
				return;
			}
			while (i < n) {
				const c = text.charCodeAt(i);
				if (c === 44 || c === 125 || c === 93 || c === 32 || c === 9 || c === 10 || c === 13) break;
				i++;
			}
		}
		function walk(ptr, keyStart, keyLen) {
			skipWs();
			if (i >= n) return;
			const start = i;
			const isWanted = wanted.has(ptr);
			if (!interest.has(ptr)) {
				skipValue();
				if (isWanted) {
					ptrs.push(ptr);
					starts.push(start);
					lens.push(i - start);
					keyStarts.push(keyStart);
					keyLens.push(keyLen);
					remaining--;
				}
				return;
			}
			const ch = text.charCodeAt(i);
			if (ch === 123) {
				i++;
				for (;;) {
					skipWs();
					if (i >= n) break;
					if (text.charCodeAt(i) === 125) {
						i++;
						break;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					skipWs();
					const memberKeyStart = i;
					const key = readString(true);
					const memberKeyLen = i - memberKeyStart;
					skipWs();
					if (text.charCodeAt(i) !== 58) throw new Error("expected \":\" at offset " + i);
					i++;
					const seg = key.indexOf("~") === -1 && key.indexOf("/") === -1 ? key : key.replace(/~/g, "~0").replace(/\//g, "~1");
					walk(ptr + "/" + seg, memberKeyStart, memberKeyLen);
					if (remaining === 0) return;
				}
			} else if (ch === 91) {
				i++;
				let idx = 0;
				for (;;) {
					skipWs();
					if (i >= n) break;
					if (text.charCodeAt(i) === 93) {
						i++;
						break;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					const before = i;
					walk(ptr + "/" + idx, -1, 0);
					if (remaining === 0) return;
					if (i === before) break;
					idx++;
				}
			} else if (ch === 34) readString(false);
			else while (i < n) {
				const c = text.charCodeAt(i);
				if (c === 44 || c === 125 || c === 93 || c === 32 || c === 9 || c === 10 || c === 13) break;
				i++;
			}
			if (isWanted) {
				ptrs.push(ptr);
				starts.push(start);
				lens.push(i - start);
				keyStarts.push(keyStart);
				keyLens.push(keyLen);
				remaining--;
			}
		}
		if (text.charCodeAt(0) === 65279) i = 1;
		walk("", -1, 0);
		if (ptrs.length === 0) return map;
		const lines = text.split("\n");
		const lineStart = new Array(lines.length + 1);
		lineStart[0] = 0;
		for (let k = 0; k < lines.length; k++) lineStart[k + 1] = lineStart[k] + lines[k].length + 1;
		function lineOf(off) {
			let lo = 0, hi = lineStart.length - 1;
			while (lo < hi) {
				const mid = lo + hi + 1 >> 1;
				if (lineStart[mid] <= off) lo = mid;
				else hi = mid - 1;
			}
			return lo;
		}
		for (let k = 0; k < ptrs.length; k++) {
			const off = starts[k];
			const line = lineOf(off);
			const entry = {
				byteOffset: off,
				length: lens[k],
				line: line + 1,
				col: off - lineStart[line] + 1,
				text: lines[line] || ""
			};
			if (keyStarts[k] >= 0) {
				const keyLine = lineOf(keyStarts[k]);
				entry.keyOffset = keyStarts[k];
				entry.keyLength = keyLens[k];
				entry.keyLine = keyLine + 1;
				entry.keyCol = keyStarts[k] - lineStart[keyLine] + 1;
			}
			map[ptrs[k]] = entry;
		}
		return map;
	}
	module.exports = {
		buildDataPositionMap,
		buildTargetedPositionMap
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/data-position-cache.js
var require_data_position_cache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { buildDataPositionMap, buildTargetedPositionMap } = require_data_positions();
	/**
	* Memoize the position map for the duration of a single validate() call.
	* Caller passes the original buffer/string. Identity-keyed: same reference
	* == same map. No global state, caller holds the cache instance.
	*/
	function createCache(nativeTargeted) {
		const _nativeTargeted = typeof nativeTargeted === "function" ? nativeTargeted : null;
		const wm = /* @__PURE__ */ new WeakMap();
		const sm = /* @__PURE__ */ new Map();
		const cache = {
			/**
			* The entries for a known set of pointers, which is what a rejection needs:
			* recording one per node in the document was the dominant cost of reading an
			* error's frame.
			*
			* The caller derives `wanted` from the errors, and a derivation that misses a
			* pointer must not cost a frame, so the result answers any pointer outside
			* the set by building the full map once and reading from that. A wrong
			* derivation is then slow rather than silently short of frames, which is the
			* only acceptable direction for this trade: a missing caret is the failure
			* nobody reports.
			*/
			targeted(input, wanted) {
				if (input == null) return null;
				if (!wanted || wanted.size === 0) return null;
				const already = typeof input === "string" ? sm.get(input) : Buffer.isBuffer(input) ? wm.get(input) : void 0;
				if (already) return already;
				let filtered = _nativeTargeted === null ? null : _nativeTargeted(input, wanted);
				if (filtered === null) try {
					filtered = buildTargetedPositionMap(input, wanted);
				} catch {
					return null;
				}
				let full;
				const fallback = (key) => {
					if (wanted.has(key)) return void 0;
					if (full === void 0) full = cache.get(input) || null;
					return full ? full[key] : void 0;
				};
				return new Proxy(filtered, {
					get(target, key) {
						if (typeof key !== "string") return target[key];
						if (key in target) return target[key];
						return fallback(key);
					},
					has(target, key) {
						if (typeof key !== "string") return key in target;
						return key in target || fallback(key) !== void 0;
					}
				});
			},
			get(input) {
				if (input == null) return null;
				if (typeof input === "string") {
					if (sm.has(input)) return sm.get(input);
					try {
						const m = buildDataPositionMap(input);
						sm.set(input, m);
						return m;
					} catch {
						return null;
					}
				}
				if (Buffer.isBuffer(input)) {
					if (wm.has(input)) return wm.get(input);
					try {
						const m = buildDataPositionMap(input);
						wm.set(input, m);
						return m;
					} catch {
						return null;
					}
				}
				return null;
			},
			reset() {
				sm.clear();
			}
		};
		return cache;
	}
	module.exports = { createCache };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/branch-collapse.js
var require_branch_collapse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const __ATA_SEVERITY = {
		type: 10,
		const: 8,
		enum: 8,
		required: 5,
		format: 3,
		minLength: 3,
		maxLength: 3,
		minimum: 3,
		maximum: 3,
		pattern: 3,
		additionalProperties: 2,
		unevaluatedProperties: 2,
		unevaluatedItems: 2
	};
	function __ataScore(errs) {
		if (!errs || !errs.length) return 0;
		let s = 0;
		for (const e of errs) s += __ATA_SEVERITY[e.keyword] || 4;
		return errs.length * 100 + s;
	}
	function __ataMulti(passIdx, total, pp, sp, o) {
		const multi = {
			code: "ATA4002",
			keyword: "oneOf",
			instancePath: pp || "",
			path: pp || "",
			schemaPath: sp,
			message: "value matched " + passIdx.length + " of " + total + " oneOf variants, expected exactly one",
			params: { passingSchemas: passIdx }
		};
		if (o !== null) Object.defineProperty(multi, "_o", { value: o });
		return multi;
	}
	function __ataCollapse(kw, br, pp, sp, o, titles) {
		let passN = 0;
		for (let i = 0; i < br.length; i++) if (br[i].valid) passN++;
		const pass = { length: passN };
		if (kw === "oneOf") {
			if (pass.length === 1) return null;
			if (pass.length > 1) {
				const passIdx = [];
				for (let i = 0; i < br.length; i++) if (br[i].valid) passIdx.push(i);
				return __ataMulti(passIdx, br.length, pp, sp, o);
			}
		} else if (pass.length >= 1) return null;
		let bi = 0;
		let bs = Infinity;
		for (let i = 0; i < br.length; i++) {
			const s = __ataScore(br[i].errors);
			if (s < bs) {
				bs = s;
				bi = i;
			}
		}
		const best = br[bi];
		const none = {
			code: kw === "oneOf" ? "ATA4001" : "ATA4003",
			keyword: kw,
			instancePath: pp || "",
			path: pp || "",
			schemaPath: sp,
			message: "value matched 0 of " + br.length + " " + kw + " variants",
			params: {
				variants: br.length,
				closest: bi,
				closestName: (titles !== void 0 ? titles[bi] : best.title) || "variant " + (bi + 1)
			},
			branchErrors: best.errors
		};
		if (o !== null) Object.defineProperty(none, "_o", { value: o });
		return none;
	}
	function collapseBranches({ keyword, branchResults, parentPath, parentSchemaPath, ordinal }) {
		return __ataCollapse(keyword, branchResults, parentPath, parentSchemaPath, ordinal === void 0 ? null : ordinal);
	}
	function embedSource() {
		return "const __ATA_SEVERITY=" + JSON.stringify(__ATA_SEVERITY) + ";const __ataScore=" + __ataScore.toString() + ";const __ataMulti=" + __ataMulti.toString() + ";const __ataCollapse=" + __ataCollapse.toString() + ";";
	}
	module.exports = {
		collapseBranches,
		scoreBranch: __ataScore,
		SEVERITY: __ATA_SEVERITY,
		embedSource
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/safe-regex.js
var require_safe_regex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function __ataSafeRegex() {
		const WS = [
			[9, 13],
			[32, 32],
			[160, 160],
			[5760, 5760],
			[8192, 8202],
			[8232, 8233],
			[8239, 8239],
			[8287, 8287],
			[12288, 12288],
			[65279, 65279]
		];
		const isLineTerminator = (c) => c === 10 || c === 13 || c === 8232 || c === 8233;
		const DIGIT = [[48, 57]];
		const WORD = [
			[48, 57],
			[65, 90],
			[97, 122],
			[95, 95]
		];
		function parse(src) {
			let i = 0;
			const len = src.length;
			const peek = () => src[i];
			const eof = () => i >= len;
			function parseAlt() {
				const opts = [parseConcat()];
				while (!eof() && peek() === "|") {
					i++;
					opts.push(parseConcat());
				}
				return opts.length === 1 ? opts[0] : {
					t: "alt",
					opts
				};
			}
			function parseConcat() {
				const parts = [];
				while (!eof() && peek() !== "|" && peek() !== ")") parts.push(parseRepeat());
				if (parts.length === 0) return { t: "empty" };
				return parts.length === 1 ? parts[0] : {
					t: "concat",
					parts
				};
			}
			function parseRepeat() {
				let node = parseAtom();
				while (!eof()) {
					const ch = peek();
					if (ch === "*") {
						i++;
						node = {
							t: "star",
							child: node
						};
					} else if (ch === "+") {
						i++;
						node = {
							t: "plus",
							child: node
						};
					} else if (ch === "?") {
						i++;
						node = {
							t: "quest",
							child: node
						};
					} else if (ch === "{") {
						const saved = i;
						const q = tryQuantifier();
						if (!q) {
							i = saved;
							break;
						}
						node = {
							t: "repeat",
							child: node,
							min: q.min,
							max: q.max
						};
					} else break;
					if (!eof() && peek() === "?") i++;
				}
				return node;
			}
			function tryQuantifier() {
				i++;
				let min = "";
				while (!eof() && /[0-9]/.test(peek())) {
					min += peek();
					i++;
				}
				if (min === "") return null;
				let max;
				if (peek() === "}") {
					i++;
					return {
						min: +min,
						max: +min
					};
				}
				if (peek() === ",") {
					i++;
					let m = "";
					while (!eof() && /[0-9]/.test(peek())) {
						m += peek();
						i++;
					}
					if (peek() !== "}") return null;
					i++;
					max = m === "" ? Infinity : +m;
					return {
						min: +min,
						max
					};
				}
				return null;
			}
			function parseAtom() {
				const ch = peek();
				if (ch === "(") {
					i++;
					if (src[i] === "?") {
						if (src[i + 1] === ":") i += 2;
						else throw new Error("unsupported group (lookaround/named) in pattern");
					}
					const child = parseAlt();
					if (peek() !== ")") throw new Error("unbalanced ( in pattern");
					i++;
					return {
						t: "group",
						child
					};
				}
				if (ch === "[") return parseClass();
				if (ch === ".") {
					i++;
					return { t: "any" };
				}
				if (ch === "^") {
					i++;
					return { t: "bol" };
				}
				if (ch === "$") {
					i++;
					return { t: "eol" };
				}
				if (ch === "\\") return parseEscape(false);
				if (ch === ")" || ch === "|") return { t: "empty" };
				i++;
				return {
					t: "char",
					c: ch.charCodeAt(0)
				};
			}
			function parseClass() {
				i++;
				let neg = false;
				if (peek() === "^") {
					neg = true;
					i++;
				}
				const ranges = [];
				while (!eof() && peek() !== "]") {
					let lo;
					if (peek() === "\\") {
						const esc = parseEscape(true);
						if (esc.t === "classpart") {
							for (const r of esc.ranges) ranges.push(r);
							continue;
						}
						lo = esc.c;
					} else {
						lo = peek().charCodeAt(0);
						i++;
					}
					if (peek() === "-" && src[i + 1] !== "]" && i + 1 < len) {
						i++;
						let hi;
						if (peek() === "\\") hi = parseEscape(true).c;
						else {
							hi = peek().charCodeAt(0);
							i++;
						}
						ranges.push([lo, hi]);
					} else ranges.push([lo, lo]);
				}
				if (peek() !== "]") throw new Error("unbalanced [ in pattern");
				i++;
				return {
					t: "class",
					neg,
					ranges
				};
			}
			function parseEscape(inClass) {
				i++;
				if (eof()) throw new Error("trailing backslash in pattern");
				const ch = peek();
				i++;
				switch (ch) {
					case "d": return inClass ? {
						t: "classpart",
						ranges: DIGIT
					} : {
						t: "class",
						neg: false,
						ranges: DIGIT
					};
					case "w": return inClass ? {
						t: "classpart",
						ranges: WORD
					} : {
						t: "class",
						neg: false,
						ranges: WORD
					};
					case "s": return inClass ? {
						t: "classpart",
						ranges: WS
					} : {
						t: "class",
						neg: false,
						ranges: WS
					};
					case "D":
						if (inClass) throw new Error("\\D inside a class is not supported");
						return {
							t: "class",
							neg: true,
							ranges: DIGIT
						};
					case "W":
						if (inClass) throw new Error("\\W inside a class is not supported");
						return {
							t: "class",
							neg: true,
							ranges: WORD
						};
					case "S":
						if (inClass) throw new Error("\\S inside a class is not supported");
						return {
							t: "class",
							neg: true,
							ranges: WS
						};
					case "n": return {
						t: "char",
						c: 10
					};
					case "r": return {
						t: "char",
						c: 13
					};
					case "t": return {
						t: "char",
						c: 9
					};
					case "f": return {
						t: "char",
						c: 12
					};
					case "v": return {
						t: "char",
						c: 11
					};
					case "0": return {
						t: "char",
						c: 0
					};
					case "x": {
						const h = src.slice(i, i + 2);
						i += 2;
						return {
							t: "char",
							c: parseInt(h, 16)
						};
					}
					case "u": {
						const h = src.slice(i, i + 4);
						i += 4;
						return {
							t: "char",
							c: parseInt(h, 16)
						};
					}
					case "b":
						if (inClass) return {
							t: "char",
							c: 8
						};
						throw new Error("\\b word boundary is not supported");
					default:
						if (/[1-9]/.test(ch)) throw new Error("backreferences are not supported in pattern");
						return {
							t: "char",
							c: ch.charCodeAt(0)
						};
				}
			}
			const ast = parseAlt();
			if (!eof()) throw new Error("unexpected \"" + peek() + "\" in pattern");
			return ast;
		}
		function compileProg(ast) {
			const prog = [];
			const emit = (op, extra) => {
				const idx = prog.length;
				prog.push(Object.assign({ op }, extra));
				return idx;
			};
			function rec(n) {
				switch (n.t) {
					case "empty": break;
					case "char":
						emit("char", { c: n.c });
						break;
					case "any":
						emit("any");
						break;
					case "class":
						emit("class", {
							neg: n.neg,
							ranges: n.ranges
						});
						break;
					case "bol":
						emit("bol");
						break;
					case "eol":
						emit("eol");
						break;
					case "group":
						rec(n.child);
						break;
					case "concat":
						for (const p of n.parts) rec(p);
						break;
					case "alt": {
						const jmps = [];
						for (let k = 0; k < n.opts.length; k++) if (k < n.opts.length - 1) {
							const sp = emit("split", {
								x: 0,
								y: 0
							});
							prog[sp].x = prog.length;
							rec(n.opts[k]);
							jmps.push(emit("jmp", { x: 0 }));
							prog[sp].y = prog.length;
						} else rec(n.opts[k]);
						for (const j of jmps) prog[j].x = prog.length;
						break;
					}
					case "star": {
						const sp = emit("split", {
							x: 0,
							y: 0
						});
						prog[sp].x = prog.length;
						rec(n.child);
						emit("jmp", { x: sp });
						prog[sp].y = prog.length;
						break;
					}
					case "plus": {
						const start = prog.length;
						rec(n.child);
						const sp = emit("split", {
							x: start,
							y: 0
						});
						prog[sp].y = prog.length;
						break;
					}
					case "quest": {
						const sp = emit("split", {
							x: 0,
							y: 0
						});
						prog[sp].x = prog.length;
						rec(n.child);
						prog[sp].y = prog.length;
						break;
					}
					case "repeat":
						for (let k = 0; k < n.min; k++) rec(n.child);
						if (n.max === Infinity) {
							if (n.min === 0) rec({
								t: "star",
								child: n.child
							});
							else rec({
								t: "star",
								child: n.child
							});
						} else for (let k = 0; k < n.max - n.min; k++) rec({
							t: "quest",
							child: n.child
						});
				}
			}
			rec(ast);
			emit("match");
			return prog;
		}
		const OP_CHAR = 0;
		const OP_ANY = 1;
		const OP_CLASS = 2;
		const OP_SPLIT = 3;
		const OP_JMP = 4;
		const OP_BOL = 5;
		const OP_EOL = 6;
		const OP_MATCH = 7;
		function classMatcher(instr) {
			const bits = /* @__PURE__ */ new Uint8Array(128);
			const r = instr.ranges;
			for (let k = 0; k < r.length; k++) {
				const hi = Math.min(r[k][1], 127);
				for (let c = r[k][0]; c <= hi; c++) bits[c] = 1;
			}
			return {
				bits,
				ranges: r,
				neg: instr.neg
			};
		}
		function matchClass(cls, c) {
			let inside;
			if (c < 128) inside = cls.bits[c] === 1;
			else {
				inside = false;
				const r = cls.ranges;
				for (let k = 0; k < r.length; k++) if (c >= r[k][0] && c <= r[k][1]) {
					inside = true;
					break;
				}
			}
			return cls.neg ? !inside : inside;
		}
		function makeRunner(prog) {
			const n = prog.length;
			const ops = new Uint8Array(n);
			const xs = new Int32Array(n);
			const ys = new Int32Array(n);
			const cs = new Int32Array(n);
			const classes = new Array(n);
			for (let i = 0; i < n; i++) {
				const I = prog[i];
				switch (I.op) {
					case "char":
						ops[i] = OP_CHAR;
						cs[i] = I.c;
						break;
					case "any":
						ops[i] = OP_ANY;
						break;
					case "class":
						ops[i] = OP_CLASS;
						classes[i] = classMatcher(I);
						break;
					case "split":
						ops[i] = OP_SPLIT;
						xs[i] = I.x;
						ys[i] = I.y;
						break;
					case "jmp":
						ops[i] = OP_JMP;
						xs[i] = I.x;
						break;
					case "bol":
						ops[i] = OP_BOL;
						break;
					case "eol":
						ops[i] = OP_EOL;
						break;
					case "match": ops[i] = OP_MATCH;
				}
			}
			const lastGen = new Int32Array(n).fill(-1);
			let gen = 0;
			const stack = new Int32Array(2 * n + 2);
			let clist = new Int32Array(n);
			let nlist = new Int32Array(n);
			let clen = 0;
			let nlen = 0;
			function addThread(list, len0, pc, pos, len) {
				if (ops[pc] <= OP_CLASS || ops[pc] === OP_MATCH) {
					if (lastGen[pc] === gen) return len0;
					lastGen[pc] = gen;
					list[len0] = pc;
					return len0 + 1;
				}
				let sp = 0;
				stack[sp++] = pc;
				let count = len0;
				while (sp > 0) {
					const p = stack[--sp];
					if (lastGen[p] === gen) continue;
					lastGen[p] = gen;
					switch (ops[p]) {
						case OP_JMP:
							stack[sp++] = xs[p];
							break;
						case OP_SPLIT:
							stack[sp++] = ys[p];
							stack[sp++] = xs[p];
							break;
						case OP_BOL:
							if (pos === 0) stack[sp++] = p + 1;
							break;
						case OP_EOL:
							if (pos === len) stack[sp++] = p + 1;
							break;
						default: list[count++] = p;
					}
				}
				return count;
			}
			gen++;
			const anchored = addThread(nlist, 0, 0, 1, 1) === 0;
			function testNFA(s) {
				const len = s.length;
				gen++;
				clen = addThread(clist, 0, 0, 0, len);
				for (let pos = 0; pos <= len; pos++) {
					const c = pos < len ? s.charCodeAt(pos) : -1;
					gen++;
					nlen = 0;
					for (let k = 0; k < clen; k++) {
						const pc = clist[k];
						switch (ops[pc]) {
							case OP_MATCH: return true;
							case OP_CHAR:
								if (c === cs[pc]) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len);
								break;
							case OP_ANY:
								if (c !== -1 && !isLineTerminator(c)) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len);
								break;
							case OP_CLASS: if (c !== -1 && matchClass(classes[pc], c)) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len);
						}
					}
					if (pos < len) {
						if (!anchored) nlen = addThread(nlist, nlen, 0, pos + 1, len);
						else if (nlen === 0) return false;
					}
					const tmp = clist;
					clist = nlist;
					nlist = tmp;
					clen = nlen;
				}
				return false;
			}
			const MAX_STATES = 256;
			const states = [];
			const stateIds = /* @__PURE__ */ new Map();
			let overflow = false;
			function closure(list, count, pc, atStart, atEnd) {
				let sp = 0;
				stack[sp++] = pc;
				while (sp > 0) {
					const p = stack[--sp];
					if (lastGen[p] === gen) continue;
					lastGen[p] = gen;
					switch (ops[p]) {
						case OP_JMP:
							stack[sp++] = xs[p];
							break;
						case OP_SPLIT:
							stack[sp++] = ys[p];
							stack[sp++] = xs[p];
							break;
						case OP_BOL:
							if (atStart) stack[sp++] = p + 1;
							break;
						case OP_EOL:
							if (atEnd) stack[sp++] = p + 1;
							break;
						default: list[count++] = p;
					}
				}
				return count;
			}
			function internState(list, count) {
				const pcs = Array.from(list.subarray(0, count)).sort((a, b) => a - b);
				const key = pcs.join(",");
				let id = stateIds.get(key);
				if (id !== void 0) return id;
				if (states.length >= MAX_STATES) {
					overflow = true;
					return -1;
				}
				id = states.length;
				let isMatch = false;
				for (let k = 0; k < pcs.length; k++) if (ops[pcs[k]] === OP_MATCH) {
					isMatch = true;
					break;
				}
				states.push({
					pcs: Int32Array.from(pcs),
					isMatch,
					next: (/* @__PURE__ */ new Int32Array(128)).fill(-2),
					nextEnd: (/* @__PURE__ */ new Int32Array(128)).fill(-2)
				});
				stateIds.set(key, id);
				return id;
			}
			function step(state, c, atEnd) {
				gen++;
				let count = 0;
				const pcs = state.pcs;
				for (let k = 0; k < pcs.length; k++) {
					const pc = pcs[k];
					switch (ops[pc]) {
						case OP_CHAR:
							if (c === cs[pc]) count = closure(nlist, count, pc + 1, false, atEnd);
							break;
						case OP_ANY:
							if (!isLineTerminator(c)) count = closure(nlist, count, pc + 1, false, atEnd);
							break;
						case OP_CLASS: if (matchClass(classes[pc], c)) count = closure(nlist, count, pc + 1, false, atEnd);
					}
				}
				if (!anchored) count = closure(nlist, count, 0, false, atEnd);
				return internState(nlist, count);
			}
			let startEmpty = -2;
			let startNonEmpty = -2;
			function startState(atEnd) {
				gen++;
				const count = closure(nlist, 0, 0, true, atEnd);
				return internState(nlist, count);
			}
			function testDFA(s) {
				const len = s.length;
				let id;
				if (len === 0) {
					if (startEmpty === -2) startEmpty = startState(true);
					id = startEmpty;
				} else {
					if (startNonEmpty === -2) startNonEmpty = startState(false);
					id = startNonEmpty;
				}
				if (id < 0) return testNFA(s);
				let state = states[id];
				for (let pos = 0; pos < len; pos++) {
					if (state.isMatch) return true;
					const c = s.charCodeAt(pos);
					const atEnd = pos + 1 === len;
					let nid;
					if (c < 128) {
						const table = atEnd ? state.nextEnd : state.next;
						nid = table[c];
						if (nid === -2) {
							nid = step(state, c, atEnd);
							table[c] = nid;
						}
					} else nid = step(state, c, atEnd);
					if (nid < 0) return testNFA(s);
					state = states[nid];
					if (anchored && state.pcs.length === 0) return false;
				}
				return state.isMatch;
			}
			return function test(s) {
				return overflow ? testNFA(s) : testDFA(s);
			};
		}
		function compileSafe(pattern) {
			return {
				test: makeRunner(compileProg(parse(pattern))),
				source: pattern,
				__ataSafe: true
			};
		}
		function patternIsSafe(src) {
			try {
				compileSafe(src);
				return true;
			} catch {
				return false;
			}
		}
		return {
			compileSafe,
			patternIsSafe,
			parse
		};
	}
	module.exports = __ataSafeRegex();
	module.exports.engineSource = () => __ataSafeRegex.toString();
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/unique-items.js
var require_unique_items = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _deq(a, b) {
		if (a === b) return true;
		if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
		var aa = Array.isArray(a);
		if (aa !== Array.isArray(b)) return false;
		var i;
		if (aa) {
			if (a.length !== b.length) return false;
			for (i = 0; i < a.length; i++) if (!_deq(a[i], b[i])) return false;
			return true;
		}
		var ka = Object.keys(a);
		if (ka.length !== Object.keys(b).length) return false;
		for (i = 0; i < ka.length; i++) {
			var k = ka[i];
			if (!Object.prototype.hasOwnProperty.call(b, k) || !_deq(a[k], b[k])) return false;
		}
		return true;
	}
	function _uqh(x) {
		if (x === null) return 1;
		var t = typeof x, h, i;
		if (t === "boolean") return x ? 2 : 3;
		if (t === "number") {
			if (x === 0) return 4;
			h = x | 0;
			return Math.imul(h ^ ((x - h) * 1e9 | 0), 2654435761) ^ 5;
		}
		if (t === "string") {
			h = 2166136261 ^ x.length;
			for (i = 0; i < x.length; i++) h = Math.imul(h ^ x.charCodeAt(i), 16777619);
			return h;
		}
		if (t !== "object") return 6;
		if (Array.isArray(x)) {
			h = 625341585 ^ x.length;
			for (i = 0; i < x.length; i++) h = Math.imul(h ^ _uqh(x[i]), 16777619);
			return h;
		}
		var ks = Object.keys(x);
		h = 1821285621 ^ ks.length;
		for (i = 0; i < ks.length; i++) h = h + Math.imul(_uqh(ks[i]) ^ Math.imul(_uqh(x[ks[i]]), 1540483477), 668265261) | 0;
		return h;
	}
	function _uq(a) {
		var n = a.length, i, k;
		if (n < 2) return true;
		if (n <= 12) {
			for (i = 1; i < n; i++) for (k = 0; k < i; k++) if (_deq(a[i], a[k])) return false;
			return true;
		}
		var prim = true;
		for (i = 0; i < n; i++) {
			var x = a[i];
			if (x !== null && typeof x === "object") {
				prim = false;
				break;
			}
		}
		if (prim) {
			var s = /* @__PURE__ */ new Set();
			for (i = 0; i < n; i++) {
				if (s.has(a[i])) return false;
				s.add(a[i]);
			}
			return true;
		}
		var m = /* @__PURE__ */ new Map();
		for (i = 0; i < n; i++) {
			var hh = _uqh(a[i]), b = m.get(hh);
			if (b === void 0) m.set(hh, i);
			else if (typeof b === "number") {
				if (_deq(a[b], a[i])) return false;
				m.set(hh, [b, i]);
			} else {
				for (k = 0; k < b.length; k++) if (_deq(a[b[k]], a[i])) return false;
				b.push(i);
			}
		}
		return true;
	}
	var _uqpI = 0;
	function _uqp(a) {
		var n = a.length, i, k;
		if (n < 2) return -1;
		if (n <= 12) {
			for (i = 0; i < n - 1; i++) for (k = i + 1; k < n; k++) if (_deq(a[i], a[k])) {
				_uqpI = i;
				return k;
			}
			return -1;
		}
		var prim = true;
		for (i = 0; i < n; i++) {
			var x = a[i];
			if (x !== null && typeof x === "object") {
				prim = false;
				break;
			}
		}
		var bi = -1, bj = -1, m = /* @__PURE__ */ new Map();
		if (prim) for (i = 0; i < n; i++) {
			var p = m.get(a[i]);
			if (p === void 0) m.set(a[i], i);
			else if (p >= 0) {
				if (bi < 0 || p < bi) {
					bi = p;
					bj = i;
				}
				m.set(a[i], -1);
			}
		}
		else {
			var paired = null;
			for (i = 0; i < n; i++) {
				var hh = _uqh(a[i]), b = m.get(hh), r = -1;
				if (b === void 0) {
					m.set(hh, i);
					continue;
				}
				if (typeof b === "number") {
					if (_deq(a[b], a[i])) r = b;
					else m.set(hh, [b, i]);
				} else {
					for (k = 0; k < b.length; k++) if (_deq(a[b[k]], a[i])) {
						r = b[k];
						break;
					}
					if (r < 0) b.push(i);
				}
				if (r >= 0) {
					if (paired === null) paired = /* @__PURE__ */ new Set();
					if (!paired.has(r)) {
						paired.add(r);
						if (bi < 0 || r < bi) {
							bi = r;
							bj = i;
						}
					}
				}
			}
		}
		if (bi < 0) return -1;
		_uqpI = bi;
		return bj;
	}
	function allDistinct(a) {
		return _uq(a);
	}
	function duplicatePair(a) {
		var j = _uqp(a);
		return j < 0 ? null : [_uqpI, j];
	}
	module.exports = {
		allDistinct,
		duplicatePair,
		_deq,
		_uqh,
		_uq,
		_uqp
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function isDigit(c) {
		return c >= 48 && c <= 57;
	}
	function date(s) {
		if (s.length !== 10) return false;
		for (let i = 0; i < 10; i++) {
			const c = s.charCodeAt(i);
			if (i === 4 || i === 7) {
				if (c !== 45) return false;
			} else if (!isDigit(c)) return false;
		}
		const m = (s.charCodeAt(5) - 48) * 10 + (s.charCodeAt(6) - 48);
		const d = (s.charCodeAt(8) - 48) * 10 + (s.charCodeAt(9) - 48);
		if (m < 1 || m > 12 || d < 1) return false;
		return d <= daysInMonth((s.charCodeAt(0) - 48) * 1e3 + (s.charCodeAt(1) - 48) * 100 + (s.charCodeAt(2) - 48) * 10 + (s.charCodeAt(3) - 48), m);
	}
	function daysInMonth(year, month) {
		if (month === 2) return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ? 29 : 28;
		return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
	}
	function twoDigits(s, i) {
		return (s.charCodeAt(i) - 48) * 10 + (s.charCodeAt(i + 1) - 48);
	}
	function dateTime(s) {
		const n = s.length;
		if (n < 20) return false;
		if (s.charCodeAt(4) !== 45 || s.charCodeAt(7) !== 45) return false;
		const sep = s.charCodeAt(10);
		if (sep !== 84 && sep !== 116) return false;
		if (s.charCodeAt(13) !== 58 || s.charCodeAt(16) !== 58) return false;
		const y0 = s.charCodeAt(0) - 48, y1 = s.charCodeAt(1) - 48;
		const y2 = s.charCodeAt(2) - 48, y3 = s.charCodeAt(3) - 48;
		if (y0 >>> 0 > 9 || y1 >>> 0 > 9 || y2 >>> 0 > 9 || y3 >>> 0 > 9) return false;
		const year = y0 * 1e3 + y1 * 100 + y2 * 10 + y3;
		const mo0 = s.charCodeAt(5) - 48, mo1 = s.charCodeAt(6) - 48;
		if (mo0 >>> 0 > 9 || mo1 >>> 0 > 9) return false;
		const month = mo0 * 10 + mo1;
		if (month < 1 || month > 12) return false;
		const d0 = s.charCodeAt(8) - 48, d1 = s.charCodeAt(9) - 48;
		if (d0 >>> 0 > 9 || d1 >>> 0 > 9) return false;
		const day = d0 * 10 + d1;
		if (day < 1 || day > daysInMonth(year, month)) return false;
		const h0 = s.charCodeAt(11) - 48, h1 = s.charCodeAt(12) - 48;
		if (h0 >>> 0 > 9 || h1 >>> 0 > 9 || h0 * 10 + h1 > 23) return false;
		const mi0 = s.charCodeAt(14) - 48, mi1 = s.charCodeAt(15) - 48;
		if (mi0 >>> 0 > 5 || mi1 >>> 0 > 9) return false;
		const se0 = s.charCodeAt(17) - 48, se1 = s.charCodeAt(18) - 48;
		if (se0 >>> 0 > 6 || se1 >>> 0 > 9 || se0 * 10 + se1 > 60) return false;
		let i = 19;
		if (s.charCodeAt(i) === 46) {
			i++;
			const start = i;
			while (i < n) {
				const c = s.charCodeAt(i);
				if (c < 48 || c > 57) break;
				i++;
			}
			if (i === start) return false;
		}
		const c = s.charCodeAt(i);
		const sec = se0 * 10 + se1;
		const hh = h0 * 10 + h1, mi = mi0 * 10 + mi1;
		let offMin = 0;
		if (c === 90 || c === 122) {
			if (i !== n - 1) return false;
		} else {
			if (c !== 43 && c !== 45) return false;
			if (n - i !== 6) return false;
			if (!isDigit(s.charCodeAt(i + 1)) || !isDigit(s.charCodeAt(i + 2))) return false;
			if (s.charCodeAt(i + 3) !== 58) return false;
			if (!isDigit(s.charCodeAt(i + 4)) || !isDigit(s.charCodeAt(i + 5))) return false;
			const oh = twoDigits(s, i + 1), om = twoDigits(s, i + 4);
			if (oh > 23 || om > 59) return false;
			offMin = (c === 43 ? 1 : -1) * (oh * 60 + om);
		}
		if (sec === 60) {
			if (((hh * 60 + mi - offMin) % 1440 + 1440) % 1440 !== 1439) return false;
		}
		return true;
	}
	const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
	function ipv4(s) {
		return IPV4.test(s);
	}
	function ipv4Range(s, from, to) {
		const n = to - from;
		if (n < 7 || n > 15) return false;
		let octets = 0, value = 0, digits = 0;
		for (let i = from; i <= to; i++) {
			const c = i < to ? s.charCodeAt(i) : 46;
			if (c === 46) {
				if (digits === 0 || value > 255) return false;
				octets++;
				value = 0;
				digits = 0;
				if (octets > 4) return false;
			} else if (isDigit(c)) {
				if (digits === 1 && value === 0) return false;
				value = value * 10 + (c - 48);
				digits++;
				if (digits > 3) return false;
			} else return false;
		}
		return octets === 4;
	}
	const IPV6_FULL = /^(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
	function ipv6(s) {
		const n = s.length;
		if (n >= 15 && IPV6_FULL.test(s)) return true;
		if (n < 2 || n > 45) return false;
		let end = n;
		let groups = 0;
		const dot = s.indexOf(".");
		if (dot !== -1) {
			const lastColon = s.lastIndexOf(":", dot);
			if (lastColon === -1) return false;
			if (!ipv4Range(s, lastColon + 1, n)) return false;
			end = lastColon + 1;
			groups = 2;
		}
		let compressed = false;
		let digits = 0;
		let i = 0;
		if (s.charCodeAt(0) === 58 && s.charCodeAt(1) !== 58) return false;
		while (i < end) {
			const c = s.charCodeAt(i);
			if (c === 58) {
				if (digits > 0) {
					groups++;
					digits = 0;
				}
				if (i + 1 < n && s.charCodeAt(i + 1) === 58) {
					if (compressed) return false;
					compressed = true;
					i += 2;
					if (i < n && s.charCodeAt(i) === 58) return false;
					continue;
				}
				i++;
				if (i === end && end === n) return false;
				continue;
			}
			if (isDigit(c) || c >= 97 && c <= 102 || c >= 65 && c <= 70) {
				if (++digits > 4) return false;
				i++;
				continue;
			}
			return false;
		}
		if (digits > 0) groups++;
		if (groups > 8) return false;
		return compressed ? groups < 8 : groups === 8;
	}
	function hostname(s, from, to) {
		const start = from === void 0 ? 0 : from;
		const end = to === void 0 ? s.length : to;
		const n = end - start;
		if (n === 0 || n > 253) return false;
		let labelLength = 0;
		let previous = 46;
		for (let i = start; i < end; i++) {
			const c = s.charCodeAt(i);
			if (c === 46) {
				if (labelLength === 0 || previous === 45) return false;
				labelLength = 0;
				previous = c;
				continue;
			}
			if (!(isDigit(c) || c >= 97 && c <= 122 || c >= 65 && c <= 90) && c !== 45) return false;
			if (c === 45 && previous === 46) return false;
			if (++labelLength > 63) return false;
			previous = c;
		}
		return labelLength !== 0 && previous !== 45;
	}
	const URI_CHAR = /* @__PURE__ */ new Uint8Array(128);
	for (let i = 33; i < 127; i++) URI_CHAR[i] = 1;
	for (const c of [
		34,
		60,
		62,
		92,
		94,
		96,
		123,
		124,
		125
	]) URI_CHAR[c] = 0;
	const HEX_CHAR = /* @__PURE__ */ new Uint8Array(128);
	for (let i = 48; i < 58; i++) HEX_CHAR[i] = 1;
	for (let i = 97; i < 103; i++) HEX_CHAR[i] = 1;
	for (let i = 65; i < 71; i++) HEX_CHAR[i] = 1;
	const SCHEME_CHAR = /* @__PURE__ */ new Uint8Array(128);
	for (let i = 48; i < 58; i++) SCHEME_CHAR[i] = 1;
	for (let i = 97; i < 123; i++) SCHEME_CHAR[i] = 1;
	for (let i = 65; i < 91; i++) SCHEME_CHAR[i] = 1;
	SCHEME_CHAR[43] = 1;
	SCHEME_CHAR[45] = 1;
	SCHEME_CHAR[46] = 1;
	const URI_FAST = /^[A-Za-z][A-Za-z0-9+.\-]*:(?:\/\/[!$&-.0-9;=A-Z_a-z~]*(?:[\/?#][!#$&-;=?-\[\]_a-z~]*)?|(?!\/\/)[!#$&-;=?-\[\]_a-z~]*)$/;
	function uri(s) {
		if (URI_FAST.test(s)) return true;
		const n = s.length;
		if (n === 0) return false;
		let c = s.charCodeAt(0);
		if (c > 127 || SCHEME_CHAR[c] === 0 || c >= 48 && c <= 57 || c === 43 || c === 45 || c === 46) return false;
		let colon = -1;
		for (let i = 1; i < n; i++) {
			c = s.charCodeAt(i);
			if (c === 58) {
				colon = i;
				break;
			}
			if (c > 127 || SCHEME_CHAR[c] === 0) return false;
		}
		if (colon === -1) return false;
		let i = colon + 1;
		let authEnd = n;
		if (s.charCodeAt(i) === 47 && s.charCodeAt(i + 1) === 47) {
			const authStart = i + 2;
			let at = -1, firstColon = -1, lastColon = -1, sawBracket = 0, bracketBeforeAt = 0;
			let hostStart = authStart;
			authEnd = -1;
			for (i = authStart; i < n; i++) {
				c = s.charCodeAt(i);
				if (c > 127 || URI_CHAR[c] === 0) return false;
				if (c === 47 || c === 63 || c === 35) {
					authEnd = i;
					break;
				}
				if (c === 37) {
					const h1 = s.charCodeAt(i + 1), h2 = s.charCodeAt(i + 2);
					if (!(h1 <= 127) || !(h2 <= 127) || HEX_CHAR[h1] === 0 || HEX_CHAR[h2] === 0) return false;
					i += 2;
					continue;
				}
				if (c === 64) {
					bracketBeforeAt = sawBracket;
					at = i;
					firstColon = -1;
					lastColon = -1;
					hostStart = i + 1;
				} else if (c === 58) {
					if (firstColon === -1) firstColon = i;
					lastColon = i;
				} else if (c === 91 || c === 93) sawBracket = 1;
			}
			if (authEnd === -1) authEnd = n;
			if (at !== -1 && bracketBeforeAt) return false;
			if (s.charCodeAt(hostStart) === 91) {
				let close = -1;
				for (let j = hostStart + 1; j < authEnd; j++) if (s.charCodeAt(j) === 93) {
					close = j;
					break;
				}
				if (close === -1) return false;
				if (close + 1 !== authEnd) {
					if (s.charCodeAt(close + 1) !== 58) return false;
					if (!allDigits(s, close + 2, authEnd)) return false;
				}
			} else if (lastColon !== -1) {
				if (firstColon !== lastColon) return false;
				if (!allDigits(s, lastColon + 1, authEnd)) return false;
			}
			i = authEnd;
		}
		for (; i < n; i++) {
			c = s.charCodeAt(i);
			if (c > 127 || URI_CHAR[c] === 0) return false;
			if (c === 37) {
				const h1 = s.charCodeAt(i + 1), h2 = s.charCodeAt(i + 2);
				if (!(h1 <= 127) || !(h2 <= 127) || HEX_CHAR[h1] === 0 || HEX_CHAR[h2] === 0) return false;
				i += 2;
			}
		}
		return true;
	}
	const NON_PRINTABLE = /[^\u0021-\u007e]/;
	function uriChar(c) {
		if (c < 33 || c > 126) return false;
		return !(c === 34 || c === 60 || c === 62 || c === 92 || c === 94 || c === 96 || c === 123 || c === 124 || c === 125);
	}
	function isHex(c) {
		return c >= 48 && c <= 57 || c >= 97 && c <= 102 || c >= 65 && c <= 70;
	}
	function uriChars(s, from) {
		for (let i = from; i < s.length; i++) {
			const c = s.charCodeAt(i);
			if (c > 127 || URI_CHAR[c] === 0) return false;
			if (c === 37) {
				const h1 = s.charCodeAt(i + 1), h2 = s.charCodeAt(i + 2);
				if (!(h1 <= 127) || !(h2 <= 127) || HEX_CHAR[h1] === 0 || HEX_CHAR[h2] === 0) return false;
				i += 2;
			}
		}
		return true;
	}
	function allDigits(s, from, to) {
		for (let i = from; i < to; i++) {
			const c = s.charCodeAt(i);
			if (c < 48 || c > 57) return false;
		}
		return true;
	}
	function uriAuthority(s, start) {
		if (s.charCodeAt(start) !== 47 || s.charCodeAt(start + 1) !== 47) return true;
		const n = s.length;
		const authStart = start + 2;
		let authEnd = n;
		for (let i = authStart; i < n; i++) {
			const c = s.charCodeAt(i);
			if (c === 47 || c === 63 || c === 35) {
				authEnd = i;
				break;
			}
		}
		let at = -1;
		for (let i = authEnd - 1; i >= authStart; i--) if (s.charCodeAt(i) === 64) {
			at = i;
			break;
		}
		if (at !== -1) for (let i = authStart; i < at; i++) {
			const c = s.charCodeAt(i);
			if (c === 91 || c === 93) return false;
		}
		const hpStart = at === -1 ? authStart : at + 1;
		if (s.charCodeAt(hpStart) === 91) {
			let close = -1;
			for (let i = hpStart + 1; i < authEnd; i++) if (s.charCodeAt(i) === 93) {
				close = i;
				break;
			}
			if (close === -1) return false;
			if (close + 1 === authEnd) return true;
			if (s.charCodeAt(close + 1) !== 58) return false;
			return allDigits(s, close + 2, authEnd);
		}
		let firstColon = -1;
		let lastColon = -1;
		for (let i = hpStart; i < authEnd; i++) if (s.charCodeAt(i) === 58) {
			if (firstColon === -1) firstColon = i;
			lastColon = i;
		}
		if (lastColon === -1) return true;
		if (firstColon !== lastColon) return false;
		return allDigits(s, lastColon + 1, authEnd);
	}
	function iriChar(c) {
		return c > 126 ? c !== 127 : uriChar(c);
	}
	function iriChars(s, from) {
		for (let i = from; i < s.length; i++) {
			const c = s.charCodeAt(i);
			if (!iriChar(c)) return false;
			if (c === 37) {
				if (!isHex(s.charCodeAt(i + 1)) || !isHex(s.charCodeAt(i + 2))) return false;
				i += 2;
			}
		}
		return true;
	}
	function iri(s) {
		const n = s.length;
		if (n === 0) return false;
		const first = s.charCodeAt(0);
		if (!(first >= 97 && first <= 122 || first >= 65 && first <= 90)) return false;
		let colon = -1;
		for (let i = 1; i < n; i++) {
			const c = s.charCodeAt(i);
			if (c === 58) {
				colon = i;
				break;
			}
			if (!(isDigit(c) || c >= 97 && c <= 122 || c >= 65 && c <= 90 || c === 43 || c === 45 || c === 46)) return false;
		}
		if (colon === -1) return false;
		return iriChars(s, colon + 1) && uriAuthority(s, colon + 1);
	}
	function iriReference(s) {
		return iriChars(s, 0);
	}
	function idnEmail(s) {
		const at = s.lastIndexOf("@");
		if (at <= 0 || at === s.length - 1) return false;
		const local = s.slice(0, at);
		const domain = s.slice(at + 1);
		if (local.charCodeAt(0) === 34) return local.length >= 2 && local.charCodeAt(local.length - 1) === 34 && domain.length > 0;
		if (local.charCodeAt(0) === 46 || local.charCodeAt(local.length - 1) === 46) return false;
		if (local.indexOf("..") !== -1) return false;
		if (domain.charCodeAt(0) === 91) return domain.charCodeAt(domain.length - 1) === 93 && domain.length > 2;
		if (domain.charCodeAt(0) === 46 || domain.charCodeAt(domain.length - 1) === 46) return false;
		if (domain.indexOf("..") !== -1) return false;
		for (let i = 0; i < domain.length; i++) {
			const c = domain.charCodeAt(i);
			if (c <= 32 || c === 127 || c === 64) return false;
		}
		return true;
	}
	function noReserved(s, from) {
		if (!NON_PRINTABLE.test(s)) return true;
		const n = s.length;
		for (let i = from; i < n; i++) {
			const c = s.charCodeAt(i);
			if (c > 32 && c < 127) continue;
			if (c <= 32 || c === 127) return false;
			if (c === 160 || c === 5760 || c >= 8192 && c <= 8202 || c === 8232 || c === 8233 || c === 8239 || c === 8287 || c === 12288 || c === 65279) return false;
		}
		return true;
	}
	function hexRun(s, from, to) {
		for (let i = from; i < to; i++) {
			const c = s.charCodeAt(i);
			if (!(c - 48 >>> 0 < 10 || (c | 32) - 97 >>> 0 < 6)) return false;
		}
		return true;
	}
	function uuid(s) {
		if (s.length !== 36) return false;
		if (s.charCodeAt(8) !== 45 || s.charCodeAt(13) !== 45 || s.charCodeAt(18) !== 45 || s.charCodeAt(23) !== 45) return false;
		return hexRun(s, 0, 8) && hexRun(s, 9, 13) && hexRun(s, 14, 18) && hexRun(s, 19, 23) && hexRun(s, 24, 36);
	}
	function time(s) {
		const n = s.length;
		if (n < 8) return false;
		const h1 = s.charCodeAt(0) - 48, h2 = s.charCodeAt(1) - 48;
		if (h1 >>> 0 > 9 || h2 >>> 0 > 9 || h1 * 10 + h2 > 23) return false;
		if (s.charCodeAt(2) !== 58 || s.charCodeAt(5) !== 58) return false;
		const m1 = s.charCodeAt(3) - 48, m2 = s.charCodeAt(4) - 48;
		if (m1 >>> 0 > 5 || m2 >>> 0 > 9) return false;
		const c1 = s.charCodeAt(6) - 48, c2 = s.charCodeAt(7) - 48;
		if (c1 >>> 0 > 6 || c2 >>> 0 > 9 || c1 * 10 + c2 > 60) return false;
		let i = 8;
		if (i < n && s.charCodeAt(i) === 46) {
			i++;
			const start = i;
			while (i < n) {
				if (s.charCodeAt(i) - 48 >>> 0 > 9) break;
				i++;
			}
			if (i === start) return false;
		}
		if (i === n) return false;
		const hh = h1 * 10 + h2, mm = m1 * 10 + m2, ss = c1 * 10 + c2;
		const z = s.charCodeAt(i);
		let offMin = 0;
		if (z === 90 || z === 122) {
			if (i !== n - 1) return false;
		} else {
			if (z !== 43 && z !== 45) return false;
			if (n - i !== 6 || s.charCodeAt(i + 3) !== 58) return false;
			for (let k = 1; k <= 5; k++) {
				if (k === 3) continue;
				if (s.charCodeAt(i + k) - 48 >>> 0 > 9) return false;
			}
			const oh = (s.charCodeAt(i + 1) - 48) * 10 + (s.charCodeAt(i + 2) - 48);
			const om = (s.charCodeAt(i + 4) - 48) * 10 + (s.charCodeAt(i + 5) - 48);
			if (oh > 23 || om > 59) return false;
			offMin = (z === 43 ? 1 : -1) * (oh * 60 + om);
		}
		if (ss === 60) {
			if (((hh * 60 + mm - offMin) % 1440 + 1440) % 1440 !== 1439) return false;
		}
		return true;
	}
	function uriReference(s) {
		return uriChars(s, 0);
	}
	function jsonPointer(s) {
		if (s === "") return true;
		if (s.charCodeAt(0) !== 47) return false;
		for (let i = 0; i < s.length; i++) {
			if (s.charCodeAt(i) !== 126) continue;
			const n = s.charCodeAt(i + 1);
			if (n !== 48 && n !== 49) return false;
		}
		return true;
	}
	function relativeJsonPointer(s) {
		let i = 0;
		while (i < s.length) {
			const c = s.charCodeAt(i);
			if (c < 48 || c > 57) break;
			i++;
		}
		if (i === 0) return false;
		if (i > 1 && s.charCodeAt(0) === 48) return false;
		const rest = s.slice(i);
		if (rest === "#") return true;
		return jsonPointer(rest);
	}
	const URI_TEMPLATE_EXPR = /^(?:[+#./;?&=,!@|]?)(?:[A-Za-z0-9_%]|%[0-9A-Fa-f]{2})+(?:\.(?:[A-Za-z0-9_%]|%[0-9A-Fa-f]{2})+)*(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[A-Za-z0-9_%]|%[0-9A-Fa-f]{2})+(?:\.(?:[A-Za-z0-9_%]|%[0-9A-Fa-f]{2})+)*(?::[1-9][0-9]{0,3}|\*)?)*$/;
	function uriTemplate(s) {
		let i = 0;
		while (i < s.length) {
			const c = s.charCodeAt(i);
			if (c === 125) return false;
			if (c !== 123 && (c <= 32 || c === 127)) return false;
			if (c !== 123) {
				i++;
				continue;
			}
			const end = s.indexOf("}", i + 1);
			if (end === -1) return false;
			const expr = s.slice(i + 1, end);
			if (expr === "" || expr.indexOf("{") !== -1) return false;
			if (!URI_TEMPLATE_EXPR.test(expr)) return false;
			i = end + 1;
		}
		return true;
	}
	const EMAIL_LOCAL = /* @__PURE__ */ new Uint8Array(128);
	for (let i = 48; i <= 57; i++) EMAIL_LOCAL[i] = 1;
	for (let i = 97; i <= 122; i++) EMAIL_LOCAL[i] = 1;
	for (let i = 65; i <= 90; i++) EMAIL_LOCAL[i] = 1;
	for (let i = 35; i <= 39; i++) EMAIL_LOCAL[i] = 1;
	for (let i = 94; i <= 96; i++) EMAIL_LOCAL[i] = 1;
	for (let i = 123; i <= 126; i++) EMAIL_LOCAL[i] = 1;
	for (const c of [
		46,
		33,
		42,
		43,
		45,
		47,
		61,
		63
	]) EMAIL_LOCAL[c] = 1;
	function email(s) {
		const n = s.length;
		if (n < 3) return false;
		let at;
		if (s.charCodeAt(0) === 34) {
			at = s.lastIndexOf("@");
			if (at < 2 || at === n - 1 || at > 64) return false;
			if (s.charCodeAt(at - 1) !== 34) return false;
		} else {
			if (s.charCodeAt(0) === 46) return false;
			at = -1;
			let afterDot = false;
			for (let i = 0; i < n; i++) {
				const c = s.charCodeAt(i);
				if (c === 64) {
					at = i;
					break;
				}
				if (c > 127 || EMAIL_LOCAL[c] === 0) return false;
				if (c === 46) {
					if (afterDot) return false;
					afterDot = true;
				} else afterDot = false;
			}
			if (at <= 0 || at === n - 1 || at > 64) return false;
			if (s.charCodeAt(at - 1) === 46) return false;
		}
		if (s.charCodeAt(at + 1) === 91) {
			if (s.charCodeAt(n - 1) !== 93 || n - at - 1 <= 2) return false;
			if (s.startsWith("IPv6:", at + 2)) return ipv6(s.slice(at + 7, n - 1));
			return ipv4(s.slice(at + 2, n - 1));
		}
		return hostname(s, at + 1, n);
	}
	const DURATION_RE = /^P(?:\d+W|(?:\d+Y(?:\d+M(?:\d+D)?)?|\d+M(?:\d+D)?|\d+D)(?:T(?:\d+H(?:\d+M(?:\d+S)?)?|\d+M(?:\d+S)?|\d+S))?|T(?:\d+H(?:\d+M(?:\d+S)?)?|\d+M(?:\d+S)?|\d+S))$/;
	function duration(s) {
		return DURATION_RE.test(s);
	}
	module.exports = {
		IPV4,
		IPV6_FULL,
		ipv4Range,
		URI_FAST,
		date,
		ipv4,
		dateTime,
		ipv6,
		hostname,
		uri,
		uriReference,
		uuid,
		time,
		noReserved,
		jsonPointer,
		relativeJsonPointer,
		uriTemplate,
		email,
		duration,
		uriChars,
		uriAuthority,
		iri,
		iriReference,
		idnEmail,
		DURATION_RE,
		URI_TEMPLATE_EXPR
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/plan-compiler.js
var require_plan_compiler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { collapseBranches } = require_branch_collapse();
	const branchTitle = (n) => n && n.schema && typeof n.schema.title === "string" ? n.schema.title : "";
	function install(deps) {
		const { Plan, NOERRORS, err, evalLeaf, evalLeafV, runCustomV, dataBits, escapePointer, deepEqual, enumMember, allDistinct, multipleOfOk, cpAtLeast, cpAtMost, T_STRING, T_ARRAY, T_OBJECT, resolveRef, splitFragment, resolveUri } = deps;
		const TRUE_FN = () => true;
		const TRUE_PAIR = {
			v: TRUE_FN,
			c: TRUE_FN,
			leaf: true
		};
		const FALSE_PAIR = {
			leaf: true,
			v: () => false,
			c: (data, errors, instancePath, schemaPath) => {
				if (errors !== NOERRORS) errors.push(err("false schema", "not", instancePath, schemaPath, {}, "boolean schema is false"));
				return false;
			}
		};
		function dynTarget(interp, ref, base, chain) {
			const state = interp.state;
			let { node, base: refBase } = resolveRef(ref, base, state);
			const [, fragment] = splitFragment(resolveUri(base, ref));
			if (fragment && !fragment.startsWith("/")) {
				const initialDyn = state.dynamicAnchors.get(refBase);
				if (node !== void 0 && initialDyn && initialDyn.get(fragment) === node || !interp.bookending) for (let i = 0; i < chain.length; i++) {
					const dyn = state.dynamicAnchors.get(chain[i]);
					if (dyn && dyn.has(fragment)) {
						node = dyn.get(fragment);
						refBase = chain[i];
						break;
					}
				}
			}
			return {
				node,
				base: refBase
			};
		}
		function fresh() {
			return {
				props: null,
				n: 0,
				x: null,
				keys: null
			};
		}
		function keysOf(rec, data) {
			if (rec.keys === null) rec.keys = Object.keys(data);
			return rec.keys;
		}
		function hasProp(rec, key) {
			const p = rec.props;
			if (p === null) return false;
			for (let i = 0; i < p.length; i++) if (p[i] === key) return true;
			return false;
		}
		function addProp(rec, key) {
			if (rec.props === null) rec.props = [key];
			else rec.props.push(key);
		}
		function hasItem(rec, i) {
			if (i < rec.n) return true;
			const x = rec.x;
			if (x === null) return false;
			for (let j = 0; j < x.length; j++) if (x[j] === i) return true;
			return false;
		}
		function addItem(rec, i) {
			if (i < rec.n) return;
			if (i === rec.n) {
				rec.n = i + 1;
				return;
			}
			if (rec.x === null) rec.x = [i];
			else rec.x.push(i);
		}
		function markRange(rec, from, to) {
			if (from >= to) return;
			if (from <= rec.n) {
				if (to > rec.n) rec.n = to;
				return;
			}
			if (rec.x === null) rec.x = [];
			for (let i = from; i < to; i++) rec.x.push(i);
		}
		function mergeRec(target, from) {
			if (from.props !== null) {
				if (target.props === null) target.props = from.props;
				else for (let i = 0; i < from.props.length; i++) target.props.push(from.props[i]);
			}
			if (from.n > target.n) target.n = from.n;
			if (from.x !== null) {
				if (target.x === null) target.x = from.x;
				else for (let i = 0; i < from.x.length; i++) target.x.push(from.x[i]);
			}
		}
		function pLen(rec) {
			return rec.props === null ? 0 : rec.props.length;
		}
		function xLen(rec) {
			return rec.x === null ? 0 : rec.x.length;
		}
		function undo(rec, pl, n0, xl) {
			const p = rec.props;
			if (p !== null && p.length !== pl) p.length = pl;
			rec.n = n0;
			const x = rec.x;
			if (x !== null && x.length !== xl) x.length = xl;
		}
		function compileLeafV(P) {
			const checks = [];
			let needsBits = false;
			if (P.hasType) {
				const mask = P.typeMask;
				needsBits = true;
				checks.push((data, bits) => (bits & mask) !== 0);
			}
			if (P.enum !== null) {
				if (P.enum.length === 0) checks.push(() => false);
				else checks.push((data) => enumMember(P, data));
			}
			if (P.hasConst) {
				const c = P.const;
				checks.push((data) => deepEqual(c, data));
			}
			if (P.hasNumber) {
				const nums = [];
				if (P.minimum !== void 0) {
					const m = P.minimum;
					nums.push((d) => d >= m);
				}
				if (P.maximum !== void 0) {
					const m = P.maximum;
					nums.push((d) => d <= m);
				}
				if (P.exclusiveMinimum !== void 0) {
					const m = P.exclusiveMinimum;
					nums.push((d) => d > m);
				}
				if (P.exclusiveMaximum !== void 0) {
					const m = P.exclusiveMaximum;
					nums.push((d) => d < m);
				}
				if (P.multipleOf !== void 0) {
					const m = P.multipleOf;
					nums.push((d) => multipleOfOk(d, m));
				}
				const run = combineValue(nums);
				if (run !== null) checks.push((data) => !Number.isFinite(data) || run(data));
			}
			if (P.hasString) {
				const strs = [];
				if (P.minLength !== void 0) {
					const m = P.minLength;
					strs.push((d) => cpAtLeast(d, m));
				}
				if (P.maxLength !== void 0) {
					const m = P.maxLength;
					strs.push((d) => cpAtMost(d, m));
				}
				if (P.pattern !== null) {
					const re = P.pattern;
					strs.push((d) => re.test(d));
				}
				if (P.formatFn !== null) {
					const f = P.formatFn;
					strs.push((d) => f(d));
				}
				const run = combineValue(strs);
				if (run !== null) {
					needsBits = true;
					checks.push((data, bits) => bits !== T_STRING || run(data));
				}
			}
			if (P.minItems !== void 0 || P.maxItems !== void 0 || P.uniqueItems) {
				const arrs = [];
				if (P.minItems !== void 0) {
					const m = P.minItems;
					arrs.push((d) => d.length >= m);
				}
				if (P.maxItems !== void 0) {
					const m = P.maxItems;
					arrs.push((d) => d.length <= m);
				}
				if (P.uniqueItems) arrs.push(allDistinct);
				const run = combineValue(arrs);
				if (run !== null) {
					needsBits = true;
					checks.push((data, bits) => bits !== T_ARRAY || run(data));
				}
			}
			if (P.required !== null || P.minProperties !== void 0 || P.maxProperties !== void 0 || P.dependentRequired !== null) {
				const objs = [];
				if (P.required !== null) {
					const req = P.required;
					if (req.length === 1) {
						const k = req[0];
						objs.push((d) => Object.hasOwn(d, k));
					} else objs.push((d) => {
						for (let i = 0; i < req.length; i++) if (!Object.hasOwn(d, req[i])) return false;
						return true;
					});
				}
				if (P.minProperties !== void 0) {
					const m = P.minProperties;
					objs.push((d) => Object.keys(d).length >= m);
				}
				if (P.maxProperties !== void 0) {
					const m = P.maxProperties;
					objs.push((d) => Object.keys(d).length <= m);
				}
				if (P.dependentRequired !== null) {
					const entries = P.dependentRequired;
					objs.push((d) => {
						for (let i = 0; i < entries.length; i++) {
							const [key, deps] = entries[i];
							if (!Object.hasOwn(d, key)) continue;
							for (let j = 0; j < deps.length; j++) if (!Object.hasOwn(d, deps[j])) return false;
						}
						return true;
					});
				}
				const run = combineValue(objs);
				if (run !== null) {
					needsBits = true;
					checks.push((data, bits) => bits !== T_OBJECT || run(data));
				}
			}
			if (P.hasCustom) {
				needsBits = true;
				checks.push((data, bits) => runCustomV(P, data, bits));
			}
			if (checks.length === 0) return TRUE_FN;
			if (!needsBits) {
				if (checks.length === 1) {
					const a = checks[0];
					return (data) => a(data, 0);
				}
				return (data) => {
					for (let i = 0; i < checks.length; i++) if (!checks[i](data, 0)) return false;
					return true;
				};
			}
			if (checks.length === 1) {
				const a = checks[0];
				return (data) => a(data, dataBits(data));
			}
			if (checks.length === 2) {
				const [a, b] = checks;
				return (data) => {
					const bits = dataBits(data);
					return a(data, bits) && b(data, bits);
				};
			}
			return (data) => {
				const bits = dataBits(data);
				for (let i = 0; i < checks.length; i++) if (!checks[i](data, bits)) return false;
				return true;
			};
		}
		function combineValue(fns) {
			if (fns.length === 0) return null;
			if (fns.length === 1) return fns[0];
			if (fns.length === 2) {
				const [a, b] = fns;
				return (d) => a(d) && b(d);
			}
			return (d) => {
				for (let i = 0; i < fns.length; i++) if (!fns[i](d)) return false;
				return true;
			};
		}
		function compileNode(ctx, node, base, chain, ann) {
			if (node === true) return TRUE_PAIR;
			if (node === false) return FALSE_PAIR;
			if (!(node instanceof Plan)) return TRUE_PAIR;
			const interp = ctx.interp;
			const P = node;
			if (P.nodeBase !== null && P.nodeBase !== base) base = P.nodeBase;
			if (chain.indexOf(base) === -1) chain = chain.concat(base);
			const collect = ann || P.hasUnevaluated;
			let perKey = ctx.memo.get(P);
			if (perKey === void 0) {
				perKey = /* @__PURE__ */ new Map();
				ctx.memo.set(P, perKey);
			}
			const key = (ann ? "a " : "p ") + base + " " + chain.join(" ");
			const cached = perKey.get(key);
			if (cached !== void 0) {
				if (cached.open) ctx.cyclic = true;
				return cached;
			}
			const box = {
				v: null,
				c: null
			};
			const pair = {
				open: true,
				leaf: false,
				v: (d, st, rec) => box.v(d, st, rec),
				c: (d, e, ip, sp, st, rec) => box.c(d, e, ip, sp, st, rec)
			};
			perKey.set(key, pair);
			let nested = false;
			const inPlace = (n, b) => {
				nested = true;
				return compileNode(ctx, n, b, chain, collect);
			};
			const child = (n) => {
				nested = true;
				return compileNode(ctx, n, base, chain, false);
			};
			const steps = [];
			const vsteps = [];
			for (let which = 0; which < 2; which++) {
				let t, seg;
				if (which === 0) {
					if (P.ref === null) continue;
					t = resolveRef(P.ref, base, interp.state);
					seg = "/$ref";
				} else {
					if (P.dynamicRef === null) continue;
					t = dynTarget(interp, P.dynamicRef, base, chain);
					seg = "/$dynamicRef";
				}
				if (t.node === void 0) {
					const ref = which === 0 ? P.ref : P.dynamicRef;
					const kw = which === 0 ? "$ref" : "$dynamicRef";
					steps.push((data, errors, instancePath, schemaPath) => {
						if (errors !== NOERRORS) errors.push(err(kw, kw, instancePath, schemaPath + seg, { ref }, `cannot resolve ${kw} ${ref}`));
						return false;
					});
					vsteps.push(() => false);
					continue;
				}
				const target = inPlace(interp.node(t.node), t.base);
				let cstep, vstep;
				if (collect) {
					cstep = (data, errors, instancePath, schemaPath, stack, rec) => {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						const ok = target.c(data, errors, instancePath, schemaPath, stack, rec);
						if (!ok) undo(rec, pl, n0, xl);
						return ok;
					};
					vstep = (data, stack, rec) => target.v(data, stack, rec);
				} else {
					cstep = (data, errors, instancePath, schemaPath, stack) => target.c(data, errors, instancePath, schemaPath, stack);
					vstep = target.v;
				}
				if (ctx.guard) {
					const schema = P.schema;
					const ic = cstep, iv = vstep;
					cstep = (data, errors, instancePath, schemaPath, stack, rec) => {
						for (let i = stack.length - 2; i >= 0; i -= 2) if (stack[i] === schema && stack[i + 1] === data) return true;
						stack.push(schema, data);
						const ok = ic(data, errors, instancePath, schemaPath, stack, rec);
						stack.length -= 2;
						return ok;
					};
					vstep = (data, stack, rec) => {
						for (let i = stack.length - 2; i >= 0; i -= 2) if (stack[i] === schema && stack[i + 1] === data) return true;
						stack.push(schema, data);
						const ok = iv(data, stack, rec);
						stack.length -= 2;
						return ok;
					};
				}
				steps.push(cstep);
				vsteps.push(vstep);
			}
			if (P.hasType || P.enum !== null || P.hasConst || P.hasNumber || P.hasString || P.minItems !== void 0 || P.maxItems !== void 0 || P.uniqueItems || P.required !== null || P.minProperties !== void 0 || P.maxProperties !== void 0 || P.dependentRequired !== null || P.hasCustom) {
				steps.push((data, errors, instancePath, schemaPath) => evalLeaf(P, data, errors, instancePath, schemaPath));
				vsteps.push(compileLeafV(P));
			}
			if (P.prefixItems !== null) {
				const fns = P.prefixItems.map(child);
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let ok = true;
					const n = Math.min(fns.length, data.length);
					for (let i = 0; i < n; i++) if (!(fns[i].leaf && fns[i].v(data[i], stack) || fns[i].c(data[i], errors, instancePath + "/" + i, schemaPath + "/prefixItems/" + i, stack))) {
						ok = false;
						if (errors === NOERRORS) return false;
					}
					if (collect) markRange(rec, 0, n);
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					const n = Math.min(fns.length, data.length);
					for (let i = 0; i < n; i++) if (!fns[i].v(data[i], stack)) return false;
					if (collect) markRange(rec, 0, n);
					return true;
				});
			}
			if (P.items !== void 0) {
				const fn = child(P.items);
				const start = P.prefixItems !== null ? P.prefixItems.length : 0;
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let ok = true;
					for (let i = start; i < data.length; i++) if (!(fn.leaf && fn.v(data[i], stack) || fn.c(data[i], errors, instancePath + "/" + i, schemaPath + "/items", stack))) {
						ok = false;
						if (errors === NOERRORS) return false;
					}
					if (collect) markRange(rec, start, data.length);
					return ok;
				});
				const fv = fn.v;
				vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					for (let i = start; i < data.length; i++) if (!fv(data[i], stack)) return false;
					if (collect) markRange(rec, start, data.length);
					return true;
				});
			}
			if (P.contains !== void 0) {
				const fn = child(P.contains);
				const minC = P.minContains !== void 0 ? P.minContains : 1;
				const maxC = P.maxContains;
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let matched = 0;
					for (let i = 0; i < data.length; i++) if (fn.v(data[i], stack)) {
						matched++;
						if (collect) addItem(rec, i);
					}
					let ok = true;
					if (matched < minC) {
						if (errors !== NOERRORS) errors.push(err("contains", "contains", instancePath, schemaPath + "/contains", { minContains: minC }, `must contain at least ${minC} valid item(s)`));
						ok = false;
					}
					if (maxC !== void 0 && matched > maxC) {
						if (errors !== NOERRORS) errors.push(err("contains", "contains", instancePath, schemaPath + "/contains", {
							minContains: minC,
							maxContains: maxC
						}, `must NOT contain more than ${maxC} valid item(s)`));
						ok = false;
					}
					return ok;
				});
				if (collect) vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let matched = 0;
					for (let i = 0; i < data.length; i++) if (fn.v(data[i], stack)) {
						matched++;
						addItem(rec, i);
					}
					return matched >= minC && (maxC === void 0 || matched <= maxC);
				});
				else vsteps.push((data, stack) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let matched = 0;
					for (let i = 0; i < data.length; i++) if (fn.v(data[i], stack)) {
						matched++;
						if (maxC === void 0 && matched >= minC) return true;
					}
					return matched >= minC && (maxC === void 0 || matched <= maxC);
				});
			}
			if (P.properties !== null || P.patternProperties !== null || P.additionalProperties !== void 0 || P.propertyNames !== void 0) {
				const props = P.properties;
				const propKeys = props !== null ? [...props.keys()] : null;
				const propList = props !== null ? [...props.values()].map((entry) => ({
					fn: child(entry.node),
					seg: entry.seg,
					schemaSeg: entry.schemaSeg
				})) : null;
				const propMap = props !== null && props.size > 8 ? new Map(propKeys.map((k, i) => [k, propList[i]])) : null;
				const lookup = propMap !== null ? (key) => propMap.get(key) : propKeys !== null ? (key) => {
					for (let i = 0; i < propKeys.length; i++) if (propKeys[i] === key) return propList[i];
				} : null;
				const patterns = P.patternProperties !== null ? P.patternProperties.map((e) => ({
					re: e.re,
					src: e.src,
					fn: child(e.node)
				})) : null;
				const apFn = P.additionalProperties !== void 0 ? child(P.additionalProperties) : null;
				const apFalse = P.additionalProperties === false;
				const pnFn = P.propertyNames !== void 0 ? child(P.propertyNames) : null;
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					const keys = collect ? keysOf(rec, data) : Object.keys(data);
					if (pnFn !== null) {
						for (const k of keys) if (!pnFn.c(k, errors, instancePath, schemaPath + "/propertyNames", stack)) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
					}
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						let evaluated = false;
						const prop = lookup !== null ? lookup(key) : void 0;
						if (prop !== void 0) {
							if (!(prop.fn.leaf && prop.fn.v(data[key], stack) || prop.fn.c(data[key], errors, instancePath + prop.seg, schemaPath + prop.schemaSeg, stack))) {
								ok = false;
								if (errors === NOERRORS) return false;
							}
							evaluated = true;
						}
						if (patterns !== null) for (let pi = 0; pi < patterns.length; pi++) {
							const pp = patterns[pi];
							if (pp.re.test(key)) {
								if (!(pp.fn.leaf && pp.fn.v(data[key], stack) || pp.fn.c(data[key], errors, instancePath + "/" + escapePointer(key), schemaPath + "/patternProperties/" + escapePointer(pp.src), stack))) {
									ok = false;
									if (errors === NOERRORS) return false;
								}
								evaluated = true;
							}
						}
						if (!evaluated && apFn !== null) {
							if (apFalse) {
								ok = false;
								if (errors === NOERRORS) return false;
								errors.push(err("additionalProperties", "additionalProperties", instancePath, schemaPath + "/additionalProperties", { additionalProperty: key }, "must NOT have additional properties"));
							} else if (!(apFn.leaf && apFn.v(data[key], stack) || apFn.c(data[key], errors, instancePath + "/" + escapePointer(key), schemaPath + "/additionalProperties", stack))) {
								ok = false;
								if (errors === NOERRORS) return false;
							}
							evaluated = true;
						}
						if (evaluated && collect) addProp(rec, key);
					}
					return ok;
				});
				if (patterns === null && apFn === null && pnFn === null && propKeys.length <= 8) {
					const n = propKeys.length;
					vsteps.push((data, stack, rec) => {
						if (dataBits(data) !== T_OBJECT) return true;
						for (let i = 0; i < n; i++) {
							const key = propKeys[i];
							if (!Object.hasOwn(data, key)) continue;
							if (!propList[i].fn.v(data[key], stack)) return false;
							if (collect) addProp(rec, key);
						}
						return true;
					});
				} else vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					const keys = collect ? keysOf(rec, data) : Object.keys(data);
					if (pnFn !== null) {
						for (const k of keys) if (!pnFn.v(k, stack)) return false;
					}
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						let evaluated = false;
						const prop = lookup !== null ? lookup(key) : void 0;
						if (prop !== void 0) {
							if (!prop.fn.v(data[key], stack)) return false;
							evaluated = true;
						}
						if (patterns !== null) for (let pi = 0; pi < patterns.length; pi++) {
							const pp = patterns[pi];
							if (pp.re.test(key)) {
								if (!pp.fn.v(data[key], stack)) return false;
								evaluated = true;
							}
						}
						if (!evaluated && apFn !== null) {
							if (!apFn.v(data[key], stack)) return false;
							evaluated = true;
						}
						if (evaluated && collect) addProp(rec, key);
					}
					return true;
				});
			}
			if (P.dependentSchemas !== null) {
				const entries = P.dependentSchemas.map(([k, v]) => [
					k,
					inPlace(v, base),
					escapePointer(k)
				]);
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					for (const [k, fn, ek] of entries) if (Object.hasOwn(data, k)) {
						if (collect) {
							const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
							if (!fn.c(data, errors, instancePath, schemaPath + "/dependentSchemas/" + ek, stack, rec)) {
								undo(rec, pl, n0, xl);
								ok = false;
								if (errors === NOERRORS) return false;
							}
						} else if (!fn.c(data, errors, instancePath, schemaPath + "/dependentSchemas/" + ek, stack)) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
					}
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					for (const [k, fn] of entries) if (Object.hasOwn(data, k) && !fn.v(data, stack, rec)) return false;
					return true;
				});
			}
			if (P.propertyDependencies !== null) {
				const entries = P.propertyDependencies.map(([k, choices]) => {
					const m = /* @__PURE__ */ new Map();
					for (const [value, v] of choices) m.set(value, inPlace(v, base));
					return [k, m];
				});
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					for (const [k, choices] of entries) {
						if (!Object.hasOwn(data, k)) continue;
						const value = data[k];
						if (typeof value !== "string") continue;
						const fn = choices.get(value);
						if (fn === void 0) continue;
						const branchPath = schemaPath + "/propertyDependencies/" + escapePointer(k) + "/" + escapePointer(value);
						if (collect) {
							const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
							if (!fn.c(data, errors, instancePath, branchPath, stack, rec)) {
								undo(rec, pl, n0, xl);
								ok = false;
								if (errors === NOERRORS) return false;
							}
						} else if (!fn.c(data, errors, instancePath, branchPath, stack)) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
					}
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					for (const [k, choices] of entries) {
						if (!Object.hasOwn(data, k)) continue;
						const value = data[k];
						if (typeof value !== "string") continue;
						const fn = choices.get(value);
						if (fn !== void 0 && !fn.v(data, stack, rec)) return false;
					}
					return true;
				});
			}
			if (P.allOf !== null) {
				const fns = P.allOf.map((v) => inPlace(v, base));
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					let ok = true;
					for (let i = 0; i < fns.length; i++) if (collect) {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						if (!fns[i].c(data, errors, instancePath, schemaPath + "/allOf/" + i, stack, rec)) {
							undo(rec, pl, n0, xl);
							ok = false;
							if (errors === NOERRORS) return false;
						}
					} else if (!fns[i].c(data, errors, instancePath, schemaPath + "/allOf/" + i, stack)) {
						ok = false;
						if (errors === NOERRORS) return false;
					}
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					for (let i = 0; i < fns.length; i++) if (!fns[i].v(data, stack, rec)) return false;
					return true;
				});
			}
			if (P.macros !== null) {
				const ms = P.macros.map((m) => ({
					keyword: m.keyword,
					fn: inPlace(m.node, base)
				}));
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					let ok = true;
					for (let i = 0; i < ms.length; i++) {
						const m = ms[i];
						const sp = schemaPath + "/" + m.keyword;
						let passed;
						if (collect) {
							const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
							passed = m.fn.c(data, errors, instancePath, sp, stack, rec);
							if (!passed) undo(rec, pl, n0, xl);
						} else passed = m.fn.c(data, errors, instancePath, sp, stack);
						if (!passed) {
							ok = false;
							if (errors === NOERRORS) return false;
							errors.push(err(m.keyword, m.keyword, instancePath, sp, { keyword: m.keyword }, `must pass "${m.keyword}" keyword validation`));
						}
					}
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					for (let i = 0; i < ms.length; i++) if (!ms[i].fn.v(data, stack, rec)) return false;
					return true;
				});
			}
			if (P.anyOf !== null) {
				const fns = P.anyOf.map((v) => inPlace(v, base));
				const titles = P.anyOf.map(branchTitle);
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					const scratch = errors === NOERRORS ? NOERRORS : [];
					let any = false;
					const branches = errors === NOERRORS ? null : [];
					for (let i = 0; i < fns.length; i++) {
						const mark = branches === null ? 0 : scratch.length;
						let ok;
						if (collect) {
							const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
							ok = fns[i].c(data, scratch, instancePath, schemaPath + "/anyOf/" + i, stack, rec);
							if (ok) any = true;
							else undo(rec, pl, n0, xl);
						} else {
							ok = fns[i].c(data, scratch, instancePath, schemaPath + "/anyOf/" + i, stack);
							if (ok) any = true;
						}
						if (branches !== null) branches.push({
							valid: ok,
							errors: scratch.slice(mark),
							title: titles[i]
						});
					}
					if (!any) {
						if (branches !== null) {
							const collapsed = collapseBranches({
								keyword: "anyOf",
								branchResults: branches,
								parentPath: instancePath,
								parentSchemaPath: schemaPath + "/anyOf"
							});
							if (collapsed !== null) errors.push(collapsed);
						}
						return false;
					}
					return true;
				});
				if (collect) vsteps.push((data, stack, rec) => {
					let any = false;
					for (let i = 0; i < fns.length; i++) {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						if (fns[i].v(data, stack, rec)) any = true;
						else undo(rec, pl, n0, xl);
					}
					return any;
				});
				else vsteps.push((data, stack) => {
					for (let i = 0; i < fns.length; i++) if (fns[i].v(data, stack)) return true;
					return false;
				});
			}
			if (P.oneOf !== null) {
				const fns = P.oneOf.map((v) => inPlace(v, base));
				const titles = P.oneOf.map(branchTitle);
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					const scratch = errors === NOERRORS ? NOERRORS : [];
					let count = 0;
					const branches = errors === NOERRORS ? null : [];
					const pl0 = collect ? pLen(rec) : 0, n00 = collect ? rec.n : 0, xl0 = collect ? xLen(rec) : 0;
					for (let i = 0; i < fns.length; i++) {
						const mark = branches === null ? 0 : scratch.length;
						let ok;
						if (collect) {
							const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
							ok = fns[i].c(data, scratch, instancePath, schemaPath + "/oneOf/" + i, stack, rec);
							if (ok) count++;
							else undo(rec, pl, n0, xl);
						} else {
							ok = fns[i].c(data, scratch, instancePath, schemaPath + "/oneOf/" + i, stack);
							if (ok) count++;
						}
						if (branches !== null) branches.push({
							valid: ok,
							errors: scratch.slice(mark),
							title: titles[i]
						});
					}
					if (count !== 1) {
						if (collect) undo(rec, pl0, n00, xl0);
						if (branches !== null) {
							const collapsed = collapseBranches({
								keyword: "oneOf",
								branchResults: branches,
								parentPath: instancePath,
								parentSchemaPath: schemaPath + "/oneOf"
							});
							if (collapsed !== null) errors.push(collapsed);
						}
						return false;
					}
					return true;
				});
				if (collect) vsteps.push((data, stack, rec) => {
					let count = 0;
					for (let i = 0; i < fns.length; i++) {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						if (fns[i].v(data, stack, rec)) {
							count++;
							if (count > 1) return false;
						} else undo(rec, pl, n0, xl);
					}
					return count === 1;
				});
				else vsteps.push((data, stack) => {
					let count = 0;
					for (let i = 0; i < fns.length; i++) if (fns[i].v(data, stack)) {
						count++;
						if (count > 1) return false;
					}
					return count === 1;
				});
			}
			if (P.not !== void 0) {
				const fn = child(P.not);
				steps.push((data, errors, instancePath, schemaPath, stack) => {
					if (fn.v(data, stack)) {
						if (errors !== NOERRORS) errors.push(err("not", "not", instancePath, schemaPath + "/not", {}, "must NOT be valid"));
						return false;
					}
					return true;
				});
				vsteps.push((data, stack) => !fn.v(data, stack));
			}
			if (P.if !== void 0) {
				const ifFn = inPlace(P.if, base);
				const thenFn = P.then !== void 0 ? inPlace(P.then, base) : null;
				const elseFn = P.else !== void 0 ? inPlace(P.else, base) : null;
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					let pl = collect ? pLen(rec) : 0, n0 = collect ? rec.n : 0, xl = collect ? xLen(rec) : 0;
					let ok;
					if (ifFn.v(data, stack, rec)) {
						if (thenFn === null) return true;
						if (collect) {
							pl = pLen(rec);
							n0 = rec.n;
							xl = xLen(rec);
						}
						ok = thenFn.c(data, errors, instancePath, schemaPath + "/then", stack, rec);
					} else {
						if (collect) undo(rec, pl, n0, xl);
						if (elseFn === null) return true;
						ok = elseFn.c(data, errors, instancePath, schemaPath + "/else", stack, rec);
					}
					if (!ok && collect) undo(rec, pl, n0, xl);
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					const pl = collect ? pLen(rec) : 0, n0 = collect ? rec.n : 0, xl = collect ? xLen(rec) : 0;
					if (ifFn.v(data, stack, rec)) {
						if (thenFn !== null) return thenFn.v(data, stack, rec);
						return true;
					}
					if (collect) undo(rec, pl, n0, xl);
					if (elseFn !== null) return elseFn.v(data, stack, rec);
					return true;
				});
			}
			if (P.unevaluatedProperties !== void 0) {
				const fn = child(P.unevaluatedProperties);
				if (fn === FALSE_PAIR) steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					const keys = keysOf(rec, data);
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						if (hasProp(rec, key)) continue;
						ok = false;
						if (errors === NOERRORS) return false;
						errors.push(err("unevaluatedProperties", "unevaluatedProperties", instancePath, schemaPath + "/unevaluatedProperties", { unevaluatedProperty: key }, "must NOT have unevaluated properties"));
						addProp(rec, key);
					}
					return ok;
				});
				else steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					const keys = keysOf(rec, data);
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						if (hasProp(rec, key)) continue;
						if (!(fn.leaf && fn.v(data[key], stack) || fn.c(data[key], errors, instancePath + "/" + escapePointer(key), schemaPath + "/unevaluatedProperties", stack))) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
						addProp(rec, key);
					}
					return ok;
				});
				if (fn === FALSE_PAIR) vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					const keys = keysOf(rec, data);
					if (keys.length === 0) return true;
					if (rec.props === null) return false;
					for (let k = 0; k < keys.length; k++) if (!hasProp(rec, keys[k])) return false;
					return true;
				});
				else vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					const keys = keysOf(rec, data);
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						if (hasProp(rec, key)) continue;
						if (!fn.v(data[key], stack)) return false;
						addProp(rec, key);
					}
					return true;
				});
			}
			if (P.unevaluatedItems !== void 0) {
				const fn = child(P.unevaluatedItems);
				if (fn === FALSE_PAIR) steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					for (let i = 0; i < data.length; i++) {
						if (hasItem(rec, i)) continue;
						if (errors !== NOERRORS) errors.push(err("unevaluatedItems", "unevaluatedItems", instancePath, schemaPath + "/unevaluatedItems", { limit: i }, "must NOT have more than " + i + " items"));
						if (data.length > rec.n) rec.n = data.length;
						return false;
					}
					if (data.length > rec.n) rec.n = data.length;
					return true;
				});
				else steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let ok = true;
					for (let i = 0; i < data.length; i++) {
						if (hasItem(rec, i)) continue;
						if (!(fn.leaf && fn.v(data[i], stack) || fn.c(data[i], errors, instancePath + "/" + i, schemaPath + "/unevaluatedItems", stack))) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
					}
					if (data.length > rec.n) rec.n = data.length;
					return ok;
				});
				if (fn === FALSE_PAIR) vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					for (let i = rec.n; i < data.length; i++) if (!hasItem(rec, i)) return false;
					return true;
				});
				else vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					for (let i = 0; i < data.length; i++) {
						if (hasItem(rec, i)) continue;
						if (!fn.v(data[i], stack)) return false;
					}
					if (data.length > rec.n) rec.n = data.length;
					return true;
				});
			}
			let cfn;
			if (steps.length === 0) cfn = TRUE_FN;
			else if (steps.length === 1) cfn = steps[0];
			else {
				const arr = steps;
				cfn = (d, e, ip, sp, st, rec) => {
					let ok = true;
					for (let i = 0; i < arr.length; i++) if (!arr[i](d, e, ip, sp, st, rec)) {
						if (e === NOERRORS) return false;
						ok = false;
					}
					return ok;
				};
			}
			let vfn;
			if (vsteps.length === 0) vfn = TRUE_FN;
			else if (vsteps.length === 1) vfn = vsteps[0];
			else if (vsteps.length === 2) {
				const [a, b] = vsteps;
				vfn = (d, st, rec) => a(d, st, rec) && b(d, st, rec);
			} else {
				const arr = vsteps;
				vfn = (d, st, rec) => {
					for (let i = 0; i < arr.length; i++) if (!arr[i](d, st, rec)) return false;
					return true;
				};
			}
			if (P.hasUnevaluated) {
				const inner = cfn;
				const innerV = vfn;
				if (ann) {
					cfn = (d, e, ip, sp, st, rec) => {
						const own = fresh();
						const ok = inner(d, e, ip, sp, st, own);
						if (ok) mergeRec(rec, own);
						return ok;
					};
					vfn = (d, st, rec) => {
						const own = fresh();
						const ok = innerV(d, st, own);
						if (ok) mergeRec(rec, own);
						return ok;
					};
				} else {
					cfn = (d, e, ip, sp, st) => inner(d, e, ip, sp, st, fresh());
					vfn = (d, st) => innerV(d, st, fresh());
				}
			}
			box.c = cfn;
			box.v = vfn;
			pair.c = cfn;
			pair.v = vfn;
			pair.leaf = !nested;
			pair.open = false;
			return pair;
		}
		function compileInterpreter(interp) {
			const root = interp.rootNode;
			const base = interp.state.rootBase;
			let ctx = {
				interp,
				memo: /* @__PURE__ */ new Map(),
				guard: true,
				cyclic: false
			};
			let pair = compileNode(ctx, root, base, [base], false);
			if (!ctx.cyclic) {
				ctx = {
					interp,
					memo: /* @__PURE__ */ new Map(),
					guard: false,
					cyclic: false
				};
				pair = compileNode(ctx, root, base, [base], false);
			}
			return {
				v: pair.v,
				c: pair.c,
				cyclic: ctx.guard
			};
		}
		return { compileInterpreter };
	}
	module.exports = { install };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/interpreter.js
var require_interpreter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { collapseBranches } = require_branch_collapse();
	const { compileSafe } = require_safe_regex();
	const SCHEMA_KEYWORDS = {
		single: [
			"additionalProperties",
			"contains",
			"propertyNames",
			"if",
			"then",
			"else",
			"not",
			"items",
			"unevaluatedItems",
			"unevaluatedProperties"
		],
		maps: [
			"$defs",
			"definitions",
			"properties",
			"patternProperties",
			"dependentSchemas"
		],
		lists: [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]
	};
	const FALLBACK_BASE = "ata://root";
	function resolveUri(base, ref) {
		try {
			return new URL(ref, base || FALLBACK_BASE).href;
		} catch {
			return ref;
		}
	}
	function splitFragment(uri) {
		const hash = uri.indexOf("#");
		if (hash < 0) return [uri, ""];
		return [uri.slice(0, hash), decodeURIComponent(uri.slice(hash + 1))];
	}
	function indexSchemas(rootSchema, schemaMap) {
		const state = {
			resources: /* @__PURE__ */ new Map(),
			anchors: /* @__PURE__ */ new Map(),
			dynamicAnchors: /* @__PURE__ */ new Map(),
			nodeBase: /* @__PURE__ */ new Map(),
			rootBase: FALLBACK_BASE
		};
		const rootBase = typeof rootSchema === "object" && rootSchema !== null && typeof rootSchema.$id === "string" ? resolveUri(FALLBACK_BASE, splitFragment(rootSchema.$id)[0]) : FALLBACK_BASE;
		state.rootBase = rootBase;
		indexResource(rootSchema, rootBase, state);
		if (schemaMap) for (const [id, schema] of schemaMap) {
			const base = resolveUri(FALLBACK_BASE, splitFragment(id)[0]);
			if (!state.resources.has(base)) indexResource(schema, base, state);
			if (!state.resources.has(id)) state.resources.set(id, schema);
		}
		return state;
	}
	function indexResource(node, baseUri, state) {
		if (typeof node !== "object" || node === null) return;
		if (!state.resources.has(baseUri)) state.resources.set(baseUri, node);
		if (!state.anchors.has(baseUri)) state.anchors.set(baseUri, /* @__PURE__ */ new Map());
		if (!state.dynamicAnchors.has(baseUri)) state.dynamicAnchors.set(baseUri, /* @__PURE__ */ new Map());
		walkSchema(node, baseUri, state, true);
	}
	function walkSchema(node, baseUri, state, isResourceRoot) {
		if (typeof node !== "object" || node === null) return;
		if (state.nodeBase.has(node)) return;
		state.nodeBase.set(node, baseUri);
		if (!isResourceRoot && typeof node.$id === "string") {
			const newBase = splitFragment(resolveUri(baseUri, node.$id))[0];
			state.nodeBase.delete(node);
			indexResource(node, newBase, state);
			return;
		}
		if (typeof node.$anchor === "string") state.anchors.get(baseUri).set(node.$anchor, node);
		if (typeof node.$dynamicAnchor === "string") {
			state.dynamicAnchors.get(baseUri).set(node.$dynamicAnchor, node);
			state.anchors.get(baseUri).set(node.$dynamicAnchor, node);
		}
		for (const kw of SCHEMA_KEYWORDS.single) if (node[kw] !== void 0) walkSchema(node[kw], baseUri, state, false);
		for (const kw of SCHEMA_KEYWORDS.maps) {
			const map = node[kw];
			if (map && typeof map === "object" && !Array.isArray(map)) for (const key of Object.keys(map)) walkSchema(map[key], baseUri, state, false);
		}
		for (const kw of SCHEMA_KEYWORDS.lists) {
			const list = node[kw];
			if (Array.isArray(list)) for (const sub of list) walkSchema(sub, baseUri, state, false);
		}
		const propDeps = node.propertyDependencies;
		if (propDeps && typeof propDeps === "object" && !Array.isArray(propDeps)) {
			for (const choices of Object.values(propDeps)) if (choices && typeof choices === "object" && !Array.isArray(choices)) for (const sub of Object.values(choices)) walkSchema(sub, baseUri, state, false);
		}
	}
	function walkPointer(root, pointer) {
		if (pointer === "" || pointer === "/") return root;
		const parts = pointer.split("/").slice(1).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let node = root;
		for (const part of parts) {
			if (node === null || typeof node !== "object") return void 0;
			if (Array.isArray(node)) node = node[Number(part)];
			else if (part in node) node = node[part];
			else if (part === "definitions" && node.$defs) node = node.$defs;
			else if (part === "$defs" && node.definitions) node = node.definitions;
			else if (part === "items" && Array.isArray(node.prefixItems)) node = node.prefixItems;
			else return;
		}
		return node;
	}
	function resolveRef(ref, fromBase, state) {
		const [uri, fragment] = splitFragment(resolveUri(fromBase, ref));
		let resource = state.resources.get(uri);
		let resourceBase = uri;
		if (resource === void 0 && (uri === FALLBACK_BASE || uri === "")) {
			resource = state.resources.get(state.rootBase);
			resourceBase = state.rootBase;
		}
		if (resource === void 0) {
			const [rawUri, rawFragment] = splitFragment(ref);
			if (state.resources.has(rawUri)) {
				resource = state.resources.get(rawUri);
				resourceBase = rawUri;
				if (rawFragment === "") return {
					node: resource,
					base: resourceBase
				};
				if (rawFragment.startsWith("/")) return {
					node: walkPointer(resource, rawFragment),
					base: resourceBase
				};
				const anchored = state.anchors.get(resourceBase);
				return {
					node: anchored ? anchored.get(rawFragment) : void 0,
					base: resourceBase
				};
			}
			return {
				node: void 0,
				base: resourceBase
			};
		}
		if (fragment === "") return {
			node: resource,
			base: resourceBase
		};
		if (fragment.startsWith("/")) {
			const node = walkPointer(resource, fragment);
			return {
				node,
				base: node !== null && typeof node === "object" && state.nodeBase.has(node) ? state.nodeBase.get(node) : resourceBase
			};
		}
		const anchored = state.anchors.get(resourceBase);
		return {
			node: anchored ? anchored.get(fragment) : void 0,
			base: resourceBase
		};
	}
	const { allDistinct, duplicatePair, _deq } = require_unique_items();
	function enumMember(P, data) {
		if (data === null || typeof data !== "object") return P.enumPrims.has(data);
		const objs = P.enumObjs;
		for (let i = 0; i < objs.length; i++) if (deepEqual(objs[i], data)) return true;
		return false;
	}
	const deepEqual = _deq;
	function codePointLength(s) {
		let n = 0;
		for (let i = 0; i < s.length; i++) {
			if (s.charCodeAt(i) - 55296 >>> 0 < 1024 && i + 1 < s.length) i++;
			n++;
		}
		return n;
	}
	function cpAtLeast(s, min) {
		if (s.length >= 2 * min) return true;
		if (s.length < min) return false;
		return codePointLength(s) >= min;
	}
	function cpAtMost(s, max) {
		if (s.length <= max) return true;
		if (s.length > 2 * max + 1) return false;
		return codePointLength(s) <= max;
	}
	function multipleOfOk(d, m) {
		if (m === 0) return false;
		const q = d / m;
		if (Number.isInteger(q)) return true;
		return Math.abs(q - Math.round(q)) < 1e-9;
	}
	const _formats = require_formats();
	const FORMAT_CHECKS = {
		email: _formats.email,
		date: _formats.date,
		"date-time": _formats.dateTime,
		time: _formats.time,
		duration: _formats.duration,
		uuid: _formats.uuid,
		uri: _formats.uri,
		"uri-reference": _formats.uriReference,
		ipv4: _formats.ipv4,
		ipv6: _formats.ipv6,
		hostname: _formats.hostname,
		regex: (s) => {
			try {
				new RegExp(s, "u");
				return true;
			} catch {
				return false;
			}
		},
		"json-pointer": _formats.jsonPointer,
		"relative-json-pointer": _formats.relativeJsonPointer,
		"uri-template": _formats.uriTemplate,
		iri: _formats.iri,
		"iri-reference": _formats.iriReference,
		"idn-email": _formats.idnEmail
	};
	const DISCARD = {
		props: null,
		items: null
	};
	const NOERRORS = Object.freeze([]);
	function mergeAnnotations(target, from) {
		if (from.props && from.props.size) {
			if (!target.props) target.props = /* @__PURE__ */ new Set();
			for (const p of from.props) target.props.add(p);
		}
		if (from.items && from.items.size) {
			if (!target.items) target.items = /* @__PURE__ */ new Set();
			for (const i of from.items) target.items.add(i);
		}
	}
	const T_STRING = 1;
	const T_NUMBER = 2;
	const T_INTEGER = 4;
	const T_BOOLEAN = 8;
	const T_NULL = 16;
	const T_OBJECT = 32;
	const T_ARRAY = 64;
	const T_ANY = 127;
	function typeBit(name) {
		switch (name) {
			case "string": return T_STRING;
			case "number": return T_NUMBER;
			case "integer": return T_INTEGER;
			case "boolean": return T_BOOLEAN;
			case "null": return T_NULL;
			case "object": return T_OBJECT;
			case "array": return T_ARRAY;
			default: return T_ANY;
		}
	}
	function dataBits(d) {
		switch (typeof d) {
			case "string": return T_STRING;
			case "number":
				if (!isFinite(d)) return 0;
				return Number.isInteger(d) ? 6 : T_NUMBER;
			case "boolean": return T_BOOLEAN;
			case "object":
				if (d === null) return T_NULL;
				return Array.isArray(d) ? T_ARRAY : T_OBJECT;
			default: return 0;
		}
	}
	function isObjectMap(v) {
		return v !== null && typeof v === "object" && !Array.isArray(v);
	}
	var Plan = class {
		constructor(schema) {
			this.schema = schema;
		}
		link(interp) {
			const schema = this.schema;
			const child = (sub) => interp.node(sub);
			this.refCache = null;
			this.refBase0 = void 0;
			this.refRes0 = null;
			this.dynCache = null;
			this.ref = typeof schema.$ref === "string" ? schema.$ref : null;
			this.dynamicRef = typeof schema.$dynamicRef === "string" ? schema.$dynamicRef : null;
			this.tracked = this.ref !== null || this.dynamicRef !== null;
			this.typeMask = 0;
			this.typeNames = null;
			if (schema.type !== void 0) {
				const types = Array.isArray(schema.type) ? schema.type : [schema.type];
				let mask = 0;
				for (const t of types) mask |= typeBit(t);
				this.typeMask = mask;
				this.typeNames = types;
			}
			this.hasType = schema.type !== void 0;
			this.enum = schema.enum !== void 0 ? schema.enum : null;
			this.enumPrims = null;
			this.enumObjs = null;
			if (Array.isArray(this.enum)) {
				this.enumPrims = /* @__PURE__ */ new Set();
				this.enumObjs = [];
				for (const v of this.enum) if (v !== null && typeof v === "object") this.enumObjs.push(v);
				else if (!(typeof v === "number" && v !== v)) this.enumPrims.add(v);
			}
			this.hasConst = schema.const !== void 0;
			this.const = schema.const;
			this.minimum = typeof schema.minimum === "number" ? schema.minimum : void 0;
			this.maximum = typeof schema.maximum === "number" ? schema.maximum : void 0;
			this.exclusiveMinimum = typeof schema.exclusiveMinimum === "number" ? schema.exclusiveMinimum : void 0;
			this.exclusiveMaximum = typeof schema.exclusiveMaximum === "number" ? schema.exclusiveMaximum : void 0;
			this.multipleOf = typeof schema.multipleOf === "number" ? schema.multipleOf : void 0;
			this.hasNumber = this.minimum !== void 0 || this.maximum !== void 0 || this.exclusiveMinimum !== void 0 || this.exclusiveMaximum !== void 0 || this.multipleOf !== void 0;
			this.minLength = schema.minLength;
			this.maxLength = schema.maxLength;
			this.pattern = schema.pattern !== void 0 ? interp.pattern(schema.pattern) : null;
			this.patternSource = schema.pattern;
			this.format = schema.format;
			this.formatFn = null;
			if (schema.format !== void 0) {
				const uf = interp.userFormats;
				const fc = uf && typeof uf[schema.format] === "function" ? uf[schema.format] : FORMAT_CHECKS[schema.format];
				this.formatFn = fc || null;
			}
			this.hasString = this.minLength !== void 0 || this.maxLength !== void 0 || this.pattern !== null || this.formatFn !== null;
			this.minItems = schema.minItems;
			this.maxItems = schema.maxItems;
			this.uniqueItems = schema.uniqueItems === true;
			this.prefixItems = Array.isArray(schema.prefixItems) ? schema.prefixItems.map(child) : null;
			this.items = schema.items !== void 0 ? child(schema.items) : void 0;
			this.contains = schema.contains !== void 0 ? child(schema.contains) : void 0;
			this.minContains = schema.minContains;
			this.maxContains = schema.maxContains;
			this.hasArray = this.minItems !== void 0 || this.maxItems !== void 0 || this.uniqueItems || this.prefixItems !== null || this.items !== void 0 || this.contains !== void 0;
			this.required = Array.isArray(schema.required) ? schema.required : null;
			this.minProperties = schema.minProperties;
			this.maxProperties = schema.maxProperties;
			this.dependentRequired = isObjectMap(schema.dependentRequired) ? Object.entries(schema.dependentRequired) : null;
			this.propertyNames = schema.propertyNames !== void 0 ? child(schema.propertyNames) : void 0;
			this.properties = null;
			if (isObjectMap(schema.properties)) {
				this.properties = /* @__PURE__ */ new Map();
				for (const key of Object.keys(schema.properties)) {
					const ek = escapePointer(key);
					this.properties.set(key, {
						node: child(schema.properties[key]),
						seg: "/" + ek,
						schemaSeg: "/properties/" + ek
					});
				}
			}
			this.patternProperties = null;
			if (isObjectMap(schema.patternProperties)) this.patternProperties = Object.keys(schema.patternProperties).map((src) => ({
				src,
				re: interp.pattern(src),
				node: child(schema.patternProperties[src])
			}));
			this.additionalProperties = schema.additionalProperties !== void 0 ? child(schema.additionalProperties) : void 0;
			this.dependentSchemas = isObjectMap(schema.dependentSchemas) ? Object.entries(schema.dependentSchemas).map(([k, v]) => [k, child(v)]) : null;
			this.propertyDependencies = null;
			if (isObjectMap(schema.propertyDependencies)) this.propertyDependencies = Object.entries(schema.propertyDependencies).filter(([, choices]) => isObjectMap(choices)).map(([k, choices]) => [k, new Map(Object.keys(choices).map((v) => [v, child(choices[v])]))]);
			this.hasObject = this.required !== null || this.minProperties !== void 0 || this.maxProperties !== void 0 || this.dependentRequired !== null || this.propertyNames !== void 0 || this.properties !== null || this.patternProperties !== null || this.additionalProperties !== void 0 || this.dependentSchemas !== null || this.propertyDependencies !== null;
			this.allOf = Array.isArray(schema.allOf) ? schema.allOf.map(child) : null;
			this.anyOf = Array.isArray(schema.anyOf) ? schema.anyOf.map(child) : null;
			this.oneOf = Array.isArray(schema.oneOf) ? schema.oneOf.map(child) : null;
			this.not = schema.not !== void 0 ? child(schema.not) : void 0;
			this.if = schema.if !== void 0 ? child(schema.if) : void 0;
			this.then = schema.then !== void 0 ? child(schema.then) : void 0;
			this.else = schema.else !== void 0 ? child(schema.else) : void 0;
			this.macros = null;
			if (interp.keywords !== null) for (const key of Object.keys(schema)) {
				const def = interp.keywords[key];
				if (def === void 0 || def.macro === null) continue;
				const expanded = def.macro(schema[key], schema);
				if (expanded === void 0) continue;
				if (this.macros === null) this.macros = [];
				this.macros.push({
					keyword: key,
					node: child(expanded)
				});
			}
			this.hasApplicators = this.allOf !== null || this.anyOf !== null || this.oneOf !== null || this.not !== void 0 || this.if !== void 0 || this.macros !== null;
			this.unevaluatedProperties = schema.unevaluatedProperties !== void 0 ? child(schema.unevaluatedProperties) : void 0;
			this.unevaluatedItems = schema.unevaluatedItems !== void 0 ? child(schema.unevaluatedItems) : void 0;
			this.unevaluatedPropertiesFalse = schema.unevaluatedProperties === false;
			this.unevaluatedItemsFalse = schema.unevaluatedItems === false;
			this.hasUnevaluated = this.unevaluatedProperties !== void 0 || this.unevaluatedItems !== void 0;
			this.custom = null;
			if (interp.keywords !== null) for (const key of Object.keys(schema)) {
				const def = interp.keywords[key];
				if (def === void 0 || def.macro !== null) continue;
				const value = schema[key];
				let mask = T_ANY;
				if (def.types !== null) {
					mask = 0;
					for (const t of def.types) mask |= typeBit(t);
				}
				let fn;
				if (def.compile !== null) {
					fn = def.compile(value, schema);
					if (typeof fn !== "function") throw new Error(`keyword "${key}": compile must return a function`);
				} else {
					const validate = def.validate;
					fn = (data) => validate(value, data, schema);
					fn.source = validate;
				}
				if (this.custom === null) this.custom = [];
				this.custom.push({
					keyword: key,
					fn,
					mask
				});
			}
			this.hasCustom = this.custom !== null;
			const nodeBase = interp.state.nodeBase.get(schema);
			this.nodeBase = nodeBase !== void 0 ? nodeBase : null;
			this.isResourceRoot = nodeBase !== void 0 && interp.state.resources.get(nodeBase) === schema;
			this.leaf = !this.tracked && !this.hasApplicators && !this.hasUnevaluated && this.properties === null && this.patternProperties === null && this.additionalProperties === void 0 && this.propertyNames === void 0 && this.dependentSchemas === null && this.propertyDependencies === null && this.prefixItems === null && this.items === void 0 && this.contains === void 0 && this.nodeBase === null;
		}
	};
	function evalLeafV(P, data) {
		const bits = dataBits(data);
		if (P.hasType && (bits & P.typeMask) === 0) return false;
		if (P.enum !== null) {
			if (!enumMember(P, data)) return false;
		}
		if (P.hasConst && !deepEqual(P.const, data)) return false;
		if (P.hasNumber && Number.isFinite(data)) {
			if (P.minimum !== void 0 && !(data >= P.minimum)) return false;
			if (P.maximum !== void 0 && !(data <= P.maximum)) return false;
			if (P.exclusiveMinimum !== void 0 && !(data > P.exclusiveMinimum)) return false;
			if (P.exclusiveMaximum !== void 0 && !(data < P.exclusiveMaximum)) return false;
			if (P.multipleOf !== void 0 && !multipleOfOk(data, P.multipleOf)) return false;
		}
		if (P.hasString && bits === T_STRING) {
			if (P.minLength !== void 0 && !cpAtLeast(data, P.minLength)) return false;
			if (P.maxLength !== void 0 && !cpAtMost(data, P.maxLength)) return false;
			if (P.pattern !== null && !P.pattern.test(data)) return false;
			if (P.formatFn !== null && !P.formatFn(data)) return false;
		}
		if (P.hasArray && bits === T_ARRAY) {
			if (P.minItems !== void 0 && data.length < P.minItems) return false;
			if (P.maxItems !== void 0 && data.length > P.maxItems) return false;
			if (P.uniqueItems && !allDistinct(data)) return false;
		}
		if (P.hasObject && bits === T_OBJECT) {
			if (P.required !== null) {
				const req = P.required;
				for (let i = 0; i < req.length; i++) if (!Object.hasOwn(data, req[i])) return false;
			}
			if (P.minProperties !== void 0 && Object.keys(data).length < P.minProperties) return false;
			if (P.maxProperties !== void 0 && Object.keys(data).length > P.maxProperties) return false;
			if (P.dependentRequired !== null) {
				for (const [key, deps] of P.dependentRequired) if (Object.hasOwn(data, key)) {
					for (const dep of deps) if (!Object.hasOwn(data, dep)) return false;
				}
			}
		}
		if (P.hasCustom && !runCustomV(P, data, bits)) return false;
		return true;
	}
	function runCustomV(P, data, bits) {
		const ops = P.custom;
		for (let i = 0; i < ops.length; i++) {
			const op = ops[i];
			if ((bits & op.mask) === 0) continue;
			const fn = op.fn;
			const ok = fn(data);
			const holder = fn.source || fn;
			if (holder.errors) holder.errors = null;
			if (!ok) return false;
		}
		return true;
	}
	function runCustom(P, data, bits, errors, instancePath, schemaPath) {
		const ops = P.custom;
		let valid = true;
		for (let i = 0; i < ops.length; i++) {
			const op = ops[i];
			if ((bits & op.mask) === 0) continue;
			const fn = op.fn;
			const ok = fn(data);
			const holder = fn.source || fn;
			const own = holder.errors;
			if (own) holder.errors = null;
			if (ok) continue;
			valid = false;
			if (errors === NOERRORS) return false;
			const kwPath = schemaPath + "/" + op.keyword;
			if (Array.isArray(own) && own.length > 0) for (let j = 0; j < own.length; j++) {
				const e = own[j];
				errors.push(err(op.keyword, e.keyword || op.keyword, e.instancePath !== void 0 ? instancePath + e.instancePath : instancePath, e.schemaPath !== void 0 ? e.schemaPath : kwPath, e.params !== void 0 ? e.params : {}, e.message !== void 0 ? e.message : `must pass "${op.keyword}" keyword validation`));
			}
			else errors.push(err(op.keyword, op.keyword, instancePath, kwPath, { keyword: op.keyword }, `must pass "${op.keyword}" keyword validation`));
		}
		return valid;
	}
	function evalLeaf(P, data, errors, instancePath, schemaPath) {
		let valid = true;
		const schema = P.schema;
		const bits = dataBits(data);
		if (P.hasType && (bits & P.typeMask) === 0) {
			if (errors !== NOERRORS) errors.push(err("type", "type", instancePath, schemaPath + "/type", { type: schema.type }, `must be ${P.typeNames.join(", ")}`));
			valid = false;
		}
		if (P.enum !== null) {
			if (!enumMember(P, data)) {
				if (errors !== NOERRORS) errors.push(err("enum", "enum", instancePath, schemaPath + "/enum", { allowedValues: P.enum }, "must be equal to one of the allowed values"));
				valid = false;
			}
		}
		if (P.hasConst && !deepEqual(P.const, data)) {
			if (errors !== NOERRORS) errors.push(err("const", "const", instancePath, schemaPath + "/const", { allowedValue: P.const }, "must be equal to constant"));
			valid = false;
		}
		if (P.hasNumber && Number.isFinite(data)) {
			if (P.minimum !== void 0 && !(data >= P.minimum)) {
				errors === NOERRORS || errors.push(err("minimum", "minimum", instancePath, schemaPath + "/minimum", {
					comparison: ">=",
					limit: P.minimum
				}, `must be >= ${P.minimum}`));
				valid = false;
			}
			if (P.maximum !== void 0 && !(data <= P.maximum)) {
				errors === NOERRORS || errors.push(err("maximum", "maximum", instancePath, schemaPath + "/maximum", {
					comparison: "<=",
					limit: P.maximum
				}, `must be <= ${P.maximum}`));
				valid = false;
			}
			if (P.exclusiveMinimum !== void 0 && !(data > P.exclusiveMinimum)) {
				errors === NOERRORS || errors.push(err("exclusiveMinimum", "exclusiveMinimum", instancePath, schemaPath + "/exclusiveMinimum", {
					comparison: ">",
					limit: P.exclusiveMinimum
				}, `must be > ${P.exclusiveMinimum}`));
				valid = false;
			}
			if (P.exclusiveMaximum !== void 0 && !(data < P.exclusiveMaximum)) {
				errors === NOERRORS || errors.push(err("exclusiveMaximum", "exclusiveMaximum", instancePath, schemaPath + "/exclusiveMaximum", {
					comparison: "<",
					limit: P.exclusiveMaximum
				}, `must be < ${P.exclusiveMaximum}`));
				valid = false;
			}
			if (P.multipleOf !== void 0 && !multipleOfOk(data, P.multipleOf)) {
				errors === NOERRORS || errors.push(err("multipleOf", "multipleOf", instancePath, schemaPath + "/multipleOf", { multipleOf: P.multipleOf }, `must be multiple of ${P.multipleOf}`));
				valid = false;
			}
		}
		if (P.hasString && bits === T_STRING) {
			if (P.minLength !== void 0 && !cpAtLeast(data, P.minLength)) {
				errors === NOERRORS || errors.push(err("minLength", "minLength", instancePath, schemaPath + "/minLength", { limit: P.minLength }, `must NOT have fewer than ${P.minLength} characters`));
				valid = false;
			}
			if (P.maxLength !== void 0 && !cpAtMost(data, P.maxLength)) {
				errors === NOERRORS || errors.push(err("maxLength", "maxLength", instancePath, schemaPath + "/maxLength", { limit: P.maxLength }, `must NOT have more than ${P.maxLength} characters`));
				valid = false;
			}
			if (P.pattern !== null && !P.pattern.test(data)) {
				errors === NOERRORS || errors.push(err("pattern", "pattern", instancePath, schemaPath + "/pattern", { pattern: P.patternSource }, `must match pattern "${P.patternSource}"`));
				valid = false;
			}
			if (P.formatFn !== null && !P.formatFn(data)) {
				errors === NOERRORS || errors.push(err("format", "format", instancePath, schemaPath + "/format", { format: P.format }, `must match format "${P.format}"`));
				valid = false;
			}
		}
		if (P.hasArray && bits === T_ARRAY) {
			if (P.minItems !== void 0 && data.length < P.minItems) {
				errors === NOERRORS || errors.push(err("minItems", "minItems", instancePath, schemaPath + "/minItems", { limit: P.minItems }, `must NOT have fewer than ${P.minItems} items`));
				valid = false;
			}
			if (P.maxItems !== void 0 && data.length > P.maxItems) {
				errors === NOERRORS || errors.push(err("maxItems", "maxItems", instancePath, schemaPath + "/maxItems", { limit: P.maxItems }, `must NOT have more than ${P.maxItems} items`));
				valid = false;
			}
			if (P.uniqueItems) {
				const pair = duplicatePair(data);
				if (pair !== null) {
					const i = pair[0], j = pair[1];
					if (errors !== NOERRORS) errors.push(err("uniqueItems", "uniqueItems", instancePath, schemaPath + "/uniqueItems", {
						i,
						j
					}, `must NOT have duplicate items (items ## ${j} and ${i} are identical)`));
					valid = false;
				}
			}
		}
		if (P.hasObject && bits === T_OBJECT) {
			const keys = Object.keys(data);
			if (P.required !== null) {
				const req = P.required;
				for (let i = 0; i < req.length; i++) {
					const key = req[i];
					if (!Object.hasOwn(data, key)) {
						errors === NOERRORS || errors.push(err("required", "required", instancePath, schemaPath + "/required", { missingProperty: key }, `must have required property '${key}'`));
						valid = false;
					}
				}
			}
			if (P.minProperties !== void 0 && keys.length < P.minProperties) {
				errors === NOERRORS || errors.push(err("minProperties", "minProperties", instancePath, schemaPath + "/minProperties", { limit: P.minProperties }, `must NOT have fewer than ${P.minProperties} properties`));
				valid = false;
			}
			if (P.maxProperties !== void 0 && keys.length > P.maxProperties) {
				errors === NOERRORS || errors.push(err("maxProperties", "maxProperties", instancePath, schemaPath + "/maxProperties", { limit: P.maxProperties }, `must NOT have more than ${P.maxProperties} properties`));
				valid = false;
			}
			if (P.dependentRequired !== null) {
				for (const [key, deps] of P.dependentRequired) if (Object.hasOwn(data, key)) {
					for (const dep of deps) if (!Object.hasOwn(data, dep)) {
						errors === NOERRORS || errors.push(err("required", "required", instancePath, schemaPath + "/dependentRequired", { missingProperty: dep }, `must have required property '${dep}'`));
						valid = false;
					}
				}
			}
		}
		if (P.hasCustom && !runCustom(P, data, bits, errors, instancePath, schemaPath)) valid = false;
		return valid;
	}
	var Interpreter = class {
		constructor(rootSchema, options) {
			const opts = options || {};
			this.root = rootSchema;
			this.state = indexSchemas(rootSchema, opts.schemaMap);
			this.userFormats = opts.formats || null;
			this.keywords = opts.keywords || null;
			this.bookending = !opts.v1;
			this.patternCache = /* @__PURE__ */ new Map();
			this.plans = /* @__PURE__ */ new Map();
			this.rootNode = this.node(rootSchema);
			this._fast = void 0;
		}
		_fastRoot() {
			if (this._fast === void 0) try {
				this._fast = compileInterpreter(this);
			} catch {
				this._fast = null;
			}
			return this._fast;
		}
		pattern(src) {
			let re = this.patternCache.get(src);
			if (!re) {
				if (/\\[pP]\{/.test(src)) try {
					re = new RegExp(src, "u");
				} catch {
					re = new RegExp(src);
				}
				else try {
					re = compileSafe(src);
				} catch {
					try {
						re = new RegExp(src, "u");
					} catch {
						re = new RegExp(src);
					}
				}
				this.patternCache.set(src, re);
			}
			return re;
		}
		plan(schema) {
			let p = this.plans.get(schema);
			if (p === void 0) {
				p = new Plan(schema);
				this.plans.set(schema, p);
				p.link(this);
			}
			return p;
		}
		resolveRefCached(P, base) {
			if (P.refBase0 === base) return P.refRes0;
			let cache = P.refCache;
			let r = cache !== null ? cache.get(base) : void 0;
			if (r === void 0) {
				const raw = resolveRef(P.ref, base, this.state);
				r = {
					child: raw.node === void 0 ? void 0 : this.node(raw.node),
					base: raw.base
				};
				if (P.refBase0 === void 0) {
					P.refBase0 = base;
					P.refRes0 = r;
				} else {
					if (cache === null) cache = P.refCache = /* @__PURE__ */ new Map();
					cache.set(base, r);
				}
			}
			return r;
		}
		resolveDynamicRefCached(P, base) {
			let cache = P.dynCache;
			if (cache === null) cache = P.dynCache = /* @__PURE__ */ new Map();
			let r = cache.get(base);
			if (r === void 0) {
				const { node, base: refBase } = resolveRef(P.dynamicRef, base, this.state);
				const [, fragment] = splitFragment(resolveUri(base, P.dynamicRef));
				r = {
					node,
					base: refBase,
					fragment,
					byAnchor: Boolean(fragment) && !fragment.startsWith("/")
				};
				cache.set(base, r);
			}
			return r;
		}
		node(schema) {
			if (schema === true || schema === false) return schema;
			if (typeof schema !== "object" || schema === null) return true;
			return this.plan(schema);
		}
		isValid(data) {
			const fast = this._fastRoot();
			if (fast !== null) return fast.v(data, fast.cyclic ? [] : null);
			const dynScope = [this.state.rootBase];
			return this.eval(this.rootNode, data, this.state.rootBase, dynScope, NOERRORS, "", "#", [], DISCARD);
		}
		validate(data) {
			const fast = this._fastRoot();
			if (fast !== null) {
				const errors = [];
				return fast.c(data, errors, "", "#", fast.cyclic ? [] : null) ? {
					valid: true,
					data,
					errors: []
				} : {
					valid: false,
					errors
				};
			}
			const errors = [];
			const dynScope = [this.state.rootBase];
			return this.eval(this.rootNode, data, this.state.rootBase, dynScope, errors, "", "#", [], DISCARD) ? {
				valid: true,
				data,
				errors: []
			} : {
				valid: false,
				errors
			};
		}
		eval(P, data, base, dynScope, errors, instancePath, schemaPath, stack, sink) {
			if (P === true) return true;
			if (P === false) {
				if (errors !== NOERRORS) errors.push(err("false schema", "not", instancePath, schemaPath, {}, "boolean schema is false"));
				return false;
			}
			if (P.leaf) return evalLeaf(P, data, errors, instancePath, schemaPath);
			const schema = P.schema;
			const tracked = P.tracked;
			if (tracked) {
				for (let i = stack.length - 2; i >= 0; i -= 2) if (stack[i] === schema && stack[i + 1] === data) return true;
				stack.push(schema, data);
			}
			if (P.nodeBase !== null && P.nodeBase !== base) base = P.nodeBase;
			let scopePushed = false;
			if (dynScope[dynScope.length - 1] !== base) {
				dynScope.push(base);
				scopePushed = true;
			}
			let valid = true;
			const collect = sink !== DISCARD || P.hasUnevaluated;
			const local = collect ? {
				props: null,
				items: null
			} : DISCARD;
			if (P.ref !== null) {
				const { child, base: refBase } = this.resolveRefCached(P, base);
				if (child === void 0) {
					if (errors !== NOERRORS) errors.push(err("$ref", "$ref", instancePath, schemaPath + "/$ref", { ref: P.ref }, `cannot resolve $ref ${P.ref}`));
					valid = false;
				} else {
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					if (!this.eval(child, data, refBase, dynScope, errors, instancePath, schemaPath, stack, sub)) valid = false;
					else if (collect) mergeAnnotations(local, sub);
				}
			}
			if (P.dynamicRef !== null) {
				const ref = P.dynamicRef;
				const initial = this.resolveDynamicRefCached(P, base);
				let node = initial.node;
				let refBase = initial.base;
				const fragment = initial.fragment;
				if (initial.byAnchor) {
					const initialDyn = this.state.dynamicAnchors.get(refBase);
					if (node !== void 0 && initialDyn && initialDyn.get(fragment) === node || !this.bookending) for (const scopeBase of dynScope) {
						const dyn = this.state.dynamicAnchors.get(scopeBase);
						if (dyn && dyn.has(fragment)) {
							node = dyn.get(fragment);
							refBase = scopeBase;
							break;
						}
					}
				}
				if (node === void 0) {
					if (errors !== NOERRORS) errors.push(err("$dynamicRef", "$dynamicRef", instancePath, schemaPath + "/$dynamicRef", { ref }, `cannot resolve $dynamicRef ${ref}`));
					valid = false;
				} else {
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					if (!this.eval(this.node(node), data, refBase, dynScope, errors, instancePath, schemaPath, stack, sub)) valid = false;
					else if (collect) mergeAnnotations(local, sub);
				}
			}
			const bits = dataBits(data);
			if (P.hasType && (bits & P.typeMask) === 0) {
				if (errors !== NOERRORS) errors.push(err("type", "type", instancePath, schemaPath + "/type", { type: schema.type }, `must be ${P.typeNames.join(", ")}`));
				valid = false;
			}
			if (P.enum !== null) {
				if (!enumMember(P, data)) {
					if (errors !== NOERRORS) errors.push(err("enum", "enum", instancePath, schemaPath + "/enum", { allowedValues: P.enum }, "must be equal to one of the allowed values"));
					valid = false;
				}
			}
			if (P.hasConst && !deepEqual(P.const, data)) {
				if (errors !== NOERRORS) errors.push(err("const", "const", instancePath, schemaPath + "/const", { allowedValue: P.const }, "must be equal to constant"));
				valid = false;
			}
			if (P.hasNumber && Number.isFinite(data)) {
				if (P.minimum !== void 0 && !(data >= P.minimum)) {
					errors === NOERRORS || errors.push(err("minimum", "minimum", instancePath, schemaPath + "/minimum", {
						comparison: ">=",
						limit: P.minimum
					}, `must be >= ${P.minimum}`));
					valid = false;
				}
				if (P.maximum !== void 0 && !(data <= P.maximum)) {
					errors === NOERRORS || errors.push(err("maximum", "maximum", instancePath, schemaPath + "/maximum", {
						comparison: "<=",
						limit: P.maximum
					}, `must be <= ${P.maximum}`));
					valid = false;
				}
				if (P.exclusiveMinimum !== void 0 && !(data > P.exclusiveMinimum)) {
					errors === NOERRORS || errors.push(err("exclusiveMinimum", "exclusiveMinimum", instancePath, schemaPath + "/exclusiveMinimum", {
						comparison: ">",
						limit: P.exclusiveMinimum
					}, `must be > ${P.exclusiveMinimum}`));
					valid = false;
				}
				if (P.exclusiveMaximum !== void 0 && !(data < P.exclusiveMaximum)) {
					errors === NOERRORS || errors.push(err("exclusiveMaximum", "exclusiveMaximum", instancePath, schemaPath + "/exclusiveMaximum", {
						comparison: "<",
						limit: P.exclusiveMaximum
					}, `must be < ${P.exclusiveMaximum}`));
					valid = false;
				}
				if (P.multipleOf !== void 0 && !multipleOfOk(data, P.multipleOf)) {
					errors === NOERRORS || errors.push(err("multipleOf", "multipleOf", instancePath, schemaPath + "/multipleOf", { multipleOf: P.multipleOf }, `must be multiple of ${P.multipleOf}`));
					valid = false;
				}
			}
			if (P.hasString && bits === T_STRING) {
				if (P.minLength !== void 0 && !cpAtLeast(data, P.minLength)) {
					errors === NOERRORS || errors.push(err("minLength", "minLength", instancePath, schemaPath + "/minLength", { limit: P.minLength }, `must NOT have fewer than ${P.minLength} characters`));
					valid = false;
				}
				if (P.maxLength !== void 0 && !cpAtMost(data, P.maxLength)) {
					errors === NOERRORS || errors.push(err("maxLength", "maxLength", instancePath, schemaPath + "/maxLength", { limit: P.maxLength }, `must NOT have more than ${P.maxLength} characters`));
					valid = false;
				}
				if (P.pattern !== null && !P.pattern.test(data)) {
					errors === NOERRORS || errors.push(err("pattern", "pattern", instancePath, schemaPath + "/pattern", { pattern: P.patternSource }, `must match pattern "${P.patternSource}"`));
					valid = false;
				}
				if (P.formatFn !== null && !P.formatFn(data)) {
					errors === NOERRORS || errors.push(err("format", "format", instancePath, schemaPath + "/format", { format: P.format }, `must match format "${P.format}"`));
					valid = false;
				}
			}
			if (P.hasArray && bits === T_ARRAY) {
				if (P.minItems !== void 0 && data.length < P.minItems) {
					errors === NOERRORS || errors.push(err("minItems", "minItems", instancePath, schemaPath + "/minItems", { limit: P.minItems }, `must NOT have fewer than ${P.minItems} items`));
					valid = false;
				}
				if (P.maxItems !== void 0 && data.length > P.maxItems) {
					errors === NOERRORS || errors.push(err("maxItems", "maxItems", instancePath, schemaPath + "/maxItems", { limit: P.maxItems }, `must NOT have more than ${P.maxItems} items`));
					valid = false;
				}
				if (P.uniqueItems) {
					const pair = duplicatePair(data);
					if (pair !== null) {
						const i = pair[0], j = pair[1];
						if (errors !== NOERRORS) errors.push(err("uniqueItems", "uniqueItems", instancePath, schemaPath + "/uniqueItems", {
							i,
							j
						}, `must NOT have duplicate items (items ## ${j} and ${i} are identical)`));
						valid = false;
					}
				}
				const prefix = P.prefixItems;
				if (prefix !== null) {
					const n = Math.min(prefix.length, data.length);
					for (let i = 0; i < n; i++) {
						if (!this.eval(prefix[i], data[i], base, dynScope, errors, instancePath + "/" + i, schemaPath + "/prefixItems/" + i, stack, DISCARD)) valid = false;
						if (collect) {
							if (!local.items) local.items = /* @__PURE__ */ new Set();
							local.items.add(i);
						}
					}
				}
				if (P.items !== void 0) {
					const start = prefix !== null ? prefix.length : 0;
					for (let i = start; i < data.length; i++) {
						if (!this.eval(P.items, data[i], base, dynScope, errors, instancePath + "/" + i, schemaPath + "/items", stack, DISCARD)) valid = false;
						if (collect) {
							if (!local.items) local.items = /* @__PURE__ */ new Set();
							local.items.add(i);
						}
					}
				}
				if (P.contains !== void 0) {
					const matched = [];
					for (let i = 0; i < data.length; i++) {
						const scratch = errors === NOERRORS ? NOERRORS : [];
						if (this.eval(P.contains, data[i], base, dynScope, scratch, instancePath + "/" + i, schemaPath + "/contains", stack, DISCARD)) matched.push(i);
					}
					const minC = P.minContains !== void 0 ? P.minContains : 1;
					if (matched.length < minC) {
						errors === NOERRORS || errors.push(err("contains", "contains", instancePath, schemaPath + "/contains", { minContains: minC }, `must contain at least ${minC} valid item(s)`));
						valid = false;
					}
					if (P.maxContains !== void 0 && matched.length > P.maxContains) {
						errors === NOERRORS || errors.push(err("contains", "contains", instancePath, schemaPath + "/contains", {
							minContains: minC,
							maxContains: P.maxContains
						}, `must NOT contain more than ${P.maxContains} valid item(s)`));
						valid = false;
					}
					if (collect && matched.length) {
						if (!local.items) local.items = /* @__PURE__ */ new Set();
						for (const i of matched) local.items.add(i);
					}
				}
			}
			if (P.hasObject && bits === T_OBJECT) {
				const keys = Object.keys(data);
				if (P.required !== null) {
					const req = P.required;
					for (let i = 0; i < req.length; i++) {
						const key = req[i];
						if (!Object.hasOwn(data, key)) {
							errors === NOERRORS || errors.push(err("required", "required", instancePath, schemaPath + "/required", { missingProperty: key }, `must have required property '${key}'`));
							valid = false;
						}
					}
				}
				if (P.minProperties !== void 0 && keys.length < P.minProperties) {
					errors === NOERRORS || errors.push(err("minProperties", "minProperties", instancePath, schemaPath + "/minProperties", { limit: P.minProperties }, `must NOT have fewer than ${P.minProperties} properties`));
					valid = false;
				}
				if (P.maxProperties !== void 0 && keys.length > P.maxProperties) {
					errors === NOERRORS || errors.push(err("maxProperties", "maxProperties", instancePath, schemaPath + "/maxProperties", { limit: P.maxProperties }, `must NOT have more than ${P.maxProperties} properties`));
					valid = false;
				}
				if (P.dependentRequired !== null) {
					for (const [key, deps] of P.dependentRequired) if (Object.hasOwn(data, key)) {
						for (const dep of deps) if (!Object.hasOwn(data, dep)) {
							errors === NOERRORS || errors.push(err("required", "required", instancePath, schemaPath + "/dependentRequired", { missingProperty: dep }, `must have required property '${dep}'`));
							valid = false;
						}
					}
				}
				if (P.propertyNames !== void 0) {
					for (const key of keys) if (!this.eval(P.propertyNames, key, base, dynScope, errors, instancePath, schemaPath + "/propertyNames", stack, DISCARD)) valid = false;
				}
				const props = P.properties;
				const patterns = P.patternProperties;
				for (let k = 0; k < keys.length; k++) {
					const key = keys[k];
					let evaluated = false;
					const prop = props !== null ? props.get(key) : void 0;
					if (prop !== void 0) {
						if (!this.eval(prop.node, data[key], base, dynScope, errors, instancePath + prop.seg, schemaPath + prop.schemaSeg, stack, DISCARD)) valid = false;
						evaluated = true;
					}
					if (patterns !== null) for (let pi = 0; pi < patterns.length; pi++) {
						const pp = patterns[pi];
						if (pp.re.test(key)) {
							if (!this.eval(pp.node, data[key], base, dynScope, errors, instancePath + "/" + escapePointer(key), schemaPath + "/patternProperties/" + escapePointer(pp.src), stack, DISCARD)) valid = false;
							evaluated = true;
						}
					}
					if (!evaluated && P.additionalProperties !== void 0) {
						if (P.additionalProperties === false) {
							valid = false;
							if (errors !== NOERRORS) errors.push(err("additionalProperties", "additionalProperties", instancePath, schemaPath + "/additionalProperties", { additionalProperty: key }, "must NOT have additional properties"));
						} else if (!this.eval(P.additionalProperties, data[key], base, dynScope, errors, instancePath + "/" + escapePointer(key), schemaPath + "/additionalProperties", stack, DISCARD)) valid = false;
						evaluated = true;
					}
					if (evaluated && collect) {
						if (!local.props) local.props = /* @__PURE__ */ new Set();
						local.props.add(key);
					}
				}
				if (P.dependentSchemas !== null) {
					for (const [key, dep] of P.dependentSchemas) if (Object.hasOwn(data, key)) {
						const sub = collect ? {
							props: null,
							items: null
						} : DISCARD;
						if (!this.eval(dep, data, base, dynScope, errors, instancePath, schemaPath + "/dependentSchemas/" + escapePointer(key), stack, sub)) valid = false;
						else if (collect) mergeAnnotations(local, sub);
					}
				}
				if (P.propertyDependencies !== null) for (const [key, choices] of P.propertyDependencies) {
					if (!Object.hasOwn(data, key)) continue;
					const value = data[key];
					if (typeof value !== "string") continue;
					const choice = choices.get(value);
					if (choice === void 0) continue;
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					const branchPath = schemaPath + "/propertyDependencies/" + escapePointer(key) + "/" + escapePointer(value);
					if (!this.eval(choice, data, base, dynScope, errors, instancePath, branchPath, stack, sub)) valid = false;
					else if (collect) mergeAnnotations(local, sub);
				}
			}
			if (P.hasApplicators) {
				if (P.allOf !== null) for (let i = 0; i < P.allOf.length; i++) {
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					if (!this.eval(P.allOf[i], data, base, dynScope, errors, instancePath, schemaPath + "/allOf/" + i, stack, sub)) valid = false;
					else if (collect) mergeAnnotations(local, sub);
				}
				if (P.macros !== null) for (let i = 0; i < P.macros.length; i++) {
					const m = P.macros[i];
					const sp = schemaPath + "/" + m.keyword;
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					if (!this.eval(m.node, data, base, dynScope, errors, instancePath, sp, stack, sub)) {
						valid = false;
						if (errors !== NOERRORS) errors.push(err(m.keyword, m.keyword, instancePath, sp, { keyword: m.keyword }, `must pass "${m.keyword}" keyword validation`));
					} else if (collect) mergeAnnotations(local, sub);
				}
				if (P.anyOf !== null) {
					let any = false;
					const scratch = errors === NOERRORS ? NOERRORS : [];
					const branches = errors === NOERRORS ? null : [];
					for (let i = 0; i < P.anyOf.length; i++) {
						const sub = collect ? {
							props: null,
							items: null
						} : DISCARD;
						const mark = branches === null ? 0 : scratch.length;
						const ok = this.eval(P.anyOf[i], data, base, dynScope, scratch, instancePath, schemaPath + "/anyOf/" + i, stack, sub);
						if (branches !== null) branches.push({
							valid: ok,
							errors: scratch.slice(mark),
							title: branchTitle(P.anyOf[i])
						});
						if (ok) {
							any = true;
							if (collect) mergeAnnotations(local, sub);
						}
					}
					if (!any) {
						if (branches !== null) {
							const collapsed = collapseBranches({
								keyword: "anyOf",
								branchResults: branches,
								parentPath: instancePath,
								parentSchemaPath: schemaPath + "/anyOf"
							});
							if (collapsed !== null) errors.push(collapsed);
						}
						valid = false;
					}
				}
				if (P.oneOf !== null) {
					let count = 0;
					let winner = null;
					const scratch = errors === NOERRORS ? NOERRORS : [];
					const branches = errors === NOERRORS ? null : [];
					for (let i = 0; i < P.oneOf.length; i++) {
						const sub = collect ? {
							props: null,
							items: null
						} : DISCARD;
						const mark = branches === null ? 0 : scratch.length;
						const ok = this.eval(P.oneOf[i], data, base, dynScope, scratch, instancePath, schemaPath + "/oneOf/" + i, stack, sub);
						if (branches !== null) branches.push({
							valid: ok,
							errors: scratch.slice(mark),
							title: branchTitle(P.oneOf[i])
						});
						if (ok) {
							count++;
							winner = sub;
						}
					}
					if (count === 1) {
						if (collect) mergeAnnotations(local, winner);
					} else {
						if (branches !== null) {
							const collapsed = collapseBranches({
								keyword: "oneOf",
								branchResults: branches,
								parentPath: instancePath,
								parentSchemaPath: schemaPath + "/oneOf"
							});
							if (collapsed !== null) errors.push(collapsed);
						}
						valid = false;
					}
				}
				if (P.not !== void 0) {
					const scratch = errors === NOERRORS ? NOERRORS : [];
					if (this.eval(P.not, data, base, dynScope, scratch, instancePath, schemaPath + "/not", stack, DISCARD)) {
						if (errors !== NOERRORS) errors.push(err("not", "not", instancePath, schemaPath + "/not", {}, "must NOT be valid"));
						valid = false;
					}
				}
				if (P.if !== void 0) {
					const ifSub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					const ifScratch = errors === NOERRORS ? NOERRORS : [];
					if (this.eval(P.if, data, base, dynScope, ifScratch, instancePath, schemaPath + "/if", stack, ifSub)) {
						if (collect) mergeAnnotations(local, ifSub);
						if (P.then !== void 0) {
							const sub = collect ? {
								props: null,
								items: null
							} : DISCARD;
							if (!this.eval(P.then, data, base, dynScope, errors, instancePath, schemaPath + "/then", stack, sub)) valid = false;
							else if (collect) mergeAnnotations(local, sub);
						}
					} else if (P.else !== void 0) {
						const sub = collect ? {
							props: null,
							items: null
						} : DISCARD;
						if (!this.eval(P.else, data, base, dynScope, errors, instancePath, schemaPath + "/else", stack, sub)) valid = false;
						else if (collect) mergeAnnotations(local, sub);
					}
				}
			}
			if (P.hasUnevaluated) {
				if (P.unevaluatedProperties !== void 0 && bits === T_OBJECT) for (const key of Object.keys(data)) {
					if (local.props && local.props.has(key)) continue;
					if (P.unevaluatedPropertiesFalse) {
						valid = false;
						if (errors !== NOERRORS) errors.push(err("unevaluatedProperties", "unevaluatedProperties", instancePath, schemaPath + "/unevaluatedProperties", { unevaluatedProperty: key }, "must NOT have unevaluated properties"));
					} else if (!this.eval(P.unevaluatedProperties, data[key], base, dynScope, errors, instancePath + "/" + escapePointer(key), schemaPath + "/unevaluatedProperties", stack, DISCARD)) valid = false;
					if (!local.props) local.props = /* @__PURE__ */ new Set();
					local.props.add(key);
				}
				if (P.unevaluatedItems !== void 0 && bits === T_ARRAY) for (let i = 0; i < data.length; i++) {
					if (local.items && local.items.has(i)) continue;
					if (P.unevaluatedItemsFalse) {
						valid = false;
						if (errors !== NOERRORS) errors.push(err("unevaluatedItems", "unevaluatedItems", instancePath, schemaPath + "/unevaluatedItems", { limit: i }, "must NOT have more than " + i + " items"));
						break;
					}
					if (!this.eval(P.unevaluatedItems, data[i], base, dynScope, errors, instancePath + "/" + i, schemaPath + "/unevaluatedItems", stack, DISCARD)) valid = false;
					if (!local.items) local.items = /* @__PURE__ */ new Set();
					local.items.add(i);
				}
			}
			if (scopePushed) dynScope.pop();
			if (tracked) stack.length -= 2;
			if (valid && collect && sink !== DISCARD) mergeAnnotations(sink, local);
			return valid;
		}
	};
	function branchTitle(node) {
		return node && node.schema && typeof node.schema.title === "string" ? node.schema.title : "";
	}
	function escapePointer(s) {
		if (typeof s !== "string") s = String(s);
		for (let i = 0; i < s.length; i++) {
			const c = s.charCodeAt(i);
			if (c === 126 || c === 47) return s.replace(/~/g, "~0").replace(/\//g, "~1");
		}
		return s;
	}
	function err(code, keyword, instancePath, schemaPath, params, message) {
		return {
			keyword,
			instancePath,
			schemaPath,
			params,
			message
		};
	}
	const { compileInterpreter } = require_plan_compiler().install({
		Plan,
		NOERRORS,
		err,
		evalLeaf,
		evalLeafV,
		runCustomV,
		dataBits,
		escapePointer,
		deepEqual,
		enumMember,
		allDistinct,
		multipleOfOk,
		cpAtLeast,
		cpAtMost,
		T_STRING,
		T_ARRAY,
		T_OBJECT,
		resolveRef,
		splitFragment,
		resolveUri
	});
	function createInterpreter(schema, options) {
		return new Interpreter(schema, options);
	}
	module.exports = { createInterpreter };
	Object.defineProperty(module.exports, "_refInternals", {
		value: {
			indexSchemas,
			resolveRef,
			FALLBACK_BASE
		},
		enumerable: false
	});
	Object.defineProperty(module.exports, "_planInternals", {
		value: {
			Plan,
			deepEqual,
			cpAtLeast,
			cpAtMost,
			multipleOfOk,
			dataBits,
			typeBit,
			T_STRING,
			T_NUMBER,
			T_INTEGER,
			T_BOOLEAN,
			T_NULL,
			T_OBJECT,
			T_ARRAY,
			T_ANY
		},
		enumerable: false
	});
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/error-messages.js
var require_error_messages = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function resolveOwner(rootSchema, schemaPath) {
		if (!schemaPath || typeof schemaPath !== "string" || schemaPath[0] !== "#") return void 0;
		const stripped = schemaPath.slice(1);
		if (!stripped || stripped === "/") return rootSchema;
		const parts = stripped.split("/").filter(Boolean).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let target = rootSchema;
		for (let i = 0; i < parts.length - 1; i++) {
			if (target == null || typeof target !== "object") return void 0;
			target = target[parts[i]];
		}
		return target;
	}
	function pickMessage(em, err) {
		if (em == null) return void 0;
		if (typeof em === "string") return em;
		if (typeof em !== "object") return void 0;
		const kw = err.keyword;
		if (kw === "required") {
			const r = em.required;
			if (typeof r === "string") return r;
			if (r && typeof r === "object") {
				const prop = err.params && err.params.missingProperty;
				if (prop != null && typeof r[prop] === "string") return r[prop];
			}
		}
		if (kw != null && typeof em[kw] === "string") return em[kw];
		if (typeof em._ === "string") return em._;
	}
	function schemaHasErrorMessages(schemaStr) {
		return typeof schemaStr === "string" && schemaStr.indexOf("\"errorMessage\"") !== -1;
	}
	function applyErrorMessages(errors, rootSchema) {
		if (!errors || !errors.length) return errors;
		let changed = false;
		const out = new Array(errors.length);
		for (let i = 0; i < errors.length; i++) {
			const err = errors[i];
			out[i] = err;
			if (!err || typeof err.schemaPath !== "string") continue;
			const owner = resolveOwner(rootSchema, err.schemaPath);
			if (!owner || typeof owner !== "object") continue;
			const msg = pickMessage(owner.errorMessage, err);
			if (msg == null) continue;
			out[i] = Object.assign({}, err, { message: msg });
			changed = true;
		}
		return changed ? out : errors;
	}
	module.exports = {
		schemaHasErrorMessages,
		applyErrorMessages,
		resolveOwner,
		pickMessage
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/buffer-gate.browser.js
var require_buffer_gate_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		bufferNeedsSlowPath: () => false,
		installSlowBufferApis() {
			throw new Error("The buffer APIs are not available in the browser build. Use validate(), isValidObject() or validateJSON().");
		}
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/refine.js
var require_refine = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const REFINE = Symbol.for("ata.t.refine");
	function getRefinements(schema) {
		if (!schema || typeof schema !== "object") return null;
		const r = schema[REFINE];
		return Array.isArray(r) && r.length ? r : null;
	}
	function attach(schema, check, opts) {
		if (typeof check !== "function") throw new TypeError("t.refine(schema, check, opts?) — check must be a function");
		const prev = schema && Array.isArray(schema[REFINE]) ? schema[REFINE] : [];
		const o = opts || {};
		const entry = {
			check,
			message: o.message,
			path: o.path || ""
		};
		return Object.assign({}, schema, { [REFINE]: prev.concat(entry) });
	}
	function issue(entry, message) {
		return {
			keyword: "refine",
			instancePath: entry.path || "",
			path: entry.path || "",
			schemaPath: "",
			params: {},
			message: message != null ? message : entry.message || "value failed refinement"
		};
	}
	async function runRefinements(refinements, data) {
		const issues = [];
		await Promise.all(refinements.map(async (entry) => {
			let passed;
			try {
				passed = await entry.check(data);
			} catch (e) {
				issues.push(issue(entry, entry.message || e && e.message || "refinement threw"));
				return;
			}
			if (!passed) issues.push(issue(entry));
		}));
		return issues;
	}
	module.exports = {
		REFINE,
		getRefinements,
		attach,
		runRefinements
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/version.js
var require_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = "1.45.0";
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/validator-core.js
var require_validator_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let _nativeMod;
	function getNative() {
		if (_nativeMod === void 0) _nativeMod = require_native_load_browser()();
		return _nativeMod;
	}
	const { normalizeKeywords, schemaUsesKeywords } = require_keywords();
	let _codegen = null;
	let compileToJS;
	let compileToJSCodegen;
	let compileToJSCodegenWithErrors;
	let compileToJSCombined;
	function _registerCodegen(engine) {
		_codegen = engine;
		({compileToJS, compileToJSCodegen, compileToJSCodegenWithErrors, compileToJSCombined} = engine.jsCompiler);
	}
	const { normalizeDraft7, normalizeNullable, normalizeExclusiveBounds, stripFormatAssertions } = require_draft7();
	const { enabledKeywords, stripDisabledKeywords } = require_vocabularies();
	const { needsNormalization } = require_schema_scan();
	const { isV1Dialect } = require_dialect();
	const { classify } = require_shape_classifier();
	const { buildTier0Plan, tier0Validate } = require_tier0();
	let _defaults = null;
	function buildDefaultsApplier(schema) {
		if (_defaults === null) _defaults = require_defaults();
		return _defaults.buildDefaultsApplier(schema);
	}
	function buildCoercer(schema) {
		if (typeof schema !== "object" || schema === null) return null;
		const node = buildNodeCoercer(schema, /* @__PURE__ */ new Set());
		if (node === null) return null;
		return (data) => {
			if (typeof data === "object" && data !== null) node(data);
		};
	}
	function coercionFor(schema, seen) {
		if (!schema || typeof schema !== "object") return null;
		const scalar = schema.type && !Array.isArray(schema.type) ? buildSingleCoercion(schema.type) : null;
		const inner = buildNodeCoercer(schema, seen);
		return scalar || inner ? {
			scalar,
			inner
		} : null;
	}
	function buildNodeCoercer(schema, seen) {
		if (seen.has(schema)) return null;
		seen.add(schema);
		const steps = [];
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			if (key === "__proto__") continue;
			const c = coercionFor(prop, seen);
			if (!c) continue;
			const { scalar, inner } = c;
			steps.push((o) => {
				if (!(key in o)) return;
				if (scalar) {
					const v = scalar(o[key]);
					if (v !== void 0) o[key] = v;
				}
				if (inner) {
					const x = o[key];
					if (typeof x === "object" && x !== null) inner(x);
				}
			});
		}
		if (schema.items && typeof schema.items === "object" && !Array.isArray(schema.items)) {
			const c = coercionFor(schema.items, seen);
			if (c) {
				const { scalar, inner } = c;
				steps.push((o) => {
					if (!Array.isArray(o)) return;
					for (let i = 0; i < o.length; i++) {
						if (scalar) {
							const v = scalar(o[i]);
							if (v !== void 0) o[i] = v;
						}
						if (inner) {
							const x = o[i];
							if (typeof x === "object" && x !== null) inner(x);
						}
					}
				});
			}
		}
		seen.delete(schema);
		if (steps.length === 0) return null;
		if (steps.length === 1) return steps[0];
		return (o) => {
			for (let i = 0; i < steps.length; i++) steps[i](o);
		};
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
	let _codegenAvailable = null;
	function codegenAvailable() {
		if (_codegen === null) return false;
		if (_codegenAvailable === null) try {
			_codegenAvailable = new Function("return 1")() === 1;
		} catch {
			_codegenAvailable = false;
		}
		return _codegenAvailable;
	}
	const CACHE_ENTRIES = 128;
	const CACHE_KEY_CHARS = 16777216;
	const _compileCache = /* @__PURE__ */ new Map();
	function _boundedSet(map, key, entry) {
		if (!map.has(key)) map._chars = (map._chars || 0) + key.length;
		map.set(key, entry);
		while (map.size > CACHE_ENTRIES || map._chars > CACHE_KEY_CHARS && map.size > 1) {
			const oldest = map.keys().next().value;
			map.delete(oldest);
			map._chars -= oldest.length;
		}
	}
	function _compileCacheSet(key, entry) {
		_boundedSet(_compileCache, key, entry);
	}
	const _preprocessCache = /* @__PURE__ */ new Map();
	const _identityCache = /* @__PURE__ */ new WeakMap();
	const SIMDJSON_PADDING = 64;
	const VALID_RESULT = Object.freeze({
		valid: true,
		errors: Object.freeze([])
	});
	const HYBRID_TIER_CALLS = 64;
	function _sharedError(e) {
		Object.defineProperty(e, "_s", { value: true });
		return Object.freeze(e);
	}
	const ABORT_EARLY_RESULT = Object.freeze({
		valid: false,
		errors: Object.freeze([_sharedError({
			code: "ATA9000",
			message: "validation failed",
			keyword: "__abort_early__",
			path: ""
		})])
	});
	const SIMDJSON_THRESHOLD = 8192;
	function resolveSchemaByPath(rootSchema, schemaPath) {
		if (!schemaPath || typeof schemaPath !== "string" || !schemaPath.startsWith("#")) return;
		const stripped = schemaPath.slice(1);
		if (!stripped || stripped === "/") return rootSchema;
		const parts = stripped.split("/").filter(Boolean).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let target = rootSchema;
		for (let i = 0; i < parts.length - 1; i++) {
			if (target == null || typeof target !== "object") return void 0;
			target = target[parts[i]];
		}
		return target;
	}
	const { LazyRejection, RichRejection, LazyJsonRejection, _enrichLazy, presentErrors, needsOrdering, sortErrorsBySchemaOrder, stripOrdinal } = require_rejections();
	function _jsonSyntaxRejection(e) {
		return {
			valid: false,
			errors: [{
				keyword: "__parse__",
				instancePath: "",
				schemaPath: "",
				params: {},
				message: "invalid JSON: " + e.message
			}]
		};
	}
	const _pathBuckets = /* @__PURE__ */ new Map();
	const PATH_LENGTHS_MAX = 256;
	function parsePointerPath(path) {
		if (!path) return EMPTY_PATH;
		const n = path.length;
		let bucket = _pathBuckets.get(n);
		if (bucket !== void 0) {
			for (let i = 0; i < bucket.length; i += 2) if (bucket[i] === path) return bucket[i + 1];
		} else {
			if (_pathBuckets.size >= PATH_LENGTHS_MAX) _pathBuckets.clear();
			bucket = [];
			_pathBuckets.set(n, bucket);
		}
		const segs = Object.freeze(parsePointerPathUncached(path));
		if (bucket.length < 64) bucket.push(path, segs);
		return segs;
	}
	const EMPTY_PATH = Object.freeze([]);
	function parsePointerPathUncached(path) {
		const out = [];
		const n = path.length;
		let start = 1;
		for (let i = 1; i <= n; i++) {
			if (i !== n && path.charCodeAt(i) !== 47) continue;
			if (i > start) {
				let seg = path.slice(start, i);
				if (seg.indexOf("~") >= 0) seg = seg.replace(/~1/g, "/").replace(/~0/g, "~");
				const c0 = seg.charCodeAt(0);
				let numeric = c0 >= 48 && c0 <= 57 && (seg.length === 1 || c0 !== 48);
				if (numeric) for (let k = 1; k < seg.length; k++) {
					const c = seg.charCodeAt(k);
					if (c < 48 || c > 57) {
						numeric = false;
						break;
					}
				}
				out.push({ key: numeric ? Number(seg) : seg });
			}
			start = i + 1;
		}
		return out;
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
	function _deepCloneWithSymbols(v) {
		if (v === null || typeof v !== "object") return v;
		if (Array.isArray(v)) {
			const a = new Array(v.length);
			for (let i = 0; i < v.length; i++) a[i] = _deepCloneWithSymbols(v[i]);
			return a;
		}
		if (Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) return v;
		const out = Object.create(null);
		for (const k of Object.keys(v)) Object.defineProperty(out, k, {
			value: _deepCloneWithSymbols(v[k]),
			writable: true,
			enumerable: true,
			configurable: true
		});
		for (const sym of Object.getOwnPropertySymbols(v)) out[sym] = v[sym];
		return Object.setPrototypeOf(out, Object.prototype);
	}
	function _normalizeCallerSchema(s, inheritDraft7) {
		const needsDraft7 = s && typeof s === "object" && s.$schema !== void 0 ? s.$schema === "http://json-schema.org/draft-07/schema#" || s.$schema === "http://json-schema.org/draft-07/schema" : !!inheritDraft7;
		if (!needsNormalization(s, needsDraft7)) return s;
		const str = JSON.stringify(s);
		const copy = _deepCloneWithSymbols(s);
		if (needsDraft7) normalizeDraft7(copy, true);
		normalizeNullable(copy);
		normalizeExclusiveBounds(copy);
		return JSON.stringify(copy) === str ? s : copy;
	}
	function declaredId(original, normalized) {
		const n = normalized && typeof normalized === "object" ? normalized.$id : void 0;
		if (typeof n === "string" && n !== "") return n;
		const o = original && typeof original === "object" ? original.$id : void 0;
		if (typeof o === "string" && o !== "" && o[0] !== "#") return o;
	}
	const _schemaMapCache = /* @__PURE__ */ new WeakMap();
	function buildSchemaMap(schemas, inheritDraft7) {
		if (!schemas) return null;
		const byDraft = _schemaMapCache.get(schemas);
		if (byDraft) {
			const hit = byDraft[inheritDraft7 ? 1 : 0];
			if (hit) return hit;
		}
		const map = _buildSchemaMap(schemas, inheritDraft7);
		const slot = byDraft || [null, null];
		slot[inheritDraft7 ? 1 : 0] = map;
		if (!byDraft) _schemaMapCache.set(schemas, slot);
		return map;
	}
	function _buildSchemaMap(schemas, inheritDraft7) {
		const map = /* @__PURE__ */ new Map();
		if (Array.isArray(schemas)) for (const s of schemas) {
			const normalized = _normalizeCallerSchema(s, inheritDraft7);
			const id = declaredId(s, normalized);
			if (!id) throw new Error("Schema in schemas option must have $id");
			map.set(id, normalized);
		}
		else for (const [key, s] of Object.entries(schemas)) {
			const normalized = _normalizeCallerSchema(s, inheritDraft7);
			map.set(key, normalized);
			const id = declaredId(s, normalized);
			if (id && id !== key) map.set(id, normalized);
		}
		return map;
	}
	function _applyVocabularies(schemaObj, original, schemaMap) {
		if (!schemaObj || typeof schemaObj !== "object") return schemaObj;
		const declared = schemaObj.$schema;
		if (typeof declared !== "string") return schemaObj;
		const enabled = enabledKeywords(schemaMap.get(declared));
		if (!enabled) return schemaObj;
		const copy = schemaObj === original ? _deepCloneWithSymbols(schemaObj) : schemaObj;
		return stripDisabledKeywords(copy, enabled);
	}
	function compileCacheKey(schemaStr, schemaMap) {
		if (!schemaMap || schemaMap.size === 0) return schemaStr;
		const parts = [];
		for (const [id, s] of schemaMap) parts.push(id + "=" + JSON.stringify(s));
		parts.sort();
		return schemaStr + "\0" + parts.join("\0");
	}
	function resolveRefForPreprocess(ref, schemaMap) {
		if (!schemaMap || schemaMap.size === 0 || typeof ref !== "string") return null;
		const hashIdx = ref.indexOf("#");
		const baseId = hashIdx >= 0 ? ref.slice(0, hashIdx) : ref;
		const fragment = hashIdx >= 0 ? ref.slice(hashIdx + 1) : "";
		if (!baseId) return null;
		let base = null;
		if (schemaMap.has(baseId)) base = schemaMap.get(baseId);
		else if (!ref.includes("://")) {
			for (const [id, s] of schemaMap) if (id.endsWith("/" + baseId)) {
				base = s;
				break;
			}
		}
		if (!base) return null;
		if (!fragment) return base;
		let target = base;
		for (const part of fragment.split("/")) {
			if (part === "") continue;
			if (target == null || typeof target !== "object") return null;
			target = target[part.replace(/~1/g, "/").replace(/~0/g, "~")];
		}
		return target == null ? null : target;
	}
	function resolveSchemaForPreprocess(schema, schemaMap) {
		if (!schema || typeof schema !== "object" || !schemaMap || schemaMap.size === 0) return schema;
		let s = schema;
		if (s.$ref && !s.properties) {
			const t = resolveRefForPreprocess(s.$ref, schemaMap);
			if (t && typeof t === "object") s = t;
		}
		if (!s.properties) return s;
		let cloned = null;
		for (const key of Object.keys(s.properties)) {
			const p = s.properties[key];
			if (p && typeof p === "object" && p.$ref && !p.type) {
				const t = resolveRefForPreprocess(p.$ref, schemaMap);
				if (t && typeof t === "object") {
					if (!cloned) {
						cloned = { ...s };
						cloned.properties = { ...s.properties };
					}
					Object.defineProperty(cloned.properties, key, {
						value: t,
						writable: true,
						enumerable: true,
						configurable: true
					});
				}
			}
		}
		return cloned || s;
	}
	function _materializeSchema(self) {
		const raw = self._rawSchema;
		const options = self._options;
		let schemaObj = _normalizeCallerSchema(raw);
		if (typeof options.baseURI === "string" && options.baseURI !== "" && schemaObj && typeof schemaObj === "object" && !Array.isArray(schemaObj) && typeof schemaObj.$id !== "string") schemaObj = {
			...schemaObj,
			$id: options.baseURI
		};
		const isCallers = self._rawIsCallers && schemaObj === raw;
		if (options.assertFormat === false) schemaObj = stripFormatAssertions(isCallers ? _deepCloneWithSymbols(schemaObj) : schemaObj);
		let usesKeywords = self._keywords !== null && schemaUsesKeywords(schemaObj, self._keywords);
		if (!usesKeywords && self._keywords !== null && self._schemaMap && self._schemaMap.size > 0) {
			for (const ext of self._schemaMap.values()) if (schemaUsesKeywords(ext, self._keywords)) {
				usesKeywords = true;
				break;
			}
		}
		Object.defineProperty(self, "_schemaObj", {
			value: schemaObj,
			writable: true,
			configurable: true,
			enumerable: true
		});
		Object.defineProperty(self, "_usesKeywords", {
			value: usesKeywords,
			writable: true,
			configurable: true,
			enumerable: true
		});
		Object.defineProperty(self, "_schemaIsCallers", {
			value: isCallers && schemaObj === raw,
			writable: true,
			configurable: true,
			enumerable: true
		});
		return schemaObj;
	}
	var Validator = class Validator {
		constructor(schema, opts) {
			const options = opts || {};
			if (!opts && typeof schema === "object" && schema !== null) {
				const hit = _identityCache.get(schema);
				if (hit) return hit;
			}
			const raw = typeof schema === "string" ? JSON.parse(schema) : schema;
			const rootIsDraft7 = !!(raw && typeof raw === "object" && typeof raw.$schema === "string" && (raw.$schema === "http://json-schema.org/draft-07/schema#" || raw.$schema === "http://json-schema.org/draft-07/schema"));
			const shared = buildSchemaMap(options.schemas, rootIsDraft7);
			const schemaMap = shared || /* @__PURE__ */ new Map();
			this._schemaMapShared = shared !== null;
			this._vocabulariesApplied = false;
			this._keywords = normalizeKeywords(options.keywords);
			this._schemaStr = null;
			this._rawSchema = raw;
			this._rawIsCallers = typeof schema !== "string";
			this._options = options;
			this._noOpts = !opts;
			if (options.engine !== void 0 && options.engine !== "auto" && options.engine !== "interpreter") throw new TypeError("engine must be 'auto' or 'interpreter', got " + JSON.stringify(options.engine));
			this._interpretOnly = options.engine === "interpreter";
			this._initialized = false;
			this._nativeReady = false;
			this._compiled = null;
			this._fastSlot = -1;
			this._jsFn = null;
			this._engine = void 0;
			this._preprocess = null;
			this._applyDefaults = null;
			this._schemaMap = schemaMap;
			this._userFormats = options.formats || null;
			this._verbose = !!options.verbose;
			if (options.strictSchema === true || options.strictSchema === "log") {
				const { checkSchemaStrict } = require_strict_check();
				const problems = checkSchemaStrict(schema, { userKeywords: options.keywords || null });
				if (problems.length > 0) {
					const text = problems.map((x) => `strict mode: ${x.message} at ${x.path}`).join("\n");
					if (options.strictSchema === true) throw new Error(text);
					const logger = options.logger;
					if (logger !== false) (logger && typeof logger.warn === "function" ? logger.warn.bind(logger) : console.warn)(text);
				}
			}
			this._richErrors = options && options.richErrors === false ? false : true;
			this._source = options && options.source && typeof options.source === "object" ? {
				path: String(options.source.path || ""),
				content: String(options.source.content || "")
			} : null;
			if (this._source) {
				const { buildPositionMap } = require_source_positions();
				this._schemaPositions = buildPositionMap(this._source.content);
			} else this._schemaPositions = null;
			this._posCache = null;
			this._lastRawInput = null;
			this._lastParsed = void 0;
			this._scanner = void 0;
			this._verdictTail = null;
			this._validateTail = null;
			this._entryExt = null;
		}
		_needsPreprocess() {
			const o = this._options;
			if (o.coerceTypes || o.removeAdditional) return true;
			if (o.useDefaults === false) return false;
			if (!this._schemaStr) this._schemaStr = JSON.stringify(this._schemaObj);
			return this._schemaStr.includes("\"default\"");
		}
		_pos() {
			return this._posCache || (this._posCache = require_data_position_cache().createCache(_codegen !== null && _codegen.nativePositions ? _codegen.nativePositions() : null));
		}
		_ensureVocabularies() {
			if (this._vocabulariesApplied) return;
			this._vocabulariesApplied = true;
			const stripped = _applyVocabularies(this._schemaObj, this._schemaIsCallers ? this._schemaObj : null, this._schemaMap);
			if (stripped !== this._schemaObj) {
				this._schemaObj = stripped;
				this._schemaStr = null;
			}
		}
		_ensureCompiled() {
			if (this._initialized) return;
			this._ensureVocabularies();
			this._initialized = true;
			const schemaObj = this._schemaObj;
			const options = this._options;
			if (!this._schemaStr) this._schemaStr = JSON.stringify(schemaObj);
			if (this._schemaStr.includes("json-schema.org/") && /"\$(?:ref|dynamicRef|recursiveRef)":"[^"]*json-schema\.org\//.test(this._schemaStr)) {
				const { METASCHEMAS } = require_metaschemas();
				this._ownSchemaMap();
				for (const [id, meta] of METASCHEMAS) {
					const bare = id.replace(/#$/, "");
					for (const key of [
						id,
						bare,
						bare + "#",
						bare.replace(/^https:/, "http:"),
						bare.replace(/^http:/, "https:")
					]) if (!this._schemaMap.has(key)) this._schemaMap.set(key, meta);
				}
			}
			const sm = this._schemaMap.size > 0 ? this._schemaMap : null;
			const mapKey = compileCacheKey(this._schemaStr, this._schemaMap);
			var _forceNapi = this._interpretOnly || typeof process !== "undefined" && process.env && process.env.ATA_FORCE_NAPI;
			const cached = this._userFormats || this._usesKeywords || _forceNapi ? null : _compileCache.get(mapKey);
			let jsFn, jsCombinedFn, jsErrFn, _isCodegen = false;
			this._v1Dynamic = isV1Dialect(schemaObj) && (this._schemaStr.includes("\"$dynamicRef\"") || this._schemaStr.includes("\"$dynamicAnchor\""));
			if (_forceNapi || this._v1Dynamic || !codegenAvailable()) {
				jsFn = null;
				jsCombinedFn = null;
				jsErrFn = null;
			} else if (cached && cached.jsFn !== void 0) {
				jsFn = cached.jsFn;
				jsCombinedFn = cached.combined;
				jsErrFn = cached.errFn;
				_isCodegen = !!cached.isCodegen;
				this._engine = _isCodegen ? "codegen" : jsFn ? "closure" : null;
			} else {
				const uf = this._userFormats;
				const kw = this._keywords ? { keywords: this._keywords } : void 0;
				const _cgFn = compileToJSCodegen(schemaObj, sm, uf, kw);
				jsFn = _cgFn || (this._usesKeywords ? null : compileToJS(schemaObj, null, sm));
				jsCombinedFn = void 0;
				jsErrFn = void 0;
				_isCodegen = !!_cgFn;
				this._engine = _cgFn ? "codegen" : jsFn ? "closure" : null;
				if (!uf && !this._keywords) _compileCacheSet(mapKey, {
					jsFn,
					combined: void 0,
					errFn: void 0,
					isCodegen: _isCodegen,
					full: false
				});
			}
			this._jsFn = jsFn;
			if (this._engine === void 0) this._engine = null;
			const preprocessSchema = resolveSchemaForPreprocess(schemaObj, this._schemaMap);
			let preprocess = null;
			if (!this._interpretOnly && _codegen !== null) {
				const ppKey = !this._userFormats && !this._usesKeywords ? mapKey + "\0" + String(options.coerceTypes) + "|" + (options.useDefaults !== false) + "|" + String(options.removeAdditional) : null;
				const hit = ppKey !== null ? _preprocessCache.get(ppKey) : void 0;
				if (hit !== void 0) preprocess = hit;
				else {
					preprocess = _codegen.buildPreprocess(preprocessSchema, options) || null;
					if (ppKey !== null && preprocess !== null) _boundedSet(_preprocessCache, ppKey, preprocess);
				}
			}
			if (!preprocess) {
				const mayHaveDefaults = preprocessSchema !== schemaObj || this._schemaStr.includes("\"default\"");
				const applyDefaults = options.useDefaults === false || !mayHaveDefaults ? null : buildDefaultsApplier(preprocessSchema);
				const applyCoerce = options.coerceTypes ? buildCoercer(preprocessSchema) : null;
				const mutators = [
					options.removeAdditional ? buildRemover(preprocessSchema) : null,
					applyCoerce,
					applyDefaults
				].filter(Boolean);
				preprocess = mutators.length === 0 ? null : mutators.length === 1 ? mutators[0] : (data) => {
					for (let i = 0; i < mutators.length; i++) mutators[i](data);
				};
			}
			this._applyDefaults = preprocess;
			this._mutatesInput = !!(preprocess || options.coerceTypes || options.removeAdditional);
			this._preprocess = preprocess;
			let fusedRemove = null;
			if (preprocess && options.removeAdditional && !options.coerceTypes && !this._interpretOnly && !this._userFormats && !this._usesKeywords && !this._schemaStr.includes("\"default\"")) try {
				fusedRemove = compileToJSCodegen(schemaObj, this._schemaMap.size > 0 ? this._schemaMap : null, null, { removeAdditional: true });
			} catch {
				fusedRemove = null;
			}
			const useSimdjsonForLarge = !(schemaObj && (schemaObj.items || schemaObj.prefixItems || schemaObj.contains || schemaObj.properties && Object.values(schemaObj.properties).some((p) => p && (p.items || p.prefixItems || p.contains))));
			const _upgradeCacheEntry = () => {
				if (this._userFormats) return;
				const entry = _compileCache.get(mapKey);
				if (entry && entry.jsFn === jsFn) {
					if (jsCombinedFn !== void 0) entry.combined = jsCombinedFn;
					if (jsErrFn !== void 0) entry.errFn = jsErrFn;
					if (jsCombinedFn !== void 0 && jsErrFn !== void 0) entry.full = true;
				}
			};
			const _buildCombined = () => {
				if (jsCombinedFn !== void 0) return;
				jsCombinedFn = this._usesKeywords ? null : compileToJSCombined(schemaObj, VALID_RESULT, sm, this._userFormats, { runtimeShape: true }) || null;
				_upgradeCacheEntry();
			};
			const _buildErr = () => {
				if (jsErrFn !== void 0) return;
				jsErrFn = this._usesKeywords ? null : compileToJSCodegenWithErrors(schemaObj, sm, this._userFormats, { runtimeShape: true }) || null;
				_upgradeCacheEntry();
			};
			let _rejectBase = null, _rejectPresented = null, _rejectPlain = false, _oneShotRich = null, _richBuilder = null, _oneShotPlain = false, _isCleanShape = null, _onePassOf = null, _isCombined = null;
			if (jsFn) {
				const _cg = {
					jsFn,
					_isCodegen,
					preprocess,
					fusedRemove,
					options,
					schemaObj,
					useSimdjsonForLarge,
					_buildCombined,
					_buildErr,
					combined: () => jsCombinedFn,
					err: () => jsErrFn,
					rejectBase: null,
					richBuilder: null,
					oneShotPlain: false,
					isCleanShape: null,
					isCombined: null,
					onePassOf: null,
					buildRich: this._richErrors && !this._schemaPositions && !this._usesKeywords ? () => compileToJSCombined(schemaObj, VALID_RESULT, sm, this._userFormats, {
						runtimeShape: true,
						rich: true
					}) || null : null,
					oneShotRich: null
				};
				_codegen.installPaths.call(this, _cg);
				_rejectBase = _cg.rejectBase;
				_oneShotRich = _cg.oneShotRich;
				_richBuilder = _cg.richBuilder;
				_oneShotPlain = _cg.oneShotPlain;
				_isCleanShape = _cg.isCleanShape;
				_onePassOf = _cg.onePassOf;
				_isCombined = _cg.isCombined;
			} else {
				const { createInterpreter } = require_interpreter();
				const interp = createInterpreter(schemaObj, {
					schemaMap: this._schemaMap.size > 0 ? this._schemaMap : null,
					formats: this._userFormats,
					v1: isV1Dialect(schemaObj),
					keywords: this._keywords
				});
				this._engine = "interpreter";
				if (!preprocess) this._fastVerdict = (d) => interp.isValid(d);
				const run = options.abortEarly ? preprocess ? (data) => {
					preprocess(data);
					return interp.isValid(data) ? VALID_RESULT : ABORT_EARLY_RESULT;
				} : (data) => interp.isValid(data) ? VALID_RESULT : ABORT_EARLY_RESULT : preprocess ? (data) => {
					preprocess(data);
					return interp.validate(data);
				} : (data) => interp.validate(data);
				this.validate = this._verbose ? _verboseWrap(run, schemaObj) : run;
				if (!preprocess && !options.abortEarly && !this._verbose) _rejectBase = (data) => interp.validate(data);
				_bindVerdict(this, this._fastVerdict ? this._fastVerdict : (data) => run(data).valid);
				const runText = options.abortEarly ? run : preprocess ? (data) => {
					preprocess(data);
					return interp.isValid(data) ? VALID_RESULT : interp.validate(data);
				} : (data) => interp.isValid(data) ? VALID_RESULT : interp.validate(data);
				this.validateJSON = (jsonStr) => {
					let data;
					try {
						data = JSON.parse(jsonStr);
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
						return _jsonSyntaxRejection(e);
					}
					this._lastParsed = data;
					return runText(data);
				};
				this.isValidJSON = (jsonStr) => {
					let data;
					try {
						data = JSON.parse(jsonStr);
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
						return false;
					}
					return this.isValidObject(data);
				};
			}
			if (this.validate) {
				const inner = this.validate;
				const enrich = this._richErrors ? _enrichLazy : null;
				const root = this._schemaObj;
				const self = this;
				const present = (result, data) => {
					if (result && result.valid === false && result !== ABORT_EARLY_RESULT) {
						const rawInput = enrich ? self._lastRawInput : null;
						return new RichRejection(result, data, rawInput, self, root, enrich);
					}
					return result;
				};
				this.validate = (data) => present(inner(data), data);
				const rejectBase = _rejectBase;
				_rejectPresented = rejectBase ? (data) => present(rejectBase(data), data) : null;
				_rejectPlain = !!rejectBase;
				if (this._richErrors && this.validateJSON) {
					const innerJson = this.validateJSON;
					this.validateJSON = (jsonStr) => {
						this._lastRawInput = jsonStr;
						this._lastParsed = void 0;
						let result, parsed;
						try {
							result = innerJson(jsonStr);
						} finally {
							this._lastRawInput = null;
							parsed = this._lastParsed;
							this._lastParsed = void 0;
						}
						if (result && result.valid === false) return new LazyJsonRejection(result, jsonStr, this, enrich, parsed);
						return result;
					};
				} else if (this.validateJSON) {
					const innerJson = this.validateJSON;
					this.validateJSON = (jsonStr) => {
						this._lastParsed = void 0;
						const result = innerJson(jsonStr);
						const parsed = this._lastParsed;
						this._lastParsed = void 0;
						if (!(result && result.valid === false && parsed !== void 0)) return result;
						return present(result, parsed);
					};
				}
			}
			if (this.validate) {
				const _bare = this.validate;
				this.validate = fusedRemove ? (data) => {
					if (fusedRemove(data)) return {
						valid: true,
						data,
						errors: VALID_RESULT.errors
					};
					const r = _bare(data);
					return r.valid === true && r.data === void 0 ? {
						valid: true,
						data,
						errors: r.errors
					} : r;
				} : (data) => {
					const r = _bare(data);
					return r.valid === true && r.data === void 0 ? {
						valid: true,
						data,
						errors: r.errors
					} : r;
				};
			}
			if ((this._schemaStr || (this._schemaObj ? JSON.stringify(this._schemaObj) : "")).indexOf("\"errorMessage\"") !== -1) {
				const emLib = require_error_messages();
				const root = this._schemaObj;
				const wrap = (inner) => (arg) => {
					const result = inner(arg);
					if (result && result.valid === false && result.errors && result.errors.length && result !== ABORT_EARLY_RESULT) {
						const overridden = emLib.applyErrorMessages(result.errors, root);
						if (overridden !== result.errors) return {
							valid: false,
							errors: overridden
						};
					}
					return result;
				};
				if (this.validate) this.validate = wrap(this.validate);
				if (_rejectPresented) _rejectPresented = wrap(_rejectPresented);
				_rejectPlain = false;
				if (this.validateJSON) this.validateJSON = wrap(this.validateJSON);
				if (this.validateAndParse) {
					const innerVP = this.validateAndParse;
					this.validateAndParse = (arg) => {
						const result = innerVP(arg);
						if (result && result.valid === false && result.errors && result.errors.length) {
							const overridden = emLib.applyErrorMessages(result.errors, root);
							if (overridden !== result.errors) return {
								valid: false,
								value: result.value,
								errors: overridden
							};
						}
						return result;
					};
				}
			}
			const _vx = this._validateTail !== null ? this._validateTail() : null;
			let _vxApplied = false;
			if (this._fastVerdict && !preprocess && !options.abortEarly && this.validate) {
				const _full = _vx === null && !fusedRemove && _rejectPresented ? _rejectPresented : this.validate;
				const _fast = _vx ? _fuseTail(this._fastVerdict, _vx.check) : this._fastVerdict;
				const _extra = _vx ? _vx.errors : null;
				_vxApplied = true;
				const EMPTY_ERRORS = Object.freeze([]);
				const _verdictFallback = [{
					keyword: "validation",
					instancePath: "",
					schemaPath: "#",
					params: {},
					message: "schema validation failed"
				}];
				const _withExtra = (own, data) => {
					const more = _extra === null ? null : _extra(data);
					if (more && more.length) return own ? own.concat(more) : more;
					return own || _verdictFallback;
				};
				const _plain = _vx === null && !fusedRemove && _rejectPlain ? _plainBuilders(_rejectBase, this._richErrors ? _enrichLazy : null, this._schemaObj, this, _verdictFallback) : null;
				const _buildErrors = _plain !== null ? _plain.errors : (data) => {
					const r = _full(data);
					return _withExtra(r && r.valid === false && r.errors && r.errors.length ? r.errors : null, data);
				};
				const _buildRawErrors = _plain !== null ? _plain.raw : (data) => {
					const r = _full(data);
					let raw = null;
					if (r && r.valid === false) {
						raw = typeof r._ataRaw === "function" ? r._ataRaw() : r.errors;
						if (!raw || !raw.length) raw = null;
					}
					return _withExtra(raw, data);
				};
				let _errorsNow = _buildErrors;
				let _onePass = null;
				let _richLater = _plain !== null && _oneShotRich !== null && _richBuilder !== null && !_extra ? 1 : 0;
				const _errorsOf = (data) => {
					if (_richLater !== 0 && ++_richLater > 2) {
						_richLater = 0;
						const combRich = _oneShotRich();
						if (combRich) {
							const clean = !this._richErrors && _isCleanShape !== null && _isCleanShape(combRich);
							_errorsNow = _richBuilder(combRich, this._schemaObj, (raw, d) => presentErrors(raw, d, null, this, this._schemaObj, this._richErrors ? _enrichLazy : null), _verdictFallback, _oneShotPlain, clean);
							_errorsOf.final = !_oneShotPlain;
							const onePass = !this._richErrors && _onePassOf !== null && _isCombined !== null && _isCombined(combRich) ? _onePassOf(EMPTY_ERRORS, _plainValidate) : null;
							if (onePass) {
								_onePass = onePass;
								self.validate = onePass;
							}
						}
					}
					return _errorsNow(data);
				};
				_errorsOf.final = false;
				const _plainValidate = (data) => {
					if (_fast(data)) return {
						valid: true,
						data,
						errors: EMPTY_ERRORS
					};
					return new LazyRejection(_errorsOf, data, _buildRawErrors);
				};
				const self = this;
				const _factory = _vx === null && _fast === this._fastVerdict && typeof _fast._resultFactory === "function" ? _fast._resultFactory : null;
				if (_factory !== null) {
					let calls = 0;
					this.validate = (data) => {
						if (++calls === HYBRID_TIER_CALLS && _onePass === null) {
							const gen = _factory(LazyRejection, _errorsOf, _buildRawErrors, EMPTY_ERRORS);
							if (gen) self.validate = gen;
						}
						return _plainValidate(data);
					};
				} else this.validate = _plainValidate;
			}
			if (_vx && !_vxApplied && this.validate) {
				const inner = this.validate;
				const { check, errors } = _vx;
				this.validate = (data) => {
					const r = inner(data);
					if (r.valid && check(data)) return r;
					return new ExtendedRejection(r, data, errors);
				};
			}
			if (this._jsFn && !this._preprocess) _codegen.installScanner.call(this, schemaObj, options);
			if (_vx) {
				this._entryExt = _jsonEntryWrappers(_vx);
				for (const name of [
					"validateJSON",
					"isValidJSON",
					"validateAndParse"
				]) if (Object.prototype.hasOwnProperty.call(this, name) && typeof this[name] === "function") _bindEntry(this, name, this[name]);
			}
			_rememberInstance(this);
		}
		engine() {
			this._ensureCompiled();
			return this._engine || "interpreter";
		}
		_ensureNative() {
			if (this._nativeReady) return;
			this._nativeReady = true;
			const native = getNative();
			if (!native) return;
			if (!this._schemaStr) this._schemaStr = JSON.stringify(this._schemaObj);
			let nativeSchemaStr = this._schemaStr;
			if (this._schemaMap.size > 0 && typeof this._schemaObj === "object" && this._schemaObj !== null) {
				const merged = JSON.parse(this._schemaStr);
				if (!merged.$defs) merged.$defs = {};
				for (const [id, s] of this._schemaMap) merged.$defs["__ext_" + id.replace(/[^a-zA-Z0-9]/g, "_")] = s;
				nativeSchemaStr = JSON.stringify(merged);
			}
			this._compiled = new native.CompiledSchema(nativeSchemaStr);
			try {
				this._fastSlot = native.fastRegister(nativeSchemaStr);
			} catch {
				this._fastSlot = -1;
			}
		}
		_installBufferApis(name) {
			this._ensureCompiled();
			const native = getNative();
			if (!native && typeof Buffer === "undefined") throw new Error(`Native addon required for ${name}(). Use validate(), isValidObject() or validateJSON(), which do not need it.`);
			const { bufferNeedsSlowPath, installSlowBufferApis } = require_buffer_gate_browser();
			if (!native) return installSlowBufferApis(this);
			if (bufferNeedsSlowPath(this._schemaObj, this._schemaMap, this._keywords)) return installSlowBufferApis(this);
			this._ensureNative();
			const slot = this._fastSlot;
			if (!(slot >= 0)) return installSlowBufferApis(this);
			const bytes = (b, who) => {
				if (typeof b === "string") return Buffer.from(b);
				if (b instanceof Uint8Array) return b;
				throw new TypeError(`${who}() requires a Buffer, Uint8Array, or string. For parsed objects, use isValidObject().`);
			};
			this.isValid = (b) => native.rawFastValidate(slot, bytes(b, "isValid"));
			this.isValidPrepadded = (paddedBuffer, jsonLength) => native.rawFastValidate(slot, paddedBuffer, jsonLength);
			this.isValidParallel = (b) => native.rawParallelValidate(slot, bytes(b, "isValidParallel"));
			this.isValidNDJSON = (b) => native.rawNDJSONValidate(slot, bytes(b, "isValidNDJSON"));
			this.countValid = (b) => {
				const r = native.rawNDJSONValidate(slot, bytes(b, "countValid"));
				let n = 0;
				for (let i = 0; i < r.length; i++) if (r[i]) n++;
				return n;
			};
			this.batchIsValid = (buffers) => {
				let n = 0;
				for (const b of buffers) {
					if (!(b instanceof Uint8Array)) throw new TypeError("batchIsValid() requires Buffer or Uint8Array elements");
					if (native.rawFastValidate(slot, b)) n++;
				}
				return n;
			};
		}
		addSchema(schema) {
			if (this._initialized) throw new Error("Cannot add schema after compilation — call addSchema() before validate()");
			if (!schema || !schema.$id) throw new Error("Schema must have $id");
			const root = this._schemaObj;
			const normalized = _normalizeCallerSchema(schema, !!(root && typeof root === "object" && typeof root.$schema === "string" && (root.$schema === "http://json-schema.org/draft-07/schema#" || root.$schema === "http://json-schema.org/draft-07/schema")));
			this._ownSchemaMap();
			this._schemaMap.set(normalized.$id, normalized);
		}
		_ownSchemaMap() {
			if (!this._schemaMapShared) return;
			this._schemaMap = new Map(this._schemaMap);
			this._schemaMapShared = false;
		}
		_ensureCodegen() {
			if (this._jsFn) return;
			if (this._needsPreprocess() || this._usesKeywords) {
				this._ensureCompiled();
				return;
			}
			this._ensureVocabularies();
			if (this._interpretOnly || _codegen === null || typeof process !== "undefined" && process.env && process.env.ATA_FORCE_NAPI) return;
			_codegen.compileVerdict.call(this);
		}
		static fromStandalone(mod, schema, opts) {
			if (_codegen === null) throw new TypeError("Validator.fromStandalone is not part of ata-validator/lite, like the bundle methods it loads for. Import it from ata-validator, or import a module from `ata build` directly.");
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
			{
				const _bare = v.validate;
				v.validate = (data) => {
					const r = _bare(data);
					return r.valid === true && r.data === void 0 ? {
						valid: true,
						data,
						errors: r.errors
					} : r;
				};
			}
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
					jsonSchema: standardJsonSchema(() => schemaObj),
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
	};
	function validate(schema, data) {
		if (schema instanceof Validator) return schema.validate(data);
		return new Validator(typeof schema === "string" ? JSON.parse(schema) : schema).validate(data);
	}
	async function validateAsync(schemaOrValidator, data) {
		const refineLib = require_refine();
		let validator, schema;
		if (schemaOrValidator instanceof Validator) {
			validator = schemaOrValidator;
			schema = validator._schemaObj;
		} else {
			schema = schemaOrValidator;
			validator = new Validator(schema);
		}
		const structural = validator.validate(data);
		if (!structural.valid) return structural;
		const refinements = refineLib.getRefinements(schema);
		if (!refinements) return structural;
		const issues = await refineLib.runRefinements(refinements, structural.data !== void 0 ? structural.data : data);
		if (issues.length) return {
			valid: false,
			errors: issues
		};
		return structural;
	}
	async function parseAsync(schemaOrValidator, data) {
		const result = await validateAsync(schemaOrValidator, data);
		if (result.valid) return result.data !== void 0 ? result.data : data;
		const err = /* @__PURE__ */ new Error("ata: async validation failed");
		err.errors = result.errors;
		throw err;
	}
	function version() {
		const native = getNative();
		if (native) return native.version();
		try {
			return require_version();
		} catch {
			return "unknown";
		}
	}
	function _aot() {
		if (_codegen === null) throw new TypeError("The ahead-of-time bundle methods are not part of ata-validator/lite. Import them from ata-validator.");
		return _codegen.aot();
	}
	Validator.bundle = function(schemas, opts) {
		return _aot().bundle(Validator, schemas, opts);
	};
	Validator.bundleStandalone = function(schemas, opts) {
		return _aot().bundleStandalone(Validator, schemas, opts);
	};
	Validator.bundleCompact = function(schemas, opts) {
		return _aot().bundleCompact(Validator, schemas, opts);
	};
	Validator.loadBundle = function(mods, schemas, opts) {
		return _aot().loadBundle(Validator, mods, schemas, opts);
	};
	function parseJSON(input) {
		const native = getNative();
		return native ? native.parseJSON(input) : JSON.parse(input);
	}
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
	function defineSchema(schema) {
		return schema;
	}
	function standardJsonSchema(getSchema) {
		const convert = (options) => {
			const target = options && options.target;
			const schema = getSchema();
			if (schema === true) return {};
			if (schema === false) return { not: {} };
			const declared = typeof schema.$schema === "string" ? schema.$schema : "";
			const dialect = declared === "" || declared.includes("draft/2020-12/schema") ? "draft-2020-12" : declared.includes("draft-07/schema") ? "draft-07" : declared;
			if (target !== dialect) throw new TypeError(`ata-validator cannot provide a ${dialect} schema as ${String(target)}; it does not convert between dialects`);
			return JSON.parse(JSON.stringify(schema));
		};
		return Object.freeze({
			input: convert,
			output: convert
		});
	}
	Object.defineProperty(Validator.prototype, "~standard", {
		configurable: true,
		get() {
			const self = this;
			const std = Object.freeze({
				version: 1,
				vendor: "ata-validator",
				jsonSchema: standardJsonSchema(() => self._rawSchema),
				validate(value) {
					const result = self.validate(value);
					if (result.valid) return { value };
					const raw = typeof result._ataRaw === "function" ? result._ataRaw() : result.errors;
					const issues = new Array(raw.length);
					for (let i = 0; i < raw.length; i++) {
						const err = raw[i];
						const path = err.instancePath != null ? err.instancePath : err.path || "";
						let message = err.message;
						if (!message) message = require_enrich_error().enrich(err, {}).message;
						issues[i] = {
							message,
							path: parsePointerPath(path)
						};
					}
					return { issues };
				}
			});
			Object.defineProperty(this, "~standard", {
				value: std,
				writable: false,
				enumerable: false,
				configurable: false
			});
			return std;
		}
	});
	const _VERDICT_DISAGREES = Object.freeze({
		valid: false,
		errors: Object.freeze([_sharedError({
			keyword: "validation",
			instancePath: "",
			schemaPath: "#",
			params: Object.freeze({}),
			message: "schema validation failed"
		})])
	});
	function _plainBuilders(reject, enrich, root, self, fallback) {
		const rawOf = (data) => {
			const r = reject(data);
			const errors = r && r.errors;
			return errors && errors.length ? errors : fallback;
		};
		return {
			errors: (data) => presentErrors(rawOf(data), data, null, self, root, enrich),
			raw: (data) => {
				const raw = rawOf(data);
				return (needsOrdering(raw) ? sortErrorsBySchemaOrder(root, raw) : raw).map(stripOrdinal);
			}
		};
	}
	function _verboseWrap(inner, root) {
		const { resolvePointer } = require_pointer();
		return (data) => {
			const result = inner(data);
			if (result && !result.valid && result.errors) return {
				valid: false,
				errors: result.errors.map((err) => {
					if (!err || err.parentSchema !== void 0) return err;
					const parentSchema = resolveSchemaByPath(root, err.schemaPath);
					const sp = typeof err.schemaPath === "string" ? err.schemaPath : "";
					const last = sp.slice(sp.lastIndexOf("/") + 1).replace(/~1/g, "/").replace(/~0/g, "~");
					const keywordSchema = parentSchema !== null && typeof parentSchema === "object" && last ? parentSchema[last] : void 0;
					return {
						...err,
						parentSchema,
						schema: keywordSchema,
						data: resolvePointer(data, err.instancePath, void 0)
					};
				})
			};
			return result;
		};
	}
	function _mustReject(r) {
		return r && r.valid === false ? r : _VERDICT_DISAGREES;
	}
	function _bindVerdict(self, fn) {
		const resolve = self._verdictTail;
		if (resolve !== null && typeof fn === "function") {
			const tail = resolve();
			if (typeof tail === "function") fn = _fuseTail(fn, tail);
		}
		self.isValidObject = fn;
	}
	function _bindEntry(self, name, fn) {
		const ext = self._entryExt;
		self[name] = ext !== null && ext[name] ? ext[name](fn) : fn;
	}
	function _jsonEntryWrappers({ check, errors }) {
		const parse = (text) => JSON.parse(typeof text === "string" ? text : new TextDecoder().decode(text));
		return {
			validateJSON: (inner) => (text) => {
				const res = inner(text);
				if (!res.valid) return res;
				let data;
				try {
					data = parse(text);
				} catch {
					return res;
				}
				if (check(data)) return res;
				const e = errors(data);
				return e && e.length ? {
					valid: false,
					errors: e
				} : {
					valid: false,
					errors: [_EXT_FALLBACK]
				};
			},
			isValidJSON: (inner) => (text) => {
				if (!inner(text)) return false;
				let data;
				try {
					data = parse(text);
				} catch {
					return true;
				}
				return check(data);
			},
			validateAndParse: (inner) => (text) => {
				const res = inner(text);
				if (!res.valid) return res;
				if (check(res.value)) return res;
				const e = errors(res.value);
				return {
					valid: false,
					value: res.value,
					errors: e && e.length ? e : [_EXT_FALLBACK]
				};
			}
		};
	}
	const _EXT_FALLBACK = _sharedError({
		keyword: "validation",
		instancePath: "",
		schemaPath: "#",
		params: {},
		message: "schema validation failed"
	});
	function _fuseTail(fn, tail) {
		return (typeof fn._withTail === "function" ? fn._withTail(tail) : null) || ((d) => fn(d) && tail(d));
	}
	var ExtendedRejection = class {
		constructor(inner, data, collect) {
			this.valid = false;
			this._inner = inner;
			this._data = data;
			this._collect = collect;
			this._errors = null;
		}
		toJSON() {
			return {
				valid: false,
				errors: this.errors
			};
		}
		_ataRaw() {
			const inner = this._inner;
			const more = this._collect(this._data) || [];
			const raw = inner.valid ? more : (typeof inner._ataRaw === "function" ? inner._ataRaw() : inner.errors).concat(more);
			return raw.length ? raw : [_EXT_FALLBACK];
		}
	};
	Object.defineProperty(ExtendedRejection.prototype, "errors", {
		enumerable: true,
		configurable: true,
		get() {
			if (this._errors === null) {
				const inner = this._inner;
				const more = this._collect(this._data) || [];
				const all = inner.valid ? more : inner.errors.concat(more);
				this._errors = all.length ? all : [_EXT_FALLBACK];
			}
			return this._errors;
		}
	});
	Validator.prototype._verdictTail = null;
	Validator.prototype._validateTail = null;
	Validator.prototype._entryExt = null;
	function _rememberInstance(self) {
		if (!self._noOpts || self._verdictTail !== null || self._validateTail !== null) return;
		const raw = self._rawSchema;
		if (raw && typeof raw === "object" && !_identityCache.has(raw)) _identityCache.set(raw, self);
		const obj = self._schemaObj;
		if (obj !== raw && obj && typeof obj === "object" && !_identityCache.has(obj)) _identityCache.set(obj, self);
	}
	function _leaveIdentityCache(self) {
		self._noOpts = false;
		if (!self._initialized && self._jsFn === null) return;
		const raw = self._rawSchema;
		if (raw && typeof raw === "object" && _identityCache.get(raw) === self) _identityCache.delete(raw);
		if (Object.prototype.hasOwnProperty.call(self, "_schemaObj")) {
			const obj = self._schemaObj;
			if (obj && typeof obj === "object" && _identityCache.get(obj) === self) _identityCache.delete(obj);
		}
	}
	Validator.prototype._extendValidate = function(resolve) {
		if (typeof resolve !== "function") throw new TypeError("_extendValidate expects a function");
		if (this._initialized) throw new Error("_extendValidate must be called before the validator compiles");
		_leaveIdentityCache(this);
		const prev = this._validateTail;
		this._validateTail = prev === null ? resolve : () => {
			const a = prev(), b = resolve();
			if (!a) return b;
			if (!b) return a;
			return {
				check: (d) => a.check(d) && b.check(d),
				errors: (d) => {
					const x = a.errors(d), y = b.errors(d);
					if (!x) return y;
					if (!y) return x;
					return x.concat(y);
				}
			};
		};
		return this;
	};
	Validator.prototype.parse = function(data) {
		let fn = this._parseFn;
		if (fn === void 0) {
			fn = _buildParse(this);
			Object.defineProperty(this, "_parseFn", {
				value: fn,
				writable: true,
				configurable: true,
				enumerable: false
			});
		}
		return fn(data);
	};
	function _buildParse(self) {
		const decline = (why, instead = "Use validate() with removeAdditional instead.") => () => {
			throw new TypeError(`parse() is not available for this validator: ${why}. ${instead}`);
		};
		const o = self._options;
		if (o.coerceTypes) return decline("coerceTypes rewrites the input before it is checked");
		if (o.removeAdditional === "all") return decline("removeAdditional: 'all' decides the kept keys at check time");
		if (self._usesKeywords) return decline("custom keywords are in use, and what they accept is not known to the copy");
		const extended = self._verdictTail !== null || self._validateTail !== null;
		if (_codegen === null) return decline("ata-validator/lite has no code generator to build the copy with", "Use parse() from ata-validator, or validate(); a valid result carries the input as it is.");
		return _codegen.buildParse(self, decline, extended);
	}
	Validator.prototype._extendChecks = function(resolve) {
		if (typeof resolve !== "function") throw new TypeError("_extendChecks expects a function");
		this._extendValidate(resolve);
		return this._extendVerdict(() => {
			const x = resolve();
			return x ? x.check : null;
		});
	};
	Object.defineProperty(Validator.prototype, "_externalChecks", {
		configurable: true,
		get() {
			if (this._validateTail !== null && this._validateTail()) return true;
			if (this._verdictTail !== null && typeof this._verdictTail() === "function") return true;
			return false;
		}
	});
	Validator.prototype._extendVerdict = function(resolve) {
		if (typeof resolve !== "function") throw new TypeError("_extendVerdict expects a function");
		_leaveIdentityCache(this);
		const prev = this._verdictTail;
		this._verdictTail = prev === null ? resolve : () => {
			const a = prev(), b = resolve();
			if (typeof a !== "function") return b;
			if (typeof b !== "function") return a;
			return (d) => a(d) && b(d);
		};
		if (Object.prototype.hasOwnProperty.call(this, "isValidObject")) _bindVerdict(this, this.isValidObject);
		return this;
	};
	function _defineLazyMethod(name, maker) {
		Object.defineProperty(Validator.prototype, name, {
			configurable: true,
			get() {
				const fn = maker(this);
				Object.defineProperty(this, name, {
					value: fn,
					writable: true,
					configurable: true,
					enumerable: true
				});
				return fn;
			},
			set(fn) {
				Object.defineProperty(this, name, {
					value: fn,
					writable: true,
					configurable: true,
					enumerable: true
				});
			}
		});
	}
	for (const [name, pick] of [
		["_schemaObj", (self) => _materializeSchema(self)],
		["_usesKeywords", (self) => {
			_materializeSchema(self);
			return self._usesKeywords;
		}],
		["_schemaIsCallers", (self) => {
			_materializeSchema(self);
			return self._schemaIsCallers;
		}]
	]) Object.defineProperty(Validator.prototype, name, {
		configurable: true,
		get() {
			return pick(this);
		},
		set(v) {
			Object.defineProperty(this, name, {
				value: v,
				writable: true,
				configurable: true,
				enumerable: true
			});
		}
	});
	Validator.prototype._coldTwin = function() {
		return _codegen === null || _codegen.coldTwin === void 0 ? null : _codegen.coldTwin(this, Validator);
	};
	_defineLazyMethod("validate", (self) => (data) => {
		const t = self._coldTwin();
		if (t !== null) return t.validate(data);
		self._ensureCompiled();
		return self.validate(data);
	});
	_defineLazyMethod("isValidObject", (self) => {
		let bound = false;
		return (data) => {
			if (!bound) {
				const t = self._coldTwin();
				if (t !== null) return t.isValidObject(data);
			}
			if (bound) return self.isValidObject(data);
			bound = true;
			if (self._needsPreprocess() || self._usesKeywords) {
				self._ensureCompiled();
				return self.isValidObject(data);
			}
			if (classify(self._schemaObj).tier === 0) {
				const _plan = buildTier0Plan(self._schemaObj);
				let _n = 0;
				_bindVerdict(self, (d) => {
					const r = tier0Validate(_plan, d);
					if (++_n === 2) try {
						self._ensureCodegen();
					} catch {}
					return r;
				});
			} else {
				try {
					self._ensureCodegen();
				} catch {}
				if (!self._jsFn) self._ensureCompiled();
			}
			return self.isValidObject(data);
		};
	});
	_defineLazyMethod("validateJSON", (self) => (jsonStr) => {
		const t = self._coldTwin();
		if (t !== null) return t.validateJSON(jsonStr);
		self._ensureCompiled();
		return self.validateJSON(jsonStr);
	});
	_defineLazyMethod("isValidJSON", (self) => (jsonStr) => {
		const t = self._coldTwin();
		if (t !== null) return t.isValidJSON(jsonStr);
		self._ensureCompiled();
		return self.isValidJSON(jsonStr);
	});
	_defineLazyMethod("validateAndParse", (self) => (jsonStr) => {
		let value;
		try {
			value = JSON.parse(typeof jsonStr === "string" ? jsonStr : new TextDecoder().decode(jsonStr));
		} catch (e) {
			return {
				valid: false,
				value: void 0,
				errors: [{
					code: "ATA9001",
					message: "invalid JSON: " + e.message,
					keyword: "__parse__",
					instancePath: "",
					schemaPath: "",
					params: {}
				}]
			};
		}
		const r = self.validate(value);
		return {
			valid: r.valid,
			value,
			errors: r.errors
		};
	});
	for (const name of [
		"isValid",
		"isValidPrepadded",
		"isValidParallel",
		"isValidNDJSON",
		"countValid",
		"batchIsValid"
	]) _defineLazyMethod(name, (self) => (...args) => {
		self._installBufferApis(name);
		return self[name](...args);
	});
	module.exports = {
		Validator,
		compile,
		validate,
		validateAsync,
		parseAsync,
		version,
		createPaddedBuffer,
		SIMDJSON_PADDING,
		parseJSON,
		defineSchema
	};
	Object.defineProperty(module.exports, "_registerCodegen", {
		value: _registerCodegen,
		enumerable: false
	});
	Object.defineProperty(module.exports, "_internals", {
		value: {
			_jsonSyntaxRejection,
			ABORT_EARLY_RESULT,
			HYBRID_TIER_CALLS,
			SIMDJSON_THRESHOLD,
			VALID_RESULT,
			_bindEntry,
			_bindVerdict,
			_compileCache,
			_compileCacheSet,
			_mustReject,
			_rememberInstance,
			_verboseWrap,
			compileCacheKey,
			getNative,
			isV1Dialect,
			resolveSchemaByPath
		},
		enumerable: false
	});
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/regex-linear.js
var require_regex_linear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { parse } = require_safe_regex();
	const NATIVE_ESCAPES = /* @__PURE__ */ new Set([
		"d",
		"D",
		"w",
		"W",
		"s",
		"S",
		"n",
		"r",
		"t",
		"f",
		"v",
		".",
		"\\",
		"/",
		"^",
		"$",
		"|",
		"?",
		"*",
		"+",
		"(",
		")",
		"[",
		"]",
		"{",
		"}",
		"-",
		"x",
		"u"
	]);
	function nativeIsLinear(src) {
		if (typeof src !== "string" || src.length > 512) return false;
		for (let i = 0; i < src.length; i++) {
			const c = src.charCodeAt(i);
			if (c >= 55296 && c <= 57343) return false;
			if (src[i] === "\\") {
				const e = src[i + 1];
				if (!NATIVE_ESCAPES.has(e)) return false;
				if (e === "x" && !/^[0-9a-fA-F]{2}$/.test(src.slice(i + 2, i + 4))) return false;
				if (e === "u" && !/^[0-9a-fA-F]{4}$/.test(src.slice(i + 2, i + 6))) return false;
				i++;
			}
		}
		let ast;
		try {
			ast = parse(src);
		} catch {
			return false;
		}
		let unbounded = 0;
		let bounded = 0;
		let ok = true;
		const atom = (n) => n.t === "char" || n.t === "class" || n.t === "any";
		const walk = (n) => {
			if (!ok) return;
			switch (n.t) {
				case "star":
				case "plus":
					if (!atom(n.child)) ok = false;
					unbounded++;
					break;
				case "quest":
					if (!atom(n.child)) ok = false;
					bounded += 1;
					break;
				case "repeat":
					if (!atom(n.child)) ok = false;
					if (n.max === Infinity) unbounded++;
					else bounded += n.max - n.min;
					break;
				case "group":
					walk(n.child);
					break;
				case "concat":
					n.parts.forEach(walk);
					break;
				case "alt": n.opts.forEach(walk);
			}
		};
		walk(ast);
		if (!ok || unbounded > 1 || bounded > 64) return false;
		if (unbounded === 1) {
			let top = ast;
			while (top.t === "group") top = top.child;
			const branches = top.t === "alt" ? top.opts : [top];
			const first = (n) => {
				while (n && n.t === "group") n = n.child;
				return n && n.t === "concat" ? first(n.parts[0]) : n;
			};
			if (!branches.every((b) => {
				const f = first(b);
				return f && f.t === "bol";
			})) return false;
		}
		return true;
	}
	module.exports = { nativeIsLinear };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/formats-source.js
var require_formats_source = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { DURATION_RE, URI_TEMPLATE_EXPR, URI_FAST } = require_formats();
	const uriCharsSource = (v, from) => `for(let _ri=${from};_ri<${v}.length;_ri++){const _rc=${v}.charCodeAt(_ri);if(_rc<33||_rc>126||_rc===34||_rc===60||_rc===62||_rc===92||_rc===94||_rc===96||_rc===123||_rc===124||_rc===125)return false;if(_rc===37){const _h1=${v}.charCodeAt(_ri+1),_h2=${v}.charCodeAt(_ri+2);if(!((_h1>=48&&_h1<=57)||(_h1>=97&&_h1<=102)||(_h1>=65&&_h1<=70))||!((_h2>=48&&_h2<=57)||(_h2>=97&&_h2<=102)||(_h2>=65&&_h2<=70)))return false;_ri+=2}}`;
	const uriAuthoritySource = (v, start) => `if(${v}.charCodeAt(${start})===47&&${v}.charCodeAt(${start}+1)===47){let _ae=${v}.length;for(let _ai=${start}+2;_ai<${v}.length;_ai++){const _ac=${v}.charCodeAt(_ai);if(_ac===47||_ac===63||_ac===35){_ae=_ai;break}}const _au=${v}.slice(${start}+2,_ae);const _aat=_au.lastIndexOf('@');if(_aat!==-1&&/[[\\]]/.test(_au.slice(0,_aat)))return false;const _hp=_aat===-1?_au:_au.slice(_aat+1);if(_hp.charCodeAt(0)===91){const _cl=_hp.indexOf("]");if(_cl===-1)return false;const _rs=_hp.slice(_cl+1);if(_rs!==""){if(_rs.charCodeAt(0)!==58||!/^[0-9]*\$/.test(_rs.slice(1)))return false}}else{const _co=_hp.lastIndexOf(":");if(_co!==-1){if(_hp.indexOf(":")!==_co)return false;if(!/^[0-9]*\$/.test(_hp.slice(_co+1)))return false}}}`;
	const iriCharsSource = (v, from) => `for(let _ii=${from};_ii<${v}.length;_ii++){const _ic=${v}.charCodeAt(_ii);if(_ic===127||(_ic<127&&(_ic<33||_ic===34||_ic===60||_ic===62||_ic===92||_ic===94||_ic===96||_ic===123||_ic===124||_ic===125)))return false;if(_ic===37){const _j1=${v}.charCodeAt(_ii+1),_j2=${v}.charCodeAt(_ii+2);if(!((_j1>=48&&_j1<=57)||(_j1>=97&&_j1<=102)||(_j1>=65&&_j1<=70))||!((_j2>=48&&_j2<=57)||(_j2>=97&&_j2<=102)||(_j2>=65&&_j2<=70)))return false;_ii+=2}}`;
	function iriSource(v, isStr) {
		return guard(v, isStr, `const _n=${v}.length;if(_n===0)return false;const _f=${v}.charCodeAt(0);if(!((_f>=97&&_f<=122)||(_f>=65&&_f<=90)))return false;let _co=-1;for(let _i=1;_i<_n;_i++){const _c=${v}.charCodeAt(_i);if(_c===58){_co=_i;break}if(!((_c>=48&&_c<=57)||(_c>=97&&_c<=122)||(_c>=65&&_c<=90)||_c===43||_c===45||_c===46))return false}if(_co===-1)return false;` + iriCharsSource(v, "_co+1") + uriAuthoritySource(v, "_co+1"));
	}
	function iriReferenceSource(v, isStr) {
		return guard(v, isStr, iriCharsSource(v, "0"));
	}
	function idnEmailSource(v, isStr) {
		const inner = `const _at=${v}.lastIndexOf('@');if(_at<=0||_at===${v}.length-1)return false;const _lp=${v}.slice(0,_at),_dm=${v}.slice(_at+1);if(_lp.charCodeAt(0)===34){if(_lp.length<2||_lp.charCodeAt(_lp.length-1)!==34||_dm.length===0)return false}else{if(_lp.charCodeAt(0)===46||_lp.charCodeAt(_lp.length-1)===46)return false;if(_lp.indexOf('..')!==-1)return false;if(_dm.charCodeAt(0)===91){if(_dm.charCodeAt(_dm.length-1)!==93||_dm.length<=2)return false}else{if(_dm.charCodeAt(0)===46||_dm.charCodeAt(_dm.length-1)===46)return false;if(_dm.indexOf('..')!==-1)return false;for(let _di=0;_di<_dm.length;_di++){const _dc=_dm.charCodeAt(_di);if(_dc<=32||_dc===127||_dc===64)return false}}}`;
		return isStr ? `{${inner}}` : `if(typeof ${v}==='string'){${inner}}`;
	}
	function noReservedSource(v, from) {
		return `if(/[^\\u0021-\\u007e]/.test(${v})){for(let _ri=${from};_ri<${v}.length;_ri++){const _rc=${v}.charCodeAt(_ri);if(_rc>32&&_rc<127)continue;if(_rc<=32||_rc===127)return false;if(_rc===160||_rc===5760||(_rc>=8192&&_rc<=8202)||_rc===8232||_rc===8233||_rc===8239||_rc===8287||_rc===12288||_rc===65279)return false}}`;
	}
	function guard(v, isStr, body) {
		return isStr ? `{${body}}` : `if(typeof ${v}==='string'){${body}}`;
	}
	function dateSource(v, isStr) {
		return guard(v, isStr, `if(${v}.length!==10)return false;for(let _i=0;_i<10;_i++){const _c=${v}.charCodeAt(_i);if(_i===4||_i===7){if(_c!==45)return false}else if(_c<48||_c>57)return false}const _m=(${v}.charCodeAt(5)-48)*10+(${v}.charCodeAt(6)-48),_d=(${v}.charCodeAt(8)-48)*10+(${v}.charCodeAt(9)-48);if(_m<1||_m>12||_d<1)return false;const _y=(${v}.charCodeAt(0)-48)*1000+(${v}.charCodeAt(1)-48)*100+(${v}.charCodeAt(2)-48)*10+(${v}.charCodeAt(3)-48);const _dim=_m===2?(((_y%4===0&&_y%100!==0)||_y%400===0)?29:28):((_m===4||_m===6||_m===9||_m===11)?30:31);if(_d>_dim)return false`);
	}
	function dateTimeSource(v, isStr) {
		return guard(v, isStr, `const _n=${v}.length;if(_n<20)return false;if(${v}.charCodeAt(4)!==45||${v}.charCodeAt(7)!==45)return false;const _sep=${v}.charCodeAt(10);if(_sep!==84&&_sep!==116)return false;if(${v}.charCodeAt(13)!==58||${v}.charCodeAt(16)!==58)return false;const _y0=${v}.charCodeAt(0)-48,_y1=${v}.charCodeAt(1)-48,_y2=${v}.charCodeAt(2)-48,_y3=${v}.charCodeAt(3)-48;if((_y0>>>0)>9||(_y1>>>0)>9||(_y2>>>0)>9||(_y3>>>0)>9)return false;const _y=_y0*1000+_y1*100+_y2*10+_y3;const _mo0=${v}.charCodeAt(5)-48,_mo1=${v}.charCodeAt(6)-48;if((_mo0>>>0)>9||(_mo1>>>0)>9)return false;const _mo=_mo0*10+_mo1;if(_mo<1||_mo>12)return false;const _dm=_mo===2?(((_y%4===0&&_y%100!==0)||_y%400===0)?29:28):(_mo===4||_mo===6||_mo===9||_mo===11?30:31);const _d0=${v}.charCodeAt(8)-48,_d1=${v}.charCodeAt(9)-48;if((_d0>>>0)>9||(_d1>>>0)>9)return false;const _d=_d0*10+_d1;if(_d<1||_d>_dm)return false;const _h0=${v}.charCodeAt(11)-48,_h1=${v}.charCodeAt(12)-48;if((_h0>>>0)>9||(_h1>>>0)>9||_h0*10+_h1>23)return false;const _mi0=${v}.charCodeAt(14)-48,_mi1=${v}.charCodeAt(15)-48;if((_mi0>>>0)>5||(_mi1>>>0)>9)return false;const _se0=${v}.charCodeAt(17)-48,_se1=${v}.charCodeAt(18)-48;if((_se0>>>0)>6||(_se1>>>0)>9||_se0*10+_se1>60)return false;let _i2=19;if(${v}.charCodeAt(19)===46){_i2=20;const _st=_i2;while(_i2<_n){const _c2=${v}.charCodeAt(_i2);if(_c2<48||_c2>57)break;_i2++}if(_i2===_st)return false}const _tz=${v}.charCodeAt(_i2);let _dtoff=0;if(_tz===90||_tz===122){if(_i2!==_n-1)return false}else{if(_tz!==43&&_tz!==45)return false;if(_n-_i2!==6)return false;const _oh=${v}.charCodeAt(_i2+1),_oh2=${v}.charCodeAt(_i2+2),_om=${v}.charCodeAt(_i2+4),_om2=${v}.charCodeAt(_i2+5);if(_oh<48||_oh>57||_oh2<48||_oh2>57||_om<48||_om>57||_om2<48||_om2>57)return false;if(${v}.charCodeAt(_i2+3)!==58)return false;const _ohv=(_oh-48)*10+(_oh2-48),_omv=(_om-48)*10+(_om2-48);if(_ohv>23||_omv>59)return false;_dtoff=(_tz===43?1:-1)*(_ohv*60+_omv)}if(_se0*10+_se1===60){const _dtu=(((_h0*10+_h1)*60+(_mi0*10+_mi1)-_dtoff)%1440+1440)%1440;if(_dtu!==1439)return false}`);
	}
	function hostnameRangeSource(v, st, en) {
		return `const _st=${st},_en=${en},_n=_en-_st;if(_n===0||_n>253)return false;let _ll=0,_pv=46;for(let _i=_st;_i<_en;_i++){const _c=${v}.charCodeAt(_i);if(_c===46){if(_ll===0||_pv===45)return false;_ll=0;_pv=_c;continue}const _an=(_c>=48&&_c<=57)||(_c>=97&&_c<=122)||(_c>=65&&_c<=90);if(!_an&&_c!==45)return false;if(_c===45&&_pv===46)return false;if(++_ll>63)return false;_pv=_c}if(_ll===0||_pv===45)return false`;
	}
	function hostnameSource(v, isStr) {
		return guard(v, isStr, hostnameRangeSource(v, "0", `${v}.length`));
	}
	function uuidSource(v, isStr) {
		const run = (from, to) => `for(let _ui=${from};_ui<${to};_ui++){const _uc=${v}.charCodeAt(_ui);if(!((_uc-48>>>0)<10||((_uc|32)-97>>>0)<6))return false}`;
		return guard(v, isStr, `if(${v}.length!==36)return false;if(${v}.charCodeAt(8)!==45||${v}.charCodeAt(13)!==45||${v}.charCodeAt(18)!==45||${v}.charCodeAt(23)!==45)return false;` + run(0, 8) + run(9, 13) + run(14, 18) + run(19, 23) + run(24, 36));
	}
	function timeSource(v, isStr) {
		return guard(v, isStr, `const _n=${v}.length;if(_n<8)return false;const _h1=${v}.charCodeAt(0)-48,_h2=${v}.charCodeAt(1)-48;if((_h1>>>0)>9||(_h2>>>0)>9||_h1*10+_h2>23)return false;if(${v}.charCodeAt(2)!==58||${v}.charCodeAt(5)!==58)return false;const _m1=${v}.charCodeAt(3)-48,_m2=${v}.charCodeAt(4)-48;if((_m1>>>0)>5||(_m2>>>0)>9)return false;const _s1=${v}.charCodeAt(6)-48,_s2=${v}.charCodeAt(7)-48;if((_s1>>>0)>6||(_s2>>>0)>9||_s1*10+_s2>60)return false;let _ti=8;if(_ti<_n&&${v}.charCodeAt(_ti)===46){_ti++;const _tf=_ti;while(_ti<_n){const _tc=${v}.charCodeAt(_ti)-48;if((_tc>>>0)>9)break;_ti++}if(_ti===_tf)return false}if(_ti===_n)return false;const _tz=${v}.charCodeAt(_ti);let _off=0;if(_tz===90||_tz===122){if(_ti!==_n-1)return false}else{if(_tz!==43&&_tz!==45)return false;if(_n-_ti!==6||${v}.charCodeAt(_ti+3)!==58)return false;if((${v}.charCodeAt(_ti+1)-48>>>0)>9||(${v}.charCodeAt(_ti+2)-48>>>0)>9||(${v}.charCodeAt(_ti+4)-48>>>0)>9||(${v}.charCodeAt(_ti+5)-48>>>0)>9)return false;const _oh=(${v}.charCodeAt(_ti+1)-48)*10+(${v}.charCodeAt(_ti+2)-48),_om=(${v}.charCodeAt(_ti+4)-48)*10+(${v}.charCodeAt(_ti+5)-48);if(_oh>23||_om>59)return false;_off=(_tz===43?1:-1)*(_oh*60+_om)}if(_s1*10+_s2===60){const _u=(((_h1*10+_h2)*60+(_m1*10+_m2)-_off)%1440+1440)%1440;if(_u!==1439)return false}`);
	}
	const URI_HELPER_TABLES = "const _uct=new Uint8Array(128);for(let _i=33;_i<127;_i++)_uct[_i]=1;_uct[34]=_uct[60]=_uct[62]=_uct[92]=_uct[94]=_uct[96]=_uct[123]=_uct[124]=_uct[125]=0;const _uch=new Uint8Array(128);for(let _i=48;_i<58;_i++)_uch[_i]=1;for(let _i=97;_i<103;_i++)_uch[_i]=1;for(let _i=65;_i<71;_i++)_uch[_i]=1;const _ucs=new Uint8Array(128);for(let _i=48;_i<58;_i++)_ucs[_i]=1;for(let _i=97;_i<123;_i++)_ucs[_i]=1;for(let _i=65;_i<91;_i++)_ucs[_i]=1;_ucs[43]=1;_ucs[45]=1;_ucs[46]=1;const _ufa=/" + URI_FAST.source + "/";
	const uriHelperSource = (name) => URI_HELPER_TABLES + ";function " + name + "(_s){if(_ufa.test(_s))return true;const _n=_s.length;if(_n===0)return false;let _c=_s.charCodeAt(0);if(_c>127||_ucs[_c]===0||(_c>=48&&_c<=57)||_c===43||_c===45||_c===46)return false;let _co=-1;for(let _i=1;_i<_n;_i++){_c=_s.charCodeAt(_i);if(_c===58){_co=_i;break}if(_c>127||_ucs[_c]===0)return false}if(_co===-1)return false;let _i=_co+1;let _ae=_n;if(_s.charCodeAt(_i)===47&&_s.charCodeAt(_i+1)===47){const _as=_i+2;let _at=-1,_fc=-1,_lc=-1,_br=0,_ba=0,_hs=_as;_ae=-1;for(_i=_as;_i<_n;_i++){_c=_s.charCodeAt(_i);if(_c>127||_uct[_c]===0)return false;if(_c===47||_c===63||_c===35){_ae=_i;break}if(_c===37){const _h1=_s.charCodeAt(_i+1),_h2=_s.charCodeAt(_i+2);if(!(_h1<=127)||!(_h2<=127)||_uch[_h1]===0||_uch[_h2]===0)return false;_i+=2;continue}if(_c===64){_ba=_br;_at=_i;_fc=-1;_lc=-1;_hs=_i+1}else if(_c===58){if(_fc===-1)_fc=_i;_lc=_i}else if(_c===91||_c===93){_br=1}}if(_ae===-1)_ae=_n;if(_at!==-1&&_ba)return false;if(_s.charCodeAt(_hs)===91){let _cl=-1;for(let _j=_hs+1;_j<_ae;_j++){if(_s.charCodeAt(_j)===93){_cl=_j;break}}if(_cl===-1)return false;if(_cl+1!==_ae){if(_s.charCodeAt(_cl+1)!==58)return false;for(let _j=_cl+2;_j<_ae;_j++){const _d=_s.charCodeAt(_j);if(_d<48||_d>57)return false}}}else if(_lc!==-1){if(_fc!==_lc)return false;for(let _j=_lc+1;_j<_ae;_j++){const _d=_s.charCodeAt(_j);if(_d<48||_d>57)return false}}_i=_ae}for(;_i<_n;_i++){_c=_s.charCodeAt(_i);if(_c>127||_uct[_c]===0)return false;if(_c===37){const _h1=_s.charCodeAt(_i+1),_h2=_s.charCodeAt(_i+2);if(!(_h1<=127)||!(_h2<=127)||_uch[_h1]===0||_uch[_h2]===0)return false;_i+=2}}return true;}";
	function uriSource(v, isStr) {
		return guard(v, isStr, `const _n=${v}.length;if(_n===0)return false;const _f=${v}.charCodeAt(0);if(!((_f>=97&&_f<=122)||(_f>=65&&_f<=90)))return false;let _co=-1;for(let _i=1;_i<_n;_i++){const _c=${v}.charCodeAt(_i);if(_c===58){_co=_i;break}if(!((_c>=48&&_c<=57)||(_c>=97&&_c<=122)||(_c>=65&&_c<=90)||_c===43||_c===45||_c===46))return false}if(_co===-1)return false;` + uriCharsSource(v, "_co+1") + uriAuthoritySource(v, "_co+1"));
	}
	function ipv6Source(v, isStr) {
		return guard(v, isStr, `const _n=${v}.length;if(_n<2||_n>45)return false;let _end=_n,_g=0;const _dot=${v}.indexOf('.');if(_dot!==-1){const _lc=${v}.lastIndexOf(':',_dot);if(_lc===-1)return false;{const _f=_lc+1,_t=_n,_ln=_t-_f;if(_ln<7||_ln>15)return false;let _o=0,_val=0,_dg=0;for(let _i=_f;_i<=_t;_i++){const _c=_i<_t?${v}.charCodeAt(_i):46;if(_c===46){if(_dg===0||_val>255)return false;_o++;_val=0;_dg=0;if(_o>4)return false}else if(_c>=48&&_c<=57){if(_dg===1&&_val===0)return false;_val=_val*10+(_c-48);_dg++;if(_dg>3)return false}else return false}if(_o!==4)return false}_end=_lc+1;_g=2}let _cp=false,_dg2=0,_i2=0;if(${v}.charCodeAt(0)===58&&${v}.charCodeAt(1)!==58)return false;while(_i2<_end){const _c2=${v}.charCodeAt(_i2);if(_c2===58){if(_dg2>0){_g++;_dg2=0}if(_i2+1<_n&&${v}.charCodeAt(_i2+1)===58){if(_cp)return false;_cp=true;_i2+=2;if(_i2<_n&&${v}.charCodeAt(_i2)===58)return false;continue}_i2++;if(_i2===_end&&_end===_n)return false;continue}if((_c2>=48&&_c2<=57)||(_c2>=97&&_c2<=102)||(_c2>=65&&_c2<=70)){if(++_dg2>4)return false;_i2++;continue}return false}if(_dg2>0)_g++;if(_g>8)return false;if(_cp){if(_g>=8)return false}else if(_g!==8)return false`);
	}
	function ipv4Source(v, isStr) {
		return guard(v, isStr, `const _n=${v}.length;if(_n<7||_n>15)return false;let _o=0,_val=0,_dg=0;for(let _i=0;_i<=_n;_i++){const _c=_i<_n?${v}.charCodeAt(_i):46;if(_c===46){if(_dg===0||_val>255)return false;_o++;_val=0;_dg=0;if(_o>4)return false}else if(_c>=48&&_c<=57){if(_dg===1&&_val===0)return false;_val=_val*10+(_c-48);_dg++;if(_dg>3)return false}else return false}if(_o!==4)return false`);
	}
	function jsonPointerSource(v, isStr) {
		const body = `{let _ok=${v}==='';if(!_ok&&${v}.charCodeAt(0)===47){_ok=true;for(let _i=0;_i<${v}.length;_i++){if(${v}.charCodeAt(_i)!==126)continue;const _n=${v}.charCodeAt(_i+1);if(_n!==48&&_n!==49){_ok=false;break}}}if(!_ok)return false}`;
		return isStr ? body : `if(typeof ${v}==='string')${body}`;
	}
	function relativeJsonPointerSource(v, isStr) {
		const body = `{let _i=0;while(_i<${v}.length){const _c=${v}.charCodeAt(_i);if(_c<48||_c>57)break;_i++}let _ok=_i>0&&!(_i>1&&${v}.charCodeAt(0)===48);if(_ok){const _r=${v}.slice(_i);if(_r!=='#'){_ok=_r==='';if(!_ok&&_r.charCodeAt(0)===47){_ok=true;for(let _j=0;_j<_r.length;_j++){if(_r.charCodeAt(_j)!==126)continue;const _n=_r.charCodeAt(_j+1);if(_n!==48&&_n!==49){_ok=false;break}}}}}if(!_ok)return false}`;
		return isStr ? body : `if(typeof ${v}==='string')${body}`;
	}
	function uriTemplateSource(v, isStr) {
		const inner = `let _i=0;while(_i<${v}.length){const _c=${v}.charCodeAt(_i);if(_c===125)return false;if(_c!==123&&(_c<=32||_c===127))return false;if(_c!==123){_i++;continue}const _ute=${v}.indexOf('}',_i+1);if(_ute===-1)return false;const _x=${v}.slice(_i+1,_ute);if(_x===''||_x.indexOf('{')!==-1)return false;if(!${URI_TEMPLATE_EXPR.toString()}.test(_x))return false;_i=_ute+1}`;
		return isStr ? `{${inner}}` : `if(typeof ${v}==='string'){${inner}}`;
	}
	const EMAIL_LOCAL_SRC = (v) => `(${v}>32&&${v}<127&&${v}!==34&&${v}!==40&&${v}!==41&&${v}!==44&&${v}!==58&&${v}!==59&&${v}!==60&&${v}!==62&&${v}!==64&&${v}!==91&&${v}!==92&&${v}!==93)`;
	function emailSource(v, isStr) {
		const inner = `const _n0=${v}.length;let _at;if(${v}.charCodeAt(0)===34){_at=${v}.lastIndexOf('@');if(_at<2||_at===_n0-1||_at>64||${v}.charCodeAt(_at-1)!==34)return false}else{if(${v}.charCodeAt(0)===46)return false;_at=-1;let _pd=false;for(let _i=0;_i<_n0;_i++){const _lc=${v}.charCodeAt(_i);if(_lc===64){_at=_i;break}if(!${EMAIL_LOCAL_SRC("_lc")})return false;if(_lc===46){if(_pd)return false;_pd=true}else _pd=false}if(_at<=0||_at===_n0-1||_at>64||${v}.charCodeAt(_at-1)===46)return false}if(${v}.charCodeAt(_at+1)===91){const _dm=${v}.slice(_at+1);if(_dm.charCodeAt(_dm.length-1)!==93||_dm.length<=2)return false;const _in=_dm.slice(1,-1);if(_in.startsWith('IPv6:')){const _i6=_in.slice(5);${ipv6Source("_i6", true)}}else{${ipv4Source("_in", true)}}}else{${hostnameRangeSource(v, "_at+1", `${v}.length`)}}`;
		return isStr ? `{${inner}}` : `if(typeof ${v}==='string'){${inner}}`;
	}
	function durationSource(v, isStr) {
		const inner = `if(!${DURATION_RE.toString()}.test(${v}))return false`;
		return isStr ? inner : `if(typeof ${v}==='string'&&${inner.slice(3)}`;
	}
	module.exports = {
		uriHelperSource,
		uriCharsSource,
		uriAuthoritySource,
		iriSource,
		iriReferenceSource,
		idnEmailSource,
		dateSource,
		ipv4Source,
		dateTimeSource,
		ipv6Source,
		hostnameSource,
		uriSource,
		uuidSource,
		timeSource,
		noReservedSource,
		jsonPointerSource,
		relativeJsonPointerSource,
		uriTemplateSource,
		emailSource,
		durationSource
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/enrich-site.js
var require_enrich_site = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { CODES, codeFor } = require_error_codes();
	const { suggestFor } = require_suggestions();
	const { reprValue, expectedFor, detailFor, rankFor, MISSING, DOC_BASE } = require_enrich_error();
	const NO_EXPECTED = {};
	function errorSite(keyword, schemaPath, params, format) {
		const code = keyword === "required" && typeof schemaPath === "string" && schemaPath.endsWith("/dependentRequired") && "ATA7005" || codeFor(keyword, format) || "ATA9001";
		return {
			code,
			keyword,
			schemaPath,
			docUrl: DOC_BASE + code,
			rank: rankFor(keyword),
			headline: CODES[code] && CODES[code].headline || "validation failed",
			expected: params === void 0 ? NO_EXPECTED : expectedFor({
				keyword,
				params
			})
		};
	}
	function makeRich(site, path, params, message, value, root, spPrefix) {
		const at = !root && root !== 0 && root !== false ? MISSING : value;
		const out = {
			code: site.code,
			message: message || site.headline,
			keyword: site.keyword,
			path,
			expected: site.expected === NO_EXPECTED ? expectedFor({
				keyword: site.keyword,
				params
			}) : site.expected,
			received: at === MISSING ? void 0 : reprValue(at),
			schemaPath: spPrefix === void 0 ? site.schemaPath : spPrefix + site.schemaPath,
			docUrl: site.docUrl,
			instancePath: path,
			dataPath: path,
			params,
			parentSchema: void 0
		};
		const sugg = suggestFor(out, root, at === MISSING ? void 0 : at);
		if (sugg) out.suggestion = sugg;
		const detail = detailFor({
			keyword: site.keyword,
			params
		}, out);
		if (detail !== void 0) out.detail = detail;
		out.rank = site.rank;
		return out;
	}
	module.exports = {
		errorSite,
		makeRich
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/js-compiler.js
var require_js_compiler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DEQ_HELPER = "function _deq(a,b){if(a===b)return true;if(a===null||b===null||typeof a!=='object'||typeof b!=='object')return false;var aa=Array.isArray(a);if(aa!==Array.isArray(b))return false;var i;if(aa){if(a.length!==b.length)return false;for(i=0;i<a.length;i++)if(!_deq(a[i],b[i]))return false;return true}var ka=Object.keys(a);if(ka.length!==Object.keys(b).length)return false;for(i=0;i<ka.length;i++){var k=ka[i];if(!Object.prototype.hasOwnProperty.call(b,k)||!_deq(a[k],b[k]))return false}return true}";
	let _uqSources = null;
	function uqSources() {
		if (_uqSources === null) {
			const u = require_unique_items();
			const compact = (fn) => String(fn).replace(/\n\s*\/\/[^\n]*/g, "").replace(/\n\s*/g, "\n");
			_uqSources = {
				uq: compact(u._uqh) + compact(u._uq),
				uqp: "var _uqpI=0;" + compact(u._uqp)
			};
		}
		return _uqSources;
	}
	function hoistOnce(ctx, key, code) {
		if (ctx[key]) return;
		ctx[key] = true;
		if (ctx.shared) ctx.shared.push(code);
		if (ctx.preamble) ctx.preamble.push(code);
		else if (ctx.helperCode) ctx.helperCode.push(code);
	}
	const AP_LOOKUP_MIN = 128;
	function emitNameLookup(ctx, names) {
		const id = `_apn${ctx.varCounter++}`;
		const decl = `const ${id}=Object.create(null);for(const _apx of [${names.map((n) => JSON.stringify(n)).join(",")}])${id}[_apx]=1`;
		if (ctx.preamble) ctx.preamble.push(decl);
		else if (ctx.helperCode) ctx.helperCode.push(decl);
		else return null;
		return id;
	}
	function apMembershipCheck(ctx, names, v) {
		if (names.length >= AP_LOOKUP_MIN) {
			const id = emitNameLookup(ctx, names);
			if (id !== null) {
				const i = ctx.varCounter++;
				return `var _apk${i}=Object.keys(${v});for(var _api${i}=0;_api${i}<_apk${i}.length;_api${i}++)if(${id}[_apk${i}[_api${i}]]===undefined)return false`;
			}
		}
		if (names.length === 0) return `for(var _k in ${v})return false`;
		return `for(var _k in ${v})if(${names.map((k) => `_k!==${JSON.stringify(k)}`).join("&&")})return false`;
	}
	function emitDeq(ctx) {
		hoistOnce(ctx, "_deqHoisted", DEQ_HELPER);
		return "_deq";
	}
	const PTR_ESC_HELPER = "function _pe(s){for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);if(c===126||c===47)return s.replace(/~/g,'~0').replace(/\\//g,'~1')}return s}";
	function emitPtrEsc(ctx) {
		hoistOnce(ctx, "_peHoisted", PTR_ESC_HELPER);
		return "_pe";
	}
	function emitUq(ctx) {
		emitDeq(ctx);
		hoistOnce(ctx, "_uqHoisted", uqSources().uq);
		return "_uq";
	}
	function emitUqp(ctx) {
		emitUq(ctx);
		hoistOnce(ctx, "_uqpHoisted", uqSources().uqp);
		return "_uqp";
	}
	function emitParamConstant(ctx, value) {
		const name = `_pc${ctx.varCounter++}`;
		const decl = `const ${name}=JSON.parse(${JSON.stringify(JSON.stringify(value))})`;
		if (ctx.preamble) ctx.preamble.push(decl);
		else ctx.helperCode.push(decl);
		return name;
	}
	function emitConstant(ctx, value) {
		if (!ctx._constPool) ctx._constPool = /* @__PURE__ */ new Map();
		const json = JSON.stringify(value);
		let name = ctx._constPool.get(json);
		if (name === void 0) {
			name = "_kv" + ctx._constPool.size;
			ctx._constPool.set(json, name);
			const decl = `const ${name}=JSON.parse(${JSON.stringify(json)})`;
			if (ctx.preamble) ctx.preamble.push(decl);
			else if (ctx.helperCode) ctx.helperCode.push(decl);
		}
		return name;
	}
	function enumCondition(ctx, vals, v) {
		const parts = [];
		const prims = vals.filter((x) => x === null || typeof x !== "object");
		const objs = vals.filter((x) => x !== null && typeof x === "object");
		if (prims.length) parts.push(prims.map((x) => `${v}===${JSON.stringify(x)}`).join("||"));
		if (objs.length) {
			const deq = emitDeq(ctx);
			parts.push(objs.map((o) => `${deq}(${v},${emitConstant(ctx, o)})`).join("||"));
		}
		return parts.filter(Boolean).join("||") || "false";
	}
	const { codeFor } = require_error_codes();
	const { ordinalFor } = require_schema_order();
	const { compileSafe, patternIsSafe } = require_safe_regex();
	let _nativeIsLinear = null;
	const PROP_ESCAPE = /\\[pP]\{/;
	function reFlags(src) {
		if (!PROP_ESCAPE.test(src)) return "";
		try {
			new RegExp(src, "u");
			return "u";
		} catch {
			return "";
		}
	}
	function reFlagArg(jsonLit) {
		let raw;
		try {
			raw = JSON.parse(jsonLit);
		} catch {
			return "";
		}
		return typeof raw === "string" && reFlags(raw) ? ",'u'" : "";
	}
	const useSafeEngine = (src) => {
		if (PROP_ESCAPE.test(src)) return false;
		if (_nativeIsLinear === null) _nativeIsLinear = require_regex_linear().nativeIsLinear;
		if (_nativeIsLinear(src)) return false;
		return patternIsSafe(src);
	};
	function safeReClosure(ctx, src) {
		if (useSafeEngine(src)) {
			ctx.usesSafeRe = true;
			return compileSafe(src);
		}
		return new RegExp(src, reFlags(src));
	}
	const DOC_BASE = "https://ata-validator.com/e/";
	function ordinalField(ctx, schemaPath) {
		if (ctx && ctx.noOrdinal) return "";
		const o = ctx && ctx.rootSchema ? ordinalFor(ctx.rootSchema, unescapeSp(schemaPath)) : null;
		return o === null ? "" : `,_o:${o}`;
	}
	function literalValue(lit) {
		try {
			return Function("return " + lit)();
		} catch {
			throw DECLINE;
		}
	}
	function unescapeSp(sp) {
		return sp.indexOf("\\") === -1 ? sp : sp.replace(/\\u([0-9a-fA-F]{4})|\\(.)/g, (m, h, c) => h !== void 0 ? String.fromCharCode(parseInt(h, 16)) : c);
	}
	const FRAME_INLINE_MAX = 120;
	function buildErrorLiteral(opts) {
		const { keyword, format, schemaPath, sourceMap } = opts;
		let code = keyword === "format" && format ? codeFor("format", format) : codeFor(keyword);
		if (!code) code = "ATA9001";
		const docUrl = DOC_BASE + code;
		let frame = "";
		if (sourceMap && sourceMap.file && sourceMap.map) {
			const ptr = schemaPath && schemaPath.charAt(0) === "#" ? schemaPath.slice(1) : schemaPath || "";
			let hit = sourceMap.map[ptr + "#key"];
			if (!hit) hit = sourceMap.map[ptr];
			if (hit) {
				const line = Array.isArray(hit) ? hit[0] : hit.line;
				const col = Array.isArray(hit) ? hit[1] : hit.col;
				const text = Array.isArray(hit) ? hit[2] : hit.text;
				if (sourceMap.frames && text.length > FRAME_INLINE_MAX) {
					const key = line + ":" + col;
					let f = sourceMap.frames.get(key);
					if (!f) {
						f = {
							line,
							col,
							text,
							index: sourceMap.frames.size
						};
						sourceMap.frames.set(key, f);
					}
					frame = ",schemaSource:__ataSS[" + f.index + "]";
				} else frame = ",schemaSource:Object.freeze({file:" + JSON.stringify(sourceMap.file) + ",line:" + line + ",col:" + col + ",text:" + JSON.stringify(text) + "})";
			}
		}
		return {
			codeStr: code,
			docUrl,
			frame
		};
	}
	function _cpLen(s) {
		const len = s.length;
		for (let i = 0; i < len; i++) if (s.charCodeAt(i) - 55296 >>> 0 < 1024) {
			let n = 0;
			for (const _ of s) n++;
			return n;
		}
		return len;
	}
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
			const hasDynamic = str.includes("\"$dynamicRef\"") || str.includes("\"$dynamicAnchor\"");
			if (!hasDynamic && !str.includes("\"$anchor\"")) return null;
			if (!hasDynamic && hasNestedIdScope(schema)) return null;
		}
		if (!defs && needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (!defs && externalDocsNeedInterpreter(schema, schemaMap)) return null;
		if (!defs && hasSameInstanceRefCycle(schema)) return null;
		if (!defs && bothDefsContainers(schema)) return null;
		if (!defs) {
			const str = JSON.stringify(schema);
			if (str.includes("\"unevaluatedProperties\"") || str.includes("\"unevaluatedItems\"")) return null;
		}
		const rootDefs = defs || collectDefs(schema);
		if (schema.patternProperties !== void 0 || schema.dependentSchemas !== void 0 || schema.propertyDependencies !== void 0 || schema.propertyNames !== void 0) return null;
		const checks = [];
		if (schema.$ref) {
			const refFn = resolveRef(schema.$ref, rootDefs, schemaMap);
			if (!refFn) return null;
			checks.push(refFn);
		}
		if (schema.$dynamicRef) {
			const ref = schema.$dynamicRef;
			const anchorName = ref.startsWith("#") ? ref : "#" + ref;
			const m = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			const entry = rootDefs && (rootDefs[anchorName] || m && rootDefs[m[1]]);
			const fn = entry ? entry.fn : null;
			if (!fn) return null;
			checks.push(fn);
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
			const objStrs = objects.map((v) => _canonical(v));
			checks.push((d) => {
				const key = d === null ? "null" : typeof d === "string" ? "s:" + d : typeof d === "number" || typeof d === "boolean" ? "n:" + d : null;
				if (key !== null && primSet.has(key)) return true;
				const ds = _canonical(d);
				for (let i = 0; i < objStrs.length; i++) if (ds === objStrs[i]) return true;
				for (let i = 0; i < primitives.length; i++) if (d === primitives[i]) return true;
				return false;
			});
		}
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") checks.push((d) => d === cv);
			else {
				const cs = _canonical(cv);
				checks.push((d) => _canonical(d) === cs);
			}
		}
		if (schema.required && Array.isArray(schema.required)) for (const key of schema.required) checks.push((d) => typeof d !== "object" || d === null || Array.isArray(d) || hasOwnKey(d, key));
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const propCheck = compileToJS(prop, rootDefs);
			if (!propCheck) return null;
			checks.push((d) => {
				if (typeof d !== "object" || d === null || !hasOwnKey(d, key)) return true;
				return propCheck(d[key]);
			});
		}
		if (schema.additionalProperties !== void 0) {
			if (schema.additionalProperties === false) {
				const allowed = new Set(Object.keys(schema.properties || {}));
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
			if (typeof d !== "object" || d === null || !hasOwnKey(d, key)) return true;
			for (let i = 0; i < deps.length; i++) if (!hasOwnKey(d, deps[i])) return false;
			return true;
		});
		if (schema.items !== void 0 && schema.items !== true) {
			const itemCheck = compileToJS(schema.items, rootDefs);
			if (!itemCheck) return null;
			const start = Array.isArray(schema.prefixItems) ? schema.prefixItems.length : 0;
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				for (let i = start; i < d.length; i++) if (!itemCheck(d[i])) return false;
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
		if (schema.contains !== void 0) {
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
			checks.push((d) => !Number.isFinite(d) || d >= min);
		}
		if (schema.maximum !== void 0) {
			const max = schema.maximum;
			checks.push((d) => !Number.isFinite(d) || d <= max);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const min = schema.exclusiveMinimum;
			checks.push((d) => !Number.isFinite(d) || d > min);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const max = schema.exclusiveMaximum;
			checks.push((d) => !Number.isFinite(d) || d < max);
		}
		if (schema.multipleOf !== void 0) {
			const div = schema.multipleOf;
			checks.push((d) => {
				if (!Number.isFinite(d)) return true;
				if (div === 0) return false;
				const q = d / div;
				return Number.isInteger(q) || Math.abs(q - Math.round(q)) < 1e-9;
			});
		}
		if (schema.minLength !== void 0) {
			const min = schema.minLength;
			const min2 = min * 2;
			checks.push((d) => typeof d !== "string" || d.length >= min2 || d.length >= min && _cpLen(d) >= min);
		}
		if (schema.maxLength !== void 0) {
			const max = schema.maxLength;
			checks.push((d) => typeof d !== "string" || d.length <= max || d.length <= 2 * max + 1 && _cpLen(d) <= max);
		}
		if (schema.pattern) try {
			const re = useSafeEngine(schema.pattern) ? compileSafe(schema.pattern) : new RegExp(schema.pattern, reFlags(schema.pattern));
			checks.push((d) => typeof d !== "string" || re.test(d));
		} catch {
			return null;
		}
		if (schema.format) {
			const fc = FORMAT_CHECKS[schema.format];
			if (fc) checks.push((d) => typeof d !== "string" || fc(d));
			else if (FORMAT_CODEGEN[schema.format]) return null;
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
			checks.push((d) => typeof d !== "object" || d === null || Array.isArray(d) || Object.keys(d).length >= min);
		}
		if (schema.maxProperties !== void 0) {
			const max = schema.maxProperties;
			checks.push((d) => typeof d !== "object" || d === null || Array.isArray(d) || Object.keys(d).length <= max);
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
		if (schema.not !== void 0) {
			const notFn = compileToJS(schema.not, rootDefs);
			if (!notFn) return null;
			checks.push((d) => !notFn(d));
		}
		if (schema.if !== void 0) {
			const ifFn = compileToJS(schema.if, rootDefs);
			if (!ifFn) return null;
			const thenFn = schema.then !== void 0 ? compileToJS(schema.then, rootDefs) : null;
			const elseFn = schema.else !== void 0 ? compileToJS(schema.else, rootDefs) : null;
			if (schema.then !== void 0 && !thenFn) return null;
			if (schema.else !== void 0 && !elseFn) return null;
			checks.push((d) => {
				if (ifFn(d)) return thenFn ? thenFn(d) : true;
				else return elseFn ? elseFn(d) : true;
			});
		}
		if (!defs && rootDefs && rootDefs[DEF_FAILED]) return null;
		if (checks.length === 0) return () => true;
		if (checks.length === 1) return checks[0];
		return (data) => {
			for (let i = 0; i < checks.length; i++) if (!checks[i](data)) return false;
			return true;
		};
	}
	const DEF_FAILED = Symbol("ata.defFailed");
	function lazyDefEntry(def, defs) {
		let state = 0;
		let compiled = null;
		return {
			get fn() {
				if (state === 0) {
					state = 1;
					compiled = compileToJS(def, defs);
					state = 2;
					if (!compiled) defs[DEF_FAILED] = true;
				}
				if (state === 1) return (d) => compiled ? compiled(d) : false;
				return compiled;
			},
			raw: def
		};
	}
	function collectDefs(schema) {
		const defs = {};
		const raw = schema.$defs || schema.definitions;
		if (raw && typeof raw === "object") for (const [name, def] of Object.entries(raw)) {
			defs[name] = lazyDefEntry(def, defs);
			if (def && typeof def === "object") {
				if (def.$anchor) defs["#" + def.$anchor] = lazyDefEntry(def, defs);
				if (def.$dynamicAnchor) defs["#" + def.$dynamicAnchor] = lazyDefEntry(def, defs);
			}
		}
		if (schema.$anchor && !defs["#" + schema.$anchor]) defs["#" + schema.$anchor] = lazyDefEntry(schema, defs);
		if (schema.$dynamicAnchor && !defs["#" + schema.$dynamicAnchor]) defs["#" + schema.$dynamicAnchor] = lazyDefEntry(schema, defs);
		return defs;
	}
	function walkJsonPointer(root, fragment) {
		if (!fragment || fragment === "/" || fragment === "#") return root;
		const path = fragment.startsWith("#") ? fragment.slice(1) : fragment;
		if (!path.startsWith("/")) return null;
		const parts = path.split("/").slice(1).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let target = root;
		for (const p of parts) {
			if (target == null || typeof target !== "object") return null;
			if (!(p in target)) {
				const alt = p === "definitions" ? "$defs" : p === "$defs" ? "definitions" : p === "items" && Array.isArray(target.prefixItems) ? "prefixItems" : null;
				if (alt !== null && alt in target) {
					target = target[alt];
					continue;
				}
				return null;
			}
			target = target[p];
		}
		return target == null ? null : target;
	}
	function resolveCrossSchemaRef(ref, schemaMap) {
		if (!schemaMap) return null;
		const hashIdx = ref.indexOf("#");
		const baseId = hashIdx >= 0 ? ref.slice(0, hashIdx) : ref;
		const fragment = hashIdx >= 0 ? ref.slice(hashIdx) : "";
		if (!baseId) return null;
		let baseSchema = null;
		let fullId = null;
		if (schemaMap.has(baseId)) {
			baseSchema = schemaMap.get(baseId);
			fullId = baseId;
		} else if (!ref.includes("://")) {
			for (const [id] of schemaMap) if (id.endsWith("/" + baseId)) {
				baseSchema = schemaMap.get(id);
				fullId = id;
				break;
			}
		}
		if (!baseSchema) return null;
		const target = fragment ? walkJsonPointer(baseSchema, fragment) : baseSchema;
		if (target == null) return null;
		return {
			schema: target,
			fullId
		};
	}
	function resolveRef(ref, defs, schemaMap) {
		if (ref === "#") return null;
		if (defs) {
			const m = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m) {
				const entry = defs[m[1]];
				if (entry) return entry.fn || null;
			}
			if (ref.startsWith("#") && !ref.startsWith("#/")) {
				const entry = defs[ref];
				if (entry) return entry.fn || null;
			}
		}
		if (schemaMap && schemaMap.has(ref)) return compileToJS(schemaMap.get(ref), null, schemaMap);
		if (schemaMap && ref.includes("#")) {
			const r = resolveCrossSchemaRef(ref, schemaMap);
			if (r) return compileToJS(r.schema, null, schemaMap);
		}
		if (schemaMap && !ref.includes("://") && !ref.startsWith("#")) {
			for (const [id] of schemaMap) if (id.endsWith("/" + ref)) return compileToJS(schemaMap.get(id), null, schemaMap);
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
	function multipleOfBad(v, m) {
		if (m === 0) return "true";
		return `!(Number.isInteger(${v}/${m})||Math.abs(${v}/${m}-Math.round(${v}/${m}))<1e-9)`;
	}
	const TYPE_CHECKS = {
		string: (d) => typeof d === "string",
		number: (d) => Number.isFinite(d),
		integer: (d) => Number.isInteger(d),
		boolean: (d) => typeof d === "boolean",
		null: (d) => d === null,
		array: (d) => Array.isArray(d),
		object: (d) => typeof d === "object" && d !== null && !Array.isArray(d)
	};
	function _canonical(x) {
		if (x === null || typeof x !== "object") return JSON.stringify(x);
		if (Array.isArray(x)) return "[" + x.map(_canonical).join(",") + "]";
		return "{" + Object.keys(x).sort().map((k) => JSON.stringify(k) + ":" + _canonical(x[k])).join(",") + "}";
	}
	const _formats = {
		...require_formats(),
		...require_formats_source()
	};
	const FORMAT_CHECKS = {
		email: _formats.email,
		"idn-email": _formats.idnEmail,
		date: _formats.date,
		"date-time": _formats.dateTime,
		time: _formats.time,
		duration: _formats.duration,
		uuid: _formats.uuid,
		uri: _formats.uri,
		"uri-reference": _formats.uriReference,
		"uri-template": _formats.uriTemplate,
		iri: _formats.iri,
		"iri-reference": _formats.iriReference,
		ipv4: _formats.ipv4,
		ipv6: _formats.ipv6,
		hostname: _formats.hostname,
		"json-pointer": _formats.jsonPointer,
		"relative-json-pointer": _formats.relativeJsonPointer,
		regex: (s) => {
			try {
				new RegExp(s, "u");
				return true;
			} catch {
				return false;
			}
		}
	};
	const PROTO_NAMES = /* @__PURE__ */ new Set([...Object.getOwnPropertyNames(Object.prototype), "__proto__"]);
	const OWN_HELPER_CODE = {
		_PN: "const _PN=({}).__proto__===Object.prototype;const _OP=Object.prototype;const _gp=Object.getPrototypeOf;",
		_hop: "const _hop=Object.prototype.hasOwnProperty;",
		_h: "function _h(o,k){return _hop.call(o,k)}",
		_ok: "function _ok(o,k){return (_PN?o.__proto__:_gp(o))===_OP||_hop.call(o,k)}",
		_hall: "function _hall(o,ks){for(let i=0;i<ks.length;i++)if(!_hop.call(o,ks[i]))return false;return true}"
	};
	const OWN_HELPER_DEPS = {
		_h: ["_hop"],
		_ok: ["_PN", "_hop"],
		_hall: ["_hop"]
	};
	function useOwnHelper(ctx, name) {
		for (const dep of OWN_HELPER_DEPS[name] || []) useOwnHelper(ctx, dep);
		hoistOnce(ctx, "_own" + name, OWN_HELPER_CODE[name]);
	}
	function protoIs(ctx, v) {
		useOwnHelper(ctx, "_PN");
		return `((_PN?${v}.__proto__:_gp(${v}))===_OP)`;
	}
	function plainFlag(ctx, v) {
		const pk = ctx.plainOf ? ctx.plainOf.get(v) : void 0;
		if (pk !== void 0) (ctx.plainUsed || (ctx.plainUsed = /* @__PURE__ */ new Set())).add(pk);
		return pk;
	}
	function ownKeyExpr(ctx, v, key) {
		const k = JSON.stringify(key);
		const pk = plainFlag(ctx, v);
		useOwnHelper(ctx, PROTO_NAMES.has(key) || pk !== void 0 ? "_h" : "_ok");
		if (PROTO_NAMES.has(key)) return `_h(${v},${k})`;
		return pk !== void 0 ? `(${pk}?${k} in ${v}:_h(${v},${k}))` : `(${k} in ${v}&&_ok(${v},${k}))`;
	}
	function ownGuard(ctx, v, key) {
		const k = JSON.stringify(key);
		const pk = plainFlag(ctx, v);
		useOwnHelper(ctx, PROTO_NAMES.has(key) || pk !== void 0 ? "_h" : "_ok");
		if (PROTO_NAMES.has(key)) return `_h(${v},${k})`;
		return pk !== void 0 ? `(${pk}||_h(${v},${k}))` : `_ok(${v},${k})`;
	}
	function withPlain(schema, v, lines, ctx, run) {
		if (typeof schema !== "object" || schema === null || !(schema.required || schema.properties || schema.dependentRequired || schema.dependentSchemas)) return run();
		if (!ctx.plainOf) ctx.plainOf = /* @__PURE__ */ new Map();
		const name = "_pk" + ctx.varCounter++;
		const at = lines.length;
		const decl = `const ${name}=typeof ${v}==='object'&&${v}!==null&&${protoIs(ctx, v)}`;
		lines.push(decl);
		const prev = ctx.plainOf.get(v);
		ctx.plainOf.set(v, name);
		try {
			return run();
		} finally {
			if (prev === void 0) ctx.plainOf.delete(v);
			else ctx.plainOf.set(v, prev);
			if (!(ctx.plainUsed !== void 0 && ctx.plainUsed.has(name)) && lines[at] === decl) lines.splice(at, 1);
		}
	}
	const _hop = Object.prototype.hasOwnProperty;
	({}).__proto__;
	function hasOwnKey(d, key) {
		return _hop.call(d, key);
	}
	function setOwn(o, k, v) {
		if (k === "__proto__") Object.defineProperty(o, k, {
			value: v,
			writable: true,
			enumerable: true,
			configurable: true
		});
		else o[k] = v;
	}
	const FUSED_REMOVAL_KEYS = /* @__PURE__ */ new Set([
		"type",
		"properties",
		"required",
		"additionalProperties",
		"items",
		"minItems",
		"maxItems",
		"minLength",
		"maxLength",
		"pattern",
		"format",
		"minimum",
		"maximum",
		"exclusiveMinimum",
		"exclusiveMaximum",
		"multipleOf",
		"enum",
		"const",
		"title",
		"description",
		"$comment",
		"$schema"
	]);
	function fusedRemovalNodes(root) {
		const isScalar = (x) => x === null || typeof x !== "object" && typeof x !== "function";
		const safe = (node) => {
			if (typeof node === "boolean") return true;
			if (!node || typeof node !== "object" || Array.isArray(node)) return false;
			for (const k of Object.keys(node)) if (!FUSED_REMOVAL_KEYS.has(k)) return false;
			if (node.enum !== void 0 && !(Array.isArray(node.enum) && node.enum.every(isScalar))) return false;
			if (node.const !== void 0 && !isScalar(node.const)) return false;
			if (node.properties !== void 0) {
				if (!node.properties || typeof node.properties !== "object" || Array.isArray(node.properties)) return false;
				for (const k of Object.keys(node.properties)) if (!safe(node.properties[k])) return false;
			}
			if (node.additionalProperties === false) {
				const declared = node.properties ? Object.keys(node.properties) : [];
				if (declared.length === 0) return false;
				if (Array.isArray(node.required) && node.required.some((r) => !declared.includes(r))) return false;
			} else if (node.additionalProperties !== void 0 && node.additionalProperties !== true && !safe(node.additionalProperties)) return false;
			if (node.items !== void 0 && (Array.isArray(node.items) || !safe(node.items))) return false;
			return true;
		};
		if (!safe(root)) return null;
		const nodes = /* @__PURE__ */ new Set();
		const walk = (node) => {
			if (!node || typeof node !== "object" || !node.properties) return;
			if (node.additionalProperties === false && Object.keys(node.properties).length > 0) nodes.add(node);
			for (const k of Object.keys(node.properties)) {
				const p = node.properties[k];
				if (p && typeof p === "object" && p.properties) walk(p);
			}
		};
		walk(root);
		return nodes.size > 0 ? nodes : null;
	}
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
	function hasNestedIdScope(node, isRoot = true) {
		if (typeof node !== "object" || node === null) return false;
		if (!isRoot && typeof node.$id === "string" && !node.$id.startsWith("#")) return true;
		for (const val of Object.values(node)) {
			if (typeof val !== "object" || val === null) continue;
			if (Array.isArray(val)) {
				for (const item of val) if (hasNestedIdScope(item, false)) return true;
			} else if (hasNestedIdScope(val, false)) return true;
		}
		return false;
	}
	const DECLINE = Symbol("ata.decline");
	const CODE_BUDGET = 16777216;
	let codeBudget = CODE_BUDGET;
	function hoist(ctx, code) {
		ctx.preamble.push(code);
		ctx.preambleChars = (ctx.preambleChars || 0) + code.length;
		if (ctx.preambleChars > codeBudget) throw DECLINE;
	}
	function _setCodeBudget(n) {
		codeBudget = n === void 0 ? CODE_BUDGET : n;
	}
	function nestedGenCode(schema, v, lines, ctx) {
		ctx.nestedBoolean = (ctx.nestedBoolean || 0) + 1;
		try {
			genCode(schema, v, lines, ctx);
		} finally {
			ctx.nestedBoolean--;
		}
	}
	const CYCLE_DEPTH = 512;
	function emitGuardState() {
		return "const _CYC={};const _stk=new Set();let _sd=0,_sg=false\n  ";
	}
	function emitRootGuard(name, args, onRepeat) {
		const call = `${name}_b(${args})`;
		return `function ${name}(${args}){\n  if(_sg){if(typeof d!=='object'||d===null)return ${call};if(_stk.has(d))return ${onRepeat};_stk.add(d);try{return ${call}}finally{_stk.delete(d)}}\n  if(++_sd>${CYCLE_DEPTH})throw _CYC\n  const _r=${call}\n  _sd--\n  return _r\n  }\n  `;
	}
	function emitGuardedRun(attempt, reset, defSets) {
		return `_sd=0\n  try{${attempt}}catch(_err){\n  if(_err!==_CYC)throw _err\n  ${reset}_sg=true;${["_stk.clear()"].concat(defSets.map((n) => `${n}_s.clear()`)).join(";")}\n  try{${attempt}}finally{_sg=false}\n  }\n  `;
	}
	function sharedDefNames(root, defs) {
		const out = /* @__PURE__ */ new Set();
		if (!defs || typeof defs !== "object") return out;
		const counts = /* @__PURE__ */ new Map();
		const seen = /* @__PURE__ */ new WeakSet();
		const walk = (node) => {
			if (node === null || typeof node !== "object" || seen.has(node)) return;
			seen.add(node);
			if (typeof node.$ref === "string") {
				const m = /^#\/(?:\$defs|definitions)\/([^/]+)$/.exec(node.$ref);
				if (m) counts.set(m[1], (counts.get(m[1]) || 0) + 1);
			}
			for (const v of Object.values(node)) walk(v);
		};
		walk(root);
		for (const [name, n] of counts) {
			const def = defs[name];
			if (n >= 2 && def && typeof def === "object" && JSON.stringify(def).length >= SHARED_DEF_MIN_CHARS) out.add(name);
		}
		return out;
	}
	const SHARED_DEF_MIN_CHARS = 120;
	function cyclicDefNames(defs) {
		const out = /* @__PURE__ */ new Set();
		if (!defs || typeof defs !== "object") return out;
		const defNames = new Set(Object.keys(defs));
		const defRefs = {};
		for (const [name, def] of Object.entries(defs)) {
			const refs = [];
			const seen = /* @__PURE__ */ new WeakSet();
			const collectRefs = (node) => {
				if (typeof node !== "object" || node === null) return;
				if (seen.has(node)) return;
				seen.add(node);
				if (node.$ref) {
					const m = /^#\/(?:\$defs|definitions)\/([^/]+)$/.exec(node.$ref);
					if (m && defNames.has(m[1])) refs.push(m[1]);
				}
				for (const val of Object.values(node)) if (typeof val === "object" && val !== null) {
					if (Array.isArray(val)) for (const item of val) collectRefs(item);
					else collectRefs(val);
				}
			};
			collectRefs(def);
			defRefs[name] = refs;
		}
		const visited = /* @__PURE__ */ new Set();
		const inStack = [];
		const dfs = (node) => {
			const at = inStack.indexOf(node);
			if (at !== -1) {
				for (let i = at; i < inStack.length; i++) out.add(inStack[i]);
				return;
			}
			if (visited.has(node)) return;
			visited.add(node);
			inStack.push(node);
			for (const neighbor of defRefs[node] || []) dfs(neighbor);
			inStack.pop();
		};
		for (const name of Object.keys(defRefs)) dfs(name);
		return out;
	}
	const REF_NEUTRAL_SIBLINGS = /* @__PURE__ */ new Set([
		"$ref",
		"$defs",
		"definitions",
		"$schema",
		"$id",
		"$dynamicAnchor",
		"$anchor",
		"$comment",
		"title",
		"description",
		"default",
		"examples",
		"deprecated",
		"readOnly",
		"writeOnly",
		"markdownDescription",
		"deprecationMessage",
		"markdownDeprecationMessage",
		"enumDescriptions",
		"markdownEnumDescriptions",
		"defaultSnippets",
		"doNotSuggest",
		"suggestSortText"
	]);
	const SP_PLACEHOLDER = "@@ata-sp@@";
	function aliasChainEnds(def, defs) {
		const seen = /* @__PURE__ */ new Set();
		let node = def;
		while (node && typeof node === "object" && typeof node.$ref === "string") {
			const m = node.$ref.match(/^#\/(?:\$defs|definitions)\/([^/]+)$/);
			if (!m) return !node.$ref.startsWith("#/");
			const name = m[1].replace(/~1/g, "/").replace(/~0/g, "~");
			if (seen.has(name)) return false;
			seen.add(name);
			node = defs[name];
			if (node === void 0) return false;
		}
		return true;
	}
	function unevalPropsModeled(schema, schemaMap) {
		const own = { ...schema };
		delete own.$defs;
		delete own.definitions;
		if (/"\$(?:ref|dynamicRef|recursiveRef)"/.test(JSON.stringify(own))) return false;
		const fixed = (s) => {
			if (typeof s === "boolean") return true;
			if (typeof s !== "object" || s === null) return false;
			const r = collectEvaluated(s, schemaMap);
			const j = JSON.stringify(s);
			return !r.dynamic && !r.allProps && !j.includes("\"patternProperties\"") && !j.includes("\"unevaluatedProperties\"");
		};
		const allOf = Array.isArray(schema.allOf) ? schema.allOf : [];
		for (const sub of allOf) {
			if (typeof sub === "boolean") continue;
			if (typeof sub !== "object" || sub === null) return false;
			const r = collectEvaluated(sub, schemaMap);
			if (r.dynamic || r.allProps) return false;
			const rest = { ...sub };
			delete rest.patternProperties;
			const j = JSON.stringify(rest);
			if (j.includes("\"patternProperties\"") || j.includes("\"unevaluatedProperties\"")) return false;
		}
		const patterns = !!schema.patternProperties || allOf.some((s) => s && typeof s === "object" && s.patternProperties);
		const branch = schema.anyOf || schema.oneOf;
		if (schema.anyOf && schema.oneOf) return false;
		const hasIf = schema.if !== void 0;
		const hasTE = schema.then !== void 0 || schema.else !== void 0;
		const dep = schema.dependentSchemas;
		if (schema.unevaluatedProperties !== false) {
			if (hasIf || hasTE || dep || patterns) return false;
			return !branch || branch.every(fixed);
		}
		if (hasIf && hasTE && !branch && !schema.patternProperties && !dep) {
			if (patterns) return false;
			if (!fixed(schema.if) || schema.then !== void 0 && !fixed(schema.then) || schema.else !== void 0 && !fixed(schema.else)) return false;
			const ifNames = typeof schema.if === "object" ? collectEvaluated(schema.if, schemaMap).props : [];
			const declared = typeof schema.if === "object" && schema.if.properties ? Object.keys(schema.if.properties) : [];
			return ifNames.length === declared.length && ifNames.every((k) => declared.includes(k));
		}
		if (branch) return !hasIf && !hasTE && !dep && !patterns && branch.every(fixed);
		if (dep) return !hasIf && !hasTE && !patterns && Object.values(dep).every(fixed);
		if (hasTE) return false;
		if (hasIf) {
			if (typeof schema.if === "boolean") return true;
			if (typeof schema.if !== "object" || schema.if === null) return false;
			const r = collectEvaluated(schema.if, schemaMap);
			if (r.dynamic || r.allProps || r.props.length) return false;
			const rest = { ...schema.if };
			delete rest.patternProperties;
			const j = JSON.stringify(rest);
			if (j.includes("\"patternProperties\"") || j.includes("\"unevaluatedProperties\"")) return false;
		}
		return true;
	}
	const _refStrings = /* @__PURE__ */ new WeakMap();
	function refStringsOf(node) {
		let set = _refStrings.get(node);
		if (set !== void 0) return set;
		set = /* @__PURE__ */ new Set();
		const seen = /* @__PURE__ */ new Set();
		const walk = (n) => {
			if (n === null || typeof n !== "object" || seen.has(n)) return;
			seen.add(n);
			if (Array.isArray(n)) {
				for (const x of n) walk(x);
				return;
			}
			if (typeof n.$ref === "string") set.add(n.$ref);
			for (const k of Object.keys(n)) if (k !== "enum" && k !== "const" && k !== "default" && k !== "examples") walk(n[k]);
		};
		walk(node);
		_refStrings.set(node, set);
		return set;
	}
	function codegenSafe(schema, schemaMap) {
		if (typeof schema === "boolean") return true;
		if (typeof schema !== "object" || schema === null) return true;
		if (schema.propertyDependencies !== void 0) return false;
		if (schema.$dynamicRef && !schema.$dynamicRef.startsWith("#")) return false;
		if (schema.properties) for (const v of Object.values(schema.properties)) {
			if (typeof v === "boolean") continue;
			if (!codegenSafe(v, schemaMap)) return false;
		}
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
			if (!isLocal && !isResolvable && schemaMap && schema.$ref.includes("#") && !schema.$ref.startsWith("#")) {
				const r = resolveCrossSchemaRef(schema.$ref, schemaMap);
				if (r) {
					isResolvable = true;
					resolvedTarget = r.schema;
				}
			}
			const isAnchorRef = !isLocal && !isResolvable && schema.$ref.length > 1 && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/");
			if (!isLocal && !isResolvable && !isAnchorRef) return false;
			if (!resolvedTarget && isResolvable) resolvedTarget = schemaMap.get(schema.$ref);
			if (resolvedTarget && JSON.stringify(resolvedTarget).includes("\"$dynamicRef\"")) {
				if (!(canResolveDynamicRefs(resolvedTarget, schema, schemaMap) && resolvedTarget.additionalProperties === void 0 && !resolvedTarget.patternProperties && !resolvedTarget.dependentSchemas && !resolvedTarget.propertyNames) && schema.unevaluatedProperties === void 0 && schema.unevaluatedItems === void 0) return false;
			}
		}
		if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null) {
			if (!codegenSafe(schema.additionalProperties, schemaMap)) return false;
		}
		if (schema.unevaluatedProperties !== void 0) {
			if (typeof schema.unevaluatedProperties === "object" && schema.unevaluatedProperties !== null) {
				if (!codegenSafe(schema.unevaluatedProperties, schemaMap)) return false;
			}
			if (schema.unevaluatedProperties === false || typeof schema.unevaluatedProperties === "object" && schema.unevaluatedProperties !== null) collectEvaluated(schema, schemaMap);
		}
		if (schema.unevaluatedItems !== void 0) {
			if (JSON.stringify(schema).includes("\"contains\"")) return false;
			if (typeof schema.unevaluatedItems === "object" && schema.unevaluatedItems !== null) {
				if (!codegenSafe(schema.unevaluatedItems, schemaMap)) return false;
			}
		}
		const defs = schema.$defs || schema.definitions;
		if (defs) {
			new Set(Object.keys(defs));
			for (const [name, def] of Object.entries(defs)) {
				if (/[~/"']/.test(name) && refStringsOf(schema).has("#/" + (schema.$defs === defs ? "$defs" : "definitions") + "/" + name.replace(/~/g, "~0").replace(/\//g, "~1"))) return false;
				if (typeof def === "boolean") return false;
				if (typeof def === "object" && def !== null) {
					if (def.$id && !def.$id.startsWith("#")) return false;
					if (def.$ref && !aliasChainEnds(def, defs)) return false;
					if (!codegenSafe(def, schemaMap)) return false;
				}
			}
		}
		if (schema.patternProperties) {
			for (const [pat, sub] of Object.entries(schema.patternProperties)) if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return false;
		}
		if (schema.dependentSchemas) {
			for (const sub of Object.values(schema.dependentSchemas)) if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return false;
		}
		if (typeof schema.propertyNames === "object" && schema.propertyNames !== null && !isSimplePN(schema.propertyNames) && !codegenSafe(schema.propertyNames, schemaMap)) return false;
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
			if (s === void 0 || s === null || typeof s === "boolean") continue;
			if (!codegenSafe(s, schemaMap)) return false;
		}
		return true;
	}
	const SUBSCHEMA_MAPS = [
		"properties",
		"patternProperties",
		"$defs",
		"definitions",
		"dependentSchemas"
	];
	const SUBSCHEMA_LISTS = [
		"allOf",
		"anyOf",
		"oneOf",
		"prefixItems"
	];
	const SUBSCHEMA_SINGLES = [
		"items",
		"additionalItems",
		"contains",
		"not",
		"if",
		"then",
		"else",
		"additionalProperties",
		"propertyNames",
		"unevaluatedItems",
		"unevaluatedProperties",
		"contentSchema"
	];
	function refResolves(ref, rootDefs, anchors, schemaMap) {
		if (ref === "#") return true;
		const local = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
		if (local) return !!(rootDefs && rootDefs[local[1]]);
		if (ref.startsWith("#") && !ref.startsWith("#/")) {
			const entry = rootDefs && rootDefs[ref];
			return !!(entry && entry.raw || anchors && anchors[ref]);
		}
		if (ref.startsWith("#")) return false;
		if (!schemaMap) return false;
		if (schemaMap.has(ref)) return true;
		if (!ref.includes("://")) {
			for (const [id] of schemaMap) if (id.endsWith("/" + ref)) return true;
		}
		if (ref.includes("#")) return !!resolveCrossSchemaRef(ref, schemaMap);
		return false;
	}
	function crossDocTarget(ref, schemaMap) {
		if (!schemaMap || ref.startsWith("#")) return null;
		if (schemaMap.has(ref)) return schemaMap.get(ref);
		if (!ref.includes("://")) {
			for (const [id, s] of schemaMap) if (id.endsWith("/" + ref)) return s;
		}
		if (ref.includes("#")) {
			const r = resolveCrossSchemaRef(ref, schemaMap);
			if (r) return r.schema;
		}
		return null;
	}
	function subtreeHasLocalRef(node, seen) {
		if (typeof node !== "object" || node === null || Array.isArray(node)) return false;
		if (seen.has(node)) return false;
		seen.add(node);
		if (typeof node.$ref === "string" && node.$ref.startsWith("#")) return true;
		for (const key of SUBSCHEMA_MAPS) {
			const group = node[key];
			if (group && typeof group === "object" && !Array.isArray(group)) {
				for (const sub of Object.values(group)) if (subtreeHasLocalRef(sub, seen)) return true;
			}
		}
		for (const key of SUBSCHEMA_LISTS) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (subtreeHasLocalRef(sub, seen)) return true;
		}
		for (const key of SUBSCHEMA_SINGLES) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (subtreeHasLocalRef(sub, seen)) return true;
		} else if (subtreeHasLocalRef(node[key], seen)) return true;
		return false;
	}
	function needsBaseTracking(schema, schemaMap, seen) {
		if (!schemaMap || schemaMap.size === 0) return false;
		if (hasNestedIdScope(schema)) return true;
		return refsAreScopeSensitive(schema, schemaMap, seen);
	}
	function refsAreScopeSensitive(node, schemaMap, seen) {
		if (typeof node !== "object" || node === null || Array.isArray(node)) return false;
		if (seen.has(node)) return false;
		seen.add(node);
		const ref = node.$ref;
		if (typeof ref === "string" && !ref.startsWith("#")) {
			const key = ref.split("#")[0];
			if (!schemaMap.has(key) && !ref.includes("://")) return true;
			const target = crossDocTarget(ref, schemaMap);
			if (target && typeof target === "object") {
				if (typeof target.$id === "string" && target.$id !== key) return true;
				if (subtreeHasLocalRef(target, /* @__PURE__ */ new Set()) && refsAreScopeSensitive(target, schemaMap, seen)) return true;
			}
		}
		for (const key of SUBSCHEMA_MAPS) {
			const group = node[key];
			if (group && typeof group === "object" && !Array.isArray(group)) {
				for (const sub of Object.values(group)) if (refsAreScopeSensitive(sub, schemaMap, seen)) return true;
			}
		}
		for (const key of SUBSCHEMA_LISTS) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (refsAreScopeSensitive(sub, schemaMap, seen)) return true;
		}
		for (const key of SUBSCHEMA_SINGLES) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (refsAreScopeSensitive(sub, schemaMap, seen)) return true;
		} else if (refsAreScopeSensitive(node[key], schemaMap, seen)) return true;
		return false;
	}
	function hasUnresolvableRef(node, rootDefs, anchors, schemaMap, seen) {
		if (typeof node !== "object" || node === null || Array.isArray(node)) return false;
		if (seen.has(node)) return false;
		seen.add(node);
		if (typeof node.$ref === "string") {
			if (!refResolves(node.$ref, rootDefs, anchors, schemaMap)) return true;
			const target = crossDocTarget(node.$ref, schemaMap);
			if (target && subtreeHasLocalRef(target, /* @__PURE__ */ new Set())) return true;
		}
		for (const key of SUBSCHEMA_MAPS) {
			const group = node[key];
			if (group && typeof group === "object" && !Array.isArray(group)) {
				for (const sub of Object.values(group)) if (hasUnresolvableRef(sub, rootDefs, anchors, schemaMap, seen)) return true;
			}
		}
		for (const key of SUBSCHEMA_LISTS) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (hasUnresolvableRef(sub, rootDefs, anchors, schemaMap, seen)) return true;
		}
		for (const key of SUBSCHEMA_SINGLES) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (hasUnresolvableRef(sub, rootDefs, anchors, schemaMap, seen)) return true;
		} else if (hasUnresolvableRef(node[key], rootDefs, anchors, schemaMap, seen)) return true;
		return false;
	}
	function collectExternalRefKeys(node, out, seen) {
		if (typeof node !== "object" || node === null) return;
		if (seen.has(node)) return;
		seen.add(node);
		if (Array.isArray(node)) {
			for (const n of node) collectExternalRefKeys(n, out, seen);
			return;
		}
		for (const key of Object.keys(node)) {
			const v = node[key];
			if ((key === "$ref" || key === "$dynamicRef") && typeof v === "string" && !v.startsWith("#")) out.add(v.split("#")[0]);
			else if (typeof v === "object" && v !== null && key !== "enum" && key !== "const" && key !== "default" && key !== "examples") collectExternalRefKeys(v, out, seen);
		}
	}
	function lookupExternal(key, schemaMap) {
		if (schemaMap.has(key)) return schemaMap.get(key);
		if (!key.includes("://")) {
			for (const [id, doc] of schemaMap) if (id.endsWith("/" + key)) return doc;
		}
		return null;
	}
	function reachableExternalDocs(schema, schemaMap) {
		const docs = /* @__PURE__ */ new Set();
		if (!schemaMap || schemaMap.size === 0) return docs;
		const queue = [schema];
		const seenDocs = /* @__PURE__ */ new Set([schema]);
		while (queue.length) {
			const doc = queue.shift();
			const keys = /* @__PURE__ */ new Set();
			collectExternalRefKeys(doc, keys, /* @__PURE__ */ new Set());
			for (const key of keys) {
				const target = lookupExternal(key, schemaMap);
				if (target && !seenDocs.has(target)) {
					seenDocs.add(target);
					docs.add(target);
					queue.push(target);
				}
			}
		}
		return docs;
	}
	function externalDocsNeedInterpreter(schema, schemaMap) {
		for (const doc of reachableExternalDocs(schema, schemaMap)) {
			const str = JSON.stringify(doc);
			if (str.includes("\"$dynamicRef\"") || str.includes("\"$dynamicAnchor\"") || str.includes("\"unevaluatedProperties\"") || str.includes("\"unevaluatedItems\"")) return true;
			if (typeof doc === "object" && doc !== null && hasNestedIdScope(doc)) return true;
		}
		return false;
	}
	const SAME_INSTANCE_LISTS = [
		"allOf",
		"anyOf",
		"oneOf"
	];
	const SAME_INSTANCE_ONE = [
		"not",
		"if",
		"then",
		"else"
	];
	function localPointerTarget(root, ref) {
		if (typeof ref !== "string" || ref.charCodeAt(0) !== 35) return null;
		if (ref === "#") return root;
		if (ref.charCodeAt(1) !== 47) return null;
		let t = root;
		for (let seg of ref.slice(2).split("/")) {
			if (seg.indexOf("%") >= 0) try {
				seg = decodeURIComponent(seg);
			} catch {
				return null;
			}
			seg = seg.replace(/~1/g, "/").replace(/~0/g, "~");
			if (t === null || typeof t !== "object") return null;
			if (!Object.prototype.hasOwnProperty.call(t, seg)) {
				const alias = seg === "definitions" ? "$defs" : seg === "$defs" ? "definitions" : null;
				if (alias === null || !Object.prototype.hasOwnProperty.call(t, alias)) return null;
				seg = alias;
			}
			t = t[seg];
		}
		return t !== null && typeof t === "object" ? t : null;
	}
	function sameInstanceEdges(root, node) {
		const out = [];
		for (const k of SAME_INSTANCE_LISTS) if (Array.isArray(node[k])) {
			for (const x of node[k]) if (x && typeof x === "object") out.push(x);
		}
		for (const k of SAME_INSTANCE_ONE) if (node[k] && typeof node[k] === "object") out.push(node[k]);
		if (node.dependentSchemas && typeof node.dependentSchemas === "object") {
			for (const x of Object.values(node.dependentSchemas)) if (x && typeof x === "object") out.push(x);
		}
		if (typeof node.$ref === "string") {
			const t = localPointerTarget(root, node.$ref);
			if (t) out.push(t);
		}
		return out;
	}
	const _sameInstanceCycleCache = /* @__PURE__ */ new WeakMap();
	function hasSameInstanceRefCycle(root) {
		if (root === null || typeof root !== "object") return false;
		const hit = _sameInstanceCycleCache.get(root);
		if (hit !== void 0) return hit;
		let found = false;
		if (JSON.stringify(root).includes("\"$ref\"")) {
			const nodes = [];
			const seen = /* @__PURE__ */ new Set();
			const collect = (n) => {
				if (n === null || typeof n !== "object" || seen.has(n)) return;
				seen.add(n);
				if (Array.isArray(n)) {
					for (const v of n) collect(v);
					return;
				}
				nodes.push(n);
				for (const [k, v] of Object.entries(n)) {
					if (k === "$defs" || k === "definitions" || k === "enum" || k === "const" || k === "default" || k === "examples") continue;
					collect(v);
				}
				if (typeof n.$ref === "string") collect(localPointerTarget(root, n.$ref));
			};
			collect(root);
			const state = /* @__PURE__ */ new Map();
			const visit = (n) => {
				const st = state.get(n);
				if (st === 1) return true;
				if (st === 2) return false;
				state.set(n, 1);
				for (const m of sameInstanceEdges(root, n)) if (visit(m)) return true;
				state.set(n, 2);
				return false;
			};
			for (const n of nodes) if (visit(n)) {
				found = true;
				break;
			}
		}
		_sameInstanceCycleCache.set(root, found);
		return found;
	}
	function bothDefsContainers(schema) {
		return schema.$defs !== null && typeof schema.$defs === "object" && schema.definitions !== null && typeof schema.definitions === "object";
	}
	let _gateSchema = null;
	let _gateMap = null;
	let _gateOk = false;
	function sharedCodegenGate(schema, schemaMap) {
		if (typeof schema !== "object" || schema === null) return true;
		if (schema === _gateSchema && schemaMap === _gateMap) return _gateOk;
		const ok = sharedCodegenGateUncached(schema, schemaMap);
		_gateSchema = schema;
		_gateMap = schemaMap;
		_gateOk = ok;
		return ok;
	}
	function sharedCodegenGateUncached(schema, schemaMap) {
		if (bothDefsContainers(schema)) return false;
		if (hasSameInstanceRefCycle(schema)) return false;
		if (!codegenSafe(schema, schemaMap)) return false;
		if (needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return false;
		if (externalDocsNeedInterpreter(schema, schemaMap)) return false;
		return true;
	}
	const PN_SUPPORTED = /* @__PURE__ */ new Set([
		"maxLength",
		"minLength",
		"pattern",
		"const",
		"enum"
	]);
	function isSimplePN(pn) {
		if (pn === null || typeof pn !== "object" || Array.isArray(pn)) return false;
		for (const k of Object.keys(pn)) if (k !== "$schema" && !PN_SUPPORTED.has(k)) return false;
		return true;
	}
	const PN_ANNOTATIONS = /* @__PURE__ */ new Set([
		"$schema",
		"$comment",
		"title",
		"description",
		"examples",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly"
	]);
	function simplePropertyNames(pn, defs) {
		const seen = /* @__PURE__ */ new Set();
		while (pn && typeof pn === "object" && typeof pn.$ref === "string") {
			if (Object.keys(pn).some((k) => k !== "$ref" && !PN_ANNOTATIONS.has(k) && !k.startsWith("x-"))) return null;
			const m = pn.$ref.match(/^#\/(?:\$defs|definitions)\/([^/]+)$/);
			if (!m || !defs) return null;
			const name = m[1].replace(/~1/g, "/").replace(/~0/g, "~");
			if (seen.has(name)) return null;
			seen.add(name);
			pn = defs[name];
		}
		if (!pn || typeof pn !== "object" || Array.isArray(pn)) return null;
		const out = {};
		for (const [k, val] of Object.entries(pn)) {
			if (PN_ANNOTATIONS.has(k) || k.startsWith("x-")) continue;
			if (k === "type") {
				if (val === "string" || Array.isArray(val) && val.includes("string")) continue;
				return null;
			}
			if (!PN_SUPPORTED.has(k)) return null;
			setOwn(out, k, val);
		}
		return out;
	}
	const _pnNormalized = /* @__PURE__ */ new WeakMap();
	function normalizePropertyNames(root) {
		if (!root || typeof root !== "object") return root;
		const hit = _pnNormalized.get(root);
		if (hit !== void 0) return hit;
		const out = normalizePropertyNamesWalk(root);
		_pnNormalized.set(root, out);
		return out;
	}
	function normalizePropertyNamesWalk(root) {
		const defs = root.$defs || root.definitions || null;
		const seen = /* @__PURE__ */ new Map();
		const walk = (node) => {
			if (node === null || typeof node !== "object") return node;
			if (seen.has(node)) return seen.get(node);
			seen.set(node, node);
			if (Array.isArray(node)) {
				let out = node;
				node.forEach((n, i) => {
					const w = walk(n);
					if (w !== n) {
						if (out === node) out = node.slice();
						out[i] = w;
					}
				});
				seen.set(node, out);
				return out;
			}
			let out = node;
			const set = (k, v) => {
				if (out === node) out = { ...node };
				setOwn(out, k, v);
			};
			for (const k of SUBSCHEMA_MAPS) {
				const map = node[k];
				if (!map || typeof map !== "object") continue;
				let copy = map;
				for (const [name, sub] of Object.entries(map)) {
					const w = walk(sub);
					if (w !== sub) {
						if (copy === map) copy = { ...map };
						setOwn(copy, name, w);
					}
				}
				if (copy !== map) set(k, copy);
			}
			for (const k of SUBSCHEMA_LISTS) {
				if (!Array.isArray(node[k])) continue;
				const w = walk(node[k]);
				if (w !== node[k]) set(k, w);
			}
			for (const k of SUBSCHEMA_SINGLES) {
				if (k === "propertyNames" || node[k] === null || typeof node[k] !== "object") continue;
				const w = walk(node[k]);
				if (w !== node[k]) set(k, w);
			}
			if (node.propertyNames && typeof node.propertyNames === "object") {
				const simple = simplePropertyNames(node.propertyNames, defs);
				if (simple && JSON.stringify(simple) !== JSON.stringify(node.propertyNames)) set("propertyNames", simple);
			}
			seen.set(node, out);
			return out;
		};
		return walk(root);
	}
	const DEF_REF = /^#\/(?:\$defs|definitions)\/[^/]+$/;
	const _deepRefsNormalized = /* @__PURE__ */ new WeakMap();
	function normalizeDeepRefs(root) {
		if (!root || typeof root !== "object" || Array.isArray(root)) return root;
		const hit = _deepRefsNormalized.get(root);
		if (hit !== void 0) return hit;
		const out = normalizeDeepRefsWalk(root);
		_deepRefsNormalized.set(root, out);
		return out;
	}
	function resolveLocalPointer(root, ref) {
		let node = root;
		const segs = ref.slice(2).split("/");
		for (let i = 0; i < segs.length; i++) {
			let seg = segs[i].replace(/~1/g, "/").replace(/~0/g, "~");
			if (i === 0 && (seg === "definitions" || seg === "$defs") && !Object.prototype.hasOwnProperty.call(node, seg)) seg = seg === "definitions" ? "$defs" : "definitions";
			if (node === null || typeof node !== "object") return void 0;
			if (Array.isArray(node)) {
				if (!/^(?:0|[1-9]\d*)$/.test(seg) || +seg >= node.length) return void 0;
				node = node[+seg];
			} else {
				if (!Object.prototype.hasOwnProperty.call(node, seg)) return void 0;
				node = node[seg];
			}
			if (node !== null && typeof node === "object" && !Array.isArray(node) && typeof node.$id === "string") return void 0;
		}
		if (typeof node === "boolean") return node;
		if (node === null || typeof node !== "object" || Array.isArray(node)) return void 0;
		return node;
	}
	function normalizeDeepRefsWalk(root) {
		const targets = /* @__PURE__ */ new Map();
		const scan = (node, nested, seen) => {
			if (node === null || typeof node !== "object") return;
			if (seen.has(node)) return;
			seen.add(node);
			if (Array.isArray(node)) {
				for (const n of node) scan(n, nested, seen);
				return;
			}
			const inner = nested || node !== root && typeof node.$id === "string";
			if (!inner && typeof node.$ref === "string" && node.$ref.startsWith("#/") && !DEF_REF.test(node.$ref) && !targets.has(node.$ref)) {
				const t = resolveLocalPointer(root, node.$ref);
				if (t !== void 0) targets.set(node.$ref, t);
			}
			for (const k of Object.keys(node)) if (k !== "enum" && k !== "const" && k !== "default" && k !== "examples") scan(node[k], inner, seen);
		};
		scan(root, false, /* @__PURE__ */ new Set());
		if (targets.size === 0) return root;
		const defsKey = root.$defs && typeof root.$defs === "object" ? "$defs" : root.definitions && typeof root.definitions === "object" ? "definitions" : "$defs";
		const existing = root[defsKey] && typeof root[defsKey] === "object" ? root[defsKey] : {};
		const names = /* @__PURE__ */ new Map();
		let n = 0;
		for (const ref of targets.keys()) {
			let name;
			do
				name = "__ata_ptr_" + n++;
			while (Object.prototype.hasOwnProperty.call(existing, name));
			names.set(ref, name);
		}
		const memo = /* @__PURE__ */ new Map();
		const walk = (node, nested) => {
			if (node === null || typeof node !== "object") return node;
			const key = nested ? null : node;
			if (key !== null && memo.has(key)) return memo.get(key);
			if (Array.isArray(node)) {
				let out = node;
				if (key !== null) memo.set(key, out);
				for (let i = 0; i < node.length; i++) {
					const w = walk(node[i], nested);
					if (w !== node[i]) {
						if (out === node) {
							out = node.slice();
							if (key !== null) memo.set(key, out);
						}
						out[i] = w;
					}
				}
				return out;
			}
			if (nested || node !== root && typeof node.$id === "string") return node;
			let out = node;
			memo.set(node, out);
			const own = (k, v) => {
				if (out === node) {
					out = { ...node };
					memo.set(node, out);
				}
				setOwn(out, k, v);
			};
			if (typeof node.$ref === "string" && names.has(node.$ref)) own("$ref", "#/" + defsKey + "/" + names.get(node.$ref));
			for (const k of Object.keys(node)) {
				if (k === "$ref" || k === "enum" || k === "const" || k === "default" || k === "examples") continue;
				const v = node[k];
				if (v === null || typeof v !== "object") continue;
				const w = walk(v, false);
				if (w !== v) own(k, w);
			}
			return out;
		};
		const rewritten = walk(root, false);
		const out = rewritten === root ? { ...root } : rewritten;
		const defs = { ...out[defsKey] && typeof out[defsKey] === "object" ? out[defsKey] : {} };
		for (const [ref, name] of names) {
			const t = targets.get(ref);
			defs[name] = typeof t === "boolean" ? t : walk(t, false);
		}
		out[defsKey] = defs;
		return out;
	}
	const _refsNormalized = /* @__PURE__ */ new WeakMap();
	function normalizeRefs(root, schemaMap) {
		if (!root || typeof root !== "object" || Array.isArray(root)) return root;
		let byMap = _refsNormalized.get(root);
		const mapKey = schemaMap || _refsNormalized;
		if (byMap !== void 0 && byMap.has(mapKey)) return byMap.get(mapKey);
		let out;
		try {
			out = normalizeRefsWalk(root, schemaMap);
		} catch {
			out = null;
		}
		if (out === null) out = normalizeDeepRefs(root);
		if (byMap === void 0) {
			byMap = /* @__PURE__ */ new Map();
			_refsNormalized.set(root, byMap);
		}
		byMap.set(mapKey, out);
		return out;
	}
	const SKIP_VALUE_KEYS = /* @__PURE__ */ new Set([
		"enum",
		"const",
		"default",
		"examples"
	]);
	const LOCAL_ONLY_REF = /^#(?:\/(?:\$defs|definitions)\/[^/~%]+)?$/;
	function refsAllPlainLocal(root, text) {
		if (text.split("\"$id\":").length - 1 > (typeof root.$id === "string" ? 1 : 0) || text.includes("\"$anchor\":")) return false;
		const re = /"\$ref":("(?:[^"\\]|\\.)*")/g;
		let m;
		while ((m = re.exec(text)) !== null) {
			let ref;
			try {
				ref = JSON.parse(m[1]);
			} catch {
				return false;
			}
			if (!LOCAL_ONLY_REF.test(ref)) return false;
		}
		return true;
	}
	const _refFreeLength = /* @__PURE__ */ new WeakMap();
	function normalizeRefsWalk(root, schemaMap) {
		const text = JSON.stringify(root);
		const hasRef = text.includes("\"$ref\"");
		_refFreeLength.set(root, hasRef ? -1 : text.length);
		if (!hasRef) return root;
		if (/"\$(?:dynamicRef|recursiveRef|dynamicAnchor|recursiveAnchor)"/.test(text)) return null;
		if (refsAllPlainLocal(root, text)) return root;
		const { indexSchemas, resolveRef } = require_interpreter()._refInternals;
		const state = indexSchemas(root, schemaMap && schemaMap.size ? schemaMap : null);
		const rootDialect = typeof root.$schema === "string" ? root.$schema.replace(/#$/, "") : null;
		const names = /* @__PURE__ */ new Map();
		const refTarget = /* @__PURE__ */ new Map();
		const visited = /* @__PURE__ */ new Set();
		let fail = false;
		const visit = (node) => {
			if (fail || node === null || typeof node !== "object" || visited.has(node)) return;
			visited.add(node);
			if (Array.isArray(node)) {
				for (const n of node) visit(n);
				return;
			}
			if (node !== root && typeof node.$schema === "string" && rootDialect !== null && node.$schema.replace(/#$/, "") !== rootDialect) {
				fail = true;
				return;
			}
			if (node.$dynamicRef !== void 0 || node.$dynamicAnchor !== void 0 || node.$recursiveRef !== void 0 || node.$recursiveAnchor !== void 0) {
				fail = true;
				return;
			}
			if (typeof node.$ref === "string" && state.nodeBase.has(node)) {
				const base = state.nodeBase.get(node);
				const ref = node.$ref;
				if (!(base === state.rootBase && (ref === "#" || DEF_REF.test(ref) && !/[~%]/.test(ref)))) {
					const { node: t } = resolveRef(ref, base, state);
					if (t === void 0 || typeof t !== "boolean" && (t === null || typeof t !== "object" || Array.isArray(t))) {
						fail = true;
						return;
					}
					refTarget.set(node, t);
					if (t === root) {} else if (typeof t === "object" && !names.has(t)) {
						names.set(t, null);
						visit(t);
					}
					if (typeof t === "boolean" && !names.has(t)) names.set(t, null);
				}
			}
			for (const k of Object.keys(node)) if (!SKIP_VALUE_KEYS.has(k)) visit(node[k]);
		};
		visit(root);
		if (fail) return null;
		if (refTarget.size === 0) return root;
		const defsKey = root.$defs && typeof root.$defs === "object" ? "$defs" : root.definitions && typeof root.definitions === "object" ? "definitions" : "$defs";
		const existing = root[defsKey] && typeof root[defsKey] === "object" ? root[defsKey] : {};
		let n = 0;
		for (const t of names.keys()) {
			let name;
			do
				name = "__ata_ref_" + n++;
			while (Object.prototype.hasOwnProperty.call(existing, name));
			names.set(t, name);
		}
		const memo = /* @__PURE__ */ new Map();
		const walk = (node) => {
			if (node === null || typeof node !== "object") return node;
			if (memo.has(node)) return memo.get(node);
			if (Array.isArray(node)) {
				const out = [];
				memo.set(node, out);
				for (const x of node) out.push(walk(x));
				return out;
			}
			const out = {};
			memo.set(node, out);
			for (const k of Object.keys(node)) {
				if (k === "$id" && node !== root) continue;
				if (k === "$ref" && refTarget.has(node)) {
					const t = refTarget.get(node);
					out.$ref = t === root ? "#" : "#/" + defsKey + "/" + names.get(t);
					continue;
				}
				setOwn(out, k, SKIP_VALUE_KEYS.has(k) ? node[k] : walk(node[k]));
			}
			return out;
		};
		const out = walk(root);
		const defs = { ...out[defsKey] && typeof out[defsKey] === "object" ? out[defsKey] : {} };
		for (const [t, name] of names) defs[name] = typeof t === "boolean" ? t : walk(t);
		out[defsKey] = defs;
		return out;
	}
	function prepareForCodegen(schema, schemaMap) {
		return normalizePropertyNames(normalizeRefs(schema, schemaMap));
	}
	const VERDICT_SPLIT = 65536;
	const EXPANDED_SHARE = 409600;
	const SIZE_SKIPS = /* @__PURE__ */ new Set([
		"$defs",
		"definitions",
		"description",
		"title",
		"examples",
		"default",
		"$comment",
		"markdownDescription",
		"deprecated",
		"readOnly",
		"writeOnly"
	]);
	function expandedChars(root, limit) {
		const defs = root && (root.$defs || root.definitions) || {};
		const memo = /* @__PURE__ */ new Map();
		const size = (n, stack) => {
			if (n === null || typeof n !== "object") return 8;
			let t = 2;
			if (Array.isArray(n)) {
				for (const x of n) {
					t += size(x, stack) + 1;
					if (t > limit) return t;
				}
				return t;
			}
			for (const k of Object.keys(n)) {
				if (SIZE_SKIPS.has(k)) continue;
				const v = n[k];
				if (k === "$ref" && typeof v === "string") {
					const m = /^#\/(?:\$defs|definitions)\/([^/]+)$/.exec(v);
					if (m && defs[m[1]] !== void 0 && !stack.has(m[1])) {
						let d = memo.get(m[1]);
						if (d === void 0) {
							stack.add(m[1]);
							d = size(defs[m[1]], stack);
							stack.delete(m[1]);
							memo.set(m[1], d);
						}
						t += d;
						if (t > limit) return t;
						continue;
					}
				}
				t += k.length + 3 + size(v, stack);
				if (t > limit) return t;
			}
			return t;
		};
		return size(root, /* @__PURE__ */ new Set());
	}
	function sourceSize(lines, ctx) {
		let n = 0;
		for (const l of lines) n += l.length;
		for (const l of ctx.preamble) n += l.length;
		if (ctx.deferredChecks) for (const l of ctx.deferredChecks) n += l.length;
		return n;
	}
	function compileToJSCodegen(schema, schemaMap, userFormats, opts) {
		const inputSchema = schema;
		schema = prepareForCodegen(schema, schemaMap);
		if (typeof schema === "boolean") return schema ? () => true : () => false;
		if (typeof schema !== "object" || schema === null) return null;
		let removeNodes = null;
		if (opts && opts.removeAdditional) {
			removeNodes = fusedRemovalNodes(schema);
			if (removeNodes === null) return null;
		}
		if (!sharedCodegenGate(schema, schemaMap)) return null;
		const rootDefs = schema.$defs || schema.definitions || null;
		if (schema.patternProperties) {
			for (const [pat, sub] of Object.entries(schema.patternProperties)) if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) {
			for (const sub of Object.values(schema.dependentSchemas)) if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !isSimplePN(schema.propertyNames) && !codegenSafe(schema.propertyNames, schemaMap)) return null;
		const anchors = {};
		if (schema.$dynamicAnchor) anchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) anchors["#" + schema.$anchor] = schema;
		if (typeof schema.$id === "string" && schema.$id.startsWith("#")) anchors[schema.$id] = schema;
		if (rootDefs) {
			for (const def of Object.values(rootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) anchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) anchors["#" + def.$anchor] = def;
				if (typeof def.$id === "string" && def.$id.startsWith("#")) anchors[def.$id] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !anchors["#" + ext.$dynamicAnchor]) anchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !anchors["#" + ext.$anchor]) anchors["#" + ext.$anchor] = ext;
				if (typeof ext.$id === "string" && ext.$id.startsWith("#") && !anchors[ext.$id]) anchors[ext.$id] = ext;
			}
		}
		if (hasUnresolvableRef(schema, rootDefs, anchors, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (opts && opts.keywords && usesMacroKeyword(schema, schemaMap, opts.keywords)) return null;
		let ctx, lines;
		const refFree = _refFreeLength.get(inputSchema);
		const shareFirst = refFree !== void 0 && refFree >= 0 && refFree * 8 <= EXPANDED_SHARE ? false : expandedChars(schema, EXPANDED_SHARE) > EXPANDED_SHARE;
		for (const share of shareFirst ? [true] : [false, true]) {
			ctx = {
				varCounter: 0,
				helpers: [],
				helperCode: [],
				preamble: [],
				shared: [],
				closureVars: ["_cpLen"],
				closureVals: [_cpLen],
				rootDefs,
				refStack: /* @__PURE__ */ new Set(),
				schemaMap: schemaMap || null,
				anchors,
				rootSchema: inputSchema,
				userFormats: userFormats || null,
				removeNodes,
				keywords: opts && opts.keywords || null,
				kwEmitted: null,
				shareDefs: share
			};
			if (ctx.keywords) ctx.kwEmitted = /* @__PURE__ */ new Set();
			lines = [];
			try {
				genCode(schema, "d", lines, ctx);
			} catch (e) {
				if (e === DECLINE) return null;
				throw e;
			}
			if (share || sourceSize(lines, ctx) <= VERDICT_SPLIT) break;
		}
		if (ctx.keywords) {
			for (const node of keywordNodes(schema, schemaMap, ctx.keywords)) if (!ctx.kwEmitted.has(node)) return null;
		}
		if (ctx.deferredChecks) for (const dc of ctx.deferredChecks) lines.push(dc);
		if (lines.length === 0) return () => true;
		const checkStr = lines.join("\n  ");
		const closureNames = ctx.closureVars;
		const closureValues = ctx.closureVals;
		for (const code of ctx.helperCode) {
			const safeMatch = code.match(/^const (_re\d+)=__ataSafeRe\((.+)\)$/);
			if (safeMatch) {
				closureNames.push(safeMatch[1]);
				closureValues.push(compileSafe(JSON.parse(safeMatch[2])));
				continue;
			}
			const match = code.match(/^const (_re\d+)=new RegExp\((.+?)(?:,'(u)')?\)$/);
			if (match) {
				closureNames.push(match[1]);
				closureValues.push(new RegExp(JSON.parse(match[2]), match[3] || ""));
			}
		}
		const defSets = ctx.defFns ? Array.from(ctx.defFns.values()) : [];
		const needsGuard = ctx.usesRecursion || defSets.length > 0;
		let body, hybridThunk, tailThunk, resultThunk;
		if (ctx.usesRecursion) {
			const decl = emitRootGuard("_validate", "d", "true") + `function _validate_b(d){\n  ${checkStr}\n  return true\n  }\n  `;
			const run = emitGuardedRun("return _validate(d)", "", defSets);
			body = `${decl}function _run(d){\n  ${run}\n  }\n  return _run(d)`;
			hybridThunk = () => `${decl}function _run(d){\n  ${run}\n  }\n  return _run(d)?R:E(d)`;
			resultThunk = () => `${decl}function _run(d){\n  ${run}\n  }\n  return _run(d)?${RESULT_TRUE}:${RESULT_FALSE}`;
			tailThunk = () => `${decl}function _run(d){\n  ${run}\n  }\n  return _run(d)&&__ataTail(d)`;
		} else if (defSets.length > 0) {
			const run = emitGuardedRun(`return _body(d)`, "", defSets);
			body = `function _body(d){\n  ${checkStr}\n  return true\n  }\n  function _run(d){\n  ${run}\n  }\n  return _run(d)`;
			hybridThunk = () => `function _body(d){\n  ${checkStr}\n  return true\n  }\n  function _run(d){\n  ${run}\n  }\n  return _run(d)?R:E(d)`;
			resultThunk = () => `function _body(d){\n  ${checkStr}\n  return true\n  }\n  function _run(d){\n  ${run}\n  }\n  return _run(d)?${RESULT_TRUE}:${RESULT_FALSE}`;
			tailThunk = () => `function _body(d){\n  ${checkStr}\n  return true\n  }\n  function _run(d){\n  ${run}\n  }\n  return _run(d)&&__ataTail(d)`;
		} else {
			body = checkStr + "\n  return true";
			hybridThunk = () => replaceTopLevel(checkStr + "\n  return R");
			resultThunk = () => replaceTopLevel(checkStr + "\n  return true", `return ${RESULT_TRUE}`, `return ${RESULT_FALSE}`);
			tailThunk = () => replaceTopLevel(checkStr + "\n  return true", "return __ataTail(d)", "return false");
		}
		let hybridBodyMemo;
		const hybridBody = () => hybridBodyMemo === void 0 ? hybridBodyMemo = hybridThunk() : hybridBodyMemo;
		const guardStr = needsGuard ? emitGuardState() : "";
		const preambleStr = guardStr + (ctx.preamble && ctx.preamble.length ? ctx.preamble.join("\n  ") + "\n  " : "");
		try {
			let boolFn;
			if (closureNames.length > 0) boolFn = new Function(...closureNames, `${preambleStr}return function(d){${body}}`)(...closureValues);
			else if (preambleStr) boolFn = new Function(`${preambleStr}return function(d){${body}}`)();
			else boolFn = new Function("d", body);
			let hybridFactory;
			boolFn._hybridFactory = (R, E) => {
				if (hybridFactory === void 0) try {
					hybridFactory = new Function(...closureNames, "R", "E", `${preambleStr}return function(d){${hybridBody()}}`);
				} catch {
					hybridFactory = null;
				}
				return hybridFactory === null ? null : hybridFactory(...closureValues, R, E);
			};
			let resultFactory;
			boolFn._resultFactory = (LR, B, W, EE) => {
				if (resultFactory === void 0) try {
					resultFactory = new Function(...closureNames, "__ataLR", "__ataB", "__ataW", "__ataEE", `${preambleStr}return function(d){${resultThunk()}}`);
				} catch {
					resultFactory = null;
				}
				return resultFactory === null ? null : resultFactory(...closureValues, LR, B, W, EE);
			};
			let tailFactory;
			boolFn._withTail = (tail) => {
				if (tailFactory === void 0) try {
					tailFactory = new Function(...closureNames, "__ataTail", `${preambleStr}return function(d){${tailThunk()}}`);
				} catch {
					tailFactory = null;
				}
				return tailFactory === null ? null : tailFactory(...closureValues, tail);
			};
			const emitHelpers = ctx.helperCode.filter((c) => !/^const _re\d+=(?:__ataSafeRe|new RegExp)\(/.test(c));
			const helperStr = emitHelpers.length ? emitHelpers.join("\n  ") + "\n  " : "";
			boolFn._source = helperStr + body;
			boolFn._preambleSource = preambleStr;
			boolFn._preambleGuard = guardStr;
			boolFn._preambleParts = ctx.preamble ? ctx.preamble.slice() : [];
			boolFn._sharedHelpers = ctx.shared ? ctx.shared.slice() : [];
			Object.defineProperty(boolFn, "_hybridSource", {
				get: () => helperStr + hybridBody(),
				configurable: true,
				enumerable: false
			});
			boolFn._usesSafeRe = !!ctx.usesSafeRe;
			if (ctx.userFormats) {
				const fmtEntries = [];
				for (let i = 0; i < closureNames.length; i++) if (closureNames[i].startsWith("_uf_")) {
					let format = null;
					for (const key of Object.keys(ctx.userFormats)) if (ctx.userFormats[key] === closureValues[i]) {
						format = key;
						break;
					}
					fmtEntries.push({
						name: closureNames[i],
						fn: closureValues[i],
						format
					});
				}
				if (fmtEntries.length) boolFn._formatClosures = fmtEntries;
			}
			{
				const entries = [];
				for (let i = 0; i < closureNames.length; i++) {
					const name = closureNames[i];
					if (name === "_cpLen" || name.startsWith("_uf_")) continue;
					entries.push({
						name,
						val: closureValues[i]
					});
				}
				if (entries.length) boolFn._closures = entries;
			}
			return boolFn;
		} catch {
			return null;
		}
	}
	const RESULT_TRUE = "{valid:true,data:d,errors:__ataEE}";
	const RESULT_FALSE = "new __ataLR(__ataB,d,__ataW)";
	function skipString(code, i) {
		const q = code[i];
		let j = i + 1;
		while (j < code.length) {
			const c = code[j];
			if (c === "\\") {
				j += 2;
				continue;
			}
			if (c === q) return j + 1;
			j++;
		}
		return code.length;
	}
	function replaceTopLevel(code, onTrue = "return R", onFalse = "return E(d)") {
		let result = "", i = 0;
		while (i < code.length) {
			const ch = code[i];
			if (ch === "\"" || ch === "'" || ch === "`") {
				const j = skipString(code, i);
				result += code.slice(i, j);
				i = j;
				continue;
			}
			const isFunctionKw = code.startsWith("function", i) && (i === 0 || /[^a-zA-Z_$]/.test(code[i - 1])) && !/[a-zA-Z0-9_$]/.test(code[i + 8] || "");
			const isArrowBlock = code.startsWith("=>{", i);
			if (isFunctionKw || isArrowBlock) {
				let j = isArrowBlock ? i + 2 : i + 8;
				while (j < code.length && code[j] !== "{") j++;
				result += code.slice(i, j + 1);
				i = j + 1;
				let braceDepth = 1;
				while (i < code.length && braceDepth > 0) {
					const c = code[i];
					if (c === "\"" || c === "'" || c === "`") {
						const k = skipString(code, i);
						result += code.slice(i, k);
						i = k;
						continue;
					}
					if (c === "{") braceDepth++;
					else if (c === "}") braceDepth--;
					result += c;
					i++;
				}
			} else if (code.startsWith("return false", i) && (i + 12 >= code.length || !/[a-zA-Z0-9_$]/.test(code[i + 12]))) {
				result += onFalse;
				i += 12;
			} else if (code.startsWith("return true", i) && (i + 11 >= code.length || !/[a-zA-Z0-9_$]/.test(code[i + 11]))) {
				result += onTrue;
				i += 11;
			} else {
				result += ch;
				i++;
			}
		}
		return result;
	}
	function isPlainContainer(schema) {
		if (typeof schema !== "object" || schema === null) return false;
		if (schema.$ref || schema.$dynamicRef || schema.allOf || schema.anyOf || schema.oneOf || schema.if || schema.not) return false;
		return !!(schema.properties || schema.items || schema.prefixItems);
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
		const isIdent = /^_[a-zA-Z]\w*$/.test(access);
		const bind = (conds) => isIdent ? `if(${conds.join("||").replace(/\b_v\b/g, access)})return false` : `{const _v=${access};if(${conds.join("||")})return false}`;
		if (t === "string") {
			if (schema.pattern || schema.format) return null;
			if (schema.minLength !== void 0 && schema.maxLength !== void 0) {
				const M = schema.minLength;
				const X = schema.maxLength;
				const v2 = isIdent ? access : "_v";
				return `{${isIdent ? "" : `const _v=${access};`}if(typeof ${v2}!=='string')return false;const _lv=${v2}.length;if(_lv<${M}||_lv>${X * 2})return false;if(_lv<${M * 2}||_lv>${X}){const _cp=_cpLen(${v2});if(_cp<${M}||_cp>${X})return false}}`;
			}
			const conds = [`typeof _v!=='string'`];
			if (schema.minLength !== void 0 && schema.minLength > 0) {
				const M = schema.minLength;
				conds.push(`_v.length<${M}`);
				if (M > 1) conds.push(`_v.length<${M * 2}&&_cpLen(_v)<${M}`);
			}
			if (schema.maxLength !== void 0) {
				const X = schema.maxLength;
				if (X === 0) conds.push(`_v.length>0`);
				else {
					conds.push(`_v.length>${X * 2}`);
					conds.push(`_v.length>${X}&&_cpLen(_v)>${X}`);
				}
			}
			if (conds.length < 2) return null;
			return bind(conds);
		}
		if (t === "integer") {
			const conds = [`!Number.isInteger(_v)`];
			if (schema.minimum !== void 0) conds.push(`_v<${schema.minimum}`);
			if (schema.maximum !== void 0) conds.push(`_v>${schema.maximum}`);
			if (schema.exclusiveMinimum !== void 0) conds.push(`_v<=${schema.exclusiveMinimum}`);
			if (schema.exclusiveMaximum !== void 0) conds.push(`_v>=${schema.exclusiveMaximum}`);
			if (schema.multipleOf !== void 0) conds.push(`(${multipleOfBad("_v", schema.multipleOf)})`);
			if (conds.length < 2) return null;
			return bind(conds);
		}
		if (t === "number") {
			const conds = [`!Number.isFinite(_v)`];
			if (schema.minimum !== void 0) conds.push(`_v<${schema.minimum}`);
			if (schema.maximum !== void 0) conds.push(`_v>${schema.maximum}`);
			if (schema.exclusiveMinimum !== void 0) conds.push(`_v<=${schema.exclusiveMinimum}`);
			if (schema.exclusiveMaximum !== void 0) conds.push(`_v>=${schema.exclusiveMaximum}`);
			if (schema.multipleOf !== void 0) conds.push(`(${multipleOfBad("_v", schema.multipleOf)})`);
			if (conds.length < 2) return null;
			return bind(conds);
		}
		return null;
	}
	function _deferOrInline(ctx, lines, v, check) {
		if (v === "d" && !ctx.condDepth) {
			if (!ctx.deferredChecks) ctx.deferredChecks = [];
			ctx.deferredChecks.push(check);
		} else lines.push(check);
	}
	const KW_T_ANY = 127;
	function kwTypeBit(name) {
		switch (name) {
			case "string": return 1;
			case "number": return 2;
			case "integer": return 4;
			case "boolean": return 8;
			case "null": return 16;
			case "object": return 32;
			case "array": return 64;
			default: return KW_T_ANY;
		}
	}
	function kwDataBits(d) {
		switch (typeof d) {
			case "string": return 1;
			case "number":
				if (!isFinite(d)) return 0;
				return Number.isInteger(d) ? 6 : 2;
			case "boolean": return 8;
			case "object":
				if (d === null) return 16;
				return Array.isArray(d) ? 64 : 32;
			default: return 0;
		}
	}
	function genCustomKeywords(schema, v, lines, ctx) {
		for (const key of Object.keys(schema)) {
			const def = ctx.keywords[key];
			if (def === void 0 || def.macro !== null) continue;
			const value = schema[key];
			const dataBits = kwDataBits;
			const T_ANY = KW_T_ANY;
			let mask = T_ANY;
			if (def.types !== null) {
				mask = 0;
				for (const t of def.types) mask |= kwTypeBit(t);
			}
			let fn;
			if (def.compile !== null) {
				fn = def.compile(value, schema);
				if (typeof fn !== "function") throw new Error(`keyword "${key}": compile must return a function`);
			} else {
				const validate = def.validate;
				fn = (data) => validate(value, data, schema);
				fn.source = validate;
			}
			const holder = () => fn.source || fn;
			const check = mask === T_ANY ? (data) => {
				const ok = fn(data);
				const h = holder();
				if (h.errors) h.errors = null;
				return !!ok;
			} : (data) => {
				if ((dataBits(data) & mask) === 0) return true;
				const ok = fn(data);
				const h = holder();
				if (h.errors) h.errors = null;
				return !!ok;
			};
			const name = "_kwc" + ctx.closureVars.length;
			ctx.closureVars.push(name);
			ctx.closureVals.push(check);
			lines.push(`if(!${name}(${v}))return false`);
		}
		ctx.kwEmitted.add(schema);
	}
	const KW_NAME_MAPS = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"$defs",
		"definitions",
		"dependentSchemas",
		"dependentRequired",
		"dependencies",
		"propertyDependencies"
	]);
	function forEachKeywordNode(schema, schemaMap, keywords, visit) {
		const seen = /* @__PURE__ */ new Set();
		const walk = (node, keysAreNames) => {
			if (node === null || typeof node !== "object" || seen.has(node)) return;
			seen.add(node);
			if (Array.isArray(node)) {
				for (const item of node) walk(item, false);
				return;
			}
			let has = false;
			for (const key of Object.keys(node)) {
				if (!keysAreNames && keywords[key] !== void 0) has = true;
				const val = node[key];
				if (val !== null && typeof val === "object") walk(val, !keysAreNames && KW_NAME_MAPS.has(key));
			}
			if (has) visit(node);
		};
		walk(schema, false);
		if (schemaMap) for (const s of schemaMap.values()) walk(s, false);
	}
	function keywordNodes(schema, schemaMap, keywords) {
		const out = [];
		forEachKeywordNode(schema, schemaMap, keywords, (n) => out.push(n));
		return out;
	}
	function usesMacroKeyword(schema, schemaMap, keywords) {
		let macro = false;
		forEachKeywordNode(schema, schemaMap, keywords, (n) => {
			for (const key of Object.keys(n)) if (keywords[key] !== void 0 && keywords[key].macro !== null) macro = true;
		});
		return macro;
	}
	function genCode(schema, v, lines, ctx, knownType) {
		return withPlain(schema, v, lines, ctx, () => genCodeNode(schema, v, lines, ctx, knownType));
	}
	function genCodeNode(schema, v, lines, ctx, knownType) {
		if (schema === false) {
			lines.push("return false");
			return;
		}
		if (schema === true) return;
		if (typeof schema !== "object" || schema === null) return;
		if (ctx.keywords) genCustomKeywords(schema, v, lines, ctx);
		if (!ctx.regExpMap) ctx.regExpMap = /* @__PURE__ */ new Map();
		let ppHandledPropertyNames = false;
		let earlyKeyCount = false;
		const hasSiblings = !!schema.$ref && Object.keys(schema).some((k) => !REF_NEUTRAL_SIBLINGS.has(k) && !k.startsWith("x-"));
		if (schema.$ref) {
			if (genRefNode(schema, v, lines, ctx, knownType, hasSiblings)) return;
		}
		if (schema.$dynamicRef) genDynamicRefNode(schema, v, lines, ctx, knownType);
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		let effectiveType = knownType;
		if (types) {
			if (!knownType) {
				if (types.length === 1) switch (types[0]) {
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
						lines.push(`if(!Number.isFinite(${v}))return false`);
						break;
					case "integer":
						lines.push(`if(!Number.isInteger(${v}))return false`);
						break;
					case "boolean":
						lines.push(`if(typeof ${v}!=='boolean')return false`);
						break;
					case "null": lines.push(`if(${v}!==null)return false`);
				}
				else {
					const conds = types.map((t) => {
						switch (t) {
							case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
							case "array": return `Array.isArray(${v})`;
							case "string": return `typeof ${v}==='string'`;
							case "number": return `Number.isFinite(${v})`;
							case "integer": return `Number.isInteger(${v})`;
							case "boolean": return `typeof ${v}==='boolean'`;
							case "null": return `${v}===null`;
							default: return "true";
						}
					});
					lines.push(`if(!(${conds.join("||")}))return false`);
				}
			}
			if (types.length === 1) effectiveType = types[0];
		}
		const isObj = effectiveType === "object";
		const isArr = effectiveType === "array";
		const isStr = effectiveType === "string";
		const isNum = effectiveType === "number" || effectiveType === "integer";
		const objGuard = isObj ? "" : `typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&`;
		isObj || `${v}${v}`;
		if (schema.enum) lines.push(`if(!(${enumCondition(ctx, schema.enum, v)}))return false`);
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)})return false`);
			else lines.push(`if(!${emitDeq(ctx)}(${v},${emitConstant(ctx, cv)}))return false`);
		}
		const requiredSet = new Set(schema.required || []);
		const hoisted = {};
		if (schema.required && schema.properties && isObj) {
			const reqChecks = [];
			const typed = [];
			for (const key of schema.required) {
				hoisted[key] = `${v}[${JSON.stringify(key)}]`;
				const prop = schema.properties[key];
				if (!(prop && (prop.type || prop.enum || prop.const !== void 0)) || PROTO_NAMES.has(key)) reqChecks.push(`!${ownKeyExpr(ctx, v, key)}`);
				else typed.push(key);
			}
			if (reqChecks.length > 0) lines.push(`if(${reqChecks.join("||")})return false`);
			if (typed.length > 0) {
				useOwnHelper(ctx, "_hall");
				const pk = plainFlag(ctx, v);
				lines.push(`if(!${pk || protoIs(ctx, v)}&&!_hall(${v},${JSON.stringify(typed)}))return false`);
			}
		} else if (schema.required && schema.required.length > 0) {
			const checks = schema.required.map((key) => `!${ownKeyExpr(ctx, v, key)}`);
			if (isObj) lines.push(`if(${checks.join("||")})return false`);
			else lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&(${checks.join("||")}))return false`);
		}
		if (schema.unevaluatedProperties === false && schema.properties && schema.required && isObj) {
			const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
			if (!evalResult.dynamic && !evalResult.allProps) {
				const knownKeys = evalResult.props;
				const propCount = knownKeys.length;
				if (schema.required.length >= propCount && knownKeys.every((k) => schema.required.includes(k)) && propCount > 0) {
					if (propCount <= 15) lines.push(`var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false`);
					else lines.push(`if(Object.keys(${v}).length!==${propCount})return false`);
					earlyKeyCount = true;
				}
			}
		}
		const numGuard = isNum ? "" : `Number.isFinite(${v})&&`;
		if (schema.minimum !== void 0) lines.push(`if(${numGuard}${v}<${schema.minimum})return false`);
		if (schema.maximum !== void 0) lines.push(`if(${numGuard}${v}>${schema.maximum})return false`);
		if (schema.exclusiveMinimum !== void 0) lines.push(`if(${numGuard}${v}<=${schema.exclusiveMinimum})return false`);
		if (schema.exclusiveMaximum !== void 0) lines.push(`if(${numGuard}${v}>=${schema.exclusiveMaximum})return false`);
		if (schema.multipleOf !== void 0) {
			const m = schema.multipleOf;
			const bad = `(${multipleOfBad(v, m)})`;
			lines.push(`if(${numGuard}${bad})return false`);
		}
		if (schema.minLength !== void 0 && schema.maxLength !== void 0) {
			const M = schema.minLength;
			const X = schema.maxLength;
			const lv = `_l${ctx.varCounter++}`;
			const body = `{const ${lv}=${v}.length;if(${lv}<${M}||${lv}>${X * 2})return false;if(${lv}<${M * 2}||${lv}>${X}){const _cp=_cpLen(${v});if(_cp<${M}||_cp>${X})return false}}`;
			lines.push(isStr ? body : `if(typeof ${v}==='string')${body}`);
		} else {
			if (schema.minLength !== void 0 && schema.minLength > 0) {
				const M = schema.minLength;
				const body = M === 1 ? `if(${v}.length<1)return false` : `if(${v}.length<${M})return false;if(${v}.length<${M * 2}&&_cpLen(${v})<${M})return false`;
				lines.push(isStr ? body : `if(typeof ${v}==='string'){${body}}`);
			}
			if (schema.maxLength !== void 0) {
				const X = schema.maxLength;
				const body = X === 0 ? `if(${v}.length>0)return false` : `if(${v}.length>${X * 2})return false;if(${v}.length>${X}&&_cpLen(${v})>${X})return false`;
				lines.push(isStr ? body : `if(typeof ${v}==='string'){${body}}`);
			}
		}
		if (schema.minItems !== void 0) lines.push(isArr ? `if(${v}.length<${schema.minItems})return false` : `if(Array.isArray(${v})&&${v}.length<${schema.minItems})return false`);
		if (schema.maxItems !== void 0) lines.push(isArr ? `if(${v}.length>${schema.maxItems})return false` : `if(Array.isArray(${v})&&${v}.length>${schema.maxItems})return false`);
		if (schema.minProperties !== void 0) lines.push(`if(${objGuard}Object.keys(${v}).length<${schema.minProperties})return false`);
		if (schema.maxProperties !== void 0) lines.push(`if(${objGuard}Object.keys(${v}).length>${schema.maxProperties})return false`);
		if (schema.pattern) {
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) lines.push(isStr ? `if(!(${inlineCheck}))return false` : `if(typeof ${v}==='string'&&!(${inlineCheck}))return false`);
			else {
				const pattern = JSON.stringify(schema.pattern);
				if (!ctx.regExpMap.has(pattern)) {
					const ri = ctx.varCounter++;
					ctx.regExpMap.set(pattern, ri);
					if (useSafeEngine(schema.pattern)) {
						ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
						ctx.usesSafeRe = true;
					} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern}${reFlagArg(pattern)})`);
				}
				const ri = ctx.regExpMap.get(pattern);
				lines.push(isStr ? `if(!_re${ri}.test(${v}))return false` : `if(typeof ${v}==='string'&&!_re${ri}.test(${v}))return false`);
			}
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) lines.push(fc(v, isStr, ctx));
			else if (ctx.userFormats && typeof ctx.userFormats[schema.format] === "function") {
				const closureName = `_uf_${schema.format.replace(/[^a-zA-Z0-9_]/g, "_")}`;
				if (!ctx.closureVars.includes(closureName)) {
					ctx.closureVars.push(closureName);
					ctx.closureVals.push(ctx.userFormats[schema.format]);
				}
				const guard = isStr ? "" : `typeof ${v}==='string'&&`;
				lines.push(`if(${guard}!${closureName}(${v}))return false`);
			}
		}
		if (schema.uniqueItems) genUniqueItemsNode(schema, v, lines, ctx, knownType, hoisted, isArr, types);
		if (schema.additionalProperties === false && schema.properties && !schema.patternProperties && ctx.removeNodes && ctx.removeNodes.has(schema)) {
			const kv = `_rk${ctx.varCounter++}`;
			const declared = Object.keys(schema.properties);
			let loop = `for(var ${kv} in ${v})if(${declared.map((k) => `${kv}!==${JSON.stringify(k)}`).join("&&")})delete ${v}[${kv}]`;
			const req = new Set(schema.required || []);
			if (declared.length <= 15 && declared.every((k) => req.has(k))) {
				const n = `_rn${ctx.varCounter++}`;
				loop = `{var ${n}=0;for(var ${kv} in ${v})${n}++;if(${n}!==${declared.length}){${loop}}}`;
			}
			_deferOrInline(ctx, lines, v, isObj ? loop : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${loop}}`);
		} else if (schema.additionalProperties === false && !schema.patternProperties) {
			const declaredKeys = Object.keys(schema.properties || {});
			const propCount = declaredKeys.length;
			const req = new Set(schema.required || []);
			const inner = !!schema.required && declaredKeys.every((k) => req.has(k)) ? propCount <= 15 ? `var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false` : `if(Object.keys(${v}).length!==${propCount})return false` : apMembershipCheck(ctx, Object.keys(schema.properties || {}), v);
			_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
		}
		if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null && !schema.patternProperties) genAdditionalSchemaNode(schema, v, lines, ctx, knownType, isObj);
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) {
			const depChecks = deps.map((d) => `!${ownKeyExpr(ctx, v, d)}`).join("||");
			lines.push(`if(${objGuard}${ownKeyExpr(ctx, v, key)}&&(${depChecks}))return false`);
		}
		if (schema.patternProperties) {
			if (genPatternPropertiesNode(schema, v, lines, ctx, knownType, isObj)) ppHandledPropertyNames = true;
		}
		if (schema.dependentSchemas) genDependentSchemasNode(schema, v, lines, ctx, knownType, effectiveType, isObj);
		if (schema.propertyNames === false) lines.push(isObj ? `for(const _k in ${v})return false` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k in ${v})return false}`);
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !ppHandledPropertyNames) genPropertyNamesNode(schema, v, lines, ctx, knownType, isObj);
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) if (requiredSet.has(key) && isObj) {
			const access = hoisted[key] || `${v}[${JSON.stringify(key)}]`;
			const combined = tryGenCombined(prop, access, ctx);
			if (combined) lines.push(combined);
			else if (needsLocal(prop) || isPlainContainer(prop)) {
				const local = `_r${ctx.varCounter++}`;
				lines.push(`{const ${local}=${access}`);
				genCode(prop, local, lines, ctx);
				lines.push(`}`);
			} else genCode(prop, access, lines, ctx);
		} else if (isObj) {
			const local = `_o${ctx.varCounter++}`;
			lines.push(`{const ${local}=${v}[${JSON.stringify(key)}];if(${local}!==undefined&&${ownGuard(ctx, v, key)}){`);
			const combined = tryGenCombined(prop, local, ctx);
			if (combined) lines.push(combined);
			else genCode(prop, local, lines, ctx);
			lines.push(`}}`);
		} else {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${ownKeyExpr(ctx, v, key)}){`);
			genCode(prop, `${v}[${JSON.stringify(key)}]`, lines, ctx);
			lines.push(`}`);
		}
		if (schema.items !== void 0 && schema.items !== true) {
			const idx = `_j${ctx.varCounter}`;
			const elem = `_e${ctx.varCounter}`;
			ctx.varCounter++;
			const start = Array.isArray(schema.prefixItems) ? schema.prefixItems.length : 0;
			lines.push(isArr ? `for(let ${idx}=${start};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]` : `if(Array.isArray(${v})){for(let ${idx}=${start};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCode(schema.items, elem, lines, ctx);
			lines.push(isArr ? `}` : `}}`);
		}
		if (schema.prefixItems) genPrefixItemsNode(schema, v, lines, ctx, knownType, isArr);
		if (schema.contains !== void 0) genContainsNode(schema, v, lines, ctx, knownType, isArr);
		if (schema.allOf) for (const sub of schema.allOf) genCode(sub, v, lines, ctx, effectiveType);
		if (schema.anyOf && !unevalChecksAnyOf(schema, ctx)) genAnyOfNode(schema, v, lines, ctx, knownType);
		if (schema.oneOf) genOneOfNode(schema, v, lines, ctx, knownType);
		if (schema.not !== void 0) genNotNode(schema, v, lines, ctx, knownType);
		if (schema.if !== void 0) genIfNode(schema, v, lines, ctx, knownType);
		if (schema.unevaluatedProperties !== void 0) genUnevaluatedPropertiesNode(schema, v, lines, ctx, knownType, isObj, hoisted, earlyKeyCount);
		if (schema.unevaluatedItems !== void 0) genUnevaluatedItemsNode(schema, v, lines, ctx, knownType, isArr);
	}
	function genDynamicRefNode(schema, v, lines, ctx, knownType) {
		const anchorKey = schema.$dynamicRef.startsWith("#") ? schema.$dynamicRef : "#" + schema.$dynamicRef;
		if (ctx.anchors && ctx.anchors[anchorKey]) {
			const target = ctx.anchors[anchorKey];
			if (target === ctx.rootSchema) {
				if (ctx.nestedBoolean) throw DECLINE;
				ctx.usesRecursion = true;
				lines.push(`if(!_validate(${v}))return false`);
			} else {
				const refKey = "$dynamicRef:" + anchorKey;
				if (ctx.refStack.has(refKey) && ctx.nestedBoolean) throw DECLINE;
				if (!ctx.refStack.has(refKey)) {
					ctx.refStack.add(refKey);
					genCode(target, v, lines, ctx, knownType);
					ctx.refStack.delete(refKey);
				}
			}
		}
	}
	function genUniqueItemsNode(schema, v, lines, ctx, knownType, hoisted, isArr, types) {
		const si = ctx.varCounter++;
		const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
		const isPrimItems = itemType === "string" || itemType === "number" || itemType === "integer";
		const maxItems = schema.maxItems;
		let inner;
		if (isPrimItems && maxItems && maxItems <= 16) inner = `for(let _i=1;_i<${v}.length;_i++){for(let _k=0;_k<_i;_k++){if(${v}[_i]===${v}[_k])return false}}`;
		else if (isPrimItems) inner = `const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){if(_s${si}.has(${v}[_i]))return false;_s${si}.add(${v}[_i])}`;
		else if (ctx.preamble) inner = `if(!${emitUq(ctx)}(${v}))return false`;
		else if (ctx.helperCode) inner = `if(!${emitUq(ctx)}(${v}))return false`;
		else inner = `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);if(_s${si}.has(_k))return false;_s${si}.add(_k)}`;
		lines.push(isArr ? `{${inner}}` : `if(Array.isArray(${v})){${inner}}`);
	}
	function genAdditionalSchemaNode(schema, v, lines, ctx, knownType, isObj) {
		const apId = ctx._apLoopId = (ctx._apLoopId || 0) + 1;
		const kVar = `_k${apId}`;
		const avVar = `_av${apId}`;
		const declared = schema.properties ? Object.keys(schema.properties) : [];
		const skipCheck = declared.length === 0 ? null : declared.map((k) => `${kVar}===${JSON.stringify(k)}`).join("||");
		const subLines = [];
		genCode(schema.additionalProperties, avVar, subLines, ctx);
		if (subLines.length > 0) {
			const body = subLines.join(";");
			const loop = skipCheck ? `for(var ${kVar} in ${v}){if(${skipCheck})continue;const ${avVar}=${v}[${kVar}];${body}}` : `for(var ${kVar} in ${v}){const ${avVar}=${v}[${kVar}];${body}}`;
			_deferOrInline(ctx, lines, v, isObj ? loop : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${loop}}`);
		}
	}
	function genDependentSchemasNode(schema, v, lines, ctx, knownType, effectiveType, isObj) {
		for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			const guard = isObj ? "" : `typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&`;
			lines.push(`if(${guard}${ownKeyExpr(ctx, v, key)}){`);
			ctx.condDepth = (ctx.condDepth || 0) + 1;
			genCode(depSchema, v, lines, ctx, effectiveType);
			ctx.condDepth--;
			lines.push(`}`);
		}
	}
	function genPropertyNamesNode(schema, v, lines, ctx, knownType, isObj) {
		const pn = schema.propertyNames;
		const ki = ctx.varCounter++;
		const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
		if (!isSimplePN(pn)) {
			const sub = [];
			genCode(pn, "_pv", sub, ctx);
			if (sub.length === 0) return;
			lines.push(`${guard}{const _pnf${ki}=function(_pv){${sub.join(";")};return true};for(const _k${ki} in ${v}){if(!_pnf${ki}(_k${ki}))return false}}`);
			return;
		}
		lines.push(`${guard}{for(const _k${ki} in ${v}){`);
		if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength})return false`);
		if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength})return false`);
		if (pn.pattern) {
			const fast = fastPrefixCheck(pn.pattern, `_k${ki}`);
			if (fast) lines.push(`if(!(${fast}))return false`);
			else {
				const ri = ctx.varCounter++;
				ctx.closureVars.push(`_re${ri}`);
				ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
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
	function genPrefixItemsNode(schema, v, lines, ctx, knownType, isArr) {
		const pfxVar = ctx.varCounter++;
		for (let i = 0; i < schema.prefixItems.length; i++) {
			const elem = `_p${pfxVar}_${i}`;
			lines.push(isArr ? `if(${v}.length>${i}){const ${elem}=${v}[${i}]` : `if(Array.isArray(${v})&&${v}.length>${i}){const ${elem}=${v}[${i}]`);
			genCode(schema.prefixItems[i], elem, lines, ctx);
			lines.push(`}`);
		}
	}
	function genContainsNode(schema, v, lines, ctx, knownType, isArr) {
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
	function genAnyOfNode(schema, v, lines, ctx, knownType) {
		const fi = ctx.varCounter++;
		const branchBodies = [];
		const reused = [];
		let canHoist = !!ctx.preamble;
		if (canHoist && !ctx.hoistedAny) ctx.hoistedAny = /* @__PURE__ */ new Map();
		for (let i = 0; i < schema.anyOf.length; i++) {
			const sub = schema.anyOf[i];
			const key = canHoist ? branchKey(sub, ctx) : void 0;
			const known = key !== void 0 ? ctx.hoistedAny.get(key) : void 0;
			if (known !== void 0) {
				reused[i] = known.name;
				branchBodies.push(known.body);
				continue;
			}
			const subLines = [];
			genCode(sub, "_av", subLines, ctx);
			const body = subLines.length === 0 ? "return true" : `${subLines.join(";")};return true`;
			if (/\b_validate\b/.test(body)) canHoist = false;
			branchBodies.push(body);
		}
		if (canHoist) {
			const checks = branchBodies.map((body, i) => {
				if (reused[i] !== void 0) return reused[i];
				const name = `_af${fi}_b${i}`;
				hoist(ctx, `function ${name}(_av){${body}}`);
				const key = branchKey(schema.anyOf[i], ctx);
				if (key !== void 0) ctx.hoistedAny.set(key, {
					name,
					body
				});
				return name;
			}).map((n) => `${n}(${v})`).join("||");
			lines.push(`if(!(${checks}))return false`);
		} else {
			const fns = branchBodies.map((body) => `function(_av){${body}}`);
			lines.push(`{const _af${fi}=[${fns.join(",")}];let _am${fi}=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am${fi}=true;break}}if(!_am${fi})return false}`);
		}
	}
	const SCOPE_KEYS = /* @__PURE__ */ new Set([
		"$id",
		"$defs",
		"definitions",
		"$schema",
		"$anchor",
		"$dynamicAnchor"
	]);
	function branchKey(sub, ctx) {
		if (typeof sub !== "object" || sub === null) return void 0;
		if (typeof sub.$ref === "string" && sub.$ref.startsWith("#") && Object.keys(sub).every((k) => REF_NEUTRAL_SIBLINGS.has(k) && !SCOPE_KEYS.has(k) || k.startsWith("x-"))) {
			if (ctx.refKeysSafe === void 0) ctx.refKeysSafe = !hasNestedIdScope(ctx.rootSchema);
			if (ctx.refKeysSafe) return "ref:" + sub.$ref;
		}
		return sub;
	}
	function genOneOfNode(schema, v, lines, ctx, knownType) {
		const fi = ctx.varCounter++;
		const branchBodies = [];
		const reused = [];
		let canHoist = !!ctx.preamble;
		if (canHoist && !ctx.hoistedBranch) ctx.hoistedBranch = /* @__PURE__ */ new Map();
		for (let i = 0; i < schema.oneOf.length; i++) {
			const sub = schema.oneOf[i];
			const key = canHoist ? branchKey(sub, ctx) : void 0;
			const known = key !== void 0 ? ctx.hoistedBranch.get(key) : void 0;
			if (known !== void 0) {
				reused[i] = known.name;
				branchBodies.push(known.body);
				continue;
			}
			const subLines = [];
			genCode(sub, "_ov", subLines, ctx);
			const body = subLines.length === 0 ? "return true" : `${subLines.join(";")};return true`;
			if (/\b_validate\b/.test(body)) canHoist = false;
			branchBodies.push(body);
		}
		if (canHoist) {
			const calls = branchBodies.map((body, i) => {
				if (reused[i] !== void 0) return reused[i];
				const name = `_of${fi}_b${i}`;
				hoist(ctx, `function ${name}(_ov){${body}}`);
				const key = branchKey(schema.oneOf[i], ctx);
				if (key !== void 0) ctx.hoistedBranch.set(key, {
					name,
					body
				});
				return name;
			}).map((n) => `if(${n}(${v})){_oc${fi}++;if(_oc${fi}>1)return false}`).join(";");
			lines.push(`{let _oc${fi}=0;${calls};if(_oc${fi}!==1)return false}`);
		} else {
			const fns = branchBodies.map((body) => `function(_ov){${body}}`);
			lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc${fi}=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc${fi}++;if(_oc${fi}>1)return false}if(_oc${fi}!==1)return false}`);
		}
	}
	function genNotNode(schema, v, lines, ctx, knownType) {
		const subLines = [];
		genCode(schema.not, "_nv", subLines, ctx);
		if (subLines.length === 0) lines.push(`return false`);
		else {
			const fi = ctx.varCounter++;
			lines.push(`{const _nf${fi}=(function(_nv){${subLines.join(";")};return true});if(_nf${fi}(${v}))return false}`);
		}
	}
	function genIfNode(schema, v, lines, ctx, knownType) {
		const ifLines = [];
		genCode(schema.if, "_iv", ifLines, ctx);
		const fi = ctx.varCounter++;
		const ifFn = ifLines.length === 0 ? `function(_iv){return true}` : `function(_iv){${ifLines.join(";")};return true}`;
		let thenFn = "null", elseFn = "null";
		if (schema.then !== void 0) {
			const thenLines = [];
			genCode(schema.then, "_tv", thenLines, ctx);
			thenFn = thenLines.length === 0 ? `function(_tv){return true}` : `function(_tv){${thenLines.join(";")};return true}`;
		}
		if (schema.else !== void 0) {
			const elseLines = [];
			genCode(schema.else, "_ev", elseLines, ctx);
			elseFn = elseLines.length === 0 ? `function(_ev){return true}` : `function(_ev){${elseLines.join(";")};return true}`;
		}
		lines.push(`{const _if${fi}=${ifFn};const _th${fi}=${thenFn};const _el${fi}=${elseFn}`);
		lines.push(`if(_if${fi}(${v})){if(_th${fi}&&!_th${fi}(${v}))return false}else{if(_el${fi}&&!_el${fi}(${v}))return false}}`);
	}
	function genRefNode(schema, v, lines, ctx, knownType, hasSiblings) {
		if (schema.$ref === "#") {
			if (ctx.nestedBoolean) throw DECLINE;
			ctx.usesRecursion = true;
			lines.push(`if(!_validate(${v}))return false`);
			if (!hasSiblings) return true;
		}
		const m = schema.$ref !== "#" && schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
		if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
			const defName = m[1];
			if (!ctx.cyclicDefs) ctx.cyclicDefs = cyclicDefNames(ctx.rootDefs);
			if (ctx.cyclicDefs.has(defName) && ctx.preamble) {
				if (!ctx.defFns) ctx.defFns = /* @__PURE__ */ new Map();
				let fnName = ctx.defFns.get(defName);
				if (!fnName) {
					fnName = "_def" + ctx.defFns.size + "_" + defName.replace(/[^A-Za-z0-9_]/g, "_");
					ctx.defFns.set(defName, fnName);
					const bodyLines = [];
					const outerDeferred = ctx.deferredChecks;
					ctx.deferredChecks = null;
					genCode(ctx.rootDefs[defName], "d", bodyLines, ctx);
					if (ctx.deferredChecks) for (const dc of ctx.deferredChecks) bodyLines.push(dc);
					ctx.deferredChecks = outerDeferred;
					if (bodyLines.some((l) => /\b_validate\b/.test(l))) throw DECLINE;
					hoist(ctx, `const ${fnName}_s=new Set()\n  function ${fnName}(d){\n  if(_sg){if(typeof d!=='object'||d===null)return ${fnName}_b(d);if(${fnName}_s.has(d))return true;${fnName}_s.add(d);try{return ${fnName}_b(d)}finally{${fnName}_s.delete(d)}}\n  if(++_sd>${CYCLE_DEPTH})throw _CYC\n  const _r=${fnName}_b(d)\n  _sd--\n  return _r\n  }\n  function ${fnName}_b(d){${bodyLines.join("\n  ")}\n  return true}`);
				}
				lines.push(`if(!${fnName}(${v}))return false`);
				if (!hasSiblings) return true;
			} else if (ctx.shareDefs && !ctx.refStack.has(schema.$ref) && (ctx.sharedDefs || (ctx.sharedDefs = sharedDefNames(ctx.rootSchema, ctx.rootDefs))).has(defName)) {
				if (!ctx.sharedDefFns) ctx.sharedDefFns = /* @__PURE__ */ new Map();
				let fnName = ctx.sharedDefFns.get(defName);
				if (!fnName) {
					fnName = "_dv" + ctx.sharedDefFns.size + "_" + defName.replace(/[^A-Za-z0-9_]/g, "_");
					ctx.sharedDefFns.set(defName, fnName);
					const bodyLines = [];
					const outerDeferred = ctx.deferredChecks;
					ctx.deferredChecks = null;
					ctx.refStack.add(schema.$ref);
					try {
						genCode(ctx.rootDefs[defName], "d", bodyLines, ctx);
					} finally {
						ctx.refStack.delete(schema.$ref);
					}
					if (ctx.deferredChecks) for (const dc of ctx.deferredChecks) bodyLines.push(dc);
					ctx.deferredChecks = outerDeferred;
					if (bodyLines.some((l) => /\b_validate\b/.test(l))) throw DECLINE;
					hoist(ctx, `function ${fnName}(d){${bodyLines.join("\n  ")}\n  return true}`);
				}
				lines.push(`if(!${fnName}(${v}))return false`);
				if (!hasSiblings) return true;
			} else if (ctx.refStack.has(schema.$ref)) {
				if (ctx.nestedBoolean) throw DECLINE;
				if (!hasSiblings) return true;
			} else {
				ctx.refStack.add(schema.$ref);
				genCode(ctx.rootDefs[defName], v, lines, ctx, knownType);
				ctx.refStack.delete(schema.$ref);
				if (!hasSiblings) return true;
			}
		} else if (schema.$ref !== "#" && !m && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/")) {
			const entry = ctx.rootDefs && ctx.rootDefs[schema.$ref];
			const anchorTarget = entry && entry.raw ? entry.raw : ctx.anchors && ctx.anchors[schema.$ref];
			if (anchorTarget) {
				if (ctx.refStack.has(schema.$ref)) {
					if (ctx.nestedBoolean) throw DECLINE;
					if (!hasSiblings) return true;
				} else {
					ctx.refStack.add(schema.$ref);
					genCode(anchorTarget, v, lines, ctx, knownType);
					ctx.refStack.delete(schema.$ref);
					if (!hasSiblings) return true;
				}
			}
		} else if (schema.$ref !== "#" && ctx.schemaMap) {
			let resolved = ctx.schemaMap.get(schema.$ref);
			if (!resolved && !schema.$ref.includes("://") && !schema.$ref.startsWith("#")) {
				for (const [id, s] of ctx.schemaMap) if (id.endsWith("/" + schema.$ref)) {
					resolved = s;
					break;
				}
			}
			if (!resolved && schema.$ref.includes("#") && !schema.$ref.startsWith("#")) {
				const r = resolveCrossSchemaRef(schema.$ref, ctx.schemaMap);
				if (r) resolved = r.schema;
			}
			if (resolved) {
				if (ctx.refStack.has(schema.$ref)) {
					if (!hasSiblings) return true;
				} else {
					ctx.refStack.add(schema.$ref);
					genCode(resolved, v, lines, ctx, knownType);
					ctx.refStack.delete(schema.$ref);
					if (!hasSiblings) return true;
				}
			} else if (!hasSiblings) return true;
		} else if (!hasSiblings) return true;
		return false;
	}
	function genPatternPropertiesNode(schema, v, lines, ctx, knownType, isObj) {
		let handledPropertyNames = false;
		const ppEntries = Object.entries(schema.patternProperties);
		const pn = isSimplePN(schema.propertyNames) ? schema.propertyNames : null;
		const pi = ctx.varCounter++;
		const kVar = `_ppk${pi}`;
		const matchers = [];
		for (const [pat] of ppEntries) {
			const fast = fastPrefixCheck(pat, kVar);
			if (fast) matchers.push({ check: fast });
			else {
				const ri = ctx.varCounter++;
				ctx.closureVars.push(`_re${ri}`);
				ctx.closureVals.push(safeReClosure(ctx, pat));
				matchers.push({ check: `_re${ri}.test(${kVar})` });
			}
		}
		const subChecks = [];
		for (let i = 0; i < ppEntries.length; i++) {
			const [, sub] = ppEntries[i];
			const subLines = [];
			genCode(sub, `_ppv${pi}`, subLines, ctx);
			subChecks.push(subLines.join(";"));
		}
		const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
		const apSchema = typeof schema.additionalProperties === "object" && schema.additionalProperties !== null ? schema.additionalProperties : null;
		if (schema.additionalProperties === false || apSchema) {
			handledPropertyNames = !!pn;
			const propKeys = Object.keys(schema.properties || {});
			let apCheck = null;
			if (apSchema) {
				const apLines = [];
				genCode(apSchema, `_apv${pi}`, apLines, ctx);
				apCheck = apLines.join(";");
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
						ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
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
			if (ppEntries.length > 0) {
				lines.push(`let _pm${pi}=false`);
				for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}){_pm${pi}=true;const _ppv${pi}=${v}[${kVar}];${subChecks[i]}}`);
			}
			const additional = apCheck !== null ? `const _apv${pi}=${v}[${kVar}];${apCheck}` : `return false`;
			const notMatched = ppEntries.length > 0 ? `if(!_pm${pi}){${additional}}` : additional;
			if (propKeys.length) {
				const switchCases = propKeys.map((k) => `case ${JSON.stringify(k)}:`).join("");
				lines.push(`switch(${kVar}){${switchCases}break;default:{${notMatched}}}`);
			} else lines.push(notMatched);
			lines.push(`}}`);
		} else {
			handledPropertyNames = !!pn;
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
						ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
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
			for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}){const _ppv${pi}=${v}[${kVar}];${subChecks[i]}}`);
			lines.push(`}}`);
		}
		return handledPropertyNames;
	}
	function unevalChecksAnyOf(schema, ctx) {
		if (schema.unevaluatedProperties !== false) return false;
		const r = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
		return r.dynamic && !r.allProps && !unevalBuiltAtRuntime(schema, ctx, r);
	}
	function unevalBuiltAtRuntime(schema, ctx, r) {
		if (schema.unevaluatedProperties === true || schema.unevaluatedProperties === void 0) return false;
		if (r === void 0) r = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
		return r.dynamic && (r.allProps || !unevalPropsModeled(schema, ctx.schemaMap));
	}
	function genUnevaluatedPropertiesNode(schema, v, lines, ctx, knownType, isObj, hoisted, earlyKeyCount) {
		const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
		if (unevalBuiltAtRuntime(schema, ctx, evalResult)) {
			genUnevalDynamicVerdict(schema, v, lines, ctx, isObj);
			return;
		}
		if (evalResult.allProps || schema.unevaluatedProperties === true) {} else if (!evalResult.dynamic) {
			const knownKeys = evalResult.props;
			const propCount = knownKeys.length;
			if (schema.unevaluatedProperties === false) {
				const allRequired = schema.required && schema.required.length >= propCount && knownKeys.every((k) => schema.required.includes(k));
				let inner;
				if (allRequired && propCount > 0) {
					if (!earlyKeyCount) {
						inner = propCount <= 15 ? `var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false` : `if(Object.keys(${v}).length!==${propCount})return false`;
						_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
					}
				} else if (propCount > 0) {
					inner = propCount >= AP_LOOKUP_MIN ? apMembershipCheck(ctx, knownKeys, v) : genCharCodeSwitch(knownKeys, v);
					_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
				} else {
					inner = `for(var _k in ${v})return false`;
					_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
				}
			} else if (typeof schema.unevaluatedProperties === "object") {
				const ukVar = `_uk${ctx.varCounter++}`;
				const subLines = [];
				genCode(schema.unevaluatedProperties, `${v}[${ukVar}]`, subLines, ctx);
				if (subLines.length > 0) {
					const check = subLines.join(";");
					let skipKnown = "";
					if (knownKeys.length >= AP_LOOKUP_MIN) {
						const id = emitNameLookup(ctx, knownKeys);
						skipKnown = id !== null ? `if(${id}[${ukVar}]!==undefined)continue;` : `if(${knownKeys.map((k) => `${ukVar}===${JSON.stringify(k)}`).join("||")})continue;`;
					} else if (knownKeys.length > 0) skipKnown = `if(${knownKeys.map((k) => `${ukVar}===${JSON.stringify(k)}`).join("||")})continue;`;
					const inner = `for(var ${ukVar} in ${v}){${skipKnown}${check}}`;
					_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
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
			if (schema.unevaluatedProperties === false) {
				if (schema.if && (schema.then || schema.else) && !branchKeyword && !schema.patternProperties && !schema.dependentSchemas) {
					const ifLines2 = [];
					genCode(schema.if, "_iv2", ifLines2, ctx);
					const ufi = ctx.varCounter++;
					const ifFn2 = ifLines2.length === 0 ? `function(_iv2){return true}` : `function(_iv2){${ifLines2.join(";")};return true}`;
					const ifProps = [];
					if (schema.if && schema.if.properties) ifProps.push(...Object.keys(schema.if.properties));
					const thenEval = schema.then ? collectEvaluated(schema.then, ctx.schemaMap, ctx.rootDefs) : { props: [] };
					const elseEval = schema.else ? collectEvaluated(schema.else, ctx.schemaMap, ctx.rootDefs) : { props: [] };
					const uniqueThen = [.../* @__PURE__ */ new Set([
						...baseProps,
						...ifProps,
						...thenEval.props || []
					])];
					const uniqueElse = [.../* @__PURE__ */ new Set([...baseProps, ...elseEval.props || []])];
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
						_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
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
						_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
					}
				} else if (schema.dependentSchemas) {
					const evVar = `_ev${ctx.varCounter++}`;
					lines.push(`{const ${evVar}={}`);
					for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
					for (const [trigger, depSchema] of Object.entries(schema.dependentSchemas)) {
						const depResult = collectEvaluated(depSchema, ctx.schemaMap, ctx.rootDefs);
						if (depResult.props && depResult.props.length > 0) lines.push(`if(${ownKeyExpr(ctx, v, trigger)}){${depResult.props.map((k) => `${evVar}[${JSON.stringify(k)}]=1`).join(";")}}`);
					}
					const inner = `for(var _k in ${v}){if(!${evVar}[_k])return false}`;
					_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
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
							ctx.closureVals.push(safeReClosure(ctx, pat));
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
								ctx.closureVals.push(safeReClosure(ctx, pat));
								ifReVars.push(`_ure${ri}`);
							}
							const rootReVars = [];
							if (schema.patternProperties) for (const pat of Object.keys(schema.patternProperties)) {
								const ri = ctx.varCounter++;
								ctx.closureVars.push(`_ure${ri}`);
								ctx.closureVals.push(safeReClosure(ctx, pat));
								rootReVars.push(`_ure${ri}`);
							}
							const rootPatCheck = rootReVars.map((rv) => `if(${rv}.test(_k))continue;`).join("");
							const inner = `const _uif${ufi}=${ifFn};if(_uif${ufi}(${v})){for(var _k in ${v}){if(${evVar}[_k])continue;${rootPatCheck}${ifReVars.map((rv) => `if(${rv}.test(_k))continue;`).join("")}return false}}else{for(var _k in ${v}){if(${evVar}[_k])continue;${rootPatCheck}return false}}`;
							_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
						} else {
							const inner = `for(var _k in ${v}){if(${evVar}[_k])continue;${reVars.map((rv) => `if(${rv}.test(_k)){${evVar}[_k]=1;continue}`).join("")}return false}`;
							_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
						}
					} else {
						const evVar = `_ev${ctx.varCounter++}`;
						lines.push(`{const ${evVar}={}`);
						for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
						const inner = `for(var _k in ${v}){if(!${evVar}[_k])return false}`;
						_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
					}
				}
			} else if (typeof schema.unevaluatedProperties === "object") {
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
					_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
				} else lines.push("}");
			}
		}
	}
	function genUnevaluatedItemsNode(schema, v, lines, ctx, knownType, isArr) {
		const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
		const branchKw = schema.anyOf ? "anyOf" : schema.oneOf ? "oneOf" : null;
		const hasConditionalItems = evalResult.allItems && evalResult.dynamic && branchKw && schema[branchKw].some((sub) => sub && typeof sub === "object" && (sub.items && typeof sub.items === "object" || sub.items === true));
		if (schema.unevaluatedItems === true || evalResult.allItems && !hasConditionalItems) {} else if (!evalResult.dynamic) {
			if (schema.unevaluatedItems === false) {
				const inner = `if(${v}.length>${evalResult.items || 0})return false`;
				_deferOrInline(ctx, lines, v, isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
			} else if (typeof schema.unevaluatedItems === "object") {
				const maxIdx = evalResult.items || 0;
				const ui = ctx.varCounter++;
				const elemVar = `_ue${ui}`;
				const idxVar = `_ui${ui}`;
				const subLines = [];
				genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
				if (subLines.length > 0) {
					const inner = `for(let ${idxVar}=${maxIdx};${idxVar}<${v}.length;${idxVar}++){const ${elemVar}=${v}[${idxVar}];${subLines.join(";")}}`;
					_deferOrInline(ctx, lines, v, isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
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
					_deferOrInline(ctx, lines, v, isArr ? inner + "}" : `if(Array.isArray(${v})){${inner}}}`);
				} else {
					const ui = ctx.varCounter++;
					const elemVar = `_ue${ui}`;
					const idxVar = `_ui${ui}`;
					const subLines = [];
					genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
					if (subLines.length > 0) {
						const inner = `for(let ${idxVar}=${evVar};${idxVar}<${v}.length;${idxVar}++){const ${elemVar}=${v}[${idxVar}];${subLines.join(";")}}`;
						_deferOrInline(ctx, lines, v, isArr ? inner + "}" : `if(Array.isArray(${v})){${inner}}}`);
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
				if (schema.unevaluatedItems === false) _deferOrInline(ctx, lines, v, `if(Array.isArray(${v})){for(let _ci=0;_ci<${v}.length;_ci++){if(!${evArr}[_ci])return false}}}`);
				else {
					const elemVar = `_ue${ctx.varCounter++}`;
					const subLines = [];
					genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
					if (subLines.length > 0) _deferOrInline(ctx, lines, v, `if(Array.isArray(${v})){for(let _ci=0;_ci<${v}.length;_ci++){if(!${evArr}[_ci]){const ${elemVar}=${v}[_ci];${subLines.join(";")}}}}}`);
					else lines.push("}");
				}
			} else if (schema.unevaluatedItems === false) {
				const inner = `if(${v}.length>${evalResult.items || 0})return false`;
				_deferOrInline(ctx, lines, v, isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
			}
		}
	}
	const EMAIL_HELPER = `function _em(_s){${_formats.emailSource("_s", true)}return true}`;
	const URI_HELPER = _formats.uriHelperSource("_uri");
	const FORMAT_CODEGEN = {
		email: (v, isStr, ctx) => {
			if (!ctx) return _formats.emailSource(v, isStr);
			hoistOnce(ctx, "_emHoisted", EMAIL_HELPER);
			return isStr ? `if(!_em(${v}))return false` : `if(typeof ${v}==='string'&&!_em(${v}))return false`;
		},
		"json-pointer": _formats.jsonPointerSource,
		"relative-json-pointer": _formats.relativeJsonPointerSource,
		"uri-template": _formats.uriTemplateSource,
		iri: _formats.iriSource,
		"iri-reference": _formats.iriReferenceSource,
		"idn-email": _formats.idnEmailSource,
		regex: (v, isStr) => {
			const inner = `try{new RegExp(${v},'u')}catch(_er){return false}`;
			return isStr ? `{${inner}}` : `if(typeof ${v}==='string'){${inner}}`;
		},
		date: _formats.dateSource,
		uuid: _formats.uuidSource,
		"date-time": _formats.dateTimeSource,
		time: _formats.timeSource,
		duration: _formats.durationSource,
		uri: (v, isStr, ctx) => {
			if (!ctx) return _formats.uriSource(v, isStr);
			hoistOnce(ctx, "_uriHoisted", URI_HELPER);
			return isStr ? `if(!_uri(${v}))return false` : `if(typeof ${v}==='string'&&!_uri(${v}))return false`;
		},
		"uri-reference": (v, isStr) => isStr ? `{${_formats.uriCharsSource(v, "0")}}` : `if(typeof ${v}==='string'){${_formats.uriCharsSource(v, "0")}}`,
		ipv4: (v, isStr, ctx) => {
			if (!ctx) return _formats.ipv4Source(v, isStr);
			hoistOnce(ctx, "_ip4Hoisted", "const _ip4=/" + _formats.IPV4.source + "/");
			return isStr ? `if(!_ip4.test(${v}))return false` : `if(typeof ${v}==='string'&&!_ip4.test(${v}))return false`;
		},
		ipv6: (v, isStr, ctx) => {
			if (!ctx) return _formats.ipv6Source(v, isStr);
			hoistOnce(ctx, "_ip6Hoisted", "const _ip6f=/" + _formats.IPV6_FULL.source + "/");
			const body = `_ip6:{if(${v}.length>=15&&_ip6f.test(${v}))break _ip6;${_formats.ipv6Source(v, true).replace(/^\{|\}$/g, "")}}`;
			return isStr ? body : `if(typeof ${v}==='string'){${body}}`;
		},
		hostname: _formats.hostnameSource
	};
	function esc(s) {
		return JSON.stringify(s).slice(1, -1).replace(/'/g, "\\'");
	}
	function ptrSeg(s) {
		return s.replace(/~/g, "~0").replace(/\//g, "~1").replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/[\u0000-\u001f\u2028\u2029]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
	}
	function childPathExpr(parentExpr, suffix) {
		if (!parentExpr) return `'/${suffix}'`;
		if (parentExpr.startsWith("'") && !parentExpr.includes("+")) return `'${parentExpr.slice(1, -1)}/${suffix}'`;
		return `${parentExpr}+'/${suffix}'`;
	}
	function compilePatternInline(pattern, varName) {
		let m = pattern.match(/^\^(\[[\w\-]+\])\{(\d+)\}\$$/);
		if (m) {
			const len = parseInt(m[2]);
			if (len <= 16) {
				const checks = [];
				for (let i = 0; i < len; i++) {
					const ck = charClassToCheck(m[1], `${varName}.charCodeAt(${i})`);
					if (!ck) return null;
					checks.push(ck);
				}
				return `${varName}.length===${len}&&${checks.join("&&")}`;
			}
			const rangeCheck = charClassToCheck(m[1], `${varName}.charCodeAt(_pi)`);
			if (!rangeCheck) return null;
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
		return fixedSequenceInline(pattern, varName);
	}
	const FIXED_LITERAL = /[A-Za-z0-9 _\-:@#%&=,;'"<>!~`\/]/;
	function fixedSequenceInline(pattern, varName) {
		if (pattern.length < 3 || pattern[0] !== "^" || pattern[pattern.length - 1] !== "$" || pattern[pattern.length - 2] === "\\") return null;
		const end = pattern.length - 1;
		const pieces = [];
		let i = 1;
		while (i < end) {
			let piece;
			const c = pattern[i];
			if (c === "[") {
				const j = pattern.indexOf("]", i);
				if (j < 0 || j >= end) return null;
				const cls = pattern.slice(i, j + 1);
				if (!/^\[[\w-]+\]$/.test(cls)) return null;
				piece = { cls };
				i = j + 1;
			} else if (c === "\\") {
				const e = pattern[i + 1];
				if (e === "d") piece = { cls: "[0-9]" };
				else if (e !== void 0 && "./()[]{}+*?^$|\\".includes(e)) piece = { lit: e };
				else return null;
				i += 2;
			} else if (FIXED_LITERAL.test(c)) {
				piece = { lit: c };
				i += 1;
			} else return null;
			let count = 1;
			if (pattern[i] === "{") {
				const q = /^\{(\d+)\}/.exec(pattern.slice(i));
				if (!q) return null;
				count = Number(q[1]);
				i += q[0].length;
			} else if (i < end && "*+?".includes(pattern[i])) return null;
			for (let k = 0; k < count; k++) pieces.push(piece);
			if (pieces.length > 32) return null;
		}
		if (pieces.length === 0) return null;
		const checks = [];
		for (let k = 0; k < pieces.length; k++) {
			const at = `${varName}.charCodeAt(${k})`;
			if (pieces[k].lit !== void 0) checks.push(`${at}===${pieces[k].lit.charCodeAt(0)}`);
			else {
				const ck = charClassToCheck(pieces[k].cls, at);
				if (!ck) return null;
				checks.push(`(${ck})`);
			}
		}
		return `${varName}.length===${pieces.length}&&${checks.join("&&")}`;
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
		return `(${ranges.map(([lo, hi]) => lo === hi ? `${codeExpr}===${lo}` : `(${codeExpr}>=${lo}&&${codeExpr}<=${hi})`).join("||")})`;
	}
	function childPathDynExpr(parentExpr, indexExpr) {
		if (!parentExpr) return `'/'+${indexExpr}`;
		return `${parentExpr}+'/'+${indexExpr}`;
	}
	function unevalContributions(sub, kind, names, state, depth) {
		if (depth > 24) return false;
		if (sub === true || sub === false) return true;
		if (typeof sub !== "object" || sub === null) return false;
		if (kind === "props") {
			if (sub.patternProperties !== void 0 || sub.additionalProperties !== void 0 || sub.unevaluatedProperties !== void 0) return false;
			if (sub.properties !== void 0) {
				if (typeof sub.properties !== "object" || sub.properties === null) return false;
				for (const k of Object.keys(sub.properties)) names.add(k);
			}
		} else {
			if (sub.items !== void 0 || sub.additionalItems !== void 0 || sub.contains !== void 0 || sub.unevaluatedItems !== void 0) return false;
			if (sub.prefixItems !== void 0) {
				if (!Array.isArray(sub.prefixItems)) return false;
				if (sub.prefixItems.length > state.prefix) state.prefix = sub.prefixItems.length;
			}
		}
		if (sub.$ref !== void 0 || sub.$dynamicRef !== void 0 || sub.$recursiveRef !== void 0) return false;
		if (sub.dependentSchemas !== void 0 || sub.dependencies !== void 0) return false;
		for (const k of [
			"allOf",
			"anyOf",
			"oneOf"
		]) if (sub[k] !== void 0) {
			if (!Array.isArray(sub[k])) return false;
			for (const b of sub[k]) if (!unevalContributions(b, kind, names, state, depth + 1)) return false;
		}
		for (const k of [
			"if",
			"then",
			"else"
		]) if (sub[k] !== void 0 && !unevalContributions(sub[k], kind, names, state, depth + 1)) return false;
		return true;
	}
	function unevalLocalOk(node, key) {
		if (node[key] !== false) return false;
		if (node.$ref !== void 0 || node.$dynamicRef !== void 0 || node.$recursiveRef !== void 0) return false;
		if (node.dependentSchemas !== void 0 || node.dependencies !== void 0) return false;
		const kind = key === "unevaluatedProperties" ? "props" : "items";
		if (kind === "props" && node.patternProperties !== void 0) return false;
		if (kind === "items" && node.contains !== void 0) return false;
		const names = /* @__PURE__ */ new Set();
		const state = { prefix: 0 };
		for (const k of [
			"allOf",
			"anyOf",
			"oneOf"
		]) if (node[k] !== void 0) {
			if (!Array.isArray(node[k])) return false;
			for (const b of node[k]) if (!unevalContributions(b, kind, names, state, 0)) return false;
		}
		for (const k of [
			"if",
			"then",
			"else"
		]) if (node[k] !== void 0 && !unevalContributions(node[k], kind, names, state, 0)) return false;
		if (kind === "props") {
			const own = node.properties && typeof node.properties === "object" ? node.properties : {};
			for (const n of names) if (!Object.prototype.hasOwnProperty.call(own, n)) return false;
		} else {
			const ownPrefix = Array.isArray(node.prefixItems) ? node.prefixItems.length : Array.isArray(node.items) ? node.items.length : 0;
			if (node.items !== void 0 && !Array.isArray(node.items)) {} else if (state.prefix > ownPrefix) return false;
		}
		return true;
	}
	function unevalAllProvablyLocal(root, only) {
		const seen = /* @__PURE__ */ new Set();
		const stack = [root];
		while (stack.length) {
			const n = stack.pop();
			if (n === null || typeof n !== "object" || seen.has(n)) continue;
			seen.add(n);
			if (!Array.isArray(n)) {
				if (only !== "items" && n.unevaluatedProperties !== void 0 && !unevalLocalOk(n, "unevaluatedProperties")) return false;
				if (n.unevaluatedItems !== void 0 && !unevalLocalOk(n, "unevaluatedItems")) return false;
			}
			for (const k of Array.isArray(n) ? n : Object.values(n)) stack.push(k);
		}
		return true;
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
	function compileToJSCodegenWithErrors(schema, schemaMap, userFormats, sourceOpts) {
		const inputSchema = schema;
		schema = prepareForCodegen(schema, schemaMap);
		if (typeof schema === "object" && schema !== null) {
			const s = JSON.stringify(schema);
			if ((s.includes("unevaluatedProperties") || s.includes("unevaluatedItems")) && !unevalAllProvablyLocal(schema)) return null;
		}
		if (typeof schema === "boolean") return schema ? () => ({
			valid: true,
			errors: []
		}) : () => ({
			valid: false,
			errors: [{
				keyword: "not",
				instancePath: "",
				schemaPath: "#",
				params: {},
				message: "boolean schema is false"
			}]
		});
		if (typeof schema !== "object" || schema === null) return null;
		if (!sharedCodegenGate(schema, schemaMap)) return null;
		if (schema.patternProperties) {
			for (const [pat, sub] of Object.entries(schema.patternProperties)) if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) {
			for (const sub of Object.values(schema.dependentSchemas)) if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !isSimplePN(schema.propertyNames) && !codegenSafe(schema.propertyNames, schemaMap)) return null;
		const eRootDefs = schema.$defs || schema.definitions || null;
		const eAnchors = {};
		if (schema.$dynamicAnchor) eAnchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) eAnchors["#" + schema.$anchor] = schema;
		if (typeof schema.$id === "string" && schema.$id.startsWith("#")) eAnchors[schema.$id] = schema;
		if (eRootDefs) {
			for (const def of Object.values(eRootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) eAnchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) eAnchors["#" + def.$anchor] = def;
				if (typeof def.$id === "string" && def.$id.startsWith("#")) eAnchors[def.$id] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !eAnchors["#" + ext.$dynamicAnchor]) eAnchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !eAnchors["#" + ext.$anchor]) eAnchors["#" + ext.$anchor] = ext;
				if (typeof ext.$id === "string" && ext.$id.startsWith("#") && !eAnchors[ext.$id]) eAnchors[ext.$id] = ext;
			}
		}
		if (hasUnresolvableRef(schema, eRootDefs, eAnchors, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return null;
		const ctx = {
			varCounter: 0,
			helperCode: [],
			rootDefs: eRootDefs,
			shared: [],
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null,
			anchors: eAnchors,
			rootSchema: inputSchema,
			userFormats: userFormats || null,
			closureVars: [],
			closureVals: [],
			sourceMap: sourceOpts && sourceOpts.sourceMap && sourceOpts.schemaFile ? {
				file: sourceOpts.schemaFile,
				map: sourceOpts.sourceMap,
				frames: sourceOpts.frames || null
			} : null
		};
		ctx.helperCode.push("const _cpLen=s=>{let n=0;for(const _ of s)n++;return n}");
		const lines = [];
		try {
			genCodeE(schema, "d", "", lines, ctx, "#");
		} catch (e) {
			if (e === DECLINE) return null;
			throw e;
		}
		if (ctx.usesBranchCollapse) ctx.helperCode.push(require_branch_collapse().embedSource());
		if (lines.length === 0) return (d) => ({
			valid: true,
			errors: []
		});
		const checkStr = lines.join("\n  ");
		const defSetsE = ctx.defFns ? Array.from(ctx.defFns.values()) : [];
		const needsGuardE = ctx.usesRecursion || defSetsE.length > 0;
		const guardStrE = needsGuardE ? emitGuardState() : "";
		const helpersE = ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "";
		let body;
		if (ctx.usesRecursion) body = `const _e=[];\n  ` + guardStrE + helpersE + emitRootGuard("_validateE", "d,_all,_e", "") + `function _validateE_b(d,_all,_e){\n  ${checkStr}\n  }\n  ` + emitGuardedRun("_validateE(d,_all,_e)", "_e.length=0;", defSetsE) + `return{valid:_e.length===0,errors:_e}`;
		else if (defSetsE.length > 0) body = `const _e=[];\n  ` + guardStrE + helpersE + `function _bodyE(d,_all,_e){\n  ${checkStr}\n  }\n  ` + emitGuardedRun("_bodyE(d,_all,_e)", "_e.length=0;", defSetsE) + `return{valid:_e.length===0,errors:_e}`;
		else body = `const _e=[];\n  ` + helpersE + checkStr + `\n  return{valid:_e.length===0,errors:_e}`;
		try {
			let fn;
			const cvars = ctx.closureVars;
			const cvals = ctx.closureVals;
			let factoryBody;
			if (needsGuardE) {
				const attempt = ctx.usesRecursion ? "_validateE(d,_all,_e)" : "_bodyE(d,_all,_e)";
				const runner = ctx.usesRecursion ? emitRootGuard("_validateE", "d,_all,_e", "") + `function _validateE_b(d,_all,_e){\n  ${checkStr}\n  }\n  ` : `function _bodyE(d,_all,_e){\n  ${checkStr}\n  }\n  `;
				factoryBody = guardStrE + helpersE + runner + `return function(d,_all){const _e=[];\n  ` + emitGuardedRun(attempt, "_e.length=0;", defSetsE) + `return{valid:_e.length===0,errors:_e}}`;
			} else factoryBody = helpersE + "return function(d,_all){const _e=[];\n  " + checkStr + "\n  return{valid:_e.length===0,errors:_e}}";
			if (sourceOpts && sourceOpts.runtimeShape) {
				const shape = (src) => src.replace(/code:'ATA\d{4}',/g, "").replace(/,docUrl:'https:\/\/ata-validator\.com\/e\/ATA\d{4}'/g, "").replace(/,_o:\d+/g, "");
				body = shape(body);
				factoryBody = shape(factoryBody);
			}
			if (!ctx.usesRecursion && defSetsE.length === 0 && helpersE !== "" || needsGuardE) {
				const params = [...cvars, "__ataSafeRe"];
				const args = [...cvals, compileSafe];
				const make = new Function(...params, factoryBody);
				const main = make(...args);
				if (needsGuardE) {
					let busy = false;
					fn = (d, _all) => {
						if (busy) return make(...args)(d, _all);
						busy = true;
						try {
							return main(d, _all);
						} finally {
							busy = false;
						}
					};
				} else fn = main;
			} else if (ctx.usesSafeRe) {
				const built = new Function(...cvars, "__ataSafeRe", "d", "_all", body);
				fn = cvars.length ? (d, _all) => built(...cvals, compileSafe, d, _all) : (d, _all) => built(compileSafe, d, _all);
			} else if (cvars.length) {
				const built = new Function(...cvars, "d", "_all", body);
				fn = (d, _all) => built(...cvals, d, _all);
			} else fn = new Function("d", "_all", body);
			fn._errSource = body;
			fn._errFactory = factoryBody;
			fn._errGuarded = needsGuardE;
			fn._sharedHelpers = ctx.shared ? ctx.shared.slice() : [];
			fn._usesSafeRe = !!ctx.usesSafeRe;
			if (cvars.length) fn._formatClosures = cvars.map((name, i) => {
				let format = null;
				for (const key of Object.keys(ctx.userFormats)) if (ctx.userFormats[key] === cvals[i]) {
					format = key;
					break;
				}
				return {
					name,
					fn: cvals[i],
					format
				};
			});
			return fn;
		} catch (e) {
			if (process.env.ATA_DEBUG_ERRGEN) console.error("error codegen declined:", e.message);
			return null;
		}
	}
	const BRANCH_VERDICT_MAX = 4096;
	function snapshotCtx(ctx) {
		const out = /* @__PURE__ */ new Map();
		for (const k of Object.keys(ctx)) {
			const x = ctx[k];
			if (Array.isArray(x)) out.set(k, {
				kind: "a",
				ref: x,
				n: x.length
			});
			else if (x instanceof Map || x instanceof Set) out.set(k, {
				kind: "c",
				ref: x,
				n: x.size
			});
			else out.set(k, {
				kind: "v",
				ref: x
			});
		}
		return out;
	}
	function restoreCtx(ctx, saved) {
		for (const k of Object.keys(ctx)) if (!saved.has(k)) delete ctx[k];
		for (const [k, e] of saved) if (e.kind === "a") {
			e.ref.length = Math.min(e.ref.length, e.n);
			ctx[k] = e.ref;
		} else if (e.kind === "c") {
			if (e.ref.size - e.n > 0) {
				const added = [];
				let i = 0;
				for (const key of e.ref.keys()) if (i++ >= e.n) added.push(key);
				for (const key of added) e.ref.delete(key);
			}
			ctx[k] = e.ref;
		} else ctx[k] = e.ref;
	}
	function holdsRef(node, seen = /* @__PURE__ */ new Set()) {
		if (node === null || typeof node !== "object" || seen.has(node)) return false;
		seen.add(node);
		if (typeof node.$ref === "string" || typeof node.$dynamicRef === "string") return true;
		for (const k of Object.keys(node)) if (holdsRef(node[k], seen)) return true;
		return false;
	}
	function emitBranchCollapse(branches, keyword, v, pathExpr, lines, ctx, schemaPrefix) {
		ctx.usesBranchCollapse = true;
		const fi = ctx.varCounter++;
		const branchKw = keyword;
		const branchSp = schemaPrefix + "/" + branchKw;
		const fns = [];
		const titles = [];
		let usesSp = false;
		for (let i = 0; i < branches.length; i++) {
			const sub = branches[i];
			const subLines = [];
			const subSp = branchSp + "/" + i;
			if (typeof sub === "object" && sub !== null) {
				ctx.inBranchFn = (ctx.inBranchFn || 0) + 1;
				try {
					genCodeE(sub, "_bv", "_bpth", subLines, ctx, subSp);
				} finally {
					ctx.inBranchFn--;
				}
			} else if (sub === false) subLines.push(`_e.push({keyword:'not',instancePath:_bpth,schemaPath:'${subSp}'${ordinalField(ctx, `${subSp}`)},params:{},message:'boolean schema is false'})`);
			const title = sub && typeof sub === "object" && typeof sub.title === "string" ? sub.title : "";
			titles.push(title);
			let body = subLines.length === 0 ? "" : `const _e=[];${subLines.join(";")};return{valid:_e.length===0,errors:_e}`;
			if (body.includes(SP_PLACEHOLDER)) {
				body = body.split(`'${SP_PLACEHOLDER}`).join(`_sp+'`).split(`"${SP_PLACEHOLDER}`).join(`_sp+"`);
				if (body.includes(SP_PLACEHOLDER)) throw DECLINE;
				usesSp = true;
			}
			fns.push(body);
		}
		const params = usesSp ? "_bv,_bpth,_all,_sp" : "_bv,_bpth,_all";
		const fnArr = `_brf${fi}`;
		const resArr = `_brr${fi}`;
		const titleArr = JSON.stringify(titles);
		const collapsed = `_brc${fi}`;
		const pp = pathExpr || "\"\"";
		ctx.helperCode.push(`const ${fnArr}=[${fns.map((b) => b === "" ? `function(){return{valid:true,errors:[]}}` : `function(${params}){${b}}`).join(",")}];const _bt${fi}=${titleArr}`);
		const call = `${fnArr}[_bi](${v},_pp${fi},_all${usesSp ? ",_sp" : ""})`;
		const ord = ctx.noOrdinal ? "null" : (() => {
			const o = ordinalFor(ctx.rootSchema, unescapeSp(branchSp));
			return o === null ? "null" : o;
		})();
		const report = ctx.inCombined && !ctx.inBranchFn ? `const ${collapsed}=__ataCollapse('${branchKw}',${resArr},_pp${fi},'${branchSp}',${ord},_bt${fi});if(${collapsed})(_e=_ap(_e,${collapsed}))` : `const ${collapsed}=__ataCollapse('${branchKw}',${resArr},_pp${fi},'${branchSp}',${ord},_bt${fi});if(${collapsed}){_e.push(${collapsed});if(!_all)return{valid:false,errors:_e}}`;
		const counted = ctx.inCombined && !ctx.inBranchFn && ctx.branchCounts ? ctx.branchCounts.get(branches) : void 0;
		const same = counted !== void 0 ? `${v}!==null&&typeof ${v}==='object'&&${counted.of}===${v}` : "";
		let guard = counted !== void 0 ? keyword === "anyOf" ? `if(!(${same}&&${counted.count}>=1))` : `if(!(${same}&&${counted.count}===1))` : "";
		if (guard !== "" && keyword === "oneOf" && counted.mask && ctx.inCombined && !ctx.inBranchFn) {
			const ord0 = ctx.noOrdinal ? "null" : (() => {
				const o = ordinalFor(ctx.rootSchema, unescapeSp(branchSp));
				return o === null ? "null" : o;
			})();
			guard = `if(${same}&&${counted.count}>1){const _pi${fi}=[];for(let _k=0;_k<${branches.length};_k++)if((${counted.mask}>>_k)&1)_pi${fi}.push(_k);(_e=_ap(_e,__ataMulti(_pi${fi},${branches.length},${pp},'${branchSp}',${ord0})))}else if(!(${same}&&${counted.count}===1))`;
		}
		let vfArr = null;
		if (guard === "" && !branches.some((b) => holdsRef(b))) {
			const saved = snapshotCtx(ctx);
			try {
				const vfs = branches.map((sub) => {
					if (sub === true) return "function(){return true}";
					if (sub === false) return "function(){return false}";
					const bl = [];
					nestedGenCode(sub, "_bv", bl, ctx);
					return bl.length === 0 ? "function(){return true}" : `function(_bv){${bl.join(";")};return true}`;
				});
				if (!vfs.some((b) => b.includes(SP_PLACEHOLDER)) && vfs.reduce((n, b) => n + b.length, 0) <= BRANCH_VERDICT_MAX) {
					vfArr = `_bvf${fi}`;
					ctx.helperCode.push(vfs.map((b, i) => `const ${vfArr}_${i}=${b}`).join(";"));
				} else restoreCtx(ctx, saved);
			} catch (e) {
				if (e !== DECLINE) throw e;
				restoreCtx(ctx, saved);
			}
		}
		if (vfArr !== null) {
			const L = branches.length;
			const top = ctx.inCombined && !ctx.inBranchFn;
			if (top) ctx.unguardedCollapse = true;
			const tests = branches.map((_, i) => `${vfArr}_${i}(${v})`);
			if (keyword === "anyOf") lines.push(`{const _pp${fi}=${pp};if(!(${tests.join("||")})){if(_all===0){_e.push(null);return{valid:false,errors:_e}}const ${resArr}=[];for(let _bi=0;_bi<${L};_bi++){const _br=${call};${resArr}.push(_br.valid?{valid:false,errors:_br.errors}:_br)}${report}}}`);
			else {
				const mk = L <= 30;
				const collect = mk ? `const _pi${fi}=[];for(let _k=0;_k<${L};_k++)if((_m${fi}>>_k)&1)_pi${fi}.push(_k);` : "";
				const multi = `__ataMulti(_pi${fi},${L},_pp${fi},'${branchSp}',${ord})`;
				const pushMulti = top ? `(_e=_ap(_e,${multi}))` : `_e.push(${multi});if(!_all)return{valid:false,errors:_e}`;
				const count = tests.map((t, i) => `if(${t}){_n${fi}++;${mk ? `_m${fi}|=${1 << i}` : `_pi${fi}.push(${i})`}}`).join("");
				lines.push(`{const _pp${fi}=${pp};let _n${fi}=0${mk ? `,_m${fi}=0` : `,_pi${fi}=[]`};${count}if(_n${fi}!==1){if(_all===0){_e.push(null);return{valid:false,errors:_e}}if(_n${fi}>1){${collect}${pushMulti}}else{const ${resArr}=[];for(let _bi=0;_bi<${L};_bi++)${resArr}.push(${call});${report}}}}`);
			}
			return;
		}
		if (guard === "" && ctx.inCombined && !ctx.inBranchFn) ctx.unguardedCollapse = true;
		if (keyword === "anyOf") {
			const probe = `${fnArr}[_bi](${v},_pp${fi},0${usesSp ? ",_sp" : ""})`;
			lines.push(`${guard}{const _pp${fi}=${pp};let _bp${fi}=false;for(let _bi=0;_bi<${fnArr}.length;_bi++){if(${probe}.valid){_bp${fi}=true;break}}if(!_bp${fi}){if(_all===0){_e.push(null);return{valid:false,errors:_e}}const ${resArr}=[];for(let _bi=0;_bi<${fnArr}.length;_bi++){const _br=${call};${resArr}.push(_br.valid?{valid:false,errors:_br.errors}:_br)}${report}}}`);
		} else lines.push(`${guard}{const _pp${fi}=${pp};const ${resArr}=[];for(let _bi=0;_bi<${fnArr}.length;_bi++)${resArr}.push(${call});if(_all===0){let _n=0;for(const _r of ${resArr})if(_r.valid)_n++;if(_n!==1){_e.push(null);return{valid:false,errors:_e}}}else{${report}}}`);
	}
	function genCodeE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		return withPlain(schema, v, lines, ctx, () => genCodeENode(schema, v, pathExpr, lines, ctx, schemaPrefix));
	}
	function genCodeENode(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		if (!schemaPrefix) schemaPrefix = "#";
		if (schema === false) {
			lines.push(`;_e.push({keyword:'not',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}'${ordinalField(ctx, `${schemaPrefix}`)},params:{},message:'boolean schema is false'});if(!_all)return{valid:false,errors:_e}`);
			return;
		}
		if (schema === true) return;
		if (typeof schema !== "object" || schema === null) return;
		if (!ctx.regExpMap) ctx.regExpMap = /* @__PURE__ */ new Map();
		if (schema.$ref) {
			for (const k of Object.keys(schema)) if (!REF_NEUTRAL_SIBLINGS.has(k) && !k.startsWith("x-")) throw DECLINE;
			if (schema.$ref === "#") throw DECLINE;
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				const defName = m[1];
				if (!ctx.cyclicDefs) ctx.cyclicDefs = cyclicDefNames(ctx.rootDefs);
				if (!ctx.sharedDefs) ctx.sharedDefs = sharedDefNames(ctx.rootSchema, ctx.rootDefs);
				if (ctx.cyclicDefs.has(defName) || ctx.sharedDefs.has(defName)) {
					if (!ctx.defFns) ctx.defFns = /* @__PURE__ */ new Map();
					let fnName = ctx.defFns.get(defName);
					if (!fnName) {
						fnName = "_defE" + ctx.defFns.size + "_" + defName.replace(/[^A-Za-z0-9_]/g, "_");
						ctx.defFns.set(defName, fnName);
						const bodyLines = [];
						genCodeE(ctx.rootDefs[defName], "d", "_p", bodyLines, ctx, SP_PLACEHOLDER);
						let body = bodyLines.join("\n  ");
						body = body.split(`'${SP_PLACEHOLDER}`).join(`_sp+'`).split(`"${SP_PLACEHOLDER}`).join(`_sp+"`);
						if (body.includes(SP_PLACEHOLDER)) throw DECLINE;
						ctx.helperCode.push(`const ${fnName}_s=new Set()\n  function ${fnName}(d,_p,_all,_e,_sp){\n  if(_sg){if(typeof d!=='object'||d===null)return ${fnName}_b(d,_p,_all,_e,_sp);if(${fnName}_s.has(d))return;${fnName}_s.add(d);try{return ${fnName}_b(d,_p,_all,_e,_sp)}finally{${fnName}_s.delete(d)}}\n  if(++_sd>${CYCLE_DEPTH})throw _CYC\n  const _r=${fnName}_b(d,_p,_all,_e,_sp)\n  _sd--\n  return _r\n  }\n  function ${fnName}_b(d,_p,_all,_e,_sp){${body}}`);
					}
					lines.push(`${fnName}(${v},${pathExpr || "\"\""},_all,_e,'${schemaPrefix}');if(!_all&&_e.length)return{valid:false,errors:_e}`);
					return;
				}
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeE(ctx.rootDefs[defName], v, pathExpr, lines, ctx, schemaPrefix);
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
			if (ctx.schemaMap && schema.$ref.includes("#") && !schema.$ref.startsWith("#")) {
				const r = resolveCrossSchemaRef(schema.$ref, ctx.schemaMap);
				if (r) {
					if (ctx.refStack.has(schema.$ref)) return;
					ctx.refStack.add(schema.$ref);
					genCodeE(r.schema, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
		}
		if (schema.$dynamicRef) genDynamicRefE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		if (types) {
			const conds = types.map((t) => {
				switch (t) {
					case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
					case "array": return `Array.isArray(${v})`;
					case "string": return `typeof ${v}==='string'`;
					case "number": return `Number.isFinite(${v})`;
					case "integer": return `Number.isInteger(${v})`;
					case "boolean": return `typeof ${v}==='boolean'`;
					case "null": return `${v}===null`;
					default: return "true";
				}
			});
			const expected = types.join(", ");
			const expectedParam = !Array.isArray(schema.type) ? `'${types[0]}'` : JSON.stringify(types);
			{
				const typeSp = `${schemaPrefix}/type`;
				const lit = buildErrorLiteral({
					keyword: "type",
					schemaPath: typeSp,
					sourceMap: ctx.sourceMap
				});
				lines.push(`if(!(${conds.join("||")})){_e.push({code:'${lit.codeStr}',keyword:'type',instancePath:${pathExpr || "\"\""},schemaPath:'${typeSp}'${ordinalField(ctx, `${typeSp}`)},params:{type:${expectedParam}},message:'must be ${expected}',docUrl:'${lit.docUrl}'${lit.frame}});if(!_all)return{valid:false,errors:_e}}`);
			}
		}
		const isObj = false;
		const isArr = false;
		const isStr = false;
		const fail = (keyword, schemaSuffix, paramsCode, msgCode, fmt) => {
			const sp = schemaPrefix + "/" + schemaSuffix;
			const lit = buildErrorLiteral({
				keyword,
				format: fmt,
				schemaPath: sp,
				sourceMap: ctx.sourceMap
			});
			return `_e.push({code:'${lit.codeStr}',keyword:'${keyword}',instancePath:${pathExpr || "\"\""},schemaPath:'${sp}',params:${paramsCode},message:${msgCode},docUrl:'${lit.docUrl}'${lit.frame}${ordinalField(ctx, sp)}});if(!_all)return{valid:false,errors:_e}`;
		};
		if (schema.enum) lines.push(`if(!(${enumCondition(ctx, schema.enum, v)})){${fail("enum", "enum", `{allowedValues:${JSON.stringify(schema.enum)}}`, "'must be equal to one of the allowed values'")}}`);
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)}){${fail("const", "const", `{allowedValue:${JSON.stringify(schema.const)}}`, "'must be equal to constant'")}}`);
			else lines.push(`if(!${emitDeq(ctx)}(${v},${emitConstant(ctx, cv)})){${fail("const", "const", `{allowedValue:${emitParamConstant(ctx, schema.const)}}`, "'must be equal to constant'")}}`);
		}
		new Set(schema.required || []);
		if (schema.required) {
			const reqSp = `${schemaPrefix}/required`;
			const reqLit = buildErrorLiteral({
				keyword: "required",
				schemaPath: reqSp,
				sourceMap: ctx.sourceMap
			});
			for (const key of schema.required) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!${ownKeyExpr(ctx, v, key)}){_e.push({code:'${reqLit.codeStr}',keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${reqSp}'${ordinalField(ctx, `${reqSp}`)},params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'",docUrl:'${reqLit.docUrl}'${reqLit.frame}});if(!_all)return{valid:false,errors:_e}}`);
		}
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
			ctx.varCounter++;
			lines.push(`{if(typeof ${v}==='number'&&${multipleOfBad(v, m)}){${fail("multipleOf", "multipleOf", `{multipleOf:${m}}`, `'must be multiple of ${m}'`)}}}`);
		}
		if (schema.minLength !== void 0) {
			const M = schema.minLength;
			const c = `typeof ${v}==='string'&&(${`${v}.length<${M}||(${v}.length<${M * 2}&&_cpLen(${v})<${M})`})`;
			lines.push(`if(${c}){${fail("minLength", "minLength", `{limit:${M}}`, `'must NOT have fewer than ${M} characters'`)}}`);
		}
		if (schema.maxLength !== void 0) {
			const X = schema.maxLength;
			const c = `typeof ${v}==='string'&&(${`${v}.length>${X * 2}||(${v}.length>${X}&&_cpLen(${v})>${X})`})`;
			lines.push(`if(${c}){${fail("maxLength", "maxLength", `{limit:${X}}`, `'must NOT have more than ${X} characters'`)}}`);
		}
		if (schema.pattern) {
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) {
				const c = `typeof ${v}==='string'&&!(${inlineCheck})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, JSON.stringify(`must match pattern "${schema.pattern}"`))}}`);
			} else {
				const pattern = JSON.stringify(schema.pattern);
				if (!ctx.regExpMap.has(pattern)) {
					const ri = ctx.varCounter++;
					ctx.regExpMap.set(pattern, ri);
					if (useSafeEngine(schema.pattern)) {
						ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
						ctx.usesSafeRe = true;
					} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern}${reFlagArg(pattern)})`);
				}
				const c = `typeof ${v}==='string'&&!_re${ctx.regExpMap.get(pattern)}.test(${v})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, JSON.stringify(`must match pattern "${schema.pattern}"`))}}`);
			}
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			const fmtSp = `${schemaPrefix}/format`;
			const fmtLit = buildErrorLiteral({
				keyword: "format",
				format: schema.format,
				schemaPath: fmtSp,
				sourceMap: ctx.sourceMap
			});
			const failPush = `_e.push({code:'${fmtLit.codeStr}',keyword:'format',instancePath:${pathExpr || "\"\""},schemaPath:'${fmtSp}'${ordinalField(ctx, `${fmtSp}`)},params:{format:'${esc(schema.format)}'},message:'must match format "${esc(schema.format)}"',docUrl:'${fmtLit.docUrl}'${fmtLit.frame}});if(!_all)return{valid:false,errors:_e}`;
			if (fc) {
				const ri = ctx.varCounter++;
				const fmtCode = fc(v, isStr, ctx).replace(/return false/g, `{${failPush};break _fmt${ri}}`);
				lines.push(`_fmt${ri}:{${fmtCode}}`);
			} else if (ctx.userFormats && typeof ctx.userFormats[schema.format] === "function") {
				const closureName = `_uf_${schema.format.replace(/[^a-zA-Z0-9_]/g, "_")}`;
				if (ctx.closureVars && !ctx.closureVars.includes(closureName)) {
					ctx.closureVars.push(closureName);
					ctx.closureVals.push(ctx.userFormats[schema.format]);
				}
				const guard = `typeof ${v}==='string'&&`;
				lines.push(`if(${guard}!${closureName}(${v})){${failPush}}`);
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
		if (schema.uniqueItems) genUniqueItemsE(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isArr);
		if (schema.minProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length<${schema.minProperties}){${fail("minProperties", "minProperties", `{limit:${schema.minProperties}}`, `'must NOT have fewer than ${schema.minProperties} properties'`)}}`);
		if (schema.maxProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length>${schema.maxProperties}){${fail("maxProperties", "maxProperties", `{limit:${schema.maxProperties}}`, `'must NOT have more than ${schema.maxProperties} properties'`)}}`);
		if (schema.additionalProperties === false) {
			const allowed = Object.keys(schema.properties || {}).map((k) => `${JSON.stringify(k)}`).join(",");
			const ci = ctx.varCounter++;
			const apSp = `${schemaPrefix}/additionalProperties`;
			const apLit = buildErrorLiteral({
				keyword: "additionalProperties",
				schemaPath: apSp,
				sourceMap: ctx.sourceMap
			});
			const patChecks = [];
			for (const pat of Object.keys(schema.patternProperties || {})) {
				const pattern = JSON.stringify(pat);
				if (!ctx.regExpMap.has(pattern)) {
					const ri = ctx.varCounter++;
					ctx.regExpMap.set(pattern, ri);
					if (useSafeEngine(pat)) {
						ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
						ctx.usesSafeRe = true;
					} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern}${reFlagArg(pattern)})`);
				}
				patChecks.push(`_re${ctx.regExpMap.get(pattern)}.test(_k${ci}[_i])`);
			}
			const isAdditional = patChecks.length ? `!_a${ci}.has(_k${ci}[_i])&&!(${patChecks.join("||")})` : `!_a${ci}.has(_k${ci}[_i])`;
			const gateChecks = patChecks.map((c) => c.split(`_k${ci}[_i]`).join(`_f${ci}`));
			const gateTest = gateChecks.length ? `!_a${ci}.has(_f${ci})&&!(${gateChecks.join("||")})` : `!_a${ci}.has(_f${ci})`;
			const detail = `const _k${ci}=Object.keys(${v});for(let _i=0;_i<_k${ci}.length;_i++){if(${isAdditional}){_e.push({code:'${apLit.codeStr}',keyword:'additionalProperties',instancePath:${pathExpr || "\"\""},schemaPath:'${apSp}'${ordinalField(ctx, `${apSp}`)},params:{additionalProperty:_k${ci}[_i]},message:'must NOT have additional properties',docUrl:'${apLit.docUrl}'${apLit.frame}});if(!_all)return{valid:false,errors:_e}}}`;
			ctx.helperCode.push(`const _a${ci}=new Set([${allowed}])`);
			const inner = `let _x${ci}=0;for(const _f${ci} in ${v}){if(${gateTest}){_x${ci}=1;break}}if(_x${ci}){${detail}}`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
		}
		if (ctx.inCombined && schema.unevaluatedProperties !== void 0 && schema.unevaluatedProperties !== true && !unevalLocalOk(schema, "unevaluatedProperties")) throw DECLINE;
		if (ctx.inCombined && schema.unevaluatedItems !== void 0 && schema.unevaluatedItems !== true && !unevalLocalOk(schema, "unevaluatedItems")) throw DECLINE;
		if (schema.unevaluatedProperties === false && schema.additionalProperties === void 0) genUnevaluatedFalseE(schema, v, pathExpr, lines, ctx, schemaPrefix, isObj);
		if (schema.unevaluatedItems === false) genUnevaluatedItemsFalseE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.dependentRequired) {
			const drSp = `${schemaPrefix}/dependentRequired`;
			const drLit = buildErrorLiteral({
				keyword: "dependentRequired",
				schemaPath: drSp,
				sourceMap: ctx.sourceMap
			});
			for (const [key, deps] of Object.entries(schema.dependentRequired)) for (const dep of deps) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${ownKeyExpr(ctx, v, key)}&&!${ownKeyExpr(ctx, v, dep)}){_e.push({code:'${drLit.codeStr}',keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${drSp}'${ordinalField(ctx, `${drSp}`)},params:{missingProperty:'${esc(dep)}'},message:"must have required property '${esc(dep)}'",docUrl:'${drLit.docUrl}'${drLit.frame}});if(!_all)return{valid:false,errors:_e}}`);
		}
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const childPath = childPathExpr(pathExpr, ptrSeg(key));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${ownKeyExpr(ctx, v, key)}){`);
			genCodeE(prop, `${v}[${JSON.stringify(key)}]`, childPath, lines, ctx, schemaPrefix + "/properties/" + ptrSeg(key));
			lines.push(`}`);
		}
		if (schema.patternProperties) genPatternPropertiesE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null) genAdditionalSchemaE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.dependentSchemas) genDependentSchemasE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.propertyNames === false) genPropertyNamesFalseE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.propertyNames && typeof schema.propertyNames === "object") genPropertyNamesE(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.items !== void 0 && schema.items !== true) {
			const startIdx = schema.prefixItems ? schema.prefixItems.length : 0;
			const idx = `_j${ctx.varCounter}`;
			const elem = `_ei${ctx.varCounter}`;
			ctx.varCounter++;
			const childPath = childPathDynExpr(pathExpr, idx);
			lines.push(`if(Array.isArray(${v})){for(let ${idx}=${startIdx};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCodeE(schema.items, elem, childPath, lines, ctx, schemaPrefix + "/items");
			lines.push(`}}`);
		}
		if (schema.prefixItems) genPrefixItemsE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.contains !== void 0) genContainsE(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.allOf) for (let _ai = 0; _ai < schema.allOf.length; _ai++) genCodeE(schema.allOf[_ai], v, pathExpr, lines, ctx, schemaPrefix + "/allOf/" + _ai);
		if (schema.anyOf) genAnyOfE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.oneOf) genOneOfE(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.not !== void 0) genNotE(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.if !== void 0) genIfE(schema, v, pathExpr, lines, ctx, schemaPrefix);
	}
	function genDynamicRefE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
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
	function genUniqueItemsE(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isArr) {
		const si = ctx.varCounter++;
		const failExpr = (iVar, jVar) => fail("uniqueItems", "uniqueItems", `{i:${iVar},j:${jVar}}`, `'must NOT have duplicate items (items ## '+${jVar}+' and '+${iVar}+' are identical)'`);
		const inner = `const _j${si}=${emitUqp(ctx)}(${v});if(_j${si}>=0){const _i${si}=_uqpI;${failExpr("_i" + si, "_j" + si)}}`;
		lines.push(isArr ? `{${inner}}` : `if(Array.isArray(${v})){${inner}}`);
	}
	function genUnevaluatedFalseE(schema, v, pathExpr, lines, ctx, schemaPrefix, isObj) {
		const allowedU = Object.keys(schema.properties || {}).map((k) => `${JSON.stringify(k)}`).join(",");
		const ui = ctx.varCounter++;
		const upSp = `${schemaPrefix}/unevaluatedProperties`;
		const upLit = buildErrorLiteral({
			keyword: "unevaluatedProperties",
			schemaPath: upSp,
			sourceMap: ctx.sourceMap
		});
		const patChecksU = [];
		for (const pat of Object.keys(schema.patternProperties || {})) {
			const pattern = JSON.stringify(pat);
			if (!ctx.regExpMap.has(pattern)) {
				const ri = ctx.varCounter++;
				ctx.regExpMap.set(pattern, ri);
				if (useSafeEngine(pat)) {
					ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
					ctx.usesSafeRe = true;
				} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern}${reFlagArg(pattern)})`);
			}
			patChecksU.push(`_re${ctx.regExpMap.get(pattern)}.test(_k${ui}[_i])`);
		}
		const isUneval = patChecksU.length ? `!_a${ui}.has(_k${ui}[_i])&&!(${patChecksU.join("||")})` : `!_a${ui}.has(_k${ui}[_i])`;
		ctx.helperCode.push(`const _a${ui}=new Set([${allowedU}])`);
		const innerU = `const _k${ui}=Object.keys(${v});for(let _i=0;_i<_k${ui}.length;_i++){if(${isUneval}){_e.push({code:'${upLit.codeStr}',keyword:'unevaluatedProperties',instancePath:${pathExpr || "\"\""},schemaPath:'${upSp}'${ordinalField(ctx, `${upSp}`)},params:{unevaluatedProperty:_k${ui}[_i]},message:'must NOT have unevaluated properties',docUrl:'${upLit.docUrl}'${upLit.frame}});if(!_all)return{valid:false,errors:_e}}}`;
		lines.push(isObj ? `{${innerU}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${innerU}}`);
	}
	function genUnevaluatedItemsFalseE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		const itemsIsPrefix = Array.isArray(schema.items);
		if (!(schema.items !== void 0 && !itemsIsPrefix)) {
			const plen = itemsIsPrefix ? schema.items.length : Array.isArray(schema.prefixItems) ? schema.prefixItems.length : 0;
			const uiSp = `${schemaPrefix}/unevaluatedItems`;
			const uiLit = buildErrorLiteral({
				keyword: "unevaluatedItems",
				schemaPath: uiSp,
				sourceMap: ctx.sourceMap
			});
			lines.push(`if(Array.isArray(${v})&&${v}.length>${plen}){_e.push({code:'${uiLit.codeStr}',keyword:'unevaluatedItems',instancePath:${pathExpr || "\"\""},schemaPath:'${uiSp}'${ordinalField(ctx, `${uiSp}`)},params:{limit:${plen}},message:'must NOT have more than ${plen} items',docUrl:'${uiLit.docUrl}'${uiLit.frame}});if(!_all)return{valid:false,errors:_e}}`);
		}
	}
	function genPatternPropertiesE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			const pattern = JSON.stringify(pat);
			if (!ctx.regExpMap.has(pattern)) {
				const ri = ctx.varCounter++;
				ctx.regExpMap.set(pattern, ri);
				if (useSafeEngine(pat)) {
					ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
					ctx.usesSafeRe = true;
				} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern}${reFlagArg(pattern)})`);
			}
			const ri = ctx.regExpMap.get(pattern);
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){if(_re${ri}.test(_k${ki})){`);
			const _peFn = emitPtrEsc(ctx);
			const p = pathExpr ? `${pathExpr}+'/'+${_peFn}(_k${ki})` : `'/'+${_peFn}(_k${ki})`;
			genCodeE(sub, `${v}[_k${ki}]`, p, lines, ctx, schemaPrefix + "/patternProperties/" + ptrSeg(pat));
			lines.push(`}}}`);
		}
	}
	function genAdditionalSchemaE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		const ki = ctx.varCounter++;
		const known = Object.keys(schema.properties || {});
		if (known.length) ctx.helperCode.push(`const _ak${ki}=new Set([${known.map((k) => JSON.stringify(k)).join(",")}])`);
		const guard = "";
		const patTests = [];
		for (const pat of Object.keys(schema.patternProperties || {})) {
			const pattern = JSON.stringify(pat);
			if (!ctx.regExpMap.has(pattern)) {
				const ri = ctx.varCounter++;
				ctx.regExpMap.set(pattern, ri);
				if (useSafeEngine(pat)) {
					ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
					ctx.usesSafeRe = true;
				} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern}${reFlagArg(pattern)})`);
			}
			patTests.push(`_re${ctx.regExpMap.get(pattern)}.test(_k${ki})`);
		}
		const conds = [];
		if (known.length) conds.push(`!_ak${ki}.has(_k${ki})`);
		if (patTests.length) conds.push(`!(${patTests.join("||")})`);
		const keep = conds.length ? `if(${conds.join("&&")}){` : `{`;
		lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${guard}for(const _k${ki} in ${v}){${keep}`);
		const _peFn = emitPtrEsc(ctx);
		const p = pathExpr ? `${pathExpr}+'/'+${_peFn}(_k${ki})` : `'/'+${_peFn}(_k${ki})`;
		genCodeE(schema.additionalProperties, `${v}[_k${ki}]`, p, lines, ctx, schemaPrefix + "/additionalProperties");
		lines.push(`}}}`);
	}
	function genDependentSchemasE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${ownKeyExpr(ctx, v, key)}){`);
			genCodeE(depSchema, v, pathExpr, lines, ctx, schemaPrefix + "/dependentSchemas/" + ptrSeg(key));
			lines.push(`}`);
		}
	}
	function genPropertyNamesFalseE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		const ki = ctx.varCounter++;
		const p = pathExpr || "\"\"";
		lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){_e.push({keyword:'not',instancePath:${p},schemaPath:'${schemaPrefix}/propertyNames'${ordinalField(ctx, `${schemaPrefix}/propertyNames`)},params:{},message:'boolean schema is false'});if(!_all)return{valid:false,errors:_e}}}`);
	}
	function genPropertyNamesE(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		const pn = schema.propertyNames;
		const ki = ctx.varCounter++;
		lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){`);
		if (!isSimplePN(pn)) {
			genCodeE(pn, `_k${ki}`, pathExpr, lines, ctx, schemaPrefix + "/propertyNames");
			lines.push(`}}`);
			return;
		}
		if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
		if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
		if (pn.pattern) {
			const pattern = JSON.stringify(pn.pattern);
			if (!ctx.regExpMap.has(pattern)) {
				const ri = ctx.varCounter++;
				ctx.regExpMap.set(pattern, ri);
				if (useSafeEngine(pn.pattern)) {
					ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
					ctx.usesSafeRe = true;
				} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern}${reFlagArg(pattern)})`);
			}
			const ri = ctx.regExpMap.get(pattern);
			lines.push(`if(!_re${ri}.test(_k${ki})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, JSON.stringify(`must match pattern "${pn.pattern}"`))}}`);
		}
		if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
		if (pn.enum) {
			const ei = ctx.varCounter++;
			ctx.helperCode.push(`const _es${ei}=new Set(${JSON.stringify(pn.enum)})`);
			lines.push(`if(!_es${ei}.has(_k${ki})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
		}
		lines.push(`}}`);
	}
	function genPrefixItemsE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		for (let i = 0; i < schema.prefixItems.length; i++) {
			const childPath = childPathExpr(pathExpr, String(i));
			lines.push(`if(Array.isArray(${v})&&${v}.length>${i}){`);
			genCodeE(schema.prefixItems[i], `${v}[${i}]`, childPath, lines, ctx, schemaPrefix + "/prefixItems/" + i);
			lines.push(`}`);
		}
	}
	function genContainsE(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		const ci = ctx.varCounter++;
		const subLines = [];
		nestedGenCode(schema.contains, `_cv`, subLines, ctx);
		const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
		const minC = schema.minContains !== void 0 ? schema.minContains : 1;
		const maxC = schema.maxContains;
		lines.push(`if(Array.isArray(${v})){const _cf${ci}=function(_cv){${fnBody}};let _cc${ci}=0;for(let _ci${ci}=0;_ci${ci}<${v}.length;_ci${ci}++){if(_cf${ci}(${v}[_ci${ci}]))_cc${ci}++}`);
		lines.push(`if(_cc${ci}<${minC}){${fail("contains", "contains", `{minContains:${minC}}`, `'must contain at least ${minC} valid item(s)'`)}}`);
		if (maxC !== void 0) lines.push(`if(_cc${ci}>${maxC}){${fail("contains", "contains", `{minContains:${minC},maxContains:${maxC}}`, `'must NOT contain more than ${maxC} valid item(s)'`)}}`);
		lines.push(`}`);
	}
	function genAnyOfE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		emitBranchCollapse(schema.anyOf, "anyOf", v, pathExpr, lines, ctx, schemaPrefix);
	}
	function genOneOfE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		emitBranchCollapse(schema.oneOf, "oneOf", v, pathExpr, lines, ctx, schemaPrefix);
	}
	function genNotE(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		const subLines = [];
		nestedGenCode(schema.not, "_nv", subLines, ctx);
		const nfn = subLines.length === 0 ? `function(_nv){return true}` : `function(_nv){${subLines.join(";")};return true}`;
		const fi = ctx.varCounter++;
		lines.push(`{const _nf${fi}=${nfn};if(_nf${fi}(${v})){${fail("not", "not", "{}", "'must NOT be valid'")}}}`);
	}
	function genIfE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		const ifLines = [];
		nestedGenCode(schema.if, "_iv", ifLines, ctx);
		const fi = ctx.varCounter++;
		const ifFn = ifLines.length === 0 ? `function(_iv){return true}` : `function(_iv){${ifLines.join(";")};return true}`;
		lines.push(`{const _if${fi}=${ifFn}`);
		if (schema.then !== void 0) {
			lines.push(`if(_if${fi}(${v})){`);
			genCodeE(schema.then, v, pathExpr, lines, ctx, schemaPrefix + "/then");
			lines.push(`}`);
		}
		if (schema.else !== void 0) {
			lines.push(`${schema.then !== void 0 ? "else" : `if(!_if${fi}(${v}))`}{`);
			genCodeE(schema.else, v, pathExpr, lines, ctx, schemaPrefix + "/else");
			lines.push(`}`);
		}
		lines.push(`}`);
	}
	function sharedErr(lit, rootSchema) {
		Object.defineProperty(lit, "_s", { value: true });
		Object.defineProperty(lit, "_t", { value: {} });
		if (lit._o === void 0) {
			const o = ordinalFor(rootSchema, lit.schemaPath);
			if (typeof o === "number") Object.defineProperty(lit, "_o", { value: o });
		}
		return Object.freeze(lit);
	}
	function errPushC(ctx, keyword, sp, pathExpr, paramsCode, msgCode, valueExpr, lean, paramsShared) {
		if (!ctx.rich) return `(_e=_ap(_e,${lean}))`;
		if (!ctx.richMk) {
			ctx.richMk = true;
			const { makeRich } = require_enrich_site();
			ctx.closureVars.push("_mk");
			ctx.closureVals.push(makeRich);
		}
		let paramsVal;
		try {
			paramsVal = Function("return " + paramsCode)();
		} catch {
			paramsVal = void 0;
		}
		const fmt = keyword === "format" && paramsVal ? paramsVal.format : void 0;
		const { errorSite } = require_enrich_site();
		const siteVar = `_S${ctx.varCounter++}`;
		ctx.closureVars.push(siteVar);
		const rel = sp.startsWith(SP_PLACEHOLDER);
		ctx.closureVals.push(errorSite(keyword, unescapeSp(rel ? sp.slice(10) : sp), paramsVal, fmt));
		return `(_e=_ap(_e,_mk(${siteVar},${pathExpr || "\"\""},${paramsShared || paramsCode},${msgCode},${valueExpr},d${rel ? ",_sp" : ""})))`;
	}
	function compileToJSCombined(schema, VALID_RESULT, schemaMap, userFormats, opts) {
		const inputSchema = schema;
		schema = prepareForCodegen(schema, schemaMap);
		if (typeof schema === "object" && schema !== null) JSON.stringify(schema);
		if (typeof schema === "boolean") {
			if (!schema && opts && (opts.rich || opts.resultShape)) return null;
			if (opts && opts.resultShape) return null;
			return schema ? () => VALID_RESULT : () => ({
				valid: false,
				errors: [{
					keyword: "not",
					instancePath: "",
					schemaPath: "#",
					params: {},
					message: "boolean schema is false"
				}]
			});
		}
		if (typeof schema !== "object" || schema === null) return null;
		if (!sharedCodegenGate(schema, schemaMap)) return null;
		if (schema.patternProperties) {
			for (const [pat, sub] of Object.entries(schema.patternProperties)) if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) {
			for (const sub of Object.values(schema.dependentSchemas)) if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !isSimplePN(schema.propertyNames) && !codegenSafe(schema.propertyNames, schemaMap)) return null;
		const cRootDefs = schema.$defs || schema.definitions || null;
		const cAnchors = {};
		if (schema.$dynamicAnchor) cAnchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) cAnchors["#" + schema.$anchor] = schema;
		if (typeof schema.$id === "string" && schema.$id.startsWith("#")) cAnchors[schema.$id] = schema;
		if (cRootDefs) {
			for (const def of Object.values(cRootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) cAnchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) cAnchors["#" + def.$anchor] = def;
				if (typeof def.$id === "string" && def.$id.startsWith("#")) cAnchors[def.$id] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !cAnchors["#" + ext.$dynamicAnchor]) cAnchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !cAnchors["#" + ext.$anchor]) cAnchors["#" + ext.$anchor] = ext;
				if (typeof ext.$id === "string" && ext.$id.startsWith("#") && !cAnchors[ext.$id]) cAnchors[ext.$id] = ext;
			}
		}
		if (hasUnresolvableRef(schema, cRootDefs, cAnchors, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return null;
		const ctx = {
			noOrdinal: !!(opts && opts.runtimeShape),
			rich: !!(opts && opts.rich),
			inCombined: true,
			hoisted: [],
			rootC: schema,
			varCounter: 0,
			helperCode: ["function _ap(e,x){if(e===undefined)return[x];e.push(x);return e}"],
			shared: [],
			closureVars: ["_cpLen"],
			closureVals: [_cpLen],
			rootDefs: cRootDefs,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null,
			anchors: cAnchors,
			rootSchema: inputSchema,
			userFormats: userFormats || null
		};
		const lines = [];
		try {
			genCodeC(schema, "d", "", lines, ctx, "#");
		} catch (e) {
			if (e === DECLINE) return null;
			throw e;
		}
		if (lines.length === 0) return () => VALID_RESULT;
		if (opts && opts.resultShape) {
			ctx.closureVars.push("_ER", "_EE", "_SRT", "_FB", "_VF");
			ctx.closureVals.push(opts.resultShape.Rejection, opts.resultShape.empty, opts.resultShape.sort, opts.resultShape.fallback, opts.resultShape.verdict || null);
		}
		const closureNames = ctx.usesSafeRe ? [...ctx.closureVars, "__ataSafeRe"] : ctx.closureVars;
		const closureArgs = ctx.usesSafeRe ? [...ctx.closureVals, compileSafe] : ctx.closureVals;
		const closureParams = closureNames.join(",");
		const guardList = [...ctx.defFns ? ctx.defFns.values() : [], ...ctx.cycFnsC || []];
		const guardDefs = guardList.length ? guardList : null;
		if (guardDefs) ctx.helperCode.unshift(emitGuardState());
		if (ctx.usesBranchCollapse) ctx.helperCode.push(require_branch_collapse().embedSource());
		if (ctx.usesBranchCollapse && opts && opts.runtimeShape) {
			const shape = (src) => src.replace(/code:'ATA\d{4}',/g, "").replace(/,docUrl:'https:\/\/ata-validator\.com\/e\/ATA\d{4}'/g, "");
			for (let i = 0; i < ctx.helperCode.length; i++) ctx.helperCode[i] = shape(ctx.helperCode[i]);
			for (let i = 0; i < lines.length; i++) lines[i] = shape(lines[i]);
		}
		const rs = opts && opts.resultShape;
		let hoistDecl = ctx.hoisted.length ? `let ${ctx.hoisted.map((n) => n + "=null").join(",")};` : "";
		let checks = lines.join("\n  ");
		let allDecl = ctx.usesBranchCollapse ? "const _all=true;" : "";
		if (guardDefs) {
			const clears = ["_stk.clear()"].concat(guardDefs.map((n) => `${n}_s.clear()`)).join(";");
			ctx.helperCode.push(`function _bodyC(d){${hoistDecl}${allDecl}let _e;\n  ${checks}\n  return _e}`);
			hoistDecl = "";
			allDecl = "";
			checks = `_sd=0;try{_e=_bodyC(d)}catch(_err){if(_err!==_CYC)throw _err;_sg=true;${clears};try{_e=_bodyC(d)}finally{_sg=false}}`;
		}
		const inner = rs ? `try{${hoistDecl}${ctx.usesBranchCollapse && ctx.unguardedCollapse ? "if(_VF!==null&&_VF(d))return{valid:true,data:d,errors:_EE};" : ""}${allDecl}let _e;\n  ` + checks + `\n  return _e?new _ER(${ctx.usesBranchCollapse ? "_SRT(_e)" : "_e.length>1?_SRT(_e):_e"}):{valid:true,data:d,errors:_EE}}catch(_x){return _FB(d)}` : hoistDecl + allDecl + `let _e;\n  ` + checks + `\n  return _e?{valid:false,errors:_e}:R`;
		const helpers = ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "";
		try {
			if (typeof process !== "undefined" && process.env && process.env.ATA_DUMP_CODEGEN) console.log("=== COMBINED CODEGEN ===\n" + helpers + inner + "\n=== CLOSURE VARS: " + ctx.closureVars.length + " ===");
			return new Function("R" + (closureParams ? "," + closureParams : ""), `${helpers}return function(d){${inner}}`)(VALID_RESULT, ...closureArgs);
		} catch (e) {
			if (typeof process !== "undefined" && process.env && process.env.ATA_DEBUG) console.error("compileToJSCombined error:", e.message, "\n", inner.slice(0, 500));
			return null;
		}
	}
	const TYPE_KEYWORDS = {
		object: [
			"properties",
			"patternProperties",
			"additionalProperties",
			"required",
			"propertyNames",
			"minProperties",
			"maxProperties",
			"dependentRequired",
			"dependentSchemas",
			"dependencies",
			"unevaluatedProperties"
		],
		array: [
			"items",
			"prefixItems",
			"additionalItems",
			"contains",
			"minContains",
			"maxContains",
			"minItems",
			"maxItems",
			"uniqueItems",
			"unevaluatedItems"
		],
		string: [
			"minLength",
			"maxLength",
			"pattern"
		],
		number: [
			"minimum",
			"maximum",
			"exclusiveMinimum",
			"exclusiveMaximum",
			"multipleOf"
		]
	};
	TYPE_KEYWORDS.integer = TYPE_KEYWORDS.number;
	const NOT_VALIDATING = /* @__PURE__ */ new Set([
		"$schema",
		"$id",
		"$anchor",
		"$comment",
		"$defs",
		"definitions",
		"title",
		"description",
		"default",
		"examples",
		"deprecated",
		"readOnly",
		"writeOnly",
		"$vocabulary"
	]);
	function typeMismatchRest(schema, types) {
		const drop = /* @__PURE__ */ new Set([
			"type",
			"enum",
			"const",
			"anyOf",
			"oneOf"
		]);
		for (const t of types) for (const k of TYPE_KEYWORDS[t] || []) drop.add(k);
		let rest = null;
		for (const k of Object.keys(schema)) {
			if (drop.has(k)) continue;
			if (rest === null) rest = {};
			setOwn(rest, k, schema[k]);
		}
		if (rest === null) return null;
		if (schema[REF_DONE]) Object.defineProperty(rest, REF_DONE, { value: true });
		for (const k of Object.keys(rest)) if (!NOT_VALIDATING.has(k) && !k.startsWith("x-")) return rest;
		return null;
	}
	function genCodeC(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		return withPlain(schema, v, lines, ctx, () => genCodeCNode(schema, v, pathExpr, lines, ctx, schemaPrefix));
	}
	function emitSharedDefC(defName, v, pathExpr, lines, ctx, schemaPrefix) {
		if (!ctx.cyclicDefs) ctx.cyclicDefs = cyclicDefNames(ctx.rootDefs);
		if (!ctx.sharedDefs) ctx.sharedDefs = sharedDefNames(ctx.rootSchema, ctx.rootDefs);
		const cyclic = ctx.cyclicDefs.has(defName);
		if (!cyclic && !ctx.sharedDefs.has(defName)) return false;
		emitDefFnC(defName, ctx.rootDefs[defName], cyclic, v, pathExpr, lines, ctx, schemaPrefix);
		return true;
	}
	function emitDefFnC(key, target, cyclic, v, pathExpr, lines, ctx, schemaPrefix) {
		if (!ctx.defFnsC) ctx.defFnsC = /* @__PURE__ */ new Map();
		let fnName = ctx.defFnsC.get(key);
		if (!fnName) {
			fnName = "_defC" + ctx.defFnsC.size + "_" + (key === "#" ? "root" : key.replace(/[^A-Za-z0-9_]/g, "_"));
			ctx.defFnsC.set(key, fnName);
			const outerHoisted = ctx.hoisted;
			ctx.hoisted = [];
			const outerRefs = ctx.refStack;
			ctx.refStack = /* @__PURE__ */ new Set();
			const bodyLines = [];
			let hoisted;
			try {
				genCodeC(target, "_dv", "_p", bodyLines, ctx, SP_PLACEHOLDER);
			} finally {
				hoisted = ctx.hoisted;
				ctx.hoisted = outerHoisted;
				ctx.refStack = outerRefs;
			}
			let body = bodyLines.join("\n  ");
			body = body.split(`'${SP_PLACEHOLDER}`).join(`_sp+'`).split(`"${SP_PLACEHOLDER}`).join(`_sp+"`);
			if (body.includes(SP_PLACEHOLDER)) throw DECLINE;
			const decl = hoisted.length ? `let ${hoisted.map((n) => n + "=null").join(",")};` : "";
			const fn = `function ${cyclic ? fnName + "_b" : fnName}(_dv,_p,_sp,d){const _all=true;${decl}let _e;\n  ${body}\n  return _e}`;
			if (cyclic) {
				if (!ctx.cycFnsC) ctx.cycFnsC = [];
				ctx.cycFnsC.push(fnName);
				ctx.helperCode.push(`const ${fnName}_s=new Set()\n  function ${fnName}(_dv,_p,_sp,d){\n  if(_sg){if(typeof _dv!=='object'||_dv===null)return ${fnName}_b(_dv,_p,_sp,d);if(${fnName}_s.has(_dv))return;${fnName}_s.add(_dv);try{return ${fnName}_b(_dv,_p,_sp,d)}finally{${fnName}_s.delete(_dv)}}\n  if(++_sd>${CYCLE_DEPTH})throw _CYC\n  const _r=${fnName}_b(_dv,_p,_sp,d)\n  _sd--\n  return _r\n  }\n  ` + fn);
			} else ctx.helperCode.push(fn);
		}
		lines.push(`{const _r=${fnName}(${v},${pathExpr || "\"\""},'${schemaPrefix}',d);if(_r!==undefined){if(_e===undefined)_e=_r;else for(let _i=0;_i<_r.length;_i++)_e.push(_r[_i])}}`);
	}
	const REF_DONE = Symbol("ata.refDone");
	function genCodeCNode(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		if (!schemaPrefix) schemaPrefix = "#";
		let ppHandledPropertyNames = false;
		if (schema === false) {
			lines.push(";" + errPushC(ctx, "not", schemaPrefix, pathExpr, "{}", "'boolean schema is false'", v, `{keyword:'not',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}'${ordinalField(ctx, `${schemaPrefix}`)},params:{},message:'boolean schema is false'}`));
			return;
		}
		if (schema === true) return;
		if (typeof schema !== "object" || schema === null) return;
		if (schema.$ref && !schema[REF_DONE]) {
			if (Object.keys(schema).some((k) => !REF_NEUTRAL_SIBLINGS.has(k) && !k.startsWith("x-"))) {
				if (!ctx.inCombined || ctx.inBranchFn) throw DECLINE;
				genCodeCNode({ $ref: schema.$ref }, v, pathExpr, lines, ctx, schemaPrefix);
				const rest = { ...schema };
				Object.defineProperty(rest, REF_DONE, { value: true });
				genCodeCNode(rest, v, pathExpr, lines, ctx, schemaPrefix);
				return;
			}
			if (schema.$ref === "#") {
				if (ctx.inCombined && !ctx.inBranchFn && ctx.rootC) {
					emitDefFnC("#", ctx.rootC, true, v, pathExpr, lines, ctx, schemaPrefix);
					return;
				}
				throw DECLINE;
			}
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.inCombined && !ctx.inBranchFn && emitSharedDefC(m[1], v, pathExpr, lines, ctx, schemaPrefix)) return;
				if (ctx.refStack.has(schema.$ref)) throw DECLINE;
				ctx.refStack.add(schema.$ref);
				genCodeC(ctx.rootDefs[m[1]], v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (!m && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/")) {
				const entry = ctx.rootDefs && ctx.rootDefs[schema.$ref];
				const anchorTarget = entry && entry.raw ? entry.raw : ctx.anchors && ctx.anchors[schema.$ref];
				if (anchorTarget) {
					if (ctx.refStack.has(schema.$ref)) throw DECLINE;
					ctx.refStack.add(schema.$ref);
					genCodeC(anchorTarget, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
			if (ctx.schemaMap && ctx.schemaMap.has(schema.$ref)) {
				if (ctx.refStack.has(schema.$ref)) throw DECLINE;
				ctx.refStack.add(schema.$ref);
				genCodeC(ctx.schemaMap.get(schema.$ref), v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (ctx.schemaMap && schema.$ref.includes("#") && !schema.$ref.startsWith("#")) {
				const r = resolveCrossSchemaRef(schema.$ref, ctx.schemaMap);
				if (r) {
					if (ctx.refStack.has(schema.$ref)) throw DECLINE;
					ctx.refStack.add(schema.$ref);
					genCodeC(r.schema, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
		}
		if (schema.$dynamicRef) genDynamicRefC(schema, v, pathExpr, lines, ctx, schemaPrefix);
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		let isObj = false, isArr = false, isStr = false, isNum = false;
		const isStaticPath = !pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+");
		const fail = (keyword, schemaSuffix, paramsCode, msgCode) => {
			const sp = schemaPrefix + "/" + schemaSuffix;
			if (ctx.rich) {
				let shared = null;
				if (isStaticPath && msgCode.startsWith("'") && !msgCode.includes("+")) {
					let pv;
					try {
						pv = Function("return " + paramsCode)();
					} catch {
						pv = void 0;
					}
					if (pv !== void 0) {
						shared = `_P${ctx.varCounter++}`;
						ctx.closureVars.push(shared);
						ctx.closureVals.push(Object.freeze(pv));
					}
				}
				return errPushC(ctx, keyword, sp, pathExpr, paramsCode, msgCode, v, null, shared);
			}
			if (isStaticPath && !ctx.noOrdinal && msgCode.startsWith("'") && !msgCode.includes("+")) {
				let paramsVal;
				try {
					paramsVal = Function("return " + paramsCode)();
				} catch {}
				if (paramsVal !== void 0) {
					const errVar = `_E${ctx.varCounter++}`;
					let pathVal, msgVal;
					try {
						pathVal = pathExpr ? Function("return " + pathExpr)() : "";
						msgVal = Function("return " + msgCode)();
					} catch {
						pathVal = void 0;
					}
					if (pathVal !== void 0) {
						const spVal = unescapeSp(sp);
						ctx.closureVars.push(errVar);
						const o = ctx.noOrdinal ? null : ordinalFor(ctx.rootSchema, spVal);
						const lit = {
							keyword,
							instancePath: pathVal,
							schemaPath: spVal,
							params: Object.freeze(paramsVal),
							message: msgVal
						};
						if (o !== null) lit._o = o;
						ctx.closureVals.push(sharedErr(lit, ctx.rootSchema));
						return `(_e=_ap(_e,${errVar}))`;
					}
				}
			}
			return `(_e=_ap(_e,{keyword:'${keyword}',instancePath:${pathExpr || "\"\""},schemaPath:'${sp}',params:${paramsCode},message:${msgCode}${ordinalField(ctx, sp)}}))`;
		};
		const emitEnumConst = () => {
			if (schema.enum) lines.push(`if(!(${enumCondition(ctx, schema.enum, v)})){${fail("enum", "enum", `{allowedValues:${JSON.stringify(schema.enum)}}`, "'must be equal to one of the allowed values'")}}`);
			if (schema.const !== void 0) {
				const cv = schema.const;
				if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)}){${fail("const", "const", `{allowedValue:${JSON.stringify(schema.const)}}`, "'must be equal to constant'")}}`);
				else lines.push(`if(!${emitDeq(ctx)}(${v},${emitConstant(ctx, cv)})){${fail("const", "const", `{allowedValue:${emitParamConstant(ctx, schema.const)}}`, "'must be equal to constant'")}}`);
			}
		};
		if (types) {
			const conds = types.map((t) => {
				switch (t) {
					case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
					case "array": return `Array.isArray(${v})`;
					case "string": return `typeof ${v}==='string'`;
					case "number": return `Number.isFinite(${v})`;
					case "integer": return `Number.isInteger(${v})`;
					case "boolean": return `typeof ${v}==='boolean'`;
					case "null": return `${v}===null`;
					default: return "true";
				}
			});
			const expected = types.join(", ");
			const expectedParam = !Array.isArray(schema.type) ? `'${types[0]}'` : JSON.stringify(types);
			const typeOk = `_tok${ctx.varCounter++}`;
			lines.push(`const ${typeOk}=${conds.join("||")}`);
			lines.push(`if(!${typeOk}){${fail("type", "type", `{type:${expectedParam}}`, `'must be ${expected}'`)}}`);
			if (types.length === 1) {
				isObj = types[0] === "object";
				isArr = types[0] === "array";
				isStr = types[0] === "string";
				isNum = types[0] === "number" || types[0] === "integer";
			}
			emitEnumConst();
			const numberToo = types.includes("integer") && !types.includes("number");
			lines.push(numberToo ? `if(${typeOk}||typeof ${v}==='number'){` : `if(${typeOk}){`);
		} else emitEnumConst();
		const requiredSet = new Set(schema.required || []);
		const hoisted = {};
		if (schema.required && schema.properties && isObj) {
			const destructKeys = [];
			for (const key of schema.required) if (schema.properties[key]) {
				const lv = `_h${ctx.varCounter++}`;
				hoisted[key] = lv;
				destructKeys.push(`${JSON.stringify(key)}:${lv}`);
			}
			if (destructKeys.length > 0) {
				lines.push(`let{${destructKeys.join(",")}}=${v}`);
				for (const key of schema.required) if (hoisted[key]) lines.push(`if(${hoisted[key]}!==undefined&&!${ownGuard(ctx, v, key)})${hoisted[key]}=undefined`);
			}
			for (const key of schema.required) {
				const check = hoisted[key] ? `${hoisted[key]}===undefined` : `!${ownKeyExpr(ctx, v, key)}`;
				if (isStaticPath && !ctx.rich && !ctx.noOrdinal) {
					const errVar = `_E${ctx.varCounter++}`;
					const pathVal = pathExpr ? literalValue(pathExpr) : "";
					ctx.closureVars.push(errVar);
					ctx.closureVals.push(sharedErr({
						keyword: "required",
						instancePath: pathVal,
						schemaPath: unescapeSp(`${schemaPrefix}/required`),
						params: Object.freeze({ missingProperty: key }),
						message: `must have required property '${key}'`
					}, ctx.rootSchema));
					lines.push(`if(${check}){(_e=_ap(_e,${errVar}))}`);
				} else lines.push(`if(${check}){${errPushC(ctx, "required", `${schemaPrefix}/required`, pathExpr, `{missingProperty:'${esc(key)}'}`, `"must have required property '${esc(key)}'"`, v, `{keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/required'${ordinalField(ctx, `${schemaPrefix}/required`)},params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'"}`)}}`);
			}
		} else if (schema.required) for (const key of schema.required) if ((!pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+")) && !ctx.rich && !ctx.noOrdinal) {
			const errVar = `_E${ctx.varCounter++}`;
			const pathVal = pathExpr ? literalValue(pathExpr) : "";
			ctx.closureVars.push(errVar);
			ctx.closureVals.push(sharedErr({
				keyword: "required",
				instancePath: pathVal,
				schemaPath: unescapeSp(`${schemaPrefix}/required`),
				params: Object.freeze({ missingProperty: key }),
				message: `must have required property '${key}'`
			}, ctx.rootSchema));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!${ownKeyExpr(ctx, v, key)}){(_e=_ap(_e,${errVar}))}`);
		} else lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!${ownKeyExpr(ctx, v, key)}){${errPushC(ctx, "required", `${schemaPrefix}/required`, pathExpr, `{missingProperty:'${esc(key)}'}`, `"must have required property '${esc(key)}'"`, v, `{keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/required'${ordinalField(ctx, `${schemaPrefix}/required`)},params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'"}`)}}`);
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
			ctx.varCounter++;
			lines.push(`{if(typeof ${v}==='number'&&${multipleOfBad(v, m)}){${fail("multipleOf", "multipleOf", `{multipleOf:${m}}`, `'must be multiple of ${m}'`)}}}`);
		}
		if (schema.minLength !== void 0) {
			const M = schema.minLength;
			const inner = `${v}.length<${M}||(${v}.length<${M * 2}&&_cpLen(${v})<${M})`;
			const c = isStr ? inner : `typeof ${v}==='string'&&(${inner})`;
			lines.push(`if(${c}){${fail("minLength", "minLength", `{limit:${M}}`, `'must NOT have fewer than ${M} characters'`)}}`);
		}
		if (schema.maxLength !== void 0) {
			const X = schema.maxLength;
			const inner = `${v}.length>${X * 2}||(${v}.length>${X}&&_cpLen(${v})>${X})`;
			const c = isStr ? inner : `typeof ${v}==='string'&&(${inner})`;
			lines.push(`if(${c}){${fail("maxLength", "maxLength", `{limit:${X}}`, `'must NOT have more than ${X} characters'`)}}`);
		}
		if (schema.pattern) {
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) {
				const c = isStr ? `!(${inlineCheck})` : `typeof ${v}==='string'&&!(${inlineCheck})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, JSON.stringify(`must match pattern "${schema.pattern}"`))}}`);
			} else {
				const reVar = `_re${ctx.varCounter++}`;
				ctx.closureVars.push(reVar);
				ctx.closureVals.push(useSafeEngine(schema.pattern) ? compileSafe(schema.pattern) : new RegExp(schema.pattern, reFlags(schema.pattern)));
				const c = isStr ? `!${reVar}.test(${v})` : `typeof ${v}==='string'&&!${reVar}.test(${v})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, JSON.stringify(`must match pattern "${schema.pattern}"`))}}`);
			}
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) {
				const ri = ctx.varCounter++;
				const code = fc(v, isStr, ctx).replace(/return false/g, `{${fail("format", "format", `{format:'${esc(schema.format)}'}`, `'must match format "${esc(schema.format)}"'`)};break _fmt${ri}}`);
				lines.push(`_fmt${ri}:{${code}}`);
			} else if (ctx.userFormats && typeof ctx.userFormats[schema.format] === "function") {
				const closureName = `_uf_${schema.format.replace(/[^a-zA-Z0-9_]/g, "_")}`;
				if (!ctx.closureVars.includes(closureName)) {
					ctx.closureVars.push(closureName);
					ctx.closureVals.push(ctx.userFormats[schema.format]);
				}
				const guard = isStr ? "" : `typeof ${v}==='string'&&`;
				lines.push(`if(${guard}!${closureName}(${v})){${fail("format", "format", `{format:'${esc(schema.format)}'}`, `'must match format "${esc(schema.format)}"'`)}}`);
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
		if (schema.uniqueItems) genUniqueItemsC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isArr);
		if (schema.minProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length<${schema.minProperties}){${fail("minProperties", "minProperties", `{limit:${schema.minProperties}}`, `'must NOT have fewer than ${schema.minProperties} properties'`)}}`);
		if (schema.maxProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length>${schema.maxProperties}){${fail("maxProperties", "maxProperties", `{limit:${schema.maxProperties}}`, `'must NOT have more than ${schema.maxProperties} properties'`)}}`);
		if (schema.additionalProperties === false && !schema.patternProperties) {
			const propKeys = Object.keys(schema.properties || {});
			const ci = ctx.varCounter++;
			const detail = (test) => `const _k${ci}=Object.keys(${v});for(let _i=0;_i<_k${ci}.length;_i++)if(${test}){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}`;
			let body;
			if (propKeys.length <= 8) body = `let _x${ci}=0;for(const _f${ci} in ${v}){if(${propKeys.map((k) => `_f${ci}!==${JSON.stringify(k)}`).join("&&") || "true"}){_x${ci}=1;break}}if(_x${ci}){${detail(propKeys.map((k) => `_k${ci}[_i]!==${JSON.stringify(k)}`).join("&&") || "true")}}`;
			else body = `const _a${ci}=new Set([${propKeys.map((k) => JSON.stringify(k)).join(",")}]);let _x${ci}=0;for(const _f${ci} in ${v}){if(!_a${ci}.has(_f${ci})){_x${ci}=1;break}}if(_x${ci}){${detail(`!_a${ci}.has(_k${ci}[_i])`)}}`;
			const req = new Set(Array.isArray(schema.required) ? schema.required : []);
			if (propKeys.length > 0 && propKeys.every((k) => req.has(k) && !PROTO_NAMES.has(k))) {
				const present = propKeys.map((k) => `${JSON.stringify(k)} in ${v}`).join("&&");
				body = `let _n${ci}=0;for(const _f${ci} in ${v})_n${ci}++;if(_n${ci}!==${propKeys.length}||!(${present})){${body}}`;
			}
			lines.push(isObj ? `{${body}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${body}}`);
		}
		if (schema.unevaluatedProperties !== void 0 && schema.unevaluatedProperties !== true) {
			if (unevalLocalOk(schema, "unevaluatedProperties")) {
				if (schema.additionalProperties === void 0 && !schema.patternProperties) genUnevaluatedFalseC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isObj);
			} else genUnevaluatedDynamicC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isObj);
		}
		if (schema.unevaluatedItems !== void 0 && schema.unevaluatedItems !== true) {
			if (unevalLocalOk(schema, "unevaluatedItems")) genUnevaluatedItemsFalseC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
			else genUnevaluatedItemsDynamicC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) for (const dep of deps) if ((!pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+")) && !ctx.rich && !ctx.noOrdinal) {
			const errVar = `_E${ctx.varCounter++}`;
			const pathVal = pathExpr ? literalValue(pathExpr) : "";
			ctx.closureVars.push(errVar);
			ctx.closureVals.push(sharedErr({
				keyword: "required",
				instancePath: pathVal,
				schemaPath: unescapeSp(`${schemaPrefix}/dependentRequired`),
				params: Object.freeze({ missingProperty: dep }),
				message: `must have required property '${dep}'`
			}, ctx.rootSchema));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${ownKeyExpr(ctx, v, key)}&&!${ownKeyExpr(ctx, v, dep)}){(_e=_ap(_e,${errVar}))}`);
		} else lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${ownKeyExpr(ctx, v, key)}&&!${ownKeyExpr(ctx, v, dep)}){${errPushC(ctx, "required", `${schemaPrefix}/dependentRequired`, pathExpr, `{missingProperty:'${esc(dep)}'}`, `"must have required property '${esc(dep)}'"`, v, `{keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/dependentRequired'${ordinalField(ctx, `${schemaPrefix}/dependentRequired`)},params:{missingProperty:'${esc(dep)}'},message:"must have required property '${esc(dep)}'"}`)}}`);
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const pv = hoisted[key] || `${v}[${JSON.stringify(key)}]`;
			const childPath = childPathExpr(pathExpr, ptrSeg(key));
			if (requiredSet.has(key) && isObj) {
				lines.push(`if(${pv}!==undefined${hoisted[key] ? "" : "&&" + ownGuard(ctx, v, key)}){`);
				genCodeC(prop, pv, childPath, lines, ctx, schemaPrefix + "/properties/" + ptrSeg(key));
				lines.push(`}`);
			} else if (isObj) {
				const oi = ctx.varCounter++;
				lines.push(`{const _o${oi}=${v}[${JSON.stringify(key)}];if(_o${oi}!==undefined&&${ownGuard(ctx, v, key)}){`);
				genCodeC(prop, `_o${oi}`, childPath, lines, ctx, schemaPrefix + "/properties/" + ptrSeg(key));
				lines.push(`}}`);
			} else {
				lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${ownKeyExpr(ctx, v, key)}){`);
				genCodeC(prop, `${v}[${JSON.stringify(key)}]`, childPath, lines, ctx, schemaPrefix + "/properties/" + ptrSeg(key));
				lines.push(`}`);
			}
		}
		if (schema.patternProperties) {
			if (genPatternPropertiesC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isObj)) ppHandledPropertyNames = true;
		}
		if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null) genAdditionalSchemaC(schema, v, pathExpr, lines, ctx, schemaPrefix, isObj);
		if (schema.dependentSchemas) genDependentSchemasC(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.propertyNames === false) genPropertyNamesFalseC(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !ppHandledPropertyNames) genPropertyNamesC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.items !== void 0 && schema.items !== true) {
			const startIdx = schema.prefixItems ? schema.prefixItems.length : 0;
			const idx = `_j${ctx.varCounter}`, elem = `_ei${ctx.varCounter}`;
			ctx.varCounter++;
			const childPath = childPathDynExpr(pathExpr, idx);
			lines.push(`if(Array.isArray(${v})){for(let ${idx}=${startIdx};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCodeC(schema.items, elem, childPath, lines, ctx, schemaPrefix + "/items");
			lines.push(`}}`);
		}
		if (schema.prefixItems) genPrefixItemsC(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.contains !== void 0) genContainsC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.allOf) for (let _ai = 0; _ai < schema.allOf.length; _ai++) genCodeC(schema.allOf[_ai], v, pathExpr, lines, ctx, schemaPrefix + "/allOf/" + _ai);
		if (schema.anyOf && !ctx.inCombined) genAnyOfC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.oneOf && !ctx.inCombined) genOneOfC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.not !== void 0) genNotC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.if !== void 0) genIfC(schema, v, pathExpr, lines, ctx, schemaPrefix);
		if (types) {
			lines.push(`}`);
			const rest = typeMismatchRest(schema, types);
			if (rest !== null) {
				lines.push(`else{`);
				genCodeC(rest, v, pathExpr, lines, ctx, schemaPrefix);
				lines.push(`}`);
			}
		}
		if (schema.anyOf && ctx.inCombined) genAnyOfC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
		if (schema.oneOf && ctx.inCombined) genOneOfC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail);
	}
	function genDynamicRefC(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		const anchorKey = schema.$dynamicRef.startsWith("#") ? schema.$dynamicRef : "#" + schema.$dynamicRef;
		if (ctx.anchors && ctx.anchors[anchorKey]) {
			const target = ctx.anchors[anchorKey];
			if (target === ctx.rootSchema) throw DECLINE;
			const refKey = "$dynamicRef:" + anchorKey;
			if (ctx.refStack.has(refKey)) throw DECLINE;
			ctx.refStack.add(refKey);
			genCodeC(target, v, pathExpr, lines, ctx, schemaPrefix);
			ctx.refStack.delete(refKey);
		}
	}
	function genUniqueItemsC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isArr) {
		const si = ctx.varCounter++;
		const failExpr = (iVar, jVar) => fail("uniqueItems", "uniqueItems", `{i:${iVar},j:${jVar}}`, `'must NOT have duplicate items (items ## '+${jVar}+' and '+${iVar}+' are identical)'`);
		const inner = `const _j${si}=${emitUqp(ctx)}(${v});if(_j${si}>=0){const _i${si}=_uqpI;${failExpr("_i" + si, "_j" + si)}}`;
		lines.push(isArr ? `{${inner}}` : `if(Array.isArray(${v})){${inner}}`);
	}
	function genUnevalDynamicVerdict(schema, v, lines, ctx, isObj) {
		if (schema.additionalProperties !== void 0) return;
		const ui = ctx.varCounter++;
		const S = `_ev${ui}`;
		const body = [`const ${S}=[]`];
		addLocalAnnotations(schema, v, S, body, ctx);
		addTopApplicatorAnnotations(schema, v, S, body, ctx);
		const kVar = `_uk${ui}`;
		const up = schema.unevaluatedProperties;
		if (up === false) body.push(`for(const ${kVar} of Object.keys(${v}))if(!${S}.includes(${kVar}))return false`);
		else if (typeof up === "object" && up !== null) {
			const sub = [];
			genCode(up, `${v}[${kVar}]`, sub, ctx);
			if (sub.length) body.push(`for(const ${kVar} of Object.keys(${v}))if(!${S}.includes(${kVar})){${sub.join("\n  ")}\n  }`);
		} else throw DECLINE;
		lines.push(isObj ? `{${body.join(";")}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${body.join(";")}}`);
	}
	function genUnevaluatedDynamicC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isObj) {
		if (schema.additionalProperties !== void 0) return;
		const ui = ctx.varCounter++;
		const S = `_ev${ui}`;
		const body = [`const ${S}=[]`];
		addLocalAnnotations(schema, v, S, body, ctx);
		const share = ctx.inCombined && !ctx.inBranchFn && ctx.hoisted !== void 0 && (Array.isArray(schema.anyOf) || Array.isArray(schema.oneOf));
		const counts = share ? {
			anyOf: `_ac${ui}`,
			oneOf: `_oc${ui}`,
			oneOfMask: `_om${ui}`,
			of: `_ao${ui}`
		} : null;
		if (share) {
			ctx.hoisted.push(counts.anyOf, counts.oneOf, counts.oneOfMask, counts.of);
			body.push(`${counts.of}=${v};${counts.oneOfMask}=0`);
			if (!ctx.branchCounts) ctx.branchCounts = /* @__PURE__ */ new Map();
			if (Array.isArray(schema.anyOf)) ctx.branchCounts.set(schema.anyOf, {
				of: counts.of,
				count: counts.anyOf,
				mask: null
			});
			if (Array.isArray(schema.oneOf)) ctx.branchCounts.set(schema.oneOf, {
				of: counts.of,
				count: counts.oneOf,
				mask: schema.oneOf.length <= 30 ? counts.oneOfMask : null
			});
		}
		addTopApplicatorAnnotations(schema, v, S, body, ctx, counts);
		const kVar = `_uk${ui}`;
		const up = schema.unevaluatedProperties;
		if (up === false) body.push(`for(const ${kVar} of Object.keys(${v}))if(!${S}.includes(${kVar})){${fail("unevaluatedProperties", "unevaluatedProperties", `{unevaluatedProperty:${kVar}}`, "'must NOT have unevaluated properties'")}}`);
		else if (typeof up === "object" && up !== null) {
			const pe = emitPtrEsc(ctx);
			const p = pathExpr ? `${pathExpr}+'/'+${pe}(${kVar})` : `'/'+${pe}(${kVar})`;
			const sub = [];
			genCodeC(up, `${v}[${kVar}]`, p, sub, ctx, schemaPrefix + "/unevaluatedProperties");
			if (sub.length) body.push(`for(const ${kVar} of Object.keys(${v}))if(!${S}.includes(${kVar})){${sub.join("\n  ")}\n  }`);
		} else throw DECLINE;
		lines.push(isObj ? `{${body.join(";")}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${body.join(";")}}`);
	}
	function addLocalAnnotations(node, v, S, out, ctx) {
		if (node.additionalProperties !== void 0) {
			out.push(`for(const _ka in ${v})${S}.push(_ka)`);
			return;
		}
		for (const k of Object.keys(node.properties || {})) out.push(`if(Object.prototype.hasOwnProperty.call(${v},${JSON.stringify(k)}))${S}.push(${JSON.stringify(k)})`);
		const pats = Object.keys(node.patternProperties || {});
		if (pats.length) {
			const tests = [];
			const kv = `_pk${ctx.varCounter++}`;
			for (const pat of pats) {
				const fast = fastPrefixCheck(pat, kv);
				if (fast) {
					tests.push(fast);
					continue;
				}
				const ri = ctx.varCounter++;
				ctx.closureVars.push(`_re${ri}`);
				ctx.closureVals.push(safeReClosure(ctx, pat));
				tests.push(`_re${ri}.test(${kv})`);
			}
			out.push(`for(const ${kv} in ${v})if(${tests.join("||")})${S}.push(${kv})`);
		}
	}
	function addTopApplicatorAnnotations(node, v, S, out, ctx, counts) {
		if (node.$dynamicRef !== void 0 || node.$recursiveRef !== void 0 || node.dependencies !== void 0) throw DECLINE;
		for (const b of node.allOf || []) out.push(`${emitAnnot(b, ctx)}(${v},${S})`);
		if (Array.isArray(node.anyOf)) {
			if (counts) out.push(`${counts.anyOf}=0;${node.anyOf.map((b) => `if(${emitAnnot(b, ctx)}(${v},${S}))${counts.anyOf}++;`).join("")}`);
			else for (const b of node.anyOf) out.push(`${emitAnnot(b, ctx)}(${v},${S})`);
		}
		if (Array.isArray(node.oneOf)) {
			const t = counts ? counts.oneOf : `_oc${ctx.varCounter++}`;
			const mask = counts && node.oneOf.length <= 30 ? counts.oneOfMask : null;
			out.push(`{const ${t}m=${S}.length;${counts ? "" : "let "}${t}=0;${node.oneOf.map((b, i) => `if(${emitAnnot(b, ctx)}(${v},${S})){${t}++;${mask ? `${mask}|=${1 << i};` : ""}}`).join("")}if(${t}!==1)_rb(${S},${t}m)}`);
		}
		if (node.if !== void 0) {
			const thenCall = node.then !== void 0 ? `${emitAnnot(node.then, ctx)}(${v},${S})` : "";
			const elseCall = node.else !== void 0 ? `${emitAnnot(node.else, ctx)}(${v},${S})` : "";
			out.push(`if(${emitAnnot(node.if, ctx)}(${v},${S})){${thenCall}}else{${elseCall}}`);
		}
		if (node.dependentSchemas && typeof node.dependentSchemas === "object") for (const [k, ds] of Object.entries(node.dependentSchemas)) out.push(`if(Object.prototype.hasOwnProperty.call(${v},${JSON.stringify(k)}))${emitAnnot(ds, ctx)}(${v},${S})`);
		if (typeof node.$ref === "string") out.push(`${emitAnnot(refTargetFor(node.$ref, ctx), ctx)}(${v},${S})`);
	}
	function refTargetFor(ref, ctx) {
		const m = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
		const t = m && ctx.rootDefs ? ctx.rootDefs[m[1]] : void 0;
		if (t === void 0) throw DECLINE;
		return t;
	}
	const ANNOT_APPLICATORS = /* @__PURE__ */ new Set([
		"allOf",
		"anyOf",
		"oneOf",
		"if",
		"then",
		"else",
		"dependentSchemas",
		"$ref",
		"not",
		"unevaluatedProperties"
	]);
	function emitAnnot(sub, ctx) {
		if (sub === true) return "_anT";
		if (sub === false) return "_anF";
		if (sub === null || typeof sub !== "object") throw DECLINE;
		if (!ctx.annFns) {
			ctx.annFns = /* @__PURE__ */ new Map();
			(ctx.preamble || ctx.helperCode).push("function _anT(){return true}function _anF(){return false}function _rb(S,m){if(S.length!==m)S.length=m}");
		}
		const hit = ctx.annFns.get(sub);
		if (hit !== void 0) {
			if (hit === null) throw DECLINE;
			return hit;
		}
		if (sub.$dynamicRef !== void 0 || sub.$recursiveRef !== void 0 || sub.dependencies !== void 0) throw DECLINE;
		if (sub.unevaluatedItems !== void 0) throw DECLINE;
		ctx.annFns.set(sub, null);
		const name = `_an${ctx.varCounter++}`;
		const local = {};
		for (const k of Object.keys(sub)) if (!ANNOT_APPLICATORS.has(k)) setOwn(local, k, sub[k]);
		const vl = [];
		nestedGenCode(local, "_av", vl, ctx);
		const decls = [`function ${name}_v(_av){${vl.join("\n  ")}\n  return true}`];
		const body = [`if(!${name}_v(d))return false`];
		if (sub.not !== void 0) {
			const nl = [];
			nestedGenCode(sub.not, "_nv", nl, ctx);
			decls.push(`function ${name}_n(_nv){${nl.join("\n  ")}\n  return true}`);
			body.push(`if(${name}_n(d))return false`);
		}
		body.push(`const _m=S.length;const _o=typeof d==='object'&&d!==null&&!Array.isArray(d)`);
		const locals = [];
		addLocalAnnotations(sub, "d", "S", locals, ctx);
		if (locals.length) body.push(`if(_o){${locals.join(";")}}`);
		const failOut = "{_rb(S,_m);return false}";
		for (const b of sub.allOf || []) body.push(`if(!${emitAnnot(b, ctx)}(d,S))${failOut}`);
		if (Array.isArray(sub.anyOf)) body.push(`{let _a=false;${sub.anyOf.map((b) => `if(${emitAnnot(b, ctx)}(d,S))_a=true;`).join("")}if(!_a)${failOut}}`);
		if (Array.isArray(sub.oneOf)) body.push(`{let _c=0;${sub.oneOf.map((b) => `if(${emitAnnot(b, ctx)}(d,S))_c++;`).join("")}if(_c!==1)${failOut}}`);
		if (sub.if !== void 0) {
			const thenCheck = sub.then !== void 0 ? `if(!${emitAnnot(sub.then, ctx)}(d,S))${failOut}` : "";
			const elseCheck = sub.else !== void 0 ? `if(!${emitAnnot(sub.else, ctx)}(d,S))${failOut}` : "";
			body.push(`if(${emitAnnot(sub.if, ctx)}(d,S)){${thenCheck}}else{${elseCheck}}`);
		}
		if (sub.dependentSchemas && typeof sub.dependentSchemas === "object") for (const [k, ds] of Object.entries(sub.dependentSchemas)) body.push(`if(_o&&Object.prototype.hasOwnProperty.call(d,${JSON.stringify(k)})&&!${emitAnnot(ds, ctx)}(d,S))${failOut}`);
		if (typeof sub.$ref === "string") body.push(`if(!${emitAnnot(refTargetFor(sub.$ref, ctx), ctx)}(d,S))${failOut}`);
		const up = sub.unevaluatedProperties;
		if (up !== void 0 && up !== true && sub.additionalProperties === void 0) {
			if (up === false) body.push(`if(_o){for(const _k of Object.keys(d))if(S.indexOf(_k,_m)<0)${failOut}}`);
			else if (typeof up === "object" && up !== null) {
				const ul = [];
				nestedGenCode(up, "_uv", ul, ctx);
				decls.push(`function ${name}_u(_uv){${ul.join("\n  ")}\n  return true}`);
				body.push(`if(_o){for(const _k of Object.keys(d))if(S.indexOf(_k,_m)<0&&!${name}_u(d[_k]))${failOut}}`);
			} else throw DECLINE;
		}
		if (up !== void 0 && sub.additionalProperties === void 0) body.push(`if(_o)for(const _ka in d)S.push(_ka)`);
		decls.push(`function ${name}(d,S){${body.join(";")};return true}`);
		(ctx.preamble || ctx.helperCode).push(decls.join(""));
		ctx.annFns.set(sub, name);
		return name;
	}
	function genUnevaluatedItemsDynamicC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		if (schema.$dynamicRef !== void 0 || schema.$recursiveRef !== void 0) throw DECLINE;
		if (Array.isArray(schema.items) || schema.additionalItems !== void 0) throw DECLINE;
		annItemHelpers(ctx);
		const ui = ctx.varCounter++;
		const S = `_es${ui}`;
		const body = [`const ${S}={n:0,x:null}`];
		addLocalItemAnnotations(schema, v, S, body, ctx);
		for (const b of schema.allOf || []) body.push(`${emitAnnotI(b, ctx)}(${v},${S})`);
		if (Array.isArray(schema.anyOf)) for (const b of schema.anyOf) body.push(`${emitAnnotI(b, ctx)}(${v},${S})`);
		if (Array.isArray(schema.oneOf)) body.push(`{const _n0=${S}.n,_x0=${S}.x===null?0:${S}.x.length;let _c=0;${schema.oneOf.map((b) => `if(${emitAnnotI(b, ctx)}(${v},${S}))_c++;`).join("")}if(_c!==1)_rbI(${S},_n0,_x0)}`);
		if (schema.if !== void 0) {
			const thenCall = schema.then !== void 0 ? `${emitAnnotI(schema.then, ctx)}(${v},${S})` : "";
			const elseCall = schema.else !== void 0 ? `${emitAnnotI(schema.else, ctx)}(${v},${S})` : "";
			body.push(`if(${emitAnnotI(schema.if, ctx)}(${v},${S})){${thenCall}}else{${elseCall}}`);
		}
		if (typeof schema.$ref === "string") body.push(`${emitAnnotI(refTargetFor(schema.$ref, ctx), ctx)}(${v},${S})`);
		const iv = `_ix${ui}`;
		const ui2 = schema.unevaluatedItems;
		if (ui2 === false) {
			const failI = fail("unevaluatedItems", "unevaluatedItems", `{limit:${iv}}`, `'must NOT have more than '+${iv}+' items'`);
			body.push(`for(let ${iv}=0;${iv}<${v}.length;${iv}++){if(_hI(${S},${iv}))continue;${failI};break}`);
		} else if (typeof ui2 === "object" && ui2 !== null) {
			const pe = pathExpr ? `${pathExpr}+'/'+${iv}` : `'/'+${iv}`;
			const sub = [];
			genCodeC(ui2, `${v}[${iv}]`, pe, sub, ctx, schemaPrefix + "/unevaluatedItems");
			if (sub.length) body.push(`for(let ${iv}=0;${iv}<${v}.length;${iv}++){if(_hI(${S},${iv}))continue;${sub.join("\n  ")}\n  }`);
		} else throw DECLINE;
		lines.push(`if(Array.isArray(${v})){${body.join(";")}}`);
	}
	function annItemHelpers(ctx) {
		if (ctx.annItemHelpers) return;
		ctx.annItemHelpers = true;
		(ctx.preamble || ctx.helperCode).push("function _aI(S,i){if(i<S.n)return;if(i===S.n){S.n=i+1;return}(S.x||(S.x=[])).push(i)}function _mrI(S,f,t){if(f>=t)return;if(f<=S.n){if(t>S.n)S.n=t;return}const x=S.x||(S.x=[]);for(let i=f;i<t;i++)x.push(i)}function _hI(S,i){if(i<S.n)return true;const x=S.x;if(x===null)return false;for(let j=0;j<x.length;j++)if(x[j]===i)return true;return false}function _rbI(S,n,l){S.n=n;if(S.x!==null)S.x.length=l}function _anIT(){return true}function _anIF(){return false}");
	}
	function addLocalItemAnnotations(node, v, S, out, ctx) {
		if (Array.isArray(node.items) || node.additionalItems !== void 0) throw DECLINE;
		const prefix = Array.isArray(node.prefixItems) ? node.prefixItems.length : 0;
		if (prefix) out.push(`_mrI(${S},0,Math.min(${v}.length,${prefix}))`);
		if (node.items !== void 0) out.push(`_mrI(${S},${prefix},${v}.length)`);
		if (node.contains !== void 0) {
			const cl = [];
			nestedGenCode(node.contains, "_cv", cl, ctx);
			const ci = ctx.varCounter++;
			(ctx.preamble || ctx.helperCode).push(`function _cI${ci}(_cv){${cl.join("\n  ")}\n  return true}`);
			out.push(`for(let _i=0;_i<${v}.length;_i++)if(_cI${ci}(${v}[_i]))_aI(${S},_i)`);
		}
	}
	const ANNOT_ITEM_APPLICATORS = /* @__PURE__ */ new Set([
		"allOf",
		"anyOf",
		"oneOf",
		"if",
		"then",
		"else",
		"$ref",
		"not",
		"unevaluatedItems"
	]);
	function emitAnnotI(sub, ctx) {
		if (sub === true) return "_anIT";
		if (sub === false) return "_anIF";
		if (sub === null || typeof sub !== "object") throw DECLINE;
		if (!ctx.annFnsI) ctx.annFnsI = /* @__PURE__ */ new Map();
		const hit = ctx.annFnsI.get(sub);
		if (hit !== void 0) {
			if (hit === null) throw DECLINE;
			return hit;
		}
		if (sub.$dynamicRef !== void 0 || sub.$recursiveRef !== void 0) throw DECLINE;
		if (Array.isArray(sub.items) || sub.additionalItems !== void 0) throw DECLINE;
		if (sub.unevaluatedProperties !== void 0 && sub.unevaluatedProperties !== true) throw DECLINE;
		ctx.annFnsI.set(sub, null);
		annItemHelpers(ctx);
		const name = `_ai${ctx.varCounter++}`;
		const local = {};
		for (const k of Object.keys(sub)) if (!ANNOT_ITEM_APPLICATORS.has(k)) setOwn(local, k, sub[k]);
		const vl = [];
		nestedGenCode(local, "_av", vl, ctx);
		const decls = [`function ${name}_v(_av){${vl.join("\n  ")}\n  return true}`];
		const body = [`if(!${name}_v(d))return false`];
		if (sub.not !== void 0) {
			const nl = [];
			nestedGenCode(sub.not, "_nv", nl, ctx);
			decls.push(`function ${name}_n(_nv){${nl.join("\n  ")}\n  return true}`);
			body.push(`if(${name}_n(d))return false`);
		}
		const own = sub.unevaluatedItems !== void 0 && sub.unevaluatedItems !== true;
		const R = own ? "_R" : "S";
		body.push(own ? `const _R={n:0,x:null}` : `const _n0=S.n,_x0=S.x===null?0:S.x.length`);
		const failOut = own ? "return false" : "{_rbI(S,_n0,_x0);return false}";
		const locals = [];
		addLocalItemAnnotations(sub, "d", R, locals, ctx);
		if (locals.length) body.push(`if(Array.isArray(d)){${locals.join(";")}}`);
		for (const b of sub.allOf || []) body.push(`if(!${emitAnnotI(b, ctx)}(d,${R}))${failOut}`);
		if (Array.isArray(sub.anyOf)) body.push(`{let _a=false;${sub.anyOf.map((b) => `if(${emitAnnotI(b, ctx)}(d,${R}))_a=true;`).join("")}if(!_a)${failOut}}`);
		if (Array.isArray(sub.oneOf)) body.push(`{let _c=0;${sub.oneOf.map((b) => `if(${emitAnnotI(b, ctx)}(d,${R}))_c++;`).join("")}if(_c!==1)${failOut}}`);
		if (sub.if !== void 0) {
			const thenCheck = sub.then !== void 0 ? `if(!${emitAnnotI(sub.then, ctx)}(d,${R}))${failOut}` : "";
			const elseCheck = sub.else !== void 0 ? `if(!${emitAnnotI(sub.else, ctx)}(d,${R}))${failOut}` : "";
			body.push(`if(${emitAnnotI(sub.if, ctx)}(d,${R})){${thenCheck}}else{${elseCheck}}`);
		}
		if (typeof sub.$ref === "string") body.push(`if(!${emitAnnotI(refTargetFor(sub.$ref, ctx), ctx)}(d,${R}))${failOut}`);
		if (own) {
			const u = sub.unevaluatedItems;
			if (u === false) body.push(`if(Array.isArray(d)){for(let _i=0;_i<d.length;_i++)if(!_hI(_R,_i))return false}`);
			else if (typeof u === "object" && u !== null) {
				const ul = [];
				nestedGenCode(u, "_uv", ul, ctx);
				decls.push(`function ${name}_u(_uv){${ul.join("\n  ")}\n  return true}`);
				body.push(`if(Array.isArray(d)){for(let _i=0;_i<d.length;_i++)if(!_hI(_R,_i)&&!${name}_u(d[_i]))return false}`);
			} else throw DECLINE;
			body.push(`if(Array.isArray(d))_mrI(S,0,d.length)`);
		}
		if (sub.unevaluatedItems === true) body.push(`if(Array.isArray(d))_mrI(S,0,d.length)`);
		decls.push(`function ${name}(d,S){${body.join(";")};return true}`);
		(ctx.preamble || ctx.helperCode).push(decls.join(""));
		ctx.annFnsI.set(sub, name);
		return name;
	}
	function genUnevaluatedFalseC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isObj) {
		const propKeysU = Object.keys(schema.properties || {});
		const ui = ctx.varCounter++;
		const failU = fail("unevaluatedProperties", "unevaluatedProperties", `{unevaluatedProperty:_k${ui}[_i]}`, "'must NOT have unevaluated properties'");
		let innerU;
		if (propKeysU.length === 0) innerU = `const _k${ui}=Object.keys(${v});for(let _i=0;_i<_k${ui}.length;_i++){${failU}}`;
		else if (propKeysU.length <= 8) innerU = `const _k${ui}=Object.keys(${v});for(let _i=0;_i<_k${ui}.length;_i++)if(${propKeysU.map((k) => `_k${ui}[_i]!==${JSON.stringify(k)}`).join("&&")}){${failU}}`;
		else innerU = `const _k${ui}=Object.keys(${v});const _a${ui}=new Set([${propKeysU.map((k) => JSON.stringify(k)).join(",")}]);for(let _i=0;_i<_k${ui}.length;_i++)if(!_a${ui}.has(_k${ui}[_i])){${failU}}`;
		lines.push(isObj ? `{${innerU}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${innerU}}`);
	}
	function genUnevaluatedItemsFalseC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		const itemsIsPrefixC = Array.isArray(schema.items);
		if (!(schema.items !== void 0 && !itemsIsPrefixC)) {
			const plenC = itemsIsPrefixC ? schema.items.length : Array.isArray(schema.prefixItems) ? schema.prefixItems.length : 0;
			const failI = fail("unevaluatedItems", "unevaluatedItems", `{limit:${plenC}}`, `'must NOT have more than ${plenC} items'`);
			lines.push(`if(Array.isArray(${v})&&${v}.length>${plenC}){${failI}}`);
		}
	}
	function genAdditionalSchemaC(schema, v, pathExpr, lines, ctx, schemaPrefix, isObj) {
		const ki = ctx.varCounter++;
		const kVar = `_ak${ki}`;
		const known = Object.keys(schema.properties || {});
		const conds = [];
		if (known.length) {
			const set = `_akn${ki}`;
			ctx.closureVars.push(set);
			ctx.closureVals.push(new Set(known));
			conds.push(`!${set}.has(${kVar})`);
		}
		const pats = [];
		for (const pat of Object.keys(schema.patternProperties || {})) {
			const fast = fastPrefixCheck(pat, kVar);
			if (fast) {
				pats.push(fast);
				continue;
			}
			const ri = ctx.varCounter++;
			ctx.closureVars.push(`_re${ri}`);
			ctx.closureVals.push(safeReClosure(ctx, pat));
			pats.push(`_re${ri}.test(${kVar})`);
		}
		if (pats.length) conds.push(`!(${pats.join("||")})`);
		const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
		const keep = conds.length ? `if(${conds.join("&&")})` : "";
		const pe = emitPtrEsc(ctx);
		const p = pathExpr ? `${pathExpr}+'/'+${pe}(${kVar})` : `'/'+${pe}(${kVar})`;
		const sub = [];
		genCodeC(schema.additionalProperties, `${v}[${kVar}]`, p, sub, ctx, schemaPrefix + "/additionalProperties");
		if (sub.length === 0) return;
		lines.push(`${guard}{for(const ${kVar} in ${v}){${keep}{${sub.join("\n  ")}\n  }}}`);
	}
	function genPatternPropertiesC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail, isObj) {
		let handledPropertyNames = false;
		const ppEntries = Object.entries(schema.patternProperties);
		const pn = isSimplePN(schema.propertyNames) ? schema.propertyNames : null;
		const pi = ctx.varCounter++;
		const matchers = [];
		for (const [pat] of ppEntries) {
			const fast = fastPrefixCheck(pat, `_k${pi}`);
			if (fast) matchers.push({ check: fast });
			else {
				const ri = ctx.varCounter++;
				ctx.closureVars.push(`_re${ri}`);
				ctx.closureVals.push(safeReClosure(ctx, pat));
				matchers.push({ check: `_re${ri}.test(_k${pi})` });
			}
		}
		const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
		const kVar = `_k${pi}`;
		if (schema.additionalProperties === false) {
			handledPropertyNames = !!pn;
			const propKeys = Object.keys(schema.properties || {});
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
					if (fast) lines.push(`if(!(${fast})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, JSON.stringify(`must match pattern "${pn.pattern}"`))}}`);
					else {
						const ri = ctx.varCounter++;
						ctx.closureVars.push(`_re${ri}`);
						ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
						lines.push(`if(!_re${ri}.test(${kVar})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, JSON.stringify(`must match pattern "${pn.pattern}"`))}}`);
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
			for (let i = 0; i < ppEntries.length; i++) {
				lines.push(`if(${matchers[i].check}){_m${pi}=true;{const _ppv${pi}_${i}=${v}[${kVar}]`);
				genCodeC(ppEntries[i][1], `_ppv${pi}_${i}`, childPathDynExpr(pathExpr, `${emitPtrEsc(ctx)}(${kVar})`), lines, ctx, schemaPrefix + "/patternProperties/" + ptrSeg(ppEntries[i][0]));
				lines.push(`}}`);
			}
			lines.push(`if(!_m${pi}){${fail("additionalProperties", "additionalProperties", `{additionalProperty:${kVar}}`, "'must NOT have additional properties'")}}`);
			lines.push(`}}`);
		} else {
			handledPropertyNames = !!pn;
			lines.push(`${guard}{for(const ${kVar} in ${v}){`);
			if (pn) {
				if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
				if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
				if (pn.pattern) {
					const fast = fastPrefixCheck(pn.pattern, kVar);
					if (fast) lines.push(`if(!(${fast})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, JSON.stringify(`must match pattern "${pn.pattern}"`))}}`);
					else {
						const ri = ctx.varCounter++;
						ctx.closureVars.push(`_re${ri}`);
						ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
						lines.push(`if(!_re${ri}.test(${kVar})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, JSON.stringify(`must match pattern "${pn.pattern}"`))}}`);
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
			for (let i = 0; i < ppEntries.length; i++) {
				lines.push(`if(${matchers[i].check}){const _ppv${pi}_${i}=${v}[${kVar}]`);
				genCodeC(ppEntries[i][1], `_ppv${pi}_${i}`, childPathDynExpr(pathExpr, `${emitPtrEsc(ctx)}(${kVar})`), lines, ctx, schemaPrefix + "/patternProperties/" + ptrSeg(ppEntries[i][0]));
				lines.push(`}`);
			}
			lines.push(`}}`);
		}
		return handledPropertyNames;
	}
	function genDependentSchemasC(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${ownKeyExpr(ctx, v, key)}){`);
			genCodeC(depSchema, v, pathExpr, lines, ctx, schemaPrefix + "/dependentSchemas/" + ptrSeg(key));
			lines.push(`}`);
		}
	}
	function genPropertyNamesFalseC(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		const ki = ctx.varCounter++;
		const p = pathExpr || "\"\"";
		lines.push(`;if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){${errPushC(ctx, "not", `${schemaPrefix}/propertyNames`, pathExpr, "{}", "'boolean schema is false'", v, `{keyword:'not',instancePath:${p},schemaPath:'${schemaPrefix}/propertyNames'${ordinalField(ctx, `${schemaPrefix}/propertyNames`)},params:{},message:'boolean schema is false'}`)}}}`);
	}
	function genPropertyNamesC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		const pn = schema.propertyNames;
		const ki = ctx.varCounter++;
		if (!isSimplePN(pn) && ctx.rich) throw DECLINE;
		lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){`);
		if (!isSimplePN(pn)) {
			genCodeC(pn, `_k${ki}`, pathExpr, lines, ctx, schemaPrefix + "/propertyNames");
			lines.push(`}}`);
			return;
		}
		if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
		if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
		if (pn.pattern) {
			const ri = ctx.varCounter++;
			ctx.closureVars.push(`_re${ri}`);
			ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
			lines.push(`if(!_re${ri}.test(_k${ki})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, JSON.stringify(`must match pattern "${pn.pattern}"`))}}`);
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
	function genPrefixItemsC(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		for (let i = 0; i < schema.prefixItems.length; i++) {
			const childPath = childPathExpr(pathExpr, String(i));
			lines.push(`if(Array.isArray(${v})&&${v}.length>${i}){`);
			genCodeC(schema.prefixItems[i], `${v}[${i}]`, childPath, lines, ctx, schemaPrefix + "/prefixItems/" + i);
			lines.push(`}`);
		}
	}
	function genContainsC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		const ci = ctx.varCounter++;
		const subLines = [];
		nestedGenCode(schema.contains, `_cv`, subLines, ctx);
		const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
		const minC = schema.minContains !== void 0 ? schema.minContains : 1;
		const maxC = schema.maxContains;
		lines.push(`if(Array.isArray(${v})){const _cf${ci}=function(_cv){${fnBody}};let _cc${ci}=0;for(let _ci${ci}=0;_ci${ci}<${v}.length;_ci${ci}++){if(_cf${ci}(${v}[_ci${ci}]))_cc${ci}++}`);
		lines.push(`if(_cc${ci}<${minC}){${fail("contains", "contains", `{minContains:${minC}}`, `'must contain at least ${minC} valid item(s)'`)}}`);
		if (maxC !== void 0) lines.push(`if(_cc${ci}>${maxC}){${fail("contains", "contains", `{minContains:${minC},maxContains:${maxC}}`, `'must NOT contain more than ${maxC} valid item(s)'`)}}`);
		lines.push(`}`);
	}
	function genAnyOfC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		if (ctx.inCombined) return emitBranchCollapse(schema.anyOf, "anyOf", v, pathExpr, lines, ctx, schemaPrefix);
		const fi = ctx.varCounter++;
		const fns = schema.anyOf.map((sub) => {
			const sl = [];
			nestedGenCode(sub, "_av", sl, ctx);
			return sl.length === 0 ? `function(_av){return true}` : `function(_av){${sl.join(";")};return true}`;
		});
		lines.push(`{const _af${fi}=[${fns.join(",")}];let _am=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am=true;break}}if(!_am){${fail("anyOf", "anyOf", "{}", "'must match a schema in anyOf'")}}}`);
	}
	function genOneOfC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		if (ctx.inCombined) return emitBranchCollapse(schema.oneOf, "oneOf", v, pathExpr, lines, ctx, schemaPrefix);
		const fi = ctx.varCounter++;
		const fns = schema.oneOf.map((sub) => {
			const sl = [];
			nestedGenCode(sub, "_ov", sl, ctx);
			return sl.length === 0 ? `function(_ov){return true}` : `function(_ov){${sl.join(";")};return true}`;
		});
		lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc++;if(_oc>1)break}if(_oc!==1){${fail("oneOf", "oneOf", "{}", "'must match exactly one schema in oneOf'")}}}`);
	}
	function genNotC(schema, v, pathExpr, lines, ctx, schemaPrefix, fail) {
		const sl = [];
		nestedGenCode(schema.not, "_nv", sl, ctx);
		const nfn = sl.length === 0 ? `function(_nv){return true}` : `function(_nv){${sl.join(";")};return true}`;
		const fi = ctx.varCounter++;
		lines.push(`{const _nf${fi}=${nfn};if(_nf${fi}(${v})){${fail("not", "not", "{}", "'must NOT be valid'")}}}`);
	}
	function genIfC(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		const sl = [];
		nestedGenCode(schema.if, "_iv", sl, ctx);
		const fi = ctx.varCounter++;
		const ifFn = sl.length === 0 ? `function(_iv){return true}` : `function(_iv){${sl.join(";")};return true}`;
		lines.push(`{const _if${fi}=${ifFn}`);
		if (schema.then !== void 0) {
			lines.push(`if(_if${fi}(${v})){`);
			genCodeC(schema.then, v, pathExpr, lines, ctx, schemaPrefix + "/then");
			lines.push(`}`);
		}
		if (schema.else !== void 0) {
			lines.push(`${schema.then !== void 0 ? "else" : `if(!_if${fi}(${v}))`}{`);
			genCodeC(schema.else, v, pathExpr, lines, ctx, schemaPrefix + "/else");
			lines.push(`}`);
		}
		lines.push(`}`);
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
		if (schema.contains !== void 0) result.dynamic = true;
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
		unevalContributions,
		expandedChars,
		AJV_MESSAGES,
		_setCodeBudget
	};
	Object.defineProperty(module.exports, "_kwTypeBits", {
		value: {
			kwTypeBit,
			kwDataBits,
			KW_T_ANY
		},
		enumerable: false
	});
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/scan-runtime.js
var require_scan_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function hex4(s, i) {
		for (let k = i; k < i + 4; k++) {
			const c = s.charCodeAt(k);
			if (c >= 48 && c <= 57) continue;
			if (c >= 97 && c <= 102) continue;
			if (c >= 65 && c <= 70) continue;
			return false;
		}
		return true;
	}
	const MAX_SKIP_DEPTH = 512;
	const MALFORMED = -1;
	const TOO_DEEP = -2;
	function skipValue(s, i) {
		const len = s.length;
		const stack = [];
		let depth = 0;
		for (;;) {
			let c = s.charCodeAt(i);
			while (c === 32 || c === 10 || c === 9 || c === 13) c = s.charCodeAt(++i);
			if (c === 34) {
				i = skipString(s, i);
				if (i < 0) return MALFORMED;
			} else if (c === 123 || c === 91) {
				if (depth >= MAX_SKIP_DEPTH) return TOO_DEEP;
				stack[depth++] = c === 123 ? 0 : 1;
				i++;
				c = s.charCodeAt(i);
				while (c === 32 || c === 10 || c === 9 || c === 13) c = s.charCodeAt(++i);
				if (c === (stack[depth - 1] === 0 ? 125 : 93)) {
					depth--;
					i++;
				} else if (stack[depth - 1] === 0) {
					if (c !== 34) return MALFORMED;
					i = skipString(s, i);
					if (i < 0) return MALFORMED;
					c = s.charCodeAt(i);
					while (c === 32 || c === 10 || c === 9 || c === 13) c = s.charCodeAt(++i);
					if (c !== 58) return MALFORMED;
					i++;
					continue;
				} else continue;
			} else if (c === 116) {
				if (s.charCodeAt(i + 1) !== 114 || s.charCodeAt(i + 2) !== 117 || s.charCodeAt(i + 3) !== 101) return MALFORMED;
				i += 4;
			} else if (c === 102) {
				if (s.charCodeAt(i + 1) !== 97 || s.charCodeAt(i + 2) !== 108 || s.charCodeAt(i + 3) !== 115 || s.charCodeAt(i + 4) !== 101) return MALFORMED;
				i += 5;
			} else if (c === 110) {
				if (s.charCodeAt(i + 1) !== 117 || s.charCodeAt(i + 2) !== 108 || s.charCodeAt(i + 3) !== 108) return MALFORMED;
				i += 4;
			} else {
				i = skipNumber(s, i);
				if (i < 0) return MALFORMED;
			}
			for (;;) {
				if (depth === 0) return i;
				let c2 = s.charCodeAt(i);
				while (c2 === 32 || c2 === 10 || c2 === 9 || c2 === 13) c2 = s.charCodeAt(++i);
				const inObject = stack[depth - 1] === 0;
				if (c2 === 44) {
					i++;
					if (inObject) {
						let c3 = s.charCodeAt(i);
						while (c3 === 32 || c3 === 10 || c3 === 9 || c3 === 13) c3 = s.charCodeAt(++i);
						if (c3 !== 34) return MALFORMED;
						i = skipString(s, i);
						if (i < 0) return MALFORMED;
						c3 = s.charCodeAt(i);
						while (c3 === 32 || c3 === 10 || c3 === 9 || c3 === 13) c3 = s.charCodeAt(++i);
						if (c3 !== 58) return MALFORMED;
						i++;
					}
					break;
				}
				if (c2 === (inObject ? 125 : 93)) {
					depth--;
					i++;
					continue;
				}
				return MALFORMED;
			}
			if (i > len) return MALFORMED;
		}
	}
	function skipString(s, i) {
		i++;
		for (;;) {
			const c = s.charCodeAt(i);
			if (c === 34) return i + 1;
			if (c === 92) {
				const e = s.charCodeAt(i + 1);
				if (e === 117) {
					if (!hex4(s, i + 2)) return -1;
					i += 6;
					continue;
				}
				if (e === 34 || e === 92 || e === 47 || e === 98 || e === 102 || e === 110 || e === 114 || e === 116) {
					i += 2;
					continue;
				}
				return -1;
			}
			if (!(c >= 32)) return -1;
			i++;
		}
	}
	function skipNumber(s, i) {
		let c = s.charCodeAt(i);
		if (c === 45) c = s.charCodeAt(++i);
		if (c === 48) c = s.charCodeAt(++i);
		else if (c >= 49 && c <= 57) do
			c = s.charCodeAt(++i);
		while (c >= 48 && c <= 57);
		else return -1;
		if (c === 46) {
			c = s.charCodeAt(++i);
			if (!(c >= 48 && c <= 57)) return -1;
			do
				c = s.charCodeAt(++i);
			while (c >= 48 && c <= 57);
		}
		if (c === 101 || c === 69) {
			c = s.charCodeAt(++i);
			if (c === 43 || c === 45) c = s.charCodeAt(++i);
			if (!(c >= 48 && c <= 57)) return -1;
			do
				c = s.charCodeAt(++i);
			while (c >= 48 && c <= 57);
		}
		return i;
	}
	function span(s, p, e, escaped) {
		if (!escaped) return s.slice(p, e);
		return JSON.parse(s.slice(p - 1, e + 1));
	}
	function plainKey(s, p, e) {
		for (let k = p; k < e; k++) {
			const c = s.charCodeAt(k);
			if (c < 32 || c === 92) return false;
		}
		return true;
	}
	module.exports = {
		hex4,
		skipValue,
		skipString,
		skipNumber,
		span,
		plainKey,
		MALFORMED,
		TOO_DEEP,
		MAX_SKIP_DEPTH
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/scan-compiler.js
var require_scan_compiler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { compileToJSCodegen } = require_js_compiler();
	const VALID = 1;
	const INVALID = 0;
	const BAIL = -1;
	const MAX_SCHEMA_DEPTH = 12;
	const MAX_PROPS = 4096;
	const TIGHTEN_MAX = [
		"minLength",
		"minItems",
		"minProperties",
		"minimum",
		"exclusiveMinimum"
	];
	const TIGHTEN_MIN = [
		"maxLength",
		"maxItems",
		"maxProperties",
		"maximum",
		"exclusiveMaximum"
	];
	const SAME_OR_NOTHING = [
		"pattern",
		"format",
		"const",
		"enum",
		"multipleOf"
	];
	const STRUCTURAL = /* @__PURE__ */ new Set([
		"type",
		"properties",
		"required",
		"additionalProperties",
		"minProperties",
		"maxProperties",
		"items",
		"prefixItems",
		"minItems",
		"maxItems",
		"unevaluatedProperties",
		"unevaluatedItems"
	]);
	const LEAF = /* @__PURE__ */ new Set([
		"minLength",
		"maxLength",
		"pattern",
		"format",
		"const",
		"enum",
		"minimum",
		"maximum",
		"exclusiveMinimum",
		"exclusiveMaximum",
		"multipleOf"
	]);
	const IGNORED = /* @__PURE__ */ new Set([
		"title",
		"description",
		"$comment",
		"examples",
		"deprecated",
		"readOnly",
		"writeOnly",
		"$schema",
		"$defs",
		"definitions",
		"$vocabulary"
	]);
	const BASE_CHANGING = /* @__PURE__ */ new Set([
		"$id",
		"$anchor",
		"$dynamicAnchor",
		"$dynamicRef"
	]);
	const MAX_NODES = 8192;
	const MAX_FUNCTION_SOURCE = 65536;
	const MAX_SOURCE = 2097152;
	const INLINE_REF_MAX = 4096;
	const SPLIT_MIN = 4096;
	const SPLIT_OBJECT = 16384;
	const INDEX_KEY_MIN_AVG = 10;
	const MAX_PREFIX_ITEMS = 24;
	const KINDS = [
		"object",
		"array",
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	];
	const DECLINE = Symbol("decline");
	let declineReason = null;
	function decline(reason) {
		declineReason = reason || "unknown";
		throw DECLINE;
	}
	const WS = "if(c<=32){while(c===32||c===10||c===9||c===13){c=s.charCodeAt(++i);}}";
	function isPlainObject(v) {
		return v !== null && typeof v === "object" && !Array.isArray(v);
	}
	function typeSet(schema) {
		const t = schema.type;
		if (t === void 0) return null;
		const list = Array.isArray(t) ? t : [t];
		const out = /* @__PURE__ */ new Set();
		for (const name of list) {
			if (typeof name !== "string" || !KINDS.includes(name)) decline("type:" + String(name));
			out.add(name);
		}
		if (out.size === 0) decline("type:empty");
		return out;
	}
	function allows(types, kind) {
		if (types === null) return true;
		if (kind === "number") return types.has("number") || types.has("integer");
		return types.has(kind);
	}
	function integerOnly(types) {
		return types !== null && types.has("integer") && !types.has("number");
	}
	function compileLeaf(keys, schema, ctx) {
		const sub = {};
		for (const k of keys) sub[k] = schema[k];
		const fn = compileToJSCodegen(sub, null, ctx.userFormats);
		if (typeof fn !== "function") decline("leaf:" + keys.join("+"));
		ctx.helpers.push(fn);
		return "_h[" + (ctx.helpers.length - 1) + "]";
	}
	function resolveLocalRef(root, ref) {
		if (typeof ref !== "string") decline("$ref:not-string");
		if (ref === "#") return root;
		if (!ref.startsWith("#/")) decline("$ref:not-local");
		let node = root;
		let first = true;
		for (const rawToken of ref.slice(2).split("/")) {
			let token = decodeURIComponent(rawToken).split("~1").join("/").split("~0").join("~");
			if (node === null || typeof node !== "object") decline("$ref:unresolved");
			if (first && node === root && !Array.isArray(node) && !Object.prototype.hasOwnProperty.call(node, token)) {
				if (token === "definitions" && Object.prototype.hasOwnProperty.call(node, "$defs")) token = "$defs";
				else if (token === "$defs" && Object.prototype.hasOwnProperty.call(node, "definitions")) token = "definitions";
			}
			first = false;
			if (Array.isArray(node)) {
				if (!/^\d+$/.test(token)) decline("$ref:unresolved");
				node = node[Number(token)];
			} else {
				if (!Object.prototype.hasOwnProperty.call(node, token)) decline("$ref:unresolved");
				node = node[token];
			}
			if (node === void 0) decline("$ref:unresolved");
		}
		return node;
	}
	function collectLayers(node, ctx, out, depth) {
		if (depth > MAX_SCHEMA_DEPTH) decline("allOf:too-deep");
		if (node === true) return;
		if (node === false) {
			out.unsatisfiable = true;
			return;
		}
		if (!isPlainObject(node)) decline("allOf:branch-not-object");
		for (const k of Object.keys(node)) if (BASE_CHANGING.has(k)) decline("allOf:base-changing:" + k);
		if (node.$ref !== void 0) {
			for (const k of Object.keys(node)) if (k !== "$ref" && !IGNORED.has(k)) decline("allOf:$ref-sibling:" + k);
			if (ctx.refStack.includes(node.$ref)) decline("$ref:recursive");
			const target = resolveLocalRef(ctx.root, node.$ref);
			ctx.refStack.push(node.$ref);
			collectLayers(target, ctx, out, depth + 1);
			ctx.refStack.pop();
			return;
		}
		const own = {};
		for (const k of Object.keys(node)) {
			if (k === "allOf" || IGNORED.has(k)) continue;
			own[k] = node[k];
		}
		if (Object.keys(own).length > 0) out.push(own);
		if (node.allOf !== void 0) {
			if (!Array.isArray(node.allOf)) decline("allOf:not-array");
			for (const branch of node.allOf) collectLayers(branch, ctx, out, depth + 1);
		}
	}
	function combine(parts) {
		const real = parts.filter((p) => p !== true && p !== void 0);
		if (real.some((p) => p === false)) return false;
		if (real.length === 0) return true;
		if (real.length === 1) return real[0];
		return { allOf: real };
	}
	function mergeAllOf(schema, ctx) {
		const layers = [];
		collectLayers(schema, ctx, layers, 0);
		if (layers.unsatisfiable) return false;
		if (layers.length === 0) return true;
		if (layers.length === 1) return layers[0];
		for (const L of layers) if (L.unevaluatedProperties !== void 0 || L.unevaluatedItems !== void 0) decline("allOf:unevaluated");
		const out = {};
		let types = null;
		for (const L of layers) {
			const t = typeSet(L);
			if (t === null) continue;
			if (types === null) {
				types = t;
				continue;
			}
			const both = /* @__PURE__ */ new Set();
			for (const name of types) if (t.has(name)) both.add(name);
			else if (name === "number" && t.has("integer") || name === "integer" && t.has("number")) both.add("integer");
			types = both;
		}
		if (types !== null) {
			if (types.size === 0) return false;
			out.type = [...types];
		}
		for (const key of TIGHTEN_MAX) {
			let v;
			for (const L of layers) if (typeof L[key] === "number") v = v === void 0 ? L[key] : Math.max(v, L[key]);
			if (v !== void 0) out[key] = v;
		}
		for (const key of TIGHTEN_MIN) {
			let v;
			for (const L of layers) if (typeof L[key] === "number") v = v === void 0 ? L[key] : Math.min(v, L[key]);
			if (v !== void 0) out[key] = v;
		}
		for (const key of TIGHTEN_MAX.concat(TIGHTEN_MIN)) for (const L of layers) if (L[key] !== void 0 && typeof L[key] !== "number") decline("allOf:" + key + ":not-number");
		for (const key of SAME_OR_NOTHING) {
			let seen, has = false;
			for (const L of layers) {
				if (L[key] === void 0) continue;
				const rendered = JSON.stringify(L[key]);
				if (!has) {
					seen = rendered;
					out[key] = L[key];
					has = true;
					continue;
				}
				if (rendered !== seen) decline("allOf:conflicting:" + key);
			}
		}
		const required = [];
		for (const L of layers) {
			if (L.required === void 0) continue;
			if (!Array.isArray(L.required)) decline("required:not-array");
			for (const name of L.required) if (!required.includes(name)) required.push(name);
		}
		if (required.length > 0) out.required = required;
		const names = [];
		for (const L of layers) {
			if (L.properties === void 0) continue;
			if (!isPlainObject(L.properties)) decline("properties:not-object");
			for (const k of Object.keys(L.properties)) if (!names.includes(k)) names.push(k);
		}
		if (names.length > 0) {
			out.properties = {};
			for (const name of names) {
				const parts = [];
				for (const L of layers) if (L.properties && Object.prototype.hasOwnProperty.call(L.properties, name)) parts.push(L.properties[name]);
				else if (L.additionalProperties !== void 0) parts.push(L.additionalProperties);
				out.properties[name] = combine(parts);
			}
		}
		{
			const parts = [];
			for (const L of layers) if (L.additionalProperties !== void 0) parts.push(L.additionalProperties);
			if (parts.length > 0) {
				const merged = combine(parts);
				if (merged !== true) out.additionalProperties = merged;
			}
		}
		{
			const parts = [];
			for (const L of layers) if (L.items !== void 0) parts.push(L.items);
			if (parts.length > 0) {
				const merged = combine(parts);
				if (merged !== true) out.items = merged;
			}
		}
		{
			let longest = -1;
			for (const L of layers) {
				if (L.prefixItems === void 0) continue;
				if (!Array.isArray(L.prefixItems)) decline("prefixItems:not-array");
				if (L.prefixItems.length > longest) longest = L.prefixItems.length;
			}
			if (longest >= 0) {
				const tuple = [];
				for (let k = 0; k < longest; k++) {
					const parts = [];
					for (const L of layers) if (L.prefixItems !== void 0 && k < L.prefixItems.length) parts.push(L.prefixItems[k]);
					else if (L.items !== void 0) parts.push(L.items);
					tuple.push(combine(parts));
				}
				out.prefixItems = tuple;
			}
		}
		const HANDLED = new Set([
			"type",
			"required",
			"properties",
			"additionalProperties",
			"items",
			"prefixItems"
		].concat(TIGHTEN_MAX, TIGHTEN_MIN, SAME_OR_NOTHING));
		for (const L of layers) for (const k of Object.keys(L)) {
			if (HANDLED.has(k)) continue;
			if (out[k] === void 0) out[k] = L[k];
			else if (JSON.stringify(out[k]) !== JSON.stringify(L[k])) decline("allOf:conflicting:" + k);
		}
		return out;
	}
	function spanHash(name) {
		let h = 5381;
		for (let i = 0; i < name.length; i++) h = Math.imul(h, 33) + name.charCodeAt(i) | 0;
		return h;
	}
	const HASH_DISPATCH_MIN = 48;
	function compileScanner(schema, options) {
		const opts = options || {};
		const whole = build(schema, opts, false);
		if (whole !== null || declineReason !== "size") return finish(whole, opts);
		return finish(build(schema, opts, true), opts);
	}
	function finish(built, opts) {
		if (built === null) {
			if (opts.onDecline) opts.onDecline(declineReason);
			return null;
		}
		const { ctx, body } = built;
		let fn;
		try {
			fn = new Function("_h", "_r", ctx.subSource.join("\n") + "\nreturn function scan(s){\n" + body + "\n}")(ctx.helpers, require_scan_runtime());
		} catch {
			return null;
		}
		return {
			scan: fn,
			source: body,
			helpers: ctx.helpers.length,
			functions: [body, ...ctx.subSource]
		};
	}
	function build(schema, opts, split) {
		const ctx = {
			uid: 0,
			helpers: [],
			userFormats: opts.userFormats || null,
			root: schema,
			refStack: [],
			nodes: 0,
			split,
			subs: /* @__PURE__ */ new Map(),
			subSource: [],
			refCounts: split ? countRefs(schema) : null,
			inlineBytes: /* @__PURE__ */ new Map()
		};
		declineReason = null;
		let body;
		try {
			const out = [];
			out.push("var len=s.length,i=0,c=s.charCodeAt(0);");
			out.push(WS);
			emitValue(schema, ctx, out, 0);
			out.push(WS);
			out.push("if(i<len)return 0;");
			out.push("return 1;");
			body = out.join("\n");
			if (body.length > MAX_FUNCTION_SOURCE || ctx.subSource.some((x) => x.length > MAX_FUNCTION_SOURCE)) decline("size");
			if (body.length + ctx.subSource.reduce((n, x) => n + x.length, 0) > MAX_SOURCE) decline("size");
		} catch (e) {
			if (e === DECLINE) return null;
			throw e;
		}
		return {
			ctx,
			body
		};
	}
	function emitValue(schema, ctx, out, depth) {
		if (depth > MAX_SCHEMA_DEPTH) decline("depth");
		if (schema === true) {
			emitSkip(out);
			return;
		}
		if (schema === false) {
			out.push("return 0;");
			return;
		}
		if (!isPlainObject(schema)) decline("schema-not-object");
		if (++ctx.nodes > MAX_NODES) decline("too-many-nodes");
		for (const k of Object.keys(schema)) if (BASE_CHANGING.has(k) && !(k === "$id" && depth === 0)) decline("base-changing:" + k);
		if (schema.$ref !== void 0) {
			for (const k of Object.keys(schema)) if (k !== "$ref" && !IGNORED.has(k)) decline("$ref:sibling:" + k);
			const ref = schema.$ref;
			if (ctx.refStack.includes(ref)) decline("$ref:recursive");
			const target = resolveLocalRef(ctx.root, ref);
			if (!ctx.split) {
				ctx.refStack.push(ref);
				emitValue(target, ctx, out, depth);
				ctx.refStack.pop();
				return;
			}
			const sub = ctx.subs.get(target);
			if (sub !== void 0) {
				if (sub === null) {
					ctx.refStack.push(ref);
					emitValue(target, ctx, out, depth);
					ctx.refStack.pop();
				} else emitSubCall(sub, ctx, out);
				return;
			}
			const body = [];
			ctx.refStack.push(ref);
			emitValue(target, ctx, body, depth);
			ctx.refStack.pop();
			const text = body.join("\n");
			if (text.length * (ctx.refCounts.get(ref) || 1) <= INLINE_REF_MAX) {
				ctx.subs.set(target, null);
				for (const line of body) out.push(line);
				return;
			}
			const name = "_s" + (ctx.subSource.length + ctx.subs.size + ctx.uid++);
			ctx.subs.set(target, name);
			ctx.subSource.push("function " + name + "(s,i){var len=s.length,c=s.charCodeAt(i);\n" + text + "\nreturn i;}");
			emitSubCall(name, ctx, out);
			return;
		}
		if (schema.allOf !== void 0) {
			emitValue(mergeAllOf(schema, ctx), ctx, out, depth);
			return;
		}
		const present = [];
		for (const k of Object.keys(schema)) {
			if (k === "$id" && depth === 0) continue;
			if (IGNORED.has(k)) continue;
			if (STRUCTURAL.has(k) || LEAF.has(k)) {
				present.push(k);
				continue;
			}
			decline("keyword:" + k);
		}
		const types = typeSet(schema);
		const has = (k) => present.includes(k);
		let compositeAllowed = true;
		let compositeDelegate = null;
		let listedKinds = null;
		if (has("const") || has("enum")) {
			compositeAllowed = false;
			const listed = [];
			if (has("const")) listed.push(schema.const);
			if (has("enum")) {
				if (!Array.isArray(schema.enum)) decline("enum:not-array");
				for (const v of schema.enum) listed.push(v);
			}
			listedKinds = new Set(listed.map((v) => v === null ? "null" : Array.isArray(v) ? "array" : typeof v));
			if (listed.some((v) => v !== null && typeof v === "object")) {
				const fn = compileToJSCodegen(schema, null, ctx.userFormats);
				if (typeof fn !== "function") decline("const/enum:composite");
				ctx.helpers.push(fn);
				compositeDelegate = "_h[" + (ctx.helpers.length - 1) + "]";
			}
		}
		const branches = [];
		const compositeBranch = () => {
			const k = ctx.uid++;
			return ["var _cs" + k + "=i;var _ce" + k + "=_r.skipValue(s,i);if(_ce" + k + "===-2)return -1;if(_ce" + k + "<0)return 0;var _cv" + k + ";try{_cv" + k + "=JSON.parse(s.slice(_cs" + k + ",_ce" + k + "))}catch(_ce_){return 0}if(!" + compositeDelegate + "(_cv" + k + "))return 0;i=_ce" + k + ";c=s.charCodeAt(i);"];
		};
		if (allows(types, "object") && (listedKinds === null || listedKinds.has("object"))) {
			if (compositeDelegate) branches.push(["c===123", compositeBranch()]);
			else if (!compositeAllowed) branches.push(["c===123", ["return 0;"]]);
			else {
				const b = [];
				emitObject(schema, ctx, b, depth);
				branches.push(["c===123", b]);
			}
		}
		if (allows(types, "array") && (listedKinds === null || listedKinds.has("array"))) {
			if (compositeDelegate) branches.push(["c===91", compositeBranch()]);
			else if (!compositeAllowed) branches.push(["c===91", ["return 0;"]]);
			else {
				const b = [];
				emitArray(schema, ctx, b, depth);
				branches.push(["c===91", b]);
			}
		}
		if (allows(types, "string") && (listedKinds === null || listedKinds.has("string"))) {
			const b = [];
			emitString(schema, ctx, b);
			branches.push(["c===34", b]);
		}
		if (allows(types, "number") && (listedKinds === null || listedKinds.has("number"))) {
			const b = [];
			emitNumber(schema, ctx, b, types);
			branches.push(["c===45||(c>=48&&c<=57)", b]);
		}
		if (allows(types, "boolean") && (listedKinds === null || listedKinds.has("boolean"))) {
			const b = [];
			emitLiteral(schema, ctx, b, "boolean");
			branches.push(["c===116||c===102", b]);
		}
		if (allows(types, "null") && (listedKinds === null || listedKinds.has("null"))) {
			const b = [];
			emitLiteral(schema, ctx, b, "null");
			branches.push(["c===110", b]);
		}
		if (branches.length === 0) {
			out.push("return 0;");
			return;
		}
		const parts = [];
		for (let k = 0; k < branches.length; k++) {
			parts.push((k === 0 ? "if(" : "else if(") + branches[k][0] + "){");
			parts.push(branches[k][1].join("\n"));
			parts.push("}");
		}
		parts.push("else return 0;");
		out.push(parts.join("\n"));
	}
	function countRefs(root) {
		const counts = /* @__PURE__ */ new Map();
		const seen = /* @__PURE__ */ new Set();
		const walk = (n) => {
			if (n === null || typeof n !== "object" || seen.has(n)) return;
			seen.add(n);
			if (Array.isArray(n)) {
				for (const x of n) walk(x);
				return;
			}
			if (typeof n.$ref === "string") counts.set(n.$ref, (counts.get(n.$ref) || 0) + 1);
			for (const k of Object.keys(n)) walk(n[k]);
		};
		walk(root);
		return counts;
	}
	function plainName(name) {
		for (let k = 0; k < name.length; k++) {
			const c = name.charCodeAt(k);
			if (c < 32 || c === 34 || c === 92) return false;
		}
		return true;
	}
	function emitSubCall(name, ctx, out) {
		const r = "_rq" + ctx.uid++;
		out.push("{var " + r + "=" + name + "(s,i);if(" + r + "===-1)return -1;if(" + r + "===0)return 0;i=" + r + ";c=s.charCodeAt(i);}");
	}
	function emitSkip(out) {
		out.push("{var _j=_r.skipValue(s,i);if(_j===-2)return -1;if(_j<0)return 0;i=_j;c=s.charCodeAt(i);}");
	}
	function emitStringSpan(ctx, out, n, wantLen, wantHash) {
		out.push("var _p" + n + "=++i,_x" + n + "=0" + (wantLen ? ",_u" + n + "=0,_hs" + n + "=0" : "") + (wantHash ? ",_h" + n + "=5381" : "") + ";");
		out.push("for(;;){c=s.charCodeAt(i);");
		out.push("if(c===34)break;");
		out.push("if(c===92){var _q" + n + "=s.charCodeAt(i+1);");
		out.push("if(_q" + n + "===117){if(!_r.hex4(s,i+2))return 0;i+=6;_x" + n + "=1;" + (wantLen ? "_u" + n + "++;" : "") + "continue;}");
		out.push("if(_q" + n + "===34||_q" + n + "===92||_q" + n + "===47||_q" + n + "===98||_q" + n + "===102||_q" + n + "===110||_q" + n + "===114||_q" + n + "===116){i+=2;_x" + n + "=1;" + (wantLen ? "_u" + n + "++;" : "") + "continue;}");
		out.push("return 0;}");
		out.push("if(!(c>=32))return 0;");
		out.push("i++;" + (wantLen ? "_u" + n + "++;if(((c-55296)>>>0)<1024)_hs" + n + "=1;" : "") + (wantHash ? "_h" + n + "=(Math.imul(_h" + n + ",33)+c)|0;" : ""));
		out.push("}");
		out.push("var _e" + n + "=i;c=s.charCodeAt(++i);");
	}
	function emitString(schema, ctx, out) {
		const n = ctx.uid++;
		const inlineLen = schema.minLength !== void 0 || schema.maxLength !== void 0;
		if (schema.minLength !== void 0 && typeof schema.minLength !== "number") decline("minLength:not-number");
		if (schema.maxLength !== void 0 && typeof schema.maxLength !== "number") decline("maxLength:not-number");
		const delegated = [];
		for (const k of [
			"pattern",
			"format",
			"const",
			"enum"
		]) if (schema[k] !== void 0) delegated.push(k);
		emitStringSpan(ctx, out, n, inlineLen);
		if (inlineLen) {
			const lenKeys = [];
			if (schema.minLength !== void 0) lenKeys.push("minLength");
			if (schema.maxLength !== void 0) lenKeys.push("maxLength");
			const lf = compileLeaf(lenKeys, schema, ctx);
			out.push("if(_x" + n + "||_hs" + n + "){if(!" + lf + "(_r.span(s,_p" + n + ",_e" + n + ",_x" + n + ")))return 0;}");
			out.push("else{");
			if (schema.minLength !== void 0) out.push("if(_u" + n + "<" + schema.minLength + ")return 0;");
			if (schema.maxLength !== void 0) out.push("if(_u" + n + ">" + schema.maxLength + ")return 0;");
			out.push("}");
		}
		if (delegated.length > 0) {
			const f = compileLeaf(delegated, schema, ctx);
			out.push("if(!" + f + "(_r.span(s,_p" + n + ",_e" + n + ",_x" + n + ")))return 0;");
		}
	}
	function emitNumber(schema, ctx, out, types) {
		const n = ctx.uid++;
		for (const k of [
			"minimum",
			"maximum",
			"exclusiveMinimum",
			"exclusiveMaximum"
		]) if (schema[k] !== void 0 && typeof schema[k] !== "number") decline("bound:" + k + ":not-number");
		const delegated = [];
		for (const k of [
			"multipleOf",
			"const",
			"enum"
		]) if (schema[k] !== void 0) delegated.push(k);
		const intOnly = integerOnly(types);
		const wantValue = delegated.length > 0 || schema.minimum !== void 0 || schema.maximum !== void 0 || schema.exclusiveMinimum !== void 0 || schema.exclusiveMaximum !== void 0 || types !== null;
		out.push("var _np" + n + "=i,_v" + n + "=0,_ng" + n + "=0,_nd" + n + "=0,_pl" + n + "=1;");
		out.push("if(c===45){_ng" + n + "=1;c=s.charCodeAt(++i);}");
		out.push("if(c===48){_nd" + n + "=1;c=s.charCodeAt(++i);}");
		out.push("else if(c>=49&&c<=57){do{_v" + n + "=_v" + n + "*10+(c-48);_nd" + n + "++;c=s.charCodeAt(++i);}while(c>=48&&c<=57);}");
		out.push("else return 0;");
		out.push("if(c===46){_pl" + n + "=0;c=s.charCodeAt(++i);if(!(c>=48&&c<=57))return 0;do{c=s.charCodeAt(++i);}while(c>=48&&c<=57);}");
		out.push("if(c===101||c===69){_pl" + n + "=0;c=s.charCodeAt(++i);if(c===43||c===45)c=s.charCodeAt(++i);if(!(c>=48&&c<=57))return 0;do{c=s.charCodeAt(++i);}while(c>=48&&c<=57);}");
		if (wantValue) out.push("if(_pl" + n + "===0||_nd" + n + ">15){_v" + n + "=+s.slice(_np" + n + ",i);}else if(_ng" + n + "){_v" + n + "=-_v" + n + ";}");
		if (intOnly) out.push("if(_pl" + n + "===0&&!Number.isInteger(_v" + n + "))return 0;");
		if (types !== null) out.push("if(!isFinite(_v" + n + "))return 0;");
		if (schema.minimum !== void 0) out.push("if(!(_v" + n + ">=" + schema.minimum + "))return 0;");
		if (schema.maximum !== void 0) out.push("if(!(_v" + n + "<=" + schema.maximum + "))return 0;");
		if (schema.exclusiveMinimum !== void 0) out.push("if(!(_v" + n + ">" + schema.exclusiveMinimum + "))return 0;");
		if (schema.exclusiveMaximum !== void 0) out.push("if(!(_v" + n + "<" + schema.exclusiveMaximum + "))return 0;");
		if (delegated.length > 0) {
			const f = compileLeaf(delegated, schema, ctx);
			out.push("if(!" + f + "(_v" + n + "))return 0;");
		}
	}
	function emitLiteral(schema, ctx, out, kind) {
		const delegated = [];
		for (const k of ["const", "enum"]) if (schema[k] !== void 0) delegated.push(k);
		let allowTrue = true, allowFalse = true, allowNull = true;
		if (delegated.length > 0) {
			const sub = {};
			for (const k of delegated) sub[k] = schema[k];
			const fn = compileToJSCodegen(sub, null, ctx.userFormats);
			if (typeof fn !== "function") decline("literal-leaf");
			allowTrue = fn(true) === true;
			allowFalse = fn(false) === true;
			allowNull = fn(null) === true;
		}
		if (kind === "null") {
			if (!allowNull) {
				out.push("return 0;");
				return;
			}
			out.push("if(s.charCodeAt(i+1)!==117||s.charCodeAt(i+2)!==108||s.charCodeAt(i+3)!==108)return 0;");
			out.push("i+=4;c=s.charCodeAt(i);");
			return;
		}
		out.push("if(c===116){" + (allowTrue ? "" : "return 0;") + "if(s.charCodeAt(i+1)!==114||s.charCodeAt(i+2)!==117||s.charCodeAt(i+3)!==101)return 0;i+=4;}");
		out.push("else{" + (allowFalse ? "" : "return 0;") + "if(s.charCodeAt(i+1)!==97||s.charCodeAt(i+2)!==108||s.charCodeAt(i+3)!==115||s.charCodeAt(i+4)!==101)return 0;i+=5;}");
		out.push("c=s.charCodeAt(i);");
	}
	function emitArray(schema, ctx, out, depth) {
		const n = ctx.uid++;
		for (const k of ["minItems", "maxItems"]) if (schema[k] !== void 0 && typeof schema[k] !== "number") decline("itemsCount:" + k + ":not-number");
		const items = schema.items !== void 0 ? schema.items : schema.unevaluatedItems;
		if (items !== void 0 && !isPlainObject(items) && typeof items !== "boolean") decline("items:tuple");
		const prefix = schema.prefixItems;
		if (prefix !== void 0) {
			if (!Array.isArray(prefix)) decline("prefixItems:not-array");
			if (prefix.length > MAX_PREFIX_ITEMS) decline("prefixItems:too-long");
		}
		const wantCount = schema.minItems !== void 0 || schema.maxItems !== void 0 || prefix !== void 0;
		const emitRest = (into) => {
			if (items === void 0 || items === true) emitSkip(into);
			else emitValue(items, ctx, into, depth + 1);
		};
		out.push("c=s.charCodeAt(++i);");
		if (wantCount) out.push("var _n" + n + "=0;");
		out.push(WS);
		out.push("if(c!==93){for(;;){");
		if (prefix === void 0) emitRest(out);
		else {
			for (let k = 0; k < prefix.length; k++) {
				out.push((k === 0 ? "if(" : "else if(") + "_n" + n + "===" + k + "){");
				emitValue(prefix[k], ctx, out, depth + 1);
				out.push("}");
			}
			out.push("else{");
			emitRest(out);
			out.push("}");
		}
		if (wantCount) {
			out.push("_n" + n + "++;");
			if (schema.maxItems !== void 0) out.push("if(_n" + n + ">" + schema.maxItems + ")return 0;");
		}
		out.push(WS);
		out.push("if(c===44){c=s.charCodeAt(++i);" + WS + "continue;}");
		out.push("if(c===93)break;");
		out.push("return 0;}}");
		out.push("c=s.charCodeAt(++i);");
		if (schema.minItems !== void 0) {
			if (wantCount) out.push("if(_n" + n + "<" + schema.minItems + ")return 0;");
		}
	}
	function emitMember(sub, ctx, out, depth, objId) {
		let lines = [];
		emitValue(sub, ctx, lines, depth + 1);
		const size = lines.join("\n").length;
		const kept = ctx.split ? ctx.inlineBytes.get(objId) || 0 : 0;
		if (ctx.split && (size > SPLIT_MIN || kept + size > SPLIT_OBJECT)) {
			const name = "_s" + (ctx.subSource.length + ctx.subs.size + ctx.uid++);
			ctx.subSource.push("function " + name + "(s,i){var len=s.length,c=s.charCodeAt(i);\n" + lines.join("\n") + "\nreturn i;}");
			lines = [];
			emitSubCall(name, ctx, lines);
		} else if (ctx.split) ctx.inlineBytes.set(objId, kept + size);
		const body = lines.join("\n");
		if (!body.includes("return 0;")) {
			out.push(body);
			return;
		}
		const label = "_mb" + ctx.uid++;
		out.push("var _vs" + label + "=i;");
		out.push(label + ":{");
		out.push(body.split("return 0;").join("{_f" + objId + "=2;break " + label + ";}"));
		out.push("}");
		out.push("if(_f" + objId + "===2){_f" + objId + "=1;i=_r.skipValue(s,_vs" + label + ");if(i<0)return 0;c=s.charCodeAt(i);}");
	}
	function emitObject(schema, ctx, out, depth) {
		const n = ctx.uid++;
		const props = schema.properties;
		if (props !== void 0 && !isPlainObject(props)) decline("properties:not-object");
		const required = schema.required;
		if (required !== void 0 && !Array.isArray(required)) decline("required:not-array");
		const ap = schema.additionalProperties !== void 0 ? schema.additionalProperties : schema.unevaluatedProperties;
		if (ap !== void 0 && !isPlainObject(ap) && typeof ap !== "boolean") decline("additionalProperties:shape");
		for (const k of ["minProperties", "maxProperties"]) if (schema[k] !== void 0 && typeof schema[k] !== "number") decline("propCount:" + k + ":not-number");
		const counting = schema.minProperties !== void 0 || schema.maxProperties !== void 0;
		if (counting && ap !== false) decline("min/maxProperties:open-object");
		const names = [];
		if (props) for (const k of Object.keys(props)) names.push(k);
		if (required) for (const k of required) {
			if (typeof k !== "string") decline("required:not-string");
			if (!names.includes(k)) names.push(k);
		}
		if (names.length > MAX_PROPS) decline("too-many-properties");
		const words = Math.max(1, Math.ceil(names.length / 31));
		const bit = /* @__PURE__ */ new Map();
		names.forEach((k, idx) => bit.set(k, {
			w: idx / 31 | 0,
			b: 1 << idx % 31
		}));
		const reqMasks = new Array(words).fill(0);
		if (required) for (const k of required) {
			const x = bit.get(k);
			reqMasks[x.w] |= x.b;
		}
		out.push("c=s.charCodeAt(++i);");
		const useHash = names.length >= HASH_DISPATCH_MIN;
		if (useHash) out.push("var _sa" + n + "=new Int32Array(" + (Math.ceil(names.length / 32) || 1) + "),_nx" + n + "=0,_f" + n + "=0" + (counting ? ",_c" + n + "=0" : "") + ";");
		else {
			const seenDecl = [];
			for (let w = 0; w < words; w++) seenDecl.push("_s" + n + "_" + w + "=0");
			out.push("var " + seenDecl.join(",") + ",_f" + n + "=0" + (counting ? ",_c" + n + "=0" : "") + ";");
		}
		out.push(WS);
		out.push("if(c!==125){for(;;){");
		out.push(WS);
		out.push("if(c!==34)return 0;");
		const kn = ctx.uid++;
		let hashById = null;
		if (names.length >= HASH_DISPATCH_MIN) {
			const table = /* @__PURE__ */ new Map();
			let collision = false;
			names.forEach((nm, id) => {
				const h = spanHash(nm);
				if (table.has(h)) collision = true;
				table.set(h, id);
			});
			if (!collision) {
				ctx.helpers.push(table);
				hashById = "_h[" + (ctx.helpers.length - 1) + "]";
			}
		}
		const indexKey = !useHash && names.length > 0 && names.every(plainName) && names.reduce((n, x) => n + x.length, 0) >= INDEX_KEY_MIN_AVG * names.length;
		if (indexKey) out.push("var _p" + kn + "=++i,_e" + kn + "=s.indexOf('\"',i);if(_e" + kn + "<0)return 0;if(s.charCodeAt(_e" + kn + "-1)===92)return -1;i=_e" + kn + ";c=s.charCodeAt(++i);");
		else {
			emitStringSpan(ctx, out, kn, false, hashById !== null);
			out.push("if(_x" + kn + ")return -1;");
		}
		out.push(WS);
		out.push("if(c!==58)return 0;");
		out.push("c=s.charCodeAt(++i);");
		out.push(WS);
		if (counting) out.push("_c" + n + "++;");
		out.push("var _kl" + kn + "=_e" + kn + "-_p" + kn + ";");
		if (hashById !== null) {
			const addH = (() => {
				const a = [];
				if (ap === false) a.push("return 0;");
				else if (ap === void 0 || ap === true) emitSkip(a);
				else {
					const l = [];
					emitValue(ap, ctx, l, depth + 1);
					a.push(l.join("\n").split("return 0;").join("return -1;"));
				}
				return a.join("\n");
			})();
			const groups = /* @__PURE__ */ new Map();
			for (const name of names) {
				const sub = props && Object.prototype.hasOwnProperty.call(props, name) ? props[name] : void 0;
				const key = sub === void 0 ? "\0additional" : JSON.stringify(sub);
				if (!groups.has(key)) groups.set(key, {
					sub,
					members: []
				});
				groups.get(key).members.push(name);
			}
			const ordered = [];
			const bounds = [];
			for (const g of groups.values()) {
				for (const nm of g.members) ordered.push(nm);
				bounds.push({
					end: ordered.length,
					sub: g.sub
				});
			}
			const table = /* @__PURE__ */ new Map();
			ordered.forEach((nm, id) => {
				table.set(spanHash(nm), id);
			});
			ctx.helpers.push(table);
			const tbl = "_h[" + (ctx.helpers.length - 1) + "]";
			ctx.helpers.push(ordered.slice());
			const nmArr = "_h[" + (ctx.helpers.length - 1) + "]";
			const wordCount = Math.ceil(ordered.length / 32) || 1;
			const rq = new Int32Array(wordCount);
			if (required) for (const k of required) {
				const id = ordered.indexOf(k);
				rq[id >> 5] |= 1 << (id & 31);
			}
			ctx.helpers.push(rq);
			const rqArr = "_h[" + (ctx.helpers.length - 1) + "]";
			const eids = new Int32Array(names.length);
			names.forEach((nm, si) => {
				eids[si] = ordered.indexOf(nm);
			});
			ctx.helpers.push(eids);
			const eidArr = "_h[" + (ctx.helpers.length - 1) + "]";
			const sids = new Int32Array(ordered.length);
			eids.forEach((id, si) => {
				sids[id] = si;
			});
			ctx.helpers.push(sids);
			const sidArr = "_h[" + (ctx.helpers.length - 1) + "]";
			out.push("var _kid" + kn + "=-1;");
			out.push("if(_nx" + n + "<" + names.length + "){var _ec" + kn + "=" + eidArr + "[_nx" + n + "],_en" + kn + "=" + nmArr + "[_ec" + kn + "];");
			out.push("if(_kl" + kn + "===_en" + kn + ".length&&s.startsWith(_en" + kn + ",_p" + kn + ")){_kid" + kn + "=_ec" + kn + ";_nx" + n + "++;}}");
			out.push("if(_kid" + kn + "<0){var _tg" + kn + "=" + tbl + ".get(_h" + kn + ");");
			out.push("if(_tg" + kn + "===undefined){" + addH + "}");
			out.push("else{var _nv" + kn + "=" + nmArr + "[_tg" + kn + "];");
			out.push("if(_kl" + kn + "!==_nv" + kn + ".length||!s.startsWith(_nv" + kn + ",_p" + kn + ")){" + addH + "}");
			out.push("else{_kid" + kn + "=_tg" + kn + ";_nx" + n + "=" + sidArr + "[_kid" + kn + "]+1;}}}");
			out.push("if(_kid" + kn + ">=0){");
			out.push("var _wd" + kn + "=_kid" + kn + ">>5,_bt" + kn + "=1<<(_kid" + kn + "&31);");
			out.push("if(_sa" + n + "[_wd" + kn + "]&_bt" + kn + ")return -1;");
			out.push("_sa" + n + "[_wd" + kn + "]|=_bt" + kn + ";");
			bounds.forEach((g, gi) => {
				const cond = gi === bounds.length - 1 ? "" : "if(_kid" + kn + "<" + g.end + ")";
				out.push((gi === 0 ? "" : "else ") + cond + "{");
				if (g.sub === void 0) out.push(addH);
				else emitMember(g.sub, ctx, out, depth, n);
				out.push("}");
				g.end;
			});
			out.push("}");
			ctx._saState = ctx._saState || {};
			ctx._saState[n] = {
				words: wordCount,
				rqArr,
				hasReq: rq.some ? Array.from(rq).some((x) => x !== 0) : false
			};
		} else {
			const byLen = /* @__PURE__ */ new Map();
			for (const name of names) {
				const len = name.length;
				if (!byLen.has(len)) byLen.set(len, []);
				byLen.get(len).push(name);
			}
			const additional = [];
			if (ap === false) additional.push("return 0;");
			else if (ap === void 0 || ap === true) emitSkip(additional);
			else {
				const lines = [];
				emitValue(ap, ctx, lines, depth + 1);
				additional.push(lines.join("\n").split("return 0;").join("return -1;"));
			}
			if (indexKey) additional.unshift("if(!_r.plainKey(s,_p" + kn + ",_e" + kn + "))return -1;");
			out.push("switch(_kl" + kn + "){");
			for (const [len, group] of byLen) {
				out.push("case " + len + ":{");
				let first = true;
				for (const name of group) {
					const tests = [];
					for (let k = 0; k < name.length; k++) tests.push("s.charCodeAt(_p" + kn + (k === 0 ? "" : "+" + k) + ")===" + name.charCodeAt(k));
					out.push((first ? "if(" : "else if(") + (tests.length ? tests.join("&&") : "true") + "){");
					first = false;
					const slot = bit.get(name);
					out.push("if(_s" + n + "_" + slot.w + "&" + slot.b + ")return -1;");
					out.push("_s" + n + "_" + slot.w + "|=" + slot.b + ";");
					const sub = props && Object.prototype.hasOwnProperty.call(props, name) ? props[name] : void 0;
					if (sub === void 0) out.push(additional.join("\n"));
					else emitMember(sub, ctx, out, depth, n);
					out.push("}");
				}
				out.push("else{" + additional.join("\n") + "}");
				out.push("break;}");
			}
			out.push("default:{" + additional.join("\n") + "}}");
		}
		out.push(WS);
		out.push("if(c===44){c=s.charCodeAt(++i);" + WS + "continue;}");
		out.push("if(c===125)break;");
		out.push("return 0;}}");
		out.push("c=s.charCodeAt(++i);");
		out.push("if(_f" + n + ")return 0;");
		if (ctx._saState && ctx._saState[n]) {
			const st = ctx._saState[n];
			if (st.hasReq) {
				const wv = "_rw" + n;
				out.push("for(var " + wv + "=0;" + wv + "<" + st.words + ";" + wv + "++)if((_sa" + n + "[" + wv + "]&" + st.rqArr + "[" + wv + "])!==" + st.rqArr + "[" + wv + "])return 0;");
			}
		} else for (let w = 0; w < words; w++) if (reqMasks[w] !== 0) out.push("if((_s" + n + "_" + w + "&" + reqMasks[w] + ")!==" + reqMasks[w] + ")return 0;");
		if (schema.minProperties !== void 0) out.push("if(_c" + n + "<" + schema.minProperties + ")return 0;");
		if (schema.maxProperties !== void 0) out.push("if(_c" + n + ">" + schema.maxProperties + ")return 0;");
	}
	module.exports = {
		compileScanner,
		VALID,
		INVALID,
		BAIL
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/clone-emit.js
var require_clone_emit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { compileToJSCodegen, unevalContributions } = require_js_compiler();
	function resolveLocalPointer(root, ref) {
		if (ref === "#") return root;
		if (typeof ref !== "string" || !ref.startsWith("#/")) return null;
		let cur = root;
		for (const raw of ref.slice(2).split("/")) {
			let seg = raw.replace(/~1/g, "/").replace(/~0/g, "~");
			if (cur === null || typeof cur !== "object") return null;
			if (!Object.prototype.hasOwnProperty.call(cur, seg)) {
				try {
					seg = decodeURIComponent(seg);
				} catch (_) {
					return null;
				}
				if (!Object.prototype.hasOwnProperty.call(cur, seg)) return null;
			}
			cur = cur[seg];
		}
		return cur;
	}
	const _INLINE_ANNOTATIONS = /* @__PURE__ */ new Set([
		"$ref",
		"title",
		"description",
		"$comment",
		"examples",
		"deprecated",
		"readOnly",
		"writeOnly",
		"default"
	]);
	const _INLINE_DATA_KEYS = /* @__PURE__ */ new Set([
		"default",
		"const",
		"enum",
		"examples"
	]);
	function inlineRefsForClone(root) {
		const state = { budget: 512 };
		const walk = (node, active, inRef) => {
			if (!node || typeof node !== "object") return node;
			if (Array.isArray(node)) return node.map((n) => walk(n, active, inRef));
			let cur = node;
			let entered = false;
			let siblingDefault;
			while (cur && typeof cur === "object" && !Array.isArray(cur) && typeof cur.$ref === "string") {
				for (const k of Object.keys(cur)) if (!_INLINE_ANNOTATIONS.has(k)) return node;
				if (active.has(cur.$ref) || state.budget-- <= 0) return node;
				const target = resolveLocalPointer(root, cur.$ref);
				if (!target || typeof target !== "object" || Array.isArray(target)) return node;
				if (!entered && !inRef && cur.default !== void 0) siblingDefault = cur.default;
				active = new Set(active);
				active.add(cur.$ref);
				cur = target;
				entered = true;
			}
			const strip = inRef || entered;
			const out = {};
			for (const k of Object.keys(cur)) {
				if (strip && k === "default") continue;
				const v = cur[k];
				const w = _INLINE_DATA_KEYS.has(k) || k === "$defs" || k === "definitions" ? v : walk(v, active, strip);
				if (k === "__proto__") Object.defineProperty(out, k, {
					value: w,
					writable: true,
					enumerable: true,
					configurable: true
				});
				else out[k] = w;
			}
			if (siblingDefault !== void 0) out.default = siblingDefault;
			return out;
		};
		return walk(root, /* @__PURE__ */ new Set(), false);
	}
	const PROTO_KEY_NAMES = /* @__PURE__ */ new Set([...Object.getOwnPropertyNames(Object.prototype), "__proto__"]);
	function emitClone(node, access, depth) {
		if (!node || typeof node !== "object") return null;
		if (depth > 12) return null;
		if (node.$ref || node.patternProperties || node.additionalProperties === true) return null;
		const apSchema = node.additionalProperties && typeof node.additionalProperties === "object" ? node.additionalProperties : null;
		if (apSchema) {
			if (node.unevaluatedProperties !== void 0) return null;
			if (node.allOf || node.anyOf || node.oneOf || node.if || node.then || node.else || node.dependentSchemas !== void 0 || node.dependencies !== void 0 || node.$dynamicRef !== void 0 || node.$recursiveRef !== void 0) return null;
		}
		if (node.unevaluatedProperties !== void 0 && node.unevaluatedProperties !== false) return null;
		if (node.type !== "object") return null;
		if (!node.properties && !apSchema) return null;
		const keys = node.properties ? Object.keys(node.properties) : [];
		if (keys.length === 0 && !apSchema) return null;
		if (node.allOf || node.anyOf || node.oneOf || node.if || node.then || node.else || node.unevaluatedProperties === false) {
			if (node.$dynamicRef !== void 0 || node.$recursiveRef !== void 0 || node.dependentSchemas !== void 0 || node.dependencies !== void 0) return null;
			const names = /* @__PURE__ */ new Set();
			const state = { prefix: 0 };
			for (const k of [
				"allOf",
				"anyOf",
				"oneOf"
			]) if (node[k] !== void 0) {
				if (!Array.isArray(node[k])) return null;
				for (const b of node[k]) if (!unevalContributions(b, "props", names, state, 0)) return null;
			}
			for (const k of [
				"if",
				"then",
				"else"
			]) if (node[k] !== void 0 && !unevalContributions(node[k], "props", names, state, 0)) return null;
			for (const n of names) if (!Object.prototype.hasOwnProperty.call(node.properties, n)) return null;
		}
		const required = new Set(Array.isArray(node.required) ? node.required : []);
		const fixed = [];
		const conditional = [];
		for (const key of keys) {
			const prop = node.properties[key];
			if (!prop || typeof prop !== "object") return null;
			if (prop.$ref) return null;
			if (required.has(key) && prop.default !== void 0) return null;
			if (prop.default !== void 0) {
				let probe = null;
				try {
					probe = compileToJSCodegen(prop, null, null);
				} catch (_) {
					probe = null;
				}
				if (!probe || !probe(prop.default)) return null;
			}
			const value = emitValueExpr(prop, `${access}[${JSON.stringify(key)}]`, depth);
			if (value === null) return null;
			if (required.has(key)) fixed.push(key === "__proto__" ? `[${JSON.stringify(key)}]: ${value}` : `${JSON.stringify(key)}: ${value}`);
			else conditional.push({
				key,
				value,
				dflt: prop.default
			});
		}
		if (fixed.length === 0 && conditional.length === 0 && !apSchema) return null;
		const tmp = `_c${depth}`;
		let recordLoop = "";
		if (apSchema) {
			const kVar = `_k${depth}`;
			const vVar = `_v${depth}`;
			const valueExpr = emitValueExpr(stripDefaultsDeep(apSchema), vVar, depth);
			if (valueExpr === null) return null;
			let skip = "";
			let declSet = "";
			if (keys.length > 8) {
				declSet = `const _d${depth} = new Set(${JSON.stringify(keys)}); `;
				skip = `if (_d${depth}.has(${kVar})) continue; `;
			} else if (keys.length > 0) skip = `if (${keys.map((k) => `${kVar} === ${JSON.stringify(k)}`).join(" || ")}) continue; `;
			recordLoop = ` ${declSet}for (const ${kVar} of Object.keys(${access})) { ${skip}const ${vVar} = ${access}[${kVar}]; if (${kVar} === "__proto__") Object.defineProperty(${tmp}, ${kVar}, { value: ${valueExpr}, writable: true, enumerable: true, configurable: true }); else ${tmp}[${kVar}] = ${valueExpr}; }`;
		}
		const literal = `{ ${fixed.join(", ")} }`;
		if (conditional.length === 0 && !recordLoop) return literal;
		return `(function(){ const ${tmp} = ${literal}; ${conditional.map(({ key, value, dflt }) => {
			const assign = key === "__proto__" ? `Object.defineProperty(${tmp}, ${JSON.stringify(key)}, { value: ${value}, writable: true, enumerable: true, configurable: true });` : `${tmp}[${JSON.stringify(key)}] = ${value};`;
			const k = JSON.stringify(key);
			const set = `if (${PROTO_KEY_NAMES.has(key) ? `Object.prototype.hasOwnProperty.call(${access}, ${k})` : `(${k} in ${access} && (${access}.__proto__ === Object.prototype || Object.prototype.hasOwnProperty.call(${access}, ${k})))`}) ${assign}`;
			if (dflt === void 0) return set;
			return `${set} else ${key === "__proto__" ? `Object.defineProperty(${tmp}, ${JSON.stringify(key)}, { value: ${JSON.stringify(dflt)}, writable: true, enumerable: true, configurable: true });` : `${tmp}[${JSON.stringify(key)}] = ${JSON.stringify(dflt)};`}`;
		}).join(" ")}${recordLoop} return ${tmp}; })()`;
	}
	function stripDefaultsDeep(node) {
		if (!node || typeof node !== "object") return node;
		if (Array.isArray(node)) return node.map(stripDefaultsDeep);
		const out = {};
		for (const k of Object.keys(node)) {
			if (k === "default") continue;
			out[k] = _INLINE_DATA_KEYS.has(k) ? node[k] : stripDefaultsDeep(node[k]);
		}
		return out;
	}
	const _CLONE_PRIMITIVE = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	]);
	function isPrimitiveOnly(s) {
		if (!s || typeof s !== "object" || s.$ref) return false;
		if (s.type !== void 0) return (Array.isArray(s.type) ? s.type : [s.type]).every((t) => _CLONE_PRIMITIVE.has(t));
		const isPrim = (v) => v === null || typeof v !== "object" && typeof v !== "function";
		if (Array.isArray(s.enum) && s.enum.length > 0 && s.enum.every(isPrim) && s.const === void 0) return true;
		if (s.const !== void 0 && isPrim(s.const) && s.enum === void 0) return true;
		for (const k of ["anyOf", "oneOf"]) if (Array.isArray(s[k]) && s[k].length > 0 && s[k].every(isPrimitiveOnly)) return true;
		return false;
	}
	function emitValueExpr(prop, read, depth) {
		if (!prop || typeof prop !== "object") return null;
		if (prop.$ref) return null;
		if (isPrimitiveOnly(prop)) return read;
		if (prop.instanceof !== void 0) return read;
		const isRecordable = (s) => s.properties || s.additionalProperties && typeof s.additionalProperties === "object";
		if (prop.type === "object" && isRecordable(prop)) return emitClone(prop, read, depth + 1);
		if (prop.type === "array" && prop.items && typeof prop.items === "object" && !Array.isArray(prop.items)) {
			const it = prop.items;
			if (isPrimitiveOnly(it)) return `${read}.slice()`;
			if (it.type === "object" && isRecordable(it)) {
				const el = "_e" + depth;
				const inner = emitClone(it, el, depth + 1);
				if (!inner) return null;
				return `${read}.map((${el}) => (${inner}))`;
			}
		}
		return null;
	}
	function cloneExprFor(schema) {
		if (!schema || typeof schema !== "object") return null;
		return emitClone(inlineRefsForClone(schema), "data", 0);
	}
	module.exports = {
		cloneExprFor,
		emitClone,
		inlineRefsForClone,
		stripDefaultsDeep,
		resolveLocalPointer
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/native-positions.js
var require_native_positions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const NATIVE_MIN = 32768;
	let _native;
	function nativeTargeted(text, wanted) {
		if (typeof text !== "string" || text.length < NATIVE_MIN) return null;
		if (_native === void 0) {
			try {
				_native = require_native_load_browser()();
			} catch {
				_native = null;
			}
			if (_native && typeof _native.locatePointers !== "function") _native = null;
		}
		if (_native === null || typeof Buffer === "undefined" || Buffer.byteLength(text, "utf8") !== text.length) return null;
		const ptrs = Array.from(wanted);
		let found;
		try {
			found = _native.locatePointers(text, ptrs);
		} catch {
			return null;
		}
		const offs = [];
		for (let k = 0; k < ptrs.length; k++) {
			if (!(found[2 * k] >= 0)) return null;
			offs.push(found[2 * k]);
		}
		const needed = [];
		for (let k = 0; k < ptrs.length; k++) {
			needed.push(offs[k]);
			const ks = keyStartBefore(text, offs[k]);
			if (ks >= 0) needed.push(ks);
		}
		const lineOf = lineFinder(text, needed);
		const map = Object.create(null);
		for (let k = 0; k < ptrs.length; k++) {
			const off = offs[k];
			const at = lineOf(off);
			const entry = {
				byteOffset: off,
				length: found[2 * k + 1],
				line: at.line,
				col: off - at.start + 1,
				text: at.text
			};
			const ks = keyStartBefore(text, off);
			if (ks >= 0 && ptrs[k] !== "") {
				const kat = lineOf(ks);
				entry.keyOffset = ks;
				entry.keyLength = keyEndAfter(text, ks) - ks + 1;
				entry.keyLine = kat.line;
				entry.keyCol = ks - kat.start + 1;
			}
			map[ptrs[k]] = entry;
		}
		return map;
	}
	function keyStartBefore(text, off) {
		let j = off - 1;
		while (j >= 0) {
			const c = text.charCodeAt(j);
			if (c === 32 || c === 9 || c === 10 || c === 13) j--;
			else break;
		}
		if (j < 0 || text.charCodeAt(j) !== 58) return -1;
		j--;
		while (j >= 0) {
			const c = text.charCodeAt(j);
			if (c === 32 || c === 9 || c === 10 || c === 13) j--;
			else break;
		}
		if (j < 0 || text.charCodeAt(j) !== 34) return -1;
		for (let q = j - 1; q >= 0; q--) {
			if (text.charCodeAt(q) !== 34) continue;
			let b = q - 1;
			while (b >= 0 && text.charCodeAt(b) === 92) b--;
			if ((q - 1 - b & 1) === 0) return q;
		}
		return -1;
	}
	function keyEndAfter(text, start) {
		let q = start + 1;
		for (;;) {
			const c = text.charCodeAt(q);
			if (c === 92) {
				q += 2;
				continue;
			}
			if (c === 34 || q >= text.length) return q;
			q++;
		}
	}
	function lineFinder(text, offsets) {
		const sorted = Array.from(new Set(offsets)).sort((a, b) => a - b);
		const info = /* @__PURE__ */ new Map();
		let line = 1, start = 0, s = 0;
		while (s < sorted.length) {
			const nl = text.indexOf("\n", start);
			const end = nl === -1 ? text.length : nl;
			while (s < sorted.length && sorted[s] <= end) {
				info.set(sorted[s], {
					line,
					start,
					text: text.slice(start, end)
				});
				s++;
			}
			if (nl === -1) break;
			line++;
			start = nl + 1;
		}
		return (off) => info.get(off);
	}
	module.exports = { nativeTargeted };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/aot.browser.js
var require_aot_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function unavailable(name) {
		return function() {
			throw new Error(name + "() is not in the default browser bundle. Import it from 'ata-validator/aot', which works in the browser too; pages that never emit code stay free of the emitters this way.");
		};
	}
	function loadBundle(Validator, mods, schemas, opts) {
		return schemas.map((schema, i) => {
			if (mods[i]) return Validator.fromStandalone(mods[i], schema, opts);
			return new Validator(schema, opts);
		});
	}
	module.exports = {
		toStandalone: unavailable("toStandalone"),
		toStandaloneModule: unavailable("toStandaloneModule"),
		bundle: unavailable("bundle"),
		bundleStandalone: unavailable("bundleStandalone"),
		bundleCompact: unavailable("bundleCompact"),
		loadBundle
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/ts-gen.js
var require_ts_gen = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ATA_VERSION = require_version();
	function renderValueType(schema, defs, depth = 0) {
		if (depth > 32) return "unknown";
		if (schema === true) return "unknown";
		if (schema === false) return "never";
		if (typeof schema !== "object" || schema === null) return "unknown";
		if (schema.$ref) {
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && defs && defs[m[1]]) return toTypeName(m[1]);
			return "unknown";
		}
		if (schema.const !== void 0) return renderLiteral(schema.const);
		if (Array.isArray(schema.enum)) return schema.enum.map(renderLiteral).join(" | ") || "never";
		if (Array.isArray(schema.oneOf)) return schema.oneOf.map((s) => renderValueType(s, defs, depth + 1)).join(" | ") || "unknown";
		if (Array.isArray(schema.anyOf)) return schema.anyOf.map((s) => renderValueType(s, defs, depth + 1)).join(" | ") || "unknown";
		const t = schema.type;
		if (Array.isArray(t)) return t.map((tt) => renderValueType({
			...schema,
			type: tt
		}, defs, depth + 1)).join(" | ");
		if (t === "string") return "string";
		if (t === "number" || t === "integer") return "number";
		if (t === "boolean") return "boolean";
		if (t === "null") return "null";
		if (t === "array") {
			const items = schema.items;
			const prefix = Array.isArray(schema.prefixItems) ? schema.prefixItems : null;
			if (prefix) {
				const prefixTypes = prefix.map((s) => renderValueType(s, defs, depth + 1));
				const minItems = typeof schema.minItems === "number" ? schema.minItems : 0;
				const elements = prefixTypes.map((t, i) => i < minItems ? t : `${t}?`);
				if (items === false) return `[${elements.join(", ")}]`;
				if (items === void 0 || items === true) return `[${elements.join(", ")}, ...unknown[]]`;
				if (typeof items === "object" && items !== null) {
					const rest = renderValueType(items, defs, depth + 1);
					const restType = rest.includes(" | ") ? `(${rest})` : rest;
					return `[${elements.join(", ")}, ...${restType}[]]`;
				}
			}
			if (items === false) return "never[]";
			if (items === void 0 || items === true) return "unknown[]";
			const inner = renderValueType(items, defs, depth + 1);
			return inner.includes(" | ") ? `Array<${inner}>` : `${inner}[]`;
		}
		if (t === "object" || !t && schema.properties) return renderObject(schema, defs, depth + 1);
		return "unknown";
	}
	function renderObject(schema, defs, depth) {
		const props = schema.properties || {};
		const required = new Set(schema.required || []);
		const keys = Object.keys(props);
		if (keys.length === 0) {
			if (schema.additionalProperties === false) return "Record<string, never>";
			const ap = schema.additionalProperties;
			if (ap && typeof ap === "object") return `Record<string, ${renderValueType(ap, defs, depth + 1)}>`;
			return "Record<string, unknown>";
		}
		const lines = keys.map((k) => {
			const t = renderValueType(props[k], defs, depth + 1);
			const opt = required.has(k) ? "" : "?";
			const safeKey = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
			return `${renderJsDoc(props[k], "  ")}  ${safeKey}${opt}: ${t};`;
		});
		const extra = schema.additionalProperties;
		if (extra && typeof extra === "object") {
			const widen = /* @__PURE__ */ new Set();
			widen.add(renderValueType(extra, defs, depth + 1));
			let hasOptional = false;
			for (const k of keys) {
				widen.add(renderValueType(props[k], defs, depth + 1));
				if (!required.has(k)) hasOptional = true;
			}
			if (hasOptional) widen.add("undefined");
			const indexType = widen.has("unknown") ? "unknown" : Array.from(widen).join(" | ");
			lines.push(`  [key: string]: ${indexType};`);
		} else if (extra !== false) lines.push(`  [key: string]: unknown;`);
		return `{\n${lines.join("\n")}\n}`;
	}
	function renderLiteral(v) {
		if (v === null) return "null";
		if (typeof v === "string") return JSON.stringify(v);
		if (typeof v === "number" || typeof v === "boolean") return String(v);
		return "unknown";
	}
	function toTypeName(name) {
		const cleaned = String(name).replace(/[^A-Za-z0-9_]/g, "_");
		if (cleaned === "") return "_Anon";
		if (/^[0-9]/.test(cleaned)) return `_${cleaned}`;
		return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
	}
	function renderJsDoc(schema, indent) {
		if (!schema || typeof schema !== "object") return "";
		let description = "";
		if (typeof schema.description === "string" && schema.description.length > 0) description = schema.description.replace(/\*\//g, "* /");
		const tags = [];
		for (const k of [
			"minLength",
			"maxLength",
			"minItems",
			"maxItems",
			"minProperties",
			"maxProperties",
			"minimum",
			"maximum",
			"exclusiveMinimum",
			"exclusiveMaximum",
			"multipleOf"
		]) if (typeof schema[k] === "number") tags.push(`@${k} ${schema[k]}`);
		if (typeof schema.pattern === "string") tags.push(`@pattern ${schema.pattern}`);
		if (typeof schema.format === "string") tags.push(`@format ${schema.format}`);
		if (schema.uniqueItems === true) tags.push("@uniqueItems");
		if (schema.deprecated === true) tags.push("@deprecated");
		if (schema.default !== void 0) try {
			tags.push(`@default ${JSON.stringify(schema.default)}`);
		} catch (_) {}
		if (Array.isArray(schema.examples) && schema.examples.length > 0) try {
			tags.push(`@example ${JSON.stringify(schema.examples[0])}`);
		} catch (_) {}
		if (description === "" && tags.length === 0) return "";
		if (description !== "" && tags.length === 0) return `${indent}/** ${description} */\n`;
		const lines = [`${indent}/**`];
		if (description !== "") lines.push(`${indent} * ${description}`);
		if (description !== "" && tags.length > 0) lines.push(`${indent} *`);
		for (const t of tags) lines.push(`${indent} * ${t}`);
		lines.push(`${indent} */`);
		return lines.join("\n") + "\n";
	}
	function toTypeScript(schema, opts) {
		const rootName = toTypeName((opts || {}).name || "Data");
		const defs = schema && (schema.$defs || schema.definitions);
		const defLines = [];
		if (defs && typeof defs === "object") for (const [defName, defSchema] of Object.entries(defs)) {
			const body = renderValueType(defSchema, defs, 0);
			defLines.push(`export type ${toTypeName(defName)} = ${body};`);
		}
		const rootType = renderValueType(schema, defs, 0);
		const rootDoc = renderJsDoc(schema, "");
		const rootDecl = rootType.startsWith("{") && rootType.endsWith("}") && !rootType.includes(" | ") ? `${rootDoc}export interface ${rootName} ${rootType}` : `${rootDoc}export type ${rootName} = ${rootType};`;
		return `// Auto-generated by ata-validator ${ATA_VERSION}, do not edit.
${defLines.length ? defLines.join("\n\n") + "\n\n" : ""}${rootDecl}

export interface ValidationError {
  keyword?: string;
  instancePath?: string;
  schemaPath?: string;
  params?: Record<string, unknown>;
  message?: string;
}

export interface ValidResult {
  valid: true;
  errors: readonly never[];
}
export interface InvalidResult {
  valid: false;
  errors: readonly ValidationError[];
}
export type Result = ValidResult | InvalidResult;

export declare function isValid(data: unknown): data is ${rootName};
export declare function validate(data: unknown): Result;
export declare const schemaHash: string;
export declare const ataVersion: string;
declare const _default: { validate: typeof validate; isValid: typeof isValid; schemaHash: typeof schemaHash; ataVersion: typeof ataVersion };
export default _default;
`;
	}
	module.exports = { toTypeScript };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/render-shared.js
var require_render_shared = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANSI = {
		reset: "\x1B[0m",
		bold: "\x1B[1m",
		dim: "\x1B[2m",
		red: "\x1B[31m",
		yellow: "\x1B[33m",
		cyan: "\x1B[36m"
	};
	const proc = typeof process !== "undefined" ? process : null;
	function resolveColor(opt) {
		if (opt === "never") return false;
		if (opt === "always") return true;
		if (proc === null) return false;
		const env = proc.env || {};
		if (env.NO_COLOR != null && env.NO_COLOR !== "") return false;
		const fc = env.FORCE_COLOR;
		if (fc === "1" || fc === "2" || fc === "3" || fc === "true") return true;
		return !!(proc.stdout && proc.stdout.isTTY);
	}
	function color(enabled, code, s) {
		return enabled ? code + s + ANSI.reset : s;
	}
	function pathToDotted(jsonPointer) {
		if (!jsonPointer || jsonPointer === "/") return "body";
		const parts = jsonPointer.replace(/^\//, "").split("/").map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let out = "body";
		for (const p of parts) if (/^[0-9]+$/.test(p)) out += "[" + p + "]";
		else if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(p)) out += "." + p;
		else out += "[" + JSON.stringify(p) + "]";
		return out;
	}
	function trimCwd(file, cwd) {
		if (!file) return file;
		const c = cwd || (proc !== null && typeof proc.cwd === "function" ? proc.cwd() : "");
		if (!c) return file;
		if (file.startsWith(c + "/")) return file.slice(c.length + 1);
		return file;
	}
	function truncateLine(text, maxWidth) {
		if (!text || text.length <= maxWidth) return text;
		return text.slice(0, maxWidth - 1) + "…";
	}
	function terminalWidth() {
		const w = proc !== null && proc.stdout && proc.stdout.columns;
		return typeof w === "number" && w > 0 ? w : 100;
	}
	module.exports = {
		ANSI,
		resolveColor,
		color,
		pathToDotted,
		trimCwd,
		truncateLine,
		terminalWidth
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/diagnose.js
var require_diagnose = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { correlateTypos } = require_correlate();
	const { buildDataPositionMap } = require_data_positions();
	const { pathToDotted } = require_render_shared();
	const { reprValue, expectedFor } = require_enrich_error();
	const MAX_SYNTHESIZED_BYTES = 262144;
	/**
	* Turn a validation error array into presentation-ready diagnostics.
	*
	* Pure: no I/O, no ANSI, no terminal width, deterministic for a given input.
	* That is deliberate. The merge below is the one place in this library that
	* can present two problems as one, so it has to be provable as data rather
	* than by grepping terminal output.
	*
	* @param {Array} errors validation errors, enriched or raw
	* @param {{text?: string, data?: any, positions?: object, schema?: object, mutatesInput?: boolean}} [source]
	* @returns {Array} diagnostics
	*/
	function toDiagnostics(errors, source) {
		if (!Array.isArray(errors) || errors.length === 0) return [];
		const src = source || {};
		const resolved = resolveFrames(src);
		const pairs = correlateTypos(errors);
		const diagnostics = [];
		const consumed = /* @__PURE__ */ new Set();
		for (let i = 0; i < errors.length; i++) {
			if (consumed.has(i)) continue;
			const e = errors[i];
			if (!e) continue;
			const partner = pairs === null ? void 0 : pairs.get(i);
			if (partner !== void 0 && !consumed.has(partner)) {
				consumed.add(i);
				consumed.add(partner);
				diagnostics.push(mergedDiagnostic(errors, i, partner, resolved, src));
				continue;
			}
			diagnostics.push(singleDiagnostic(e, i, resolved, src));
		}
		diagnostics.sort((a, b) => {
			if (a.sortPos !== b.sortPos) return a.sortPos - b.sortPos;
			if (a.rank !== b.rank) return a.rank - b.rank;
			return a.pointer < b.pointer ? -1 : a.pointer > b.pointer ? 1 : 0;
		});
		for (const d of diagnostics) delete d.sortPos;
		return diagnostics;
	}
	function resolveFrames(src) {
		const none = {
			positions: null,
			synthesized: false,
			refusal: null
		};
		if (src.positions) return {
			positions: src.positions,
			synthesized: false,
			refusal: null
		};
		if (src.text != null) try {
			return {
				positions: buildDataPositionMap(src.text),
				synthesized: false,
				refusal: null
			};
		} catch {
			return none;
		}
		if (src.data === void 0) return none;
		if (src.mutatesInput) return {
			positions: null,
			synthesized: false,
			refusal: "no frame; the value was modified in place before validation (coerceTypes, useDefaults or removeAdditional)"
		};
		let text;
		try {
			text = JSON.stringify(src.data, null, 2);
		} catch {
			return none;
		}
		if (typeof text !== "string") return none;
		if (text.length > MAX_SYNTHESIZED_BYTES) return {
			positions: null,
			synthesized: false,
			refusal: "no frame; the value is larger than 256 KB"
		};
		try {
			return {
				positions: buildDataPositionMap(text),
				synthesized: true,
				refusal: null
			};
		} catch {
			return none;
		}
	}
	function frameFor(err, resolved) {
		if (!resolved.positions) return frameFromError(err);
		const path = err.instancePath != null ? err.instancePath : err.path || "";
		const named = err.params && (err.params.additionalProperty || err.params.unevaluatedProperty) || null;
		const hit = named && resolved.positions[path + "/" + named] || resolved.positions[path];
		if (!hit) return null;
		const useKey = named != null && hit.keyOffset !== void 0;
		const col = useKey ? hit.keyCol : hit.col;
		const rawLen = useKey ? hit.keyLength : hit.length;
		const lineLen = (hit.text || "").length;
		const length = Math.max(1, Math.min(rawLen || 1, Math.max(1, lineLen - col + 1)));
		return {
			line: useKey ? hit.keyLine : hit.line,
			col,
			length,
			text: hit.text,
			spans: rawLen > length,
			synthesized: resolved.synthesized
		};
	}
	function frameFromError(err) {
		const df = err.dataFrame;
		if (!df || typeof df.line !== "number") return null;
		const a = err.anchor;
		const useKey = (err.params && (err.params.additionalProperty || err.params.unevaluatedProperty) || null) != null && a && a.keyLine !== void 0;
		const col = useKey ? a.keyCol : df.col;
		const rawLen = useKey ? a.keyLength : df.length;
		const lineLen = (df.text || "").length;
		const length = Math.max(1, Math.min(rawLen || 1, Math.max(1, lineLen - col + 1)));
		return {
			line: useKey ? a.keyLine : df.line,
			col,
			length,
			text: df.text,
			spans: rawLen > length,
			synthesized: false
		};
	}
	function headlineFor(err, src) {
		const p = err.params || {};
		switch (err.keyword) {
			case "additionalProperties": return `unknown property "${p.additionalProperty}"`;
			case "unevaluatedProperties": return `unevaluated property "${p.unevaluatedProperty}"`;
			case "required": return `missing required property "${p.missingProperty}"`;
			case "oneOf":
			case "anyOf": {
				const disc = discriminatorFor(err, src);
				if (disc) return `no variant matches ${disc.key} ${JSON.stringify(disc.value)}`;
				return err.detail || err.message || "no variant matched";
			}
			default: return err.detail || err.message || "validation failed";
		}
	}
	function discriminatorFor(err, src) {
		const schema = src.schema;
		const data = src.data;
		if (!schema || !data || typeof data !== "object") return null;
		const branches = branchesAt(schema, err.schemaPath, err.keyword);
		if (!Array.isArray(branches) || branches.length < 2) return null;
		const first = branches[0] && branches[0].properties;
		if (!first) return null;
		for (const key of Object.keys(first)) {
			const values = [];
			let ok = true;
			for (const b of branches) {
				const prop = b && b.properties && b.properties[key];
				if (!prop || prop.const === void 0) {
					ok = false;
					break;
				}
				if (values.includes(prop.const)) {
					ok = false;
					break;
				}
				values.push(prop.const);
			}
			if (!ok) continue;
			const actual = data[key];
			if (actual === void 0) continue;
			return {
				key,
				value: actual
			};
		}
		return null;
	}
	function decorateBranches(subs, src) {
		return subs.map((sub) => {
			if (!sub || typeof sub !== "object") return sub;
			const copy = Object.assign({}, sub);
			const exp = expectedFor(sub);
			if (exp !== void 0) copy.expected = exp;
			if (copy.received === void 0) {
				const got = valueAt(src.data, sub.instancePath);
				if (got !== null) copy.received = got;
			}
			if (Array.isArray(sub.branchErrors)) copy.branchErrors = decorateBranches(sub.branchErrors, src);
			return copy;
		});
	}
	function valueAt(data, pointer) {
		if (data === void 0 || typeof pointer !== "string") return null;
		if (pointer === "") return reprValue(data);
		let cur = data;
		for (const seg of pointer.split("/").slice(1)) {
			if (cur == null || typeof cur !== "object") return null;
			cur = cur[seg.replace(/~1/g, "/").replace(/~0/g, "~")];
		}
		return cur === void 0 ? null : reprValue(cur);
	}
	function branchesAt(schema, schemaPath, keyword) {
		if (typeof schemaPath !== "string" || !schemaPath.startsWith("#")) return schema[keyword];
		const parts = schemaPath.slice(1).split("/").filter(Boolean).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let cur = schema;
		for (const part of parts) {
			if (cur == null || typeof cur !== "object") return null;
			cur = cur[part];
		}
		return Array.isArray(cur) ? cur : null;
	}
	function singleDiagnostic(e, index, resolved, src) {
		const pointer = e.instancePath != null ? e.instancePath : e.path || "";
		const closest = e.branchErrors && e.branchErrors.length ? e.branchErrors[0] : null;
		const anchorErr = closest && closest.instancePath ? closest : e;
		const frame = frameFor(anchorErr, resolved);
		let found = e.received != null ? e.received : null;
		if (anchorErr !== e) found = closest.received != null ? closest.received : valueAt(src.data, closest.instancePath);
		const notes = [];
		if (!frame && resolved.refusal) notes.push(resolved.refusal);
		if (frame && frame.spans) notes.push("value continues past the end of this line");
		if (e.docUrl) notes.push("see " + e.docUrl);
		return {
			code: e.code,
			headline: headlineFor(e, src),
			pointer,
			dotted: pathToDotted(anchorErr.instancePath != null ? anchorErr.instancePath : pointer),
			frame,
			found,
			help: e.suggestion ? e.suggestion.text : null,
			notes,
			branchErrors: e.branchErrors ? decorateBranches(e.branchErrors, src) : null,
			mergedFrom: [e],
			rank: typeof e.rank === "number" ? e.rank : 2,
			sortPos: frame ? frame.line * 1e5 + frame.col : index
		};
	}
	function mergedDiagnostic(errors, i, j, resolved, src) {
		const a = errors[i];
		const b = errors[j];
		const missing = a.keyword === "required" ? a : b;
		const extra = a.keyword === "required" ? b : a;
		const missingName = missing.params.missingProperty;
		const extraName = extra.params.additionalProperty;
		const frame = frameFor(extra, resolved);
		const notes = [];
		if (!frame && resolved.refusal) notes.push(resolved.refusal);
		const docUrl = missing.docUrl || extra.docUrl;
		if (docUrl) notes.push("see " + docUrl);
		const pointer = missing.instancePath != null ? missing.instancePath : missing.path || "";
		return {
			code: missing.code,
			headline: `unknown property "${extraName}"`,
			pointer,
			dotted: pathToDotted(pointer),
			frame,
			found: null,
			help: `did you mean "${missingName}"?`,
			notes,
			branchErrors: null,
			mergedFrom: [missing, extra],
			rank: 0,
			sortPos: frame ? frame.line * 1e5 + frame.col : Math.min(i, j)
		};
	}
	module.exports = { toDiagnostics };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/render-pretty.js
var require_render_pretty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { color, ANSI, resolveColor, trimCwd, truncateLine, terminalWidth } = require_render_shared();
	const { toDiagnostics } = require_diagnose();
	const { getDiagnosticSource } = require_diagnostic_source();
	function sourceFor(errors, opts) {
		const carried = getDiagnosticSource(errors) || {};
		if (opts.data !== void 0) return Object.assign({}, carried, { data: opts.data });
		return carried;
	}
	function caretLine(col, length, gutter) {
		const pad = " ".repeat(gutter);
		const lead = " ".repeat(Math.max(0, col - 1));
		const carets = "^".repeat(Math.max(1, Math.min(length || 1, terminalWidth())));
		return pad + "| " + lead + carets;
	}
	const NO_SUFFIX = /* @__PURE__ */ new Set([
		"additionalProperties",
		"unevaluatedProperties",
		"unevaluatedItems",
		"dependentRequired",
		"propertyNames",
		"oneOf",
		"anyOf",
		"allOf",
		"not"
	]);
	function caretSuffix(d, raw, useColor) {
		if (!raw) return "";
		if (raw.keyword === "required") return raw.expected ? "  " + color(useColor, ANSI.dim, `expected ${raw.expected}`) : "";
		if (d.found != null && (raw.keyword === "oneOf" || raw.keyword === "anyOf")) return "  " + color(useColor, ANSI.dim, `found ${d.found}`);
		if (NO_SUFFIX.has(raw.keyword)) return "";
		return d.found != null ? "  " + color(useColor, ANSI.dim, `found ${d.found}`) : "";
	}
	function renderOne(d, useColor, opts) {
		const lines = [];
		const width = terminalWidth();
		const bar = (line) => " ".repeat(Math.max(3, String(line).length + 1)) + "|";
		const src = (line, text) => String(line).padStart(Math.max(2, String(line).length)) + " | " + text;
		const label = d.code ? `error[${d.code}]: ` : "error: ";
		lines.push(color(useColor, ANSI.red + ANSI.bold, label) + d.headline);
		const raw = d.mergedFrom[0];
		if (raw && raw.schemaSource) {
			const f = trimCwd(raw.schemaSource.file, opts.cwd);
			lines.push(`  --> ${color(useColor, ANSI.cyan, `${f}:${raw.schemaSource.line}:${raw.schemaSource.col}`)}`);
			const sl = raw.schemaSource.line;
			lines.push(bar(sl));
			lines.push(src(sl, truncateLine(raw.schemaSource.text, width - 8)));
			const inlineHint = raw.expected ? "  " + color(useColor, ANSI.dim, `expected ${raw.expected}`) : "";
			lines.push(caretLine(raw.schemaSource.col, 1, bar(sl).length - 1) + inlineHint);
			lines.push(bar(sl));
		}
		if (d.frame) {
			const where = `input:${d.frame.line}:${d.frame.col}`;
			lines.push(`  --> ${color(useColor, ANSI.cyan, where)}  ${color(useColor, ANSI.dim, "(" + d.dotted + ")")}`);
			const fl = d.frame.line;
			lines.push(bar(fl));
			lines.push(src(fl, truncateLine(d.frame.text, width - 8)));
			lines.push(caretLine(d.frame.col, d.frame.length, bar(fl).length - 1) + caretSuffix(d, raw, useColor));
			lines.push(bar(fl));
		} else lines.push(`  --> ${color(useColor, ANSI.cyan, "at " + d.dotted)}`);
		if (d.help) lines.push("   = " + color(useColor, ANSI.yellow, "help: ") + d.help);
		if (d.branchErrors && d.branchErrors.length) {
			const variant = raw && raw.params && raw.params.closestName || "closest variant";
			const n = d.branchErrors.length;
			lines.push("   = " + color(useColor, ANSI.dim, "note: ") + `closest match was ${variant} with ${n} error${n === 1 ? "" : "s"}:`);
			renderBranchErrors(d.branchErrors, 1, lines, useColor);
		}
		for (const note of d.notes) lines.push("   = " + color(useColor, ANSI.dim, "note: ") + note);
		return lines.join("\n");
	}
	function renderBranchErrors(subs, depth, lines, useColor) {
		if (depth >= 3) {
			lines.push("       " + color(useColor, ANSI.dim, "... deeper branch errors omitted, see structured output"));
			return;
		}
		const max = 3;
		const shown = subs.slice(0, max);
		for (const sub of shown) {
			let text = sub.message || "";
			if (sub.expected !== void 0) text = `expected ${sub.expected}` + (sub.received !== void 0 ? `, found ${sub.received}` : "");
			lines.push("       " + color(useColor, ANSI.dim, `${sub.keyword}: ${text}`));
			if (sub.branchErrors && sub.branchErrors.length) renderBranchErrors(sub.branchErrors, depth + 1, lines, useColor);
		}
		if (subs.length > max) lines.push("       " + color(useColor, ANSI.dim, `... and ${subs.length - max} more`));
	}
	function renderPretty(errors, opts) {
		if (!Array.isArray(errors) || errors.length === 0) return "";
		opts = opts || {};
		const useColor = resolveColor(opts.color || "auto");
		const maxErrors = opts.maxErrors != null ? opts.maxErrors : 20;
		const context = opts.context || "input";
		const diags = toDiagnostics(errors, sourceFor(errors, opts));
		const blocks = [];
		const limit = maxErrors === 0 ? diags.length : Math.min(maxErrors, diags.length);
		for (let i = 0; i < limit; i++) blocks.push(renderOne(diags[i], useColor, opts));
		let out = blocks.join("\n\n");
		if (limit < diags.length) out += `\n\n... and ${diags.length - limit} more errors (run with --pretty --max-errors=0 to see all)`;
		const n = errors.length;
		const shown = diags.length;
		let summary = `${n} schema violation${n === 1 ? "" : "s"} in ${context}`;
		if (shown !== n) summary += `, shown as ${shown} diagnostic${shown === 1 ? "" : "s"}`;
		out += "\n\n" + color(useColor, ANSI.red + ANSI.bold, "error: ") + summary;
		if (diags.some((d) => d.frame && d.frame.synthesized)) out += "\n" + color(useColor, ANSI.dim, "note: frames were reconstructed from the value, not from your input text; line numbers refer to that reconstruction");
		return out;
	}
	module.exports = { renderPretty };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/render-compact.js
var require_render_compact = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { color, ANSI, resolveColor, trimCwd } = require_render_shared();
	const { toDiagnostics } = require_diagnose();
	const { getDiagnosticSource } = require_diagnostic_source();
	function renderCompact(errors, opts) {
		if (!Array.isArray(errors) || errors.length === 0) return "";
		opts = opts || {};
		const useColor = resolveColor(opts.color || "auto");
		const cwd = opts.cwd;
		const carried = getDiagnosticSource(errors) || {};
		const source = opts.data !== void 0 ? Object.assign({}, carried, { data: opts.data }) : carried;
		const diags = toDiagnostics(errors, source);
		const lines = [];
		for (const d of diags) {
			let prefix = "";
			const raw = d.mergedFrom[0];
			if (raw && raw.schemaSource) {
				const f = trimCwd(raw.schemaSource.file, cwd);
				prefix = color(useColor, ANSI.cyan, `${f}:${raw.schemaSource.line}:${raw.schemaSource.col}`) + " - ";
			}
			const codeStr = color(useColor, ANSI.red + ANSI.bold, d.code ? `error ${d.code}` : "error");
			const pathStr = color(useColor, ANSI.cyan, d.dotted);
			const got = raw && raw.received != null ? `got ${raw.received}` : "";
			const sugg = d.help ? color(useColor, ANSI.yellow, `, ${d.help}`) : "";
			const tail = got || sugg ? ` (${got}${sugg})` : "";
			lines.push(`${prefix}${codeStr}: ${pathStr} ${d.headline}${tail}`);
		}
		const n = errors.length;
		const shown = diags.length;
		lines.push("");
		let summary = `Found ${n} error${n === 1 ? "" : "s"} in ${opts.context || "input"}`;
		if (shown !== n) summary += `, shown as ${shown} diagnostic${shown === 1 ? "" : "s"}`;
		lines.push(summary + ".");
		if (!(typeof process !== "undefined" && process.stdout && process.stdout.isTTY)) lines.push("(run with --pretty for source frames)");
		return lines.join("\n");
	}
	module.exports = { renderCompact };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/output-format.js
var require_output_format = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const METADATA_KEYWORDS = [
		"title",
		"description",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly",
		"examples",
		"format",
		"contentEncoding",
		"contentMediaType",
		"contentSchema"
	];
	function pointerSegment(s) {
		return String(s).replace(/~/g, "~0").replace(/\//g, "~1");
	}
	function baseUri(schema) {
		if (schema && typeof schema === "object" && typeof schema.$id === "string") return schema.$id.split("#")[0];
		return null;
	}
	function unitFor(error, base) {
		const keywordLocation = typeof error.schemaPath === "string" && error.schemaPath.charAt(0) === "#" ? error.schemaPath.slice(1) : error.schemaPath || "";
		const unit = {
			valid: false,
			keywordLocation,
			instanceLocation: error.instancePath || ""
		};
		if (base) unit.absoluteKeywordLocation = base + "#" + keywordLocation;
		if (typeof error.message === "string") unit.error = error.message;
		return unit;
	}
	function collectAnnotations(schema, data, keywordLocation, instanceLocation, base, out, isValid, depth) {
		if (schema === true || schema === false || schema === null || typeof schema !== "object" || depth > 64) return;
		for (const kw of METADATA_KEYWORDS) if (Object.prototype.hasOwnProperty.call(schema, kw)) {
			const unit = {
				valid: true,
				keywordLocation: keywordLocation + "/" + kw,
				instanceLocation,
				annotation: schema[kw]
			};
			if (base) unit.absoluteKeywordLocation = base + "#" + keywordLocation + "/" + kw;
			out.push(unit);
		}
		const down = (sub, kwSeg, value, instSeg) => collectAnnotations(sub, value, keywordLocation + kwSeg, instanceLocation + (instSeg || ""), base, out, isValid, depth + 1);
		if (schema.properties && data !== null && typeof data === "object" && !Array.isArray(data)) {
			for (const key of Object.keys(schema.properties)) if (Object.prototype.hasOwnProperty.call(data, key)) down(schema.properties[key], "/properties/" + pointerSegment(key), data[key], "/" + pointerSegment(key));
		}
		if (Array.isArray(schema.prefixItems) && Array.isArray(data)) for (let i = 0; i < schema.prefixItems.length && i < data.length; i++) down(schema.prefixItems[i], "/prefixItems/" + i, data[i], "/" + i);
		if (schema.items && typeof schema.items === "object" && Array.isArray(data)) {
			const start = Array.isArray(schema.prefixItems) ? schema.prefixItems.length : 0;
			for (let i = start; i < data.length; i++) down(schema.items, "/items", data[i], "/" + i);
		}
		if (Array.isArray(schema.allOf)) for (let i = 0; i < schema.allOf.length; i++) down(schema.allOf[i], "/allOf/" + i, data, "");
		for (const kw of ["anyOf", "oneOf"]) if (Array.isArray(schema[kw])) {
			for (let i = 0; i < schema[kw].length; i++) if (isValid(schema[kw][i], data)) down(schema[kw][i], "/" + kw + "/" + i, data, "");
		}
		if (schema.if !== void 0) {
			const taken = isValid(schema.if, data);
			if (taken && schema.then !== void 0) down(schema.then, "/then", data, "");
			if (!taken && schema.else !== void 0) down(schema.else, "/else", data, "");
		}
	}
	function toOutput(validator, data, opts) {
		const format = opts && opts.format || "basic";
		const result = validator.validate(data);
		if (format === "flag") return { valid: result.valid };
		if (format !== "basic") throw new Error(`toOutput: unsupported format "${format}". Supported: "flag", "basic".`);
		const schema = validator._schemaObj !== void 0 ? validator._schemaObj : validator._rawSchema;
		const base = baseUri(schema);
		const out = { valid: result.valid };
		if (!result.valid) {
			const errors = [];
			for (const e of result.errors) errors.push(unitFor(e, base));
			out.errors = errors;
			return out;
		}
		const annotations = [];
		const isValid = (sub, value) => {
			try {
				return new validator.constructor(sub).isValidObject(value);
			} catch {
				return false;
			}
		};
		collectAnnotations(schema, data, "", "", base, annotations, isValid, 0);
		if (annotations.length) out.annotations = annotations;
		return out;
	}
	module.exports = {
		toOutput,
		METADATA_KEYWORDS
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/retry-message.js
var require_retry_message = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function phrase(error) {
		const p = error.params || {};
		if (error.keyword === "multipleOf" && typeof p.multipleOf === "number") {
			const m = p.multipleOf;
			if (m > 0 && m < 1) {
				const places = Math.round(Math.log10(1 / m));
				if (Math.abs(Math.pow(10, -places) - m) < Number.EPSILON * 8) return `must be rounded to ${places} decimal place${places === 1 ? "" : "s"}`;
			}
		}
		return null;
	}
	function line(error) {
		const where = error.instancePath || error.path || "";
		const body = phrase(error) || (typeof error.detail === "string" && error.detail ? error.detail : error.message);
		const raw = error.received === void 0 || error.received === null ? "" : String(error.received);
		const head = raw.charAt(0);
		const received = head === "[" && /^\[(object|array)\b/.test(raw) || head === "{" || head === "[" && raw.charAt(raw.length - 1) === "]" ? "" : raw;
		const got = received && body && !body.includes(received) ? `, got ${received}` : "";
		return `${where || "/"}: ${body}${got}`;
	}
	function toRetryMessage(errors, opts) {
		if (!errors || typeof errors.length !== "number" || errors.length === 0) return "";
		const limit = opts && typeof opts.limit === "number" ? opts.limit : 20;
		const shown = errors.length > limit ? Array.prototype.slice.call(errors, 0, limit) : errors;
		const lines = [];
		for (let i = 0; i < shown.length; i++) lines.push(line(shown[i]));
		if (errors.length > shown.length) lines.push(`and ${errors.length - shown.length} more`);
		return lines.join("\n");
	}
	module.exports = { toRetryMessage };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/describe-schema.js
var require_describe_schema = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const MAX_DEPTH = 12;
	function lit(v) {
		try {
			return JSON.stringify(v);
		} catch (_) {
			return String(v);
		}
	}
	function resolveRef(schema, defs) {
		const m = typeof schema.$ref === "string" && schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
		if (m && defs && defs[m[1]]) return defs[m[1]];
		return null;
	}
	function constraintsOf(s) {
		const out = [];
		if (Array.isArray(s.enum)) out.push("one of " + s.enum.map(lit).join(", "));
		else if (s.const !== void 0) out.push("exactly " + lit(s.const));
		else if (s.type) out.push(Array.isArray(s.type) ? s.type.join(" or ") : s.type);
		if (typeof s.format === "string") out.push(s.format + " format");
		if (typeof s.pattern === "string") out.push("matching " + s.pattern);
		const range = (min, max, unit) => {
			if (min !== void 0 && max !== void 0) out.push(`${min} to ${max}${unit}`);
			else if (min !== void 0) out.push(`at least ${min}${unit}`);
			else if (max !== void 0) out.push(`at most ${max}${unit}`);
		};
		range(s.minLength, s.maxLength, " characters");
		range(s.minimum, s.maximum, "");
		range(s.minItems, s.maxItems, " items");
		if (s.exclusiveMinimum !== void 0) out.push("greater than " + s.exclusiveMinimum);
		if (s.exclusiveMaximum !== void 0) out.push("less than " + s.exclusiveMaximum);
		if (typeof s.multipleOf === "number") out.push(multipleOfPhrase(s.multipleOf));
		if (s.uniqueItems === true) out.push("all items different");
		if (typeof s.description === "string" && s.description) out.push(s.description);
		return out;
	}
	function multipleOfPhrase(m) {
		if (m > 0 && m < 1) {
			const places = Math.round(Math.log10(1 / m));
			if (Math.abs(Math.pow(10, -places) - m) < Number.EPSILON * 8) return `rounded to ${places} decimal place${places === 1 ? "" : "s"}`;
		}
		return "a multiple of " + m;
	}
	function isObjectSchema(s) {
		return s && typeof s === "object" && s.properties && typeof s.properties === "object";
	}
	function describeObjectBody(schema, depth, defs, lines) {
		const pad = "  ".repeat(depth);
		const required = new Set(Array.isArray(schema.required) ? schema.required : []);
		for (const [key, sub] of Object.entries(schema.properties)) describeNode(sub, key + (required.has(key) ? "" : " (optional)"), depth, defs, lines);
		for (const key of required) if (!(key in schema.properties)) lines.push(`${pad}${key}: required, any`);
		if (schema.additionalProperties === false) lines.push(`${pad}no other fields`);
	}
	function describeNode(schema, label, depth, defs, lines) {
		const pad = "  ".repeat(depth);
		if (schema === true || schema === void 0) {
			lines.push(`${pad}${label}: any`);
			return;
		}
		if (schema === false) {
			lines.push(`${pad}${label}: nothing is allowed here`);
			return;
		}
		if (typeof schema !== "object" || schema === null || depth > MAX_DEPTH) {
			lines.push(`${pad}${label}: any`);
			return;
		}
		const target = schema.$ref ? resolveRef(schema, defs) : null;
		if (target) {
			describeNode(target, label, depth, defs, lines);
			return;
		}
		if (Array.isArray(schema.allOf) && schema.allOf.length) {
			const merged = Object.assign({}, schema);
			delete merged.allOf;
			for (const part of schema.allOf) {
				const resolved = part && part.$ref ? resolveRef(part, defs) || part : part;
				if (resolved && typeof resolved === "object") Object.assign(merged, resolved, {
					properties: Object.assign({}, merged.properties, resolved.properties),
					required: [].concat(merged.required || [], resolved.required || [])
				});
			}
			if (!merged.properties) delete merged.properties;
			if (!merged.required || !merged.required.length) delete merged.required;
			describeNode(merged, label, depth, defs, lines);
			return;
		}
		const alternatives = schema.oneOf || schema.anyOf;
		if (Array.isArray(alternatives) && alternatives.length) {
			lines.push(`${pad}${label}: one of the following shapes`);
			alternatives.forEach((alt, i) => describeNode(alt, `option ${i + 1}`, depth + 1, defs, lines));
			return;
		}
		if (isObjectSchema(schema)) {
			const own = constraintsOf(schema).filter((c) => c !== "object");
			lines.push(`${pad}${label}: object${own.length ? ` (${own.join(", ")})` : ""}`);
			describeObjectBody(schema, depth + 1, defs, lines);
			return;
		}
		const rawItems = schema.items;
		if (schema.type === "array" && rawItems && typeof rawItems === "object") {
			const items = rawItems.$ref ? resolveRef(rawItems, defs) || rawItems : rawItems;
			const own = constraintsOf(schema).filter((c) => c !== "array");
			const bounds = own.length ? ` (${own.join(", ")})` : "";
			if (isObjectSchema(items)) {
				lines.push(`${pad}${label}: array${bounds}, each item is an object:`);
				describeObjectBody(items, depth + 1, defs, lines);
				return;
			}
			if (items.oneOf || items.anyOf || items.allOf) {
				lines.push(`${pad}${label}: array${bounds}, each item is:`);
				describeNode(items, "item", depth + 1, defs, lines);
				return;
			}
			const inner = constraintsOf(items).join(", ") || "any";
			lines.push(`${pad}${label}: array${bounds} of ${inner}`);
			return;
		}
		lines.push(`${pad}${label}: ${constraintsOf(schema).join(", ") || "any"}`);
	}
	function describeSchema(schema, opts) {
		const name = opts && opts.name || "output";
		const defs = schema && (schema.$defs || schema.definitions) || null;
		const lines = [];
		describeNode(schema, name, 0, defs, lines);
		return lines.join("\n");
	}
	module.exports = { describeSchema };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/render-json.js
var require_render_json = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function renderJSON(errors, opts) {
		opts = opts || {};
		const payload = {
			errors: Array.isArray(errors) ? errors : [],
			summary: {
				count: Array.isArray(errors) ? errors.length : 0,
				context: opts.context || "input"
			}
		};
		return opts.pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload);
	}
	module.exports = { renderJSON };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/index.js
var require_ata_validator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const core = require_validator_core();
	const jsCompiler = require_js_compiler();
	const { compileToJS, compileToJSCodegen } = jsCompiler;
	var TextRejection = class {
		constructor(text, validateText) {
			this.valid = false;
			this._text = text;
			this._validateText = validateText;
			this._errors = null;
		}
		get errors() {
			if (this._errors === null) this._errors = core._internals._mustReject(this._validateText(this._text)).errors;
			return this._errors;
		}
	};
	const { needsOrdering: _needsOrdering, sortErrorsBySchemaOrder: _sortErrors, attachRelated: _attachRelated } = require_rejections();
	let _enrichFnIdx = null;
	function _enrichOne(e, data) {
		if (_enrichFnIdx === null) _enrichFnIdx = require_enrich_error().enrich;
		return _enrichFnIdx(e, data !== void 0 ? { data } : null);
	}
	function richBuilder(combRich, root, presentFallback, fallback, plain, cleanPlain) {
		if (plain) return (data) => {
			const r = combRich(data);
			if (r.valid || !r.errors || !r.errors.length) return presentFallback(fallback, data);
			if (cleanPlain) return _needsOrdering(r.errors) ? _sortErrors(root, r.errors) : r.errors;
			return presentFallback(r.errors, data);
		};
		return (data) => {
			const r = combRich(data);
			if (r.valid || !r.errors || !r.errors.length) return presentFallback(fallback, data);
			const out = _needsOrdering(r.errors) ? _sortErrors(root, r.errors) : r.errors;
			for (let i = 0; i < out.length; i++) if (out[i].docUrl === void 0) out[i] = _enrichOne(out[i], data);
			if (out.length > 1) _attachRelated(out);
			return out;
		};
	}
	var EagerRejection = class {
		constructor(errors) {
			this.valid = false;
			this.errors = errors;
		}
		toJSON() {
			return {
				valid: false,
				errors: this.errors
			};
		}
		_ataRaw() {
			return this.errors;
		}
	};
	function installCodegenPaths(ctx) {
		const { ABORT_EARLY_RESULT, HYBRID_TIER_CALLS, SIMDJSON_THRESHOLD, VALID_RESULT, _bindVerdict, _jsonSyntaxRejection, _mustReject, _verboseWrap, getNative, isV1Dialect, resolveSchemaByPath } = core._internals;
		const { jsFn, _isCodegen, preprocess, fusedRemove, options, schemaObj, useSimdjsonForLarge, _buildCombined, _buildErr } = ctx;
		const hasDynRef = this._schemaStr.includes("\"$dynamicRef\"") || this._schemaStr.includes("\"$dynamicAnchor\"");
		let _interp = null;
		const jsOnlyFallback = (d) => {
			if (jsFn(d)) return {
				valid: true,
				data: d,
				errors: []
			};
			if (!_interp) {
				const { createInterpreter } = require_interpreter();
				_interp = createInterpreter(schemaObj, {
					schemaMap: this._schemaMap.size > 0 ? this._schemaMap : null,
					formats: this._userFormats,
					v1: isV1Dialect(schemaObj),
					keywords: this._keywords
				});
			}
			const r = _interp.validate(d);
			if (!r.valid) return r;
			return {
				valid: false,
				errors: [{
					keyword: "validation",
					instancePath: "",
					schemaPath: "",
					params: {},
					message: "schema validation failed"
				}]
			};
		};
		let _errOnlyImpl = null;
		const errOnly = (d) => {
			if (_errOnlyImpl === null) {
				_buildErr();
				let safe = null;
				if (ctx.err()) try {
					ctx.err()({}, true);
					safe = (x) => ctx.err()(x, true);
				} catch {}
				_errOnlyImpl = safe || jsOnlyFallback;
			}
			return _mustReject(_errOnlyImpl(d));
		};
		let _combinedProbed = false;
		let _safeCombined = null;
		const combinedIfSafe = () => {
			if (_combinedProbed) return _safeCombined;
			_combinedProbed = true;
			_buildCombined();
			if (ctx.combined()) try {
				const probe = {};
				if (schemaObj && schemaObj.properties) for (const k of Object.keys(schemaObj.properties)) probe[k] = "";
				if (schemaObj && schemaObj.if && schemaObj.if.properties) for (const k of Object.keys(schemaObj.if.properties)) probe[k] = "";
				ctx.combined()(probe);
				ctx.combined()({});
				ctx.combined()(null);
				ctx.combined()(0);
				_safeCombined = ctx.combined();
			} catch {}
			return _safeCombined;
		};
		const errFnIfSafe = () => {
			_buildErr();
			const efn = ctx.err();
			if (!efn) return null;
			try {
				efn({}, true);
			} catch {
				return null;
			}
			return (x) => efn(x, true);
		};
		let _richProbed = false;
		let _safeRich = null;
		const richIfSafe = () => {
			if (_richProbed) return _safeRich;
			_richProbed = true;
			if (!combinedIfSafe() || !ctx.buildRich) return null;
			const fn = ctx.buildRich();
			if (fn) try {
				const probe = {};
				if (schemaObj && schemaObj.properties) for (const k of Object.keys(schemaObj.properties)) probe[k] = "";
				if (schemaObj && schemaObj.if && schemaObj.if.properties) for (const k of Object.keys(schemaObj.if.properties)) probe[k] = "";
				fn(probe);
				fn({});
				fn(null);
				fn(0);
				_safeRich = fn;
			} catch {}
			return _safeRich;
		};
		let _errPreferredImpl = null;
		const errPreferCombined = (d) => {
			if (_errPreferredImpl === null) _errPreferredImpl = combinedIfSafe() || errOnly;
			return _mustReject(_errPreferredImpl(d));
		};
		if (!hasDynRef || _isCodegen) this._fastVerdict = preprocess ? null : jsFn;
		if (options.abortEarly && jsFn && !hasDynRef) {
			const _fn = jsFn;
			this.validate = preprocess ? (data) => {
				preprocess(data);
				return _fn(data) ? VALID_RESULT : ABORT_EARLY_RESULT;
			} : (data) => _fn(data) ? VALID_RESULT : ABORT_EARLY_RESULT;
		} else if (hasDynRef && _isCodegen && jsFn) {
			const _fn = jsFn, _efn = errOnly, _R = VALID_RESULT;
			this.validate = preprocess ? (data) => {
				preprocess(data);
				return _fn(data) ? _R : _efn(data);
			} : (data) => _fn(data) ? _R : _efn(data);
		} else if (hasDynRef) {
			if (!_interp) {
				const { createInterpreter } = require_interpreter();
				_interp = createInterpreter(schemaObj, {
					schemaMap: this._schemaMap.size > 0 ? this._schemaMap : null,
					formats: this._userFormats,
					v1: isV1Dialect(schemaObj),
					keywords: this._keywords
				});
			}
			const interp = _interp;
			this._fastVerdict = preprocess ? null : (d) => interp.isValid(d);
			this.validate = preprocess ? (data) => {
				preprocess(data);
				return interp.validate(data);
			} : (data) => interp.validate(data);
		} else if (jsFn && jsFn._hybridFactory) {
			let impl = null;
			const onReject = (data) => {
				const combined = combinedIfSafe();
				if (combined) {
					impl = combined;
					return _mustReject(combined(data));
				}
				return errOnly(data);
			};
			let warm = 0;
			const first = (data) => {
				if (++warm >= HYBRID_TIER_CALLS && impl === first) {
					impl = jsFn._hybridFactory(VALID_RESULT, onReject) || ((d) => jsFn(d) ? VALID_RESULT : onReject(d));
					return impl(data);
				}
				return jsFn(data) ? VALID_RESULT : onReject(data);
			};
			impl = first;
			const run = (data) => impl(data);
			this.validate = preprocess ? (data) => {
				preprocess(data);
				return run(data);
			} : run;
			if (!preprocess) ctx.rejectBase = onReject;
			if (!preprocess) {
				ctx.richBuilder = richBuilder;
				ctx.oneShotRich = ctx.buildRich ? richIfSafe : () => combinedIfSafe() || errFnIfSafe();
				ctx.oneShotPlain = !ctx.buildRich;
				ctx.isCleanShape = (fn) => fn !== null && fn === _safeCombined;
				ctx.isCombined = (fn) => fn !== null && fn === _safeCombined;
				ctx.onePassOf = (empty, fallback) => {
					const sort = (errs) => _needsOrdering(errs) ? _sortErrors(schemaObj, errs) : errs;
					try {
						const fn = jsCompiler.compileToJSCombined(schemaObj, VALID_RESULT, this._schemaMap.size > 0 ? this._schemaMap : null, this._userFormats, {
							runtimeShape: true,
							resultShape: {
								Rejection: EagerRejection,
								empty,
								sort,
								fallback,
								verdict: jsFn
							}
						});
						if (!fn) return null;
						fn({});
						fn(null);
						fn(0);
						return fn;
					} catch {
						return null;
					}
				};
			}
		} else {
			const safeCombinedFn = combinedIfSafe();
			if (safeCombinedFn) {
				this.validate = preprocess ? (data) => {
					preprocess(data);
					return safeCombinedFn(data);
				} : safeCombinedFn;
				if (!preprocess) ctx.rejectBase = (data) => _mustReject(safeCombinedFn(data));
			} else {
				this.validate = preprocess ? (data) => {
					preprocess(data);
					return jsFn(data) ? VALID_RESULT : errOnly(data);
				} : (data) => jsFn(data) ? VALID_RESULT : errOnly(data);
				if (!preprocess) ctx.rejectBase = errOnly;
			}
		}
		if (this._verbose) {
			ctx.rejectBase = null;
			ctx.oneShotRich = null;
			this.validate = _verboseWrap(this.validate, this._schemaObj);
		}
		_bindVerdict(this, fusedRemove ? (data) => fusedRemove(data) || (preprocess(data), jsFn(data)) : preprocess ? (data) => {
			preprocess(data);
			return jsFn(data);
		} : jsFn);
		let jsonHybrid = null;
		let jsonWarm = 0;
		const jsonValidateTiered = (obj) => {
			if (jsonHybrid !== null) return jsonHybrid(obj);
			if (++jsonWarm >= HYBRID_TIER_CALLS) {
				jsonHybrid = jsFn._hybridFactory && jsFn._hybridFactory(VALID_RESULT, errPreferCombined) || ((o) => jsFn(o) ? VALID_RESULT : errPreferCombined(o));
				return jsonHybrid(obj);
			}
			return jsFn(obj) ? VALID_RESULT : errPreferCombined(obj);
		};
		const jsonValidateInner = options.abortEarly ? (obj) => jsFn(obj) ? VALID_RESULT : ABORT_EARLY_RESULT : jsonValidateTiered;
		const jsonValidateFn = preprocess ? (obj) => {
			preprocess(obj);
			return jsonValidateInner(obj);
		} : jsonValidateInner;
		let nativeText;
		const nativeVerdict = (jsonStr) => {
			if (nativeText === void 0) {
				nativeText = !!getNative() && !require_buffer_gate_browser().bufferNeedsSlowPath(schemaObj, this._schemaMap, this._keywords);
				if (nativeText) {
					this._ensureNative();
					if (!(this._fastSlot >= 0)) nativeText = false;
				}
			}
			return nativeText ? getNative().rawFastValidate(this._fastSlot, Buffer.from(jsonStr)) : void 0;
		};
		const validateText = (jsonStr) => {
			let obj;
			try {
				obj = JSON.parse(jsonStr);
			} catch (e) {
				if (!(e instanceof SyntaxError)) throw e;
				return _jsonSyntaxRejection(e);
			}
			this._lastParsed = obj;
			return jsonValidateFn(obj);
		};
		this.validateJSON = useSimdjsonForLarge && !preprocess ? (jsonStr) => {
			if (jsonStr.length >= SIMDJSON_THRESHOLD && this._skipNativeFast !== true) {
				const ok = nativeVerdict(jsonStr);
				if (ok === true) return VALID_RESULT;
				if (ok === false) return options.abortEarly ? ABORT_EARLY_RESULT : new TextRejection(jsonStr, validateText);
			}
			return validateText(jsonStr);
		} : validateText;
		const verdictFromText = (jsonStr) => {
			let parsed;
			try {
				parsed = JSON.parse(jsonStr);
			} catch (e) {
				if (!(e instanceof SyntaxError)) throw e;
				return false;
			}
			if (preprocess) preprocess(parsed);
			return jsFn(parsed);
		};
		this.isValidJSON = useSimdjsonForLarge && !preprocess ? (jsonStr) => {
			if (jsonStr.length >= SIMDJSON_THRESHOLD) {
				const ok = nativeVerdict(jsonStr);
				if (ok !== void 0) return ok;
			}
			return verdictFromText(jsonStr);
		} : verdictFromText;
	}
	installCodegenPaths.compileVerdict = function compileVerdict() {
		const { compileCacheKey, _compileCache, _compileCacheSet, _bindVerdict, _rememberInstance } = core._internals;
		if (!this._schemaStr) this._schemaStr = JSON.stringify(this._schemaObj);
		const sm = this._schemaMap.size > 0 ? this._schemaMap : null;
		const mapKey = compileCacheKey(this._schemaStr, this._schemaMap);
		const cached = this._userFormats || this._usesKeywords ? null : _compileCache.get(mapKey);
		if (cached && cached.jsFn) {
			this._jsFn = cached.jsFn;
			_bindVerdict(this, cached.jsFn);
			_rememberInstance(this);
			return;
		}
		const uf = this._userFormats;
		const _cg = compileToJSCodegen(this._schemaObj, sm, uf, this._keywords ? { keywords: this._keywords } : void 0);
		const jsFn = _cg || (this._usesKeywords ? null : compileToJS(this._schemaObj, null, sm));
		this._jsFn = jsFn;
		if (jsFn) {
			_bindVerdict(this, jsFn);
			_rememberInstance(this);
			if (!uf && !this._keywords) {
				if (!cached) _compileCacheSet(mapKey, {
					jsFn,
					combined: void 0,
					errFn: void 0,
					isCodegen: !!_cg,
					full: false
				});
				else cached.jsFn = jsFn;
			}
		}
	};
	installCodegenPaths.installScanner = function installScanner(schemaObj, options) {
		const { ABORT_EARLY_RESULT, VALID_RESULT, _bindEntry } = core._internals;
		const self = this;
		const SCAN_AFTER = 64;
		let calls = 0;
		this._ensureScanner = (now) => {
			if (self._scanner === void 0) {
				if (self._usesKeywords) {
					self._scanner = null;
					return null;
				}
				if (!now && ++calls < SCAN_AFTER) return void 0;
				const built = require_scan_compiler().compileScanner(schemaObj, { userFormats: self._userFormats });
				self._scanner = built ? built.scan : null;
			}
			return self._scanner;
		};
		const byParsing = this.isValidJSON;
		const memoizable = !self._userFormats && !self._usesKeywords;
		let _memoText = null;
		let _memoVerdict = false;
		this.isValidJSON = (jsonStr) => {
			const scan = self._ensureScanner();
			if (scan === void 0) return byParsing(jsonStr);
			if (scan === null) {
				_bindEntry(self, "isValidJSON", byParsing);
				return byParsing(jsonStr);
			}
			_bindEntry(self, "isValidJSON", memoizable ? (text) => {
				if (typeof text !== "string") return byParsing(text);
				if (text === _memoText) return _memoVerdict;
				const r = scan(text);
				const verdict = r === -1 ? byParsing(text) : r === 1;
				_memoText = text;
				_memoVerdict = verdict;
				return verdict;
			} : (text) => {
				if (typeof text !== "string") return byParsing(text);
				const r = scan(text);
				if (r === -1) return byParsing(text);
				return r === 1;
			});
			return self.isValidJSON(jsonStr);
		};
		{
			const validateByParsing = this.validateJSON;
			const abortEarly = !!options.abortEarly;
			this.validateJSON = (jsonStr) => {
				const scan = self._ensureScanner();
				if (scan === void 0) return validateByParsing(jsonStr);
				if (scan === null) {
					_bindEntry(self, "validateJSON", validateByParsing);
					return validateByParsing(jsonStr);
				}
				_bindEntry(self, "validateJSON", (text) => {
					if (typeof text === "string") {
						const r = scan(text);
						if (r === 1) return VALID_RESULT;
						if (r === 0) {
							if (abortEarly) return ABORT_EARLY_RESULT;
							self._skipNativeFast = true;
							try {
								return validateByParsing(text);
							} finally {
								self._skipNativeFast = false;
							}
						}
					}
					return validateByParsing(text);
				});
				return self.validateJSON(jsonStr);
			};
		}
	};
	function emitRemovals(node, access, lines, depth, seen) {
		if (!node || typeof node !== "object" || !node.properties) return;
		if (seen.has(node)) return;
		seen.add(node);
		const keys = Object.keys(node.properties);
		const body = [];
		if (node.additionalProperties === false) {
			const kv = "_k" + depth;
			const checks = keys.map((k) => `${kv}!==${JSON.stringify(k)}`).join("&&");
			body.push(keys.length > 0 ? `for(var ${kv} in ${access})if(${checks})delete ${access}[${kv}]` : `for(var ${kv} in ${access})delete ${access}[${kv}]`);
		}
		for (const key of keys) {
			const prop = node.properties[key];
			if (prop && typeof prop === "object" && prop.properties) emitRemovals(prop, `${access}[${JSON.stringify(key)}]`, body, depth + 1, seen);
		}
		seen.delete(node);
		if (body.length === 0) return;
		if (depth === 0) lines.push(...body);
		else lines.push(`if(${access}!==null&&typeof ${access}==='object'&&!Array.isArray(${access})){${body.join("\n")}}`);
	}
	const COERCIBLE_TYPES = /* @__PURE__ */ new Set([
		"number",
		"integer",
		"string",
		"boolean"
	]);
	function scalarCoercion(a, t) {
		if (t === "integer") return [`if(typeof ${a}==='string'){var _n=Number(${a});if(${a}!==''&&Number.isInteger(_n))${a}=_n}`, `if(typeof ${a}==='boolean')${a}=${a}?1:0`];
		if (t === "number") return [`if(typeof ${a}==='string'){var _n=Number(${a});if(${a}!==''&&!isNaN(_n))${a}=_n}`, `if(typeof ${a}==='boolean')${a}=${a}?1:0`];
		if (t === "string") return [`if(typeof ${a}==='number'||typeof ${a}==='boolean')${a}=String(${a})`];
		return [`if(${a}==='true'||${a}==='1')${a}=true`, `if(${a}==='false'||${a}==='0')${a}=false`];
	}
	function isScalarCoercible(node) {
		return !!(node && typeof node === "object" && typeof node.type === "string" && COERCIBLE_TYPES.has(node.type));
	}
	function coercesInside(node, seen, memo) {
		if (!node || typeof node !== "object" || seen.has(node)) return false;
		if (memo && memo.has(node)) return memo.get(node);
		seen.add(node);
		let found = false;
		if (node.properties) for (const [key, prop] of Object.entries(node.properties)) {
			if (key === "__proto__" || !prop || typeof prop !== "object") continue;
			if (isScalarCoercible(prop) || coercesInside(prop, seen, memo)) {
				found = true;
				break;
			}
		}
		if (!found && node.items && typeof node.items === "object" && !Array.isArray(node.items)) found = isScalarCoercible(node.items) || coercesInside(node.items, seen, memo);
		seen.delete(node);
		if (memo) memo.set(node, found);
		return found;
	}
	function emitCoercions(node, ov, lines, st, depth) {
		if (st.seen.has(node)) {
			st.cycle = true;
			return;
		}
		st.seen.add(node);
		if (node.properties) for (const [key, prop] of Object.entries(node.properties)) {
			if (key === "__proto__" || !prop || typeof prop !== "object") continue;
			const k = JSON.stringify(key);
			const a = `${ov}[${k}]`;
			if (isScalarCoercible(prop)) lines.push(...scalarCoercion(a, prop.type));
			else if (depth === 0 && prop.type === "array" && st.arrayMode) lines.push(`if(${k} in ${ov}&&${a}!==undefined&&!Array.isArray(${a}))${a}=[${a}]`);
			if ((prop.properties || prop.items) && coercesInside(prop, /* @__PURE__ */ new Set(), st.memo)) {
				const n = "_c" + st.n++;
				lines.push(`{const ${n}=${a};if(typeof ${n}==='object'&&${n}!==null){`);
				emitCoercions(prop, n, lines, st, depth + 1);
				lines.push("}}");
			}
		}
		const it = node.items;
		if (it && typeof it === "object" && !Array.isArray(it) && (isScalarCoercible(it) || coercesInside(it, /* @__PURE__ */ new Set(), st.memo))) {
			const i = "_i" + st.n++;
			lines.push(`if(Array.isArray(${ov}))for(let ${i}=0;${i}<${ov}.length;${i}++){`);
			if (isScalarCoercible(it)) lines.push(...scalarCoercion(`${ov}[${i}]`, it.type));
			if (coercesInside(it, /* @__PURE__ */ new Set(), st.memo)) {
				const n = "_c" + st.n++;
				lines.push(`{const ${n}=${ov}[${i}];if(typeof ${n}==='object'&&${n}!==null){`);
				emitCoercions(it, n, lines, st, depth + 1);
				lines.push("}}");
			}
			lines.push("}");
		}
		st.seen.delete(node);
	}
	function hasDefaultsInside(node, seen) {
		if (!node || typeof node !== "object" || !node.properties || seen.has(node)) return false;
		seen.add(node);
		let found = false;
		for (const prop of Object.values(node.properties)) if (prop && typeof prop === "object" && (prop.default !== void 0 || hasDefaultsInside(prop, seen))) {
			found = true;
			break;
		}
		seen.delete(node);
		return found;
	}
	function emitDefaults(node, ov, lines, st) {
		if (st.seen.has(node)) {
			st.cycle = true;
			return;
		}
		st.seen.add(node);
		for (const [key, prop] of Object.entries(node.properties || {})) {
			if (!prop || typeof prop !== "object") continue;
			const k = JSON.stringify(key);
			if (prop.default !== void 0) {
				const def = JSON.stringify(prop.default);
				lines.push(key === "__proto__" ? `if(!Object.hasOwn(${ov},${k}))Object.defineProperty(${ov},${k},{value:${def},writable:true,enumerable:true,configurable:true})` : `if(!Object.hasOwn(${ov},${k}))${ov}[${k}]=${def}`);
			}
			if (prop.properties && hasDefaultsInside(prop, /* @__PURE__ */ new Set())) {
				const n = "_d" + st.n++;
				lines.push(`if(Object.hasOwn(${ov},${k})){const ${n}=${ov}[${k}];if(typeof ${n}==='object'&&${n}!==null){`);
				emitDefaults(prop, n, lines, st);
				lines.push("}}");
			}
		}
		st.seen.delete(node);
	}
	function buildPreprocessCodegen(schema, options) {
		if (typeof schema !== "object" || schema === null || !schema.properties) return null;
		const lines = [];
		if (options.removeAdditional) emitRemovals(schema, "d", lines, 0, /* @__PURE__ */ new Set());
		const st = {
			n: 0,
			seen: /* @__PURE__ */ new Set(),
			cycle: false,
			arrayMode: options.coerceTypes === "array",
			memo: /* @__PURE__ */ new Map()
		};
		if (options.coerceTypes) emitCoercions(schema, "d", lines, st, 0);
		if (options.useDefaults !== false && hasDefaultsInside(schema, /* @__PURE__ */ new Set())) emitDefaults(schema, "d", lines, st);
		if (st.cycle) return null;
		if (lines.length === 0) return null;
		lines.unshift(`if(d===null||typeof d!=='object')return`);
		const src = lines.join("\n");
		let fn = _preprocessBySource.get(src);
		if (fn === void 0) {
			try {
				fn = new Function("d", src);
			} catch {
				fn = null;
			}
			if (_preprocessBySource.size >= PREPROCESS_SOURCE_LIMIT) _preprocessBySource.clear();
			_preprocessBySource.set(src, fn);
		}
		return fn;
	}
	const _preprocessBySource = /* @__PURE__ */ new Map();
	const PREPROCESS_SOURCE_LIMIT = 4096;
	function buildParse(self, decline, extended) {
		const { cloneExprFor } = require_clone_emit();
		const expr = cloneExprFor(self._schemaObj);
		if (!expr) return decline("the set of keys to keep cannot be proven from the schema");
		let copy;
		try {
			copy = new Function("data", "return " + expr);
		} catch {
			return decline("code generation is not allowed here");
		}
		self._ensureCompiled();
		const verdict = extended ? (d) => self.isValidObject(d) : self._jsFn;
		if (typeof self._jsFn !== "function") return decline("the schema has no generated verdict function");
		return (data) => {
			if (!verdict(data)) {
				const e = /* @__PURE__ */ new Error("validation failed");
				e.name = "AtaValidationError";
				let target = data;
				if (self._mutatesInput) try {
					target = structuredClone(data);
				} catch {
					target = data;
				}
				e.errors = self.validate(target).errors;
				throw e;
			}
			return copy(data);
		};
	}
	const COLD_CALLS = 64;
	const COLD_MIN = 16384;
	function mayExpandPast(self, limit) {
		const str = self._schemaStr || (self._schemaStr = JSON.stringify(self._schemaObj));
		if (str === void 0) return false;
		if (str.length * 8 <= limit && !str.includes("\"$ref\"")) return false;
		return jsCompiler.expandedChars(self._schemaObj, limit) > limit;
	}
	function coldTwin(self, Validator) {
		const n = self._coldCalls === void 0 ? 0 : self._coldCalls;
		if (n >= COLD_CALLS || self._validateTail !== null || self._verdictTail !== null) return null;
		let t = self._twin;
		if (t === void 0) {
			t = null;
			if (!self._interpretOnly && !self._initialized && mayExpandPast(self, COLD_MIN)) try {
				t = new Validator(self._rawSchema, Object.assign({}, self._options, { engine: "interpreter" }));
			} catch {
				t = null;
			}
			self._twin = t;
		}
		if (t === null) return null;
		self._coldCalls = n + 1;
		return t;
	}
	core._registerCodegen({
		jsCompiler,
		coldTwin,
		nativePositions: () => require_native_positions().nativeTargeted,
		installPaths: installCodegenPaths,
		compileVerdict: installCodegenPaths.compileVerdict,
		installScanner: installCodegenPaths.installScanner,
		buildPreprocess: buildPreprocessCodegen,
		buildParse,
		aot: () => require_aot_browser()
	});
	function toTypeScript(...a) {
		return require_ts_gen().toTypeScript(...a);
	}
	function renderPretty(...a) {
		return require_render_pretty().renderPretty(...a);
	}
	function renderCompact(...a) {
		return require_render_compact().renderCompact(...a);
	}
	function toOutput(...a) {
		return require_output_format().toOutput(...a);
	}
	function toRetryMessage(...a) {
		return require_retry_message().toRetryMessage(...a);
	}
	function describeSchema(...a) {
		return require_describe_schema().describeSchema(...a);
	}
	function renderJSON(...a) {
		return require_render_json().renderJSON(...a);
	}
	function _walkPointer(root, pointer) {
		if (!pointer) return root;
		const parts = pointer.replace(/^\//, "").split("/").map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let cur = root;
		for (const p of parts) {
			if (cur == null) return void 0;
			cur = cur[p];
		}
		return cur;
	}
	function attachSuggestions(errors, data) {
		if (!errors) return errors;
		const { suggestFor } = require_suggestions();
		const { reprValue } = require_enrich_error();
		for (const e of errors) {
			if (!e || e.suggestion) continue;
			let received = e.received;
			if (received === void 0 && data !== void 0) {
				const ptr = e.instancePath != null ? e.instancePath : e.path || "";
				const raw = _walkPointer(data, ptr);
				if (raw !== void 0 || ptr === "") received = reprValue(raw);
			}
			const s = suggestFor(received !== void 0 && e.received === void 0 ? Object.assign({}, e, { received }) : e, data);
			if (s) e.suggestion = s;
		}
		require_diagnostic_source().setDiagnosticSource(errors, {
			data,
			mutatesInput: false
		});
		return errors;
	}
	module.exports = {
		Validator: core.Validator,
		compile: core.compile,
		validate: core.validate,
		validateAsync: core.validateAsync,
		parseAsync: core.parseAsync,
		version: core.version,
		createPaddedBuffer: core.createPaddedBuffer,
		SIMDJSON_PADDING: core.SIMDJSON_PADDING,
		parseJSON: core.parseJSON,
		toTypeScript,
		defineSchema: core.defineSchema,
		renderPretty,
		renderCompact,
		toOutput,
		toRetryMessage,
		describeSchema,
		renderJSON,
		attachSuggestions
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/index.browser.mjs
var import_keywords = require_keywords$1();
const { Validator, compile, validate, validateAsync, parseAsync, version, createPaddedBuffer, SIMDJSON_PADDING, parseJSON, toTypeScript, defineSchema, renderPretty, renderCompact, toOutput, toRetryMessage, describeSchema, renderJSON } = (/* @__PURE__ */ __toESM(require_ata_validator(), 1)).default;
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.45.0_yaml@2.9.1/node_modules/ata-validator/lib/t.js
var require_t$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const OPTIONAL = Symbol.for("ata.t.optional");
	const { attach: attachRefine } = require_refine();
	function string(opts) {
		return opts === void 0 ? { type: "string" } : {
			type: "string",
			...opts
		};
	}
	function number(opts) {
		return opts === void 0 ? { type: "number" } : {
			type: "number",
			...opts
		};
	}
	function integer(opts) {
		return opts === void 0 ? { type: "integer" } : {
			type: "integer",
			...opts
		};
	}
	function boolean() {
		return { type: "boolean" };
	}
	function nul() {
		return { type: "null" };
	}
	function literal(value) {
		return { const: value };
	}
	function constant(value) {
		return { const: value };
	}
	function enumOf(values) {
		return { enum: values };
	}
	function array(items, opts) {
		return opts === void 0 ? {
			type: "array",
			items
		} : {
			type: "array",
			items,
			...opts
		};
	}
	function tuple(items, opts) {
		return Object.assign({
			type: "array",
			prefixItems: items,
			items: false,
			minItems: items.length
		}, opts);
	}
	function record(values, opts) {
		return opts === void 0 ? {
			type: "object",
			additionalProperties: values
		} : {
			type: "object",
			additionalProperties: values,
			...opts
		};
	}
	function object(properties, opts) {
		const keys = Object.keys(properties);
		const values = Object.values(properties);
		let anyOptional = false;
		for (let i = 0; i < values.length; i++) {
			const schema = values[i];
			if (schema && schema[OPTIONAL] === true) {
				anyOptional = true;
				break;
			}
		}
		let out;
		if (!anyOptional) out = keys.length ? {
			type: "object",
			properties: { ...properties },
			required: keys
		} : {
			type: "object",
			properties: { ...properties }
		};
		else {
			const props = {};
			const required = [];
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const schema = values[i];
				if (schema && schema[OPTIONAL] === true) {
					const { [OPTIONAL]: _drop, ...rest } = schema;
					props[key] = rest;
				} else {
					props[key] = schema;
					required.push(key);
				}
			}
			out = required.length ? {
				type: "object",
				properties: props,
				required
			} : {
				type: "object",
				properties: props
			};
		}
		return opts === void 0 ? out : Object.assign(out, opts);
	}
	function optional(schema) {
		return Object.assign({}, schema, { [OPTIONAL]: true });
	}
	function union(schemas) {
		return { anyOf: schemas };
	}
	function intersect(schemas) {
		return { allOf: schemas };
	}
	function ref(pointer) {
		return { $ref: pointer };
	}
	function any() {
		return {};
	}
	function unknown() {
		return {};
	}
	function never() {
		return { not: {} };
	}
	function refine(schema, check, opts) {
		return attachRefine(schema, check, opts);
	}
	function assertObjectSchema(schema, fn) {
		if (!schema || typeof schema !== "object" || schema.type !== "object" || !schema.properties || typeof schema.properties !== "object") throw new Error(`t.${fn}: expected an object schema with properties`);
	}
	function cloneMeta(schema) {
		const out = {};
		for (const key of Object.keys(schema)) if (key !== "properties" && key !== "required") out[key] = schema[key];
		return out;
	}
	function pick(schema, keys) {
		assertObjectSchema(schema, "pick");
		const keep = new Set(keys);
		const props = {};
		for (const key of Object.keys(schema.properties)) if (keep.has(key)) props[key] = schema.properties[key];
		const required = (schema.required || []).filter((key) => keep.has(key));
		const out = Object.assign(cloneMeta(schema), { properties: props });
		if (required.length) out.required = required;
		return out;
	}
	function omit(schema, keys) {
		assertObjectSchema(schema, "omit");
		const drop = new Set(keys);
		const props = {};
		for (const key of Object.keys(schema.properties)) if (!drop.has(key)) props[key] = schema.properties[key];
		const required = (schema.required || []).filter((key) => !drop.has(key));
		const out = Object.assign(cloneMeta(schema), { properties: props });
		if (required.length) out.required = required;
		return out;
	}
	function partial(schema) {
		assertObjectSchema(schema, "partial");
		return Object.assign(cloneMeta(schema), { properties: schema.properties });
	}
	function requiredOf(schema, keys) {
		assertObjectSchema(schema, "required");
		const propKeys = Object.keys(schema.properties);
		let required;
		if (keys === void 0) required = propKeys.slice();
		else {
			const known = new Set(propKeys);
			required = Array.from(/* @__PURE__ */ new Set([...schema.required || [], ...keys])).filter((k) => known.has(k));
		}
		const out = Object.assign(cloneMeta(schema), { properties: schema.properties });
		if (required.length) out.required = required;
		return out;
	}
	function recursive(build, opts) {
		const body = build({ $ref: "#/$defs/self" });
		return Object.assign({
			$ref: "#/$defs/self",
			$defs: { self: body }
		}, opts);
	}
	function composite(schemas, opts) {
		const props = {};
		const requiredSet = /* @__PURE__ */ new Set();
		for (const schema of schemas) {
			assertObjectSchema(schema, "composite");
			for (const key of Object.keys(schema.properties)) props[key] = schema.properties[key];
			for (const key of schema.required || []) requiredSet.add(key);
		}
		const required = Array.from(requiredSet).filter((key) => Object.hasOwn(props, key));
		const out = {
			type: "object",
			properties: props
		};
		if (required.length) out.required = required;
		return Object.assign(out, opts);
	}
	module.exports = {
		string,
		number,
		integer,
		boolean,
		null: nul,
		literal,
		const: constant,
		enum: enumOf,
		array,
		tuple,
		record,
		object,
		optional,
		union,
		intersect,
		ref,
		any,
		unknown,
		never,
		refine,
		OPTIONAL,
		pick,
		omit,
		partial,
		required: requiredOf,
		composite,
		recursive
	};
}));
const { t, OPTIONAL } = (/* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	const t = require_t$1();
	module.exports = {
		t,
		OPTIONAL: t.OPTIONAL
	};
})))(), 1)).default;
//#endregion
//#region ../schemas/libraries/ata-validator/download/index.ts
const dateSchema = t.object({}, { instanceof: "Date" });
const imageSchema = t.object({
	id: t.number(),
	created: dateSchema,
	title: t.string({
		minLength: 1,
		maxLength: 100
	}),
	type: t.enum(["jpg", "png"]),
	size: t.number(),
	url: t.string({ format: "url" })
});
const ratingSchema = t.object({
	id: t.number(),
	stars: t.number({
		minimum: 1,
		maximum: 5
	}),
	title: t.string({
		minLength: 1,
		maxLength: 100
	}),
	text: t.string({
		minLength: 1,
		maxLength: 1e3
	}),
	images: t.array(imageSchema)
});
const productSchema = t.object({
	id: t.number(),
	created: dateSchema,
	title: t.string({
		minLength: 1,
		maxLength: 100
	}),
	brand: t.string({
		minLength: 1,
		maxLength: 30
	}),
	description: t.string({
		minLength: 1,
		maxLength: 500
	}),
	price: t.number({
		minimum: 1,
		maximum: 1e4
	}),
	discount: t.union([t.number({
		minimum: 1,
		maximum: 100
	}), t.null()]),
	quantity: t.number({
		minimum: 0,
		maximum: 10
	}),
	tags: t.array(t.string({
		minLength: 1,
		maxLength: 30
	})),
	images: t.array(imageSchema),
	ratings: t.array(ratingSchema)
});
(0, import_keywords.withKeywords)(new Validator(productSchema)).validate({});
//#endregion
