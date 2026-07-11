//#region ../node_modules/.pnpm/sury@11.0.0-alpha.9/node_modules/sury/src/Sury.res.mjs
let idMap = {};
function create(str) {
	let v = idMap[str];
	if (v !== void 0) {
		let id = v + 1 | 0;
		idMap[str] = id;
		return str + ("/" + id);
	}
	idMap[str] = 1;
	return str;
}
let immutableEmpty = {};
let immutableEmpty$1 = [];
let copy = ((d) => ({ ...d }));
function fromString(string) {
	let _idx = 0;
	while (true) {
		let idx = _idx;
		let match = string[idx];
		if (match === void 0) return `"` + string + `"`;
		switch (match) {
			case "\"":
			case "\n": return JSON.stringify(string);
			default:
				_idx = idx + 1 | 0;
				continue;
		}
	}
}
function toArray(path) {
	if (path === "") return [];
	else return JSON.parse(path.split(`"]["`).join(`","`));
}
let vendor = "sury";
let s = Symbol(vendor);
let stringTag = "string";
let numberTag = "number";
let bigintTag = "bigint";
let booleanTag = "boolean";
let symbolTag = "symbol";
let nullTag = "null";
let undefinedTag = "undefined";
let nanTag = "nan";
let instanceTag = "instance";
let arrayTag = "array";
let objectTag = "object";
let unionTag = "union";
let neverTag = "never";
let unknownTag = "unknown";
let refTag = "ref";
let Exn = /* @__PURE__ */ create("Sury.Exn");
let constField = "const";
function isOptional(schema) {
	if (schema.type === undefinedTag) return true;
	else if (schema.type === unionTag) return undefinedTag in schema.has;
	else return false;
}
function has(acc, flag) {
	return (acc & flag) !== 0;
}
let flags = {
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
	["function"]: 4096,
	[instanceTag]: 8192,
	[neverTag]: 32768,
	[symbolTag]: 16384
};
function stringify(unknown) {
	let tagFlag = flags[typeof unknown];
	if (tagFlag & 16) return undefinedTag;
	if (!(tagFlag & 64)) if (tagFlag & 2) return `"` + unknown + `"`;
	else if (tagFlag & 1024) return unknown + `n`;
	else if (tagFlag & 4096) return `Function`;
	else return unknown.toString();
	if (unknown === null) return nullTag;
	if (Array.isArray(unknown)) {
		let string = "[";
		for (let i = 0, i_finish = unknown.length; i < i_finish; ++i) {
			if (i !== 0) string = string + ", ";
			string = string + stringify(unknown[i]);
		}
		return string + "]";
	}
	if (unknown.constructor !== Object) return Object.prototype.toString.call(unknown);
	let keys = Object.keys(unknown);
	let string$1 = "{ ";
	for (let i$1 = 0, i_finish$1 = keys.length; i$1 < i_finish$1; ++i$1) {
		let key = keys[i$1];
		let value = unknown[key];
		string$1 = string$1 + key + `: ` + stringify(value) + `; `;
	}
	return string$1 + "}";
}
function toExpression(schema) {
	let tag = schema.type;
	let to = schema.to;
	let $$const = schema.const;
	let name = schema.name;
	if (name !== void 0) return name;
	if ($$const !== void 0) return stringify($$const);
	let format = schema.format;
	let anyOf = schema.anyOf;
	if (anyOf !== void 0) return anyOf.map(toExpression).join(" | ");
	if (format !== void 0) {
		if (format !== "compactColumns") return format;
		let additionalItems = schema.additionalItems;
		if (to === void 0) if (additionalItems !== void 0 && additionalItems !== "strip" && additionalItems !== "strict") return toExpression(additionalItems) + `[]`;
		else return "unknown[][]";
		let props = to.properties;
		if (props === void 0) return "unknown[][]";
		return `[` + Object.keys(props).map((key) => {
			let propSchema = props[key];
			return toExpression(propSchema) + `[]`;
		}).join(", ") + `]`;
	}
	switch (tag) {
		case "nan": return "NaN";
		case "object":
			let additionalItems$1 = schema.additionalItems;
			let properties = schema.properties;
			let locations = Object.keys(properties);
			if (locations.length === 0) if (typeof additionalItems$1 === objectTag) return `{ [key: string]: ` + toExpression(additionalItems$1) + `; }`;
			else return `{}`;
			else return `{ ` + locations.map((location) => location + `: ` + toExpression(properties[location]) + `;`).join(" ") + ` }`;
		default:
			if (schema.b) return tag;
			switch (tag) {
				case "instance": return schema.class.name;
				case "array":
					let additionalItems$2 = schema.additionalItems;
					let items = schema.items;
					if (typeof additionalItems$2 !== objectTag) return `[` + items.map(toExpression).join(", ") + `]`;
					let itemName = toExpression(additionalItems$2);
					return (additionalItems$2.type === unionTag ? `(` + itemName + `)` : itemName) + "[]";
				default: return tag;
			}
	}
}
var SuryError = class extends Error {
	constructor(params) {
		super();
		for (let key in params) this[key] = params[key];
	}
};
var d = Object.defineProperty;
var p = SuryError.prototype;
d(p, "message", { get() {
	return message(this);
} });
d(p, "name", { value: "SuryError" });
d(p, "s", { value: s });
d(p, "_1", { get() {
	return this;
} });
d(p, "RE_EXN_ID", { value: Exn });
var seq = 1;
var Schema = function() {};
var sp = Object.create(null);
d(sp, "with", { get() {
	return (fn, ...args) => fn(this, ...args);
} });
Schema.prototype = sp;
function getOrRethrow(exn) {
	if (exn && exn.s === s) return exn;
	throw exn;
}
function message(error) {
	let nonEmptyPath = error.path;
	return (nonEmptyPath === "" ? "" : `Failed at ` + nonEmptyPath + `: `) + error.reason;
}
let globalConfig = {
	m: message,
	d: void 0,
	a: "strip",
	f: 0
};
let valueOptions = {};
let valKey = "value";
let reversedKey = "r";
function base(tag, selfReverse) {
	let s = new Schema();
	s.type = tag;
	s.seq = seq++;
	if (selfReverse) {
		valueOptions[valKey] = s;
		d(s, reversedKey, valueOptions);
	}
	return s;
}
function noopDecoder(input) {
	return input;
}
let factoryCache = {};
function cached(key, tag, init) {
	if (factoryCache[key]) return factoryCache[key];
	let s = base(tag, true);
	init(s);
	factoryCache[key] = s;
	return s;
}
let unknown = base(unknownTag, true);
unknown.decoder = noopDecoder;
let copySchema = ((schema) => {
	let c = new Schema();
	for (let k in schema) c[k] = schema[k];
	c.seq = seq++;
	return c;
});
function updateOutput(schema, fn) {
	let root = copySchema(schema);
	let mut = root;
	while (mut.to) {
		let next = copySchema(mut.to);
		mut.to = next;
		mut = next;
	}
	fn(mut);
	return root;
}
let $$class = SuryError;
function make(prim) {
	return new SuryError(prim);
}
let $$Error = {
	$$class,
	make
};
function embed(b, value) {
	let e = b.g.e;
	let l = e.length;
	e[l] = value;
	return `e[` + l + `]`;
}
function inlineConst(b, schema) {
	let tagFlag = flags[schema.type];
	let $$const = schema.const;
	if (tagFlag & 16) return "void 0";
	else if (tagFlag & 2) return fromString($$const);
	else if (tagFlag & 1024) return $$const + "n";
	else if (tagFlag & 28672) return embed(b, schema.const);
	else return $$const;
}
function inlineLocation(global, location) {
	let key = `"` + location + `"`;
	let i = global[key];
	if (i !== void 0) return i;
	let inlinedLocation = fromString(location);
	global[key] = inlinedLocation;
	return inlinedLocation;
}
function _var() {
	return this.i;
}
function _bondVar() {
	return this.b.v();
}
function _prevVar() {
	return this.prev.v();
}
function varWithoutAllocation(global) {
	let newCounter = global.v + 1;
	global.v = newCounter;
	return `v` + newCounter;
}
function hoistDecl(owner, decl) {
	owner.hd = owner.hd === "" ? decl : owner.hd + "," + decl;
}
function _notVarBeforeValidation() {
	let val = this;
	let v = varWithoutAllocation(val.g);
	val.cp = `let ` + v + `=` + val.i + `;`;
	val.i = v;
	val.v = _var;
	return v;
}
function _notVarAtParent() {
	let val = this;
	let parent = val.p;
	if (parent.fz) {
		val.v = _var;
		return val.i;
	}
	let v = varWithoutAllocation(val.g);
	hoistDecl(parent, v + `=` + val.i);
	val.v = _var;
	val.i = v;
	return v;
}
function _notVar() {
	let val = this;
	if (val.fz) {
		val.v = _var;
		val.i = `(` + val.i + `)`;
		return val.i;
	}
	let v = varWithoutAllocation(val.g);
	if (val.prev !== void 0) {
		let i = val.i;
		if (i === "") val.cp = `let ` + v + `;` + val.cp;
		else val.cp = val.cp + (`let ` + v + `=` + i + `;`);
	} else {
		let i$1 = val.i;
		if (i$1 === "") hoistDecl(val, v);
		else hoistDecl(val, v + `=` + i$1);
	}
	val.v = _var;
	val.i = v;
	return v;
}
function operationArg(schema, expected, flag, defs) {
	return {
		v: _var,
		i: "i",
		s: schema,
		e: expected,
		f: 0,
		cp: "",
		hd: "",
		path: "",
		g: {
			v: -1,
			o: flag,
			e: [],
			d: defs
		}
	};
}
function unsupportedDecode(b, from, target) {
	throw new SuryError({
		code: "unsupported_decode",
		path: b.path,
		reason: `Can't decode ` + toExpression(from) + ` to ` + toExpression(target) + `. Use S.to to define a custom decoder`,
		from,
		to: target
	});
}
function failWithArg(b, fn, arg) {
	return embed(b, (arg) => {
		throw new SuryError(fn(arg));
	}) + `(` + arg + `)`;
}
function makeInvalidInputDetails(expected, received, path, input, includeInput, unionErrors, reasonOverride) {
	let reasonRef = reasonOverride !== void 0 ? reasonOverride : `Expected ` + toExpression(expected) + `, received ` + (includeInput ? stringify(input) : toExpression(received));
	if (unionErrors !== void 0) {
		let reasonsDict = {};
		for (let idx = 0, idx_finish = unionErrors.length; idx < idx_finish; ++idx) {
			let caseError = unionErrors[idx];
			let caseReason = caseError.reason.split("\n").join("\n  ");
			let nonEmptyPath = caseError.path;
			let line = `\n- ` + (nonEmptyPath === "" ? "" : `At ` + nonEmptyPath + `: `) + caseReason;
			if (!reasonsDict[line]) {
				reasonsDict[line] = 1;
				reasonRef = reasonRef + line;
			}
		}
	}
	let details = {
		code: "invalid_input",
		path,
		reason: reasonRef,
		expected,
		received,
		unionErrors
	};
	if (includeInput) details.input = input;
	return details;
}
function invalidInputBuilder(expected, $staropt$star, reasonOverride, $staropt$star$1) {
	return (input) => {
		let extraPath = $staropt$star !== void 0 ? $staropt$star : "";
		let includeInput = $staropt$star$1 !== void 0 ? $staropt$star$1 : true;
		let expected$1 = expected !== void 0 ? expected : input.e;
		let p = input.prev;
		let received = p !== void 0 ? p.s : input.s;
		let path = extraPath === "" ? input.path : input.path + extraPath;
		return (value) => makeInvalidInputDetails(expected$1, received, path, value, includeInput, void 0, reasonOverride);
	};
}
function failInvalidType(input) {
	let em = input.e.errorMessage;
	let override;
	if (em !== void 0) {
		let m = em["type"];
		override = m !== void 0 ? m : em["_"];
	} else override = void 0;
	return invalidInputBuilder(void 0, void 0, override, void 0)(input);
}
function failWithErrorMessage(key, defaultMessage) {
	return (input) => {
		let em = input.e.errorMessage;
		let override;
		if (em !== void 0) {
			let m = em[key];
			override = m !== void 0 ? m : em["_"];
		} else override = void 0;
		let m$1;
		if (override !== void 0) m$1 = override;
		else {
			if (defaultMessage === void 0) return failInvalidType(input);
			m$1 = defaultMessage;
		}
		return invalidInputBuilder(void 0, void 0, m$1, void 0)(input);
	};
}
function embedInvalidInput(input, expectedOpt) {
	return failWithArg(input, invalidInputBuilder(expectedOpt !== void 0 ? expectedOpt : input.e, void 0, void 0, void 0)(input), input.v());
}
function emitChecks(val, inputVar) {
	let checks = val.vc;
	let len = checks.length;
	if (len === 1) {
		let check = checks[0];
		return check.c(inputVar) + `||` + failWithArg(val, check.f(val), inputVar) + `;`;
	}
	let out = "";
	let i = 0;
	while (i < len) {
		let head = checks[i];
		let fail = head.f;
		let cond = head.c(inputVar);
		i = i + 1 | 0;
		while (i < len && checks[i].f === fail) {
			cond = cond + "&&" + checks[i].c(inputVar);
			i = i + 1 | 0;
		}
		out = out + (cond + `||` + failWithArg(val, fail(val), inputVar) + `;`);
	}
	return out;
}
function isHoistable(val) {
	if (val.t === true) if (val.prev.t !== true) return val.cp === "";
	else return false;
	else return true;
}
function merge(val, hoistCond) {
	let current = val;
	let code = "";
	while (current !== void 0) {
		let val$1 = current;
		current = val$1.prev;
		let currentCode = "";
		if (val$1.vc) {
			if (hoistCond !== void 0 && isHoistable(val$1)) {
				let inputVar = current.v();
				let allChecks = val$1.vc;
				let localHoist = "";
				for (let i = 0, i_finish = allChecks.length; i < i_finish; ++i) {
					let check = allChecks[i];
					let condCode = check.c(inputVar);
					if (check.f === failInvalidType) localHoist = localHoist ? localHoist + `&&` + condCode : condCode;
					else if (val$1.e.noValidation !== true) currentCode = currentCode + (condCode + `||` + failWithArg(val$1, check.f(val$1), inputVar) + `;`);
				}
				if (localHoist) if (hoistCond.contents) hoistCond.contents = localHoist + `&&` + hoistCond.contents;
				else hoistCond.contents = localHoist;
			} else if (val$1.e.noValidation !== true) currentCode = emitChecks(val$1, current.v());
		}
		if (val$1.hd !== "") currentCode = currentCode + (`let ` + val$1.hd + `;`);
		val$1.fz = true;
		currentCode = val$1.cp + currentCode;
		code = currentCode + code;
	}
	return code;
}
function next(prev, initial, schema, expectedOpt) {
	return {
		v: _notVar,
		i: initial,
		s: schema,
		e: expectedOpt !== void 0 ? expectedOpt : prev.e,
		prev,
		f: 0,
		d: prev.d,
		cp: "",
		hd: "",
		t: true,
		path: prev.path,
		g: prev.g
	};
}
function refine(val, schemaOpt, checks, expectedOpt) {
	let schema = schemaOpt !== void 0 ? schemaOpt : val.s;
	let expected = expectedOpt !== void 0 ? expectedOpt : val.e;
	let shouldLink = val.v !== _var;
	let nextVal = {
		v: shouldLink ? _prevVar : _var,
		i: val.i,
		s: schema,
		e: expected,
		prev: val,
		f: val.f,
		d: val.d,
		cp: "",
		hd: "",
		vc: checks,
		t: val.t,
		path: val.path,
		g: val.g
	};
	if (shouldLink) {
		let valVar = val.v.bind(val);
		val.v = () => {
			let v = valVar();
			nextVal.i = v;
			nextVal.v = _var;
			return v;
		};
	}
	return nextVal;
}
function pushCheck(val, check) {
	let arr = val.vc;
	if (arr !== void 0) arr.push(check);
	else val.vc = [check];
}
function markOutput(val, valInput) {
	let fn = valInput.e.inputRefiner;
	let deferredInputChecks;
	if (fn !== void 0) {
		let checks = fn(valInput);
		if (checks.length !== 0) if (valInput.prev !== void 0) {
			for (let i = 0, i_finish = checks.length; i < i_finish; ++i) pushCheck(valInput, checks[i]);
			deferredInputChecks = void 0;
		} else deferredInputChecks = checks;
		else deferredInputChecks = void 0;
	} else deferredInputChecks = void 0;
	let fn$1 = val.e.refiner;
	let outputChecks;
	if (fn$1 !== void 0) {
		let checks$1 = fn$1(val);
		outputChecks = checks$1.length !== 0 ? checks$1 : void 0;
	} else outputChecks = void 0;
	let val$1 = deferredInputChecks !== void 0 ? outputChecks !== void 0 ? refine(val, void 0, deferredInputChecks.concat(outputChecks), void 0) : refine(val, void 0, deferredInputChecks, void 0) : outputChecks !== void 0 ? refine(val, void 0, outputChecks, void 0) : val;
	val$1.io = true;
	return val$1;
}
function hoistChildChecks(parent, child, key) {
	if (!child.vc) return;
	let pathAppend = `[` + inlineLocation(parent.g, key) + `]`;
	child.vc.forEach((check) => pushCheck(parent, {
		c: (inputVar) => check.c(inputVar + pathAppend),
		f: check.f
	}));
	child.vc = void 0;
}
function dynamicScope(from, locationVar) {
	let match = from.s.additionalItems;
	let tmp;
	tmp = match !== void 0 && match !== "strip" && match !== "strict" ? match : unknown;
	let match$1 = from.e.additionalItems;
	let tmp$1;
	tmp$1 = match$1 !== void 0 && match$1 !== "strip" && match$1 !== "strict" ? match$1 : unknown;
	return {
		p: from,
		v: _notVarBeforeValidation,
		i: from.v() + `[` + locationVar + `]`,
		s: tmp,
		e: tmp$1,
		f: from.f,
		cp: "",
		hd: "",
		path: "",
		g: from.g
	};
}
function nextConst(from, schema, expected) {
	return next(from, inlineConst(from, schema), schema, expected);
}
function asyncVal(from, initial) {
	let v = next(from, initial, from.s, void 0);
	v.f = 1;
	return v;
}
function add(objectVal, location, val) {
	if (objectVal.s.type === arrayTag) objectVal.s.items.push(val.s);
	else {
		if (!val.o) objectVal.s.required.push(location);
		objectVal.s.properties[location] = val.s;
	}
	if (val.f & 1) val.v();
	objectVal.cp = objectVal.cp + merge(val, void 0);
	objectVal.d[location] = val;
}
function addKey(objVal, key, value) {
	return objVal.v() + `[` + key + `]=` + value.i;
}
function scope(val) {
	let shouldLink = val.v !== _var;
	let nextVal = {
		b: val,
		v: shouldLink ? _bondVar : _var,
		i: val.i,
		s: val.s,
		io: val.io,
		e: val.e,
		f: 0,
		d: val.d,
		cp: "",
		hd: "",
		u: false,
		t: false,
		path: val.path,
		g: val.g
	};
	if (shouldLink) {
		let valVar = val.v.bind(val);
		val.v = () => {
			let v = valVar();
			nextVal.i = v;
			nextVal.v = _var;
			return v;
		};
	}
	return nextVal;
}
function mergeWithPathPrepend(val, parent, locationVar, appendSafe) {
	if (val.path === "" && locationVar === void 0) return merge(val, void 0);
	else {
		let $$catch = (errorVar) => {
			let path = parent.path;
			let tmp = path === "" ? "" : fromString(path) + `+`;
			return errorVar + `.path=` + tmp + (locationVar !== void 0 ? `'["'+` + locationVar + `+'"]'+` : "") + errorVar + `.path`;
		};
		let valCode = merge(val, void 0);
		if (valCode === "" && !(val.f & 1)) return valCode + (appendSafe !== void 0 ? appendSafe() : "");
		let errorVar = varWithoutAllocation(val.g);
		let catchCode = $$catch(errorVar) + `;throw ` + errorVar;
		if (val.f & 1) val.i = val.i + `.catch(` + errorVar + `=>{` + catchCode + `})`;
		return `try{` + valCode + (appendSafe !== void 0 ? appendSafe() : "") + `}catch(` + errorVar + `){` + catchCode + `}`;
	}
}
function noopOperation(i) {
	return i;
}
noopOperation.embedded = immutableEmpty$1;
function int32FormatValidation(inputVar) {
	return inputVar + `<=2147483647&&` + inputVar + `>=-2147483648&&` + inputVar + `%1===0`;
}
function typeofCond(tag) {
	return (inputVar) => `typeof ` + inputVar + `==="` + tag + `"`;
}
function nanCond(inputVar) {
	return `Number.isNaN(` + inputVar + `)`;
}
function isArrayCond(inputVar) {
	return `Array.isArray(` + inputVar + `)`;
}
function objectTagCond(inputVar) {
	return typeofCond(objectTag)(inputVar) + `&&` + inputVar;
}
function instanceofCond(b, $$class) {
	return (inputVar) => inputVar + ` instanceof ` + embed(b, $$class);
}
function numberDecoder(input) {
	let inputTagFlag = flags[input.s.type];
	if (inputTagFlag & 1) {
		let checks = [{
			c: typeofCond(numberTag),
			f: failInvalidType
		}];
		let match = input.e.format;
		let exit = 0;
		if (match === "int32") checks.push({
			c: int32FormatValidation,
			f: failInvalidType
		});
		else exit = 1;
		if (exit === 1) {
			if (!(input.g.o & 2)) checks.push({
				c: (inputVar) => `!` + nanCond(inputVar),
				f: failInvalidType
			});
		}
		return refine(input, input.e, checks, void 0);
	}
	if (!(inputTagFlag & 2)) if (inputTagFlag & 4) if (input.s.format !== input.e.format && input.e.format === "int32") return refine(input, input.e, [{
		c: int32FormatValidation,
		f: failInvalidType
	}], void 0);
	else return input;
	else return unsupportedDecode(input, input.s, input.e);
	let outputVar = varWithoutAllocation(input.g);
	let output = next(input, outputVar, input.e, void 0);
	output.v = _var;
	output.cp = `let ` + outputVar + `=+` + input.v() + `;`;
	output.vc = [{
		c: (param) => {
			let match = input.e.format;
			if (match !== void 0) if (match === "int32") return int32FormatValidation(outputVar);
			else return `!` + nanCond(outputVar);
			else return `!` + nanCond(outputVar);
		},
		f: failInvalidType
	}];
	return output;
}
function float() {
	return cached(numberTag, numberTag, (s) => {
		s.decoder = numberDecoder;
	});
}
function inputToString(input) {
	return next(input, `""+` + input.i, string$2(), void 0);
}
function stringDecoderFn(input) {
	let inputTagFlag = flags[input.s.type];
	if (inputTagFlag & 1) return refine(input, input.e, [{
		c: typeofCond(stringTag),
		f: failInvalidType
	}], void 0);
	if (!(inputTagFlag & 3132 && constField in input.s)) if (inputTagFlag & 1036) return inputToString(input);
	else if (inputTagFlag & 2) return input;
	else return unsupportedDecode(input, input.s, input.e);
	let $$const = "" + input.s.const;
	let schema = base(stringTag, false);
	schema.const = $$const;
	return next(input, `"` + $$const + `"`, schema, void 0);
}
function string$2() {
	return cached(stringTag, stringTag, (s) => {
		s.decoder = stringDecoderFn;
	});
}
function setHas(has, tag) {
	has[flags[tag] & 768 ? unknownTag : tag] = true;
}
let jsonName = `JSON`;
function literalDecoder(input) {
	let expectedSchema = input.e;
	if (expectedSchema.noValidation && !input.u) return nextConst(input, expectedSchema, void 0);
	if (constField in input.s) if (input.s.const === expectedSchema.const) return input;
	else return nextConst(input, expectedSchema, void 0);
	let schemaTagFlag = flags[expectedSchema.type];
	if (!(flags[input.s.type] & 2 && schemaTagFlag & 3132)) if (schemaTagFlag & 2048) return refine(input, expectedSchema, [{
		c: nanCond,
		f: failInvalidType
	}], void 0);
	else return refine(input, expectedSchema, [{
		c: (inputVar) => inputVar + `===` + inlineConst(input, expectedSchema),
		f: failInvalidType
	}], void 0);
	let stringConstSchema = base(stringTag, false);
	stringConstSchema.const = "" + expectedSchema.const;
	let stringConstVal = nextConst(input, stringConstSchema, stringConstSchema);
	stringConstVal.vc = [{
		c: (inputVar) => inputVar + `==="` + stringConstSchema.const + `"`,
		f: failInvalidType
	}];
	return nextConst(stringConstVal, expectedSchema, expectedSchema);
}
function unit() {
	return cached(undefinedTag, undefinedTag, (s) => {
		s.const = void 0;
		s.decoder = literalDecoder;
	});
}
function nullLiteral() {
	return cached(nullTag, nullTag, (s) => {
		s.const = null;
		s.decoder = literalDecoder;
	});
}
function nan() {
	return cached(nanTag, nanTag, (s) => {
		s.const = NaN;
		s.decoder = literalDecoder;
	});
}
function parse(value) {
	if (value === null) return nullLiteral();
	let tag = typeof value;
	if (tag === undefinedTag) return unit();
	if (tag === numberTag && Number.isNaN(value)) return nan();
	if (tag === objectTag) {
		let s = base(instanceTag, true);
		s.class = value.constructor;
		s.const = value;
		s.decoder = literalDecoder;
		return s;
	}
	let s$1 = base(tag, true);
	s$1.const = value;
	s$1.decoder = literalDecoder;
	return s$1;
}
function parse$1(input) {
	let valRef = input;
	let appliedEncoderRef;
	let loopCount = 0;
	while (!valRef.io || valRef.e.to) {
		let appliedEncoder = appliedEncoderRef;
		appliedEncoderRef = void 0;
		let loopInput = valRef;
		loopCount = loopCount + 1 | 0;
		if (loopCount > 50) throw new Error("Loop count exceeded 100");
		if (loopInput.e.$defs) if (loopInput.g.d) Object.assign(loopInput.g.d, loopInput.e.$defs);
		else loopInput.g.d = loopInput.e.$defs;
		if (loopInput.f & 1) {
			let operationInputVar = loopInput.v();
			let operationInput = scope(loopInput);
			let operationOutput = parse$1(operationInput);
			let operationCode = merge(operationOutput, void 0);
			valRef = operationInput.i !== operationOutput.i || operationCode !== "" ? next(loopInput, operationInputVar + `.then(` + operationInputVar + `=>{` + operationCode + `return ` + operationOutput.i + `})`, operationOutput.s, operationOutput.e) : refine(loopInput, operationOutput.s, void 0, operationOutput.e);
			valRef.f = valRef.f | 1;
			valRef.io = true;
		} else if (loopInput.io) {
			let to = loopInput.e.to;
			let parser = loopInput.e.parser;
			valRef = parser !== void 0 ? parser(loopInput) : refine(valRef, void 0, void 0, to);
		} else {
			let maybeEncoder = loopInput.s.encoder;
			if (maybeEncoder && maybeEncoder !== appliedEncoder && loopInput.s !== loopInput.e && loopInput.e.type !== unknownTag) valRef = maybeEncoder(loopInput, loopInput.e);
			if (loopInput !== valRef) appliedEncoderRef = maybeEncoder;
			else {
				valRef = loopInput.e.decoder(loopInput);
				if (!valRef.io) valRef = markOutput(valRef, valRef);
			}
		}
	}
	return valRef;
}
function getOutputSchema(_schema) {
	while (true) {
		let schema = _schema;
		let to = schema.to;
		if (to === void 0) return schema;
		_schema = to;
		continue;
	}
}
function parseDynamic(input) {
	try {
		return parse$1(input);
	} catch (exn) {
		let error = getOrRethrow(exn);
		let p = input.p;
		error.path = (p !== void 0 ? p.path : "") + (input.path + "[]" + error.path);
		throw error;
	}
}
function compileDecoder(schema, expected, flag, defs) {
	let input = operationArg(constField in schema ? unknown : schema, expected, flag, defs);
	let output = parse$1(input);
	let code = merge(output, void 0);
	let isAsync = has(output.f, 1);
	expected.isAsync = isAsync;
	expected.hasTransform = output.t === true;
	if (code === "" && (output === input || output.i === input.i) && !(flag & 1)) return noopOperation;
	let inlinedOutput = output.i;
	if (flag & 1 && !isAsync && !defs) inlinedOutput = `Promise.resolve(` + inlinedOutput + `)`;
	let inlinedFunction = "i=>{" + code + `return ` + inlinedOutput + `}`;
	let ctxVarValue1 = input.g.e;
	let fn = new Function("e", "s", `return ` + inlinedFunction)(ctxVarValue1, s);
	fn.embedded = input.g.e;
	return fn;
}
function getDecoder(param, param$1) {
	let args = arguments;
	let idx = 0;
	let flag;
	let keyRef = "";
	let maxSeq = 0;
	let cacheTarget;
	while (flag === void 0) {
		let arg = args[idx];
		if (arg) if (typeof arg === numberTag) {
			let f = arg | globalConfig.f;
			flag = f;
			keyRef = keyRef + "-" + f;
		} else {
			let seq = arg.seq;
			if (seq > maxSeq) {
				maxSeq = seq;
				cacheTarget = arg;
			}
			keyRef = keyRef + seq + "-";
			idx = idx + 1 | 0;
		}
		else {
			let f$1 = globalConfig.f;
			flag = f$1;
			keyRef = keyRef + "-" + f$1;
		}
	}
	let cacheTarget$1 = cacheTarget;
	if (cacheTarget$1 !== void 0) {
		let key = keyRef;
		if (key in cacheTarget$1) return cacheTarget$1[key];
		let schema = args[idx - 1 | 0];
		for (let i = idx - 2 | 0; i >= 0; --i) {
			let to = schema;
			schema = updateOutput(args[i], (mut) => {
				mut.to = to;
			});
		}
		let f$2 = compileDecoder(schema, schema, flag, 0);
		valueOptions[valKey] = f$2;
		d(cacheTarget$1, key, valueOptions);
		return f$2;
	}
	throw new Error("[Sury] No schema provided for decoder.");
}
let nestedLoc = "BS_PRIVATE_NESTED_SOME_NONE";
function neverBuilderFn(input) {
	let output = refine(input, void 0, void 0, never_());
	output.cp = embedInvalidInput(input, void 0) + ";";
	return output;
}
function never_() {
	return cached(neverTag, neverTag, (s) => {
		s.decoder = neverBuilderFn;
	});
}
function nestedOptionParser(input) {
	let nextSchema = input.e.to;
	return next(input, "{BS_PRIVATE_NESTED_SOME_NONE:" + getOutputSchema(input.e).properties[nestedLoc].const + `}`, nextSchema, nextSchema);
}
function instanceDecoder(input) {
	let inputTagFlag = flags[input.s.type];
	if (inputTagFlag & 1) return refine(input, input.e, [{
		c: instanceofCond(input, input.e.class),
		f: failInvalidType
	}], void 0);
	else if (inputTagFlag & 8192 && input.s.class === input.e.class) return input;
	else return unsupportedDecode(input, input.s, input.e);
}
function makeObjectVal(prev, schema) {
	return {
		v: _notVar,
		i: "",
		s: schema.type === arrayTag ? {
			type: arrayTag,
			decoder: arrayDecoder,
			additionalItems: "strict",
			items: []
		} : {
			type: objectTag,
			decoder: objectDecoder,
			additionalItems: "strict",
			required: [],
			properties: {}
		},
		e: prev.e,
		prev,
		f: 0,
		d: {},
		cp: "",
		hd: "",
		t: true,
		path: prev.path,
		g: prev.g
	};
}
function option(item) {
	return optionFactory(item, unit());
}
function objectDecoder(unknownInput) {
	let isUnion = unknownInput.u;
	let expectedSchema = unknownInput.e;
	let unknownInputTagFlag = flags[unknownInput.s.type];
	let input;
	if (unknownInputTagFlag & 65) {
		let isObjectInput = unknownInputTagFlag & 64;
		let schema;
		if (isObjectInput) schema = unknownInput.s;
		else {
			let mut = base(objectTag, false);
			mut.properties = immutableEmpty;
			mut.additionalItems = unknown;
			schema = mut;
		}
		let checks = [];
		if (!isObjectInput) {
			checks.push({
				c: objectTagCond,
				f: failInvalidType
			});
			if (expectedSchema.additionalItems !== "strip") checks.push({
				c: (inputVar) => `!` + isArrayCond(inputVar),
				f: failInvalidType
			});
		}
		input = checks.length !== 0 ? refine(unknownInput, schema, checks, void 0) : refine(unknownInput, schema, void 0, void 0);
	} else input = unsupportedDecode(unknownInput, unknownInput.s, expectedSchema);
	let s = expectedSchema.additionalItems;
	let dictItem;
	dictItem = s === "strip" || s === "strict" ? void 0 : s;
	let match = input.s.additionalItems;
	let sourceIsDict;
	sourceIsDict = match !== "strip" && match !== "strict";
	let output;
	if (dictItem !== void 0) if (dictItem === unknown) output = input;
	else if (sourceIsDict) {
		let inputVar = input.v();
		let keyVar = varWithoutAllocation(input.g);
		let itemOutput = parseDynamic(dynamicScope(input, keyVar));
		let hasTransform = itemOutput.t;
		let output$1 = hasTransform ? next(input, "{}", expectedSchema, void 0) : refine(input, expectedSchema, void 0, void 0);
		let itemCode = mergeWithPathPrepend(itemOutput, input, keyVar, hasTransform ? () => addKey(output$1, keyVar, itemOutput) : void 0);
		if (hasTransform || itemCode !== "") output$1.cp = output$1.cp + (`for(let ` + keyVar + ` in ` + inputVar + `){` + itemCode + `}`);
		if (itemOutput.f & 1) {
			let resolveVar = varWithoutAllocation(output$1.g);
			let rejectVar = varWithoutAllocation(output$1.g);
			let asyncParseResultVar = varWithoutAllocation(output$1.g);
			let counterVar = varWithoutAllocation(output$1.g);
			let outputVar = output$1.v();
			output = asyncVal(output$1, `new Promise((` + resolveVar + `,` + rejectVar + `)=>{let ` + counterVar + `=Object.keys(` + outputVar + `).length;for(let ` + keyVar + ` in ` + outputVar + `){` + outputVar + `[` + keyVar + `].then(` + asyncParseResultVar + `=>{` + outputVar + `[` + keyVar + `]=` + asyncParseResultVar + `;if(` + counterVar + `--===1){` + resolveVar + `(` + outputVar + `)}},` + rejectVar + `)}})`);
		} else output = output$1;
	} else {
		let objectVal = makeObjectVal(input, expectedSchema);
		let keys = Object.keys(input.s.properties);
		for (let idx = 0, idx_finish = keys.length; idx < idx_finish; ++idx) {
			let key = keys[idx];
			let itemInput$1 = valGet(input, key);
			itemInput$1.e = dictItem;
			itemInput$1.io = false;
			itemInput$1.u = isUnion;
			add(objectVal, key, parse$1(itemInput$1));
		}
		output = completeObjectVal(objectVal);
	}
	else {
		let properties = expectedSchema.properties;
		let keys$1 = Object.keys(properties);
		let keysCount = keys$1.length;
		let objectVal$1 = makeObjectVal(input, expectedSchema);
		let match$1 = expectedSchema.additionalItems;
		let shouldRecreateInput;
		shouldRecreateInput = match$1 === "strip" || match$1 === "strict" ? match$1 === "strip" ? sourceIsDict || Object.keys(input.s.properties).length !== keysCount : false : true;
		let s$1 = input.s.additionalItems;
		let isJsonParent;
		isJsonParent = s$1 === "strip" || s$1 === "strict" ? false : s$1.name === jsonName;
		for (let idx$1 = 0; idx$1 < keysCount; ++idx$1) {
			let key$1 = keys$1[idx$1];
			let schema$1 = properties[key$1];
			let itemInput$2 = valGet(input, key$1);
			itemInput$2.e = schema$1;
			itemInput$2.io = false;
			itemInput$2.u = isUnion;
			if (isJsonParent && schema$1.type === unionTag && schema$1.has[undefinedTag]) itemInput$2.i = `(` + itemInput$2.i + `??null)`;
			let itemOutput$1 = parse$1(itemInput$2);
			if (isUnion && constField in schema$1) hoistChildChecks(input, itemOutput$1, key$1);
			add(objectVal$1, key$1, itemOutput$1);
			if (!shouldRecreateInput) shouldRecreateInput = itemOutput$1.t;
		}
		let tmp = false;
		if (expectedSchema.additionalItems === "strict") {
			let match$2 = input.s.additionalItems;
			let tmp$1;
			tmp$1 = match$2 !== "strip" && match$2 !== "strict";
			tmp = tmp$1;
		}
		if (tmp) {
			let keyVar$1 = varWithoutAllocation(objectVal$1.g);
			hoistDecl(input, keyVar$1);
			objectVal$1.cp = objectVal$1.cp + (`for(` + keyVar$1 + ` in ` + input.v() + `){if(`);
			if (keys$1.length !== 0) for (let idx$2 = 0, idx_finish$1 = keys$1.length; idx$2 < idx_finish$1; ++idx$2) {
				let key$2 = keys$1[idx$2];
				if (idx$2 !== 0) objectVal$1.cp = objectVal$1.cp + "&&";
				objectVal$1.cp = objectVal$1.cp + (keyVar$1 + `!==` + inlineLocation(input.g, key$2));
			}
			else objectVal$1.cp = objectVal$1.cp + "true";
			objectVal$1.cp = objectVal$1.cp + (`){` + failWithArg(input, (exccessFieldName) => ({
				code: "unrecognized_keys",
				path: objectVal$1.path,
				reason: `Unrecognized key "` + exccessFieldName + `"`,
				keys: [exccessFieldName]
			}), keyVar$1) + `}}`);
		}
		if (shouldRecreateInput) output = completeObjectVal(objectVal$1);
		else {
			let o = refine(input, void 0, void 0, void 0);
			o.cp = objectVal$1.cp;
			o.d = objectVal$1.d;
			output = o;
		}
	}
	return markOutput(output, input);
}
function nestedNone() {
	let itemSchema = parse(0);
	let properties = {};
	properties[nestedLoc] = itemSchema;
	return {
		type: objectTag,
		serializer: (input) => {
			let nextSchema = input.e.to;
			return nextConst(input, nextSchema, nextSchema);
		},
		decoder: objectDecoder,
		additionalItems: "strip",
		required: [nestedLoc],
		properties
	};
}
function arrayDecoder(unknownInput) {
	let isUnion = unknownInput.u;
	let expectedSchema = unknownInput.e;
	let unknownInputTagFlag = flags[unknownInput.s.type];
	let expectedItems = expectedSchema.items;
	let expectedLength = expectedItems.length;
	let input;
	if (unknownInputTagFlag & 129) {
		let isArrayInput = unknownInputTagFlag & 128;
		let schema = isArrayInput ? unknownInput.s : array$2(unknown);
		let checks = [];
		if (!isArrayInput) checks.push({
			c: isArrayCond,
			f: failInvalidType
		});
		let match = schema.additionalItems;
		let isExactSize;
		isExactSize = match === "strip" || match === "strict" ? match === "strip" ? schema.items.length === expectedLength : schema.items.length === expectedLength : false;
		if (!isExactSize) {
			let match$1 = expectedSchema.additionalItems;
			if (match$1 === "strip" || match$1 === "strict") if (match$1 === "strip") checks.push({
				c: (inputVar) => inputVar + `.length>=` + expectedLength,
				f: failInvalidType
			});
			else checks.push({
				c: (inputVar) => inputVar + `.length===` + expectedLength,
				f: failInvalidType
			});
		}
		input = checks.length !== 0 ? refine(unknownInput, schema, checks, void 0) : refine(unknownInput, schema, void 0, void 0);
	} else input = unsupportedDecode(unknownInput, unknownInput.s, expectedSchema);
	let itemSchema = expectedSchema.additionalItems;
	let output;
	let exit = 0;
	if (itemSchema === "strip" || itemSchema === "strict") exit = 1;
	else if (itemSchema === unknown) output = input;
	else {
		let inputVar = input.v();
		let iteratorVar = varWithoutAllocation(input.g);
		let itemOutput = parseDynamic(dynamicScope(input, iteratorVar));
		let hasTransform = itemOutput.t;
		let output$1 = hasTransform ? next(input, `new Array(` + inputVar + `.length)`, expectedSchema, void 0) : refine(input, expectedSchema, void 0, void 0);
		let itemCode = mergeWithPathPrepend(itemOutput, input, iteratorVar, hasTransform ? () => addKey(output$1, iteratorVar, itemOutput) : void 0);
		if (hasTransform || itemCode !== "") output$1.cp = output$1.cp + (`for(let ` + iteratorVar + `=` + expectedLength + `;` + iteratorVar + `<` + inputVar + `.length;++` + iteratorVar + `){` + itemCode + `}`);
		output = itemOutput.f & 1 ? asyncVal(output$1, `Promise.all(` + output$1.i + `)`) : output$1;
	}
	if (exit === 1) {
		let objectVal = makeObjectVal(input, expectedSchema);
		let match$2 = expectedSchema.additionalItems;
		let shouldRecreateInput;
		if (match$2 === "strip" || match$2 === "strict") if (match$2 === "strip") {
			let match$3 = input.s.additionalItems;
			shouldRecreateInput = match$3 === "strip" || match$3 === "strict" ? match$3 === "strip" ? input.s.items.length !== expectedLength : input.s.items.length !== expectedLength : true;
		} else shouldRecreateInput = false;
		else shouldRecreateInput = true;
		for (let idx = 0; idx < expectedLength; ++idx) {
			let schema$1 = expectedItems[idx];
			let key = idx.toString();
			let itemInput$1 = valGet(input, key);
			itemInput$1.e = schema$1;
			itemInput$1.io = false;
			itemInput$1.u = isUnion;
			let itemOutput$1 = parse$1(itemInput$1);
			if (isUnion && constField in schema$1) hoistChildChecks(input, itemOutput$1, key);
			add(objectVal, key, itemOutput$1);
			if (!shouldRecreateInput) shouldRecreateInput = itemOutput$1.t;
		}
		if (shouldRecreateInput) output = completeObjectVal(objectVal);
		else {
			let o = refine(input, void 0, void 0, void 0);
			o.cp = objectVal.cp;
			o.d = objectVal.d;
			output = o;
		}
	}
	return markOutput(output, input);
}
function unionEncoder(input, target) {
	let inputAnyOf = input.s.anyOf;
	if (target.type === unionTag && unionGetToPerCase(target) === void 0 && unionIsWiderSchema(target.anyOf, inputAnyOf) || !unionCanDispatchPerVariant(inputAnyOf, target)) return input;
	else return unionPerVariantVal(input, target);
}
function unionDecoder(input) {
	let selfSchema = input.e;
	let schemas = selfSchema.anyOf;
	let initialInputTagFlag = flags[input.s.type];
	let toPerCase = unionGetToPerCase(selfSchema);
	if (input.s === selfSchema && toPerCase === void 0 && schemas.every(unionIsSelfDecodeNoop) || initialInputTagFlag & 256 && unionIsWiderSchema(schemas, input.s.anyOf) && toPerCase === void 0 || input.io && input.e === input.s) return input;
	if (initialInputTagFlag & 256 || input.s.encoder === void 0 && initialInputTagFlag & 512) input.s = unknown;
	let activeKey = "";
	if (!(initialInputTagFlag & 769)) {
		let sourceKey = unionToKey(input.s);
		let hasNull = false;
		let hasUndefined = false;
		let len = schemas.length;
		let i = 0;
		while (activeKey === "" && i < len) {
			let s = schemas[i];
			if (unionToKey(s) === sourceKey) activeKey = sourceKey;
			else if (s.type === nullTag) hasNull = true;
			else if (s.type === undefinedTag) hasUndefined = true;
			i = i + 1 | 0;
		}
		if (activeKey === "") {
			if (initialInputTagFlag & 16 && hasNull) activeKey = nullTag;
			else if (initialInputTagFlag & 32 && hasUndefined) activeKey = undefinedTag;
		}
	}
	let activeKey$1 = activeKey;
	let initialInline = input.i;
	let fail = (caught) => embed(input, function() {
		let args = arguments;
		throw new SuryError(makeInvalidInputDetails(selfSchema, unknown, input.path, args[0], true, args.length > 1 ? Array.from(args).slice(1) : void 0, void 0));
	}) + `(` + input.v() + caught + `)`;
	let output = refine(input, void 0, void 0, void 0);
	let outputAnyOf = [];
	let staticBlockFailure = { contents: "" };
	let getArrItemsCode = (arr, isDeopt) => {
		let typeValidationInput = arr[0];
		let typeValidationOutput = arr[1];
		let itemStart = "";
		let itemEnd = "";
		let itemNextElse = false;
		let itemNoop = { contents: "" };
		let caught = "";
		let byDiscriminant = {};
		let itemIdx = 2;
		let lastIdx = arr.length - 1 | 0;
		while (itemIdx <= lastIdx) {
			let input = scope(typeValidationOutput);
			input.u = true;
			input.t = typeValidationOutput.t;
			input.io = false;
			input.e = arr[itemIdx];
			let isLast = itemIdx === lastIdx;
			let isFirst = itemIdx === 2;
			let isOnlyCase = isFirst && isLast;
			let withExhaustiveCheck = !isOnlyCase;
			let itemSkipped = false;
			let itemCode = "";
			let itemCond = { contents: "" };
			try {
				let itemOutput = parse$1(input);
				outputAnyOf.push(itemOutput.s);
				itemCode = merge(itemOutput, itemCond);
				if (itemOutput.t) {
					output.t = true;
					if (itemOutput.f & 1) output.f = output.f | 1;
					let itemVar = typeValidationInput.v();
					if (itemOutput.i !== itemVar) itemCode = itemCode + (itemVar + `=` + itemOutput.i);
				}
			} catch (exn) {
				let errorVar = embed(input, getOrRethrow(exn));
				caught = caught + `,` + errorVar;
				if (isDeopt && isOnlyCase) {
					staticBlockFailure.contents = errorVar;
					itemSkipped = true;
				} else if (isLast) {
					withExhaustiveCheck = false;
					itemCode = isDeopt ? "throw " + errorVar : fail(caught);
				} else itemSkipped = true;
			}
			let itemCond$1 = itemCond.contents;
			let itemCode$1 = itemCode;
			if (!itemSkipped && itemCond$1) if (itemCode$1) {
				let match = byDiscriminant[itemCond$1];
				if (match !== void 0) if (typeof match === "string") byDiscriminant[itemCond$1] = [match, itemCode$1];
				else match.push(itemCode$1);
				else byDiscriminant[itemCond$1] = itemCode$1;
			} else itemNoop.contents = itemNoop.contents ? itemNoop.contents + `||` + itemCond$1 : itemCond$1;
			if (!itemSkipped && (!itemCond$1 || isLast)) {
				let accedDiscriminants = Object.keys(byDiscriminant);
				for (let idx = 0, idx_finish = accedDiscriminants.length; idx < idx_finish; ++idx) {
					let discrim = accedDiscriminants[idx];
					itemStart = itemStart + (itemNextElse ? "else if" : "if") + (`(` + discrim + `){`);
					let code = byDiscriminant[discrim];
					if (typeof code === "string") itemStart = itemStart + code + "}";
					else {
						let caught$1 = "";
						for (let idx$1 = 0, idx_finish$1 = code.length; idx$1 < idx_finish$1; ++idx$1) {
							let code$1 = code[idx$1];
							let errorVar$1 = `e` + idx$1;
							itemStart = itemStart + (`try{` + code$1 + `}catch(` + errorVar$1 + `){`);
							caught$1 = caught$1 + `,` + errorVar$1;
						}
						itemStart = itemStart + fail(caught$1) + "}".repeat(code.length) + "}";
					}
					itemNextElse = true;
				}
				byDiscriminant = {};
			}
			if (!itemSkipped && !itemCond$1) if (itemCode$1) {
				if (itemNoop.contents) {
					itemStart = itemStart + (itemNextElse ? "else if" : "if") + (`(!(` + itemNoop.contents + `)){`);
					itemEnd = "}" + itemEnd;
					itemNoop.contents = "";
					itemNextElse = false;
				}
				if (isLast && (isDeopt || !withExhaustiveCheck || isFirst)) {
					itemStart = itemStart + ((itemNextElse ? "else{" : "") + itemCode$1);
					itemEnd = (itemNextElse ? "}" : "") + itemEnd;
				} else {
					let errorVar$2 = `e` + (itemIdx - 2 | 0);
					itemStart = itemStart + ((itemNextElse ? "else{" : "") + `try{` + itemCode$1 + `}catch(` + errorVar$2 + `){`);
					itemEnd = (itemNextElse ? "}" : "") + "}" + itemEnd;
					caught = caught + `,` + errorVar$2;
					itemNextElse = false;
				}
			} else {
				itemNoop.contents = "";
				itemIdx = lastIdx;
				withExhaustiveCheck = false;
			}
			if (isLast) {
				if (itemNoop.contents) if (itemStart || caught) itemStart = itemStart + (itemNextElse ? "else if" : "if") + (`(!(` + itemNoop.contents + `)){` + fail(caught) + `}`);
				else pushCheck(typeValidationOutput, {
					c: (param) => `(` + itemNoop.contents + `)`,
					f: failInvalidType
				});
				else if (withExhaustiveCheck) {
					let errorCode = fail(caught);
					itemStart = itemStart + (itemNextElse ? `else{` + errorCode + `}` : errorCode);
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
	let lastIdx = schemas.length - 1 | 0;
	let byKey = {};
	let keys = [];
	let unionRefiner = selfSchema.refiner;
	let unionInputRefiner = selfSchema.inputRefiner;
	let cachedRefinerChecks = { contents: void 0 };
	let cachedInputRefinerChecks = { contents: void 0 };
	let attach = (current, source, cache) => {
		if (source === void 0) return current;
		let getCached = (input) => {
			let checks = cache.contents;
			if (checks !== void 0) return checks;
			let checks$1 = source(input);
			cache.contents = checks$1;
			return checks$1;
		};
		if (current !== void 0) return (input) => {
			let arr = current(input);
			let next = getCached(input);
			for (let i = 0, i_finish = next.length; i < i_finish; ++i) arr.push(next[i]);
			return arr;
		};
		else return getCached;
	};
	let appendUnionRefiners = (mut) => {
		let r = attach(mut.refiner, unionRefiner, cachedRefinerChecks);
		if (r !== void 0) mut.refiner = r;
		let r$1 = attach(mut.inputRefiner, unionInputRefiner, cachedInputRefinerChecks);
		if (r$1 !== void 0) {
			mut.inputRefiner = r$1;
			return;
		}
	};
	let schemas$1;
	if (constField in input.s) {
		let matching = [];
		let rest = [];
		for (let idx = 0; idx <= lastIdx; ++idx) {
			let schema = schemas[idx];
			if (constField in schema && schema.const === input.s.const) matching.push(schema);
			else rest.push(schema);
		}
		schemas$1 = matching.concat(rest);
	} else schemas$1 = schemas;
	for (let idx$1 = 0; idx$1 <= lastIdx; ++idx$1) {
		let schema$1 = toPerCase !== void 0 ? updateOutput(schemas$1[idx$1], (mut) => {
			appendUnionRefiners(mut);
			mut.to = toPerCase;
		}) : schemas$1[idx$1];
		let tag = schema$1.type;
		let tagFlag = flags[tag];
		let key = unionToKey(schema$1);
		if ((activeKey$1 === "" || activeKey$1 === key) && !(tagFlag & 16 && "fromDefault" in selfSchema)) {
			let initialArr = byKey[key];
			if (initialArr !== void 0) {
				if (tagFlag & 64 && nestedLoc in schema$1.properties) initialArr.splice(initialArr.length - 1 | 0, 0, schema$1);
				else if (!(tagFlag & 2096)) initialArr.push(schema$1);
			} else {
				let typeValidationInput = scope(input);
				let tmp;
				if (tagFlag & 37633) tmp = unknown;
				else {
					let narrow = base(schema$1.type, false);
					narrow.encoder = schema$1.encoder;
					if (tagFlag & 8192) narrow.class = schema$1.class;
					else if (tagFlag & 64) {
						narrow.properties = immutableEmpty;
						narrow.additionalItems = unknown;
					} else if (tagFlag & 128) {
						narrow.additionalItems = unknown;
						narrow.items = immutableEmpty$1;
					} else if (tagFlag & 2096) narrow.const = schema$1.const;
					narrow.decoder = (input) => {
						if (flags[input.s.type] & 1) return refine(input, input.e, [{
							c: (inputVar) => {
								let tagFlag = flags[schema$1.type];
								if (tagFlag & 64) return objectTagCond(inputVar) + `&&!` + isArrayCond(inputVar);
								if (tagFlag & 128) return isArrayCond(inputVar);
								if (tagFlag & 8192) return instanceofCond(input, schema$1.class)(inputVar);
								if (!(tagFlag & 4)) if (tagFlag & 2048) return nanCond(inputVar);
								else if (tagFlag & 48) return inputVar + `===` + inlineConst(input, schema$1);
								else if (tagFlag & 17418) return typeofCond(schema$1.type)(inputVar);
								else return "";
								let typeofCheck = typeofCond(numberTag)(inputVar);
								if (input.g.o & 2) return typeofCheck;
								else return typeofCheck + `&&!` + nanCond(inputVar);
							},
							f: failInvalidType
						}], void 0);
						else return schema$1.decoder(input);
					};
					tmp = narrow;
				}
				typeValidationInput.e = tmp;
				let typeValidationOutput;
				try {
					typeValidationOutput = parse$1(typeValidationInput);
				} catch (exn) {
					typeValidationInput.vc = void 0;
					typeValidationOutput = typeValidationInput;
				}
				if (unionIsPriority(tagFlag, byKey)) keys.unshift(key);
				else keys.push(key);
				byKey[key] = [
					typeValidationInput,
					typeValidationOutput,
					schema$1
				];
				let shouldDeopt = true;
				let valRef = typeValidationOutput;
				while (valRef !== void 0 && shouldDeopt) {
					let v = valRef;
					valRef = v.prev;
					shouldDeopt = !(v.vc && isHoistable(v));
				}
				if (shouldDeopt) {
					for (let keyIdx = 0, keyIdx_finish = keys.length; keyIdx < keyIdx_finish; ++keyIdx) {
						let key$1 = keys[keyIdx];
						if (!exit) {
							let arr = byKey[key$1];
							let typeValidationOutput$1 = arr[1];
							let itemsCode = getArrItemsCode(arr, true);
							let blockCode = merge(typeValidationOutput$1, void 0) + itemsCode;
							let embeddedError = staticBlockFailure.contents;
							if (embeddedError) {
								staticBlockFailure.contents = "";
								if (blockCode) {
									let errorVar = `e` + (idx$1 + keyIdx | 0);
									start = start + (`try{` + blockCode + `throw ` + embeddedError + `}catch(` + errorVar + `){`);
									end = "}" + end;
									caught = caught + `,` + errorVar;
								} else caught = caught + `,` + embeddedError;
							} else if (blockCode) {
								let errorVar$1 = `e` + (idx$1 + keyIdx | 0);
								start = start + (`try{` + blockCode + `}catch(` + errorVar$1 + `){`);
								end = "}" + end;
								caught = caught + `,` + errorVar$1;
							} else exit = true;
						}
					}
					byKey = {};
					keys = [];
				}
			}
		}
	}
	let byKey$1 = byKey;
	let keys$1 = keys;
	if (!exit) {
		let nextElse = false;
		let noop = "";
		for (let idx$2 = 0, idx_finish = keys$1.length; idx$2 < idx_finish; ++idx$2) {
			let arr$1 = byKey$1[keys$1[idx$2]];
			let typeValidationOutput$2 = arr$1[1];
			let firstSchema = arr$1[2];
			let itemsCode$1 = getArrItemsCode(arr$1, false);
			let blockCond = { contents: "" };
			let blockCode$1 = merge(typeValidationOutput$2, blockCond) + itemsCode$1;
			let blockCond$1 = blockCond.contents;
			if (blockCode$1 || unionIsPriority(flags[firstSchema.type], byKey$1)) {
				start = start + (nextElse ? "else if" : "if") + (`(` + blockCond$1 + `){` + blockCode$1 + `}`);
				nextElse = true;
			} else noop = noop ? noop + `||` + blockCond$1 : blockCond$1;
		}
		let errorCode = fail(caught);
		let tmp$1;
		if (noop) tmp$1 = (nextElse ? "else if" : "if") + (`(!(` + noop + `)){` + errorCode + `}`);
		else tmp$1 = nextElse ? `else{` + errorCode + `}` : end === "" ? errorCode + ";" : errorCode;
		start = start + tmp$1;
	}
	output.cp = output.cp + start + end;
	if (input.i !== output.i) output.i = input.i;
	let o = output.f & 1 ? (output.i = `Promise.resolve(` + output.i + `)`, output.v = _notVar, output) : output.v === _var && input.cp === "" && output.cp === "" && initialInline === "i" ? (input.hd = "", input.v = _notVar, input.i = initialInline, input) : output;
	o.s = outputAnyOf.length ? unionFactory(outputAnyOf) : never_();
	o.e = toPerCase !== void 0 ? (o.io = true, getOutputSchema(toPerCase)) : selfSchema;
	return o;
}
function unionIsWiderSchema(schemaAnyOf, inputAnyOf) {
	return inputAnyOf.every((inputSchema, idx) => {
		let schema = schemaAnyOf[idx];
		if (schema !== void 0 && !(flags[inputSchema.type] & 9152) && inputSchema.type === schema.type && inputSchema.const === schema.const) return inputSchema.to === void 0;
		else return false;
	});
}
function unionPerVariantVal(input, target) {
	return refine(input, unknown, void 0, updateOutput(input.s, (mut) => {
		mut.to = target;
	}));
}
function unionCanDispatchPerVariant(inputAnyOf, target) {
	if (!(flags[getOutputSchema(target).type] & 512) && !(target.type === unionTag && target.anyOf.some((v) => flags[v.type] & 512))) return !inputAnyOf.some((v) => {
		if (v.to !== void 0 || v.parser !== void 0) return true;
		else return flags[v.type] & 512;
	});
	else return false;
}
function unionGetToPerCase(schema) {
	if (schema.parser !== void 0) return;
	let to = schema.to;
	if (to !== void 0) return to;
}
function valGet(parent, location) {
	let d = parent.d;
	let vals;
	if (d !== void 0) vals = d;
	else {
		let d$1 = {};
		parent.d = d$1;
		vals = d$1;
	}
	let v = vals[location];
	if (v !== void 0) return scope(v);
	let locationSchema = parent.s.type === objectTag ? parent.s.properties[location] : parent.s.items[location];
	let schema;
	if (locationSchema !== void 0) schema = locationSchema;
	else {
		let s = parent.s.additionalItems;
		schema = s === "strip" || s === "strict" ? unsupportedDecode(parent, parent.s, parent.e) : parent.s.type === objectTag && s.type !== unknownTag && !(flags[s.type] & 512) && !isOptional(s) ? option(s) : s;
	}
	let pathAppend = `[` + inlineLocation(parent.g, location) + `]`;
	let item = {
		p: parent,
		v: _notVarAtParent,
		i: constField in schema ? inlineConst(parent, schema) : parent.v() + pathAppend,
		s: schema,
		e: schema,
		f: 0,
		cp: "",
		hd: "",
		path: parent.path + pathAppend,
		g: parent.g
	};
	vals[location] = item;
	return item;
}
function completeObjectVal(objectVal) {
	let isArray = objectVal.s.type === arrayTag;
	let inline = "";
	let promiseAllContent = "";
	let optionalSettingCode;
	let keys = Object.keys(objectVal.d);
	for (let idx = 0, idx_finish = keys.length; idx < idx_finish; ++idx) {
		let key = keys[idx];
		let val = objectVal.d[key];
		if (val.f & 1) promiseAllContent = promiseAllContent + val.i + ",";
		if (val.o) {
			let existingFn = optionalSettingCode;
			optionalSettingCode = (objectVar) => (existingFn !== void 0 ? existingFn(objectVar) : "") + (`if(` + val.v() + `!==void 0){` + objectVar + `[` + inlineLocation(objectVal.g, key) + `]=` + val.i + `}`);
		} else inline = inline + (isArray ? val.i : inlineLocation(objectVal.g, key) + `:` + val.i) + ",";
	}
	objectVal.i = isArray ? "[" + inline + "]" : "{" + inline + "}";
	if (promiseAllContent) {
		let operationInput = scope(objectVal);
		operationInput.io = true;
		let operationOutput = parse$1(operationInput);
		let operationCode = merge(operationOutput, void 0);
		if (operationCode === "" && promiseAllContent === operationOutput.i + `,`) objectVal.i = operationOutput.i;
		else objectVal.i = `Promise.all([` + promiseAllContent + `]).then(([` + promiseAllContent + `])=>{` + operationCode + `return ` + operationOutput.i + `})`;
		objectVal.f = objectVal.f | 1;
		objectVal.s = operationOutput.s;
		objectVal.e = operationOutput.e;
		objectVal.io = true;
		return objectVal;
	}
	let fn = optionalSettingCode;
	if (fn === void 0) return objectVal;
	let code = fn(objectVal.v());
	let output = refine(objectVal, void 0, void 0, void 0);
	output.cp = output.cp + code;
	return output;
}
function unionFactory(schemas) {
	let len = schemas.length;
	if (len === 1) return schemas[0];
	if (len !== 0) {
		let has = {};
		let anyOf = /* @__PURE__ */ new Set();
		for (let idx = 0, idx_finish = schemas.length; idx < idx_finish; ++idx) {
			let schema = schemas[idx];
			if (schema.type === unionTag && schema.to === void 0) {
				schema.anyOf.forEach((item) => {
					anyOf.add(item);
				});
				Object.assign(has, schema.has);
			} else {
				anyOf.add(schema);
				setHas(has, schema.type);
			}
		}
		let mut = base(unionTag, false);
		mut.anyOf = Array.from(anyOf);
		mut.decoder = unionDecoder;
		mut.encoder = unionEncoder;
		mut.has = has;
		return mut;
	}
	throw new Error("[Sury] S.union requires at least one item");
}
function unionIsPriority(tagFlag, byKey) {
	if (tagFlag & 8320 && objectTag in byKey) return true;
	else if (tagFlag & 2048) return numberTag in byKey;
	else return false;
}
function unionToKey(schema) {
	if (flags[schema.type] & 8192) return schema.class.name;
	else return schema.type;
}
function unionIsSelfDecodeNoop(_schema) {
	while (true) {
		let schema = _schema;
		let tmp = false;
		let tmp$1 = false;
		let tmp$2 = false;
		if (schema.to === void 0 && schema.parser === void 0 && !(flags[schema.type] & 512)) {
			let anyOf = schema.anyOf;
			tmp$2 = anyOf !== void 0 ? anyOf.every(unionIsSelfDecodeNoop) : true;
		}
		if (tmp$2) {
			let items = schema.items;
			tmp$1 = items !== void 0 ? items.every(unionIsSelfDecodeNoop) : true;
		}
		if (tmp$1) {
			let properties = schema.properties;
			tmp = properties !== void 0 ? Object.values(properties).every(unionIsSelfDecodeNoop) : true;
		}
		if (!tmp) return false;
		let match = schema.additionalItems;
		if (match === void 0) return true;
		if (match === "strip" || match === "strict") return true;
		_schema = match;
		continue;
	}
}
function array$2(item) {
	let mut = base(arrayTag, item[reversedKey] === item);
	mut.additionalItems = item;
	mut.items = immutableEmpty$1;
	mut.decoder = arrayDecoder;
	return mut;
}
function optionFactory(item, unitOpt) {
	let unit$1 = unitOpt !== void 0 ? unitOpt : unit();
	let match = getOutputSchema(item);
	switch (match.type) {
		case "undefined": return unionFactory([unit$1, nestedOption(item)]);
		case "union":
			let has = match.has;
			let anyOf = match.anyOf;
			return updateOutput(item, (mut) => {
				let mutHas = copy(has);
				let newAnyOf = [];
				for (let idx = 0, idx_finish = anyOf.length; idx < idx_finish; ++idx) {
					let schema = anyOf[idx];
					let match = getOutputSchema(schema);
					let match$1 = match.type;
					let tmp;
					if (match$1 === "undefined") {
						mutHas[unit$1.type] = true;
						newAnyOf.push(unit$1);
						tmp = nestedOption(schema);
					} else {
						let properties = match.properties;
						if (properties !== void 0) {
							let nestedSchema = properties[nestedLoc];
							tmp = nestedSchema !== void 0 ? updateOutput(schema, (mut) => {
								let properties = {};
								let newrecord = { ...nestedSchema };
								newrecord.const = nestedSchema.const + 1;
								properties[nestedLoc] = newrecord;
								mut.properties = properties;
							}) : schema;
						} else tmp = schema;
					}
					newAnyOf.push(tmp);
				}
				if (newAnyOf.length === anyOf.length) {
					mutHas[unit$1.type] = true;
					newAnyOf.push(unit$1);
				}
				mut.anyOf = newAnyOf;
				mut.has = mutHas;
			});
		default: return unionFactory([item, unit$1]);
	}
}
function nestedOption(item) {
	return updateOutput(item, (mut) => {
		mut.to = nestedNone();
		mut.parser = nestedOptionParser;
	});
}
d(sp, "~standard", { get: function() {
	let schema = this;
	return {
		version: 1,
		vendor,
		validate: (input) => {
			try {
				return { value: getDecoder(unknown, schema)(input) };
			} catch (exn) {
				let error = getOrRethrow(exn);
				return { issues: [{
					message: error.reason,
					path: error.path === "" ? void 0 : toArray(error.path)
				}] };
			}
		}
	};
} });
function internalRefine(schema, makeRefiner) {
	return updateOutput(schema, (mut) => {
		let refiner = makeRefiner(mut);
		let existingRefiner = mut.refiner;
		if (existingRefiner !== void 0) mut.refiner = (input) => {
			let arr = existingRefiner(input);
			let next = refiner(input);
			for (let i = 0, i_finish = next.length; i < i_finish; ++i) arr.push(next[i]);
			return arr;
		};
		else mut.refiner = refiner;
	});
}
function getMutErrorMessage(mut) {
	let em = mut.errorMessage ? copy(mut.errorMessage) : {};
	mut.errorMessage = em;
	return em;
}
function url$1() {
	return cached("url", stringTag, (s) => {
		let urlValidator = ((s) => {
			try {
				new URL(s);
				return true;
			} catch (_) {
				return false;
			}
		});
		s.decoder = stringDecoderFn;
		s.format = "url";
		s.refiner = (input) => [{
			c: (inputVar) => embed(input, urlValidator) + `(` + inputVar + `)`,
			f: failWithErrorMessage("format", void 0)
		}];
	});
}
function invalidDateRefine(input) {
	return refine(input, input.e, [{
		c: (inputVar) => `!Number.isNaN(` + inputVar + `.getTime())`,
		f: failInvalidType
	}], void 0);
}
function date$1() {
	return cached(instanceTag, instanceTag, (s) => {
		s.class = Date;
		s.decoder = (input) => {
			let inputTagFlag = flags[input.s.type];
			if (inputTagFlag & 2) return invalidDateRefine(next(input, `new Date(` + input.i + `)`, s, void 0));
			else if (inputTagFlag & 1) return invalidDateRefine(instanceDecoder(input));
			else if (inputTagFlag & 8192 && input.s.class === s.class) return input;
			else return unsupportedDecode(input, input.s, input.e);
		};
		s.encoder = (input, target) => {
			if (!(flags[target.type] & 2)) return input;
			let dateTimeString = base(stringTag, false);
			dateTimeString.format = "date-time";
			return parse$1(next(input, input.i + `.toISOString()`, dateTimeString, target));
		};
	});
}
function traverseDefinition(definition, onNode) {
	if (typeof definition !== objectTag || definition === null) return parse(definition);
	let s = onNode(definition);
	if (s !== void 0) return s;
	if (Array.isArray(definition)) {
		for (let idx = 0, idx_finish = definition.length; idx < idx_finish; ++idx) definition[idx] = traverseDefinition(definition[idx], onNode);
		let mut = base(arrayTag, false);
		mut.items = definition;
		mut.additionalItems = "strict";
		mut.decoder = arrayDecoder;
		return mut;
	}
	let cnstr = definition.constructor;
	if (cnstr && cnstr !== Object) {
		let mut$1 = base(instanceTag, true);
		mut$1.class = cnstr;
		mut$1.const = definition;
		mut$1.decoder = literalDecoder;
		return mut$1;
	}
	let fieldNames = Object.keys(definition);
	let length = fieldNames.length;
	for (let idx$1 = 0; idx$1 < length; ++idx$1) {
		let location = fieldNames[idx$1];
		definition[location] = traverseDefinition(definition[location], onNode);
	}
	let mut$2 = base(objectTag, false);
	mut$2.required = fieldNames;
	mut$2.properties = definition;
	mut$2.additionalItems = globalConfig.a;
	mut$2.decoder = objectDecoder;
	return mut$2;
}
function definitionToSchema(definition) {
	return traverseDefinition(definition, (node) => {
		if (node["~standard"]) return node;
	});
}
let js_schema = definitionToSchema;
function assertNumber(fnName, n) {
	if (!(typeof n !== numberTag || Number.isNaN(n))) return;
	throw new SuryError({
		code: "invalid_operation",
		path: "",
		reason: `[S.` + fnName + `] Expected number, received ` + stringify(n)
	});
}
function intMin(schema, minValue, maybeMessage) {
	assertNumber("min", minValue);
	let message = maybeMessage !== void 0 ? maybeMessage : `Number must be greater than or equal to ` + minValue;
	return internalRefine(schema, (mut) => {
		mut.minimum = minValue;
		getMutErrorMessage(mut)["minimum"] = message;
		return (param) => [{
			c: (inputVar) => inputVar + `>` + (minValue - 1 | 0),
			f: failWithErrorMessage("minimum", message)
		}];
	});
}
function intMax(schema, maxValue, maybeMessage) {
	assertNumber("max", maxValue);
	let message = maybeMessage !== void 0 ? maybeMessage : `Number must be lower than or equal to ` + maxValue;
	return internalRefine(schema, (mut) => {
		mut.maximum = maxValue;
		getMutErrorMessage(mut)["maximum"] = message;
		return (param) => [{
			c: (inputVar) => inputVar + `<` + (maxValue + 1 | 0),
			f: failWithErrorMessage("maximum", message)
		}];
	});
}
function floatMin(schema, minValue, maybeMessage) {
	assertNumber("min", minValue);
	let message = maybeMessage !== void 0 ? maybeMessage : `Number must be greater than or equal to ` + minValue;
	return internalRefine(schema, (mut) => {
		mut.minimum = minValue;
		getMutErrorMessage(mut)["minimum"] = message;
		return (input) => [{
			c: (inputVar) => inputVar + `>=` + embed(input, minValue),
			f: failWithErrorMessage("minimum", message)
		}];
	});
}
function floatMax(schema, maxValue, maybeMessage) {
	assertNumber("max", maxValue);
	let message = maybeMessage !== void 0 ? maybeMessage : `Number must be lower than or equal to ` + maxValue;
	return internalRefine(schema, (mut) => {
		mut.maximum = maxValue;
		getMutErrorMessage(mut)["maximum"] = message;
		return (input) => [{
			c: (inputVar) => inputVar + `<=` + embed(input, maxValue),
			f: failWithErrorMessage("maximum", message)
		}];
	});
}
function arrayMinLength(schema, length, maybeMessage) {
	assertNumber("min", length);
	let message = maybeMessage !== void 0 ? maybeMessage : `Array must be ` + length + ` or more items long`;
	return internalRefine(schema, (mut) => {
		mut.minItems = length;
		getMutErrorMessage(mut)["minItems"] = message;
		return (param) => [{
			c: (inputVar) => inputVar + `.length>` + (length - 1 | 0),
			f: failWithErrorMessage("minItems", message)
		}];
	});
}
function arrayMaxLength(schema, length, maybeMessage) {
	assertNumber("max", length);
	let message = maybeMessage !== void 0 ? maybeMessage : `Array must be ` + length + ` or fewer items long`;
	return internalRefine(schema, (mut) => {
		mut.maxItems = length;
		getMutErrorMessage(mut)["maxItems"] = message;
		return (param) => [{
			c: (inputVar) => inputVar + `.length<` + (length + 1 | 0),
			f: failWithErrorMessage("maxItems", message)
		}];
	});
}
function stringMinLength(schema, length, maybeMessage) {
	assertNumber("min", length);
	let message = maybeMessage !== void 0 ? maybeMessage : `String must be ` + length + ` or more characters long`;
	return internalRefine(schema, (mut) => {
		mut.minLength = length;
		getMutErrorMessage(mut)["minLength"] = message;
		return (param) => [{
			c: (inputVar) => inputVar + `.length>` + (length - 1 | 0),
			f: failWithErrorMessage("minLength", message)
		}];
	});
}
function stringMaxLength(schema, length, maybeMessage) {
	assertNumber("max", length);
	let message = maybeMessage !== void 0 ? maybeMessage : `String must be ` + length + ` or fewer characters long`;
	return internalRefine(schema, (mut) => {
		mut.maxLength = length;
		getMutErrorMessage(mut)["maxLength"] = message;
		return (param) => [{
			c: (inputVar) => inputVar + `.length<` + (length + 1 | 0),
			f: failWithErrorMessage("maxLength", message)
		}];
	});
}
let js_parser = ((...args) => getDecoder(unknown, ...args));
function js_union(values) {
	return unionFactory(values.map(definitionToSchema));
}
function min$1(schema, minValue, maybeMessage) {
	switch (schema.type) {
		case "string": return stringMinLength(schema, minValue, maybeMessage);
		case "number": if (schema.format !== void 0) return intMin(schema, minValue, maybeMessage);
		else return floatMin(schema, minValue, maybeMessage);
		case "array": return arrayMinLength(schema, minValue, maybeMessage);
		default:
			let message = `S.min is not supported for ` + toExpression(schema) + ` schema. Coerce the schema to string, number or array using S.to first.`;
			throw new Error(`[Sury] ` + message);
	}
}
function max$1(schema, maxValue, maybeMessage) {
	switch (schema.type) {
		case "string": return stringMaxLength(schema, maxValue, maybeMessage);
		case "number": if (schema.format !== void 0) return intMax(schema, maxValue, maybeMessage);
		else return floatMax(schema, maxValue, maybeMessage);
		case "array": return arrayMaxLength(schema, maxValue, maybeMessage);
		default:
			let message = `S.max is not supported for ` + toExpression(schema) + ` schema. Coerce the schema to string, number or array using S.to first.`;
			throw new Error(`[Sury] ` + message);
	}
}
$$Error.$$class;
var string = /*#__PURE__*/ string$2();
var number = /*#__PURE__*/ float();
var array = array$2;
var date = /*#__PURE__*/ date$1();
var union = js_union;
var schema = js_schema;
var parser = js_parser;
var min = min$1;
var max = max$1;
var url = /*#__PURE__*/ url$1();
//#endregion
//#region ../schemas/libraries/sury/download.ts
const imageSchema = schema({
	id: number,
	created: date,
	title: min(max(string, 100), 1),
	type: union(["jpg", "png"]),
	size: number,
	url
});
const ratingSchema = schema({
	id: number,
	stars: min(max(number, 5), 0),
	title: min(max(string, 100), 1),
	text: min(max(string, 1e3), 1),
	images: array(imageSchema)
});
parser(schema({
	id: number,
	created: date,
	title: min(max(string, 100), 1),
	brand: min(max(string, 30), 1),
	description: min(max(string, 500), 1),
	price: min(max(number, 1e4), 1),
	discount: union([min(max(number, 100), 1), null]),
	quantity: min(max(number, 10), 0),
	tags: array(min(max(string, 30), 1)),
	images: array(imageSchema),
	ratings: array(ratingSchema)
}))({});
//#endregion
