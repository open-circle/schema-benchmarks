//#region ../node_modules/.pnpm/superstruct@2.0.2/node_modules/superstruct/dist/index.mjs
/**
* A `StructFailure` represents a single specific failure in validation.
*/
/**
* `StructError` objects are thrown (or returned) when validation fails.
*
* Validation logic is design to exit early for maximum performance. The error
* represents the first error encountered during validation. For more detail,
* the `error.failures` property is a generator function that can be run to
* continue validation and receive all the failures in the data.
*/
var StructError = class extends TypeError {
	constructor(failure, failures) {
		let cached;
		const { message, explanation, ...rest } = failure;
		const { path } = failure;
		const msg = path.length === 0 ? message : `At path: ${path.join(".")} -- ${message}`;
		super(explanation ?? msg);
		if (explanation != null) this.cause = msg;
		Object.assign(this, rest);
		this.name = this.constructor.name;
		this.failures = () => {
			return cached ?? (cached = [failure, ...failures()]);
		};
	}
};
/**
* Check if a value is an iterator.
*/
function isIterable(x) {
	return isObject(x) && typeof x[Symbol.iterator] === "function";
}
/**
* Check if a value is a plain object.
*/
function isObject(x) {
	return typeof x === "object" && x != null;
}
/**
* Check if a value is a non-array object.
*/
function isNonArrayObject(x) {
	return isObject(x) && !Array.isArray(x);
}
/**
* Return a value as a printable string.
*/
function print(value) {
	if (typeof value === "symbol") return value.toString();
	return typeof value === "string" ? JSON.stringify(value) : `${value}`;
}
/**
* Shifts (removes and returns) the first value from the `input` iterator.
* Like `Array.prototype.shift()` but for an `Iterator`.
*/
function shiftIterator(input) {
	const { done, value } = input.next();
	return done ? void 0 : value;
}
/**
* Convert a single validation result to a failure.
*/
function toFailure(result, context, struct, value) {
	if (result === true) return;
	else if (result === false) result = {};
	else if (typeof result === "string") result = { message: result };
	const { path, branch } = context;
	const { type } = struct;
	const { refinement, message = `Expected a value of type \`${type}\`${refinement ? ` with refinement \`${refinement}\`` : ""}, but received: \`${print(value)}\`` } = result;
	return {
		value,
		type,
		refinement,
		key: path[path.length - 1],
		path,
		branch,
		...result,
		message
	};
}
/**
* Convert a validation result to an iterable of failures.
*/
function* toFailures(result, context, struct, value) {
	if (!isIterable(result)) result = [result];
	for (const r of result) {
		const failure = toFailure(r, context, struct, value);
		if (failure) yield failure;
	}
}
/**
* Check a value against a struct, traversing deeply into nested values, and
* returning an iterator of failures or success.
*/
function* run(value, struct, options = {}) {
	const { path = [], branch = [value], coerce = false, mask = false } = options;
	const ctx = {
		path,
		branch,
		mask
	};
	if (coerce) value = struct.coercer(value, ctx);
	let status = "valid";
	for (const failure of struct.validator(value, ctx)) {
		failure.explanation = options.message;
		status = "not_valid";
		yield [failure, void 0];
	}
	for (let [k, v, s] of struct.entries(value, ctx)) {
		const ts = run(v, s, {
			path: k === void 0 ? path : [...path, k],
			branch: k === void 0 ? branch : [...branch, v],
			coerce,
			mask,
			message: options.message
		});
		for (const t of ts) if (t[0]) {
			status = t[0].refinement != null ? "not_refined" : "not_valid";
			yield [t[0], void 0];
		} else if (coerce) {
			v = t[1];
			if (k === void 0) value = v;
			else if (value instanceof Map) value.set(k, v);
			else if (value instanceof Set) value.add(v);
			else if (isObject(value)) {
				if (v !== void 0 || k in value) value[k] = v;
			}
		}
	}
	if (status !== "not_valid") for (const failure of struct.refiner(value, ctx)) {
		failure.explanation = options.message;
		status = "not_refined";
		yield [failure, void 0];
	}
	if (status === "valid") yield [void 0, value];
}
/**
* `Struct` objects encapsulate the validation logic for a specific type of
* values. Once constructed, you use the `assert`, `is` or `validate` helpers to
* validate unknown input data against the struct.
*/
var Struct = class {
	constructor(props) {
		const { type, schema, validator, refiner, coercer = (value) => value, entries = function* () {} } = props;
		this.type = type;
		this.schema = schema;
		this.entries = entries;
		this.coercer = coercer;
		if (validator) this.validator = (value, context) => {
			return toFailures(validator(value, context), context, this, value);
		};
		else this.validator = () => [];
		if (refiner) this.refiner = (value, context) => {
			return toFailures(refiner(value, context), context, this, value);
		};
		else this.refiner = () => [];
	}
	/**
	* Assert that a value passes the struct's validation, throwing if it doesn't.
	*/
	assert(value, message) {
		return assert(value, this, message);
	}
	/**
	* Create a value with the struct's coercion logic, then validate it.
	*/
	create(value, message) {
		return create(value, this, message);
	}
	/**
	* Check if a value passes the struct's validation.
	*/
	is(value) {
		return is(value, this);
	}
	/**
	* Mask a value, coercing and validating it, but returning only the subset of
	* properties defined by the struct's schema. Masking applies recursively to
	* props of `object` structs only.
	*/
	mask(value, message) {
		return mask(value, this, message);
	}
	/**
	* Validate a value with the struct's validation logic, returning a tuple
	* representing the result.
	*
	* You may optionally pass `true` for the `coerce` argument to coerce
	* the value before attempting to validate it. If you do, the result will
	* contain the coerced result when successful. Also, `mask` will turn on
	* masking of the unknown `object` props recursively if passed.
	*/
	validate(value, options = {}) {
		return validate(value, this, options);
	}
};
/**
* Assert that a value passes a struct, throwing if it doesn't.
*/
function assert(value, struct, message) {
	const result = validate(value, struct, { message });
	if (result[0]) throw result[0];
}
/**
* Create a value with the coercion logic of struct and validate it.
*/
function create(value, struct, message) {
	const result = validate(value, struct, {
		coerce: true,
		message
	});
	if (result[0]) throw result[0];
	else return result[1];
}
/**
* Mask a value, returning only the subset of properties defined by a struct.
*/
function mask(value, struct, message) {
	const result = validate(value, struct, {
		coerce: true,
		mask: true,
		message
	});
	if (result[0]) throw result[0];
	else return result[1];
}
/**
* Check if a value passes a struct.
*/
function is(value, struct) {
	return !validate(value, struct)[0];
}
/**
* Validate a value against a struct, returning an error if invalid, or the
* value (with potential coercion) if valid.
*/
function validate(value, struct, options = {}) {
	const tuples = run(value, struct, options);
	const tuple = shiftIterator(tuples);
	if (tuple[0]) return [new StructError(tuple[0], function* () {
		for (const t of tuples) if (t[0]) yield t[0];
	}), void 0];
	else return [void 0, tuple[1]];
}
/**
* Define a new struct type with a custom validation function.
*/
function define(name, validator) {
	return new Struct({
		type: name,
		schema: null,
		validator
	});
}
function array(Element) {
	return new Struct({
		type: "array",
		schema: Element,
		*entries(value) {
			if (Element && Array.isArray(value)) for (const [i, v] of value.entries()) yield [
				i,
				v,
				Element
			];
		},
		coercer(value) {
			return Array.isArray(value) ? value.slice() : value;
		},
		validator(value) {
			return Array.isArray(value) || `Expected an array value, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is a valid `Date`.
*
* Note: this also ensures that the value is *not* an invalid `Date` object,
* which can occur when parsing a date fails but still returns a `Date`.
*/
function date() {
	return define("date", (value) => {
		return value instanceof Date && !isNaN(value.getTime()) || `Expected a valid \`Date\` object, but received: ${print(value)}`;
	});
}
function enums(values) {
	const schema = {};
	const description = values.map((v) => print(v)).join();
	for (const key of values) schema[key] = key;
	return new Struct({
		type: "enums",
		schema,
		validator(value) {
			return values.includes(value) || `Expected one of \`${description}\`, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that no value ever passes validation.
*/
function never() {
	return define("never", () => false);
}
/**
* Augment an existing struct to allow `null` values.
*/
function nullable(struct) {
	return new Struct({
		...struct,
		validator: (value, ctx) => value === null || struct.validator(value, ctx),
		refiner: (value, ctx) => value === null || struct.refiner(value, ctx)
	});
}
/**
* Ensure that a value is a number.
*/
function number() {
	return define("number", (value) => {
		return typeof value === "number" && !isNaN(value) || `Expected a number, but received: ${print(value)}`;
	});
}
function object(schema) {
	const knowns = schema ? Object.keys(schema) : [];
	const Never = never();
	return new Struct({
		type: "object",
		schema: schema ? schema : null,
		*entries(value) {
			if (schema && isObject(value)) {
				const unknowns = new Set(Object.keys(value));
				for (const key of knowns) {
					unknowns.delete(key);
					yield [
						key,
						value[key],
						schema[key]
					];
				}
				for (const key of unknowns) yield [
					key,
					value[key],
					Never
				];
			}
		},
		validator(value) {
			return isNonArrayObject(value) || `Expected an object, but received: ${print(value)}`;
		},
		coercer(value, ctx) {
			if (!isNonArrayObject(value)) return value;
			const coerced = { ...value };
			if (ctx.mask && schema) {
				for (const key in coerced) if (schema[key] === void 0) delete coerced[key];
			}
			return coerced;
		}
	});
}
/**
* Ensure that a value is a string.
*/
function string() {
	return define("string", (value) => {
		return typeof value === "string" || `Expected a string, but received: ${print(value)}`;
	});
}
/**
* Ensure that a number or date is below a threshold.
*/
function max(struct, threshold, options = {}) {
	const { exclusive } = options;
	return refine(struct, "max", (value) => {
		return exclusive ? value < threshold : value <= threshold || `Expected a ${struct.type} less than ${exclusive ? "" : "or equal to "}${threshold} but received \`${value}\``;
	});
}
/**
* Ensure that a number or date is above a threshold.
*/
function min(struct, threshold, options = {}) {
	const { exclusive } = options;
	return refine(struct, "min", (value) => {
		return exclusive ? value > threshold : value >= threshold || `Expected a ${struct.type} greater than ${exclusive ? "" : "or equal to "}${threshold} but received \`${value}\``;
	});
}
/**
* Augment a `Struct` to add an additional refinement to the validation.
*
* The refiner function is guaranteed to receive a value of the struct's type,
* because the struct's existing validation will already have passed. This
* allows you to layer additional validation on top of existing structs.
*/
function refine(struct, name, refiner) {
	return new Struct({
		...struct,
		*refiner(value, ctx) {
			yield* struct.refiner(value, ctx);
			const failures = toFailures(refiner(value, ctx), ctx, struct, value);
			for (const failure of failures) yield {
				...failure,
				refinement: name
			};
		}
	});
}
//#endregion
//#region ../schemas/libraries/superstruct/download.ts
function stringWithLength(min, max) {
	return refine(string(), `string with length between ${min} and ${max}`, (value) => value.length >= min && value.length <= max);
}
const urlSchema = refine(string(), "url", (value) => URL.canParse(value));
const imageSchema = object({
	id: number(),
	created: date(),
	title: stringWithLength(1, 100),
	type: enums(["jpg", "png"]),
	size: number(),
	url: urlSchema
});
const ratingSchema = object({
	id: number(),
	stars: max(min(number(), 0), 5),
	title: stringWithLength(1, 100),
	text: stringWithLength(1, 1e3),
	images: array(imageSchema)
});
create({}, object({
	id: number(),
	created: date(),
	title: stringWithLength(1, 100),
	brand: stringWithLength(1, 30),
	description: stringWithLength(1, 500),
	price: max(min(number(), 1), 1e4),
	discount: nullable(max(min(number(), 1), 100)),
	quantity: max(min(number(), 0), 10),
	tags: array(stringWithLength(1, 30)),
	images: array(imageSchema),
	ratings: array(ratingSchema)
}));
//#endregion
