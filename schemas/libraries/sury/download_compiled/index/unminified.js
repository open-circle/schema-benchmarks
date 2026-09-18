//#region ../node_modules/.pnpm/sury@11.0.0/node_modules/sury/index.mjs
var pathEmpty = [];
var pathDynamic = ["[]"];
var inlineUnsafeRe = /["\\\n\r]/;
var inlinedValueFromString = (str) => inlineUnsafeRe.test(str) ? JSON.stringify(str) : `"${str}"`;
var jsIdentRe = /^[A-Za-z_$][\w$]*$/;
var inlinedObjectKey = (key) => key === "__proto__" ? "[\"__proto__\"]" : jsIdentRe.test(key) ? key : inlinedValueFromString(key);
var inlinedProperty = (obj, key, numeric) => numeric && /^\d+$/.test(key) ? `${obj}[${key}]` : key === "__proto__" || !jsIdentRe.test(key) ? `${obj}[${inlinedValueFromString(key)}]` : `${obj}.${key}`;
var pathConcat = /* @__NO_SIDE_EFFECTS__ */ (path, concatedPath) => path.length ? concatedPath.length ? path.concat(concatedPath) : path : concatedPath;
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
var namedConstructor = (unknown2) => {
	const ctor = Object.getPrototypeOf(unknown2)?.constructor;
	return ctor !== Object && ctor?.name;
};
var stringifyLeaf = (unknown2) => {
	const tagFlag = tagFlags[typeof unknown2];
	if (tagFlag & 16) return undefinedTag;
	else if (tagFlag & 4160) return unknown2 === null ? nullTag : Array.isArray(unknown2) ? `Array(${unknown2.length})` : namedConstructor(unknown2) || objectTag;
	else if (tagFlag & 2) return `"${unknown2}"`;
	else if (tagFlag & 1024) return `${unknown2}n`;
	else return unknown2.toString();
};
var stringify = (unknown2) => {
	if (unknown2 !== null && typeof unknown2 === objectTag) {
		if (Array.isArray(unknown2)) {
			const items = unknown2;
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
		if (!namedConstructor(unknown2)) {
			const dict2 = unknown2;
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
	return stringifyLeaf(unknown2);
};
var inputExpression = /* @__NO_SIDE_EFFECTS__ */ (schema, skipOverride) => {
	if (schema.name) return schema.name;
	else if (schema.const !== U) return stringify(schema.const);
	else if (schema.expression && !skipOverride) return schema.expression(schema);
	else if (schema.anyOf !== U) {
		const anyOf = schema.anyOf;
		const seen = /* @__PURE__ */ new Set();
		let body = "";
		for (let idx = 0; idx < anyOf.length; idx++) {
			const expression = /* @__PURE__ */ inputExpression(anyOf[idx]);
			if (!seen.has(expression)) {
				seen.add(expression);
				body += (body ? " | " : "") + expression;
			}
		}
		return body;
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
			return (item.type === anyOfTag || item.bounds !== U || item.multipleOf !== U ? `(${itemName})` : itemName) + "[]";
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
Schema.prototype = schemaPrototype;
var reversedKey = "r";
var SelfReverseSchema = function() {};
var selfReversePrototype = Object.create(schemaPrototype);
Object.defineProperty(selfReversePrototype, reversedKey, { get() {
	return this;
} });
Object.defineProperty(selfReversePrototype, "sr", { value: true });
SelfReverseSchema.prototype = selfReversePrototype;
var seq = 1;
var exnId = {};
var SuryError = class extends Error {
	constructor(params) {
		super();
		Object.assign(this, params);
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
Object.defineProperty(SuryError.prototype, "name", { value: "SuryError" });
Object.defineProperty(SuryError.prototype, "s", { value: s });
var getOrRethrow = (exn) => {
	if (exn && exn.s === s) return exn;
	throw exn;
};
var panic = (message) => {
	throw new Error(`[Sury] ${message}`);
};
var formatErrorMessage = (error) => `${error.path.length ? `Failed at ${/* @__PURE__ */ pathToText(error.path)}: ` : ""}${error.reason}`;
var globalConfig = {
	m: formatErrorMessage,
	d: U,
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
	if (schema.content !== U) setContent(c, schema.content);
	if (schema.bc !== U) setBytesCodec(c, schema.bc);
	return c;
};
var copyTo = (from, to2) => {
	const mut = copySchema(from);
	mut.to = to2;
	return mut;
};
var setContent = (schema, content) => {
	valueOptions[valKey] = content;
	Object.defineProperty(schema, "content", valueOptions);
};
var setBytesCodec = (schema, codec) => {
	valueOptions[valKey] = codec;
	Object.defineProperty(schema, "bc", valueOptions);
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
var setHas = (has, tag) => {
	has[tagFlags[tag] & 768 ? unknownTag : tag] = true;
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
	val.cp = `let ${v}=${val.i};`;
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
	B_hoistDecl(parent, `${v}=${val.i}`);
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
		if (val.i === "") val.cp = `let ${v};` + val.cp;
		else val.cp += `let ${v}=${val.i};`;
	} else B_hoistDecl(val, val.i === "" ? v : `${v}=${val.i}`);
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
var B_hoistDecl = (owner, decl) => {
	owner.hd += (owner.hd && ",") + decl;
};
var B_operationArg = (schema, expected, flag, defs) => {
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
		hd: "",
		fz: U,
		vc: U,
		u: U,
		t: U,
		path: pathEmpty,
		g: {
			d: defs,
			o: flag,
			e: [],
			v: -1,
			t: 0
		},
		o: U
	};
};
var B_throw = (errorDetails) => {
	throw new SuryError(errorDetails);
};
var B_unsupportedDecode = (b, from, target) => B_throw({
	code: "unsupported_decode",
	from,
	to: target,
	reason: `Can't decode ${/* @__PURE__ */ inputExpression(from)} -> ${/* @__PURE__ */ inputExpression(target)}. Define custom codec with S.to`,
	path: b.path
});
var B_failWithArg = (b, fn, arg) => `${B_embed(b, (a) => {
	B_throw(fn(a));
})}(${arg})`;
var B_markThrow = (b) => {
	b.g.t++;
};
var B_foreignDetails = (input, to2, cause) => ({
	code: "invalid_conversion",
	from: input.s,
	to: to2,
	cause,
	path: input.path,
	reason: cause instanceof Error ? ("" + cause).replace(/^Error: /, "") : stringify(cause)
});
var B_errorOf = (input) => {
	let to2 = input.e;
	while (to2.to) to2 = to2.to;
	return (e) => e && e.s === s ? e : new SuryError(B_foreignDetails(input, to2, e));
};
var B_makeInvalidInputDetails = (expected, received, path, input, unionErrors, reasonOverride) => {
	let reasonRef = reasonOverride;
	if (reasonRef === U) {
		const expectedExpression = /* @__PURE__ */ inputExpression(expected);
		const receivedExpression = stringify(input);
		reasonRef = `Expected ${expectedExpression}, received ${expectedExpression === receivedExpression ? "invalid " : ""}${receivedExpression}`;
	}
	if (unionErrors) {
		const seenReasons = /* @__PURE__ */ new Set();
		for (let idx = 0; idx < unionErrors.length; idx++) {
			const caseError = unionErrors[idx];
			const line = `
- ${caseError.path.length ? `At ${/* @__PURE__ */ pathToText(caseError.path)}: ` : ""}${caseError.reason.split("\n").join("\n  ")}`;
			if (!seenReasons.has(line)) {
				seenReasons.add(line);
				reasonRef += line;
			}
		}
	}
	return {
		code: "invalid_input",
		expected,
		received,
		path,
		reason: reasonRef,
		unionErrors,
		input
	};
};
var B_invalidInputBuilder = (expected, extraPath = pathEmpty, reasonOverride) => (input) => {
	const path = /* @__PURE__ */ pathConcat(input.path, extraPath);
	return (value) => B_makeInvalidInputDetails(expected ?? input.e, (input.prev || input).s, path, value, U, reasonOverride);
};
var B_failWithErrorMessage = (key, defaultMessage) => (input) => {
	const em = input.e.errorMessage;
	const m = em?.[key] ?? em?.["_"] ?? defaultMessage;
	return m !== U ? B_invalidInputBuilder(U, U, m)(input) : failInvalidType(input);
};
var B_embedInvalidInput = (input, expected = input.e) => B_failWithArg(input, B_invalidInputBuilder(expected)(input), input.v());
var B_emitChecks = (val, inputVar) => {
	const checks = val.vc;
	let out = "", i = 0, len = checks.length;
	while (i < len) {
		const head = checks[i], fail = head.f;
		let cond = head.c(inputVar);
		i++;
		while (i < len && checks[i].f === fail) {
			cond += "&&" + checks[i].c(inputVar);
			i++;
		}
		out += `${cond}||${B_failWithArg(val, fail(val), inputVar)};`;
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
			if (out && (!val2.t || !val2.prev.t && val2.cp === "")) {
				const inputVar = (current || val2).v();
				const checks = val2.vc;
				let hoisted = "";
				for (let i = 0; i < checks.length; i++) {
					const check = checks[i];
					const condCode = check.c(inputVar);
					if (check.f === failInvalidType) hoisted = hoisted ? `${hoisted}&&${condCode}` : condCode;
					else if (val2.e.noValidation !== true) currentCode += `${condCode}||${B_failWithArg(val2, check.f(val2), inputVar)};`;
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
		if (val2.hd) currentCode += `let ${val2.hd};`;
		val2.fz = true;
		code = val2.cp + currentCode + code;
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
	let outC;
	const ir = valInput.e.inputRefiner;
	if (ir) {
		const c = ir(valInput);
		if (c.length) (valInput.vc ?? (valInput.vc = [])).push(...c);
	}
	const rf = val.e.refiner;
	if (rf) {
		const c = rf(val);
		if (c.length) outC = c;
	}
	if (outC && val.f & 1) {
		const v = val.v();
		val.i = `${v}.then(${v}=>{${B_merge(B_refine(B_scope(val), U, outC))}return ${v}})`;
		val.v = _notVar;
	} else if (outC) val = B_refine(val, U, outC);
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
		hd: "",
		fz: U,
		vc: U,
		u: U,
		t: U,
		path: pathEmpty,
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
	if (val.f & 1) val.v();
	objectVal.cp += B_merge(val);
	objectVal.d[location] = val;
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
	path: val.path
});
var B_mergeWithCatch = (val, catchFn, appendSafe, pureSince) => {
	const valCode = B_merge(val);
	const pure = pureSince !== U && val.g.t === pureSince;
	if ((valCode === "" || pure) && !(val.f & 1)) return appendSafe ? valCode + appendSafe() : pure ? "" : valCode;
	const errorVar = B_varWithoutAllocation(val.g);
	B_markThrow(val);
	const catchCode = `${catchFn(errorVar)};throw ${errorVar}`;
	if (val.f & 1) val.i = `${val.i}.catch(${errorVar}=>{${catchCode}})`;
	return `try{${valCode}${appendSafe ? appendSafe() : ""}}catch(${errorVar}){${catchCode}}`;
};
var B_mergeWithPathPrepend = (val, parent, locationVar, appendSafe, pureSince) => !val.path.length && locationVar === U ? B_merge(val) : B_mergeWithCatch(val, (errorVar) => {
	let segments = "";
	for (let idx = 0; idx < parent.path.length; idx++) {
		const segment = parent.path[idx];
		segments += `${typeof segment === "string" ? inlinedValueFromString(segment) : segment},`;
	}
	if (locationVar !== U) segments += `${locationVar},`;
	return `${errorVar}.path=[${segments}...${errorVar}.path]`;
}, appendSafe, pureSince);
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
var instanceofCond = (b, class_, inputVar) => `${inputVar} instanceof ${B_embed(b, class_)}`;
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
		output.cp = `let ${output.i}=+${inputVar};`;
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
		if (input.s.const === expectedSchema.const) return input;
		else return B_nextConst(input, expectedSchema);
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
		const defs = loopInput.e["$defs"];
		if (defs) loopInput.g.d ? Object.assign(loopInput.g.d, defs) : loopInput.g.d = defs;
		if (loopInput.f & 1) {
			const operationInputVar = loopInput.v();
			const operationInput = B_scope(loopInput);
			const operationOutput = parse(operationInput);
			const operationCode = B_merge(operationOutput);
			result = operationInput.i !== operationOutput.i || operationCode !== "" ? B_next(loopInput, `${operationInputVar}.then(${operationInputVar}=>{${operationCode}return ${operationOutput.i}})`, operationOutput.s, operationOutput.e) : B_refine(loopInput, operationOutput.s, U, operationOutput.e);
			result.f |= 1;
			result.io = true;
		} else if (loopInput.io) {
			const to2 = loopInput.e.to;
			result = loopInput.e.parser ? loopInput.e.parser(loopInput) : B_refine(result, U, U, to2);
		} else {
			const maybeEncoder = loopInput.s.encoder;
			if (maybeEncoder && maybeEncoder !== appliedEncoder && loopInput.s !== loopInput.e && loopInput.e.type !== unknownTag && !(loopInput.e.noValidation && (loopInput.e.isJson || loopInput.e.type === undefinedTag))) result = maybeEncoder(loopInput, loopInput.e);
			if (loopInput !== result) appliedEncoderRef = maybeEncoder;
			else {
				result = loopInput.e.decoder(loopInput);
				if (!result.io) result = B_markOutput(result, result);
			}
		}
	}
	return result;
};
var parseDynamic = (input) => {
	try {
		return parse(input);
	} catch (exn) {
		const error = getOrRethrow(exn);
		error.path = /* @__PURE__ */ pathConcat(input.p ? input.p.path : pathEmpty, /* @__PURE__ */ pathConcat(/* @__PURE__ */ pathConcat(input.path, pathDynamic), error.path));
		throw error;
	}
};
var throwTail = (input, code, out, isAsync, flag, hasDefs) => {
	if (flag & 1024) {
		const errorOf = B_errorOf(input);
		const issues = B_embedPure(input, (e2) => {
			const error = errorOf(e2);
			return { issues: [{
				message: error.reason,
				path: error.path.length ? error.path : U
			}] };
		});
		const v = isAsync ? B_varWithoutAllocation(input.g) : "";
		const body = isAsync ? `${code}return ${out}.then(${v}=>({value:${v}}),${issues})` : `${code}return {value:${out}}`;
		if (!input.g.t) return body;
		const e = B_varWithoutAllocation(input.g);
		return `try{${body}}catch(${e}){return ${isAsync ? `Promise.resolve(${issues}(${e}))` : `${issues}(${e})`}}`;
	}
	return code === "" && out === operationArgVar && !(flag & 1) ? U : `${code}return ${flag & 1 && !isAsync && !hasDefs ? `Promise.resolve(${out})` : out}`;
};
var emitTail = throwTail;
var compileDecoder = (schema, expected, flag, defs, node) => {
	const input = B_operationArg(isLiteral(schema) ? unknown : schema, expected, flag, defs);
	const output = parse(input);
	const code = B_merge(output);
	const isAsync = !!(output.f & 1);
	if (node) {
		node.y = isAsync;
		node.t = output.t === true;
	}
	const body = emitTail(input, code, output.i, isAsync, flag, !!defs);
	if (!body) return noopOperation;
	const fn = new Function("e", "s", `return ${operationArgVar}=>{${body}}`)(input.g.e, s);
	fn.embedded = input.g.e;
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
		next && next.opens !== U ? mut.opens = !next.opens : delete mut.opens;
		delete record["default"];
		delete record["examples"];
		if (mut.items) mut.items = mut.items.map(reverse);
		if (mut.properties) mut.properties = reverseDict(mut.properties);
		if (typeof mut.additionalItems === objectTag) mut.additionalItems = /* @__PURE__ */ reverse(mut.additionalItems);
		if (mut.anyOf) {
			const anyOf = mut.anyOf;
			const has = {};
			const newAnyOf = [];
			for (let idx = 0; idx < anyOf.length; idx++) {
				const s2 = anyOf[idx];
				const reversed = /* @__PURE__ */ reverse(s2);
				newAnyOf.push(reversed);
				setHas(has, reversed.type);
			}
			mut.has = has;
			mut.anyOf = newAnyOf;
		}
		if (mut["$defs"]) mut["$defs"] = reverseDict(mut["$defs"]);
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
var compileChain = (cacheTarget, args, flag) => {
	let schema = args[args.length - 1];
	for (let i = args.length - 2; i >= 0; i--) {
		const to2 = schema;
		schema = updateOutput(args[i], (mut) => {
			mut.to = to2;
			if (mut.content !== U && mut.opens === U) mut.opens = true;
		});
	}
	const f = compileDecoder(flag & 8 ? unknown : schema, schema, flag, U);
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
	return compileChain(cacheTarget, [
		a0,
		a1,
		a2,
		a3
	].slice(0, n), flag);
};
var nestedLoc = "BS_PRIVATE_NESTED_SOME_NONE";
var never_ = /* @__PURE__ */ initSchema(neverTag, (input) => {
	const output = B_refine(input, never_, U, never_);
	output.cp = B_embedInvalidInput(input) + ";";
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
var B_unrecognizedKeys = (input, keys, keyVar, decl) => {
	const fail = B_failWithArg(input, (key) => ({
		code: "unrecognized_key",
		path: input.path,
		reason: `Unrecognized key ${stringify(key)}`,
		key
	}), keyVar);
	let cond = "";
	for (let idx = 0; idx < keys.length; idx++) {
		if (idx) cond += "&&";
		cond += `${keyVar}!==${inlinedValueFromString(keys[idx])}`;
	}
	return `for(${decl}${keyVar} in ${input.v()})` + (cond ? `if(${cond})` : "") + fail + ";";
};
var B_fused = (input, expectedSchema, item) => {
	const to2 = expectedSchema.to;
	return to2 !== U && to2.fz !== U ? to2.fz(input, expectedSchema, item) : U;
};
var B_narrowJsonSourcedJsonString = (itemInput) => {
	if (itemInput.s.isJson && itemInput.e.format === "json") itemInput.s = unknown;
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
	required: [],
	properties: /* @__PURE__ */ Object.create(null),
	additionalItems: "strict",
	decoder: objectDecoder
});
var makeArrayVal = (prev) => B_makeContainerVal(prev, {
	type: arrayTag,
	items: [],
	additionalItems: "strict",
	decoder: arrayDecoder
});
var completeObjectVal = (objectVal) => {
	const isArray = objectVal.s.type === arrayTag;
	let inline = "";
	let promiseAllContent = "";
	let optionalSettingCode = U;
	const keys = Object.keys(objectVal.d);
	for (let idx = 0; idx < keys.length; idx++) {
		const key = keys[idx];
		const val = objectVal.d[key];
		if (val.f & 1) promiseAllContent += val.i + ",";
		if (val.o) {
			const existingFn = optionalSettingCode;
			optionalSettingCode = (objectVar) => {
				return (existingFn === U ? "" : existingFn(objectVar)) + (key === "__proto__" ? `if(${val.v()}!==void 0){${objectVar}={...${objectVar},["__proto__"]:${val.i}}}` : `if(${val.v()}!==void 0){${inlinedProperty(objectVar, key, isArray)}=${val.i}}`);
			};
		} else inline = inline + (isArray ? `${val.i}` : `${inlinedObjectKey(key)}:${val.i}`) + ",";
	}
	objectVal.i = isArray ? "[" + inline.slice(0, -1) + "]" : "{" + inline.slice(0, -1) + "}";
	if (promiseAllContent) {
		promiseAllContent = promiseAllContent.slice(0, -1);
		const operationInput = B_scope(objectVal);
		operationInput.io = true;
		const operationOutput = parse(operationInput);
		let operationCode = B_merge(operationOutput);
		let result = operationOutput.i;
		if (optionalSettingCode !== U) {
			const objectVar = B_varWithoutAllocation(objectVal.g);
			operationCode = operationCode + `let ${objectVar}=${result};` + optionalSettingCode(objectVar);
			result = objectVar;
		}
		if (operationCode === "" && promiseAllContent === result) objectVal.i = result;
		else objectVal.i = `Promise.all([${promiseAllContent}]).then(([${promiseAllContent}])=>{${operationCode}return ${result}})`;
		objectVal.f |= 1;
		objectVal.s = operationOutput.s;
		objectVal.e = operationOutput.e;
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
			const raiseCountBefore = input.g.t;
			const itemInput = B_dynamicScope(input, iteratorVar);
			B_narrowJsonSourcedJsonString(itemInput);
			const itemOutput = parseDynamic(itemInput);
			const hasTransform = itemOutput.t;
			const output2 = hasTransform ? B_next(input, `new Array(${inputVar}.length)`, arrayFactory(itemOutput.s)) : B_refine(input, expectedSchema);
			const itemCode = B_mergeWithPathPrepend(itemOutput, input, iteratorVar, hasTransform ? () => B_addKey(output2, iteratorVar, itemOutput) : U, hasTransform ? U : raiseCountBefore);
			if (hasTransform || itemCode !== "") output2.cp = output2.cp + `for(let ${iteratorVar}=${expectedLength};${iteratorVar}<${inputVar}.length;++${iteratorVar}){${itemCode}}`;
			if (itemOutput.f & 1) output = B_asyncVal(output2, `Promise.all(${output2.i})`);
			else output = output2;
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
			const itemOutput = parse(itemInput);
			if (isUnion && isLiteral(schema)) B_hoistChildChecks(input, itemOutput, key);
			B_addObjectField(objectVal, key, itemOutput);
			if (!shouldRecreateInput) shouldRecreateInput = itemOutput.t;
		}
		if (shouldRecreateInput) output = completeObjectVal(objectVal);
		else {
			const o = B_refine(input, fused || expectedSchema);
			o.cp = objectVal.cp;
			o.d = objectVal.d;
			output = o;
		}
	}
	return B_markOutput(output, input);
};
var objectTypeCheck = {
	c: objectTagCond,
	f: failInvalidType
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
		const raiseCountBefore = input.g.t;
		const itemInput = B_dynamicScope(input, keyVar);
		B_narrowJsonSourcedJsonString(itemInput);
		const itemOutput = parseDynamic(itemInput);
		const hasTransform = itemOutput.t;
		const output2 = hasTransform ? B_next(input, "{}", dictFactory(itemOutput.s)) : B_refine(input, expectedSchema);
		const itemCode = B_mergeWithPathPrepend(itemOutput, input, keyVar, hasTransform ? () => B_addKey(output2, keyVar, itemOutput) : U, hasTransform ? U : raiseCountBefore);
		if (hasTransform || itemCode !== "") output2.cp = output2.cp + `for(let ${keyVar} in ${inputVar}){${itemCode}}`;
		if (itemOutput.f & 1) {
			const resolveVar = B_varWithoutAllocation(output2.g);
			const rejectVar = B_varWithoutAllocation(output2.g);
			const asyncParseResultVar = B_varWithoutAllocation(output2.g);
			const counterVar = B_varWithoutAllocation(output2.g);
			const outputVar = output2.v();
			output = B_asyncVal(output2, `new Promise((${resolveVar},${rejectVar})=>{let ${counterVar}=Object.keys(${outputVar}).length;if(!${counterVar}){${resolveVar}(${outputVar})}for(let ${keyVar} in ${outputVar}){${outputVar}[${keyVar}].then(${asyncParseResultVar}=>{${outputVar}[${keyVar}]=${asyncParseResultVar};if(${counterVar}--===1){${resolveVar}(${outputVar})}},${rejectVar})}})`);
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
			if (absent) {
				const target = copySchema(source);
				target.anyOf = source.anyOf.map((variant) => variant.type === undefinedTag ? variant : updateOutput(variant, (mut) => {
					mut.to = itemSchema;
				}));
				target.perVariant = true;
				itemInput.e = target;
			} else itemInput.e = itemSchema;
			itemInput.io = false;
			itemInput.u = isUnion;
			B_narrowJsonSourcedJsonString(itemInput);
			const itemOutput = parse(itemInput);
			if (absent) itemOutput.o = true;
			B_addObjectField(objectVal, key, itemOutput);
		}
		output = completeObjectVal(objectVal);
	} else {
		const properties = expectedSchema.properties;
		const keys = Object.keys(properties);
		const keysCount = keys.length;
		const objectVal = makeObjectVal(input);
		const ai = expectedSchema.additionalItems;
		const fused = B_fused(input, expectedSchema);
		let shouldRecreateInput = fused === U && ai !== "strict" && (ai !== "strip" || sourceIsDict || Object.keys(input.s.properties).length !== keysCount);
		const isJsonParent = isItemSchema(inputAdditionalItems) && inputAdditionalItems.isJson;
		for (let idx = 0; idx < keysCount; idx++) {
			const key = keys[idx];
			const schema = properties[key];
			const itemInput = valGet(input, key);
			itemInput.e = schema;
			itemInput.io = false;
			itemInput.u = isUnion;
			if (isJsonParent && schema.type === anyOfTag && schema.has[undefinedTag]) itemInput.i = `(${itemInput.i}??null)`;
			if (fused !== U && !(isUnion && isLiteral(schema))) {
				B_addObjectField(objectVal, key, itemInput);
				continue;
			}
			B_narrowJsonSourcedJsonString(itemInput);
			const itemOutput = parse(itemInput);
			if (isUnion && isLiteral(schema)) B_hoistChildChecks(input, itemOutput, key);
			B_addObjectField(objectVal, key, itemOutput);
			if (!shouldRecreateInput) shouldRecreateInput = itemOutput.t;
		}
		if (ai === "strict" && isItemSchema(inputAdditionalItems) && fused === U) {
			const keyVar = B_varWithoutAllocation(objectVal.g);
			B_hoistDecl(input, keyVar);
			objectVal.cp += B_unrecognizedKeys(input, keys, keyVar, "");
		}
		if (shouldRecreateInput) output = completeObjectVal(objectVal);
		else {
			const o = B_refine(input, fused || expectedSchema);
			o.cp = objectVal.cp;
			o.d = objectVal.d;
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
	const presentIn = B_scope(input);
	presentIn.io = false;
	presentIn.s = item;
	presentIn.e = target;
	presentIn.u = true;
	const presentOut = parse(presentIn);
	const presentCode = B_merge(presentOut);
	const presentAssign = presentOut.i === v ? "" : `${v}=${presentOut.i};`;
	const absentCode2 = isOptional(target) ? "" : B_embedInvalidInput(input, target);
	const output = B_nextVarOutput(input, v, getOutputSchema(target), target);
	const presentBody = presentCode + presentAssign;
	output.cp = presentBody === "" ? absentCode2 === "" ? "" : `${v}!==void 0||${absentCode2};` : absentCode2 === "" ? `if(${v}!==void 0){${presentBody}}` : `if(${v}!==void 0){${presentBody}}else{${absentCode2}}`;
	return output;
};
var wrapDictMissingKeyLight = (s2) => {
	const mut = baseSchema(anyOfTag, false, noopDecoder);
	mut.anyOf = [s2, unit];
	mut.has = { [undefinedTag]: true };
	setHas(mut.has, s2.type);
	mut.encoder = missingKeyEncoder;
	mut.perVariant = true;
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
			i: isLiteral(schema) ? B_inlineConst(parent, schema) : parent.s.type === objectTag && location in Object.prototype ? `(Object.hasOwn(${parent.v()},${inlinedValueFromString(location)})?${parent.v()}${accessor}:void 0)` : `${parent.v()}${accessor}`,
			s: schema,
			io: U,
			e: schema,
			prev: U,
			f: 0,
			d: U,
			fv: U,
			cp: "",
			hd: "",
			fz: U,
			vc: U,
			u: U,
			t: U,
			path: /* @__PURE__ */ pathConcat(parent.path, [location]),
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
var unionOutput = (schema) => {
	let output = schema;
	while (output.type !== neverTag && output.to !== U) {
		if (output.parser === B_neverSlot) return never_;
		output = output.to;
	}
	return output;
};
var unionNeverLink = (schema) => {
	for (let node = schema; node !== U && node.type !== neverTag; node = node.to) if (node.parser === B_neverSlot) return true;
	return false;
};
var unionIsTransparent = (schema) => {
	if (schema.type !== anyOfTag) return false;
	let fields = 0;
	for (const _key in schema) fields++;
	return fields === 6;
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
var unionFail = (schema, path, input, ...unionErrors) => B_throw(B_makeInvalidInputDetails(schema, unknown, path, input, unionErrors.length ? unionErrors : U));
var unionEmitChain = (cases, ctx) => {
	if (cases.length === 1) {
		const c = cases[0];
		if (c.b === "" && c.c === "") return "";
		if (c.b === "") return `if(!(${c.c})){${ctx.f("")}}`;
		if (c.c === "") return c.b.endsWith(";") ? c.b : c.b + ";";
		return `if(${c.c}){${c.b}}else{${ctx.f("")}}`;
	}
	let code = "";
	let caught = false;
	let exhaustive = false;
	let open = false;
	const attempt = (c, idx) => {
		open = false;
		if (c.b === "") return "break";
		const body = c.b.endsWith(";") ? c.b : `${c.b};`;
		if (c.f & 1 && (c.f & 8 || caught)) {
			caught = open = true;
			return `try{${body}break}catch(x){${c.f & 4 ? `x=${ctx.r()}(x);if(x.expected===${ctx.s()}){x=x.unionErrors;x&&(r||(r=[])).push(...x)}else{(r||(r=[])).push(x)}` : `(r||(r=[])).push(${ctx.r()}(x))`}${!(c.f & 8) && unconditional > idx ? `;${ctx.f(",...(r||[])")}` : ""}}`;
		}
		return `${body}break`;
	};
	let unconditional = -1;
	for (let idx = 0; idx < cases.length; idx++) if (cases[idx].c === "") unconditional = idx;
	let last = "";
	for (let idx = 0; idx < cases.length; idx++) {
		const c = cases[idx];
		const shared = c.c !== "" && c.c === last;
		if (shared && !open) continue;
		const arm = attempt(c, idx);
		last = c.c;
		if (shared) code = `${code.slice(0, -1)}${arm}}`;
		else if (c.c === "") {
			code += open ? arm : `${arm};`;
			if (!open) {
				exhaustive = true;
				break;
			}
		} else code += arm === "break" ? `if(${c.c})break;` : `if(${c.c}){${arm}}`;
	}
	if (!exhaustive) code += ctx.f(caught ? ",...(r||[])" : "");
	return `for(;;){${caught ? "let r;" : ""}${code}}`;
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
	if (schema.content !== U) setContent(narrow, schema.content);
	if (tagFlag & 8192) narrow.class = schema.class;
	else if (tagFlag & container) {
		narrow.additionalItems = unknown;
		if (tagFlag & 64) narrow.properties = immutableEmptyObject;
		else narrow.items = immutableEmptyArray;
	} else if (tagFlag & 2096) narrow.const = schema.const;
	else if (tagFlag & 2 && schema.format !== U && schema.format !== "json") {
		narrow.format = schema.format;
		narrow.formatFlag = schema.formatFlag;
		narrow.noValidation = schema.noValidation;
	}
	return narrow;
};
var unionWiden = (tagFlag, nan2) => tagFlag | (tagFlag & 8256 ? 8256 : tagFlag & tagFlags[numberTag] ? nan2 : 0);
var unionRefDef = (schema) => {
	const defs = schema["$defs"], ref = schema["$ref"];
	if (defs === U || ref === U) return U;
	const resolved = defs[ref.slice(ref.lastIndexOf("/") + 1)];
	return resolved !== U && resolved !== schema ? resolved : U;
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
	return tagFlag & 769 ? -1 : unionWiden(tagFlag, nan2);
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
	for (let idx = 0; idx < variants.length; idx++) {
		const variant = variants[idx];
		const match = outputSide ? unionOutput(variant) : variant;
		if (variant.type === neverTag || (outputSide ? match.type === neverTag : unionNeverLink(variant))) continue;
		if (unionSameType(other, match)) matched || (matched = variant);
		else unmatched || (unmatched = variant);
	}
	if (matched !== U && unmatched !== U) unionInvalid(input, source, target, unmatched, outputSide);
};
var unionPeer = (schema) => schema.anyOf?.find((variant) => !(tagFlags[variant.type] & 32816)) || schema;
var unionInvalid = (input, source, target, member, onSource) => {
	const it = /* @__PURE__ */ inputExpression(member);
	const conversion = onSource ? `${it} -> ${/* @__PURE__ */ inputExpression(unionPeer(target))}` : `${/* @__PURE__ */ inputExpression(unionPeer(source))} -> ${it}`;
	return B_invalidOperation(input, `Ambiguous ${/* @__PURE__ */ inputExpression(source)} -> ${/* @__PURE__ */ inputExpression(target)}. Should ${it} be decoded or ignored? Choose with S.to for ${conversion}, or S.never -> ${it}`);
};
var unionAnalyze = (sourceMask, flags, sourceTag, variants, source, nan2) => {
	const out = [];
	const unknownSource = sourceTag & 1;
	const sourceBoundary = sourceTag & 768;
	const unionSource = sourceBoundary && sourceMask !== -1;
	const sourceDiscriminator = unionDiscriminator(source);
	const exact = flags & 1;
	const broadObject = flags & 64;
	const broadNumber = flags & tagFlags[numberTag];
	const numberish = tagFlags[numberTag] | 2048;
	for (let i = 0; i < variants.length; i++) {
		const s2 = variants[i];
		const tag = tagFlags[s2.type];
		const inputMask = unionMask(s2, 1, nan2);
		const d = unionDiscriminator(s2);
		const same = unionRuntimeSame(source, s2);
		const discriminatorDisjoint = sourceDiscriminator !== U && d !== U && same && sourceDiscriminator[0] === d[0] && !unionLiteralEqual(sourceDiscriminator[1], d[1]);
		const accepts = !(tag & 32768) && !unionNeverLink(s2) && !discriminatorDisjoint && (!exact || (isLiteral(s2) ? unionLiteralEqual(s2.const, source.const) : sourceMask & inputMask));
		const native = sourceMask & tag;
		const coerces = accepts && !unknownSource && !(unionSource ? native : same);
		const output = unionOutput(s2);
		const traits = unionTraits(s2);
		const sourceDeopt = sourceBoundary && (!unionSource || coerces);
		const effect = output.type === neverTag ? 3 : traits & 4 || sourceDeopt ? 4 : coerces || traits & 8 ? 2 : traits & 1 || tag & 9152 ? 1 : 0;
		out[i] = {
			i,
			s: s2,
			m: accepts ? unknownSource ? inputMask : unionSource ? native ? inputMask : s2.type === undefinedTag && sourceMask & 32 ? 32 : s2.type === nullTag && sourceMask & 16 ? 16 : sourceMask & 2 ? 2 : sourceMask : sourceMask : 0,
			o: !!accepts && output.type !== neverTag,
			e: effect,
			f: traits & 7 | (effect ? 1 : 0) | (sourceDeopt ? 4 : 0) | (!unknownSource && same || tag & 37633 ? 16 : 0),
			p: s2.type === objectTag && nestedLoc in s2.properties || broadObject && tag & 8320 || broadNumber && tag & 2048 ? 0 : d !== U ? 1 : 2,
			k: tag & 8192 ? s2.class : s2.format === "env" ? s2.format : s2.type,
			n: unionNarrowSchema(s2),
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
		if (!overlaps && semantic !== U && semantic !== false) {
			for (const value of values) if (semantic[1].has(value)) {
				overlaps = true;
				break;
			}
		}
		if (overlaps || laterMask && tagFlags[head.s.type] & 37633 && (head.s.to !== U || head.s.parser !== U)) group.f |= 10;
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
	let salvaged = "";
	let rethrow = "";
	let expected = "";
	const ctx = {
		f: (caught) => `${B_embed(input, unionFail.bind(U, expectedSchema, input.path))}(${input.v()}${salvaged}${caught})`,
		r: () => rethrow || (rethrow = B_embed(input, getOrRethrow)),
		s: () => expected || (expected = B_embed(input, expectedSchema))
	};
	const unionDTrusted = (member) => {
		const d = member.d;
		const tag = tagFlags[member.s.type];
		for (const group of plan) for (const m of group.a) {
			if (m === member) continue;
			if (m.d !== U ? m.d[0] === d[0] && unionLiteralEqual(m.d[1], d[1]) : m.m & tag) return false;
		}
		return true;
	};
	const compile2 = (member, source, target) => {
		const mark = input.g.t;
		const caseInput = B_scope(source);
		caseInput.u = true;
		caseInput.t = source.t;
		caseInput.io = false;
		caseInput.e = member.s;
		if (source.s === target.e) caseInput.s = member.n;
		const trustedD = trustedSelf && member.p === 1 && !(member.f & 8) && member.d[0] !== "" && unionDTrusted(member) ? member.d : U;
		if (trustedD !== U) caseInput.s = member.s;
		let caseOut;
		const options = input.g.o;
		input.g.o |= 4;
		try {
			caseOut = parse(caseInput);
		} catch (exn) {
			if (!self.perVariant) throw exn;
			salvaged += `,${B_embed(input, getOrRethrow(exn))}`;
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
		const async = caseOut.f & 1;
		output.f |= async;
		if (caseOut.t) {
			output.t = true;
			const itemVar = target.v();
			if (async || caseOut.i !== itemVar) {
				body += `${itemVar}=${async && awaitAsync ? "await " : ""}${caseOut.i}`;
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
			f: (body !== "" && input.g.t !== mark ? 1 : 0) | (async && awaitAsync ? 2 : 0) | member.f & 8
		};
	};
	const cases = [];
	for (let i = 0; i < plan.length; i++) {
		const group = plan[i];
		if (group.a.length === 1 && group.f & 16) {
			const c = compile2(group.a[0], input, input);
			if (c !== U) {
				c.f |= group.f & 8;
				cases.push(c);
				if (c.c === "" && c.b === "") break;
			}
			continue;
		}
		const mark = input.g.t;
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
			const c = compile2(group.a[j], narrow, narrowInput);
			if (c !== U) {
				inner.push(c);
				if (c.c === "" && c.b === "") break;
			}
		}
		if (!inner.length) continue;
		const cond = {
			c: "",
			h: []
		};
		let body;
		let grouped = false;
		if (inner.every((c) => c.b === "")) {
			if (!inner.some((c) => c.c === "")) {
				const fused = unionOr(inner);
				body = B_merge(B_refine(narrow, narrow.s, [{
					c: () => fused,
					f: failInvalidType
				}]), cond);
			} else body = B_merge(narrow, cond);
		} else {
			const narrowCode = B_merge(narrow, cond);
			const only = inner.length === 1 ? inner[0] : U;
			if (only !== U && narrowCode === "") {
				if (only.c !== "") cond.c = cond.c ? `${cond.c}&&${only.c}` : only.c;
				body = only.b;
			} else {
				if (inner.length > 1 && group.f & 32 && inner.every((c) => c.c)) {
					const fused = unionOr(inner);
					cond.c = cond.c ? `${cond.c}&&${fused}` : fused;
				}
				body = narrowCode + unionEmitChain(inner, ctx);
				grouped = inner.length > 1;
			}
		}
		cases.push({
			c: cond.c,
			b: body,
			f: (body !== "" && input.g.t !== mark ? 1 : 0) | (inner.some((c) => c.f & 2) ? 2 : 0) | group.f & 8 | (grouped ? 4 : 0)
		});
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
		const dispatch2 = unionEmitChain(cases, ctx);
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
	const trustedSelf = input.s === self || self.tr;
	if (initialTagFlag & 256 || input.s.encoder === U && initialTagFlag & 512) input.s = unknown;
	if (variants.every(unionNeverLink)) B_invalidOperation(input, `Nothing decodes ${/* @__PURE__ */ inputExpression(self)}. Every member is S.never`);
	const source = input.s;
	variants = unionDropNullish(unionDropNullish(variants, source, false), toPerCase, true);
	let expected = self;
	if (variants !== self.anyOf) {
		expected = copySchema(self);
		expected.anyOf = variants;
	}
	const nan2 = input.g.o & 2 ? 2048 : 0;
	let flags = 0;
	const sourceLiteral = isLiteral(source);
	for (let i = 0; i < variants.length; i++) {
		const member = variants[i];
		if (sourceLiteral && isLiteral(member) && unionLiteralEqual(member.const, source.const)) flags |= 1;
		flags |= tagFlags[member.type] & (64 | tagFlags[numberTag]);
	}
	const sourceTag = tagFlags[source.type];
	if (!(sourceTag & 1) && !(flags & 1)) unionCheckPartial(input, source, self, variants, false);
	if (toPerCase !== U) {
		const perCase = unionTargetOwns(toPerCase) ? variants.map((v) => unionOutput(v).type === neverTag ? U : toPerCase) : unionResolve(input, self, variants, toPerCase);
		const attach = self.refiner !== U || self.inputRefiner !== U ? unionRefinerAttacher(self) : U;
		variants = variants.map((variant, idx) => {
			const to2 = perCase[idx];
			return to2 === U && attach === U ? variant : updateOutput(variant, (mut) => {
				if (attach !== U) attach(mut);
				if (to2 !== U) mut.to = to2;
			});
		});
	}
	return unionEmit(input, self, expected, unionPlan(unionAnalyze(unionMask(source, 2, nan2), flags, sourceTag, variants, source, nan2)), toPerCase, trustedSelf);
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
	const anyOf = [];
	const has = {};
	for (let idx = 0; idx < variants.length; idx++) {
		const rewritten = map(variants[idx], idx);
		anyOf.push(rewritten);
		setHas(has, rewritten.type);
	}
	const mut = baseSchema(anyOfTag, false, unionDecoder);
	mut.anyOf = anyOf;
	mut.has = has;
	mut.encoder = unionEncoder;
	mut.perVariant = input.s.perVariant;
	mut.tr = true;
	return B_refine(input, unknown, U, mut);
};
var unionTargetOwns = (target) => target.noValidation === true || tagFlags[unionOutput(target).type] & 512 || target.type === anyOfTag && target.anyOf.some((v) => tagFlags[v.type] & 512);
var unionEncoder = (input, target) => {
	input.s;
	if (unionTargetOwns(target)) return input;
	const variants = unionDropNullish(input.s.anyOf, target, true);
	if (target.perVariant && target.anyOf.length === variants.length) {
		const targets = target.anyOf;
		return targets.every((tv, idx) => tv === variants[idx]) ? input : unionRewrite(input, variants, (_variant, idx) => targets[idx]);
	}
	const resolved = unionResolve(input, input.s, variants, target);
	if (resolved.every((to2) => to2 === U)) return input;
	return unionRewrite(input, variants, (variant, idx) => {
		const to2 = resolved[idx];
		return to2 === U ? variant : updateOutput(variant, (mut) => {
			mut.to = to2;
		});
	});
};
var unionOpposite = (schema) => schema.type === undefinedTag ? nullTag : schema.type === nullTag ? undefinedTag : U;
var unionResolve = (input, source, variants, target) => {
	if (source.perVariant) return variants.map(() => target);
	if (unionIsTransparent(target)) return unionResolveToUnion(input, source, variants, target);
	if (!(tagFlags[target.type] & 1) && !target.noValidation) unionCheckPartial(input, source, target, variants, true);
	return variants.map((variant) => unionOutput(variant).type === neverTag ? U : target);
};
var unionResolveToUnion = (input, source, variants, target) => {
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
		const sameTyped = targets.filter((targetVariant, t) => targetVariant.type !== neverTag && !unionNeverLink(targetVariant) && unionSameType(sourceOut, targetVariant) && (covered[t] = true));
		sourceNullish |= tagFlags[sourceOut.type] & 48;
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
		const sourceOut = unionOutput(variants[idx]);
		return matched === sourceOut || unionIsNoop(matched) && matched.refiner === U && matched.inputRefiner === U && matched.noValidation === U && (matched.const === U || unionLiteralEqual(matched.const, sourceOut.const)) && !(tagFlags[matched.type] & 9152) && unionSameType(matched, sourceOut) ? U : matched;
	});
};
var unionFactory = (schemas) => {
	if (!schemas.length) return panic("S.union requires at least one item");
	if (schemas.length === 1) return schemas[0];
	const has = {};
	const anyOf = [];
	for (let idx = 0; idx < schemas.length; idx++) {
		const schema = schemas[idx];
		const nested = unionIsTransparent(schema) ? schema.anyOf : [schema];
		for (let j = 0; j < nested.length; j++) {
			const member = nested[j];
			anyOf.push(member);
			setHas(has, member.type);
		}
	}
	const mut = baseSchema(anyOfTag, false, unionDecoder);
	mut.anyOf = anyOf;
	mut.encoder = unionEncoder;
	mut.has = has;
	return mut;
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
			if (opened) targetMut.opens = decode;
			mut.to = targetMut;
		} else mut.to = target;
		if (mut.content !== U && mut.opens === U) mut.opens = true;
		if (parser !== U) mut.parser = parser;
	});
};
var nullAsUnit = /* @__PURE__ */ copyTo(nullLiteral, unit);
var Option_getWithDefault = (schema, default_) => {
	return updateOutput(schema, (mut) => {
		const anyOf = mut.anyOf;
		if (anyOf === U) return panic(`Can't set default for ${/* @__PURE__ */ inputExpression(mut)}`);
		const outputItems = [];
		const originalItems = [];
		for (let idx = 0; idx < anyOf.length; idx++) {
			const variant = anyOf[idx];
			const outputSchema = getOutputSchema(variant);
			if (outputSchema.type !== undefinedTag) {
				if (!outputItems.includes(outputSchema)) outputItems.push(outputSchema);
				originalItems.push(variant);
			}
		}
		const item = outputItems.length === 0 ? panic(`Can't set default for ${/* @__PURE__ */ inputExpression(mut)}`) : outputItems.length === 1 ? outputItems[0] : unionFactory(outputItems);
		if (default_.type === "value") {
			const v = default_.value;
			try {
				(/* @__PURE__ */ getOp(0, 2, unknown, item))(v);
			} catch (exn) {
				const error = getOrRethrow(exn);
				panic(`Invalid default for ${/* @__PURE__ */ inputExpression(mut)}: ${error["message"]}`);
			}
			const originalItem = originalItems.length === 1 ? originalItems[0] : unionFactory(originalItems);
			try {
				mut.default = (/* @__PURE__ */ getOp(0, 1, /* @__PURE__ */ reverse(originalItem)))(v);
			} catch (_exn) {}
		}
		const decodeB = (input) => {
			const target = input.e.to;
			const output = B_next(input, default_.type === "value" ? B_inlineConst(input, Literal_parse(default_.value)) : `${B_embed(input, default_.callback)}()`, target, target);
			if (default_.type === "value") output.v = _var;
			return B_refine(output);
		};
		mut.anyOf = anyOf.map((variant) => getOutputSchema(variant).type === undefinedTag ? codecTo(variant, item, decodeB, B_neverSlot) : variant);
	});
};
var Option_getOr = /* @__NO_SIDE_EFFECTS__ */ (schema, defaultValue) => Option_getWithDefault(schema, {
	type: "value",
	value: defaultValue
});
var Option_getOrWith = /* @__NO_SIDE_EFFECTS__ */ (schema, defaultCb) => Option_getWithDefault(schema, {
	type: "callback",
	callback: defaultCb
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
	const written = schema.bounds ?? 0;
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
	if (schema.bounds === U && schema.multipleOf === U) {
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
	const written = s2.bounds ?? 0;
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
var updateBounds = (schema, update) => schema.bounds !== U || schema.multipleOf !== U ? updateOutput(schema, update) : internalRefine(schema, (mut) => {
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
		bounds: bit
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
		const written = schema.bounds ?? 0;
		return carryMessage(root, written & 4 ? "exclusiveMinimum" : written & 1 ? "minimum" : U, maybeMessage);
	}
	return updateBounds(root, (mut) => {
		setBoundExpression(mut, schema);
		mut.bounds = (schema.bounds ?? 0) & -5 | 1;
		mut.minimum = minValue;
		mut.exclusiveMinimum = U;
		setBoundMessage(mut, schema, "minimum", maybeMessage, "exclusiveMinimum");
	});
};
var lte = /* @__NO_SIDE_EFFECTS__ */ (root, maxValue, maybeMessage) => {
	const schema = assertNumericBound("lte", root, maxValue);
	assertUpper(schema, maxValue, false);
	if (!narrowsUpper(schema, maxValue, false)) {
		const written = schema.bounds ?? 0;
		return carryMessage(root, written & 8 ? "exclusiveMaximum" : written & 2 ? "maximum" : U, maybeMessage);
	}
	return updateBounds(root, (mut) => {
		setBoundExpression(mut, schema);
		mut.bounds = (schema.bounds ?? 0) & -9 | 2;
		mut.maximum = maxValue;
		mut.exclusiveMaximum = U;
		setBoundMessage(mut, schema, "maximum", maybeMessage, "exclusiveMaximum");
	});
};
var minLength = /* @__NO_SIDE_EFFECTS__ */ (root, length2, maybeMessage) => {
	const schema = assertLengthBound("minLength", root, length2);
	assertSize(schema, length2, false);
	const key = sizeKey(schema, false);
	if (!narrowsSize(schema[key], length2, false) && !(length2 === 0 && schema[key] === U)) return carryMessage(root, (schema.bounds ?? 0) & 1 ? key : U, maybeMessage);
	return updateBounds(root, (mut) => {
		setBoundExpression(mut, schema);
		mut.bounds = (schema.bounds ?? 0) | 1;
		mut[key] = length2;
		setBoundMessage(mut, schema, key, maybeMessage);
	});
};
var maxLength = /* @__NO_SIDE_EFFECTS__ */ (root, length2, maybeMessage) => {
	const schema = assertLengthBound("maxLength", root, length2);
	assertSize(schema, length2, true);
	const key = sizeKey(schema, true);
	if (!narrowsSize(schema[key], length2, true)) return carryMessage(root, (schema.bounds ?? 0) & 2 ? key : U, maybeMessage);
	return updateBounds(root, (mut) => {
		setBoundExpression(mut, schema);
		mut.bounds = (schema.bounds ?? 0) | 2;
		mut[key] = length2;
		setBoundMessage(mut, schema, key, maybeMessage);
	});
};
var nonEmpty = /* @__NO_SIDE_EFFECTS__ */ (schema, maybeMessage) => /* @__PURE__ */ minLength(schema, 1, maybeMessage);
var invalidDateRefine = (input) => {
	return B_refine(input, input.e, [{
		c: (inputVar) => `!Number.isNaN(${inputVar}.getTime())`,
		f: failInvalidType
	}]);
};
var dateTimeString = /* @__PURE__ */ initSchema(stringTag, stringDecoderFn, (s2) => {
	s2.format = "date-time";
	s2.formatFlag = 1;
});
var date = /* @__PURE__ */ initSchema(instanceTag, (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	if (inputTagFlag & 2) return invalidDateRefine(B_next(input, `new Date(${input.i})`, date));
	else if (inputTagFlag & 1) return invalidDateRefine(instanceDecoder(input));
	else if (inputTagFlag & 8192 && input.s.class === date.class) return input;
	else return B_unsupportedDecode(input, input.s, input.e);
}, (s2) => {
	s2.class = Date;
	s2.encoder = (input, target) => {
		if (tagFlags[target.type] & 2) {
			if (input.s.noValidation) return parse(B_refine(B_next(input, `${input.i}.toISOString()`, dateTimeString, target)));
			const output = B_nextVar(input, dateTimeString, target);
			output.cp = `let ${output.i};try{${output.i}=${input.v()}.toISOString()}catch(_){${B_embedInvalidInput(input, input.s)}}`;
			return parse(B_refine(output));
		} else return input;
	};
});
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
				validateOp = /* @__PURE__ */ getOp(1537, 2, unknown, schema);
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
var nullable2 = /* @__NO_SIDE_EFFECTS__ */ (definition, maybeOr) => {
	const schema = /* @__PURE__ */ definitionToSchema(definition);
	if (maybeOr !== U) {
		const schema2 = unionFactory([schema, nullAsUnit]);
		if (typeof maybeOr === functionTag) return /* @__PURE__ */ Option_getOrWith(schema2, maybeOr);
		else return /* @__PURE__ */ Option_getOr(schema2, maybeOr);
	} else return unionFactory([schema, nullLiteral]);
};
string.with(nonEmpty).with(maxLength, 100);
float.with(gte, 1).with(lte, 5), string.with(nonEmpty).with(maxLength, 100), string.with(nonEmpty).with(maxLength, 1e3);
string.with(nonEmpty).with(maxLength, 100), string.with(nonEmpty).with(maxLength, 30), string.with(nonEmpty).with(maxLength, 500), float.with(gte, 1).with(lte, 1e4), float.with(gte, 1).with(lte, 100).with(nullable2), float.with(gte, 0).with(lte, 10), string.with(nonEmpty).with(maxLength, 30);
//#endregion
