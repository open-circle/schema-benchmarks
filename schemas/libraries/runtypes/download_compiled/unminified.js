//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/defineProperties.js
const defineProperties = (target, properties, descriptor) => {
	for (const key of Reflect.ownKeys(properties)) {
		const value = properties[key];
		globalThis.Object.defineProperty(target, key, {
			...descriptor,
			value
		});
	}
	return target;
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/defineIntrinsics.js
const defineIntrinsics = (target, properties) => defineProperties(target, properties, {
	configurable: true,
	enumerable: false,
	writable: true
});
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Spread.js
const Spread = globalThis.Object.assign((content) => ({
	tag: "spread",
	content
}), { asSpreadable: (base) => defineIntrinsics(base, { *[Symbol.iterator]() {
	yield Spread(base);
} }) });
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/SUCCESS.js
const SUCCESS = (value) => ({
	success: true,
	value
});
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Literal.js
/**
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality>
*/
const sameValueZero = (x, y) => {
	if (typeof x === "number" && typeof y === "number") return x === y || x !== x && y !== y;
	return x === y;
};
const Literal = (value) => Runtype.create(({ received: x, expected }) => sameValueZero(x, value) ? SUCCESS(x) : typeof x !== typeof value || value === null ? FAILURE.TYPE_INCORRECT({
	expected,
	received: x
}) : FAILURE.VALUE_INCORRECT({
	expected,
	received: x
}), {
	tag: "literal",
	value
});
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/quoteWithDoubleQuote.js
const quoteWithDoubleQuote = (string) => `"${string.replaceAll("\"", "\\\"")}"`;
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/result/Failcode.js
const Failcode = {
	TYPE_INCORRECT: "TYPE_INCORRECT",
	VALUE_INCORRECT: "VALUE_INCORRECT",
	KEY_INCORRECT: "KEY_INCORRECT",
	CONTENT_INCORRECT: "CONTENT_INCORRECT",
	ARGUMENTS_INCORRECT: "ARGUMENTS_INCORRECT",
	RETURN_INCORRECT: "RETURN_INCORRECT",
	RESOLVE_INCORRECT: "RESOLVE_INCORRECT",
	CONSTRAINT_FAILED: "CONSTRAINT_FAILED",
	PROPERTY_MISSING: "PROPERTY_MISSING",
	PROPERTY_PRESENT: "PROPERTY_PRESENT",
	NOTHING_EXPECTED: "NOTHING_EXPECTED",
	PARSING_FAILED: "PARSING_FAILED",
	INSTANCEOF_FAILED: "INSTANCEOF_FAILED"
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/isObject.js
const isObject = (object) => object !== null && typeof object === "object";
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/enumerableKeysOf.js
const enumerableKeysOf = (object) => isObject(object) ? Reflect.ownKeys(object).filter((key) => globalThis.Object.prototype.propertyIsEnumerable.call(object, key)) : [];
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Optional.js
const Optional = Object.assign(((...args) => ({
	tag: "optional",
	underlying: args[0],
	...args.length === 2 ? { default: args[1] } : {}
})), { isOptional: (runtype) => runtype.tag === "optional" });
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/quoteWithBacktick.js
const quoteWithBacktick = (string) => `\`${string.replaceAll("`", "\\`")}\``;
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/show.js
/**
* Return the display string for the stringified version of a type, e.g.
*
* - `Number` -> `` `${number}` ``
* - `String` -> `string`
* - `Literal(42)` -> `"42"`
* - `Union(Literal("foo"), Number)` -> `` "foo" | `${number}` ``
*/
const showStringified = (circular) => (runtype) => {
	Runtype.assertIsRuntype(runtype);
	switch (runtype.tag) {
		case "literal": return quoteWithDoubleQuote(globalThis.String(runtype.value));
		case "string": return "string";
		case "brand": return runtype.brand;
		case "constraint": return showStringified(circular)(runtype.underlying);
		case "union": return runtype.alternatives.map((alternative) => showStringified(circular)(alternative)).join(" | ");
		case "intersect": return runtype.intersectees.map((alternative) => showStringified(circular)(alternative)).join(" & ");
		default: break;
	}
	return `\`\${${show(false, circular)(runtype)}}\``;
};
/**
* Return the display string which is to be embedded into the display string of
* the surrounding template literal type, e.g.
*
* - `Number` -> `${number}`
* - `String` -> `${string}`
* - `Literal("foo")` -> `foo`
* - `Union(Literal(42), Number)` -> `${"42" | number}`
*/
const showEmbedded = (circular) => (runtype) => {
	Runtype.assertIsRuntype(runtype);
	switch (runtype.tag) {
		case "literal": return globalThis.String(runtype.value);
		case "brand": return `\${${runtype.brand}}`;
		case "constraint": return showEmbedded(circular)(runtype.underlying);
		case "union":
			if (runtype.alternatives.length === 1) {
				const inner = runtype.alternatives[0];
				return showEmbedded(circular)(inner);
			}
			break;
		case "intersect":
			if (runtype.intersectees.length === 1) {
				const inner = runtype.intersectees[0];
				return showEmbedded(circular)(inner);
			}
			break;
		default: break;
	}
	return `\${${show(false, circular)(runtype)}}`;
};
const show = (needsParens, circular) => (runtype) => {
	Runtype.assertIsRuntype(runtype);
	const parenthesize = (s) => needsParens ? `(${s})` : s;
	if (circular.has(runtype)) return parenthesize(`CIRCULAR ${runtype.tag}`);
	else circular.add(runtype);
	try {
		switch (runtype.tag) {
			case "unknown":
			case "never":
			case "boolean":
			case "number":
			case "bigint":
			case "string":
			case "function": return runtype.tag;
			case "symbol": return "key" in runtype ? runtype.key === void 0 ? "unique symbol" : "symbol" : "symbol";
			case "literal": return typeof runtype.value === "bigint" ? globalThis.String(runtype.value) + "n" : typeof runtype.value === "string" ? quoteWithDoubleQuote(runtype.value) : globalThis.String(runtype.value);
			case "template": {
				if (runtype.strings.length === 0) return "\"\"";
				else if (runtype.strings.length === 1) return quoteWithDoubleQuote(runtype.strings[0]);
				else if (runtype.strings.length === 2) {
					if (runtype.strings.every((string) => string === "")) return showStringified(circular)(runtype.runtypes[0]);
				}
				let backtick = false;
				const inner = runtype.strings.reduce((inner, string, i) => {
					const prefix = inner + string;
					const r = runtype.runtypes[i];
					if (r) {
						const suffix = showEmbedded(circular)(r);
						if (!backtick && suffix.startsWith("$")) backtick = true;
						return prefix + suffix;
					} else return prefix;
				}, "");
				return backtick ? quoteWithBacktick(inner) : quoteWithDoubleQuote(inner);
			}
			case "array": return `${show(true, circular)(runtype.element)}[]`;
			case "record": return `{ [_: ${show(false, circular)(runtype.key)}]: ${show(false, circular)(runtype.value)} }`;
			case "object": {
				const keys = enumerableKeysOf(runtype.fields);
				return (runtype.isExact ? "exact " : "") + (keys.length ? `{ ${keys.map((key) => Optional.isOptional(runtype.fields[key]) ? `${key.toString()}?: ${show(false, circular)(runtype.fields[key].underlying)};` : `${key.toString()}: ${show(false, circular)(runtype.fields[key])};`).join(" ")} }` : "{}");
			}
			case "tuple": if (!Array.isArray(runtype.components)) {
				const components = runtype.components;
				if (components.leading.length === 0 && components.trailing.length === 0) return show(needsParens, circular)(components.rest);
				return `[${[
					...components.leading.map((component) => show(false, circular)(component)),
					`...${show(true, circular)(components.rest)}`,
					...components.trailing.map((component) => show(false, circular)(component))
				].join(", ")}]`;
			} else return `[${runtype.components.map((component) => show(false, circular)(component)).join(", ")}]`;
			case "union": return parenthesize(`${runtype.alternatives.map((alternative) => show(true, circular)(alternative)).join(" | ")}`);
			case "intersect": return parenthesize(`${runtype.intersectees.map((intersectee) => show(true, circular)(intersectee)).join(" & ")}`);
			case "constraint": return show(needsParens, circular)(runtype.underlying);
			case "instanceof": return runtype.ctor.name || "(Anonymous class)";
			case "brand": return runtype.brand;
			case "parser": return show(needsParens, circular)(runtype.underlying);
		}
	} finally {
		circular.delete(runtype);
	}
};
var show_default = show(false, /* @__PURE__ */ new Set());
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/typeOf.js
const typeOf = (value) => {
	const type = typeof value;
	if (type === "object") {
		if (value === null) return "null";
		if (Array.isArray(value)) return "array";
		const prototype = globalThis.Object.getPrototypeOf(value);
		if (prototype === null) return "object";
		if (prototype.constructor.name === "Object") return "object";
		return prototype.constructor.name;
	}
	return type;
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/FAILURE.js
const FAILURE = new Proxy({}, { get: (target, key, receiver) => {
	if (key in Failcode) return (failure) => {
		const content = {
			success: false,
			message: void 0,
			code: key,
			...failure
		};
		content.message = toMessage(content);
		return content;
	};
	else return Reflect.get(target, key, receiver);
} });
const toMessage = (failure) => {
	switch (failure.code) {
		case Failcode.TYPE_INCORRECT: return `Expected ${show_default(failure.expected)}, but was ${"details" in failure || "detail" in failure ? "incompatible" : typeOf(failure.received)}`;
		case Failcode.VALUE_INCORRECT: switch (failure.expected.tag) {
			case "symbol": {
				const expected = failure.expected.key;
				const received = globalThis.Symbol.keyFor(failure.received);
				return `Expected ${expected === void 0 ? "unique symbol" : `symbol for key ${quoteWithDoubleQuote(expected)}`}, but was ${received === void 0 ? "unique" : `for ${quoteWithDoubleQuote(received)}`}`;
			}
			default: return `Expected ${show_default(failure.expected)}, but was ${show_default(Literal(failure.received))}`;
		}
		case Failcode.KEY_INCORRECT: return `Expected key to be ${show_default(failure.expected)}, but was ${"details" in failure ? "incompatible" : show_default(Literal(failure.received))}`;
		case Failcode.CONTENT_INCORRECT: return `Expected ${show_default(failure.expected)}, but was incompatible`;
		case Failcode.ARGUMENTS_INCORRECT: return `Received unexpected arguments: ${failure.detail.message}`;
		case Failcode.RETURN_INCORRECT: return `Returned unexpected value: ${failure.detail.message}`;
		case Failcode.RESOLVE_INCORRECT: return `Resolved unexpected value: ${failure.detail.message}`;
		case Failcode.CONSTRAINT_FAILED: return `Constraint failed` + (failure.thrown ? `: ${failure.thrown instanceof Error ? failure.thrown.message : failure.thrown}` : "");
		case Failcode.PROPERTY_MISSING: return `Expected ${show_default(failure.expected)}, but was missing`;
		case Failcode.PROPERTY_PRESENT:
		case Failcode.NOTHING_EXPECTED: return `Expected nothing, but was present`;
		case Failcode.PARSING_FAILED: return `Parsing failed` + ("thrown" in failure ? `: ${failure.thrown instanceof Error ? failure.thrown.message : failure.thrown}` : "");
		case Failcode.INSTANCEOF_FAILED: return `\`instanceof\` failed in ${show_default(failure.expected)}` + ("thrown" in failure ? `: ${failure.thrown instanceof Error ? failure.thrown.message : failure.thrown}` : "");
	}
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Brand.js
const Brand = (brand, entity) => {
	const base = {
		tag: "brand",
		brand,
		entity
	};
	return Runtype.create(({ received, innerValidate, expected, parsing }) => {
		const result = innerValidate({
			expected: expected.entity,
			received,
			parsing
		});
		if (result.success) return result;
		return FAILURE.TYPE_INCORRECT({
			expected,
			received,
			detail: result
		});
	}, Spread.asSpreadable(base));
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Constraint.js
const Constraint = (underlying, constraint) => Runtype.create(({ received, innerValidate, expected, parsing }) => {
	const result = innerValidate({
		expected: expected.underlying,
		received,
		parsing: true
	});
	if (!result.success) return result;
	try {
		constraint(result.value);
		return SUCCESS(parsing ? result.value : received);
	} catch (error) {
		return FAILURE.CONSTRAINT_FAILED({
			expected,
			received,
			thrown: error
		});
	}
}, {
	tag: "constraint",
	underlying,
	constraint
});
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Intersect.js
const Intersect = (...intersectees) => {
	const base = {
		tag: "intersect",
		intersectees
	};
	return Runtype.create(({ received, innerValidate, expected, parsing }) => {
		if (expected.intersectees.length === 0) return SUCCESS(received);
		const results = [];
		const details = {};
		let success = SUCCESS(received);
		for (let i = 0; i < expected.intersectees.length; i++) {
			const intersectee = expected.intersectees[i];
			const result = innerValidate({
				expected: intersectee,
				received,
				parsing
			});
			results.push(result);
			if (result.success) {
				if (success) success = result;
			} else {
				details[i] = result;
				success = void 0;
			}
		}
		if (!success) return FAILURE.TYPE_INCORRECT({
			expected,
			received,
			details
		});
		return SUCCESS(parsing ? success.value : received);
	}, Spread.asSpreadable(base));
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Parser.js
const Parser = (underlying, parser) => Runtype.create(({ received, innerValidate, expected, parsing }) => {
	try {
		const result = innerValidate({
			expected: expected.underlying,
			received,
			parsing
		});
		if (!result.success) return result;
		if (!parsing) return result;
		return SUCCESS(expected.parser(result.value));
	} catch (error) {
		return FAILURE.PARSING_FAILED({
			expected,
			received,
			thrown: error
		});
	}
}, {
	tag: "parser",
	underlying,
	parser
});
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Union.js
const Union = (...alternatives) => {
	const base = {
		tag: "union",
		alternatives
	};
	return Runtype.create(({ received, innerValidate, expected, parsing }) => {
		if (expected.alternatives.length === 0) return FAILURE.NOTHING_EXPECTED({
			expected,
			received
		});
		const results = [];
		const details = {};
		for (let i = 0; i < expected.alternatives.length; i++) {
			const alternative = expected.alternatives[i];
			const result = innerValidate({
				expected: alternative,
				received,
				parsing
			});
			results.push(result);
			if (result.success) return SUCCESS(parsing ? result.value : received);
			else details[i] = result;
		}
		return FAILURE.TYPE_INCORRECT({
			expected,
			received,
			details
		});
	}, Spread.asSpreadable(base)).with((self) => defineIntrinsics({}, { match: ((...cases) => (value) => {
		for (let i = 0; i < self.alternatives.length; i++) try {
			return cases[i](self.alternatives[i].parse(value));
		} catch (error) {
			continue;
		}
		throw new Error("No alternatives were matched");
	}) }));
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/result/ValidationError.js
var _a$1;
const ValidationErrorSymbol = globalThis.Symbol();
var ValidationError = class extends Error {
	constructor(failure) {
		super(failure.message);
		/**
		* Always `"ValidationError"`.
		*/
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ValidationError"
		});
		/**
		* A string that summarizes the problem overall.
		*/
		Object.defineProperty(this, "message", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		/**
		* An object that describes the problem in a structured way.
		*/
		Object.defineProperty(this, "failure", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.message = failure.message;
		this.failure = failure;
		defineIntrinsics(this, { [ValidationErrorSymbol]: void 0 });
	}
};
_a$1 = globalThis.Symbol.hasInstance;
Object.defineProperty(ValidationError, "isValidationError", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: (value) => value instanceof Error && globalThis.Object.hasOwn(value, ValidationErrorSymbol)
});
Object.defineProperty(ValidationError, _a$1, {
	enumerable: true,
	configurable: true,
	writable: true,
	value: ValidationError.isValidationError
});
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/copyProperties.js
const copyProperties = (dst, src) => {
	globalThis.Object.defineProperties(dst, globalThis.Object.getOwnPropertyDescriptors(src));
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Runtype.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Runtype_createInnerValidate, _b, _c, _d, _e;
const RuntypeSymbol = globalThis.Symbol();
const RuntypeConformance = globalThis.Symbol();
const RuntypePrivate = globalThis.Symbol();
/**
* A runtype determines at runtime whether a value conforms to a type specification.
*/
var Runtype = class {
	get [(_b = RuntypeSymbol, _c = RuntypeConformance, _d = RuntypePrivate, globalThis.Symbol.toStringTag)]() {
		return `Runtype<${show_default(this)}>`;
	}
	toString() {
		return `[object ${this[globalThis.Symbol.toStringTag]}]`;
	}
	/** @internal */ constructor(validate, base) {
		Object.defineProperty(this, "tag", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		/** @internal */ Object.defineProperty(this, _b, {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		/** @internal */ Object.defineProperty(this, _c, {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		/** @internal */ Object.defineProperty(this, _d, {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		delete this[RuntypeSymbol];
		delete this[RuntypeConformance];
		copyProperties(this, base);
		defineIntrinsics(this, { [RuntypePrivate]: globalThis.Object.assign(({ expected, received, visited, parsing, memoParsed }) => {
			if (isObject(received)) {
				const memo = visited.memo(received, expected, null);
				if (memo) return memo;
				else if (memo === void 0) {
					const innerValidate = __classPrivateFieldGet(_a, _a, "f", _Runtype_createInnerValidate).call(_a, visited);
					const result = expected[RuntypePrivate].validate({
						received,
						innerValidate,
						expected,
						parsing,
						memoParsed
					});
					visited.memo(received, expected, result);
					return result;
				} else return SUCCESS(parsing && memoParsed?.get(received) || received);
			} else {
				const innerValidate = __classPrivateFieldGet(_a, _a, "f", _Runtype_createInnerValidate).call(_a, visited);
				return expected[RuntypePrivate].validate({
					received,
					innerValidate,
					expected,
					parsing,
					memoParsed
				});
			}
		}, {
			validate,
			extensions: []
		}) });
		copyProperties(base, this);
		bindThis(base, new.target.prototype);
		return base;
	}
	/**
	* Process a value with this runtype, returning a detailed information of success or failure. Does not throw on failure.
	*/
	inspect(x, options = {}) {
		return this[RuntypePrivate]({
			expected: this,
			received: x,
			visited: createVisitedState(),
			parsing: options.parse ?? true
		});
	}
	/**
	* Validates that a value conforms to this runtype, returning the original value, statically typed. Throws `ValidationError` on failure.
	*/
	check(x) {
		const result = this.inspect(x, { parse: false });
		if (result.success) return result.value;
		else throw new ValidationError(result);
	}
	/**
	* Validates that a value conforms to this runtype, returning a `boolean` that represents success or failure. Does not throw on failure.
	*/
	guard(x) {
		return this.inspect(x, { parse: false }).success;
	}
	/**
	* Validates that a value conforms to this runtype. Throws `ValidationError` on failure.
	*/
	assert(x) {
		this.check(x);
	}
	/**
	* Validates that a value conforms to this runtype and returns another value returned by the function passed to `withParser`. Throws `ValidationError` on failure. Does not modify the original value.
	*/
	parse(x) {
		const result = this.inspect(x, { parse: true });
		if (result.success) return result.value;
		else throw new ValidationError(result);
	}
	/**
	* Returns a shallow clone of this runtype with additional properties. Useful when you want to integrate related values, such as the default value and utility functions.
	*/
	with(extension) {
		const cloned = this.clone();
		cloned[RuntypePrivate].extensions = [...this[RuntypePrivate].extensions, extension];
		for (const extension of cloned[RuntypePrivate].extensions) copyProperties(cloned, typeof extension === "function" ? extension(cloned) : extension);
		return cloned;
	}
	/**
	* Creates a shallow clone of this runtype.
	*/
	clone() {
		const base = typeof this === "function" ? this.bind(void 0) : globalThis.Object.create(globalThis.Object.getPrototypeOf(this));
		copyProperties(base, this);
		const cloned = new _a(this[RuntypePrivate].validate, base);
		cloned[RuntypePrivate].extensions = this[RuntypePrivate].extensions;
		for (const extension of cloned[RuntypePrivate].extensions) copyProperties(cloned, typeof extension === "function" ? extension(cloned) : extension);
		return cloned;
	}
	/**
	* Unions this Runtype with another.
	*/
	or(other) {
		return Union(this, other);
	}
	/**
	* Intersects this Runtype with another.
	*/
	and(other) {
		return Intersect(this, other);
	}
	/**
	* Optionalizes this property.
	*
	* Note that `Optional` is not a runtype, but just a contextual modifier which is only meaningful when defining the content of `Object`. If you want to allow the validated value to be `undefined`, use `undefinedable` method.
	*/
	optional() {
		return Optional(this);
	}
	/**
	* Optionalizes this property, defaulting to the given value if this property was absent. Only meaningful for parsing.
	*/
	default(value) {
		return Optional(this, value);
	}
	/**
	* Unions this runtype with `Null`.
	*/
	nullable() {
		return Union(this, Literal(null));
	}
	/**
	* Unions this runtype with `Undefined`.
	*/
	undefinedable() {
		return Union(this, Literal(void 0));
	}
	/**
	* Unions this runtype with `Null` and `Undefined`.
	*/
	nullishable() {
		return Union(this, Literal(null), Literal(void 0));
	}
	/**
	* Uses a constraint function to add additional constraints to this runtype, and manually converts a static type of this runtype into another via the type argument if passed.
	*/
	withConstraint(constraint) {
		return Constraint(this, (x) => {
			const message = constraint(x);
			if (typeof message === "string") throw message;
			else if (!message) throw void 0;
		});
	}
	/**
	* Uses a guard function to add additional constraints to this runtype, and automatically converts a static type of this runtype into another.
	*/
	withGuard(guard) {
		return Constraint(this, (x) => {
			if (!guard(x)) throw void 0;
		});
	}
	/**
	* Uses an assertion function to add additional constraints to this runtype, and automatically converts a static type of this runtype into another.
	*/
	withAssertion(assert) {
		return Constraint(this, assert);
	}
	/**
	* Adds a brand to the type.
	*/
	withBrand(brand) {
		return Brand(brand, this);
	}
	/**
	* Chains custom parser after this runtype. Basically only works in the `parse` method, but in certain cases parsing is implied within a chain of normal validation, such as before execution of a constraint, or upon function boundaries enforced with `Contract` and `AsyncContract`.
	*/
	withParser(parser) {
		return Parser(this, parser);
	}
	/**
	* Statically ensures this runtype is defined for exactly `T`, not for a subtype of `T`. `X` is for the parsed type.
	*/
	conform() {
		return this;
	}
};
_a = Runtype, _e = globalThis.Symbol.hasInstance;
/** @internal */ Object.defineProperty(Runtype, "create", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: (validate, base) => new _a(validate, base)
});
_Runtype_createInnerValidate = { value: (visited) => (context) => context.expected[RuntypePrivate]({
	...context,
	visited
}) };
/**
* Guards if a value is a runtype.
*/
Object.defineProperty(Runtype, "isRuntype", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: (x) => x instanceof globalThis.Object && globalThis.Object.hasOwn(x, RuntypePrivate)
});
/**
* Asserts if a value is a runtype.
*/
Object.defineProperty(Runtype, "assertIsRuntype", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: (x) => {
		if (!_a.isRuntype(x)) throw new Error("Expected runtype, but was not");
	}
});
Object.defineProperty(Runtype, _e, {
	enumerable: true,
	configurable: true,
	writable: true,
	value: _a.isRuntype
});
const bindThis = (self, prototype) => {
	const descriptors = globalThis.Object.getOwnPropertyDescriptors(prototype);
	delete descriptors["constructor"];
	for (const key of globalThis.Reflect.ownKeys(descriptors)) {
		const descriptor = descriptors[key];
		if ("value" in descriptor && typeof descriptor.value === "function") descriptor.value = descriptor.value.bind(self);
		if ("get" in descriptor && descriptor.get) descriptor.get = descriptor.get.bind(self);
		if ("set" in descriptor && descriptor.set) descriptor.set = descriptor.set.bind(self);
	}
	globalThis.Object.defineProperties(self, descriptors);
};
const createVisitedState = () => {
	const map = /* @__PURE__ */ new WeakMap();
	const memo = (candidate, runtype, result) => {
		const inner = map.get(candidate) ?? /* @__PURE__ */ new WeakMap();
		map.set(candidate, inner);
		const memo = inner.get(runtype);
		inner.set(runtype, result);
		return memo;
	};
	return { memo };
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/isNumberLikeKey.js
/**
* Mimicking the behavior of type-level `` `${number}` ``.
*
* Note that `` `${NaN}` `` is not assignable to a variable of type `` `${number}` ``, but `` `${NaN as number}` `` is assignable, thus this function also accepts `"NaN"`. The same applies to `Infinity` and `-Infinity`.
*/
const isNumberLikeKey = (key) => typeof key === "string" && key === globalThis.Number(key).toString();
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Array.js
const Array$1 = (element) => {
	const base = {
		tag: "array",
		element
	};
	return Runtype.create(({ received, innerValidate, expected, parsing }) => {
		if (!globalThis.Array.isArray(received)) return FAILURE.TYPE_INCORRECT({
			expected,
			received
		});
		const keys = enumerableKeysOf(received).filter(isNumberLikeKey);
		const results = keys.map((key) => innerValidate({
			expected: element,
			received: received[key],
			parsing
		}));
		const details = {};
		for (const key of keys) {
			const result = results[key];
			if (!result.success) details[key] = result;
		}
		if (enumerableKeysOf(details).length !== 0) return FAILURE.CONTENT_INCORRECT({
			expected,
			received,
			details
		});
		else return SUCCESS(parsing ? results.map((result) => result.value) : received);
	}, Spread.asSpreadable(base)).with((self) => defineIntrinsics({}, { asReadonly: () => self }));
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/InstanceOf.js
const InstanceOf = (ctor) => Runtype.create(({ received, expected }) => {
	try {
		if (received instanceof ctor) return SUCCESS(received);
		else return FAILURE.TYPE_INCORRECT({
			expected,
			received
		});
	} catch (error) {
		return FAILURE.INSTANCEOF_FAILED({
			expected,
			received,
			thrown: error
		});
	}
}, {
	tag: "instanceof",
	ctor
});
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Never.js
const Never = Runtype.create(({ received, expected }) => FAILURE.NOTHING_EXPECTED({
	expected,
	received
}), { tag: "never" });
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Number.js
const Number = Runtype.create(({ received, expected }) => typeof received === "number" ? SUCCESS(received) : FAILURE.TYPE_INCORRECT({
	expected,
	received
}), { tag: "number" });
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/defineProperty.js
const defineProperty = (target, key, value) => {
	globalThis.Object.defineProperty(target, key, {
		value,
		configurable: true,
		enumerable: true,
		writable: true
	});
	return target;
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/utils-internal/hasEnumerableOwn.js
const hasEnumerableOwn = (key, object) => globalThis.Object.prototype.propertyIsEnumerable.call(object, key);
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/Object.js
const Object$1 = (fields) => {
	return Runtype.create(({ received: x, innerValidate, expected, parsing, memoParsed: memoParsedInherited }) => {
		if (x === null || x === void 0) return FAILURE.TYPE_INCORRECT({
			expected,
			received: x
		});
		const keysOfFields = enumerableKeysOf(expected.fields);
		if (keysOfFields.length !== 0 && typeof x !== "object") return FAILURE.TYPE_INCORRECT({
			expected,
			received: x
		});
		const keys = [...new Set([...keysOfFields, ...enumerableKeysOf(x)])];
		const results = {};
		const memoParsed = memoParsedInherited ?? /* @__PURE__ */ new WeakMap();
		const parsed = (() => {
			if (isObject(x)) {
				const parsed = memoParsed.get(x) ?? {};
				memoParsed.set(x, parsed);
				return parsed;
			} else return {};
		})();
		for (const key of keys) {
			const fieldsHasKey = hasEnumerableOwn(key, expected.fields);
			const xHasKey = hasEnumerableOwn(key, x);
			if (fieldsHasKey) {
				const runtype = expected.fields[key];
				if (xHasKey) {
					const received = x[key];
					if (Optional.isOptional(runtype)) defineProperty(results, key, innerValidate({
						expected: runtype.underlying,
						received,
						parsing,
						memoParsed
					}));
					else defineProperty(results, key, innerValidate({
						expected: runtype,
						received,
						parsing,
						memoParsed
					}));
					if (results[key].success) defineProperty(parsed, key, results[key].value);
				} else if (Optional.isOptional(runtype)) if ("default" in runtype) {
					defineProperty(results, key, SUCCESS(runtype.default));
					defineProperty(parsed, key, runtype.default);
				} else defineProperty(results, key, SUCCESS(void 0));
				else defineProperty(results, key, FAILURE.PROPERTY_MISSING({ expected: runtype }));
			} else if (xHasKey) {
				const received = x[key];
				if (expected.isExact) defineProperty(results, key, FAILURE.PROPERTY_PRESENT({
					expected: Never,
					received
				}));
				else defineProperty(results, key, SUCCESS(received));
			} else throw new Error("impossible");
		}
		const details = {};
		for (const key of keys) {
			const result = results[key];
			if (!result.success) defineProperty(details, key, result);
		}
		if (enumerableKeysOf(details).length !== 0) return FAILURE.CONTENT_INCORRECT({
			expected,
			received: x,
			details
		});
		else return SUCCESS(parsing ? parsed : x);
	}, {
		tag: "object",
		fields,
		isExact: false
	}).with((self) => defineIntrinsics({}, {
		asPartial: () => {
			const cloned = self.clone();
			const existingKeys = enumerableKeysOf(self.fields);
			const fields = {};
			for (const key of existingKeys) {
				const value = self.fields[key];
				defineProperty(fields, key, Optional.isOptional(value) ? value : Optional(value));
			}
			cloned.fields = fields;
			return cloned;
		},
		asReadonly: () => self.clone(),
		pick: (...keys) => {
			const cloned = self.clone();
			const existingKeys = enumerableKeysOf(self.fields);
			const fields = {};
			for (const key of existingKeys) if (keys.includes(key)) defineProperty(fields, key, self.fields[key]);
			cloned.fields = fields;
			return cloned;
		},
		omit: (...keys) => {
			const cloned = self.clone();
			const existingKeys = enumerableKeysOf(self.fields);
			const fields = {};
			for (const key of existingKeys) if (!keys.includes(key)) defineProperty(fields, key, self.fields[key]);
			cloned.fields = fields;
			return cloned;
		},
		extend: (extension) => {
			const cloned = self.clone();
			const fields = {};
			copyProperties(fields, self.fields);
			copyProperties(fields, extension);
			cloned.fields = fields;
			return cloned;
		},
		exact: () => {
			const cloned = self.clone();
			cloned.isExact = true;
			return cloned;
		}
	}));
};
//#endregion
//#region ../node_modules/.pnpm/runtypes@7.0.4/node_modules/runtypes/esm/String.js
const String = Runtype.create(({ received, expected }) => typeof received === "string" ? SUCCESS(received) : FAILURE.TYPE_INCORRECT({
	expected,
	received
}), { tag: "string" });
//#endregion
//#region ../schemas/libraries/runtypes/download.ts
const StringWithLength = (min, max) => String.withConstraint((s) => s.length >= min && s.length <= max);
const NumberInRange = (min, max) => Number.withConstraint((n) => n >= min && n <= max);
const Image = Object$1({
	id: Number,
	created: InstanceOf(Date),
	title: StringWithLength(1, 100),
	type: Union(Literal("jpg"), Literal("png")),
	size: Number,
	url: String.withConstraint((s) => URL.canParse(s))
});
const Rating = Object$1({
	id: Number,
	stars: NumberInRange(0, 5),
	title: StringWithLength(1, 100),
	text: StringWithLength(1, 1e3),
	images: Array$1(Image)
});
Object$1({
	id: Number,
	created: InstanceOf(Date),
	title: StringWithLength(1, 100),
	brand: StringWithLength(1, 30),
	description: StringWithLength(1, 500),
	price: NumberInRange(1, 1e4),
	discount: NumberInRange(1, 100).nullable(),
	quantity: NumberInRange(0, 10),
	tags: Array$1(StringWithLength(1, 30)),
	images: Array$1(Image),
	ratings: Array$1(Rating)
}).conform().parse({});
//#endregion
