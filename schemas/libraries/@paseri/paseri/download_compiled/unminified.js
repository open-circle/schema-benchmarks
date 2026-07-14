//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/message.js
function messageList(node, locale) {
	const messages = [];
	const missingCodes = /* @__PURE__ */ new Set();
	const stack = [];
	let current = [node, []];
	while (current) {
		const [currentNode, currentPath] = current;
		switch (currentNode.type) {
			case "leaf": {
				let text;
				if (locale === void 0) text = currentNode.code;
				else {
					const formatter = locale[currentNode.code];
					if (formatter === void 0) {
						missingCodes.add(currentNode.code);
						break;
					}
					const { code, type, ...placeholders } = currentNode;
					text = formatter(placeholders);
				}
				messages.push({
					path: currentPath,
					message: text
				});
				break;
			}
			case "join":
				stack.push([currentNode.right, currentPath], [currentNode.left, currentPath]);
				break;
			case "nest":
				stack.push([currentNode.child, [...currentPath, currentNode.key]]);
				break;
		}
		current = stack.pop();
	}
	if (missingCodes.size > 0) {
		const sorted = [...missingCodes].sort();
		throw new Error(`No messages for codes: ${sorted.join(", ")}.`);
	}
	return messages;
}
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/result.js
var ParseErrorResult = class {
	ok = false;
	_issue;
	constructor(issue) {
		this._issue = issue;
	}
	get issue() {
		return this._issue;
	}
	messages(locale) {
		return messageList(this._issue, locale);
	}
};
/**
* `PaseriError` is thrown from `parse` when the data being validated does not adhere to the expected schema.
*/ var PaseriError = class extends Error {
	_issue;
	constructor(issue) {
		super("Failed to parse. See `e.messages()` for details.");
		this._issue = issue;
	}
	/**
	* Retrieve the error messages for a parsing failure.
	* @param locale The locale to use for error messages.
	*/ messages(locale) {
		return messageList(this._issue, locale);
	}
};
function isParseSuccess(value) {
	return value.ok === true;
}
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/issue.js
const issueCodes = {
	INVALID_TYPE: "invalid_type",
	TOO_SHORT: "too_short",
	TOO_LONG: "too_long",
	DUPLICATE_KEY: "duplicate_key",
	TOO_DEEP: "too_deep",
	INVALID_EMAIL: "invalid_email",
	INVALID_EMOJI: "invalid_emoji",
	INVALID_UUID: "invalid_uuid",
	INVALID_NANOID: "invalid_nanoid",
	DOES_NOT_INCLUDE: "does_not_include",
	DOES_NOT_START_WITH: "does_not_start_with",
	DOES_NOT_END_WITH: "does_not_end_with",
	INVALID_DATE_STRING: "invalid_date_string",
	INVALID_TIME_STRING: "invalid_time_string",
	INVALID_DATE_TIME_STRING: "invalid_date_time_string",
	INVALID_IP_ADDRESS: "invalid_ip_address",
	INVALID_IP_ADDRESS_RANGE: "invalid_ip_address_range",
	INVALID_URL: "invalid_url",
	DOES_NOT_MATCH_REGEX: "does_not_match_regex",
	TOO_SMALL: "too_small",
	TOO_LARGE: "too_large",
	INVALID_INTEGER: "invalid_integer",
	INVALID_FINITE: "invalid_finite",
	INVALID_SAFE_INTEGER: "invalid_safe_integer",
	INVALID_VALUE: "invalid_value",
	INVALID_DISCRIMINATOR_VALUE: "invalid_discriminator_value",
	INVALID_ENUM_VALUE: "invalid_enum_value",
	UNRECOGNIZED_KEY: "unrecognized_key",
	MISSING_VALUE: "missing_value",
	INVALID_DATE: "invalid_date",
	TOO_RECENT: "too_recent",
	TOO_DATED: "too_dated"
};
function addIssue(node, newNode) {
	if (!node) return newNode;
	return {
		type: "join",
		left: node,
		right: newNode
	};
}
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/utils.js
function isPlainObject(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	if (value.constructor === Object) return true;
	if (value.constructor === void 0) return Object.getPrototypeOf(value) === null;
	if (!Object.hasOwn(value, "constructor")) return false;
	return Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null;
}
/**
* Creates an own `__proto__` data property. In Annex B environments (browsers, Node.js — not Deno, which
* removes the accessor) a bare `target['__proto__'] = value` invokes the inherited Object.prototype setter
* and mutates the prototype instead of creating the key. Callers guard with `key === '__proto__'` inline
* so the hot store sites stay plain assignments.
*/ function defineProtoProperty(target, value) {
	Object.defineProperty(target, "__proto__", {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function primitiveToString(value) {
	if (typeof value === "bigint") return `${value}n`;
	if (typeof value === "string") return `'${value}'`;
	return String(value);
}
/**
* True when adding the order bound `value` would contradict an existing opposite bound in `checks` (matched by
* `oppositeTag`). `compare` orders two bound params like `Temporal.PlainDate.compare`; `side` is `1` for a new lower
* bound (contradiction if it sits above an upper bound) and `-1` for a new upper bound (below a lower bound). Equal
* bounds (`min === max`) stay valid — only a strict overshoot counts.
*/ function boundsContradict(checks, oppositeTag, value, compare, side) {
	if (checks === void 0) return false;
	for (const check of checks) if (check.tag === oppositeTag && Math.sign(compare(value, check.param)) === side) return true;
	return false;
}
function isTemporalInstance(value) {
	if (typeof Temporal === "undefined") return false;
	return value instanceof Temporal.Instant || value instanceof Temporal.PlainDate || value instanceof Temporal.PlainDateTime || value instanceof Temporal.PlainMonthDay || value instanceof Temporal.PlainTime || value instanceof Temporal.PlainYearMonth || value instanceof Temporal.ZonedDateTime || value instanceof Temporal.Duration;
}
/**
* Deep-clones a `.default()` value so the stored copy is detached from the caller's reference, and enforces the
* default-value contract: a default must be faithfully cloneable, safe to freeze, and embeddable as a literal when
* compiled. Supported at any depth are primitives, plain objects, arrays, `Date`, Temporal instances, `Map`, and
* `Set`; Temporal instances are immutable leaves (no copy). Anything else — a function, symbol, `RegExp`, typed
* array, `Error`, or other class instance — satisfies none of those, so it is rejected here at construction rather
* than silently mangled (a `RegExp` clone can't be frozen-and-used; a class instance loses its prototype).
*/ function deepClone(value) {
	if (value === null) return value;
	if (typeof value === "function" || typeof value === "symbol") throw new Error(`A default value cannot be a ${typeof value}.`);
	if (typeof value !== "object") return value;
	if (isTemporalInstance(value)) return value;
	if (value instanceof Date) return new Date(value.getTime());
	if (Array.isArray(value)) return value.map((item) => deepClone(item));
	if (value instanceof Map) {
		const cloned = /* @__PURE__ */ new Map();
		for (const [key, inner] of value) cloned.set(deepClone(key), deepClone(inner));
		return cloned;
	}
	if (value instanceof Set) {
		const cloned = /* @__PURE__ */ new Set();
		for (const item of value) cloned.add(deepClone(item));
		return cloned;
	}
	if (isPlainObject(value)) {
		const source = value;
		const cloned = {};
		for (const key of Object.keys(source)) if (key === "__proto__") defineProtoProperty(cloned, deepClone(source[key]));
		else cloned[key] = deepClone(source[key]);
		return cloned;
	}
	const name = value.constructor?.name ?? "non-plain object";
	throw new Error(`A default value cannot be a ${name}.`);
}
function deepFreeze(value) {
	if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
	if (value instanceof Map || value instanceof Set) {
		if (value instanceof Map) for (const [key, inner] of value) {
			deepFreeze(key);
			deepFreeze(inner);
		}
		else for (const item of value) deepFreeze(item);
		const reject = () => {
			throw new TypeError("Cannot mutate a frozen default value.");
		};
		const mutators = value instanceof Map ? [
			"set",
			"delete",
			"clear"
		] : [
			"add",
			"delete",
			"clear"
		];
		for (const mutator of mutators) Object.defineProperty(value, mutator, {
			value: reject,
			writable: false,
			enumerable: false,
			configurable: false
		});
	}
	Object.freeze(value);
	for (const key of Reflect.ownKeys(value)) deepFreeze(value[key]);
	return value;
}
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/schema.js
var _computedKey;
const DEFAULT_MAX_DEPTH = 1e3;
_computedKey = "~standard";
/**
* The abstract base class for all schemas, containing the [common](https://paseri.dev/reference/schema/common/)
* interface.
*/ var Schema = class {
	get [_computedKey]() {
		const self = this;
		return {
			version: 1,
			vendor: "paseri",
			validate(value, options) {
				const result = self.safeParse(value);
				if (result.ok) return { value: result.value };
				return { issues: result.messages(options?.libraryOptions?.locale) };
			}
		};
	}
	_isOptional() {
		return false;
	}
	_hasDefault() {
		return false;
	}
	_unwrapOptional() {
		return this;
	}
	_unwrapRefine() {
		return this;
	}
	parse(value, options) {
		const maxDepth = options?.maxDepth ?? DEFAULT_MAX_DEPTH;
		if (!Number.isInteger(maxDepth) || maxDepth < 1) throw new Error("maxDepth must be a positive integer.");
		const issueOrSuccess = this._parse(value, 0, maxDepth);
		if (issueOrSuccess === void 0) return value;
		if (isParseSuccess(issueOrSuccess)) return issueOrSuccess.value;
		throw new PaseriError(issueOrSuccess);
	}
	safeParse(value, options) {
		const maxDepth = options?.maxDepth ?? DEFAULT_MAX_DEPTH;
		if (!Number.isInteger(maxDepth) || maxDepth < 1) throw new Error("maxDepth must be a positive integer.");
		const issueOrSuccess = this._parse(value, 0, maxDepth);
		if (issueOrSuccess === void 0) return {
			ok: true,
			value
		};
		if (isParseSuccess(issueOrSuccess)) return issueOrSuccess;
		return new ParseErrorResult(issueOrSuccess);
	}
	optional() {
		return new OptionalSchema(this);
	}
	nullable() {
		return new NullableSchema(this);
	}
	chain(schema, transformer) {
		return new ChainSchema(this, schema, transformer);
	}
	refine(predicate, options) {
		return new RefineSchema(this, predicate, options);
	}
};
var OptionalSchema = class OptionalSchema extends Schema {
	_schema;
	constructor(schema) {
		super();
		this._schema = schema;
	}
	_clone() {
		return new OptionalSchema(this._schema);
	}
	_parse(value, _depth, _maxDepth) {
		if (value === void 0) return;
		return this._schema._parse(value, _depth, _maxDepth);
	}
	_isOptional() {
		return true;
	}
	_unwrapOptional() {
		return this._schema;
	}
	default(value) {
		return new DefaultSchema(this._schema, value);
	}
};
var NullableSchema = class NullableSchema extends Schema {
	_schema;
	constructor(schema) {
		super();
		this._schema = schema;
	}
	_clone() {
		return new NullableSchema(this._schema);
	}
	_parse(value, _depth, _maxDepth) {
		if (value === null) return;
		return this._schema._parse(value, _depth, _maxDepth);
	}
	_isOptional() {
		return this._schema._isOptional();
	}
	_hasDefault() {
		return this._schema._hasDefault();
	}
	_unwrapOptional() {
		return new NullableSchema(this._schema._unwrapOptional());
	}
};
var ChainSchema = class extends Schema {
	_fromSchema;
	_toSchema;
	_transformer;
	constructor(fromSchema, toSchema, transformer) {
		super();
		this._fromSchema = fromSchema;
		this._toSchema = toSchema;
		this._transformer = transformer;
	}
	_clone() {
		return this;
	}
	_parse(value, _depth, _maxDepth) {
		const issueOrSuccessFrom = this._fromSchema._parse(value, _depth, _maxDepth);
		const transformer = this._transformer;
		let transformedResult;
		if (issueOrSuccessFrom === void 0) transformedResult = transformer(value);
		else if (isParseSuccess(issueOrSuccessFrom)) transformedResult = transformer(issueOrSuccessFrom.value);
		else return issueOrSuccessFrom;
		if (!transformedResult.ok) return transformedResult.issue;
		const issueOrSuccessTo = this._toSchema._parse(transformedResult.value, _depth, _maxDepth);
		if (issueOrSuccessTo === void 0) return {
			ok: true,
			value: transformedResult.value
		};
		return issueOrSuccessTo;
	}
};
var DefaultSchema = class DefaultSchema extends Schema {
	_schema;
	_default;
	constructor(schema, value) {
		super();
		this._schema = schema;
		this._default = deepFreeze(deepClone(value));
	}
	_clone() {
		return new DefaultSchema(this._schema, this._default);
	}
	_parse(value, _depth, _maxDepth) {
		if (value === void 0) return {
			ok: true,
			value: this._default
		};
		return this._schema._parse(value, _depth, _maxDepth);
	}
	_getDefault() {
		return this._default;
	}
	_hasDefault() {
		return true;
	}
};
var RefineSchema = class RefineSchema extends Schema {
	_base;
	_predicate;
	_code;
	_path;
	_params;
	constructor(base, predicate, options) {
		super();
		this._base = base;
		this._predicate = predicate;
		this._code = options.code;
		this._path = options.path ?? [];
		this._params = options.params;
	}
	_clone() {
		return this;
	}
	_isOptional() {
		return this._base._isOptional();
	}
	_hasDefault() {
		return this._base._hasDefault();
	}
	_unwrapRefine() {
		return this._base._unwrapRefine();
	}
	_unwrapOptional() {
		const unwrapped = new RefineSchema(this._base._unwrapOptional(), this._predicate, {
			code: this._code,
			path: [...this._path],
			...this._params !== void 0 && { params: this._params }
		});
		unwrapped._callSiteFile = this._callSiteFile;
		return unwrapped;
	}
	_parse(value, _depth, _maxDepth) {
		const baseResult = this._base._parse(value, _depth, _maxDepth);
		if (baseResult !== void 0 && !isParseSuccess(baseResult)) return baseResult;
		const parsed = baseResult === void 0 ? value : baseResult.value;
		const predicate = this._predicate;
		if (predicate(parsed)) return baseResult;
		let issue = {
			type: "leaf",
			code: this._code,
			...this._params !== void 0 && { params: this._params }
		};
		for (let i = this._path.length - 1; i >= 0; i--) issue = {
			type: "nest",
			key: this._path[i],
			child: issue
		};
		return issue;
	}
};
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/array.js
var ArraySchema = class ArraySchema extends Schema {
	_element;
	_minLength = 0;
	_maxLength = Number.POSITIVE_INFINITY;
	issues = {
		INVALID_TYPE: {
			type: "leaf",
			code: issueCodes.INVALID_TYPE,
			expected: "array"
		},
		TOO_LONG: {
			type: "leaf",
			code: issueCodes.TOO_LONG
		},
		TOO_SHORT: {
			type: "leaf",
			code: issueCodes.TOO_SHORT
		}
	};
	constructor(element) {
		super();
		this._element = element;
	}
	_clone() {
		const cloned = new ArraySchema(this._element);
		cloned._minLength = this._minLength;
		cloned._maxLength = this._maxLength;
		return cloned;
	}
	_parse(value, _depth, _maxDepth) {
		if (!Array.isArray(value)) return this.issues.INVALID_TYPE;
		const length = value.length;
		const maxLength = this._maxLength;
		const minLength = this._minLength;
		if (length > maxLength) return this.issues.TOO_LONG;
		if (length < minLength) return this.issues.TOO_SHORT;
		const schema = this._element;
		let issue;
		let newArray;
		for (let i = 0; i < length; i++) {
			const childValue = value[i];
			const issueOrSuccess = schema._parse(childValue, _depth, _maxDepth);
			if (issueOrSuccess === void 0) {
				newArray?.push(childValue);
				continue;
			}
			if (isParseSuccess(issueOrSuccess)) {
				if (!newArray) newArray = value.slice(0, i);
				newArray.push(issueOrSuccess.value);
			} else {
				newArray?.push(childValue);
				issue = addIssue(issue, {
					type: "nest",
					key: i,
					child: issueOrSuccess
				});
			}
		}
		if (issue) return issue;
		if (newArray) return {
			ok: true,
			value: newArray
		};
	}
	min(length) {
		if (!Number.isInteger(length) || length < 0) throw new Error("Length must be a non-negative integer.");
		if (length > this._maxLength) throw new Error("Minimum length must not exceed maximum length.");
		const cloned = this._clone();
		cloned._minLength = length;
		return cloned;
	}
	max(length) {
		if (!Number.isInteger(length) || length < 0) throw new Error("Length must be a non-negative integer.");
		if (length < this._minLength) throw new Error("Minimum length must not exceed maximum length.");
		const cloned = this._clone();
		cloned._maxLength = length;
		return cloned;
	}
	length(length) {
		if (!Number.isInteger(length) || length < 0) throw new Error("Length must be a non-negative integer.");
		const cloned = this._clone();
		cloned._minLength = length;
		cloned._maxLength = length;
		return cloned;
	}
};
/**
* [Array](https://paseri.dev/reference/schema/collections/array/) schema.
*/ const array = (...args) => new ArraySchema(...args);
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/bounds.js
function effectiveLowerBound(checks, gteTag, gtTag) {
	if (checks === void 0) return;
	let value;
	for (const check of checks) if ((check.tag === gteTag || check.tag === gtTag) && (value === void 0 || check.param > value)) value = check.param;
	if (value === void 0) return;
	let strict = false;
	for (const check of checks) if (check.tag === gtTag && check.param === value) strict = true;
	return {
		value,
		strict
	};
}
function effectiveUpperBound(checks, lteTag, ltTag) {
	if (checks === void 0) return;
	let value;
	for (const check of checks) if ((check.tag === lteTag || check.tag === ltTag) && (value === void 0 || check.param < value)) value = check.param;
	if (value === void 0) return;
	let strict = false;
	for (const check of checks) if (check.tag === ltTag && check.param === value) strict = true;
	return {
		value,
		strict
	};
}
function assertLowerWithinUpper(upper, value, strict) {
	if (upper !== void 0 && (value > upper.value || value === upper.value && (strict || upper.strict))) throw new Error("Lower bound must not exceed upper bound.");
}
function assertUpperWithinLower(lower, value, strict) {
	if (lower !== void 0 && (value < lower.value || value === lower.value && (strict || lower.strict))) throw new Error("Lower bound must not exceed upper bound.");
}
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/date.js
const TAG_MIN$1 = 0;
const TAG_MAX$1 = 1;
const singleton$2 = /* @__PURE__ */ new class DateSchema extends Schema {
	_checks = void 0;
	issues = {
		INVALID_TYPE: {
			type: "leaf",
			code: issueCodes.INVALID_TYPE,
			expected: "Date"
		},
		INVALID_DATE: {
			type: "leaf",
			code: issueCodes.INVALID_DATE
		},
		TOO_DATED: {
			type: "leaf",
			code: issueCodes.TOO_DATED
		},
		TOO_RECENT: {
			type: "leaf",
			code: issueCodes.TOO_RECENT
		}
	};
	_clone() {
		const cloned = new DateSchema();
		cloned._checks = this._checks?.slice();
		return cloned;
	}
	_parse(value, _depth, _maxDepth) {
		if (!(value instanceof Date)) return this.issues.INVALID_TYPE;
		if (Number.isNaN(value.getTime())) return this.issues.INVALID_DATE;
		if (this._checks !== void 0) {
			const checks = this._checks;
			for (let i = 0; i < checks.length; i++) {
				const { tag, param, issue } = checks[i];
				switch (tag) {
					case TAG_MIN$1:
						if (value < param) return issue;
						break;
					case TAG_MAX$1:
						if (value > param) return issue;
						break;
				}
			}
		}
	}
	min(value) {
		if (Number.isNaN(value.getTime())) throw new Error("Invalid Date is not a valid boundary value.");
		if (boundsContradict(this._checks, TAG_MAX$1, value, (left, right) => left.getTime() - right.getTime(), 1)) throw new Error("Minimum must not exceed maximum.");
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_MIN$1,
			param: new Date(value.getTime()),
			issue: this.issues.TOO_DATED
		});
		return cloned;
	}
	max(value) {
		if (Number.isNaN(value.getTime())) throw new Error("Invalid Date is not a valid boundary value.");
		if (boundsContradict(this._checks, TAG_MIN$1, value, (left, right) => left.getTime() - right.getTime(), -1)) throw new Error("Minimum must not exceed maximum.");
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_MAX$1,
			param: new Date(value.getTime()),
			issue: this.issues.TOO_RECENT
		});
		return cloned;
	}
}();
/**
* [Date](https://paseri.dev/reference/schema/primitives/date/) schema.
*/ const date = () => singleton$2;
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/enum.js
var EnumSchema = class EnumSchema extends Schema {
	_values;
	_set;
	issues;
	constructor(...values) {
		super();
		if (values.length === 0) throw new Error("Enum must contain at least one value.");
		this._values = Object.freeze([...values]);
		this._set = new Set(values);
		this.issues = { INVALID_ENUM_VALUE: {
			type: "leaf",
			code: issueCodes.INVALID_ENUM_VALUE,
			expected: this._values.map(primitiveToString)
		} };
	}
	_clone() {
		return new EnumSchema(...this._values);
	}
	_parse(value, _depth, _maxDepth) {
		if (this._set.has(value)) return;
		return this.issues.INVALID_ENUM_VALUE;
	}
	extract(...values) {
		return new EnumSchema(...values);
	}
	exclude(...values) {
		const excluded = new Set(values);
		const remaining = this._values.filter((value) => !excluded.has(value));
		return new EnumSchema(...remaining);
	}
};
/**
* [Enum](https://paseri.dev/reference/schema/others/enum/) schema.
*/ const enum_ = (...values) => new EnumSchema(...values);
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/number.js
const TAG_GTE = 0;
const TAG_GT = 1;
const TAG_LTE = 2;
const TAG_LT = 3;
const TAG_INT = 4;
const TAG_FINITE = 5;
const TAG_SAFE = 6;
const singleton$1 = /* @__PURE__ */ new class NumberSchema extends Schema {
	_checks = void 0;
	issues = {
		INVALID_TYPE: {
			type: "leaf",
			code: issueCodes.INVALID_TYPE,
			expected: "number"
		},
		TOO_SMALL: {
			type: "leaf",
			code: issueCodes.TOO_SMALL
		},
		TOO_LARGE: {
			type: "leaf",
			code: issueCodes.TOO_LARGE
		},
		INVALID_INTEGER: {
			type: "leaf",
			code: issueCodes.INVALID_INTEGER
		},
		INVALID_FINITE: {
			type: "leaf",
			code: issueCodes.INVALID_FINITE
		},
		INVALID_SAFE_INTEGER: {
			type: "leaf",
			code: issueCodes.INVALID_SAFE_INTEGER
		}
	};
	_clone() {
		const cloned = new NumberSchema();
		cloned._checks = this._checks?.slice();
		return cloned;
	}
	_parse(value, _depth, _maxDepth) {
		if (typeof value !== "number" || Number.isNaN(value)) return this.issues.INVALID_TYPE;
		if (this._checks !== void 0) {
			const checks = this._checks;
			for (let i = 0; i < checks.length; i++) {
				const { tag, param, issue } = checks[i];
				switch (tag) {
					case TAG_GTE:
						if (value < param) return issue;
						break;
					case TAG_GT:
						if (value <= param) return issue;
						break;
					case TAG_LTE:
						if (value > param) return issue;
						break;
					case TAG_LT:
						if (value >= param) return issue;
						break;
					case TAG_INT:
						if (!Number.isInteger(value)) return issue;
						break;
					case TAG_FINITE:
						if (!Number.isFinite(value)) return issue;
						break;
					case TAG_SAFE:
						if (!Number.isSafeInteger(value)) return issue;
						break;
				}
			}
		}
	}
	gte(value) {
		if (Number.isNaN(value)) throw new Error("NaN is not a valid boundary value.");
		assertLowerWithinUpper(effectiveUpperBound(this._checks, TAG_LTE, TAG_LT), value, false);
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_GTE,
			param: value,
			issue: this.issues.TOO_SMALL
		});
		return cloned;
	}
	gt(value) {
		if (Number.isNaN(value)) throw new Error("NaN is not a valid boundary value.");
		assertLowerWithinUpper(effectiveUpperBound(this._checks, TAG_LTE, TAG_LT), value, true);
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_GT,
			param: value,
			issue: this.issues.TOO_SMALL
		});
		return cloned;
	}
	lte(value) {
		if (Number.isNaN(value)) throw new Error("NaN is not a valid boundary value.");
		assertUpperWithinLower(effectiveLowerBound(this._checks, TAG_GTE, TAG_GT), value, false);
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_LTE,
			param: value,
			issue: this.issues.TOO_LARGE
		});
		return cloned;
	}
	lt(value) {
		if (Number.isNaN(value)) throw new Error("NaN is not a valid boundary value.");
		assertUpperWithinLower(effectiveLowerBound(this._checks, TAG_GTE, TAG_GT), value, true);
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_LT,
			param: value,
			issue: this.issues.TOO_LARGE
		});
		return cloned;
	}
	int() {
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_INT,
			param: 0,
			issue: this.issues.INVALID_INTEGER
		});
		return cloned;
	}
	finite() {
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_FINITE,
			param: 0,
			issue: this.issues.INVALID_FINITE
		});
		return cloned;
	}
	safe() {
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_SAFE,
			param: 0,
			issue: this.issues.INVALID_SAFE_INTEGER
		});
		return cloned;
	}
}();
/**
* [Number](https://paseri.dev/reference/schema/primitives/number/) schema.
*/ const number = () => singleton$1;
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/object.js
var ObjectSchema = class ObjectSchema extends Schema {
	_shape;
	_shapeMap;
	_shapeKeys;
	_shapeSize;
	_requiredKeys;
	_mode = "strict";
	issues = {
		INVALID_TYPE: {
			type: "leaf",
			code: issueCodes.INVALID_TYPE,
			expected: "object"
		},
		UNRECOGNIZED_KEY: {
			type: "leaf",
			code: issueCodes.UNRECOGNIZED_KEY
		},
		MISSING_VALUE: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	};
	constructor(shape, isDerivedShape = false) {
		super();
		if (!shape) throw new Error("Object must contain at least one field.");
		if (Object.getOwnPropertySymbols(shape).length > 0) throw new Error("Object fields must use string keys.");
		if (Object.keys(shape).length === 0) throw new Error("Object must contain at least one field.");
		this._shape = shape;
		this._shapeMap = isDerivedShape ? new Map(Object.entries(shape)) : void 0;
		this._shapeKeys = [...Object.keys(shape)];
		this._shapeSize = this._shapeKeys.length;
		this._requiredKeys = this._shapeKeys.filter((key) => !shape[key]._isOptional());
	}
	_clone() {
		const cloned = new ObjectSchema(this._shape, this._shapeMap !== void 0);
		cloned._mode = this._mode;
		return cloned;
	}
	_parse(value, _depth, _maxDepth) {
		if (!isPlainObject(value)) return this.issues.INVALID_TYPE;
		let seen = 0;
		const modifiedValues = {};
		let unrecognisedKeys;
		let hasModifiedChildValue = false;
		let hiddenOwnKeys;
		let issue;
		const shapeMap = this._shapeMap;
		if (shapeMap === void 0) for (const key in value) {
			const schema = this._shape[key];
			if (schema?._parse) {
				seen++;
				const childValue = value[key];
				const issueOrSuccess = schema._parse(childValue, _depth, _maxDepth);
				if (issueOrSuccess === void 0) continue;
				if (isParseSuccess(issueOrSuccess)) {
					hasModifiedChildValue = true;
					if (key === "__proto__") defineProtoProperty(modifiedValues, issueOrSuccess.value);
					else modifiedValues[key] = issueOrSuccess.value;
				} else issue = addIssue(issue, {
					type: "nest",
					key,
					child: issueOrSuccess
				});
			} else if (this._mode !== "passthrough") {
				if (!unrecognisedKeys) unrecognisedKeys = /* @__PURE__ */ new Set();
				unrecognisedKeys.add(key);
			}
		}
		else for (const key in value) {
			const schema = shapeMap.get(key);
			if (schema?._parse) {
				seen++;
				const childValue = value[key];
				const issueOrSuccess = schema._parse(childValue, _depth, _maxDepth);
				if (issueOrSuccess === void 0) continue;
				if (isParseSuccess(issueOrSuccess)) {
					hasModifiedChildValue = true;
					if (key === "__proto__") defineProtoProperty(modifiedValues, issueOrSuccess.value);
					else modifiedValues[key] = issueOrSuccess.value;
				} else issue = addIssue(issue, {
					type: "nest",
					key,
					child: issueOrSuccess
				});
			} else if (this._mode !== "passthrough") {
				if (!unrecognisedKeys) unrecognisedKeys = /* @__PURE__ */ new Set();
				unrecognisedKeys.add(key);
			}
		}
		if (seen < this._shapeSize) {
			const hasHiddenKeys = Object.getOwnPropertyNames(value).length !== Object.keys(value).length;
			for (const key of this._requiredKeys) if (!Object.hasOwn(value, key)) {
				const issueOrSuccess = this._parseMissingKey(key, _depth, _maxDepth);
				if (issueOrSuccess === void 0) continue;
				if (isParseSuccess(issueOrSuccess)) {
					hasModifiedChildValue = true;
					if (key === "__proto__") defineProtoProperty(modifiedValues, issueOrSuccess.value);
					else modifiedValues[key] = issueOrSuccess.value;
				} else issue = addIssue(issue, {
					type: "nest",
					key,
					child: issueOrSuccess
				});
			}
			if (hasHiddenKeys) {
				for (const key of this._shapeKeys) if (Object.hasOwn(value, key) && !Object.prototype.propertyIsEnumerable.call(value, key)) {
					if (hiddenOwnKeys === void 0) hiddenOwnKeys = [];
					hiddenOwnKeys.push(key);
					const issueOrSuccess = this._shape[key]._parse(value[key], _depth, _maxDepth);
					if (issueOrSuccess !== void 0) if (isParseSuccess(issueOrSuccess)) {
						hasModifiedChildValue = true;
						if (key === "__proto__") defineProtoProperty(modifiedValues, issueOrSuccess.value);
						else modifiedValues[key] = issueOrSuccess.value;
					} else issue = addIssue(issue, {
						type: "nest",
						key,
						child: issueOrSuccess
					});
				}
			}
		}
		if (unrecognisedKeys && this._mode === "strict") for (const key of unrecognisedKeys) issue = addIssue(issue, {
			type: "nest",
			key,
			child: this.issues.UNRECOGNIZED_KEY
		});
		if (issue) return issue;
		if (unrecognisedKeys && this._mode === "strip") {
			const sanitizedValue = {};
			for (const key in value) {
				if (unrecognisedKeys.has(key)) continue;
				if (hasModifiedChildValue && Object.hasOwn(modifiedValues, key)) if (key === "__proto__") defineProtoProperty(sanitizedValue, modifiedValues[key]);
				else sanitizedValue[key] = modifiedValues[key];
				else if (key === "__proto__") defineProtoProperty(sanitizedValue, value[key]);
				else sanitizedValue[key] = value[key];
			}
			if (hasModifiedChildValue) {
				for (const key in modifiedValues) if (!Object.hasOwn(value, key)) if (key === "__proto__") defineProtoProperty(sanitizedValue, modifiedValues[key]);
				else sanitizedValue[key] = modifiedValues[key];
			}
			if (hiddenOwnKeys) for (const key of hiddenOwnKeys) {
				const source = hasModifiedChildValue && Object.hasOwn(modifiedValues, key) ? modifiedValues[key] : value[key];
				if (key === "__proto__") defineProtoProperty(sanitizedValue, source);
				else sanitizedValue[key] = source;
			}
			return {
				ok: true,
				value: sanitizedValue
			};
		}
		if (hasModifiedChildValue) return {
			ok: true,
			value: {
				...value,
				...modifiedValues
			}
		};
	}
	/**
	* Resolves a missing required key: substitutes the default (a wrapped default runs the whole wrapper
	* chain, so a missing key behaves exactly like explicit undefined) or reports `missing_value`. Kept
	* out of the fallback loop so its body stays small.
	*/ _parseMissingKey(key, _depth, _maxDepth) {
		const shapeMap = this._shapeMap;
		const schema = shapeMap === void 0 ? this._shape[key] : shapeMap.get(key);
		if (schema instanceof DefaultSchema) return {
			ok: true,
			value: schema._getDefault()
		};
		if (schema._hasDefault()) return schema._parse(void 0, _depth, _maxDepth);
		return this.issues.MISSING_VALUE;
	}
	get shape() {
		return this._shape;
	}
	strip() {
		const cloned = this._clone();
		cloned._mode = "strip";
		return cloned;
	}
	strict() {
		const cloned = this._clone();
		cloned._mode = "strict";
		return cloned;
	}
	passthrough() {
		const cloned = this._clone();
		cloned._mode = "passthrough";
		return cloned;
	}
	merge(other) {
		const merged = new ObjectSchema({
			...this._shape,
			...other._shape
		}, true);
		merged._mode = other._mode;
		return merged;
	}
	pick(...keys) {
		const picked = new Set(keys.map((key) => String(key)));
		const result = new ObjectSchema(Object.fromEntries(Object.entries(this._shape).filter(([key]) => picked.has(key))), true);
		result._mode = this._mode;
		return result;
	}
	omit(...keys) {
		const omitted = new Set(keys.map((key) => String(key)));
		const result = new ObjectSchema(Object.fromEntries(Object.entries(this._shape).filter(([key]) => !omitted.has(key))), true);
		result._mode = this._mode;
		return result;
	}
	partial(...keys) {
		const requested = keys.length === 0 ? null : new Set(keys.map((key) => String(key)));
		const matchesKey = requested === null ? () => true : (key) => requested.has(key);
		const newShape = {};
		for (const [key, field] of Object.entries(this._shape)) if (matchesKey(key) && !field._isOptional() && !field._hasDefault()) newShape[key] = field.optional();
		else newShape[key] = field;
		const result = new ObjectSchema(newShape, true);
		result._mode = this._mode;
		return result;
	}
	required(...keys) {
		const requested = keys.length === 0 ? null : new Set(keys.map((key) => String(key)));
		const matchesKey = requested === null ? () => true : (key) => requested.has(key);
		const newShape = {};
		for (const [key, field] of Object.entries(this._shape)) if (matchesKey(key)) newShape[key] = field._unwrapOptional();
		else newShape[key] = field;
		const result = new ObjectSchema(newShape, true);
		result._mode = this._mode;
		return result;
	}
};
/**
* [Object](https://paseri.dev/reference/schema/collections/object/) schema.
*/ const object = (...args) => new ObjectSchema(...args);
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/regex.gen.js
const emailRegex = () => /^(?:(?:[a-z\d\!\#\$\%\&'\*\-\/\=\?\^_\u0060\{\|\}\~\+]+)(?:\.(?:[a-z\d\!\#\$\%\&'\*\-\/\=\?\^_\u0060\{\|\}\~\+]+))*(?:)@(?:(?:[a-z\d](?:[a-z\d\-]*[a-z\d])?\.)+[a-z]{2,}))$/iv;
const emojiRegex = () => /^\p{RGI_Emoji}+$/v;
const uuidRegex = () => /^(?:(?:\p{AHex}{8}-\p{AHex}{4}-[1-8]\p{AHex}{3}-[89ab]\p{AHex}{3}-\p{AHex}{12})|(?:00000000-0000-0000-0000-000000000000)|(?:ffffffff-ffff-ffff-ffff-ffffffffffff))$/iv;
const nanoidRegex = () => /^[a-z\d_-]{21}$/i;
const urlRegex = () => /^(?:(?:(?:https?|ftp|wss?):\/\/(?:(?=[a-z\d\._\-]*?[a-z_\-])(?:(?=([a-z\d\._\-]+))\1))(?::(?:6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|\d{1,4}))?(?:(?:[\/\?\#].*)?))|(?:(?!(?:(?:https?|ftp|wss?|file):))[a-z](?:(?=([a-z\d\+\.\-]*))\2):(?!\/\/).*))$/iv;
const dateRegex = () => /^(?:(?:(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29)|\d{4}-(?:(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01]))|(?:(?:0[469]|11)-(?:0[1-9]|[12]\d|30))|(?:02-(?:0[1-9]|1\d|2[0-8])))))$/v;
const timeRegex = (precision, offset, local = true) => new RegExp(`^(?:(?:(?:[01]\\d|2[0-3])):(?:[0-5]\\d):(?:[0-5]\\d)(?:${precision === void 0 ? "(\\.\\d+)?" : precision === 0 ? "" : `\\.\\d{${String(precision)}}`})(?:${offset && local ? "((?:[+\\-](?:(?:[01]\\d|2[0-3])):(?:[0-5]\\d))|Z?)" : offset ? "((?:[+\\-](?:(?:[01]\\d|2[0-3])):(?:[0-5]\\d))|Z)" : local ? "Z?" : "Z"}))$`, "v");
const datetimeRegex = (precision, offset, local) => new RegExp(`^(?:(?:(?:(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29)|\\d{4}-(?:(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01]))|(?:(?:0[469]|11)-(?:0[1-9]|[12]\\d|30))|(?:02-(?:0[1-9]|1\\d|2[0-8])))))T(?:(?:(?:[01]\\d|2[0-3])):(?:[0-5]\\d):(?:[0-5]\\d)(?:${precision === void 0 ? "(\\.\\d+)?" : precision === 0 ? "" : `\\.\\d{${String(precision)}}`}))(?:${offset && local ? "((?:[+\\-](?:(?:[01]\\d|2[0-3])):(?:[0-5]\\d))|Z?)" : offset ? "((?:[+\\-](?:(?:[01]\\d|2[0-3])):(?:[0-5]\\d))|Z)" : local ? "Z?" : "Z"}))$`, "v");
const ipRegex = (version) => new RegExp(`^(?:${version === void 0 ? "((?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?:(?:(?:(?:\\p{AHex}{1,4}):){7}(?:(?:\\p{AHex}{1,4})|:)|(?:(?:\\p{AHex}{1,4}):){6}(?:(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|:(?:\\p{AHex}{1,4})|:)|(?:(?:\\p{AHex}{1,4}):){5}(?::(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,2}|:)|(?:(?:\\p{AHex}{1,4}):){4}(?:(?::(?:\\p{AHex}{1,4})){0,1}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,3}|:)|(?:(?:\\p{AHex}{1,4}):){3}(?:(?::(?:\\p{AHex}{1,4})){0,2}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,4}|:)|(?:(?:\\p{AHex}{1,4}):){2}(?:(?::(?:\\p{AHex}{1,4})){0,3}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,5}|:)|(?:(?:\\p{AHex}{1,4}):){1}(?:(?::(?:\\p{AHex}{1,4})){0,4}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,6}|:)|(?::(?:(?::(?:\\p{AHex}{1,4})){0,5}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,7}|:)))(?:%[\\da-z]+)?))" : version === 4 ? "(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))" : "(?:(?:(?:(?:\\p{AHex}{1,4}):){7}(?:(?:\\p{AHex}{1,4})|:)|(?:(?:\\p{AHex}{1,4}):){6}(?:(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|:(?:\\p{AHex}{1,4})|:)|(?:(?:\\p{AHex}{1,4}):){5}(?::(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,2}|:)|(?:(?:\\p{AHex}{1,4}):){4}(?:(?::(?:\\p{AHex}{1,4})){0,1}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,3}|:)|(?:(?:\\p{AHex}{1,4}):){3}(?:(?::(?:\\p{AHex}{1,4})){0,2}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,4}|:)|(?:(?:\\p{AHex}{1,4}):){2}(?:(?::(?:\\p{AHex}{1,4})){0,3}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,5}|:)|(?:(?:\\p{AHex}{1,4}):){1}(?:(?::(?:\\p{AHex}{1,4})){0,4}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,6}|:)|(?::(?:(?::(?:\\p{AHex}{1,4})){0,5}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,7}|:)))(?:%[\\da-z]+)?)"})$`, "iv");
const ipCidrRegex = (version) => new RegExp(`^(?:${version === void 0 ? "((?:(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))\\/(?:(?:3[0-2]|2\\d|1\\d|\\d)))|(?:(?:(?:(?:(?:\\p{AHex}{1,4}):){7}(?:(?:\\p{AHex}{1,4})|:)|(?:(?:\\p{AHex}{1,4}):){6}(?:(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|:(?:\\p{AHex}{1,4})|:)|(?:(?:\\p{AHex}{1,4}):){5}(?::(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,2}|:)|(?:(?:\\p{AHex}{1,4}):){4}(?:(?::(?:\\p{AHex}{1,4})){0,1}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,3}|:)|(?:(?:\\p{AHex}{1,4}):){3}(?:(?::(?:\\p{AHex}{1,4})){0,2}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,4}|:)|(?:(?:\\p{AHex}{1,4}):){2}(?:(?::(?:\\p{AHex}{1,4})){0,3}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,5}|:)|(?:(?:\\p{AHex}{1,4}):){1}(?:(?::(?:\\p{AHex}{1,4})){0,4}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,6}|:)|(?::(?:(?::(?:\\p{AHex}{1,4})){0,5}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,7}|:)))(?:%[\\da-z]+)?)\\/(?:(?:12[0-8]|1[01]\\d|\\d{1,2}))))" : version === 4 ? "(?:(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))\\/(?:(?:3[0-2]|2\\d|1\\d|\\d)))" : "(?:(?:(?:(?:(?:\\p{AHex}{1,4}):){7}(?:(?:\\p{AHex}{1,4})|:)|(?:(?:\\p{AHex}{1,4}):){6}(?:(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|:(?:\\p{AHex}{1,4})|:)|(?:(?:\\p{AHex}{1,4}):){5}(?::(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,2}|:)|(?:(?:\\p{AHex}{1,4}):){4}(?:(?::(?:\\p{AHex}{1,4})){0,1}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,3}|:)|(?:(?:\\p{AHex}{1,4}):){3}(?:(?::(?:\\p{AHex}{1,4})){0,2}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,4}|:)|(?:(?:\\p{AHex}{1,4}):){2}(?:(?::(?:\\p{AHex}{1,4})){0,3}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,5}|:)|(?:(?:\\p{AHex}{1,4}):){1}(?:(?::(?:\\p{AHex}{1,4})){0,4}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,6}|:)|(?::(?:(?::(?:\\p{AHex}{1,4})){0,5}(?:):(?:(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d))|(?::(?:\\p{AHex}{1,4})){1,7}|:)))(?:%[\\da-z]+)?)\\/(?:(?:12[0-8]|1[01]\\d|\\d{1,2})))"})$`, "iv");
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/schemas/string.js
const TAG_MIN = 0;
const TAG_MAX = 1;
const TAG_REGEX = 2;
const TAG_INCLUDES = 3;
const TAG_STARTS_WITH = 4;
const TAG_ENDS_WITH = 5;
const TAG_URL = 6;
const singleton = /* @__PURE__ */ new class StringSchema extends Schema {
	_checks = void 0;
	issues = {
		INVALID_TYPE: {
			type: "leaf",
			code: issueCodes.INVALID_TYPE,
			expected: "string"
		},
		TOO_SHORT: {
			type: "leaf",
			code: issueCodes.TOO_SHORT
		},
		TOO_LONG: {
			type: "leaf",
			code: issueCodes.TOO_LONG
		},
		INVALID_EMAIL: {
			type: "leaf",
			code: issueCodes.INVALID_EMAIL
		},
		INVALID_EMOJI: {
			type: "leaf",
			code: issueCodes.INVALID_EMOJI
		},
		INVALID_UUID: {
			type: "leaf",
			code: issueCodes.INVALID_UUID
		},
		INVALID_NANOID: {
			type: "leaf",
			code: issueCodes.INVALID_NANOID
		},
		DOES_NOT_INCLUDE: {
			type: "leaf",
			code: issueCodes.DOES_NOT_INCLUDE
		},
		DOES_NOT_START_WITH: {
			type: "leaf",
			code: issueCodes.DOES_NOT_START_WITH
		},
		DOES_NOT_END_WITH: {
			type: "leaf",
			code: issueCodes.DOES_NOT_END_WITH
		},
		INVALID_DATE_STRING: {
			type: "leaf",
			code: issueCodes.INVALID_DATE_STRING
		},
		INVALID_TIME_STRING: {
			type: "leaf",
			code: issueCodes.INVALID_TIME_STRING
		},
		INVALID_DATE_TIME_STRING: {
			type: "leaf",
			code: issueCodes.INVALID_DATE_TIME_STRING
		},
		INVALID_IP_ADDRESS: {
			type: "leaf",
			code: issueCodes.INVALID_IP_ADDRESS
		},
		INVALID_IP_ADDRESS_RANGE: {
			type: "leaf",
			code: issueCodes.INVALID_IP_ADDRESS_RANGE
		},
		INVALID_URL: {
			type: "leaf",
			code: issueCodes.INVALID_URL
		},
		DOES_NOT_MATCH_REGEX: {
			type: "leaf",
			code: issueCodes.DOES_NOT_MATCH_REGEX
		}
	};
	_clone() {
		const cloned = new StringSchema();
		cloned._checks = this._checks?.slice();
		return cloned;
	}
	_parse(value, _depth, _maxDepth) {
		if (typeof value !== "string") return this.issues.INVALID_TYPE;
		if (this._checks !== void 0) {
			const checks = this._checks;
			for (let i = 0; i < checks.length; i++) {
				const check = checks[i];
				switch (check.tag) {
					case TAG_MIN:
						if (value.length < check.param) return check.issue;
						break;
					case TAG_MAX:
						if (value.length > check.param) return check.issue;
						break;
					case TAG_REGEX:
						check.param.lastIndex = 0;
						if (!check.param.test(value)) return check.issue;
						break;
					case TAG_INCLUDES:
						if (!value.includes(check.param)) return check.issue;
						break;
					case TAG_STARTS_WITH:
						if (!value.startsWith(check.param)) return check.issue;
						break;
					case TAG_ENDS_WITH:
						if (!value.endsWith(check.param)) return check.issue;
						break;
					case TAG_URL:
						check.param.lastIndex = 0;
						if (!check.param.test(value) && !URL.canParse(value)) return check.issue;
						break;
				}
			}
		}
	}
	min(length) {
		if (!Number.isInteger(length) || length < 0) throw new Error("Length must be a non-negative integer.");
		if (length > this._effectiveMaxLength()) throw new Error("Minimum length must not exceed maximum length.");
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_MIN,
			param: length,
			issue: this.issues.TOO_SHORT
		});
		return cloned;
	}
	max(length) {
		if (!Number.isInteger(length) || length < 0) throw new Error("Length must be a non-negative integer.");
		if (length < this._effectiveMinLength()) throw new Error("Minimum length must not exceed maximum length.");
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_MAX,
			param: length,
			issue: this.issues.TOO_LONG
		});
		return cloned;
	}
	_effectiveMinLength() {
		let min = 0;
		if (this._checks !== void 0) {
			for (const check of this._checks) if (check.tag === TAG_MIN && check.param > min) min = check.param;
		}
		return min;
	}
	_effectiveMaxLength() {
		let max = Number.POSITIVE_INFINITY;
		if (this._checks !== void 0) {
			for (const check of this._checks) if (check.tag === TAG_MAX && check.param < max) max = check.param;
		}
		return max;
	}
	length(length) {
		if (!Number.isInteger(length) || length < 0) throw new Error("Length must be a non-negative integer.");
		if (length < this._effectiveMinLength() || length > this._effectiveMaxLength()) throw new Error("Minimum length must not exceed maximum length.");
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_MAX,
			param: length,
			issue: this.issues.TOO_LONG
		});
		cloned._checks.push({
			tag: TAG_MIN,
			param: length,
			issue: this.issues.TOO_SHORT
		});
		return cloned;
	}
	email() {
		const regex = emailRegex();
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_EMAIL
		});
		return cloned;
	}
	emoji() {
		const regex = emojiRegex();
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_EMOJI
		});
		return cloned;
	}
	uuid() {
		const regex = uuidRegex();
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_UUID
		});
		return cloned;
	}
	nanoid() {
		const regex = nanoidRegex();
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_NANOID
		});
		return cloned;
	}
	includes(searchString) {
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_INCLUDES,
			param: searchString,
			issue: this.issues.DOES_NOT_INCLUDE
		});
		return cloned;
	}
	startsWith(searchString) {
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_STARTS_WITH,
			param: searchString,
			issue: this.issues.DOES_NOT_START_WITH
		});
		return cloned;
	}
	endsWith(searchString) {
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_ENDS_WITH,
			param: searchString,
			issue: this.issues.DOES_NOT_END_WITH
		});
		return cloned;
	}
	date() {
		const regex = dateRegex();
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_DATE_STRING
		});
		return cloned;
	}
	time(options = {}) {
		if (options.precision !== void 0 && (!Number.isInteger(options.precision) || options.precision < 0)) throw new Error("Precision must be a non-negative integer.");
		const regex = timeRegex(options.precision, options.offset, options.local);
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_TIME_STRING
		});
		return cloned;
	}
	datetime(options = {}) {
		if (options.precision !== void 0 && (!Number.isInteger(options.precision) || options.precision < 0)) throw new Error("Precision must be a non-negative integer.");
		const regex = datetimeRegex(options.precision, options.offset, options.local);
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_DATE_TIME_STRING
		});
		return cloned;
	}
	ip(options = {}) {
		const regex = ipRegex(options.version);
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_IP_ADDRESS
		});
		return cloned;
	}
	cidr(options = {}) {
		const regex = ipCidrRegex(options.version);
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.INVALID_IP_ADDRESS_RANGE
		});
		return cloned;
	}
	url() {
		const regex = urlRegex();
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_URL,
			param: regex,
			issue: this.issues.INVALID_URL
		});
		return cloned;
	}
	regex(regex) {
		const cloned = this._clone();
		cloned._checks = cloned._checks || [];
		cloned._checks.push({
			tag: TAG_REGEX,
			param: regex,
			issue: this.issues.DOES_NOT_MATCH_REGEX
		});
		return cloned;
	}
}();
/**
* [String](https://paseri.dev/reference/schema/primitives/string/) schema.
*/ const string = () => singleton;
//#endregion
//#region ../schemas/libraries/@paseri/paseri/download.ts
const imageSchema = object({
	id: number(),
	created: date(),
	title: string().min(1).max(100),
	type: enum_("jpg", "png"),
	size: number(),
	url: string().url()
});
const ratingSchema = object({
	id: number(),
	stars: number().gte(0).lte(5),
	title: string().min(1).max(100),
	text: string().min(1).max(1e3),
	images: array(imageSchema)
});
object({
	id: number(),
	created: date(),
	title: string().min(1).max(100),
	brand: string().min(1).max(30),
	description: string().min(1).max(500),
	price: number().gte(1).lte(1e4),
	discount: number().gte(1).lte(100).nullable(),
	quantity: number().gte(0).lte(10),
	tags: array(string().min(1).max(30)),
	images: array(imageSchema),
	ratings: array(ratingSchema)
}).safeParse({});
//#endregion
