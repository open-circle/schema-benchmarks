//#region ../node_modules/.pnpm/decoders@2.9.3/node_modules/decoders/dist/index.js
/* @__NO_SIDE_EFFECTS__ */
function qty(n, unit) {
	return n === 1 ? `${n} ${unit}` : `${n} ${unit}s`;
}
/* @__NO_SIDE_EFFECTS__ */
function isNumber(value) {
	return typeof value === "number";
}
/* @__NO_SIDE_EFFECTS__ */
function isString(value) {
	return typeof value === "string";
}
/* @__NO_SIDE_EFFECTS__ */
function isDate(value) {
	return !!value && Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value);
}
/* @__NO_SIDE_EFFECTS__ */
function isPromiseLike(value) {
	return typeof value === "object" && value !== null && "then" in value && typeof value.then === "function";
}
/* @__NO_SIDE_EFFECTS__ */
function isPlainObject(value) {
	return value !== null && typeof value === "object" && Object.prototype.toString.call(value) === "[object Object]";
}
var kAnnotationRegistry = /* @__PURE__ */ Symbol.for("decoders.kAnnotationRegistry");
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
	for (const value of arr) items.push(__annotate(value, void 0, seen));
	return makeArrayAnn(items, text);
}
function annotateObject(obj, text, seen) {
	seen.add(obj);
	const fields = /* @__PURE__ */ new Map();
	for (const key of Object.keys(obj)) {
		const value = obj[key];
		fields.set(key, __annotate(value, void 0, seen));
	}
	return makeObjectAnn(fields, text);
}
function __annotate(value, text, seen) {
	if (value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "symbol" || typeof value === "bigint" || typeof value.getMonth === "function") return makeScalarAnn(value, text);
	if (isAnnotation(value)) return updateText(value, text);
	if (Array.isArray(value)) if (seen.has(value)) return makeOpaqueAnn("<circular ref>", text);
	else return annotateArray(value, text, seen);
	if (/* @__PURE__ */ isPlainObject(value)) if (seen.has(value)) return makeOpaqueAnn("<circular ref>", text);
	else return annotateObject(value, text, seen);
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
/* @__NO_SIDE_EFFECTS__ */
function isMultiline(s) {
	return s.includes("\n");
}
/* @__NO_SIDE_EFFECTS__ */
function indent(s, prefix = INDENT) {
	if (/* @__PURE__ */ isMultiline(s)) return s.split("\n").map((line) => `${prefix}${line}`).join("\n");
	else return `${prefix}${s}`;
}
var quotePattern = /'/g;
/* @__NO_SIDE_EFFECTS__ */
function quote(value) {
	return typeof value === "string" ? "'" + value.replace(quotePattern, "\\'") + "'" : value === void 0 ? "undefined" : JSON.stringify(value);
}
/* @__NO_SIDE_EFFECTS__ */
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
/* @__NO_SIDE_EFFECTS__ */
function ok(value) {
	return {
		ok: true,
		value,
		error: void 0
	};
}
/* @__NO_SIDE_EFFECTS__ */
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
/* @__NO_SIDE_EFFECTS__ */
function define(fn) {
	function decode(blob) {
		const makeFlexErr = (msg) => /* @__PURE__ */ err(isAnnotation(msg) ? msg : public_annotate(blob, msg));
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
		return chain(noThrow(transformFn));
	}
	function refine(predicateFn, errmsg) {
		return reject((value2) => predicateFn(value2) ? null : errmsg);
	}
	function refineType() {
		return self;
	}
	function chain(next) {
		return /* @__PURE__ */ define((blob, ok2, err2) => {
			const r1 = decode(blob);
			if (!r1.ok) return r1;
			const r2 = /* @__PURE__ */ isDecoder(next) ? next : next(r1.value, ok2, err2);
			return /* @__PURE__ */ isDecoder(r2) ? r2.decode(r1.value) : r2;
		});
	}
	function pipe(next) {
		return chain(next);
	}
	function reject(rejectFn) {
		return chain((blob, ok2, err2) => {
			const errmsg = rejectFn(blob);
			return errmsg === null ? ok2(blob) : err2(typeof errmsg === "string" ? public_annotate(blob, errmsg) : errmsg);
		});
	}
	function describe(message) {
		return /* @__PURE__ */ define((blob, _, err2) => {
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
		chain,
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
var kDecoderRegistry = /* @__PURE__ */ Symbol.for("decoders.kDecoderRegistry");
var _register2 = globalThis[kDecoderRegistry] ??= /* @__PURE__ */ new WeakSet();
function brand2(decoder) {
	_register2.add(decoder);
	return decoder;
}
/* @__NO_SIDE_EFFECTS__ */
function isDecoder(value) {
	return _register2.has(value);
}
var poja = /* @__PURE__ */ define((blob, ok2, err2) => {
	if (!Array.isArray(blob)) return err2("Must be an array");
	return ok2(blob);
});
/* @__NO_SIDE_EFFECTS__ */
function array(decoder) {
	const decodeFn = decoder.decode;
	return poja.chain((inputs, ok2, err2) => {
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
/* @__NO_SIDE_EFFECTS__ */
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
/* @__NO_SIDE_EFFECTS__ */
function sized(decoder, options) {
	return decoder.reject(/* @__PURE__ */ bySizeOptions(options));
}
/* @__NO_SIDE_EFFECTS__ */
function difference(xs, ys) {
	const result = /* @__PURE__ */ new Set();
	for (const x of xs) if (!ys.has(x)) result.add(x);
	return result;
}
var pojo = /* @__PURE__ */ define((blob, ok2, err2) => /* @__PURE__ */ isPlainObject(blob) ? ok2(blob) : err2("Must be an object"));
/* @__NO_SIDE_EFFECTS__ */
function object(decoders) {
	const knownKeys = new Set(Object.keys(decoders));
	return pojo.chain((plainObj, ok2, err2) => {
		const missingKeys = /* @__PURE__ */ difference(knownKeys, new Set(Object.keys(plainObj)));
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
	return `-${(/* @__PURE__ */ indent(s)).substring(1)}`;
}
function nest(errText) {
	return errText.startsWith(EITHER_PREFIX) ? errText.substring(EITHER_PREFIX.length) : itemize(errText);
}
/* @__NO_SIDE_EFFECTS__ */
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
/* @__NO_SIDE_EFFECTS__ */
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
/* @__NO_SIDE_EFFECTS__ */
function nullable(decoder, defaultValue) {
	const rv = /* @__PURE__ */ either(null_, decoder);
	return arguments.length >= 2 ? rv.transform((value) => value ?? lazyval(defaultValue)) : rv;
}
/* @__NO_SIDE_EFFECTS__ */
function constant(value) {
	return /* @__PURE__ */ define((blob, ok2, err2) => blob === value ? ok2(value) : err2(`Must be ${typeof value === "symbol" ? String(value) : /* @__PURE__ */ quote(value)}`));
}
var url_re = /^([A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?):\/\/(?:([^@:]*:?(?:[^@]+)?)@)?(?:([A-Za-z0-9.-]+)(?::([0-9]{2,5}))?)(\/(?:[-+~%/.,!$&'()*:;=@\w]*)?(?:\?[-+~%/.,!$&'()*:;=@?\w]*)?)?(?:#[^\s#]*)?$/;
var string = /* @__PURE__ */ define((blob, ok2, err2) => /* @__PURE__ */ isString(blob) ? ok2(blob) : err2("Must be string"));
/* @__NO_SIDE_EFFECTS__ */
function regex(regex2, msg) {
	return string.refine((s) => regex2.test(s), msg);
}
var urlString = /* @__PURE__ */ regex(url_re, "Must be URL");
var date = /* @__PURE__ */ define((blob, ok2, err2) => {
	return /* @__PURE__ */ isDate(blob) ? ok2(blob) : err2("Must be a Date");
});
var number = /* @__PURE__ */ (/* @__PURE__ */ define((blob, ok2, err2) => /* @__PURE__ */ isNumber(blob) ? ok2(blob) : err2("Must be number"))).refine((n) => Number.isFinite(n), "Number must be finite");
/* @__NO_SIDE_EFFECTS__ */
function between(min2, max2, decoder = number) {
	return decoder.reject((value) => value < min2 ? `Too low, must be between ${min2} and ${max2}` : value > max2 ? `Too high, must be between ${min2} and ${max2}` : null);
}
// istanbul ignore else -- @preserve
//#endregion
//#region ../schemas/libraries/decoders/download.ts
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
	quantity: /* @__PURE__ */ between(1, 10),
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
