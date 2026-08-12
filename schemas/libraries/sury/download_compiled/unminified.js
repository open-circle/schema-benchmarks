//#region ../node_modules/.pnpm/sury@11.0.0-rc.1/node_modules/sury/index.mjs
var flagNone = 0;
var flagAsync = 1;
var flagDisableNanNumberValidation = 2;
var flagUnionTransformContext = 4;
var flagUnsafeHas = (acc, flag) => {
	return (acc & flag) !== 0;
};
var valFlagNone = 0;
var valFlagAsync = 1;
var pathEmpty = "";
var pathDynamic = "[]";
var inlineUnsafeRe = /["\\\n\r]/;
var inlinedValueFromString = (str) => {
	return inlineUnsafeRe.test(str) ? JSON.stringify(str) : `"${str}"`;
};
var pathFromInlinedLocation = (inlinedLocation) => {
	return `[${inlinedLocation}]`;
};
var pathToArray = /* @__NO_SIDE_EFFECTS__ */ (path) => {
	return path === "" ? [] : JSON.parse(path.split(`"]["`).join(`","`));
};
var pathConcat = /* @__NO_SIDE_EFFECTS__ */ (path, concatedPath) => {
	return path + concatedPath;
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
var tagFlagUnknown = 1;
var tagFlagString = 2;
var tagFlagNumber = 4;
var tagFlagBoolean = 8;
var tagFlagUndefined = 16;
var tagFlagNull = 32;
var tagFlagObject = 64;
var tagFlagArray = 128;
var tagFlagUnion = 256;
var tagFlagRef = 512;
var tagFlagBigint = 1024;
var tagFlagNaN = 2048;
var tagFlagFunction = 4096;
var tagFlagInstance = 8192;
var tagFlagSymbol = 16384;
var tagFlagNever = 32768;
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
var isSchemaObject = (obj) => {
	return typeof obj === objectTag && obj !== null && "~standard" in obj;
};
var constField = "const";
var isLiteral = (schema) => {
	return constField in schema;
};
var isOptional = (schema) => {
	return schema.type === undefinedTag || schema.type === anyOfTag && undefinedTag in schema.has;
};
var namedConstructor = (unknown2) => {
	const ctor = Object.getPrototypeOf(unknown2)?.constructor;
	return ctor !== Object && ctor?.name;
};
var stringifyLeaf = (unknown2) => {
	const tagFlag = tagFlags[typeof unknown2];
	if (flagUnsafeHas(tagFlag, tagFlagUndefined)) return undefinedTag;
	else if (flagUnsafeHas(tagFlag, tagFlagObject | tagFlagFunction)) return unknown2 === null ? nullTag : Array.isArray(unknown2) ? `Array(${unknown2.length})` : namedConstructor(unknown2) || objectTag;
	else if (flagUnsafeHas(tagFlag, tagFlagString)) return `"${unknown2}"`;
	else if (flagUnsafeHas(tagFlag, tagFlagBigint)) return `${unknown2}n`;
	else return unknown2.toString();
};
var stringify = (unknown2) => {
	if (unknown2 !== null && typeof unknown2 === objectTag) {
		if (Array.isArray(unknown2)) {
			const items = unknown2;
			let body = "";
			for (let idx = 0; idx < items.length; idx++) {
				if (idx === 5) {
					body = body + ", ...";
					break;
				}
				body = body + (idx ? ", " : "") + stringifyLeaf(items[idx]);
			}
			return `[${body}]`;
		}
		if (!namedConstructor(unknown2)) {
			const dict2 = unknown2;
			let body = "";
			let count = 0;
			for (const key in dict2) {
				if (count++ === 5) {
					body = body + "... ";
					break;
				}
				body = body + key + ": " + stringifyLeaf(dict2[key]) + "; ";
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
				body = body + (body ? " | " : "") + expression;
			}
		}
		return body;
	} else if (schema.type === objectTag) {
		const properties = schema.properties;
		const additionalItems = schema.additionalItems;
		let body = "";
		for (const location in properties) body = body + location + ": " + /* @__PURE__ */ inputExpression(properties[location]) + "; ";
		if (typeof additionalItems === objectTag) body = body + "[key: string]: " + /* @__PURE__ */ inputExpression(additionalItems) + "; ";
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
		for (let idx = 0; idx < items.length; idx++) body = body + (idx ? ", " : "") + /* @__PURE__ */ inputExpression(items[idx]);
		return `[${body}]`;
	} else if (schema.format) return schema.format;
	else if (schema.type === instanceTag) return schema.class.name;
	else return schema.type;
};
function Schema() {}
var schemaPrototype = /* @__PURE__ */ Object.create(null);
Object.defineProperty(schemaPrototype, "with", { value(fn, ...args) {
	return fn(this, ...args);
} });
Schema.prototype = schemaPrototype;
var reversedKey = "r";
function SelfReverseSchema() {}
var selfReversePrototype = Object.create(schemaPrototype);
Object.defineProperty(selfReversePrototype, reversedKey, { get: function() {
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
	else throw exn;
};
var panic = (message) => {
	throw new Error(`[Sury] ${message}`);
};
var formatErrorMessage = (error) => {
	return `${error.path === "" ? "" : `Failed at ${error.path}: `}${error.reason}`;
};
var globalConfig = {
	m: formatErrorMessage,
	d: U,
	a: "strip",
	f: valFlagNone
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
var noopDecoder = (input) => {
	return input;
};
var initSchema = /* @__NO_SIDE_EFFECTS__ */ (tag, decoder, init) => {
	const schema = baseSchema(tag, true, decoder);
	init?.(schema);
	return schema;
};
var unknown = baseSchema(unknownTag, true, noopDecoder);
var copySchema = (schema) => {
	const c = Object.assign(new Schema(), schema);
	c.seq = seq++;
	return c;
};
var updateOutput = (schema, fn) => {
	const root = copySchema(schema);
	let mut = root;
	while (mut.to !== U) {
		const next = copySchema(mut.to);
		mut.to = next;
		mut = next;
	}
	fn(mut);
	return root;
};
var setHas = (has, tag) => {
	has[flagUnsafeHas(tagFlags[tag], tagFlagUnion | tagFlagRef) ? unknownTag : tag] = true;
};
var jsonName = `JSON`;
function _var() {
	return this.i;
}
function _bondVar() {
	return this.b.v();
}
function _prevVar() {
	return this.prev.v();
}
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
	} else {
		const v = B_varWithoutAllocation(val.g);
		B_hoistDecl(parent, `${v}=${val.i}`);
		val.v = _var;
		val.i = v;
		return v;
	}
}
function _notVar() {
	const val = this;
	if (val.fz) {
		val.v = _var;
		val.i = `(${val.i})`;
		return val.i;
	} else {
		const v = B_varWithoutAllocation(val.g);
		if (val.prev !== U) {
			if (val.i === "") val.cp = `let ${v};` + val.cp;
			else val.cp = val.cp + `let ${v}=${val.i};`;
		} else if (val.i === "") B_hoistDecl(val, v);
		else B_hoistDecl(val, `${v}=${val.i}`);
		val.v = _var;
		val.i = v;
		return v;
	}
}
var operationArgVar = "i";
var failInvalidType = (input) => {
	const expected = input.e;
	const em = expected.errorMessage;
	return B_invalidInputBuilder(U, U, em !== U ? expected.format !== U && em.format !== U ? em.format : em.type !== U ? em.type : em._ : U)(input);
};
var B_embed = (b, value) => {
	b.g.t++;
	return B_embedPure(b, value);
};
var B_embedPure = (b, value) => {
	const e = b.g.e;
	const l = e.length;
	e[l] = value;
	return `e[${l}]`;
};
var B_inlineConst = (b, schema) => {
	const tagFlag = tagFlags[schema.type];
	const const_ = schema.const;
	if (flagUnsafeHas(tagFlag, tagFlagUndefined)) return "void 0";
	else if (flagUnsafeHas(tagFlag, tagFlagString)) return inlinedValueFromString(const_);
	else if (flagUnsafeHas(tagFlag, tagFlagBigint)) return const_ + "n";
	else if (flagUnsafeHas(tagFlag, tagFlagSymbol | tagFlagFunction | tagFlagInstance)) return B_embed(b, schema.const);
	else return const_;
};
var B_varWithoutAllocation = (global2) => {
	const newCounter = global2.v + 1;
	global2.v = newCounter;
	return `v${newCounter}`;
};
var B_hoistDecl = (owner, decl) => {
	owner.hd = owner.hd === "" ? decl : owner.hd + "," + decl;
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
		f: valFlagNone,
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
var B_unsupportedDecode = (b, from, target) => {
	return B_throw({
		code: "unsupported_decode",
		from,
		to: target,
		reason: `Can't decode ${/* @__PURE__ */ inputExpression(from)} to ${/* @__PURE__ */ inputExpression(target)}. Use S.to to define a custom decoder`,
		path: b.path
	});
};
var B_failWithArg = (b, fn, arg) => {
	return `${B_embed(b, (arg2) => {
		B_throw(fn(arg2));
	})}(${arg})`;
};
var B_markThrow = (b) => {
	b.g.t++;
};
var B_receivedSchema = (val) => {
	return val.prev !== U ? val.prev.s : val.s;
};
var B_makeInvalidInputDetails = (expected, received, path, input, unionErrors, reasonOverride) => {
	let reasonRef;
	if (reasonOverride !== U) reasonRef = reasonOverride;
	else {
		const expectedExpression = /* @__PURE__ */ inputExpression(expected);
		const receivedExpression = stringify(input);
		reasonRef = `Expected ${expectedExpression}, received ${expectedExpression === receivedExpression ? "invalid " : ""}${receivedExpression}`;
	}
	if (unionErrors !== U) {
		const caseErrors = unionErrors;
		const seenReasons = /* @__PURE__ */ new Set();
		for (let idx = 0; idx < caseErrors.length; idx++) {
			const caseError = caseErrors[idx];
			const caseReason = caseError.reason.split("\n").join("\n  ");
			const line = `
- ${caseError.path === "" ? "" : `At ${caseError.path}: `}${caseReason}`;
			if (!seenReasons.has(line)) {
				seenReasons.add(line);
				reasonRef = reasonRef + line;
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
var B_invalidInputBuilder = (expected, extraPath = pathEmpty, reasonOverride) => {
	return (input) => {
		const expected_ = expected !== U ? expected : input.e;
		const received = B_receivedSchema(input);
		const path = extraPath === pathEmpty ? input.path : /* @__PURE__ */ pathConcat(input.path, extraPath);
		return (value) => B_makeInvalidInputDetails(expected_, received, path, value, U, reasonOverride);
	};
};
var B_failWithErrorMessage = (key, defaultMessage) => {
	return (input) => {
		const em = input.e.errorMessage;
		const override = em !== U ? em[key] !== U ? em[key] : em["_"] : U;
		const m = override !== U ? override : defaultMessage;
		if (m !== U) return B_invalidInputBuilder(U, U, m)(input);
		else return failInvalidType(input);
	};
};
var B_embedInvalidInput = (input, expected = input.e) => {
	return B_failWithArg(input, B_invalidInputBuilder(expected)(input), input.v());
};
var B_emitChecks = (val, inputVar) => {
	const checks = val.vc;
	const len = checks.length;
	if (len === 1) {
		const check = checks[0];
		return `${check.c(inputVar)}||${B_failWithArg(val, check.f(val), inputVar)};`;
	} else {
		let out = "";
		let i = 0;
		while (i < len) {
			const head = checks[i];
			const fail = head.f;
			let cond = head.c(inputVar);
			i = i + 1;
			while (i < len && checks[i].f === fail) {
				cond = cond + "&&" + checks[i].c(inputVar);
				i = i + 1;
			}
			out = out + `${cond}||${B_failWithArg(val, fail(val), inputVar)};`;
		}
		return out;
	}
};
var B_isHoistable = (val) => {
	return val.t === true ? val.prev.t !== true && val.cp === "" : true;
};
var B_merge = (val, out) => {
	let current = val;
	let code = "";
	while (current !== U) {
		const val2 = current;
		current = val2.prev;
		let currentCode = "";
		if (val2.vc) {
			if (out !== U && B_isHoistable(val2)) {
				const inputVar = current.v();
				const checks = val2.vc;
				let hoisted = "";
				for (let i = 0; i < checks.length; i++) {
					const check = checks[i];
					const condCode = check.c(inputVar);
					if (check.f === failInvalidType) hoisted = hoisted ? `${hoisted}&&${condCode}` : condCode;
					else if (val2.e.noValidation !== true) currentCode = currentCode + `${condCode}||${B_failWithArg(val2, check.f(val2), inputVar)};`;
				}
				if (hoisted) {
					out.c = out.c ? `${hoisted}&&${out.c}` : hoisted;
					out.h.unshift({
						v: val2,
						i: inputVar,
						c: hoisted
					});
				}
			} else if (val2.e.noValidation !== true) currentCode = B_emitChecks(val2, current.v());
		}
		if (val2.hd !== "") currentCode = currentCode + `let ${val2.hd};`;
		val2.fz = true;
		currentCode = val2.cp + currentCode;
		code = currentCode + code;
	}
	return code;
};
var B_linkVar = (val, nextVal) => {
	const valVar = val.v.bind(val);
	val.v = () => {
		const v = valVar();
		nextVal.i = v;
		nextVal.v = _var;
		return v;
	};
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
		f: valFlagNone,
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
		v: shouldLink ? _prevVar : _var,
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
	if (val.vc !== U) val.vc.push(check);
	else val.vc = [check];
};
var B_markOutput = (val, valInput) => {
	let deferredInputChecks;
	const inputRefiner = valInput.e.inputRefiner;
	if (inputRefiner !== U) {
		const checks = inputRefiner(valInput);
		if (checks.length > 0) {
			if (valInput.prev !== U) {
				for (let i = 0; i < checks.length; i++) B_pushCheck(valInput, checks[i]);
				deferredInputChecks = U;
			} else deferredInputChecks = checks;
		} else deferredInputChecks = U;
	} else deferredInputChecks = U;
	let outputChecks;
	const refiner = val.e.refiner;
	if (refiner !== U) {
		const checks = refiner(val);
		outputChecks = checks.length > 0 ? checks : U;
	} else outputChecks = U;
	let result;
	if (deferredInputChecks !== U && outputChecks !== U) result = B_refine(val, U, deferredInputChecks.concat(outputChecks));
	else if (deferredInputChecks !== U) result = B_refine(val, U, deferredInputChecks);
	else if (outputChecks !== U) result = B_refine(val, U, outputChecks);
	else result = val;
	result.io = true;
	return result;
};
var B_hoistChildChecks = (parent, child, key) => {
	if (child.vc) {
		const pathAppend = pathFromInlinedLocation(inlinedValueFromString(key));
		child.vc.forEach((check) => {
			B_pushCheck(parent, {
				c: (inputVar) => check.c(inputVar + pathAppend),
				f: check.f
			});
		});
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
var B_nextConst = (from, schema, expected) => {
	return B_next(from, B_inlineConst(from, schema), schema, expected);
};
var B_asyncVal = (from, initial) => {
	const v = B_next(from, initial, from.s);
	v.f = valFlagAsync;
	return v;
};
var B_addObjectField = (objectVal, location, val) => {
	if (objectVal.s.type === arrayTag) objectVal.s.items.push(val.s);
	else {
		if (!val.o) objectVal.s.required.push(location);
		objectVal.s.properties[location] = val.s;
	}
	if (flagUnsafeHas(val.f, valFlagAsync)) val.v();
	objectVal.cp = objectVal.cp + B_merge(val);
	objectVal.d[location] = val;
};
var B_addKey = (objVal, key, value) => {
	return `${objVal.v()}[${key}]=${value.i}`;
};
var B_scope = (val) => {
	const shouldLink = val.v !== _var;
	const nextVal = {
		b: val,
		p: U,
		v: shouldLink ? _bondVar : _var,
		i: val.i,
		s: val.s,
		io: val.io,
		e: val.e,
		prev: U,
		f: flagNone,
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
var B_invalidOperation = (val, description) => {
	return B_throw({
		code: "invalid_operation",
		reason: description,
		path: val.path
	});
};
var B_mergeWithCatch = (val, catchFn, appendSafe, pureSince) => {
	const valCode = B_merge(val);
	const pure = pureSince !== U && val.g.t === pureSince;
	if ((valCode === "" || pure) && !flagUnsafeHas(val.f, valFlagAsync)) return appendSafe !== U ? valCode + appendSafe() : pure ? "" : valCode;
	else {
		const errorVar = B_varWithoutAllocation(val.g);
		B_markThrow(val);
		const catchCode = `${catchFn(errorVar)};throw ${errorVar}`;
		if (flagUnsafeHas(val.f, valFlagAsync)) val.i = `${val.i}.catch(${errorVar}=>{${catchCode}})`;
		return `try{${valCode}${appendSafe !== U ? appendSafe() : ""}}catch(${errorVar}){${catchCode}}`;
	}
};
var B_mergeWithPathPrepend = (val, parent, locationVar, appendSafe, pureSince) => {
	if (val.path === pathEmpty && locationVar === U) return B_merge(val);
	else return B_mergeWithCatch(val, (errorVar) => `${errorVar}.path=${parent.path === "" ? "" : `${inlinedValueFromString(parent.path)}+`}${locationVar !== U ? `'["'+${locationVar}+'"]'+` : ""}${errorVar}.path`, appendSafe, pureSince);
};
function noopOperation(i) {
	return i;
}
noopOperation["embedded"] = immutableEmptyArray;
var int32FormatValidation = (inputVar) => {
	return `${inputVar}<=2147483647&&${inputVar}>=-2147483648&&${inputVar}%1===0`;
};
var integerFormatValidation = (inputVar) => {
	return `${inputVar}%1===0`;
};
var typeofCondCache = {};
var typeofCond = (tag) => typeofCondCache[tag] || (typeofCondCache[tag] = (inputVar) => `typeof ${inputVar}==="${tag}"`);
var nanCond = (inputVar) => `Number.isNaN(${inputVar})`;
var isArrayCond = (inputVar) => `Array.isArray(${inputVar})`;
var objectTagCond = (inputVar) => `${typeofCond(objectTag)(inputVar)}&&${inputVar}`;
var instanceofCond = (b, class_) => (inputVar) => `${inputVar} instanceof ${B_embed(b, class_)}`;
var typeofCheckCache = {};
var typeofCheck = (tag) => typeofCheckCache[tag] || (typeofCheckCache[tag] = {
	c: typeofCond(tag),
	f: failInvalidType
});
var notNanCheck = {
	c: (inputVar) => `!${nanCond(inputVar)}`,
	f: failInvalidType
};
var int32Check = {
	c: int32FormatValidation,
	f: failInvalidType
};
var integerCheck = {
	c: integerFormatValidation,
	f: failInvalidType
};
var int32RangeCheck = {
	c: (inputVar) => `${inputVar}<=2147483647&&${inputVar}>=-2147483648`,
	f: failInvalidType
};
var nanCheck = {
	c: nanCond,
	f: failInvalidType
};
var B_refineTypeofUnknown = (input, tag) => {
	return B_refine(input, input.e, [typeofCheck(tag)]);
};
var B_nextVar = (input, expected) => {
	const output = B_next(input, B_varWithoutAllocation(input.g), expected);
	output.v = _var;
	return output;
};
var numberDecoder = (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	const expectedFormat = input.e.format;
	if (flagUnsafeHas(inputTagFlag, tagFlagUnknown)) {
		const checks = [typeofCheck(numberTag)];
		if (expectedFormat === "int32") checks.push(int32Check);
		else if (expectedFormat === "integer") checks.push(integerCheck);
		else if (!flagUnsafeHas(input.g.o, flagDisableNanNumberValidation)) checks.push(notNanCheck);
		return B_refine(input, input.e, checks);
	} else if (flagUnsafeHas(inputTagFlag, tagFlagString)) {
		const output = B_nextVar(input, input.e);
		output.cp = `let ${output.i}=+${input.v()};`;
		output.vc = [{
			c: (_inputVar) => expectedFormat === "int32" ? int32FormatValidation(output.i) : expectedFormat === "integer" ? integerFormatValidation(output.i) : `!${nanCond(output.i)}`,
			f: failInvalidType
		}];
		return output;
	} else if (flagUnsafeHas(inputTagFlag, tagFlagNaN) && expectedFormat !== "int32" && expectedFormat !== "integer" && flagUnsafeHas(input.g.o, flagDisableNanNumberValidation)) return B_refine(input, input.e);
	else if (!flagUnsafeHas(inputTagFlag, tagFlagNumber)) return B_unsupportedDecode(input, input.s, input.e);
	else if (input.s.format !== expectedFormat && expectedFormat === "int32") return B_refine(input, input.e, [input.s.format === U ? int32Check : int32RangeCheck]);
	else if (expectedFormat === "integer" && input.s.format === U) return B_refine(input, input.e, [integerCheck]);
	else return input;
};
var float = /* @__PURE__ */ initSchema(numberTag, numberDecoder);
var inputToString = (input) => {
	return B_next(input, `""+${input.i}`, string);
};
var stringDecoderFn = (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	if (flagUnsafeHas(inputTagFlag, tagFlagUnknown)) return B_refineTypeofUnknown(input, stringTag);
	else if (flagUnsafeHas(inputTagFlag, tagFlagBoolean | tagFlagNumber | tagFlagBigint | tagFlagUndefined | tagFlagNull | tagFlagNaN) && isLiteral(input.s)) {
		const const_ = "" + input.s.const;
		const schema = baseSchema(stringTag, false, input.s.decoder);
		schema.const = const_;
		return B_next(input, `"${const_}"`, schema);
	} else if (flagUnsafeHas(inputTagFlag, tagFlagBoolean | tagFlagNumber | tagFlagBigint)) return inputToString(input);
	else if (!flagUnsafeHas(inputTagFlag, tagFlagString)) return B_unsupportedDecode(input, input.s, input.e);
	else return input;
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
		if (flagUnsafeHas(tagFlags[input.s.type], tagFlagString) && flagUnsafeHas(schemaTagFlag, tagFlagBoolean | tagFlagNumber | tagFlagBigint | tagFlagUndefined | tagFlagNull | tagFlagNaN)) {
			const stringConstSchema = baseSchema(stringTag, false, literalDecoder);
			stringConstSchema.const = "" + expectedSchema.const;
			const stringConstVal = B_nextConst(input, stringConstSchema, stringConstSchema);
			stringConstVal.vc = [{
				c: (inputVar) => `${inputVar}==="${stringConstSchema.const}"`,
				f: failInvalidType
			}];
			return B_nextConst(stringConstVal, expectedSchema, expectedSchema);
		} else if (flagUnsafeHas(schemaTagFlag, tagFlagNaN)) return B_refine(input, expectedSchema, [nanCheck]);
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
		loopCount = loopCount + 1;
		if (loopCount > 50) throw /* @__PURE__ */ new Error("Loop count exceeded 50");
		if (loopInput.e["$defs"]) {
			if (loopInput.g.d) Object.assign(loopInput.g.d, loopInput.e["$defs"]);
			else loopInput.g.d = loopInput.e["$defs"];
		}
		if (flagUnsafeHas(loopInput.f, valFlagAsync)) {
			const operationInputVar = loopInput.v();
			const operationInput = B_scope(loopInput);
			const operationOutput = parse(operationInput);
			const operationCode = B_merge(operationOutput);
			if (operationInput.i !== operationOutput.i || operationCode !== "") result = B_next(loopInput, `${operationInputVar}.then(${operationInputVar}=>{${operationCode}return ${operationOutput.i}})`, operationOutput.s, operationOutput.e);
			else result = B_refine(loopInput, operationOutput.s, U, operationOutput.e);
			result.f |= valFlagAsync;
			result.io = true;
		} else if (loopInput.io) {
			const to2 = loopInput.e.to;
			if (loopInput.e.parser !== U) result = loopInput.e.parser(loopInput);
			else result = B_refine(result, U, U, to2);
		} else {
			const maybeEncoder = loopInput.s.encoder;
			if (maybeEncoder && maybeEncoder !== appliedEncoder && loopInput.s !== loopInput.e && loopInput.e.type !== unknownTag && !loopInput.e.noValidation) result = maybeEncoder(loopInput, loopInput.e);
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
		error.path = /* @__PURE__ */ pathConcat(input.p !== U ? input.p.path : pathEmpty, /* @__PURE__ */ pathConcat(/* @__PURE__ */ pathConcat(input.path, pathDynamic), error.path));
		throw error;
	}
};
var compileDecoder = (schema, expected, flag, defs) => {
	const input = B_operationArg(isLiteral(schema) ? unknown : schema, expected, flag, defs);
	const output = parse(input);
	const code = B_merge(output);
	const isAsync2 = flagUnsafeHas(output.f, valFlagAsync);
	expected.isAsync = isAsync2;
	expected.hasTransform = output.t === true;
	if (code === "" && (output === input || output.i === input.i) && !flagUnsafeHas(flag, flagAsync)) return noopOperation;
	else {
		let inlinedOutput = output.i;
		if (flagUnsafeHas(flag, flagAsync) && !isAsync2 && !defs) inlinedOutput = `Promise.resolve(${inlinedOutput})`;
		const inlinedFunction = `${operationArgVar}=>{${code}return ${inlinedOutput}}`;
		const fn = new Function("e", "s", `return ${inlinedFunction}`)(input.g.e, s);
		fn.embedded = input.g.e;
		return fn;
	}
};
var getOutputSchema = (schema) => {
	if (schema.to !== U) return getOutputSchema(schema.to);
	else return schema;
};
var reverseSwap = (mut, a, b) => {
	const previous = mut[a];
	if (mut[b] !== U) mut[a] = mut[b];
	else delete mut[a];
	if (previous !== U) mut[b] = previous;
	else delete mut[b];
};
var reverseDict = (dict2) => {
	const reversed = /* @__PURE__ */ Object.create(null);
	for (const key in dict2) reversed[key] = /* @__PURE__ */ reverse(dict2[key]);
	return reversed;
};
Object.defineProperty(schemaPrototype, reversedKey, { get: function() {
	const schema = this;
	let reversedHead = U;
	let current = schema;
	while (current) {
		const mut = copySchema(current);
		const next = mut.to;
		if (reversedHead === U) delete mut.to;
		else mut.to = reversedHead;
		const record = mut;
		reverseSwap(record, "parser", "serializer");
		reverseSwap(record, "refiner", "inputRefiner");
		reverseSwap(record, "fromDefault", "default");
		if (mut.items !== U) mut.items = mut.items.map(reverse);
		if (mut.properties !== U) mut.properties = reverseDict(mut.properties);
		if (typeof mut.additionalItems === objectTag) mut.additionalItems = /* @__PURE__ */ reverse(mut.additionalItems);
		if (mut.anyOf !== U) {
			const anyOf = mut.anyOf;
			const has = {};
			const newAnyOf = [];
			for (let idx = 0; idx <= anyOf.length - 1; idx++) {
				const s2 = anyOf[idx];
				const reversed = /* @__PURE__ */ reverse(s2);
				newAnyOf.push(reversed);
				setHas(has, reversed.type);
			}
			mut.has = has;
			mut.anyOf = newAnyOf;
		}
		if (mut["$defs"] !== U) mut["$defs"] = reverseDict(mut["$defs"]);
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
// @__NO_SIDE_EFFECTS__
function getDecoder(..._args) {
	const args = arguments;
	let idx = 0;
	let flag = U;
	let maxSeq = 0;
	let cacheTarget = U;
	while (flag === U) {
		const arg = args[idx];
		if (!arg) flag = globalConfig.f;
		else if (typeof arg === numberTag) flag = arg | globalConfig.f;
		else {
			const schema = arg;
			const seq2 = schema.seq;
			if (seq2 > maxSeq) {
				maxSeq = seq2;
				cacheTarget = schema;
			}
			idx = idx + 1;
		}
	}
	if (cacheTarget === U) return panic("No schema provided for decoder.");
	else {
		let node = cacheTarget[memoKey];
		while (node !== U) {
			const a = node.a;
			if (node.f === flag && a.length === idx) {
				let i = idx;
				while (i-- !== 0 && a[i] === args[i]);
				if (i < 0) return node.v;
			}
			node = node.n;
		}
		let schema = args[idx - 1];
		for (let i = idx - 2; i >= 0; i--) {
			const to2 = schema;
			schema = updateOutput(args[i], (mut) => {
				mut.to = to2;
			});
		}
		const f = compileDecoder(schema, schema, flag, U);
		addOpNode(cacheTarget, immutableEmptyArray.slice.call(args, 0, idx), flag, f);
		return f;
	}
}
var nestedLoc = "BS_PRIVATE_NESTED_SOME_NONE";
var neverBuilderFn = (input) => {
	const output = B_refine(input, never_, U, never_);
	output.cp = B_embedInvalidInput(input) + ";";
	return output;
};
var never_ = /* @__PURE__ */ initSchema(neverTag, neverBuilderFn);
var nestedOptionParser = (input) => {
	const nextSchema = input.e.to;
	return B_next(input, `{${nestedLoc}:${getOutputSchema(input.e).properties[nestedLoc].const}}`, nextSchema, nextSchema);
};
var instanceDecoder = (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	if (flagUnsafeHas(inputTagFlag, tagFlagUnknown)) return B_refine(input, input.e, [{
		c: instanceofCond(input, input.e.class),
		f: failInvalidType
	}]);
	else if (flagUnsafeHas(inputTagFlag, tagFlagInstance) && input.s.class === input.e.class) return input;
	else return B_unsupportedDecode(input, input.s, input.e);
};
var typeCheckCond = (input, schema, inputVar) => {
	const tagFlag = tagFlags[schema.type];
	if (flagUnsafeHas(tagFlag, tagFlagObject)) return `${objectTagCond(inputVar)}&&!${isArrayCond(inputVar)}`;
	else if (flagUnsafeHas(tagFlag, tagFlagArray)) return isArrayCond(inputVar);
	else if (flagUnsafeHas(tagFlag, tagFlagInstance)) return instanceofCond(input, schema.class)(inputVar);
	else if (flagUnsafeHas(tagFlag, tagFlagNumber)) {
		const typeofCheck2 = typeofCond(numberTag)(inputVar);
		if (flagUnsafeHas(input.g.o, flagDisableNanNumberValidation)) return typeofCheck2;
		else return `${typeofCheck2}&&!${nanCond(inputVar)}`;
	} else if (flagUnsafeHas(tagFlag, tagFlagNaN)) return nanCond(inputVar);
	else if (flagUnsafeHas(tagFlag, tagFlagUndefined | tagFlagNull)) return `${inputVar}===${B_inlineConst(input, schema)}`;
	else if (flagUnsafeHas(tagFlag, tagFlagString | tagFlagBoolean | tagFlagBigint | tagFlagSymbol)) return typeofCond(schema.type)(inputVar);
	else return "";
};
var unionAnyTag = -1;
var unionBoundaryTags = tagFlagUnion | tagFlagRef | tagFlagFunction;
var unionOpaqueTags = tagFlagUnknown | unionBoundaryTags | tagFlagNever;
var unionRuntimeSame = (a, b) => a.type === b.type && a.class === b.class;
var unionSameType = (a, b) => a === b || unionRuntimeSame(a, b) && !(tagFlags[a.type] & (tagFlagRef | tagFlagUnion)) && a.format === b.format;
var unionLiteralEqual = (a, b) => a === b || a !== a && b !== b;
var unionOutput = (schema) => {
	let output = schema;
	while (output.type !== neverTag && output.to !== U) output = output.to;
	return output;
};
var unionIsTransparent = (schema) => {
	if (schema.type !== anyOfTag) return false;
	let fields = 0;
	for (const key in schema) if (key !== "isAsync" && key !== "hasTransform") fields++;
	return fields === 6;
};
var unionTraits = (schema) => {
	const tag = tagFlags[schema.type];
	let traits = 0;
	if (tag & unionBoundaryTags || schema.parser !== U) return 15;
	if (schema.refiner !== U || schema.inputRefiner !== U) traits |= 3;
	else if (tag & (tagFlagObject | tagFlagArray | tagFlagInstance)) traits |= 2;
	if (schema.format !== U || isLiteral(schema)) traits |= 1;
	const to2 = schema.to;
	if (to2 !== U) {
		if (to2 === schema || to2.parser !== U || tagFlags[to2.type] & unionBoundaryTags) traits |= 15;
		else if (!(to2.noValidation === true || tagFlags[to2.type] & tagFlagUnknown || unionRuntimeSame(schema, to2) || to2.type === anyOfTag && unionMask(to2, 1) & tag)) traits |= 9;
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
	if (schema.to !== U || schema.parser !== U || tagFlags[schema.type] & tagFlagRef) return false;
	const fields = schema.anyOf || schema.items || schema.properties;
	for (const key in fields) if (!unionIsNoop(fields[key])) return false;
	return typeof schema.additionalItems !== "object" || unionIsNoop(schema.additionalItems);
};
var unionIsWider = (variants, inputVariants) => inputVariants.every((inputSchema, idx) => {
	const schema = variants[idx];
	return schema !== U && !(tagFlags[inputSchema.type] & (tagFlagArray | tagFlagInstance | tagFlagRef | tagFlagUnion | tagFlagObject)) && inputSchema.type === schema.type && unionLiteralEqual(inputSchema.const, schema.const) && inputSchema.to === U && schema.to === U;
});
var unionFail = (schema, path, input, ...unionErrors) => B_throw(B_makeInvalidInputDetails(schema, unknown, path, input, unionErrors.length ? unionErrors : U));
var unionEmitChain = (cases, ctx) => {
	if (cases.length === 1) {
		const c = cases[0];
		if (c.b === "" && c.c === "") return "";
		if (c.b === "") return `if(!(${c.c})){${ctx.f("")}}`;
		if (c.c === "") return c.b + ";";
		return `if(${c.c}){${c.b}}else{${ctx.f("")}}`;
	}
	let code = "";
	let caught = false;
	let exhaustive = false;
	const attempt = (c, idx) => {
		if (c.b === "") return "break";
		const body = c.b.endsWith(";") ? c.b : `${c.b};`;
		if (c.f & 1 && (c.f & unionMemberFalls || caught)) {
			caught = true;
			return `try{${body}break}catch(x){${c.f & 4 ? `x=${ctx.r()}(x);if(x.expected===${ctx.s()}){x=x.unionErrors;x&&(r||(r=[])).push(...x)}else{(r||(r=[])).push(x)}` : `(r||(r=[])).push(${ctx.r()}(x))`}${!(c.f & unionMemberFalls) && unconditional > idx ? `;${ctx.f(",...(r||[])")}` : ""}}`;
		}
		return `${body}break`;
	};
	let unconditional = -1;
	for (let idx = 0; idx < cases.length; idx++) if (cases[idx].c === "") unconditional = idx;
	let last = "";
	let open = false;
	for (let idx = 0; idx < cases.length; idx++) {
		const c = cases[idx];
		const shared = c.c !== "" && c.c === last;
		if (shared && !open) continue;
		const arm = attempt(c, idx);
		open = arm[0] === "t";
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
var unionNarrowSchema = (schema) => {
	const tagFlag = tagFlags[schema.type];
	const container = tagFlagObject | tagFlagArray;
	const narrow = baseSchema(schema.type, false, (input) => {
		if (tagFlags[input.s.type] & tagFlagUnknown) return B_refine(input, input.e, [{
			c: (inputVar) => typeCheckCond(input, schema, inputVar),
			f: failInvalidType
		}]);
		if (unionRuntimeSame(input.s, narrow)) return tagFlag & container ? B_refine(input, input.e) : input;
		return schema.decoder(input);
	});
	narrow.encoder = schema.encoder;
	if (tagFlag & tagFlagInstance) narrow.class = schema.class;
	else if (tagFlag & container) {
		narrow.additionalItems = unknown;
		if (tagFlag & tagFlagObject) narrow.properties = immutableEmptyObject;
		else narrow.items = immutableEmptyArray;
	} else if (tagFlag & (tagFlagNull | tagFlagUndefined | tagFlagNaN)) narrow.const = schema.const;
	return narrow;
};
var unionObjectish = tagFlagObject | tagFlagInstance;
var unionStructured = tagFlagObject | tagFlagArray | tagFlagInstance | tagFlagRef | tagFlagUnion;
var unionWiden = (tagFlag, nan2) => tagFlag | (tagFlag & unionObjectish ? unionObjectish : tagFlag & tagFlags[numberTag] ? nan2 : 0);
var unionRefDef = (schema) => {
	const defs = schema["$defs"];
	const ref = schema["$ref"];
	if (defs !== U && ref !== U) {
		const resolved = defs[ref.slice(ref.lastIndexOf("/") + 1)];
		if (resolved !== U && resolved !== schema) return resolved;
	}
	return U;
};
var unionMask = (schema, mode, nan2 = 0) => {
	if (mode === 2) {
		const resolved = unionRefDef(schema);
		if (resolved !== U) return unionMask(resolved, 1, nan2);
	}
	const tagFlag = tagFlags[schema.type];
	if (!mode && tagFlag & tagFlagNever) return 0;
	if (mode && tagFlag & tagFlagUnion) {
		let mask = 0;
		const variants = schema.anyOf;
		for (let i = 0; i < variants.length; i++) mask |= unionMask(variants[i], 1, nan2);
		return mask;
	}
	return tagFlag & (tagFlagUnknown | tagFlagUnion | tagFlagRef) ? unionAnyTag : unionWiden(tagFlag, nan2);
};
var unionMemberFalls = 8;
var unionMemberDirect = 16;
var unionGroup = (member) => ({
	m: member.m,
	a: [member],
	f: member.f & unionMemberDirect,
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
var unionCheckPartial = (input, source, target, variants, outputSide) => {
	const other = outputSide ? target : source;
	let matched = U;
	let unmatched = false;
	for (let idx = 0; idx < variants.length; idx++) {
		const variant = variants[idx];
		const match = outputSide ? unionOutput(variant) : variant;
		if (variant.type === neverTag || outputSide && match.type === neverTag) continue;
		if (unionSameType(other, match)) matched || (matched = variant);
		else unmatched = true;
	}
	if (matched !== U && unmatched) unionInvalid(input, source, target, `${/* @__PURE__ */ inputExpression(matched)} has the same type as the ${outputSide ? "target" : "source"} and the others don't`);
};
var unionUncovered = (input, source, target, variant) => unionInvalid(input, source, target, `${/* @__PURE__ */ inputExpression(variant)} has no same-type variant on the other side`);
var unionInvalid = (input, from, to2, why) => B_invalidOperation(input, `Invalid operation: can't convert ${/* @__PURE__ */ inputExpression(from)} to ${/* @__PURE__ */ inputExpression(to2)} \u2014 ${why}. Use S.to to say what you mean, or S.never to mark a variant unreachable`);
var unionNormalize = (variants, source, skipUndefined, nan2) => {
	let flags = skipUndefined ? tagFlagUndefined : 0;
	const sourceLiteral = isLiteral(source);
	for (let i = 0; i < variants.length; i++) {
		const member = variants[i];
		if (sourceLiteral && isLiteral(member) && unionLiteralEqual(member.const, source.const)) flags |= tagFlagUnknown;
		flags |= tagFlags[member.type] & (tagFlagObject | tagFlags[numberTag]);
	}
	return {
		m: unionMask(source, 2, nan2),
		f: flags,
		t: tagFlags[source.type]
	};
};
var unionAnalyze = (normalized, variants, source, nan2) => {
	const sourceMask = normalized.m;
	const normalizedFlags = normalized.f;
	const out = [];
	const sourceTag = normalized.t;
	const unknownSource = sourceTag & tagFlagUnknown;
	const sourceBoundary = sourceTag & (tagFlagUnion | tagFlagRef);
	const unionSource = sourceBoundary && sourceMask !== unionAnyTag;
	const sourceDiscriminator = unionDiscriminator(source);
	const exact = normalizedFlags & tagFlagUnknown;
	const broadObject = normalizedFlags & tagFlagObject;
	const broadNumber = normalizedFlags & tagFlags[numberTag];
	const numberish = tagFlags[numberTag] | tagFlagNaN;
	for (let i = 0; i < variants.length; i++) {
		const s2 = variants[i];
		const tag = tagFlags[s2.type];
		const inputMask = unionMask(s2, 1, nan2);
		const d = unionDiscriminator(s2);
		const same = unionRuntimeSame(source, s2);
		const discriminatorDisjoint = sourceDiscriminator !== U && d !== U && same && sourceDiscriminator[0] === d[0] && !unionLiteralEqual(sourceDiscriminator[1], d[1]);
		const accepts = !(tag & tagFlagNever) && !(normalizedFlags & tagFlagUndefined && tag & tagFlagUndefined) && !discriminatorDisjoint && (!exact || (isLiteral(s2) ? unionLiteralEqual(s2.const, source.const) : sourceMask & inputMask));
		const native = sourceMask & tag;
		const coerces = accepts && !unknownSource && !(unionSource ? native : same);
		const output = unionOutput(s2);
		const traits = unionTraits(s2);
		const sourceDeopt = sourceBoundary && (!unionSource || coerces);
		const effect = output.type === neverTag ? 3 : traits & 4 || sourceDeopt ? 4 : coerces || traits & 8 ? 2 : traits & 1 || tag & unionStructured ? 1 : 0;
		const nested = s2.type === objectTag && nestedLoc in s2.properties;
		const f = traits & 7 | (effect !== 0 ? 1 : 0) | (sourceDeopt ? 4 : 0) | (!unknownSource && same || tag & unionOpaqueTags ? unionMemberDirect : 0);
		const p = nested || broadObject && tag & (tagFlagArray | tagFlagInstance) || broadNumber && tag & tagFlagNaN ? 0 : d !== U ? 1 : 2;
		out.push({
			i,
			s: s2,
			m: accepts ? unknownSource ? inputMask : unionSource ? native ? inputMask : s2.type === undefinedTag && sourceMask & tagFlagNull ? tagFlagNull : s2.type === nullTag && sourceMask & tagFlagUndefined ? tagFlagUndefined : sourceMask & tagFlagString ? tagFlagString : sourceMask : sourceMask : 0,
			o: !!accepts && output.type !== neverTag,
			e: effect,
			f,
			p,
			k: tag & tagFlagInstance ? s2.class : s2.type,
			r: tag & unionObjectish ? unionObjectish : tag & numberish ? numberish : unionWiden(tag, nan2),
			d
		});
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
		const bucketed = member.r !== unionAnyTag && (member.m & ~member.r) === 0;
		const compatible = member.e < 2 || member.e === 4 && member.d?.[0] === "";
		let bucket = bucketed ? member.p === 0 ? priority[member.r] || active[member.r] : active[member.r] : U;
		let open = U;
		let broad = false;
		if (bucket !== U) for (let j = 0; j < bucket.t.length; j++) {
			const group = bucket.t[j];
			const first = group.a[0];
			broad || (broad = group.p === 2);
			if (open === U && compatible && group.o && first.k === member.k && first.e < 2 === member.e < 2 && group.p === 0 === (member.p === 0)) open = group;
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
			open.f &= ~unionMemberDirect;
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
				member.f |= unionMemberFalls;
				group.f |= 2;
			}
			if (conflict2) key = false;
			else {
				key = d[0];
				(values || (values = /* @__PURE__ */ new Set())).add(d[1]);
			}
		}
		const route = group.a[0].r;
		const semantic = later[route];
		let overlaps = !!(laterMask & group.m) && (!!(laterBroad & group.m) || key === false || semantic === U || semantic === false || semantic[0] !== key);
		if (!overlaps && semantic !== U && semantic !== false) {
			for (const value of values) if (semantic[1].has(value)) {
				overlaps = true;
				break;
			}
		}
		if (overlaps || laterMask && tagFlags[group.a[0].s.type] & unionOpaqueTags && (group.a[0].s.to !== U || group.a[0].s.parser !== U)) group.f |= unionMemberFalls | 2;
		if (group.a.length !== 1 || !(group.f & unionMemberDirect)) group.n = unionNarrowSchema(group.a[0].s);
		if (route !== unionAnyTag && (group.m & ~route) === 0) {
			if (key === false) later[route] = false;
			else if (semantic === U) later[route] = [key, values];
			else if (semantic !== false) {
				if (semantic[0] !== key) later[route] = false;
				else for (const value of values) semantic[1].add(value);
			}
		} else laterBroad |= group.m;
		laterMask |= group.m;
	}
	return plan;
};
var unionBoundaryVariant = (source, tag) => {
	const resolved = unionRefDef(source);
	return resolved !== U && resolved.anyOf !== U ? resolved.anyOf.find((v) => v.type === tag) : U;
};
var unionEmit = (input, self, plan, toPerCase, trustedSelf) => {
	const initialInline = input.i;
	let output = B_refine(input);
	const awaitAsync = plan.some((group) => group.f & 2);
	const outputBySource = [];
	let salvaged = "";
	let rethrow = "";
	let expected = "";
	const ctx = {
		f: (caught) => `${B_embed(input, unionFail.bind(U, self, input.path))}(${input.v()}${salvaged}${caught})`,
		r: () => rethrow || (rethrow = B_embed(input, getOrRethrow)),
		s: () => expected || (expected = B_embed(input, self))
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
	const compile = (member, source, target = source) => {
		const mark = input.g.t;
		const caseInput = B_scope(source);
		caseInput.u = true;
		caseInput.t = source.t;
		caseInput.io = false;
		caseInput.e = member.s;
		const trustedD = trustedSelf && member.p === 1 && !(member.f & unionMemberFalls) && member.d[0] !== "" && unionDTrusted(member) ? member.d : U;
		if (trustedD !== U) caseInput.s = member.s;
		let caseOut;
		const options = input.g.o;
		input.g.o |= flagUnionTransformContext;
		try {
			if (self.perVariant) try {
				caseOut = parse(caseInput);
			} catch (exn) {
				salvaged += `,${B_embed(input, getOrRethrow(exn))}`;
				return U;
			}
			else caseOut = parse(caseInput);
		} finally {
			input.g.o = options;
		}
		if (member.o) outputBySource[member.i] = caseOut.s;
		const cond = {
			c: "",
			h: []
		};
		const falls = member.f & unionMemberFalls;
		let body = B_merge(caseOut, cond);
		const async = caseOut.f & valFlagAsync;
		output.f |= async;
		if (caseOut.t) {
			output.t = true;
			const itemVar = target.v();
			if (async || caseOut.i !== itemVar) body += `${itemVar}=${async && awaitAsync ? "await " : ""}${caseOut.i}`;
		}
		if (trustedD !== U) {
			const dSchema = (member.s.properties || member.s.items)[trustedD[0]];
			const dRead = `${source.v()}[${inlinedValueFromString(trustedD[0])}]`;
			const dCond = dSchema.type === nanTag ? `Number.isNaN(${dRead})` : `${dRead}===${B_inlineConst(caseInput, dSchema)}`;
			cond.c = cond.c ? `${dCond}&&${cond.c}` : dCond;
		}
		const flags = (body !== "" && input.g.t !== mark ? 1 : 0) | (async && awaitAsync ? 2 : 0) | (falls ? unionMemberFalls : 0);
		return {
			c: cond.c,
			b: body,
			f: flags
		};
	};
	const cases = [];
	for (let i = 0; i < plan.length; i++) {
		const group = plan[i];
		if (group.a.length === 1 && group.f & unionMemberDirect) {
			const c = compile(group.a[0], input);
			if (c !== U) {
				if (group.f & unionMemberFalls) c.f |= unionMemberFalls;
				cases.push(c);
				if (c.c === "" && c.b === "") break;
			}
			continue;
		}
		const mark = input.g.t;
		const narrowInput = B_scope(input);
		narrowInput.io = false;
		narrowInput.e = group.n;
		const narrow = parse(narrowInput);
		if (tagFlags[group.n.type] & (tagFlagObject | tagFlagArray)) {
			const sourceVariant = unionBoundaryVariant(input.s, group.n.type);
			if (sourceVariant !== U) narrow.s = sourceVariant;
		}
		const inner = [];
		for (let j = 0; j < group.a.length; j++) {
			const c = compile(group.a[j], narrow, narrowInput);
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
				let fused = inner.map((c) => c.c).join("||");
				if (inner.length > 1) fused = `(${fused})`;
				B_pushCheck(narrow, {
					c: () => fused,
					f: failInvalidType
				});
			}
			body = B_merge(narrow, cond);
		} else {
			const narrowCode = B_merge(narrow, cond);
			const only = inner.length === 1 ? inner[0] : U;
			if (only !== U && narrowCode === "") {
				if (only.c !== "") cond.c = cond.c ? `${cond.c}&&${only.c}` : only.c;
				body = only.b;
			} else {
				body = narrowCode + unionEmitChain(inner, ctx);
				grouped = inner.length > 1;
			}
		}
		const flags = (body !== "" && input.g.t !== mark ? 1 : 0) | (inner.some((c) => c.f & 2) ? 2 : 0) | group.f & unionMemberFalls | (grouped ? 4 : 0);
		cases.push({
			c: cond.c,
			b: body,
			f: flags
		});
		if (body === "" && cond.c === "") break;
	}
	const noop2 = cases.length > 0 && cases.every((c) => c.b === "") && cases.some((c) => c.c === "");
	const pure = !noop2 && cases.length > 0 && cases.every((c) => c.c !== "" && c.b === "");
	const asyncDispatch = cases.some((c) => c.f & 2);
	if (pure) {
		let fused = cases.map((c) => c.c).join("||");
		if (cases.length > 1) fused = `(${fused})`;
		output = B_refine(B_refine(output, output.s, [{
			c: () => fused,
			f: failInvalidType
		}], self));
	} else if (!noop2) {
		const dispatch = unionEmitChain(cases, ctx);
		if (asyncDispatch) {
			const itemVar = input.v();
			output.i = `(async(${itemVar})=>{${dispatch};return ${itemVar}})(${itemVar})`;
		} else output.cp += dispatch;
	}
	if (!asyncDispatch) output.i = input.i;
	let out;
	if (output.f & valFlagAsync) {
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
	if (input.io && input.e === input.s || input.s === self && toPerCase === U && variants.every(unionIsNoop) || input.s.type === anyOfTag && toPerCase === U && unionIsWider(variants, input.s.anyOf)) return input;
	const initialTagFlag = tagFlags[input.s.type];
	const trustedSelf = input.s === self || self.tr === true;
	if (initialTagFlag & tagFlagUnion || input.s.encoder === U && initialTagFlag & tagFlagRef) input.s = unknown;
	const source = input.s;
	const nan2 = flagUnsafeHas(input.g.o, flagDisableNanNumberValidation) ? tagFlagNaN : 0;
	const normalized = unionNormalize(variants, source, "fromDefault" in self, nan2);
	if (!(normalized.t & tagFlagUnknown) && !(normalized.f & tagFlagUnknown)) unionCheckPartial(input, source, self, variants, false);
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
	return unionEmit(input, self, unionPlan(unionAnalyze(normalized, variants, source, nan2)), toPerCase, trustedSelf);
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
var unionRewrite = (input, map) => {
	const variants = input.s.anyOf;
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
var unionTargetOwns = (target) => target.noValidation === true || tagFlags[unionOutput(target).type] & tagFlagRef || target.type === anyOfTag && target.anyOf.some((v) => tagFlags[v.type] & tagFlagRef);
var unionEncoder = (input, target) => {
	if (unionTargetOwns(target)) return input;
	const variants = input.s.anyOf;
	if (target.perVariant && target.anyOf.length === variants.length) {
		const targets = target.anyOf;
		return targets.every((tv, idx) => tv === variants[idx]) ? input : unionRewrite(input, (_variant, idx) => targets[idx]);
	}
	const resolved = unionResolve(input, input.s, variants, target);
	if (resolved.every((to2) => to2 === U)) return input;
	return unionRewrite(input, (variant, idx) => {
		const to2 = resolved[idx];
		return to2 === U ? variant : updateOutput(variant, (mut) => {
			mut.to = to2;
		});
	});
};
var unionNullish = tagFlagNull | tagFlagUndefined;
var unionOpposite = (schema) => schema.type === undefinedTag ? nullTag : schema.type === nullTag ? undefinedTag : U;
var unionResolve = (input, source, variants, target) => {
	if (source.perVariant) return variants.map(() => target);
	if (unionIsTransparent(target)) return unionResolveToUnion(input, source, variants, target);
	if (!(tagFlags[target.type] & tagFlagUnknown) && !target.noValidation) unionCheckPartial(input, source, target, variants, true);
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
		const sameTyped = targets.filter((targetVariant, t) => targetVariant.type !== neverTag && unionSameType(sourceOut, targetVariant) && (covered[t] = true));
		sourceNullish |= tagFlags[sourceOut.type] & unionNullish;
		if (sameTyped.length === 1) matches[s2] = sameTyped[0];
		else if (sameTyped.length > 1) matches[s2] = tagFlags[sourceOut.type] & unionStructured && sameTyped.includes(sourceOut) ? sourceOut : unionFactory(sameTyped);
		if (matches[s2] !== U) continue;
		const opposite = unionOpposite(sourceOut);
		if (opposite !== U) matches[s2] = targets.find((candidate) => candidate.type === opposite && unionOutput(candidate).type !== neverTag);
		if (matches[s2] === U) unionUncovered(input, source, target, sourceOut);
	}
	for (let t = 0; t < targets.length; t++) {
		const targetVariant = targets[t];
		const opposite = unionOpposite(targetVariant);
		if (targetVariant.type !== neverTag && !covered[t] && (opposite === U || unionOutput(targetVariant).type === neverTag || !(sourceNullish & tagFlags[opposite]))) unionUncovered(input, source, target, targetVariant);
	}
	return matches.map((matched, idx) => matched !== U && unionAddsNothing(matched, unionOutput(variants[idx])) ? U : matched);
};
var unionAddsNothing = (matched, sourceOut) => matched === sourceOut || unionIsNoop(matched) && matched.refiner === U && matched.inputRefiner === U && matched.noValidation === U && (matched.const === U || unionLiteralEqual(matched.const, sourceOut.const)) && !(tagFlags[matched.type] & unionStructured) && unionSameType(matched, sourceOut);
var unionFactory = (schemas) => {
	if (schemas.length === 0) return panic("S.union requires at least one item");
	else if (schemas.length === 1) return schemas[0];
	const has = {};
	const anyOf = [];
	for (let idx = 0; idx < schemas.length; idx++) {
		const schema = schemas[idx];
		const nested = unionIsTransparent(schema) ? schema.anyOf : U;
		for (let j = 0; j < (nested === U ? 1 : nested.length); j++) {
			const member = nested === U ? schema : nested[j];
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
var isItemSchema = (x) => x !== U && typeof x !== "string";
var B_fuseIntoJsonString = (input, expectedSchema, item, isArr) => {
	const to2 = expectedSchema.to;
	if (input.s.additionalItems === unknown && to2 !== U && to2.format === "json" && !to2.space && !flagUnsafeHas(input.g.o, flagAsync) && (isArr || !(item.to === U && flagUnsafeHas(tagFlags[item.type], tagFlagString | tagFlagBoolean | tagFlagNull)))) {
		const marked = copySchema(expectedSchema);
		marked.uv = true;
		return B_refine(input, marked);
	}
	return U;
};
var B_narrowJsonSourcedJsonString = (itemInput) => {
	if (itemInput.s.name === jsonName && itemInput.e.format === "json" && itemInput.e.to === U) itemInput.s = unknown;
};
var makeObjectVal = (prev, schema) => {
	return {
		b: U,
		p: U,
		v: _notVar,
		i: "",
		s: schema.type === arrayTag ? {
			type: arrayTag,
			items: [],
			additionalItems: "strict",
			decoder: arrayDecoder
		} : {
			type: objectTag,
			required: [],
			properties: /* @__PURE__ */ Object.create(null),
			additionalItems: "strict",
			decoder: objectDecoder
		},
		io: U,
		e: prev.e,
		prev,
		f: valFlagNone,
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
	};
};
var completeObjectVal = (objectVal) => {
	const isArray = objectVal.s.type === arrayTag;
	let inline = "";
	let promiseAllContent = "";
	let optionalSettingCode = U;
	const keys = Object.keys(objectVal.d);
	for (let idx = 0; idx < keys.length; idx++) {
		const key = keys[idx];
		const val = objectVal.d[key];
		if (flagUnsafeHas(val.f, valFlagAsync)) promiseAllContent = promiseAllContent + val.i + ",";
		if (val.o) {
			const existingFn = optionalSettingCode;
			optionalSettingCode = (objectVar) => {
				return (existingFn === U ? "" : existingFn(objectVar)) + `if(${val.v()}!==void 0){${objectVar}[${inlinedValueFromString(key)}]=${val.i}}`;
			};
		} else inline = inline + (isArray ? `${val.i}` : `${inlinedValueFromString(key)}:${val.i}`) + ",";
	}
	objectVal.i = isArray ? "[" + inline + "]" : "{" + inline + "}";
	const valWithRequired = objectVal;
	if (promiseAllContent) {
		const operationInput = B_scope(valWithRequired);
		operationInput.io = true;
		const operationOutput = parse(operationInput);
		const operationCode = B_merge(operationOutput);
		if (operationCode === "" && promiseAllContent === `${operationOutput.i},`) valWithRequired.i = operationOutput.i;
		else valWithRequired.i = `Promise.all([${promiseAllContent}]).then(([${promiseAllContent}])=>{${operationCode}return ${operationOutput.i}})`;
		valWithRequired.f |= valFlagAsync;
		valWithRequired.s = operationOutput.s;
		valWithRequired.e = operationOutput.e;
		valWithRequired.io = true;
		return valWithRequired;
	} else if (optionalSettingCode === U) return valWithRequired;
	else {
		const code = optionalSettingCode(valWithRequired.v());
		const output = B_refine(valWithRequired);
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
var array = /* @__NO_SIDE_EFFECTS__ */ (item) => arrayFactory(definitionToSchema(item));
var arrayDecoder = (unknownInput) => {
	const isUnion = unknownInput.u;
	const expectedSchema = unknownInput.e;
	const unknownInputTagFlag = tagFlags[unknownInput.s.type];
	const expectedItems = expectedSchema.items;
	const expectedLength = expectedItems.length;
	let input;
	if (flagUnsafeHas(unknownInputTagFlag, tagFlagUnknown | tagFlagArray)) {
		const isArrayInput = flagUnsafeHas(unknownInputTagFlag, tagFlagArray);
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
		if (checks.length > 0) input = B_refine(unknownInput, schema, checks);
		else input = B_refine(unknownInput, schema);
	} else input = B_unsupportedDecode(unknownInput, unknownInput.s, expectedSchema);
	let output;
	const expectedAdditionalItems = expectedSchema.additionalItems;
	if (isItemSchema(expectedAdditionalItems)) {
		const itemSchema = expectedAdditionalItems;
		if (itemSchema === unknown) output = input;
		else {
			if (expectedLength === 0) {
				const fused = B_fuseIntoJsonString(input, expectedSchema, itemSchema, true);
				if (fused !== U) return B_markOutput(fused, input);
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
			if (flagUnsafeHas(itemOutput.f, valFlagAsync)) output = B_asyncVal(output2, `Promise.all(${output2.i})`);
			else output = output2;
		}
	} else {
		const objectVal = makeObjectVal(input, expectedSchema);
		let shouldRecreateInput;
		{
			const ai = expectedSchema.additionalItems;
			if (ai === "strict") shouldRecreateInput = false;
			else if (ai === "strip") {
				const inputAi = input.s.additionalItems;
				shouldRecreateInput = isItemSchema(inputAi) ? true : input.s.items.length !== expectedLength;
			} else shouldRecreateInput = true;
		}
		for (let idx = 0; idx < expectedLength; idx++) {
			const schema = expectedItems[idx];
			const key = String(idx);
			const itemInput = valGet(input, key);
			itemInput.e = schema;
			itemInput.io = false;
			itemInput.u = isUnion;
			B_narrowJsonSourcedJsonString(itemInput);
			const itemOutput = parse(itemInput);
			if (isUnion && isLiteral(schema)) B_hoistChildChecks(input, itemOutput, key);
			B_addObjectField(objectVal, key, itemOutput);
			if (!shouldRecreateInput) shouldRecreateInput = itemOutput.t;
		}
		if (shouldRecreateInput) output = completeObjectVal(objectVal);
		else {
			const o = B_refine(input, expectedSchema);
			o.cp = objectVal.cp;
			o.d = objectVal.d;
			output = o;
		}
	}
	return B_markOutput(output, input);
};
var objectDecoder = (unknownInput) => {
	const isUnion = unknownInput.u;
	const expectedSchema = unknownInput.e;
	const unknownInputTagFlag = tagFlags[unknownInput.s.type];
	let input;
	if (flagUnsafeHas(unknownInputTagFlag, tagFlagUnknown | tagFlagObject)) {
		const isObjectInput = flagUnsafeHas(unknownInputTagFlag, tagFlagObject);
		let schema;
		if (!isObjectInput) {
			const mut = baseSchema(objectTag, false, objectDecoder);
			mut.properties = immutableEmptyObject;
			mut.additionalItems = unknown;
			schema = mut;
		} else schema = unknownInput.s;
		const checks = [];
		if (!isObjectInput) {
			checks.push({
				c: objectTagCond,
				f: failInvalidType
			});
			checks.push({
				c: (inputVar) => `!${isArrayCond(inputVar)}`,
				f: failInvalidType
			});
		}
		if (checks.length > 0) input = B_refine(unknownInput, schema, checks);
		else input = B_refine(unknownInput, schema);
	} else input = B_unsupportedDecode(unknownInput, unknownInput.s, expectedSchema);
	const expectedAdditionalItems = expectedSchema.additionalItems;
	const dictItem = isItemSchema(expectedAdditionalItems) ? expectedAdditionalItems : U;
	const inputAdditionalItems = input.s.additionalItems;
	const sourceIsDict = isItemSchema(inputAdditionalItems);
	let output;
	if (dictItem !== U && dictItem === unknown) output = input;
	else if (dictItem !== U && sourceIsDict) {
		const fused = B_fuseIntoJsonString(input, expectedSchema, dictItem, false);
		if (fused !== U) return B_markOutput(fused, input);
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
		if (flagUnsafeHas(itemOutput.f, valFlagAsync)) {
			const resolveVar = B_varWithoutAllocation(output2.g);
			const rejectVar = B_varWithoutAllocation(output2.g);
			const asyncParseResultVar = B_varWithoutAllocation(output2.g);
			const counterVar = B_varWithoutAllocation(output2.g);
			const outputVar = output2.v();
			output = B_asyncVal(output2, `new Promise((${resolveVar},${rejectVar})=>{let ${counterVar}=Object.keys(${outputVar}).length;for(let ${keyVar} in ${outputVar}){${outputVar}[${keyVar}].then(${asyncParseResultVar}=>{${outputVar}[${keyVar}]=${asyncParseResultVar};if(${counterVar}--===1){${resolveVar}(${outputVar})}},${rejectVar})}})`);
		} else output = output2;
	} else if (dictItem !== U) {
		const itemSchema = dictItem;
		const objectVal = makeObjectVal(input, expectedSchema);
		const keys = Object.keys(input.s.properties);
		for (let idx = 0; idx < keys.length; idx++) {
			const key = keys[idx];
			const itemInput = valGet(input, key);
			itemInput.e = itemSchema;
			itemInput.io = false;
			itemInput.u = isUnion;
			B_narrowJsonSourcedJsonString(itemInput);
			B_addObjectField(objectVal, key, parse(itemInput));
		}
		output = completeObjectVal(objectVal);
	} else {
		const properties = expectedSchema.properties;
		const keys = Object.keys(properties);
		const keysCount = keys.length;
		const objectVal = makeObjectVal(input, expectedSchema);
		let shouldRecreateInput;
		{
			const ai = expectedSchema.additionalItems;
			if (ai === "strict") shouldRecreateInput = false;
			else if (ai === "strip") shouldRecreateInput = sourceIsDict || Object.keys(input.s.properties).length !== keysCount;
			else shouldRecreateInput = true;
		}
		const isJsonParent = isItemSchema(inputAdditionalItems) ? inputAdditionalItems.name === jsonName : false;
		for (let idx = 0; idx < keysCount; idx++) {
			const key = keys[idx];
			const schema = properties[key];
			const itemInput = valGet(input, key);
			itemInput.e = schema;
			itemInput.io = false;
			itemInput.u = isUnion;
			if (isJsonParent && schema.type === anyOfTag && schema.has[undefinedTag]) itemInput.i = `(${itemInput.i}??null)`;
			B_narrowJsonSourcedJsonString(itemInput);
			const itemOutput = parse(itemInput);
			if (isUnion && isLiteral(schema)) B_hoistChildChecks(input, itemOutput, key);
			B_addObjectField(objectVal, key, itemOutput);
			if (!shouldRecreateInput) shouldRecreateInput = itemOutput.t;
		}
		if (expectedSchema.additionalItems === "strict" && isItemSchema(inputAdditionalItems)) {
			const keyVar = B_varWithoutAllocation(objectVal.g);
			B_hoistDecl(input, keyVar);
			objectVal.cp = objectVal.cp + `for(${keyVar} in ${input.v()}){if(`;
			if (keys.length === 0) objectVal.cp = objectVal.cp + "true";
			else for (let idx = 0; idx < keys.length; idx++) {
				const key = keys[idx];
				if (idx !== 0) objectVal.cp = objectVal.cp + "&&";
				objectVal.cp = objectVal.cp + `${keyVar}!==${inlinedValueFromString(key)}`;
			}
			objectVal.cp = objectVal.cp + `){${B_failWithArg(input, (excessFieldName) => ({
				code: "unrecognized_keys",
				path: objectVal.path,
				reason: `Unrecognized key "${excessFieldName}"`,
				keys: [excessFieldName]
			}), keyVar)}}}`;
		}
		if (shouldRecreateInput) output = completeObjectVal(objectVal);
		else {
			const o = B_refine(input, expectedSchema);
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
var definitionToSchema = (definition) => isSchemaObject(definition) ? definition : traverseDefinition(definition, (node) => isSchemaObject(node) ? node : U);
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
var nestedNone = () => {
	const itemSchema = Literal_parse(0);
	const properties = {};
	properties[nestedLoc] = itemSchema;
	return {
		type: objectTag,
		required: [nestedLoc],
		properties,
		additionalItems: "strip",
		decoder: objectDecoder,
		serializer: (input) => {
			const nextSchema = input.e.to;
			return B_nextConst(input, nextSchema, nextSchema);
		}
	};
};
var nestedOption = (item) => {
	return updateOutput(item, (mut) => {
		mut.to = nestedNone();
		mut.parser = nestedOptionParser;
	});
};
var optionFactory = (item, unitSchema = unit) => {
	const out = getOutputSchema(item);
	if (out.type === undefinedTag) return unionFactory([unitSchema, nestedOption(item)]);
	else if (out.type === anyOfTag) {
		const anyOf = out.anyOf;
		const has = out.has;
		return updateOutput(item, (mut) => {
			const schemas = anyOf;
			const mutHas = { ...has };
			const newAnyOf = [];
			for (let idx = 0; idx < schemas.length; idx++) {
				const schema = schemas[idx];
				let toPush;
				const schemaOut = getOutputSchema(schema);
				if (schemaOut.type === undefinedTag) {
					mutHas[unitSchema.type] = true;
					newAnyOf.push(unitSchema);
					toPush = nestedOption(schema);
				} else if (schemaOut.properties !== U) {
					const nestedSchema = schemaOut.properties[nestedLoc];
					if (nestedSchema !== U) toPush = updateOutput(schema, (mut2) => {
						const bumped = copySchema(nestedSchema);
						bumped.const = nestedSchema.const + 1;
						const properties2 = {};
						properties2[nestedLoc] = bumped;
						mut2.properties = properties2;
					});
					else toPush = schema;
				} else toPush = schema;
				newAnyOf.push(toPush);
			}
			if (newAnyOf.length === schemas.length) {
				mutHas[unitSchema.type] = true;
				newAnyOf.push(unitSchema);
			}
			mut.anyOf = newAnyOf;
			mut.has = mutHas;
		});
	} else return unionFactory([item, unitSchema]);
};
var option = /* @__NO_SIDE_EFFECTS__ */ (item) => {
	return optionFactory(item, unit);
};
var valGet = (parent, location) => {
	let vals;
	if (parent.d !== U) vals = parent.d;
	else {
		const d = /* @__PURE__ */ Object.create(null);
		parent.d = d;
		vals = d;
	}
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
				if (parent.s.type === objectTag && s2.type !== unknownTag && !flagUnsafeHas(tagFlags[s2.type], tagFlagRef) && !isOptional(s2)) {
					schema = /* @__PURE__ */ option(s2);
					schema.perVariant = true;
				} else schema = s2;
			} else schema = B_unsupportedDecode(parent, parent.s, parent.e);
		}
		const pathAppend = pathFromInlinedLocation(inlinedValueFromString(location));
		const item = {
			b: U,
			p: parent,
			v: _notVarAtParent,
			i: isLiteral(schema) ? B_inlineConst(parent, schema) : `${parent.v()}${pathAppend}`,
			s: schema,
			io: U,
			e: schema,
			prev: U,
			f: valFlagNone,
			d: U,
			fv: U,
			cp: "",
			hd: "",
			fz: U,
			vc: U,
			u: U,
			t: U,
			path: /* @__PURE__ */ pathConcat(parent.path, pathAppend),
			g: parent.g,
			o: U
		};
		vals[location] = item;
		return item;
	}
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
var nullAsUnit = /* @__PURE__ */ (() => {
	const schema = copySchema(nullLiteral);
	schema.to = unit;
	return schema;
})();
var Option_getWithDefault = (schema, default_) => {
	return updateOutput(schema, (mut) => {
		const anyOf = mut.anyOf;
		if (anyOf !== U) {
			const outputItems = [];
			const originalItems = [];
			for (let idx = 0; idx < anyOf.length; idx++) {
				const schema2 = anyOf[idx];
				const outputSchema = getOutputSchema(schema2);
				if (outputSchema.type !== undefinedTag) {
					outputItems.push(outputSchema);
					originalItems.push(schema2);
				}
			}
			const item = outputItems.length === 0 ? panic(`Can't set default for ${/* @__PURE__ */ inputExpression(mut)}`) : outputItems.length === 1 ? outputItems[0] : unionFactory(outputItems);
			const originalItem = originalItems.length === 1 ? originalItems[0] : unionFactory(originalItems);
			if (default_.type === "value") {
				const v = default_.value;
				try {
					(/* @__PURE__ */ getDecoder(unknown, item))(v);
				} catch (exn) {
					const error = getOrRethrow(exn);
					panic(`Invalid default for ${/* @__PURE__ */ inputExpression(mut)}: ${error["message"]}`);
				}
				try {
					mut.default = (/* @__PURE__ */ getDecoder(/* @__PURE__ */ reverse(originalItem)))(v);
				} catch (_exn) {}
			}
			mut.parser = (input) => {
				const nextSchema = input.e.to;
				const inputVar = input.v();
				return B_next(input, `${inputVar}===void 0?${default_.type === "value" ? B_inlineConst(input, Literal_parse(default_.value)) : `${B_embed(input, default_.callback)}()`}:${inputVar}`, nextSchema, nextSchema);
			};
			const to2 = copySchema(item);
			const originalDecoder = to2.decoder;
			to2.serializer = (input) => {
				const nextSchema = /* @__PURE__ */ reverse(originalItem);
				return B_refine(originalDecoder(input), nextSchema, U, nextSchema);
			};
			to2.decoder = noopDecoder;
			mut.to = to2;
		} else panic(`Can't set default for ${/* @__PURE__ */ inputExpression(mut)}`);
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
var standardJSONSchemaConverter;
var getStandardJSONSchema = (schema, options, isOutput) => {
	if (standardJSONSchemaConverter !== U) return standardJSONSchemaConverter(schema, options, isOutput);
	else throw new SuryError({
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
	let decoderFlag = U;
	let decoder;
	const standard = {
		version: 1,
		vendor,
		validate: (input) => {
			if (decoderFlag !== globalConfig.f) {
				decoder = /* @__PURE__ */ getDecoder(unknown, schema);
				decoderFlag = globalConfig.f;
			}
			try {
				return { value: decoder(input) };
			} catch (exn) {
				const error = getOrRethrow(exn);
				return { issues: [{
					message: error.reason,
					path: error.path === pathEmpty ? U : /* @__PURE__ */ pathToArray(error.path)
				}] };
			}
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
var invalidDateRefine = (input) => {
	return B_refine(input, input.e, [{
		c: (inputVar) => `!Number.isNaN(${inputVar}.getTime())`,
		f: failInvalidType
	}]);
};
var dateTimeString = /* @__PURE__ */ initSchema(stringTag, stringDecoderFn, (s2) => {
	s2.format = "date-time";
});
var date = /* @__PURE__ */ initSchema(instanceTag, (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	if (flagUnsafeHas(inputTagFlag, tagFlagString)) return invalidDateRefine(B_next(input, `new Date(${input.i})`, date));
	else if (flagUnsafeHas(inputTagFlag, tagFlagUnknown)) return invalidDateRefine(instanceDecoder(input));
	else if (flagUnsafeHas(inputTagFlag, tagFlagInstance) && input.s.class === date.class) return input;
	else return B_unsupportedDecode(input, input.s, input.e);
}, (s2) => {
	s2.class = Date;
	s2.encoder = (input, target) => {
		const toTagFlag = tagFlags[target.type];
		if (flagUnsafeHas(toTagFlag, tagFlagString)) return parse(B_refine(B_next(input, `${input.i}.toISOString()`, dateTimeString, target)));
		else return input;
	};
});
var schemaFactory = /* @__NO_SIDE_EFFECTS__ */ (definition) => {
	return definitionToSchema(definition);
};
var expects = (fnName, expected, got) => `S.${fnName} expects ${expected}, got ${got}`;
var assertNumericBound = (fnName, schema, value) => {
	const tag = schema.type;
	if (tag !== numberTag && tag !== bigintTag) panic(expects(fnName, "number | bigint schema", /* @__PURE__ */ inputExpression(schema)));
	if (tag === bigintTag ? typeof value !== bigintTag : typeof value !== numberTag || Number.isNaN(value)) throw new SuryError({
		code: "invalid_operation",
		path: pathEmpty,
		reason: expects(fnName, /* @__PURE__ */ inputExpression(schema), stringify(value))
	});
};
var assertLengthBound = (fnName, schema, value) => {
	if (schema.type !== stringTag && schema.type !== arrayTag) panic(expects(fnName, "string | array schema", /* @__PURE__ */ inputExpression(schema)));
	if (typeof value !== numberTag || !Number.isSafeInteger(value) || value < 0) throw new SuryError({
		code: "invalid_operation",
		path: pathEmpty,
		reason: expects(fnName, "integer >= 0", stringify(value))
	});
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
	const low = exMin !== U ? exMin : written & 1 ? schema[minKey] : U;
	const high = exMax !== U ? exMax : written & 2 ? schema[maxKey] : U;
	const mo = schema.multipleOf;
	const subject0 = sized ? `${base}${member}` : base;
	if (low === U && high === U) return `${subject0} % ${lit(mo)}`;
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
			if (min !== U) checks.push({
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
			else if (exactDivisor(mo)) cond = (inputVar) => `${inputVar}%${lit(mo)}===0`;
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
var gte = /* @__NO_SIDE_EFFECTS__ */ (schema, minValue, maybeMessage) => {
	assertNumericBound("gte", schema, minValue);
	assertLower(schema, minValue, false);
	if (!narrowsLower(schema, minValue, false)) {
		const written = schema.bounds ?? 0;
		return carryMessage(schema, written & 4 ? "exclusiveMinimum" : written & 1 ? "minimum" : U, maybeMessage);
	}
	return updateBounds(schema, (mut) => {
		setBoundExpression(mut, schema);
		mut.bounds = (schema.bounds ?? 0) & -5 | 1;
		mut.minimum = minValue;
		mut.exclusiveMinimum = U;
		setBoundMessage(mut, schema, "minimum", maybeMessage, "exclusiveMinimum");
	});
};
var lte = /* @__NO_SIDE_EFFECTS__ */ (schema, maxValue, maybeMessage) => {
	assertNumericBound("lte", schema, maxValue);
	assertUpper(schema, maxValue, false);
	if (!narrowsUpper(schema, maxValue, false)) {
		const written = schema.bounds ?? 0;
		return carryMessage(schema, written & 8 ? "exclusiveMaximum" : written & 2 ? "maximum" : U, maybeMessage);
	}
	return updateBounds(schema, (mut) => {
		setBoundExpression(mut, schema);
		mut.bounds = (schema.bounds ?? 0) & -9 | 2;
		mut.maximum = maxValue;
		mut.exclusiveMaximum = U;
		setBoundMessage(mut, schema, "maximum", maybeMessage, "exclusiveMaximum");
	});
};
var minLength = /* @__NO_SIDE_EFFECTS__ */ (schema, length2, maybeMessage) => {
	assertLengthBound("minLength", schema, length2);
	assertSize(schema, length2, false);
	const key = sizeKey(schema, false);
	if (!narrowsSize(schema[key], length2, false)) return carryMessage(schema, (schema.bounds ?? 0) & 1 ? key : U, maybeMessage);
	return updateBounds(schema, (mut) => {
		setBoundExpression(mut, schema);
		mut.bounds = (schema.bounds ?? 0) | 1;
		mut[key] = length2;
		setBoundMessage(mut, schema, key, maybeMessage);
	});
};
var maxLength = /* @__NO_SIDE_EFFECTS__ */ (schema, length2, maybeMessage) => {
	assertLengthBound("maxLength", schema, length2);
	assertSize(schema, length2, true);
	const key = sizeKey(schema, true);
	if (!narrowsSize(schema[key], length2, true)) return carryMessage(schema, (schema.bounds ?? 0) & 2 ? key : U, maybeMessage);
	return updateBounds(schema, (mut) => {
		setBoundExpression(mut, schema);
		mut.bounds = (schema.bounds ?? 0) | 2;
		mut[key] = length2;
		setBoundMessage(mut, schema, key, maybeMessage);
	});
};
var nonEmpty = /* @__NO_SIDE_EFFECTS__ */ (schema, maybeMessage) => /* @__PURE__ */ minLength(schema, 1, maybeMessage);
var stringFormat = /* @__NO_SIDE_EFFECTS__ */ (format, test, message) => /* @__PURE__ */ initSchema(stringTag, stringDecoderFn, (s2) => {
	const re = typeof test === "string" ? new RegExp(test, "i") : test;
	s2.format = format;
	s2.refiner = (input) => {
		return [{
			c: (inputVar) => `${B_embed(input, re)}${re instanceof RegExp ? ".test" : ""}(${inputVar})`,
			f: B_failWithErrorMessage("format", message)
		}];
	};
});
var ipv4Pattern = "(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)";
var ipv6Pattern = /* @__NO_SIDE_EFFECTS__ */ () => "(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|" + ipv4Pattern + ")|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)";
var uriPattern = /* @__NO_SIDE_EFFECTS__ */ (schemeOptional) => "^(?:[a-z][a-z0-9+\\-.]*:)" + schemeOptional + "(?:\\/\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:" + /* @__PURE__ */ ipv6Pattern() + "|[Vv][0-9a-f]+\\.[a-z0-9\\-._~!$&'()*+,;=:]+)\\]|" + ipv4Pattern + "|(?:[a-z0-9\\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\\/(?:(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\\?(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$";
var uri = /* @__PURE__ */ stringFormat("uri", /* @__PURE__ */ uriPattern(""));
var parser = /* @__NO_SIDE_EFFECTS__ */ (...args) => /* @__PURE__ */ getDecoder(unknown, ...args);
var union = /* @__NO_SIDE_EFFECTS__ */ (values) => unionFactory(values.map(definitionToSchema));
var nullable2 = /* @__NO_SIDE_EFFECTS__ */ (definition, maybeOr) => {
	const schema = definitionToSchema(definition);
	if (maybeOr !== U) {
		const schema2 = unionFactory([schema, nullAsUnit]);
		if (typeof maybeOr === functionTag) return /* @__PURE__ */ Option_getOrWith(schema2, maybeOr);
		else return /* @__PURE__ */ Option_getOr(schema2, maybeOr);
	} else return unionFactory([schema, nullLiteral]);
};
//#endregion
//#region ../schemas/libraries/sury/download.ts
const imageSchema = /* @__PURE__ */ schemaFactory({
	id: float,
	created: date,
	title: string.with(nonEmpty).with(maxLength, 100),
	type: /* @__PURE__ */ union(["jpg", "png"]),
	size: float,
	url: uri
});
const ratingSchema = /* @__PURE__ */ schemaFactory({
	id: float,
	stars: float.with(gte, 0).with(lte, 5),
	title: string.with(nonEmpty).with(maxLength, 100),
	text: string.with(nonEmpty).with(maxLength, 1e3),
	images: /* @__PURE__ */ array(imageSchema)
});
(/* @__PURE__ */ parser(/* @__PURE__ */ schemaFactory({
	id: float,
	created: date,
	title: string.with(nonEmpty).with(maxLength, 100),
	brand: string.with(nonEmpty).with(maxLength, 30),
	description: string.with(nonEmpty).with(maxLength, 500),
	price: float.with(gte, 1).with(lte, 1e4),
	discount: float.with(gte, 1).with(lte, 100).with(nullable2),
	quantity: float.with(gte, 0).with(lte, 10),
	tags: /* @__PURE__ */ array(string.with(nonEmpty).with(maxLength, 30)),
	images: /* @__PURE__ */ array(imageSchema),
	ratings: /* @__PURE__ */ array(ratingSchema)
})))({});
//#endregion
