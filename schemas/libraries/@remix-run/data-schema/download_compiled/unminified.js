//#region ../node_modules/.pnpm/@remix-run+data-schema@0.3.0/node_modules/@remix-run/data-schema/dist/lib/schema.js
/**
* Creates a sync Standard Schema-compatible schema from a validation function.
*
* @param validator Validator that returns either a parsed value or validation issues.
* @returns A chainable schema object.
*/
function createSchema(validator) {
	let schema = {
		"~standard": {
			version: 1,
			vendor: "data-schema",
			validate(value, options) {
				return validator(value, {
					path: [],
					options
				});
			}
		},
		"~run"(value, context) {
			return validator(value, context);
		},
		pipe(...checks) {
			if (checks.length === 0) return schema;
			return createSchema(function validate(value, context) {
				let result = schema["~run"](value, context);
				if (result.issues) return result;
				for (let check of checks) if (!check.check(result.value)) {
					if (!check.code) return { issues: [createIssue(check.message ?? "Check failed", context.path)] };
					return { issues: [createIssueFromContext(context, {
						code: check.code,
						defaultMessage: check.message ?? "Check failed",
						input: result.value,
						values: check.values
					})] };
				}
				return result;
			});
		},
		refine(predicate, message) {
			return createSchema(function validate(value, context) {
				let result = schema["~run"](value, context);
				if (result.issues) return result;
				if (!predicate(result.value)) {
					if (message !== void 0) return { issues: [createIssue(message, context.path)] };
					return { issues: [createIssueFromContext(context, {
						code: "refine.failed",
						defaultMessage: "Refinement failed",
						input: result.value
					})] };
				}
				return result;
			});
		},
		transform(transformer) {
			return createSchema(function validate(value, context) {
				let result = schema["~run"](value, context);
				if (result.issues) return result;
				return { value: transformer(result.value) };
			});
		}
	};
	return schema;
}
function shouldAbortEarly(options) {
	let libraryAbortEarly = options?.libraryOptions?.abortEarly;
	let abortEarly = options?.abortEarly ?? libraryAbortEarly;
	return Boolean(abortEarly);
}
function withPath(path, key) {
	return path.length === 0 ? [key] : [...path, key];
}
function getErrorMap(options) {
	let libraryErrorMap = options?.libraryOptions?.errorMap;
	if (typeof options?.errorMap === "function") return options.errorMap;
	if (typeof libraryErrorMap === "function") return libraryErrorMap;
}
function getLocale(options) {
	let libraryLocale = options?.libraryOptions?.locale;
	if (typeof options?.locale === "string") return options.locale;
	if (typeof libraryLocale === "string") return libraryLocale;
}
function resolveIssueMessage(options, context) {
	let errorMap = getErrorMap(options);
	if (!errorMap) return context.defaultMessage;
	return errorMap(context) ?? context.defaultMessage;
}
function createIssueFromContext(context, descriptor) {
	let path = descriptor.path ?? context.path;
	return createIssue(resolveIssueMessage(context.options, {
		code: descriptor.code,
		defaultMessage: descriptor.defaultMessage,
		path,
		values: descriptor.values,
		input: descriptor.input,
		locale: getLocale(context.options)
	}), path);
}
/**
* Creates a Standard Schema issue object.
*
* @param message Human-readable validation message.
* @param path Optional issue path within the input value.
* @returns A Standard Schema issue.
*/
function createIssue(message, path) {
	return !path || path.length === 0 ? { message } : {
		message,
		path
	};
}
/**
* Creates a Standard Schema failure result with a single issue.
*
* @param message Human-readable validation message.
* @param path Optional issue path within the input value.
* @param options Optional issue metadata used for localized error mapping.
* @param options.code Optional error code passed to the error map.
* @param options.values Optional values passed to the error map.
* @param options.input Optional input value passed to the error map.
* @param options.parseOptions Optional parse options used for localization and error mapping.
* @returns A failure result containing one issue.
*/
function fail(message, path, options) {
	if (!options?.code) return { issues: [createIssue(message, path)] };
	return { issues: [createIssue(resolveIssueMessage(options.parseOptions, {
		code: options.code,
		defaultMessage: message,
		path,
		values: options.values,
		input: options.input,
		locale: getLocale(options.parseOptions)
	}), path)] };
}
/**
* Create a schema that validates an array by validating each element with `elementSchema`.
*
* @param elementSchema The schema to validate each element
* @returns A schema that produces an array of validated outputs
*/
function array(elementSchema) {
	return createSchema(function validate(value, context) {
		if (!Array.isArray(value)) return fail("Expected array", context.path, {
			code: "type.array",
			input: value,
			parseOptions: context.options
		});
		let abortEarly = shouldAbortEarly(context.options);
		let issues = [];
		let outputValues = [];
		let index = 0;
		for (let item of value) {
			let result = elementSchema["~run"](item, {
				path: withPath(context.path, index),
				options: context.options
			});
			if (result.issues) {
				if (abortEarly) return result;
				issues.push(...result.issues);
			} else outputValues.push(result.value);
			index += 1;
		}
		if (issues.length > 0) return { issues };
		return { value: outputValues };
	});
}
/**
* Create a schema that accepts one of the given values using strict equality (`===`).
*
* @param values The allowed values
* @returns A schema that produces the union of allowed value types
*/
function enum_(values) {
	return createSchema(function validate(value, context) {
		for (let allowed of values) if (value === allowed) return { value };
		return fail("Expected one of: " + values.map(String).join(", "), context.path, {
			code: "enum.invalid_value",
			input: value,
			values: { values: [...values] },
			parseOptions: context.options
		});
	});
}
/**
* Create a schema that validates a value is an instance of a class.
*
* @param constructor The class constructor to check against
* @returns A schema that produces the instance type
*/
function instanceof_(constructor) {
	return createSchema(function validate(value, context) {
		if (!(value instanceof constructor)) return fail("Expected instance of " + constructor.name, context.path, {
			code: "instanceof.invalid_type",
			input: value,
			values: { constructorName: constructor.name },
			parseOptions: context.options
		});
		return { value };
	});
}
/**
* Allow `null` as an input value, short-circuiting validation when `null` is provided.
*
* @param schema The wrapped schema
* @returns A schema that accepts `null` in addition to the wrapped schema
*/
function nullable(schema) {
	return createSchema(function validate(value, context) {
		if (value === null) return { value: null };
		return schema["~run"](value, context);
	});
}
/**
* Create a schema that accepts finite numbers (excluding `NaN` and `Infinity`).
*
* @returns A schema that produces a `number`
*/
function number() {
	return createSchema(function validate(value, context) {
		if (typeof value !== "number" || !Number.isFinite(value)) return fail("Expected number", context.path, {
			code: "type.number",
			input: value,
			parseOptions: context.options
		});
		return { value };
	});
}
/**
* Create a schema that validates an object with a fixed shape.
*
* By default, unknown keys are stripped. You can change this via `options.unknownKeys`.
*
* @param shape A mapping of keys to schemas
* @param options Controls unknown key behavior
* @returns A schema that produces a typed object matching the shape
*/
function object(shape, options) {
	return createSchema(function validate(value, context) {
		if (typeof value !== "object" || value === null || Array.isArray(value)) return fail("Expected object", context.path, {
			code: "type.object",
			input: value,
			parseOptions: context.options
		});
		let abortEarly = shouldAbortEarly(context.options);
		let issues = [];
		let outputValues = {};
		let input = value;
		let unknownKeys = options?.unknownKeys ?? "strip";
		for (let key of Object.keys(shape)) {
			let result = shape[key]["~run"](input[key], {
				path: withPath(context.path, key),
				options: context.options
			});
			if (result.issues) {
				if (abortEarly) return result;
				issues.push(...result.issues);
			} else if (Object.prototype.hasOwnProperty.call(input, key) || result.value !== void 0) outputValues[key] = result.value;
		}
		if (unknownKeys === "passthrough" || unknownKeys === "error") for (let key in input) {
			if (!Object.prototype.hasOwnProperty.call(input, key)) continue;
			if (Object.prototype.hasOwnProperty.call(shape, key)) continue;
			if (unknownKeys === "passthrough") outputValues[key] = input[key];
			else {
				let issue = createIssueFromContext(context, {
					code: "object.unknown_key",
					defaultMessage: "Unknown key",
					input: input[key],
					path: withPath(context.path, key),
					values: { key }
				});
				if (abortEarly) return { issues: [issue] };
				issues.push(issue);
			}
		}
		if (issues.length > 0) return { issues };
		return { value: outputValues };
	});
}
/**
* Create a schema that accepts strings.
*
* @returns A schema that produces a `string`
*/
function string() {
	return createSchema(function validate(value, context) {
		if (typeof value !== "string") return fail("Expected string", context.path, {
			code: "type.string",
			input: value,
			parseOptions: context.options
		});
		return { value };
	});
}
/**
* Error thrown by {@link parse} when validation fails.
*/
var ValidationError = class extends Error {
	/**
	* The validation issues produced by the schema.
	*/
	issues;
	/**
	* @param issues The issues produced by schema validation
	* @param message Optional error message (defaults to "Validation failed")
	*/
	constructor(issues, message = "Validation failed") {
		super(message);
		this.name = "ValidationError";
		this.issues = issues;
	}
};
/**
* Validate a value and return the typed output or throw a {@link ValidationError}.
*
* @param schema The schema to validate against
* @param value The value to validate
* @param options Validation options
* @returns The validated output value
* @throws {ValidationError} If validation fails
*/
function parse(schema, value, options) {
	let result = schema["~standard"].validate(value, options);
	if (result.issues) throw new ValidationError(result.issues);
	return result.value;
}
//#endregion
//#region ../node_modules/.pnpm/@remix-run+data-schema@0.3.0/node_modules/@remix-run/data-schema/dist/lib/checks.js
/**
* Require a string to be at least `length` characters long.
*
* @param length The minimum number of characters
* @returns A {@link Check} that enforces the minimum length
*/
function minLength(length) {
	return {
		check(value) {
			return value.length >= length;
		},
		code: "string.min_length",
		values: { min: length },
		message: "Expected at least " + String(length) + " characters"
	};
}
/**
* Require a string to be at most `length` characters long.
*
* @param length The maximum number of characters
* @returns A {@link Check} that enforces the maximum length
*/
function maxLength(length) {
	return {
		check(value) {
			return value.length <= length;
		},
		code: "string.max_length",
		values: { max: length },
		message: "Expected at most " + String(length) + " characters"
	};
}
/**
* Require a string to be a valid URL.
*
* @returns A {@link Check} that validates URL-like strings
*/
function url() {
	return {
		check(value) {
			try {
				new URL(value);
				return true;
			} catch {
				return false;
			}
		},
		code: "string.url",
		message: "Expected valid URL"
	};
}
/**
* Require a number to be greater than or equal to `limit`.
*
* @param limit The inclusive minimum value
* @returns A {@link Check} that enforces the lower bound
*/
function min(limit) {
	return {
		check(value) {
			return value >= limit;
		},
		code: "number.min",
		values: { min: limit },
		message: "Expected number greater than or equal to " + String(limit)
	};
}
/**
* Require a number to be less than or equal to `limit`.
*
* @param limit The inclusive maximum value
* @returns A {@link Check} that enforces the upper bound
*/
function max(limit) {
	return {
		check(value) {
			return value <= limit;
		},
		code: "number.max",
		values: { max: limit },
		message: "Expected number less than or equal to " + String(limit)
	};
}
//#endregion
//#region ../schemas/libraries/@remix-run/data-schema/download.ts
const imageSchema = object({
	id: number(),
	created: instanceof_(Date),
	title: string().pipe(minLength(1), maxLength(100)),
	type: enum_(["jpg", "png"]),
	size: number(),
	url: string().pipe(url())
});
const ratingSchema = object({
	id: number(),
	stars: number().pipe(min(1), max(5)),
	title: string().pipe(minLength(1), maxLength(100)),
	text: string().pipe(minLength(1), maxLength(1e3)),
	images: array(imageSchema)
});
parse(object({
	id: number(),
	created: instanceof_(Date),
	title: string().pipe(minLength(1), maxLength(100)),
	brand: string().pipe(minLength(1), maxLength(30)),
	description: string().pipe(minLength(1), maxLength(500)),
	price: number().pipe(min(1), max(1e4)),
	discount: nullable(number().pipe(min(1), max(100))),
	quantity: number().pipe(min(0), max(10)),
	tags: array(string().pipe(minLength(1), maxLength(30))),
	images: array(imageSchema),
	ratings: array(ratingSchema)
}), {});
//#endregion
