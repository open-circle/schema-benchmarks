//#region ../node_modules/.pnpm/sury@11.0.0-alpha.4/node_modules/sury/src/Sury.res.mjs
function valFromOption(x) {
	if (x === null || x.BS_PRIVATE_NESTED_SOME_NONE === void 0) return x;
	let depth = x.BS_PRIVATE_NESTED_SOME_NONE;
	if (depth === 0) return;
	else return { BS_PRIVATE_NESTED_SOME_NONE: depth - 1 | 0 };
}
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
let immutableEmpty$1 = [];
function capitalize(string) {
	return string.slice(0, 1).toUpperCase() + string.slice(1);
}
let copy = ((d) => ({ ...d }));
function fromString(string) {
	let _idx = 0;
	while (true) {
		let idx = _idx;
		let match = string[idx];
		if (match === void 0) return "\"" + string + "\"";
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
	else return JSON.parse(path.split("\"][\"").join("\",\""));
}
let vendor = "sury";
let s = Symbol(vendor);
Symbol(vendor + ":item");
let $$Error = /* @__PURE__ */ create("Sury.Error");
let constField = "const";
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
function stringify(unknown) {
	let tagFlag = flags[typeof unknown];
	if (tagFlag & 16) return "undefined";
	if (!(tagFlag & 64)) if (tagFlag & 2) return "\"" + unknown + "\"";
	else if (tagFlag & 1024) return unknown + "n";
	else return unknown.toString();
	if (unknown === null) return "null";
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
		string$1 = string$1 + key + ": " + stringify(value) + "; ";
	}
	return string$1 + "}";
}
function toExpression(schema) {
	let tag = schema.type;
	let $$const = schema.const;
	let name = schema.name;
	if (name !== void 0) return name;
	if ($$const !== void 0) return stringify($$const);
	let format = schema.format;
	let anyOf = schema.anyOf;
	if (anyOf !== void 0) return anyOf.map(toExpression).join(" | ");
	if (format !== void 0) return format;
	switch (tag) {
		case "nan": return "NaN";
		case "object":
			let additionalItems = schema.additionalItems;
			let properties = schema.properties;
			let locations = Object.keys(properties);
			if (locations.length === 0) if (typeof additionalItems === "object") return "{ [key: string]: " + toExpression(additionalItems) + "; }";
			else return "{}";
			else return "{ " + locations.map((location) => location + ": " + toExpression(properties[location]) + ";").join(" ") + " }";
		default:
			if (schema.b) return tag;
			switch (tag) {
				case "instance": return schema.class.name;
				case "array":
					let additionalItems$1 = schema.additionalItems;
					let items = schema.items;
					if (typeof additionalItems$1 !== "object") return "[" + items.map((item) => toExpression(item.schema)).join(", ") + "]";
					let itemName = toExpression(additionalItems$1);
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
			let m = "Expected " + toExpression(reason$1.expected) + ", received " + stringify(reason$1.received);
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
		case "UnsupportedTransformation": return "Unsupported transformation from " + toExpression(reason$1.from) + " to " + toExpression(reason$1.to);
		case "ExcessField": return "Unrecognized key \"" + reason$1._0 + "\"";
		case "InvalidJsonSchema": return toExpression(reason$1._0) + " is not valid JSON";
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
let unknown = new Schema("unknown");
new Schema("boolean");
new Schema("symbol");
let string$2 = new Schema("string");
let int = new Schema("number");
int.format = "int32";
let float = new Schema("number");
new Schema("bigint");
let unit = new Schema("undefined");
unit.const = void 0;
let copyWithoutCache = ((schema) => {
	let c = new Schema(schema.type);
	for (let k in schema) if (k > "a" || k === "$ref" || k === "$defs") c[k] = schema[k];
	return c;
});
function updateOutput(schema, fn) {
	let root = copyWithoutCache(schema);
	let mut = root;
	while (mut.to) {
		let next = copyWithoutCache(mut.to);
		mut.to = next;
		mut = next;
	}
	fn(mut);
	return root;
}
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
function inlineConst(b, schema) {
	let tagFlag = flags[schema.type];
	let $$const = schema.const;
	if (tagFlag & 16) return "void 0";
	else if (tagFlag & 2) return fromString($$const);
	else if (tagFlag & 1024) return $$const + "n";
	else if (tagFlag & 45056) return embed(b, schema.const);
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
	let global = {
		c: "",
		l: "",
		a: initialAllocate,
		v: -1,
		o: flag,
		f: "",
		e: [],
		d: defs
	};
	global.g = global;
	return global;
}
function allocateScope(b) {
	delete b.a;
	let varsAllocation = b.l;
	if (varsAllocation === "") return b.f + b.c;
	else return b.f + "let " + varsAllocation + ";" + b.c;
}
function varWithoutAllocation(global) {
	let newCounter = global.v + 1;
	global.v = newCounter;
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
function allocateVal(b, schema) {
	let v = varWithoutAllocation(b.g);
	b.a(v);
	return {
		b,
		v: _var,
		i: v,
		f: 0,
		type: schema.type
	};
}
function val(b, initial, schema) {
	return {
		b,
		v: _notVar,
		i: initial,
		f: 0,
		type: schema.type
	};
}
function constVal(b, schema) {
	return {
		b,
		v: _notVar,
		i: inlineConst(b, schema),
		f: 0,
		type: schema.type,
		const: schema.const
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
	let schema = targetVal.additionalItems;
	let schema$1;
	if (schema === "strip" || schema === "strict") {
		if (schema === "strip") throw new Error("[Sury] The schema doesn't have additional items");
		throw new Error("[Sury] The schema doesn't have additional items");
	} else schema$1 = schema;
	let val$1 = {
		b,
		v: _notVar,
		i: targetVal.v(b) + ("[" + fromString(location) + "]"),
		f: 0,
		type: schema$1.type
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
function failWithArg(b, path, fn, arg) {
	return embed(b, (arg) => $$throw(b, fn(arg), path)) + "(" + arg + ")";
}
function fail(b, message, path) {
	return embed(b, () => $$throw(b, {
		TAG: "OperationFailed",
		_0: message
	}, path)) + "()";
}
function withPathPrepend(b, input, path, maybeDynamicLocationVar, appendSafe, fn) {
	if (path === "" && maybeDynamicLocationVar === void 0) return fn(b, input, path);
	try {
		let $$catch = (b, errorVar) => {
			b.c = errorVar + ".path=" + fromString(path) + "+" + (maybeDynamicLocationVar !== void 0 ? "'[\"'+" + maybeDynamicLocationVar + "+'\"]'+" : "") + errorVar + ".path";
		};
		let fn$1 = (b) => fn(b, input, "");
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
function validation(b, inputVar, schema, negative) {
	let eq = negative ? "!==" : "===";
	let and_ = negative ? "||" : "&&";
	let exp = negative ? "!" : "";
	let tag = schema.type;
	let tagFlag = flags[tag];
	if (tagFlag & 2048) return exp + ("Number.isNaN(" + inputVar + ")");
	if (constField in schema) return inputVar + eq + inlineConst(b, schema);
	if (tagFlag & 4) return "typeof " + inputVar + eq + "\"" + tag + "\"";
	if (tagFlag & 64) return "typeof " + inputVar + eq + "\"" + tag + "\"" + and_ + exp + inputVar;
	if (tagFlag & 128) return exp + "Array.isArray(" + inputVar + ")";
	if (!(tagFlag & 8192)) return "typeof " + inputVar + eq + "\"" + tag + "\"";
	let c = inputVar + " instanceof " + embed(b, schema.class);
	if (negative) return "!(" + c + ")";
	else return c;
}
function refinement(b, inputVar, schema, negative) {
	let eq = negative ? "!==" : "===";
	let and_ = negative ? "||" : "&&";
	let not_ = negative ? "" : "!";
	let lt = negative ? ">" : "<";
	let gt = negative ? "<" : ">";
	let match = schema.type;
	let tag;
	let exit = 0;
	if (schema.const !== void 0) return "";
	let match$2 = schema.format;
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
	let additionalItems = schema.additionalItems;
	let items = schema.items;
	let length = items.length;
	let code = tag === "array" ? additionalItems === "strip" || additionalItems === "strict" ? additionalItems === "strip" ? and_ + inputVar + ".length" + gt + length : and_ + inputVar + ".length" + eq + length : "" : additionalItems === "strip" ? "" : and_ + not_ + "Array.isArray(" + inputVar + ")";
	for (let idx = 0, idx_finish = items.length; idx < idx_finish; ++idx) {
		let match$3 = items[idx];
		let location = match$3.location;
		let item = match$3.schema;
		let itemCode;
		if (constField in item || schema.unnest) itemCode = validation(b, inputVar + ("[" + inlineLocation(b, location) + "]"), item, negative);
		else if (item.items) {
			let inputVar$1 = inputVar + ("[" + inlineLocation(b, location) + "]");
			itemCode = validation(b, inputVar$1, item, negative) + refinement(b, inputVar$1, item, negative);
		} else itemCode = "";
		if (itemCode !== "") code = code + and_ + itemCode;
	}
	return code;
}
function makeRefinedOf(b, input, schema) {
	let mut = {
		b,
		v: input.v,
		i: input.i,
		f: input.f,
		type: schema.type
	};
	let loop = (mut, schema) => {
		if (constField in schema) mut.const = schema.const;
		let items = schema.items;
		if (items === void 0) return;
		let properties = {};
		items.forEach((item) => {
			let schema = item.schema;
			let isConst = constField in schema;
			if (!(isConst || schema.items)) return;
			let tmp;
			if (isConst) tmp = inlineConst(b, schema);
			else {
				let inlinedLocation = inlineLocation(b, item.location);
				tmp = mut.v(b) + ("[" + inlinedLocation + "]");
			}
			let mut$1 = {
				b: mut.b,
				v: _notVar,
				i: tmp,
				f: 0,
				type: schema.type
			};
			loop(mut$1, schema);
			properties[item.location] = mut$1;
		});
		mut.properties = properties;
		mut.additionalItems = unknown;
	};
	loop(mut, schema);
	return mut;
}
function typeFilterCode(b, schema, input, path) {
	if (schema.noValidation || flags[schema.type] & 17153) return "";
	let inputVar = input.v(b);
	return "if(" + validation(b, inputVar, schema, true) + refinement(b, inputVar, schema, true) + "){" + failWithArg(b, path, (input) => ({
		TAG: "InvalidType",
		expected: schema,
		received: input
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
let jsonString = shaken("jsonString");
function inputToString(b, input) {
	return val(b, "\"\"+" + input.i, string$2);
}
function parse(prevB, schema, inputArg, path) {
	let b = {
		c: "",
		l: "",
		a: initialAllocate,
		f: "",
		g: prevB.g
	};
	if (schema.$defs) b.g.d = schema.$defs;
	let input = inputArg;
	let isFromLiteral = constField in input;
	let isSchemaLiteral = constField in schema;
	let isSameTag = input.type === schema.type;
	let schemaTagFlag = flags[schema.type];
	let inputTagFlag = flags[input.type];
	let isUnsupported = false;
	if (!(schemaTagFlag & 257 || schema.format === "json")) {
		if (schema.name === jsonName && !(inputTagFlag & 1)) {
			if (!(inputTagFlag & 14)) if (inputTagFlag & 1024) input = inputToString(b, input);
			else isUnsupported = true;
		} else if (isSchemaLiteral) if (isFromLiteral) {
			if (input.const !== schema.const) input = constVal(b, schema);
		} else if (inputTagFlag & 2 && schemaTagFlag & 3132) {
			let inputVar = input.v(b);
			b.f = schema.noValidation ? "" : input.i + "===\"" + schema.const + "\"||" + failWithArg(b, path, (input) => ({
				TAG: "InvalidType",
				expected: schema,
				received: input
			}), inputVar) + ";";
			input = constVal(b, schema);
		} else if (schema.noValidation) input = constVal(b, schema);
		else {
			b.f = typeFilterCode(prevB, schema, input, path);
			input.type = schema.type;
			input.const = schema.const;
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
			let ref = schema.$ref;
			if (ref !== void 0) {
				let defs = b.g.d;
				let identifier = ref.slice(8);
				let def = defs[identifier];
				let flag = schema.noValidation ? (b.g.o | 1) ^ 1 : b.g.o;
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
				input = withPathPrepend(b, input, path, void 0, void 0, (param, input, param$1) => {
					let output = map(recOperation, input);
					if (def.isAsync === void 0) {
						let defsMut = copy(defs);
						defsMut[identifier] = unknown;
						isAsyncInternal(def, defsMut);
					}
					if (def.isAsync) output.f = output.f | 2;
					return output;
				});
				input.v(b);
			} else {
				if (b.g.o & 1) b.f = typeFilterCode(prevB, schema, input, path);
				let refined = makeRefinedOf(b, input, schema);
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
				let output = allocateVal(b, schema);
				b.c = b.c + ("(" + output.i + "=" + inputVar$1 + "===\"true\")||" + inputVar$1 + "===\"false\"||" + failWithArg(b, path, (input) => ({
					TAG: "InvalidType",
					expected: schema,
					received: input
				}), inputVar$1) + ";");
				input = output;
			} else if (schemaTagFlag & 4) {
				let output$1 = val(b, "+" + inputVar$1, schema);
				let outputVar = output$1.v(b);
				let match = schema.format;
				b.c = b.c + (match !== void 0 ? "(" + refinement(b, outputVar, schema, true).slice(2) + ")" : "Number.isNaN(" + outputVar + ")") + ("&&" + failWithArg(b, path, (input) => ({
					TAG: "InvalidType",
					expected: schema,
					received: input
				}), inputVar$1) + ";");
				input = output$1;
			} else if (schemaTagFlag & 1024) {
				let output$2 = allocateVal(b, schema);
				b.c = b.c + ("try{" + output$2.i + "=BigInt(" + inputVar$1 + ")}catch(_){" + failWithArg(b, path, (input) => ({
					TAG: "InvalidType",
					expected: schema,
					received: input
				}), inputVar$1) + "}");
				input = output$2;
			} else isUnsupported = true;
		} else if (inputTagFlag & 4 && schemaTagFlag & 1024) input = val(b, "BigInt(" + input.i + ")", schema);
		else isUnsupported = true;
	}
	if (isUnsupported) unsupportedTransform(b, input, schema, path);
	let compiler = schema.compiler;
	if (compiler !== void 0) input = compiler(b, input, schema, path);
	if (input.t !== true) {
		let refiner = schema.refiner;
		if (refiner !== void 0) b.c = b.c + refiner(b, input.v(b), schema, path);
	}
	let to = schema.to;
	if (to !== void 0) {
		let parser = schema.parser;
		if (parser !== void 0) input = parser(b, input, schema, path);
		if (input.t !== true) input = parse(b, to, input, path);
	}
	prevB.c = prevB.c + allocateScope(b);
	return input;
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
function reverse(schema) {
	let reversedHead;
	let current = schema;
	while (current) {
		let mut = copyWithoutCache(current);
		let next = mut.to;
		let to = reversedHead;
		if (to !== void 0) mut.to = to;
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
				let reversed_schema = reverse(item.schema);
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
		if (typeof mut.additionalItems === "object") mut.additionalItems = reverse(mut.additionalItems);
		let anyOf = mut.anyOf;
		if (anyOf !== void 0) {
			let has = {};
			let newAnyOf = [];
			for (let idx$1 = 0, idx_finish$1 = anyOf.length; idx$1 < idx_finish$1; ++idx$1) {
				let s = anyOf[idx$1];
				let reversed$1 = reverse(s);
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
				reversedDefs[key] = reverse(defs[key]);
			}
			mut.$defs = reversedDefs;
		}
		reversedHead = mut;
		current = next;
	}
	return reversedHead;
}
function internalCompile(schema, flag, defs) {
	let b = rootScope(flag, defs);
	if (flag & 8) {
		let output = reverse(schema);
		jsonableValidation(output, output, "", flag);
	}
	let input = {
		b,
		v: _var,
		i: "i",
		f: 0,
		type: "unknown"
	};
	let schema$1 = flag & 4 ? updateOutput(schema, (mut) => {
		let t = new Schema(unit.type);
		t.const = unit.const;
		t.noValidation = true;
		mut.to = t;
	}) : flag & 16 ? updateOutput(schema, (mut) => {
		mut.to = jsonString;
	}) : schema;
	let output$1 = parse(b, schema$1, input, "");
	let code = allocateScope(b);
	let isAsync = has(output$1.f, 2);
	schema$1.isAsync = isAsync;
	if (code === "" && output$1 === input && !(flag & 2)) return noopOperation;
	let inlinedOutput = output$1.i;
	if (flag & 2 && !isAsync && !defs) inlinedOutput = "Promise.resolve(" + inlinedOutput + ")";
	let inlinedFunction = "i=>{" + code + "return " + inlinedOutput + "}";
	let ctxVarValue1 = b.g.e;
	return new Function("e", "s", "return " + inlinedFunction)(ctxVarValue1, s);
}
function isAsyncInternal(schema, defs) {
	try {
		let b = rootScope(2, defs);
		let isAsync = has(parse(b, schema, {
			b,
			v: _var,
			i: "i",
			f: 0,
			type: "unknown"
		}, "").f, 2);
		schema.isAsync = isAsync;
		return isAsync;
	} catch (exn) {
		getOrRethrow(exn);
		return false;
	}
}
function operationFn(s, o) {
	if (o in s) return s[o];
	let f = internalCompile(o & 32 ? reverse(s) : s, o, 0);
	s[o] = f;
	return f;
}
d(sp, "~standard", { get: function() {
	let schema = this;
	return {
		version: 1,
		vendor,
		validate: (input) => {
			try {
				return { value: operationFn(schema, 1)(input) };
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
function parseOrThrow$1(any, schema) {
	return operationFn(schema, 1)(any);
}
let $$null = new Schema("null");
$$null.const = null;
function parse$1(value) {
	if (value === null) return $$null;
	let $$typeof = typeof value;
	let schema;
	if ($$typeof === "object") {
		let i = new Schema("instance");
		i.class = value.constructor;
		schema = i;
	} else schema = $$typeof === "undefined" ? unit : $$typeof === "number" ? Number.isNaN(value) ? new Schema("nan") : new Schema($$typeof) : new Schema($$typeof);
	schema.const = value;
	return schema;
}
function set$1(schema, id, metadata) {
	let mut = copyWithoutCache(schema);
	mut[id] = metadata;
	return mut;
}
function appendRefiner(maybeExistingRefiner, refiner) {
	if (maybeExistingRefiner !== void 0) return (b, inputVar, selfSchema, path) => maybeExistingRefiner(b, inputVar, selfSchema, path) + refiner(b, inputVar, selfSchema, path);
	else return refiner;
}
function internalRefine(schema, refiner) {
	return updateOutput(schema, (mut) => {
		mut.refiner = appendRefiner(mut.refiner, refiner);
	});
}
function addRefinement(schema, metadataId, refinement, refiner) {
	let refinements = schema[metadataId];
	return internalRefine(set$1(schema, metadataId, refinements !== void 0 ? refinements.concat(refinement) : [refinement]), refiner);
}
let nullAsUnit = new Schema("null");
nullAsUnit.const = null;
nullAsUnit.to = unit;
function neverBuilder(b, input, selfSchema, path) {
	b.c = b.c + failWithArg(b, path, (input) => ({
		TAG: "InvalidType",
		expected: selfSchema,
		received: input
	}), input.i) + ";";
	return input;
}
let never = new Schema("never");
never.compiler = neverBuilder;
let nestedLoc = "BS_PRIVATE_NESTED_SOME_NONE";
function getItemCode(b, schema, input, output, deopt, path) {
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
		let input$1 = deopt ? copy(input) : makeRefinedOf(bb, input, schema);
		let itemOutput = parse(bb, schema, input$1, path);
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
		let schema = schemaAnyOf[idx];
		if (schema !== void 0 && !(flags[inputSchema.type] & 9152) && inputSchema.type === schema.type) return inputSchema.const === schema.const;
		else return false;
	});
}
function compiler(b, input, selfSchema, path) {
	let schemas = selfSchema.anyOf;
	let inputAnyOf = input.anyOf;
	if (inputAnyOf !== void 0) if (isWiderUnionSchema(schemas, inputAnyOf)) return input;
	else return unsupportedTransform(b, input, selfSchema, path);
	let fail = (caught) => embed(b, function() {
		let args = arguments;
		return $$throw(b, {
			TAG: "InvalidType",
			expected: selfSchema,
			received: args[0],
			unionErrors: args.length > 1 ? Array.from(args).slice(1) : void 0
		}, path);
	}) + "(" + input.v(b) + caught + ")";
	let typeValidation = b.g.o & 1;
	let initialInline = input.i;
	let deoptIdx = -1;
	let lastIdx = schemas.length - 1 | 0;
	let byKey = {};
	let keys = [];
	for (let idx = 0; idx <= lastIdx; ++idx) {
		let target = selfSchema.to;
		let schema = target !== void 0 && !selfSchema.parser && target.type !== "union" ? updateOutput(schemas[idx], (mut) => {
			let refiner = selfSchema.refiner;
			if (refiner !== void 0) mut.refiner = appendRefiner(mut.refiner, refiner);
			mut.to = target;
		}) : schemas[idx];
		let tag = schema.type;
		let tagFlag = flags[tag];
		if (!(tagFlag & 16 && "fromDefault" in selfSchema)) if (tagFlag & 17153 || !(flags[input.type] & 1) && input.type !== tag) {
			deoptIdx = idx;
			byKey = {};
			keys = [];
		} else {
			let key = tagFlag & 8192 ? schema.class.name : tag;
			let arr = byKey[key];
			if (arr !== void 0) {
				if (tagFlag & 64 && nestedLoc in schema.properties) arr.unshift(schema);
				else if (!(tagFlag & 2096)) arr.push(schema);
			} else {
				if (isPriority(tagFlag, byKey)) keys.unshift(key);
				else keys.push(key);
				byKey[key] = [schema];
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
				cond = (inputVar) => validation(b, inputVar, {
					type: firstSchema.type,
					parser: 0
				}, false);
				if (itemNoop.contents) if (itemStart) {
					if (typeValidation) itemStart = itemStart + (itemNextElse ? "else if" : "if") + ("(!(" + itemNoop.contents + ")){" + fail(caught$1) + "}");
				} else {
					let condBefore = cond;
					cond = (inputVar) => condBefore(inputVar) + ("&&(" + itemNoop.contents + ")");
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
	let to = selfSchema.to;
	o.type = to !== void 0 && to.type !== "union" ? (o.t = true, getOutputSchema(to).type) : "union";
	return o;
}
function factory(schemas) {
	let len = schemas.length;
	if (len === 1) return schemas[0];
	if (len !== 0) {
		let has = {};
		let anyOf = /* @__PURE__ */ new Set();
		for (let idx = 0, idx_finish = schemas.length; idx < idx_finish; ++idx) {
			let schema = schemas[idx];
			if (schema.type === "union" && schema.to === void 0) {
				schema.anyOf.forEach((item) => {
					anyOf.add(item);
				});
				Object.assign(has, schema.has);
			} else {
				anyOf.add(schema);
				setHas(has, schema.type);
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
let metadataId = "m:Array.refinements";
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
	let itemInput = val(bb, inputVar + "[" + iteratorVar + "]", unknown);
	let itemOutput = withPathPrepend(bb, itemInput, path, iteratorVar, void 0, (b, input, path) => parse(b, item, input, path));
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
let metadataId$1 = "m:String.refinements";
shaken("json");
let metadataId$2 = "m:Int.refinements";
let metadataId$3 = "m:Float.refinements";
function instance$1(class_) {
	let mut = new Schema("instance");
	mut.class = class_;
	return mut;
}
function objectStrictModeCheck(b, input, items, selfSchema, path) {
	if (!(selfSchema.type === "object" && selfSchema.additionalItems === "strict" && b.g.o & 1)) return;
	let keyVar = allocateVal(b, unknown).i;
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
	let length = fieldNames.length;
	let items = [];
	for (let idx$1 = 0; idx$1 < length; ++idx$1) {
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
let js_schema = definitionToSchema;
function intMin(schema, minValue, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Number must be greater than or equal to " + minValue;
	return addRefinement(schema, metadataId$2, {
		kind: {
			TAG: "Min",
			value: minValue
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + "<" + embed(b, minValue) + "){" + fail(b, message, path) + "}");
}
function intMax(schema, maxValue, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Number must be lower than or equal to " + maxValue;
	return addRefinement(schema, metadataId$2, {
		kind: {
			TAG: "Max",
			value: maxValue
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ">" + embed(b, maxValue) + "){" + fail(b, message, path) + "}");
}
function floatMin(schema, minValue, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Number must be greater than or equal to " + minValue;
	return addRefinement(schema, metadataId$3, {
		kind: {
			TAG: "Min",
			value: minValue
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + "<" + embed(b, minValue) + "){" + fail(b, message, path) + "}");
}
function floatMax(schema, maxValue, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Number must be lower than or equal to " + maxValue;
	return addRefinement(schema, metadataId$3, {
		kind: {
			TAG: "Max",
			value: maxValue
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ">" + embed(b, maxValue) + "){" + fail(b, message, path) + "}");
}
function arrayMinLength(schema, length, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Array must be " + length + " or more items long";
	return addRefinement(schema, metadataId, {
		kind: {
			TAG: "Min",
			length
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ".length<" + embed(b, length) + "){" + fail(b, message, path) + "}");
}
function arrayMaxLength(schema, length, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "Array must be " + length + " or fewer items long";
	return addRefinement(schema, metadataId, {
		kind: {
			TAG: "Max",
			length
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ".length>" + embed(b, length) + "){" + fail(b, message, path) + "}");
}
function stringMinLength(schema, length, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "String must be " + length + " or more characters long";
	return addRefinement(schema, metadataId$1, {
		kind: {
			TAG: "Min",
			length
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ".length<" + embed(b, length) + "){" + fail(b, message, path) + "}");
}
function stringMaxLength(schema, length, maybeMessage) {
	let message = maybeMessage !== void 0 ? maybeMessage : "String must be " + length + " or fewer characters long";
	return addRefinement(schema, metadataId$1, {
		kind: {
			TAG: "Max",
			length
		},
		message
	}, (b, inputVar, param, path) => "if(" + inputVar + ".length>" + embed(b, length) + "){" + fail(b, message, path) + "}");
}
function url$1(schema, messageOpt) {
	let message = messageOpt !== void 0 ? messageOpt : "Invalid url";
	return addRefinement(schema, metadataId$1, {
		kind: "Url",
		message
	}, (b, inputVar, param, path) => "try{new URL(" + inputVar + ")}catch(_){" + fail(b, message, path) + "}");
}
function js_union(values) {
	return factory(values.map(definitionToSchema));
}
function min$1(schema, minValue, maybeMessage) {
	switch (schema.type) {
		case "string": return stringMinLength(schema, minValue, maybeMessage);
		case "number": if (schema.format !== void 0) return intMin(schema, minValue, maybeMessage);
		else return floatMin(schema, minValue, maybeMessage);
		case "array": return arrayMinLength(schema, minValue, maybeMessage);
		default:
			let message = "S.min is not supported for " + toExpression(schema) + " schema. Coerce the schema to string, number or array using S.to first.";
			throw new Error("[Sury] " + message);
	}
}
function max$1(schema, maxValue, maybeMessage) {
	switch (schema.type) {
		case "string": return stringMaxLength(schema, maxValue, maybeMessage);
		case "number": if (schema.format !== void 0) return intMax(schema, maxValue, maybeMessage);
		else return floatMax(schema, maxValue, maybeMessage);
		case "array": return arrayMaxLength(schema, maxValue, maybeMessage);
		default:
			let message = "S.max is not supported for " + toExpression(schema) + " schema. Coerce the schema to string, number or array using S.to first.";
			throw new Error("[Sury] " + message);
	}
}
let array$1 = factory$2;
ErrorClass.value;
var string = string$2;
var number = float;
var array = array$1;
var instance = instance$1;
var union = js_union;
var schema = js_schema;
var parseOrThrow = parseOrThrow$1;
var min = min$1;
var max = max$1;
var url = url$1;
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
parseOrThrow({}, schema({
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
}));
//#endregion
