// ../node_modules/.pnpm/sury@11.1.0/node_modules/sury/index.mjs
var pathEmpty = [];
var hasPathDyn = (path) => {
	for (let i = 0; i < path.length; i++) if (typeof path[i] === "object") return true;
	return false;
};
var inlineUnsafeRe = /["\\\n\r]/;
var inlinedValueFromString = (str) => inlineUnsafeRe.test(str) ? JSON.stringify(str) : `"${str}"`;
var jsIdentRe = /^[A-Za-z_$][\w$]*$/;
var inlinedObjectKey = (key) => key === "__proto__" ? "[\"__proto__\"]" : jsIdentRe.test(key) ? key : inlinedValueFromString(key);
var inlinedProperty = (obj, key, numeric) => numeric && /^\d+$/.test(key) ? `${obj}[${key}]` : key === "__proto__" || !jsIdentRe.test(key) ? `${obj}[${inlinedValueFromString(key)}]` : `${obj}.${key}`;
function pathConcat(path, concatedPath) {
	return path.length ? concatedPath.length ? path.concat(concatedPath) : path : concatedPath;
}
var pathExpr = (path, rest) => {
	let out = "[";
	for (let i = 0; i < path.length; i++) {
		if (i) out += ",";
		const s2 = path[i];
		out += typeof s2 === "object" ? s2.e : typeof s2 === "string" ? inlinedValueFromString(s2) : s2;
	}
	if (rest) out += (path.length ? "," : "") + rest;
	return out + "]";
};
var compilePath = (path) => {
	if (!hasPathDyn(path)) return path;
	const out = [];
	for (let i = 0; i < path.length; i++) {
		const s2 = path[i];
		out.push(typeof s2 === "object" ? "[]" : s2);
	}
	return out;
};
var pathToText = /* @__NO_SIDE_EFFECTS__ */ (path) => {
	let text = "";
	for (let idx = 0; idx < path.length; idx++) {
		const segment = path[idx];
		text += typeof segment !== "string" ? `[${String(segment)}]` : /^\d+$/.test(segment) ? `[${segment}]` : segment === "[]" ? segment : jsIdentRe.test(segment) ? text ? `.${segment}` : segment : `[${inlinedValueFromString(segment)}]`;
	}
	return text;
};
var stringTag = "string";
var numberTag = "number";
var bigintTag = "bigint";
var booleanTag = "boolean";
var symbolTag = "symbol";
var nullTag = "null";
var undefinedTag = "undefined";
var nanTag = "nan";
var functionTag = "function";
var instanceTag = "instance";
var arrayTag = "array";
var objectTag = "object";
var anyOfTag = "anyOf";
var neverTag = "never";
var unknownTag = "unknown";
var refTag = "ref";
var tagFlags = {
	[unknownTag]: 1,
	[stringTag]: 2,
	[numberTag]: 4,
	[booleanTag]: 8,
	[undefinedTag]: 16,
	[nullTag]: 32,
	[objectTag]: 64,
	[arrayTag]: 128,
	[anyOfTag]: 256,
	[refTag]: 512,
	[bigintTag]: 1024,
	[nanTag]: 2048,
	[functionTag]: 4096,
	[instanceTag]: 8192,
	[neverTag]: 32768,
	[symbolTag]: 16384
};
var vendor = "sury";
var s = /* @__PURE__ */ Symbol(vendor);
vendor + "";
var U = void 0;
var immutableEmptyArray = [];
var immutableEmptyObject = /* @__PURE__ */ Object.create(null);
var isSchemaObject = (obj) => typeof obj === objectTag && obj !== null && "~standard" in obj;
var isLiteral = (schema) => "const" in schema;
var isOptional = (schema) => schema.type === undefinedTag || schema.type === anyOfTag && undefinedTag in schema.has;
var namedConstructor = (unknown3) => {
	const ctor = Object.getPrototypeOf(unknown3)?.constructor;
	return ctor !== Object && ctor?.name;
};
var stringifyLeaf = (unknown3) => {
	const tagFlag = tagFlags[typeof unknown3];
	if (tagFlag & 16) return undefinedTag;
	else if (tagFlag & 4160) return unknown3 === null ? nullTag : Array.isArray(unknown3) ? `Array(${unknown3.length})` : namedConstructor(unknown3) || objectTag;
	else if (tagFlag & 2) return `"${unknown3}"`;
	else if (tagFlag & 1024) return `${unknown3}n`;
	else return unknown3.toString();
};
var stringify = (unknown3) => {
	if (unknown3 !== null && typeof unknown3 === objectTag) {
		if (Array.isArray(unknown3)) {
			const items = unknown3;
			let body = "";
			for (let idx = 0; idx < items.length; idx++) {
				if (idx === 5) {
					body += ", ...";
					break;
				}
				body += (idx ? ", " : "") + stringifyLeaf(items[idx]);
			}
			return `[${body}]`;
		}
		if (!namedConstructor(unknown3)) {
			const dict2 = unknown3;
			let body = "";
			let count = 0;
			for (const key in dict2) {
				if (count++ === 5) {
					body += "... ";
					break;
				}
				body += key + ": " + stringifyLeaf(dict2[key]) + "; ";
			}
			return body ? `{ ${body}}` : "{}";
		}
	}
	return stringifyLeaf(unknown3);
};
var inputExpression = /* @__NO_SIDE_EFFECTS__ */ (schema, skipOverride) => {
	if (schema.name) return schema.name;
	else if (schema.const !== U) return stringify(schema.const);
	else if (schema.expression && !skipOverride) return schema.expression(schema);
	else if (schema.anyOf !== U) {
		const seen = /* @__PURE__ */ new Set();
		const add = (s2) => s2.anyOf !== U && !s2.name && !s2.expression ? s2.anyOf.forEach(add) : seen.add(/* @__PURE__ */ inputExpression(s2));
		schema.anyOf.forEach(add);
		for (const e of ["null", "undefined"]) seen.delete(e) && seen.add(e);
		return [...seen].join(" | ");
	} else if (schema.type === objectTag) {
		const properties = schema.properties;
		const additionalItems = schema.additionalItems;
		let body = "";
		for (const location in properties) body += location + ": " + /* @__PURE__ */ inputExpression(properties[location]) + "; ";
		if (typeof additionalItems === objectTag) body += "[key: string]: " + /* @__PURE__ */ inputExpression(additionalItems) + "; ";
		return body ? `{ ${body}}` : "{}";
	} else if (schema.type === arrayTag) {
		const additionalItems = schema.additionalItems;
		if (typeof additionalItems === objectTag) {
			const item = additionalItems;
			const itemName = /* @__PURE__ */ inputExpression(item);
			return (item.type === anyOfTag || item.flags & 30720 || item.multipleOf !== U ? `(${itemName})` : itemName) + "[]";
		}
		const items = schema.items;
		let body = "";
		for (let idx = 0; idx < items.length; idx++) body += (idx ? ", " : "") + /* @__PURE__ */ inputExpression(items[idx]);
		return `[${body}]`;
	} else if (schema.format) return schema.format;
	else if (schema.type === instanceTag) return schema.class.name;
	else return schema.type;
};
var Schema = function() {};
var schemaPrototype = /* @__PURE__ */ Object.create(null);
Object.defineProperty(schemaPrototype, "with", { value(fn, ...args) {
	return fn(this, ...args);
} });
Object.defineProperty(schemaPrototype, "flags", {
	value: 0,
	writable: true
});
Schema.prototype = schemaPrototype;
var reversedKey = "r";
var SelfReverseSchema = function() {};
var selfReversePrototype = Object.create(schemaPrototype);
Object.defineProperty(selfReversePrototype, reversedKey, { get() {
	return this;
} });
Object.defineProperty(selfReversePrototype, "sr", { value: true });
SelfReverseSchema.prototype = selfReversePrototype;
var isOwnSchema = (value) => {
	const proto = typeof value === objectTag && value && Object.getPrototypeOf(value);
	return proto === schemaPrototype || proto === selfReversePrototype;
};
var panicNotSchema = () => panic("Expected a Sury schema");
var seq = 1;
var exnId = {};
var constructed = /* @__PURE__ */ new WeakSet();
var SuryError = class extends Error {
	constructor(params) {
		super();
		Object.assign(this, params);
		constructed.add(this);
	}
	get message() {
		return formatErrorMessage(this);
	}
	get _1() {
		return this;
	}
	get RE_EXN_ID() {
		return exnId;
	}
};
var errorPrototype = SuryError.prototype;
Object.defineProperty(errorPrototype, "name", { value: "SuryError" });
Object.defineProperty(errorPrototype, "s", { value: s });
var toError = (details) => details.s === s ? details : Object.setPrototypeOf(details, errorPrototype);
var renderReason = (error, expectedExpression) => {
	const receivedExpression = stringify(error.input);
	let reason = `Expected ${expectedExpression}, received ${expectedExpression === receivedExpression ? "invalid " : ""}${receivedExpression}`;
	const unionErrors = error.unionErrors;
	if (unionErrors) {
		const seenReasons = /* @__PURE__ */ new Set();
		for (let idx = 0; idx < unionErrors.length; idx++) {
			const caseError = unionErrors[idx];
			const line = `
- ${caseError.path.length ? `At ${/* @__PURE__ */ pathToText(caseError.path)}: ` : ""}${caseError.reason.split("\n").join("\n  ")}`;
			if (!seenReasons.has(line)) {
				seenReasons.add(line);
				reason += line;
			}
		}
	}
	return reason;
};
var reasonSet = function(reason) {
	Object.defineProperty(this, "reason", {
		value: reason,
		configurable: true,
		enumerable: true,
		writable: true
	});
};
Object.defineProperty(errorPrototype, "reason", {
	configurable: true,
	set: reasonSet,
	get() {
		return renderReason(this, /* @__PURE__ */ inputExpression(this.expected));
	}
});
var sitePrototype = Object.create(errorPrototype);
Object.defineProperty(sitePrototype, "reason", {
	configurable: true,
	set: reasonSet,
	get() {
		let site = Object.getPrototypeOf(this);
		if (Object.hasOwn(this, "cause") && this.cause === site) site = Object.getPrototypeOf(site);
		return renderReason(this, site.expectedExpression ?? (site.expectedExpression = /* @__PURE__ */ inputExpression(site.expected)));
	}
});
var errorSite = (expected, received, reasonOverride) => {
	const site = Object.create(sitePrototype);
	site.expected = expected;
	site.received = received;
	if (reasonOverride !== U) site.reason = reasonOverride;
	return site;
};
var conversionPrototype = Object.create(errorPrototype);
Object.defineProperty(conversionPrototype, "reason", {
	value: U,
	writable: true,
	enumerable: true
});
var conversionSite = (from, to2) => {
	const site = Object.create(conversionPrototype);
	site.from = from;
	site.to = to2;
	return site;
};
var errorAt = (site, path, input, unionErrors) => {
	const error = Object.create(site);
	error.code = "invalid_input";
	error.path = path;
	error.input = input;
	if (unionErrors) error.unionErrors = unionErrors;
	return error;
};
var getOrRethrow = (exn) => {
	if (exn && exn.s === s) return exn;
	throw exn;
};
var panic = (message) => {
	throw new Error(`[Sury] ${message}`);
};
var formatErrorMessage = (error) => `${error.path.length ? `Failed at ${/* @__PURE__ */ pathToText(error.path)}: ` : ""}${error.reason}`;
var globalConfig = {
	a: "strip",
	f: 0
};
var valueOptions = {};
var configurableValueOptions = { configurable: true };
var valKey = "value";
var baseSchema = (tag, selfReverse, decoder) => {
	const schema = new (selfReverse ? SelfReverseSchema : Schema)();
	schema.type = tag;
	schema.seq = seq++;
	schema.decoder = decoder;
	return schema;
};
var noopDecoder = (input) => input;
var initSchema = /* @__NO_SIDE_EFFECTS__ */ (tag, decoder, init) => {
	const schema = baseSchema(tag, true, decoder);
	return init?.(schema), schema;
};
var unknown = baseSchema(unknownTag, true, noopDecoder);
var copySchema = (schema) => {
	const c = Object.assign(new Schema(), schema);
	c.seq = seq++;
	return c;
};
var copyTo = (from, to2) => {
	const mut = copySchema(from);
	mut.to = to2;
	return mut;
};
var updateOutput = (schema, fn) => {
	const root = copySchema(schema);
	let mut = root;
	while (mut.to) {
		const next = copySchema(mut.to);
		mut.to = next;
		mut = next;
	}
	fn(mut);
	return root;
};
var setHas = (has, member) => {
	if (member.has) Object.assign(has, member.has);
	else has[tagFlags[member.type] & 768 ? unknownTag : member.type] = true;
};
function _var() {
	return this.i;
}
var _linkVar = function() {
	return (this.b || this.prev).v();
};
function _notVarBeforeValidation() {
	const val = this;
	const v = B_varWithoutAllocation(val.g);
	val.cp = B_let(val.g, v, val.i, val);
	val.i = v;
	val.v = _var;
	return v;
}
function _notVarAtParent() {
	const val = this;
	const parent = val.p;
	if (parent.fz) {
		val.v = _var;
		return val.i;
	}
	const v = B_varWithoutAllocation(val.g);
	B_hoistDecl(parent, v, val.i);
	val.v = _var;
	val.i = v;
	return v;
}
function _notVar() {
	const val = this;
	if (val.fz) {
		val.v = _var;
		val.i = `(${val.i})`;
		return val.i;
	}
	const v = B_varWithoutAllocation(val.g);
	if (val.prev !== U) {
		if (val.i === "") val.cp = B_let(val.g, v, U, val) + val.cp;
		else val.cp += B_let(val.g, v, val.i, val);
	} else B_hoistDecl(val, v, val.i === "" ? U : val.i);
	val.v = _var;
	val.i = v;
	return v;
}
var operationArgVar = "i";
var failInvalidType = (input) => {
	const em = input.e.errorMessage;
	return B_invalidInputBuilder(U, U, em && (input.e.format !== U && em.format !== U ? em.format : em.type !== U ? em.type : em._))(input);
};
var B_embed = (b, value) => (b.g.t++, B_embedPure(b, value));
var B_embedPure = (b, value) => `e[${b.g.e.push(value) - 1}]`;
var B_inlineConst = (b, schema) => {
	const tagFlag = tagFlags[schema.type], const_ = schema.const;
	return tagFlag & 16 ? "void 0" : tagFlag & 2 ? inlinedValueFromString(const_) : tagFlag & 1024 ? const_ + "n" : tagFlag & 28672 ? B_embedPure(b, schema.const) : const_;
};
var B_varWithoutAllocation = (g) => `v${++g.v}`;
var B_let = (g, name, init, owner) => {
	if (!g.c) return `let ${name}${init === U ? "" : `=${init}`};`;
	(owner ? owner.hn || (owner.hn = []) : g.l).push(name);
	return init === U ? "" : `${name}=${init};`;
};
var B_sink = (g, emit) => {
	const outer = g.l;
	if (!outer) return emit();
	const l = g.l = [];
	try {
		const code = emit();
		return code && l.length ? `let ${[...new Set(l)]};${code}` : code;
	} finally {
		g.l = outer;
	}
};
var B_hoistDecl = (owner, name, init) => {
	if (owner.g.c) owner.ha = (owner.ha || "") + B_let(owner.g, name, init, owner);
	else owner.hd += (owner.hd && ",") + (init === U ? name : `${name}=${init}`);
};
var B_operationArg = (schema, expected, flag) => {
	return {
		b: U,
		p: U,
		v: _var,
		i: operationArgVar,
		s: schema,
		io: U,
		e: expected,
		prev: U,
		f: 0,
		d: U,
		fv: U,
		cp: "",
		fu: U,
		fs: U,
		hd: "",
		fz: U,
		vc: U,
		u: U,
		t: U,
		path: pathEmpty,
		g: {
			o: flag,
			e: [],
			v: -1,
			t: 0,
			j: 0,
			x: U
		},
		o: U
	};
};
var B_throw = (errorDetails) => {
	throw toError(errorDetails);
};
var B_unsupportedDecode = (b, from, target) => B_throw({
	code: "unsupported_decode",
	from,
	to: target,
	reason: `Can't decode ${/* @__PURE__ */ inputExpression(from)} -> ${/* @__PURE__ */ inputExpression(target)}. Define custom codec with S.to`,
	path: compilePath(b.path)
});
var B_pathArg = (b) => hasPathDyn(b.path) ? "," + pathExpr(b.path) : "";
var B_pathSnap = (b) => hasPathDyn(b.path) ? U : b.path;
var B_fail = (b, fn, arg, cond) => {
	const exit = b.g.x;
	let jump;
	if (exit) {
		const path = B_pathArg(b);
		let embedded = "";
		jump = exit((unbuilt) => `${embedded || (embedded = B_embedPure(b, fn))}${unbuilt ? `,${arg}${path}` : `(${arg}${path})`}`);
	}
	if (jump === U) {
		const raise = B_failWithArg(b, fn, arg);
		return cond ? `${cond}||${raise};` : raise;
	}
	b.g.j++;
	return cond ? `if(!(${cond}))${jump}${jump[0] === "{" ? "" : ";"}` : jump;
};
var B_childExit = (g, label) => {
	const exit = ((record) => {
		const jump = `break ${label.l || (label.l = `c${++g.v}`)}`;
		if (!record) return jump;
		g.kj = (g.kj || 0) + 1;
		return `{${g.k}=[${g.k},${record(true)}];${jump}}`;
	});
	exit.k = 1;
	return exit;
};
var B_collects = (g) => {
	const k = g.x?.k;
	return typeof k === "function" ? k() : !!k;
};
var B_child = (g, emit) => {
	const x = g.x;
	const y = g.y;
	const raises = g.t;
	const label = {};
	g.x = B_childExit(g, label);
	g.y = () => `break ${label.l || (label.l = `c${++g.v}`)}`;
	g.c = (g.c || 0) + 1;
	try {
		emit();
	} finally {
		g.x = x;
		g.y = y;
		g.c--;
	}
	return (code, val) => {
		if (!code) return code;
		if (g.t !== raises) {
			g.kj = (g.kj || 0) + 1;
			const e = B_varWithoutAllocation(g);
			const errorOf = B_errorOf(val);
			code = `try{${code}}catch(${e}){${g.k}=${B_embedPure(val, (list2, thrown) => thrown?.t === settledTag ? list2 : [list2, errorOf(thrown)])}(${g.k},${e})}`;
		}
		return label.l ? `${label.l}:{${code}}` : code;
	};
};
var B_block = (statement) => statement[0] === "{" ? statement : `{${statement}}`;
var B_detached = (g, body) => {
	const x = g.x, y = g.y;
	g.x = g.y = U;
	try {
		return B_sink(g, body);
	} finally {
		g.x = x;
		g.y = y;
	}
};
var B_then = (param, body, ret) => (settle2) => `${param}=>{${settle2 ? `try{${body}}catch(x){return ${settle2}(x)}` : body}return ${ret}}`;
Promise.prototype.then;
var B_raiser = (b, fn) => B_embed(b, (a, p) => {
	B_throw(fn(a, p));
});
var B_failWithArg = (b, fn, arg) => `${B_raiser(b, fn)}(${arg}${B_pathArg(b)})`;
var B_markThrow = (b) => {
	b.g.t++;
};
var B_foreignFail = (input, to2) => {
	let site;
	return (cause, path) => {
		const error = Object.create(site ?? (site = conversionSite(input.s, to2)));
		error.code = "invalid_conversion";
		error.path = path;
		error.cause = cause;
		error.reason = cause instanceof Error ? ("" + cause).replace(/^Error: /, "") : stringify(cause);
		return error;
	};
};
var B_errorOf = (input) => {
	let to2 = input.e;
	while (to2.to) to2 = to2.to;
	const foreign = B_foreignFail(input, to2);
	const path = compilePath(input.path);
	return (e) => e && e.s === s ? e : toError(foreign(e, path));
};
var B_invalidInputBuilder = (expected, extraPath = pathEmpty, reasonOverride) => (input) => {
	const snap = B_pathSnap(input);
	const staticPath = snap !== U ? pathConcat(snap, extraPath) : U;
	let site;
	return (value, path) => errorAt(site ?? (site = errorSite(expected ?? input.e, (input.prev || input).s, reasonOverride)), staticPath ?? pathConcat(path ?? pathEmpty, extraPath), value);
};
var B_failWithErrorMessage = (key, defaultMessage) => (input) => {
	const em = input.e.errorMessage;
	const m = em?.[key] ?? em?.["_"] ?? defaultMessage;
	return m !== U ? B_invalidInputBuilder(U, U, m)(input) : failInvalidType(input);
};
var B_failInvalidInput = (input, expected = input.e, cond) => B_fail(input, B_invalidInputBuilder(expected)(input), input.v(), cond);
var B_emitChecks = (val, inputVar) => {
	const checks = val.vc;
	let out = "", i = 0, len = checks.length;
	while (i < len) {
		const head = checks[i], fail2 = head.f;
		let cond = head.c(inputVar);
		i++;
		while (i < len && checks[i].f === fail2) {
			cond += "&&" + checks[i].c(inputVar);
			i++;
		}
		out += B_fail(val, fail2(val), inputVar, cond);
	}
	return out;
};
var B_merge = (val, out) => {
	let current = val, code = "";
	while (current !== U) {
		const val2 = current;
		current = val2.prev;
		let currentCode = "";
		if (val2.vc) {
			if (out && (!val2.t || val2.cp === "" && val2.prev !== U && (!val2.prev.t || val2.prev.w))) {
				const inputVar = (current || val2).v();
				const checks = val2.vc;
				let hoisted = "";
				for (let i = 0; i < checks.length; i++) {
					const check = checks[i];
					const condCode = check.c(inputVar);
					if (check.f === failInvalidType) hoisted = hoisted ? `${hoisted}&&${condCode}` : condCode;
					else if (val2.e.noValidation !== true) currentCode += B_fail(val2, check.f(val2), inputVar, condCode);
				}
				if (hoisted) {
					out.c = out.c ? `${hoisted}&&${out.c}` : hoisted;
					out.h.unshift({
						v: val2,
						i: inputVar,
						c: hoisted
					});
				}
			} else if (val2.e.noValidation !== true) currentCode = B_emitChecks(val2, (current || val2).v());
		}
		if (val2.hn) val2.g.l.push(...val2.hn);
		if (val2.hd) currentCode += `let ${val2.hd};`;
		if (val2.ha) currentCode += val2.ha;
		val2.fz = true;
		const k = val2.g.k;
		if (val2.k && k && code !== "" && val2.g.y) {
			const m = B_varWithoutAllocation(val2.g);
			code = B_let(val2.g, m, k) + val2.cp + currentCode + `if(${k}!==${m})${val2.g.y()};` + code;
		} else code = val2.cp + currentCode + code;
	}
	return code;
};
var B_linkVar = (val, nextVal) => {
	const get = val.v.bind(val);
	val.v = () => (nextVal.i = get(), nextVal.v = _var, nextVal.i);
};
var B_next = (prev, initial, schema, expected = prev.e) => {
	return {
		b: U,
		p: U,
		v: _notVar,
		i: initial,
		s: schema,
		io: U,
		e: expected,
		prev,
		f: 0,
		d: U,
		fv: U,
		cp: "",
		fu: U,
		fs: U,
		hd: "",
		fz: U,
		vc: U,
		u: U,
		t: true,
		path: prev.path,
		g: prev.g,
		o: U
	};
};
var B_refine = (val, schema = val.s, checks, expected = val.e) => {
	const shouldLink = val.v !== _var;
	const nextVal = {
		b: U,
		p: U,
		v: shouldLink ? _linkVar : _var,
		i: val.i,
		s: schema,
		io: U,
		e: expected,
		prev: val,
		f: val.f,
		d: val.d,
		fv: U,
		cp: "",
		fu: U,
		fs: U,
		hd: "",
		fz: U,
		vc: checks,
		u: U,
		t: val.t,
		path: val.path,
		g: val.g,
		o: U
	};
	if (shouldLink) B_linkVar(val, nextVal);
	return nextVal;
};
var B_pushCheck = (val, check) => {
	(val.vc ?? (val.vc = [])).push(check);
};
var B_markOutput = (val, valInput) => {
	const from = valInput || val;
	const ir = from.e.inputRefiner;
	let outC = ir ? ir(from) : [];
	if (valInput) {
		if (outC.length) (valInput.vc ?? (valInput.vc = [])).push(...outC);
		outC = [];
	}
	const rf = val.e.refiner;
	if (rf) outC = outC.concat(rf(val));
	if (outC.length && val.f & 1) {
		const v = val.v();
		const then = B_then(v, B_detached(val.g, () => B_merge(B_refine(B_scope(val), U, outC))), v);
		if (!val.fu?.(then, true)) {
			val.i = `${v}.then(${then()})`;
			val.v = _notVar;
		}
	} else if (outC.length) val = B_refine(val, U, outC);
	val.io = true;
	return val;
};
var B_hoistChildChecks = (parent, child, key) => {
	const checks = child.vc;
	if (checks) {
		const accessor = inlinedProperty("", key, parent.s.type === arrayTag);
		for (let i = 0; i < checks.length; i++) {
			const check = checks[i];
			B_pushCheck(parent, {
				c: (v) => check.c(v + accessor),
				f: check.f
			});
		}
		child.vc = U;
	}
};
var B_dynamicScope = (from, locationVar) => {
	const schemaAdditionalItems = from.s.additionalItems;
	const expectedAdditionalItems = from.e.additionalItems;
	return {
		b: U,
		p: from,
		v: _notVarBeforeValidation,
		i: `${from.v()}[${locationVar}]`,
		s: schemaAdditionalItems !== U && typeof schemaAdditionalItems !== "string" ? schemaAdditionalItems : unknown,
		io: U,
		e: expectedAdditionalItems !== U && typeof expectedAdditionalItems !== "string" ? expectedAdditionalItems : unknown,
		prev: U,
		f: from.f,
		d: U,
		fv: U,
		cp: "",
		fu: U,
		fs: U,
		hd: "",
		fz: U,
		vc: U,
		u: U,
		t: U,
		path: pathConcat(from.path, [{ e: locationVar }]),
		g: from.g,
		o: U
	};
};
var B_nextConst = (from, schema, expected) => B_next(from, B_inlineConst(from, schema), schema, expected);
var B_nextVar = (input, schema = input.e, expected = schema) => {
	const output = B_next(input, B_varWithoutAllocation(input.g), schema, expected);
	output.v = _var;
	return output;
};
var B_nextVarOutput = (input, initial, schema, expected = schema) => {
	const output = B_next(input, initial, schema, expected);
	output.v = _var;
	output.io = true;
	return output;
};
var settledTag = {};
var settle = (thrown) => thrown?.t === settledTag ? thrown : {
	t: settledTag,
	l: [thrown]
};
var B_settle = (container, child, guard) => child.fs?.(child) ? child.i : `${guard ? `${child.i}&&` : ""}${child.i}.then(void 0,${B_embedPure(container, settle)})`;
var B_join = (container, slots) => {
	const g = container.g, k = g.k;
	let failed = "0";
	if (container.k) {
		failed = B_varWithoutAllocation(g);
		container.cp = B_let(g, failed, k) + container.cp;
		failed = `${k}!==${failed}`;
		container.k = U;
	}
	return `${B_embedPure(container, (was, values) => {
		let found;
		for (let idx = 0; idx < values.length; idx++) {
			const value = values[idx];
			if (value?.t === settledTag) (found || (found = [])).push(...value.l);
		}
		if (found || was) throw {
			t: settledTag,
			l: found || []
		};
	})}(${failed},${slots});`;
};
var B_asyncVal = (from, initial) => {
	const v = B_next(from, initial, from.s);
	v.f = 1;
	return v;
};
var B_addObjectField = (objectVal, location, val) => {
	if (objectVal.s.type === arrayTag) objectVal.s.items.push(val.s);
	else {
		if (!val.o) objectVal.s.required.push(location);
		objectVal.s.properties[location] = val.s;
	}
	if (val.f & 1) {
		val.v();
		if (B_collects(val.g) && val.g.k) val.fs?.(val, true);
	}
	objectVal.cp += B_merge(val);
	objectVal.d[location] = val;
};
var B_field = (container, location, produce) => {
	let val;
	const emit = () => B_addObjectField(container, location, val = produce());
	const g = container.g;
	if (!B_collects(g)) return emit();
	const start = container.cp.length, collected = g.kj;
	const wrap = B_child(g, emit);
	container.cp = container.cp.slice(0, start) + wrap(container.cp.slice(start), val);
	if (g.kj !== collected) container.k = true;
};
var B_addKey = (objVal, key, value) => `${objVal.v()}[${key}]=${value.i}`;
var B_scope = (val) => {
	const shouldLink = val.v !== _var;
	const nextVal = {
		b: val,
		p: U,
		v: shouldLink ? _linkVar : _var,
		i: val.i,
		s: val.s,
		io: val.io,
		e: val.e,
		prev: U,
		f: 0,
		d: val.d,
		fv: U,
		cp: "",
		fu: U,
		fs: U,
		hd: "",
		fz: U,
		vc: U,
		u: false,
		t: false,
		path: val.path,
		g: val.g,
		o: U
	};
	if (shouldLink) B_linkVar(val, nextVal);
	return nextVal;
};
var B_neverSlot = (input) => B_invalidOperation(input, `Nothing decodes ${/* @__PURE__ */ inputExpression(input.e)} -> ${/* @__PURE__ */ inputExpression(input.e.to)}. It is marked with S.never`);
var B_invalidOperation = (val, description) => B_throw({
	code: "invalid_operation",
	reason: description,
	path: compilePath(val.path)
});
var noopOperation = (i) => i;
noopOperation["embedded"] = immutableEmptyArray;
var int32FormatValidation = (inputVar) => `${inputVar}<=2147483647&&${inputVar}>=-2147483648&&${inputVar}%1==0`;
var integerFormatValidation = (inputVar) => `${inputVar}%1==0`;
var typeofCondCache = {};
var typeofCond = (tag) => typeofCondCache[tag] || (typeofCondCache[tag] = (inputVar) => `typeof ${inputVar}==="${tag}"`);
var nanCond = (inputVar) => `Number.isNaN(${inputVar})`;
var isArrayCond = (inputVar) => `Array.isArray(${inputVar})`;
var objectTagCond = (inputVar) => `${typeofCond(objectTag)(inputVar)}&&${inputVar}&&!${isArrayCond(inputVar)}`;
var numberTagCond = (inputVar, allowNaN) => {
	const t = typeofCond(numberTag)(inputVar);
	return allowNaN ? t : `${t}&&${inputVar}==${inputVar}`;
};
var instanceofCond = (b, class_, inputVar) => `${inputVar} instanceof ${(class_[Symbol.hasInstance] === Function.prototype[Symbol.hasInstance] && Object(class_.prototype) === class_.prototype ? B_embedPure : B_embed)(b, class_)}`;
var typeofCheckCache = {};
var typeofCheck = (tag) => typeofCheckCache[tag] || (typeofCheckCache[tag] = {
	c: typeofCond(tag),
	f: failInvalidType
});
var B_typeDecode = (input, tag, inputTagFlag) => inputTagFlag & 1 ? B_refine(input, input.e, [typeofCheck(tag)]) : inputTagFlag & tagFlags[tag] ? input : B_unsupportedDecode(input, input.s, input.e);
var numberDecoder = (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	const expectedFormat = input.e.format;
	if (inputTagFlag & 1) {
		if (expectedFormat === "int32") return B_refine(input, input.e, [typeofCheck(numberTag), {
			c: int32FormatValidation,
			f: failInvalidType
		}]);
		if (expectedFormat === "integer") return B_refine(input, input.e, [typeofCheck(numberTag), {
			c: integerFormatValidation,
			f: failInvalidType
		}]);
		return B_refine(input, input.e, [{
			c: (v) => numberTagCond(v, !!(input.g.o & 2)),
			f: failInvalidType
		}]);
	} else if (inputTagFlag & 2) {
		const output = B_nextVar(input);
		const inputVar = input.v();
		output.cp = B_let(input.g, output.i, `+${inputVar}`);
		output.vc = [{
			c: (_inputVar) => `${expectedFormat === "int32" ? int32FormatValidation(output.i) : expectedFormat === "integer" ? integerFormatValidation(output.i) : `${output.i}==${output.i}`}&&(${output.i}||${inputVar}.trim())`,
			f: failInvalidType
		}];
		return output;
	} else if (inputTagFlag & 2048 && expectedFormat !== "int32" && expectedFormat !== "integer" && input.g.o & 2) return B_refine(input, input.e);
	else if (inputTagFlag & 4) {
		if (input.s.format !== expectedFormat && expectedFormat === "int32") return B_refine(input, input.e, [input.s.format === U ? {
			c: int32FormatValidation,
			f: failInvalidType
		} : {
			c: (inputVar) => `${inputVar}<=2147483647&&${inputVar}>=-2147483648`,
			f: failInvalidType
		}]);
		if (expectedFormat === "integer" && input.s.format === U) return B_refine(input, input.e, [{
			c: integerFormatValidation,
			f: failInvalidType
		}]);
	}
	return B_typeDecode(input, numberTag, inputTagFlag);
};
var float = /* @__PURE__ */ initSchema(numberTag, numberDecoder);
var inputToString = (input, schema = string) => B_next(input, `""+${input.i}`, schema);
var stringDecoderFn = (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	if (inputTagFlag & 3132 && isLiteral(input.s)) {
		const const_ = "" + input.s.const;
		const schema = baseSchema(stringTag, false, input.s.decoder);
		schema.const = const_;
		return B_next(input, `"${const_}"`, schema);
	}
	if (inputTagFlag & 1036) return inputToString(input, input.e);
	return B_typeDecode(input, stringTag, inputTagFlag);
};
var string = /* @__PURE__ */ initSchema(stringTag, stringDecoderFn);
var literalDecoder = (input) => {
	const expectedSchema = input.e;
	if (expectedSchema.noValidation && !input.u) return B_nextConst(input, expectedSchema);
	else if (isLiteral(input.s)) {
		const from = input.s.const, to2 = expectedSchema.const;
		if (from === to2 || from !== from && to2 !== to2) return input;
		if (!input.u || tagFlags[input.s.type] & 48) return B_nextConst(input, expectedSchema);
		return B_refine(input, expectedSchema, [{
			c: (inputVar) => `${inputVar}===${B_inlineConst(input, expectedSchema)}`,
			f: failInvalidType
		}]);
	} else {
		const schemaTagFlag = tagFlags[expectedSchema.type];
		if (tagFlags[input.s.type] & 2 && schemaTagFlag & 3132) {
			const stringConstSchema = baseSchema(stringTag, false, literalDecoder);
			stringConstSchema.const = "" + expectedSchema.const;
			const stringConstVal = B_nextConst(input, stringConstSchema, stringConstSchema);
			stringConstVal.vc = [{
				c: (inputVar) => `${inputVar}==="${stringConstSchema.const}"`,
				f: failInvalidType
			}];
			return B_nextConst(stringConstVal, expectedSchema, expectedSchema);
		} else if (schemaTagFlag & 2048) return B_refine(input, expectedSchema, [{
			c: nanCond,
			f: failInvalidType
		}]);
		else if (tagFlags[input.s.type] & 12480 && input.s.type !== expectedSchema.type) return B_unsupportedDecode(input, input.s, expectedSchema);
		else return B_refine(input, expectedSchema, [{
			c: (inputVar) => `${inputVar}===${B_inlineConst(input, expectedSchema)}`,
			f: failInvalidType
		}]);
	}
};
var unit = /* @__PURE__ */ initSchema(undefinedTag, literalDecoder, (s2) => {
	s2.const = U;
});
var nullLiteral = /* @__PURE__ */ initSchema(nullTag, literalDecoder, (s2) => {
	s2.const = null;
});
var nan = /* @__PURE__ */ initSchema(nanTag, literalDecoder, (s2) => {
	s2.const = NaN;
});
var Literal_parse = (value) => {
	if (value === null) return nullLiteral;
	else {
		const tag = typeof value;
		if (tag === undefinedTag) return unit;
		else if (tag === numberTag && Number.isNaN(value)) return nan;
		else if (tag === objectTag) {
			const s2 = baseSchema(instanceTag, true, literalDecoder);
			s2.class = value["constructor"];
			s2.const = value;
			return s2;
		} else {
			const s2 = baseSchema(tag, true, literalDecoder);
			s2.const = value;
			return s2;
		}
	}
};
var parse = (input) => {
	let result = input;
	let appliedEncoderRef = U;
	let loopCount = 0;
	while (!result.io || result.e.to) {
		const appliedEncoder = appliedEncoderRef;
		appliedEncoderRef = U;
		const loopInput = result;
		if (++loopCount > 50) panic("Loop count exceeded 50");
		if (loopInput.f & 1) {
			const operationInputVar = loopInput.v();
			const operationInput = B_scope(loopInput);
			let operationOutput;
			const operationCode = B_detached(loopInput.g, () => B_merge(operationOutput = parse(operationInput)));
			const then = B_then(operationInputVar, operationCode, operationOutput.i);
			if (operationInput.i === operationOutput.i && operationCode === "" || loopInput.fu?.(then, !operationOutput.t && !(operationOutput.f & 1))) {
				result = B_refine(loopInput, operationOutput.s, U, operationOutput.e);
				result.fs = loopInput.fs;
			} else result = B_next(loopInput, `${operationInputVar}.then(${then()})`, operationOutput.s, operationOutput.e);
			result.f |= 1;
			result.io = true;
		} else if (loopInput.io) {
			const to2 = loopInput.e.to;
			if (loopInput.e.flags & 32768) loopInput.g.o |= 32;
			result = loopInput.e.parser ? loopInput.e.parser(loopInput) : B_refine(result, U, U, to2);
		} else {
			const maybeEncoder = loopInput.s.encoder;
			if (maybeEncoder && maybeEncoder !== appliedEncoder && loopInput.s !== loopInput.e && loopInput.e.type !== unknownTag && !(loopInput.e.noValidation && (loopInput.e.flags & 16 || loopInput.e.type === undefinedTag))) result = maybeEncoder(loopInput, loopInput.e);
			if (loopInput !== result) appliedEncoderRef = maybeEncoder;
			else {
				result = loopInput.e.decoder(loopInput);
				if (!result.io) result = B_markOutput(result, result);
			}
		}
	}
	return result;
};
var captureStackAt = (thrown, cut) => {
	if (thrown && thrown.s === s && !Object.hasOwn(thrown, "stack") && !constructed.has(thrown) && Object.isExtensible(thrown)) {
		const capture = Error.captureStackTrace;
		if (capture) capture(thrown, cut);
		else Object.defineProperty(thrown, "stack", {
			value: (/* @__PURE__ */ new Error()).stack,
			configurable: true,
			writable: true
		});
	}
	return thrown;
};
var rejectionBoundary = (thrown) => {
	throw captureStackAt(thrown, rejectionBoundary);
};
var throwTail = (input, code, out, isAsync, flag, nested) => {
	if (code === "" && out === operationArgVar && !(flag & 1)) return U;
	const body = `${code}return ${flag & 1 && !isAsync && !nested ? `Promise.resolve(${out})` : isAsync && !nested && input.g.t ? `${out}.catch(${B_embedPure(input, rejectionBoundary)})` : out}`;
	if (!(input.g.t || flag & 1 && !(flag & 512) && code) || nested) return body;
	const g = input.g;
	const e = B_varWithoutAllocation(g);
	return `try{${body}}catch(${e}){${flag & 1 && !(flag & 512) ? `return ${B_embedPure(input, (thrown) => Promise.reject(captureStackAt(thrown, g.f)))}` : B_embedPure(input, (thrown) => {
		throw captureStackAt(thrown, g.f);
	})}(${e})}`;
};
var okResult = (flag, value) => flag & 256 ? `{TAG:"Ok",_0:${value}}` : flag & 128 ? `{success:true,value:${value},error:void 0,issues:void 0}` : value;
var failureOf = (errorOf, lift) => (list2, raised, thrown) => {
	const late = raised ? thrown?.t === settledTag ? thrown.l : [thrown] : [];
	let size2 = late.length;
	for (let n = list2; n; n = n[0]) size2++;
	const issues = new Array(size2);
	let error;
	const add = (e) => {
		issues[--size2] = {
			message: e.reason,
			path: e.path.length ? e.path : U
		};
		error = e;
	};
	for (let idx = late.length; idx--;) add(errorOf(late[idx]));
	for (let n = list2; n; n = n[0]) add(n.length < 3 ? n[1] : n[1](n[2], n[3]));
	const result = {
		success: false,
		value: U,
		error,
		issues
	};
	return lift.a ? Promise.resolve(result) : result;
};
var outcomeOf = (input, flag, nested) => {
	const g = input.g;
	const given = (code) => {
		if (!g.r) return [code, operationArgVar];
		const value = B_varWithoutAllocation(g);
		return [B_let(g, value, operationArgVar) + code, value];
	};
	if (!(flag & 4480) || nested) return {
		x: U,
		t: (code, out, isAsync) => {
			if (flag & 2048) {
				const [body, value] = given(code);
				return throwTail(input, body, isAsync ? `${out}.then(()=>${value})` : value, isAsync, flag, nested);
			}
			return throwTail(input, code, out, isAsync, flag, nested);
		}
	};
	const lift = {};
	const lifted = (value) => flag & 1 && !(flag & 512) ? `Promise.resolve(${value})` : value;
	let x, failure2, list2;
	let named = false;
	if (flag & 128) {
		list2 = g.k = B_varWithoutAllocation(g);
		g.l = [];
		failure2 = B_embedPure(input, failureOf(B_errorOf(input), lift));
		x = (record) => (named = true, `return ${failure2}(${record ? `[${list2},${record(true)}]` : list2})`);
		x.k = 1;
		g.y = () => `return ${failure2}(${list2})`;
	} else if (flag & 4096) {
		failure2 = "false";
		const no = `return ${lifted(failure2)}`;
		x = () => no;
	} else {
		const errorOf = B_errorOf(input);
		failure2 = B_embedPure(input, (e) => ({
			TAG: "Error",
			_0: errorOf(e)
		}));
		x = (record) => `return ${lifted(`${failure2}(${record()})`)}`;
	}
	const failOf = (e) => list2 ? `${failure2}(${g.kj ? list2 : 0}${e ? `,1,${e}` : ""})` : flag & 4096 ? failure2 : `${failure2}(${e})`;
	const done = (success) => g.kj ? `${list2}?${failOf()}:${success}` : success;
	return {
		x,
		t: (code, out, isAsync) => {
			const errVar = B_varWithoutAllocation(g);
			let value = out;
			if (flag & 2048) [code, value] = given(code);
			lift.a = !!(flag & 1) && (isAsync || !(flag & 512));
			const valueVar = isAsync ? B_varWithoutAllocation(g) : value;
			const success = okResult(flag, flag & 4096 ? "true" : flag & 2048 ? value : valueVar);
			let body = isAsync ? `${code}return ${out}.then(${valueVar}=>${done(`(${success})`)},${errVar}=>(${failOf(errVar)}))` : `${code}return ${done(lifted(success))}`;
			if (code) body = `try{${body}}catch(${errVar}){return ${list2 ? failOf(errVar) : lifted(failOf(errVar))}}`;
			const names = g.kj || named ? [list2, ...g.l] : g.l || [];
			return names.length ? `let ${[...new Set(names)]};${body}` : body;
		}
	};
};
var compileDecoder = (schema, expected, flag, node) => {
	const input = B_operationArg(isLiteral(schema) ? unknown : schema, expected, flag);
	const outcome = outcomeOf(input, flag, !!node);
	input.g.x = outcome.x;
	const output = parse(input);
	const code = B_merge(output);
	const isAsync = !!(output.f & 1);
	if (node) {
		node.y = isAsync;
		node.t = output.t === true;
	}
	const body = outcome.t(code, output.i, isAsync);
	if (!body) return noopOperation;
	const fn = new Function("e", "s", `return ${operationArgVar}=>{${body}}`)(input.g.e, s);
	fn.embedded = input.g.e;
	input.g.f = fn;
	return fn;
};
var getOutputSchema = (schema) => {
	while (schema.to) schema = schema.to;
	return schema;
};
var reverseSwap = (mut, a, b) => {
	const previous = mut[a];
	mut[b] === U ? delete mut[a] : mut[a] = mut[b];
	previous === U ? delete mut[b] : mut[b] = previous;
};
var reverseDict = (dict2) => {
	const reversed = /* @__PURE__ */ Object.create(null);
	for (const key in dict2) reversed[key] = /* @__PURE__ */ reverse(dict2[key]);
	return reversed;
};
Object.defineProperty(schemaPrototype, reversedKey, { get() {
	const schema = this;
	let reversedHead = U;
	let current = schema;
	while (current) {
		const mut = copySchema(current);
		const next = mut.to;
		reversedHead ? mut.to = reversedHead : delete mut.to;
		const record = mut;
		reverseSwap(record, "parser", "serializer");
		reverseSwap(record, "refiner", "inputRefiner");
		const reverseReading = mut.reverseReading || next && (next.reverseReading || next.anyOf?.find((arm) => arm.reverseReading)?.reverseReading);
		const flags = mut.flags & -13 | (reverseReading ? reverseReading(mut, next) : 0);
		flags ? mut.flags = flags : delete record["flags"];
		delete record["default"];
		delete record["examples"];
		if (mut.items) mut.items = mut.items.map(reverse);
		if (mut.properties) mut.properties = reverseDict(mut.properties);
		if (typeof mut.additionalItems === objectTag) mut.additionalItems = /* @__PURE__ */ reverse(mut.additionalItems);
		if (mut.anyOf) {
			const anyOf2 = mut.anyOf;
			const has = {};
			const newAnyOf = [];
			for (let idx = 0; idx < anyOf2.length; idx++) {
				const s2 = anyOf2[idx];
				const reversed = /* @__PURE__ */ reverse(s2);
				newAnyOf.push(reversed);
				setHas(has, reversed);
			}
			mut.has = has;
			mut.anyOf = newAnyOf;
		}
		if (mut["$defs"]) mut["$defs"] = reverseDict(mut["$defs"]);
		const definition = mut.definition;
		if (definition) mut.definition = () => definition()?.r;
		reversedHead = mut;
		current = next;
	}
	const r = reversedHead;
	valueOptions[valKey] = r;
	Object.defineProperty(schema, reversedKey, valueOptions);
	valueOptions[valKey] = schema;
	Object.defineProperty(r, reversedKey, valueOptions);
	return r;
} });
var reverse = /* @__NO_SIDE_EFFECTS__ */ (schema) => schema.r;
var decodeOutput = (output) => {
	try {
		return /* @__PURE__ */ getOp(0, 2, unknown, output);
	} catch (exn) {
		if (getOrRethrow(exn).code !== "invalid_operation") throw exn;
	}
};
var setDefault = (owner, original, v) => {
	const decode = decodeOutput(/* @__PURE__ */ reverse(original));
	if (decode) try {
		owner.default = decode(v);
	} catch (exn) {
		panic(`Invalid default for ${/* @__PURE__ */ inputExpression(owner)}: ${getOrRethrow(exn)["message"]}`);
	}
};
var memoKey = "c";
var addOpNode = (schema, a, f, v) => {
	const created = {
		a,
		f,
		v,
		n: schema[memoKey]
	};
	configurableValueOptions[valKey] = created;
	Object.defineProperty(schema, memoKey, configurableValueOptions);
	return created;
};
var compileChain = (cacheTarget, args, flag, tail) => {
	const chain = tail ? [...args, tail] : args;
	let schema = chain[chain.length - 1];
	for (let i = chain.length - 2; i >= 0; i--) {
		const to2 = schema;
		schema = updateOutput(chain[i], (mut) => {
			mut.to = to2;
			if (mut.flags & 3 && !(mut.flags & 12) && to2.type !== undefinedTag) mut.flags |= 4;
		});
	}
	let f;
	try {
		f = compileDecoder(flag & 8 ? unknown : schema, schema, flag);
	} catch (thrown) {
		throw captureStackAt(thrown, getOp);
	}
	addOpNode(cacheTarget, args, flag, f);
	return f;
};
var getOp = /* @__NO_SIDE_EFFECTS__ */ (opFlag, n, a0, a1, a2, a3) => {
	const flag = opFlag | globalConfig.f;
	let cacheTarget = a0;
	let seq2 = a0.seq;
	if (n > 1) {
		if (a1.seq > seq2) seq2 = a1.seq, cacheTarget = a1;
		if (n > 2) {
			if (a2.seq > seq2) seq2 = a2.seq, cacheTarget = a2;
			if (n > 3 && a3.seq > seq2) cacheTarget = a3;
		}
	}
	let node = cacheTarget[memoKey];
	while (node) {
		const a = node.a;
		if (node.f === flag && a.length === n && a[0] === a0 && (n < 2 || a[1] === a1) && (n < 3 || a[2] === a2) && (n < 4 || a[3] === a3)) return node.v;
		node = node.n;
	}
	const all = [
		a0,
		a1,
		a2,
		a3
	];
	return compileChain(cacheTarget, all.slice(0, n), flag, all[n]);
};
var nestedLoc = "BS_PRIVATE_NESTED_SOME_NONE";
var never_ = /* @__PURE__ */ initSchema(neverTag, (input) => {
	const output = B_refine(input, never_, U, never_);
	output.cp = B_failInvalidInput(input) + ";";
	return output;
});
var instanceDecoder = (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	return inputTagFlag & 1 ? B_refine(input, input.e, [{
		c: (v) => instanceofCond(input, input.e.class, v),
		f: failInvalidType
	}]) : inputTagFlag & 8192 && input.s.class === input.e.class ? input : B_unsupportedDecode(input, input.s, input.e);
};
var typeCheckCond = (input, schema, inputVar) => {
	const tagFlag = tagFlags[schema.type];
	if (tagFlag & 64) return objectTagCond(inputVar);
	if (tagFlag & 128) return isArrayCond(inputVar);
	if (tagFlag & 8192) return instanceofCond(input, schema.class, inputVar);
	if (tagFlag & 4) return numberTagCond(inputVar, !!(input.g.o & 2));
	if (tagFlag & 2048) return nanCond(inputVar);
	if (tagFlag & 48) return `${inputVar}===${B_inlineConst(input, schema)}`;
	if (tagFlag & 17418) return schema.format === "env" ? `(typeof ${inputVar}==="string"||${inputVar}===void 0)` : typeofCond(schema.type)(inputVar);
	return "";
};
var isItemSchema = (x) => x !== U && typeof x !== "string";
var B_unrecognizedKeys = (input, keys, keyVar, decl, container) => {
	const snap = B_pathSnap(input);
	let fail2 = "";
	const emit = () => {
		fail2 = B_fail(input, (key, path) => toError({
			code: "unrecognized_key",
			path: path ?? snap ?? pathEmpty,
			reason: `Unrecognized key ${stringify(key)}`,
			key
		}), keyVar);
	};
	const collected = input.g.kj;
	const wrap = container && B_collects(input.g) ? B_child(input.g, emit) : (emit(), U);
	let cond = "";
	for (let idx = 0; idx < keys.length; idx++) {
		if (idx) cond += "&&";
		cond += `${keyVar}!==${inlinedValueFromString(keys[idx])}`;
	}
	const body = (cond ? `if(${cond})` : "") + fail2;
	if (!wrap) return `for(${decl}${keyVar} in ${input.v()})${body};`;
	const code = wrap(body, input);
	if (input.g.kj !== collected) container.k = true;
	return `for(${decl}${keyVar} in ${input.v()})${code === body ? body + ";" : code}`;
};
var B_fused = (input, expectedSchema, item) => {
	const to2 = expectedSchema.to;
	return to2 !== U && to2.fuse !== U ? to2.fuse(input, expectedSchema, item) : U;
};
var B_narrowJsonSourcedJsonString = (itemInput) => {
	if (itemInput.s.flags & 16 && itemInput.e.format === "json") itemInput.s = unknown;
};
var B_makeContainerVal = (prev, schema) => ({
	b: U,
	p: U,
	v: _notVar,
	i: "",
	s: schema,
	io: U,
	e: prev.e,
	prev,
	f: 0,
	d: /* @__PURE__ */ Object.create(null),
	fv: U,
	cp: "",
	fu: U,
	fs: U,
	hd: "",
	fz: U,
	vc: U,
	u: U,
	t: true,
	path: prev.path,
	g: prev.g,
	o: U
});
var makeObjectVal = (prev) => B_makeContainerVal(prev, {
	type: objectTag,
	flags: 0,
	required: [],
	properties: /* @__PURE__ */ Object.create(null),
	additionalItems: "strict",
	decoder: objectDecoder
});
var makeArrayVal = (prev) => B_makeContainerVal(prev, {
	type: arrayTag,
	flags: 0,
	items: [],
	additionalItems: "strict",
	decoder: arrayDecoder
});
var resolveAsyncFields = (val) => {
	const fields = val.d;
	for (const k in fields) {
		const field = fields[k];
		const resolved = {
			...field,
			b: U,
			v: _var,
			i: val.i + inlinedProperty("", k, val.s.type === arrayTag),
			prev: U,
			f: 0,
			d: field.d && Object.assign(/* @__PURE__ */ Object.create(null), field.d),
			cp: "",
			fu: U,
			fs: U,
			hd: "",
			vc: U,
			k: U,
			hn: U,
			ha: U
		};
		resolveAsyncFields(resolved);
		fields[k] = resolved;
	}
};
var literalRead = (output, input) => {
	let val = output;
	if (!val.vc) while (val.prev !== U && val.prev !== input) val = val.prev;
	return val.prev === input ? val : output;
};
var completeObjectVal = (objectVal, inUnion) => {
	const isArray = objectVal.s.type === arrayTag;
	let inline = "";
	const promised = [];
	let optionalSettingCode = U;
	const keys = Object.keys(objectVal.d);
	const joins = inUnion && keys.some((key) => objectVal.d[key].f & 1);
	for (let idx = 0; idx < keys.length; idx++) {
		const key = keys[idx];
		const val = objectVal.d[key];
		if (val.f & 1) {
			promised.push(val);
			resolveAsyncFields(val);
		} else if (joins) {
			if (isLiteral(val.s) && !val.vc) val.i = B_inlineConst(val, val.s);
			else val.v();
		}
		if (val.o) {
			const existingFn = optionalSettingCode;
			optionalSettingCode = (objectVar) => {
				return (existingFn === U ? "" : existingFn(objectVar)) + (key === "__proto__" ? `if(${val.v()}!==void 0){${objectVar}={...${objectVar},["__proto__"]:${val.i}}}` : `if(${val.v()}!==void 0){${inlinedProperty(objectVar, key, isArray)}=${val.i}}`);
			};
		} else inline = inline + (isArray ? `${val.i}` : `${inlinedObjectKey(key)}:${val.i}`) + ",";
	}
	objectVal.i = isArray ? "[" + inline.slice(0, -1) + "]" : "{" + inline.slice(0, -1) + "}";
	if (promised.length) {
		const promiseAllContent = promised.map((val) => val.i).join(",");
		const g = objectVal.g;
		const collects = B_collects(g) && g.k;
		const joinCode = collects ? B_join(objectVal, `[${promiseAllContent}]`) : "";
		const operationInput = B_scope(objectVal);
		operationInput.io = true;
		let result = "";
		let operationCode = B_detached(objectVal.g, () => {
			const operationOutput = parse(operationInput);
			let code = B_merge(operationOutput);
			result = operationOutput.i;
			objectVal.s = operationOutput.s;
			objectVal.e = operationOutput.e;
			if (optionalSettingCode !== U) {
				const objectVar = B_varWithoutAllocation(objectVal.g);
				code += B_let(objectVal.g, objectVar, result) + optionalSettingCode(objectVar);
				result = objectVar;
			}
			return code;
		});
		if (operationCode === "" && promiseAllContent === result && !collects) objectVal.i = result;
		else objectVal.i = `Promise.all([${collects ? promised.map((val) => B_settle(objectVal, val, true)).join(",") : promiseAllContent}]).then(([${promiseAllContent}])=>{${joinCode}${operationCode}return ${result}})`;
		objectVal.f |= 1;
		objectVal.io = true;
		return objectVal;
	} else if (optionalSettingCode === U) return objectVal;
	else {
		const code = optionalSettingCode(objectVal.v());
		const output = B_refine(objectVal);
		output.cp = output.cp + code;
		return output;
	}
};
var arrayFactory = (item) => {
	const mut = baseSchema(arrayTag, !!item.sr, arrayDecoder);
	mut.additionalItems = item;
	mut.items = immutableEmptyArray;
	return mut;
};
var array = /* @__NO_SIDE_EFFECTS__ */ (item) => arrayFactory(/* @__PURE__ */ definitionToSchema(item));
var arrayDecoder = (unknownInput) => {
	const isUnion = unknownInput.u;
	const expectedSchema = unknownInput.e;
	const unknownInputTagFlag = tagFlags[unknownInput.s.type];
	const expectedItems = expectedSchema.items;
	const expectedLength = expectedItems.length;
	let input;
	if (unknownInputTagFlag & 129) {
		const isArrayInput = unknownInputTagFlag & 128;
		let schema;
		if (!isArrayInput) schema = arrayFactory(unknown);
		else schema = unknownInput.s;
		const checks = [];
		if (!isArrayInput) checks.push({
			c: isArrayCond,
			f: failInvalidType
		});
		const schemaAdditionalItems = schema.additionalItems;
		if (!(isItemSchema(schemaAdditionalItems) ? false : schema.items.length === expectedLength)) {
			const expectedAdditionalItems2 = expectedSchema.additionalItems;
			if (expectedAdditionalItems2 === "strict") checks.push({
				c: (inputVar) => `${inputVar}.length===${expectedLength}`,
				f: failInvalidType
			});
			else if (expectedAdditionalItems2 === "strip") checks.push({
				c: (inputVar) => `${inputVar}.length>=${expectedLength}`,
				f: failInvalidType
			});
		}
		input = B_refine(unknownInput, schema, checks.length ? checks : U);
	} else input = B_unsupportedDecode(unknownInput, unknownInput.s, expectedSchema);
	let output;
	const expectedAdditionalItems = expectedSchema.additionalItems;
	if (isItemSchema(expectedAdditionalItems)) {
		const itemSchema = expectedAdditionalItems;
		if (itemSchema === unknown) output = input;
		else {
			if (expectedLength === 0) {
				const fused = B_fused(input, expectedSchema, itemSchema);
				if (fused !== U) return B_markOutput(B_refine(input, fused), input);
			}
			const inputVar = input.v();
			const iteratorVar = B_varWithoutAllocation(input.g);
			const failCountBefore = input.g.t + input.g.j;
			const itemInput = B_dynamicScope(input, iteratorVar);
			itemInput.u = isUnion;
			B_narrowJsonSourcedJsonString(itemInput);
			let itemOutput, output2;
			const collected = input.g.kj;
			const itemCode = B_sink(input.g, () => {
				let itemMerge = "", settles = false;
				const collects = B_collects(input.g);
				const emit = () => {
					itemOutput = parse(itemInput);
					output2 = itemOutput.t ? B_next(input, `new Array(${inputVar}.length)`, arrayFactory(itemOutput.s)) : B_refine(input, expectedSchema);
					settles = !!(itemOutput.t && itemOutput.f & 1 && collects && input.g.k);
					if (settles) itemOutput.fs?.(itemOutput, true);
					itemMerge = B_merge(itemOutput);
				};
				const wrap = collects ? B_child(input.g, emit) : (emit(), U);
				const code = itemOutput.t ? itemMerge + (settles ? `${output2.v()}[${iteratorVar}]=${B_settle(output2, itemOutput)}` : B_addKey(output2, iteratorVar, itemOutput)) : input.g.t + input.g.j === failCountBefore ? "" : itemMerge;
				return wrap ? wrap(code, itemOutput) : code;
			});
			if (itemOutput.t || itemCode !== "") output2.cp = output2.cp + `for(let ${iteratorVar}=${expectedLength};${iteratorVar}<${inputVar}.length;++${iteratorVar}){${itemCode}}`;
			if (input.g.kj !== collected) output2.k = true;
			if (itemOutput.f & 1) {
				const g = input.g, k = B_collects(g) && g.k;
				let all = `Promise.all(${output2.i})`;
				if (k) {
					const items = B_varWithoutAllocation(g);
					all += `.then(${items}=>{${B_join(output2, items)}return ${items}})`;
				}
				output = B_asyncVal(output2, all);
			} else output = output2;
		}
	} else {
		const objectVal = makeArrayVal(input);
		const fused = B_fused(input, expectedSchema);
		const ai = expectedSchema.additionalItems;
		let shouldRecreateInput = fused === U && ai !== "strict" && (ai !== "strip" || isItemSchema(input.s.additionalItems) || input.s.items.length !== expectedLength);
		for (let idx = 0; idx < expectedLength; idx++) {
			const schema = expectedItems[idx];
			const key = String(idx);
			const itemInput = valGet(input, key);
			itemInput.e = schema;
			itemInput.io = false;
			itemInput.u = isUnion;
			if (fused !== U && !(isUnion && isLiteral(schema))) {
				B_addObjectField(objectVal, key, itemInput);
				continue;
			}
			B_narrowJsonSourcedJsonString(itemInput);
			B_field(objectVal, key, () => {
				const itemOutput = parse(itemInput);
				if (isUnion && isLiteral(schema)) B_hoistChildChecks(input, literalRead(itemOutput, itemInput), key);
				if (!shouldRecreateInput) shouldRecreateInput = itemOutput.t;
				return itemOutput;
			});
		}
		if (shouldRecreateInput) output = completeObjectVal(objectVal, isUnion);
		else {
			const o = B_refine(input, fused || expectedSchema);
			o.cp = objectVal.cp;
			if (objectVal.hn) o.hn = objectVal.hn;
			o.d = objectVal.d;
			o.k = objectVal.k;
			output = o;
		}
	}
	return B_markOutput(output, input);
};
var objectTypeCheck = {
	c: objectTagCond,
	f: failInvalidType
};
var keepAbsent = (union2, to2) => {
	const target = copySchema(union2);
	target.anyOf = union2.anyOf.map((variant) => variant.type === undefinedTag ? variant : isOptional(variant) && variant.to === U ? keepAbsent(variant, to2) : updateOutput(variant, (mut) => {
		mut.to = to2;
	}));
	target.flags |= 64;
	return target;
};
var objectDecoder = (unknownInput) => {
	const isUnion = unknownInput.u;
	const expectedSchema = unknownInput.e;
	const unknownInputTagFlag = tagFlags[unknownInput.s.type];
	let input;
	if (unknownInputTagFlag & 65) {
		const isObjectInput = unknownInputTagFlag & 64;
		let schema;
		if (!isObjectInput) {
			const mut = baseSchema(objectTag, false, objectDecoder);
			mut.properties = immutableEmptyObject;
			mut.additionalItems = unknown;
			schema = mut;
		} else schema = unknownInput.s;
		input = isObjectInput ? B_refine(unknownInput, schema) : B_refine(unknownInput, schema, [objectTypeCheck]);
	} else input = B_unsupportedDecode(unknownInput, unknownInput.s, expectedSchema);
	const expectedAdditionalItems = expectedSchema.additionalItems;
	const dictItem = isItemSchema(expectedAdditionalItems) ? expectedAdditionalItems : U;
	const inputAdditionalItems = input.s.additionalItems;
	const sourceIsDict = isItemSchema(inputAdditionalItems);
	let output;
	if (dictItem !== U && dictItem === unknown) output = input;
	else if (dictItem !== U && sourceIsDict) {
		const fused = B_fused(input, expectedSchema, dictItem);
		if (fused !== U) return B_markOutput(B_refine(input, fused), input);
		const inputVar = input.v();
		const keyVar = B_varWithoutAllocation(input.g);
		const failCountBefore = input.g.t + input.g.j;
		const itemInput = B_dynamicScope(input, keyVar);
		B_narrowJsonSourcedJsonString(itemInput);
		let itemOutput, output2;
		const collected = input.g.kj;
		const itemCode = B_sink(input.g, () => {
			let itemMerge = "", settles = false;
			const collects = B_collects(input.g);
			const emit = () => {
				itemOutput = parse(itemInput);
				output2 = itemOutput.t ? B_next(input, "{}", dictFactory(itemOutput.s)) : B_refine(input, expectedSchema);
				settles = !!(itemOutput.t && itemOutput.f & 1 && collects && input.g.k);
				if (settles) itemOutput.fs?.(itemOutput, true);
				itemMerge = B_merge(itemOutput);
			};
			const wrap = collects ? B_child(input.g, emit) : (emit(), U);
			const code = itemOutput.t ? itemMerge + (settles ? `${output2.v()}[${keyVar}]=${B_settle(output2, itemOutput)}` : B_addKey(output2, keyVar, itemOutput)) : input.g.t + input.g.j === failCountBefore ? "" : itemMerge;
			return wrap ? wrap(code, itemOutput) : code;
		});
		if (itemOutput.t || itemCode !== "") output2.cp = output2.cp + `for(let ${keyVar} in ${inputVar}){${itemCode}}`;
		if (input.g.kj !== collected) output2.k = true;
		if (itemOutput.f & 1) {
			const resolveVar = B_varWithoutAllocation(output2.g);
			const rejectVar = B_varWithoutAllocation(output2.g);
			const asyncParseResultVar = B_varWithoutAllocation(output2.g);
			const counterVar = B_varWithoutAllocation(output2.g);
			const outputVar = output2.v();
			const g = input.g, k = B_collects(g) && g.k;
			let all = `new Promise((${resolveVar},${rejectVar})=>{let ${counterVar}=Object.keys(${outputVar}).length;if(!${counterVar}){${resolveVar}(${outputVar})}for(let ${keyVar} in ${outputVar}){${outputVar}[${keyVar}].then(${asyncParseResultVar}=>{${outputVar}[${keyVar}]=${asyncParseResultVar};if(${counterVar}--===1){${resolveVar}(${outputVar})}},${rejectVar})}})`;
			if (k) {
				const entries = B_varWithoutAllocation(g);
				all += `.then(${entries}=>{${B_join(output2, `Object.values(${entries})`)}return ${entries}})`;
			}
			output = B_asyncVal(output2, all);
		} else output = output2;
	} else if (dictItem !== U) {
		const itemSchema = dictItem;
		const objectVal = makeObjectVal(input);
		const keys = Object.keys(input.s.properties);
		for (let idx = 0; idx < keys.length; idx++) {
			const key = keys[idx];
			const itemInput = valGet(input, key);
			const source = itemInput.s;
			const absent = source.type === anyOfTag && source.has[undefinedTag] && !(tagFlags[itemSchema.type] & 817) && itemSchema.format !== "json";
			itemInput.e = absent ? keepAbsent(source, itemSchema) : itemSchema;
			itemInput.io = false;
			itemInput.u = isUnion;
			B_narrowJsonSourcedJsonString(itemInput);
			B_field(objectVal, key, () => {
				const itemOutput = parse(itemInput);
				if (absent) itemOutput.o = true;
				return itemOutput;
			});
		}
		output = completeObjectVal(objectVal, isUnion);
	} else {
		const properties = expectedSchema.properties;
		const keys = Object.keys(properties);
		const keysCount = keys.length;
		const objectVal = makeObjectVal(input);
		const ai = expectedSchema.additionalItems;
		const fused = B_fused(input, expectedSchema);
		let shouldRecreateInput = fused === U && ai !== "strict" && (ai !== "strip" || sourceIsDict || Object.keys(input.s.properties).length !== keysCount);
		const isJsonParent = isItemSchema(inputAdditionalItems) && inputAdditionalItems.flags & 16;
		for (let idx = 0; idx < keysCount; idx++) {
			const key = keys[idx];
			const schema = properties[key];
			const itemInput = valGet(input, key);
			itemInput.e = schema;
			itemInput.io = false;
			itemInput.u = isUnion;
			if (isJsonParent && isOptional(schema)) itemInput.s = wrapDictMissingKeyLight(itemInput.s);
			if (fused !== U && !(isUnion && isLiteral(schema))) {
				B_addObjectField(objectVal, key, itemInput);
				continue;
			}
			B_narrowJsonSourcedJsonString(itemInput);
			B_field(objectVal, key, () => {
				const itemOutput = parse(itemInput);
				if (isUnion && isLiteral(schema)) B_hoistChildChecks(input, literalRead(itemOutput, itemInput), key);
				if (!shouldRecreateInput) shouldRecreateInput = itemOutput.t;
				return itemOutput;
			});
		}
		if (ai === "strict" && isItemSchema(inputAdditionalItems) && fused === U) {
			const keyVar = B_varWithoutAllocation(objectVal.g);
			B_hoistDecl(input, keyVar);
			objectVal.cp += B_unrecognizedKeys(input, keys, keyVar, "", objectVal);
		}
		if (shouldRecreateInput) output = completeObjectVal(objectVal, isUnion);
		else {
			const o = B_refine(input, fused || expectedSchema);
			o.cp = objectVal.cp;
			if (objectVal.hn) o.hn = objectVal.hn;
			o.d = objectVal.d;
			o.k = objectVal.k;
			output = o;
		}
	}
	return B_markOutput(output, input);
};
var dictFactory = (item) => {
	const mut = baseSchema(objectTag, !!item.sr, objectDecoder);
	mut.properties = immutableEmptyObject;
	mut.additionalItems = item;
	return mut;
};
var definitionToSchema = /* @__NO_SIDE_EFFECTS__ */ (definition) => isSchemaObject(definition) ? definition : traverseDefinition(definition, (node) => isSchemaObject(node) ? node : U);
var traverseDefinition = (definition, onNode) => {
	if (typeof definition === objectTag && definition !== null) {
		const s2 = onNode(definition);
		if (s2 !== U) return s2;
		else if (Array.isArray(definition)) {
			const node = definition;
			for (let idx = 0; idx < node.length; idx++) node[idx] = traverseDefinition(node[idx], onNode);
			const items = node;
			const mut = baseSchema(arrayTag, false, arrayDecoder);
			mut.items = items;
			mut.additionalItems = "strict";
			return mut;
		} else {
			const proto = Object.getPrototypeOf(definition);
			if (proto !== null && proto !== Object.prototype) {
				const mut = baseSchema(instanceTag, true, literalDecoder);
				mut.class = definition["constructor"];
				mut.const = definition;
				return mut;
			} else {
				const node = definition;
				const fieldNames = Object.keys(node);
				const length2 = fieldNames.length;
				for (let idx = 0; idx < length2; idx++) {
					const location = fieldNames[idx];
					node[location] = traverseDefinition(node[location], onNode);
				}
				const mut = baseSchema(objectTag, false, objectDecoder);
				mut.required = fieldNames;
				mut.properties = node;
				mut.additionalItems = globalConfig.a;
				return mut;
			}
		}
	} else return Literal_parse(definition);
};
var missingKeyEncoder = (input, target) => {
	const item = input.s.anyOf[0];
	const v = input.v();
	const unsetIsInput = item.format === "env";
	const output = B_nextVarOutput(input, v, getOutputSchema(target));
	const body = (source, u, e = target) => {
		const scope = B_scope(input);
		scope.io = false;
		scope.s = source;
		scope.e = e;
		scope.u = u;
		B_narrowJsonSourcedJsonString(scope);
		const out = parse(scope);
		output.f |= out.f & 1;
		return B_merge(out) + (out.i === v ? "" : `${v}=${out.i};`);
	};
	const present2 = item.flags & 16 ? presentTarget(target) : target;
	const presentBody = present2 ? body(item, !unsetIsInput, present2) : B_failInvalidInput(input, target) + ";";
	const absentBody = !unsetIsInput && readsAbsent(target) ? body(target.decoder === noopDecoder ? unit : unknown, false) : "";
	const noAbsentCheck = isOptional(target) || unsetIsInput;
	output.cp = absentBody ? presentBody === "" ? `if(${v}===void 0){${absentBody}}` : `if(${v}!==void 0){${presentBody}}else{${absentBody}}` : presentBody === "" ? noAbsentCheck ? "" : B_failInvalidInput(input, target, `${v}!==void 0`) : unsetIsInput ? presentBody : noAbsentCheck ? `if(${v}!==void 0){${presentBody}}` : `if(${v}!==void 0){${presentBody}}else${B_block(B_failInvalidInput(input, target))}`;
	return output;
};
var presentTarget = (s2) => {
	const anyOf2 = s2.anyOf;
	if (anyOf2 === U || !s2.has[undefinedTag]) return s2;
	let mut;
	if (s2.decoder === noopDecoder) {
		const item = presentTarget(anyOf2[0]);
		if (item === U) return U;
		mut = item === anyOf2[0] ? copySchema(item) : item;
	} else {
		const arms = anyOf2.filter((arm) => arm.type !== undefinedTag);
		if (!arms.length) return U;
		mut = copySchema(s2);
		mut.anyOf = arms;
		mut.has = {};
		arms.forEach((arm) => setHas(mut.has, arm));
		const to2 = s2.to;
		if (to2 !== U && to2.type === anyOfTag && (to2.has[nullTag] || to2.has[undefinedTag])) {
			const toArms = to2.anyOf.filter((arm) => arm.type !== undefinedTag && (arm.type !== nullTag || mut.has[nullTag]));
			if (!toArms.length) return s2;
			const toMut = copySchema(to2);
			toMut.anyOf = toArms;
			toMut.has = {};
			toArms.forEach((arm) => setHas(toMut.has, arm));
			mut.to = toMut;
		}
	}
	mut.expression = () => /* @__PURE__ */ inputExpression(s2);
	return mut;
};
var envDefaults = (s2) => s2.format === "env" && s2.to !== U;
var readsAbsent = (s2) => {
	if (envDefaults(s2)) return true;
	if (!isOptional(s2)) return s2.type === refTag;
	if (s2.to !== U || s2.refiner !== U) return true;
	for (const arm of s2.anyOf || [s2]) {
		if (envDefaults(arm)) return true;
		if (arm.type === undefinedTag) return arm.to !== U || arm.refiner !== U;
		if (isOptional(arm) || arm.type === unknownTag && (arm.to !== U || arm.parser !== U || arm.refiner !== U)) return true;
	}
	return true;
};
var wrapDictMissingKeyLight = (s2) => {
	const mut = baseSchema(anyOfTag, false, noopDecoder);
	mut.anyOf = [s2, unit];
	mut.has = { [undefinedTag]: true };
	setHas(mut.has, s2);
	mut.encoder = missingKeyEncoder;
	mut.flags = 64;
	return mut;
};
var valGet = (parent, location) => {
	const vals = parent.d ?? (parent.d = /* @__PURE__ */ Object.create(null));
	const existing = vals[location];
	if (existing !== U) return B_scope(existing);
	else {
		let locationSchema;
		if (parent.s.type === objectTag) locationSchema = parent.s.properties[location];
		else locationSchema = parent.s.items[Number(location)];
		let schema;
		if (locationSchema !== U) schema = locationSchema;
		else {
			const additionalItems = parent.s.additionalItems;
			if (isItemSchema(additionalItems)) {
				const s2 = additionalItems;
				if (parent.s.type === objectTag && s2.type !== unknownTag && !(tagFlags[s2.type] & 512) && !isOptional(s2)) schema = wrapDictMissingKeyLight(s2);
				else schema = s2;
			} else schema = B_unsupportedDecode(parent, parent.s, parent.e);
		}
		const accessor = inlinedProperty("", location, parent.s.type === arrayTag);
		const item = {
			b: U,
			p: parent,
			v: _notVarAtParent,
			i: isLiteral(schema) && !schema.openLiteral ? B_inlineConst(parent, schema) : parent.s.type === objectTag && location in Object.prototype ? `(Object.hasOwn(${parent.v()},${inlinedValueFromString(location)})?${parent.v()}${accessor}:void 0)` : `${parent.v()}${accessor}`,
			s: schema,
			io: U,
			e: schema,
			prev: U,
			f: 0,
			d: U,
			fv: U,
			cp: "",
			fu: U,
			fs: U,
			hd: "",
			fz: U,
			vc: U,
			u: U,
			t: U,
			path: pathConcat(parent.path, [location]),
			g: parent.g,
			o: U
		};
		vals[location] = item;
		return item;
	}
};
var unionRuntimeSame = (a, b) => a.type === b.type && a.class === b.class;
var unionSameType = (a, b) => a === b || unionRuntimeSame(a, b) && !(tagFlags[a.type] & 768) && a.format === b.format;
var unionLiteralEqual = (a, b) => a === b || a !== a && b !== b;
var unionConstMismatch = (a, b) => isLiteral(a) && isLiteral(b) && !unionLiteralEqual(a.const, b.const);
var unionShapeMismatch = (target, source, held) => {
	if (unionConstMismatch(target, source)) return true;
	const fields = target.properties || target.items;
	const others = source.properties || source.items;
	if (fields && others) {
		for (const key in fields) if (others[key] !== U && unionShapeMismatch(fields[key], unionOutput(others[key]), held)) return true;
	}
	return !held && typeof target.additionalItems === objectTag && typeof source.additionalItems === objectTag && unionShapeMismatch(target.additionalItems, unionOutput(source.additionalItems));
};
var unionShaped = (schema) => !!(schema.properties || schema.items) || typeof schema.additionalItems === objectTag;
var unionOutput = (schema) => {
	let output = schema;
	while (output.type !== neverTag && output.to !== U) {
		if (output.parser === B_neverSlot) return never_;
		output = output.to;
	}
	return output;
};
var unionHoldsNone = (schema) => schema.type === neverTag || schema.type !== refTag && (!!schema.required?.some((key) => unionHoldsNone(schema.properties[key])) || Array.isArray(schema.items) && schema.items.some(unionHoldsNone));
var unionNeverLink = (schema) => {
	for (let node = schema; node !== U && node.type !== neverTag; node = node.to) if (node.parser === B_neverSlot || unionHoldsNone(node)) return true;
	return false;
};
var unionIsTransparent = (schema, converts) => {
	if (schema.type !== anyOfTag) return false;
	let fields = 0;
	for (const key in schema) if (!converts || !(key in unionDescribing)) fields++;
	return fields === 6 && (!converts || schema.encoder !== U);
};
var unionDescribing = {
	name: 1,
	title: 1,
	description: 1,
	deprecated: 1,
	examples: 1,
	protobufField: 1,
	protobufTypeName: 1,
	parser: 1,
	to: 1
};
var unionTraits = (schema) => {
	const tag = tagFlags[schema.type];
	let traits = 0;
	if (tag & 4864 || schema.parser !== U) return 15;
	if (schema.refiner !== U || schema.inputRefiner !== U) traits |= 3;
	else if (tag & 8384) traits |= 2;
	if (schema.format !== U || isLiteral(schema)) traits |= 1;
	const to2 = schema.to;
	if (to2 !== U) {
		if (to2 === schema || to2.parser !== U || tagFlags[to2.type] & 4864) traits |= 15;
		else if (!(to2.noValidation === true || tagFlags[to2.type] & 1 || unionRuntimeSame(schema, to2) || to2.type === anyOfTag && unionMask(to2, 1, 0) & tag)) traits |= 9;
		else traits |= unionTraits(to2);
	}
	const fields = schema.items || schema.properties;
	for (const key in fields) {
		const field = fields[key];
		traits |= unionTraits(field);
	}
	if (typeof schema.additionalItems === "object") traits |= unionTraits(schema.additionalItems);
	return traits;
};
var unionIsNoop = (schema) => {
	if (schema.to !== U || schema.parser !== U || tagFlags[schema.type] & 512) return false;
	const fields = schema.anyOf || schema.items || schema.properties;
	for (const key in fields) if (!unionIsNoop(fields[key])) return false;
	return typeof schema.additionalItems !== "object" || unionIsNoop(schema.additionalItems);
};
var unionOr = (cs) => {
	const s2 = cs.map((c) => c.c).join("||");
	return cs.length > 1 ? `(${s2})` : s2;
};
var unionNarrowSchema = (schema) => {
	const tagFlag = tagFlags[schema.type];
	const container = 192;
	const narrow = baseSchema(schema.type, false, (input) => {
		if (tagFlags[input.s.type] & 1) return B_refine(input, input.e, [{
			c: (inputVar) => typeCheckCond(input, schema, inputVar),
			f: failInvalidType
		}]);
		if (unionRuntimeSame(input.s, narrow)) return tagFlag & container ? B_refine(input, input.e) : input;
		if (isLiteral(schema) && tagFlag & 1036) {
			input.e = schema;
			const output = schema.decoder(input);
			input.e = narrow;
			return output;
		}
		return schema.decoder(input);
	});
	narrow.encoder = schema.encoder;
	if (schema.flags & 3) {
		narrow.flags = schema.flags & 3;
		const stored = schema.bytesCodec ? schema : schema.storedAs;
		if (stored) narrow.storedAs = stored;
	}
	if (tagFlag & 8192) narrow.class = schema.class;
	else if (tagFlag & container) {
		narrow.additionalItems = unknown;
		if (tagFlag & 64) narrow.properties = immutableEmptyObject;
		else narrow.items = immutableEmptyArray;
	} else if (tagFlag & 2096) narrow.const = schema.const;
	else if (tagFlag & 2 && schema.format !== U && schema.format !== "json") {
		narrow.format = schema.format;
		if (schema.flags & 32) narrow.flags = narrow.flags | 32;
		narrow.noValidation = schema.noValidation;
	}
	return narrow;
};
var unionWiden = (tagFlag, nan2) => tagFlag | (tagFlag & 8256 ? 8256 : tagFlag & tagFlags[numberTag] ? nan2 : 0);
var unionRefDef = (schema) => {
	const resolved = schema["$defs"] && schema.definition?.();
	return resolved !== schema ? resolved : U;
};
var unionRaw = (schema) => {
	let mask = schema.has ? 0 : -1;
	for (const tag in schema.has) {
		const flag = tagFlags[tag];
		mask |= flag & 1 ? -1 : flag;
	}
	return mask;
};
var refDefinition = (ref) => {
	const def = ref.definition();
	return def?.type === refTag ? refDefinition(def) : def;
};
var unionMask = (schema, mode, nan2) => {
	if (mode === 2) {
		const resolved = unionRefDef(schema);
		if (resolved !== U) return unionMask(resolved, 1, nan2);
	}
	const tagFlag = tagFlags[schema.type];
	if (!mode && tagFlag & 32768) return 0;
	if (mode && tagFlag & 256) {
		let mask = 0;
		const variants = schema.anyOf;
		for (let i = 0; i < variants.length; i++) mask |= unionMask(variants[i], 1, nan2);
		return mask;
	}
	return tagFlag & 769 ? -1 : unionWiden(tagFlag, nan2) | (mode && schema.format === "env" ? 16 : 0);
};
var unionGroup = (member) => ({
	m: member.m,
	a: [member],
	f: member.f & 16,
	p: member.p,
	o: false
});
var unionDiscriminator = (schema) => {
	if (isLiteral(schema)) return ["", schema.const];
	const fields = schema.properties || schema.items;
	for (const key in fields) {
		const field = fields[key];
		if (isLiteral(field)) return [key, field.const];
	}
	return U;
};
var unionDropNullish = (variants, other, outputSide) => {
	if (other === U || tagFlags[other.type] & 817 || other.format === "json" || other.format === "env") return variants;
	const kept = variants.filter((variant) => !(tagFlags[(outputSide ? unionOutput(variant) : variant).type] & 48));
	return kept.length ? kept : variants;
};
var unionCheckPartial = (input, source, target, variants, outputSide) => {
	const other = outputSide ? target : source;
	let matched = U;
	let unmatched = U;
	let byConst = false;
	for (let idx = 0; idx < variants.length; idx++) {
		const variant = variants[idx];
		const match = outputSide ? unionOutput(variant) : variant;
		if (variant.type === neverTag || (outputSide ? match.type === neverTag : unionNeverLink(variant))) continue;
		const same = unionSameType(other, match);
		const differs = outputSide && same && unionShapeMismatch(other, match);
		if (same && !differs) matched || (matched = variant);
		else if (unmatched === U) unmatched = variant, byConst = differs;
	}
	if (matched !== U && unmatched !== U) {
		const it = /* @__PURE__ */ inputExpression(unmatched);
		if (byConst) unionAmbiguous(input, source, target, `${it} isn't ${/* @__PURE__ */ inputExpression(target)}. Choose with S.to for ${it} -> ${/* @__PURE__ */ inputExpression(target)}, or S.never -> ${it}${input.path.length && input.g.o & 4 ? ", or split what holds it into a union with a member per value" : ""}`);
		unionInvalid(input, source, target, unmatched, outputSide);
	}
};
var unionPeer = (schema) => schema.anyOf?.find((variant) => !(tagFlags[variant.type] & 32816)) || schema;
var unionInvalid = (input, source, target, member, onSource) => {
	const it = /* @__PURE__ */ inputExpression(member);
	return unionAmbiguous(input, source, target, `Should ${it} be decoded or ignored? Choose with S.to for ${onSource ? `${it} -> ${/* @__PURE__ */ inputExpression(unionPeer(target))}` : `${/* @__PURE__ */ inputExpression(unionPeer(source))} -> ${it}`}, or S.never -> ${it}`);
};
var unionChoose = (source, consts) => {
	const to2 = `S.literal(${/* @__PURE__ */ inputExpression(source)}).with(S.to, S.literal(${/* @__PURE__ */ inputExpression(consts[0])}))`;
	return `Choose one with S.to, such as ${consts.length > 1 ? `S.union([${to2}${consts.slice(1).map((other) => `, S.never.with(S.to, S.literal(${/* @__PURE__ */ inputExpression(other)}))`).join("")}])` : to2}`;
};
var unionAmbiguous = (input, source, target, why) => B_invalidOperation(input, `Ambiguous ${/* @__PURE__ */ inputExpression(source)} -> ${/* @__PURE__ */ inputExpression(target)}. ${why}`);
var unionHoists = (schema) => unionIsNoop(schema) && schema.anyOf.every((arm) => !arm.refiner && !arm.inputRefiner && !arm.format && (arm.anyOf ? unionHoists(arm) : !!(tagFlags[arm.type] & 19518)));
var unionAnalyze = (sourceMask, flags, sourceTag, variants, source, nan2) => {
	const out = [];
	const unknownSource = sourceTag & 1;
	const sourceBoundary = sourceTag & 768;
	const unionSource = sourceBoundary && sourceMask !== -1;
	const sourceRaw = unionSource ? unionRaw(unionRefDef(source) || source) : 0;
	const sourceDiscriminator = unionDiscriminator(source);
	const exact = flags & 1;
	const broadObject = flags & 64;
	const broadNumber = flags & tagFlags[numberTag];
	const numberish = tagFlags[numberTag] | 2048;
	for (let i = 0; i < variants.length; i++) {
		const s2 = variants[i];
		const def = s2.type === refTag ? refDefinition(s2) : U;
		const defTag = def === U ? 0 : tagFlags[def.type];
		const view = def !== U && !(defTag & 769) ? def : s2;
		const tag = tagFlags[view.type];
		const inputMask = unionMask(defTag & 256 ? def : view, 1, nan2);
		let d = unionDiscriminator(s2);
		if (source.flags & 16 && d !== U && d[1] === U) d = U;
		const same = unionRuntimeSame(source, s2) && !(s2.type === refTag && s2 !== source);
		const discriminatorDisjoint = sourceDiscriminator !== U && d !== U && same && sourceDiscriminator[0] === d[0] && !unionLiteralEqual(sourceDiscriminator[1], d[1]);
		const accepts = !(tag & 32768) && !unionNeverLink(s2) && !discriminatorDisjoint && (!exact || (isLiteral(s2) ? unionLiteralEqual(s2.const, source.const) : sourceMask & inputMask));
		const native = (unionSource ? sourceRaw : sourceMask) & tag;
		const raw = tag & 769 ? unionRaw(defTag & 256 ? def : view) : 0;
		const coerces = accepts && !unknownSource && !(unionSource ? native : same);
		const output = unionOutput(s2);
		const traits = unionTraits(s2);
		const sourceDeopt = sourceBoundary && (!unionSource || coerces);
		const effect = output.type === neverTag ? 3 : traits & 4 || sourceDeopt ? 4 : coerces || traits & 8 ? 2 : traits & 1 || tag & 9152 ? 1 : 0;
		out[i] = {
			i,
			s: s2,
			m: accepts ? unknownSource ? inputMask : unionSource ? native ? inputMask : s2.type === undefinedTag && sourceMask & 32 ? 32 : s2.type === nullTag && sourceMask & 16 ? 16 : raw & sourceRaw | (raw & 2096 ? sourceMask & 48 : 0) | (sourceMask & 2 ? 2 : sourceMask) : sourceMask : 0,
			o: !!accepts && output.type !== neverTag,
			e: effect,
			f: traits & 7 | (effect ? 1 : 0) | (sourceDeopt ? 4 : 0) | (!unknownSource && same || tag & 37633 ? 16 : 0) | (unknownSource && s2.type === anyOfTag && unionHoists(s2) ? 32 : 0),
			p: s2.type === objectTag && nestedLoc in s2.properties || broadObject && tag & 8320 || broadNumber && tag & 2048 ? 0 : d !== U ? 1 : 2,
			k: tag & 8192 ? view.class : view.format === "env" ? view.format : view.type,
			n: unionNarrowSchema(view),
			r: tag & 8256 ? 8256 : tag & numberish ? numberish : unionWiden(tag, nan2),
			d
		};
	}
	return out;
};
var unionPlan = (members) => {
	var _a;
	const sequence = [];
	const active = [];
	const priority = [];
	let total = 0;
	let effects = 0;
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		if (member.e > 1) effects |= member.m;
		else if (!member.e) total |= member.m;
	}
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		if (member.m === 0 || member.e === 1 && !(member.f & 2) && !(member.m & (effects | ~total))) continue;
		const bucketed = member.r !== -1 && (member.m & ~member.r) === 0;
		const compatible = member.e < 2 || member.d !== U && (member.e === 4 || member.d[0] !== "");
		let bucket = bucketed ? member.p === 0 ? priority[member.r] || active[member.r] : active[member.r] : U;
		let open = U;
		let broad = false;
		if (bucket !== U) for (let j = 0; j < bucket.t.length; j++) {
			const group = bucket.t[j];
			const first = group.a[0];
			broad || (broad = group.p === 2);
			if (open === U && compatible && group.o && first.k === member.k && (first.e < 2 === member.e < 2 || first.d !== U && first.d[0] === member.d?.[0]) && group.p === 0 === (member.p === 0)) open = group;
			else if (group.o && group.m & member.m) group.o = false;
		}
		for (const key in active) {
			const other = active[+key];
			if (other !== bucket && other.m & member.m) delete active[+key];
		}
		if (!bucketed) {
			for (const key in priority) if (priority[+key].m & member.m) delete priority[+key];
			sequence.push(unionGroup(member));
			continue;
		}
		if (bucket !== U && open === U && member.p === 1 && broad) {
			delete active[member.r];
			bucket = U;
		}
		if (bucket === U) {
			bucket = {
				m: 0,
				t: []
			};
			active[member.r] = bucket;
			priority[_a = member.r] || (priority[_a] = bucket);
			sequence.push(bucket);
		}
		bucket.m |= member.m;
		if (open !== U) {
			open.a.push(member);
			open.m |= member.m;
			open.f &= -17;
		} else {
			const group = unionGroup(member);
			group.o = compatible;
			bucket.t.push(group);
		}
		if (!compatible) delete active[member.r];
	}
	const plan = [];
	for (let i = 0; i < sequence.length; i++) {
		const item = sequence[i];
		if ("a" in item) plan.push(item);
		else plan.push(...item.t.sort((a, b) => a.p - b.p));
	}
	for (let i = plan.length; i--;) {
		const group = plan[i];
		const head = group.a[0];
		if (group.a[1] || !(head.n.type === refTag || head.n.type === anyOfTag && !(head.f & 32)) || group.m === -1) continue;
		group.f |= 10;
		let to2 = i;
		while (plan[to2 + 1] && !(plan[to2 + 1].m & group.m)) to2++;
		plan.splice(to2, 0, ...plan.splice(i, 1));
	}
	const later = [];
	let laterMask = 0;
	let laterBroad = 0;
	for (let i = plan.length - 1; i >= 0; i--) {
		const group = plan[i];
		let key = U;
		let values;
		for (let j = group.a.length - 1; j >= 0; j--) {
			const member = group.a[j];
			const d = member.d;
			const conflict2 = d === U || key === false || key !== U && key !== d[0];
			if (key !== U && (conflict2 || values.has(d[1]))) {
				member.f |= 8;
				group.f |= 2;
			}
			if (conflict2) key = false;
			else {
				key = d[0];
				(values || (values = /* @__PURE__ */ new Set())).add(d[1]);
			}
		}
		const head = group.a[0];
		const route = head.r;
		const semantic = later[route];
		let overlaps = !!(laterMask & group.m) && (!!(laterBroad & group.m) || key === false || semantic === U || semantic === false || semantic[0] !== key);
		if (!overlaps && key !== false && semantic !== U && semantic !== false) {
			for (const value of values) if (semantic[1].has(value)) {
				overlaps = true;
				break;
			}
		}
		if (overlaps || laterMask && tagFlags[head.n.type] & 37633 && (head.s.to !== U || head.s.parser !== U)) group.f |= 10;
		if (route !== -1 && (group.m & ~route) === 0) {
			if (key === false) later[route] = false;
			else if (semantic === U) later[route] = [key, values];
			else if (semantic !== false) {
				if (semantic[0] !== key) later[route] = false;
				else for (const value of values) semantic[1].add(value);
			}
		} else laterBroad |= group.m;
		if (laterMask & group.m) group.f |= 32;
		laterMask |= group.m;
	}
	return plan;
};
var unionEmit = (input, self, expectedSchema, plan, toPerCase, trustedSelf) => {
	const initialInline = input.i;
	let output = B_refine(input);
	const awaitAsync = plan.some((group) => group.f & 2);
	const outputBySource = [];
	const salvaged = [];
	let rethrowEmbed = "";
	const g = input.g;
	const wanted = !(g.o & 4096);
	const outer = g.o & 1 && awaitAsync ? U : g.x;
	let failures = "";
	const failuresVar = () => failures || (failures = B_varWithoutAllocation(g));
	let aggregate = "";
	const unionFailure = () => {
		if (!aggregate) {
			let site;
			const snap = B_pathSnap(input);
			aggregate = B_embedPure(input, (v, found, path2) => {
				const errors = [];
				for (let n = found; n; n = n[0]) errors.unshift(n.length < 3 ? n[1] : n[1](n[2], n[3]));
				errors.unshift(...salvaged);
				return errorAt(site ?? (site = errorSite(expectedSchema, unknown)), path2 ?? snap, v, errors.length ? errors : U);
			});
		}
		const path = B_pathArg(input);
		return `${aggregate}(${input.v()}${failures ? `,${failures}` : path ? ",void 0" : ""}${path})`;
	};
	const final = () => {
		const jump = outer?.(unionFailure);
		if (jump !== U) return g.j++, jump;
		B_markThrow(input);
		return `throw ${unionFailure()}`;
	};
	const jumpOut = (label) => (error) => `${wanted && error ? `{${keep(error(true))};` : ""}break ${label.l || (label.l = `l${++g.v}`)}${wanted && error ? "}" : ""}`;
	const end = {};
	const toEnd = jumpOut(end);
	const fail2 = (error) => recorded ? toEnd(error) : error ? outer?.(error) : final();
	const collects = B_collects(g);
	if (collects && outer === U) {
		const nothingMore = B_embedPure(input, {
			t: settledTag,
			l: []
		});
		g.y = () => (B_markThrow(input), `throw ${nothingMore}`);
	}
	fail2.k = () => collects && !recorded;
	const collected = g.kj;
	const rethrow = () => rethrowEmbed || (rethrowEmbed = B_embed(input, getOrRethrow));
	const keep = (error) => wanted ? `${failuresVar()}=[${failures},${error}]` : error;
	const emitChain = (cases2, top) => {
		const ending = top ? final : () => g.x();
		if (cases2.length === 1 && !cases2[0].l && !(top && end.l)) {
			const c = cases2[0];
			if (c.b === "" && c.c === "") return "";
			if (c.b === "") return `if(!(${c.c}))${B_block(ending())}`;
			if (c.c === "") return c.b;
			return `if(${c.c}){${c.b}}else${B_block(ending())}`;
		}
		let code = "";
		let caught = false;
		let exhaustive = false;
		let open = false;
		const attempt = (c, idx) => {
			open = false;
			if (c.b === "") return "break";
			let arm = `${c.b}break`;
			if (c.f & 1 && (c.f & 8 || caught)) {
				caught = open = true;
				arm = `try{${arm}}catch(x){${keep(`${rethrow()}(x)`)}${!(c.f & 8) && unconditional > idx ? `;${g.x()}` : ""}}`;
			}
			if (c.l) {
				open = true;
				arm = `${c.l}:{${arm}}`;
				if (!(c.f & 8) && unconditional > idx) arm += `${g.x()};`;
			}
			if (c.f & 8 && c.f & 4) caught = true;
			return arm;
		};
		let unconditional = -1;
		for (let idx = 0; idx < cases2.length; idx++) if (cases2[idx].c === "") unconditional = idx;
		let last = "";
		for (let idx = 0; idx < cases2.length; idx++) {
			const c = cases2[idx];
			const shared = c.c !== "" && c.c === last;
			if (shared && !open) continue;
			const arm = attempt(c, idx);
			last = c.c;
			if (shared) code = `${code.slice(0, -1)}${arm}}`;
			else if (c.c === "") {
				code += arm;
				if (!open) {
					exhaustive = true;
					break;
				}
			} else code += arm === "break" ? `if(${c.c})break;` : `if(${c.c}){${arm}}`;
		}
		const label = top ? end.l || "" : "";
		const tail = !exhaustive || label ? ending() : "";
		return `for(;;){${label ? `${label}:{${code}}` : code}${tail[0] === "{" ? tail.slice(1, -1) : tail}}`;
	};
	const enter = (falls) => {
		const x = g.x, label = {};
		if (falls) g.x = jumpOut(label);
		return () => (g.x = x, label.l);
	};
	let recorded = false;
	const settle2 = (c, chain) => {
		let last;
		for (let i = chain.length; !last && i--;) if (!(chain[i].f & 16)) last = chain[i];
		if (last && c.c !== "" && c.c === last.c && (last.b === "" || !(last.l || last.f & 1 && (last.f & 8 || recorded)))) {
			c.f |= 16;
			recorded = c.s;
		} else if (c.f & 8 && c.f & 5) recorded = true;
		chain.push(c);
		return c;
	};
	g.x = fail2;
	const unionDTrusted = (member) => {
		const d = member.d;
		const tag = tagFlags[member.s.type];
		for (const group of plan) for (const m of group.a) {
			if (m === member) continue;
			if (m.d !== U ? m.d[0] === d[0] && unionLiteralEqual(m.d[1], d[1]) : m.m & tag) return false;
		}
		return true;
	};
	const compile2 = (member, source, target, falls, inherit) => {
		const mark = input.g.t, jumps = g.j, snap = recorded;
		const leave = inherit ? () => U : enter(falls || +recorded);
		const caseInput = B_scope(source);
		caseInput.u = true;
		caseInput.t = source.t;
		if (isLiteral(member.s)) caseInput.w = true;
		caseInput.io = false;
		caseInput.e = member.s;
		const sole = trustedSelf && !isLiteral(member.s) && plan.every((group) => group.a.every((m) => m === member || !(m.m & member.m)));
		if (member.s.type === refTag && member.n.type !== refTag) caseInput.s = sole ? member.s : input.s;
		else if (source.s === target.e) caseInput.s = sole && source !== input ? member.s : member.n;
		const trustedD = trustedSelf && member.p === 1 && !(member.f & 8) && member.d[0] !== "" && unionDTrusted(member) ? member.d : U;
		if (trustedD !== U) caseInput.s = member.s;
		let caseOut;
		const options = input.g.o;
		input.g.o |= 4;
		try {
			caseOut = parse(caseInput);
		} catch (exn) {
			leave();
			if (!(self.flags & 64)) throw exn;
			salvaged.push(getOrRethrow(exn));
			return U;
		} finally {
			input.g.o = options;
		}
		if (member.o) outputBySource[member.i] = caseOut.s;
		const cond = {
			c: "",
			h: []
		};
		let body = B_merge(caseOut, cond);
		const label = leave();
		const async = caseOut.f & 1;
		output.f |= async;
		if (caseOut.t) {
			output.t = true;
			const itemVar = target.v();
			if (async || caseOut.i !== itemVar) {
				body += `${itemVar}=${async && awaitAsync ? "await " : ""}${caseOut.i};`;
				if (itemVar === operationArgVar) input.g.r = true;
			}
		}
		if (trustedD !== U) {
			const dSchema = (member.s.properties || member.s.items)[trustedD[0]];
			const dRead = inlinedProperty(source.v(), trustedD[0]);
			const dCond = dSchema.type === nanTag ? `Number.isNaN(${dRead})` : `${dRead}===${B_inlineConst(caseInput, dSchema)}`;
			cond.c = cond.c ? `${dCond}&&${cond.c}` : dCond;
		}
		return {
			c: cond.c,
			b: body,
			f: (body !== "" && input.g.t !== mark ? 1 : 0) | (async && awaitAsync ? 2 : 0) | (g.j !== jumps ? 4 : 0) | falls,
			l: label,
			s: snap
		};
	};
	const cases = [];
	for (let i = 0; i < plan.length; i++) {
		const group = plan[i];
		if (group.a.length === 1 && group.f & 16) {
			const c = compile2(group.a[0], input, input, (group.a[0].f | group.f) & 8);
			if (c !== U) {
				settle2(c, cases);
				if (c.c === "" && c.b === "") break;
			}
			continue;
		}
		const mark = input.g.t, jumps = g.j, snap = recorded;
		const labelled = group.f & 8 || +recorded;
		const leave = enter(labelled);
		const before = recorded;
		const mergeNarrow = (val) => {
			const members = recorded;
			recorded = before;
			const code = B_merge(val, cond);
			recorded = members;
			return code;
		};
		const groupNarrow = group.a[0].n;
		const narrowInput = B_scope(input);
		narrowInput.io = false;
		narrowInput.e = groupNarrow;
		const narrow = parse(narrowInput);
		if (tagFlags[groupNarrow.type] & 192) {
			const resolved = unionRefDef(input.s);
			const sourceVariant = resolved !== U && resolved.anyOf !== U ? resolved.anyOf.find((v) => v.type === groupNarrow.type) : U;
			if (sourceVariant !== U) narrow.s = sourceVariant;
		}
		const inner = [];
		for (let j = 0; j < group.a.length; j++) {
			const c = compile2(group.a[j], narrow, narrowInput, group.a[j].f & 8, !!labelled && group.a.length === 1);
			if (c !== U) {
				settle2(c, inner);
				if (c.c === "" && c.b === "") break;
			}
		}
		if (!inner.length) {
			leave();
			continue;
		}
		const cond = {
			c: "",
			h: []
		};
		let body;
		let only;
		if (inner.every((c) => c.b === "")) {
			if (!inner.some((c) => c.c === "")) {
				const fused = unionOr(inner);
				body = mergeNarrow(B_refine(narrow, narrow.s, [{
					c: () => fused,
					f: failInvalidType
				}]));
			} else body = mergeNarrow(narrow);
		} else {
			const narrowCode = mergeNarrow(narrow);
			only = inner.length === 1 ? inner[0] : U;
			if (only !== U && narrowCode === "") {
				if (only.c !== "") cond.c = cond.c ? `${cond.c}&&${only.c}` : only.c;
				body = only.b;
			} else {
				if (inner.length > 1 && group.f & 32 && inner.every((c) => c.c)) {
					const fused = unionOr(inner);
					cond.c = cond.c ? `${cond.c}&&${fused}` : fused;
				}
				body = narrowCode + emitChain(inner);
			}
		}
		const label = leave();
		recorded = before || recorded && !!(group.f & 8);
		settle2({
			c: cond.c,
			b: body,
			f: (body !== "" && input.g.t !== mark ? 1 : 0) | (inner.some((c) => c.f & 2) ? 2 : 0) | (g.j !== jumps ? 4 : 0) | group.f & 8,
			l: label || (only && body === only.b ? only.l : U),
			s: snap
		}, cases);
		if (body === "" && cond.c === "") break;
	}
	const noop = cases.every((c) => c.b === "") && cases.some((c) => c.c === "");
	const pure = !noop && cases.length > 0 && cases.every((c) => c.c !== "" && c.b === "");
	const asyncDispatch = cases.some((c) => c.f & 2);
	if (pure) {
		const fused = unionOr(cases);
		output = B_refine(B_refine(output, output.s, [{
			c: () => fused,
			f: failInvalidType
		}], expectedSchema));
	} else if (!noop) {
		let dispatch2 = emitChain(cases, true);
		if (failures) dispatch2 = B_let(input.g, failures) + dispatch2;
		if (asyncDispatch) {
			const itemVar = input.v();
			output.i = `(async(${itemVar})=>{${dispatch2};return ${itemVar}})(${itemVar})`;
		} else output.cp += dispatch2;
	}
	if (!asyncDispatch) output.i = input.i;
	let out;
	if (output.f & 1) {
		output.i = `Promise.resolve(${output.i})`;
		output.v = _notVar;
		out = output;
	} else if (output.v === _var && input.cp === "" && output.cp === "" && !pure && initialInline === "i") {
		input.hd = "";
		input.v = _notVar;
		input.i = initialInline;
		out = input;
	} else out = output;
	if (g.kj !== collected) out.k = true;
	const outputAnyOf = outputBySource.filter(Boolean);
	out.s = outputAnyOf.length ? unionFactory(outputAnyOf) : never_;
	if (toPerCase !== U) {
		out.io = true;
		out.e = unionOutput(toPerCase);
		return out;
	}
	out.e = self;
	return B_markOutput(out, input);
};
var unionDecoder = (input) => {
	const self = input.e;
	const toPerCase = self.parser === U && self.to !== U && self.to.noValidation !== true ? self.to : U;
	let variants = self.anyOf;
	if (input.io && input.e === input.s || input.s === self && toPerCase === U && variants.every(unionIsNoop) || input.s.type === anyOfTag && toPerCase === U && input.s.anyOf.every((inS, idx) => {
		const s2 = variants[idx];
		return s2 !== U && !(tagFlags[inS.type] & 9152) && inS.type === s2.type && unionLiteralEqual(inS.const, s2.const) && inS.to === U && s2.to === U;
	})) return input;
	const initialTagFlag = tagFlags[input.s.type];
	const trustedSelf = input.s === self || !!(self.flags & 128);
	if (initialTagFlag & 256 || input.s.encoder === U && initialTagFlag & 512) input.s = unknown;
	if (variants.every(unionNeverLink)) B_invalidOperation(input, `Nothing decodes ${/* @__PURE__ */ inputExpression(self)}. Every member is S.never`);
	const source = input.s;
	variants = unionDropNullish(unionDropNullish(variants, source, false), toPerCase, true);
	let expected = self;
	if (variants !== self.anyOf) {
		expected = copySchema(self);
		expected.anyOf = variants;
	}
	if (!(tagFlags[source.type] & 1) && unionShaped(source)) {
		const fit = variants.filter((variant) => !unionShapeMismatch(variant, source, true));
		if (!fit.length && !(input.g.o & 32)) B_invalidOperation(input, `Can't decode ${/* @__PURE__ */ inputExpression(source)} -> ${/* @__PURE__ */ inputExpression(self)}: it holds a value none of them does. Choose one with S.to, such as ${/* @__PURE__ */ inputExpression(source)} -> ${/* @__PURE__ */ inputExpression(variants[0])}`);
		if (fit.length < variants.length) variants = fit;
	}
	const nan2 = input.g.o & 2 ? 2048 : 0;
	let flags = 0;
	const sourceLiteral = isLiteral(source);
	for (let i = 0; i < variants.length; i++) {
		const member = variants[i];
		if (sourceLiteral && isLiteral(member) && unionLiteralEqual(member.const, source.const)) flags |= 1;
		const def = member.type === refTag ? refDefinition(member) : U;
		flags |= tagFlags[(def || member).type] & (64 | tagFlags[numberTag]);
	}
	const sourceTag = tagFlags[source.type];
	if (!(sourceTag & 1) && !(flags & 1)) {
		unionCheckPartial(input, source, self, variants, false);
		const live = sourceLiteral && !(sourceTag & 48) ? variants.filter((variant) => variant.type !== neverTag && !unionNeverLink(variant)) : [];
		const consts = live.filter(isLiteral);
		const own2 = consts.filter((variant) => unionSameType(source, variant));
		if (consts.length > 1 && !own2.length) unionAmbiguous(input, source, self, `${/* @__PURE__ */ inputExpression(source)} could become any of them. ${unionChoose(source, consts)}`);
		if (live.length && own2.length === live.length && !(input.g.o & 32)) B_invalidOperation(input, `Can't decode ${/* @__PURE__ */ inputExpression(source)} -> ${/* @__PURE__ */ inputExpression(self)}: it is none of them. ${unionChoose(source, own2)}`);
	}
	if (toPerCase !== U) {
		const perCase = unionTargetOwns(toPerCase) ? variants.map((v) => unionOutput(v).type === neverTag ? U : toPerCase) : unionResolve(input, self, variants, toPerCase);
		const attach = self.refiner !== U || self.inputRefiner !== U ? unionRefinerAttacher(self) : U;
		variants = variants.map((variant, idx) => {
			const to2 = perCase[idx];
			return to2 === U && attach === U ? variant : updateOutput(variant, (mut) => {
				if (attach !== U) attach(mut);
				if (to2 !== U) unionHand(mut, to2);
			});
		});
	}
	for (let read2 = input; read2; read2 = read2.b || read2.prev) if (read2.sp > 1) {
		const own2 = B_next(input, input.v(), input.s, input.e);
		own2.v();
		input = own2;
		break;
	}
	const exit = input.g.x, y = input.g.y;
	try {
		return unionEmit(input, self, expected, unionPlan(unionAnalyze(unionMask(source, 2, nan2), flags, sourceTag, variants, source, nan2)), toPerCase, trustedSelf);
	} finally {
		input.g.x = exit;
		input.g.y = y;
	}
};
var unionHand = (link2, to2) => {
	link2.to = to2;
	link2.flags |= 32768;
};
var unionRefinerAttacher = (self) => {
	const cached = [];
	return (mut) => {
		for (let i = 0; i < 2; i++) {
			const key = i ? "inputRefiner" : "refiner";
			const source = self[key];
			if (source !== U) {
				const current = mut[key];
				mut[key] = (input) => {
					const shared = cached[i] || (cached[i] = source(input));
					return current === U ? shared : current(input).concat(shared);
				};
			}
		}
	};
};
var unionRewrite = (input, variants, map) => {
	const anyOf2 = [];
	const has = {};
	for (let idx = 0; idx < variants.length; idx++) {
		const rewritten = map(variants[idx], idx);
		anyOf2.push(rewritten);
		setHas(has, rewritten);
	}
	const mut = baseSchema(anyOfTag, false, unionDecoder);
	mut.anyOf = anyOf2;
	mut.has = has;
	mut.encoder = unionEncoder;
	mut.flags = input.s.flags & 64 | 128;
	return B_refine(input, unknown, U, mut);
};
var unionTargetOwns = (target) => target.noValidation === true || tagFlags[unionOutput(target).type] & 512 || target.type === anyOfTag && target.anyOf.some((v) => tagFlags[v.type] & 512);
var unionEncoder = (input, target) => {
	input.s;
	if (unionTargetOwns(target)) return input;
	const variants = unionDropNullish(input.s.anyOf, target, true);
	if (input.u && isLiteral(target) && variants.every((variant) => isLiteral(variant) && !(tagFlags[variant.type] & 48))) {
		unionCheckPartial(input, input.s, target, variants, true);
		return input;
	}
	if (target.flags & 64 && target.anyOf.length === variants.length) {
		const targets = target.anyOf;
		return targets.every((tv, idx) => tv === variants[idx]) ? input : unionRewrite(input, variants, (_variant, idx) => targets[idx]);
	}
	const resolved = unionResolve(input, input.s, variants, target);
	if (resolved.every((to2) => to2 === U)) return input;
	return unionRewrite(input, variants, (variant, idx) => {
		const to2 = resolved[idx];
		return to2 === U ? variant : updateOutput(variant, (mut) => unionHand(mut, to2));
	});
};
var unionOpposite = (schema) => schema.type === undefinedTag ? nullTag : schema.type === nullTag ? undefinedTag : U;
var unionResolve = (input, source, variants, target) => {
	if (source.flags & 64) return variants.map(() => target);
	if (unionIsTransparent(target, true)) return unionResolveToUnion(input, source, variants, target);
	if (!(tagFlags[target.type] & 1) && !target.noValidation) unionCheckPartial(input, source, target, variants, true);
	return variants.map((variant) => unionOutput(variant).type === neverTag ? U : target);
};
var unionResolveToUnion = (input, source, variants, target) => {
	const attach = target.parser !== U || target.to !== U ? (mut) => {
		if (target.parser !== U) mut.parser = target.parser;
		if (target.to !== U) mut.to = target.to;
	} : U;
	const targets = target.anyOf;
	const matches = [];
	const covered = [];
	let sourceNullish = 0;
	for (let s2 = 0; s2 < variants.length; s2++) {
		const sourceVariant = variants[s2];
		const sourceOut = unionOutput(sourceVariant);
		if (!(sourceVariant.type !== neverTag && sourceOut.type !== neverTag)) continue;
		if (sourceOut === target || target.anyOf !== U && sourceOut.anyOf === target.anyOf) {
			for (let t = 0; t < targets.length; t++) covered[t] = true;
			continue;
		}
		let sameTyped = targets.filter((targetVariant, t) => targetVariant.type !== neverTag && !unionNeverLink(targetVariant) && unionSameType(sourceOut, targetVariant) && (covered[t] = true));
		sourceNullish |= tagFlags[sourceOut.type] & 48;
		if (isLiteral(sourceOut) || unionShaped(sourceOut)) {
			const identical = sameTyped.filter((targetVariant) => !unionShapeMismatch(targetVariant, sourceOut));
			if (!identical.length && sameTyped.length) {
				matches[s2] = unionOf(sameTyped);
				continue;
			}
			sameTyped = identical;
		}
		if (sameTyped.length === 1) matches[s2] = sameTyped[0];
		else if (sameTyped.length > 1) matches[s2] = tagFlags[sourceOut.type] & 9152 && sameTyped.includes(sourceOut) ? sourceOut : unionFactory(sameTyped);
		if (matches[s2] !== U) continue;
		const opposite = unionOpposite(sourceOut);
		if (opposite !== U) matches[s2] = targets.find((candidate) => candidate.type === opposite && !unionNeverLink(candidate) && unionOutput(candidate).type !== neverTag);
		if (matches[s2] === U) unionInvalid(input, source, target, sourceOut, true);
	}
	for (let t = 0; t < targets.length; t++) {
		const targetVariant = targets[t];
		const opposite = unionOpposite(targetVariant);
		if (targetVariant.type !== neverTag && !unionNeverLink(targetVariant) && !covered[t] && (opposite === U || unionOutput(targetVariant).type === neverTag || !(sourceNullish & tagFlags[opposite]))) unionInvalid(input, source, target, targetVariant, false);
	}
	return matches.map((matched, idx) => {
		if (matched === U) return matched;
		if (attach !== U) return updateOutput(matched, attach);
		const sourceOut = unionOutput(variants[idx]);
		return matched === sourceOut || unionIsNoop(matched) && matched.refiner === U && matched.inputRefiner === U && matched.noValidation === U && (matched.const === U || unionLiteralEqual(matched.const, sourceOut.const)) && !(tagFlags[matched.type] & 9152) && unionSameType(matched, sourceOut) ? U : matched;
	});
};
var unionChanges = (s2, tag, refs) => {
	if (!(unionMask(s2, 1, 0) & tagFlags[tag])) return false;
	if (s2.type === refTag) {
		if (refs?.includes(s2)) return false;
		const def = s2.definition();
		return def === U || unionChanges(def, tag, [...refs || [], s2]);
	}
	if (s2.type !== anyOfTag) return !!(unionTraits(s2) & 12);
	if (s2.to !== U || s2.parser !== U) return true;
	for (const arm of s2.anyOf) {
		if (arm.type === tag) return arm.to !== U;
		if (!(unionMask(arm, 1, 0) & tagFlags[tag])) continue;
		if (unionChanges(arm, tag, refs)) return true;
		if (!(unionTraits(arm) & 3)) return false;
	}
	return false;
};
var unionWrap = (inner, empties) => {
	if (!(unionMask(inner, 1, 0) & 48)) return unionFactory([inner, ...empties]);
	const arms = unionIsTransparent(inner) ? [...inner.anyOf] : [inner];
	for (const empty of empties) {
		const at = arms.findIndex((arm) => unionChanges(arm, empty.type));
		at < 0 ? arms.push(empty) : arms.splice(at, 0, empty);
	}
	return unionFactory(arms);
};
var unionOf = (schemas) => {
	const has = {};
	const anyOf2 = [];
	for (let idx = 0; idx < schemas.length; idx++) {
		const schema = schemas[idx];
		const nested = unionIsTransparent(schema) ? schema.anyOf : [schema];
		for (let j = 0; j < nested.length; j++) {
			const member = nested[j];
			anyOf2.push(member);
			setHas(has, member);
		}
	}
	const mut = baseSchema(anyOfTag, false, unionDecoder);
	mut.anyOf = anyOf2;
	mut.encoder = unionEncoder;
	mut.has = has;
	return mut;
};
var unionFactory = (schemas) => {
	if (!schemas.length) return panic("S.union requires at least one item");
	return schemas.length === 1 ? schemas[0] : unionOf(schemas);
};
var internalRefine = (schema, makeRefiner) => {
	return updateOutput(schema, (mut) => {
		const refiner = makeRefiner(mut);
		const existingRefiner = mut.refiner;
		if (existingRefiner !== U) mut.refiner = (input) => {
			const arr = existingRefiner(input);
			arr.push(...refiner(input));
			return arr;
		};
		else mut.refiner = refiner;
	});
};
var getMutErrorMessage = (mut) => {
	const em = mut.errorMessage ? { ...mut.errorMessage } : {};
	mut.errorMessage = em;
	return em;
};
var codecTo = (schema, target, decode, encode) => {
	return updateOutput(schema, (mut) => {
		const opened = typeof decode === "boolean";
		const parser = typeof decode === functionTag ? decode : U;
		const serializer = typeof encode === functionTag ? encode : U;
		if (serializer !== U || opened) {
			const targetMut = copySchema(target);
			if (serializer !== U) targetMut.serializer = serializer;
			if (opened) {
				targetMut.flags = targetMut.flags & -13 | (decode ? 4 : 8);
				if (targetMut.anyOf?.some((arm) => arm.flags & 3)) targetMut.anyOf = targetMut.anyOf.map((arm) => {
					if (!(arm.flags & 3)) return arm;
					const armMut = copySchema(arm);
					armMut.flags = arm.flags & -13 | (decode ? 4 : 8);
					return armMut;
				});
			}
			mut.to = targetMut;
		} else mut.to = target;
		if (mut.flags & 3 && !(mut.flags & 12)) mut.flags |= 4;
		if (parser !== U) mut.parser = parser;
	});
};
var nullAsUnit = /* @__PURE__ */ copyTo(nullLiteral, unit);
var getOrArms = (schema, default_, peel) => {
	return updateOutput(schema, (mut) => {
		const anyOf2 = mut.anyOf;
		if (anyOf2 === U) return panic(`Can't set default for ${/* @__PURE__ */ inputExpression(mut)}`);
		const items = peel ? peel(anyOf2, mut, default_) : anyOf2;
		if (items === U) return;
		const outputItems = [];
		const originalItems = [];
		for (let idx = 0; idx < anyOf2.length; idx++) if (getOutputSchema(anyOf2[idx]).type !== undefinedTag) {
			const variant = items[idx];
			const outputSchema = getOutputSchema(variant);
			if (outputSchema.type === refTag && !outputSchema.definition()) panic(`Can't set default for ${/* @__PURE__ */ inputExpression(mut)}: the default is read as ${outputSchema.name}, which would need a default of its own`);
			if (!outputItems.includes(outputSchema)) outputItems.push(outputSchema);
			originalItems.push(variant);
		}
		const item = outputItems.length === 0 ? panic(`Can't set default for ${/* @__PURE__ */ inputExpression(mut)}`) : outputItems.length === 1 ? outputItems[0] : unionFactory(outputItems);
		if (default_.type === "value") setDefault(mut, originalItems.length === 1 ? originalItems[0] : unionFactory(originalItems), default_.value);
		const decodeB = (input) => {
			const target = input.e.to;
			const result = B_refine(B_next(input, default_.type === "value" ? B_inlineConst(input, Literal_parse(default_.value)) : `${B_embed(input, default_.callback)}()`, target, target));
			result.io = true;
			return result;
		};
		mut.anyOf = anyOf2.map((variant, idx) => getOutputSchema(variant).type === undefinedTag ? codecTo(variant, item, decodeB, B_neverSlot) : items[idx]);
	});
};
var emptyOr = (schema, or) => getOrArms(schema, typeof or === functionTag ? {
	type: "callback",
	callback: or
} : {
	type: "value",
	value: or
});
var expects = (fnName, expected, got) => `S.${fnName} expects ${expected}, got ${got}`;
var assertNumericBound = (fnName, root, value) => {
	const schema = getOutputSchema(root);
	const tag = schema.type;
	if (tag !== numberTag && tag !== bigintTag) panic(expects(fnName, "number | bigint schema", /* @__PURE__ */ inputExpression(schema)));
	if (tag === bigintTag ? typeof value !== bigintTag : typeof value !== numberTag || Number.isNaN(value)) throw new SuryError({
		code: "invalid_operation",
		path: pathEmpty,
		reason: expects(fnName, /* @__PURE__ */ inputExpression(schema), stringify(value))
	});
	return schema;
};
var assertLengthBound = (fnName, root, value) => {
	const schema = getOutputSchema(root);
	if (schema.type !== stringTag && schema.type !== arrayTag) panic(expects(fnName, "string | array schema", /* @__PURE__ */ inputExpression(schema)));
	if (typeof value !== numberTag || !Number.isSafeInteger(value) || value < 0) throw new SuryError({
		code: "invalid_operation",
		path: pathEmpty,
		reason: expects(fnName, "integer >= 0", stringify(value))
	});
	return schema;
};
var lit = (value) => typeof value === bigintTag ? `${value}n` : `${value}`;
var sizeKey = (schema, upper) => schema.type === arrayTag ? upper ? "maxItems" : "minItems" : schema.type === instanceTag ? upper ? "maxSize" : "minSize" : upper ? "maxLength" : "minLength";
var sizeMember = (schema) => {
	const tag = schema.type;
	return tag === instanceTag ? ".size" : tag === stringTag || tag === arrayTag ? ".length" : U;
};
var withBounds = (schema, base) => {
	const written = schema.flags >> 11 & 15;
	const member = sizeMember(schema);
	const sized = member !== U;
	const minKey = sized ? sizeKey(schema, false) : "minimum";
	const maxKey = sized ? sizeKey(schema, true) : "maximum";
	const exMin = written & 4 ? schema.exclusiveMinimum : U;
	const exMax = written & 8 ? schema.exclusiveMaximum : U;
	const high = exMax !== U ? exMax : written & 2 ? schema[maxKey] : U;
	const low = exMin !== U ? exMin : written & 1 && !(sized && schema[minKey] === 0 && high !== 0) ? schema[minKey] : U;
	const mo = schema.multipleOf;
	const subject0 = sized ? `${base}${member}` : base;
	if (low === U && high === U) return mo !== U ? `${subject0} % ${lit(mo)}` : base;
	const subject = mo !== U ? `(${subject0} % ${lit(mo)})` : subject0;
	if (low === U) return `${subject} ${exMax !== U ? "<" : "<="} ${lit(high)}`;
	if (high === U) return `${subject} ${exMin !== U ? ">" : ">="} ${lit(low)}`;
	return exMin === U && exMax === U && low === high ? `${subject} == ${lit(low)}` : `${lit(low)} ${exMin !== U ? "<" : "<="} ${subject} ${exMax !== U ? "<" : "<="} ${lit(high)}`;
};
var setBoundExpression = (mut, schema) => {
	if (!(schema.flags & 30720) && schema.multipleOf === U) {
		const base = schema.expression;
		mut.expression = (s2) => withBounds(s2, base !== U ? base(s2) : /* @__PURE__ */ inputExpression(s2, true));
	}
};
var exactDivisor = (d) => typeof d === bigintTag || Number.isInteger(d);
var multipleOfValidator = (d) => (value) => {
	const ratio = value / d;
	return Math.abs(ratio - Math.round(ratio)) < Number.EPSILON * Math.max(Math.abs(ratio), 1);
};
var boundsRefiner = (input) => {
	const s2 = input.e;
	const written = s2.flags >> 11 & 15;
	const checks = [];
	const member = sizeMember(s2);
	if (member !== U) {
		const minKey = sizeKey(s2, false);
		const maxKey = sizeKey(s2, true);
		const min = written & 1 ? s2[minKey] : U;
		const max = written & 2 ? s2[maxKey] : U;
		const em = s2.errorMessage;
		if (min !== U && min === max && (em !== U ? em[minKey] : U) === (em !== U ? em[maxKey] : U)) checks.push({
			c: (inputVar) => `${inputVar}${member}===${min}`,
			f: B_failWithErrorMessage(minKey)
		});
		else {
			if (min) checks.push({
				c: (inputVar) => `${inputVar}${member}>${min - 1}`,
				f: B_failWithErrorMessage(minKey)
			});
			if (max !== U) checks.push({
				c: (inputVar) => `${inputVar}${member}<${max + 1}`,
				f: B_failWithErrorMessage(maxKey)
			});
		}
	} else {
		const exMin = written & 4 ? s2.exclusiveMinimum : U;
		const min = exMin !== U ? exMin : written & 1 ? s2.minimum : U;
		if (min !== U) checks.push({
			c: (inputVar) => `${inputVar}${exMin !== U ? ">" : ">="}${lit(min)}`,
			f: B_failWithErrorMessage(exMin !== U ? "exclusiveMinimum" : "minimum")
		});
		const exMax = written & 8 ? s2.exclusiveMaximum : U;
		const max = exMax !== U ? exMax : written & 2 ? s2.maximum : U;
		if (max !== U) checks.push({
			c: (inputVar) => `${inputVar}${exMax !== U ? "<" : "<="}${lit(max)}`,
			f: B_failWithErrorMessage(exMax !== U ? "exclusiveMaximum" : "maximum")
		});
		const mo = s2.multipleOf;
		if (mo !== U) {
			let cond;
			if (typeof mo === bigintTag) cond = (inputVar) => `!(${inputVar}%${lit(mo)})`;
			else if (exactDivisor(mo)) cond = (inputVar) => `${inputVar}%${lit(mo)}==0`;
			else {
				const embedded = B_embed(input, multipleOfValidator(mo));
				cond = (inputVar) => `${embedded}(${inputVar})`;
			}
			checks.push({
				c: cond,
				f: B_failWithErrorMessage("multipleOf")
			});
		}
	}
	return checks;
};
var updateBounds = (schema, update) => schema.flags & 30720 || schema.multipleOf !== U ? updateOutput(schema, update) : internalRefine(schema, (mut) => {
	update(mut);
	return boundsRefiner;
});
var carryMessage = (schema, key, maybeMessage) => maybeMessage === U || key === U ? schema : updateOutput(schema, (mut) => {
	getMutErrorMessage(mut)[key] = maybeMessage;
});
var setBoundMessage = (mut, schema, key, maybeMessage, replaced) => {
	const existing = schema.errorMessage;
	if (maybeMessage !== U) getMutErrorMessage(mut)[key] = maybeMessage;
	else if (existing !== U && existing[key] !== U) getMutErrorMessage(mut)[key] = U;
	if (replaced !== U && existing !== U && existing[replaced] !== U) getMutErrorMessage(mut)[replaced] = U;
};
var narrowsLower = (schema, value, exclusive) => {
	const bound = value;
	const inclusive = schema.minimum;
	const strict2 = schema.exclusiveMinimum;
	return (inclusive === U || (exclusive ? bound >= inclusive : bound > inclusive)) && (strict2 === U || bound > strict2);
};
var narrowsUpper = (schema, value, exclusive) => {
	const bound = value;
	const inclusive = schema.maximum;
	const strict2 = schema.exclusiveMaximum;
	return (inclusive === U || (exclusive ? bound <= inclusive : bound < inclusive)) && (strict2 === U || bound < strict2);
};
var narrowsSize = (current, value, upper) => upper ? current === U || value < current : value > (current ?? 0);
var conflict = (incoming, existing) => {
	panic(`${/* @__PURE__ */ inputExpression(incoming)} contradicts ${/* @__PURE__ */ inputExpression(existing)}`);
};
var asBound = (schema, key, bit, value) => {
	const mut = {
		...schema,
		flags: schema.flags & -30721 | bit << 11
	};
	mut[key] = value;
	setBoundExpression(mut, schema);
	return mut;
};
var assertLower = (schema, value, exclusive) => {
	const key = exclusive ? "exclusiveMinimum" : "minimum";
	const bit = exclusive ? 4 : 1;
	const bound = value;
	const inclusive = schema.maximum;
	const strict2 = schema.exclusiveMaximum;
	if (inclusive !== U && (exclusive ? bound >= inclusive : bound > inclusive)) conflict(asBound(schema, key, bit, value), asBound(schema, "maximum", 2, inclusive));
	if (strict2 !== U && bound >= strict2) conflict(asBound(schema, key, bit, value), asBound(schema, "exclusiveMaximum", 8, strict2));
};
var assertUpper = (schema, value, exclusive) => {
	const key = exclusive ? "exclusiveMaximum" : "maximum";
	const bit = exclusive ? 8 : 2;
	const bound = value;
	const inclusive = schema.minimum;
	const strict2 = schema.exclusiveMinimum;
	if (inclusive !== U && (exclusive ? bound <= inclusive : bound < inclusive)) conflict(asBound(schema, key, bit, value), asBound(schema, "minimum", 1, inclusive));
	if (strict2 !== U && bound <= strict2) conflict(asBound(schema, key, bit, value), asBound(schema, "exclusiveMinimum", 4, strict2));
};
var assertSize = (schema, value, upper) => {
	const otherKey = sizeKey(schema, !upper);
	const other = schema[otherKey];
	if (other !== U && (upper ? value < other : value > other)) conflict(asBound(schema, sizeKey(schema, upper), upper ? 2 : 1, value), asBound(schema, otherKey, upper ? 1 : 2, other));
};
var gte = /* @__NO_SIDE_EFFECTS__ */ (root, minValue, maybeMessage) => {
	const schema = assertNumericBound("gte", root, minValue);
	assertLower(schema, minValue, false);
	if (!narrowsLower(schema, minValue, false)) {
		const written = schema.flags >> 11 & 15;
		return carryMessage(root, written & 4 ? "exclusiveMinimum" : written & 1 ? "minimum" : U, maybeMessage);
	}
	return updateBounds(root, (mut) => {
		setBoundExpression(mut, schema);
		mut.flags = schema.flags & -8193 | 2048;
		mut.minimum = minValue;
		mut.exclusiveMinimum = U;
		setBoundMessage(mut, schema, "minimum", maybeMessage, "exclusiveMinimum");
	});
};
var lte = /* @__NO_SIDE_EFFECTS__ */ (root, maxValue, maybeMessage) => {
	const schema = assertNumericBound("lte", root, maxValue);
	assertUpper(schema, maxValue, false);
	if (!narrowsUpper(schema, maxValue, false)) {
		const written = schema.flags >> 11 & 15;
		return carryMessage(root, written & 8 ? "exclusiveMaximum" : written & 2 ? "maximum" : U, maybeMessage);
	}
	return updateBounds(root, (mut) => {
		setBoundExpression(mut, schema);
		mut.flags = schema.flags & -16385 | 4096;
		mut.maximum = maxValue;
		mut.exclusiveMaximum = U;
		setBoundMessage(mut, schema, "maximum", maybeMessage, "exclusiveMaximum");
	});
};
var minLength = /* @__NO_SIDE_EFFECTS__ */ (root, length2, maybeMessage) => {
	const schema = assertLengthBound("minLength", root, length2);
	assertSize(schema, length2, false);
	const key = sizeKey(schema, false);
	if (!narrowsSize(schema[key], length2, false) && !(length2 === 0 && schema[key] === U)) return carryMessage(root, schema.flags & 2048 ? key : U, maybeMessage);
	return updateBounds(root, (mut) => {
		setBoundExpression(mut, schema);
		mut.flags = schema.flags | 2048;
		mut[key] = length2;
		setBoundMessage(mut, schema, key, maybeMessage);
	});
};
var maxLength = /* @__NO_SIDE_EFFECTS__ */ (root, length2, maybeMessage) => {
	const schema = assertLengthBound("maxLength", root, length2);
	assertSize(schema, length2, true);
	const key = sizeKey(schema, true);
	if (!narrowsSize(schema[key], length2, true)) return carryMessage(root, schema.flags & 4096 ? key : U, maybeMessage);
	return updateBounds(root, (mut) => {
		setBoundExpression(mut, schema);
		mut.flags = schema.flags | 4096;
		mut[key] = length2;
		setBoundMessage(mut, schema, key, maybeMessage);
	});
};
var nonEmpty = /* @__NO_SIDE_EFFECTS__ */ (schema, maybeMessage) => /* @__PURE__ */ minLength(schema, 1, maybeMessage);
var stringFormat = /* @__NO_SIDE_EFFECTS__ */ (format, test, flag, expression) => /* @__PURE__ */ initSchema(stringTag, stringDecoderFn, (s2) => {
	const re = typeof test === "string" ? new RegExp(test, "i") : test;
	s2.format = format;
	if (expression) s2.expression = () => expression;
	if (flag) s2.flags = s2.flags | 32;
	s2.refiner = (input) => {
		return [{
			c: (inputVar) => `${B_embedPure(input, re)}${re instanceof RegExp ? ".test" : ""}(${inputVar})`,
			f: B_failWithErrorMessage("format")
		}];
	};
});
var ipv4Pattern = "(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
var ipv6Pattern = /* @__NO_SIDE_EFFECTS__ */ () => "(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|" + ipv4Pattern + ")|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)";
var uriPattern = /* @__NO_SIDE_EFFECTS__ */ (schemeOptional, scheme) => "^(?:" + (scheme || "[a-z][a-z0-9+\\-.]*") + ":)" + schemeOptional + "(?:\\/\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:" + /* @__PURE__ */ ipv6Pattern() + "|[Vv][0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|" + ipv4Pattern + "|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$";
var uri = /* @__PURE__ */ stringFormat("uri", /* @__PURE__ */ uriPattern(""), 1);
(/* @__PURE__ */ new Uint8Array(8)).buffer;
var invalidDateRefine = (input) => {
	return B_refine(input, input.e, [{
		c: (inputVar) => `!Number.isNaN(${inputVar}.getTime())`,
		f: failInvalidType
	}]);
};
var dateTimeString = /* @__PURE__ */ initSchema(stringTag, stringDecoderFn, (s2) => {
	s2.format = "date-time";
	s2.flags = s2.flags | 32;
});
var date = /* @__PURE__ */ initSchema(instanceTag, (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	if (inputTagFlag & 2) {
		if (input.e.noValidation) return B_next(input, `new Date(${input.i})`, date);
		const output = B_nextVar(input, date, input.e);
		const inputVar = input.v();
		output.cp = B_let(input.g, output.i, `new Date(${inputVar})`);
		output.vc = [{
			c: () => `!Number.isNaN(${output.i}.getTime())`,
			f: failInvalidType
		}];
		return output;
	} else if (inputTagFlag & 1) return invalidDateRefine(instanceDecoder(input));
	else if (inputTagFlag & 8192 && input.s.class === date.class) return input;
	else return B_unsupportedDecode(input, input.s, input.e);
}, (s2) => {
	s2.class = Date;
	s2.encoder = (input, target) => {
		if (tagFlags[target.type] & 2) {
			if (input.s.noValidation) return parse(B_refine(B_next(input, `${input.i}.toISOString()`, dateTimeString, target)));
			const output = B_nextVar(input, dateTimeString, target);
			output.cp = `${B_let(input.g, output.i)}try{${output.i}=${input.v()}.toISOString()}catch(_)${B_block(B_failInvalidInput(input, input.s))}`;
			return parse(B_refine(output));
		} else return input;
	};
});
var panicArity = () => panic("Expected at most 3 schemas and a value. Use .with(S.to, ...) for a longer chain");
var dispatch = (n, a, b, c, d, tail, rev, flag) => {
	if (n > 4) panicArity();
	let data = U;
	let immediate = !isOwnSchema(a);
	if (immediate) {
		data = a, a = b, b = c, c = d, n--;
		if (n < 1 || !isOwnSchema(a)) panicNotSchema();
	}
	const k = n > 1 && isOwnSchema(b) ? n > 2 && isOwnSchema(c) ? 3 : 2 : 1;
	if (n > k) {
		if (immediate || n > k + 1) panic("Expected a Sury schema. The data goes first or last");
		data = k > 2 ? isOwnSchema(d) ? panicArity() : d : k > 1 ? c : b;
		immediate = true;
	}
	const first = rev ? /* @__PURE__ */ reverse(a) : a;
	const op = k > 2 ? /* @__PURE__ */ getOp(flag, 3, first, b, c, tail) : k > 1 ? /* @__PURE__ */ getOp(flag, 2, first, b, tail) : /* @__PURE__ */ getOp(flag, 1, first, tail);
	return immediate ? op(data) : op;
};
// @__NO_SIDE_EFFECTS__
function parseOrThrow(a, b, c, d) {
	return dispatch(arguments.length, a, b, c, d, U, false, 8);
}
var getStandardJSONSchema = (schema, options, isOutput2) => {
	throw new SuryError({
		code: "invalid_operation",
		path: pathEmpty,
		reason: "~standard.jsonSchema requires S.enableStandardJSONSchema() to be called first"
	});
};
Object.defineProperty(schemaPrototype, "toString", { value: function() {
	const input = /* @__PURE__ */ inputExpression(this);
	const output = /* @__PURE__ */ inputExpression(/* @__PURE__ */ reverse(this));
	return `Schema<${input === output ? input : `${input}, ${output}`}>`;
} });
Object.defineProperty(schemaPrototype, "~standard", { get: function() {
	const schema = this;
	let opFlag = U;
	let validateOp;
	const standard = {
		version: 1,
		vendor,
		validate: (input) => {
			if (opFlag !== globalConfig.f) {
				validateOp = /* @__PURE__ */ getOp(641, 2, unknown, schema);
				opFlag = globalConfig.f;
			}
			return validateOp(input);
		},
		jsonSchema: {
			input: (options) => getStandardJSONSchema(schema, options, false),
			output: (options) => getStandardJSONSchema(schema, options, true)
		}
	};
	valueOptions[valKey] = standard;
	Object.defineProperty(schema, "~standard", valueOptions);
	return standard;
} });
var union = /* @__NO_SIDE_EFFECTS__ */ (values) => unionFactory(values.map(definitionToSchema));
var nullable = /* @__NO_SIDE_EFFECTS__ */ (definition, maybeOr) => {
	const schema = unionWrap(/* @__PURE__ */ definitionToSchema(definition), [maybeOr === U ? nullLiteral : nullAsUnit]);
	return maybeOr === U ? schema : emptyOr(schema, maybeOr);
};
// ../schemas/libraries/sury/download/index.ts
const imageSchema = /* @__PURE__ */ definitionToSchema({
	id: float,
	created: date,
	title: string.with(nonEmpty).with(maxLength, 100),
	type: /* @__PURE__ */ union(["jpg", "png"]),
	size: float,
	url: uri
});
const ratingSchema = /* @__PURE__ */ definitionToSchema({
	id: float,
	stars: float.with(gte, 1).with(lte, 5),
	title: string.with(nonEmpty).with(maxLength, 100),
	text: string.with(nonEmpty).with(maxLength, 1e3),
	images: /* @__PURE__ */ array(imageSchema)
});
(/* @__PURE__ */ parseOrThrow(/* @__PURE__ */ definitionToSchema({
	id: float,
	created: date,
	title: string.with(nonEmpty).with(maxLength, 100),
	brand: string.with(nonEmpty).with(maxLength, 30),
	description: string.with(nonEmpty).with(maxLength, 500),
	price: float.with(gte, 1).with(lte, 1e4),
	discount: float.with(gte, 1).with(lte, 100).with(nullable),
	quantity: float.with(gte, 0).with(lte, 10),
	tags: /* @__PURE__ */ array(string.with(nonEmpty).with(maxLength, 30)),
	images: /* @__PURE__ */ array(imageSchema),
	ratings: /* @__PURE__ */ array(ratingSchema)
})))({});
