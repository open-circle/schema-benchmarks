//#region ../node_modules/.pnpm/sury@11.0.0-alpha.10/node_modules/sury/src/S.mjs
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
var unionTag = "union";
var neverTag = "never";
var unknownTag = "unknown";
var refTag = "ref";
var tagFlagUnknown = 1;
var tagFlagString = 2;
var tagFlagNumber = 4;
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
var tagFlags = {
	[unknownTag]: 1,
	[stringTag]: 2,
	[numberTag]: 4,
	[booleanTag]: 8,
	[undefinedTag]: 16,
	[nullTag]: 32,
	[objectTag]: 64,
	[arrayTag]: 128,
	[unionTag]: 256,
	[refTag]: 512,
	[bigintTag]: 1024,
	[nanTag]: 2048,
	[functionTag]: 4096,
	[instanceTag]: 8192,
	[neverTag]: 32768,
	[symbolTag]: 16384
};
var flagNone = 0;
var flagAsync = 1;
var flagDisableNanNumberValidation = 2;
var flagUnsafeHas = (acc, flag) => {
	return (acc & flag) !== 0;
};
var valFlagNone = 0;
var valFlagAsync = 1;
var vendor = "sury";
var s = /* @__PURE__ */ Symbol(vendor);
vendor + "";
var immutableEmptyArray = [];
var immutableEmptyObject = /* @__PURE__ */ Object.create(null);
var isSchemaObject = (obj) => {
	return !!obj["~standard"];
};
var constField = "const";
var isLiteral = (schema) => {
	return constField in schema;
};
var isOptional = (schema) => {
	return schema.type === undefinedTag || schema.type === unionTag && undefinedTag in schema.has;
};
var stringify = (unknown2) => {
	const tagFlag = tagFlags[typeof unknown2];
	if (flagUnsafeHas(tagFlag, tagFlagUndefined)) return undefinedTag;
	else if (flagUnsafeHas(tagFlag, tagFlagObject)) if (unknown2 === null) return nullTag;
	else if (Array.isArray(unknown2)) return `[${unknown2.map(stringify).join(", ")}]`;
	else if (unknown2.constructor === Object) {
		const dict2 = unknown2;
		return `{ ${Object.keys(dict2).map((key) => `${key}: ${stringify(dict2[key])}; `).join("")}}`;
	} else return Object.prototype.toString.call(unknown2);
	else if (flagUnsafeHas(tagFlag, tagFlagString)) return `"${unknown2}"`;
	else if (flagUnsafeHas(tagFlag, tagFlagBigint)) return `${unknown2}n`;
	else if (flagUnsafeHas(tagFlag, tagFlagFunction)) return `Function`;
	else return unknown2.toString();
};
var toExpression = (schema) => {
	if (schema.name !== void 0) return schema.name;
	else if (schema.const !== void 0) return stringify(schema.const);
	else if (schema.anyOf !== void 0) return schema.anyOf.map(toExpression).join(" | ");
	else if (schema.format === "compactColumns") {
		const to = schema.to;
		if (to !== void 0) {
			const props = to.properties;
			if (props !== void 0) return `[${Object.keys(props).map((key) => {
				const propSchema = props[key];
				return `${toExpression(propSchema)}[]`;
			}).join(", ")}]`;
			else return "unknown[][]";
		} else {
			const additionalItems = schema.additionalItems;
			if (additionalItems !== void 0 && typeof additionalItems === "object") return `${toExpression(additionalItems)}[]`;
			else return "unknown[][]";
		}
	} else if (schema.format !== void 0) return schema.format;
	else if (schema.type === objectTag) {
		const properties = schema.properties;
		const locations = Object.keys(properties);
		if (locations.length === 0) if (typeof schema.additionalItems === objectTag) {
			const additionalItems = schema.additionalItems;
			return `{ [key: string]: ${toExpression(additionalItems)}; }`;
		} else return `{}`;
		else return `{ ${locations.map((location) => {
			return `${location}: ${toExpression(properties[location])};`;
		}).join(" ")} }`;
	} else if (schema.type === nanTag) return "NaN";
	else if (schema.type === arrayTag) {
		const items = schema.items;
		if (typeof schema.additionalItems === objectTag) {
			const additionalItems = schema.additionalItems;
			const itemName = toExpression(additionalItems);
			return (additionalItems.type === unionTag ? `(${itemName})` : itemName) + "[]";
		} else return `[${items.map((schema2) => toExpression(schema2)).join(", ")}]`;
	} else if (schema.type === instanceTag) return schema.class.name;
	else return schema.type;
};
function Schema() {}
var schemaPrototype = /* @__PURE__ */ Object.create(null);
Object.defineProperty(schemaPrototype, "with", { get() {
	return (fn, ...args) => fn(this, ...args);
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
	d: void 0,
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
	if (existing !== void 0) return existing;
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
	while (mut.to !== void 0) {
		const next = copySchema(mut.to);
		mut.to = next;
		mut = next;
	}
	fn(mut);
	return root;
};
var pathEmpty = "";
var pathDynamic = "[]";
var inlinedValueFromString = (str) => {
	return str.includes("\"") || str.includes("\n") ? JSON.stringify(str) : `"${str}"`;
};
var pathFromInlinedLocation = (inlinedLocation) => {
	return `[${inlinedLocation}]`;
};
var pathToArray = (path) => {
	return path === "" ? [] : JSON.parse(path.split(`"]["`).join(`","`));
};
var pathConcat = (path, concatedPath) => {
	return path + concatedPath;
};
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
		if (val.prev !== void 0) if (val.i === "") val.cp = `let ${v};` + val.cp;
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
	return B_invalidInputBuilder(void 0, void 0, em !== void 0 ? em.type !== void 0 ? em.type : em._ : void 0)(input);
};
var B_embed = (b, value) => {
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
	else if (flagUnsafeHas(tagFlag, 28672)) return B_embed(b, schema.const);
	else return const_;
};
var B_inlineLocation = (global2, location) => {
	const key = `"${location}"`;
	const cached2 = global2[key];
	if (cached2 !== void 0) return cached2;
	else {
		const inlinedLocation = inlinedValueFromString(location);
		global2[key] = inlinedLocation;
		return inlinedLocation;
	}
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
		cp: "",
		hd: "",
		v: _var,
		i: operationArgVar,
		f: valFlagNone,
		s: schema,
		e: expected,
		path: pathEmpty,
		g: {
			d: defs,
			o: flag,
			e: [],
			v: -1
		}
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
		reason: `Can't decode ${toExpression(from)} to ${toExpression(target)}. Use S.to to define a custom decoder`,
		path: b.path
	});
};
var B_failWithArg = (b, fn, arg) => {
	return `${B_embed(b, (arg2) => {
		B_throw(fn(arg2));
	})}(${arg})`;
};
var B_receivedSchema = (val) => {
	return val.prev !== void 0 ? val.prev.s : val.s;
};
var B_makeInvalidInputDetails = (expected, received, path, input, includeInput, unionErrors, reasonOverride) => {
	let reasonRef = reasonOverride !== void 0 ? reasonOverride : `Expected ${toExpression(expected)}, received ${includeInput ? stringify(input) : toExpression(received)}`;
	if (unionErrors !== void 0) {
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
		const expected_ = expected !== void 0 ? expected : input.e;
		const received = B_receivedSchema(input);
		const path = extraPath === pathEmpty ? input.path : pathConcat(input.path, extraPath);
		return (value) => B_makeInvalidInputDetails(expected_, received, path, value, includeInput, void 0, reasonOverride);
	};
};
var B_failWithErrorMessage = (key, defaultMessage) => {
	return (input) => {
		const em = input.e.errorMessage;
		const override = em !== void 0 ? em[key] !== void 0 ? em[key] : em["_"] : void 0;
		const m = override !== void 0 ? override : defaultMessage;
		if (m !== void 0) return B_invalidInputBuilder(void 0, void 0, m)(input);
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
var B_merge = (val, hoistCond) => {
	let current = val;
	let code = "";
	while (current !== void 0) {
		const val2 = current;
		current = val2.prev;
		let currentCode = "";
		if (val2.vc) {
			if (hoistCond !== void 0 && B_isHoistable(val2)) {
				const inputVar = current.v();
				const allChecks = val2.vc;
				let localHoist = "";
				for (let i = 0; i < allChecks.length; i++) {
					const check = allChecks[i];
					const condCode = check.c(inputVar);
					if (check.f === failInvalidType) if (localHoist) localHoist = `${localHoist}&&${condCode}`;
					else localHoist = condCode;
					else if (val2.e.noValidation !== true) currentCode = currentCode + `${condCode}||${B_failWithArg(val2, check.f(val2), inputVar)};`;
				}
				if (localHoist) {
					const cond = hoistCond;
					if (cond.contents) cond.contents = `${localHoist}&&${cond.contents}`;
					else cond.contents = localHoist;
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
		prev,
		v: _notVar,
		i: initial,
		f: valFlagNone,
		s: schema,
		e: expected,
		cp: "",
		hd: "",
		path: prev.path,
		g: prev.g,
		t: true,
		d: prev.d
	};
};
var B_refine = (val, schema = val.s, checks, expected = val.e) => {
	const shouldLink = val.v !== _var;
	const nextVal = {
		prev: val,
		i: val.i,
		v: shouldLink ? _prevVar : _var,
		f: val.f,
		s: schema,
		e: expected,
		cp: "",
		hd: "",
		vc: checks,
		path: val.path,
		g: val.g,
		t: val.t,
		d: val.d
	};
	if (shouldLink) B_linkVar(val, nextVal);
	return nextVal;
};
var B_pushCheck = (val, check) => {
	if (val.vc !== void 0) val.vc.push(check);
	else val.vc = [check];
};
var B_markOutput = (val, valInput) => {
	let deferredInputChecks;
	const inputRefiner = valInput.e.inputRefiner;
	if (inputRefiner !== void 0) {
		const checks = inputRefiner(valInput);
		if (checks.length > 0) if (valInput.prev !== void 0) {
			for (let i = 0; i < checks.length; i++) B_pushCheck(valInput, checks[i]);
			deferredInputChecks = void 0;
		} else deferredInputChecks = checks;
		else deferredInputChecks = void 0;
	} else deferredInputChecks = void 0;
	let outputChecks;
	const refiner = val.e.refiner;
	if (refiner !== void 0) {
		const checks = refiner(val);
		outputChecks = checks.length > 0 ? checks : void 0;
	} else outputChecks = void 0;
	let result;
	if (deferredInputChecks !== void 0 && outputChecks !== void 0) result = B_refine(val, void 0, deferredInputChecks.concat(outputChecks));
	else if (deferredInputChecks !== void 0) result = B_refine(val, void 0, deferredInputChecks);
	else if (outputChecks !== void 0) result = B_refine(val, void 0, outputChecks);
	else result = val;
	result.io = true;
	return result;
};
var B_hoistChildChecks = (parent, child, key) => {
	if (child.vc) {
		const pathAppend = pathFromInlinedLocation(B_inlineLocation(parent.g, key));
		child.vc.forEach((check) => {
			B_pushCheck(parent, {
				c: (inputVar) => check.c(inputVar + pathAppend),
				f: check.f
			});
		});
		child.vc = void 0;
	}
};
var B_dynamicScope = (from, locationVar) => {
	const schemaAdditionalItems = from.s.additionalItems;
	const expectedAdditionalItems = from.e.additionalItems;
	return {
		v: _notVarBeforeValidation,
		i: `${from.v()}[${locationVar}]`,
		f: from.f,
		s: schemaAdditionalItems !== void 0 && typeof schemaAdditionalItems !== "string" ? schemaAdditionalItems : unknown,
		e: expectedAdditionalItems !== void 0 && typeof expectedAdditionalItems !== "string" ? expectedAdditionalItems : unknown,
		cp: "",
		hd: "",
		p: from,
		path: pathEmpty,
		g: from.g
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
		i: val.i,
		s: val.s,
		e: val.e,
		f: flagNone,
		path: val.path,
		g: val.g,
		v: shouldLink ? _bondVar : _var,
		b: val,
		cp: "",
		hd: "",
		u: false,
		t: false,
		io: val.io,
		d: val.d
	};
	if (shouldLink) B_linkVar(val, nextVal);
	return nextVal;
};
var B_mergeWithCatch = (val, catchFn, appendSafe) => {
	const valCode = B_merge(val);
	if (valCode === "" && !flagUnsafeHas(val.f, valFlagAsync)) return valCode + (appendSafe !== void 0 ? appendSafe() : "");
	else {
		const errorVar = B_varWithoutAllocation(val.g);
		const catchCode = `${catchFn(errorVar)};throw ${errorVar}`;
		if (flagUnsafeHas(val.f, valFlagAsync)) val.i = `${val.i}.catch(${errorVar}=>{${catchCode}})`;
		return `try{${valCode}${appendSafe !== void 0 ? appendSafe() : ""}}catch(${errorVar}){${catchCode}}`;
	}
};
var B_mergeWithPathPrepend = (val, parent, locationVar, appendSafe) => {
	if (val.path === pathEmpty && locationVar === void 0) return B_merge(val);
	else return B_mergeWithCatch(val, (errorVar) => `${errorVar}.path=${parent.path === "" ? "" : `${inlinedValueFromString(parent.path)}+`}${locationVar !== void 0 ? `'["'+${locationVar}+'"]'+` : ""}${errorVar}.path`, appendSafe);
};
function noopOperation(i) {
	return i;
}
noopOperation["embedded"] = immutableEmptyArray;
var int32FormatValidation = (inputVar) => {
	return `${inputVar}<=2147483647&&${inputVar}>=-2147483648&&${inputVar}%1===0`;
};
var typeofCond = (tag) => (inputVar) => `typeof ${inputVar}==="${tag}"`;
var nanCond = (inputVar) => `Number.isNaN(${inputVar})`;
var isArrayCond = (inputVar) => `Array.isArray(${inputVar})`;
var objectTagCond = (inputVar) => `${typeofCond(objectTag)(inputVar)}&&${inputVar}`;
var instanceofCond = (b, class_) => (inputVar) => `${inputVar} instanceof ${B_embed(b, class_)}`;
var B_refineTypeofUnknown = (input, tag) => {
	return B_refine(input, input.e, [{
		c: typeofCond(tag),
		f: failInvalidType
	}]);
};
var B_nextVar = (input, expected) => {
	const output = B_next(input, B_varWithoutAllocation(input.g), expected);
	output.v = _var;
	return output;
};
var numberDecoder = (input) => {
	const inputTagFlag = tagFlags[input.s.type];
	if (flagUnsafeHas(inputTagFlag, tagFlagUnknown)) {
		const checks = [{
			c: typeofCond(numberTag),
			f: failInvalidType
		}];
		if (input.e.format === "int32") checks.push({
			c: int32FormatValidation,
			f: failInvalidType
		});
		else if (!flagUnsafeHas(input.g.o, flagDisableNanNumberValidation)) checks.push({
			c: (inputVar) => `!${nanCond(inputVar)}`,
			f: failInvalidType
		});
		return B_refine(input, input.e, checks);
	} else if (flagUnsafeHas(inputTagFlag, tagFlagString)) {
		const output = B_nextVar(input, input.e);
		output.cp = `let ${output.i}=+${input.v()};`;
		output.vc = [{
			c: (_inputVar) => input.e.format === "int32" ? int32FormatValidation(output.i) : `!${nanCond(output.i)}`,
			f: failInvalidType
		}];
		return output;
	} else if (!flagUnsafeHas(inputTagFlag, tagFlagNumber)) return B_unsupportedDecode(input, input.s, input.e);
	else if (input.s.format !== input.e.format && input.e.format === "int32") return B_refine(input, input.e, [{
		c: int32FormatValidation,
		f: failInvalidType
	}]);
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
	else if (flagUnsafeHas(inputTagFlag, 3132) && isLiteral(input.s)) {
		const const_ = "" + input.s.const;
		const schema = baseSchema(stringTag, false);
		schema.const = const_;
		return B_next(input, `"${const_}"`, schema);
	} else if (flagUnsafeHas(inputTagFlag, 1036)) return inputToString(input);
	else if (!flagUnsafeHas(inputTagFlag, tagFlagString)) return B_unsupportedDecode(input, input.s, input.e);
	else return input;
};
var string = () => {
	return cached(stringTag, stringTag, (s2) => {
		s2.decoder = stringDecoderFn;
	});
};
var setHas = (has, tag) => {
	has[flagUnsafeHas(tagFlags[tag], 768) ? unknownTag : tag] = true;
};
var jsonName = `JSON`;
var literalDecoder = (input) => {
	const expectedSchema = input.e;
	if (expectedSchema.noValidation && !input.u) return B_nextConst(input, expectedSchema);
	else if (isLiteral(input.s)) if (input.s.const === expectedSchema.const) return input;
	else return B_nextConst(input, expectedSchema);
	else {
		const schemaTagFlag = tagFlags[expectedSchema.type];
		if (flagUnsafeHas(tagFlags[input.s.type], tagFlagString) && flagUnsafeHas(schemaTagFlag, 3132)) {
			const stringConstSchema = baseSchema(stringTag, false);
			stringConstSchema.const = "" + expectedSchema.const;
			const stringConstVal = B_nextConst(input, stringConstSchema, stringConstSchema);
			stringConstVal.vc = [{
				c: (inputVar) => `${inputVar}==="${stringConstSchema.const}"`,
				f: failInvalidType
			}];
			return B_nextConst(stringConstVal, expectedSchema, expectedSchema);
		} else if (flagUnsafeHas(schemaTagFlag, tagFlagNaN)) return B_refine(input, expectedSchema, [{
			c: nanCond,
			f: failInvalidType
		}]);
		else return B_refine(input, expectedSchema, [{
			c: (inputVar) => `${inputVar}===${B_inlineConst(input, expectedSchema)}`,
			f: failInvalidType
		}]);
	}
};
var unit = () => cached(undefinedTag, undefinedTag, (s2) => {
	s2.const = void 0;
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
	let appliedEncoderRef = void 0;
	let loopCount = 0;
	while (!result.io || result.e.to) {
		const appliedEncoder = appliedEncoderRef;
		appliedEncoderRef = void 0;
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
			else result = B_refine(loopInput, operationOutput.s, void 0, operationOutput.e);
			result.f |= valFlagAsync;
			result.io = true;
		} else if (loopInput.io) {
			const to = loopInput.e.to;
			if (loopInput.e.parser !== void 0) result = loopInput.e.parser(loopInput);
			else result = B_refine(result, void 0, void 0, to);
		} else {
			const maybeEncoder = loopInput.s.encoder;
			if (maybeEncoder && maybeEncoder !== appliedEncoder && loopInput.s !== loopInput.e && loopInput.e.type !== unknownTag) result = maybeEncoder(loopInput, loopInput.e);
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
		error.path = pathConcat(input.p !== void 0 ? input.p.path : pathEmpty, pathConcat(pathConcat(input.path, pathDynamic), error.path));
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
	if (schema.to !== void 0) return getOutputSchema(schema.to);
	else return schema;
};
function getDecoder(..._args) {
	const args = arguments;
	let idx = 0;
	let flag = void 0;
	let keyRef = "";
	let maxSeq = 0;
	let cacheTarget = void 0;
	while (flag === void 0) {
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
	if (cacheTarget === void 0) return panic("No schema provided for decoder.");
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
			const f = compileDecoder(schema, schema, flag, void 0);
			valueOptions[valKey] = f;
			Object.defineProperty(cacheTarget, key, valueOptions);
			return f;
		}
	}
}
var nestedLoc = "BS_PRIVATE_NESTED_SOME_NONE";
var neverBuilderFn = (input) => {
	const output = B_refine(input, void 0, void 0, never_());
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
		const typeofCheck = typeofCond(numberTag)(inputVar);
		if (flagUnsafeHas(input.g.o, flagDisableNanNumberValidation)) return typeofCheck;
		else return `${typeofCheck}&&!${nanCond(inputVar)}`;
	} else if (flagUnsafeHas(tagFlag, tagFlagNaN)) return nanCond(inputVar);
	else if (flagUnsafeHas(tagFlag, 48)) return `${inputVar}===${B_inlineConst(input, schema)}`;
	else if (flagUnsafeHas(tagFlag, 17418)) return typeofCond(schema.type)(inputVar);
	else return "";
};
var isItemSchema = (x) => x !== void 0 && typeof x !== "string";
var makeObjectVal = (prev, schema) => {
	return {
		prev,
		v: _notVar,
		i: "",
		f: valFlagNone,
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
		e: prev.e,
		d: /* @__PURE__ */ Object.create(null),
		t: true,
		cp: "",
		hd: "",
		path: prev.path,
		g: prev.g
	};
};
var completeObjectVal = (objectVal) => {
	const isArray = objectVal.s.type === arrayTag;
	let inline = "";
	let promiseAllContent = "";
	let optionalSettingCode = void 0;
	const keys = Object.keys(objectVal.d);
	for (let idx = 0; idx < keys.length; idx++) {
		const key = keys[idx];
		const val = objectVal.d[key];
		if (flagUnsafeHas(val.f, valFlagAsync)) promiseAllContent = promiseAllContent + val.i + ",";
		if (val.o) {
			const existingFn = optionalSettingCode;
			optionalSettingCode = (objectVar) => {
				return (existingFn === void 0 ? "" : existingFn(objectVar)) + `if(${val.v()}!==void 0){${objectVar}[${B_inlineLocation(objectVal.g, key)}]=${val.i}}`;
			};
		} else inline = inline + (isArray ? `${val.i}` : `${B_inlineLocation(objectVal.g, key)}:${val.i}`) + ",";
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
	} else if (optionalSettingCode === void 0) return valWithRequired;
	else {
		const code = optionalSettingCode(valWithRequired.v());
		const output = B_refine(valWithRequired);
		output.cp = output.cp + code;
		return output;
	}
};
var array = (item) => {
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
	if (flagUnsafeHas(unknownInputTagFlag, 129)) {
		const isArrayInput = flagUnsafeHas(unknownInputTagFlag, tagFlagArray);
		let schema;
		if (!isArrayInput) schema = array(unknown);
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
		const output2 = hasTransform ? B_next(input, `new Array(${inputVar}.length)`, array(itemOutput.s)) : B_refine(input, expectedSchema);
		const itemCode = B_mergeWithPathPrepend(itemOutput, input, iteratorVar, hasTransform ? () => B_addKey(output2, iteratorVar, itemOutput) : void 0);
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
	if (flagUnsafeHas(unknownInputTagFlag, 65)) {
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
			if (expectedSchema.additionalItems !== "strip") checks.push({
				c: (inputVar) => `!${isArrayCond(inputVar)}`,
				f: failInvalidType
			});
		}
		if (checks.length > 0) input = B_refine(unknownInput, schema, checks);
		else input = B_refine(unknownInput, schema);
	} else input = B_unsupportedDecode(unknownInput, unknownInput.s, expectedSchema);
	const expectedAdditionalItems = expectedSchema.additionalItems;
	const dictItem = isItemSchema(expectedAdditionalItems) ? expectedAdditionalItems : void 0;
	const inputAdditionalItems = input.s.additionalItems;
	const sourceIsDict = isItemSchema(inputAdditionalItems);
	let output;
	if (dictItem !== void 0 && dictItem === unknown) output = input;
	else if (dictItem !== void 0 && sourceIsDict) {
		const inputVar = input.v();
		const keyVar = B_varWithoutAllocation(input.g);
		const itemOutput = parseDynamic(B_dynamicScope(input, keyVar));
		const hasTransform = itemOutput.t;
		const output2 = hasTransform ? B_next(input, "{}", dictFactory(itemOutput.s)) : B_refine(input, expectedSchema);
		const itemCode = B_mergeWithPathPrepend(itemOutput, input, keyVar, hasTransform ? () => B_addKey(output2, keyVar, itemOutput) : void 0);
		if (hasTransform || itemCode !== "") output2.cp = output2.cp + `for(let ${keyVar} in ${inputVar}){${itemCode}}`;
		if (flagUnsafeHas(itemOutput.f, valFlagAsync)) {
			const resolveVar = B_varWithoutAllocation(output2.g);
			const rejectVar = B_varWithoutAllocation(output2.g);
			const asyncParseResultVar = B_varWithoutAllocation(output2.g);
			const counterVar = B_varWithoutAllocation(output2.g);
			const outputVar = output2.v();
			output = B_asyncVal(output2, `new Promise((${resolveVar},${rejectVar})=>{let ${counterVar}=Object.keys(${outputVar}).length;for(let ${keyVar} in ${outputVar}){${outputVar}[${keyVar}].then(${asyncParseResultVar}=>{${outputVar}[${keyVar}]=${asyncParseResultVar};if(${counterVar}--===1){${resolveVar}(${outputVar})}},${rejectVar})}})`);
		} else output = output2;
	} else if (dictItem !== void 0) {
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
			if (isJsonParent && schema.type === unionTag && schema.has[undefinedTag]) itemInput.i = `(${itemInput.i}??null)`;
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
				objectVal.cp = objectVal.cp + `${keyVar}!==${B_inlineLocation(input.g, key)}`;
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
	const mut = baseSchema(objectTag, item.r === item);
	mut.properties = immutableEmptyObject;
	mut.additionalItems = item;
	mut.decoder = objectDecoder;
	return mut;
};
var unionToKey = (schema) => {
	return flagUnsafeHas(tagFlags[schema.type], tagFlagInstance) ? schema.class["name"] : schema.type;
};
var unionIsPriority = (tagFlag, byKey) => {
	return flagUnsafeHas(tagFlag, 8320) && objectTag in byKey || flagUnsafeHas(tagFlag, tagFlagNaN) && numberTag in byKey;
};
var unionIsSelfDecodeNoop = (schema) => {
	const additionalItems = schema.additionalItems;
	return schema.to === void 0 && schema.parser === void 0 && !flagUnsafeHas(tagFlags[schema.type], tagFlagRef) && (schema.anyOf !== void 0 ? schema.anyOf.every(unionIsSelfDecodeNoop) : true) && (schema.items !== void 0 ? schema.items.every(unionIsSelfDecodeNoop) : true) && (schema.properties !== void 0 ? Object.values(schema.properties).every(unionIsSelfDecodeNoop) : true) && (additionalItems !== void 0 && typeof additionalItems !== "string" ? unionIsSelfDecodeNoop(additionalItems) : true);
};
var unionIsWiderSchema = (schemaAnyOf, inputAnyOf) => {
	return inputAnyOf.every((inputSchema, idx) => {
		const schema = schemaAnyOf[idx];
		if (schema !== void 0) return !flagUnsafeHas(tagFlags[inputSchema.type], 9152) && inputSchema.type === schema.type && inputSchema.const === schema.const && inputSchema.to === void 0;
		else return false;
	});
};
var unionGetToPerCase = (schema) => {
	return schema.parser === void 0 && schema.to !== void 0 ? schema.to : void 0;
};
var unionCanDispatchPerVariant = (inputAnyOf, target) => {
	return !flagUnsafeHas(tagFlags[getOutputSchema(target).type], tagFlagRef) && !(target.type === unionTag && target.anyOf.some((v) => flagUnsafeHas(tagFlags[v.type], tagFlagRef))) && !inputAnyOf.some((v) => v.to !== void 0 || v.parser !== void 0 || flagUnsafeHas(tagFlags[v.type], tagFlagRef));
};
var unionPerVariantVal = (input, target) => {
	return B_refine(input, unknown, void 0, updateOutput(input.s, (mut) => {
		mut.to = target;
	}));
};
var unionEncoder = (input, target) => {
	const inputAnyOf = input.s.anyOf;
	if (target.type === unionTag && unionGetToPerCase(target) === void 0 && unionIsWiderSchema(target.anyOf, inputAnyOf)) return input;
	else if (unionCanDispatchPerVariant(inputAnyOf, target)) return unionPerVariantVal(input, target);
	else return input;
};
var unionDecoder = (input) => {
	const selfSchema = input.e;
	let schemas = selfSchema.anyOf;
	const initialInputTagFlag = tagFlags[input.s.type];
	const toPerCase = unionGetToPerCase(selfSchema);
	if (input.s === selfSchema && toPerCase === void 0 && schemas.every(unionIsSelfDecodeNoop) || flagUnsafeHas(initialInputTagFlag, tagFlagUnion) && unionIsWiderSchema(schemas, input.s.anyOf) && toPerCase === void 0 || input.io && input.e === input.s) return input;
	else {
		if (flagUnsafeHas(initialInputTagFlag, tagFlagUnion) || input.s.encoder === void 0 && flagUnsafeHas(initialInputTagFlag, tagFlagRef)) input.s = unknown;
		let activeKeyRef = "";
		if (!flagUnsafeHas(initialInputTagFlag, 769)) {
			const sourceKey = unionToKey(input.s);
			let hasNull = false;
			let hasUndefined = false;
			const len = schemas.length;
			let i = 0;
			while (activeKeyRef === "" && i < len) {
				const s2 = schemas[i];
				if (unionToKey(s2) === sourceKey) activeKeyRef = sourceKey;
				else if (s2.type === nullTag) hasNull = true;
				else if (s2.type === undefinedTag) hasUndefined = true;
				i = i + 1;
			}
			if (activeKeyRef === "") {
				if (flagUnsafeHas(initialInputTagFlag, tagFlagUndefined) && hasNull) activeKeyRef = nullTag;
				else if (flagUnsafeHas(initialInputTagFlag, tagFlagNull) && hasUndefined) activeKeyRef = undefinedTag;
			}
		}
		const activeKey = activeKeyRef;
		const initialInline = input.i;
		const fail = (caught2) => {
			return `${B_embed(input, function() {
				const args = arguments;
				B_throw(B_makeInvalidInputDetails(selfSchema, unknown, input.path, args[0], true, args.length > 1 ? Array.from(args).slice(1) : void 0));
			})}(${input.v()}${caught2})`;
		};
		const output = B_refine(input);
		const outputAnyOf = [];
		let staticBlockFailure = "";
		const getArrItemsCode = (arr, isDeopt) => {
			const typeValidationInput = arr[0];
			const typeValidationOutput = arr[1];
			let itemStart = "";
			let itemEnd = "";
			let itemNextElse = false;
			let itemNoop = "";
			let caught2 = "";
			let byDiscriminant = {};
			const preItems = 2;
			let itemIdx = preItems;
			const lastIdx2 = arr.length - 1;
			while (itemIdx <= lastIdx2) {
				const input2 = B_scope(typeValidationOutput);
				input2.u = true;
				input2.t = typeValidationOutput.t;
				input2.io = false;
				input2.e = arr[itemIdx];
				const isLast = itemIdx === lastIdx2;
				const isFirst = itemIdx === preItems;
				const isOnlyCase = isFirst && isLast;
				let withExhaustiveCheck = !isOnlyCase;
				let itemSkipped = false;
				let itemCodeRef = "";
				const itemCondRef = { contents: "" };
				try {
					const itemOutput = parse(input2);
					outputAnyOf.push(itemOutput.s);
					itemCodeRef = B_merge(itemOutput, itemCondRef);
					if (itemOutput.t) {
						output.t = true;
						if (flagUnsafeHas(itemOutput.f, valFlagAsync)) output.f |= valFlagAsync;
						const itemVar = typeValidationInput.v();
						if (itemOutput.i !== itemVar) itemCodeRef = itemCodeRef + `${itemVar}=${itemOutput.i}`;
					}
				} catch (exn) {
					const errorVar = B_embed(input2, getOrRethrow(exn));
					caught2 = `${caught2},${errorVar}`;
					if (isDeopt && isOnlyCase) {
						staticBlockFailure = errorVar;
						itemSkipped = true;
					} else if (isLast) {
						withExhaustiveCheck = false;
						itemCodeRef = isDeopt ? "throw " + errorVar : fail(caught2);
					} else itemSkipped = true;
				}
				const itemCond = itemCondRef.contents;
				const itemCode = itemCodeRef;
				if (!itemSkipped && itemCond) if (itemCode) {
					const existing = byDiscriminant[itemCond];
					if (existing !== void 0) if (Array.isArray(existing)) existing.push(itemCode);
					else byDiscriminant[itemCond] = [existing, itemCode];
					else byDiscriminant[itemCond] = itemCode;
				} else itemNoop = itemNoop ? `${itemNoop}||${itemCond}` : itemCond;
				if (!itemSkipped && (!itemCond || isLast)) {
					const accedDiscriminants = Object.keys(byDiscriminant);
					for (let idx = 0; idx < accedDiscriminants.length; idx++) {
						const discrim = accedDiscriminants[idx];
						itemStart = itemStart + (itemNextElse ? "else if" : "if") + `(${discrim}){`;
						const entry = byDiscriminant[discrim];
						if (!Array.isArray(entry)) itemStart = itemStart + entry + "}";
						else {
							let caught3 = "";
							for (let idx2 = 0; idx2 < entry.length; idx2++) {
								const code = entry[idx2];
								const errorVar = `e` + idx2;
								itemStart = itemStart + `try{${code}}catch(${errorVar}){`;
								caught3 = `${caught3},${errorVar}`;
							}
							itemStart = itemStart + fail(caught3) + "}".repeat(entry.length) + "}";
						}
						itemNextElse = true;
					}
					byDiscriminant = {};
				}
				if (!itemSkipped && !itemCond) if (!itemCode) {
					itemNoop = "";
					itemIdx = lastIdx2;
					withExhaustiveCheck = false;
				} else {
					if (itemNoop) {
						itemStart = itemStart + (itemNextElse ? "else if" : "if") + `(!(${itemNoop})){`;
						itemEnd = "}" + itemEnd;
						itemNoop = "";
						itemNextElse = false;
					}
					if (isLast && (isDeopt || !withExhaustiveCheck || isFirst)) {
						itemStart = itemStart + `${itemNextElse ? "else{" : ""}${itemCode}`;
						itemEnd = (itemNextElse ? "}" : "") + itemEnd;
					} else {
						const errorVar = `e` + (itemIdx - preItems);
						itemStart = itemStart + `${itemNextElse ? "else{" : ""}try{${itemCode}}catch(${errorVar}){`;
						itemEnd = (itemNextElse ? "}" : "") + "}" + itemEnd;
						caught2 = `${caught2},${errorVar}`;
						itemNextElse = false;
					}
				}
				if (isLast) {
					if (itemNoop) if (itemStart || caught2) itemStart = itemStart + (itemNextElse ? "else if" : "if") + `(!(${itemNoop})){${fail(caught2)}}`;
					else B_pushCheck(typeValidationOutput, {
						c: (_inputVar) => `(${itemNoop})`,
						f: failInvalidType
					});
					else if (withExhaustiveCheck) {
						const errorCode = fail(caught2);
						itemStart = itemStart + (itemNextElse ? `else{${errorCode}}` : errorCode);
					}
				}
				itemIdx = itemIdx + 1;
			}
			return itemStart + itemEnd;
		};
		let start = "";
		let end = "";
		let caught = "";
		let exit = false;
		const lastIdx = schemas.length - 1;
		let byKey = {};
		let keys = [];
		const appendUnionRefiners = (() => {
			const unionRefiner = selfSchema.refiner;
			const unionInputRefiner = selfSchema.inputRefiner;
			const cachedRefinerChecks = { contents: void 0 };
			const cachedInputRefinerChecks = { contents: void 0 };
			const attach = (current, source, cache) => {
				if (source === void 0) return current;
				else {
					const fn = source;
					const getCached = (input2) => {
						if (cache.contents !== void 0) return cache.contents;
						else {
							const checks = fn(input2);
							cache.contents = checks;
							return checks;
						}
					};
					if (current === void 0) return getCached;
					else {
						const existing = current;
						return (input2) => {
							const arr = existing(input2);
							const next = getCached(input2);
							for (let i = 0; i < next.length; i++) arr.push(next[i]);
							return arr;
						};
					}
				}
			};
			return (mut) => {
				const r = attach(mut.refiner, unionRefiner, cachedRefinerChecks);
				if (r !== void 0) mut.refiner = r;
				const ir = attach(mut.inputRefiner, unionInputRefiner, cachedInputRefinerChecks);
				if (ir !== void 0) mut.inputRefiner = ir;
			};
		})();
		if (isLiteral(input.s)) {
			const matching = [];
			const rest = [];
			for (let idx = 0; idx <= lastIdx; idx++) {
				const schema = schemas[idx];
				if (isLiteral(schema) && schema.const === input.s.const) matching.push(schema);
				else rest.push(schema);
			}
			schemas = matching.concat(rest);
		}
		for (let idx = 0; idx <= lastIdx; idx++) {
			const schema = toPerCase !== void 0 ? updateOutput(schemas[idx], (mut) => {
				appendUnionRefiners(mut);
				mut.to = toPerCase;
			}) : schemas[idx];
			const tagFlag = tagFlags[schema.type];
			const key = unionToKey(schema);
			if (activeKey !== "" && activeKey !== key) {} else if (flagUnsafeHas(tagFlag, tagFlagUndefined) && "fromDefault" in selfSchema) {} else {
				const initialArr = byKey[key];
				if (initialArr !== void 0) {
					const arr = initialArr;
					if (flagUnsafeHas(tagFlag, tagFlagObject) && nestedLoc in schema.properties) arr.splice(arr.length - 1, 0, schema);
					else if (!flagUnsafeHas(tagFlag, 2096)) arr.push(schema);
				} else {
					const typeValidationInput = B_scope(input);
					if (flagUnsafeHas(tagFlag, 37633)) typeValidationInput.e = unknown;
					else {
						const narrow = baseSchema(schema.type, false);
						narrow.encoder = schema.encoder;
						if (flagUnsafeHas(tagFlag, tagFlagInstance)) narrow.class = schema.class;
						else if (flagUnsafeHas(tagFlag, tagFlagObject)) {
							narrow.properties = immutableEmptyObject;
							narrow.additionalItems = unknown;
						} else if (flagUnsafeHas(tagFlag, tagFlagArray)) {
							narrow.additionalItems = unknown;
							narrow.items = immutableEmptyArray;
						} else if (flagUnsafeHas(tagFlag, 2096)) narrow.const = schema.const;
						narrow.decoder = (input2) => {
							if (flagUnsafeHas(tagFlags[input2.s.type], tagFlagUnknown)) return B_refine(input2, input2.e, [{
								c: (inputVar) => typeCheckCond(input2, schema, inputVar),
								f: failInvalidType
							}]);
							else return schema.decoder(input2);
						};
						typeValidationInput.e = narrow;
					}
					let typeValidationOutput;
					try {
						typeValidationOutput = parse(typeValidationInput);
					} catch (_) {
						typeValidationInput.vc = void 0;
						typeValidationOutput = typeValidationInput;
					}
					if (unionIsPriority(tagFlag, byKey)) keys.unshift(key);
					else keys.push(key);
					byKey[key] = [
						typeValidationInput,
						typeValidationOutput,
						schema
					];
					let shouldDeopt = true;
					let valRef = typeValidationOutput;
					while (valRef !== void 0 && shouldDeopt) {
						const v = valRef;
						valRef = v.prev;
						shouldDeopt = !(v.vc && B_isHoistable(v));
					}
					if (shouldDeopt) {
						for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
							const key2 = keys[keyIdx];
							if (!exit) {
								const arr = byKey[key2];
								const typeValidationOutput2 = arr[1];
								const itemsCode = getArrItemsCode(arr, true);
								const blockCode = B_merge(typeValidationOutput2) + itemsCode;
								const embeddedError = staticBlockFailure;
								if (embeddedError) {
									staticBlockFailure = "";
									if (blockCode) {
										const errorVar = `e` + (idx + keyIdx);
										start = start + `try{${blockCode}throw ${embeddedError}}catch(${errorVar}){`;
										end = "}" + end;
										caught = `${caught},${errorVar}`;
									} else caught = `${caught},${embeddedError}`;
								} else if (blockCode) {
									const errorVar = `e` + (idx + keyIdx);
									start = start + `try{${blockCode}}catch(${errorVar}){`;
									end = "}" + end;
									caught = `${caught},${errorVar}`;
								} else exit = true;
							}
						}
						byKey = {};
						keys = [];
					}
				}
			}
		}
		if (!exit) {
			let nextElse = false;
			let noop2 = "";
			for (let idx = 0; idx < keys.length; idx++) {
				const arr = byKey[keys[idx]];
				const typeValidationOutput = arr[1];
				const firstSchema = arr[2];
				const itemsCode = getArrItemsCode(arr, false);
				const blockCondRef = { contents: "" };
				const blockCode = B_merge(typeValidationOutput, blockCondRef) + itemsCode;
				const blockCond = blockCondRef.contents;
				if (blockCode || unionIsPriority(tagFlags[firstSchema.type], byKey)) {
					start = start + (nextElse ? "else if" : "if") + `(${blockCond}){${blockCode}}`;
					nextElse = true;
				} else noop2 = noop2 ? `${noop2}||${blockCond}` : blockCond;
			}
			const errorCode = fail(caught);
			start = start + (noop2 ? (nextElse ? "else if" : "if") + `(!(${noop2})){${errorCode}}` : nextElse ? `else{${errorCode}}` : end === "" ? errorCode + ";" : errorCode);
		}
		output.cp = output.cp + start + end;
		if (input.i !== output.i) output.i = input.i;
		let o;
		if (flagUnsafeHas(output.f, valFlagAsync)) {
			output.i = `Promise.resolve(${output.i})`;
			output.v = _notVar;
			o = output;
		} else if (output.v === _var) if (input.cp === "" && output.cp === "" && initialInline === "i") {
			input.hd = "";
			input.v = _notVar;
			input.i = initialInline;
			o = input;
		} else o = output;
		else o = output;
		o.s = outputAnyOf.length ? unionFactory(outputAnyOf) : never_();
		if (toPerCase !== void 0) {
			o.io = true;
			o.e = getOutputSchema(toPerCase);
		} else o.e = selfSchema;
		return o;
	}
};
var unionFactory = (schemas) => {
	if (schemas.length === 0) return panic("S.union requires at least one item");
	else if (schemas.length === 1) return schemas[0];
	else {
		const has = {};
		const anyOf = /* @__PURE__ */ new Set();
		schemas.forEach((schema) => {
			if (schema.type === unionTag && schema.to === void 0) {
				schema.anyOf.forEach((item) => {
					anyOf.add(item);
				});
				Object.assign(has, schema.has);
			} else {
				anyOf.add(schema);
				setHas(has, schema.type);
			}
		});
		const mut = baseSchema(unionTag, false);
		mut.anyOf = Array.from(anyOf);
		mut.decoder = unionDecoder;
		mut.encoder = unionEncoder;
		mut.has = has;
		return mut;
	}
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
	else if (out.type === unionTag) {
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
				} else if (schemaOut.properties !== void 0) {
					const nestedSchema = schemaOut.properties[nestedLoc];
					if (nestedSchema !== void 0) toPush = updateOutput(schema, (mut2) => {
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
var option = (item) => {
	return optionFactory(item, unit());
};
var valGet = (parent, location) => {
	let vals;
	if (parent.d !== void 0) vals = parent.d;
	else {
		const d = /* @__PURE__ */ Object.create(null);
		parent.d = d;
		vals = d;
	}
	const existing = vals[location];
	if (existing !== void 0) return B_scope(existing);
	else {
		let locationSchema;
		if (parent.s.type === objectTag) locationSchema = parent.s.properties[location];
		else locationSchema = parent.s.items[Number(location)];
		let schema;
		if (locationSchema !== void 0) schema = locationSchema;
		else {
			const additionalItems = parent.s.additionalItems;
			if (isItemSchema(additionalItems)) {
				const s2 = additionalItems;
				if (parent.s.type === objectTag && s2.type !== unknownTag && !flagUnsafeHas(tagFlags[s2.type], tagFlagRef) && !isOptional(s2)) schema = option(s2);
				else schema = s2;
			} else schema = B_unsupportedDecode(parent, parent.s, parent.e);
		}
		const pathAppend = pathFromInlinedLocation(B_inlineLocation(parent.g, location));
		const item = {
			v: _notVarAtParent,
			i: isLiteral(schema) ? B_inlineConst(parent, schema) : `${parent.v()}${pathAppend}`,
			f: valFlagNone,
			s: schema,
			e: schema,
			cp: "",
			hd: "",
			path: pathConcat(parent.path, pathAppend),
			g: parent.g,
			p: parent
		};
		vals[location] = item;
		return item;
	}
};
var standardJSONSchemaConverter;
var getStandardJSONSchema = (schema, options, isOutput) => {
	if (standardJSONSchemaConverter !== void 0) return standardJSONSchemaConverter(schema, options, isOutput);
	else throw new SuryError({
		code: "invalid_operation",
		path: pathEmpty,
		reason: "~standard.jsonSchema requires S.enableStandardJSONSchema() to be called first"
	});
};
Object.defineProperty(schemaPrototype, "~standard", { get: function() {
	const schema = this;
	return {
		version: 1,
		vendor,
		validate: (input) => {
			try {
				return { value: getDecoder(unknown, schema)(input) };
			} catch (exn) {
				const error = getOrRethrow(exn);
				return { issues: [{
					message: error.reason,
					path: error.path === pathEmpty ? void 0 : pathToArray(error.path)
				}] };
			}
		},
		jsonSchema: {
			input: (options) => getStandardJSONSchema(schema, options, false),
			output: (options) => getStandardJSONSchema(schema, options, true)
		}
	};
} });
var internalRefine = (schema, makeRefiner) => {
	return updateOutput(schema, (mut) => {
		const refiner = makeRefiner(mut);
		const existingRefiner = mut.refiner;
		if (existingRefiner !== void 0) mut.refiner = (input) => {
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
		else return;
	});
};
var traverseDefinition = (definition, onNode) => {
	if (typeof definition === objectTag && definition !== null) {
		const s2 = onNode(definition);
		if (s2 !== void 0) return s2;
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
var schemaFactory = (definition) => {
	return definitionToSchema(definition);
};
var js_parser = (...args) => getDecoder(unknown, ...args);
var js_union = (values) => unionFactory(values.map(definitionToSchema));
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
var min = (schema, minValue, maybeMessage) => {
	switch (schema.type) {
		case stringTag: return stringMinLength(schema, minValue, maybeMessage);
		case arrayTag: return arrayMinLength(schema, minValue, maybeMessage);
		case numberTag: return schema.format === "int32" || schema.format === "port" ? intMin(schema, minValue, maybeMessage) : floatMin(schema, minValue, maybeMessage);
		default: return panic(`S.min is not supported for ${toExpression(schema)} schema. Coerce the schema to string, number or array using S.to first.`);
	}
};
var max = (schema, maxValue, maybeMessage) => {
	switch (schema.type) {
		case stringTag: return stringMaxLength(schema, maxValue, maybeMessage);
		case arrayTag: return arrayMaxLength(schema, maxValue, maybeMessage);
		case numberTag: return schema.format === "int32" || schema.format === "port" ? intMax(schema, maxValue, maybeMessage) : floatMax(schema, maxValue, maybeMessage);
		default: return panic(`S.max is not supported for ${toExpression(schema)} schema. Coerce the schema to string, number or array using S.to first.`);
	}
};
var string2 = /* @__PURE__ */ string();
var _number = /* @__PURE__ */ float();
var date2 = /* @__PURE__ */ date();
var url2 = /* @__PURE__ */ url();
//#endregion
//#region ../schemas/libraries/sury/download.ts
const imageSchema = schemaFactory({
	id: _number,
	created: date2,
	title: min(max(string2, 100), 1),
	type: js_union(["jpg", "png"]),
	size: _number,
	url: url2
});
const ratingSchema = schemaFactory({
	id: _number,
	stars: min(max(_number, 5), 0),
	title: min(max(string2, 100), 1),
	text: min(max(string2, 1e3), 1),
	images: array(imageSchema)
});
js_parser(schemaFactory({
	id: _number,
	created: date2,
	title: min(max(string2, 100), 1),
	brand: min(max(string2, 30), 1),
	description: min(max(string2, 500), 1),
	price: min(max(_number, 1e4), 1),
	discount: js_union([min(max(_number, 100), 1), null]),
	quantity: min(max(_number, 10), 0),
	tags: array(min(max(string2, 30), 1)),
	images: array(imageSchema),
	ratings: array(ratingSchema)
}))({});
//#endregion
