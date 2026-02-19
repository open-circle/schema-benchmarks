//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Pipeable.js
/**
* @since 2.0.0
*/
/**
* @since 2.0.0
* @category utilities
* @example
* ```ts
* import { Pipeable } from "effect"
*
* // pipeArguments is used internally to implement efficient piping
* function customPipe<A>(self: A, ...fns: Array<(a: any) => any>): unknown {
*   return Pipeable.pipeArguments(self, arguments as any)
* }
*
* // Example usage
* const add = (x: number) => (y: number) => x + y
* const multiply = (x: number) => (y: number) => x * y
*
* const result = customPipe(5, add(2), multiply(3))
* console.log(result) // 21
* ```
*/
const pipeArguments = (self, args) => {
	switch (args.length) {
		case 0: return self;
		case 1: return args[0](self);
		case 2: return args[1](args[0](self));
		case 3: return args[2](args[1](args[0](self)));
		case 4: return args[3](args[2](args[1](args[0](self))));
		case 5: return args[4](args[3](args[2](args[1](args[0](self)))));
		case 6: return args[5](args[4](args[3](args[2](args[1](args[0](self))))));
		case 7: return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))));
		case 8: return args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))));
		case 9: return args[8](args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))));
		default: {
			let ret = self;
			for (let i = 0, len = args.length; i < len; i++) ret = args[i](ret);
			return ret;
		}
	}
};
/**
* @since 4.0.0
*/
const Class$1 = class {
	pipe() {
		return pipeArguments(this, arguments);
	}
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Function.js
/**
* Creates a function that can be used in a data-last (aka `pipe`able) or
* data-first style.
*
* The first parameter to `dual` is either the arity of the uncurried function
* or a predicate that determines if the function is being used in a data-first
* or data-last style.
*
* Using the arity is the most common use case, but there are some cases where
* you may want to use a predicate. For example, if you have a function that
* takes an optional argument, you can use a predicate to determine if the
* function is being used in a data-first or data-last style.
*
* You can pass either the arity of the uncurried function or a predicate
* which determines if the function is being used in a data-first or
* data-last style.
*
* @example
* ```ts
* import { dual, pipe } from "effect/Function"
*
* // Using arity to determine data-first or data-last style
* const sum = dual<
*   (that: number) => (self: number) => number,
*   (self: number, that: number) => number
* >(2, (self, that) => self + that)
*
* console.log(sum(2, 3)) // 5 (data-first)
* console.log(pipe(2, sum(3))) // 5 (data-last)
* ```
*
* **Example** (Using arity to determine data-first or data-last style)
*
* ```ts
* import { dual, pipe } from "effect/Function"
*
* const sum = dual<
*   (that: number) => (self: number) => number,
*   (self: number, that: number) => number
* >(2, (self, that) => self + that)
*
* console.log(sum(2, 3)) // 5
* console.log(pipe(2, sum(3))) // 5
* ```
*
* **Example** (Using call signatures to define the overloads)
*
* ```ts
* import { dual, pipe } from "effect/Function"
*
* const sum: {
*   (that: number): (self: number) => number
*   (self: number, that: number): number
* } = dual(2, (self: number, that: number): number => self + that)
*
* console.log(sum(2, 3)) // 5
* console.log(pipe(2, sum(3))) // 5
* ```
*
* **Example** (Using a predicate to determine data-first or data-last style)
*
* ```ts
* import { dual, pipe } from "effect/Function"
*
* const sum = dual<
*   (that: number) => (self: number) => number,
*   (self: number, that: number) => number
* >(
*   (args) => args.length === 2,
*   (self, that) => self + that
* )
*
* console.log(sum(2, 3)) // 5
* console.log(pipe(2, sum(3))) // 5
* ```
*
* @category combinators
* @since 2.0.0
*/
const dual = function(arity, body) {
	if (typeof arity === "function") return function() {
		return arity(arguments) ? body.apply(this, arguments) : (self) => body(self, ...arguments);
	};
	switch (arity) {
		case 0:
		case 1: throw new RangeError(`Invalid arity ${arity}`);
		case 2: return function(a, b) {
			if (arguments.length >= 2) return body(a, b);
			return function(self) {
				return body(self, a);
			};
		};
		case 3: return function(a, b, c) {
			if (arguments.length >= 3) return body(a, b, c);
			return function(self) {
				return body(self, a, b);
			};
		};
		default: return function() {
			if (arguments.length >= arity) return body.apply(this, arguments);
			const args = arguments;
			return function(self) {
				return body(self, ...args);
			};
		};
	}
};
/**
* The identity function, i.e. A function that returns its input argument.
*
* @example
* ```ts
* import { identity } from "effect/Function"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(identity(5), 5)
* ```
*
* @category combinators
* @since 2.0.0
*/
const identity = (a) => a;
/**
* Creates a constant value that never changes.
*
* This is useful when you want to pass a value to a higher-order function (a function that takes another function as its argument)
* and want that inner function to always use the same value, no matter how many times it is called.
*
* @example
* ```ts
* import { constant } from "effect/Function"
* import * as assert from "node:assert"
*
* const constNull = constant(null)
*
* assert.deepStrictEqual(constNull(), null)
* assert.deepStrictEqual(constNull(), null)
* ```
*
* @category constructors
* @since 2.0.0
*/
const constant = (value) => () => value;
/**
* A thunk that returns always `true`.
*
* @example
* ```ts
* import { constTrue } from "effect/Function"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(constTrue(), true)
* ```
*
* @category constants
* @since 2.0.0
*/
const constTrue = /* @__PURE__ */ constant(true);
/**
* A thunk that returns always `false`.
*
* @example
* ```ts
* import { constFalse } from "effect/Function"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(constFalse(), false)
* ```
*
* @category constants
* @since 2.0.0
*/
const constFalse = /* @__PURE__ */ constant(false);
/**
* A thunk that returns always `undefined`.
*
* @example
* ```ts
* import { constUndefined } from "effect/Function"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(constUndefined(), undefined)
* ```
*
* @category constants
* @since 2.0.0
*/
const constUndefined = /* @__PURE__ */ constant(void 0);
/**
* A thunk that returns always `void`.
*
* @example
* ```ts
* import { constVoid } from "effect/Function"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(constVoid(), undefined)
* ```
*
* @category constants
* @since 2.0.0
*/
const constVoid = constUndefined;
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
	switch (arguments.length) {
		case 1: return ab;
		case 2: return function() {
			return bc(ab.apply(this, arguments));
		};
		case 3: return function() {
			return cd(bc(ab.apply(this, arguments)));
		};
		case 4: return function() {
			return de(cd(bc(ab.apply(this, arguments))));
		};
		case 5: return function() {
			return ef(de(cd(bc(ab.apply(this, arguments)))));
		};
		case 6: return function() {
			return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
		};
		case 7: return function() {
			return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
		};
		case 8: return function() {
			return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
		};
		case 9: return function() {
			return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
		};
	}
}
/**
* @since 4.0.0
*/
function memoize(f) {
	const cache = /* @__PURE__ */ new WeakMap();
	return (a) => {
		if (cache.has(a)) return cache.get(a);
		const result = f(a);
		cache.set(a, result);
		return result;
	};
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/equal.js
/** @internal */
const getAllObjectKeys = (obj) => {
	const keys = new Set(Reflect.ownKeys(obj));
	if (obj.constructor === Object) return keys;
	if (obj instanceof Error) keys.delete("stack");
	const proto = Object.getPrototypeOf(obj);
	let current = proto;
	while (current !== null && current !== Object.prototype) {
		const ownKeys = Reflect.ownKeys(current);
		for (let i = 0; i < ownKeys.length; i++) keys.add(ownKeys[i]);
		current = Object.getPrototypeOf(current);
	}
	if (keys.has("constructor") && typeof obj.constructor === "function" && proto === obj.constructor.prototype) keys.delete("constructor");
	return keys;
};
/** @internal */
const byReferenceInstances = /* @__PURE__ */ new WeakSet();

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Predicate.js
/**
* Predicate and Refinement helpers for runtime checks, filtering, and type narrowing.
* This module provides small, pure functions you can combine to decide whether a
* value matches a condition and, when using refinements, narrow TypeScript types.
*
* Mental model:
* - A `Predicate<A>` is just `(a: A) => boolean`.
* - A `Refinement<A, B>` is a predicate that narrows `A` to `B` when true.
* - Guards like `isString` are predicates/refinements for common runtime types.
* - Combinators like `and`/`or` build new predicates from existing ones.
* - `Tuple` and `Struct` lift element/property predicates to compound values.
*
* Common tasks:
* - Reuse an existing predicate on a different input shape -> {@link mapInput}
* - Combine checks -> {@link and}, {@link or}, {@link not}, {@link xor}
* - Build tuple/object checks -> {@link Tuple}, {@link Struct}
* - Narrow `unknown` to a concrete type -> {@link Refinement}, {@link compose}
* - Check runtime types -> {@link isString}, {@link isNumber}, {@link isObject}
*
* Gotchas:
* - `isTruthy` uses JavaScript truthiness; `0`, "", and `false` are false.
* - `isObject` excludes arrays; use {@link isObjectOrArray} for both.
* - `isIterable` treats strings as iterable.
* - `isPromise`/`isPromiseLike` are structural checks (then/catch), not `instanceof`.
* - `isTupleOf` and `isTupleOfAtLeast` only check length, not element types.
*
* **Example** (Filter by a predicate)
*
* ```ts
* import * as Predicate from "effect/Predicate"
*
* const isPositive = (n: number) => n > 0
* const data = [2, -1, 3]
*
* console.log(data.filter(isPositive))
* ```
*
* See also: {@link Predicate}, {@link Refinement}, {@link and}, {@link or}, {@link mapInput}
*
* @since 2.0.0
*/
/**
* Checks whether a value is a `string`.
*
* When to use:
* - You need to guard an `unknown` value as a string.
* - You want to narrow in `if` statements.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `typeof input === "string"`.
*
* **Example** (Guard string)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = "hi"
*
* if (Predicate.isString(data)) {
*   console.log(data.toUpperCase())
* }
* ```
*
* See also: {@link isNumber}, {@link isBoolean}, {@link Refinement}
*
* @category guards
* @since 2.0.0
*/
function isString(input) {
	return typeof input === "string";
}
/**
* Checks whether a value is a `number`.
*
* When to use:
* - You need to guard an `unknown` value as a number.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `typeof input === "number"`.
* - Does not exclude `NaN` or `Infinity`.
*
* **Example** (Guard number)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = 42
*
* if (Predicate.isNumber(data)) {
*   console.log(data + 1)
* }
* ```
*
* See also: {@link isBigInt}, {@link isString}
*
* @category guards
* @since 2.0.0
*/
function isNumber(input) {
	return typeof input === "number";
}
/**
* Checks whether a value is a `boolean`.
*
* When to use:
* - You need to guard an `unknown` value as a boolean.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `typeof input === "boolean"`.
*
* **Example** (Guard boolean)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = true
*
* if (Predicate.isBoolean(data)) {
*   console.log(data ? "yes" : "no")
* }
* ```
*
* See also: {@link isString}, {@link isNumber}
*
* @category guards
* @since 2.0.0
*/
function isBoolean(input) {
	return typeof input === "boolean";
}
/**
* Checks whether a value is a `bigint`.
*
* When to use:
* - You need to guard an `unknown` value as a bigint.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `typeof input === "bigint"`.
*
* **Example** (Guard bigint)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = 1n
*
* if (Predicate.isBigInt(data)) {
*   console.log(data + 2n)
* }
* ```
*
* See also: {@link isNumber}
*
* @category guards
* @since 2.0.0
*/
function isBigInt(input) {
	return typeof input === "bigint";
}
/**
* Checks whether a value is a `symbol`.
*
* When to use:
* - You need to guard an `unknown` value as a symbol.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `typeof input === "symbol"`.
*
* **Example** (Guard symbol)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = Symbol.for("id")
*
* if (Predicate.isSymbol(data)) {
*   console.log(data.description)
* }
* ```
*
* See also: {@link isPropertyKey}
*
* @category guards
* @since 2.0.0
*/
function isSymbol(input) {
	return typeof input === "symbol";
}
/**
* Checks whether a value is a `function`.
*
* When to use:
* - You need to guard an `unknown` value as callable.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `typeof input === "function"`.
*
* **Example** (Guard function)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = () => 1
*
* if (Predicate.isFunction(data)) {
*   console.log(data())
* }
* ```
*
* See also: {@link isObjectKeyword}
*
* @category guards
* @since 2.0.0
*/
function isFunction(input) {
	return typeof input === "function";
}
/**
* Checks whether a value is `undefined`.
*
* When to use:
* - You need a guard for optional values.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `input === undefined`.
*
* **Example** (Guard undefined)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = undefined
*
* console.log(Predicate.isUndefined(data))
* ```
*
* See also: {@link isNotUndefined}, {@link isNullish}
*
* @category guards
* @since 2.0.0
*/
function isUndefined(input) {
	return input === void 0;
}
/**
* Checks whether a value is not `undefined`.
*
* When to use:
* - You want to filter out `undefined` while preserving other falsy values.
*
* Behavior:
* - Pure; does not mutate input.
* - Returns a refinement that excludes `undefined`.
*
* **Example** (Filter undefined)
*
* ```ts
* import { Predicate } from "effect"
*
* const values = [1, undefined, 2]
* const defined = values.filter(Predicate.isNotUndefined)
*
* console.log(defined)
* ```
*
* See also: {@link isUndefined}, {@link isNotNullish}
*
* @category guards
* @since 2.0.0
*/
function isNotUndefined(input) {
	return input !== void 0;
}
/**
* Checks whether a value is not `null` and not `undefined`.
*
* When to use:
* - You want to filter out nullish values but keep other falsy ones.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `input != null`.
*
* **Example** (Filter non-nullish)
*
* ```ts
* import { Predicate } from "effect"
*
* const values = [0, null, "", undefined]
* const present = values.filter(Predicate.isNotNullish)
*
* console.log(present)
* ```
*
* See also: {@link isNullish}, {@link isNotNull}, {@link isNotUndefined}
*
* @category guards
* @since 4.0.0
*/
function isNotNullish(input) {
	return input != null;
}
/**
* A guard that always returns `false`.
*
* When to use:
* - You need a predicate that never accepts, e.g. in default branches.
*
* Behavior:
* - Pure; does not mutate input.
* - Always returns `false`.
*
* **Example** (Never matches)
*
* ```ts
* import { Predicate } from "effect"
*
* console.log(Predicate.isNever("anything"))
* ```
*
* See also: {@link isUnknown}
*
* @category guards
* @since 2.0.0
*/
function isNever$1(_) {
	return false;
}
/**
* A guard that always returns `true`.
*
* When to use:
* - You need a predicate that always accepts, e.g. as a placeholder.
*
* Behavior:
* - Pure; does not mutate input.
* - Always returns `true`.
*
* **Example** (Always matches)
*
* ```ts
* import { Predicate } from "effect"
*
* console.log(Predicate.isUnknown(123))
* ```
*
* See also: {@link isNever}
*
* @category guards
* @since 2.0.0
*/
function isUnknown(_) {
	return true;
}
/**
* Checks whether a value is a plain object (not an array, not `null`).
*
* When to use:
* - You need to accept objects but exclude arrays.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `typeof input === "object" && input !== null && !Array.isArray(input)`.
*
* **Example** (Guard object)
*
* ```ts
* import { Predicate } from "effect"
*
* console.log(Predicate.isObject({ a: 1 }))
* console.log(Predicate.isObject([1, 2]))
* ```
*
* See also: {@link isObjectOrArray}, {@link isReadonlyObject}
*
* @category guards
* @since 4.0.0
*/
function isObject(input) {
	return typeof input === "object" && input !== null && !Array.isArray(input);
}
/**
* Checks whether a value is an `object` in the JavaScript sense (objects, arrays, functions).
*
* When to use:
* - You want to accept arrays and functions as well as objects.
*
* Behavior:
* - Pure; does not mutate input.
* - Returns `true` for arrays and functions, `false` for `null`.
*
* **Example** (Object keyword)
*
* ```ts
* import { Predicate } from "effect"
*
* console.log(Predicate.isObjectKeyword(() => 1))
* console.log(Predicate.isObjectKeyword(null))
* ```
*
* See also: {@link isObject}, {@link isObjectOrArray}
*
* @category guards
* @since 2.0.0
*/
function isObjectKeyword(input) {
	return typeof input === "object" && input !== null || isFunction(input);
}
/**
* Checks whether a value has a given property key.
*
* When to use:
* - You need to guard property access on `unknown` values.
* - You want a simple structural guard for objects.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses the `in` operator and {@link isObjectKeyword}.
* - Does not check property value types.
*
* **Example** (Guard property)
*
* ```ts
* import { Predicate } from "effect"
*
* const hasName = Predicate.hasProperty("name")
* const data: unknown = { name: "Ada" }
*
* if (hasName(data)) {
*   console.log(data.name)
* }
* ```
*
* See also: {@link isTagged}, {@link isObjectKeyword}
*
* @category guards
* @since 2.0.0
*/
const hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObjectKeyword(self) && property in self);
/**
* Checks whether a value has a `_tag` property equal to the given tag.
*
* When to use:
* - You model tagged unions with a `_tag` field.
* - You want a quick, structural guard for tagged values.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses {@link hasProperty} and strict equality on `_tag`.
*
* **Example** (Guard tagged)
*
* ```ts
* import { Predicate } from "effect"
*
* const isOk = Predicate.isTagged("Ok")
*
* console.log(isOk({ _tag: "Ok", value: 1 }))
* ```
*
* See also: {@link hasProperty}
*
* @category guards
* @since 2.0.0
*/
const isTagged = /* @__PURE__ */ dual(2, (self, tag) => hasProperty(self, "_tag") && self["_tag"] === tag);
/**
* Checks whether a value is a `Date`.
*
* When to use:
* - You need to guard dates at runtime.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `instanceof Date`.
*
* **Example** (Guard Date)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = new Date()
*
* console.log(Predicate.isDate(data))
* ```
*
* See also: {@link isRegExp}
*
* @category guards
* @since 2.0.0
*/
function isDate(input) {
	return input instanceof Date;
}
/**
* Checks whether a value is iterable.
*
* When to use:
* - You need a guard before iterating an unknown value.
*
* Behavior:
* - Pure; does not mutate input.
* - Accepts strings as iterable.
* - Uses {@link hasProperty} for `Symbol.iterator`.
*
* **Example** (Guard iterable)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = [1, 2, 3]
*
* console.log(Predicate.isIterable(data))
* ```
*
* See also: {@link isSet}, {@link isMap}
*
* @category guards
* @since 2.0.0
*/
function isIterable(input) {
	return hasProperty(input, Symbol.iterator) || isString(input);
}
/**
* Checks whether a value is a `RegExp`.
*
* When to use:
* - You need a runtime guard for regular expressions.
*
* Behavior:
* - Pure; does not mutate input.
* - Uses `instanceof RegExp`.
*
* **Example** (Guard RegExp)
*
* ```ts
* import { Predicate } from "effect"
*
* const data: unknown = /abc/
*
* console.log(Predicate.isRegExp(data))
* ```
*
* See also: {@link isDate}
*
* @category guards
* @since 3.9.0
*/
function isRegExp$1(input) {
	return input instanceof RegExp;
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Hash.js
/**
* This module provides utilities for hashing values in TypeScript.
*
* Hashing is the process of converting data into a fixed-size numeric value,
* typically used for data structures like hash tables, equality comparisons,
* and efficient data storage.
*
* @since 2.0.0
*/
/**
* The unique identifier used to identify objects that implement the Hash interface.
*
* @since 2.0.0
*/
const symbol$3 = "~effect/interfaces/Hash";
/**
* Computes a hash value for any given value.
*
* This function can hash primitives (numbers, strings, booleans, etc.) as well as
* objects, arrays, and other complex data structures. It automatically handles
* different types and provides a consistent hash value for equivalent inputs.
*
* **⚠️ CRITICAL IMMUTABILITY REQUIREMENT**: Objects being hashed must be treated as
* immutable after their first hash computation. Hash results are cached, so mutating
* an object after hashing will lead to stale cached values and broken hash-based
* operations. For mutable objects, use referential equality by implementing custom
* `Hash` interface that hashes the object reference, not its content.
*
* **FORBIDDEN**: Modifying objects after `Hash.hash()` has been called on them
* **ALLOWED**: Using immutable objects, or mutable objects with custom `Hash` interface
* that uses referential equality (hashes the object reference, not content)
*
* @example
* ```ts
* import { Hash } from "effect"
*
* // Hash primitive values
* console.log(Hash.hash(42)) // numeric hash
* console.log(Hash.hash("hello")) // string hash
* console.log(Hash.hash(true)) // boolean hash
*
* // Hash objects and arrays
* console.log(Hash.hash({ name: "John", age: 30 }))
* console.log(Hash.hash([1, 2, 3]))
* console.log(Hash.hash(new Date("2023-01-01")))
* ```
*
* @category hashing
* @since 2.0.0
*/
const hash = (self) => {
	switch (typeof self) {
		case "number": return number$2(self);
		case "bigint": return string$2(self.toString(10));
		case "boolean": return string$2(String(self));
		case "symbol": return string$2(String(self));
		case "string": return string$2(self);
		case "undefined": return string$2("undefined");
		case "function":
		case "object": if (self === null) return string$2("null");
		else if (self instanceof Date) return string$2(self.toISOString());
		else if (self instanceof RegExp) return string$2(self.toString());
		else {
			if (byReferenceInstances.has(self)) return random(self);
			if (hashCache.has(self)) return hashCache.get(self);
			const h = withVisitedTracking$1(self, () => {
				if (isHash(self)) return self[symbol$3]();
				else if (typeof self === "function") return random(self);
				else if (Array.isArray(self)) return array(self);
				else if (self instanceof Map) return hashMap(self);
				else if (self instanceof Set) return hashSet(self);
				return structure(self);
			});
			hashCache.set(self, h);
			return h;
		}
		default: throw new Error(`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`);
	}
};
/**
* Generates a random hash value for an object and caches it.
*
* This function creates a random hash value for objects that don't have their own
* hash implementation. The hash value is cached using a WeakMap, so the same object
* will always return the same hash value during its lifetime.
*
* @example
* ```ts
* import { Hash } from "effect"
*
* const obj1 = { a: 1 }
* const obj2 = { a: 1 }
*
* // Same object always returns the same hash
* console.log(Hash.random(obj1) === Hash.random(obj1)) // true
*
* // Different objects get different hashes
* console.log(Hash.random(obj1) === Hash.random(obj2)) // false
* ```
*
* @category hashing
* @since 2.0.0
*/
const random = (self) => {
	if (!randomHashCache.has(self)) randomHashCache.set(self, number$2(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
	return randomHashCache.get(self);
};
/**
* Combines two hash values into a single hash value.
*
* This function takes two hash values and combines them using a mathematical
* operation to produce a new hash value. It's useful for creating hash values
* of composite structures.
*
* @example
* ```ts
* import { Hash } from "effect" // combined hash value
*
* // Can also be used with pipe
* import { pipe } from "effect"
*
* const hash1 = Hash.hash("hello")
* const hash2 = Hash.hash("world")
*
* // Combine two hash values
* const combined = Hash.combine(hash2)(hash1)
* console.log(combined)
* const result = pipe(hash1, Hash.combine(hash2))
* ```
*
* @category hashing
* @since 2.0.0
*/
const combine$1 = /* @__PURE__ */ dual(2, (self, b) => self * 53 ^ b);
/**
* Optimizes a hash value by applying bit manipulation techniques.
*
* This function takes a hash value and applies bitwise operations to improve
* the distribution of hash values, reducing the likelihood of collisions.
*
* @example
* ```ts
* import { Hash } from "effect"
*
* const rawHash = 1234567890
* const optimizedHash = Hash.optimize(rawHash)
* console.log(optimizedHash) // optimized hash value
*
* // Often used internally by other hash functions
* const stringHash = Hash.optimize(Hash.string("hello"))
* ```
*
* @category hashing
* @since 2.0.0
*/
const optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
/**
* Checks if a value implements the Hash interface.
*
* This function determines whether a given value has the Hash symbol property,
* indicating that it can provide its own hash value implementation.
*
* @example
* ```ts
* import { Hash } from "effect"
*
* class MyHashable implements Hash.Hash {
*   [Hash.symbol]() {
*     return 42
*   }
* }
*
* const obj = new MyHashable()
* console.log(Hash.isHash(obj)) // true
* console.log(Hash.isHash({})) // false
* console.log(Hash.isHash("string")) // false
* ```
*
* @category guards
* @since 2.0.0
*/
const isHash = (u) => hasProperty(u, symbol$3);
/**
* Computes a hash value for a number.
*
* This function creates a hash value for numeric inputs, handling special cases
* like NaN, Infinity, and -Infinity with distinct hash values. It uses bitwise operations to ensure good distribution
* of hash values across different numeric inputs.
*
* @example
* ```ts
* import { Hash } from "effect"
*
* console.log(Hash.number(42)) // hash of 42
* console.log(Hash.number(3.14)) // hash of 3.14
* console.log(Hash.number(NaN)) // hash of "NaN"
* console.log(Hash.number(Infinity)) // 0 (special case)
*
* // Same numbers produce the same hash
* console.log(Hash.number(100) === Hash.number(100)) // true
* ```
*
* @category hashing
* @since 2.0.0
*/
const number$2 = (n) => {
	if (n !== n) return string$2("NaN");
	if (n === Infinity) return string$2("Infinity");
	if (n === -Infinity) return string$2("-Infinity");
	let h = n | 0;
	if (h !== n) h ^= n * 4294967295;
	while (n > 4294967295) h ^= n /= 4294967295;
	return optimize(h);
};
/**
* Computes a hash value for a string using the djb2 algorithm.
*
* This function implements a variation of the djb2 hash algorithm, which is
* known for its good distribution properties and speed. It processes each
* character of the string to produce a consistent hash value.
*
* @example
* ```ts
* import { Hash } from "effect"
*
* console.log(Hash.string("hello")) // hash of "hello"
* console.log(Hash.string("world")) // hash of "world"
* console.log(Hash.string("")) // hash of empty string
*
* // Same strings produce the same hash
* console.log(Hash.string("test") === Hash.string("test")) // true
* ```
*
* @category hashing
* @since 2.0.0
*/
const string$2 = (str) => {
	let h = 5381, i = str.length;
	while (i) h = h * 33 ^ str.charCodeAt(--i);
	return optimize(h);
};
/**
* Computes a hash value for an object using only the specified keys.
*
* This function allows you to hash an object by considering only specific keys,
* which is useful when you want to create a hash based on a subset of an object's
* properties.
*
* @example
* ```ts
* import { Hash } from "effect"
*
* const person = { name: "John", age: 30, city: "New York" }
*
* // Hash only specific keys
* const hash1 = Hash.structureKeys(person, ["name", "age"])
* const hash2 = Hash.structureKeys(person, ["name", "city"])
*
* console.log(hash1) // hash based on name and age
* console.log(hash2) // hash based on name and city
*
* // Same keys produce the same hash
* const person2 = { name: "John", age: 30, city: "Boston" }
* const hash3 = Hash.structureKeys(person2, ["name", "age"])
* console.log(hash1 === hash3) // true
* ```
*
* @category hashing
* @since 2.0.0
*/
const structureKeys = (o, keys) => {
	let h = 12289;
	for (const key of keys) h ^= combine$1(hash(key), hash(o[key]));
	return optimize(h);
};
/**
* Computes a hash value for an object using all of its enumerable keys.
*
* This function creates a hash value based on all enumerable properties of an object.
* It's a convenient way to hash an entire object structure when you want to consider
* all its properties.
*
* @example
* ```ts
* import { Hash } from "effect"
*
* const obj1 = { name: "John", age: 30 }
* const obj2 = { name: "Jane", age: 25 }
* const obj3 = { name: "John", age: 30 }
*
* console.log(Hash.structure(obj1)) // hash of obj1
* console.log(Hash.structure(obj2)) // different hash
* console.log(Hash.structure(obj3)) // same as obj1
*
* // Objects with same properties produce same hash
* console.log(Hash.structure(obj1) === Hash.structure(obj3)) // true
* ```
*
* @category hashing
* @since 2.0.0
*/
const structure = (o) => structureKeys(o, getAllObjectKeys(o));
const iterableWith = (seed, f) => (iter) => {
	let h = seed;
	for (const element of iter) h ^= f(element);
	return optimize(h);
};
/**
* Computes a hash value for an array by hashing all of its elements.
*
* This function creates a hash value based on all elements in the array.
* The order of elements matters, so arrays with the same elements in different
* orders will produce different hash values.
*
* @example
* ```ts
* import { Hash } from "effect"
*
* const arr1 = [1, 2, 3]
* const arr2 = [1, 2, 3]
* const arr3 = [3, 2, 1]
*
* console.log(Hash.array(arr1)) // hash of [1, 2, 3]
* console.log(Hash.array(arr2)) // same hash as arr1
* console.log(Hash.array(arr3)) // different hash (different order)
*
* // Arrays with same elements in same order produce same hash
* console.log(Hash.array(arr1) === Hash.array(arr2)) // true
* console.log(Hash.array(arr1) === Hash.array(arr3)) // false
* ```
*
* @category hashing
* @since 2.0.0
*/
const array = /* @__PURE__ */ iterableWith(6151, hash);
const hashMap = /* @__PURE__ */ iterableWith(/* @__PURE__ */ string$2("Map"), ([k, v]) => combine$1(hash(k), hash(v)));
const hashSet = /* @__PURE__ */ iterableWith(/* @__PURE__ */ string$2("Set"), hash);
const randomHashCache = /* @__PURE__ */ new WeakMap();
const hashCache = /* @__PURE__ */ new WeakMap();
const visitedObjects = /* @__PURE__ */ new WeakSet();
function withVisitedTracking$1(obj, fn) {
	if (visitedObjects.has(obj)) return string$2("[Circular]");
	visitedObjects.add(obj);
	const result = fn();
	visitedObjects.delete(obj);
	return result;
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Equal.js
/**
* The unique identifier used to identify objects that implement the `Equal` interface.
*
* @since 2.0.0
*/
const symbol$2 = "~effect/interfaces/Equal";
function equals$1() {
	if (arguments.length === 1) return (self) => compareBoth(self, arguments[0]);
	return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
	if (self === that) return true;
	if (self == null || that == null) return false;
	const selfType = typeof self;
	if (selfType !== typeof that) return false;
	if (selfType === "number" && self !== self && that !== that) return true;
	if (selfType !== "object" && selfType !== "function") return false;
	if (byReferenceInstances.has(self) || byReferenceInstances.has(that)) return false;
	return withCache(self, that, compareObjects);
}
/** Helper to run comparison with proper visited tracking */
function withVisitedTracking(self, that, fn) {
	const hasLeft = visitedLeft.has(self);
	const hasRight = visitedRight.has(that);
	if (hasLeft && hasRight) return true;
	if (hasLeft || hasRight) return false;
	visitedLeft.add(self);
	visitedRight.add(that);
	const result = fn();
	visitedLeft.delete(self);
	visitedRight.delete(that);
	return result;
}
const visitedLeft = /* @__PURE__ */ new WeakSet();
const visitedRight = /* @__PURE__ */ new WeakSet();
/** Helper to perform cached object comparison */
function compareObjects(self, that) {
	if (hash(self) !== hash(that)) return false;
	else if (self instanceof Date) {
		if (!(that instanceof Date)) return false;
		return self.toISOString() === that.toISOString();
	} else if (self instanceof RegExp) {
		if (!(that instanceof RegExp)) return false;
		return self.toString() === that.toString();
	}
	const selfIsEqual = isEqual(self);
	const thatIsEqual = isEqual(that);
	if (selfIsEqual !== thatIsEqual) return false;
	const bothEquals = selfIsEqual && thatIsEqual;
	if (typeof self === "function" && !bothEquals) return false;
	return withVisitedTracking(self, that, () => {
		if (bothEquals) return self[symbol$2](that);
		else if (Array.isArray(self)) {
			if (!Array.isArray(that) || self.length !== that.length) return false;
			return compareArrays(self, that);
		} else if (self instanceof Map) {
			if (!(that instanceof Map) || self.size !== that.size) return false;
			return compareMaps(self, that);
		} else if (self instanceof Set) {
			if (!(that instanceof Set) || self.size !== that.size) return false;
			return compareSets(self, that);
		}
		return compareRecords(self, that);
	});
}
function withCache(self, that, f) {
	let selfMap = equalityCache.get(self);
	if (!selfMap) {
		selfMap = /* @__PURE__ */ new WeakMap();
		equalityCache.set(self, selfMap);
	} else if (selfMap.has(that)) return selfMap.get(that);
	const result = f(self, that);
	selfMap.set(that, result);
	let thatMap = equalityCache.get(that);
	if (!thatMap) {
		thatMap = /* @__PURE__ */ new WeakMap();
		equalityCache.set(that, thatMap);
	}
	thatMap.set(self, result);
	return result;
}
const equalityCache = /* @__PURE__ */ new WeakMap();
function compareArrays(self, that) {
	for (let i = 0; i < self.length; i++) if (!compareBoth(self[i], that[i])) return false;
	return true;
}
function compareRecords(self, that) {
	const selfKeys = getAllObjectKeys(self);
	const thatKeys = getAllObjectKeys(that);
	if (selfKeys.size !== thatKeys.size) return false;
	for (const key of selfKeys) if (!thatKeys.has(key) || !compareBoth(self[key], that[key])) return false;
	return true;
}
/** @internal */
function makeCompareMap(keyEquivalence, valueEquivalence) {
	return function compareMaps(self, that) {
		for (const [selfKey, selfValue] of self) {
			let found = false;
			for (const [thatKey, thatValue] of that) if (keyEquivalence(selfKey, thatKey) && valueEquivalence(selfValue, thatValue)) {
				found = true;
				break;
			}
			if (!found) return false;
		}
		return true;
	};
}
const compareMaps = /* @__PURE__ */ makeCompareMap(compareBoth, compareBoth);
/** @internal */
function makeCompareSet(equivalence) {
	return function compareSets(self, that) {
		for (const selfValue of self) {
			let found = false;
			for (const thatValue of that) if (equivalence(selfValue, thatValue)) {
				found = true;
				break;
			}
			if (!found) return false;
		}
		return true;
	};
}
const compareSets = /* @__PURE__ */ makeCompareSet(compareBoth);
/**
* Determines if a value implements the `Equal` interface.
*
* @example
* ```ts
* import { Equal, Hash } from "effect"
* import * as assert from "node:assert"
*
* class MyClass implements Equal.Equal {
*   [Equal.symbol](that: Equal.Equal): boolean {
*     return that instanceof MyClass
*   }
*   [Hash.symbol](): number {
*     return 0
*   }
* }
*
* const instance = new MyClass()
* assert(Equal.isEqual(instance) === true)
* assert(Equal.isEqual({}) === false)
* assert(Equal.isEqual(42) === false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isEqual = (u) => hasProperty(u, symbol$2);
/**
* Creates an `Equivalence` instance using the `equals` function.
* This allows the equality logic to be used with APIs that expect an `Equivalence`.
*
* @example
* ```ts
* import { Array, Equal } from "effect"
*
* const eq = Equal.asEquivalence<number>()
* const result = Array.dedupeWith([1, 2, 2, 3, 1], eq)
* console.log(result) // [1, 2, 3]
* ```
*
* @category instances
* @since 2.0.0
*/
const asEquivalence = () => equals$1;
/**
* Marks an object to use reference equality instead of structural equality, without creating a proxy.
*
* Unlike `byReference`, this function directly modifies the object's equality behavior
* without creating a proxy wrapper. This is more performant but "unsafe" because
* it permanently changes how the object is compared.
*
* @example
* ```ts
* import { Equal } from "effect"
* import * as assert from "node:assert"
*
* const obj1 = { a: 1, b: 2 }
* const obj2 = { a: 1, b: 2 }
*
* // Mark obj1 for reference equality (modifies obj1 directly)
* const obj1ByRef = Equal.byReferenceUnsafe(obj1)
* assert(obj1ByRef === obj1) // Same object, no proxy created
* assert(Equal.equals(obj1ByRef, obj2) === false) // uses reference equality
* assert(Equal.equals(obj1ByRef, obj1ByRef) === true) // same reference
*
* // The original obj1 is now permanently marked for reference equality
* assert(Equal.equals(obj1, obj2) === false) // obj1 uses reference equality
* ```
*
* @category utility
* @since 2.0.0
*/
const byReferenceUnsafe = (obj) => {
	byReferenceInstances.add(obj);
	return obj;
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Equivalence.js
/**
* Creates a custom equivalence relation with an optimized reference equality check.
*
* When to use this:
* - When you need a custom equivalence that isn't just strict equality
* - When creating equivalences for complex types with custom comparison logic
* - When you want the performance benefit of reference equality optimization
*
* Behavior:
* - Does not mutate inputs
* - First checks reference equality (`===`) for performance; if values are identical, returns `true` without calling the function
* - Falls back to the provided equivalence function if values are not the same reference
* - The provided function must satisfy reflexive, symmetric, and transitive properties
*
* **Example** (Case-insensitive string equivalence)
*
* ```ts
* import { Equivalence } from "effect"
*
* const caseInsensitive = Equivalence.make<string>((a, b) =>
*   a.toLowerCase() === b.toLowerCase()
* )
*
* console.log(caseInsensitive("Hello", "HELLO")) // true
* console.log(caseInsensitive("foo", "bar")) // false
*
* // Same reference optimization
* const str = "test"
* console.log(caseInsensitive(str, str)) // true (fast path)
* ```
*
* **Example** (Numeric tolerance equivalence)
*
* ```ts
* import { Equivalence } from "effect"
*
* const tolerance = Equivalence.make<number>((a, b) => Math.abs(a - b) < 0.0001)
*
* console.log(tolerance(1.0, 1.0001)) // false
* console.log(tolerance(1.0, 1.00001)) // true
* ```
*
* See also: {@link strictEqual}, {@link mapInput}
*
* @category constructors
* @since 2.0.0
*/
const make$11 = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
/**
* Creates an equivalence for arrays where all elements are compared using the same equivalence.
*
* When to use this:
* - When comparing arrays with homogeneous element types
* - When all elements should use the same equivalence logic
* - When working with variable-length arrays (not fixed tuples)
* - Prefer over `Tuple` when you have arrays of the same type
*
* Behavior:
* - Does not mutate inputs
* - Requires arrays to have the same length; different lengths are never equivalent
* - Compares elements positionally (index 0 with index 0, etc.)
* - Returns `true` only if all corresponding elements are equivalent
* - Empty arrays are considered equivalent
* - The result is also an equivalence (satisfies reflexive, symmetric, transitive properties)
*
* **Example** (Number array equivalence)
*
* ```ts
* import { Equivalence } from "effect"
*
* const numberArrayEq = Equivalence.Array(Equivalence.strictEqual<number>())
*
* console.log(numberArrayEq([1, 2, 3], [1, 2, 3])) // true
* console.log(numberArrayEq([1, 2, 3], [1, 2, 4])) // false
* console.log(numberArrayEq([1, 2], [1, 2, 3])) // false (different length)
* ```
*
* **Example** (Case-insensitive string array)
*
* ```ts
* import { Equivalence } from "effect"
*
* const caseInsensitive = Equivalence.mapInput(
*   Equivalence.strictEqual<string>(),
*   (s: string) => s.toLowerCase()
* )
* const stringArrayEq = Equivalence.Array(caseInsensitive)
*
* console.log(stringArrayEq(["Hello", "World"], ["HELLO", "WORLD"])) // true
* console.log(stringArrayEq(["Hello"], ["Hi"])) // false
* console.log(stringArrayEq([], [])) // true (empty arrays)
* ```
*
* See also: {@link Tuple}, {@link Record}
*
* @category combinators
* @since 4.0.0
*/
function Array$4(item) {
	return make$11((self, that) => {
		if (self.length !== that.length) return false;
		for (let i = 0; i < self.length; i++) if (!item(self[i], that[i])) return false;
		return true;
	});
}
/**
* Creates an equivalence for objects by comparing their properties using provided equivalences.
*
* When to use this:
* - When comparing objects with known, fixed property names
* - When you need different equivalence logic for different properties
* - When working with struct/interface types with specific fields
* - Prefer over `Record` when you have a fixed set of known properties
*
* Behavior:
* - Does not mutate inputs
* - Compares only the properties specified in the struct definition
* - Properties not in the struct are ignored
* - Returns `true` only if all specified properties are equivalent according to their equivalences
* - Supports both string and symbol keys (via `Reflect.ownKeys`)
* - The result is also an equivalence (satisfies reflexive, symmetric, transitive properties)
*
* **Example** (Struct with different equivalences per field)
*
* ```ts
* import { Equivalence } from "effect"
*
* interface Person {
*   name: string
*   age: number
*   email: string
* }
*
* const caseInsensitive = Equivalence.mapInput(
*   Equivalence.strictEqual<string>(),
*   (s: string) => s.toLowerCase()
* )
*
* const personEq = Equivalence.Struct({
*   name: caseInsensitive,
*   age: Equivalence.strictEqual<number>(),
*   email: caseInsensitive
* })
*
* const person1 = { name: "Alice", age: 30, email: "alice@example.com" }
* const person2 = { name: "ALICE", age: 30, email: "ALICE@EXAMPLE.COM" }
* const person3 = { name: "Alice", age: 31, email: "alice@example.com" }
*
* console.log(personEq(person1, person2)) // true (case-insensitive match)
* console.log(personEq(person1, person3)) // false (different age)
* ```
*
* **Example** (Partial equivalence for specific fields)
*
* ```ts
* import { Equivalence } from "effect"
*
* const nameAgeEq = Equivalence.Struct({
*   name: Equivalence.strictEqual<string>(),
*   age: Equivalence.strictEqual<number>()
* })
*
* // Only compares name and age, ignores other properties
* const obj1 = { name: "Alice", age: 30, extra: "ignored" }
* const obj2 = { name: "Alice", age: 30, extra: "different" }
* console.log(nameAgeEq(obj1, obj2)) // true
* ```
*
* See also: {@link Record}, {@link mapInput}, {@link combine}
*
* @category combinators
* @since 4.0.0
*/
function Struct$2(fields) {
	const keys = Reflect.ownKeys(fields);
	return make$11((self, that) => {
		for (const key of keys) if (!fields[key](self[key], that[key])) return false;
		return true;
	});
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Redactable.js
/**
* @since 4.0.0
*/
/**
* Symbol used to identify objects that implement redaction capabilities.
*
* @since 4.0.0
* @category symbol
*/
const symbolRedactable = /* @__PURE__ */ Symbol.for("~effect/Inspectable/redactable");
/**
* Checks if a value implements the `Redactable` interface.
*
* This function determines whether a given value has redaction capabilities,
* meaning it can provide alternative representations based on context.
*
* @param u - The value to check
*
* @example
* ```ts
* import { Redactable } from "effect"
*
* class RedactableSecret {
*   [Redactable.symbolRedactable]() {
*     return "[REDACTED]"
*   }
* }
*
* const secret = new RedactableSecret()
* const normal = { value: 42 }
*
* console.log(Redactable.isRedactable(secret)) // true
* console.log(Redactable.isRedactable(normal)) // false
* console.log(Redactable.isRedactable("string")) // false
* ```
*
* @since 4.0.0
* @category redactable
*/
const isRedactable = (u) => hasProperty(u, symbolRedactable);
/**
* Applies redaction to a value if it implements the Redactable interface.
*
* This function checks if the value is redactable and applies the redaction
* transformation if a current fiber context is available. Otherwise, it returns
* the value unchanged.
*
* @param u - The value to potentially redact
*
* @example
* ```ts
* import { Redactable } from "effect"
*
* class CreditCard {
*   constructor(private number: string) {}
*
*   [Redactable.symbolRedactable]() {
*     return {
*       number: this.number.slice(0, 4) + "****"
*     }
*   }
* }
*
* const card = new CreditCard("1234567890123456")
* console.log(Redactable.redact(card)) // { number: "1234****" }
*
* // Non-redactable values are returned unchanged
* console.log(Redactable.redact("normal string")) // "normal string"
* console.log(Redactable.redact({ id: 123 })) // { id: 123 }
* ```
*
* @since 4.0.0
*/
function redact(u) {
	if (isRedactable(u)) return getRedacted(u);
	return u;
}
/**
* @since 4.0.0
*/
function getRedacted(redactable) {
	return redactable[symbolRedactable](globalThis[currentFiberTypeId]?.services ?? emptyServiceMap$1);
}
/** @internal */
const currentFiberTypeId = "~effect/Fiber/currentFiber";
const emptyServiceMap$1 = {
	"~effect/ServiceMap": {},
	mapUnsafe: /* @__PURE__ */ new Map(),
	pipe() {
		return pipeArguments(this, arguments);
	}
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Formatter.js
/**
* @since 4.0.0
*/
/**
* Converts any JavaScript value into a human-readable string.
*
* For objects that don't have a `toString` method, it applies redaction to
* protect sensitive information.
*
* Unlike `JSON.stringify`, this formatter:
* - Handles circular references (printed as `"[Circular]"`).
* - Supports additional types like `BigInt`, `Symbol`, `Set`, `Map`, `Date`, `RegExp`, and
*   objects with custom `toString` methods.
* - Includes constructor names for class instances (e.g. `MyClass({"a":1})`).
* - Does not guarantee valid JSON output — the result is intended for debugging and inspection.
*
* Formatting rules:
* - Primitives are stringified naturally (`null`, `undefined`, `123`, `"abc"`, `true`).
* - Strings are JSON-quoted.
* - Arrays and objects with a single element/property are formatted inline.
* - Larger arrays/objects are pretty-printed with optional indentation.
* - Circular references are replaced with the literal `"[Circular]"`.
*
* **Options**:
* - `space`: Indentation used when pretty-printing:
*   - If a number, that many spaces will be used.
*   - If a string, the string is used as the indentation unit (e.g. `"\t"`).
*   - If `0`, empty string, or `undefined`, output is compact (no indentation).
*   Defaults to `0`.
* - `ignoreToString`: If `true`, the `toString` method is not called on the value.
*   Defaults to `false`.
*
* @since 4.0.0
*/
function format$2(input, options) {
	const space = options?.space ?? 0;
	const seen = /* @__PURE__ */ new WeakSet();
	const gap = !space ? "" : typeof space === "number" ? " ".repeat(space) : space;
	const ind = (d) => gap.repeat(d);
	const wrap = (v, body) => {
		const ctor = v?.constructor;
		return ctor && ctor !== Object.prototype.constructor && ctor.name ? `${ctor.name}(${body})` : body;
	};
	const ownKeys = (o) => {
		try {
			return Reflect.ownKeys(o);
		} catch {
			return ["[ownKeys threw]"];
		}
	};
	function recur(v, d = 0) {
		if (Array.isArray(v)) {
			if (seen.has(v)) return CIRCULAR;
			seen.add(v);
			if (!gap || v.length <= 1) return `[${v.map((x) => recur(x, d)).join(",")}]`;
			const inner = v.map((x) => recur(x, d + 1)).join(",\n" + ind(d + 1));
			return `[\n${ind(d + 1)}${inner}\n${ind(d)}]`;
		}
		if (v instanceof Date) return formatDate(v);
		if (!options?.ignoreToString && hasProperty(v, "toString") && typeof v["toString"] === "function" && v["toString"] !== Object.prototype.toString && v["toString"] !== Array.prototype.toString) {
			const s = safeToString(v);
			if (v instanceof Error && v.cause) return `${s} (cause: ${recur(v.cause, d)})`;
			return s;
		}
		if (typeof v === "string") return JSON.stringify(v);
		if (typeof v === "number" || v == null || typeof v === "boolean" || typeof v === "symbol") return String(v);
		if (typeof v === "bigint") return String(v) + "n";
		if (isObject(v)) {
			if (seen.has(v)) return CIRCULAR;
			seen.add(v);
			if (symbolRedactable in v) return format$2(getRedacted(v));
			if (Symbol.iterator in v) return `${v.constructor.name}(${recur(Array.from(v), d)})`;
			const keys = ownKeys(v);
			if (!gap || keys.length <= 1) return wrap(v, `{${keys.map((k) => `${formatPropertyKey(k)}:${recur(v[k], d)}`).join(",")}}`);
			return wrap(v, `{\n${keys.map((k) => `${ind(d + 1)}${formatPropertyKey(k)}: ${recur(v[k], d + 1)}`).join(",\n")}\n${ind(d)}}`);
		}
		return String(v);
	}
	return recur(input, 0);
}
const CIRCULAR = "[Circular]";
/**
* Fast path for formatting property keys.
*
* @internal
*/
function formatPropertyKey(name) {
	return typeof name === "string" ? JSON.stringify(name) : String(name);
}
/**
* Fast path for formatting property paths.
*
* @internal
*/
function formatPath(path) {
	return path.map((key) => `[${formatPropertyKey(key)}]`).join("");
}
/**
* Fast path for formatting dates.
*
* @internal
*/
function formatDate(date) {
	try {
		return date.toISOString();
	} catch {
		return "Invalid Date";
	}
}
function safeToString(input) {
	try {
		const s = input.toString();
		return typeof s === "string" ? s : String(s);
	} catch {
		return "[toString threw]";
	}
}
/**
* Safely stringifies objects that may contain circular references.
*
* This function performs JSON.stringify with circular reference detection and handling.
* It also applies redaction to sensitive values and provides a safe fallback for
* any objects that can't be serialized normally.
*
* **Options**:
* - `space`: Indentation used when pretty-printing:
*   - If a number, that many spaces will be used.
*   - If a string, the string is used as the indentation unit (e.g. `"\t"`).
*   - If `0`, empty string, or `undefined`, output is compact (no indentation).
*   Defaults to `0`.
*
* @example
* ```ts
* import { formatJson } from "effect/Formatter"
*
* // Normal object
* const simple = { name: "Alice", age: 30 }
* console.log(formatJson(simple))
* // {"name":"Alice","age":30}
*
* // Object with circular reference
* const circular: any = { name: "test" }
* circular.self = circular
* console.log(formatJson(circular))
* // {"name":"test"} (circular reference omitted)
*
* // With formatting
* console.log(formatJson(simple, { space: 2 }))
* // {
* //   "name": "Alice",
* //   "age": 30
* // }
* ```
*
* @since 4.0.0
*/
function formatJson(input, options) {
	let cache = [];
	const out = JSON.stringify(input, (_key, value) => typeof value === "object" && value !== null ? cache.includes(value) ? void 0 : cache.push(value) && redact(value) : value, options?.space);
	cache = void 0;
	return out;
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Inspectable.js
/**
* This module provides utilities for making values inspectable and debuggable in TypeScript.
*
* The Inspectable interface provides a standard way to implement custom string representations
* for objects, making them easier to debug and inspect. It includes support for JSON
* serialization, Node.js inspection, and safe circular reference handling.
*
* The module also includes redaction capabilities for sensitive data, allowing objects
* to provide different representations based on the current execution context.
*
* @example
* ```ts
* import { Inspectable } from "effect"
* import { format } from "effect/Formatter"
*
* class User extends Inspectable.Class {
*   constructor(
*     public readonly name: string,
*     public readonly email: string
*   ) {
*     super()
*   }
*
*   toJSON() {
*     return {
*       _tag: "User",
*       name: this.name,
*       email: this.email
*     }
*   }
* }
*
* const user = new User("Alice", "alice@example.com")
* console.log(user.toString()) // Pretty printed JSON
* console.log(format(user)) // Same as toString()
* ```
*
* @since 2.0.0
*/
/**
* Symbol used by Node.js for custom object inspection.
*
* This symbol is recognized by Node.js's `util.inspect()` function and the REPL
* for custom object representation. When an object has a method with this symbol,
* it will be called to determine how the object should be displayed.
*
* @example
* ```ts
* import { Inspectable } from "effect"
*
* class CustomObject {
*   constructor(private value: string) {}
*
*   [Inspectable.NodeInspectSymbol]() {
*     return `CustomObject(${this.value})`
*   }
* }
*
* const obj = new CustomObject("hello")
* console.log(obj) // Displays: CustomObject(hello)
* ```
*
* @since 2.0.0
* @category symbols
*/
const NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
/**
* Safely converts a value to a JSON-serializable representation, useful for
* implementing the `toJSON` method of the {@link Inspectable} interface.
*
* This function attempts to extract JSON data from objects that implement the
* `toJSON` method, recursively processes arrays, and handles errors gracefully.
* For objects that don't have a `toJSON` method, it applies redaction to
* protect sensitive information.
*
* @since 2.0.0
*/
const toJson = (input) => {
	try {
		if (hasProperty(input, "toJSON") && isFunction(input["toJSON"]) && input["toJSON"].length === 0) return input.toJSON();
		else if (Array.isArray(input)) return input.map(toJson);
	} catch {
		return "[toJSON threw]";
	}
	return redact(input);
};
/**
* @since 2.0.0
*/
const toStringUnknown = (u, whitespace = 2) => {
	if (typeof u === "string") return u;
	try {
		return typeof u === "object" ? stringifyCircular(u, whitespace) : String(u);
	} catch {
		return String(u);
	}
};
/**
* @since 2.0.0
*/
const stringifyCircular = (obj, whitespace) => {
	let cache = [];
	const retVal = JSON.stringify(obj, (_key, value) => typeof value === "object" && value !== null ? cache.includes(value) ? void 0 : cache.push(value) && redact(value) : value, whitespace);
	cache = void 0;
	return retVal;
};
/**
* A base prototype object that implements the {@link Inspectable} interface.
*
* This object provides default implementations for the {@link Inspectable} methods.
* It can be used as a prototype for objects that want to be inspectable,
* or as a mixin to add inspection capabilities to existing objects.
*
* @example
* ```ts
* import { Inspectable } from "effect"
*
* // Use as prototype
* const myObject = Object.create(Inspectable.BaseProto)
* myObject.name = "example"
* myObject.value = 42
*
* console.log(myObject.toString()) // Pretty printed representation
*
* // Or extend in a constructor
* function MyClass(this: any, name: string) {
*   this.name = name
* }
* MyClass.prototype = Object.create(Inspectable.BaseProto)
* MyClass.prototype.constructor = MyClass
* ```
*
* @since 2.0.0
*/
const BaseProto = {
	toJSON() {
		return toJson(this);
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	toString() {
		return format$2(this.toJSON());
	}
};
/**
* Abstract base class that implements the Inspectable interface.
*
* This class provides a convenient way to create inspectable objects by extending it.
* Subclasses only need to implement the `toJSON()` method, and they automatically
* get proper `toString()` and Node.js inspection support.
*
* @example
* ```ts
* import { Inspectable } from "effect"
*
* class User extends Inspectable.Class {
*   constructor(
*     public readonly id: number,
*     public readonly name: string,
*     public readonly email: string
*   ) {
*     super()
*   }
*
*   toJSON() {
*     return {
*       _tag: "User",
*       id: this.id,
*       name: this.name,
*       email: this.email
*     }
*   }
* }
*
* const user = new User(1, "Alice", "alice@example.com")
* console.log(user.toString()) // Pretty printed JSON with _tag, id, name, email
* console.log(user) // In Node.js, shows the same formatted output
* ```
*
* @since 2.0.0
* @category classes
*/
var Class = class {
	/**
	* Node.js custom inspection method.
	*
	* @since 2.0.0
	*/
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	/**
	* Returns a formatted string representation of this object.
	*
	* @since 2.0.0
	*/
	toString() {
		return format$2(this.toJSON());
	}
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Utils.js
/**
* @since 2.0.0
*/
/**
* @since 2.0.0
*/
const GenKindTypeId = "~effect/Utils/GenKind";
var GenKindImpl = class {
	value;
	constructor(value) {
		this.value = value;
	}
	get _F() {
		return identity;
	}
	get _R() {
		return (_) => _;
	}
	get _O() {
		return (_) => _;
	}
	get _E() {
		return (_) => _;
	}
	[GenKindTypeId] = GenKindTypeId;
	[Symbol.iterator]() {
		return new SingleShotGen(this);
	}
};
/**
* @category constructors
* @since 2.0.0
*/
var SingleShotGen = class SingleShotGen {
	called = false;
	self;
	constructor(self) {
		this.self = self;
	}
	/**
	* @since 2.0.0
	*/
	next(a) {
		return this.called ? {
			value: a,
			done: true
		} : (this.called = true, {
			value: this.self,
			done: false
		});
	}
	/**
	* @since 2.0.0
	*/
	[Symbol.iterator]() {
		return new SingleShotGen(this.self);
	}
};
const InternalTypeId = "~effect/Effect/internal";
const standard = { [InternalTypeId]: (body) => {
	return body();
} };
const forced = { [InternalTypeId]: (body) => {
	try {
		return body();
	} finally {}
} };
const isNotOptimizedAway = /* @__PURE__ */ standard[InternalTypeId](() => (/* @__PURE__ */ new Error()).stack)?.includes(InternalTypeId) === true;
/**
* @since 3.2.2
* @status experimental
* @category tracing
*/
const internalCall = isNotOptimizedAway ? standard[InternalTypeId] : forced[InternalTypeId];
const genConstructor = function* () {}.constructor;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/core.js
/** @internal */
const EffectTypeId = `~effect/Effect`;
/** @internal */
const ExitTypeId = `~effect/Exit`;
const effectVariance = {
	_A: identity,
	_E: identity,
	_R: identity
};
/** @internal */
const identifier = `${EffectTypeId}/identifier`;
/** @internal */
const args = `${EffectTypeId}/args`;
/** @internal */
const evaluate = `${EffectTypeId}/evaluate`;
/** @internal */
const contA = `${EffectTypeId}/successCont`;
/** @internal */
const contE = `${EffectTypeId}/failureCont`;
/** @internal */
const contAll = `${EffectTypeId}/ensureCont`;
/** @internal */
const Yield = /* @__PURE__ */ Symbol.for("effect/Effect/Yield");
/** @internal */
const PipeInspectableProto = {
	pipe() {
		return pipeArguments(this, arguments);
	},
	toJSON() {
		return { ...this };
	},
	toString() {
		return format$2(this, { ignoreToString: true });
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
/** @internal */
const StructuralProto = {
	[symbol$3]() {
		return structureKeys(this, Object.keys(this));
	},
	[symbol$2](that) {
		const selfKeys = Object.keys(this);
		const thatKeys = Object.keys(that);
		if (selfKeys.length !== thatKeys.length) return false;
		for (let i = 0; i < selfKeys.length; i++) if (selfKeys[i] !== thatKeys[i] && !equals$1(this[selfKeys[i]], that[selfKeys[i]])) return false;
		return true;
	}
};
/** @internal */
const YieldableProto = { [Symbol.iterator]() {
	return new SingleShotGen(this);
} };
/** @internal */
const EffectProto = {
	[EffectTypeId]: effectVariance,
	...PipeInspectableProto,
	[Symbol.iterator]() {
		return new SingleShotGen(this);
	},
	asEffect() {
		return this;
	},
	toJSON() {
		return {
			_id: "Effect",
			op: this[identifier],
			...args in this ? { args: this[args] } : void 0
		};
	}
};
/** @internal */
const isEffect$1 = (u) => hasProperty(u, EffectTypeId);
/** @internal */
const isExit$1 = (u) => hasProperty(u, ExitTypeId);
/** @internal */
const CauseTypeId = "~effect/Cause";
/** @internal */
const CauseReasonTypeId = "~effect/Cause/Reason";
/** @internal */
const isCause$1 = (self) => hasProperty(self, CauseTypeId);
/** @internal */
const isCauseReason = (self) => hasProperty(self, CauseReasonTypeId);
/** @internal */
var CauseImpl = class {
	[CauseTypeId];
	reasons;
	constructor(failures) {
		this[CauseTypeId] = CauseTypeId;
		this.reasons = failures;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toJSON() {
		return {
			_id: "Cause",
			failures: this.reasons.map((f) => f.toJSON())
		};
	}
	toString() {
		return `Cause(${format$2(this.reasons)})`;
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	[symbol$2](that) {
		return isCause$1(that) && this.reasons.length === that.reasons.length && this.reasons.every((e, i) => equals$1(e, that.reasons[i]));
	}
	[symbol$3]() {
		return array(this.reasons);
	}
};
const annotationsMap = /* @__PURE__ */ new WeakMap();
/** @internal */
var ReasonBase = class {
	[CauseReasonTypeId];
	annotations;
	_tag;
	constructor(_tag, annotations, originalError) {
		this[CauseReasonTypeId] = CauseReasonTypeId;
		this._tag = _tag;
		if (annotations !== constEmptyAnnotations && typeof originalError === "object" && originalError !== null && annotations.size > 0) {
			const prevAnnotations = annotationsMap.get(originalError);
			if (prevAnnotations) annotations = new Map([...prevAnnotations, ...annotations]);
			annotationsMap.set(originalError, annotations);
		}
		this.annotations = annotations;
	}
	annotate(annotations, options) {
		if (annotations.mapUnsafe.size === 0) return this;
		const newAnnotations = new Map(this.annotations);
		annotations.mapUnsafe.forEach((value, key) => {
			if (options?.overwrite !== true && newAnnotations.has(key)) return;
			newAnnotations.set(key, value);
		});
		const self = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
		self.annotations = newAnnotations;
		return self;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toString() {
		return format$2(this);
	}
	[NodeInspectSymbol]() {
		return this.toString();
	}
};
/** @internal */
const constEmptyAnnotations = /* @__PURE__ */ new Map();
/** @internal */
var Fail = class extends ReasonBase {
	error;
	constructor(error, annotations = constEmptyAnnotations) {
		super("Fail", annotations, error);
		this.error = error;
	}
	toString() {
		return `Fail(${format$2(this.error)})`;
	}
	toJSON() {
		return {
			_tag: "Fail",
			error: this.error
		};
	}
	[symbol$2](that) {
		return isFailReason$1(that) && equals$1(this.error, that.error) && equals$1(this.annotations, that.annotations);
	}
	[symbol$3]() {
		return combine$1(string$2(this._tag))(combine$1(hash(this.error))(hash(this.annotations)));
	}
};
/** @internal */
const causeFromReasons = (reasons) => new CauseImpl(reasons);
/** @internal */
const causeEmpty = /* @__PURE__ */ new CauseImpl([]);
/** @internal */
const causeFail = (error) => new CauseImpl([new Fail(error)]);
/** @internal */
var Die = class extends ReasonBase {
	defect;
	constructor(defect, annotations = constEmptyAnnotations) {
		super("Die", annotations, defect);
		this.defect = defect;
	}
	toString() {
		return `Die(${format$2(this.defect)})`;
	}
	toJSON() {
		return {
			_tag: "Die",
			defect: this.defect
		};
	}
	[symbol$2](that) {
		return isDieReason$1(that) && equals$1(this.defect, that.defect) && equals$1(this.annotations, that.annotations);
	}
	[symbol$3]() {
		return combine$1(string$2(this._tag))(combine$1(hash(this.defect))(hash(this.annotations)));
	}
};
/** @internal */
const causeDie = (defect) => new CauseImpl([new Die(defect)]);
/** @internal */
const causeAnnotate = /* @__PURE__ */ dual((args) => isCause$1(args[0]), (self, annotations, options) => {
	if (annotations.mapUnsafe.size === 0) return self;
	return new CauseImpl(self.reasons.map((f) => f.annotate(annotations, options)));
});
/** @internal */
const isFailReason$1 = (self) => self._tag === "Fail";
/** @internal */
const isDieReason$1 = (self) => self._tag === "Die";
/** @internal */
const isInterruptReason$1 = (self) => self._tag === "Interrupt";
function defaultEvaluate(_fiber) {
	return exitDie(`Effect.evaluate: Not implemented`);
}
/** @internal */
const makePrimitiveProto = (options) => ({
	...EffectProto,
	[identifier]: options.op,
	[evaluate]: options[evaluate] ?? defaultEvaluate,
	[contA]: options[contA],
	[contE]: options[contE],
	[contAll]: options[contAll]
});
/** @internal */
const makePrimitive = (options) => {
	const Proto = makePrimitiveProto(options);
	return function() {
		const self = Object.create(Proto);
		self[args] = options.single === false ? arguments : arguments[0];
		return self;
	};
};
/** @internal */
const makeExit = (options) => {
	const Proto = {
		...makePrimitiveProto(options),
		[ExitTypeId]: ExitTypeId,
		_tag: options.op,
		get [options.prop]() {
			return this[args];
		},
		toString() {
			return `${options.op}(${format$2(this[args])})`;
		},
		toJSON() {
			return {
				_id: "Exit",
				_tag: options.op,
				[options.prop]: this[args]
			};
		},
		[symbol$2](that) {
			return isExit$1(that) && that._tag === this._tag && equals$1(this[args], that[args]);
		},
		[symbol$3]() {
			return combine$1(string$2(options.op), hash(this[args]));
		}
	};
	return function(value) {
		const self = Object.create(Proto);
		self[args] = value;
		return self;
	};
};
/** @internal */
const exitSucceed = /* @__PURE__ */ makeExit({
	op: "Success",
	prop: "value",
	[evaluate](fiber) {
		const cont = fiber.getCont(contA);
		return cont ? cont[contA](this[args], fiber, this) : fiber.yieldWith(this);
	}
});
/** @internal */
const StackTraceKey = { key: "effect/Cause/StackTrace" };
/** @internal */
const InterruptorStackTrace = { key: "effect/Cause/InterruptorStackTrace" };
/** @internal */
const exitFailCause = /* @__PURE__ */ makeExit({
	op: "Failure",
	prop: "cause",
	[evaluate](fiber) {
		let cause = this[args];
		let annotated = false;
		if (fiber.currentStackFrame) {
			cause = causeAnnotate(cause, { mapUnsafe: new Map([[StackTraceKey.key, fiber.currentStackFrame]]) });
			annotated = true;
		}
		let cont = fiber.getCont(contE);
		while (fiber.interruptible && fiber._interruptedCause && cont) cont = fiber.getCont(contE);
		return cont ? cont[contE](cause, fiber, annotated ? void 0 : this) : fiber.yieldWith(annotated ? this : exitFailCause(cause));
	}
});
/** @internal */
const exitFail = (e) => exitFailCause(causeFail(e));
/** @internal */
const exitDie = (defect) => exitFailCause(causeDie(defect));
/** @internal */
const withFiber$1 = /* @__PURE__ */ makePrimitive({
	op: "WithFiber",
	[evaluate](fiber) {
		return this[args](fiber);
	}
});
/** @internal */
const YieldableError = /* @__PURE__ */ function() {
	class YieldableError extends globalThis.Error {
		asEffect() {
			return exitFail(this);
		}
	}
	Object.assign(YieldableError.prototype, YieldableProto);
	return YieldableError;
}();
/** @internal */
const Error$3 = /* @__PURE__ */ function() {
	const plainArgsSymbol = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
	return class Base extends YieldableError {
		constructor(args) {
			super(args?.message, args?.cause ? { cause: args.cause } : void 0);
			if (args) {
				Object.assign(this, args);
				Object.defineProperty(this, plainArgsSymbol, {
					value: args,
					enumerable: false
				});
			}
		}
		toJSON() {
			return {
				...this[plainArgsSymbol],
				...this
			};
		}
	};
}();
/** @internal */
const TaggedError$1 = (tag) => {
	class Base extends Error$3 {
		_tag = tag;
	}
	Base.prototype.name = tag;
	return Base;
};
/** @internal */
const NoSuchElementErrorTypeId$1 = "~effect/Cause/NoSuchElementError";
/** @internal */
const isNoSuchElementError$1 = (u) => hasProperty(u, NoSuchElementErrorTypeId$1);
/** @internal */
var NoSuchElementError$1 = class extends TaggedError$1("NoSuchElementError") {
	[NoSuchElementErrorTypeId$1] = NoSuchElementErrorTypeId$1;
	constructor(message) {
		super({ message });
	}
};
/** @internal */
const DoneTypeId$1 = "~effect/Cause/Done";
/** @internal */
const isDone$1 = (u) => hasProperty(u, DoneTypeId$1);
const DoneVoid = {
	[DoneTypeId$1]: DoneTypeId$1,
	_tag: "Done",
	value: void 0
};
/** @internal */
const Done$1 = (value) => {
	if (value === void 0) return DoneVoid;
	return {
		[DoneTypeId$1]: DoneTypeId$1,
		_tag: "Done",
		value
	};
};
const doneVoid = /* @__PURE__ */ exitFail(DoneVoid);
/** @internal */
const done$2 = (value) => {
	if (value === void 0) return doneVoid;
	return exitFail(Done$1(value));
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/option.js
/**
* @since 2.0.0
*/
const TypeId$15 = "~effect/data/Option";
const CommonProto$1 = {
	[TypeId$15]: { _A: (_) => _ },
	...PipeInspectableProto,
	...YieldableProto
};
const SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$1), {
	_tag: "Some",
	_op: "Some",
	[symbol$2](that) {
		return isOption$1(that) && isSome$1(that) && equals$1(this.value, that.value);
	},
	[symbol$3]() {
		return combine$1(hash(this._tag))(hash(this.value));
	},
	toString() {
		return `some(${format$2(this.value)})`;
	},
	toJSON() {
		return {
			_id: "Option",
			_tag: this._tag,
			value: toJson(this.value)
		};
	},
	asEffect() {
		return exitSucceed(this.value);
	}
});
const NoneHash = /* @__PURE__ */ hash("None");
const NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$1), {
	_tag: "None",
	_op: "None",
	[symbol$2](that) {
		return isOption$1(that) && isNone$1(that);
	},
	[symbol$3]() {
		return NoneHash;
	},
	toString() {
		return `none()`;
	},
	toJSON() {
		return {
			_id: "Option",
			_tag: this._tag
		};
	},
	asEffect() {
		return exitFail(new NoSuchElementError$1());
	}
});
/** @internal */
const isOption$1 = (input) => hasProperty(input, TypeId$15);
/** @internal */
const isNone$1 = (fa) => fa._tag === "None";
/** @internal */
const isSome$1 = (fa) => fa._tag === "Some";
/** @internal */
const none$1 = /* @__PURE__ */ Object.create(NoneProto);
/** @internal */
const some$1 = (value) => {
	const a = Object.create(SomeProto);
	a.value = value;
	return a;
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/result.js
const TypeId$14 = "~effect/data/Result";
const CommonProto = {
	[TypeId$14]: {
		_A: (_) => _,
		_E: (_) => _
	},
	...PipeInspectableProto,
	...YieldableProto
};
const SuccessProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
	_tag: "Success",
	_op: "Success",
	[symbol$2](that) {
		return isResult$1(that) && isSuccess$4(that) && equals$1(this.success, that.success);
	},
	[symbol$3]() {
		return combine$1(hash(this._tag))(hash(this.success));
	},
	toString() {
		return `success(${format$2(this.success)})`;
	},
	toJSON() {
		return {
			_id: "Result",
			_tag: this._tag,
			value: toJson(this.success)
		};
	},
	asEffect() {
		return exitSucceed(this.success);
	}
});
const FailureProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
	_tag: "Failure",
	_op: "Failure",
	[symbol$2](that) {
		return isResult$1(that) && isFailure$4(that) && equals$1(this.failure, that.failure);
	},
	[symbol$3]() {
		return combine$1(hash(this._tag))(hash(this.failure));
	},
	toString() {
		return `failure(${format$2(this.failure)})`;
	},
	toJSON() {
		return {
			_id: "Result",
			_tag: this._tag,
			failure: toJson(this.failure)
		};
	},
	asEffect() {
		return exitFail(this.failure);
	}
});
/** @internal */
const isResult$1 = (input) => hasProperty(input, TypeId$14);
/** @internal */
const isFailure$4 = (result) => result._tag === "Failure";
/** @internal */
const isSuccess$4 = (result) => result._tag === "Success";
/** @internal */
const fail$5 = (failure) => {
	const a = Object.create(FailureProto);
	a.failure = failure;
	return a;
};
/** @internal */
const succeed$4 = (success) => {
	const a = Object.create(SuccessProto);
	a.success = success;
	return a;
};
/** @internal */
const getFailure$2 = (self) => isSuccess$4(self) ? none$1 : some$1(self.failure);
/** @internal */
const getSuccess$3 = (self) => isFailure$4(self) ? none$1 : some$1(self.success);
/** @internal */
const fromOption$4 = /* @__PURE__ */ dual(2, (self, onNone) => isNone$1(self) ? fail$5(onNone()) : succeed$4(self.value));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Order.js
/**
* This module provides the `Order` type class for defining total orderings on types.
* An `Order` is a comparison function that returns `-1` (less than), `0` (equal), or `1` (greater than).
*
* Mental model:
* - An `Order<A>` is a pure function `(a: A, b: A) => Ordering` that compares two values
* - The result `-1` means the first value is less than the second
* - The result `0` means the values are equal according to this ordering
* - The result `1` means the first value is greater than the second
* - Orders must satisfy total ordering laws: totality (either `x <= y` or `y <= x`), antisymmetry (if `x <= y` and `y <= x` then `x == y`), and transitivity (if `x <= y` and `y <= z` then `x <= z`)
* - Orders can be composed using {@link combine} and {@link combineAll} to create multi-criteria comparisons
* - Orders can be transformed using {@link mapInput} to compare values by extracting a comparable property
* - Built-in orders exist for common types: {@link Number}, {@link String}, {@link Boolean}, {@link BigInt}, {@link Date}
*
* Common tasks:
* - Creating custom orders → {@link make}
* - Using built-in orders → {@link Number}, {@link String}, {@link Boolean}, {@link BigInt}, {@link Date}
* - Combining multiple orders → {@link combine}, {@link combineAll}
* - Transforming orders → {@link mapInput}
* - Comparing values → {@link isLessThan}, {@link isGreaterThan}, {@link isLessThanOrEqualTo}, {@link isGreaterThanOrEqualTo}
* - Finding min/max → {@link min}, {@link max}
* - Clamping values → {@link clamp}, {@link isBetween}
* - Ordering collections → {@link Array}, {@link Tuple}, {@link Struct}
*
* Gotchas:
* - `Order.Number` treats all `NaN` values as equal and less than any other number
* - `Order.make` uses reference equality (`===`) as a shortcut: if `self === that`, it returns `0` without calling the comparison function
* - `Order.Array` compares arrays element-by-element, then by length if all elements are equal; `Order.all` only compares elements up to the shorter array's length
* - `Order.Tuple` requires a fixed-length tuple with matching order types; `Order.Array` works with variable-length arrays
* - `Order.min` and `Order.max` return the first argument when values are equal
*
* Quickstart:
*
* **Example** (Basic Usage)
*
* ```ts
* import { Order } from "effect"
*
* const result = Order.Number(5, 10)
* console.log(result) // -1 (5 is less than 10)
*
* const isLessThan = Order.isLessThan(Order.Number)(5, 10)
* console.log(isLessThan) // true
* ```
*
* See also:
* - {@link Ordering} - The result type of comparisons
* - {@link Reducer} - For combining orders in collections
*
* @since 2.0.0
*/
/**
* Creates a new `Order` instance from a comparison function.
*
* When to use this:
* - When creating a custom order for a type that doesn't have a built-in order
* - When you need fine-grained control over comparison logic
* - When implementing orders for complex types
*
* Behavior:
* - Pure function: does not mutate inputs
* - Uses reference equality (`===`) as a shortcut: if `self === that`, returns `0` without calling the comparison function
* - The comparison function should return `-1`, `0`, or `1` based on the comparison result
* - The returned order satisfies total ordering laws if the comparison function does
*
* **Example** (Creating an Order)
*
* ```ts
* import { Order } from "effect"
*
* const byAge = Order.make<{ name: string; age: number }>((self, that) => {
*   if (self.age < that.age) return -1
*   if (self.age > that.age) return 1
*   return 0
* })
*
* console.log(byAge({ name: "Alice", age: 30 }, { name: "Bob", age: 25 })) // 1
* console.log(byAge({ name: "Alice", age: 25 }, { name: "Bob", age: 30 })) // -1
* ```
*
* See also:
* - {@link mapInput} - Transform an order by mapping the input type
* - {@link combine} - Combine multiple orders
*
* @category constructors
* @since 2.0.0
*/
function make$10(compare) {
	return (self, that) => self === that ? 0 : compare(self, that);
}
/**
* An `Order` instance for numbers that compares them numerically.
*
* When to use this:
* - When comparing numbers for sorting or searching
* - As a base for creating orders on types containing numbers
* - When implementing numeric comparisons in data structures
*
* Behavior:
* - Pure function: does not mutate inputs
* - `0` is considered equal to `-0`
* - All `NaN` values are considered equal to each other
* - Any `NaN` is considered less than any non-NaN number
* - Uses standard numeric comparison for all other values
*
* **Example** (Number Ordering)
*
* ```ts
* import { Order } from "effect"
*
* console.log(Order.Number(1, 1)) // 0
* console.log(Order.Number(1, 2)) // -1
* console.log(Order.Number(2, 1)) // 1
*
* console.log(Order.Number(0, -0)) // 0
* console.log(Order.Number(NaN, 1)) // -1
* ```
*
* See also:
* - {@link mapInput} - Use this order to compare objects by a number property
* - {@link BigInt} - For bigint comparisons
*
* @category instances
* @since 4.0.0
*/
const Number$4 = /* @__PURE__ */ make$10((self, that) => {
	if (globalThis.Number.isNaN(self) && globalThis.Number.isNaN(that)) return 0;
	if (globalThis.Number.isNaN(self)) return -1;
	if (globalThis.Number.isNaN(that)) return 1;
	return self < that ? -1 : 1;
});
/**
* An `Order` instance for bigints that compares them numerically.
*
* When to use this:
* - When comparing bigint values for sorting or searching
* - As a base for creating orders on types containing bigints
* - When working with large integers that exceed number precision
*
* Behavior:
* - Pure function: does not mutate inputs
* - Uses standard numeric comparison for bigint values
* - Handles arbitrarily large integers
*
* **Example** (BigInt Ordering)
*
* ```ts
* import { Order } from "effect"
*
* console.log(Order.BigInt(1n, 2n)) // -1
* console.log(Order.BigInt(2n, 1n)) // 1
* console.log(Order.BigInt(1n, 1n)) // 0
* ```
*
* See also:
* - {@link Number} - For regular number comparisons
* - {@link mapInput} - Use this order to compare objects by a bigint property
*
* @category instances
* @since 4.0.0
*/
const BigInt$3 = /* @__PURE__ */ make$10((self, that) => self < that ? -1 : 1);
/**
* Transforms an `Order` on type `A` into an `Order` on type `B` by providing a function that
* maps values of type `B` to values of type `A`.
*
* When to use this:
* - When you have an order for a property type and want to compare objects by that property
* - When extracting a comparable value from a complex type
* - When creating orders for types that contain comparable values
*
* Behavior:
* - Pure function: does not mutate inputs
* - Applies the mapping function to both values before comparison
* - The mapping function should be pure and not have side effects
* - Preserves the ordering properties of the original order
*
* **Example** (Mapping Input)
*
* ```ts
* import { Order } from "effect"
*
* const byLength = Order.mapInput(Order.Number, (s: string) => s.length)
*
* console.log(byLength("a", "bb")) // -1
* console.log(byLength("bb", "a")) // 1
* console.log(byLength("aa", "bb")) // 0
* ```
*
* See also:
* - {@link combine} - Combine mapped orders for multi-criteria comparison
* - {@link Struct} - Create orders for structs with multiple fields
*
* @category mapping
* @since 2.0.0
*/
const mapInput = /* @__PURE__ */ dual(2, (self, f) => make$10((b1, b2) => self(f(b1), f(b2))));
/**
* An `Order` instance for `Date` objects that compares them chronologically by their timestamp.
*
* When to use this:
* - When comparing dates for sorting or searching
* - As a base for creating orders on types containing dates
* - When implementing time-based comparisons
*
* Behavior:
* - Pure function: does not mutate inputs
* - Compares dates by their underlying timestamp (milliseconds since epoch)
* - Earlier dates are less than later dates
* - Invalid dates are compared as if they were valid (uses `getTime()` result)
*
* **Example** (Date Ordering)
*
* ```ts
* import { Order } from "effect"
*
* const date1 = new Date("2023-01-01")
* const date2 = new Date("2023-01-02")
*
* console.log(Order.Date(date1, date2)) // -1
* console.log(Order.Date(date2, date1)) // 1
* console.log(Order.Date(date1, date1)) // 0
* ```
*
* See also:
* - {@link mapInput} - Use this order to compare objects by a date property
*
* @category instances
* @since 2.0.0
*/
const Date$2 = /* @__PURE__ */ mapInput(Number$4, (date) => date.getTime());
/**
* Creates an `Order` for arrays by applying the given `Order` to each element, then comparing by length if all elements are equal.
*
* When to use this:
* - When comparing arrays of the same element type
* - When you want shorter arrays to be considered less than longer arrays
* - When sorting collections of arrays
*
* Behavior:
* - Pure function: does not mutate inputs
* - Compares arrays element-by-element using the provided order
* - Stops at the first non-zero comparison result
* - If all elements are equal, shorter arrays are less than longer arrays
* - Returns `0` only if arrays have the same length and all elements are equal
*
* **Example** (Array Element Ordering)
*
* ```ts
* import { Order } from "effect"
*
* const arrayOrder = Order.Array(Order.Number)
*
* console.log(arrayOrder([1, 2], [1, 3])) // -1
* console.log(arrayOrder([1, 2], [1, 2, 3])) // -1 (shorter array is less)
* console.log(arrayOrder([1, 2, 3], [1, 2])) // 1 (longer array is greater)
* console.log(arrayOrder([1, 2], [1, 2])) // 0
* ```
*
* See also:
* - {@link Tuple} - Type-safe tuple ordering
*
* @category combinators
* @since 4.0.0
*/
function Array$3(O) {
	return make$10((self, that) => {
		const aLen = self.length;
		const bLen = that.length;
		const len = Math.min(aLen, bLen);
		for (let i = 0; i < len; i++) {
			const o = O(self[i], that[i]);
			if (o !== 0) return o;
		}
		return Number$4(aLen, bLen);
	});
}
/**
* Creates an `Order` for structs by applying the given `Order`s to each property in sequence.
*
* When to use this:
* - When comparing objects with multiple properties
* - When you need multi-field comparison for structs
* - When creating orders for complex data types
*
* Behavior:
* - Pure function: does not mutate inputs
* - Compares structs field-by-field in the order of keys in the fields object
* - Stops at the first non-zero comparison result
* - Returns `0` only if all fields are equal
* - Field order matters: earlier fields take precedence
*
* **Example** (Struct Ordering)
*
* ```ts
* import { Order } from "effect"
*
* const personOrder = Order.Struct({
*   name: Order.String,
*   age: Order.Number
* })
*
* const person1 = { name: "Alice", age: 30 }
* const person2 = { name: "Bob", age: 25 }
* const person3 = { name: "Alice", age: 25 }
*
* console.log(personOrder(person1, person2)) // -1 (Alice < Bob)
* console.log(personOrder(person1, person3)) // 1 (same name, 30 > 25)
* console.log(personOrder(person1, person1)) // 0
* ```
*
* See also:
* - {@link combine} - Combine orders manually
* - {@link mapInput} - Extract and compare by a single property
*
* @category combinators
* @since 4.0.0
*/
function Struct$1(fields) {
	const keys = Object.keys(fields);
	return make$10((self, that) => {
		for (const key of keys) {
			const o = fields[key](self[key], that[key]);
			if (o !== 0) return o;
		}
		return 0;
	});
}
/**
* Tests whether one value is strictly less than another according to the given order.
*
* When to use this:
* - When you need a boolean predicate instead of an ordering result
* - When checking if a value is less than another in conditional logic
* - When implementing range checks or comparisons
*
* Behavior:
* - Pure function: does not mutate inputs
* - Returns `true` if the order returns `-1` (first value is less than second)
* - Returns `false` for equal or greater values
* - Supports curried and uncurried call styles
*
* **Example** (Less Than)
*
* ```ts
* import { Order } from "effect"
*
* const isLessThanNumber = Order.isLessThan(Order.Number)
*
* console.log(isLessThanNumber(1, 2)) // true
* console.log(isLessThanNumber(2, 1)) // false
* console.log(isLessThanNumber(1, 1)) // false
* ```
*
* See also:
* - {@link isLessThanOrEqualTo} - Non-strict less than or equal
* - {@link isGreaterThan} - Strict greater than
*
* @category predicates
* @since 2.0.0
*/
const isLessThan$3 = (O) => dual(2, (self, that) => O(self, that) === -1);
/**
* Tests whether one value is strictly greater than another according to the given order.
*
* When to use this:
* - When you need a boolean predicate instead of an ordering result
* - When checking if a value is greater than another in conditional logic
* - When implementing range checks or comparisons
*
* Behavior:
* - Pure function: does not mutate inputs
* - Returns `true` if the order returns `1` (first value is greater than second)
* - Returns `false` for equal or lesser values
* - Supports curried and uncurried call styles
*
* **Example** (Greater Than)
*
* ```ts
* import { Order } from "effect"
*
* const isGreaterThanNumber = Order.isGreaterThan(Order.Number)
*
* console.log(isGreaterThanNumber(2, 1)) // true
* console.log(isGreaterThanNumber(1, 2)) // false
* console.log(isGreaterThanNumber(1, 1)) // false
* ```
*
* See also:
* - {@link isGreaterThanOrEqualTo} - Non-strict greater than or equal
* - {@link isLessThan} - Strict less than
*
* @category predicates
* @since 2.0.0
*/
const isGreaterThan$3 = (O) => dual(2, (self, that) => O(self, that) === 1);
/**
* Tests whether one value is less than or equal to another according to the given order.
*
* When to use this:
* - When you need a boolean predicate for non-strict comparison
* - When checking if a value is within a range (inclusive lower bound)
* - When implementing inclusive comparisons
*
* Behavior:
* - Pure function: does not mutate inputs
* - Returns `true` if the order returns `-1` or `0` (less than or equal)
* - Returns `false` only if the order returns `1` (greater than)
* - Supports curried and uncurried call styles
*
* **Example** (Less Than Or Equal)
*
* ```ts
* import { Order } from "effect"
*
* const isLessThanOrEqualToNumber = Order.isLessThanOrEqualTo(Order.Number)
*
* console.log(isLessThanOrEqualToNumber(1, 2)) // true
* console.log(isLessThanOrEqualToNumber(1, 1)) // true
* console.log(isLessThanOrEqualToNumber(2, 1)) // false
* ```
*
* See also:
* - {@link isLessThan} - Strict less than
* - {@link isGreaterThan} - Strict greater than
*
* @category predicates
* @since 2.0.0
*/
const isLessThanOrEqualTo$3 = (O) => dual(2, (self, that) => O(self, that) !== 1);
/**
* Tests whether one value is greater than or equal to another according to the given order.
*
* When to use this:
* - When you need a boolean predicate for non-strict comparison
* - When checking if a value is within a range (inclusive upper bound)
* - When implementing inclusive comparisons
*
* Behavior:
* - Pure function: does not mutate inputs
* - Returns `true` if the order returns `1` or `0` (greater than or equal)
* - Returns `false` only if the order returns `-1` (less than)
* - Supports curried and uncurried call styles
*
* **Example** (Greater Than Or Equal)
*
* ```ts
* import { Order } from "effect"
*
* const isGreaterThanOrEqualToNumber = Order.isGreaterThanOrEqualTo(Order.Number)
*
* console.log(isGreaterThanOrEqualToNumber(2, 1)) // true
* console.log(isGreaterThanOrEqualToNumber(1, 1)) // true
* console.log(isGreaterThanOrEqualToNumber(1, 2)) // false
* ```
*
* See also:
* - {@link isGreaterThan} - Strict greater than
* - {@link isLessThanOrEqualTo} - Less than or equal
*
* @category predicates
* @since 2.0.0
*/
const isGreaterThanOrEqualTo$3 = (O) => dual(2, (self, that) => O(self, that) !== -1);
/**
* Returns the minimum of two values according to the given order. If they are equal, returns the first argument.
*
* When to use this:
* - When you need to find the smaller of two values
* - When implementing min/max operations
* - When selecting values based on ordering
*
* Behavior:
* - Pure function: does not mutate inputs
* - Returns the value that compares as less than or equal to the other
* - If values are equal, returns the first argument
* - Supports curried and uncurried call styles
*
* **Example** (Minimum Value)
*
* ```ts
* import { Order } from "effect"
*
* const minNumber = Order.min(Order.Number)
*
* console.log(minNumber(1, 2)) // 1
* console.log(minNumber(2, 1)) // 1
* console.log(minNumber(1, 1)) // 1
* ```
*
* See also:
* - {@link max} - Maximum of two values
* - {@link clamp} - Clamp a value between min and max
*
* @category comparisons
* @since 2.0.0
*/
const min$2 = (O) => dual(2, (self, that) => self === that || O(self, that) < 1 ? self : that);
/**
* Returns the maximum of two values according to the given order. If they are equal, returns the first argument.
*
* When to use this:
* - When you need to find the larger of two values
* - When implementing min/max operations
* - When selecting values based on ordering
*
* Behavior:
* - Pure function: does not mutate inputs
* - Returns the value that compares as greater than or equal to the other
* - If values are equal, returns the first argument
* - Supports curried and uncurried call styles
*
* **Example** (Maximum Value)
*
* ```ts
* import { Order } from "effect"
*
* const maxNumber = Order.max(Order.Number)
*
* console.log(maxNumber(1, 2)) // 2
* console.log(maxNumber(2, 1)) // 2
* console.log(maxNumber(1, 1)) // 1
* ```
*
* See also:
* - {@link min} - Minimum of two values
* - {@link clamp} - Clamp a value between min and max
*
* @category comparisons
* @since 2.0.0
*/
const max$2 = (O) => dual(2, (self, that) => self === that || O(self, that) > -1 ? self : that);
/**
* Clamps a value between a minimum and a maximum according to the given order.
*
* When to use this:
* - When you need to restrict a value to a specific range
* - When implementing bounds checking and normalization
* - When ensuring values stay within valid ranges
*
* Behavior:
* - Pure function: does not mutate inputs
* - Returns the value if it's between minimum and maximum (inclusive)
* - Returns minimum if the value is less than minimum
* - Returns maximum if the value is greater than maximum
* - Supports curried and uncurried call styles
* - Requires that minimum <= maximum according to the order
*
* **Example** (Clamping Values)
*
* ```ts
* import { Order } from "effect"
*
* const clamp = Order.clamp(Order.Number)({ minimum: 1, maximum: 5 })
*
* console.log(clamp(3)) // 3
* console.log(clamp(0)) // 1
* console.log(clamp(6)) // 5
* ```
*
* See also:
* - {@link min} - Minimum of two values
* - {@link max} - Maximum of two values
* - {@link isBetween} - Check if a value is within a range
*
* @category comparisons
* @since 2.0.0
*/
const clamp$2 = (O) => dual(2, (self, options) => min$2(O)(options.maximum, max$2(O)(options.minimum, self)));
/**
* Tests whether a value is between a minimum and a maximum (inclusive) according to the given order.
*
* When to use this:
* - When validating that a value is within a valid range
* - When implementing range checks for bounds validation
* - When filtering or selecting values within a range
*
* Behavior:
* - Pure function: does not mutate inputs
* - Returns `true` if the value is greater than or equal to minimum and less than or equal to maximum
* - Returns `false` if the value is outside the range
* - Supports curried and uncurried call styles
* - Both bounds are inclusive
*
* **Example** (Checking Range)
*
* ```ts
* import { Order } from "effect"
*
* const betweenNumber = Order.isBetween(Order.Number)
*
* console.log(betweenNumber(5, { minimum: 1, maximum: 10 })) // true
* console.log(betweenNumber(1, { minimum: 1, maximum: 10 })) // true
* console.log(betweenNumber(10, { minimum: 1, maximum: 10 })) // true
* console.log(betweenNumber(0, { minimum: 1, maximum: 10 })) // false
* console.log(betweenNumber(11, { minimum: 1, maximum: 10 })) // false
* ```
*
* See also:
* - {@link clamp} - Clamp a value to a range
* - {@link isLessThanOrEqualTo} - Less than or equal check
* - {@link isGreaterThanOrEqualTo} - Greater than or equal check
*
* @category predicates
* @since 4.0.0
*/
const isBetween$1 = (O) => dual(2, (self, options) => !isLessThan$3(O)(self, options.minimum) && !isGreaterThan$3(O)(self, options.maximum));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Option.js
/**
* Creates an `Option` representing the absence of a value.
*
* **When to use**
*
* - Representing a missing or uninitialized value
* - Returning "no result" from a function
*
* **Behavior**
*
* - Returns `Option<never>`, which is a subtype of `Option<A>` for any `A`
* - Always returns the same singleton instance
*
* **Example** (Creating an empty Option)
*
* ```ts
* import { Option } from "effect"
*
* //      ┌─── Option<never>
* //      ▼
* const noValue = Option.none()
*
* console.log(noValue)
* // Output: { _id: 'Option', _tag: 'None' }
* ```
*
* @see {@link some} for the opposite operation.
*
* @category Constructors
* @since 2.0.0
*/
const none = () => none$1;
/**
* Wraps the given value into an `Option` to represent its presence.
*
* **When to use**
*
* - Wrapping a known-present value as `Option`
* - Returning a successful result from a partial function
*
* **Behavior**
*
* - Always returns `Some<A>`
* - Does not filter `null` or `undefined`; use {@link fromNullishOr} for that
*
* **Example** (Wrapping a value)
*
* ```ts
* import { Option } from "effect"
*
* //      ┌─── Option<number>
* //      ▼
* const value = Option.some(1)
*
* console.log(value)
* // Output: { _id: 'Option', _tag: 'Some', value: 1 }
* ```
*
* @see {@link none} for the opposite operation.
*
* @category Constructors
* @since 2.0.0
*/
const some = some$1;
/**
* Determines whether the given value is an `Option`.
*
* **When to use**
*
* - Validating unknown values at runtime boundaries
* - Type-narrowing in union types
*
* **Behavior**
*
* - Returns `true` for both `Some` and `None` instances
* - Acts as a type guard, narrowing the input to `Option<unknown>`
*
* **Example** (Checking if a value is an Option)
*
* ```ts
* import { Option } from "effect"
*
* console.log(Option.isOption(Option.some(1)))
* // Output: true
*
* console.log(Option.isOption(Option.none()))
* // Output: true
*
* console.log(Option.isOption({}))
* // Output: false
* ```
*
* @see {@link isNone} to check for `None` specifically
* @see {@link isSome} to check for `Some` specifically
*
* @category Guards
* @since 2.0.0
*/
const isOption = isOption$1;
/**
* Checks whether an `Option` is `None` (absent).
*
* **When to use**
*
* - Branching on absence before accessing `.value`
*
* **Behavior**
*
* - Acts as a type guard, narrowing to `None<A>`
*
* **Example** (Checking for None)
*
* ```ts
* import { Option } from "effect"
*
* console.log(Option.isNone(Option.some(1)))
* // Output: false
*
* console.log(Option.isNone(Option.none()))
* // Output: true
* ```
*
* @see {@link isSome} for the opposite check.
*
* @category Guards
* @since 2.0.0
*/
const isNone = isNone$1;
/**
* Checks whether an `Option` contains a value (`Some`).
*
* **When to use**
*
* - Branching on presence before accessing `.value`
*
* **Behavior**
*
* - Acts as a type guard, narrowing to `Some<A>`
*
* **Example** (Checking for Some)
*
* ```ts
* import { Option } from "effect"
*
* console.log(Option.isSome(Option.some(1)))
* // Output: true
*
* console.log(Option.isSome(Option.none()))
* // Output: false
* ```
*
* @see {@link isNone} for the opposite check.
*
* @category Guards
* @since 2.0.0
*/
const isSome = isSome$1;
/**
* Converts a `Result` into an `Option`, keeping only the success value.
*
* **When to use**
*
* - Discarding the error channel when you only care about success
*
* **Behavior**
*
* - `Ok` → `Some` with the success value
* - `Err` → `None` (error is discarded)
*
* **Example** (Extracting the success side)
*
* ```ts
* import { Option, Result } from "effect"
*
* console.log(Option.getSuccess(Result.succeed("ok")))
* // Output: { _id: 'Option', _tag: 'Some', value: 'ok' }
*
* console.log(Option.getSuccess(Result.fail("err")))
* // Output: { _id: 'Option', _tag: 'None' }
* ```
*
* @see {@link getFailure} for the opposite operation.
*
* @category Conversions
* @since 2.0.0
*/
const getSuccess$2 = getSuccess$3;
/**
* Converts a `Result` into an `Option`, keeping only the error value.
*
* **When to use**
*
* - Extracting the error when you don't need the success channel
*
* **Behavior**
*
* - `Err` → `Some` with the error value
* - `Ok` → `None` (success value is discarded)
*
* **Example** (Extracting the failure side)
*
* ```ts
* import { Option, Result } from "effect"
*
* console.log(Option.getFailure(Result.succeed("ok")))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(Option.getFailure(Result.fail("err")))
* // Output: { _id: 'Option', _tag: 'Some', value: 'err' }
* ```
*
* @see {@link getSuccess} for the opposite operation.
*
* @category Conversions
* @since 2.0.0
*/
const getFailure$1 = getFailure$2;
/**
* Transforms the value inside a `Some` using the provided function, leaving
* `None` unchanged.
*
* **When to use**
*
* - Applying a pure transformation to an optional value
* - Chaining transformations in a pipeline
*
* **Behavior**
*
* - `Some` → applies `f` and wraps the result in a new `Some`
* - `None` → returns `None` unchanged
* - Does not mutate the input
*
* **Example** (Mapping over an Option)
*
* ```ts
* import { Option } from "effect"
*
* console.log(Option.map(Option.some(2), (n) => n * 2))
* // Output: { _id: 'Option', _tag: 'Some', value: 4 }
*
* console.log(Option.map(Option.none(), (n: number) => n * 2))
* // Output: { _id: 'Option', _tag: 'None' }
* ```
*
* @see {@link flatMap} when `f` returns an `Option`
* @see {@link as} to replace the value with a constant
*
* @category Mapping
* @since 2.0.0
*/
const map$5 = /* @__PURE__ */ dual(2, (self, f) => isNone(self) ? none() : some(f(self.value)));
/**
* Applies a function that returns an `Option` to the value of a `Some`,
* flattening the result. Returns `None` if the input is `None`.
*
* **When to use**
*
* - Chaining computations that each may fail (return `None`)
* - Sequencing dependent optional operations
*
* **Behavior**
*
* - `Some` → applies `f` to the value and returns its `Option` result
* - `None` → returns `None` without calling `f`
* - Equivalent to `map` followed by {@link flatten}
*
* **Example** (Chaining optional lookups)
*
* ```ts
* import { Option } from "effect"
*
* interface User {
*   readonly name: string
*   readonly address: Option.Option<{ readonly street: Option.Option<string> }>
* }
*
* const user: User = {
*   name: "John",
*   address: Option.some({ street: Option.some("123 Main St") })
* }
*
* const street = user.address.pipe(
*   Option.flatMap((addr) => addr.street)
* )
*
* console.log(street)
* // Output: { _id: 'Option', _tag: 'Some', value: '123 Main St' }
* ```
*
* @see {@link map} when `f` returns a plain value
* @see {@link andThen} for a more flexible variant
* @see {@link flatten} to unwrap a nested `Option<Option<A>>`
*
* @category Sequencing
* @since 2.0.0
*/
const flatMap$2 = /* @__PURE__ */ dual(2, (self, f) => isNone(self) ? none() : f(self.value));
/**
* Converts an `Option` into an `Array`.
*
* **When to use**
*
* - Interfacing with array-based APIs
* - Spreading optional values into collections
*
* **Behavior**
*
* - `Some` → single-element array `[value]`
* - `None` → empty array `[]`
*
* **Example** (Converting to an array)
*
* ```ts
* import { Option } from "effect"
*
* console.log(Option.toArray(Option.some(1)))
* // Output: [1]
*
* console.log(Option.toArray(Option.none()))
* // Output: []
* ```
*
* @see {@link fromIterable} for the inverse direction
*
* @category Conversions
* @since 2.0.0
*/
const toArray = (self) => isNone(self) ? [] : [self.value];
/**
* Alias of {@link flatMap}. Applies a function returning `Option` to the value
* inside a `Some`, flattening the result.
*
* **Example** (Filtering and transforming)
*
* ```ts
* import { Option } from "effect"
*
* console.log(Option.filterMap(
*   Option.some(2),
*   (n) => (n % 2 === 0 ? Option.some(`Even: ${n}`) : Option.none())
* ))
* // Output: { _id: 'Option', _tag: 'Some', value: 'Even: 2' }
* ```
*
* @see {@link flatMap} (canonical)
* @see {@link filter} for predicate-based filtering
*
* @category Filtering
* @since 2.0.0
*/
const filterMap = flatMap$2;
/**
* Filters an `Option` using a predicate. Returns `None` if the predicate is
* not satisfied or the input is `None`.
*
* **When to use**
*
* - Discarding values that don't meet a condition
* - Narrowing the type via a refinement predicate
*
* **Behavior**
*
* - `None` → `None`
* - `Some` where `predicate(value)` is `true` → `Some(value)`
* - `Some` where `predicate(value)` is `false` → `None`
* - Supports refinements for type narrowing
*
* **Example** (Filtering with a predicate)
*
* ```ts
* import { Option } from "effect"
*
* const removeEmpty = (input: Option.Option<string>) =>
*   Option.filter(input, (value) => value !== "")
*
* console.log(removeEmpty(Option.some("hello")))
* // Output: { _id: 'Option', _tag: 'Some', value: 'hello' }
*
* console.log(removeEmpty(Option.some("")))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(removeEmpty(Option.none()))
* // Output: { _id: 'Option', _tag: 'None' }
* ```
*
* @see {@link filterMap} to transform and filter simultaneously
* @see {@link exists} to test without filtering
*
* @category Filtering
* @since 2.0.0
*/
const filter$3 = /* @__PURE__ */ dual(2, (self, predicate) => filterMap(self, (b) => predicate(b) ? some$1(b) : none$1));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Result.js
/**
* Creates a `Result` holding a `Success` value.
*
* - Use when you have a value and want to lift it into the `Result` type
* - The error type `E` defaults to `never`
* - Does not mutate input; allocates a new `Success` wrapper
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Either.right`
*
* **Example** (Wrapping a value)
*
* ```ts
* import { Result } from "effect"
*
* const result = Result.succeed(42)
*
* console.log(Result.isSuccess(result))
* // Output: true
* ```
*
* @see {@link fail} to create a Failure
* @see {@link void} for a pre-built `Success<void>`
*
* @category Constructors
* @since 4.0.0
*/
const succeed$3 = succeed$4;
/**
* Creates a `Result` holding a `Failure` value.
*
* - Use when you want to represent a failed computation
* - The success type `A` defaults to `never`
* - Does not mutate input; allocates a new `Failure` wrapper
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Either.left`
*
* **Example** (Creating a failure)
*
* ```ts
* import { Result } from "effect"
*
* const result = Result.fail("Something went wrong")
*
* console.log(Result.isFailure(result))
* // Output: true
* ```
*
* @see {@link succeed} to create a Success
* @see {@link mapError} to transform the error
*
* @category Constructors
* @since 4.0.0
*/
const fail$4 = fail$5;
/**
* Converts an `Option<A>` into a `Result<A, E>`.
*
* - `Some<A>` becomes `Success<A>`
* - `None` becomes `Failure<E>` using the provided function
* - Supports both data-first and data-last (piped) usage
*
* **Example** (Converting an Option to a Result)
*
* ```ts
* import { Option, Result } from "effect"
*
* const some = Result.fromOption(Option.some(1), () => "missing")
* console.log(some)
* // Output: { _tag: "Success", success: 1, ... }
*
* const none = Result.fromOption(Option.none(), () => "missing")
* console.log(none)
* // Output: { _tag: "Failure", failure: "missing", ... }
* ```
*
* @see {@link getSuccess} / {@link getFailure} to convert back to Option
* @see {@link fromNullishOr} to convert from nullable values
*
* @category Constructors
* @since 4.0.0
*/
const fromOption$3 = fromOption$4;
/**
* Tests whether a value is a `Result` (either `Success` or `Failure`).
*
* - Use to validate unknown input before operating on it as a `Result`
* - Returns `true` for both `Success` and `Failure` variants
* - Acts as a TypeScript type guard, narrowing to `Result<unknown, unknown>`
*
* **Example** (Checking if a value is a Result)
*
* ```ts
* import { Result } from "effect"
*
* console.log(Result.isResult(Result.succeed(1)))
* // Output: true
*
* console.log(Result.isResult({ value: 1 }))
* // Output: false
* ```
*
* @see {@link isSuccess} / {@link isFailure} to narrow to a specific variant
*
* @category Type Guards
* @since 4.0.0
*/
const isResult = isResult$1;
/**
* Checks whether a `Result` is a `Failure`.
*
* - Acts as a TypeScript type guard, narrowing to `Failure<A, E>`
* - After narrowing, you can access `.failure` to read the error value
*
* **Example** (Narrowing to Failure)
*
* ```ts
* import { Result } from "effect"
*
* const result = Result.fail("oops")
*
* if (Result.isFailure(result)) {
*   console.log(result.failure)
*   // Output: "oops"
* }
* ```
*
* @see {@link isSuccess} for the opposite check
* @see {@link isResult} to check if a value is any Result
*
* @category Type Guards
* @since 4.0.0
*/
const isFailure$3 = isFailure$4;
/**
* Checks whether a `Result` is a `Success`.
*
* - Acts as a TypeScript type guard, narrowing to `Success<A, E>`
* - After narrowing, you can access `.success` to read the value
*
* **Example** (Narrowing to Success)
*
* ```ts
* import { Result } from "effect"
*
* const result = Result.succeed(42)
*
* if (Result.isSuccess(result)) {
*   console.log(result.success)
*   // Output: 42
* }
* ```
*
* @see {@link isFailure} for the opposite check
* @see {@link isResult} to check if a value is any Result
*
* @category Type Guards
* @since 4.0.0
*/
const isSuccess$3 = isSuccess$4;
/**
* Extracts the success value as an `Option`, discarding the failure.
*
* - `Success<A>` becomes `Some<A>`
* - `Failure<E>` becomes `None`
* - Use when you only care about the success case and want to discard error info
*
* **Example** (Extracting the success as an Option)
*
* ```ts
* import { Option, Result } from "effect"
*
* console.log(Result.getSuccess(Result.succeed("ok")))
* // Output: { _tag: "Some", value: "ok" }
*
* console.log(Result.getSuccess(Result.fail("err")))
* // Output: { _tag: "None" }
* ```
*
* @see {@link getFailure} to extract the error instead
* @see {@link fromOption} for the reverse conversion
*
* @category Getters
* @since 4.0.0
*/
const getSuccess$1 = getSuccess$3;
/**
* Extracts the failure value as an `Option`, discarding the success.
*
* - `Failure<E>` becomes `Some<E>`
* - `Success<A>` becomes `None`
* - Use when you only care about the error case
*
* **Example** (Extracting the failure as an Option)
*
* ```ts
* import { Option, Result } from "effect"
*
* console.log(Result.getFailure(Result.succeed("ok")))
* // Output: { _tag: "None" }
*
* console.log(Result.getFailure(Result.fail("err")))
* // Output: { _tag: "Some", value: "err" }
* ```
*
* @see {@link getSuccess} to extract the success instead
* @see {@link fromOption} for the reverse conversion
*
* @category Getters
* @since 4.0.0
*/
const getFailure = getFailure$2;
/**
* Transforms the failure channel of a `Result`, leaving the success channel unchanged.
*
* - If the result is a `Failure`, applies `f` to the error and returns a new `Failure`
* - If the result is a `Success`, returns it as-is
* - Does not mutate the input
*
* **Example** (Adding context to an error)
*
* ```ts
* import { pipe, Result } from "effect"
*
* const result = pipe(
*   Result.fail("not found"),
*   Result.mapError((e) => `Error: ${e}`)
* )
* console.log(result)
* // Output: { _tag: "Failure", failure: "Error: not found", ... }
* ```
*
* @see {@link map} to transform only the success value
* @see {@link mapBoth} to transform both channels
*
* @category Mapping
* @since 4.0.0
*/
const mapError$3 = /* @__PURE__ */ dual(2, (self, f) => isFailure$3(self) ? fail$4(f(self.failure)) : succeed$3(self.success));
/**
* Folds a `Result` into a single value by applying one of two functions.
*
* - Applies `onSuccess` if the result is a `Success`
* - Applies `onFailure` if the result is a `Failure`
* - Both branches must return the same type (or a common supertype)
* - Use when you need to "exit" the `Result` type and produce a plain value
*
* **Example** (Folding to a string)
*
* ```ts
* import { pipe, Result } from "effect"
*
* const format = Result.match({
*   onSuccess: (n: number) => `Got ${n}`,
*   onFailure: (e: string) => `Err: ${e}`
* })
*
* console.log(format(Result.succeed(42)))
* // Output: "Got 42"
*
* console.log(format(Result.fail("timeout")))
* // Output: "Err: timeout"
* ```
*
* @see {@link merge} to extract `A | E` without mapping
* @see {@link getOrElse} to unwrap only the success with a fallback
*
* @category Pattern Matching
* @since 4.0.0
*/
const match$6 = /* @__PURE__ */ dual(2, (self, { onFailure, onSuccess }) => isFailure$3(self) ? onFailure(self.failure) : onSuccess(self.success));
/**
* A pre-built `Result<Option<never>>` that succeeds with `None`.
*
* - Equivalent to `Result.succeed(Option.none())` but avoids an extra allocation
* - Useful with {@link transposeOption} patterns
*
* **Example** (Using succeedNone)
*
* ```ts
* import { Result } from "effect"
*
* console.log(Result.isSuccess(Result.succeedNone))
* // Output: true
* ```
*
* @see {@link succeedSome} for the `Some` counterpart
*
* @category Constructors
* @since 4.0.0
*/
const succeedNone$2 = /* @__PURE__ */ succeed$3(none$1);

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Filter.js
/**
* Applies a filter, predicate, or refinement to an input and returns a boxed
* result. Extra arguments are forwarded to the function.
*
* @since 4.0.0
* @category Apply
*/
const apply = (filter, input, ...args) => {
	const result = filter(input, ...args);
	if (result === true) return succeed$3(input);
	if (result === false) return fail$4(input);
	return result;
};
/**
* Creates a Filter from a predicate or refinement function.
*
* This is a convenient way to create filters from boolean-returning functions.
* When the predicate returns true, the input value is passed through unchanged.
* When it returns false, the `fail` type is returned.
*
* @example
* ```ts
* import { Filter, Result } from "effect"
*
* // Create filter from predicate
* const positiveNumbers = Filter.fromPredicate((n: number) => n > 0)
* const nonEmptyStrings = Filter.fromPredicate((s: string) => s.length > 0)
*
* // Type refinement
* const isString = Filter.fromPredicate((x: unknown): x is string =>
*   typeof x === "string"
* )
* ```
*
* @since 4.0.0
* @category Constructors
*/
const fromPredicate = (predicate) => (input) => predicate(input) ? succeed$3(input) : fail$4(input);
/**
* A predefined filter that only passes through string values.
*
* @example
* ```ts
* import { Filter, Result } from "effect"
*
* console.log(Filter.string("hello")) // Result.succeed("hello")
* console.log(Filter.string(42)) // fail
* ```
*
* @since 4.0.0
* @category Constructors
*/
const string$1 = /* @__PURE__ */ fromPredicate(isString);
/**
* A predefined filter that only passes through number values.
*
* @example
* ```ts
* import { Filter, Result } from "effect"
*
* console.log(Filter.number(42)) // Result.succeed(42)
* console.log(Filter.number("42")) // fail
* ```
*
* @since 4.0.0
* @category Constructors
*/
const number$1 = /* @__PURE__ */ fromPredicate(isNumber);
/**
* A predefined filter that only passes through boolean values.
*
* @since 4.0.0
* @category Constructors
*/
const boolean$1 = /* @__PURE__ */ fromPredicate(isBoolean);
/**
* A predefined filter that only passes through BigInt values.
*
* @since 4.0.0
* @category Constructors
*/
const bigint = /* @__PURE__ */ fromPredicate(isBigInt);
/**
* A predefined filter that only passes through Symbol values.
*
* @since 4.0.0
* @category Constructors
*/
const symbol$1 = /* @__PURE__ */ fromPredicate(isSymbol);
/**
* A predefined filter that only passes through Date objects.
*
* @since 4.0.0
* @category Constructors
*/
const date = /* @__PURE__ */ fromPredicate(isDate);
/**
* Composes two filters sequentially, allowing the output of the first to be
* passed to the second.
*
* This is similar to `compose`, but it will always fail with the original
* input.
*
* @since 4.0.0
* @category Combinators
*/
const composePassthrough = /* @__PURE__ */ dual(2, (left, right) => (input) => {
	const leftOut = left(input);
	if (isFailure$3(leftOut)) return fail$4(input);
	const rightOut = right(leftOut.success);
	if (isFailure$3(rightOut)) return fail$4(input);
	return rightOut;
});
/**
* @since 4.0.0
* @category Conversions
*/
const toOption = (self) => (input) => {
	const result = self(input);
	return isFailure$3(result) ? none() : some(result.success);
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/array.js
/**
* @since 2.0.0
*/
/** @internal */
const isArrayNonEmpty$1 = (self) => self.length > 0;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Iterable.js
/**
* Returns the first element that satisfies the specified
* predicate, or `None` if no such element exists.
*
* @example
* ```ts
* import { Iterable } from "effect"
* import * as Option from "effect/Option"
*
* const numbers = [1, 3, 4, 6, 8]
* const firstEven = Iterable.findFirst(numbers, (x) => x % 2 === 0)
* console.log(firstEven) // Option.some(4)
*
* const firstGreaterThan10 = Iterable.findFirst(numbers, (x) => x > 10)
* console.log(firstGreaterThan10) // Option.none()
*
* // With index
* const letters = ["a", "b", "c", "d"]
* const atEvenIndex = Iterable.findFirst(letters, (_, i) => i % 2 === 0)
* console.log(atEvenIndex) // Option.some("a")
*
* // Type refinement
* const mixed: Array<string | number> = [1, "hello", 2, "world"]
* const firstString = Iterable.findFirst(
*   mixed,
*   (x): x is string => typeof x === "string"
* )
* console.log(firstString) // Option.some("hello")
*
* // Transform during search
* const findSquareRoot = Iterable.findFirst([1, 4, 9, 16], (x) => {
*   const sqrt = Math.sqrt(x)
*   return Number.isInteger(sqrt) ? Option.some(sqrt) : Option.none()
* })
* console.log(findSquareRoot) // Option.some(1)
* ```
*
* @category elements
* @since 2.0.0
*/
const findFirst$1 = /* @__PURE__ */ dual(2, (self, f) => {
	let i = 0;
	for (const a of self) {
		const o = f(a, i);
		if (isBoolean(o)) {
			if (o) return some(a);
		} else if (isSome(o)) return o;
		i++;
	}
	return none();
});
/**
* Filters an iterable to only include elements that match a predicate.
*
* This function creates a new iterable containing only the elements for which
* the predicate function returns true. Like map, this operation is lazy and
* elements are only tested when the iterable is consumed.
*
* @param self - The source iterable to filter
* @param predicate - Function that tests each element (receives value and index)
*
* @example
* ```ts
* import { Iterable } from "effect"
*
* // Filter even numbers
* const numbers = [1, 2, 3, 4, 5, 6]
* const evens = Iterable.filter(numbers, (x) => x % 2 === 0)
* console.log(Array.from(evens)) // [2, 4, 6]
*
* // Filter with index
* const items = ["a", "b", "c", "d"]
* const oddPositions = Iterable.filter(items, (_, i) => i % 2 === 1)
* console.log(Array.from(oddPositions)) // ["b", "d"]
*
* // Type refinement
* const mixed: Array<string | number> = ["hello", 42, "world", 100]
* const onlyStrings = Iterable.filter(
*   mixed,
*   (x): x is string => typeof x === "string"
* )
* console.log(Array.from(onlyStrings)) // ["hello", "world"] (typed as string[])
*
* // Combine with map
* const processed = Iterable.map(
*   Iterable.filter([1, 2, 3, 4, 5], (x) => x > 2),
*   (x) => x * 10
* )
* console.log(Array.from(processed)) // [30, 40, 50]
* ```
*
* @category filtering
* @since 2.0.0
*/
const filter$2 = /* @__PURE__ */ dual(2, (self, predicate) => ({ [Symbol.iterator]() {
	const iterator = self[Symbol.iterator]();
	let i = 0;
	return { next() {
		let result = iterator.next();
		while (!result.done) {
			if (predicate(result.value, i++)) return {
				done: false,
				value: result.value
			};
			result = iterator.next();
		}
		return {
			done: true,
			value: void 0
		};
	} };
} }));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Record.js
/**
* Transforms the values of a record into an `Array` with a custom mapping function.
*
* @example
* ```ts
* import { Record } from "effect"
* import * as assert from "node:assert"
*
* const x = { a: 1, b: 2, c: 3 }
* assert.deepStrictEqual(Record.collect(x, (key, n) => [key, n]), [["a", 1], [
*   "b",
*   2
* ], ["c", 3]])
* ```
*
* @category conversions
* @since 2.0.0
*/
const collect = /* @__PURE__ */ dual(2, (self, f) => {
	const out = [];
	for (const key of keys(self)) out.push(f(key, self[key]));
	return out;
});
/**
* Takes a record and returns an array of tuples containing its keys and values.
*
* @example
* ```ts
* import { Record } from "effect"
* import * as assert from "node:assert"
*
* const x = { a: 1, b: 2, c: 3 }
* assert.deepStrictEqual(Record.toEntries(x), [["a", 1], ["b", 2], ["c", 3]])
* ```
*
* @category conversions
* @since 2.0.0
*/
const toEntries = /* @__PURE__ */ collect((key, value) => [key, value]);
/**
* Retrieve the keys of a given record as an array.
*
* @example
* ```ts
* import { Record } from "effect"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(Record.keys({ a: 1, b: 2, c: 3 }), ["a", "b", "c"])
* ```
*
* @category getters
* @since 2.0.0
*/
const keys = (self) => Object.keys(self);

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Array.js
/**
* Utilities for working with immutable arrays (and non-empty arrays) in a
* functional style. All functions treat arrays as immutable — they return new
* arrays rather than mutating the input.
*
* ## Mental model
*
* - **`Array<A>`** is a standard JS array. All functions in this module return
*   new arrays; the input is never mutated.
* - **`NonEmptyReadonlyArray<A>`** (`readonly [A, ...Array<A>]`) is a readonly
*   array guaranteed to have at least one element. Many functions preserve or
*   require this guarantee at the type level.
* - **`NonEmptyArray<A>`** is the mutable counterpart: `[A, ...Array<A>]`.
* - Most functions are **dual** — they can be called either as
*   `Array.fn(array, arg)` (data-first) or piped as
*   `pipe(array, Array.fn(arg))` (data-last).
* - Functions that access elements by index return `Option<A>` for safety; use
*   the `*NonEmpty` variants (e.g. {@link headNonEmpty}) when you already know
*   the array is non-empty.
* - Set-like operations ({@link union}, {@link intersection},
*   {@link difference}) use `Equal.equivalence()` by default; use the `*With`
*   variants for custom equality.
*
* ## Common tasks
*
* - **Create** an array: {@link make}, {@link of}, {@link empty},
*   {@link fromIterable}, {@link range}, {@link makeBy}, {@link replicate},
*   {@link unfold}
* - **Access** elements: {@link head}, {@link last}, {@link get}, {@link tail},
*   {@link init}
* - **Transform**: {@link map}, {@link flatMap}, {@link flatten}
* - **Filter**: {@link filter}, {@link partition}, {@link dedupe}
* - **Combine**: {@link append}, {@link prepend}, {@link appendAll},
*   {@link prependAll}, {@link zip}, {@link cartesian}
* - **Split**: {@link splitAt}, {@link chunksOf}, {@link span}, {@link window}
* - **Search**: {@link findFirst}, {@link findLast}, {@link contains}
* - **Sort**: {@link sort}, {@link sortBy}, {@link sortWith}
* - **Fold**: {@link reduce}, {@link scan}, {@link join}
* - **Group**: {@link groupBy}, {@link group}, {@link groupWith}
* - **Set operations**: {@link union}, {@link intersection},
*   {@link difference}
* - **Match** on empty vs non-empty: {@link match}, {@link matchLeft},
*   {@link matchRight}
* - **Check** properties: {@link isArray}, {@link isArrayNonEmpty},
*   {@link every}, {@link some}
*
* ## Gotchas
*
* - {@link fromIterable} returns the original array reference when given an
*   array; if you need a copy, use {@link copy}.
* - `sort`, `reverse`, etc. always allocate a new array — the input is never
*   mutated.
* - {@link makeBy} and {@link replicate} normalize `n` to an integer >= 1 —
*   they never produce an empty array.
* - {@link range}`(start, end)` is inclusive on both ends. If `start > end` it
*   returns `[start]`.
* - Functions returning `Option` (e.g. {@link head}, {@link findFirst}) return
*   `Option.none()` for empty inputs — they never throw.
*
* ## Quickstart
*
* **Example** (Basic array operations)
*
* ```ts
* import { Array } from "effect"
*
* const numbers = Array.make(1, 2, 3, 4, 5)
*
* const doubled = Array.map(numbers, (n) => n * 2)
* console.log(doubled) // [2, 4, 6, 8, 10]
*
* const evens = Array.filter(numbers, (n) => n % 2 === 0)
* console.log(evens) // [2, 4]
*
* const sum = Array.reduce(numbers, 0, (acc, n) => acc + n)
* console.log(sum) // 15
* ```
*
* @see {@link make} — create a non-empty array from elements
* @see {@link map} — transform each element
* @see {@link filter} — keep elements matching a predicate
* @see {@link reduce} — fold an array to a single value
*
* @since 2.0.0
*/
/**
* Reference to the global `Array` constructor.
*
* Use this when you need the native `Array` constructor while the `Array`
* namespace is in scope (e.g. `Array.Array.isArray`, `Array.Array.from`).
*
* **Example** (Using the Array constructor)
*
* ```ts
* import { Array } from "effect"
*
* const arr = new Array.Array(3)
* console.log(arr) // [undefined, undefined, undefined]
* ```
*
* @category constructors
* @since 4.0.0
*/
const Array$2 = globalThis.Array;
/**
* Converts an `Iterable` to an `Array`.
*
* - If the input is already an array, returns it **by reference** (no copy).
* - Otherwise, creates a new array from the iterable.
* - Use {@link copy} if you need a fresh array even when the input is already
*   an array.
*
* **Example** (Converting a Set to an array)
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.fromIterable(new Set([1, 2, 3]))
* console.log(result) // [1, 2, 3]
* ```
*
* @see {@link ensure} — wrap a single value or return an existing array
* @see {@link copy} — create a shallow copy of an array
*
* @category constructors
* @since 2.0.0
*/
const fromIterable = (collection) => Array$2.isArray(collection) ? collection : Array$2.from(collection);
/**
* Converts a record into an array of `[key, value]` tuples.
*
* - Key order follows `Object.entries` semantics.
* - Returns an empty array for an empty record.
*
* **Example** (Record to entries)
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.fromRecord({ a: 1, b: 2, c: 3 })
* console.log(result) // [["a", 1], ["b", 2], ["c", 3]]
* ```
*
* @category conversions
* @since 2.0.0
*/
const fromRecord = toEntries;
/**
* Converts an `Option` to an array: `Some(a)` becomes `[a]`, `None` becomes `[]`.
*
* **Example** (Option to array)
*
* ```ts
* import { Array, Option } from "effect"
*
* console.log(Array.fromOption(Option.some(1))) // [1]
* console.log(Array.fromOption(Option.none())) // []
* ```
*
* @see {@link getSomes} — extract `Some` values from an array of Options
*
* @category conversions
* @since 2.0.0
*/
const fromOption$2 = toArray;
/**
* Adds a single element to the end of an iterable, returning a `NonEmptyArray`.
*
* - Always returns a non-empty array.
* - Does not mutate the input.
*
* **Example** (Appending an element)
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.append([1, 2, 3], 4)
* console.log(result) // [1, 2, 3, 4]
* ```
*
* @see {@link prepend} — add to the front
* @see {@link appendAll} — append multiple elements
*
* @category concatenating
* @since 2.0.0
*/
const append = /* @__PURE__ */ dual(2, (self, last) => [...self, last]);
/**
* Concatenates two iterables into a single array.
*
* - If either input is non-empty, the result is a `NonEmptyArray`.
* - Does not mutate the inputs.
*
* **Example** (Concatenating arrays)
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.appendAll([1, 2], [3, 4])
* console.log(result) // [1, 2, 3, 4]
* ```
*
* @see {@link append} — add a single element to the end
* @see {@link prependAll} — add elements to the front
*
* @category concatenating
* @since 2.0.0
*/
const appendAll = /* @__PURE__ */ dual(2, (self, that) => fromIterable(self).concat(fromIterable(that)));
/**
* Tests whether a value is an `Array`.
*
* - Acts as a type guard narrowing the input to `Array<unknown>`.
* - Delegates to `globalThis.Array.isArray`.
*
* **Example** (Type-guarding an unknown value)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isArray(null)) // false
* console.log(Array.isArray([1, 2, 3])) // true
* ```
*
* @see {@link isArrayEmpty} — check for an empty array
* @see {@link isArrayNonEmpty} — check for a non-empty array
*
* @category guards
* @since 2.0.0
*/
const isArray = Array$2.isArray;
/**
* Tests whether a mutable `Array` is non-empty, narrowing the type to
* `NonEmptyArray`.
*
* **Example** (Checking for a non-empty array)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isArrayNonEmpty([])) // false
* console.log(Array.isArrayNonEmpty([1, 2, 3])) // true
* ```
*
* @see {@link isReadonlyArrayNonEmpty} — readonly variant
* @see {@link isArrayEmpty} — opposite check
*
* @category guards
* @since 2.0.0
*/
const isArrayNonEmpty = isArrayNonEmpty$1;
/**
* Tests whether a `ReadonlyArray` is non-empty, narrowing the type to
* `NonEmptyReadonlyArray`.
*
* **Example** (Checking for a non-empty readonly array)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isReadonlyArrayNonEmpty([])) // false
* console.log(Array.isReadonlyArrayNonEmpty([1, 2, 3])) // true
* ```
*
* @see {@link isArrayNonEmpty} — mutable variant
* @see {@link isReadonlyArrayEmpty} — opposite check
*
* @category guards
* @since 2.0.0
*/
const isReadonlyArrayNonEmpty = isArrayNonEmpty$1;
/** @internal */
function isOutOfBounds(i, as) {
	return i < 0 || i >= as.length;
}
/**
* Reads an element at the given index, throwing if the index is out of bounds.
*
* - Throws an `Error` with the message `"Index out of bounds: <i>"`.
* - Prefer {@link get} for safe access.
*
* **Example** (Unsafe index access)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.getUnsafe([1, 2, 3], 1)) // 2
* // Array.getUnsafe([1, 2, 3], 10) // throws Error
* ```
*
* @see {@link get} — safe version returning `Option`
*
* @since 2.0.0
* @category unsafe
*/
const getUnsafe$1 = /* @__PURE__ */ dual(2, (self, index) => {
	const i = Math.floor(index);
	if (isOutOfBounds(i, self)) throw new Error(`Index out of bounds: ${i}`);
	return self[i];
});
/**
* Returns the first element of a `NonEmptyReadonlyArray` directly (no `Option`
* wrapper).
*
* **Example** (Getting the head of a non-empty array)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.headNonEmpty([1, 2, 3, 4])) // 1
* ```
*
* @see {@link head} — safe version for possibly-empty arrays
*
* @category getters
* @since 2.0.0
*/
const headNonEmpty = /* @__PURE__ */ getUnsafe$1(0);
/**
* Returns all elements except the first of a `NonEmptyReadonlyArray`.
*
* **Example** (Getting the tail of a non-empty array)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.tailNonEmpty([1, 2, 3, 4])) // [2, 3, 4]
* ```
*
* @see {@link tail} — safe version for possibly-empty arrays
* @see {@link initNonEmpty} — all elements except the last
*
* @category getters
* @since 2.0.0
*/
const tailNonEmpty = (self) => self.slice(1);
/**
* Returns the first element matching a predicate, refinement, or mapping
* function, wrapped in `Option`.
*
* - Accepts a predicate `(a, i) => boolean`, a refinement, or a function
*   `(a, i) => Option<B>` for simultaneous find-and-transform.
* - Returns `Option.none()` if no element matches.
*
* **Example** (Finding the first match)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.findFirst([1, 2, 3, 4, 5], (x) => x > 3)) // Option.some(4)
* ```
*
* @see {@link findLast} — search from the end
* @see {@link findFirstIndex} — get the index instead
* @see {@link findFirstWithIndex} — get both element and index
*
* @category elements
* @since 2.0.0
*/
const findFirst = findFirst$1;
/**
* Computes the union of two arrays using a custom equivalence, removing
* duplicates.
*
* **Example** (Union with custom equality)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.unionWith([1, 2], [2, 3], (a, b) => a === b)) // [1, 2, 3]
* ```
*
* @see {@link union} — uses default equality
* @see {@link intersection} — elements in both arrays
* @see {@link difference} — elements only in the first array
*
* @category elements
* @since 2.0.0
*/
const unionWith = /* @__PURE__ */ dual(3, (self, that, isEquivalent) => {
	const a = fromIterable(self);
	const b = fromIterable(that);
	if (isReadonlyArrayNonEmpty(a)) {
		if (isReadonlyArrayNonEmpty(b)) return dedupeWith(isEquivalent)(appendAll(a, b));
		return a;
	}
	return b;
});
/**
* Computes the union of two arrays, removing duplicates using
* `Equal.equivalence()`.
*
* **Example** (Array union)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.union([1, 2], [2, 3])) // [1, 2, 3]
* ```
*
* @see {@link unionWith} — use custom equality
* @see {@link intersection} — elements in both arrays
* @see {@link difference} — elements only in the first array
*
* @category elements
* @since 2.0.0
*/
const union$1 = /* @__PURE__ */ dual(2, (self, that) => unionWith(self, that, asEquivalence()));
/**
* Maps each element to a `Result`, then separates failures and successes into
* two arrays.
*
* - Returns `[failures, successes]`.
*
* **Example** (Partitioning by Result)
*
* ```ts
* import { Array, Result } from "effect"
*
* const result = Array.partitionMap(
*   [1, 2, 3, 4, 5],
*   (x) => x % 2 === 0 ? Result.succeed(x) : Result.fail(x)
* )
* console.log(result) // [[1, 3, 5], [2, 4]]
* ```
*
* @see {@link partition} — partition by predicate
* @see {@link separate} — partition an array of Results
*
* @category filtering
* @since 2.0.0
*/
const partitionMap = /* @__PURE__ */ dual(2, (self, f) => {
	const failures = [];
	const successes = [];
	const as = fromIterable(self);
	for (let i = 0; i < as.length; i++) {
		const e = f(as[i], i);
		if (isFailure$3(e)) failures.push(e.failure);
		else successes.push(e.success);
	}
	return [failures, successes];
});
/**
* Creates an `Order` for arrays based on an element `Order`. Arrays are
* compared element-wise; if all compared elements are equal, shorter arrays
* come first.
*
* **Example** (Comparing arrays)
*
* ```ts
* import { Array, Order } from "effect"
*
* const arrayOrder = Array.makeOrder(Order.Number)
* console.log(arrayOrder([1, 2], [1, 3])) // -1
* ```
*
* @see {@link makeEquivalence} — create an equivalence for arrays
*
* @category instances
* @since 2.0.0
*/
const makeOrder$1 = Array$3;
/**
* Creates an `Equivalence` for arrays based on an element `Equivalence`. Two
* arrays are equivalent when they have the same length and all elements are
* pairwise equivalent.
*
* **Example** (Comparing arrays for equality)
*
* ```ts
* import { Array } from "effect"
*
* const eq = Array.makeEquivalence<number>((a, b) => a === b)
* console.log(eq([1, 2, 3], [1, 2, 3])) // true
* ```
*
* @see {@link makeOrder} — create an ordering for arrays
*
* @category instances
* @since 2.0.0
*/
const makeEquivalence$1 = Array$4;
/**
* Removes duplicates using a custom equivalence, preserving the order of the
* first occurrence.
*
* **Example** (Deduplicating with custom equality)
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.dedupeWith([1, 2, 2, 3, 3, 3], (a, b) => a === b)) // [1, 2, 3]
* ```
*
* @see {@link dedupe} — uses default equality
* @see {@link dedupeAdjacentWith} — only dedupes consecutive elements
*
* @category elements
* @since 2.0.0
*/
const dedupeWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
	const input = fromIterable(self);
	if (isReadonlyArrayNonEmpty(input)) {
		const out = [headNonEmpty(input)];
		const rest = tailNonEmpty(input);
		for (const r of rest) if (out.every((a) => !isEquivalent(r, a))) out.push(r);
		return out;
	}
	return [];
});

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/UndefinedOr.js
/**
* @since 4.0.0
*/
const map$4 = /* @__PURE__ */ dual(2, (self, f) => self === void 0 ? void 0 : f(self));
/**
* @since 4.0.0
*/
const liftThrowable = (f) => (...a) => {
	try {
		return f(...a);
	} catch {
		return;
	}
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Duration.js
const TypeId$13 = "~effect/time/Duration";
const bigint0$1 = /* @__PURE__ */ BigInt(0);
const bigint1e3 = /* @__PURE__ */ BigInt(1e3);
const DURATION_REGEXP = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
/**
* Decodes a `DurationInput` into a `Duration`.
*
* If the input is not a valid `DurationInput`, it throws an error.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration1 = Duration.fromDurationInputUnsafe(1000) // 1000 milliseconds
* const duration2 = Duration.fromDurationInputUnsafe("5 seconds")
* const duration3 = Duration.fromDurationInputUnsafe([2, 500_000_000]) // 2 seconds and 500ms
* ```
*
* @since 2.0.0
* @category constructors
*/
const fromDurationInputUnsafe = (input) => {
	if (isDuration(input)) return input;
	if (isNumber(input)) return millis(input);
	if (isBigInt(input)) return nanos(input);
	if (Array.isArray(input) && input.length === 2 && input.every(isNumber)) {
		if (Number.isNaN(input[0]) || Number.isNaN(input[1])) return zero;
		if (input[0] === -Infinity || input[1] === -Infinity) return negativeInfinity;
		if (input[0] === Infinity || input[1] === Infinity) return infinity;
		return nanos(BigInt(Math.round(input[0] * 1e9)) + BigInt(Math.round(input[1])));
	}
	if (isString(input)) {
		const match = DURATION_REGEXP.exec(input);
		if (match) {
			const [_, valueStr, unit] = match;
			const value = Number(valueStr);
			switch (unit) {
				case "nano":
				case "nanos": return nanos(BigInt(valueStr));
				case "micro":
				case "micros": return micros(BigInt(valueStr));
				case "milli":
				case "millis": return millis(value);
				case "second":
				case "seconds": return seconds(value);
				case "minute":
				case "minutes": return minutes(value);
				case "hour":
				case "hours": return hours(value);
				case "day":
				case "days": return days(value);
				case "week":
				case "weeks": return weeks(value);
			}
		}
	}
	throw new Error(`Invalid DurationInput: ${input}`);
};
const zeroDurationValue = {
	_tag: "Millis",
	millis: 0
};
const infinityDurationValue = { _tag: "Infinity" };
const negativeInfinityDurationValue = { _tag: "NegativeInfinity" };
const DurationProto = {
	[TypeId$13]: TypeId$13,
	[symbol$3]() {
		return structure(this.value);
	},
	[symbol$2](that) {
		return isDuration(that) && equals(this, that);
	},
	toString() {
		switch (this.value._tag) {
			case "Infinity": return "Infinity";
			case "NegativeInfinity": return "-Infinity";
			case "Nanos": return `${this.value.nanos} nanos`;
			case "Millis": return `${this.value.millis} millis`;
		}
	},
	toJSON() {
		switch (this.value._tag) {
			case "Millis": return {
				_id: "Duration",
				_tag: "Millis",
				millis: this.value.millis
			};
			case "Nanos": return {
				_id: "Duration",
				_tag: "Nanos",
				nanos: String(this.value.nanos)
			};
			case "Infinity": return {
				_id: "Duration",
				_tag: "Infinity"
			};
			case "NegativeInfinity": return {
				_id: "Duration",
				_tag: "NegativeInfinity"
			};
		}
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const make$9 = (input) => {
	const duration = Object.create(DurationProto);
	if (isNumber(input)) if (isNaN(input) || input === 0 || Object.is(input, -0)) duration.value = zeroDurationValue;
	else if (!Number.isFinite(input)) duration.value = input > 0 ? infinityDurationValue : negativeInfinityDurationValue;
	else if (!Number.isInteger(input)) duration.value = {
		_tag: "Nanos",
		nanos: BigInt(Math.round(input * 1e6))
	};
	else duration.value = {
		_tag: "Millis",
		millis: input
	};
	else if (input === bigint0$1) duration.value = zeroDurationValue;
	else duration.value = {
		_tag: "Nanos",
		nanos: input
	};
	return duration;
};
/**
* Checks if a value is a Duration.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* console.log(Duration.isDuration(Duration.seconds(1))) // true
* console.log(Duration.isDuration(1000)) // false
* ```
*
* @since 2.0.0
* @category guards
*/
const isDuration = (u) => hasProperty(u, TypeId$13);
/**
* A Duration representing zero time.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* console.log(Duration.toMillis(Duration.zero)) // 0
* ```
*
* @since 2.0.0
* @category constructors
*/
const zero = /* @__PURE__ */ make$9(0);
/**
* A Duration representing infinite time.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* console.log(Duration.toMillis(Duration.infinity)) // Infinity
* ```
*
* @since 2.0.0
* @category constructors
*/
const infinity = /* @__PURE__ */ make$9(Infinity);
/**
* A Duration representing negative infinite time.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* console.log(Duration.toMillis(Duration.negativeInfinity)) // -Infinity
* ```
*
* @since 4.0.0
* @category constructors
*/
const negativeInfinity = /* @__PURE__ */ make$9(-Infinity);
/**
* Creates a Duration from nanoseconds.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.nanos(BigInt(500_000_000))
* console.log(Duration.toMillis(duration)) // 500
* ```
*
* @since 2.0.0
* @category constructors
*/
const nanos = (nanos) => make$9(nanos);
/**
* Creates a Duration from microseconds.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.micros(BigInt(500_000))
* console.log(Duration.toMillis(duration)) // 500
* ```
*
* @since 2.0.0
* @category constructors
*/
const micros = (micros) => make$9(micros * bigint1e3);
/**
* Creates a Duration from milliseconds.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.millis(1000)
* console.log(Duration.toMillis(duration)) // 1000
* ```
*
* @since 2.0.0
* @category constructors
*/
const millis = (millis) => make$9(millis);
/**
* Creates a Duration from seconds.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.seconds(30)
* console.log(Duration.toMillis(duration)) // 30000
* ```
*
* @since 2.0.0
* @category constructors
*/
const seconds = (seconds) => make$9(seconds * 1e3);
/**
* Creates a Duration from minutes.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.minutes(5)
* console.log(Duration.toMillis(duration)) // 300000
* ```
*
* @since 2.0.0
* @category constructors
*/
const minutes = (minutes) => make$9(minutes * 6e4);
/**
* Creates a Duration from hours.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.hours(2)
* console.log(Duration.toMillis(duration)) // 7200000
* ```
*
* @since 2.0.0
* @category constructors
*/
const hours = (hours) => make$9(hours * 36e5);
/**
* Creates a Duration from days.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.days(1)
* console.log(Duration.toMillis(duration)) // 86400000
* ```
*
* @since 2.0.0
* @category constructors
*/
const days = (days) => make$9(days * 864e5);
/**
* Creates a Duration from weeks.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.weeks(1)
* console.log(Duration.toMillis(duration)) // 604800000
* ```
*
* @since 2.0.0
* @category constructors
*/
const weeks = (weeks) => make$9(weeks * 6048e5);
/**
* Converts a Duration to milliseconds.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* console.log(Duration.toMillis(Duration.seconds(5))) // 5000
* console.log(Duration.toMillis(Duration.minutes(2))) // 120000
* ```
*
* @since 2.0.0
* @category getters
*/
const toMillis = (self) => match$5(self, {
	onMillis: identity,
	onNanos: (nanos) => Number(nanos) / 1e6,
	onInfinity: () => Infinity,
	onNegativeInfinity: () => -Infinity
});
/**
* Get the duration in nanoseconds as a bigint.
*
* If the duration is infinite, it throws an error.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const duration = Duration.seconds(2)
* const nanos = Duration.toNanosUnsafe(duration)
* console.log(nanos) // 2000000000n
*
* // This will throw an error
* try {
*   Duration.toNanosUnsafe(Duration.infinity)
* } catch (error) {
*   console.log((error as Error).message) // "Cannot convert infinite duration to nanos"
* }
* ```
*
* @since 2.0.0
* @category getters
*/
const toNanosUnsafe = (self) => {
	switch (self.value._tag) {
		case "Infinity":
		case "NegativeInfinity": throw new Error("Cannot convert infinite duration to nanos");
		case "Nanos": return self.value.nanos;
		case "Millis": return BigInt(Math.round(self.value.millis * 1e6));
	}
};
/**
* Get the duration in nanoseconds as a bigint.
*
* If the duration is infinite, returns `undefined`.
*
* **Example**
*
* ```ts
* import { Duration } from "effect"
*
* Duration.toNanos(Duration.seconds(1)) // 1000000000n
*
* Duration.toNanos(Duration.infinity) // undefined
* ```
*
* @category getters
* @since 4.0.0
*/
const toNanos = /* @__PURE__ */ liftThrowable(toNanosUnsafe);
/**
* Pattern matches on a Duration, providing different handlers for millis and nanos.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const result = Duration.match(Duration.seconds(5), {
*   onMillis: (millis) => `${millis} milliseconds`,
*   onNanos: (nanos) => `${nanos} nanoseconds`,
*   onInfinity: () => "infinite"
* })
* console.log(result) // "5000 milliseconds"
* ```
*
* @since 2.0.0
* @category pattern matching
*/
const match$5 = /* @__PURE__ */ dual(2, (self, options) => {
	switch (self.value._tag) {
		case "Millis": return options.onMillis(self.value.millis);
		case "Nanos": return options.onNanos(self.value.nanos);
		case "Infinity": return options.onInfinity();
		case "NegativeInfinity": return (options.onNegativeInfinity ?? options.onInfinity)();
	}
});
/**
* Pattern matches on two `Duration`s, providing handlers that receive both values.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const sum = Duration.matchPair(Duration.seconds(3), Duration.seconds(2), {
*   onMillis: (a, b) => a + b,
*   onNanos: (a, b) => Number(a + b),
*   onInfinity: () => Infinity
* })
* console.log(sum) // 5000
* ```
*
* @since 2.0.0
* @category pattern matching
*/
const matchPair = /* @__PURE__ */ dual(3, (self, that, options) => {
	if (self.value._tag === "Infinity" || self.value._tag === "NegativeInfinity" || that.value._tag === "Infinity" || that.value._tag === "NegativeInfinity") return options.onInfinity(self, that);
	if (self.value._tag === "Millis") return that.value._tag === "Millis" ? options.onMillis(self.value.millis, that.value.millis) : options.onNanos(toNanosUnsafe(self), that.value.nanos);
	else return options.onNanos(self.value.nanos, toNanosUnsafe(that));
});
/**
* Equivalence instance for `Duration`, allowing equality comparisons.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const isEqual = Duration.Equivalence(Duration.seconds(5), Duration.millis(5000))
* console.log(isEqual) // true
* ```
*
* @category instances
* @since 2.0.0
*/
const Equivalence$2 = (self, that) => matchPair(self, that, {
	onMillis: (self, that) => self === that,
	onNanos: (self, that) => self === that,
	onInfinity: (self, that) => self.value._tag === that.value._tag
});
/**
* Checks if two Durations are equal.
*
* @example
* ```ts
* import { Duration } from "effect"
*
* const isEqual = Duration.equals(Duration.seconds(5), Duration.millis(5000))
* console.log(isEqual) // true
* ```
*
* @since 2.0.0
* @category predicates
*/
const equals = /* @__PURE__ */ dual(2, (self, that) => Equivalence$2(self, that));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/ServiceMap.js
const ServiceTypeId = "~effect/ServiceMap/Service";
/**
* @example
* ```ts
* import { ServiceMap } from "effect"
*
* // Create a simple service
* const Database = ServiceMap.Service<{
*   query: (sql: string) => string
* }>("Database")
*
* // Create a service class
* class Config extends ServiceMap.Service<Config, {
*   port: number
* }>()("Config") {}
*
* // Use the services to create service maps
* const db = ServiceMap.make(Database, {
*   query: (sql) => `Result: ${sql}`
* })
* const config = ServiceMap.make(Config, { port: 8080 })
* ```
*
* @since 4.0.0
* @category Constructors
*/
const Service = function() {
	const prevLimit = Error.stackTraceLimit;
	Error.stackTraceLimit = 2;
	const err = /* @__PURE__ */ new Error();
	Error.stackTraceLimit = prevLimit;
	function KeyClass() {}
	const self = KeyClass;
	Object.setPrototypeOf(self, ServiceProto);
	Object.defineProperty(self, "stack", { get() {
		return err.stack;
	} });
	if (arguments.length > 0) {
		self.key = arguments[0];
		if (arguments[1]?.defaultValue) {
			self[ReferenceTypeId] = ReferenceTypeId;
			self.defaultValue = arguments[1].defaultValue;
		}
		return self;
	}
	return function(key, options) {
		self.key = key;
		if (options?.make) self.make = options.make;
		return self;
	};
};
const ServiceProto = {
	[ServiceTypeId]: {
		_Service: (_) => _,
		_Identifier: (_) => _
	},
	...PipeInspectableProto,
	...YieldableProto,
	toJSON() {
		return {
			_id: "Service",
			key: this.key,
			stack: this.stack
		};
	},
	asEffect() {
		return (this.asEffect = constant(withFiber$1((fiber) => exitSucceed(get(fiber.services, this)))))();
	},
	of(self) {
		return self;
	},
	serviceMap(self) {
		return make$8(this, self);
	},
	use(f) {
		return withFiber$1((fiber) => f(get(fiber.services, this)));
	},
	useSync(f) {
		return withFiber$1((fiber) => exitSucceed(f(get(fiber.services, this))));
	}
};
const ReferenceTypeId = "~effect/ServiceMap/Reference";
const TypeId$12 = "~effect/ServiceMap";
/**
* @example
* ```ts
* import { ServiceMap } from "effect"
*
* // Create a service map from a Map (unsafe)
* const map = new Map([
*   ["Logger", { log: (msg: string) => console.log(msg) }]
* ])
*
* const services = ServiceMap.makeUnsafe(map)
* ```
*
* @since 4.0.0
* @category Constructors
*/
const makeUnsafe$5 = (mapUnsafe) => {
	const self = Object.create(Proto$2);
	self.mapUnsafe = mapUnsafe;
	return self;
};
const Proto$2 = {
	...PipeInspectableProto,
	[TypeId$12]: { _Services: (_) => _ },
	toJSON() {
		return {
			_id: "ServiceMap",
			services: Array.from(this.mapUnsafe).map(([key, value]) => ({
				key,
				value
			}))
		};
	},
	[symbol$2](that) {
		if (!isServiceMap(that) || this.mapUnsafe.size !== that.mapUnsafe.size) return false;
		for (const k of this.mapUnsafe.keys()) if (!that.mapUnsafe.has(k) || !equals$1(this.mapUnsafe.get(k), that.mapUnsafe.get(k))) return false;
		return true;
	},
	[symbol$3]() {
		return number$2(this.mapUnsafe.size);
	}
};
/**
* Checks if the provided argument is a `ServiceMap`.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* assert.strictEqual(ServiceMap.isServiceMap(ServiceMap.empty()), true)
* ```
*
* @since 4.0.0
* @category Guards
*/
const isServiceMap = (u) => hasProperty(u, TypeId$12);
/**
* Checks if the provided argument is a `Reference`.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const LoggerRef = ServiceMap.Reference("Logger", {
*   defaultValue: () => ({ log: (msg: string) => console.log(msg) })
* })
*
* assert.strictEqual(ServiceMap.isReference(LoggerRef), true)
* assert.strictEqual(ServiceMap.isReference(ServiceMap.Service("Key")), false)
* ```
*
* @since 4.0.0
* @category Guards
*/
const isReference = (u) => hasProperty(u, ReferenceTypeId);
/**
* Returns an empty `ServiceMap`.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* assert.strictEqual(ServiceMap.isServiceMap(ServiceMap.empty()), true)
* ```
*
* @since 4.0.0
* @category Constructors
*/
const empty$1 = () => emptyServiceMap;
const emptyServiceMap = /* @__PURE__ */ makeUnsafe$5(/* @__PURE__ */ new Map());
/**
* Creates a new `ServiceMap` with a single service associated to the key.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const Port = ServiceMap.Service<{ PORT: number }>("Port")
*
* const Services = ServiceMap.make(Port, { PORT: 8080 })
*
* assert.deepStrictEqual(ServiceMap.get(Services, Port), { PORT: 8080 })
* ```
*
* @since 4.0.0
* @category Constructors
*/
const make$8 = (key, service) => makeUnsafe$5(new Map([[key.key, service]]));
/**
* Adds a service to a given `ServiceMap`.
*
* @example
* ```ts
* import { pipe, ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const Port = ServiceMap.Service<{ PORT: number }>("Port")
* const Timeout = ServiceMap.Service<{ TIMEOUT: number }>("Timeout")
*
* const someServiceMap = ServiceMap.make(Port, { PORT: 8080 })
*
* const Services = pipe(
*   someServiceMap,
*   ServiceMap.add(Timeout, { TIMEOUT: 5000 })
* )
*
* assert.deepStrictEqual(ServiceMap.get(Services, Port), { PORT: 8080 })
* assert.deepStrictEqual(ServiceMap.get(Services, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 4.0.0
* @category Adders
*/
const add$2 = /* @__PURE__ */ dual(3, (self, key, service) => {
	const map = new Map(self.mapUnsafe);
	map.set(key.key, service);
	return makeUnsafe$5(map);
});
/**
* @since 4.0.0
* @category Adders
*/
const addOrOmit = /* @__PURE__ */ dual(3, (self, key, service) => {
	const map = new Map(self.mapUnsafe);
	if (service._tag === "None") map.delete(key.key);
	else map.set(key.key, service.value);
	return makeUnsafe$5(map);
});
/**
* Get a service from the context that corresponds to the given key, or
* use the fallback value.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const Logger = ServiceMap.Service<{ log: (msg: string) => void }>("Logger")
* const Database = ServiceMap.Service<{ query: (sql: string) => string }>(
*   "Database"
* )
*
* const services = ServiceMap.make(Logger, {
*   log: (msg: string) => console.log(msg)
* })
*
* const logger = ServiceMap.getOrElse(services, Logger, () => ({ log: () => {} }))
* const database = ServiceMap.getOrElse(
*   services,
*   Database,
*   () => ({ query: () => "fallback" })
* )
*
* assert.deepStrictEqual(logger, { log: (msg: string) => console.log(msg) })
* assert.deepStrictEqual(database, { query: () => "fallback" })
* ```
*
* @since 4.0.0
* @category Getters
*/
const getOrElse = /* @__PURE__ */ dual(3, (self, key, orElse) => {
	if (self.mapUnsafe.has(key.key)) return self.mapUnsafe.get(key.key);
	return isReference(key) ? getDefaultValue(key) : orElse();
});
/**
* Get a service from the context that corresponds to the given key.
*
* This function is unsafe because if the key is not present in the context, a
* runtime error will be thrown.
*
* For a safer version see {@link getOption}.
*
* @param self - The `ServiceMap` to search for the service.
* @param service - The `Service` of the service to retrieve.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const Port = ServiceMap.Service<{ PORT: number }>("Port")
* const Timeout = ServiceMap.Service<{ TIMEOUT: number }>("Timeout")
*
* const Services = ServiceMap.make(Port, { PORT: 8080 })
*
* assert.deepStrictEqual(ServiceMap.getUnsafe(Services, Port), { PORT: 8080 })
* assert.throws(() => ServiceMap.getUnsafe(Services, Timeout))
* ```
*
* @since 4.0.0
* @category unsafe
*/
const getUnsafe = /* @__PURE__ */ dual(2, (self, service) => {
	if (!self.mapUnsafe.has(service.key)) {
		if (ReferenceTypeId in service) return getDefaultValue(service);
		throw serviceNotFoundError(service);
	}
	return self.mapUnsafe.get(service.key);
});
/**
* Get a service from the context that corresponds to the given key.
*
* @param self - The `ServiceMap` to search for the service.
* @param service - The `Service` of the service to retrieve.
*
* @example
* ```ts
* import { pipe, ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const Port = ServiceMap.Service<{ PORT: number }>("Port")
* const Timeout = ServiceMap.Service<{ TIMEOUT: number }>("Timeout")
*
* const Services = pipe(
*   ServiceMap.make(Port, { PORT: 8080 }),
*   ServiceMap.add(Timeout, { TIMEOUT: 5000 })
* )
*
* assert.deepStrictEqual(ServiceMap.get(Services, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 4.0.0
* @category Getters
*/
const get = getUnsafe;
/**
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const LoggerRef = ServiceMap.Reference("Logger", {
*   defaultValue: () => ({ log: (msg: string) => console.log(msg) })
* })
*
* const services = ServiceMap.empty()
* const logger = ServiceMap.getReferenceUnsafe(services, LoggerRef)
*
* assert.deepStrictEqual(logger, { log: (msg: string) => console.log(msg) })
* ```
*
* @since 4.0.0
* @category unsafe
*/
const getReferenceUnsafe = (self, service) => {
	if (!self.mapUnsafe.has(service.key)) return getDefaultValue(service);
	return self.mapUnsafe.get(service.key);
};
const defaultValueCacheKey = "~effect/ServiceMap/defaultValue";
const getDefaultValue = (ref) => {
	if (defaultValueCacheKey in ref) return ref[defaultValueCacheKey];
	return ref[defaultValueCacheKey] = ref.defaultValue();
};
const serviceNotFoundError = (service) => {
	const error = /* @__PURE__ */ new Error(`Service not found${service.key ? `: ${String(service.key)}` : ""}`);
	if (service.stack) {
		const lines = service.stack.split("\n");
		if (lines.length > 2) {
			const afterAt = lines[2].match(/at (.*)/);
			if (afterAt) error.message = error.message + ` (defined at ${afterAt[1]})`;
		}
	}
	if (error.stack) {
		const lines = error.stack.split("\n");
		lines.splice(1, 3);
		error.stack = lines.join("\n");
	}
	return error;
};
/**
* Get the value associated with the specified key from the context wrapped in
* an `Option` object. If the key is not found, the `Option` object will be
* `None`.
*
* @param self - The `ServiceMap` to search for the service.
* @param service - The `Service` of the service to retrieve.
*
* @example
* ```ts
* import { Option, ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const Port = ServiceMap.Service<{ PORT: number }>("Port")
* const Timeout = ServiceMap.Service<{ TIMEOUT: number }>("Timeout")
*
* const Services = ServiceMap.make(Port, { PORT: 8080 })
*
* assert.deepStrictEqual(
*   ServiceMap.getOption(Services, Port),
*   Option.some({ PORT: 8080 })
* )
* assert.deepStrictEqual(ServiceMap.getOption(Services, Timeout), Option.none())
* ```
*
* @since 4.0.0
* @category Getters
*/
const getOption = /* @__PURE__ */ dual(2, (self, service) => {
	if (self.mapUnsafe.has(service.key)) return some(self.mapUnsafe.get(service.key));
	return isReference(service) ? some(getDefaultValue(service)) : none();
});
/**
* Merges two `ServiceMap`s, returning a new `ServiceMap` containing the services of both.
*
* @param self - The first `ServiceMap` to merge.
* @param that - The second `ServiceMap` to merge.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const Port = ServiceMap.Service<{ PORT: number }>("Port")
* const Timeout = ServiceMap.Service<{ TIMEOUT: number }>("Timeout")
*
* const firstServiceMap = ServiceMap.make(Port, { PORT: 8080 })
* const secondServiceMap = ServiceMap.make(Timeout, { TIMEOUT: 5000 })
*
* const Services = ServiceMap.merge(firstServiceMap, secondServiceMap)
*
* assert.deepStrictEqual(ServiceMap.get(Services, Port), { PORT: 8080 })
* assert.deepStrictEqual(ServiceMap.get(Services, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 4.0.0
* @category Utils
*/
const merge = /* @__PURE__ */ dual(2, (self, that) => {
	if (self.mapUnsafe.size === 0) return that;
	if (that.mapUnsafe.size === 0) return self;
	const map = new Map(self.mapUnsafe);
	that.mapUnsafe.forEach((value, key) => map.set(key, value));
	return makeUnsafe$5(map);
});
/**
* Merges any number of `ServiceMap`s, returning a new `ServiceMap` containing the services of all.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
* import * as assert from "node:assert"
*
* const Port = ServiceMap.Service<{ PORT: number }>("Port")
* const Timeout = ServiceMap.Service<{ TIMEOUT: number }>("Timeout")
* const Host = ServiceMap.Service<{ HOST: string }>("Host")
*
* const firstServiceMap = ServiceMap.make(Port, { PORT: 8080 })
* const secondServiceMap = ServiceMap.make(Timeout, { TIMEOUT: 5000 })
* const thirdServiceMap = ServiceMap.make(Host, { HOST: "localhost" })
*
* const Services = ServiceMap.mergeAll(
*   firstServiceMap,
*   secondServiceMap,
*   thirdServiceMap
* )
*
* assert.deepStrictEqual(ServiceMap.get(Services, Port), { PORT: 8080 })
* assert.deepStrictEqual(ServiceMap.get(Services, Timeout), { TIMEOUT: 5000 })
* assert.deepStrictEqual(ServiceMap.get(Services, Host), { HOST: "localhost" })
* ```
*
* @since 3.12.0
*/
const mergeAll$1 = (...ctxs) => {
	const map = /* @__PURE__ */ new Map();
	for (let i = 0; i < ctxs.length; i++) ctxs[i].mapUnsafe.forEach((value, key) => {
		map.set(key, value);
	});
	return makeUnsafe$5(map);
};
/**
* Creates a service map key with a default value.
*
* **Details**
*
* `ServiceMap.Reference` allows you to create a key that can hold a value. You
* can provide a default value for the service, which will automatically be used
* when the context is accessed, or override it with a custom implementation
* when needed.
*
* @example
* ```ts
* import { ServiceMap } from "effect"
*
* // Create a reference with a default value
* const LoggerRef = ServiceMap.Reference("Logger", {
*   defaultValue: () => ({ log: (msg: string) => console.log(msg) })
* })
*
* // The reference provides the default value when accessed from an empty context
* const services = ServiceMap.empty()
* const logger = ServiceMap.get(services, LoggerRef)
*
* // You can also override the default value
* const customServices = ServiceMap.make(LoggerRef, {
*   log: (msg: string) => `Custom: ${msg}`
* })
* const customLogger = ServiceMap.get(customServices, LoggerRef)
* ```
*
* @since 4.0.0
* @category References
*/
const Reference = Service;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Scheduler.js
/**
* @since 4.0.0
* @category references
*/
const Scheduler = /* @__PURE__ */ Reference("effect/Scheduler", { defaultValue: () => new MixedScheduler() });
const setImmediate = "setImmediate" in globalThis ? (f) => {
	const timer = globalThis.setImmediate(f);
	return () => globalThis.clearImmediate(timer);
} : (f) => {
	const timer = setTimeout(f, 0);
	return () => clearTimeout(timer);
};
var PriorityBuckets = class {
	buckets = [];
	scheduleTask(task, priority) {
		const buckets = this.buckets;
		const len = buckets.length;
		let bucket;
		let index = 0;
		for (; index < len; index++) {
			if (buckets[index][0] > priority) break;
			bucket = buckets[index];
		}
		if (bucket && bucket[0] === priority) bucket[1].push(task);
		else if (index === len) buckets.push([priority, [task]]);
		else buckets.splice(index, 0, [priority, [task]]);
	}
	drain() {
		const buckets = this.buckets;
		this.buckets = [];
		return buckets;
	}
};
/**
* A scheduler implementation that provides efficient task scheduling
* with support for both synchronous and asynchronous execution modes.
*
* Features:
* - Batches tasks for efficient execution
* - Supports priority-based task scheduling
* - Configurable execution mode (sync/async)
* - Automatic yielding based on operation count
* - Optimized for high-throughput scenarios
*
* @example
* ```ts
* import { MixedScheduler } from "effect/Scheduler"
*
* // Create a mixed scheduler with async execution (default)
* const asyncScheduler = new MixedScheduler("async")
*
* // Create a mixed scheduler with sync execution
* const syncScheduler = new MixedScheduler("sync")
*
* // Schedule tasks with different priorities
* asyncScheduler.scheduleTask(() => console.log("High priority task"), 10)
* asyncScheduler.scheduleTask(() => console.log("Normal priority task"), 0)
* asyncScheduler.scheduleTask(() => console.log("Low priority task"), -1)
*
* // For sync scheduler, you can flush tasks immediately
* syncScheduler.scheduleTask(() => console.log("Task 1"), 0)
* syncScheduler.scheduleTask(() => console.log("Task 2"), 0)
*
* // Force flush all pending tasks in sync mode
* syncScheduler.flush()
* // Output: "Task 1", "Task 2"
*
* // Check execution mode
* console.log(asyncScheduler.executionMode) // "async"
* console.log(syncScheduler.executionMode) // "sync"
* ```
*
* @since 2.0.0
* @category schedulers
*/
var MixedScheduler = class {
	tasks = /* @__PURE__ */ new PriorityBuckets();
	running = void 0;
	executionMode;
	setImmediate;
	constructor(executionMode = "async", setImmediateFn = setImmediate) {
		this.executionMode = executionMode;
		this.setImmediate = setImmediateFn;
	}
	/**
	* @since 2.0.0
	*/
	scheduleTask(task, priority) {
		this.tasks.scheduleTask(task, priority);
		if (this.running === void 0) this.running = this.setImmediate(this.afterScheduled);
	}
	/**
	* @since 2.0.0
	*/
	afterScheduled = () => {
		this.running = void 0;
		this.runTasks();
	};
	/**
	* @since 2.0.0
	*/
	runTasks() {
		const buckets = this.tasks.drain();
		for (let i = 0; i < buckets.length; i++) {
			const toRun = buckets[i][1];
			for (let j = 0; j < toRun.length; j++) toRun[j]();
		}
	}
	/**
	* @since 2.0.0
	*/
	shouldYield(fiber) {
		return fiber.currentOpCount >= fiber.maxOpsBeforeYield;
	}
	/**
	* @since 2.0.0
	*/
	flush() {
		while (this.tasks.buckets.length > 0) {
			if (this.running !== void 0) {
				this.running();
				this.running = void 0;
			}
			this.runTasks();
		}
	}
};
/**
* A service reference that controls the maximum number of operations a fiber
* can perform before yielding control back to the scheduler. This helps
* prevent long-running fibers from monopolizing the execution thread.
*
* The default value is 2048 operations, which provides a good balance between
* performance and fairness in concurrent execution.
*
* @example
* ```ts
* import { Effect } from "effect"
* import { MaxOpsBeforeYield } from "effect/Scheduler"
*
* // Configure a fiber to yield more frequently
* const program = Effect.gen(function*() {
*   // Get current max ops setting (default is 2048)
*   const currentMax = yield* MaxOpsBeforeYield
*   yield* Effect.log(`Default max ops before yield: ${currentMax}`)
*
*   // Run with reduced max ops for more frequent yielding
*   return yield* Effect.provideService(
*     Effect.gen(function*() {
*       const maxOps = yield* MaxOpsBeforeYield
*       yield* Effect.log(`Max ops before yield: ${maxOps}`)
*
*       // Run a compute-intensive task that will yield frequently
*       let result = 0
*       for (let i = 0; i < 10000; i++) {
*         result += i
*         // This will cause yielding every 100 operations
*         yield* Effect.sync(() => result)
*       }
*       return result
*     }),
*     MaxOpsBeforeYield,
*     100
*   )
* })
*
* // Configure for high-performance scenarios
* const highPerformanceProgram = Effect.gen(function*() {
*   // Run with increased max ops for better performance (less yielding)
*   return yield* Effect.provideService(
*     Effect.gen(function*() {
*       const maxOps = yield* MaxOpsBeforeYield
*       yield* Effect.log(`High-performance max ops: ${maxOps}`)
*
*       // Run multiple concurrent tasks
*       const tasks = Array.from(
*         { length: 100 },
*         (_, i) =>
*           Effect.gen(function*() {
*             yield* Effect.sleep(`${i * 10} millis`)
*             return `Task ${i} completed`
*           })
*       )
*
*       return yield* Effect.all(tasks, { concurrency: "unbounded" })
*     }),
*     MaxOpsBeforeYield,
*     10000
*   )
* })
*
* // Configure for fair scheduling
* const fairSchedulingProgram = Effect.gen(function*() {
*   // Run with lower max ops for more frequent yielding
*   return yield* Effect.provideService(
*     Effect.gen(function*() {
*       const maxOps = yield* MaxOpsBeforeYield
*       yield* Effect.log(`Fair scheduling max ops: ${maxOps}`)
*
*       const longRunningTask = Effect.gen(function*() {
*         for (let i = 0; i < 1000; i++) {
*           yield* Effect.sync(() => Math.random())
*         }
*         return "Long task completed"
*       })
*
*       const quickTask = Effect.gen(function*() {
*         yield* Effect.sleep("10 millis")
*         return "Quick task completed"
*       })
*
*       // Both tasks will execute fairly due to frequent yielding
*       return yield* Effect.all([longRunningTask, quickTask], {
*         concurrency: "unbounded"
*       })
*     }),
*     MaxOpsBeforeYield,
*     50
*   )
* })
* ```
*
* @since 4.0.0
* @category references
*/
const MaxOpsBeforeYield = /* @__PURE__ */ Reference("effect/Scheduler/MaxOpsBeforeYield", { defaultValue: () => 2048 });

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Tracer.js
/**
* @since 2.0.0
* @category tags
* @example
* ```ts
* import { Tracer } from "effect"
*
* // The key used to identify parent spans in the service map
* console.log(Tracer.ParentSpanKey) // "effect/Tracer/ParentSpan"
* ```
*/
const ParentSpanKey = "effect/Tracer/ParentSpan";
/**
* @since 2.0.0
* @category tags
* @example
* ```ts
* import { Effect, Tracer } from "effect"
*
* // Access the parent span from the context
* const program = Effect.gen(function*() {
*   const parentSpan = yield* Effect.service(Tracer.ParentSpan)
*   console.log(`Parent span: ${parentSpan.spanId}`)
* })
* ```
*/
var ParentSpan = class extends Service()(ParentSpanKey) {};
/**
* @since 2.0.0
* @category constructors
*/
const make$7 = (options) => options;
/**
* @since 3.12.0
* @category references
* @example
* ```ts
* import { Effect, Tracer } from "effect"
*
* // Disable span propagation for a specific effect
* const program = Effect.gen(function*() {
*   yield* Effect.log("This will not propagate parent span")
* }).pipe(
*   Effect.provideService(Tracer.DisablePropagation, true)
* )
* ```
*/
const DisablePropagation = /* @__PURE__ */ Reference("effect/Tracer/DisablePropagation", { defaultValue: constFalse });
/**
* Reference for controlling the current trace level for dynamic filtering.
*
* @category references
* @since 4.0.0
*/
const CurrentTraceLevel = /* @__PURE__ */ Reference("effect/Tracer/CurrentTraceLevel", { defaultValue: () => "Info" });
/**
* Reference for setting the minimum trace level threshold. Spans and their
* descendants below this level will have their sampling decision forced to
* false, preventing them from being exported.
*
* @category references
* @since 4.0.0
*/
const MinimumTraceLevel = /* @__PURE__ */ Reference("effect/Tracer/MinimumTraceLevel", { defaultValue: () => "All" });
/**
* @since 4.0.0
* @category references
*/
const TracerKey = "effect/Tracer";
/**
* @since 4.0.0
* @category references
* @example
* ```ts
* import { Effect, Tracer } from "effect"
*
* // Access the current tracer from the context
* const program = Effect.gen(function*() {
*   const tracer = yield* Effect.service(Tracer.Tracer)
*   console.log("Using current tracer")
* })
*
* // Or use the built-in tracer effect
* const tracerEffect = Effect.gen(function*() {
*   const tracer = yield* Effect.tracer
*   console.log("Current tracer obtained")
* })
* ```
*/
const Tracer = /* @__PURE__ */ Reference(TracerKey, { defaultValue: () => make$7({ span: (options) => new NativeSpan(options) }) });
/**
* @since 4.0.0
* @category native tracer
*/
var NativeSpan = class {
	_tag = "Span";
	spanId;
	traceId = "native";
	sampled;
	name;
	parent;
	annotations;
	links;
	startTime;
	kind;
	status;
	attributes;
	events = [];
	constructor(options) {
		this.name = options.name;
		this.parent = options.parent;
		this.annotations = options.annotations;
		this.links = options.links;
		this.startTime = options.startTime;
		this.kind = options.kind;
		this.sampled = options.sampled;
		this.status = {
			_tag: "Started",
			startTime: options.startTime
		};
		this.attributes = /* @__PURE__ */ new Map();
		this.traceId = options.parent?.traceId ?? randomHexString(32);
		this.spanId = randomHexString(16);
	}
	end(endTime, exit) {
		this.status = {
			_tag: "Ended",
			endTime,
			exit,
			startTime: this.status.startTime
		};
	}
	attribute(key, value) {
		this.attributes.set(key, value);
	}
	event(name, startTime, attributes) {
		this.events.push([
			name,
			startTime,
			attributes ?? {}
		]);
	}
	addLinks(links) {
		this.links.push(...links);
	}
};
const randomHexString = /* @__PURE__ */ function() {
	const characters = "abcdef0123456789";
	const charactersLength = 16;
	return function(length) {
		let result = "";
		for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
	};
}();

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/References.js
/**
* This module provides a collection of reference implementations for commonly used
* Effect runtime configuration values. These references allow you to access and
* modify runtime behavior such as concurrency limits, scheduling policies,
* tracing configuration, and logging settings.
*
* References are special service instances that can be dynamically updated
* during runtime, making them ideal for configuration that may need to change
* based on application state or external conditions.
*
* @since 4.0.0
*/
/**
* Reference for controlling the current concurrency limit. Can be set to "unbounded"
* for unlimited concurrency or a specific number to limit concurrent operations.
*
* @example
* ```ts
* import { Effect, References } from "effect"
*
* const limitConcurrency = Effect.gen(function*() {
*   // Get current setting
*   const current = yield* References.CurrentConcurrency
*   console.log(current) // "unbounded" (default)
*
*   // Run with limited concurrency
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const limited = yield* References.CurrentConcurrency
*       console.log(limited) // 10
*     }),
*     References.CurrentConcurrency,
*     10
*   )
*
*   // Run with unlimited concurrency
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const unlimited = yield* References.CurrentConcurrency
*       console.log(unlimited) // "unbounded"
*     }),
*     References.CurrentConcurrency,
*     "unbounded"
*   )
* })
* ```
*
* @category references
* @since 4.0.0
*/
const CurrentConcurrency = /* @__PURE__ */ Reference("effect/References/CurrentConcurrency", { defaultValue: () => "unbounded" });
/**
* @since 4.0.0
* @category references
*/
const CurrentStackFrame = /* @__PURE__ */ Reference("effect/References/CurrentStackFrame", { defaultValue: constUndefined });
/**
* Reference for controlling whether tracing is enabled globally. When set to false,
* spans will not be registered with the tracer and tracing overhead is minimized.
*
* @example
* ```ts
* import { Effect, References } from "effect"
*
* const tracingControl = Effect.gen(function*() {
*   // Check if tracing is enabled (default is true)
*   const current = yield* References.TracerEnabled
*   console.log(current) // true
*
*   // Disable tracing globally
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const isEnabled = yield* References.TracerEnabled
*       console.log(isEnabled) // false
*
*       // Spans will not be traced in this context
*       yield* Effect.log("This will not be traced")
*     }),
*     References.TracerEnabled,
*     false
*   )
*
*   // Re-enable tracing
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const isEnabled = yield* References.TracerEnabled
*       console.log(isEnabled) // true
*
*       // All subsequent spans will be traced
*       yield* Effect.log("This will be traced")
*     }),
*     References.TracerEnabled,
*     true
*   )
* })
* ```
*
* @since 4.0.0
* @category references
*/
const TracerEnabled = /* @__PURE__ */ Reference("effect/References/TracerEnabled", { defaultValue: constTrue });
/**
* Reference for controlling whether trace timing is enabled globally. When set
* to false, spans will not contain timing information (trace time will always
* be set to zero).
*
* @example
* ```ts
* import { Effect, References } from "effect"
*
* const tracingControl = Effect.gen(function*() {
*   // Check if trace timing is enabled (default is true)
*   const current = yield* References.TracerTimingEnabled
*   console.log(current) // true
*
*   // Disable trace timing globally
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       // Spans will not having timing information in this context
*       const isEnabled = yield* References.TracerTimingEnabled
*       console.log(isEnabled) // false
*     }),
*     References.TracerTimingEnabled,
*     false
*   )
*
*   // Re-enable trace timing
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       // Spans will have timing information in this context
*       const isEnabled = yield* References.TracerTimingEnabled
*       console.log(isEnabled) // true
*     }),
*     References.TracerTimingEnabled,
*     true
*   )
* })
* ```
*
* @since 4.0.0
* @category references
*/
const TracerTimingEnabled = /* @__PURE__ */ Reference("effect/References/TracerTimingEnabled", { defaultValue: constTrue });
/**
* Reference for managing span annotations that are automatically added to all new spans.
* These annotations provide context and metadata that applies across multiple spans.
*
* @example
* ```ts
* import { Effect, References } from "effect"
*
* const spanAnnotationExample = Effect.gen(function*() {
*   // Get current annotations (empty by default)
*   const current = yield* References.TracerSpanAnnotations
*   console.log(current) // {}
*
*   // Set global span annotations
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       // Get current annotations
*       const annotations = yield* References.TracerSpanAnnotations
*       console.log(annotations) // { service: "user-service", version: "1.2.3", environment: "production" }
*
*       // All spans created will include these annotations
*       yield* Effect.gen(function*() {
*         // Add more specific annotations for this span
*         yield* Effect.annotateCurrentSpan("userId", "123")
*         yield* Effect.log("Processing user")
*       })
*     }),
*     References.TracerSpanAnnotations,
*     {
*       service: "user-service",
*       version: "1.2.3",
*       environment: "production"
*     }
*   )
*
*   // Clear annotations
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const annotations = yield* References.TracerSpanAnnotations
*       console.log(annotations) // {}
*     }),
*     References.TracerSpanAnnotations,
*     {}
*   )
* })
* ```
*
* @since 4.0.0
* @category references
*/
const TracerSpanAnnotations = /* @__PURE__ */ Reference("effect/References/TracerSpanAnnotations", { defaultValue: () => ({}) });
/**
* Reference for managing span links that are automatically added to all new spans.
* Span links connect related spans that are not in a parent-child relationship.
*
* @example
* ```ts
* import { Effect, References, Tracer } from "effect"
*
* const spanLinksExample = Effect.gen(function*() {
*   // Get current links (empty by default)
*   const current = yield* References.TracerSpanLinks
*   console.log(current.length) // 0
*
*   // Create an external span for the example
*   const externalSpan = Tracer.externalSpan({
*     spanId: "external-span-123",
*     traceId: "trace-456"
*   })
*
*   // Create span links
*   const spanLink: Tracer.SpanLink = {
*     span: externalSpan,
*     attributes: {
*       relationship: "follows-from",
*       priority: "high"
*     }
*   }
*
*   // Set global span links
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       // Get current links
*       const links = yield* References.TracerSpanLinks
*       console.log(links.length) // 1
*
*       // All new spans will include these links
*       yield* Effect.gen(function*() {
*         yield* Effect.log("This span will have linked spans")
*         return "operation complete"
*       })
*     }),
*     References.TracerSpanLinks,
*     [spanLink]
*   )
*
*   // Clear links
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const links = yield* References.TracerSpanLinks
*       console.log(links.length) // 0
*     }),
*     References.TracerSpanLinks,
*     []
*   )
* })
* ```
*
* @since 4.0.0
* @category references
*/
const TracerSpanLinks = /* @__PURE__ */ Reference("effect/References/TracerSpanLinks", { defaultValue: () => [] });
/**
* Reference for managing log annotations that are automatically added to all log entries.
* These annotations provide contextual metadata that appears in every log message.
*
* @example
* ```ts
* import { Console, Effect, References } from "effect"
*
* const logAnnotationExample = Effect.gen(function*() {
*   // Get current annotations (empty by default)
*   const current = yield* References.CurrentLogAnnotations
*   console.log(current) // {}
*
*   // Run with custom log annotations
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const annotations = yield* References.CurrentLogAnnotations
*       console.log(annotations) // { requestId: "req-123", userId: "user-456", version: "1.0.0" }
*
*       // All log entries will include these annotations
*       yield* Console.log("Starting operation")
*       yield* Console.info("Processing data")
*     }),
*     References.CurrentLogAnnotations,
*     {
*       requestId: "req-123",
*       userId: "user-456",
*       version: "1.0.0"
*     }
*   )
*
*   // Run with extended annotations
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const extended = yield* References.CurrentLogAnnotations
*       console.log(extended) // { requestId: "req-123", userId: "user-456", version: "1.0.0", operation: "data-sync", timestamp: 1234567890 }
*
*       yield* Console.log("Operation completed with extended context")
*     }),
*     References.CurrentLogAnnotations,
*     {
*       requestId: "req-123",
*       userId: "user-456",
*       version: "1.0.0",
*       operation: "data-sync",
*       timestamp: 1234567890
*     }
*   )
* })
* ```
*
* @since 4.0.0
* @category references
*/
const CurrentLogAnnotations = /* @__PURE__ */ Reference("effect/References/CurrentLogAnnotations", { defaultValue: () => ({}) });
/**
* Reference for controlling the current log level for dynamic filtering.
*
* @example
* ```ts
* import { Console, Effect, References } from "effect"
*
* const dynamicLogging = Effect.gen(function*() {
*   // Get current log level (default is "Info")
*   const current = yield* References.CurrentLogLevel
*   console.log(current) // "Info"
*
*   // Set log level to Debug for detailed logging
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const level = yield* References.CurrentLogLevel
*       console.log(level) // "Debug"
*       yield* Console.debug("This debug message will be shown")
*     }),
*     References.CurrentLogLevel,
*     "Debug"
*   )
*
*   // Change to Error level to reduce noise
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const level = yield* References.CurrentLogLevel
*       console.log(level) // "Error"
*       yield* Console.info("This info message will be filtered out")
*       yield* Console.error("This error message will be shown")
*     }),
*     References.CurrentLogLevel,
*     "Error"
*   )
* })
* ```
*
* @category references
* @since 4.0.0
*/
const CurrentLogLevel = /* @__PURE__ */ Reference("effect/References/CurrentLogLevel", { defaultValue: () => "Info" });
/**
* Reference for setting the minimum log level threshold. Log entries below this
* level will be filtered out completely.
*
* @example
* ```ts
* import { Console, Effect, References } from "effect"
*
* const configureMinimumLogging = Effect.gen(function*() {
*   // Get current minimum level (default is "Info")
*   const current = yield* References.MinimumLogLevel
*   console.log(current) // "Info"
*
*   // Set minimum level to Warn - Debug and Info will be filtered
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const minLevel = yield* References.MinimumLogLevel
*       console.log(minLevel) // "Warn"
*
*       // These won't be processed at all
*       yield* Console.debug("Debug message") // Filtered out
*       yield* Console.info("Info message") // Filtered out
*
*       // These will be processed
*       yield* Console.warn("Warning message") // Shown
*       yield* Console.error("Error message") // Shown
*     }),
*     References.MinimumLogLevel,
*     "Warn"
*   )
*
*   // Reset to default Info level
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const minLevel = yield* References.MinimumLogLevel
*       console.log(minLevel) // "Info"
*
*       // Now info messages will be processed
*       yield* Console.info("Info message") // Shown
*     }),
*     References.MinimumLogLevel,
*     "Info"
*   )
* })
* ```
*
* @category references
* @since 4.0.0
*/
const MinimumLogLevel = /* @__PURE__ */ Reference("effect/References/MinimumLogLevel", { defaultValue: () => "Info" });
/**
* Reference for managing log spans that track the duration and hierarchy of operations.
* Each span represents a labeled time period for performance analysis and debugging.
*
* @example
* ```ts
* import { Console, Effect, References } from "effect"
*
* const logSpanExample = Effect.gen(function*() {
*   // Get current spans (empty by default)
*   const current = yield* References.CurrentLogSpans
*   console.log(current.length) // 0
*
*   // Add a log span manually
*   const startTime = Date.now()
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       // Simulate some work
*       yield* Effect.sleep("100 millis")
*       yield* Console.log("Database operation in progress")
*
*       const spans = yield* References.CurrentLogSpans
*       console.log("Active spans:", spans.map(([label]) => label)) // ["database-connection"]
*     }),
*     References.CurrentLogSpans,
*     [["database-connection", startTime]]
*   )
*
*   // Add another span
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const spans = yield* References.CurrentLogSpans
*       console.log("Active spans:", spans.map(([label]) => label)) // ["database-connection", "data-processing"]
*
*       yield* Console.log("Multiple operations in progress")
*     }),
*     References.CurrentLogSpans,
*     [
*       ["database-connection", startTime],
*       ["data-processing", Date.now()]
*     ]
*   )
*
*   // Clear spans when operations complete
*   yield* Effect.provideService(
*     Effect.gen(function*() {
*       const spans = yield* References.CurrentLogSpans
*       console.log("Active spans:", spans.length) // 0
*     }),
*     References.CurrentLogSpans,
*     []
*   )
* })
* ```
*
* @since 4.0.0
* @category references
*/
const CurrentLogSpans = /* @__PURE__ */ Reference("effect/References/CurrentLogSpans", { defaultValue: () => [] });

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/metric.js
/** @internal */
const FiberRuntimeMetricsKey = "effect/observability/Metric/FiberRuntimeMetricsKey";

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/tracer.js
/** @internal */
const addSpanStackTrace = (options) => {
	if (options?.captureStackTrace === false) return options;
	else if (options?.captureStackTrace !== void 0 && typeof options.captureStackTrace !== "boolean") return options;
	const limit = Error.stackTraceLimit;
	Error.stackTraceLimit = 3;
	const traceError = /* @__PURE__ */ new Error();
	Error.stackTraceLimit = limit;
	return {
		...options,
		captureStackTrace: spanCleaner(() => traceError.stack)
	};
};
/** @internal */
const makeStackCleaner = (line) => (stack) => {
	let cache;
	return () => {
		if (cache !== void 0) return cache;
		const trace = stack();
		if (!trace) return void 0;
		const lines = trace.split("\n");
		if (lines[line] !== void 0) {
			cache = lines[line].trim();
			return cache;
		}
	};
};
const spanCleaner = /* @__PURE__ */ makeStackCleaner(3);

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/version.js
const version = "dev";

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/effect.js
/** @internal */
var Interrupt = class extends ReasonBase {
	fiberId;
	constructor(fiberId, annotations = constEmptyAnnotations) {
		super("Interrupt", annotations, "Interrupted");
		this.fiberId = fiberId;
	}
	toString() {
		return `Interrupt(${this.fiberId})`;
	}
	toJSON() {
		return {
			_tag: "Interrupt",
			fiberId: this.fiberId
		};
	}
	[symbol$2](that) {
		return isInterruptReason$1(that) && this.fiberId === that.fiberId && this.annotations === that.annotations;
	}
	[symbol$3]() {
		return combine$1(string$2(`${this._tag}:${this.fiberId}`))(random(this.annotations));
	}
};
/** @internal */
const makeInterruptReason$1 = (fiberId) => new Interrupt(fiberId);
/** @internal */
const causeInterrupt = (fiberId) => new CauseImpl([new Interrupt(fiberId)]);
/** @internal */
const hasFails$2 = (self) => self.reasons.some(isFailReason$1);
/** @internal */
const findFail$1 = (self) => {
	const reason = self.reasons.find(isFailReason$1);
	return reason ? succeed$3(reason) : fail$4(self);
};
/** @internal */
const findError$2 = (self) => {
	for (let i = 0; i < self.reasons.length; i++) {
		const reason = self.reasons[i];
		if (reason._tag === "Fail") return succeed$3(reason.error);
	}
	return fail$4(self);
};
/** @internal */
const findErrorOption$2 = /* @__PURE__ */ toOption(findError$2);
/** @internal */
const hasDies$2 = (self) => self.reasons.some(isDieReason$1);
/** @internal */
const findDie$1 = (self) => {
	const reason = self.reasons.find(isDieReason$1);
	return reason ? succeed$3(reason) : fail$4(self);
};
/** @internal */
const findDefect$2 = (self) => {
	const reason = self.reasons.find(isDieReason$1);
	return reason ? succeed$3(reason.defect) : fail$4(self);
};
/** @internal */
const hasInterrupts$2 = (self) => self.reasons.some(isInterruptReason$1);
/** @internal */
const findInterrupt$1 = (self) => {
	const reason = self.reasons.find(isInterruptReason$1);
	return reason ? succeed$3(reason) : fail$4(self);
};
/** @internal */
const causeFilterInterruptors = (self) => {
	let interruptors;
	for (let i = 0; i < self.reasons.length; i++) {
		const f = self.reasons[i];
		if (f._tag !== "Interrupt") continue;
		interruptors ??= /* @__PURE__ */ new Set();
		if (f.fiberId !== void 0) interruptors.add(f.fiberId);
	}
	return interruptors ? succeed$3(interruptors) : fail$4(self);
};
/** @internal */
const causeInterruptors = (self) => {
	const result = causeFilterInterruptors(self);
	return isFailure$3(result) ? emptySet : result.success;
};
const emptySet = /* @__PURE__ */ new Set();
/** @internal */
const hasInterruptsOnly$1 = (self) => self.reasons.every(isInterruptReason$1);
/** @internal */
const reasonAnnotations$1 = (self) => makeUnsafe$5(self.annotations);
/** @internal */
const causeAnnotations = (self) => {
	const map = /* @__PURE__ */ new Map();
	for (const f of self.reasons) if (f.annotations.size > 0) for (const [key, value] of f.annotations) map.set(key, value);
	return makeUnsafe$5(map);
};
/** @internal */
const causeCombine = /* @__PURE__ */ dual(2, (self, that) => {
	if (self.reasons.length === 0) return that;
	else if (that.reasons.length === 0) return self;
	const newCause = new CauseImpl(union$1(self.reasons, that.reasons));
	return equals$1(self, newCause) ? self : newCause;
});
/** @internal */
const causeMap = /* @__PURE__ */ dual(2, (self, f) => {
	let hasFail = false;
	const failures = self.reasons.map((failure) => {
		if (isFailReason$1(failure)) {
			hasFail = true;
			return new Fail(f(failure.error));
		}
		return failure;
	});
	return hasFail ? causeFromReasons(failures) : self;
});
/** @internal */
const causePartition = (self) => {
	const obj = {
		Fail: [],
		Die: [],
		Interrupt: []
	};
	for (let i = 0; i < self.reasons.length; i++) obj[self.reasons[i]._tag].push(self.reasons[i]);
	return obj;
};
/** @internal */
const causeSquash = (self) => {
	const partitioned = causePartition(self);
	if (partitioned.Fail.length > 0) return partitioned.Fail[0].error;
	else if (partitioned.Die.length > 0) return partitioned.Die[0].defect;
	else if (partitioned.Interrupt.length > 0) return new globalThis.Error("All fibers interrupted without error");
	return new globalThis.Error("Empty cause");
};
/** @internal */
const causePrettyErrors = (self) => {
	const errors = [];
	const interrupts = [];
	if (self.reasons.length === 0) return errors;
	const prevStackLimit = Error.stackTraceLimit;
	Error.stackTraceLimit = 1;
	for (const failure of self.reasons) {
		if (failure._tag === "Interrupt") {
			interrupts.push(failure);
			continue;
		}
		errors.push(causePrettyError(failure._tag === "Die" ? failure.defect : failure.error, failure.annotations));
	}
	if (errors.length === 0) {
		const cause = /* @__PURE__ */ new Error("The fiber was interrupted by:");
		cause.name = "InterruptCause";
		cause.stack = interruptCauseStack(cause, interrupts);
		const error = new globalThis.Error("All fibers interrupted without error", { cause });
		error.name = "InterruptError";
		error.stack = `${error.name}: ${error.message}`;
		errors.push(causePrettyError(error, interrupts[0].annotations));
	}
	Error.stackTraceLimit = prevStackLimit;
	return errors;
};
const causePrettyError = (original, annotations) => {
	const kind = typeof original;
	let error;
	if (original && kind === "object") {
		error = new globalThis.Error(causePrettyMessage(original), { cause: original.cause ? causePrettyError(original.cause) : void 0 });
		if (typeof original.name === "string") error.name = original.name;
		if (typeof original.stack === "string") error.stack = cleanErrorStack(original.stack, error, annotations);
		else {
			const stack = `${error.name}: ${error.message}`;
			error.stack = annotations ? addStackAnnotations(stack, annotations) : stack;
		}
		for (const key of Object.keys(original)) if (!(key in error)) error[key] = original[key];
	} else error = new globalThis.Error(!original ? `Unknown error: ${original}` : kind === "string" ? original : formatJson(original));
	return error;
};
const causePrettyMessage = (u) => {
	if (typeof u.message === "string") return u.message;
	else if (typeof u.toString === "function" && u.toString !== Object.prototype.toString && u.toString !== Array.prototype.toString) try {
		return u.toString();
	} catch {}
	return formatJson(u);
};
const locationRegExp = /\((.*)\)/g;
const cleanErrorStack = (stack, error, annotations) => {
	const message = `${error.name}: ${error.message}`;
	const lines = (stack.startsWith(message) ? stack.slice(message.length) : stack).split("\n");
	const out = [message];
	for (let i = 1; i < lines.length; i++) {
		if (/(?:Generator\.next|~effect\/Effect)/.test(lines[i])) break;
		out.push(lines[i]);
	}
	return annotations ? addStackAnnotations(out.join("\n"), annotations) : out.join("\n");
};
const addStackAnnotations = (stack, annotations) => {
	const frame = annotations?.get(StackTraceKey.key);
	if (frame) stack = `${stack}\n${currentStackTrace(frame)}`;
	return stack;
};
const interruptCauseStack = (error, interrupts) => {
	const out = [`${error.name}: ${error.message}`];
	for (const current of interrupts) {
		const fiberId = current.fiberId !== void 0 ? `#${current.fiberId}` : "unknown";
		const frame = current.annotations.get(InterruptorStackTrace.key);
		out.push(`    at fiber (${fiberId})`);
		if (frame) out.push(currentStackTrace(frame));
	}
	return out.join("\n");
};
const currentStackTrace = (frame) => {
	const out = [];
	let current = frame;
	let i = 0;
	while (current && i < 10) {
		const stack = current.stack();
		if (stack) {
			const locationMatchAll = stack.matchAll(locationRegExp);
			let match = false;
			for (const [, location] of locationMatchAll) {
				match = true;
				out.push(`    at ${current.name} (${location})`);
			}
			if (!match) out.push(`    at ${current.name} (${stack.replace(/^at /, "")})`);
		} else out.push(`    at ${current.name}`);
		current = current.parent;
		i++;
	}
	return out.join("\n");
};
/** @internal */
const causePretty = (cause) => causePrettyErrors(cause).map((e) => e.cause ? `${e.stack} {\n${renderErrorCause(e.cause, "  ")}\n}` : e.stack).join("\n");
const renderErrorCause = (cause, prefix) => {
	const lines = cause.stack.split("\n");
	let stack = `${prefix}[cause]: ${lines[0]}`;
	for (let i = 1, len = lines.length; i < len; i++) stack += `\n${prefix}${lines[i]}`;
	if (cause.cause) stack += ` {\n${renderErrorCause(cause.cause, `${prefix}  `)}\n${prefix}}`;
	return stack;
};
/** @internal */
const FiberTypeId = `~effect/Fiber/${version}`;
const fiberVariance = {
	_A: identity,
	_E: identity
};
const fiberIdStore = { id: 0 };
/** @internal */
const getCurrentFiber = () => globalThis[currentFiberTypeId];
const keepAlive = /* @__PURE__ */ (() => {
	let count = 0;
	let running = void 0;
	return {
		increment() {
			count++;
			running ??= globalThis.setInterval(constVoid, 2147483647);
		},
		decrement() {
			count--;
			if (count === 0 && running !== void 0) {
				globalThis.clearInterval(running);
				running = void 0;
			}
		}
	};
})();
/** @internal */
var FiberImpl = class {
	constructor(services, interruptible = true) {
		this[FiberTypeId] = fiberVariance;
		this.setServices(services);
		this.id = ++fiberIdStore.id;
		this.currentOpCount = 0;
		this.currentLoopCount = 0;
		this.interruptible = interruptible;
		this._stack = [];
		this._observers = [];
		this._exit = void 0;
		this._children = void 0;
		this._interruptedCause = void 0;
		this._yielded = void 0;
	}
	[FiberTypeId];
	id;
	interruptible;
	currentOpCount;
	currentLoopCount;
	_stack;
	_observers;
	_exit;
	_currentExit;
	_children;
	_interruptedCause;
	_yielded;
	services;
	currentScheduler;
	currentTracerContext;
	currentSpan;
	currentLogLevel;
	minimumLogLevel;
	currentStackFrame;
	runtimeMetrics;
	maxOpsBeforeYield;
	getRef(ref) {
		return getReferenceUnsafe(this.services, ref);
	}
	addObserver(cb) {
		if (this._exit) {
			cb(this._exit);
			return constVoid;
		}
		this._observers.push(cb);
		return () => {
			const index = this._observers.indexOf(cb);
			if (index >= 0) this._observers.splice(index, 1);
		};
	}
	interruptUnsafe(fiberId, annotations) {
		if (this._exit) return;
		let cause = causeInterrupt(fiberId);
		if (this.currentStackFrame) cause = causeAnnotate(cause, make$8(StackTraceKey, this.currentStackFrame));
		if (annotations) cause = causeAnnotate(cause, annotations);
		this._interruptedCause = this._interruptedCause ? causeCombine(this._interruptedCause, cause) : cause;
		if (this.interruptible) this.evaluate(failCause$2(this._interruptedCause));
	}
	pollUnsafe() {
		return this._exit;
	}
	evaluate(effect) {
		this.runtimeMetrics?.recordFiberStart(this.services);
		if (this._exit) return;
		else if (this._yielded !== void 0) {
			const yielded = this._yielded;
			this._yielded = void 0;
			yielded();
		}
		const exit = this.runLoop(effect);
		if (exit === Yield) return;
		const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
		if (interruptChildren !== void 0) return this.evaluate(flatMap$1(interruptChildren, () => exit));
		this._exit = exit;
		this.runtimeMetrics?.recordFiberEnd(this.services, this._exit);
		for (let i = 0; i < this._observers.length; i++) this._observers[i](exit);
		this._observers.length = 0;
	}
	runLoop(effect) {
		const prevFiber = globalThis[currentFiberTypeId];
		globalThis[currentFiberTypeId] = this;
		let yielding = false;
		let current = effect;
		this.currentOpCount = 0;
		const currentLoop = ++this.currentLoopCount;
		try {
			while (true) {
				this.currentOpCount++;
				if (!yielding && this.currentScheduler.shouldYield(this)) {
					yielding = true;
					const prev = current;
					current = flatMap$1(yieldNow$1, () => prev);
				}
				current = this.currentTracerContext ? this.currentTracerContext(current, this) : current[evaluate](this);
				if (currentLoop !== this.currentLoopCount) return Yield;
				else if (current === Yield) {
					const yielded = this._yielded;
					if (ExitTypeId in yielded) {
						this._yielded = void 0;
						return yielded;
					}
					return Yield;
				}
			}
		} catch (error) {
			if (!hasProperty(current, evaluate)) return exitDie(`Fiber.runLoop: Not a valid effect: ${String(current)}`);
			return this.runLoop(exitDie(error));
		} finally {
			globalThis[currentFiberTypeId] = prevFiber;
		}
	}
	getCont(symbol) {
		while (true) {
			const op = this._stack.pop();
			if (!op) return void 0;
			const cont = op[contAll] && op[contAll](this);
			if (cont) {
				cont[symbol] = cont;
				return cont;
			}
			if (op[symbol]) return op;
		}
	}
	yieldWith(value) {
		this._yielded = value;
		return Yield;
	}
	children() {
		return this._children ??= /* @__PURE__ */ new Set();
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	setServices(services) {
		this.services = services;
		this.currentScheduler = this.getRef(Scheduler);
		this.currentSpan = services.mapUnsafe.get(ParentSpanKey);
		this.currentLogLevel = this.getRef(CurrentLogLevel);
		this.minimumLogLevel = this.getRef(MinimumLogLevel);
		this.currentStackFrame = services.mapUnsafe.get(CurrentStackFrame.key);
		this.maxOpsBeforeYield = this.getRef(MaxOpsBeforeYield);
		this.runtimeMetrics = services.mapUnsafe.get(FiberRuntimeMetricsKey);
		const currentTracer = services.mapUnsafe.get(TracerKey);
		this.currentTracerContext = currentTracer ? currentTracer["context"] : void 0;
	}
	get currentSpanLocal() {
		return this.currentSpan?._tag === "Span" ? this.currentSpan : void 0;
	}
};
const fiberMiddleware = { interruptChildren: void 0 };
const fiberStackAnnotations = (fiber) => {
	if (!fiber.currentStackFrame) return void 0;
	const annotations = /* @__PURE__ */ new Map();
	annotations.set(StackTraceKey.key, fiber.currentStackFrame);
	return makeUnsafe$5(annotations);
};
const fiberInterruptChildren = (fiber) => {
	if (fiber._children === void 0 || fiber._children.size === 0) return;
	return fiberInterruptAll(fiber._children);
};
/** @internal */
const fiberAwait = (self) => {
	const impl = self;
	if (impl._exit) return succeed$2(impl._exit);
	return callback$1((resume) => {
		if (impl._exit) return resume(succeed$2(impl._exit));
		return sync$1(self.addObserver((exit) => resume(succeed$2(exit))));
	});
};
/** @internal */
const fiberAwaitAll = (self) => callback$1((resume) => {
	const iter = self[Symbol.iterator]();
	const exits = [];
	let cancel = void 0;
	function loop() {
		let result = iter.next();
		while (!result.done) {
			if (result.value._exit) {
				exits.push(result.value._exit);
				result = iter.next();
				continue;
			}
			cancel = result.value.addObserver((exit) => {
				exits.push(exit);
				loop();
			});
			return;
		}
		resume(succeed$2(exits));
	}
	loop();
	return sync$1(() => cancel?.());
});
/** @internal */
const fiberInterrupt = (self) => withFiber$1((fiber) => fiberInterruptAs(self, fiber.id));
/** @internal */
const fiberInterruptAs = /* @__PURE__ */ dual(2, (self, fiberId) => withFiber$1((parent) => {
	self.interruptUnsafe(fiberId, fiberStackAnnotations(parent));
	return asVoid$2(fiberAwait(self));
}));
/** @internal */
const fiberInterruptAll = (fibers) => withFiber$1((parent) => {
	const annotations = fiberStackAnnotations(parent);
	for (const fiber of fibers) fiber.interruptUnsafe(parent.id, annotations);
	return asVoid$2(fiberAwaitAll(fibers));
});
/** @internal */
const succeed$2 = exitSucceed;
/** @internal */
const failCause$2 = exitFailCause;
/** @internal */
const fail$3 = exitFail;
/** @internal */
const sync$1 = /* @__PURE__ */ makePrimitive({
	op: "Sync",
	[evaluate](fiber) {
		const value = this[args]();
		const cont = fiber.getCont(contA);
		return cont ? cont[contA](value, fiber) : fiber.yieldWith(exitSucceed(value));
	}
});
/** @internal */
const suspend$1 = /* @__PURE__ */ makePrimitive({
	op: "Suspend",
	[evaluate](_fiber) {
		return this[args]();
	}
});
/** @internal */
const fromYieldable$1 = (yieldable) => yieldable.asEffect();
/** @internal */
const fromOption$1 = fromYieldable$1;
/** @internal */
const fromResult$1 = fromYieldable$1;
/** @internal */
const fromNullishOr$1 = (value) => value == null ? fail$3(new NoSuchElementError$1()) : succeed$2(value);
/** @internal */
const yieldNowWith$1 = /* @__PURE__ */ makePrimitive({
	op: "Yield",
	[evaluate](fiber) {
		let resumed = false;
		fiber.currentScheduler.scheduleTask(() => {
			if (resumed) return;
			fiber.evaluate(exitVoid);
		}, this[args] ?? 0);
		return fiber.yieldWith(() => {
			resumed = true;
		});
	}
});
/** @internal */
const yieldNow$1 = /* @__PURE__ */ yieldNowWith$1(0);
/** @internal */
const succeedSome$1 = (a) => succeed$2(some(a));
/** @internal */
const succeedNone$1 = /* @__PURE__ */ succeed$2(/* @__PURE__ */ none());
/** @internal */
const failCauseSync$1 = (evaluate) => suspend$1(() => failCause$2(internalCall(evaluate)));
/** @internal */
const die$3 = (defect) => exitDie(defect);
/** @internal */
const failSync$1 = (error) => suspend$1(() => fail$3(internalCall(error)));
/** @internal */
const void_$3 = /* @__PURE__ */ succeed$2(void 0);
/** @internal */
const try_$1 = (options) => suspend$1(() => {
	try {
		return succeed$2(internalCall(options.try));
	} catch (err) {
		return fail$3(internalCall(() => options.catch(err)));
	}
});
/** @internal */
const promise$1 = (evaluate) => callbackOptions(function(resume, signal) {
	internalCall(() => evaluate(signal)).then((a) => resume(succeed$2(a)), (e) => resume(die$3(e)));
}, evaluate.length !== 0);
/** @internal */
const tryPromise$1 = (options) => {
	const f = typeof options === "function" ? options : options.try;
	const catcher = typeof options === "function" ? (cause) => new UnknownError$1(cause, "An error occurred in Effect.tryPromise") : options.catch;
	return callbackOptions(function(resume, signal) {
		try {
			internalCall(() => f(signal)).then((a) => resume(succeed$2(a)), (e) => resume(fail$3(internalCall(() => catcher(e)))));
		} catch (err) {
			resume(fail$3(internalCall(() => catcher(err))));
		}
	}, eval.length !== 0);
};
/** @internal */
const withFiberId = (f) => withFiber$1((fiber) => f(fiber.id));
/** @internal */
const fiber$1 = /* @__PURE__ */ withFiber$1(succeed$2);
/** @internal */
const fiberId$1 = /* @__PURE__ */ withFiberId(succeed$2);
const callbackOptions = /* @__PURE__ */ makePrimitive({
	op: "Async",
	single: false,
	[evaluate](fiber) {
		const register = internalCall(() => this[args][0].bind(fiber.currentScheduler));
		let resumed = false;
		let yielded = false;
		const controller = this[args][1] ? new AbortController() : void 0;
		const onCancel = register((effect) => {
			if (resumed) return;
			resumed = true;
			if (yielded) fiber.evaluate(effect);
			else yielded = effect;
		}, controller?.signal);
		if (yielded !== false) return yielded;
		yielded = true;
		keepAlive.increment();
		fiber._yielded = () => {
			resumed = true;
			keepAlive.decrement();
		};
		if (controller === void 0 && onCancel === void 0) return Yield;
		fiber._stack.push(asyncFinalizer(() => {
			resumed = true;
			controller?.abort();
			return onCancel ?? exitVoid;
		}));
		return Yield;
	}
});
const asyncFinalizer = /* @__PURE__ */ makePrimitive({
	op: "AsyncFinalizer",
	[contAll](fiber) {
		if (fiber.interruptible) {
			fiber.interruptible = false;
			fiber._stack.push(setInterruptibleTrue);
		}
	},
	[contE](cause, _fiber) {
		return hasInterrupts$2(cause) ? flatMap$1(this[args](), () => failCause$2(cause)) : failCause$2(cause);
	}
});
/** @internal */
const callback$1 = (register) => callbackOptions(register, register.length >= 2);
/** @internal */
const never$2 = /* @__PURE__ */ callback$1(constVoid);
/** @internal */
const gen$1 = (...args) => suspend$1(() => fromIteratorUnsafe(args.length === 1 ? args[0]() : args[1].call(args[0].self)));
/** @internal */
const fnUntraced$1 = (body, ...pipeables) => {
	return pipeables.length === 0 ? function() {
		return suspend$1(() => fromIteratorUnsafe(body.apply(this, arguments)));
	} : function() {
		let effect = suspend$1(() => fromIteratorUnsafe(body.apply(this, arguments)));
		for (let i = 0; i < pipeables.length; i++) effect = pipeables[i](effect, ...arguments);
		return effect;
	};
};
const fnStackCleaner = /* @__PURE__ */ makeStackCleaner(2);
/** @internal */
const fn$1 = function() {
	const nameFirst = typeof arguments[0] === "string";
	const name = nameFirst ? arguments[0] : "Effect.fn";
	const spanOptions = nameFirst ? arguments[1] : void 0;
	const prevLimit = globalThis.Error.stackTraceLimit;
	globalThis.Error.stackTraceLimit = 2;
	const defError = new globalThis.Error();
	globalThis.Error.stackTraceLimit = prevLimit;
	if (nameFirst) return (body, ...pipeables) => makeFn(name, body, defError, pipeables, nameFirst, spanOptions);
	return makeFn(name, arguments[0], defError, Array.prototype.slice.call(arguments, 1), nameFirst, spanOptions);
};
const makeFn = (name, bodyOrOptions, defError, pipeables, addSpan, spanOptions) => {
	const body = typeof bodyOrOptions === "function" ? bodyOrOptions : pipeables.pop().bind(bodyOrOptions.self);
	return function(...args) {
		let result = suspend$1(() => {
			const iter = body.apply(this, arguments);
			return isEffect$1(iter) ? iter : fromIteratorUnsafe(iter);
		});
		for (let i = 0; i < pipeables.length; i++) result = pipeables[i](result, ...args);
		if (!isEffect$1(result)) return result;
		const prevLimit = globalThis.Error.stackTraceLimit;
		globalThis.Error.stackTraceLimit = 2;
		const callError = new globalThis.Error();
		globalThis.Error.stackTraceLimit = prevLimit;
		return updateService$1(addSpan ? useSpan$1(name, spanOptions, (span) => provideParentSpan(result, span)) : result, CurrentStackFrame, (prev) => ({
			name,
			stack: fnStackCleaner(() => callError.stack),
			parent: {
				name: `${name} (definition)`,
				stack: fnStackCleaner(() => defError.stack),
				parent: prev
			}
		}));
	};
};
/** @internal */
const fnUntracedEager$1 = (body, ...pipeables) => pipeables.length === 0 ? function() {
	return fromIteratorEagerUnsafe(() => body.apply(this, arguments));
} : function() {
	let effect = fromIteratorEagerUnsafe(() => body.apply(this, arguments));
	for (const pipeable of pipeables) effect = pipeable(effect);
	return effect;
};
const fromIteratorEagerUnsafe = (evaluate) => {
	try {
		const iterator = evaluate();
		let value = void 0;
		while (true) {
			const state = iterator.next(value);
			if (state.done) return succeed$2(state.value);
			const effect = state.value.asEffect();
			const primitive = effect;
			if (primitive && primitive._tag === "Success") {
				value = primitive.value;
				continue;
			} else if (primitive && primitive._tag === "Failure") return effect;
			else {
				let isFirstExecution = true;
				return suspend$1(() => {
					if (isFirstExecution) {
						isFirstExecution = false;
						return flatMap$1(effect, (value) => fromIteratorUnsafe(iterator, value));
					} else return suspend$1(() => fromIteratorUnsafe(evaluate()));
				});
			}
		}
	} catch (error) {
		return die$3(error);
	}
};
const fromIteratorUnsafe = /* @__PURE__ */ makePrimitive({
	op: "Iterator",
	single: false,
	[contA](value, fiber) {
		const iter = this[args][0];
		while (true) {
			const state = iter.next(value);
			if (state.done) return succeed$2(state.value);
			const eff = state.value.asEffect();
			if (!effectIsExit(eff)) {
				fiber._stack.push(this);
				return eff;
			} else if (eff._tag === "Failure") return eff;
			value = eff.value;
		}
	},
	[evaluate](fiber) {
		return this[contA](this[args][1], fiber);
	}
});
/** @internal */
const as$1 = /* @__PURE__ */ dual(2, (self, value) => {
	const b = succeed$2(value);
	return flatMap$1(self, (_) => b);
});
/** @internal */
const asSome$1 = (self) => map$3(self, some);
/** @internal */
const flip$2 = (self) => matchEffect$2(self, {
	onFailure: succeed$2,
	onSuccess: fail$3
});
/** @internal */
const andThen$1 = /* @__PURE__ */ dual(2, (self, f) => flatMap$1(self, (a) => isEffect$1(f) ? f : internalCall(() => f(a))));
/** @internal */
const tap$1 = /* @__PURE__ */ dual(2, (self, f) => flatMap$1(self, (a) => as$1(isEffect$1(f) ? f : internalCall(() => f(a)), a)));
/** @internal */
const asVoid$2 = (self) => flatMap$1(self, (_) => exitVoid);
/** @internal */
const sandbox$1 = (self) => catchCause$1(self, fail$3);
/** @internal */
const raceAll$1 = (all, options) => withFiber$1((parent) => callback$1((resume) => {
	const effects = fromIterable(all);
	const len = effects.length;
	let doneCount = 0;
	let done = false;
	const fibers = /* @__PURE__ */ new Set();
	const failures = [];
	const onExit = (exit, fiber, i) => {
		doneCount++;
		if (exit._tag === "Failure") {
			failures.push(...exit.cause.reasons);
			if (doneCount >= len) resume(failCause$2(causeFromReasons(failures)));
			return;
		}
		const isWinner = !done;
		done = true;
		resume(fibers.size === 0 ? exit : flatMap$1(uninterruptible$1(fiberInterruptAll(fibers)), () => exit));
		if (isWinner && options?.onWinner) options.onWinner({
			fiber,
			index: i,
			parentFiber: parent
		});
	};
	for (let i = 0; i < len; i++) {
		const fiber = forkUnsafe$1(parent, effects[i], true, true, false);
		fibers.add(fiber);
		fiber.addObserver((exit) => {
			fibers.delete(fiber);
			onExit(exit, fiber, i);
		});
		if (done) break;
	}
	return fiberInterruptAll(fibers);
}));
/** @internal */
const raceAllFirst$1 = (all, options) => withFiber$1((parent) => callback$1((resume) => {
	let done = false;
	const fibers = /* @__PURE__ */ new Set();
	const onExit = (exit) => {
		done = true;
		resume(fibers.size === 0 ? exit : flatMap$1(uninterruptible$1(fiberInterruptAll(fibers)), () => exit));
	};
	let i = 0;
	for (const effect of all) {
		if (done) break;
		const index = i++;
		const fiber = forkUnsafe$1(parent, effect, true, true, false);
		fibers.add(fiber);
		fiber.addObserver((exit) => {
			fibers.delete(fiber);
			const isWinner = !done;
			onExit(exit);
			if (isWinner && options?.onWinner) options.onWinner({
				fiber,
				index,
				parentFiber: parent
			});
		});
	}
	return fiberInterruptAll(fibers);
}));
/** @internal */
const race$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[1]), (self, that, options) => raceAll$1([self, that], options));
/** @internal */
const raceFirst$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[1]), (self, that, options) => raceAllFirst$1([self, that], options));
/** @internal */
const flatMap$1 = /* @__PURE__ */ dual(2, (self, f) => {
	const onSuccess = Object.create(OnSuccessProto);
	onSuccess[args] = self;
	onSuccess[contA] = f.length !== 1 ? (a) => f(a) : f;
	return onSuccess;
});
const OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
	op: "OnSuccess",
	[evaluate](fiber) {
		fiber._stack.push(this);
		return this[args];
	}
});
/** @internal */
const matchCauseEffectEager$1 = /* @__PURE__ */ dual(2, (self, options) => {
	if (effectIsExit(self)) return self._tag === "Success" ? options.onSuccess(self.value) : options.onFailure(self.cause);
	return matchCauseEffect$1(self, options);
});
/** @internal */
const effectIsExit = (effect) => ExitTypeId in effect;
/** @internal */
const flatMapEager$1 = /* @__PURE__ */ dual(2, (self, f) => {
	if (effectIsExit(self)) return self._tag === "Success" ? f(self.value) : self;
	return flatMap$1(self, f);
});
/** @internal */
const flatten$1 = (self) => flatMap$1(self, identity);
/** @internal */
const map$3 = /* @__PURE__ */ dual(2, (self, f) => flatMap$1(self, (a) => succeed$2(internalCall(() => f(a)))));
/** @internal */
const mapEager$1 = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMap(self, f) : map$3(self, f));
/** @internal */
const mapErrorEager$1 = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMapError(self, f) : mapError$2(self, f));
/** @internal */
const mapBothEager$1 = /* @__PURE__ */ dual(2, (self, options) => effectIsExit(self) ? exitMapBoth(self, options) : mapBoth$2(self, options));
/** @internal */
const catchEager$1 = /* @__PURE__ */ dual(2, (self, f) => {
	if (effectIsExit(self)) {
		if (self._tag === "Success") return self;
		const error = findError$2(self.cause);
		if (isFailure$3(error)) return self;
		return f(error.success);
	}
	return catch_$1(self, f);
});
/** @internal */
const exitInterrupt = (fiberId) => exitFailCause(causeInterrupt(fiberId));
/** @internal */
const exitIsSuccess = (self) => self._tag === "Success";
/** @internal */
const exitFilterSuccess = (self) => self._tag === "Success" ? succeed$3(self) : fail$4(self);
/** @internal */
const exitFilterValue = (self) => self._tag === "Success" ? succeed$3(self.value) : fail$4(self);
/** @internal */
const exitIsFailure = (self) => self._tag === "Failure";
/** @internal */
const exitFilterFailure = (self) => self._tag === "Failure" ? succeed$3(self) : fail$4(self);
/** @internal */
const exitFilterCause = (self) => self._tag === "Failure" ? succeed$3(self.cause) : fail$4(self);
/** @internal */
const exitFindError = /* @__PURE__ */ composePassthrough(exitFilterCause, findError$2);
/** @internal */
const exitFindDefect = /* @__PURE__ */ composePassthrough(exitFilterCause, findDefect$2);
/** @internal */
const exitHasInterrupts = (self) => self._tag === "Failure" && hasInterrupts$2(self.cause);
/** @internal */
const exitHasDies = (self) => self._tag === "Failure" && hasDies$2(self.cause);
/** @internal */
const exitHasFails = (self) => self._tag === "Failure" && hasFails$2(self.cause);
/** @internal */
const exitVoid = /* @__PURE__ */ exitSucceed(void 0);
/** @internal */
const exitMap = /* @__PURE__ */ dual(2, (self, f) => self._tag === "Success" ? exitSucceed(f(self.value)) : self);
/** @internal */
const exitMapError = /* @__PURE__ */ dual(2, (self, f) => {
	if (self._tag === "Success") return self;
	const error = findError$2(self.cause);
	if (isFailure$3(error)) return self;
	return exitFail(f(error.success));
});
/** @internal */
const exitMapBoth = /* @__PURE__ */ dual(2, (self, options) => {
	if (self._tag === "Success") return exitSucceed(options.onSuccess(self.value));
	const error = findError$2(self.cause);
	if (isFailure$3(error)) return self;
	return exitFail(options.onFailure(error.success));
});
/** @internal */
const exitAs = /* @__PURE__ */ dual(2, (self, b) => exitIsSuccess(self) ? exitSucceed(b) : self);
/** @internal */
const exitMatch = /* @__PURE__ */ dual(2, (self, options) => exitIsSuccess(self) ? options.onSuccess(self.value) : options.onFailure(self.cause));
/** @internal */
const exitAsVoid = /* @__PURE__ */ exitAs(void 0);
/** @internal */
const exitAsVoidAll = (exits) => {
	const failures = [];
	for (const exit of exits) if (exit._tag === "Failure") failures.push(...exit.cause.reasons);
	return failures.length === 0 ? exitVoid : exitFailCause(causeFromReasons(failures));
};
/** @internal */
const exitGetSuccess = (self) => exitIsSuccess(self) ? some(self.value) : none();
/** @internal */
const exitGetCause = (self) => exitIsFailure(self) ? some(self.cause) : none();
/** @internal */
const exitFindErrorOption = (self) => {
	const error = exitFindError(self);
	return isFailure$3(error) ? none() : some(error.success);
};
/** @internal */
const service$1 = fromYieldable$1;
/** @internal */
const serviceOption$1 = (service) => withFiber$1((fiber) => succeed$2(getOption(fiber.services, service)));
/** @internal */
const serviceOptional = (service) => withFiber$1((fiber) => fiber.services.mapUnsafe.has(service.key) ? succeed$2(getUnsafe(fiber.services, service)) : fail$3(new NoSuchElementError$1()));
/** @internal */
const updateServices$1 = /* @__PURE__ */ dual(2, (self, f) => withFiber$1((fiber) => {
	const prev = fiber.services;
	const nextServices = f(prev);
	if (prev === nextServices) return self;
	fiber.setServices(nextServices);
	const newServices = /* @__PURE__ */ new Map();
	for (const [key, value] of fiber.services.mapUnsafe) if (!prev.mapUnsafe.has(key) || value !== prev.mapUnsafe.get(key)) newServices.set(key, value);
	return onExitPrimitive$1(self, () => {
		const map = new Map(fiber.services.mapUnsafe);
		for (const [key, value] of newServices) {
			if (value !== map.get(key)) continue;
			if (prev.mapUnsafe.has(key)) map.set(key, prev.mapUnsafe.get(key));
			else map.delete(key);
		}
		fiber.setServices(makeUnsafe$5(map));
	});
}));
/** @internal */
const updateService$1 = /* @__PURE__ */ dual(3, (self, service, f) => withFiber$1((fiber) => {
	const prev = getUnsafe(fiber.services, service);
	const next = f(prev);
	if (prev === next) return self;
	fiber.setServices(add$2(fiber.services, service, next));
	return onExit$1(self, () => sync$1(() => fiber.setServices(add$2(fiber.services, service, prev))));
}));
/** @internal */
const services$1 = () => getServiceMap;
const getServiceMap = /* @__PURE__ */ withFiber$1((fiber) => succeed$2(fiber.services));
/** @internal */
const servicesWith$1 = (f) => withFiber$1((fiber) => f(fiber.services));
/** @internal */
const provideServices$1 = /* @__PURE__ */ dual(2, (self, services) => {
	if (effectIsExit(self)) return self;
	return updateServices$1(self, merge(services));
});
/** @internal */
const provideService$1 = function() {
	if (arguments.length === 1) return dual(2, (self, impl) => provideServiceImpl(self, arguments[0], impl));
	return dual(3, (self, service, impl) => provideServiceImpl(self, service, impl)).apply(this, arguments);
};
const provideServiceImpl = (self, service, implementation) => withFiber$1((fiber) => {
	const prev = getOption(fiber.services, service);
	if (prev._tag === "Some" && prev.value === implementation) return self;
	fiber.setServices(add$2(fiber.services, service, implementation));
	return onExit$1(self, () => sync$1(() => fiber.setServices(addOrOmit(fiber.services, service, prev))));
});
/** @internal */
const provideServiceEffect$1 = /* @__PURE__ */ dual(3, (self, service, acquire) => flatMap$1(acquire, (implementation) => provideService$1(self, service, implementation)));
/** @internal */
const withConcurrency$1 = /* @__PURE__ */ provideService$1(CurrentConcurrency);
/** @internal */
const zip$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[1]), (self, that, options) => zipWith$1(self, that, (a, a2) => [a, a2], options));
/** @internal */
const zipWith$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[1]), (self, that, f, options) => options?.concurrent ? map$3(all$1([self, that], { concurrency: 2 }), ([a, a2]) => internalCall(() => f(a, a2))) : flatMap$1(self, (a) => map$3(that, (a2) => internalCall(() => f(a, a2)))));
const filterOrFail$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, filter, orFailWith) => filterOrElse$1(self, filter, orFailWith ? (a) => fail$3(orFailWith(a)) : () => fail$3(new NoSuchElementError$1())));
/** @internal */
const when$1 = /* @__PURE__ */ dual(2, (self, condition) => flatMap$1(condition, (pass) => pass ? asSome$1(self) : succeedNone$1));
/** @internal */
const replicate$1 = /* @__PURE__ */ dual(2, (self, n) => Array.from({ length: n }, () => self));
/** @internal */
const replicateEffect$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, n, options) => all$1(replicate$1(self, n), options));
/** @internal */
const forever$2 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, options) => whileLoop$1({
	while: constTrue,
	body: constant(options?.disableYield ? self : flatMap$1(self, (_) => yieldNow$1)),
	step: constVoid
}));
/** @internal */
const catchCause$1 = /* @__PURE__ */ dual(2, (self, f) => {
	const onFailure = Object.create(OnFailureProto);
	onFailure[args] = self;
	onFailure[contE] = f.length !== 1 ? (cause) => f(cause) : f;
	return onFailure;
});
const OnFailureProto = /* @__PURE__ */ makePrimitiveProto({
	op: "OnFailure",
	[evaluate](fiber) {
		fiber._stack.push(this);
		return this[args];
	}
});
/** @internal */
const catchCauseIf$1 = /* @__PURE__ */ dual(3, (self, filter, f) => catchCause$1(self, (cause) => {
	const eb = apply(filter, cause);
	return !isFailure$3(eb) ? internalCall(() => f(eb.success, cause)) : failCause$2(eb.failure);
}));
/** @internal */
const catch_$1 = /* @__PURE__ */ dual(2, (self, f) => catchCauseIf$1(self, findError$2, (e) => f(e)));
/** @internal */
const catchNoSuchElement$1 = (self) => matchEffect$2(self, {
	onFailure: (error) => isNoSuchElementError$1(error) ? succeedNone$1 : fail$3(error),
	onSuccess: succeedSome$1
});
/** @internal */
const catchDefect$1 = /* @__PURE__ */ dual(2, (self, f) => catchCauseIf$1(self, findDefect$2, f));
/** @internal */
const tapCause$1 = /* @__PURE__ */ dual(2, (self, f) => catchCause$1(self, (cause) => andThen$1(internalCall(() => f(cause)), failCause$2(cause))));
/** @internal */
const tapCauseIf$1 = /* @__PURE__ */ dual(3, (self, filter, f) => catchCauseIf$1(self, (cause) => {
	const result = apply(filter, cause);
	return isFailure$3(result) ? fail$4(cause) : result;
}, (failure, cause) => andThen$1(internalCall(() => f(failure, cause)), failCause$2(cause))));
/** @internal */
const tapError$1 = /* @__PURE__ */ dual(2, (self, f) => tapCauseIf$1(self, findError$2, (e) => f(e)));
/** @internal */
const tapErrorTag$1 = /* @__PURE__ */ dual(3, (self, k, f) => {
	const predicate = Array.isArray(k) ? (e) => hasProperty(e, "_tag") && k.includes(e._tag) : isTagged(k);
	return tapError$1(self, (error) => predicate(error) ? f(error) : void_$3);
});
/** @internal */
const tapDefect$1 = /* @__PURE__ */ dual(2, (self, f) => tapCauseIf$1(self, findDefect$2, (_) => f(_)));
/** @internal */
const catchIf$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, filter, f, orElse) => catchCause$1(self, (cause) => {
	const error = findError$2(cause);
	if (isFailure$3(error)) return failCause$2(error.failure);
	const result = apply(filter, error.success);
	if (isFailure$3(result)) return orElse ? internalCall(() => orElse(result.failure)) : failCause$2(cause);
	return internalCall(() => f(result.success));
}));
/** @internal */
const catchTag$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, k, f, orElse) => {
	return catchIf$1(self, Array.isArray(k) ? (e) => hasProperty(e, "_tag") && k.includes(e._tag) : isTagged(k), f, orElse);
});
/** @internal */
const catchTags$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, cases, orElse) => {
	let keys;
	return catchIf$1(self, (e) => {
		keys ??= Object.keys(cases);
		return hasProperty(e, "_tag") && isString(e["_tag"]) && keys.includes(e["_tag"]) ? succeed$3(e) : fail$4(e);
	}, (e) => internalCall(() => cases[e["_tag"]](e)), orElse);
});
/** @internal */
const catchReason$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, errorTag, reasonTag, f, orElse) => catchIf$1(self, (e) => isTagged(e, errorTag) && hasProperty(e, "reason"), (e) => {
	const reason = e.reason;
	if (isTagged(reason, reasonTag)) return f(reason);
	return orElse ? internalCall(() => orElse(reason)) : fail$3(e);
}));
/** @internal */
const catchReasons$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, errorTag, cases, orElse) => {
	let keys;
	return catchIf$1(self, (e) => isTagged(e, errorTag) && hasProperty(e, "reason") && hasProperty(e.reason, "_tag") && isString(e.reason._tag), (e) => {
		const reason = e.reason;
		keys ??= Object.keys(cases);
		if (keys.includes(reason._tag)) return internalCall(() => cases[reason._tag](reason));
		return orElse ? internalCall(() => orElse(reason)) : fail$3(e);
	});
});
/** @internal */
const unwrapReason$1 = /* @__PURE__ */ dual(2, (self, errorTag) => catchIf$1(self, (e) => {
	if (isTagged(e, errorTag) && hasProperty(e, "reason")) return succeed$3(e.reason);
	return fail$4(e);
}, fail$3));
/** @internal */
const mapError$2 = /* @__PURE__ */ dual(2, (self, f) => catch_$1(self, (error) => failSync$1(() => f(error))));
const mapBoth$2 = /* @__PURE__ */ dual(2, (self, options) => matchEffect$2(self, {
	onFailure: (e) => failSync$1(() => options.onFailure(e)),
	onSuccess: (a) => sync$1(() => options.onSuccess(a))
}));
/** @internal */
const orDie$1 = (self) => catch_$1(self, die$3);
/** @internal */
const orElseSucceed$1 = /* @__PURE__ */ dual(2, (self, f) => catch_$1(self, (_) => sync$1(f)));
/** @internal */
const eventually$1 = (self) => catch_$1(self, (_) => flatMap$1(yieldNow$1, () => eventually$1(self)));
/** @internal */
const ignore$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, options) => {
	if (!options?.log) return matchEffect$2(self, {
		onFailure: (_) => void_$3,
		onSuccess: (_) => void_$3
	});
	const logEffect = logWithLevel$1(options.log === true ? void 0 : options.log);
	return matchCauseEffect$1(self, {
		onFailure(cause) {
			const failure = findFail$1(cause);
			return isFailure$3(failure) ? failCause$2(failure.failure) : logEffect(cause);
		},
		onSuccess: (_) => void_$3
	});
});
/** @internal */
const ignoreCause$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, options) => {
	if (!options?.log) return matchCauseEffect$1(self, {
		onFailure: (_) => void_$3,
		onSuccess: (_) => void_$3
	});
	return matchCauseEffect$1(self, {
		onFailure: logWithLevel$1(options.log === true ? void 0 : options.log),
		onSuccess: (_) => void_$3
	});
});
/** @internal */
const option$1 = (self) => match$4(self, {
	onFailure: none,
	onSuccess: some
});
/** @internal */
const result$1 = (self) => matchEager$1(self, {
	onFailure: fail$4,
	onSuccess: succeed$3
});
/** @internal */
const matchCauseEffect$1 = /* @__PURE__ */ dual(2, (self, options) => {
	const primitive = Object.create(OnSuccessAndFailureProto);
	primitive[args] = self;
	primitive[contA] = options.onSuccess.length !== 1 ? (a) => options.onSuccess(a) : options.onSuccess;
	primitive[contE] = options.onFailure.length !== 1 ? (cause) => options.onFailure(cause) : options.onFailure;
	return primitive;
});
const OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
	op: "OnSuccessAndFailure",
	[evaluate](fiber) {
		fiber._stack.push(this);
		return this[args];
	}
});
/** @internal */
const matchCause$1 = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect$1(self, {
	onFailure: (cause) => sync$1(() => options.onFailure(cause)),
	onSuccess: (value) => sync$1(() => options.onSuccess(value))
}));
/** @internal */
const matchEffect$2 = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect$1(self, {
	onFailure: (cause) => {
		const fail = cause.reasons.find(isFailReason$1);
		return fail ? internalCall(() => options.onFailure(fail.error)) : failCause$2(cause);
	},
	onSuccess: options.onSuccess
}));
/** @internal */
const match$4 = /* @__PURE__ */ dual(2, (self, options) => matchEffect$2(self, {
	onFailure: (error) => sync$1(() => options.onFailure(error)),
	onSuccess: (value) => sync$1(() => options.onSuccess(value))
}));
/** @internal */
const matchEager$1 = /* @__PURE__ */ dual(2, (self, options) => {
	if (effectIsExit(self)) {
		if (self._tag === "Success") return exitSucceed(options.onSuccess(self.value));
		const error = findError$2(self.cause);
		if (isFailure$3(error)) return self;
		return exitSucceed(options.onFailure(error.success));
	}
	return match$4(self, options);
});
/** @internal */
const matchCauseEager$1 = /* @__PURE__ */ dual(2, (self, options) => {
	if (effectIsExit(self)) {
		if (self._tag === "Success") return exitSucceed(options.onSuccess(self.value));
		return exitSucceed(options.onFailure(self.cause));
	}
	return matchCause$1(self, options);
});
/** @internal */
const exit$1 = (self) => effectIsExit(self) ? exitSucceed(self) : exitPrimitive(self);
const exitPrimitive = /* @__PURE__ */ makePrimitive({
	op: "Exit",
	[evaluate](fiber) {
		fiber._stack.push(this);
		return this[args];
	},
	[contA](value, _, exit) {
		return succeed$2(exit ?? exitSucceed(value));
	},
	[contE](cause, _, exit) {
		return succeed$2(exit ?? exitFailCause(cause));
	}
});
/** @internal */
const isFailure$2 = /* @__PURE__ */ matchEager$1({
	onFailure: () => true,
	onSuccess: () => false
});
/** @internal */
const isSuccess$2 = /* @__PURE__ */ matchEager$1({
	onFailure: () => false,
	onSuccess: () => true
});
/** @internal */
const delay$1 = /* @__PURE__ */ dual(2, (self, duration) => andThen$1(sleep$1(duration), self));
/** @internal */
const timeoutOrElse$1 = /* @__PURE__ */ dual(2, (self, options) => raceFirst$1(self, flatMap$1(sleep$1(options.duration), options.onTimeout)));
/** @internal */
const timeout$1 = /* @__PURE__ */ dual(2, (self, duration) => timeoutOrElse$1(self, {
	duration,
	onTimeout: () => fail$3(new TimeoutError$1())
}));
/** @internal */
const timeoutOption$1 = /* @__PURE__ */ dual(2, (self, duration) => raceFirst$1(asSome$1(self), as$1(sleep$1(duration), none())));
/** @internal */
const timed$1 = (self) => clockWith$2((clock) => {
	const start = clock.currentTimeNanosUnsafe();
	return map$3(self, (a) => [nanos(clock.currentTimeNanosUnsafe() - start), a]);
});
/** @internal */
const ScopeTypeId = "~effect/Scope";
/** @internal */
const ScopeCloseableTypeId = "~effect/Scope/Closeable";
/** @internal */
const scopeTag = /* @__PURE__ */ Service("effect/Scope");
/** @internal */
const scopeClose = (self, exit_) => suspend$1(() => scopeCloseUnsafe(self, exit_) ?? void_$3);
/** @internal */
const scopeCloseUnsafe = (self, exit_) => {
	if (self.state._tag === "Closed") return;
	const closed = {
		_tag: "Closed",
		exit: exit_
	};
	if (self.state._tag === "Empty") {
		self.state = closed;
		return;
	}
	const { finalizers } = self.state;
	self.state = closed;
	if (finalizers.size === 0) return;
	else if (finalizers.size === 1) return finalizers.values().next().value(exit_);
	return scopeCloseFinalizers(self, finalizers, exit_);
};
const scopeCloseFinalizers = /* @__PURE__ */ fnUntraced$1(function* (self, finalizers, exit_) {
	let exits = [];
	const fibers = [];
	const arr = Array.from(finalizers.values());
	const parent = getCurrentFiber();
	for (let i = arr.length - 1; i >= 0; i--) {
		const finalizer = arr[i];
		if (self.strategy === "sequential") exits.push(yield* exit$1(finalizer(exit_)));
		else fibers.push(forkUnsafe$1(parent, finalizer(exit_), true, true, "inherit"));
	}
	if (fibers.length > 0) exits = yield* fiberAwaitAll(fibers);
	return yield* exitAsVoidAll(exits);
});
/** @internal */
const scopeFork = (scope, finalizerStrategy) => sync$1(() => scopeForkUnsafe(scope, finalizerStrategy));
/** @internal */
const scopeForkUnsafe = (scope, finalizerStrategy) => {
	const newScope = scopeMakeUnsafe(finalizerStrategy);
	if (scope.state._tag === "Closed") {
		newScope.state = scope.state;
		return newScope;
	}
	const key = {};
	scopeAddFinalizerUnsafe(scope, key, (exit) => scopeClose(newScope, exit));
	scopeAddFinalizerUnsafe(newScope, key, (_) => sync$1(() => scopeRemoveFinalizerUnsafe(scope, key)));
	return newScope;
};
/** @internal */
const scopeAddFinalizerExit = (scope, finalizer) => {
	return suspend$1(() => {
		if (scope.state._tag === "Closed") return finalizer(scope.state.exit);
		scopeAddFinalizerUnsafe(scope, {}, finalizer);
		return void_$3;
	});
};
/** @internal */
const scopeAddFinalizer = (scope, finalizer) => scopeAddFinalizerExit(scope, constant(finalizer));
/** @internal */
const scopeAddFinalizerUnsafe = (scope, key, finalizer) => {
	if (scope.state._tag === "Empty") scope.state = {
		_tag: "Open",
		finalizers: new Map([[key, finalizer]])
	};
	else if (scope.state._tag === "Open") scope.state.finalizers.set(key, finalizer);
};
/** @internal */
const scopeRemoveFinalizerUnsafe = (scope, key) => {
	if (scope.state._tag === "Open") scope.state.finalizers.delete(key);
};
/** @internal */
const scopeMakeUnsafe = (finalizerStrategy = "sequential") => ({
	[ScopeCloseableTypeId]: ScopeCloseableTypeId,
	[ScopeTypeId]: ScopeTypeId,
	strategy: finalizerStrategy,
	state: constScopeEmpty
});
const constScopeEmpty = { _tag: "Empty" };
/** @internal */
const scopeMake = (finalizerStrategy) => sync$1(() => scopeMakeUnsafe(finalizerStrategy));
/** @internal */
const scope$1 = /* @__PURE__ */ scopeTag.asEffect();
/** @internal */
const provideScope = /* @__PURE__ */ provideService$1(scopeTag);
/** @internal */
const scoped$1 = (self) => withFiber$1((fiber) => {
	const prev = getOption(fiber.services, scopeTag);
	const scope = scopeMakeUnsafe();
	fiber.setServices(add$2(fiber.services, scopeTag, scope));
	return onExitPrimitive$1(self, (exit) => {
		fiber.setServices(addOrOmit(fiber.services, scopeTag, prev));
		return scopeCloseUnsafe(scope, exit);
	});
});
/** @internal */
const scopeUse = /* @__PURE__ */ dual(2, (self, scope) => onExit$1(provideScope(self, scope), (exit) => suspend$1(() => scopeCloseUnsafe(scope, exit) ?? void_$3)));
/** @internal */
const scopedWith$1 = (f) => suspend$1(() => {
	const scope = scopeMakeUnsafe();
	return onExit$1(f(scope), (exit) => suspend$1(() => scopeCloseUnsafe(scope, exit) ?? void_$3));
});
/** @internal */
const acquireRelease$1 = (acquire, release) => uninterruptible$1(flatMap$1(scope$1, (scope) => tap$1(acquire, (a) => scopeAddFinalizerExit(scope, (exit) => internalCall(() => release(a, exit))))));
/** @internal */
const addFinalizer$2 = (finalizer) => flatMap$1(scope$1, (scope) => servicesWith$1((services) => scopeAddFinalizerExit(scope, (exit) => provideServices$1(finalizer(exit), services))));
/** @internal */
const onExitPrimitive$1 = /* @__PURE__ */ makePrimitive({
	op: "OnExit",
	single: false,
	[evaluate](fiber) {
		fiber._stack.push(this);
		return this[args][0];
	},
	[contAll](fiber) {
		if (fiber.interruptible && this[args][2] !== true) {
			fiber._stack.push(setInterruptibleTrue);
			fiber.interruptible = false;
		}
	},
	[contA](value, _, exit) {
		exit ??= exitSucceed(value);
		const eff = this[args][1](exit);
		return eff ? flatMap$1(eff, (_) => exit) : exit;
	},
	[contE](cause, _, exit) {
		exit ??= exitFailCause(cause);
		const eff = this[args][1](exit);
		return eff ? flatMap$1(eff, (_) => exit) : exit;
	}
});
/** @internal */
const onExit$1 = /* @__PURE__ */ dual(2, onExitPrimitive$1);
/** @internal */
const ensuring$1 = /* @__PURE__ */ dual(2, (self, finalizer) => onExit$1(self, (_) => finalizer));
/** @internal */
const onExitIf$1 = /* @__PURE__ */ dual(3, (self, filter, f) => onExit$1(self, (exit) => {
	const pass = apply(filter, exit);
	return isFailure$3(pass) ? void_$3 : f(pass.success, exit);
}));
/** @internal */
const onError$1 = /* @__PURE__ */ dual(2, (self, f) => onExitIf$1(self, exitFilterCause, f));
/** @internal */
const onErrorIf$1 = /* @__PURE__ */ dual(3, (self, filter, f) => onExitIf$1(self, (exit) => {
	if (exit._tag !== "Failure") return fail$4(exit);
	return apply(filter, exit.cause);
}, (eb, exit) => f(eb, exit.cause)));
/** @internal */
const onInterrupt$1 = /* @__PURE__ */ dual(2, (self, finalizer) => onErrorIf$1(causeFilterInterruptors, finalizer)(self));
/** @internal */
const acquireUseRelease$1 = (acquire, use, release) => uninterruptibleMask$1((restore) => flatMap$1(acquire, (a) => onExitPrimitive$1(restore(use(a)), (exit) => release(a, exit), true)));
/** @internal */
const cachedInvalidateWithTTL$1 = /* @__PURE__ */ dual(2, (self, ttl) => sync$1(() => {
	const ttlMillis = toMillis(fromDurationInputUnsafe(ttl));
	const isFinite = Number.isFinite(ttlMillis);
	const latch = makeLatchUnsafe$1(false);
	let expiresAt = 0;
	let running = false;
	let exit;
	const wait = flatMap$1(latch.await, () => exit);
	return [withFiber$1((fiber) => {
		const now = isFinite ? fiber.getRef(ClockRef).currentTimeMillisUnsafe() : 0;
		if (running || now < expiresAt) return exit ?? wait;
		running = true;
		latch.closeUnsafe();
		exit = void 0;
		return onExit$1(self, (exit_) => sync$1(() => {
			running = false;
			expiresAt = now + ttlMillis;
			exit = exit_;
			latch.openUnsafe();
		}));
	}), sync$1(() => {
		expiresAt = 0;
		latch.closeUnsafe();
		exit = void 0;
	})];
}));
/** @internal */
const cachedWithTTL$1 = /* @__PURE__ */ dual(2, (self, timeToLive) => map$3(cachedInvalidateWithTTL$1(self, timeToLive), (tuple) => tuple[0]));
/** @internal */
const cached$1 = (self) => cachedWithTTL$1(self, infinity);
/** @internal */
const interrupt$3 = /* @__PURE__ */ withFiber$1((fiber) => failCause$2(causeInterrupt(fiber.id)));
/** @internal */
const uninterruptible$1 = (self) => withFiber$1((fiber) => {
	if (!fiber.interruptible) return self;
	fiber.interruptible = false;
	fiber._stack.push(setInterruptibleTrue);
	return self;
});
const setInterruptible = /* @__PURE__ */ makePrimitive({
	op: "SetInterruptible",
	[contAll](fiber) {
		fiber.interruptible = this[args];
		if (fiber._interruptedCause && fiber.interruptible) return () => failCause$2(fiber._interruptedCause);
	}
});
const setInterruptibleTrue = /* @__PURE__ */ setInterruptible(true);
const setInterruptibleFalse = /* @__PURE__ */ setInterruptible(false);
/** @internal */
const interruptible$1 = (self) => withFiber$1((fiber) => {
	if (fiber.interruptible) return self;
	fiber.interruptible = true;
	fiber._stack.push(setInterruptibleFalse);
	if (fiber._interruptedCause) return failCause$2(fiber._interruptedCause);
	return self;
});
/** @internal */
const uninterruptibleMask$1 = (f) => withFiber$1((fiber) => {
	if (!fiber.interruptible) return f(identity);
	fiber.interruptible = false;
	fiber._stack.push(setInterruptibleTrue);
	return f(interruptible$1);
});
/** @internal */
const interruptibleMask$1 = (f) => withFiber$1((fiber) => {
	if (fiber.interruptible) return f(identity);
	fiber.interruptible = true;
	fiber._stack.push(setInterruptibleFalse);
	return f(uninterruptible$1);
});
/** @internal */
const all$1 = (arg, options) => {
	if (isIterable(arg)) return options?.mode === "result" ? forEach$1(arg, result$1, options) : forEach$1(arg, identity, options);
	else if (options?.discard) return options.mode === "result" ? forEach$1(Object.values(arg), result$1, options) : forEach$1(Object.values(arg), identity, options);
	return suspend$1(() => {
		const out = {};
		return as$1(forEach$1(Object.entries(arg), ([key, effect]) => map$3(options?.mode === "result" ? result$1(effect) : effect, (value) => {
			out[key] = value;
		}), {
			discard: true,
			concurrency: options?.concurrency
		}), out);
	});
};
/** @internal */
const partition$1 = /* @__PURE__ */ dual((args) => isIterable(args[0]) && !isEffect$1(args[0]), (elements, f, options) => map$3(forEach$1(elements, (a, i) => result$1(f(a, i)), options), (results) => partitionMap(results, identity)));
/** @internal */
const whileLoop$1 = /* @__PURE__ */ makePrimitive({
	op: "While",
	[contA](value, fiber) {
		this[args].step(value);
		if (this[args].while()) {
			fiber._stack.push(this);
			return this[args].body();
		}
		return exitVoid;
	},
	[evaluate](fiber) {
		if (this[args].while()) {
			fiber._stack.push(this);
			return this[args].body();
		}
		return exitVoid;
	}
});
/** @internal */
const forEach$1 = /* @__PURE__ */ dual((args) => typeof args[1] === "function", (iterable, f, options) => withFiber$1((parent) => {
	const concurrencyOption = options?.concurrency === "inherit" ? parent.getRef(CurrentConcurrency) : options?.concurrency ?? 1;
	const concurrency = concurrencyOption === "unbounded" ? Number.POSITIVE_INFINITY : Math.max(1, concurrencyOption);
	if (concurrency === 1) return forEachSequential(iterable, f, options);
	const items = fromIterable(iterable);
	let length = items.length;
	if (length === 0) return options?.discard ? void_$3 : succeed$2([]);
	const out = options?.discard ? void 0 : new Array(length);
	let index = 0;
	const annotations = fiberStackAnnotations(parent);
	return callback$1((resume) => {
		const fibers = /* @__PURE__ */ new Set();
		const failures = [];
		let failed = false;
		let inProgress = 0;
		let doneCount = 0;
		let pumping = false;
		let interrupted = false;
		function pump() {
			pumping = true;
			while (inProgress < concurrency && index < length) {
				const currentIndex = index;
				const item = items[currentIndex];
				index++;
				inProgress++;
				try {
					const child = forkUnsafe$1(parent, f(item, currentIndex), true, true, "inherit");
					fibers.add(child);
					child.addObserver((exit) => {
						if (interrupted) return;
						fibers.delete(child);
						if (exit._tag === "Failure") if (!failed) {
							failed = true;
							length = index;
							failures.push(...exit.cause.reasons);
							fibers.forEach((fiber) => fiber.interruptUnsafe(parent.id, annotations));
						} else for (const f of exit.cause.reasons) {
							if (f._tag === "Interrupt") continue;
							failures.push(f);
						}
						else if (out !== void 0) out[currentIndex] = exit.value;
						doneCount++;
						inProgress--;
						if (doneCount === length) resume(failures.length > 0 ? exitFailCause(causeFromReasons(failures)) : succeed$2(out));
						else if (!pumping && !failed && inProgress < concurrency) pump();
					});
				} catch (err) {
					failed = true;
					length = index;
					failures.push(new Die(err));
					fibers.forEach((fiber) => fiber.interruptUnsafe(parent.id, annotations));
				}
			}
			pumping = false;
		}
		pump();
		return suspend$1(() => {
			interrupted = true;
			index = length;
			return fiberInterruptAll(fibers);
		});
	});
}));
const forEachSequential = (iterable, f, options) => suspend$1(() => {
	const out = options?.discard ? void 0 : [];
	const iterator = iterable[Symbol.iterator]();
	let state = iterator.next();
	let index = 0;
	return as$1(whileLoop$1({
		while: () => !state.done,
		body: () => f(state.value, index++),
		step: (b) => {
			if (out) out.push(b);
			state = iterator.next();
		}
	}), out);
});
const filterOrElse$1 = /* @__PURE__ */ dual(3, (self, filter, orElse) => flatMap$1(self, (a) => {
	const result = apply(filter, a);
	return isFailure$3(result) ? orElse(result.failure) : succeed$2(result.success);
}));
/** @internal */
const filter$1 = /* @__PURE__ */ dual((args) => isIterable(args[0]) && !isEffect$1(args[0]), (elements, filter, options) => suspend$1(() => {
	const out = [];
	return as$1(forEach$1(elements, (a, i) => {
		const result = filter(a, i);
		if (typeof result === "boolean") {
			if (result) out.push(a);
			return void_$3;
		}
		if (!isEffect$1(result)) {
			if (!isFailure$3(result)) out.push(result.success);
			return void_$3;
		}
		return map$3(result, (r) => {
			if (typeof r === "boolean") {
				if (r) out.push(a);
			} else if (!isFailure$3(r)) out.push(r.success);
		});
	}, {
		discard: true,
		concurrency: options?.concurrency
	}), out);
}));
/** @internal */
const forkChild$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, options) => withFiber$1((fiber) => {
	interruptChildrenPatch();
	return succeed$2(forkUnsafe$1(fiber, self, options?.startImmediately, false, options?.uninterruptible ?? false));
}));
/** @internal */
const forkUnsafe$1 = (parent, effect, immediate = false, daemon = false, uninterruptible = false) => {
	const interruptible = uninterruptible === "inherit" ? parent.interruptible : !uninterruptible;
	const child = new FiberImpl(parent.services, interruptible);
	if (immediate) child.evaluate(effect);
	else parent.currentScheduler.scheduleTask(() => child.evaluate(effect), 0);
	if (!daemon && !child._exit) {
		parent.children().add(child);
		child.addObserver(() => parent._children.delete(child));
	}
	return child;
};
/** @internal */
const forkDetach$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, options) => withFiber$1((fiber) => succeed$2(forkUnsafe$1(fiber, self, options?.startImmediately, true, options?.uninterruptible))));
/** @internal */
const awaitAllChildren$1 = (self) => withFiber$1((fiber) => {
	const initialChildren = fiber._children && fromIterable(fiber._children);
	return onExit$1(self, (_) => {
		let children = fiber._children;
		if (children === void 0 || children.size === 0) return void_$3;
		else if (initialChildren) children = filter$2(children, (child) => !initialChildren.includes(child));
		return asVoid$2(fiberAwaitAll(children));
	});
});
/** @internal */
const forkIn$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, scope, options) => withFiber$1((parent) => {
	const fiber = forkUnsafe$1(parent, self, options?.startImmediately, true, options?.uninterruptible);
	if (!fiber._exit) if (scope.state._tag !== "Closed") {
		const key = {};
		const finalizer = () => withFiberId((interruptor) => interruptor === fiber.id ? void_$3 : fiberInterrupt(fiber));
		scopeAddFinalizerUnsafe(scope, key, finalizer);
		fiber.addObserver(() => scopeRemoveFinalizerUnsafe(scope, key));
	} else fiber.interruptUnsafe(parent.id, fiberStackAnnotations(parent));
	return succeed$2(fiber);
}));
/** @internal */
const forkScoped$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, options) => flatMap$1(scope$1, (scope) => forkIn$1(self, scope, options)));
/** @internal */
const runForkWith$1 = (services) => (effect, options) => {
	const scheduler = options?.scheduler || !services.mapUnsafe.has(Scheduler.key) && new MixedScheduler();
	const fiber = new FiberImpl(scheduler ? add$2(services, Scheduler, scheduler) : services, options?.uninterruptible !== true);
	fiber.evaluate(effect);
	if (fiber._exit) return fiber;
	if (options?.signal) if (options.signal.aborted) fiber.interruptUnsafe();
	else {
		const abort = () => fiber.interruptUnsafe();
		options.signal.addEventListener("abort", abort, { once: true });
		fiber.addObserver(() => options.signal.removeEventListener("abort", abort));
	}
	return fiber;
};
/** @internal */
const runFork$1 = /* @__PURE__ */ runForkWith$1(/* @__PURE__ */ empty$1());
/** @internal */
const runCallbackWith$1 = (services) => {
	const runFork = runForkWith$1(services);
	return (effect, options) => {
		const fiber = runFork(effect, options);
		if (options?.onExit) fiber.addObserver(options.onExit);
		return (interruptor) => {
			return fiber.interruptUnsafe(interruptor);
		};
	};
};
/** @internal */
const runCallback$1 = /* @__PURE__ */ runCallbackWith$1(/* @__PURE__ */ empty$1());
/** @internal */
const runPromiseExitWith$1 = (services) => {
	const runFork = runForkWith$1(services);
	return (effect, options) => {
		const fiber = runFork(effect, options);
		return new Promise((resolve) => {
			fiber.addObserver((exit) => resolve(exit));
		});
	};
};
/** @internal */
const runPromiseExit$1 = /* @__PURE__ */ runPromiseExitWith$1(/* @__PURE__ */ empty$1());
/** @internal */
const runPromiseWith$1 = (services) => {
	const runPromiseExit = runPromiseExitWith$1(services);
	return (effect, options) => runPromiseExit(effect, options).then((exit) => {
		if (exit._tag === "Failure") throw causeSquash(exit.cause);
		return exit.value;
	});
};
/** @internal */
const runPromise$1 = /* @__PURE__ */ runPromiseWith$1(/* @__PURE__ */ empty$1());
/** @internal */
const runSyncExitWith$1 = (services) => {
	const runFork = runForkWith$1(services);
	return (effect) => {
		if (effectIsExit(effect)) return effect;
		const scheduler = new MixedScheduler("sync");
		const fiber = runFork(effect, { scheduler });
		scheduler.flush();
		return fiber._exit ?? exitDie(fiber);
	};
};
/** @internal */
const runSyncExit$1 = /* @__PURE__ */ runSyncExitWith$1(/* @__PURE__ */ empty$1());
/** @internal */
const runSyncWith$1 = (services) => {
	const runSyncExit = runSyncExitWith$1(services);
	return (effect) => {
		const exit = runSyncExit(effect);
		if (exit._tag === "Failure") throw causeSquash(exit.cause);
		return exit.value;
	};
};
/** @internal */
const runSync$1 = /* @__PURE__ */ runSyncWith$1(/* @__PURE__ */ empty$1());
/** @internal */
var Semaphore = class {
	waiters = /* @__PURE__ */ new Set();
	taken = 0;
	permits;
	constructor(permits) {
		this.permits = permits;
	}
	get free() {
		return this.permits - this.taken;
	}
	take = (n) => callback$1((resume) => {
		if (this.free < n) {
			const observer = () => {
				if (this.free < n) return;
				this.waiters.delete(observer);
				this.taken += n;
				resume(succeed$2(n));
			};
			this.waiters.add(observer);
			return sync$1(() => {
				this.waiters.delete(observer);
			});
		}
		this.taken += n;
		return resume(succeed$2(n));
	});
	updateTakenUnsafe(fiber, f) {
		this.taken = f(this.taken);
		if (this.waiters.size > 0) fiber.currentScheduler.scheduleTask(() => {
			const iter = this.waiters.values();
			let item = iter.next();
			while (item.done === false && this.free > 0) {
				item.value();
				item = iter.next();
			}
		}, 0);
		return succeed$2(this.free);
	}
	updateTaken(f) {
		return withFiber$1((fiber) => this.updateTakenUnsafe(fiber, f));
	}
	resize = (permits) => asVoid$2(withFiber$1((fiber) => {
		this.permits = permits;
		if (this.free < 0) return void_$3;
		return this.updateTakenUnsafe(fiber, (taken) => taken);
	}));
	release = (n) => this.updateTaken((taken) => taken - n);
	releaseAll = /* @__PURE__ */ this.updateTaken((_) => 0);
	withPermits = (n) => (self) => uninterruptibleMask$1((restore) => flatMap$1(restore(this.take(n)), (permits) => ensuring$1(restore(self), this.release(permits))));
	withPermit = /* @__PURE__ */ this.withPermits(1);
	withPermitsIfAvailable = (n) => (self) => uninterruptibleMask$1((restore) => suspend$1(() => {
		if (this.free < n) return succeedNone$1;
		this.taken += n;
		return ensuring$1(restore(asSome$1(self)), this.release(n));
	}));
};
/** @internal */
const makeSemaphoreUnsafe$1 = (permits) => new Semaphore(permits);
/** @internal */
const makeSemaphore$1 = (permits) => sync$1(() => makeSemaphoreUnsafe$1(permits));
const succeedTrue = /* @__PURE__ */ succeed$2(true);
const succeedFalse = /* @__PURE__ */ succeed$2(false);
var Latch = class {
	waiters = [];
	scheduled = false;
	isOpen;
	constructor(isOpen) {
		this.isOpen = isOpen;
	}
	scheduleUnsafe(fiber) {
		if (this.scheduled || this.waiters.length === 0) return succeedTrue;
		this.scheduled = true;
		fiber.currentScheduler.scheduleTask(this.flushWaiters, 0);
		return succeedTrue;
	}
	flushWaiters = () => {
		this.scheduled = false;
		const waiters = this.waiters;
		this.waiters = [];
		for (let i = 0; i < waiters.length; i++) waiters[i](exitVoid);
	};
	open = /* @__PURE__ */ withFiber$1((fiber) => {
		if (this.isOpen) return succeedFalse;
		this.isOpen = true;
		return this.scheduleUnsafe(fiber);
	});
	release = /* @__PURE__ */ withFiber$1((fiber) => this.open ? succeedFalse : this.scheduleUnsafe(fiber));
	openUnsafe() {
		if (this.isOpen) return false;
		this.isOpen = true;
		this.flushWaiters();
		return true;
	}
	await = /* @__PURE__ */ callback$1((resume) => {
		if (this.isOpen) return resume(void_$3);
		this.waiters.push(resume);
		return sync$1(() => {
			const index = this.waiters.indexOf(resume);
			if (index !== -1) this.waiters.splice(index, 1);
		});
	});
	closeUnsafe() {
		if (!this.isOpen) return false;
		this.isOpen = false;
		return true;
	}
	close = /* @__PURE__ */ sync$1(() => this.closeUnsafe());
	whenOpen = (self) => andThen$1(this.await, self);
};
/** @internal */
const makeLatchUnsafe$1 = (open) => new Latch(open ?? false);
/** @internal */
const makeLatch$1 = (open) => sync$1(() => makeLatchUnsafe$1(open));
/** @internal */
const tracer$1 = /* @__PURE__ */ withFiber$1((fiber) => succeed$2(fiber.getRef(Tracer)));
/** @internal */
const withTracer$1 = /* @__PURE__ */ dual(2, (effect, tracer) => provideService$1(effect, Tracer, tracer));
/** @internal */
const withTracerEnabled$1 = /* @__PURE__ */ provideService$1(TracerEnabled);
/** @internal */
const withTracerTiming$1 = /* @__PURE__ */ provideService$1(TracerTimingEnabled);
const bigint0 = /* @__PURE__ */ BigInt(0);
const NoopSpanProto = {
	_tag: "Span",
	spanId: "noop",
	traceId: "noop",
	sampled: false,
	status: {
		_tag: "Ended",
		startTime: bigint0,
		endTime: bigint0,
		exit: exitVoid
	},
	attributes: /* @__PURE__ */ new Map(),
	links: [],
	kind: "internal",
	attribute() {},
	event() {},
	end() {},
	addLinks() {}
};
/** @internal */
const noopSpan = (options) => Object.assign(Object.create(NoopSpanProto), options);
const filterDisablePropagation = (span) => {
	if (span) return get(span.annotations, DisablePropagation) ? span._tag === "Span" ? filterDisablePropagation(span.parent) : void 0 : span;
};
/** @internal */
const makeSpanUnsafe = (fiber, name, options) => {
	const disablePropagation = !fiber.getRef(TracerEnabled) || options?.annotations && get(options.annotations, DisablePropagation);
	const parent = options?.parent ?? (options?.root ? void 0 : filterDisablePropagation(fiber.currentSpan));
	let span;
	if (disablePropagation) span = noopSpan({
		name,
		parent,
		annotations: add$2(options?.annotations ?? empty$1(), DisablePropagation, true)
	});
	else {
		const tracer = fiber.getRef(Tracer);
		const clock = fiber.getRef(ClockRef);
		const timingEnabled = fiber.getRef(TracerTimingEnabled);
		const annotationsFromEnv = fiber.getRef(TracerSpanAnnotations);
		const linksFromEnv = fiber.getRef(TracerSpanLinks);
		const level = options?.level ?? fiber.getRef(CurrentTraceLevel);
		const links = options?.links !== void 0 ? [...linksFromEnv, ...options.links] : linksFromEnv.slice();
		span = tracer.span({
			name,
			parent,
			annotations: options?.annotations ?? empty$1(),
			links,
			startTime: timingEnabled ? clock.currentTimeNanosUnsafe() : 0n,
			kind: options?.kind ?? "internal",
			root: options?.root ?? options?.parent === void 0,
			sampled: options?.sampled ?? (parent?.sampled === false ? false : !isLogLevelGreaterThan(fiber.getRef(MinimumTraceLevel), level))
		});
		for (const [key, value] of Object.entries(annotationsFromEnv)) span.attribute(key, value);
		if (options?.attributes !== void 0) for (const [key, value] of Object.entries(options.attributes)) span.attribute(key, value);
	}
	return span;
};
/** @internal */
const makeSpan$1 = (name, options) => withFiber$1((fiber) => succeed$2(makeSpanUnsafe(fiber, name, options)));
/** @internal */
const makeSpanScoped$1 = (name, options) => uninterruptible$1(withFiber$1((fiber) => {
	const scope = getUnsafe(fiber.services, scopeTag);
	const span = makeSpanUnsafe(fiber, name, options ?? {});
	const clock = fiber.getRef(ClockRef);
	const timingEnabled = fiber.getRef(TracerTimingEnabled);
	return as$1(scopeAddFinalizerExit(scope, (exit) => endSpan(span, exit, clock, timingEnabled)), span);
}));
/** @internal */
const withSpanScoped$1 = function() {
	const dataFirst = typeof arguments[0] !== "string";
	const name = dataFirst ? arguments[1] : arguments[0];
	const options = addSpanStackTrace(dataFirst ? arguments[2] : arguments[1]);
	if (dataFirst) {
		const self = arguments[0];
		return flatMap$1(makeSpanScoped$1(name, options), (span) => withParentSpan$1(self, span, options));
	}
	return (self) => flatMap$1(makeSpanScoped$1(name, options), (span) => withParentSpan$1(self, span, options));
};
const provideSpanStackFrame = (name, stack) => {
	stack = typeof stack === "function" ? stack : constUndefined;
	return updateService$1(CurrentStackFrame, (parent) => ({
		name,
		stack,
		parent
	}));
};
/** @internal */
const spanAnnotations$1 = /* @__PURE__ */ TracerSpanAnnotations.asEffect();
/** @internal */
const spanLinks$1 = /* @__PURE__ */ TracerSpanLinks.asEffect();
/** @internal */
const linkSpans$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, span, attributes = {}) => {
	const links = (Array.isArray(span) ? span : [span]).map((span) => ({
		span,
		attributes
	}));
	return updateService$1(self, TracerSpanLinks, (current) => [...current, ...links]);
});
/** @internal */
const endSpan = (span, exit, clock, timingEnabled) => sync$1(() => {
	if (span.status._tag === "Ended") return;
	span.end(timingEnabled ? clock.currentTimeNanosUnsafe() : bigint0, exit);
});
/** @internal */
const useSpan$1 = (name, ...args) => {
	const options = args.length === 1 ? void 0 : args[0];
	const evaluate = args[args.length - 1];
	return withFiber$1((fiber) => {
		const span = makeSpanUnsafe(fiber, name, options);
		const clock = fiber.getRef(ClockRef);
		return onExit$1(internalCall(() => evaluate(span)), (exit) => sync$1(() => {
			if (span.status._tag === "Ended") return;
			span.end(clock.currentTimeNanosUnsafe(), exit);
		}));
	});
};
const provideParentSpan = /* @__PURE__ */ provideService$1(ParentSpan);
/** @internal */
const withParentSpan$1 = function() {
	const dataFirst = isEffect$1(arguments[0]);
	const span = dataFirst ? arguments[1] : arguments[0];
	let options = dataFirst ? arguments[2] : arguments[1];
	let provideStackFrame = identity;
	if (span._tag === "Span") {
		options = addSpanStackTrace(options);
		provideStackFrame = provideSpanStackFrame(span.name, options?.captureStackTrace);
	}
	if (dataFirst) return provideParentSpan(provideStackFrame(arguments[0]), span);
	return (self) => provideParentSpan(provideStackFrame(self), span);
};
/** @internal */
const withSpan$1 = function() {
	const dataFirst = typeof arguments[0] !== "string";
	const name = dataFirst ? arguments[1] : arguments[0];
	const traceOptions = addSpanStackTrace(arguments[2]);
	if (dataFirst) {
		const self = arguments[0];
		return useSpan$1(name, arguments[2], (span) => withParentSpan$1(self, span, traceOptions));
	}
	const fnArg = typeof arguments[1] === "function" ? arguments[1] : void 0;
	const options = fnArg ? void 0 : arguments[1];
	return (self, ...args) => useSpan$1(name, fnArg ? fnArg(...args) : options, (span) => withParentSpan$1(self, span, traceOptions));
};
/** @internal */
const annotateSpans$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (effect, ...args) => updateService$1(effect, TracerSpanAnnotations, (annotations) => {
	const newAnnotations = { ...annotations };
	if (args.length === 1) Object.assign(newAnnotations, args[0]);
	else newAnnotations[args[0]] = args[1];
	return newAnnotations;
}));
/** @internal */
const annotateCurrentSpan$1 = (...args) => withFiber$1((fiber) => {
	const span = fiber.currentSpanLocal;
	if (span) if (args.length === 1) for (const [key, value] of Object.entries(args[0])) span.attribute(key, value);
	else span.attribute(args[0], args[1]);
	return void_$3;
});
/** @internal */
const currentSpan$1 = /* @__PURE__ */ withFiber$1((fiber) => {
	const span = fiber.currentSpanLocal;
	return span ? succeed$2(span) : fail$3(new NoSuchElementError$1());
});
/** @internal */
const currentParentSpan$1 = /* @__PURE__ */ serviceOptional(ParentSpan);
/** @internal */
const ClockRef = /* @__PURE__ */ Reference("effect/Clock", { defaultValue: () => new ClockImpl() });
const MAX_TIMER_MILLIS = 2 ** 31 - 1;
var ClockImpl = class {
	currentTimeMillisUnsafe() {
		return Date.now();
	}
	currentTimeMillis = /* @__PURE__ */ sync$1(() => this.currentTimeMillisUnsafe());
	currentTimeNanosUnsafe() {
		return processOrPerformanceNow();
	}
	currentTimeNanos = /* @__PURE__ */ sync$1(() => this.currentTimeNanosUnsafe());
	sleep(duration) {
		const millis = toMillis(duration);
		if (millis <= 0) return yieldNow$1;
		return callback$1((resume) => {
			if (millis > MAX_TIMER_MILLIS) return;
			const handle = setTimeout(() => resume(void_$3), millis);
			return sync$1(() => clearTimeout(handle));
		});
	}
};
const performanceNowNanos = /* @__PURE__ */ function() {
	const bigint1e6 = /* @__PURE__ */ BigInt(1e6);
	if (typeof performance === "undefined" || typeof performance.now === "undefined") return () => BigInt(Date.now()) * bigint1e6;
	else if (typeof performance.timeOrigin === "number" && performance.timeOrigin === 0) return () => BigInt(Math.round(performance.now() * 1e6));
	const origin = /* @__PURE__ */ BigInt(/* @__PURE__ */ Date.now()) * bigint1e6 - /* @__PURE__ */ BigInt(/* @__PURE__ */ Math.round(/* @__PURE__ */ performance.now() * 1e6));
	return () => origin + BigInt(Math.round(performance.now() * 1e6));
}();
const processOrPerformanceNow = /* @__PURE__ */ function() {
	const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : void 0;
	if (!processHrtime) return performanceNowNanos;
	const origin = /* @__PURE__ */ performanceNowNanos() - /* @__PURE__ */ processHrtime.bigint();
	return () => origin + processHrtime.bigint();
}();
/** @internal */
const clockWith$2 = (f) => withFiber$1((fiber) => f(fiber.getRef(ClockRef)));
/** @internal */
const sleep$1 = (duration) => clockWith$2((clock) => clock.sleep(fromDurationInputUnsafe(duration)));
/** @internal */
const currentTimeMillis$1 = /* @__PURE__ */ clockWith$2((clock) => clock.currentTimeMillis);
/** @internal */
const currentTimeNanos$1 = /* @__PURE__ */ clockWith$2((clock) => clock.currentTimeNanos);
/** @internal */
const TimeoutErrorTypeId$1 = "~effect/Cause/TimeoutError";
/** @internal */
const isTimeoutError$1 = (u) => hasProperty(u, TimeoutErrorTypeId$1);
/** @internal */
var TimeoutError$1 = class extends TaggedError$1("TimeoutError") {
	[TimeoutErrorTypeId$1] = TimeoutErrorTypeId$1;
	constructor(message) {
		super({ message });
	}
};
/** @internal */
const IllegalArgumentErrorTypeId$1 = "~effect/Cause/IllegalArgumentError";
/** @internal */
const isIllegalArgumentError$1 = (u) => hasProperty(u, IllegalArgumentErrorTypeId$1);
/** @internal */
var IllegalArgumentError$1 = class extends TaggedError$1("IllegalArgumentError") {
	[IllegalArgumentErrorTypeId$1] = IllegalArgumentErrorTypeId$1;
	constructor(message) {
		super({ message });
	}
};
/** @internal */
const ExceededCapacityErrorTypeId$1 = "~effect/Cause/ExceededCapacityError";
/** @internal */
const isExceededCapacityError$1 = (u) => hasProperty(u, ExceededCapacityErrorTypeId$1);
/** @internal */
var ExceededCapacityError$1 = class extends TaggedError$1("ExceededCapacityError") {
	[ExceededCapacityErrorTypeId$1] = ExceededCapacityErrorTypeId$1;
	constructor(message) {
		super({ message });
	}
};
/** @internal */
const UnknownErrorTypeId$1 = "~effect/Cause/UnknownError";
/** @internal */
const isUnknownError$1 = (u) => hasProperty(u, UnknownErrorTypeId$1);
/** @internal */
var UnknownError$1 = class extends TaggedError$1("UnknownError") {
	[UnknownErrorTypeId$1] = UnknownErrorTypeId$1;
	constructor(cause, message) {
		super({
			message,
			cause
		});
	}
};
/** @internal */
const ConsoleRef = /* @__PURE__ */ Reference("effect/Console/CurrentConsole", { defaultValue: () => globalThis.console });
/** @internal */
const logLevelToOrder = (level) => {
	switch (level) {
		case "All": return Number.MIN_SAFE_INTEGER;
		case "Fatal": return 5e4;
		case "Error": return 4e4;
		case "Warn": return 3e4;
		case "Info": return 2e4;
		case "Debug": return 1e4;
		case "Trace": return 0;
		case "None": return Number.MAX_SAFE_INTEGER;
	}
};
/** @internal */
const LogLevelOrder = /* @__PURE__ */ mapInput(Number$4, logLevelToOrder);
/** @internal */
const isLogLevelGreaterThan = /* @__PURE__ */ isGreaterThan$3(LogLevelOrder);
/** @internal */
const CurrentLoggers = /* @__PURE__ */ Reference("effect/Loggers/CurrentLoggers", { defaultValue: () => new Set([defaultLogger, tracerLogger]) });
/** @internal */
const LogToStderr = /* @__PURE__ */ Reference("effect/Logger/LogToStderr", { defaultValue: constFalse });
/** @internal */
const LoggerTypeId = "~effect/Logger";
const LoggerProto = {
	[LoggerTypeId]: {
		_Message: identity,
		_Output: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const loggerMake = (log) => {
	const self = Object.create(LoggerProto);
	self.log = log;
	return self;
};
/**
* Sanitize a given string by replacing spaces, equal signs, and double quotes
* with underscores.
*
* @internal
*/
const formatLabel = (key) => key.replace(/[\s="]/g, "_");
/**
* Formats a log span into a `<label>=<value>ms` string.
*
* @internal
*/
const formatLogSpan = (self, now) => {
	return `${formatLabel(self[0])}=${now - self[1]}ms`;
};
/** @internal */
const logWithLevel$1 = (level) => (...message) => {
	let cause = void 0;
	for (let i = 0, len = message.length; i < len; i++) {
		const msg = message[i];
		if (isCause$1(msg)) {
			if (cause) message.splice(i, 1);
			else message = message.slice(0, i).concat(message.slice(i + 1));
			cause = cause ? causeFromReasons(cause.reasons.concat(msg.reasons)) : msg;
			i--;
		}
	}
	if (cause === void 0) cause = causeEmpty;
	return withFiber$1((fiber) => {
		const logLevel = level ?? fiber.currentLogLevel;
		if (isLogLevelGreaterThan(fiber.minimumLogLevel, logLevel)) return void_$3;
		const clock = fiber.getRef(ClockRef);
		const loggers = fiber.getRef(CurrentLoggers);
		if (loggers.size > 0) {
			const date = new Date(clock.currentTimeMillisUnsafe());
			for (const logger of loggers) logger.log({
				cause,
				fiber,
				date,
				logLevel,
				message
			});
		}
		return void_$3;
	});
};
const colors = {
	bold: "1",
	red: "31",
	green: "32",
	yellow: "33",
	blue: "34",
	cyan: "36",
	white: "37",
	gray: "90",
	black: "30",
	bgBrightRed: "101"
};
const logLevelColors = {
	None: [],
	All: [],
	Trace: [colors.gray],
	Debug: [colors.blue],
	Info: [colors.green],
	Warn: [colors.yellow],
	Error: [colors.red],
	Fatal: [colors.bgBrightRed, colors.black]
};
const defaultDateFormat = (date) => `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;
const hasProcessStdout = typeof process === "object" && process !== null && typeof process.stdout === "object" && process.stdout !== null;
const processStdoutIsTTY = hasProcessStdout && process.stdout.isTTY === true;
const hasProcessStdoutOrDeno = hasProcessStdout || "Deno" in globalThis;
/** @internal */
const defaultLogger = /* @__PURE__ */ loggerMake(({ cause, date, fiber, logLevel, message }) => {
	const message_ = Array.isArray(message) ? message.slice() : [message];
	if (cause.reasons.length > 0) message_.unshift(causePretty(cause));
	const now = date.getTime();
	const spans = fiber.getRef(CurrentLogSpans);
	let spanString = "";
	for (const span of spans) spanString += ` ${formatLogSpan(span, now)}`;
	const annotations = fiber.getRef(CurrentLogAnnotations);
	if (Object.keys(annotations).length > 0) message_.push(annotations);
	const console = fiber.getRef(ConsoleRef);
	(fiber.getRef(LogToStderr) ? console.error : console.log)(`[${defaultDateFormat(date)}] ${logLevel.toUpperCase()} (#${fiber.id})${spanString}:`, ...message_);
});
/** @internal */
const tracerLogger = /* @__PURE__ */ loggerMake(({ cause, fiber, logLevel, message }) => {
	const clock = fiber.getRef(ClockRef);
	const annotations = fiber.getRef(CurrentLogAnnotations);
	const span = fiber.currentSpan;
	if (span === void 0 || span._tag === "ExternalSpan") return;
	const attributes = {};
	for (const [key, value] of Object.entries(annotations)) attributes[key] = value;
	attributes["effect.fiberId"] = fiber.id;
	attributes["effect.logLevel"] = logLevel.toUpperCase();
	if (cause.reasons.length > 0) attributes["effect.cause"] = causePretty(cause);
	span.event(toStringUnknown(Array.isArray(message) && message.length === 1 ? message[0] : message), clock.currentTimeNanosUnsafe(), attributes);
});
/** @internal */
function interruptChildrenPatch() {
	fiberMiddleware.interruptChildren ??= fiberInterruptChildren;
}
/** @internal */
const undefined_$2 = /* @__PURE__ */ succeed$2(void 0);

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Cause.js
/**
* Unique brand for `Cause` values, used for runtime type checks via {@link isCause}.
*
* @since 2.0.0
* @category symbols
*/
const TypeId$11 = CauseTypeId;
/**
* Unique brand for `Reason` values, used for runtime type checks via {@link isReason}.
*
* @since 2.0.0
* @category symbols
*/
const ReasonTypeId = CauseReasonTypeId;
/**
* Tests if an arbitrary value is a {@link Cause}.
*
* **Example** (runtime type check)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.isCause(Cause.fail("error"))) // true
* console.log(Cause.isCause("not a cause")) // false
* ```
*
* @category guards
* @since 2.0.0
*/
const isCause = isCause$1;
/**
* Tests if an arbitrary value is a {@link Reason} (`Fail`, `Die`, or `Interrupt`).
*
* **Example** (runtime type check)
*
* ```ts
* import { Cause } from "effect"
*
* const reason = Cause.fail("error").reasons[0]
* console.log(Cause.isReason(reason)) // true
* console.log(Cause.isReason("not a reason")) // false
* ```
*
* @category guards
* @since 2.0.0
*/
const isReason = isCauseReason;
/**
* Narrows a {@link Reason} to {@link Fail}.
*
* Useful as a predicate for `Array.filter` when iterating over `cause.reasons`.
*
* **Example** (filtering fail reasons)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.fail("error")
* const fails = cause.reasons.filter(Cause.isFailReason)
* console.log(fails[0].error) // "error"
* ```
*
* @see {@link isDieReason} — narrow to `Die`
* @see {@link isInterruptReason} — narrow to `Interrupt`
*
* @category guards
* @since 4.0.0
*/
const isFailReason = isFailReason$1;
/**
* Narrows a {@link Reason} to {@link Die}.
*
* Useful as a predicate for `Array.filter` when iterating over `cause.reasons`.
*
* **Example** (filtering die reasons)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.die("defect")
* const dies = cause.reasons.filter(Cause.isDieReason)
* console.log(dies[0].defect) // "defect"
* ```
*
* @see {@link isFailReason} — narrow to `Fail`
* @see {@link isInterruptReason} — narrow to `Interrupt`
*
* @category guards
* @since 4.0.0
*/
const isDieReason = isDieReason$1;
/**
* Narrows a {@link Reason} to {@link Interrupt}.
*
* Useful as a predicate for `Array.filter` when iterating over `cause.reasons`.
*
* **Example** (filtering interrupt reasons)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.interrupt(123)
* const interrupts = cause.reasons.filter(Cause.isInterruptReason)
* console.log(interrupts[0].fiberId) // 123
* ```
*
* @see {@link isFailReason} — narrow to `Fail`
* @see {@link isDieReason} — narrow to `Die`
*
* @category guards
* @since 4.0.0
*/
const isInterruptReason = isInterruptReason$1;
/**
* Creates a {@link Cause} from an array of {@link Reason} values.
*
* Use this when you already have individual reasons (e.g. from filtering or
* transforming another cause's `reasons` array) and need to wrap them back
* into a `Cause`.
*
* - Returns a new `Cause`; does not mutate the input array.
* - An empty array produces a cause equivalent to {@link empty}.
*
* **Example** (building a cause from reasons)
*
* ```ts
* import { Cause } from "effect"
*
* const reasons = [
*   Cause.makeFailReason("err1"),
*   Cause.makeFailReason("err2")
* ]
* const cause = Cause.fromReasons(reasons)
* console.log(cause.reasons.length) // 2
* ```
*
* @see {@link combine} — merge two existing causes
*
* @category constructors
* @since 2.0.0
*/
const fromReasons = causeFromReasons;
/**
* A {@link Cause} with an empty `reasons` array.
*
* Represents the absence of failure. Combining any cause with `empty` via
* {@link combine} returns the original cause unchanged.
*
* @see {@link combine}
*
* @category constructors
* @since 2.0.0
*/
const empty = causeEmpty;
/**
* Creates a {@link Cause} containing a single {@link Fail} reason with the
* given typed error.
*
* **Example** (creating a fail cause)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.fail("Something went wrong")
* console.log(cause.reasons.length) // 1
* console.log(Cause.isFailReason(cause.reasons[0])) // true
* ```
*
* @see {@link die} — for untyped defects
* @see {@link interrupt} — for fiber interruptions
*
* @category constructors
* @since 2.0.0
*/
const fail$2 = causeFail;
/**
* Creates a {@link Cause} containing a single {@link Die} reason with the
* given defect.
*
* **Example** (creating a die cause)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.die(new Error("Unexpected"))
* console.log(cause.reasons.length) // 1
* console.log(Cause.isDieReason(cause.reasons[0])) // true
* ```
*
* @see {@link fail} — for typed errors
* @see {@link interrupt} — for fiber interruptions
*
* @category constructors
* @since 2.0.0
*/
const die$2 = causeDie;
/**
* Creates a {@link Cause} containing a single {@link Interrupt} reason,
* optionally carrying the interrupting fiber's ID.
*
* **Example** (creating an interrupt cause)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.interrupt(123)
* console.log(cause.reasons.length) // 1
* console.log(Cause.isInterruptReason(cause.reasons[0])) // true
* ```
*
* @see {@link fail} — for typed errors
* @see {@link die} — for untyped defects
*
* @category constructors
* @since 2.0.0
*/
const interrupt$2 = causeInterrupt;
/**
* Creates a standalone {@link Interrupt} reason (not wrapped in a {@link Cause}),
* optionally carrying the interrupting fiber's ID.
*
* **Example** (creating an Interrupt reason)
*
* ```ts
* import { Cause } from "effect"
*
* const reason = Cause.makeInterruptReason(42)
* console.log(reason._tag) // "Interrupt"
* console.log(reason.fiberId) // 42
* ```
*
* @see {@link makeFailReason} — create a `Fail` reason
* @see {@link makeDieReason} — create a `Die` reason
*
* @category constructors
* @since 4.0.0
*/
const makeInterruptReason = makeInterruptReason$1;
/**
* Returns `true` if every reason in the cause is an {@link Interrupt} (and
* there is at least one reason).
*
* Useful for deciding whether a failure was entirely due to interruption and
* can be silently discarded.
*
* **Example** (checking interrupt-only causes)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.hasInterruptsOnly(Cause.interrupt(123))) // true
* console.log(Cause.hasInterruptsOnly(Cause.fail("error")))  // false
* console.log(Cause.hasInterruptsOnly(Cause.empty))          // false
* ```
*
* @see {@link hasInterrupts} — `true` if the cause contains *any* interrupts
*
* @category predicates
* @since 2.0.0
*/
const hasInterruptsOnly = hasInterruptsOnly$1;
/**
* Transforms the typed error values inside a {@link Cause} using the
* provided function. Only {@link Fail} reasons are affected; {@link Die}
* and {@link Interrupt} reasons pass through unchanged.
*
* Returns a new `Cause`; does not mutate the original.
*
* **Example** (mapping errors to uppercase)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.fail("error")
* const mapped = Cause.map(cause, (e) => e.toUpperCase())
* const reason = mapped.reasons[0]
* if (Cause.isFailReason(reason)) {
*   console.log(reason.error) // "ERROR"
* }
* ```
*
* @category mapping
* @since 4.0.0
*/
const map$2 = causeMap;
/**
* Merges two causes into a single cause whose `reasons` array is the union
* of both inputs (de-duplicated by value equality).
*
* - Combining with {@link empty} returns the other cause unchanged.
* - If the result is structurally equal to `self`, `self` is returned
*   (referential shortcut).
*
* **Example** (combining two causes)
*
* ```ts
* import { Cause } from "effect"
*
* const cause1 = Cause.fail("error1")
* const cause2 = Cause.fail("error2")
* const combined = Cause.combine(cause1, cause2)
* console.log(combined.reasons.length) // 2
* ```
*
* @see {@link fromReasons} — build a cause from an array of reasons
*
* @category combining
* @since 4.0.0
*/
const combine = causeCombine;
/**
* Collapses a {@link Cause} into a single `unknown` value, picking the "most
* important" failure in this order:
*
* 1. First {@link Fail} error (the `E` value)
* 2. First {@link Die} defect
* 3. A generic `Error("All fibers interrupted without error")` for interrupt-only causes
* 4. A generic `Error("Empty cause")` for {@link empty}
*
* This is the function used by `Effect.runPromise` and `Effect.runSync` to
* decide what to throw. It is lossy — use {@link prettyErrors} or iterate
* `cause.reasons` when you need all failures.
*
* **Example** (squashing a cause)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.squash(Cause.fail("error")))    // "error"
* console.log(Cause.squash(Cause.die("defect")))    // "defect"
* ```
*
* @see {@link prettyErrors} — non-lossy conversion to `Array<Error>`
* @see {@link pretty} — human-readable string rendering
*
* @category destructors
* @since 2.0.0
*/
const squash = causeSquash;
/**
* Returns `true` if the cause contains at least one {@link Fail} reason.
*
* **Example** (checking for typed errors)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.hasFails(Cause.fail("error"))) // true
* console.log(Cause.hasFails(Cause.die("defect"))) // false
* ```
*
* @see {@link hasDies} — check for defects
* @see {@link hasInterrupts} — check for interruptions
*
* @category predicates
* @since 2.0.0
*/
const hasFails$1 = hasFails$2;
/**
* Returns the first {@link Fail} reason from a cause, including its
* annotations. Returns `Filter.fail` with the remaining cause when no
* `Fail` is found.
*
* Use {@link findError} if you only need the unwrapped error value `E`.
*
* **Example** (extracting the first Fail reason)
*
* ```ts
* import { Cause, Result } from "effect"
*
* const result = Cause.findFail(Cause.fail("error"))
* if (!Result.isFailure(result)) {
*   console.log(result.success.error) // "error"
* }
* ```
*
* @see {@link findError} — extract the unwrapped `E` value
* @see {@link findDie} — extract the first `Die` reason
*
* @category filters
* @since 4.0.0
*/
const findFail = findFail$1;
/**
* Returns the first typed error value `E` from a cause.
* Returns `Filter.fail` with the remaining cause when no `Fail` is found.
*
* Use {@link findFail} if you need the full {@link Fail} reason (including
* annotations). Use {@link findErrorOption} if you prefer an `Option`.
*
* **Example** (extracting the first error value)
*
* ```ts
* import { Cause, Result } from "effect"
*
* const result = Cause.findError(Cause.fail("error"))
* if (!Result.isFailure(result)) {
*   console.log(result.success) // "error"
* }
* ```
*
* @see {@link findFail} — extract the full `Fail` reason
* @see {@link findErrorOption} — `Option`-based variant
*
* @category filters
* @since 4.0.0
*/
const findError$1 = findError$2;
/**
* Returns the first typed error value `E` from a cause wrapped in
* `Option.some`, or `Option.none` if no {@link Fail} reason exists.
*
* This is a convenience wrapper around {@link findError} for code that
* already works with `Option` instead of `Filter`.
*
* **Example** (extracting an error as Option)
*
* ```ts
* import { Cause, Option } from "effect"
*
* const some = Cause.findErrorOption(Cause.fail("error"))
* console.log(Option.isSome(some)) // true
*
* const none = Cause.findErrorOption(Cause.die("defect"))
* console.log(Option.isNone(none)) // true
* ```
*
* @see {@link findError} — `Filter`-based variant
*
* @category filters
* @since 4.0.0
*/
const findErrorOption$1 = findErrorOption$2;
/**
* Returns `true` if the cause contains at least one {@link Die} reason.
*
* **Example** (checking for defects)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.hasDies(Cause.die("defect"))) // true
* console.log(Cause.hasDies(Cause.fail("error"))) // false
* ```
*
* @see {@link hasFails} — check for typed errors
* @see {@link hasInterrupts} — check for interruptions
*
* @category predicates
* @since 2.0.0
*/
const hasDies$1 = hasDies$2;
/**
* Returns the first {@link Die} reason from a cause, including its
* annotations. Returns `Filter.fail` with the original cause when no
* `Die` is found.
*
* Use {@link findDefect} if you only need the unwrapped defect value.
*
* **Example** (extracting the first Die reason)
*
* ```ts
* import { Cause, Result } from "effect"
*
* const result = Cause.findDie(Cause.die("defect"))
* if (!Result.isFailure(result)) {
*   console.log(result.success.defect) // "defect"
* }
* ```
*
* @see {@link findDefect} — extract the unwrapped defect value
* @see {@link findFail} — extract the first `Fail` reason
*
* @category filters
* @since 4.0.0
*/
const findDie = findDie$1;
/**
* Returns the first defect value (`unknown`) from a cause.
* Returns `Filter.fail` with the original cause when no {@link Die} reason
* is found.
*
* Use {@link findDie} if you need the full `Die` reason (including
* annotations).
*
* **Example** (extracting the first defect)
*
* ```ts
* import { Cause, Result } from "effect"
*
* const result = Cause.findDefect(Cause.die("defect"))
* if (!Result.isFailure(result)) {
*   console.log(result.success) // "defect"
* }
* ```
*
* @see {@link findDie} — extract the full `Die` reason
* @see {@link findError} — extract the first typed error
*
* @category filters
* @since 4.0.0
*/
const findDefect$1 = findDefect$2;
/**
* Returns `true` if the cause contains at least one {@link Interrupt} reason.
*
* **Example** (checking for interruptions)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.hasInterrupts(Cause.interrupt(123))) // true
* console.log(Cause.hasInterrupts(Cause.fail("error")))  // false
* ```
*
* @see {@link hasInterruptsOnly} — `true` only when *all* reasons are interrupts
* @see {@link hasFails} — check for typed errors
* @see {@link hasDies} — check for defects
*
* @category predicates
* @since 2.0.0
*/
const hasInterrupts$1 = hasInterrupts$2;
/**
* Returns the first {@link Interrupt} reason from a cause, including its
* annotations. Returns `Filter.fail` with the original cause when no
* `Interrupt` is found.
*
* **Example** (extracting the first interrupt)
*
* ```ts
* import { Cause, Result } from "effect"
*
* const result = Cause.findInterrupt(Cause.interrupt(42))
* if (!Result.isFailure(result)) {
*   console.log(result.success.fiberId) // 42
* }
* ```
*
* @see {@link interruptors} — collect all interrupting fiber IDs as a `Set`
*
* @category filters
* @since 4.0.0
*/
const findInterrupt = findInterrupt$1;
/**
* Collects the fiber IDs of all {@link Interrupt} reasons in the cause into
* a `ReadonlySet`. Returns an empty set when the cause has no interrupts.
*
* This always succeeds (no `Filter.fail`). Use {@link filterInterruptors}
* for the `Filter`-based variant.
*
* **Example** (collecting interruptors)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.combine(
*   Cause.interrupt(1),
*   Cause.interrupt(2)
* )
* console.log(Cause.interruptors(cause)) // Set { 1, 2 }
* ```
*
* @see {@link filterInterruptors} — `Filter`-based variant
*
* @category accessors
* @since 4.0.0
*/
const interruptors = causeInterruptors;
/**
* Extracts the set of interrupting fiber IDs from a cause.
* Returns `Filter.fail` with the original cause when no {@link Interrupt}
* reason is found.
*
* Use {@link interruptors} if you always want a `Set` (possibly empty)
* without `Filter` wrapping.
*
* **Example** (extracting interruptors with Filter)
*
* ```ts
* import { Cause, Result } from "effect"
*
* const result = Cause.filterInterruptors(Cause.interrupt(1))
* if (!Result.isFailure(result)) {
*   console.log(result.success) // Set { 1 }
* }
* ```
*
* @see {@link interruptors} — always-succeeding variant
*
* @category filters
* @since 4.0.0
*/
const filterInterruptors = causeFilterInterruptors;
/**
* Converts a {@link Cause} into an `Array<Error>` suitable for logging or
* rethrowing.
*
* Each {@link Fail} and {@link Die} reason is converted into a standard
* `Error`:
*
* - **Objects / Error instances** — `message`, `name`, `stack`, and `cause`
*   are preserved. Extra enumerable properties are copied. Stack traces are
*   cleaned up and enriched with span annotations when available.
* - **Strings** — used directly as the `Error` message.
* - **Other primitives** (`null`, `undefined`, numbers, …) — wrapped in an
*   `Error` with message `"Unknown error: <value>"`.
*
* {@link Interrupt} reasons are collected separately. If the cause contains
* **only** interrupts (no `Fail` or `Die`), a single `InterruptError` is
* returned whose `cause` lists the interrupting fiber IDs.
*
* **Example** (converting a cause to errors)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.fail(new Error("boom"))
* const errors = Cause.prettyErrors(cause)
* console.log(errors[0].message) // "boom"
* ```
*
* @see {@link pretty} — renders the cause as a single string
* @see {@link squash} — lossy collapse to a single thrown value
*
* @since 4.0.0
* @category rendering
*/
const prettyErrors = causePrettyErrors;
/**
* Renders a {@link Cause} as a human-readable string for logging or
* debugging.
*
* Delegates to {@link prettyErrors} to convert each reason to an `Error`,
* then joins their stack traces with newlines. Nested `Error.cause` chains
* are rendered inline with indentation:
*
* ```text
* ErrorName: message
*     at ...
*     at ... {
*   [cause]: NestedError: message
*       at ...
* }
* ```
*
* Span annotations are appended to the relevant stack frames when available.
*
* **Example** (rendering a cause)
*
* ```ts
* import { Cause } from "effect"
*
* const cause = Cause.fail("something went wrong")
* console.log(Cause.pretty(cause))
* // Error: something went wrong
* //     at ...
* ```
*
* @see {@link prettyErrors} — get the individual `Error` instances
*
* @since 4.0.0
* @category rendering
*/
const pretty = causePretty;
/**
* Tests if an arbitrary value is a {@link NoSuchElementError}.
*
* **Example** (runtime type check)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.isNoSuchElementError(new Cause.NoSuchElementError())) // true
* console.log(Cause.isNoSuchElementError("nope")) // false
* ```
*
* @category guards
* @since 4.0.0
*/
const isNoSuchElementError = isNoSuchElementError$1;
/**
* Unique brand for {@link NoSuchElementError}.
*
* @since 4.0.0
* @category symbols
*/
const NoSuchElementErrorTypeId = NoSuchElementErrorTypeId$1;
/**
* Constructs a {@link NoSuchElementError} with an optional message.
*
* **Example** (creating a NoSuchElementError)
*
* ```ts
* import { Cause } from "effect"
*
* const error = new Cause.NoSuchElementError("Element not found")
* console.log(error.message) // "Element not found"
* ```
*
* @category constructors
* @since 4.0.0
*/
const NoSuchElementError = NoSuchElementError$1;
/**
* Tests if an arbitrary value is a {@link Done} signal.
*
* **Example** (runtime type check)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.isDone(Cause.Done())) // true
* console.log(Cause.isDone("not done"))   // false
* ```
*
* @category guards
* @since 4.0.0
*/
const isDone = isDone$1;
/**
* Unique brand for {@link Done} values.
*
* @since 4.0.0
* @category symbols
*/
const DoneTypeId = DoneTypeId$1;
/**
* Creates a {@link Done} signal with an optional value.
*
* @see {@link done} — create a failing `Effect` with `Done`
*
* @category constructors
* @since 4.0.0
*/
const Done = Done$1;
/**
* Creates an Effect that fails with a {@link Done} error. Shorthand for
* `Effect.fail(Cause.Done(value))`.
*
* @see {@link Done:var | Done} — create the signal value without an Effect
*
* @category constructors
* @since 4.0.0
*/
const done$1 = done$2;
/**
* Unique brand for {@link TimeoutError}.
*
* @since 4.0.0
* @category symbols
*/
const TimeoutErrorTypeId = TimeoutErrorTypeId$1;
/**
* Tests if an arbitrary value is a {@link TimeoutError}.
*
* **Example** (runtime type check)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.isTimeoutError(new Cause.TimeoutError())) // true
* console.log(Cause.isTimeoutError("nope")) // false
* ```
*
* @category guards
* @since 4.0.0
*/
const isTimeoutError = isTimeoutError$1;
/**
* Constructs a {@link TimeoutError} with an optional message.
*
* **Example** (creating a TimeoutError)
*
* ```ts
* import { Cause } from "effect"
*
* const error = new Cause.TimeoutError("Operation timed out")
* console.log(error.message) // "Operation timed out"
* ```
*
* @category constructors
* @since 4.0.0
*/
const TimeoutError = TimeoutError$1;
/**
* Unique brand for {@link IllegalArgumentError}.
*
* @since 4.0.0
* @category symbols
*/
const IllegalArgumentErrorTypeId = IllegalArgumentErrorTypeId$1;
/**
* Tests if an arbitrary value is an {@link IllegalArgumentError}.
*
* **Example** (runtime type check)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.isIllegalArgumentError(new Cause.IllegalArgumentError())) // true
* console.log(Cause.isIllegalArgumentError("nope")) // false
* ```
*
* @category guards
* @since 4.0.0
*/
const isIllegalArgumentError = isIllegalArgumentError$1;
/**
* Constructs an {@link IllegalArgumentError} with an optional message.
*
* **Example** (creating an IllegalArgumentError)
*
* ```ts
* import { Cause } from "effect"
*
* const error = new Cause.IllegalArgumentError("Invalid argument")
* console.log(error.message) // "Invalid argument"
* ```
*
* @category constructors
* @since 4.0.0
*/
const IllegalArgumentError = IllegalArgumentError$1;
/**
* Tests if an arbitrary value is an {@link ExceededCapacityError}.
*
* **Example** (runtime type check)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.isExceededCapacityError(new Cause.ExceededCapacityError())) // true
* console.log(Cause.isExceededCapacityError("nope")) // false
* ```
*
* @category guards
* @since 4.0.0
*/
const isExceededCapacityError = isExceededCapacityError$1;
/**
* Unique brand for {@link ExceededCapacityError}.
*
* @since 4.0.0
* @category symbols
*/
const ExceededCapacityErrorTypeId = ExceededCapacityErrorTypeId$1;
/**
* Constructs an {@link ExceededCapacityError} with an optional message.
*
* **Example** (creating an ExceededCapacityError)
*
* ```ts
* import { Cause } from "effect"
*
* const error = new Cause.ExceededCapacityError("Queue full")
* console.log(error.message) // "Queue full"
* ```
*
* @category constructors
* @since 4.0.0
*/
const ExceededCapacityError = ExceededCapacityError$1;
/**
* Unique brand for {@link UnknownError}.
*
* @since 4.0.0
* @category symbols
*/
const UnknownErrorTypeId = UnknownErrorTypeId$1;
/**
* Tests if an arbitrary value is an {@link UnknownError}.
*
* **Example** (runtime type check)
*
* ```ts
* import { Cause } from "effect"
*
* console.log(Cause.isUnknownError(new Cause.UnknownError("x"))) // true
* console.log(Cause.isUnknownError("nope")) // false
* ```
*
* @category guards
* @since 4.0.0
*/
const isUnknownError = isUnknownError$1;
/**
* Constructs an {@link UnknownError}. The first argument is the original
* cause (stored in `Error.cause`); the second is an optional human-readable
* message.
*
* **Example** (creating an UnknownError)
*
* ```ts
* import { Cause } from "effect"
*
* const error = new Cause.UnknownError({ raw: true }, "Unexpected value")
* console.log(error.message) // "Unexpected value"
* ```
*
* @category constructors
* @since 4.0.0
*/
const UnknownError = UnknownError$1;
/**
* Attaches metadata to every reason in a {@link Cause}.
*
* Annotations are stored as a `ServiceMap` on each reason and can be
* retrieved later via {@link reasonAnnotations} or {@link annotations}.
* The runtime uses this to attach stack traces and spans.
*
* - Returns a new `Cause`; does not mutate the input.
* - By default, existing keys are preserved. Pass `{ overwrite: true }` to
*   replace them.
*
* **Example** (annotating a cause)
*
* ```ts
* import { Cause, ServiceMap } from "effect"
*
* const cause = Cause.fail("error")
* const annotated = Cause.annotate(cause, ServiceMap.empty())
* ```
*
* @see {@link annotations} — read merged annotations from a cause
* @see {@link reasonAnnotations} — read annotations from a single reason
*
* @category annotations
* @since 4.0.0
*/
const annotate$1 = causeAnnotate;
/**
* Reads the annotations from a single {@link Reason} as a `ServiceMap`.
*
* Use this when you need tracing metadata (e.g. {@link StackTrace}) from
* a specific reason rather than the whole cause.
*
* @see {@link annotations} — merged annotations from all reasons in a cause
* @see {@link annotate} — attach annotations
*
* @category annotations
* @since 4.0.0
*/
const reasonAnnotations = reasonAnnotations$1;
/**
* Reads the merged annotations from all reasons in a {@link Cause}.
*
* Annotations from later reasons overwrite earlier ones when keys collide.
*
* @see {@link reasonAnnotations} — annotations from a single reason
* @see {@link annotate} — attach annotations
*
* @category annotations
* @since 4.0.0
*/
const annotations = causeAnnotations;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Data.js
/**
* Create a structured error constructor that supports Effect's error handling.
*
* This constructor creates errors that are both `Cause.YieldableError` (can be
* yielded in Effect generators) and have structural equality semantics.
*
* @example
* ```ts
* import { Data, Effect } from "effect"
*
* class NetworkError extends Data.Error<{ code: number; message: string }> {}
*
* const program = Effect.gen(function*() {
*   yield* new NetworkError({ code: 500, message: "Server error" })
* })
*
* Effect.runSync(Effect.exit(program))
* // Exit.fail(NetworkError({ code: 500, message: "Server error" }))
* ```
*
* @category constructors
* @since 2.0.0
*/
const Error$2 = Error$3;
/**
* Create a tagged error constructor with a specific tag for discriminated unions.
*
* This constructor creates errors with a `_tag` property that are both
* `Cause.YieldableError` and have structural equality semantics.
*
* @example
* ```ts
* import { Data, Effect, pipe } from "effect"
*
* class NetworkError extends Data.TaggedError("NetworkError")<{
*   code: number
*   message: string
* }> {}
*
* class ValidationError extends Data.TaggedError("ValidationError")<{
*   field: string
*   message: string
* }> {}
*
* const program = Effect.gen(function*() {
*   yield* new NetworkError({ code: 500, message: "Server error" })
* })
*
* const result = pipe(
*   program,
*   Effect.catchTag(
*     "NetworkError",
*     (error) => Effect.succeed(`Network error: ${error.message}`)
*   )
* )
* ```
*
* @category constructors
* @since 2.0.0
*/
const TaggedError = TaggedError$1;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Exit.js
ExitTypeId;
/**
* Tests whether an unknown value is an Exit.
*
* - Use to validate unknown values at system boundaries
* - Works as a type guard, narrowing to `Exit<unknown, unknown>`
*
* Does not inspect the contents of the Exit. Returns `true` for both Success
* and Failure exits.
*
* **Example** (Checking if a value is an Exit)
*
* ```ts
* import { Exit } from "effect"
*
* console.log(Exit.isExit(Exit.succeed(42))) // true
* console.log(Exit.isExit(Exit.fail("err"))) // true
* console.log(Exit.isExit("not an exit"))    // false
* ```
*
* @see {@link isSuccess} to check for a successful Exit
* @see {@link isFailure} to check for a failed Exit
*
* @category guards
* @since 2.0.0
*/
const isExit = isExit$1;
/**
* Creates a successful Exit containing the given value.
*
* - Use to wrap a known success value into an Exit
* - Use when constructing test data or returning explicit results
*
* Returns a `Success<A>` with the provided value. Does not perform any
* computation.
*
* **Example** (Creating a successful Exit)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.succeed(42)
* console.log(Exit.isSuccess(exit)) // true
* ```
*
* @see {@link fail} to create a failed Exit
* @see {@link void} for a pre-allocated success with no value
*
* @category constructors
* @since 2.0.0
*/
const succeed$1 = exitSucceed;
/**
* Creates a failed Exit from a Cause.
*
* - Use when you already have a `Cause<E>` and want to wrap it in an Exit
* - Use for advanced error handling where you need full control over the Cause structure
*
* Returns a `Failure<never, E>`. If you only have an error value, use
* {@link fail} instead.
*
* **Example** (Creating a failed Exit from a Cause)
*
* ```ts
* import { Cause, Exit } from "effect"
*
* const cause = Cause.fail("Something went wrong")
* const exit = Exit.failCause(cause)
* console.log(Exit.isFailure(exit)) // true
* ```
*
* @see {@link fail} to create a Failure from a plain error value
* @see {@link die} to create a Failure from a defect
*
* @category constructors
* @since 2.0.0
*/
const failCause$1 = exitFailCause;
/**
* Creates a failed Exit from a typed error value.
*
* - Use for expected, recoverable failures
* - The error is wrapped in a `Cause.Fail` internally
*
* Returns a `Failure<never, E>`.
*
* **Example** (Creating a failed Exit)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.fail("Something went wrong")
* console.log(Exit.isFailure(exit)) // true
* ```
*
* @see {@link succeed} to create a successful Exit
* @see {@link die} to create a Failure from an unexpected defect
* @see {@link failCause} to create a Failure from a full Cause
*
* @category constructors
* @since 2.0.0
*/
const fail$1 = exitFail;
/**
* Creates a failed Exit from a defect (unexpected error).
*
* - Use for unexpected, unrecoverable errors that should not appear in the typed error channel
* - The defect is wrapped in a `Cause.Die` internally
*
* Returns a `Failure<never>` with `E = never`, since defects do not appear in
* the typed error channel.
*
* **Example** (Creating a defect Exit)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.die(new Error("Unexpected error"))
* console.log(Exit.isFailure(exit)) // true
* ```
*
* @see {@link fail} to create a Failure from a typed error
* @see {@link hasDies} to check whether an Exit contains defects
*
* @category constructors
* @since 2.0.0
*/
const die$1 = exitDie;
/**
* Creates a failed Exit representing fiber interruption.
*
* - Use to signal that a fiber was interrupted
* - Optionally pass a fiber ID to identify which fiber was interrupted
*
* Returns a `Failure<never>` with an `Interrupt` cause.
*
* **Example** (Creating an interruption Exit)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.interrupt(123)
* console.log(Exit.isFailure(exit)) // true
* console.log(Exit.hasInterrupts(exit)) // true
* ```
*
* @see {@link hasInterrupts} to check whether an Exit contains interruptions
*
* @category constructors
* @since 2.0.0
*/
const interrupt$1 = exitInterrupt;
const void_$2 = exitVoid;
/**
* Tests whether an Exit is a Success.
*
* - Use as a type guard to narrow `Exit<A, E>` to `Success<A, E>`
* - After narrowing, the `value` property becomes accessible
*
* **Example** (Narrowing to Success)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.succeed(42)
*
* if (Exit.isSuccess(exit)) {
*   console.log(exit.value) // 42
* }
* ```
*
* @see {@link isFailure} for the opposite check
* @see {@link match} for exhaustive pattern matching
*
* @category guards
* @since 2.0.0
*/
const isSuccess$1 = exitIsSuccess;
/**
* Tests whether an Exit is a Failure.
*
* - Use as a type guard to narrow `Exit<A, E>` to `Failure<A, E>`
* - After narrowing, the `cause` property becomes accessible
*
* **Example** (Narrowing to Failure)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.fail("error")
*
* if (Exit.isFailure(exit)) {
*   console.log(exit.cause)
* }
* ```
*
* @see {@link isSuccess} for the opposite check
* @see {@link match} for exhaustive pattern matching
*
* @category guards
* @since 2.0.0
*/
const isFailure$1 = exitIsFailure;
/**
* Tests whether a failed Exit contains typed errors (Fail reasons).
*
* - Use to distinguish typed failures from defects or interruptions
* - Returns `false` for successful exits
*
* Only checks for `Fail` reasons in the Cause. A Cause with only `Die` or
* `Interrupt` reasons returns `false`.
*
* **Example** (Checking for typed errors)
*
* ```ts
* import { Exit } from "effect"
*
* console.log(Exit.hasFails(Exit.fail("err")))           // true
* console.log(Exit.hasFails(Exit.die(new Error("bug")))) // false
* console.log(Exit.hasFails(Exit.succeed(42)))            // false
* ```
*
* @see {@link hasDies} to check for defects
* @see {@link hasInterrupts} to check for interruptions
*
* @category guards
* @since 4.0.0
*/
const hasFails = exitHasFails;
/**
* Tests whether a failed Exit contains defects (Die reasons).
*
* - Use to check for unexpected errors
* - Returns `false` for successful exits
*
* Only checks for `Die` reasons in the Cause. A Cause with only `Fail` or
* `Interrupt` reasons returns `false`.
*
* **Example** (Checking for defects)
*
* ```ts
* import { Exit } from "effect"
*
* console.log(Exit.hasDies(Exit.die(new Error("bug")))) // true
* console.log(Exit.hasDies(Exit.fail("err")))           // false
* console.log(Exit.hasDies(Exit.succeed(42)))            // false
* ```
*
* @see {@link hasFails} to check for typed errors
* @see {@link hasInterrupts} to check for interruptions
*
* @category guards
* @since 4.0.0
*/
const hasDies = exitHasDies;
/**
* Tests whether a failed Exit contains interruptions (Interrupt reasons).
*
* - Use to check if a fiber was interrupted
* - Returns `false` for successful exits
*
* Only checks for `Interrupt` reasons in the Cause. A Cause with only `Fail`
* or `Die` reasons returns `false`.
*
* **Example** (Checking for interruptions)
*
* ```ts
* import { Exit } from "effect"
*
* console.log(Exit.hasInterrupts(Exit.interrupt(1))) // true
* console.log(Exit.hasInterrupts(Exit.fail("err")))  // false
* console.log(Exit.hasInterrupts(Exit.succeed(42)))   // false
* ```
*
* @see {@link hasFails} to check for typed errors
* @see {@link hasDies} to check for defects
*
* @category guards
* @since 4.0.0
*/
const hasInterrupts = exitHasInterrupts;
/**
* Extracts the Success variant from an Exit for use in filter pipelines.
*
* - Use with Filter-based composition
* - Returns the `Success<A>` if the Exit succeeded, or a `Filter.fail` wrapping the Failure otherwise
*
* **Example** (Filtering for success)
*
* ```ts
* import { Exit, Filter } from "effect"
*
* const exit = Exit.succeed(42)
* const result = Exit.filterSuccess(exit)
* // If exit is a success, result is the Success object
* // If exit is a failure, result is a Filter.fail marker
* ```
*
* @see {@link filterFailure} for the inverse
* @see {@link filterValue} to extract the raw value instead of the Success object
*
* @category filters
* @since 4.0.0
*/
const filterSuccess = exitFilterSuccess;
/**
* Extracts the success value from an Exit for use in filter pipelines.
*
* - Use with Filter-based composition when you want the raw value, not the Success wrapper
* - Returns the value `A` if the Exit succeeded, or a `Filter.fail` wrapping the Failure otherwise
*
* **Example** (Filtering for the value)
*
* ```ts
* import { Exit, Filter } from "effect"
*
* const exit = Exit.succeed(42)
* const result = Exit.filterValue(exit)
* // If exit is a success, result is 42
* // If exit is a failure, result is a Filter.fail marker
* ```
*
* @see {@link filterSuccess} to get the full Success object
* @see {@link getSuccess} to get the value as an Option instead
*
* @category filters
* @since 4.0.0
*/
const filterValue = exitFilterValue;
/**
* Extracts the Failure variant from an Exit for use in filter pipelines.
*
* - Use with Filter-based composition
* - Returns the `Failure<never, E>` if the Exit failed, or a `Filter.fail` wrapping the Success otherwise
*
* **Example** (Filtering for failure)
*
* ```ts
* import { Exit, Filter } from "effect"
*
* const exit = Exit.fail("err")
* const result = Exit.filterFailure(exit)
* // If exit is a failure, result is the Failure object
* // If exit is a success, result is a Filter.fail marker
* ```
*
* @see {@link filterSuccess} for the inverse
* @see {@link filterCause} to extract the Cause directly
*
* @category filters
* @since 4.0.0
*/
const filterFailure = exitFilterFailure;
/**
* Extracts the Cause from a failed Exit for use in filter pipelines.
*
* - Use with Filter-based composition when you want the raw Cause, not the Failure wrapper
* - Returns the `Cause<E>` if the Exit failed, or a `Filter.fail` wrapping the Success otherwise
*
* **Example** (Filtering for the cause)
*
* ```ts
* import { Exit, Filter } from "effect"
*
* const exit = Exit.fail("err")
* const result = Exit.filterCause(exit)
* // If exit is a failure, result is the Cause
* // If exit is a success, result is a Filter.fail marker
* ```
*
* @see {@link filterFailure} to get the full Failure object
* @see {@link getCause} to get the Cause as an Option instead
*
* @category filters
* @since 4.0.0
*/
const filterCause = exitFilterCause;
/**
* Extracts the first typed error value from a failed Exit for use in filter
* pipelines.
*
* - Use when you need just the first `E` from the Cause
* - Returns the error `E` if one exists, or `Filter.fail` wrapping the original Exit if the Exit has no typed errors
*
* Only finds the first Fail reason. If the Cause has multiple errors, the rest
* are ignored.
*
* **Example** (Finding the first typed error)
*
* ```ts
* import { Exit, Filter } from "effect"
*
* const exit = Exit.fail("not found")
* const result = Exit.findError(exit)
* // result is "not found"
*
* const defect = Exit.die(new Error("bug"))
* const noError = Exit.findError(defect)
* // noError is a Filter.fail marker
* ```
*
* @see {@link findErrorOption} to get the error as an Option instead
* @see {@link findDefect} to find defects instead
*
* @category filters
* @since 4.0.0
*/
const findError = exitFindError;
/**
* Extracts the first defect from a failed Exit for use in filter pipelines.
*
* - Use when you need to inspect unexpected errors
* - Returns the defect value if one exists, or `Filter.fail` wrapping the original Exit if the Exit has no defects
*
* Only finds the first Die reason. If the Cause has multiple defects, the rest
* are ignored.
*
* **Example** (Finding the first defect)
*
* ```ts
* import { Exit, Filter } from "effect"
*
* const exit = Exit.die("boom")
* const result = Exit.findDefect(exit)
* // result is "boom"
*
* const typed = Exit.fail("err")
* const noDefect = Exit.findDefect(typed)
* // noDefect is a Filter.fail marker
* ```
*
* @see {@link findError} to find typed errors instead
* @see {@link hasDies} to check for defects without extracting them
*
* @category filters
* @since 4.0.0
*/
const findDefect = exitFindDefect;
/**
* Pattern matches on an Exit, handling both success and failure cases.
*
* - Use for exhaustive handling of both outcomes
* - Calls `onSuccess` with the value if the Exit is a Success
* - Calls `onFailure` with the Cause if the Exit is a Failure
*
* Supports both curried and direct call styles (data-last and data-first).
*
* **Example** (Matching on an Exit)
*
* ```ts
* import { Exit } from "effect"
*
* const success = Exit.succeed(42)
*
* const result = Exit.match(success, {
*   onSuccess: (value) => `Got: ${value}`,
*   onFailure: () => "Failed"
* })
* console.log(result) // "Got: 42"
* ```
*
* @see {@link isSuccess} and {@link isFailure} for simple boolean checks
*
* @category pattern matching
* @since 2.0.0
*/
const match$3 = exitMatch;
/**
* Transforms the success value of an Exit using the given function.
*
* - Use to apply a transformation to the value inside a successful Exit
* - Has no effect on failures, which pass through unchanged
*
* Allocates a new Exit if successful. Does not mutate the input.
* Supports both curried and direct call styles.
*
* **Example** (Mapping over a success)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.succeed(21)
* const doubled = Exit.map(exit, (x) => x * 2)
* console.log(Exit.isSuccess(doubled) && doubled.value) // 42
* ```
*
* @see {@link mapError} to transform the error
* @see {@link mapBoth} to transform both success and error
*
* @category combinators
* @since 2.0.0
*/
const map$1 = exitMap;
/**
* Transforms the typed error of a failed Exit using the given function.
*
* - Use to remap typed errors while preserving the Exit structure
* - Has no effect on successes, which pass through unchanged
* - Only transforms typed errors (Fail reasons). If the Cause contains only defects or interruptions, the failure passes through unchanged.
*
* Allocates a new Exit if the error is transformed. Does not mutate the input.
* Supports both curried and direct call styles.
*
* **Example** (Mapping over an error)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.fail("bad input")
* const mapped = Exit.mapError(exit, (e) => new Error(e))
* console.log(Exit.isFailure(mapped)) // true
* ```
*
* @see {@link map} to transform the success value
* @see {@link mapBoth} to transform both success and error
*
* @category combinators
* @since 2.0.0
*/
const mapError$1 = exitMapError;
/**
* Transforms both the success value and typed error of an Exit.
*
* - Use when you need to remap both channels in one step
* - `onSuccess` transforms the value if the Exit is a Success
* - `onFailure` transforms the typed error if the Exit is a Failure with a Fail reason
* - If the Cause contains only defects or interruptions, the failure passes through unchanged
*
* Allocates a new Exit. Does not mutate the input.
* Supports both curried and direct call styles.
*
* **Example** (Mapping both channels)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.succeed(42)
* const mapped = Exit.mapBoth(exit, {
*   onSuccess: (x) => String(x),
*   onFailure: (e: string) => new Error(e)
* })
* console.log(Exit.isSuccess(mapped) && mapped.value) // "42"
* ```
*
* @see {@link map} to transform only the success value
* @see {@link mapError} to transform only the error
*
* @category combinators
* @since 2.0.0
*/
const mapBoth$1 = exitMapBoth;
/**
* Discards the success value of an Exit, replacing it with `void`.
*
* - Use when you only care about whether the computation succeeded or failed, not the value
* - Failures pass through unchanged
*
* Allocates a new Exit if successful. Does not mutate the input.
*
* **Example** (Discarding the success value)
*
* ```ts
* import { Exit } from "effect"
*
* const exit = Exit.succeed(42)
* const voided = Exit.asVoid(exit)
* console.log(Exit.isSuccess(voided)) // true
* ```
*
* @see {@link void} for a pre-allocated void success
* @see {@link asVoidAll} to combine multiple exits into a single void Exit
*
* @category combinators
* @since 2.0.0
*/
const asVoid$1 = exitAsVoid;
/**
* Combines multiple Exit values into a single `Exit<void, E>`.
*
* - Use to validate that all exits in a collection succeeded
* - If all exits are successful, returns a void success
* - If any exit is a failure, returns a single failure with all error causes combined
*
* Iterates over the entire collection. Collects all failure causes, not just
* the first.
*
* **Example** (Combining exits)
*
* ```ts
* import { Exit } from "effect"
*
* const exits = [Exit.succeed(1), Exit.succeed(2), Exit.succeed(3)]
* console.log(Exit.isSuccess(Exit.asVoidAll(exits))) // true
*
* const mixed = [Exit.succeed(1), Exit.fail("err"), Exit.succeed(3)]
* console.log(Exit.isFailure(Exit.asVoidAll(mixed))) // true
* ```
*
* @see {@link asVoid} to discard the value of a single Exit
*
* @category combinators
* @since 4.0.0
*/
const asVoidAll = exitAsVoidAll;
/**
* Returns the success value of an Exit as an Option.
*
* - Use when you want to optionally extract the value without pattern matching
* - Returns `Option.some(value)` for a Success, `Option.none()` for a Failure
*
* **Example** (Getting the success value)
*
* ```ts
* import { Exit } from "effect"
*
* console.log(Exit.getSuccess(Exit.succeed(42))) // { _tag: "Some", value: 42 }
* console.log(Exit.getSuccess(Exit.fail("err"))) // { _tag: "None" }
* ```
*
* @see {@link getCause} to extract the Cause of a failure
* @see {@link filterValue} for filter-pipeline usage
*
* @category Accessors
* @since 4.0.0
*/
const getSuccess = exitGetSuccess;
/**
* Returns the Cause of a failed Exit as an Option.
*
* - Use when you want to optionally inspect the failure cause
* - Returns `Option.some(cause)` for a Failure, `Option.none()` for a Success
*
* **Example** (Getting the failure cause)
*
* ```ts
* import { Exit } from "effect"
*
* console.log(Exit.getCause(Exit.fail("err"))) // { _tag: "Some", value: ... }
* console.log(Exit.getCause(Exit.succeed(42))) // { _tag: "None" }
* ```
*
* @see {@link getSuccess} to extract the success value
* @see {@link filterCause} for filter-pipeline usage
*
* @category Accessors
* @since 4.0.0
*/
const getCause = exitGetCause;
/**
* Returns the first typed error from a failed Exit as an Option.
*
* - Use when you want to optionally extract a typed error without dealing with the full Cause
* - Returns `Option.some(error)` if the Cause contains a Fail reason, `Option.none()` otherwise
* - Returns `Option.none()` for successes, defect-only failures, and interrupt-only failures
*
* **Example** (Getting the first error)
*
* ```ts
* import { Exit } from "effect"
*
* console.log(Exit.findErrorOption(Exit.fail("err")))           // { _tag: "Some", value: "err" }
* console.log(Exit.findErrorOption(Exit.die(new Error("bug")))) // { _tag: "None" }
* console.log(Exit.findErrorOption(Exit.succeed(42)))            // { _tag: "None" }
* ```
*
* @see {@link findError} for filter-pipeline usage
* @see {@link getCause} to get the full Cause as an Option
*
* @category Accessors
* @since 4.0.0
*/
const findErrorOption = exitFindErrorOption;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Deferred.js
const DeferredProto = {
	["~effect/Deferred"]: {
		_A: identity,
		_E: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/**
* Unsafely creates a new `Deferred`
*
* @example
* ```ts
* import { Deferred } from "effect"
*
* const deferred = Deferred.makeUnsafe<number>()
* console.log(deferred)
* ```
*
* @since 2.0.0
* @category unsafe
*/
const makeUnsafe$4 = () => {
	const self = Object.create(DeferredProto);
	self.resumes = void 0;
	self.effect = void 0;
	return self;
};
const _await = (self) => callback$1((resume) => {
	if (self.effect) return resume(self.effect);
	self.resumes ??= [];
	self.resumes.push(resume);
	return sync$1(() => {
		const index = self.resumes.indexOf(resume);
		self.resumes.splice(index, 1);
	});
});
/**
* Completes the deferred with the result of the specified effect. If the
* deferred has already been completed, the method will produce false.
*
* @example
* ```ts
* import { Deferred, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const deferred = yield* Deferred.make<number>()
*   const completed = yield* Deferred.completeWith(deferred, Effect.succeed(42))
*   console.log(completed) // true
*
*   const value = yield* Deferred.await(deferred)
*   console.log(value) // 42
* })
* ```
*
* @since 2.0.0
* @category utils
*/
const completeWith = /* @__PURE__ */ dual(2, (self, effect) => sync$1(() => doneUnsafe(self, effect)));
/**
* Exits the `Deferred` with the specified `Exit` value, which will be
* propagated to all fibers waiting on the value of the `Deferred`.
*
* @example
* ```ts
* import { Deferred, Effect, Exit } from "effect"
*
* const program = Effect.gen(function*() {
*   const deferred = yield* Deferred.make<number>()
*   yield* Deferred.done(deferred, Exit.succeed(42))
*
*   const value = yield* Deferred.await(deferred)
*   console.log(value) // 42
* })
* ```
*
* @since 2.0.0
* @category utils
*/
const done = completeWith;
/**
* Unsafely exits the `Deferred` with the specified `Exit` value, which will be
* propagated to all fibers waiting on the value of the `Deferred`.
*
* @example
* ```ts
* import { Deferred, Effect } from "effect"
*
* const deferred = Deferred.makeUnsafe<number>()
* const success = Deferred.doneUnsafe(deferred, Effect.succeed(42))
* console.log(success) // true
* ```
*
* @since 2.0.0
* @category unsafe
*/
const doneUnsafe = (self, effect) => {
	if (self.effect) return false;
	self.effect = effect;
	if (self.resumes) {
		for (let i = 0; i < self.resumes.length; i++) self.resumes[i](effect);
		self.resumes = void 0;
	}
	return true;
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Scope.js
/**
* The `Scope` module provides functionality for managing resource lifecycles
* and cleanup operations in a functional and composable manner.
*
* A `Scope` represents a context where resources can be acquired and automatically
* cleaned up when the scope is closed. This is essential for managing resources
* like file handles, database connections, or any other resources that need
* proper cleanup.
*
* Scopes support both sequential and parallel finalization strategies:
* - Sequential: Finalizers run one after another in reverse order of registration
* - Parallel: Finalizers run concurrently for better performance
*
* @since 2.0.0
*/
ScopeTypeId;
ScopeCloseableTypeId;
/**
* The service tag for `Scope`, used for dependency injection in the Effect system.
*
* @example
* ```ts
* import { Effect, Scope } from "effect"
*
* const program = Effect.gen(function*() {
*   // Access the scope from the context
*   const scope = yield* Scope.Scope
*
*   // Use the scope for resource management
*   yield* Scope.addFinalizer(scope, Effect.log("Cleanup"))
* })
*
* // Provide a scope to the program
* const scoped = Effect.scoped(program)
* ```
*
* @since 2.0.0
* @category tags
*/
const Scope = scopeTag;
/**
* Creates a new `Scope` with the specified finalizer strategy.
*
* @example
* ```ts
* import { Console, Effect, Exit, Scope } from "effect"
*
* const program = Effect.gen(function*() {
*   // Create a scope with sequential cleanup
*   const scope = yield* Scope.make("sequential")
*
*   // Add finalizers
*   yield* Scope.addFinalizer(scope, Console.log("Cleanup 1"))
*   yield* Scope.addFinalizer(scope, Console.log("Cleanup 2"))
*
*   // Close the scope (finalizers run in reverse order)
*   yield* Scope.close(scope, Exit.void)
*   // Output: "Cleanup 2", then "Cleanup 1"
* })
* ```
*
* @category constructors
* @since 2.0.0
*/
const make$6 = scopeMake;
/**
* Creates a new `Scope` synchronously without wrapping it in an `Effect`.
* This is useful when you need a scope immediately but should be used with caution
* as it doesn't provide the same safety guarantees as the `Effect`-wrapped version.
*
* @example
* ```ts
* import { Console, Effect, Exit, Scope } from "effect"
*
* // Create a scope immediately
* const scope = Scope.makeUnsafe("sequential")
*
* // Use it in an Effect program
* const program = Effect.gen(function*() {
*   yield* Scope.addFinalizer(scope, Console.log("Cleanup"))
*   yield* Scope.close(scope, Exit.void)
* })
* ```
*
* @since 4.0.0
* @category constructors
*/
const makeUnsafe$3 = scopeMakeUnsafe;
/**
* Provides a `Scope` to an `Effect`, removing the `Scope` requirement from its context.
* This allows you to run effects that require a scope by explicitly providing one.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Scope.extend`
*
* @example
* ```ts
* import { Console, Effect, Scope } from "effect"
*
* // An effect that requires a Scope
* const program = Effect.gen(function*() {
*   const scope = yield* Scope.Scope
*   yield* Scope.addFinalizer(scope, Console.log("Cleanup"))
*   yield* Console.log("Working...")
* })
*
* // Provide a scope to the program
* const withScope = Effect.gen(function*() {
*   const scope = yield* Scope.make()
*   yield* Scope.provide(scope)(program)
* })
* ```
*
* @since 4.0.0
* @category combinators
*/
const provide$3 = provideScope;
/**
* Adds a finalizer to a scope that will be executed when the scope is closed.
* Finalizers are cleanup functions that receive the exit value of the scope.
*
* @example
* ```ts
* import { Console, Effect, Exit, Scope } from "effect"
*
* const withResource = Effect.gen(function*() {
*   const scope = yield* Scope.make()
*
*   // Add a finalizer for cleanup
*   yield* Scope.addFinalizerExit(
*     scope,
*     (exit) =>
*       Console.log(
*         `Cleaning up resource. Exit: ${
*           Exit.isSuccess(exit) ? "Success" : "Failure"
*         }`
*       )
*   )
*
*   // Use the resource
*   yield* Console.log("Using resource")
*
*   // Close the scope
*   yield* Scope.close(scope, Exit.void)
* })
* ```
*
* @category combinators
* @since 4.0.0
*/
const addFinalizerExit = scopeAddFinalizerExit;
/**
* Adds a finalizer to a scope. The finalizer is a simple `Effect` that will be
* executed when the scope is closed, regardless of whether the scope closes
* successfully or with an error.
*
* @example
* ```ts
* import { Console, Effect, Exit, Scope } from "effect"
*
* const program = Effect.gen(function*() {
*   const scope = yield* Scope.make()
*
*   // Add simple finalizers
*   yield* Scope.addFinalizer(scope, Console.log("Cleanup task 1"))
*   yield* Scope.addFinalizer(scope, Console.log("Cleanup task 2"))
*   yield* Scope.addFinalizer(scope, Effect.log("Cleanup task 3"))
*
*   // Do some work
*   yield* Console.log("Doing work...")
*
*   // Close the scope
*   yield* Scope.close(scope, Exit.void)
* })
* ```
*
* @since 4.0.0
* @category combinators
*/
const addFinalizer$1 = scopeAddFinalizer;
/**
* Creates a child scope from a parent scope. The child scope inherits the
* parent's finalization strategy unless overridden.
*
* @example
* ```ts
* import { Console, Effect, Exit, Scope } from "effect"
*
* const nestedScopes = Effect.gen(function*() {
*   const parentScope = yield* Scope.make("sequential")
*
*   // Add finalizer to parent
*   yield* Scope.addFinalizer(parentScope, Console.log("Parent cleanup"))
*
*   // Create child scope
*   const childScope = yield* Scope.fork(parentScope, "parallel")
*
*   // Add finalizer to child
*   yield* Scope.addFinalizer(childScope, Console.log("Child cleanup"))
*
*   // Close child first, then parent
*   yield* Scope.close(childScope, Exit.void)
*   yield* Scope.close(parentScope, Exit.void)
* })
* ```
*
* @category combinators
* @since 4.0.0
*/
const fork = scopeFork;
/**
* Creates a child scope from a parent scope synchronously without wrapping it in an `Effect`.
* The child scope inherits the parent's finalization strategy unless overridden.
*
* @example
* ```ts
* import { Console, Effect, Exit, Scope } from "effect"
*
* const program = Effect.gen(function*() {
*   const parentScope = Scope.makeUnsafe("sequential")
*   const childScope = Scope.forkUnsafe(parentScope, "parallel")
*
*   // Add finalizers to both scopes
*   yield* Scope.addFinalizer(parentScope, Console.log("Parent cleanup"))
*   yield* Scope.addFinalizer(childScope, Console.log("Child cleanup"))
*
*   // Close child first, then parent
*   yield* Scope.close(childScope, Exit.void)
*   yield* Scope.close(parentScope, Exit.void)
* })
* ```
*
* @since 4.0.0
* @category combinators
*/
const forkUnsafe = scopeForkUnsafe;
/**
* Closes a scope, running all registered finalizers in the appropriate order.
* The exit value is passed to each finalizer.
*
* @example
* ```ts
* import { Console, Effect, Exit, Scope } from "effect"
*
* const resourceManagement = Effect.gen(function*() {
*   const scope = yield* Scope.make("sequential")
*
*   // Add multiple finalizers
*   yield* Scope.addFinalizer(scope, Console.log("Close database connection"))
*   yield* Scope.addFinalizer(scope, Console.log("Close file handle"))
*   yield* Scope.addFinalizer(scope, Console.log("Release memory"))
*
*   // Do some work...
*   yield* Console.log("Performing operations...")
*
*   // Close scope - finalizers run in reverse order of registration
*   yield* Scope.close(scope, Exit.succeed("Success!"))
*   // Output: "Release memory", "Close file handle", "Close database connection"
* })
* ```
*
* @category combinators
* @since 4.0.0
*/
const close = scopeClose;
/**
* @since 4.0.0
*/
const closeUnsafe = scopeCloseUnsafe;
/**
* @category combinators
* @since 4.0.0
*/
const use = scopeUse;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Layer.js
const TypeId$10 = "~effect/Layer";
const MemoMapTypeId = "~effect/Layer/MemoMap";
/**
* Returns `true` if the specified value is a `Layer`, `false` otherwise.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* const dbLayer = Layer.succeed(Database)({
*   query: (sql: string) => Effect.succeed("result")
* })
* const notALayer = { someProperty: "value" }
*
* console.log(Layer.isLayer(dbLayer)) // true
* console.log(Layer.isLayer(notALayer)) // false
* ```
*
* @since 2.0.0
* @category getters
*/
const isLayer = (u) => hasProperty(u, TypeId$10);
const LayerProto = {
	[TypeId$10]: {
		_ROut: identity,
		_E: identity,
		_RIn: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const fromBuildUnsafe = (build) => {
	const self = Object.create(LayerProto);
	self.build = build;
	return self;
};
/**
* Constructs a Layer from a function that uses a `MemoMap` and `Scope` to build the layer.
*
* The function receives a `MemoMap` for memoization and a `Scope` for resource management.
* A child scope is created, and if the build fails, the child scope is closed.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* const databaseLayer = Layer.fromBuild(() =>
*   Effect.sync(() =>
*     ServiceMap.make(Database, {
*       query: (sql: string) => Effect.succeed("result")
*     })
*   )
* )
* ```
*
* @since 4.0.0
* @category constructors
*/
const fromBuild = (build) => fromBuildUnsafe((memoMap, scope) => {
	const layerScope = forkUnsafe(scope);
	return onExit$1(build(memoMap, layerScope), (exit) => exit._tag === "Failure" ? close(layerScope, exit) : void_$3);
});
/**
* Constructs a Layer from a function that uses a `MemoMap` and `Scope` to build the layer,
* with automatic memoization.
*
* This is similar to `fromBuild` but provides automatic memoization of the layer construction.
* The layer will be memoized based on the provided `MemoMap`.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* const databaseLayer = Layer.fromBuildMemo(() =>
*   Effect.sync(() =>
*     ServiceMap.make(Database, {
*       query: (sql: string) => Effect.succeed("result")
*     })
*   )
* )
* ```
*
* @since 4.0.0
* @category constructors
*/
const fromBuildMemo = (build) => {
	const self = fromBuild((memoMap, scope) => memoMap.getOrElseMemoize(self, scope, build));
	return self;
};
var MemoMapImpl = class {
	get [MemoMapTypeId]() {
		return MemoMapTypeId;
	}
	map = /* @__PURE__ */ new Map();
	getOrElseMemoize(layer, scope, build) {
		if (this.map.has(layer)) {
			const entry = this.map.get(layer);
			entry.observers++;
			return andThen$1(scopeAddFinalizerExit(scope, (exit) => entry.finalizer(exit)), entry.effect);
		}
		const layerScope = makeUnsafe$3();
		const deferred = makeUnsafe$4();
		const entry = {
			observers: 1,
			effect: _await(deferred),
			finalizer: (exit) => suspend$1(() => {
				entry.observers--;
				if (entry.observers === 0) {
					this.map.delete(layer);
					return close(layerScope, exit);
				}
				return void_$3;
			})
		};
		this.map.set(layer, entry);
		return scopeAddFinalizerExit(scope, entry.finalizer).pipe(flatMap$1(() => build(this, layerScope)), onExit$1((exit) => {
			entry.effect = exit;
			return done(deferred, exit);
		}));
	}
};
/**
* Constructs a `MemoMap` that can be used to build additional layers.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* // Create a memo map for manual layer building
* const program = Effect.gen(function*() {
*   const memoMap = Layer.makeMemoMapUnsafe()
*   const scope = yield* Effect.scope
*
*   const dbLayer = Layer.succeed(Database)({
*     query: (sql: string) => Effect.succeed("result")
*   })
*   const services = yield* Layer.buildWithMemoMap(dbLayer, memoMap, scope)
*
*   return ServiceMap.get(services, Database)
* })
* ```
*
* @since 4.0.0
* @category memo map
*/
const makeMemoMapUnsafe = () => new MemoMapImpl();
/**
* A service reference for the current `MemoMap` used in layer construction.
*
* This service provides access to the current memoization map during layer building,
* allowing layers to share memoized results.
*
* @since 3.13.0
* @category models
*/
var CurrentMemoMap = class extends Service()("effect/Layer/CurrentMemoMap") {
	static getOrCreate = /* @__PURE__ */ getOrElse(this, makeMemoMapUnsafe);
};
/**
* Builds a layer into an `Effect` value, using the specified `MemoMap` to memoize
* the layer construction.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* class Logger extends ServiceMap.Service<Logger, {
*   readonly log: (msg: string) => Effect.Effect<void>
* }>()("Logger") {}
*
* // Build layers with explicit memoization control
* const program = Effect.gen(function*() {
*   const memoMap = yield* Layer.makeMemoMap
*   const scope = yield* Effect.scope
*
*   // Build database layer with memoization
*   const dbLayer = Layer.succeed(Database)({
*     query: (sql: string) => Effect.succeed("result")
*   })
*   const dbServices = yield* Layer.buildWithMemoMap(dbLayer, memoMap, scope)
*
*   // Build logger layer with same memoization (reuses memo if same layer)
*   const loggerLayer = Layer.succeed(Logger)({
*     log: (msg: string) => Effect.sync(() => console.log(msg))
*   })
*   const loggerServices = yield* Layer.buildWithMemoMap(
*     loggerLayer,
*     memoMap,
*     scope
*   )
*
*   return {
*     database: ServiceMap.get(dbServices, Database),
*     logger: ServiceMap.get(loggerServices, Logger)
*   }
* })
* ```
*
* @since 2.0.0
* @category memo map
*/
const buildWithMemoMap = /* @__PURE__ */ dual(3, (self, memoMap, scope) => provideService$1(map$3(self.build(memoMap, scope), add$2(CurrentMemoMap, memoMap)), CurrentMemoMap, memoMap));
/**
* Builds a layer into an `Effect` value. Any resources associated with this
* layer will be released when the specified scope is closed unless their scope
* has been extended. This allows building layers where the lifetime of some of
* the services output by the layer exceed the lifetime of the effect the
* layer is provided to.
*
* @example
* ```ts
* import { Effect, Layer, Scope, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* // Build a layer with explicit scope control
* const program = Effect.gen(function*() {
*   const scope = yield* Effect.scope
*
*   const dbLayer = Layer.effect(Database)(Effect.gen(function*() {
*     console.log("Initializing database...")
*     yield* Scope.addFinalizer(
*       scope,
*       Effect.sync(() => console.log("Database closed"))
*     )
*     return { query: (sql: string) => Effect.succeed(`Result: ${sql}`) }
*   }))
*
*   // Build with specific scope - resources tied to this scope
*   const services = yield* Layer.buildWithScope(dbLayer, scope)
*   const database = ServiceMap.get(services, Database)
*
*   return yield* database.query("SELECT * FROM users")
*   // Database will be closed when scope is closed
* })
* ```
*
* @since 2.0.0
* @category destructors
*/
const buildWithScope = /* @__PURE__ */ dual(2, (self, scope) => withFiber$1((fiber) => buildWithMemoMap(self, CurrentMemoMap.getOrCreate(fiber.services), scope)));
/**
* Constructs a layer from the specified value, which must return one or more
* services.
*
* This is a more general version of `succeed` that allows you to provide multiple
* services at once through a `ServiceMap`.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* class Logger extends ServiceMap.Service<Logger, {
*   readonly log: (msg: string) => Effect.Effect<void>
* }>()("Logger") {}
*
* const services = ServiceMap.make(Database, {
*   query: (sql: string) => Effect.succeed("result")
* })
*   .pipe(
*     ServiceMap.add(Logger, {
*       log: (msg: string) => Effect.sync(() => console.log(msg))
*     })
*   )
*
* const layer = Layer.succeedServices(services)
* ```
*
* @since 2.0.0
* @category constructors
*/
const succeedServices = (services) => fromBuildUnsafe(constant(succeed$2(services)));
/**
* Constructs a layer from the specified scoped effect.
*
* This allows you to create a Layer from an Effect that produces a service.
* The Effect is executed in the scope of the layer, allowing for proper
* resource management.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Layer.scoped`
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* const layer = Layer.effect(Database)(
*   Effect.sync(() => ({
*     query: (sql: string) => Effect.succeed(`Query: ${sql}`)
*   }))
* )
* ```
*
* @since 2.0.0
* @category constructors
*/
const effect = function() {
	if (arguments.length === 1) return (effect) => effectImpl(arguments[0], effect);
	return effectImpl(arguments[0], arguments[1]);
};
const effectImpl = (service, effect) => effectServices(map$3(effect, (value) => make$8(service, value)));
/**
* Constructs a layer from the specified scoped effect, which must return one
* or more services.
*
* This allows you to create a Layer from an effectful computation that returns
* multiple services. The Effect is executed in the scope of the layer.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<
*   Database,
*   { readonly query: (sql: string) => Effect.Effect<string> }
* >()("Database") {}
*
* const layer = Layer.effectServices(
*   Effect.succeed(ServiceMap.make(Database, {
*     query: (sql: string) => Effect.succeed(`Query: ${sql}`)
*   }))
* )
* ```
*
* @since 2.0.0
* @category constructors
*/
const effectServices = (effect) => fromBuildMemo((_, scope) => provide$3(effect, scope));
const mergeAllEffect = (layers, memoMap, scope) => {
	const parentScope = forkUnsafe(scope, "parallel");
	return forEach$1(layers, (layer) => layer.build(memoMap, forkUnsafe(parentScope, "sequential")), { concurrency: layers.length }).pipe(map$3((services) => mergeAll$1(...services)));
};
/**
* Combines all the provided layers concurrently, creating a new layer with merged input, error, and output types.
*
* All layers are built concurrently, and their outputs are merged into a single layer.
* This is useful when you need to combine multiple independent layers.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* class Logger extends ServiceMap.Service<Logger, {
*   readonly log: (msg: string) => Effect.Effect<void>
* }>()("Logger") {}
*
* const dbLayer = Layer.succeed(Database)({
*   query: (sql: string) => Effect.succeed("result")
* })
* const loggerLayer = Layer.succeed(Logger)({
*   log: (msg: string) => Effect.sync(() => console.log(msg))
* })
*
* const mergedLayer = Layer.mergeAll(dbLayer, loggerLayer)
* ```
*
* @since 2.0.0
* @category zipping
*/
const mergeAll = (...layers) => fromBuild((memoMap, scope) => mergeAllEffect(layers, memoMap, scope));
const provideWith = (self, that, f) => fromBuild((memoMap, scope) => flatMap$1(Array.isArray(that) ? mergeAllEffect(that, memoMap, scope) : that.build(memoMap, scope), (context) => self.build(memoMap, scope).pipe(provideServices$1(context), map$3((merged) => f(merged, context)))));
/**
* Feeds the output services of this builder into the input of the specified
* builder, resulting in a new builder with the inputs of this builder as
* well as any leftover inputs, and the outputs of the specified builder.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* class Database extends ServiceMap.Service<Database, {
*   readonly query: (sql: string) => Effect.Effect<string>
* }>()("Database") {}
*
* class UserService extends ServiceMap.Service<UserService, {
*   readonly getUser: (id: string) => Effect.Effect<{
*     id: string
*     name: string
*   }>
* }>()("UserService") {}
*
* class Logger extends ServiceMap.Service<Logger, {
*   readonly log: (msg: string) => Effect.Effect<void>
* }>()("Logger") {}
*
* // Create dependency layers
* const databaseLayer = Layer.succeed(Database)({
*   query: (sql: string) => Effect.succeed(`DB: ${sql}`)
* })
*
* const loggerLayer = Layer.succeed(Logger)({
*   log: (msg: string) => Effect.sync(() => console.log(`[LOG] ${msg}`))
* })
*
* // UserService depends on Database and Logger
* const userServiceLayer = Layer.effect(UserService)(Effect.gen(function*() {
*   const database = yield* Database
*   const logger = yield* Logger
*
*   return {
*     getUser: (id: string) =>
*       Effect.gen(function*() {
*         yield* logger.log(`Looking up user ${id}`)
*         const result = yield* database.query(
*           `SELECT * FROM users WHERE id = ${id}`
*         )
*         return { id, name: result }
*       })
*   }
* }))
*
* // Provide dependencies to UserService layer
* const userServiceWithDependencies = userServiceLayer.pipe(
*   Layer.provide(Layer.mergeAll(databaseLayer, loggerLayer))
* )
*
* // Now UserService layer has no dependencies
* const program = Effect.gen(function*() {
*   const userService = yield* UserService
*   return yield* userService.getUser("123")
* }).pipe(
*   Effect.provide(userServiceWithDependencies)
* )
* ```
*
* @since 2.0.0
* @category utils
*/
const provide$2 = /* @__PURE__ */ dual(2, (self, that) => provideWith(self, that, identity));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/ExecutionPlan.js
/**
* @since 3.16.0
* @category Type IDs
*/
const TypeId$9 = "~effect/ExecutionPlan";
const Proto$1 = {
	[TypeId$9]: TypeId$9,
	get withRequirements() {
		const self = this;
		return servicesWith$1((services) => succeed$2(makeProto(self.steps.map((step) => ({
			...step,
			provide: isLayer(step.provide) ? provide$2(step.provide, succeedServices(services)) : step.provide
		})))));
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const makeProto = (steps) => {
	const self = Object.create(Proto$1);
	self.steps = steps;
	return self;
};
/**
* @since 4.0.0
* @category Metadata
*/
const CurrentMetadata$1 = /* @__PURE__ */ Reference("effect/ExecutionPlan/CurrentMetadata", { defaultValue: /* @__PURE__ */ constant({
	attempt: 0,
	stepIndex: 0
}) });

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Clock.js
/**
* A reference to the current Clock service in the environment.
*
* @example
* ```ts
* import { Clock, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const clock = yield* Clock.Clock
*   return clock.currentTimeMillisUnsafe()
* })
* ```
*
* @category references
* @since 4.0.0
*/
const Clock = ClockRef;
/**
* Accesses the current Clock service and uses it to run the provided function.
*
* @example
* ```ts
* import { Clock, Effect } from "effect"
*
* const program = Clock.clockWith((clock) =>
*   Effect.sync(() => {
*     const currentTime = clock.currentTimeMillisUnsafe()
*     console.log(`Current time: ${currentTime}`)
*     return currentTime
*   })
* )
* ```
*
* @category constructors
* @since 2.0.0
*/
const clockWith$1 = clockWith$2;
/**
* Returns an Effect that succeeds with the current time in milliseconds.
*
* @example
* ```ts
* import { Clock, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const currentTime = yield* Clock.currentTimeMillis
*   console.log(`Current time: ${currentTime}ms`)
*   return currentTime
* })
* ```
*
* @category constructors
* @since 2.0.0
*/
const currentTimeMillis = currentTimeMillis$1;
/**
* Returns an Effect that succeeds with the current time in nanoseconds.
*
* @example
* ```ts
* import { Clock, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const currentTime = yield* Clock.currentTimeNanos
*   console.log(`Current time: ${currentTime}ns`)
*   return currentTime
* })
* ```
*
* @category constructors
* @since 2.0.0
*/
const currentTimeNanos = currentTimeNanos$1;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/dateTime.js
/** @internal */
const TypeId$8 = "~effect/time/DateTime";
/** @internal */
const TimeZoneTypeId = "~effect/time/DateTime/TimeZone";
const Proto = {
	[TypeId$8]: TypeId$8,
	pipe() {
		return pipeArguments(this, arguments);
	},
	[NodeInspectSymbol]() {
		return this.toString();
	},
	toJSON() {
		return toDateUtc$1(this).toJSON();
	}
};
const ProtoUtc = {
	...Proto,
	_tag: "Utc",
	[symbol$3]() {
		return number$2(this.epochMillis);
	},
	[symbol$2](that) {
		return isDateTime$1(that) && that._tag === "Utc" && this.epochMillis === that.epochMillis;
	},
	toString() {
		return `DateTime.Utc(${toDateUtc$1(this).toJSON()})`;
	}
};
const ProtoZoned = {
	...Proto,
	_tag: "Zoned",
	[symbol$3]() {
		return combine$1(number$2(this.epochMillis))(hash(this.zone));
	},
	[symbol$2](that) {
		return isDateTime$1(that) && that._tag === "Zoned" && this.epochMillis === that.epochMillis && equals$1(this.zone, that.zone);
	},
	toString() {
		return `DateTime.Zoned(${formatIsoZoned$1(this)})`;
	}
};
const ProtoTimeZone = {
	[TimeZoneTypeId]: TimeZoneTypeId,
	[NodeInspectSymbol]() {
		return this.toString();
	}
};
const ProtoTimeZoneNamed = {
	...ProtoTimeZone,
	_tag: "Named",
	[symbol$3]() {
		return string$2(`Named:${this.id}`);
	},
	[symbol$2](that) {
		return isTimeZone$1(that) && that._tag === "Named" && this.id === that.id;
	},
	toString() {
		return `TimeZone.Named(${this.id})`;
	},
	toJSON() {
		return {
			_id: "TimeZone",
			_tag: "Named",
			id: this.id
		};
	}
};
const ProtoTimeZoneOffset = {
	...ProtoTimeZone,
	_tag: "Offset",
	[symbol$3]() {
		return string$2(`Offset:${this.offset}`);
	},
	[symbol$2](that) {
		return isTimeZone$1(that) && that._tag === "Offset" && this.offset === that.offset;
	},
	toString() {
		return `TimeZone.Offset(${offsetToString(this.offset)})`;
	},
	toJSON() {
		return {
			_id: "TimeZone",
			_tag: "Offset",
			offset: this.offset
		};
	}
};
/** @internal */
const makeZonedProto = (epochMillis, zone, partsUtc) => {
	const self = Object.create(ProtoZoned);
	self.epochMillis = epochMillis;
	self.zone = zone;
	Object.defineProperty(self, "partsUtc", {
		value: partsUtc,
		enumerable: false,
		writable: true
	});
	Object.defineProperty(self, "adjustedEpochMillis", {
		value: void 0,
		enumerable: false,
		writable: true
	});
	Object.defineProperty(self, "partsAdjusted", {
		value: void 0,
		enumerable: false,
		writable: true
	});
	return self;
};
/** @internal */
const isDateTime$1 = (u) => hasProperty(u, TypeId$8);
const isDateTimeArgs = (args) => isDateTime$1(args[0]);
/** @internal */
const isTimeZone$1 = (u) => hasProperty(u, TimeZoneTypeId);
/** @internal */
const isTimeZoneOffset$1 = (u) => isTimeZone$1(u) && u._tag === "Offset";
/** @internal */
const isTimeZoneNamed$1 = (u) => isTimeZone$1(u) && u._tag === "Named";
/** @internal */
const isUtc$1 = (self) => self._tag === "Utc";
/** @internal */
const isZoned$1 = (self) => self._tag === "Zoned";
/** @internal */
const Equivalence$1 = /* @__PURE__ */ make$11((a, b) => a.epochMillis === b.epochMillis);
/** @internal */
const Order$1 = /* @__PURE__ */ make$10((self, that) => self.epochMillis < that.epochMillis ? -1 : self.epochMillis > that.epochMillis ? 1 : 0);
/** @internal */
const clamp$1 = /* @__PURE__ */ clamp$2(Order$1);
const makeUtc = (epochMillis) => {
	const self = Object.create(ProtoUtc);
	self.epochMillis = epochMillis;
	Object.defineProperty(self, "partsUtc", {
		value: void 0,
		enumerable: false,
		writable: true
	});
	return self;
};
/** @internal */
const fromDateUnsafe$1 = (date) => {
	const epochMillis = date.getTime();
	if (Number.isNaN(epochMillis)) throw new IllegalArgumentError("Invalid date");
	return makeUtc(epochMillis);
};
/** @internal */
const makeUnsafe$2 = (input) => {
	if (isDateTime$1(input)) return input;
	else if (input instanceof Date) return fromDateUnsafe$1(input);
	else if (typeof input === "object") {
		const date = /* @__PURE__ */ new Date(0);
		setPartsDate(date, input);
		return fromDateUnsafe$1(date);
	} else if (typeof input === "string" && !hasZone(input)) return fromDateUnsafe$1(/* @__PURE__ */ new Date(input + "Z"));
	return fromDateUnsafe$1(new Date(input));
};
const hasZone = (input) => /Z|[+-]\d{2}$|[+-]\d{2}:?\d{2}$|\]$/.test(input);
const minEpochMillis = -86399999568e5;
const maxEpochMillis = 864e13 - 840 * 60 * 1e3;
/** @internal */
const makeZonedUnsafe$1 = (input, options) => {
	if (options?.timeZone === void 0 && isDateTime$1(input) && isZoned$1(input)) return input;
	const self = makeUnsafe$2(input);
	if (self.epochMillis < minEpochMillis || self.epochMillis > maxEpochMillis) throw new RangeError(`Epoch millis out of range: ${self.epochMillis}`);
	let zone;
	if (options?.timeZone === void 0) zone = zoneMakeOffset$1(new Date(self.epochMillis).getTimezoneOffset() * -60 * 1e3);
	else if (isTimeZone$1(options?.timeZone)) zone = options.timeZone;
	else if (typeof options?.timeZone === "number") zone = zoneMakeOffset$1(options.timeZone);
	else {
		const parsedZone = zoneFromString$1(options.timeZone);
		if (parsedZone === void 0) throw new IllegalArgumentError(`Invalid time zone: ${options.timeZone}`);
		zone = parsedZone;
	}
	if (options?.adjustForTimeZone !== true) return makeZonedProto(self.epochMillis, zone, self.partsUtc);
	return makeZonedFromAdjusted(self.epochMillis, zone, options?.disambiguation ?? "compatible");
};
/** @internal */
const makeZoned$1 = /* @__PURE__ */ liftThrowable(makeZonedUnsafe$1);
/** @internal */
const make$5 = /* @__PURE__ */ liftThrowable(makeUnsafe$2);
const zonedStringRegExp = /^(.{17,35})\[(.+)\]$/;
/** @internal */
const makeZonedFromString$1 = (input) => {
	const match = zonedStringRegExp.exec(input);
	if (match === null) {
		const offset = parseOffset(input);
		return offset !== null ? makeZoned$1(input, { timeZone: offset }) : void 0;
	}
	const [, isoString, timeZone] = match;
	return makeZoned$1(isoString, { timeZone });
};
/** @internal */
const now$1 = /* @__PURE__ */ map$3(currentTimeMillis, makeUtc);
/** @internal */
const nowAsDate$1 = /* @__PURE__ */ map$3(currentTimeMillis, (millis) => new Date(millis));
/** @internal */
const nowUnsafe$1 = () => makeUtc(Date.now());
/** @internal */
const toUtc$1 = (self) => makeUtc(self.epochMillis);
/** @internal */
const setZone$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, zone, options) => options?.adjustForTimeZone === true ? makeZonedFromAdjusted(self.epochMillis, zone, options?.disambiguation ?? "compatible") : makeZonedProto(self.epochMillis, zone, self.partsUtc));
/** @internal */
const setZoneOffset$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, offset, options) => setZone$1(self, zoneMakeOffset$1(offset), options));
const validZoneCache = /* @__PURE__ */ new Map();
const formatOptions = {
	day: "numeric",
	month: "numeric",
	year: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric",
	timeZoneName: "longOffset",
	fractionalSecondDigits: 3,
	hourCycle: "h23"
};
const zoneMakeIntl = (format) => {
	const zoneId = format.resolvedOptions().timeZone;
	if (validZoneCache.has(zoneId)) return validZoneCache.get(zoneId);
	const zone = Object.create(ProtoTimeZoneNamed);
	zone.id = zoneId;
	zone.format = format;
	validZoneCache.set(zoneId, zone);
	return zone;
};
/** @internal */
const zoneMakeNamedUnsafe$1 = (zoneId) => {
	if (validZoneCache.has(zoneId)) return validZoneCache.get(zoneId);
	try {
		return zoneMakeIntl(new Intl.DateTimeFormat("en-US", {
			...formatOptions,
			timeZone: zoneId
		}));
	} catch {
		throw new IllegalArgumentError(`Invalid time zone: ${zoneId}`);
	}
};
/** @internal */
const zoneMakeOffset$1 = (offset) => {
	const zone = Object.create(ProtoTimeZoneOffset);
	zone.offset = offset;
	return zone;
};
/** @internal */
const zoneMakeNamed$1 = /* @__PURE__ */ liftThrowable(zoneMakeNamedUnsafe$1);
/** @internal */
const zoneMakeNamedEffect$1 = (zoneId) => try_$1({
	try: () => zoneMakeNamedUnsafe$1(zoneId),
	catch: (e) => e
});
/** @internal */
const zoneMakeLocal$1 = () => zoneMakeIntl(new Intl.DateTimeFormat("en-US", formatOptions));
const offsetZoneRegExp = /^(?:GMT|[+-])/;
/** @internal */
const zoneFromString$1 = (zone) => {
	if (offsetZoneRegExp.test(zone)) {
		const offset = parseOffset(zone);
		return offset === null ? void 0 : zoneMakeOffset$1(offset);
	}
	return zoneMakeNamed$1(zone);
};
/** @internal */
const zoneToString$1 = (self) => {
	if (self._tag === "Offset") return offsetToString(self.offset);
	return self.id;
};
/** @internal */
const setZoneNamed$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, zoneId, options) => map$4(zoneMakeNamed$1(zoneId), (zone) => setZone$1(self, zone, options)));
/** @internal */
const setZoneNamedUnsafe$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, zoneId, options) => setZone$1(self, zoneMakeNamedUnsafe$1(zoneId), options));
/** @internal */
const distance$1 = /* @__PURE__ */ dual(2, (self, other) => toEpochMillis$1(other) - toEpochMillis$1(self));
/** @internal */
const distanceDurationResult$1 = /* @__PURE__ */ dual(2, (self, other) => {
	const diffMillis = distance$1(self, other);
	return diffMillis > 0 ? succeed$3(millis(diffMillis)) : fail$4(millis(-diffMillis));
});
/** @internal */
const distanceDuration$1 = /* @__PURE__ */ dual(2, (self, other) => millis(Math.abs(distance$1(self, other))));
/** @internal */
const min$1 = /* @__PURE__ */ min$2(Order$1);
/** @internal */
const max$1 = /* @__PURE__ */ max$2(Order$1);
/** @internal */
const isGreaterThan$2 = /* @__PURE__ */ isGreaterThan$3(Order$1);
/** @internal */
const isGreaterThanOrEqualTo$2 = /* @__PURE__ */ isGreaterThanOrEqualTo$3(Order$1);
/** @internal */
const isLessThan$2 = /* @__PURE__ */ isLessThan$3(Order$1);
/** @internal */
const isLessThanOrEqualTo$2 = /* @__PURE__ */ isLessThanOrEqualTo$3(Order$1);
/** @internal */
const between$1 = /* @__PURE__ */ isBetween$1(Order$1);
/** @internal */
const isFuture$1 = (self) => map$3(now$1, isLessThan$2(self));
/** @internal */
const isFutureUnsafe$1 = (self) => isLessThan$2(nowUnsafe$1(), self);
/** @internal */
const isPast$1 = (self) => map$3(now$1, isGreaterThan$2(self));
/** @internal */
const isPastUnsafe$1 = (self) => isGreaterThan$2(nowUnsafe$1(), self);
/** @internal */
const toDateUtc$1 = (self) => new Date(self.epochMillis);
/** @internal */
const toDate$1 = (self) => {
	if (self._tag === "Utc") return new Date(self.epochMillis);
	else if (self.zone._tag === "Offset") return new Date(self.epochMillis + self.zone.offset);
	else if (self.adjustedEpochMillis !== void 0) return new Date(self.adjustedEpochMillis);
	const parts = self.zone.format.formatToParts(self.epochMillis).filter((_) => _.type !== "literal");
	const date = /* @__PURE__ */ new Date(0);
	date.setUTCFullYear(Number(parts[2].value), Number(parts[0].value) - 1, Number(parts[1].value));
	date.setUTCHours(Number(parts[3].value), Number(parts[4].value), Number(parts[5].value), Number(parts[6].value));
	self.adjustedEpochMillis = date.getTime();
	return date;
};
/** @internal */
const zonedOffset$1 = (self) => {
	return toDate$1(self).getTime() - toEpochMillis$1(self);
};
const offsetToString = (offset) => {
	const abs = Math.abs(offset);
	let hours = Math.floor(abs / (3600 * 1e3));
	let minutes = Math.round(abs % (3600 * 1e3) / (60 * 1e3));
	if (minutes === 60) {
		hours += 1;
		minutes = 0;
	}
	return `${offset < 0 ? "-" : "+"}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
/** @internal */
const zonedOffsetIso$1 = (self) => offsetToString(zonedOffset$1(self));
/** @internal */
const toEpochMillis$1 = (self) => self.epochMillis;
/** @internal */
const removeTime$1 = (self) => withDate$1(self, (date) => {
	date.setUTCHours(0, 0, 0, 0);
	return makeUtc(date.getTime());
});
const dateToParts = (date) => ({
	millis: date.getUTCMilliseconds(),
	seconds: date.getUTCSeconds(),
	minutes: date.getUTCMinutes(),
	hours: date.getUTCHours(),
	day: date.getUTCDate(),
	weekDay: date.getUTCDay(),
	month: date.getUTCMonth() + 1,
	year: date.getUTCFullYear()
});
/** @internal */
const toParts$1 = (self) => {
	if (self._tag === "Utc") return toPartsUtc$1(self);
	else if (self.partsAdjusted !== void 0) return self.partsAdjusted;
	self.partsAdjusted = withDate$1(self, dateToParts);
	return self.partsAdjusted;
};
/** @internal */
const toPartsUtc$1 = (self) => {
	if (self.partsUtc !== void 0) return self.partsUtc;
	self.partsUtc = withDateUtc$1(self, dateToParts);
	return self.partsUtc;
};
/** @internal */
const getPartUtc$1 = /* @__PURE__ */ dual(2, (self, part) => toPartsUtc$1(self)[part]);
/** @internal */
const getPart$1 = /* @__PURE__ */ dual(2, (self, part) => toParts$1(self)[part]);
const setPartsDate = (date, parts) => {
	if (parts.year !== void 0) date.setUTCFullYear(parts.year);
	if (parts.month !== void 0) date.setUTCMonth(parts.month - 1);
	if (parts.day !== void 0) date.setUTCDate(parts.day);
	if (parts.weekDay !== void 0) {
		const diff = parts.weekDay - date.getUTCDay();
		date.setUTCDate(date.getUTCDate() + diff);
	}
	if (parts.hours !== void 0) date.setUTCHours(parts.hours);
	if (parts.minutes !== void 0) date.setUTCMinutes(parts.minutes);
	if (parts.seconds !== void 0) date.setUTCSeconds(parts.seconds);
	if (parts.millis !== void 0) date.setUTCMilliseconds(parts.millis);
};
/** @internal */
const setParts$1 = /* @__PURE__ */ dual(2, (self, parts) => mutate$1(self, (date) => setPartsDate(date, parts)));
/** @internal */
const setPartsUtc$1 = /* @__PURE__ */ dual(2, (self, parts) => mutateUtc$1(self, (date) => setPartsDate(date, parts)));
const constDayMillis = 1440 * 60 * 1e3;
const makeZonedFromAdjusted = (adjustedMillis, zone, disambiguation) => {
	if (zone._tag === "Offset") return makeZonedProto(adjustedMillis - zone.offset, zone);
	const beforeOffset = calculateNamedOffset(adjustedMillis - constDayMillis, adjustedMillis, zone);
	const afterOffset = calculateNamedOffset(adjustedMillis + constDayMillis, adjustedMillis, zone);
	if (beforeOffset === afterOffset) return makeZonedProto(adjustedMillis - beforeOffset, zone);
	const isForwards = beforeOffset < afterOffset;
	const transitionMillis = beforeOffset - afterOffset;
	if (isForwards) {
		if (calculateNamedOffset(adjustedMillis - afterOffset, adjustedMillis, zone) === afterOffset) return makeZonedProto(adjustedMillis - afterOffset, zone);
		const before = makeZonedProto(adjustedMillis - beforeOffset, zone);
		if (adjustedMillis !== toDate$1(before).getTime()) switch (disambiguation) {
			case "reject": {
				const formatted = new Date(adjustedMillis).toISOString();
				throw new RangeError(`Gap time: ${formatted} does not exist in time zone ${zone.id}`);
			}
			case "earlier": return makeZonedProto(adjustedMillis - afterOffset, zone);
			case "compatible":
			case "later": return before;
		}
		return before;
	}
	if (calculateNamedOffset(adjustedMillis - beforeOffset, adjustedMillis, zone) === beforeOffset) {
		if (disambiguation === "earlier" || disambiguation === "compatible") return makeZonedProto(adjustedMillis - beforeOffset, zone);
		if (calculateNamedOffset(adjustedMillis - beforeOffset + transitionMillis, adjustedMillis + transitionMillis, zone) === beforeOffset) return makeZonedProto(adjustedMillis - beforeOffset, zone);
		if (disambiguation === "reject") {
			const formatted = new Date(adjustedMillis).toISOString();
			throw new RangeError(`Ambiguous time: ${formatted} occurs twice in time zone ${zone.id}`);
		}
	}
	return makeZonedProto(adjustedMillis - afterOffset, zone);
};
const offsetRegExp = /([+-])(\d{2}):(\d{2})$/;
const parseOffset = (offset) => {
	const match = offsetRegExp.exec(offset);
	if (match === null) return null;
	const [, sign, hours, minutes] = match;
	return (sign === "+" ? 1 : -1) * (Number(hours) * 60 + Number(minutes)) * 60 * 1e3;
};
const calculateNamedOffset = (utcMillis, adjustedMillis, zone) => {
	const offset = zone.format.formatToParts(utcMillis).find((_) => _.type === "timeZoneName")?.value ?? "";
	if (offset === "GMT") return 0;
	const result = parseOffset(offset);
	if (result === null) return zonedOffset$1(makeZonedProto(adjustedMillis, zone));
	return result;
};
/** @internal */
const mutate$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, f, options) => {
	if (self._tag === "Utc") {
		const date = toDateUtc$1(self);
		f(date);
		return makeUtc(date.getTime());
	}
	const adjustedDate = toDate$1(self);
	const newAdjustedDate = new Date(adjustedDate.getTime());
	f(newAdjustedDate);
	return makeZonedFromAdjusted(newAdjustedDate.getTime(), self.zone, options?.disambiguation ?? "compatible");
});
/** @internal */
const mutateUtc$1 = /* @__PURE__ */ dual(2, (self, f) => mapEpochMillis$1(self, (millis) => {
	const date = new Date(millis);
	f(date);
	return date.getTime();
}));
/** @internal */
const mapEpochMillis$1 = /* @__PURE__ */ dual(2, (self, f) => {
	const millis = f(toEpochMillis$1(self));
	return self._tag === "Utc" ? makeUtc(millis) : makeZonedProto(millis, self.zone);
});
/** @internal */
const withDate$1 = /* @__PURE__ */ dual(2, (self, f) => f(toDate$1(self)));
/** @internal */
const withDateUtc$1 = /* @__PURE__ */ dual(2, (self, f) => f(toDateUtc$1(self)));
/** @internal */
const match$2 = /* @__PURE__ */ dual(2, (self, options) => self._tag === "Utc" ? options.onUtc(self) : options.onZoned(self));
/** @internal */
const addDuration$1 = /* @__PURE__ */ dual(2, (self, duration) => mapEpochMillis$1(self, (millis) => millis + toMillis(fromDurationInputUnsafe(duration))));
/** @internal */
const subtractDuration$1 = /* @__PURE__ */ dual(2, (self, duration) => mapEpochMillis$1(self, (millis) => millis - toMillis(fromDurationInputUnsafe(duration))));
const addMillis = (date, amount) => {
	date.setTime(date.getTime() + amount);
};
/** @internal */
const add$1 = /* @__PURE__ */ dual(2, (self, parts) => mutate$1(self, (date) => {
	if (parts.millis) addMillis(date, parts.millis);
	if (parts.seconds) addMillis(date, parts.seconds * 1e3);
	if (parts.minutes) addMillis(date, parts.minutes * 60 * 1e3);
	if (parts.hours) addMillis(date, parts.hours * 60 * 60 * 1e3);
	if (parts.days) date.setUTCDate(date.getUTCDate() + parts.days);
	if (parts.weeks) date.setUTCDate(date.getUTCDate() + parts.weeks * 7);
	if (parts.months) {
		const day = date.getUTCDate();
		date.setUTCMonth(date.getUTCMonth() + parts.months + 1, 0);
		if (day < date.getUTCDate()) date.setUTCDate(day);
	}
	if (parts.years) {
		const day = date.getUTCDate();
		const month = date.getUTCMonth();
		date.setUTCFullYear(date.getUTCFullYear() + parts.years, month + 1, 0);
		if (day < date.getUTCDate()) date.setUTCDate(day);
	}
}));
/** @internal */
const subtract$1 = /* @__PURE__ */ dual(2, (self, parts) => {
	const newParts = {};
	for (const key in parts) newParts[key] = -1 * parts[key];
	return add$1(self, newParts);
});
const startOfDate = (date, part, options) => {
	switch (part) {
		case "second":
			date.setUTCMilliseconds(0);
			break;
		case "minute":
			date.setUTCSeconds(0, 0);
			break;
		case "hour":
			date.setUTCMinutes(0, 0, 0);
			break;
		case "day":
			date.setUTCHours(0, 0, 0, 0);
			break;
		case "week": {
			const weekStartsOn = options?.weekStartsOn ?? 0;
			const diff = (date.getUTCDay() - weekStartsOn + 7) % 7;
			date.setUTCDate(date.getUTCDate() - diff);
			date.setUTCHours(0, 0, 0, 0);
			break;
		}
		case "month":
			date.setUTCDate(1);
			date.setUTCHours(0, 0, 0, 0);
			break;
		case "year":
			date.setUTCMonth(0, 1);
			date.setUTCHours(0, 0, 0, 0);
			break;
	}
};
/** @internal */
const startOf$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, part, options) => mutate$1(self, (date) => startOfDate(date, part, options)));
const endOfDate = (date, part, options) => {
	switch (part) {
		case "second":
			date.setUTCMilliseconds(999);
			break;
		case "minute":
			date.setUTCSeconds(59, 999);
			break;
		case "hour":
			date.setUTCMinutes(59, 59, 999);
			break;
		case "day":
			date.setUTCHours(23, 59, 59, 999);
			break;
		case "week": {
			const weekStartsOn = options?.weekStartsOn ?? 0;
			const diff = (date.getUTCDay() - weekStartsOn + 7) % 7;
			date.setUTCDate(date.getUTCDate() - diff + 6);
			date.setUTCHours(23, 59, 59, 999);
			break;
		}
		case "month":
			date.setUTCMonth(date.getUTCMonth() + 1, 0);
			date.setUTCHours(23, 59, 59, 999);
			break;
		case "year":
			date.setUTCMonth(11, 31);
			date.setUTCHours(23, 59, 59, 999);
			break;
	}
};
/** @internal */
const endOf$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, part, options) => mutate$1(self, (date) => endOfDate(date, part, options)));
/** @internal */
const nearest$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, part, options) => mutate$1(self, (date) => {
	if (part === "milli") return;
	const millis = date.getTime();
	const start = new Date(millis);
	startOfDate(start, part, options);
	const startMillis = start.getTime();
	const end = new Date(millis);
	endOfDate(end, part, options);
	const endMillis = end.getTime() + 1;
	if (millis - startMillis < endMillis - millis) date.setTime(startMillis);
	else date.setTime(endMillis);
}));
const intlTimeZone = (self) => {
	if (self._tag === "Named") return self.id;
	return offsetToString(self.offset);
};
/** @internal */
const format$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, options) => {
	try {
		return new Intl.DateTimeFormat(options?.locale, {
			timeZone: self._tag === "Utc" ? "UTC" : intlTimeZone(self.zone),
			...options
		}).format(self.epochMillis);
	} catch {
		return new Intl.DateTimeFormat(options?.locale, {
			timeZone: "UTC",
			...options
		}).format(toDate$1(self));
	}
});
/** @internal */
const formatLocal$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, options) => new Intl.DateTimeFormat(options?.locale, options).format(self.epochMillis));
/** @internal */
const formatUtc$1 = /* @__PURE__ */ dual(isDateTimeArgs, (self, options) => new Intl.DateTimeFormat(options?.locale, {
	...options,
	timeZone: "UTC"
}).format(self.epochMillis));
/** @internal */
const formatIntl$1 = /* @__PURE__ */ dual(2, (self, format) => format.format(self.epochMillis));
/** @internal */
const formatIso$1 = (self) => toDateUtc$1(self).toISOString();
/** @internal */
const formatIsoDate$1 = (self) => toDate$1(self).toISOString().slice(0, 10);
/** @internal */
const formatIsoDateUtc$1 = (self) => toDateUtc$1(self).toISOString().slice(0, 10);
/** @internal */
const formatIsoOffset$1 = (self) => {
	const date = toDate$1(self);
	return self._tag === "Utc" ? date.toISOString() : `${date.toISOString().slice(0, -1)}${zonedOffsetIso$1(self)}`;
};
/** @internal */
const formatIsoZoned$1 = (self) => self.zone._tag === "Offset" ? formatIsoOffset$1(self) : `${formatIsoOffset$1(self)}[${self.zone.id}]`;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Pull.js
/**
* @since 4.0.0
*/
/**
* @since 4.0.0
* @category Done
*/
const catchDone = /* @__PURE__ */ dual(2, (effect, f) => catchCauseIf$1(effect, filterDoneLeftover, (l) => f(l)));
/**
* Filters a Cause to extract only halt errors.
*
* @since 4.0.0
* @category Done
*/
const filterDone = /* @__PURE__ */ composePassthrough(findError$1, (e) => isDone(e) ? succeed$3(e) : fail$4(e));
/**
* Filters a Cause to extract only halt errors.
*
* @since 4.0.0
* @category Done
*/
const filterDoneVoid = /* @__PURE__ */ composePassthrough(findError$1, (e) => isDone(e) ? succeed$3(e) : fail$4(e));
/**
* Filters a Cause to extract the leftover value from done errors.
*
* @since 4.0.0
* @category Done
*/
const filterDoneLeftover = /* @__PURE__ */ composePassthrough(findError$1, (e) => isDone(e) ? succeed$3(e.value) : fail$4(e));
/**
* Pattern matches on a Pull, handling success, failure, and done cases.
*
* @example
* ```ts
* import { Cause, Effect, Pull } from "effect"
*
* const pull = Cause.done("stream ended")
*
* const result = Pull.matchEffect(pull, {
*   onSuccess: (value) => Effect.succeed(`Got value: ${value}`),
*   onFailure: (cause) => Effect.succeed(`Got error: ${cause}`),
*   onDone: (leftover) => Effect.succeed(`Stream halted with: ${leftover}`)
* })
* ```
*
* @since 4.0.0
* @category pattern matching
*/
const matchEffect$1 = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect$1(self, {
	onSuccess: options.onSuccess,
	onFailure: (cause) => {
		const halt = filterDone(cause);
		return !isFailure$3(halt) ? options.onDone(halt.success.value) : options.onFailure(halt.failure);
	}
}));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Schedule.js
/**
* This module provides utilities for creating and composing schedules for retrying operations,
* repeating effects, and implementing various timing strategies.
*
* A Schedule is a function that takes an input and returns a decision whether to continue or halt,
* along with a delay duration. Schedules can be combined, transformed, and used to implement
* sophisticated retry and repetition logic.
*
* @example
* ```ts
* import { Effect, Schedule } from "effect"
*
* // Retry with exponential backoff
* const retryPolicy = Schedule.exponential("100 millis", 2.0)
*   .pipe(Schedule.compose(Schedule.recurs(3)))
*
* const program = Effect.gen(function*() {
*   // This will retry up to 3 times with exponential backoff
*   const result = yield* Effect.retry(
*     Effect.fail("Network error"),
*     retryPolicy
*   )
* })
*
* // Repeat on a fixed schedule
* const heartbeat = Effect.log("heartbeat")
*   .pipe(Effect.repeat(Schedule.spaced("30 seconds")))
* ```
*
* @since 2.0.0
*/
const TypeId$7 = "~effect/Schedule";
/**
* @since 4.0.0
* @category Metadata
*/
const CurrentMetadata = /* @__PURE__ */ Reference("effect/Schedule/CurrentMetadata", { defaultValue: /* @__PURE__ */ constant({
	input: void 0,
	output: void 0,
	duration: zero,
	attempt: 0,
	start: 0,
	now: 0,
	elapsed: 0,
	elapsedSincePrevious: 0
}) });
const ScheduleProto = {
	[TypeId$7]: {
		_Out: identity,
		_In: identity,
		_Env: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/**
* Type guard that checks if a value is a Schedule.
*
* @example
* ```ts
* import { Schedule } from "effect"
*
* const schedule = Schedule.exponential("100 millis")
* const notSchedule = { foo: "bar" }
*
* console.log(Schedule.isSchedule(schedule)) // true
* console.log(Schedule.isSchedule(notSchedule)) // false
* console.log(Schedule.isSchedule(null)) // false
* console.log(Schedule.isSchedule(undefined)) // false
* ```
*
* @since 2.0.0
* @category guards
*/
const isSchedule = (u) => hasProperty(u, TypeId$7);
/**
* Creates a Schedule from a step function that returns a Pull.
*
* @example
* ```ts
* import { Schedule } from "effect"
*
* // fromStep is an advanced function for creating custom schedules
* // It requires a step function that returns a Pull value
*
* // Most users should use simpler schedule constructors like:
* const simpleSchedule = Schedule.exponential("100 millis")
* const spacedSchedule = Schedule.spaced("1 second")
* const recurringSchedule = Schedule.recurs(5)
*
* // These can be combined and transformed as needed
* const complexSchedule = simpleSchedule.pipe(
*   Schedule.compose(Schedule.recurs(3))
* )
* ```
*
* @since 4.0.0
* @category constructors
*/
const fromStep = (step) => {
	const self = Object.create(ScheduleProto);
	self.step = step;
	return self;
};
const metadataFn = () => {
	let n = 0;
	let previous;
	let start;
	return (now, input) => {
		if (start === void 0) start = now;
		const elapsed = now - start;
		const elapsedSincePrevious = previous === void 0 ? 0 : now - previous;
		previous = now;
		return {
			input,
			attempt: ++n,
			start,
			now,
			elapsed,
			elapsedSincePrevious
		};
	};
};
/**
* Creates a Schedule from a step function that receives metadata about the schedule's execution.
*
* @example
* ```ts
* import { Effect, Schedule } from "effect"
*
* // fromStepWithMetadata is an advanced function for creating schedules
* // that need access to execution metadata like timing and recurrence count
*
* // Most users should use simpler metadata-aware functions like:
* const metadataSchedule = Schedule.spaced("1 second").pipe(
*   Schedule.collectWhile((metadata) => Effect.succeed(metadata.attempt <= 5))
* )
*
* // Or use existing schedules with metadata transformations:
* const conditionalSchedule = Schedule.exponential("100 millis").pipe(
*   Schedule.tapOutput((output) => Effect.log(`Output: ${output}`))
* )
* ```
*
* @since 4.0.0
* @category constructors
*/
const fromStepWithMetadata = (step) => fromStep(map$3(step, (f) => {
	const meta = metadataFn();
	return (now, input) => f(meta(now, input));
}));
/**
* Extracts the step function from a Schedule.
*
* @example
* ```ts
* import { Effect, Schedule } from "effect"
*
* // Extract step function from an existing schedule
* const schedule = Schedule.exponential("100 millis").pipe(Schedule.take(3))
*
* const program = Effect.gen(function*() {
*   const stepFn = yield* Schedule.toStep(schedule)
*
*   // Use the step function directly for custom logic
*   const now = Date.now()
*   const result = yield* stepFn(now, "input")
*
*   console.log(`Step result: ${result}`)
* })
* ```
*
* @since 4.0.0
* @category destructors
*/
const toStep = (schedule) => catchCause$1(schedule.step, (cause) => succeed$2(() => failCause$2(cause)));
/**
* Extracts a step function from a Schedule that provides metadata about each
* execution. It will also handle sleeping for the computed delay.
*
* @since 4.0.0
* @category destructors
*/
const toStepWithMetadata = (schedule) => clockWith$2((clock) => map$3(toStep(schedule), (step) => {
	const metaFn = metadataFn();
	return (input) => suspend$1(() => {
		const now = clock.currentTimeMillisUnsafe();
		return flatMap$1(step(now, input), ([output, duration]) => {
			const meta = metaFn(now, input);
			meta.output = output;
			meta.duration = duration;
			return as$1(sleep$1(duration), meta);
		});
	});
}));
/**
* Returns a new `Schedule` that outputs the inputs of the specified schedule.
*
* @example
* ```ts
* import { Console, Effect, Schedule } from "effect"
*
* // Create a schedule that outputs the inputs instead of original outputs
* const inputSchedule = Schedule.passthrough(
*   Schedule.exponential("100 millis").pipe(Schedule.take(3))
* )
*
* const program = Effect.gen(function*() {
*   let counter = 0
*   yield* Effect.repeat(
*     Effect.gen(function*() {
*       counter++
*       yield* Console.log(`Task ${counter} executed`)
*       return `result-${counter}`
*     }),
*     inputSchedule
*   )
* })
* ```
*
* @since 2.0.0
* @category utilities
*/
const passthrough$2 = (self) => fromStep(map$3(toStep(self), (step) => (now, input) => matchEffect$1(step(now, input), {
	onSuccess: (result) => succeed$2([input, result[1]]),
	onFailure: failCause$2,
	onDone: () => done$1(input)
})));
/**
* Returns a `Schedule` which can only be stepped the specified number of
* `times` before it terminates.
*
* @example
* ```ts
* import { Console, Effect, Schedule } from "effect"
*
* // Basic recurs - retry at most 3 times
* const maxThreeAttempts = Schedule.recurs(3)
*
* // Retry a failing operation at most 5 times
* const program = Effect.gen(function*() {
*   let attempt = 0
*
*   const result = yield* Effect.retry(
*     Effect.gen(function*() {
*       attempt++
*       yield* Console.log(`Attempt ${attempt}`)
*
*       if (attempt < 4) {
*         yield* Effect.fail(new Error(`Attempt ${attempt} failed`))
*       }
*
*       return `Success on attempt ${attempt}`
*     }),
*     Schedule.recurs(5) // Will retry up to 5 times
*   )
*
*   yield* Console.log(`Final result: ${result}`)
* })
*
* // Combining recurs with other schedules for sophisticated retry logic
* const complexRetry = Schedule.exponential("100 millis").pipe(
*   Schedule.compose(Schedule.recurs(3)) // At most 3 attempts
* )
*
* // Repeat an effect exactly 10 times
* const exactlyTenTimes = Effect.gen(function*() {
*   yield* Console.log("Executing task...")
*   return Math.random()
* }).pipe(
*   Effect.repeat(Schedule.recurs(10))
* )
*
* // The schedule outputs the current recurrence count (0-based)
* const countingSchedule = Schedule.recurs(3).pipe(
*   Schedule.tapOutput((count) => Console.log(`Execution #${count + 1}`))
* )
* ```
*
* @category constructors
* @since 2.0.0
*/
const recurs = (times) => while_(forever$1, ({ attempt }) => succeed$2(attempt <= times));
/**
* Returns a schedule that recurs continuously, each repetition spaced the
* specified duration from the last run.
*
* @example
* ```ts
* import { Console, Effect, Schedule } from "effect"
*
* // Basic spaced schedule - runs every 2 seconds
* const everyTwoSeconds = Schedule.spaced("2 seconds")
*
* // Heartbeat that runs indefinitely with fixed spacing
* const heartbeat = Effect.gen(function*() {
*   yield* Console.log(`Heartbeat at ${new Date().toISOString()}`)
* }).pipe(
*   Effect.repeat(everyTwoSeconds)
* )
*
* // Limited repeat - run only 5 times with 1-second spacing
* const limitedTask = Effect.gen(function*() {
*   yield* Console.log("Executing scheduled task...")
*   yield* Effect.sleep("500 millis") // simulate work
*   return "Task completed"
* }).pipe(
*   Effect.repeat(
*     Schedule.spaced("1 second").pipe(Schedule.take(5))
*   )
* )
*
* // Simple spaced schedule with limited repetitions
* const limitedSpaced = Schedule.spaced("100 millis").pipe(
*   Schedule.compose(Schedule.recurs(5)) // at most 5 times
* )
*
* const program = Effect.gen(function*() {
*   yield* Console.log("Starting spaced execution...")
*
*   yield* Effect.repeat(
*     Effect.succeed("work item"),
*     limitedSpaced
*   )
*
*   yield* Console.log("Completed executions")
* })
* ```
*
* @since 2.0.0
* @category constructors
*/
const spaced = (duration) => {
	const decoded = fromDurationInputUnsafe(duration);
	return fromStepWithMetadata(succeed$2((meta) => succeed$2([meta.attempt - 1, decoded])));
};
const while_ = /* @__PURE__ */ dual(2, (self, predicate) => fromStep(map$3(toStep(self), (step) => {
	const meta = metadataFn();
	return (now, input) => flatMap$1(step(now, input), (result) => {
		const [output, duration] = result;
		return flatMap$1(predicate({
			...meta(now, input),
			output,
			duration
		}), (check) => check ? succeed$2(result) : done$1(output));
	});
})));
/**
* Returns a new `Schedule` that will recur forever.
*
* The output of the schedule is the current count of its repetitions thus far
* (i.e. `0, 1, 2, ...`).
*
* @example
* ```ts
* import { Console, Effect, Schedule } from "effect"
*
* // A schedule that runs forever with no delay
* const infiniteSchedule = Schedule.forever
*
* const program = Effect.gen(function*() {
*   yield* Effect.repeat(
*     Effect.gen(function*() {
*       yield* Console.log("Running forever...")
*       return "continuous-task"
*     }),
*     infiniteSchedule.pipe(Schedule.take(5)) // Limit for demo
*   )
* })
* ```
*
* @since 2.0.0
* @category constructors
*/
const forever$1 = /* @__PURE__ */ spaced(zero);

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/layer.js
const provideLayer = (self, layer, options) => scopedWith$1((scope) => flatMap$1(options?.local ? buildWithMemoMap(layer, makeMemoMapUnsafe(), scope) : buildWithScope(layer, scope), (context) => provideServices$1(self, context)));
/** @internal */
const provide$1 = /* @__PURE__ */ dual((args) => isEffect$1(args[0]), (self, source, options) => isServiceMap(source) ? provideServices$1(self, source) : provideLayer(self, Array.isArray(source) ? mergeAll(...source) : source, options));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/schedule.js
/** @internal */
const repeatOrElse$1 = /* @__PURE__ */ dual(3, (self, schedule, orElse) => flatMap$1(toStepWithMetadata(schedule), (step) => {
	let meta = CurrentMetadata.defaultValue();
	return catch_$1(forever$2(tap$1(flatMap$1(suspend$1(() => provideService$1(self, CurrentMetadata, meta)), step), (meta_) => sync$1(() => {
		meta = meta_;
	})), { disableYield: true }), (error) => isDone$1(error) ? succeed$2(error.value) : orElse(error, meta.attempt === 0 ? none() : some(meta)));
}));
/** @internal */
const retryOrElse$1 = /* @__PURE__ */ dual(3, (self, policy, orElse) => flatMap$1(toStepWithMetadata(policy), (step) => {
	let meta = CurrentMetadata.defaultValue();
	let lastError;
	const loop = catch_$1(suspend$1(() => provideService$1(self, CurrentMetadata, meta)), (error) => {
		lastError = error;
		return flatMap$1(step(error), (meta_) => {
			meta = meta_;
			return loop;
		});
	});
	return catchDone(loop, (out) => internalCall(() => orElse(lastError, out)));
}));
/** @internal */
const repeat$1 = /* @__PURE__ */ dual(2, (self, options) => {
	return repeatOrElse$1(self, typeof options === "function" ? options(identity) : isSchedule(options) ? options : buildFromOptions(options), fail$3);
});
/** @internal */
const retry$1 = /* @__PURE__ */ dual(2, (self, options) => {
	return retryOrElse$1(self, typeof options === "function" ? options(identity) : isSchedule(options) ? options : buildFromOptions(options), fail$3);
});
/** @internal */
const scheduleFrom$1 = /* @__PURE__ */ dual(3, (self, initial, schedule) => flatMap$1(toStepWithMetadata(schedule), (step) => {
	let meta = CurrentMetadata.defaultValue();
	const selfWithMeta = suspend$1(() => provideService$1(self, CurrentMetadata, meta));
	return catch_$1(flatMap$1(step(initial), (meta_) => {
		meta = meta_;
		const body = constant(flatMap$1(selfWithMeta, step));
		return whileLoop$1({
			while: constTrue,
			body,
			step(meta_) {
				meta = meta_;
			}
		});
	}), (error) => isDone$1(error) ? succeed$2(error.value) : fail$3(error));
}));
const passthroughForever = /* @__PURE__ */ passthrough$2(forever$1);
/** @internal */
const buildFromOptions = (options) => {
	let schedule = options.schedule ?? passthroughForever;
	if (options.while) schedule = while_(schedule, ({ input }) => {
		const applied = options.while(input);
		return isEffect$1(applied) ? applied : succeed$2(applied);
	});
	if (options.until) schedule = while_(schedule, ({ input }) => {
		const applied = options.until(input);
		return isEffect$1(applied) ? map$3(applied, (b) => !b) : succeed$2(!applied);
	});
	if (options.times !== void 0) schedule = while_(schedule, ({ attempt }) => succeed$2(attempt <= options.times));
	return schedule;
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/executionPlan.js
/** @internal */
const withExecutionPlan$1 = /* @__PURE__ */ dual(2, (self, plan) => suspend$1(() => {
	let i = 0;
	let meta = {
		attempt: 0,
		stepIndex: 0
	};
	const provideMeta = provideServiceEffect$1(CurrentMetadata$1, sync$1(() => {
		meta = {
			attempt: meta.attempt + 1,
			stepIndex: i
		};
		return meta;
	}));
	let result;
	return flatMap$1(whileLoop$1({
		while: () => i < plan.steps.length && (result === void 0 || isFailure$3(result)),
		body() {
			const step = plan.steps[i];
			let nextEffect = provideMeta(provide$1(self, step.provide));
			if (result) {
				let attempted = false;
				const wrapped = nextEffect;
				nextEffect = suspend$1(() => {
					if (attempted) return wrapped;
					attempted = true;
					return result.asEffect();
				});
				nextEffect = retry$1(nextEffect, scheduleFromStep(step, false));
			} else {
				const schedule = scheduleFromStep(step, true);
				nextEffect = schedule ? retry$1(nextEffect, schedule) : nextEffect;
			}
			return result$1(nextEffect);
		},
		step(result_) {
			result = result_;
			i++;
		}
	}), () => result.asEffect());
}));
/** @internal */
const scheduleFromStep = (step, first) => {
	if (!first) return buildFromOptions({
		schedule: step.schedule ? step.schedule : step.attempts ? void 0 : scheduleOnce,
		times: step.attempts,
		while: step.while
	});
	else if (step.attempts === 1 || !(step.schedule || step.attempts)) return;
	return buildFromOptions({
		schedule: step.schedule,
		while: step.while,
		times: step.attempts ? step.attempts - 1 : void 0
	});
};
const scheduleOnce = /* @__PURE__ */ recurs(1);

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Request.js
const TypeId$6 = "~effect/Request";
const requestVariance = /* @__PURE__ */ byReferenceUnsafe({
	_E: (_) => _,
	_A: (_) => _,
	_R: (_) => _
});
/**
* @since 4.0.0
*/
const RequestPrototype = {
	...StructuralProto,
	[TypeId$6]: requestVariance
};
/**
* @since 2.0.0
* @category entry
*/
const makeEntry = (options) => options;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/request.js
/** @internal */
const request$1 = /* @__PURE__ */ dual(2, (self, resolver) => {
	const withResolver = (resolver) => callback$1((resume) => {
		return maybeRemoveEntry(resolver, addEntry(resolver, self, resume, getCurrentFiber()));
	});
	return isEffect$1(resolver) ? flatMap$1(resolver, withResolver) : withResolver(resolver);
});
/** @internal */
const requestUnsafe$1 = (self, options) => {
	const entry = addEntry(options.resolver, self, options.onExit, {
		services: options.services,
		currentScheduler: get(options.services, Scheduler)
	});
	return () => removeEntryUnsafe(options.resolver, entry);
};
const batchPool = [];
const pendingBatches = /* @__PURE__ */ new Map();
const addEntry = (resolver, request, resume, fiber) => {
	let batchMap = pendingBatches.get(resolver);
	if (!batchMap) {
		batchMap = /* @__PURE__ */ new Map();
		pendingBatches.set(resolver, batchMap);
	}
	let batch;
	let completed = false;
	const entry = makeEntry({
		request,
		services: fiber.services,
		uninterruptible: false,
		completeUnsafe(effect) {
			if (completed) return;
			completed = true;
			resume(effect);
			batch?.entrySet.delete(entry);
		}
	});
	if (resolver.preCheck !== void 0 && !resolver.preCheck(entry)) return entry;
	const key = resolver.batchKey(entry);
	batch = batchMap.get(key);
	if (!batch) {
		if (batchPool.length > 0) {
			batch = batchPool.pop();
			batch.key = key;
			batch.resolver = resolver;
			batch.map = batchMap;
		} else {
			const newBatch = {
				key,
				resolver,
				map: batchMap,
				entrySet: /* @__PURE__ */ new Set(),
				entries: /* @__PURE__ */ new Set(),
				delayEffect: flatMap$1(suspend$1(() => newBatch.resolver.delay), (_) => runBatch(newBatch)),
				run: onExit$1(suspend$1(() => newBatch.resolver.runAll(Array.from(newBatch.entries), newBatch.key)), (exit) => {
					for (const entry of newBatch.entrySet) entry.completeUnsafe(exit._tag === "Success" ? exitDie(new Error("Effect.request: RequestResolver did not complete request", { cause: entry.request })) : exit);
					newBatch.entries.clear();
					if (batchPool.length < 128) {
						newBatch.entrySet.clear();
						newBatch.key = void 0;
						newBatch.fiber = void 0;
						batchPool.push(newBatch);
					}
					return void_$3;
				})
			};
			batch = newBatch;
		}
		batchMap.set(key, batch);
		batch.fiber = runFork$1(batch.delayEffect, { scheduler: fiber.currentScheduler });
	}
	batch.entrySet.add(entry);
	batch.entries.add(entry);
	if (batch.resolver.collectWhile(batch.entries)) return entry;
	batch.fiber.interruptUnsafe(fiber.id);
	batch.fiber = runFork$1(runBatch(batch), { scheduler: fiber.currentScheduler });
	return entry;
};
const removeEntryUnsafe = (resolver, entry) => {
	if (entry.uninterruptible) return;
	const batchMap = pendingBatches.get(resolver);
	if (!batchMap) return;
	const key = resolver.batchKey(entry.request);
	const batch = batchMap.get(key);
	if (!batch) return;
	batch.entries.delete(entry);
	batch.entrySet.delete(entry);
	if (batch.entries.size === 0) {
		batchMap.delete(key);
		batch.fiber?.interruptUnsafe();
	}
};
const maybeRemoveEntry = (resolver, entry) => sync$1(() => removeEntryUnsafe(resolver, entry));
function runBatch(batch) {
	if (!batch.map.has(batch.key)) return void_$3;
	batch.map.delete(batch.key);
	return batch.run;
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Effect.js
const TypeId$5 = EffectTypeId;
/**
* Tests if a value is an `Effect`.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* console.log(Effect.isEffect(Effect.succeed(1))) // true
* console.log(Effect.isEffect("hello")) // false
* ```
*
* @since 2.0.0
* @category Guards
*/
const isEffect = (u) => typeof u === "object" && u !== null && TypeId$5 in u;
/**
* Combines multiple effects into one, returning results based on the input
* structure.
*
* **Details**
*
* Use this function when you need to run multiple effects and combine their
* results into a single output. It supports tuples, iterables, structs, and
* records, making it flexible for different input types.
*
* For instance, if the input is a tuple:
*
* ```ts skip-type-checking
* //         ┌─── a tuple of effects
* //         ▼
* Effect.all([effect1, effect2, ...])
* ```
*
* the effects are executed sequentially, and the result is a new effect
* containing the results as a tuple. The results in the tuple match the order
* of the effects passed to `Effect.all`.
*
* **Concurrency**
*
* You can control the execution order (e.g., sequential vs. concurrent) using
* the `concurrency` option.
*
* **Short-Circuiting Behavior**
*
* This function stops execution on the first error it encounters, this is
* called "short-circuiting". If any effect in the collection fails, the
* remaining effects will not run, and the error will be propagated. To change
* this behavior, you can use the `mode` option, which allows all effects to run
* and collect every success / failure as `Result` values.
*
* **The `mode` option**
*
* The `{ mode: "result" }` option changes the behavior of `Effect.all` to
* ensure all effects run, even if some fail. Instead of stopping on the first
* failure, this mode collects both successes and failures, returning an array
* of `Result` instances where each result is either an `Ok` (success) or a
* `Err` (failure).
*
* @example Combining Effects in Tuples
* ```ts
* import { Console, Effect } from "effect"
*
* const tupleOfEffects = [
*   Effect.succeed(42).pipe(Effect.tap(Console.log)),
*   Effect.succeed("Hello").pipe(Effect.tap(Console.log))
* ] as const
*
* //      ┌─── Effect<[number, string], never, never>
* //      ▼
* const resultsAsTuple = Effect.all(tupleOfEffects)
*
* Effect.runPromise(resultsAsTuple).then(console.log)
* // Output:
* // 42
* // Hello
* // [ 42, 'Hello' ]
* ```
*
* @example Combining Effects in Iterables
* ```ts
* import { Console, Effect } from "effect"
*
* const iterableOfEffects: Iterable<Effect.Effect<number>> = [1, 2, 3].map(
*   (n) => Effect.succeed(n).pipe(Effect.tap(Console.log))
* )
*
* //      ┌─── Effect<number[], never, never>
* //      ▼
* const resultsAsArray = Effect.all(iterableOfEffects)
*
* Effect.runPromise(resultsAsArray).then(console.log)
* // Output:
* // 1
* // 2
* // 3
* // [ 1, 2, 3 ]
* ```
*
* @example Combining Effects in Structs
* ```ts
* import { Console, Effect } from "effect"
*
* const structOfEffects = {
*   a: Effect.succeed(42).pipe(Effect.tap(Console.log)),
*   b: Effect.succeed("Hello").pipe(Effect.tap(Console.log))
* }
*
* //      ┌─── Effect<{ a: number; b: string; }, never, never>
* //      ▼
* const resultsAsStruct = Effect.all(structOfEffects)
*
* Effect.runPromise(resultsAsStruct).then(console.log)
* // Output:
* // 42
* // Hello
* // { a: 42, b: 'Hello' }
* ```
*
* @example Combining Effects in Records
* ```ts
* import { Console, Effect } from "effect"
*
* const recordOfEffects: Record<string, Effect.Effect<number>> = {
*   key1: Effect.succeed(1).pipe(Effect.tap(Console.log)),
*   key2: Effect.succeed(2).pipe(Effect.tap(Console.log))
* }
*
* //      ┌─── Effect<{ [x: string]: number; }, never, never>
* //      ▼
* const resultsAsRecord = Effect.all(recordOfEffects)
*
* Effect.runPromise(resultsAsRecord).then(console.log)
* // Output:
* // 1
* // 2
* // { key1: 1, key2: 2 }
* ```
*
* @example Short-Circuiting Behavior
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.all([
*   Effect.succeed("Task1").pipe(Effect.tap(Console.log)),
*   Effect.fail("Task2: Oh no!").pipe(Effect.tap(Console.log)),
*   // Won't execute due to earlier failure
*   Effect.succeed("Task3").pipe(Effect.tap(Console.log))
* ])
*
* Effect.runPromiseExit(program).then(console.log)
* // Output:
* // Task1
* // {
* //   _id: 'Exit',
* //   _tag: 'Failure',
* //   cause: { _id: 'Cause', _tag: 'Fail', failure: 'Task2: Oh no!' }
* // }
* ```
*
* @see {@link forEach} for iterating over elements and applying an effect.
* @see {@link allWith} for a data-last version of this function.
*
* @since 2.0.0
* @category Collecting
*/
const all = all$1;
/**
* Applies an effectful function to each element and partitions failures and
* successes.
*
* The returned tuple is `[excluded, satisfying]`, where:
*
* - `excluded` contains all failures.
* - `satisfying` contains all successes.
*
* This function runs every effect and never fails. Use `concurrency` to control
* parallelism.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.partition([0, 1, 2, 3], (n) =>
*   n % 2 === 0 ? Effect.fail(`${n} is even`) : Effect.succeed(n)
* )
*
* Effect.runPromise(program).then(console.log)
* // [ ["0 is even", "2 is even"], [1, 3] ]
* ```
*
* @since 3.0.0
* @category Collecting
*/
const partition = partition$1;
/**
* Executes an effectful operation for each element in an `Iterable`.
*
* **Details**
*
* The `forEach` function applies a provided operation to each element in the
* iterable, producing a new effect that returns an array of results.
*
* If any effect fails, the iteration stops immediately (short-circuiting), and
* the error is propagated.
*
* **Concurrency**
*
* The `concurrency` option controls how many operations are performed
* concurrently. By default, the operations are performed sequentially.
*
* **Discarding Results**
*
* If the `discard` option is set to `true`, the intermediate results are not
* collected, and the final result of the operation is `void`.
*
* @see {@link all} for combining multiple effects into one.
*
* @example
* ```ts
* // Title: Applying Effects to Iterable Elements
* import { Effect } from "effect"
* import { Console } from "effect"
*
* const result = Effect.forEach(
*   [1, 2, 3, 4, 5],
*   (n, index) =>
*     Console.log(`Currently at index ${index}`).pipe(Effect.as(n * 2))
* )
*
* Effect.runPromise(result).then(console.log)
* // Output:
* // Currently at index 0
* // Currently at index 1
* // Currently at index 2
* // Currently at index 3
* // Currently at index 4
* // [ 2, 4, 6, 8, 10 ]
* ```
*
* @example
* // Title: Using discard to Ignore Results
* import { Effect } from "effect"
* import { Console } from "effect"
*
* // Apply effects but discard the results
* const result = Effect.forEach(
*   [1, 2, 3, 4, 5],
*   (n, index) =>
*     Console.log(`Currently at index ${index}`).pipe(Effect.as(n * 2)),
*   { discard: true }
* )
*
* Effect.runPromise(result).then(console.log)
* // Output:
* // Currently at index 0
* // Currently at index 1
* // Currently at index 2
* // Currently at index 3
* // Currently at index 4
* // undefined
*
* @since 2.0.0
* @category Collecting
*/
const forEach = forEach$1;
/**
* Executes a body effect repeatedly while a condition holds true.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* let counter = 0
*
* const program = Effect.whileLoop({
*   while: () => counter < 5,
*   body: () => Effect.sync(() => ++counter),
*   step: (n) => console.log(`Current count: ${n}`)
* })
*
* Effect.runPromise(program)
* // Output:
* // Current count: 1
* // Current count: 2
* // Current count: 3
* // Current count: 4
* // Current count: 5
* ```
*
* @since 2.0.0
* @category Collecting
*/
const whileLoop = whileLoop$1;
/**
* Creates an `Effect` that represents an asynchronous computation guaranteed to
* succeed.
*
* **When to Use**
*
* Use `promise` when you are sure the operation will not reject.
*
* **Details**
*
* The provided function (`thunk`) returns a `Promise` that should never reject; if it does, the error
* will be treated as a "defect".
*
* This defect is not a standard error but indicates a flaw in the logic that
* was expected to be error-free. You can think of it similar to an unexpected
* crash in the program, which can be further managed or logged using tools like
* {@link catchAllDefect}.
*
* **Interruptions**
*
* An optional `AbortSignal` can be provided to allow for interruption of the
* wrapped `Promise` API.
*
* @see {@link tryPromise} for a version that can handle failures.
*
* @example
* ```ts
* // Title: Delayed Message
* import { Effect } from "effect"
*
* const delay = (message: string) =>
*   Effect.promise<string>(
*     () =>
*       new Promise((resolve) => {
*         setTimeout(() => {
*           resolve(message)
*         }, 2000)
*       })
*   )
*
* //      ┌─── Effect<string, never, never>
* //      ▼
* const program = delay("Async operation completed successfully!")
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const promise = promise$1;
/**
* Creates an `Effect` that represents an asynchronous computation that might
* fail.
*
* **When to Use**
*
* In situations where you need to perform asynchronous operations that might
* fail, such as fetching data from an API, you can use the `tryPromise`
* constructor. This constructor is designed to handle operations that could
* throw exceptions by capturing those exceptions and transforming them into
* manageable errors.
*
* **Error Handling**
*
* There are two ways to handle errors with `tryPromise`:
*
* 1. If you don't provide a `catch` function, the error is caught and the
*    effect fails with an `UnknownError`.
* 2. If you provide a `catch` function, the error is caught and the `catch`
*    function maps it to an error of type `E`.
*
* **Interruptions**
*
* An optional `AbortSignal` can be provided to allow for interruption of the
* wrapped `Promise` API.
*
* @example Fetching a TODO Item
* ```ts
* import { Effect } from "effect"
*
* const getTodo = (id: number) =>
*   // Will catch any errors and propagate them as UnknownError
*   Effect.tryPromise(() =>
*     fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
*   )
*
* //      ┌─── Effect<Response, UnknownError, never>
* //      ▼
* const program = getTodo(1)
* ```
*
* @example Custom Error Handling
* ```ts
* import { Effect } from "effect"
*
* const getTodo = (id: number) =>
*   Effect.tryPromise({
*     try: () => fetch(`https://jsonplaceholder.typicode.com/todos/${id}`),
*     // remap the error
*     catch: (unknown) => new Error(`something went wrong ${unknown}`)
*   })
*
* //      ┌─── Effect<Response, Error, never>
* //      ▼
* const program = getTodo(1)
* ```
*
* @see {@link promise} if the effectful computation is asynchronous and does not throw errors.
*
* @since 2.0.0
* @category Creating Effects
*/
const tryPromise = tryPromise$1;
/**
* Creates an `Effect` that always succeeds with a given value.
*
* **When to Use**
*
* Use this function when you need an effect that completes successfully with a
* specific value without any errors or external dependencies.
*
* @see {@link fail} to create an effect that represents a failure.
*
* @example
* ```ts
* // Title: Creating a Successful Effect
* import { Effect } from "effect"
*
* // Creating an effect that represents a successful scenario
* //
* //      ┌─── Effect<number, never, never>
* //      ▼
* const success = Effect.succeed(42)
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const succeed = succeed$2;
/**
* Returns an effect which succeeds with `None`.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.succeedNone
*
* Effect.runPromise(program).then(console.log)
* // Output: { _id: 'Option', _tag: 'None' }
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const succeedNone = succeedNone$1;
/**
* Returns an effect which succeeds with the value wrapped in a `Some`.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.succeedSome(42)
*
* Effect.runPromise(program).then(console.log)
* // Output: { _id: 'Option', _tag: 'Some', value: 42 }
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const succeedSome = succeedSome$1;
/**
* Delays the creation of an `Effect` until it is actually needed.
*
* **When to Use**
*
* Use `suspend` when you need to defer the evaluation of an effect until it is required. This is particularly useful for optimizing expensive computations, managing circular dependencies, or resolving type inference issues.
*
* **Details**
*
* `suspend` takes a thunk that represents the effect and wraps it in a suspended effect. This means the effect will not be created until it is explicitly needed, which is helpful in various scenarios:
* - **Lazy Evaluation**: Helps optimize performance by deferring computations, especially when the effect might not be needed, or when its computation is expensive. This also ensures that any side effects or scoped captures are re-executed on each invocation.
* - **Handling Circular Dependencies**: Useful in managing circular dependencies, such as recursive functions that need to avoid eager evaluation to prevent stack overflow.
* - **Unifying Return Types**: Can help TypeScript unify return types in situations where multiple branches of logic return different effects, simplifying type inference.
*
* @example
* ```ts
* // Title: Lazy Evaluation with Side Effects
* import { Effect } from "effect"
*
* let i = 0
*
* const bad = Effect.succeed(i++)
*
* const good = Effect.suspend(() => Effect.succeed(i++))
*
* console.log(Effect.runSync(bad)) // Output: 0
* console.log(Effect.runSync(bad)) // Output: 0
*
* console.log(Effect.runSync(good)) // Output: 1
* console.log(Effect.runSync(good)) // Output: 2
* ```
*
* @example
* // Title: Recursive Fibonacci
* import { Effect } from "effect"
*
* const blowsUp = (n: number): Effect.Effect<number> =>
*   n < 2
*     ? Effect.succeed(1)
*     : Effect.zipWith(blowsUp(n - 1), blowsUp(n - 2), (a, b) => a + b)
*
* // console.log(Effect.runSync(blowsUp(32)))
* // crash: JavaScript heap out of memory
*
* const allGood = (n: number): Effect.Effect<number> =>
*   n < 2
*     ? Effect.succeed(1)
*     : Effect.zipWith(
*         Effect.suspend(() => allGood(n - 1)),
*         Effect.suspend(() => allGood(n - 2)),
*         (a, b) => a + b
*       )
*
* console.log(Effect.runSync(allGood(32)))
* // Output: 3524578
*
* @example
* // Title: Using Effect.suspend to Help TypeScript Infer Types
* import { Effect } from "effect"
*
* //   Without suspend, TypeScript may struggle with type inference.
* //   Inferred type:
* //     (a: number, b: number) =>
* //       Effect<never, Error, never> | Effect<number, never, never>
* const withoutSuspend = (a: number, b: number) =>
*   b === 0
*     ? Effect.fail(new Error("Cannot divide by zero"))
*     : Effect.succeed(a / b)
*
* //   Using suspend to unify return types.
* //   Inferred type:
* //     (a: number, b: number) => Effect<number, Error, never>
* const withSuspend = (a: number, b: number) =>
*   Effect.suspend(() =>
*     b === 0
*       ? Effect.fail(new Error("Cannot divide by zero"))
*       : Effect.succeed(a / b)
*   )
*
* @since 2.0.0
* @category Creating Effects
*/
const suspend = suspend$1;
/**
* Creates an `Effect` that represents a synchronous side-effectful computation.
*
* **When to Use**
*
* Use `sync` when you are sure the operation will not fail.
*
* **Details**
*
* The provided function (`thunk`) must not throw errors; if it does, the error
* will be treated as a "defect".
*
* This defect is not a standard error but indicates a flaw in the logic that
* was expected to be error-free. You can think of it similar to an unexpected
* crash in the program, which can be further managed or logged using tools like
* {@link catchAllDefect}.
*
* @see {@link try_ | try} for a version that can handle failures.
*
* @example
* ```ts
* // Title: Logging a Message
* import { Effect } from "effect"
*
* const log = (message: string) =>
*   Effect.sync(() => {
*     console.log(message) // side effect
*   })
*
* //      ┌─── Effect<void, never, never>
* //      ▼
* const program = log("Hello, World!")
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const sync = sync$1;
const void_$1 = void_$3;
const undefined_$1 = undefined_$2;
/**
* Creates an `Effect` from a callback-based asynchronous function.
*
* **Details**
*
* The `resume` function:
* - Must be called exactly once. Any additional calls will be ignored.
* - Can return an optional `Effect` that will be run if the `Fiber` executing
*   this `Effect` is interrupted. This can be useful in scenarios where you
*   need to handle resource cleanup if the operation is interrupted.
* - Can receive an `AbortSignal` to handle interruption if needed.
*
* The `FiberId` of the fiber that may complete the async callback may also be
* specified using the `blockingOn` argument. This is called the "blocking
* fiber" because it suspends the fiber executing the `async` effect (i.e.
* semantically blocks the fiber from making progress). Specifying this fiber id
* in cases where it is known will improve diagnostics, but not affect the
* behavior of the returned effect.
*
* **When to Use**
*
* Use `Effect.async` when dealing with APIs that use callback-style instead of
* `async/await` or `Promise`.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const delay = (ms: number) =>
*   Effect.callback<void>((resume) => {
*     const timeoutId = setTimeout(() => {
*       resume(Effect.void)
*     }, ms)
*     // Cleanup function for interruption
*     return Effect.sync(() => clearTimeout(timeoutId))
*   })
*
* const program = delay(1000)
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const callback = callback$1;
/**
* Returns an effect that will never produce anything. The moral equivalent of
* `while(true) {}`, only without the wasted CPU cycles.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // This effect will never complete
* const program = Effect.never
*
* // This will run forever (or until interrupted)
* // Effect.runPromise(program) // Never resolves
*
* // Use with timeout for practical applications
* const timedProgram = Effect.timeout(program, "1 second")
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const never$1 = never$2;
/**
* Provides a way to write effectful code using generator functions, simplifying
* control flow and error handling.
*
* **When to Use**
*
* `gen` allows you to write code that looks and behaves like synchronous
* code, but it can handle asynchronous tasks, errors, and complex control flow
* (like loops and conditions). It helps make asynchronous code more readable
* and easier to manage.
*
* The generator functions work similarly to `async/await` but with more
* explicit control over the execution of effects. You can `yield*` values from
* effects and return the final result at the end.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const addServiceCharge = (amount: number) => amount + 1
*
* const applyDiscount = (
*   total: number,
*   discountRate: number
* ): Effect.Effect<number, Error> =>
*   discountRate === 0
*     ? Effect.fail(new Error("Discount rate cannot be zero"))
*     : Effect.succeed(total - (total * discountRate) / 100)
*
* const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))
*
* const fetchDiscountRate = Effect.promise(() => Promise.resolve(5))
*
* export const program = Effect.gen(function*() {
*   const transactionAmount = yield* fetchTransactionAmount
*   const discountRate = yield* fetchDiscountRate
*   const discountedAmount = yield* applyDiscount(
*     transactionAmount,
*     discountRate
*   )
*   const finalAmount = addServiceCharge(discountedAmount)
*   return `Final amount to charge: ${finalAmount}`
* })
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const gen = gen$1;
/**
* Creates an `Effect` that represents a recoverable error.
*
* **When to Use**
*
* Use this function to explicitly signal an error in an `Effect`. The error
* will keep propagating unless it is handled. You can handle the error with
* functions like {@link catchAll} or {@link catchTag}.
*
* @see {@link succeed} to create an effect that represents a successful value.
*
* @example
* ```ts
* // Title: Creating a Failed Effect
* import { Effect } from "effect"
*
* //      ┌─── Effect<never, Error, never>
* //      ▼
* const failure = Effect.fail(
*   new Error("Operation failed due to network error")
* )
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const fail = fail$3;
/**
* Creates an `Effect` that represents a recoverable error using a lazy evaluation.
*
* This function is useful when you need to create an error effect but want to
* defer the computation of the error value until the effect is actually run.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.failSync(() => new Error("Something went wrong"))
*
* Effect.runPromiseExit(program).then(console.log)
* // Output: { _id: 'Exit', _tag: 'Failure', cause: ... }
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const failSync = failSync$1;
/**
* Creates an `Effect` that represents a failure with a specific `Cause`.
*
* This function allows you to create effects that fail with complex error
* structures, including multiple errors, defects, interruptions, and more.
*
* @example
* ```ts
* import { Cause, Effect } from "effect"
*
* const program = Effect.failCause(
*   Cause.fail("Network error")
* )
*
* Effect.runPromiseExit(program).then(console.log)
* // Output: { _id: 'Exit', _tag: 'Failure', cause: ... }
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const failCause = failCause$2;
/**
* Creates an `Effect` that represents a failure with a `Cause` computed lazily.
*
* This function is useful when you need to create a failure effect with a
* complex cause but want to defer the computation until the effect is run.
*
* @example
* ```ts
* import { Cause, Effect } from "effect"
*
* const program = Effect.failCauseSync(() =>
*   Cause.fail("Error computed at runtime")
* )
*
* Effect.runPromiseExit(program).then(console.log)
* // Output: { _id: 'Exit', _tag: 'Failure', cause: ... }
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const failCauseSync = failCauseSync$1;
/**
* Creates an effect that terminates a fiber with a specified error.
*
* **When to Use**
*
* Use `die` when encountering unexpected conditions in your code that should
* not be handled as regular errors but instead represent unrecoverable defects.
*
* **Details**
*
* The `die` function is used to signal a defect, which represents a critical
* and unexpected error in the code. When invoked, it produces an effect that
* does not handle the error and instead terminates the fiber.
*
* The error channel of the resulting effect is of type `never`, indicating that
* it cannot recover from this failure.
*
* @see {@link dieSync} for a variant that throws a specified error, evaluated lazily.
* @see {@link dieMessage} for a variant that throws a `RuntimeException` with a message.
*
* @example
* ```ts
* // Title: Terminating on Division by Zero with a Specified Error
* import { Effect } from "effect"
*
* const divide = (a: number, b: number) =>
*   b === 0
*     ? Effect.die(new Error("Cannot divide by zero"))
*     : Effect.succeed(a / b)
*
* //      ┌─── Effect<number, never, never>
* //      ▼
* const program = divide(1, 0)
*
* Effect.runPromise(program).catch(console.error)
* // Output:
* // (FiberFailure) Error: Cannot divide by zero
* //   ...stack trace...
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const die = die$3;
const try_ = try_$1;
/**
* Yields control back to the Effect runtime, allowing other fibers to execute.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   console.log("Before yield")
*   yield* Effect.yieldNow
*   console.log("After yield")
* })
*
* Effect.runPromise(program)
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const yieldNow = yieldNow$1;
/**
* Yields control back to the Effect runtime with a specified priority, allowing other fibers to execute.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   console.log("High priority task")
*   yield* Effect.yieldNowWith(10) // Higher priority
*   console.log("Continued after yield")
* })
*
* Effect.runPromise(program)
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const yieldNowWith = yieldNowWith$1;
/**
* Provides access to the current fiber within an effect computation.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.withFiber((fiber) =>
*   Effect.succeed(`Fiber ID: ${fiber.id}`)
* )
*
* Effect.runPromise(program).then(console.log)
* // Output: Fiber ID: 1
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const withFiber = withFiber$1;
/**
* Converts a `Result` to an `Effect`.
*
* @example
* ```ts
* import { Effect, Result } from "effect"
*
* const success = Result.succeed(42)
* const failure = Result.fail("Something went wrong")
*
* const effect1 = Effect.fromResult(success)
* const effect2 = Effect.fromResult(failure)
*
* Effect.runPromise(effect1).then(console.log) // 42
* Effect.runPromiseExit(effect2).then(console.log)
* // { _id: 'Exit', _tag: 'Failure', cause: { _id: 'Cause', _tag: 'Fail', failure: 'Something went wrong' } }
* ```
*
* @since 4.0.0
* @category Conversions
*/
const fromResult = fromResult$1;
/**
* Converts an `Option` to an `Effect`.
*
* @example
* ```ts
* import { Effect, Option } from "effect"
*
* const some = Option.some(42)
* const none = Option.none()
*
* const effect1 = Effect.fromOption(some)
* const effect2 = Effect.fromOption(none)
*
* Effect.runPromise(effect1).then(console.log) // 42
* Effect.runPromiseExit(effect2).then(console.log)
* // { _id: 'Exit', _tag: 'Failure', cause: { _id: 'Cause', _tag: 'Fail', failure: { _id: 'NoSuchElementError' } } }
* ```
*
* @since 4.0.0
* @category Conversions
*/
const fromOption = fromOption$1;
/**
* Converts a nullable value to an `Effect`, failing with a `NoSuchElementError`
* when the value is `null` or `undefined`.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const input: string | null = null
*
* const program = Effect.gen(function*() {
*   const value = yield* Effect.fromNullishOr(input)
*   yield* Console.log(value)
* }).pipe(
*   Effect.catch(() => Console.log("missing"))
* )
*
* Effect.runPromise(program)
* // Output: missing
* ```
*
* @since 4.0.0
* @category Conversions
*/
const fromNullishOr = fromNullishOr$1;
/**
* Converts a yieldable value to an Effect.
*
* @example
* ```ts
* import { Effect } from "effect"
* import * as Option from "effect/Option"
*
* // Option is yieldable in Effect
* const program = Effect.gen(function*() {
*   const value = yield* Effect.fromYieldable(Option.some(42))
*   return value * 2
* })
*
* Effect.runPromise(program).then(console.log)
* // Output: 84
* ```
*
* @since 4.0.0
* @category Conversions
*/
const fromYieldable = fromYieldable$1;
/**
* Chains effects to produce new `Effect` instances, useful for combining
* operations that depend on previous results.
*
* **Syntax**
*
* ```ts skip-type-checking
* const flatMappedEffect = pipe(myEffect, Effect.flatMap(transformation))
* // or
* const flatMappedEffect = Effect.flatMap(myEffect, transformation)
* // or
* const flatMappedEffect = myEffect.pipe(Effect.flatMap(transformation))
* ```
*
* **Details**
*
* `flatMap` lets you sequence effects so that the result of one effect can be
* used in the next step. It is similar to `flatMap` used with arrays but works
* specifically with `Effect` instances, allowing you to avoid deeply nested
* effect structures.
*
* Since effects are immutable, `flatMap` always returns a new effect instead of
* changing the original one.
*
* **When to Use**
*
* Use `flatMap` when you need to chain multiple effects, ensuring that each
* step produces a new `Effect` while flattening any nested effects that may
* occur.
*
* @example
* ```ts
* import { Effect, pipe } from "effect"
*
* // Function to apply a discount safely to a transaction amount
* const applyDiscount = (
*   total: number,
*   discountRate: number
* ): Effect.Effect<number, Error> =>
*   discountRate === 0
*     ? Effect.fail(new Error("Discount rate cannot be zero"))
*     : Effect.succeed(total - (total * discountRate) / 100)
*
* // Simulated asynchronous task to fetch a transaction amount from database
* const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))
*
* // Chaining the fetch and discount application using `flatMap`
* const finalAmount = pipe(
*   fetchTransactionAmount,
*   Effect.flatMap((amount) => applyDiscount(amount, 5))
* )
*
* Effect.runPromise(finalAmount).then(console.log)
* // Output: 95
* ```
*
* @see {@link tap} for a version that ignores the result of the effect.
*
* @since 2.0.0
* @category Sequencing
*/
const flatMap = flatMap$1;
/**
* Flattens an `Effect` that produces another `Effect` into a single effect.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const nested = Effect.succeed(Effect.succeed("hello"))
*
* const program = Effect.gen(function*() {
*   const value = yield* Effect.flatten(nested)
*   yield* Console.log(value)
*   // Output: hello
* })
* ```
*
* @since 2.0.0
* @category Sequencing
*/
const flatten = flatten$1;
/**
* Chains two actions, where the second action can depend on the result of the
* first.
*
* **Syntax**
*
* ```ts skip-type-checking
* const transformedEffect = pipe(myEffect, Effect.andThen(anotherEffect))
* // or
* const transformedEffect = Effect.andThen(myEffect, anotherEffect)
* // or
* const transformedEffect = myEffect.pipe(Effect.andThen(anotherEffect))
* ```
*
* **When to Use**
*
* Use `andThen` when you need to run multiple actions in sequence, with the
* second action depending on the result of the first. This is useful for
* combining effects or handling computations that must happen in order.
*
* **Details**
*
* The second action can be:
*
* - A constant value (similar to {@link as})
* - A function returning a value (similar to {@link map})
* - A `Promise`
* - A function returning a `Promise`
* - An `Effect`
* - A function returning an `Effect` (similar to {@link flatMap})
*
* **Note:** `andThen` works well with both `Option` and `Result` types,
* treating them as effects.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.zipRight`
*
* @example Applying a Discount Based on Fetched Amount
* ```ts
* import { Effect, pipe } from "effect"
*
* // Function to apply a discount safely to a transaction amount
* const applyDiscount = (
*   total: number,
*   discountRate: number
* ): Effect.Effect<number, Error> =>
*   discountRate === 0
*     ? Effect.fail(new Error("Discount rate cannot be zero"))
*     : Effect.succeed(total - (total * discountRate) / 100)
*
* // Simulated asynchronous task to fetch a transaction amount from database
* const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))
*
* // Using Effect.map and Effect.flatMap
* const result1 = pipe(
*   fetchTransactionAmount,
*   Effect.map((amount) => amount * 2),
*   Effect.flatMap((amount) => applyDiscount(amount, 5))
* )
*
* Effect.runPromise(result1).then(console.log)
* // Output: 190
*
* // Using Effect.andThen
* const result2 = pipe(
*   fetchTransactionAmount,
*   Effect.andThen((amount) => Effect.succeed(amount * 2)),
*   Effect.andThen((amount) => applyDiscount(amount, 5))
* )
*
* Effect.runPromise(result2).then(console.log)
* // Output: 190
* ```
*
* @since 2.0.0
* @category Sequencing
*/
const andThen = andThen$1;
/**
* Runs a side effect with the result of an effect without changing the original
* value.
*
* **When to Use**
*
* Use `tap` when you want to perform a side effect, like logging or tracking,
* without modifying the main value. This is useful when you need to observe or
* record an action but want the original value to be passed to the next step.
*
* **Details**
*
* `tap` works similarly to `flatMap`, but it ignores the result of the function
* passed to it. The value from the previous effect remains available for the
* next part of the chain. Note that if the side effect fails, the entire chain
* will fail too.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.zipLeft`
*
* @example
* ```ts
* // Title: Logging a step in a pipeline
* import { Effect, pipe } from "effect"
* import { Console } from "effect"
*
* // Function to apply a discount safely to a transaction amount
* const applyDiscount = (
*   total: number,
*   discountRate: number
* ): Effect.Effect<number, Error> =>
*   discountRate === 0
*     ? Effect.fail(new Error("Discount rate cannot be zero"))
*     : Effect.succeed(total - (total * discountRate) / 100)
*
* // Simulated asynchronous task to fetch a transaction amount from database
* const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))
*
* const finalAmount = pipe(
*   fetchTransactionAmount,
*   // Log the fetched transaction amount
*   Effect.tap((amount) => Console.log(`Apply a discount to: ${amount}`)),
*   // `amount` is still available!
*   Effect.flatMap((amount) => applyDiscount(amount, 5))
* )
*
* Effect.runPromise(finalAmount).then(console.log)
* // Output:
* // Apply a discount to: 100
* // 95
* ```
*
* @since 2.0.0
* @category Sequencing
*/
const tap = tap$1;
/**
* Encapsulates both success and failure of an `Effect` into a `Result` type.
*
* **Details**
*
* This function converts an effect that may fail into an effect that always
* succeeds, wrapping the outcome in a `Result` type. The result will be
* `Result.Err` if the effect fails, containing the recoverable error, or
* `Result.Ok` if it succeeds, containing the result.
*
* Using this function, you can handle recoverable errors explicitly without
* causing the effect to fail. This is particularly useful in scenarios where
* you want to chain effects and manage both success and failure in the same
* logical flow.
*
* It's important to note that unrecoverable errors, often referred to as
* "defects," are still thrown and not captured within the `Result` type. Only
* failures that are explicitly represented as recoverable errors in the effect
* are encapsulated.
*
* The resulting effect cannot fail directly because all recoverable failures
* are represented inside the `Result` type.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.either`
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const success = Effect.succeed(42)
* const failure = Effect.fail("Something went wrong")
*
* const program1 = Effect.result(success)
* const program2 = Effect.result(failure)
*
* Effect.runPromise(program1).then(console.log)
* // { _id: 'Result', _tag: 'Success', value: 42 }
*
* Effect.runPromise(program2).then(console.log)
* // { _id: 'Result', _tag: 'Failure', error: 'Something went wrong' }
* ```
*
* @see {@link option} for a version that uses `Option` instead.
* @see {@link exit} for a version that encapsulates both recoverable errors and defects in an `Exit`.
*
* @since 4.0.0
* @category Outcome Encapsulation
*/
const result = result$1;
/**
* Convert success to `Option.some` and failure to `Option.none`.
*
* **Details**
*
* Success values become `Option.some`, recoverable failures become
* `Option.none`, and defects still fail the effect.
*
* @example
* ```ts
* import { Console, Effect, Option } from "effect"
*
* const program = Effect.gen(function*() {
*   const someValue = yield* Effect.option(Effect.succeed(1))
*   const noneValue = yield* Effect.option(Effect.fail("missing"))
*
*   yield* Console.log(Option.isSome(someValue))
*   yield* Console.log(Option.isNone(noneValue))
* })
*
* Effect.runPromise(program)
* // true
* // true
* ```
*
* @see {@link result} for a version that uses `Result` instead.
* @see {@link exit} for a version that encapsulates both recoverable errors and defects in an `Exit`.
*
* @since 2.0.0
* @category Output Encapsulation
*/
const option = option$1;
/**
* Transforms an effect to encapsulate both failure and success using the `Exit`
* data type.
*
* **Details**
*
* `exit` wraps an effect's success or failure inside an `Exit` type, allowing
* you to handle both cases explicitly.
*
* The resulting effect cannot fail because the failure is encapsulated within
* the `Exit.Failure` type. The error type is set to `never`, indicating that
* the effect is structured to never fail directly.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const success = Effect.succeed(42)
* const failure = Effect.fail("Something went wrong")
*
* const program1 = Effect.exit(success)
* const program2 = Effect.exit(failure)
*
* Effect.runPromise(program1).then(console.log)
* // { _id: 'Exit', _tag: 'Success', value: 42 }
*
* Effect.runPromise(program2).then(console.log)
* // { _id: 'Exit', _tag: 'Failure', cause: { _id: 'Cause', _tag: 'Fail', failure: 'Something went wrong' } }
* ```
*
* @see {@link option} for a version that uses `Option` instead.
* @see {@link result} for a version that uses `Result` instead.
*
* @since 2.0.0
* @category Outcome Encapsulation
*/
const exit = exit$1;
/**
* Transforms the value inside an effect by applying a function to it.
*
* **Syntax**
*
* ```ts skip-type-checking
* const mappedEffect = pipe(myEffect, Effect.map(transformation))
* // or
* const mappedEffect = Effect.map(myEffect, transformation)
* // or
* const mappedEffect = myEffect.pipe(Effect.map(transformation))
* ```
*
* **Details**
*
* `map` takes a function and applies it to the value contained within an
* effect, creating a new effect with the transformed value.
*
* It's important to note that effects are immutable, meaning that the original
* effect is not modified. Instead, a new effect is returned with the updated
* value.
*
* @example Adding a Service Charge
* ```ts
* import { Effect, pipe } from "effect"
*
* const addServiceCharge = (amount: number) => amount + 1
*
* const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))
*
* const finalAmount = pipe(
*   fetchTransactionAmount,
*   Effect.map(addServiceCharge)
* )
*
* Effect.runPromise(finalAmount).then(console.log)
* // Output: 101
* ```
*
* @see {@link mapError} for a version that operates on the error channel.
* @see {@link mapBoth} for a version that operates on both channels.
* @see {@link flatMap} or {@link andThen} for a version that can return a new effect.
*
* @since 2.0.0
* @category Mapping
*/
const map = map$3;
/**
* Replaces the value inside an effect with a constant value.
*
* `as` allows you to ignore the original value inside an effect and
* replace it with a new constant value.
*
* @example
* ```ts
* // Title: Replacing a Value
* import { Effect, pipe } from "effect"
*
* // Replaces the value 5 with the constant "new value"
* const program = pipe(Effect.succeed(5), Effect.as("new value"))
*
* Effect.runPromise(program).then(console.log)
* // Output: "new value"
* ```
*
* @since 2.0.0
* @category Mapping
*/
const as = as$1;
/**
* This function maps the success value of an `Effect` value to a `Some` value
* in an `Option` value. If the original `Effect` value fails, the returned
* `Effect` value will also fail.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.asSome(Effect.succeed(42))
*
* Effect.runPromise(program).then(console.log)
* // { _id: 'Option', _tag: 'Some', value: 42 }
* ```
*
* @category Mapping
* @since 2.0.0
*/
const asSome = asSome$1;
/**
* This function maps the success value of an `Effect` value to `void`. If the
* original `Effect` value succeeds, the returned `Effect` value will also
* succeed. If the original `Effect` value fails, the returned `Effect` value
* will fail with the same error.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.asVoid(Effect.succeed(42))
*
* Effect.runPromise(program).then(console.log)
* // undefined (void)
* ```
*
* @since 2.0.0
* @category Mapping
*/
const asVoid = asVoid$2;
/**
* The `flip` function swaps the success and error channels of an effect,
* so that the success becomes the error, and the error becomes the success.
*
* This function is useful when you need to reverse the flow of an effect,
* treating the previously successful values as errors and vice versa. This can
* be helpful in scenarios where you want to handle a success as a failure or
* treat an error as a valid result.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* //      ┌─── Effect<number, string, never>
* //      ▼
* const program = Effect.fail("Oh uh!").pipe(Effect.as(2))
*
* //      ┌─── Effect<string, number, never>
* //      ▼
* const flipped = Effect.flip(program)
* ```
*
* @since 2.0.0
* @category Mapping
*/
const flip$1 = flip$2;
/**
* Combines two effects into a single effect, producing a tuple with the results of both effects.
*
* The `zip` function executes the first effect (left) and then the second effect (right).
* Once both effects succeed, their results are combined into a tuple.
*
* **Concurrency**
*
* By default, `zip` processes the effects sequentially. To execute the effects concurrently,
* use the `{ concurrent: true }` option.
*
* @see {@link zipWith} for a version that combines the results with a custom function.
* @see {@link validate} for a version that accumulates errors.
*
* @example
* ```ts
* // Title: Combining Two Effects Sequentially
* import { Effect } from "effect"
*
* const task1 = Effect.succeed(1).pipe(
*   Effect.delay("200 millis"),
*   Effect.tap(Effect.log("task1 done"))
* )
* const task2 = Effect.succeed("hello").pipe(
*   Effect.delay("100 millis"),
*   Effect.tap(Effect.log("task2 done"))
* )
*
* // Combine the two effects together
* //
* //      ┌─── Effect<[number, string], never, never>
* //      ▼
* const program = Effect.zip(task1, task2)
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // timestamp=... level=INFO fiber=#0 message="task1 done"
* // timestamp=... level=INFO fiber=#0 message="task2 done"
* // [ 1, 'hello' ]
* ```
*
* @example
* // Title: Combining Two Effects Concurrently
* import { Effect } from "effect"
*
* const task1 = Effect.succeed(1).pipe(
*   Effect.delay("200 millis"),
*   Effect.tap(Effect.log("task1 done"))
* )
* const task2 = Effect.succeed("hello").pipe(
*   Effect.delay("100 millis"),
*   Effect.tap(Effect.log("task2 done"))
* )
*
* // Run both effects concurrently using the concurrent option
* const program = Effect.zip(task1, task2, { concurrent: true })
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // timestamp=... level=INFO fiber=#0 message="task2 done"
* // timestamp=... level=INFO fiber=#0 message="task1 done"
* // [ 1, 'hello' ]
*
* @since 2.0.0
* @category Zipping
*/
const zip = zip$1;
/**
* Combines two effects sequentially and applies a function to their results to
* produce a single value.
*
* **When to Use**
*
* The `zipWith` function is similar to {@link zip}, but instead of returning a
* tuple of results, it applies a provided function to the results of the two
* effects, combining them into a single value.
*
* **Concurrency**
*
* By default, the effects are run sequentially. To execute them concurrently,
* use the `{ concurrent: true }` option.
*
* @example
* ```ts
* // Title: Combining Effects with a Custom Function
* import { Effect } from "effect"
*
* const task1 = Effect.succeed(1).pipe(
*   Effect.delay("200 millis"),
*   Effect.tap(Effect.log("task1 done"))
* )
* const task2 = Effect.succeed("hello").pipe(
*   Effect.delay("100 millis"),
*   Effect.tap(Effect.log("task2 done"))
* )
*
* const task3 = Effect.zipWith(
*   task1,
*   task2,
*   // Combines results into a single value
*   (number, string) => number + string.length
* )
*
* Effect.runPromise(task3).then(console.log)
* // Output:
* // timestamp=... level=INFO fiber=#3 message="task1 done"
* // timestamp=... level=INFO fiber=#2 message="task2 done"
* // 6
* ```
*
* @since 2.0.0
* @category Zipping
*/
const zipWith = zipWith$1;
const catch_ = catch_$1;
/**
* Catches and handles specific errors by their `_tag` field, which is used as a
* discriminator.
*
* **When to Use**
*
* `catchTag` is useful when your errors are tagged with a readonly `_tag` field
* that identifies the error type. You can use this function to handle specific
* error types by matching the `_tag` value. This allows for precise error
* handling, ensuring that only specific errors are caught and handled.
*
* The error type must have a readonly `_tag` field to use `catchTag`. This
* field is used to identify and match errors.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* class NetworkError {
*   readonly _tag = "NetworkError"
*   constructor(readonly message: string) {}
* }
*
* class ValidationError {
*   readonly _tag = "ValidationError"
*   constructor(readonly message: string) {}
* }
*
* declare const task: Effect.Effect<string, NetworkError | ValidationError>
*
* const program = Effect.catchTag(
*   task,
*   "NetworkError",
*   (error) => Effect.succeed(`Recovered from network error: ${error.message}`)
* )
* ```
*
* @since 2.0.0
* @category Error Handling
*/
const catchTag = catchTag$1;
/**
* Handles multiple errors in a single block of code using their `_tag` field.
*
* **When to Use**
*
* `catchTags` is a convenient way to handle multiple error types at
* once. Instead of using {@link catchTag} multiple times, you can pass an
* object where each key is an error type's `_tag`, and the value is the handler
* for that specific error. This allows you to catch and recover from multiple
* error types in a single call.
*
* The error type must have a readonly `_tag` field to use `catchTag`. This
* field is used to identify and match errors.
*
* @example
* ```ts
* import { Data, Effect } from "effect"
*
* // Define tagged error types
* class ValidationError extends Data.TaggedError("ValidationError")<{
*   message: string
* }> {}
*
* class NetworkError extends Data.TaggedError("NetworkError")<{
*   statusCode: number
* }> {}
*
* // An effect that might fail with multiple error types
* declare const program: Effect.Effect<string, ValidationError | NetworkError>
*
* // Handle multiple error types at once
* const handled = Effect.catchTags(program, {
*   ValidationError: (error) =>
*     Effect.succeed(`Validation failed: ${error.message}`),
*   NetworkError: (error) => Effect.succeed(`Network error: ${error.statusCode}`)
* })
* ```
*
* @since 2.0.0
* @category Error Handling
*/
const catchTags = catchTags$1;
/**
* Catches a specific reason within a tagged error.
*
* Use this to handle nested error causes without removing the parent error
* from the error channel. The handler receives the unwrapped reason.
*
* @example
* ```ts
* import { Data, Effect } from "effect"
*
* class RateLimitError extends Data.TaggedError("RateLimitError")<{
*   retryAfter: number
* }> {}
*
* class QuotaExceededError extends Data.TaggedError("QuotaExceededError")<{
*   limit: number
* }> {}
*
* class AiError extends Data.TaggedError("AiError")<{
*   reason: RateLimitError | QuotaExceededError
* }> {}
*
* declare const program: Effect.Effect<string, AiError>
*
* // Handle rate limits specifically
* const handled = program.pipe(
*   Effect.catchReason("AiError", "RateLimitError", (reason) =>
*     Effect.succeed(`Retry after ${reason.retryAfter}s`)
*   )
* )
* ```
*
* @since 4.0.0
* @category Error Handling
*/
const catchReason = catchReason$1;
/**
* Catches multiple reasons within a tagged error using an object of handlers.
*
* @example
* ```ts
* import { Data, Effect } from "effect"
*
* class RateLimitError extends Data.TaggedError("RateLimitError")<{
*   retryAfter: number
* }> {}
*
* class QuotaExceededError extends Data.TaggedError("QuotaExceededError")<{
*   limit: number
* }> {}
*
* class AiError extends Data.TaggedError("AiError")<{
*   reason: RateLimitError | QuotaExceededError
* }> {}
*
* declare const program: Effect.Effect<string, AiError>
*
* const handled = program.pipe(
*   Effect.catchReasons("AiError", {
*     RateLimitError: (reason) =>
*       Effect.succeed(`Retry after ${reason.retryAfter}s`),
*     QuotaExceededError: (reason) =>
*       Effect.succeed(`Quota exceeded: ${reason.limit}`)
*   })
* )
* ```
*
* @since 4.0.0
* @category Error Handling
*/
const catchReasons = catchReasons$1;
/**
* Promotes nested reason errors into the Effect error channel, replacing
* the parent error.
*
* @example
* ```ts
* import { Data, Effect } from "effect"
*
* class RateLimitError extends Data.TaggedError("RateLimitError")<{
*   retryAfter: number
* }> {}
*
* class QuotaExceededError extends Data.TaggedError("QuotaExceededError")<{
*   limit: number
* }> {}
*
* class AiError extends Data.TaggedError("AiError")<{
*   reason: RateLimitError | QuotaExceededError
* }> {}
*
* declare const program: Effect.Effect<string, AiError>
*
* // Before: Effect<string, AiError>
* // After:  Effect<string, RateLimitError | QuotaExceededError>
* const unwrapped = program.pipe(Effect.unwrapReason("AiError"))
* ```
*
* @since 4.0.0
* @category Error Handling
*/
const unwrapReason = unwrapReason$1;
/**
* Handles both recoverable and unrecoverable errors by providing a recovery
* effect.
*
* **When to Use**
*
* The `catchCause` function allows you to handle all errors, including
* unrecoverable defects, by providing a recovery effect. The recovery logic is
* based on the `Cause` of the error, which provides detailed information about
* the failure.
*
* **When to Recover from Defects**
*
* Defects are unexpected errors that typically shouldn't be recovered from, as
* they often indicate serious issues. However, in some cases, such as
* dynamically loaded plugins, controlled recovery might be needed.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.catchAllCause`
*
* @example
* ```ts
* import { Cause, Console, Effect } from "effect"
*
* // An effect that might fail in different ways
* const program = Effect.die("Something went wrong")
*
* // Recover from any cause (including defects)
* const recovered = Effect.catchCause(program, (cause) => {
*   if (Cause.hasDies(cause)) {
*     return Console.log("Caught defect").pipe(
*       Effect.as("Recovered from defect")
*     )
*   }
*   return Effect.succeed("Unknown error")
* })
* ```
*
* @since 4.0.0
* @category Error Handling
*/
const catchCause = catchCause$1;
/**
* Recovers from all defects using a provided recovery function.
*
* **When to Use**
*
* There is no sensible way to recover from defects. This method should be used
* only at the boundary between Effect and an external system, to transmit
* information on a defect for diagnostic or explanatory purposes.
*
* **Details**
*
* `catchAllDefect` allows you to handle defects, which are unexpected errors
* that usually cause the program to terminate. This function lets you recover
* from these defects by providing a function that handles the error. However,
* it does not handle expected errors (like those from {@link fail}) or
* execution interruptions (like those from {@link interrupt}).
*
* **When to Recover from Defects**
*
* Defects are unexpected errors that typically shouldn't be recovered from, as
* they often indicate serious issues. However, in some cases, such as
* dynamically loaded plugins, controlled recovery might be needed.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.catchAllDefect`
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* // An effect that might throw an unexpected error (defect)
* const program = Effect.sync(() => {
*   throw new Error("Unexpected error")
* })
*
* // Recover from defects only
* const recovered = Effect.catchDefect(program, (defect) => {
*   return Console.log(`Caught defect: ${defect}`).pipe(
*     Effect.as("Recovered from defect")
*   )
* })
* ```
*
* @since 4.0.0
* @category Error Handling
*/
const catchDefect = catchDefect$1;
/**
* Recovers from specific errors using a `Filter`, `Predicate`, or
* `Refinement`.
*
* **When to Use**
*
* `catchIf` lets you recover from errors that match a condition. Pass a
* `Filter` for transformation, a `Refinement` for type narrowing, or a
* `Predicate` for simple boolean matching. Non-matching errors re-fail with
* the original cause. Defects and interrupts are not caught.
*
* **Previously Known As**
*
* This API replaces the following:
*
* - `Effect.catchSome` (Effect 3.x)
* - `Effect.catchIf`
*
* @example
* ```ts
* import { Data, Effect, Filter } from "effect"
*
* class NotFound extends Data.TaggedError("NotFound")<{ id: string }> {}
*
* const program = Effect.fail(new NotFound({ id: "user-1" }))
*
* // With a refinement
* const recovered = program.pipe(
*   Effect.catchIf(
*     (error): error is NotFound => error._tag === "NotFound",
*     (error) => Effect.succeed(`missing:${error.id}`)
*   )
* )
*
* // With a Filter
* const recovered2 = program.pipe(
*   Effect.catchIf(
*     Filter.tagged("NotFound"),
*     (error) => Effect.succeed(`missing:${error.id}`)
*   )
* )
* ```
*
* @since 2.0.0
* @category Error Handling
*/
const catchIf = catchIf$1;
/**
* Catches `NoSuchElementError` failures and converts them to `Option.none`.
*
* Success values become `Option.some`, `NoSuchElementError` becomes
* `Option.none`, and all other errors are preserved.
*
* @example
* ```ts
* import { Effect, Option } from "effect"
*
* const some = Effect.fromNullishOr(1).pipe(Effect.catchNoSuchElement)
* const none = Effect.fromNullishOr(null).pipe(Effect.catchNoSuchElement)
*
* Effect.runPromise(some).then(console.log) // { _id: 'Option', _tag: 'Some', value: 1 }
* Effect.runPromise(none).then(console.log) // { _id: 'Option', _tag: 'None' }
* ```
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.optionFromOptional`
*
* @since 2.0.0
* @category Error Handling
*/
const catchNoSuchElement = catchNoSuchElement$1;
/**
* Recovers from specific failures based on a predicate.
*
* This function allows you to conditionally catch and recover from failures
* that match a specific predicate. This is useful when you want to handle
* only certain types of errors while letting others propagate.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.catchSomeCause`
*
* @example
* ```ts
* import { Cause, Console, Effect } from "effect"
*
* const httpRequest = Effect.fail("Network Error")
*
* // Only catch network-related failures
* const program = Effect.catchCauseIf(
*   httpRequest,
*   Cause.hasFails,
*   (cause) =>
*     Effect.gen(function*() {
*       yield* Console.log(`Caught network error: ${Cause.squash(cause)}`)
*       return "Fallback response"
*     })
* )
*
* Effect.runPromise(program).then(console.log)
* // Output: "Caught network error: Network Error"
* // Then: "Fallback response"
* ```
*
* @since 4.0.0
* @category Error Handling
*/
const catchCauseIf = catchCauseIf$1;
/**
* The `mapError` function is used to transform or modify the error
* produced by an effect, without affecting its success value.
*
* This function is helpful when you want to enhance the error with additional
* information, change the error type, or apply custom error handling while
* keeping the original behavior of the effect's success values intact. It only
* operates on the error channel and leaves the success channel unchanged.
*
* @see {@link map} for a version that operates on the success channel.
* @see {@link mapBoth} for a version that operates on both channels.
* @see {@link orElseFail} if you want to replace the error with a new one.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* //      ┌─── Effect<number, string, never>
* //      ▼
* const simulatedTask = Effect.fail("Oh no!").pipe(Effect.as(1))
*
* //      ┌─── Effect<number, Error, never>
* //      ▼
* const mapped = Effect.mapError(
*   simulatedTask,
*   (message) => new Error(message)
* )
* ```
*
* @since 2.0.0
* @category Error Handling
*/
const mapError = mapError$2;
/**
* Applies transformations to both the success and error channels of an effect.
*
* **Details**
*
* This function takes two map functions as arguments: one for the error channel
* and one for the success channel. You can use it when you want to modify both
* the error and the success values without altering the overall success or
* failure status of the effect.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* //      ┌─── Effect<number, string, never>
* //      ▼
* const simulatedTask = Effect.fail("Oh no!").pipe(Effect.as(1))
*
* //      ┌─── Effect<boolean, Error, never>
* //      ▼
* const modified = Effect.mapBoth(simulatedTask, {
*   onFailure: (message) => new Error(message),
*   onSuccess: (n) => n > 0
* })
* ```
*
* @see {@link map} for a version that operates on the success channel.
* @see {@link mapError} for a version that operates on the error channel.
*
* @since 2.0.0
* @category Mapping
*/
const mapBoth = mapBoth$2;
/**
* Converts an effect's failure into a fiber termination, removing the error from the effect's type.
*
* **When to Use*
*
* Use `orDie` when failures should be treated as unrecoverable defects and no error handling is required.
*
* **Details**
*
* The `orDie` function is used when you encounter errors that you do not want to handle or recover from.
* It removes the error type from the effect and ensures that any failure will terminate the fiber.
* This is useful for propagating failures as defects, signaling that they should not be handled within the effect.
*
* @see {@link orDieWith} if you need to customize the error.
*
* @example
* ```ts
* // Title: Propagating an Error as a Defect
* import { Effect } from "effect"
*
* const divide = (a: number, b: number) =>
*   b === 0
*     ? Effect.fail(new Error("Cannot divide by zero"))
*     : Effect.succeed(a / b)
*
* //      ┌─── Effect<number, never, never>
* //      ▼
* const program = Effect.orDie(divide(1, 0))
*
* Effect.runPromise(program).catch(console.error)
* // Output:
* // (FiberFailure) Error: Cannot divide by zero
* //   ...stack trace...
* ```
*
* @since 2.0.0
* @category Converting Failures to Defects
*/
const orDie = orDie$1;
/**
* The `tapError` function executes an effectful operation to inspect the
* failure of an effect without modifying it.
*
* This function is useful when you want to perform some side effect (like
* logging or tracking) on the failure of an effect, but without changing the
* result of the effect itself. The error remains in the effect's error channel,
* while the operation you provide can inspect or act on it.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* // Simulate a task that fails with an error
* const task: Effect.Effect<number, string> = Effect.fail("NetworkError")
*
* // Use tapError to log the error message when the task fails
* const tapping = Effect.tapError(
*   task,
*   (error) => Console.log(`expected error: ${error}`)
* )
*
* Effect.runFork(tapping)
* // Output:
* // expected error: NetworkError
* ```
*
* @since 2.0.0
* @category Sequencing
*/
const tapError = tapError$1;
/**
* Runs an effectful handler when a failure's `_tag` matches.
*
* Use this with tagged-union errors to perform side effects for a tag (or tag
* list) while preserving the original failure.
*
* @example
* ```ts
* import { Console, Data, Effect } from "effect"
*
* class NetworkError extends Data.TaggedError("NetworkError")<{
*   statusCode: number
* }> {}
*
* class ValidationError extends Data.TaggedError("ValidationError")<{
*   field: string
* }> {}
*
* const task: Effect.Effect<number, NetworkError | ValidationError> =
*   Effect.fail(new NetworkError({ statusCode: 504 }))
*
* const program = Effect.tapErrorTag(task, "NetworkError", (error) =>
*   Console.log(`expected error: ${error.statusCode}`)
* )
*
* Effect.runPromiseExit(program)
* // Output:
* // expected error: 504
* ```
*
* @since 2.0.0
* @category Sequencing
*/
const tapErrorTag = tapErrorTag$1;
/**
* The `tapCause` function allows you to inspect the complete cause
* of an error, including failures and defects.
*
* This function is helpful when you need to log, monitor, or handle specific
* error causes in your effects. It gives you access to the full error cause,
* whether it's a failure, defect, or other exceptional conditions, without
* altering the error or the overall result of the effect.
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.tapErrorCause`
*
* @example
* ```ts
* import { Cause, Console, Effect } from "effect"
*
* const task = Effect.fail("Something went wrong")
*
* const program = Effect.tapCause(
*   task,
*   (cause) => Console.log(`Logging cause: ${Cause.squash(cause)}`)
* )
*
* Effect.runPromiseExit(program).then(console.log)
* // Output: "Logging cause: Error: Something went wrong"
* // Then: { _id: 'Exit', _tag: 'Failure', cause: ... }
* ```
*
* @since 2.0.0
* @category Sequencing
*/
const tapCause = tapCause$1;
/**
* Conditionally executes a side effect based on the cause of a failed effect.
*
* This function allows you to tap into the cause of an effect's failure only when
* the cause matches a specific predicate. This is useful for conditional logging,
* monitoring, or other side effects based on the type of failure.
*
* @example
* ```ts
* import { Cause, Console, Effect } from "effect"
*
* const task = Effect.fail("Network timeout")
*
* // Only log causes that contain failures (not interrupts or defects)
* const program = Effect.tapCauseIf(
*   task,
*   Cause.hasFails,
*   (cause) => Console.log(`Logging failure cause: ${Cause.squash(cause)}`)
* )
*
* Effect.runPromiseExit(program).then(console.log)
* // Output: "Logging failure cause: Network timeout"
* // Then: { _id: 'Exit', _tag: 'Failure', cause: ... }
* ```
*
* @since 4.0.0
* @category Sequencing
*/
const tapCauseIf = tapCauseIf$1;
/**
* Inspect severe errors or defects (non-recoverable failures) in an effect.
*
* **Details**
*
* This function is specifically designed to handle and inspect defects, which
* are critical failures in your program, such as unexpected runtime exceptions
* or system-level errors. Unlike normal recoverable errors, defects typically
* indicate serious issues that cannot be addressed through standard error
* handling.
*
* When a defect occurs in an effect, the function you provide to this function
* will be executed, allowing you to log, monitor, or handle the defect in some
* way. Importantly, this does not alter the main result of the effect. If no
* defect occurs, the effect behaves as if this function was not used.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* // Simulate a task that fails with a recoverable error
* const task1: Effect.Effect<number, string> = Effect.fail("NetworkError")
*
* // tapDefect won't log anything because NetworkError is not a defect
* const tapping1 = Effect.tapDefect(
*   task1,
*   (cause) => Console.log(`defect: ${cause}`)
* )
*
* Effect.runFork(tapping1)
* // No Output
*
* // Simulate a severe failure in the system
* const task2: Effect.Effect<number> = Effect.die(
*   "Something went wrong"
* )
*
* // Log the defect using tapDefect
* const tapping2 = Effect.tapDefect(
*   task2,
*   (cause) => Console.log(`defect: ${cause}`)
* )
*
* Effect.runFork(tapping2)
* // Output:
* // defect: RuntimeException: Something went wrong
* //   ... stack trace ...
* ```
*
* @since 2.0.0
* @category Sequencing
*/
const tapDefect = tapDefect$1;
/**
* Retries an effect until it succeeds, discarding failures.
*
* Yields between attempts so other fibers can run.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* let attempts = 0
*
* const flaky = Effect.gen(function*() {
*   attempts++
*   yield* Console.log(`Attempt ${attempts}`)
*   if (attempts < 3) {
*     yield* Effect.fail("Not ready")
*   }
*   return "Ready"
* })
*
* const program = Effect.eventually(flaky)
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Attempt 1
* // Attempt 2
* // Attempt 3
* // Ready
* ```
*
* @since 2.0.0
* @category Repetition / Recursion
*/
const eventually = eventually$1;
/**
* Retries a failing effect based on a defined retry policy.
*
* **Details**
*
* The `Effect.retry` function takes an effect and a {@link Schedule} policy,
* and will automatically retry the effect if it fails, following the rules of
* the policy.
*
* If the effect ultimately succeeds, the result will be returned.
*
* If the maximum retries are exhausted and the effect still fails, the failure
* is propagated.
*
* **When to Use**
*
* This can be useful when dealing with intermittent failures, such as network
* issues or temporary resource unavailability. By defining a retry policy, you
* can control the number of retries, the delay between them, and when to stop
* retrying.
*
* @example
* ```ts
* import { Effect, Schedule } from "effect"
*
* let attempt = 0
* const task = Effect.callback<string, Error>((resume) => {
*   attempt++
*   if (attempt <= 2) {
*     resume(Effect.fail(new Error(`Attempt ${attempt} failed`)))
*   } else {
*     resume(Effect.succeed("Success!"))
*   }
* })
*
* const policy = Schedule.addDelay(Schedule.recurs(5), () => Effect.succeed("100 millis"))
* const program = Effect.retry(task, policy)
*
* Effect.runPromise(program).then(console.log)
* // Output: "Success!" (after 2 retries)
* ```
*
* @see {@link retryOrElse} for a version that allows you to run a fallback.
* @see {@link repeat} if your retry condition is based on successful outcomes rather than errors.
*
* @since 2.0.0
* @category Error Handling
*/
const retry = retry$1;
/**
* Retries a failing effect and runs a fallback effect if retries are exhausted.
*
* **Details**
*
* The `Effect.retryOrElse` function attempts to retry a failing effect multiple
* times according to a defined {@link Schedule} policy.
*
* If the retries are exhausted and the effect still fails, it runs a fallback
* effect instead.
*
* **When to Use**
*
* This function is useful when you want to handle failures gracefully by
* specifying an alternative action after repeated failures.
*
* @see {@link retry} for a version that does not run a fallback effect.
*
* @example
* ```ts
* import { Console, Effect, Schedule } from "effect"
*
* let attempt = 0
* const networkRequest = Effect.gen(function*() {
*   attempt++
*   yield* Console.log(`Network attempt ${attempt}`)
*   if (attempt < 3) {
*     return yield* Effect.fail(new Error("Network timeout"))
*   }
*   return "Network data"
* })
*
* // Retry up to 2 times, then fall back to cached data
* const program = Effect.retryOrElse(
*   networkRequest,
*   Schedule.recurs(2),
*   (error, retryCount) =>
*     Effect.gen(function*() {
*       yield* Console.log(`All ${retryCount} retries failed, using cache`)
*       return "Cached data"
*     })
* )
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Network attempt 1
* // Network attempt 2
* // Network attempt 3
* // Network data
* ```
*
* @since 2.0.0
* @category Error Handling
*/
const retryOrElse = retryOrElse$1;
/**
* The `sandbox` function transforms an effect by exposing the full cause
* of any error, defect, or fiber interruption that might occur during its
* execution. It changes the error channel of the effect to include detailed
* information about the cause, which is wrapped in a `Cause<E>` type.
*
* This function is useful when you need access to the complete underlying cause
* of failures, defects, or interruptions, enabling more detailed error
* handling. Once you apply `sandbox`, you can use operators like
* {@link catchAll} and {@link catchTags} to handle specific error conditions.
* If necessary, you can revert the sandboxing operation with {@link unsandbox}
* to return to the original error handling behavior.
*
* @example
* ```ts
* import { Cause, Effect } from "effect"
*
* const task = Effect.fail("Something went wrong")
*
* // Sandbox exposes the full cause as the error type
* const program = Effect.gen(function*() {
*   const result = yield* Effect.flip(Effect.sandbox(task))
*   return `Caught cause: ${Cause.squash(result)}`
* })
*
* Effect.runPromise(program).then(console.log)
* // Output: "Caught cause: Something went wrong"
* ```
*
* @see {@link unsandbox} to restore the original error handling.
*
* @since 2.0.0
* @category Error Handling
*/
const sandbox = sandbox$1;
/**
* Discards both the success and failure values of an effect.
*
* **When to Use**
*
* `ignore` allows you to run an effect without caring about its result, whether
* it succeeds or fails. This is useful when you only care about the side
* effects of the effect and do not need to handle or process its outcome.
*
* Use the `log` option to emit the full {@link Cause} when the effect fails.
*
* @example
* ```ts
* // Title: Using Effect.ignore to Discard Values
* import { Effect } from "effect"
*
* //      ┌─── Effect<number, string, never>
* //      ▼
* const task = Effect.fail("Uh oh!").pipe(Effect.as(5))
*
* //      ┌─── Effect<void, never, never>
* //      ▼
* const program = task.pipe(Effect.ignore)
* ```
*
* @example
* ```ts
* // Title: Logging failures while ignoring results
* import { Effect } from "effect"
*
* const task = Effect.fail("Uh oh!")
*
* const program = task.pipe(Effect.ignore({ log: true }))
* const programWarn = task.pipe(Effect.ignore({ log: "Warn" }))
* ```
*
* **Previously Known As**
*
* This API replaces the following from Effect 3.x:
*
* - `Effect.ignoreLogged`
*
* @since 2.0.0
* @category Error Handling
*/
const ignore = ignore$1;
/**
* Ignores the effect's failure cause, including defects and interruptions.
*
* Use the `log` option to emit the full {@link Cause} when the effect fails.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const task = Effect.fail("boom")
*
* const program = task.pipe(Effect.ignoreCause)
* const programLog = task.pipe(Effect.ignoreCause({ log: true }))
* ```
*
* @since 4.0.0
* @category Error Handling
*/
const ignoreCause = ignoreCause$1;
/**
* Apply an `ExecutionPlan` to an effect, retrying with step-provided resources
* until it succeeds or the plan is exhausted.
*
* Each attempt updates `ExecutionPlan.CurrentMetadata` (attempt and step index),
* and retry timing is derived per step (the first attempt uses the remaining
* attempts schedule; later retries apply the step schedule at least once).
*
* @example
* ```ts
* import { Effect, ExecutionPlan, Layer, ServiceMap } from "effect"
*
* const Endpoint = ServiceMap.Service<{ url: string }>("Endpoint")
*
* const fetchUrl = Effect.gen(function*() {
*   const endpoint = yield* Effect.service(Endpoint)
*   return endpoint.url === "bad" ? yield* Effect.fail("Unavailable") : endpoint.url
* })
*
* const plan = ExecutionPlan.make(
*   { provide: Layer.succeed(Endpoint, { url: "bad" }), attempts: 2 },
*   { provide: Layer.succeed(Endpoint, { url: "good" }) }
* )
*
* const program = Effect.withExecutionPlan(fetchUrl, plan)
* ```
*
* @since 3.16.0
* @category Fallback
*/
const withExecutionPlan = withExecutionPlan$1;
/**
* Replaces the original failure with a success value, ensuring the effect
* cannot fail.
*
* `orElseSucceed` allows you to replace the failure of an effect with a
* success value. If the effect fails, it will instead succeed with the provided
* value, ensuring the effect always completes successfully. This is useful when
* you want to guarantee a successful result regardless of whether the original
* effect failed.
*
* The function ensures that any failure is effectively "swallowed" and replaced
* by a successful value, which can be helpful for providing default values in
* case of failure.
*
* **Important**: This function only applies to failed effects. If the effect
* already succeeds, it will remain unchanged.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const validate = (age: number): Effect.Effect<number, string> => {
*   if (age < 0) {
*     return Effect.fail("NegativeAgeError")
*   } else if (age < 18) {
*     return Effect.fail("IllegalAgeError")
*   } else {
*     return Effect.succeed(age)
*   }
* }
*
* const program = Effect.orElseSucceed(validate(-1), () => 18)
*
* console.log(Effect.runSyncExit(program))
* // Output:
* // { _id: 'Exit', _tag: 'Success', value: 18 }
* ```
*
* @since 2.0.0
* @category Fallback
*/
const orElseSucceed = orElseSucceed$1;
/**
* Adds a time limit to an effect, triggering a timeout if the effect exceeds
* the duration.
*
* The `timeout` function allows you to specify a time limit for an
* effect's execution. If the effect does not complete within the given time, a
* `TimeoutException` is raised. This can be useful for controlling how long
* your program waits for a task to finish, ensuring that it doesn't hang
* indefinitely if the task takes too long.
*
* @see {@link timeoutFail} for a version that raises a custom error.
* @see {@link timeoutFailCause} for a version that raises a custom defect.
* @see {@link timeoutTo} for a version that allows specifying both success and timeout handlers.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const task = Effect.gen(function*() {
*   console.log("Start processing...")
*   yield* Effect.sleep("2 seconds") // Simulates a delay in processing
*   console.log("Processing complete.")
*   return "Result"
* })
*
* // Output will show a TimeoutException as the task takes longer
* // than the specified timeout duration
* const timedEffect = task.pipe(Effect.timeout("1 second"))
*
* Effect.runPromiseExit(timedEffect).then(console.log)
* // Output:
* // Start processing...
* // {
* //   _id: 'Exit',
* //   _tag: 'Failure',
* //   cause: {
* //     _id: 'Cause',
* //     _tag: 'Fail',
* //     failure: { _tag: 'TimeoutException' }
* //   }
* // }
* ```
*
* @since 2.0.0
* @category Delays & Timeouts
*/
const timeout = timeout$1;
/**
* Handles timeouts by returning an `Option` that represents either the result
* or a timeout.
*
* The `timeoutOption` function provides a way to gracefully handle
* timeouts by wrapping the outcome of an effect in an `Option` type. If the
* effect completes within the specified time, it returns a `Some` containing
* the result. If the effect times out, it returns a `None`, allowing you to
* treat the timeout as a regular result instead of throwing an error.
*
* This is useful when you want to handle timeouts without causing the program
* to fail, making it easier to manage situations where you expect tasks might
* take too long but want to continue executing other tasks.
*
* @see {@link timeout} for a version that raises a `TimeoutException`.
* @see {@link timeoutFail} for a version that raises a custom error.
* @see {@link timeoutFailCause} for a version that raises a custom defect.
* @see {@link timeoutTo} for a version that allows specifying both success and timeout handlers.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const task = Effect.gen(function*() {
*   console.log("Start processing...")
*   yield* Effect.sleep("2 seconds") // Simulates a delay in processing
*   console.log("Processing complete.")
*   return "Result"
* })
*
* const timedOutEffect = Effect.all([
*   task.pipe(Effect.timeoutOption("3 seconds")),
*   task.pipe(Effect.timeoutOption("1 second"))
* ])
*
* Effect.runPromise(timedOutEffect).then(console.log)
* // Output:
* // Start processing...
* // Processing complete.
* // Start processing...
* // [
* //   { _id: 'Option', _tag: 'Some', value: 'Result' },
* //   { _id: 'Option', _tag: 'None' }
* // ]
* ```
*
* @since 3.1.0
* @category Delays & Timeouts
*/
const timeoutOption = timeoutOption$1;
/**
* Applies a timeout to an effect, with a fallback effect executed if the timeout is reached.
*
* This function is useful when you want to set a maximum duration for an operation
* and provide an alternative action if the timeout is exceeded.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const slowQuery = Effect.gen(function*() {
*   yield* Console.log("Starting database query...")
*   yield* Effect.sleep("5 seconds")
*   return "Database result"
* })
*
* // Use cached data as fallback when timeout is reached
* const program = Effect.timeoutOrElse(slowQuery, {
*   duration: "2 seconds",
*   onTimeout: () =>
*     Effect.gen(function*() {
*       yield* Console.log("Query timed out, using cached data")
*       return "Cached result"
*     })
* })
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Starting database query...
* // Query timed out, using cached data
* // Cached result
* ```
*
* @since 3.1.0
* @category Delays & Timeouts
*/
const timeoutOrElse = timeoutOrElse$1;
/**
* Returns an effect that is delayed from this effect by the specified
* `Duration`.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.delay(
*   Console.log("Delayed message"),
*   "1 second"
* )
*
* Effect.runFork(program)
* // Waits 1 second, then prints: "Delayed message"
* ```
*
* @since 2.0.0
* @category Delays & Timeouts
*/
const delay = delay$1;
/**
* Returns an effect that suspends for the specified duration. This method is
* asynchronous, and does not actually block the fiber executing the effect.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   yield* Console.log("Start")
*   yield* Effect.sleep("2 seconds")
*   yield* Console.log("End")
* })
*
* Effect.runFork(program)
* // Output: "Start" (immediately)
* // Output: "End" (after 2 seconds)
* ```
*
* @since 2.0.0
* @category Delays & Timeouts
*/
const sleep = sleep$1;
/**
* Measures the runtime of an effect and returns the duration with its result.
*
* The original success, failure, or interruption is preserved; only the success
* value is paired with the duration.
*
* @example
* ```ts
* import { Console, Duration, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const [duration, value] = yield* Effect.timed(Effect.succeed("ok"))
*   yield* Console.log(`took ${Duration.toMillis(duration)}ms: ${value}`)
* })
* ```
*
* @since 2.0.0
* @category Delays & Timeouts
*/
const timed = timed$1;
/**
* Races multiple effects and returns the first successful result.
*
* **Details**
*
* This function runs multiple effects concurrently and returns the result of
* the first one to succeed. If one effect succeeds, the others will be
* interrupted.
*
* If none of the effects succeed, the function will fail with the last error
* encountered.
*
* **When to Use**
*
* This is useful when you want to race multiple effects, but only care about
* the first one to succeed. It is commonly used in cases like timeouts,
* retries, or when you want to optimize for the faster response without
* worrying about the other effects.
*
* @see {@link race} for a version that handles only two effects.
*
* @example
* ```ts
* import { Duration, Effect } from "effect"
*
* // Multiple effects with different delays
* const effect1 = Effect.delay(Effect.succeed("Fast"), Duration.millis(100))
* const effect2 = Effect.delay(Effect.succeed("Slow"), Duration.millis(500))
* const effect3 = Effect.delay(Effect.succeed("Very Slow"), Duration.millis(1000))
*
* // Race all effects - the first to succeed wins
* const raced = Effect.raceAll([effect1, effect2, effect3])
*
* // Result: "Fast" (after ~100ms)
* ```
*
* @since 2.0.0
* @category Racing
*/
const raceAll = raceAll$1;
/**
* Races multiple effects and returns the first successful result.
*
* **Details**
*
* Similar to `raceAll`, this function runs multiple effects concurrently
* and returns the result of the first one to succeed. If one effect succeeds,
* the others will be interrupted.
*
* @example
* ```ts
* import { Duration, Effect } from "effect"
*
* // Multiple effects with different delays and potential failures
* const effect1 = Effect.delay(Effect.succeed("First"), Duration.millis(200))
* const effect2 = Effect.delay(Effect.fail("Second failed"), Duration.millis(100))
* const effect3 = Effect.delay(Effect.succeed("Third"), Duration.millis(300))
*
* // Race all effects - the first to succeed wins
* const raced = Effect.raceAllFirst([effect1, effect2, effect3])
*
* // Result: "First" (after ~200ms, even though effect2 completes first but fails)
* ```
*
* @since 4.0.0
* @category Racing
*/
const raceAllFirst = raceAllFirst$1;
/**
* Races two effects and returns the first successful result.
*
* If one effect succeeds, the other is interrupted and `onWinner` can observe the
* winning fiber. If both fail, the race fails.
*
* @example
* ```ts
* import { Console, Duration, Effect } from "effect"
*
* const fastFail = Effect.delay(Effect.fail("fast-fail"), Duration.millis(10))
* const slowSuccess = Effect.delay(Effect.succeed("slow-success"), Duration.millis(50))
*
* const program = Effect.gen(function*() {
*   const result = yield* Effect.race(fastFail, slowSuccess)
*   yield* Console.log(`winner: ${result}`)
* })
*
* Effect.runPromise(program)
* // Output: winner: slow-success
* ```
*
* @since 2.0.0
* @category Racing
*/
const race = race$1;
/**
* Races two effects and returns the result of the first one to complete, whether
* it succeeds or fails.
*
* The losing effect is interrupted, and `onWinner` can observe the winning fiber.
*
* @example
* ```ts
* import { Console, Duration, Effect } from "effect"
*
* const fastFail = Effect.delay(Effect.fail("fast-fail"), Duration.millis(10))
* const slowSuccess = Effect.delay(Effect.succeed("slow-success"), Duration.millis(50))
*
* const program = Effect.gen(function*() {
*   const message = yield* Effect.match(Effect.raceFirst(fastFail, slowSuccess), {
*     onFailure: (error) => `failed: ${error}`,
*     onSuccess: (value) => `succeeded: ${value}`
*   })
*   yield* Console.log(message)
* })
*
* Effect.runPromise(program)
* // Output: failed: fast-fail
* ```
*
* @since 2.0.0
* @category Racing
*/
const raceFirst = raceFirst$1;
/**
* Filters elements of an iterable using a predicate, refinement, effectful
* predicate, or `Filter.FilterEffect`.
*
* @example
* ```ts
* import { Effect, Filter, Result } from "effect"
*
* // Sync predicate
* const evens = Effect.filter([1, 2, 3, 4], (n) => n % 2 === 0)
*
* // Effectful predicate
* const checked = Effect.filter([1, 2, 3], (n) => Effect.succeed(n > 1))
*
* // FilterEffect
* const mapped = Effect.filter([1, 2, 3, 4], (n) =>
*   Effect.succeed(n % 2 === 0 ? Result.succeed(n * 2) : Result.fail(n))
* )
* ```
*
* @since 2.0.0
* @category Filtering
*/
const filter = filter$1;
/**
* Filters an effect, providing an alternative effect if the predicate fails.
*
* **Details**
*
* This function applies a predicate to the result of an effect. If the
* predicate evaluates to `false`, it executes the `orElse` effect instead. The
* `orElse` effect can produce an alternative value or perform additional
* computations.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // An effect that produces a number
* const program = Effect.succeed(5)
*
* // Filter for even numbers, provide alternative for odd numbers
* const filtered = Effect.filterOrElse(
*   program,
*   (n) => n % 2 === 0,
*   (n) => Effect.succeed(`Number ${n} is odd`)
* )
*
* // Result: "Number 5 is odd" (since 5 is not even)
* ```
*
* @since 2.0.0
* @category Filtering
*/
const filterOrElse = filterOrElse$1;
/**
* Filters an effect, failing with a custom error if the predicate fails.
*
* **Details**
*
* This function applies a predicate to the result of an effect. If the
* predicate evaluates to `false`, the effect fails with either a custom
* error (if `orFailWith` is provided) or a `NoSuchElementError`.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // An effect that produces a number
* const program = Effect.succeed(5)
*
* // Filter for even numbers, fail for odd numbers
* const filtered = Effect.filterOrFail(
*   program,
*   (n) => n % 2 === 0,
*   (n) => `Expected even number, got ${n}`
* )
*
* // Result: Effect.fail("Expected even number, got 5")
* ```
*
* @since 2.0.0
* @category Filtering
*/
const filterOrFail = filterOrFail$1;
/**
* Conditionally executes an effect based on a boolean condition.
*
* **Details**
*
* This function allows you to run an effect only if a given condition evaluates
* to `true`. If the condition is `true`, the effect is executed, and its result
* is wrapped in an `Option.some`. If the condition is `false`, the effect is
* skipped, and the result is `Option.none`.
*
* **When to Use**
*
* This function is useful for scenarios where you need to dynamically decide
* whether to execute an effect based on runtime logic, while also representing
* the skipped case explicitly.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const shouldLog = true
*
* const program = Effect.when(
*   Console.log("Condition is true!"),
*   Effect.succeed(shouldLog)
* )
*
* Effect.runPromise(program).then(console.log)
* // Output: "Condition is true!"
* // { _id: 'Option', _tag: 'Some', value: undefined }
* ```
*
* @see {@link whenEffect} for a version that allows the condition to be an effect.
* @see {@link unless} for a version that executes the effect when the condition is `false`.
*
* @since 2.0.0
* @category Conditional Operators
*/
const when = when$1;
/**
* Handles both success and failure cases of an effect without performing side
* effects.
*
* **Details**
*
* `match` lets you define custom handlers for both success and failure
* scenarios. You provide separate functions to handle each case, allowing you
* to process the result if the effect succeeds, or handle the error if the
* effect fails.
*
* **When to Use**
*
* This is useful for structuring your code to respond differently to success or
* failure without triggering side effects.
*
* @see {@link matchEffect} if you need to perform side effects in the handlers.
*
* @example
* ```ts
* // Title: Handling Both Success and Failure Cases
* import { Effect } from "effect"
*
* const success: Effect.Effect<number, Error> = Effect.succeed(42)
*
* const program1 = Effect.match(success, {
*   onFailure: (error) => `failure: ${error.message}`,
*   onSuccess: (value) => `success: ${value}`
* })
*
* // Run and log the result of the successful effect
* Effect.runPromise(program1).then(console.log)
* // Output: "success: 42"
*
* const failure: Effect.Effect<number, Error> = Effect.fail(
*   new Error("Uh oh!")
* )
*
* const program2 = Effect.match(failure, {
*   onFailure: (error) => `failure: ${error.message}`,
*   onSuccess: (value) => `success: ${value}`
* })
*
* // Run and log the result of the failed effect
* Effect.runPromise(program2).then(console.log)
* // Output: "failure: Uh oh!"
* ```
*
* @since 2.0.0
* @category Pattern Matching
*/
const match$1 = match$4;
/**
* Handles both success and failure cases of an effect without performing side
* effects, with eager evaluation for resolved effects.
*
* **Details**
*
* `matchEager` works like `match` but provides better performance for resolved
* effects (Success or Failure). When the effect is already resolved, it applies
* the handlers immediately without fiber scheduling. For unresolved effects,
* it falls back to the regular `match` behavior.
*
* **When to Use**
*
* Use this when you need to handle both success and failure cases and want
* optimal performance for resolved effects. This is particularly useful in
* scenarios where you frequently work with already computed values.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const result = yield* Effect.matchEager(Effect.succeed(42), {
*     onFailure: (error) => `Failed: ${error}`,
*     onSuccess: (value) => `Success: ${value}`
*   })
*   console.log(result) // "Success: 42"
* })
* ```
*
* @see {@link match} for the non-eager version.
* @see {@link matchEffect} if you need to perform side effects in the handlers.
*
* @since 2.0.0
* @category Pattern Matching
*/
const matchEager = matchEager$1;
/**
* Handles failures by matching the cause of failure.
*
* **Details**
*
* The `matchCause` function allows you to handle failures with access to the
* full cause of the failure within a fiber.
*
* **When to Use**
*
* This is useful for differentiating between different types of errors, such as
* regular failures, defects, or interruptions. You can provide specific
* handling logic for each failure type based on the cause.
*
* @example
* ```ts
* import { Cause, Effect } from "effect"
*
* const task = Effect.fail("Something went wrong")
*
* const program = Effect.matchCause(task, {
*   onFailure: (cause) => `Failed: ${Cause.squash(cause)}`,
*   onSuccess: (value) => `Success: ${value}`
* })
*
* Effect.runPromise(program).then(console.log)
* // Output: "Failed: Error: Something went wrong"
* ```
*
* @see {@link matchCauseEffect} if you need to perform side effects in the
* handlers.
* @see {@link match} if you don't need to handle the cause of the failure.
*
* @since 2.0.0
* @category Pattern Matching
*/
const matchCause = matchCause$1;
/**
* Handles failures by matching the cause of failure with eager evaluation.
*
* **Details**
*
* `matchCauseEager` works like `matchCause` but provides better performance for resolved
* effects by immediately applying the matching function instead of deferring it
* through the effect pipeline.
*
* **When to Use**
*
* This is useful when you have effects that are likely to be already resolved
* and you want to avoid the overhead of the effect pipeline. For pending effects,
* it automatically falls back to the regular `matchCause` behavior.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const handleResult = Effect.matchCauseEager(Effect.succeed(42), {
*   onSuccess: (value) => `Success: ${value}`,
*   onFailure: (cause) => `Failed: ${cause}`
* })
* ```
*
* @since 3.8.0
* @category Pattern Matching
*/
const matchCauseEager = matchCauseEager$1;
/**
* Eagerly handles success or failure with effectful handlers when the effect is already resolved.
*
* If the effect is an `Exit`, the matching handler runs immediately; otherwise it behaves like
* {@link matchCauseEffect}.
*
* @since 4.0.0
* @category Pattern Matching
*/
const matchCauseEffectEager = matchCauseEffectEager$1;
/**
* Handles failures with access to the cause and allows performing side effects.
*
* **Details**
*
* The `matchCauseEffect` function works similarly to {@link matchCause}, but it
* also allows you to perform additional side effects based on the failure
* cause. This function provides access to the complete cause of the failure,
* making it possible to differentiate between various failure types, and allows
* you to respond accordingly while performing side effects (like logging or
* other operations).
*
* @example
* ```ts
* import { Cause, Console, Effect, Result } from "effect"
*
* const task = Effect.fail(new Error("Task failed"))
*
* const program = Effect.matchCauseEffect(task, {
*   onFailure: (cause) =>
*     Effect.gen(function*() {
*       if (Cause.hasFails(cause)) {
*         const error = Cause.findError(cause)
*         if (Result.isSuccess(error)) {
*           yield* Console.log(`Handling error: ${error.success.message}`)
*         }
*         return "recovered from error"
*       } else {
*         yield* Console.log("Handling interruption or defect")
*         return "recovered from interruption/defect"
*       }
*     }),
*   onSuccess: (value) =>
*     Effect.gen(function*() {
*       yield* Console.log(`Success: ${value}`)
*       return `processed ${value}`
*     })
* })
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Handling error: Task failed
* // recovered from error
* ```
*
* @see {@link matchCause} if you don't need side effects and only want to handle the result or failure.
* @see {@link matchEffect} if you don't need to handle the cause of the failure.
*
* @since 2.0.0
* @category Pattern Matching
*/
const matchCauseEffect = matchCauseEffect$1;
/**
* Handles both success and failure cases of an effect, allowing for additional
* side effects.
*
* **Details**
*
* The `matchEffect` function is similar to {@link match}, but it enables you to
* perform side effects in the handlers for both success and failure outcomes.
*
* **When to Use**
*
* This is useful when you need to execute additional actions, like logging or
* notifying users, based on whether an effect succeeds or fails.
*
* @see {@link match} if you don't need side effects and only want to handle the
* result or failure.
*
* @example
* ```ts
* // Title: Handling Both Success and Failure Cases with Side Effects
* import { Effect } from "effect"
*
* const success: Effect.Effect<number, Error> = Effect.succeed(42)
* const failure: Effect.Effect<number, Error> = Effect.fail(
*   new Error("Uh oh!")
* )
*
* const program1 = Effect.matchEffect(success, {
*   onFailure: (error) =>
*     Effect.succeed(`failure: ${error.message}`).pipe(
*       Effect.tap(Effect.log)
*     ),
*   onSuccess: (value) =>
*     Effect.succeed(`success: ${value}`).pipe(Effect.tap(Effect.log))
* })
*
* console.log(Effect.runSync(program1))
* // Output:
* // timestamp=... level=INFO fiber=#0 message="success: 42"
* // success: 42
*
* const program2 = Effect.matchEffect(failure, {
*   onFailure: (error) =>
*     Effect.succeed(`failure: ${error.message}`).pipe(
*       Effect.tap(Effect.log)
*     ),
*   onSuccess: (value) =>
*     Effect.succeed(`success: ${value}`).pipe(Effect.tap(Effect.log))
* })
*
* console.log(Effect.runSync(program2))
* // Output:
* // timestamp=... level=INFO fiber=#1 message="failure: Uh oh!"
* // failure: Uh oh!
* ```
*
* @since 2.0.0
* @category Pattern Matching
*/
const matchEffect = matchEffect$2;
/**
* Determines whether an effect fails.
*
* Defects are not converted; if the effect dies, the resulting effect dies too.
*
* **Example**
*
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const failed = yield* Effect.isFailure(Effect.fail("Uh oh!"))
*   yield* Console.log(failed)
* })
*
* Effect.runPromise(program)
* // Output: true
* ```
*
* @since 2.0.0
* @category Condition Checking
*/
const isFailure = isFailure$2;
/**
* Returns whether an effect completes successfully.
*
* Returns `false` for failures in the error channel, but defects still fail the
* effect.
*
* **Example**
*
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const ok = yield* Effect.isSuccess(Effect.succeed("done"))
*   const failed = yield* Effect.isSuccess(Effect.fail("Uh oh"))
*   yield* Console.log(`ok: ${ok}`)
*   yield* Console.log(`failed: ${failed}`)
* })
*
* Effect.runPromise(program)
* // Output:
* // ok: true
* // failed: false
* ```
*
* @since 2.0.0
* @category Condition Checking
*/
const isSuccess = isSuccess$2;
/**
* Returns the complete service map from the current context.
*
* This function allows you to access all services that are currently available
* in the effect's environment. This can be useful for debugging, introspection,
* or when you need to pass the entire context to another function.
*
* @example
* ```ts
* import { Console, Effect, Option, ServiceMap } from "effect"
*
* const Logger = ServiceMap.Service<{
*   log: (msg: string) => void
* }>("Logger")
* const Database = ServiceMap.Service<{
*   query: (sql: string) => string
* }>("Database")
*
* const program = Effect.gen(function*() {
*   const allServices = yield* Effect.services()
*
*   // Check if specific services are available
*   const loggerOption = ServiceMap.getOption(allServices, Logger)
*   const databaseOption = ServiceMap.getOption(allServices, Database)
*
*   yield* Console.log(`Logger available: ${Option.isSome(loggerOption)}`)
*   yield* Console.log(`Database available: ${Option.isSome(databaseOption)}`)
* })
*
* const serviceMap = ServiceMap.make(Logger, { log: console.log })
*   .pipe(ServiceMap.add(Database, { query: () => "result" }))
*
* const provided = Effect.provideServices(program, serviceMap)
* ```
*
* @since 2.0.0
* @category Environment
*/
const services = services$1;
/**
* Transforms the current service map using the provided function.
*
* This function allows you to access the complete service map and perform
* computations based on all available services. This is useful when you need
* to conditionally execute logic based on what services are available.
*
* @example
* ```ts
* import { Console, Effect, Option, ServiceMap } from "effect"
*
* const Logger = ServiceMap.Service<{
*   log: (msg: string) => void
* }>("Logger")
* const Cache = ServiceMap.Service<{
*   get: (key: string) => string | null
* }>("Cache")
*
* const program = Effect.servicesWith((services) => {
*   const cacheOption = ServiceMap.getOption(services, Cache)
*   const hasCache = Option.isSome(cacheOption)
*
*   if (hasCache) {
*     return Effect.gen(function*() {
*       const cache = yield* Effect.service(Cache)
*       yield* Console.log("Using cached data")
*       return cache.get("user:123") || "default"
*     })
*   } else {
*     return Effect.gen(function*() {
*       yield* Console.log("No cache available, using fallback")
*       return "fallback data"
*     })
*   }
* })
*
* const withCache = Effect.provideService(program, Cache, {
*   get: () => "cached_value"
* })
* ```
*
* @since 2.0.0
* @category Environment
*/
const servicesWith = servicesWith$1;
/**
* Provides dependencies to an effect using layers or a context. Use `options.local`
* to build the layer every time; by default, layers are shared between provide
* calls.
*
* @example
* ```ts
* import { Effect, Layer, ServiceMap } from "effect"
*
* interface Database {
*   readonly query: (sql: string) => Effect.Effect<string>
* }
*
* const Database = ServiceMap.Service<Database>("Database")
*
* const DatabaseLive = Layer.succeed(Database)({
*   query: (sql: string) => Effect.succeed(`Result for: ${sql}`)
* })
*
* const program = Effect.gen(function*() {
*   const db = yield* Database
*   return yield* db.query("SELECT * FROM users")
* })
*
* const provided = Effect.provide(program, DatabaseLive)
*
* Effect.runPromise(provided).then(console.log)
* // Output: "Result for: SELECT * FROM users"
* ```
*
* @since 2.0.0
* @category Environment
*/
const provide = provide$1;
/**
* Provides a service map to an effect, fulfilling its service requirements.
*
* **Details**
*
* This function provides multiple services at once by supplying a service map
* that contains all the required services. It removes the provided services
* from the effect's requirements, making them available to the effect.
*
* @example
* ```ts
* import { Effect, ServiceMap } from "effect"
*
* // Define service keys
* const Logger = ServiceMap.Service<{
*   log: (msg: string) => void
* }>("Logger")
* const Database = ServiceMap.Service<{
*   query: (sql: string) => string
* }>("Database")
*
* // Create service map with multiple services
* const serviceMap = ServiceMap.make(Logger, { log: console.log })
*   .pipe(ServiceMap.add(Database, { query: () => "result" }))
*
* // An effect that requires both services
* const program = Effect.gen(function*() {
*   const logger = yield* Effect.service(Logger)
*   const db = yield* Effect.service(Database)
*   logger.log("Querying database")
*   return db.query("SELECT * FROM users")
* })
*
* const provided = Effect.provideServices(program, serviceMap)
* ```
*
* @since 2.0.0
* @category Environment
*/
const provideServices = provideServices$1;
/**
* Accesses a service from the context.
*
* @example
* ```ts
* import { Effect, ServiceMap } from "effect"
*
* interface Database {
*   readonly query: (sql: string) => Effect.Effect<string>
* }
*
* const Database = ServiceMap.Service<Database>("Database")
*
* const program = Effect.gen(function*() {
*   const db = yield* Effect.service(Database)
*   return yield* db.query("SELECT * FROM users")
* })
* ```
*
* @since 4.0.0
* @category ServiceMap
*/
const service = service$1;
/**
* Optionally accesses a service from the environment.
*
* **Details**
*
* This function attempts to access a service from the environment. If the
* service is available, it returns `Some(service)`. If the service is not
* available, it returns `None`. Unlike `service`, this function does not
* require the service to be present in the environment.
*
* @example
* ```ts
* import { Effect, Option, ServiceMap } from "effect"
*
* // Define a service key
* const Logger = ServiceMap.Service<{
*   log: (msg: string) => void
* }>("Logger")
*
* // Use serviceOption to optionally access the logger
* const program = Effect.gen(function*() {
*   const maybeLogger = yield* Effect.serviceOption(Logger)
*
*   if (Option.isSome(maybeLogger)) {
*     maybeLogger.value.log("Service is available")
*   } else {
*     console.log("Service not available")
*   }
* })
* ```
*
* @since 2.0.0
* @category ServiceMap
*/
const serviceOption = serviceOption$1;
/**
* Provides part of the required context while leaving the rest unchanged.
*
* **Details**
*
* This function allows you to transform the context required by an effect,
* providing part of the context and leaving the rest to be fulfilled later.
*
* @example
* ```ts
* import { Effect, ServiceMap } from "effect"
*
* // Define services
* const Logger = ServiceMap.Service<{
*   log: (msg: string) => void
* }>("Logger")
* const Config = ServiceMap.Service<{
*   name: string
* }>("Config")
*
* const program = Effect.service(Config).pipe(
*   Effect.map((config) => `Hello ${config.name}!`)
* )
*
* // Transform services by providing Config while keeping Logger requirement
* const configured = program.pipe(
*   Effect.updateServices((services: ServiceMap.ServiceMap<typeof Logger>) =>
*     ServiceMap.add(services, Config, { name: "World" })
*   )
* )
*
* // The effect now requires only Logger service
* const result = Effect.provideService(configured, Logger, {
*   log: (msg) => console.log(msg)
* })
* ```
*
* @since 4.0.0
* @category ServiceMap
*/
const updateServices = updateServices$1;
/**
* Updates the service with the required service entry.
*
* @example
* ```ts
* import { Console, Effect, ServiceMap } from "effect"
*
* // Define a counter service
* const Counter = ServiceMap.Service<{ count: number }>("Counter")
*
* const program = Effect.gen(function*() {
*   const updatedCounter = yield* Effect.service(Counter)
*   yield* Console.log(`Updated count: ${updatedCounter.count}`)
*   return updatedCounter.count
* }).pipe(
*   Effect.updateService(Counter, (counter) => ({ count: counter.count + 1 }))
* )
*
* // Provide initial service and run
* const result = Effect.provideService(program, Counter, { count: 0 })
* Effect.runPromise(result).then(console.log)
* // Output: Updated count: 1
* // 1
* ```
*
* @since 2.0.0
* @category ServiceMap
*/
const updateService = updateService$1;
/**
* The `provideService` function is used to provide an actual
* implementation for a service in the context of an effect.
*
* This function allows you to associate a service with its implementation so
* that it can be used in your program. You define the service (e.g., a random
* number generator), and then you use `provideService` to link that
* service to its implementation. Once the implementation is provided, the
* effect can be run successfully without further requirements.
*
* @see {@link provide} for providing multiple layers to an effect.
*
* @example
* ```ts
* import { Console, Effect, ServiceMap } from "effect"
*
* // Define a service for configuration
* const Config = ServiceMap.Service<{
*   apiUrl: string
*   timeout: number
* }>("Config")
*
* const fetchData = Effect.gen(function*() {
*   const config = yield* Effect.service(Config)
*   yield* Console.log(`Fetching from: ${config.apiUrl}`)
*   yield* Console.log(`Timeout: ${config.timeout}ms`)
*   return "data"
* })
*
* // Provide the service implementation
* const program = Effect.provideService(fetchData, Config, {
*   apiUrl: "https://api.example.com",
*   timeout: 5000
* })
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Fetching from: https://api.example.com
* // Timeout: 5000ms
* // data
* ```
*
* @since 2.0.0
* @category ServiceMap
*/
const provideService = provideService$1;
/**
* Provides the effect with the single service it requires. If the effect
* requires more than one service use `provide` instead.
*
* This function is similar to `provideService`, but instead of providing a
* static service implementation, it allows you to provide an effect that
* will produce the service. This is useful when the service needs to be
* acquired through an effectful computation (e.g., reading from a database,
* making an HTTP request, or allocating resources).
*
* @example
* ```ts
* import { Console, Effect, ServiceMap } from "effect"
*
* // Define a database connection service
* interface DatabaseConnection {
*   readonly query: (sql: string) => Effect.Effect<string>
* }
* const Database = ServiceMap.Service<DatabaseConnection>("Database")
*
* // Effect that creates a database connection
* const createConnection = Effect.gen(function*() {
*   yield* Console.log("Establishing database connection...")
*   yield* Effect.sleep("100 millis") // Simulate connection time
*   yield* Console.log("Database connected!")
*   return {
*     query: (sql: string) => Effect.succeed(`Result for: ${sql}`)
*   }
* })
*
* const program = Effect.gen(function*() {
*   const db = yield* Effect.service(Database)
*   return yield* db.query("SELECT * FROM users")
* })
*
* // Provide the service through an effect
* const withDatabase = Effect.provideServiceEffect(
*   program,
*   Database,
*   createConnection
* )
*
* Effect.runPromise(withDatabase).then(console.log)
* // Output:
* // Establishing database connection...
* // Database connected!
* // Result for: SELECT * FROM users
* ```
*
* @since 2.0.0
* @category ServiceMap
*/
const provideServiceEffect = provideServiceEffect$1;
/**
* Sets the concurrency level for parallel operations within an effect.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const task = (id: number) =>
*   Effect.gen(function*() {
*     yield* Console.log(`Task ${id} starting`)
*     yield* Effect.sleep("100 millis")
*     yield* Console.log(`Task ${id} completed`)
*     return id
*   })
*
* // Run tasks with limited concurrency (max 2 at a time)
* const program = Effect.gen(function*() {
*   const tasks = [1, 2, 3, 4, 5].map(task)
*   return yield* Effect.all(tasks, { concurrency: 2 })
* }).pipe(
*   Effect.withConcurrency(2)
* )
*
* Effect.runPromise(program).then(console.log)
* // Tasks will run with max 2 concurrent operations
* // [1, 2, 3, 4, 5]
* ```
*
* @since 2.0.0
* @category References
*/
const withConcurrency = withConcurrency$1;
/**
* Returns the current scope for resource management.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const currentScope = yield* Effect.scope
*   yield* Console.log("Got scope for resource management")
*
*   // Use the scope to manually manage resources if needed
*   const resource = yield* Effect.acquireRelease(
*     Console.log("Acquiring resource").pipe(Effect.as("resource")),
*     () => Console.log("Releasing resource")
*   )
*
*   return resource
* })
*
* Effect.runPromise(Effect.scoped(program)).then(console.log)
* // Output:
* // Got scope for resource management
* // Acquiring resource
* // resource
* // Releasing resource
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const scope = scope$1;
/**
* Scopes all resources used in this workflow to the lifetime of the workflow,
* ensuring that their finalizers are run as soon as this workflow completes
* execution, whether by success, failure, or interruption.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const resource = Effect.acquireRelease(
*   Console.log("Acquiring resource").pipe(Effect.as("resource")),
*   () => Console.log("Releasing resource")
* )
*
* const program = Effect.scoped(
*   Effect.gen(function*() {
*     const res = yield* resource
*     yield* Console.log(`Using ${res}`)
*     return res
*   })
* )
*
* Effect.runFork(program)
* // Output: "Acquiring resource"
* // Output: "Using resource"
* // Output: "Releasing resource"
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const scoped = scoped$1;
/**
* Creates a scoped effect by providing access to the scope.
*
* @example
* ```ts
* import { Console, Effect, Scope } from "effect"
*
* const program = Effect.scopedWith((scope) =>
*   Effect.gen(function*() {
*     yield* Console.log("Inside scoped context")
*
*     // Manually add a finalizer to the scope
*     yield* Scope.addFinalizer(scope, Console.log("Manual finalizer"))
*
*     // Create a scoped resource
*     const resource = yield* Effect.scoped(
*       Effect.acquireRelease(
*         Console.log("Acquiring resource").pipe(Effect.as("resource")),
*         () => Console.log("Releasing resource")
*       )
*     )
*
*     return resource
*   })
* )
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Inside scoped context
* // Acquiring resource
* // resource
* // Releasing resource
* // Manual finalizer
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const scopedWith = scopedWith$1;
/**
* This function constructs a scoped resource from an `acquire` and `release`
* `Effect` value.
*
* If the `acquire` `Effect` value successfully completes execution, then the
* `release` `Effect` value will be added to the finalizers associated with the
* scope of this `Effect` value, and it is guaranteed to be run when the scope
* is closed.
*
* The `acquire` and `release` `Effect` values will be run uninterruptibly.
* Additionally, the `release` `Effect` value may depend on the `Exit` value
* specified when the scope is closed.
*
* @example
* ```ts
* import { Console, Effect, Exit } from "effect"
*
* // Simulate a resource that needs cleanup
* interface FileHandle {
*   readonly path: string
*   readonly content: string
* }
*
* // Acquire a file handle
* const acquire = Effect.gen(function*() {
*   yield* Console.log("Opening file")
*   return { path: "/tmp/file.txt", content: "file content" }
* })
*
* // Release the file handle
* const release = (handle: FileHandle, exit: Exit.Exit<unknown, unknown>) =>
*   Console.log(
*     `Closing file ${handle.path} with exit: ${
*       Exit.isSuccess(exit) ? "success" : "failure"
*     }`
*   )
*
* // Create a scoped resource
* const resource = Effect.acquireRelease(acquire, release)
*
* // Use the resource within a scope
* const program = Effect.scoped(
*   Effect.gen(function*() {
*     const handle = yield* resource
*     yield* Console.log(`Using file: ${handle.path}`)
*     return handle.content
*   })
* )
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const acquireRelease = acquireRelease$1;
/**
* This function is used to ensure that an `Effect` value that represents the
* acquisition of a resource (for example, opening a file, launching a thread,
* etc.) will not be interrupted, and that the resource will always be released
* when the `Effect` value completes execution.
*
* `acquireUseRelease` does the following:
*
*   1. Ensures that the `Effect` value that acquires the resource will not be
*      interrupted. Note that acquisition may still fail due to internal
*      reasons (such as an uncaught exception).
*   2. Ensures that the `release` `Effect` value will not be interrupted,
*      and will be executed as long as the acquisition `Effect` value
*      successfully acquires the resource.
*
* During the time period between the acquisition and release of the resource,
* the `use` `Effect` value will be executed.
*
* If the `release` `Effect` value fails, then the entire `Effect` value will
* fail, even if the `use` `Effect` value succeeds. If this fail-fast behavior
* is not desired, errors produced by the `release` `Effect` value can be caught
* and ignored.
*
* @example
* ```ts
* import { Console, Effect, Exit } from "effect"
*
* interface Database {
*   readonly connection: string
*   readonly query: (sql: string) => Effect.Effect<string>
* }
*
* const program = Effect.acquireUseRelease(
*   // Acquire - connect to database
*   Effect.gen(function*() {
*     yield* Console.log("Connecting to database...")
*     return {
*       connection: "db://localhost:5432",
*       query: (sql: string) => Effect.succeed(`Result for: ${sql}`)
*     }
*   }),
*   // Use - perform database operations
*   (db) =>
*     Effect.gen(function*() {
*       yield* Console.log(`Connected to ${db.connection}`)
*       const result = yield* db.query("SELECT * FROM users")
*       yield* Console.log(`Query result: ${result}`)
*       return result
*     }),
*   // Release - close database connection
*   (db, exit) =>
*     Effect.gen(function*() {
*       if (Exit.isSuccess(exit)) {
*         yield* Console.log(`Closing connection to ${db.connection} (success)`)
*       } else {
*         yield* Console.log(`Closing connection to ${db.connection} (failure)`)
*       }
*     })
* )
*
* Effect.runPromise(program)
* // Output:
* // Connecting to database...
* // Connected to db://localhost:5432
* // Query result: Result for: SELECT * FROM users
* // Closing connection to db://localhost:5432 (success)
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const acquireUseRelease = acquireUseRelease$1;
/**
* This function adds a finalizer to the scope of the calling `Effect` value.
* The finalizer is guaranteed to be run when the scope is closed, and it may
* depend on the `Exit` value that the scope is closed with.
*
* Finalizers are useful for cleanup operations that must run regardless of
* whether the effect succeeds or fails. They're commonly used for resource
* cleanup, logging, or other side effects that should always occur.
*
* @example
* ```ts
* import { Console, Effect, Exit } from "effect"
*
* const program = Effect.scoped(
*   Effect.gen(function*() {
*     // Add a finalizer that runs when the scope closes
*     yield* Effect.addFinalizer((exit) =>
*       Console.log(
*         Exit.isSuccess(exit)
*           ? "Cleanup: Operation completed successfully"
*           : "Cleanup: Operation failed, cleaning up resources"
*       )
*     )
*
*     yield* Console.log("Performing main operation...")
*
*     // This could succeed or fail
*     return "operation result"
*   })
* )
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Performing main operation...
* // Cleanup: Operation completed successfully
* // operation result
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const addFinalizer = addFinalizer$2;
/**
* Returns an effect that, if this effect _starts_ execution, then the
* specified `finalizer` is guaranteed to be executed, whether this effect
* succeeds, fails, or is interrupted.
*
* For use cases that need access to the effect's result, see `onExit`.
*
* Finalizers offer very powerful guarantees, but they are low-level, and
* should generally not be used for releasing resources. For higher-level
* logic built on `ensuring`, see the `acquireRelease` family of methods.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const task = Effect.gen(function*() {
*   yield* Console.log("Task started")
*   yield* Effect.sleep("1 second")
*   yield* Console.log("Task completed")
*   return 42
* })
*
* // Ensure cleanup always runs, regardless of success or failure
* const program = Effect.ensuring(
*   task,
*   Console.log("Cleanup: This always runs!")
* )
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Task started
* // Task completed
* // Cleanup: This always runs!
* // 42
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const ensuring = ensuring$1;
/**
* Runs the specified effect if this effect fails, providing the error to the
* effect if it exists. The provided effect will not be interrupted.
*
* @example
* ```ts
* import { Cause, Console, Effect } from "effect"
*
* const task = Effect.fail(new Error("Something went wrong"))
*
* const program = Effect.onError(
*   task,
*   (cause) => Console.log(`Cleanup on error: ${Cause.squash(cause)}`)
* )
*
* Effect.runPromise(program).catch(console.error)
* // Output:
* // Cleanup on error: Error: Something went wrong
* // Error: Something went wrong
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const onError = onError$1;
/**
* Runs the finalizer only when this effect fails and the `Cause` matches the
* filter, passing the filtered failure and the original cause.
*
* @example
* ```ts
* import { Cause, Console, Effect } from "effect"
*
* const task = Effect.fail("boom")
*
* const program = Effect.onErrorIf(
*   task,
*   Cause.hasFails,
*   (cause) =>
*     Effect.gen(function*() {
*       yield* Console.log(`Cause: ${Cause.pretty(cause)}`)
*     })
* )
* ```
*
* @since 4.0.0
* @category Resource Management & Finalization
*/
const onErrorIf = onErrorIf$1;
/**
* The low level primitive that powers `onExit`.
* function is used to run a finalizer when the effect exits, regardless of the
* exit status.
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const onExitPrimitive = onExitPrimitive$1;
/**
* Ensures that a cleanup functions runs, whether this effect succeeds, fails,
* or is interrupted.
*
* @example
* ```ts
* import { Console, Effect, Exit } from "effect"
*
* const task = Effect.succeed(42)
*
* const program = Effect.onExit(task, (exit) =>
*   Console.log(
*     Exit.isSuccess(exit)
*       ? `Task succeeded with: ${exit.value}`
*       : `Task failed: ${Exit.isFailure(exit) ? exit.cause : "interrupted"}`
*   ))
*
* Effect.runPromise(program).then(console.log)
* // Output:
* // Task succeeded with: 42
* // 42
* ```
*
* @since 2.0.0
* @category Resource Management & Finalization
*/
const onExit = onExit$1;
/**
* Runs the cleanup effect only when the `Exit` passes the provided filter.
*
* The cleanup is skipped when the filter returns `Filter.fail`.
*
* @example
* ```ts
* import { Console, Effect, Exit, Filter } from "effect"
*
* const exitFilter = Filter.fromPredicate(Exit.isSuccess<number, never>)
*
* const program = Effect.onExitIf(
*   Effect.succeed(42),
*   exitFilter,
*   (success) => Console.log(`Succeeded with: ${success.value}`)
* )
* ```
*
* @since 4.0.0
* @category Resource Management & Finalization
*/
const onExitIf = onExitIf$1;
/**
* Returns an effect that lazily computes a result and caches it for subsequent
* evaluations.
*
* **Details**
*
* This function wraps an effect and ensures that its result is computed only
* once. Once the result is computed, it is cached, meaning that subsequent
* evaluations of the same effect will return the cached result without
* re-executing the logic.
*
* **When to Use**
*
* Use this function when you have an expensive or time-consuming operation that
* you want to avoid repeating. The first evaluation will compute the result,
* and all following evaluations will immediately return the cached value,
* improving performance and reducing unnecessary work.
*
* @see {@link cachedWithTTL} for a similar function that includes a
* time-to-live duration for the cached value.
* @see {@link cachedInvalidateWithTTL} for a similar function that includes an
* additional effect for manually invalidating the cached value.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* let i = 1
* const expensiveTask = Effect.promise<string>(() => {
*   console.log("expensive task...")
*   return new Promise((resolve) => {
*     setTimeout(() => {
*       resolve(`result ${i++}`)
*     }, 100)
*   })
* })
*
* const program = Effect.gen(function*() {
*   console.log("non-cached version:")
*   yield* expensiveTask.pipe(Effect.andThen(Console.log))
*   yield* expensiveTask.pipe(Effect.andThen(Console.log))
*   console.log("cached version:")
*   const cached = yield* Effect.cached(expensiveTask)
*   yield* cached.pipe(Effect.andThen(Console.log))
*   yield* cached.pipe(Effect.andThen(Console.log))
* })
*
* Effect.runFork(program)
* // Output:
* // non-cached version:
* // expensive task...
* // result 1
* // expensive task...
* // result 2
* // cached version:
* // expensive task...
* // result 3
* // result 3
* ```
*
* @since 2.0.0
* @category Caching
*/
const cached = cached$1;
/**
* Returns an effect that caches its result for a specified `Duration`,
* known as "timeToLive" (TTL).
*
* **Details**
*
* This function is used to cache the result of an effect for a specified amount
* of time. This means that the first time the effect is evaluated, its result
* is computed and stored.
*
* If the effect is evaluated again within the specified `timeToLive`, the
* cached result will be used, avoiding recomputation.
*
* After the specified duration has passed, the cache expires, and the effect
* will be recomputed upon the next evaluation.
*
* **When to Use**
*
* Use this function when you have an effect that involves costly operations or
* computations, and you want to avoid repeating them within a short time frame.
*
* It's ideal for scenarios where the result of an effect doesn't change
* frequently and can be reused for a specified duration.
*
* By caching the result, you can improve efficiency and reduce unnecessary
* computations, especially in performance-critical applications.
*
* @see {@link cached} for a similar function that caches the result
* indefinitely.
* @see {@link cachedInvalidateWithTTL} for a similar function that includes an
* additional effect for manually invalidating the cached value.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* let i = 1
* const expensiveTask = Effect.promise<string>(() => {
*   console.log("expensive task...")
*   return new Promise((resolve) => {
*     setTimeout(() => {
*       resolve(`result ${i++}`)
*     }, 100)
*   })
* })
*
* const program = Effect.gen(function*() {
*   const cached = yield* Effect.cachedWithTTL(expensiveTask, "150 millis")
*   yield* cached.pipe(Effect.andThen(Console.log))
*   yield* cached.pipe(Effect.andThen(Console.log))
*   yield* Effect.sleep("100 millis")
*   yield* cached.pipe(Effect.andThen(Console.log))
* })
*
* Effect.runFork(program)
* // Output:
* // expensive task...
* // result 1
* // result 1
* // expensive task...
* // result 2
* ```
*
* @since 2.0.0
* @category Caching
*/
const cachedWithTTL = cachedWithTTL$1;
/**
* Caches an effect's result for a specified duration and allows manual
* invalidation before expiration.
*
* **Details**
*
* This function behaves similarly to {@link cachedWithTTL} by caching the
* result of an effect for a specified period of time. However, it introduces an
* additional feature: it provides an effect that allows you to manually
* invalidate the cached result before it naturally expires.
*
* This gives you more control over the cache, allowing you to refresh the
* result when needed, even if the original cache has not yet expired.
*
* Once the cache is invalidated, the next time the effect is evaluated, the
* result will be recomputed, and the cache will be refreshed.
*
* **When to Use**
*
* Use this function when you have an effect whose result needs to be cached for
* a certain period, but you also want the option to refresh the cache manually
* before the expiration time.
*
* This is useful when you need to ensure that the cached data remains valid for
* a certain period but still want to invalidate it if the underlying data
* changes or if you want to force a recomputation.
*
* @see {@link cached} for a similar function that caches the result
* indefinitely.
* @see {@link cachedWithTTL} for a similar function that caches the result for
* a specified duration but does not include an effect for manual invalidation.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* let i = 1
* const expensiveTask = Effect.promise<string>(() => {
*   console.log("expensive task...")
*   return new Promise((resolve) => {
*     setTimeout(() => {
*       resolve(`result ${i++}`)
*     }, 100)
*   })
* })
*
* const program = Effect.gen(function*() {
*   const [cached, invalidate] = yield* Effect.cachedInvalidateWithTTL(
*     expensiveTask,
*     "1 hour"
*   )
*   yield* cached.pipe(Effect.andThen(Console.log))
*   yield* cached.pipe(Effect.andThen(Console.log))
*   yield* invalidate
*   yield* cached.pipe(Effect.andThen(Console.log))
* })
*
* Effect.runFork(program)
* // Output:
* // expensive task...
* // result 1
* // result 1
* // expensive task...
* // result 2
* ```
*
* @since 2.0.0
* @category Caching
*/
const cachedInvalidateWithTTL = cachedInvalidateWithTTL$1;
/**
* Returns an effect that is immediately interrupted.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   yield* Effect.interrupt
*   yield* Effect.succeed("This won't execute")
* })
*
* Effect.runPromise(program).catch(console.error)
* // Throws: InterruptedException
* ```
*
* @since 2.0.0
* @category Interruption
*/
const interrupt = interrupt$3;
/**
* Returns a new effect that allows the effect to be interruptible.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const longRunning = Effect.forever(Effect.succeed("working..."))
*
* const program = Effect.interruptible(longRunning)
*
* // This effect can now be interrupted
* const fiber = Effect.runFork(program)
* // Later: fiber.interrupt()
* ```
*
* @since 2.0.0
* @category Interruption
*/
const interruptible = interruptible$1;
/**
* Runs the specified finalizer effect if this effect is interrupted.
*
* @example
* ```ts
* import { Console, Effect, Fiber } from "effect"
*
* const task = Effect.forever(Effect.succeed("working..."))
*
* const program = Effect.onInterrupt(
*   task,
*   () => Console.log("Task was interrupted, cleaning up...")
* )
*
* const fiber = Effect.runFork(program)
* // Later interrupt the task
* Effect.runFork(Fiber.interrupt(fiber))
* // Output: Task was interrupted, cleaning up...
* ```
*
* @since 2.0.0
* @category Interruption
*/
const onInterrupt = onInterrupt$1;
/**
* Returns a new effect that disables interruption for the given effect.
*
* @example
* ```ts
* import { Console, Effect, Fiber } from "effect"
*
* const criticalTask = Effect.gen(function*() {
*   yield* Console.log("Starting critical section...")
*   yield* Effect.sleep("2 seconds")
*   yield* Console.log("Critical section completed")
* })
*
* const program = Effect.uninterruptible(criticalTask)
*
* const fiber = Effect.runFork(program)
* // Even if interrupted, the critical task will complete
* Effect.runPromise(Fiber.interrupt(fiber))
* ```
*
* @since 2.0.0
* @category Interruption
*/
const uninterruptible = uninterruptible$1;
/**
* Disables interruption and provides a restore function to restore the
* interruptible state within the effect.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.uninterruptibleMask((restore) =>
*   Effect.gen(function*() {
*     yield* Console.log("Uninterruptible phase...")
*     yield* Effect.sleep("1 second")
*
*     // Restore interruptibility for this part
*     yield* restore(
*       Effect.gen(function*() {
*         yield* Console.log("Interruptible phase...")
*         yield* Effect.sleep("2 seconds")
*       })
*     )
*
*     yield* Console.log("Back to uninterruptible")
*   })
* )
* ```
*
* @since 2.0.0
* @category Interruption
*/
const uninterruptibleMask = uninterruptibleMask$1;
/**
* This function behaves like {@link interruptible}, but it also provides a
* `restore` function. This function can be used to restore the interruptibility
* of any specific region of code.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.interruptibleMask((restore) =>
*   Effect.gen(function*() {
*     yield* Console.log("Interruptible phase...")
*     yield* Effect.sleep("1 second")
*
*     // Make this part uninterruptible
*     yield* restore(
*       Effect.gen(function*() {
*         yield* Console.log("Uninterruptible phase...")
*         yield* Effect.sleep("2 seconds")
*       })
*     )
*
*     yield* Console.log("Back to interruptible")
*   })
* )
* ```
*
* @since 2.0.0
* @category Interruption
*/
const interruptibleMask = interruptibleMask$1;
/**
* Unsafely creates a new Semaphore.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const semaphore = Effect.makeSemaphoreUnsafe(3)
*
* const task = (id: number) =>
*   semaphore.withPermits(1)(
*     Effect.gen(function*() {
*       yield* Effect.log(`Task ${id} started`)
*       yield* Effect.sleep("1 second")
*       yield* Effect.log(`Task ${id} completed`)
*     })
*   )
*
* // Only 3 tasks can run concurrently
* const program = Effect.all([
*   task(1),
*   task(2),
*   task(3),
*   task(4),
*   task(5)
* ], { concurrency: "unbounded" })
* ```
*
* @since 2.0.0
* @category Semaphore
*/
const makeSemaphoreUnsafe = makeSemaphoreUnsafe$1;
/**
* Creates a new Semaphore.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const semaphore = yield* Effect.makeSemaphore(2)
*
*   const task = (id: number) =>
*     semaphore.withPermits(1)(
*       Effect.gen(function*() {
*         yield* Effect.log(`Task ${id} acquired permit`)
*         yield* Effect.sleep("1 second")
*         yield* Effect.log(`Task ${id} releasing permit`)
*       })
*     )
*
*   // Run 4 tasks, but only 2 can run concurrently
*   yield* Effect.all([task(1), task(2), task(3), task(4)])
* })
* ```
*
* @since 2.0.0
* @category Semaphore
*/
const makeSemaphore = makeSemaphore$1;
/**
* Creates a new Latch.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const latch = Effect.makeLatchUnsafe(false)
*
* const waiter = Effect.gen(function*() {
*   yield* Effect.log("Waiting for latch to open...")
*   yield* latch.await
*   yield* Effect.log("Latch opened! Continuing...")
* })
*
* const opener = Effect.gen(function*() {
*   yield* Effect.sleep("2 seconds")
*   yield* Effect.log("Opening latch...")
*   yield* latch.open
* })
*
* const program = Effect.all([waiter, opener])
* ```
*
* @category Latch
* @since 3.8.0
*/
const makeLatchUnsafe = makeLatchUnsafe$1;
/**
* Creates a new Latch.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const latch = yield* Effect.makeLatch(false)
*
*   const waiter = Effect.gen(function*() {
*     yield* Effect.log("Waiting for latch to open...")
*     yield* latch.await
*     yield* Effect.log("Latch opened! Continuing...")
*   })
*
*   const opener = Effect.gen(function*() {
*     yield* Effect.sleep("2 seconds")
*     yield* Effect.log("Opening latch...")
*     yield* latch.open
*   })
*
*   yield* Effect.all([waiter, opener])
* })
* ```
*
* @category Latch
* @since 3.8.0
*/
const makeLatch = makeLatch$1;
/**
* Repeats this effect forever (until the first error).
*
* @example
* ```ts
* import { Console, Effect, Fiber } from "effect"
*
* const task = Effect.gen(function*() {
*   yield* Console.log("Task running...")
*   yield* Effect.sleep("1 second")
* })
*
* // This will run forever, printing every second
* const program = task.pipe(Effect.forever)
*
* // This will run forever, without yielding every iteration
* const programNoYield = task.pipe(Effect.forever({ disableYield: true }))
*
* // Run for 5 seconds then interrupt
* const timedProgram = Effect.gen(function*() {
*   const fiber = yield* Effect.forkChild(program)
*   yield* Effect.sleep("5 seconds")
*   yield* Fiber.interrupt(fiber)
* })
* ```
*
* @since 2.0.0
* @category Repetition / Recursion
*/
const forever = forever$2;
/**
* Repeats an effect based on a specified schedule or until the first failure.
*
* **Details**
*
* This function executes an effect repeatedly according to the given schedule.
* Each repetition occurs after the initial execution of the effect, meaning
* that the schedule determines the number of additional repetitions. For
* example, using `Schedule.once` will result in the effect being executed twice
* (once initially and once as part of the repetition).
*
* If the effect succeeds, it is repeated according to the schedule. If it
* fails, the repetition stops immediately, and the failure is returned.
*
* The schedule can also specify delays between repetitions, making it useful
* for tasks like retrying operations with backoff, periodic execution, or
* performing a series of dependent actions.
*
* You can combine schedules for more advanced repetition logic, such as adding
* delays, limiting recursions, or dynamically adjusting based on the outcome of
* each execution.
*
* @example
* ```ts
* // Success Example
* import { Effect } from "effect"
* import { Schedule } from "effect"
* import { Console } from "effect"
*
* const action = Console.log("success")
* const policy = Schedule.addDelay(Schedule.recurs(2), () => Effect.succeed("100 millis"))
* const program = Effect.repeat(action, policy)
*
* // Effect.runPromise(program).then((n) => console.log(`repetitions: ${n}`))
* ```
*
* @example
* // Failure Example
* import { Effect } from "effect"
* import { Schedule } from "effect"
*
* let count = 0
*
* // Define a callback effect that simulates an action with possible failures
* const action = Effect.callback<string, string>((resume) => {
*   if (count > 1) {
*     console.log("failure")
*     resume(Effect.fail("Uh oh!"))
*   } else {
*     count++
*     console.log("success")
*     resume(Effect.succeed("yay!"))
*   }
* })
*
* const policy = Schedule.addDelay(Schedule.recurs(2), () => Effect.succeed("100 millis"))
* const program = Effect.repeat(action, policy)
*
* // Effect.runPromiseExit(program).then(console.log)
*
* @since 2.0.0
* @category Repetition / Recursion
*/
const repeat = repeat$1;
/**
* Repeats an effect with a schedule, handling failures using a custom handler.
*
* **Details**
*
* This function allows you to execute an effect repeatedly based on a specified
* schedule. If the effect fails at any point, a custom failure handler is
* invoked. The handler is provided with both the failure value and the output
* of the schedule at the time of failure. If the effect fails immediately, the
* schedule will never be executed and the output provided to the handler will
* be `None`. This enables advanced error recovery or alternative fallback logic
* while maintaining flexibility in how repetitions are handled.
*
* For example, using a schedule with `recurs(2)` will allow for two additional
* repetitions after the initial execution, provided the effect succeeds. If a
* failure occurs during any iteration, the failure handler is invoked to handle
* the situation.
*
* @example
* ```ts
* import { Console, Effect, Schedule } from "effect"
* import * as Option from "effect/Option"
*
* let attempt = 0
* const task = Effect.gen(function*() {
*   attempt++
*   if (attempt <= 2) {
*     yield* Console.log(`Attempt ${attempt} failed`)
*     yield* Effect.fail(`Error ${attempt}`)
*   }
*   yield* Console.log(`Attempt ${attempt} succeeded`)
*   return "success"
* })
*
* const program = Effect.repeatOrElse(
*   task,
*   Schedule.recurs(3),
*   (error, attempts) =>
*     Console.log(
*       `Final failure: ${error}, after ${
*         Option.getOrElse(attempts, () => 0)
*       } attempts`
*     ).pipe(Effect.map(() => 0))
* )
* ```
*
* @since 2.0.0
* @category Repetition / Recursion
*/
const repeatOrElse = repeatOrElse$1;
/**
* Returns an array of `n` identical effects.
*
* Use with `Effect.all` to run the replicated effects and collect results.
*
* @since 2.0.0
* @category Collecting
*/
const replicate = replicate$1;
/**
* Performs this effect `n` times and collects results with `Effect.all` semantics.
*
* Use `concurrency` to control parallelism and `discard: true` to ignore results.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const results = yield* Effect.replicateEffect(3)(Effect.succeed(1))
*   yield* Console.log(results)
* })
* ```
*
* @since 2.0.0
* @category Collecting
*/
const replicateEffect = replicateEffect$1;
/**
* Runs an effect repeatedly according to a schedule, starting from a specified
* initial input value.
*
* **Details**
*
* This function allows you to repeatedly execute an effect based on a schedule.
* The schedule starts with the given `initial` input value, which is passed to
* the first execution. Subsequent executions of the effect are controlled by
* the schedule's rules, using the output of the previous iteration as the input
* for the next one.
*
* The returned effect will complete when the schedule ends or the effect fails,
* propagating the error.
*
* @example
* ```ts
* import { Console, Effect, Schedule } from "effect"
*
* const task = (input: number) =>
*   Effect.gen(function*() {
*     yield* Console.log(`Processing: ${input}`)
*     return input + 1
*   })
*
* // Start with 0, repeat 3 times
* const program = Effect.scheduleFrom(
*   task(0),
*   0,
*   Schedule.recurs(2)
* )
*
* Effect.runPromise(program).then(console.log)
* // Returns the schedule count
* ```
*
* @since 2.0.0
* @category Repetition / Recursion
*/
const scheduleFrom = scheduleFrom$1;
/**
* Returns the current tracer from the context.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const currentTracer = yield* Effect.tracer
*   yield* Effect.log(`Using tracer: ${currentTracer}`)
*   return "operation completed"
* })
* ```
*
* @since 2.0.0
* @category Tracing
*/
const tracer = tracer$1;
/**
* Provides a tracer to an effect.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   yield* Effect.log("Using tracer")
*   return "completed"
* })
*
* // withTracer provides a tracer to the effect context
* // const traced = Effect.withTracer(program, customTracer)
* ```
*
* @since 2.0.0
* @category Tracing
*/
const withTracer = withTracer$1;
/**
* Disable the tracer for the given Effect.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* Effect.succeed(42).pipe(
*   Effect.withSpan("my-span"),
*   // the span will not be registered with the tracer
*   Effect.withTracerEnabled(false)
* )
* ```
*
* @since 2.0.0
* @category Tracing
*/
const withTracerEnabled = withTracerEnabled$1;
/**
* Enables or disables tracer timing for the given Effect.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* Effect.succeed(42).pipe(
*   Effect.withSpan("my-span"),
*   // the span will not have timing information
*   Effect.withTracerTiming(false)
* )
* ```
*
* @since 2.0.0
* @category Tracing
*/
const withTracerTiming = withTracerTiming$1;
/**
* Adds an annotation to each span in this effect.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   yield* Effect.log("Doing some work...")
*   return "result"
* })
*
* // Add single annotation
* const annotated1 = Effect.annotateSpans(program, "user", "john")
*
* // Add multiple annotations
* const annotated2 = Effect.annotateSpans(program, {
*   operation: "data-processing",
*   version: "1.0.0",
*   environment: "production"
* })
* ```
*
* @since 2.0.0
* @category Tracing
*/
const annotateSpans = annotateSpans$1;
/**
* Adds an annotation to the current span if available.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   yield* Effect.annotateCurrentSpan("userId", "123")
*   yield* Effect.annotateCurrentSpan({
*     operation: "user-lookup",
*     timestamp: Date.now()
*   })
*   yield* Effect.log("User lookup completed")
*   return "success"
* })
*
* const traced = Effect.withSpan(program, "user-operation")
* ```
*
* @since 2.0.0
* @category Tracing
*/
const annotateCurrentSpan = annotateCurrentSpan$1;
/**
* Returns the current span from the context.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const span = yield* Effect.currentSpan
*   yield* Effect.log(`Current span: ${span}`)
*   return "done"
* })
*
* const traced = Effect.withSpan(program, "my-span")
* ```
*
* @since 2.0.0
* @category Tracing
*/
const currentSpan = currentSpan$1;
/**
* Returns the current parent span from the context.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const childOperation = Effect.gen(function*() {
*   const parentSpan = yield* Effect.currentParentSpan
*   yield* Effect.log(`Parent span: ${parentSpan}`)
*   return "child completed"
* })
*
* const program = Effect.gen(function*() {
*   yield* Effect.withSpan(childOperation, "child-span")
*   return "parent completed"
* })
*
* const traced = Effect.withSpan(program, "parent-span")
* ```
*
* @since 2.0.0
* @category Tracing
*/
const currentParentSpan = currentParentSpan$1;
/**
* Returns the annotations of the current span.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   // Add some annotations to the current span
*   yield* Effect.annotateCurrentSpan("userId", "123")
*   yield* Effect.annotateCurrentSpan("operation", "data-processing")
*
*   // Retrieve all annotations
*   const annotations = yield* Effect.spanAnnotations
*
*   console.log("Current span annotations:", annotations)
*   return annotations
* })
*
* Effect.runPromise(program).then(console.log)
* // Output: Current span annotations: { userId: "123", operation: "data-processing" }
* ```
*
* @since 2.0.0
* @category Tracing
*/
const spanAnnotations = spanAnnotations$1;
/**
* Retrieves the span links associated with the current span.
*
* Span links are connections between spans that are related but not in a
* parent-child relationship. They are useful for linking spans across different
* traces or connecting spans from parallel operations.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   // Get the current span links
*   const links = yield* Effect.spanLinks
*   console.log(`Current span has ${links.length} links`)
*   return links
* })
* ```
*
* @since 2.0.0
* @category Tracing
*/
const spanLinks = spanLinks$1;
/**
* For all spans in this effect, add a link with the provided span.
*
* This is useful for connecting spans that are related but not in a direct
* parent-child relationship. For example, you might want to link spans from
* parallel operations or connect spans across different traces.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const parentEffect = Effect.withSpan("parent-operation")(
*   Effect.succeed("parent result")
* )
*
* const childEffect = Effect.withSpan("child-operation")(
*   Effect.succeed("child result")
* )
*
* // Link the child span to the parent span
* const program = Effect.gen(function*() {
*   const parentSpan = yield* Effect.currentSpan
*   const result = yield* childEffect.pipe(
*     Effect.linkSpans(parentSpan, { relationship: "follows" })
*   )
*   return result
* })
* ```
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // Link multiple spans
* const program = Effect.gen(function*() {
*   const span1 = yield* Effect.currentSpan
*   const span2 = yield* Effect.currentSpan
*
*   return yield* Effect.succeed("result").pipe(
*     Effect.linkSpans([span1, span2], {
*       type: "dependency",
*       source: "multiple-operations"
*     })
*   )
* })
* ```
*
* @since 2.0.0
* @category Tracing
*/
const linkSpans = linkSpans$1;
/**
* Create a new span for tracing.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const span = yield* Effect.makeSpan("my-operation")
*   yield* Effect.log("Operation in progress")
*   return "completed"
* })
* ```
*
* @since 2.0.0
* @category Tracing
*/
const makeSpan = makeSpan$1;
/**
* Create a new span for tracing, and automatically close it when the Scope
* finalizes.
*
* The span is not added to the current span stack, so no child spans will be
* created for it.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.scoped(
*   Effect.gen(function*() {
*     const span = yield* Effect.makeSpanScoped("scoped-operation")
*     yield* Effect.log("Working...")
*     return "done"
*     // Span automatically closes when scope ends
*   })
* )
* ```
*
* @since 2.0.0
* @category Tracing
*/
const makeSpanScoped = makeSpanScoped$1;
/**
* Create a new span for tracing, and automatically close it when the effect
* completes.
*
* The span is not added to the current span stack, so no child spans will be
* created for it.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.useSpan(
*   "user-operation",
*   (span) =>
*     Effect.gen(function*() {
*       yield* Effect.log("Processing user data")
*       return "success"
*     })
* )
* ```
*
* @since 2.0.0
* @category Tracing
*/
const useSpan = useSpan$1;
/**
* Wraps the effect with a new span for tracing.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const task = Effect.gen(function*() {
*   yield* Effect.log("Executing task")
*   return "result"
* })
*
* const traced = Effect.withSpan(task, "my-task", {
*   attributes: { version: "1.0" }
* })
* ```
*
* @since 2.0.0
* @category Tracing
*/
const withSpan = withSpan$1;
/**
* Wraps the effect with a new span for tracing.
*
* The span is ended when the Scope is finalized.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.scoped(
*   Effect.gen(function*() {
*     const task = Effect.log("Working...")
*     yield* Effect.withSpanScoped(task, "scoped-task")
*     return "completed"
*   })
* )
* ```
*
* @since 2.0.0
* @category Tracing
*/
const withSpanScoped = withSpanScoped$1;
/**
* Adds the provided span to the current span stack.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const span = yield* Effect.makeSpan("parent-span")
*   const childTask = Effect.log("Child operation")
*   yield* Effect.withParentSpan(childTask, span)
*   return "completed"
* })
* ```
*
* @since 2.0.0
* @category Tracing
*/
const withParentSpan = withParentSpan$1;
/**
* Executes a request using the provided resolver.
*
* @since 2.0.0
* @category Requests & Batching
*
* @example
* ```ts
* import { Console, Effect, Exit, Request, RequestResolver } from "effect"
*
* interface GetUser extends Request.Request<string> {
*   readonly _tag: "GetUser"
*   readonly id: number
* }
* const GetUser = Request.tagged<GetUser>("GetUser")
*
* const resolver = RequestResolver.make<GetUser>(
*   Effect.fnUntraced(function*(entries) {
*     for (const entry of entries) {
*       yield* Request.complete(entry, Exit.succeed(`user-${entry.request.id}`))
*     }
*   })
* )
*
* const program = Effect.gen(function*() {
*   const name = yield* Effect.request(GetUser({ id: 1 }), Effect.succeed(resolver))
*   yield* Console.log(name)
* })
* ```
*/
const request = request$1;
/**
* Low-level entry point that registers a request with a resolver and delivers the exit value via `onExit`.
* Use this when you already have a `ServiceMap` and need to enqueue a request outside an `Effect`.
*
* It returns a canceler that removes the pending request entry.
*
* @since 4.0.0
* @category Requests & Batching
*/
const requestUnsafe = requestUnsafe$1;
/**
* Returns an effect that forks this effect into its own separate fiber,
* returning the fiber immediately, without waiting for it to begin executing
* the effect.
*
* You can use the `forkChild` method whenever you want to execute an effect in a
* new fiber, concurrently and without "blocking" the fiber executing other
* effects. Using fibers can be tricky, so instead of using this method
* directly, consider other higher-level methods, such as `raceWith`,
* `zipPar`, and so forth.
*
* The fiber returned by this method has methods to interrupt the fiber and to
* wait for it to finish executing the effect. See `Fiber` for more
* information.
*
* Whenever you use this method to launch a new fiber, the new fiber is
* attached to the parent fiber's scope. This means when the parent fiber
* terminates, the child fiber will be terminated as well, ensuring that no
* fibers leak. This behavior is called "auto supervision", and if this
* behavior is not desired, you may use the `forkDetach` or `forkIn` methods.
*
* @example
* ```ts
* import { Effect, Fiber } from "effect"
*
* const longRunningTask = Effect.gen(function*() {
*   yield* Effect.sleep("2 seconds")
*   yield* Effect.log("Task completed")
*   return "result"
* })
*
* const program = Effect.gen(function*() {
*   const fiber = yield* longRunningTask.pipe(Effect.forkChild)
*
*   // or fork a fiber that starts immediately:
*   yield* longRunningTask.pipe(Effect.forkChild({ startImmediately: true }))
*
*   yield* Effect.log("Task forked, continuing...")
*   const result = yield* Fiber.join(fiber)
*   return result
* })
* ```
*
* @since 4.0.0
* @category Supervision & Fibers
*/
const forkChild = forkChild$1;
/**
* Forks the effect in the specified scope. The fiber will be interrupted
* when the scope is closed.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const task = Effect.gen(function*() {
*   yield* Effect.sleep("10 seconds")
*   return "completed"
* })
*
* const program = Effect.scoped(
*   Effect.gen(function*() {
*     const scope = yield* Effect.scope
*     const fiber = yield* Effect.forkIn(task, scope)
*     yield* Effect.sleep("1 second")
*     // Fiber will be interrupted when scope closes
*     return "done"
*   })
* )
* ```
*
* @since 2.0.0
* @category Supervision & Fibers
*/
const forkIn = forkIn$1;
/**
* Forks the fiber in a `Scope`, interrupting it when the scope is closed.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const backgroundTask = Effect.gen(function*() {
*   yield* Effect.sleep("5 seconds")
*   yield* Effect.log("Background task completed")
*   return "result"
* })
*
* const program = Effect.scoped(
*   Effect.gen(function*() {
*     const fiber = yield* backgroundTask.pipe(Effect.forkScoped)
*
*     // or fork a fiber that starts immediately:
*     yield* backgroundTask.pipe(Effect.forkScoped({ startImmediately: true }))
*
*     yield* Effect.log("Task forked in scope")
*     yield* Effect.sleep("1 second")
*
*     // Fiber will be interrupted when scope closes
*     return "scope completed"
*   })
* )
* ```
*
* @since 2.0.0
* @category Supervision & Fibers
*/
const forkScoped = forkScoped$1;
/**
* Forks the effect into a new fiber attached to the global scope. Because the
* new fiber is attached to the global scope, when the fiber executing the
* returned effect terminates, the forked fiber will continue running.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const daemonTask = Effect.gen(function*() {
*   while (true) {
*     yield* Effect.sleep("1 second")
*     yield* Effect.log("Daemon running...")
*   }
* })
*
* const program = Effect.gen(function*() {
*   const fiber = yield* daemonTask.pipe(Effect.forkDetach)
*
*   // or fork a fiber that starts immediately:
*   yield* daemonTask.pipe(Effect.forkDetach({ startImmediately: true }))
*
*   yield* Effect.log("Daemon started")
*   yield* Effect.sleep("3 seconds")
*   // Daemon continues running after this effect completes
*   return "main completed"
* })
* ```
*
* @since 2.0.0
* @category Supervision & Fibers
*/
const forkDetach = forkDetach$1;
/**
* Waits for all child fibers forked by this effect to complete before this
* effect completes.
*
* @since 2.0.0
* @category Supervision & Fibers
*/
const awaitAllChildren = awaitAllChildren$1;
/**
* Access the fiber currently executing the effect.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const fiber = yield* Effect.fiber
*   yield* Console.log(`Fiber id: ${fiber.id}`)
* })
* ```
*
* @since 4.0.0
* @category Supervision & Fibers
*/
const fiber = fiber$1;
/**
* Access the current fiber id executing the effect.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const program = Effect.log("event").pipe(
*   // Read the current span with the fiber id for tagging.
*   Effect.andThen(Effect.all([Effect.currentSpan, Effect.fiberId])),
*   Effect.withSpan("A"),
*   Effect.map(([span, fiberId]) => ({
*     spanName: span.name,
*     fiberId
*   }))
* )
* ```
*
* @since 4.0.0
* @category Supervision & Fibers
*/
const fiberId = fiberId$1;
/**
* The foundational function for running effects, returning a "fiber" that can
* be observed or interrupted.
*
* **When to Use**
*
* `runFork` is used to run an effect in the background by creating a
* fiber. It is the base function for all other run functions. It starts a fiber
* that can be observed or interrupted.
*
* Unless you specifically need a `Promise` or synchronous operation,
* `runFork` is a good default choice.
*
* @example
* ```ts
* // Title: Running an Effect in the Background
* import { Effect } from "effect"
* import { Schedule } from "effect"
* import { Fiber } from "effect"
* import { Console } from "effect"
*
* //      ┌─── Effect<number, never, never>
* //      ▼
* const program = Effect.repeat(
*   Console.log("running..."),
*   Schedule.spaced("200 millis")
* )
*
* //      ┌─── RuntimeFiber<number, never>
* //      ▼
* const fiber = Effect.runFork(program)
*
* setTimeout(() => {
*   Effect.runFork(Fiber.interrupt(fiber))
* }, 500)
* ```
*
* @since 2.0.0
* @category Running Effects
*/
const runFork = runFork$1;
/**
* Runs an effect in the background with the provided services.
*
* @example
* ```ts
* import { Effect, ServiceMap } from "effect"
*
* interface Logger {
*   log: (message: string) => void
* }
*
* const Logger = ServiceMap.Service<Logger>("Logger")
*
* const services = ServiceMap.make(Logger, {
*   log: (message) => console.log(message)
* })
*
* const program = Effect.gen(function*() {
*   const logger = yield* Logger
*   logger.log("Hello from service!")
*   return "done"
* })
*
* const fiber = Effect.runForkWith(services)(program)
* ```
*
* @since 4.0.0
* @category Running Effects
*/
const runForkWith = runForkWith$1;
/**
* Forks an effect with the provided services, registers `onExit` as a fiber observer, and returns an interruptor.
*
* The returned interruptor calls `fiber.interruptUnsafe`, optionally with an interruptor id.
*
* @example
* ```ts
* import { Console, Effect, Exit, ServiceMap } from "effect"
*
* interface Logger {
*   log: (message: string) => Effect.Effect<void>
* }
*
* const Logger = ServiceMap.Service<Logger>("Logger")
*
* const services = ServiceMap.make(Logger, {
*   log: (message) => Console.log(message)
* })
*
* const program = Effect.gen(function*() {
*   const logger = yield* Logger
*   yield* logger.log("Started")
*   return "done"
* })
*
* const interrupt = Effect.runCallbackWith(services)(program, {
*   onExit: (exit) => {
*     if (Exit.isFailure(exit)) {
*       // handle failure or interruption
*     }
*   }
* })
*
* // Use the interruptor if you need to cancel the fiber later.
* interrupt()
* ```
*
* @since 4.0.0
* @category Running Effects
*/
const runCallbackWith = runCallbackWith$1;
/**
* Runs an effect asynchronously, registering `onExit` as a fiber observer and
* returning an interruptor.
*
* The interruptor calls `fiber.interruptUnsafe` with the optional interruptor
* id.
*
* @example
* ```ts
* import { Console, Effect, Exit } from "effect"
*
* const program = Effect.gen(function*() {
*   yield* Console.log("working")
*   return "done"
* })
*
* const interrupt = Effect.runCallback(program, {
*   onExit: (exit) => {
*     Effect.runSync(
*       Exit.match(exit, {
*         onFailure: () => Console.log("failed"),
*         onSuccess: (value) => Console.log(`success: ${value}`)
*       })
*     )
*   }
* })
*
* // Output:
* // working
* // success: done
*
* // interrupt() to cancel the fiber if needed
* ```
*
* @since 4.0.0
* @category Running Effects
*/
const runCallback = runCallback$1;
/**
* Executes an effect and returns the result as a `Promise`.
*
* **When to Use**
*
* Use `runPromise` when you need to execute an effect and work with the
* result using `Promise` syntax, typically for compatibility with other
* promise-based code.
*
* If the effect succeeds, the promise will resolve with the result. If the
* effect fails, the promise will reject with an error.
*
* @see {@link runPromiseExit} for a version that returns an `Exit` type instead of rejecting.
*
* @example
* ```ts
* // Title: Running a Successful Effect as a Promise
* import { Effect } from "effect"
*
* Effect.runPromise(Effect.succeed(1)).then(console.log)
* // Output: 1
* ```
*
* @example
* //Example: Handling a Failing Effect as a Rejected Promise
* import { Effect } from "effect"
*
* Effect.runPromise(Effect.fail("my error")).catch(console.error)
* // Output:
* // (FiberFailure) Error: my error
*
* @since 2.0.0
* @category Running Effects
*/
const runPromise = runPromise$1;
/**
* Executes an effect as a Promise with the provided services.
*
* @example
* ```ts
* import { Effect, ServiceMap } from "effect"
*
* interface Config {
*   apiUrl: string
* }
*
* const Config = ServiceMap.Service<Config>("Config")
*
* const services = ServiceMap.make(Config, {
*   apiUrl: "https://api.example.com"
* })
*
* const program = Effect.gen(function*() {
*   const config = yield* Config
*   return `Connecting to ${config.apiUrl}`
* })
*
* Effect.runPromiseWith(services)(program).then(console.log)
* ```
*
* @since 4.0.0
* @category Running Effects
*/
const runPromiseWith = runPromiseWith$1;
/**
* Runs an effect and returns a `Promise` that resolves to an `Exit`, which
* represents the outcome (success or failure) of the effect.
*
* **When to Use**
*
* Use `runPromiseExit` when you need to determine if an effect succeeded
* or failed, including any defects, and you want to work with a `Promise`.
*
* **Details**
*
* The `Exit` type represents the result of the effect:
* - If the effect succeeds, the result is wrapped in a `Success`.
* - If it fails, the failure information is provided as a `Failure` containing
*   a `Cause` type.
*
* @example
* ```ts
* // Title: Handling Results as Exit
* import { Effect } from "effect"
*
* // Execute a successful effect and get the Exit result as a Promise
* Effect.runPromiseExit(Effect.succeed(1)).then(console.log)
* // Output:
* // {
* //   _id: "Exit",
* //   _tag: "Success",
* //   value: 1
* // }
*
* // Execute a failing effect and get the Exit result as a Promise
* Effect.runPromiseExit(Effect.fail("my error")).then(console.log)
* // Output:
* // {
* //   _id: "Exit",
* //   _tag: "Failure",
* //   cause: {
* //     _id: "Cause",
* //     _tag: "Fail",
* //     failure: "my error"
* //   }
* // }
* ```
*
* @since 2.0.0
* @category Running Effects
*/
const runPromiseExit = runPromiseExit$1;
/**
* Runs an effect and returns a Promise of Exit with provided services.
*
* @example
* ```ts
* import { Effect, Exit, ServiceMap } from "effect"
*
* interface Database {
*   query: (sql: string) => string
* }
*
* const Database = ServiceMap.Service<Database>("Database")
*
* const services = ServiceMap.make(Database, {
*   query: (sql) => `Result for: ${sql}`
* })
*
* const program = Effect.gen(function*() {
*   const db = yield* Database
*   return db.query("SELECT * FROM users")
* })
*
* Effect.runPromiseExitWith(services)(program).then((exit) => {
*   if (Exit.isSuccess(exit)) {
*     console.log("Success:", exit.value)
*   }
* })
* ```
*
* @since 4.0.0
* @category Running Effects
*/
const runPromiseExitWith = runPromiseExitWith$1;
/**
* Executes an effect synchronously, running it immediately and returning the
* result.
*
* **When to Use**
*
* Use `runSync` to run an effect that does not fail and does not include
* any asynchronous operations.
*
* If the effect fails or involves asynchronous work, it will throw an error,
* and execution will stop where the failure or async operation occurs.
*
* @see {@link runSyncExit} for a version that returns an `Exit` type instead of
* throwing an error.
*
* @example
* ```ts
* // Title: Synchronous Logging
* import { Effect } from "effect"
*
* const program = Effect.sync(() => {
*   console.log("Hello, World!")
*   return 1
* })
*
* const result = Effect.runSync(program)
* // Output: Hello, World!
*
* console.log(result)
* // Output: 1
* ```
*
* @example
* // Title: Incorrect Usage with Failing or Async Effects
* import { Effect } from "effect"
*
* try {
*   // Attempt to run an effect that fails
*   Effect.runSync(Effect.fail("my error"))
* } catch (e) {
*   console.error(e)
* }
* // Output:
* // (FiberFailure) Error: my error
*
* try {
*   // Attempt to run an effect that involves async work
*   Effect.runSync(Effect.promise(() => Promise.resolve(1)))
* } catch (e) {
*   console.error(e)
* }
* // Output:
* // (FiberFailure) AsyncFiberException: Fiber #0 cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work
*
* @since 2.0.0
* @category Running Effects
*/
const runSync = runSync$1;
/**
* Executes an effect synchronously with provided services.
*
* @example
* ```ts
* import { Effect, ServiceMap } from "effect"
*
* interface MathService {
*   add: (a: number, b: number) => number
* }
*
* const MathService = ServiceMap.Service<MathService>("MathService")
*
* const services = ServiceMap.make(MathService, {
*   add: (a, b) => a + b
* })
*
* const program = Effect.gen(function*() {
*   const math = yield* MathService
*   return math.add(2, 3)
* })
*
* const result = Effect.runSyncWith(services)(program)
* console.log(result) // 5
* ```
*
* @since 4.0.0
* @category Running Effects
*/
const runSyncWith = runSyncWith$1;
/**
* Runs an effect synchronously and returns the result as an `Exit` type, which
* represents the outcome (success or failure) of the effect.
*
* **When to Use**
*
* Use `runSyncExit` to find out whether an effect succeeded or failed,
* including any defects, without dealing with asynchronous operations.
*
* **Details**
*
* The `Exit` type represents the result of the effect:
* - If the effect succeeds, the result is wrapped in a `Success`.
* - If it fails, the failure information is provided as a `Failure` containing
*   a `Cause` type.
*
* If the effect contains asynchronous operations, `runSyncExit` will
* return an `Failure` with a `Die` cause, indicating that the effect cannot be
* resolved synchronously.
*
* @example
* ```ts
* // Title: Handling Results as Exit
* import { Effect } from "effect"
*
* console.log(Effect.runSyncExit(Effect.succeed(1)))
* // Output:
* // {
* //   _id: "Exit",
* //   _tag: "Success",
* //   value: 1
* // }
*
* console.log(Effect.runSyncExit(Effect.fail("my error")))
* // Output:
* // {
* //   _id: "Exit",
* //   _tag: "Failure",
* //   cause: {
* //     _id: "Cause",
* //     _tag: "Fail",
* //     failure: "my error"
* //   }
* // }
* ```
*
* @example
* // Title: Asynchronous Operation Resulting in Die
* import { Effect } from "effect"
*
* console.log(Effect.runSyncExit(Effect.promise(() => Promise.resolve(1))))
* // Output:
* // {
* //   _id: 'Exit',
* //   _tag: 'Failure',
* //   cause: {
* //     _id: 'Cause',
* //     _tag: 'Die',
* //     defect: [Fiber #0 cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work] {
* //       fiber: [FiberRuntime],
* //       _tag: 'AsyncFiberException',
* //       name: 'AsyncFiberException'
* //     }
* //   }
* // }
*
* @since 2.0.0
* @category Running Effects
*/
const runSyncExit = runSyncExit$1;
/**
* Runs an effect synchronously with provided services, returning an Exit result.
*
* @example
* ```ts
* import { Effect, Exit, ServiceMap } from "effect"
*
* // Define a logger service
* const Logger = ServiceMap.Service<{
*   log: (msg: string) => void
* }>("Logger")
*
* const program = Effect.gen(function*() {
*   const logger = yield* Effect.service(Logger)
*   logger.log("Computing result...")
*   return 42
* })
*
* // Prepare services
* const services = ServiceMap.make(Logger, {
*   log: (msg) => console.log(`[LOG] ${msg}`)
* })
*
* const exit = Effect.runSyncExitWith(services)(program)
*
* if (Exit.isSuccess(exit)) {
*   console.log(`Success: ${exit.value}`)
* } else {
*   console.log(`Failure: ${exit.cause}`)
* }
* // Output:
* // [LOG] Computing result...
* // Success: 42
* ```
*
* @since 4.0.0
* @category Running Effects
*/
const runSyncExitWith = runSyncExitWith$1;
/**
* Creates an Effect-returning function without tracing.
*
* `Effect.fnUntraced` also acts as a `pipe` function, so you can append transforms after the body.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const greet = Effect.fnUntraced(function* (name: string) {
*   yield* Console.log(`Hello, ${name}`)
*   return name.length
* })
*
* Effect.runFork(greet("Ada"))
* ```
*
* @since 3.12.0
* @category Function
*/
const fnUntraced = fnUntraced$1;
/**
* Creates a traced function with an optional span name and `SpanOptionsNoTrace` that adds spans and stack frames, plus pipeable post-processing that receives the Effect and the original arguments.
*
* Pipeable functions run after the body and can transform the resulting Effect.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* // Create a named span and post-process the returned Effect.
* const greet = Effect.fn("greet")(
*   function*(name: string) {
*     yield* Console.log(`Hello, ${name}`)
*     return name.length
*   },
*   Effect.map((length) => length + 1)
* )
*
* const program = Effect.gen(function*() {
*   const result = yield* greet("Ada")
*   yield* Console.log(`Length: ${result}`)
* })
* ```
*
* @since 3.12.0
* @category Function
*/
const fn = fn$1;
/**
* Retrieves the `Clock` service from the context and provides it to the
* specified effectful function.
*
* @example
* ```ts
* import { Console, Effect } from "effect"
*
* const program = Effect.clockWith((clock) =>
*   clock.currentTimeMillis.pipe(
*     Effect.map((currentTime) => `Current time is: ${currentTime}`),
*     Effect.tap(Console.log)
*   )
* )
*
* Effect.runFork(program)
* // Example Output:
* // Current time is: 1735484929744
* ```
*
* @since 2.0.0
* @category Clock
*/
const clockWith = clockWith$2;
/**
* Creates a logger function that logs at the specified level.
*
* If no level is provided, the logger uses the fiber's current log level and
* extracts any `Cause` values from the message list.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const logWarn = Effect.logWithLevel("Warn")
*
* const program = Effect.gen(function*() {
*   yield* logWarn("Cache miss", { key: "user:1" })
* })
* ```
*
* @since 2.0.0
* @category Logging
*/
const logWithLevel = logWithLevel$1;
/**
* An optimized version of `map` that checks if an effect is already resolved
* and applies the mapping function eagerly when possible.
*
* **When to Use**
*
* `mapEager` provides better performance for effects that are already resolved
* by applying the transformation immediately instead of deferring it through
* the effect pipeline.
*
* **Behavior**
*
* - For **Success effects**: Applies the mapping function immediately to the value
* - For **Failure effects**: Returns the failure as-is without applying the mapping
* - For **Pending effects**: Falls back to the regular `map` behavior
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // For resolved effects, the mapping is applied immediately
* const resolved = Effect.succeed(5)
* const mapped = Effect.mapEager(resolved, (n) => n * 2) // Applied eagerly
*
* // For pending effects, behaves like regular map
* const pending = Effect.delay(Effect.succeed(5), "100 millis")
* const mappedPending = Effect.mapEager(pending, (n) => n * 2) // Uses regular map
* ```
*
* @since 4.0.0
* @category Eager
*/
const mapEager = mapEager$1;
/**
* An optimized version of `mapError` that checks if an effect is already resolved
* and applies the error mapping function eagerly when possible.
*
* **When to Use**
*
* `mapErrorEager` provides better performance for effects that are already resolved
* by applying the error transformation immediately instead of deferring it through
* the effect pipeline.
*
* **Behavior**
*
* - For **Success effects**: Returns the success as-is (no error to transform)
* - For **Failure effects**: Applies the mapping function immediately to the error
* - For **Pending effects**: Falls back to the regular `mapError` behavior
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // For resolved failure effects, the error mapping is applied immediately
* const failed = Effect.fail("original error")
* const mapped = Effect.mapErrorEager(failed, (err: string) => `mapped: ${err}`) // Applied eagerly
*
* // For pending effects, behaves like regular mapError
* const pending = Effect.delay(Effect.fail("error"), "100 millis")
* const mappedPending = Effect.mapErrorEager(
*   pending,
*   (err: string) => `mapped: ${err}`
* ) // Uses regular mapError
* ```
*
* @since 4.0.0
* @category Eager
*/
const mapErrorEager = mapErrorEager$1;
/**
* An optimized version of `mapBoth` that checks if an effect is already resolved
* and applies the appropriate mapping function eagerly when possible.
*
* **When to Use**
*
* `mapBothEager` provides better performance for effects that are already resolved
* by applying the transformation immediately instead of deferring it through
* the effect pipeline.
*
* **Behavior**
*
* - For **Success effects**: Applies the `onSuccess` function immediately to the value
* - For **Failure effects**: Applies the `onFailure` function immediately to the error
* - For **Pending effects**: Falls back to the regular `mapBoth` behavior
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // For resolved effects, the appropriate mapping is applied immediately
* const success = Effect.succeed(5)
* const mapped = Effect.mapBothEager(success, {
*   onFailure: (err: string) => `Failed: ${err}`,
*   onSuccess: (n: number) => n * 2
* }) // onSuccess applied eagerly
*
* const failure = Effect.fail("error")
* const mappedError = Effect.mapBothEager(failure, {
*   onFailure: (err: string) => `Failed: ${err}`,
*   onSuccess: (n: number) => n * 2
* }) // onFailure applied eagerly
* ```
*
* @since 4.0.0
* @category Eager
*/
const mapBothEager = mapBothEager$1;
/**
* An optimized version of `flatMap` that checks if an effect is already resolved
* and applies the flatMap function eagerly when possible.
*
* **When to Use**
*
* `flatMapEager` provides better performance for effects that are already resolved
* by applying the transformation immediately instead of deferring it through
* the effect pipeline.
*
* **Behavior**
*
* - For **Success effects**: Applies the flatMap function immediately to the value
* - For **Failure effects**: Returns the failure as-is without applying the flatMap
* - For **Pending effects**: Falls back to the regular `flatMap` behavior
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // For resolved effects, the flatMap is applied immediately
* const resolved = Effect.succeed(5)
* const flatMapped = Effect.flatMapEager(resolved, (n) => Effect.succeed(n * 2)) // Applied eagerly
*
* // For pending effects, behaves like regular flatMap
* const pending = Effect.delay(Effect.succeed(5), "100 millis")
* const flatMappedPending = Effect.flatMapEager(
*   pending,
*   (n) => Effect.succeed(n * 2)
* ) // Uses regular flatMap
* ```
*
* @since 4.0.0
* @category Eager
*/
const flatMapEager = flatMapEager$1;
/**
* An optimized version of `catch` that checks if an effect is already resolved
* and applies the catch function eagerly when possible.
*
* **When to Use**
*
* `catchEager` provides better performance for effects that are already resolved
* by applying the error recovery immediately instead of deferring it through
* the effect pipeline.
*
* **Behavior**
*
* - For **Success effects**: Returns the success as-is (no error to catch)
* - For **Failure effects**: Applies the catch function immediately to the error
* - For **Pending effects**: Falls back to the regular `catch` behavior
*
* @example
* ```ts
* import { Effect } from "effect"
*
* // For resolved failure effects, the catch function is applied immediately
* const failed = Effect.fail("original error")
* const recovered = Effect.catchEager(
*   failed,
*   (err: string) => Effect.succeed(`recovered from: ${err}`)
* ) // Applied eagerly
*
* // For success effects, returns success as-is
* const success = Effect.succeed(42)
* const unchanged = Effect.catchEager(
*   success,
*   (err: string) => Effect.succeed(`recovered from: ${err}`)
* ) // Returns success as-is
*
* // For pending effects, behaves like regular catch
* const pending = Effect.delay(Effect.fail("error"), "100 millis")
* const recoveredPending = Effect.catchEager(
*   pending,
*   (err: string) => Effect.succeed(`recovered from: ${err}`)
* ) // Uses regular catch
* ```
*
* @since 4.0.0
* @category Eager
*/
const catchEager = catchEager$1;
/**
* Creates untraced function effects with eager evaluation optimization.
*
* Executes generator functions eagerly when all yielded effects are synchronous,
* stopping at the first async effect and deferring to normal execution.
*
* @example
* ```ts
* import { Effect } from "effect"
*
* const computation = Effect.fnUntracedEager(function*() {
*   yield* Effect.succeed(1)
*   yield* Effect.succeed(2)
*   return "computed eagerly"
* })
*
* const effect = computation() // Executed immediately if all effects are sync
* ```
*
* @since 4.0.0
* @category Eager
*/
const fnUntracedEager = fnUntracedEager$1;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/DateTime.js
TypeId$8;
TimeZoneTypeId;
/**
* @since 3.6.0
* @category guards
*/
const isDateTime = isDateTime$1;
/**
* Checks if a value is a `TimeZone`.
*
* @since 3.6.0
* @category guards
*/
const isTimeZone = isTimeZone$1;
/**
* Checks if a value is an offset-based `TimeZone`.
*
* @since 3.6.0
* @category guards
*/
const isTimeZoneOffset = isTimeZoneOffset$1;
/**
* Checks if a value is a named `TimeZone` (IANA time zone).
*
* @since 3.6.0
* @category guards
*/
const isTimeZoneNamed = isTimeZoneNamed$1;
/**
* Checks if a `DateTime` is a UTC `DateTime` (no time zone information).
*
* @since 3.6.0
* @category guards
*/
const isUtc = isUtc$1;
/**
* Checks if a `DateTime` is a zoned `DateTime` (has time zone information).
*
* @since 3.6.0
* @category guards
*/
const isZoned = isZoned$1;
/**
* An `Equivalence` for comparing two `DateTime` values for equality.
*
* Two `DateTime` values are considered equivalent if they represent the same
* point in time, regardless of their time zone.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const utc = DateTime.makeUnsafe("2024-01-01T12:00:00Z")
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T12:00:00Z", {
*   timeZone: "Europe/London"
* })
*
* console.log(DateTime.Equivalence(utc, zoned)) // true
* ```
*
* @category instances
* @since 3.6.0
*/
const Equivalence = Equivalence$1;
/**
* An `Order` for comparing and sorting `DateTime` values.
*
* `DateTime` values are ordered by their epoch milliseconds, so earlier times
* come before later times regardless of time zone.
*
* @example
* ```ts
* import { Array, DateTime } from "effect"
*
* const dates = [
*   DateTime.makeUnsafe("2024-03-01"),
*   DateTime.makeUnsafe("2024-01-01"),
*   DateTime.makeUnsafe("2024-02-01")
* ]
*
* const sorted = Array.sort(dates, DateTime.Order)
* // Results in chronological order: 2024-01-01, 2024-02-01, 2024-03-01
* ```
*
* @category instances
* @since 3.6.0
*/
const Order = Order$1;
/**
* Clamp a `DateTime` between a minimum and maximum value.
*
* If the `DateTime` is before the minimum, the minimum is returned.
* If the `DateTime` is after the maximum, the maximum is returned.
* Otherwise, the original `DateTime` is returned.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const min = DateTime.makeUnsafe("2024-01-01")
* const max = DateTime.makeUnsafe("2024-12-31")
* const date = DateTime.makeUnsafe("2025-06-15")
*
* const clamped = DateTime.clamp(date, { minimum: min, maximum: max })
* // clamped equals max (2024-12-31)
* ```
*
* @category instances
* @since 3.6.0
*/
const clamp = clamp$1;
/**
* Create a `DateTime` from a `Date`.
*
* If the `Date` is invalid, an `IllegalArgumentError` will be thrown.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const date = new Date("2024-01-01T12:00:00Z")
* const dateTime = DateTime.fromDateUnsafe(date)
*
* console.log(DateTime.formatIso(dateTime)) // "2024-01-01T12:00:00.000Z"
* ```
*
* @category constructors
* @since 3.6.0
*/
const fromDateUnsafe = fromDateUnsafe$1;
/**
* Create a `DateTime` from one of the following:
*
* - A `DateTime`
* - A `Date` instance (invalid dates will throw an `IllegalArgumentError`)
* - The `number` of milliseconds since the Unix epoch
* - An object with the parts of a date
* - A `string` that can be parsed by `Date.parse`
*
* @since 3.6.0
* @category constructors
* @example
* ```ts
* import { DateTime } from "effect"
*
* // from Date
* DateTime.makeUnsafe(new Date())
*
* // from parts
* DateTime.makeUnsafe({ year: 2024 })
*
* // from string
* DateTime.makeUnsafe("2024-01-01")
* ```
*/
const makeUnsafe$1 = makeUnsafe$2;
/**
* Create a `DateTime.Zoned` using `DateTime.makeUnsafe` and a time zone.
*
* The input is treated as UTC and then the time zone is attached, unless
* `adjustForTimeZone` is set to `true`. In that case, the input is treated as
* already in the time zone.
*
* When `adjustForTimeZone` is true and ambiguous times occur during DST transitions,
* the `disambiguation` option controls how to resolve the ambiguity:
* - `compatible` (default): Choose earlier time for repeated times, later for gaps
* - `earlier`: Always choose the earlier of two possible times
* - `later`: Always choose the later of two possible times
* - `reject`: Throw an error when ambiguous times are encountered
*
* @since 3.6.0
* @category constructors
* @example
* ```ts
* import { DateTime } from "effect"
*
* DateTime.makeZonedUnsafe(new Date(), { timeZone: "Europe/London" })
* ```
*/
const makeZonedUnsafe = makeZonedUnsafe$1;
/**
* Create a `DateTime.Zoned` using `DateTime.make` and a time zone.
*
* The input is treated as UTC and then the time zone is attached, unless
* `adjustForTimeZone` is set to `true`. In that case, the input is treated as
* already in the time zone.
*
* When `adjustForTimeZone` is true and ambiguous times occur during DST transitions,
* the `disambiguation` option controls how to resolve the ambiguity:
* - `compatible` (default): Choose earlier time for repeated times, later for gaps
* - `earlier`: Always choose the earlier of two possible times
* - `later`: Always choose the later of two possible times
* - `reject`: Throw an error when ambiguous times are encountered
*
* If the date time input or time zone is invalid, `None` will be returned.
*
* @since 3.6.0
* @category constructors
* @example
* ```ts
* import { DateTime } from "effect"
*
* DateTime.makeZoned(new Date(), { timeZone: "Europe/London" })
* ```
*/
const makeZoned = makeZoned$1;
/**
* Create a `DateTime` from one of the following:
*
* - A `DateTime`
* - A `Date` instance (invalid dates will throw an `IllegalArgumentError`)
* - The `number` of milliseconds since the Unix epoch
* - An object with the parts of a date
* - A `string` that can be parsed by `Date.parse`
*
* If the input is invalid, `None` will be returned.
*
* @since 3.6.0
* @category constructors
* @example
* ```ts
* import { DateTime } from "effect"
*
* // from Date
* DateTime.make(new Date())
*
* // from parts
* DateTime.make({ year: 2024 })
*
* // from string
* DateTime.make("2024-01-01")
* ```
*/
const make$4 = make$5;
/**
* Create a `DateTime.Zoned` from a string.
*
* It uses the format: `YYYY-MM-DDTHH:mm:ss.sss+HH:MM[Time/Zone]`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const result1 = DateTime.makeZonedFromString(
*   "2024-01-01T12:00:00+02:00[Europe/Berlin]"
* )
* console.log(result1 !== undefined) // true
*
* const result2 = DateTime.makeZonedFromString("2024-01-01T12:00:00Z")
* console.log(result2 !== undefined) // true
*
* const invalid = DateTime.makeZonedFromString("invalid")
* console.log(invalid === undefined) // true
* ```
*
* @since 3.6.0
* @category constructors
*/
const makeZonedFromString = makeZonedFromString$1;
/**
* Get the current time using the `Clock` service and convert it to a `DateTime`.
*
* @since 3.6.0
* @category constructors
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
* })
* ```
*/
const now = now$1;
/**
* Get the current time using the `Clock` service and convert it to a `DateTime`.
*
* @since 3.6.0
* @category constructors
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
* })
* ```
*/
const nowAsDate = nowAsDate$1;
/**
* Get the current time using `Date.now`.
*
* This is a synchronous version of `now` that directly uses `Date.now()`
* instead of the Effect `Clock` service.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const now = DateTime.nowUnsafe()
* console.log(DateTime.formatIso(now))
* ```
*
* @category constructors
* @since 3.6.0
*/
const nowUnsafe = nowUnsafe$1;
/**
* For a `DateTime` returns a new `DateTime.Utc`.
*
* @since 3.13.0
* @category time zones
* @example
* ```ts
* import { DateTime } from "effect"
*
* const now = DateTime.makeZonedUnsafe({ year: 2024 }, {
*   timeZone: "Europe/London"
* })
*
* // set as UTC
* const utc: DateTime.Utc = DateTime.toUtc(now)
* ```
*/
const toUtc = toUtc$1;
/**
* Set the time zone of a `DateTime`, returning a new `DateTime.Zoned`.
*
* @since 3.6.0
* @category time zones
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
*   const zone = DateTime.zoneMakeNamedUnsafe("Europe/London")
*
*   // set the time zone
*   const zoned: DateTime.Zoned = DateTime.setZone(now, zone)
* })
* ```
*/
const setZone = setZone$1;
/**
* Add a fixed offset time zone to a `DateTime`.
*
* The offset is in milliseconds.
*
* @since 3.6.0
* @category time zones
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
*
*   // set the offset time zone in milliseconds
*   const zoned: DateTime.Zoned = DateTime.setZoneOffset(now, 3 * 60 * 60 * 1000)
* })
* ```
*/
const setZoneOffset = setZoneOffset$1;
/**
* Attempt to create a named time zone from a IANA time zone identifier.
*
* If the time zone is invalid, an `IllegalArgumentError` will be thrown.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const londonZone = DateTime.zoneMakeNamedUnsafe("Europe/London")
* console.log(DateTime.zoneToString(londonZone)) // "Europe/London"
*
* const tokyoZone = DateTime.zoneMakeNamedUnsafe("Asia/Tokyo")
* console.log(DateTime.zoneToString(tokyoZone)) // "Asia/Tokyo"
*
* // This would throw an IllegalArgumentError:
* // DateTime.zoneMakeNamedUnsafe("Invalid/Zone")
* ```
*
* @since 3.6.0
* @category time zones
*/
const zoneMakeNamedUnsafe = zoneMakeNamedUnsafe$1;
/**
* Create a fixed offset time zone.
*
* The offset is specified in milliseconds from UTC. Positive values are
* ahead of UTC, negative values are behind UTC.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* // Create a time zone with +3 hours offset
* const zone = DateTime.zoneMakeOffset(3 * 60 * 60 * 1000)
*
* const dt = DateTime.makeZonedUnsafe("2024-01-01T12:00:00Z", {
*   timeZone: zone
* })
* ```
*
* @category time zones
* @since 3.6.0
*/
const zoneMakeOffset = zoneMakeOffset$1;
/**
* Create a named time zone from a IANA time zone identifier.
*
* If the time zone is invalid, `None` will be returned.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const validZone = DateTime.zoneMakeNamed("Europe/London")
* console.log(validZone !== undefined) // true
*
* const invalidZone = DateTime.zoneMakeNamed("Invalid/Zone")
* console.log(invalidZone === undefined) // true
* ```
*
* @category time zones
* @since 3.6.0
*/
const zoneMakeNamed = zoneMakeNamed$1;
/**
* Create a named time zone from a IANA time zone identifier.
*
* If the time zone is invalid, it will fail with an `IllegalArgumentError`.
*
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const zone = yield* DateTime.zoneMakeNamedEffect("Europe/London")
*   const now = yield* DateTime.now
*   return DateTime.setZone(now, zone)
* })
* ```
*
* @category time zones
* @since 3.6.0
*/
const zoneMakeNamedEffect = zoneMakeNamedEffect$1;
/**
* Create a named time zone from the system's local time zone.
*
* This uses the system's configured time zone, which may vary depending
* on the runtime environment.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const localZone = DateTime.zoneMakeLocal()
* const now = DateTime.nowUnsafe()
* const localTime = DateTime.setZone(now, localZone)
*
* console.log(DateTime.formatIsoZoned(localTime))
* ```
*
* @category time zones
* @since 3.6.0
*/
const zoneMakeLocal = zoneMakeLocal$1;
/**
* Try to parse a `TimeZone` from a string.
*
* Supports both IANA time zone identifiers and offset formats like "+03:00".
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const namedZone = DateTime.zoneFromString("Europe/London")
* const offsetZone = DateTime.zoneFromString("+03:00")
* const invalid = DateTime.zoneFromString("invalid")
*
* console.log(namedZone !== undefined) // true
* console.log(offsetZone !== undefined) // true
* console.log(invalid === undefined) // true
* ```
*
* @category time zones
* @since 3.6.0
*/
const zoneFromString = zoneFromString$1;
/**
* Format a `TimeZone` as a string.
*
* @since 3.6.0
* @category time zones
* @example
* ```ts
* import { DateTime } from "effect"
*
* // Outputs "+03:00"
* DateTime.zoneToString(DateTime.zoneMakeOffset(3 * 60 * 60 * 1000))
*
* // Outputs "Europe/London"
* DateTime.zoneToString(DateTime.zoneMakeNamedUnsafe("Europe/London"))
* ```
*/
const zoneToString = zoneToString$1;
/**
* Set the time zone of a `DateTime` from an IANA time zone identifier. If the
* time zone is invalid, `None` will be returned.
*
* @since 3.6.0
* @category time zones
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
*   // set the time zone, returns an Option
*   DateTime.setZoneNamed(now, "Europe/London")
* })
* ```
*/
const setZoneNamed = setZoneNamed$1;
/**
* Set the time zone of a `DateTime` from an IANA time zone identifier. If the
* time zone is invalid, an `IllegalArgumentError` will be thrown.
*
* @since 3.6.0
* @category time zones
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
*   // set the time zone
*   DateTime.setZoneNamedUnsafe(now, "Europe/London")
* })
* ```
*/
const setZoneNamedUnsafe = setZoneNamedUnsafe$1;
/**
* Calulate the difference between two `DateTime` values, returning the number
* of milliseconds the `other` DateTime is from `self`.
*
* If `other` is *after* `self`, the result will be a positive number.
*
* @since 3.6.0
* @category comparisons
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
*   const other = DateTime.add(now, { minutes: 1 })
*
*   // returns 60000
*   DateTime.distance(now, other)
* })
* ```
*/
const distance = distance$1;
/**
* Calulate the difference between two `DateTime` values.
*
* If the `other` DateTime is before `self`, the result will be a negative
* `Duration`, returned as a `Failure`.
*
* If the `other` DateTime is after `self`, the result will be a positive
* `Duration`, returned as a `Success`.
*
* @since 3.6.0
* @category comparisons
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
*   const other = DateTime.add(now, { minutes: 1 })
*
*   // returns Result.succeed(Duration.minutes(1))
*   DateTime.distanceDurationResult(now, other)
*
*   // returns Result.fail(Duration.minutes(1))
*   DateTime.distanceDurationResult(other, now)
* })
* ```
*/
const distanceDurationResult = distanceDurationResult$1;
/**
* Calulate the distance between two `DateTime` values.
*
* @since 3.6.0
* @category comparisons
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* Effect.gen(function*() {
*   const now = yield* DateTime.now
*   const other = DateTime.add(now, { minutes: 1 })
*
*   // returns Duration.minutes(1)
*   DateTime.distanceDuration(now, other)
* })
* ```
*/
const distanceDuration = distanceDuration$1;
/**
* Returns the earlier of two `DateTime` values.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const date1 = DateTime.makeUnsafe("2024-01-01")
* const date2 = DateTime.makeUnsafe("2024-02-01")
*
* const earlier = DateTime.min(date1, date2)
* // earlier equals date1 (2024-01-01)
* ```
*
* @category comparisons
* @since 3.6.0
*/
const min = min$1;
/**
* Returns the later of two `DateTime` values.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const date1 = DateTime.makeUnsafe("2024-01-01")
* const date2 = DateTime.makeUnsafe("2024-02-01")
*
* const later = DateTime.max(date1, date2)
* // later equals date2 (2024-02-01)
* ```
*
* @category comparisons
* @since 3.6.0
*/
const max = max$1;
/**
* Checks if the first `DateTime` is after the second `DateTime`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const date1 = DateTime.makeUnsafe("2024-02-01")
* const date2 = DateTime.makeUnsafe("2024-01-01")
*
* console.log(DateTime.isGreaterThan(date1, date2)) // true
* console.log(DateTime.isGreaterThan(date2, date1)) // false
* ```
*
* @category comparisons
* @since 3.6.0
*/
const isGreaterThan$1 = isGreaterThan$2;
/**
* Checks if the first `DateTime` is after or equal to the second `DateTime`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const date1 = DateTime.makeUnsafe("2024-01-01")
* const date2 = DateTime.makeUnsafe("2024-01-01")
* const date3 = DateTime.makeUnsafe("2024-02-01")
*
* console.log(DateTime.isGreaterThanOrEqualTo(date1, date2)) // true
* console.log(DateTime.isGreaterThanOrEqualTo(date3, date1)) // true
* console.log(DateTime.isGreaterThanOrEqualTo(date1, date3)) // false
* ```
*
* @category comparisons
* @since 3.6.0
*/
const isGreaterThanOrEqualTo$1 = isGreaterThanOrEqualTo$2;
/**
* Checks if the first `DateTime` is before the second `DateTime`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const date1 = DateTime.makeUnsafe("2024-01-01")
* const date2 = DateTime.makeUnsafe("2024-02-01")
*
* console.log(DateTime.isLessThan(date1, date2)) // true
* console.log(DateTime.isLessThan(date2, date1)) // false
* ```
*
* @category comparisons
* @since 3.6.0
*/
const isLessThan$1 = isLessThan$2;
/**
* Checks if the first `DateTime` is before or equal to the second `DateTime`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const date1 = DateTime.makeUnsafe("2024-01-01")
* const date2 = DateTime.makeUnsafe("2024-01-01")
* const date3 = DateTime.makeUnsafe("2024-02-01")
*
* console.log(DateTime.isLessThanOrEqualTo(date1, date2)) // true
* console.log(DateTime.isLessThanOrEqualTo(date1, date3)) // true
* console.log(DateTime.isLessThanOrEqualTo(date3, date1)) // false
* ```
*
* @category comparisons
* @since 3.6.0
*/
const isLessThanOrEqualTo$1 = isLessThanOrEqualTo$2;
/**
* Checks if a `DateTime` is between two other `DateTime` values (inclusive).
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const min = DateTime.makeUnsafe("2024-01-01")
* const max = DateTime.makeUnsafe("2024-12-31")
* const date = DateTime.makeUnsafe("2024-06-15")
*
* console.log(DateTime.between(date, { minimum: min, maximum: max })) // true
* ```
*
* @category comparisons
* @since 3.6.0
*/
const between = between$1;
/**
* Checks if a `DateTime` is in the future compared to the current time.
*
* This is an effectful operation that uses the current time from the `Clock` service.
*
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const futureDate = DateTime.add(yield* DateTime.now, { hours: 1 })
*   const isFuture = yield* DateTime.isFuture(futureDate)
*   console.log(isFuture) // true
* })
* ```
*
* @category comparisons
* @since 3.6.0
*/
const isFuture = isFuture$1;
/**
* Checks if a `DateTime` is in the future compared to the current time.
*
* This is a synchronous version that uses `Date.now()` directly.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const now = DateTime.nowUnsafe()
* const futureDate = DateTime.add(now, { hours: 1 })
*
* console.log(DateTime.isFutureUnsafe(futureDate)) // true
* console.log(DateTime.isFutureUnsafe(now)) // false
* ```
*
* @category comparisons
* @since 3.6.0
*/
const isFutureUnsafe = isFutureUnsafe$1;
/**
* Checks if a `DateTime` is in the past compared to the current time.
*
* This is an effectful operation that uses the current time from the `Clock` service.
*
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   const pastDate = DateTime.subtract(yield* DateTime.now, { hours: 1 })
*   const isPast = yield* DateTime.isPast(pastDate)
*   console.log(isPast) // true
* })
* ```
*
* @category comparisons
* @since 3.6.0
*/
const isPast = isPast$1;
/**
* Checks if a `DateTime` is in the past compared to the current time.
*
* This is a synchronous version that uses `Date.now()` directly.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const now = DateTime.nowUnsafe()
* const pastDate = DateTime.subtract(now, { hours: 1 })
*
* console.log(DateTime.isPastUnsafe(pastDate)) // true
* console.log(DateTime.isPastUnsafe(now)) // false
* ```
*
* @category comparisons
* @since 3.6.0
*/
const isPastUnsafe = isPastUnsafe$1;
/**
* Get the UTC `Date` of a `DateTime`.
*
* This always returns the UTC representation, ignoring any time zone information.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeZonedUnsafe("2024-01-01T12:00:00Z", {
*   timeZone: "Europe/London"
* })
*
* const utcDate = DateTime.toDateUtc(dt)
* console.log(utcDate.toISOString()) // "2024-01-01T12:00:00.000Z"
* ```
*
* @category conversions
* @since 3.6.0
*/
const toDateUtc = toDateUtc$1;
/**
* Convert a `DateTime` to a `Date`, applying the time zone first.
*
* For `DateTime.Zoned`, this adjusts for the time zone before converting.
* For `DateTime.Utc`, this is equivalent to `toDateUtc`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const utc = DateTime.makeUnsafe("2024-01-01T12:00:00Z")
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T12:00:00Z", {
*   timeZone: "Europe/London"
* })
*
* console.log(DateTime.toDate(utc).toISOString())
* console.log(DateTime.toDate(zoned).toISOString())
* ```
*
* @category conversions
* @since 3.6.0
*/
const toDate = toDate$1;
/**
* Calculate the time zone offset of a `DateTime.Zoned` in milliseconds.
*
* Returns the offset from UTC in milliseconds. Positive values indicate
* time zones ahead of UTC, negative values indicate time zones behind UTC.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T12:00:00Z", {
*   timeZone: "Europe/London"
* })
*
* const offset = DateTime.zonedOffset(zoned)
* console.log(offset) // 0 (London is UTC+0 in winter)
* ```
*
* @category conversions
* @since 3.6.0
*/
const zonedOffset = zonedOffset$1;
/**
* Format the time zone offset of a `DateTime.Zoned` as an ISO string.
*
* The offset is formatted as "±HH:MM".
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T12:00:00Z", {
*   timeZone: DateTime.zoneMakeOffset(3 * 60 * 60 * 1000) // +3 hours
* })
*
* const offsetString = DateTime.zonedOffsetIso(zoned)
* console.log(offsetString) // "+03:00"
* ```
*
* @category conversions
* @since 3.6.0
*/
const zonedOffsetIso = zonedOffsetIso$1;
/**
* Get the milliseconds since the Unix epoch of a `DateTime`.
*
* This returns the UTC timestamp regardless of any time zone information.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-01-01T00:00:00Z")
* const epochMillis = DateTime.toEpochMillis(dt)
*
* console.log(epochMillis) // 1704067200000
* console.log(new Date(epochMillis).toISOString()) // "2024-01-01T00:00:00.000Z"
* ```
*
* @category conversions
* @since 3.6.0
*/
const toEpochMillis = toEpochMillis$1;
/**
* Remove the time aspect of a `DateTime`, first adjusting for the time
* zone. It will return a `DateTime.Utc` only containing the date.
*
* @since 3.6.0
* @category conversions
* @example
* ```ts
* import { DateTime } from "effect"
*
* // returns "2024-01-01T00:00:00Z"
* DateTime.makeZonedUnsafe("2024-01-01T05:00:00Z", {
*   timeZone: "Pacific/Auckland",
*   adjustForTimeZone: true
* }).pipe(
*   DateTime.removeTime,
*   DateTime.formatIso
* )
* ```
*/
const removeTime = removeTime$1;
/**
* Get the different parts of a `DateTime` as an object.
*
* The parts will be time zone adjusted if the `DateTime` is zoned.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-01-01T12:30:45.123Z")
* const parts = DateTime.toParts(dt)
*
* console.log(parts)
* // {
* //   year: 2024,
* //   month: 1,
* //   day: 1,
* //   hours: 12,
* //   minutes: 30,
* //   seconds: 45,
* //   millis: 123,
* //   weekDay: 1 // Monday
* // }
* ```
*
* @category parts
* @since 3.6.0
*/
const toParts = toParts$1;
/**
* Get the different parts of a `DateTime` as an object.
*
* The parts will always be in UTC, ignoring any time zone information.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T12:30:45.123Z", {
*   timeZone: "Europe/London"
* })
* const parts = DateTime.toPartsUtc(zoned)
*
* console.log(parts)
* // Always returns UTC parts regardless of time zone
* ```
*
* @category parts
* @since 3.6.0
*/
const toPartsUtc = toPartsUtc$1;
/**
* Get a part of a `DateTime` as a number.
*
* The part will be in the UTC time zone.
*
* @since 3.6.0
* @category parts
* @example
* ```ts
* import { DateTime } from "effect"
* import * as assert from "node:assert"
*
* const now = DateTime.makeUnsafe({ year: 2024 })
* const year = DateTime.getPartUtc(now, "year")
* assert.strictEqual(year, 2024)
* ```
*/
const getPartUtc = getPartUtc$1;
/**
* Get a part of a `DateTime` as a number.
*
* The part will be time zone adjusted.
*
* @since 3.6.0
* @category parts
* @example
* ```ts
* import { DateTime } from "effect"
* import * as assert from "node:assert"
*
* const now = DateTime.makeZonedUnsafe({ year: 2024 }, {
*   timeZone: "Europe/London"
* })
* const year = DateTime.getPart(now, "year")
* assert.strictEqual(year, 2024)
* ```
*/
const getPart = getPart$1;
/**
* Set the different parts of a `DateTime` as an object.
*
* The date will be time zone adjusted for `DateTime.Zoned`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-01-01T12:00:00Z")
* const updated = DateTime.setParts(dt, {
*   year: 2025,
*   month: 6,
*   day: 15
* })
*
* console.log(DateTime.formatIso(updated)) // "2025-06-15T12:00:00.000Z"
* ```
*
* @category parts
* @since 3.6.0
*/
const setParts = setParts$1;
/**
* Set the different parts of a `DateTime` as an object.
*
* The parts are always interpreted as UTC, ignoring any time zone information.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-01-01T12:00:00Z")
* const updated = DateTime.setPartsUtc(dt, {
*   year: 2025,
*   hours: 18
* })
*
* console.log(DateTime.formatIso(updated)) // "2025-01-01T18:00:00.000Z"
* ```
*
* @category parts
* @since 3.6.0
*/
const setPartsUtc = setPartsUtc$1;
/**
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* const program = Effect.gen(function*() {
*   // Access the current time zone service
*   const zone = yield* DateTime.CurrentTimeZone.asEffect()
*   console.log(DateTime.zoneToString(zone))
* })
*
* // Provide a time zone
* const layer = DateTime.layerCurrentZoneNamed("Europe/London")
* Effect.provide(program, layer)
* ```
*
* @since 3.11.0
* @category current time zone
*/
var CurrentTimeZone = class extends Service()("effect/DateTime/CurrentTimeZone") {};
/**
* Modify a `DateTime` by applying a function to a cloned `Date` instance.
*
* The `Date` will first have the time zone applied if possible, and then be
* converted back to a `DateTime` within the same time zone.
*
* Supports `disambiguation` when the new wall clock time is ambiguous.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-01-01T12:00:00Z")
*
* const modified = DateTime.mutate(dt, (date) => {
*   date.setHours(15) // Set to 3 PM
*   date.setMinutes(30) // Set to 30 minutes
* })
*
* console.log(DateTime.formatIso(modified)) // "2024-01-01T15:30:00.000Z"
* ```
*
* @since 3.6.0
* @category mapping
*/
const mutate = mutate$1;
/**
* Modify a `DateTime` by applying a function to a cloned UTC `Date` instance.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeZonedUnsafe("2024-01-01T12:00:00Z", {
*   timeZone: "Europe/London"
* })
*
* const modified = DateTime.mutateUtc(dt, (date) => {
*   date.setUTCHours(18) // Set UTC time to 6 PM
* })
*
* console.log(DateTime.formatIso(modified)) // "2024-01-01T18:00:00.000Z"
* ```
*
* @since 3.6.0
* @category mapping
*/
const mutateUtc = mutateUtc$1;
/**
* Transform a `DateTime` by applying a function to the number of milliseconds
* since the Unix epoch.
*
* @since 3.6.0
* @category mapping
* @example
* ```ts
* import { DateTime } from "effect"
*
* // add 10 milliseconds
* DateTime.makeUnsafe(0).pipe(
*   DateTime.mapEpochMillis((millis) => millis + 10)
* )
* ```
*/
const mapEpochMillis = mapEpochMillis$1;
/**
* Using the time zone adjusted `Date`, apply a function to the `Date` and
* return the result.
*
* @since 3.6.0
* @category mapping
* @example
* ```ts
* import { DateTime } from "effect"
*
* // get the time zone adjusted date in milliseconds
* DateTime.makeZonedUnsafe(0, { timeZone: "Europe/London" }).pipe(
*   DateTime.withDate((date) => date.getTime())
* )
* ```
*/
const withDate = withDate$1;
/**
* Using the time zone adjusted `Date`, apply a function to the `Date` and
* return the result.
*
* @since 3.6.0
* @category mapping
* @example
* ```ts
* import { DateTime } from "effect"
*
* // get the date in milliseconds
* DateTime.makeUnsafe(0).pipe(
*   DateTime.withDateUtc((date) => date.getTime())
* )
* ```
*/
const withDateUtc = withDateUtc$1;
/**
* Pattern match on a `DateTime` to handle `Utc` and `Zoned` cases differently.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt1 = DateTime.nowUnsafe() // Utc
* const dt2 = DateTime.makeZonedUnsafe(new Date(), { timeZone: "Europe/London" }) // Zoned
*
* const result1 = DateTime.match(dt1, {
*   onUtc: (utc) => `UTC: ${DateTime.formatIso(utc)}`,
*   onZoned: (zoned) => `Zoned: ${DateTime.formatIsoZoned(zoned)}`
* })
*
* const result2 = DateTime.match(dt2, {
*   onUtc: (utc) => `UTC: ${DateTime.formatIso(utc)}`,
*   onZoned: (zoned) => `Zoned: ${DateTime.formatIsoZoned(zoned)}`
* })
* ```
*
* @category mapping
* @since 3.6.0
*/
const match = match$2;
/**
* Add the given `Duration` to a `DateTime`.
*
* @since 3.6.0
* @category math
* @example
* ```ts
* import { DateTime } from "effect"
*
* // add 5 minutes
* DateTime.makeUnsafe(0).pipe(
*   DateTime.addDuration("5 minutes")
* )
* ```
*/
const addDuration = addDuration$1;
/**
* Subtract the given `Duration` from a `DateTime`.
*
* @since 3.6.0
* @category math
* @example
* ```ts
* import { DateTime } from "effect"
*
* // subtract 5 minutes
* DateTime.makeUnsafe(0).pipe(
*   DateTime.subtractDuration("5 minutes")
* )
* ```
*/
const subtractDuration = subtractDuration$1;
/**
* Add the given `amount` of `unit`'s to a `DateTime`.
*
* The time zone is taken into account when adding days, weeks, months, and
* years.
*
* @since 3.6.0
* @category math
* @example
* ```ts
* import { DateTime } from "effect"
*
* // add 5 minutes
* DateTime.makeUnsafe(0).pipe(
*   DateTime.add({ minutes: 5 })
* )
* ```
*/
const add = add$1;
/**
* Subtract the given `amount` of `unit`'s from a `DateTime`.
*
* @since 3.6.0
* @category math
* @example
* ```ts
* import { DateTime } from "effect"
*
* // subtract 5 minutes
* DateTime.makeUnsafe(0).pipe(
*   DateTime.subtract({ minutes: 5 })
* )
* ```
*/
const subtract = subtract$1;
/**
* Converts a `DateTime` to the start of the given `part`.
*
* If the part is `week`, the `weekStartsOn` option can be used to specify the
* day of the week that the week starts on. The default is 0 (Sunday).
*
* @since 3.6.0
* @category math
* @example
* ```ts
* import { DateTime } from "effect"
*
* // returns "2024-01-01T00:00:00Z"
* DateTime.makeUnsafe("2024-01-01T12:00:00Z").pipe(
*   DateTime.startOf("day"),
*   DateTime.formatIso
* )
* ```
*/
const startOf = startOf$1;
/**
* Converts a `DateTime` to the end of the given `part`.
*
* If the part is `week`, the `weekStartsOn` option can be used to specify the
* day of the week that the week starts on. The default is 0 (Sunday).
*
* @since 3.6.0
* @category math
* @example
* ```ts
* import { DateTime } from "effect"
*
* // returns "2024-01-01T23:59:59.999Z"
* DateTime.makeUnsafe("2024-01-01T12:00:00Z").pipe(
*   DateTime.endOf("day"),
*   DateTime.formatIso
* )
* ```
*/
const endOf = endOf$1;
/**
* Converts a `DateTime` to the nearest given `part`.
*
* If the part is `week`, the `weekStartsOn` option can be used to specify the
* day of the week that the week starts on. The default is 0 (Sunday).
*
* @since 3.6.0
* @category math
* @example
* ```ts
* import { DateTime } from "effect"
*
* // returns "2024-01-02T00:00:00Z"
* DateTime.makeUnsafe("2024-01-01T12:01:00Z").pipe(
*   DateTime.nearest("day"),
*   DateTime.formatIso
* )
* ```
*/
const nearest = nearest$1;
/**
* Format a `DateTime` as a string using the `DateTimeFormat` API.
*
* The `timeZone` option is set to the offset of the time zone.
*
* Note: On Node versions < 22, fixed "Offset" zones will set the time zone to
* "UTC" and use the adjusted `Date`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeZonedUnsafe("2024-06-15T14:30:00Z", {
*   timeZone: "Europe/London"
* })
*
* const formatted = DateTime.format(dt, {
*   dateStyle: "full",
*   timeStyle: "short",
*   locale: "en-US"
* })
*
* console.log(formatted) // "Saturday, June 15, 2024 at 3:30 PM"
* ```
*
* @since 3.6.0
* @category formatting
*/
const format = format$1;
/**
* Format a `DateTime` as a string using the `DateTimeFormat` API.
*
* It will use the system's local time zone & locale.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-06-15T14:30:00Z")
*
* // Uses system local time zone and locale
* const local = DateTime.formatLocal(dt, {
*   year: "numeric",
*   month: "long",
*   day: "numeric",
*   hour: "2-digit",
*   minute: "2-digit"
* })
*
* console.log(local) // Output depends on system locale/timezone
* ```
*
* @since 3.6.0
* @category formatting
*/
const formatLocal = formatLocal$1;
/**
* Format a `DateTime` as a string using the `DateTimeFormat` API.
*
* This forces the time zone to be UTC.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeZonedUnsafe("2024-06-15T14:30:00Z", {
*   timeZone: "Europe/London"
* })
*
* // Force UTC formatting regardless of time zone
* const utcFormatted = DateTime.formatUtc(dt, {
*   year: "numeric",
*   month: "2-digit",
*   day: "2-digit",
*   hour: "2-digit",
*   minute: "2-digit",
*   timeZoneName: "short"
* })
*
* console.log(utcFormatted) // "06/15/2024, 02:30 PM UTC"
* ```
*
* @since 3.6.0
* @category formatting
*/
const formatUtc = formatUtc$1;
/**
* Format a `DateTime` as a string using the `DateTimeFormat` API.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-06-15T14:30:00Z")
*
* // Create a custom formatter
* const formatter = new Intl.DateTimeFormat("de-DE", {
*   year: "numeric",
*   month: "long",
*   day: "numeric",
*   hour: "2-digit",
*   minute: "2-digit",
*   timeZone: "Europe/Berlin"
* })
*
* const formatted = DateTime.formatIntl(dt, formatter)
* console.log(formatted) // "15. Juni 2024, 16:30"
* ```
*
* @since 3.6.0
* @category formatting
*/
const formatIntl = formatIntl$1;
/**
* Format a `DateTime` as a UTC ISO string.
*
* Always returns the UTC representation in ISO 8601 format, ignoring any time zone.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-01-01T12:30:45.123Z")
* console.log(DateTime.formatIso(dt)) // "2024-01-01T12:30:45.123Z"
*
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T12:30:45.123Z", {
*   timeZone: "Europe/London"
* })
* console.log(DateTime.formatIso(zoned)) // "2024-01-01T12:30:45.123Z"
* ```
*
* @category formatting
* @since 3.6.0
*/
const formatIso = formatIso$1;
/**
* Format a `DateTime` as a time zone adjusted ISO date string.
*
* Returns only the date part (YYYY-MM-DD) after applying time zone adjustments.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-01-01T23:30:00Z")
* console.log(DateTime.formatIsoDate(dt)) // "2024-01-01"
*
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T23:30:00Z", {
*   timeZone: "Pacific/Auckland" // UTC+12/13
* })
* console.log(DateTime.formatIsoDate(zoned)) // "2024-01-02" (next day in Auckland)
* ```
*
* @category formatting
* @since 3.6.0
*/
const formatIsoDate = formatIsoDate$1;
/**
* Format a `DateTime` as a UTC ISO date string.
*
* Returns only the date part (YYYY-MM-DD) in UTC, ignoring any time zone.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const dt = DateTime.makeUnsafe("2024-01-01T23:30:00Z")
* console.log(DateTime.formatIsoDateUtc(dt)) // "2024-01-01"
*
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T23:30:00Z", {
*   timeZone: "Pacific/Auckland"
* })
* console.log(DateTime.formatIsoDateUtc(zoned)) // "2024-01-01" (always UTC)
* ```
*
* @category formatting
* @since 3.6.0
*/
const formatIsoDateUtc = formatIsoDateUtc$1;
/**
* Format a `DateTime.Zoned` as an ISO string with an offset.
*
* For `DateTime.Utc`, returns the same as `formatIso`. For `DateTime.Zoned`,
* includes the time zone offset in the format.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const utc = DateTime.makeUnsafe("2024-01-01T12:00:00Z")
* console.log(DateTime.formatIsoOffset(utc)) // "2024-01-01T12:00:00.000Z"
*
* const zoned = DateTime.makeZonedUnsafe("2024-01-01T12:00:00Z", {
*   timeZone: DateTime.zoneMakeOffset(3 * 60 * 60 * 1000)
* })
* console.log(DateTime.formatIsoOffset(zoned)) // "2024-01-01T15:00:00.000+03:00"
* ```
*
* @category formatting
* @since 3.6.0
*/
const formatIsoOffset = formatIsoOffset$1;
/**
* Format a `DateTime.Zoned` as a string.
*
* It uses the format: `YYYY-MM-DDTHH:mm:ss.sss+HH:MM[Time/Zone]`.
*
* @example
* ```ts
* import { DateTime } from "effect"
*
* const zoned = DateTime.makeZonedUnsafe("2024-06-15T14:30:45.123Z", {
*   timeZone: "Europe/London"
* })
*
* const formatted = DateTime.formatIsoZoned(zoned)
* console.log(formatted) // "2024-06-15T15:30:45.123+01:00[Europe/London]"
*
* const offsetZone = DateTime.makeZonedUnsafe("2024-06-15T14:30:45.123Z", {
*   timeZone: DateTime.zoneMakeOffset(3 * 60 * 60 * 1000)
* })
*
* const offsetFormatted = DateTime.formatIsoZoned(offsetZone)
* console.log(offsetFormatted) // "2024-06-15T17:30:45.123+03:00"
* ```
*
* @since 3.6.0
* @category formatting
*/
const formatIsoZoned = formatIsoZoned$1;
/**
* Create a Layer from the given IANA time zone identifier.
*
* This layer provides the `CurrentTimeZone` service with a named time zone.
* If the time zone identifier is invalid, the layer will fail.
*
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* const layer = DateTime.layerCurrentZoneNamed("Europe/London")
*
* const program = Effect.gen(function*() {
*   const now = yield* DateTime.nowInCurrentZone
*   return DateTime.formatIsoZoned(now)
* })
*
* Effect.provide(program, layer)
* ```
*
* @category current time zone
* @since 3.6.0
*/
const layerCurrentZoneNamed = /* @__PURE__ */ flow(zoneMakeNamedEffect$1, /* @__PURE__ */ effect(CurrentTimeZone));

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/encoding/EncodingError.js
/**
* @since 4.0.0
*/
const EncodingErrorTypeId = "~effect/encoding/EncodingError";
/**
* @category constructors
* @since 4.0.0
*/
var EncodingError = class extends TaggedError("EncodingError") {
	/**
	* @since 4.0.0
	*/
	[EncodingErrorTypeId] = EncodingErrorTypeId;
};

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/encoding/Base64.js
/**
* This module provides encoding & decoding functionality for:
*
* - base64 (RFC4648)
* - base64 (URL)
* - hex
*
* @since 2.0.0
*/
/**
* Encodes the given value into a base64 (RFC4648) `string`.
*
* @example
* ```ts
* import { Base64 } from "effect/encoding"
*
* // Encode a string
* console.log(Base64.encode("hello")) // "aGVsbG8="
*
* // Encode binary data
* const bytes = new Uint8Array([72, 101, 108, 108, 111])
* console.log(Base64.encode(bytes)) // "SGVsbG8="
* ```
*
* @category encoding
* @since 2.0.0
*/
const encode = (input) => typeof input === "string" ? encodeUint8Array(encoder.encode(input)) : encodeUint8Array(input);
const encodeUint8Array = (bytes) => {
	const length = bytes.length;
	let result = "";
	let i;
	for (i = 2; i < length; i += 3) {
		result += base64abc[bytes[i - 2] >> 2];
		result += base64abc[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
		result += base64abc[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
		result += base64abc[bytes[i] & 63];
	}
	if (i === length + 1) {
		result += base64abc[bytes[i - 2] >> 2];
		result += base64abc[(bytes[i - 2] & 3) << 4];
		result += "==";
	}
	if (i === length) {
		result += base64abc[bytes[i - 2] >> 2];
		result += base64abc[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
		result += base64abc[(bytes[i - 1] & 15) << 2];
		result += "=";
	}
	return result;
};
/**
* Decodes a base64 (RFC4648) encoded `string` into a `Uint8Array`.
*
* @example
* ```ts
* import { Result } from "effect"
* import { Base64 } from "effect/encoding"
*
* const result = Base64.decode("SGVsbG8=")
* if (Result.isSuccess(result)) {
*   console.log(Array.from(result.success)) // [72, 101, 108, 108, 111]
* }
* ```
*
* @category decoding
* @since 2.0.0
*/
const decode = (str) => {
	const stripped = stripCrlf(str);
	const length = stripped.length;
	if (length % 4 !== 0) return fail$4(new EncodingError({
		kind: "Decode",
		module: "Base64",
		input: stripped,
		message: `Length must be a multiple of 4, but is ${length}`
	}));
	const index = stripped.indexOf("=");
	if (index !== -1 && (index < length - 2 || index === length - 2 && stripped[length - 1] !== "=")) return fail$4(new EncodingError({
		kind: "Decode",
		module: "Base64",
		input: stripped,
		message: `Found a '=' character, but it is not at the end`
	}));
	try {
		const missingOctets = stripped.endsWith("==") ? 2 : stripped.endsWith("=") ? 1 : 0;
		const result = new Uint8Array(3 * (length / 4) - missingOctets);
		for (let i = 0, j = 0; i < length; i += 4, j += 3) {
			const buffer = getBase64Code(stripped.charCodeAt(i)) << 18 | getBase64Code(stripped.charCodeAt(i + 1)) << 12 | getBase64Code(stripped.charCodeAt(i + 2)) << 6 | getBase64Code(stripped.charCodeAt(i + 3));
			result[j] = buffer >> 16;
			result[j + 1] = buffer >> 8 & 255;
			result[j + 2] = buffer & 255;
		}
		return succeed$3(result);
	} catch (e) {
		return fail$4(new EncodingError({
			kind: "Decode",
			module: "Base64",
			input: stripped,
			message: e instanceof Error ? e.message : "Invalid input"
		}));
	}
};
const encoder = /* @__PURE__ */ new TextEncoder();
const stripCrlf = (str) => str.replace(/[\n\r]/g, "");
function getBase64Code(charCode) {
	if (charCode >= base64codes.length) throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
	const code = base64codes[charCode];
	if (code === 255) throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
	return code;
}
const base64abc = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"+",
	"/"
];
const base64codes = [
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	255,
	62,
	255,
	255,
	255,
	63,
	52,
	53,
	54,
	55,
	56,
	57,
	58,
	59,
	60,
	61,
	255,
	255,
	255,
	0,
	255,
	255,
	255,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	255,
	255,
	255,
	255,
	255,
	255,
	26,
	27,
	28,
	29,
	30,
	31,
	32,
	33,
	34,
	35,
	36,
	37,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	46,
	47,
	48,
	49,
	50,
	51
];

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/schema/annotations.js
/** @internal */
function resolve$1(ast) {
	return ast.checks ? ast.checks[ast.checks.length - 1].annotations : ast.annotations;
}
/** @internal */
function resolveAt$1(key) {
	return (ast) => resolve$1(ast)?.[key];
}
/** @internal */
const resolveIdentifier$1 = /* @__PURE__ */ resolveAt$1("identifier");
/** @internal */
const resolveTitle$1 = /* @__PURE__ */ resolveAt$1("title");
/** @internal */
const resolveDescription$1 = /* @__PURE__ */ resolveAt$1("description");
/** @internal */
const getExpected = /* @__PURE__ */ memoize((ast) => {
	return ast.getExpected(getExpected);
});

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/record.js
/**
* @since 4.0.0
*/
/** @internal */
function set(self, key, value) {
	if (key === "__proto__") Object.defineProperty(self, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
	else self[key] = value;
	return self;
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/RegExp.js
/**
* This module provides utility functions for working with RegExp in TypeScript.
*
* @since 2.0.0
*/
/**
* @since 4.0.0
* @category constructors
* @example
* ```ts
* import { RegExp } from "effect"
*
* // Create a regular expression using Effect's RegExp constructor
* const pattern = new RegExp.RegExp("hello", "i")
*
* // Test the pattern
* console.log(pattern.test("Hello World")) // true
* console.log(pattern.test("goodbye")) // false
* ```
*/
const RegExp$2 = globalThis.RegExp;
/**
* Tests if a value is a `RegExp`.
*
* @example
* ```ts
* import { RegExp } from "effect"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(RegExp.isRegExp(/a/), true)
* assert.deepStrictEqual(RegExp.isRegExp("a"), false)
* ```
*
* @category guards
* @since 3.9.0
*/
const isRegExp = isRegExp$1;
/**
* Escapes special characters in a regular expression pattern.
*
* @example
* ```ts
* import { RegExp } from "effect"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(RegExp.escape("a*b"), "a\\*b")
* ```
*
* @category utilities
* @since 2.0.0
*/
const escape = (string) => string.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/SchemaIssue.js
const TypeId$4 = "~effect/SchemaIssue/Issue";
/**
* Returns `true` if the given value is an {@link Issue}.
*
* When to use:
*
* - Narrowing an `unknown` value to `Issue` in error-handling code.
* - Distinguishing an `Issue` from other error types in a catch-all handler.
*
* Behaviour:
*
* - Pure; does not mutate input.
* - Checks for the internal `TypeId` brand on the value.
*
* **Example** (Type-guarding an unknown error)
*
* ```ts
* import { SchemaIssue } from "effect"
*
* const issue = new SchemaIssue.MissingKey(undefined)
* console.log(SchemaIssue.isIssue(issue))
* // true
* console.log(SchemaIssue.isIssue("not an issue"))
* // false
* ```
*
* @see {@link Issue}
*
* @since 4.0.0
*/
function isIssue(u) {
	return hasProperty(u, TypeId$4);
}
var Base$1 = class {
	[TypeId$4] = TypeId$4;
	toString() {
		return defaultFormatter(this);
	}
};
/**
* Issue produced when a schema filter (refinement check) fails.
*
* When to use:
*
* - Inspect which filter rejected the value.
* - Walk the inner `issue` for the specific validation failure.
*
* Behaviour:
*
* - `actual` is the raw input value that was tested (plain `unknown`, not
*   wrapped in `Option`).
* - `filter` is the AST filter node that produced this issue.
* - `issue` is the inner issue describing the failure reason.
*
* **Example** (Matching a Filter issue)
*
* ```ts
* import { SchemaIssue } from "effect"
*
* function describe(issue: SchemaIssue.Issue): string {
*   if (issue._tag === "Filter") {
*     return `Filter failed on: ${JSON.stringify(issue.actual)}`
*   }
*   return String(issue)
* }
* ```
*
* @see {@link Leaf} — terminal issue types that commonly appear as the inner `issue`
* @see {@link CheckHook} — formatter hook for `Filter` issues
*
* @category model
* @since 4.0.0
*/
var Filter$1 = class extends Base$1 {
	_tag = "Filter";
	/**
	* The input value that caused the issue.
	*/
	actual;
	/**
	* The filter that failed.
	*/
	filter;
	/**
	* The issue that occurred.
	*/
	issue;
	constructor(actual, filter, issue) {
		super();
		this.actual = actual;
		this.filter = filter;
		this.issue = issue;
	}
};
/**
* Issue produced when a schema transformation (encode/decode step) fails.
*
* When to use:
*
* - Inspect failures from `Schema.decodeTo` / `Schema.encodeTo`
*   transformations.
* - Walk the inner `issue` for the root cause of the transformation failure.
*
* Behaviour:
*
* - `ast` is the AST node for the transformation that failed.
* - `actual` is `Option.some(value)` when the input was present, or
*   `Option.none()` when it was absent.
* - `issue` is the inner issue describing the failure.
*
* @see {@link Filter} — failure from a refinement check (not a transformation)
* @see {@link Composite} — multiple issues from a single schema node
*
* @category model
* @since 4.0.0
*/
var Encoding = class extends Base$1 {
	_tag = "Encoding";
	/**
	* The schema that caused the issue.
	*/
	ast;
	/**
	* The input value that caused the issue.
	*/
	actual;
	/**
	* The issue that occurred.
	*/
	issue;
	constructor(ast, actual, issue) {
		super();
		this.ast = ast;
		this.actual = actual;
		this.issue = issue;
	}
};
/**
* Wraps an inner {@link Issue} with a property-key path, indicating *where* in
* a nested structure the error occurred.
*
* When to use:
*
* - Walk the issue tree to accumulate path segments for error reporting.
* - Match on `_tag === "Pointer"` when flattening nested issues.
*
* Behaviour:
*
* - `path` is an array of property keys (strings, numbers, or symbols).
* - Has no `actual` value — {@link getActual} returns `Option.none()`.
* - Formatters concatenate nested `Pointer` paths into a single path like
*   `["a"]["b"][0]`.
*
* @see {@link getActual} — returns `Option.none()` for `Pointer`
* @see {@link Composite} — groups multiple issues under one schema node
*
* @category model
* @since 4.0.0
*/
var Pointer = class extends Base$1 {
	_tag = "Pointer";
	/**
	* The path to the location in the input that caused the issue.
	*/
	path;
	/**
	* The issue that occurred.
	*/
	issue;
	constructor(path, issue) {
		super();
		this.path = path;
		this.issue = issue;
	}
};
/**
* Issue produced when a required key or tuple index is missing from the input.
*
* When to use:
*
* - Detect absent fields in struct/tuple validation.
* - Typically found inside a {@link Pointer} that indicates which key is
*   missing.
*
* Behaviour:
*
* - Has no `actual` value — {@link getActual} returns `Option.none()`.
* - `annotations` may contain a custom `messageMissingKey` for formatting.
*
* @see {@link Pointer} — wraps this issue with the missing key's path
* @see {@link UnexpectedKey} — the opposite case (extra key present)
*
* @category model
* @since 4.0.0
*/
var MissingKey = class extends Base$1 {
	_tag = "MissingKey";
	/**
	* The metadata for the issue.
	*/
	annotations;
	constructor(annotations) {
		super();
		this.annotations = annotations;
	}
};
/**
* Issue produced when an input object or tuple contains a key/index not
* declared by the schema.
*
* When to use:
*
* - Detect excess properties during strict struct/tuple validation.
* - Typically found inside a {@link Pointer} that indicates which key was
*   unexpected.
*
* Behaviour:
*
* - `actual` is the raw value at the unexpected key (plain `unknown`).
* - `ast` is the schema that was being validated against.
* - `annotations` on `ast` may contain a custom `messageUnexpectedKey`.
*
* @see {@link MissingKey} — the opposite case (required key absent)
* @see {@link Pointer} — wraps this issue with the unexpected key's path
*
* @category model
* @since 4.0.0
*/
var UnexpectedKey = class extends Base$1 {
	_tag = "UnexpectedKey";
	/**
	* The schema that caused the issue.
	*/
	ast;
	/**
	* The input value that caused the issue.
	*/
	actual;
	constructor(ast, actual) {
		super();
		this.ast = ast;
		this.actual = actual;
	}
};
/**
* Issue that groups multiple child issues under a single schema node.
*
* When to use:
*
* - Walk the issue tree for struct/tuple schemas that collect all field errors
*   rather than failing on the first.
* - Match on `_tag === "Composite"` to iterate over `issues`.
*
* Behaviour:
*
* - `issues` is a non-empty readonly array (at least one child).
* - `actual` is `Option.some(value)` when the input was present, or
*   `Option.none()` when absent.
* - Formatters flatten `Composite` by recursing into each child.
*
* @see {@link AnyOf} — used for union no-match errors (similar but different semantics)
* @see {@link Pointer} — adds path context to individual issues
*
* @category model
* @since 4.0.0
*/
var Composite = class extends Base$1 {
	_tag = "Composite";
	/**
	* The schema that caused the issue.
	*/
	ast;
	/**
	* The input value that caused the issue.
	*/
	actual;
	/**
	* The issues that occurred.
	*/
	issues;
	constructor(ast, actual, issues) {
		super();
		this.ast = ast;
		this.actual = actual;
		this.issues = issues;
	}
};
/**
* Issue produced when the runtime type of the input does not match the type
* expected by the schema (e.g. got `null` when `string` was expected).
*
* When to use:
*
* - Detect basic type mismatches (wrong primitive, null where object expected,
*   etc.).
* - The most common leaf issue in typical validation failures.
*
* Behaviour:
*
* - `ast` is the schema node that expected a different type.
* - `actual` is `Option.some(value)` when the input was present, or
*   `Option.none()` when no value was provided.
* - The default formatter renders this as `"Expected <type>, got <actual>"`.
*
* **Example** (Formatted output)
*
* ```ts
* import { Schema } from "effect"
*
* try {
*   Schema.decodeUnknownSync(Schema.String)(42)
* } catch (e) {
*   if (Schema.isSchemaError(e)) {
*     console.log(String(e.issue))
*     // "Expected string, got 42"
*   }
* }
* ```
*
* @see {@link InvalidValue} — the input has the right type but fails a value constraint
*
* @category model
* @since 4.0.0
*/
var InvalidType = class extends Base$1 {
	_tag = "InvalidType";
	/**
	* The schema that caused the issue.
	*/
	ast;
	/**
	* The input value that caused the issue.
	*/
	actual;
	constructor(ast, actual) {
		super();
		this.ast = ast;
		this.actual = actual;
	}
};
/**
* Issue produced when the input has the correct type but its value violates a
* constraint (e.g. a string that is too short, a number out of range).
*
* When to use:
*
* - Detect constraint violations from `Schema.filter`, `Schema.minLength`,
*   `Schema.greaterThan`, etc.
* - Create custom validation errors in `Schema.makeFilter` callbacks.
*
* Behaviour:
*
* - `actual` is `Option.some(value)` when the failing value is known, or
*   `Option.none()` when absent.
* - `annotations` optionally carries a `message` string for formatting.
* - The default formatter renders this as `"Invalid data <actual>"` unless a
*   custom `message` annotation is provided.
*
* **Example** (Custom filter returning InvalidValue)
*
* ```ts
* import { Option, SchemaIssue } from "effect"
*
* const issue = new SchemaIssue.InvalidValue(
*   Option.some(""),
*   { message: "must not be empty" }
* )
* console.log(String(issue))
* // "must not be empty"
* ```
*
* @see {@link InvalidType} — the input has the wrong type entirely
* @see {@link Filter} — composite wrapper when a schema filter produces this issue
*
* @category model
* @since 4.0.0
*/
var InvalidValue = class extends Base$1 {
	_tag = "InvalidValue";
	/**
	* The value that caused the issue.
	*/
	actual;
	/**
	* The metadata for the issue.
	*/
	annotations;
	constructor(actual, annotations) {
		super();
		this.actual = actual;
		this.annotations = annotations;
	}
};
/**
* Issue produced when a forbidden operation is encountered during parsing,
* such as an asynchronous Effect running inside `Schema.decodeUnknownSync`.
*
* When to use:
*
* - Detect that a schema requires async execution but was run synchronously.
* - Provide custom error messages via the `annotations.message` field.
*
* Behaviour:
*
* - `actual` is `Option.some(value)` when the input is known, or
*   `Option.none()` when absent.
* - `annotations` optionally carries a `message` string.
* - The default formatter renders this as `"Forbidden operation"`.
*
* **Example** (Creating a Forbidden issue)
*
* ```ts
* import { Option, SchemaIssue } from "effect"
*
* const issue = new SchemaIssue.Forbidden(
*   Option.none(),
*   { message: "async operation not allowed in sync context" }
* )
* console.log(String(issue))
* // "async operation not allowed in sync context"
* ```
*
* @see {@link InvalidValue} — for value-constraint failures (not operation failures)
*
* @category model
* @since 4.0.0
*/
var Forbidden = class extends Base$1 {
	_tag = "Forbidden";
	/**
	* The input value that caused the issue.
	*/
	actual;
	/**
	* The metadata for the issue.
	*/
	annotations;
	constructor(actual, annotations) {
		super();
		this.actual = actual;
		this.annotations = annotations;
	}
};
/**
* Issue produced when a value does not match *any* member of a union schema.
*
* When to use:
*
* - Inspect which union members were attempted and why each failed.
* - `issues` may be empty when the union has no members or when the input does
*   not pass the initial type guard.
*
* Behaviour:
*
* - `ast` is the `Union` AST node.
* - `actual` is the raw input value (plain `unknown`).
* - `issues` contains per-member failures. When empty, the formatter falls
*   back to the union's `expected` annotation.
*
* @see {@link OneOf} — the opposite: *too many* members matched
* @see {@link Composite} — groups multiple issues under a non-union schema
*
* @category model
* @since 4.0.0
*/
var AnyOf = class extends Base$1 {
	_tag = "AnyOf";
	/**
	* The schema that caused the issue.
	*/
	ast;
	/**
	* The input value that caused the issue.
	*/
	actual;
	/**
	* The issues that occurred.
	*/
	issues;
	constructor(ast, actual, issues) {
		super();
		this.ast = ast;
		this.actual = actual;
		this.issues = issues;
	}
};
/**
* Issue produced when a value matches *multiple* members of a union that is
* configured to allow exactly one match (oneOf mode).
*
* When to use:
*
* - Detect ambiguous union matches when `oneOf` validation is enabled.
* - Inspect `successes` to see which members matched.
*
* Behaviour:
*
* - `ast` is the `Union` AST node.
* - `actual` is the raw input value (plain `unknown`).
* - `successes` lists the AST nodes of each member that accepted the input.
* - The default formatter renders this as
*   `"Expected exactly one member to match the input <actual>"`.
*
* @see {@link AnyOf} — the opposite: *no* members matched
*
* @category model
* @since 4.0.0
*/
var OneOf = class extends Base$1 {
	_tag = "OneOf";
	/**
	* The schema that caused the issue.
	*/
	ast;
	/**
	* The input value that caused the issue.
	*/
	actual;
	/**
	* The schemas that were successful.
	*/
	successes;
	constructor(ast, actual, successes) {
		super();
		this.ast = ast;
		this.actual = actual;
		this.successes = successes;
	}
};
/** @internal */
function make$3(input, out) {
	if (isIssue(out)) return out;
	if (out === void 0) return;
	if (typeof out === "boolean") return out ? void 0 : new InvalidValue(some(input));
	if (typeof out === "string") return new InvalidValue(some(input), { message: out });
	return new Pointer(out.path, new InvalidValue(some(input), { message: out.message }));
}
/**
* The built-in {@link LeafHook} used by default formatters.
*
* When to use:
*
* - Use as-is when you only need to customise the {@link CheckHook} but want
*   the default leaf rendering.
* - Reference as a starting point for custom `LeafHook` implementations.
*
* Behaviour:
*
* - Checks for a `message` annotation first; returns it if present.
* - Otherwise generates a default message per `_tag`:
*   - `InvalidType` → `"Expected <type>, got <actual>"`
*   - `InvalidValue` → `"Invalid data <actual>"`
*   - `MissingKey` → `"Missing key"`
*   - `UnexpectedKey` → `"Unexpected key with value <actual>"`
*   - `Forbidden` → `"Forbidden operation"`
*   - `OneOf` → `"Expected exactly one member to match the input <actual>"`
*
* **Example** (Using defaultLeafHook with Standard Schema formatter)
*
* ```ts
* import { SchemaIssue } from "effect"
*
* const formatter = SchemaIssue.makeFormatterStandardSchemaV1({
*   leafHook: SchemaIssue.defaultLeafHook
* })
* ```
*
* @see {@link LeafHook}
* @see {@link makeFormatterStandardSchemaV1}
*
* @category Formatter
* @since 4.0.0
*/
const defaultLeafHook = (issue) => {
	const message = findMessage(issue);
	if (message !== void 0) return message;
	switch (issue._tag) {
		case "InvalidType": return getExpectedMessage(getExpected(issue.ast), formatOption(issue.actual));
		case "InvalidValue": return `Invalid data ${formatOption(issue.actual)}`;
		case "MissingKey": return "Missing key";
		case "UnexpectedKey": return `Unexpected key with value ${format$2(issue.actual)}`;
		case "Forbidden": return "Forbidden operation";
		case "OneOf": return `Expected exactly one member to match the input ${format$2(issue.actual)}`;
	}
};
/**
* The built-in {@link CheckHook} used by default formatters.
*
* When to use:
*
* - Use as-is when you only need to customise the {@link LeafHook} but want
*   the default filter rendering.
*
* Behaviour:
*
* - Looks for a `message` annotation on the inner issue first, then on the
*   filter itself.
* - Returns `undefined` when no annotation is found, causing the formatter to
*   fall back to `"Expected <filter>, got <actual>"`.
*
* @see {@link CheckHook}
* @see {@link makeFormatterStandardSchemaV1}
*
* @category Formatter
* @since 4.0.0
*/
const defaultCheckHook = (issue) => {
	return findMessage(issue.issue) ?? findMessage(issue);
};
function getExpectedMessage(expected, actual) {
	return `Expected ${expected}, got ${actual}`;
}
function toDefaultIssues(issue, path, leafHook, checkHook) {
	switch (issue._tag) {
		case "Filter": {
			const message = checkHook(issue);
			if (message !== void 0) return [{
				path,
				message
			}];
			switch (issue.issue._tag) {
				case "InvalidValue": return [{
					path,
					message: getExpectedMessage(formatCheck(issue.filter), format$2(issue.actual))
				}];
				default: return toDefaultIssues(issue.issue, path, leafHook, checkHook);
			}
		}
		case "Encoding": return toDefaultIssues(issue.issue, path, leafHook, checkHook);
		case "Pointer": return toDefaultIssues(issue.issue, [...path, ...issue.path], leafHook, checkHook);
		case "Composite": return issue.issues.flatMap((issue) => toDefaultIssues(issue, path, leafHook, checkHook));
		case "AnyOf": {
			const message = findMessage(issue);
			if (issue.issues.length === 0) {
				if (message !== void 0) return [{
					path,
					message
				}];
				return [{
					path,
					message: getExpectedMessage(getExpected(issue.ast), format$2(issue.actual))
				}];
			}
			return issue.issues.flatMap((issue) => toDefaultIssues(issue, path, leafHook, checkHook));
		}
		default: return [{
			path,
			message: leafHook(issue)
		}];
	}
}
function formatCheck(check) {
	const expected = check.annotations?.expected;
	if (typeof expected === "string") return expected;
	switch (check._tag) {
		case "Filter": return "<filter>";
		case "FilterGroup": return check.checks.map((check) => formatCheck(check)).join(" & ");
	}
}
/**
* Creates a {@link Formatter} that converts an {@link Issue} into a
* human-readable multi-line string.
*
* When to use:
*
* - Produce error messages for logging, CLI output, or developer-facing
*   diagnostics.
* - This is the default formatter used by `Issue.toString()`.
*
* Behaviour:
*
* - Flattens the issue tree into `{ message, path }` entries using
*   {@link defaultLeafHook} and {@link defaultCheckHook}.
* - Each entry is rendered as `"<message>"` or `"<message>\n  at <path>"`.
* - Multiple entries are joined with newlines.
*
* **Example** (Formatting an issue as a string)
*
* ```ts
* import { SchemaIssue } from "effect"
*
* const formatter = SchemaIssue.makeFormatterDefault()
* ```
*
* @see {@link makeFormatterStandardSchemaV1} — produces Standard Schema V1 format instead
* @see {@link Formatter}
*
* @category Formatter
* @since 4.0.0
*/
function makeFormatterDefault() {
	return (issue) => toDefaultIssues(issue, [], defaultLeafHook, defaultCheckHook).map(formatDefaultIssue).join("\n");
}
/** @internal */
const defaultFormatter = /* @__PURE__ */ makeFormatterDefault();
function formatDefaultIssue(issue) {
	let out = issue.message;
	if (issue.path && issue.path.length > 0) {
		const path = formatPath(issue.path);
		out += `\n  at ${path}`;
	}
	return out;
}
function findMessage(issue) {
	switch (issue._tag) {
		case "InvalidType":
		case "OneOf":
		case "Composite":
		case "AnyOf": return getMessageAnnotation(issue.ast.annotations);
		case "InvalidValue":
		case "Forbidden": return getMessageAnnotation(issue.annotations);
		case "MissingKey": return getMessageAnnotation(issue.annotations, "messageMissingKey");
		case "UnexpectedKey": return getMessageAnnotation(issue.ast.annotations, "messageUnexpectedKey");
		case "Filter": return getMessageAnnotation(issue.filter.annotations);
		case "Encoding": return findMessage(issue.issue);
	}
}
function getMessageAnnotation(annotations, type = "message") {
	const message = annotations?.[type];
	if (typeof message === "string") return message;
}
function formatOption(actual) {
	if (isNone(actual)) return "no value provided";
	return format$2(actual.value);
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/SchemaGetter.js
/**
* Composable transformation primitives for the Effect Schema system.
*
* A `Getter<T, E, R>` represents a single-direction transformation from an
* encoded type `E` to a decoded type `T`. Getters are the building blocks
* that `Schema.decodeTo` and `Schema.decode` use to define how values are
* transformed during encoding and decoding. They handle optionality
* (`Option<E>` in, `Option<T>` out), can fail with `Issue`, and can require
* Effect services via `R`.
*
* ## Mental model
*
* - **Getter**: A function `Option<E> -> Effect<Option<T>, Issue, R>`. It
*   transforms an optional encoded value into an optional decoded value,
*   possibly failing or requiring services.
* - **Passthrough**: The identity getter — returns the input unchanged. Used
*   when no transformation is needed. Optimized away during composition.
* - **Option-awareness**: Getters receive and return `Option` to handle
*   missing keys in structs. `Option.None` means the key is absent.
* - **Composition**: Getters compose left-to-right via `.compose()`. A
*   passthrough on either side is a no-op (identity optimization).
* - **Issue**: The error type for all getter failures (see `SchemaIssue`).
*
* ## Common tasks
*
* - Pass a value through unchanged → {@link passthrough}
* - Transform a value purely → {@link transform}
* - Transform a value with possible failure → {@link transformOrFail}
* - Transform with full Option control → {@link transformOptional}
* - Handle missing keys → {@link onNone}, {@link required}, {@link withDefault}
* - Handle present values → {@link onSome}
* - Validate a value with an effectful check → {@link checkEffect}
* - Produce a constant value → {@link succeed}
* - Always fail → {@link fail}, {@link forbidden}
* - Omit a value from output → {@link omit}
* - Coerce to a primitive type → {@link String}, {@link Number}, {@link Boolean}, {@link BigInt}, {@link Date}
* - Transform strings → {@link trim}, {@link capitalize}, {@link toLowerCase}, {@link toUpperCase}, {@link split}, {@link splitKeyValue}, {@link joinKeyValue}
* - Parse/stringify JSON → {@link parseJson}, {@link stringifyJson}
* - Encode/decode Base64 → {@link encodeBase64}, {@link decodeBase64}, {@link decodeBase64String}
* - Encode/decode Hex → {@link encodeHex}, {@link decodeHex}, {@link decodeHexString}
* - Parse DateTime → {@link dateTimeUtcFromInput}
* - Decode/encode FormData → {@link decodeFormData}, {@link encodeFormData}
* - Decode/encode URLSearchParams → {@link decodeURLSearchParams}, {@link encodeURLSearchParams}
* - Build nested tree from bracket paths → {@link makeTreeRecord}
* - Flatten nested tree to bracket paths → {@link collectBracketPathEntries}
*
* ## Gotchas
*
* - Getters are not bidirectional. To define a full encode/decode pair, supply
*   both a `decode` and an `encode` getter to `Schema.decodeTo`.
* - `passthrough` requires `T === E` by default. Use `{ strict: false }` to
*   bypass the type constraint, or use {@link passthroughSupertype} / {@link passthroughSubtype}.
* - `transform` skips `None` inputs (missing keys) — the function is only
*   called when a value is present. Use `transformOptional` if you need to
*   handle missing values.
* - `parseJson` without a `reviver` returns `Schema.MutableJson`. With a
*   reviver, the return type widens to `unknown`.
* - `split` treats an empty string as an empty array, not `[""]`.
*
* ## Quickstart
*
* **Example** (Using SchemaGetter with Schema.decodeTo)
*
* ```ts
* import { Schema, SchemaGetter } from "effect"
*
* const NumberFromString = Schema.String.pipe(
*   Schema.decodeTo(Schema.Number, {
*     decode: SchemaGetter.transform((s) => Number(s)),
*     encode: SchemaGetter.transform((n) => String(n))
*   })
* )
*
* const result = Schema.decodeUnknownSync(NumberFromString)("42")
* // result: 42
* ```
*
* ## See also
*
* - {@link Getter} — the core class
* - {@link transform} — most common constructor
* - {@link passthrough} — identity getter
* - {@link transformOrFail} — fallible transformation
*
* @since 4.0.0
*/
/**
* A composable transformation from an encoded type `E` to a decoded type `T`.
*
* A Getter wraps a function `Option<E> -> Effect<Option<T>, Issue, R>`:
* - Receives `Option.None` when the encoded key is absent (e.g. missing struct field).
* - Returns `Option.None` to omit the value from the decoded output.
* - Fails with `Issue` on invalid input.
* - May require Effect services via `R`.
*
* Use this when:
* - Building custom schema transformations with `Schema.decodeTo` or `Schema.decode`.
* - Composing multiple transformation steps into a single getter.
*
* Behavior:
* - Immutable — constructing or composing getters does not mutate existing instances.
* - `.map(f)` applies `f` to the decoded value (inside the `Some`), leaving `None` unchanged.
* - `.compose(other)` chains two getters: the output of `this` feeds into `other`.
*   Passthrough getters on either side are optimized away.
*
* **Example** (Creating and composing getters)
*
* ```ts
* import { SchemaGetter } from "effect"
*
* const parseNumber = SchemaGetter.transform<number, string>((s) => Number(s))
* const double = SchemaGetter.transform<number, number>((n) => n * 2)
* const composed = parseNumber.compose(double)
* // composed: Getter<number, string> — parses then doubles
* ```
*
* See also:
* - {@link transform} — create a getter from a pure function
* - {@link passthrough} — identity getter
* - {@link transformOrFail} — fallible transformation
*
* @category model
* @since 4.0.0
*/
var Getter = class Getter extends Class$1 {
	run;
	constructor(run) {
		super();
		this.run = run;
	}
	map(f) {
		return new Getter((oe, options) => this.run(oe, options).pipe(mapEager(map$5(f))));
	}
	compose(other) {
		if (isPassthrough(this)) return other;
		if (isPassthrough(other)) return this;
		return new Getter((oe, options) => this.run(oe, options).pipe(flatMapEager((ot) => other.run(ot, options))));
	}
};
const passthrough_$1 = /* @__PURE__ */ new Getter(succeed);
function isPassthrough(getter) {
	return getter.run === passthrough_$1.run;
}
function passthrough$1() {
	return passthrough_$1;
}
/**
* Creates a getter that handles present values (`Option.Some`), passing `None` through.
*
* Use this when:
* - You need to transform or validate only when a value is present.
* - Missing keys should remain absent in the output.
*
* Behavior:
* - When input is `None`, returns `None` (no-op).
* - When input is `Some(e)`, calls `f(e, options)` to produce the result.
* - `f` may return `None` to omit the value, or fail with an `Issue`.
*
* **Example** (Transform only present values)
*
* ```ts
* import { SchemaGetter, Effect, Option } from "effect"
*
* const parseIfPresent = SchemaGetter.onSome<number, string>(
*   (s) => Effect.succeed(Option.some(Number(s)))
* )
* ```
*
* See also:
* - {@link onNone} — handle only absent values
* - {@link transform} — simpler pure transformation of present values
* - {@link transformOrFail} — fallible transformation of present values
*
* @category Constructors
* @since 4.0.0
*/
function onSome(f) {
	return new Getter((oe, options) => isNone(oe) ? succeedNone : f(oe.value, options));
}
/**
* Creates a getter that applies a pure function to present values.
*
* This is the most commonly used constructor. It transforms `Some(e)` to
* `Some(f(e))` and leaves `None` unchanged.
*
* Use this when:
* - You have a pure, infallible transformation between types.
* - Building encode/decode pairs for `Schema.decodeTo`.
*
* Behavior:
* - Pure, does not mutate input.
* - Skips `None` inputs — only called when a value is present.
* - Never fails.
*
* **Example** (String to number transformation pair)
*
* ```ts
* import { Schema, SchemaGetter } from "effect"
*
* const NumberFromString = Schema.String.pipe(
*   Schema.decodeTo(Schema.Number, {
*     decode: SchemaGetter.transform((s) => Number(s)),
*     encode: SchemaGetter.transform((n) => String(n))
*   })
* )
* ```
*
* See also:
* - {@link transformOrFail} — when the transformation can fail
* - {@link transformOptional} — when you need to handle `None` inputs
* - {@link passthrough} — when no transformation is needed
*
* @category Constructors
* @since 4.0.0
*/
function transform$1(f) {
	return transformOptional(map$5(f));
}
/**
* Creates a getter that applies a fallible, effectful transformation to present values.
*
* Use this when:
* - The transformation may fail (e.g. parsing, validation).
* - The transformation needs Effect services or is async.
*
* Behavior:
* - Skips `None` inputs — only called when a value is present.
* - On success, wraps the result in `Some`.
* - On failure, propagates the `Issue`.
*
* **Example** (Parsing with failure)
*
* ```ts
* import { SchemaGetter, SchemaIssue, Effect, Option } from "effect"
*
* const safeParseInt = SchemaGetter.transformOrFail<number, string>(
*   (s) => {
*     const n = parseInt(s, 10)
*     return isNaN(n)
*       ? Effect.fail(new SchemaIssue.InvalidValue(Option.some(s), { message: "not an integer" }))
*       : Effect.succeed(n)
*   }
* )
* ```
*
* See also:
* - {@link transform} — when transformation cannot fail
* - {@link onSome} — when you need full `Option` control over the output
*
* @category Constructors
* @since 4.0.0
*/
function transformOrFail$1(f) {
	return onSome((e, options) => f(e, options).pipe(mapEager(some)));
}
/**
* Creates a getter that transforms the full `Option` — both present and absent values.
*
* Use this when:
* - You need to handle both `Some` and `None` cases.
* - You want to turn a present value into absent, or vice versa.
*
* Behavior:
* - Pure, never fails.
* - Receives the full `Option<E>` and must return `Option<T>`.
*
* **Example** (Filter out empty strings)
*
* ```ts
* import { SchemaGetter, Option } from "effect"
*
* const skipEmpty = SchemaGetter.transformOptional<string, string>((o) =>
*   Option.filter(o, (s) => s.length > 0)
* )
* ```
*
* See also:
* - {@link transform} — simpler, only handles present values
* - {@link omit} — always returns `None`
*
* @category Constructors
* @since 4.0.0
*/
function transformOptional(f) {
	return new Getter((oe) => succeed(f(oe)));
}
/**
* Coerces any value to a `string` using the global `String()` constructor.
*
* Use this when:
* - You need a string representation of an arbitrary encoded value.
*
* Behavior:
* - Pure, never fails.
* - Delegates to `globalThis.String`.
*
* **Example** (Coerce to string)
*
* ```ts
* import { SchemaGetter } from "effect"
*
* const toString = SchemaGetter.String<number>()
* // Getter<string, number>
* ```
*
* See also:
* - {@link transform} — for custom string conversions
*
* @category Coercions
* @since 4.0.0
*/
function String$3() {
	return transform$1(globalThis.String);
}
/**
* Coerces any value to a `number` using the global `Number()` constructor.
*
* Use this when:
* - You need numeric coercion of an encoded value.
*
* Behavior:
* - Pure, never fails (may produce `NaN` for non-numeric inputs).
* - Delegates to `globalThis.Number`.
*
* **Example** (Coerce to number)
*
* ```ts
* import { SchemaGetter } from "effect"
*
* const toNumber = SchemaGetter.Number<string>()
* // Getter<number, string>
* ```
*
* See also:
* - {@link transformOrFail} — for validated number parsing
*
* @category Coercions
* @since 4.0.0
*/
function Number$3() {
	return transform$1(globalThis.Number);
}
/**
* Encodes a `Uint8Array` or string to a Base64 string.
*
* Behavior:
* - Pure, never fails.
*
* **Example** (Encode to Base64)
*
* ```ts
* import { SchemaGetter } from "effect"
*
* const encode = SchemaGetter.encodeBase64<Uint8Array>()
* ```
*
* See also:
* - {@link decodeBase64} — inverse (to `Uint8Array`)
* - {@link decodeBase64String} — inverse (to `string`)
* - {@link encodeBase64Url} — URL-safe variant
*
* @category Base64
* @since 4.0.0
*/
function encodeBase64() {
	return transform$1(encode);
}
/**
* Decodes a Base64 string to a `Uint8Array`.
*
* Behavior:
* - Fails with `Issue.InvalidValue` if the input is not valid Base64.
*
* **Example** (Decode Base64 to bytes)
*
* ```ts
* import { SchemaGetter } from "effect"
*
* const decode = SchemaGetter.decodeBase64<string>()
* // Getter<Uint8Array, string>
* ```
*
* See also:
* - {@link decodeBase64String} — decode to `string` instead
* - {@link encodeBase64} — inverse operation
*
* @category Base64
* @since 4.0.0
*/
function decodeBase64() {
	return transformOrFail$1((input) => mapError$3(decode(input), (e) => new InvalidValue(some(input), { message: e.message })).asEffect());
}
/**
* Parses a `DateTime.Input` value (string, number, or Date) into a `DateTime.Utc`.
*
* Use this when:
* - An encoded value represents a date/time and should be decoded to a `DateTime.Utc`.
*
* Behavior:
* - Fails with `Issue.InvalidValue` if the input cannot be parsed as a valid DateTime.
*
* **Example** (Parse DateTime)
*
* ```ts
* import { SchemaGetter } from "effect"
*
* const parseDate = SchemaGetter.dateTimeUtcFromInput<string>()
* // Getter<DateTime.Utc, string>
* ```
*
* See also:
* - {@link Date} — simpler coercion to `Date` (no validation)
*
* @category DateTime
* @since 4.0.0
*/
function dateTimeUtcFromInput() {
	return transformOrFail$1((input) => {
		const dt = make$4(input);
		return dt ? succeed(toUtc(dt)) : fail(new InvalidValue(some(input), { message: "Invalid DateTime input" }));
	});
}
const collectURLSearchParamsEntries = /* @__PURE__ */ collectBracketPathEntries(isString);
/**
* Flattens a nested object into bracket-path entries, filtering leaf values by a type guard.
*
* This is the inverse of {@link makeTreeRecord}. It takes a nested object and produces
* flat `[bracketPath, value]` pairs suitable for `FormData` or `URLSearchParams`.
*
* Use this when:
* - Serializing structured objects to flat key-value entries.
* - Building custom `FormData` or `URLSearchParams` encoders.
*
* Behavior:
* - Returns a curried function: first call provides the leaf type guard, second call provides the object.
* - Recursively traverses objects and arrays.
* - If all elements of an array are leaves, encodes them as multiple entries with the same key
*   (e.g. `tags=a&tags=b`). Otherwise uses indexed bracket paths (e.g. `items[0]`, `items[1]`).
* - Non-leaf values that aren't objects or arrays are silently skipped.
*
* **Example** (Flatten object to bracket paths)
*
* ```ts
* import { SchemaGetter, Predicate } from "effect"
*
* const collectStrings = SchemaGetter.collectBracketPathEntries(Predicate.isString)
* const entries = collectStrings({ user: { name: "Alice", tags: ["admin", "editor"] } })
* // [["user[name]", "Alice"], ["user[tags]", "admin"], ["user[tags]", "editor"]]
* ```
*
* See also:
* - {@link makeTreeRecord} — inverse operation (flat entries to tree)
* - {@link encodeFormData} — uses this internally
* - {@link encodeURLSearchParams} — uses this internally
*
* @category Tree
* @since 4.0.0
*/
function collectBracketPathEntries(isLeaf) {
	return (input) => {
		const bracketPathEntries = [];
		function append(key, value) {
			if (isLeaf(value)) bracketPathEntries.push([key, value]);
			else if (Array.isArray(value)) if (value.every(isLeaf)) value.forEach((v) => {
				bracketPathEntries.push([key, v]);
			});
			else value.forEach((v, i) => {
				append(`${key}[${i}]`, v);
			});
			else if (typeof value === "object" && value !== null) for (const [k, v] of Object.entries(value)) append(`${key}[${k}]`, v);
		}
		for (const [key, value] of Object.entries(input)) append(key, value);
		return bracketPathEntries;
	};
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/SchemaTransformation.js
/**
* Bidirectional transformations for the Effect Schema system.
*
* A `Transformation` pairs a decode `Getter` and an encode `Getter` into a
* single bidirectional value, used by `Schema.decodeTo`, `Schema.encodeTo`,
* `Schema.decode`, `Schema.encode`, and `Schema.link` to define how values
* are converted between encoded and decoded representations. A `Middleware`
* is the effect-level equivalent — it wraps the entire parsing `Effect`
* pipeline rather than individual values.
*
* ## Mental model
*
* - **Transformation**: A pair of `Getter`s (decode + encode) that convert
*   individual values bidirectionally. `T` is the decoded (Type) side, `E` is
*   the encoded side. `RD`/`RE` are required Effect services.
* - **Middleware**: Like `Transformation`, but each direction receives the full
*   parsing `Effect` and can intercept, retry, or modify the pipeline.
* - **Getter**: A single-direction transform `Option<E> → Effect<Option<T>, Issue, R>`
*   (see `SchemaGetter`).
* - **flip()**: Swaps decode and encode, turning a `Transformation<T, E>` into
*   `Transformation<E, T>`.
* - **compose()**: Chains two transformations left-to-right on the decode side
*   and right-to-left on the encode side.
* - **passthrough**: The identity transformation — no conversion in either
*   direction.
*
* ## Common tasks
*
* - Convert values purely (sync, infallible) → {@link transform}
* - Convert values with possible failure → {@link transformOrFail}
* - Handle optional/missing keys → {@link transformOptional}
* - Build from existing Getters → {@link make}
* - No-op identity transformation → {@link passthrough}
* - Subtype/supertype coercion → {@link passthroughSupertype}, {@link passthroughSubtype}
* - Trim/case strings → {@link trim}, {@link toLowerCase}, {@link toUpperCase}, {@link capitalize}, {@link uncapitalize}, {@link snakeToCamel}
* - Parse key-value strings → {@link splitKeyValue}
* - Coerce string ↔ number/bigint → {@link numberFromString}, {@link bigintFromString}
* - Decode durations → {@link durationFromNanos}, {@link durationFromMillis}
* - Wrap nullable/optional as Option → {@link optionFromNullOr}, {@link optionFromOptionalKey}, {@link optionFromOptional}
* - Parse URLs → {@link urlFromString}
* - Base64 ↔ Uint8Array → {@link uint8ArrayFromBase64String}
* - JSON string ↔ unknown → {@link fromJsonString}
* - FormData/URLSearchParams ↔ unknown → {@link fromFormData}, {@link fromURLSearchParams}
* - Check if a value is a Transformation → {@link isTransformation}
*
* ## Gotchas
*
* - `Transformation` operates on individual values; `Middleware` wraps the
*   entire parsing Effect. Choose accordingly.
* - `passthrough` requires `T === E` by default. Use `{ strict: false }` to
*   bypass, or use {@link passthroughSupertype} / {@link passthroughSubtype}.
* - String transformations like `trim`, `toLowerCase`, and `toUpperCase` use
*   `passthrough` on the encode side — they are lossy and do not round-trip.
* - `durationFromNanos` encode can fail if the Duration cannot be represented
*   as a `bigint`.
*
* ## Quickstart
*
* **Example** (Defining a custom transformation with Schema.decodeTo)
*
* ```ts
* import { Schema, SchemaTransformation } from "effect"
*
* const CentsFromDollars = Schema.Number.pipe(
*   Schema.decodeTo(
*     Schema.Number,
*     SchemaTransformation.transform({
*       decode: (dollars) => dollars * 100,
*       encode: (cents) => cents / 100
*     })
*   )
* )
* ```
*
* ## See also
*
* - {@link Transformation} — the core bidirectional transformation class
* - {@link Middleware} — effect-pipeline-level transformation
* - {@link transform} — most common constructor
* - {@link passthrough} — identity transformation
*
* @since 4.0.0
*/
const TypeId$3 = "~effect/SchemaTransformation/Transformation";
/**
* A bidirectional transformation between a decoded type `T` and an encoded
* type `E`, built from a pair of `Getter`s.
*
* This is the primary building block for `Schema.decodeTo`, `Schema.encodeTo`,
* `Schema.decode`, `Schema.encode`, and `Schema.link`. Each direction is a
* `SchemaGetter.Getter` that handles optionality, failure, and Effect services.
*
* When to use this:
* - You need to define how a schema converts between two representations.
* - You want to compose multiple transformations into a pipeline.
* - You want to flip a transformation to swap decode/encode.
*
* Behavior:
* - Immutable — `flip()` and `compose()` return new instances.
* - `flip()` swaps the decode and encode getters.
* - `compose(other)` chains: `this.decode` then `other.decode` for decoding,
*   `other.encode` then `this.encode` for encoding.
*
* **Example** (Composing two transformations)
*
* ```ts
* import { SchemaTransformation } from "effect"
*
* const trimAndLower = SchemaTransformation.trim().compose(
*   SchemaTransformation.toLowerCase()
* )
* // decode: trim then lowercase
* // encode: passthrough (both directions)
* ```
*
* See also:
* - {@link make} — construct from `{ decode, encode }` getters
* - {@link transform} — construct from pure functions
* - {@link transformOrFail} — construct from effectful functions
* - {@link Middleware} — effect-pipeline-level alternative
*
* @category model
* @since 4.0.0
*/
var Transformation = class Transformation {
	[TypeId$3] = TypeId$3;
	_tag = "Transformation";
	decode;
	encode;
	constructor(decode, encode) {
		this.decode = decode;
		this.encode = encode;
	}
	flip() {
		return new Transformation(this.encode, this.decode);
	}
	compose(other) {
		return new Transformation(this.decode.compose(other.decode), other.encode.compose(this.encode));
	}
};
/**
* Returns `true` if `u` is a `Transformation` instance.
*
* When to use this:
* - Checking whether a value is already a Transformation before wrapping it.
*
* Behavior:
* - Pure predicate, no side effects.
* - Acts as a TypeScript type guard.
*
* **Example** (Checking a value)
*
* ```ts
* import { SchemaTransformation } from "effect"
*
* SchemaTransformation.isTransformation(SchemaTransformation.trim())
* // true
*
* SchemaTransformation.isTransformation({ decode: null, encode: null })
* // false
* ```
*
* See also:
* - {@link Transformation}
* - {@link make}
*
* @since 4.0.0
*/
function isTransformation(u) {
	return hasProperty(u, TypeId$3);
}
/**
* Constructs a `Transformation` from an object with `decode` and `encode`
* `Getter`s. If the input is already a `Transformation`, returns it as-is.
*
* When to use this:
* - You already have `Getter` instances and want to pair them.
* - You want idempotent wrapping (won't double-wrap).
*
* Behavior:
* - Does not mutate the input.
* - Returns the input unchanged if it is already a `Transformation`.
*
* **Example** (Wrapping existing getters)
*
* ```ts
* import { SchemaGetter, SchemaTransformation } from "effect"
*
* const t = SchemaTransformation.make({
*   decode: SchemaGetter.transform<number, string>((s) => Number(s)),
*   encode: SchemaGetter.transform<string, number>((n) => String(n))
* })
* ```
*
* See also:
* - {@link transform} — simpler constructor from pure functions
* - {@link transformOrFail} — constructor from effectful functions
* - {@link Transformation}
*
* @since 4.0.0
*/
const make$2 = (options) => {
	if (isTransformation(options)) return options;
	return new Transformation(options.decode, options.encode);
};
/**
* Creates a `Transformation` from effectful decode and encode functions that
* can fail with `Issue`.
*
* When to use this:
* - The transformation can fail (e.g. parsing, validation).
* - The transformation requires Effect services.
*
* Behavior:
* - Each function receives the input value and `ParseOptions`.
* - Must return an `Effect` that succeeds with the output or fails with `Issue`.
* - Skips `None` inputs (missing keys) — functions are only called on present values.
*
* **Example** (Parsing a date string that can fail)
*
* ```ts
* import { Effect, Option, Schema, SchemaIssue, SchemaTransformation } from "effect"
*
* const DateFromString = Schema.String.pipe(
*   Schema.decodeTo(
*     Schema.Date,
*     SchemaTransformation.transformOrFail({
*       decode: (s) => {
*         const d = new Date(s)
*         return isNaN(d.getTime())
*           ? Effect.fail(new SchemaIssue.InvalidValue(Option.some(s), { message: "Invalid date" }))
*           : Effect.succeed(d)
*       },
*       encode: (d) => Effect.succeed(d.toISOString())
*     })
*   )
* )
* ```
*
* See also:
* - {@link transform} — for infallible, pure transformations
* - {@link transformOptional} — for transformations that handle missing keys
* - {@link make} — for transformations from existing Getters
*
* @since 4.0.0
*/
function transformOrFail(options) {
	return new Transformation(transformOrFail$1(options.decode), transformOrFail$1(options.encode));
}
/**
* Creates a `Transformation` from pure (sync, infallible) decode and encode
* functions.
*
* When to use this:
* - The conversion cannot fail.
* - No Effect services are needed.
*
* Behavior:
* - Each function receives the input and returns the output directly.
* - Skips `None` inputs (missing keys) — functions are only called on present values.
* - Does not allocate Effects internally; uses optimized sync path.
*
* **Example** (Converting between cents and dollars)
*
* ```ts
* import { Schema, SchemaTransformation } from "effect"
*
* const CentsFromDollars = Schema.Number.pipe(
*   Schema.decodeTo(
*     Schema.Number,
*     SchemaTransformation.transform({
*       decode: (dollars) => dollars * 100,
*       encode: (cents) => cents / 100
*     })
*   )
* )
* ```
*
* See also:
* - {@link transformOrFail} — for fallible or effectful transformations
* - {@link transformOptional} — for transformations that handle missing keys
* - {@link passthrough} — when no conversion is needed
*
* @since 4.0.0
*/
function transform(options) {
	return new Transformation(transform$1(options.decode), transform$1(options.encode));
}
const passthrough_ = /* @__PURE__ */ new Transformation(/* @__PURE__ */ passthrough$1(), /* @__PURE__ */ passthrough$1());
function passthrough() {
	return passthrough_;
}
/**
* Decodes a `string` into a `number` and encodes a `number` back to a
* `string`.
*
* When to use this:
* - Parsing numeric strings from APIs, form data, or URL parameters.
*
* Behavior:
* - Decode: coerces the string to a number (like `Number(s)`).
* - Encode: coerces the number to a string (like `String(n)`).
* - Does not validate that the result is finite — combine with
*   `Schema.Finite` or `Schema.Int` for stricter checks.
*
* **Example** (Number from string)
*
* ```ts
* import { Schema, SchemaTransformation } from "effect"
*
* const schema = Schema.String.pipe(
*   Schema.decodeTo(Schema.Number, SchemaTransformation.numberFromString)
* )
* ```
*
* See also:
* - {@link bigintFromString}
* - {@link transform}
*
* @category Coercions
* @since 4.0.0
*/
const numberFromString = /* @__PURE__ */ new Transformation(/* @__PURE__ */ Number$3(), /* @__PURE__ */ String$3());
/**
* Decodes a `bigint` (nanoseconds) into a `Duration` and encodes a
* `Duration` back to `bigint` nanoseconds.
*
* When to use this:
* - Working with nanosecond-precision timestamps or intervals.
*
* Behavior:
* - Decode: always succeeds, creating a Duration from nanoseconds.
* - Encode: fails with `InvalidValue` if the Duration cannot be represented
*   as a `bigint` (e.g. `Duration.infinity`).
*
* **Example** (Duration from nanoseconds)
*
* ```ts
* import { Schema, SchemaTransformation } from "effect"
*
* const schema = Schema.BigInt.pipe(
*   Schema.decodeTo(Schema.Duration, SchemaTransformation.durationFromNanos)
* )
* ```
*
* See also:
* - {@link durationFromMillis}
*
* @since 4.0.0
*/
const durationFromNanos = /* @__PURE__ */ transformOrFail({
	decode: (i) => succeed(nanos(i)),
	encode: (a) => {
		const nanos = toNanos(a);
		if (isUndefined(nanos)) return fail(new InvalidValue(some(a), { message: `Unable to encode ${a} into a bigint` }));
		return succeed(nanos);
	}
});
/**
* Decodes a `number` (milliseconds) into a `Duration` and encodes a
* `Duration` back to `number` milliseconds.
*
* When to use this:
* - Working with millisecond-precision timestamps (e.g. `Date.now()`).
*
* Behavior:
* - Decode: creates a Duration from milliseconds. Always succeeds.
* - Encode: converts a Duration to milliseconds. Always succeeds.
*
* **Example** (Duration from milliseconds)
*
* ```ts
* import { Schema, SchemaTransformation } from "effect"
*
* const schema = Schema.Number.pipe(
*   Schema.decodeTo(Schema.Duration, SchemaTransformation.durationFromMillis)
* )
* ```
*
* See also:
* - {@link durationFromNanos}
*
* @since 4.0.0
*/
const durationFromMillis = /* @__PURE__ */ transform({
	decode: (i) => millis(i),
	encode: (a) => toMillis(a)
});
/** @internal */
const errorFromErrorJsonEncoded = (options) => transform({
	decode: (i) => {
		const err = new Error(i.message);
		if (typeof i.name === "string" && i.name !== "Error") err.name = i.name;
		if (typeof i.stack === "string") err.stack = i.stack;
		return err;
	},
	encode: (a) => {
		const e = {
			name: a.name,
			message: a.message
		};
		if (options?.includeStack && typeof a.stack === "string") e.stack = a.stack;
		return e;
	}
});
/**
* Decodes a `string` into a `URL` and encodes a `URL` back to its `href`
* string.
*
* When to use this:
* - Parsing URL strings from user input or API responses.
*
* Behavior:
* - Decode: calls `new URL(s)`. Fails with `InvalidValue` if the string
*   is not a valid URL.
* - Encode: returns `url.href`.
*
* **Example** (URL from string)
*
* ```ts
* import { Schema, SchemaTransformation } from "effect"
*
* const schema = Schema.String.pipe(
*   Schema.decodeTo(Schema.URL, SchemaTransformation.urlFromString)
* )
* ```
*
* See also:
* - {@link numberFromString}
* - {@link transformOrFail}
*
* @since 4.0.0
*/
const urlFromString = /* @__PURE__ */ transformOrFail({
	decode: (s) => try_({
		try: () => new URL(s),
		catch: (e) => new InvalidValue(some(s), { message: globalThis.String(e) })
	}),
	encode: (url) => succeed(url.href)
});
/**
* Decodes a Base64-encoded `string` into a `Uint8Array` and encodes a
* `Uint8Array` back to a Base64 string.
*
* When to use this:
* - Handling binary data transmitted as Base64 strings (e.g. file uploads,
*   API payloads).
*
* Behavior:
* - Decode: parses the Base64 string into bytes.
* - Encode: encodes the byte array as a Base64 string.
*
* **Example** (Uint8Array from Base64)
*
* ```ts
* import { Schema, SchemaTransformation } from "effect"
*
* const schema = Schema.String.pipe(
*   Schema.decodeTo(Schema.Uint8Array, SchemaTransformation.uint8ArrayFromBase64String)
* )
* ```
*
* See also:
* - {@link fromJsonString}
*
* @since 4.0.0
*/
const uint8ArrayFromBase64String = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeBase64(), /* @__PURE__ */ encodeBase64());

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/SchemaAST.js
/**
* Abstract Syntax Tree (AST) representation for Effect schemas.
*
* This module defines the runtime data structures that represent schemas.
* Most users work with the `Schema` module directly; use `SchemaAST` when you
* need to inspect, traverse, or programmatically transform schema definitions.
*
* ## Mental model
*
* - **{@link AST}** — discriminated union (`_tag`) of all schema node types
*   (e.g. `String`, `Objects`, `Union`, `Suspend`)
* - **{@link Base}** — abstract base class shared by every node; carries
*   annotations, checks, encoding chain, and context
* - **{@link Encoding}** — a non-empty chain of {@link Link} values describing
*   how to transform between the decoded (type) and encoded (wire) form
* - **{@link Check}** — a validation filter ({@link Filter} or
*   {@link FilterGroup}) attached to an AST node
* - **{@link Context}** — per-property metadata: optionality, mutability,
*   default values, key annotations
* - **Guards** — type-narrowing predicates for each AST variant (e.g.
*   {@link isString}, {@link isObjects})
*
* ## Common tasks
*
* - Inspect what kind of schema you have → guard functions ({@link isString},
*   {@link isObjects}, {@link isUnion}, etc.)
* - Get the decoded (type-level) AST → {@link toType}
* - Get the encoded (wire-format) AST → {@link toEncoded}
* - Swap decode/encode directions → {@link flip}
* - Read annotations → {@link resolve}, {@link resolveAt},
*   {@link resolveIdentifier}
* - Build a transformation between schemas → {@link decodeTo}
* - Add regex validation → {@link isPattern}
*
* ## Gotchas
*
* - AST nodes are structurally immutable; modification helpers return new
*   objects via `Object.create`.
* - {@link Arrays} represents both tuples and arrays; {@link Objects}
*   represents both structs and records.
* - {@link toType} and {@link toEncoded} are memoized — same input yields
*   same output reference.
* - {@link Suspend} lazily resolves its inner AST via a thunk; the thunk is
*   memoized on first call.
*
* ## Quickstart
*
* **Example** (Inspecting a schema's AST)
*
* ```ts
* import { Schema, SchemaAST } from "effect"
*
* const schema = Schema.Struct({ name: Schema.String, age: Schema.Number })
* const ast = schema.ast
*
* if (SchemaAST.isObjects(ast)) {
*   console.log(ast.propertySignatures.map(ps => ps.name))
*   // ["name", "age"]
* }
*
* const encoded = SchemaAST.toEncoded(ast)
* console.log(SchemaAST.isObjects(encoded)) // true
* ```
*
* ## See also
*
* - {@link AST}
* - {@link toType}
* - {@link toEncoded}
* - {@link flip}
* - {@link resolve}
*
* @since 4.0.0
*/
function makeGuard(tag) {
	return (ast) => ast._tag === tag;
}
/**
* Narrows an {@link AST} to {@link Declaration}.
*
* @category Guard
* @since 4.0.0
*/
const isDeclaration = /* @__PURE__ */ makeGuard("Declaration");
/**
* Narrows an {@link AST} to {@link Never}.
*
* @category Guard
* @since 4.0.0
*/
const isNever = /* @__PURE__ */ makeGuard("Never");
/**
* Narrows an {@link AST} to {@link Literal}.
*
* @category Guard
* @since 4.0.0
*/
const isLiteral = /* @__PURE__ */ makeGuard("Literal");
/**
* Narrows an {@link AST} to {@link Arrays}.
*
* @category Guard
* @since 4.0.0
*/
const isArrays = /* @__PURE__ */ makeGuard("Arrays");
/**
* Narrows an {@link AST} to {@link Objects}.
*
* @category Guard
* @since 4.0.0
*/
const isObjects = /* @__PURE__ */ makeGuard("Objects");
/**
* Narrows an {@link AST} to {@link Union}.
*
* @category Guard
* @since 4.0.0
*/
const isUnion = /* @__PURE__ */ makeGuard("Union");
/**
* A single step in an {@link Encoding} chain, pairing a target {@link AST}
* with a `Transformation` or `Middleware` that converts values between the
* current node and the target.
*
* - `to` — the AST node on the other side of this transformation step.
* - `transformation` — the bidirectional conversion logic (decode/encode).
*
* Links are composed into a non-empty array ({@link Encoding}) attached to
* AST nodes that have a different encoded representation.
*
* @see {@link Encoding}
* @see {@link decodeTo}
*
* @category model
* @since 4.0.0
*/
var Link = class {
	to;
	transformation;
	constructor(to, transformation) {
		this.to = to;
		this.transformation = transformation;
	}
};
/** @internal */
const defaultParseOptions = {};
/**
* Per-property metadata attached to AST nodes via {@link Base.context}.
*
* Tracks whether a property key is optional, mutable, has a constructor
* default, or carries key-level annotations. Typically set by helpers like
* {@link optionalKey} and `Schema.mutableKey`.
*
* - `isOptional` — the property key may be absent from the input.
* - `isMutable` — the property is `readonly` when `false`.
* - `defaultValue` — an {@link Encoding} applied during construction to
*   supply missing values.
* - `annotations` — key-level annotations (e.g. description of the key
*   itself).
*
* @see {@link optionalKey}
* @see {@link isOptional}
*
* @category model
* @since 4.0.0
*/
var Context = class {
	isOptional;
	isMutable;
	/** Used for constructor default values (e.g. `withConstructorDefault` API) */
	defaultValue;
	annotations;
	constructor(isOptional, isMutable, defaultValue = void 0, annotations = void 0) {
		this.isOptional = isOptional;
		this.isMutable = isMutable;
		this.defaultValue = defaultValue;
		this.annotations = annotations;
	}
};
const TypeId$2 = "~effect/Schema";
/**
* Abstract base class for all {@link AST} node variants.
*
* Every AST node extends `Base` and inherits these fields:
*
* - `annotations` — user-supplied metadata (identifier, title, description,
*   arbitrary keys).
* - `checks` — optional {@link Checks} for post-type-match validation.
* - `encoding` — optional {@link Encoding} chain for type ↔ wire
*   transformations.
* - `context` — optional {@link Context} for per-property metadata.
*
* Subclasses add a `_tag` discriminant and variant-specific data.
*
* @see {@link AST}
*
* @category model
* @since 4.0.0
*/
var Base = class {
	[TypeId$2] = TypeId$2;
	annotations;
	checks;
	encoding;
	context;
	constructor(annotations = void 0, checks = void 0, encoding = void 0, context = void 0) {
		this.annotations = annotations;
		this.checks = checks;
		this.encoding = encoding;
		this.context = context;
	}
	toString() {
		return `<${this._tag}>`;
	}
};
/**
* AST node for user-defined opaque types with custom parsing logic.
*
* Use when none of the built-in AST nodes fit. The `run` function receives
* `typeParameters` and returns a parser that validates/transforms raw input.
*
* - `typeParameters` — inner schemas this declaration is parameterized over
*   (e.g. the element type for a custom collection).
* - `run` — factory producing the actual parse function.
*
* @see {@link isDeclaration}
*
* @category model
* @since 4.0.0
*/
var Declaration = class Declaration extends Base {
	_tag = "Declaration";
	typeParameters;
	run;
	constructor(typeParameters, run, annotations, checks, encoding, context) {
		super(annotations, checks, encoding, context);
		this.typeParameters = typeParameters;
		this.run = run;
	}
	/** @internal */
	getParser() {
		const run = this.run(this.typeParameters);
		return (oinput, options) => {
			if (isNone(oinput)) return succeedNone;
			return mapEager(run(oinput.value, this, options), some);
		};
	}
	/** @internal */
	recur(recur) {
		const tps = mapOrSame(this.typeParameters, recur);
		return tps === this.typeParameters ? this : new Declaration(tps, this.run, this.annotations, this.checks, void 0, this.context);
	}
	/** @internal */
	getExpected() {
		const expected = this.annotations?.identifier ?? this.annotations?.expected;
		if (typeof expected === "string") return expected;
		return "<Declaration>";
	}
};
/**
* AST node matching the `null` literal value.
*
* Parsing succeeds only when the input is exactly `null`.
*
* @see {@link null}
* @see {@link isNull}
*
* @category model
* @since 4.0.0
*/
var Null$1 = class extends Base {
	_tag = "Null";
	/** @internal */
	getParser() {
		return fromConst(this, null);
	}
	/** @internal */
	getExpected() {
		return "null";
	}
};
const null_ = /* @__PURE__ */ new Null$1();
/**
* AST node matching the `undefined` value.
*
* Parsing succeeds only when the input is exactly `undefined`.
*
* @see {@link undefined}
* @see {@link isUndefined}
*
* @category model
* @since 4.0.0
*/
var Undefined$1 = class extends Base {
	_tag = "Undefined";
	/** @internal */
	getParser() {
		return fromConst(this, void 0);
	}
	/** @internal */
	encodeToNull() {
		return replaceEncoding(this, [undefinedToNull]);
	}
	/** @internal */
	getExpected() {
		return "undefined";
	}
};
const undefinedToNull = /* @__PURE__ */ new Link(null_, /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform$1(() => void 0), /* @__PURE__ */ transform$1(() => null)));
const undefined_ = /* @__PURE__ */ new Undefined$1();
/**
* AST node matching the `void` type (accepts `undefined` at runtime).
*
* Behaves like {@link Undefined} for parsing but represents the TypeScript
* `void` type semantically.
*
* @see {@link void}
* @see {@link isVoid}
*
* @category model
* @since 4.0.0
*/
var Void$1 = class extends Base {
	_tag = "Void";
	/** @internal */
	getParser() {
		return fromConst(this, void 0);
	}
	/** @internal */
	encodeToNull() {
		return replaceEncoding(this, [undefinedToNull]);
	}
	/** @internal */
	getExpected() {
		return "void";
	}
};
const void_ = /* @__PURE__ */ new Void$1();
/**
* AST node representing the `never` type — no value matches.
*
* Parsing always fails. Useful as a placeholder in unions or as the result
* of narrowing that eliminates all options.
*
* @see {@link never}
* @see {@link isNever}
*
* @category model
* @since 4.0.0
*/
var Never$1 = class extends Base {
	_tag = "Never";
	/** @internal */
	getParser() {
		return fromRefinement(this, isNever$1);
	}
	/** @internal */
	getExpected() {
		return "never";
	}
};
/**
* Singleton {@link Never} AST instance.
*
* @since 4.0.0
*/
const never = /* @__PURE__ */ new Never$1();
/**
* AST node representing the `any` type — every value matches.
*
* @see {@link any}
* @see {@link isAny}
*
* @category model
* @since 4.0.0
*/
var Any$1 = class extends Base {
	_tag = "Any";
	/** @internal */
	getParser() {
		return fromRefinement(this, isUnknown);
	}
	/** @internal */
	getExpected() {
		return "any";
	}
};
/**
* Singleton {@link Any} AST instance.
*
* @since 4.0.0
*/
const any = /* @__PURE__ */ new Any$1();
/**
* AST node representing the `unknown` type — every value matches.
*
* Unlike {@link Any}, this is type-safe: the parsed result is typed as
* `unknown` rather than `any`.
*
* @see {@link unknown}
* @see {@link isUnknown}
*
* @category model
* @since 4.0.0
*/
var Unknown$1 = class extends Base {
	_tag = "Unknown";
	/** @internal */
	getParser() {
		return fromRefinement(this, isUnknown);
	}
	/** @internal */
	getExpected() {
		return "unknown";
	}
};
/**
* Singleton {@link Unknown} AST instance.
*
* @since 4.0.0
*/
const unknown = /* @__PURE__ */ new Unknown$1();
/**
* AST node matching the TypeScript `object` type — accepts objects, arrays,
* and functions (anything non-primitive and non-null).
*
* @see {@link objectKeyword}
* @see {@link isObjectKeyword}
*
* @category model
* @since 4.0.0
*/
var ObjectKeyword$1 = class extends Base {
	_tag = "ObjectKeyword";
	/** @internal */
	getParser() {
		return fromRefinement(this, isObjectKeyword);
	}
	/** @internal */
	getExpected() {
		return "object | array | function";
	}
};
/**
* Singleton {@link ObjectKeyword} AST instance.
*
* @since 4.0.0
*/
const objectKeyword = /* @__PURE__ */ new ObjectKeyword$1();
/**
* AST node matching an exact primitive value (string, number, boolean, or
* bigint).
*
* Parsing succeeds only when the input is strictly equal (`===`) to the
* stored `literal`. Numeric literals must be finite — `Infinity`, `-Infinity`,
* and `NaN` are rejected at construction time.
*
* **Example** (Creating a literal AST)
*
* ```ts
* import { SchemaAST } from "effect"
*
* const ast = new SchemaAST.Literal("active")
* console.log(ast.literal) // "active"
* ```
*
* @see {@link LiteralValue}
* @see {@link isLiteral}
*
* @category model
* @since 4.0.0
*/
var Literal$1 = class extends Base {
	_tag = "Literal";
	literal;
	constructor(literal, annotations, checks, encoding, context) {
		super(annotations, checks, encoding, context);
		if (typeof literal === "number" && !globalThis.Number.isFinite(literal)) throw new Error(`A numeric literal must be finite, got ${format$2(literal)}`);
		this.literal = literal;
	}
	/** @internal */
	getParser() {
		return fromConst(this, this.literal);
	}
	/** @internal */
	toCodecJson() {
		return typeof this.literal === "bigint" ? literalToString(this) : this;
	}
	/** @internal */
	toCodecStringTree() {
		return typeof this.literal === "string" ? this : literalToString(this);
	}
	/** @internal */
	getExpected() {
		return typeof this.literal === "string" ? JSON.stringify(this.literal) : globalThis.String(this.literal);
	}
};
function literalToString(ast) {
	const literalAsString = globalThis.String(ast.literal);
	return replaceEncoding(ast, [new Link(new Literal$1(literalAsString), new Transformation(transform$1(() => ast.literal), transform$1(() => literalAsString)))]);
}
/**
* AST node matching any `string` value.
*
* @see {@link string}
* @see {@link isString}
*
* @category model
* @since 4.0.0
*/
var String$2 = class extends Base {
	_tag = "String";
	/** @internal */
	getParser() {
		return fromRefinement(this, isString);
	}
	/** @internal */
	getExpected() {
		return "string";
	}
};
/**
* Singleton {@link String} AST instance.
*
* @since 4.0.0
*/
const string = /* @__PURE__ */ new String$2();
/**
* AST node matching any `number` value (including `NaN`, `Infinity`,
* `-Infinity`).
*
* Default JSON serialization:
* - Finite numbers are serialized as JSON numbers.
* - `Infinity`, `-Infinity`, and `NaN` are serialized as JSON strings.
*
* If the node has an `isFinite` or `isInt` check, the string fallback is
* skipped since non-finite values cannot occur.
*
* @see {@link number}
* @see {@link isNumber}
*
* @category model
* @since 4.0.0
*/
var Number$2 = class extends Base {
	_tag = "Number";
	/** @internal */
	getParser() {
		return fromRefinement(this, isNumber);
	}
	/** @internal */
	toCodecJson() {
		if (this.checks && (hasCheck(this.checks, "isFinite") || hasCheck(this.checks, "isInt"))) return this;
		return replaceEncoding(this, [numberToJson]);
	}
	/** @internal */
	toCodecStringTree() {
		if (this.checks && (hasCheck(this.checks, "isFinite") || hasCheck(this.checks, "isInt"))) return replaceEncoding(this, [finiteToString]);
		return replaceEncoding(this, [numberToString]);
	}
	/** @internal */
	getExpected() {
		return "number";
	}
};
function hasCheck(checks, tag) {
	return checks.some((c) => {
		switch (c._tag) {
			case "Filter": return c.annotations?.meta?._tag === tag;
			case "FilterGroup": return hasCheck(c.checks, tag);
		}
	});
}
/**
* Singleton {@link Number} AST instance.
*
* @since 4.0.0
*/
const number = /* @__PURE__ */ new Number$2();
/**
* AST node matching any `boolean` value (`true` or `false`).
*
* @see {@link boolean}
* @see {@link isBoolean}
*
* @category model
* @since 4.0.0
*/
var Boolean$1 = class extends Base {
	_tag = "Boolean";
	/** @internal */
	getParser() {
		return fromRefinement(this, isBoolean);
	}
	/** @internal */
	getExpected() {
		return "boolean";
	}
};
/**
* Singleton {@link Boolean} AST instance.
*
* @since 4.0.0
*/
const boolean = /* @__PURE__ */ new Boolean$1();
/**
* AST node matching any `symbol` value.
*
* When serialized to a string-based codec, symbols are converted via
* `Symbol.keyFor` and must be registered with `Symbol.for`.
*
* @see {@link symbol}
* @see {@link isSymbol}
*
* @category model
* @since 4.0.0
*/
var Symbol$2 = class extends Base {
	_tag = "Symbol";
	/** @internal */
	getParser() {
		return fromRefinement(this, isSymbol);
	}
	/** @internal */
	toCodecStringTree() {
		return replaceEncoding(this, [symbolToString]);
	}
	/** @internal */
	getExpected() {
		return "symbol";
	}
};
/**
* Singleton {@link Symbol} AST instance.
*
* @since 4.0.0
*/
const symbol = /* @__PURE__ */ new Symbol$2();
/**
* AST node matching any `bigint` value.
*
* When serialized to a string-based codec, bigints are converted to/from
* their decimal string representation.
*
* @see {@link bigInt}
* @see {@link isBigInt}
*
* @category model
* @since 4.0.0
*/
var BigInt$2 = class extends Base {
	_tag = "BigInt";
	/** @internal */
	getParser() {
		return fromRefinement(this, isBigInt);
	}
	/** @internal */
	toCodecStringTree() {
		return replaceEncoding(this, [bigIntToString]);
	}
	/** @internal */
	getExpected() {
		return "bigint";
	}
};
/**
* Singleton {@link BigInt} AST instance.
*
* @since 4.0.0
*/
const bigInt = /* @__PURE__ */ new BigInt$2();
/**
* AST node for array-like types — both tuples and arrays.
*
* - `elements` — positional element types (tuple elements). An element is
*   optional if its {@link Context.isOptional} is `true`.
* - `rest` — the rest/variadic element types. When non-empty, the first
*   entry is the "spread" type (e.g. `...Array<string>`), and subsequent
*   entries are trailing positional elements after the spread.
* - `isMutable` — whether the resulting array is `readonly` (`false`) or
*   mutable (`true`).
*
* Construction enforces TypeScript ordering rules: a required element
* cannot follow an optional one, and an optional element cannot follow a
* rest element.
*
* **Example** (Inspecting a tuple AST)
*
* ```ts
* import { Schema, SchemaAST } from "effect"
*
* const schema = Schema.Tuple([Schema.String, Schema.Number])
* const ast = schema.ast
*
* if (SchemaAST.isArrays(ast)) {
*   console.log(ast.elements.length) // 2
*   console.log(ast.rest.length)     // 0
* }
* ```
*
* @see {@link isArrays}
* @see {@link Objects}
*
* @category model
* @since 4.0.0
*/
var Arrays = class Arrays extends Base {
	_tag = "Arrays";
	isMutable;
	elements;
	rest;
	constructor(isMutable, elements, rest, annotations, checks, encoding, context) {
		super(annotations, checks, encoding, context);
		this.isMutable = isMutable;
		this.elements = elements;
		this.rest = rest;
		const i = elements.findIndex(isOptional);
		if (i !== -1 && (elements.slice(i + 1).some((e) => !isOptional(e)) || rest.length > 1)) throw new Error("A required element cannot follow an optional element. ts(1257)");
		if (rest.length > 1 && rest.slice(1).some(isOptional)) throw new Error("An optional element cannot follow a rest element. ts(1266)");
	}
	/** @internal */
	getParser(recur) {
		const ast = this;
		const elements = ast.elements.map((ast) => ({
			ast,
			parser: recur(ast)
		}));
		const rest = ast.rest.map((ast) => ({
			ast,
			parser: recur(ast)
		}));
		const elementLen = elements.length;
		return fnUntracedEager(function* (oinput, options) {
			if (oinput._tag === "None") return oinput;
			const input = oinput.value;
			if (!Array.isArray(input)) return yield* fail(new InvalidType(ast, oinput));
			const output = [];
			let issues;
			const errorsAllOption = options.errors === "all";
			let i = 0;
			for (; i < elementLen; i++) {
				const e = elements[i];
				const value = i < input.length ? some(input[i]) : none();
				const eff = e.parser(value, options);
				const exit$5 = effectIsExit(eff) ? eff : yield* exit(eff);
				if (exit$5._tag === "Failure") {
					const issueElement = findError$1(exit$5.cause);
					if (isFailure$3(issueElement)) return yield* exit$5;
					const issue = new Pointer([i], issueElement.success);
					if (errorsAllOption) if (issues) issues.push(issue);
					else issues = [issue];
					else return yield* fail(new Composite(ast, oinput, [issue]));
				} else if (exit$5.value._tag === "Some") output[i] = exit$5.value.value;
				else if (!isOptional(e.ast)) {
					const issue = new Pointer([i], new MissingKey(e.ast.context?.annotations));
					if (errorsAllOption) if (issues) issues.push(issue);
					else issues = [issue];
					else return yield* fail(new Composite(ast, oinput, [issue]));
				}
			}
			const len = input.length;
			if (ast.rest.length > 0) {
				const [head, ...tail] = rest;
				const keyAnnotations = head.ast.context?.annotations;
				for (; i < len - tail.length; i++) {
					const eff = head.parser(some(input[i]), options);
					const exit$6 = effectIsExit(eff) ? eff : yield* exit(eff);
					if (exit$6._tag === "Failure") {
						const issueRest = findError$1(exit$6.cause);
						if (isFailure$3(issueRest)) return yield* exit$6;
						const issue = new Pointer([i], issueRest.success);
						if (errorsAllOption) if (issues) issues.push(issue);
						else issues = [issue];
						else return yield* fail(new Composite(ast, oinput, [issue]));
					} else if (exit$6.value._tag === "Some") output[i] = exit$6.value.value;
					else {
						const issue = new Pointer([i], new MissingKey(keyAnnotations));
						if (errorsAllOption) if (issues) issues.push(issue);
						else issues = [issue];
						else return yield* fail(new Composite(ast, oinput, [issue]));
					}
				}
				for (let j = 0; j < tail.length; j++) if (len < i + 1) continue;
				else {
					const tailj = tail[j];
					const keyAnnotations = tailj.ast.context?.annotations;
					const eff = tailj.parser(some(input[i]), options);
					const exit$4 = effectIsExit(eff) ? eff : yield* exit(eff);
					if (exit$4._tag === "Failure") {
						const issueRest = findError$1(exit$4.cause);
						if (isFailure$3(issueRest)) return yield* exit$4;
						const issue = new Pointer([i], issueRest.success);
						if (errorsAllOption) if (issues) issues.push(issue);
						else issues = [issue];
						else return yield* fail(new Composite(ast, oinput, [issue]));
					} else if (exit$4.value._tag === "Some") output[i] = exit$4.value.value;
					else {
						const issue = new Pointer([i], new MissingKey(keyAnnotations));
						if (errorsAllOption) if (issues) issues.push(issue);
						else issues = [issue];
						else return yield* fail(new Composite(ast, oinput, [issue]));
					}
				}
			} else for (let i = elementLen; i <= len - 1; i++) {
				const issue = new Pointer([i], new UnexpectedKey(ast, input[i]));
				if (errorsAllOption) if (issues) issues.push(issue);
				else issues = [issue];
				else return yield* fail(new Composite(ast, oinput, [issue]));
			}
			if (issues) return yield* fail(new Composite(ast, oinput, issues));
			return some(output);
		});
	}
	/** @internal */
	recur(recur) {
		const elements = mapOrSame(this.elements, recur);
		const rest = mapOrSame(this.rest, recur);
		return elements === this.elements && rest === this.rest ? this : new Arrays(this.isMutable, elements, rest, this.annotations, this.checks, void 0, this.context);
	}
	/** @internal */
	getExpected() {
		return "array";
	}
};
/**
* floating point or integer, with optional exponent
* @internal
*/
const FINITE_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
const isNumberStringRegExp = /* @__PURE__ */ new globalThis.RegExp(`(?:${FINITE_PATTERN}|Infinity|-Infinity|NaN)`);
/**
* Returns the object keys that match the index signature parameter schema.
* @internal
*/
function getIndexSignatureKeys(input, parameter) {
	const encoded = toEncoded(parameter);
	switch (encoded._tag) {
		case "String": return Object.keys(input);
		case "TemplateLiteral": {
			const regExp = getTemplateLiteralRegExp(encoded);
			return Object.keys(input).filter((k) => regExp.test(k));
		}
		case "Symbol": return Object.getOwnPropertySymbols(input);
		case "Number": return Object.keys(input).filter((k) => isNumberStringRegExp.test(k));
		case "Union": return [...new Set(encoded.types.flatMap((t) => getIndexSignatureKeys(input, t)))];
		default: return [];
	}
}
/**
* A named property within an {@link Objects} node.
*
* Pairs a `name` (any `PropertyKey`) with a `type` ({@link AST}). The
* property's optionality and mutability are determined by the `type`'s
* {@link Context}.
*
* @see {@link Objects}
*
* @category model
* @since 4.0.0
*/
var PropertySignature = class {
	name;
	type;
	constructor(name, type) {
		this.name = name;
		this.type = type;
	}
};
/**
* An index signature entry within an {@link Objects} node.
*
* - `parameter` — the key type AST (e.g. {@link String} for `string` keys,
*   {@link TemplateLiteral} for patterned keys).
* - `type` — the value type AST.
* - `merge` — optional {@link KeyValueCombiner} for handling duplicate keys.
*
* Using `Schema.optionalKey` on the value type is not allowed for index
* signatures (throws at construction); use `Schema.optional` instead.
*
* @see {@link Objects}
* @see {@link PropertySignature}
*
* @category model
* @since 4.0.0
*/
var IndexSignature = class {
	parameter;
	type;
	merge;
	constructor(parameter, type, merge) {
		this.parameter = parameter;
		this.type = type;
		this.merge = merge;
		if (isOptional(type) && !containsUndefined(type)) throw new Error("Cannot use `Schema.optionalKey` with index signatures, use `Schema.optional` instead.");
	}
};
/**
* AST node for object-like types — both structs and records.
*
* - `propertySignatures` — named properties with their types (struct fields).
* - `indexSignatures` — index signature entries (record patterns), each with
*   a `parameter` AST (the key type) and a `type` AST (the value type).
*
* An `Objects` with no properties and no index signatures acts as a bare
* `object | array` type check (accepts any non-nullish value).
*
* Duplicate property names throw at construction time.
*
* **Example** (Inspecting a struct AST)
*
* ```ts
* import { Schema, SchemaAST } from "effect"
*
* const schema = Schema.Struct({ name: Schema.String })
* const ast = schema.ast
*
* if (SchemaAST.isObjects(ast)) {
*   for (const ps of ast.propertySignatures) {
*     console.log(ps.name, ps.type._tag)
*   }
*   // "name" "String"
* }
* ```
*
* @see {@link isObjects}
* @see {@link PropertySignature}
* @see {@link IndexSignature}
* @see {@link Arrays}
*
* @category model
* @since 4.0.0
*/
var Objects = class Objects extends Base {
	_tag = "Objects";
	propertySignatures;
	indexSignatures;
	constructor(propertySignatures, indexSignatures, annotations, checks, encoding, context) {
		super(annotations, checks, encoding, context);
		this.propertySignatures = propertySignatures;
		this.indexSignatures = indexSignatures;
		const duplicates = propertySignatures.map((ps) => ps.name).filter((name, i, arr) => arr.indexOf(name) !== i);
		if (duplicates.length > 0) throw new Error(`Duplicate identifiers: ${JSON.stringify(duplicates)}. ts(2300)`);
	}
	/** @internal */
	getParser(recur) {
		const ast = this;
		const expectedKeys = [];
		const expectedKeysSet = /* @__PURE__ */ new Set();
		const properties = [];
		const propertyCount = ast.propertySignatures.length;
		for (const ps of ast.propertySignatures) {
			expectedKeys.push(ps.name);
			expectedKeysSet.add(ps.name);
			properties.push({
				ps,
				parser: recur(ps.type),
				name: ps.name,
				type: ps.type
			});
		}
		const indexCount = ast.indexSignatures.length;
		if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) return fromRefinement(ast, isNotNullish);
		return fnUntracedEager(function* (oinput, options) {
			if (oinput._tag === "None") return oinput;
			const input = oinput.value;
			if (!(typeof input === "object" && input !== null && !Array.isArray(input))) return yield* fail(new InvalidType(ast, oinput));
			const out = {};
			let issues;
			const errorsAllOption = options.errors === "all";
			const onExcessPropertyError = options.onExcessProperty === "error";
			const onExcessPropertyPreserve = options.onExcessProperty === "preserve";
			let inputKeys;
			if (ast.indexSignatures.length === 0 && (onExcessPropertyError || onExcessPropertyPreserve)) {
				inputKeys = Reflect.ownKeys(input);
				for (let i = 0; i < inputKeys.length; i++) {
					const key = inputKeys[i];
					if (!expectedKeysSet.has(key)) if (onExcessPropertyError) {
						const issue = new Pointer([key], new UnexpectedKey(ast, input[key]));
						if (errorsAllOption) {
							if (issues) issues.push(issue);
							else issues = [issue];
							continue;
						} else return yield* fail(new Composite(ast, oinput, [issue]));
					} else set(out, key, input[key]);
				}
			}
			for (let i = 0; i < propertyCount; i++) {
				const p = properties[i];
				const value = Object.hasOwn(input, p.name) ? some(input[p.name]) : none();
				const eff = p.parser(value, options);
				const exit$2 = effectIsExit(eff) ? eff : yield* exit(eff);
				if (exit$2._tag === "Failure") {
					const issueProp = findError$1(exit$2.cause);
					if (isFailure$3(issueProp)) return yield* exit$2;
					const issue = new Pointer([p.name], issueProp.success);
					if (errorsAllOption) {
						if (issues) issues.push(issue);
						else issues = [issue];
						continue;
					} else return yield* fail(new Composite(ast, oinput, [issue]));
				} else if (exit$2.value._tag === "Some") set(out, p.name, exit$2.value.value);
				else if (!isOptional(p.type)) {
					const issue = new Pointer([p.name], new MissingKey(p.type.context?.annotations));
					if (errorsAllOption) {
						if (issues) issues.push(issue);
						else issues = [issue];
						continue;
					} else return yield* fail(new Composite(ast, oinput, [issue]));
				}
			}
			if (indexCount > 0) for (let i = 0; i < indexCount; i++) {
				const is = ast.indexSignatures[i];
				const keys = getIndexSignatureKeys(input, is.parameter);
				for (let j = 0; j < keys.length; j++) {
					const key = keys[j];
					const effKey = recur(indexSignatureParameterFromString(is.parameter))(some(key), options);
					const exitKey = effectIsExit(effKey) ? effKey : yield* exit(effKey);
					if (exitKey._tag === "Failure") {
						const issueKey = findError$1(exitKey.cause);
						if (isFailure$3(issueKey)) return yield* exitKey;
						const issue = new Pointer([key], issueKey.success);
						if (errorsAllOption) {
							if (issues) issues.push(issue);
							else issues = [issue];
							continue;
						}
						return yield* fail(new Composite(ast, oinput, [issue]));
					}
					const value = some(input[key]);
					const effValue = recur(is.type)(value, options);
					const exitValue = effectIsExit(effValue) ? effValue : yield* exit(effValue);
					if (exitValue._tag === "Failure") {
						const issueValue = findError$1(exitValue.cause);
						if (isFailure$3(issueValue)) return yield* exitValue;
						const issue = new Pointer([key], issueValue.success);
						if (errorsAllOption) {
							if (issues) issues.push(issue);
							else issues = [issue];
							continue;
						} else return yield* fail(new Composite(ast, oinput, [issue]));
					} else if (exitKey.value._tag === "Some" && exitValue.value._tag === "Some") {
						const k2 = exitKey.value.value;
						const v2 = exitValue.value.value;
						if (is.merge && is.merge.decode && Object.hasOwn(out, k2)) {
							const [k, v] = is.merge.decode.combine([k2, out[k2]], [k2, v2]);
							set(out, k, v);
						} else set(out, k2, v2);
					}
				}
			}
			if (issues) return yield* fail(new Composite(ast, oinput, issues));
			if (options.propertyOrder === "original") {
				const keys = (inputKeys ?? Reflect.ownKeys(input)).concat(expectedKeys);
				const preserved = {};
				for (const key of keys) if (Object.hasOwn(out, key)) set(preserved, key, out[key]);
				return some(preserved);
			}
			return some(out);
		});
	}
	rebuild(recur, flipMerge) {
		const props = mapOrSame(this.propertySignatures, (ps) => {
			const t = recur(ps.type);
			return t === ps.type ? ps : new PropertySignature(ps.name, t);
		});
		const indexes = mapOrSame(this.indexSignatures, (is) => {
			const p = recur(is.parameter);
			const t = recur(is.type);
			const merge = flipMerge ? is.merge?.flip() : is.merge;
			return p === is.parameter && t === is.type && merge === is.merge ? is : new IndexSignature(p, t, merge);
		});
		return props === this.propertySignatures && indexes === this.indexSignatures ? this : new Objects(props, indexes, this.annotations, this.checks, void 0, this.context);
	}
	/** @internal */
	flip(recur) {
		return this.rebuild(recur, true);
	}
	/** @internal */
	recur(recur) {
		return this.rebuild(recur, false);
	}
	/** @internal */
	getExpected() {
		if (this.propertySignatures.length === 0 && this.indexSignatures.length === 0) return "object | array";
		return "object";
	}
};
/** @internal */
function struct(fields, checks, annotations) {
	return new Objects(Reflect.ownKeys(fields).map((key) => {
		return new PropertySignature(key, fields[key].ast);
	}), [], annotations, checks);
}
/** @internal */
function getAST(self) {
	return self.ast;
}
/** @internal */
function tuple(elements, checks = void 0) {
	return new Arrays(false, elements.map((e) => e.ast), [], void 0, checks);
}
/** @internal */
function union(members, mode, checks) {
	return new Union$1(members.map(getAST), mode, void 0, checks);
}
function getCandidateTypes(ast) {
	switch (ast._tag) {
		case "Null": return ["null"];
		case "Undefined":
		case "Void": return ["undefined"];
		case "String":
		case "TemplateLiteral": return ["string"];
		case "Number": return ["number"];
		case "Boolean": return ["boolean"];
		case "Symbol":
		case "UniqueSymbol": return ["symbol"];
		case "BigInt": return ["bigint"];
		case "Arrays": return ["array"];
		case "ObjectKeyword": return [
			"object",
			"array",
			"function"
		];
		case "Objects": return ast.propertySignatures.length || ast.indexSignatures.length ? ["object"] : ["object", "array"];
		case "Enum": return Array.from(new Set(ast.enums.map(([, v]) => typeof v)));
		case "Literal": return [typeof ast.literal];
		case "Union": return Array.from(new Set(ast.types.flatMap(getCandidateTypes)));
		default: return [
			"null",
			"undefined",
			"string",
			"number",
			"boolean",
			"symbol",
			"bigint",
			"object",
			"array",
			"function"
		];
	}
}
/** @internal */
function collectSentinels(ast) {
	switch (ast._tag) {
		case "Declaration": {
			const s = ast.annotations?.["~sentinels"];
			return Array.isArray(s) && s.length ? s : void 0;
		}
		case "Objects": {
			const v = ast.propertySignatures.flatMap((ps) => isLiteral(ps.type) && !isOptional(ps.type) ? [{
				key: ps.name,
				literal: ps.type.literal
			}] : []);
			return v.length ? v : void 0;
		}
		case "Arrays": {
			const v = ast.elements.flatMap((e, i) => isLiteral(e) && !isOptional(e) ? [{
				key: i,
				literal: e.literal
			}] : []);
			return v.length ? v : void 0;
		}
		case "Suspend": return collectSentinels(ast.thunk());
	}
}
const candidateIndexCache = /* @__PURE__ */ new WeakMap();
function getIndex(types) {
	let idx = candidateIndexCache.get(types);
	if (idx) return idx;
	idx = {};
	for (const a of types) {
		const encoded = toEncoded(a);
		if (isNever(encoded)) continue;
		const types = getCandidateTypes(encoded);
		const sentinels = collectSentinels(encoded);
		idx.byType ??= {};
		for (const t of types) (idx.byType[t] ??= []).push(a);
		if (sentinels?.length) {
			idx.bySentinel ??= /* @__PURE__ */ new Map();
			for (const { key, literal } of sentinels) {
				let m = idx.bySentinel.get(key);
				if (!m) idx.bySentinel.set(key, m = /* @__PURE__ */ new Map());
				let arr = m.get(literal);
				if (!arr) m.set(literal, arr = []);
				arr.push(a);
			}
		} else {
			idx.otherwise ??= {};
			for (const t of types) (idx.otherwise[t] ??= []).push(a);
		}
	}
	candidateIndexCache.set(types, idx);
	return idx;
}
function filterLiterals(input) {
	return (ast) => {
		const encoded = toEncoded(ast);
		return encoded._tag === "Literal" ? encoded.literal === input : encoded._tag === "UniqueSymbol" ? encoded.symbol === input : true;
	};
}
/**
* The goal is to reduce the number of a union members that will be checked.
* This is useful to reduce the number of issues that will be returned.
*
* @internal
*/
function getCandidates(input, types) {
	const idx = getIndex(types);
	const runtimeType = input === null ? "null" : Array.isArray(input) ? "array" : typeof input;
	if (idx.bySentinel) {
		const base = idx.otherwise?.[runtimeType] ?? [];
		if (runtimeType === "object" || runtimeType === "array") {
			for (const [k, m] of idx.bySentinel) if (Object.hasOwn(input, k)) {
				const match = m.get(input[k]);
				if (match) return [...match, ...base].filter(filterLiterals(input));
			}
		}
		return base;
	}
	return (idx.byType?.[runtimeType] ?? []).filter(filterLiterals(input));
}
/**
* AST node representing a union of schemas.
*
* - `types` — the member AST nodes.
* - `mode` — `"anyOf"` succeeds on the first match (like TypeScript unions);
*   `"oneOf"` requires exactly one member to match (fails if multiple do).
*
* During parsing, members are tried in order. An internal candidate index
* narrows which members to try based on the runtime type of the input and
* discriminant ("sentinel") fields, making large unions efficient.
*
* **Example** (Inspecting a union AST)
*
* ```ts
* import { Schema, SchemaAST } from "effect"
*
* const schema = Schema.Union([Schema.String, Schema.Number])
* const ast = schema.ast
*
* if (SchemaAST.isUnion(ast)) {
*   console.log(ast.types.length) // 2
*   console.log(ast.mode)         // "anyOf"
* }
* ```
*
* @see {@link isUnion}
*
* @category model
* @since 4.0.0
*/
var Union$1 = class Union$1 extends Base {
	_tag = "Union";
	types;
	mode;
	constructor(types, mode, annotations, checks, encoding, context) {
		super(annotations, checks, encoding, context);
		this.types = types;
		this.mode = mode;
	}
	/** @internal */
	getParser(recur) {
		const ast = this;
		return fnUntracedEager(function* (oinput, options) {
			if (oinput._tag === "None") return oinput;
			const input = oinput.value;
			const oneOf = ast.mode === "oneOf";
			const candidates = getCandidates(input, ast.types);
			let issues;
			const tracking = {
				out: void 0,
				successes: []
			};
			for (let i = 0; i < candidates.length; i++) {
				const candidate = candidates[i];
				const eff = recur(candidate)(oinput, options);
				const exit$3 = effectIsExit(eff) ? eff : yield* exit(eff);
				if (exit$3._tag === "Failure") {
					const issueResult = findError$1(exit$3.cause);
					if (isFailure$3(issueResult)) return yield* exit$3;
					if (issues) issues.push(issueResult.success);
					else issues = [issueResult.success];
					continue;
				} else {
					if (tracking.out && oneOf) {
						tracking.successes.push(candidate);
						return yield* fail(new OneOf(ast, input, tracking.successes));
					}
					tracking.out = exit$3.value;
					tracking.successes.push(candidate);
					if (!oneOf) break;
				}
			}
			if (tracking.out) return tracking.out;
			else return yield* fail(new AnyOf(ast, input, issues ?? []));
		});
	}
	/** @internal */
	recur(recur) {
		const types = mapOrSame(this.types, recur);
		return types === this.types ? this : new Union$1(types, this.mode, this.annotations, this.checks, void 0, this.context);
	}
	/** @internal */
	getExpected(getExpected) {
		const expected = this.annotations?.expected;
		if (typeof expected === "string") return expected;
		if (this.types.length === 0) return "never";
		const types = this.types.map((type) => {
			const encoded = toEncoded(type);
			switch (encoded._tag) {
				case "Arrays": {
					const literals = encoded.elements.filter(isLiteral);
					if (literals.length > 0) return `${formatIsMutable(encoded.isMutable)}[ ${literals.map((e) => getExpected(e) + formatIsOptional(e.context?.isOptional)).join(", ")}, ... ]`;
					break;
				}
				case "Objects": {
					const literals = encoded.propertySignatures.filter((ps) => isLiteral(ps.type));
					if (literals.length > 0) return `{ ${literals.map((ps) => `${formatIsMutable(ps.type.context?.isMutable)}${formatPropertyKey(ps.name)}${formatIsOptional(ps.type.context?.isOptional)}: ${getExpected(ps.type)}`).join(", ")}, ... }`;
					break;
				}
			}
			return getExpected(encoded);
		});
		return Array.from(new Set(types)).join(" | ");
	}
};
const nonFiniteLiterals = /* @__PURE__ */ new Union$1([
	/* @__PURE__ */ new Literal$1("Infinity"),
	/* @__PURE__ */ new Literal$1("-Infinity"),
	/* @__PURE__ */ new Literal$1("NaN")
], "anyOf");
const numberToJson = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union$1([number, nonFiniteLiterals], "anyOf"), /* @__PURE__ */ new Transformation(/* @__PURE__ */ Number$3(), /* @__PURE__ */ transform$1((n) => globalThis.Number.isFinite(n) ? n : globalThis.String(n))));
function formatIsMutable(isMutable) {
	return isMutable ? "" : "readonly ";
}
function formatIsOptional(isOptional) {
	return isOptional ? "?" : "";
}
/**
* A single validation check attached to an AST node.
*
* - `run` — the validation function. Returns `undefined` on success, or an
*   `Issue` on failure.
* - `annotations` — optional filter-level metadata (expected message, meta
*   tags, arbitrary constraint hints).
* - `aborted` — when `true`, parsing stops immediately after this filter
*   fails (no further checks run).
*
* Use `.annotate()` to add metadata and `.abort()` to mark as aborting.
* Combine with another check via `.and()` to form a {@link FilterGroup}.
*
* @see {@link FilterGroup}
* @see {@link Check}
* @see {@link isPattern}
*
* @category model
* @since 4.0.0
*/
var Filter = class Filter extends Class$1 {
	_tag = "Filter";
	run;
	annotations;
	/**
	* Whether the parsing process should be aborted after this check has failed.
	*/
	aborted;
	constructor(run, annotations = void 0, aborted = false) {
		super();
		this.run = run;
		this.annotations = annotations;
		this.aborted = aborted;
	}
	annotate(annotations) {
		return new Filter(this.run, {
			...this.annotations,
			...annotations
		}, this.aborted);
	}
	abort() {
		return new Filter(this.run, this.annotations, true);
	}
	and(other, annotations) {
		return new FilterGroup([this, other], annotations);
	}
};
/**
* A composite validation check grouping multiple {@link Check} values.
*
* Created by calling `.and()` on a {@link Filter} or another `FilterGroup`.
* All inner checks are run; failures from aborted filters still stop
* evaluation.
*
* @see {@link Filter}
* @see {@link Check}
*
* @category model
* @since 4.0.0
*/
var FilterGroup = class FilterGroup extends Class$1 {
	_tag = "FilterGroup";
	checks;
	annotations;
	constructor(checks, annotations = void 0) {
		super();
		this.checks = checks;
		this.annotations = annotations;
	}
	annotate(annotations) {
		return new FilterGroup(this.checks, {
			...this.annotations,
			...annotations
		});
	}
	and(other, annotations) {
		return new FilterGroup([this, other], annotations);
	}
};
/** @internal */
function makeFilter$1(filter, annotations, aborted = false) {
	return new Filter((input, ast, options) => make$3(input, filter(input, ast, options)), annotations, aborted);
}
/**
* Creates a {@link Filter} that validates strings against a regular expression.
*
* - Returns a `Filter<string>` suitable for use with `Schema.filter` or
*   attached directly to a `String` AST node via checks.
* - The regex `source` is stored in annotations for serialization and
*   arbitrary generation.
*
* **Example** (Validating an email pattern)
*
* ```ts
* import { SchemaAST } from "effect"
*
* const emailFilter = SchemaAST.isPattern(/^[^@]+@[^@]+$/)
* ```
*
* @see {@link Filter}
*
* @since 4.0.0
*/
function isPattern$1(regExp, annotations) {
	const source = regExp.source;
	return makeFilter$1((s) => regExp.test(s), {
		expected: `a string matching the RegExp ${source}`,
		meta: {
			_tag: "isPattern",
			regExp
		},
		toArbitraryConstraint: { string: { patterns: [regExp.source] } },
		...annotations
	});
}
function modifyOwnPropertyDescriptors(ast, f) {
	const d = Object.getOwnPropertyDescriptors(ast);
	f(d);
	return Object.create(Object.getPrototypeOf(ast), d);
}
/** @internal */
function replaceEncoding(ast, encoding) {
	if (ast.encoding === encoding) return ast;
	return modifyOwnPropertyDescriptors(ast, (d) => {
		d.encoding.value = encoding;
	});
}
/** @internal */
function replaceContext(ast, context) {
	if (ast.context === context) return ast;
	return modifyOwnPropertyDescriptors(ast, (d) => {
		d.context.value = context;
	});
}
/** @internal */
function annotate(ast, annotations) {
	if (ast.checks) {
		const last = ast.checks[ast.checks.length - 1];
		return replaceChecks(ast, append(ast.checks.slice(0, -1), last.annotate(annotations)));
	}
	return modifyOwnPropertyDescriptors(ast, (d) => {
		d.annotations.value = {
			...d.annotations.value,
			...annotations
		};
	});
}
/** @internal */
function replaceChecks(ast, checks) {
	if (ast.checks === checks) return ast;
	return modifyOwnPropertyDescriptors(ast, (d) => {
		d.checks.value = checks;
	});
}
/** @internal */
function appendChecks(ast, checks) {
	return replaceChecks(ast, ast.checks ? [...ast.checks, ...checks] : checks);
}
function updateLastLink(encoding, f) {
	const links = encoding;
	const last = links[links.length - 1];
	const to = f(last.to);
	if (to !== last.to) return append(encoding.slice(0, encoding.length - 1), new Link(to, last.transformation));
	return encoding;
}
/** @internal */
function applyToLastLink(f) {
	return (ast) => ast.encoding ? replaceEncoding(ast, updateLastLink(ast.encoding, f)) : ast;
}
function appendTransformation(from, transformation, to) {
	const link = new Link(from, transformation);
	return replaceEncoding(to, to.encoding ? [...to.encoding, link] : [link]);
}
function mapOrSame(as, f) {
	let changed = false;
	const out = new Array(as.length);
	for (let i = 0; i < as.length; i++) {
		const a = as[i];
		const fa = f(a);
		if (fa !== a) changed = true;
		out[i] = fa;
	}
	return changed ? out : as;
}
/** @internal */
function annotateKey(ast, annotations) {
	return replaceContext(ast, ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, ast.context.defaultValue, {
		...ast.context.annotations,
		...annotations
	}) : new Context(false, false, void 0, annotations));
}
/** @internal */
const optionalKeyLastLink = /* @__PURE__ */ applyToLastLink(optionalKey$1);
/**
* Marks an AST node's property key as optional by setting
* {@link Context.isOptional} to `true`.
*
* Also propagates the optional flag through the last link of the encoding
* chain if present.
*
* @see {@link isOptional}
* @see {@link Context}
*
* @since 4.0.0
*/
function optionalKey$1(ast) {
	return optionalKeyLastLink(replaceContext(ast, ast.context ? ast.context.isOptional === false ? new Context(true, ast.context.isMutable, ast.context.defaultValue, ast.context.annotations) : ast.context : new Context(true, false)));
}
/** @internal */
function withConstructorDefault$1(ast, defaultValue) {
	const encoding = [new Link(unknown, new Transformation(new Getter((o) => {
		if (isNone(filter$3(o, isNotUndefined))) {
			const oe = defaultValue(o);
			return isEffect(oe) ? oe : succeed(oe);
		} else return succeed(o);
	}), passthrough$1()))];
	return replaceContext(ast, ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, encoding, ast.context.annotations) : new Context(false, false, encoding));
}
/**
* Attaches a `Transformation` to the `to` AST, making it decode from the
* `from` AST and encode back to it.
*
* This is the low-level primitive behind `Schema.transform` and
* `Schema.transformOrFail`. It appends a {@link Link} to the `to` node's
* encoding chain.
*
* - Does not mutate either input.
* - Returns a new AST with the same type as `to`.
*
* @see {@link Link}
* @see {@link Encoding}
* @see {@link flip}
*
* @since 4.0.0
*/
function decodeTo$1(from, to, transformation) {
	return appendTransformation(from, transformation, to);
}
/**
* Returns `true` if the AST node represents an optional property.
*
* Checks `ast.context?.isOptional`. Defaults to `false` when no
* {@link Context} is set.
*
* @see {@link optionalKey}
* @see {@link Context}
*
* @since 4.0.0
*/
function isOptional(ast) {
	return ast.context?.isOptional ?? false;
}
/**
* Strips all encoding transformations from an AST, returning the decoded
* (type-level) representation.
*
* - Memoized: same input reference → same output reference.
* - Recursively walks into composite nodes ({@link Arrays}, {@link Objects},
*   {@link Union}, {@link Suspend}).
* - Does not mutate the input.
*
* **Example** (Getting the type AST)
*
* ```ts
* import { Schema, SchemaAST } from "effect"
*
* const schema = Schema.NumberFromString
* const typeAst = SchemaAST.toType(schema.ast)
* console.log(typeAst._tag) // "Number"
* ```
*
* @see {@link toEncoded}
* @see {@link flip}
*
* @since 4.0.0
*/
const toType = /* @__PURE__ */ memoize((ast) => {
	if (ast.encoding) return toType(replaceEncoding(ast, void 0));
	const out = ast;
	return out.recur?.(toType) ?? out;
});
/**
* Returns the encoded (wire-format) AST by flipping and then stripping
* encodings.
*
* Equivalent to `toType(flip(ast))`. This gives you the AST that describes
* the shape of the serialized/encoded data.
*
* - Memoized: same input reference → same output reference.
* - Does not mutate the input.
*
* **Example** (Getting the encoded AST)
*
* ```ts
* import { Schema, SchemaAST } from "effect"
*
* const schema = Schema.NumberFromString
* const encodedAst = SchemaAST.toEncoded(schema.ast)
* console.log(encodedAst._tag) // "String"
* ```
*
* @see {@link toType}
* @see {@link flip}
*
* @since 4.0.0
*/
const toEncoded = /* @__PURE__ */ memoize((ast) => {
	return toType(flip(ast));
});
function flipEncoding(ast, encoding) {
	const links = encoding;
	const len = links.length;
	const last = links[len - 1];
	const ls = [new Link(flip(replaceEncoding(ast, void 0)), links[0].transformation.flip())];
	for (let i = 1; i < len; i++) ls.unshift(new Link(flip(links[i - 1].to), links[i].transformation.flip()));
	const to = flip(last.to);
	if (to.encoding) return replaceEncoding(to, [...to.encoding, ...ls]);
	else return replaceEncoding(to, ls);
}
/**
* Swaps the decode and encode directions of an AST's {@link Encoding} chain.
*
* After flipping, what was decoding becomes encoding and vice versa. This is
* the core operation behind `Schema.encode` — encoding a value is decoding
* with a flipped AST.
*
* - Memoized: same input reference → same output reference.
* - Recursively walks composite nodes.
* - Does not mutate the input.
*
* @see {@link toType}
* @see {@link toEncoded}
*
* @since 4.0.0
*/
const flip = /* @__PURE__ */ memoize((ast) => {
	if (ast.encoding) return flipEncoding(ast, ast.encoding);
	const out = ast;
	return out.flip?.(flip) ?? out.recur?.(flip) ?? out;
});
/** @internal */
function containsUndefined(ast) {
	switch (ast._tag) {
		case "Undefined": return true;
		case "Union": return ast.types.some(containsUndefined);
		default: return false;
	}
}
function getTemplateLiteralSource(ast, top) {
	return ast.encodedParts.map((part) => handleTemplateLiteralASTPartParens(part, getTemplateLiteralASTPartPattern(part), top)).join("");
}
/** @internal */
const getTemplateLiteralRegExp = /* @__PURE__ */ memoize((ast) => {
	return new globalThis.RegExp(`^${getTemplateLiteralSource(ast, true)}$`);
});
function getTemplateLiteralASTPartPattern(part) {
	switch (part._tag) {
		case "Literal": return escape(globalThis.String(part.literal));
		case "String": return STRING_PATTERN;
		case "Number": return FINITE_PATTERN;
		case "BigInt": return BIGINT_PATTERN;
		case "TemplateLiteral": return getTemplateLiteralSource(part, false);
		case "Union": return part.types.map(getTemplateLiteralASTPartPattern).join("|");
	}
}
function handleTemplateLiteralASTPartParens(part, s, top) {
	if (isUnion(part)) {
		if (!top) return `(?:${s})`;
	} else if (!top) return s;
	return `(${s})`;
}
function fromConst(ast, value) {
	const succeed = succeedSome(value);
	return (oinput) => {
		if (oinput._tag === "None") return succeedNone;
		return oinput.value === value ? succeed : fail(new InvalidType(ast, oinput));
	};
}
function fromRefinement(ast, refinement) {
	return (oinput) => {
		if (oinput._tag === "None") return succeedNone;
		return refinement(oinput.value) ? succeed(oinput) : fail(new InvalidType(ast, oinput));
	};
}
/** @internal */
function toCodec(f) {
	function out(ast) {
		return ast.encoding ? replaceEncoding(ast, updateLastLink(ast.encoding, out)) : f(ast);
	}
	return memoize(out);
}
const indexSignatureParameterFromString = /* @__PURE__ */ toCodec((ast) => {
	switch (ast._tag) {
		default: return ast;
		case "Number": return ast.toCodecStringTree();
		case "Union": return ast.recur(indexSignatureParameterFromString);
	}
});
/**
* any string, including newlines
* @internal
*/
const STRING_PATTERN = "[\\s\\S]*?";
const isStringFiniteRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${FINITE_PATTERN}$`);
/** @internal */
function isStringFinite$1(annotations) {
	return isPattern$1(isStringFiniteRegExp, {
		expected: "a string representing a finite number",
		meta: {
			_tag: "isStringFinite",
			regExp: isStringFiniteRegExp
		},
		...annotations
	});
}
const finiteString = /* @__PURE__ */ appendChecks(string, [/* @__PURE__ */ isStringFinite$1()]);
const finiteToString = /* @__PURE__ */ new Link(finiteString, numberFromString);
const numberToString = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union$1([finiteString, nonFiniteLiterals], "anyOf"), numberFromString);
/**
* signed integer only (no leading "+" because TypeScript doesn't support it)
*/
const BIGINT_PATTERN = "-?\\d+";
const isStringBigIntRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${BIGINT_PATTERN}$`);
/** @internal */
function isStringBigInt$1(annotations) {
	return isPattern$1(isStringBigIntRegExp, {
		expected: "a string representing a bigint",
		meta: {
			_tag: "isStringBigInt",
			regExp: isStringBigIntRegExp
		},
		...annotations
	});
}
/** @internal */
const bigIntString = /* @__PURE__ */ appendChecks(string, [/* @__PURE__ */ isStringBigInt$1()]);
const bigIntToString = /* @__PURE__ */ new Link(bigIntString, /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform$1(globalThis.BigInt), /* @__PURE__ */ String$3()));
const isStringSymbolRegExp = /* @__PURE__ */ new globalThis.RegExp(`^Symbol\\((.*)\\)$`);
/** @internal */
const symbolString = /* @__PURE__ */ appendChecks(string, [/* @__PURE__ */ isStringSymbol$1()]);
/**
* to distinguish between Symbol and String, we need to add a check to the string keyword
*/
const symbolToString = /* @__PURE__ */ new Link(symbolString, /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform$1((description) => globalThis.Symbol.for(isStringSymbolRegExp.exec(description)[1])), /* @__PURE__ */ transformOrFail$1((sym) => {
	if (globalThis.Symbol.keyFor(sym) !== void 0) return succeed(globalThis.String(sym));
	return fail(new Forbidden(some(sym), { message: "cannot serialize to string, Symbol is not registered" }));
})));
/** @internal */
function isStringSymbol$1(annotations) {
	return isPattern$1(isStringSymbolRegExp, {
		expected: "a string representing a symbol",
		meta: {
			_tag: "isStringSymbol",
			regExp: isStringSymbolRegExp
		},
		...annotations
	});
}
/** @internal */
function collectIssues(checks, value, issues, ast, options) {
	for (let i = 0; i < checks.length; i++) {
		const check = checks[i];
		if (check._tag === "FilterGroup") collectIssues(check.checks, value, issues, ast, options);
		else {
			const issue = check.run(value, ast, options);
			if (issue) {
				issues.push(new Filter$1(value, check, issue));
				if (check.aborted || options?.errors !== "all") return;
			}
		}
	}
}
/** @internal */
const ClassTypeId = "~effect/Schema/Class";
/** @internal */
const STRUCTURAL_ANNOTATION_KEY = "~structural";
/**
* Returns all annotations from the AST node.
*
* If the node has {@link Checks}, returns annotations from the last check
* (which is where user-supplied annotations end up after `.pipe(Schema.annotations(...))`).
* Otherwise returns `Base.annotations` directly.
*
* **Example** (Reading annotations)
*
* ```ts
* import { Schema, SchemaAST } from "effect"
*
* const schema = Schema.String.annotate({ title: "Name" })
* const annotations = SchemaAST.resolve(schema.ast)
* console.log(annotations?.title) // "Name"
* ```
*
* @see {@link resolveAt}
* @see {@link resolveIdentifier}
* @see {@link resolveTitle}
* @see {@link resolveDescription}
*
* @since 4.0.0
*/
const resolve = resolve$1;
/**
* Returns a single annotation value by key from the AST node.
*
* Like {@link resolve}, reads from the last check's annotations when checks
* are present. Returns `undefined` if the key is not found.
*
* @see {@link resolve}
*
* @since 4.0.0
*/
const resolveAt = resolveAt$1;
/**
* Returns the `identifier` annotation from the AST node, if set.
*
* The identifier is typically set by `Schema.annotations({ identifier: "..." })`
* and is used for error messages and schema identification.
*
* @see {@link resolve}
* @see {@link resolveTitle}
*
* @since 4.0.0
*/
const resolveIdentifier = resolveIdentifier$1;
/**
* Returns the `title` annotation from the AST node, if set.
*
* @see {@link resolve}
* @see {@link resolveIdentifier}
* @see {@link resolveDescription}
*
* @since 4.0.0
*/
const resolveTitle = resolveTitle$1;
/**
* Returns the `description` annotation from the AST node, if set.
*
* @see {@link resolve}
* @see {@link resolveTitle}
* @see {@link resolveIdentifier}
*
* @since 4.0.0
*/
const resolveDescription = resolveDescription$1;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Struct.js
/**
* Creates an `Equivalence` for a struct by providing an `Equivalence` for each
* property. Two structs are equivalent when all their corresponding properties
* are equivalent.
*
* Alias of `Equivalence.Struct`.
*
* - Use when you need to compare structs property-by-property.
* - Each property's equivalence is checked independently; all must return
*   `true` for the overall result to be `true`.
*
* **Example** (Comparing structs for equivalence)
*
* ```ts
* import { Equivalence, Struct } from "effect"
*
* const PersonEquivalence = Struct.makeEquivalence({
*   name: Equivalence.strictEqual<string>(),
*   age: Equivalence.strictEqual<number>()
* })
*
* console.log(PersonEquivalence({ name: "Alice", age: 30 }, { name: "Alice", age: 30 }))
* // true
* console.log(PersonEquivalence({ name: "Alice", age: 30 }, { name: "Bob", age: 30 }))
* // false
* ```
*
* @see {@link makeOrder} – create an `Order` for structs
*
* @category Equivalence
* @since 2.0.0
*/
const makeEquivalence = Struct$2;
/**
* Creates an `Order` for a struct by providing an `Order` for each property.
* Properties are compared in the order they appear in the fields object; the
* first non-zero comparison determines the result.
*
* Alias of `Order.Struct`.
*
* - Use to sort or compare structs by multiple fields with lexicographic
*   priority.
* - The order of keys in the `fields` object determines comparison priority.
*
* **Example** (Ordering structs by name then age)
*
* ```ts
* import { Number, String, Struct } from "effect"
*
* const PersonOrder = Struct.makeOrder({
*   name: String.Order,
*   age: Number.Order
* })
*
* console.log(PersonOrder({ name: "Alice", age: 30 }, { name: "Bob", age: 25 }))
* // -1 (Alice comes before Bob)
* ```
*
* @see {@link makeEquivalence} – create an `Equivalence` for structs
*
* @category Ordering
* @since 2.0.0
*/
const makeOrder = Struct$1;
/**
* Wraps a plain function as a {@link Lambda} value so it can be used with
* {@link map}, {@link mapPick}, and {@link mapOmit}.
*
* - The type parameter `L` encodes both the input and output types at the type
*   level, allowing the compiler to track how struct value types change.
* - At runtime, the returned value is the same function — `lambda` only
*   adjusts the type.
*
* **Example** (Wrapping values in arrays)
*
* ```ts
* import { pipe, Struct } from "effect"
*
* interface AsArray extends Struct.Lambda {
*   <A>(self: A): Array<A>
*   readonly "~lambda.out": Array<this["~lambda.in"]>
* }
*
* const asArray = Struct.lambda<AsArray>((a) => [a])
* const result = pipe({ x: 1, y: "hello" }, Struct.map(asArray))
* console.log(result) // { x: [1], y: ["hello"] }
* ```
*
* @see {@link Lambda} – the type-level interface
* @see {@link map} – apply a lambda to all struct values
*
* @category Lambda
* @since 4.0.0
*/
const lambda = (f) => f;

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/SchemaParser.js
/**
* @since 4.0.0
*/
const recurDefaults = /* @__PURE__ */ memoize((ast) => {
	switch (ast._tag) {
		case "Declaration": {
			const getLink = ast.annotations?.[ClassTypeId];
			if (isFunction(getLink)) {
				const link = getLink(ast.typeParameters);
				const to = recurDefaults(link.to);
				return replaceEncoding(ast, to === link.to ? [link] : [new Link(to, link.transformation)]);
			}
			return ast;
		}
		case "Objects":
		case "Arrays": return ast.recur((ast) => {
			const defaultValue = ast.context?.defaultValue;
			if (defaultValue) return replaceEncoding(recurDefaults(ast), defaultValue);
			return recurDefaults(ast);
		});
		case "Suspend": return ast.recur(recurDefaults);
		default: return ast;
	}
});
/**
* @category Constructing
* @since 4.0.0
*/
function makeEffect(schema) {
	const parser = run(recurDefaults(toType(schema.ast)));
	return (input, options) => {
		return parser(input, options?.parseOptions);
	};
}
/**
* @category Constructing
* @since 4.0.0
*/
function makeUnsafe(schema) {
	const parser = makeEffect(schema);
	return (input, options) => {
		return runSync(mapErrorEager(parser(input, options), (issue) => new Error(issue.toString(), { cause: issue })));
	};
}
/**
* @category Asserting
* @since 4.0.0
*/
function is$1(schema) {
	return _is(schema.ast);
}
/** @internal */
function _is(ast) {
	const parser = asExit(run(toType(ast)));
	return (input) => {
		return isSuccess$1(parser(input, defaultParseOptions));
	};
}
/**
* @category Asserting
* @since 4.0.0
*/
function asserts$1(schema) {
	const parser = asExit(run(toType(schema.ast)));
	return (input) => {
		const exit = parser(input, defaultParseOptions);
		if (isFailure$1(exit)) {
			const issue = findError$1(exit.cause);
			if (isFailure$3(issue)) throw squash(issue.failure);
			throw new Error(issue.success.toString(), { cause: issue.success });
		}
	};
}
/**
* @category Decoding
* @since 4.0.0
*/
function decodeUnknownEffect(schema) {
	return run(schema.ast);
}
/**
* @category Decoding
* @since 4.0.0
*/
const decodeEffect = decodeUnknownEffect;
/**
* @category Decoding
* @since 4.0.0
*/
function decodeUnknownPromise$1(schema) {
	return asPromise(decodeUnknownEffect(schema));
}
/**
* @category Decoding
* @since 4.0.0
*/
function decodePromise$1(schema) {
	return asPromise(decodeEffect(schema));
}
/**
* @category Decoding
* @since 4.0.0
*/
function decodeUnknownOption$1(schema) {
	return asOption(decodeUnknownEffect(schema));
}
/**
* @category Decoding
* @since 4.0.0
*/
const decodeOption$1 = decodeUnknownOption$1;
/**
* @category Decoding
* @since 4.0.0
*/
function decodeUnknownSync$1(schema) {
	return asSync(decodeUnknownEffect(schema));
}
/**
* @category Decoding
* @since 4.0.0
*/
const decodeSync$1 = decodeUnknownSync$1;
/**
* @category Encoding
* @since 4.0.0
*/
function encodeUnknownEffect(schema) {
	return run(flip(schema.ast));
}
/**
* @category Encoding
* @since 4.0.0
*/
const encodeUnknownPromise$1 = (schema) => asPromise(encodeUnknownEffect(schema));
/**
* @category Encoding
* @since 4.0.0
*/
const encodePromise$1 = encodeUnknownPromise$1;
/**
* @category Encoding
* @since 4.0.0
*/
function encodeUnknownOption$1(schema) {
	return asOption(encodeUnknownEffect(schema));
}
/**
* @category Encoding
* @since 4.0.0
*/
const encodeOption$1 = encodeUnknownOption$1;
/**
* @category Encoding
* @since 4.0.0
*/
function encodeUnknownSync$1(schema) {
	return asSync(encodeUnknownEffect(schema));
}
/**
* @category Encoding
* @since 4.0.0
*/
const encodeSync$1 = encodeUnknownSync$1;
/** @internal */
function run(ast) {
	const parser = recur(ast);
	return (input, options) => flatMapEager(parser(some(input), options ?? defaultParseOptions), (oa) => {
		if (oa._tag === "None") return fail(new InvalidValue(oa));
		return succeed(oa.value);
	});
}
function asPromise(parser) {
	return (input, options) => runPromise(parser(input, options));
}
function asExit(parser) {
	return (input, options) => runSyncExit(parser(input, options));
}
/** @internal */
function asOption(parser) {
	const parserExit = asExit(parser);
	return (input, options) => getSuccess(parserExit(input, options));
}
function asSync(parser) {
	return (input, options) => runSync(mapErrorEager(parser(input, options), (issue) => new Error(issue.toString(), { cause: issue })));
}
const recur = /* @__PURE__ */ memoize((ast) => {
	let parser;
	if (!ast.context && !ast.encoding && !ast.checks) return (ou, options) => {
		parser ??= ast.getParser(recur);
		return parser(ou, resolve$1(ast)?.["parseOptions"] ?? options);
	};
	const isStructural = isArrays(ast) || isObjects(ast) || isDeclaration(ast) && ast.typeParameters.length > 0;
	return (ou, options) => {
		options = resolve$1(ast)?.["parseOptions"] ?? options;
		const encoding = ast.encoding;
		let srou;
		if (encoding) {
			const links = encoding;
			const len = links.length;
			for (let i = len - 1; i >= 0; i--) {
				const link = links[i];
				const to = link.to;
				const parser = recur(to);
				srou = srou ? flatMapEager(srou, (ou) => parser(ou, options)) : parser(ou, options);
				if (link.transformation._tag === "Transformation") {
					const getter = link.transformation.decode;
					srou = flatMapEager(srou, (ou) => getter.run(ou, options));
				} else srou = link.transformation.decode(srou, options);
			}
			srou = mapErrorEager(srou, (issue) => new Encoding(ast, ou, issue));
		}
		parser ??= ast.getParser(recur);
		let sroa = srou ? flatMapEager(srou, (ou) => parser(ou, options)) : parser(ou, options);
		if (ast.checks) {
			const checks = ast.checks;
			if (options?.errors === "all" && isStructural && isSome(ou)) sroa = catchEager(sroa, (issue) => {
				const issues = [];
				collectIssues(checks.filter((check) => check.annotations?.[STRUCTURAL_ANNOTATION_KEY]), ou.value, issues, ast, options);
				const out = isArrayNonEmpty(issues) ? issue._tag === "Composite" && issue.ast === ast ? new Composite(ast, issue.actual, [...issue.issues, ...issues]) : new Composite(ast, ou, [issue, ...issues]) : issue;
				return fail(out);
			});
			sroa = flatMapEager(sroa, (oa) => {
				if (isSome(oa)) {
					const value = oa.value;
					const issues = [];
					collectIssues(checks, value, issues, ast, options);
					if (isArrayNonEmpty(issues)) return fail(new Composite(ast, oa, issues));
				}
				return succeed(oa);
			});
		}
		return sroa;
	};
});

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/internal/schema/schema.js
/** @internal */
const TypeId$1 = "~effect/Schema/Schema";
const SchemaProto = {
	[TypeId$1]: TypeId$1,
	pipe() {
		return pipeArguments(this, arguments);
	},
	annotate(annotations) {
		return this.rebuild(annotate(this.ast, annotations));
	},
	annotateKey(annotations) {
		return this.rebuild(annotateKey(this.ast, annotations));
	},
	check(...checks) {
		return this.rebuild(appendChecks(this.ast, checks));
	}
};
/** @internal */
function make$1(ast, options) {
	const self = Object.create(SchemaProto);
	if (options) Object.assign(self, options);
	self.ast = ast;
	self.rebuild = (ast) => make$1(ast, options);
	self.makeUnsafe = makeUnsafe(self);
	return self;
}

//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.5/node_modules/effect/dist/Schema.js
const TypeId = TypeId$1;
/**
* An API for creating schemas for parametric types.
*
* @see {@link declare} for creating schemas for non parametric types.
*
* @category Constructors
* @since 4.0.0
*/
function declareConstructor() {
	return (typeParameters, run, annotations) => {
		return make(new Declaration(typeParameters.map(getAST), (typeParameters) => run(typeParameters.map((ast) => make(ast))), annotations));
	};
}
/**
* An API for creating schemas for non parametric types.
*
* @see {@link declareConstructor} for creating schemas for parametric types.
*
* @since 4.0.0
*/
function declare(is, annotations) {
	return declareConstructor()([], () => (input, ast) => is(input) ? succeed(input) : fail(new InvalidType(ast, some(input))), annotations);
}
const SchemaErrorTypeId = "~effect/Schema/SchemaError";
/**
* A `SchemaError` is returned when schema decoding or encoding fails.
*
* This error extends `Data.TaggedError` and contains detailed information about
* what went wrong during schema processing. The error includes an `issue` field
* that provides comprehensive details about the validation failure, including
* the path to the problematic data, expected types, and actual values.
*
* @since 4.0.0
*/
var SchemaError = class {
	[SchemaErrorTypeId] = SchemaErrorTypeId;
	_tag = "SchemaError";
	name = "SchemaError";
	issue;
	constructor(issue) {
		this.issue = issue;
	}
	get message() {
		return this.issue.toString();
	}
	toString() {
		return `SchemaError(${this.message})`;
	}
};
/**
* Creates a type guard function that checks if a value conforms to a given
* schema.
*
* This function returns a predicate that performs a type-safe check, narrowing
* the type of the input value if the check passes. It's particularly useful for
* runtime type validation and TypeScript type narrowing.
*
* **Example** (Basic Type Guard)
*
* ```ts
* import { Schema } from "effect"
*
* const isString = Schema.is(Schema.String)
*
* console.log(isString("hello")) // true
* console.log(isString(42)) // false
*
* // Type narrowing in action
* const value: unknown = "hello"
* if (isString(value)) {
*   // value is now typed as string
*   console.log(value.toUpperCase()) // "HELLO"
* }
* ```
*
* @category Asserting
* @since 4.0.0
*/
const is = is$1;
/**
* Creates an assertion function that throws an error if the input doesn't match
* the schema.
*
* This function is useful for runtime type checking with TypeScript's `asserts`
* type guard. It narrows the type of the input if the assertion succeeds, or
* throws an error if it fails.
*
* **Example** (Basic Usage)
*
* ```ts
* import { Schema } from "effect"
*
* const assertString: (u: unknown) => asserts u is string = Schema.asserts(
*   Schema.String
* )
*
* // This will pass silently (no return value)
* try {
*   assertString("hello")
*   console.log("String assertion passed")
* } catch (error) {
*   console.log("String assertion failed")
* }
*
* // This will throw an error
* try {
*   assertString(123)
* } catch (error) {
*   console.log("Non-string assertion failed as expected")
* }
* ```
*
* @category Asserting
* @since 4.0.0
*/
const asserts = asserts$1;
/**
* @category Decoding
* @since 4.0.0
*/
const decodeUnknownOption = decodeUnknownOption$1;
/**
* @category Decoding
* @since 4.0.0
*/
const decodeOption = decodeOption$1;
/**
* @category Decoding
* @since 4.0.0
*/
const decodeUnknownPromise = decodeUnknownPromise$1;
/**
* @category Decoding
* @since 4.0.0
*/
const decodePromise = decodePromise$1;
/**
* @category Decoding
* @since 4.0.0
*/
const decodeUnknownSync = decodeUnknownSync$1;
/**
* @category Decoding
* @since 4.0.0
*/
const decodeSync = decodeSync$1;
/**
* @category Encoding
* @since 4.0.0
*/
const encodeUnknownOption = encodeUnknownOption$1;
/**
* @category Encoding
* @since 4.0.0
*/
const encodeOption = encodeOption$1;
/**
* @category Encoding
* @since 4.0.0
*/
const encodeUnknownPromise = encodeUnknownPromise$1;
/**
* @category Encoding
* @since 4.0.0
*/
const encodePromise = encodePromise$1;
/**
* @category Encoding
* @since 4.0.0
*/
const encodeUnknownSync = encodeUnknownSync$1;
/**
* @category Encoding
* @since 4.0.0
*/
const encodeSync = encodeSync$1;
/**
* Creates a schema from an AST (Abstract Syntax Tree) node.
*
* This is the fundamental constructor for all schemas in the Effect Schema
* library. It takes an AST node and wraps it in a fully-typed schema that
* preserves all type information and provides the complete schema API.
*
* The `make` function is used internally to create all primitive schemas like
* `String`, `Number`, `Boolean`, etc., as well as more complex schemas. It's
* the bridge between the untyped AST representation and the strongly-typed
* schema.
*
* @category Constructors
* @since 4.0.0
*/
const make = make$1;
/**
* Creates an exact optional key schema for struct fields. Unlike `optional`,
* this creates exact optional properties (not `| undefined`) that can be
* completely omitted from the object.
*
* **Example** (Creating a struct with optional key)
*
* ```ts
* import { Schema } from "effect"
*
* const schema = Schema.Struct({
*   name: Schema.String,
*   age: Schema.optionalKey(Schema.Number)
* })
*
* // Type: { readonly name: string; readonly age?: number }
* type Person = typeof schema["Type"]
* ```
*
* @since 4.0.0
*/
const optionalKey = /* @__PURE__ */ lambda((schema) => make(optionalKey$1(schema.ast), { schema }));
/**
* @see {@link Literals} for a schema that represents a union of literals.
* @see {@link tag} for a schema that represents a literal value that can be
* used as a discriminator field in tagged unions and has a constructor default.
* @since 4.0.0
*/
function Literal(literal) {
	const out = make(new Literal$1(literal), {
		literal,
		transform(to) {
			return out.pipe(decodeTo(Literal(to), {
				decode: transform$1(() => to),
				encode: transform$1(() => literal)
			}));
		}
	});
	return out;
}
/**
* @since 4.0.0
*/
const Never = /* @__PURE__ */ make(never);
/**
* @since 4.0.0
*/
const Any = /* @__PURE__ */ make(any);
/**
* @since 4.0.0
*/
const Unknown = /* @__PURE__ */ make(unknown);
/**
* @since 4.0.0
*/
const Null = /* @__PURE__ */ make(null_);
/**
* @since 4.0.0
*/
const Undefined = /* @__PURE__ */ make(undefined_);
/**
* A schema for all strings.
*
* @since 4.0.0
*/
const String$1 = /* @__PURE__ */ make(string);
/**
* A schema for all numbers, including `NaN`, `Infinity`, and `-Infinity`.
*
* **Default Json Serializer**
*
* - If the number is finite, it is serialized as a number.
* - Otherwise, it is serialized as a string ("NaN", "Infinity", or "-Infinity").
*
* @since 4.0.0
*/
const Number$1 = /* @__PURE__ */ make(number);
/**
* A schema for all booleans.
*
* @category Boolean
* @since 4.0.0
*/
const Boolean = /* @__PURE__ */ make(boolean);
/**
* A schema for all symbols.
*
* @since 4.0.0
*/
const Symbol$1 = /* @__PURE__ */ make(symbol);
/**
* A schema for all bigints.
*
* @since 4.0.0
*/
const BigInt$1 = /* @__PURE__ */ make(bigInt);
/**
* A schema for the `void` type.
*
* @since 4.0.0
*/
const Void = /* @__PURE__ */ make(void_);
/**
* A schema for the `object` type.
*
* @since 4.0.0
*/
const ObjectKeyword = /* @__PURE__ */ make(objectKeyword);
function makeStruct(ast, fields) {
	return make(ast, {
		fields,
		mapFields(f, options) {
			const fields = f(this.fields);
			return makeStruct(struct(fields, options?.unsafePreserveChecks ? this.ast.checks : void 0), fields);
		}
	});
}
/**
* @since 4.0.0
*/
function Struct(fields) {
	return makeStruct(struct(fields, void 0), fields);
}
function makeTuple(ast, elements) {
	return make(ast, {
		elements,
		mapElements(f, options) {
			const elements = f(this.elements);
			return makeTuple(tuple(elements, options?.unsafePreserveChecks ? this.ast.checks : void 0), elements);
		}
	});
}
/**
* @category Constructors
* @since 4.0.0
*/
function Tuple(elements) {
	return makeTuple(tuple(elements), elements);
}
/**
* @category Constructors
* @since 4.0.0
*/
const Array$1 = /* @__PURE__ */ lambda((schema) => make(new Arrays(false, [], [schema.ast]), { schema }));
/**
* Makes arrays or tuples mutable.
*
* @since 4.0.0
*/
const mutable = /* @__PURE__ */ lambda((schema) => {
	return make(new Arrays(true, schema.ast.elements, schema.ast.rest), { schema });
});
function makeUnion(ast, members) {
	return make(ast, {
		members,
		mapMembers(f, options) {
			const members = f(this.members);
			return makeUnion(union(members, this.ast.mode, options?.unsafePreserveChecks ? this.ast.checks : void 0), members);
		}
	});
}
/**
* Creates a schema that represents a union of multiple schemas. Members are checked in order, and the first match is returned.
*
* Optionally, you can specify the `mode` to be `"anyOf"` or `"oneOf"`.
*
* - `"anyOf"` - The union matches if any member matches.
* - `"oneOf"` - The union matches if exactly one member matches.
*
* @category Constructors
* @since 4.0.0
*/
function Union(members, options) {
	return makeUnion(union(members, options?.mode ?? "anyOf", void 0), members);
}
/**
* @see {@link Literal} for a schema that represents a single literal.
* @category Constructors
* @since 4.0.0
*/
function Literals(literals) {
	const members = literals.map(Literal);
	return make(union(members, "anyOf", void 0), {
		literals,
		members,
		mapMembers(f) {
			return Union(f(this.members));
		},
		pick(literals) {
			return Literals(literals);
		},
		transform(to) {
			return Union(members.map((member, index) => member.transform(to[index])));
		}
	});
}
/**
* @category Constructors
* @since 4.0.0
*/
const NullOr = /* @__PURE__ */ lambda((self) => Union([self, Null]));
function decodeTo(to, transformation) {
	return (from) => {
		return make(decodeTo$1(from.ast, to.ast, transformation ? make$2(transformation) : passthrough()), {
			from,
			to
		});
	};
}
/**
* @since 4.0.0
*/
function withConstructorDefault(defaultValue) {
	return (schema) => {
		return make(withConstructorDefault$1(schema.ast, defaultValue), { schema });
	};
}
/**
* Creates a schema for a literal value and automatically provides itself as a
* default.
*
* The `tag` function combines a literal schema with a constructor default,
* making it perfect for discriminated unions and tagged data structures. The
* tag value is automatically provided when the field is missing during
* construction.
*
* @since 4.0.0
*/
function tag(literal) {
	return Literal(literal).pipe(withConstructorDefault(() => some(literal)));
}
/**
* Creates a schema that validates an instance of a specific class constructor.
*
* @category Constructors
* @since 4.0.0
*/
function instanceOf(constructor, annotations) {
	return declare((u) => u instanceof constructor, annotations);
}
/**
* @since 4.0.0
* @experimental
*/
function link() {
	return (encodeTo, transformation) => {
		return new Link(encodeTo.ast, make$2(transformation));
	};
}
/**
* @category Checks Constructors
* @since 4.0.0
*/
const makeFilter = makeFilter$1;
/**
* Validates that a string matches the specified regular expression pattern.
*
* **JSON Schema**
*
* This check corresponds to the `pattern` constraint in JSON Schema.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `patterns`
* constraint to ensure generated strings match the specified RegExp pattern.
*
* @category String checks
* @since 4.0.0
*/
const isPattern = isPattern$1;
/**
* Validates that a string represents a finite number.
*
* **JSON Schema**
*
* This check corresponds to a `pattern` constraint in JSON Schema that matches
* strings representing finite numbers.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `patterns`
* constraint to ensure generated strings match the number string pattern.
*
* @category String checks
* @since 4.0.0
*/
const isStringFinite = isStringFinite$1;
/**
* Validates that a string represents a valid BigInt (can be parsed as a BigInt).
*
* **JSON Schema**
*
* This check corresponds to a `pattern` constraint in JSON Schema that matches
* strings representing BigInt values.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `patterns`
* constraint to ensure generated strings match the BigInt string pattern.
*
* @category String checks
* @since 4.0.0
*/
const isStringBigInt = isStringBigInt$1;
/**
* Validates that a string represents a valid Symbol (can be parsed as a Symbol).
*
* **JSON Schema**
*
* This check corresponds to a `pattern` constraint in JSON Schema that matches
* strings representing Symbol values.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `patterns`
* constraint to ensure generated strings match the Symbol string pattern.
*
* @category String checks
* @since 4.0.0
*/
const isStringSymbol = isStringSymbol$1;
/**
* Validates that a string is valid Base64 encoded data.
*
* **JSON Schema**
*
* This check corresponds to a `pattern` constraint in JSON Schema that matches
* Base64 format.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `patterns`
* constraint to ensure generated strings match the Base64 pattern.
*
* @category String checks
* @since 4.0.0
*/
function isBase64(annotations) {
	const regExp = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
	return isPattern(regExp, {
		expected: "a base64 encoded string",
		meta: {
			_tag: "isBase64",
			regExp
		},
		...annotations
	});
}
/**
* Validates that a number is finite (not `Infinity`, `-Infinity`, or `NaN`).
*
* **JSON Schema**
*
* This check does not have a direct JSON Schema equivalent, but ensures the
* number is valid and finite.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies `noDefaultInfinity`
* and `noNaN` constraints to ensure generated numbers are finite.
*
* @category Number checks
* @since 4.0.0
*/
function isFinite(annotations) {
	return makeFilter((n) => globalThis.Number.isFinite(n), {
		expected: "a finite number",
		meta: { _tag: "isFinite" },
		toArbitraryConstraint: { number: {
			noDefaultInfinity: true,
			noNaN: true
		} },
		...annotations
	});
}
/**
* @category Order checks
* @since 4.0.0
*/
function makeIsGreaterThan(options) {
	const gt = isGreaterThan$3(options.order);
	const formatter = options.formatter ?? format$2;
	return (exclusiveMinimum, annotations) => {
		return makeFilter((input) => gt(input, exclusiveMinimum), {
			expected: `a value greater than ${formatter(exclusiveMinimum)}`,
			...options.annotate?.(exclusiveMinimum),
			...annotations
		});
	};
}
/**
* @category Order checks
* @since 4.0.0
*/
function makeIsGreaterThanOrEqualTo(options) {
	const gte = isGreaterThanOrEqualTo$3(options.order);
	const formatter = options.formatter ?? format$2;
	return (minimum, annotations) => {
		return makeFilter((input) => gte(input, minimum), {
			expected: `a value greater than or equal to ${formatter(minimum)}`,
			...options.annotate?.(minimum),
			...annotations
		});
	};
}
/**
* @category Order checks
* @since 4.0.0
*/
function makeIsLessThan(options) {
	const lt = isLessThan$3(options.order);
	const formatter = options.formatter ?? format$2;
	return (exclusiveMaximum, annotations) => {
		return makeFilter((input) => lt(input, exclusiveMaximum), {
			expected: `a value less than ${formatter(exclusiveMaximum)}`,
			...options.annotate?.(exclusiveMaximum),
			...annotations
		});
	};
}
/**
* @category Order checks
* @since 4.0.0
*/
function makeIsLessThanOrEqualTo(options) {
	const lte = isLessThanOrEqualTo$3(options.order);
	const formatter = options.formatter ?? format$2;
	return (maximum, annotations) => {
		return makeFilter((input) => lte(input, maximum), {
			expected: `a value less than or equal to ${formatter(maximum)}`,
			...options.annotate?.(maximum),
			...annotations
		});
	};
}
/**
* @category Order checks
* @since 4.0.0
*/
function makeIsBetween(deriveOptions) {
	const greaterThanOrEqualTo = isGreaterThanOrEqualTo$3(deriveOptions.order);
	const greaterThan = isGreaterThan$3(deriveOptions.order);
	const lessThanOrEqualTo = isLessThanOrEqualTo$3(deriveOptions.order);
	const lessThan = isLessThan$3(deriveOptions.order);
	const formatter = deriveOptions.formatter ?? format$2;
	return (options, annotations) => {
		const gte = options.exclusiveMinimum ? greaterThan : greaterThanOrEqualTo;
		const lte = options.exclusiveMaximum ? lessThan : lessThanOrEqualTo;
		return makeFilter((input) => gte(input, options.minimum) && lte(input, options.maximum), {
			expected: `a value between ${formatter(options.minimum)}${options.exclusiveMinimum ? " (excluded)" : ""} and ${formatter(options.maximum)}${options.exclusiveMaximum ? " (excluded)" : ""}`,
			...deriveOptions.annotate?.(options),
			...annotations
		});
	};
}
/**
* Validates that a number is greater than the specified value (exclusive).
*
* **JSON Schema**
*
* This check corresponds to the `exclusiveMinimum` constraint in JSON Schema.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `min` constraint
* with `minExcluded: true` to ensure generated numbers are greater than the
* specified value.
*
* @category Number checks
* @since 4.0.0
*/
const isGreaterThan = /* @__PURE__ */ makeIsGreaterThan({
	order: Number$4,
	annotate: (exclusiveMinimum) => ({
		meta: {
			_tag: "isGreaterThan",
			exclusiveMinimum
		},
		toArbitraryConstraint: { number: {
			min: exclusiveMinimum,
			minExcluded: true
		} }
	})
});
/**
* Validates that a number is greater than or equal to the specified value
* (inclusive).
*
* **JSON Schema**
*
* This check corresponds to the `minimum` constraint in JSON Schema.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `min` constraint
* to ensure generated numbers are greater than or equal to the specified value.
*
* @category Number checks
* @since 4.0.0
*/
const isGreaterThanOrEqualTo = /* @__PURE__ */ makeIsGreaterThanOrEqualTo({
	order: Number$4,
	annotate: (minimum) => ({
		meta: {
			_tag: "isGreaterThanOrEqualTo",
			minimum
		},
		toArbitraryConstraint: { number: { min: minimum } }
	})
});
/**
* Validates that a number is less than the specified value (exclusive).
*
* **JSON Schema**
*
* This check corresponds to the `exclusiveMaximum` constraint in JSON Schema.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `max` constraint
* with `maxExcluded: true` to ensure generated numbers are less than the
* specified value.
*
* @category Number checks
* @since 4.0.0
*/
const isLessThan = /* @__PURE__ */ makeIsLessThan({
	order: Number$4,
	annotate: (exclusiveMaximum) => ({
		meta: {
			_tag: "isLessThan",
			exclusiveMaximum
		},
		toArbitraryConstraint: { number: {
			max: exclusiveMaximum,
			maxExcluded: true
		} }
	})
});
/**
* Validates that a number is less than or equal to the specified value
* (inclusive).
*
* **JSON Schema**
*
* This check corresponds to the `maximum` constraint in JSON Schema.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `max` constraint
* to ensure generated numbers are less than or equal to the specified value.
*
* @category Number checks
* @since 4.0.0
*/
const isLessThanOrEqualTo = /* @__PURE__ */ makeIsLessThanOrEqualTo({
	order: Number$4,
	annotate: (maximum) => ({
		meta: {
			_tag: "isLessThanOrEqualTo",
			maximum
		},
		toArbitraryConstraint: { number: { max: maximum } }
	})
});
/**
* Validates that a number is within a specified range. The range boundaries can
* be inclusive or exclusive based on the provided options.
*
* **JSON Schema**
*
* This check corresponds to `minimum`/`maximum` or `exclusiveMinimum`/`exclusiveMaximum`
* constraints in JSON Schema, depending on the options provided.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies `min` and `max`
* constraints with optional `minExcluded` and `maxExcluded` flags to ensure
* generated numbers fall within the specified range.
*
* @category Number checks
* @since 4.0.0
*/
const isBetween = /* @__PURE__ */ makeIsBetween({
	order: Number$4,
	annotate: (options) => {
		return {
			meta: {
				_tag: "isBetween",
				...options
			},
			toArbitraryConstraint: { number: {
				min: options.minimum,
				max: options.maximum,
				...options.exclusiveMinimum && { minExcluded: true },
				...options.exclusiveMaximum && { maxExcluded: true }
			} }
		};
	}
});
/**
* Validates that a number is a safe integer (within the safe integer range
* that can be exactly represented in JavaScript).
*
* **JSON Schema**
*
* This check corresponds to the `type: "integer"` constraint in JSON Schema.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies an `isInteger: true`
* constraint to ensure generated numbers are integers.
*
* @category Integer checks
* @since 4.0.0
*/
function isInt(annotations) {
	return makeFilter((n) => globalThis.Number.isSafeInteger(n), {
		expected: "an integer",
		meta: { _tag: "isInt" },
		toArbitraryConstraint: { number: { isInteger: true } },
		...annotations
	});
}
/**
* Validates that a Date object represents a valid date (not an invalid date
* like `new Date("invalid")`).
*
* **JSON Schema**
*
* This check does not have a direct JSON Schema equivalent, as JSON Schema
* validates date strings, not Date objects.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `noInvalidDate`
* constraint to ensure generated Date objects are valid.
*
* @category Date checks
* @since 4.0.0
*/
function isDateValid(annotations) {
	return makeFilter((date) => !isNaN(date.getTime()), {
		expected: "a valid date",
		meta: { _tag: "isDateValid" },
		toArbitraryConstraint: { date: { noInvalidDate: true } },
		...annotations
	});
}
/**
* Validates that a Date is greater than the specified value (exclusive).
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `min` constraint
* with `minExcluded: true` to ensure generated Date objects are greater than the
* specified value.
*
* @category Date checks
* @since 4.0.0
*/
const isGreaterThanDate = /* @__PURE__ */ makeIsGreaterThan({
	order: Date$2,
	annotate: (exclusiveMinimum) => ({
		meta: {
			_tag: "isGreaterThanDate",
			exclusiveMinimum
		},
		toArbitraryConstraint: { date: {
			min: exclusiveMinimum,
			minExcluded: true
		} }
	})
});
/**
* Validates that a Date is greater than or equal to the specified date
* (inclusive).
*
* **JSON Schema**
*
* This check does not have a direct JSON Schema equivalent, as JSON Schema
* validates date strings, not Date objects.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `min` constraint
* to ensure generated Date objects are greater than or equal to the specified
* date.
*
* @category Date checks
* @since 4.0.0
*/
const isGreaterThanOrEqualToDate = /* @__PURE__ */ makeIsGreaterThanOrEqualTo({
	order: Date$2,
	annotate: (minimum) => ({
		meta: {
			_tag: "isGreaterThanOrEqualToDate",
			minimum
		},
		toArbitraryConstraint: { date: { min: minimum } }
	})
});
/**
* Validates that a Date is less than the specified value (exclusive).
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `max` constraint
* with `maxExcluded: true` to ensure generated Date objects are less than the
* specified value.
*
* @category Date checks
* @since 4.0.0
*/
const isLessThanDate = /* @__PURE__ */ makeIsLessThan({
	order: Date$2,
	annotate: (exclusiveMaximum) => ({
		meta: {
			_tag: "isLessThanDate",
			exclusiveMaximum
		},
		toArbitraryConstraint: { date: {
			max: exclusiveMaximum,
			maxExcluded: true
		} }
	})
});
/**
* Validates that a Date is less than or equal to the specified date
* (inclusive).
*
* **JSON Schema**
*
* This check does not have a direct JSON Schema equivalent, as JSON Schema
* validates date strings, not Date objects.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `max` constraint
* to ensure generated Date objects are less than or equal to the specified
* date.
*
* @category Date checks
* @since 4.0.0
*/
const isLessThanOrEqualToDate = /* @__PURE__ */ makeIsLessThanOrEqualTo({
	order: Date$2,
	annotate: (maximum) => ({
		meta: {
			_tag: "isLessThanOrEqualToDate",
			maximum
		},
		toArbitraryConstraint: { date: { max: maximum } }
	})
});
/**
* Validates that a Date is within a specified range. The range boundaries can
* be inclusive or exclusive based on the provided options.
*
* **JSON Schema**
*
* This check does not have a direct JSON Schema equivalent, as JSON Schema
* validates date strings, not Date objects.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies `min` and `max`
* constraints to ensure generated Date objects fall within the specified range.
*
* @category Date checks
* @since 4.0.0
*/
const isBetweenDate = /* @__PURE__ */ makeIsBetween({
	order: Date$2,
	annotate: (options) => ({
		meta: {
			_tag: "isBetweenDate",
			...options
		},
		toArbitraryConstraint: { date: {
			min: options.minimum,
			max: options.maximum
		} }
	})
});
/**
* Validates that a BigInt is greater than the specified value (exclusive).
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `min` constraint
* with `minExcluded: true` to ensure generated BigInts are greater than the
* specified value.
*
* @category BigInt checks
* @since 4.0.0
*/
const isGreaterThanBigInt = /* @__PURE__ */ makeIsGreaterThan({
	order: BigInt$3,
	annotate: (exclusiveMinimum) => ({
		meta: {
			_tag: "isGreaterThanBigInt",
			exclusiveMinimum
		},
		toArbitraryConstraint: { bigint: {
			min: exclusiveMinimum,
			minExcluded: true
		} }
	})
});
/**
* Validates that a BigInt is greater than or equal to the specified value
* (inclusive).
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `min` constraint
* to ensure generated BigInt values are greater than or equal to the specified
* value.
*
* @category BigInt checks
* @since 4.0.0
*/
const isGreaterThanOrEqualToBigInt = /* @__PURE__ */ makeIsGreaterThanOrEqualTo({
	order: BigInt$3,
	annotate: (minimum) => ({
		meta: {
			_tag: "isGreaterThanOrEqualToBigInt",
			minimum
		},
		toArbitraryConstraint: { bigint: { min: minimum } }
	})
});
/**
* Validates that a BigInt is less than the specified value (exclusive).
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `max` constraint
* with `maxExcluded: true` to ensure generated BigInts are less than the
* specified value.
*
* @category BigInt checks
* @since 4.0.0
*/
const isLessThanBigInt = /* @__PURE__ */ makeIsLessThan({
	order: BigInt$3,
	annotate: (exclusiveMaximum) => ({
		meta: {
			_tag: "isLessThanBigInt",
			exclusiveMaximum
		},
		toArbitraryConstraint: { bigint: {
			max: exclusiveMaximum,
			maxExcluded: true
		} }
	})
});
/**
* Validates that a BigInt is less than or equal to the specified value
* (inclusive).
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `max` constraint
* to ensure generated BigInt values are less than or equal to the specified
* value.
*
* @category BigInt checks
* @since 4.0.0
*/
const isLessThanOrEqualToBigInt = /* @__PURE__ */ makeIsLessThanOrEqualTo({
	order: BigInt$3,
	annotate: (maximum) => ({
		meta: {
			_tag: "isLessThanOrEqualToBigInt",
			maximum
		},
		toArbitraryConstraint: { bigint: { max: maximum } }
	})
});
/**
* Validates that a BigInt is within a specified range. The range boundaries can
* be inclusive or exclusive based on the provided options.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies `min` and `max`
* constraints to ensure generated BigInt values fall within the specified
* range.
*
* @category BigInt checks
* @since 4.0.0
*/
const isBetweenBigInt = /* @__PURE__ */ makeIsBetween({
	order: BigInt$3,
	annotate: (options) => ({
		meta: {
			_tag: "isBetweenBigInt",
			...options
		},
		toArbitraryConstraint: { bigint: {
			min: options.minimum,
			max: options.maximum
		} }
	})
});
/**
* Validates that a value has at least the specified length. Works with strings
* and arrays.
*
* **JSON Schema**
*
* This check corresponds to the `minLength` constraint for strings or the
* `minItems` constraint for arrays in JSON Schema.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `minLength`
* constraint to ensure generated strings or arrays have at least the required
* length.
*
* @category Length checks
* @since 4.0.0
*/
function isMinLength(minLength, annotations) {
	minLength = Math.max(0, Math.floor(minLength));
	return makeFilter((input) => input.length >= minLength, {
		expected: `a value with a length of at least ${minLength}`,
		meta: {
			_tag: "isMinLength",
			minLength
		},
		[STRUCTURAL_ANNOTATION_KEY]: true,
		toArbitraryConstraint: {
			string: { minLength },
			array: { minLength }
		},
		...annotations
	});
}
/**
* Validates that a value has at most the specified length. Works with strings
* and arrays.
*
* **JSON Schema**
*
* This check corresponds to the `maxLength` constraint for strings or the
* `maxItems` constraint for arrays in JSON Schema.
*
* **Arbitrary**
*
* When generating test data with fast-check, this applies a `maxLength`
* constraint to ensure generated strings or arrays have at most the required
* length.
*
* @category Length checks
* @since 4.0.0
*/
function isMaxLength(maxLength, annotations) {
	maxLength = Math.max(0, Math.floor(maxLength));
	return makeFilter((input) => input.length <= maxLength, {
		expected: `a value with a length of at most ${maxLength}`,
		meta: {
			_tag: "isMaxLength",
			maxLength
		},
		[STRUCTURAL_ANNOTATION_KEY]: true,
		toArbitraryConstraint: {
			string: { maxLength },
			array: { maxLength }
		},
		...annotations
	});
}
const ErrorJsonEncoded = /* @__PURE__ */ Struct({
	message: String$1,
	name: /* @__PURE__ */ optionalKey(String$1),
	stack: /* @__PURE__ */ optionalKey(String$1)
});
/**
* A schema that represents `Error` objects.
*
* The default json serializer decodes to a struct with `name` and `message`
* properties (stack is omitted for security).
*
* @category Schemas
* @since 4.0.0
*/
const Error$1 = /* @__PURE__ */ instanceOf(globalThis.Error, {
	typeConstructor: { _tag: "Error" },
	generation: {
		runtime: `Schema.Error`,
		Type: `globalThis.Error`
	},
	expected: "Error",
	toCodecJson: () => link()(ErrorJsonEncoded, errorFromErrorJsonEncoded()),
	toArbitrary: () => (fc) => fc.string().map((message) => new globalThis.Error(message))
});
/**
* A schema that represents `Error` objects.
*
* The default json serializer decodes to a struct with `name`, `message` and
* `stack` properties.
*
* @category Schemas
* @since 4.0.0
*/
const ErrorWithStack = /* @__PURE__ */ instanceOf(globalThis.Error, {
	typeConstructor: { _tag: "ErrorWithStack" },
	generation: {
		runtime: `Schema.ErrorWithStack`,
		Type: `globalThis.Error`
	},
	expected: "Error",
	toCodecJson: () => link()(ErrorJsonEncoded, errorFromErrorJsonEncoded({ includeStack: true })),
	toArbitrary: () => (fc) => fc.string().map((message) => new globalThis.Error(message))
});
/**
* @since 4.0.0
*/
const RegExp$1 = /* @__PURE__ */ instanceOf(globalThis.RegExp, {
	typeConstructor: { _tag: "RegExp" },
	generation: {
		runtime: `Schema.RegExp`,
		Type: `globalThis.RegExp`
	},
	expected: "RegExp",
	toCodecJson: () => link()(Struct({
		source: String$1,
		flags: String$1
	}), transformOrFail({
		decode: (e) => try_({
			try: () => new globalThis.RegExp(e.source, e.flags),
			catch: (e) => new InvalidValue(some(e), { message: globalThis.String(e) })
		}),
		encode: (regExp) => succeed({
			source: regExp.source,
			flags: regExp.flags
		})
	})),
	toArbitrary: () => (fc) => fc.tuple(fc.constantFrom(".", ".*", "\\d+", "\\w+", "[a-z]+", "[A-Z]+", "[0-9]+", "^[a-zA-Z0-9]+$", "^\\d{4}-\\d{2}-\\d{2}$"), fc.uniqueArray(fc.constantFrom("g", "i", "m", "s", "u", "y"), {
		minLength: 0,
		maxLength: 6
	}).map((flags) => flags.join(""))).map(([source, flags]) => new globalThis.RegExp(source, flags)),
	toEquivalence: () => (a, b) => a.source === b.source && a.flags === b.flags
});
/**
* A schema for JavaScript `URL` objects.
*
* **Default JSON serializer**
*
* - encodes `URL` as a `string`
*
* @since 4.0.0
* @category URL
*/
const URL$1 = /* @__PURE__ */ instanceOf(globalThis.URL, {
	typeConstructor: { _tag: "URL" },
	generation: {
		runtime: `Schema.URL`,
		Type: `globalThis.URL`
	},
	expected: "URL",
	toCodecJson: () => link()(String$1.annotate({ expected: "a string that will be decoded as a URL" }), urlFromString),
	toArbitrary: () => (fc) => fc.webUrl().map((s) => new globalThis.URL(s)),
	toEquivalence: () => (a, b) => a.toString() === b.toString()
});
/**
* A transformation schema that decodes a `string` into a `URL`.
*
* Decoding:
* - A **valid** URL `string` is decoded as a `URL`
*
* Encoding:
* - A `URL` is encoded as a `string`
*
* @category URL
* @since 4.0.0
*/
const URLFromString = /* @__PURE__ */ String$1.annotate({ expected: "a string that will be decoded as a URL" }).pipe(/* @__PURE__ */ decodeTo(URL$1, urlFromString));
/**
* A schema for JavaScript `Date` objects.
*
* This schema accepts any `Date` instance, including invalid dates (e.g., `new
* Date("invalid")`). For validating only valid dates, use `ValidDate` instead.
*
* @since 4.0.0
*/
const Date$1 = /* @__PURE__ */ instanceOf(globalThis.Date, {
	typeConstructor: { _tag: "Date" },
	generation: {
		runtime: `Schema.Date`,
		Type: `globalThis.Date`
	},
	expected: "Date",
	toCodecJson: () => link()(String$1.annotate({ expected: "a string in ISO 8601 format that will be decoded as a Date" }), transform({
		decode: (s) => new globalThis.Date(s),
		encode: formatDate
	})),
	toArbitrary: () => (fc, ctx) => fc.date(ctx?.constraints?.date)
});
/**
* A schema for **valid** JavaScript `Date` objects.
*
* This schema accepts `Date` instances but rejects invalid dates (such as `new
* Date("invalid")`).
*
* @since 4.0.0
*/
const DateValid = /* @__PURE__ */ Date$1.check(/* @__PURE__ */ isDateValid());
/**
* A schema for `Duration` values.
*
* **Default JSON serializer**
*
* - encodes `Duration` as a `string`
*
* @since 4.0.0
*/
const Duration = /* @__PURE__ */ declare(isDuration, {
	typeConstructor: { _tag: "effect/Duration" },
	generation: {
		runtime: `Schema.Duration`,
		Type: `Duration.Duration`,
		importDeclaration: `import * as Duration from "effect/Duration"`
	},
	expected: "Duration",
	toCodecJson: () => link()(Union([
		Struct({ _tag: Literal("Infinity") }),
		Struct({ _tag: Literal("NegativeInfinity") }),
		Struct({
			_tag: Literal("Nanos"),
			value: BigInt$1
		}),
		Struct({
			_tag: Literal("Millis"),
			value: Int
		})
	]), transform({
		decode: (e) => {
			switch (e._tag) {
				case "Infinity": return infinity;
				case "NegativeInfinity": return negativeInfinity;
				case "Nanos": return nanos(e.value);
				case "Millis": return millis(e.value);
			}
		},
		encode: (duration) => {
			switch (duration.value._tag) {
				case "Infinity": return { _tag: "Infinity" };
				case "NegativeInfinity": return { _tag: "NegativeInfinity" };
				case "Nanos": return {
					_tag: "Nanos",
					value: duration.value.nanos
				};
				case "Millis": return {
					_tag: "Millis",
					value: duration.value.millis
				};
			}
		}
	})),
	toArbitrary: () => (fc) => fc.oneof(fc.constant(infinity), fc.constant(negativeInfinity), fc.bigInt().map(nanos), fc.maxSafeInteger().map(millis)),
	toFormatter: () => globalThis.String,
	toEquivalence: () => Equivalence$2
});
/**
* A transformation schema that decodes a non-negative `bigint` into a
* `Duration`, treating the `bigint` value as the duration in nanoseconds.
*
* Decoding:
* - A non-negative `bigint` representing nanoseconds is decoded as a `Duration`
*
* Encoding:
* - A `Duration` is encoded to a non-negative `bigint` representing nanoseconds
*
* @category Duration
* @since 4.0.0
*/
const DurationFromNanos = /* @__PURE__ */ BigInt$1.check(isGreaterThanOrEqualToBigInt(0n)).pipe(/* @__PURE__ */ decodeTo(Duration, durationFromNanos));
/**
* A transformation schema that decodes a non-negative (possibly infinite)
* integer into a `Duration`, treating the integer value as the duration in
* milliseconds.
*
* Decoding:
* - A non-negative (possibly infinite) integer representing milliseconds is
*   decoded as a `Duration`
*
* Encoding:
* - A `Duration` is encoded to a non-negative (possibly infinite) integer
*   representing milliseconds
*
* @category Duration
* @since 4.0.0
*/
const DurationFromMillis = /* @__PURE__ */ Number$1.check(isGreaterThanOrEqualTo(0)).pipe(/* @__PURE__ */ decodeTo(Duration, durationFromMillis));
/**
* @since 4.0.0
*/
const File = /* @__PURE__ */ instanceOf(globalThis.File, {
	typeConstructor: { _tag: "File" },
	generation: {
		runtime: `Schema.File`,
		Type: `globalThis.File`
	},
	expected: "File",
	toCodecJson: () => link()(Struct({
		data: String$1.check(isBase64()),
		type: String$1,
		name: String$1,
		lastModified: Number$1
	}), transformOrFail({
		decode: (e) => match$6(decode(e.data), {
			onFailure: (error) => fail(new InvalidValue(some(e.data), { message: error.message })),
			onSuccess: (bytes) => {
				const buffer = new globalThis.Uint8Array(bytes);
				return succeed(new globalThis.File([buffer], e.name, {
					type: e.type,
					lastModified: e.lastModified
				}));
			}
		}),
		encode: (file) => tryPromise({
			try: async () => {
				const bytes = new globalThis.Uint8Array(await file.arrayBuffer());
				return {
					data: encode(bytes),
					type: file.type,
					name: file.name,
					lastModified: file.lastModified
				};
			},
			catch: (e) => new InvalidValue(some(file), { message: globalThis.String(e) })
		})
	}))
});
/**
* @since 4.0.0
*/
const FormData$1 = /* @__PURE__ */ instanceOf(globalThis.FormData, {
	typeConstructor: { _tag: "FormData" },
	generation: {
		runtime: `Schema.FormData`,
		Type: `globalThis.FormData`
	},
	expected: "FormData",
	toCodecJson: () => link()(Array$1(Tuple([String$1, Union([Struct({
		_tag: tag("String"),
		value: String$1
	}), Struct({
		_tag: tag("File"),
		value: File
	})])])), transformOrFail({
		decode: (e) => {
			const out = new globalThis.FormData();
			for (const [key, entry] of e) out.append(key, entry.value);
			return succeed(out);
		},
		encode: (formData) => {
			return succeed(globalThis.Array.from(formData.entries()).map(([key, value]) => {
				if (typeof value === "string") return [key, {
					_tag: "String",
					value
				}];
				else return [key, {
					_tag: "File",
					value
				}];
			}));
		}
	}))
});
/**
* @since 4.0.0
*/
const URLSearchParams$1 = /* @__PURE__ */ instanceOf(globalThis.URLSearchParams, {
	typeConstructor: { _tag: "URLSearchParams" },
	generation: {
		runtime: `Schema.URLSearchParams`,
		Type: `globalThis.URLSearchParams`
	},
	expected: "URLSearchParams",
	toCodecJson: () => link()(String$1.annotate({ expected: "a query string that will be decoded as URLSearchParams" }), transform({
		decode: (e) => new globalThis.URLSearchParams(e),
		encode: (params) => params.toString()
	}))
});
/**
* A schema for finite numbers, rejecting `NaN`, `Infinity`, and `-Infinity`.
*
* @since 4.0.0
*/
const Finite = /* @__PURE__ */ Number$1.check(/* @__PURE__ */ isFinite());
/**
* A schema for integers, rejecting `NaN`, `Infinity`, and `-Infinity`.
*
* @since 4.0.0
*/
const Int = /* @__PURE__ */ Number$1.check(/* @__PURE__ */ isInt());
/**
* A transformation schema that parses a string into a number.
*
* Decoding:
* - A `string` is decoded as a finite number.
*
* Encoding:
* - A number is encoded as a `string`.
*
* @since 4.0.0
*/
const NumberFromString = /* @__PURE__ */ String$1.annotate({ expected: "a string that will be decoded as a number" }).pipe(/* @__PURE__ */ decodeTo(Number$1, numberFromString));
/**
* A transformation schema that parses a string into a finite number.
*
* Decoding:
* - A `string` is decoded as a finite number, rejecting `NaN`, `Infinity`, and
*   `-Infinity` values.
*
* Encoding:
* - A finite number is encoded as a `string`.
*
* @since 4.0.0
*/
const FiniteFromString = /* @__PURE__ */ String$1.annotate({ expected: "a string that will be decoded as a finite number" }).pipe(/* @__PURE__ */ decodeTo(Finite, numberFromString));
const Base64String = /* @__PURE__ */ String$1.annotate({
	expected: "a base64 encoded string that will be decoded as Uint8Array",
	format: "byte",
	contentEncoding: "base64"
});
/**
* A schema for JavaScript `Uint8Array` objects.
*
* **Default JSON serializer**
*
* The default JSON serializer encodes Uint8Array as a Base64 encoded string.
*
* @category Uint8Array
* @since 4.0.0
*/
const Uint8Array$1 = /* @__PURE__ */ instanceOf(globalThis.Uint8Array, {
	typeConstructor: { _tag: "Uint8Array" },
	generation: {
		runtime: `Schema.Uint8Array`,
		Type: `globalThis.Uint8Array`
	},
	expected: "Uint8Array",
	toCodecJson: () => link()(Base64String, uint8ArrayFromBase64String),
	toArbitrary: () => (fc) => fc.uint8Array()
});
/**
* A transformation schema that decodes a base64 encoded string into a
* `Uint8Array`.
*
* Decoding:
* - A **valid** base64 encoded string is decoded as a `Uint8Array`.
*
* Encoding:
* - A `Uint8Array` is encoded as a base64-encoded string.
*
* @category Uint8Array
* @since 4.0.0
*/
const Uint8ArrayFromBase64 = /* @__PURE__ */ Base64String.pipe(/* @__PURE__ */ decodeTo(Uint8Array$1, uint8ArrayFromBase64String));
/**
* A schema for `DateTime.Utc` values.
*
* **Default JSON serializer**
*
* - encodes `DateTime.Utc` as a UTC ISO string
*
* @category DateTime
* @since 4.0.0
*/
const DateTimeUtc = /* @__PURE__ */ declare((u) => isDateTime(u) && isUtc(u), {
	typeConstructor: { _tag: "DateTime.Utc" },
	generation: {
		runtime: `Schema.DateTimeUtc`,
		Type: `DateTime.Utc`,
		importDeclaration: `import * as DateTime from "effect/DateTime"`
	},
	expected: "DateTime.Utc",
	toCodecJson: () => link()(String$1, {
		decode: dateTimeUtcFromInput(),
		encode: transform$1(formatIso)
	}),
	toArbitrary: () => (fc, ctx) => fc.date({
		noInvalidDate: true,
		...ctx?.constraints?.date
	}).map((date) => fromDateUnsafe(date)),
	toFormatter: () => (utc) => utc.toString(),
	toEquivalence: () => Equivalence
});
/**
* A transformation schema that decodes a `Date` into a `DateTime.Utc`.
*
* Decoding:
* - A **valid** `Date` is decoded as a `DateTime.Utc`
*
* Encoding:
* - A `DateTime.Utc` is encoded as a `Date`
*
* @category DateTime
* @since 4.0.0
*/
const DateTimeUtcFromDate = /* @__PURE__ */ DateValid.pipe(/* @__PURE__ */ decodeTo(DateTimeUtc, {
	decode: /* @__PURE__ */ dateTimeUtcFromInput(),
	encode: /* @__PURE__ */ transform$1(toDateUtc)
}));
/**
* A transformation schema that decodes a string into a `DateTime.Utc`.
*
* Decoding:
* - A `string` that can be parsed by `Date.parse` is decoded as a
*   `DateTime.Utc`
*
* Encoding:
* - A `DateTime.Utc` is encoded as a `string` in ISO 8601 format, ignoring any
*   time zone.
*
* @category DateTime
* @since 4.0.0
*/
const DateTimeUtcFromString = /* @__PURE__ */ String$1.annotate({ expected: "a string that will be decoded as a DateTime.Utc" }).pipe(/* @__PURE__ */ decodeTo(DateTimeUtc, /* @__PURE__ */ transform({
	decode: makeUnsafe$1,
	encode: formatIso
})));
/**
* A transformation schema that decodes a number into a `DateTime.Utc`.
*
* Decoding:
* - A number of milliseconds since the Unix epoch is decoded as a `DateTime.Utc`
*
* Encoding:
* - A `DateTime.Utc` is encoded as a number of milliseconds since the Unix epoch.
*
* @category DateTime
* @since 4.0.0
*/
const DateTimeUtcFromMillis = /* @__PURE__ */ Number$1.pipe(/* @__PURE__ */ decodeTo(DateTimeUtc, {
	decode: /* @__PURE__ */ dateTimeUtcFromInput(),
	encode: /* @__PURE__ */ transform$1(toEpochMillis)
}));
const unknownToUndefined = /* @__PURE__ */ new Link(undefined_, /* @__PURE__ */ new Transformation(/* @__PURE__ */ passthrough$1(), /* @__PURE__ */ transform$1(() => void 0)));

//#endregion
//#region ../schemas/libraries/effect___beta/download.ts
const Image = Struct({
	id: Number$1,
	created: instanceOf(Date),
	title: String$1.check(isMinLength(1), isMaxLength(100)),
	type: Literals(["jpg", "png"]),
	size: Number$1,
	url: String$1.check(makeFilter((value) => {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	}))
});
const Rating = Struct({
	id: Number$1,
	stars: Number$1.check(isGreaterThanOrEqualTo(0), isLessThanOrEqualTo(5)),
	title: String$1.check(isMinLength(1), isMaxLength(100)),
	text: String$1.check(isMinLength(1), isMaxLength(1e3)),
	images: mutable(Array$1(Image))
});
const Product = Struct({
	id: Number$1,
	created: instanceOf(Date),
	title: String$1.check(isMinLength(1), isMaxLength(100)),
	brand: String$1.check(isMinLength(1), isMaxLength(30)),
	description: String$1.check(isMinLength(1), isMaxLength(500)),
	price: Number$1.check(isGreaterThanOrEqualTo(1), isLessThanOrEqualTo(1e4)),
	discount: NullOr(Number$1.check(isGreaterThanOrEqualTo(1), isLessThanOrEqualTo(100))),
	quantity: Number$1.check(isGreaterThanOrEqualTo(1), isLessThanOrEqualTo(10)),
	tags: mutable(Array$1(String$1.check(isMinLength(1), isMaxLength(30)))),
	images: mutable(Array$1(Image)),
	ratings: mutable(Array$1(Rating))
});
decodeUnknownSync(Product)({});

//#endregion