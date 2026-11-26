// ../node_modules/.pnpm/@railway-ts+pipelines@0.6.0_typescript@7.0.2/node_modules/@railway-ts/pipelines/dist/option-BwSKfXch.mjs
/**
* Symbol used to identify Result objects.
*
* Not meant to be used directly, but it must stay in the published type
* declarations: `Result` refers to it, and without it a plain
* `{ ok: true, value }` object would type-check as a `Result`.
*
* `Symbol.for` makes every copy of this module (each entry point, or a second
* installed copy of the package) share one symbol, so Results compare equal no
* matter which copy created them.
*/
const RESULT_BRAND = Symbol.for("@railway-ts/pipelines/RESULT_BRAND");
/**
* Creates a Result containing a value.
*
* @example
* const result: Result<number, string> = ok(123);
*
* @param value - The value to contain
* @returns A Result containing the value
*/
function ok(value) {
	return {
		ok: true,
		value,
		[RESULT_BRAND]: "ok"
	};
}
/**
* Creates a Result containing an error.
*
* @example
* const error: Result<number, string> = err("An error occurred");
*
* @param error - The error to contain
* @returns A Result containing the error
*/
function err(error) {
	return {
		ok: false,
		error,
		[RESULT_BRAND]: "error"
	};
}
/**
* Type guard that checks if a Result is an Ok variant containing a value.
*
* @example
* const result: Result<number, string> = ok(123);
* if (isOk(result)) {
*   // TypeScript knows result.value exists here
*   console.log(result.value);
* }
*
* @param result - The result to check
* @returns A type predicate indicating if the result is an Ok variant
*/
function isOk(result) {
	return result.ok;
}
/**
* Type guard that checks if a Result is an Error variant.
*
* @example
* const result: Result<number, string> = err("error");
* if (isErr(result)) {
*   // TypeScript knows result.error exists here
*   console.log(result.error);
* }
*
* @param result - The result to check
* @returns A type predicate indicating if the result is an Error variant
*/
function isErr(result) {
	return !result.ok;
}
// ../node_modules/.pnpm/@railway-ts+pipelines@0.6.0_typescript@7.0.2/node_modules/@railway-ts/pipelines/dist/schema/index.mjs
let _abortEarly = false;
/** @internal */
function _getAbortEarly() {
	return _abortEarly;
}
/** @internal - Sets abortEarly for the duration of fn's synchronous execution */
function _withAbortEarly(enabled, fn) {
	const prev = _abortEarly;
	_abortEarly = enabled;
	try {
		return fn();
	} finally {
		_abortEarly = prev;
	}
}
function object(schema, { strict = true } = {}) {
	return (obj, parentPath = []) => {
		if (obj === null || typeof obj !== "object") return err([{
			path: parentPath,
			message: "Expected an object"
		}]);
		const abortEarly = _getAbortEarly();
		const allErrors = [];
		const validatedObj = {};
		if (strict !== false) {
			const extraKeys = Object.keys(obj).filter((key) => !Object.hasOwn(schema, key));
			if (extraKeys.length > 0) {
				if (abortEarly) return err([{
					path: [...parentPath, extraKeys[0]],
					message: `Unexpected field: '${extraKeys[0]}'`
				}]);
				for (const key of extraKeys) allErrors.push({
					path: [...parentPath, key],
					message: `Unexpected field: '${key}'`
				});
			}
		}
		if (abortEarly && allErrors.length > 0) return err(allErrors);
		const pendingResults = [];
		for (const key in schema) {
			if (!Object.hasOwn(schema, key)) continue;
			const validator = schema[key];
			if (!validator) continue;
			if (abortEarly && allErrors.length > 0) break;
			const present = Object.hasOwn(obj, key);
			const result = validator(present ? obj[key] : void 0, [...parentPath, key]);
			if (result instanceof Promise) {
				if (abortEarly && allErrors.length > 0) continue;
				pendingResults.push(result.then((r) => {
					if (isOk(r)) {
						if (present || r.value !== void 0) validatedObj[key] = r.value;
					} else allErrors.push(...r.error);
				}));
			} else if (isOk(result)) {
				if (present || result.value !== void 0) validatedObj[key] = result.value;
			} else {
				allErrors.push(...result.error);
				if (abortEarly) break;
			}
		}
		if (pendingResults.length > 0) return Promise.all(pendingResults).then(() => {
			if (allErrors.length > 0) return err(allErrors);
			return ok(validatedObj);
		});
		if (allErrors.length > 0) return err(allErrors);
		return ok(validatedObj);
	};
}
function required(validator, message = "Field is required") {
	return (value, path = []) => {
		if (value === void 0 || value === null) return err([{
			path,
			message
		}]);
		return validator(value, path);
	};
}
/**
* Create a validator that only accepts null values.
*
* @example
* const validate = nullable();
* validate(null);        // ok(null)
* validate('some value'); // err([{ path: [], message: 'Must be null' }])
*
* @param message - Custom error message
* @returns A validator that ensures the value is exactly null
*/
function nullable(message = "Must be null") {
	return (value, path = []) => {
		if (value !== null) return err([{
			path,
			message
		}]);
		return ok(null);
	};
}
/**
* Combine multiple validators into a single validator, applying them in sequence.
* Each validator's output feeds into the next. Short-circuits on first error.
*
* @example
* const validate = chain(string(), nonEmpty(), minLength(8));
* validate('password123'); // ok("password123")
* validate('abc');         // err([{ path: [], message: 'Must be at least 8 characters' }])
*
* @param validators - A list of validators to compose
* @returns A combined validator that applies all validators in sequence
*/
function chain(...validators) {
	return (value, path = []) => {
		let result = ok(value);
		for (const validator of validators) {
			if (isErr(result)) return result;
			const nextResult = validator(result.value, path);
			result = isErr(nextResult) ? nextResult : ok(nextResult.value);
		}
		return result;
	};
}
function validate(value, validator, pathOrOptions = [], maybeOptions) {
	const path = Array.isArray(pathOrOptions) ? pathOrOptions : [];
	if ((Array.isArray(pathOrOptions) ? maybeOptions : pathOrOptions)?.abortEarly) return _withAbortEarly(true, () => validator(value, path));
	return validator(value, path);
}
/**
* Create a validator that ensures a value is a string.
*
* @example
* const validate = string();
* validate('John'); // ok("John")
* validate(42);     // err([{ path: [], message: 'Must be a string' }])
*
* @param message - Custom error message
* @returns A validator that checks if a value is a string
*/
function string(message = "Must be a string") {
	return (value, path = []) => {
		if (typeof value !== "string") return err([{
			path,
			message
		}]);
		return ok(value);
	};
}
/**
* Create a validator that ensures a string's length is at least a minimum value.
*
* @example
* const validate = minLength(3);
* validate('john_doe'); // ok("john_doe")
* validate('jo');       // err([{ path: [], message: 'Must be at least 3 characters' }])
*
* @param min - The minimum length (inclusive)
* @param message - Custom error message
* @returns A validator that checks if a string meets the minimum length
*/
function minLength(min, message = `Must be at least ${min} characters`) {
	return (value, path = []) => {
		if (value.length < min) return err([{
			path,
			message
		}]);
		return ok(value);
	};
}
/**
* Create a validator that ensures a string's length is at most a maximum value.
*
* @example
* const validate = maxLength(10);
* validate('short');                // ok("short")
* validate('this is too long!!!'); // err([{ path: [], message: 'Must be at most 10 characters' }])
*
* @param max - The maximum length (inclusive)
* @param message - Custom error message
* @returns A validator that checks if a string meets the maximum length
*/
function maxLength(max, message = `Must be at most ${max} characters`) {
	return (value, path = []) => {
		if (value.length > max) return err([{
			path,
			message
		}]);
		return ok(value);
	};
}
/**
* Create a validator that ensures a string is a valid URL.
*
* @example
* const validate = url();
* validate('https://example.com');  // ok("https://example.com")
* validate('not-a-url');            // err([{ path: [], message: 'Invalid URL format' }])
*
* @param message - Custom error message
* @returns A validator that checks if a string is a valid URL
*/
function url(message = "Invalid URL format") {
	return (value, path = []) => {
		try {
			new URL(value);
			return ok(value);
		} catch {
			return err([{
				path,
				message
			}]);
		}
	};
}
function array(itemValidator) {
	return (value, parentPath = []) => {
		if (!Array.isArray(value)) return err([{
			path: parentPath,
			message: "Expected an array"
		}]);
		const abortEarly = _getAbortEarly();
		const allErrors = [];
		const validatedItems = Array.from({ length: value.length });
		const pendingResults = [];
		for (const [i, item] of value.entries()) {
			if (abortEarly && allErrors.length > 0) break;
			const result = itemValidator(item, [...parentPath, i.toString()]);
			if (result instanceof Promise) {
				if (abortEarly && allErrors.length > 0) continue;
				const index = i;
				pendingResults.push(result.then((r) => {
					if (isOk(r)) validatedItems[index] = r.value;
					else allErrors.push(...r.error);
				}));
			} else if (isOk(result)) validatedItems[i] = result.value;
			else {
				allErrors.push(...result.error);
				if (abortEarly) break;
			}
		}
		if (pendingResults.length > 0) return Promise.all(pendingResults).then(() => {
			if (allErrors.length > 0) return err(allErrors);
			return ok(validatedItems);
		});
		if (allErrors.length > 0) return err(allErrors);
		return ok(validatedItems);
	};
}
/**
* Create a validator that ensures a value is a string and one of the allowed enum values.
*
* @example
* const validate = stringEnum(['admin', 'user']);
* validate('admin'); // ok("admin")
* validate(42);      // err([{ path: [], message: 'Value must be a string' }])
* validate('other'); // err([{ path: [], message: 'Value must be one of: admin, user' }])
*
* @param allowedValues - Array of acceptable string enum values
* @param message - Custom error message
* @returns A validator that checks if a value is a string and in the allowed list
*/
function stringEnum(allowedValues, message = `Value must be one of: ${allowedValues.join(", ")}`) {
	return chain(string("Value must be a string"), (value, path = []) => {
		if (!allowedValues.includes(value)) return err([{
			path,
			message
		}]);
		return ok(value);
	});
}
/**
* Create a validator that ensures a value is a number and not NaN.
*
* @example
* const validate = number();
* validate(25);           // ok(25)
* validate('not a number'); // err([{ path: [], message: 'Must be a number' }])
*
* @param message - Custom error message
* @returns A validator that checks if a value is a number
*/
function number(message = "Must be a number") {
	return (value, path = []) => {
		if (typeof value !== "number" || Number.isNaN(value)) return err([{
			path,
			message
		}]);
		return ok(value);
	};
}
/**
* Create a validator that ensures a number is at least a minimum value.
*
* @example
* const validate = min(18);
* validate(21); // ok(21)
* validate(16); // err([{ path: [], message: 'Must be at least 18' }])
*
* @param value - The minimum value (inclusive)
* @param message - Custom error message
* @returns A validator that checks if a number is at least the minimum
*/
function min(value, message = `Must be at least ${value}`) {
	return (input, path = []) => {
		if (input < value) return err([{
			path,
			message
		}]);
		return ok(input);
	};
}
/**
* Create a validator that ensures a number is at most a maximum value.
*
* @example
* const validate = max(100);
* validate(75);  // ok(75)
* validate(150); // err([{ path: [], message: 'Must be at most 100' }])
*
* @param value - The maximum value (inclusive)
* @param message - Custom error message
* @returns A validator that checks if a number is at most the maximum
*/
function max(value, message = `Must be at most ${value}`) {
	return (input, path = []) => {
		if (input > value) return err([{
			path,
			message
		}]);
		return ok(input);
	};
}
/**
* Create a validator that ensures a value is a valid Date object.
*
* @example
* const validate = date();
* validate(new Date());      // ok(Date)
* validate('not a date');    // err([{ path: [], message: 'Must be a Date object' }])
*
* @param message - Custom error message
* @returns A validator that checks if value is a valid Date
*/
function date(message = "Must be a Date object") {
	return (value, path = []) => {
		if (!(value instanceof Date)) return err([{
			path,
			message
		}]);
		if (Number.isNaN(value.getTime())) return err([{
			path,
			message: "Invalid Date"
		}]);
		return ok(value);
	};
}
function union(validators, options) {
	const { collectAllErrors = true, errorPrefix } = options || {};
	const buildError = (allErrors) => err(allErrors.flat().map((error) => ({
		path: error.path,
		message: errorPrefix ? `${errorPrefix}: ${error.message}` : error.message
	})));
	return (value, parentPath = []) => {
		if (validators.length === 0) return err([{
			path: parentPath,
			message: "No validators provided to union"
		}]);
		const allErrors = [];
		for (let i = 0; i < validators.length; i++) {
			const result = validators[i](value, parentPath);
			if (result instanceof Promise) return (async () => {
				const asyncResult = await result;
				if (isOk(asyncResult)) return asyncResult;
				allErrors.push(asyncResult.error);
				if (!collectAllErrors) return buildError(allErrors);
				for (let j = i + 1; j < validators.length; j++) {
					const r = await validators[j](value, parentPath);
					if (isOk(r)) return r;
					allErrors.push(r.error);
					if (!collectAllErrors) break;
				}
				return buildError(allErrors);
			})();
			if (isOk(result)) return result;
			allErrors.push(result.error);
			if (!collectAllErrors) break;
		}
		return buildError(allErrors);
	};
}
// ../schemas/libraries/@railway-ts/pipelines/download/index.ts
const imageSchema = object({
	id: required(number()),
	created: required(date()),
	title: required(chain(string(), minLength(1), maxLength(100))),
	type: required(stringEnum(["jpg", "png"])),
	size: required(number()),
	url: required(chain(string(), url()))
});
const ratingSchema = object({
	id: required(number()),
	stars: required(chain(number(), min(1), max(5))),
	title: required(chain(string(), minLength(1), maxLength(100))),
	text: required(chain(string(), minLength(1), maxLength(1e3))),
	images: required(array(imageSchema))
});
validate({}, object({
	id: required(number()),
	created: required(date()),
	title: required(chain(string(), minLength(1), maxLength(100))),
	brand: required(chain(string(), minLength(1), maxLength(30))),
	description: required(chain(string(), minLength(1), maxLength(500))),
	price: required(chain(number(), min(1), max(1e4))),
	discount: union([chain(number(), min(1), max(100)), nullable()]),
	quantity: required(chain(number(), min(0), max(10))),
	tags: required(array(chain(string(), minLength(1), maxLength(30)))),
	images: required(array(imageSchema)),
	ratings: required(array(ratingSchema))
}));
