//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/arrays.js
const liftArray = (data) => Array.isArray(data) ? data : [data];
/**
* Splits an array into two arrays based on the result of a predicate
*
* @param predicate - The guard function used to determine which items to include.
* @returns A tuple containing two arrays:
* 				- the first includes items for which `predicate` returns true
* 				- the second includes items for which `predicate` returns false
*
* @example
* const list = [1, "2", "3", 4, 5];
* const [numbers, strings] = spliterate(list, (x) => typeof x === "number");
* // Type: number[]
* // Output: [1, 4, 5]
* console.log(evens);
* // Type: string[]
* // Output: ["2", "3"]
* console.log(odds);
*/
const spliterate = (arr, predicate) => {
	const result = [[], []];
	for (const item of arr) if (predicate(item)) result[0].push(item);
	else result[1].push(item);
	return result;
};
const ReadonlyArray = Array;
const includes = (array, element) => array.includes(element);
const range = (length, offset = 0) => [...new Array(length)].map((_, i) => i + offset);
/**
* Adds a value or array to an array, returning the concatenated result
*/
const append = (to, value$1, opts) => {
	if (to === void 0) return value$1 === void 0 ? [] : Array.isArray(value$1) ? value$1 : [value$1];
	if (opts?.prepend) if (Array.isArray(value$1)) to.unshift(...value$1);
	else to.unshift(value$1);
	else if (Array.isArray(value$1)) to.push(...value$1);
	else to.push(value$1);
	return to;
};
/**
* Concatenates an element or list with a readonly list
*/
const conflatenate = (to, elementOrList) => {
	if (elementOrList === void 0 || elementOrList === null) return to ?? [];
	if (to === void 0 || to === null) return liftArray(elementOrList);
	return to.concat(elementOrList);
};
/**
* Concatenates a variadic list of elements or lists with a readonly list
*/
const conflatenateAll = (...elementsOrLists) => elementsOrLists.reduce(conflatenate, []);
/**
* Appends a value or concatenates an array to an array if it is not already included, returning the array
*/
const appendUnique = (to, value$1, opts) => {
	if (to === void 0) return Array.isArray(value$1) ? value$1 : [value$1];
	const isEqual = opts?.isEqual ?? ((l, r) => l === r);
	for (const v of liftArray(value$1)) if (!to.some((existing) => isEqual(existing, v))) to.push(v);
	return to;
};
const groupBy = (array, discriminant) => array.reduce((result, item) => {
	const key = item[discriminant];
	result[key] = append(result[key], item);
	return result;
}, {});
const arrayEquals = (l, r, opts) => l.length === r.length && l.every(opts?.isEqual ? (lItem, i) => opts.isEqual(lItem, r[i]) : (lItem, i) => lItem === r[i]);

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/domain.js
const hasDomain = (data, kind) => domainOf(data) === kind;
const domainOf = (data) => {
	const builtinType = typeof data;
	return builtinType === "object" ? data === null ? "null" : "object" : builtinType === "function" ? "object" : builtinType;
};
/** Each domain's completion for the phrase "must be _____" */
const domainDescriptions = {
	boolean: "boolean",
	null: "null",
	undefined: "undefined",
	bigint: "a bigint",
	number: "a number",
	object: "an object",
	string: "a string",
	symbol: "a symbol"
};
const jsTypeOfDescriptions = {
	...domainDescriptions,
	function: "a function"
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/errors.js
var InternalArktypeError = class extends Error {};
const throwInternalError = (message) => throwError(message, InternalArktypeError);
const throwError = (message, ctor = Error) => {
	throw new ctor(message);
};
var ParseError = class extends Error {
	name = "ParseError";
};
const throwParseError = (message) => throwError(message, ParseError);
/**
*  TypeScript won't suggest strings beginning with a space as properties.
*  Useful for symbol-like string properties.
*/
const noSuggest = (s) => ` ${s}`;
/** Unrendered character (U+200B) used to mark a string type */
const ZeroWidthSpace = "​";

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/flatMorph.js
const flatMorph = (o, flatMapEntry) => {
	const result = {};
	const inputIsArray = Array.isArray(o);
	let outputShouldBeArray = false;
	for (const [i, entry] of Object.entries(o).entries()) {
		const mapped = inputIsArray ? flatMapEntry(i, entry[1]) : flatMapEntry(...entry, i);
		outputShouldBeArray ||= typeof mapped[0] === "number";
		const flattenedEntries = Array.isArray(mapped[0]) || mapped.length === 0 ? mapped : [mapped];
		for (const [k, v] of flattenedEntries) if (typeof k === "object") result[k.group] = append(result[k.group], v);
		else result[k] = v;
	}
	return outputShouldBeArray ? Object.values(result) : result;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/records.js
/**
* Object.entries wrapper providing narrowed types for objects with known sets
* of keys, e.g. those defined internally as configs
*/
const entriesOf = Object.entries;
const isKeyOf = (k, o) => k in o;
const hasKey = (o, k) => k in o;
var DynamicBase = class {
	constructor(properties) {
		Object.assign(this, properties);
	}
};
const NoopBase = class {};
/** @ts-ignore (needed to extend `t`) **/
var CastableBase = class extends NoopBase {};
const splitByKeys = (o, leftKeys) => {
	const l = {};
	const r = {};
	let k;
	for (k in o) if (k in leftKeys) l[k] = o[k];
	else r[k] = o[k];
	return [l, r];
};
const omit = (o, keys) => splitByKeys(o, keys)[1];
const isEmptyObject = (o) => Object.keys(o).length === 0;
const stringAndSymbolicEntriesOf = (o) => [...Object.entries(o), ...Object.getOwnPropertySymbols(o).map((k) => [k, o[k]])];
/** Like Object.assign, but it will preserve getters instead of evaluating them. */
const defineProperties = (base, merged) => Object.defineProperties(base, Object.getOwnPropertyDescriptors(merged));
/** Copies enumerable keys of o to a new object in alphabetical order */
const withAlphabetizedKeys = (o) => {
	const keys = Object.keys(o).sort();
	const result = {};
	for (let i = 0; i < keys.length; i++) result[keys[i]] = o[keys[i]];
	return result;
};
const unset = noSuggest(`unset${ZeroWidthSpace}`);
const enumValues = (tsEnum) => Object.values(tsEnum).filter((v) => {
	if (typeof v === "number") return true;
	return typeof tsEnum[v] !== "number";
});

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/objectKinds.js
const ecmascriptConstructors = {
	Array,
	Boolean,
	Date,
	Error,
	Function,
	Map,
	Number,
	Promise,
	RegExp,
	Set,
	String,
	WeakMap,
	WeakSet
};
/** Node18 */
const FileConstructor = globalThis.File ?? Blob;
const platformConstructors = {
	ArrayBuffer,
	Blob,
	File: FileConstructor,
	FormData,
	Headers,
	Request,
	Response,
	URL
};
const typedArrayConstructors = {
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array,
	BigInt64Array,
	BigUint64Array
};
const builtinConstructors = {
	...ecmascriptConstructors,
	...platformConstructors,
	...typedArrayConstructors,
	String,
	Number,
	Boolean
};
const objectKindOf = (data) => {
	let prototype = Object.getPrototypeOf(data);
	while (prototype?.constructor && (!isKeyOf(prototype.constructor.name, builtinConstructors) || !(data instanceof builtinConstructors[prototype.constructor.name]))) prototype = Object.getPrototypeOf(prototype);
	const name = prototype?.constructor?.name;
	if (name === void 0 || name === "Object") return void 0;
	return name;
};
const objectKindOrDomainOf = (data) => typeof data === "object" && data !== null ? objectKindOf(data) ?? "object" : domainOf(data);
const isArray = Array.isArray;
const ecmascriptDescriptions = {
	Array: "an array",
	Function: "a function",
	Date: "a Date",
	RegExp: "a RegExp",
	Error: "an Error",
	Map: "a Map",
	Set: "a Set",
	String: "a String object",
	Number: "a Number object",
	Boolean: "a Boolean object",
	Promise: "a Promise",
	WeakMap: "a WeakMap",
	WeakSet: "a WeakSet"
};
const platformDescriptions = {
	ArrayBuffer: "an ArrayBuffer instance",
	Blob: "a Blob instance",
	File: "a File instance",
	FormData: "a FormData instance",
	Headers: "a Headers instance",
	Request: "a Request instance",
	Response: "a Response instance",
	URL: "a URL instance"
};
const typedArrayDescriptions = {
	Int8Array: "an Int8Array",
	Uint8Array: "a Uint8Array",
	Uint8ClampedArray: "a Uint8ClampedArray",
	Int16Array: "an Int16Array",
	Uint16Array: "a Uint16Array",
	Int32Array: "an Int32Array",
	Uint32Array: "a Uint32Array",
	Float32Array: "a Float32Array",
	Float64Array: "a Float64Array",
	BigInt64Array: "a BigInt64Array",
	BigUint64Array: "a BigUint64Array"
};
/** Each defaultObjectKind's completion for the phrase "must be _____" */
const objectKindDescriptions = {
	...ecmascriptDescriptions,
	...platformDescriptions,
	...typedArrayDescriptions
};
/**
* this will only return an object kind if it's the root constructor
* example TypeError would return null not 'Error'
**/
const getBuiltinNameOfConstructor = (ctor) => {
	const constructorName = Object(ctor).name ?? null;
	return constructorName && isKeyOf(constructorName, builtinConstructors) && builtinConstructors[constructorName] === ctor ? constructorName : null;
};
/**
* Returns an array of constructors for all ancestors (i.e., prototypes) of a given object.
*/
const ancestorsOf = (o) => {
	let proto = Object.getPrototypeOf(o);
	const result = [];
	while (proto !== null) {
		result.push(proto.constructor);
		proto = Object.getPrototypeOf(proto);
	}
	return result;
};
const constructorExtends = (ctor, base) => {
	let current = ctor.prototype;
	while (current !== null) {
		if (current === base.prototype) return true;
		current = Object.getPrototypeOf(current);
	}
	return false;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/clone.js
/** Deeply copy the properties of the a non-subclassed Object, Array or Date.*/
const deepClone = (input) => _clone(input, /* @__PURE__ */ new Map());
const _clone = (input, seen) => {
	if (typeof input !== "object" || input === null) return input;
	if (seen?.has(input)) return seen.get(input);
	const builtinConstructorName = getBuiltinNameOfConstructor(input.constructor);
	if (builtinConstructorName === "Date") return new Date(input.getTime());
	if (builtinConstructorName && builtinConstructorName !== "Array") return input;
	const cloned = Array.isArray(input) ? input.slice() : Object.create(Object.getPrototypeOf(input));
	const propertyDescriptors = Object.getOwnPropertyDescriptors(input);
	if (seen) {
		seen.set(input, cloned);
		for (const k in propertyDescriptors) {
			const desc = propertyDescriptors[k];
			if ("get" in desc || "set" in desc) continue;
			desc.value = _clone(desc.value, seen);
		}
	}
	Object.defineProperties(cloned, propertyDescriptors);
	return cloned;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/functions.js
const cached = (thunk) => {
	let result = unset;
	return () => result === unset ? result = thunk() : result;
};
const isThunk = (value$1) => typeof value$1 === "function" && value$1.length === 0;
const DynamicFunction = class extends Function {
	constructor(...args) {
		const params = args.slice(0, -1);
		const body = args.at(-1);
		try {
			super(...params, body);
		} catch (e) {
			return throwInternalError(`Encountered an unexpected error while compiling your definition:
                Message: ${e} 
                Source: (${args.slice(0, -1)}) => {
                    ${args.at(-1)}
                }`);
		}
	}
};
var Callable = class {
	constructor(fn$1, ...[opts]) {
		return Object.assign(Object.setPrototypeOf(fn$1.bind(opts?.bind ?? this), this.constructor.prototype), opts?.attach);
	}
};
/**
* Checks if the environment has Content Security Policy (CSP) enabled,
* preventing JIT-optimized code from being compiled via new Function().
*
* @returns `true` if a function created using new Function() can be
* successfully invoked in the environment, `false` otherwise.
*
* The result is cached for subsequent invocations.
*/
const envHasCsp = cached(() => {
	try {
		return new Function("return false")();
	} catch {
		return true;
	}
});

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/generics.js
const brand = noSuggest("brand");
/** primitive key used to represent an inferred type at compile-time */
const inferred = noSuggest("arkInferred");

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/hkt.js
noSuggest("args");
var Hkt = class {
	constructor() {}
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/isomorphic.js
/** get a CJS/ESM compatible string representing the current file */
const fileName = () => {
	try {
		return (((/* @__PURE__ */ new Error()).stack?.split("\n")[2]?.trim() || "").match(/\(?(.+?)(?::\d+:\d+)?\)?$/)?.[1] || "unknown").replace(/^file:\/\//, "");
	} catch {
		return "unknown";
	}
};
const env = globalThis.process?.env ?? {};
const isomorphic = {
	fileName,
	env
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/strings.js
const capitalize$1 = (s) => s[0].toUpperCase() + s.slice(1);
const anchoredRegex = (regex$2) => new RegExp(anchoredSource(regex$2), typeof regex$2 === "string" ? "" : regex$2.flags);
const anchoredSource = (regex$2) => {
	return `^(?:${typeof regex$2 === "string" ? regex$2 : regex$2.source})$`;
};
const RegexPatterns = {
	negativeLookahead: (pattern) => `(?!${pattern})`,
	nonCapturingGroup: (pattern) => `(?:${pattern})`
};
const Backslash = "\\";
const whitespaceChars = {
	" ": 1,
	"\n": 1,
	"	": 1
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/numbers.js
const anchoredNegativeZeroPattern = /^-0\.?0*$/.source;
const positiveIntegerPattern = /[1-9]\d*/.source;
const looseDecimalPattern = /\.\d+/.source;
const strictDecimalPattern = /\.\d*[1-9]/.source;
const createNumberMatcher = (opts) => anchoredRegex(RegexPatterns.negativeLookahead(anchoredNegativeZeroPattern) + RegexPatterns.nonCapturingGroup("-?" + RegexPatterns.nonCapturingGroup(RegexPatterns.nonCapturingGroup("0|" + positiveIntegerPattern) + RegexPatterns.nonCapturingGroup(opts.decimalPattern) + "?") + (opts.allowDecimalOnly ? "|" + opts.decimalPattern : "") + "?"));
/**
*  Matches a well-formatted numeric expression according to the following rules:
*    1. Must include an integer portion (i.e. '.321' must be written as '0.321')
*    2. The first digit of the value must not be 0, unless the entire integer portion is 0
*    3. If the value includes a decimal, its last digit may not be 0
*    4. The value may not be "-0"
*/
const wellFormedNumberMatcher = createNumberMatcher({
	decimalPattern: strictDecimalPattern,
	allowDecimalOnly: false
});
const isWellFormedNumber = wellFormedNumberMatcher.test.bind(wellFormedNumberMatcher);
/**
* Similar to wellFormedNumber but more permissive in the following ways:
*
*  - Allows numbers without an integer portion like ".5" (well-formed equivalent is "0.5")
*  - Allows decimals with trailing zeroes like "0.10" (well-formed equivalent is "0.1")
*/
const numericStringMatcher = createNumberMatcher({
	decimalPattern: looseDecimalPattern,
	allowDecimalOnly: true
});
const isNumericString = numericStringMatcher.test.bind(numericStringMatcher);
const numberLikeMatcher = /^-?\d*\.?\d*$/;
const isNumberLike = (s) => s.length !== 0 && numberLikeMatcher.test(s);
/**
*  Matches a well-formatted integer according to the following rules:
*    1. must begin with an integer, the first digit of which cannot be 0 unless the entire value is 0
*    2. The value may not be "-0"
*/
const wellFormedIntegerMatcher = anchoredRegex(RegexPatterns.negativeLookahead("^-0$") + "-?" + RegexPatterns.nonCapturingGroup(RegexPatterns.nonCapturingGroup("0|" + positiveIntegerPattern)));
const isWellFormedInteger = wellFormedIntegerMatcher.test.bind(wellFormedIntegerMatcher);
const integerLikeMatcher = /^-?\d+$/;
const isIntegerLike = integerLikeMatcher.test.bind(integerLikeMatcher);
const numericLiteralDescriptions = {
	number: "a number",
	bigint: "a bigint",
	integer: "an integer"
};
const writeMalformedNumericLiteralMessage = (def, kind) => `'${def}' was parsed as ${numericLiteralDescriptions[kind]} but could not be narrowed to a literal value. Avoid unnecessary leading or trailing zeros and other abnormal notation`;
const isWellFormed = (def, kind) => kind === "number" ? isWellFormedNumber(def) : isWellFormedInteger(def);
const parseKind = (def, kind) => kind === "number" ? Number(def) : Number.parseInt(def);
const isKindLike = (def, kind) => kind === "number" ? isNumberLike(def) : isIntegerLike(def);
const tryParseNumber = (token, options) => parseNumeric(token, "number", options);
const tryParseWellFormedNumber = (token, options) => parseNumeric(token, "number", {
	...options,
	strict: true
});
const tryParseInteger = (token, options) => parseNumeric(token, "integer", options);
const parseNumeric = (token, kind, options) => {
	const value$1 = parseKind(token, kind);
	if (!Number.isNaN(value$1)) {
		if (isKindLike(token, kind)) {
			if (options?.strict) return isWellFormed(token, kind) ? value$1 : throwParseError(writeMalformedNumericLiteralMessage(token, kind));
			return value$1;
		}
	}
	return options?.errorOnFail ? throwParseError(options?.errorOnFail === true ? `Failed to parse ${numericLiteralDescriptions[kind]} from '${token}'` : options?.errorOnFail) : void 0;
};
const tryParseWellFormedBigint = (def) => {
	if (def[def.length - 1] !== "n") return;
	const maybeIntegerLiteral = def.slice(0, -1);
	let value$1;
	try {
		value$1 = BigInt(maybeIntegerLiteral);
	} catch {
		return;
	}
	if (wellFormedIntegerMatcher.test(maybeIntegerLiteral)) return value$1;
	if (integerLikeMatcher.test(maybeIntegerLiteral)) return throwParseError(writeMalformedNumericLiteralMessage(def, "bigint"));
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/registry.js
const arkUtilVersion = "0.53.0";
const initialRegistryContents = {
	version: arkUtilVersion,
	filename: isomorphic.fileName(),
	FileConstructor
};
const registry = initialRegistryContents;
const namesByResolution = /* @__PURE__ */ new Map();
const nameCounts = Object.create(null);
const register = (value$1) => {
	const existingName = namesByResolution.get(value$1);
	if (existingName) return existingName;
	let name = baseNameFor(value$1);
	if (nameCounts[name]) name = `${name}${nameCounts[name]++}`;
	else nameCounts[name] = 1;
	registry[name] = value$1;
	namesByResolution.set(value$1, name);
	return name;
};
const isDotAccessible = (keyName) => /^[$A-Z_a-z][\w$]*$/.test(keyName);
const baseNameFor = (value$1) => {
	switch (typeof value$1) {
		case "object": {
			if (value$1 === null) break;
			const prefix = objectKindOf(value$1) ?? "object";
			return prefix[0].toLowerCase() + prefix.slice(1);
		}
		case "function": return isDotAccessible(value$1.name) ? value$1.name : "fn";
		case "symbol": return value$1.description && isDotAccessible(value$1.description) ? value$1.description : "symbol";
	}
	return throwInternalError(`Unexpected attempt to register serializable value of type ${domainOf(value$1)}`);
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/primitive.js
const serializePrimitive = (value$1) => typeof value$1 === "string" ? JSON.stringify(value$1) : typeof value$1 === "bigint" ? `${value$1}n` : `${value$1}`;

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/serialize.js
const snapshot = (data, opts = {}) => _serialize(data, {
	onUndefined: `$ark.undefined`,
	onBigInt: (n) => `$ark.bigint-${n}`,
	...opts
}, []);
const printable = (data, opts) => {
	switch (domainOf(data)) {
		case "object":
			const o = data;
			const ctorName = o.constructor.name;
			return ctorName === "Object" || ctorName === "Array" ? opts?.quoteKeys === false ? stringifyUnquoted(o, opts?.indent ?? 0, "") : JSON.stringify(_serialize(o, printableOpts, []), null, opts?.indent) : stringifyUnquoted(o, opts?.indent ?? 0, "");
		case "symbol": return printableOpts.onSymbol(data);
		default: return serializePrimitive(data);
	}
};
const stringifyUnquoted = (value$1, indent$1, currentIndent) => {
	if (typeof value$1 === "function") return printableOpts.onFunction(value$1);
	if (typeof value$1 !== "object" || value$1 === null) return serializePrimitive(value$1);
	const nextIndent = currentIndent + " ".repeat(indent$1);
	if (Array.isArray(value$1)) {
		if (value$1.length === 0) return "[]";
		const items = value$1.map((item) => stringifyUnquoted(item, indent$1, nextIndent)).join(",\n" + nextIndent);
		return indent$1 ? `[\n${nextIndent}${items}\n${currentIndent}]` : `[${items}]`;
	}
	const ctorName = value$1.constructor.name;
	if (ctorName === "Object") {
		const keyValues = stringAndSymbolicEntriesOf(value$1).map(([key, val]) => {
			return `${nextIndent}${typeof key === "symbol" ? printableOpts.onSymbol(key) : isDotAccessible(key) ? key : JSON.stringify(key)}: ${stringifyUnquoted(val, indent$1, nextIndent)}`;
		});
		if (keyValues.length === 0) return "{}";
		return indent$1 ? `{\n${keyValues.join(",\n")}\n${currentIndent}}` : `{${keyValues.join(", ")}}`;
	}
	if (value$1 instanceof Date) return describeCollapsibleDate(value$1);
	if ("expression" in value$1 && typeof value$1.expression === "string") return value$1.expression;
	return ctorName;
};
const printableOpts = {
	onCycle: () => "(cycle)",
	onSymbol: (v) => `Symbol(${register(v)})`,
	onFunction: (v) => `Function(${register(v)})`
};
const _serialize = (data, opts, seen) => {
	switch (domainOf(data)) {
		case "object": {
			const o = data;
			if ("toJSON" in o && typeof o.toJSON === "function") return o.toJSON();
			if (typeof o === "function") return printableOpts.onFunction(o);
			if (seen.includes(o)) return "(cycle)";
			const nextSeen = [...seen, o];
			if (Array.isArray(o)) return o.map((item) => _serialize(item, opts, nextSeen));
			if (o instanceof Date) return o.toDateString();
			const result = {};
			for (const k in o) result[k] = _serialize(o[k], opts, nextSeen);
			for (const s of Object.getOwnPropertySymbols(o)) result[opts.onSymbol?.(s) ?? s.toString()] = _serialize(o[s], opts, nextSeen);
			return result;
		}
		case "symbol": return printableOpts.onSymbol(data);
		case "bigint": return opts.onBigInt?.(data) ?? `${data}n`;
		case "undefined": return opts.onUndefined ?? "undefined";
		case "string": return data.replaceAll("\\", "\\\\");
		default: return data;
	}
};
/**
* Converts a Date instance to a human-readable description relative to its precision
*/
const describeCollapsibleDate = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth();
	const dayOfMonth = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const milliseconds = date.getMilliseconds();
	if (month === 0 && dayOfMonth === 1 && hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0) return `${year}`;
	const datePortion = `${months[month]} ${dayOfMonth}, ${year}`;
	if (hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0) return datePortion;
	let timePortion = date.toLocaleTimeString();
	const suffix$1 = timePortion.endsWith(" AM") || timePortion.endsWith(" PM") ? timePortion.slice(-3) : "";
	if (suffix$1) timePortion = timePortion.slice(0, -suffix$1.length);
	if (milliseconds) timePortion += `.${pad(milliseconds, 3)}`;
	else if (timeWithUnnecessarySeconds.test(timePortion)) timePortion = timePortion.slice(0, -3);
	return `${timePortion + suffix$1}, ${datePortion}`;
};
const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
const timeWithUnnecessarySeconds = /:\d\d:00$/;
const pad = (value$1, length) => String(value$1).padStart(length, "0");

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/path.js
const appendStringifiedKey = (path, prop, ...[opts]) => {
	const stringifySymbol = opts?.stringifySymbol ?? printable;
	let propAccessChain = path;
	switch (typeof prop) {
		case "string":
			propAccessChain = isDotAccessible(prop) ? path === "" ? prop : `${path}.${prop}` : `${path}[${JSON.stringify(prop)}]`;
			break;
		case "number":
			propAccessChain = `${path}[${prop}]`;
			break;
		case "symbol":
			propAccessChain = `${path}[${stringifySymbol(prop)}]`;
			break;
		default: if (opts?.stringifyNonKey) propAccessChain = `${path}[${opts.stringifyNonKey(prop)}]`;
		else throwParseError(`${printable(prop)} must be a PropertyKey or stringifyNonKey must be passed to options`);
	}
	return propAccessChain;
};
const stringifyPath = (path, ...opts) => path.reduce((s, k) => appendStringifiedKey(s, k, ...opts), "");
var ReadonlyPath = class extends ReadonlyArray {
	cache = {};
	constructor(...items) {
		super();
		this.push(...items);
	}
	toJSON() {
		if (this.cache.json) return this.cache.json;
		this.cache.json = [];
		for (let i = 0; i < this.length; i++) this.cache.json.push(typeof this[i] === "symbol" ? printable(this[i]) : this[i]);
		return this.cache.json;
	}
	stringify() {
		if (this.cache.stringify) return this.cache.stringify;
		return this.cache.stringify = stringifyPath(this);
	}
	stringifyAncestors() {
		if (this.cache.stringifyAncestors) return this.cache.stringifyAncestors;
		let propString = "";
		const result = [propString];
		for (const path of this) {
			propString = appendStringifiedKey(propString, path);
			result.push(propString);
		}
		return this.cache.stringifyAncestors = result;
	}
};

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/scanner.js
var Scanner = class {
	chars;
	i;
	def;
	constructor(def) {
		this.def = def;
		this.chars = [...def];
		this.i = 0;
	}
	/** Get lookahead and advance scanner by one */
	shift() {
		return this.chars[this.i++] ?? "";
	}
	get lookahead() {
		return this.chars[this.i] ?? "";
	}
	get nextLookahead() {
		return this.chars[this.i + 1] ?? "";
	}
	get length() {
		return this.chars.length;
	}
	shiftUntil(condition) {
		let shifted = "";
		while (this.lookahead) if (condition(this, shifted)) break;
		else shifted += this.shift();
		return shifted;
	}
	shiftUntilEscapable(condition) {
		let shifted = "";
		while (this.lookahead) if (this.lookahead === Backslash) {
			this.shift();
			if (condition(this, shifted)) shifted += this.shift();
			else if (this.lookahead === Backslash) shifted += this.shift();
			else shifted += `${Backslash}${this.shift()}`;
		} else if (condition(this, shifted)) break;
		else shifted += this.shift();
		return shifted;
	}
	shiftUntilLookahead(charOrSet) {
		return typeof charOrSet === "string" ? this.shiftUntil((s) => s.lookahead === charOrSet) : this.shiftUntil((s) => s.lookahead in charOrSet);
	}
	shiftUntilNonWhitespace() {
		return this.shiftUntil(() => !(this.lookahead in whitespaceChars));
	}
	jumpToIndex(i) {
		this.i = i < 0 ? this.length + i : i;
	}
	jumpForward(count) {
		this.i += count;
	}
	get location() {
		return this.i;
	}
	get unscanned() {
		return this.chars.slice(this.i, this.length).join("");
	}
	get scanned() {
		return this.chars.slice(0, this.i).join("");
	}
	sliceChars(start, end) {
		return this.chars.slice(start, end).join("");
	}
	lookaheadIs(char) {
		return this.lookahead === char;
	}
	lookaheadIsIn(tokens) {
		return this.lookahead in tokens;
	}
};
const writeUnmatchedGroupCloseMessage = (char, unscanned) => `Unmatched ${char}${unscanned === "" ? "" : ` before ${unscanned}`}`;
const writeUnclosedGroupMessage = (missingChar) => `Missing ${missingChar}`;

//#endregion
//#region ../node_modules/.pnpm/@ark+util@0.53.0/node_modules/@ark/util/out/traits.js
const implementedTraits = noSuggest("implementedTraits");
const hasTrait = (traitClass) => (o) => {
	if (!hasDomain(o, "object")) return false;
	if (implementedTraits in o.constructor && o.constructor[implementedTraits].includes(traitClass)) return true;
	return ancestorsOf(o).includes(traitClass);
};
/** @ts-ignore required to extend NoopBase */
var Trait = class extends NoopBase {
	static get [Symbol.hasInstance]() {
		return hasTrait(this);
	}
	traitsOf() {
		return implementedTraits in this.constructor ? this.constructor[implementedTraits] : [];
	}
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/registry.js
let _registryName = "$ark";
let suffix = 2;
while (_registryName in globalThis) _registryName = `$ark${suffix++}`;
const registryName = _registryName;
globalThis[registryName] = registry;
const $ark = registry;
const reference = (name) => `${registryName}.${name}`;
const registeredReference = (value$1) => reference(register(value$1));

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/compile.js
var CompiledFunction = class extends CastableBase {
	argNames;
	body = "";
	constructor(...args) {
		super();
		this.argNames = args;
		for (const arg of args) {
			if (arg in this) throw new Error(`Arg name '${arg}' would overwrite an existing property on FunctionBody`);
			this[arg] = arg;
		}
	}
	indentation = 0;
	indent() {
		this.indentation += 4;
		return this;
	}
	dedent() {
		this.indentation -= 4;
		return this;
	}
	prop(key, optional = false) {
		return compileLiteralPropAccess(key, optional);
	}
	index(key, optional = false) {
		return indexPropAccess(`${key}`, optional);
	}
	line(statement) {
		this.body += `${" ".repeat(this.indentation)}${statement}\n`;
		return this;
	}
	const(identifier, expression) {
		this.line(`const ${identifier} = ${expression}`);
		return this;
	}
	let(identifier, expression) {
		return this.line(`let ${identifier} = ${expression}`);
	}
	set(identifier, expression) {
		return this.line(`${identifier} = ${expression}`);
	}
	if(condition, then) {
		return this.block(`if (${condition})`, then);
	}
	elseIf(condition, then) {
		return this.block(`else if (${condition})`, then);
	}
	else(then) {
		return this.block("else", then);
	}
	/** Current index is "i" */
	for(until, body, initialValue = 0) {
		return this.block(`for (let i = ${initialValue}; ${until}; i++)`, body);
	}
	/** Current key is "k" */
	forIn(object$1, body) {
		return this.block(`for (const k in ${object$1})`, body);
	}
	block(prefix, contents, suffix$1 = "") {
		this.line(`${prefix} {`);
		this.indent();
		contents(this);
		this.dedent();
		return this.line(`}${suffix$1}`);
	}
	return(expression = "") {
		return this.line(`return ${expression}`);
	}
	write(name = "anonymous", indent$1 = 0) {
		return `${name}(${this.argNames.join(", ")}) { ${indent$1 ? this.body.split("\n").map((l) => " ".repeat(indent$1) + `${l}`).join("\n") : this.body} }`;
	}
	compile() {
		return new DynamicFunction(...this.argNames, this.body);
	}
};
const compileSerializedValue = (value$1) => hasDomain(value$1, "object") || typeof value$1 === "symbol" ? registeredReference(value$1) : serializePrimitive(value$1);
const compileLiteralPropAccess = (key, optional = false) => {
	if (typeof key === "string" && isDotAccessible(key)) return `${optional ? "?" : ""}.${key}`;
	return indexPropAccess(serializeLiteralKey(key), optional);
};
const serializeLiteralKey = (key) => typeof key === "symbol" ? registeredReference(key) : JSON.stringify(key);
const indexPropAccess = (key, optional = false) => `${optional ? "?." : ""}[${key}]`;
var NodeCompiler = class extends CompiledFunction {
	traversalKind;
	optimistic;
	constructor(ctx) {
		super("data", "ctx");
		this.traversalKind = ctx.kind;
		this.optimistic = ctx.optimistic === true;
	}
	invoke(node$1, opts) {
		const arg = opts?.arg ?? this.data;
		const requiresContext = typeof node$1 === "string" ? true : this.requiresContextFor(node$1);
		const id = typeof node$1 === "string" ? node$1 : node$1.id;
		if (requiresContext) return `${this.referenceToId(id, opts)}(${arg}, ${this.ctx})`;
		return `${this.referenceToId(id, opts)}(${arg})`;
	}
	referenceToId(id, opts) {
		const base = `this.${id}${opts?.kind ?? this.traversalKind}`;
		return opts?.bind ? `${base}.bind(${opts?.bind})` : base;
	}
	requiresContextFor(node$1) {
		return this.traversalKind === "Apply" || node$1.allowsRequiresContext;
	}
	initializeErrorCount() {
		return this.const("errorCount", "ctx.currentErrorCount");
	}
	returnIfFail() {
		return this.if("ctx.currentErrorCount > errorCount", () => this.return());
	}
	returnIfFailFast() {
		return this.if("ctx.failFast && ctx.currentErrorCount > errorCount", () => this.return());
	}
	traverseKey(keyExpression, accessExpression, node$1) {
		const requiresContext = this.requiresContextFor(node$1);
		if (requiresContext) this.line(`${this.ctx}.path.push(${keyExpression})`);
		this.check(node$1, { arg: accessExpression });
		if (requiresContext) this.line(`${this.ctx}.path.pop()`);
		return this;
	}
	check(node$1, opts) {
		return this.traversalKind === "Allows" ? this.if(`!${this.invoke(node$1, opts)}`, () => this.return(false)) : this.line(this.invoke(node$1, opts));
	}
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/utils.js
const makeRootAndArrayPropertiesMutable = (o) => flatMorph(o, (k, v) => [k, isArray(v) ? [...v] : v]);
const arkKind = noSuggest("arkKind");
const hasArkKind = (value$1, kind) => value$1?.[arkKind] === kind;
const isNode = (value$1) => hasArkKind(value$1, "root") || hasArkKind(value$1, "constraint");

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/implement.js
const basisKinds = [
	"unit",
	"proto",
	"domain"
];
const structuralKinds = [
	"required",
	"optional",
	"index",
	"sequence"
];
const prestructuralKinds = [
	"pattern",
	"divisor",
	"exactLength",
	"max",
	"min",
	"maxLength",
	"minLength",
	"before",
	"after"
];
const refinementKinds = [
	...prestructuralKinds,
	"structure",
	"predicate"
];
const constraintKinds = [...refinementKinds, ...structuralKinds];
const rootKinds = [
	"alias",
	"union",
	"morph",
	"unit",
	"intersection",
	"proto",
	"domain"
];
const nodeKinds = [...rootKinds, ...constraintKinds];
const constraintKeys = flatMorph(constraintKinds, (i, kind) => [kind, 1]);
const structureKeys = flatMorph([...structuralKinds, "undeclared"], (i, k) => [k, 1]);
const precedenceByKind = flatMorph(nodeKinds, (i, kind) => [kind, i]);
const isNodeKind = (value$1) => typeof value$1 === "string" && value$1 in precedenceByKind;
const precedenceOfKind = (kind) => precedenceByKind[kind];
const schemaKindsRightOf = (kind) => rootKinds.slice(precedenceOfKind(kind) + 1);
const unionChildKinds = [...schemaKindsRightOf("union"), "alias"];
const morphChildKinds = [...schemaKindsRightOf("morph"), "alias"];
const defaultValueSerializer = (v) => {
	if (typeof v === "string" || typeof v === "boolean" || v === null) return v;
	if (typeof v === "number") {
		if (Number.isNaN(v)) return "NaN";
		if (v === Number.POSITIVE_INFINITY) return "Infinity";
		if (v === Number.NEGATIVE_INFINITY) return "-Infinity";
		return v;
	}
	return compileSerializedValue(v);
};
const compileObjectLiteral = (ctx) => {
	let result = "{ ";
	for (const [k, v] of Object.entries(ctx)) result += `${k}: ${compileSerializedValue(v)}, `;
	return result + " }";
};
const implementNode = (_) => {
	const implementation$22 = _;
	if (implementation$22.hasAssociatedError) {
		implementation$22.defaults.expected ??= (ctx) => "description" in ctx ? ctx.description : implementation$22.defaults.description(ctx);
		implementation$22.defaults.actual ??= (data) => printable(data);
		implementation$22.defaults.problem ??= (ctx) => `must be ${ctx.expected}${ctx.actual ? ` (was ${ctx.actual})` : ""}`;
		implementation$22.defaults.message ??= (ctx) => {
			if (ctx.path.length === 0) return ctx.problem;
			const problemWithLocation = `${ctx.propString} ${ctx.problem}`;
			if (problemWithLocation[0] === "[") return `value at ${problemWithLocation}`;
			return problemWithLocation;
		};
	}
	return implementation$22;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/toJsonSchema.js
var ToJsonSchemaError = class extends Error {
	name = "ToJsonSchemaError";
	code;
	context;
	constructor(code, context) {
		super(printable(context, {
			quoteKeys: false,
			indent: 4
		}));
		this.code = code;
		this.context = context;
	}
	hasCode(code) {
		return this.code === code;
	}
};
const defaultConfig = {
	dialect: "https://json-schema.org/draft/2020-12/schema",
	useRefs: false,
	fallback: {
		arrayObject: (ctx) => ToJsonSchema.throw("arrayObject", ctx),
		arrayPostfix: (ctx) => ToJsonSchema.throw("arrayPostfix", ctx),
		defaultValue: (ctx) => ToJsonSchema.throw("defaultValue", ctx),
		domain: (ctx) => ToJsonSchema.throw("domain", ctx),
		morph: (ctx) => ToJsonSchema.throw("morph", ctx),
		patternIntersection: (ctx) => ToJsonSchema.throw("patternIntersection", ctx),
		predicate: (ctx) => ToJsonSchema.throw("predicate", ctx),
		proto: (ctx) => ToJsonSchema.throw("proto", ctx),
		symbolKey: (ctx) => ToJsonSchema.throw("symbolKey", ctx),
		unit: (ctx) => ToJsonSchema.throw("unit", ctx),
		date: (ctx) => ToJsonSchema.throw("date", ctx)
	}
};
const ToJsonSchema = {
	Error: ToJsonSchemaError,
	throw: (...args) => {
		throw new ToJsonSchema.Error(...args);
	},
	throwInternalOperandError: (kind, schema$1) => throwInternalError(`Unexpected JSON Schema input for ${kind}: ${printable(schema$1)}`),
	defaultConfig
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/config.js
$ark.config ??= {};
const mergeConfigs = (base, merged) => {
	if (!merged) return base;
	const result = { ...base };
	let k;
	for (k in merged) {
		const keywords$1 = { ...base.keywords };
		if (k === "keywords") {
			for (const flatAlias in merged[k]) {
				const v = merged.keywords[flatAlias];
				if (v === void 0) continue;
				keywords$1[flatAlias] = typeof v === "string" ? { description: v } : v;
			}
			result.keywords = keywords$1;
		} else if (k === "toJsonSchema") result[k] = mergeToJsonSchemaConfigs(base.toJsonSchema, merged.toJsonSchema);
		else if (isNodeKind(k)) result[k] = {
			...base[k],
			...merged[k]
		};
		else result[k] = merged[k];
	}
	return result;
};
const mergeToJsonSchemaConfigs = ((baseConfig, mergedConfig) => {
	if (!baseConfig) return mergedConfig ?? {};
	if (!mergedConfig) return baseConfig;
	const result = { ...baseConfig };
	let k;
	for (k in mergedConfig) if (k === "fallback") result.fallback = mergeFallbacks(baseConfig.fallback, mergedConfig.fallback);
	else result[k] = mergedConfig[k];
	return result;
});
const mergeFallbacks = (base, merged) => {
	base = normalizeFallback(base);
	merged = normalizeFallback(merged);
	const result = {};
	let code;
	for (code in ToJsonSchema.defaultConfig.fallback) result[code] = merged[code] ?? merged.default ?? base[code] ?? base.default ?? ToJsonSchema.defaultConfig.fallback[code];
	return result;
};
const normalizeFallback = (fallback) => typeof fallback === "function" ? { default: fallback } : fallback ?? {};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/errors.js
var ArkError = class ArkError extends CastableBase {
	[arkKind] = "error";
	path;
	data;
	nodeConfig;
	input;
	ctx;
	constructor({ prefixPath, relativePath, ...input }, ctx) {
		super();
		this.input = input;
		this.ctx = ctx;
		defineProperties(this, input);
		const data = ctx.data;
		if (input.code === "union") input.errors = input.errors.flatMap((innerError) => {
			const flat = innerError.hasCode("union") ? innerError.errors : [innerError];
			if (!prefixPath && !relativePath) return flat;
			return flat.map((e) => e.transform((e$1) => ({
				...e$1,
				path: conflatenateAll(prefixPath, e$1.path, relativePath)
			})));
		});
		this.nodeConfig = ctx.config[this.code];
		const basePath = [...input.path ?? ctx.path];
		if (relativePath) basePath.push(...relativePath);
		if (prefixPath) basePath.unshift(...prefixPath);
		this.path = new ReadonlyPath(...basePath);
		this.data = "data" in input ? input.data : data;
	}
	transform(f) {
		return new ArkError(f({
			data: this.data,
			path: this.path,
			...this.input
		}), this.ctx);
	}
	hasCode(code) {
		return this.code === code;
	}
	get propString() {
		return stringifyPath(this.path);
	}
	get expected() {
		if (this.input.expected) return this.input.expected;
		const config = this.meta?.expected ?? this.nodeConfig.expected;
		return typeof config === "function" ? config(this.input) : config;
	}
	get actual() {
		if (this.input.actual) return this.input.actual;
		const config = this.meta?.actual ?? this.nodeConfig.actual;
		return typeof config === "function" ? config(this.data) : config;
	}
	get problem() {
		if (this.input.problem) return this.input.problem;
		const config = this.meta?.problem ?? this.nodeConfig.problem;
		return typeof config === "function" ? config(this) : config;
	}
	get message() {
		if (this.input.message) return this.input.message;
		const config = this.meta?.message ?? this.nodeConfig.message;
		return typeof config === "function" ? config(this) : config;
	}
	get flat() {
		return this.hasCode("intersection") ? [...this.errors] : [this];
	}
	toJSON() {
		return {
			data: this.data,
			path: this.path,
			...this.input,
			expected: this.expected,
			actual: this.actual,
			problem: this.problem,
			message: this.message
		};
	}
	toString() {
		return this.message;
	}
	throw() {
		throw this;
	}
};
/**
* A ReadonlyArray of `ArkError`s returned by a Type on invalid input.
*
* Subsequent errors added at an existing path are merged into an
* ArkError intersection.
*/
var ArkErrors = class ArkErrors extends ReadonlyArray {
	[arkKind] = "errors";
	ctx;
	constructor(ctx) {
		super();
		this.ctx = ctx;
	}
	/**
	* Errors by a pathString representing their location.
	*/
	byPath = Object.create(null);
	/**
	* {@link byPath} flattened so that each value is an array of ArkError instances at that path.
	*
	* ✅ Since "intersection" errors will be flattened to their constituent `.errors`,
	* they will never be directly present in this representation.
	*/
	get flatByPath() {
		return flatMorph(this.byPath, (k, v) => [k, v.flat]);
	}
	/**
	* {@link byPath} flattened so that each value is an array of problem strings at that path.
	*/
	get flatProblemsByPath() {
		return flatMorph(this.byPath, (k, v) => [k, v.flat.map((e) => e.problem)]);
	}
	/**
	* All pathStrings at which errors are present mapped to the errors occuring
	* at that path or any nested path within it.
	*/
	byAncestorPath = Object.create(null);
	count = 0;
	mutable = this;
	/**
	* Throw a TraversalError based on these errors.
	*/
	throw() {
		throw this.toTraversalError();
	}
	/**
	* Converts ArkErrors to TraversalError, a subclass of `Error` suitable for throwing with nice
	* formatting.
	*/
	toTraversalError() {
		return new TraversalError(this);
	}
	/**
	* Append an ArkError to this array, ignoring duplicates.
	*/
	add(error) {
		const existing = this.byPath[error.propString];
		if (existing) {
			if (error === existing) return;
			if (existing.hasCode("union") && existing.errors.length === 0) return;
			const errorIntersection = error.hasCode("union") && error.errors.length === 0 ? error : new ArkError({
				code: "intersection",
				errors: existing.hasCode("intersection") ? [...existing.errors, error] : [existing, error]
			}, this.ctx);
			const existingIndex = this.indexOf(existing);
			this.mutable[existingIndex === -1 ? this.length : existingIndex] = errorIntersection;
			this.byPath[error.propString] = errorIntersection;
			this.addAncestorPaths(error);
		} else {
			this.byPath[error.propString] = error;
			this.addAncestorPaths(error);
			this.mutable.push(error);
		}
		this.count++;
	}
	transform(f) {
		const result = new ArkErrors(this.ctx);
		for (const e of this) result.add(f(e));
		return result;
	}
	/**
	* Add all errors from an ArkErrors instance, ignoring duplicates and
	* prefixing their paths with that of the current Traversal.
	*/
	merge(errors) {
		for (const e of errors) this.add(new ArkError({
			...e,
			path: [...this.ctx.path, ...e.path]
		}, this.ctx));
	}
	/**
	* @internal
	*/
	affectsPath(path) {
		if (this.length === 0) return false;
		return path.stringifyAncestors().some((s) => s in this.byPath) || path.stringify() in this.byAncestorPath;
	}
	/**
	* A human-readable summary of all errors.
	*/
	get summary() {
		return this.toString();
	}
	/**
	* Alias of this ArkErrors instance for StandardSchema compatibility.
	*/
	get issues() {
		return this;
	}
	toJSON() {
		return [...this.map((e) => e.toJSON())];
	}
	toString() {
		return this.join("\n");
	}
	addAncestorPaths(error) {
		for (const propString of error.path.stringifyAncestors()) this.byAncestorPath[propString] = append(this.byAncestorPath[propString], error);
	}
};
var TraversalError = class extends Error {
	name = "TraversalError";
	constructor(errors) {
		if (errors.length === 1) super(errors.summary);
		else super("\n" + errors.map((error) => `  • ${indent(error)}`).join("\n"));
		Object.defineProperty(this, "arkErrors", {
			value: errors,
			enumerable: false
		});
	}
};
const indent = (error) => error.toString().split("\n").join("\n  ");

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/traversal.js
var Traversal = class {
	/**
	* #### the path being validated or morphed
	*
	* ✅ array indices represented as numbers
	* ⚠️ mutated during traversal - use `path.slice(0)` to snapshot
	* 🔗 use {@link propString} for a stringified version
	*/
	path = [];
	/**
	* #### {@link ArkErrors} that will be part of this traversal's finalized result
	*
	* ✅ will always be an empty array for a valid traversal
	*/
	errors = new ArkErrors(this);
	/**
	* #### the original value being traversed
	*/
	root;
	/**
	* #### configuration for this traversal
	*
	* ✅ options can affect traversal results and error messages
	* ✅ defaults < global config < scope config
	* ✅ does not include options configured on individual types
	*/
	config;
	queuedMorphs = [];
	branches = [];
	seen = {};
	constructor(root, config) {
		this.root = root;
		this.config = config;
	}
	/**
	* #### the data being validated or morphed
	*
	* ✅ extracted from {@link root} at {@link path}
	*/
	get data() {
		let result = this.root;
		for (const segment of this.path) result = result?.[segment];
		return result;
	}
	/**
	* #### a string representing {@link path}
	*
	* @propString
	*/
	get propString() {
		return stringifyPath(this.path);
	}
	/**
	* #### add an {@link ArkError} and return `false`
	*
	* ✅ useful for predicates like `.narrow`
	*/
	reject(input) {
		this.error(input);
		return false;
	}
	/**
	* #### add an {@link ArkError} from a description and return `false`
	*
	* ✅ useful for predicates like `.narrow`
	* 🔗 equivalent to {@link reject}({ expected })
	*/
	mustBe(expected) {
		this.error(expected);
		return false;
	}
	error(input) {
		const errCtx = typeof input === "object" ? input.code ? input : {
			...input,
			code: "predicate"
		} : {
			code: "predicate",
			expected: input
		};
		return this.errorFromContext(errCtx);
	}
	/**
	* #### whether {@link currentBranch} (or the traversal root, outside a union) has one or more errors
	*/
	hasError() {
		return this.currentErrorCount !== 0;
	}
	get currentBranch() {
		return this.branches.at(-1);
	}
	queueMorphs(morphs) {
		const input = {
			path: new ReadonlyPath(...this.path),
			morphs
		};
		if (this.currentBranch) this.currentBranch.queuedMorphs.push(input);
		else this.queuedMorphs.push(input);
	}
	finalize(onFail) {
		if (this.queuedMorphs.length) {
			if (typeof this.root === "object" && this.root !== null && this.config.clone) this.root = this.config.clone(this.root);
			this.applyQueuedMorphs();
		}
		if (this.hasError()) return onFail ? onFail(this.errors) : this.errors;
		return this.root;
	}
	get currentErrorCount() {
		return this.currentBranch ? this.currentBranch.error ? 1 : 0 : this.errors.count;
	}
	get failFast() {
		return this.branches.length !== 0;
	}
	pushBranch() {
		this.branches.push({
			error: void 0,
			queuedMorphs: []
		});
	}
	popBranch() {
		return this.branches.pop();
	}
	/**
	* @internal
	* Convenience for casting from InternalTraversal to Traversal
	* for cases where the extra methods on the external type are expected, e.g.
	* a morph or predicate.
	*/
	get external() {
		return this;
	}
	errorFromNodeContext(input) {
		return this.errorFromContext(input);
	}
	errorFromContext(errCtx) {
		const error = new ArkError(errCtx, this);
		if (this.currentBranch) this.currentBranch.error = error;
		else this.errors.add(error);
		return error;
	}
	applyQueuedMorphs() {
		while (this.queuedMorphs.length) {
			const queuedMorphs = this.queuedMorphs;
			this.queuedMorphs = [];
			for (const { path, morphs } of queuedMorphs) {
				if (this.errors.affectsPath(path)) continue;
				this.applyMorphsAtPath(path, morphs);
			}
		}
	}
	applyMorphsAtPath(path, morphs) {
		const key = path.at(-1);
		let parent;
		if (key !== void 0) {
			parent = this.root;
			for (let pathIndex = 0; pathIndex < path.length - 1; pathIndex++) parent = parent[path[pathIndex]];
		}
		for (const morph of morphs) {
			this.path = [...path];
			const morphIsNode = isNode(morph);
			const result = morph(parent === void 0 ? this.root : parent[key], this);
			if (result instanceof ArkError) {
				this.errors.add(result);
				break;
			}
			if (result instanceof ArkErrors) {
				if (!morphIsNode) this.errors.merge(result);
				this.queuedMorphs = [];
				break;
			}
			if (parent === void 0) this.root = result;
			else parent[key] = result;
			this.applyQueuedMorphs();
		}
	}
};
const traverseKey = (key, fn$1, ctx) => {
	if (!ctx) return fn$1();
	ctx.path.push(key);
	const result = fn$1();
	ctx.path.pop();
	return result;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/node.js
var BaseNode = class extends Callable {
	attachments;
	$;
	onFail;
	includesTransform;
	includesContextualPredicate;
	isCyclic;
	allowsRequiresContext;
	rootApplyStrategy;
	contextFreeMorph;
	rootApply;
	referencesById;
	shallowReferences;
	flatRefs;
	flatMorphs;
	allows;
	get shallowMorphs() {
		return [];
	}
	constructor(attachments, $) {
		super((data, pipedFromCtx, onFail = this.onFail) => {
			if (pipedFromCtx) {
				this.traverseApply(data, pipedFromCtx);
				return pipedFromCtx.hasError() ? pipedFromCtx.errors : pipedFromCtx.data;
			}
			return this.rootApply(data, onFail);
		}, { attach: attachments });
		this.attachments = attachments;
		this.$ = $;
		this.onFail = this.meta.onFail ?? this.$.resolvedConfig.onFail;
		this.includesTransform = this.hasKind("morph") || this.hasKind("structure") && this.structuralMorph !== void 0 || this.hasKind("sequence") && this.inner.defaultables !== void 0;
		this.includesContextualPredicate = this.hasKind("predicate") && this.inner.predicate.length !== 1;
		this.isCyclic = this.kind === "alias";
		this.referencesById = { [this.id]: this };
		this.shallowReferences = this.hasKind("structure") ? [this, ...this.children] : this.children.reduce((acc, child) => appendUniqueNodes(acc, child.shallowReferences), [this]);
		const isStructural = this.isStructural();
		this.flatRefs = [];
		this.flatMorphs = [];
		for (let i = 0; i < this.children.length; i++) {
			this.includesTransform ||= this.children[i].includesTransform;
			this.includesContextualPredicate ||= this.children[i].includesContextualPredicate;
			this.isCyclic ||= this.children[i].isCyclic;
			if (!isStructural) {
				const childFlatRefs = this.children[i].flatRefs;
				for (let j = 0; j < childFlatRefs.length; j++) {
					const childRef = childFlatRefs[j];
					if (!this.flatRefs.some((existing) => flatRefsAreEqual(existing, childRef))) {
						this.flatRefs.push(childRef);
						for (const branch of childRef.node.branches) if (branch.hasKind("morph") || branch.hasKind("intersection") && branch.structure?.structuralMorph !== void 0) this.flatMorphs.push({
							path: childRef.path,
							propString: childRef.propString,
							node: branch
						});
					}
				}
			}
			Object.assign(this.referencesById, this.children[i].referencesById);
		}
		this.flatRefs.sort((l, r) => l.path.length > r.path.length ? 1 : l.path.length < r.path.length ? -1 : l.propString > r.propString ? 1 : l.propString < r.propString ? -1 : l.node.expression < r.node.expression ? -1 : 1);
		this.allowsRequiresContext = this.includesContextualPredicate || this.isCyclic;
		this.rootApplyStrategy = !this.allowsRequiresContext && this.flatMorphs.length === 0 ? this.shallowMorphs.length === 0 ? "allows" : this.shallowMorphs.every((morph) => morph.length === 1 || morph.name === "$arkStructuralMorph") ? this.hasKind("union") ? this.branches.some((branch) => branch.shallowMorphs.length > 1) ? "contextual" : "branchedOptimistic" : this.shallowMorphs.length > 1 ? "contextual" : "optimistic" : "contextual" : "contextual";
		this.rootApply = this.createRootApply();
		this.allows = this.allowsRequiresContext ? (data) => this.traverseAllows(data, new Traversal(data, this.$.resolvedConfig)) : (data) => this.traverseAllows(data);
	}
	createRootApply() {
		switch (this.rootApplyStrategy) {
			case "allows": return (data, onFail) => {
				if (this.allows(data)) return data;
				const ctx = new Traversal(data, this.$.resolvedConfig);
				this.traverseApply(data, ctx);
				return ctx.finalize(onFail);
			};
			case "contextual": return (data, onFail) => {
				const ctx = new Traversal(data, this.$.resolvedConfig);
				this.traverseApply(data, ctx);
				return ctx.finalize(onFail);
			};
			case "optimistic":
				this.contextFreeMorph = this.shallowMorphs[0];
				const clone = this.$.resolvedConfig.clone;
				return (data, onFail) => {
					if (this.allows(data)) return this.contextFreeMorph(clone && (typeof data === "object" && data !== null || typeof data === "function") ? clone(data) : data);
					const ctx = new Traversal(data, this.$.resolvedConfig);
					this.traverseApply(data, ctx);
					return ctx.finalize(onFail);
				};
			case "branchedOptimistic": return this.createBranchedOptimisticRootApply();
			default:
				this.rootApplyStrategy;
				return throwInternalError(`Unexpected rootApplyStrategy ${this.rootApplyStrategy}`);
		}
	}
	compiledMeta = compileMeta(this.metaJson);
	cacheGetter(name, value$1) {
		Object.defineProperty(this, name, { value: value$1 });
		return value$1;
	}
	get description() {
		return this.cacheGetter("description", this.meta?.description ?? this.$.resolvedConfig[this.kind].description(this));
	}
	get references() {
		return Object.values(this.referencesById);
	}
	precedence = precedenceOfKind(this.kind);
	precompilation;
	assert = (data, pipedFromCtx) => this(data, pipedFromCtx, (errors) => errors.throw());
	traverse(data, pipedFromCtx) {
		return this(data, pipedFromCtx, null);
	}
	/** rawIn should be used internally instead */
	get in() {
		return this.cacheGetter("in", this.rawIn.isRoot() ? this.$.finalize(this.rawIn) : this.rawIn);
	}
	get rawIn() {
		return this.cacheGetter("rawIn", this.getIo("in"));
	}
	/** rawOut should be used internally instead */
	get out() {
		return this.cacheGetter("out", this.rawOut.isRoot() ? this.$.finalize(this.rawOut) : this.rawOut);
	}
	get rawOut() {
		return this.cacheGetter("rawOut", this.getIo("out"));
	}
	getIo(ioKind) {
		if (!this.includesTransform) return this;
		const ioInner = {};
		for (const [k, v] of this.innerEntries) {
			const keySchemaImplementation = this.impl.keys[k];
			if (keySchemaImplementation.reduceIo) keySchemaImplementation.reduceIo(ioKind, ioInner, v);
			else if (keySchemaImplementation.child) {
				const childValue = v;
				ioInner[k] = isArray(childValue) ? childValue.map((child) => ioKind === "in" ? child.rawIn : child.rawOut) : ioKind === "in" ? childValue.rawIn : childValue.rawOut;
			} else ioInner[k] = v;
		}
		return this.$.node(this.kind, ioInner);
	}
	toJSON() {
		return this.json;
	}
	toString() {
		return `Type<${this.expression}>`;
	}
	equals(r) {
		const rNode = isNode(r) ? r : this.$.parseDefinition(r);
		return this.innerHash === rNode.innerHash;
	}
	ifEquals(r) {
		return this.equals(r) ? this : void 0;
	}
	hasKind(kind) {
		return this.kind === kind;
	}
	assertHasKind(kind) {
		if (this.kind !== kind) throwError(`${this.kind} node was not of asserted kind ${kind}`);
		return this;
	}
	hasKindIn(...kinds) {
		return kinds.includes(this.kind);
	}
	assertHasKindIn(...kinds) {
		if (!includes(kinds, this.kind)) throwError(`${this.kind} node was not one of asserted kinds ${kinds}`);
		return this;
	}
	isBasis() {
		return includes(basisKinds, this.kind);
	}
	isConstraint() {
		return includes(constraintKinds, this.kind);
	}
	isStructural() {
		return includes(structuralKinds, this.kind);
	}
	isRefinement() {
		return includes(refinementKinds, this.kind);
	}
	isRoot() {
		return includes(rootKinds, this.kind);
	}
	isUnknown() {
		return this.hasKind("intersection") && this.children.length === 0;
	}
	isNever() {
		return this.hasKind("union") && this.children.length === 0;
	}
	hasUnit(value$1) {
		return this.hasKind("unit") && this.allows(value$1);
	}
	hasOpenIntersection() {
		return this.impl.intersectionIsOpen;
	}
	get nestableExpression() {
		return this.expression;
	}
	select(selector) {
		const normalized = NodeSelector.normalize(selector);
		return this._select(normalized);
	}
	_select(selector) {
		let nodes = NodeSelector.applyBoundary[selector.boundary ?? "references"](this);
		if (selector.kind) nodes = nodes.filter((n) => n.kind === selector.kind);
		if (selector.where) nodes = nodes.filter(selector.where);
		return NodeSelector.applyMethod[selector.method ?? "filter"](nodes, this, selector);
	}
	transform(mapper, opts) {
		return this._transform(mapper, this._createTransformContext(opts));
	}
	_createTransformContext(opts) {
		return {
			root: this,
			selected: void 0,
			seen: {},
			path: [],
			parseOptions: { prereduced: opts?.prereduced ?? false },
			undeclaredKeyHandling: void 0,
			...opts
		};
	}
	_transform(mapper, ctx) {
		const $ = ctx.bindScope ?? this.$;
		if (ctx.seen[this.id]) return this.$.lazilyResolve(ctx.seen[this.id]);
		if (ctx.shouldTransform?.(this, ctx) === false) return this;
		let transformedNode;
		ctx.seen[this.id] = () => transformedNode;
		if (this.hasKind("structure") && this.undeclared !== ctx.undeclaredKeyHandling) ctx = {
			...ctx,
			undeclaredKeyHandling: this.undeclared
		};
		const innerWithTransformedChildren = flatMorph(this.inner, (k, v) => {
			if (!this.impl.keys[k].child) return [k, v];
			const children = v;
			if (!isArray(children)) {
				const transformed$1 = children._transform(mapper, ctx);
				return transformed$1 ? [k, transformed$1] : [];
			}
			if (children.length === 0) return [k, v];
			const transformed = children.flatMap((n) => {
				return n._transform(mapper, ctx) ?? [];
			});
			return transformed.length ? [k, transformed] : [];
		});
		delete ctx.seen[this.id];
		const innerWithMeta = Object.assign(innerWithTransformedChildren, { meta: this.meta });
		const transformedInner = ctx.selected && !ctx.selected.includes(this) ? innerWithMeta : mapper(this.kind, innerWithMeta, ctx);
		if (transformedInner === null) return null;
		if (isNode(transformedInner)) return transformedNode = transformedInner;
		const transformedKeys = Object.keys(transformedInner);
		if ((transformedKeys.length === 0 || transformedKeys.length === 1 && transformedKeys[0] === "meta") && !isEmptyObject(this.inner)) return null;
		if ((this.kind === "required" || this.kind === "optional" || this.kind === "index") && !("value" in transformedInner)) return ctx.undeclaredKeyHandling ? {
			...transformedInner,
			value: $ark.intrinsic.unknown
		} : null;
		if (this.kind === "morph") transformedInner.in ??= $ark.intrinsic.unknown;
		return transformedNode = $.node(this.kind, transformedInner, ctx.parseOptions);
	}
	configureReferences(meta, selector = "references") {
		const normalized = NodeSelector.normalize(selector);
		const mapper = typeof meta === "string" ? (kind, inner) => ({
			...inner,
			meta: {
				...inner.meta,
				description: meta
			}
		}) : typeof meta === "function" ? (kind, inner) => ({
			...inner,
			meta: meta(inner.meta)
		}) : (kind, inner) => ({
			...inner,
			meta: {
				...inner.meta,
				...meta
			}
		});
		if (normalized.boundary === "self") return this.$.node(this.kind, mapper(this.kind, {
			...this.inner,
			meta: this.meta
		}));
		const rawSelected = this._select(normalized);
		const selected = rawSelected && liftArray(rawSelected);
		const shouldTransform = normalized.boundary === "child" ? (node$1, ctx) => ctx.root.children.includes(node$1) : normalized.boundary === "shallow" ? (node$1) => node$1.kind !== "structure" : () => true;
		return this.$.finalize(this.transform(mapper, {
			shouldTransform,
			selected
		}));
	}
};
const NodeSelector = {
	applyBoundary: {
		self: (node$1) => [node$1],
		child: (node$1) => [...node$1.children],
		shallow: (node$1) => [...node$1.shallowReferences],
		references: (node$1) => [...node$1.references]
	},
	applyMethod: {
		filter: (nodes) => nodes,
		assertFilter: (nodes, from, selector) => {
			if (nodes.length === 0) throwError(writeSelectAssertionMessage(from, selector));
			return nodes;
		},
		find: (nodes) => nodes[0],
		assertFind: (nodes, from, selector) => {
			if (nodes.length === 0) throwError(writeSelectAssertionMessage(from, selector));
			return nodes[0];
		}
	},
	normalize: (selector) => typeof selector === "function" ? {
		boundary: "references",
		method: "filter",
		where: selector
	} : typeof selector === "string" ? isKeyOf(selector, NodeSelector.applyBoundary) ? {
		method: "filter",
		boundary: selector
	} : {
		boundary: "references",
		method: "filter",
		kind: selector
	} : {
		boundary: "references",
		method: "filter",
		...selector
	}
};
const writeSelectAssertionMessage = (from, selector) => `${from} had no references matching ${printable(selector)}.`;
const typePathToPropString = (path) => stringifyPath(path, { stringifyNonKey: (node$1) => node$1.expression });
const referenceMatcher = /"(\$ark\.[^"]+)"/g;
const compileMeta = (metaJson) => JSON.stringify(metaJson).replaceAll(referenceMatcher, "$1");
const flatRef = (path, node$1) => ({
	path,
	node: node$1,
	propString: typePathToPropString(path)
});
const flatRefsAreEqual = (l, r) => l.propString === r.propString && l.node.equals(r.node);
const appendUniqueFlatRefs = (existing, refs) => appendUnique(existing, refs, { isEqual: flatRefsAreEqual });
const appendUniqueNodes = (existing, refs) => appendUnique(existing, refs, { isEqual: (l, r) => l.equals(r) });

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/disjoint.js
var Disjoint = class Disjoint extends Array {
	static init(kind, l, r, ctx) {
		return new Disjoint({
			kind,
			l,
			r,
			path: ctx?.path ?? [],
			optional: ctx?.optional ?? false
		});
	}
	add(kind, l, r, ctx) {
		this.push({
			kind,
			l,
			r,
			path: ctx?.path ?? [],
			optional: ctx?.optional ?? false
		});
		return this;
	}
	get summary() {
		return this.describeReasons();
	}
	describeReasons() {
		if (this.length === 1) {
			const { path, l, r } = this[0];
			const pathString = stringifyPath(path);
			return writeUnsatisfiableExpressionError(`Intersection${pathString && ` at ${pathString}`} of ${describeReasons(l, r)}`);
		}
		return `The following intersections result in unsatisfiable types:\n• ${this.map(({ path, l, r }) => `${path}: ${describeReasons(l, r)}`).join("\n• ")}`;
	}
	throw() {
		return throwParseError(this.describeReasons());
	}
	invert() {
		const result = this.map((entry) => ({
			...entry,
			l: entry.r,
			r: entry.l
		}));
		if (!(result instanceof Disjoint)) return new Disjoint(...result);
		return result;
	}
	withPrefixKey(key, kind) {
		return this.map((entry) => ({
			...entry,
			path: [key, ...entry.path],
			optional: entry.optional || kind === "optional"
		}));
	}
	toNeverIfDisjoint() {
		return $ark.intrinsic.never;
	}
};
const describeReasons = (l, r) => `${describeReason(l)} and ${describeReason(r)}`;
const describeReason = (value$1) => isNode(value$1) ? value$1.expression : isArray(value$1) ? value$1.map(describeReason).join(" | ") || "never" : String(value$1);
const writeUnsatisfiableExpressionError = (expression) => `${expression} results in an unsatisfiable type`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/shared/intersections.js
const intersectionCache = {};
const intersectNodesRoot = (l, r, $) => intersectOrPipeNodes(l, r, {
	$,
	invert: false,
	pipe: false
});
const pipeNodesRoot = (l, r, $) => intersectOrPipeNodes(l, r, {
	$,
	invert: false,
	pipe: true
});
const intersectOrPipeNodes = ((l, r, ctx) => {
	const operator = ctx.pipe ? "|>" : "&";
	const lrCacheKey = `${l.hash}${operator}${r.hash}`;
	if (intersectionCache[lrCacheKey] !== void 0) return intersectionCache[lrCacheKey];
	if (!ctx.pipe) {
		const rlCacheKey = `${r.hash}${operator}${l.hash}`;
		if (intersectionCache[rlCacheKey] !== void 0) {
			const rlResult = intersectionCache[rlCacheKey];
			const lrResult = rlResult instanceof Disjoint ? rlResult.invert() : rlResult;
			intersectionCache[lrCacheKey] = lrResult;
			return lrResult;
		}
	}
	const isPureIntersection = !ctx.pipe || !l.includesTransform && !r.includesTransform;
	if (isPureIntersection && l.equals(r)) return l;
	let result = isPureIntersection ? _intersectNodes(l, r, ctx) : l.hasKindIn(...rootKinds) ? _pipeNodes(l, r, ctx) : _intersectNodes(l, r, ctx);
	if (isNode(result)) {
		if (l.equals(result)) result = l;
		else if (r.equals(result)) result = r;
	}
	intersectionCache[lrCacheKey] = result;
	return result;
});
const _intersectNodes = (l, r, ctx) => {
	const leftmostKind = l.precedence < r.precedence ? l.kind : r.kind;
	const implementation$22 = l.impl.intersections[r.kind] ?? r.impl.intersections[l.kind];
	if (implementation$22 === void 0) return null;
	else if (leftmostKind === l.kind) return implementation$22(l, r, ctx);
	else {
		let result = implementation$22(r, l, {
			...ctx,
			invert: !ctx.invert
		});
		if (result instanceof Disjoint) result = result.invert();
		return result;
	}
};
const _pipeNodes = (l, r, ctx) => l.includesTransform || r.includesTransform ? ctx.invert ? pipeMorphed(r, l, ctx) : pipeMorphed(l, r, ctx) : _intersectNodes(l, r, ctx);
const pipeMorphed = (from, to, ctx) => from.distribute((fromBranch) => _pipeMorphed(fromBranch, to, ctx), (results) => {
	const viableBranches = results.filter(isNode);
	if (viableBranches.length === 0) return Disjoint.init("union", from.branches, to.branches);
	if (viableBranches.length < from.branches.length || !from.branches.every((branch, i) => branch.rawIn.equals(viableBranches[i].rawIn))) return ctx.$.parseSchema(viableBranches);
	if (viableBranches.length === 1) return viableBranches[0];
	const schema$1 = { branches: viableBranches };
	return ctx.$.parseSchema(schema$1);
});
const _pipeMorphed = (from, to, ctx) => {
	if (from.hasKind("morph")) {
		const morphs = [...from.morphs];
		if (from.lastMorphIfNode) {
			const outIntersection = intersectOrPipeNodes(from.lastMorphIfNode, to, ctx);
			if (outIntersection instanceof Disjoint) return outIntersection;
			morphs[morphs.length - 1] = outIntersection;
		} else morphs.push(to);
		return ctx.$.node("morph", {
			morphs,
			in: from.inner.in
		});
	}
	if (to.hasKind("morph")) {
		const inTersection = intersectOrPipeNodes(from, to.rawIn, ctx);
		if (inTersection instanceof Disjoint) return inTersection;
		return ctx.$.node("morph", {
			morphs: [to],
			in: inTersection
		});
	}
	return ctx.$.node("morph", {
		morphs: [to],
		in: from
	});
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/constraint.js
var BaseConstraint = class extends BaseNode {
	constructor(attachments, $) {
		super(attachments, $);
		Object.defineProperty(this, arkKind, {
			value: "constraint",
			enumerable: false
		});
	}
	impliedSiblings;
	intersect(r) {
		return intersectNodesRoot(this, r, this.$);
	}
};
var InternalPrimitiveConstraint = class extends BaseConstraint {
	traverseApply = (data, ctx) => {
		if (!this.traverseAllows(data, ctx)) ctx.errorFromNodeContext(this.errorContext);
	};
	compile(js) {
		if (js.traversalKind === "Allows") js.return(this.compiledCondition);
		else js.if(this.compiledNegation, () => js.line(`ctx.errorFromNodeContext(${this.compiledErrorContext})`));
	}
	get errorContext() {
		return {
			code: this.kind,
			description: this.description,
			meta: this.meta,
			...this.inner
		};
	}
	get compiledErrorContext() {
		return compileObjectLiteral(this.errorContext);
	}
};
const constraintKeyParser = (kind) => (schema$1, ctx) => {
	if (isArray(schema$1)) {
		if (schema$1.length === 0) return;
		const nodes = schema$1.map((schema$2) => ctx.$.node(kind, schema$2));
		if (kind === "predicate") return nodes;
		return nodes.sort((l, r) => l.hash < r.hash ? -1 : 1);
	}
	const child = ctx.$.node(kind, schema$1);
	return child.hasOpenIntersection() ? [child] : child;
};
const intersectConstraints = (s) => {
	const head = s.r.shift();
	if (!head) {
		let result = s.l.length === 0 && s.kind === "structure" ? $ark.intrinsic.unknown.internal : s.ctx.$.node(s.kind, Object.assign(s.baseInner, unflattenConstraints(s.l)), { prereduced: true });
		for (const root of s.roots) {
			if (result instanceof Disjoint) return result;
			result = intersectOrPipeNodes(root, result, s.ctx);
		}
		return result;
	}
	let matched = false;
	for (let i = 0; i < s.l.length; i++) {
		const result = intersectOrPipeNodes(s.l[i], head, s.ctx);
		if (result === null) continue;
		if (result instanceof Disjoint) return result;
		if (result.isRoot()) {
			s.roots.push(result);
			s.l.splice(i);
			return intersectConstraints(s);
		}
		if (!matched) {
			s.l[i] = result;
			matched = true;
		} else if (!s.l.includes(result)) return throwInternalError(`Unexpectedly encountered multiple distinct intersection results for refinement ${head}`);
	}
	if (!matched) s.l.push(head);
	if (s.kind === "intersection") {
		if (head.impliedSiblings) for (const node$1 of head.impliedSiblings) appendUnique(s.r, node$1);
	}
	return intersectConstraints(s);
};
const flattenConstraints = (inner) => {
	return Object.entries(inner).flatMap(([k, v]) => k in constraintKeys ? v : []).sort((l, r) => l.precedence < r.precedence ? -1 : l.precedence > r.precedence ? 1 : l.kind === "predicate" && r.kind === "predicate" ? 0 : l.hash < r.hash ? -1 : 1);
};
const unflattenConstraints = (constraints) => {
	const inner = {};
	for (const constraint of constraints) if (constraint.hasOpenIntersection()) inner[constraint.kind] = append(inner[constraint.kind], constraint);
	else {
		if (inner[constraint.kind]) return throwInternalError(`Unexpected intersection of closed refinements of kind ${constraint.kind}`);
		inner[constraint.kind] = constraint;
	}
	return inner;
};
const throwInvalidOperandError = (...args) => throwParseError(writeInvalidOperandMessage(...args));
const writeInvalidOperandMessage = (kind, expected, actual) => {
	const actualDescription = actual.hasKind("morph") ? "a morph" : actual.isUnknown() ? "unknown" : actual.exclude(expected).defaultShortDescription;
	return `${capitalize$1(kind)} operand must be ${expected.description} (was ${actualDescription})`;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/generic.js
const parseGeneric = (paramDefs, bodyDef, $) => new GenericRoot(paramDefs, bodyDef, $, $, null);
var LazyGenericBody = class extends Callable {};
var GenericRoot = class extends Callable {
	[arkKind] = "generic";
	paramDefs;
	bodyDef;
	$;
	arg$;
	baseInstantiation;
	hkt;
	description;
	constructor(paramDefs, bodyDef, $, arg$, hkt) {
		super((...args) => {
			const argNodes = flatMorph(this.names, (i, name) => {
				const arg = this.arg$.parse(args[i]);
				if (!arg.extends(this.constraints[i])) throwParseError(writeUnsatisfiedParameterConstraintMessage(name, this.constraints[i].expression, arg.expression));
				return [name, arg];
			});
			if (this.defIsLazy()) {
				const def = this.bodyDef(argNodes);
				return this.$.parse(def);
			}
			return this.$.parse(bodyDef, { args: argNodes });
		});
		this.paramDefs = paramDefs;
		this.bodyDef = bodyDef;
		this.$ = $;
		this.arg$ = arg$;
		this.hkt = hkt;
		this.description = hkt ? new hkt().description ?? `a generic type for ${hkt.constructor.name}` : "a generic type";
		this.baseInstantiation = this(...this.constraints);
	}
	defIsLazy() {
		return this.bodyDef instanceof LazyGenericBody;
	}
	cacheGetter(name, value$1) {
		Object.defineProperty(this, name, { value: value$1 });
		return value$1;
	}
	get json() {
		return this.cacheGetter("json", {
			params: this.params.map((param) => param[1].isUnknown() ? param[0] : [param[0], param[1].json]),
			body: snapshot(this.bodyDef)
		});
	}
	get params() {
		return this.cacheGetter("params", this.paramDefs.map((param) => typeof param === "string" ? [param, $ark.intrinsic.unknown] : [param[0], this.$.parse(param[1])]));
	}
	get names() {
		return this.cacheGetter("names", this.params.map((e) => e[0]));
	}
	get constraints() {
		return this.cacheGetter("constraints", this.params.map((e) => e[1]));
	}
	get internal() {
		return this;
	}
	get referencesById() {
		return this.baseInstantiation.internal.referencesById;
	}
	get references() {
		return this.baseInstantiation.internal.references;
	}
};
const writeUnsatisfiedParameterConstraintMessage = (name, constraint, arg) => `${name} must be assignable to ${constraint} (was ${arg})`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/predicate.js
const implementation$21 = implementNode({
	kind: "predicate",
	hasAssociatedError: true,
	collapsibleKey: "predicate",
	keys: { predicate: {} },
	normalize: (schema$1) => typeof schema$1 === "function" ? { predicate: schema$1 } : schema$1,
	defaults: { description: (node$1) => `valid according to ${node$1.predicate.name || "an anonymous predicate"}` },
	intersectionIsOpen: true,
	intersections: { predicate: () => null }
});
var PredicateNode = class extends BaseConstraint {
	serializedPredicate = registeredReference(this.predicate);
	compiledCondition = `${this.serializedPredicate}(data, ctx)`;
	compiledNegation = `!${this.compiledCondition}`;
	impliedBasis = null;
	expression = this.serializedPredicate;
	traverseAllows = this.predicate;
	errorContext = {
		code: "predicate",
		description: this.description,
		meta: this.meta
	};
	compiledErrorContext = compileObjectLiteral(this.errorContext);
	traverseApply = (data, ctx) => {
		if (!this.predicate(data, ctx.external) && !ctx.hasError()) ctx.errorFromNodeContext(this.errorContext);
	};
	compile(js) {
		if (js.traversalKind === "Allows") {
			js.return(this.compiledCondition);
			return;
		}
		js.if(`${this.compiledNegation} && !ctx.hasError()`, () => js.line(`ctx.errorFromNodeContext(${this.compiledErrorContext})`));
	}
	reduceJsonSchema(base, ctx) {
		return ctx.fallback.predicate({
			code: "predicate",
			base,
			predicate: this.predicate
		});
	}
};
const Predicate = {
	implementation: implementation$21,
	Node: PredicateNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/divisor.js
const implementation$20 = implementNode({
	kind: "divisor",
	collapsibleKey: "rule",
	keys: { rule: { parse: (divisor) => Number.isInteger(divisor) ? divisor : throwParseError(writeNonIntegerDivisorMessage(divisor)) } },
	normalize: (schema$1) => typeof schema$1 === "number" ? { rule: schema$1 } : schema$1,
	hasAssociatedError: true,
	defaults: { description: (node$1) => node$1.rule === 1 ? "an integer" : node$1.rule === 2 ? "even" : `a multiple of ${node$1.rule}` },
	intersections: { divisor: (l, r, ctx) => ctx.$.node("divisor", { rule: Math.abs(l.rule * r.rule / greatestCommonDivisor(l.rule, r.rule)) }) },
	obviatesBasisDescription: true
});
var DivisorNode = class extends InternalPrimitiveConstraint {
	traverseAllows = (data) => data % this.rule === 0;
	compiledCondition = `data % ${this.rule} === 0`;
	compiledNegation = `data % ${this.rule} !== 0`;
	impliedBasis = $ark.intrinsic.number.internal;
	expression = `% ${this.rule}`;
	reduceJsonSchema(schema$1) {
		schema$1.type = "integer";
		if (this.rule === 1) return schema$1;
		schema$1.multipleOf = this.rule;
		return schema$1;
	}
};
const Divisor = {
	implementation: implementation$20,
	Node: DivisorNode
};
const writeNonIntegerDivisorMessage = (divisor) => `divisor must be an integer (was ${divisor})`;
const greatestCommonDivisor = (l, r) => {
	let previous;
	let greatestCommonDivisor$1 = l;
	let current = r;
	while (current !== 0) {
		previous = current;
		current = greatestCommonDivisor$1 % current;
		greatestCommonDivisor$1 = previous;
	}
	return greatestCommonDivisor$1;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/range.js
var BaseRange = class extends InternalPrimitiveConstraint {
	boundOperandKind = operandKindsByBoundKind[this.kind];
	compiledActual = this.boundOperandKind === "value" ? `data` : this.boundOperandKind === "length" ? `data.length` : `data.valueOf()`;
	comparator = compileComparator(this.kind, this.exclusive);
	numericLimit = this.rule.valueOf();
	expression = `${this.comparator} ${this.rule}`;
	compiledCondition = `${this.compiledActual} ${this.comparator} ${this.numericLimit}`;
	compiledNegation = `${this.compiledActual} ${negatedComparators[this.comparator]} ${this.numericLimit}`;
	stringLimit = this.boundOperandKind === "date" ? dateLimitToString(this.numericLimit) : `${this.numericLimit}`;
	limitKind = this.comparator["0"] === "<" ? "upper" : "lower";
	isStricterThan(r) {
		return (this.limitKind === "upper" ? this.numericLimit < r.numericLimit : this.numericLimit > r.numericLimit) || this.numericLimit === r.numericLimit && this.exclusive === true && !r.exclusive;
	}
	overlapsRange(r) {
		if (this.isStricterThan(r)) return false;
		if (this.numericLimit === r.numericLimit && (this.exclusive || r.exclusive)) return false;
		return true;
	}
	overlapIsUnit(r) {
		return this.numericLimit === r.numericLimit && !this.exclusive && !r.exclusive;
	}
};
const negatedComparators = {
	"<": ">=",
	"<=": ">",
	">": "<=",
	">=": "<"
};
const boundKindPairsByLower = {
	min: "max",
	minLength: "maxLength",
	after: "before"
};
const parseExclusiveKey = { parse: (flag) => flag || void 0 };
const createLengthSchemaNormalizer = (kind) => (schema$1) => {
	if (typeof schema$1 === "number") return { rule: schema$1 };
	const { exclusive, ...normalized } = schema$1;
	return exclusive ? {
		...normalized,
		rule: kind === "minLength" ? normalized.rule + 1 : normalized.rule - 1
	} : normalized;
};
const createDateSchemaNormalizer = (kind) => (schema$1) => {
	if (typeof schema$1 === "number" || typeof schema$1 === "string" || schema$1 instanceof Date) return { rule: schema$1 };
	const { exclusive, ...normalized } = schema$1;
	if (!exclusive) return normalized;
	const numericLimit = typeof normalized.rule === "number" ? normalized.rule : typeof normalized.rule === "string" ? new Date(normalized.rule).valueOf() : normalized.rule.valueOf();
	return exclusive ? {
		...normalized,
		rule: kind === "after" ? numericLimit + 1 : numericLimit - 1
	} : normalized;
};
const parseDateLimit = (limit) => typeof limit === "string" || typeof limit === "number" ? new Date(limit) : limit;
const writeInvalidLengthBoundMessage = (kind, limit) => `${kind} bound must be a positive integer (was ${limit})`;
const createLengthRuleParser = (kind) => (limit) => {
	if (!Number.isInteger(limit) || limit < 0) throwParseError(writeInvalidLengthBoundMessage(kind, limit));
	return limit;
};
const operandKindsByBoundKind = {
	min: "value",
	max: "value",
	minLength: "length",
	maxLength: "length",
	after: "date",
	before: "date"
};
const compileComparator = (kind, exclusive) => `${isKeyOf(kind, boundKindPairsByLower) ? ">" : "<"}${exclusive ? "" : "="}`;
const dateLimitToString = (limit) => typeof limit === "string" ? limit : new Date(limit).toLocaleString();
const writeUnboundableMessage = (root) => `Bounded expression ${root} must be exactly one of number, string, Array, or Date`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/after.js
const implementation$19 = implementNode({
	kind: "after",
	collapsibleKey: "rule",
	hasAssociatedError: true,
	keys: { rule: {
		parse: parseDateLimit,
		serialize: (schema$1) => schema$1.toISOString()
	} },
	normalize: createDateSchemaNormalizer("after"),
	defaults: {
		description: (node$1) => `${node$1.collapsibleLimitString} or later`,
		actual: describeCollapsibleDate
	},
	intersections: { after: (l, r) => l.isStricterThan(r) ? l : r }
});
var AfterNode = class extends BaseRange {
	impliedBasis = $ark.intrinsic.Date.internal;
	collapsibleLimitString = describeCollapsibleDate(this.rule);
	traverseAllows = (data) => data >= this.rule;
	reduceJsonSchema(base, ctx) {
		return ctx.fallback.date({
			code: "date",
			base,
			after: this.rule
		});
	}
};
const After = {
	implementation: implementation$19,
	Node: AfterNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/before.js
const implementation$18 = implementNode({
	kind: "before",
	collapsibleKey: "rule",
	hasAssociatedError: true,
	keys: { rule: {
		parse: parseDateLimit,
		serialize: (schema$1) => schema$1.toISOString()
	} },
	normalize: createDateSchemaNormalizer("before"),
	defaults: {
		description: (node$1) => `${node$1.collapsibleLimitString} or earlier`,
		actual: describeCollapsibleDate
	},
	intersections: {
		before: (l, r) => l.isStricterThan(r) ? l : r,
		after: (before, after, ctx) => before.overlapsRange(after) ? before.overlapIsUnit(after) ? ctx.$.node("unit", { unit: before.rule }) : null : Disjoint.init("range", before, after)
	}
});
var BeforeNode = class extends BaseRange {
	collapsibleLimitString = describeCollapsibleDate(this.rule);
	traverseAllows = (data) => data <= this.rule;
	impliedBasis = $ark.intrinsic.Date.internal;
	reduceJsonSchema(base, ctx) {
		return ctx.fallback.date({
			code: "date",
			base,
			before: this.rule
		});
	}
};
const Before = {
	implementation: implementation$18,
	Node: BeforeNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/exactLength.js
const implementation$17 = implementNode({
	kind: "exactLength",
	collapsibleKey: "rule",
	keys: { rule: { parse: createLengthRuleParser("exactLength") } },
	normalize: (schema$1) => typeof schema$1 === "number" ? { rule: schema$1 } : schema$1,
	hasAssociatedError: true,
	defaults: {
		description: (node$1) => `exactly length ${node$1.rule}`,
		actual: (data) => `${data.length}`
	},
	intersections: {
		exactLength: (l, r, ctx) => Disjoint.init("unit", ctx.$.node("unit", { unit: l.rule }), ctx.$.node("unit", { unit: r.rule }), { path: ["length"] }),
		minLength: (exactLength, minLength) => exactLength.rule >= minLength.rule ? exactLength : Disjoint.init("range", exactLength, minLength),
		maxLength: (exactLength, maxLength) => exactLength.rule <= maxLength.rule ? exactLength : Disjoint.init("range", exactLength, maxLength)
	}
});
var ExactLengthNode = class extends InternalPrimitiveConstraint {
	traverseAllows = (data) => data.length === this.rule;
	compiledCondition = `data.length === ${this.rule}`;
	compiledNegation = `data.length !== ${this.rule}`;
	impliedBasis = $ark.intrinsic.lengthBoundable.internal;
	expression = `== ${this.rule}`;
	reduceJsonSchema(schema$1) {
		switch (schema$1.type) {
			case "string":
				schema$1.minLength = this.rule;
				schema$1.maxLength = this.rule;
				return schema$1;
			case "array":
				schema$1.minItems = this.rule;
				schema$1.maxItems = this.rule;
				return schema$1;
			default: return ToJsonSchema.throwInternalOperandError("exactLength", schema$1);
		}
	}
};
const ExactLength = {
	implementation: implementation$17,
	Node: ExactLengthNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/max.js
const implementation$16 = implementNode({
	kind: "max",
	collapsibleKey: "rule",
	hasAssociatedError: true,
	keys: {
		rule: {},
		exclusive: parseExclusiveKey
	},
	normalize: (schema$1) => typeof schema$1 === "number" ? { rule: schema$1 } : schema$1,
	defaults: { description: (node$1) => {
		if (node$1.rule === 0) return node$1.exclusive ? "negative" : "non-positive";
		return `${node$1.exclusive ? "less than" : "at most"} ${node$1.rule}`;
	} },
	intersections: {
		max: (l, r) => l.isStricterThan(r) ? l : r,
		min: (max, min, ctx) => max.overlapsRange(min) ? max.overlapIsUnit(min) ? ctx.$.node("unit", { unit: max.rule }) : null : Disjoint.init("range", max, min)
	},
	obviatesBasisDescription: true
});
var MaxNode = class extends BaseRange {
	impliedBasis = $ark.intrinsic.number.internal;
	traverseAllows = this.exclusive ? (data) => data < this.rule : (data) => data <= this.rule;
	reduceJsonSchema(schema$1) {
		if (this.exclusive) schema$1.exclusiveMaximum = this.rule;
		else schema$1.maximum = this.rule;
		return schema$1;
	}
};
const Max = {
	implementation: implementation$16,
	Node: MaxNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/maxLength.js
const implementation$15 = implementNode({
	kind: "maxLength",
	collapsibleKey: "rule",
	hasAssociatedError: true,
	keys: { rule: { parse: createLengthRuleParser("maxLength") } },
	reduce: (inner, $) => inner.rule === 0 ? $.node("exactLength", inner) : void 0,
	normalize: createLengthSchemaNormalizer("maxLength"),
	defaults: {
		description: (node$1) => `at most length ${node$1.rule}`,
		actual: (data) => `${data.length}`
	},
	intersections: {
		maxLength: (l, r) => l.isStricterThan(r) ? l : r,
		minLength: (max, min, ctx) => max.overlapsRange(min) ? max.overlapIsUnit(min) ? ctx.$.node("exactLength", { rule: max.rule }) : null : Disjoint.init("range", max, min)
	}
});
var MaxLengthNode = class extends BaseRange {
	impliedBasis = $ark.intrinsic.lengthBoundable.internal;
	traverseAllows = (data) => data.length <= this.rule;
	reduceJsonSchema(schema$1) {
		switch (schema$1.type) {
			case "string":
				schema$1.maxLength = this.rule;
				return schema$1;
			case "array":
				schema$1.maxItems = this.rule;
				return schema$1;
			default: return ToJsonSchema.throwInternalOperandError("maxLength", schema$1);
		}
	}
};
const MaxLength = {
	implementation: implementation$15,
	Node: MaxLengthNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/min.js
const implementation$14 = implementNode({
	kind: "min",
	collapsibleKey: "rule",
	hasAssociatedError: true,
	keys: {
		rule: {},
		exclusive: parseExclusiveKey
	},
	normalize: (schema$1) => typeof schema$1 === "number" ? { rule: schema$1 } : schema$1,
	defaults: { description: (node$1) => {
		if (node$1.rule === 0) return node$1.exclusive ? "positive" : "non-negative";
		return `${node$1.exclusive ? "more than" : "at least"} ${node$1.rule}`;
	} },
	intersections: { min: (l, r) => l.isStricterThan(r) ? l : r },
	obviatesBasisDescription: true
});
var MinNode = class extends BaseRange {
	impliedBasis = $ark.intrinsic.number.internal;
	traverseAllows = this.exclusive ? (data) => data > this.rule : (data) => data >= this.rule;
	reduceJsonSchema(schema$1) {
		if (this.exclusive) schema$1.exclusiveMinimum = this.rule;
		else schema$1.minimum = this.rule;
		return schema$1;
	}
};
const Min = {
	implementation: implementation$14,
	Node: MinNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/minLength.js
const implementation$13 = implementNode({
	kind: "minLength",
	collapsibleKey: "rule",
	hasAssociatedError: true,
	keys: { rule: { parse: createLengthRuleParser("minLength") } },
	reduce: (inner) => inner.rule === 0 ? $ark.intrinsic.unknown : void 0,
	normalize: createLengthSchemaNormalizer("minLength"),
	defaults: {
		description: (node$1) => node$1.rule === 1 ? "non-empty" : `at least length ${node$1.rule}`,
		actual: (data) => data.length === 0 ? "" : `${data.length}`
	},
	intersections: { minLength: (l, r) => l.isStricterThan(r) ? l : r }
});
var MinLengthNode = class extends BaseRange {
	impliedBasis = $ark.intrinsic.lengthBoundable.internal;
	traverseAllows = (data) => data.length >= this.rule;
	reduceJsonSchema(schema$1) {
		switch (schema$1.type) {
			case "string":
				schema$1.minLength = this.rule;
				return schema$1;
			case "array":
				schema$1.minItems = this.rule;
				return schema$1;
			default: return ToJsonSchema.throwInternalOperandError("minLength", schema$1);
		}
	}
};
const MinLength = {
	implementation: implementation$13,
	Node: MinLengthNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/kinds.js
const boundImplementationsByKind = {
	min: Min.implementation,
	max: Max.implementation,
	minLength: MinLength.implementation,
	maxLength: MaxLength.implementation,
	exactLength: ExactLength.implementation,
	after: After.implementation,
	before: Before.implementation
};
const boundClassesByKind = {
	min: Min.Node,
	max: Max.Node,
	minLength: MinLength.Node,
	maxLength: MaxLength.Node,
	exactLength: ExactLength.Node,
	after: After.Node,
	before: Before.Node
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/refinements/pattern.js
const implementation$12 = implementNode({
	kind: "pattern",
	collapsibleKey: "rule",
	keys: {
		rule: {},
		flags: {}
	},
	normalize: (schema$1) => typeof schema$1 === "string" ? { rule: schema$1 } : schema$1 instanceof RegExp ? schema$1.flags ? {
		rule: schema$1.source,
		flags: schema$1.flags
	} : { rule: schema$1.source } : schema$1,
	obviatesBasisDescription: true,
	obviatesBasisExpression: true,
	hasAssociatedError: true,
	intersectionIsOpen: true,
	defaults: { description: (node$1) => `matched by ${node$1.rule}` },
	intersections: { pattern: () => null }
});
var PatternNode = class extends InternalPrimitiveConstraint {
	instance = new RegExp(this.rule, this.flags);
	expression = `${this.instance}`;
	traverseAllows = this.instance.test.bind(this.instance);
	compiledCondition = `${this.expression}.test(data)`;
	compiledNegation = `!${this.compiledCondition}`;
	impliedBasis = $ark.intrinsic.string.internal;
	reduceJsonSchema(base, ctx) {
		if (base.pattern) return ctx.fallback.patternIntersection({
			code: "patternIntersection",
			base,
			pattern: this.rule
		});
		base.pattern = this.rule;
		return base;
	}
};
const Pattern = {
	implementation: implementation$12,
	Node: PatternNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/parse.js
const schemaKindOf = (schema$1, allowedKinds) => {
	const kind = discriminateRootKind(schema$1);
	if (allowedKinds && !allowedKinds.includes(kind)) return throwParseError(`Root of kind ${kind} should be one of ${allowedKinds}`);
	return kind;
};
const discriminateRootKind = (schema$1) => {
	if (hasArkKind(schema$1, "root")) return schema$1.kind;
	if (typeof schema$1 === "string") return schema$1[0] === "$" ? "alias" : schema$1 in domainDescriptions ? "domain" : "proto";
	if (typeof schema$1 === "function") return "proto";
	if (typeof schema$1 !== "object" || schema$1 === null) return throwParseError(writeInvalidSchemaMessage(schema$1));
	if ("morphs" in schema$1) return "morph";
	if ("branches" in schema$1 || isArray(schema$1)) return "union";
	if ("unit" in schema$1) return "unit";
	if ("reference" in schema$1) return "alias";
	const schemaKeys = Object.keys(schema$1);
	if (schemaKeys.length === 0 || schemaKeys.some((k) => k in constraintKeys)) return "intersection";
	if ("proto" in schema$1) return "proto";
	if ("domain" in schema$1) return "domain";
	return throwParseError(writeInvalidSchemaMessage(schema$1));
};
const writeInvalidSchemaMessage = (schema$1) => `${printable(schema$1)} is not a valid type schema`;
const nodeCountsByPrefix = {};
const serializeListableChild = (listableNode) => isArray(listableNode) ? listableNode.map((node$1) => node$1.collapsibleJson) : listableNode.collapsibleJson;
const nodesByRegisteredId = {};
$ark.nodesByRegisteredId = nodesByRegisteredId;
const registerNodeId = (prefix) => {
	nodeCountsByPrefix[prefix] ??= 0;
	return `${prefix}${++nodeCountsByPrefix[prefix]}`;
};
const parseNode = (ctx) => {
	const impl = nodeImplementationsByKind[ctx.kind];
	const configuredSchema = impl.applyConfig?.(ctx.def, ctx.$.resolvedConfig) ?? ctx.def;
	const inner = {};
	const { meta: metaSchema, ...innerSchema } = configuredSchema;
	const meta = metaSchema === void 0 ? {} : typeof metaSchema === "string" ? { description: metaSchema } : metaSchema;
	const innerSchemaEntries = entriesOf(innerSchema).sort(([lKey], [rKey]) => isNodeKind(lKey) ? isNodeKind(rKey) ? precedenceOfKind(lKey) - precedenceOfKind(rKey) : 1 : isNodeKind(rKey) ? -1 : lKey < rKey ? -1 : 1).filter(([k, v]) => {
		if (k.startsWith("meta.")) {
			const metaKey = k.slice(5);
			meta[metaKey] = v;
			return false;
		}
		return true;
	});
	for (const entry of innerSchemaEntries) {
		const k = entry[0];
		const keyImpl = impl.keys[k];
		if (!keyImpl) return throwParseError(`Key ${k} is not valid on ${ctx.kind} schema`);
		const v = keyImpl.parse ? keyImpl.parse(entry[1], ctx) : entry[1];
		if (v !== unset && (v !== void 0 || keyImpl.preserveUndefined)) inner[k] = v;
	}
	if (impl.reduce && !ctx.prereduced) {
		const reduced = impl.reduce(inner, ctx.$);
		if (reduced) {
			if (reduced instanceof Disjoint) return reduced.throw();
			return withMeta(reduced, meta);
		}
	}
	return createNode({
		id: ctx.id,
		kind: ctx.kind,
		inner,
		meta,
		$: ctx.$
	});
};
const createNode = ({ id, kind, inner, meta, $, ignoreCache }) => {
	const impl = nodeImplementationsByKind[kind];
	const innerEntries = entriesOf(inner);
	const children = [];
	let innerJson = {};
	for (const [k, v] of innerEntries) {
		const keyImpl = impl.keys[k];
		innerJson[k] = (keyImpl.serialize ?? (keyImpl.child ? serializeListableChild : defaultValueSerializer))(v);
		if (keyImpl.child === true) {
			const listableNode = v;
			if (isArray(listableNode)) children.push(...listableNode);
			else children.push(listableNode);
		} else if (typeof keyImpl.child === "function") children.push(...keyImpl.child(v));
	}
	if (impl.finalizeInnerJson) innerJson = impl.finalizeInnerJson(innerJson);
	let json$2 = { ...innerJson };
	let metaJson = {};
	if (!isEmptyObject(meta)) {
		metaJson = flatMorph(meta, (k, v) => [k, k === "examples" ? v : defaultValueSerializer(v)]);
		json$2.meta = possiblyCollapse(metaJson, "description", true);
	}
	innerJson = possiblyCollapse(innerJson, impl.collapsibleKey, false);
	const innerHash = JSON.stringify({
		kind,
		...innerJson
	});
	json$2 = possiblyCollapse(json$2, impl.collapsibleKey, false);
	const collapsibleJson = possiblyCollapse(json$2, impl.collapsibleKey, true);
	const hash = JSON.stringify({
		kind,
		...json$2
	});
	if ($.nodesByHash[hash] && !ignoreCache) return $.nodesByHash[hash];
	const attachments = {
		id,
		kind,
		impl,
		inner,
		innerEntries,
		innerJson,
		innerHash,
		meta,
		metaJson,
		json: json$2,
		hash,
		collapsibleJson,
		children
	};
	if (kind !== "intersection") {
		for (const k in inner) if (k !== "in" && k !== "out") attachments[k] = inner[k];
	}
	const node$1 = new nodeClassesByKind[kind](attachments, $);
	return $.nodesByHash[hash] = node$1;
};
const withId = (node$1, id) => {
	if (node$1.id === id) return node$1;
	if (isNode(nodesByRegisteredId[id])) throwInternalError(`Unexpected attempt to overwrite node id ${id}`);
	return createNode({
		id,
		kind: node$1.kind,
		inner: node$1.inner,
		meta: node$1.meta,
		$: node$1.$,
		ignoreCache: true
	});
};
const withMeta = (node$1, meta, id) => {
	if (id && isNode(nodesByRegisteredId[id])) throwInternalError(`Unexpected attempt to overwrite node id ${id}`);
	return createNode({
		id: id ?? registerNodeId(meta.alias ?? node$1.kind),
		kind: node$1.kind,
		inner: node$1.inner,
		meta,
		$: node$1.$
	});
};
const possiblyCollapse = (json$2, toKey, allowPrimitive) => {
	const collapsibleKeys = Object.keys(json$2);
	if (collapsibleKeys.length === 1 && collapsibleKeys[0] === toKey) {
		const collapsed = json$2[toKey];
		if (allowPrimitive) return collapsed;
		if (hasDomain(collapsed, "object") && (Object.keys(collapsed).length === 1 || Array.isArray(collapsed))) return collapsed;
	}
	return json$2;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/structure/prop.js
const intersectProps = (l, r, ctx) => {
	if (l.key !== r.key) return null;
	const key = l.key;
	let value$1 = intersectOrPipeNodes(l.value, r.value, ctx);
	const kind = l.required || r.required ? "required" : "optional";
	if (value$1 instanceof Disjoint) if (kind === "optional") value$1 = $ark.intrinsic.never.internal;
	else return value$1.withPrefixKey(l.key, l.required && r.required ? "required" : "optional");
	if (kind === "required") return ctx.$.node("required", {
		key,
		value: value$1
	});
	const defaultIntersection = l.hasDefault() ? r.hasDefault() ? l.default === r.default ? l.default : throwParseError(writeDefaultIntersectionMessage(l.default, r.default)) : l.default : r.hasDefault() ? r.default : unset;
	return ctx.$.node("optional", {
		key,
		value: value$1,
		default: defaultIntersection
	});
};
var BaseProp = class extends BaseConstraint {
	required = this.kind === "required";
	optional = this.kind === "optional";
	impliedBasis = $ark.intrinsic.object.internal;
	serializedKey = compileSerializedValue(this.key);
	compiledKey = typeof this.key === "string" ? this.key : this.serializedKey;
	flatRefs = append(this.value.flatRefs.map((ref) => flatRef([this.key, ...ref.path], ref.node)), flatRef([this.key], this.value));
	_transform(mapper, ctx) {
		ctx.path.push(this.key);
		const result = super._transform(mapper, ctx);
		ctx.path.pop();
		return result;
	}
	hasDefault() {
		return "default" in this.inner;
	}
	traverseAllows = (data, ctx) => {
		if (this.key in data) return traverseKey(this.key, () => this.value.traverseAllows(data[this.key], ctx), ctx);
		return this.optional;
	};
	traverseApply = (data, ctx) => {
		if (this.key in data) traverseKey(this.key, () => this.value.traverseApply(data[this.key], ctx), ctx);
		else if (this.hasKind("required")) ctx.errorFromNodeContext(this.errorContext);
	};
	compile(js) {
		js.if(`${this.serializedKey} in data`, () => js.traverseKey(this.serializedKey, `data${js.prop(this.key)}`, this.value));
		if (this.hasKind("required")) js.else(() => js.traversalKind === "Apply" ? js.line(`ctx.errorFromNodeContext(${this.compiledErrorContext})`) : js.return(false));
		if (js.traversalKind === "Allows") js.return(true);
	}
};
const writeDefaultIntersectionMessage = (lValue, rValue) => `Invalid intersection of default values ${printable(lValue)} & ${printable(rValue)}`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/structure/optional.js
const implementation$11 = implementNode({
	kind: "optional",
	hasAssociatedError: false,
	intersectionIsOpen: true,
	keys: {
		key: {},
		value: {
			child: true,
			parse: (schema$1, ctx) => ctx.$.parseSchema(schema$1)
		},
		default: { preserveUndefined: true }
	},
	normalize: (schema$1) => schema$1,
	reduce: (inner, $) => {
		if ($.resolvedConfig.exactOptionalPropertyTypes === false) {
			if (!inner.value.allows(void 0)) return $.node("optional", {
				...inner,
				value: inner.value.or(intrinsic.undefined)
			}, { prereduced: true });
		}
	},
	defaults: { description: (node$1) => `${node$1.compiledKey}?: ${node$1.value.description}` },
	intersections: { optional: intersectProps }
});
var OptionalNode = class extends BaseProp {
	constructor(...args) {
		super(...args);
		if ("default" in this.inner) assertDefaultValueAssignability(this.value, this.inner.default, this.key);
	}
	get rawIn() {
		const baseIn = super.rawIn;
		if (!this.hasDefault()) return baseIn;
		return this.$.node("optional", omit(baseIn.inner, { default: true }), { prereduced: true });
	}
	get outProp() {
		if (!this.hasDefault()) return this;
		const { default: defaultValue, ...requiredInner } = this.inner;
		return this.cacheGetter("outProp", this.$.node("required", requiredInner, { prereduced: true }));
	}
	expression = this.hasDefault() ? `${this.compiledKey}: ${this.value.expression} = ${printable(this.inner.default)}` : `${this.compiledKey}?: ${this.value.expression}`;
	defaultValueMorph = getDefaultableMorph(this);
	defaultValueMorphRef = this.defaultValueMorph && registeredReference(this.defaultValueMorph);
};
const Optional = {
	implementation: implementation$11,
	Node: OptionalNode
};
const defaultableMorphCache = {};
const getDefaultableMorph = (node$1) => {
	if (!node$1.hasDefault()) return;
	const cacheKey = `{${node$1.compiledKey}: ${node$1.value.id} = ${defaultValueSerializer(node$1.default)}}`;
	return defaultableMorphCache[cacheKey] ??= computeDefaultValueMorph(node$1.key, node$1.value, node$1.default);
};
const computeDefaultValueMorph = (key, value$1, defaultInput) => {
	if (typeof defaultInput === "function") return value$1.includesTransform ? (data, ctx) => {
		traverseKey(key, () => value$1(data[key] = defaultInput(), ctx), ctx);
		return data;
	} : (data) => {
		data[key] = defaultInput();
		return data;
	};
	const precomputedMorphedDefault = value$1.includesTransform ? value$1.assert(defaultInput) : defaultInput;
	return hasDomain(precomputedMorphedDefault, "object") ? (data, ctx) => {
		traverseKey(key, () => value$1(data[key] = defaultInput, ctx), ctx);
		return data;
	} : (data) => {
		data[key] = precomputedMorphedDefault;
		return data;
	};
};
const assertDefaultValueAssignability = (node$1, value$1, key) => {
	const wrapped = isThunk(value$1);
	if (hasDomain(value$1, "object") && !wrapped) throwParseError(writeNonPrimitiveNonFunctionDefaultValueMessage(key));
	const out = node$1.in(wrapped ? value$1() : value$1);
	if (out instanceof ArkErrors) {
		if (key === null) throwParseError(`Default ${out.summary}`);
		throwParseError(`Default for ${out.transform((e) => e.transform((input) => ({
			...input,
			prefixPath: [key]
		}))).summary}`);
	}
	return value$1;
};
const writeNonPrimitiveNonFunctionDefaultValueMessage = (key) => {
	return `Non-primitive default ${key === null ? "" : typeof key === "number" ? `for value at [${key}] ` : `for ${compileSerializedValue(key)} `}must be specified as a function like () => ({my: 'object'})`;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/root.js
var BaseRoot = class extends BaseNode {
	constructor(attachments, $) {
		super(attachments, $);
		Object.defineProperty(this, arkKind, {
			value: "root",
			enumerable: false
		});
	}
	get rawIn() {
		return super.rawIn;
	}
	get rawOut() {
		return super.rawOut;
	}
	get internal() {
		return this;
	}
	get "~standard"() {
		return {
			vendor: "arktype",
			version: 1,
			validate: (input) => {
				const out = this(input);
				if (out instanceof ArkErrors) return out;
				return { value: out };
			},
			toJSONSchema: (opts) => {
				if (opts.target && opts.target !== "draft-2020-12") return throwParseError(`JSONSchema target '${opts.target}' is not supported (must be "draft-2020-12")`);
				if (opts.io === "input") return this.rawIn.toJsonSchema();
				return this.rawOut.toJsonSchema();
			}
		};
	}
	as() {
		return this;
	}
	brand(name) {
		if (name === "") return throwParseError(emptyBrandNameMessage);
		return this;
	}
	readonly() {
		return this;
	}
	branches = this.hasKind("union") ? this.inner.branches : [this];
	distribute(mapBranch, reduceMapped) {
		const mappedBranches = this.branches.map(mapBranch);
		return reduceMapped?.(mappedBranches) ?? mappedBranches;
	}
	get shortDescription() {
		return this.meta.description ?? this.defaultShortDescription;
	}
	toJsonSchema(opts = {}) {
		const ctx = mergeToJsonSchemaConfigs(this.$.resolvedConfig.toJsonSchema, opts);
		ctx.useRefs ||= this.isCyclic;
		const schema$1 = typeof ctx.dialect === "string" ? { $schema: ctx.dialect } : {};
		Object.assign(schema$1, this.toJsonSchemaRecurse(ctx));
		if (ctx.useRefs) schema$1.$defs = flatMorph(this.references, (i, ref) => ref.isRoot() && !ref.alwaysExpandJsonSchema ? [ref.id, ref.toResolvedJsonSchema(ctx)] : []);
		return schema$1;
	}
	toJsonSchemaRecurse(ctx) {
		if (ctx.useRefs && !this.alwaysExpandJsonSchema) return { $ref: `#/$defs/${this.id}` };
		return this.toResolvedJsonSchema(ctx);
	}
	get alwaysExpandJsonSchema() {
		return this.isBasis() || this.kind === "alias" || this.hasKind("union") && this.isBoolean;
	}
	toResolvedJsonSchema(ctx) {
		const result = this.innerToJsonSchema(ctx);
		return Object.assign(result, this.metaJson);
	}
	intersect(r) {
		const rNode = this.$.parseDefinition(r);
		const result = this.rawIntersect(rNode);
		if (result instanceof Disjoint) return result;
		return this.$.finalize(result);
	}
	rawIntersect(r) {
		return intersectNodesRoot(this, r, this.$);
	}
	toNeverIfDisjoint() {
		return this;
	}
	and(r) {
		const result = this.intersect(r);
		return result instanceof Disjoint ? result.throw() : result;
	}
	rawAnd(r) {
		const result = this.rawIntersect(r);
		return result instanceof Disjoint ? result.throw() : result;
	}
	or(r) {
		const rNode = this.$.parseDefinition(r);
		return this.$.finalize(this.rawOr(rNode));
	}
	rawOr(r) {
		const branches = [...this.branches, ...r.branches];
		return this.$.node("union", branches);
	}
	map(flatMapEntry) {
		return this.$.schema(this.applyStructuralOperation("map", [flatMapEntry]));
	}
	pick(...keys) {
		return this.$.schema(this.applyStructuralOperation("pick", keys));
	}
	omit(...keys) {
		return this.$.schema(this.applyStructuralOperation("omit", keys));
	}
	required() {
		return this.$.schema(this.applyStructuralOperation("required", []));
	}
	partial() {
		return this.$.schema(this.applyStructuralOperation("partial", []));
	}
	_keyof;
	keyof() {
		if (this._keyof) return this._keyof;
		const result = this.applyStructuralOperation("keyof", []).reduce((result$1, branch) => result$1.intersect(branch).toNeverIfDisjoint(), $ark.intrinsic.unknown.internal);
		if (result.branches.length === 0) throwParseError(writeUnsatisfiableExpressionError(`keyof ${this.expression}`));
		return this._keyof = this.$.finalize(result);
	}
	get props() {
		if (this.branches.length !== 1) return throwParseError(writeLiteralUnionEntriesMessage(this.expression));
		return [...this.applyStructuralOperation("props", [])[0]];
	}
	merge(r) {
		const rNode = this.$.parseDefinition(r);
		return this.$.schema(rNode.distribute((branch) => this.applyStructuralOperation("merge", [structureOf(branch) ?? throwParseError(writeNonStructuralOperandMessage("merge", branch.expression))])));
	}
	applyStructuralOperation(operation, args) {
		return this.distribute((branch) => {
			if (branch.equals($ark.intrinsic.object) && operation !== "merge") return branch;
			const structure = structureOf(branch);
			if (!structure) throwParseError(writeNonStructuralOperandMessage(operation, branch.expression));
			if (operation === "keyof") return structure.keyof();
			if (operation === "get") return structure.get(...args);
			if (operation === "props") return structure.props;
			const structuralMethodName = operation === "required" ? "require" : operation === "partial" ? "optionalize" : operation;
			return this.$.node("intersection", {
				domain: "object",
				structure: structure[structuralMethodName](...args)
			});
		});
	}
	get(...path) {
		if (path[0] === void 0) return this;
		return this.$.schema(this.applyStructuralOperation("get", path));
	}
	extract(r) {
		const rNode = this.$.parseDefinition(r);
		return this.$.schema(this.branches.filter((branch) => branch.extends(rNode)));
	}
	exclude(r) {
		const rNode = this.$.parseDefinition(r);
		return this.$.schema(this.branches.filter((branch) => !branch.extends(rNode)));
	}
	array() {
		return this.$.schema(this.isUnknown() ? { proto: Array } : {
			proto: Array,
			sequence: this
		}, { prereduced: true });
	}
	overlaps(r) {
		return !(this.intersect(r) instanceof Disjoint);
	}
	extends(r) {
		if (this.isNever()) return true;
		const intersection = this.intersect(r);
		return !(intersection instanceof Disjoint) && this.equals(intersection);
	}
	ifExtends(r) {
		return this.extends(r) ? this : void 0;
	}
	subsumes(r) {
		return this.$.parseDefinition(r).extends(this);
	}
	configure(meta, selector = "shallow") {
		return this.configureReferences(meta, selector);
	}
	describe(description, selector = "shallow") {
		return this.configure({ description }, selector);
	}
	optional() {
		return [this, "?"];
	}
	default(thunkableValue) {
		assertDefaultValueAssignability(this, thunkableValue, null);
		return [
			this,
			"=",
			thunkableValue
		];
	}
	from(input) {
		return this.assert(input);
	}
	_pipe(...morphs) {
		const result = morphs.reduce((acc, morph) => acc.rawPipeOnce(morph), this);
		return this.$.finalize(result);
	}
	tryPipe(...morphs) {
		const result = morphs.reduce((acc, morph) => acc.rawPipeOnce(hasArkKind(morph, "root") ? morph : ((In, ctx) => {
			try {
				return morph(In, ctx);
			} catch (e) {
				return ctx.error({
					code: "predicate",
					predicate: morph,
					actual: `aborted due to error:\n    ${e}\n`
				});
			}
		})), this);
		return this.$.finalize(result);
	}
	pipe = Object.assign(this._pipe.bind(this), { try: this.tryPipe.bind(this) });
	to(def) {
		return this.$.finalize(this.toNode(this.$.parseDefinition(def)));
	}
	toNode(root) {
		const result = pipeNodesRoot(this, root, this.$);
		if (result instanceof Disjoint) return result.throw();
		return result;
	}
	rawPipeOnce(morph) {
		if (hasArkKind(morph, "root")) return this.toNode(morph);
		return this.distribute((branch) => branch.hasKind("morph") ? this.$.node("morph", {
			in: branch.inner.in,
			morphs: [...branch.morphs, morph]
		}) : this.$.node("morph", {
			in: branch,
			morphs: [morph]
		}), this.$.parseSchema);
	}
	narrow(predicate) {
		return this.constrainOut("predicate", predicate);
	}
	constrain(kind, schema$1) {
		return this._constrain("root", kind, schema$1);
	}
	constrainIn(kind, schema$1) {
		return this._constrain("in", kind, schema$1);
	}
	constrainOut(kind, schema$1) {
		return this._constrain("out", kind, schema$1);
	}
	_constrain(io, kind, schema$1) {
		const constraint = this.$.node(kind, schema$1);
		if (constraint.isRoot()) return constraint.isUnknown() ? this : throwInternalError(`Unexpected constraint node ${constraint}`);
		const operand = io === "root" ? this : io === "in" ? this.rawIn : this.rawOut;
		if (operand.hasKind("morph") || constraint.impliedBasis && !operand.extends(constraint.impliedBasis)) return throwInvalidOperandError(kind, constraint.impliedBasis, this);
		const partialIntersection = this.$.node("intersection", { [constraint.kind]: constraint });
		const result = io === "out" ? pipeNodesRoot(this, partialIntersection, this.$) : intersectNodesRoot(this, partialIntersection, this.$);
		if (result instanceof Disjoint) result.throw();
		return this.$.finalize(result);
	}
	onUndeclaredKey(cfg) {
		const rule = typeof cfg === "string" ? cfg : cfg.rule;
		const deep = typeof cfg === "string" ? false : cfg.deep;
		return this.$.finalize(this.transform((kind, inner) => kind === "structure" ? rule === "ignore" ? omit(inner, { undeclared: 1 }) : {
			...inner,
			undeclared: rule
		} : inner, deep ? void 0 : { shouldTransform: (node$1) => !includes(structuralKinds, node$1.kind) }));
	}
	hasEqualMorphs(r) {
		if (!this.includesTransform && !r.includesTransform) return true;
		if (!arrayEquals(this.shallowMorphs, r.shallowMorphs)) return false;
		if (!arrayEquals(this.flatMorphs, r.flatMorphs, { isEqual: (l, r$1) => l.propString === r$1.propString && (l.node.hasKind("morph") && r$1.node.hasKind("morph") ? l.node.hasEqualMorphs(r$1.node) : l.node.hasKind("intersection") && r$1.node.hasKind("intersection") ? l.node.structure?.structuralMorphRef === r$1.node.structure?.structuralMorphRef : false) })) return false;
		return true;
	}
	onDeepUndeclaredKey(behavior) {
		return this.onUndeclaredKey({
			rule: behavior,
			deep: true
		});
	}
	filter(predicate) {
		return this.constrainIn("predicate", predicate);
	}
	divisibleBy(schema$1) {
		return this.constrain("divisor", schema$1);
	}
	matching(schema$1) {
		return this.constrain("pattern", schema$1);
	}
	atLeast(schema$1) {
		return this.constrain("min", schema$1);
	}
	atMost(schema$1) {
		return this.constrain("max", schema$1);
	}
	moreThan(schema$1) {
		return this.constrain("min", exclusivizeRangeSchema(schema$1));
	}
	lessThan(schema$1) {
		return this.constrain("max", exclusivizeRangeSchema(schema$1));
	}
	atLeastLength(schema$1) {
		return this.constrain("minLength", schema$1);
	}
	atMostLength(schema$1) {
		return this.constrain("maxLength", schema$1);
	}
	moreThanLength(schema$1) {
		return this.constrain("minLength", exclusivizeRangeSchema(schema$1));
	}
	lessThanLength(schema$1) {
		return this.constrain("maxLength", exclusivizeRangeSchema(schema$1));
	}
	exactlyLength(schema$1) {
		return this.constrain("exactLength", schema$1);
	}
	atOrAfter(schema$1) {
		return this.constrain("after", schema$1);
	}
	atOrBefore(schema$1) {
		return this.constrain("before", schema$1);
	}
	laterThan(schema$1) {
		return this.constrain("after", exclusivizeRangeSchema(schema$1));
	}
	earlierThan(schema$1) {
		return this.constrain("before", exclusivizeRangeSchema(schema$1));
	}
};
const emptyBrandNameMessage = `Expected a non-empty brand name after #`;
const exclusivizeRangeSchema = (schema$1) => typeof schema$1 === "object" && !(schema$1 instanceof Date) ? {
	...schema$1,
	exclusive: true
} : {
	rule: schema$1,
	exclusive: true
};
const typeOrTermExtends = (t, base) => hasArkKind(base, "root") ? hasArkKind(t, "root") ? t.extends(base) : base.allows(t) : hasArkKind(t, "root") ? t.hasUnit(base) : base === t;
const structureOf = (branch) => {
	if (branch.hasKind("morph")) return null;
	if (branch.hasKind("intersection")) return branch.inner.structure ?? (branch.basis?.domain === "object" ? branch.$.bindReference($ark.intrinsic.emptyStructure) : null);
	if (branch.isBasis() && branch.domain === "object") return branch.$.bindReference($ark.intrinsic.emptyStructure);
	return null;
};
const writeLiteralUnionEntriesMessage = (expression) => `Props cannot be extracted from a union. Use .distribute to extract props from each branch instead. Received:
${expression}`;
const writeNonStructuralOperandMessage = (operation, operand) => `${operation} operand must be an object (was ${operand})`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/utils.js
const defineRightwardIntersections = (kind, implementation$22) => flatMorph(schemaKindsRightOf(kind), (i, kind$1) => [kind$1, implementation$22]);

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/alias.js
const normalizeAliasSchema = (schema$1) => typeof schema$1 === "string" ? { reference: schema$1 } : schema$1;
const neverIfDisjoint = (result) => result instanceof Disjoint ? $ark.intrinsic.never.internal : result;
const implementation$10 = implementNode({
	kind: "alias",
	hasAssociatedError: false,
	collapsibleKey: "reference",
	keys: {
		reference: { serialize: (s) => s.startsWith("$") ? s : `$ark.${s}` },
		resolve: {}
	},
	normalize: normalizeAliasSchema,
	defaults: { description: (node$1) => node$1.reference },
	intersections: {
		alias: (l, r, ctx) => ctx.$.lazilyResolve(() => neverIfDisjoint(intersectOrPipeNodes(l.resolution, r.resolution, ctx)), `${l.reference}${ctx.pipe ? "=>" : "&"}${r.reference}`),
		...defineRightwardIntersections("alias", (l, r, ctx) => {
			if (r.isUnknown()) return l;
			if (r.isNever()) return r;
			if (r.isBasis() && !r.overlaps($ark.intrinsic.object)) return Disjoint.init("assignability", $ark.intrinsic.object, r);
			return ctx.$.lazilyResolve(() => neverIfDisjoint(intersectOrPipeNodes(l.resolution, r, ctx)), `${l.reference}${ctx.pipe ? "=>" : "&"}${r.id}`);
		})
	}
});
var AliasNode = class extends BaseRoot {
	expression = this.reference;
	structure = void 0;
	get resolution() {
		const result = this._resolve();
		return nodesByRegisteredId[this.id] = result;
	}
	_resolve() {
		if (this.resolve) return this.resolve();
		if (this.reference[0] === "$") return this.$.resolveRoot(this.reference.slice(1));
		let resolution = nodesByRegisteredId[this.reference];
		const seen = [];
		while (hasArkKind(resolution, "context")) {
			if (seen.includes(resolution.id)) return throwParseError(writeShallowCycleErrorMessage(resolution.id, seen));
			seen.push(resolution.id);
			resolution = nodesByRegisteredId[resolution.id];
		}
		if (!hasArkKind(resolution, "root")) return throwInternalError(`Unexpected resolution for reference ${this.reference}
Seen: [${seen.join("->")}] 
Resolution: ${printable(resolution)}`);
		return resolution;
	}
	get resolutionId() {
		if (this.reference.includes("&") || this.reference.includes("=>")) return this.resolution.id;
		if (this.reference[0] !== "$") return this.reference;
		const alias = this.reference.slice(1);
		const resolution = this.$.resolutions[alias];
		if (typeof resolution === "string") return resolution;
		if (hasArkKind(resolution, "root")) return resolution.id;
		return throwInternalError(`Unexpected resolution for reference ${this.reference}: ${printable(resolution)}`);
	}
	get defaultShortDescription() {
		return domainDescriptions.object;
	}
	innerToJsonSchema(ctx) {
		return this.resolution.toJsonSchemaRecurse(ctx);
	}
	traverseAllows = (data, ctx) => {
		const seen = ctx.seen[this.reference];
		if (seen?.includes(data)) return true;
		ctx.seen[this.reference] = append(seen, data);
		return this.resolution.traverseAllows(data, ctx);
	};
	traverseApply = (data, ctx) => {
		const seen = ctx.seen[this.reference];
		if (seen?.includes(data)) return;
		ctx.seen[this.reference] = append(seen, data);
		this.resolution.traverseApply(data, ctx);
	};
	compile(js) {
		const id = this.resolutionId;
		js.if(`ctx.seen.${id} && ctx.seen.${id}.includes(data)`, () => js.return(true));
		js.if(`!ctx.seen.${id}`, () => js.line(`ctx.seen.${id} = []`));
		js.line(`ctx.seen.${id}.push(data)`);
		js.return(js.invoke(id));
	}
};
const writeShallowCycleErrorMessage = (name, seen) => `Alias '${name}' has a shallow resolution cycle: ${[...seen, name].join("->")}`;
const Alias = {
	implementation: implementation$10,
	Node: AliasNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/basis.js
var InternalBasis = class extends BaseRoot {
	traverseApply = (data, ctx) => {
		if (!this.traverseAllows(data, ctx)) ctx.errorFromNodeContext(this.errorContext);
	};
	get errorContext() {
		return {
			code: this.kind,
			description: this.description,
			meta: this.meta,
			...this.inner
		};
	}
	get compiledErrorContext() {
		return compileObjectLiteral(this.errorContext);
	}
	compile(js) {
		if (js.traversalKind === "Allows") js.return(this.compiledCondition);
		else js.if(this.compiledNegation, () => js.line(`ctx.errorFromNodeContext(${this.compiledErrorContext})`));
	}
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/domain.js
const implementation$9 = implementNode({
	kind: "domain",
	hasAssociatedError: true,
	collapsibleKey: "domain",
	keys: {
		domain: {},
		numberAllowsNaN: {}
	},
	normalize: (schema$1) => typeof schema$1 === "string" ? { domain: schema$1 } : hasKey(schema$1, "numberAllowsNaN") && schema$1.domain !== "number" ? throwParseError(Domain.writeBadAllowNanMessage(schema$1.domain)) : schema$1,
	applyConfig: (schema$1, config) => schema$1.numberAllowsNaN === void 0 && schema$1.domain === "number" && config.numberAllowsNaN ? {
		...schema$1,
		numberAllowsNaN: true
	} : schema$1,
	defaults: {
		description: (node$1) => domainDescriptions[node$1.domain],
		actual: (data) => Number.isNaN(data) ? "NaN" : domainDescriptions[domainOf(data)]
	},
	intersections: { domain: (l, r) => l.domain === "number" && r.domain === "number" ? l.numberAllowsNaN ? r : l : Disjoint.init("domain", l, r) }
});
var DomainNode = class extends InternalBasis {
	requiresNaNCheck = this.domain === "number" && !this.numberAllowsNaN;
	traverseAllows = this.requiresNaNCheck ? (data) => typeof data === "number" && !Number.isNaN(data) : (data) => domainOf(data) === this.domain;
	compiledCondition = this.domain === "object" ? `((typeof data === "object" && data !== null) || typeof data === "function")` : `typeof data === "${this.domain}"${this.requiresNaNCheck ? " && !Number.isNaN(data)" : ""}`;
	compiledNegation = this.domain === "object" ? `((typeof data !== "object" || data === null) && typeof data !== "function")` : `typeof data !== "${this.domain}"${this.requiresNaNCheck ? " || Number.isNaN(data)" : ""}`;
	expression = this.numberAllowsNaN ? "number | NaN" : this.domain;
	get nestableExpression() {
		return this.numberAllowsNaN ? `(${this.expression})` : this.expression;
	}
	get defaultShortDescription() {
		return domainDescriptions[this.domain];
	}
	innerToJsonSchema(ctx) {
		if (this.domain === "bigint" || this.domain === "symbol") return ctx.fallback.domain({
			code: "domain",
			base: {},
			domain: this.domain
		});
		return { type: this.domain };
	}
};
const Domain = {
	implementation: implementation$9,
	Node: DomainNode,
	writeBadAllowNanMessage: (actual) => `numberAllowsNaN may only be specified with domain "number" (was ${actual})`
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/intersection.js
const implementation$8 = implementNode({
	kind: "intersection",
	hasAssociatedError: true,
	normalize: (rawSchema) => {
		if (isNode(rawSchema)) return rawSchema;
		const { structure, ...schema$1 } = rawSchema;
		const hasRootStructureKey = !!structure;
		const normalizedStructure = structure ?? {};
		const normalized = flatMorph(schema$1, (k, v) => {
			if (isKeyOf(k, structureKeys)) {
				if (hasRootStructureKey) throwParseError(`Flattened structure key ${k} cannot be specified alongside a root 'structure' key.`);
				normalizedStructure[k] = v;
				return [];
			}
			return [k, v];
		});
		if (hasArkKind(normalizedStructure, "constraint") || !isEmptyObject(normalizedStructure)) normalized.structure = normalizedStructure;
		return normalized;
	},
	finalizeInnerJson: ({ structure, ...rest }) => hasDomain(structure, "object") ? {
		...structure,
		...rest
	} : rest,
	keys: {
		domain: {
			child: true,
			parse: (schema$1, ctx) => ctx.$.node("domain", schema$1)
		},
		proto: {
			child: true,
			parse: (schema$1, ctx) => ctx.$.node("proto", schema$1)
		},
		structure: {
			child: true,
			parse: (schema$1, ctx) => ctx.$.node("structure", schema$1),
			serialize: (node$1) => {
				if (!node$1.sequence?.minLength) return node$1.collapsibleJson;
				const { sequence, ...structureJson } = node$1.collapsibleJson;
				const { minVariadicLength, ...sequenceJson } = sequence;
				const collapsibleSequenceJson = sequenceJson.variadic && Object.keys(sequenceJson).length === 1 ? sequenceJson.variadic : sequenceJson;
				return {
					...structureJson,
					sequence: collapsibleSequenceJson
				};
			}
		},
		divisor: {
			child: true,
			parse: constraintKeyParser("divisor")
		},
		max: {
			child: true,
			parse: constraintKeyParser("max")
		},
		min: {
			child: true,
			parse: constraintKeyParser("min")
		},
		maxLength: {
			child: true,
			parse: constraintKeyParser("maxLength")
		},
		minLength: {
			child: true,
			parse: constraintKeyParser("minLength")
		},
		exactLength: {
			child: true,
			parse: constraintKeyParser("exactLength")
		},
		before: {
			child: true,
			parse: constraintKeyParser("before")
		},
		after: {
			child: true,
			parse: constraintKeyParser("after")
		},
		pattern: {
			child: true,
			parse: constraintKeyParser("pattern")
		},
		predicate: {
			child: true,
			parse: constraintKeyParser("predicate")
		}
	},
	reduce: (inner, $) => intersectIntersections({}, inner, {
		$,
		invert: false,
		pipe: false
	}),
	defaults: {
		description: (node$1) => {
			if (node$1.children.length === 0) return "unknown";
			if (node$1.structure) return node$1.structure.description;
			const childDescriptions = [];
			if (node$1.basis && !node$1.prestructurals.some((r) => r.impl.obviatesBasisDescription)) childDescriptions.push(node$1.basis.description);
			if (node$1.prestructurals.length) {
				const sortedRefinementDescriptions = node$1.prestructurals.toSorted((l, r) => l.kind === "min" && r.kind === "max" ? -1 : 0).map((r) => r.description);
				childDescriptions.push(...sortedRefinementDescriptions);
			}
			if (node$1.inner.predicate) childDescriptions.push(...node$1.inner.predicate.map((p) => p.description));
			return childDescriptions.join(" and ");
		},
		expected: (source) => `  ◦ ${source.errors.map((e) => e.expected).join("\n  ◦ ")}`,
		problem: (ctx) => `(${ctx.actual}) must be...\n${ctx.expected}`
	},
	intersections: {
		intersection: (l, r, ctx) => intersectIntersections(l.inner, r.inner, ctx),
		...defineRightwardIntersections("intersection", (l, r, ctx) => {
			if (l.children.length === 0) return r;
			const { domain, proto, ...lInnerConstraints } = l.inner;
			const lBasis = proto ?? domain;
			const basis = lBasis ? intersectOrPipeNodes(lBasis, r, ctx) : r;
			return basis instanceof Disjoint ? basis : l?.basis?.equals(basis) ? l : l.$.node("intersection", {
				...lInnerConstraints,
				[basis.kind]: basis
			}, { prereduced: true });
		})
	}
});
var IntersectionNode = class extends BaseRoot {
	basis = this.inner.domain ?? this.inner.proto ?? null;
	prestructurals = [];
	refinements = this.children.filter((node$1) => {
		if (!node$1.isRefinement()) return false;
		if (includes(prestructuralKinds, node$1.kind)) this.prestructurals.push(node$1);
		return true;
	});
	structure = this.inner.structure;
	expression = writeIntersectionExpression(this);
	get shallowMorphs() {
		return this.inner.structure?.structuralMorph ? [this.inner.structure.structuralMorph] : [];
	}
	get defaultShortDescription() {
		return this.basis?.defaultShortDescription ?? "present";
	}
	innerToJsonSchema(ctx) {
		return this.children.reduce((schema$1, child) => child.isBasis() ? child.toJsonSchemaRecurse(ctx) : child.reduceJsonSchema(schema$1, ctx), {});
	}
	traverseAllows = (data, ctx) => this.children.every((child) => child.traverseAllows(data, ctx));
	traverseApply = (data, ctx) => {
		const errorCount = ctx.currentErrorCount;
		if (this.basis) {
			this.basis.traverseApply(data, ctx);
			if (ctx.currentErrorCount > errorCount) return;
		}
		if (this.prestructurals.length) {
			for (let i = 0; i < this.prestructurals.length - 1; i++) {
				this.prestructurals[i].traverseApply(data, ctx);
				if (ctx.failFast && ctx.currentErrorCount > errorCount) return;
			}
			this.prestructurals.at(-1).traverseApply(data, ctx);
			if (ctx.currentErrorCount > errorCount) return;
		}
		if (this.structure) {
			this.structure.traverseApply(data, ctx);
			if (ctx.currentErrorCount > errorCount) return;
		}
		if (this.inner.predicate) {
			for (let i = 0; i < this.inner.predicate.length - 1; i++) {
				this.inner.predicate[i].traverseApply(data, ctx);
				if (ctx.failFast && ctx.currentErrorCount > errorCount) return;
			}
			this.inner.predicate.at(-1).traverseApply(data, ctx);
		}
	};
	compile(js) {
		if (js.traversalKind === "Allows") {
			for (const child of this.children) js.check(child);
			js.return(true);
			return;
		}
		js.initializeErrorCount();
		if (this.basis) {
			js.check(this.basis);
			if (this.children.length > 1) js.returnIfFail();
		}
		if (this.prestructurals.length) {
			for (let i = 0; i < this.prestructurals.length - 1; i++) {
				js.check(this.prestructurals[i]);
				js.returnIfFailFast();
			}
			js.check(this.prestructurals.at(-1));
			if (this.structure || this.inner.predicate) js.returnIfFail();
		}
		if (this.structure) {
			js.check(this.structure);
			if (this.inner.predicate) js.returnIfFail();
		}
		if (this.inner.predicate) {
			for (let i = 0; i < this.inner.predicate.length - 1; i++) {
				js.check(this.inner.predicate[i]);
				js.returnIfFail();
			}
			js.check(this.inner.predicate.at(-1));
		}
	}
};
const Intersection = {
	implementation: implementation$8,
	Node: IntersectionNode
};
const writeIntersectionExpression = (node$1) => {
	if (node$1.structure?.expression) return node$1.structure.expression;
	const basisExpression = node$1.basis && !node$1.prestructurals.some((n) => n.impl.obviatesBasisExpression) ? node$1.basis.nestableExpression : "";
	const refinementsExpression = node$1.prestructurals.map((n) => n.expression).join(" & ");
	const fullExpression = `${basisExpression}${basisExpression ? " " : ""}${refinementsExpression}`;
	if (fullExpression === "Array == 0") return "[]";
	return fullExpression || "unknown";
};
const intersectIntersections = (l, r, ctx) => {
	const baseInner = {};
	const lBasis = l.proto ?? l.domain;
	const rBasis = r.proto ?? r.domain;
	const basisResult = lBasis ? rBasis ? intersectOrPipeNodes(lBasis, rBasis, ctx) : lBasis : rBasis;
	if (basisResult instanceof Disjoint) return basisResult;
	if (basisResult) baseInner[basisResult.kind] = basisResult;
	return intersectConstraints({
		kind: "intersection",
		baseInner,
		l: flattenConstraints(l),
		r: flattenConstraints(r),
		roots: [],
		ctx
	});
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/morph.js
const implementation$7 = implementNode({
	kind: "morph",
	hasAssociatedError: false,
	keys: {
		in: {
			child: true,
			parse: (schema$1, ctx) => ctx.$.parseSchema(schema$1)
		},
		morphs: {
			parse: liftArray,
			serialize: (morphs) => morphs.map((m) => hasArkKind(m, "root") ? m.json : registeredReference(m))
		},
		declaredIn: {
			child: false,
			serialize: (node$1) => node$1.json
		},
		declaredOut: {
			child: false,
			serialize: (node$1) => node$1.json
		}
	},
	normalize: (schema$1) => schema$1,
	defaults: { description: (node$1) => `a morph from ${node$1.rawIn.description} to ${node$1.rawOut?.description ?? "unknown"}` },
	intersections: {
		morph: (l, r, ctx) => {
			if (!l.hasEqualMorphs(r)) return throwParseError(writeMorphIntersectionMessage(l.expression, r.expression));
			const inTersection = intersectOrPipeNodes(l.rawIn, r.rawIn, ctx);
			if (inTersection instanceof Disjoint) return inTersection;
			const baseInner = { morphs: l.morphs };
			if (l.declaredIn || r.declaredIn) {
				const declaredIn = intersectOrPipeNodes(l.rawIn, r.rawIn, ctx);
				if (declaredIn instanceof Disjoint) return declaredIn.throw();
				else baseInner.declaredIn = declaredIn;
			}
			if (l.declaredOut || r.declaredOut) {
				const declaredOut = intersectOrPipeNodes(l.rawOut, r.rawOut, ctx);
				if (declaredOut instanceof Disjoint) return declaredOut.throw();
				else baseInner.declaredOut = declaredOut;
			}
			return inTersection.distribute((inBranch) => ctx.$.node("morph", {
				...baseInner,
				in: inBranch
			}), ctx.$.parseSchema);
		},
		...defineRightwardIntersections("morph", (l, r, ctx) => {
			const inTersection = l.inner.in ? intersectOrPipeNodes(l.inner.in, r, ctx) : r;
			return inTersection instanceof Disjoint ? inTersection : inTersection.equals(l.inner.in) ? l : ctx.$.node("morph", {
				...l.inner,
				in: inTersection
			});
		})
	}
});
var MorphNode = class extends BaseRoot {
	serializedMorphs = this.morphs.map(registeredReference);
	compiledMorphs = `[${this.serializedMorphs}]`;
	lastMorph = this.inner.morphs.at(-1);
	lastMorphIfNode = hasArkKind(this.lastMorph, "root") ? this.lastMorph : void 0;
	introspectableIn = this.inner.in;
	introspectableOut = this.lastMorphIfNode ? Object.assign(this.referencesById, this.lastMorphIfNode.referencesById) && this.lastMorphIfNode.rawOut : void 0;
	get shallowMorphs() {
		return Array.isArray(this.inner.in?.shallowMorphs) ? [...this.inner.in.shallowMorphs, ...this.morphs] : this.morphs;
	}
	get rawIn() {
		return this.declaredIn ?? this.inner.in?.rawIn ?? $ark.intrinsic.unknown.internal;
	}
	get rawOut() {
		return this.declaredOut ?? this.introspectableOut ?? $ark.intrinsic.unknown.internal;
	}
	declareIn(declaredIn) {
		return this.$.node("morph", {
			...this.inner,
			declaredIn
		});
	}
	declareOut(declaredOut) {
		return this.$.node("morph", {
			...this.inner,
			declaredOut
		});
	}
	expression = `(In: ${this.rawIn.expression}) => ${this.lastMorphIfNode ? "To" : "Out"}<${this.rawOut.expression}>`;
	get defaultShortDescription() {
		return this.rawIn.meta.description ?? this.rawIn.defaultShortDescription;
	}
	innerToJsonSchema(ctx) {
		return ctx.fallback.morph({
			code: "morph",
			base: this.rawIn.toJsonSchemaRecurse(ctx),
			out: this.introspectableOut?.toJsonSchemaRecurse(ctx) ?? null
		});
	}
	compile(js) {
		if (js.traversalKind === "Allows") {
			if (!this.introspectableIn) return;
			js.return(js.invoke(this.introspectableIn));
			return;
		}
		if (this.introspectableIn) js.line(js.invoke(this.introspectableIn));
		js.line(`ctx.queueMorphs(${this.compiledMorphs})`);
	}
	traverseAllows = (data, ctx) => !this.introspectableIn || this.introspectableIn.traverseAllows(data, ctx);
	traverseApply = (data, ctx) => {
		if (this.introspectableIn) this.introspectableIn.traverseApply(data, ctx);
		ctx.queueMorphs(this.morphs);
	};
	/** Check if the morphs of r are equal to those of this node */
	hasEqualMorphs(r) {
		return arrayEquals(this.morphs, r.morphs, { isEqual: (lMorph, rMorph) => lMorph === rMorph || hasArkKind(lMorph, "root") && hasArkKind(rMorph, "root") && lMorph.equals(rMorph) });
	}
};
const Morph = {
	implementation: implementation$7,
	Node: MorphNode
};
const writeMorphIntersectionMessage = (lDescription, rDescription) => `The intersection of distinct morphs at a single path is indeterminate:
Left: ${lDescription}
Right: ${rDescription}`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/proto.js
const implementation$6 = implementNode({
	kind: "proto",
	hasAssociatedError: true,
	collapsibleKey: "proto",
	keys: {
		proto: { serialize: (ctor) => getBuiltinNameOfConstructor(ctor) ?? defaultValueSerializer(ctor) },
		dateAllowsInvalid: {}
	},
	normalize: (schema$1) => {
		const normalized = typeof schema$1 === "string" ? { proto: builtinConstructors[schema$1] } : typeof schema$1 === "function" ? isNode(schema$1) ? schema$1 : { proto: schema$1 } : typeof schema$1.proto === "string" ? {
			...schema$1,
			proto: builtinConstructors[schema$1.proto]
		} : schema$1;
		if (typeof normalized.proto !== "function") throwParseError(Proto.writeInvalidSchemaMessage(normalized.proto));
		if (hasKey(normalized, "dateAllowsInvalid") && normalized.proto !== Date) throwParseError(Proto.writeBadInvalidDateMessage(normalized.proto));
		return normalized;
	},
	applyConfig: (schema$1, config) => {
		if (schema$1.dateAllowsInvalid === void 0 && schema$1.proto === Date && config.dateAllowsInvalid) return {
			...schema$1,
			dateAllowsInvalid: true
		};
		return schema$1;
	},
	defaults: {
		description: (node$1) => node$1.builtinName ? objectKindDescriptions[node$1.builtinName] : `an instance of ${node$1.proto.name}`,
		actual: (data) => data instanceof Date && data.toString() === "Invalid Date" ? "an invalid Date" : objectKindOrDomainOf(data)
	},
	intersections: {
		proto: (l, r) => l.proto === Date && r.proto === Date ? l.dateAllowsInvalid ? r : l : constructorExtends(l.proto, r.proto) ? l : constructorExtends(r.proto, l.proto) ? r : Disjoint.init("proto", l, r),
		domain: (proto, domain) => domain.domain === "object" ? proto : Disjoint.init("domain", $ark.intrinsic.object.internal, domain)
	}
});
var ProtoNode = class extends InternalBasis {
	builtinName = getBuiltinNameOfConstructor(this.proto);
	serializedConstructor = this.json.proto;
	requiresInvalidDateCheck = this.proto === Date && !this.dateAllowsInvalid;
	traverseAllows = this.requiresInvalidDateCheck ? (data) => data instanceof Date && data.toString() !== "Invalid Date" : (data) => data instanceof this.proto;
	compiledCondition = `data instanceof ${this.serializedConstructor}${this.requiresInvalidDateCheck ? ` && data.toString() !== "Invalid Date"` : ""}`;
	compiledNegation = `!(${this.compiledCondition})`;
	innerToJsonSchema(ctx) {
		switch (this.builtinName) {
			case "Array": return { type: "array" };
			case "Date": return ctx.fallback.date?.({
				code: "date",
				base: {}
			}) ?? ctx.fallback.proto({
				code: "proto",
				base: {},
				proto: this.proto
			});
			default: return ctx.fallback.proto({
				code: "proto",
				base: {},
				proto: this.proto
			});
		}
	}
	expression = this.dateAllowsInvalid ? "Date | InvalidDate" : this.proto.name;
	get nestableExpression() {
		return this.dateAllowsInvalid ? `(${this.expression})` : this.expression;
	}
	domain = "object";
	get defaultShortDescription() {
		return this.description;
	}
};
const Proto = {
	implementation: implementation$6,
	Node: ProtoNode,
	writeBadInvalidDateMessage: (actual) => `dateAllowsInvalid may only be specified with constructor Date (was ${actual.name})`,
	writeInvalidSchemaMessage: (actual) => `instanceOf operand must be a function (was ${domainOf(actual)})`
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/union.js
const implementation$5 = implementNode({
	kind: "union",
	hasAssociatedError: true,
	collapsibleKey: "branches",
	keys: {
		ordered: {},
		branches: {
			child: true,
			parse: (schema$1, ctx) => {
				const branches = [];
				for (const branchSchema of schema$1) {
					const branchNodes = hasArkKind(branchSchema, "root") ? branchSchema.branches : ctx.$.parseSchema(branchSchema).branches;
					for (const node$1 of branchNodes) if (node$1.hasKind("morph")) {
						const matchingMorphIndex = branches.findIndex((matching) => matching.hasKind("morph") && matching.hasEqualMorphs(node$1));
						if (matchingMorphIndex === -1) branches.push(node$1);
						else {
							const matchingMorph = branches[matchingMorphIndex];
							branches[matchingMorphIndex] = ctx.$.node("morph", {
								...matchingMorph.inner,
								in: matchingMorph.rawIn.rawOr(node$1.rawIn)
							});
						}
					} else branches.push(node$1);
				}
				if (!ctx.def.ordered) branches.sort((l, r) => l.hash < r.hash ? -1 : 1);
				return branches;
			}
		}
	},
	normalize: (schema$1) => isArray(schema$1) ? { branches: schema$1 } : schema$1,
	reduce: (inner, $) => {
		const reducedBranches = reduceBranches(inner);
		if (reducedBranches.length === 1) return reducedBranches[0];
		if (reducedBranches.length === inner.branches.length) return;
		return $.node("union", {
			...inner,
			branches: reducedBranches
		}, { prereduced: true });
	},
	defaults: {
		description: (node$1) => node$1.distribute((branch) => branch.description, describeBranches),
		expected: (ctx) => {
			const byPath = groupBy(ctx.errors, "propString");
			return describeBranches(Object.entries(byPath).map(([path, errors]) => {
				const branchesAtPath = [];
				for (const errorAtPath of errors) appendUnique(branchesAtPath, errorAtPath.expected);
				const expected = describeBranches(branchesAtPath);
				const actual = errors.every((e) => e.actual === errors[0].actual) ? errors[0].actual : printable(errors[0].data);
				return `${path && `${path} `}must be ${expected}${actual && ` (was ${actual})`}`;
			}));
		},
		problem: (ctx) => ctx.expected,
		message: (ctx) => {
			if (ctx.problem[0] === "[") return `value at ${ctx.problem}`;
			return ctx.problem;
		}
	},
	intersections: {
		union: (l, r, ctx) => {
			if (l.isNever !== r.isNever) return Disjoint.init("presence", l, r);
			let resultBranches;
			if (l.ordered) {
				if (r.ordered) throwParseError(writeOrderedIntersectionMessage(l.expression, r.expression));
				resultBranches = intersectBranches(r.branches, l.branches, ctx);
				if (resultBranches instanceof Disjoint) resultBranches.invert();
			} else resultBranches = intersectBranches(l.branches, r.branches, ctx);
			if (resultBranches instanceof Disjoint) return resultBranches;
			return ctx.$.parseSchema(l.ordered || r.ordered ? {
				branches: resultBranches,
				ordered: true
			} : { branches: resultBranches });
		},
		...defineRightwardIntersections("union", (l, r, ctx) => {
			const branches = intersectBranches(l.branches, [r], ctx);
			if (branches instanceof Disjoint) return branches;
			if (branches.length === 1) return branches[0];
			return ctx.$.parseSchema(l.ordered ? {
				branches,
				ordered: true
			} : { branches });
		})
	}
});
var UnionNode = class extends BaseRoot {
	isBoolean = this.branches.length === 2 && this.branches[0].hasUnit(false) && this.branches[1].hasUnit(true);
	get branchGroups() {
		const branchGroups = [];
		let firstBooleanIndex = -1;
		for (const branch of this.branches) {
			if (branch.hasKind("unit") && branch.domain === "boolean") {
				if (firstBooleanIndex === -1) {
					firstBooleanIndex = branchGroups.length;
					branchGroups.push(branch);
				} else branchGroups[firstBooleanIndex] = $ark.intrinsic.boolean;
				continue;
			}
			branchGroups.push(branch);
		}
		return branchGroups;
	}
	unitBranches = this.branches.filter((n) => n.rawIn.hasKind("unit"));
	discriminant = this.discriminate();
	discriminantJson = this.discriminant ? discriminantToJson(this.discriminant) : null;
	expression = this.distribute((n) => n.nestableExpression, expressBranches);
	createBranchedOptimisticRootApply() {
		return (data, onFail) => {
			const optimisticResult = this.traverseOptimistic(data);
			if (optimisticResult !== unset) return optimisticResult;
			const ctx = new Traversal(data, this.$.resolvedConfig);
			this.traverseApply(data, ctx);
			return ctx.finalize(onFail);
		};
	}
	get shallowMorphs() {
		return this.branches.reduce((morphs, branch) => appendUnique(morphs, branch.shallowMorphs), []);
	}
	get defaultShortDescription() {
		return this.distribute((branch) => branch.defaultShortDescription, describeBranches);
	}
	innerToJsonSchema(ctx) {
		if (this.branchGroups.length === 1 && this.branchGroups[0].equals($ark.intrinsic.boolean)) return { type: "boolean" };
		const jsonSchemaBranches = this.branchGroups.map((group) => group.toJsonSchemaRecurse(ctx));
		if (jsonSchemaBranches.every((branch) => Object.keys(branch).length === 1 && hasKey(branch, "const"))) return { enum: jsonSchemaBranches.map((branch) => branch.const) };
		return { anyOf: jsonSchemaBranches };
	}
	traverseAllows = (data, ctx) => this.branches.some((b) => b.traverseAllows(data, ctx));
	traverseApply = (data, ctx) => {
		const errors = [];
		for (let i = 0; i < this.branches.length; i++) {
			ctx.pushBranch();
			this.branches[i].traverseApply(data, ctx);
			if (!ctx.hasError()) {
				if (this.branches[i].includesTransform) return ctx.queuedMorphs.push(...ctx.popBranch().queuedMorphs);
				return ctx.popBranch();
			}
			errors.push(ctx.popBranch().error);
		}
		ctx.errorFromNodeContext({
			code: "union",
			errors,
			meta: this.meta
		});
	};
	traverseOptimistic = (data) => {
		for (let i = 0; i < this.branches.length; i++) {
			const branch = this.branches[i];
			if (branch.traverseAllows(data)) {
				if (branch.contextFreeMorph) return branch.contextFreeMorph(data);
				return data;
			}
		}
		return unset;
	};
	compile(js) {
		if (!this.discriminant || this.unitBranches.length === this.branches.length && this.branches.length === 2) return this.compileIndiscriminable(js);
		let condition = this.discriminant.optionallyChainedPropString;
		if (this.discriminant.kind === "domain") condition = `typeof ${condition} === "object" ? ${condition} === null ? "null" : "object" : typeof ${condition} === "function" ? "object" : typeof ${condition}`;
		const cases = this.discriminant.cases;
		const caseKeys = Object.keys(cases);
		const { optimistic } = js;
		js.optimistic = false;
		js.block(`switch(${condition})`, () => {
			for (const k in cases) {
				const v = cases[k];
				const caseCondition = k === "default" ? k : `case ${k}`;
				let caseResult;
				if (v === true) caseResult = optimistic ? "data" : "true";
				else if (optimistic) if (v.rootApplyStrategy === "branchedOptimistic") caseResult = js.invoke(v, { kind: "Optimistic" });
				else if (v.contextFreeMorph) caseResult = `${js.invoke(v)} ? ${registeredReference(v.contextFreeMorph)}(data) : "${unset}"`;
				else caseResult = `${js.invoke(v)} ? data : "${unset}"`;
				else caseResult = js.invoke(v);
				js.line(`${caseCondition}: return ${caseResult}`);
			}
			return js;
		});
		if (js.traversalKind === "Allows") {
			js.return(optimistic ? `"${unset}"` : false);
			return;
		}
		const expected = describeBranches(this.discriminant.kind === "domain" ? caseKeys.map((k) => {
			const jsTypeOf = k.slice(1, -1);
			return jsTypeOf === "function" ? domainDescriptions.object : domainDescriptions[jsTypeOf];
		}) : caseKeys);
		const serializedPathSegments = this.discriminant.path.map((k) => typeof k === "symbol" ? registeredReference(k) : JSON.stringify(k));
		const serializedExpected = JSON.stringify(expected);
		const serializedActual = this.discriminant.kind === "domain" ? `${serializedTypeOfDescriptions}[${condition}]` : `${serializedPrintable}(${condition})`;
		js.line(`ctx.errorFromNodeContext({
	code: "predicate",
	expected: ${serializedExpected},
	actual: ${serializedActual},
	relativePath: [${serializedPathSegments}],
	meta: ${this.compiledMeta}
})`);
	}
	compileIndiscriminable(js) {
		if (js.traversalKind === "Apply") {
			js.const("errors", "[]");
			for (const branch of this.branches) js.line("ctx.pushBranch()").line(js.invoke(branch)).if("!ctx.hasError()", () => js.return(branch.includesTransform ? "ctx.queuedMorphs.push(...ctx.popBranch().queuedMorphs)" : "ctx.popBranch()")).line("errors.push(ctx.popBranch().error)");
			js.line(`ctx.errorFromNodeContext({ code: "union", errors, meta: ${this.compiledMeta} })`);
		} else {
			const { optimistic } = js;
			js.optimistic = false;
			for (const branch of this.branches) js.if(`${js.invoke(branch)}`, () => js.return(optimistic ? branch.contextFreeMorph ? `${registeredReference(branch.contextFreeMorph)}(data)` : "data" : true));
			js.return(optimistic ? `"${unset}"` : false);
		}
	}
	get nestableExpression() {
		return this.isBoolean ? "boolean" : `(${this.expression})`;
	}
	discriminate() {
		if (this.branches.length < 2 || this.isCyclic) return null;
		if (this.unitBranches.length === this.branches.length) return {
			kind: "unit",
			path: [],
			optionallyChainedPropString: "data",
			cases: flatMorph(this.unitBranches, (i, n) => [`${n.rawIn.serializedValue}`, n.hasKind("morph") ? n : true])
		};
		const candidates = [];
		for (let lIndex = 0; lIndex < this.branches.length - 1; lIndex++) {
			const l = this.branches[lIndex];
			for (let rIndex = lIndex + 1; rIndex < this.branches.length; rIndex++) {
				const r = this.branches[rIndex];
				const result = intersectNodesRoot(l.rawIn, r.rawIn, l.$);
				if (!(result instanceof Disjoint)) continue;
				for (const entry of result) {
					if (!entry.kind || entry.optional) continue;
					let lSerialized;
					let rSerialized;
					if (entry.kind === "domain") {
						const lValue = entry.l;
						const rValue = entry.r;
						lSerialized = `"${typeof lValue === "string" ? lValue : lValue.domain}"`;
						rSerialized = `"${typeof rValue === "string" ? rValue : rValue.domain}"`;
					} else if (entry.kind === "unit") {
						lSerialized = entry.l.serializedValue;
						rSerialized = entry.r.serializedValue;
					} else continue;
					const matching = candidates.find((d) => arrayEquals(d.path, entry.path) && d.kind === entry.kind);
					if (!matching) candidates.push({
						kind: entry.kind,
						cases: {
							[lSerialized]: {
								branchIndices: [lIndex],
								condition: entry.l
							},
							[rSerialized]: {
								branchIndices: [rIndex],
								condition: entry.r
							}
						},
						path: entry.path
					});
					else {
						if (matching.cases[lSerialized]) matching.cases[lSerialized].branchIndices = appendUnique(matching.cases[lSerialized].branchIndices, lIndex);
						else matching.cases[lSerialized] ??= {
							branchIndices: [lIndex],
							condition: entry.l
						};
						if (matching.cases[rSerialized]) matching.cases[rSerialized].branchIndices = appendUnique(matching.cases[rSerialized].branchIndices, rIndex);
						else matching.cases[rSerialized] ??= {
							branchIndices: [rIndex],
							condition: entry.r
						};
					}
				}
			}
		}
		const viableCandidates = this.ordered ? viableOrderedCandidates(candidates, this.branches) : candidates;
		if (!viableCandidates.length) return null;
		const ctx = createCaseResolutionContext(viableCandidates, this);
		const cases = {};
		for (const k in ctx.best.cases) {
			const resolution = resolveCase(ctx, k);
			if (resolution === null) {
				cases[k] = true;
				continue;
			}
			if (resolution.length === this.branches.length) return null;
			if (this.ordered) resolution.sort((l, r) => l.originalIndex - r.originalIndex);
			const branches = resolution.map((entry) => entry.branch);
			const caseNode = branches.length === 1 ? branches[0] : this.$.node("union", this.ordered ? {
				branches,
				ordered: true
			} : branches);
			Object.assign(this.referencesById, caseNode.referencesById);
			cases[k] = caseNode;
		}
		if (ctx.defaultEntries.length) {
			const branches = ctx.defaultEntries.map((entry) => entry.branch);
			cases.default = this.$.node("union", this.ordered ? {
				branches,
				ordered: true
			} : branches, { prereduced: true });
			Object.assign(this.referencesById, cases.default.referencesById);
		}
		return Object.assign(ctx.location, { cases });
	}
};
const createCaseResolutionContext = (viableCandidates, node$1) => {
	const best = viableCandidates.sort((l, r) => l.path.length === r.path.length ? Object.keys(r.cases).length - Object.keys(l.cases).length : l.path.length - r.path.length)[0];
	return {
		best,
		location: {
			kind: best.kind,
			path: best.path,
			optionallyChainedPropString: optionallyChainPropString(best.path)
		},
		defaultEntries: node$1.branches.map((branch, originalIndex) => ({
			originalIndex,
			branch
		})),
		node: node$1
	};
};
const resolveCase = (ctx, key) => {
	const caseCtx = ctx.best.cases[key];
	const discriminantNode = discriminantCaseToNode(caseCtx.condition, ctx.location.path, ctx.node.$);
	let resolvedEntries = [];
	const nextDefaults = [];
	for (let i = 0; i < ctx.defaultEntries.length; i++) {
		const entry = ctx.defaultEntries[i];
		if (caseCtx.branchIndices.includes(entry.originalIndex)) {
			const pruned = pruneDiscriminant(ctx.node.branches[entry.originalIndex], ctx.location);
			if (pruned === null) resolvedEntries = null;
			else resolvedEntries?.push({
				originalIndex: entry.originalIndex,
				branch: pruned
			});
		} else if (entry.branch.hasKind("alias") && discriminantNode.hasKind("domain") && discriminantNode.domain === "object") resolvedEntries?.push(entry);
		else {
			if (entry.branch.rawIn.overlaps(discriminantNode)) {
				const overlapping = pruneDiscriminant(entry.branch, ctx.location);
				resolvedEntries?.push({
					originalIndex: entry.originalIndex,
					branch: overlapping
				});
			}
			nextDefaults.push(entry);
		}
	}
	ctx.defaultEntries = nextDefaults;
	return resolvedEntries;
};
const viableOrderedCandidates = (candidates, originalBranches) => {
	return candidates.filter((candidate) => {
		const caseGroups = Object.values(candidate.cases).map((caseCtx) => caseCtx.branchIndices);
		for (let i = 0; i < caseGroups.length - 1; i++) {
			const currentGroup = caseGroups[i];
			for (let j = i + 1; j < caseGroups.length; j++) {
				const nextGroup = caseGroups[j];
				for (const currentIndex of currentGroup) for (const nextIndex of nextGroup) if (currentIndex > nextIndex) {
					if (originalBranches[currentIndex].overlaps(originalBranches[nextIndex])) return false;
				}
			}
		}
		return true;
	});
};
const discriminantCaseToNode = (caseDiscriminant, path, $) => {
	let node$1 = caseDiscriminant === "undefined" ? $.node("unit", { unit: void 0 }) : caseDiscriminant === "null" ? $.node("unit", { unit: null }) : caseDiscriminant === "boolean" ? $.units([true, false]) : caseDiscriminant;
	for (let i = path.length - 1; i >= 0; i--) {
		const key = path[i];
		node$1 = $.node("intersection", typeof key === "number" ? {
			proto: "Array",
			sequence: [...range(key).map((_) => ({})), node$1]
		} : {
			domain: "object",
			required: [{
				key,
				value: node$1
			}]
		});
	}
	return node$1;
};
const optionallyChainPropString = (path) => path.reduce((acc, k) => acc + compileLiteralPropAccess(k, true), "data");
const serializedTypeOfDescriptions = registeredReference(jsTypeOfDescriptions);
const serializedPrintable = registeredReference(printable);
const Union = {
	implementation: implementation$5,
	Node: UnionNode
};
const discriminantToJson = (discriminant) => ({
	kind: discriminant.kind,
	path: discriminant.path.map((k) => typeof k === "string" ? k : compileSerializedValue(k)),
	cases: flatMorph(discriminant.cases, (k, node$1) => [k, node$1 === true ? node$1 : node$1.hasKind("union") && node$1.discriminantJson ? node$1.discriminantJson : node$1.json])
});
const describeExpressionOptions = {
	delimiter: " | ",
	finalDelimiter: " | "
};
const expressBranches = (expressions) => describeBranches(expressions, describeExpressionOptions);
const describeBranches = (descriptions, opts) => {
	const delimiter = opts?.delimiter ?? ", ";
	const finalDelimiter = opts?.finalDelimiter ?? " or ";
	if (descriptions.length === 0) return "never";
	if (descriptions.length === 1) return descriptions[0];
	if (descriptions.length === 2 && descriptions[0] === "false" && descriptions[1] === "true" || descriptions[0] === "true" && descriptions[1] === "false") return "boolean";
	const seen = {};
	const unique = descriptions.filter((s) => seen[s] ? false : seen[s] = true);
	const last = unique.pop();
	return `${unique.join(delimiter)}${unique.length ? finalDelimiter : ""}${last}`;
};
const intersectBranches = (l, r, ctx) => {
	const batchesByR = r.map(() => []);
	for (let lIndex = 0; lIndex < l.length; lIndex++) {
		let candidatesByR = {};
		for (let rIndex = 0; rIndex < r.length; rIndex++) {
			if (batchesByR[rIndex] === null) continue;
			if (l[lIndex].equals(r[rIndex])) {
				batchesByR[rIndex] = null;
				candidatesByR = {};
				break;
			}
			const branchIntersection = intersectOrPipeNodes(l[lIndex], r[rIndex], ctx);
			if (branchIntersection instanceof Disjoint) continue;
			if (branchIntersection.equals(l[lIndex])) {
				batchesByR[rIndex].push(l[lIndex]);
				candidatesByR = {};
				break;
			}
			if (branchIntersection.equals(r[rIndex])) batchesByR[rIndex] = null;
			else candidatesByR[rIndex] = branchIntersection;
		}
		for (const rIndex in candidatesByR) batchesByR[rIndex][lIndex] = candidatesByR[rIndex];
	}
	const resultBranches = batchesByR.flatMap((batch, i) => batch?.flatMap((branch) => branch.branches) ?? r[i]);
	return resultBranches.length === 0 ? Disjoint.init("union", l, r) : resultBranches;
};
const reduceBranches = ({ branches, ordered }) => {
	if (branches.length < 2) return branches;
	const uniquenessByIndex = branches.map(() => true);
	for (let i = 0; i < branches.length; i++) for (let j = i + 1; j < branches.length && uniquenessByIndex[i] && uniquenessByIndex[j]; j++) {
		if (branches[i].equals(branches[j])) {
			uniquenessByIndex[j] = false;
			continue;
		}
		const intersection = intersectNodesRoot(branches[i].rawIn, branches[j].rawIn, branches[0].$);
		if (intersection instanceof Disjoint) continue;
		if (!ordered) assertDeterminateOverlap(branches[i], branches[j]);
		if (intersection.equals(branches[i].rawIn)) uniquenessByIndex[i] = !!ordered;
		else if (intersection.equals(branches[j].rawIn)) uniquenessByIndex[j] = false;
	}
	return branches.filter((_, i) => uniquenessByIndex[i]);
};
const assertDeterminateOverlap = (l, r) => {
	if (!l.includesTransform && !r.includesTransform) return;
	if (!arrayEquals(l.shallowMorphs, r.shallowMorphs)) throwParseError(writeIndiscriminableMorphMessage(l.expression, r.expression));
	if (!arrayEquals(l.flatMorphs, r.flatMorphs, { isEqual: (l$1, r$1) => l$1.propString === r$1.propString && (l$1.node.hasKind("morph") && r$1.node.hasKind("morph") ? l$1.node.hasEqualMorphs(r$1.node) : l$1.node.hasKind("intersection") && r$1.node.hasKind("intersection") ? l$1.node.structure?.structuralMorphRef === r$1.node.structure?.structuralMorphRef : false) })) throwParseError(writeIndiscriminableMorphMessage(l.expression, r.expression));
};
const pruneDiscriminant = (discriminantBranch, discriminantCtx) => discriminantBranch.transform((nodeKind, inner) => {
	if (nodeKind === "domain" || nodeKind === "unit") return null;
	return inner;
}, { shouldTransform: (node$1, ctx) => {
	const propString = optionallyChainPropString(ctx.path);
	if (!discriminantCtx.optionallyChainedPropString.startsWith(propString)) return false;
	if (node$1.hasKind("domain") && node$1.domain === "object") return true;
	if ((node$1.hasKind("domain") || discriminantCtx.kind === "unit") && propString === discriminantCtx.optionallyChainedPropString) return true;
	return node$1.children.length !== 0 && node$1.kind !== "index";
} });
const writeIndiscriminableMorphMessage = (lDescription, rDescription) => `An unordered union of a type including a morph and a type with overlapping input is indeterminate:
Left: ${lDescription}
Right: ${rDescription}`;
const writeOrderedIntersectionMessage = (lDescription, rDescription) => `The intersection of two ordered unions is indeterminate:
Left: ${lDescription}
Right: ${rDescription}`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/roots/unit.js
const implementation$4 = implementNode({
	kind: "unit",
	hasAssociatedError: true,
	keys: { unit: {
		preserveUndefined: true,
		serialize: (schema$1) => schema$1 instanceof Date ? schema$1.toISOString() : defaultValueSerializer(schema$1)
	} },
	normalize: (schema$1) => schema$1,
	defaults: {
		description: (node$1) => printable(node$1.unit),
		problem: ({ expected, actual }) => `${expected === actual ? `must be reference equal to ${expected} (serialized to the same value)` : `must be ${expected} (was ${actual})`}`
	},
	intersections: {
		unit: (l, r) => Disjoint.init("unit", l, r),
		...defineRightwardIntersections("unit", (l, r) => {
			if (r.allows(l.unit)) return l;
			const rBasis = r.hasKind("intersection") ? r.basis : r;
			if (rBasis) {
				const rDomain = rBasis.hasKind("domain") ? rBasis : $ark.intrinsic.object;
				if (l.domain !== rDomain.domain) {
					const lDomainDisjointValue = l.domain === "undefined" || l.domain === "null" || l.domain === "boolean" ? l.domain : $ark.intrinsic[l.domain];
					return Disjoint.init("domain", lDomainDisjointValue, rDomain);
				}
			}
			return Disjoint.init("assignability", l, r.hasKind("intersection") ? r.children.find((rConstraint) => !rConstraint.allows(l.unit)) : r);
		})
	}
});
var UnitNode = class extends InternalBasis {
	compiledValue = this.json.unit;
	serializedValue = typeof this.unit === "string" || this.unit instanceof Date ? JSON.stringify(this.compiledValue) : `${this.compiledValue}`;
	compiledCondition = compileEqualityCheck(this.unit, this.serializedValue);
	compiledNegation = compileEqualityCheck(this.unit, this.serializedValue, "negated");
	expression = printable(this.unit);
	domain = domainOf(this.unit);
	get defaultShortDescription() {
		return this.domain === "object" ? domainDescriptions.object : this.description;
	}
	innerToJsonSchema(ctx) {
		return this.unit === null ? { type: "null" } : $ark.intrinsic.jsonPrimitive.allows(this.unit) ? { const: this.unit } : ctx.fallback.unit({
			code: "unit",
			base: {},
			unit: this.unit
		});
	}
	traverseAllows = this.unit instanceof Date ? (data) => data instanceof Date && data.toISOString() === this.compiledValue : Number.isNaN(this.unit) ? (data) => Number.isNaN(data) : (data) => data === this.unit;
};
const Unit = {
	implementation: implementation$4,
	Node: UnitNode
};
const compileEqualityCheck = (unit, serializedValue, negated) => {
	if (unit instanceof Date) {
		const condition = `data instanceof Date && data.toISOString() === ${serializedValue}`;
		return negated ? `!(${condition})` : condition;
	}
	if (Number.isNaN(unit)) return `${negated ? "!" : ""}Number.isNaN(data)`;
	return `data ${negated ? "!" : "="}== ${serializedValue}`;
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/structure/index.js
const implementation$3 = implementNode({
	kind: "index",
	hasAssociatedError: false,
	intersectionIsOpen: true,
	keys: {
		signature: {
			child: true,
			parse: (schema$1, ctx) => {
				const key = ctx.$.parseSchema(schema$1);
				if (!key.extends($ark.intrinsic.key)) return throwParseError(writeInvalidPropertyKeyMessage(key.expression));
				const enumerableBranches = key.branches.filter((b) => b.hasKind("unit"));
				if (enumerableBranches.length) return throwParseError(writeEnumerableIndexBranches(enumerableBranches.map((b) => printable(b.unit))));
				return key;
			}
		},
		value: {
			child: true,
			parse: (schema$1, ctx) => ctx.$.parseSchema(schema$1)
		}
	},
	normalize: (schema$1) => schema$1,
	defaults: { description: (node$1) => `[${node$1.signature.expression}]: ${node$1.value.description}` },
	intersections: { index: (l, r, ctx) => {
		if (l.signature.equals(r.signature)) {
			const valueIntersection = intersectOrPipeNodes(l.value, r.value, ctx);
			const value$1 = valueIntersection instanceof Disjoint ? $ark.intrinsic.never.internal : valueIntersection;
			return ctx.$.node("index", {
				signature: l.signature,
				value: value$1
			});
		}
		if (l.signature.extends(r.signature) && l.value.subsumes(r.value)) return r;
		if (r.signature.extends(l.signature) && r.value.subsumes(l.value)) return l;
		return null;
	} }
});
var IndexNode = class extends BaseConstraint {
	impliedBasis = $ark.intrinsic.object.internal;
	expression = `[${this.signature.expression}]: ${this.value.expression}`;
	flatRefs = append(this.value.flatRefs.map((ref) => flatRef([this.signature, ...ref.path], ref.node)), flatRef([this.signature], this.value));
	traverseAllows = (data, ctx) => stringAndSymbolicEntriesOf(data).every((entry) => {
		if (this.signature.traverseAllows(entry[0], ctx)) return traverseKey(entry[0], () => this.value.traverseAllows(entry[1], ctx), ctx);
		return true;
	});
	traverseApply = (data, ctx) => {
		for (const entry of stringAndSymbolicEntriesOf(data)) if (this.signature.traverseAllows(entry[0], ctx)) traverseKey(entry[0], () => this.value.traverseApply(entry[1], ctx), ctx);
	};
	_transform(mapper, ctx) {
		ctx.path.push(this.signature);
		const result = super._transform(mapper, ctx);
		ctx.path.pop();
		return result;
	}
	compile() {}
};
const Index = {
	implementation: implementation$3,
	Node: IndexNode
};
const writeEnumerableIndexBranches = (keys) => `Index keys ${keys.join(", ")} should be specified as named props.`;
const writeInvalidPropertyKeyMessage = (indexSchema) => `Indexed key definition '${indexSchema}' must be a string or symbol`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/structure/required.js
const implementation$2 = implementNode({
	kind: "required",
	hasAssociatedError: true,
	intersectionIsOpen: true,
	keys: {
		key: {},
		value: {
			child: true,
			parse: (schema$1, ctx) => ctx.$.parseSchema(schema$1)
		}
	},
	normalize: (schema$1) => schema$1,
	defaults: {
		description: (node$1) => `${node$1.compiledKey}: ${node$1.value.description}`,
		expected: (ctx) => ctx.missingValueDescription,
		actual: () => "missing"
	},
	intersections: {
		required: intersectProps,
		optional: intersectProps
	}
});
var RequiredNode = class extends BaseProp {
	expression = `${this.compiledKey}: ${this.value.expression}`;
	errorContext = Object.freeze({
		code: "required",
		missingValueDescription: this.value.defaultShortDescription,
		relativePath: [this.key],
		meta: this.meta
	});
	compiledErrorContext = compileObjectLiteral(this.errorContext);
};
const Required$1 = {
	implementation: implementation$2,
	Node: RequiredNode
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/structure/sequence.js
const implementation$1 = implementNode({
	kind: "sequence",
	hasAssociatedError: false,
	collapsibleKey: "variadic",
	keys: {
		prefix: {
			child: true,
			parse: (schema$1, ctx) => {
				if (schema$1.length === 0) return void 0;
				return schema$1.map((element) => ctx.$.parseSchema(element));
			}
		},
		optionals: {
			child: true,
			parse: (schema$1, ctx) => {
				if (schema$1.length === 0) return void 0;
				return schema$1.map((element) => ctx.$.parseSchema(element));
			}
		},
		defaultables: {
			child: (defaultables) => defaultables.map((element) => element[0]),
			parse: (defaultables, ctx) => {
				if (defaultables.length === 0) return void 0;
				return defaultables.map((element) => {
					const node$1 = ctx.$.parseSchema(element[0]);
					assertDefaultValueAssignability(node$1, element[1], null);
					return [node$1, element[1]];
				});
			},
			serialize: (defaults) => defaults.map((element) => [element[0].collapsibleJson, defaultValueSerializer(element[1])]),
			reduceIo: (ioKind, inner, defaultables) => {
				if (ioKind === "in") {
					inner.optionals = defaultables.map((d) => d[0].rawIn);
					return;
				}
				inner.prefix = defaultables.map((d) => d[0].rawOut);
			}
		},
		variadic: {
			child: true,
			parse: (schema$1, ctx) => ctx.$.parseSchema(schema$1, ctx)
		},
		minVariadicLength: { parse: (min) => min === 0 ? void 0 : min },
		postfix: {
			child: true,
			parse: (schema$1, ctx) => {
				if (schema$1.length === 0) return void 0;
				return schema$1.map((element) => ctx.$.parseSchema(element));
			}
		}
	},
	normalize: (schema$1) => {
		if (typeof schema$1 === "string") return { variadic: schema$1 };
		if ("variadic" in schema$1 || "prefix" in schema$1 || "defaultables" in schema$1 || "optionals" in schema$1 || "postfix" in schema$1 || "minVariadicLength" in schema$1) {
			if (schema$1.postfix?.length) {
				if (!schema$1.variadic) return throwParseError(postfixWithoutVariadicMessage);
				if (schema$1.optionals?.length || schema$1.defaultables?.length) return throwParseError(postfixAfterOptionalOrDefaultableMessage);
			}
			if (schema$1.minVariadicLength && !schema$1.variadic) return throwParseError("minVariadicLength may not be specified without a variadic element");
			return schema$1;
		}
		return { variadic: schema$1 };
	},
	reduce: (raw, $) => {
		let minVariadicLength = raw.minVariadicLength ?? 0;
		const prefix = raw.prefix?.slice() ?? [];
		const defaultables = raw.defaultables?.slice() ?? [];
		const optionals = raw.optionals?.slice() ?? [];
		const postfix = raw.postfix?.slice() ?? [];
		if (raw.variadic) {
			while (optionals.at(-1)?.equals(raw.variadic)) optionals.pop();
			if (optionals.length === 0 && defaultables.length === 0) while (prefix.at(-1)?.equals(raw.variadic)) {
				prefix.pop();
				minVariadicLength++;
			}
			while (postfix[0]?.equals(raw.variadic)) {
				postfix.shift();
				minVariadicLength++;
			}
		} else if (optionals.length === 0 && defaultables.length === 0) prefix.push(...postfix.splice(0));
		if (minVariadicLength !== raw.minVariadicLength || raw.prefix && raw.prefix.length !== prefix.length) return $.node("sequence", {
			...raw,
			prefix,
			defaultables,
			optionals,
			postfix,
			minVariadicLength
		}, { prereduced: true });
	},
	defaults: { description: (node$1) => {
		if (node$1.isVariadicOnly) return `${node$1.variadic.nestableExpression}[]`;
		return `[${node$1.tuple.map((element) => element.kind === "defaultables" ? `${element.node.nestableExpression} = ${printable(element.default)}` : element.kind === "optionals" ? `${element.node.nestableExpression}?` : element.kind === "variadic" ? `...${element.node.nestableExpression}[]` : element.node.expression).join(", ")}]`;
	} },
	intersections: { sequence: (l, r, ctx) => {
		const rootState = _intersectSequences({
			l: l.tuple,
			r: r.tuple,
			disjoint: new Disjoint(),
			result: [],
			fixedVariants: [],
			ctx
		});
		const viableBranches = rootState.disjoint.length === 0 ? [rootState, ...rootState.fixedVariants] : rootState.fixedVariants;
		return viableBranches.length === 0 ? rootState.disjoint : viableBranches.length === 1 ? ctx.$.node("sequence", sequenceTupleToInner(viableBranches[0].result)) : ctx.$.node("union", viableBranches.map((state) => ({
			proto: Array,
			sequence: sequenceTupleToInner(state.result)
		})));
	} }
});
var SequenceNode = class extends BaseConstraint {
	impliedBasis = $ark.intrinsic.Array.internal;
	tuple = sequenceInnerToTuple(this.inner);
	prefixLength = this.prefix?.length ?? 0;
	defaultablesLength = this.defaultables?.length ?? 0;
	optionalsLength = this.optionals?.length ?? 0;
	postfixLength = this.postfix?.length ?? 0;
	defaultablesAndOptionals = [];
	prevariadic = this.tuple.filter((el) => {
		if (el.kind === "defaultables" || el.kind === "optionals") {
			this.defaultablesAndOptionals.push(el.node);
			return true;
		}
		return el.kind === "prefix";
	});
	variadicOrPostfix = conflatenate(this.variadic && [this.variadic], this.postfix);
	flatRefs = this.addFlatRefs();
	addFlatRefs() {
		appendUniqueFlatRefs(this.flatRefs, this.prevariadic.flatMap((element, i) => append(element.node.flatRefs.map((ref) => flatRef([`${i}`, ...ref.path], ref.node)), flatRef([`${i}`], element.node))));
		appendUniqueFlatRefs(this.flatRefs, this.variadicOrPostfix.flatMap((element) => append(element.flatRefs.map((ref) => flatRef([$ark.intrinsic.nonNegativeIntegerString.internal, ...ref.path], ref.node)), flatRef([$ark.intrinsic.nonNegativeIntegerString.internal], element))));
		return this.flatRefs;
	}
	isVariadicOnly = this.prevariadic.length + this.postfixLength === 0;
	minVariadicLength = this.inner.minVariadicLength ?? 0;
	minLength = this.prefixLength + this.minVariadicLength + this.postfixLength;
	minLengthNode = this.minLength === 0 ? null : this.$.node("minLength", this.minLength);
	maxLength = this.variadic ? null : this.tuple.length;
	maxLengthNode = this.maxLength === null ? null : this.$.node("maxLength", this.maxLength);
	impliedSiblings = this.minLengthNode ? this.maxLengthNode ? [this.minLengthNode, this.maxLengthNode] : [this.minLengthNode] : this.maxLengthNode ? [this.maxLengthNode] : [];
	defaultValueMorphs = getDefaultableMorphs(this);
	defaultValueMorphsReference = this.defaultValueMorphs.length ? registeredReference(this.defaultValueMorphs) : void 0;
	elementAtIndex(data, index) {
		if (index < this.prevariadic.length) return this.tuple[index];
		const firstPostfixIndex = data.length - this.postfixLength;
		if (index >= firstPostfixIndex) return {
			kind: "postfix",
			node: this.postfix[index - firstPostfixIndex]
		};
		return {
			kind: "variadic",
			node: this.variadic ?? throwInternalError(`Unexpected attempt to access index ${index} on ${this}`)
		};
	}
	traverseAllows = (data, ctx) => {
		for (let i = 0; i < data.length; i++) if (!this.elementAtIndex(data, i).node.traverseAllows(data[i], ctx)) return false;
		return true;
	};
	traverseApply = (data, ctx) => {
		let i = 0;
		for (; i < data.length; i++) traverseKey(i, () => this.elementAtIndex(data, i).node.traverseApply(data[i], ctx), ctx);
	};
	get element() {
		return this.cacheGetter("element", this.$.node("union", this.children));
	}
	compile(js) {
		if (this.prefix) for (const [i, node$1] of this.prefix.entries()) js.traverseKey(`${i}`, `data[${i}]`, node$1);
		for (const [i, node$1] of this.defaultablesAndOptionals.entries()) {
			const dataIndex = `${i + this.prefixLength}`;
			js.if(`${dataIndex} >= data.length`, () => js.traversalKind === "Allows" ? js.return(true) : js.return());
			js.traverseKey(dataIndex, `data[${dataIndex}]`, node$1);
		}
		if (this.variadic) {
			if (this.postfix) js.const("firstPostfixIndex", `data.length${this.postfix ? `- ${this.postfix.length}` : ""}`);
			js.for(`i < ${this.postfix ? "firstPostfixIndex" : "data.length"}`, () => js.traverseKey("i", "data[i]", this.variadic), this.prevariadic.length);
			if (this.postfix) for (const [i, node$1] of this.postfix.entries()) {
				const keyExpression = `firstPostfixIndex + ${i}`;
				js.traverseKey(keyExpression, `data[${keyExpression}]`, node$1);
			}
		}
		if (js.traversalKind === "Allows") js.return(true);
	}
	_transform(mapper, ctx) {
		ctx.path.push($ark.intrinsic.nonNegativeIntegerString.internal);
		const result = super._transform(mapper, ctx);
		ctx.path.pop();
		return result;
	}
	expression = this.description;
	reduceJsonSchema(schema$1, ctx) {
		if (this.prevariadic.length) schema$1.prefixItems = this.prevariadic.map((el) => {
			const valueSchema = el.node.toJsonSchemaRecurse(ctx);
			if (el.kind === "defaultables") {
				const value$1 = typeof el.default === "function" ? el.default() : el.default;
				valueSchema.default = $ark.intrinsic.jsonData.allows(value$1) ? value$1 : ctx.fallback.defaultValue({
					code: "defaultValue",
					base: valueSchema,
					value: value$1
				});
			}
			return valueSchema;
		});
		if (this.minLength) schema$1.minItems = this.minLength;
		if (this.variadic) {
			const variadicSchema = Object.assign(schema$1, { items: this.variadic.toJsonSchemaRecurse(ctx) });
			if (this.maxLength) variadicSchema.maxItems = this.maxLength;
			if (this.postfix) {
				const elements = this.postfix.map((el) => el.toJsonSchemaRecurse(ctx));
				schema$1 = ctx.fallback.arrayPostfix({
					code: "arrayPostfix",
					base: variadicSchema,
					elements
				});
			}
		} else {
			schema$1.items = false;
			delete schema$1.maxItems;
		}
		return schema$1;
	}
};
const defaultableMorphsCache$1 = {};
const getDefaultableMorphs = (node$1) => {
	if (!node$1.defaultables) return [];
	const morphs = [];
	let cacheKey = "[";
	const lastDefaultableIndex = node$1.prefixLength + node$1.defaultablesLength - 1;
	for (let i = node$1.prefixLength; i <= lastDefaultableIndex; i++) {
		const [elementNode, defaultValue] = node$1.defaultables[i - node$1.prefixLength];
		morphs.push(computeDefaultValueMorph(i, elementNode, defaultValue));
		cacheKey += `${i}: ${elementNode.id} = ${defaultValueSerializer(defaultValue)}, `;
	}
	cacheKey += "]";
	return defaultableMorphsCache$1[cacheKey] ??= morphs;
};
const Sequence = {
	implementation: implementation$1,
	Node: SequenceNode
};
const sequenceInnerToTuple = (inner) => {
	const tuple = [];
	if (inner.prefix) for (const node$1 of inner.prefix) tuple.push({
		kind: "prefix",
		node: node$1
	});
	if (inner.defaultables) for (const [node$1, defaultValue] of inner.defaultables) tuple.push({
		kind: "defaultables",
		node: node$1,
		default: defaultValue
	});
	if (inner.optionals) for (const node$1 of inner.optionals) tuple.push({
		kind: "optionals",
		node: node$1
	});
	if (inner.variadic) tuple.push({
		kind: "variadic",
		node: inner.variadic
	});
	if (inner.postfix) for (const node$1 of inner.postfix) tuple.push({
		kind: "postfix",
		node: node$1
	});
	return tuple;
};
const sequenceTupleToInner = (tuple) => tuple.reduce((result, element) => {
	if (element.kind === "variadic") result.variadic = element.node;
	else if (element.kind === "defaultables") result.defaultables = append(result.defaultables, [[element.node, element.default]]);
	else result[element.kind] = append(result[element.kind], element.node);
	return result;
}, {});
const postfixAfterOptionalOrDefaultableMessage = "A postfix required element cannot follow an optional or defaultable element";
const postfixWithoutVariadicMessage = "A postfix element requires a variadic element";
const _intersectSequences = (s) => {
	const [lHead, ...lTail] = s.l;
	const [rHead, ...rTail] = s.r;
	if (!lHead || !rHead) return s;
	const lHasPostfix = lTail.at(-1)?.kind === "postfix";
	const rHasPostfix = rTail.at(-1)?.kind === "postfix";
	const kind = lHead.kind === "prefix" || rHead.kind === "prefix" ? "prefix" : lHead.kind === "postfix" || rHead.kind === "postfix" ? "postfix" : lHead.kind === "variadic" && rHead.kind === "variadic" ? "variadic" : lHasPostfix || rHasPostfix ? "prefix" : lHead.kind === "defaultables" || rHead.kind === "defaultables" ? "defaultables" : "optionals";
	if (lHead.kind === "prefix" && rHead.kind === "variadic" && rHasPostfix) {
		const postfixBranchResult = _intersectSequences({
			...s,
			fixedVariants: [],
			r: rTail.map((element) => ({
				...element,
				kind: "prefix"
			}))
		});
		if (postfixBranchResult.disjoint.length === 0) s.fixedVariants.push(postfixBranchResult);
	} else if (rHead.kind === "prefix" && lHead.kind === "variadic" && lHasPostfix) {
		const postfixBranchResult = _intersectSequences({
			...s,
			fixedVariants: [],
			l: lTail.map((element) => ({
				...element,
				kind: "prefix"
			}))
		});
		if (postfixBranchResult.disjoint.length === 0) s.fixedVariants.push(postfixBranchResult);
	}
	const result = intersectOrPipeNodes(lHead.node, rHead.node, s.ctx);
	if (result instanceof Disjoint) if (kind === "prefix" || kind === "postfix") {
		s.disjoint.push(...result.withPrefixKey(kind === "prefix" ? s.result.length : `-${lTail.length + 1}`, elementIsRequired(lHead) && elementIsRequired(rHead) ? "required" : "optional"));
		s.result = [...s.result, {
			kind,
			node: $ark.intrinsic.never.internal
		}];
	} else if (kind === "optionals" || kind === "defaultables") return s;
	else return _intersectSequences({
		...s,
		fixedVariants: [],
		l: lTail.map((element) => ({
			...element,
			kind: "prefix"
		})),
		r: lTail.map((element) => ({
			...element,
			kind: "prefix"
		}))
	});
	else if (kind === "defaultables") {
		if (lHead.kind === "defaultables" && rHead.kind === "defaultables" && lHead.default !== rHead.default) throwParseError(writeDefaultIntersectionMessage(lHead.default, rHead.default));
		s.result = [...s.result, {
			kind,
			node: result,
			default: lHead.kind === "defaultables" ? lHead.default : rHead.kind === "defaultables" ? rHead.default : throwInternalError(`Unexpected defaultable intersection from ${lHead.kind} and ${rHead.kind} elements.`)
		}];
	} else s.result = [...s.result, {
		kind,
		node: result
	}];
	const lRemaining = s.l.length;
	const rRemaining = s.r.length;
	if (lHead.kind !== "variadic" || lRemaining >= rRemaining && (rHead.kind === "variadic" || rRemaining === 1)) s.l = lTail;
	if (rHead.kind !== "variadic" || rRemaining >= lRemaining && (lHead.kind === "variadic" || lRemaining === 1)) s.r = rTail;
	return _intersectSequences(s);
};
const elementIsRequired = (el) => el.kind === "prefix" || el.kind === "postfix";

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/structure/structure.js
const createStructuralWriter = (childStringProp) => (node$1) => {
	if (node$1.props.length || node$1.index) {
		const parts = node$1.index?.map((index) => index[childStringProp]) ?? [];
		for (const prop of node$1.props) parts.push(prop[childStringProp]);
		if (node$1.undeclared) parts.push(`+ (undeclared): ${node$1.undeclared}`);
		const objectLiteralDescription = `{ ${parts.join(", ")} }`;
		return node$1.sequence ? `${objectLiteralDescription} & ${node$1.sequence.description}` : objectLiteralDescription;
	}
	return node$1.sequence?.description ?? "{}";
};
const structuralDescription = createStructuralWriter("description");
const structuralExpression = createStructuralWriter("expression");
const intersectPropsAndIndex = (l, r, $) => {
	const kind = l.required ? "required" : "optional";
	if (!r.signature.allows(l.key)) return null;
	const value$1 = intersectNodesRoot(l.value, r.value, $);
	if (value$1 instanceof Disjoint) return kind === "optional" ? $.node("optional", {
		key: l.key,
		value: $ark.intrinsic.never.internal
	}) : value$1.withPrefixKey(l.key, l.kind);
	return null;
};
const implementation = implementNode({
	kind: "structure",
	hasAssociatedError: false,
	normalize: (schema$1) => schema$1,
	applyConfig: (schema$1, config) => {
		if (!schema$1.undeclared && config.onUndeclaredKey !== "ignore") return {
			...schema$1,
			undeclared: config.onUndeclaredKey
		};
		return schema$1;
	},
	keys: {
		required: {
			child: true,
			parse: constraintKeyParser("required"),
			reduceIo: (ioKind, inner, nodes) => {
				inner.required = append(inner.required, nodes.map((node$1) => ioKind === "in" ? node$1.rawIn : node$1.rawOut));
			}
		},
		optional: {
			child: true,
			parse: constraintKeyParser("optional"),
			reduceIo: (ioKind, inner, nodes) => {
				if (ioKind === "in") {
					inner.optional = nodes.map((node$1) => node$1.rawIn);
					return;
				}
				for (const node$1 of nodes) inner[node$1.outProp.kind] = append(inner[node$1.outProp.kind], node$1.outProp.rawOut);
			}
		},
		index: {
			child: true,
			parse: constraintKeyParser("index")
		},
		sequence: {
			child: true,
			parse: constraintKeyParser("sequence")
		},
		undeclared: {
			parse: (behavior) => behavior === "ignore" ? void 0 : behavior,
			reduceIo: (ioKind, inner, value$1) => {
				if (value$1 === "reject") {
					inner.undeclared = "reject";
					return;
				}
				if (ioKind === "in") delete inner.undeclared;
				else inner.undeclared = "reject";
			}
		}
	},
	defaults: { description: structuralDescription },
	intersections: { structure: (l, r, ctx) => {
		const lInner = { ...l.inner };
		const rInner = { ...r.inner };
		const disjointResult = new Disjoint();
		if (l.undeclared) {
			const lKey = l.keyof();
			for (const k of r.requiredKeys) if (!lKey.allows(k)) disjointResult.add("presence", $ark.intrinsic.never.internal, r.propsByKey[k].value, { path: [k] });
			if (rInner.optional) rInner.optional = rInner.optional.filter((n) => lKey.allows(n.key));
			if (rInner.index) rInner.index = rInner.index.flatMap((n) => {
				if (n.signature.extends(lKey)) return n;
				const indexOverlap = intersectNodesRoot(lKey, n.signature, ctx.$);
				if (indexOverlap instanceof Disjoint) return [];
				const normalized = normalizeIndex(indexOverlap, n.value, ctx.$);
				if (normalized.required) rInner.required = conflatenate(rInner.required, normalized.required);
				if (normalized.optional) rInner.optional = conflatenate(rInner.optional, normalized.optional);
				return normalized.index ?? [];
			});
		}
		if (r.undeclared) {
			const rKey = r.keyof();
			for (const k of l.requiredKeys) if (!rKey.allows(k)) disjointResult.add("presence", l.propsByKey[k].value, $ark.intrinsic.never.internal, { path: [k] });
			if (lInner.optional) lInner.optional = lInner.optional.filter((n) => rKey.allows(n.key));
			if (lInner.index) lInner.index = lInner.index.flatMap((n) => {
				if (n.signature.extends(rKey)) return n;
				const indexOverlap = intersectNodesRoot(rKey, n.signature, ctx.$);
				if (indexOverlap instanceof Disjoint) return [];
				const normalized = normalizeIndex(indexOverlap, n.value, ctx.$);
				if (normalized.required) lInner.required = conflatenate(lInner.required, normalized.required);
				if (normalized.optional) lInner.optional = conflatenate(lInner.optional, normalized.optional);
				return normalized.index ?? [];
			});
		}
		const baseInner = {};
		if (l.undeclared || r.undeclared) baseInner.undeclared = l.undeclared === "reject" || r.undeclared === "reject" ? "reject" : "delete";
		const childIntersectionResult = intersectConstraints({
			kind: "structure",
			baseInner,
			l: flattenConstraints(lInner),
			r: flattenConstraints(rInner),
			roots: [],
			ctx
		});
		if (childIntersectionResult instanceof Disjoint) disjointResult.push(...childIntersectionResult);
		if (disjointResult.length) return disjointResult;
		return childIntersectionResult;
	} },
	reduce: (inner, $) => {
		if (!inner.required && !inner.optional) return;
		const seen = {};
		let updated = false;
		const newOptionalProps = inner.optional ? [...inner.optional] : [];
		if (inner.required) for (let i = 0; i < inner.required.length; i++) {
			const requiredProp = inner.required[i];
			if (requiredProp.key in seen) throwParseError(writeDuplicateKeyMessage(requiredProp.key));
			seen[requiredProp.key] = true;
			if (inner.index) for (const index of inner.index) {
				const intersection = intersectPropsAndIndex(requiredProp, index, $);
				if (intersection instanceof Disjoint) return intersection;
			}
		}
		if (inner.optional) for (let i = 0; i < inner.optional.length; i++) {
			const optionalProp = inner.optional[i];
			if (optionalProp.key in seen) throwParseError(writeDuplicateKeyMessage(optionalProp.key));
			seen[optionalProp.key] = true;
			if (inner.index) for (const index of inner.index) {
				const intersection = intersectPropsAndIndex(optionalProp, index, $);
				if (intersection instanceof Disjoint) return intersection;
				if (intersection !== null) {
					newOptionalProps[i] = intersection;
					updated = true;
				}
			}
		}
		if (updated) return $.node("structure", {
			...inner,
			optional: newOptionalProps
		}, { prereduced: true });
	}
});
var StructureNode = class extends BaseConstraint {
	impliedBasis = $ark.intrinsic.object.internal;
	impliedSiblings = this.children.flatMap((n) => n.impliedSiblings ?? []);
	props = conflatenate(this.required, this.optional);
	propsByKey = flatMorph(this.props, (i, node$1) => [node$1.key, node$1]);
	propsByKeyReference = registeredReference(this.propsByKey);
	expression = structuralExpression(this);
	requiredKeys = this.required?.map((node$1) => node$1.key) ?? [];
	optionalKeys = this.optional?.map((node$1) => node$1.key) ?? [];
	literalKeys = [...this.requiredKeys, ...this.optionalKeys];
	_keyof;
	keyof() {
		if (this._keyof) return this._keyof;
		let branches = this.$.units(this.literalKeys).branches;
		if (this.index) for (const { signature } of this.index) branches = branches.concat(signature.branches);
		return this._keyof = this.$.node("union", branches);
	}
	map(flatMapProp) {
		return this.$.node("structure", this.props.flatMap(flatMapProp).reduce((structureInner, mapped) => {
			const originalProp = this.propsByKey[mapped.key];
			if (isNode(mapped)) {
				if (mapped.kind !== "required" && mapped.kind !== "optional") return throwParseError(`Map result must have kind "required" or "optional" (was ${mapped.kind})`);
				structureInner[mapped.kind] = append(structureInner[mapped.kind], mapped);
				return structureInner;
			}
			const mappedKind = mapped.kind ?? originalProp?.kind ?? "required";
			const mappedPropInner = flatMorph(mapped, (k, v) => k in Optional.implementation.keys ? [k, v] : []);
			structureInner[mappedKind] = append(structureInner[mappedKind], this.$.node(mappedKind, mappedPropInner));
			return structureInner;
		}, {}));
	}
	assertHasKeys(keys) {
		const invalidKeys = keys.filter((k) => !typeOrTermExtends(k, this.keyof()));
		if (invalidKeys.length) return throwParseError(writeInvalidKeysMessage(this.expression, invalidKeys));
	}
	get(indexer, ...path) {
		let value$1;
		let required = false;
		const key = indexerToKey(indexer);
		if ((typeof key === "string" || typeof key === "symbol") && this.propsByKey[key]) {
			value$1 = this.propsByKey[key].value;
			required = this.propsByKey[key].required;
		}
		if (this.index) {
			for (const n of this.index) if (typeOrTermExtends(key, n.signature)) value$1 = value$1?.and(n.value) ?? n.value;
		}
		if (this.sequence && typeOrTermExtends(key, $ark.intrinsic.nonNegativeIntegerString)) if (hasArkKind(key, "root")) {
			if (this.sequence.variadic) value$1 = value$1?.and(this.sequence.element) ?? this.sequence.element;
		} else {
			const index = Number.parseInt(key);
			if (index < this.sequence.prevariadic.length) {
				const fixedElement = this.sequence.prevariadic[index].node;
				value$1 = value$1?.and(fixedElement) ?? fixedElement;
				required ||= index < this.sequence.prefixLength;
			} else if (this.sequence.variadic) {
				const nonFixedElement = this.$.node("union", this.sequence.variadicOrPostfix);
				value$1 = value$1?.and(nonFixedElement) ?? nonFixedElement;
			}
		}
		if (!value$1) {
			if (this.sequence?.variadic && hasArkKind(key, "root") && key.extends($ark.intrinsic.number)) return throwParseError(writeNumberIndexMessage(key.expression, this.sequence.expression));
			return throwParseError(writeInvalidKeysMessage(this.expression, [key]));
		}
		const result = value$1.get(...path);
		return required ? result : result.or($ark.intrinsic.undefined);
	}
	pick(...keys) {
		this.assertHasKeys(keys);
		return this.$.node("structure", this.filterKeys("pick", keys));
	}
	omit(...keys) {
		this.assertHasKeys(keys);
		return this.$.node("structure", this.filterKeys("omit", keys));
	}
	optionalize() {
		const { required, ...inner } = this.inner;
		return this.$.node("structure", {
			...inner,
			optional: this.props.map((prop) => prop.hasKind("required") ? this.$.node("optional", prop.inner) : prop)
		});
	}
	require() {
		const { optional, ...inner } = this.inner;
		return this.$.node("structure", {
			...inner,
			required: this.props.map((prop) => prop.hasKind("optional") ? {
				key: prop.key,
				value: prop.value
			} : prop)
		});
	}
	merge(r) {
		const inner = this.filterKeys("omit", [r.keyof()]);
		if (r.required) inner.required = append(inner.required, r.required);
		if (r.optional) inner.optional = append(inner.optional, r.optional);
		if (r.index) inner.index = append(inner.index, r.index);
		if (r.sequence) inner.sequence = r.sequence;
		if (r.undeclared) inner.undeclared = r.undeclared;
		else delete inner.undeclared;
		return this.$.node("structure", inner);
	}
	filterKeys(operation, keys) {
		const result = makeRootAndArrayPropertiesMutable(this.inner);
		const shouldKeep = (key) => {
			const matchesKey = keys.some((k) => typeOrTermExtends(key, k));
			return operation === "pick" ? matchesKey : !matchesKey;
		};
		if (result.required) result.required = result.required.filter((prop) => shouldKeep(prop.key));
		if (result.optional) result.optional = result.optional.filter((prop) => shouldKeep(prop.key));
		if (result.index) result.index = result.index.filter((index) => shouldKeep(index.signature));
		return result;
	}
	traverseAllows = (data, ctx) => this._traverse("Allows", data, ctx);
	traverseApply = (data, ctx) => this._traverse("Apply", data, ctx);
	_traverse = (traversalKind, data, ctx) => {
		const errorCount = ctx?.currentErrorCount ?? 0;
		for (let i = 0; i < this.props.length; i++) if (traversalKind === "Allows") {
			if (!this.props[i].traverseAllows(data, ctx)) return false;
		} else {
			this.props[i].traverseApply(data, ctx);
			if (ctx.failFast && ctx.currentErrorCount > errorCount) return false;
		}
		if (this.sequence) if (traversalKind === "Allows") {
			if (!this.sequence.traverseAllows(data, ctx)) return false;
		} else {
			this.sequence.traverseApply(data, ctx);
			if (ctx.failFast && ctx.currentErrorCount > errorCount) return false;
		}
		if (this.index || this.undeclared === "reject") {
			const keys = Object.keys(data);
			keys.push(...Object.getOwnPropertySymbols(data));
			for (let i = 0; i < keys.length; i++) {
				const k = keys[i];
				if (this.index) {
					for (const node$1 of this.index) if (node$1.signature.traverseAllows(k, ctx)) if (traversalKind === "Allows") {
						if (!traverseKey(k, () => node$1.value.traverseAllows(data[k], ctx), ctx)) return false;
					} else {
						traverseKey(k, () => node$1.value.traverseApply(data[k], ctx), ctx);
						if (ctx.failFast && ctx.currentErrorCount > errorCount) return false;
					}
				}
				if (this.undeclared === "reject" && !this.declaresKey(k)) {
					if (traversalKind === "Allows") return false;
					ctx.errorFromNodeContext({
						code: "predicate",
						expected: "removed",
						actual: "",
						relativePath: [k],
						meta: this.meta
					});
					if (ctx.failFast) return false;
				}
			}
		}
		if (this.structuralMorph && ctx && !ctx.hasError()) ctx.queueMorphs([this.structuralMorph]);
		return true;
	};
	get defaultable() {
		return this.cacheGetter("defaultable", this.optional?.filter((o) => o.hasDefault()) ?? []);
	}
	declaresKey = (k) => k in this.propsByKey || this.index?.some((n) => n.signature.allows(k)) || this.sequence !== void 0 && $ark.intrinsic.nonNegativeIntegerString.allows(k);
	_compileDeclaresKey(js) {
		const parts = [];
		if (this.props.length) parts.push(`k in ${this.propsByKeyReference}`);
		if (this.index) for (const index of this.index) parts.push(js.invoke(index.signature, {
			kind: "Allows",
			arg: "k"
		}));
		if (this.sequence) parts.push("$ark.intrinsic.nonNegativeIntegerString.allows(k)");
		return parts.join(" || ") || "false";
	}
	get structuralMorph() {
		return this.cacheGetter("structuralMorph", getPossibleMorph(this));
	}
	structuralMorphRef = this.structuralMorph && registeredReference(this.structuralMorph);
	compile(js) {
		if (js.traversalKind === "Apply") js.initializeErrorCount();
		for (const prop of this.props) {
			js.check(prop);
			if (js.traversalKind === "Apply") js.returnIfFailFast();
		}
		if (this.sequence) {
			js.check(this.sequence);
			if (js.traversalKind === "Apply") js.returnIfFailFast();
		}
		if (this.index || this.undeclared === "reject") {
			js.const("keys", "Object.keys(data)");
			js.line("keys.push(...Object.getOwnPropertySymbols(data))");
			js.for("i < keys.length", () => this.compileExhaustiveEntry(js));
		}
		if (js.traversalKind === "Allows") return js.return(true);
		if (this.structuralMorphRef) js.if("ctx && !ctx.hasError()", () => {
			js.line(`ctx.queueMorphs([`);
			precompileMorphs(js, this);
			return js.line("])");
		});
	}
	compileExhaustiveEntry(js) {
		js.const("k", "keys[i]");
		if (this.index) for (const node$1 of this.index) js.if(`${js.invoke(node$1.signature, {
			arg: "k",
			kind: "Allows"
		})}`, () => js.traverseKey("k", "data[k]", node$1.value));
		if (this.undeclared === "reject") js.if(`!(${this._compileDeclaresKey(js)})`, () => {
			if (js.traversalKind === "Allows") return js.return(false);
			return js.line(`ctx.errorFromNodeContext({ code: "predicate", expected: "removed", actual: "", relativePath: [k], meta: ${this.compiledMeta} })`).if("ctx.failFast", () => js.return());
		});
		return js;
	}
	reduceJsonSchema(schema$1, ctx) {
		switch (schema$1.type) {
			case "object": return this.reduceObjectJsonSchema(schema$1, ctx);
			case "array":
				const arraySchema = this.sequence?.reduceJsonSchema(schema$1, ctx) ?? schema$1;
				if (this.props.length || this.index) return ctx.fallback.arrayObject({
					code: "arrayObject",
					base: arraySchema,
					object: this.reduceObjectJsonSchema({ type: "object" }, ctx)
				});
				return arraySchema;
			default: return ToJsonSchema.throwInternalOperandError("structure", schema$1);
		}
	}
	reduceObjectJsonSchema(schema$1, ctx) {
		if (this.props.length) {
			schema$1.properties = {};
			for (const prop of this.props) {
				const valueSchema = prop.value.toJsonSchemaRecurse(ctx);
				if (typeof prop.key === "symbol") {
					ctx.fallback.symbolKey({
						code: "symbolKey",
						base: schema$1,
						key: prop.key,
						value: valueSchema,
						optional: prop.optional
					});
					continue;
				}
				if (prop.hasDefault()) {
					const value$1 = typeof prop.default === "function" ? prop.default() : prop.default;
					valueSchema.default = $ark.intrinsic.jsonData.allows(value$1) ? value$1 : ctx.fallback.defaultValue({
						code: "defaultValue",
						base: valueSchema,
						value: value$1
					});
				}
				schema$1.properties[prop.key] = valueSchema;
			}
			if (this.requiredKeys.length && schema$1.properties) schema$1.required = this.requiredKeys.filter((k) => typeof k === "string" && k in schema$1.properties);
		}
		if (this.index) for (const index of this.index) {
			const valueJsonSchema = index.value.toJsonSchemaRecurse(ctx);
			if (index.signature.equals($ark.intrinsic.string)) {
				schema$1.additionalProperties = valueJsonSchema;
				continue;
			}
			for (const keyBranch of index.signature.branches) {
				if (!keyBranch.extends($ark.intrinsic.string)) {
					schema$1 = ctx.fallback.symbolKey({
						code: "symbolKey",
						base: schema$1,
						key: null,
						value: valueJsonSchema,
						optional: false
					});
					continue;
				}
				let keySchema = { type: "string" };
				if (keyBranch.hasKind("morph")) keySchema = ctx.fallback.morph({
					code: "morph",
					base: keyBranch.rawIn.toJsonSchemaRecurse(ctx),
					out: keyBranch.rawOut.toJsonSchemaRecurse(ctx)
				});
				if (!keyBranch.hasKind("intersection")) return throwInternalError(`Unexpected index branch kind ${keyBranch.kind}.`);
				const { pattern } = keyBranch.inner;
				if (pattern) {
					const keySchemaWithPattern = Object.assign(keySchema, { pattern: pattern[0].rule });
					for (let i = 1; i < pattern.length; i++) keySchema = ctx.fallback.patternIntersection({
						code: "patternIntersection",
						base: keySchemaWithPattern,
						pattern: pattern[i].rule
					});
					schema$1.patternProperties ??= {};
					schema$1.patternProperties[keySchemaWithPattern.pattern] = valueJsonSchema;
				}
			}
		}
		if (this.undeclared && !schema$1.additionalProperties) schema$1.additionalProperties = false;
		return schema$1;
	}
};
const defaultableMorphsCache = {};
const constructStructuralMorphCacheKey = (node$1) => {
	let cacheKey = "";
	for (let i = 0; i < node$1.defaultable.length; i++) cacheKey += node$1.defaultable[i].defaultValueMorphRef;
	if (node$1.sequence?.defaultValueMorphsReference) cacheKey += node$1.sequence?.defaultValueMorphsReference;
	if (node$1.undeclared === "delete") {
		cacheKey += "delete !(";
		if (node$1.required) for (const n of node$1.required) cacheKey += n.compiledKey + " | ";
		if (node$1.optional) for (const n of node$1.optional) cacheKey += n.compiledKey + " | ";
		if (node$1.index) for (const index of node$1.index) cacheKey += index.signature.id + " | ";
		if (node$1.sequence) if (node$1.sequence.maxLength === null) cacheKey += intrinsic.nonNegativeIntegerString.id;
		else for (let i = 0; i < node$1.sequence.tuple.length; i++) cacheKey += i + " | ";
		cacheKey += ")";
	}
	return cacheKey;
};
const getPossibleMorph = (node$1) => {
	const cacheKey = constructStructuralMorphCacheKey(node$1);
	if (!cacheKey) return void 0;
	if (defaultableMorphsCache[cacheKey]) return defaultableMorphsCache[cacheKey];
	const $arkStructuralMorph = (data, ctx) => {
		for (let i = 0; i < node$1.defaultable.length; i++) if (!(node$1.defaultable[i].key in data)) node$1.defaultable[i].defaultValueMorph(data, ctx);
		if (node$1.sequence?.defaultables) for (let i = data.length - node$1.sequence.prefixLength; i < node$1.sequence.defaultables.length; i++) node$1.sequence.defaultValueMorphs[i](data, ctx);
		if (node$1.undeclared === "delete") {
			for (const k in data) if (!node$1.declaresKey(k)) delete data[k];
		}
		return data;
	};
	return defaultableMorphsCache[cacheKey] = $arkStructuralMorph;
};
const precompileMorphs = (js, node$1) => {
	const args = `(data${node$1.defaultable.some((node$2) => node$2.defaultValueMorph.length === 2) || node$1.sequence?.defaultValueMorphs.some((morph) => morph.length === 2) ? ", ctx" : ""})`;
	return js.block(`${args} => `, (js$1) => {
		for (let i = 0; i < node$1.defaultable.length; i++) {
			const { serializedKey, defaultValueMorphRef } = node$1.defaultable[i];
			js$1.if(`!(${serializedKey} in data)`, (js$2) => js$2.line(`${defaultValueMorphRef}${args}`));
		}
		if (node$1.sequence?.defaultables) js$1.for(`i < ${node$1.sequence.defaultables.length}`, (js$2) => js$2.set(`data[i]`, 5), `data.length - ${node$1.sequence.prefixLength}`);
		if (node$1.undeclared === "delete") js$1.forIn("data", (js$2) => js$2.if(`!(${node$1._compileDeclaresKey(js$2)})`, (js$3) => js$3.line(`delete data[k]`)));
		return js$1.return("data");
	});
};
const Structure = {
	implementation,
	Node: StructureNode
};
const indexerToKey = (indexable) => {
	if (hasArkKind(indexable, "root") && indexable.hasKind("unit")) indexable = indexable.unit;
	if (typeof indexable === "number") indexable = `${indexable}`;
	return indexable;
};
const writeNumberIndexMessage = (indexExpression, sequenceExpression) => `${indexExpression} is not allowed as an array index on ${sequenceExpression}. Use the 'nonNegativeIntegerString' keyword instead.`;
/** extract enumerable named props from an index signature */
const normalizeIndex = (signature, value$1, $) => {
	const [enumerableBranches, nonEnumerableBranches] = spliterate(signature.branches, (k) => k.hasKind("unit"));
	if (!enumerableBranches.length) return { index: $.node("index", {
		signature,
		value: value$1
	}) };
	const normalized = {};
	for (const n of enumerableBranches) {
		const prop = $.node("required", {
			key: n.unit,
			value: value$1
		});
		normalized[prop.kind] = append(normalized[prop.kind], prop);
	}
	if (nonEnumerableBranches.length) normalized.index = $.node("index", {
		signature: nonEnumerableBranches,
		value: value$1
	});
	return normalized;
};
const typeKeyToString = (k) => hasArkKind(k, "root") ? k.expression : printable(k);
const writeInvalidKeysMessage = (o, keys) => `Key${keys.length === 1 ? "" : "s"} ${keys.map(typeKeyToString).join(", ")} ${keys.length === 1 ? "does" : "do"} not exist on ${o}`;
const writeDuplicateKeyMessage = (key) => `Duplicate key ${compileSerializedValue(key)}`;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/kinds.js
const nodeImplementationsByKind = {
	...boundImplementationsByKind,
	alias: Alias.implementation,
	domain: Domain.implementation,
	unit: Unit.implementation,
	proto: Proto.implementation,
	union: Union.implementation,
	morph: Morph.implementation,
	intersection: Intersection.implementation,
	divisor: Divisor.implementation,
	pattern: Pattern.implementation,
	predicate: Predicate.implementation,
	required: Required$1.implementation,
	optional: Optional.implementation,
	index: Index.implementation,
	sequence: Sequence.implementation,
	structure: Structure.implementation
};
$ark.defaultConfig = withAlphabetizedKeys(Object.assign(flatMorph(nodeImplementationsByKind, (kind, implementation$22) => [kind, implementation$22.defaults]), {
	jitless: envHasCsp(),
	clone: deepClone,
	onUndeclaredKey: "ignore",
	exactOptionalPropertyTypes: true,
	numberAllowsNaN: false,
	dateAllowsInvalid: false,
	onFail: null,
	keywords: {},
	toJsonSchema: ToJsonSchema.defaultConfig
}));
$ark.resolvedConfig = mergeConfigs($ark.defaultConfig, $ark.config);
const nodeClassesByKind = {
	...boundClassesByKind,
	alias: Alias.Node,
	domain: Domain.Node,
	unit: Unit.Node,
	proto: Proto.Node,
	union: Union.Node,
	morph: Morph.Node,
	intersection: Intersection.Node,
	divisor: Divisor.Node,
	pattern: Pattern.Node,
	predicate: Predicate.Node,
	required: Required$1.Node,
	optional: Optional.Node,
	index: Index.Node,
	sequence: Sequence.Node,
	structure: Structure.Node
};

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/module.js
var RootModule = class extends DynamicBase {
	get [arkKind]() {
		return "module";
	}
};
const bindModule = (module, $) => new RootModule(flatMorph(module, (alias, value$1) => [alias, hasArkKind(value$1, "module") ? bindModule(value$1, $) : $.bindReference(value$1)]));

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/scope.js
const schemaBranchesOf = (schema$1) => isArray(schema$1) ? schema$1 : "branches" in schema$1 && isArray(schema$1.branches) ? schema$1.branches : void 0;
const throwMismatchedNodeRootError = (expected, actual) => throwParseError(`Node of kind ${actual} is not valid as a ${expected} definition`);
const writeDuplicateAliasError = (alias) => `#${alias} duplicates public alias ${alias}`;
const scopesByName = {};
$ark.ambient ??= {};
let rawUnknownUnion;
const rootScopeFnName = "function $";
const precompile = (references) => bindPrecompilation(references, precompileReferences(references));
const bindPrecompilation = (references, precompiler) => {
	const precompilation = precompiler.write(rootScopeFnName, 4);
	const compiledTraversals = precompiler.compile()();
	for (const node$1 of references) {
		if (node$1.precompilation) continue;
		node$1.traverseAllows = compiledTraversals[`${node$1.id}Allows`].bind(compiledTraversals);
		if (node$1.isRoot() && !node$1.allowsRequiresContext) node$1.allows = node$1.traverseAllows;
		node$1.traverseApply = compiledTraversals[`${node$1.id}Apply`].bind(compiledTraversals);
		if (compiledTraversals[`${node$1.id}Optimistic`]) node$1.traverseOptimistic = compiledTraversals[`${node$1.id}Optimistic`].bind(compiledTraversals);
		node$1.precompilation = precompilation;
	}
};
const precompileReferences = (references) => new CompiledFunction().return(references.reduce((js, node$1) => {
	const allowsCompiler = new NodeCompiler({ kind: "Allows" }).indent();
	node$1.compile(allowsCompiler);
	const allowsJs = allowsCompiler.write(`${node$1.id}Allows`);
	const applyCompiler = new NodeCompiler({ kind: "Apply" }).indent();
	node$1.compile(applyCompiler);
	const result = `${js}${allowsJs},\n${applyCompiler.write(`${node$1.id}Apply`)},\n`;
	if (!node$1.hasKind("union")) return result;
	const optimisticCompiler = new NodeCompiler({
		kind: "Allows",
		optimistic: true
	}).indent();
	node$1.compile(optimisticCompiler);
	return `${result}${optimisticCompiler.write(`${node$1.id}Optimistic`)},\n`;
}, "{\n") + "}");
var BaseScope = class {
	config;
	resolvedConfig;
	name;
	get [arkKind]() {
		return "scope";
	}
	referencesById = {};
	references = [];
	resolutions = {};
	exportedNames = [];
	aliases = {};
	resolved = false;
	nodesByHash = {};
	intrinsic;
	constructor(def, config) {
		this.config = mergeConfigs($ark.config, config);
		this.resolvedConfig = mergeConfigs($ark.resolvedConfig, config);
		this.name = this.resolvedConfig.name ?? `anonymousScope${Object.keys(scopesByName).length}`;
		if (this.name in scopesByName) throwParseError(`A Scope already named ${this.name} already exists`);
		scopesByName[this.name] = this;
		const aliasEntries = Object.entries(def).map((entry) => this.preparseOwnAliasEntry(...entry));
		for (const [k, v] of aliasEntries) {
			let name = k;
			if (k[0] === "#") {
				name = k.slice(1);
				if (name in this.aliases) throwParseError(writeDuplicateAliasError(name));
				this.aliases[name] = v;
			} else {
				if (name in this.aliases) throwParseError(writeDuplicateAliasError(k));
				this.aliases[name] = v;
				this.exportedNames.push(name);
			}
			if (!hasArkKind(v, "module") && !hasArkKind(v, "generic") && !isThunk(v)) {
				const preparsed = this.preparseOwnDefinitionFormat(v, { alias: name });
				this.resolutions[name] = hasArkKind(preparsed, "root") ? this.bindReference(preparsed) : this.createParseContext(preparsed).id;
			}
		}
		rawUnknownUnion ??= this.node("union", { branches: [
			"string",
			"number",
			"object",
			"bigint",
			"symbol",
			{ unit: true },
			{ unit: false },
			{ unit: void 0 },
			{ unit: null }
		] }, { prereduced: true });
		this.nodesByHash[rawUnknownUnion.hash] = this.node("intersection", {}, { prereduced: true });
		this.intrinsic = $ark.intrinsic ? flatMorph($ark.intrinsic, (k, v) => k.startsWith("json") ? [] : [k, this.bindReference(v)]) : {};
	}
	cacheGetter(name, value$1) {
		Object.defineProperty(this, name, { value: value$1 });
		return value$1;
	}
	get internal() {
		return this;
	}
	_json;
	get json() {
		if (!this._json) this.export();
		return this._json;
	}
	defineSchema(def) {
		return def;
	}
	generic = (...params) => {
		const $ = this;
		return (def, possibleHkt) => new GenericRoot(params, possibleHkt ? new LazyGenericBody(def) : def, $, $, possibleHkt ?? null);
	};
	units = (values, opts) => {
		const uniqueValues = [];
		for (const value$1 of values) if (!uniqueValues.includes(value$1)) uniqueValues.push(value$1);
		const branches = uniqueValues.map((unit) => this.node("unit", { unit }, opts));
		return this.node("union", branches, {
			...opts,
			prereduced: true
		});
	};
	lazyResolutions = [];
	lazilyResolve(resolve, syntheticAlias) {
		const node$1 = this.node("alias", {
			reference: syntheticAlias ?? "synthetic",
			resolve
		}, { prereduced: true });
		if (!this.resolved) this.lazyResolutions.push(node$1);
		return node$1;
	}
	schema = (schema$1, opts) => this.finalize(this.parseSchema(schema$1, opts));
	parseSchema = (schema$1, opts) => this.node(schemaKindOf(schema$1), schema$1, opts);
	preparseNode(kinds, schema$1, opts) {
		let kind = typeof kinds === "string" ? kinds : schemaKindOf(schema$1, kinds);
		if (isNode(schema$1) && schema$1.kind === kind) return schema$1;
		if (kind === "alias" && !opts?.prereduced) {
			const { reference: reference$1 } = Alias.implementation.normalize(schema$1, this);
			if (reference$1.startsWith("$")) {
				const resolution = this.resolveRoot(reference$1.slice(1));
				schema$1 = resolution;
				kind = resolution.kind;
			}
		} else if (kind === "union" && hasDomain(schema$1, "object")) {
			const branches = schemaBranchesOf(schema$1);
			if (branches?.length === 1) {
				schema$1 = branches[0];
				kind = schemaKindOf(schema$1);
			}
		}
		if (isNode(schema$1) && schema$1.kind === kind) return schema$1;
		const normalizedSchema = nodeImplementationsByKind[kind].normalize?.(schema$1, this) ?? schema$1;
		if (isNode(normalizedSchema)) return normalizedSchema.kind === kind ? normalizedSchema : throwMismatchedNodeRootError(kind, normalizedSchema.kind);
		return {
			...opts,
			$: this,
			kind,
			def: normalizedSchema,
			prefix: opts.alias ?? kind
		};
	}
	bindReference(reference$1) {
		let bound;
		if (isNode(reference$1)) bound = reference$1.$ === this ? reference$1 : new reference$1.constructor(reference$1.attachments, this);
		else bound = reference$1.$ === this ? reference$1 : new GenericRoot(reference$1.params, reference$1.bodyDef, reference$1.$, this, reference$1.hkt);
		if (!this.resolved) Object.assign(this.referencesById, bound.referencesById);
		return bound;
	}
	resolveRoot(name) {
		return this.maybeResolveRoot(name) ?? throwParseError(writeUnresolvableMessage(name));
	}
	maybeResolveRoot(name) {
		const result = this.maybeResolve(name);
		if (hasArkKind(result, "generic")) return;
		return result;
	}
	/** If name is a valid reference to a submodule alias, return its resolution  */
	maybeResolveSubalias(name) {
		return maybeResolveSubalias(this.aliases, name) ?? maybeResolveSubalias(this.ambient, name);
	}
	get ambient() {
		return $ark.ambient;
	}
	maybeResolve(name) {
		const cached$1 = this.resolutions[name];
		if (cached$1) {
			if (typeof cached$1 !== "string") return this.bindReference(cached$1);
			const v = nodesByRegisteredId[cached$1];
			if (hasArkKind(v, "root")) return this.resolutions[name] = v;
			if (hasArkKind(v, "context")) {
				if (v.phase === "resolving") return this.node("alias", { reference: `$${name}` }, { prereduced: true });
				if (v.phase === "resolved") return throwInternalError(`Unexpected resolved context for was uncached by its scope: ${printable(v)}`);
				v.phase = "resolving";
				const node$1 = this.bindReference(this.parseOwnDefinitionFormat(v.def, v));
				v.phase = "resolved";
				nodesByRegisteredId[node$1.id] = node$1;
				nodesByRegisteredId[v.id] = node$1;
				return this.resolutions[name] = node$1;
			}
			return throwInternalError(`Unexpected nodesById entry for ${cached$1}: ${printable(v)}`);
		}
		let def = this.aliases[name] ?? this.ambient?.[name];
		if (!def) return this.maybeResolveSubalias(name);
		def = this.normalizeRootScopeValue(def);
		if (hasArkKind(def, "generic")) return this.resolutions[name] = this.bindReference(def);
		if (hasArkKind(def, "module")) {
			if (!def.root) throwParseError(writeMissingSubmoduleAccessMessage(name));
			return this.resolutions[name] = this.bindReference(def.root);
		}
		return this.resolutions[name] = this.parse(def, { alias: name });
	}
	createParseContext(input) {
		const id = input.id ?? registerNodeId(input.prefix);
		return nodesByRegisteredId[id] = Object.assign(input, {
			[arkKind]: "context",
			$: this,
			id,
			phase: "unresolved"
		});
	}
	traversal(root) {
		return new Traversal(root, this.resolvedConfig);
	}
	import(...names) {
		return new RootModule(flatMorph(this.export(...names), (alias, value$1) => [`#${alias}`, value$1]));
	}
	precompilation;
	_exportedResolutions;
	_exports;
	export(...names) {
		if (!this._exports) {
			this._exports = {};
			for (const name of this.exportedNames) {
				const def = this.aliases[name];
				this._exports[name] = hasArkKind(def, "module") ? bindModule(def, this) : bootstrapAliasReferences(this.maybeResolve(name));
			}
			for (const node$1 of this.lazyResolutions) node$1.resolution;
			this._exportedResolutions = resolutionsOfModule(this, this._exports);
			this._json = resolutionsToJson(this._exportedResolutions);
			Object.assign(this.resolutions, this._exportedResolutions);
			this.references = Object.values(this.referencesById);
			if (!this.resolvedConfig.jitless) {
				const precompiler = precompileReferences(this.references);
				this.precompilation = precompiler.write(rootScopeFnName, 4);
				bindPrecompilation(this.references, precompiler);
			}
			this.resolved = true;
		}
		return new RootModule(flatMorph(names.length ? names : this.exportedNames, (_, name) => [name, this._exports[name]]));
	}
	resolve(name) {
		return this.export()[name];
	}
	node = (kinds, nodeSchema, opts = {}) => {
		const ctxOrNode = this.preparseNode(kinds, nodeSchema, opts);
		if (isNode(ctxOrNode)) return this.bindReference(ctxOrNode);
		const ctx = this.createParseContext(ctxOrNode);
		const node$1 = parseNode(ctx);
		const bound = this.bindReference(node$1);
		return nodesByRegisteredId[ctx.id] = bound;
	};
	parse = (def, opts = {}) => this.finalize(this.parseDefinition(def, opts));
	parseDefinition(def, opts = {}) {
		if (hasArkKind(def, "root")) return this.bindReference(def);
		const ctxInputOrNode = this.preparseOwnDefinitionFormat(def, opts);
		if (hasArkKind(ctxInputOrNode, "root")) return this.bindReference(ctxInputOrNode);
		const ctx = this.createParseContext(ctxInputOrNode);
		nodesByRegisteredId[ctx.id] = ctx;
		let node$1 = this.bindReference(this.parseOwnDefinitionFormat(def, ctx));
		if (node$1.isCyclic) node$1 = withId(node$1, ctx.id);
		nodesByRegisteredId[ctx.id] = node$1;
		return node$1;
	}
	finalize(node$1) {
		bootstrapAliasReferences(node$1);
		if (!node$1.precompilation && !this.resolvedConfig.jitless) precompile(node$1.references);
		return node$1;
	}
};
var SchemaScope = class extends BaseScope {
	parseOwnDefinitionFormat(def, ctx) {
		return parseNode(ctx);
	}
	preparseOwnDefinitionFormat(schema$1, opts) {
		return this.preparseNode(schemaKindOf(schema$1), schema$1, opts);
	}
	preparseOwnAliasEntry(k, v) {
		return [k, v];
	}
	normalizeRootScopeValue(v) {
		return v;
	}
};
const bootstrapAliasReferences = (resolution) => {
	const aliases = resolution.references.filter((node$1) => node$1.hasKind("alias"));
	for (const aliasNode of aliases) {
		Object.assign(aliasNode.referencesById, aliasNode.resolution.referencesById);
		for (const ref of resolution.references) if (aliasNode.id in ref.referencesById) Object.assign(ref.referencesById, aliasNode.referencesById);
	}
	return resolution;
};
const resolutionsToJson = (resolutions) => flatMorph(resolutions, (k, v) => [k, hasArkKind(v, "root") || hasArkKind(v, "generic") ? v.json : hasArkKind(v, "module") ? resolutionsToJson(v) : throwInternalError(`Unexpected resolution ${printable(v)}`)]);
const maybeResolveSubalias = (base, name) => {
	const dotIndex = name.indexOf(".");
	if (dotIndex === -1) return;
	const dotPrefix = name.slice(0, dotIndex);
	const prefixSchema = base[dotPrefix];
	if (prefixSchema === void 0) return;
	if (!hasArkKind(prefixSchema, "module")) return throwParseError(writeNonSubmoduleDotMessage(dotPrefix));
	const subalias = name.slice(dotIndex + 1);
	const resolution = prefixSchema[subalias];
	if (resolution === void 0) return maybeResolveSubalias(prefixSchema, subalias);
	if (hasArkKind(resolution, "root") || hasArkKind(resolution, "generic")) return resolution;
	if (hasArkKind(resolution, "module")) return resolution.root ?? throwParseError(writeMissingSubmoduleAccessMessage(name));
	throwInternalError(`Unexpected resolution for alias '${name}': ${printable(resolution)}`);
};
const schemaScope = (aliases, config) => new SchemaScope(aliases, config);
const rootSchemaScope = new SchemaScope({});
const resolutionsOfModule = ($, typeSet) => {
	const result = {};
	for (const k in typeSet) {
		const v = typeSet[k];
		if (hasArkKind(v, "module")) {
			const prefixedResolutions = flatMorph(resolutionsOfModule($, v), (innerK, innerV) => [`${k}.${innerK}`, innerV]);
			Object.assign(result, prefixedResolutions);
		} else if (hasArkKind(v, "root") || hasArkKind(v, "generic")) result[k] = v;
		else throwInternalError(`Unexpected scope resolution ${printable(v)}`);
	}
	return result;
};
const writeUnresolvableMessage = (token) => `'${token}' is unresolvable`;
const writeNonSubmoduleDotMessage = (name) => `'${name}' must reference a module to be accessed using dot syntax`;
const writeMissingSubmoduleAccessMessage = (name) => `Reference to submodule '${name}' must specify an alias`;
rootSchemaScope.export();
const rootSchema = rootSchemaScope.schema;
const node = rootSchemaScope.node;
const defineSchema = rootSchemaScope.defineSchema;
const genericNode = rootSchemaScope.generic;

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/structure/shared.js
const arrayIndexSource = `^(?:0|[1-9]\\d*)$`;
const arrayIndexMatcher = new RegExp(arrayIndexSource);
const arrayIndexMatcherReference = registeredReference(arrayIndexMatcher);

//#endregion
//#region ../node_modules/.pnpm/@ark+schema@0.53.0/node_modules/@ark/schema/out/intrinsic.js
const intrinsicBases = schemaScope({
	bigint: "bigint",
	boolean: [{ unit: false }, { unit: true }],
	false: { unit: false },
	never: [],
	null: { unit: null },
	number: "number",
	object: "object",
	string: "string",
	symbol: "symbol",
	true: { unit: true },
	unknown: {},
	undefined: { unit: void 0 },
	Array,
	Date
}, { prereducedAliases: true }).export();
$ark.intrinsic = { ...intrinsicBases };
const intrinsicRoots = schemaScope({
	integer: {
		domain: "number",
		divisor: 1
	},
	lengthBoundable: ["string", Array],
	key: ["string", "symbol"],
	nonNegativeIntegerString: {
		domain: "string",
		pattern: arrayIndexSource
	}
}, { prereducedAliases: true }).export();
Object.assign($ark.intrinsic, intrinsicRoots);
const intrinsicJson = schemaScope({
	jsonPrimitive: [
		"string",
		"number",
		{ unit: true },
		{ unit: false },
		{ unit: null }
	],
	jsonObject: {
		domain: "object",
		index: {
			signature: "string",
			value: "$jsonData"
		}
	},
	jsonData: ["$jsonPrimitive", "$jsonObject"]
}, { prereducedAliases: true }).export();
const intrinsic = {
	...intrinsicBases,
	...intrinsicRoots,
	...intrinsicJson,
	emptyStructure: node("structure", {}, { prereduced: true })
};
$ark.intrinsic = { ...intrinsic };

//#endregion
//#region ../node_modules/.pnpm/arkregex@0.0.2/node_modules/arkregex/out/regex.js
const regex$1 = ((src, flags) => new RegExp(src, flags));
Object.assign(regex$1, { as: regex$1 });

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operand/date.js
const isDateLiteral = (value$1) => typeof value$1 === "string" && value$1[0] === "d" && (value$1[1] === "'" || value$1[1] === "\"") && value$1.at(-1) === value$1[1];
const isValidDate = (d) => d.toString() !== "Invalid Date";
const extractDateLiteralSource = (literal) => literal.slice(2, -1);
const writeInvalidDateMessage = (source) => `'${source}' could not be parsed by the Date constructor`;
const tryParseDate = (source, errorOnFail) => maybeParseDate(source, errorOnFail);
const maybeParseDate = (source, errorOnFail) => {
	const stringParsedDate = new Date(source);
	if (isValidDate(stringParsedDate)) return stringParsedDate;
	const epochMillis = tryParseNumber(source);
	if (epochMillis !== void 0) {
		const numberParsedDate = new Date(epochMillis);
		if (isValidDate(numberParsedDate)) return numberParsedDate;
	}
	return errorOnFail ? throwParseError(errorOnFail === true ? writeInvalidDateMessage(source) : errorOnFail) : void 0;
};

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operand/enclosed.js
const parseEnclosed = (s, enclosing) => {
	const enclosed = s.scanner.shiftUntilEscapable(untilLookaheadIsClosing[enclosingTokens[enclosing]]);
	if (s.scanner.lookahead === "") return s.error(writeUnterminatedEnclosedMessage(enclosed, enclosing));
	s.scanner.shift();
	if (enclosing === "/") {
		try {
			new RegExp(enclosed);
		} catch (e) {
			throwParseError(String(e));
		}
		s.root = s.ctx.$.node("intersection", {
			domain: "string",
			pattern: enclosed
		}, { prereduced: true });
	} else if (isKeyOf(enclosing, enclosingQuote)) s.root = s.ctx.$.node("unit", { unit: enclosed });
	else {
		const date = tryParseDate(enclosed, writeInvalidDateMessage(enclosed));
		s.root = s.ctx.$.node("unit", {
			meta: enclosed,
			unit: date
		});
	}
};
const enclosingQuote = {
	"'": 1,
	"\"": 1
};
const enclosingChar = {
	"/": 1,
	"'": 1,
	"\"": 1
};
const enclosingLiteralTokens = {
	"d'": "'",
	"d\"": "\"",
	"'": "'",
	"\"": "\""
};
const enclosingTokens = {
	...enclosingLiteralTokens,
	"/": "/"
};
const untilLookaheadIsClosing = {
	"'": (scanner) => scanner.lookahead === `'`,
	"\"": (scanner) => scanner.lookahead === `"`,
	"/": (scanner) => scanner.lookahead === `/`
};
const enclosingCharDescriptions = {
	"\"": "double-quote",
	"'": "single-quote",
	"/": "forward slash"
};
const writeUnterminatedEnclosedMessage = (fragment, enclosingStart) => `${enclosingStart}${fragment} requires a closing ${enclosingCharDescriptions[enclosingTokens[enclosingStart]]}`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/ast/validate.js
const writePrefixedPrivateReferenceMessage = (name) => `Private type references should not include '#'. Use '${name}' instead.`;
const shallowOptionalMessage = "Optional definitions like 'string?' are only valid as properties in an object or tuple";
const shallowDefaultableMessage = "Defaultable definitions like 'number = 0' are only valid as properties in an object or tuple";

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/tokens.js
const terminatingChars = {
	"<": 1,
	">": 1,
	"=": 1,
	"|": 1,
	"&": 1,
	")": 1,
	"[": 1,
	"%": 1,
	",": 1,
	":": 1,
	"?": 1,
	"#": 1,
	...whitespaceChars
};
const lookaheadIsFinalizing = (lookahead, unscanned) => lookahead === ">" ? unscanned[0] === "=" ? unscanned[1] === "=" : unscanned.trimStart() === "" || isKeyOf(unscanned.trimStart()[0], terminatingChars) : lookahead === "=" ? unscanned[0] !== "=" : lookahead === "," || lookahead === "?";

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operand/genericArgs.js
const parseGenericArgs = (name, g, s) => _parseGenericArgs(name, g, s, []);
const _parseGenericArgs = (name, g, s, argNodes) => {
	const argState = s.parseUntilFinalizer();
	argNodes.push(argState.root);
	if (argState.finalizer === ">") {
		if (argNodes.length !== g.params.length) return s.error(writeInvalidGenericArgCountMessage(name, g.names, argNodes.map((arg) => arg.expression)));
		return argNodes;
	}
	if (argState.finalizer === ",") return _parseGenericArgs(name, g, s, argNodes);
	return argState.error(writeUnclosedGroupMessage(">"));
};
const writeInvalidGenericArgCountMessage = (name, params, argDefs) => `${name}<${params.join(", ")}> requires exactly ${params.length} args (got ${argDefs.length}${argDefs.length === 0 ? "" : `: ${argDefs.join(", ")}`})`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operand/unenclosed.js
const parseUnenclosed = (s) => {
	const token = s.scanner.shiftUntilLookahead(terminatingChars);
	if (token === "keyof") s.addPrefix("keyof");
	else s.root = unenclosedToNode(s, token);
};
const parseGenericInstantiation = (name, g, s) => {
	s.scanner.shiftUntilNonWhitespace();
	if (s.scanner.shift() !== "<") return s.error(writeInvalidGenericArgCountMessage(name, g.names, []));
	return g(...parseGenericArgs(name, g, s));
};
const unenclosedToNode = (s, token) => maybeParseReference(s, token) ?? maybeParseUnenclosedLiteral(s, token) ?? s.error(token === "" ? s.scanner.lookahead === "#" ? writePrefixedPrivateReferenceMessage(s.shiftedByOne().scanner.shiftUntilLookahead(terminatingChars)) : writeMissingOperandMessage(s) : writeUnresolvableMessage(token));
const maybeParseReference = (s, token) => {
	if (s.ctx.args?.[token]) {
		const arg = s.ctx.args[token];
		if (typeof arg !== "string") return arg;
		return s.ctx.$.node("alias", { reference: arg }, { prereduced: true });
	}
	const resolution = s.ctx.$.maybeResolve(token);
	if (hasArkKind(resolution, "root")) return resolution;
	if (resolution === void 0) return;
	if (hasArkKind(resolution, "generic")) return parseGenericInstantiation(token, resolution, s);
	return throwParseError(`Unexpected resolution ${printable(resolution)}`);
};
const maybeParseUnenclosedLiteral = (s, token) => {
	const maybeNumber = tryParseWellFormedNumber(token);
	if (maybeNumber !== void 0) return s.ctx.$.node("unit", { unit: maybeNumber });
	const maybeBigint = tryParseWellFormedBigint(token);
	if (maybeBigint !== void 0) return s.ctx.$.node("unit", { unit: maybeBigint });
};
const writeMissingOperandMessage = (s) => {
	const operator = s.previousOperator();
	return operator ? writeMissingRightOperandMessage(operator, s.scanner.unscanned) : writeExpressionExpectedMessage(s.scanner.unscanned);
};
const writeMissingRightOperandMessage = (token, unscanned = "") => `Token '${token}' requires a right operand${unscanned ? ` before '${unscanned}'` : ""}`;
const writeExpressionExpectedMessage = (unscanned) => `Expected an expression${unscanned ? ` before '${unscanned}'` : ""}`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operand/operand.js
const parseOperand = (s) => s.scanner.lookahead === "" ? s.error(writeMissingOperandMessage(s)) : s.scanner.lookahead === "(" ? s.shiftedByOne().reduceGroupOpen() : s.scanner.lookaheadIsIn(enclosingChar) ? parseEnclosed(s, s.scanner.shift()) : s.scanner.lookaheadIsIn(whitespaceChars) ? parseOperand(s.shiftedByOne()) : s.scanner.lookahead === "d" ? s.scanner.nextLookahead in enclosingQuote ? parseEnclosed(s, `${s.scanner.shift()}${s.scanner.shift()}`) : parseUnenclosed(s) : parseUnenclosed(s);

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/reduce/shared.js
const minComparators = {
	">": true,
	">=": true
};
const maxComparators = {
	"<": true,
	"<=": true
};
const invertedComparators = {
	"<": ">",
	">": "<",
	"<=": ">=",
	">=": "<=",
	"==": "=="
};
const writeOpenRangeMessage = (min, comparator) => `Left bounds are only valid when paired with right bounds (try ...${comparator}${min})`;
const writeUnpairableComparatorMessage = (comparator) => `Left-bounded expressions must specify their limits using < or <= (was ${comparator})`;
const writeMultipleLeftBoundsMessage = (openLimit, openComparator, limit, comparator) => `An expression may have at most one left bound (parsed ${openLimit}${invertedComparators[openComparator]}, ${limit}${invertedComparators[comparator]})`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operator/bounds.js
const parseBound = (s, start) => {
	const comparator = shiftComparator(s, start);
	if (s.root.hasKind("unit")) {
		if (typeof s.root.unit === "number") {
			s.reduceLeftBound(s.root.unit, comparator);
			s.unsetRoot();
			return;
		}
		if (s.root.unit instanceof Date) {
			const literal = `d'${s.root.description ?? s.root.unit.toISOString()}'`;
			s.unsetRoot();
			s.reduceLeftBound(literal, comparator);
			return;
		}
	}
	return parseRightBound(s, comparator);
};
const comparatorStartChars = {
	"<": 1,
	">": 1,
	"=": 1
};
const shiftComparator = (s, start) => s.scanner.lookaheadIs("=") ? `${start}${s.scanner.shift()}` : start;
const getBoundKinds = (comparator, limit, root, boundKind) => {
	if (root.extends($ark.intrinsic.number)) {
		if (typeof limit !== "number") return throwParseError(writeInvalidLimitMessage(comparator, limit, boundKind));
		return comparator === "==" ? ["min", "max"] : comparator[0] === ">" ? ["min"] : ["max"];
	}
	if (root.extends($ark.intrinsic.lengthBoundable)) {
		if (typeof limit !== "number") return throwParseError(writeInvalidLimitMessage(comparator, limit, boundKind));
		return comparator === "==" ? ["exactLength"] : comparator[0] === ">" ? ["minLength"] : ["maxLength"];
	}
	if (root.extends($ark.intrinsic.Date)) return comparator === "==" ? ["after", "before"] : comparator[0] === ">" ? ["after"] : ["before"];
	return throwParseError(writeUnboundableMessage(root.expression));
};
const openLeftBoundToRoot = (leftBound) => ({
	rule: isDateLiteral(leftBound.limit) ? extractDateLiteralSource(leftBound.limit) : leftBound.limit,
	exclusive: leftBound.comparator.length === 1
});
const parseRightBound = (s, comparator) => {
	const previousRoot = s.unsetRoot();
	const previousScannerIndex = s.scanner.location;
	s.parseOperand();
	const limitNode = s.unsetRoot();
	const limitToken = s.scanner.sliceChars(previousScannerIndex, s.scanner.location);
	s.root = previousRoot;
	if (!limitNode.hasKind("unit") || typeof limitNode.unit !== "number" && !(limitNode.unit instanceof Date)) return s.error(writeInvalidLimitMessage(comparator, limitToken, "right"));
	const limit = limitNode.unit;
	const exclusive = comparator.length === 1;
	const boundKinds = getBoundKinds(comparator, typeof limit === "number" ? limit : limitToken, previousRoot, "right");
	for (const kind of boundKinds) s.constrainRoot(kind, comparator === "==" ? { rule: limit } : {
		rule: limit,
		exclusive
	});
	if (!s.branches.leftBound) return;
	if (!isKeyOf(comparator, maxComparators)) return s.error(writeUnpairableComparatorMessage(comparator));
	const lowerBoundKind = getBoundKinds(s.branches.leftBound.comparator, s.branches.leftBound.limit, previousRoot, "left");
	s.constrainRoot(lowerBoundKind[0], openLeftBoundToRoot(s.branches.leftBound));
	s.branches.leftBound = null;
};
const writeInvalidLimitMessage = (comparator, limit, boundKind) => `Comparator ${boundKind === "left" ? invertedComparators[comparator] : comparator} must be ${boundKind === "left" ? "preceded" : "followed"} by a corresponding literal (was ${limit})`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operator/brand.js
const parseBrand = (s) => {
	s.scanner.shiftUntilNonWhitespace();
	const brandName = s.scanner.shiftUntilLookahead(terminatingChars);
	s.root = s.root.brand(brandName);
};

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operator/divisor.js
const parseDivisor = (s) => {
	s.scanner.shiftUntilNonWhitespace();
	const divisorToken = s.scanner.shiftUntilLookahead(terminatingChars);
	const divisor = tryParseInteger(divisorToken, { errorOnFail: writeInvalidDivisorMessage(divisorToken) });
	if (divisor === 0) s.error(writeInvalidDivisorMessage(0));
	s.root = s.root.constrain("divisor", divisor);
};
const writeInvalidDivisorMessage = (divisor) => `% operator must be followed by a non-zero integer literal (was ${divisor})`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operator/operator.js
const parseOperator = (s) => {
	const lookahead = s.scanner.shift();
	return lookahead === "" ? s.finalize("") : lookahead === "[" ? s.scanner.shift() === "]" ? s.setRoot(s.root.array()) : s.error(incompleteArrayTokenMessage) : lookahead === "|" ? s.scanner.lookahead === ">" ? s.shiftedByOne().pushRootToBranch("|>") : s.pushRootToBranch(lookahead) : lookahead === "&" ? s.pushRootToBranch(lookahead) : lookahead === ")" ? s.finalizeGroup() : lookaheadIsFinalizing(lookahead, s.scanner.unscanned) ? s.finalize(lookahead) : isKeyOf(lookahead, comparatorStartChars) ? parseBound(s, lookahead) : lookahead === "%" ? parseDivisor(s) : lookahead === "#" ? parseBrand(s) : lookahead in whitespaceChars ? parseOperator(s) : s.error(writeUnexpectedCharacterMessage(lookahead));
};
const writeUnexpectedCharacterMessage = (char, shouldBe = "") => `'${char}' is not allowed here${shouldBe && ` (should be ${shouldBe})`}`;
const incompleteArrayTokenMessage = `Missing expected ']'`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/shift/operator/default.js
const parseDefault = (s) => {
	const baseNode = s.unsetRoot();
	s.parseOperand();
	const defaultNode = s.unsetRoot();
	if (!defaultNode.hasKind("unit")) return s.error(writeNonLiteralDefaultMessage(defaultNode.expression));
	return [
		baseNode,
		"=",
		defaultNode.unit instanceof Date ? () => new Date(defaultNode.unit) : defaultNode.unit
	];
};
const writeNonLiteralDefaultMessage = (defaultDef) => `Default value '${defaultDef}' must be a literal value`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/string.js
const parseString = (def, ctx) => {
	const aliasResolution = ctx.$.maybeResolveRoot(def);
	if (aliasResolution) return aliasResolution;
	if (def.endsWith("[]")) {
		const possibleElementResolution = ctx.$.maybeResolveRoot(def.slice(0, -2));
		if (possibleElementResolution) return possibleElementResolution.array();
	}
	const s = new RuntimeState(new Scanner(def), ctx);
	const node$1 = fullStringParse(s);
	if (s.finalizer === ">") throwParseError(writeUnexpectedCharacterMessage(">"));
	return node$1;
};
const fullStringParse = (s) => {
	s.parseOperand();
	let result = parseUntilFinalizer(s).root;
	if (!result) return throwInternalError(`Root was unexpectedly unset after parsing string '${s.scanner.scanned}'`);
	if (s.finalizer === "=") result = parseDefault(s);
	else if (s.finalizer === "?") result = [result, "?"];
	s.scanner.shiftUntilNonWhitespace();
	if (s.scanner.lookahead) throwParseError(writeUnexpectedCharacterMessage(s.scanner.lookahead));
	return result;
};
const parseUntilFinalizer = (s) => {
	while (s.finalizer === void 0) next(s);
	return s;
};
const next = (s) => s.hasRoot() ? s.parseOperator() : s.parseOperand();

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/reduce/dynamic.js
var RuntimeState = class RuntimeState {
	root;
	branches = {
		prefixes: [],
		leftBound: null,
		intersection: null,
		union: null,
		pipe: null
	};
	finalizer;
	groups = [];
	scanner;
	ctx;
	constructor(scanner, ctx) {
		this.scanner = scanner;
		this.ctx = ctx;
	}
	error(message) {
		return throwParseError(message);
	}
	hasRoot() {
		return this.root !== void 0;
	}
	setRoot(root) {
		this.root = root;
	}
	unsetRoot() {
		const value$1 = this.root;
		this.root = void 0;
		return value$1;
	}
	constrainRoot(...args) {
		this.root = this.root.constrain(args[0], args[1]);
	}
	finalize(finalizer) {
		if (this.groups.length) return this.error(writeUnclosedGroupMessage(")"));
		this.finalizeBranches();
		this.finalizer = finalizer;
	}
	reduceLeftBound(limit, comparator) {
		const invertedComparator = invertedComparators[comparator];
		if (!isKeyOf(invertedComparator, minComparators)) return this.error(writeUnpairableComparatorMessage(comparator));
		if (this.branches.leftBound) return this.error(writeMultipleLeftBoundsMessage(this.branches.leftBound.limit, this.branches.leftBound.comparator, limit, invertedComparator));
		this.branches.leftBound = {
			comparator: invertedComparator,
			limit
		};
	}
	finalizeBranches() {
		this.assertRangeUnset();
		if (this.branches.pipe) {
			this.pushRootToBranch("|>");
			this.root = this.branches.pipe;
			return;
		}
		if (this.branches.union) {
			this.pushRootToBranch("|");
			this.root = this.branches.union;
			return;
		}
		if (this.branches.intersection) {
			this.pushRootToBranch("&");
			this.root = this.branches.intersection;
			return;
		}
		this.applyPrefixes();
	}
	finalizeGroup() {
		this.finalizeBranches();
		const topBranchState = this.groups.pop();
		if (!topBranchState) return this.error(writeUnmatchedGroupCloseMessage(")", this.scanner.unscanned));
		this.branches = topBranchState;
	}
	addPrefix(prefix) {
		this.branches.prefixes.push(prefix);
	}
	applyPrefixes() {
		while (this.branches.prefixes.length) {
			const lastPrefix = this.branches.prefixes.pop();
			this.root = lastPrefix === "keyof" ? this.root.keyof() : throwInternalError(`Unexpected prefix '${lastPrefix}'`);
		}
	}
	pushRootToBranch(token) {
		this.assertRangeUnset();
		this.applyPrefixes();
		const root = this.root;
		this.root = void 0;
		this.branches.intersection = this.branches.intersection?.rawAnd(root) ?? root;
		if (token === "&") return;
		this.branches.union = this.branches.union?.rawOr(this.branches.intersection) ?? this.branches.intersection;
		this.branches.intersection = null;
		if (token === "|") return;
		this.branches.pipe = this.branches.pipe?.rawPipeOnce(this.branches.union) ?? this.branches.union;
		this.branches.union = null;
	}
	parseUntilFinalizer() {
		return parseUntilFinalizer(new RuntimeState(this.scanner, this.ctx));
	}
	parseOperator() {
		return parseOperator(this);
	}
	parseOperand() {
		return parseOperand(this);
	}
	assertRangeUnset() {
		if (this.branches.leftBound) return this.error(writeOpenRangeMessage(this.branches.leftBound.limit, this.branches.leftBound.comparator));
	}
	reduceGroupOpen() {
		this.groups.push(this.branches);
		this.branches = {
			prefixes: [],
			leftBound: null,
			union: null,
			intersection: null,
			pipe: null
		};
	}
	previousOperator() {
		return this.branches.leftBound?.comparator ?? this.branches.prefixes.at(-1) ?? (this.branches.intersection ? "&" : this.branches.union ? "|" : this.branches.pipe ? "|>" : void 0);
	}
	shiftedByOne() {
		this.scanner.shift();
		return this;
	}
};

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/generic.js
const emptyGenericParameterMessage = "An empty string is not a valid generic parameter name";
const parseGenericParamName = (scanner, result, ctx) => {
	scanner.shiftUntilNonWhitespace();
	const name = scanner.shiftUntilLookahead(terminatingChars);
	if (name === "") {
		if (scanner.lookahead === "" && result.length) return result;
		return throwParseError(emptyGenericParameterMessage);
	}
	scanner.shiftUntilNonWhitespace();
	return _parseOptionalConstraint(scanner, name, result, ctx);
};
const extendsToken = "extends ";
const _parseOptionalConstraint = (scanner, name, result, ctx) => {
	scanner.shiftUntilNonWhitespace();
	if (scanner.unscanned.startsWith(extendsToken)) scanner.jumpForward(8);
	else {
		if (scanner.lookahead === ",") scanner.shift();
		result.push(name);
		return parseGenericParamName(scanner, result, ctx);
	}
	const s = parseUntilFinalizer(new RuntimeState(scanner, ctx));
	result.push([name, s.root]);
	return parseGenericParamName(scanner, result, ctx);
};

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/fn.js
var InternalFnParser = class extends Callable {
	constructor($) {
		const attach = {
			$,
			raw: $.fn
		};
		super((...signature) => {
			const returnOperatorIndex = signature.indexOf(":");
			const lastParamIndex = returnOperatorIndex === -1 ? signature.length - 1 : returnOperatorIndex - 1;
			const paramDefs = signature.slice(0, lastParamIndex + 1);
			const paramTuple = $.parse(paramDefs).assertHasKind("intersection");
			let returnType = $.intrinsic.unknown;
			if (returnOperatorIndex !== -1) {
				if (returnOperatorIndex !== signature.length - 2) return throwParseError(badFnReturnTypeMessage);
				returnType = $.parse(signature[returnOperatorIndex + 1]);
			}
			return (impl) => new InternalTypedFn(impl, paramTuple, returnType);
		}, { attach });
	}
};
var InternalTypedFn = class extends Callable {
	raw;
	params;
	returns;
	expression;
	constructor(raw, params, returns) {
		const typedName = `typed ${raw.name}`;
		const typed = { [typedName]: (...args) => {
			const returned = raw(...params.assert(args));
			return returns.assert(returned);
		} }[typedName];
		super(typed);
		this.raw = raw;
		this.params = params;
		this.returns = returns;
		let argsExpression = params.expression;
		if (argsExpression[0] === "[" && argsExpression.at(-1) === "]") argsExpression = argsExpression.slice(1, -1);
		else if (argsExpression.endsWith("[]")) argsExpression = `...${argsExpression}`;
		this.expression = `(${argsExpression}) => ${returns?.expression ?? "unknown"}`;
	}
};
const badFnReturnTypeMessage = `":" must be followed by exactly one return type e.g:
fn("string", ":", "number")(s => s.length)`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/match.js
var InternalMatchParser = class extends Callable {
	$;
	constructor($) {
		super((...args) => new InternalChainedMatchParser($)(...args), { bind: $ });
		this.$ = $;
	}
	in(def) {
		return new InternalChainedMatchParser(this.$, def === void 0 ? void 0 : this.$.parse(def));
	}
	at(key, cases) {
		return new InternalChainedMatchParser(this.$).at(key, cases);
	}
	case(when, then) {
		return new InternalChainedMatchParser(this.$).case(when, then);
	}
};
var InternalChainedMatchParser = class extends Callable {
	$;
	in;
	key;
	branches = [];
	constructor($, In) {
		super((cases) => this.caseEntries(Object.entries(cases).map(([k, v]) => k === "default" ? [k, v] : [this.$.parse(k), v])));
		this.$ = $;
		this.in = In;
	}
	at(key, cases) {
		if (this.key) throwParseError(doubleAtMessage);
		if (this.branches.length) throwParseError(chainedAtMessage);
		this.key = key;
		return cases ? this.match(cases) : this;
	}
	case(def, resolver) {
		return this.caseEntry(this.$.parse(def), resolver);
	}
	caseEntry(node$1, resolver) {
		const branch = (this.key ? this.$.parse({ [this.key]: node$1 }) : node$1).pipe(resolver);
		this.branches.push(branch);
		return this;
	}
	match(cases) {
		return this(cases);
	}
	strings(cases) {
		return this.caseEntries(Object.entries(cases).map(([k, v]) => k === "default" ? [k, v] : [this.$.node("unit", { unit: k }), v]));
	}
	caseEntries(entries) {
		for (let i = 0; i < entries.length; i++) {
			const [k, v] = entries[i];
			if (k === "default") {
				if (i !== entries.length - 1) throwParseError(`default may only be specified as the last key of a switch definition`);
				return this.default(v);
			}
			if (typeof v !== "function") return throwParseError(`Value for case "${k}" must be a function (was ${domainOf(v)})`);
			this.caseEntry(k, v);
		}
		return this;
	}
	default(defaultCase) {
		if (typeof defaultCase === "function") this.case(intrinsic.unknown, defaultCase);
		const schema$1 = {
			branches: this.branches,
			ordered: true
		};
		if (defaultCase === "never" || defaultCase === "assert") schema$1.meta = { onFail: throwOnDefault };
		const cases = this.$.node("union", schema$1);
		if (!this.in) return this.$.finalize(cases);
		let inputValidatedCases = this.in.pipe(cases);
		if (defaultCase === "never" || defaultCase === "assert") inputValidatedCases = inputValidatedCases.configureReferences({ onFail: throwOnDefault }, "self");
		return this.$.finalize(inputValidatedCases);
	}
};
const throwOnDefault = (errors) => errors.throw();
const chainedAtMessage = `A key matcher must be specified before the first case i.e. match.at('foo') or match.in<object>().at('bar')`;
const doubleAtMessage = `At most one key matcher may be specified per expression`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/property.js
const parseProperty = (def, ctx) => {
	if (isArray(def)) {
		if (def[1] === "=") return [
			ctx.$.parseOwnDefinitionFormat(def[0], ctx),
			"=",
			def[2]
		];
		if (def[1] === "?") return [ctx.$.parseOwnDefinitionFormat(def[0], ctx), "?"];
	}
	return parseInnerDefinition(def, ctx);
};
const invalidOptionalKeyKindMessage = `Only required keys may make their values optional, e.g. { [mySymbol]: ['number', '?'] }`;
const invalidDefaultableKeyKindMessage = `Only required keys may specify default values, e.g. { value: 'number = 0' }`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/objectLiteral.js
const parseObjectLiteral = (def, ctx) => {
	let spread;
	const structure = {};
	const defEntries = stringAndSymbolicEntriesOf(def);
	for (const [k, v] of defEntries) {
		const parsedKey = preparseKey(k);
		if (parsedKey.kind === "spread") {
			if (!isEmptyObject(structure)) return throwParseError(nonLeadingSpreadError);
			const operand = ctx.$.parseOwnDefinitionFormat(v, ctx);
			if (operand.equals(intrinsic.object)) continue;
			if (!operand.hasKind("intersection") || !operand.basis?.equals(intrinsic.object)) return throwParseError(writeInvalidSpreadTypeMessage(operand.expression));
			spread = operand.structure;
			continue;
		}
		if (parsedKey.kind === "undeclared") {
			if (v !== "reject" && v !== "delete" && v !== "ignore") throwParseError(writeInvalidUndeclaredBehaviorMessage(v));
			structure.undeclared = v;
			continue;
		}
		const parsedValue = parseProperty(v, ctx);
		const parsedEntryKey = parsedKey;
		if (parsedKey.kind === "required") {
			if (!isArray(parsedValue)) appendNamedProp(structure, "required", {
				key: parsedKey.normalized,
				value: parsedValue
			}, ctx);
			else appendNamedProp(structure, "optional", parsedValue[1] === "=" ? {
				key: parsedKey.normalized,
				value: parsedValue[0],
				default: parsedValue[2]
			} : {
				key: parsedKey.normalized,
				value: parsedValue[0]
			}, ctx);
			continue;
		}
		if (isArray(parsedValue)) {
			if (parsedValue[1] === "?") throwParseError(invalidOptionalKeyKindMessage);
			if (parsedValue[1] === "=") throwParseError(invalidDefaultableKeyKindMessage);
		}
		if (parsedKey.kind === "optional") {
			appendNamedProp(structure, "optional", {
				key: parsedKey.normalized,
				value: parsedValue
			}, ctx);
			continue;
		}
		const normalized = normalizeIndex(ctx.$.parseOwnDefinitionFormat(parsedEntryKey.normalized, ctx), parsedValue, ctx.$);
		if (normalized.index) structure.index = append(structure.index, normalized.index);
		if (normalized.required) structure.required = append(structure.required, normalized.required);
	}
	const structureNode = ctx.$.node("structure", structure);
	return ctx.$.parseSchema({
		domain: "object",
		structure: spread?.merge(structureNode) ?? structureNode
	});
};
const appendNamedProp = (structure, kind, inner, ctx) => {
	structure[kind] = append(structure[kind], ctx.$.node(kind, inner));
};
const writeInvalidUndeclaredBehaviorMessage = (actual) => `Value of '+' key must be 'reject', 'delete', or 'ignore' (was ${printable(actual)})`;
const nonLeadingSpreadError = "Spread operator may only be used as the first key in an object";
const preparseKey = (key) => typeof key === "symbol" ? {
	kind: "required",
	normalized: key
} : key.at(-1) === "?" ? key.at(-2) === Backslash ? {
	kind: "required",
	normalized: `${key.slice(0, -2)}?`
} : {
	kind: "optional",
	normalized: key.slice(0, -1)
} : key[0] === "[" && key.at(-1) === "]" ? {
	kind: "index",
	normalized: key.slice(1, -1)
} : key[0] === Backslash && key[1] === "[" && key.at(-1) === "]" ? {
	kind: "required",
	normalized: key.slice(1)
} : key === "..." ? { kind: "spread" } : key === "+" ? { kind: "undeclared" } : {
	kind: "required",
	normalized: key === "\\..." ? "..." : key === "\\+" ? "+" : key
};
const writeInvalidSpreadTypeMessage = (def) => `Spread operand must resolve to an object literal type (was ${def})`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/tupleExpressions.js
const maybeParseTupleExpression = (def, ctx) => isIndexZeroExpression(def) ? indexZeroParsers[def[0]](def, ctx) : isIndexOneExpression(def) ? indexOneParsers[def[1]](def, ctx) : null;
const parseKeyOfTuple = (def, ctx) => ctx.$.parseOwnDefinitionFormat(def[1], ctx).keyof();
const parseBranchTuple = (def, ctx) => {
	if (def[2] === void 0) return throwParseError(writeMissingRightOperandMessage(def[1], ""));
	const l = ctx.$.parseOwnDefinitionFormat(def[0], ctx);
	const r = ctx.$.parseOwnDefinitionFormat(def[2], ctx);
	if (def[1] === "|") return ctx.$.node("union", { branches: [l, r] });
	const result = def[1] === "&" ? intersectNodesRoot(l, r, ctx.$) : pipeNodesRoot(l, r, ctx.$);
	if (result instanceof Disjoint) return result.throw();
	return result;
};
const parseArrayTuple = (def, ctx) => ctx.$.parseOwnDefinitionFormat(def[0], ctx).array();
const parseMorphTuple = (def, ctx) => {
	if (typeof def[2] !== "function") return throwParseError(writeMalformedFunctionalExpressionMessage("=>", def[2]));
	return ctx.$.parseOwnDefinitionFormat(def[0], ctx).pipe(def[2]);
};
const writeMalformedFunctionalExpressionMessage = (operator, value$1) => `${operator === ":" ? "Narrow" : "Morph"} expression requires a function following '${operator}' (was ${typeof value$1})`;
const parseNarrowTuple = (def, ctx) => {
	if (typeof def[2] !== "function") return throwParseError(writeMalformedFunctionalExpressionMessage(":", def[2]));
	return ctx.$.parseOwnDefinitionFormat(def[0], ctx).constrain("predicate", def[2]);
};
const parseMetaTuple = (def, ctx) => ctx.$.parseOwnDefinitionFormat(def[0], ctx).configure(def[2], def[3]);
const defineIndexOneParsers = (parsers) => parsers;
const postfixParsers = defineIndexOneParsers({
	"[]": parseArrayTuple,
	"?": () => throwParseError(shallowOptionalMessage)
});
const infixParsers = defineIndexOneParsers({
	"|": parseBranchTuple,
	"&": parseBranchTuple,
	":": parseNarrowTuple,
	"=>": parseMorphTuple,
	"|>": parseBranchTuple,
	"@": parseMetaTuple,
	"=": () => throwParseError(shallowDefaultableMessage)
});
const indexOneParsers = {
	...postfixParsers,
	...infixParsers
};
const isIndexOneExpression = (def) => indexOneParsers[def[1]] !== void 0;
const defineIndexZeroParsers = (parsers) => parsers;
const indexZeroParsers = defineIndexZeroParsers({
	keyof: parseKeyOfTuple,
	instanceof: (def, ctx) => {
		if (typeof def[1] !== "function") return throwParseError(writeInvalidConstructorMessage(objectKindOrDomainOf(def[1])));
		const branches = def.slice(1).map((ctor) => typeof ctor === "function" ? ctx.$.node("proto", { proto: ctor }) : throwParseError(writeInvalidConstructorMessage(objectKindOrDomainOf(ctor))));
		return branches.length === 1 ? branches[0] : ctx.$.node("union", { branches });
	},
	"===": (def, ctx) => ctx.$.units(def.slice(1))
});
const isIndexZeroExpression = (def) => indexZeroParsers[def[0]] !== void 0;
const writeInvalidConstructorMessage = (actual) => `Expected a constructor following 'instanceof' operator (was ${actual})`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/tupleLiteral.js
const parseTupleLiteral = (def, ctx) => {
	let sequences = [{}];
	let i = 0;
	while (i < def.length) {
		let spread = false;
		if (def[i] === "..." && i < def.length - 1) {
			spread = true;
			i++;
		}
		const parsedProperty = parseProperty(def[i], ctx);
		const [valueNode, operator, possibleDefaultValue] = !isArray(parsedProperty) ? [parsedProperty] : parsedProperty;
		i++;
		if (spread) {
			if (!valueNode.extends($ark.intrinsic.Array)) return throwParseError(writeNonArraySpreadMessage(valueNode.expression));
			sequences = sequences.flatMap((base) => valueNode.distribute((branch) => appendSpreadBranch(makeRootAndArrayPropertiesMutable(base), branch)));
		} else sequences = sequences.map((base) => {
			if (operator === "?") return appendOptionalElement(base, valueNode);
			if (operator === "=") return appendDefaultableElement(base, valueNode, possibleDefaultValue);
			return appendRequiredElement(base, valueNode);
		});
	}
	return ctx.$.parseSchema(sequences.map((sequence) => isEmptyObject(sequence) ? {
		proto: Array,
		exactLength: 0
	} : {
		proto: Array,
		sequence
	}));
};
const appendRequiredElement = (base, element) => {
	if (base.defaultables || base.optionals) return throwParseError(base.variadic ? postfixAfterOptionalOrDefaultableMessage : requiredPostOptionalMessage);
	if (base.variadic) base.postfix = append(base.postfix, element);
	else base.prefix = append(base.prefix, element);
	return base;
};
const appendOptionalElement = (base, element) => {
	if (base.variadic) return throwParseError(optionalOrDefaultableAfterVariadicMessage);
	base.optionals = append(base.optionals, element);
	return base;
};
const appendDefaultableElement = (base, element, value$1) => {
	if (base.variadic) return throwParseError(optionalOrDefaultableAfterVariadicMessage);
	if (base.optionals) return throwParseError(defaultablePostOptionalMessage);
	base.defaultables = append(base.defaultables, [[element, value$1]]);
	return base;
};
const appendVariadicElement = (base, element) => {
	if (base.postfix) throwParseError(multipleVariadicMesage);
	if (base.variadic) {
		if (!base.variadic.equals(element)) throwParseError(multipleVariadicMesage);
	} else base.variadic = element.internal;
	return base;
};
const appendSpreadBranch = (base, branch) => {
	const spread = branch.select({
		method: "find",
		kind: "sequence"
	});
	if (!spread) return appendVariadicElement(base, $ark.intrinsic.unknown);
	if (spread.prefix) for (const node$1 of spread.prefix) appendRequiredElement(base, node$1);
	if (spread.optionals) for (const node$1 of spread.optionals) appendOptionalElement(base, node$1);
	if (spread.variadic) appendVariadicElement(base, spread.variadic);
	if (spread.postfix) for (const node$1 of spread.postfix) appendRequiredElement(base, node$1);
	return base;
};
const writeNonArraySpreadMessage = (operand) => `Spread element must be an array (was ${operand})`;
const multipleVariadicMesage = "A tuple may have at most one variadic element";
const requiredPostOptionalMessage = "A required element may not follow an optional element";
const optionalOrDefaultableAfterVariadicMessage = "An optional element may not follow a variadic element";
const defaultablePostOptionalMessage = "A defaultable element may not follow an optional element without a default";

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/parser/definition.js
const parseCache = {};
const parseInnerDefinition = (def, ctx) => {
	if (typeof def === "string") {
		if (ctx.args && Object.keys(ctx.args).some((k) => def.includes(k))) return parseString(def, ctx);
		const scopeCache = parseCache[ctx.$.name] ??= {};
		return scopeCache[def] ??= parseString(def, ctx);
	}
	return hasDomain(def, "object") ? parseObject(def, ctx) : throwParseError(writeBadDefinitionTypeMessage(domainOf(def)));
};
const parseObject = (def, ctx) => {
	const objectKind = objectKindOf(def);
	switch (objectKind) {
		case void 0:
			if (hasArkKind(def, "root")) return def;
			return parseObjectLiteral(def, ctx);
		case "Array": return parseTuple(def, ctx);
		case "RegExp": return ctx.$.node("intersection", {
			domain: "string",
			pattern: def
		}, { prereduced: true });
		case "Function": {
			const resolvedDef = isThunk(def) ? def() : def;
			if (hasArkKind(resolvedDef, "root")) return resolvedDef;
			return throwParseError(writeBadDefinitionTypeMessage("Function"));
		}
		default: return throwParseError(writeBadDefinitionTypeMessage(objectKind ?? printable(def)));
	}
};
const parseTuple = (def, ctx) => maybeParseTupleExpression(def, ctx) ?? parseTupleLiteral(def, ctx);
const writeBadDefinitionTypeMessage = (actual) => `Type definitions must be strings or objects (was ${actual})`;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/type.js
var InternalTypeParser = class extends Callable {
	constructor($) {
		const attach = Object.assign({
			errors: ArkErrors,
			hkt: Hkt,
			$,
			raw: $.parse,
			module: $.constructor.module,
			scope: $.constructor.scope,
			declare: $.declare,
			define: $.define,
			match: $.match,
			generic: $.generic,
			schema: $.schema,
			keywords: $.ambient,
			unit: $.unit,
			enumerated: $.enumerated,
			instanceOf: $.instanceOf,
			valueOf: $.valueOf,
			or: $.or,
			and: $.and,
			merge: $.merge,
			pipe: $.pipe,
			fn: $.fn
		}, $.ambientAttachments);
		super((...args) => {
			if (args.length === 1) return $.parse(args[0]);
			if (args.length === 2 && typeof args[0] === "string" && args[0][0] === "<" && args[0].at(-1) === ">") {
				const paramString = args[0].slice(1, -1);
				return new GenericRoot($.parseGenericParams(paramString, {}), args[1], $, $, null);
			}
			return $.parse(args);
		}, { attach });
	}
};

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/scope.js
const $arkTypeRegistry = $ark;
var InternalScope = class InternalScope extends BaseScope {
	get ambientAttachments() {
		if (!$arkTypeRegistry.typeAttachments) return;
		return this.cacheGetter("ambientAttachments", flatMorph($arkTypeRegistry.typeAttachments, (k, v) => [k, this.bindReference(v)]));
	}
	preparseOwnAliasEntry(alias, def) {
		const firstParamIndex = alias.indexOf("<");
		if (firstParamIndex === -1) {
			if (hasArkKind(def, "module") || hasArkKind(def, "generic")) return [alias, def];
			const qualifiedName = this.name === "ark" ? alias : alias === "root" ? this.name : `${this.name}.${alias}`;
			const config = this.resolvedConfig.keywords?.[qualifiedName];
			if (config) def = [
				def,
				"@",
				config
			];
			return [alias, def];
		}
		if (alias.at(-1) !== ">") throwParseError(`'>' must be the last character of a generic declaration in a scope`);
		const name = alias.slice(0, firstParamIndex);
		const paramString = alias.slice(firstParamIndex + 1, -1);
		return [name, () => {
			return parseGeneric(this.parseGenericParams(paramString, { alias: name }), def, this);
		}];
	}
	parseGenericParams(def, opts) {
		return parseGenericParamName(new Scanner(def), [], this.createParseContext({
			...opts,
			def,
			prefix: "generic"
		}));
	}
	normalizeRootScopeValue(resolution) {
		if (isThunk(resolution) && !hasArkKind(resolution, "generic")) return resolution();
		return resolution;
	}
	preparseOwnDefinitionFormat(def, opts) {
		return {
			...opts,
			def,
			prefix: opts.alias ?? "type"
		};
	}
	parseOwnDefinitionFormat(def, ctx) {
		if (!(ctx.alias && ctx.alias in this.aliases) && !ctx.args) ctx.args = { this: ctx.id };
		const result = parseInnerDefinition(def, ctx);
		if (isArray(result)) {
			if (result[1] === "=") return throwParseError(shallowDefaultableMessage);
			if (result[1] === "?") return throwParseError(shallowOptionalMessage);
		}
		return result;
	}
	unit = (value$1) => this.units([value$1]);
	valueOf = (tsEnum) => this.units(enumValues(tsEnum));
	enumerated = (...values) => this.units(values);
	instanceOf = (ctor) => this.node("proto", { proto: ctor }, { prereduced: true });
	or = (...defs) => this.schema(defs.map((def) => this.parse(def)));
	and = (...defs) => defs.reduce((node$1, def) => node$1.and(this.parse(def)), this.intrinsic.unknown);
	merge = (...defs) => defs.reduce((node$1, def) => node$1.merge(this.parse(def)), this.intrinsic.object);
	pipe = (...morphs) => this.intrinsic.unknown.pipe(...morphs);
	fn = new InternalFnParser(this);
	match = new InternalMatchParser(this);
	declare = () => ({ type: this.type });
	define(def) {
		return def;
	}
	type = new InternalTypeParser(this);
	static scope = ((def, config = {}) => new InternalScope(def, config));
	static module = ((def, config = {}) => this.scope(def, config).export());
};
const scope = Object.assign(InternalScope.scope, { define: (def) => def });
const Scope = InternalScope;

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/builtins.js
var MergeHkt = class extends Hkt {
	description = "merge an object's properties onto another like `Merge(User, { isAdmin: \"true\" })`";
};
const Merge = genericNode(["base", intrinsic.object], ["props", intrinsic.object])((args) => args.base.merge(args.props), MergeHkt);
const arkBuiltins = Scope.module({
	Key: intrinsic.key,
	Merge
});

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/Array.js
var liftFromHkt = class extends Hkt {};
const liftFrom = genericNode("element")((args) => {
	const nonArrayElement = args.element.exclude(intrinsic.Array);
	const lifted = nonArrayElement.array();
	return nonArrayElement.rawOr(lifted).pipe(liftArray).distribute((branch) => branch.assertHasKind("morph").declareOut(lifted), rootSchema);
}, liftFromHkt);
const arkArray = Scope.module({
	root: intrinsic.Array,
	readonly: "root",
	index: intrinsic.nonNegativeIntegerString,
	liftFrom
}, { name: "Array" });

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/FormData.js
const value = rootSchema(["string", registry.FileConstructor]);
const parsed = rootSchema({
	meta: "an object representing parsed form data",
	domain: "object",
	index: {
		signature: "string",
		value: value.rawOr(value.array())
	}
});
const arkFormData = Scope.module({
	root: ["instanceof", FormData],
	value,
	parsed,
	parse: rootSchema({
		in: FormData,
		morphs: (data) => {
			const result = {};
			for (const [k, v] of data) if (k in result) {
				const existing = result[k];
				if (typeof existing === "string" || existing instanceof registry.FileConstructor) result[k] = [existing, v];
				else existing.push(v);
			} else result[k] = v;
			return result;
		},
		declaredOut: parsed
	})
}, { name: "FormData" });

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/TypedArray.js
const TypedArray = Scope.module({
	Int8: ["instanceof", Int8Array],
	Uint8: ["instanceof", Uint8Array],
	Uint8Clamped: ["instanceof", Uint8ClampedArray],
	Int16: ["instanceof", Int16Array],
	Uint16: ["instanceof", Uint16Array],
	Int32: ["instanceof", Int32Array],
	Uint32: ["instanceof", Uint32Array],
	Float32: ["instanceof", Float32Array],
	Float64: ["instanceof", Float64Array],
	BigInt64: ["instanceof", BigInt64Array],
	BigUint64: ["instanceof", BigUint64Array]
}, { name: "TypedArray" });

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/constructors.js
const omittedPrototypes = {
	Boolean: 1,
	Number: 1,
	String: 1
};
const arkPrototypes = Scope.module({
	...flatMorph({
		...ecmascriptConstructors,
		...platformConstructors
	}, (k, v) => k in omittedPrototypes ? [] : [k, ["instanceof", v]]),
	Array: arkArray,
	TypedArray,
	FormData: arkFormData
});

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/number.js
/**
* As per the ECMA-262 specification:
* A time value supports a slightly smaller range of -8,640,000,000,000,000 to 8,640,000,000,000,000 milliseconds.
*
* @see https://262.ecma-international.org/15.0/index.html#sec-time-values-and-time-range
*/
const epoch$1 = rootSchema({
	domain: {
		domain: "number",
		meta: "a number representing a Unix timestamp"
	},
	divisor: {
		rule: 1,
		meta: `an integer representing a Unix timestamp`
	},
	min: {
		rule: -864e13,
		meta: `a Unix timestamp after -8640000000000000`
	},
	max: {
		rule: 864e13,
		meta: "a Unix timestamp before 8640000000000000"
	},
	meta: "an integer representing a safe Unix timestamp"
});
const integer = rootSchema({
	domain: "number",
	divisor: 1
});
const number = Scope.module({
	root: intrinsic.number,
	integer,
	epoch: epoch$1,
	safe: rootSchema({
		domain: {
			domain: "number",
			numberAllowsNaN: false
		},
		min: Number.MIN_SAFE_INTEGER,
		max: Number.MAX_SAFE_INTEGER
	}),
	NaN: ["===", NaN],
	Infinity: ["===", Number.POSITIVE_INFINITY],
	NegativeInfinity: ["===", Number.NEGATIVE_INFINITY]
}, { name: "number" });

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/string.js
const regexStringNode = (regex$2, description, jsonSchemaFormat) => {
	const schema$1 = {
		domain: "string",
		pattern: {
			rule: regex$2.source,
			flags: regex$2.flags,
			meta: description
		}
	};
	if (jsonSchemaFormat) schema$1.meta = { format: jsonSchemaFormat };
	return node("intersection", schema$1);
};
const stringIntegerRoot = regexStringNode(wellFormedIntegerMatcher, "a well-formed integer string");
const stringInteger = Scope.module({
	root: stringIntegerRoot,
	parse: rootSchema({
		in: stringIntegerRoot,
		morphs: (s, ctx) => {
			const parsed$1 = Number.parseInt(s);
			return Number.isSafeInteger(parsed$1) ? parsed$1 : ctx.error("an integer in the range Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER");
		},
		declaredOut: intrinsic.integer
	})
}, { name: "string.integer" });
const hex = regexStringNode(/^[\dA-Fa-f]+$/, "hex characters only");
const base64 = Scope.module({
	root: regexStringNode(/^(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{2}==|[\d+/A-Za-z]{3}=)?$/, "base64-encoded"),
	url: regexStringNode(/^(?:[\w-]{4})*(?:[\w-]{2}(?:==|%3D%3D)?|[\w-]{3}(?:=|%3D)?)?$/, "base64url-encoded")
}, { name: "string.base64" });
const preformattedCapitalize = regexStringNode(/^[A-Z].*$/, "capitalized");
const capitalize = Scope.module({
	root: rootSchema({
		in: "string",
		morphs: (s) => s.charAt(0).toUpperCase() + s.slice(1),
		declaredOut: preformattedCapitalize
	}),
	preformatted: preformattedCapitalize
}, { name: "string.capitalize" });
const isLuhnValid = (creditCardInput) => {
	const sanitized = creditCardInput.replaceAll(/[ -]+/g, "");
	let sum = 0;
	let digit;
	let tmpNum;
	let shouldDouble = false;
	for (let i = sanitized.length - 1; i >= 0; i--) {
		digit = sanitized.substring(i, i + 1);
		tmpNum = Number.parseInt(digit, 10);
		if (shouldDouble) {
			tmpNum *= 2;
			sum += tmpNum >= 10 ? tmpNum % 10 + 1 : tmpNum;
		} else sum += tmpNum;
		shouldDouble = !shouldDouble;
	}
	return !!(sum % 10 === 0 ? sanitized : false);
};
const creditCardMatcher = /^(?:4\d{12}(?:\d{3,6})?|5[1-5]\d{14}|(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}|6(?:011|5\d\d)\d{12,15}|3[47]\d{13}|3(?:0[0-5]|[68]\d)\d{11}|(?:2131|1800|35\d{3})\d{11}|6[27]\d{14}|^(81\d{14,17}))$/;
const creditCard = rootSchema({
	domain: "string",
	pattern: {
		meta: "a credit card number",
		rule: creditCardMatcher.source
	},
	predicate: {
		meta: "a credit card number",
		predicate: isLuhnValid
	}
});
const iso8601Matcher = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))(T((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([,.]\d+(?!:))?)?(\17[0-5]\d([,.]\d+)?)?([Zz]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const isParsableDate = (s) => !Number.isNaN(new Date(s).valueOf());
const parsableDate = rootSchema({
	domain: "string",
	predicate: {
		meta: "a parsable date",
		predicate: isParsableDate
	}
}).assertHasKind("intersection");
const epochRoot = stringInteger.root.internal.narrow((s, ctx) => {
	const n = Number.parseInt(s);
	const out = number.epoch(n);
	if (out instanceof ArkErrors) {
		ctx.errors.merge(out);
		return false;
	}
	return true;
}).configure({ description: "an integer string representing a safe Unix timestamp" }, "self").assertHasKind("intersection");
const epoch = Scope.module({
	root: epochRoot,
	parse: rootSchema({
		in: epochRoot,
		morphs: (s) => new Date(s),
		declaredOut: intrinsic.Date
	})
}, { name: "string.date.epoch" });
const isoRoot = regexStringNode(iso8601Matcher, "an ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) date").internal.assertHasKind("intersection");
const iso = Scope.module({
	root: isoRoot,
	parse: rootSchema({
		in: isoRoot,
		morphs: (s) => new Date(s),
		declaredOut: intrinsic.Date
	})
}, { name: "string.date.iso" });
const stringDate = Scope.module({
	root: parsableDate,
	parse: rootSchema({
		declaredIn: parsableDate,
		in: "string",
		morphs: (s, ctx) => {
			const date = new Date(s);
			if (Number.isNaN(date.valueOf())) return ctx.error("a parsable date");
			return date;
		},
		declaredOut: intrinsic.Date
	}),
	iso,
	epoch
}, { name: "string.date" });
const email = regexStringNode(/^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/, "an email address", "email");
const ipv4Segment = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
const ipv4Address = `(${ipv4Segment}[.]){3}${ipv4Segment}`;
const ipv4Matcher = /* @__PURE__ */ new RegExp(`^${ipv4Address}$`);
const ipv6Segment = "(?:[0-9a-fA-F]{1,4})";
const ipv6Matcher = /* @__PURE__ */ new RegExp(`^((?:${ipv6Segment}:){7}(?:${ipv6Segment}|:)|(?:${ipv6Segment}:){6}(?:${ipv4Address}|:${ipv6Segment}|:)|(?:${ipv6Segment}:){5}(?::${ipv4Address}|(:${ipv6Segment}){1,2}|:)|(?:${ipv6Segment}:){4}(?:(:${ipv6Segment}){0,1}:${ipv4Address}|(:${ipv6Segment}){1,3}|:)|(?:${ipv6Segment}:){3}(?:(:${ipv6Segment}){0,2}:${ipv4Address}|(:${ipv6Segment}){1,4}|:)|(?:${ipv6Segment}:){2}(?:(:${ipv6Segment}){0,3}:${ipv4Address}|(:${ipv6Segment}){1,5}|:)|(?:${ipv6Segment}:){1}(?:(:${ipv6Segment}){0,4}:${ipv4Address}|(:${ipv6Segment}){1,6}|:)|(?::((?::${ipv6Segment}){0,5}:${ipv4Address}|(?::${ipv6Segment}){1,7}|:)))(%[0-9a-zA-Z.]{1,})?\$`);
const ip = Scope.module({
	root: [
		"v4 | v6",
		"@",
		"an IP address"
	],
	v4: regexStringNode(ipv4Matcher, "an IPv4 address", "ipv4"),
	v6: regexStringNode(ipv6Matcher, "an IPv6 address", "ipv6")
}, { name: "string.ip" });
const jsonStringDescription = "a JSON string";
const writeJsonSyntaxErrorProblem = (error) => {
	if (!(error instanceof SyntaxError)) throw error;
	return `must be ${jsonStringDescription} (${error})`;
};
const jsonRoot = rootSchema({
	meta: jsonStringDescription,
	domain: "string",
	predicate: {
		meta: jsonStringDescription,
		predicate: (s, ctx) => {
			try {
				JSON.parse(s);
				return true;
			} catch (e) {
				return ctx.reject({
					code: "predicate",
					expected: jsonStringDescription,
					problem: writeJsonSyntaxErrorProblem(e)
				});
			}
		}
	}
});
const parseJson = (s, ctx) => {
	if (s.length === 0) return ctx.error({
		code: "predicate",
		expected: jsonStringDescription,
		actual: "empty"
	});
	try {
		return JSON.parse(s);
	} catch (e) {
		return ctx.error({
			code: "predicate",
			expected: jsonStringDescription,
			problem: writeJsonSyntaxErrorProblem(e)
		});
	}
};
const json$1 = Scope.module({
	root: jsonRoot,
	parse: rootSchema({
		meta: "safe JSON string parser",
		in: "string",
		morphs: parseJson,
		declaredOut: intrinsic.jsonObject
	})
}, { name: "string.json" });
const preformattedLower = regexStringNode(/^[a-z]*$/, "only lowercase letters");
const lower = Scope.module({
	root: rootSchema({
		in: "string",
		morphs: (s) => s.toLowerCase(),
		declaredOut: preformattedLower
	}),
	preformatted: preformattedLower
}, { name: "string.lower" });
const normalizedForms = [
	"NFC",
	"NFD",
	"NFKC",
	"NFKD"
];
const preformattedNodes = flatMorph(normalizedForms, (i, form) => [form, rootSchema({
	domain: "string",
	predicate: (s) => s.normalize(form) === s,
	meta: `${form}-normalized unicode`
})]);
const normalizeNodes = flatMorph(normalizedForms, (i, form) => [form, rootSchema({
	in: "string",
	morphs: (s) => s.normalize(form),
	declaredOut: preformattedNodes[form]
})]);
const NFC = Scope.module({
	root: normalizeNodes.NFC,
	preformatted: preformattedNodes.NFC
}, { name: "string.normalize.NFC" });
const NFD = Scope.module({
	root: normalizeNodes.NFD,
	preformatted: preformattedNodes.NFD
}, { name: "string.normalize.NFD" });
const NFKC = Scope.module({
	root: normalizeNodes.NFKC,
	preformatted: preformattedNodes.NFKC
}, { name: "string.normalize.NFKC" });
const NFKD = Scope.module({
	root: normalizeNodes.NFKD,
	preformatted: preformattedNodes.NFKD
}, { name: "string.normalize.NFKD" });
const normalize = Scope.module({
	root: "NFC",
	NFC,
	NFD,
	NFKC,
	NFKD
}, { name: "string.normalize" });
const numericRoot = regexStringNode(numericStringMatcher, "a well-formed numeric string");
const stringNumeric = Scope.module({
	root: numericRoot,
	parse: rootSchema({
		in: numericRoot,
		morphs: (s) => Number.parseFloat(s),
		declaredOut: intrinsic.number
	})
}, { name: "string.numeric" });
const regexPatternDescription = "a regex pattern";
const regex = rootSchema({
	domain: "string",
	predicate: {
		meta: regexPatternDescription,
		predicate: (s, ctx) => {
			try {
				new RegExp(s);
				return true;
			} catch (e) {
				return ctx.reject({
					code: "predicate",
					expected: regexPatternDescription,
					problem: String(e)
				});
			}
		}
	},
	meta: { format: "regex" }
});
const semver = regexStringNode(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*))*))?(?:\+([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/, "a semantic version (see https://semver.org/)");
const preformattedTrim = regexStringNode(/^\S.*\S$|^\S?$/, "trimmed");
const trim = Scope.module({
	root: rootSchema({
		in: "string",
		morphs: (s) => s.trim(),
		declaredOut: preformattedTrim
	}),
	preformatted: preformattedTrim
}, { name: "string.trim" });
const preformattedUpper = regexStringNode(/^[A-Z]*$/, "only uppercase letters");
const upper = Scope.module({
	root: rootSchema({
		in: "string",
		morphs: (s) => s.toUpperCase(),
		declaredOut: preformattedUpper
	}),
	preformatted: preformattedUpper
}, { name: "string.upper" });
const isParsableUrl = (s) => URL.canParse(s);
const urlRoot = rootSchema({
	domain: "string",
	predicate: {
		meta: "a URL string",
		predicate: isParsableUrl
	},
	meta: { format: "uri" }
});
const url = Scope.module({
	root: urlRoot,
	parse: rootSchema({
		declaredIn: urlRoot,
		in: "string",
		morphs: (s, ctx) => {
			try {
				return new URL(s);
			} catch {
				return ctx.error("a URL string");
			}
		},
		declaredOut: rootSchema(URL)
	})
}, { name: "string.url" });
const uuid = Scope.module({
	root: [
		"versioned | nil | max",
		"@",
		{
			description: "a UUID",
			format: "uuid"
		}
	],
	"#nil": "'00000000-0000-0000-0000-000000000000'",
	"#max": "'ffffffff-ffff-ffff-ffff-ffffffffffff'",
	"#versioned": /[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}/i,
	v1: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-1[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv1"),
	v2: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-2[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv2"),
	v3: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-3[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv3"),
	v4: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv4"),
	v5: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-5[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv5"),
	v6: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-6[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv6"),
	v7: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-7[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv7"),
	v8: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-8[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv8")
}, { name: "string.uuid" });
const string = Scope.module({
	root: intrinsic.string,
	alpha: regexStringNode(/^[A-Za-z]*$/, "only letters"),
	alphanumeric: regexStringNode(/^[\dA-Za-z]*$/, "only letters and digits 0-9"),
	hex,
	base64,
	capitalize,
	creditCard,
	date: stringDate,
	digits: regexStringNode(/^\d*$/, "only digits 0-9"),
	email,
	integer: stringInteger,
	ip,
	json: json$1,
	lower,
	normalize,
	numeric: stringNumeric,
	regex,
	semver,
	trim,
	upper,
	url,
	uuid
}, { name: "string" });

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/ts.js
const arkTsKeywords = Scope.module({
	bigint: intrinsic.bigint,
	boolean: intrinsic.boolean,
	false: intrinsic.false,
	never: intrinsic.never,
	null: intrinsic.null,
	number: intrinsic.number,
	object: intrinsic.object,
	string: intrinsic.string,
	symbol: intrinsic.symbol,
	true: intrinsic.true,
	unknown: intrinsic.unknown,
	undefined: intrinsic.undefined
});
const unknown = Scope.module({
	root: intrinsic.unknown,
	any: intrinsic.unknown
}, { name: "unknown" });
const json = Scope.module({
	root: intrinsic.jsonObject,
	stringify: node("morph", {
		in: intrinsic.jsonObject,
		morphs: (data) => JSON.stringify(data),
		declaredOut: intrinsic.string
	})
}, { name: "object.json" });
const object = Scope.module({
	root: intrinsic.object,
	json
}, { name: "object" });
var RecordHkt = class extends Hkt {
	description = "instantiate an object from an index signature and corresponding value type like `Record(\"string\", \"number\")`";
};
const Record = genericNode(["K", intrinsic.key], "V")((args) => ({
	domain: "object",
	index: {
		signature: args.K,
		value: args.V
	}
}), RecordHkt);
var PickHkt = class extends Hkt {
	description = "pick a set of properties from an object like `Pick(User, \"name | age\")`";
};
const Pick = genericNode(["T", intrinsic.object], ["K", intrinsic.key])((args) => args.T.pick(args.K), PickHkt);
var OmitHkt = class extends Hkt {
	description = "omit a set of properties from an object like `Omit(User, \"age\")`";
};
const Omit = genericNode(["T", intrinsic.object], ["K", intrinsic.key])((args) => args.T.omit(args.K), OmitHkt);
var PartialHkt = class extends Hkt {
	description = "make all named properties of an object optional like `Partial(User)`";
};
const Partial = genericNode(["T", intrinsic.object])((args) => args.T.partial(), PartialHkt);
var RequiredHkt = class extends Hkt {
	description = "make all named properties of an object required like `Required(User)`";
};
const Required = genericNode(["T", intrinsic.object])((args) => args.T.required(), RequiredHkt);
var ExcludeHkt = class extends Hkt {
	description = "exclude branches of a union like `Exclude(\"boolean\", \"true\")`";
};
const Exclude = genericNode("T", "U")((args) => args.T.exclude(args.U), ExcludeHkt);
var ExtractHkt = class extends Hkt {
	description = "extract branches of a union like `Extract(\"0 | false | 1\", \"number\")`";
};
const Extract = genericNode("T", "U")((args) => args.T.extract(args.U), ExtractHkt);
const arkTsGenerics = Scope.module({
	Exclude,
	Extract,
	Omit,
	Partial,
	Pick,
	Record,
	Required
});

//#endregion
//#region ../node_modules/.pnpm/arktype@2.1.25/node_modules/arktype/out/keywords/keywords.js
const ark = scope({
	...arkTsKeywords,
	...arkTsGenerics,
	...arkPrototypes,
	...arkBuiltins,
	string,
	number,
	object,
	unknown
}, {
	prereducedAliases: true,
	name: "ark"
});
const keywords = ark.export();
Object.assign($arkTypeRegistry.ambient, keywords);
$arkTypeRegistry.typeAttachments = {
	string: keywords.string.root,
	number: keywords.number.root,
	bigint: keywords.bigint,
	boolean: keywords.boolean,
	symbol: keywords.symbol,
	undefined: keywords.undefined,
	null: keywords.null,
	object: keywords.object.root,
	unknown: keywords.unknown.root,
	false: keywords.false,
	true: keywords.true,
	never: keywords.never,
	arrayIndex: keywords.Array.index,
	Key: keywords.Key,
	Record: keywords.Record,
	Array: keywords.Array.root,
	Date: keywords.Date
};
const type = Object.assign(ark.type, $arkTypeRegistry.typeAttachments);
const match = ark.match;
const fn = ark.fn;
const generic = ark.generic;
const schema = ark.schema;
const define = ark.define;
const declare = ark.declare;

//#endregion
//#region ../schemas/libraries/arktype/download.ts
const image = type({
	id: "number",
	created: "Date",
	title: "1<=string<=100",
	type: "'jpg'|'png'",
	size: "number",
	url: "string.url"
});
const rating = type({
	id: "number",
	stars: "1<=number<=5",
	title: "1<=string<=100",
	text: "1<=string<=1000",
	images: image.array()
});
type({
	id: "number",
	created: "Date",
	title: "1<=string<=100",
	brand: "1<=string<=30",
	description: "1<=string<=500",
	price: "1<=number<=10000",
	discount: "1<=number<=100|null",
	quantity: "1<=number<=10",
	tags: "(1<=string<=30)[]",
	images: image.array(),
	ratings: rating.array()
})({});

//#endregion