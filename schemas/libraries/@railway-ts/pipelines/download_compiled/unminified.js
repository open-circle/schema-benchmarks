var RESULT_BRAND = Symbol("RESULT_BRAND");
function ok(value) {
	return {
		ok: true,
		value,
		[RESULT_BRAND]: "ok"
	};
}
function err(error) {
	return {
		ok: false,
		error,
		[RESULT_BRAND]: "error"
	};
}
function isOk(result) {
	return result.ok;
}
function isErr(result) {
	return !result.ok;
}
var _abortEarly = false;
function _getAbortEarly() {
	return _abortEarly;
}
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
			const extraKeys = Object.keys(obj).filter((key) => !Object.prototype.hasOwnProperty.call(schema, key));
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
			if (!Object.prototype.hasOwnProperty.call(schema, key)) continue;
			const validator = schema[key];
			if (!validator) continue;
			if (abortEarly && allErrors.length > 0) break;
			const value = obj[key];
			const result = validator(value, [...parentPath, key]);
			if (result instanceof Promise) {
				if (abortEarly && allErrors.length > 0) continue;
				pendingResults.push(result.then((r) => {
					if (isOk(r)) validatedObj[key] = r.value;
					else allErrors.push(...r.error);
				}));
			} else if (isOk(result)) validatedObj[key] = result.value;
			else {
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
function nullable(message = "Must be null") {
	return (value, path = []) => {
		if (value !== null) return err([{
			path,
			message
		}]);
		return ok(null);
	};
}
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
function string(message = "Must be a string") {
	return (value, path = []) => {
		if (typeof value !== "string") return err([{
			path,
			message
		}]);
		return ok(value);
	};
}
function minLength(min2, message = `Must be at least ${min2} characters`) {
	return (value, path = []) => {
		if (value.length < min2) return err([{
			path,
			message
		}]);
		return ok(value);
	};
}
function maxLength(max2, message = `Must be at most ${max2} characters`) {
	return (value, path = []) => {
		if (value.length > max2) return err([{
			path,
			message
		}]);
		return ok(value);
	};
}
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
function stringEnum(allowedValues, message = `Value must be one of: ${allowedValues.join(", ")}`) {
	return chain(string("Value must be a string"), (value, path = []) => {
		if (!allowedValues.includes(value)) return err([{
			path,
			message
		}]);
		return ok(value);
	});
}
function number(message = "Must be a number") {
	return (value, path = []) => {
		if (typeof value !== "number" || Number.isNaN(value)) return err([{
			path,
			message
		}]);
		return ok(value);
	};
}
function min(value, message = `Must be at least ${value}`) {
	return (input, path = []) => {
		if (input < value) return err([{
			path,
			message
		}]);
		return ok(input);
	};
}
function max(value, message = `Must be at most ${value}`) {
	return (input, path = []) => {
		if (input > value) return err([{
			path,
			message
		}]);
		return ok(input);
	};
}
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
	stars: required(chain(number(), min(0), max(5))),
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
