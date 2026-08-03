//#region ../node_modules/.pnpm/sury@11.0.0-rc.0/node_modules/sury/src/S.mjs
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
var inlinedValueFromString = (str) => {
	return str.includes("\"") || str.includes("\n") ? JSON.stringify(str) : `"${str}"`;
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
var stringify = (unknown2) => {
	const tagFlag = tagFlags[typeof unknown2];
	if (flagUnsafeHas(tagFlag, tagFlagUndefined)) return undefinedTag;
	else if (flagUnsafeHas(tagFlag, tagFlagObject)) if (unknown2 === null) return nullTag;
	else if (Array.isArray(unknown2)) return `[${unknown2.map(stringify).join(", ")}]`;
	else if (unknown2.constructor === Object) {
		const dict = unknown2;
		return `{ ${Object.keys(dict).map((key) => `${key}: ${stringify(dict[key])}; `).join("")}}`;
	} else return Object.prototype.toString.call(unknown2);
	else if (flagUnsafeHas(tagFlag, tagFlagString)) return `"${unknown2}"`;
	else if (flagUnsafeHas(tagFlag, tagFlagBigint)) return `${unknown2}n`;
	else if (flagUnsafeHas(tagFlag, tagFlagFunction)) return `Function`;
	else return unknown2.toString();
};
var toExpression = /* @__NO_SIDE_EFFECTS__ */ (schema) => {
	if (schema.name !== U) return schema.name;
	else if (schema.const !== U) return stringify(schema.const);
	else if (schema.anyOf !== U) return [...new Set(schema.anyOf)].map(toExpression).join(" | ");
	else if (schema.format === "compactColumns") {
		const to = schema.to;
		if (to !== U) {
			const props = to.properties;
			if (props !== U) return `[${Object.keys(props).map((key) => {
				const propSchema = props[key];
				return `${/* @__PURE__ */ toExpression(propSchema)}[]`;
			}).join(", ")}]`;
			else return "unknown[][]";
		} else {
			const additionalItems = schema.additionalItems;
			if (additionalItems !== U && typeof additionalItems === "object") return `${/* @__PURE__ */ toExpression(additionalItems)}[]`;
			else return "unknown[][]";
		}
	} else if (schema.format !== U) return schema.format;
	else if (schema.type === objectTag) {
		const properties = schema.properties;
		const locations = Object.keys(properties);
		if (locations.length === 0) if (typeof schema.additionalItems === objectTag) {
			const additionalItems = schema.additionalItems;
			return `{ [key: string]: ${/* @__PURE__ */ toExpression(additionalItems)}; }`;
		} else return `{}`;
		else return `{ ${locations.map((location) => {
			return `${location}: ${/* @__PURE__ */ toExpression(properties[location])};`;
		}).join(" ")} }`;
	} else if (schema.type === nanTag) return "NaN";
	else if (schema.type === arrayTag) {
		const items = schema.items;
		if (typeof schema.additionalItems === objectTag) {
			const additionalItems = schema.additionalItems;
			const itemName = /* @__PURE__ */ toExpression(additionalItems);
			return (additionalItems.type === anyOfTag ? `(${itemName})` : itemName) + "[]";
		} else return `[${items.map((schema2) => /* @__PURE__ */ toExpression(schema2)).join(", ")}]`;
	} else if (schema.type === instanceTag) return schema.class.name;
	else return schema.type;
};
function Schema() {}
var schemaPrototype = /* @__PURE__ */ Object.create(null);
Object.defineProperty(schemaPrototype, "with", { value(fn, ...args) {
	return fn(this, ...args);
} });
Schema.prototype = schemaPrototype;
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
var valKey = "value";
var reversedKey = "r";
var SchemaCtor = Schema;
var baseSchema = (tag, selfReverse) => {
	const schema = new SchemaCtor();
	schema.type = tag;
	schema.seq = seq++;
	if (selfReverse) {
		valueOptions[valKey] = schema;
		Object.defineProperty(schema, reversedKey, valueOptions);
	}
	return schema;
};
var noopDecoder = (input) => {
	return input;
};
var factoryCache = {};
var cached = (key, tag, init) => {
	const existing = factoryCache[key];
	if (existing !== U) return existing;
	else {
		const schema = baseSchema(tag, true);
		init(schema);
		factoryCache[key] = schema;
		return schema;
	}
};
var unknown = baseSchema(unknownTag, true);
unknown.decoder = noopDecoder;
var copySchema = (schema) => {
	const c = Object.assign(new SchemaCtor(), schema);
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
		if (val.prev !== U) if (val.i === "") val.cp = `let ${v};` + val.cp;
		else val.cp = val.cp + `let ${v}=${val.i};`;
		else if (val.i === "") B_hoistDecl(val, v);
		else B_hoistDecl(val, `${v}=${val.i}`);
		val.v = _var;
		val.i = v;
		return v;
	}
}
var operationArgVar = "i";
var failInvalidType = (input) => {
	const em = input.e.errorMessage;
	return B_invalidInputBuilder(U, U, em !== U ? em.type !== U ? em.type : em._ : U)(input);
};
var B_embed = (b, value) => {
	const e = b.g.e;
	const l = e.length;
	e[l] = value;
	b.g.t++;
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
		reason: `Can't decode ${/* @__PURE__ */ toExpression(from)} to ${/* @__PURE__ */ toExpression(target)}. Use S.to to define a custom decoder`,
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
var B_makeInvalidInputDetails = (expected, received, path, input, includeInput, unionErrors, reasonOverride) => {
	let reasonRef = reasonOverride !== U ? reasonOverride : `Expected ${/* @__PURE__ */ toExpression(expected)}, received ${includeInput ? stringify(input) : /* @__PURE__ */ toExpression(received)}`;
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
	const details = {
		code: "invalid_input",
		expected,
		received,
		path,
		reason: reasonRef,
		unionErrors
	};
	if (includeInput) details.input = input;
	return details;
};
var B_invalidInputBuilder = (expected, extraPath = pathEmpty, reasonOverride, includeInput = true) => {
	return (input) => {
		const expected_ = expected !== U ? expected : input.e;
		const received = B_receivedSchema(input);
		const path = extraPath === pathEmpty ? input.path : /* @__PURE__ */ pathConcat(input.path, extraPath);
		return (value) => B_makeInvalidInputDetails(expected_, received, path, value, includeInput, U, reasonOverride);
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
		d: prev.d,
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
		if (checks.length > 0) if (valInput.prev !== U) {
			for (let i = 0; i < checks.length; i++) B_pushCheck(valInput, checks[i]);
			deferredInputChecks = U;
		} else deferredInputChecks = checks;
		else deferredInputChecks = U;
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
var B_mergeWithCatch = (val, catchFn, appendSafe) => {
	const valCode = B_merge(val);
	if (valCode === "" && !flagUnsafeHas(val.f, valFlagAsync)) return valCode + (appendSafe !== U ? appendSafe() : "");
	else {
		const errorVar = B_varWithoutAllocation(val.g);
		B_markThrow(val);
		const catchCode = `${catchFn(errorVar)};throw ${errorVar}`;
		if (flagUnsafeHas(val.f, valFlagAsync)) val.i = `${val.i}.catch(${errorVar}=>{${catchCode}})`;
		return `try{${valCode}${appendSafe !== U ? appendSafe() : ""}}catch(${errorVar}){${catchCode}}`;
	}
};
var B_mergeWithPathPrepend = (val, parent, locationVar, appendSafe) => {
	if (val.path === pathEmpty && locationVar === U) return B_merge(val);
	else return B_mergeWithCatch(val, (errorVar) => `${errorVar}.path=${parent.path === "" ? "" : `${inlinedValueFromString(parent.path)}+`}${locationVar !== U ? `'["'+${locationVar}+'"]'+` : ""}${errorVar}.path`, appendSafe);
};
function noopOperation(i) {
	return i;
}
noopOperation["embedded"] = immutableEmptyArray;
var int32FormatValidation = (inputVar) => {
	return `${inputVar}<=2147483647&&${inputVar}>=-2147483648&&${inputVar}%1===0`;
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
	if (flagUnsafeHas(inputTagFlag, tagFlagUnknown)) {
		const checks = [typeofCheck(numberTag)];
		if (input.e.format === "int32") checks.push(int32Check);
		else if (!flagUnsafeHas(input.g.o, flagDisableNanNumberValidation)) checks.push(notNanCheck);
		return B_refine(input, input.e, checks);
	} else if (flagUnsafeHas(inputTagFlag, tagFlagString)) {
		const output = B_nextVar(input, input.e);
		output.cp = `let ${output.i}=+${input.v()};`;
		output.vc = [{
			c: (_inputVar) => input.e.format === "int32" ? int32FormatValidation(output.i) : `!${nanCond(output.i)}`,
			f: failInvalidType
		}];
		return output;
	} else if (flagUnsafeHas(inputTagFlag, tagFlagNaN) && input.e.format !== "int32" && flagUnsafeHas(input.g.o, flagDisableNanNumberValidation)) return B_refine(input, input.e);
	else if (!flagUnsafeHas(inputTagFlag, tagFlagNumber)) return B_unsupportedDecode(input, input.s, input.e);
	else if (input.s.format !== input.e.format && input.e.format === "int32") return B_refine(input, input.e, [int32Check]);
	else return input;
};
var float = () => cached(numberTag, numberTag, (s2) => {
	s2.decoder = numberDecoder;
});
var inputToString = (input) => {
	return B_next(input, `""+${input.i}`, string());
};
var stringDecoderFn = (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	if (flagUnsafeHas(inputTagFlag, tagFlagUnknown)) return B_refineTypeofUnknown(input, stringTag);
	else if (flagUnsafeHas(inputTagFlag, tagFlagBoolean | tagFlagNumber | tagFlagBigint | tagFlagUndefined | tagFlagNull | tagFlagNaN) && isLiteral(input.s)) {
		const const_ = "" + input.s.const;
		const schema = baseSchema(stringTag, false);
		schema.const = const_;
		return B_next(input, `"${const_}"`, schema);
	} else if (flagUnsafeHas(inputTagFlag, tagFlagBoolean | tagFlagNumber | tagFlagBigint)) return inputToString(input);
	else if (!flagUnsafeHas(inputTagFlag, tagFlagString)) return B_unsupportedDecode(input, input.s, input.e);
	else return input;
};
var string = () => {
	return cached(stringTag, stringTag, (s2) => {
		s2.decoder = stringDecoderFn;
	});
};
var literalDecoder = (input) => {
	const expectedSchema = input.e;
	if (expectedSchema.noValidation && !input.u) return B_nextConst(input, expectedSchema);
	else if (isLiteral(input.s)) if (input.s.const === expectedSchema.const) return input;
	else return B_nextConst(input, expectedSchema);
	else {
		const schemaTagFlag = tagFlags[expectedSchema.type];
		if (flagUnsafeHas(tagFlags[input.s.type], tagFlagString) && flagUnsafeHas(schemaTagFlag, tagFlagBoolean | tagFlagNumber | tagFlagBigint | tagFlagUndefined | tagFlagNull | tagFlagNaN)) {
			const stringConstSchema = baseSchema(stringTag, false);
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
var unit = () => cached(undefinedTag, undefinedTag, (s2) => {
	s2.const = U;
	s2.decoder = literalDecoder;
});
var nullLiteral = () => cached(nullTag, nullTag, (s2) => {
	s2.const = null;
	s2.decoder = literalDecoder;
});
var nan = () => cached(nanTag, nanTag, (s2) => {
	s2.const = NaN;
	s2.decoder = literalDecoder;
});
var Literal_parse = (value) => {
	if (value === null) return nullLiteral();
	else {
		const tag = typeof value;
		if (tag === undefinedTag) return unit();
		else if (tag === numberTag && Number.isNaN(value)) return nan();
		else if (tag === objectTag) {
			const s2 = baseSchema(instanceTag, true);
			s2.class = value["constructor"];
			s2.const = value;
			s2.decoder = literalDecoder;
			return s2;
		} else {
			const s2 = baseSchema(tag, true);
			s2.const = value;
			s2.decoder = literalDecoder;
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
		if (loopInput.e["$defs"]) if (loopInput.g.d) Object.assign(loopInput.g.d, loopInput.e["$defs"]);
		else loopInput.g.d = loopInput.e["$defs"];
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
			const to = loopInput.e.to;
			if (loopInput.e.parser !== U) result = loopInput.e.parser(loopInput);
			else result = B_refine(result, U, U, to);
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
// @__NO_SIDE_EFFECTS__
function getDecoder(..._args) {
	const args = arguments;
	let idx = 0;
	let flag = U;
	let keyRef = "";
	let maxSeq = 0;
	let cacheTarget = U;
	while (flag === U) {
		const arg = args[idx];
		if (!arg) {
			const f = globalConfig.f;
			flag = f;
			keyRef = keyRef + "-" + f;
		} else if (typeof arg === numberTag) {
			const f = arg | globalConfig.f;
			flag = f;
			keyRef = keyRef + "-" + f;
		} else {
			const schema = arg;
			const seq2 = schema.seq;
			if (seq2 > maxSeq) {
				maxSeq = seq2;
				cacheTarget = schema;
			}
			keyRef = keyRef + seq2 + "-";
			idx = idx + 1;
		}
	}
	if (cacheTarget === U) return panic("No schema provided for decoder.");
	else {
		const key = keyRef;
		const cacheTargetRecord = cacheTarget;
		if (key in cacheTargetRecord) return cacheTargetRecord[key];
		else {
			let schema = args[idx - 1];
			for (let i = idx - 2; i >= 0; i--) {
				const to = schema;
				schema = updateOutput(args[i], (mut) => {
					mut.to = to;
				});
			}
			const f = compileDecoder(schema, schema, flag, U);
			valueOptions[valKey] = f;
			Object.defineProperty(cacheTarget, key, valueOptions);
			return f;
		}
	}
}
var nestedLoc = "BS_PRIVATE_NESTED_SOME_NONE";
var neverBuilderFn = (input) => {
	const output = B_refine(input, never_(), U, never_());
	output.cp = B_embedInvalidInput(input) + ";";
	return output;
};
var never_ = () => {
	return cached(neverTag, neverTag, (s2) => {
		s2.decoder = neverBuilderFn;
	});
};
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
	const to = schema.to;
	if (to !== U) if (to === schema || to.parser !== U || tagFlags[to.type] & unionBoundaryTags) traits |= 15;
	else if (!(to.noValidation === true || tagFlags[to.type] & tagFlagUnknown || unionRuntimeSame(schema, to) || to.type === anyOfTag && unionMask(to, 1) & tag)) traits |= 9;
	else traits |= unionTraits(to);
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
var unionFail = (schema, path, input, ...unionErrors) => B_throw(B_makeInvalidInputDetails(schema, unknown, path, input, true, unionErrors.length ? unionErrors : U));
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
	const narrow = baseSchema(schema.type, false);
	narrow.encoder = schema.encoder;
	if (tagFlag & tagFlagInstance) narrow.class = schema.class;
	else if (tagFlag & container) {
		narrow.additionalItems = unknown;
		if (tagFlag & tagFlagObject) narrow.properties = immutableEmptyObject;
		else narrow.items = immutableEmptyArray;
	} else if (tagFlag & (tagFlagNull | tagFlagUndefined | tagFlagNaN)) narrow.const = schema.const;
	narrow.decoder = (input) => {
		if (tagFlags[input.s.type] & tagFlagUnknown) return B_refine(input, input.e, [{
			c: (inputVar) => typeCheckCond(input, schema, inputVar),
			f: failInvalidType
		}]);
		if (unionRuntimeSame(input.s, narrow)) return tagFlag & container ? B_refine(input, input.e) : input;
		return schema.decoder(input);
	};
	return narrow;
};
var unionObjectish = tagFlagObject | tagFlagInstance;
var unionStructured = tagFlagObject | tagFlagArray | tagFlagInstance | tagFlagRef | tagFlagUnion;
var unionWiden = (tagFlag, nan3) => tagFlag | (tagFlag & unionObjectish ? unionObjectish : tagFlag & tagFlags[numberTag] ? nan3 : 0);
var unionMask = (schema, mode, nan3 = 0) => {
	if (mode === 2) {
		const defs = schema["$defs"];
		const ref = schema["$ref"];
		if (defs !== U && ref !== U) {
			const resolved = defs[ref.slice(ref.lastIndexOf("/") + 1)];
			if (resolved !== U && resolved !== schema) return unionMask(resolved, 1, nan3);
		}
	}
	const tagFlag = tagFlags[schema.type];
	if (!mode && tagFlag & tagFlagNever) return 0;
	if (mode && tagFlag & tagFlagUnion) {
		let mask = 0;
		const variants = schema.anyOf;
		for (let i = 0; i < variants.length; i++) mask |= unionMask(variants[i], 1, nan3);
		return mask;
	}
	return tagFlag & (tagFlagUnknown | tagFlagUnion | tagFlagRef) ? unionAnyTag : unionWiden(tagFlag, nan3);
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
	if (matched !== U && unmatched) unionInvalid(input, source, target, `${/* @__PURE__ */ toExpression(matched)} has the same type as the ${outputSide ? "target" : "source"} and the others don't`);
};
var unionUncovered = (input, source, target, variant) => unionInvalid(input, source, target, `${/* @__PURE__ */ toExpression(variant)} has no same-type variant on the other side`);
var unionInvalid = (input, from, to, why) => B_invalidOperation(input, `Invalid operation: can't convert ${/* @__PURE__ */ toExpression(from)} to ${/* @__PURE__ */ toExpression(to)} \u2014 ${why}. Use S.to to say what you mean, or S.never to mark a variant unreachable`);
var unionNormalize = (variants, source, skipUndefined, nan3) => {
	let flags = skipUndefined ? tagFlagUndefined : 0;
	const sourceLiteral = isLiteral(source);
	for (let i = 0; i < variants.length; i++) {
		const member = variants[i];
		if (sourceLiteral && isLiteral(member) && unionLiteralEqual(member.const, source.const)) flags |= tagFlagUnknown;
		flags |= tagFlags[member.type] & (tagFlagObject | tagFlags[numberTag]);
	}
	return {
		m: unionMask(source, 2, nan3),
		f: flags,
		t: tagFlags[source.type]
	};
};
var unionAnalyze = (normalized, variants, source, nan3) => {
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
		const inputMask = unionMask(s2, 1, nan3);
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
			r: tag & unionObjectish ? unionObjectish : tag & numberish ? numberish : unionWiden(tag, nan3),
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
			const conflict = d === U || key === false || key !== U && key !== d[0];
			if (key !== U && (conflict || values.has(d[1]))) {
				member.f |= unionMemberFalls;
				group.f |= 2;
			}
			if (conflict) key = false;
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
			else if (semantic !== false) if (semantic[0] !== key) later[route] = false;
			else for (const value of values) semantic[1].add(value);
		} else laterBroad |= group.m;
		laterMask |= group.m;
	}
	return plan;
};
var unionEmit = (input, self, plan, toPerCase) => {
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
	const compile = (member, source, target = source) => {
		const mark = input.g.t;
		const caseInput = B_scope(source);
		caseInput.u = true;
		caseInput.t = source.t;
		caseInput.io = false;
		caseInput.e = member.s;
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
	out.s = outputAnyOf.length ? unionFactory(outputAnyOf) : never_();
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
	if (initialTagFlag & tagFlagUnion || input.s.encoder === U && initialTagFlag & tagFlagRef) input.s = unknown;
	const source = input.s;
	const nan3 = flagUnsafeHas(input.g.o, flagDisableNanNumberValidation) ? tagFlagNaN : 0;
	const normalized = unionNormalize(variants, source, "fromDefault" in self, nan3);
	if (!(normalized.t & tagFlagUnknown) && !(normalized.f & tagFlagUnknown)) unionCheckPartial(input, source, self, variants, false);
	if (toPerCase !== U) {
		const perCase = unionTargetOwns(toPerCase) ? variants.map((v) => unionOutput(v).type === neverTag ? U : toPerCase) : unionResolve(input, self, variants, toPerCase);
		const attach = self.refiner !== U || self.inputRefiner !== U ? unionRefinerAttacher(self) : U;
		variants = variants.map((variant, idx) => {
			const to = perCase[idx];
			return to === U && attach === U ? variant : updateOutput(variant, (mut) => {
				if (attach !== U) attach(mut);
				if (to !== U) mut.to = to;
			});
		});
	}
	return unionEmit(input, self, unionPlan(unionAnalyze(normalized, variants, source, nan3)), toPerCase);
};
var unionRefinerAttacher = (self) => {
	const cached2 = [];
	return (mut) => {
		for (let i = 0; i < 2; i++) {
			const key = i ? "inputRefiner" : "refiner";
			const source = self[key];
			if (source !== U) {
				const current = mut[key];
				mut[key] = (input) => {
					const shared = cached2[i] || (cached2[i] = source(input));
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
	const mut = baseSchema(anyOfTag, false);
	mut.anyOf = anyOf;
	mut.has = has;
	mut.decoder = unionDecoder;
	mut.encoder = unionEncoder;
	mut.perVariant = input.s.perVariant;
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
	if (resolved.every((to) => to === U)) return input;
	return unionRewrite(input, (variant, idx) => {
		const to = resolved[idx];
		return to === U ? variant : updateOutput(variant, (mut) => {
			mut.to = to;
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
	const mut = baseSchema(anyOfTag, false);
	mut.anyOf = anyOf;
	mut.decoder = unionDecoder;
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
var isItemSchema = (x) => x !== U && typeof x !== "string";
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
var array = /* @__NO_SIDE_EFFECTS__ */ (item) => {
	const itemInternal = item;
	const mut = baseSchema(arrayTag, itemInternal.r === itemInternal);
	mut.additionalItems = itemInternal;
	mut.items = immutableEmptyArray;
	mut.decoder = arrayDecoder;
	return mut;
};
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
		if (!isArrayInput) schema = /* @__PURE__ */ array(unknown);
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
	if (isItemSchema(expectedAdditionalItems)) if (expectedAdditionalItems === unknown) output = input;
	else {
		const inputVar = input.v();
		const iteratorVar = B_varWithoutAllocation(input.g);
		const itemOutput = parseDynamic(B_dynamicScope(input, iteratorVar));
		const hasTransform = itemOutput.t;
		const output2 = hasTransform ? B_next(input, `new Array(${inputVar}.length)`, /* @__PURE__ */ array(itemOutput.s)) : B_refine(input, expectedSchema);
		const itemCode = B_mergeWithPathPrepend(itemOutput, input, iteratorVar, hasTransform ? () => B_addKey(output2, iteratorVar, itemOutput) : U);
		if (hasTransform || itemCode !== "") output2.cp = output2.cp + `for(let ${iteratorVar}=${expectedLength};${iteratorVar}<${inputVar}.length;++${iteratorVar}){${itemCode}}`;
		if (flagUnsafeHas(itemOutput.f, valFlagAsync)) output = B_asyncVal(output2, `Promise.all(${output2.i})`);
		else output = output2;
	}
	else {
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
			const mut = baseSchema(objectTag, false);
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
		const inputVar = input.v();
		const keyVar = B_varWithoutAllocation(input.g);
		const itemOutput = parseDynamic(B_dynamicScope(input, keyVar));
		const hasTransform = itemOutput.t;
		const output2 = hasTransform ? B_next(input, "{}", /* @__PURE__ */ dictFactory(itemOutput.s)) : B_refine(input, expectedSchema);
		const itemCode = B_mergeWithPathPrepend(itemOutput, input, keyVar, hasTransform ? () => B_addKey(output2, keyVar, itemOutput) : U);
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
var dictFactory = /* @__NO_SIDE_EFFECTS__ */ (item) => {
	const mut = baseSchema(objectTag, item.r === item);
	mut.properties = immutableEmptyObject;
	mut.additionalItems = item;
	mut.decoder = objectDecoder;
	return mut;
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
var optionFactory = (item, unitSchema = unit()) => {
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
						const properties2 = {};
						properties2[nestedLoc] = {
							...nestedSchema,
							const: nestedSchema.const + 1
						};
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
	return optionFactory(item, unit());
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
var invalidDateRefine = (input) => {
	return B_refine(input, input.e, [{
		c: (inputVar) => `!Number.isNaN(${inputVar}.getTime())`,
		f: failInvalidType
	}]);
};
var date = () => {
	return cached(instanceTag, instanceTag, (s2) => {
		s2.class = Date;
		s2.decoder = (input) => {
			const inputTagFlag = tagFlags[input.s.type];
			if (flagUnsafeHas(inputTagFlag, tagFlagString)) return invalidDateRefine(B_next(input, `new Date(${input.i})`, s2));
			else if (flagUnsafeHas(inputTagFlag, tagFlagUnknown)) return invalidDateRefine(instanceDecoder(input));
			else if (flagUnsafeHas(inputTagFlag, tagFlagInstance) && input.s.class === s2.class) return input;
			else return B_unsupportedDecode(input, input.s, input.e);
		};
		s2.encoder = (input, target) => {
			const toTagFlag = tagFlags[target.type];
			if (flagUnsafeHas(toTagFlag, tagFlagString)) {
				const dateTimeString = baseSchema(stringTag, false);
				dateTimeString.format = "date-time";
				return parse(B_next(input, `${input.i}.toISOString()`, dateTimeString, target));
			} else return input;
		};
	});
};
var definitionToSchema = (definition) => {
	return traverseDefinition(definition, (node) => {
		if (isSchemaObject(node)) return node;
		else return U;
	});
};
var traverseDefinition = (definition, onNode) => {
	if (typeof definition === objectTag && definition !== null) {
		const s2 = onNode(definition);
		if (s2 !== U) return s2;
		else if (Array.isArray(definition)) {
			const node = definition;
			for (let idx = 0; idx < node.length; idx++) node[idx] = traverseDefinition(node[idx], onNode);
			const items = node;
			const mut = baseSchema(arrayTag, false);
			mut.items = items;
			mut.additionalItems = "strict";
			mut.decoder = arrayDecoder;
			return mut;
		} else {
			const proto = Object.getPrototypeOf(definition);
			if (proto !== null && proto !== Object.prototype) {
				const mut = baseSchema(instanceTag, true);
				mut.class = definition["constructor"];
				mut.const = definition;
				mut.decoder = literalDecoder;
				return mut;
			} else {
				const node = definition;
				const fieldNames = Object.keys(node);
				const length2 = fieldNames.length;
				for (let idx = 0; idx < length2; idx++) {
					const location = fieldNames[idx];
					node[location] = traverseDefinition(node[location], onNode);
				}
				const mut = baseSchema(objectTag, false);
				mut.required = fieldNames;
				mut.properties = node;
				mut.additionalItems = globalConfig.a;
				mut.decoder = objectDecoder;
				return mut;
			}
		}
	} else return Literal_parse(definition);
};
var schemaFactory = /* @__NO_SIDE_EFFECTS__ */ (definition) => {
	return definitionToSchema(definition);
};
var assertNumber = (fnName, n) => {
	if (typeof n !== numberTag || Number.isNaN(n)) throw new SuryError({
		code: "invalid_operation",
		path: pathEmpty,
		reason: `[S.${fnName}] Expected number, received ${stringify(n)}`
	});
};
var intMin = (schema, minValue, maybeMessage) => {
	assertNumber("min", minValue);
	const message = maybeMessage ?? `Number must be greater than or equal to ${minValue}`;
	return internalRefine(schema, (mut) => {
		mut.minimum = minValue;
		getMutErrorMessage(mut)["minimum"] = message;
		return (_input) => {
			return [{
				c: (inputVar) => `${inputVar}>${minValue - 1}`,
				f: B_failWithErrorMessage("minimum", message)
			}];
		};
	});
};
var intMax = (schema, maxValue, maybeMessage) => {
	assertNumber("max", maxValue);
	const message = maybeMessage ?? `Number must be lower than or equal to ${maxValue}`;
	return internalRefine(schema, (mut) => {
		mut.maximum = maxValue;
		getMutErrorMessage(mut)["maximum"] = message;
		return (_input) => {
			return [{
				c: (inputVar) => `${inputVar}<${maxValue + 1}`,
				f: B_failWithErrorMessage("maximum", message)
			}];
		};
	});
};
var floatMin = (schema, minValue, maybeMessage) => {
	assertNumber("min", minValue);
	const message = maybeMessage ?? `Number must be greater than or equal to ${minValue}`;
	return internalRefine(schema, (mut) => {
		mut.minimum = minValue;
		getMutErrorMessage(mut)["minimum"] = message;
		return (input) => {
			return [{
				c: (inputVar) => `${inputVar}>=${B_embed(input, minValue)}`,
				f: B_failWithErrorMessage("minimum", message)
			}];
		};
	});
};
var floatMax = (schema, maxValue, maybeMessage) => {
	assertNumber("max", maxValue);
	const message = maybeMessage ?? `Number must be lower than or equal to ${maxValue}`;
	return internalRefine(schema, (mut) => {
		mut.maximum = maxValue;
		getMutErrorMessage(mut)["maximum"] = message;
		return (input) => {
			return [{
				c: (inputVar) => `${inputVar}<=${B_embed(input, maxValue)}`,
				f: B_failWithErrorMessage("maximum", message)
			}];
		};
	});
};
var arrayMinLength = (schema, length2, maybeMessage) => {
	assertNumber("min", length2);
	const message = maybeMessage ?? `Array must be ${length2} or more items long`;
	return internalRefine(schema, (mut) => {
		mut.minItems = length2;
		getMutErrorMessage(mut)["minItems"] = message;
		return (_input) => {
			return [{
				c: (inputVar) => `${inputVar}.length>${length2 - 1}`,
				f: B_failWithErrorMessage("minItems", message)
			}];
		};
	});
};
var arrayMaxLength = (schema, length2, maybeMessage) => {
	assertNumber("max", length2);
	const message = maybeMessage ?? `Array must be ${length2} or fewer items long`;
	return internalRefine(schema, (mut) => {
		mut.maxItems = length2;
		getMutErrorMessage(mut)["maxItems"] = message;
		return (_input) => {
			return [{
				c: (inputVar) => `${inputVar}.length<${length2 + 1}`,
				f: B_failWithErrorMessage("maxItems", message)
			}];
		};
	});
};
var stringMinLength = (schema, length2, maybeMessage) => {
	assertNumber("min", length2);
	const message = maybeMessage ?? `String must be ${length2} or more characters long`;
	return internalRefine(schema, (mut) => {
		mut.minLength = length2;
		getMutErrorMessage(mut)["minLength"] = message;
		return (_input) => {
			return [{
				c: (inputVar) => `${inputVar}.length>${length2 - 1}`,
				f: B_failWithErrorMessage("minLength", message)
			}];
		};
	});
};
var stringMaxLength = (schema, length2, maybeMessage) => {
	assertNumber("max", length2);
	const message = maybeMessage ?? `String must be ${length2} or fewer characters long`;
	return internalRefine(schema, (mut) => {
		mut.maxLength = length2;
		getMutErrorMessage(mut)["maxLength"] = message;
		return (_input) => {
			return [{
				c: (inputVar) => `${inputVar}.length<${length2 + 1}`,
				f: B_failWithErrorMessage("maxLength", message)
			}];
		};
	});
};
var url = () => {
	return cached("url", stringTag, (s2) => {
		const urlValidator = (s3) => {
			try {
				new URL(s3);
				return true;
			} catch {
				return false;
			}
		};
		s2.decoder = stringDecoderFn;
		s2.format = "url";
		s2.refiner = (input) => {
			return [{
				c: (inputVar) => `${B_embed(input, urlValidator)}(${inputVar})`,
				f: B_failWithErrorMessage("format")
			}];
		};
	});
};
var standardJSONSchemaConverter;
var getStandardJSONSchema = (schema, options, isOutput) => {
	if (standardJSONSchemaConverter !== U) return standardJSONSchemaConverter(schema, options, isOutput);
	else throw new SuryError({
		code: "invalid_operation",
		path: pathEmpty,
		reason: "~standard.jsonSchema requires S.enableStandardJSONSchema() to be called first"
	});
};
Object.defineProperty(schemaPrototype, "~standard", { get: function() {
	const schema = this;
	const standard = {
		version: 1,
		vendor,
		validate: (input) => {
			try {
				return { value: (/* @__PURE__ */ getDecoder(unknown, schema))(input) };
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
var js_parser = /* @__NO_SIDE_EFFECTS__ */ (...args) => /* @__PURE__ */ getDecoder(unknown, ...args);
var js_union = /* @__NO_SIDE_EFFECTS__ */ (values) => unionFactory(values.map(definitionToSchema));
var min = /* @__NO_SIDE_EFFECTS__ */ (schema, minValue, maybeMessage) => {
	switch (schema.type) {
		case stringTag: return stringMinLength(schema, minValue, maybeMessage);
		case arrayTag: return arrayMinLength(schema, minValue, maybeMessage);
		case numberTag: return schema.format === "int32" || schema.format === "port" ? intMin(schema, minValue, maybeMessage) : floatMin(schema, minValue, maybeMessage);
		default: return panic(`S.min is not supported for ${/* @__PURE__ */ toExpression(schema)} schema. Coerce the schema to string, number or array using S.to first.`);
	}
};
var max = /* @__NO_SIDE_EFFECTS__ */ (schema, maxValue, maybeMessage) => {
	switch (schema.type) {
		case stringTag: return stringMaxLength(schema, maxValue, maybeMessage);
		case arrayTag: return arrayMaxLength(schema, maxValue, maybeMessage);
		case numberTag: return schema.format === "int32" || schema.format === "port" ? intMax(schema, maxValue, maybeMessage) : floatMax(schema, maxValue, maybeMessage);
		default: return panic(`S.max is not supported for ${/* @__PURE__ */ toExpression(schema)} schema. Coerce the schema to string, number or array using S.to first.`);
	}
};
var string2 = /* @__PURE__ */ string();
var _number = /* @__PURE__ */ float();
var date2 = /* @__PURE__ */ date();
//#endregion
//#region ../schemas/libraries/sury/download.ts
const imageSchema = /* @__PURE__ */ schemaFactory({
	id: _number,
	created: date2,
	title: /* @__PURE__ */ min(/* @__PURE__ */ max(string2, 100), 1),
	type: /* @__PURE__ */ js_union(["jpg", "png"]),
	size: _number,
	url: /* @__PURE__ */ url()
});
(/* @__PURE__ */ js_parser(/* @__PURE__ */ schemaFactory({
	id: _number,
	created: date2,
	title: /* @__PURE__ */ min(/* @__PURE__ */ max(string2, 100), 1),
	brand: /* @__PURE__ */ min(/* @__PURE__ */ max(string2, 30), 1),
	description: /* @__PURE__ */ min(/* @__PURE__ */ max(string2, 500), 1),
	price: /* @__PURE__ */ min(/* @__PURE__ */ max(_number, 1e4), 1),
	discount: /* @__PURE__ */ js_union([/* @__PURE__ */ min(/* @__PURE__ */ max(_number, 100), 1), null]),
	quantity: /* @__PURE__ */ min(/* @__PURE__ */ max(_number, 10), 0),
	tags: /* @__PURE__ */ array(/* @__PURE__ */ min(/* @__PURE__ */ max(string2, 30), 1)),
	images: /* @__PURE__ */ array(imageSchema),
	ratings: /* @__PURE__ */ array(/* @__PURE__ */ schemaFactory({
		id: _number,
		stars: /* @__PURE__ */ min(/* @__PURE__ */ max(_number, 5), 0),
		title: /* @__PURE__ */ min(/* @__PURE__ */ max(string2, 100), 1),
		text: /* @__PURE__ */ min(/* @__PURE__ */ max(string2, 1e3), 1),
		images: /* @__PURE__ */ array(imageSchema)
	}))
})))({});
//#endregion
