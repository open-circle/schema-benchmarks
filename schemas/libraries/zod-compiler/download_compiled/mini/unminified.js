// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/util.js
function toZod() {
	return (schema) => schema;
}
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
var Cached = class {
	constructor(getter) {
		this._getter = getter;
		this._value = void 0;
	}
	get value() {
		const getter = this._getter;
		if (getter !== void 0) {
			this._value = getter();
			this._getter = void 0;
		}
		return this._value;
	}
};
function cached(getter) {
	return new Cached(getter);
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
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
/** The leading size checks of `defChecks` that set an upper bound, each paired with it. */
function sizeCaps(defChecks) {
	const caps = [];
	for (const ch of defChecks ?? []) {
		const d = ch._zod.def;
		if (!/_(length|size)$|_equals$/.test(d.check)) break;
		const max = d.maximum ?? d.length ?? d.size;
		if (max >= 0) caps.push([max, ch]);
	}
	return caps;
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
	const full = {};
	for (const k of Object.keys(iss)) {
		if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__") continue;
		full[k] = iss[k];
	}
	full.path ?? (full.path = []);
	full.message = message;
	if (ctx?.reportInput) full.input = iss.input;
	return full;
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
			return this == null ? fn : own(this, key, fn.bind(this));
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
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/core.js
var _a;
const _zodDesc = {
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
/* @__NO_SIDE_EFFECTS__ */
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
			_zodDesc.value = new Internals(def);
			try {
				Object.defineProperty(inst, "_zod", _zodDesc);
			} finally {
				_zodDesc.value = void 0;
			}
		} else if (inst._zod.traits.has(name)) return;
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
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/errors.js
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
const _issuesDesc = {
	value: void 0,
	enumerable: false
};
const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
const initializer = (inst, def) => {
	inst.name = "$ZodError";
	_issuesDesc.value = def;
	Object.defineProperty(inst, "issues", _issuesDesc);
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
const $ZodRealError = /* @__PURE__ */ $constructor("$ZodError", initializer, void 0, { Parent: Error });
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/parse.js
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
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
const safeParse = /* @__PURE__*/ _safeParse($ZodRealError);
function failure(Err, issues, ctx) {
	let error;
	return {
		success: false,
		get error() {
			if (!error) {
				error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
				issues = void 0;
				ctx = void 0;
			}
			return error;
		},
		set error(e) {
			error = e;
			issues = void 0;
			ctx = void 0;
		}
	};
}
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
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
const safeParseAsync = /* @__PURE__*/ _safeParseAsync($ZodRealError);
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/regexes.js
const httpProtocol = /^https?$/;
const anyString = /^[\s\S]{0,}$/;
const number$1 = /^-?\d+(?:\.\d+)?$/;
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/checks.js
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
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/versions.js
const version = {
	major: 4,
	minor: 6,
	patch: 7
};
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/schemas.js
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
const toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync(inst, value) {
	const ctx = { async: true };
	return toStandardResult(await inst._zod.run({
		value,
		issues: []
	}, ctx), ctx);
}
function standardProps(inst) {
	return {
		validate: (value) => {
			const ctx = { async: false };
			try {
				const r = inst._zod.run({
					value,
					issues: []
				}, ctx);
				if (!(r instanceof Promise)) return toStandardResult(r, ctx);
			} catch (_) {}
			return validateAsync(inst, value);
		},
		vendor: "zod",
		version: 1
	};
}
const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = def.pattern ?? anyString;
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
function canParseURL(input) {
	try {
		if (typeof URL !== "undefined" && typeof URL.canParse === "function") return URL.canParse(input);
		new URL(input);
		return true;
	} catch {
		return false;
	}
}
function validateURL(trimmed, def) {
	if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) return canParseURL(trimmed) || 2;
	return parseURLObject(trimmed, def);
}
/** Parses a URL while preserving the non-normalizing HTTP guard. */
function parseURLObject(trimmed, def) {
	if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
	try {
		if (typeof URL !== "undefined") {
			const URLStatic = URL;
			if (typeof URLStatic.parse === "function") return URLStatic.parse(trimmed) ?? 2;
		}
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
			const url = validateURL(trimmed, def);
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
			if (url === true) {
				payload.value = stripTabAndNewline(trimmed);
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
const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = number$1;
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
function capSize(inst, size) {
	const caps = sizeCaps(inst._zod.def.checks);
	if (!caps.length) return;
	const cap = Math.min(...caps.map((c) => c[0]));
	const parse = inst._zod.parse;
	inst._zod.parse = (payload, ctx) => {
		const n = size(payload.value);
		if (n > cap && !ctx?.skipChecks && ctx?.direction !== "backward") {
			for (const [max, ch] of sizeCaps(inst._zod.def.checks)) if (n > max && ch._zod.def.when(payload)) {
				const start = payload.issues.length;
				ch._zod.check(payload);
				payload.issues[start].continue = false;
				attachSchema(payload.issues, start, inst);
				return payload;
			}
		}
		return parse(payload, ctx);
	};
}
const arraySize = (input) => Array.isArray(input) ? input.length : -1;
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
		const abortEarly = ctx?.abortEarly;
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else {
				handleArrayResult(result, payload, i);
				if (abortEarly && result.issues.length !== 0 && aborted(result)) break;
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
	capSize(inst, arraySize);
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
		if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
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
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const optin = _catchall.optin;
	const optout = _catchall.optout;
	let seen = 0;
	for (const key in input) {
		if (abortEarly && payload.issues.length !== seen) {
			if (aborted(payload, seen)) break;
			seen = payload.issues.length;
		}
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
const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	const sh = desc?.get ? desc.get.raw : def.shape ?? {};
	if (sh) {
		const get = () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			get.raw = newSh;
			return newSh;
		};
		get.raw = sh;
		Object.defineProperty(def, "shape", { get });
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
		const abortEarly = ctx?.abortEarly;
		let seen = payload.issues.length;
		for (const key of value.allKeys) {
			if (abortEarly && payload.issues.length !== seen) {
				if (aborted(payload, seen)) break;
				seen = payload.issues.length;
			}
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
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
	};
});
const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	defineLazyInternal(inst, "pattern", (zod) => {
		const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
		return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
	});
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
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/memoizer.js
/** Keyed off the context object every schema in one parse call already shares. */
const STATE = "~memo";
function isRef(value) {
	return value !== null && typeof value === "object";
}
/** Whether this value is a node a back-edge resolved to before it finished. */
function isBackEdge(ctx, value) {
	const backEdges = ctx[STATE]?.backEdges;
	return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
	if (def.checks) def.checks = [...def.checks];
	return def;
}
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class(snapshotChecks({
		type: "string",
		...normalizeParams(params)
	}));
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
	return new Class(snapshotChecks({
		type: "number",
		checks: [],
		...normalizeParams(params)
	}));
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
// ../schemas/libraries/zod-compiler/compiled/_zod-compiler-runtime-CZHvs9Es.mjs
function __zcUw(m) {
	return typeof m === "string" ? m : m === void 0 || m === null ? void 0 : m.message;
}
var __zcMsg = function(iss) {
	var c = config(), m;
	if (c.customError) {
		m = __zcUw(c.customError(iss));
		if (m !== void 0 && m !== null) return m;
	}
	if (c.localeError) {
		m = __zcUw(c.localeError(iss));
		if (m !== void 0 && m !== null) return m;
	}
	return "Invalid input";
};
var __ZcFailC = /* @__PURE__ */ (function() {
	function __ZcFailC(e, f, i) {
		this.success = false;
		this._e = e;
		this._f = f;
		this._i = i;
		this._c = void 0;
	}
	Object.defineProperty(__ZcFailC.prototype, "error", {
		configurable: true,
		get: function() {
			if (this._c) return this._c;
			var e = this._f !== null ? this._f(this._i) : this._e;
			for (var i = 0; i < e.length; i++) {
				var s = e[i], o = {}, k;
				if (s.message === void 0 && typeof __zcMsg === "function") s.message = __zcMsg(s);
				for (k in s) if (k !== "input" && k !== "continue" && Object.prototype.hasOwnProperty.call(s, k)) o[k] = s[k];
				e[i] = o;
			}
			return this._c = new $ZodRealError(e);
		}
	});
	return __ZcFailC;
})();
function __ZcFailZ(z, r, i) {
	this.success = false;
	this._z = z;
	this._r = r;
	this._i = i;
	this._c = void 0;
}
Object.defineProperty(__ZcFailZ.prototype, "error", {
	configurable: true,
	get: function() {
		if (this._c) return this._c;
		var p = {};
		p[Symbol.for("zod.compile.fallback")] = true;
		return this._c = this._z.call(this._r, this._i, p).error;
	}
});
function __zcMkv(fn, schema, fc, is, p, v) {
	var w = schema || {};
	var zpa = w.parseAsync, zspa = w.safeParseAsync;
	w.parse = p || (fc ? function parse(input) {
		if (fc(input)) return input;
		var r = fn(input);
		if (r.success) return r.data;
		throw __zcSt(r.error, parse);
	} : function parse(input) {
		var r = fn(input);
		if (r.success) return r.data;
		throw __zcSt(r.error, parse);
	});
	w.safeParse = fn;
	w.safeParseAsync = function(input) {
		try {
			return Promise.resolve(fn(input));
		} catch (e) {
			if (zspa) return zspa(input);
			throw e;
		}
	};
	w.parseAsync = fc ? function parseAsync(input) {
		try {
			if (fc(input)) return Promise.resolve(input);
			var r = fn(input);
			if (r.success) return Promise.resolve(r.data);
			return Promise.reject(__zcSt(r.error, parseAsync));
		} catch (e) {
			if (zpa) return zpa(input);
			throw e;
		}
	} : function parseAsync(input) {
		try {
			var r = fn(input);
			if (r.success) return Promise.resolve(r.data);
			return Promise.reject(__zcSt(r.error, parseAsync));
		} catch (e) {
			if (zpa) return zpa(input);
			throw e;
		}
	};
	w.is = is || function(input) {
		return fn(input).success;
	};
	if (v) v.a = zspa;
	Object.defineProperty(w, "~standard", {
		configurable: true,
		value: {
			version: 1,
			vendor: "zod",
			validate: v || function(input) {
				var r;
				try {
					if (fc && fc(input)) return { value: input };
					r = fn(input);
				} catch (e) {
					if (zspa) return zspa(input).then(function(q) {
						return q.success ? { value: q.data } : { issues: q.error.issues };
					});
					throw e;
				}
				return r.success ? { value: r.data } : { issues: r.error.issues };
			}
		}
	});
	return w;
}
function __zcSt(e, c) {
	var t = Error.captureStackTrace;
	if (typeof t === "function") t(e, c);
	return e;
}
function __zcPu(r, c) {
	if (r.success) return r.data;
	throw __zcSt(r.error, c);
}
function __zcVr(r) {
	return r.success ? { value: r.data } : { issues: r.error.issues };
}
function __zcVc(e, i, v) {
	var a = v.a;
	if (a) return a(i).then(__zcVr);
	throw e;
}
function __zcZr(w, fn, a, v, f) {
	var z = w._zod, l = z.run, o = l.__originalRun || l, p = o === z.parse, k = Symbol.for("zod.compile.fallback"), b = isBackEdge;
	function run(q, c) {
		if (c && (a || c.async === false) && c.direction !== "backward" && !c.skipChecks && !c[k] && !(b && b(c, q.value))) {
			var r;
			if (v) {
				r = v(q.value, 1);
				if (r !== f) {
					q.value = r;
					return q;
				}
			} else {
				r = fn(q.value);
				if (r.success) {
					q.value = r.data;
					return q;
				}
			}
			c[k] = true;
			r = p ? z.parse(q, c) : o(q, c);
			if (!(r instanceof Promise)) c[k] = false;
			return r;
		}
		return p ? z.parse(q, c) : o(q, c);
	}
	run.__originalRun = o;
	z.run = run;
	return w;
}
function __zcFinDC(f, inp) {
	return new __ZcFailC(null, f, inp);
}
function __zcTS(m, o, i, inp, p, msg) {
	var r = {
		origin: o,
		code: "too_small",
		minimum: m,
		inclusive: i,
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcTB(m, o, i, inp, p, msg) {
	var r = {
		origin: o,
		code: "too_big",
		maximum: m,
		inclusive: i,
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIT(e, inp, p, msg) {
	var r = {
		expected: e,
		code: "invalid_type",
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIF(o, f, inp, p, extra, msg) {
	var r = o === void 0 ? {
		code: "invalid_format",
		format: f
	} : {
		origin: o,
		code: "invalid_format",
		format: f
	};
	if (extra) Object.assign(r, extra);
	r.input = inp;
	r.path = p;
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIV(values, inp, p, extra, msg) {
	var r = { code: "invalid_value" };
	if (extra) Object.assign(r, extra);
	r.values = values;
	r.input = inp;
	r.path = p;
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcLo(v) {
	return Array.isArray(v) ? "array" : typeof v === "string" ? "string" : "unknown";
}
function __zcCpl(s) {
	var n = s.length;
	if (!/[\uD800-\uDBFF]/.test(s)) return n;
	var c = n;
	for (var i = 0; i < n - 1; i++) if ((s.charCodeAt(i) & 64512) === 55296 && (s.charCodeAt(i + 1) & 64512) === 56320) {
		c--;
		i++;
	}
	return c;
}
function __zcUrl(s) {
	if (typeof URL === "function" && typeof URL.canParse === "function") return URL.canParse(s);
	try {
		new URL(s);
		return true;
	} catch (_) {
		return false;
	}
}
function __zcPa(p, k) {
	var n = p.length, r = new Array(n + 1);
	for (var i = 0; i < n; i++) r[i] = p[i];
	r[n] = k;
	return r;
}
// ../node_modules/.pnpm/zod@4.6.7/node_modules/zod/v4/mini/schemas.js
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
	inst.options = [...inst._zod.values];
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
// ../schemas/libraries/zod-compiler/compiled/mini.mjs
var __re_tnl_10 = /* @__PURE__ */ new RegExp("[\\t\\n\\r]", "g");
var __re_urlOk_11 = /* @__PURE__ */ new RegExp("^https?:\\/\\/(?:(?!xn--)[a-z0-9-]+\\.)*(?!xn--)[a-z][a-z0-9-]*(?::[0-9]{1,4})?(?:[\\/?#][^\\t\\n\\r]*)?$");
function __zcSw_0(input, path, _e) {
	if (!Array.isArray(input)) _e.push(__zcIT("array", input, path));
	else {
		var __ar_0 = input;
		__ar_0 = __ar_0.slice();
		for (var __i_1 = 0; __i_1 < __ar_0.length; __i_1++) __ar_0[__i_1] = __zcSw_1(__ar_0[__i_1], __zcPa(path, __i_1), _e);
		input = __ar_0;
	}
	return input;
}
function __zcSw_1(input, path, _e) {
	if (typeof input !== "object" || input === null || Array.isArray(input)) _e.push(__zcIT("object", input, path));
	else {
		var __sv_3 = input["id"];
		if (typeof __sv_3 !== "number") _e.push(__zcIT("number", __sv_3, __zcPa(path, "id")));
		else if (Number.isNaN(__sv_3)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: "NaN",
			input: __sv_3,
			path: __zcPa(path, "id")
		});
		else if (!Number.isFinite(__sv_3)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: String(__sv_3),
			input: __sv_3,
			path: __zcPa(path, "id")
		});
		var __sv_4 = input["created"];
		if (!(__sv_4 instanceof Date)) _e.push(__zcIT("date", __sv_4, __zcPa(path, "created")));
		else if (isNaN(__sv_4.getTime())) _e.push({
			expected: "date",
			code: "invalid_type",
			received: "Invalid Date",
			input: __sv_4,
			path: __zcPa(path, "created")
		});
		var __sv_5 = input["title"];
		if (typeof __sv_5 !== "string") {
			_e.push(__zcIT("string", __sv_5, __zcPa(path, "title")));
			if (__sv_5 !== void 0 && __sv_5 !== null && __sv_5.length !== void 0) {
				if (__sv_5.length < 1) _e.push(__zcTS(1, __zcLo(__sv_5), true, __sv_5, __zcPa(path, "title")));
				if (__sv_5.length > 100) _e.push(__zcTB(100, __zcLo(__sv_5), true, __sv_5, __zcPa(path, "title")));
			}
		} else {
			if (__sv_5.length < 1) _e.push(__zcTS(1, "string", true, __sv_5, __zcPa(path, "title")));
			if (__sv_5.length > 100 && (__sv_5.length > 200 || __zcCpl(__sv_5) > 100)) _e.push(__zcTB(100, "string", true, __sv_5, __zcPa(path, "title")));
		}
		var __sv_6 = input["type"];
		if (__sv_6 !== "jpg" && __sv_6 !== "png") _e.push(__zcIV(["jpg", "png"], __sv_6, __zcPa(path, "type")));
		var __sv_7 = input["size"];
		if (typeof __sv_7 !== "number") _e.push(__zcIT("number", __sv_7, __zcPa(path, "size")));
		else if (Number.isNaN(__sv_7)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: "NaN",
			input: __sv_7,
			path: __zcPa(path, "size")
		});
		else if (!Number.isFinite(__sv_7)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: String(__sv_7),
			input: __sv_7,
			path: __zcPa(path, "size")
		});
		var __sv_8 = input["url"];
		if (typeof __sv_8 !== "string") _e.push(__zcIT("string", __sv_8, __zcPa(path, "url")));
		else {
			var __ut_9 = __sv_8.trim();
			if (__re_urlOk_11.test(__ut_9)) __sv_8 = __ut_9;
			else if (!__zcUrl(__ut_9)) _e.push(__zcIF(void 0, "url", __sv_8, __zcPa(path, "url")));
			else __sv_8 = __ut_9.replace(__re_tnl_10, "");
		}
		input = {
			"id": __sv_3,
			"created": __sv_4,
			"title": __sv_5,
			"type": __sv_6,
			"size": __sv_7,
			"url": __sv_8
		};
	}
	return input;
}
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
const productSchema = toZod()(/* @__PURE__ */ object({
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
}));
// ../schemas/libraries/zod-compiler/download/mini.ts
(/* @__PURE__ */ (() => {
	var __bf_16 = {};
	function __af_28(a) {
		for (var __ae_27, i = 0; i < a.length; i++) {
			__ae_27 = a[i];
			if (!(typeof __ae_27 === "string" && __ae_27.length >= 1 && (__ae_27.length <= 30 || __ae_27.length <= 60 && __zcCpl(__ae_27) <= 30))) return false;
		}
		return true;
	}
	function __vc_33(__bp_29) {
		var __ba_30, __bi_31, __be_32;
		if (!Array.isArray(__bp_29)) return __bf_16;
		__ba_30 = new Array(__bp_29.length);
		for (__bi_31 = 0; __bi_31 < __bp_29.length; __bi_31++) {
			__be_32 = __bp_29[__bi_31];
			if (!(typeof __be_32 === "string" && __be_32.length >= 1 && (__be_32.length <= 30 || __be_32.length <= 60 && __zcCpl(__be_32) <= 30))) return __bf_16;
			__ba_30[__bi_31] = __be_32;
		}
		return __ba_30;
	}
	var __re_tnl_47 = /* @__PURE__ */ new RegExp("[\\t\\n\\r]", "g");
	var __re_urlOk_48 = /* @__PURE__ */ new RegExp("^https?:\\/\\/(?:(?!xn--)[a-z0-9-]+\\.)*(?!xn--)[a-z][a-z0-9-]*(?::[0-9]{1,4})?(?:[\\/?#][^\\t\\n\\r]*)?$");
	function __vb_17(input, __zf) {
		var __bv_18, __bv_19, __bv_20, __bv_21, __bv_22, __bv_23, __bv_24, __bv_25, __bv_26, __bz_34, __bv_35, __ba_36, __bi_37, __be_38, __bv_39, __bv_40, __bv_41, __bv_42, __bv_43, __bv_44, __bs_45, __but_46, __bo_49, __bv_50, __ba_51, __bi_52, __be_53, __bv_54, __bv_55, __bv_56, __bv_57, __bv_58, __ba_59, __bi_60, __be_61, __bv_62, __bv_63, __bv_64, __bv_65, __bv_66, __bv_67, __bs_68, __but_69, __bo_70, __bo_71, __bo_72;
		if (typeof input !== "object" || input === null || Array.isArray(input)) return __bf_16;
		__bv_18 = input["id"];
		if (!Number.isFinite(__bv_18)) return __bf_16;
		__bv_19 = input["created"];
		if (!(__bv_19 instanceof Date && !Number.isNaN(__bv_19.getTime()))) return __bf_16;
		__bv_20 = input["title"];
		if (!(typeof __bv_20 === "string" && __bv_20.length >= 1 && (__bv_20.length <= 100 || __bv_20.length <= 200 && __zcCpl(__bv_20) <= 100))) return __bf_16;
		__bv_21 = input["brand"];
		if (!(typeof __bv_21 === "string" && __bv_21.length >= 1 && (__bv_21.length <= 30 || __bv_21.length <= 60 && __zcCpl(__bv_21) <= 30))) return __bf_16;
		__bv_22 = input["description"];
		if (!(typeof __bv_22 === "string" && __bv_22.length >= 1 && (__bv_22.length <= 500 || __bv_22.length <= 1e3 && __zcCpl(__bv_22) <= 500))) return __bf_16;
		__bv_23 = input["price"];
		if (!(Number.isFinite(__bv_23) && __bv_23 >= 1 && __bv_23 <= 1e4)) return __bf_16;
		__bv_24 = input["quantity"];
		if (!(Number.isFinite(__bv_24) && __bv_24 >= 0 && __bv_24 <= 10)) return __bf_16;
		__bv_25 = input["discount"];
		if (!(__bv_25 === null || Number.isFinite(__bv_25) && __bv_25 >= 1 && __bv_25 <= 100)) return __bf_16;
		__bv_26 = input["tags"];
		__bz_34 = __zf ? __vc_33(__bv_26) : Array.isArray(__bv_26) && __af_28(__bv_26) ? __bv_26 : __bf_16;
		if (__bz_34 === __bf_16) return __bf_16;
		__bv_35 = input["images"];
		if (!Array.isArray(__bv_35)) return __bf_16;
		__ba_36 = new Array(__bv_35.length);
		for (__bi_37 = 0; __bi_37 < __bv_35.length; __bi_37++) {
			__be_38 = __bv_35[__bi_37];
			if (typeof __be_38 !== "object" || __be_38 === null || Array.isArray(__be_38)) return __bf_16;
			__bv_39 = __be_38["id"];
			if (!Number.isFinite(__bv_39)) return __bf_16;
			__bv_40 = __be_38["size"];
			if (!Number.isFinite(__bv_40)) return __bf_16;
			__bv_41 = __be_38["created"];
			if (!(__bv_41 instanceof Date && !Number.isNaN(__bv_41.getTime()))) return __bf_16;
			__bv_42 = __be_38["type"];
			if (!(__bv_42 === "jpg" || __bv_42 === "png")) return __bf_16;
			__bv_43 = __be_38["title"];
			if (!(typeof __bv_43 === "string" && __bv_43.length >= 1 && (__bv_43.length <= 100 || __bv_43.length <= 200 && __zcCpl(__bv_43) <= 100))) return __bf_16;
			__bv_44 = __be_38["url"];
			if (typeof __bv_44 !== "string") return __bf_16;
			__bs_45 = __bv_44;
			__but_46 = __bs_45.trim();
			if (__re_urlOk_48.test(__but_46)) __bs_45 = __but_46;
			else {
				if (!__zcUrl(__but_46)) return __bf_16;
				__bs_45 = __but_46.replace(__re_tnl_47, "");
			}
			__bo_49 = {
				"id": __bv_39,
				"created": __bv_41,
				"title": __bv_43,
				"type": __bv_42,
				"size": __bv_40,
				"url": __bs_45
			};
			__ba_36[__bi_37] = __bo_49;
		}
		__bv_50 = input["ratings"];
		if (!Array.isArray(__bv_50)) return __bf_16;
		__ba_51 = new Array(__bv_50.length);
		for (__bi_52 = 0; __bi_52 < __bv_50.length; __bi_52++) {
			__be_53 = __bv_50[__bi_52];
			if (typeof __be_53 !== "object" || __be_53 === null || Array.isArray(__be_53)) return __bf_16;
			__bv_54 = __be_53["id"];
			if (!Number.isFinite(__bv_54)) return __bf_16;
			__bv_55 = __be_53["stars"];
			if (!(Number.isFinite(__bv_55) && __bv_55 >= 1 && __bv_55 <= 5)) return __bf_16;
			__bv_56 = __be_53["title"];
			if (!(typeof __bv_56 === "string" && __bv_56.length >= 1 && (__bv_56.length <= 100 || __bv_56.length <= 200 && __zcCpl(__bv_56) <= 100))) return __bf_16;
			__bv_57 = __be_53["text"];
			if (!(typeof __bv_57 === "string" && __bv_57.length >= 1 && (__bv_57.length <= 1e3 || __bv_57.length <= 2e3 && __zcCpl(__bv_57) <= 1e3))) return __bf_16;
			__bv_58 = __be_53["images"];
			if (!Array.isArray(__bv_58)) return __bf_16;
			__ba_59 = new Array(__bv_58.length);
			for (__bi_60 = 0; __bi_60 < __bv_58.length; __bi_60++) {
				__be_61 = __bv_58[__bi_60];
				if (typeof __be_61 !== "object" || __be_61 === null || Array.isArray(__be_61)) return __bf_16;
				__bv_62 = __be_61["id"];
				if (!Number.isFinite(__bv_62)) return __bf_16;
				__bv_63 = __be_61["size"];
				if (!Number.isFinite(__bv_63)) return __bf_16;
				__bv_64 = __be_61["created"];
				if (!(__bv_64 instanceof Date && !Number.isNaN(__bv_64.getTime()))) return __bf_16;
				__bv_65 = __be_61["type"];
				if (!(__bv_65 === "jpg" || __bv_65 === "png")) return __bf_16;
				__bv_66 = __be_61["title"];
				if (!(typeof __bv_66 === "string" && __bv_66.length >= 1 && (__bv_66.length <= 100 || __bv_66.length <= 200 && __zcCpl(__bv_66) <= 100))) return __bf_16;
				__bv_67 = __be_61["url"];
				if (typeof __bv_67 !== "string") return __bf_16;
				__bs_68 = __bv_67;
				__but_69 = __bs_68.trim();
				if (__re_urlOk_48.test(__but_69)) __bs_68 = __but_69;
				else {
					if (!__zcUrl(__but_69)) return __bf_16;
					__bs_68 = __but_69.replace(__re_tnl_47, "");
				}
				__bo_70 = {
					"id": __bv_62,
					"created": __bv_64,
					"title": __bv_66,
					"type": __bv_65,
					"size": __bv_63,
					"url": __bs_68
				};
				__ba_59[__bi_60] = __bo_70;
			}
			__bo_71 = {
				"id": __bv_54,
				"stars": __bv_55,
				"title": __bv_56,
				"text": __bv_57,
				"images": __ba_59
			};
			__ba_51[__bi_52] = __bo_71;
		}
		__bo_72 = {
			"id": __bv_18,
			"created": __bv_19,
			"title": __bv_20,
			"brand": __bv_21,
			"description": __bv_22,
			"price": __bv_23,
			"discount": __bv_25,
			"quantity": __bv_24,
			"tags": __bz_34,
			"images": __ba_36,
			"ratings": __ba_51
		};
		return __bo_72;
	}
	function __sw_98(input) {
		var _e = [];
		var _d = input;
		if (typeof _d !== "object" || _d === null || Array.isArray(_d)) _e.push(__zcIT("object", _d, []));
		else {
			var __sv_74 = _d["id"];
			if (typeof __sv_74 !== "number") _e.push(__zcIT("number", __sv_74, ["id"]));
			else if (Number.isNaN(__sv_74)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_74,
				path: ["id"]
			});
			else if (!Number.isFinite(__sv_74)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_74),
				input: __sv_74,
				path: ["id"]
			});
			var __sv_75 = _d["created"];
			if (!(__sv_75 instanceof Date)) _e.push(__zcIT("date", __sv_75, ["created"]));
			else if (isNaN(__sv_75.getTime())) _e.push({
				expected: "date",
				code: "invalid_type",
				received: "Invalid Date",
				input: __sv_75,
				path: ["created"]
			});
			var __sv_76 = _d["title"];
			if (typeof __sv_76 !== "string") {
				_e.push(__zcIT("string", __sv_76, ["title"]));
				if (__sv_76 !== void 0 && __sv_76 !== null && __sv_76.length !== void 0) {
					if (__sv_76.length < 1) _e.push(__zcTS(1, __zcLo(__sv_76), true, __sv_76, ["title"]));
					if (__sv_76.length > 100) _e.push(__zcTB(100, __zcLo(__sv_76), true, __sv_76, ["title"]));
				}
			} else {
				if (__sv_76.length < 1) _e.push(__zcTS(1, "string", true, __sv_76, ["title"]));
				if (__sv_76.length > 100 && (__sv_76.length > 200 || __zcCpl(__sv_76) > 100)) _e.push(__zcTB(100, "string", true, __sv_76, ["title"]));
			}
			var __sv_77 = _d["brand"];
			if (typeof __sv_77 !== "string") {
				_e.push(__zcIT("string", __sv_77, ["brand"]));
				if (__sv_77 !== void 0 && __sv_77 !== null && __sv_77.length !== void 0) {
					if (__sv_77.length < 1) _e.push(__zcTS(1, __zcLo(__sv_77), true, __sv_77, ["brand"]));
					if (__sv_77.length > 30) _e.push(__zcTB(30, __zcLo(__sv_77), true, __sv_77, ["brand"]));
				}
			} else {
				if (__sv_77.length < 1) _e.push(__zcTS(1, "string", true, __sv_77, ["brand"]));
				if (__sv_77.length > 30 && (__sv_77.length > 60 || __zcCpl(__sv_77) > 30)) _e.push(__zcTB(30, "string", true, __sv_77, ["brand"]));
			}
			var __sv_78 = _d["description"];
			if (typeof __sv_78 !== "string") {
				_e.push(__zcIT("string", __sv_78, ["description"]));
				if (__sv_78 !== void 0 && __sv_78 !== null && __sv_78.length !== void 0) {
					if (__sv_78.length < 1) _e.push(__zcTS(1, __zcLo(__sv_78), true, __sv_78, ["description"]));
					if (__sv_78.length > 500) _e.push(__zcTB(500, __zcLo(__sv_78), true, __sv_78, ["description"]));
				}
			} else {
				if (__sv_78.length < 1) _e.push(__zcTS(1, "string", true, __sv_78, ["description"]));
				if (__sv_78.length > 500 && (__sv_78.length > 1e3 || __zcCpl(__sv_78) > 500)) _e.push(__zcTB(500, "string", true, __sv_78, ["description"]));
			}
			var __sv_79 = _d["price"];
			if (typeof __sv_79 !== "number") _e.push(__zcIT("number", __sv_79, ["price"]));
			else if (Number.isNaN(__sv_79)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_79,
				path: ["price"]
			});
			else if (!Number.isFinite(__sv_79)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_79),
				input: __sv_79,
				path: ["price"]
			});
			else {
				if (__sv_79 < 1) _e.push(__zcTS(1, "number", true, __sv_79, ["price"]));
				if (__sv_79 > 1e4) _e.push(__zcTB(1e4, "number", true, __sv_79, ["price"]));
			}
			var __sv_80 = _d["discount"];
			if (__sv_80 !== null) {
				if (typeof __sv_80 !== "number") _e.push(__zcIT("number", __sv_80, ["discount"]));
				else if (Number.isNaN(__sv_80)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: "NaN",
					input: __sv_80,
					path: ["discount"]
				});
				else if (!Number.isFinite(__sv_80)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: String(__sv_80),
					input: __sv_80,
					path: ["discount"]
				});
				else {
					if (__sv_80 < 1) _e.push(__zcTS(1, "number", true, __sv_80, ["discount"]));
					if (__sv_80 > 100) _e.push(__zcTB(100, "number", true, __sv_80, ["discount"]));
				}
			}
			var __sv_81 = _d["quantity"];
			if (typeof __sv_81 !== "number") _e.push(__zcIT("number", __sv_81, ["quantity"]));
			else if (Number.isNaN(__sv_81)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_81,
				path: ["quantity"]
			});
			else if (!Number.isFinite(__sv_81)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_81),
				input: __sv_81,
				path: ["quantity"]
			});
			else {
				if (__sv_81 < 0) _e.push(__zcTS(0, "number", true, __sv_81, ["quantity"]));
				if (__sv_81 > 10) _e.push(__zcTB(10, "number", true, __sv_81, ["quantity"]));
			}
			var __sv_82 = _d["tags"];
			if (!Array.isArray(__sv_82)) _e.push(__zcIT("array", __sv_82, ["tags"]));
			else {
				var __ar_83 = __sv_82;
				for (var __i_84 = 0; __i_84 < __ar_83.length; __i_84++) {
					var __mv_85 = __ar_83[__i_84];
					if (typeof __mv_85 !== "string") {
						_e.push(__zcIT("string", __mv_85, ["tags", __i_84]));
						if (__mv_85 !== void 0 && __mv_85 !== null && __mv_85.length !== void 0) {
							if (__mv_85.length < 1) _e.push(__zcTS(1, __zcLo(__mv_85), true, __mv_85, ["tags", __i_84]));
							if (__mv_85.length > 30) _e.push(__zcTB(30, __zcLo(__mv_85), true, __mv_85, ["tags", __i_84]));
						}
					} else {
						if (__mv_85.length < 1) _e.push(__zcTS(1, "string", true, __mv_85, ["tags", __i_84]));
						if (__mv_85.length > 30 && (__mv_85.length > 60 || __zcCpl(__mv_85) > 30)) _e.push(__zcTB(30, "string", true, __mv_85, ["tags", __i_84]));
					}
				}
				__sv_82 = __ar_83;
			}
			var __sv_87 = _d["images"];
			__sv_87 = __zcSw_0(__sv_87, ["images"], _e);
			var __sv_88 = _d["ratings"];
			if (!Array.isArray(__sv_88)) _e.push(__zcIT("array", __sv_88, ["ratings"]));
			else {
				var __ar_89 = __sv_88;
				__ar_89 = __ar_89.slice();
				for (var __i_90 = 0; __i_90 < __ar_89.length; __i_90++) if (typeof __ar_89[__i_90] !== "object" || __ar_89[__i_90] === null || Array.isArray(__ar_89[__i_90])) _e.push(__zcIT("object", __ar_89[__i_90], ["ratings", __i_90]));
				else {
					var __sv_92 = __ar_89[__i_90]["id"];
					if (typeof __sv_92 !== "number") _e.push(__zcIT("number", __sv_92, [
						"ratings",
						__i_90,
						"id"
					]));
					else if (Number.isNaN(__sv_92)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_92,
						path: [
							"ratings",
							__i_90,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_92)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_92),
						input: __sv_92,
						path: [
							"ratings",
							__i_90,
							"id"
						]
					});
					var __sv_93 = __ar_89[__i_90]["stars"];
					if (typeof __sv_93 !== "number") _e.push(__zcIT("number", __sv_93, [
						"ratings",
						__i_90,
						"stars"
					]));
					else if (Number.isNaN(__sv_93)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_93,
						path: [
							"ratings",
							__i_90,
							"stars"
						]
					});
					else if (!Number.isFinite(__sv_93)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_93),
						input: __sv_93,
						path: [
							"ratings",
							__i_90,
							"stars"
						]
					});
					else {
						if (__sv_93 < 1) _e.push(__zcTS(1, "number", true, __sv_93, [
							"ratings",
							__i_90,
							"stars"
						]));
						if (__sv_93 > 5) _e.push(__zcTB(5, "number", true, __sv_93, [
							"ratings",
							__i_90,
							"stars"
						]));
					}
					var __sv_94 = __ar_89[__i_90]["title"];
					if (typeof __sv_94 !== "string") {
						_e.push(__zcIT("string", __sv_94, [
							"ratings",
							__i_90,
							"title"
						]));
						if (__sv_94 !== void 0 && __sv_94 !== null && __sv_94.length !== void 0) {
							if (__sv_94.length < 1) _e.push(__zcTS(1, __zcLo(__sv_94), true, __sv_94, [
								"ratings",
								__i_90,
								"title"
							]));
							if (__sv_94.length > 100) _e.push(__zcTB(100, __zcLo(__sv_94), true, __sv_94, [
								"ratings",
								__i_90,
								"title"
							]));
						}
					} else {
						if (__sv_94.length < 1) _e.push(__zcTS(1, "string", true, __sv_94, [
							"ratings",
							__i_90,
							"title"
						]));
						if (__sv_94.length > 100 && (__sv_94.length > 200 || __zcCpl(__sv_94) > 100)) _e.push(__zcTB(100, "string", true, __sv_94, [
							"ratings",
							__i_90,
							"title"
						]));
					}
					var __sv_95 = __ar_89[__i_90]["text"];
					if (typeof __sv_95 !== "string") {
						_e.push(__zcIT("string", __sv_95, [
							"ratings",
							__i_90,
							"text"
						]));
						if (__sv_95 !== void 0 && __sv_95 !== null && __sv_95.length !== void 0) {
							if (__sv_95.length < 1) _e.push(__zcTS(1, __zcLo(__sv_95), true, __sv_95, [
								"ratings",
								__i_90,
								"text"
							]));
							if (__sv_95.length > 1e3) _e.push(__zcTB(1e3, __zcLo(__sv_95), true, __sv_95, [
								"ratings",
								__i_90,
								"text"
							]));
						}
					} else {
						if (__sv_95.length < 1) _e.push(__zcTS(1, "string", true, __sv_95, [
							"ratings",
							__i_90,
							"text"
						]));
						if (__sv_95.length > 1e3 && (__sv_95.length > 2e3 || __zcCpl(__sv_95) > 1e3)) _e.push(__zcTB(1e3, "string", true, __sv_95, [
							"ratings",
							__i_90,
							"text"
						]));
					}
					var __sv_96 = __ar_89[__i_90]["images"];
					__sv_96 = __zcSw_0(__sv_96, [
						"ratings",
						__i_90,
						"images"
					], _e);
					__ar_89[__i_90] = {
						"id": __sv_92,
						"stars": __sv_93,
						"title": __sv_94,
						"text": __sv_95,
						"images": __sv_96
					};
				}
				__sv_88 = __ar_89;
			}
			_d = {
				"id": __sv_74,
				"created": __sv_75,
				"title": __sv_76,
				"brand": __sv_77,
				"description": __sv_78,
				"price": __sv_79,
				"discount": __sv_80,
				"quantity": __sv_81,
				"tags": __sv_82,
				"images": __sv_87,
				"ratings": __sv_88
			};
		}
		return _e;
	}
	function safeParse_compiledProductSchema(input) {
		var __bd_97 = __vb_17(input);
		if (__bd_97 !== __bf_16) return {
			success: true,
			data: __bd_97
		};
		return __zcFinDC(__sw_98, input);
	}
	function __zp(input) {
		return __zcPu(safeParse_compiledProductSchema(input), __zp);
	}
	function __zv(input) {
		try {
			return __zcVr(safeParse_compiledProductSchema(input));
		} catch (e) {
			return __zcVc(e, input, __zv);
		}
	}
	return __zcZr(__zcMkv(safeParse_compiledProductSchema, productSchema, null, null, __zp, __zv), safeParse_compiledProductSchema, 1, __vb_17, __bf_16);
})()).parse({});
