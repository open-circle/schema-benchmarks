//#region ../node_modules/.pnpm/sury@11.0.0-alpha.4/node_modules/sury/src/Sury.res.mjs
function some(x) {
	if (x === void 0) return { BS_PRIVATE_NESTED_SOME_NONE: 0 };
	else if (x !== null && x.BS_PRIVATE_NESTED_SOME_NONE !== void 0) return { BS_PRIVATE_NESTED_SOME_NONE: x.BS_PRIVATE_NESTED_SOME_NONE + 1 | 0 };
	else return x;
}
function valFromOption(x) {
	if (x === null || x.BS_PRIVATE_NESTED_SOME_NONE === void 0) return x;
	let depth = x.BS_PRIVATE_NESTED_SOME_NONE;
	if (depth === 0) return;
	else return { BS_PRIVATE_NESTED_SOME_NONE: depth - 1 | 0 };
}
function classify(arrayable) {
	if (Array.isArray(arrayable)) return {
		TAG: "Array",
		_0: arrayable
	};
	else return {
		TAG: "Single",
		_0: arrayable
	};
}
let Arrayable = { classify };
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
function capitalize(string$2) {
	return string$2.slice(0, 1).toUpperCase() + string$2.slice(1);
}
let copy = ((d) => ({ ...d }));
function fromString(string$2) {
	let _idx = 0;
	while (true) {
		let idx = _idx;
		let match = string$2[idx];
		if (match === void 0) return "\"" + string$2 + "\"";
		switch (match) {
			case "\"":
			case "\n": return JSON.stringify(string$2);
			default:
				_idx = idx + 1 | 0;
				continue;
		}
	}
}
function toArray(path) {
	if (path === "") return [];
	else return JSON.parse(path.split("\"][\"").join("\",\""));
}
let vendor = "sury";
let s = Symbol(vendor);
let itemSymbol = Symbol(vendor + ":item");
let $$Error = /* @__PURE__ */ create("Sury.Error");
let constField = "const";
function isOptional(schema$1) {
	switch (schema$1.type) {
		case "undefined": return true;
		case "union": return "undefined" in schema$1.has;
		default: return false;
	}
}
function has(acc, flag) {
	return (acc & flag) !== 0;
}
let flags = {
	unknown: 1,
	string: 2,
	number: 4,
	boolean: 8,
	undefined: 16,
	null: 32,
	object: 64,
	array: 128,
	union: 256,
	ref: 512,
	bigint: 1024,
	nan: 2048,
	"function": 4096,
	instance: 8192,
	never: 16384,
	symbol: 32768
};
function stringify(unknown$2) {
	let tagFlag = flags[typeof unknown$2];
	if (tagFlag & 16) return "undefined";
	if (!(tagFlag & 64)) if (tagFlag & 2) return "\"" + unknown$2 + "\"";
	else if (tagFlag & 1024) return unknown$2 + "n";
	else return unknown$2.toString();
	if (unknown$2 === null) return "null";
	if (Array.isArray(unknown$2)) {
		let string$2 = "[";
		for (let i = 0, i_finish = unknown$2.length; i < i_finish; ++i) {
			if (i !== 0) string$2 = string$2 + ", ";
			string$2 = string$2 + stringify(unknown$2[i]);
		}
		return string$2 + "]";
	}
	if (unknown$2.constructor !== Object) return Object.prototype.toString.call(unknown$2);
	let keys = Object.keys(unknown$2);
	let string$1$1 = "{ ";
	for (let i$1 = 0, i_finish$1 = keys.length; i$1 < i_finish$1; ++i$1) {
		let key = keys[i$1];
		let value = unknown$2[key];
		string$1$1 = string$1$1 + key + ": " + stringify(value) + "; ";
	}
	return string$1$1 + "}";
}
function toExpression$1(schema$1) {
	let tag = schema$1.type;
	let $$const = schema$1.const;
	let name = schema$1.name;
	if (name !== void 0) return name;
	if ($$const !== void 0) return stringify($$const);
	let format = schema$1.format;
	let anyOf = schema$1.anyOf;
	if (anyOf !== void 0) return anyOf.map(toExpression$1).join(" | ");
	if (format !== void 0) return format;
	switch (tag) {
		case "nan": return "NaN";
		case "object":
			let additionalItems = schema$1.additionalItems;
			let properties = schema$1.properties;
			let locations = Object.keys(properties);
			if (locations.length === 0) if (typeof additionalItems === "object") return "{ [key: string]: " + toExpression$1(additionalItems) + "; }";
			else return "{}";
			else return "{ " + locations.map((location) => location + ": " + toExpression$1(properties[location]) + ";").join(" ") + " }";
		default:
			if (schema$1.b) return tag;
			switch (tag) {
				case "instance": return schema$1.class.name;
				case "array":
					let additionalItems$1 = schema$1.additionalItems;
					let items = schema$1.items;
					if (typeof additionalItems$1 !== "object") return "[" + items.map((item) => toExpression$1(item.schema)).join(", ") + "]";
					let itemName = toExpression$1(additionalItems$1);
					return (additionalItems$1.type === "union" ? "(" + itemName + ")" : itemName) + "[]";
				default: return tag;
			}
	}
}
var SuryError = class extends Error {
	constructor(code, flag, path) {
		super();
		this.flag = flag;
		this.code = code;
		this.path = path;
	}
};
var d = Object.defineProperty, p = SuryError.prototype;
d(p, "message", { get() {
	return message(this);
} });
d(p, "reason", { get() {
	return reason(this);
} });
d(p, "name", { value: "SuryError" });
d(p, "s", { value: s });
d(p, "_1", { get() {
	return this;
} });
d(p, "RE_EXN_ID", { value: $$Error });
var Schema = function(type) {
	this.type = type;
}, sp = Object.create(null);
d(sp, "with", { get() {
	return (fn, ...args) => fn(this, ...args);
} });
Schema.prototype = sp;
function getOrRethrow(exn) {
	if (exn && exn.s === s) return exn;
	throw exn;
}
function reason(error, nestedLevelOpt) {
	let nestedLevel = nestedLevelOpt !== void 0 ? nestedLevelOpt : 0;
	let reason$1 = error.code;
	if (typeof reason$1 !== "object") return "Encountered unexpected async transform or refine. Use parseAsyncOrThrow operation instead";
	switch (reason$1.TAG) {
		case "OperationFailed": return reason$1._0;
		case "InvalidOperation": return reason$1.description;
		case "InvalidType":
			let unionErrors = reason$1.unionErrors;
			let m = "Expected " + toExpression$1(reason$1.expected) + ", received " + stringify(reason$1.received);
			if (unionErrors !== void 0) {
				let lineBreak = "\n" + " ".repeat(nestedLevel << 1);
				let reasonsDict = {};
				for (let idx = 0, idx_finish = unionErrors.length; idx < idx_finish; ++idx) {
					let error$1 = unionErrors[idx];
					let reason$2 = reason(error$1, nestedLevel + 1);
					let nonEmptyPath = error$1.path;
					let line = "- " + (nonEmptyPath === "" ? "" : "At " + nonEmptyPath + ": ") + reason$2;
					if (!reasonsDict[line]) {
						reasonsDict[line] = 1;
						m = m + lineBreak + line;
					}
				}
			}
			return m;
		case "UnsupportedTransformation": return "Unsupported transformation from " + toExpression$1(reason$1.from) + " to " + toExpression$1(reason$1.to);
		case "ExcessField": return "Unrecognized key \"" + reason$1._0 + "\"";
		case "InvalidJsonSchema": return toExpression$1(reason$1._0) + " is not valid JSON";
	}
}
function message(error) {
	let op = error.flag;
	let text = "Failed ";
	if (op & 2) text = text + "async ";
	text = text + (op & 1 ? op & 4 ? "asserting" : "parsing" : "converting");
	if (op & 8) text = text + " to JSON" + (op & 16 ? " string" : "");
	let nonEmptyPath = error.path;
	let tmp = nonEmptyPath === "" ? "" : " at " + nonEmptyPath;
	return text + tmp + ": " + reason(error, void 0);
}
let globalConfig = {
	m: message,
	d: void 0,
	a: "strip",
	n: false
};
let shakenRef = "as";
let shakenTraps = { get: (target, prop) => {
	let l = target[shakenRef];
	if (l === void 0) return target[prop];
	if (prop === shakenRef) return target[prop];
	let l$1 = valFromOption(l);
	let message = "Schema S." + l$1 + " is not enabled. To start using it, add S.enable" + capitalize(l$1) + "() at the project root.";
	throw new Error("[Sury] " + message);
} };
function shaken(apiName) {
	let mut = new Schema("never");
	mut[shakenRef] = apiName;
	return new Proxy(mut, shakenTraps);
}
let unknown$1 = new Schema("unknown");
let bool = new Schema("boolean");
let symbol$1 = new Schema("symbol");
let string$1 = new Schema("string");
let int = new Schema("number");
int.format = "int32";
let float = new Schema("number");
let bigint$1 = new Schema("bigint");
let unit = new Schema("undefined");
unit.const = void 0;
let copyWithoutCache = ((schema$1) => {
	let c = new Schema(schema$1.type);
	for (let k in schema$1) if (k > "a" || k === "$ref" || k === "$defs") c[k] = schema$1[k];
	return c;
});
function updateOutput(schema$1, fn) {
	let root = copyWithoutCache(schema$1);
	let mut = root;
	while (mut.to) {
		let next = copyWithoutCache(mut.to);
		mut.to = next;
		mut = next;
	}
	fn(mut);
	return root;
}
let resetCacheInPlace = ((schema$1) => {
	for (let k in schema$1) if (Number(k[0])) delete schema$1[k];
});
let value = SuryError;
function constructor(prim0, prim1, prim2) {
	return new SuryError(prim0, prim1, prim2);
}
let ErrorClass = {
	value,
	constructor
};
function embed(b, value) {
	let e = b.g.e;
	let l = e.length;
	e[l] = value;
	return "e[" + l + "]";
}
function inlineConst(b, schema$1) {
	let tagFlag = flags[schema$1.type];
	let $$const = schema$1.const;
	if (tagFlag & 16) return "void 0";
	else if (tagFlag & 2) return fromString($$const);
	else if (tagFlag & 1024) return $$const + "n";
	else if (tagFlag & 45056) return embed(b, schema$1.const);
	else return $$const;
}
function inlineLocation(b, location) {
	let key = "\"" + location + "\"";
	let i = b.g[key];
	if (i !== void 0) return i;
	let inlinedLocation = fromString(location);
	b.g[key] = inlinedLocation;
	return inlinedLocation;
}
function secondAllocate(v) {
	let b = this;
	b.l = b.l + "," + v;
}
function initialAllocate(v) {
	let b = this;
	b.l = v;
	b.a = secondAllocate;
}
function rootScope(flag, defs) {
	let global$2 = {
		c: "",
		l: "",
		a: initialAllocate,
		v: -1,
		o: flag,
		f: "",
		e: [],
		d: defs
	};
	global$2.g = global$2;
	return global$2;
}
function allocateScope(b) {
	delete b.a;
	let varsAllocation = b.l;
	if (varsAllocation === "") return b.f + b.c;
	else return b.f + "let " + varsAllocation + ";" + b.c;
}
function varWithoutAllocation(global$2) {
	let newCounter = global$2.v + 1;
	global$2.v = newCounter;
	return "v" + newCounter;
}
function _var(_b) {
	return this.i;
}
function _notVar(b) {
	let val = this;
	let v = varWithoutAllocation(b.g);
	let i = val.i;
	if (i === "") val.b.a(v);
	else if (b.a !== void 0) b.a(v + "=" + i);
	else {
		b.c = b.c + (v + "=" + i + ";");
		b.g.a(v);
	}
	val.v = _var;
	val.i = v;
	return v;
}
function allocateVal(b, schema$1) {
	let v = varWithoutAllocation(b.g);
	b.a(v);
	return {
		b,
		v: _var,
		i: v,
		f: 0,
		type: schema$1.type
	};
}
function val(b, initial, schema$1) {
	return {
		b,
		v: _notVar,
		i: initial,
		f: 0,
		type: schema$1.type
	};
}
function constVal(b, schema$1) {
	return {
		b,
		v: _notVar,
		i: inlineConst(b, schema$1),
		f: 0,
		type: schema$1.type,
		const: schema$1.const
	};
}
function asyncVal(b, initial) {
	return {
		b,
		v: _notVar,
		i: initial,
		f: 2,
		type: "unknown"
	};
}
function objectJoin(inlinedLocation, value) {
	return inlinedLocation + ":" + value + ",";
}
function arrayJoin(_inlinedLocation, value) {
	return value + ",";
}
function make(b, isArray) {
	return {
		b,
		v: _notVar,
		i: "",
		f: 0,
		type: isArray ? "array" : "object",
		properties: {},
		additionalItems: "strict",
		j: isArray ? arrayJoin : objectJoin,
		c: 0,
		r: ""
	};
}
function add(objectVal, location, val) {
	let inlinedLocation = inlineLocation(objectVal.b, location);
	objectVal.properties[location] = val;
	if (val.f & 2) {
		objectVal.r = objectVal.r + val.i + ",";
		objectVal.i = objectVal.i + objectVal.j(inlinedLocation, "a[" + objectVal.c++ + "]");
	} else objectVal.i = objectVal.i + objectVal.j(inlinedLocation, val.i);
}
function merge$1(target, subObjectVal) {
	let locations = Object.keys(subObjectVal.properties);
	for (let idx = 0, idx_finish = locations.length; idx < idx_finish; ++idx) {
		let location = locations[idx];
		add(target, location, subObjectVal.properties[location]);
	}
}
function complete(objectVal, isArray) {
	objectVal.i = isArray ? "[" + objectVal.i + "]" : "{" + objectVal.i + "}";
	if (objectVal.c) {
		objectVal.f = objectVal.f | 2;
		objectVal.i = "Promise.all([" + objectVal.r + "]).then(a=>(" + objectVal.i + "))";
	}
	objectVal.additionalItems = "strict";
	return objectVal;
}
function addKey(b, input, key, val) {
	return input.v(b) + "[" + key + "]=" + val.i;
}
function set(b, input, val) {
	if (input === val) return "";
	let inputVar = input.v(b);
	let match = input.f & 2;
	let match$1 = val.f & 2;
	if (match) {
		if (!match$1) return inputVar + "=Promise.resolve(" + val.i + ")";
	} else if (match$1) {
		input.f = input.f | 2;
		return inputVar + "=" + val.i;
	}
	return inputVar + "=" + val.i;
}
function get(b, targetVal, location) {
	let properties = targetVal.properties;
	let val = properties[location];
	if (val !== void 0) return val;
	let schema$1 = targetVal.additionalItems;
	let schema$1$1;
	if (schema$1 === "strip" || schema$1 === "strict") {
		if (schema$1 === "strip") throw new Error("[Sury] The schema doesn't have additional items");
		throw new Error("[Sury] The schema doesn't have additional items");
	} else schema$1$1 = schema$1;
	let val$1 = {
		b,
		v: _notVar,
		i: targetVal.v(b) + ("[" + fromString(location) + "]"),
		f: 0,
		type: schema$1$1.type
	};
	properties[location] = val$1;
	return val$1;
}
function setInlined(b, input, inlined) {
	return input.v(b) + "=" + inlined;
}
function map(inlinedFn, input) {
	return {
		b: input.b,
		v: _notVar,
		i: inlinedFn + "(" + input.i + ")",
		f: 0,
		type: "unknown"
	};
}
function $$throw(b, code, path) {
	throw new SuryError(code, b.g.o, path);
}
function embedSyncOperation(b, input, fn) {
	if (input.f & 2) return asyncVal(input.b, input.i + ".then(" + embed(b, fn) + ")");
	else return map(embed(b, fn), input);
}
function failWithArg(b, path, fn, arg) {
	return embed(b, (arg$1) => $$throw(b, fn(arg$1), path)) + "(" + arg + ")";
}
function fail(b, message, path) {
	return embed(b, () => $$throw(b, {
		TAG: "OperationFailed",
		_0: message
	}, path)) + "()";
}
function effectCtx(b, selfSchema, path) {
	return {
		schema: selfSchema,
		fail: (message, customPathOpt) => {
			return $$throw(b, {
				TAG: "OperationFailed",
				_0: message
			}, path + (customPathOpt !== void 0 ? customPathOpt : ""));
		}
	};
}
function invalidOperation(b, path, description) {
	return $$throw(b, {
		TAG: "InvalidOperation",
		description
	}, path);
}
function withPathPrepend(b, input, path, maybeDynamicLocationVar, appendSafe, fn) {
	if (path === "" && maybeDynamicLocationVar === void 0) return fn(b, input, path);
	try {
		let $$catch = (b$1, errorVar$1) => {
			b$1.c = errorVar$1 + ".path=" + fromString(path) + "+" + (maybeDynamicLocationVar !== void 0 ? "'[\"'+" + maybeDynamicLocationVar + "+'\"]'+" : "") + errorVar$1 + ".path";
		};
		let fn$1 = (b$1) => fn(b$1, input, "");
		let prevCode = b.c;
		b.c = "";
		let errorVar = varWithoutAllocation(b.g);
		let maybeResolveVal = $$catch(b, errorVar);
		let catchCode = "if(" + (errorVar + "&&" + errorVar + ".s===s") + "){" + b.c;
		b.c = "";
		let bb = {
			c: "",
			l: "",
			a: initialAllocate,
			f: "",
			g: b.g
		};
		let fnOutput = fn$1(bb);
		b.c = b.c + allocateScope(bb);
		let isNoop = fnOutput.i === input.i && b.c === "";
		if (appendSafe !== void 0) appendSafe(b, fnOutput);
		if (isNoop) return fnOutput;
		let isAsync = fnOutput.f & 2;
		let output = input === fnOutput ? input : appendSafe !== void 0 ? fnOutput : {
			b,
			v: _notVar,
			i: "",
			f: isAsync ? 2 : 0,
			type: "unknown"
		};
		let catchCode$1 = maybeResolveVal !== void 0 ? (catchLocation) => catchCode + (catchLocation === 1 ? "return " + maybeResolveVal.i : set(b, output, maybeResolveVal)) + ("}else{throw " + errorVar + "}") : (param) => catchCode + "}throw " + errorVar;
		b.c = prevCode + ("try{" + b.c + (isAsync ? setInlined(b, output, fnOutput.i + ".catch(" + errorVar + "=>{" + catchCode$1(1) + "})") : set(b, output, fnOutput)) + "}catch(" + errorVar + "){" + catchCode$1(0) + "}");
		return output;
	} catch (exn) {
		let error = getOrRethrow(exn);
		throw new SuryError(error.code, error.flag, path + "[]" + error.path);
	}
}
function validation(b, inputVar, schema$1, negative) {
	let eq = negative ? "!==" : "===";
	let and_ = negative ? "||" : "&&";
	let exp = negative ? "!" : "";
	let tag = schema$1.type;
	let tagFlag = flags[tag];
	if (tagFlag & 2048) return exp + ("Number.isNaN(" + inputVar + ")");
	if (constField in schema$1) return inputVar + eq + inlineConst(b, schema$1);
	if (tagFlag & 4) return "typeof " + inputVar + eq + "\"" + tag + "\"";
	if (tagFlag & 64) return "typeof " + inputVar + eq + "\"" + tag + "\"" + and_ + exp + inputVar;
	if (tagFlag & 128) return exp + "Array.isArray(" + inputVar + ")";
	if (!(tagFlag & 8192)) return "typeof " + inputVar + eq + "\"" + tag + "\"";
	let c = inputVar + " instanceof " + embed(b, schema$1.class);
	if (negative) return "!(" + c + ")";
	else return c;
}
function refinement(b, inputVar, schema$1, negative) {
	let eq = negative ? "!==" : "===";
	let and_ = negative ? "||" : "&&";
	let not_ = negative ? "" : "!";
	let lt = negative ? ">" : "<";
	let gt = negative ? "<" : ">";
	let match = schema$1.type;
	let tag;
	let exit = 0;
	if (schema$1.const !== void 0) return "";
	let match$2 = schema$1.format;
	if (match$2 !== void 0) switch (match$2) {
		case "int32": return and_ + inputVar + lt + "2147483647" + and_ + inputVar + gt + "-2147483648" + and_ + inputVar + "%1" + eq + "0";
		case "port":
		case "json":
			exit = 2;
			break;
	}
	else exit = 2;
	if (exit === 2) switch (match) {
		case "number": if (globalConfig.n) return "";
		else return and_ + not_ + "Number.isNaN(" + inputVar + ")";
		case "array":
		case "object":
			tag = match;
			break;
		default: return "";
	}
	let additionalItems = schema$1.additionalItems;
	let items = schema$1.items;
	let length$2 = items.length;
	let code = tag === "array" ? additionalItems === "strip" || additionalItems === "strict" ? additionalItems === "strip" ? and_ + inputVar + ".length" + gt + length$2 : and_ + inputVar + ".length" + eq + length$2 : "" : additionalItems === "strip" ? "" : and_ + not_ + "Array.isArray(" + inputVar + ")";
	for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
		let match$3 = items[idx];
		let location = match$3.location;
		let item = match$3.schema;
		let itemCode;
		if (constField in item || schema$1.unnest) itemCode = validation(b, inputVar + ("[" + inlineLocation(b, location) + "]"), item, negative);
		else if (item.items) {
			let inputVar$1 = inputVar + ("[" + inlineLocation(b, location) + "]");
			itemCode = validation(b, inputVar$1, item, negative) + refinement(b, inputVar$1, item, negative);
		} else itemCode = "";
		if (itemCode !== "") code = code + and_ + itemCode;
	}
	return code;
}
function makeRefinedOf(b, input, schema$1) {
	let mut = {
		b,
		v: input.v,
		i: input.i,
		f: input.f,
		type: schema$1.type
	};
	let loop = (mut$1, schema$2) => {
		if (constField in schema$2) mut$1.const = schema$2.const;
		let items = schema$2.items;
		if (items === void 0) return;
		let properties = {};
		items.forEach((item) => {
			let schema$3 = item.schema;
			let isConst = constField in schema$3;
			if (!(isConst || schema$3.items)) return;
			let tmp;
			if (isConst) tmp = inlineConst(b, schema$3);
			else {
				let inlinedLocation = inlineLocation(b, item.location);
				tmp = mut$1.v(b) + ("[" + inlinedLocation + "]");
			}
			let mut$1$1 = {
				b: mut$1.b,
				v: _notVar,
				i: tmp,
				f: 0,
				type: schema$3.type
			};
			loop(mut$1$1, schema$3);
			properties[item.location] = mut$1$1;
		});
		mut$1.properties = properties;
		mut$1.additionalItems = unknown$1;
	};
	loop(mut, schema$1);
	return mut;
}
function typeFilterCode(b, schema$1, input, path) {
	if (schema$1.noValidation || flags[schema$1.type] & 17153) return "";
	let inputVar = input.v(b);
	return "if(" + validation(b, inputVar, schema$1, true) + refinement(b, inputVar, schema$1, true) + "){" + failWithArg(b, path, (input$1) => ({
		TAG: "InvalidType",
		expected: schema$1,
		received: input$1
	}), inputVar) + "}";
}
function unsupportedTransform(b, from, target, path) {
	return $$throw(b, {
		TAG: "UnsupportedTransformation",
		from,
		to: target
	}, path);
}
function noopOperation(i) {
	return i;
}
function setHas(has, tag) {
	has[tag === "union" || tag === "ref" ? "unknown" : tag] = true;
}
let jsonName = "JSON";
let jsonString$1 = shaken("jsonString");
function inputToString(b, input) {
	return val(b, "\"\"+" + input.i, string$1);
}
function parse(prevB, schema$1, inputArg, path) {
	let b = {
		c: "",
		l: "",
		a: initialAllocate,
		f: "",
		g: prevB.g
	};
	if (schema$1.$defs) b.g.d = schema$1.$defs;
	let input = inputArg;
	let isFromLiteral = constField in input;
	let isSchemaLiteral = constField in schema$1;
	let isSameTag = input.type === schema$1.type;
	let schemaTagFlag = flags[schema$1.type];
	let inputTagFlag = flags[input.type];
	let isUnsupported = false;
	if (!(schemaTagFlag & 257 || schema$1.format === "json")) {
		if (schema$1.name === jsonName && !(inputTagFlag & 1)) {
			if (!(inputTagFlag & 14)) if (inputTagFlag & 1024) input = inputToString(b, input);
			else isUnsupported = true;
		} else if (isSchemaLiteral) if (isFromLiteral) {
			if (input.const !== schema$1.const) input = constVal(b, schema$1);
		} else if (inputTagFlag & 2 && schemaTagFlag & 3132) {
			let inputVar = input.v(b);
			b.f = schema$1.noValidation ? "" : input.i + "===\"" + schema$1.const + "\"||" + failWithArg(b, path, (input$1) => ({
				TAG: "InvalidType",
				expected: schema$1,
				received: input$1
			}), inputVar) + ";";
			input = constVal(b, schema$1);
		} else if (schema$1.noValidation) input = constVal(b, schema$1);
		else {
			b.f = typeFilterCode(prevB, schema$1, input, path);
			input.type = schema$1.type;
			input.const = schema$1.const;
		}
		else if (isFromLiteral && !isSchemaLiteral) {
			if (!isSameTag) if (schemaTagFlag & 2 && inputTagFlag & 3132) {
				let $$const = "" + input.const;
				input = {
					b,
					v: _notVar,
					i: "\"" + $$const + "\"",
					f: 0,
					type: "string",
					const: $$const
				};
			} else isUnsupported = true;
		} else if (inputTagFlag & 1) {
			let ref = schema$1.$ref;
			if (ref !== void 0) {
				let defs = b.g.d;
				let identifier = ref.slice(8);
				let def = defs[identifier];
				let flag = schema$1.noValidation ? (b.g.o | 1) ^ 1 : b.g.o;
				let fn = def[flag];
				let recOperation;
				if (fn !== void 0) {
					let fn$1 = valFromOption(fn);
					recOperation = fn$1 === 0 ? embed(b, def) + ("[" + flag + "]") : embed(b, fn$1);
				} else {
					def[flag] = 0;
					let fn$2 = internalCompile(def, flag, b.g.d);
					def[flag] = fn$2;
					recOperation = embed(b, fn$2);
				}
				input = withPathPrepend(b, input, path, void 0, void 0, (param, input$1, param$1) => {
					let output = map(recOperation, input$1);
					if (def.isAsync === void 0) {
						let defsMut = copy(defs);
						defsMut[identifier] = unknown$1;
						isAsyncInternal(def, defsMut);
					}
					if (def.isAsync) output.f = output.f | 2;
					return output;
				});
				input.v(b);
			} else {
				if (b.g.o & 1) b.f = typeFilterCode(prevB, schema$1, input, path);
				let refined = makeRefinedOf(b, input, schema$1);
				input.type = refined.type;
				input.i = refined.i;
				input.v = refined.v;
				input.additionalItems = refined.additionalItems;
				input.properties = refined.properties;
				if (constField in refined) input.const = refined.const;
			}
		} else if (schemaTagFlag & 2 && inputTagFlag & 1036) input = inputToString(b, input);
		else if (!isSameTag) if (inputTagFlag & 2) {
			let inputVar$1 = input.v(b);
			if (schemaTagFlag & 8) {
				let output = allocateVal(b, schema$1);
				b.c = b.c + ("(" + output.i + "=" + inputVar$1 + "===\"true\")||" + inputVar$1 + "===\"false\"||" + failWithArg(b, path, (input$1) => ({
					TAG: "InvalidType",
					expected: schema$1,
					received: input$1
				}), inputVar$1) + ";");
				input = output;
			} else if (schemaTagFlag & 4) {
				let output$1 = val(b, "+" + inputVar$1, schema$1);
				let outputVar = output$1.v(b);
				let match = schema$1.format;
				b.c = b.c + (match !== void 0 ? "(" + refinement(b, outputVar, schema$1, true).slice(2) + ")" : "Number.isNaN(" + outputVar + ")") + ("&&" + failWithArg(b, path, (input$1) => ({
					TAG: "InvalidType",
					expected: schema$1,
					received: input$1
				}), inputVar$1) + ";");
				input = output$1;
			} else if (schemaTagFlag & 1024) {
				let output$2 = allocateVal(b, schema$1);
				b.c = b.c + ("try{" + output$2.i + "=BigInt(" + inputVar$1 + ")}catch(_){" + failWithArg(b, path, (input$1) => ({
					TAG: "InvalidType",
					expected: schema$1,
					received: input$1
				}), inputVar$1) + "}");
				input = output$2;
			} else isUnsupported = true;
		} else if (inputTagFlag & 4 && schemaTagFlag & 1024) input = val(b, "BigInt(" + input.i + ")", schema$1);
		else isUnsupported = true;
	}
	if (isUnsupported) unsupportedTransform(b, input, schema$1, path);
	let compiler = schema$1.compiler;
	if (compiler !== void 0) input = compiler(b, input, schema$1, path);
	if (input.t !== true) {
		let refiner = schema$1.refiner;
		if (refiner !== void 0) b.c = b.c + refiner(b, input.v(b), schema$1, path);
	}
	let to$2 = schema$1.to;
	if (to$2 !== void 0) {
		let parser = schema$1.parser;
		if (parser !== void 0) input = parser(b, input, schema$1, path);
		if (input.t !== true) input = parse(b, to$2, input, path);
	}
	prevB.c = prevB.c + allocateScope(b);
	return input;
}
function getOutputSchema(_schema) {
	while (true) {
		let schema$1 = _schema;
		let to$2 = schema$1.to;
		if (to$2 === void 0) return schema$1;
		_schema = to$2;
		continue;
	}
}
function jsonableValidation(output, parent, path, flag) {
	let tagFlag = flags[output.type];
	if (tagFlag & 48129 || tagFlag & 16 && parent.type !== "object") throw new SuryError({
		TAG: "InvalidJsonSchema",
		_0: parent
	}, flag, path);
	if (tagFlag & 256) {
		output.anyOf.forEach((s) => jsonableValidation(s, parent, path, flag));
		return;
	}
	if (!(tagFlag & 192)) return;
	let additionalItems = output.additionalItems;
	if (additionalItems === "strip" || additionalItems === "strict");
	else jsonableValidation(additionalItems, parent, path, flag);
	let p = output.properties;
	if (p !== void 0) {
		let keys = Object.keys(p);
		for (let idx = 0, idx_finish = keys.length; idx < idx_finish; ++idx) {
			let key = keys[idx];
			jsonableValidation(p[key], parent, path, flag);
		}
		return;
	}
	output.items.forEach((item) => jsonableValidation(item.schema, output, path + ("[" + fromString(item.location) + "]"), flag));
}
function reverse$1(schema$1) {
	let reversedHead;
	let current = schema$1;
	while (current) {
		let mut = copyWithoutCache(current);
		let next = mut.to;
		let to$2 = reversedHead;
		if (to$2 !== void 0) mut.to = to$2;
		else delete mut.to;
		let parser = mut.parser;
		let serializer = mut.serializer;
		if (serializer !== void 0) mut.parser = serializer;
		else delete mut.parser;
		if (parser !== void 0) mut.serializer = parser;
		else delete mut.serializer;
		let fromDefault = mut.fromDefault;
		let $$default = mut.default;
		if ($$default !== void 0) mut.fromDefault = $$default;
		else delete mut.fromDefault;
		if (fromDefault !== void 0) mut.default = fromDefault;
		else delete mut.default;
		let items = mut.items;
		if (items !== void 0) {
			let properties = {};
			let newItems = new Array(items.length);
			for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
				let item = items[idx];
				let reversed_schema = reverse$1(item.schema);
				let reversed = {
					schema: reversed_schema,
					location: item.location
				};
				if (item.r) reversed.r = item.r;
				properties[item.location] = reversed_schema;
				newItems[idx] = reversed;
			}
			mut.items = newItems;
			if (mut.properties !== void 0) mut.properties = properties;
		}
		if (typeof mut.additionalItems === "object") mut.additionalItems = reverse$1(mut.additionalItems);
		let anyOf = mut.anyOf;
		if (anyOf !== void 0) {
			let has = {};
			let newAnyOf = [];
			for (let idx$1 = 0, idx_finish$1 = anyOf.length; idx$1 < idx_finish$1; ++idx$1) {
				let s = anyOf[idx$1];
				let reversed$1 = reverse$1(s);
				newAnyOf.push(reversed$1);
				setHas(has, reversed$1.type);
			}
			mut.has = has;
			mut.anyOf = newAnyOf;
		}
		let defs = mut.$defs;
		if (defs !== void 0) {
			let reversedDefs = {};
			for (let idx$2 = 0, idx_finish$2 = Object.keys(defs).length; idx$2 < idx_finish$2; ++idx$2) {
				let key = Object.keys(defs)[idx$2];
				reversedDefs[key] = reverse$1(defs[key]);
			}
			mut.$defs = reversedDefs;
		}
		reversedHead = mut;
		current = next;
	}
	return reversedHead;
}
function internalCompile(schema$1, flag, defs) {
	let b = rootScope(flag, defs);
	if (flag & 8) {
		let output = reverse$1(schema$1);
		jsonableValidation(output, output, "", flag);
	}
	let input = {
		b,
		v: _var,
		i: "i",
		f: 0,
		type: "unknown"
	};
	let schema$1$1 = flag & 4 ? updateOutput(schema$1, (mut) => {
		let t = new Schema(unit.type);
		t.const = unit.const;
		t.noValidation = true;
		mut.to = t;
	}) : flag & 16 ? updateOutput(schema$1, (mut) => {
		mut.to = jsonString$1;
	}) : schema$1;
	let output$1 = parse(b, schema$1$1, input, "");
	let code = allocateScope(b);
	let isAsync = has(output$1.f, 2);
	schema$1$1.isAsync = isAsync;
	if (code === "" && output$1 === input && !(flag & 2)) return noopOperation;
	let inlinedOutput = output$1.i;
	if (flag & 2 && !isAsync && !defs) inlinedOutput = "Promise.resolve(" + inlinedOutput + ")";
	let inlinedFunction = "i=>{" + code + "return " + inlinedOutput + "}";
	let ctxVarValue1 = b.g.e;
	return new Function("e", "s", "return " + inlinedFunction)(ctxVarValue1, s);
}
function isAsyncInternal(schema$1, defs) {
	try {
		let b = rootScope(2, defs);
		let isAsync = has(parse(b, schema$1, {
			b,
			v: _var,
			i: "i",
			f: 0,
			type: "unknown"
		}, "").f, 2);
		schema$1.isAsync = isAsync;
		return isAsync;
	} catch (exn) {
		getOrRethrow(exn);
		return false;
	}
}
function operationFn(s, o) {
	if (o in s) return s[o];
	let f = internalCompile(o & 32 ? reverse$1(s) : s, o, 0);
	s[o] = f;
	return f;
}
d(sp, "~standard", { get: function() {
	let schema$1 = this;
	return {
		version: 1,
		vendor,
		validate: (input) => {
			try {
				return { value: operationFn(schema$1, 1)(input) };
			} catch (exn) {
				let error = getOrRethrow(exn);
				return { issues: [{
					message: reason(error, void 0),
					path: error.path === "" ? void 0 : toArray(error.path)
				}] };
			}
		}
	};
} });
function compile$1(schema$1, input, output, mode, typeValidationOpt) {
	let typeValidation = typeValidationOpt !== void 0 ? typeValidationOpt : true;
	let flag = 0;
	let exit = 0;
	switch (output) {
		case "Output":
		case "Input":
			exit = 1;
			break;
		case "Assert":
			flag = flag | 4;
			break;
		case "Json":
			flag = flag | 8;
			break;
		case "JsonString":
			flag = flag | 24;
			break;
	}
	if (exit === 1 && output === input) throw new Error("[Sury] Can't compile operation to converting value to self");
	if (mode !== "Sync") flag = flag | 2;
	if (typeValidation) flag = flag | 1;
	if (input === "Output") flag = flag | 32;
	let fn = operationFn(schema$1, flag);
	if (input !== "JsonString") return fn;
	let flag$1 = flag;
	return (jsonString$2) => {
		try {
			return fn(JSON.parse(jsonString$2));
		} catch (exn) {
			throw new SuryError({
				TAG: "OperationFailed",
				_0: exn.message
			}, flag$1, "");
		}
	};
}
function parseOrThrow$1(any$1, schema$1) {
	return operationFn(schema$1, 1)(any$1);
}
function parseJsonStringOrThrow$1(jsonString$2, schema$1) {
	let tmp;
	try {
		tmp = JSON.parse(jsonString$2);
	} catch (exn) {
		throw new SuryError({
			TAG: "OperationFailed",
			_0: exn.message
		}, 1, "");
	}
	return parseOrThrow$1(tmp, schema$1);
}
function parseAsyncOrThrow$1(any$1, schema$1) {
	return operationFn(schema$1, 3)(any$1);
}
function convertOrThrow$1(input, schema$1) {
	return operationFn(schema$1, 0)(input);
}
function convertToJsonOrThrow$1(any$1, schema$1) {
	return operationFn(schema$1, 8)(any$1);
}
function convertToJsonStringOrThrow$1(input, schema$1) {
	return operationFn(schema$1, 24)(input);
}
function reverseConvertOrThrow$1(value, schema$1) {
	return operationFn(schema$1, 32)(value);
}
function reverseConvertToJsonOrThrow$1(value, schema$1) {
	return operationFn(schema$1, 40)(value);
}
function reverseConvertToJsonStringOrThrow$1(value, schema$1, spaceOpt) {
	let space = spaceOpt !== void 0 ? spaceOpt : 0;
	return JSON.stringify(reverseConvertToJsonOrThrow$1(value, schema$1), null, space);
}
function assertOrThrow$1(any$1, schema$1) {
	return operationFn(schema$1, 5)(any$1);
}
let $$null = new Schema("null");
$$null.const = null;
function parse$1(value) {
	if (value === null) return $$null;
	let $$typeof = typeof value;
	let schema$1;
	if ($$typeof === "object") {
		let i = new Schema("instance");
		i.class = value.constructor;
		schema$1 = i;
	} else schema$1 = $$typeof === "undefined" ? unit : $$typeof === "number" ? Number.isNaN(value) ? new Schema("nan") : new Schema($$typeof) : new Schema($$typeof);
	schema$1.const = value;
	return schema$1;
}
function wrapExnToFailure(exn) {
	if (exn && exn.s === s) return {
		success: false,
		error: exn
	};
	throw exn;
}
function js_safe(fn) {
	try {
		return {
			success: true,
			value: fn()
		};
	} catch (exn) {
		return wrapExnToFailure(exn);
	}
}
function js_safeAsync(fn) {
	try {
		return fn().then((value) => ({
			success: true,
			value
		}), wrapExnToFailure);
	} catch (exn) {
		return Promise.resolve(wrapExnToFailure(exn));
	}
}
function set$1(schema$1, id, metadata) {
	let mut = copyWithoutCache(schema$1);
	mut[id] = metadata;
	return mut;
}
let defsPath = "#/$defs/";
function recursive$1(name, fn) {
	let ref = defsPath + name;
	let refSchema = new Schema("ref");
	refSchema.$ref = ref;
	refSchema.name = name;
	let isNestedRec = globalConfig.d;
	if (!isNestedRec) globalConfig.d = {};
	let def = fn(refSchema);
	if (def.name) refSchema.name = def.name;
	else def.name = name;
	globalConfig.d[name] = def;
	if (isNestedRec) return refSchema;
	let schema$1 = new Schema("ref");
	schema$1.name = def.name;
	schema$1.$ref = ref;
	schema$1.$defs = globalConfig.d;
	globalConfig.d = void 0;
	return schema$1;
}
function noValidation$1(schema$1, value) {
	let mut = copyWithoutCache(schema$1);
	mut.noValidation = value;
	return mut;
}
function appendRefiner(maybeExistingRefiner, refiner) {
	if (maybeExistingRefiner !== void 0) return (b, inputVar, selfSchema, path) => maybeExistingRefiner(b, inputVar, selfSchema, path) + refiner(b, inputVar, selfSchema, path);
	else return refiner;
}
function internalRefine(schema$1, refiner) {
	return updateOutput(schema$1, (mut) => {
		mut.refiner = appendRefiner(mut.refiner, refiner);
	});
}
function refine$1(schema$1, refiner) {
	return internalRefine(schema$1, (b, inputVar, selfSchema, path) => embed(b, refiner(effectCtx(b, selfSchema, path))) + "(" + inputVar + ");");
}
function addRefinement(schema$1, metadataId, refinement, refiner) {
	let refinements = schema$1[metadataId];
	return internalRefine(set$1(schema$1, metadataId, refinements !== void 0 ? refinements.concat(refinement) : [refinement]), refiner);
}
function transform$1(schema$1, transformer) {
	return updateOutput(schema$1, (mut) => {
		mut.parser = (b, input, selfSchema, path) => {
			let match = transformer(effectCtx(b, selfSchema, path));
			let parser = match.p;
			if (parser !== void 0) if (match.a !== void 0) return invalidOperation(b, path, "The S.transform doesn't allow parser and asyncParser at the same time. Remove parser in favor of asyncParser");
			else return embedSyncOperation(b, input, parser);
			let asyncParser = match.a;
			if (asyncParser !== void 0) {
				if (!(b.g.o & 2)) $$throw(b, "UnexpectedAsync", "");
				let val = embedSyncOperation(b, input, asyncParser);
				val.f = val.f | 2;
				return val;
			} else if (match.s !== void 0) return invalidOperation(b, path, "The S.transform parser is missing");
			else return input;
		};
		let to$2 = new Schema("unknown");
		mut.to = (to$2.serializer = (b, input, selfSchema, path) => {
			let match = transformer(effectCtx(b, selfSchema, path));
			let serializer = match.s;
			if (serializer !== void 0) return embedSyncOperation(b, input, serializer);
			else if (match.a !== void 0 || match.p !== void 0) return invalidOperation(b, path, "The S.transform serializer is missing");
			else return input;
		}, to$2);
		delete mut.isAsync;
	});
}
let nullAsUnit = new Schema("null");
nullAsUnit.const = null;
nullAsUnit.to = unit;
function neverBuilder(b, input, selfSchema, path) {
	b.c = b.c + failWithArg(b, path, (input$1) => ({
		TAG: "InvalidType",
		expected: selfSchema,
		received: input$1
	}), input.i) + ";";
	return input;
}
let never$1 = new Schema("never");
never$1.compiler = neverBuilder;
let nestedLoc = "BS_PRIVATE_NESTED_SOME_NONE";
function getItemCode(b, schema$1, input, output, deopt, path) {
	try {
		let globalFlag = b.g.o;
		if (deopt) b.g.o = globalFlag | 1;
		let bb = {
			c: "",
			l: "",
			a: initialAllocate,
			f: "",
			g: b.g
		};
		let input$1 = deopt ? copy(input) : makeRefinedOf(bb, input, schema$1);
		let itemOutput = parse(bb, schema$1, input$1, path);
		if (itemOutput !== input$1) {
			itemOutput.b = bb;
			if (itemOutput.f & 2) output.f = output.f | 2;
			bb.c = bb.c + (output.v(b) + "=" + itemOutput.i);
		}
		b.g.o = globalFlag;
		return allocateScope(bb);
	} catch (exn) {
		return "throw " + embed(b, getOrRethrow(exn));
	}
}
function isPriority(tagFlag, byKey) {
	if (tagFlag & 8320 && "object" in byKey) return true;
	else if (tagFlag & 2048) return "number" in byKey;
	else return false;
}
function isWiderUnionSchema(schemaAnyOf, inputAnyOf) {
	return inputAnyOf.every((inputSchema, idx) => {
		let schema$1 = schemaAnyOf[idx];
		if (schema$1 !== void 0 && !(flags[inputSchema.type] & 9152) && inputSchema.type === schema$1.type) return inputSchema.const === schema$1.const;
		else return false;
	});
}
function compiler(b, input, selfSchema, path) {
	let schemas = selfSchema.anyOf;
	let inputAnyOf = input.anyOf;
	if (inputAnyOf !== void 0) if (isWiderUnionSchema(schemas, inputAnyOf)) return input;
	else return unsupportedTransform(b, input, selfSchema, path);
	let fail = (caught$1) => embed(b, function() {
		let args = arguments;
		return $$throw(b, {
			TAG: "InvalidType",
			expected: selfSchema,
			received: args[0],
			unionErrors: args.length > 1 ? Array.from(args).slice(1) : void 0
		}, path);
	}) + "(" + input.v(b) + caught$1 + ")";
	let typeValidation = b.g.o & 1;
	let initialInline = input.i;
	let deoptIdx = -1;
	let lastIdx = schemas.length - 1 | 0;
	let byKey = {};
	let keys = [];
	for (let idx = 0; idx <= lastIdx; ++idx) {
		let target = selfSchema.to;
		let schema$1 = target !== void 0 && !selfSchema.parser && target.type !== "union" ? updateOutput(schemas[idx], (mut) => {
			let refiner = selfSchema.refiner;
			if (refiner !== void 0) mut.refiner = appendRefiner(mut.refiner, refiner);
			mut.to = target;
		}) : schemas[idx];
		let tag = schema$1.type;
		let tagFlag = flags[tag];
		if (!(tagFlag & 16 && "fromDefault" in selfSchema)) if (tagFlag & 17153 || !(flags[input.type] & 1) && input.type !== tag) {
			deoptIdx = idx;
			byKey = {};
			keys = [];
		} else {
			let key = tagFlag & 8192 ? schema$1.class.name : tag;
			let arr = byKey[key];
			if (arr !== void 0) {
				if (tagFlag & 64 && nestedLoc in schema$1.properties) arr.unshift(schema$1);
				else if (!(tagFlag & 2096)) arr.push(schema$1);
			} else {
				if (isPriority(tagFlag, byKey)) keys.unshift(key);
				else keys.push(key);
				byKey[key] = [schema$1];
			}
		}
	}
	let deoptIdx$1 = deoptIdx;
	let byKey$1 = byKey;
	let keys$1 = keys;
	let start = "";
	let end = "";
	let caught = "";
	let exit = false;
	if (deoptIdx$1 !== -1) {
		for (let idx$1 = 0; idx$1 <= deoptIdx$1; ++idx$1) if (!exit) {
			let schema$1 = schemas[idx$1];
			let itemCode = getItemCode(b, schema$1, input, input, true, path);
			if (itemCode) {
				let errorVar = "e" + idx$1;
				start = start + ("try{" + itemCode + "}catch(" + errorVar + "){");
				end = "}" + end;
				caught = caught + "," + errorVar;
			} else exit = true;
		}
	}
	if (!exit) {
		let nextElse = false;
		let noop = "";
		for (let idx$2 = 0, idx_finish = keys$1.length; idx$2 < idx_finish; ++idx$2) {
			let schemas$1 = byKey$1[keys$1[idx$2]];
			let isMultiple = schemas$1.length > 1;
			let firstSchema = schemas$1[0];
			let cond = 0;
			let body;
			if (isMultiple) {
				let inputVar = input.v(b);
				let itemStart = "";
				let itemEnd = "";
				let itemNextElse = false;
				let itemNoop = { contents: "" };
				let caught$1 = "";
				let byDiscriminant = {};
				let itemIdx = 0;
				let lastIdx$1 = schemas$1.length - 1 | 0;
				while (itemIdx <= lastIdx$1) {
					let schema$2 = schemas$1[itemIdx];
					let itemCond = (constField in schema$2 ? validation(b, inputVar, schema$2, false) : "") + refinement(b, inputVar, schema$2, false).slice(2);
					let itemCode$1 = getItemCode(b, schema$2, input, input, false, path);
					if (itemCond) if (itemCode$1) {
						let match = byDiscriminant[itemCond];
						if (match !== void 0) if (typeof match === "string") byDiscriminant[itemCond] = [match, itemCode$1];
						else match.push(itemCode$1);
						else byDiscriminant[itemCond] = itemCode$1;
					} else itemNoop.contents = itemNoop.contents ? itemNoop.contents + "||" + itemCond : itemCond;
					if (!itemCond || itemIdx === lastIdx$1) {
						let accedDiscriminants = Object.keys(byDiscriminant);
						for (let idx$3 = 0, idx_finish$1 = accedDiscriminants.length; idx$3 < idx_finish$1; ++idx$3) {
							let discrim = accedDiscriminants[idx$3];
							itemStart = itemStart + (itemNextElse ? "else if" : "if") + ("(" + discrim + "){");
							let code = byDiscriminant[discrim];
							if (typeof code === "string") itemStart = itemStart + code + "}";
							else {
								let caught$2 = "";
								for (let idx$4 = 0, idx_finish$2 = code.length; idx$4 < idx_finish$2; ++idx$4) {
									let code$1 = code[idx$4];
									let errorVar$1 = "e" + idx$4;
									itemStart = itemStart + ("try{" + code$1 + "}catch(" + errorVar$1 + "){");
									caught$2 = caught$2 + "," + errorVar$1;
								}
								itemStart = itemStart + fail(caught$2) + "}".repeat(code.length) + "}";
							}
							itemNextElse = true;
						}
						byDiscriminant = {};
					}
					if (!itemCond) if (itemCode$1) {
						if (itemNoop.contents) {
							itemStart = itemStart + (itemNextElse ? "else if" : "if") + ("(!(" + itemNoop.contents + ")){");
							itemEnd = "}" + itemEnd;
							itemNoop.contents = "";
							itemNextElse = false;
						}
						let errorVar$2 = "e" + itemIdx;
						itemStart = itemStart + ((itemNextElse ? "else{" : "") + "try{" + itemCode$1 + "}catch(" + errorVar$2 + "){");
						itemEnd = (itemNextElse ? "}" : "") + "}" + itemEnd;
						caught$1 = caught$1 + "," + errorVar$2;
						itemNextElse = false;
					} else {
						itemNoop.contents = "";
						itemIdx = lastIdx$1;
					}
					itemIdx = itemIdx + 1;
				}
				cond = (inputVar$1) => validation(b, inputVar$1, {
					type: firstSchema.type,
					parser: 0
				}, false);
				if (itemNoop.contents) if (itemStart) {
					if (typeValidation) itemStart = itemStart + (itemNextElse ? "else if" : "if") + ("(!(" + itemNoop.contents + ")){" + fail(caught$1) + "}");
				} else {
					let condBefore = cond;
					cond = (inputVar$1) => condBefore(inputVar$1) + ("&&(" + itemNoop.contents + ")");
				}
				else if (typeValidation && itemStart) {
					let errorCode = fail(caught$1);
					itemStart = itemStart + (itemNextElse ? "else{" + errorCode + "}" : errorCode);
				}
				body = itemStart + itemEnd;
			} else {
				cond = (inputVar) => validation(b, inputVar, firstSchema, false) + refinement(b, inputVar, firstSchema, false);
				body = getItemCode(b, firstSchema, input, input, false, path);
			}
			if (body || isPriority(flags[firstSchema.type], byKey$1)) {
				start = start + (nextElse ? "else if" : "if") + ("(" + cond(input.v(b)) + "){" + body + "}");
				nextElse = true;
			} else if (typeValidation) {
				let cond$1 = cond(input.v(b));
				noop = noop ? noop + "||" + cond$1 : cond$1;
			}
		}
		if (typeValidation || deoptIdx$1 === lastIdx) {
			let errorCode$1 = fail(caught);
			let tmp;
			if (noop) tmp = (nextElse ? "else if" : "if") + ("(!(" + noop + ")){" + errorCode$1 + "}");
			else tmp = nextElse ? "else{" + errorCode$1 + "}" : errorCode$1;
			start = start + tmp;
		}
	}
	b.c = b.c + start + end;
	let o = input.f & 2 ? asyncVal(b, "Promise.resolve(" + input.i + ")") : input.v === _var ? b.c === "" && input.b.c === "" && (input.b.l === input.i + "=" + initialInline || initialInline === "i") ? (input.b.l = "", input.b.a = initialAllocate, input.v = _notVar, input.i = initialInline, input) : copy(input) : input;
	o.anyOf = selfSchema.anyOf;
	let to$2 = selfSchema.to;
	o.type = to$2 !== void 0 && to$2.type !== "union" ? (o.t = true, getOutputSchema(to$2).type) : "union";
	return o;
}
function factory(schemas) {
	let len = schemas.length;
	if (len === 1) return schemas[0];
	if (len !== 0) {
		let has = {};
		let anyOf = /* @__PURE__ */ new Set();
		for (let idx = 0, idx_finish = schemas.length; idx < idx_finish; ++idx) {
			let schema$1 = schemas[idx];
			if (schema$1.type === "union" && schema$1.to === void 0) {
				schema$1.anyOf.forEach((item) => {
					anyOf.add(item);
				});
				Object.assign(has, schema$1.has);
			} else {
				anyOf.add(schema$1);
				setHas(has, schema$1.type);
			}
		}
		let mut = new Schema("union");
		mut.anyOf = Array.from(anyOf);
		mut.compiler = compiler;
		mut.has = has;
		return mut;
	}
	throw new Error("[Sury] S.union requires at least one item");
}
function nestedNone() {
	let itemSchema = parse$1(0);
	let item = {
		schema: itemSchema,
		location: nestedLoc
	};
	let properties = {};
	properties[nestedLoc] = itemSchema;
	return {
		type: "object",
		serializer: (b, param, selfSchema, param$1) => constVal(b, selfSchema.to),
		additionalItems: "strip",
		items: [item],
		properties
	};
}
function parser(b, param, selfSchema, param$1) {
	return val(b, "{" + nestedLoc + ":" + getOutputSchema(selfSchema).items[0].schema.const + "}", selfSchema.to);
}
function nestedOption(item) {
	return updateOutput(item, (mut) => {
		mut.to = nestedNone();
		mut.parser = parser;
	});
}
function factory$1(item, unitOpt) {
	let unit$1 = unitOpt !== void 0 ? unitOpt : unit;
	let match = getOutputSchema(item);
	switch (match.type) {
		case "undefined": return factory([unit$1, nestedOption(item)]);
		case "union":
			let has = match.has;
			let anyOf = match.anyOf;
			return updateOutput(item, (mut) => {
				let mutHas = copy(has);
				let newAnyOf = [];
				for (let idx = 0, idx_finish = anyOf.length; idx < idx_finish; ++idx) {
					let schema$1 = anyOf[idx];
					let match$1 = getOutputSchema(schema$1);
					let match$1$1 = match$1.type;
					let tmp;
					if (match$1$1 === "undefined") {
						mutHas[unit$1.type] = true;
						newAnyOf.push(unit$1);
						tmp = nestedOption(schema$1);
					} else {
						let properties = match$1.properties;
						if (properties !== void 0) {
							let nestedSchema = properties[nestedLoc];
							tmp = nestedSchema !== void 0 ? updateOutput(schema$1, (mut$1) => {
								let newItem_schema = {
									type: nestedSchema.type,
									parser: nestedSchema.parser,
									const: nestedSchema.const + 1
								};
								let newItem = {
									schema: newItem_schema,
									location: nestedLoc
								};
								let properties$1 = {};
								properties$1[nestedLoc] = newItem_schema;
								mut$1.items = [newItem];
								mut$1.properties = properties$1;
							}) : schema$1;
						} else tmp = schema$1;
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
		default: return factory([item, unit$1]);
	}
}
function getWithDefault(schema$1, $$default) {
	return updateOutput(schema$1, (mut) => {
		let anyOf = mut.anyOf;
		if (anyOf !== void 0) {
			let item;
			let itemOutputSchema;
			for (let idx = 0, idx_finish = anyOf.length; idx < idx_finish; ++idx) {
				let schema$2 = anyOf[idx];
				let outputSchema = getOutputSchema(schema$2);
				if (outputSchema.type !== "undefined") {
					if (item !== void 0) {
						let message = "Can't set default for " + toExpression$1(mut);
						throw new Error("[Sury] " + message);
					}
					item = schema$2;
					itemOutputSchema = outputSchema;
				}
			}
			let s = item;
			let item$1;
			if (s !== void 0) item$1 = s;
			else {
				let message$1 = "Can't set default for " + toExpression$1(mut);
				throw new Error("[Sury] " + message$1);
			}
			mut.parser = (b, input, selfSchema, param) => {
				let operation = (b$1, input$1) => {
					let inputVar = input$1.v(b$1);
					let tmp;
					tmp = $$default.TAG === "Value" ? inlineConst(b$1, parse$1($$default._0)) : embed(b$1, $$default._0) + "()";
					return val(b$1, inputVar + "===void 0?" + tmp + ":" + inputVar, selfSchema.to);
				};
				if (!(input.f & 2)) return operation(b, input);
				let bb = {
					c: "",
					l: "",
					a: initialAllocate,
					f: "",
					g: b.g
				};
				let operationInput = {
					b,
					v: _var,
					i: varWithoutAllocation(bb.g),
					f: 0,
					type: "unknown"
				};
				let operationOutputVal = operation(bb, operationInput);
				let operationCode = allocateScope(bb);
				return asyncVal(input.b, input.i + ".then(" + operationInput.v(b) + "=>{" + operationCode + "return " + operationOutputVal.i + "})");
			};
			let to$2 = copyWithoutCache(itemOutputSchema);
			let compiler = to$2.compiler;
			if (compiler !== void 0) {
				to$2.serializer = compiler;
				delete to$2.compiler;
			} else to$2.serializer = (_b, input, param, param$1) => input;
			mut.to = to$2;
			if ($$default.TAG !== "Value") return;
			try {
				mut.default = operationFn(item$1, 32)($$default._0);
				return;
			} catch (exn) {
				return;
			}
		} else {
			let message$2 = "Can't set default for " + toExpression$1(mut);
			throw new Error("[Sury] " + message$2);
		}
	});
}
let metadataId = "m:Array.refinements";
function refinements(schema$1) {
	let m = schema$1[metadataId];
	if (m !== void 0) return m;
	else return [];
}
function arrayCompiler(b, input, selfSchema, path) {
	let item = selfSchema.additionalItems;
	let inputVar = input.v(b);
	let iteratorVar = varWithoutAllocation(b.g);
	let bb = {
		c: "",
		l: "",
		a: initialAllocate,
		f: "",
		g: b.g
	};
	let itemInput = val(bb, inputVar + "[" + iteratorVar + "]", unknown$1);
	let itemOutput = withPathPrepend(bb, itemInput, path, iteratorVar, void 0, (b$1, input$1, path$1) => parse(b$1, item, input$1, path$1));
	let itemCode = allocateScope(bb);
	let isTransformed = itemInput !== itemOutput;
	let output = isTransformed ? val(b, "new Array(" + inputVar + ".length)", selfSchema) : input;
	output.type = selfSchema.type;
	output.additionalItems = selfSchema.additionalItems;
	if (isTransformed || itemCode !== "") b.c = b.c + ("for(let " + iteratorVar + "=0;" + iteratorVar + "<" + inputVar + ".length;++" + iteratorVar + "){" + itemCode + (isTransformed ? addKey(b, output, iteratorVar, itemOutput) : "") + "}");
	if (itemOutput.f & 2) return asyncVal(output.b, "Promise.all(" + output.i + ")");
	else return output;
}
function factory$2(item) {
	let mut = new Schema("array");
	mut.additionalItems = item;
	mut.items = immutableEmpty$1;
	mut.compiler = arrayCompiler;
	return mut;
}
function setAdditionalItems(schema$1, additionalItems, deep) {
	let currentAdditionalItems = schema$1.additionalItems;
	if (currentAdditionalItems === void 0) return schema$1;
	let items = schema$1.items;
	if (currentAdditionalItems === additionalItems || typeof currentAdditionalItems === "object") return schema$1;
	let mut = copyWithoutCache(schema$1);
	mut.additionalItems = additionalItems;
	if (deep) {
		let newItems = [];
		let newProperties = {};
		for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
			let item = items[idx];
			let newSchema = setAdditionalItems(item.schema, additionalItems, deep);
			let newItem = newSchema === item.schema ? item : {
				schema: newSchema,
				location: item.location
			};
			newProperties[item.location] = newSchema;
			newItems.push(newItem);
		}
		mut.items = newItems;
		mut.properties = newProperties;
	}
	return mut;
}
function strip$1(schema$1) {
	return setAdditionalItems(schema$1, "strip", false);
}
function deepStrip$1(schema$1) {
	return setAdditionalItems(schema$1, "strip", true);
}
function strict$1(schema$1) {
	return setAdditionalItems(schema$1, "strict", false);
}
function deepStrict$1(schema$1) {
	return setAdditionalItems(schema$1, "strict", true);
}
function dictCompiler(b, input, selfSchema, path) {
	let item = selfSchema.additionalItems;
	let inputVar = input.v(b);
	let keyVar = varWithoutAllocation(b.g);
	let bb = {
		c: "",
		l: "",
		a: initialAllocate,
		f: "",
		g: b.g
	};
	let itemInput = val(bb, inputVar + "[" + keyVar + "]", unknown$1);
	let itemOutput = withPathPrepend(bb, itemInput, path, keyVar, void 0, (b$1, input$1, path$1) => parse(b$1, item, input$1, path$1));
	let itemCode = allocateScope(bb);
	let isTransformed = itemInput !== itemOutput;
	let output = isTransformed ? val(b, "{}", selfSchema) : input;
	output.type = selfSchema.type;
	output.additionalItems = selfSchema.additionalItems;
	if (isTransformed || itemCode !== "") b.c = b.c + ("for(let " + keyVar + " in " + inputVar + "){" + itemCode + (isTransformed ? addKey(b, output, keyVar, itemOutput) : "") + "}");
	if (!(itemOutput.f & 2)) return output;
	let resolveVar = varWithoutAllocation(b.g);
	let rejectVar = varWithoutAllocation(b.g);
	let asyncParseResultVar = varWithoutAllocation(b.g);
	let counterVar = varWithoutAllocation(b.g);
	let outputVar = output.v(b);
	return asyncVal(b, "new Promise((" + resolveVar + "," + rejectVar + ")=>{let " + counterVar + "=Object.keys(" + outputVar + ").length;for(let " + keyVar + " in " + outputVar + "){" + outputVar + "[" + keyVar + "].then(" + asyncParseResultVar + "=>{" + outputVar + "[" + keyVar + "]=" + asyncParseResultVar + ";if(" + counterVar + "--===1){" + resolveVar + "(" + outputVar + ")}}," + rejectVar + ")}})");
}
function factory$3(item) {
	let mut = new Schema("object");
	mut.properties = immutableEmpty;
	mut.items = immutableEmpty$1;
	mut.additionalItems = item;
	mut.compiler = dictCompiler;
	return mut;
}
let metadataId$1 = "m:String.refinements";
function refinements$1(schema$1) {
	let m = schema$1[metadataId$1];
	if (m !== void 0) return m;
	else return [];
}
let cuidRegex = /^c[^\s-]{8,}$/i;
let uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
let emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
let datetimeRe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
let json$1 = shaken("json");
function enableJson$1() {
	if (!json$1[shakenRef]) return;
	delete json$1.as;
	let jsonRef = new Schema("ref");
	jsonRef.$ref = defsPath + jsonName;
	jsonRef.name = jsonName;
	json$1.type = jsonRef.type;
	json$1.$ref = jsonRef.$ref;
	json$1.name = jsonName;
	let defs = {};
	defs[jsonName] = {
		type: "union",
		compiler,
		name: jsonName,
		has: {
			string: true,
			boolean: true,
			number: true,
			null: true,
			object: true,
			array: true
		},
		anyOf: [
			string$1,
			bool,
			float,
			$$null,
			factory$3(jsonRef),
			factory$2(jsonRef)
		]
	};
	json$1.$defs = defs;
}
function inlineJsonString(b, schema$1, selfSchema, path) {
	let tagFlag = flags[schema$1.type];
	let $$const = schema$1.const;
	if (tagFlag & 48) return "\"null\"";
	else if (tagFlag & 2) return JSON.stringify(fromString($$const));
	else if (tagFlag & 1024) return "\"\\\"" + $$const + "\\\"\"";
	else if (tagFlag & 12) return "\"" + $$const + "\"";
	else return unsupportedTransform(b, schema$1, selfSchema, path);
}
function enableJsonString$1() {
	if (jsonString$1[shakenRef]) {
		delete jsonString$1.as;
		jsonString$1.type = "string";
		jsonString$1.format = "json";
		jsonString$1.name = jsonName + " string";
		jsonString$1.compiler = (b, inputArg, selfSchema, path) => {
			let inputTagFlag = flags[inputArg.type];
			let input = inputArg;
			if (inputTagFlag & 1) {
				let to$2 = selfSchema.to;
				if (to$2 && constField in to$2) {
					let inputVar = input.v(b);
					b.f = inputVar + "===" + inlineJsonString(b, to$2, selfSchema, path) + "||" + failWithArg(b, path, (input$1) => ({
						TAG: "InvalidType",
						expected: to$2,
						received: input$1
					}), inputVar) + ";";
					input = constVal(b, to$2);
				} else if (!(to$2 && to$2.format === "json")) {
					let inputVar$1 = input.v(b);
					let withTypeValidation = b.g.o & 1;
					if (withTypeValidation) b.f = typeFilterCode(b, string$1, input, path);
					if (to$2 || withTypeValidation) {
						let tmp;
						if (to$2) {
							jsonableValidation(to$2, to$2, path, b.g.o);
							let targetVal = allocateVal(b, unknown$1);
							input = targetVal;
							tmp = targetVal.i + "=";
						} else tmp = "";
						b.c = b.c + ("try{" + tmp + "JSON.parse(" + inputVar$1 + ")}catch(t){" + failWithArg(b, path, (input$1) => ({
							TAG: "InvalidType",
							expected: selfSchema,
							received: input$1
						}), inputVar$1) + "}");
					}
				}
			} else {
				if (constField in input) input = val(b, inlineJsonString(b, input, selfSchema, path), string$1);
				else if (inputTagFlag & 2) {
					if (input.format !== "json") input = val(b, "JSON.stringify(" + input.i + ")", string$1);
				} else if (inputTagFlag & 12) input = inputToString(b, input);
				else if (inputTagFlag & 1024) input = val(b, "\"\\\"\"+" + input.i + "+\"\\\"\"", string$1);
				else if (inputTagFlag & 192) {
					jsonableValidation(input, input, path, b.g.o);
					let v = selfSchema.space;
					input = val(b, "JSON.stringify(" + input.i + (v !== void 0 && v !== 0 ? ",null," + v : "") + ")", string$1);
				} else unsupportedTransform(b, input, selfSchema, path);
				input.format = "json";
			}
			return input;
		};
		return;
	}
}
function jsonStringWithSpace$1(space) {
	let mut = copyWithoutCache(jsonString$1);
	mut.space = space;
	return mut;
}
let metadataId$2 = "m:Int.refinements";
function refinements$2(schema$1) {
	let m = schema$1[metadataId$2];
	if (m !== void 0) return m;
	else return [];
}
let metadataId$3 = "m:Float.refinements";
function refinements$3(schema$1) {
	let m = schema$1[metadataId$3];
	if (m !== void 0) return m;
	else return [];
}
function to$1(from, target) {
	if (from === target) return from;
	else return updateOutput(from, (mut) => {
		mut.to = target;
	});
}
function instance$1(class_) {
	let mut = new Schema("instance");
	mut.class = class_;
	return mut;
}
function meta$1(schema$1, data) {
	let mut = copyWithoutCache(schema$1);
	let name = data.name;
	if (name !== void 0) if (name === "") mut.name = void 0;
	else mut.name = name;
	let title = data.title;
	if (title !== void 0) if (title === "") mut.title = void 0;
	else mut.title = title;
	let description = data.description;
	if (description !== void 0) if (description === "") mut.description = void 0;
	else mut.description = description;
	let deprecated = data.deprecated;
	if (deprecated !== void 0) mut.deprecated = deprecated;
	let examples = data.examples;
	if (examples !== void 0) if (examples.length !== 0) mut.examples = examples.map(operationFn(schema$1, 32));
	else mut.examples = void 0;
	return mut;
}
function brand$1(schema$1, id) {
	let mut = copyWithoutCache(schema$1);
	mut.name = id;
	return mut;
}
function getFullDitemPath(ditem) {
	switch (ditem.k) {
		case 0: return "[" + fromString(ditem.location) + "]";
		case 1: return getFullDitemPath(ditem.of) + ditem.p;
		case 2: return ditem.p;
	}
}
function definitionToOutput(b, definition, getItemOutput, outputSchema) {
	if (constField in outputSchema) return constVal(b, outputSchema);
	let item = definition[itemSymbol];
	if (item !== void 0) return getItemOutput(item);
	let isArray = flags[outputSchema.type] & 128;
	let objectVal = make(b, isArray);
	outputSchema.items.forEach((item$1) => add(objectVal, item$1.location, definitionToOutput(b, definition[item$1.location], getItemOutput, item$1.schema)));
	return complete(objectVal, isArray);
}
function objectStrictModeCheck(b, input, items, selfSchema, path) {
	if (!(selfSchema.type === "object" && selfSchema.additionalItems === "strict" && b.g.o & 1)) return;
	let keyVar = allocateVal(b, unknown$1).i;
	b.c = b.c + ("for(" + keyVar + " in " + input.v(b) + "){if(");
	if (items.length !== 0) for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
		let match = items[idx];
		if (idx !== 0) b.c = b.c + "&&";
		b.c = b.c + (keyVar + "!==" + inlineLocation(b, match.location));
	}
	else b.c = b.c + "true";
	b.c = b.c + ("){" + failWithArg(b, path, (exccessFieldName) => ({
		TAG: "ExcessField",
		_0: exccessFieldName
	}), keyVar) + "}}");
}
function proxify(item) {
	return new Proxy(immutableEmpty, { get: (param, prop) => {
		if (prop === itemSymbol) return item;
		let inlinedLocation = fromString(prop);
		let targetReversed = getOutputSchema(item.schema);
		let items = targetReversed.items;
		let properties = targetReversed.properties;
		let maybeField;
		if (properties !== void 0) maybeField = properties[prop];
		else if (items !== void 0) {
			let i = items[prop];
			maybeField = i !== void 0 ? i.schema : void 0;
		} else maybeField = void 0;
		if (maybeField === void 0) {
			let message = "Cannot read property " + inlinedLocation + " of " + toExpression$1(targetReversed);
			throw new Error("[Sury] " + message);
		}
		return proxify({
			k: 1,
			location: prop,
			schema: maybeField,
			of: item,
			p: "[" + inlinedLocation + "]"
		});
	} });
}
function schemaCompiler(b, input, selfSchema, path) {
	let additionalItems = selfSchema.additionalItems;
	let items = selfSchema.items;
	let isArray = flags[selfSchema.type] & 128;
	if (b.g.o & 64) {
		let objectVal = make(b, isArray);
		for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
			let location = items[idx].location;
			add(objectVal, location, input.properties[location]);
		}
		return complete(objectVal, isArray);
	}
	let objectVal$1 = make(b, isArray);
	for (let idx$1 = 0, idx_finish$1 = items.length; idx$1 < idx_finish$1; ++idx$1) {
		let match$1 = items[idx$1];
		let location$1 = match$1.location;
		let itemInput = get(b, input, location$1);
		let path$1 = path + ("[" + inlineLocation(b, location$1) + "]");
		add(objectVal$1, location$1, parse(b, match$1.schema, itemInput, path$1));
	}
	objectStrictModeCheck(b, input, items, selfSchema, path);
	if ((additionalItems !== "strip" || b.g.o & 32) && items.every((item) => objectVal$1.properties[item.location] === input.properties[item.location])) {
		input.additionalItems = "strip";
		return input;
	} else return complete(objectVal$1, isArray);
}
function nested(fieldName) {
	let parentCtx = this;
	let cacheId = "~" + fieldName;
	let ctx = parentCtx[cacheId];
	if (ctx !== void 0) return valFromOption(ctx);
	let properties = {};
	let items = [];
	let schema$1 = new Schema("object");
	schema$1.items = items;
	schema$1.properties = properties;
	schema$1.additionalItems = globalConfig.a;
	schema$1.compiler = schemaCompiler;
	let target = parentCtx.f(fieldName, schema$1)[itemSymbol];
	let field = (fieldName$1, schema$2) => {
		let inlinedLocation = fromString(fieldName$1);
		if (fieldName$1 in properties) throw new Error("[Sury] " + ("The field " + inlinedLocation + " defined twice"));
		let ditem = {
			k: 1,
			location: fieldName$1,
			schema: schema$2,
			of: target,
			p: "[" + inlinedLocation + "]"
		};
		properties[fieldName$1] = schema$2;
		items.push(ditem);
		return proxify(ditem);
	};
	let tag = (tag$1, asValue) => {
		field(tag$1, definitionToSchema(asValue));
	};
	let fieldOr = (fieldName$1, schema$2, or) => {
		return field(fieldName$1, getWithDefault(factory$1(schema$2, void 0), {
			TAG: "Value",
			_0: or
		}));
	};
	let flatten = (schema$2) => {
		if (schema$2.type === "object") {
			let to$2 = schema$2.to;
			let flattenedItems = schema$2.items;
			if (to$2) {
				let message = "Unsupported nested flatten for transformed object schema " + toExpression$1(schema$2);
				throw new Error("[Sury] " + message);
			}
			let result = {};
			for (let idx = 0, idx_finish = flattenedItems.length; idx < idx_finish; ++idx) {
				let item = flattenedItems[idx];
				result[item.location] = field(item.location, item.schema);
			}
			return result;
		}
		let message$1 = "Can't flatten " + toExpression$1(schema$2) + " schema";
		throw new Error("[Sury] " + message$1);
	};
	let ctx$1 = {
		field,
		f: field,
		fieldOr,
		tag,
		nested,
		flatten
	};
	parentCtx[cacheId] = ctx$1;
	return ctx$1;
}
function definitionToSchema(definition) {
	if (typeof definition !== "object" || definition === null) return parse$1(definition);
	if (definition["~standard"]) return definition;
	if (Array.isArray(definition)) {
		for (let idx = 0, idx_finish = definition.length; idx < idx_finish; ++idx) definition[idx] = {
			schema: definitionToSchema(definition[idx]),
			location: idx.toString()
		};
		let mut = new Schema("array");
		mut.items = definition;
		mut.additionalItems = "strict";
		mut.compiler = schemaCompiler;
		return mut;
	}
	let cnstr = definition.constructor;
	if (cnstr && cnstr !== Object) return {
		type: "instance",
		const: definition,
		class: cnstr
	};
	let fieldNames = Object.keys(definition);
	let length$2 = fieldNames.length;
	let items = [];
	for (let idx$1 = 0; idx$1 < length$2; ++idx$1) {
		let location$1 = fieldNames[idx$1];
		let schema$1 = definitionToSchema(definition[location$1]);
		let item = {
			schema: schema$1,
			location: location$1
		};
		definition[location$1] = schema$1;
		items[idx$1] = item;
	}
	let mut$1 = new Schema("object");
	mut$1.items = items;
	mut$1.properties = definition;
	mut$1.additionalItems = globalConfig.a;
	mut$1.compiler = schemaCompiler;
	return mut$1;
}
function definitionToRitem(definition, path, ritemsByItemPath) {
	if (typeof definition !== "object" || definition === null) return {
		k: 1,
		p: path,
		s: copyWithoutCache(parse$1(definition))
	};
	let item = definition[itemSymbol];
	if (item !== void 0) {
		let ritemSchema = copyWithoutCache(getOutputSchema(item.schema));
		delete ritemSchema.serializer;
		let ritem = {
			k: 0,
			p: path,
			s: ritemSchema
		};
		item.r = ritem;
		ritemsByItemPath[getFullDitemPath(item)] = ritem;
		return ritem;
	}
	if (Array.isArray(definition)) {
		let items = [];
		for (let idx = 0, idx_finish = definition.length; idx < idx_finish; ++idx) {
			let location = idx.toString();
			let inlinedLocation = "\"" + location + "\"";
			items[idx] = {
				schema: definitionToRitem(definition[idx], path + ("[" + inlinedLocation + "]"), ritemsByItemPath).s,
				location
			};
		}
		let mut = new Schema("array");
		return {
			k: 2,
			p: path,
			s: (mut.items = items, mut.additionalItems = "strict", mut.serializer = neverBuilder, mut)
		};
	}
	let fieldNames = Object.keys(definition);
	let properties = {};
	let items$1 = [];
	for (let idx$1 = 0, idx_finish$1 = fieldNames.length; idx$1 < idx_finish$1; ++idx$1) {
		let location$1 = fieldNames[idx$1];
		let inlinedLocation$1 = fromString(location$1);
		let item_schema$1 = definitionToRitem(definition[location$1], path + ("[" + inlinedLocation$1 + "]"), ritemsByItemPath).s;
		items$1[idx$1] = {
			schema: item_schema$1,
			location: location$1
		};
		properties[location$1] = item_schema$1;
	}
	let mut$1 = new Schema("object");
	return {
		k: 2,
		p: path,
		s: (mut$1.items = items$1, mut$1.properties = properties, mut$1.additionalItems = globalConfig.a, mut$1.serializer = neverBuilder, mut$1)
	};
}
function definitionToTarget(definition, to$2, flattened) {
	let ritemsByItemPath = {};
	let mut = definitionToRitem(definition, "", ritemsByItemPath).s;
	delete mut.refiner;
	delete mut.compiler;
	mut.serializer = (b, input, selfSchema, path) => {
		let getRitemInput = (ritem) => {
			let ritemPath = ritem.p;
			if (ritemPath === "") return input;
			let _input = input;
			let _locations = toArray(ritemPath);
			while (true) {
				let locations = _locations;
				let input$1 = _input;
				if (locations.length === 0) return input$1;
				let location = locations[0];
				_locations = locations.slice(1);
				_input = get(b, input$1, location);
				continue;
			}
		};
		let schemaToOutput = (schema$1, originalPath) => {
			let outputSchema = getOutputSchema(schema$1);
			if (constField in outputSchema) return constVal(b, outputSchema);
			if (constField in schema$1) return parse(b, schema$1, constVal(b, schema$1), path);
			let tag = outputSchema.type;
			let additionalItems = outputSchema.additionalItems;
			let items$1 = outputSchema.items;
			if (items$1 !== void 0 && typeof additionalItems === "string") {
				let isArray$1 = flags[tag] & 128;
				let objectVal$1 = make(b, isArray$1);
				for (let idx = 0, idx_finish = items$1.length; idx < idx_finish; ++idx) {
					let item = items$1[idx];
					let itemPath = originalPath + ("[" + inlineLocation(b, item.location) + "]");
					let ritem = ritemsByItemPath[itemPath];
					let itemInput = ritem !== void 0 ? parse(b, item.schema, getRitemInput(ritem), ritem.p) : schemaToOutput(item.schema, itemPath);
					add(objectVal$1, item.location, itemInput);
				}
				return complete(objectVal$1, isArray$1);
			}
			return invalidOperation(b, path, originalPath === "" ? "Schema isn't registered" : "Schema for " + originalPath + " isn't registered");
		};
		let getItemOutput = (item, itemPath, shouldReverse) => {
			let ritem = item.r;
			if (ritem === void 0) return schemaToOutput(item.schema, itemPath);
			return parse(b, shouldReverse ? reverse$1(item.schema) : itemPath === "" ? getOutputSchema(item.schema) : item.schema, getRitemInput(ritem), path + ritem.p);
		};
		if (to$2 !== void 0) return getItemOutput(to$2, "", false);
		let originalSchema = selfSchema.to;
		objectStrictModeCheck(b, input, selfSchema.items, selfSchema, path);
		let isArray = originalSchema.type === "array";
		let items = originalSchema.items;
		let objectVal = make(b, isArray);
		if (flattened !== void 0) for (let idx = 0, idx_finish = flattened.length; idx < idx_finish; ++idx) merge$1(objectVal, getItemOutput(flattened[idx], "", true));
		for (let idx$1 = 0, idx_finish$1 = items.length; idx$1 < idx_finish$1; ++idx$1) {
			let item = items[idx$1];
			if (!(item.location in objectVal.properties)) {
				let inlinedLocation = inlineLocation(b, item.location);
				add(objectVal, item.location, getItemOutput(item, "[" + inlinedLocation + "]", false));
			}
		}
		return complete(objectVal, isArray);
	};
	return mut;
}
function advancedBuilder(definition, flattened) {
	return (b, input, selfSchema, path) => {
		let isFlatten = b.g.o & 64;
		let outputs = isFlatten ? input.properties : {};
		if (!isFlatten) {
			let items = selfSchema.items;
			for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
				let match = items[idx];
				let location = match.location;
				let itemInput = get(b, input, location);
				let path$1 = path + ("[" + inlineLocation(b, location) + "]");
				outputs[location] = parse(b, match.schema, itemInput, path$1);
			}
			objectStrictModeCheck(b, input, items, selfSchema, path);
		}
		if (flattened !== void 0) {
			let prevFlag = b.g.o;
			b.g.o = prevFlag | 64;
			for (let idx$1 = 0, idx_finish$1 = flattened.length; idx$1 < idx_finish$1; ++idx$1) {
				let item = flattened[idx$1];
				outputs[item.i] = parse(b, item.schema, input, path);
			}
			b.g.o = prevFlag;
		}
		let getItemOutput = (item) => {
			switch (item.k) {
				case 0: return outputs[item.location];
				case 1: return get(b, getItemOutput(item.of), item.location);
				case 2: return outputs[item.i];
			}
		};
		return definitionToOutput(b, definition, getItemOutput, selfSchema.to);
	};
}
function shape$1(schema$1, definer) {
	return updateOutput(schema$1, (mut) => {
		let ditem = {
			k: 2,
			schema: schema$1,
			p: "",
			i: 0
		};
		let definition = definer(proxify(ditem));
		mut.parser = (b, input, selfSchema, param) => {
			let getItemOutput = (item) => {
				switch (item.k) {
					case 1: return get(b, getItemOutput(item.of), item.location);
					case 0:
					case 2: return input;
				}
			};
			return definitionToOutput(b, definition, getItemOutput, selfSchema.to);
		};
		mut.to = definitionToTarget(definition, ditem, void 0);
	});
}
function object$1(definer) {
	let flattened = void 0;
	let items = [];
	let properties = {};
	let flatten = (schema$1) => {
		if (schema$1.type === "object") {
			let flattenedItems = schema$1.items;
			for (let idx = 0, idx_finish = flattenedItems.length; idx < idx_finish; ++idx) {
				let match$1 = flattenedItems[idx];
				let location = match$1.location;
				let flattenedSchema = match$1.schema;
				let schema$1$1 = properties[location];
				if (schema$1$1 !== void 0) {
					if (schema$1$1 !== flattenedSchema) throw new Error("[Sury] " + ("The field \"" + location + "\" defined twice with incompatible schemas"));
				} else {
					let item = {
						k: 0,
						schema: flattenedSchema,
						location
					};
					items.push(item);
					properties[location] = flattenedSchema;
				}
			}
			let f = flattened || (flattened = []);
			let item$1 = {
				k: 2,
				schema: schema$1,
				p: "",
				i: f.length
			};
			f.push(item$1);
			return proxify(item$1);
		}
		let message = "The '" + toExpression$1(schema$1) + "' schema can't be flattened";
		throw new Error("[Sury] " + message);
	};
	let field = (fieldName, schema$1) => {
		if (fieldName in properties) throw new Error("[Sury] " + ("The field \"" + fieldName + "\" defined twice with incompatible schemas"));
		let ditem = {
			k: 0,
			schema: schema$1,
			location: fieldName
		};
		properties[fieldName] = schema$1;
		items.push(ditem);
		return proxify(ditem);
	};
	let tag = (tag$1, asValue) => {
		field(tag$1, definitionToSchema(asValue));
	};
	let fieldOr = (fieldName, schema$1, or) => {
		return field(fieldName, getWithDefault(factory$1(schema$1, void 0), {
			TAG: "Value",
			_0: or
		}));
	};
	let definition = definer({
		field,
		f: field,
		fieldOr,
		tag,
		nested,
		flatten
	});
	let mut = new Schema("object");
	mut.items = items;
	mut.properties = properties;
	mut.additionalItems = globalConfig.a;
	mut.parser = advancedBuilder(definition, flattened);
	mut.to = definitionToTarget(definition, void 0, flattened);
	return mut;
}
function tuple$1(definer) {
	let items = [];
	let item = (idx, schema$1) => {
		let location = idx.toString();
		if (items[idx]) throw new Error("[Sury] " + ("The item [" + location + "] is defined multiple times"));
		let ditem = {
			k: 0,
			schema: schema$1,
			location
		};
		items[idx] = ditem;
		return proxify(ditem);
	};
	let tag = (idx, asValue) => {
		item(idx, definitionToSchema(asValue));
	};
	let definition = definer({
		item,
		tag
	});
	for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) if (!items[idx]) items[idx] = {
		schema: unit,
		location: idx.toString()
	};
	let mut = new Schema("array");
	mut.items = items;
	mut.additionalItems = "strict";
	mut.parser = advancedBuilder(definition, void 0);
	mut.to = definitionToTarget(definition, void 0, void 0);
	return mut;
}
function factory$5(item) {
	return factory$1(item, nullAsUnit);
}
let js_schema = definitionToSchema;
function unnestSerializer(b, input, selfSchema, path) {
	let schema$1 = selfSchema.additionalItems;
	let items = schema$1.items;
	let inputVar = input.v(b);
	let iteratorVar = varWithoutAllocation(b.g);
	let outputVar = varWithoutAllocation(b.g);
	let bb = {
		c: "",
		l: "",
		a: initialAllocate,
		f: "",
		g: b.g
	};
	let itemOutput = withPathPrepend(bb, {
		b: bb,
		v: _var,
		i: inputVar + "[" + iteratorVar + "]",
		f: 0,
		type: "unknown"
	}, path, iteratorVar, (bb$1, output) => {
		let initialArraysCode = "";
		let settingCode = "";
		for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
			let toItem = items[idx];
			initialArraysCode = initialArraysCode + ("new Array(" + inputVar + ".length),");
			settingCode = settingCode + (outputVar + "[" + idx + "][" + iteratorVar + "]=" + get(b, output, toItem.location).i + ";");
		}
		b.a(outputVar + "=[" + initialArraysCode + "]");
		bb$1.c = bb$1.c + settingCode;
	}, (b$1, input$1, path$1) => parse(b$1, schema$1, input$1, path$1));
	let itemCode = allocateScope(bb);
	b.c = b.c + ("for(let " + iteratorVar + "=0;" + iteratorVar + "<" + inputVar + ".length;++" + iteratorVar + "){" + itemCode + "}");
	if (itemOutput.f & 2) return {
		b,
		v: _notVar,
		i: "Promise.all(" + outputVar + ")",
		f: 2,
		type: "array"
	};
	else return {
		b,
		v: _var,
		i: outputVar,
		f: 0,
		type: "array"
	};
}
function unnest$1(schema$1) {
	if (schema$1.type === "object") {
		let items = schema$1.items;
		if (items.length === 0) throw new Error("[Sury] Invalid empty object for S.unnest schema.");
		let mut = new Schema("array");
		mut.items = items.map((item, idx) => {
			let location = idx.toString();
			return {
				schema: factory$2(item.schema),
				location
			};
		});
		mut.additionalItems = "strict";
		mut.parser = (b, input, selfSchema, path) => {
			let inputVar = input.v(b);
			let iteratorVar = varWithoutAllocation(b.g);
			let bb = {
				c: "",
				l: "",
				a: initialAllocate,
				f: "",
				g: b.g
			};
			let itemInput = make(bb, false);
			let lengthCode = "";
			for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
				let item = items[idx];
				add(itemInput, item.location, val(bb, inputVar + "[" + idx + "][" + iteratorVar + "]", unknown$1));
				lengthCode = lengthCode + (inputVar + "[" + idx + "].length,");
			}
			let output = val(b, "new Array(Math.max(" + lengthCode + "))", selfSchema.to);
			let outputVar = output.v(b);
			let itemOutput = withPathPrepend(bb, complete(itemInput, false), path, iteratorVar, (bb$1, itemOutput$1) => {
				bb$1.c = bb$1.c + addKey(bb$1, output, iteratorVar, itemOutput$1) + ";";
			}, (b$1, input$1, path$1) => parse(b$1, schema$1, input$1, path$1));
			let itemCode = allocateScope(bb);
			b.c = b.c + ("for(let " + iteratorVar + "=0;" + iteratorVar + "<" + outputVar + ".length;++" + iteratorVar + "){" + itemCode + "}");
			if (itemOutput.f & 2) return asyncVal(output.b, "Promise.all(" + output.i + ")");
			else return output;
		};
		let to$2 = new Schema("array");
		to$2.items = immutableEmpty$1;
		to$2.additionalItems = schema$1;
		to$2.serializer = unnestSerializer;
		mut.unnest = true;
		mut.to = to$2;
		return mut;
	}
	throw new Error("[Sury] S.unnest supports only object schemas.");
}
function option(item) {
	return factory$1(item, unit);
}
function intMin(schema$1, minValue, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Number must be greater than or equal to " + minValue;
	return addRefinement(schema$1, metadataId$2, {
		kind: {
			TAG: "Min",
			value: minValue
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + "<" + embed(b, minValue) + "){" + fail(b, message, path) + "}");
}
function intMax(schema$1, maxValue, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Number must be lower than or equal to " + maxValue;
	return addRefinement(schema$1, metadataId$2, {
		kind: {
			TAG: "Max",
			value: maxValue
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ">" + embed(b, maxValue) + "){" + fail(b, message, path) + "}");
}
function port$1(schema$1, message) {
	let mutStandard = internalRefine(schema$1, (b, inputVar, selfSchema, path) => inputVar + ">0&&" + inputVar + "<65536&&" + inputVar + "%1===0||" + (message !== void 0 ? fail(b, message, path) : failWithArg(b, path, (input) => ({
		TAG: "InvalidType",
		expected: selfSchema,
		received: input
	}), inputVar)) + ";");
	mutStandard.format = "port";
	reverse$1(mutStandard).format = "port";
	return mutStandard;
}
function floatMin(schema$1, minValue, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Number must be greater than or equal to " + minValue;
	return addRefinement(schema$1, metadataId$3, {
		kind: {
			TAG: "Min",
			value: minValue
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + "<" + embed(b, minValue) + "){" + fail(b, message, path) + "}");
}
function floatMax(schema$1, maxValue, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Number must be lower than or equal to " + maxValue;
	return addRefinement(schema$1, metadataId$3, {
		kind: {
			TAG: "Max",
			value: maxValue
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ">" + embed(b, maxValue) + "){" + fail(b, message, path) + "}");
}
function arrayMinLength(schema$1, length$2, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Array must be " + length$2 + " or more items long";
	return addRefinement(schema$1, metadataId, {
		kind: {
			TAG: "Min",
			length: length$2
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ".length<" + embed(b, length$2) + "){" + fail(b, message, path) + "}");
}
function arrayMaxLength(schema$1, length$2, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Array must be " + length$2 + " or fewer items long";
	return addRefinement(schema$1, metadataId, {
		kind: {
			TAG: "Max",
			length: length$2
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ".length>" + embed(b, length$2) + "){" + fail(b, message, path) + "}");
}
function stringMinLength(schema$1, length$2, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "String must be " + length$2 + " or more characters long";
	return addRefinement(schema$1, metadataId$1, {
		kind: {
			TAG: "Min",
			length: length$2
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ".length<" + embed(b, length$2) + "){" + fail(b, message, path) + "}");
}
function stringMaxLength(schema$1, length$2, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "String must be " + length$2 + " or fewer characters long";
	return addRefinement(schema$1, metadataId$1, {
		kind: {
			TAG: "Max",
			length: length$2
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ".length>" + embed(b, length$2) + "){" + fail(b, message, path) + "}");
}
function email$1(schema$1, messageOpt) {
	let message = messageOpt !== void 0 ? messageOpt : "Invalid email address";
	return addRefinement(schema$1, metadataId$1, {
		kind: "Email",
		message
	}, (b, inputVar, param, path) => "if(!" + embed(b, emailRegex) + ".test(" + inputVar + ")){" + fail(b, message, path) + "}");
}
function uuid$1(schema$1, messageOpt) {
	let message = messageOpt !== void 0 ? messageOpt : "Invalid UUID";
	return addRefinement(schema$1, metadataId$1, {
		kind: "Uuid",
		message
	}, (b, inputVar, param, path) => "if(!" + embed(b, uuidRegex) + ".test(" + inputVar + ")){" + fail(b, message, path) + "}");
}
function cuid$1(schema$1, messageOpt) {
	let message = messageOpt !== void 0 ? messageOpt : "Invalid CUID";
	return addRefinement(schema$1, metadataId$1, {
		kind: "Cuid",
		message
	}, (b, inputVar, param, path) => "if(!" + embed(b, cuidRegex) + ".test(" + inputVar + ")){" + fail(b, message, path) + "}");
}
function url$1(schema$1, messageOpt) {
	let message = messageOpt !== void 0 ? messageOpt : "Invalid url";
	return addRefinement(schema$1, metadataId$1, {
		kind: "Url",
		message
	}, (b, inputVar, param, path) => "try{new URL(" + inputVar + ")}catch(_){" + fail(b, message, path) + "}");
}
function pattern$1(schema$1, re, messageOpt) {
	let message = messageOpt !== void 0 ? messageOpt : "Invalid";
	return addRefinement(schema$1, metadataId$1, {
		kind: {
			TAG: "Pattern",
			re
		},
		message
	}, (b, inputVar, param, path) => (re.global ? embed(b, re) + ".lastIndex=0;" : "") + ("if(!" + embed(b, re) + ".test(" + inputVar + ")){" + fail(b, message, path) + "}"));
}
function datetime$1(schema$1, messageOpt) {
	let message = messageOpt !== void 0 ? messageOpt : "Invalid datetime string! Expected UTC";
	let refinement = {
		kind: "Datetime",
		message
	};
	let refinements = schema$1[metadataId$1];
	return transform$1(set$1(schema$1, metadataId$1, refinements !== void 0 ? refinements.concat(refinement) : [refinement]), (s) => ({
		p: (string$2) => {
			if (!datetimeRe.test(string$2)) s.fail(message, void 0);
			return new Date(string$2);
		},
		s: (date) => date.toISOString()
	}));
}
function trim$1(schema$1) {
	let transformer = (string$2) => string$2.trim();
	return transform$1(schema$1, (param) => ({
		p: transformer,
		s: transformer
	}));
}
function nullable$1(schema$1) {
	return factory([
		schema$1,
		unit,
		$$null
	]);
}
function js_union(values) {
	return factory(values.map(definitionToSchema));
}
function js_transform(schema$1, maybeParser, maybeSerializer) {
	return transform$1(schema$1, (s) => ({
		p: maybeParser !== void 0 ? (v) => maybeParser(v, s) : void 0,
		s: maybeSerializer !== void 0 ? (v) => maybeSerializer(v, s) : void 0
	}));
}
function js_refine(schema$1, refiner) {
	return refine$1(schema$1, (s) => ((v) => refiner(v, s)));
}
function noop(a) {
	return a;
}
function js_asyncParserRefine(schema$1, refine$2) {
	return transform$1(schema$1, (s) => ({
		a: (v) => refine$2(v, s).then(() => v),
		s: noop
	}));
}
function js_optional(schema$1, maybeOr) {
	let schema$1$1 = factory([schema$1, unit]);
	if (maybeOr === void 0) return schema$1$1;
	let or = valFromOption(maybeOr);
	if (typeof or === "function") return getWithDefault(schema$1$1, {
		TAG: "Callback",
		_0: or
	});
	else return getWithDefault(schema$1$1, {
		TAG: "Value",
		_0: or
	});
}
function js_nullable(schema$1, maybeOr) {
	let schema$1$1 = factory([schema$1, nullAsUnit]);
	if (maybeOr === void 0) return schema$1$1;
	let or = valFromOption(maybeOr);
	if (typeof or === "function") return getWithDefault(schema$1$1, {
		TAG: "Callback",
		_0: or
	});
	else return getWithDefault(schema$1$1, {
		TAG: "Value",
		_0: or
	});
}
function js_merge(s1, s2) {
	let s;
	if (s1.type === "object" && s2.type === "object") {
		let additionalItems1 = s1.additionalItems;
		if (typeof additionalItems1 === "string" && typeof s2.additionalItems === "string" && !s1.to && !s2.to) {
			let items2 = s2.items;
			let items1 = s1.items;
			let properties = {};
			let locations = [];
			let items = [];
			for (let idx = 0, idx_finish = items1.length; idx < idx_finish; ++idx) {
				let item = items1[idx];
				locations.push(item.location);
				properties[item.location] = item.schema;
			}
			for (let idx$1 = 0, idx_finish$1 = items2.length; idx$1 < idx_finish$1; ++idx$1) {
				let item$1 = items2[idx$1];
				if (!(item$1.location in properties)) locations.push(item$1.location);
				properties[item$1.location] = item$1.schema;
			}
			for (let idx$2 = 0, idx_finish$2 = locations.length; idx$2 < idx_finish$2; ++idx$2) {
				let location = locations[idx$2];
				items.push({
					schema: properties[location],
					location
				});
			}
			let mut = new Schema("object");
			mut.items = items;
			mut.properties = properties;
			mut.additionalItems = additionalItems1;
			mut.compiler = schemaCompiler;
			s = mut;
		} else s = void 0;
	} else s = void 0;
	if (s !== void 0) return s;
	throw new Error("[Sury] The merge supports only structured object schemas without transformations");
}
function global$1(override) {
	let defaultAdditionalItems = override.defaultAdditionalItems;
	globalConfig.a = defaultAdditionalItems !== void 0 ? defaultAdditionalItems : "strip";
	let prevDisableNanNumberCheck = globalConfig.n;
	let disableNanNumberValidation = override.disableNanNumberValidation;
	globalConfig.n = disableNanNumberValidation !== void 0 ? disableNanNumberValidation : false;
	if (prevDisableNanNumberCheck !== globalConfig.n) return resetCacheInPlace(float);
}
let jsonSchemaMetadataId = "m:JSONSchema";
function internalToJSONSchema(schema$1, defs) {
	let jsonSchema = {};
	switch (schema$1.type) {
		case "never":
			jsonSchema.not = {};
			break;
		case "unknown": break;
		case "string":
			let $$const = schema$1.const;
			jsonSchema.type = "string";
			refinements$1(schema$1).forEach((refinement) => {
				let match = refinement.kind;
				if (typeof match !== "object") switch (match) {
					case "Email":
						jsonSchema.format = "email";
						return;
					case "Uuid":
						jsonSchema.format = "uuid";
						return;
					case "Cuid": return;
					case "Url":
						jsonSchema.format = "uri";
						return;
					case "Datetime":
						jsonSchema.format = "date-time";
						return;
				}
				else switch (match.TAG) {
					case "Min":
						jsonSchema.minLength = match.length;
						return;
					case "Max":
						jsonSchema.maxLength = match.length;
						return;
					case "Length":
						let length$2 = match.length;
						jsonSchema.minLength = length$2;
						jsonSchema.maxLength = length$2;
						return;
					case "Pattern":
						jsonSchema.pattern = String(match.re);
						return;
				}
			});
			if ($$const !== void 0) jsonSchema.const = $$const;
			break;
		case "number":
			let format = schema$1.format;
			let $$const$1 = schema$1.const;
			if (format !== void 0) if (format === "int32") {
				jsonSchema.type = "integer";
				refinements$2(schema$1).forEach((refinement) => {
					let match = refinement.kind;
					if (match.TAG === "Min") jsonSchema.minimum = match.value;
					else jsonSchema.maximum = match.value;
				});
			} else {
				jsonSchema.type = "integer";
				jsonSchema.maximum = 65535;
				jsonSchema.minimum = 0;
			}
			else {
				jsonSchema.type = "number";
				refinements$3(schema$1).forEach((refinement) => {
					let match = refinement.kind;
					if (match.TAG === "Min") jsonSchema.minimum = match.value;
					else jsonSchema.maximum = match.value;
				});
			}
			if ($$const$1 !== void 0) jsonSchema.const = $$const$1;
			break;
		case "boolean":
			let $$const$2 = schema$1.const;
			jsonSchema.type = "boolean";
			if ($$const$2 !== void 0) jsonSchema.const = $$const$2;
			break;
		case "null":
			jsonSchema.type = "null";
			break;
		case "array":
			let additionalItems = schema$1.additionalItems;
			let exit = 0;
			if (additionalItems === "strip" || additionalItems === "strict") exit = 1;
			else {
				jsonSchema.items = internalToJSONSchema(additionalItems, defs);
				jsonSchema.type = "array";
				refinements(schema$1).forEach((refinement) => {
					let match = refinement.kind;
					switch (match.TAG) {
						case "Min":
							jsonSchema.minItems = match.length;
							return;
						case "Max":
							jsonSchema.maxItems = match.length;
							return;
						case "Length":
							let length$2 = match.length;
							jsonSchema.maxItems = length$2;
							jsonSchema.minItems = length$2;
							return;
					}
				});
			}
			if (exit === 1) {
				let items = schema$1.items.map((item) => internalToJSONSchema(item.schema, defs));
				let itemsNumber = items.length;
				jsonSchema.items = some(items);
				jsonSchema.type = "array";
				jsonSchema.minItems = itemsNumber;
				jsonSchema.maxItems = itemsNumber;
			}
			break;
		case "object":
			let additionalItems$1 = schema$1.additionalItems;
			let exit$1 = 0;
			if (additionalItems$1 === "strip" || additionalItems$1 === "strict") exit$1 = 1;
			else {
				jsonSchema.type = "object";
				jsonSchema.additionalProperties = internalToJSONSchema(additionalItems$1, defs);
			}
			if (exit$1 === 1) {
				let properties = {};
				let required = [];
				schema$1.items.forEach((item) => {
					let fieldSchema = internalToJSONSchema(item.schema, defs);
					if (!isOptional(item.schema)) required.push(item.location);
					properties[item.location] = fieldSchema;
				});
				jsonSchema.type = "object";
				jsonSchema.properties = properties;
				let tmp;
				tmp = additionalItems$1 === "strip" || additionalItems$1 === "strict" ? additionalItems$1 === "strip" : true;
				jsonSchema.additionalProperties = tmp;
				if (required.length !== 0) jsonSchema.required = required;
			}
			break;
		case "union":
			let literals = [];
			let items$1 = [];
			schema$1.anyOf.forEach((childSchema) => {
				if (childSchema.type === "undefined") return;
				items$1.push(internalToJSONSchema(childSchema, defs));
				if (constField in childSchema) {
					literals.push(childSchema.const);
					return;
				}
			});
			let itemsNumber$1 = items$1.length;
			let $$default = schema$1.default;
			if ($$default !== void 0) jsonSchema.default = valFromOption($$default);
			if (itemsNumber$1 === 1) Object.assign(jsonSchema, items$1[0]);
			else if (literals.length === itemsNumber$1) jsonSchema.enum = literals;
			else jsonSchema.anyOf = items$1;
			break;
		case "ref":
			let ref = schema$1.$ref;
			if (ref === defsPath + jsonName);
			else jsonSchema.$ref = ref;
			break;
		default: throw new Error("[Sury] Unexpected schema type");
	}
	let m = schema$1.description;
	if (m !== void 0) jsonSchema.description = m;
	let m$1 = schema$1.title;
	if (m$1 !== void 0) jsonSchema.title = m$1;
	let deprecated = schema$1.deprecated;
	if (deprecated !== void 0) jsonSchema.deprecated = deprecated;
	let examples = schema$1.examples;
	if (examples !== void 0) jsonSchema.examples = examples;
	let schemaDefs = schema$1.$defs;
	if (schemaDefs !== void 0) Object.assign(defs, schemaDefs);
	let metadataRawSchema = schema$1[jsonSchemaMetadataId];
	if (metadataRawSchema !== void 0) Object.assign(jsonSchema, metadataRawSchema);
	return jsonSchema;
}
function toJSONSchema$1(schema$1) {
	jsonableValidation(schema$1, schema$1, "", 8);
	let defs = {};
	let jsonSchema = internalToJSONSchema(schema$1, defs);
	delete defs.JSON;
	let defsKeys = Object.keys(defs);
	if (defsKeys.length) {
		defsKeys.forEach((key) => {
			defs[key] = internalToJSONSchema(defs[key], 0);
		});
		jsonSchema.$defs = defs;
	}
	return jsonSchema;
}
function extendJSONSchema$1(schema$1, jsonSchema) {
	let existingSchemaExtend = schema$1[jsonSchemaMetadataId];
	return set$1(schema$1, jsonSchemaMetadataId, existingSchemaExtend !== void 0 ? Object.assign({}, existingSchemaExtend, jsonSchema) : jsonSchema);
}
let primitiveToSchema = parse$1;
function toIntSchema(jsonSchema) {
	let minimum = jsonSchema.minimum;
	let schema$1;
	if (minimum !== void 0) schema$1 = intMin(int, minimum | 0, void 0);
	else {
		let exclusiveMinimum = jsonSchema.exclusiveMinimum;
		schema$1 = exclusiveMinimum !== void 0 ? intMin(int, exclusiveMinimum + 1 | 0, void 0) : int;
	}
	let maximum = jsonSchema.maximum;
	if (maximum !== void 0) return intMax(schema$1, maximum | 0, void 0);
	let exclusiveMinimum$1 = jsonSchema.exclusiveMinimum;
	if (exclusiveMinimum$1 !== void 0) return intMax(schema$1, exclusiveMinimum$1 - 1 | 0, void 0);
	else return schema$1;
}
function definitionToDefaultValue(definition) {
	if (typeof definition !== "object") return;
	else return definition.default;
}
function fromJSONSchema$1(jsonSchema) {
	let definitionToSchema$1 = (definition) => {
		if (typeof definition !== "object") if (definition === false) return never$1;
		else return json$1;
		else return fromJSONSchema$1(definition);
	};
	let type_ = jsonSchema.type;
	let schema$1;
	let exit = 0;
	let exit$1 = 0;
	if (jsonSchema.nullable) schema$1 = factory$5(fromJSONSchema$1(Object.assign({}, jsonSchema, { nullable: false })));
	else if (type_ !== void 0) {
		let type_$1 = valFromOption(type_);
		if (type_$1 === "object") {
			let properties = jsonSchema.properties;
			if (properties !== void 0) {
				let schema$1$1 = object$1((s) => {
					let obj = {};
					Object.keys(properties).forEach((key) => {
						let property = properties[key];
						let propertySchema = definitionToSchema$1(property);
						let r = jsonSchema.required;
						let propertySchema$1;
						let exit$2 = 0;
						if (r !== void 0 && r.includes(key)) propertySchema$1 = propertySchema;
						else exit$2 = 1;
						if (exit$2 === 1) {
							let defaultValue = definitionToDefaultValue(property);
							if (defaultValue !== void 0) propertySchema$1 = getWithDefault(option(propertySchema), {
								TAG: "Value",
								_0: defaultValue
							});
							else propertySchema$1 = option(propertySchema);
						}
						obj[key] = s.f(key, propertySchema$1);
					});
					return obj;
				});
				schema$1 = jsonSchema.additionalProperties === false ? strict$1(schema$1$1) : schema$1$1;
			} else {
				let additionalProperties$1 = jsonSchema.additionalProperties;
				schema$1 = additionalProperties$1 !== void 0 ? typeof additionalProperties$1 !== "object" ? additionalProperties$1 === false ? strict$1(object$1((param) => {})) : factory$3(json$1) : factory$3(fromJSONSchema$1(additionalProperties$1)) : definitionToSchema();
			}
		} else if (type_$1 === "array") {
			let items = jsonSchema.items;
			let schema$2;
			if (items !== void 0) {
				let single = Arrayable.classify(valFromOption(items));
				if (single.TAG === "Single") schema$2 = factory$2(definitionToSchema$1(single._0));
				else {
					let array$2 = single._0;
					schema$2 = tuple$1((s) => array$2.map((d, idx) => s.item(idx, definitionToSchema$1(d))));
				}
			} else schema$2 = factory$2(json$1);
			let min$2 = jsonSchema.minItems;
			let schema$3 = min$2 !== void 0 ? arrayMinLength(schema$2, min$2, void 0) : schema$2;
			let max$2 = jsonSchema.maxItems;
			schema$1 = max$2 !== void 0 ? arrayMaxLength(schema$3, max$2, void 0) : schema$3;
		} else exit$1 = 2;
	} else exit$1 = 2;
	if (exit$1 === 2) {
		let primitives = jsonSchema.enum;
		let definitions = jsonSchema.allOf;
		let definitions$1 = jsonSchema.anyOf;
		if (definitions$1 !== void 0) {
			let len = definitions$1.length;
			schema$1 = len !== 1 ? len !== 0 ? factory(definitions$1.map(definitionToSchema$1)) : json$1 : definitionToSchema$1(definitions$1[0]);
		} else if (definitions !== void 0) {
			let len$1 = definitions.length;
			schema$1 = len$1 !== 1 ? len$1 !== 0 ? refine$1(json$1, (s) => ((data) => {
				definitions.forEach((d) => {
					try {
						return assertOrThrow$1(data, definitionToSchema$1(d));
					} catch (exn) {
						return s.fail("Should pass for all schemas of the allOf property.", void 0);
					}
				});
			})) : json$1 : definitionToSchema$1(definitions[0]);
		} else {
			let definitions$2 = jsonSchema.oneOf;
			if (definitions$2 !== void 0) {
				let len$2 = definitions$2.length;
				schema$1 = len$2 !== 1 ? len$2 !== 0 ? refine$1(json$1, (s) => ((data) => {
					let hasOneValidRef = { contents: false };
					definitions$2.forEach((d) => {
						let passed;
						try {
							assertOrThrow$1(data, definitionToSchema$1(d));
							passed = true;
						} catch (exn) {
							passed = false;
						}
						if (passed) {
							if (hasOneValidRef.contents) s.fail("Should pass single schema according to the oneOf property.", void 0);
							hasOneValidRef.contents = true;
							return;
						}
					});
					if (!hasOneValidRef.contents) return s.fail("Should pass at least one schema according to the oneOf property.", void 0);
				})) : json$1 : definitionToSchema$1(definitions$2[0]);
			} else {
				let not = jsonSchema.not;
				if (not !== void 0) schema$1 = refine$1(json$1, (s) => ((data) => {
					let passed;
					try {
						assertOrThrow$1(data, definitionToSchema$1(not));
						passed = true;
					} catch (exn) {
						passed = false;
					}
					if (passed) return s.fail("Should NOT be valid against schema in the not property.", void 0);
				}));
				else if (primitives !== void 0) {
					let len$3 = primitives.length;
					schema$1 = len$3 !== 1 ? len$3 !== 0 ? factory(primitives.map(primitiveToSchema)) : json$1 : parse$1(primitives[0]);
				} else {
					let $$const = jsonSchema.const;
					if ($$const !== void 0) schema$1 = parse$1($$const);
					else if (type_ !== void 0) {
						let type_$2 = valFromOption(type_);
						let exit$2 = 0;
						let exit$3 = 0;
						if (Array.isArray(type_$2)) schema$1 = factory(type_$2.map((type_$1) => fromJSONSchema$1(Object.assign({}, jsonSchema, { type: some(type_$1) }))));
						else if (type_$2 === "string") {
							let p = jsonSchema.pattern;
							let schema$4 = p !== void 0 ? pattern$1(string$1, new RegExp(p), void 0) : string$1;
							let minLength = jsonSchema.minLength;
							let schema$5 = minLength !== void 0 ? stringMinLength(schema$4, minLength, void 0) : schema$4;
							let maxLength = jsonSchema.maxLength;
							let schema$6 = maxLength !== void 0 ? stringMaxLength(schema$5, maxLength, void 0) : schema$5;
							switch (jsonSchema.format) {
								case "date-time":
									schema$1 = datetime$1(schema$6, void 0);
									break;
								case "email":
									schema$1 = email$1(schema$6, void 0);
									break;
								case "uri":
									schema$1 = url$1(schema$6, void 0);
									break;
								case "uuid":
									schema$1 = uuid$1(schema$6, void 0);
									break;
								default: schema$1 = schema$6;
							}
						} else if (type_$2 === "integer" || jsonSchema.format === "int64" && type_$2 === "number") schema$1 = toIntSchema(jsonSchema);
						else exit$3 = 4;
						if (exit$3 === 4) if (jsonSchema.multipleOf !== 1 || type_$2 !== "number") exit$2 = 3;
						else schema$1 = toIntSchema(jsonSchema);
						if (exit$2 === 3) if (type_$2 === "number") {
							let minimum = jsonSchema.minimum;
							let schema$7;
							if (minimum !== void 0) schema$7 = floatMin(float, minimum, void 0);
							else {
								let exclusiveMinimum = jsonSchema.exclusiveMinimum;
								schema$7 = exclusiveMinimum !== void 0 ? floatMin(float, exclusiveMinimum + 1, void 0) : float;
							}
							let maximum = jsonSchema.maximum;
							if (maximum !== void 0) schema$1 = floatMax(schema$7, maximum, void 0);
							else {
								let exclusiveMinimum$1 = jsonSchema.exclusiveMinimum;
								schema$1 = exclusiveMinimum$1 !== void 0 ? floatMax(schema$7, exclusiveMinimum$1 - 1, void 0) : schema$7;
							}
						} else if (type_$2 === "boolean") schema$1 = bool;
						else if (type_$2 === "null") schema$1 = js_schema(null);
						else exit = 1;
					} else exit = 1;
				}
			}
		}
	}
	if (exit === 1) {
		let if_ = jsonSchema.if;
		if (if_ !== void 0) {
			let then = jsonSchema.then;
			if (then !== void 0) {
				let else_ = jsonSchema.else;
				if (else_ !== void 0) {
					let ifSchema = definitionToSchema$1(if_);
					let thenSchema = definitionToSchema$1(then);
					let elseSchema = definitionToSchema$1(else_);
					schema$1 = refine$1(json$1, (param) => ((data) => {
						let passed;
						try {
							assertOrThrow$1(data, ifSchema);
							passed = true;
						} catch (exn) {
							passed = false;
						}
						if (passed) return assertOrThrow$1(data, thenSchema);
						else return assertOrThrow$1(data, elseSchema);
					}));
				} else schema$1 = json$1;
			} else schema$1 = json$1;
		} else schema$1 = json$1;
	}
	if (jsonSchema.description === void 0 && jsonSchema.deprecated === void 0 && jsonSchema.examples === void 0 && jsonSchema.title === void 0) return schema$1;
	return meta$1(schema$1, {
		title: jsonSchema.title,
		description: jsonSchema.description,
		deprecated: jsonSchema.deprecated,
		examples: jsonSchema.examples
	});
}
function min$1(schema$1, minValue, maybeMessage) {
	switch (schema$1.type) {
		case "string": return stringMinLength(schema$1, minValue, maybeMessage);
		case "number": if (schema$1.format !== void 0) return intMin(schema$1, minValue, maybeMessage);
		else return floatMin(schema$1, minValue, maybeMessage);
		case "array": return arrayMinLength(schema$1, minValue, maybeMessage);
		default:
			let message = "S.min is not supported for " + toExpression$1(schema$1) + " schema. Coerce the schema to string, number or array using S.to first.";
			throw new Error("[Sury] " + message);
	}
}
function max$1(schema$1, maxValue, maybeMessage) {
	switch (schema$1.type) {
		case "string": return stringMaxLength(schema$1, maxValue, maybeMessage);
		case "number": if (schema$1.format !== void 0) return intMax(schema$1, maxValue, maybeMessage);
		else return floatMax(schema$1, maxValue, maybeMessage);
		case "array": return arrayMaxLength(schema$1, maxValue, maybeMessage);
		default:
			let message = "S.max is not supported for " + toExpression$1(schema$1) + " schema. Coerce the schema to string, number or array using S.to first.";
			throw new Error("[Sury] " + message);
	}
}
function length$1(schema$1, length$1$1, maybeMessage) {
	switch (schema$1.type) {
		case "string":
			let message = maybeMessage !== void 0 ? maybeMessage : "String must be exactly " + length$1$1 + " characters long";
			return addRefinement(schema$1, metadataId$1, {
				kind: {
					TAG: "Length",
					length: length$1$1
				},
				message
			}, (b, inputVar, param, path) => "if(" + inputVar + ".length!==" + embed(b, length$1$1) + "){" + fail(b, message, path) + "}");
		case "array":
			let message$1 = maybeMessage !== void 0 ? maybeMessage : "Array must be exactly " + length$1$1 + " items long";
			return addRefinement(schema$1, metadataId, {
				kind: {
					TAG: "Length",
					length: length$1$1
				},
				message: message$1
			}, (b, inputVar, param, path) => "if(" + inputVar + ".length!==" + embed(b, length$1$1) + "){" + fail(b, message$1, path) + "}");
		default:
			let message$2 = "S.length is not supported for " + toExpression$1(schema$1) + " schema. Coerce the schema to string or array using S.to first.";
			throw new Error("[Sury] " + message$2);
	}
}
let array$1 = factory$2;
let dict = factory$3;
let parseJsonOrThrow$1 = parseOrThrow$1;

//#endregion
//#region ../node_modules/.pnpm/sury@11.0.0-alpha.4/node_modules/sury/src/S.mjs
var Error$1 = ErrorClass.value;
var string = string$1;
var boolean = bool;
var int32 = int;
var number = float;
var bigint = bigint$1;
var symbol = symbol$1;
var json = json$1;
var never = never$1;
var unknown = unknown$1;
var any = unknown$1;
var optional = js_optional;
var nullable = js_nullable;
var nullish = nullable$1;
var array = array$1;
var instance = instance$1;
var unnest = unnest$1;
var record = dict;
var jsonString = jsonString$1;
var jsonStringWithSpace = jsonStringWithSpace$1;
var union = js_union;
var object = object$1;
var schema = js_schema;
var safe = js_safe;
var safeAsync = js_safeAsync;
var reverse = reverse$1;
var convertOrThrow = convertOrThrow$1;
var convertToJsonOrThrow = convertToJsonOrThrow$1;
var convertToJsonStringOrThrow = convertToJsonStringOrThrow$1;
var reverseConvertOrThrow = reverseConvertOrThrow$1;
var reverseConvertToJsonOrThrow = reverseConvertToJsonOrThrow$1;
var reverseConvertToJsonStringOrThrow = reverseConvertToJsonStringOrThrow$1;
var parseOrThrow = parseOrThrow$1;
var parseJsonOrThrow = parseJsonOrThrow$1;
var parseJsonStringOrThrow = parseJsonStringOrThrow$1;
var parseAsyncOrThrow = parseAsyncOrThrow$1;
var assertOrThrow = assertOrThrow$1;
var recursive = recursive$1;
var merge = js_merge;
var strict = strict$1;
var deepStrict = deepStrict$1;
var strip = strip$1;
var deepStrip = deepStrip$1;
var to = to$1;
var toJSONSchema = toJSONSchema$1;
var fromJSONSchema = fromJSONSchema$1;
var extendJSONSchema = extendJSONSchema$1;
var shape = shape$1;
var tuple = tuple$1;
var asyncParserRefine = js_asyncParserRefine;
var refine = js_refine;
var transform = js_transform;
var meta = meta$1;
var toExpression = toExpression$1;
var noValidation = noValidation$1;
var compile = compile$1;
var port = port$1;
var min = min$1;
var max = max$1;
var length = length$1;
var email = email$1;
var uuid = uuid$1;
var cuid = cuid$1;
var url = url$1;
var pattern = pattern$1;
var datetime = datetime$1;
var trim = trim$1;
var enableJson = enableJson$1;
var enableJsonString = enableJsonString$1;
var global = global$1;
var brand = brand$1;

//#endregion
//#region ../schemas/libraries/sury/download/index.ts
const imageSchema = schema({
	id: number,
	created: instance(Date),
	title: min(max(string, 100), 1),
	type: union(["jpg", "png"]),
	size: number,
	url: url(string)
});
const ratingSchema = schema({
	id: number,
	stars: min(max(number, 5), 0),
	title: min(max(string, 100), 1),
	text: min(max(string, 1e3), 1),
	images: array(imageSchema)
});
const productSchema = schema({
	id: number,
	created: instance(Date),
	title: min(max(string, 100), 1),
	brand: min(max(string, 30), 1),
	description: min(max(string, 500), 1),
	price: min(max(number, 1e4), 1),
	discount: union([min(max(number, 100), 1), null]),
	quantity: min(max(number, 10), 0),
	tags: array(min(max(string, 30), 1)),
	images: array(imageSchema),
	ratings: array(ratingSchema)
});
parseOrThrow({}, productSchema);

//#endregion