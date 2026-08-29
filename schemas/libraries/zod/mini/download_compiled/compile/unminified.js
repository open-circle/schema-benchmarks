//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function esc(str) {
	return JSON.stringify(str);
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
const propertyKeyTypes = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
	});
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start, inst) {
	var _a;
	for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
}
function finalizeIssue(iss, ctx, config) {
	var _a;
	const traits = iss.inst?._zod?.traits;
	if (traits?.has("$ZodType")) {
		if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
		else iss.schema = iss.inst;
	}
	const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const { inst: _inst, schema: _schema, continue: _continue, input: _input, ...rest } = iss;
	rest.path ?? (rest.path = []);
	rest.message = message;
	if (ctx?.reportInput) rest.input = _input;
	return rest;
}
const highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
	const units = str.length;
	if (!highSurrogate.test(str)) return units;
	let count = units;
	for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
		count--;
		i++;
	}
	return count;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
/**
* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
*
* Call this from a `proto` initializer, which runs once per prototype — never per instance.
*/
function members(proto, table) {
	for (const key in table) {
		const desc = Object.getOwnPropertyDescriptor(table, key);
		if (desc.get) Object.defineProperty(proto, key, {
			...desc,
			enumerable: false
		});
		else defineBound(proto, key, desc.value);
	}
}
/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
function own(inst, key, value, enumerable = true) {
	Object.defineProperty(inst, key, {
		configurable: true,
		writable: true,
		enumerable,
		value
	});
	return value;
}
/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
function hide(inst, key, value) {
	return own(inst, key, value, false);
}
function defineBound(proto, key, fn) {
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			return own(this, key, fn.bind(this));
		},
		set(value) {
			own(this, key, value);
		}
	});
}
/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
function claim(inst, sentinel) {
	const proto = Object.getPrototypeOf(inst);
	return sentinel in proto ? void 0 : proto;
}
let installing;
let broke = false;
const breaker = {
	configurable: true,
	get() {
		broke = true;
	}
};
/**
* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
* constructor, computed from the internals object itself and cached there on
* first read. One accessor per constructor rather than one per instance.
*/
function defineLazyInternal(inst, key, compute) {
	const proto = Object.getPrototypeOf(inst._zod);
	if (key in proto && installing !== inst._zod) {
		installing = void 0;
		return;
	}
	installing = inst._zod;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			Object.defineProperty(this, key, breaker);
			const outer = broke;
			broke = false;
			try {
				const value = compute(this);
				if (broke) delete this[key];
				else Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					value
				});
				broke = broke || outer;
				return value;
			} catch (err) {
				delete this[key];
				broke = broke || outer;
				throw err;
			}
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				value
			});
		}
	});
}
/**
* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
* data property. One accessor per constructor rather than one per instance, because an own accessor
* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
*/
function installLazyProp(inst, key, make, enumerable) {
	const proto = claim(inst, key);
	if (!proto) return;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			const desc = {
				configurable: true,
				writable: true,
				enumerable,
				value: void 0
			};
			Object.defineProperty(this, key, desc);
			desc.value = make(this);
			Object.defineProperty(this, key, desc);
			return desc.value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
		}
	});
}
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/core.js
var _a;
const _zodDesc$1 = {
	value: void 0,
	enumerable: false
};
let _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
	const E = _E;
	if (E) {
		const saved = E.stackTraceLimit;
		if (typeof saved === "number") {
			try {
				E.stackTraceLimit = 0;
			} catch {
				_E = null;
				return new Definition();
			}
			try {
				return new Definition();
			} finally {
				E.stackTraceLimit = saved;
			}
		}
	}
	return new Definition();
}
function $constructor(name, initializer, proto, params) {
	const zodProto = {};
	function Internals(def) {
		this.def = def;
		this.constr = _;
		this.traits = /* @__PURE__ */ new Set();
	}
	Internals.prototype = zodProto;
	const protoMembers = proto;
	const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
	function init(inst, def) {
		if (!inst._zod) {
			_zodDesc$1.value = new Internals(def);
			try {
				Object.defineProperty(inst, "_zod", _zodDesc$1);
			} finally {
				_zodDesc$1.value = void 0;
			}
		}
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		if (initialized) {
			const own = Object.getPrototypeOf(inst);
			const ctorProto = inst._zod.constr.prototype;
			let up = own;
			while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
			const target = up ?? own;
			if (!initialized.has(target)) {
				initialized.add(target);
				members(target, protoMembers);
			}
		}
		const proto = _.prototype;
		for (const k in proto) {
			if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		const inst = params?.Parent ? newError(Definition) : this;
		init(inst, def);
		const deferred = inst._zod.deferred;
		if (deferred) {
			for (const fn of deferred) fn();
			inst._zod.deferred = void 0;
		}
		const pp = globalThis.__zod_globalConfig?.postProcessor;
		if (pp) pp(inst);
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/errors.js
function _getMessage() {
	const internals = this._zod;
	internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
	return internals.message;
}
function _setMessage(value) {
	this._zod.message = value;
}
const _messageDesc = {
	get: _getMessage,
	set: _setMessage,
	enumerable: true,
	configurable: true
};
const _zodDesc = {
	value: void 0,
	enumerable: false
};
const _issuesDesc = {
	value: void 0,
	enumerable: false
};
const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
const initializer = (inst, def) => {
	inst.name = "$ZodError";
	_zodDesc.value = inst._zod;
	Object.defineProperty(inst, "_zod", _zodDesc);
	_issuesDesc.value = def;
	Object.defineProperty(inst, "issues", _issuesDesc);
	_zodDesc.value = void 0;
	_issuesDesc.value = void 0;
	Object.defineProperty(inst, "message", _messageDesc);
	const proto = Object.getPrototypeOf(inst);
	if (!_installedToString.has(proto)) {
		_installedToString.add(proto);
		Object.defineProperty(proto, "toString", {
			configurable: true,
			enumerable: false,
			get() {
				const value = () => this.message;
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
				return value;
			},
			set(value) {
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
			}
		});
	}
};
const $ZodError = $constructor("$ZodError", initializer);
const $ZodRealError = $constructor("$ZodError", initializer, void 0, { Parent: Error });
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/parse.js
const _parse = (_Err) => {
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		if (result.issues.length) {
			const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, _params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const parse = /* @__PURE__*/ _parse($ZodRealError);
const _parseAsync = (_Err) => {
	const fn = async (schema, value, _ctx, params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		if (result.issues.length) {
			const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const parseAsync = /* @__PURE__*/ _parseAsync($ZodRealError);
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParse = /* @__PURE__*/ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParseAsync = /* @__PURE__*/ _safeParseAsync($ZodRealError);
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/regexes.js
const base64url = /^[A-Za-z0-9_-]*$/;
const httpProtocol = /^https?$/;
const creditCard = /^\d(?:[ -]?\d){11,18}$/;
const string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
const number$1 = /^-?\d+(?:\.\d+)?$/;
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/checks.js
const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
const _whenHasLength = (payload) => {
	const val = payload.value;
	return !nullish(val) && val.length !== void 0;
};
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) {
			if (def.inclusive) bag.maximum = def.value;
			else bag.exclusiveMaximum = def.value;
		}
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) {
			if (def.inclusive) bag.minimum = def.value;
			else bag.exclusiveMinimum = def.value;
		}
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = [], closed = {}) {
		this.content = [];
		this.indent = 0;
		this.args = args;
		this.closed = closed;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const content = this?.content ?? [``];
		return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
	}
};
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/versions.js
const version = {
	major: 4,
	minor: 5,
	patch: 0
};
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/schemas.js
const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const defChecks = inst._zod.def.checks;
	const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			if (payload.memo) return payload;
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
}, {
	get "~standard"() {
		return hide(this, "~standard", standardProps(this));
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	}
});
/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
const toStandardResult = (r) => r.success ? { value: r.data } : { issues: r.error?.issues };
function standardProps(inst) {
	return {
		validate: (value) => {
			try {
				return toStandardResult(safeParse(inst, value));
			} catch (_) {
				return safeParseAsync(inst, value).then(toStandardResult);
			}
		},
		vendor: "zod",
		version: 1
	};
}
const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
/** Parses a URL for `$ZodURL`, applying the one guard the URL constructor cannot express. Returns the parsed URL, or a code naming the stage that rejected it — the runtime needs that distinction to pick an issue note, and compiled code only needs to know it is not a URL. */
function parseURLObject(trimmed, def) {
	if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
	try {
		return new URL(trimmed);
	} catch {
		return 2;
	}
}
const asciiTabOrNewline = /[\t\n\r]/g;
/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
function stripTabAndNewline(value) {
	return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
	hostname.lastIndex = 0;
	return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
	protocol.lastIndex = 0;
	return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			const url = parseURLObject(trimmed, def);
			if (url === 1) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === 2) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: def.hostname.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: def.protocol.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
	if (!ipv6Alphabet.test(value)) return false;
	try {
		new URL(`http://[${value}]`);
		return true;
	} catch {
		return false;
	}
}
function isValidCIDRv6(value) {
	const parts = value.split("/");
	if (parts.length !== 2) return false;
	const [address, prefix] = parts;
	if (!prefix) return false;
	const prefixNum = Number(prefix);
	if (`${prefixNum}` !== prefix) return false;
	if (prefixNum < 0 || prefixNum > 128) return false;
	return isValidIPv6(address);
}
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
const CC_SANITIZE = /[- ]/g;
/** Luhn checksum on a digit-only string. Adapted from valibot (MIT). */
function isLuhnAlgo(digits) {
	let length = digits.length;
	let bit = 1;
	let sum = 0;
	while (length) {
		const value = +digits[--length];
		bit ^= 1;
		sum += bit ? [
			0,
			2,
			4,
			6,
			8,
			1,
			3,
			5,
			7,
			9
		][value] : value;
	}
	return sum % 10 === 0;
}
function isValidCreditCard(input) {
	if (!creditCard.test(input)) return false;
	return isLuhnAlgo(input.replace(CC_SANITIZE, ""));
}
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodDate = /*@__PURE__*/ $constructor("$ZodDate", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = new Date(payload.value);
		} catch (_err) {}
		const input = payload.value;
		const isDate = input instanceof Date;
		if (isDate && !Number.isNaN(input.getTime())) return payload;
		payload.issues.push({
			expected: "date",
			code: "invalid_type",
			input,
			...isDate ? { received: "Invalid Date" } : {},
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, optin, optout) {
	const isPresent = key in input;
	const isOptionalOut = optout === "optional";
	if (!isPresent && isOptionalOut && optin === "optional") return;
	if (result.issues.length) {
		if (optin !== void 0 && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && optin === void 0) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
const NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	const ownSymbols = Object.getOwnPropertySymbols(def.shape);
	const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
	const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
	for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		allKeys,
		symbolKeys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const optin = _catchall.optin;
	const optout = _catchall.optout;
	for (const key in input) {
		if (keySet.has(key)) continue;
		if (key === "__proto__") {
			if (t === "never") unrecognized.push(key);
			continue;
		}
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
		else handlePropertyResult(r, payload, key, input, optin, optout);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst,
		continue: true
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const propShapes = /* @__PURE__ */ new WeakMap();
const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
		const sh = def.shape;
		propShapes.set(def, sh);
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			propShapes.set(def, newSh);
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazyInternal(inst, "propValues", (zod) => {
		const shape = zod.def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
				if (field.optin !== void 0) propValues[key].add(void 0);
			}
		}
		return propValues;
	});
	const isObject$1 = isObject;
	const catchall = def.catchall;
	let value;
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.allKeys) {
			if (key === "__proto__") continue;
			const el = shape[key];
			const optin = el._zod.optin;
			const optout = el._zod.optout;
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
			else handlePropertyResult(r, payload, key, input, optin, optout);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
		for (const key of sharedKeys) {
			if (key === "__proto__") continue;
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	const patternValues = values.filter((k) => propertyKeyTypes.has(typeof k));
	inst._zod.pattern = new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazyInternal(inst, "values", (zod) => {
		return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/memoizer.js
/** Keyed off the context object every schema in one parse call already shares. */
const STATE = "~memo";
const recursive = /*@__PURE__*/ new WeakMap();
/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
function isRecursive(inst, stack) {
	const cached = recursive.get(inst);
	if (cached !== void 0) return cached;
	if (stack.has(inst)) return true;
	stack.add(inst);
	let result = false;
	const check = (child) => {
		if (!result && child?._zod && isRecursive(child, stack)) result = true;
	};
	const def = inst._zod.def;
	if (def.type === "lazy") check(inst._zod.innerType);
	else {
		const shape = def.shape;
		if (shape) for (const key of Reflect.ownKeys(shape)) check(shape[key]);
		for (const key in def) {
			const value = def[key];
			if (!value || typeof value !== "object") continue;
			if (value._zod) check(value);
			else if (Array.isArray(value)) for (const el of value) check(el);
		}
	}
	stack.delete(inst);
	recursive.set(inst, result);
	return result;
}
/**
* Whether one parse can re-enter this schema, i.e. its subtree contains a cycle.
* Exported for `z.compile`, which refuses to compile such a schema: cycle
* breaking is driven from here off state keyed on the parse context, and a
* generated fast path has no context to key on.
*/
function isRecursiveSchema(inst) {
	return isRecursive(inst, /* @__PURE__ */ new Set());
}
/** Whether this value is a node a back-edge resolved to before it finished. */
function isBackEdge(ctx, value) {
	const backEdges = ctx[STATE]?.backEdges;
	return backEdges !== void 0 && value !== null && typeof value === "object" && backEdges.has(value);
}
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/compile.js
/** Sentinel value returned by the compiled fast path when validation fails. Internal. */
const INVALID = Symbol.for("zod.compile.invalid");
const FALLBACK_FLAG = Symbol.for("zod.compile.fallback");
/** Raised when the schema contains async refinements or transforms. Surfaces only under `compile(schema, { strict: true })`. */
var ZodCompileAsyncError = class extends Error {
	constructor(message = "z.compile does not support async refinements, transforms, or checks") {
		super(message);
		this.name = "ZodCompileAsyncError";
	}
};
/**
* Raised when the schema contains a feature whose semantics the fast path
* can't fully model. Both the shim in `zod/compile` and the default
* `compile()` fall back to the runtime parser for that schema; only
* `compile(schema, { strict: true })` lets it surface.
*/
var ZodCompileUnsupportedError = class extends Error {
	constructor(feature, islandable = true) {
		super(`z.compile does not support ${feature}; this schema must use the runtime parser`);
		this.name = "ZodCompileUnsupportedError";
		this.islandable = islandable;
	}
};
/**
* Build the validator `validate` calls: the same codegen as the parser with the output construction
* dropped. A schema the flag cannot express reuses the parser, which still answers correctly — it
* just builds a value nothing reads.
*/
function compileValidator(schema, parser) {
	try {
		return compileFn(schema, { assertOnly: true });
	} catch {
		return parser;
	}
}
/**
* AOT-compile a Zod schema. Returns a clone whose `_zod.run` calls a generated
* fast path first and falls back to the original runtime parser on failure.
*
* - Forward direction only. Backward (encode), async, and `skipChecks` paths
*   bypass the fast path and use the runtime directly.
* - Never throws. A schema the fast path can't model is returned unchanged and
*   keeps using the runtime parser. Pass `{ strict: true }` to get the refusal
*   as a thrown `ZodCompileUnsupportedError` / `ZodCompileAsyncError` instead.
* - The original schema is unchanged. The clone shares children by reference.
*/
function compile(schema, options) {
	try {
		const parser = compileFn(schema);
		const clone$1 = clone(schema);
		const liveRun = schema._zod.run;
		const originalRun = liveRun.__originalRun ?? liveRun;
		const wrapped = (payload, ctx) => {
			if (ctx?.async || ctx?.direction === "backward" || ctx?.skipChecks || ctx?.[FALLBACK_FLAG]) return originalRun(payload, ctx);
			if (ctx && isBackEdge(ctx, payload.value)) return originalRun(payload, ctx);
			const out = parser(payload.value);
			if (out !== INVALID) {
				payload.value = out;
				return payload;
			}
			if (ctx) ctx[FALLBACK_FLAG] = true;
			return originalRun(payload, ctx);
		};
		wrapped.__originalRun = originalRun;
		clone$1._zod.bag.fallbackRun = originalRun;
		clone$1._zod.bag.validator = compileValidator(schema, parser);
		clone$1._zod.run = wrapped;
		if (!liveRun.__originalRun) installCompiledUserMethods(clone$1, schema, parser);
		return clone$1;
	} catch (err) {
		if (options?.strict) throw err;
		return schema;
	}
}
function installCompiledUserMethods(target, source, parser) {
	const targetAny = target;
	const sourceAny = source;
	if (typeof sourceAny.safeParse === "function") {
		const originalSafeParse = sourceAny.safeParse;
		targetAny.safeParse = (data, params) => {
			const out = parser(data);
			if (out !== INVALID) return {
				success: true,
				data: out
			};
			return originalSafeParse(data, params);
		};
	}
	if (typeof sourceAny.parse === "function") {
		const originalParse = sourceAny.parse;
		targetAny.parse = (data, params) => {
			const out = parser(data);
			if (out !== INVALID) return out;
			return originalParse(data, params);
		};
	}
}
/**
* Generate the standalone compiled function: a parser by default, a validator under
* `assertOnly`. Returns either the parsed value, `true` where nothing reads the output,
* or the `INVALID` sentinel. Internal — consumers should use `compile()`.
*/
function compileFn(schema, options) {
	let recursive = true;
	try {
		recursive = isRecursiveSchema(schema);
	} catch {}
	if (recursive) throw new ZodCompileUnsupportedError("a schema whose subtree contains a reference cycle");
	const ctx = {
		constants: /* @__PURE__ */ new Map(),
		constantCounter: 0,
		varCounter: 0
	};
	const doc = new Doc(["input"]);
	const outputAccessor = generateCheck(doc, ctx, schema, "input", !options?.assertOnly);
	doc.write(outputAccessor === null ? `return true;` : `return ${outputAccessor};`);
	const constantNames = ["INVALID", ...ctx.constants.keys()];
	const constantValues = [INVALID, ...ctx.constants.values()];
	const code = doc.content.join("\n");
	const fullCode = options?.debug ? constantNames.length > 0 ? `// Constants: ${constantNames.join(", ")}\n${code}` : code : "";
	const F = Function;
	const factoryCode = `return (input) => {\n${code}\n}`;
	let fn;
	try {
		fn = new F(...constantNames, factoryCode)(...constantValues);
	} catch (err) {
		throw new ZodCompileUnsupportedError(`this schema (generated code failed to evaluate: ${err.message})`);
	}
	if (options?.debug) fn.code = fullCode;
	return fn;
}
function addConstant(ctx, value) {
	for (const [name, v] of ctx.constants) if (v === value) return name;
	const name = `c${ctx.constantCounter++}`;
	ctx.constants.set(name, value);
	return name;
}
function newVar(ctx) {
	return `v${ctx.varCounter++}`;
}
function runtimeRun(schema, value) {
	const result = schema._zod.run({
		value,
		issues: []
	}, {});
	if (result && typeof result.then === "function") return INVALID;
	const r = result;
	return r.issues.length === 0 ? r.value : INVALID;
}
function compileChild(doc, ctx, schema, accessor, needsValue = true) {
	const contentLen = doc.content.length;
	const constantCount = ctx.constants.size;
	const constantCounter = ctx.constantCounter;
	const varCounter = ctx.varCounter;
	try {
		return generateCheck(doc, ctx, schema, accessor, needsValue);
	} catch (err) {
		if (!(err instanceof ZodCompileUnsupportedError) || !err.islandable) throw err;
		doc.content.length = contentLen;
		if (ctx.constants.size > constantCount) {
			const trailing = Array.from(ctx.constants.keys()).slice(constantCount);
			for (const k of trailing) ctx.constants.delete(k);
		}
		ctx.constantCounter = constantCounter;
		ctx.varCounter = varCounter;
		return emitRuntimeIsland(doc, ctx, schema, accessor);
	}
}
function emitRuntimeIsland(doc, ctx, schema, accessor) {
	const schemaConst = addConstant(ctx, schema);
	const runConst = addConstant(ctx, runtimeRun);
	const outVar = newVar(ctx);
	doc.write(`const ${outVar} = ${runConst}(${schemaConst}, ${accessor});`);
	doc.write(`if (${outVar} === INVALID) return INVALID;`);
	return outVar;
}
const WHEN_DEFAULTED_CHECKS = /* @__PURE__ */ new Set([
	"max_size",
	"min_size",
	"size_equals",
	"max_length",
	"min_length",
	"length_equals"
]);
function generateChecks(doc, ctx, schema, accessor) {
	const schemaChecks = schema._zod.def.checks;
	if (!schemaChecks || schemaChecks.length === 0) return accessor;
	let currentAccessor = accessor;
	for (const check of schemaChecks) {
		const def = check._zod.def;
		if (def.when && !WHEN_DEFAULTED_CHECKS.has(def.check)) throw new ZodCompileUnsupportedError(`check with a custom "when" condition`);
		switch (def.check) {
			case "greater_than":
				generateGreaterThanCheck(doc, ctx, def, currentAccessor);
				break;
			case "less_than":
				generateLessThanCheck(doc, ctx, def, currentAccessor);
				break;
			case "multiple_of":
				generateMultipleOfCheck(doc, ctx, def, currentAccessor);
				break;
			case "number_format":
				generateNumberFormatCheck(doc, def, currentAccessor);
				break;
			case "min_length": {
				const min = numericOperand(def.minimum, "min_length");
				const len = codePointLengthVar(doc, ctx, currentAccessor, `${currentAccessor}.length >= ${min} && ${currentAccessor}.length < ${def.minimum * 2}`);
				doc.write(`if (${len} < ${min}) return INVALID;`);
				break;
			}
			case "max_length": {
				const max = numericOperand(def.maximum, "max_length");
				const len = codePointLengthVar(doc, ctx, currentAccessor, `${currentAccessor}.length > ${max}`);
				doc.write(`if (${len} > ${max}) return INVALID;`);
				break;
			}
			case "length_equals": {
				const exact = numericOperand(def.length, "length_equals");
				const len = codePointLengthVar(doc, ctx, currentAccessor, `${currentAccessor}.length >= ${exact} && ${currentAccessor}.length <= ${def.length * 2}`);
				doc.write(`if (${len} !== ${exact}) return INVALID;`);
				break;
			}
			case "min_size":
				doc.write(`if (${currentAccessor}.size < ${numericOperand(def.minimum, "min_size")}) return INVALID;`);
				break;
			case "max_size":
				doc.write(`if (${currentAccessor}.size > ${numericOperand(def.maximum, "max_size")}) return INVALID;`);
				break;
			case "size_equals":
				doc.write(`if (${currentAccessor}.size !== ${numericOperand(def.size, "size_equals")}) return INVALID;`);
				break;
			case "string_format":
				currentAccessor = generateStringFormatCheck(doc, ctx, def, currentAccessor);
				break;
			case "custom":
				currentAccessor = generateCustomRefineCheck(doc, ctx, check, currentAccessor);
				break;
			case "bigint_format":
				generateBigIntFormatCheck(doc, def, currentAccessor);
				break;
			case "mime_type":
				generateMimeTypeCheck(doc, ctx, def, currentAccessor);
				break;
			case "property":
				generatePropertyCheck(doc, ctx, def, currentAccessor);
				break;
			case "overwrite": {
				const newAccessor = newVar(ctx);
				generateOverwriteCheck(doc, ctx, check, currentAccessor, newAccessor);
				currentAccessor = newAccessor;
				break;
			}
			default: throw new ZodCompileUnsupportedError(`check type ${def.check}`);
		}
	}
	return currentAccessor;
}
function codePointLengthVar(doc, ctx, accessor, inDoubt) {
	const cpLen = addConstant(ctx, codePointLength);
	const v = newVar(ctx);
	doc.write(`const ${v} = typeof ${accessor} === "string" && ${inDoubt} ? ${cpLen}(${accessor}) : ${accessor}.length;`);
	return v;
}
/**
* A count bound reaches generated source verbatim, so a non-number would be
* emitted as code rather than as a value — `min('0) {} evil(); if (0')` writes an
* arbitrary statement into the function body. TypeScript types these as `number`
* and fromJSONSchema guards them, so this is a backstop rather than a live hole,
* but generated source is the one place a wrong type stops being a type error.
*/
function numericOperand(value, label) {
	if (typeof value !== "number" || !Number.isFinite(value)) throw new ZodCompileUnsupportedError(`${label} bound of type ${typeof value}`);
	return `${value}`;
}
function comparisonOperand(ctx, value) {
	if (typeof value === "bigint") return `${value}n`;
	if (typeof value === "number") {
		if (Number.isNaN(value)) throw new ZodCompileUnsupportedError("comparison check with NaN bound");
		return `${value}`;
	}
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) throw new ZodCompileUnsupportedError("comparison check with Invalid Date bound");
		return addConstant(ctx, value);
	}
	throw new ZodCompileUnsupportedError(`comparison check bound of type ${typeof value}`);
}
function generateGreaterThanCheck(doc, ctx, def, accessor) {
	const op = def.inclusive ? "<" : "<=";
	doc.write(`if (${accessor} ${op} ${comparisonOperand(ctx, def.value)}) return INVALID;`);
}
function generateLessThanCheck(doc, ctx, def, accessor) {
	const op = def.inclusive ? ">" : ">=";
	doc.write(`if (${accessor} ${op} ${comparisonOperand(ctx, def.value)}) return INVALID;`);
}
function generateMultipleOfCheck(doc, ctx, def, accessor) {
	if (typeof def.value === "bigint") {
		if (def.value === BigInt(0)) throw new ZodCompileUnsupportedError("multiple_of check with a zero divisor");
		doc.write(`if (${accessor} % ${def.value}n !== 0n) return INVALID;`);
	} else {
		const remainder = addConstant(ctx, floatSafeRemainder);
		doc.write(`if (${remainder}(${accessor}, ${numericOperand(def.value, "multiple_of")}) !== 0) return INVALID;`);
	}
}
function generateNumberFormatCheck(doc, def, accessor) {
	const format = def.format;
	switch (format) {
		case "safeint":
			doc.write(`if (!Number.isSafeInteger(${accessor})) return INVALID;`);
			break;
		case "int32":
			doc.write(`if (!Number.isInteger(${accessor}) || ${accessor} < -2147483648 || ${accessor} > 2147483647) return INVALID;`);
			break;
		case "uint32":
			doc.write(`if (!Number.isInteger(${accessor}) || ${accessor} < 0 || ${accessor} > 4294967295) return INVALID;`);
			break;
		case "float32":
			doc.write(`if (!Number.isFinite(${accessor}) || ${accessor} < -3.4028234663852886e38 || ${accessor} > 3.4028234663852886e38) return INVALID;`);
			break;
		case "float64":
			doc.write(`if (!Number.isFinite(${accessor})) return INVALID;`);
			break;
		default: throw new ZodCompileUnsupportedError(`number format ${format}`);
	}
}
function generateBigIntFormatCheck(doc, def, accessor) {
	const format = def.format;
	if (!format) return;
	switch (format) {
		case "int64":
			doc.write(`if (${accessor} < -9223372036854775808n || ${accessor} > 9223372036854775807n) return INVALID;`);
			break;
		case "uint64":
			doc.write(`if (${accessor} < 0n || ${accessor} > 18446744073709551615n) return INVALID;`);
			break;
		default: throw new ZodCompileUnsupportedError(`bigint format ${format}`);
	}
}
function generateMimeTypeCheck(doc, ctx, def, accessor) {
	const mimeTypes = def.mime;
	if (mimeTypes && mimeTypes.length > 0) {
		const mimeSet = addConstant(ctx, new Set(mimeTypes));
		doc.write(`if (!${mimeSet}.has(${accessor}.type)) return INVALID;`);
	}
}
function generatePropertyCheck(doc, ctx, def, accessor) {
	const propAccessor = `${accessor}[${JSON.stringify(def.property)}]`;
	generateCheck(doc, ctx, def.schema, propAccessor);
}
function generateOverwriteCheck(doc, ctx, check, currentAccessor, newAccessor) {
	const tx = check._zod.def.tx;
	if (!tx) throw new ZodCompileUnsupportedError("overwrite check without a transform function");
	if (isAsyncFunction(tx)) throw new ZodCompileAsyncError("z.compile: async overwrite transforms are not supported");
	const txConst = addConstant(ctx, tx);
	doc.write(`const ${newAccessor} = ${txConst}(${currentAccessor});`);
}
/** A predicate that hands back a thenable is an async check reached synchronously, and the interpreter throws `$ZodAsyncError` for it. Returning INVALID instead would be a bail-out, and a union reads a bail-out as a rejected branch and answers with a later one — so the throw has to survive into generated code. */
function throwAsync() {
	throw new $ZodAsyncError();
}
/** Shared `addIssue` for the spoofed payloads a refine, check or transform receives. Allocating one per call — a fresh closure plus a `this`-bound method on a fresh literal — pinned every payload-allocating schema at ~2.7M ops/sec against 135M for a plain object literal. It captures nothing per call; it only reaches `this.issues`. */
function pushIssue(issue) {
	this.issues.push(issue);
}
function generateCustomRefineCheck(doc, ctx, check, accessor) {
	const def = check._zod.def;
	if (def.fn) {
		if (isAsyncFunction(def.fn)) throw new ZodCompileAsyncError("z.compile: async .refine() predicates are not supported");
		const fnConst = addConstant(ctx, def.fn);
		const throwAsyncConst = addConstant(ctx, throwAsync);
		const resVar = newVar(ctx);
		doc.write(`const ${resVar} = ${fnConst}(${accessor});`);
		doc.write(`if (${resVar} instanceof Promise) ${throwAsyncConst}();`);
		doc.write(`if (!${resVar}) return INVALID;`);
		return accessor;
	}
	if (check._zod.check) {
		if (isAsyncFunction(check._zod.check)) throw new ZodCompileAsyncError("z.compile: async .superRefine() / check functions are not supported");
		const checkFn = check._zod.check;
		const helperFn = (value) => {
			const fakePayload = {
				value,
				issues: [],
				addIssue: pushIssue
			};
			if (checkFn(fakePayload) instanceof Promise) throwAsync();
			return fakePayload.issues.length === 0 ? fakePayload.value : INVALID;
		};
		const helperConst = addConstant(ctx, helperFn);
		const outVar = newVar(ctx);
		doc.write(`const ${outVar} = ${helperConst}(${accessor});`);
		doc.write(`if (${outVar} === INVALID) return INVALID;`);
		return outVar;
	}
	throw new ZodCompileUnsupportedError("custom check without a predicate or check function");
}
/**
* Built-in formats that validate with nothing but `def.pattern`, so compiling
* the regex reproduces the runtime exactly. Deliberately an allowlist: a format
* missing from it loses its fast path, while a format wrongly added to it
* silently accepts input the runtime rejects. Formats that layer extra
* validation over a shape-only pattern (`credit_card`, `base64`, `ipv6`, …) are
* handled above by hoisting the runtime validator itself.
*/
const PATTERN_IS_COMPLETE = /* @__PURE__ */ new Set([
	"cidrv4",
	"cuid",
	"cuid2",
	"date",
	"datetime",
	"duration",
	"e164",
	"email",
	"emoji",
	"ends_with",
	"guid",
	"includes",
	"ipv4",
	"ksuid",
	"lowercase",
	"mac",
	"nanoid",
	"regex",
	"starts_with",
	"time",
	"ulid",
	"uppercase",
	"uuid",
	"xid"
]);
function generateStringFormatCheck(doc, ctx, def, accessor) {
	const fmt = def.format;
	if (fmt === "base64") {
		const validator = addConstant(ctx, isValidBase64);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "base64url") {
		const validator = addConstant(ctx, isValidBase64URL);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "jwt") {
		const validator = addConstant(ctx, isValidJWT);
		const alg = addConstant(ctx, def.alg ?? null);
		doc.write(`if (!${validator}(${accessor}, ${alg})) return INVALID;`);
		return accessor;
	}
	if (fmt === "ipv6") {
		const validator = addConstant(ctx, isValidIPv6);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "cidrv6") {
		const validator = addConstant(ctx, isValidCIDRv6);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "credit_card") {
		const validator = addConstant(ctx, isValidCreditCard);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	const formatDef = def;
	if (fmt === "url" || fmt === "httpurl" || formatDef.normalize || formatDef.hostname !== void 0 || formatDef.protocol !== void 0) {
		const parseConst = addConstant(ctx, parseURLObject);
		const defConst = addConstant(ctx, def);
		const trimVar = newVar(ctx);
		const urlVar = newVar(ctx);
		doc.write(`const ${trimVar} = ${accessor}.trim();`);
		doc.write(`const ${urlVar} = ${parseConst}(${trimVar}, ${defConst});`);
		doc.write(`if (typeof ${urlVar} === "number") return INVALID;`);
		if (formatDef.hostname !== void 0) {
			const hostnameConst = addConstant(ctx, urlHostnameOk);
			doc.write(`if (!${hostnameConst}(${urlVar}, ${defConst}.hostname)) return INVALID;`);
		}
		if (formatDef.protocol !== void 0) {
			const protocolConst = addConstant(ctx, urlProtocolOk);
			doc.write(`if (!${protocolConst}(${urlVar}, ${defConst}.protocol)) return INVALID;`);
		}
		const outputVar = newVar(ctx);
		const outputExpr = formatDef.normalize ? `${urlVar}.href` : `${addConstant(ctx, stripTabAndNewline)}(${trimVar})`;
		doc.write(`const ${outputVar} = ${outputExpr};`);
		return outputVar;
	}
	const customFn = def.fn;
	if (customFn) {
		if (isAsyncFunction(customFn)) throw new ZodCompileUnsupportedError(`async string format ${fmt}`);
		const fnConst = addConstant(ctx, customFn);
		doc.write(`if (!${fnConst}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (PATTERN_IS_COMPLETE.has(fmt) && def.pattern) {
		const patternConst = addConstant(ctx, def.pattern);
		doc.write(`${patternConst}.lastIndex = 0;`);
		doc.write(`if (!${patternConst}.test(${accessor})) return INVALID;`);
		return accessor;
	}
	const format = def.format;
	switch (format) {
		case "regex": throw new ZodCompileUnsupportedError("regex format without a pattern");
		case "lowercase":
			doc.write(`if (${accessor} !== ${accessor}.toLowerCase()) return INVALID;`);
			break;
		case "uppercase":
			doc.write(`if (${accessor} !== ${accessor}.toUpperCase()) return INVALID;`);
			break;
		case "includes":
			doc.write(`if (!${accessor}.includes(${esc(def.includes)})) return INVALID;`);
			break;
		case "starts_with": {
			const prefix = def.prefix;
			doc.write(`if (${accessor}.slice(0, ${prefix.length}) !== ${esc(prefix)}) return INVALID;`);
			break;
		}
		case "ends_with": {
			const suffix = def.suffix;
			doc.write(`if (${accessor}.slice(-${suffix.length}) !== ${esc(suffix)}) return INVALID;`);
			break;
		}
		default: throw new ZodCompileUnsupportedError(`string format ${format}`);
	}
	return accessor;
}
function generateCheck(doc, ctx, schema, accessor, needsValue = true) {
	const def = schema._zod.def;
	const type = def.type;
	if (def.coerce) throw new ZodCompileUnsupportedError(`coercion (z.coerce.${type}())`);
	const buildsValue = needsValue || !!def.checks?.length;
	let typeAccessor;
	switch (type) {
		case "string":
			typeAccessor = generateStringCheck(doc, ctx, schema, accessor);
			break;
		case "number":
			typeAccessor = generateNumberCheck(doc, schema, accessor);
			break;
		case "boolean":
			typeAccessor = generateBooleanCheck(doc, accessor);
			break;
		case "bigint":
			typeAccessor = generateBigIntCheck(doc, schema, accessor);
			break;
		case "symbol":
			typeAccessor = generateSymbolCheck(doc, accessor);
			break;
		case "undefined":
			typeAccessor = generateUndefinedCheck(doc, accessor);
			break;
		case "null":
			typeAccessor = generateNullCheck(doc, accessor);
			break;
		case "any":
		case "unknown":
			typeAccessor = accessor;
			break;
		case "never":
			doc.write("return INVALID;");
			typeAccessor = accessor;
			break;
		case "void":
			typeAccessor = generateVoidCheck(doc, accessor);
			break;
		case "nan":
			typeAccessor = generateNaNCheck(doc, accessor);
			break;
		case "date":
			typeAccessor = generateDateCheck(doc, accessor);
			break;
		case "object":
			typeAccessor = generateObjectCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "optional":
			typeAccessor = generateOptionalCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "nullable":
			typeAccessor = generateNullableCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "array":
			typeAccessor = generateArrayCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "literal":
			typeAccessor = generateLiteralCheck(doc, ctx, schema, accessor);
			break;
		case "enum":
			typeAccessor = generateEnumCheck(doc, ctx, schema, accessor);
			break;
		case "readonly": {
			const innerOut = generateWrapperCheck(doc, ctx, schema, accessor);
			const frozenVar = newVar(ctx);
			doc.write(`const ${frozenVar} = Object.freeze(${innerOut});`);
			typeAccessor = frozenVar;
			break;
		}
		case "success":
			generateWrapperCheck(doc, ctx, schema, accessor);
			typeAccessor = "true";
			break;
		case "default":
		case "prefault":
			typeAccessor = generateDefaultCheck(doc, ctx, schema, accessor);
			break;
		case "nonoptional":
			typeAccessor = generateNonOptionalCheck(doc, ctx, schema, accessor);
			break;
		case "tuple":
			typeAccessor = generateTupleCheck(doc, ctx, schema, accessor);
			break;
		case "union":
			typeAccessor = generateUnionCheck(doc, ctx, schema, accessor);
			break;
		case "intersection":
			typeAccessor = generateIntersectionCheck(doc, ctx, schema, accessor);
			break;
		case "record":
			typeAccessor = generateRecordCheck(doc, ctx, schema, accessor);
			break;
		case "map":
			typeAccessor = generateMapCheck(doc, ctx, schema, accessor);
			break;
		case "set":
			typeAccessor = generateSetCheck(doc, ctx, schema, accessor);
			break;
		case "file":
			typeAccessor = generateFileCheck(doc, accessor);
			break;
		case "template_literal":
			typeAccessor = generateTemplateLiteralCheck(doc, ctx, schema, accessor);
			break;
		case "lazy":
			typeAccessor = generateLazyCheck(doc, ctx, schema, accessor);
			break;
		case "pipe":
			typeAccessor = generatePipeCheck(doc, ctx, schema, accessor);
			break;
		case "custom":
			typeAccessor = generateCustomCheck(doc, ctx, schema, accessor);
			break;
		case "transform":
			typeAccessor = generateTransformCheck(doc, ctx, schema, accessor);
			break;
		case "catch":
			typeAccessor = generateCatchCheck(doc, ctx, schema, accessor);
			break;
		default: throw new ZodCompileUnsupportedError(`schema type ${type}`);
	}
	if (typeAccessor === null) return null;
	return generateChecks(doc, ctx, schema, typeAccessor);
}
function generateStringCheck(doc, ctx, schema, accessor) {
	doc.write(`if (typeof ${accessor} !== "string") return INVALID;`);
	const def = schema._zod.def;
	if (def.format === void 0) return accessor;
	return generateStringFormatCheck(doc, ctx, def, accessor);
}
function generateNumberCheck(doc, schema, accessor) {
	doc.write(`if (typeof ${accessor} !== "number" || !Number.isFinite(${accessor})) return INVALID;`);
	const def = schema._zod.def;
	if (def.check === "number_format" && def.format) generateNumberFormatCheck(doc, { format: def.format }, accessor);
	return accessor;
}
function generateBooleanCheck(doc, accessor) {
	doc.write(`if (typeof ${accessor} !== "boolean") return INVALID;`);
	return accessor;
}
function generateBigIntCheck(doc, schema, accessor) {
	doc.write(`if (typeof ${accessor} !== "bigint") return INVALID;`);
	const def = schema._zod.def;
	if (def.format) switch (def.format) {
		case "int64":
			doc.write(`if (${accessor} < -9223372036854775808n || ${accessor} > 9223372036854775807n) return INVALID;`);
			break;
		case "uint64": doc.write(`if (${accessor} < 0n || ${accessor} > 18446744073709551615n) return INVALID;`);
	}
	return accessor;
}
function generateSymbolCheck(doc, accessor) {
	doc.write(`if (typeof ${accessor} !== "symbol") return INVALID;`);
	return accessor;
}
function generateUndefinedCheck(doc, accessor) {
	doc.write(`if (${accessor} !== undefined) return INVALID;`);
	return accessor;
}
function generateNullCheck(doc, accessor) {
	doc.write(`if (${accessor} !== null) return INVALID;`);
	return accessor;
}
function generateVoidCheck(doc, accessor) {
	doc.write(`if (${accessor} !== undefined) return INVALID;`);
	return accessor;
}
function generateNaNCheck(doc, accessor) {
	doc.write(`if (typeof ${accessor} !== "number" || !Number.isNaN(${accessor})) return INVALID;`);
	return accessor;
}
function generateDateCheck(doc, accessor) {
	doc.write(`if (!(${accessor} instanceof Date) || Number.isNaN(${accessor}.getTime())) return INVALID;`);
	return accessor;
}
function generateObjectCheck(doc, ctx, schema, accessor, buildsValue = true) {
	const def = schema._zod.def;
	doc.write(`if (typeof ${accessor} !== "object" || ${accessor} === null || Array.isArray(${accessor})) return INVALID;`);
	const shape = def.shape;
	const keys = Object.keys(shape);
	const symbolKeys = Object.getOwnPropertySymbols(shape);
	const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
	const keyExpr = (k) => typeof k === "symbol" ? addConstant(ctx, k) : esc(k);
	const propKey = (k) => typeof k === "symbol" ? `[${keyExpr(k)}]` : esc(k);
	const propShape = shape;
	if (keys.includes("__proto__")) throw new ZodCompileUnsupportedError("object shape key \"__proto__\"");
	const propOutputs = /* @__PURE__ */ new Map();
	for (const key of allKeys) {
		const propSchema = propShape[key];
		const kx = keyExpr(key);
		const inputVar = newVar(ctx);
		doc.write(`const ${inputVar} = ${accessor}[${kx}];`);
		if (propSchema._zod.optin !== void 0) {
			const outputVar = newVar(ctx);
			doc.write(`let ${outputVar} = (() => {`);
			doc.indented((d) => {
				const outputAccessor = compileChild(d, ctx, propSchema, inputVar);
				d.write(`return ${outputAccessor};`);
			});
			doc.write(`})();`);
			if (propSchema._zod.optout === "optional") {
				doc.write(`if (${outputVar} === INVALID) {`);
				doc.indented((d) => {
					d.write(`if (${kx} in ${accessor}) return INVALID;`);
					d.write(`${outputVar} = undefined;`);
				});
				doc.write(`}`);
			} else doc.write(`if (${outputVar} === INVALID) return INVALID;`);
			propOutputs.set(key, outputVar);
		} else {
			if (requiresPresenceCheck(propSchema)) doc.write(`if (!(${kx} in ${accessor})) return INVALID;`);
			const outputAccessor = compileChild(doc, ctx, propSchema, inputVar, buildsValue);
			if (outputAccessor !== null) propOutputs.set(key, outputAccessor);
		}
	}
	const catchall = def.catchall;
	let unknownKeysMode = "none";
	if (catchall) {
		const catchallType = catchall._zod.def.type;
		if (catchallType === "never") {
			const condition = keys.map((k) => `k !== ${esc(k)}`).join(" && ") || "true";
			doc.write(`for (const k in ${accessor}) {`);
			doc.indented((d) => {
				d.write(`if (${condition}) return INVALID;`);
			});
			doc.write(`}`);
		} else if ((catchallType === "unknown" || catchallType === "any") && !catchall._zod.def.checks?.length) unknownKeysMode = "passthrough";
		else unknownKeysMode = "schema";
	}
	const outputVar = newVar(ctx);
	const hasConditionalKeys = allKeys.some((k) => mayOutputUndefined(propShape[k]) || dropsWhenAbsent(propShape[k]));
	if (!buildsValue) {
		if (unknownKeysMode === "schema") {
			const knownSet = keys.length > 0 ? addConstant(ctx, new Set(keys)) : null;
			doc.write(`for (const k in ${accessor}) {`);
			doc.indented((d) => {
				d.write(`if (k === "__proto__") continue;`);
				if (knownSet) d.write(`if (${knownSet}.has(k)) continue;`);
				const valVar = newVar(ctx);
				d.write(`const ${valVar} = ${accessor}[k];`);
				compileChild(d, ctx, catchall, valVar, false);
			});
			doc.write(`}`);
		}
		return null;
	}
	if (!hasConditionalKeys) {
		const propLiterals = allKeys.map((k) => `${propKey(k)}: ${propOutputs.get(k)}`).join(", ");
		doc.write(`const ${outputVar} = { ${propLiterals} };`);
	} else {
		doc.write(`const ${outputVar} = {};`);
		for (const k of allKeys) {
			const kx = keyExpr(k);
			const out = propOutputs.get(k);
			if (dropsWhenAbsent(propShape[k])) doc.write(`if (${kx} in ${accessor}) ${outputVar}[${kx}] = ${out};`);
			else if (mayOutputUndefined(propShape[k])) doc.write(`if (${out} !== undefined || ${kx} in ${accessor}) ${outputVar}[${kx}] = ${out};`);
			else doc.write(`${outputVar}[${kx}] = ${out};`);
		}
	}
	if (unknownKeysMode !== "none") {
		const knownSet = keys.length > 0 ? addConstant(ctx, new Set(keys)) : null;
		doc.write(`for (const k in ${accessor}) {`);
		doc.indented((d) => {
			d.write(`if (k === "__proto__") continue;`);
			if (knownSet) d.write(`if (${knownSet}.has(k)) continue;`);
			if (unknownKeysMode === "passthrough") d.write(`${outputVar}[k] = ${accessor}[k];`);
			else {
				const valVar = newVar(ctx);
				d.write(`const ${valVar} = ${accessor}[k];`);
				const catchallOut = compileChild(d, ctx, catchall, valVar);
				d.write(`${outputVar}[k] = ${catchallOut};`);
			}
		});
		doc.write(`}`);
	}
	return outputVar;
}
function generateOptionalCheck(doc, ctx, schema, accessor, buildsValue = true) {
	const def = schema._zod.def;
	if (isExactOptional(schema)) return generateCheck(doc, ctx, def.innerType, accessor, buildsValue);
	if (def.innerType._zod.optin === "defaulted") {
		const outputVar = newVar(ctx);
		const branchVar = newVar(ctx);
		doc.write(`let ${outputVar};`);
		doc.write(`if (${accessor} === undefined) {`);
		doc.indented((d) => {
			d.write(`const ${branchVar} = (() => {`);
			d.indented((d2) => {
				const innerOutput = generateCheck(d2, ctx, def.innerType, accessor);
				d2.write(`return ${innerOutput};`);
			});
			d.write(`})();`);
			d.write(`if (${branchVar} !== INVALID) ${outputVar} = ${branchVar};`);
		});
		doc.write(`} else {`);
		doc.indented((d) => {
			const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
			d.write(`${outputVar} = ${innerOutput};`);
		});
		doc.write(`}`);
		return outputVar;
	}
	const outputVar = buildsValue ? newVar(ctx) : null;
	if (outputVar) doc.write(`let ${outputVar};`);
	doc.write(`if (${accessor} !== undefined) {`);
	doc.indented((d) => {
		const innerOutput = generateCheck(d, ctx, def.innerType, accessor, buildsValue);
		if (outputVar && innerOutput !== null) d.write(`${outputVar} = ${innerOutput};`);
	});
	doc.write(`}`);
	return outputVar;
}
function isExactOptional(schema) {
	return schema._zod.traits?.has("$ZodExactOptional") === true;
}
function requiresPresenceCheck(schema) {
	return schema._zod.optin === void 0 && fastPathAcceptsAbsence(schema);
}
function fastPathAcceptsAbsence(schema) {
	if (schema._zod.def.coerce) return true;
	const def = schema._zod.def;
	switch (def.type) {
		case "any":
		case "unknown":
		case "undefined":
		case "void":
		case "default":
		case "prefault":
		case "transform":
		case "custom":
		case "lazy": return true;
		case "string":
		case "number":
		case "boolean":
		case "bigint":
		case "symbol":
		case "null":
		case "never":
		case "nan":
		case "date":
		case "object":
		case "array":
		case "tuple":
		case "record":
		case "map":
		case "set":
		case "file":
		case "template_literal": return false;
		case "nonoptional": return def.innerType ? fastPathAcceptsAbsence(def.innerType) : false;
		case "literal": return !!def.values?.includes(void 0);
		case "enum": return !!schema._zod.values?.has(void 0);
		case "optional":
		case "nullable":
		case "readonly":
		case "success": return def.innerType ? fastPathAcceptsAbsence(def.innerType) : true;
		case "catch": return true;
		case "union": return def.options ? def.options.some(fastPathAcceptsAbsence) : true;
		case "intersection":
			if (!def.left || !def.right) return true;
			return fastPathAcceptsAbsence(def.left) && fastPathAcceptsAbsence(def.right);
		case "pipe": return def.in ? fastPathAcceptsAbsence(def.in) : true;
		default: return true;
	}
}
/** The middle rung permits absence without supplying anything in its place, so an absent key contributes nothing — mirrors the leading gate in `handlePropertyResult`. */
function dropsWhenAbsent(schema) {
	return schema._zod.optin === "optional" && schema._zod.optout === "optional";
}
function mayOutputUndefined(schema) {
	const def = schema._zod.def;
	switch (def.type) {
		case "string":
		case "number":
		case "boolean":
		case "bigint":
		case "symbol":
		case "null":
		case "nan":
		case "date":
		case "object":
		case "array":
		case "tuple":
		case "record":
		case "map":
		case "set":
		case "file":
		case "template_literal":
		case "never":
		case "success": return false;
		case "literal": return !!def.values?.includes(void 0);
		case "enum": return !!schema._zod.values?.has(void 0);
		case "optional": return true;
		case "nullable":
		case "readonly":
		case "nonoptional": return def.innerType ? mayOutputUndefined(def.innerType) : true;
		case "union": return def.options ? def.options.some(mayOutputUndefined) : true;
		case "intersection": return !def.left || !def.right || mayOutputUndefined(def.left) || mayOutputUndefined(def.right);
		case "pipe": return def.out ? mayOutputUndefined(def.out) : true;
		default: return true;
	}
}
function generateNullableCheck(doc, ctx, schema, accessor, buildsValue = true) {
	const def = schema._zod.def;
	const outputVar = buildsValue ? newVar(ctx) : null;
	if (outputVar) doc.write(`let ${outputVar} = null;`);
	doc.write(`if (${accessor} !== null) {`);
	doc.indented((d) => {
		const innerOutput = generateCheck(d, ctx, def.innerType, accessor, buildsValue);
		if (outputVar && innerOutput !== null) d.write(`${outputVar} = ${innerOutput};`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateArrayCheck(doc, ctx, schema, accessor, buildsValue = true) {
	const def = schema._zod.def;
	doc.write(`if (!Array.isArray(${accessor})) return INVALID;`);
	const outputVar = buildsValue ? newVar(ctx) : null;
	const iVar = newVar(ctx);
	const elemVar = newVar(ctx);
	if (outputVar) doc.write(`const ${outputVar} = new Array(${accessor}.length);`);
	doc.write(`for (let ${iVar} = 0; ${iVar} < ${accessor}.length; ${iVar}++) {`);
	doc.indented((d) => {
		d.write(`const ${elemVar} = ${accessor}[${iVar}];`);
		const elemOutput = compileChild(d, ctx, def.element, elemVar, buildsValue);
		if (outputVar && elemOutput !== null) d.write(`${outputVar}[${iVar}] = ${elemOutput};`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateLiteralCheck(doc, ctx, schema, accessor) {
	const values = schema._zod.def.values;
	if (values.length !== 1) {
		const literalSet = addConstant(ctx, new Set(values));
		doc.write(`if (!${literalSet}.has(${accessor})) return INVALID;`);
		return accessor;
	}
	const value = values[0];
	if (typeof value === "number" && Number.isNaN(value)) {
		const literalSet = addConstant(ctx, new Set(values));
		doc.write(`if (!${literalSet}.has(${accessor})) return INVALID;`);
		return accessor;
	}
	if (typeof value === "string") doc.write(`if (${accessor} !== ${esc(value)}) return INVALID;`);
	else if (typeof value === "number" || typeof value === "boolean") doc.write(`if (${accessor} !== ${value}) return INVALID;`);
	else if (value === null) doc.write(`if (${accessor} !== null) return INVALID;`);
	else if (value === void 0) doc.write(`if (${accessor} !== undefined) return INVALID;`);
	else if (typeof value === "bigint") doc.write(`if (${accessor} !== ${value}n) return INVALID;`);
	else throw new ZodCompileUnsupportedError(`literal type ${typeof value}`);
	return accessor;
}
function generateEnumCheck(doc, ctx, schema, accessor) {
	const values = schema._zod.values;
	if (!values) throw new ZodCompileUnsupportedError("enum schema without enumerated values");
	const enumSet = addConstant(ctx, values);
	doc.write(`if (!${enumSet}.has(${accessor})) return INVALID;`);
	return accessor;
}
function generateWrapperCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	return generateCheck(doc, ctx, def.innerType, accessor);
}
function generateDefaultCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const defaultGetter = Object.getOwnPropertyDescriptor(schema._zod.def, "defaultValue") ? () => schema._zod.def.defaultValue : void 0;
	if (schema._zod.def.type === "prefault") {
		if (!defaultGetter) return generateCheck(doc, ctx, def.innerType, accessor);
		const defaultFn = addConstant(ctx, defaultGetter);
		const inputVar = newVar(ctx);
		doc.write(`let ${inputVar} = ${accessor};`);
		doc.write(`if (${accessor} === undefined) ${inputVar} = ${defaultFn}();`);
		return generateCheck(doc, ctx, def.innerType, inputVar);
	}
	const outputVar = newVar(ctx);
	if (defaultGetter) {
		const defaultFn = addConstant(ctx, defaultGetter);
		const cloneFn = addConstant(ctx, shallowClone);
		doc.write(`let ${outputVar};`);
		doc.write(`if (${accessor} === undefined) {`);
		doc.indented((d) => {
			d.write(`${outputVar} = ${cloneFn}(${defaultFn}());`);
		});
		doc.write(`} else {`);
		doc.indented((d) => {
			const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
			d.write(`${outputVar} = ${innerOutput} === undefined ? ${cloneFn}(${defaultFn}()) : ${innerOutput};`);
		});
		doc.write(`}`);
	} else {
		doc.write(`let ${outputVar};`);
		doc.write(`if (${accessor} !== undefined) {`);
		doc.indented((d) => {
			const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
			d.write(`${outputVar} = ${innerOutput};`);
		});
		doc.write(`}`);
	}
	return outputVar;
}
function generateNonOptionalCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const innerOutput = generateCheck(doc, ctx, def.innerType, accessor);
	const outputVar = newVar(ctx);
	doc.write(`const ${outputVar} = ${innerOutput};`);
	doc.write(`if (${outputVar} === undefined) return INVALID;`);
	return outputVar;
}
function generateTupleCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const items = def.items;
	const rest = def.rest;
	doc.write(`if (!Array.isArray(${accessor})) return INVALID;`);
	const optinStart = getTupleOptStart(items, "optin");
	const optoutStart = getTupleOptStart(items, "optout");
	if (rest) doc.write(`if (${accessor}.length < ${optinStart}) return INVALID;`);
	else doc.write(`if (${accessor}.length < ${optinStart} || ${accessor}.length > ${items.length}) return INVALID;`);
	const outputVar = newVar(ctx);
	doc.write(`const ${outputVar} = [];`);
	for (let i = 0; i < items.length; i++) {
		const itemSchema = items[i];
		if (i >= optoutStart) {
			doc.write(`if (${outputVar}.length === ${i}) {`);
			doc.indented((d) => {
				d.write(`if (${i} < ${accessor}.length) {`);
				d.indented((d2) => {
					const elemVar = newVar(ctx);
					d2.write(`const ${elemVar} = ${accessor}[${i}];`);
					const elemOutput = compileChild(d2, ctx, itemSchema, elemVar);
					d2.write(`${outputVar}[${i}] = ${elemOutput};`);
				});
				d.write(`} else {`);
				d.indented((d2) => {
					if (dropsWhenAbsent(itemSchema)) {
						d2.write(`${outputVar}.length = ${i};`);
						return;
					}
					const elemVar = newVar(ctx);
					const branchVar = newVar(ctx);
					d2.write(`const ${elemVar} = undefined;`);
					d2.write(`const ${branchVar} = (() => {`);
					d2.indented((d3) => {
						const elemOutput = compileChild(d3, ctx, itemSchema, elemVar);
						d3.write(`return ${elemOutput};`);
					});
					d2.write(`})();`);
					d2.write(`if (${branchVar} === INVALID || ${branchVar} === undefined) ${outputVar}.length = ${i};`);
					d2.write(`else ${outputVar}[${i}] = ${branchVar};`);
				});
				d.write(`}`);
			});
			doc.write(`}`);
		} else {
			const elemVar = newVar(ctx);
			doc.write(`const ${elemVar} = ${accessor}[${i}];`);
			const elemOutput = compileChild(doc, ctx, itemSchema, elemVar);
			doc.write(`${outputVar}[${i}] = ${elemOutput};`);
		}
	}
	if (rest) {
		const iVar = newVar(ctx);
		const elemVar = newVar(ctx);
		doc.write(`for (let ${iVar} = ${items.length}; ${iVar} < ${accessor}.length; ${iVar}++) {`);
		doc.indented((d) => {
			d.write(`const ${elemVar} = ${accessor}[${iVar}];`);
			const elemOutput = compileChild(d, ctx, rest, elemVar);
			d.write(`${outputVar}[${iVar}] = ${elemOutput};`);
		});
		doc.write(`}`);
	}
	return outputVar;
}
function getTupleOptStart(items, key) {
	for (let i = items.length - 1; i >= 0; i--) if (!(key === "optin" ? items[i]._zod.optin !== void 0 : items[i]._zod.optout === "optional")) return i + 1;
	return 0;
}
function generateUnionCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const options = def.options;
	if (def.discriminator) return generateDiscriminatedUnionCheck(doc, ctx, def, accessor);
	if (def.inclusive === false) throw new ZodCompileUnsupportedError("exclusive unions (z.xor)");
	if (options.length === 0) {
		doc.write("return INVALID;");
		return accessor;
	}
	if (options.length === 1) return generateCheck(doc, ctx, options[0], accessor);
	if (options.every((opt) => opt._zod.def.type === "literal" && !opt._zod.def.checks?.length)) {
		const valuesConst = addConstant(ctx, new Set(options.flatMap((opt) => opt._zod.def.values)));
		doc.write(`if (!${valuesConst}.has(${accessor})) return INVALID;`);
		return accessor;
	}
	const outputVar = newVar(ctx);
	doc.write(`let ${outputVar};`);
	for (let i = 0; i < options.length; i++) {
		const opt = options[i];
		if (i === 0) doc.write(`${outputVar} = (() => {`);
		else doc.write(`if (${outputVar} === INVALID) ${outputVar} = (() => {`);
		doc.indented((d) => {
			const branchOutput = generateCheck(d, ctx, opt, accessor);
			d.write(`return ${branchOutput};`);
		});
		doc.write(`})();`);
	}
	doc.write(`if (${outputVar} === INVALID) return INVALID;`);
	return outputVar;
}
function generateDiscriminatedUnionCheck(doc, ctx, def, accessor) {
	if (def.unionFallback) throw new ZodCompileUnsupportedError("discriminated union with unionFallback");
	if (def.options.length === 0) {
		doc.write("return INVALID;");
		return accessor;
	}
	const discVar = newVar(ctx);
	const outputVar = newVar(ctx);
	doc.write(`const ${discVar} = ${accessor}?.[${esc(def.discriminator)}];`);
	doc.write(`let ${outputVar};`);
	let firstBranch = true;
	const claimed = /* @__PURE__ */ new Set();
	for (const option of def.options) {
		const values = option._zod.propValues?.[def.discriminator];
		if (!values || values.size === 0) throw new ZodCompileUnsupportedError("discriminated union option without static discriminator values");
		for (const value of values) {
			if (claimed.has(value)) throw new ZodCompileUnsupportedError(`duplicate discriminator value ${String(value)}`);
			claimed.add(value);
		}
		const conditions = Array.from(values, (value) => literalEquality(ctx, discVar, value));
		const prefix = firstBranch ? "if" : "else if";
		doc.write(`${prefix} (${conditions.join(" || ")}) {`);
		doc.indented((d) => {
			const branchOutput = generateCheck(d, ctx, option, accessor);
			d.write(`${outputVar} = ${branchOutput};`);
		});
		doc.write(`}`);
		firstBranch = false;
	}
	doc.write(`else { return INVALID; }`);
	return outputVar;
}
function literalEquality(ctx, accessor, value) {
	if (typeof value === "string") return `${accessor} === ${esc(value)}`;
	if (typeof value === "number") {
		if (Number.isNaN(value)) return `Number.isNaN(${accessor})`;
		return `${accessor} === ${value}`;
	}
	if (typeof value === "boolean") return `${accessor} === ${value}`;
	if (value === null) return `${accessor} === null`;
	if (value === void 0) return `${accessor} === undefined`;
	if (typeof value === "bigint") return `${accessor} === ${value}n`;
	if (typeof value === "symbol") return `${accessor} === ${addConstant(ctx, value)}`;
	throw new ZodCompileUnsupportedError(`literal discriminator value ${String(value)}`);
}
function generateIntersectionCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const leftOutput = compileChild(doc, ctx, def.left, accessor);
	const rightOutput = compileChild(doc, ctx, def.right, accessor);
	const mergeConst = addConstant(ctx, mergeValues);
	const mergedVar = newVar(ctx);
	doc.write(`const ${mergedVar} = ${mergeConst}(${leftOutput}, ${rightOutput});`);
	doc.write(`if (!${mergedVar}.valid) return INVALID;`);
	return `${mergedVar}.data`;
}
function generateRecordCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const isPlainObjectConst = addConstant(ctx, isPlainObject);
	doc.write(`if (!${isPlainObjectConst}(${accessor})) return INVALID;`);
	const outputVar = newVar(ctx);
	const kVar = newVar(ctx);
	const valVar = newVar(ctx);
	doc.write(`const ${outputVar} = {};`);
	const recordDef = def;
	const keyValues = recordDef.partial ? void 0 : def.keyType._zod.values;
	if (keyValues) {
		const inputKeys = [];
		for (const key of keyValues) {
			if (!(typeof key === "string" || typeof key === "number" || typeof key === "symbol")) throw new ZodCompileUnsupportedError(`record key value ${String(key)}`);
			const inputKey = typeof key === "number" ? key.toString() : key;
			if (inputKey === "__proto__") throw new ZodCompileUnsupportedError("record key \"__proto__\"");
			inputKeys.push(inputKey);
			const keyConst = addConstant(ctx, key);
			const outKey = generateCheck(doc, ctx, def.keyType, keyConst);
			const valueVar = newVar(ctx);
			doc.write(`const ${valueVar} = ${accessor}[${literalPropertyKey(ctx, inputKey)}];`);
			const valOutput = compileChild(doc, ctx, def.valueType, valueVar);
			doc.write(`${outputVar}[${outKey}] = ${valOutput};`);
		}
		const knownKeysConst = addConstant(ctx, new Set(inputKeys));
		doc.write(`for (const ${kVar} in ${accessor}) {`);
		doc.indented((d) => {
			d.write(`if (${knownKeysConst}.has(${kVar})) continue;`);
			if (recordDef.mode === "loose") d.write(`if (${kVar} !== "__proto__") ${outputVar}[${kVar}] = ${accessor}[${kVar}];`);
			else d.write(`return INVALID;`);
		});
		doc.write(`}`);
		return outputVar;
	}
	const keyDef = def.keyType._zod.def;
	if (!(keyDef.type === "string" && keyDef.format === void 0 && !keyDef.coerce && (keyDef.checks?.length ?? 0) === 0)) {
		const isLoose = def.mode === "loose";
		const keyFast = addConstant(ctx, compileFn(def.keyType));
		const numericConst = addConstant(ctx, number$1);
		const propIsEnumerableConst = addConstant(ctx, Object.prototype.propertyIsEnumerable);
		const outKeyVar = newVar(ctx);
		doc.write(`for (const ${kVar} of Reflect.ownKeys(${accessor})) {`);
		doc.indented((d) => {
			d.write(`if (${kVar} === "__proto__") continue;`);
			d.write(`if (!${propIsEnumerableConst}.call(${accessor}, ${kVar})) continue;`);
			d.write(`let ${outKeyVar} = ${keyFast}(${kVar});`);
			d.write(`if (${outKeyVar} === INVALID && typeof ${kVar} === "string" && ${numericConst}.test(${kVar})) ${outKeyVar} = ${keyFast}(Number(${kVar}));`);
			if (isLoose) d.write(`if (${outKeyVar} === INVALID) { ${outputVar}[${kVar}] = ${accessor}[${kVar}]; continue; }`);
			else d.write(`if (${outKeyVar} === INVALID) return INVALID;`);
			d.write(`if (${outKeyVar} === "__proto__") continue;`);
			const valueVar = newVar(ctx);
			d.write(`const ${valueVar} = ${accessor}[${kVar}];`);
			const valOutput = compileChild(d, ctx, def.valueType, valueVar);
			d.write(`${outputVar}[${outKeyVar}] = ${valOutput};`);
		});
		doc.write(`}`);
		return outputVar;
	}
	const propIsEnumerable = addConstant(ctx, Object.prototype.propertyIsEnumerable);
	doc.write(`for (const ${kVar} of Reflect.ownKeys(${accessor})) {`);
	doc.indented((d) => {
		d.write(`if (${kVar} === "__proto__") continue;`);
		d.write(`if (!${propIsEnumerable}.call(${accessor}, ${kVar})) continue;`);
		d.write(`if (typeof ${kVar} !== "string") return INVALID;`);
		d.write(`const ${valVar} = ${accessor}[${kVar}];`);
		const valOutput = compileChild(d, ctx, def.valueType, valVar);
		d.write(`${outputVar}[${kVar}] = ${valOutput};`);
	});
	doc.write(`}`);
	return outputVar;
}
function literalPropertyKey(ctx, key) {
	if (typeof key === "string") return esc(key);
	return addConstant(ctx, key);
}
function generateMapCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	doc.write(`if (!(${accessor} instanceof Map)) return INVALID;`);
	const outputVar = newVar(ctx);
	const kVar = newVar(ctx);
	const valVar = newVar(ctx);
	doc.write(`const ${outputVar} = new Map();`);
	doc.write(`for (const [${kVar}, ${valVar}] of ${accessor}) {`);
	doc.indented((d) => {
		const keyOutput = generateCheck(d, ctx, def.keyType, kVar);
		const valOutput = generateCheck(d, ctx, def.valueType, valVar);
		d.write(`${outputVar}.set(${keyOutput}, ${valOutput});`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateSetCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	doc.write(`if (!(${accessor} instanceof Set)) return INVALID;`);
	const outputVar = newVar(ctx);
	const valVar = newVar(ctx);
	doc.write(`const ${outputVar} = new Set();`);
	doc.write(`for (const ${valVar} of ${accessor}) {`);
	doc.indented((d) => {
		const valOutput = generateCheck(d, ctx, def.valueType, valVar);
		d.write(`${outputVar}.add(${valOutput});`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateFileCheck(doc, accessor) {
	doc.write(`if (!(${accessor} instanceof File)) return INVALID;`);
	return accessor;
}
function generateTemplateLiteralCheck(doc, ctx, schema, accessor) {
	doc.write(`if (typeof ${accessor} !== "string") return INVALID;`);
	const pattern = schema._zod.pattern;
	if (pattern) {
		const patternConst = addConstant(ctx, pattern);
		doc.write(`${patternConst}.lastIndex = 0;`);
		doc.write(`if (!${patternConst}.test(${accessor})) return INVALID;`);
	}
	return accessor;
}
function generateLazyCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const getterConst = addConstant(ctx, def.getter);
	const cacheConst = addConstant(ctx, { parser: null });
	doc.write(`if (!${cacheConst}.parser) {`);
	doc.indented((d) => {
		d.write(`const inner = ${getterConst}();`);
		d.write(`${cacheConst}.parser = function(input) {`);
		d.indented((d2) => {
			d2.write(`const result = inner._zod.run({ value: input, issues: [] }, {});`);
			d2.write(`return result.issues.length === 0 ? result.value : INVALID;`);
		});
		d.write(`};`);
	});
	doc.write(`}`);
	const outputVar = newVar(ctx);
	doc.write(`const ${outputVar} = ${cacheConst}.parser(${accessor});`);
	doc.write(`if (${outputVar} === INVALID) return INVALID;`);
	return outputVar;
}
function generatePipeCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const inputOutput = generateCheck(doc, ctx, def.in, accessor);
	if (def.transform) {
		if (isAsyncFunction(def.transform)) throw new ZodCompileAsyncError("z.compile: async transforms in pipes are not supported");
		const transformFn = def.transform;
		const helperFn = (value) => {
			const fakePayload = {
				value,
				issues: [],
				addIssue: pushIssue
			};
			const result = transformFn(value, fakePayload);
			if (result instanceof Promise) return INVALID;
			return fakePayload.issues.length === 0 ? result : INVALID;
		};
		const helperConst = addConstant(ctx, helperFn);
		const transformedVar = newVar(ctx);
		doc.write(`const ${transformedVar} = ${helperConst}(${inputOutput});`);
		doc.write(`if (${transformedVar} === INVALID) return INVALID;`);
		return generateCheck(doc, ctx, def.out, transformedVar);
	} else return generateCheck(doc, ctx, def.out, inputOutput);
}
function isAsyncFunction(fn) {
	return typeof fn === "function" && (fn.constructor.name === "AsyncFunction" || fn[Symbol.toStringTag] === "AsyncFunction");
}
function generateCustomCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	if (def.fn) {
		if (isAsyncFunction(def.fn)) throw new ZodCompileAsyncError("z.compile: async custom predicates are not supported");
		const fnConst = addConstant(ctx, def.fn);
		const throwAsyncConst = addConstant(ctx, throwAsync);
		const resVar = newVar(ctx);
		doc.write(`const ${resVar} = ${fnConst}(${accessor});`);
		doc.write(`if (${resVar} instanceof Promise) ${throwAsyncConst}();`);
		doc.write(`if (!${resVar}) return INVALID;`);
	} else throw new ZodCompileUnsupportedError("custom schema without a predicate function");
	return accessor;
}
function runtimeCatch(innerSchema, catchValue, value) {
	const result = innerSchema._zod.run({
		value,
		issues: []
	}, {});
	if (result && typeof result.then === "function") return INVALID;
	const r = result;
	if (r.issues.length === 0) return r.value;
	return catchValue();
}
function generateCatchCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	if (!def.catchValue["~constantCatch"]) throw new ZodCompileUnsupportedError("catch with a callback (only a constant catch value compiles)", false);
	const outputVar = newVar(ctx);
	doc.write(`let ${outputVar} = (() => {`);
	doc.indented((d) => {
		const innerOut = compileChild(d, ctx, def.innerType, accessor);
		d.write(`return ${innerOut};`);
	});
	doc.write(`})();`);
	const innerConst = addConstant(ctx, def.innerType);
	const catchConst = addConstant(ctx, def.catchValue);
	const catchHelperConst = addConstant(ctx, runtimeCatch);
	doc.write(`if (${outputVar} === INVALID) {`);
	doc.indented((d) => {
		d.write(`${outputVar} = ${catchHelperConst}(${innerConst}, ${catchConst}, ${accessor});`);
		d.write(`if (${outputVar} === INVALID) return INVALID;`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateTransformCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	if (def.transform) {
		if (isAsyncFunction(def.transform)) throw new ZodCompileAsyncError("z.compile: async transforms are not supported");
		const transformFn = def.transform;
		const helperFn = (value) => {
			const fakePayload = {
				value,
				issues: [],
				addIssue: pushIssue
			};
			const result = transformFn(value, fakePayload);
			if (result instanceof Promise) return INVALID;
			return fakePayload.issues.length === 0 ? result : INVALID;
		};
		const helperConst = addConstant(ctx, helperFn);
		const outputVar = newVar(ctx);
		doc.write(`const ${outputVar} = ${helperConst}(${accessor});`);
		doc.write(`if (${outputVar} === INVALID) return INVALID;`);
		return outputVar;
	}
	return accessor;
}
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _date(Class, params) {
	return new Class({
		type: "date",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
//#endregion
//#region ../node_modules/.pnpm/zod@4.5.0/node_modules/zod/v4/mini/schemas.js
const ZodMiniType = /*@__PURE__*/ $constructor("ZodMiniType", (inst, def) => {
	if (!inst._zod) throw new Error("Uninitialized schema in ZodMiniType.");
	$ZodType.init(inst, def);
	inst.def = def;
	inst.type = def.type;
}, {
	get with() {
		return this.check;
	},
	set with(value) {
		own(this, "with", value);
	},
	parse(data, params) {
		return parse(this, data, params, { callee: this.parse });
	},
	parseAsync(data, params) {
		return parseAsync(this, data, params, { callee: this.parseAsync });
	},
	safeParse(data, params) {
		return safeParse(this, data, params);
	},
	safeParseAsync(data, params) {
		return safeParseAsync(this, data, params);
	},
	check(...checks) {
		const def = this.def;
		return this.clone({
			...def,
			checks: [...def.checks ?? [], ...checks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)]
		}, { parent: true });
	},
	clone(_def, params) {
		return clone(this, _def, params);
	},
	brand() {
		return this;
	},
	register(reg, meta) {
		reg.add(this, meta);
		return this;
	},
	apply(fn, ...args) {
		return args.length === 0 ? fn(this) : fn(this, ...args);
	}
});
const ZodMiniString = /*@__PURE__*/ $constructor("ZodMiniString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function string(params) {
	return /* @__PURE__ */ _string(ZodMiniString, params);
}
const ZodMiniStringFormat = /*@__PURE__*/ $constructor("ZodMiniStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	ZodMiniString.init(inst, def);
});
const ZodMiniURL = /*@__PURE__*/ $constructor("ZodMiniURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodMiniStringFormat.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function url(params) {
	return /* @__PURE__ */ _url(ZodMiniURL, params);
}
const ZodMiniNumber = /*@__PURE__*/ $constructor("ZodMiniNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function number(params) {
	return /* @__PURE__ */ _number(ZodMiniNumber, params);
}
const ZodMiniDate = /*@__PURE__*/ $constructor("ZodMiniDate", (inst, def) => {
	$ZodDate.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function date(params) {
	return /* @__PURE__ */ _date(ZodMiniDate, params);
}
const ZodMiniArray = /*@__PURE__*/ $constructor("ZodMiniArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function array(element, params) {
	return new ZodMiniArray({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
const ZodMiniObject = /*@__PURE__*/ $constructor("ZodMiniObject", (inst, def) => {
	$ZodObject.init(inst, def);
	ZodMiniType.init(inst, def);
	installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
});
// @__NO_SIDE_EFFECTS__
function object(shape, params) {
	const def = {
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	};
	return new ZodMiniObject(def);
}
const ZodMiniEnum = /*@__PURE__*/ $constructor("ZodMiniEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodMiniType.init(inst, def);
	inst.options = Object.values(def.entries);
});
// @__NO_SIDE_EFFECTS__
function _enum(values, params) {
	const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
	return new ZodMiniEnum({
		type: "enum",
		entries,
		...normalizeParams(params)
	});
}
const ZodMiniNullable = /*@__PURE__*/ $constructor("ZodMiniNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function nullable(innerType) {
	return new ZodMiniNullable({
		type: "nullable",
		innerType
	});
}
//#endregion
//#region ../schemas/libraries/zod/mini/download/compile.ts
const imageSchema = /* @__PURE__ */ object({
	id: /* @__PURE__ */ number(),
	created: /* @__PURE__ */ date(),
	title: (/* @__PURE__ */ string()).check(/* @__PURE__ */ _minLength(1), /* @__PURE__ */ _maxLength(100)),
	type: /* @__PURE__ */ _enum(["jpg", "png"]),
	size: /* @__PURE__ */ number(),
	url: /* @__PURE__ */ url()
});
const ratingSchema = /* @__PURE__ */ object({
	id: /* @__PURE__ */ number(),
	stars: (/* @__PURE__ */ number()).check(/* @__PURE__ */ _gte(1), /* @__PURE__ */ _lte(5)),
	title: (/* @__PURE__ */ string()).check(/* @__PURE__ */ _minLength(1), /* @__PURE__ */ _maxLength(100)),
	text: (/* @__PURE__ */ string()).check(/* @__PURE__ */ _minLength(1), /* @__PURE__ */ _maxLength(1e3)),
	images: /* @__PURE__ */ array(imageSchema)
});
compile(/* @__PURE__ */ object({
	id: /* @__PURE__ */ number(),
	created: /* @__PURE__ */ date(),
	title: (/* @__PURE__ */ string()).check(/* @__PURE__ */ _minLength(1), /* @__PURE__ */ _maxLength(100)),
	brand: (/* @__PURE__ */ string()).check(/* @__PURE__ */ _minLength(1), /* @__PURE__ */ _maxLength(30)),
	description: (/* @__PURE__ */ string()).check(/* @__PURE__ */ _minLength(1), /* @__PURE__ */ _maxLength(500)),
	price: (/* @__PURE__ */ number()).check(/* @__PURE__ */ _gte(1), /* @__PURE__ */ _lte(1e4)),
	discount: /* @__PURE__ */ nullable((/* @__PURE__ */ number()).check(/* @__PURE__ */ _gte(1), /* @__PURE__ */ _lte(100))),
	quantity: (/* @__PURE__ */ number()).check(/* @__PURE__ */ _gte(0), /* @__PURE__ */ _lte(10)),
	tags: /* @__PURE__ */ array((/* @__PURE__ */ string()).check(/* @__PURE__ */ _minLength(1), /* @__PURE__ */ _maxLength(30))),
	images: /* @__PURE__ */ array(imageSchema),
	ratings: /* @__PURE__ */ array(ratingSchema)
})).parse({});
//#endregion
