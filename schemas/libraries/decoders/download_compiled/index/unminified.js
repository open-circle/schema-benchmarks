//#region ../node_modules/.pnpm/decoders@2.12.2/node_modules/decoders/dist/index.js
// @__NO_SIDE_EFFECTS__
function qty(n, unit) {
	return n === 1 ? `${n} ${unit}` : `${n} ${unit}s`;
}
// @__NO_SIDE_EFFECTS__
function isNumber(value) {
	return typeof value === "number";
}
// @__NO_SIDE_EFFECTS__
function isString(value) {
	return typeof value === "string";
}
// @__NO_SIDE_EFFECTS__
function isDate(value) {
	return !!value && Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value);
}
// @__NO_SIDE_EFFECTS__
function isPromiseLike(value) {
	return typeof value === "object" && value !== null && "then" in value && typeof value.then === "function";
}
// @__NO_SIDE_EFFECTS__
function isPlainObject(value) {
	return value !== null && typeof value === "object" && Object.prototype.toString.call(value) === "[object Object]";
}
function assertNever(_value, msg = "Unhandled case") {
	throw new Error(msg);
}
var kAnnotationRegistry = /* @__PURE__ */ Symbol.for("decoders.kAnnotationRegistry");
var _stamped = globalThis[kAnnotationRegistry] ??= /* @__PURE__ */ new WeakSet();
function stamp(ann) {
	_stamped.add(ann);
	return ann;
}
function makeObjectAnn(getFields, text) {
	let fields;
	return stamp({
		type: "object",
		get fields() {
			return fields ??= getFields();
		},
		text
	});
}
function makeArrayAnn(getItems, text) {
	let items;
	return stamp({
		type: "array",
		get items() {
			return items ??= getItems();
		},
		text
	});
}
function makeOpaqueAnn(value, text) {
	return stamp({
		type: "opaque",
		value,
		text
	});
}
function makeScalarAnn(value, text) {
	return stamp({
		type: "scalar",
		value,
		text
	});
}
function updateText(annotation, text) {
	if (text === void 0) return annotation;
	switch (annotation.type) {
		case "object": return makeObjectAnn(() => annotation.fields, text);
		case "array": return makeArrayAnn(() => annotation.items, text);
		case "scalar": return makeScalarAnn(annotation.value, text);
		case "opaque": return makeOpaqueAnn(annotation.value, text);
		// istanbul ignore next -- @preserve
		default: return assertNever(annotation, "Unknown annotation type");
	}
}
function merge(objAnnotation, fields) {
	return makeObjectAnn(() => new Map([...objAnnotation.fields, ...fields]), objAnnotation.text);
}
function isAnnotation(thing) {
	return _stamped.has(thing);
}
function annotateArray(arr, text, seen) {
	seen.add(arr);
	return makeArrayAnn(() => Array.from(arr, (value) => __annotate(value, void 0, seen)), text);
}
function annotateObject(obj, text, seen) {
	seen.add(obj);
	return makeObjectAnn(() => {
		const fields = /* @__PURE__ */ new Map();
		for (const key of Object.keys(obj)) {
			const value = obj[key];
			fields.set(key, __annotate(value, void 0, seen));
		}
		return fields;
	}, text);
}
function __annotate(value, text, seen) {
	if (value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "symbol" || typeof value === "bigint" || typeof value.getMonth === "function") return makeScalarAnn(value, text);
	if (isAnnotation(value)) return updateText(value, text);
	if (Array.isArray(value)) {
		if (seen.has(value)) return makeOpaqueAnn("<circular ref>", text);
		else return annotateArray(value, text, seen);
	}
	if (/* @__PURE__ */ isPlainObject(value)) {
		if (seen.has(value)) return makeOpaqueAnn("<circular ref>", text);
		else return annotateObject(value, text, seen);
	}
	if (typeof value === "function") return makeOpaqueAnn("<function>", text);
	if (/* @__PURE__ */ isPromiseLike(value)) return makeOpaqueAnn("<Promise>", text);
	if (value?.constructor?.name) return makeOpaqueAnn(`<${value.constructor.name}>`, text);
	else return makeOpaqueAnn("???", text);
}
function public_annotate(value, text) {
	return __annotate(value, text, /* @__PURE__ */ new WeakSet());
}
function public_annotateObject(obj, text) {
	return annotateObject(obj, text, /* @__PURE__ */ new WeakSet());
}
var INDENT = "  ";
// @__NO_SIDE_EFFECTS__
function isMultiline(s) {
	return s.includes("\n");
}
// @__NO_SIDE_EFFECTS__
function indent(s, prefix = INDENT) {
	if (/* @__PURE__ */ isMultiline(s)) return s.split("\n").map((line) => `${prefix}${line}`).join("\n");
	else return `${prefix}${s}`;
}
var quotePattern = /'/g;
// @__NO_SIDE_EFFECTS__
function quote(value) {
	return typeof value === "string" ? "'" + value.replace(quotePattern, "\\'") + "'" : value === void 0 ? "undefined" : JSON.stringify(value);
}
// @__NO_SIDE_EFFECTS__
function summarize(ann, keypath = []) {
	const result = [];
	if (ann.type === "array") {
		const items = ann.items;
		let index = 0;
		for (const ann2 of items) for (const item of /* @__PURE__ */ summarize(ann2, [...keypath, index++])) result.push(item);
	} else if (ann.type === "object") {
		const fields = ann.fields;
		for (const [key, value] of fields) for (const item of /* @__PURE__ */ summarize(value, [...keypath, key])) result.push(item);
	}
	const text = ann.text;
	if (!text) return result;
	let prefix;
	if (keypath.length === 0) prefix = "";
	else if (keypath.length === 1) prefix = typeof keypath[0] === "number" ? `Value at index ${keypath[0]}: ` : `Value at key ${/* @__PURE__ */ quote(keypath[0])}: `;
	else prefix = `Value at keypath ${/* @__PURE__ */ quote(keypath.map(String).join("."))}: `;
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
		if (ann !== void 0) result.push(/* @__PURE__ */ indent(ann, `${prefix}${INDENT}`));
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
		if (vann !== void 0) result.push(/* @__PURE__ */ indent(vann, valPrefix));
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
	else if (/* @__PURE__ */ isDate(value)) return `new Date(${/* @__PURE__ */ quote(value.toISOString())})`;
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
		const sep = "^".repeat(/* @__PURE__ */ isMultiline(serialized) ? 1 : serialized.length);
		return [serialized, [sep, text].join(/* @__PURE__ */ isMultiline(text) ? "\n" : " ")];
	} else return [serialized, void 0];
}
function formatInline(ann) {
	const [serialized, annotation] = serializeAnnotation(ann);
	if (annotation !== void 0) return `${serialized}
${annotation}`;
	else return serialized;
}
function* iterAnnotation(ann, stack) {
	if (ann.text) {
		if (stack.length > 0) yield {
			message: ann.text,
			path: [...stack]
		};
		else yield { message: ann.text };
	}
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
		// istanbul ignore next -- @preserve
		default: assertNever(ann, "Unknown annotation type");
	}
}
function formatAsIssues(ann) {
	return Array.from(iterAnnotation(ann, []));
}
// @__NO_SIDE_EFFECTS__
function ok(value) {
	return {
		ok: true,
		value,
		error: void 0
	};
}
// @__NO_SIDE_EFFECTS__
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
			return /* @__PURE__ */ ok(fn(t));
		} catch (e) {
			return /* @__PURE__ */ err(public_annotate(t, e instanceof Error ? e.message : String(e)));
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
var DecoderImpl = class {
	/**
	* Verifies the untrusted/unknown input and either accepts or rejects it.
	*
	* Contrasted with `.verify()`, calls to `.decode()` will never fail and
	* instead return a result type.
	*/
	decode;
	/**
	* Verifies the untrusted/unknown input and either accepts or rejects it.
	* When accepted, returns a value of type `T`. Otherwise fail with
	* a runtime error.
	*/
	verify;
	/**
	* Verifies the untrusted/unknown input and either accepts or rejects it.
	* When accepted, returns the decoded `T` value directly. Otherwise returns
	* `undefined`.
	*
	* Use this when you're not interested in programmatically handling the
	* error message.
	*/
	value;
	/**
	* Memoized `~standard` props, built on first access.
	*/
	#standard;
	constructor(fn) {
		const decode = (blob) => {
			const makeFlexErr = (msg) => /* @__PURE__ */ err(isAnnotation(msg) ? msg : public_annotate(blob, msg));
			return fn(blob, ok, makeFlexErr);
		};
		const verify = (blob, formatter = formatInline) => {
			const result = decode(blob);
			if (result.ok) return result.value;
			else throw format(result.error, formatter);
		};
		const value = (blob) => decode(blob).value;
		this.decode = decode;
		this.verify = verify;
		this.value = value;
	}
	/**
	* Accepts any value the given decoder accepts, and on success, will call
	* the given function **on the decoded result**. If the transformation
	* function throws an error, the whole decoder will fail using the error
	* message as the failure reason.
	*/
	transform(transformFn) {
		return this.chain(noThrow(transformFn));
	}
	refine(predicateFn, errmsg) {
		return this.reject((value) => predicateFn(value) ? null : errmsg);
	}
	/**
	* Cast the return type of this read-only decoder to a narrower type. This is
	* useful to return "branded" types. This method has no runtime effect.
	*/
	refineType() {
		return this;
	}
	/**
	* Send the output of the current decoder into another decoder or acceptance
	* function. The given acceptance function will receive the output of the
	* current decoder as its input.
	*
	* > _**NOTE:** This is an advanced, low-level, API. It's not recommended
	* > to reach for this construct unless there is no other way. Most cases can
	* > be covered more elegantly by `.transform()`, `.refine()`, or `.pipe()`
	* > instead._
	*/
	chain(next) {
		const decode = this.decode;
		return /* @__PURE__ */ define((blob, ok2, err2) => {
			const r1 = decode(blob);
			if (!r1.ok) return r1;
			const r2 = /* @__PURE__ */ isDecoder(next) ? next : next(r1.value, ok2, err2);
			return /* @__PURE__ */ isDecoder(r2) ? r2.decode(r1.value) : r2;
		});
	}
	/**
	* Send the output of this decoder as input to another decoder.
	*
	* This can be useful to validate the results of a transform, i.e.:
	*
	*   string
	*     .transform((s) => s.split(','))
	*     .pipe(array(nonEmptyString))
	*
	* You can also conditionally pipe:
	*
	*   string.pipe((s) => s.startsWith('@') ? username : email)
	*/
	pipe(next) {
		return this.chain(next);
	}
	/**
	* Adds an extra predicate to a decoder. The new decoder is like the
	* original decoder, but only accepts values that aren't rejected by the
	* given function.
	*
	* The given function can return `null` to accept the decoded value, or
	* return a specific error message to reject.
	*
	* Unlike `.refine()`, you can use this function to return a dynamic error
	* message.
	*/
	reject(rejectFn) {
		return this.chain((blob, ok2, err2) => {
			const errmsg = rejectFn(blob);
			return errmsg === null ? ok2(blob) : err2(typeof errmsg === "string" ? public_annotate(blob, errmsg) : errmsg);
		});
	}
	/**
	* Uses the given decoder, but will use an alternative error message in
	* case it rejects. This can be used to simplify or shorten otherwise
	* long or low-level/technical errors.
	*/
	describe(message) {
		const decode = this.decode;
		return /* @__PURE__ */ define((blob, _, err2) => {
			const result = decode(blob);
			if (result.ok) return result;
			else return err2(public_annotate(result.error, message));
		});
	}
	/**
	* The Standard Schema interface for this decoder.
	*/
	get "~standard"() {
		const decode = this.decode;
		return this.#standard ??= {
			version: 1,
			vendor: "decoders",
			validate: (blob) => {
				const result = decode(blob);
				if (result.ok) return { value: result.value };
				else return { issues: formatAsIssues(result.error) };
			}
		};
	}
};
Object.defineProperty(DecoderImpl, "name", { value: "Decoder" });
// @__NO_SIDE_EFFECTS__
function define(fn) {
	return stamp2(new DecoderImpl(fn));
}
var kDecoderRegistry = /* @__PURE__ */ Symbol.for("decoders.kDecoderRegistry");
var _stamped2 = globalThis[kDecoderRegistry] ??= /* @__PURE__ */ new WeakSet();
function stamp2(decoder) {
	_stamped2.add(decoder);
	return decoder;
}
// @__NO_SIDE_EFFECTS__
function isDecoder(value) {
	return _stamped2.has(value);
}
// @__NO_SIDE_EFFECTS__
function bySizeOptions(options) {
	const size = options.size;
	const min2 = size ?? options.min;
	const max2 = size ?? options.max;
	const atLeast = min2 === max2 ? "" : "at least ";
	const atMost = min2 === max2 ? "" : "at most ";
	return (value) => {
		const len = value.length ?? value.size;
		if (typeof value === "string") {
			if (min2 !== void 0 && len < min2) return `Too short, must be ${atLeast}${/* @__PURE__ */ qty(min2, "char")}`;
			if (max2 !== void 0 && len > max2) return `Too long, must be ${atMost}${/* @__PURE__ */ qty(max2, "char")}`;
		} else {
			if (min2 !== void 0 && len < min2) return `Must have ${atLeast}${/* @__PURE__ */ qty(min2, "item")}`;
			if (max2 !== void 0 && len > max2) return `Must have ${atMost}${/* @__PURE__ */ qty(max2, "item")}`;
		}
		return null;
	};
}
// @__NO_SIDE_EFFECTS__
function sized(decoder, options) {
	return decoder.reject(/* @__PURE__ */ bySizeOptions(options));
}
var poja = /* @__PURE__ */ define((blob, ok2, err2) => {
	if (!Array.isArray(blob)) return err2("Must be an array");
	return ok2(blob);
});
// @__NO_SIDE_EFFECTS__
function array(decoder, options) {
	const decodeFn = decoder.decode;
	return (options !== void 0 ? /* @__PURE__ */ sized(poja, options) : poja).chain((inputs, ok2, err2) => {
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
var pojo = /* @__PURE__ */ define((blob, ok2, err2) => /* @__PURE__ */ isPlainObject(blob) ? ok2(blob) : err2("Must be an object"));
// @__NO_SIDE_EFFECTS__
function buildObject(decoders) {
	const knownKeys = Object.keys(decoders);
	return pojo.chain((plainObj, ok2, err2) => {
		const record2 = {};
		let errors = null;
		let missingKeys = null;
		for (const key of knownKeys) {
			const decoder = decoders[key];
			const rawValue = plainObj[key];
			const result = decoder.decode(rawValue);
			if (result.ok) {
				const value = result.value;
				if (value !== void 0) record2[key] = value;
			} else {
				const ann = result.error;
				if (rawValue === void 0) (missingKeys ??= []).push(key);
				else (errors ??= /* @__PURE__ */ new Map()).set(key, ann);
			}
		}
		if (errors || missingKeys) {
			let objAnn = public_annotateObject(plainObj);
			if (errors) objAnn = merge(objAnn, errors);
			if (missingKeys) {
				const errMsg = missingKeys.map(quote).join(", ");
				const pluralized = missingKeys.length > 1 ? "keys" : "key";
				objAnn = updateText(objAnn, `Missing ${pluralized}: ${errMsg}`);
			}
			return err2(objAnn);
		}
		return ok2(record2);
	});
}
// @__NO_SIDE_EFFECTS__
function object(decoders) {
	return /* @__PURE__ */ buildObject(decoders);
}
var EITHER_PREFIX = "Either:\n";
function itemize(s) {
	return `-${(/* @__PURE__ */ indent(s)).substring(1)}`;
}
function nest(errText) {
	return errText.startsWith(EITHER_PREFIX) ? errText.substring(EITHER_PREFIX.length) : itemize(errText);
}
// @__NO_SIDE_EFFECTS__
function either(...decoders) {
	if (decoders.length === 0) throw new Error("Pass at least one decoder to either()");
	return /* @__PURE__ */ define((blob, _, err2) => {
		const errors = [];
		for (const decoder of decoders) {
			const result = decoder.decode(blob);
			if (result.ok) return result;
			else errors.push(result.error);
		}
		return err2(EITHER_PREFIX + errors.map((err3) => nest((/* @__PURE__ */ summarize(err3)).join("\n"))).join("\n"));
	});
}
// @__NO_SIDE_EFFECTS__
function oneOf(constants) {
	return /* @__PURE__ */ define((blob, ok2, err2) => {
		const index = constants.indexOf(blob);
		if (index !== -1) return ok2(constants[index]);
		return err2(`Must be one of ${constants.map((value) => /* @__PURE__ */ quote(value)).join(", ")}`);
	});
}
function lazyval(value) {
	return typeof value === "function" ? value() : value;
}
var null_ = /* @__PURE__ */ constant(null);
// @__NO_SIDE_EFFECTS__
function nullable(decoder, defaultValue) {
	const rv = /* @__PURE__ */ either(null_, decoder);
	return arguments.length >= 2 ? rv.transform((value) => value ?? lazyval(defaultValue)) : rv;
}
// @__NO_SIDE_EFFECTS__
function constant(value) {
	return /* @__PURE__ */ define((blob, ok2, err2) => blob === value ? ok2(value) : err2(`Must be ${typeof value === "symbol" ? String(value) : /* @__PURE__ */ quote(value)}`));
}
var url_re = /^[A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?:\/\/(?:[^@]*@)?[A-Za-z0-9.-]+(?::[0-9]{2,5})?(?:\/[-+~%/.,!$&'()*:;=@\w]*(?:\?[-+~%/.,!$&'()*:;=@?\w]*)?)?(?:#[^\s#]*)?$/;
var string = /* @__PURE__ */ define((blob, ok2, err2) => /* @__PURE__ */ isString(blob) ? ok2(blob) : err2("Must be string"));
// @__NO_SIDE_EFFECTS__
function regex(regex2, msg) {
	return string.refine((s) => regex2.test(s), msg);
}
var urlString = /* @__PURE__ */ regex(url_re, "Must be URL");
var date = /* @__PURE__ */ define((blob, ok2, err2) => {
	return /* @__PURE__ */ isDate(blob) ? ok2(blob) : err2("Must be a Date");
});
var number = /* @__PURE__ */ (/* @__PURE__ */ define((blob, ok2, err2) => /* @__PURE__ */ isNumber(blob) ? ok2(blob) : err2("Must be number"))).refine((n) => Number.isFinite(n), "Number must be finite");
// @__NO_SIDE_EFFECTS__
function between(min2, max2, decoder = number) {
	return decoder.reject((value) => value < min2 ? `Too low, must be between ${min2} and ${max2}` : value > max2 ? `Too high, must be between ${min2} and ${max2}` : null);
}
// istanbul ignore next -- @preserve
// istanbul ignore else -- @preserve
//#endregion
//#region ../schemas/libraries/decoders/download/index.ts
const imageDecoder = /* @__PURE__ */ object({
	id: number,
	created: date,
	title: /* @__PURE__ */ sized(string, {
		min: 1,
		max: 100
	}),
	type: /* @__PURE__ */ oneOf(["jpg", "png"]),
	size: number,
	url: urlString
});
(/* @__PURE__ */ object({
	id: number,
	created: date,
	title: /* @__PURE__ */ sized(string, {
		min: 1,
		max: 100
	}),
	brand: /* @__PURE__ */ sized(string, {
		min: 1,
		max: 30
	}),
	description: /* @__PURE__ */ sized(string, {
		min: 1,
		max: 500
	}),
	price: /* @__PURE__ */ between(1, 1e4),
	discount: /* @__PURE__ */ nullable(/* @__PURE__ */ between(1, 100)),
	quantity: /* @__PURE__ */ between(0, 10),
	tags: /* @__PURE__ */ array(/* @__PURE__ */ sized(string, {
		min: 1,
		max: 30
	})),
	images: /* @__PURE__ */ array(imageDecoder),
	ratings: /* @__PURE__ */ array(/* @__PURE__ */ object({
		id: number,
		stars: /* @__PURE__ */ between(1, 5),
		title: /* @__PURE__ */ sized(string, {
			min: 1,
			max: 100
		}),
		text: /* @__PURE__ */ sized(string, {
			min: 1,
			max: 1e3
		}),
		images: /* @__PURE__ */ array(imageDecoder)
	}))
})).verify({});
//#endregion
