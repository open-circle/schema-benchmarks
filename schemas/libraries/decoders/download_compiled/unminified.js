function isNumber(value) {
	return typeof value === "number";
}
function isString(value) {
	return typeof value === "string";
}
function isBigInt(value) {
	return typeof value === "bigint";
}
function isDate(value) {
	return !!value && Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value);
}
function isPromiseLike(value) {
	return typeof value === "object" && value !== null && "then" in value && typeof value.then === "function";
}
function isPlainObject(value) {
	return value !== null && typeof value === "object" && Object.prototype.toString.call(value) === "[object Object]";
}
var kAnnotationRegistry = Symbol.for("decoders.kAnnotationRegistry");
var _register = globalThis[kAnnotationRegistry] ??= /* @__PURE__ */ new WeakSet();
function brand(ann) {
	_register.add(ann);
	return ann;
}
function makeObjectAnn(fields, text) {
	return brand({
		type: "object",
		fields,
		text
	});
}
function makeArrayAnn(items, text) {
	return brand({
		type: "array",
		items,
		text
	});
}
function makeOpaqueAnn(value, text) {
	return brand({
		type: "opaque",
		value,
		text
	});
}
function makeScalarAnn(value, text) {
	return brand({
		type: "scalar",
		value,
		text
	});
}
function updateText(annotation, text) {
	if (text !== void 0) return brand({
		...annotation,
		text
	});
	else return annotation;
}
function merge(objAnnotation, fields) {
	return makeObjectAnn(new Map([...objAnnotation.fields, ...fields]), objAnnotation.text);
}
function isAnnotation(thing) {
	return _register.has(thing);
}
function annotateArray(arr, text, seen) {
	seen.add(arr);
	const items = [];
	for (const value of arr) items.push(annotate(value, void 0, seen));
	return makeArrayAnn(items, text);
}
function annotateObject(obj, text, seen) {
	seen.add(obj);
	const fields = /* @__PURE__ */ new Map();
	for (const key of Object.keys(obj)) {
		const value = obj[key];
		fields.set(key, annotate(value, void 0, seen));
	}
	return makeObjectAnn(fields, text);
}
function annotate(value, text, seen) {
	if (value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "symbol" || typeof value === "bigint" || typeof value.getMonth === "function") return makeScalarAnn(value, text);
	if (isAnnotation(value)) return updateText(value, text);
	if (Array.isArray(value)) if (seen.has(value)) return makeOpaqueAnn("<circular ref>", text);
	else return annotateArray(value, text, seen);
	if (isPlainObject(value)) if (seen.has(value)) return makeOpaqueAnn("<circular ref>", text);
	else return annotateObject(value, text, seen);
	if (typeof value === "function") return makeOpaqueAnn("<function>", text);
	if (isPromiseLike(value)) return makeOpaqueAnn("<Promise>", text);
	if (value?.constructor?.name) return makeOpaqueAnn(`<${value.constructor.name}>`, text);
	else return makeOpaqueAnn("???", text);
}
function public_annotate(value, text) {
	return annotate(value, text, /* @__PURE__ */ new WeakSet());
}
function public_annotateObject(obj, text) {
	return annotateObject(obj, text, /* @__PURE__ */ new WeakSet());
}
var INDENT = "  ";
function isMultiline(s) {
	return s.includes("\n");
}
function indent(s, prefix = INDENT) {
	if (isMultiline(s)) return s.split("\n").map((line) => `${prefix}${line}`).join("\n");
	else return `${prefix}${s}`;
}
var quotePattern = /'/g;
function quote(value) {
	return typeof value === "string" ? "'" + value.replace(quotePattern, "\\'") + "'" : value === void 0 ? "undefined" : JSON.stringify(value);
}
function summarize(ann, keypath = []) {
	const result = [];
	if (ann.type === "array") {
		const items = ann.items;
		let index = 0;
		for (const ann2 of items) for (const item of summarize(ann2, [...keypath, index++])) result.push(item);
	} else if (ann.type === "object") {
		const fields = ann.fields;
		for (const [key, value] of fields) for (const item of summarize(value, [...keypath, key])) result.push(item);
	}
	const text = ann.text;
	if (!text) return result;
	let prefix;
	if (keypath.length === 0) prefix = "";
	else if (keypath.length === 1) prefix = typeof keypath[0] === "number" ? `Value at index ${keypath[0]}: ` : `Value at key ${quote(keypath[0])}: `;
	else prefix = `Value at keypath ${quote(keypath.map(String).join("."))}: `;
	return [...result, `${prefix}${text}`];
}
function serializeString(s, width = 80) {
	let ser = JSON.stringify(s);
	if (ser.length <= width) return ser;
	const truncated = `${s.substring(0, width - 15)}...`;
	ser = `${JSON.stringify(truncated)} [truncated]`;
	return ser;
}
function serializeArray(annotation, prefix) {
	const { items } = annotation;
	if (items.length === 0) return "[]";
	const result = [];
	for (const item of items) {
		const [ser, ann] = serializeAnnotation(item, `${prefix}${INDENT}`);
		result.push(`${prefix}${INDENT}${ser},`);
		if (ann !== void 0) result.push(indent(ann, `${prefix}${INDENT}`));
	}
	return [
		"[",
		...result,
		`${prefix}]`
	].join("\n");
}
function serializeObject(annotation, prefix) {
	const { fields } = annotation;
	if (fields.size === 0) return "{}";
	const result = [];
	for (const [key, valueAnnotation] of fields) {
		const kser = serializeValue(key);
		const valPrefix = `${prefix}${INDENT}${" ".repeat(kser.length + 2)}`;
		const [vser, vann] = serializeAnnotation(valueAnnotation, `${prefix}${INDENT}`);
		result.push(`${prefix}${INDENT}${kser}: ${vser},`);
		if (vann !== void 0) result.push(indent(vann, valPrefix));
	}
	return [
		"{",
		...result,
		`${prefix}}`
	].join("\n");
}
function serializeValue(value) {
	if (typeof value === "string") return serializeString(value);
	else if (typeof value === "number" || typeof value === "boolean" || typeof value === "symbol") return value.toString();
	else if (value === null) return "null";
	else if (value === void 0) return "undefined";
	else if (typeof value === "bigint") return `${value.toString()}n`;
	else if (isDate(value)) return `new Date(${quote(value.toISOString())})`;
	else if (value instanceof Date) return "(Invalid Date)";
	else return "(unserializable)";
}
function serializeAnnotation(ann, prefix = "") {
	let serialized;
	if (ann.type === "array") serialized = serializeArray(ann, prefix);
	else if (ann.type === "object") serialized = serializeObject(ann, prefix);
	else if (ann.type === "scalar") serialized = serializeValue(ann.value);
	else serialized = ann.value;
	const text = ann.text;
	if (text !== void 0) {
		const sep = "^".repeat(isMultiline(serialized) ? 1 : serialized.length);
		return [serialized, [sep, text].join(isMultiline(text) ? "\n" : " ")];
	} else return [serialized, void 0];
}
function formatInline(ann) {
	const [serialized, annotation] = serializeAnnotation(ann);
	if (annotation !== void 0) return `${serialized}
${annotation}`;
	else return serialized;
}
function formatShort(ann) {
	return summarize(ann, []).join("\n");
}
function* iterAnnotation(ann, stack) {
	if (ann.text) if (stack.length > 0) yield {
		message: ann.text,
		path: [...stack]
	};
	else yield { message: ann.text };
	switch (ann.type) {
		case "array": {
			let index = 0;
			for (const item of ann.items) {
				stack.push(index++);
				yield* iterAnnotation(item, stack);
				stack.pop();
			}
			break;
		}
		case "object":
			for (const [key, value] of ann.fields) {
				stack.push(key);
				yield* iterAnnotation(value, stack);
				stack.pop();
			}
			break;
		case "scalar":
		case "opaque": break;
	}
}
function formatAsIssues(ann) {
	return Array.from(iterAnnotation(ann, []));
}
function ok(value) {
	return {
		ok: true,
		value,
		error: void 0
	};
}
function err(error) {
	return {
		ok: false,
		value: void 0,
		error
	};
}
function noThrow(fn) {
	return (t) => {
		try {
			return ok(fn(t));
		} catch (e) {
			return err(public_annotate(t, e instanceof Error ? e.message : String(e)));
		}
	};
}
function format(err2, formatter) {
	const formatted = formatter(err2);
	if (typeof formatted === "string") {
		const err3 = /* @__PURE__ */ new Error(`
${formatted}`);
		err3.name = "Decoding error";
		return err3;
	} else return formatted;
}
function define(fn) {
	function decode(blob) {
		const makeFlexErr = (msg) => err(isAnnotation(msg) ? msg : public_annotate(blob, msg));
		return fn(blob, ok, makeFlexErr);
	}
	function verify(blob, formatter = formatInline) {
		const result = decode(blob);
		if (result.ok) return result.value;
		else throw format(result.error, formatter);
	}
	function value(blob) {
		return decode(blob).value;
	}
	function transform(transformFn) {
		return then(noThrow(transformFn));
	}
	function refine(predicateFn, errmsg) {
		return reject((value2) => predicateFn(value2) ? null : errmsg);
	}
	function refineType() {
		return self;
	}
	function then(next) {
		return define((blob, ok2, err2) => {
			const r1 = decode(blob);
			if (!r1.ok) return r1;
			const r2 = isDecoder(next) ? next : next(r1.value, ok2, err2);
			return isDecoder(r2) ? r2.decode(r1.value) : r2;
		});
	}
	function pipe(next) {
		return then(next);
	}
	function reject(rejectFn) {
		return then((blob, ok2, err2) => {
			const errmsg = rejectFn(blob);
			return errmsg === null ? ok2(blob) : err2(typeof errmsg === "string" ? public_annotate(blob, errmsg) : errmsg);
		});
	}
	function describe(message) {
		return define((blob, _, err2) => {
			const result = decode(blob);
			if (result.ok) return result;
			else return err2(public_annotate(result.error, message));
		});
	}
	const self = brand2({
		verify,
		value,
		decode,
		transform,
		refine,
		refineType,
		reject,
		describe,
		then,
		pipe,
		"~standard": {
			version: 1,
			vendor: "decoders",
			validate: (blob) => {
				const result = decode(blob);
				if (result.ok) return { value: result.value };
				else return { issues: formatAsIssues(result.error) };
			}
		}
	});
	return self;
}
var kDecoderRegistry = Symbol.for("decoders.kDecoderRegistry");
var _register2 = globalThis[kDecoderRegistry] ??= /* @__PURE__ */ new WeakSet();
function brand2(decoder) {
	_register2.add(decoder);
	return decoder;
}
function isDecoder(value) {
	return _register2.has(value);
}
var poja = define((blob, ok2, err2) => {
	if (!Array.isArray(blob)) return err2("Must be an array");
	return ok2(blob);
});
function array(decoder) {
	const decodeFn = decoder.decode;
	return poja.then((inputs, ok2, err2) => {
		const results = [];
		for (let i = 0; i < inputs.length; ++i) {
			const blob = inputs[i];
			const result = decodeFn(blob);
			if (result.ok) results.push(result.value);
			else {
				results.length = 0;
				const ann = result.error;
				const clone = inputs.slice();
				clone.splice(i, 1, public_annotate(ann, ann.text ? `${ann.text} (at index ${i})` : `index ${i}`));
				return err2(public_annotate(clone));
			}
		}
		return ok2(results);
	});
}
function instanceOf(klass) {
	return define((blob, ok2, err2) => blob instanceof klass ? ok2(blob) : err2(`Must be ${klass.name} instance`));
}
function lazy(decoderFn) {
	return define((blob) => decoderFn().decode(blob));
}
function difference(xs, ys) {
	const result = /* @__PURE__ */ new Set();
	for (const x of xs) if (!ys.has(x)) result.add(x);
	return result;
}
var pojo = define((blob, ok2, err2) => isPlainObject(blob) ? ok2(blob) : err2("Must be an object"));
function object(decoders) {
	const knownKeys = new Set(Object.keys(decoders));
	return pojo.then((plainObj, ok2, err2) => {
		const missingKeys = difference(knownKeys, new Set(Object.keys(plainObj)));
		const record2 = {};
		let errors = null;
		for (const key of Object.keys(decoders)) {
			const decoder = decoders[key];
			const rawValue = plainObj[key];
			const result = decoder.decode(rawValue);
			if (result.ok) {
				const value = result.value;
				if (value !== void 0) record2[key] = value;
				missingKeys.delete(key);
			} else {
				const ann = result.error;
				if (rawValue === void 0) missingKeys.add(key);
				else {
					errors ??= /* @__PURE__ */ new Map();
					errors.set(key, ann);
				}
			}
		}
		if (errors || missingKeys.size > 0) {
			let objAnn = public_annotateObject(plainObj);
			if (errors) objAnn = merge(objAnn, errors);
			if (missingKeys.size > 0) {
				const errMsg = Array.from(missingKeys).map(quote).join(", ");
				const pluralized = missingKeys.size > 1 ? "keys" : "key";
				objAnn = updateText(objAnn, `Missing ${pluralized}: ${errMsg}`);
			}
			return err2(objAnn);
		}
		return ok2(record2);
	});
}
var EITHER_PREFIX = "Either:\n";
function itemize(s) {
	return `-${indent(s).substring(1)}`;
}
function nest(errText) {
	return errText.startsWith(EITHER_PREFIX) ? errText.substring(EITHER_PREFIX.length) : itemize(errText);
}
function either(...decoders) {
	if (decoders.length === 0) throw new Error("Pass at least one decoder to either()");
	return define((blob, _, err2) => {
		const errors = [];
		for (const decoder of decoders) {
			const result = decoder.decode(blob);
			if (result.ok) return result;
			else errors.push(result.error);
		}
		return err2(EITHER_PREFIX + errors.map((err3) => nest(summarize(err3).join("\n"))).join("\n"));
	});
}
function oneOf(constants) {
	return define((blob, ok2, err2) => {
		const index = constants.indexOf(blob);
		if (index !== -1) return ok2(constants[index]);
		return err2(`Must be one of ${constants.map((value) => quote(value)).join(", ")}`);
	});
}
function lazyval(value) {
	return typeof value === "function" ? value() : value;
}
var null_ = constant(null);
constant(void 0);
define((blob, ok2, err2) => blob == null ? ok2(blob) : err2("Must be undefined or null"));
function nullable(decoder, defaultValue) {
	const rv = either(null_, decoder);
	return arguments.length >= 2 ? rv.transform((value) => value ?? lazyval(defaultValue)) : rv;
}
function constant(value) {
	return define((blob, ok2, err2) => blob === value ? ok2(value) : err2(`Must be ${typeof value === "symbol" ? String(value) : quote(value)}`));
}
define((blob, ok2, _) => ok2(blob));
var boolean = define((blob, ok2, err2) => {
	return typeof blob === "boolean" ? ok2(blob) : err2("Must be boolean");
});
define((blob, ok2, _) => ok2(!!blob));
function record(fst, snd) {
	const keyDecoder = snd !== void 0 ? fst : void 0;
	const valueDecoder = snd ?? fst;
	return pojo.then((input, ok2, err2) => {
		let rv = {};
		const errors = /* @__PURE__ */ new Map();
		for (const key of Object.keys(input)) {
			const value = input[key];
			const keyResult = keyDecoder?.decode(key);
			if (keyResult?.ok === false) return err2(public_annotate(input, `Invalid key ${quote(key)}: ${formatShort(keyResult.error)}`));
			const k = keyResult?.value ?? key;
			const result = valueDecoder.decode(value);
			if (result.ok) {
				if (errors.size === 0) rv[k] = result.value;
			} else {
				errors.set(key, result.error);
				rv = {};
			}
		}
		if (errors.size > 0) return err2(merge(public_annotateObject(input), errors));
		else return ok2(rv);
	});
}
var url_re = /^([A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?):\/\/(?:([^@:]*:?(?:[^@]+)?)@)?(?:([A-Za-z0-9.-]+)(?::([0-9]{2,5}))?)(\/(?:[-+~%/.,\w]*)?(?:\?[-+=&;%@.,/\w]*)?(?:#[.,!/\w]*)?)?$/;
var string = define((blob, ok2, err2) => isString(blob) ? ok2(blob) : err2("Must be string"));
regex(/\S/, "Must be non-empty string");
function regex(regex2, msg) {
	return string.refine((s) => regex2.test(s), msg);
}
regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Must be email");
either(regex(url_re, "Must be URL").transform((value) => new URL(value)), instanceOf(URL)).refine((value) => value.protocol === "https:", "Must be an HTTPS URL");
regex(/^[a-z_][a-z0-9_]*$/i, "Must be valid identifier");
var uuid = regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Must be uuid");
uuid.refine((value) => value[14] === "1", "Must be uuidv1");
uuid.refine((value) => value[14] === "4", "Must be uuidv4");
var decimal = regex(/^[0-9]+$/, "Must only contain digits");
regex(/^[0-9a-f]+$/i, "Must only contain hexadecimal digits");
decimal.transform(Number);
var iso8601_re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.]\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;
var date = define((blob, ok2, err2) => {
	return isDate(blob) ? ok2(blob) : err2("Must be a Date");
});
either(date, regex(iso8601_re, "Must be ISO8601 format").refine((value) => !Number.isNaN(new Date(value).getTime()), "Must be valid date/time value").transform((value) => new Date(value))).describe("Must be a Date or date string");
var number = define((blob, ok2, err2) => isNumber(blob) ? ok2(blob) : err2("Must be number")).refine((n) => Number.isFinite(n), "Number must be finite");
var integer = number.refine((n) => Number.isInteger(n), "Number must be an integer");
number.refine((n) => n >= 0 && !Object.is(n, -0), "Number must be positive");
integer.refine((n) => n >= 0 && !Object.is(n, -0), "Number must be positive");
define((blob, ok2, err2) => isBigInt(blob) ? ok2(blob) : err2("Must be bigint"));
var json = either(null_, string, number, boolean, lazy(() => record(json)), lazy(() => array(json))).describe("Must be valid JSON value");
// istanbul ignore else -- @preserve
const stringWithLength = (min, max) => string.refine((value) => value.length >= min && value.length <= max, `string must be between ${min} and ${max} characters`);
const numberInRange = (min, max) => number.refine((value) => value >= min && value <= max, `number must be between ${min} and ${max}`);
const imageDecoder = object({
	id: number,
	created: date,
	title: stringWithLength(1, 100),
	type: oneOf(["jpg", "png"]),
	size: number,
	url: string.refine((value) => URL.canParse(value), "invalid url")
});
const ratingDecoder = object({
	id: number,
	stars: numberInRange(1, 5),
	title: stringWithLength(1, 100),
	text: stringWithLength(1, 1e3),
	images: array(imageDecoder)
});
object({
	id: number,
	created: date,
	title: stringWithLength(1, 100),
	brand: stringWithLength(1, 30),
	description: stringWithLength(1, 500),
	price: numberInRange(1, 1e4),
	discount: nullable(numberInRange(1, 100)),
	quantity: numberInRange(1, 10),
	tags: array(stringWithLength(1, 30)),
	images: array(imageDecoder),
	ratings: array(ratingDecoder)
}).verify({});
