//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Function.js
/**
* Tests if a value is a `function`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isFunction } from "effect/Predicate"
*
* assert.deepStrictEqual(isFunction(isFunction), true)
* assert.deepStrictEqual(isFunction("function"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isFunction$1 = (input) => typeof input === "function";
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
* @since 2.0.0
*/
const dual = function(arity, body) {
	if (typeof arity === "function") return function() {
		if (arity(arguments)) return body.apply(this, arguments);
		return (self) => body(self, ...arguments);
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
		case 4: return function(a, b, c, d) {
			if (arguments.length >= 4) return body(a, b, c, d);
			return function(self) {
				return body(self, a, b, c);
			};
		};
		case 5: return function(a, b, c, d, e) {
			if (arguments.length >= 5) return body(a, b, c, d, e);
			return function(self) {
				return body(self, a, b, c, d);
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
* import * as assert from "node:assert"
* import { identity } from "effect/Function"
*
* assert.deepStrictEqual(identity(5), 5)
* ```
*
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
* import * as assert from "node:assert"
* import { constant } from "effect/Function"
*
* const constNull = constant(null)
*
* assert.deepStrictEqual(constNull(), null)
* assert.deepStrictEqual(constNull(), null)
* ```
*
* @since 2.0.0
*/
const constant = (value) => () => value;
/**
* A thunk that returns always `true`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { constTrue } from "effect/Function"
*
* assert.deepStrictEqual(constTrue(), true)
* ```
*
* @since 2.0.0
*/
const constTrue = /* @__PURE__ */ constant(true);
/**
* A thunk that returns always `false`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { constFalse } from "effect/Function"
*
* assert.deepStrictEqual(constFalse(), false)
* ```
*
* @since 2.0.0
*/
const constFalse = /* @__PURE__ */ constant(false);
/**
* A thunk that returns always `undefined`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { constUndefined } from "effect/Function"
*
* assert.deepStrictEqual(constUndefined(), undefined)
* ```
*
* @since 2.0.0
*/
const constUndefined = /* @__PURE__ */ constant(void 0);
/**
* A thunk that returns always `void`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { constVoid } from "effect/Function"
*
* assert.deepStrictEqual(constVoid(), undefined)
* ```
*
* @since 2.0.0
*/
const constVoid = constUndefined;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
	switch (arguments.length) {
		case 1: return a;
		case 2: return ab(a);
		case 3: return bc(ab(a));
		case 4: return cd(bc(ab(a)));
		case 5: return de(cd(bc(ab(a))));
		case 6: return ef(de(cd(bc(ab(a)))));
		case 7: return fg(ef(de(cd(bc(ab(a))))));
		case 8: return gh(fg(ef(de(cd(bc(ab(a)))))));
		case 9: return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
		default: {
			let ret = arguments[0];
			for (let i = 1; i < arguments.length; i++) ret = arguments[i](ret);
			return ret;
		}
	}
}
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Equivalence.js
/**
* This module provides an implementation of the `Equivalence` type class, which defines a binary relation
* that is reflexive, symmetric, and transitive. In other words, it defines a notion of equivalence between values of a certain type.
* These properties are also known in mathematics as an "equivalence relation".
*
* @since 2.0.0
*/
/**
* @category constructors
* @since 2.0.0
*/
const make$25 = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
const isStrictEquivalent = (x, y) => x === y;
/**
* Return an `Equivalence` that uses strict equality (===) to compare values.
*
* @since 2.0.0
* @category constructors
*/
const strict = () => isStrictEquivalent;
/**
* @category instances
* @since 2.0.0
*/
const number$2 = /* @__PURE__ */ strict();
/**
* @category mapping
* @since 2.0.0
*/
const mapInput$1 = /* @__PURE__ */ dual(2, (self, f) => make$25((x, y) => self(f(x), f(y))));
/**
* @category instances
* @since 2.0.0
*/
const Date$1 = /* @__PURE__ */ mapInput$1(number$2, (date) => date.getTime());
/**
* Creates a new `Equivalence` for an array of values based on a given `Equivalence` for the elements of the array.
*
* @category combinators
* @since 2.0.0
*/
const array$1 = (item) => make$25((self, that) => {
	if (self.length !== that.length) return false;
	for (let i = 0; i < self.length; i++) if (!item(self[i], that[i])) return false;
	return true;
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/GlobalValue.js
/**
* The `GlobalValue` module ensures that a single instance of a value is created globally,
* even when modules are imported multiple times (e.g., due to mixing CommonJS and ESM builds)
* or during hot-reloading in development environments like Next.js or Remix.
*
* It achieves this by using a versioned global store, identified by a unique `Symbol` tied to
* the current version of the `effect` library. The store holds values that are keyed by an identifier,
* allowing the reuse of previously computed instances across imports or reloads.
*
* This pattern is particularly useful in scenarios where frequent reloading can cause services or
* single-instance objects to be recreated unnecessarily, such as in development environments with hot-reloading.
*
* @since 2.0.0
*/
const globalStoreId = `effect/GlobalValue`;
let globalStore;
/**
* Retrieves or computes a global value associated with the given `id`. If the value for this `id`
* has already been computed, it will be returned from the global store. If it does not exist yet,
* the provided `compute` function will be executed to compute the value, store it, and then return it.
*
* This ensures that even in cases where the module is imported multiple times (e.g., in mixed environments
* like CommonJS and ESM, or during hot-reloading in development), the value is computed only once and reused
* thereafter.
*
* @example
* ```ts
* import { globalValue } from "effect/GlobalValue"
*
* // This cache will persist as long as the module is running,
* // even if reloaded or imported elsewhere
* const myCache = globalValue(
*   Symbol.for("myCache"),
*   () => new WeakMap<object, number>()
* )
* ```
*
* @since 2.0.0
*/
const globalValue = (id, compute) => {
	if (!globalStore) {
		globalThis[globalStoreId] ??= /* @__PURE__ */ new Map();
		globalStore = globalThis[globalStoreId];
	}
	if (!globalStore.has(id)) globalStore.set(id, compute());
	return globalStore.get(id);
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Predicate.js
/**
* This module provides a collection of functions for working with predicates and refinements.
*
* A `Predicate<A>` is a function that takes a value of type `A` and returns a boolean.
* It is used to check if a value satisfies a certain condition.
*
* A `Refinement<A, B>` is a special type of predicate that not only checks a condition
* but also provides a type guard, allowing TypeScript to narrow the type of the input
* value from `A` to a more specific type `B` within a conditional block.
*
* The module includes:
* - Basic predicates and refinements for common types (e.g., `isString`, `isNumber`).
* - Combinators to create new predicates from existing ones (e.g., `and`, `or`, `not`).
* - Advanced combinators for working with data structures (e.g., `tuple`, `struct`).
* - Type-level utilities for inspecting predicate and refinement types.
*
* @since 2.0.0
*/
/**
* A predicate that checks if a value is "truthy" in JavaScript.
* Fails for `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isTruthy } from "effect/Predicate"
*
* assert.strictEqual(isTruthy(1), true)
* assert.strictEqual(isTruthy("hello"), true)
* assert.strictEqual(isTruthy({}), true)
*
* assert.strictEqual(isTruthy(0), false)
* assert.strictEqual(isTruthy(""), false)
* assert.strictEqual(isTruthy(null), false)
* assert.strictEqual(isTruthy(undefined), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isTruthy = (input) => !!input;
/**
* A refinement that checks if a value is a `string`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isString } from "effect/Predicate"
*
* assert.strictEqual(isString("hello"), true)
* assert.strictEqual(isString(""), true)
*
* assert.strictEqual(isString(123), false)
* assert.strictEqual(isString(null), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isString = (input) => typeof input === "string";
/**
* A refinement that checks if a value is a `number`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isNumber } from "effect/Predicate"
*
* assert.strictEqual(isNumber(123), true)
* assert.strictEqual(isNumber(0), true)
* assert.strictEqual(isNumber(-1.5), true)
* assert.strictEqual(isNumber(NaN), true)
*
* assert.strictEqual(isNumber("123"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isNumber = (input) => typeof input === "number";
/**
* A refinement that checks if a value is a `boolean`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isBoolean } from "effect/Predicate"
*
* assert.strictEqual(isBoolean(true), true)
* assert.strictEqual(isBoolean(false), true)
*
* assert.strictEqual(isBoolean("true"), false)
* assert.strictEqual(isBoolean(0), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isBoolean = (input) => typeof input === "boolean";
/**
* A refinement that checks if a value is a `bigint`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isBigInt } from "effect/Predicate"
*
* assert.strictEqual(isBigInt(1n), true)
*
* assert.strictEqual(isBigInt(1), false)
* assert.strictEqual(isBigInt("1"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isBigInt = (input) => typeof input === "bigint";
/**
* A refinement that checks if a value is a `symbol`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isSymbol } from "effect/Predicate"
*
* assert.strictEqual(isSymbol(Symbol.for("a")), true)
*
* assert.strictEqual(isSymbol("a"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isSymbol = (input) => typeof input === "symbol";
/**
* A refinement that checks if a value is a `Function`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isFunction } from "effect/Predicate"
*
* assert.strictEqual(isFunction(() => {}), true)
* assert.strictEqual(isFunction(isFunction), true)
*
* assert.strictEqual(isFunction("function"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isFunction = isFunction$1;
/**
* A refinement that checks if a value is `undefined`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isUndefined } from "effect/Predicate"
*
* assert.strictEqual(isUndefined(undefined), true)
*
* assert.strictEqual(isUndefined(null), false)
* assert.strictEqual(isUndefined("undefined"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isUndefined = (input) => input === void 0;
/**
* A refinement that always returns `false`. The type is narrowed to `never`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isNever } from "effect/Predicate"
*
* assert.strictEqual(isNever(1), false)
* assert.strictEqual(isNever(null), false)
* assert.strictEqual(isNever({}), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isNever = (_) => false;
/**
* Checks if the input is an object or an array.
* @internal
*/
const isRecordOrArray = (input) => typeof input === "object" && input !== null;
/**
* A refinement that checks if a value is an `object`. Note that in JavaScript,
* arrays and functions are also considered objects.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isObject } from "effect/Predicate"
*
* assert.strictEqual(isObject({}), true)
* assert.strictEqual(isObject([]), true)
* assert.strictEqual(isObject(() => {}), true)
*
* assert.strictEqual(isObject(null), false)
* assert.strictEqual(isObject("hello"), false)
* ```
*
* @category guards
* @since 2.0.0
* @see isRecord to check for plain objects (excluding arrays and functions).
*/
const isObject = (input) => isRecordOrArray(input) || isFunction(input);
/**
* A refinement that checks if a value is an object-like value and has a specific property key.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { hasProperty } from "effect/Predicate"
*
* assert.strictEqual(hasProperty({ a: 1 }, "a"), true)
* assert.strictEqual(hasProperty({ a: 1 }, "b"), false)
*
* const value: unknown = { name: "Alice" };
* if (hasProperty(value, "name")) {
*   // The type of `value` is narrowed to `{ name: unknown }`
*   // and we can safely access `value.name`
*   console.log(value.name)
* }
* ```
*
* @category guards
* @since 2.0.0
*/
const hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObject(self) && property in self);
/**
* A refinement that checks if a value is an object with a `_tag` property
* that matches the given tag. This is a powerful tool for working with
* discriminated union types.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isTagged } from "effect/Predicate"
*
* type Shape = { _tag: "circle"; radius: number } | { _tag: "square"; side: number }
*
* const isCircle = isTagged("circle")
*
* const shape1: Shape = { _tag: "circle", radius: 10 }
* const shape2: Shape = { _tag: "square", side: 5 }
*
* assert.strictEqual(isCircle(shape1), true)
* assert.strictEqual(isCircle(shape2), false)
*
* if (isCircle(shape1)) {
*   // shape1 is now narrowed to { _tag: "circle"; radius: number }
*   assert.strictEqual(shape1.radius, 10)
* }
* ```
*
* @category guards
* @since 2.0.0
*/
const isTagged = /* @__PURE__ */ dual(2, (self, tag) => hasProperty(self, "_tag") && self["_tag"] === tag);
/**
* A refinement that checks if a value is either `null` or `undefined`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isNullable } from "effect/Predicate"
*
* assert.strictEqual(isNullable(null), true)
* assert.strictEqual(isNullable(undefined), true)
*
* assert.strictEqual(isNullable(0), false)
* assert.strictEqual(isNullable(""), false)
* ```
*
* @category guards
* @since 2.0.0
* @see isNotNullable
*/
const isNullable = (input) => input === null || input === void 0;
/**
* A refinement that checks if a value is neither `null` nor `undefined`.
* The type is narrowed to `NonNullable<A>`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isNotNullable } from "effect/Predicate"
*
* assert.strictEqual(isNotNullable(0), true)
* assert.strictEqual(isNotNullable("hello"), true)
*
* assert.strictEqual(isNotNullable(null), false)
* assert.strictEqual(isNotNullable(undefined), false)
* ```
*
* @category guards
* @since 2.0.0
* @see isNullable
*/
const isNotNullable = (input) => input !== null && input !== void 0;
/**
* A refinement that checks if a value is a `Uint8Array`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isUint8Array } from "effect/Predicate"
*
* assert.strictEqual(isUint8Array(new Uint8Array()), true)
*
* assert.strictEqual(isUint8Array(new Uint16Array()), false)
* assert.strictEqual(isUint8Array([1, 2, 3]), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isUint8Array = (input) => input instanceof Uint8Array;
/**
* A refinement that checks if a value is a `Date` object.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isDate } from "effect/Predicate"
*
* assert.strictEqual(isDate(new Date()), true)
*
* assert.strictEqual(isDate(Date.now()), false) // `Date.now()` returns a number
* assert.strictEqual(isDate("2023-01-01"), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isDate = (input) => input instanceof Date;
/**
* A refinement that checks if a value is an `Iterable`.
* Many built-in types are iterable, such as `Array`, `string`, `Map`, and `Set`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isIterable } from "effect/Predicate"
*
* assert.strictEqual(isIterable([]), true)
* assert.strictEqual(isIterable("hello"), true)
* assert.strictEqual(isIterable(new Set()), true)
*
* assert.strictEqual(isIterable({}), false)
* assert.strictEqual(isIterable(123), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isIterable = (input) => typeof input === "string" || hasProperty(input, Symbol.iterator);
/**
* A refinement that checks if a value is a record (i.e., a plain object).
* This check returns `false` for arrays, `null`, and functions.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isRecord } from "effect/Predicate"
*
* assert.strictEqual(isRecord({}), true)
* assert.strictEqual(isRecord({ a: 1 }), true)
*
* assert.strictEqual(isRecord([]), false)
* assert.strictEqual(isRecord(new Date()), false)
* assert.strictEqual(isRecord(null), false)
* assert.strictEqual(isRecord(() => null), false)
* ```
*
* @category guards
* @since 2.0.0
* @see isObject
*/
const isRecord = (input) => isRecordOrArray(input) && !Array.isArray(input);
/**
* A refinement that checks if a value is `PromiseLike`. It performs a duck-typing
* check for a `.then` method.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isPromiseLike } from "effect/Predicate"
*
* assert.strictEqual(isPromiseLike(Promise.resolve(1)), true)
* assert.strictEqual(isPromiseLike({ then: () => {} }), true)
*
* assert.strictEqual(isPromiseLike({}), false)
* ```
*
* @category guards
* @since 2.0.0
* @see isPromise
*/
const isPromiseLike = (input) => hasProperty(input, "then") && isFunction(input.then);
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/errors.js
/**
* @since 2.0.0
*/
/** @internal */
const getBugErrorMessage = (message) => `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Utils.js
/**
* @category constructors
* @since 2.0.0
*/
var SingleShotGen$1 = class SingleShotGen$1 {
	self;
	called = false;
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
	return(a) {
		return {
			value: a,
			done: true
		};
	}
	/**
	* @since 2.0.0
	*/
	throw(e) {
		throw e;
	}
	/**
	* @since 2.0.0
	*/
	[Symbol.iterator]() {
		return new SingleShotGen$1(this.self);
	}
};
const defaultIncHi = 335903614;
const defaultIncLo = 4150755663;
const MUL_HI = 1481765933;
const MUL_LO = 1284865837;
const BIT_53 = 9007199254740992;
const BIT_27 = 134217728;
/**
* PCG is a family of simple fast space-efficient statistically good algorithms
* for random number generation. Unlike many general-purpose RNGs, they are also
* hard to predict.
*
* @category model
* @since 2.0.0
*/
var PCGRandom = class {
	_state;
	constructor(seedHi, seedLo, incHi, incLo) {
		if (isNullable(seedLo) && isNullable(seedHi)) {
			seedLo = Math.random() * 4294967295 >>> 0;
			seedHi = 0;
		} else if (isNullable(seedLo)) {
			seedLo = seedHi;
			seedHi = 0;
		}
		if (isNullable(incLo) && isNullable(incHi)) {
			incLo = this._state ? this._state[3] : defaultIncLo;
			incHi = this._state ? this._state[2] : defaultIncHi;
		} else if (isNullable(incLo)) {
			incLo = incHi;
			incHi = 0;
		}
		this._state = new Int32Array([
			0,
			0,
			incHi >>> 0,
			((incLo || 0) | 1) >>> 0
		]);
		this._next();
		add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
		this._next();
		return this;
	}
	/**
	* Returns a copy of the internal state of this random number generator as a
	* JavaScript Array.
	*
	* @category getters
	* @since 2.0.0
	*/
	getState() {
		return [
			this._state[0],
			this._state[1],
			this._state[2],
			this._state[3]
		];
	}
	/**
	* Restore state previously retrieved using `getState()`.
	*
	* @since 2.0.0
	*/
	setState(state) {
		this._state[0] = state[0];
		this._state[1] = state[1];
		this._state[2] = state[2];
		this._state[3] = state[3] | 1;
	}
	/**
	* Get a uniformly distributed 32 bit integer between [0, max).
	*
	* @category getter
	* @since 2.0.0
	*/
	integer(max) {
		return Math.round(this.number() * Number.MAX_SAFE_INTEGER) % max;
	}
	/**
	* Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
	* 53 bits of precision (every bit of the mantissa is randomized).
	*
	* @category getters
	* @since 2.0.0
	*/
	number() {
		const hi = (this._next() & 67108863) * 1;
		const lo = (this._next() & 134217727) * 1;
		return (hi * BIT_27 + lo) / BIT_53;
	}
	/** @internal */
	_next() {
		const oldHi = this._state[0] >>> 0;
		const oldLo = this._state[1] >>> 0;
		mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
		add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
		let xsHi = oldHi >>> 18;
		let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
		xsHi = (xsHi ^ oldHi) >>> 0;
		xsLo = (xsLo ^ oldLo) >>> 0;
		const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
		const rot = oldHi >>> 27;
		const rot2 = (-rot >>> 0 & 31) >>> 0;
		return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
	}
};
function mul64(out, aHi, aLo, bHi, bLo) {
	let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
	let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
	let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
	let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
	c0 = c0 << 16 >>> 0;
	lo = lo + c0 >>> 0;
	if (lo >>> 0 < c0 >>> 0) hi = hi + 1 >>> 0;
	c1 = c1 << 16 >>> 0;
	lo = lo + c1 >>> 0;
	if (lo >>> 0 < c1 >>> 0) hi = hi + 1 >>> 0;
	hi = hi + Math.imul(aLo, bHi) >>> 0;
	hi = hi + Math.imul(aHi, bLo) >>> 0;
	out[0] = hi;
	out[1] = lo;
}
function add64(out, aHi, aLo, bHi, bLo) {
	let hi = aHi + bHi >>> 0;
	const lo = aLo + bLo >>> 0;
	if (lo >>> 0 < aLo >>> 0) hi = hi + 1 | 0;
	out[0] = hi;
	out[1] = lo;
}
/**
* @since 3.0.6
*/
const YieldWrapTypeId = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
/**
* @since 3.0.6
*/
var YieldWrap = class {
	/**
	* @since 3.0.6
	*/
	#value;
	constructor(value) {
		this.#value = value;
	}
	/**
	* @since 3.0.6
	*/
	[YieldWrapTypeId]() {
		return this.#value;
	}
};
/**
* @since 3.0.6
*/
function yieldWrapGet(self) {
	if (typeof self === "object" && self !== null && YieldWrapTypeId in self) return self[YieldWrapTypeId]();
	throw new Error(getBugErrorMessage("yieldWrapGet"));
}
/**
* Note: this is an experimental feature made available to allow custom matchers in tests, not to be directly used yet in user code
*
* @since 3.1.1
* @status experimental
* @category modifiers
*/
const structuralRegionState = /* @__PURE__ */ globalValue("effect/Utils/isStructuralRegion", () => ({
	enabled: false,
	tester: void 0
}));
const standard = { effect_internal_function: (body) => {
	return body();
} };
/**
* @since 3.2.2
* @status experimental
* @category tracing
*/
const internalCall = /* @__PURE__ */ standard.effect_internal_function(() => (/* @__PURE__ */ new Error()).stack)?.includes("effect_internal_function") === true ? standard.effect_internal_function : { effect_internal_function: (body) => {
	try {
		return body();
	} finally {}
} }.effect_internal_function;
(function* () {}).constructor;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Hash.js
/**
* @since 2.0.0
*/
/** @internal */
const randomHashCache = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
/**
* @since 2.0.0
* @category symbols
*/
const symbol$1 = /* @__PURE__ */ Symbol.for("effect/Hash");
/**
* @since 2.0.0
* @category hashing
*/
const hash = (self) => {
	if (structuralRegionState.enabled === true) return 0;
	switch (typeof self) {
		case "number": return number$1(self);
		case "bigint": return string(self.toString(10));
		case "boolean": return string(String(self));
		case "symbol": return string(String(self));
		case "string": return string(self);
		case "undefined": return string("undefined");
		case "function":
		case "object": if (self === null) return string("null");
		else if (self instanceof Date) {
			if (Number.isNaN(self.getTime())) return string("Invalid Date");
			return hash(self.toISOString());
		} else if (self instanceof URL) return hash(self.href);
		else if (isHash(self)) return self[symbol$1]();
		else return random(self);
		default: throw new Error(`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`);
	}
};
/**
* @since 2.0.0
* @category hashing
*/
const random = (self) => {
	if (!randomHashCache.has(self)) randomHashCache.set(self, number$1(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
	return randomHashCache.get(self);
};
/**
* @since 2.0.0
* @category hashing
*/
const combine$5 = (b) => (self) => self * 53 ^ b;
/**
* @since 2.0.0
* @category hashing
*/
const optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
/**
* @since 2.0.0
* @category guards
*/
const isHash = (u) => hasProperty(u, symbol$1);
/**
* @since 2.0.0
* @category hashing
*/
const number$1 = (n) => {
	if (n !== n || n === Infinity) return 0;
	let h = n | 0;
	if (h !== n) h ^= n * 4294967295;
	while (n > 4294967295) h ^= n /= 4294967295;
	return optimize(h);
};
/**
* @since 2.0.0
* @category hashing
*/
const string = (str) => {
	let h = 5381, i = str.length;
	while (i) h = h * 33 ^ str.charCodeAt(--i);
	return optimize(h);
};
/**
* @since 2.0.0
* @category hashing
*/
const structureKeys = (o, keys) => {
	let h = 12289;
	for (let i = 0; i < keys.length; i++) h ^= pipe(string(keys[i]), combine$5(hash(o[keys[i]])));
	return optimize(h);
};
/**
* @since 2.0.0
* @category hashing
*/
const structure = (o) => structureKeys(o, Object.keys(o));
/**
* @since 2.0.0
* @category hashing
*/
const array = (arr) => {
	let h = 6151;
	for (let i = 0; i < arr.length; i++) h = pipe(h, combine$5(hash(arr[i])));
	return optimize(h);
};
/**
* @since 2.0.0
* @category hashing
*/
const cached = function() {
	if (arguments.length === 1) {
		const self = arguments[0];
		return function(hash) {
			Object.defineProperty(self, symbol$1, {
				value() {
					return hash;
				},
				enumerable: false
			});
			return hash;
		};
	}
	const self = arguments[0];
	const hash = arguments[1];
	Object.defineProperty(self, symbol$1, {
		value() {
			return hash;
		},
		enumerable: false
	});
	return hash;
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Equal.js
/**
* @since 2.0.0
* @category symbols
*/
const symbol = /* @__PURE__ */ Symbol.for("effect/Equal");
function equals$2() {
	if (arguments.length === 1) return (self) => compareBoth(self, arguments[0]);
	return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
	if (self === that) return true;
	const selfType = typeof self;
	if (selfType !== typeof that) return false;
	if (selfType === "object" || selfType === "function") {
		if (self !== null && that !== null) {
			if (isEqual(self) && isEqual(that)) if (hash(self) === hash(that) && self[symbol](that)) return true;
			else return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
			else if (self instanceof Date && that instanceof Date) {
				const t1 = self.getTime();
				const t2 = that.getTime();
				return t1 === t2 || Number.isNaN(t1) && Number.isNaN(t2);
			} else if (self instanceof URL && that instanceof URL) return self.href === that.href;
		}
		if (structuralRegionState.enabled) {
			if (self === null || that === null) return false;
			if (Array.isArray(self) && Array.isArray(that)) return self.length === that.length && self.every((v, i) => compareBoth(v, that[i]));
			if (Object.getPrototypeOf(self) === Object.prototype && Object.getPrototypeOf(that) === Object.prototype) {
				const keysSelf = Object.keys(self);
				const keysThat = Object.keys(that);
				if (keysSelf.length === keysThat.length) {
					for (const key of keysSelf) if (!(key in that && compareBoth(self[key], that[key]))) return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
					return true;
				}
			}
			return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
		}
	}
	return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
}
/**
* @since 2.0.0
* @category guards
*/
const isEqual = (u) => hasProperty(u, symbol);
/**
* @since 2.0.0
* @category instances
*/
const equivalence = () => equals$2;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Inspectable.js
/**
* @since 2.0.0
* @category symbols
*/
const NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
/**
* @since 2.0.0
*/
const toJSON = (x) => {
	try {
		if (hasProperty(x, "toJSON") && isFunction(x["toJSON"]) && x["toJSON"].length === 0) return x.toJSON();
		else if (Array.isArray(x)) return x.map(toJSON);
	} catch {
		return {};
	}
	return redact(x);
};
const CIRCULAR = "[Circular]";
/** @internal */
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
/** @internal */
function formatPropertyKey$1(name) {
	return isString(name) ? JSON.stringify(name) : String(name);
}
/** @internal */
function formatUnknown(input, options) {
	const space = options?.space ?? 0;
	const seen = /* @__PURE__ */ new WeakSet();
	const gap = !space ? "" : isNumber(space) ? " ".repeat(space) : space;
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
	function go(v, d = 0) {
		if (Array.isArray(v)) {
			if (seen.has(v)) return CIRCULAR;
			seen.add(v);
			if (!gap || v.length <= 1) return `[${v.map((x) => go(x, d)).join(",")}]`;
			const inner = v.map((x) => go(x, d + 1)).join(",\n" + ind(d + 1));
			return `[\n${ind(d + 1)}${inner}\n${ind(d)}]`;
		}
		if (isDate(v)) return formatDate(v);
		if (!options?.ignoreToString && hasProperty(v, "toString") && isFunction(v["toString"]) && v["toString"] !== Object.prototype.toString && v["toString"] !== Array.prototype.toString) {
			const s = safeToString(v);
			if (v instanceof Error && v.cause) return `${s} (cause: ${go(v.cause, d)})`;
			return s;
		}
		if (isString(v)) return JSON.stringify(v);
		if (isNumber(v) || v == null || isBoolean(v) || isSymbol(v)) return String(v);
		if (isBigInt(v)) return String(v) + "n";
		if (v instanceof Set || v instanceof Map) {
			if (seen.has(v)) return CIRCULAR;
			seen.add(v);
			return `${v.constructor.name}(${go(Array.from(v), d)})`;
		}
		if (isObject(v)) {
			if (seen.has(v)) return CIRCULAR;
			seen.add(v);
			const keys = ownKeys(v);
			if (!gap || keys.length <= 1) return wrap(v, `{${keys.map((k) => `${formatPropertyKey$1(k)}:${go(v[k], d)}`).join(",")}}`);
			return wrap(v, `{\n${keys.map((k) => `${ind(d + 1)}${formatPropertyKey$1(k)}: ${go(v[k], d + 1)}`).join(",\n")}\n${ind(d)}}`);
		}
		return String(v);
	}
	return go(input, 0);
}
/**
* @since 2.0.0
*/
const format$4 = (x) => JSON.stringify(x, null, 2);
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
	const retVal = JSON.stringify(obj, (_key, value) => typeof value === "object" && value !== null ? cache.includes(value) ? void 0 : cache.push(value) && (redactableState.fiberRefs !== void 0 && isRedactable(value) ? value[symbolRedactable](redactableState.fiberRefs) : value) : value, whitespace);
	cache = void 0;
	return retVal;
};
/**
* @since 3.10.0
* @category redactable
*/
const symbolRedactable = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable");
/**
* @since 3.10.0
* @category redactable
*/
const isRedactable = (u) => typeof u === "object" && u !== null && symbolRedactable in u;
const redactableState = /* @__PURE__ */ globalValue("effect/Inspectable/redactableState", () => ({ fiberRefs: void 0 }));
/**
* @since 3.10.0
* @category redactable
*/
const withRedactableContext = (context, f) => {
	const prev = redactableState.fiberRefs;
	redactableState.fiberRefs = context;
	try {
		return f();
	} finally {
		redactableState.fiberRefs = prev;
	}
};
/**
* @since 3.10.0
* @category redactable
*/
const redact = (u) => {
	if (isRedactable(u) && redactableState.fiberRefs !== void 0) return u[symbolRedactable](redactableState.fiberRefs);
	return u;
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Pipeable.js
/**
* @since 2.0.0
*/
/**
* @since 2.0.0
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
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/opCodes/effect.js
/** @internal */
const OP_ASYNC = "Async";
/** @internal */
const OP_COMMIT = "Commit";
/** @internal */
const OP_FAILURE = "Failure";
/** @internal */
const OP_ON_FAILURE = "OnFailure";
/** @internal */
const OP_ON_SUCCESS = "OnSuccess";
/** @internal */
const OP_ON_SUCCESS_AND_FAILURE = "OnSuccessAndFailure";
/** @internal */
const OP_SUCCESS = "Success";
/** @internal */
const OP_SYNC = "Sync";
/** @internal */
const OP_UPDATE_RUNTIME_FLAGS = "UpdateRuntimeFlags";
/** @internal */
const OP_WHILE = "While";
/** @internal */
const OP_ITERATOR = "Iterator";
/** @internal */
const OP_WITH_RUNTIME = "WithRuntime";
/** @internal */
const OP_YIELD = "Yield";
/** @internal */
const OP_REVERT_FLAGS = "RevertFlags";
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/version.js
let moduleVersion = "3.21.1";
const getCurrentVersion = () => moduleVersion;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/effectable.js
/** @internal */
const EffectTypeId$1 = /* @__PURE__ */ Symbol.for("effect/Effect");
/** @internal */
const StreamTypeId = /* @__PURE__ */ Symbol.for("effect/Stream");
/** @internal */
const SinkTypeId = /* @__PURE__ */ Symbol.for("effect/Sink");
/** @internal */
const ChannelTypeId = /* @__PURE__ */ Symbol.for("effect/Channel");
/** @internal */
const effectVariance = {
	_R: (_) => _,
	_E: (_) => _,
	_A: (_) => _,
	_V: /* @__PURE__ */ getCurrentVersion()
};
const sinkVariance = {
	_A: (_) => _,
	_In: (_) => _,
	_L: (_) => _,
	_E: (_) => _,
	_R: (_) => _
};
const channelVariance = {
	_Env: (_) => _,
	_InErr: (_) => _,
	_InElem: (_) => _,
	_InDone: (_) => _,
	_OutErr: (_) => _,
	_OutElem: (_) => _,
	_OutDone: (_) => _
};
/** @internal */
const EffectPrototype$1 = {
	[EffectTypeId$1]: effectVariance,
	[StreamTypeId]: effectVariance,
	[SinkTypeId]: sinkVariance,
	[ChannelTypeId]: channelVariance,
	[symbol](that) {
		return this === that;
	},
	[symbol$1]() {
		return cached(this, random(this));
	},
	[Symbol.iterator]() {
		return new SingleShotGen$1(new YieldWrap(this));
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const StructuralPrototype = {
	[symbol$1]() {
		return cached(this, structure(this));
	},
	[symbol](that) {
		const selfKeys = Object.keys(this);
		const thatKeys = Object.keys(that);
		if (selfKeys.length !== thatKeys.length) return false;
		for (const key of selfKeys) if (!(key in that && equals$2(this[key], that[key]))) return false;
		return true;
	}
};
/** @internal */
const CommitPrototype = {
	...EffectPrototype$1,
	_op: OP_COMMIT
};
/** @internal */
const StructuralCommitPrototype = {
	...CommitPrototype,
	...StructuralPrototype
};
/** @internal */
const Base$1 = /* @__PURE__ */ function() {
	function Base() {}
	Base.prototype = CommitPrototype;
	return Base;
}();
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/option.js
/**
* @since 2.0.0
*/
const TypeId$12 = /* @__PURE__ */ Symbol.for("effect/Option");
const CommonProto$1 = {
	...EffectPrototype$1,
	[TypeId$12]: { _A: (_) => _ },
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	toString() {
		return format$4(this.toJSON());
	}
};
const SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$1), {
	_tag: "Some",
	_op: "Some",
	[symbol](that) {
		return isOption$1(that) && isSome$1(that) && equals$2(this.value, that.value);
	},
	[symbol$1]() {
		return cached(this, combine$5(hash(this._tag))(hash(this.value)));
	},
	toJSON() {
		return {
			_id: "Option",
			_tag: this._tag,
			value: toJSON(this.value)
		};
	}
});
const NoneHash = /* @__PURE__ */ hash("None");
const NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$1), {
	_tag: "None",
	_op: "None",
	[symbol](that) {
		return isOption$1(that) && isNone$1(that);
	},
	[symbol$1]() {
		return NoneHash;
	},
	toJSON() {
		return {
			_id: "Option",
			_tag: this._tag
		};
	}
});
/** @internal */
const isOption$1 = (input) => hasProperty(input, TypeId$12);
/** @internal */
const isNone$1 = (fa) => fa._tag === "None";
/** @internal */
const isSome$1 = (fa) => fa._tag === "Some";
/** @internal */
const none$5 = /* @__PURE__ */ Object.create(NoneProto);
/** @internal */
const some$1 = (value) => {
	const a = Object.create(SomeProto);
	a.value = value;
	return a;
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/either.js
/**
* @since 2.0.0
*/
/**
* @internal
*/
const TypeId$11 = /* @__PURE__ */ Symbol.for("effect/Either");
const CommonProto = {
	...EffectPrototype$1,
	[TypeId$11]: { _R: (_) => _ },
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	toString() {
		return format$4(this.toJSON());
	}
};
const RightProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
	_tag: "Right",
	_op: "Right",
	[symbol](that) {
		return isEither$2(that) && isRight$1(that) && equals$2(this.right, that.right);
	},
	[symbol$1]() {
		return combine$5(hash(this._tag))(hash(this.right));
	},
	toJSON() {
		return {
			_id: "Either",
			_tag: this._tag,
			right: toJSON(this.right)
		};
	}
});
const LeftProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
	_tag: "Left",
	_op: "Left",
	[symbol](that) {
		return isEither$2(that) && isLeft$1(that) && equals$2(this.left, that.left);
	},
	[symbol$1]() {
		return combine$5(hash(this._tag))(hash(this.left));
	},
	toJSON() {
		return {
			_id: "Either",
			_tag: this._tag,
			left: toJSON(this.left)
		};
	}
});
/** @internal */
const isEither$2 = (input) => hasProperty(input, TypeId$11);
/** @internal */
const isLeft$1 = (ma) => ma._tag === "Left";
/** @internal */
const isRight$1 = (ma) => ma._tag === "Right";
/** @internal */
const left$1 = (left) => {
	const a = Object.create(LeftProto);
	a.left = left;
	return a;
};
/** @internal */
const right$1 = (right) => {
	const a = Object.create(RightProto);
	a.right = right;
	return a;
};
/** @internal */
const fromOption$2 = /* @__PURE__ */ dual(2, (self, onNone) => isNone$1(self) ? left$1(onNone()) : right$1(self.value));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Either.js
/**
* Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
* of this structure.
*
* @category constructors
* @since 2.0.0
*/
const right = right$1;
/**
* Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
* structure.
*
* @category constructors
* @since 2.0.0
*/
const left = left$1;
/**
* @example
* ```ts
* import * as assert from "node:assert"
* import { Either, Option } from "effect"
*
* assert.deepStrictEqual(Either.fromOption(Option.some(1), () => 'error'), Either.right(1))
* assert.deepStrictEqual(Either.fromOption(Option.none(), () => 'error'), Either.left('error'))
* ```
*
* @category constructors
* @since 2.0.0
*/
const fromOption$1 = fromOption$2;
const try_ = (evaluate) => {
	if (isFunction(evaluate)) try {
		return right(evaluate());
	} catch (e) {
		return left(e);
	}
	else try {
		return right(evaluate.try());
	} catch (e) {
		return left(evaluate.catch(e));
	}
};
/**
* Tests if a value is a `Either`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Either } from "effect"
*
* assert.deepStrictEqual(Either.isEither(Either.right(1)), true)
* assert.deepStrictEqual(Either.isEither(Either.left("a")), true)
* assert.deepStrictEqual(Either.isEither({ right: 1 }), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isEither$1 = isEither$2;
/**
* Determine if a `Either` is a `Left`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Either } from "effect"
*
* assert.deepStrictEqual(Either.isLeft(Either.right(1)), false)
* assert.deepStrictEqual(Either.isLeft(Either.left("a")), true)
* ```
*
* @category guards
* @since 2.0.0
*/
const isLeft = isLeft$1;
/**
* Determine if a `Either` is a `Right`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Either } from "effect"
*
* assert.deepStrictEqual(Either.isRight(Either.right(1)), true)
* assert.deepStrictEqual(Either.isRight(Either.left("a")), false)
* ```
*
* @category guards
* @since 2.0.0
*/
const isRight = isRight$1;
/**
* @category mapping
* @since 2.0.0
*/
const mapBoth$3 = /* @__PURE__ */ dual(2, (self, { onLeft, onRight }) => isLeft(self) ? left(onLeft(self.left)) : right(onRight(self.right)));
/**
* Maps the `Left` side of an `Either` value to a new `Either` value.
*
* @category mapping
* @since 2.0.0
*/
const mapLeft = /* @__PURE__ */ dual(2, (self, f) => isLeft(self) ? left(f(self.left)) : right(self.right));
/**
* Maps the `Right` side of an `Either` value to a new `Either` value.
*
* @category mapping
* @since 2.0.0
*/
const map$7 = /* @__PURE__ */ dual(2, (self, f) => isRight(self) ? right(f(self.right)) : left(self.left));
/**
* Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the `onLeft function,
* if the value is a `Right` the inner value is applied to the `onRight` function.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { pipe, Either } from "effect"
*
* const onLeft  = (strings: ReadonlyArray<string>): string => `strings: ${strings.join(', ')}`
*
* const onRight = (value: number): string => `Ok: ${value}`
*
* assert.deepStrictEqual(pipe(Either.right(1), Either.match({ onLeft, onRight })), 'Ok: 1')
* assert.deepStrictEqual(
*   pipe(Either.left(['string 1', 'string 2']), Either.match({ onLeft, onRight })),
*   'strings: string 1, string 2'
* )
* ```
*
* @category pattern matching
* @since 2.0.0
*/
const match$4 = /* @__PURE__ */ dual(2, (self, { onLeft, onRight }) => isLeft(self) ? onLeft(self.left) : onRight(self.right));
/**
* @category getters
* @since 2.0.0
*/
const merge$3 = /* @__PURE__ */ match$4({
	onLeft: identity,
	onRight: identity
});
/**
* Extracts the value of an `Either` or throws if the `Either` is `Left`.
*
* If a default error is sufficient for your use case and you don't need to configure the thrown error, see {@link getOrThrow}.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Either } from "effect"
*
* assert.deepStrictEqual(
*   Either.getOrThrowWith(Either.right(1), () => new Error('Unexpected Left')),
*   1
* )
* assert.throws(() => Either.getOrThrowWith(Either.left("error"), () => new Error('Unexpected Left')))
* ```
*
* @category getters
* @since 2.0.0
*/
const getOrThrowWith$1 = /* @__PURE__ */ dual(2, (self, onLeft) => {
	if (isRight(self)) return self.right;
	throw onLeft(self.left);
});
/**
* Extracts the value of an `Either` or throws if the `Either` is `Left`.
*
* The thrown error is a default error. To configure the error thrown, see  {@link getOrThrowWith}.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Either } from "effect"
*
* assert.deepStrictEqual(Either.getOrThrow(Either.right(1)), 1)
* assert.throws(() => Either.getOrThrow(Either.left("error")))
* ```
*
* @throws `Error("getOrThrow called on a Left")`
*
* @category getters
* @since 2.0.0
*/
const getOrThrow = /* @__PURE__ */ getOrThrowWith$1(() => /* @__PURE__ */ new Error("getOrThrow called on a Left"));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/array.js
/**
* @since 2.0.0
*/
/** @internal */
const isNonEmptyArray$1 = (self) => self.length > 0;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Order.js
/**
* This module provides an implementation of the `Order` type class which is used to define a total ordering on some type `A`.
* An order is defined by a relation `<=`, which obeys the following laws:
*
* - either `x <= y` or `y <= x` (totality)
* - if `x <= y` and `y <= x`, then `x == y` (antisymmetry)
* - if `x <= y` and `y <= z`, then `x <= z` (transitivity)
*
* The truth table for compare is defined as follows:
*
* | `x <= y` | `x >= y` | Ordering |                       |
* | -------- | -------- | -------- | --------------------- |
* | `true`   | `true`   | `0`      | corresponds to x == y |
* | `true`   | `false`  | `< 0`    | corresponds to x < y  |
* | `false`  | `true`   | `> 0`    | corresponds to x > y  |
*
* @since 2.0.0
*/
/**
* @category constructors
* @since 2.0.0
*/
const make$24 = (compare) => (self, that) => self === that ? 0 : compare(self, that);
/**
* @category instances
* @since 2.0.0
*/
const number = /* @__PURE__ */ make$24((self, that) => self < that ? -1 : 1);
/**
* @category mapping
* @since 2.0.0
*/
const mapInput = /* @__PURE__ */ dual(2, (self, f) => make$24((b1, b2) => self(f(b1), f(b2))));
/**
* Test whether one value is _strictly greater than_ another.
*
* @since 2.0.0
*/
const greaterThan$2 = (O) => dual(2, (self, that) => O(self, that) === 1);
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Option.js
/**
* Represents the absence of a value by creating an empty `Option`.
*
* `Option.none` returns an `Option<never>`, which is a subtype of `Option<A>`.
* This means you can use it in place of any `Option<A>` regardless of the type
* `A`.
*
* **Example** (Creating an Option with No Value)
*
* ```ts
* import { Option } from "effect"
*
* // An Option holding no value
* //
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
const none$4 = () => none$5;
/**
* Wraps the given value into an `Option` to represent its presence.
*
* **Example** (Creating an Option with a Value)
*
* ```ts
* import { Option } from "effect"
*
* // An Option holding the number 1
* //
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
* **Details**
*
* This function checks if a value is an instance of `Option`. It returns `true`
* if the value is either `Option.some` or `Option.none`, and `false` otherwise.
* This is particularly useful when working with unknown values or when you need
* to ensure type safety in your code.
*
* @example
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
* @category Guards
* @since 2.0.0
*/
const isOption = isOption$1;
/**
* Checks whether an `Option` represents the absence of a value (`None`).
*
* @example
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
* @example
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
* Performs pattern matching on an `Option` to handle both `Some` and `None`
* cases.
*
* **Details**
*
* This function allows you to match against an `Option` and handle both
* scenarios: when the `Option` is `None` (i.e., contains no value), and when
* the `Option` is `Some` (i.e., contains a value). It executes one of the
* provided functions based on the case:
*
* - If the `Option` is `None`, the `onNone` function is executed and its result
*   is returned.
* - If the `Option` is `Some`, the `onSome` function is executed with the
*   contained value, and its result is returned.
*
* This function provides a concise and functional way to handle optional values
* without resorting to `if` or manual checks, making your code more declarative
* and readable.
*
* **Example** (Pattern Matching with Option)
*
* ```ts
* import { Option } from "effect"
*
* const foo = Option.some(1)
*
* const message = Option.match(foo, {
*   onNone: () => "Option is empty",
*   onSome: (value) => `Option has a value: ${value}`
* })
*
* console.log(message)
* // Output: "Option has a value: 1"
* ```
*
* @category Pattern matching
* @since 2.0.0
*/
const match$3 = /* @__PURE__ */ dual(2, (self, { onNone, onSome }) => isNone(self) ? onNone() : onSome(self.value));
/**
* Returns the value contained in the `Option` if it is `Some`, otherwise
* evaluates and returns the result of `onNone`.
*
* **Details**
*
* This function allows you to provide a fallback value or computation for when
* an `Option` is `None`. If the `Option` contains a value (`Some`), that value
* is returned. If it is empty (`None`), the `onNone` function is executed, and
* its result is returned instead.
*
* This utility is helpful for safely handling `Option` values by ensuring you
* always receive a meaningful result, whether or not the `Option` contains a
* value. It is particularly useful for providing default values or alternative
* logic when working with optional values.
*
* @example
* ```ts
* import { Option } from "effect"
*
* console.log(Option.some(1).pipe(Option.getOrElse(() => 0)))
* // Output: 1
*
* console.log(Option.none().pipe(Option.getOrElse(() => 0)))
* // Output: 0
* ```
*
* @see {@link getOrNull} for a version that returns `null` instead of executing a function.
* @see {@link getOrUndefined} for a version that returns `undefined` instead of executing a function.
*
* @category Getters
* @since 2.0.0
*/
const getOrElse = /* @__PURE__ */ dual(2, (self, onNone) => isNone(self) ? onNone() : self.value);
/**
* Returns the provided `Option` `that` if the current `Option` (`self`) is
* `None`; otherwise, it returns `self`.
*
* **Details**
*
* This function provides a fallback mechanism for `Option` values. If the
* current `Option` is `None` (i.e., it contains no value), the `that` function
* is evaluated, and its resulting `Option` is returned. If the current `Option`
* is `Some` (i.e., it contains a value), the original `Option` is returned
* unchanged.
*
* This is particularly useful for chaining fallback values or computations,
* allowing you to provide alternative `Option` values when the first one is
* empty.
*
* @example
* ```ts
* import { Option } from "effect"
*
* console.log(Option.none().pipe(Option.orElse(() => Option.none())))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(Option.some("a").pipe(Option.orElse(() => Option.none())))
* // Output: { _id: 'Option', _tag: 'Some', value: 'a' }
*
* console.log(Option.none().pipe(Option.orElse(() => Option.some("b"))))
* // Output: { _id: 'Option', _tag: 'Some', value: 'b' }
*
* console.log(Option.some("a").pipe(Option.orElse(() => Option.some("b"))))
* // Output: { _id: 'Option', _tag: 'Some', value: 'a' }
* ```
*
* @category Error handling
* @since 2.0.0
*/
const orElse$1 = /* @__PURE__ */ dual(2, (self, that) => isNone(self) ? that() : self);
/**
* Returns the provided default value wrapped in `Some` if the current `Option`
* (`self`) is `None`; otherwise, returns `self`.
*
* **Details**
*
* This function provides a way to supply a default value for cases where an
* `Option` is `None`. If the current `Option` is empty (`None`), the `onNone`
* function is executed to compute the default value, which is then wrapped in a
* `Some`. If the current `Option` contains a value (`Some`), it is returned as
* is.
*
* This is particularly useful for handling optional values where a fallback
* default needs to be provided explicitly in case of absence.
*
* @example
* ```ts
* import { Option } from "effect"
*
* console.log(Option.none().pipe(Option.orElseSome(() => "b")))
* // Output: { _id: 'Option', _tag: 'Some', value: 'b' }
*
* console.log(Option.some("a").pipe(Option.orElseSome(() => "b")))
* // Output: { _id: 'Option', _tag: 'Some', value: 'a' }
* ```
*
* @category Error handling
* @since 2.0.0
*/
const orElseSome = /* @__PURE__ */ dual(2, (self, onNone) => isNone(self) ? some(onNone()) : self);
/**
* Converts a nullable value into an `Option`. Returns `None` if the value is
* `null` or `undefined`, otherwise wraps the value in a `Some`.
*
* @example
* ```ts
* import { Option } from "effect"
*
* console.log(Option.fromNullable(undefined))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(Option.fromNullable(null))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(Option.fromNullable(1))
* // Output: { _id: 'Option', _tag: 'Some', value: 1 }
* ```
*
* @category Conversions
* @since 2.0.0
*/
const fromNullable = (nullableValue) => nullableValue == null ? none$4() : some(nullableValue);
/**
* Returns the value contained in the `Option` if it is `Some`; otherwise,
* returns `undefined`.
*
* **Details**
*
* This function provides a way to extract the value of an `Option` while
* falling back to `undefined` if the `Option` is `None`.
*
* It is particularly useful in scenarios where `undefined` is an acceptable
* placeholder for the absence of a value, such as when interacting with APIs or
* systems that use `undefined` as a default for missing values.
*
* @example
* ```ts
* import { Option } from "effect"
*
* console.log(Option.getOrUndefined(Option.some(1)))
* // Output: 1
*
* console.log(Option.getOrUndefined(Option.none()))
* // Output: undefined
* ```
*
* @category Getters
* @since 2.0.0
*/
const getOrUndefined = /* @__PURE__ */ getOrElse(constUndefined);
/**
* Lifts a function that throws exceptions into a function that returns an
* `Option`.
*
* **Details**
*
* This utility function takes a function `f` that might throw an exception and
* transforms it into a safer function that returns an `Option`. If the original
* function executes successfully, the result is wrapped in a `Some`. If an
* exception is thrown, the result is `None`, allowing the developer to handle
* errors in a functional, type-safe way.
*
* @example
* ```ts
* import { Option } from "effect"
*
* const parse = Option.liftThrowable(JSON.parse)
*
* console.log(parse("1"))
* // Output: { _id: 'Option', _tag: 'Some', value: 1 }
*
* console.log(parse(""))
* // Output: { _id: 'Option', _tag: 'None' }
* ```
*
* @category Conversions
* @since 2.0.0
*/
const liftThrowable = (f) => (...a) => {
	try {
		return some(f(...a));
	} catch {
		return none$4();
	}
};
/**
* Extracts the value of an `Option` or throws an error if the `Option` is
* `None`, using a custom error factory.
*
* **Details**
*
* This function allows you to extract the value of an `Option` when it is
* `Some`. If the `Option` is `None`, it throws an error generated by the
* provided `onNone` function. This utility is particularly useful when you need
* a fail-fast behavior for empty `Option` values and want to provide a custom
* error message or object.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Option } from "effect"
*
* assert.deepStrictEqual(
*   Option.getOrThrowWith(Option.some(1), () => new Error('Unexpected None')),
*   1
* )
* assert.throws(() => Option.getOrThrowWith(Option.none(), () => new Error('Unexpected None')))
* ```
*
* @see {@link getOrThrow} for a version that throws a default error.
*
* @category Conversions
* @since 2.0.0
*/
const getOrThrowWith = /* @__PURE__ */ dual(2, (self, onNone) => {
	if (isSome(self)) return self.value;
	throw onNone();
});
/**
* Transforms the value inside a `Some` to a new value using the provided
* function, while leaving `None` unchanged.
*
* **Details**
*
* This function applies a mapping function `f` to the value inside an `Option`
* if it is a `Some`. If the `Option` is `None`, it remains unchanged. The
* result is a new `Option` with the transformed value (if it was a `Some`) or
* still `None`.
*
* This utility is particularly useful for chaining transformations in a
* functional way without needing to manually handle `None` cases.
*
* @example
* ```ts
* import { Option } from "effect"
*
* // Mapping over a `Some`
* const someValue = Option.some(2)
*
* console.log(Option.map(someValue, (n) => n * 2))
* // Output: { _id: 'Option', _tag: 'Some', value: 4 }
*
* // Mapping over a `None`
* const noneValue = Option.none<number>()
*
* console.log(Option.map(noneValue, (n) => n * 2))
* // Output: { _id: 'Option', _tag: 'None' }
* ```
*
* @category Mapping
* @since 2.0.0
*/
const map$6 = /* @__PURE__ */ dual(2, (self, f) => isNone(self) ? none$4() : some(f(self.value)));
/**
* Applies a function to the value of a `Some` and flattens the resulting
* `Option`. If the input is `None`, it remains `None`.
*
* **Details**
*
* This function allows you to chain computations that return `Option` values.
* If the input `Option` is `Some`, the provided function `f` is applied to the
* contained value, and the resulting `Option` is returned. If the input is
* `None`, the function is not applied, and the result remains `None`.
*
* This utility is particularly useful for sequencing operations that may fail
* or produce optional results, enabling clean and concise workflows for
* handling such cases.
*
* @example
* ```ts
* import { Option } from "effect"
*
* interface Address {
*   readonly city: string
*   readonly street: Option.Option<string>
* }
*
* interface User {
*   readonly id: number
*   readonly username: string
*   readonly email: Option.Option<string>
*   readonly address: Option.Option<Address>
* }
*
* const user: User = {
*   id: 1,
*   username: "john_doe",
*   email: Option.some("john.doe@example.com"),
*   address: Option.some({
*     city: "New York",
*     street: Option.some("123 Main St")
*   })
* }
*
* // Use flatMap to extract the street value
* const street = user.address.pipe(
*   Option.flatMap((address) => address.street)
* )
*
* console.log(street)
* // Output: { _id: 'Option', _tag: 'Some', value: '123 Main St' }
* ```
*
* @category Sequencing
* @since 2.0.0
*/
const flatMap$5 = /* @__PURE__ */ dual(2, (self, f) => isNone(self) ? none$4() : f(self.value));
/**
* Combines `flatMap` and `fromNullable`, transforming the value inside a `Some`
* using a function that may return `null` or `undefined`.
*
* **Details**
*
* This function applies a transformation function `f` to the value inside a
* `Some`. The function `f` may return a value, `null`, or `undefined`. If `f`
* returns a value, it is wrapped in a `Some`. If `f` returns `null` or
* `undefined`, the result is `None`. If the input `Option` is `None`, the
* function is not applied, and `None` is returned.
*
* This utility is particularly useful when working with deeply nested optional
* values or chaining computations that may result in `null` or `undefined` at
* some point.
*
* @example
* ```ts
* import { Option } from "effect"
*
* interface Employee {
*   company?: {
*     address?: {
*       street?: {
*         name?: string
*       }
*     }
*   }
* }
*
* const employee1: Employee = { company: { address: { street: { name: "high street" } } } }
*
* // Extracting a deeply nested property
* console.log(
*   Option.some(employee1)
*     .pipe(Option.flatMapNullable((employee) => employee.company?.address?.street?.name))
* )
* // Output: { _id: 'Option', _tag: 'Some', value: 'high street' }
*
* const employee2: Employee = { company: { address: { street: {} } } }
*
* // Property does not exist
* console.log(
*   Option.some(employee2)
*     .pipe(Option.flatMapNullable((employee) => employee.company?.address?.street?.name))
* )
* // Output: { _id: 'Option', _tag: 'None' }
* ```
*
* @category Sequencing
* @since 2.0.0
*/
const flatMapNullable = /* @__PURE__ */ dual(2, (self, f) => isNone(self) ? none$4() : fromNullable(f(self.value)));
/**
* Alias of {@link flatMap}.
*
* @example
* ```ts
* import { Option } from "effect"
*
* // Transform and filter numbers
* const transformEven = (n: Option.Option<number>): Option.Option<string> =>
*   Option.filterMap(n, (n) => (n % 2 === 0 ? Option.some(`Even: ${n}`) : Option.none()))
*
* console.log(transformEven(Option.none()))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(transformEven(Option.some(1)))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(transformEven(Option.some(2)))
* // Output: { _id: 'Option', _tag: 'Some', value: 'Even: 2' }
* ```
*
* @category Filtering
* @since 2.0.0
*/
const filterMap$1 = flatMap$5;
/**
* Filters an `Option` using a predicate. If the predicate is not satisfied or the `Option` is `None` returns `None`.
*
* If you need to change the type of the `Option` in addition to filtering, see `filterMap`.
*
* @example
* ```ts
* import { Option } from "effect"
*
* const removeEmptyString = (input: Option.Option<string>) =>
*   Option.filter(input, (value) => value !== "")
*
* console.log(removeEmptyString(Option.none()))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(removeEmptyString(Option.some("")))
* // Output: { _id: 'Option', _tag: 'None' }
*
* console.log(removeEmptyString(Option.some("a")))
* // Output: { _id: 'Option', _tag: 'Some', value: 'a' }
* ```
*
* @category Filtering
* @since 2.0.0
*/
const filter$1 = /* @__PURE__ */ dual(2, (self, predicate) => filterMap$1(self, (b) => predicate(b) ? some$1(b) : none$5));
/**
* Creates an `Equivalence` instance for comparing `Option` values, using a
* provided `Equivalence` for the inner type.
*
* **Details**
*
* This function takes an `Equivalence` instance for a specific type `A` and
* produces an `Equivalence` instance for `Option<A>`. The resulting
* `Equivalence` determines whether two `Option` values are equivalent:
*
* - Two `None`s are considered equivalent.
* - A `Some` and a `None` are not equivalent.
* - Two `Some` values are equivalent if their inner values are equivalent
*   according to the provided `Equivalence`.
*
* **Example** (Comparing Optional Numbers for Equivalence)
*
* ```ts
* import { Number, Option } from "effect"
*
* const isEquivalent = Option.getEquivalence(Number.Equivalence)
*
* console.log(isEquivalent(Option.none(), Option.none()))
* // Output: true
*
* console.log(isEquivalent(Option.none(), Option.some(1)))
* // Output: false
*
* console.log(isEquivalent(Option.some(1), Option.none()))
* // Output: false
*
* console.log(isEquivalent(Option.some(1), Option.some(2)))
* // Output: false
*
* console.log(isEquivalent(Option.some(1), Option.some(1)))
* // Output: true
* ```
*
* @category Equivalence
* @since 2.0.0
*/
const getEquivalence$3 = (isEquivalent) => make$25((x, y) => isNone(x) ? isNone(y) : isNone(y) ? false : isEquivalent(x.value, y.value));
/**
* Returns a function that checks if an `Option` contains a specified value,
* using a provided equivalence function.
*
* **Details**
*
* This function allows you to check whether an `Option` contains a specific
* value. It uses an equivalence function `isEquivalent` to compare the value
* inside the `Option` to the provided value. If the `Option` is `Some` and the
* equivalence function returns `true`, the result is `true`. If the `Option` is
* `None` or the values are not equivalent, the result is `false`.
*
* @example
* ```ts
* import { Number, Option } from "effect"
*
* const contains = Option.containsWith(Number.Equivalence)
*
* console.log(Option.some(2).pipe(contains(2)))
* // Output: true
*
* console.log(Option.some(1).pipe(contains(2)))
* // Output: false
*
* console.log(Option.none().pipe(contains(2)))
* // Output: false
* ```
*
* @see {@link contains} for a version that uses the default `Equivalence`.
*
* @category Elements
* @since 2.0.0
*/
const containsWith = (isEquivalent) => dual(2, (self, a) => isNone(self) ? false : isEquivalent(self.value, a));
/**
* Returns a function that checks if an `Option` contains a specified value
* using the default `Equivalence`.
*
* **Details**
*
* This function allows you to check whether an `Option` contains a specific
* value. It uses the default `Equivalence` for equality comparison. If the
* `Option` is `Some` and its value is equivalent to the provided value, the
* result is `true`. If the `Option` is `None` or the values are not equivalent,
* the result is `false`.
*
* @example
* ```ts
* import { Option } from "effect"
*
* console.log(Option.some(2).pipe(Option.contains(2)))
* // Output: true
*
* console.log(Option.some(1).pipe(Option.contains(2)))
* // Output: false
*
* console.log(Option.none().pipe(Option.contains(2)))
* // Output: false
* ```
*
* @see {@link containsWith} for a version that allows you to specify a custom equivalence function.
*
* @category Elements
* @since 2.0.0
*/
const contains = /* @__PURE__ */ containsWith(/* @__PURE__ */ equivalence());
/**
* Checks if a value in an `Option` satisfies a given predicate or refinement.
*
* **Details**
*
* This function allows you to check if a value inside a `Some` meets a
* specified condition. If the `Option` is `None`, the result is `false`. If the
* `Option` is `Some`, the provided predicate or refinement is applied to the
* value:
*
* - If the condition is met, the result is `true`.
* - If the condition is not met, the result is `false`.
*
* @example
* ```ts
* import { Option } from "effect"
*
* const isEven = (n: number) => n % 2 === 0
*
* console.log(Option.some(2).pipe(Option.exists(isEven)))
* // Output: true
*
* console.log(Option.some(1).pipe(Option.exists(isEven)))
* // Output: false
*
* console.log(Option.none().pipe(Option.exists(isEven)))
* // Output: false
* ```
*
* @category Elements
* @since 2.0.0
*/
const exists = /* @__PURE__ */ dual(2, (self, refinement) => isNone(self) ? false : refinement(self.value));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Tuple.js
/**
* Constructs a new tuple from the provided values.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { make } from "effect/Tuple"
*
* assert.deepStrictEqual(make(1, 'hello', true), [1, 'hello', true])
* ```
*
* @category constructors
* @since 2.0.0
*/
const make$23 = (...elements) => elements;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Array.js
/**
* Creates a new `Array` of the specified length.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.allocate<number>(3)
* console.log(result) // [ <3 empty items> ]
* ```
*
* @category constructors
* @since 2.0.0
*/
const allocate = (n) => new Array(n);
/**
* Return a `NonEmptyArray` of length `n` with element `i` initialized with `f(i)`.
*
* **Note**. `n` is normalized to an integer >= 1.
*
* **Example**
*
* ```ts
* import { makeBy } from "effect/Array"
*
* const result = makeBy(5, n => n * 2)
* console.log(result) // [0, 2, 4, 6, 8]
* ```
*
* @category constructors
* @since 2.0.0
*/
const makeBy = /* @__PURE__ */ dual(2, (n, f) => {
	const max = Math.max(1, Math.floor(n));
	const out = new Array(max);
	for (let i = 0; i < max; i++) out[i] = f(i);
	return out;
});
/**
* Creates a new `Array` from an iterable collection of values.
* If the input is already an array, it returns the input as-is.
* Otherwise, it converts the iterable collection to an array.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.fromIterable(new Set([1, 2, 3]))
* console.log(result) // [1, 2, 3]
* ```
*
* @category constructors
* @since 2.0.0
*/
const fromIterable$6 = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
/**
* Creates a new `Array` from a value that might not be an iterable.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.ensure("a")) // ["a"]
* console.log(Array.ensure(["a"])) // ["a"]
* console.log(Array.ensure(["a", "b", "c"])) // ["a", "b", "c"]
* ```
*
* @category constructors
* @since 3.3.0
*/
const ensure = (self) => Array.isArray(self) ? self : [self];
/**
* Matches the elements of an array from the left, applying functions to cases of empty and non-empty arrays.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const matchLeft = Array.matchLeft({
*   onEmpty: () => "empty",
*   onNonEmpty: (head, tail) => `head: ${head}, tail: ${tail.length}`
* })
* console.log(matchLeft([])) // "empty"
* console.log(matchLeft([1, 2, 3])) // "head: 1, tail: 2"
* ```
*
* @category pattern matching
* @since 2.0.0
*/
const matchLeft = /* @__PURE__ */ dual(2, (self, { onEmpty, onNonEmpty }) => isNonEmptyReadonlyArray(self) ? onNonEmpty(headNonEmpty$1(self), tailNonEmpty$1(self)) : onEmpty());
/**
* Prepend an element to the front of an `Iterable`, creating a new `NonEmptyArray`.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.prepend([2, 3, 4], 1)
* console.log(result) // [1, 2, 3, 4]
* ```
*
* @category concatenating
* @since 2.0.0
*/
const prepend$2 = /* @__PURE__ */ dual(2, (self, head) => [head, ...self]);
/**
* Append an element to the end of an `Iterable`, creating a new `NonEmptyArray`.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.append([1, 2, 3], 4);
* console.log(result) // [1, 2, 3, 4]
* ```
*
* @category concatenating
* @since 2.0.0
*/
const append$1 = /* @__PURE__ */ dual(2, (self, last) => [...self, last]);
/**
* Concatenates two arrays (or iterables), combining their elements.
* If either array is non-empty, the result is also a non-empty array.
*
* @category concatenating
* @since 2.0.0
*/
const appendAll$2 = /* @__PURE__ */ dual(2, (self, that) => fromIterable$6(self).concat(fromIterable$6(that)));
/**
* Determine if `unknown` is an Array.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isArray(null)) // false
* console.log(Array.isArray([1, 2, 3])) // true
* ```
*
* @category guards
* @since 2.0.0
*/
const isArray = Array.isArray;
/**
* Determine if an `Array` is empty narrowing down the type to `[]`.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isEmptyArray([])) // true
* console.log(Array.isEmptyArray([1, 2, 3])) // false
* ```
*
* @category guards
* @since 2.0.0
*/
const isEmptyArray = (self) => self.length === 0;
/**
* Determine if a `ReadonlyArray` is empty narrowing down the type to `readonly []`.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isEmptyReadonlyArray([])) // true
* console.log(Array.isEmptyReadonlyArray([1, 2, 3])) // false
* ```
*
* @category guards
* @since 2.0.0
*/
const isEmptyReadonlyArray = isEmptyArray;
/**
* Determine if an `Array` is non empty narrowing down the type to `NonEmptyArray`.
*
* An `Array` is considered to be a `NonEmptyArray` if it contains at least one element.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isNonEmptyArray([])) // false
* console.log(Array.isNonEmptyArray([1, 2, 3])) // true
* ```
*
* @category guards
* @since 2.0.0
*/
const isNonEmptyArray = isNonEmptyArray$1;
/**
* Determine if a `ReadonlyArray` is non empty narrowing down the type to `NonEmptyReadonlyArray`.
*
* A `ReadonlyArray` is considered to be a `NonEmptyReadonlyArray` if it contains at least one element.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* console.log(Array.isNonEmptyReadonlyArray([])) // false
* console.log(Array.isNonEmptyReadonlyArray([1, 2, 3])) // true
* ```
*
* @category guards
* @since 2.0.0
*/
const isNonEmptyReadonlyArray = isNonEmptyArray$1;
const isOutOfBounds = (i, as) => i < 0 || i >= as.length;
const clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length));
/**
* This function provides a safe way to read a value at a particular index from a `ReadonlyArray`.
*
* @category getters
* @since 2.0.0
*/
const get$7 = /* @__PURE__ */ dual(2, (self, index) => {
	const i = Math.floor(index);
	return isOutOfBounds(i, self) ? none$4() : some(self[i]);
});
/**
* Gets an element unsafely, will throw on out of bounds.
*
* @since 2.0.0
* @category unsafe
*/
const unsafeGet$3 = /* @__PURE__ */ dual(2, (self, index) => {
	const i = Math.floor(index);
	if (isOutOfBounds(i, self)) throw new Error(`Index ${i} out of bounds`);
	return self[i];
});
/**
* Get the first element of a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
*
* @category getters
* @since 2.0.0
*/
const head = /* @__PURE__ */ get$7(0);
/**
* Get the first element of a non empty array.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.headNonEmpty([1, 2, 3, 4])
* console.log(result) // 1
* ```
*
* @category getters
* @since 2.0.0
*/
const headNonEmpty$1 = /* @__PURE__ */ unsafeGet$3(0);
/**
* Get the last element in a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
*
* @category getters
* @since 2.0.0
*/
const last = (self) => isNonEmptyReadonlyArray(self) ? some(lastNonEmpty(self)) : none$4();
/**
* Get the last element of a non empty array.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.lastNonEmpty([1, 2, 3, 4])
* console.log(result) // 4
* ```
*
* @category getters
* @since 2.0.0
*/
const lastNonEmpty = (self) => self[self.length - 1];
/**
* Get all but the first element of a `NonEmptyReadonlyArray`.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.tailNonEmpty([1, 2, 3, 4])
* console.log(result) // [2, 3, 4]
* ```
*
* @category getters
* @since 2.0.0
*/
const tailNonEmpty$1 = (self) => self.slice(1);
const spanIndex = (self, predicate) => {
	let i = 0;
	for (const a of self) {
		if (!predicate(a, i)) break;
		i++;
	}
	return i;
};
/**
* Split an `Iterable` into two parts:
*
* 1. the longest initial subarray for which all elements satisfy the specified predicate
* 2. the remaining elements
*
* @category splitting
* @since 2.0.0
*/
const span = /* @__PURE__ */ dual(2, (self, predicate) => splitAt(self, spanIndex(self, predicate)));
/**
* Drop a max number of elements from the start of an `Iterable`, creating a new `Array`.
*
* **Note**. `n` is normalized to a non negative integer.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.drop([1, 2, 3, 4, 5], 2)
* console.log(result) // [3, 4, 5]
* ```
*
* @category getters
* @since 2.0.0
*/
const drop$1 = /* @__PURE__ */ dual(2, (self, n) => {
	const input = fromIterable$6(self);
	return input.slice(clamp(n, input), input.length);
});
/**
* Reverse an `Iterable`, creating a new `Array`.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.reverse([1, 2, 3, 4])
* console.log(result) // [4, 3, 2, 1]
* ```
*
* @category elements
* @since 2.0.0
*/
const reverse$2 = (self) => Array.from(self).reverse();
/**
* Create a new array with elements sorted in increasing order based on the specified comparator.
* If the input is a `NonEmptyReadonlyArray`, the output will also be a `NonEmptyReadonlyArray`.
*
* @category sorting
* @since 2.0.0
*/
const sort = /* @__PURE__ */ dual(2, (self, O) => {
	const out = Array.from(self);
	out.sort(O);
	return out;
});
/**
* Takes two `Iterable`s and returns an `Array` of corresponding pairs.
* If one input `Iterable` is short, excess elements of the
* longer `Iterable` are discarded.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.zip([1, 2, 3], ['a', 'b'])
* console.log(result) // [[1, 'a'], [2, 'b']]
* ```
*
* @category zipping
* @since 2.0.0
*/
const zip$1 = /* @__PURE__ */ dual(2, (self, that) => zipWith(self, that, make$23));
/**
* Apply a function to pairs of elements at the same index in two `Iterable`s, collecting the results in a new `Array`. If one
* input `Iterable` is short, excess elements of the longer `Iterable` are discarded.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.zipWith([1, 2, 3], [4, 5, 6], (a, b) => a + b)
* console.log(result) // [5, 7, 9]
* ```
*
* @category zipping
* @since 2.0.0
*/
const zipWith = /* @__PURE__ */ dual(3, (self, that, f) => {
	const as = fromIterable$6(self);
	const bs = fromIterable$6(that);
	if (isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)) {
		const out = [f(headNonEmpty$1(as), headNonEmpty$1(bs))];
		const len = Math.min(as.length, bs.length);
		for (let i = 1; i < len; i++) out[i] = f(as[i], bs[i]);
		return out;
	}
	return [];
});
const _equivalence$2 = /* @__PURE__ */ equivalence();
/**
* Splits an `Iterable` into two segments, with the first segment containing a maximum of `n` elements.
* The value of `n` can be `0`.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.splitAt([1, 2, 3, 4, 5], 3)
* console.log(result) // [[1, 2, 3], [4, 5]]
* ```
*
* @category splitting
* @since 2.0.0
*/
const splitAt = /* @__PURE__ */ dual(2, (self, n) => {
	const input = Array.from(self);
	const _n = Math.floor(n);
	if (isNonEmptyReadonlyArray(input)) {
		if (_n >= 1) return splitNonEmptyAt(input, _n);
		return [[], input];
	}
	return [input, []];
});
/**
* Splits a `NonEmptyReadonlyArray` into two segments, with the first segment containing a maximum of `n` elements.
* The value of `n` must be `>= 1`.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.splitNonEmptyAt(["a", "b", "c", "d", "e"], 3)
* console.log(result) // [["a", "b", "c"], ["d", "e"]]
* ```
*
* @category splitting
* @since 2.0.0
*/
const splitNonEmptyAt = /* @__PURE__ */ dual(2, (self, n) => {
	const _n = Math.max(1, Math.floor(n));
	return _n >= self.length ? [copy$1(self), []] : [prepend$2(self.slice(1, _n), headNonEmpty$1(self)), self.slice(_n)];
});
/**
* Copies an array.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.copy([1, 2, 3])
* console.log(result) // [1, 2, 3]
* ```
*
* @since 2.0.0
*/
const copy$1 = (self) => self.slice();
/**
* Calculates the union of two arrays using the provided equivalence relation.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const union = Array.unionWith([1, 2], [2, 3], (a, b) => a === b)
* console.log(union) // [1, 2, 3]
* ```
*
* @since 2.0.0
*/
const unionWith = /* @__PURE__ */ dual(3, (self, that, isEquivalent) => {
	const a = fromIterable$6(self);
	const b = fromIterable$6(that);
	if (isNonEmptyReadonlyArray(a)) {
		if (isNonEmptyReadonlyArray(b)) return dedupeWith(isEquivalent)(appendAll$2(a, b));
		return a;
	}
	return b;
});
/**
* Creates a union of two arrays, removing duplicates.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.union([1, 2], [2, 3])
* console.log(result) // [1, 2, 3]
* ```
*
* @since 2.0.0
*/
const union$2 = /* @__PURE__ */ dual(2, (self, that) => unionWith(self, that, _equivalence$2));
/**
* @category constructors
* @since 2.0.0
*/
const empty$19 = () => [];
/**
* Constructs a new `NonEmptyArray<A>` from the specified value.
*
* @category constructors
* @since 2.0.0
*/
const of$2 = (a) => [a];
/**
* @category mapping
* @since 2.0.0
*/
const map$5 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));
/**
* Applies a function to each element in an array and returns a new array containing the concatenated mapped elements.
*
* @category sequencing
* @since 2.0.0
*/
const flatMap$4 = /* @__PURE__ */ dual(2, (self, f) => {
	if (isEmptyReadonlyArray(self)) return [];
	const out = [];
	for (let i = 0; i < self.length; i++) {
		const inner = f(self[i], i);
		for (let j = 0; j < inner.length; j++) out.push(inner[j]);
	}
	return out;
});
/**
* Combines multiple arrays into a single array by concatenating all elements
* from each nested array. This function ensures that the structure of nested
* arrays is collapsed into a single, flat array.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.flatten([[1, 2], [], [3, 4], [], [5, 6]])
* console.log(result) // [1, 2, 3, 4, 5, 6]
* ```
*
* @category sequencing
* @since 2.0.0
*/
const flatten$3 = /* @__PURE__ */ flatMap$4(identity);
/**
* Applies a function to each element of the `Iterable` and filters based on the result, keeping the transformed values where the function returns `Some`.
* This method combines filtering and mapping functionalities, allowing transformations and filtering of elements based on a single function pass.
*
* **Example**
*
* ```ts
* import { Array, Option } from "effect"
*
* const evenSquares = (x: number) => x % 2 === 0 ? Option.some(x * x) : Option.none()
*
* const result = Array.filterMap([1, 2, 3, 4, 5], evenSquares);
* console.log(result) // [4, 16]
* ```
*
* @category filtering
* @since 2.0.0
*/
const filterMap = /* @__PURE__ */ dual(2, (self, f) => {
	const as = fromIterable$6(self);
	const out = [];
	for (let i = 0; i < as.length; i++) {
		const o = f(as[i], i);
		if (isSome(o)) out.push(o.value);
	}
	return out;
});
/**
* Reduces an array from the left.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.reduce([1, 2, 3], 0, (acc, n) => acc + n)
* console.log(result) // 6
* ```
*
* @category folding
* @since 2.0.0
*/
const reduce$6 = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable$6(self).reduce((b, a, i) => f(b, a, i), b));
/**
* @category constructors
* @since 2.0.0
*/
const unfold = (b, f) => {
	const out = [];
	let next = b;
	let o;
	while (isSome(o = f(next))) {
		const [a, b] = o.value;
		out.push(a);
		next = b;
	}
	return out;
};
/**
* Creates an equivalence relation for arrays.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const eq = Array.getEquivalence<number>((a, b) => a === b)
* console.log(eq([1, 2, 3], [1, 2, 3])) // true
* ```
*
* @category instances
* @since 2.0.0
*/
const getEquivalence$2 = array$1;
/**
* Remove duplicates from an `Iterable` using the provided `isEquivalent` function,
* preserving the order of the first occurrence of each element.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const result = Array.dedupeWith([1, 2, 2, 3, 3, 3], (a, b) => a === b)
* console.log(result) // [1, 2, 3]
* ```
*
* @since 2.0.0
*/
const dedupeWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
	const input = fromIterable$6(self);
	if (isNonEmptyReadonlyArray(input)) {
		const out = [headNonEmpty$1(input)];
		const rest = tailNonEmpty$1(input);
		for (const r of rest) if (out.every((a) => !isEquivalent(r, a))) out.push(r);
		return out;
	}
	return [];
});
/**
* Remove duplicates from an `Iterable`, preserving the order of the first occurrence of each element.
* The equivalence used to compare elements is provided by `Equal.equivalence()` from the `Equal` module.
*
* @since 2.0.0
*/
const dedupe = (self) => dedupeWith(self, equivalence());
/**
* Joins the elements together with "sep" in the middle.
*
* **Example**
*
* ```ts
* import { Array } from "effect"
*
* const strings = ["a", "b", "c"]
* const joined = Array.join(strings, "-")
* console.log(joined) // "a-b-c"
* ```
*
* @since 2.0.0
* @category folding
*/
const join$1 = /* @__PURE__ */ dual(2, (self, sep) => fromIterable$6(self).join(sep));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/BigDecimal.js
/**
* This module provides utility functions and type class instances for working with the `BigDecimal` type in TypeScript.
* It includes functions for basic arithmetic operations, as well as type class instances for `Equivalence` and `Order`.
*
* A `BigDecimal` allows storing any real number to arbitrary precision; which avoids common floating point errors
* (such as 0.1 + 0.2 ≠ 0.3) at the cost of complexity.
*
* Internally, `BigDecimal` uses a `BigInt` object, paired with a 64-bit integer which determines the position of the
* decimal point. Therefore, the precision *is not* actually arbitrary, but limited to 2<sup>63</sup> decimal places.
*
* It is not recommended to convert a floating point number to a decimal directly, as the floating point representation
* may be unexpected.
*
* @module BigDecimal
* @since 2.0.0
* @see {@link module:BigInt} for more similar operations on `bigint` types
* @see {@link module:Number} for more similar operations on `number` types
*/
const FINITE_INT_REGEX = /^[+-]?\d+$/;
/**
* @since 2.0.0
* @category symbols
*/
const TypeId$10 = /* @__PURE__ */ Symbol.for("effect/BigDecimal");
const BigDecimalProto = {
	[TypeId$10]: TypeId$10,
	[symbol$1]() {
		const normalized = normalize(this);
		return pipe(hash(normalized.value), combine$5(number$1(normalized.scale)), cached(this));
	},
	[symbol](that) {
		return isBigDecimal(that) && equals$1(this, that);
	},
	toString() {
		return `BigDecimal(${format$3(this)})`;
	},
	toJSON() {
		return {
			_id: "BigDecimal",
			value: String(this.value),
			scale: this.scale
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/**
* Checks if a given value is a `BigDecimal`.
*
* @since 2.0.0
* @category guards
*/
const isBigDecimal = (u) => hasProperty(u, TypeId$10);
/**
* Creates a `BigDecimal` from a `bigint` value and a scale.
*
* @since 2.0.0
* @category constructors
*/
const make$22 = (value, scale) => {
	const o = Object.create(BigDecimalProto);
	o.value = value;
	o.scale = scale;
	return o;
};
/**
* Internal function used to create pre-normalized `BigDecimal`s.
*
* @internal
*/
const unsafeMakeNormalized = (value, scale) => {
	if (value !== bigint0$2 && value % bigint10 === bigint0$2) throw new RangeError("Value must be normalized");
	const o = make$22(value, scale);
	o.normalized = o;
	return o;
};
const bigint0$2 = /* @__PURE__ */ BigInt(0);
const bigint10 = /* @__PURE__ */ BigInt(10);
const zero$1 = /* @__PURE__ */ unsafeMakeNormalized(bigint0$2, 0);
/**
* Normalizes a given `BigDecimal` by removing trailing zeros.
*
* **Example**
*
* ```ts
* import * as assert from "node:assert"
* import { normalize, make, unsafeFromString } from "effect/BigDecimal"
*
* assert.deepStrictEqual(normalize(unsafeFromString("123.00000")), normalize(make(123n, 0)))
* assert.deepStrictEqual(normalize(unsafeFromString("12300000")), normalize(make(123n, -5)))
* ```
*
* @since 2.0.0
* @category scaling
*/
const normalize = (self) => {
	if (self.normalized === void 0) if (self.value === bigint0$2) self.normalized = zero$1;
	else {
		const digits = `${self.value}`;
		let trail = 0;
		for (let i = digits.length - 1; i >= 0; i--) if (digits[i] === "0") trail++;
		else break;
		if (trail === 0) self.normalized = self;
		self.normalized = unsafeMakeNormalized(BigInt(digits.substring(0, digits.length - trail)), self.scale - trail);
	}
	return self.normalized;
};
/**
* Scales a given `BigDecimal` to the specified scale.
*
* If the given scale is smaller than the current scale, the value will be rounded down to
* the nearest integer.
*
* @since 2.0.0
* @category scaling
*/
const scale = /* @__PURE__ */ dual(2, (self, scale) => {
	if (scale > self.scale) return make$22(self.value * bigint10 ** BigInt(scale - self.scale), scale);
	if (scale < self.scale) return make$22(self.value / bigint10 ** BigInt(self.scale - scale), scale);
	return self;
});
/**
* Determines the absolute value of a given `BigDecimal`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { abs, unsafeFromString } from "effect/BigDecimal"
*
* assert.deepStrictEqual(abs(unsafeFromString("-5")), unsafeFromString("5"))
* assert.deepStrictEqual(abs(unsafeFromString("0")), unsafeFromString("0"))
* assert.deepStrictEqual(abs(unsafeFromString("5")), unsafeFromString("5"))
* ```
*
* @since 2.0.0
* @category math
*/
const abs = (n) => n.value < bigint0$2 ? make$22(-n.value, n.scale) : n;
/**
* @category instances
* @since 2.0.0
*/
const Equivalence$3 = /* @__PURE__ */ make$25((self, that) => {
	if (self.scale > that.scale) return scale(that, self.scale).value === self.value;
	if (self.scale < that.scale) return scale(self, that.scale).value === that.value;
	return self.value === that.value;
});
/**
* Checks if two `BigDecimal`s are equal.
*
* @since 2.0.0
* @category predicates
*/
const equals$1 = /* @__PURE__ */ dual(2, (self, that) => Equivalence$3(self, that));
/**
* Creates a `BigDecimal` from a `number` value.
*
* It is not recommended to convert a floating point number to a decimal directly,
* as the floating point representation may be unexpected.
*
* Throws a `RangeError` if the number is not finite (`NaN`, `+Infinity` or `-Infinity`).
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { unsafeFromNumber, make } from "effect/BigDecimal"
*
* assert.deepStrictEqual(unsafeFromNumber(123), make(123n, 0))
* assert.deepStrictEqual(unsafeFromNumber(123.456), make(123456n, 3))
* ```
*
* @since 3.11.0
* @category constructors
*/
const unsafeFromNumber = (n) => getOrThrowWith(safeFromNumber(n), () => /* @__PURE__ */ new RangeError(`Number must be finite, got ${n}`));
/**
* Creates a `BigDecimal` from a `number` value.
*
* It is not recommended to convert a floating point number to a decimal directly,
* as the floating point representation may be unexpected.
*
* Returns `None` if the number is not finite (`NaN`, `+Infinity` or `-Infinity`).
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { BigDecimal, Option } from "effect"
*
* assert.deepStrictEqual(BigDecimal.safeFromNumber(123), Option.some(BigDecimal.make(123n, 0)))
* assert.deepStrictEqual(BigDecimal.safeFromNumber(123.456), Option.some(BigDecimal.make(123456n, 3)))
* assert.deepStrictEqual(BigDecimal.safeFromNumber(Infinity), Option.none())
* ```
*
* @since 3.11.0
* @category constructors
*/
const safeFromNumber = (n) => {
	if (!Number.isFinite(n)) return none$4();
	const string = `${n}`;
	if (string.includes("e")) return fromString$1(string);
	const [lead, trail = ""] = string.split(".");
	return some(make$22(BigInt(`${lead}${trail}`), trail.length));
};
/**
* Parses a numerical `string` into a `BigDecimal`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { BigDecimal, Option } from "effect"
*
* assert.deepStrictEqual(BigDecimal.fromString("123"), Option.some(BigDecimal.make(123n, 0)))
* assert.deepStrictEqual(BigDecimal.fromString("123.456"), Option.some(BigDecimal.make(123456n, 3)))
* assert.deepStrictEqual(BigDecimal.fromString("123.abc"), Option.none())
* ```
*
* @since 2.0.0
* @category constructors
*/
const fromString$1 = (s) => {
	if (s === "") return some(zero$1);
	let base;
	let exp;
	const seperator = s.search(/[eE]/);
	if (seperator !== -1) {
		const trail = s.slice(seperator + 1);
		base = s.slice(0, seperator);
		exp = Number(trail);
		if (base === "" || !Number.isSafeInteger(exp) || !FINITE_INT_REGEX.test(trail)) return none$4();
	} else {
		base = s;
		exp = 0;
	}
	let digits;
	let offset;
	const dot = base.search(/\./);
	if (dot !== -1) {
		const lead = base.slice(0, dot);
		const trail = base.slice(dot + 1);
		digits = `${lead}${trail}`;
		offset = trail.length;
	} else {
		digits = base;
		offset = 0;
	}
	if (!FINITE_INT_REGEX.test(digits)) return none$4();
	const scale = offset - exp;
	if (!Number.isSafeInteger(scale)) return none$4();
	return some(make$22(BigInt(digits), scale));
};
/**
* Formats a given `BigDecimal` as a `string`.
*
* If the scale of the `BigDecimal` is greater than or equal to 16, the `BigDecimal` will
* be formatted in scientific notation.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { format, unsafeFromString } from "effect/BigDecimal"
*
* assert.deepStrictEqual(format(unsafeFromString("-5")), "-5")
* assert.deepStrictEqual(format(unsafeFromString("123.456")), "123.456")
* assert.deepStrictEqual(format(unsafeFromString("-0.00000123")), "-0.00000123")
* ```
*
* @since 2.0.0
* @category conversions
*/
const format$3 = (n) => {
	const normalized = normalize(n);
	if (Math.abs(normalized.scale) >= 16) return toExponential(normalized);
	const negative = normalized.value < bigint0$2;
	const absolute = negative ? `${normalized.value}`.substring(1) : `${normalized.value}`;
	let before;
	let after;
	if (normalized.scale >= absolute.length) {
		before = "0";
		after = "0".repeat(normalized.scale - absolute.length) + absolute;
	} else {
		const location = absolute.length - normalized.scale;
		if (location > absolute.length) {
			const zeros = location - absolute.length;
			before = `${absolute}${"0".repeat(zeros)}`;
			after = "";
		} else {
			after = absolute.slice(location);
			before = absolute.slice(0, location);
		}
	}
	const complete = after === "" ? before : `${before}.${after}`;
	return negative ? `-${complete}` : complete;
};
/**
* Formats a given `BigDecimal` as a `string` in scientific notation.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { toExponential, make } from "effect/BigDecimal"
*
* assert.deepStrictEqual(toExponential(make(123456n, -5)), "1.23456e+10")
* ```
*
* @since 3.11.0
* @category conversions
*/
const toExponential = (n) => {
	if (isZero$1(n)) return "0e+0";
	const normalized = normalize(n);
	const digits = `${abs(normalized).value}`;
	const head = digits.slice(0, 1);
	const tail = digits.slice(1);
	let output = `${isNegative(normalized) ? "-" : ""}${head}`;
	if (tail !== "") output += `.${tail}`;
	const exp = tail.length - normalized.scale;
	return `${output}e${exp >= 0 ? "+" : ""}${exp}`;
};
/**
* Converts a `BigDecimal` to a `number`.
*
* This function will produce incorrect results if the `BigDecimal` exceeds the 64-bit range of a `number`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { unsafeToNumber, unsafeFromString } from "effect/BigDecimal"
*
* assert.deepStrictEqual(unsafeToNumber(unsafeFromString("123.456")), 123.456)
* ```
*
* @since 2.0.0
* @category conversions
*/
const unsafeToNumber = (n) => Number(format$3(n));
/**
* Checks if a given `BigDecimal` is `0`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isZero, unsafeFromString } from "effect/BigDecimal"
*
* assert.deepStrictEqual(isZero(unsafeFromString("0")), true)
* assert.deepStrictEqual(isZero(unsafeFromString("1")), false)
* ```
*
* @since 2.0.0
* @category predicates
*/
const isZero$1 = (n) => n.value === bigint0$2;
/**
* Checks if a given `BigDecimal` is negative.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { isNegative, unsafeFromString } from "effect/BigDecimal"
*
* assert.deepStrictEqual(isNegative(unsafeFromString("-1")), true)
* assert.deepStrictEqual(isNegative(unsafeFromString("0")), false)
* assert.deepStrictEqual(isNegative(unsafeFromString("1")), false)
* ```
*
* @since 2.0.0
* @category predicates
*/
const isNegative = (n) => n.value < bigint0$2;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/BigInt.js
/**
* Takes a `bigint` and returns an `Option` of `number`.
*
* If the `bigint` is outside the safe integer range for JavaScript (`Number.MAX_SAFE_INTEGER`
* and `Number.MIN_SAFE_INTEGER`), it returns `Option.none()`. Otherwise, it converts the `bigint`
* to a number and returns `Option.some(number)`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { BigInt as BI, Option } from "effect"
*
* assert.deepStrictEqual(BI.toNumber(BigInt(42)), Option.some(42))
* assert.deepStrictEqual(BI.toNumber(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)), Option.none())
* assert.deepStrictEqual(BI.toNumber(BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1)), Option.none())
* ```
*
* @category conversions
* @since 2.0.0
*/
const toNumber = (b) => {
	if (b > BigInt(Number.MAX_SAFE_INTEGER) || b < BigInt(Number.MIN_SAFE_INTEGER)) return none$4();
	return some(Number(b));
};
/**
* Takes a string and returns an `Option` of `bigint`.
*
* If the string is empty or contains characters that cannot be converted into a `bigint`,
* it returns `Option.none()`, otherwise, it returns `Option.some(bigint)`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { BigInt as BI, Option } from "effect"
*
* assert.deepStrictEqual(BI.fromString("42"), Option.some(BigInt(42)))
* assert.deepStrictEqual(BI.fromString(" "), Option.none())
* assert.deepStrictEqual(BI.fromString("a"), Option.none())
* ```
*
* @category conversions
* @since 2.4.12
*/
const fromString = (s) => {
	try {
		return s.trim() === "" ? none$4() : some(BigInt(s));
	} catch {
		return none$4();
	}
};
/**
* Takes a number and returns an `Option` of `bigint`.
*
* If the number is outside the safe integer range for JavaScript (`Number.MAX_SAFE_INTEGER`
* and `Number.MIN_SAFE_INTEGER`), it returns `Option.none()`. Otherwise, it attempts to
* convert the number to a `bigint` and returns `Option.some(bigint)`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { BigInt as BI, Option } from "effect"
*
* assert.deepStrictEqual(BI.fromNumber(42), Option.some(BigInt(42)))
* assert.deepStrictEqual(BI.fromNumber(Number.MAX_SAFE_INTEGER + 1), Option.none())
* assert.deepStrictEqual(BI.fromNumber(Number.MIN_SAFE_INTEGER - 1), Option.none())
* ```
*
* @category conversions
* @since 2.4.12
*/
const fromNumber = (n) => {
	if (n > Number.MAX_SAFE_INTEGER || n < Number.MIN_SAFE_INTEGER) return none$4();
	try {
		return some(BigInt(n));
	} catch {
		return none$4();
	}
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Boolean.js
/**
* Negates the given boolean: `!self`
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { not } from "effect/Boolean"
*
* assert.deepStrictEqual(not(true), false)
* assert.deepStrictEqual(not(false), true)
* ```
*
* @category combinators
* @since 2.0.0
*/
const not = (self) => !self;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Chunk.js
/**
* @since 2.0.0
*/
const TypeId$9 = /* @__PURE__ */ Symbol.for("effect/Chunk");
function copy(src, srcPos, dest, destPos, len) {
	for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) dest[destPos + i - srcPos] = src[i];
	return dest;
}
const emptyArray = [];
/**
* Compares the two chunks of equal length using the specified function
*
* @category equivalence
* @since 2.0.0
*/
const getEquivalence$1 = (isEquivalent) => make$25((self, that) => self.length === that.length && toReadonlyArray(self).every((value, i) => isEquivalent(value, unsafeGet$2(that, i))));
const _equivalence$1 = /* @__PURE__ */ getEquivalence$1(equals$2);
const ChunkProto = {
	[TypeId$9]: { _A: (_) => _ },
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "Chunk",
			values: toReadonlyArray(this).map(toJSON)
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	[symbol](that) {
		return isChunk(that) && _equivalence$1(this, that);
	},
	[symbol$1]() {
		return cached(this, array(toReadonlyArray(this)));
	},
	[Symbol.iterator]() {
		switch (this.backing._tag) {
			case "IArray": return this.backing.array[Symbol.iterator]();
			case "IEmpty": return emptyArray[Symbol.iterator]();
			default: return toReadonlyArray(this)[Symbol.iterator]();
		}
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const makeChunk = (backing) => {
	const chunk = Object.create(ChunkProto);
	chunk.backing = backing;
	switch (backing._tag) {
		case "IEmpty":
			chunk.length = 0;
			chunk.depth = 0;
			chunk.left = chunk;
			chunk.right = chunk;
			break;
		case "IConcat":
			chunk.length = backing.left.length + backing.right.length;
			chunk.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
			chunk.left = backing.left;
			chunk.right = backing.right;
			break;
		case "IArray":
			chunk.length = backing.array.length;
			chunk.depth = 0;
			chunk.left = _empty$6;
			chunk.right = _empty$6;
			break;
		case "ISingleton":
			chunk.length = 1;
			chunk.depth = 0;
			chunk.left = _empty$6;
			chunk.right = _empty$6;
			break;
		case "ISlice":
			chunk.length = backing.length;
			chunk.depth = backing.chunk.depth + 1;
			chunk.left = _empty$6;
			chunk.right = _empty$6;
			break;
	}
	return chunk;
};
/**
* Checks if `u` is a `Chunk<unknown>`
*
* @category constructors
* @since 2.0.0
*/
const isChunk = (u) => hasProperty(u, TypeId$9);
const _empty$6 = /* @__PURE__ */ makeChunk({ _tag: "IEmpty" });
/**
* @category constructors
* @since 2.0.0
*/
const empty$18 = () => _empty$6;
/**
* Builds a `NonEmptyChunk` from an non-empty collection of elements.
*
* @category constructors
* @since 2.0.0
*/
const make$21 = (...as) => unsafeFromNonEmptyArray(as);
/**
* Builds a `NonEmptyChunk` from a single element.
*
* @category constructors
* @since 2.0.0
*/
const of$1 = (a) => makeChunk({
	_tag: "ISingleton",
	a
});
/**
* Creates a new `Chunk` from an iterable collection of values.
*
* @category constructors
* @since 2.0.0
*/
const fromIterable$5 = (self) => isChunk(self) ? self : unsafeFromArray(fromIterable$6(self));
const copyToArray = (self, array, initial) => {
	switch (self.backing._tag) {
		case "IArray":
			copy(self.backing.array, 0, array, initial, self.length);
			break;
		case "IConcat":
			copyToArray(self.left, array, initial);
			copyToArray(self.right, array, initial + self.left.length);
			break;
		case "ISingleton":
			array[initial] = self.backing.a;
			break;
		case "ISlice": {
			let i = 0;
			let j = initial;
			while (i < self.length) {
				array[j] = unsafeGet$2(self, i);
				i += 1;
				j += 1;
			}
			break;
		}
	}
};
const toReadonlyArray_ = (self) => {
	switch (self.backing._tag) {
		case "IEmpty": return emptyArray;
		case "IArray": return self.backing.array;
		default: {
			const arr = new Array(self.length);
			copyToArray(self, arr, 0);
			self.backing = {
				_tag: "IArray",
				array: arr
			};
			self.left = _empty$6;
			self.right = _empty$6;
			self.depth = 0;
			return arr;
		}
	}
};
/**
* Converts a `Chunk` into a `ReadonlyArray`. If the provided `Chunk` is
* non-empty (`NonEmptyChunk`), the function will return a
* `NonEmptyReadonlyArray`, ensuring the non-empty property is preserved.
*
* @category conversions
* @since 2.0.0
*/
const toReadonlyArray = toReadonlyArray_;
const reverseChunk = (self) => {
	switch (self.backing._tag) {
		case "IEmpty":
		case "ISingleton": return self;
		case "IArray": return makeChunk({
			_tag: "IArray",
			array: reverse$2(self.backing.array)
		});
		case "IConcat": return makeChunk({
			_tag: "IConcat",
			left: reverse$1(self.backing.right),
			right: reverse$1(self.backing.left)
		});
		case "ISlice": return unsafeFromArray(reverse$2(toReadonlyArray(self)));
	}
};
/**
* Reverses the order of elements in a `Chunk`.
* Importantly, if the input chunk is a `NonEmptyChunk`, the reversed chunk will also be a `NonEmptyChunk`.
*
* **Example**
*
* ```ts
* import { Chunk } from "effect"
*
* const chunk = Chunk.make(1, 2, 3)
* const result = Chunk.reverse(chunk)
*
* console.log(result)
* // { _id: 'Chunk', values: [ 3, 2, 1 ] }
* ```
*
* @since 2.0.0
* @category elements
*/
const reverse$1 = reverseChunk;
/**
* Wraps an array into a chunk without copying, unsafe on mutable arrays
*
* @since 2.0.0
* @category unsafe
*/
const unsafeFromArray = (self) => self.length === 0 ? empty$18() : self.length === 1 ? of$1(self[0]) : makeChunk({
	_tag: "IArray",
	array: self
});
/**
* Wraps an array into a chunk without copying, unsafe on mutable arrays
*
* @since 2.0.0
* @category unsafe
*/
const unsafeFromNonEmptyArray = (self) => unsafeFromArray(self);
/**
* Gets an element unsafely, will throw on out of bounds
*
* @since 2.0.0
* @category unsafe
*/
const unsafeGet$2 = /* @__PURE__ */ dual(2, (self, index) => {
	switch (self.backing._tag) {
		case "IEmpty": throw new Error(`Index out of bounds`);
		case "ISingleton":
			if (index !== 0) throw new Error(`Index out of bounds`);
			return self.backing.a;
		case "IArray":
			if (index >= self.length || index < 0) throw new Error(`Index out of bounds`);
			return self.backing.array[index];
		case "IConcat": return index < self.left.length ? unsafeGet$2(self.left, index) : unsafeGet$2(self.right, index - self.left.length);
		case "ISlice": return unsafeGet$2(self.backing.chunk, index + self.backing.offset);
	}
});
/**
* Appends the specified element to the end of the `Chunk`.
*
* @category concatenating
* @since 2.0.0
*/
const append = /* @__PURE__ */ dual(2, (self, a) => appendAll$1(self, of$1(a)));
/**
* Prepend an element to the front of a `Chunk`, creating a new `NonEmptyChunk`.
*
* @category concatenating
* @since 2.0.0
*/
const prepend$1 = /* @__PURE__ */ dual(2, (self, elem) => appendAll$1(of$1(elem), self));
/**
* Drops the first up to `n` elements from the chunk
*
* @since 2.0.0
*/
const drop = /* @__PURE__ */ dual(2, (self, n) => {
	if (n <= 0) return self;
	else if (n >= self.length) return _empty$6;
	else switch (self.backing._tag) {
		case "ISlice": return makeChunk({
			_tag: "ISlice",
			chunk: self.backing.chunk,
			offset: self.backing.offset + n,
			length: self.backing.length - n
		});
		case "IConcat":
			if (n > self.left.length) return drop(self.right, n - self.left.length);
			return makeChunk({
				_tag: "IConcat",
				left: drop(self.left, n),
				right: self.right
			});
		default: return makeChunk({
			_tag: "ISlice",
			chunk: self,
			offset: n,
			length: self.length - n
		});
	}
});
/**
* Concatenates two chunks, combining their elements.
* If either chunk is non-empty, the result is also a non-empty chunk.
*
* **Example**
*
* ```ts
* import { Chunk } from "effect"
*
* const result = Chunk.make(1, 2).pipe(Chunk.appendAll(Chunk.make("a", "b")), Chunk.toArray)
*
* console.log(result)
* // [ 1, 2, "a", "b" ]
* ```
*
* @category concatenating
* @since 2.0.0
*/
const appendAll$1 = /* @__PURE__ */ dual(2, (self, that) => {
	if (self.backing._tag === "IEmpty") return that;
	if (that.backing._tag === "IEmpty") return self;
	const diff = that.depth - self.depth;
	if (Math.abs(diff) <= 1) return makeChunk({
		_tag: "IConcat",
		left: self,
		right: that
	});
	else if (diff < -1) if (self.left.depth >= self.right.depth) {
		const nr = appendAll$1(self.right, that);
		return makeChunk({
			_tag: "IConcat",
			left: self.left,
			right: nr
		});
	} else {
		const nrr = appendAll$1(self.right.right, that);
		if (nrr.depth === self.depth - 3) {
			const nr = makeChunk({
				_tag: "IConcat",
				left: self.right.left,
				right: nrr
			});
			return makeChunk({
				_tag: "IConcat",
				left: self.left,
				right: nr
			});
		} else return makeChunk({
			_tag: "IConcat",
			left: makeChunk({
				_tag: "IConcat",
				left: self.left,
				right: self.right.left
			}),
			right: nrr
		});
	}
	else if (that.right.depth >= that.left.depth) return makeChunk({
		_tag: "IConcat",
		left: appendAll$1(self, that.left),
		right: that.right
	});
	else {
		const nll = appendAll$1(self, that.left.left);
		if (nll.depth === that.depth - 3) return makeChunk({
			_tag: "IConcat",
			left: makeChunk({
				_tag: "IConcat",
				left: nll,
				right: that.left.right
			}),
			right: that.right
		});
		else return makeChunk({
			_tag: "IConcat",
			left: nll,
			right: makeChunk({
				_tag: "IConcat",
				left: that.left.right,
				right: that.right
			})
		});
	}
});
/**
* Determines if the chunk is empty.
*
* @since 2.0.0
* @category elements
*/
const isEmpty$3 = (self) => self.length === 0;
/**
* Determines if the chunk is not empty.
*
* @since 2.0.0
* @category elements
*/
const isNonEmpty$2 = (self) => self.length > 0;
/**
* Returns the first element of this chunk.
*
* It will throw an error if the chunk is empty.
*
* @since 2.0.0
* @category unsafe
*/
const unsafeHead = (self) => unsafeGet$2(self, 0);
/**
* Returns the first element of this non empty chunk.
*
* @since 2.0.0
* @category elements
*/
const headNonEmpty = unsafeHead;
/**
* Returns every elements after the first.
*
* @since 2.0.0
* @category elements
*/
const tailNonEmpty = (self) => drop(self, 1);
/** @internal */
const BUCKET_SIZE = /* @__PURE__ */ Math.pow(2, 5);
/** @internal */
const MASK = BUCKET_SIZE - 1;
/** @internal */
const MAX_INDEX_NODE = BUCKET_SIZE / 2;
/** @internal */
const MIN_ARRAY_NODE = BUCKET_SIZE / 4;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/hashMap/bitwise.js
/**
* Hamming weight.
*
* Taken from: http://jsperf.com/hamming-weight
*
* @internal
*/
function popcount(x) {
	x -= x >> 1 & 1431655765;
	x = (x & 858993459) + (x >> 2 & 858993459);
	x = x + (x >> 4) & 252645135;
	x += x >> 8;
	x += x >> 16;
	return x & 127;
}
/** @internal */
function hashFragment(shift, h) {
	return h >>> shift & MASK;
}
/** @internal */
function toBitmap(x) {
	return 1 << x;
}
/** @internal */
function fromBitmap(bitmap, bit) {
	return popcount(bitmap & bit - 1);
}
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/stack.js
const make$20 = (value, previous) => ({
	value,
	previous
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/hashMap/array.js
/** @internal */
function arrayUpdate(mutate, at, v, arr) {
	let out = arr;
	if (!mutate) {
		const len = arr.length;
		out = new Array(len);
		for (let i = 0; i < len; ++i) out[i] = arr[i];
	}
	out[at] = v;
	return out;
}
/** @internal */
function arraySpliceOut(mutate, at, arr) {
	const newLen = arr.length - 1;
	let i = 0;
	let g = 0;
	let out = arr;
	if (mutate) i = g = at;
	else {
		out = new Array(newLen);
		while (i < at) out[g++] = arr[i++];
	}
	++i;
	while (i <= newLen) out[g++] = arr[i++];
	if (mutate) out.length = newLen;
	return out;
}
/** @internal */
function arraySpliceIn(mutate, at, v, arr) {
	const len = arr.length;
	if (mutate) {
		let i = len;
		while (i >= at) arr[i--] = arr[i];
		arr[at] = v;
		return arr;
	}
	let i = 0, g = 0;
	const out = new Array(len + 1);
	while (i < at) out[g++] = arr[i++];
	out[at] = v;
	while (i < len) out[++g] = arr[i++];
	return out;
}
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/hashMap/node.js
/** @internal */
var EmptyNode = class EmptyNode {
	_tag = "EmptyNode";
	modify(edit, _shift, f, hash, key, size) {
		const v = f(none$4());
		if (isNone(v)) return new EmptyNode();
		++size.value;
		return new LeafNode(edit, hash, key, v);
	}
};
/** @internal */
function isEmptyNode(a) {
	return isTagged(a, "EmptyNode");
}
/** @internal */
function isLeafNode(node) {
	return isEmptyNode(node) || node._tag === "LeafNode" || node._tag === "CollisionNode";
}
/** @internal */
function canEditNode(node, edit) {
	return isEmptyNode(node) ? false : edit === node.edit;
}
/** @internal */
var LeafNode = class LeafNode {
	edit;
	hash;
	key;
	value;
	_tag = "LeafNode";
	constructor(edit, hash, key, value) {
		this.edit = edit;
		this.hash = hash;
		this.key = key;
		this.value = value;
	}
	modify(edit, shift, f, hash, key, size) {
		if (equals$2(key, this.key)) {
			const v = f(this.value);
			if (v === this.value) return this;
			else if (isNone(v)) {
				--size.value;
				return new EmptyNode();
			}
			if (canEditNode(this, edit)) {
				this.value = v;
				return this;
			}
			return new LeafNode(edit, hash, key, v);
		}
		const v = f(none$4());
		if (isNone(v)) return this;
		++size.value;
		return mergeLeaves(edit, shift, this.hash, this, hash, new LeafNode(edit, hash, key, v));
	}
};
/** @internal */
var CollisionNode = class CollisionNode {
	edit;
	hash;
	children;
	_tag = "CollisionNode";
	constructor(edit, hash, children) {
		this.edit = edit;
		this.hash = hash;
		this.children = children;
	}
	modify(edit, shift, f, hash, key, size) {
		if (hash === this.hash) {
			const canEdit = canEditNode(this, edit);
			const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key, size);
			if (list === this.children) return this;
			return list.length > 1 ? new CollisionNode(edit, this.hash, list) : list[0];
		}
		const v = f(none$4());
		if (isNone(v)) return this;
		++size.value;
		return mergeLeaves(edit, shift, this.hash, this, hash, new LeafNode(edit, hash, key, v));
	}
	updateCollisionList(mutate, edit, hash, list, f, key, size) {
		const len = list.length;
		for (let i = 0; i < len; ++i) {
			const child = list[i];
			if ("key" in child && equals$2(key, child.key)) {
				const value = child.value;
				const newValue = f(value);
				if (newValue === value) return list;
				if (isNone(newValue)) {
					--size.value;
					return arraySpliceOut(mutate, i, list);
				}
				return arrayUpdate(mutate, i, new LeafNode(edit, hash, key, newValue), list);
			}
		}
		const newValue = f(none$4());
		if (isNone(newValue)) return list;
		++size.value;
		return arrayUpdate(mutate, len, new LeafNode(edit, hash, key, newValue), list);
	}
};
/** @internal */
var IndexedNode = class IndexedNode {
	edit;
	mask;
	children;
	_tag = "IndexedNode";
	constructor(edit, mask, children) {
		this.edit = edit;
		this.mask = mask;
		this.children = children;
	}
	modify(edit, shift, f, hash, key, size) {
		const mask = this.mask;
		const children = this.children;
		const frag = hashFragment(shift, hash);
		const bit = toBitmap(frag);
		const indx = fromBitmap(mask, bit);
		const exists = mask & bit;
		const canEdit = canEditNode(this, edit);
		if (!exists) {
			const _newChild = new EmptyNode().modify(edit, shift + 5, f, hash, key, size);
			if (!_newChild) return this;
			return children.length >= MAX_INDEX_NODE ? expand(edit, frag, _newChild, mask, children) : new IndexedNode(edit, mask | bit, arraySpliceIn(canEdit, indx, _newChild, children));
		}
		const current = children[indx];
		const child = current.modify(edit, shift + 5, f, hash, key, size);
		if (current === child) return this;
		let bitmap = mask;
		let newChildren;
		if (isEmptyNode(child)) {
			bitmap &= ~bit;
			if (!bitmap) return new EmptyNode();
			if (children.length <= 2 && isLeafNode(children[indx ^ 1])) return children[indx ^ 1];
			newChildren = arraySpliceOut(canEdit, indx, children);
		} else newChildren = arrayUpdate(canEdit, indx, child, children);
		if (canEdit) {
			this.mask = bitmap;
			this.children = newChildren;
			return this;
		}
		return new IndexedNode(edit, bitmap, newChildren);
	}
};
/** @internal */
var ArrayNode = class ArrayNode {
	edit;
	size;
	children;
	_tag = "ArrayNode";
	constructor(edit, size, children) {
		this.edit = edit;
		this.size = size;
		this.children = children;
	}
	modify(edit, shift, f, hash, key, size) {
		let count = this.size;
		const children = this.children;
		const frag = hashFragment(shift, hash);
		const child = children[frag];
		const newChild = (child || new EmptyNode()).modify(edit, shift + 5, f, hash, key, size);
		if (child === newChild) return this;
		const canEdit = canEditNode(this, edit);
		let newChildren;
		if (isEmptyNode(child) && !isEmptyNode(newChild)) {
			++count;
			newChildren = arrayUpdate(canEdit, frag, newChild, children);
		} else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
			--count;
			if (count <= MIN_ARRAY_NODE) return pack(edit, count, frag, children);
			newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children);
		} else newChildren = arrayUpdate(canEdit, frag, newChild, children);
		if (canEdit) {
			this.size = count;
			this.children = newChildren;
			return this;
		}
		return new ArrayNode(edit, count, newChildren);
	}
};
function pack(edit, count, removed, elements) {
	const children = new Array(count - 1);
	let g = 0;
	let bitmap = 0;
	for (let i = 0, len = elements.length; i < len; ++i) if (i !== removed) {
		const elem = elements[i];
		if (elem && !isEmptyNode(elem)) {
			children[g++] = elem;
			bitmap |= 1 << i;
		}
	}
	return new IndexedNode(edit, bitmap, children);
}
function expand(edit, frag, child, bitmap, subNodes) {
	const arr = [];
	let bit = bitmap;
	let count = 0;
	for (let i = 0; bit; ++i) {
		if (bit & 1) arr[i] = subNodes[count++];
		bit >>>= 1;
	}
	arr[frag] = child;
	return new ArrayNode(edit, count + 1, arr);
}
function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
	if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1]);
	const subH1 = hashFragment(shift, h1);
	const subH2 = hashFragment(shift, h2);
	if (subH1 === subH2) return (child) => new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child]);
	else {
		const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
		return new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), children);
	}
}
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
	let stack = void 0;
	let currentShift = shift;
	while (true) {
		const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
		if (typeof res === "function") {
			stack = make$20(res, stack);
			currentShift = currentShift + 5;
		} else {
			let final = res;
			while (stack != null) {
				final = stack.value(final);
				stack = stack.previous;
			}
			return final;
		}
	}
}
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/hashMap.js
const HashMapSymbolKey = "effect/HashMap";
/** @internal */
const HashMapTypeId = /* @__PURE__ */ Symbol.for(HashMapSymbolKey);
const HashMapProto = {
	[HashMapTypeId]: HashMapTypeId,
	[Symbol.iterator]() {
		return new HashMapIterator(this, (k, v) => [k, v]);
	},
	[symbol$1]() {
		let hash$1 = hash(HashMapSymbolKey);
		for (const item of this) hash$1 ^= pipe(hash(item[0]), combine$5(hash(item[1])));
		return cached(this, hash$1);
	},
	[symbol](that) {
		if (isHashMap(that)) {
			if (that._size !== this._size) return false;
			for (const item of this) {
				const elem = pipe(that, getHash(item[0], hash(item[0])));
				if (isNone(elem)) return false;
				else if (!equals$2(item[1], elem.value)) return false;
			}
			return true;
		}
		return false;
	},
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "HashMap",
			values: Array.from(this).map(toJSON)
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const makeImpl$1 = (editable, edit, root, size) => {
	const map = Object.create(HashMapProto);
	map._editable = editable;
	map._edit = edit;
	map._root = root;
	map._size = size;
	return map;
};
var HashMapIterator = class HashMapIterator {
	map;
	f;
	v;
	constructor(map, f) {
		this.map = map;
		this.f = f;
		this.v = visitLazy(this.map._root, this.f, void 0);
	}
	next() {
		if (isNone(this.v)) return {
			done: true,
			value: void 0
		};
		const v0 = this.v.value;
		this.v = applyCont(v0.cont);
		return {
			done: false,
			value: v0.value
		};
	}
	[Symbol.iterator]() {
		return new HashMapIterator(this.map, this.f);
	}
};
const applyCont = (cont) => cont ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4]) : none$4();
const visitLazy = (node, f, cont = void 0) => {
	switch (node._tag) {
		case "LeafNode":
			if (isSome(node.value)) return some({
				value: f(node.key, node.value.value),
				cont
			});
			return applyCont(cont);
		case "CollisionNode":
		case "ArrayNode":
		case "IndexedNode": {
			const children = node.children;
			return visitLazyChildren(children.length, children, 0, f, cont);
		}
		default: return applyCont(cont);
	}
};
const visitLazyChildren = (len, children, i, f, cont) => {
	while (i < len) {
		const child = children[i++];
		if (child && !isEmptyNode(child)) return visitLazy(child, f, [
			len,
			children,
			i,
			f,
			cont
		]);
	}
	return applyCont(cont);
};
const _empty$5 = /* @__PURE__ */ makeImpl$1(false, 0, /* @__PURE__ */ new EmptyNode(), 0);
/** @internal */
const empty$17 = () => _empty$5;
/** @internal */
const fromIterable$4 = (entries) => {
	const map = beginMutation$1(empty$17());
	for (const entry of entries) set$3(map, entry[0], entry[1]);
	return endMutation$1(map);
};
/** @internal */
const isHashMap = (u) => hasProperty(u, HashMapTypeId);
/** @internal */
const isEmpty$2 = (self) => self && isEmptyNode(self._root);
/** @internal */
const get$6 = /* @__PURE__ */ dual(2, (self, key) => getHash(self, key, hash(key)));
/** @internal */
const getHash = /* @__PURE__ */ dual(3, (self, key, hash) => {
	let node = self._root;
	let shift = 0;
	while (true) switch (node._tag) {
		case "LeafNode": return equals$2(key, node.key) ? node.value : none$4();
		case "CollisionNode":
			if (hash === node.hash) {
				const children = node.children;
				for (let i = 0, len = children.length; i < len; ++i) {
					const child = children[i];
					if ("key" in child && equals$2(key, child.key)) return child.value;
				}
			}
			return none$4();
		case "IndexedNode": {
			const bit = toBitmap(hashFragment(shift, hash));
			if (node.mask & bit) {
				node = node.children[fromBitmap(node.mask, bit)];
				shift += 5;
				break;
			}
			return none$4();
		}
		case "ArrayNode":
			node = node.children[hashFragment(shift, hash)];
			if (node) {
				shift += 5;
				break;
			}
			return none$4();
		default: return none$4();
	}
});
/** @internal */
const has$3 = /* @__PURE__ */ dual(2, (self, key) => isSome(getHash(self, key, hash(key))));
/** @internal */
const set$3 = /* @__PURE__ */ dual(3, (self, key, value) => modifyAt$1(self, key, () => some(value)));
/** @internal */
const setTree = /* @__PURE__ */ dual(3, (self, newRoot, newSize) => {
	if (self._editable) {
		self._root = newRoot;
		self._size = newSize;
		return self;
	}
	return newRoot === self._root ? self : makeImpl$1(self._editable, self._edit, newRoot, newSize);
});
/** @internal */
const keys$1 = (self) => new HashMapIterator(self, (key) => key);
/** @internal */
const size$2 = (self) => self._size;
/** @internal */
const beginMutation$1 = (self) => makeImpl$1(true, self._edit + 1, self._root, self._size);
/** @internal */
const endMutation$1 = (self) => {
	self._editable = false;
	return self;
};
/** @internal */
const modifyAt$1 = /* @__PURE__ */ dual(3, (self, key, f) => modifyHash(self, key, hash(key), f));
/** @internal */
const modifyHash = /* @__PURE__ */ dual(4, (self, key, hash, f) => {
	const size = { value: self._size };
	return pipe(self, setTree(self._root.modify(self._editable ? self._edit : NaN, 0, f, hash, key, size), size.value));
});
/** @internal */
const remove$2 = /* @__PURE__ */ dual(2, (self, key) => modifyAt$1(self, key, none$4));
/**
* Maps over the entries of the `HashMap` using the specified function.
*
* @since 2.0.0
* @category mapping
*/
const map$4 = /* @__PURE__ */ dual(2, (self, f) => reduce$5(self, empty$17(), (map, value, key) => set$3(map, key, f(value, key))));
/** @internal */
const forEach$3 = /* @__PURE__ */ dual(2, (self, f) => reduce$5(self, void 0, (_, value, key) => f(value, key)));
/** @internal */
const reduce$5 = /* @__PURE__ */ dual(3, (self, zero, f) => {
	const root = self._root;
	if (root._tag === "LeafNode") return isSome(root.value) ? f(zero, root.value.value, root.key) : zero;
	if (root._tag === "EmptyNode") return zero;
	const toVisit = [root.children];
	let children;
	while (children = toVisit.pop()) for (let i = 0, len = children.length; i < len;) {
		const child = children[i++];
		if (child && !isEmptyNode(child)) if (child._tag === "LeafNode") {
			if (isSome(child.value)) zero = f(zero, child.value.value, child.key);
		} else toVisit.push(child.children);
	}
	return zero;
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/hashSet.js
const HashSetSymbolKey = "effect/HashSet";
/** @internal */
const HashSetTypeId = /* @__PURE__ */ Symbol.for(HashSetSymbolKey);
const HashSetProto = {
	[HashSetTypeId]: HashSetTypeId,
	[Symbol.iterator]() {
		return keys$1(this._keyMap);
	},
	[symbol$1]() {
		return cached(this, combine$5(hash(this._keyMap))(hash(HashSetSymbolKey)));
	},
	[symbol](that) {
		if (isHashSet(that)) return size$2(this._keyMap) === size$2(that._keyMap) && equals$2(this._keyMap, that._keyMap);
		return false;
	},
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "HashSet",
			values: Array.from(this).map(toJSON)
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const makeImpl = (keyMap) => {
	const set = Object.create(HashSetProto);
	set._keyMap = keyMap;
	return set;
};
/** @internal */
const isHashSet = (u) => hasProperty(u, HashSetTypeId);
const _empty$4 = /* @__PURE__ */ makeImpl(/* @__PURE__ */ empty$17());
/** @internal */
const empty$16 = () => _empty$4;
/** @internal */
const fromIterable$3 = (elements) => {
	const set = beginMutation(empty$16());
	for (const value of elements) add$3(set, value);
	return endMutation(set);
};
/** @internal */
const make$19 = (...elements) => {
	const set = beginMutation(empty$16());
	for (const value of elements) add$3(set, value);
	return endMutation(set);
};
/** @internal */
const has$2 = /* @__PURE__ */ dual(2, (self, value) => has$3(self._keyMap, value));
/** @internal */
const size$1 = (self) => size$2(self._keyMap);
/** @internal */
const beginMutation = (self) => makeImpl(beginMutation$1(self._keyMap));
/** @internal */
const endMutation = (self) => {
	self._keyMap._editable = false;
	return self;
};
/** @internal */
const mutate = /* @__PURE__ */ dual(2, (self, f) => {
	const transient = beginMutation(self);
	f(transient);
	return endMutation(transient);
});
/** @internal */
const add$3 = /* @__PURE__ */ dual(2, (self, value) => self._keyMap._editable ? (set$3(value, true)(self._keyMap), self) : makeImpl(set$3(value, true)(self._keyMap)));
/** @internal */
const remove$1 = /* @__PURE__ */ dual(2, (self, value) => self._keyMap._editable ? (remove$2(value)(self._keyMap), self) : makeImpl(remove$2(value)(self._keyMap)));
/** @internal */
const difference$1 = /* @__PURE__ */ dual(2, (self, that) => mutate(self, (set) => {
	for (const value of that) remove$1(set, value);
}));
/** @internal */
const union$1 = /* @__PURE__ */ dual(2, (self, that) => mutate(empty$16(), (set) => {
	forEach$2(self, (value) => add$3(set, value));
	for (const value of that) add$3(set, value);
}));
/** @internal */
const forEach$2 = /* @__PURE__ */ dual(2, (self, f) => forEach$3(self._keyMap, (_, k) => f(k)));
/** @internal */
const reduce$4 = /* @__PURE__ */ dual(3, (self, zero, f) => reduce$5(self._keyMap, zero, (z, _, a) => f(z, a)));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/HashSet.js
/**
* # HashSet
*
* An immutable `HashSet` provides a collection of unique values with efficient
* lookup, insertion and removal. Once created, a `HashSet` cannot be modified;
* any operation that would alter the set instead returns a new `HashSet` with
* the changes. This immutability offers benefits like predictable state
* management and easier reasoning about your code.
*
* ## What Problem Does It Solve?
*
* `HashSet` solves the problem of maintaining an unsorted collection where each
* value appears exactly once, with fast operations for checking membership and
* adding/removing values.
*
* ## When to Use
*
* Use `HashSet` when you need:
*
* - A collection with no duplicate values
* - Efficient membership testing (**`O(1)`** average complexity)
* - Set operations like union, intersection, and difference
* - An immutable data structure that preserves functional programming patterns
*
* ## Advanced Features
*
* HashSet provides operations for:
*
* - Transforming sets with map and flatMap
* - Filtering elements with filter
* - Combining sets with union, intersection and difference
* - Performance optimizations via mutable operations in controlled contexts
*
* ## Performance Characteristics
*
* - **Lookup** operations ({@link module:HashSet.has}): **`O(1)`** average time
*   complexity
* - **Insertion** operations ({@link module:HashSet.add}): **`O(1)`** average time
*   complexity
* - **Removal** operations ({@link module:HashSet.remove}): **`O(1)`** average
*   time complexity
* - **Set** operations ({@link module:HashSet.union},
*   {@link module:HashSet.intersection}): **`O(n)`** where n is the size of the
*   smaller set
* - **Iteration**: **`O(n)`** where n is the size of the set
*
* The HashSet data structure implements the following traits:
*
* - {@link Iterable}: allows iterating over the values in the set
* - {@link Equal}: allows comparing two sets for value-based equality
* - {@link Pipeable}: allows chaining operations with the pipe operator
* - {@link Inspectable}: allows inspecting the contents of the set
*
* ## Operations Reference
*
* | Category     | Operation                           | Description                                 | Complexity |
* | ------------ | ----------------------------------- | ------------------------------------------- | ---------- |
* | constructors | {@link module:HashSet.empty}        | Creates an empty HashSet                    | O(1)       |
* | constructors | {@link module:HashSet.fromIterable} | Creates a HashSet from an iterable          | O(n)       |
* | constructors | {@link module:HashSet.make}         | Creates a HashSet from multiple values      | O(n)       |
* |              |                                     |                                             |            |
* | elements     | {@link module:HashSet.has}          | Checks if a value exists in the set         | O(1) avg   |
* | elements     | {@link module:HashSet.some}         | Checks if any element satisfies a predicate | O(n)       |
* | elements     | {@link module:HashSet.every}        | Checks if all elements satisfy a predicate  | O(n)       |
* | elements     | {@link module:HashSet.isSubset}     | Checks if a set is a subset of another      | O(n)       |
* |              |                                     |                                             |            |
* | getters      | {@link module:HashSet.values}       | Gets an iterator of all values              | O(1)       |
* | getters      | {@link module:HashSet.toValues}     | Gets an array of all values                 | O(n)       |
* | getters      | {@link module:HashSet.size}         | Gets the number of elements                 | O(1)       |
* |              |                                     |                                             |            |
* | mutations    | {@link module:HashSet.add}          | Adds a value to the set                     | O(1) avg   |
* | mutations    | {@link module:HashSet.remove}       | Removes a value from the set                | O(1) avg   |
* | mutations    | {@link module:HashSet.toggle}       | Toggles a value's presence                  | O(1) avg   |
* |              |                                     |                                             |            |
* | operations   | {@link module:HashSet.difference}   | Computes set difference (A - B)             | O(n)       |
* | operations   | {@link module:HashSet.intersection} | Computes set intersection (A ∩ B)           | O(n)       |
* | operations   | {@link module:HashSet.union}        | Computes set union (A ∪ B)                  | O(n)       |
* |              |                                     |                                             |            |
* | mapping      | {@link module:HashSet.map}          | Transforms each element                     | O(n)       |
* |              |                                     |                                             |            |
* | sequencing   | {@link module:HashSet.flatMap}      | Transforms and flattens elements            | O(n)       |
* |              |                                     |                                             |            |
* | traversing   | {@link module:HashSet.forEach}      | Applies a function to each element          | O(n)       |
* |              |                                     |                                             |            |
* | folding      | {@link module:HashSet.reduce}       | Reduces the set to a single value           | O(n)       |
* |              |                                     |                                             |            |
* | filtering    | {@link module:HashSet.filter}       | Keeps elements that satisfy a predicate     | O(n)       |
* |              |                                     |                                             |            |
* | partitioning | {@link module:HashSet.partition}    | Splits into two sets by a predicate         | O(n)       |
*
* ## Notes
*
* ### Composability with the Effect Ecosystem:
*
* This `HashSet` is designed to work seamlessly within the Effect ecosystem. It
* implements the {@link Iterable}, {@link Equal}, {@link Pipeable}, and
* {@link Inspectable} traits from Effect. This ensures compatibility with other
* Effect data structures and functionalities. For example, you can easily use
* Effect's `pipe` method to chain operations on the `HashSet`.
*
* **Equality of Elements with Effect's {@link Equal `Equal`} Trait:**
*
* This `HashSet` relies on Effect's {@link Equal} trait to determine the
* uniqueness of elements within the set. The way equality is checked depends on
* the type of the elements:
*
* - **Primitive Values:** For primitive JavaScript values like strings, numbers,
*   booleans, `null`, and `undefined`, equality is determined by their value
*   (similar to the `===` operator).
* - **Objects and Custom Types:** For objects and other custom types, equality is
*   determined by whether those types implement the {@link Equal} interface
*   themselves. If an element type implements `Equal`, the `HashSet` will
*   delegate to that implementation to perform the equality check. This allows
*   you to define custom logic for determining when two instances of your
*   objects should be considered equal based on their properties, rather than
*   just their object identity.
*
* ```ts
* import { Equal, Hash, HashSet } from "effect"
*
* class Person implements Equal.Equal {
*   constructor(
*     readonly id: number, // Unique identifier
*     readonly name: string,
*     readonly age: number
*   ) {}
*
*   // Define equality based on id, name, and age
*   [Equal.symbol](that: Equal.Equal): boolean {
*     if (that instanceof Person) {
*       return (
*         Equal.equals(this.id, that.id) &&
*         Equal.equals(this.name, that.name) &&
*         Equal.equals(this.age, that.age)
*       )
*     }
*     return false
*   }
*
*   // Generate a hash code based on the unique id
*   [Hash.symbol](): number {
*     return Hash.hash(this.id)
*   }
* }
*
* // Creating a HashSet with objects that implement the Equal interface
* const set = HashSet.empty().pipe(
*   HashSet.add(new Person(1, "Alice", 30)),
*   HashSet.add(new Person(1, "Alice", 30))
* )
*
* // HashSet recognizes them as equal, so only one element is stored
* console.log(HashSet.size(set))
* // Output: 1
* ```
*
* **Simplifying Equality and Hashing with `Data` and `Schema`:**
*
* Effect's {@link Data} and {@link Schema `Schema.Data`} modules offer powerful
* ways to automatically handle the implementation of both the {@link Equal} and
* {@link Hash} traits for your custom data structures.
*
* - **`Data` Module:** By using constructors like `Data.struct`, `Data.tuple`,
*   `Data.array`, or `Data.case` to define your data types, Effect
*   automatically generates the necessary implementations for value-based
*   equality and consistent hashing. This significantly reduces boilerplate and
*   ensures correctness.
*
* ```ts
* import { HashSet, Data, Equal } from "effect"
* import assert from "node:assert/strict"
*
* // Data.* implements the `Equal` traits for us
* const person1 = Data.struct({ id: 1, name: "Alice", age: 30 })
* const person2 = Data.struct({ id: 1, name: "Alice", age: 30 })
*
* assert(Equal.equals(person1, person2))
*
* const set = HashSet.empty().pipe(
*   HashSet.add(person1),
*   HashSet.add(person2)
* )
*
* // HashSet recognizes them as equal, so only one element is stored
* console.log(HashSet.size(set)) // Output: 1
* ```
*
* - **`Schema` Module:** When defining data schemas using the {@link Schema}
*   module, you can use `Schema.Data` to automatically include the `Equal` and
*   `Hash` traits in the decoded objects. This is particularly important when
*   working with `HashSet`. **For decoded objects to be correctly recognized as
*   equal within a `HashSet`, ensure that the schema for those objects is
*   defined using `Schema.Data`.**
*
* ```ts
* import { Equal, HashSet, Schema } from "effect"
* import assert from "node:assert/strict"
*
* // Schema.Data implements the `Equal` traits for us
* const PersonSchema = Schema.Data(
*   Schema.Struct({
*     id: Schema.Number,
*     name: Schema.String,
*     age: Schema.Number
*   })
* )
*
* const Person = Schema.decode(PersonSchema)
*
* const person1 = Person({ id: 1, name: "Alice", age: 30 })
* const person2 = Person({ id: 1, name: "Alice", age: 30 })
*
* assert(Equal.equals(person1, person2)) // Output: true
*
* const set = HashSet.empty().pipe(
*   HashSet.add(person1),
*   HashSet.add(person2)
* )
*
* // HashSet thanks to Schema.Data implementation of the `Equal` trait, recognizes the two Person as equal, so only one element is stored
* console.log(HashSet.size(set)) // Output: 1
* ```
*
* ### Interoperability with the JavaScript Runtime:
*
* To interoperate with the regular JavaScript runtime, Effect's `HashSet`
* provides methods to access its elements in formats readily usable by
* JavaScript APIs: {@link values `HashSet.values`},
* {@link toValues `HashSet.toValues`}
*
* ```ts
* import { HashSet } from "effect"
*
* const hashSet: HashSet.HashSet<number> = HashSet.make(1, 2, 3)
*
* // Using HashSet.values to convert HashSet.HashSet<A> to IterableIterator<A>
* const iterable: IterableIterator<number> = HashSet.values(hashSet)
*
* console.log(...iterable) // Logs:  1 2 3
*
* // Using HashSet.toValues to convert HashSet.HashSet<A> to Array<A>
* const array: Array<number> = HashSet.toValues(hashSet)
*
* console.log(array) // Logs: [ 1, 2, 3 ]
* ```
*
* Be mindful of performance implications (both time and space complexity) when
* frequently converting between Effect's immutable HashSet and mutable
* JavaScript data structures, especially for large collections.
*
* @module HashSet
* @since 2.0.0
*/
/**
* Creates an empty `HashSet`.
*
* Time complexity: **`O(1)`**
*
* @memberof HashSet
* @since 2.0.0
* @category constructors
* @example
*
* ```ts
* import { HashSet, pipe } from "effect"
*
* console.log(
*   pipe(
*     // Provide a type argument to create a HashSet of a specific type
*     HashSet.empty<number>(),
*     HashSet.add(1),
*     HashSet.add(1), // Notice the duplicate
*     HashSet.add(2),
*     HashSet.toValues
*   )
* ) // Output: [1, 2]
* ```
*
* @see Other `HashSet` constructors are {@link module:HashSet.make} {@link module:HashSet.fromIterable}
*/
const empty$15 = empty$16;
/**
* Creates a new `HashSet` from an iterable collection of values.
*
* Time complexity: **`O(n)`** where n is the number of elements in the iterable
*
* @memberof HashSet
* @since 2.0.0
* @category constructors
* @example
*
* ```ts
* // Creating a HashSet from an Array
* import { HashSet, pipe } from "effect"
*
* console.log(
*   pipe(
*     [1, 2, 3, 4, 5, 1, 2, 3], // Array<number> is an Iterable<number>;  Note the duplicates.
*     HashSet.fromIterable,
*     HashSet.toValues
*   )
* ) // Output: [1, 2, 3, 4, 5]
* ```
*
* @example
*
* ```ts
* // Creating a HashSet from a Set
* import { HashSet, pipe } from "effect"
*
* console.log(
*   pipe(
*     new Set(["apple", "banana", "orange", "apple"]), // Set<string> is an Iterable<string>
*     HashSet.fromIterable,
*     HashSet.toValues
*   )
* ) // Output: ["apple", "banana", "orange"]
* ```
*
* @example
*
* ```ts
* // Creating a HashSet from a Generator
* import { HashSet } from "effect"
*
* // Generator functions return iterables
* function* fibonacci(n: number): Generator<number, void, unknown> {
*   let [a, b] = [0, 1]
*   for (let i = 0; i < n; i++) {
*     yield a
*     ;[a, b] = [b, a + b]
*   }
* }
*
* // Create a HashSet from the first 10 Fibonacci numbers
* const fibonacciSet = HashSet.fromIterable(fibonacci(10))
*
* console.log(HashSet.toValues(fibonacciSet))
* // Outputs: [0, 1, 2, 3, 5, 8, 13, 21, 34] but in unsorted order
* ```
*
* @example
*
* ```ts
* //  Creating a HashSet from another HashSet
* import { HashSet, pipe } from "effect"
*
* console.log(
*   pipe(
*     // since HashSet implements the Iterable interface, we can use it to create a new HashSet
*     HashSet.make(1, 2, 3, 4),
*     HashSet.fromIterable,
*     HashSet.toValues // turns the HashSet back into an array
*   )
* ) // Output: [1, 2, 3, 4]
* ```
*
* @example
*
* ```ts
* // Creating a HashSet from other Effect's data structures like Chunk
* import { Chunk, HashSet, pipe } from "effect"
*
* console.log(
*   pipe(
*     Chunk.make(1, 2, 3, 4), // Iterable<number>
*     HashSet.fromIterable,
*     HashSet.toValues // turns the HashSet back into an array
*   )
* ) // Outputs: [1, 2, 3, 4]
* ```
*
* @see Other `HashSet` constructors are {@link module:HashSet.empty} {@link module:HashSet.make}
*/
const fromIterable$2 = fromIterable$3;
/**
* Construct a new `HashSet` from a variable number of values.
*
* Time complexity: **`O(n)`** where n is the number of elements
*
* @memberof HashSet
* @since 2.0.0
* @category constructors
* @example
*
* ```ts
* import { Equal, Hash, HashSet, pipe } from "effect"
* import assert from "node:assert/strict"
*
* class Character implements Equal.Equal {
*   readonly name: string
*   readonly trait: string
*
*   constructor(name: string, trait: string) {
*     this.name = name
*     this.trait = trait
*   }
*
*   // Define equality based on name, and trait
*   [Equal.symbol](that: Equal.Equal): boolean {
*     if (that instanceof Character) {
*       return (
*         Equal.equals(this.name, that.name) &&
*         Equal.equals(this.trait, that.trait)
*       )
*     }
*     return false
*   }
*
*   // Generate a hash code based on the sum of the character's name and trait
*   [Hash.symbol](): number {
*     return Hash.hash(this.name + this.trait)
*   }
*
*   static readonly of = (name: string, trait: string): Character => {
*     return new Character(name, trait)
*   }
* }
*
* assert.strictEqual(
*   Equal.equals(
*     HashSet.make(
*       Character.of("Alice", "Curious"),
*       Character.of("Alice", "Curious"),
*       Character.of("White Rabbit", "Always late"),
*       Character.of("Mad Hatter", "Tea enthusiast")
*     ),
*     // Is the same as adding each character to an empty set
*     pipe(
*       HashSet.empty(),
*       HashSet.add(Character.of("Alice", "Curious")),
*       HashSet.add(Character.of("Alice", "Curious")), // Alice tried to attend twice!
*       HashSet.add(Character.of("White Rabbit", "Always late")),
*       HashSet.add(Character.of("Mad Hatter", "Tea enthusiast"))
*     )
*   ),
*   true,
*   "`HashSet.make` and `HashSet.empty() + HashSet.add()` should be equal"
* )
*
* assert.strictEqual(
*   Equal.equals(
*     HashSet.make(
*       Character.of("Alice", "Curious"),
*       Character.of("Alice", "Curious"),
*       Character.of("White Rabbit", "Always late"),
*       Character.of("Mad Hatter", "Tea enthusiast")
*     ),
*     HashSet.fromIterable([
*       Character.of("Alice", "Curious"),
*       Character.of("Alice", "Curious"),
*       Character.of("White Rabbit", "Always late"),
*       Character.of("Mad Hatter", "Tea enthusiast")
*     ])
*   ),
*   true,
*   "`HashSet.make` and `HashSet.fromIterable` should be equal"
* )
* ```
*
* @see Other `HashSet` constructors are {@link module:HashSet.fromIterable} {@link module:HashSet.empty}
*/
const make$18 = make$19;
/**
* Checks if the specified value exists in the `HashSet`.
*
* Time complexity: **`O(1)`** average
*
* @memberof HashSet
* @since 2.0.0
* @category elements
* @example
*
* ```ts
* // Syntax
* import { HashSet, pipe } from "effect"
*
* // with `data-last`, a.k.a. `pipeable` API
* pipe(HashSet.make(0, 1, 2), HashSet.has(3)) // false
*
* // or piped with the pipe function
* HashSet.make(0, 1, 2).pipe(HashSet.has(3)) // false
*
* // or with `data-first` API
* HashSet.has(HashSet.make(0, 1, 2), 3) // false
* ```
*
* @returns A `boolean` signaling the presence of the value in the HashSet
* @see Other `HashSet` elements are {@link module:HashSet.some} {@link module:HashSet.every} {@link module:HashSet.isSubset}
*/
const has$1 = has$2;
/**
* Calculates the number of values in the `HashSet`.
*
* Time complexity: **`O(1)`**
*
* @memberof HashSet
* @since 2.0.0
* @category getters
* @example
*
* ```ts
* import { HashSet, pipe } from "effect"
* import assert from "node:assert/strict"
*
* assert.deepStrictEqual(pipe(HashSet.empty(), HashSet.size), 0)
*
* assert.deepStrictEqual(
*   pipe(HashSet.make(1, 2, 2, 3, 4, 3), HashSet.size),
*   4
* )
* ```
*
* @see Other `HashSet` getters are {@link module:HashSet.values} {@link module:HashSet.toValues}
*/
const size = size$1;
/**
* Adds a value to the `HashSet`.
*
* Time complexity: **`O(1)`** average
*
* @remarks
* Remember that a `HashSet` is a collection of unique values, so adding a value
* that already exists in the `HashSet` will not add a duplicate.
*
* Remember that HashSet is an immutable data structure, so the `add` function,
* like all other functions that modify the HashSet, will return a new HashSet
* with the added value.
* @memberof HashSet
* @since 2.0.0
* @example
*
* ```ts
* // Syntax
* import { HashSet, pipe } from "effect"
*
* // with data-last, a.k.a. pipeable API
* pipe(HashSet.empty(), HashSet.add(0), HashSet.add(0))
*
* // or piped with the pipe function
* HashSet.empty().pipe(HashSet.add(0))
*
* // or with data-first API
* HashSet.add(HashSet.empty(), 0)
* ```
*
* @see Other `HashSet` mutations are {@link module:HashSet.remove} {@link module:HashSet.toggle} {@link module:HashSet.beginMutation} {@link module:HashSet.endMutation} {@link module:HashSet.mutate}
*/
const add$2 = add$3;
/**
* Removes a value from the `HashSet`.
*
* Time complexity: **`O(1)`** average
*
* @memberof HashSet
* @since 2.0.0
* @example
*
* ```ts
* // Syntax
* import { HashSet, pipe } from "effect"
*
* // with `data-last`, a.k.a. `pipeable` API
* pipe(HashSet.make(0, 1, 2), HashSet.remove(0))
*
* // or piped with the pipe function
* HashSet.make(0, 1, 2).pipe(HashSet.remove(0))
*
* // or with `data-first` API
* HashSet.remove(HashSet.make(0, 1, 2), 0)
* ```
*
* @see Other `HashSet` mutations are {@link module:HashSet.add} {@link module:HashSet.toggle} {@link module:HashSet.beginMutation} {@link module:HashSet.endMutation} {@link module:HashSet.mutate}
*/
const remove = remove$1;
/**
* Computes the set difference `(A - B)` between this `HashSet` and the
* specified `Iterable<A>`.
*
* Time complexity: **`O(n)`** where n is the number of elements in the set
*
* **NOTE**: the hash and equal of the values in both the set and the iterable
* must be the same; meaning we cannot compute a difference between a `HashSet
* of bananas` and a `HashSet of elephants` as they are not the same type and
* won't implement the Equal trait in the same way.
*
* @memberof HashSet
* @since 2.0.0
* @example
*
* ```ts
* // Syntax
* import { HashSet, pipe } from "effect"
*
* // with data-last, a.k.a. pipeable API
* pipe(HashSet.make(1, 2, 3), HashSet.difference(HashSet.make(3, 4, 5)))
*
* // or piped with the pipe function
* HashSet.make(1, 2, 3).pipe(HashSet.difference(HashSet.make(3, 4, 5)))
*
* // or with data-first API
* HashSet.difference(HashSet.make(1, 2, 3), HashSet.make(3, 4, 5))
* ```
*
* @see Other `HashSet` operations are {@link module:HashSet.intersection} {@link module:HashSet.union}
*/
const difference = difference$1;
/**
* Computes the set union `( self ∪ that )` between this `HashSet` and the
* specified `Iterable<A>`.
*
* Time complexity: **`O(n)`** where n is the number of elements in the set
*
* **NOTE**: the hash and equal of the values in both the set and the iterable
* must be the same.
*
* @memberof HashSet
* @since 2.0.0
* @example
*
* ```ts
* // Syntax
* import { HashSet, pipe } from "effect"
*
* // with data-last, a.k.a. pipeable API
* pipe(HashSet.make(1, 2, 3), HashSet.union(HashSet.make(3, 4, 5)))
*
* // or piped with the pipe function
* HashSet.make(1, 2, 3).pipe(HashSet.union(HashSet.make(3, 4, 5)))
*
* // or with data-first API
* HashSet.union(HashSet.make(1, 2, 3), HashSet.make(3, 4, 5))
* ```
*
* @see Other `HashSet` operations are {@link module:HashSet.difference} {@link module:HashSet.intersection}
*/
const union = union$1;
/**
* Reduces the specified state over the values of the `HashSet`.
*
* The time complexity is of **`O(n)`**.
*
* @memberof HashSet
* @since 2.0.0
* @category folding
* @example
*
* ```ts
* // Syntax
* import { HashSet, pipe } from "effect"
*
* const sum = (a: number, b: number): number => a + b
*
* // with `data-last`, a.k.a. `pipeable` API
* pipe(HashSet.make(0, 1, 2), HashSet.reduce(0, sum))
*
* // or with the pipe method
* HashSet.make(0, 1, 2).pipe(HashSet.reduce(0, sum))
*
* // or with `data-first` API
* HashSet.reduce(HashSet.make(0, 1, 2), 0, sum)
* ```
*/
const reduce$3 = reduce$4;
/** @internal */
const OP_EMPTY$2 = "Empty";
/** @internal */
const OP_FAIL$1 = "Fail";
/** @internal */
const OP_INTERRUPT = "Interrupt";
/** @internal */
const OP_PARALLEL$1 = "Parallel";
/** @internal */
const OP_SEQUENTIAL$1 = "Sequential";
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/cause.js
/** @internal */
const CauseSymbolKey = "effect/Cause";
/** @internal */
const CauseTypeId = /* @__PURE__ */ Symbol.for(CauseSymbolKey);
const variance$4 = { _E: (_) => _ };
/** @internal */
const proto$1 = {
	[CauseTypeId]: variance$4,
	[symbol$1]() {
		return pipe(hash(CauseSymbolKey), combine$5(hash(flattenCause(this))), cached(this));
	},
	[symbol](that) {
		return isCause(that) && causeEquals(this, that);
	},
	pipe() {
		return pipeArguments(this, arguments);
	},
	toJSON() {
		switch (this._tag) {
			case "Empty": return {
				_id: "Cause",
				_tag: this._tag
			};
			case "Die": return {
				_id: "Cause",
				_tag: this._tag,
				defect: toJSON(this.defect)
			};
			case "Interrupt": return {
				_id: "Cause",
				_tag: this._tag,
				fiberId: this.fiberId.toJSON()
			};
			case "Fail": return {
				_id: "Cause",
				_tag: this._tag,
				failure: toJSON(this.error)
			};
			case "Sequential":
			case "Parallel": return {
				_id: "Cause",
				_tag: this._tag,
				left: toJSON(this.left),
				right: toJSON(this.right)
			};
		}
	},
	toString() {
		return pretty$1(this);
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
/** @internal */
const empty$14 = /* @__PURE__ */ (() => {
	const o = /* @__PURE__ */ Object.create(proto$1);
	o._tag = OP_EMPTY$2;
	return o;
})();
/** @internal */
const fail$3 = (error) => {
	const o = Object.create(proto$1);
	o._tag = OP_FAIL$1;
	o.error = error;
	return o;
};
/** @internal */
const die$1 = (defect) => {
	const o = Object.create(proto$1);
	o._tag = "Die";
	o.defect = defect;
	return o;
};
/** @internal */
const interrupt = (fiberId) => {
	const o = Object.create(proto$1);
	o._tag = OP_INTERRUPT;
	o.fiberId = fiberId;
	return o;
};
/** @internal */
const parallel$2 = (left, right) => {
	const o = Object.create(proto$1);
	o._tag = OP_PARALLEL$1;
	o.left = left;
	o.right = right;
	return o;
};
/** @internal */
const sequential$2 = (left, right) => {
	const o = Object.create(proto$1);
	o._tag = OP_SEQUENTIAL$1;
	o.left = left;
	o.right = right;
	return o;
};
/** @internal */
const isCause = (u) => hasProperty(u, CauseTypeId);
/** @internal */
const isEmptyType = (self) => self._tag === OP_EMPTY$2;
/** @internal */
const isFailType$1 = (self) => self._tag === OP_FAIL$1;
/** @internal */
const isEmpty$1 = (self) => {
	if (self._tag === "Empty") return true;
	return reduce$2(self, true, (acc, cause) => {
		switch (cause._tag) {
			case OP_EMPTY$2: return some(acc);
			case "Die":
			case OP_FAIL$1:
			case OP_INTERRUPT: return some(false);
			default: return none$4();
		}
	});
};
/** @internal */
const isInterrupted = (self) => isSome(interruptOption(self));
/** @internal */
const isInterruptedOnly = (self) => reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self);
/** @internal */
const failures = (self) => reverse$1(reduce$2(self, empty$18(), (list, cause) => cause._tag === "Fail" ? some(pipe(list, prepend$1(cause.error))) : none$4()));
/** @internal */
const defects = (self) => reverse$1(reduce$2(self, empty$18(), (list, cause) => cause._tag === "Die" ? some(pipe(list, prepend$1(cause.defect))) : none$4()));
/** @internal */
const interruptors = (self) => reduce$2(self, empty$15(), (set, cause) => cause._tag === "Interrupt" ? some(pipe(set, add$2(cause.fiberId))) : none$4());
/** @internal */
const failureOption = (self) => find(self, (cause) => cause._tag === "Fail" ? some(cause.error) : none$4());
/** @internal */
const failureOrCause = (self) => {
	const option = failureOption(self);
	switch (option._tag) {
		case "None": return right(self);
		case "Some": return left(option.value);
	}
};
/** @internal */
const interruptOption = (self) => find(self, (cause) => cause._tag === "Interrupt" ? some(cause.fiberId) : none$4());
/** @internal */
const stripFailures = (self) => match$2(self, {
	onEmpty: empty$14,
	onFail: () => empty$14,
	onDie: die$1,
	onInterrupt: interrupt,
	onSequential: sequential$2,
	onParallel: parallel$2
});
/** @internal */
const electFailures = (self) => match$2(self, {
	onEmpty: empty$14,
	onFail: die$1,
	onDie: die$1,
	onInterrupt: interrupt,
	onSequential: sequential$2,
	onParallel: parallel$2
});
/** @internal */
const causeEquals = (left, right) => {
	let leftStack = of$1(left);
	let rightStack = of$1(right);
	while (isNonEmpty$2(leftStack) && isNonEmpty$2(rightStack)) {
		const [leftParallel, leftSequential] = pipe(headNonEmpty(leftStack), reduce$2([empty$15(), empty$18()], ([parallel, sequential], cause) => {
			const [par, seq] = evaluateCause(cause);
			return some([pipe(parallel, union(par)), pipe(sequential, appendAll$1(seq))]);
		}));
		const [rightParallel, rightSequential] = pipe(headNonEmpty(rightStack), reduce$2([empty$15(), empty$18()], ([parallel, sequential], cause) => {
			const [par, seq] = evaluateCause(cause);
			return some([pipe(parallel, union(par)), pipe(sequential, appendAll$1(seq))]);
		}));
		if (!equals$2(leftParallel, rightParallel)) return false;
		leftStack = leftSequential;
		rightStack = rightSequential;
	}
	return true;
};
/**
* Flattens a cause to a sequence of sets of causes, where each set represents
* causes that fail in parallel and sequential sets represent causes that fail
* after each other.
*
* @internal
*/
const flattenCause = (cause) => {
	return flattenCauseLoop(of$1(cause), empty$18());
};
/** @internal */
const flattenCauseLoop = (causes, flattened) => {
	while (1) {
		const [parallel, sequential] = pipe(causes, reduce$6([empty$15(), empty$18()], ([parallel, sequential], cause) => {
			const [par, seq] = evaluateCause(cause);
			return [pipe(parallel, union(par)), pipe(sequential, appendAll$1(seq))];
		}));
		const updated = size(parallel) > 0 ? pipe(flattened, prepend$1(parallel)) : flattened;
		if (isEmpty$3(sequential)) return reverse$1(updated);
		causes = sequential;
		flattened = updated;
	}
	throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"));
};
/** @internal */
const find = /* @__PURE__ */ dual(2, (self, pf) => {
	const stack = [self];
	while (stack.length > 0) {
		const item = stack.pop();
		const option = pf(item);
		switch (option._tag) {
			case "None":
				switch (item._tag) {
					case OP_SEQUENTIAL$1:
					case OP_PARALLEL$1:
						stack.push(item.right);
						stack.push(item.left);
						break;
				}
				break;
			case "Some": return option;
		}
	}
	return none$4();
});
/**
* Takes one step in evaluating a cause, returning a set of causes that fail
* in parallel and a list of causes that fail sequentially after those causes.
*
* @internal
*/
const evaluateCause = (self) => {
	let cause = self;
	const stack = [];
	let _parallel = empty$15();
	let _sequential = empty$18();
	while (cause !== void 0) switch (cause._tag) {
		case OP_EMPTY$2:
			if (stack.length === 0) return [_parallel, _sequential];
			cause = stack.pop();
			break;
		case OP_FAIL$1:
			_parallel = add$2(_parallel, make$21(cause._tag, cause.error));
			if (stack.length === 0) return [_parallel, _sequential];
			cause = stack.pop();
			break;
		case "Die":
			_parallel = add$2(_parallel, make$21(cause._tag, cause.defect));
			if (stack.length === 0) return [_parallel, _sequential];
			cause = stack.pop();
			break;
		case OP_INTERRUPT:
			_parallel = add$2(_parallel, make$21(cause._tag, cause.fiberId));
			if (stack.length === 0) return [_parallel, _sequential];
			cause = stack.pop();
			break;
		case OP_SEQUENTIAL$1:
			switch (cause.left._tag) {
				case OP_EMPTY$2:
					cause = cause.right;
					break;
				case OP_SEQUENTIAL$1:
					cause = sequential$2(cause.left.left, sequential$2(cause.left.right, cause.right));
					break;
				case OP_PARALLEL$1:
					cause = parallel$2(sequential$2(cause.left.left, cause.right), sequential$2(cause.left.right, cause.right));
					break;
				default:
					_sequential = prepend$1(_sequential, cause.right);
					cause = cause.left;
					break;
			}
			break;
		case OP_PARALLEL$1:
			stack.push(cause.right);
			cause = cause.left;
			break;
	}
	throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"));
};
/** @internal */
const IsInterruptedOnlyCauseReducer = {
	emptyCase: constTrue,
	failCase: constFalse,
	dieCase: constFalse,
	interruptCase: constTrue,
	sequentialCase: (_, left, right) => left && right,
	parallelCase: (_, left, right) => left && right
};
const OP_SEQUENTIAL_CASE = "SequentialCase";
const OP_PARALLEL_CASE = "ParallelCase";
/** @internal */
const match$2 = /* @__PURE__ */ dual(2, (self, { onDie, onEmpty, onFail, onInterrupt, onParallel, onSequential }) => {
	return reduceWithContext(self, void 0, {
		emptyCase: () => onEmpty,
		failCase: (_, error) => onFail(error),
		dieCase: (_, defect) => onDie(defect),
		interruptCase: (_, fiberId) => onInterrupt(fiberId),
		sequentialCase: (_, left, right) => onSequential(left, right),
		parallelCase: (_, left, right) => onParallel(left, right)
	});
});
/** @internal */
const reduce$2 = /* @__PURE__ */ dual(3, (self, zero, pf) => {
	let accumulator = zero;
	let cause = self;
	const causes = [];
	while (cause !== void 0) {
		const option = pf(accumulator, cause);
		accumulator = isSome(option) ? option.value : accumulator;
		switch (cause._tag) {
			case OP_SEQUENTIAL$1:
				causes.push(cause.right);
				cause = cause.left;
				break;
			case OP_PARALLEL$1:
				causes.push(cause.right);
				cause = cause.left;
				break;
			default:
				cause = void 0;
				break;
		}
		if (cause === void 0 && causes.length > 0) cause = causes.pop();
	}
	return accumulator;
});
/** @internal */
const reduceWithContext = /* @__PURE__ */ dual(3, (self, context, reducer) => {
	const input = [self];
	const output = [];
	while (input.length > 0) {
		const cause = input.pop();
		switch (cause._tag) {
			case OP_EMPTY$2:
				output.push(right(reducer.emptyCase(context)));
				break;
			case OP_FAIL$1:
				output.push(right(reducer.failCase(context, cause.error)));
				break;
			case "Die":
				output.push(right(reducer.dieCase(context, cause.defect)));
				break;
			case OP_INTERRUPT:
				output.push(right(reducer.interruptCase(context, cause.fiberId)));
				break;
			case OP_SEQUENTIAL$1:
				input.push(cause.right);
				input.push(cause.left);
				output.push(left({ _tag: OP_SEQUENTIAL_CASE }));
				break;
			case OP_PARALLEL$1:
				input.push(cause.right);
				input.push(cause.left);
				output.push(left({ _tag: OP_PARALLEL_CASE }));
				break;
		}
	}
	const accumulator = [];
	while (output.length > 0) {
		const either = output.pop();
		switch (either._tag) {
			case "Left":
				switch (either.left._tag) {
					case OP_SEQUENTIAL_CASE: {
						const left = accumulator.pop();
						const right = accumulator.pop();
						const value = reducer.sequentialCase(context, left, right);
						accumulator.push(value);
						break;
					}
					case OP_PARALLEL_CASE: {
						const left = accumulator.pop();
						const right = accumulator.pop();
						const value = reducer.parallelCase(context, left, right);
						accumulator.push(value);
						break;
					}
				}
				break;
			case "Right":
				accumulator.push(either.right);
				break;
		}
	}
	if (accumulator.length === 0) throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
	return accumulator.pop();
});
/** @internal */
const pretty$1 = (cause, options) => {
	if (isInterruptedOnly(cause)) return "All fibers interrupted without errors.";
	return prettyErrors(cause).map(function(e) {
		if (options?.renderErrorCause !== true || e.cause === void 0) return e.stack;
		return `${e.stack} {\n${renderErrorCause(e.cause, "  ")}\n}`;
	}).join("\n");
};
const renderErrorCause = (cause, prefix) => {
	const lines = cause.stack.split("\n");
	let stack = `${prefix}[cause]: ${lines[0]}`;
	for (let i = 1, len = lines.length; i < len; i++) stack += `\n${prefix}${lines[i]}`;
	if (cause.cause) stack += ` {\n${renderErrorCause(cause.cause, `${prefix}  `)}\n${prefix}}`;
	return stack;
};
/** @internal */
const makePrettyError = (originalError) => {
	const originalErrorIsObject = typeof originalError === "object" && originalError !== null;
	const prevLimit = Error.stackTraceLimit;
	Error.stackTraceLimit = 1;
	const error = new Error(prettyErrorMessage(originalError), originalErrorIsObject && "cause" in originalError && typeof originalError.cause !== "undefined" ? { cause: makePrettyError(originalError.cause) } : void 0);
	Error.stackTraceLimit = prevLimit;
	if (error.message === "") error.message = "An error has occurred";
	Error.stackTraceLimit = prevLimit;
	error.name = originalError instanceof Error ? originalError.name : "Error";
	if (originalErrorIsObject) {
		if (spanSymbol in originalError) error.span = originalError[spanSymbol];
		Object.keys(originalError).forEach((key) => {
			if (!(key in error)) error[key] = originalError[key];
		});
	}
	error.stack = prettyErrorStack(`${error.name}: ${error.message}`, originalError instanceof Error && originalError.stack ? originalError.stack : "", error.span);
	return error;
};
/**
* A utility function for generating human-readable error messages from a generic error of type `unknown`.
*
* Rules:
*
* 1) If the input `u` is already a string, it's considered a message.
* 2) If `u` is an Error instance with a message defined, it uses the message.
* 3) If `u` has a user-defined `toString()` method, it uses that method.
* 4) Otherwise, it uses `Inspectable.stringifyCircular` to produce a string representation and uses it as the error message,
*   with "Error" added as a prefix.
*
* @internal
*/
const prettyErrorMessage = (u) => {
	if (typeof u === "string") return u;
	if (typeof u === "object" && u !== null && u instanceof Error) return u.message;
	try {
		if (hasProperty(u, "toString") && isFunction(u["toString"]) && u["toString"] !== Object.prototype.toString && u["toString"] !== globalThis.Array.prototype.toString) return u["toString"]();
	} catch {}
	return stringifyCircular(u);
};
const locationRegex = /\((.*)\)/g;
/** @internal */
const spanToTrace = /* @__PURE__ */ globalValue("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap());
const prettyErrorStack = (message, stack, span) => {
	const out = [message];
	const lines = stack.startsWith(message) ? stack.slice(message.length).split("\n") : stack.split("\n");
	for (let i = 1; i < lines.length; i++) {
		if (lines[i].includes(" at new BaseEffectError") || lines[i].includes(" at new YieldableError")) {
			i++;
			continue;
		}
		if (lines[i].includes("Generator.next")) break;
		if (lines[i].includes("effect_internal_function")) break;
		out.push(lines[i].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
	}
	if (span) {
		let current = span;
		let i = 0;
		while (current && current._tag === "Span" && i < 10) {
			const stackFn = spanToTrace.get(current);
			if (typeof stackFn === "function") {
				const stack = stackFn();
				if (typeof stack === "string") {
					const locationMatchAll = stack.matchAll(locationRegex);
					let match = false;
					for (const [, location] of locationMatchAll) {
						match = true;
						out.push(`    at ${current.name} (${location})`);
					}
					if (!match) out.push(`    at ${current.name} (${stack.replace(/^at /, "")})`);
				} else out.push(`    at ${current.name}`);
			} else out.push(`    at ${current.name}`);
			current = getOrUndefined(current.parent);
			i++;
		}
	}
	return out.join("\n");
};
/** @internal */
const spanSymbol = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation");
/** @internal */
const prettyErrors = (cause) => reduceWithContext(cause, void 0, {
	emptyCase: () => [],
	dieCase: (_, unknownError) => {
		return [makePrettyError(unknownError)];
	},
	failCase: (_, error) => {
		return [makePrettyError(error)];
	},
	interruptCase: () => [],
	parallelCase: (_, l, r) => [...l, ...r],
	sequentialCase: (_, l, r) => [...l, ...r]
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/context.js
/** @internal */
const TagTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Tag");
/** @internal */
const ReferenceTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Reference");
/** @internal */
const STMTypeId = /* @__PURE__ */ Symbol.for("effect/STM");
/** @internal */
const TagProto = {
	...EffectPrototype$1,
	_op: "Tag",
	[STMTypeId]: effectVariance,
	[TagTypeId]: {
		_Service: (_) => _,
		_Identifier: (_) => _
	},
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "Tag",
			key: this.key,
			stack: this.stack
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	of(self) {
		return self;
	},
	context(self) {
		return make$17(this, self);
	}
};
const ReferenceProto = {
	...TagProto,
	[ReferenceTypeId]: ReferenceTypeId
};
/** @internal */
const makeGenericTag = (key) => {
	const limit = Error.stackTraceLimit;
	Error.stackTraceLimit = 2;
	const creationError = /* @__PURE__ */ new Error();
	Error.stackTraceLimit = limit;
	const tag = Object.create(TagProto);
	Object.defineProperty(tag, "stack", { get() {
		return creationError.stack;
	} });
	tag.key = key;
	return tag;
};
/** @internal */
const Tag$1 = (id) => () => {
	const limit = Error.stackTraceLimit;
	Error.stackTraceLimit = 2;
	const creationError = /* @__PURE__ */ new Error();
	Error.stackTraceLimit = limit;
	function TagClass() {}
	Object.setPrototypeOf(TagClass, TagProto);
	TagClass.key = id;
	Object.defineProperty(TagClass, "stack", { get() {
		return creationError.stack;
	} });
	return TagClass;
};
/** @internal */
const Reference$1 = () => (id, options) => {
	const limit = Error.stackTraceLimit;
	Error.stackTraceLimit = 2;
	const creationError = /* @__PURE__ */ new Error();
	Error.stackTraceLimit = limit;
	function ReferenceClass() {}
	Object.setPrototypeOf(ReferenceClass, ReferenceProto);
	ReferenceClass.key = id;
	ReferenceClass.defaultValue = options.defaultValue;
	Object.defineProperty(ReferenceClass, "stack", { get() {
		return creationError.stack;
	} });
	return ReferenceClass;
};
/** @internal */
const TypeId$8 = /* @__PURE__ */ Symbol.for("effect/Context");
/** @internal */
const ContextProto = {
	[TypeId$8]: { _Services: (_) => _ },
	[symbol](that) {
		if (isContext(that)) {
			if (this.unsafeMap.size === that.unsafeMap.size) {
				for (const k of this.unsafeMap.keys()) if (!that.unsafeMap.has(k) || !equals$2(this.unsafeMap.get(k), that.unsafeMap.get(k))) return false;
				return true;
			}
		}
		return false;
	},
	[symbol$1]() {
		return cached(this, number$1(this.unsafeMap.size));
	},
	pipe() {
		return pipeArguments(this, arguments);
	},
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "Context",
			services: Array.from(this.unsafeMap).map(toJSON)
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
/** @internal */
const makeContext = (unsafeMap) => {
	const context = Object.create(ContextProto);
	context.unsafeMap = unsafeMap;
	return context;
};
const serviceNotFoundError = (tag) => {
	const error = /* @__PURE__ */ new Error(`Service not found${tag.key ? `: ${String(tag.key)}` : ""}`);
	if (tag.stack) {
		const lines = tag.stack.split("\n");
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
/** @internal */
const isContext = (u) => hasProperty(u, TypeId$8);
/** @internal */
const isReference = (u) => hasProperty(u, ReferenceTypeId);
const _empty$3 = /* @__PURE__ */ makeContext(/* @__PURE__ */ new Map());
/** @internal */
const empty$13 = () => _empty$3;
/** @internal */
const make$17 = (tag, service) => makeContext(new Map([[tag.key, service]]));
/** @internal */
const add$1 = /* @__PURE__ */ dual(3, (self, tag, service) => {
	const map = new Map(self.unsafeMap);
	map.set(tag.key, service);
	return makeContext(map);
});
const defaultValueCache = /* @__PURE__ */ globalValue("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map());
const getDefaultValue = (tag) => {
	if (defaultValueCache.has(tag.key)) return defaultValueCache.get(tag.key);
	const value = tag.defaultValue();
	defaultValueCache.set(tag.key, value);
	return value;
};
/** @internal */
const unsafeGetReference = (self, tag) => {
	return self.unsafeMap.has(tag.key) ? self.unsafeMap.get(tag.key) : getDefaultValue(tag);
};
/** @internal */
const unsafeGet$1 = /* @__PURE__ */ dual(2, (self, tag) => {
	if (!self.unsafeMap.has(tag.key)) {
		if (ReferenceTypeId in tag) return getDefaultValue(tag);
		throw serviceNotFoundError(tag);
	}
	return self.unsafeMap.get(tag.key);
});
/** @internal */
const get$5 = unsafeGet$1;
/** @internal */
const getOption$1 = /* @__PURE__ */ dual(2, (self, tag) => {
	if (!self.unsafeMap.has(tag.key)) return isReference(tag) ? some$1(getDefaultValue(tag)) : none$5;
	return some$1(self.unsafeMap.get(tag.key));
});
/** @internal */
const merge$2 = /* @__PURE__ */ dual(2, (self, that) => {
	const map = new Map(self.unsafeMap);
	for (const [tag, s] of that.unsafeMap) map.set(tag, s);
	return makeContext(map);
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Context.js
/**
* Creates a new `Tag` instance with an optional key parameter.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context } from "effect"
*
* assert.strictEqual(Context.GenericTag("PORT").key === Context.GenericTag("PORT").key, true)
* ```
*
* @since 2.0.0
* @category constructors
*/
const GenericTag = makeGenericTag;
/**
* Returns an empty `Context`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context } from "effect"
*
* assert.strictEqual(Context.isContext(Context.empty()), true)
* ```
*
* @since 2.0.0
* @category constructors
*/
const empty$12 = empty$13;
/**
* Creates a new `Context` with a single service associated to the tag.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context } from "effect"
*
* const Port = Context.GenericTag<{ PORT: number }>("Port")
*
* const Services = Context.make(Port, { PORT: 8080 })
*
* assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
* ```
*
* @since 2.0.0
* @category constructors
*/
const make$16 = make$17;
/**
* Adds a service to a given `Context`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context, pipe } from "effect"
*
* const Port = Context.GenericTag<{ PORT: number }>("Port")
* const Timeout = Context.GenericTag<{ TIMEOUT: number }>("Timeout")
*
* const someContext = Context.make(Port, { PORT: 8080 })
*
* const Services = pipe(
*   someContext,
*   Context.add(Timeout, { TIMEOUT: 5000 })
* )
*
* assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
* assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 2.0.0
*/
const add = add$1;
/**
* Get a service from the context that corresponds to the given tag.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { pipe, Context } from "effect"
*
* const Port = Context.GenericTag<{ PORT: number }>("Port")
* const Timeout = Context.GenericTag<{ TIMEOUT: number }>("Timeout")
*
* const Services = pipe(
*   Context.make(Port, { PORT: 8080 }),
*   Context.add(Timeout, { TIMEOUT: 5000 })
* )
*
* assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 2.0.0
* @category getters
*/
const get$4 = get$5;
/**
* Get a service from the context that corresponds to the given tag.
* This function is unsafe because if the tag is not present in the context, a runtime error will be thrown.
*
* For a safer version see {@link getOption}.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context } from "effect"
*
* const Port = Context.GenericTag<{ PORT: number }>("Port")
* const Timeout = Context.GenericTag<{ TIMEOUT: number }>("Timeout")
*
* const Services = Context.make(Port, { PORT: 8080 })
*
* assert.deepStrictEqual(Context.unsafeGet(Services, Port), { PORT: 8080 })
* assert.throws(() => Context.unsafeGet(Services, Timeout))
* ```
*
* @since 2.0.0
* @category unsafe
*/
const unsafeGet = unsafeGet$1;
/**
* Get the value associated with the specified tag from the context wrapped in an `Option` object. If the tag is not
* found, the `Option` object will be `None`.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context, Option } from "effect"
*
* const Port = Context.GenericTag<{ PORT: number }>("Port")
* const Timeout = Context.GenericTag<{ TIMEOUT: number }>("Timeout")
*
* const Services = Context.make(Port, { PORT: 8080 })
*
* assert.deepStrictEqual(Context.getOption(Services, Port), Option.some({ PORT: 8080 }))
* assert.deepStrictEqual(Context.getOption(Services, Timeout), Option.none())
* ```
*
* @since 2.0.0
* @category getters
*/
const getOption = getOption$1;
/**
* Merges two `Context`s, returning a new `Context` containing the services of both.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context } from "effect"
*
* const Port = Context.GenericTag<{ PORT: number }>("Port")
* const Timeout = Context.GenericTag<{ TIMEOUT: number }>("Timeout")
*
* const firstContext = Context.make(Port, { PORT: 8080 })
* const secondContext = Context.make(Timeout, { TIMEOUT: 5000 })
*
* const Services = Context.merge(firstContext, secondContext)
*
* assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
* assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 2.0.0
*/
const merge$1 = merge$2;
/**
* @example
* ```ts
* import * as assert from "node:assert"
* import { Context, Layer } from "effect"
*
* class MyTag extends Context.Tag("MyTag")<
*  MyTag,
*  { readonly myNum: number }
* >() {
*  static Live = Layer.succeed(this, { myNum: 108 })
* }
* ```
*
* @since 2.0.0
* @category constructors
*/
const Tag = Tag$1;
/**
* Creates a context tag with a default value.
*
* **Details**
*
* `Context.Reference` allows you to create a tag that can hold a value. You can
* provide a default value for the service, which will automatically be used
* when the context is accessed, or override it with a custom implementation
* when needed.
*
* **Example** (Declaring a Tag with a default value)
*
* ```ts
* import * as assert from "node:assert"
* import { Context, Effect } from "effect"
*
* class SpecialNumber extends Context.Reference<SpecialNumber>()(
*   "SpecialNumber",
*   { defaultValue: () => 2048 }
* ) {}
*
* //      ┌─── Effect<void, never, never>
* //      ▼
* const program = Effect.gen(function* () {
*   const specialNumber = yield* SpecialNumber
*   console.log(`The special number is ${specialNumber}`)
* })
*
* // No need to provide the SpecialNumber implementation
* Effect.runPromise(program)
* // Output: The special number is 2048
* ```
*
* **Example** (Overriding the default value)
*
* ```ts
* import { Context, Effect } from "effect"
*
* class SpecialNumber extends Context.Reference<SpecialNumber>()(
*   "SpecialNumber",
*   { defaultValue: () => 2048 }
* ) {}
*
* const program = Effect.gen(function* () {
*   const specialNumber = yield* SpecialNumber
*   console.log(`The special number is ${specialNumber}`)
* })
*
* Effect.runPromise(program.pipe(Effect.provideService(SpecialNumber, -1)))
* // Output: The special number is -1
* ```
*
* @since 3.11.0
* @category constructors
* @experimental
*/
const Reference = Reference$1;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Duration.js
/**
* @since 2.0.0
*/
const TypeId$7 = /* @__PURE__ */ Symbol.for("effect/Duration");
const bigint0$1 = /* @__PURE__ */ BigInt(0);
const bigint24 = /* @__PURE__ */ BigInt(24);
const bigint60 = /* @__PURE__ */ BigInt(60);
const bigint1e3 = /* @__PURE__ */ BigInt(1e3);
const bigint1e6 = /* @__PURE__ */ BigInt(1e6);
const bigint1e9 = /* @__PURE__ */ BigInt(1e9);
const DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
/**
* @since 2.0.0
*/
const decode = (input) => {
	if (isDuration(input)) return input;
	else if (isNumber(input)) return millis(input);
	else if (isBigInt(input)) return nanos(input);
	else if (Array.isArray(input) && input.length === 2 && input.every(isNumber)) {
		if (input[0] === -Infinity || input[1] === -Infinity || Number.isNaN(input[0]) || Number.isNaN(input[1])) return zero;
		if (input[0] === Infinity || input[1] === Infinity) return infinity;
		return nanos(BigInt(Math.round(input[0] * 1e9)) + BigInt(Math.round(input[1])));
	} else if (isString(input)) {
		const match = DURATION_REGEX.exec(input);
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
	throw new Error("Invalid DurationInput");
};
const zeroValue = {
	_tag: "Millis",
	millis: 0
};
const infinityValue = { _tag: "Infinity" };
const DurationProto = {
	[TypeId$7]: TypeId$7,
	[symbol$1]() {
		return cached(this, structure(this.value));
	},
	[symbol](that) {
		return isDuration(that) && equals(this, that);
	},
	toString() {
		return `Duration(${format$2(this)})`;
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
				hrtime: toHrTime(this)
			};
			case "Infinity": return {
				_id: "Duration",
				_tag: "Infinity"
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
const make$15 = (input) => {
	const duration = Object.create(DurationProto);
	if (isNumber(input)) if (isNaN(input) || input <= 0) duration.value = zeroValue;
	else if (!Number.isFinite(input)) duration.value = infinityValue;
	else if (!Number.isInteger(input)) duration.value = {
		_tag: "Nanos",
		nanos: BigInt(Math.round(input * 1e6))
	};
	else duration.value = {
		_tag: "Millis",
		millis: input
	};
	else if (input <= bigint0$1) duration.value = zeroValue;
	else duration.value = {
		_tag: "Nanos",
		nanos: input
	};
	return duration;
};
/**
* @since 2.0.0
* @category guards
*/
const isDuration = (u) => hasProperty(u, TypeId$7);
/**
* @since 2.0.0
* @category guards
*/
const isFinite = (self) => self.value._tag !== "Infinity";
/**
* @since 3.5.0
* @category guards
*/
const isZero = (self) => {
	switch (self.value._tag) {
		case "Millis": return self.value.millis === 0;
		case "Nanos": return self.value.nanos === bigint0$1;
		case "Infinity": return false;
	}
};
/**
* @since 2.0.0
* @category constructors
*/
const zero = /* @__PURE__ */ make$15(0);
/**
* @since 2.0.0
* @category constructors
*/
const infinity = /* @__PURE__ */ make$15(Infinity);
/**
* @since 2.0.0
* @category constructors
*/
const nanos = (nanos) => make$15(nanos);
/**
* @since 2.0.0
* @category constructors
*/
const micros = (micros) => make$15(micros * bigint1e3);
/**
* @since 2.0.0
* @category constructors
*/
const millis = (millis) => make$15(millis);
/**
* @since 2.0.0
* @category constructors
*/
const seconds = (seconds) => make$15(seconds * 1e3);
/**
* @since 2.0.0
* @category constructors
*/
const minutes = (minutes) => make$15(minutes * 6e4);
/**
* @since 2.0.0
* @category constructors
*/
const hours = (hours) => make$15(hours * 36e5);
/**
* @since 2.0.0
* @category constructors
*/
const days = (days) => make$15(days * 864e5);
/**
* @since 2.0.0
* @category constructors
*/
const weeks = (weeks) => make$15(weeks * 6048e5);
/**
* @since 2.0.0
* @category getters
*/
const toMillis = (self) => match$1(self, {
	onMillis: (millis) => millis,
	onNanos: (nanos) => Number(nanos) / 1e6
});
/**
* Get the duration in nanoseconds as a bigint.
*
* If the duration is infinite, returns `Option.none()`
*
* @since 2.0.0
* @category getters
*/
const toNanos = (self) => {
	const _self = decode(self);
	switch (_self.value._tag) {
		case "Infinity": return none$4();
		case "Nanos": return some(_self.value.nanos);
		case "Millis": return some(BigInt(Math.round(_self.value.millis * 1e6)));
	}
};
/**
* Get the duration in nanoseconds as a bigint.
*
* If the duration is infinite, it throws an error.
*
* @since 2.0.0
* @category getters
*/
const unsafeToNanos = (self) => {
	const _self = decode(self);
	switch (_self.value._tag) {
		case "Infinity": throw new Error("Cannot convert infinite duration to nanos");
		case "Nanos": return _self.value.nanos;
		case "Millis": return BigInt(Math.round(_self.value.millis * 1e6));
	}
};
/**
* @since 2.0.0
* @category getters
*/
const toHrTime = (self) => {
	const _self = decode(self);
	switch (_self.value._tag) {
		case "Infinity": return [Infinity, 0];
		case "Nanos": return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
		case "Millis": return [Math.floor(_self.value.millis / 1e3), Math.round(_self.value.millis % 1e3 * 1e6)];
	}
};
/**
* @since 2.0.0
* @category pattern matching
*/
const match$1 = /* @__PURE__ */ dual(2, (self, options) => {
	const _self = decode(self);
	switch (_self.value._tag) {
		case "Nanos": return options.onNanos(_self.value.nanos);
		case "Infinity": return options.onMillis(Infinity);
		case "Millis": return options.onMillis(_self.value.millis);
	}
});
/**
* @since 2.0.0
* @category pattern matching
*/
const matchWith = /* @__PURE__ */ dual(3, (self, that, options) => {
	const _self = decode(self);
	const _that = decode(that);
	if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") return options.onMillis(toMillis(_self), toMillis(_that));
	else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
		const selfNanos = _self.value._tag === "Nanos" ? _self.value.nanos : BigInt(Math.round(_self.value.millis * 1e6));
		const thatNanos = _that.value._tag === "Nanos" ? _that.value.nanos : BigInt(Math.round(_that.value.millis * 1e6));
		return options.onNanos(selfNanos, thatNanos);
	}
	return options.onMillis(_self.value.millis, _that.value.millis);
});
/**
* @category instances
* @since 2.0.0
*/
const Equivalence$2 = (self, that) => matchWith(self, that, {
	onMillis: (self, that) => self === that,
	onNanos: (self, that) => self === that
});
/**
* @since 2.0.0
* @category predicates
*/
const lessThanOrEqualTo$1 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
	onMillis: (self, that) => self <= that,
	onNanos: (self, that) => self <= that
}));
/**
* @since 2.0.0
* @category predicates
*/
const greaterThanOrEqualTo$1 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
	onMillis: (self, that) => self >= that,
	onNanos: (self, that) => self >= that
}));
/**
* @since 2.0.0
* @category predicates
*/
const equals = /* @__PURE__ */ dual(2, (self, that) => Equivalence$2(decode(self), decode(that)));
/**
* Converts a `Duration` to its parts.
*
* @since 3.8.0
* @category conversions
*/
const parts = (self) => {
	const duration = decode(self);
	if (duration.value._tag === "Infinity") return {
		days: Infinity,
		hours: Infinity,
		minutes: Infinity,
		seconds: Infinity,
		millis: Infinity,
		nanos: Infinity
	};
	const nanos = unsafeToNanos(duration);
	const ms = nanos / bigint1e6;
	const sec = ms / bigint1e3;
	const min = sec / bigint60;
	const hr = min / bigint60;
	const days = hr / bigint24;
	return {
		days: Number(days),
		hours: Number(hr % bigint24),
		minutes: Number(min % bigint60),
		seconds: Number(sec % bigint60),
		millis: Number(ms % bigint1e3),
		nanos: Number(nanos % bigint1e6)
	};
};
/**
* Converts a `Duration` to a human readable string.
*
* @since 2.0.0
* @category conversions
* @example
* ```ts
* import { Duration } from "effect"
*
* Duration.format(Duration.millis(1000)) // "1s"
* Duration.format(Duration.millis(1001)) // "1s 1ms"
* ```
*/
const format$2 = (self) => {
	const duration = decode(self);
	if (duration.value._tag === "Infinity") return "Infinity";
	if (isZero(duration)) return "0";
	const fragments = parts(duration);
	const pieces = [];
	if (fragments.days !== 0) pieces.push(`${fragments.days}d`);
	if (fragments.hours !== 0) pieces.push(`${fragments.hours}h`);
	if (fragments.minutes !== 0) pieces.push(`${fragments.minutes}m`);
	if (fragments.seconds !== 0) pieces.push(`${fragments.seconds}s`);
	if (fragments.millis !== 0) pieces.push(`${fragments.millis}ms`);
	if (fragments.nanos !== 0) pieces.push(`${fragments.nanos}ns`);
	return pieces.join(" ");
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/MutableRef.js
const TypeId$6 = /* @__PURE__ */ Symbol.for("effect/MutableRef");
const MutableRefProto = {
	[TypeId$6]: TypeId$6,
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "MutableRef",
			current: toJSON(this.current)
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/**
* @since 2.0.0
* @category constructors
*/
const make$14 = (value) => {
	const ref = Object.create(MutableRefProto);
	ref.current = value;
	return ref;
};
/**
* @since 2.0.0
* @category general
*/
const get$3 = (self) => self.current;
/**
* @since 2.0.0
* @category general
*/
const set$2 = /* @__PURE__ */ dual(2, (self, value) => {
	self.current = value;
	return self;
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/fiberId.js
/** @internal */
const FiberIdSymbolKey = "effect/FiberId";
/** @internal */
const FiberIdTypeId = /* @__PURE__ */ Symbol.for(FiberIdSymbolKey);
/** @internal */
const OP_NONE = "None";
/** @internal */
const OP_RUNTIME = "Runtime";
/** @internal */
const OP_COMPOSITE = "Composite";
const emptyHash = /* @__PURE__ */ string(`${FiberIdSymbolKey}-${OP_NONE}`);
/** @internal */
var None$2 = class {
	[FiberIdTypeId] = FiberIdTypeId;
	_tag = OP_NONE;
	id = -1;
	startTimeMillis = -1;
	[symbol$1]() {
		return emptyHash;
	}
	[symbol](that) {
		return isFiberId$1(that) && that._tag === OP_NONE;
	}
	toString() {
		return format$4(this.toJSON());
	}
	toJSON() {
		return {
			_id: "FiberId",
			_tag: this._tag
		};
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
/** @internal */
var Runtime = class {
	id;
	startTimeMillis;
	[FiberIdTypeId] = FiberIdTypeId;
	_tag = OP_RUNTIME;
	constructor(id, startTimeMillis) {
		this.id = id;
		this.startTimeMillis = startTimeMillis;
	}
	[symbol$1]() {
		return cached(this, string(`${FiberIdSymbolKey}-${this._tag}-${this.id}-${this.startTimeMillis}`));
	}
	[symbol](that) {
		return isFiberId$1(that) && that._tag === OP_RUNTIME && this.id === that.id && this.startTimeMillis === that.startTimeMillis;
	}
	toString() {
		return format$4(this.toJSON());
	}
	toJSON() {
		return {
			_id: "FiberId",
			_tag: this._tag,
			id: this.id,
			startTimeMillis: this.startTimeMillis
		};
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
/** @internal */
var Composite$1 = class {
	left;
	right;
	[FiberIdTypeId] = FiberIdTypeId;
	_tag = OP_COMPOSITE;
	constructor(left, right) {
		this.left = left;
		this.right = right;
	}
	_hash;
	[symbol$1]() {
		return pipe(string(`${FiberIdSymbolKey}-${this._tag}`), combine$5(hash(this.left)), combine$5(hash(this.right)), cached(this));
	}
	[symbol](that) {
		return isFiberId$1(that) && that._tag === OP_COMPOSITE && equals$2(this.left, that.left) && equals$2(this.right, that.right);
	}
	toString() {
		return format$4(this.toJSON());
	}
	toJSON() {
		return {
			_id: "FiberId",
			_tag: this._tag,
			left: toJSON(this.left),
			right: toJSON(this.right)
		};
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
/** @internal */
const none$3 = /* @__PURE__ */ new None$2();
/** @internal */
const runtime$1 = (id, startTimeMillis) => {
	return new Runtime(id, startTimeMillis);
};
/** @internal */
const composite$1 = (left, right) => {
	return new Composite$1(left, right);
};
/** @internal */
const isFiberId$1 = (self) => hasProperty(self, FiberIdTypeId);
/** @internal */
const ids = (self) => {
	switch (self._tag) {
		case OP_NONE: return empty$15();
		case OP_RUNTIME: return make$18(self.id);
		case OP_COMPOSITE: return pipe(ids(self.left), union(ids(self.right)));
	}
};
const _fiberCounter = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => make$14(0));
/** @internal */
const threadName$1 = (self) => {
	return Array.from(ids(self)).map((n) => `#${n}`).join(",");
};
/** @internal */
const unsafeMake$6 = () => {
	const id = get$3(_fiberCounter);
	pipe(_fiberCounter, set$2(id + 1));
	return new Runtime(id, Date.now());
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/FiberId.js
/**
* @since 2.0.0
* @category constructors
*/
const none$2 = none$3;
/**
* @since 2.0.0
* @category constructors
*/
const runtime = runtime$1;
/**
* @since 2.0.0
* @category constructors
*/
const composite = composite$1;
/**
* Returns `true` if the specified unknown value is a `FiberId`, `false`
* otherwise.
*
* @since 2.0.0
* @category refinements
*/
const isFiberId = isFiberId$1;
/**
* Creates a string representing the name of the current thread of execution
* represented by the specified `FiberId`.
*
* @since 2.0.0
* @category destructors
*/
const threadName = threadName$1;
/**
* Unsafely creates a new `FiberId`.
*
* @since 2.0.0
* @category unsafe
*/
const unsafeMake$5 = unsafeMake$6;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/HashMap.js
/**
* @since 2.0.0
*/
/**
* Creates a new `HashMap`.
*
* @since 2.0.0
* @category constructors
*/
const empty$11 = empty$17;
/**
* Creates a new `HashMap` from an iterable collection of key/value pairs.
*
* @since 2.0.0
* @category constructors
*/
const fromIterable$1 = fromIterable$4;
/**
* Checks if the `HashMap` contains any entries.
*
* @since 2.0.0
* @category elements
*/
const isEmpty = isEmpty$2;
/**
* Safely lookup the value for the specified key in the `HashMap` using the
* internal hashing function.
*
* @since 2.0.0
* @category elements
*/
const get$2 = get$6;
/**
* Sets the specified key to the specified value using the internal hashing
* function.
*
* @since 2.0.0
*/
const set$1 = set$3;
/**
* Returns an `IterableIterator` of the keys within the `HashMap`.
*
* @since 2.0.0
* @category getters
*/
const keys = keys$1;
/**
* Set or remove the specified key in the `HashMap` using the specified
* update function. The value of the specified key will be computed using the
* provided hash.
*
* The update function will be invoked with the current value of the key if it
* exists, or `None` if no such value exists.
*
* @since 2.0.0
*/
const modifyAt = modifyAt$1;
/**
* Maps over the entries of the `HashMap` using the specified function.
*
* @since 2.0.0
* @category mapping
*/
const map$3 = map$4;
/**
* Reduces the specified state over the entries of the `HashMap`.
*
* @since 2.0.0
* @category folding
*/
const reduce$1 = reduce$5;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/List.js
/**
* A data type for immutable linked lists representing ordered collections of elements of type `A`.
*
* This data type is optimal for last-in-first-out (LIFO), stack-like access patterns. If you need another access pattern, for example, random access or FIFO, consider using a collection more suited to this than `List`.
*
* **Performance**
*
* - Time: `List` has `O(1)` prepend and head/tail access. Most other operations are `O(n)` on the number of elements in the list. This includes the index-based lookup of elements, `length`, `append` and `reverse`.
* - Space: `List` implements structural sharing of the tail list. This means that many operations are either zero- or constant-memory cost.
*
* @since 2.0.0
*/
/**
* This file is ported from
*
* Scala (https://www.scala-lang.org)
*
* Copyright EPFL and Lightbend, Inc.
*
* Licensed under Apache License 2.0
* (http://www.apache.org/licenses/LICENSE-2.0).
*/
/**
* @since 2.0.0
* @category symbol
*/
const TypeId$5 = /* @__PURE__ */ Symbol.for("effect/List");
/**
* Converts the specified `List` to an `Array`.
*
* @category conversions
* @since 2.0.0
*/
const toArray = (self) => fromIterable$6(self);
/**
* @category equivalence
* @since 2.0.0
*/
const getEquivalence = (isEquivalent) => mapInput$1(getEquivalence$2(isEquivalent), toArray);
const _equivalence = /* @__PURE__ */ getEquivalence(equals$2);
const ConsProto = {
	[TypeId$5]: TypeId$5,
	_tag: "Cons",
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "List",
			_tag: "Cons",
			values: toArray(this).map(toJSON)
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	[symbol](that) {
		return isList(that) && this._tag === that._tag && _equivalence(this, that);
	},
	[symbol$1]() {
		return cached(this, array(toArray(this)));
	},
	[Symbol.iterator]() {
		let done = false;
		let self = this;
		return {
			next() {
				if (done) return this.return();
				if (self._tag === "Nil") {
					done = true;
					return this.return();
				}
				const value = self.head;
				self = self.tail;
				return {
					done,
					value
				};
			},
			return(value) {
				if (!done) done = true;
				return {
					done: true,
					value
				};
			}
		};
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const makeCons = (head, tail) => {
	const cons = Object.create(ConsProto);
	cons.head = head;
	cons.tail = tail;
	return cons;
};
const NilHash = /* @__PURE__ */ string("Nil");
const _Nil = /* @__PURE__ */ Object.create({
	[TypeId$5]: TypeId$5,
	_tag: "Nil",
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "List",
			_tag: "Nil"
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	[symbol$1]() {
		return NilHash;
	},
	[symbol](that) {
		return isList(that) && this._tag === that._tag;
	},
	[Symbol.iterator]() {
		return { next() {
			return {
				done: true,
				value: void 0
			};
		} };
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
});
/**
* Returns `true` if the specified value is a `List`, `false` otherwise.
*
* @since 2.0.0
* @category refinements
*/
const isList = (u) => hasProperty(u, TypeId$5);
/**
* Returns `true` if the specified value is a `List.Nil<A>`, `false` otherwise.
*
* @since 2.0.0
* @category refinements
*/
const isNil = (self) => self._tag === "Nil";
/**
* Returns `true` if the specified value is a `List.Cons<A>`, `false` otherwise.
*
* @since 2.0.0
* @category refinements
*/
const isCons = (self) => self._tag === "Cons";
/**
* Constructs a new empty `List<A>`.
*
* @since 2.0.0
* @category constructors
*/
const nil = () => _Nil;
/**
* Constructs a new `List.Cons<A>` from the specified `head` and `tail` values.
*
* @since 2.0.0
* @category constructors
*/
const cons = (head, tail) => makeCons(head, tail);
/**
* Constructs a new empty `List<A>`.
*
* Alias of {@link nil}.
*
* @since 2.0.0
* @category constructors
*/
const empty$10 = nil;
/**
* Constructs a new `List<A>` from the specified value.
*
* @since 2.0.0
* @category constructors
*/
const of = (value) => makeCons(value, _Nil);
/**
* Concatenates two lists, combining their elements.
* If either list is non-empty, the result is also a non-empty list.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { List } from "effect"
*
* assert.deepStrictEqual(
*   List.make(1, 2).pipe(List.appendAll(List.make("a", "b")), List.toArray),
*   [1, 2, "a", "b"]
* )
* ```
*
* @category concatenating
* @since 2.0.0
*/
const appendAll = /* @__PURE__ */ dual(2, (self, that) => prependAll(that, self));
/**
* Prepends the specified element to the beginning of the list.
*
* @category concatenating
* @since 2.0.0
*/
const prepend = /* @__PURE__ */ dual(2, (self, element) => cons(element, self));
/**
* Prepends the specified prefix list to the beginning of the specified list.
* If either list is non-empty, the result is also a non-empty list.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { List } from "effect"
*
* assert.deepStrictEqual(
*   List.make(1, 2).pipe(List.prependAll(List.make("a", "b")), List.toArray),
*   ["a", "b", 1, 2]
* )
* ```
*
* @category concatenating
* @since 2.0.0
*/
const prependAll = /* @__PURE__ */ dual(2, (self, prefix) => {
	if (isNil(self)) return prefix;
	else if (isNil(prefix)) return self;
	else {
		const result = makeCons(prefix.head, self);
		let curr = result;
		let that = prefix.tail;
		while (!isNil(that)) {
			const temp = makeCons(that.head, self);
			curr.tail = temp;
			curr = temp;
			that = that.tail;
		}
		return result;
	}
});
/**
* Folds over the elements of the list using the specified function, using the
* specified initial value.
*
* @since 2.0.0
* @category folding
*/
const reduce = /* @__PURE__ */ dual(3, (self, zero, f) => {
	let acc = zero;
	let these = self;
	while (!isNil(these)) {
		acc = f(acc, these.head);
		these = these.tail;
	}
	return acc;
});
/**
* Returns a new list with the elements of the specified list in reverse order.
*
* @since 2.0.0
* @category elements
*/
const reverse = (self) => {
	let result = empty$10();
	let these = self;
	while (!isNil(these)) {
		result = prepend(result, these.head);
		these = these.tail;
	}
	return result;
};
Array.prototype;
/** @internal */
const Structural = /* @__PURE__ */ function() {
	function Structural(args) {
		if (args) Object.assign(this, args);
	}
	Structural.prototype = StructuralPrototype;
	return Structural;
}();
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/differ/contextPatch.js
/** @internal */
const ContextPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function variance$3(a) {
	return a;
}
/** @internal */
const PatchProto$2 = {
	...Structural.prototype,
	[ContextPatchTypeId]: {
		_Value: variance$3,
		_Patch: variance$3
	}
};
const _empty$2 = /* @__PURE__ */ Object.create(/* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), { _tag: "Empty" }));
/**
* @internal
*/
const empty$9 = () => _empty$2;
const AndThenProto$2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), { _tag: "AndThen" });
const makeAndThen$2 = (first, second) => {
	const o = Object.create(AndThenProto$2);
	o.first = first;
	o.second = second;
	return o;
};
const AddServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), { _tag: "AddService" });
const makeAddService = (key, service) => {
	const o = Object.create(AddServiceProto);
	o.key = key;
	o.service = service;
	return o;
};
const RemoveServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), { _tag: "RemoveService" });
const makeRemoveService = (key) => {
	const o = Object.create(RemoveServiceProto);
	o.key = key;
	return o;
};
const UpdateServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), { _tag: "UpdateService" });
const makeUpdateService = (key, update) => {
	const o = Object.create(UpdateServiceProto);
	o.key = key;
	o.update = update;
	return o;
};
/** @internal */
const diff$6 = (oldValue, newValue) => {
	const missingServices = new Map(oldValue.unsafeMap);
	let patch = empty$9();
	for (const [tag, newService] of newValue.unsafeMap.entries()) if (missingServices.has(tag)) {
		const old = missingServices.get(tag);
		missingServices.delete(tag);
		if (!equals$2(old, newService)) patch = combine$4(makeUpdateService(tag, () => newService))(patch);
	} else {
		missingServices.delete(tag);
		patch = combine$4(makeAddService(tag, newService))(patch);
	}
	for (const [tag] of missingServices.entries()) patch = combine$4(makeRemoveService(tag))(patch);
	return patch;
};
/** @internal */
const combine$4 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen$2(self, that));
/** @internal */
const patch$7 = /* @__PURE__ */ dual(2, (self, context) => {
	if (self._tag === "Empty") return context;
	let wasServiceUpdated = false;
	let patches = of$1(self);
	const updatedContext = new Map(context.unsafeMap);
	while (isNonEmpty$2(patches)) {
		const head = headNonEmpty(patches);
		const tail = tailNonEmpty(patches);
		switch (head._tag) {
			case "Empty":
				patches = tail;
				break;
			case "AddService":
				updatedContext.set(head.key, head.service);
				patches = tail;
				break;
			case "AndThen":
				patches = prepend$1(prepend$1(tail, head.second), head.first);
				break;
			case "RemoveService":
				updatedContext.delete(head.key);
				patches = tail;
				break;
			case "UpdateService":
				updatedContext.set(head.key, head.update(updatedContext.get(head.key)));
				wasServiceUpdated = true;
				patches = tail;
				break;
		}
	}
	if (!wasServiceUpdated) return makeContext(updatedContext);
	const map = /* @__PURE__ */ new Map();
	for (const [tag] of context.unsafeMap) if (updatedContext.has(tag)) {
		map.set(tag, updatedContext.get(tag));
		updatedContext.delete(tag);
	}
	for (const [tag, s] of updatedContext) map.set(tag, s);
	return makeContext(map);
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/differ/hashSetPatch.js
/** @internal */
const HashSetPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function variance$2(a) {
	return a;
}
/** @internal */
const PatchProto$1 = {
	...Structural.prototype,
	[HashSetPatchTypeId]: {
		_Value: variance$2,
		_Key: variance$2,
		_Patch: variance$2
	}
};
const _empty$1 = /* @__PURE__ */ Object.create(/* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$1), { _tag: "Empty" }));
/** @internal */
const empty$8 = () => _empty$1;
const AndThenProto$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$1), { _tag: "AndThen" });
/** @internal */
const makeAndThen$1 = (first, second) => {
	const o = Object.create(AndThenProto$1);
	o.first = first;
	o.second = second;
	return o;
};
const AddProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$1), { _tag: "Add" });
/** @internal */
const makeAdd = (value) => {
	const o = Object.create(AddProto);
	o.value = value;
	return o;
};
const RemoveProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$1), { _tag: "Remove" });
/** @internal */
const makeRemove = (value) => {
	const o = Object.create(RemoveProto);
	o.value = value;
	return o;
};
/** @internal */
const diff$5 = (oldValue, newValue) => {
	const [removed, patch] = reduce$3([oldValue, empty$8()], ([set, patch], value) => {
		if (has$1(value)(set)) return [remove(value)(set), patch];
		return [set, combine$3(makeAdd(value))(patch)];
	})(newValue);
	return reduce$3(patch, (patch, value) => combine$3(makeRemove(value))(patch))(removed);
};
/** @internal */
const combine$3 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen$1(self, that));
/** @internal */
const patch$6 = /* @__PURE__ */ dual(2, (self, oldValue) => {
	if (self._tag === "Empty") return oldValue;
	let set = oldValue;
	let patches = of$1(self);
	while (isNonEmpty$2(patches)) {
		const head = headNonEmpty(patches);
		const tail = tailNonEmpty(patches);
		switch (head._tag) {
			case "Empty":
				patches = tail;
				break;
			case "AndThen":
				patches = prepend$1(head.first)(prepend$1(head.second)(tail));
				break;
			case "Add":
				set = add$2(head.value)(set);
				patches = tail;
				break;
			case "Remove":
				set = remove(head.value)(set);
				patches = tail;
		}
	}
	return set;
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/differ/readonlyArrayPatch.js
/** @internal */
const ReadonlyArrayPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function variance$1(a) {
	return a;
}
const PatchProto = {
	...Structural.prototype,
	[ReadonlyArrayPatchTypeId]: {
		_Value: variance$1,
		_Patch: variance$1
	}
};
const _empty = /* @__PURE__ */ Object.create(/* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), { _tag: "Empty" }));
/**
* @internal
*/
const empty$7 = () => _empty;
const AndThenProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), { _tag: "AndThen" });
const makeAndThen = (first, second) => {
	const o = Object.create(AndThenProto);
	o.first = first;
	o.second = second;
	return o;
};
const AppendProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), { _tag: "Append" });
const makeAppend = (values) => {
	const o = Object.create(AppendProto);
	o.values = values;
	return o;
};
const SliceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), { _tag: "Slice" });
const makeSlice = (from, until) => {
	const o = Object.create(SliceProto);
	o.from = from;
	o.until = until;
	return o;
};
const UpdateProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), { _tag: "Update" });
const makeUpdate = (index, patch) => {
	const o = Object.create(UpdateProto);
	o.index = index;
	o.patch = patch;
	return o;
};
/** @internal */
const diff$4 = (options) => {
	let i = 0;
	let patch = empty$7();
	while (i < options.oldValue.length && i < options.newValue.length) {
		const oldElement = options.oldValue[i];
		const newElement = options.newValue[i];
		const valuePatch = options.differ.diff(oldElement, newElement);
		if (!equals$2(valuePatch, options.differ.empty)) patch = combine$2(patch, makeUpdate(i, valuePatch));
		i = i + 1;
	}
	if (i < options.oldValue.length) patch = combine$2(patch, makeSlice(0, i));
	if (i < options.newValue.length) patch = combine$2(patch, makeAppend(drop$1(i)(options.newValue)));
	return patch;
};
/** @internal */
const combine$2 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen(self, that));
/** @internal */
const patch$5 = /* @__PURE__ */ dual(3, (self, oldValue, differ) => {
	if (self._tag === "Empty") return oldValue;
	let readonlyArray = oldValue.slice();
	let patches = of$2(self);
	while (isNonEmptyArray(patches)) {
		const head = headNonEmpty$1(patches);
		const tail = tailNonEmpty$1(patches);
		switch (head._tag) {
			case "Empty":
				patches = tail;
				break;
			case "AndThen":
				tail.unshift(head.first, head.second);
				patches = tail;
				break;
			case "Append":
				for (const value of head.values) readonlyArray.push(value);
				patches = tail;
				break;
			case "Slice":
				readonlyArray = readonlyArray.slice(head.from, head.until);
				patches = tail;
				break;
			case "Update":
				readonlyArray[head.index] = differ.patch(head.patch, readonlyArray[head.index]);
				patches = tail;
				break;
		}
	}
	return readonlyArray;
});
/** @internal */
const DifferProto = {
	[/* @__PURE__ */ Symbol.for("effect/Differ")]: {
		_P: identity,
		_V: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const make$13 = (params) => {
	const differ = Object.create(DifferProto);
	differ.empty = params.empty;
	differ.diff = params.diff;
	differ.combine = params.combine;
	differ.patch = params.patch;
	return differ;
};
/** @internal */
const environment = () => make$13({
	empty: empty$9(),
	combine: (first, second) => combine$4(second)(first),
	diff: (oldValue, newValue) => diff$6(oldValue, newValue),
	patch: (patch, oldValue) => patch$7(oldValue)(patch)
});
/** @internal */
const hashSet = () => make$13({
	empty: empty$8(),
	combine: (first, second) => combine$3(second)(first),
	diff: (oldValue, newValue) => diff$5(oldValue, newValue),
	patch: (patch, oldValue) => patch$6(oldValue)(patch)
});
/** @internal */
const readonlyArray = (differ) => make$13({
	empty: empty$7(),
	combine: (first, second) => combine$2(first, second),
	diff: (oldValue, newValue) => diff$4({
		oldValue,
		newValue,
		differ
	}),
	patch: (patch, oldValue) => patch$5(patch, oldValue, differ)
});
/** @internal */
const update$1 = () => updateWith((_, a) => a);
/** @internal */
const updateWith = (f) => make$13({
	empty: identity,
	combine: (first, second) => {
		if (first === identity) return second;
		if (second === identity) return first;
		return (a) => second(first(a));
	},
	diff: (oldValue, newValue) => {
		if (equals$2(oldValue, newValue)) return identity;
		return constant(newValue);
	},
	patch: (patch, oldValue) => f(oldValue, patch(oldValue))
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/runtimeFlagsPatch.js
/** @internal */
const BIT_MASK = 255;
/** @internal */
const BIT_SHIFT = 8;
/** @internal */
const active = (patch) => patch & BIT_MASK;
/** @internal */
const enabled = (patch) => patch >> BIT_SHIFT & BIT_MASK;
/** @internal */
const make$12 = (active, enabled) => (active & BIT_MASK) + ((enabled & active & BIT_MASK) << BIT_SHIFT);
/** @internal */
const empty$6 = /* @__PURE__ */ make$12(0, 0);
/** @internal */
const enable$2 = (flag) => make$12(flag, flag);
/** @internal */
const disable$1 = (flag) => make$12(flag, 0);
/** @internal */
const exclude$1 = /* @__PURE__ */ dual(2, (self, flag) => make$12(active(self) & ~flag, enabled(self)));
/** @internal */
const andThen = /* @__PURE__ */ dual(2, (self, that) => self | that);
/** @internal */
const invert = (n) => ~n >>> 0 & BIT_MASK;
/** @internal */
const cooperativeYielding = (self) => isEnabled(self, 32);
/** @internal */
const enable$1 = /* @__PURE__ */ dual(2, (self, flag) => self | flag);
/** @internal */
const interruptible$2 = (self) => interruption(self) && !windDown(self);
/** @internal */
const interruption = (self) => isEnabled(self, 1);
/** @internal */
const isEnabled = /* @__PURE__ */ dual(2, (self, flag) => (self & flag) !== 0);
/** @internal */
const make$11 = (...flags) => flags.reduce((a, b) => a | b, 0);
/** @internal */
const none$1 = /* @__PURE__ */ make$11(0);
/** @internal */
const runtimeMetrics = (self) => isEnabled(self, 4);
const windDown = (self) => isEnabled(self, 16);
/** @internal */
const diff$3 = /* @__PURE__ */ dual(2, (self, that) => make$12(self ^ that, that));
/** @internal */
const patch$4 = /* @__PURE__ */ dual(2, (self, patch) => self & (invert(active(patch)) | enabled(patch)) | active(patch) & enabled(patch));
/** @internal */
const differ$1 = /* @__PURE__ */ make$13({
	empty: empty$6,
	diff: (oldValue, newValue) => diff$3(oldValue, newValue),
	combine: (first, second) => andThen(second)(first),
	patch: (_patch, oldValue) => patch$4(oldValue, _patch)
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/RuntimeFlagsPatch.js
/**
* Creates a `RuntimeFlagsPatch` describing enabling the provided `RuntimeFlag`.
*
* @since 2.0.0
* @category constructors
*/
const enable = enable$2;
/**
* Creates a `RuntimeFlagsPatch` describing disabling the provided `RuntimeFlag`.
*
* @since 2.0.0
* @category constructors
*/
const disable = disable$1;
/**
* Creates a `RuntimeFlagsPatch` which describes exclusion of the specified
* `RuntimeFlag` from the set of `RuntimeFlags`.
*
* @category utils
* @since 2.0.0
*/
const exclude = exclude$1;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/blockedRequests.js
/**
* Combines this collection of blocked requests with the specified collection
* of blocked requests, in parallel.
*
* @internal
*/
const par = (self, that) => ({
	_tag: "Par",
	left: self,
	right: that
});
/**
* Combines this collection of blocked requests with the specified collection
* of blocked requests, in sequence.
*
* @internal
*/
const seq = (self, that) => ({
	_tag: "Seq",
	left: self,
	right: that
});
/**
* Flattens a collection of blocked requests into a collection of pipelined
* and batched requests that can be submitted for execution.
*
* @internal
*/
const flatten$2 = (self) => {
	let current = of(self);
	let updated = empty$10();
	while (1) {
		const [parallel, sequential] = reduce(current, [parallelCollectionEmpty(), empty$10()], ([parallel, sequential], blockedRequest) => {
			const [par, seq] = step$1(blockedRequest);
			return [parallelCollectionCombine(parallel, par), appendAll(sequential, seq)];
		});
		updated = merge(updated, parallel);
		if (isNil(sequential)) return reverse(updated);
		current = sequential;
	}
	throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
};
/**
* Takes one step in evaluating a collection of blocked requests, returning a
* collection of blocked requests that can be performed in parallel and a list
* of blocked requests that must be performed sequentially after those
* requests.
*/
const step$1 = (requests) => {
	let current = requests;
	let parallel = parallelCollectionEmpty();
	let stack = empty$10();
	let sequential = empty$10();
	while (1) switch (current._tag) {
		case "Empty":
			if (isNil(stack)) return [parallel, sequential];
			current = stack.head;
			stack = stack.tail;
			break;
		case "Par":
			stack = cons(current.right, stack);
			current = current.left;
			break;
		case "Seq": {
			const left = current.left;
			const right = current.right;
			switch (left._tag) {
				case "Empty":
					current = right;
					break;
				case "Par": {
					const l = left.left;
					const r = left.right;
					current = par(seq(l, right), seq(r, right));
					break;
				}
				case "Seq": {
					const l = left.left;
					const r = left.right;
					current = seq(l, seq(r, right));
					break;
				}
				case "Single":
					current = left;
					sequential = cons(right, sequential);
					break;
			}
			break;
		}
		case "Single":
			parallel = parallelCollectionAdd(parallel, current);
			if (isNil(stack)) return [parallel, sequential];
			current = stack.head;
			stack = stack.tail;
			break;
	}
	throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
};
/**
* Merges a collection of requests that must be executed sequentially with a
* collection of requests that can be executed in parallel. If the collections
* are both from the same single data source then the requests can be
* pipelined while preserving ordering guarantees.
*/
const merge = (sequential, parallel) => {
	if (isNil(sequential)) return of(parallelCollectionToSequentialCollection(parallel));
	if (parallelCollectionIsEmpty(parallel)) return sequential;
	const seqHeadKeys = sequentialCollectionKeys(sequential.head);
	const parKeys = parallelCollectionKeys(parallel);
	if (seqHeadKeys.length === 1 && parKeys.length === 1 && equals$2(seqHeadKeys[0], parKeys[0])) return cons(sequentialCollectionCombine(sequential.head, parallelCollectionToSequentialCollection(parallel)), sequential.tail);
	return cons(parallelCollectionToSequentialCollection(parallel), sequential);
};
/** @internal */
const RequestBlockParallelTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel");
const parallelVariance = { _R: (_) => _ };
var ParallelImpl = class {
	map;
	[RequestBlockParallelTypeId] = parallelVariance;
	constructor(map) {
		this.map = map;
	}
};
/** @internal */
const parallelCollectionEmpty = () => new ParallelImpl(empty$11());
/** @internal */
const parallelCollectionAdd = (self, blockedRequest) => new ParallelImpl(modifyAt(self.map, blockedRequest.dataSource, (_) => orElseSome(map$6(_, append(blockedRequest.blockedRequest)), () => of$1(blockedRequest.blockedRequest))));
/** @internal */
const parallelCollectionCombine = (self, that) => new ParallelImpl(reduce$1(self.map, that.map, (map, value, key) => set$1(map, key, match$3(get$2(map, key), {
	onNone: () => value,
	onSome: (other) => appendAll$1(value, other)
}))));
/** @internal */
const parallelCollectionIsEmpty = (self) => isEmpty(self.map);
/** @internal */
const parallelCollectionKeys = (self) => Array.from(keys(self.map));
/** @internal */
const parallelCollectionToSequentialCollection = (self) => sequentialCollectionMake(map$3(self.map, (x) => of$1(x)));
/** @internal */
const SequentialCollectionTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential");
const sequentialVariance = { _R: (_) => _ };
var SequentialImpl = class {
	map;
	[SequentialCollectionTypeId] = sequentialVariance;
	constructor(map) {
		this.map = map;
	}
};
/** @internal */
const sequentialCollectionMake = (map) => new SequentialImpl(map);
/** @internal */
const sequentialCollectionCombine = (self, that) => new SequentialImpl(reduce$1(that.map, self.map, (map, value, key) => set$1(map, key, match$3(get$2(map, key), {
	onNone: () => empty$18(),
	onSome: (a) => appendAll$1(a, value)
}))));
/** @internal */
const sequentialCollectionKeys = (self) => Array.from(keys(self.map));
/** @internal */
const sequentialCollectionToChunk = (self) => Array.from(self.map);
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/opCodes/deferred.js
/** @internal */
const OP_STATE_PENDING = "Pending";
/** @internal */
const OP_STATE_DONE = "Done";
/** @internal */
const DeferredTypeId = /* @__PURE__ */ Symbol.for("effect/Deferred");
/** @internal */
const deferredVariance = {
	_E: (_) => _,
	_A: (_) => _
};
/** @internal */
const pending = (joiners) => {
	return {
		_tag: OP_STATE_PENDING,
		joiners
	};
};
/** @internal */
const done$2 = (effect) => {
	return {
		_tag: OP_STATE_DONE,
		effect
	};
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/singleShotGen.js
/** @internal */
var SingleShotGen = class SingleShotGen {
	self;
	called = false;
	constructor(self) {
		this.self = self;
	}
	next(a) {
		return this.called ? {
			value: a,
			done: true
		} : (this.called = true, {
			value: this.self,
			done: false
		});
	}
	return(a) {
		return {
			value: a,
			done: true
		};
	}
	throw(e) {
		throw e;
	}
	[Symbol.iterator]() {
		return new SingleShotGen(this.self);
	}
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/core.js
/**
* @internal
*/
const blocked = (blockedRequests, _continue) => {
	const effect = new EffectPrimitive("Blocked");
	effect.effect_instruction_i0 = blockedRequests;
	effect.effect_instruction_i1 = _continue;
	return effect;
};
/**
* @internal
*/
const runRequestBlock = (blockedRequests) => {
	const effect = new EffectPrimitive("RunBlocked");
	effect.effect_instruction_i0 = blockedRequests;
	return effect;
};
/** @internal */
const EffectTypeId = /* @__PURE__ */ Symbol.for("effect/Effect");
/** @internal */
var RevertFlags = class {
	patch;
	op;
	_op = OP_REVERT_FLAGS;
	constructor(patch, op) {
		this.patch = patch;
		this.op = op;
	}
};
var EffectPrimitive = class {
	_op;
	effect_instruction_i0 = void 0;
	effect_instruction_i1 = void 0;
	effect_instruction_i2 = void 0;
	trace = void 0;
	[EffectTypeId] = effectVariance;
	constructor(_op) {
		this._op = _op;
	}
	[symbol](that) {
		return this === that;
	}
	[symbol$1]() {
		return cached(this, random(this));
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toJSON() {
		return {
			_id: "Effect",
			_op: this._op,
			effect_instruction_i0: toJSON(this.effect_instruction_i0),
			effect_instruction_i1: toJSON(this.effect_instruction_i1),
			effect_instruction_i2: toJSON(this.effect_instruction_i2)
		};
	}
	toString() {
		return format$4(this.toJSON());
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	[Symbol.iterator]() {
		return new SingleShotGen(new YieldWrap(this));
	}
};
/** @internal */
var EffectPrimitiveFailure = class {
	_op;
	effect_instruction_i0 = void 0;
	effect_instruction_i1 = void 0;
	effect_instruction_i2 = void 0;
	trace = void 0;
	[EffectTypeId] = effectVariance;
	constructor(_op) {
		this._op = _op;
		this._tag = _op;
	}
	[symbol](that) {
		return exitIsExit(that) && that._op === "Failure" && equals$2(this.effect_instruction_i0, that.effect_instruction_i0);
	}
	[symbol$1]() {
		return pipe(string(this._tag), combine$5(hash(this.effect_instruction_i0)), cached(this));
	}
	get cause() {
		return this.effect_instruction_i0;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toJSON() {
		return {
			_id: "Exit",
			_tag: this._op,
			cause: this.cause.toJSON()
		};
	}
	toString() {
		return format$4(this.toJSON());
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	[Symbol.iterator]() {
		return new SingleShotGen(new YieldWrap(this));
	}
};
/** @internal */
var EffectPrimitiveSuccess = class {
	_op;
	effect_instruction_i0 = void 0;
	effect_instruction_i1 = void 0;
	effect_instruction_i2 = void 0;
	trace = void 0;
	[EffectTypeId] = effectVariance;
	constructor(_op) {
		this._op = _op;
		this._tag = _op;
	}
	[symbol](that) {
		return exitIsExit(that) && that._op === "Success" && equals$2(this.effect_instruction_i0, that.effect_instruction_i0);
	}
	[symbol$1]() {
		return pipe(string(this._tag), combine$5(hash(this.effect_instruction_i0)), cached(this));
	}
	get value() {
		return this.effect_instruction_i0;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toJSON() {
		return {
			_id: "Exit",
			_tag: this._op,
			value: toJSON(this.value)
		};
	}
	toString() {
		return format$4(this.toJSON());
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	[Symbol.iterator]() {
		return new SingleShotGen(new YieldWrap(this));
	}
};
/** @internal */
const isEffect$1 = (u) => hasProperty(u, EffectTypeId);
const withFiberRuntime = (withRuntime) => {
	const effect = new EffectPrimitive(OP_WITH_RUNTIME);
	effect.effect_instruction_i0 = withRuntime;
	return effect;
};
const acquireUseRelease = /* @__PURE__ */ dual(3, (acquire, use, release) => uninterruptibleMask$1((restore) => flatMap$3(acquire, (a) => flatMap$3(exit(suspend$2(() => restore(use(a)))), (exit) => {
	return suspend$2(() => release(a, exit)).pipe(matchCauseEffect$1({
		onFailure: (cause) => {
			switch (exit._tag) {
				case OP_FAILURE: return failCause$1(sequential$2(exit.effect_instruction_i0, cause));
				case OP_SUCCESS: return failCause$1(cause);
			}
		},
		onSuccess: () => exit
	}));
}))));
const as = /* @__PURE__ */ dual(2, (self, value) => flatMap$3(self, () => succeed$2(value)));
const asVoid = (self) => as(self, void 0);
const custom = function() {
	const wrapper = new EffectPrimitive(OP_COMMIT);
	switch (arguments.length) {
		case 2:
			wrapper.effect_instruction_i0 = arguments[0];
			wrapper.commit = arguments[1];
			break;
		case 3:
			wrapper.effect_instruction_i0 = arguments[0];
			wrapper.effect_instruction_i1 = arguments[1];
			wrapper.commit = arguments[2];
			break;
		case 4:
			wrapper.effect_instruction_i0 = arguments[0];
			wrapper.effect_instruction_i1 = arguments[1];
			wrapper.effect_instruction_i2 = arguments[2];
			wrapper.commit = arguments[3];
			break;
		default: throw new Error(getBugErrorMessage("you're not supposed to end up here"));
	}
	return wrapper;
};
const unsafeAsync = (register, blockingOn = none$2) => {
	const effect = new EffectPrimitive(OP_ASYNC);
	let cancelerRef = void 0;
	effect.effect_instruction_i0 = (resume) => {
		cancelerRef = register(resume);
	};
	effect.effect_instruction_i1 = blockingOn;
	return onInterrupt(effect, (_) => isEffect$1(cancelerRef) ? cancelerRef : void_$1);
};
const asyncInterrupt = (register, blockingOn = none$2) => suspend$2(() => unsafeAsync(register, blockingOn));
const async_ = (resume, blockingOn = none$2) => {
	return custom(resume, function() {
		let backingResume = void 0;
		let pendingEffect = void 0;
		function proxyResume(effect) {
			if (backingResume) backingResume(effect);
			else if (pendingEffect === void 0) pendingEffect = effect;
		}
		const effect = new EffectPrimitive(OP_ASYNC);
		effect.effect_instruction_i0 = (resume) => {
			backingResume = resume;
			if (pendingEffect) resume(pendingEffect);
		};
		effect.effect_instruction_i1 = blockingOn;
		let cancelerRef = void 0;
		let controllerRef = void 0;
		if (this.effect_instruction_i0.length !== 1) {
			controllerRef = new AbortController();
			cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume, controllerRef.signal));
		} else cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume));
		return cancelerRef || controllerRef ? onInterrupt(effect, (_) => {
			if (controllerRef) controllerRef.abort();
			return cancelerRef ?? void_$1;
		}) : effect;
	});
};
const catchAll$1 = /* @__PURE__ */ dual(2, (self, f) => matchEffect(self, {
	onFailure: f,
	onSuccess: succeed$2
}));
const originalSymbol = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation");
const capture = (obj, span) => {
	if (isSome(span)) return new Proxy(obj, {
		has(target, p) {
			return p === spanSymbol || p === originalSymbol || p in target;
		},
		get(target, p) {
			if (p === spanSymbol) return span.value;
			if (p === originalSymbol) return obj;
			return target[p];
		}
	});
	return obj;
};
const die = (defect) => isObject(defect) && !(spanSymbol in defect) ? withFiberRuntime((fiber) => failCause$1(die$1(capture(defect, currentSpanFromFiber(fiber))))) : failCause$1(die$1(defect));
const dieMessage = (message) => failCauseSync(() => die$1(new RuntimeException(message)));
const either$1 = (self) => matchEffect(self, {
	onFailure: (e) => succeed$2(left(e)),
	onSuccess: (a) => succeed$2(right(a))
});
const exit = (self) => matchCause(self, {
	onFailure: exitFailCause$1,
	onSuccess: exitSucceed$1
});
const fail$2 = (error) => isObject(error) && !(spanSymbol in error) ? withFiberRuntime((fiber) => failCause$1(fail$3(capture(error, currentSpanFromFiber(fiber))))) : failCause$1(fail$3(error));
const failSync = (evaluate) => flatMap$3(sync(evaluate), fail$2);
const failCause$1 = (cause) => {
	const effect = new EffectPrimitiveFailure(OP_FAILURE);
	effect.effect_instruction_i0 = cause;
	return effect;
};
const failCauseSync = (evaluate) => flatMap$3(sync(evaluate), failCause$1);
const fiberId = /* @__PURE__ */ withFiberRuntime((state) => succeed$2(state.id()));
const fiberIdWith = (f) => withFiberRuntime((state) => f(state.id()));
const flatMap$3 = /* @__PURE__ */ dual(2, (self, f) => {
	const effect = new EffectPrimitive(OP_ON_SUCCESS);
	effect.effect_instruction_i0 = self;
	effect.effect_instruction_i1 = f;
	return effect;
});
const step = (self) => {
	const effect = new EffectPrimitive("OnStep");
	effect.effect_instruction_i0 = self;
	return effect;
};
const flatten$1 = (self) => flatMap$3(self, identity);
const matchCause = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect$1(self, {
	onFailure: (cause) => succeed$2(options.onFailure(cause)),
	onSuccess: (a) => succeed$2(options.onSuccess(a))
}));
const matchCauseEffect$1 = /* @__PURE__ */ dual(2, (self, options) => {
	const effect = new EffectPrimitive(OP_ON_SUCCESS_AND_FAILURE);
	effect.effect_instruction_i0 = self;
	effect.effect_instruction_i1 = options.onFailure;
	effect.effect_instruction_i2 = options.onSuccess;
	return effect;
});
const matchEffect = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect$1(self, {
	onFailure: (cause) => {
		if (defects(cause).length > 0) return failCause$1(electFailures(cause));
		const failures$2 = failures(cause);
		if (failures$2.length > 0) return options.onFailure(unsafeHead(failures$2));
		return failCause$1(cause);
	},
	onSuccess: options.onSuccess
}));
const forEachSequential = /* @__PURE__ */ dual(2, (self, f) => suspend$2(() => {
	const arr = fromIterable$6(self);
	const ret = allocate(arr.length);
	let i = 0;
	return as(whileLoop({
		while: () => i < arr.length,
		body: () => f(arr[i], i),
		step: (b) => {
			ret[i++] = b;
		}
	}), ret);
}));
const forEachSequentialDiscard = /* @__PURE__ */ dual(2, (self, f) => suspend$2(() => {
	const arr = fromIterable$6(self);
	let i = 0;
	return whileLoop({
		while: () => i < arr.length,
		body: () => f(arr[i], i),
		step: () => {
			i++;
		}
	});
}));
const interruptible$1 = (self) => {
	const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
	effect.effect_instruction_i0 = enable(1);
	effect.effect_instruction_i1 = () => self;
	return effect;
};
const map$2 = /* @__PURE__ */ dual(2, (self, f) => flatMap$3(self, (a) => sync(() => f(a))));
const mapBoth$2 = /* @__PURE__ */ dual(2, (self, options) => matchEffect(self, {
	onFailure: (e) => failSync(() => options.onFailure(e)),
	onSuccess: (a) => sync(() => options.onSuccess(a))
}));
const mapError$2 = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect$1(self, {
	onFailure: (cause) => {
		const either = failureOrCause(cause);
		switch (either._tag) {
			case "Left": return failSync(() => f(either.left));
			case "Right": return failCause$1(either.right);
		}
	},
	onSuccess: succeed$2
}));
const onExit$1 = /* @__PURE__ */ dual(2, (self, cleanup) => uninterruptibleMask$1((restore) => matchCauseEffect$1(restore(self), {
	onFailure: (cause1) => {
		const result = exitFailCause$1(cause1);
		return matchCauseEffect$1(cleanup(result), {
			onFailure: (cause2) => exitFailCause$1(sequential$2(cause1, cause2)),
			onSuccess: () => result
		});
	},
	onSuccess: (success) => {
		const result = exitSucceed$1(success);
		return zipRight(cleanup(result), result);
	}
})));
const onInterrupt = /* @__PURE__ */ dual(2, (self, cleanup) => onExit$1(self, exitMatch({
	onFailure: (cause) => isInterruptedOnly(cause) ? asVoid(cleanup(interruptors(cause))) : void_$1,
	onSuccess: () => void_$1
})));
const succeed$2 = (value) => {
	const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
	effect.effect_instruction_i0 = value;
	return effect;
};
const suspend$2 = (evaluate) => {
	const effect = new EffectPrimitive(OP_COMMIT);
	effect.commit = evaluate;
	return effect;
};
const sync = (thunk) => {
	const effect = new EffectPrimitive(OP_SYNC);
	effect.effect_instruction_i0 = thunk;
	return effect;
};
const tap = /* @__PURE__ */ dual((args) => args.length === 3 || args.length === 2 && !(isObject(args[1]) && "onlyEffect" in args[1]), (self, f) => flatMap$3(self, (a) => {
	const b = typeof f === "function" ? f(a) : f;
	if (isEffect$1(b)) return as(b, a);
	else if (isPromiseLike(b)) return unsafeAsync((resume) => {
		b.then((_) => resume(succeed$2(a)), (e) => resume(fail$2(new UnknownException(e, "An unknown error occurred in Effect.tap"))));
	});
	return succeed$2(a);
}));
const transplant = (f) => withFiberRuntime((state) => {
	return f(fiberRefLocally(currentForkScopeOverride, some(pipe(state.getFiberRef(currentForkScopeOverride), getOrElse(() => state.scope())))));
});
const uninterruptible = (self) => {
	const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
	effect.effect_instruction_i0 = disable(1);
	effect.effect_instruction_i1 = () => self;
	return effect;
};
const uninterruptibleMask$1 = (f) => custom(f, function() {
	const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
	effect.effect_instruction_i0 = disable(1);
	effect.effect_instruction_i1 = (oldFlags) => interruption(oldFlags) ? internalCall(() => this.effect_instruction_i0(interruptible$1)) : internalCall(() => this.effect_instruction_i0(uninterruptible));
	return effect;
});
const void_$1 = /* @__PURE__ */ succeed$2(void 0);
const updateRuntimeFlags = (patch) => {
	const effect = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
	effect.effect_instruction_i0 = patch;
	effect.effect_instruction_i1 = void 0;
	return effect;
};
const whileLoop = (options) => {
	const effect = new EffectPrimitive(OP_WHILE);
	effect.effect_instruction_i0 = options.while;
	effect.effect_instruction_i1 = options.body;
	effect.effect_instruction_i2 = options.step;
	return effect;
};
const yieldNow$2 = (options) => {
	const effect = new EffectPrimitive(OP_YIELD);
	return typeof options?.priority !== "undefined" ? withSchedulingPriority(effect, options.priority) : effect;
};
const zip = /* @__PURE__ */ dual(2, (self, that) => flatMap$3(self, (a) => map$2(that, (b) => [a, b])));
const zipLeft = /* @__PURE__ */ dual(2, (self, that) => flatMap$3(self, (a) => as(that, a)));
const zipRight = /* @__PURE__ */ dual(2, (self, that) => flatMap$3(self, () => that));
const interruptFiber = (self) => flatMap$3(fiberId, (fiberId) => pipe(self, interruptAsFiber(fiberId)));
const interruptAsFiber = /* @__PURE__ */ dual(2, (self, fiberId) => flatMap$3(self.interruptAsFork(fiberId), () => self.await));
/** @internal */
const logLevelAll = {
	_tag: "All",
	syslog: 0,
	label: "ALL",
	ordinal: Number.MIN_SAFE_INTEGER,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const logLevelFatal = {
	_tag: "Fatal",
	syslog: 2,
	label: "FATAL",
	ordinal: 5e4,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const logLevelError = {
	_tag: "Error",
	syslog: 3,
	label: "ERROR",
	ordinal: 4e4,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const logLevelWarning = {
	_tag: "Warning",
	syslog: 4,
	label: "WARN",
	ordinal: 3e4,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const logLevelInfo = {
	_tag: "Info",
	syslog: 6,
	label: "INFO",
	ordinal: 2e4,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const logLevelDebug = {
	_tag: "Debug",
	syslog: 7,
	label: "DEBUG",
	ordinal: 1e4,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const logLevelTrace = {
	_tag: "Trace",
	syslog: 7,
	label: "TRACE",
	ordinal: 0,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const logLevelNone = {
	_tag: "None",
	syslog: 7,
	label: "OFF",
	ordinal: Number.MAX_SAFE_INTEGER,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const FiberRefTypeId = /* @__PURE__ */ Symbol.for("effect/FiberRef");
const fiberRefVariance = { _A: (_) => _ };
const fiberRefGet = (self) => withFiberRuntime((fiber) => exitSucceed$1(fiber.getFiberRef(self)));
const fiberRefGetWith = /* @__PURE__ */ dual(2, (self, f) => flatMap$3(fiberRefGet(self), f));
const fiberRefSet = /* @__PURE__ */ dual(2, (self, value) => fiberRefModify(self, () => [void 0, value]));
const fiberRefModify = /* @__PURE__ */ dual(2, (self, f) => withFiberRuntime((state) => {
	const [b, a] = f(state.getFiberRef(self));
	state.setFiberRef(self, a);
	return succeed$2(b);
}));
const fiberRefLocally = /* @__PURE__ */ dual(3, (use, self, value) => acquireUseRelease(zipLeft(fiberRefGet(self), fiberRefSet(self, value)), () => use, (oldValue) => fiberRefSet(self, oldValue)));
/** @internal */
const fiberRefUnsafeMake = (initial, options) => fiberRefUnsafeMakePatch(initial, {
	differ: update$1(),
	fork: options?.fork ?? identity,
	join: options?.join
});
/** @internal */
const fiberRefUnsafeMakeHashSet = (initial) => {
	const differ = hashSet();
	return fiberRefUnsafeMakePatch(initial, {
		differ,
		fork: differ.empty
	});
};
/** @internal */
const fiberRefUnsafeMakeReadonlyArray = (initial) => {
	const differ = readonlyArray(update$1());
	return fiberRefUnsafeMakePatch(initial, {
		differ,
		fork: differ.empty
	});
};
/** @internal */
const fiberRefUnsafeMakeContext = (initial) => {
	const differ = environment();
	return fiberRefUnsafeMakePatch(initial, {
		differ,
		fork: differ.empty
	});
};
/** @internal */
const fiberRefUnsafeMakePatch = (initial, options) => {
	return {
		...CommitPrototype,
		[FiberRefTypeId]: fiberRefVariance,
		initial,
		commit() {
			return fiberRefGet(this);
		},
		diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
		combine: (first, second) => options.differ.combine(first, second),
		patch: (patch) => (oldValue) => options.differ.patch(patch, oldValue),
		fork: options.fork,
		join: options.join ?? ((_, n) => n)
	};
};
/** @internal */
const fiberRefUnsafeMakeRuntimeFlags = (initial) => fiberRefUnsafeMakePatch(initial, {
	differ: differ$1,
	fork: differ$1.empty
});
/** @internal */
const currentContext = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => fiberRefUnsafeMakeContext(empty$12()));
/** @internal */
const currentSchedulingPriority = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => fiberRefUnsafeMake(0));
/** @internal */
const currentMaxOpsBeforeYield = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => fiberRefUnsafeMake(2048));
/** @internal */
const currentLogAnnotations = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => fiberRefUnsafeMake(empty$11()));
/** @internal */
const currentLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => fiberRefUnsafeMake(logLevelInfo));
/** @internal */
const currentLogSpan = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => fiberRefUnsafeMake(empty$10()));
/** @internal */
const withSchedulingPriority = /* @__PURE__ */ dual(2, (self, scheduler) => fiberRefLocally(self, currentSchedulingPriority, scheduler));
/** @internal */
const currentConcurrency = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => fiberRefUnsafeMake("unbounded"));
/**
* @internal
*/
const currentRequestBatching = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => fiberRefUnsafeMake(true));
/** @internal */
const currentUnhandledErrorLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => fiberRefUnsafeMake(some(logLevelDebug)));
/** @internal */
const currentVersionMismatchErrorLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/versionMismatchErrorLogLevel"), () => fiberRefUnsafeMake(some(logLevelWarning)));
/** @internal */
const currentMetricLabels = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => fiberRefUnsafeMakeReadonlyArray(empty$19()));
/** @internal */
const currentForkScopeOverride = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => fiberRefUnsafeMake(none$4(), {
	fork: () => none$4(),
	join: (parent, _) => parent
}));
/** @internal */
const currentInterruptedCause = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => fiberRefUnsafeMake(empty$14, {
	fork: () => empty$14,
	join: (parent, _) => parent
}));
/** @internal */
const ScopeTypeId = /* @__PURE__ */ Symbol.for("effect/Scope");
/** @internal */
const CloseableScopeTypeId = /* @__PURE__ */ Symbol.for("effect/CloseableScope");
const scopeAddFinalizer = (self, finalizer) => self.addFinalizer(() => asVoid(finalizer));
const scopeClose = (self, exit) => self.close(exit);
const scopeFork = (self, strategy) => self.fork(strategy);
/** @internal */
const YieldableError$1 = /* @__PURE__ */ function() {
	class YieldableError extends globalThis.Error {
		commit() {
			return fail$2(this);
		}
		toJSON() {
			const obj = { ...this };
			if (this.message) obj.message = this.message;
			if (this.cause) obj.cause = this.cause;
			return obj;
		}
		[NodeInspectSymbol]() {
			if (this.toString !== globalThis.Error.prototype.toString) return this.stack ? `${this.toString()}\n${this.stack.split("\n").slice(1).join("\n")}` : this.toString();
			else if ("Bun" in globalThis) return pretty$1(fail$3(this), { renderErrorCause: true });
			return this;
		}
	}
	Object.assign(YieldableError.prototype, StructuralCommitPrototype);
	return YieldableError;
}();
const makeException = (proto, tag) => {
	class Base extends YieldableError$1 {
		_tag = tag;
	}
	Object.assign(Base.prototype, proto);
	Base.prototype.name = tag;
	return Base;
};
/** @internal */
const RuntimeExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException");
/** @internal */
const RuntimeException = /* @__PURE__ */ makeException({ [RuntimeExceptionTypeId]: RuntimeExceptionTypeId }, "RuntimeException");
/** @internal */
const InterruptedExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException");
/** @internal */
const isInterruptedException = (u) => hasProperty(u, InterruptedExceptionTypeId);
/** @internal */
const IllegalArgumentExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/IllegalArgument");
/** @internal */
const IllegalArgumentException$1 = /* @__PURE__ */ makeException({ [IllegalArgumentExceptionTypeId]: IllegalArgumentExceptionTypeId }, "IllegalArgumentException");
/** @internal */
const NoSuchElementExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement");
/** @internal */
const NoSuchElementException$1 = /* @__PURE__ */ makeException({ [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId }, "NoSuchElementException");
/** @internal */
const UnknownExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException");
/** @internal */
const UnknownException = /* @__PURE__ */ function() {
	class UnknownException extends YieldableError$1 {
		_tag = "UnknownException";
		error;
		constructor(cause, message) {
			super(message ?? "An unknown error occurred", { cause });
			this.error = cause;
		}
	}
	Object.assign(UnknownException.prototype, {
		[UnknownExceptionTypeId]: UnknownExceptionTypeId,
		name: "UnknownException"
	});
	return UnknownException;
}();
/** @internal */
const exitIsExit = (u) => isEffect$1(u) && "_tag" in u && (u._tag === "Success" || u._tag === "Failure");
/** @internal */
const exitIsSuccess = (self) => self._tag === "Success";
/** @internal */
const exitAs = /* @__PURE__ */ dual(2, (self, value) => {
	switch (self._tag) {
		case OP_FAILURE: return exitFailCause$1(self.effect_instruction_i0);
		case OP_SUCCESS: return exitSucceed$1(value);
	}
});
/** @internal */
const exitAsVoid = (self) => exitAs(self, void 0);
/** @internal */
const exitCollectAll = (exits, options) => exitCollectAllInternal(exits, options?.parallel ? parallel$2 : sequential$2);
/** @internal */
const exitDie$1 = (defect) => exitFailCause$1(die$1(defect));
/** @internal */
const exitFail = (error) => exitFailCause$1(fail$3(error));
/** @internal */
const exitFailCause$1 = (cause) => {
	const effect = new EffectPrimitiveFailure(OP_FAILURE);
	effect.effect_instruction_i0 = cause;
	return effect;
};
/** @internal */
const exitInterrupt$1 = (fiberId) => exitFailCause$1(interrupt(fiberId));
/** @internal */
const exitMap = /* @__PURE__ */ dual(2, (self, f) => {
	switch (self._tag) {
		case OP_FAILURE: return exitFailCause$1(self.effect_instruction_i0);
		case OP_SUCCESS: return exitSucceed$1(f(self.effect_instruction_i0));
	}
});
/** @internal */
const exitMatch = /* @__PURE__ */ dual(2, (self, { onFailure, onSuccess }) => {
	switch (self._tag) {
		case OP_FAILURE: return onFailure(self.effect_instruction_i0);
		case OP_SUCCESS: return onSuccess(self.effect_instruction_i0);
	}
});
/** @internal */
const exitSucceed$1 = (value) => {
	const effect = new EffectPrimitiveSuccess(OP_SUCCESS);
	effect.effect_instruction_i0 = value;
	return effect;
};
/** @internal */
const exitVoid$1 = /* @__PURE__ */ exitSucceed$1(void 0);
/** @internal */
const exitZipWith = /* @__PURE__ */ dual(3, (self, that, { onFailure, onSuccess }) => {
	switch (self._tag) {
		case OP_FAILURE: switch (that._tag) {
			case OP_SUCCESS: return exitFailCause$1(self.effect_instruction_i0);
			case OP_FAILURE: return exitFailCause$1(onFailure(self.effect_instruction_i0, that.effect_instruction_i0));
		}
		case OP_SUCCESS: switch (that._tag) {
			case OP_SUCCESS: return exitSucceed$1(onSuccess(self.effect_instruction_i0, that.effect_instruction_i0));
			case OP_FAILURE: return exitFailCause$1(that.effect_instruction_i0);
		}
	}
});
const exitCollectAllInternal = (exits, combineCauses) => {
	const list = fromIterable$5(exits);
	if (!isNonEmpty$2(list)) return none$4();
	return pipe(tailNonEmpty(list), reduce$6(pipe(headNonEmpty(list), exitMap(of$1)), (accumulator, current) => pipe(accumulator, exitZipWith(current, {
		onSuccess: (list, value) => pipe(list, prepend$1(value)),
		onFailure: combineCauses
	}))), exitMap(reverse$1), exitMap((chunk) => toReadonlyArray(chunk)), some);
};
/** @internal */
const deferredUnsafeMake = (fiberId) => {
	return {
		...CommitPrototype,
		[DeferredTypeId]: deferredVariance,
		state: make$14(pending([])),
		commit() {
			return deferredAwait(this);
		},
		blockingOn: fiberId
	};
};
const deferredAwait = (self) => asyncInterrupt((resume) => {
	const state = get$3(self.state);
	switch (state._tag) {
		case OP_STATE_DONE: return resume(state.effect);
		case OP_STATE_PENDING:
			state.joiners.push(resume);
			return deferredInterruptJoiner(self, resume);
	}
}, self.blockingOn);
/** @internal */
const deferredUnsafeDone = (self, effect) => {
	const state = get$3(self.state);
	if (state._tag === "Pending") {
		set$2(self.state, done$2(effect));
		for (let i = 0, len = state.joiners.length; i < len; i++) state.joiners[i](effect);
	}
};
const deferredInterruptJoiner = (self, joiner) => sync(() => {
	const state = get$3(self.state);
	if (state._tag === "Pending") {
		const index = state.joiners.indexOf(joiner);
		if (index >= 0) state.joiners.splice(index, 1);
	}
});
const constContext = /* @__PURE__ */ withFiberRuntime((fiber) => exitSucceed$1(fiber.currentContext));
const context = () => constContext;
const contextWithEffect = (f) => flatMap$3(context(), f);
const provideContext$1 = /* @__PURE__ */ dual(2, (self, context) => fiberRefLocally(currentContext, context)(self));
const mapInputContext = /* @__PURE__ */ dual(2, (self, f) => contextWithEffect((context) => provideContext$1(self, f(context))));
/** @internal */
const currentSpanFromFiber = (fiber) => {
	const span = fiber.currentSpan;
	return span !== void 0 && span._tag === "Span" ? some(span) : none$4();
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Cause.js
/**
* Checks if a `Cause` is a `Fail` type.
*
* @see {@link fail} Create a new `Fail` cause
*
* @since 2.0.0
* @category Guards
*/
const isFailType = isFailType$1;
/**
* Creates an error indicating an invalid method argument.
*
* **Details**
*
* This function constructs an `IllegalArgumentException`. It is typically
* thrown or returned when an operation receives improper inputs, such as
* out-of-range values or invalid object states.
*
* @since 2.0.0
* @category Errors
*/
const IllegalArgumentException = IllegalArgumentException$1;
/**
* Converts a `Cause` into a human-readable string.
*
* **Details**
*
* This function pretty-prints the entire `Cause`, including any failures,
* defects, and interruptions. It can be especially helpful for logging,
* debugging, or displaying structured errors to users.
*
* You can optionally pass `options` to configure how the error cause is
* rendered. By default, it includes essential details of all errors in the
* `Cause`.
*
* @see {@link prettyErrors} Get a list of `PrettyError` objects instead of a single string.
*
* @since 2.0.0
* @category Formatting
*/
const pretty = pretty$1;
/** @internal */
const OP_INVALID_DATA = "InvalidData";
/** @internal */
const OP_MISSING_DATA = "MissingData";
/** @internal */
const OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
/** @internal */
const OP_UNSUPPORTED = "Unsupported";
/** @internal */
const ConfigErrorTypeId = /* @__PURE__ */ Symbol.for("effect/ConfigError");
/** @internal */
const proto = {
	_tag: "ConfigError",
	[ConfigErrorTypeId]: ConfigErrorTypeId
};
/** @internal */
const And = (self, that) => {
	const error = Object.create(proto);
	error._op = "And";
	error.left = self;
	error.right = that;
	Object.defineProperty(error, "toString", {
		enumerable: false,
		value() {
			return `${this.left} and ${this.right}`;
		}
	});
	Object.defineProperty(error, "message", {
		enumerable: false,
		get() {
			return this.toString();
		}
	});
	return error;
};
/** @internal */
const Or = (self, that) => {
	const error = Object.create(proto);
	error._op = "Or";
	error.left = self;
	error.right = that;
	Object.defineProperty(error, "toString", {
		enumerable: false,
		value() {
			return `${this.left} or ${this.right}`;
		}
	});
	Object.defineProperty(error, "message", {
		enumerable: false,
		get() {
			return this.toString();
		}
	});
	return error;
};
/** @internal */
const InvalidData = (path, message, options = { pathDelim: "." }) => {
	const error = Object.create(proto);
	error._op = OP_INVALID_DATA;
	error.path = path;
	error.message = message;
	Object.defineProperty(error, "toString", {
		enumerable: false,
		value() {
			return `(Invalid data at ${pipe(this.path, join$1(options.pathDelim))}: "${this.message}")`;
		}
	});
	return error;
};
/** @internal */
const MissingData = (path, message, options = { pathDelim: "." }) => {
	const error = Object.create(proto);
	error._op = OP_MISSING_DATA;
	error.path = path;
	error.message = message;
	Object.defineProperty(error, "toString", {
		enumerable: false,
		value() {
			return `(Missing data at ${pipe(this.path, join$1(options.pathDelim))}: "${this.message}")`;
		}
	});
	return error;
};
/** @internal */
const SourceUnavailable = (path, message, cause, options = { pathDelim: "." }) => {
	const error = Object.create(proto);
	error._op = OP_SOURCE_UNAVAILABLE;
	error.path = path;
	error.message = message;
	error.cause = cause;
	Object.defineProperty(error, "toString", {
		enumerable: false,
		value() {
			return `(Source unavailable at ${pipe(this.path, join$1(options.pathDelim))}: "${this.message}")`;
		}
	});
	return error;
};
/** @internal */
const Unsupported = (path, message, options = { pathDelim: "." }) => {
	const error = Object.create(proto);
	error._op = OP_UNSUPPORTED;
	error.path = path;
	error.message = message;
	Object.defineProperty(error, "toString", {
		enumerable: false,
		value() {
			return `(Unsupported operation at ${pipe(this.path, join$1(options.pathDelim))}: "${this.message}")`;
		}
	});
	return error;
};
/** @internal */
const prefixed = /* @__PURE__ */ dual(2, (self, prefix) => {
	switch (self._op) {
		case "And": return And(prefixed(self.left, prefix), prefixed(self.right, prefix));
		case "Or": return Or(prefixed(self.left, prefix), prefixed(self.right, prefix));
		case OP_INVALID_DATA: return InvalidData([...prefix, ...self.path], self.message);
		case OP_MISSING_DATA: return MissingData([...prefix, ...self.path], self.message);
		case OP_SOURCE_UNAVAILABLE: return SourceUnavailable([...prefix, ...self.path], self.message, self.cause);
		case OP_UNSUPPORTED: return Unsupported([...prefix, ...self.path], self.message);
	}
});
/** @internal */
const ClockTypeId = /* @__PURE__ */ Symbol.for("effect/Clock");
/** @internal */
const clockTag = /* @__PURE__ */ GenericTag("effect/Clock");
/** @internal */
const MAX_TIMER_MILLIS = 2 ** 31 - 1;
/** @internal */
const globalClockScheduler = { unsafeSchedule(task, duration) {
	const millis = toMillis(duration);
	if (millis > MAX_TIMER_MILLIS) return constFalse;
	let completed = false;
	const handle = setTimeout(() => {
		completed = true;
		task();
	}, millis);
	return () => {
		clearTimeout(handle);
		return !completed;
	};
} };
const performanceNowNanos = /* @__PURE__ */ function() {
	const bigint1e6 = /* @__PURE__ */ BigInt(1e6);
	if (typeof performance === "undefined" || typeof performance.now !== "function") return () => BigInt(Date.now()) * bigint1e6;
	let origin;
	return () => {
		if (origin === void 0) origin = BigInt(Date.now()) * bigint1e6 - BigInt(Math.round(performance.now() * 1e6));
		return origin + BigInt(Math.round(performance.now() * 1e6));
	};
}();
const processOrPerformanceNow = /* @__PURE__ */ function() {
	const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : void 0;
	if (!processHrtime) return performanceNowNanos;
	const origin = /* @__PURE__ */ performanceNowNanos() - /* @__PURE__ */ processHrtime.bigint();
	return () => origin + processHrtime.bigint();
}();
/** @internal */
var ClockImpl = class {
	[ClockTypeId] = ClockTypeId;
	unsafeCurrentTimeMillis() {
		return Date.now();
	}
	unsafeCurrentTimeNanos() {
		return processOrPerformanceNow();
	}
	currentTimeMillis = /* @__PURE__ */ sync(() => this.unsafeCurrentTimeMillis());
	currentTimeNanos = /* @__PURE__ */ sync(() => this.unsafeCurrentTimeNanos());
	scheduler() {
		return succeed$2(globalClockScheduler);
	}
	sleep(duration) {
		return async_((resume) => {
			return asVoid(sync(globalClockScheduler.unsafeSchedule(() => resume(void_$1), duration)));
		});
	}
};
/** @internal */
const make$10 = () => new ClockImpl();
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Number.js
/**
* @memberof Number
* @since 2.0.0
* @category instances
*/
const Order$1 = number;
/**
* Tries to parse a `number` from a `string` using the `Number()` function. The
* following special string values are supported: "NaN", "Infinity",
* "-Infinity".
*
* @memberof Number
* @since 2.0.0
* @category constructors
*/
const parse = (s) => {
	if (s === "NaN") return some$1(NaN);
	if (s === "Infinity") return some$1(Infinity);
	if (s === "-Infinity") return some$1(-Infinity);
	if (s.trim() === "") return none$5;
	const n = Number(s);
	return Number.isNaN(n) ? none$5 : some$1(n);
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/RegExp.js
/**
* Escapes special characters in a regular expression pattern.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { RegExp } from "effect"
*
* assert.deepStrictEqual(RegExp.escape("a*b"), "a\\*b")
* ```
*
* @since 2.0.0
*/
const escape = (string) => string.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/configProvider/pathPatch.js
/** @internal */
const empty$5 = { _tag: "Empty" };
/** @internal */
const patch$3 = /* @__PURE__ */ dual(2, (path, patch) => {
	let input = of(patch);
	let output = path;
	while (isCons(input)) {
		const patch = input.head;
		switch (patch._tag) {
			case "Empty":
				input = input.tail;
				break;
			case "AndThen":
				input = cons(patch.first, cons(patch.second, input.tail));
				break;
			case "MapName":
				output = map$5(output, patch.f);
				input = input.tail;
				break;
			case "Nested":
				output = prepend$2(output, patch.name);
				input = input.tail;
				break;
			case "Unnested":
				if (pipe(head(output), contains(patch.name))) {
					output = tailNonEmpty$1(output);
					input = input.tail;
				} else return left(MissingData(output, `Expected ${patch.name} to be in path in ConfigProvider#unnested`));
				break;
		}
	}
	return right(output);
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/opCodes/config.js
/** @internal */
const OP_CONSTANT = "Constant";
/** @internal */
const OP_FAIL = "Fail";
/** @internal */
const OP_FALLBACK = "Fallback";
/** @internal */
const OP_DESCRIBED = "Described";
/** @internal */
const OP_LAZY = "Lazy";
/** @internal */
const OP_MAP_OR_FAIL = "MapOrFail";
/** @internal */
const OP_NESTED = "Nested";
/** @internal */
const OP_PRIMITIVE = "Primitive";
/** @internal */
const OP_SEQUENCE = "Sequence";
/** @internal */
const OP_HASHMAP = "HashMap";
/** @internal */
const OP_ZIP_WITH = "ZipWith";
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/configProvider.js
const concat = (l, r) => [...l, ...r];
/** @internal */
const ConfigProviderTypeId = /* @__PURE__ */ Symbol.for("effect/ConfigProvider");
/** @internal */
const configProviderTag = /* @__PURE__ */ GenericTag("effect/ConfigProvider");
/** @internal */
const FlatConfigProviderTypeId = /* @__PURE__ */ Symbol.for("effect/ConfigProviderFlat");
/** @internal */
const make$9 = (options) => ({
	[ConfigProviderTypeId]: ConfigProviderTypeId,
	pipe() {
		return pipeArguments(this, arguments);
	},
	...options
});
/** @internal */
const makeFlat = (options) => ({
	[FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
	patch: options.patch,
	load: (path, config, split = true) => options.load(path, config, split),
	enumerateChildren: options.enumerateChildren
});
/** @internal */
const fromFlat = (flat) => make$9({
	load: (config) => flatMap$3(fromFlatLoop(flat, empty$19(), config, false), (chunk) => match$3(head(chunk), {
		onNone: () => fail$2(MissingData(empty$19(), `Expected a single value having structure: ${config}`)),
		onSome: succeed$2
	})),
	flattened: flat
});
/** @internal */
const fromEnv = (options) => {
	const { pathDelim, seqDelim } = Object.assign({}, {
		pathDelim: "_",
		seqDelim: ","
	}, options);
	const makePathString = (path) => pipe(path, join$1(pathDelim));
	const unmakePathString = (pathString) => pathString.split(pathDelim);
	const getEnv = () => typeof process !== "undefined" && "env" in process && typeof process.env === "object" ? process.env : {};
	const load = (path, primitive, split = true) => {
		const pathString = makePathString(path);
		const current = getEnv();
		return pipe(pathString in current ? some(current[pathString]) : none$4(), mapError$2(() => MissingData(path, `Expected ${pathString} to exist in the process context`)), flatMap$3((value) => parsePrimitive(value, path, primitive, seqDelim, split)));
	};
	const enumerateChildren = (path) => sync(() => {
		const current = getEnv();
		return fromIterable$2(Object.keys(current).map((value) => unmakePathString(value.toUpperCase())).filter((keyPath) => {
			for (let i = 0; i < path.length; i++) {
				const pathComponent = pipe(path, unsafeGet$3(i));
				const currentElement = keyPath[i];
				if (currentElement === void 0 || pathComponent !== currentElement) return false;
			}
			return true;
		}).flatMap((keyPath) => keyPath.slice(path.length, path.length + 1)));
	});
	return fromFlat(makeFlat({
		load,
		enumerateChildren,
		patch: empty$5
	}));
};
const extend = (leftDef, rightDef, left, right) => {
	const leftPad = unfold(left.length, (index) => index >= right.length ? none$4() : some([leftDef(index), index + 1]));
	const rightPad = unfold(right.length, (index) => index >= left.length ? none$4() : some([rightDef(index), index + 1]));
	return [concat(left, leftPad), concat(right, rightPad)];
};
const appendConfigPath = (path, config) => {
	let op = config;
	if (op._tag === "Nested") {
		const out = path.slice();
		while (op._tag === "Nested") {
			out.push(op.name);
			op = op.config;
		}
		return out;
	}
	return path;
};
const fromFlatLoop = (flat, prefix, config, split) => {
	const op = config;
	switch (op._tag) {
		case OP_CONSTANT: return succeed$2(of$2(op.value));
		case OP_DESCRIBED: return suspend$2(() => fromFlatLoop(flat, prefix, op.config, split));
		case OP_FAIL: return fail$2(MissingData(prefix, op.message));
		case OP_FALLBACK: return pipe(suspend$2(() => fromFlatLoop(flat, prefix, op.first, split)), catchAll$1((error1) => {
			if (op.condition(error1)) return pipe(fromFlatLoop(flat, prefix, op.second, split), catchAll$1((error2) => fail$2(Or(error1, error2))));
			return fail$2(error1);
		}));
		case OP_LAZY: return suspend$2(() => fromFlatLoop(flat, prefix, op.config(), split));
		case OP_MAP_OR_FAIL: return suspend$2(() => pipe(fromFlatLoop(flat, prefix, op.original, split), flatMap$3(forEachSequential((a) => pipe(op.mapOrFail(a), mapError$2(prefixed(appendConfigPath(prefix, op.original))))))));
		case OP_NESTED: return suspend$2(() => fromFlatLoop(flat, concat(prefix, of$2(op.name)), op.config, split));
		case OP_PRIMITIVE: return pipe(patch$3(prefix, flat.patch), flatMap$3((prefix) => pipe(flat.load(prefix, op, split), flatMap$3((values) => {
			if (values.length === 0) {
				const name = pipe(last(prefix), getOrElse(() => "<n/a>"));
				return fail$2(MissingData([], `Expected ${op.description} with name ${name}`));
			}
			return succeed$2(values);
		}))));
		case OP_SEQUENCE: return pipe(patch$3(prefix, flat.patch), flatMap$3((patchedPrefix) => pipe(flat.enumerateChildren(patchedPrefix), flatMap$3(indicesFrom), flatMap$3((indices) => {
			if (indices.length === 0) return suspend$2(() => map$2(fromFlatLoop(flat, prefix, op.config, true), of$2));
			return pipe(forEachSequential(indices, (index) => fromFlatLoop(flat, append$1(prefix, `[${index}]`), op.config, true)), map$2((chunkChunk) => {
				const flattened = flatten$3(chunkChunk);
				if (flattened.length === 0) return of$2(empty$19());
				return of$2(flattened);
			}));
		}))));
		case OP_HASHMAP: return suspend$2(() => pipe(patch$3(prefix, flat.patch), flatMap$3((prefix) => pipe(flat.enumerateChildren(prefix), flatMap$3((keys) => {
			return pipe(keys, forEachSequential((key) => fromFlatLoop(flat, concat(prefix, of$2(key)), op.valueConfig, split)), map$2((matrix) => {
				if (matrix.length === 0) return of$2(empty$11());
				return pipe(transpose(matrix), map$5((values) => fromIterable$1(zip$1(fromIterable$6(keys), values))));
			}));
		})))));
		case OP_ZIP_WITH: return suspend$2(() => pipe(fromFlatLoop(flat, prefix, op.left, split), either$1, flatMap$3((left) => pipe(fromFlatLoop(flat, prefix, op.right, split), either$1, flatMap$3((right$4) => {
			if (isLeft(left) && isLeft(right$4)) return fail$2(And(left.left, right$4.left));
			if (isLeft(left) && isRight(right$4)) return fail$2(left.left);
			if (isRight(left) && isLeft(right$4)) return fail$2(right$4.left);
			if (isRight(left) && isRight(right$4)) {
				const fail = fromFlatLoopFail(prefix, pipe(prefix, join$1(".")));
				const [lefts, rights] = extend(fail, fail, pipe(left.right, map$5(right)), pipe(right$4.right, map$5(right)));
				return pipe(lefts, zip$1(rights), forEachSequential(([left, right]) => pipe(zip(left, right), map$2(([left, right]) => op.zip(left, right)))));
			}
			throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
		})))));
	}
};
const fromFlatLoopFail = (prefix, path) => (index) => left(MissingData(prefix, `The element at index ${index} in a sequence at path "${path}" was missing`));
const splitPathString = (text, delim) => {
	return text.split(new RegExp(`\\s*${escape(delim)}\\s*`));
};
const parsePrimitive = (text, path, primitive, delimiter, split) => {
	if (!split) return pipe(primitive.parse(text), mapBoth$2({
		onFailure: prefixed(path),
		onSuccess: of$2
	}));
	return pipe(splitPathString(text, delimiter), forEachSequential((char) => primitive.parse(char.trim())), mapError$2(prefixed(path)));
};
const transpose = (array) => {
	return Object.keys(array[0]).map((column) => array.map((row) => row[column]));
};
const indicesFrom = (quotedIndices) => pipe(forEachSequential(quotedIndices, parseQuotedIndex), mapBoth$2({
	onFailure: () => empty$19(),
	onSuccess: sort(Order$1)
}), either$1, map$2(merge$3));
const QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
const parseQuotedIndex = (str) => {
	const match = str.match(QUOTED_INDEX_REGEX);
	if (match !== null) {
		const matchedIndex = match[2];
		return pipe(matchedIndex !== void 0 && matchedIndex.length > 0 ? some(matchedIndex) : none$4(), flatMap$5(parseInteger));
	}
	return none$4();
};
const parseInteger = (str) => {
	const parsedIndex = Number.parseInt(str);
	return Number.isNaN(parsedIndex) ? none$4() : some(parsedIndex);
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/defaultServices/console.js
/** @internal */
const TypeId$4 = /* @__PURE__ */ Symbol.for("effect/Console");
/** @internal */
const consoleTag = /* @__PURE__ */ GenericTag("effect/Console");
/** @internal */
const defaultConsole = {
	[TypeId$4]: TypeId$4,
	assert(condition, ...args) {
		return sync(() => {
			console.assert(condition, ...args);
		});
	},
	clear: /* @__PURE__ */ sync(() => {
		console.clear();
	}),
	count(label) {
		return sync(() => {
			console.count(label);
		});
	},
	countReset(label) {
		return sync(() => {
			console.countReset(label);
		});
	},
	debug(...args) {
		return sync(() => {
			console.debug(...args);
		});
	},
	dir(item, options) {
		return sync(() => {
			console.dir(item, options);
		});
	},
	dirxml(...args) {
		return sync(() => {
			console.dirxml(...args);
		});
	},
	error(...args) {
		return sync(() => {
			console.error(...args);
		});
	},
	group(options) {
		return options?.collapsed ? sync(() => console.groupCollapsed(options?.label)) : sync(() => console.group(options?.label));
	},
	groupEnd: /* @__PURE__ */ sync(() => {
		console.groupEnd();
	}),
	info(...args) {
		return sync(() => {
			console.info(...args);
		});
	},
	log(...args) {
		return sync(() => {
			console.log(...args);
		});
	},
	table(tabularData, properties) {
		return sync(() => {
			console.table(tabularData, properties);
		});
	},
	time(label) {
		return sync(() => console.time(label));
	},
	timeEnd(label) {
		return sync(() => console.timeEnd(label));
	},
	timeLog(label, ...args) {
		return sync(() => {
			console.timeLog(label, ...args);
		});
	},
	trace(...args) {
		return sync(() => {
			console.trace(...args);
		});
	},
	warn(...args) {
		return sync(() => {
			console.warn(...args);
		});
	},
	unsafe: console
};
/** @internal */
const RandomTypeId = /* @__PURE__ */ Symbol.for("effect/Random");
/** @internal */
const randomTag = /* @__PURE__ */ GenericTag("effect/Random");
/** @internal */
var RandomImpl = class {
	seed;
	[RandomTypeId] = RandomTypeId;
	PRNG;
	constructor(seed) {
		this.seed = seed;
		this.PRNG = new PCGRandom(seed);
	}
	get next() {
		return sync(() => this.PRNG.number());
	}
	get nextBoolean() {
		return map$2(this.next, (n) => n > .5);
	}
	get nextInt() {
		return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
	}
	nextRange(min, max) {
		return map$2(this.next, (n) => (max - min) * n + min);
	}
	nextIntBetween(min, max) {
		return sync(() => this.PRNG.integer(max - min) + min);
	}
	shuffle(elements) {
		return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
	}
};
const shuffleWith = (elements, nextIntBounded) => {
	return suspend$2(() => pipe(sync(() => Array.from(elements)), flatMap$3((buffer) => {
		const numbers = [];
		for (let i = buffer.length; i >= 2; i = i - 1) numbers.push(i);
		return pipe(numbers, forEachSequentialDiscard((n) => pipe(nextIntBounded(n), map$2((k) => swap(buffer, n - 1, k)))), as(fromIterable$5(buffer)));
	})));
};
const swap = (buffer, index1, index2) => {
	const tmp = buffer[index1];
	buffer[index1] = buffer[index2];
	buffer[index2] = tmp;
	return buffer;
};
const make$8 = (seed) => new RandomImpl(hash(seed));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/tracer.js
/**
* @since 2.0.0
*/
/** @internal */
const TracerTypeId = /* @__PURE__ */ Symbol.for("effect/Tracer");
/** @internal */
const make$7 = (options) => ({
	[TracerTypeId]: TracerTypeId,
	...options
});
/** @internal */
const tracerTag = /* @__PURE__ */ GenericTag("effect/Tracer");
/** @internal */
const spanTag = /* @__PURE__ */ GenericTag("effect/ParentSpan");
const randomHexString = /* @__PURE__ */ function() {
	const characters = "abcdef0123456789";
	const charactersLength = 16;
	return function(length) {
		let result = "";
		for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
	};
}();
/** @internal */
var NativeSpan = class {
	name;
	parent;
	context;
	startTime;
	kind;
	_tag = "Span";
	spanId;
	traceId = "native";
	sampled = true;
	status;
	attributes;
	events = [];
	links;
	constructor(name, parent, context, links, startTime, kind) {
		this.name = name;
		this.parent = parent;
		this.context = context;
		this.startTime = startTime;
		this.kind = kind;
		this.status = {
			_tag: "Started",
			startTime
		};
		this.attributes = /* @__PURE__ */ new Map();
		this.traceId = parent._tag === "Some" ? parent.value.traceId : randomHexString(32);
		this.spanId = randomHexString(16);
		this.links = Array.from(links);
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
/** @internal */
const nativeTracer = /* @__PURE__ */ make$7({
	span: (name, parent, context, links, startTime, kind) => new NativeSpan(name, parent, context, links, startTime, kind),
	context: (f) => f()
});
/** @internal */
const DisablePropagation = /* @__PURE__ */ Reference()("effect/Tracer/DisablePropagation", { defaultValue: constFalse });
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/defaultServices.js
/** @internal */
const liveServices = /* @__PURE__ */ pipe(/* @__PURE__ */ empty$12(), /* @__PURE__ */ add(clockTag, /* @__PURE__ */ make$10()), /* @__PURE__ */ add(consoleTag, defaultConsole), /* @__PURE__ */ add(randomTag, /* @__PURE__ */ make$8(/* @__PURE__ */ Math.random())), /* @__PURE__ */ add(configProviderTag, /* @__PURE__ */ fromEnv()), /* @__PURE__ */ add(tracerTag, nativeTracer));
/**
* The `FiberRef` holding the default `Effect` services.
*
* @since 2.0.0
* @category fiberRefs
*/
const currentServices = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => fiberRefUnsafeMakeContext(liveServices));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Data.js
/**
* Provides a constructor for a Case Class.
*
* @since 2.0.0
* @category constructors
*/
const Error$3 = /* @__PURE__ */ function() {
	const plainArgsSymbol = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
	return { BaseEffectError: class extends YieldableError$1 {
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
	} }.BaseEffectError;
}();
/**
* @since 2.0.0
* @category constructors
*/
const TaggedError$1 = (tag) => {
	const O = { BaseEffectError: class extends Error$3 {
		_tag = tag;
	} };
	O.BaseEffectError.prototype.name = tag;
	return O.BaseEffectError;
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Effectable.js
/**
* @since 2.0.0
* @category prototypes
*/
const EffectPrototype = EffectPrototype$1;
const Base = Base$1;
/**
* @since 2.0.0
* @category constructors
*/
var Class = class extends Base {};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/executionStrategy.js
/** @internal */
const OP_SEQUENTIAL = "Sequential";
/** @internal */
const OP_PARALLEL = "Parallel";
/** @internal */
const OP_PARALLEL_N = "ParallelN";
/** @internal */
const sequential$1 = { _tag: OP_SEQUENTIAL };
/** @internal */
const parallel$1 = { _tag: OP_PARALLEL };
/** @internal */
const parallelN$1 = (parallelism) => ({
	_tag: OP_PARALLEL_N,
	parallelism
});
/** @internal */
const isSequential = (self) => self._tag === OP_SEQUENTIAL;
/** @internal */
const isParallel = (self) => self._tag === OP_PARALLEL;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/ExecutionStrategy.js
/**
* Execute effects sequentially.
*
* @since 2.0.0
* @category constructors
*/
const sequential = sequential$1;
/**
* Execute effects in parallel.
*
* @since 2.0.0
* @category constructors
*/
const parallel = parallel$1;
/**
* Execute effects in parallel, up to the specified number of concurrent fibers.
*
* @since 2.0.0
* @category constructors
*/
const parallelN = parallelN$1;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/fiberRefs.js
/** @internal */
function unsafeMake$4(fiberRefLocals) {
	return new FiberRefsImpl(fiberRefLocals);
}
/** @internal */
function empty$4() {
	return unsafeMake$4(/* @__PURE__ */ new Map());
}
/** @internal */
const FiberRefsSym = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
/** @internal */
var FiberRefsImpl = class {
	locals;
	[FiberRefsSym] = FiberRefsSym;
	constructor(locals) {
		this.locals = locals;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const findAncestor = (_ref, _parentStack, _childStack, _childModified = false) => {
	const ref = _ref;
	let parentStack = _parentStack;
	let childStack = _childStack;
	let childModified = _childModified;
	let ret = void 0;
	while (ret === void 0) if (isNonEmptyReadonlyArray(parentStack) && isNonEmptyReadonlyArray(childStack)) {
		const parentFiberId = headNonEmpty$1(parentStack)[0];
		const parentAncestors = tailNonEmpty$1(parentStack);
		const childFiberId = headNonEmpty$1(childStack)[0];
		const childRefValue = headNonEmpty$1(childStack)[1];
		const childAncestors = tailNonEmpty$1(childStack);
		if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
			childStack = childAncestors;
			childModified = true;
		} else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) parentStack = parentAncestors;
		else if (parentFiberId.id < childFiberId.id) {
			childStack = childAncestors;
			childModified = true;
		} else if (parentFiberId.id > childFiberId.id) parentStack = parentAncestors;
		else ret = [childRefValue, childModified];
	} else ret = [ref.initial, true];
	return ret;
};
/** @internal */
const joinAs = /* @__PURE__ */ dual(3, (self, fiberId, that) => {
	const parentFiberRefs = new Map(self.locals);
	that.locals.forEach((childStack, fiberRef) => {
		const childValue = childStack[0][1];
		if (!childStack[0][0][symbol](fiberId)) {
			if (!parentFiberRefs.has(fiberRef)) {
				if (equals$2(childValue, fiberRef.initial)) return;
				parentFiberRefs.set(fiberRef, [[fiberId, fiberRef.join(fiberRef.initial, childValue)]]);
				return;
			}
			const parentStack = parentFiberRefs.get(fiberRef);
			const [ancestor, wasModified] = findAncestor(fiberRef, parentStack, childStack);
			if (wasModified) {
				const patch = fiberRef.diff(ancestor, childValue);
				const oldValue = parentStack[0][1];
				const newValue = fiberRef.join(oldValue, fiberRef.patch(patch)(oldValue));
				if (!equals$2(oldValue, newValue)) {
					let newStack;
					const parentFiberId = parentStack[0][0];
					if (parentFiberId[symbol](fiberId)) newStack = [[parentFiberId, newValue], ...parentStack.slice(1)];
					else newStack = [[fiberId, newValue], ...parentStack];
					parentFiberRefs.set(fiberRef, newStack);
				}
			}
		}
	});
	return new FiberRefsImpl(parentFiberRefs);
});
/** @internal */
const forkAs = /* @__PURE__ */ dual(2, (self, childId) => {
	const map = /* @__PURE__ */ new Map();
	unsafeForkAs(self, map, childId);
	return new FiberRefsImpl(map);
});
const unsafeForkAs = (self, map, fiberId) => {
	self.locals.forEach((stack, fiberRef) => {
		const oldValue = stack[0][1];
		const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
		if (equals$2(oldValue, newValue)) map.set(fiberRef, stack);
		else map.set(fiberRef, [[fiberId, newValue], ...stack]);
	});
};
/** @internal */
const delete_ = /* @__PURE__ */ dual(2, (self, fiberRef) => {
	const locals = new Map(self.locals);
	locals.delete(fiberRef);
	return new FiberRefsImpl(locals);
});
/** @internal */
const get$1 = /* @__PURE__ */ dual(2, (self, fiberRef) => {
	if (!self.locals.has(fiberRef)) return none$4();
	return some(headNonEmpty$1(self.locals.get(fiberRef))[1]);
});
/** @internal */
const getOrDefault$1 = /* @__PURE__ */ dual(2, (self, fiberRef) => pipe(get$1(self, fiberRef), getOrElse(() => fiberRef.initial)));
/** @internal */
const updateAs = /* @__PURE__ */ dual(2, (self, { fiberId, fiberRef, value }) => {
	if (self.locals.size === 0) return new FiberRefsImpl(new Map([[fiberRef, [[fiberId, value]]]]));
	const locals = new Map(self.locals);
	unsafeUpdateAs(locals, fiberId, fiberRef, value);
	return new FiberRefsImpl(locals);
});
const unsafeUpdateAs = (locals, fiberId, fiberRef, value) => {
	const oldStack = locals.get(fiberRef) ?? [];
	let newStack;
	if (isNonEmptyReadonlyArray(oldStack)) {
		const [currentId, currentValue] = headNonEmpty$1(oldStack);
		if (currentId[symbol](fiberId)) if (equals$2(currentValue, value)) return;
		else newStack = [[fiberId, value], ...oldStack.slice(1)];
		else newStack = [[fiberId, value], ...oldStack];
	} else newStack = [[fiberId, value]];
	locals.set(fiberRef, newStack);
};
/** @internal */
const updateManyAs$1 = /* @__PURE__ */ dual(2, (self, { entries, forkAs }) => {
	if (self.locals.size === 0) return new FiberRefsImpl(new Map(entries));
	const locals = new Map(self.locals);
	if (forkAs !== void 0) unsafeForkAs(self, locals, forkAs);
	entries.forEach(([fiberRef, values]) => {
		if (values.length === 1) unsafeUpdateAs(locals, values[0][0], fiberRef, values[0][1]);
		else values.forEach(([fiberId, value]) => {
			unsafeUpdateAs(locals, fiberId, fiberRef, value);
		});
	});
	return new FiberRefsImpl(locals);
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/FiberRefs.js
/**
* Gets the value of the specified `FiberRef` in this collection of `FiberRef`
* values if it exists or the `initial` value of the `FiberRef` otherwise.
*
* @since 2.0.0
* @category getters
*/
const getOrDefault = getOrDefault$1;
/**
* Updates the values of the specified `FiberRef` & value pairs using the provided `FiberId`
*
* @since 2.0.0
* @category utils
*/
const updateManyAs = updateManyAs$1;
/**
* The empty collection of `FiberRef` values.
*
* @category constructors
* @since 2.0.0
*/
const empty$3 = empty$4;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/fiberRefs/patch.js
/** @internal */
const OP_EMPTY$1 = "Empty";
/** @internal */
const OP_REMOVE = "Remove";
/** @internal */
const OP_UPDATE = "Update";
/** @internal */
const OP_AND_THEN$1 = "AndThen";
/** @internal */
const empty$2 = { _tag: OP_EMPTY$1 };
/** @internal */
const diff$2 = (oldValue, newValue) => {
	const missingLocals = new Map(oldValue.locals);
	let patch = empty$2;
	for (const [fiberRef, pairs] of newValue.locals.entries()) {
		const newValue = headNonEmpty$1(pairs)[1];
		const old = missingLocals.get(fiberRef);
		if (old !== void 0) {
			const oldValue = headNonEmpty$1(old)[1];
			if (!equals$2(oldValue, newValue)) patch = combine$1({
				_tag: OP_UPDATE,
				fiberRef,
				patch: fiberRef.diff(oldValue, newValue)
			})(patch);
		} else patch = combine$1({
			_tag: "Add",
			fiberRef,
			value: newValue
		})(patch);
		missingLocals.delete(fiberRef);
	}
	for (const [fiberRef] of missingLocals.entries()) patch = combine$1({
		_tag: OP_REMOVE,
		fiberRef
	})(patch);
	return patch;
};
/** @internal */
const combine$1 = /* @__PURE__ */ dual(2, (self, that) => ({
	_tag: OP_AND_THEN$1,
	first: self,
	second: that
}));
/** @internal */
const patch$2 = /* @__PURE__ */ dual(3, (self, fiberId, oldValue) => {
	let fiberRefs = oldValue;
	let patches = of$2(self);
	while (isNonEmptyReadonlyArray(patches)) {
		const head = headNonEmpty$1(patches);
		const tail = tailNonEmpty$1(patches);
		switch (head._tag) {
			case OP_EMPTY$1:
				patches = tail;
				break;
			case "Add":
				fiberRefs = updateAs(fiberRefs, {
					fiberId,
					fiberRef: head.fiberRef,
					value: head.value
				});
				patches = tail;
				break;
			case OP_REMOVE:
				fiberRefs = delete_(fiberRefs, head.fiberRef);
				patches = tail;
				break;
			case OP_UPDATE: {
				const value = getOrDefault$1(fiberRefs, head.fiberRef);
				fiberRefs = updateAs(fiberRefs, {
					fiberId,
					fiberRef: head.fiberRef,
					value: head.fiberRef.patch(head.patch)(value)
				});
				patches = tail;
				break;
			}
			case OP_AND_THEN$1:
				patches = prepend$2(head.first)(prepend$2(head.second)(tail));
				break;
		}
	}
	return fiberRefs;
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/FiberRefsPatch.js
/**
* Constructs a patch that describes the changes between the specified
* collections of `FiberRef`
*
* @since 2.0.0
* @category constructors
*/
const diff$1 = diff$2;
/**
* Applies the changes described by this patch to the specified collection
* of `FiberRef` values.
*
* @since 2.0.0
* @category destructors
*/
const patch$1 = patch$2;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/fiberStatus.js
const FiberStatusSymbolKey = "effect/FiberStatus";
/** @internal */
const FiberStatusTypeId = /* @__PURE__ */ Symbol.for(FiberStatusSymbolKey);
/** @internal */
const OP_DONE = "Done";
/** @internal */
const OP_RUNNING = "Running";
/** @internal */
const OP_SUSPENDED = "Suspended";
const DoneHash = /* @__PURE__ */ string(`${FiberStatusSymbolKey}-${OP_DONE}`);
/** @internal */
var Done = class {
	[FiberStatusTypeId] = FiberStatusTypeId;
	_tag = OP_DONE;
	[symbol$1]() {
		return DoneHash;
	}
	[symbol](that) {
		return isFiberStatus(that) && that._tag === "Done";
	}
};
/** @internal */
var Running = class {
	runtimeFlags;
	[FiberStatusTypeId] = FiberStatusTypeId;
	_tag = OP_RUNNING;
	constructor(runtimeFlags) {
		this.runtimeFlags = runtimeFlags;
	}
	[symbol$1]() {
		return pipe(hash(FiberStatusSymbolKey), combine$5(hash(this._tag)), combine$5(hash(this.runtimeFlags)), cached(this));
	}
	[symbol](that) {
		return isFiberStatus(that) && that._tag === "Running" && this.runtimeFlags === that.runtimeFlags;
	}
};
/** @internal */
var Suspended = class {
	runtimeFlags;
	blockingOn;
	[FiberStatusTypeId] = FiberStatusTypeId;
	_tag = OP_SUSPENDED;
	constructor(runtimeFlags, blockingOn) {
		this.runtimeFlags = runtimeFlags;
		this.blockingOn = blockingOn;
	}
	[symbol$1]() {
		return pipe(hash(FiberStatusSymbolKey), combine$5(hash(this._tag)), combine$5(hash(this.runtimeFlags)), combine$5(hash(this.blockingOn)), cached(this));
	}
	[symbol](that) {
		return isFiberStatus(that) && that._tag === "Suspended" && this.runtimeFlags === that.runtimeFlags && equals$2(this.blockingOn, that.blockingOn);
	}
};
/** @internal */
const done$1 = /* @__PURE__ */ new Done();
/** @internal */
const running$1 = (runtimeFlags) => new Running(runtimeFlags);
/** @internal */
const suspended$1 = (runtimeFlags, blockingOn) => new Suspended(runtimeFlags, blockingOn);
/** @internal */
const isFiberStatus = (u) => hasProperty(u, FiberStatusTypeId);
/** @internal */
const isDone$1 = (self) => self._tag === OP_DONE;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/FiberStatus.js
/**
* @since 2.0.0
* @category constructors
*/
const done = done$1;
/**
* @since 2.0.0
* @category constructors
*/
const running = running$1;
/**
* @since 2.0.0
* @category constructors
*/
const suspended = suspended$1;
/**
* Returns `true` if the specified `FiberStatus` is `Done`, `false` otherwise.
*
* @since 2.0.0
* @category refinements
*/
const isDone = isDone$1;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/LogLevel.js
/**
* @since 2.0.0
* @category constructors
*/
const All = logLevelAll;
/**
* @since 2.0.0
* @category constructors
*/
const Fatal = logLevelFatal;
/**
* @since 2.0.0
* @category constructors
*/
const Error$2 = logLevelError;
/**
* @since 2.0.0
* @category constructors
*/
const Warning = logLevelWarning;
/**
* @since 2.0.0
* @category constructors
*/
const Info = logLevelInfo;
/**
* @since 2.0.0
* @category constructors
*/
const Debug = logLevelDebug;
/**
* @since 2.0.0
* @category constructors
*/
const Trace = logLevelTrace;
/**
* @since 2.0.0
* @category constructors
*/
const None = logLevelNone;
/**
* @since 2.0.0
* @category ordering
*/
const greaterThan$1 = /* @__PURE__ */ greaterThan$2(/* @__PURE__ */ pipe(Order$1, /* @__PURE__ */ mapInput((level) => level.ordinal)));
/**
* @since 2.0.0
* @category conversions
*/
const fromLiteral = (literal) => {
	switch (literal) {
		case "All": return All;
		case "Debug": return Debug;
		case "Error": return Error$2;
		case "Fatal": return Fatal;
		case "Info": return Info;
		case "Trace": return Trace;
		case "None": return None;
		case "Warning": return Warning;
	}
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Micro.js
/**
* @since 3.4.0
* @experimental
* @category type ids
*/
const TypeId$3 = /* @__PURE__ */ Symbol.for("effect/Micro");
/**
* @since 3.4.0
* @experimental
* @category MicroExit
*/
const MicroExitTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit");
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const MicroCauseTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause");
const microCauseVariance = { _E: identity };
var MicroCauseImpl = class extends globalThis.Error {
	_tag;
	traces;
	[MicroCauseTypeId];
	constructor(_tag, originalError, traces) {
		const causeName = `MicroCause.${_tag}`;
		let name;
		let message;
		let stack;
		if (originalError instanceof globalThis.Error) {
			name = `(${causeName}) ${originalError.name}`;
			message = originalError.message;
			const messageLines = message.split("\n").length;
			stack = originalError.stack ? `(${causeName}) ${originalError.stack.split("\n").slice(0, messageLines + 3).join("\n")}` : `${name}: ${message}`;
		} else {
			name = causeName;
			message = toStringUnknown(originalError, 0);
			stack = `${name}: ${message}`;
		}
		if (traces.length > 0) stack += `\n    ${traces.join("\n    ")}`;
		super(message);
		this._tag = _tag;
		this.traces = traces;
		this[MicroCauseTypeId] = microCauseVariance;
		this.name = name;
		this.stack = stack;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toString() {
		return this.stack;
	}
	[NodeInspectSymbol]() {
		return this.stack;
	}
};
var Fail = class extends MicroCauseImpl {
	error;
	constructor(error, traces = []) {
		super("Fail", error, traces);
		this.error = error;
	}
};
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeFail = (error, traces = []) => new Fail(error, traces);
var Die = class extends MicroCauseImpl {
	defect;
	constructor(defect, traces = []) {
		super("Die", defect, traces);
		this.defect = defect;
	}
};
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeDie = (defect, traces = []) => new Die(defect, traces);
var Interrupt = class extends MicroCauseImpl {
	constructor(traces = []) {
		super("Interrupt", "interrupted", traces);
	}
};
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeInterrupt = (traces = []) => new Interrupt(traces);
/**
* @since 3.4.6
* @experimental
* @category MicroCause
*/
const causeIsInterrupt = (self) => self._tag === "Interrupt";
/**
* @since 3.11.0
* @experimental
* @category MicroFiber
*/
const MicroFiberTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber");
const fiberVariance$1 = {
	_A: identity,
	_E: identity
};
var MicroFiberImpl = class {
	context;
	interruptible;
	[MicroFiberTypeId];
	_stack = [];
	_observers = [];
	_exit;
	_children;
	currentOpCount = 0;
	constructor(context, interruptible = true) {
		this.context = context;
		this.interruptible = interruptible;
		this[MicroFiberTypeId] = fiberVariance$1;
	}
	getRef(ref) {
		return unsafeGetReference(this.context, ref);
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
	_interrupted = false;
	unsafeInterrupt() {
		if (this._exit) return;
		this._interrupted = true;
		if (this.interruptible) this.evaluate(exitInterrupt);
	}
	unsafePoll() {
		return this._exit;
	}
	evaluate(effect) {
		if (this._exit) return;
		else if (this._yielded !== void 0) {
			const yielded = this._yielded;
			this._yielded = void 0;
			yielded();
		}
		const exit = this.runLoop(effect);
		if (exit === Yield) return;
		const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
		if (interruptChildren !== void 0) return this.evaluate(flatMap$2(interruptChildren, () => exit));
		this._exit = exit;
		for (let i = 0; i < this._observers.length; i++) this._observers[i](exit);
		this._observers.length = 0;
	}
	runLoop(effect) {
		let yielding = false;
		let current = effect;
		this.currentOpCount = 0;
		try {
			while (true) {
				this.currentOpCount++;
				if (!yielding && this.getRef(CurrentScheduler).shouldYield(this)) {
					yielding = true;
					const prev = current;
					current = flatMap$2(yieldNow$1, () => prev);
				}
				current = current[evaluate](this);
				if (current === Yield) {
					const yielded = this._yielded;
					if (MicroExitTypeId in yielded) {
						this._yielded = void 0;
						return yielded;
					}
					return Yield;
				}
			}
		} catch (error) {
			if (!hasProperty(current, evaluate)) return exitDie(`MicroFiber.runLoop: Not a valid effect: ${String(current)}`);
			return exitDie(error);
		}
	}
	getCont(symbol) {
		while (true) {
			const op = this._stack.pop();
			if (!op) return void 0;
			const cont = op[ensureCont] && op[ensureCont](this);
			if (cont) return { [symbol]: cont };
			if (op[symbol]) return op;
		}
	}
	_yielded = void 0;
	yieldWith(value) {
		this._yielded = value;
		return Yield;
	}
	children() {
		return this._children ??= /* @__PURE__ */ new Set();
	}
};
const fiberMiddleware = /* @__PURE__ */ globalValue("effect/Micro/fiberMiddleware", () => ({ interruptChildren: void 0 }));
const identifier = /* @__PURE__ */ Symbol.for("effect/Micro/identifier");
const args = /* @__PURE__ */ Symbol.for("effect/Micro/args");
const evaluate = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate");
const successCont = /* @__PURE__ */ Symbol.for("effect/Micro/successCont");
const failureCont = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont");
const ensureCont = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont");
const Yield = /* @__PURE__ */ Symbol.for("effect/Micro/Yield");
const microVariance = {
	_A: identity,
	_E: identity,
	_R: identity
};
const MicroProto = {
	...EffectPrototype,
	_op: "Micro",
	[TypeId$3]: microVariance,
	pipe() {
		return pipeArguments(this, arguments);
	},
	[Symbol.iterator]() {
		return new SingleShotGen$1(new YieldWrap(this));
	},
	toJSON() {
		return {
			_id: "Micro",
			op: this[identifier],
			...args in this ? { args: this[args] } : void 0
		};
	},
	toString() {
		return format$4(this);
	},
	[NodeInspectSymbol]() {
		return format$4(this);
	}
};
function defaultEvaluate(_fiber) {
	return exitDie(`Micro.evaluate: Not implemented`);
}
const makePrimitiveProto = (options) => ({
	...MicroProto,
	[identifier]: options.op,
	[evaluate]: options.eval ?? defaultEvaluate,
	[successCont]: options.contA,
	[failureCont]: options.contE,
	[ensureCont]: options.ensure
});
const makePrimitive = (options) => {
	const Proto = makePrimitiveProto(options);
	return function() {
		const self = Object.create(Proto);
		self[args] = options.single === false ? arguments : arguments[0];
		return self;
	};
};
const makeExit = (options) => {
	const Proto = {
		...makePrimitiveProto(options),
		[MicroExitTypeId]: MicroExitTypeId,
		_tag: options.op,
		get [options.prop]() {
			return this[args];
		},
		toJSON() {
			return {
				_id: "MicroExit",
				_tag: options.op,
				[options.prop]: this[args]
			};
		},
		[symbol](that) {
			return isMicroExit(that) && that._tag === options.op && equals$2(this[args], that[args]);
		},
		[symbol$1]() {
			return cached(this, combine$5(string(options.op))(hash(this[args])));
		}
	};
	return function(value) {
		const self = Object.create(Proto);
		self[args] = value;
		self[successCont] = void 0;
		self[failureCont] = void 0;
		self[ensureCont] = void 0;
		return self;
	};
};
/**
* Creates a `Micro` effect that will succeed with the specified constant value.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const succeed$1 = /* @__PURE__ */ makeExit({
	op: "Success",
	prop: "value",
	eval(fiber) {
		const cont = fiber.getCont(successCont);
		return cont ? cont[successCont](this[args], fiber) : fiber.yieldWith(this);
	}
});
/**
* Creates a `Micro` effect that will fail with the specified `MicroCause`.
*
* @since 3.4.6
* @experimental
* @category constructors
*/
const failCause = /* @__PURE__ */ makeExit({
	op: "Failure",
	prop: "cause",
	eval(fiber) {
		let cont = fiber.getCont(failureCont);
		while (causeIsInterrupt(this[args]) && cont && fiber.interruptible) cont = fiber.getCont(failureCont);
		return cont ? cont[failureCont](this[args], fiber) : fiber.yieldWith(this);
	}
});
/**
* Creates a `Micro` effect that fails with the given error.
*
* This results in a `Fail` variant of the `MicroCause` type, where the error is
* tracked at the type level.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const fail$1 = (error) => failCause(causeFail(error));
/**
* Pause the execution of the current `Micro` effect, and resume it on the next
* scheduler tick.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const yieldNow$1 = /* @__PURE__ */ (/* @__PURE__ */ makePrimitive({
	op: "Yield",
	eval(fiber) {
		let resumed = false;
		fiber.getRef(CurrentScheduler).scheduleTask(() => {
			if (resumed) return;
			fiber.evaluate(exitVoid);
		}, this[args] ?? 0);
		return fiber.yieldWith(() => {
			resumed = true;
		});
	}
}))(0);
const void_ = /* @__PURE__ */ succeed$1(void 0);
/**
* Create a `Micro` effect using the current `MicroFiber`.
*
* @since 3.4.0
* @experimental
* @category constructors
*/
const withMicroFiber = /* @__PURE__ */ makePrimitive({
	op: "WithMicroFiber",
	eval(fiber) {
		return this[args](fiber);
	}
});
/**
* Map the success value of this `Micro` effect to another `Micro` effect, then
* flatten the result.
*
* @since 3.4.0
* @experimental
* @category mapping & sequencing
*/
const flatMap$2 = /* @__PURE__ */ dual(2, (self, f) => {
	const onSuccess = Object.create(OnSuccessProto);
	onSuccess[args] = self;
	onSuccess[successCont] = f;
	return onSuccess;
});
const OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
	op: "OnSuccess",
	eval(fiber) {
		fiber._stack.push(this);
		return this[args];
	}
});
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const isMicroExit = (u) => hasProperty(u, MicroExitTypeId);
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitSucceed = succeed$1;
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitFailCause = failCause;
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitInterrupt = /* @__PURE__ */ exitFailCause(/* @__PURE__ */ causeInterrupt());
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitDie = (defect) => exitFailCause(causeDie(defect));
/**
* @since 3.4.6
* @experimental
* @category MicroExit
*/
const exitVoid = /* @__PURE__ */ exitSucceed(void 0);
const setImmediate = "setImmediate" in globalThis ? globalThis.setImmediate : (f) => setTimeout(f, 0);
/**
* @since 3.5.9
* @experimental
* @category scheduler
*/
var MicroSchedulerDefault = class {
	tasks = [];
	running = false;
	/**
	* @since 3.5.9
	*/
	scheduleTask(task, _priority) {
		this.tasks.push(task);
		if (!this.running) {
			this.running = true;
			setImmediate(this.afterScheduled);
		}
	}
	/**
	* @since 3.5.9
	*/
	afterScheduled = () => {
		this.running = false;
		this.runTasks();
	};
	/**
	* @since 3.5.9
	*/
	runTasks() {
		const tasks = this.tasks;
		this.tasks = [];
		for (let i = 0, len = tasks.length; i < len; i++) tasks[i]();
	}
	/**
	* @since 3.5.9
	*/
	shouldYield(fiber) {
		return fiber.currentOpCount >= fiber.getRef(MaxOpsBeforeYield);
	}
	/**
	* @since 3.5.9
	*/
	flush() {
		while (this.tasks.length > 0) this.runTasks();
	}
};
/**
* Update the Context with the given mapping function.
*
* @since 3.11.0
* @experimental
* @category environment
*/
const updateContext = /* @__PURE__ */ dual(2, (self, f) => withMicroFiber((fiber) => {
	const prev = fiber.context;
	fiber.context = f(prev);
	return onExit(self, () => {
		fiber.context = prev;
		return void_;
	});
}));
/**
* Merge the given `Context` with the current context.
*
* @since 3.4.0
* @experimental
* @category environment
*/
const provideContext = /* @__PURE__ */ dual(2, (self, provided) => updateContext(self, merge$1(provided)));
/**
* @since 3.11.0
* @experimental
* @category references
*/
var MaxOpsBeforeYield = class extends Reference()("effect/Micro/currentMaxOpsBeforeYield", { defaultValue: () => 2048 }) {};
Reference()("effect/Micro/currentConcurrency", { defaultValue: () => "unbounded" });
/**
* @since 3.11.0
* @experimental
* @category environment refs
*/
var CurrentScheduler = class extends Reference()("effect/Micro/currentScheduler", { defaultValue: () => new MicroSchedulerDefault() }) {};
/**
* @since 3.4.6
* @experimental
* @category pattern matching
*/
const matchCauseEffect = /* @__PURE__ */ dual(2, (self, options) => {
	const primitive = Object.create(OnSuccessAndFailureProto);
	primitive[args] = self;
	primitive[successCont] = options.onSuccess;
	primitive[failureCont] = options.onFailure;
	return primitive;
});
const OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
	op: "OnSuccessAndFailure",
	eval(fiber) {
		fiber._stack.push(this);
		return this[args];
	}
});
/**
* When the `Micro` effect is completed, run the given finalizer effect with the
* `MicroExit` of the executed effect.
*
* @since 3.4.6
* @experimental
* @category resources & finalization
*/
const onExit = /* @__PURE__ */ dual(2, (self, f) => uninterruptibleMask((restore) => matchCauseEffect(restore(self), {
	onFailure: (cause) => flatMap$2(f(exitFailCause(cause)), () => failCause(cause)),
	onSuccess: (a) => flatMap$2(f(exitSucceed(a)), () => succeed$1(a))
})));
const setInterruptible = /* @__PURE__ */ makePrimitive({
	op: "SetInterruptible",
	ensure(fiber) {
		fiber.interruptible = this[args];
		if (fiber._interrupted && fiber.interruptible) return () => exitInterrupt;
	}
});
/**
* Flag the effect as interruptible, which means that when the effect is
* interrupted, it will be interrupted immediately.
*
* @since 3.4.0
* @experimental
* @category flags
*/
const interruptible = (self) => withMicroFiber((fiber) => {
	if (fiber.interruptible) return self;
	fiber.interruptible = true;
	fiber._stack.push(setInterruptible(false));
	if (fiber._interrupted) return exitInterrupt;
	return self;
});
/**
* Wrap the given `Micro` effect in an uninterruptible region, preventing the
* effect from being aborted.
*
* You can use the `restore` function to restore a `Micro` effect to the
* interruptibility state before the `uninterruptibleMask` was applied.
*
* @example
* ```ts
* import * as Micro from "effect/Micro"
*
* Micro.uninterruptibleMask((restore) =>
*   Micro.sleep(1000).pipe( // uninterruptible
*     Micro.andThen(restore(Micro.sleep(1000))) // interruptible
*   )
* )
* ```
*
* @since 3.4.0
* @experimental
* @category interruption
*/
const uninterruptibleMask = (f) => withMicroFiber((fiber) => {
	if (!fiber.interruptible) return f(identity);
	fiber.interruptible = false;
	fiber._stack.push(setInterruptible(true));
	return f(interruptible);
});
/**
* Execute the `Micro` effect and return a `MicroFiber` that can be awaited, joined,
* or aborted.
*
* You can listen for the result by adding an observer using the handle's
* `addObserver` method.
*
* @example
* ```ts
* import * as Micro from "effect/Micro"
*
* const handle = Micro.succeed(42).pipe(
*   Micro.delay(1000),
*   Micro.runFork
* )
*
* handle.addObserver((exit) => {
*   console.log(exit)
* })
* ```
*
* @since 3.4.0
* @experimental
* @category execution
*/
const runFork$1 = (effect, options) => {
	const fiber = new MicroFiberImpl(CurrentScheduler.context(options?.scheduler ?? new MicroSchedulerDefault()));
	fiber.evaluate(effect);
	if (options?.signal) if (options.signal.aborted) fiber.unsafeInterrupt();
	else {
		const abort = () => fiber.unsafeInterrupt();
		options.signal.addEventListener("abort", abort, { once: true });
		fiber.addObserver(() => options.signal.removeEventListener("abort", abort));
	}
	return fiber;
};
const YieldableError = /* @__PURE__ */ function() {
	class YieldableError extends globalThis.Error {}
	Object.assign(YieldableError.prototype, MicroProto, StructuralPrototype, {
		[identifier]: "Failure",
		[evaluate]() {
			return fail$1(this);
		},
		toString() {
			return this.message ? `${this.name}: ${this.message}` : this.name;
		},
		toJSON() {
			return { ...this };
		},
		[NodeInspectSymbol]() {
			const stack = this.stack;
			if (stack) return `${this.toString()}\n${stack.split("\n").slice(1).join("\n")}`;
			return this.toString();
		}
	});
	return YieldableError;
}();
/**
* @since 3.4.0
* @experimental
* @category errors
*/
const Error$1 = /* @__PURE__ */ function() {
	return class extends YieldableError {
		constructor(args) {
			super();
			if (args) Object.assign(this, args);
		}
	};
}();
/**
* @since 3.4.0
* @experimental
* @category errors
*/
const TaggedError = (tag) => {
	class Base extends Error$1 {
		_tag = tag;
	}
	Base.prototype.name = tag;
	return Base;
};
TaggedError("NoSuchElementException");
TaggedError("TimeoutException");
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Scheduler.js
/**
* @since 3.20.0
* @category models
*/
var SchedulerRunner = class SchedulerRunner {
	scheduleDrain;
	running = false;
	tasks = /* @__PURE__ */ new PriorityBuckets();
	constructor(scheduleDrain) {
		this.scheduleDrain = scheduleDrain;
	}
	starveInternal = (depth) => {
		const tasks = this.tasks.buckets;
		this.tasks.buckets = [];
		for (const [_, toRun] of tasks) for (let i = 0; i < toRun.length; i++) toRun[i]();
		if (this.tasks.buckets.length === 0) this.running = false;
		else this.starve(depth);
	};
	starve(depth = 0) {
		this.scheduleDrain(depth, this.starveInternal);
	}
	scheduleTask(task, priority) {
		this.tasks.scheduleTask(task, priority);
		if (!this.running) {
			this.running = true;
			this.starve();
		}
	}
	/**
	* @since 3.20.0
	* @category constructors
	*/
	static cached(scheduleDrain) {
		const fallback = new SchedulerRunner(scheduleDrain);
		const runners = /* @__PURE__ */ new WeakMap();
		return (fiber) => {
			if (fiber === void 0) return fallback;
			let runner = runners.get(fiber);
			if (runner === void 0) {
				runner = new SchedulerRunner(scheduleDrain);
				runners.set(fiber, runner);
			}
			return runner;
		};
	}
};
/**
* @since 2.0.0
* @category utils
*/
var PriorityBuckets = class {
	/**
	* @since 2.0.0
	*/
	buckets = [];
	/**
	* @since 2.0.0
	*/
	scheduleTask(task, priority) {
		const length = this.buckets.length;
		let bucket = void 0;
		let index = 0;
		for (; index < length; index++) if (this.buckets[index][0] <= priority) bucket = this.buckets[index];
		else break;
		if (bucket && bucket[0] === priority) bucket[1].push(task);
		else if (index === length) this.buckets.push([priority, [task]]);
		else this.buckets.splice(index, 0, [priority, [task]]);
	}
};
/**
* @since 2.0.0
* @category constructors
*/
var MixedScheduler = class {
	maxNextTickBeforeTimer;
	getRunner = /* @__PURE__ */ SchedulerRunner.cached((depth, drain) => {
		if (depth >= this.maxNextTickBeforeTimer) setTimeout(() => drain(0), 0);
		else Promise.resolve(void 0).then(() => drain(depth + 1));
	});
	constructor(maxNextTickBeforeTimer) {
		this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
	}
	/**
	* @since 2.0.0
	*/
	shouldYield(fiber) {
		return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
	}
	/**
	* @since 2.0.0
	*/
	scheduleTask(task, priority, fiber) {
		this.getRunner(fiber).scheduleTask(task, priority);
	}
};
/**
* @since 2.0.0
* @category schedulers
*/
const defaultScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new MixedScheduler(2048));
/**
* @since 2.0.0
* @category constructors
*/
var SyncScheduler = class {
	/**
	* @since 2.0.0
	*/
	tasks = /* @__PURE__ */ new PriorityBuckets();
	/**
	* @since 2.0.0
	*/
	deferred = false;
	/**
	* @since 2.0.0
	*/
	scheduleTask(task, priority, fiber) {
		if (this.deferred) defaultScheduler.scheduleTask(task, priority, fiber);
		else this.tasks.scheduleTask(task, priority);
	}
	/**
	* @since 2.0.0
	*/
	shouldYield(fiber) {
		return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
	}
	/**
	* @since 2.0.0
	*/
	flush() {
		while (this.tasks.buckets.length > 0) {
			const tasks = this.tasks.buckets;
			this.tasks.buckets = [];
			for (const [_, toRun] of tasks) for (let i = 0; i < toRun.length; i++) toRun[i]();
		}
		this.deferred = true;
	}
};
/** @internal */
const currentScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => fiberRefUnsafeMake(defaultScheduler));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/completedRequestMap.js
/** @internal */
const currentRequestMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => fiberRefUnsafeMake(/* @__PURE__ */ new Map()));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/concurrency.js
/** @internal */
const match = (concurrency, sequential, unbounded, bounded) => {
	switch (concurrency) {
		case void 0: return sequential();
		case "unbounded": return unbounded();
		case "inherit": return fiberRefGetWith(currentConcurrency, (concurrency) => concurrency === "unbounded" ? unbounded() : concurrency > 1 ? bounded(concurrency) : sequential());
		default: return concurrency > 1 ? bounded(concurrency) : sequential();
	}
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/logSpan.js
/**
* Sanitize a given string by replacing spaces, equal signs, and double quotes with underscores.
*
* @internal
*/
const formatLabel = (key) => key.replace(/[\s="]/g, "_");
/** @internal */
const render = (now) => (self) => {
	return `${formatLabel(self.label)}=${now - self.startTime}ms`;
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/metric/label.js
/** @internal */
const MetricLabelSymbolKey = "effect/MetricLabel";
/** @internal */
const MetricLabelTypeId = /* @__PURE__ */ Symbol.for(MetricLabelSymbolKey);
/** @internal */
var MetricLabelImpl = class {
	key;
	value;
	[MetricLabelTypeId] = MetricLabelTypeId;
	_hash;
	constructor(key, value) {
		this.key = key;
		this.value = value;
		this._hash = string(MetricLabelSymbolKey + this.key + this.value);
	}
	[symbol$1]() {
		return this._hash;
	}
	[symbol](that) {
		return isMetricLabel(that) && this.key === that.key && this.value === that.value;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const make$6 = (key, value) => {
	return new MetricLabelImpl(key, value);
};
/** @internal */
const isMetricLabel = (u) => hasProperty(u, MetricLabelTypeId);
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/core-effect.js
const filterDisablePropagation = /* @__PURE__ */ flatMap$5((span) => get$4(span.context, DisablePropagation) ? span._tag === "Span" ? filterDisablePropagation(span.parent) : none$4() : some(span));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Exit.js
/**
* Returns `true` if the specified `Exit` is a `Success`, `false` otherwise.
*
* @since 2.0.0
* @category refinements
*/
const isSuccess = exitIsSuccess;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/fiberMessage.js
/** @internal */
const OP_INTERRUPT_SIGNAL = "InterruptSignal";
/** @internal */
const OP_STATEFUL = "Stateful";
/** @internal */
const OP_RESUME = "Resume";
/** @internal */
const OP_YIELD_NOW = "YieldNow";
/** @internal */
const interruptSignal = (cause) => ({
	_tag: OP_INTERRUPT_SIGNAL,
	cause
});
/** @internal */
const stateful = (onFiber) => ({
	_tag: OP_STATEFUL,
	onFiber
});
/** @internal */
const resume = (effect) => ({
	_tag: OP_RESUME,
	effect
});
/** @internal */
const yieldNow = () => ({ _tag: OP_YIELD_NOW });
/** @internal */
const FiberScopeTypeId = /* @__PURE__ */ Symbol.for("effect/FiberScope");
/** @internal */
var Global = class {
	[FiberScopeTypeId] = FiberScopeTypeId;
	fiberId = none$2;
	roots = /* @__PURE__ */ new Set();
	add(_runtimeFlags, child) {
		this.roots.add(child);
		child.addObserver(() => {
			this.roots.delete(child);
		});
	}
};
/** @internal */
var Local = class {
	fiberId;
	parent;
	[FiberScopeTypeId] = FiberScopeTypeId;
	constructor(fiberId, parent) {
		this.fiberId = fiberId;
		this.parent = parent;
	}
	add(_runtimeFlags, child) {
		this.parent.tell(stateful((parentFiber) => {
			parentFiber.addChild(child);
			child.addObserver(() => {
				parentFiber.removeChild(child);
			});
		}));
	}
};
/** @internal */
const unsafeMake$3 = (fiber) => {
	return new Local(fiber.id(), fiber);
};
/** @internal */
const globalScope = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new Global());
/** @internal */
const FiberTypeId = /* @__PURE__ */ Symbol.for("effect/Fiber");
/** @internal */
const fiberVariance = {
	_E: (_) => _,
	_A: (_) => _
};
/** @internal */
const fiberProto = {
	[FiberTypeId]: fiberVariance,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const RuntimeFiberTypeId = /* @__PURE__ */ Symbol.for("effect/Fiber");
/** @internal */
const join = (self) => zipLeft(flatten$1(self.await), self.inheritAll);
({ ...CommitPrototype }), { ...fiberProto };
/** @internal */
const currentFiberURI = "effect/FiberCurrent";
/** @internal */
const LoggerTypeId = /* @__PURE__ */ Symbol.for("effect/Logger");
const loggerVariance = {
	_Message: (_) => _,
	_Output: (_) => _
};
/** @internal */
const makeLogger = (log) => ({
	[LoggerTypeId]: loggerVariance,
	log,
	pipe() {
		return pipeArguments(this, arguments);
	}
});
/**
* Match strings that do not contain any whitespace characters, double quotes,
* or equal signs.
*
* @internal
*/
const textOnly = /^[^\s"=]*$/;
/**
* Used by both {@link stringLogger} and {@link logfmtLogger} to render a log
* message.
*
* @internal
*/
const format$1 = (quoteValue, whitespace) => ({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
	const formatValue = (value) => value.match(textOnly) ? value : quoteValue(value);
	const format = (label, value) => `${formatLabel(label)}=${formatValue(value)}`;
	const append = (label, value) => " " + format(label, value);
	let out = format("timestamp", date.toISOString());
	out += append("level", logLevel.label);
	out += append("fiber", threadName$1(fiberId));
	const messages = ensure(message);
	for (let i = 0; i < messages.length; i++) out += append("message", toStringUnknown(messages[i], whitespace));
	if (!isEmptyType(cause)) out += append("cause", pretty$1(cause, { renderErrorCause: true }));
	for (const span of spans) out += " " + render(date.getTime())(span);
	for (const [label, value] of annotations) out += append(label, toStringUnknown(value, whitespace));
	return out;
};
/** @internal */
const escapeDoubleQuotes = (s) => `"${s.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
/** @internal */
const stringLogger = /* @__PURE__ */ makeLogger(/* @__PURE__ */ format$1(escapeDoubleQuotes));
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
colors.gray, colors.blue, colors.green, colors.yellow, colors.red, colors.bgBrightRed, colors.black;
const hasProcessStdout = typeof process === "object" && process !== null && typeof process.stdout === "object" && process.stdout !== null;
hasProcessStdout && process.stdout.isTTY;
hasProcessStdout || "Deno" in globalThis;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/metric/boundaries.js
/** @internal */
const MetricBoundariesSymbolKey = "effect/MetricBoundaries";
/** @internal */
const MetricBoundariesTypeId = /* @__PURE__ */ Symbol.for(MetricBoundariesSymbolKey);
/** @internal */
var MetricBoundariesImpl = class {
	values;
	[MetricBoundariesTypeId] = MetricBoundariesTypeId;
	constructor(values) {
		this.values = values;
		this._hash = pipe(string(MetricBoundariesSymbolKey), combine$5(array(this.values)));
	}
	_hash;
	[symbol$1]() {
		return this._hash;
	}
	[symbol](u) {
		return isMetricBoundaries(u) && equals$2(this.values, u.values);
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const isMetricBoundaries = (u) => hasProperty(u, MetricBoundariesTypeId);
/** @internal */
const fromIterable = (iterable) => {
	return new MetricBoundariesImpl(pipe(iterable, appendAll$2(of$1(Number.POSITIVE_INFINITY)), dedupe));
};
/** @internal */
const exponential = (options) => pipe(makeBy(options.count - 1, (i) => options.start * Math.pow(options.factor, i)), unsafeFromArray, fromIterable);
/** @internal */
const MetricKeyTypeTypeId = /* @__PURE__ */ Symbol.for("effect/MetricKeyType");
/** @internal */
const CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
/** @internal */
const CounterKeyTypeTypeId = /* @__PURE__ */ Symbol.for(CounterKeyTypeSymbolKey);
/** @internal */
const FrequencyKeyTypeTypeId = /* @__PURE__ */ Symbol.for("effect/MetricKeyType/Frequency");
/** @internal */
const GaugeKeyTypeTypeId = /* @__PURE__ */ Symbol.for("effect/MetricKeyType/Gauge");
/** @internal */
const HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
/** @internal */
const HistogramKeyTypeTypeId = /* @__PURE__ */ Symbol.for(HistogramKeyTypeSymbolKey);
/** @internal */
const SummaryKeyTypeTypeId = /* @__PURE__ */ Symbol.for("effect/MetricKeyType/Summary");
const metricKeyTypeVariance = {
	_In: (_) => _,
	_Out: (_) => _
};
/** @internal */
var CounterKeyType = class {
	incremental;
	bigint;
	[MetricKeyTypeTypeId] = metricKeyTypeVariance;
	[CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
	constructor(incremental, bigint) {
		this.incremental = incremental;
		this.bigint = bigint;
		this._hash = string(CounterKeyTypeSymbolKey);
	}
	_hash;
	[symbol$1]() {
		return this._hash;
	}
	[symbol](that) {
		return isCounterKey(that);
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
var HistogramKeyType = class {
	boundaries;
	[MetricKeyTypeTypeId] = metricKeyTypeVariance;
	[HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
	constructor(boundaries) {
		this.boundaries = boundaries;
		this._hash = pipe(string(HistogramKeyTypeSymbolKey), combine$5(hash(this.boundaries)));
	}
	_hash;
	[symbol$1]() {
		return this._hash;
	}
	[symbol](that) {
		return isHistogramKey(that) && equals$2(this.boundaries, that.boundaries);
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const counter$4 = (options) => new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false);
/** @internal */
const histogram$4 = (boundaries) => {
	return new HistogramKeyType(boundaries);
};
/** @internal */
const isCounterKey = (u) => hasProperty(u, CounterKeyTypeTypeId);
/** @internal */
const isFrequencyKey = (u) => hasProperty(u, FrequencyKeyTypeTypeId);
/** @internal */
const isGaugeKey = (u) => hasProperty(u, GaugeKeyTypeTypeId);
/** @internal */
const isHistogramKey = (u) => hasProperty(u, HistogramKeyTypeTypeId);
/** @internal */
const isSummaryKey = (u) => hasProperty(u, SummaryKeyTypeTypeId);
/** @internal */
const MetricKeyTypeId = /* @__PURE__ */ Symbol.for("effect/MetricKey");
const metricKeyVariance = { _Type: (_) => _ };
const arrayEquivilence = /* @__PURE__ */ getEquivalence$2(equals$2);
/** @internal */
var MetricKeyImpl = class {
	name;
	keyType;
	description;
	tags;
	[MetricKeyTypeId] = metricKeyVariance;
	constructor(name, keyType, description, tags = []) {
		this.name = name;
		this.keyType = keyType;
		this.description = description;
		this.tags = tags;
		this._hash = pipe(string(this.name + this.description), combine$5(hash(this.keyType)), combine$5(array(this.tags)));
	}
	_hash;
	[symbol$1]() {
		return this._hash;
	}
	[symbol](u) {
		return isMetricKey(u) && this.name === u.name && equals$2(this.keyType, u.keyType) && equals$2(this.description, u.description) && arrayEquivilence(this.tags, u.tags);
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const isMetricKey = (u) => hasProperty(u, MetricKeyTypeId);
/** @internal */
const counter$3 = (name, options) => new MetricKeyImpl(name, counter$4(options), fromNullable(options?.description));
/** @internal */
const histogram$3 = (name, boundaries, description) => new MetricKeyImpl(name, histogram$4(boundaries), fromNullable(description));
/** @internal */
const taggedWithLabels$1 = /* @__PURE__ */ dual(2, (self, extraTags) => extraTags.length === 0 ? self : new MetricKeyImpl(self.name, self.keyType, self.description, union$2(self.tags, extraTags)));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/MutableHashMap.js
const TypeId$2 = /* @__PURE__ */ Symbol.for("effect/MutableHashMap");
const MutableHashMapProto = {
	[TypeId$2]: TypeId$2,
	[Symbol.iterator]() {
		return new MutableHashMapIterator(this);
	},
	toString() {
		return format$4(this.toJSON());
	},
	toJSON() {
		return {
			_id: "MutableHashMap",
			values: Array.from(this).map(toJSON)
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
var MutableHashMapIterator = class MutableHashMapIterator {
	self;
	referentialIterator;
	bucketIterator;
	constructor(self) {
		this.self = self;
		this.referentialIterator = self.referential[Symbol.iterator]();
	}
	next() {
		if (this.bucketIterator !== void 0) return this.bucketIterator.next();
		const result = this.referentialIterator.next();
		if (result.done) {
			this.bucketIterator = new BucketIterator(this.self.buckets.values());
			return this.next();
		}
		return result;
	}
	[Symbol.iterator]() {
		return new MutableHashMapIterator(this.self);
	}
};
var BucketIterator = class {
	backing;
	constructor(backing) {
		this.backing = backing;
	}
	currentBucket;
	next() {
		if (this.currentBucket === void 0) {
			const result = this.backing.next();
			if (result.done) return result;
			this.currentBucket = result.value[Symbol.iterator]();
		}
		const result = this.currentBucket.next();
		if (result.done) {
			this.currentBucket = void 0;
			return this.next();
		}
		return result;
	}
};
/**
* @since 2.0.0
* @category constructors
*/
const empty$1 = () => {
	const self = Object.create(MutableHashMapProto);
	self.referential = /* @__PURE__ */ new Map();
	self.buckets = /* @__PURE__ */ new Map();
	self.bucketsSize = 0;
	return self;
};
/**
* @since 2.0.0
* @category elements
*/
const get = /* @__PURE__ */ dual(2, (self, key) => {
	if (isEqual(key) === false) return self.referential.has(key) ? some(self.referential.get(key)) : none$4();
	const hash = key[symbol$1]();
	const bucket = self.buckets.get(hash);
	if (bucket === void 0) return none$4();
	return getFromBucket(self, bucket, key);
});
const getFromBucket = (self, bucket, key, remove = false) => {
	for (let i = 0, len = bucket.length; i < len; i++) if (key[symbol](bucket[i][0])) {
		const value = bucket[i][1];
		if (remove) {
			bucket.splice(i, 1);
			self.bucketsSize--;
		}
		return some(value);
	}
	return none$4();
};
/**
* @since 2.0.0
* @category elements
*/
const has = /* @__PURE__ */ dual(2, (self, key) => isSome(get(self, key)));
/**
* @since 2.0.0
*/
const set = /* @__PURE__ */ dual(3, (self, key, value) => {
	if (isEqual(key) === false) {
		self.referential.set(key, value);
		return self;
	}
	const hash = key[symbol$1]();
	const bucket = self.buckets.get(hash);
	if (bucket === void 0) {
		self.buckets.set(hash, [[key, value]]);
		self.bucketsSize++;
		return self;
	}
	removeFromBucket(self, bucket, key);
	bucket.push([key, value]);
	self.bucketsSize++;
	return self;
});
const removeFromBucket = (self, bucket, key) => {
	for (let i = 0, len = bucket.length; i < len; i++) if (key[symbol](bucket[i][0])) {
		bucket.splice(i, 1);
		self.bucketsSize--;
		return;
	}
};
/** @internal */
const MetricStateTypeId = /* @__PURE__ */ Symbol.for("effect/MetricState");
/** @internal */
const CounterStateSymbolKey = "effect/MetricState/Counter";
/** @internal */
const CounterStateTypeId = /* @__PURE__ */ Symbol.for(CounterStateSymbolKey);
/** @internal */
const FrequencyStateSymbolKey = "effect/MetricState/Frequency";
/** @internal */
const FrequencyStateTypeId = /* @__PURE__ */ Symbol.for(FrequencyStateSymbolKey);
/** @internal */
const GaugeStateSymbolKey = "effect/MetricState/Gauge";
/** @internal */
const GaugeStateTypeId = /* @__PURE__ */ Symbol.for(GaugeStateSymbolKey);
/** @internal */
const HistogramStateSymbolKey = "effect/MetricState/Histogram";
/** @internal */
const HistogramStateTypeId = /* @__PURE__ */ Symbol.for(HistogramStateSymbolKey);
/** @internal */
const SummaryStateSymbolKey = "effect/MetricState/Summary";
/** @internal */
const SummaryStateTypeId = /* @__PURE__ */ Symbol.for(SummaryStateSymbolKey);
const metricStateVariance = { _A: (_) => _ };
/** @internal */
var CounterState = class {
	count;
	[MetricStateTypeId] = metricStateVariance;
	[CounterStateTypeId] = CounterStateTypeId;
	constructor(count) {
		this.count = count;
	}
	[symbol$1]() {
		return pipe(hash(CounterStateSymbolKey), combine$5(hash(this.count)), cached(this));
	}
	[symbol](that) {
		return isCounterState(that) && this.count === that.count;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const arrayEquals = /* @__PURE__ */ getEquivalence$2(equals$2);
/** @internal */
var FrequencyState = class {
	occurrences;
	[MetricStateTypeId] = metricStateVariance;
	[FrequencyStateTypeId] = FrequencyStateTypeId;
	constructor(occurrences) {
		this.occurrences = occurrences;
	}
	_hash;
	[symbol$1]() {
		return pipe(string(FrequencyStateSymbolKey), combine$5(array(fromIterable$6(this.occurrences.entries()))), cached(this));
	}
	[symbol](that) {
		return isFrequencyState(that) && arrayEquals(fromIterable$6(this.occurrences.entries()), fromIterable$6(that.occurrences.entries()));
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
var GaugeState = class {
	value;
	[MetricStateTypeId] = metricStateVariance;
	[GaugeStateTypeId] = GaugeStateTypeId;
	constructor(value) {
		this.value = value;
	}
	[symbol$1]() {
		return pipe(hash(GaugeStateSymbolKey), combine$5(hash(this.value)), cached(this));
	}
	[symbol](u) {
		return isGaugeState(u) && this.value === u.value;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
var HistogramState = class {
	buckets;
	count;
	min;
	max;
	sum;
	[MetricStateTypeId] = metricStateVariance;
	[HistogramStateTypeId] = HistogramStateTypeId;
	constructor(buckets, count, min, max, sum) {
		this.buckets = buckets;
		this.count = count;
		this.min = min;
		this.max = max;
		this.sum = sum;
	}
	[symbol$1]() {
		return pipe(hash(HistogramStateSymbolKey), combine$5(hash(this.buckets)), combine$5(hash(this.count)), combine$5(hash(this.min)), combine$5(hash(this.max)), combine$5(hash(this.sum)), cached(this));
	}
	[symbol](that) {
		return isHistogramState(that) && equals$2(this.buckets, that.buckets) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
var SummaryState = class {
	error;
	quantiles;
	count;
	min;
	max;
	sum;
	[MetricStateTypeId] = metricStateVariance;
	[SummaryStateTypeId] = SummaryStateTypeId;
	constructor(error, quantiles, count, min, max, sum) {
		this.error = error;
		this.quantiles = quantiles;
		this.count = count;
		this.min = min;
		this.max = max;
		this.sum = sum;
	}
	[symbol$1]() {
		return pipe(hash(SummaryStateSymbolKey), combine$5(hash(this.error)), combine$5(hash(this.quantiles)), combine$5(hash(this.count)), combine$5(hash(this.min)), combine$5(hash(this.max)), combine$5(hash(this.sum)), cached(this));
	}
	[symbol](that) {
		return isSummaryState(that) && this.error === that.error && equals$2(this.quantiles, that.quantiles) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const counter$2 = (count) => new CounterState(count);
/** @internal */
const frequency$1 = (occurrences) => {
	return new FrequencyState(occurrences);
};
/** @internal */
const gauge$1 = (count) => new GaugeState(count);
/** @internal */
const histogram$2 = (options) => new HistogramState(options.buckets, options.count, options.min, options.max, options.sum);
/** @internal */
const summary$1 = (options) => new SummaryState(options.error, options.quantiles, options.count, options.min, options.max, options.sum);
/** @internal */
const isCounterState = (u) => hasProperty(u, CounterStateTypeId);
/**
* @since 2.0.0
* @category refinements
*/
const isFrequencyState = (u) => hasProperty(u, FrequencyStateTypeId);
/**
* @since 2.0.0
* @category refinements
*/
const isGaugeState = (u) => hasProperty(u, GaugeStateTypeId);
/**
* @since 2.0.0
* @category refinements
*/
const isHistogramState = (u) => hasProperty(u, HistogramStateTypeId);
/**
* @since 2.0.0
* @category refinements
*/
const isSummaryState = (u) => hasProperty(u, SummaryStateTypeId);
/** @internal */
const MetricHookTypeId = /* @__PURE__ */ Symbol.for("effect/MetricHook");
const metricHookVariance = {
	_In: (_) => _,
	_Out: (_) => _
};
/** @internal */
const make$5 = (options) => ({
	[MetricHookTypeId]: metricHookVariance,
	pipe() {
		return pipeArguments(this, arguments);
	},
	...options
});
const bigint0 = /* @__PURE__ */ BigInt(0);
/** @internal */
const counter$1 = (key) => {
	let sum = key.keyType.bigint ? bigint0 : 0;
	const canUpdate = key.keyType.incremental ? key.keyType.bigint ? (value) => value >= bigint0 : (value) => value >= 0 : (_value) => true;
	const update = (value) => {
		if (canUpdate(value)) sum = sum + value;
	};
	return make$5({
		get: () => counter$2(sum),
		update,
		modify: update
	});
};
/** @internal */
const frequency = (key) => {
	const values = /* @__PURE__ */ new Map();
	for (const word of key.keyType.preregisteredWords) values.set(word, 0);
	const update = (word) => {
		const slotCount = values.get(word) ?? 0;
		values.set(word, slotCount + 1);
	};
	return make$5({
		get: () => frequency$1(values),
		update,
		modify: update
	});
};
/** @internal */
const gauge = (_key, startAt) => {
	let value = startAt;
	return make$5({
		get: () => gauge$1(value),
		update: (v) => {
			value = v;
		},
		modify: (v) => {
			value = value + v;
		}
	});
};
/** @internal */
const histogram$1 = (key) => {
	const bounds = key.keyType.boundaries.values;
	const size = bounds.length;
	const values = new Uint32Array(size + 1);
	const boundaries = new Float64Array(size);
	let count = 0;
	let sum = 0;
	let min = Number.MAX_VALUE;
	let max = Number.MIN_VALUE;
	pipe(bounds, sort(Order$1), map$5((n, i) => {
		boundaries[i] = n;
	}));
	const update = (value) => {
		let from = 0;
		let to = size;
		while (from !== to) {
			const mid = Math.floor(from + (to - from) / 2);
			if (value <= boundaries[mid]) to = mid;
			else from = mid;
			if (to === from + 1) if (value <= boundaries[from]) to = from;
			else from = to;
		}
		values[from] = values[from] + 1;
		count = count + 1;
		sum = sum + value;
		if (value < min) min = value;
		if (value > max) max = value;
	};
	const getBuckets = () => {
		const builder = allocate(size);
		let cumulated = 0;
		for (let i = 0; i < size; i++) {
			const boundary = boundaries[i];
			const value = values[i];
			cumulated = cumulated + value;
			builder[i] = [boundary, cumulated];
		}
		return builder;
	};
	return make$5({
		get: () => histogram$2({
			buckets: getBuckets(),
			count,
			min,
			max,
			sum
		}),
		update,
		modify: update
	});
};
/** @internal */
const summary = (key) => {
	const { error, maxAge, maxSize, quantiles } = key.keyType;
	const sortedQuantiles = pipe(quantiles, sort(Order$1));
	const values = allocate(maxSize);
	let head = 0;
	let count = 0;
	let sum = 0;
	let min = 0;
	let max = 0;
	const snapshot = (now) => {
		const builder = [];
		let i = 0;
		while (i !== maxSize - 1) {
			const item = values[i];
			if (item != null) {
				const [t, v] = item;
				const age = millis(now - t);
				if (greaterThanOrEqualTo$1(age, zero) && lessThanOrEqualTo$1(age, maxAge)) builder.push(v);
			}
			i = i + 1;
		}
		return calculateQuantiles(error, sortedQuantiles, sort(builder, Order$1));
	};
	const observe = (value, timestamp) => {
		if (maxSize > 0) {
			head = head + 1;
			const target = head % maxSize;
			values[target] = [timestamp, value];
		}
		min = count === 0 ? value : Math.min(min, value);
		max = count === 0 ? value : Math.max(max, value);
		count = count + 1;
		sum = sum + value;
	};
	return make$5({
		get: () => summary$1({
			error,
			quantiles: snapshot(Date.now()),
			count,
			min,
			max,
			sum
		}),
		update: ([value, timestamp]) => observe(value, timestamp),
		modify: ([value, timestamp]) => observe(value, timestamp)
	});
};
/** @internal */
const calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
	const sampleCount = sortedSamples.length;
	if (!isNonEmptyReadonlyArray(sortedQuantiles)) return empty$19();
	const head = sortedQuantiles[0];
	const tail = sortedQuantiles.slice(1);
	const resolvedHead = resolveQuantile(error, sampleCount, none$4(), 0, head, sortedSamples);
	const resolved = of$2(resolvedHead);
	tail.forEach((quantile) => {
		resolved.push(resolveQuantile(error, sampleCount, resolvedHead.value, resolvedHead.consumed, quantile, resolvedHead.rest));
	});
	return map$5(resolved, (rq) => [rq.quantile, rq.value]);
};
/** @internal */
const resolveQuantile = (error, sampleCount, current, consumed, quantile, rest) => {
	let error_1 = error;
	let sampleCount_1 = sampleCount;
	let current_1 = current;
	let consumed_1 = consumed;
	let quantile_1 = quantile;
	let rest_1 = rest;
	let error_2 = error;
	let sampleCount_2 = sampleCount;
	let current_2 = current;
	let consumed_2 = consumed;
	let quantile_2 = quantile;
	let rest_2 = rest;
	while (1) {
		if (!isNonEmptyReadonlyArray(rest_1)) return {
			quantile: quantile_1,
			value: none$4(),
			consumed: consumed_1,
			rest: []
		};
		if (quantile_1 === 1) return {
			quantile: quantile_1,
			value: some(lastNonEmpty(rest_1)),
			consumed: consumed_1 + rest_1.length,
			rest: []
		};
		const headValue = headNonEmpty$1(rest_1);
		const sameHead = span(rest_1, (n) => n === headValue);
		const desired = quantile_1 * sampleCount_1;
		const allowedError = error_1 / 2 * desired;
		const candConsumed = consumed_1 + sameHead[0].length;
		const candError = Math.abs(candConsumed - desired);
		if (candConsumed < desired - allowedError) {
			error_2 = error_1;
			sampleCount_2 = sampleCount_1;
			current_2 = head(rest_1);
			consumed_2 = candConsumed;
			quantile_2 = quantile_1;
			rest_2 = sameHead[1];
			error_1 = error_2;
			sampleCount_1 = sampleCount_2;
			current_1 = current_2;
			consumed_1 = consumed_2;
			quantile_1 = quantile_2;
			rest_1 = rest_2;
			continue;
		}
		if (candConsumed > desired + allowedError) {
			const valueToReturn = isNone(current_1) ? some(headValue) : current_1;
			return {
				quantile: quantile_1,
				value: valueToReturn,
				consumed: consumed_1,
				rest: rest_1
			};
		}
		switch (current_1._tag) {
			case "None":
				error_2 = error_1;
				sampleCount_2 = sampleCount_1;
				current_2 = head(rest_1);
				consumed_2 = candConsumed;
				quantile_2 = quantile_1;
				rest_2 = sameHead[1];
				error_1 = error_2;
				sampleCount_1 = sampleCount_2;
				current_1 = current_2;
				consumed_1 = consumed_2;
				quantile_1 = quantile_2;
				rest_1 = rest_2;
				continue;
			case "Some":
				if (candError < Math.abs(desired - current_1.value)) {
					error_2 = error_1;
					sampleCount_2 = sampleCount_1;
					current_2 = head(rest_1);
					consumed_2 = candConsumed;
					quantile_2 = quantile_1;
					rest_2 = sameHead[1];
					error_1 = error_2;
					sampleCount_1 = sampleCount_2;
					current_1 = current_2;
					consumed_1 = consumed_2;
					quantile_1 = quantile_2;
					rest_1 = rest_2;
					continue;
				}
				return {
					quantile: quantile_1,
					value: some(current_1.value),
					consumed: consumed_1,
					rest: rest_1
				};
		}
	}
	throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
};
/** @internal */
const MetricPairTypeId = /* @__PURE__ */ Symbol.for("effect/MetricPair");
const metricPairVariance = { _Type: (_) => _ };
/** @internal */
const unsafeMake$2 = (metricKey, metricState) => {
	return {
		[MetricPairTypeId]: metricPairVariance,
		metricKey,
		metricState,
		pipe() {
			return pipeArguments(this, arguments);
		}
	};
};
/** @internal */
const MetricRegistryTypeId = /* @__PURE__ */ Symbol.for("effect/MetricRegistry");
/** @internal */
var MetricRegistryImpl = class {
	[MetricRegistryTypeId] = MetricRegistryTypeId;
	map = /* @__PURE__ */ empty$1();
	snapshot() {
		const result = [];
		for (const [key, hook] of this.map) result.push(unsafeMake$2(key, hook.get()));
		return result;
	}
	get(key) {
		const hook = pipe(this.map, get(key), getOrUndefined);
		if (hook == null) {
			if (isCounterKey(key.keyType)) return this.getCounter(key);
			if (isGaugeKey(key.keyType)) return this.getGauge(key);
			if (isFrequencyKey(key.keyType)) return this.getFrequency(key);
			if (isHistogramKey(key.keyType)) return this.getHistogram(key);
			if (isSummaryKey(key.keyType)) return this.getSummary(key);
			throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
		} else return hook;
	}
	getCounter(key) {
		let value = pipe(this.map, get(key), getOrUndefined);
		if (value == null) {
			const counter = counter$1(key);
			if (!pipe(this.map, has(key))) pipe(this.map, set(key, counter));
			value = counter;
		}
		return value;
	}
	getFrequency(key) {
		let value = pipe(this.map, get(key), getOrUndefined);
		if (value == null) {
			const frequency$2 = frequency(key);
			if (!pipe(this.map, has(key))) pipe(this.map, set(key, frequency$2));
			value = frequency$2;
		}
		return value;
	}
	getGauge(key) {
		let value = pipe(this.map, get(key), getOrUndefined);
		if (value == null) {
			const gauge$2 = gauge(key, key.keyType.bigint ? BigInt(0) : 0);
			if (!pipe(this.map, has(key))) pipe(this.map, set(key, gauge$2));
			value = gauge$2;
		}
		return value;
	}
	getHistogram(key) {
		let value = pipe(this.map, get(key), getOrUndefined);
		if (value == null) {
			const histogram = histogram$1(key);
			if (!pipe(this.map, has(key))) pipe(this.map, set(key, histogram));
			value = histogram;
		}
		return value;
	}
	getSummary(key) {
		let value = pipe(this.map, get(key), getOrUndefined);
		if (value == null) {
			const summary$2 = summary(key);
			if (!pipe(this.map, has(key))) pipe(this.map, set(key, summary$2));
			value = summary$2;
		}
		return value;
	}
};
/** @internal */
const make$4 = () => {
	return new MetricRegistryImpl();
};
/** @internal */
const MetricTypeId = /* @__PURE__ */ Symbol.for("effect/Metric");
const metricVariance = {
	_Type: (_) => _,
	_In: (_) => _,
	_Out: (_) => _
};
/** @internal */
const globalMetricRegistry = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => make$4());
/** @internal */
const make$3 = function(keyType, unsafeUpdate, unsafeValue, unsafeModify) {
	const metric = Object.assign((effect) => tap(effect, (a) => update(metric, a)), {
		[MetricTypeId]: metricVariance,
		keyType,
		unsafeUpdate,
		unsafeValue,
		unsafeModify,
		register() {
			this.unsafeValue([]);
			return this;
		},
		pipe() {
			return pipeArguments(this, arguments);
		}
	});
	return metric;
};
/** @internal */
const counter = (name, options) => fromMetricKey(counter$3(name, options));
/** @internal */
const fromMetricKey = (key) => {
	let untaggedHook;
	const hookCache = /* @__PURE__ */ new WeakMap();
	const hook = (extraTags) => {
		if (extraTags.length === 0) {
			if (untaggedHook !== void 0) return untaggedHook;
			untaggedHook = globalMetricRegistry.get(key);
			return untaggedHook;
		}
		let hook = hookCache.get(extraTags);
		if (hook !== void 0) return hook;
		hook = globalMetricRegistry.get(taggedWithLabels$1(key, extraTags));
		hookCache.set(extraTags, hook);
		return hook;
	};
	return make$3(key.keyType, (input, extraTags) => hook(extraTags).update(input), (extraTags) => hook(extraTags).get(), (input, extraTags) => hook(extraTags).modify(input));
};
/** @internal */
const histogram = (name, boundaries, description) => fromMetricKey(histogram$3(name, boundaries, description));
/** @internal */
const tagged = /* @__PURE__ */ dual(3, (self, key, value) => taggedWithLabels(self, [make$6(key, value)]));
/** @internal */
const taggedWithLabels = /* @__PURE__ */ dual(2, (self, extraTags) => {
	return make$3(self.keyType, (input, extraTags1) => self.unsafeUpdate(input, union$2(extraTags, extraTags1)), (extraTags1) => self.unsafeValue(union$2(extraTags, extraTags1)), (input, extraTags1) => self.unsafeModify(input, union$2(extraTags, extraTags1)));
});
const update = /* @__PURE__ */ dual(2, (self, input) => fiberRefGetWith(currentMetricLabels, (tags) => sync(() => self.unsafeUpdate(input, tags))));
({ ...StructuralPrototype });
/** @internal */
const complete = /* @__PURE__ */ dual(2, (self, result) => fiberRefGetWith(currentRequestMap, (map) => sync(() => {
	if (map.has(self)) {
		const entry = map.get(self);
		if (!entry.state.completed) {
			entry.state.completed = true;
			deferredUnsafeDone(entry.result, result);
		}
	}
})));
/** @internal */
const SupervisorTypeId = /* @__PURE__ */ Symbol.for("effect/Supervisor");
/** @internal */
const supervisorVariance = { _T: (_) => _ };
/** @internal */
var ProxySupervisor = class ProxySupervisor {
	underlying;
	value0;
	[SupervisorTypeId] = supervisorVariance;
	constructor(underlying, value0) {
		this.underlying = underlying;
		this.value0 = value0;
	}
	get value() {
		return this.value0;
	}
	onStart(context, effect, parent, fiber) {
		this.underlying.onStart(context, effect, parent, fiber);
	}
	onEnd(value, fiber) {
		this.underlying.onEnd(value, fiber);
	}
	onEffect(fiber, effect) {
		this.underlying.onEffect(fiber, effect);
	}
	onSuspend(fiber) {
		this.underlying.onSuspend(fiber);
	}
	onResume(fiber) {
		this.underlying.onResume(fiber);
	}
	map(f) {
		return new ProxySupervisor(this, pipe(this.value, map$2(f)));
	}
	zip(right) {
		return new Zip(this, right);
	}
};
/** @internal */
var Zip = class Zip {
	left;
	right;
	_tag = "Zip";
	[SupervisorTypeId] = supervisorVariance;
	constructor(left, right) {
		this.left = left;
		this.right = right;
	}
	get value() {
		return zip(this.left.value, this.right.value);
	}
	onStart(context, effect, parent, fiber) {
		this.left.onStart(context, effect, parent, fiber);
		this.right.onStart(context, effect, parent, fiber);
	}
	onEnd(value, fiber) {
		this.left.onEnd(value, fiber);
		this.right.onEnd(value, fiber);
	}
	onEffect(fiber, effect) {
		this.left.onEffect(fiber, effect);
		this.right.onEffect(fiber, effect);
	}
	onSuspend(fiber) {
		this.left.onSuspend(fiber);
		this.right.onSuspend(fiber);
	}
	onResume(fiber) {
		this.left.onResume(fiber);
		this.right.onResume(fiber);
	}
	map(f) {
		return new ProxySupervisor(this, pipe(this.value, map$2(f)));
	}
	zip(right) {
		return new Zip(this, right);
	}
};
/** @internal */
const isZip = (self) => hasProperty(self, SupervisorTypeId) && isTagged(self, "Zip");
/** @internal */
var Const = class {
	effect;
	[SupervisorTypeId] = supervisorVariance;
	constructor(effect) {
		this.effect = effect;
	}
	get value() {
		return this.effect;
	}
	onStart(_context, _effect, _parent, _fiber) {}
	onEnd(_value, _fiber) {}
	onEffect(_fiber, _effect) {}
	onSuspend(_fiber) {}
	onResume(_fiber) {}
	map(f) {
		return new ProxySupervisor(this, pipe(this.value, map$2(f)));
	}
	zip(right) {
		return new Zip(this, right);
	}
	onRun(execution, _fiber) {
		return execution();
	}
};
/** @internal */
const fromEffect = (effect) => {
	return new Const(effect);
};
/** @internal */
const none = /* @__PURE__ */ globalValue("effect/Supervisor/none", () => fromEffect(void_$1));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Differ.js
/**
* Constructs a new `Differ`.
*
* @since 2.0.0
* @category constructors
*/
const make$2 = make$13;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/supervisor/patch.js
/** @internal */
const OP_EMPTY = "Empty";
/** @internal */
const OP_ADD_SUPERVISOR = "AddSupervisor";
/** @internal */
const OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
/** @internal */
const OP_AND_THEN = "AndThen";
/**
* The empty `SupervisorPatch`.
*
* @internal
*/
const empty = { _tag: OP_EMPTY };
/**
* Combines two patches to produce a new patch that describes applying the
* updates from this patch and then the updates from the specified patch.
*
* @internal
*/
const combine = (self, that) => {
	return {
		_tag: OP_AND_THEN,
		first: self,
		second: that
	};
};
/**
* Applies a `SupervisorPatch` to a `Supervisor` to produce a new `Supervisor`.
*
* @internal
*/
const patch = (self, supervisor) => {
	return patchLoop(supervisor, of$1(self));
};
/** @internal */
const patchLoop = (_supervisor, _patches) => {
	let supervisor = _supervisor;
	let patches = _patches;
	while (isNonEmpty$2(patches)) {
		const head = headNonEmpty(patches);
		switch (head._tag) {
			case OP_EMPTY:
				patches = tailNonEmpty(patches);
				break;
			case OP_ADD_SUPERVISOR:
				supervisor = supervisor.zip(head.supervisor);
				patches = tailNonEmpty(patches);
				break;
			case OP_REMOVE_SUPERVISOR:
				supervisor = removeSupervisor(supervisor, head.supervisor);
				patches = tailNonEmpty(patches);
				break;
			case OP_AND_THEN:
				patches = prepend$1(head.first)(prepend$1(head.second)(tailNonEmpty(patches)));
				break;
		}
	}
	return supervisor;
};
/** @internal */
const removeSupervisor = (self, that) => {
	if (equals$2(self, that)) return none;
	else if (isZip(self)) return removeSupervisor(self.left, that).zip(removeSupervisor(self.right, that));
	else return self;
};
/** @internal */
const toSet = (self) => {
	if (equals$2(self, none)) return empty$15();
	else if (isZip(self)) return pipe(toSet(self.left), union(toSet(self.right)));
	else return make$18(self);
};
/** @internal */
const diff = (oldValue, newValue) => {
	if (equals$2(oldValue, newValue)) return empty;
	const oldSupervisors = toSet(oldValue);
	const newSupervisors = toSet(newValue);
	return combine(pipe(newSupervisors, difference(oldSupervisors), reduce$3(empty, (patch, supervisor) => combine(patch, {
		_tag: OP_ADD_SUPERVISOR,
		supervisor
	}))), pipe(oldSupervisors, difference(newSupervisors), reduce$3(empty, (patch, supervisor) => combine(patch, {
		_tag: OP_REMOVE_SUPERVISOR,
		supervisor
	}))));
};
/** @internal */
const differ = /* @__PURE__ */ make$2({
	empty,
	patch,
	combine,
	diff
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/fiberRuntime.js
/** @internal */
const fiberStarted = /* @__PURE__ */ counter("effect_fiber_started", { incremental: true });
/** @internal */
const fiberActive = /* @__PURE__ */ counter("effect_fiber_active");
/** @internal */
const fiberSuccesses = /* @__PURE__ */ counter("effect_fiber_successes", { incremental: true });
/** @internal */
const fiberFailures = /* @__PURE__ */ counter("effect_fiber_failures", { incremental: true });
/** @internal */
const fiberLifetimes = /* @__PURE__ */ tagged(/* @__PURE__ */ histogram("effect_fiber_lifetimes", /* @__PURE__ */ exponential({
	start: .5,
	factor: 2,
	count: 35
})), "time_unit", "milliseconds");
/** @internal */
const EvaluationSignalContinue = "Continue";
/** @internal */
const EvaluationSignalDone = "Done";
/** @internal */
const EvaluationSignalYieldNow = "Yield";
const runtimeFiberVariance = {
	_E: (_) => _,
	_A: (_) => _
};
const absurd = (_) => {
	throw new Error(`BUG: FiberRuntime - ${toStringUnknown(_)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
};
const YieldedOp = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp");
const yieldedOpChannel = /* @__PURE__ */ globalValue("effect/internal/fiberRuntime/yieldedOpChannel", () => ({ currentOp: null }));
const contOpSuccess = {
	[OP_ON_SUCCESS]: (_, cont, value) => {
		return internalCall(() => cont.effect_instruction_i1(value));
	},
	["OnStep"]: (_, _cont, value) => {
		return exitSucceed$1(exitSucceed$1(value));
	},
	[OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) => {
		return internalCall(() => cont.effect_instruction_i2(value));
	},
	[OP_REVERT_FLAGS]: (self, cont, value) => {
		self.patchRuntimeFlags(self.currentRuntimeFlags, cont.patch);
		if (interruptible$2(self.currentRuntimeFlags) && self.isInterrupted()) return exitFailCause$1(self.getInterruptedCause());
		else return exitSucceed$1(value);
	},
	[OP_WHILE]: (self, cont, value) => {
		internalCall(() => cont.effect_instruction_i2(value));
		if (internalCall(() => cont.effect_instruction_i0())) {
			self.pushStack(cont);
			return internalCall(() => cont.effect_instruction_i1());
		} else return void_$1;
	},
	[OP_ITERATOR]: (self, cont, value) => {
		while (true) {
			const state = internalCall(() => cont.effect_instruction_i0.next(value));
			if (state.done) return exitSucceed$1(state.value);
			const primitive = yieldWrapGet(state.value);
			if (!exitIsExit(primitive)) {
				self.pushStack(cont);
				return primitive;
			} else if (primitive._tag === "Failure") return primitive;
			value = primitive.value;
		}
	}
};
const drainQueueWhileRunningTable = {
	[OP_INTERRUPT_SIGNAL]: (self, runtimeFlags, cur, message) => {
		self.processNewInterruptSignal(message.cause);
		return interruptible$2(runtimeFlags) ? exitFailCause$1(message.cause) : cur;
	},
	[OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
		throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
	},
	[OP_STATEFUL]: (self, runtimeFlags, cur, message) => {
		message.onFiber(self, running(runtimeFlags));
		return cur;
	},
	[OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) => {
		return flatMap$3(yieldNow$2(), () => cur);
	}
};
/**
* Executes all requests, submitting requests to each data source in parallel.
*/
const runBlockedRequests = (self) => forEachSequentialDiscard(flatten$2(self), (requestsByRequestResolver) => forEachConcurrentDiscard(sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential]) => {
	const map = /* @__PURE__ */ new Map();
	const arr = [];
	for (const block of sequential) {
		arr.push(toReadonlyArray(block));
		for (const entry of block) map.set(entry.request, entry);
	}
	const flat = arr.flat();
	return fiberRefLocally(invokeWithInterrupt(dataSource.runAll(arr), flat, () => flat.forEach((entry) => {
		entry.listeners.interrupted = true;
	})), currentRequestMap, map);
}, false, false));
const _version = /* @__PURE__ */ getCurrentVersion();
/** @internal */
var FiberRuntime = class extends Class {
	[FiberTypeId] = fiberVariance;
	[RuntimeFiberTypeId] = runtimeFiberVariance;
	_fiberRefs;
	_fiberId;
	_queue = /* @__PURE__ */ new Array();
	_children = null;
	_observers = /* @__PURE__ */ new Array();
	_running = false;
	_stack = [];
	_asyncInterruptor = null;
	_asyncBlockingOn = null;
	_exitValue = null;
	_steps = [];
	_isYielding = false;
	currentRuntimeFlags;
	currentOpCount = 0;
	currentSupervisor;
	currentScheduler;
	currentTracer;
	currentSpan;
	currentContext;
	currentDefaultServices;
	constructor(fiberId, fiberRefs0, runtimeFlags0) {
		super();
		this.currentRuntimeFlags = runtimeFlags0;
		this._fiberId = fiberId;
		this._fiberRefs = fiberRefs0;
		if (runtimeMetrics(runtimeFlags0)) {
			const tags = this.getFiberRef(currentMetricLabels);
			fiberStarted.unsafeUpdate(1, tags);
			fiberActive.unsafeUpdate(1, tags);
		}
		this.refreshRefCache();
	}
	commit() {
		return join(this);
	}
	/**
	* The identity of the fiber.
	*/
	id() {
		return this._fiberId;
	}
	/**
	* Begins execution of the effect associated with this fiber on in the
	* background. This can be called to "kick off" execution of a fiber after
	* it has been created.
	*/
	resume(effect) {
		this.tell(resume(effect));
	}
	/**
	* The status of the fiber.
	*/
	get status() {
		return this.ask((_, status) => status);
	}
	/**
	* Gets the fiber runtime flags.
	*/
	get runtimeFlags() {
		return this.ask((state, status) => {
			if (isDone(status)) return state.currentRuntimeFlags;
			return status.runtimeFlags;
		});
	}
	/**
	* Returns the current `FiberScope` for the fiber.
	*/
	scope() {
		return unsafeMake$3(this);
	}
	/**
	* Retrieves the immediate children of the fiber.
	*/
	get children() {
		return this.ask((fiber) => Array.from(fiber.getChildren()));
	}
	/**
	* Gets the fiber's set of children.
	*/
	getChildren() {
		if (this._children === null) this._children = /* @__PURE__ */ new Set();
		return this._children;
	}
	/**
	* Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
	* if the fiber has not been interrupted.
	*
	* **NOTE**: This method is safe to invoke on any fiber, but if not invoked
	* on this fiber, then values derived from the fiber's state (including the
	* log annotations and log level) may not be up-to-date.
	*/
	getInterruptedCause() {
		return this.getFiberRef(currentInterruptedCause);
	}
	/**
	* Retrieves the whole set of fiber refs.
	*/
	fiberRefs() {
		return this.ask((fiber) => fiber.getFiberRefs());
	}
	/**
	* Returns an effect that will contain information computed from the fiber
	* state and status while running on the fiber.
	*
	* This allows the outside world to interact safely with mutable fiber state
	* without locks or immutable data.
	*/
	ask(f) {
		return suspend$2(() => {
			const deferred = deferredUnsafeMake(this._fiberId);
			this.tell(stateful((fiber, status) => {
				deferredUnsafeDone(deferred, sync(() => f(fiber, status)));
			}));
			return deferredAwait(deferred);
		});
	}
	/**
	* Adds a message to be processed by the fiber on the fiber.
	*/
	tell(message) {
		this._queue.push(message);
		if (!this._running) {
			this._running = true;
			this.drainQueueLaterOnExecutor();
		}
	}
	get await() {
		return async_((resume) => {
			const cb = (exit) => resume(succeed$2(exit));
			if (this._exitValue !== null) {
				cb(this._exitValue);
				return;
			}
			this.tell(stateful((fiber, _) => {
				if (fiber._exitValue !== null) cb(this._exitValue);
				else fiber.addObserver(cb);
			}));
			return sync(() => this.tell(stateful((fiber, _) => {
				fiber.removeObserver(cb);
			})));
		}, this.id());
	}
	get inheritAll() {
		return withFiberRuntime((parentFiber, parentStatus) => {
			const parentFiberId = parentFiber.id();
			const parentFiberRefs = parentFiber.getFiberRefs();
			const parentRuntimeFlags = parentStatus.runtimeFlags;
			const updatedFiberRefs = joinAs(parentFiberRefs, parentFiberId, this.getFiberRefs());
			parentFiber.setFiberRefs(updatedFiberRefs);
			return updateRuntimeFlags(pipe(diff$3(parentRuntimeFlags, parentFiber.getFiberRef(currentRuntimeFlags)), exclude(1), exclude(16)));
		});
	}
	/**
	* Tentatively observes the fiber, but returns immediately if it is not
	* already done.
	*/
	get poll() {
		return sync(() => fromNullable(this._exitValue));
	}
	/**
	* Unsafely observes the fiber, but returns immediately if it is not
	* already done.
	*/
	unsafePoll() {
		return this._exitValue;
	}
	/**
	* In the background, interrupts the fiber as if interrupted from the specified fiber.
	*/
	interruptAsFork(fiberId) {
		return sync(() => this.tell(interruptSignal(interrupt(fiberId))));
	}
	/**
	* In the background, interrupts the fiber as if interrupted from the specified fiber.
	*/
	unsafeInterruptAsFork(fiberId) {
		this.tell(interruptSignal(interrupt(fiberId)));
	}
	/**
	* Adds an observer to the list of observers.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	addObserver(observer) {
		if (this._exitValue !== null) observer(this._exitValue);
		else this._observers.push(observer);
	}
	/**
	* Removes the specified observer from the list of observers that will be
	* notified when the fiber exits.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	removeObserver(observer) {
		this._observers = this._observers.filter((o) => o !== observer);
	}
	/**
	* Retrieves all fiber refs of the fiber.
	*
	* **NOTE**: This method is safe to invoke on any fiber, but if not invoked
	* on this fiber, then values derived from the fiber's state (including the
	* log annotations and log level) may not be up-to-date.
	*/
	getFiberRefs() {
		this.setFiberRef(currentRuntimeFlags, this.currentRuntimeFlags);
		return this._fiberRefs;
	}
	/**
	* Deletes the specified fiber ref.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	unsafeDeleteFiberRef(fiberRef) {
		this._fiberRefs = delete_(this._fiberRefs, fiberRef);
	}
	/**
	* Retrieves the state of the fiber ref, or else its initial value.
	*
	* **NOTE**: This method is safe to invoke on any fiber, but if not invoked
	* on this fiber, then values derived from the fiber's state (including the
	* log annotations and log level) may not be up-to-date.
	*/
	getFiberRef(fiberRef) {
		if (this._fiberRefs.locals.has(fiberRef)) return this._fiberRefs.locals.get(fiberRef)[0][1];
		return fiberRef.initial;
	}
	/**
	* Sets the fiber ref to the specified value.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	setFiberRef(fiberRef, value) {
		this._fiberRefs = updateAs(this._fiberRefs, {
			fiberId: this._fiberId,
			fiberRef,
			value
		});
		this.refreshRefCache();
	}
	refreshRefCache() {
		this.currentDefaultServices = this.getFiberRef(currentServices);
		this.currentTracer = this.currentDefaultServices.unsafeMap.get(tracerTag.key);
		this.currentSupervisor = this.getFiberRef(currentSupervisor);
		this.currentScheduler = this.getFiberRef(currentScheduler);
		this.currentContext = this.getFiberRef(currentContext);
		this.currentSpan = this.currentContext.unsafeMap.get(spanTag.key);
	}
	/**
	* Wholesale replaces all fiber refs of this fiber.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	setFiberRefs(fiberRefs) {
		this._fiberRefs = fiberRefs;
		this.refreshRefCache();
	}
	/**
	* Adds a reference to the specified fiber inside the children set.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	addChild(child) {
		this.getChildren().add(child);
	}
	/**
	* Removes a reference to the specified fiber inside the children set.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	removeChild(child) {
		this.getChildren().delete(child);
	}
	/**
	* Transfers all children of this fiber that are currently running to the
	* specified fiber scope.
	*
	* **NOTE**: This method must be invoked by the fiber itself after it has
	* evaluated the effects but prior to exiting.
	*/
	transferChildren(scope) {
		const children = this._children;
		this._children = null;
		if (children !== null && children.size > 0) {
			for (const child of children) if (child._exitValue === null) scope.add(this.currentRuntimeFlags, child);
		}
	}
	/**
	* On the current thread, executes all messages in the fiber's inbox. This
	* method may return before all work is done, in the event the fiber executes
	* an asynchronous operation.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	drainQueueOnCurrentThread() {
		let recurse = true;
		while (recurse) {
			let evaluationSignal = EvaluationSignalContinue;
			const prev = globalThis[currentFiberURI];
			globalThis[currentFiberURI] = this;
			try {
				while (evaluationSignal === EvaluationSignalContinue) evaluationSignal = this._queue.length === 0 ? EvaluationSignalDone : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
			} finally {
				this._running = false;
				globalThis[currentFiberURI] = prev;
			}
			if (this._queue.length > 0 && !this._running) {
				this._running = true;
				if (evaluationSignal === EvaluationSignalYieldNow) {
					this.drainQueueLaterOnExecutor();
					recurse = false;
				} else recurse = true;
			} else recurse = false;
		}
	}
	/**
	* Schedules the execution of all messages in the fiber's inbox.
	*
	* This method will return immediately after the scheduling
	* operation is completed, but potentially before such messages have been
	* executed.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	drainQueueLaterOnExecutor() {
		this.currentScheduler.scheduleTask(this.run, this.getFiberRef(currentSchedulingPriority), this);
	}
	/**
	* Drains the fiber's message queue while the fiber is actively running,
	* returning the next effect to execute, which may be the input effect if no
	* additional effect needs to be executed.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	drainQueueWhileRunning(runtimeFlags, cur0) {
		let cur = cur0;
		while (this._queue.length > 0) {
			const message = this._queue.splice(0, 1)[0];
			cur = drainQueueWhileRunningTable[message._tag](this, runtimeFlags, cur, message);
		}
		return cur;
	}
	/**
	* Determines if the fiber is interrupted.
	*
	* **NOTE**: This method is safe to invoke on any fiber, but if not invoked
	* on this fiber, then values derived from the fiber's state (including the
	* log annotations and log level) may not be up-to-date.
	*/
	isInterrupted() {
		return !isEmpty$1(this.getFiberRef(currentInterruptedCause));
	}
	/**
	* Adds an interruptor to the set of interruptors that are interrupting this
	* fiber.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	addInterruptedCause(cause) {
		const oldSC = this.getFiberRef(currentInterruptedCause);
		this.setFiberRef(currentInterruptedCause, sequential$2(oldSC, cause));
	}
	/**
	* Processes a new incoming interrupt signal.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	processNewInterruptSignal(cause) {
		this.addInterruptedCause(cause);
		this.sendInterruptSignalToAllChildren();
	}
	/**
	* Interrupts all children of the current fiber, returning an effect that will
	* await the exit of the children. This method will return null if the fiber
	* has no children.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	sendInterruptSignalToAllChildren() {
		if (this._children === null || this._children.size === 0) return false;
		let told = false;
		for (const child of this._children) {
			child.tell(interruptSignal(interrupt(this.id())));
			told = true;
		}
		return told;
	}
	/**
	* Interrupts all children of the current fiber, returning an effect that will
	* await the exit of the children. This method will return null if the fiber
	* has no children.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	interruptAllChildren() {
		if (this.sendInterruptSignalToAllChildren()) {
			const it = this._children.values();
			this._children = null;
			let isDone = false;
			const body = () => {
				const next = it.next();
				if (!next.done) return asVoid(next.value.await);
				else return sync(() => {
					isDone = true;
				});
			};
			return whileLoop({
				while: () => !isDone,
				body,
				step: () => {}
			});
		}
		return null;
	}
	reportExitValue(exit) {
		if (runtimeMetrics(this.currentRuntimeFlags)) {
			const tags = this.getFiberRef(currentMetricLabels);
			const startTimeMillis = this.id().startTimeMillis;
			const endTimeMillis = Date.now();
			fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
			fiberActive.unsafeUpdate(-1, tags);
			switch (exit._tag) {
				case OP_SUCCESS:
					fiberSuccesses.unsafeUpdate(1, tags);
					break;
				case OP_FAILURE:
					fiberFailures.unsafeUpdate(1, tags);
					break;
			}
		}
		if (exit._tag === "Failure") {
			const level = this.getFiberRef(currentUnhandledErrorLogLevel);
			if (!isInterruptedOnly(exit.cause) && level._tag === "Some") this.log("Fiber terminated with an unhandled error", exit.cause, level);
		}
	}
	setExitValue(exit) {
		this._exitValue = exit;
		this.reportExitValue(exit);
		for (let i = this._observers.length - 1; i >= 0; i--) this._observers[i](exit);
		this._observers = [];
	}
	getLoggers() {
		return this.getFiberRef(currentLoggers);
	}
	log(message, cause, overrideLogLevel) {
		const logLevel = isSome(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(currentLogLevel);
		if (greaterThan$1(this.getFiberRef(currentMinimumLogLevel), logLevel)) return;
		const spans = this.getFiberRef(currentLogSpan);
		const annotations = this.getFiberRef(currentLogAnnotations);
		const loggers = this.getLoggers();
		const contextMap = this.getFiberRefs();
		if (size(loggers) > 0) {
			const clockService = get$4(this.getFiberRef(currentServices), clockTag);
			const date = new Date(clockService.unsafeCurrentTimeMillis());
			withRedactableContext(contextMap, () => {
				for (const logger of loggers) logger.log({
					fiberId: this.id(),
					logLevel,
					message,
					cause,
					context: contextMap,
					spans,
					annotations,
					date
				});
			});
		}
	}
	/**
	* Evaluates a single message on the current thread, while the fiber is
	* suspended. This method should only be called while evaluation of the
	* fiber's effect is suspended due to an asynchronous operation.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	evaluateMessageWhileSuspended(message) {
		switch (message._tag) {
			case OP_YIELD_NOW: return EvaluationSignalYieldNow;
			case OP_INTERRUPT_SIGNAL:
				this.processNewInterruptSignal(message.cause);
				if (this._asyncInterruptor !== null) {
					this._asyncInterruptor(exitFailCause$1(message.cause));
					this._asyncInterruptor = null;
				}
				return EvaluationSignalContinue;
			case OP_RESUME:
				this._asyncInterruptor = null;
				this._asyncBlockingOn = null;
				this.evaluateEffect(message.effect);
				return EvaluationSignalContinue;
			case OP_STATEFUL:
				message.onFiber(this, this._exitValue !== null ? done : suspended(this.currentRuntimeFlags, this._asyncBlockingOn));
				return EvaluationSignalContinue;
			default: return absurd(message);
		}
	}
	/**
	* Evaluates an effect until completion, potentially asynchronously.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	evaluateEffect(effect0) {
		this.currentSupervisor.onResume(this);
		try {
			let effect = interruptible$2(this.currentRuntimeFlags) && this.isInterrupted() ? exitFailCause$1(this.getInterruptedCause()) : effect0;
			while (effect !== null) {
				const eff = effect;
				const exit = this.runLoop(eff);
				if (exit === YieldedOp) {
					const op = yieldedOpChannel.currentOp;
					yieldedOpChannel.currentOp = null;
					if (op._op === "Yield") if (cooperativeYielding(this.currentRuntimeFlags)) {
						this.tell(yieldNow());
						this.tell(resume(exitVoid$1));
						effect = null;
					} else effect = exitVoid$1;
					else if (op._op === "Async") effect = null;
				} else {
					this.currentRuntimeFlags = pipe(this.currentRuntimeFlags, enable$1(16));
					const interruption = this.interruptAllChildren();
					if (interruption !== null) effect = flatMap$3(interruption, () => exit);
					else {
						if (this._queue.length === 0) this.setExitValue(exit);
						else this.tell(resume(exit));
						effect = null;
					}
				}
			}
		} finally {
			this.currentSupervisor.onSuspend(this);
		}
	}
	/**
	* Begins execution of the effect associated with this fiber on the current
	* thread. This can be called to "kick off" execution of a fiber after it has
	* been created, in hopes that the effect can be executed synchronously.
	*
	* This is not the normal way of starting a fiber, but it is useful when the
	* express goal of executing the fiber is to synchronously produce its exit.
	*/
	start(effect) {
		if (!this._running) {
			this._running = true;
			const prev = globalThis[currentFiberURI];
			globalThis[currentFiberURI] = this;
			try {
				this.evaluateEffect(effect);
			} finally {
				this._running = false;
				globalThis[currentFiberURI] = prev;
				if (this._queue.length > 0) this.drainQueueLaterOnExecutor();
			}
		} else this.tell(resume(effect));
	}
	/**
	* Begins execution of the effect associated with this fiber on in the
	* background, and on the correct thread pool. This can be called to "kick
	* off" execution of a fiber after it has been created, in hopes that the
	* effect can be executed synchronously.
	*/
	startFork(effect) {
		this.tell(resume(effect));
	}
	/**
	* Takes the current runtime flags, patches them to return the new runtime
	* flags, and then makes any changes necessary to fiber state based on the
	* specified patch.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	patchRuntimeFlags(oldRuntimeFlags, patch) {
		const newRuntimeFlags = patch$4(oldRuntimeFlags, patch);
		globalThis[currentFiberURI] = this;
		this.currentRuntimeFlags = newRuntimeFlags;
		return newRuntimeFlags;
	}
	/**
	* Initiates an asynchronous operation, by building a callback that will
	* resume execution, and then feeding that callback to the registration
	* function, handling error cases and repeated resumptions appropriately.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	initiateAsync(runtimeFlags, asyncRegister) {
		let alreadyCalled = false;
		const callback = (effect) => {
			if (!alreadyCalled) {
				alreadyCalled = true;
				this.tell(resume(effect));
			}
		};
		if (interruptible$2(runtimeFlags)) this._asyncInterruptor = callback;
		try {
			asyncRegister(callback);
		} catch (e) {
			callback(failCause$1(die$1(e)));
		}
	}
	pushStack(cont) {
		this._stack.push(cont);
		if (cont._op === "OnStep") this._steps.push({
			refs: this.getFiberRefs(),
			flags: this.currentRuntimeFlags
		});
	}
	popStack() {
		const item = this._stack.pop();
		if (item) {
			if (item._op === "OnStep") this._steps.pop();
			return item;
		}
	}
	getNextSuccessCont() {
		let frame = this.popStack();
		while (frame) {
			if (frame._op !== "OnFailure") return frame;
			frame = this.popStack();
		}
	}
	getNextFailCont() {
		let frame = this.popStack();
		while (frame) {
			if (frame._op !== "OnSuccess" && frame._op !== "While" && frame._op !== "Iterator") return frame;
			frame = this.popStack();
		}
	}
	["Tag"](op) {
		return sync(() => unsafeGet(this.currentContext, op));
	}
	["Left"](op) {
		return fail$2(op.left);
	}
	["None"](_) {
		return fail$2(new NoSuchElementException$1());
	}
	["Right"](op) {
		return exitSucceed$1(op.right);
	}
	["Some"](op) {
		return exitSucceed$1(op.value);
	}
	["Micro"](op) {
		return unsafeAsync((microResume) => {
			let resume = microResume;
			const fiber = runFork$1(provideContext(op, this.currentContext));
			fiber.addObserver((exit) => {
				if (exit._tag === "Success") return resume(exitSucceed$1(exit.value));
				switch (exit.cause._tag) {
					case "Interrupt": return resume(exitFailCause$1(interrupt(none$2)));
					case "Fail": return resume(fail$2(exit.cause.error));
					case "Die": return resume(die(exit.cause.defect));
				}
			});
			return unsafeAsync((abortResume) => {
				resume = (_) => {
					abortResume(void_$1);
				};
				fiber.unsafeInterrupt();
			});
		});
	}
	[OP_SYNC](op) {
		const value = internalCall(() => op.effect_instruction_i0());
		const cont = this.getNextSuccessCont();
		if (cont !== void 0) {
			if (!(cont._op in contOpSuccess)) absurd(cont);
			return contOpSuccess[cont._op](this, cont, value);
		} else {
			yieldedOpChannel.currentOp = exitSucceed$1(value);
			return YieldedOp;
		}
	}
	[OP_SUCCESS](op) {
		const oldCur = op;
		const cont = this.getNextSuccessCont();
		if (cont !== void 0) {
			if (!(cont._op in contOpSuccess)) absurd(cont);
			return contOpSuccess[cont._op](this, cont, oldCur.effect_instruction_i0);
		} else {
			yieldedOpChannel.currentOp = oldCur;
			return YieldedOp;
		}
	}
	[OP_FAILURE](op) {
		const cause = op.effect_instruction_i0;
		const cont = this.getNextFailCont();
		if (cont !== void 0) switch (cont._op) {
			case OP_ON_FAILURE:
			case OP_ON_SUCCESS_AND_FAILURE: if (!(interruptible$2(this.currentRuntimeFlags) && this.isInterrupted())) return internalCall(() => cont.effect_instruction_i1(cause));
			else return exitFailCause$1(stripFailures(cause));
			case "OnStep": if (!(interruptible$2(this.currentRuntimeFlags) && this.isInterrupted())) return exitSucceed$1(exitFailCause$1(cause));
			else return exitFailCause$1(stripFailures(cause));
			case OP_REVERT_FLAGS:
				this.patchRuntimeFlags(this.currentRuntimeFlags, cont.patch);
				if (interruptible$2(this.currentRuntimeFlags) && this.isInterrupted()) return exitFailCause$1(sequential$2(cause, this.getInterruptedCause()));
				else return exitFailCause$1(cause);
			default: absurd(cont);
		}
		else {
			yieldedOpChannel.currentOp = exitFailCause$1(cause);
			return YieldedOp;
		}
	}
	[OP_WITH_RUNTIME](op) {
		return internalCall(() => op.effect_instruction_i0(this, running(this.currentRuntimeFlags)));
	}
	["Blocked"](op) {
		const refs = this.getFiberRefs();
		const flags = this.currentRuntimeFlags;
		if (this._steps.length > 0) {
			const frames = [];
			const snap = this._steps[this._steps.length - 1];
			let frame = this.popStack();
			while (frame && frame._op !== "OnStep") {
				frames.push(frame);
				frame = this.popStack();
			}
			this.setFiberRefs(snap.refs);
			this.currentRuntimeFlags = snap.flags;
			const patchRefs = diff$1(snap.refs, refs);
			const patchFlags = diff$3(snap.flags, flags);
			return exitSucceed$1(blocked(op.effect_instruction_i0, withFiberRuntime((newFiber) => {
				while (frames.length > 0) newFiber.pushStack(frames.pop());
				newFiber.setFiberRefs(patch$1(newFiber.id(), newFiber.getFiberRefs())(patchRefs));
				newFiber.currentRuntimeFlags = patch$4(patchFlags)(newFiber.currentRuntimeFlags);
				return op.effect_instruction_i1;
			})));
		}
		return uninterruptibleMask$1((restore) => flatMap$3(forkDaemon(runRequestBlock(op.effect_instruction_i0)), () => restore(op.effect_instruction_i1)));
	}
	["RunBlocked"](op) {
		return runBlockedRequests(op.effect_instruction_i0);
	}
	[OP_UPDATE_RUNTIME_FLAGS](op) {
		const updateFlags = op.effect_instruction_i0;
		const oldRuntimeFlags = this.currentRuntimeFlags;
		const newRuntimeFlags = patch$4(oldRuntimeFlags, updateFlags);
		if (interruptible$2(newRuntimeFlags) && this.isInterrupted()) return exitFailCause$1(this.getInterruptedCause());
		else {
			this.patchRuntimeFlags(this.currentRuntimeFlags, updateFlags);
			if (op.effect_instruction_i1) {
				const revertFlags = diff$3(newRuntimeFlags, oldRuntimeFlags);
				this.pushStack(new RevertFlags(revertFlags, op));
				return internalCall(() => op.effect_instruction_i1(oldRuntimeFlags));
			} else return exitVoid$1;
		}
	}
	[OP_ON_SUCCESS](op) {
		this.pushStack(op);
		return op.effect_instruction_i0;
	}
	["OnStep"](op) {
		this.pushStack(op);
		return op.effect_instruction_i0;
	}
	[OP_ON_FAILURE](op) {
		this.pushStack(op);
		return op.effect_instruction_i0;
	}
	[OP_ON_SUCCESS_AND_FAILURE](op) {
		this.pushStack(op);
		return op.effect_instruction_i0;
	}
	[OP_ASYNC](op) {
		this._asyncBlockingOn = op.effect_instruction_i1;
		this.initiateAsync(this.currentRuntimeFlags, op.effect_instruction_i0);
		yieldedOpChannel.currentOp = op;
		return YieldedOp;
	}
	[OP_YIELD](op) {
		this._isYielding = false;
		yieldedOpChannel.currentOp = op;
		return YieldedOp;
	}
	[OP_WHILE](op) {
		const check = op.effect_instruction_i0;
		const body = op.effect_instruction_i1;
		if (check()) {
			this.pushStack(op);
			return body();
		} else return exitVoid$1;
	}
	[OP_ITERATOR](op) {
		return contOpSuccess[OP_ITERATOR](this, op, void 0);
	}
	[OP_COMMIT](op) {
		return internalCall(() => op.commit());
	}
	/**
	* The main run-loop for evaluating effects.
	*
	* **NOTE**: This method must be invoked by the fiber itself.
	*/
	runLoop(effect0) {
		let cur = effect0;
		this.currentOpCount = 0;
		while (true) {
			if ((this.currentRuntimeFlags & 2) !== 0) this.currentSupervisor.onEffect(this, cur);
			if (this._queue.length > 0) cur = this.drainQueueWhileRunning(this.currentRuntimeFlags, cur);
			if (!this._isYielding) {
				this.currentOpCount += 1;
				const shouldYield = this.currentScheduler.shouldYield(this);
				if (shouldYield !== false) {
					this._isYielding = true;
					this.currentOpCount = 0;
					const oldCur = cur;
					cur = flatMap$3(yieldNow$2({ priority: shouldYield }), () => oldCur);
				}
			}
			try {
				cur = this.currentTracer.context(() => {
					if (_version !== cur[EffectTypeId]._V) {
						const level = this.getFiberRef(currentVersionMismatchErrorLogLevel);
						if (level._tag === "Some") {
							const effectVersion = cur[EffectTypeId]._V;
							this.log(`Executing an Effect versioned ${effectVersion} with a Runtime of version ${getCurrentVersion()}, you may want to dedupe the effect dependencies, you can use the language service plugin to detect this at compile time: https://github.com/Effect-TS/language-service`, empty$14, level);
						}
					}
					return this[cur._op](cur);
				}, this);
				if (cur === YieldedOp) {
					const op = yieldedOpChannel.currentOp;
					if (op._op === "Yield" || op._op === "Async") return YieldedOp;
					yieldedOpChannel.currentOp = null;
					return op._op === "Success" || op._op === "Failure" ? op : exitFailCause$1(die$1(op));
				}
			} catch (e) {
				if (cur !== YieldedOp && !hasProperty(cur, "_op") || !(cur._op in this)) cur = dieMessage(`Not a valid effect: ${toStringUnknown(cur)}`);
				else if (isInterruptedException(e)) cur = exitFailCause$1(sequential$2(die$1(e), interrupt(none$2)));
				else cur = die(e);
			}
		}
	}
	run = () => {
		this.drainQueueOnCurrentThread();
	};
};
/** @internal */
const currentMinimumLogLevel = /* @__PURE__ */ globalValue("effect/FiberRef/currentMinimumLogLevel", () => fiberRefUnsafeMake(fromLiteral("Info")));
/** @internal */
const loggerWithConsoleLog = (self) => makeLogger((opts) => {
	get$4(getOrDefault(opts.context, currentServices), consoleTag).unsafe.log(self.log(opts));
});
/** @internal */
const defaultLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => loggerWithConsoleLog(stringLogger));
/** @internal */
const tracerLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => makeLogger(({ annotations, cause, context, fiberId, logLevel, message }) => {
	const span = filterDisablePropagation(getOption(getOrDefault$1(context, currentContext), spanTag));
	if (span._tag === "None" || span.value._tag === "ExternalSpan") return;
	const clockService = unsafeGet(getOrDefault$1(context, currentServices), clockTag);
	const attributes = {};
	for (const [key, value] of annotations) attributes[key] = value;
	attributes["effect.fiberId"] = threadName(fiberId);
	attributes["effect.logLevel"] = logLevel.label;
	if (cause !== null && cause._tag !== "Empty") attributes["effect.cause"] = pretty$1(cause, { renderErrorCause: true });
	span.value.event(toStringUnknown(Array.isArray(message) && message.length === 1 ? message[0] : message), clockService.unsafeCurrentTimeNanos(), attributes);
}));
/** @internal */
const currentLoggers = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => fiberRefUnsafeMakeHashSet(make$18(defaultLogger, tracerLogger)));
const forEach$1 = /* @__PURE__ */ dual((args) => isIterable(args[0]), (self, f, options) => withFiberRuntime((r) => {
	const isRequestBatchingEnabled = options?.batching === true || options?.batching === "inherit" && r.getFiberRef(currentRequestBatching);
	if (options?.discard) return match(options.concurrency, () => finalizersMaskInternal(sequential, options?.concurrentFinalizers)((restore) => isRequestBatchingEnabled ? forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), true, false, 1) : forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))), () => finalizersMaskInternal(parallel, options?.concurrentFinalizers)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false)), (n) => finalizersMaskInternal(parallelN(n), options?.concurrentFinalizers)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false, n)));
	return match(options?.concurrency, () => finalizersMaskInternal(sequential, options?.concurrentFinalizers)((restore) => isRequestBatchingEnabled ? forEachParN(self, 1, (a, i) => restore(f(a, i)), true) : forEachSequential(self, (a, i) => restore(f(a, i)))), () => finalizersMaskInternal(parallel, options?.concurrentFinalizers)((restore) => forEachParUnbounded(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)), (n) => finalizersMaskInternal(parallelN(n), options?.concurrentFinalizers)((restore) => forEachParN(self, n, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)));
}));
const forEachParUnbounded = (self, f, batching) => suspend$2(() => {
	const as = fromIterable$6(self);
	const array = new Array(as.length);
	const fn = (a, i) => flatMap$3(f(a, i), (b) => sync(() => array[i] = b));
	return zipRight(forEachConcurrentDiscard(as, fn, batching, false), succeed$2(array));
});
/** @internal */
const forEachConcurrentDiscard = (self, f, batching, processAll, n) => uninterruptibleMask$1((restore) => transplant((graft) => withFiberRuntime((parent) => {
	let todos = Array.from(self).reverse();
	let target = todos.length;
	if (target === 0) return void_$1;
	let counter = 0;
	let interrupted = false;
	const fibersCount = n ? Math.min(todos.length, n) : todos.length;
	const fibers = /* @__PURE__ */ new Set();
	const results = new Array();
	const interruptAll = () => fibers.forEach((fiber) => {
		fiber.currentScheduler.scheduleTask(() => {
			fiber.unsafeInterruptAsFork(parent.id());
		}, 0, fiber);
	});
	const startOrder = new Array();
	const joinOrder = new Array();
	const residual = new Array();
	const collectExits = () => {
		const exits = results.filter(({ exit }) => exit._tag === "Failure").sort((a, b) => a.index < b.index ? -1 : a.index === b.index ? 0 : 1).map(({ exit }) => exit);
		if (exits.length === 0) exits.push(exitVoid$1);
		return exits;
	};
	const runFiber = (eff, interruptImmediately = false) => {
		const runnable = uninterruptible(graft(eff));
		const fiber = unsafeForkUnstarted(runnable, parent, parent.currentRuntimeFlags, globalScope);
		parent.currentScheduler.scheduleTask(() => {
			if (interruptImmediately) fiber.unsafeInterruptAsFork(parent.id());
			fiber.resume(runnable);
		}, 0, fiber);
		return fiber;
	};
	const onInterruptSignal = () => {
		if (!processAll) {
			target -= todos.length;
			todos = [];
		}
		interrupted = true;
		interruptAll();
	};
	const stepOrExit = batching ? step : exit;
	const processingFiber = runFiber(async_((resume) => {
		const pushResult = (res, index) => {
			if (res._op === "Blocked") residual.push(res);
			else {
				results.push({
					index,
					exit: res
				});
				if (res._op === "Failure" && !interrupted) onInterruptSignal();
			}
		};
		const next = () => {
			if (todos.length > 0) {
				const a = todos.pop();
				let index = counter++;
				const returnNextElement = () => {
					const a = todos.pop();
					index = counter++;
					return flatMap$3(yieldNow$2(), () => flatMap$3(stepOrExit(restore(f(a, index))), onRes));
				};
				const onRes = (res) => {
					if (todos.length > 0) {
						pushResult(res, index);
						if (todos.length > 0) return returnNextElement();
					}
					return succeed$2(res);
				};
				const fiber = runFiber(flatMap$3(stepOrExit(restore(f(a, index))), onRes));
				startOrder.push(fiber);
				fibers.add(fiber);
				if (interrupted) fiber.currentScheduler.scheduleTask(() => {
					fiber.unsafeInterruptAsFork(parent.id());
				}, 0, fiber);
				fiber.addObserver((wrapped) => {
					let exit;
					if (wrapped._op === "Failure") exit = wrapped;
					else exit = wrapped.effect_instruction_i0;
					joinOrder.push(fiber);
					fibers.delete(fiber);
					pushResult(exit, index);
					if (results.length === target) resume(succeed$2(getOrElse(exitCollectAll(collectExits(), { parallel: true }), () => exitVoid$1)));
					else if (residual.length + results.length === target) {
						const exits = collectExits();
						resume(succeed$2(blocked(residual.map((blocked) => blocked.effect_instruction_i0).reduce(par), forEachConcurrentDiscard([getOrElse(exitCollectAll(exits, { parallel: true }), () => exitVoid$1), ...residual.map((blocked) => blocked.effect_instruction_i1)], (i) => i, batching, true, n))));
					} else next();
				});
			}
		};
		for (let i = 0; i < fibersCount; i++) next();
	}));
	return asVoid(onExit$1(flatten$1(restore(join(processingFiber))), exitMatch({
		onFailure: (cause) => {
			onInterruptSignal();
			const target = residual.length + 1;
			const concurrency = Math.min(typeof n === "number" ? n : residual.length, residual.length);
			const toPop = Array.from(residual);
			return async_((cb) => {
				const exits = [];
				let count = 0;
				let index = 0;
				const check = (index, hitNext) => (exit) => {
					exits[index] = exit;
					count++;
					if (count === target) cb(exitSucceed$1(exitFailCause$1(cause)));
					if (toPop.length > 0 && hitNext) next();
				};
				const next = () => {
					runFiber(toPop.pop(), true).addObserver(check(index, true));
					index++;
				};
				processingFiber.addObserver(check(index, false));
				index++;
				for (let i = 0; i < concurrency; i++) next();
			});
		},
		onSuccess: () => forEachSequential(joinOrder, (f) => f.inheritAll)
	})));
})));
const forEachParN = (self, n, f, batching) => suspend$2(() => {
	const as = fromIterable$6(self);
	const array = new Array(as.length);
	const fn = (a, i) => map$2(f(a, i), (b) => array[i] = b);
	return zipRight(forEachConcurrentDiscard(as, fn, batching, false, n), succeed$2(array));
});
const forkDaemon = (self) => forkWithScopeOverride(self, globalScope);
/** @internal */
const unsafeFork$1 = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
	const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
	childFiber.resume(effect);
	return childFiber;
};
/** @internal */
const unsafeForkUnstarted = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
	return unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
};
/** @internal */
const unsafeMakeChildFiber = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
	const childId = unsafeMake$5();
	const childFiberRefs = forkAs(parentFiber.getFiberRefs(), childId);
	const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
	const childContext = getOrDefault$1(childFiberRefs, currentContext);
	const supervisor = childFiber.currentSupervisor;
	supervisor.onStart(childContext, effect, some(parentFiber), childFiber);
	childFiber.addObserver((exit) => supervisor.onEnd(exit, childFiber));
	(overrideScope !== null ? overrideScope : pipe(parentFiber.getFiberRef(currentForkScopeOverride), getOrElse(() => parentFiber.scope()))).add(parentRuntimeFlags, childFiber);
	return childFiber;
};
const forkWithScopeOverride = (self, scopeOverride) => withFiberRuntime((parentFiber, parentStatus) => succeed$2(unsafeFork$1(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)));
const parallelFinalizers = (self) => contextWithEffect((context) => match$3(getOption(context, scopeTag), {
	onNone: () => self,
	onSome: (scope) => {
		switch (scope.strategy._tag) {
			case "Parallel": return self;
			case "Sequential":
			case "ParallelN": return flatMap$3(scopeFork(scope, parallel), (inner) => scopeExtend(self, inner));
		}
	}
}));
const parallelNFinalizers = (parallelism) => (self) => contextWithEffect((context) => match$3(getOption(context, scopeTag), {
	onNone: () => self,
	onSome: (scope) => {
		if (scope.strategy._tag === "ParallelN" && scope.strategy.parallelism === parallelism) return self;
		return flatMap$3(scopeFork(scope, parallelN(parallelism)), (inner) => scopeExtend(self, inner));
	}
}));
const finalizersMaskInternal = (strategy, concurrentFinalizers) => (self) => contextWithEffect((context) => match$3(getOption(context, scopeTag), {
	onNone: () => self(identity),
	onSome: (scope) => {
		if (concurrentFinalizers === true) {
			const patch = strategy._tag === "Parallel" ? parallelFinalizers : strategy._tag === "Sequential" ? sequentialFinalizers : parallelNFinalizers(strategy.parallelism);
			switch (scope.strategy._tag) {
				case "Parallel": return patch(self(parallelFinalizers));
				case "Sequential": return patch(self(sequentialFinalizers));
				case "ParallelN": return patch(self(parallelNFinalizers(scope.strategy.parallelism)));
			}
		} else return self(identity);
	}
}));
const sequentialFinalizers = (self) => contextWithEffect((context) => match$3(getOption(context, scopeTag), {
	onNone: () => self,
	onSome: (scope) => {
		switch (scope.strategy._tag) {
			case "Sequential": return self;
			case "Parallel":
			case "ParallelN": return flatMap$3(scopeFork(scope, sequential), (inner) => scopeExtend(self, inner));
		}
	}
}));
/** @internal */
const scopeTag = /* @__PURE__ */ GenericTag("effect/Scope");
const scopeUnsafeAddFinalizer = (scope, fin) => {
	if (scope.state._tag === "Open") scope.state.finalizers.set({}, fin);
};
const ScopeImplProto = {
	[ScopeTypeId]: ScopeTypeId,
	[CloseableScopeTypeId]: CloseableScopeTypeId,
	pipe() {
		return pipeArguments(this, arguments);
	},
	fork(strategy) {
		return sync(() => {
			const newScope = scopeUnsafeMake(strategy);
			if (this.state._tag === "Closed") {
				newScope.state = this.state;
				return newScope;
			}
			const key = {};
			const fin = (exit) => newScope.close(exit);
			this.state.finalizers.set(key, fin);
			scopeUnsafeAddFinalizer(newScope, (_) => sync(() => {
				if (this.state._tag === "Open") this.state.finalizers.delete(key);
			}));
			return newScope;
		});
	},
	close(exit$2) {
		return suspend$2(() => {
			if (this.state._tag === "Closed") return void_$1;
			const finalizers = Array.from(this.state.finalizers.values()).reverse();
			this.state = {
				_tag: "Closed",
				exit: exit$2
			};
			if (finalizers.length === 0) return void_$1;
			return isSequential(this.strategy) ? pipe(forEachSequential(finalizers, (fin) => exit(fin(exit$2))), flatMap$3((results) => pipe(exitCollectAll(results), map$6(exitAsVoid), getOrElse(() => exitVoid$1)))) : isParallel(this.strategy) ? pipe(forEachParUnbounded(finalizers, (fin) => exit(fin(exit$2)), false), flatMap$3((results) => pipe(exitCollectAll(results, { parallel: true }), map$6(exitAsVoid), getOrElse(() => exitVoid$1)))) : pipe(forEachParN(finalizers, this.strategy.parallelism, (fin) => exit(fin(exit$2)), false), flatMap$3((results) => pipe(exitCollectAll(results, { parallel: true }), map$6(exitAsVoid), getOrElse(() => exitVoid$1))));
		});
	},
	addFinalizer(fin) {
		return suspend$2(() => {
			if (this.state._tag === "Closed") return fin(this.state.exit);
			this.state.finalizers.set({}, fin);
			return void_$1;
		});
	}
};
const scopeUnsafeMake = (strategy = sequential$1) => {
	const scope = Object.create(ScopeImplProto);
	scope.strategy = strategy;
	scope.state = {
		_tag: "Open",
		finalizers: /* @__PURE__ */ new Map()
	};
	return scope;
};
const scopeExtend = /* @__PURE__ */ dual(2, (effect, scope) => mapInputContext(effect, merge$1(make$16(scopeTag, scope))));
/** @internal */
const fiberRefUnsafeMakeSupervisor = (initial) => fiberRefUnsafeMakePatch(initial, {
	differ,
	fork: empty
});
/** @internal */
const currentRuntimeFlags = /* @__PURE__ */ fiberRefUnsafeMakeRuntimeFlags(none$1);
/** @internal */
const currentSupervisor = /* @__PURE__ */ fiberRefUnsafeMakeSupervisor(none);
/** @internal */
const ensuring = /* @__PURE__ */ dual(2, (self, finalizer) => uninterruptibleMask$1((restore) => matchCauseEffect$1(restore(self), {
	onFailure: (cause1) => matchCauseEffect$1(finalizer, {
		onFailure: (cause2) => failCause$1(sequential$2(cause1, cause2)),
		onSuccess: () => failCause$1(cause1)
	}),
	onSuccess: (a) => as(finalizer, a)
})));
/** @internal */
const invokeWithInterrupt = (self, entries, onInterrupt) => fiberIdWith((id) => ensuring(flatMap$3(forkDaemon(interruptible$1(self)), (processing) => async_((cb) => {
	const counts = entries.map((_) => _.listeners.count);
	const checkDone = () => {
		if (counts.every((count) => count === 0)) {
			if (entries.every((_) => {
				if (_.result.state.current._tag === "Pending") return true;
				else if (_.result.state.current._tag === "Done" && exitIsExit(_.result.state.current.effect) && _.result.state.current.effect._tag === "Failure" && isInterrupted(_.result.state.current.effect.cause)) return true;
				else return false;
			})) {
				cleanup.forEach((f) => f());
				onInterrupt?.();
				cb(interruptFiber(processing));
			}
		}
	};
	processing.addObserver((exit) => {
		cleanup.forEach((f) => f());
		cb(exit);
	});
	const cleanup = entries.map((r, i) => {
		const observer = (count) => {
			counts[i] = count;
			checkDone();
		};
		r.listeners.addObserver(observer);
		return () => r.listeners.removeObserver(observer);
	});
	checkDone();
	return sync(() => {
		cleanup.forEach((f) => f());
	});
})), suspend$2(() => {
	return forEachSequentialDiscard(entries.flatMap((entry) => {
		if (!entry.state.completed) return [entry];
		return [];
	}), (entry) => complete(entry.request, exitInterrupt$1(id)));
})));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Scope.js
/**
* @since 2.0.0
*/
/**
* Closes this scope with the specified exit value, running all finalizers that
* have been added to the scope.
*
* @since 2.0.0
* @category destructors
*/
const close = scopeClose;
/**
* Forks a new child scope with the specified execution strategy. The child scope
* will automatically be closed when this scope is closed.
*
* @since 2.0.0
* @category utils
*/
const fork = scopeFork;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/runtime.js
const makeDual = (f) => function() {
	if (arguments.length === 1) {
		const runtime = arguments[0];
		return (effect, ...args) => f(runtime, effect, ...args);
	}
	return f.apply(this, arguments);
};
/** @internal */
const unsafeFork = /* @__PURE__ */ makeDual((runtime, self, options) => {
	const fiberId = unsafeMake$5();
	const fiberRefUpdates = [[currentContext, [[fiberId, runtime.context]]]];
	if (options?.scheduler) fiberRefUpdates.push([currentScheduler, [[fiberId, options.scheduler]]]);
	let fiberRefs = updateManyAs(runtime.fiberRefs, {
		entries: fiberRefUpdates,
		forkAs: fiberId
	});
	if (options?.updateRefs) fiberRefs = options.updateRefs(fiberRefs, fiberId);
	const fiberRuntime = new FiberRuntime(fiberId, fiberRefs, runtime.runtimeFlags);
	let effect = self;
	if (options?.scope) effect = flatMap$3(fork(options.scope, sequential$1), (closeableScope) => zipRight(scopeAddFinalizer(closeableScope, fiberIdWith((id) => equals$2(id, fiberRuntime.id()) ? void_$1 : interruptAsFiber(fiberRuntime, id))), onExit$1(self, (exit) => close(closeableScope, exit))));
	const supervisor = fiberRuntime.currentSupervisor;
	if (supervisor !== none) {
		supervisor.onStart(runtime.context, effect, none$4(), fiberRuntime);
		fiberRuntime.addObserver((exit) => supervisor.onEnd(exit, fiberRuntime));
	}
	globalScope.add(runtime.runtimeFlags, fiberRuntime);
	if (options?.immediate === false) fiberRuntime.resume(effect);
	else fiberRuntime.start(effect);
	return fiberRuntime;
});
/** @internal */
const unsafeRunSync = /* @__PURE__ */ makeDual((runtime, effect) => {
	const result = unsafeRunSyncExit(runtime)(effect);
	if (result._tag === "Failure") throw fiberFailure(result.effect_instruction_i0);
	return result.effect_instruction_i0;
});
var AsyncFiberExceptionImpl = class extends Error {
	fiber;
	_tag = "AsyncFiberException";
	constructor(fiber) {
		super(`Fiber #${fiber.id().id} cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`);
		this.fiber = fiber;
		this.name = this._tag;
		this.stack = this.message;
	}
};
const asyncFiberException = (fiber) => {
	const limit = Error.stackTraceLimit;
	Error.stackTraceLimit = 0;
	const error = new AsyncFiberExceptionImpl(fiber);
	Error.stackTraceLimit = limit;
	return error;
};
/** @internal */
const FiberFailureId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure");
/** @internal */
const FiberFailureCauseId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var FiberFailureImpl = class extends Error {
	[FiberFailureId];
	[FiberFailureCauseId];
	constructor(cause) {
		const head = prettyErrors(cause)[0];
		super(head?.message || "An error has occurred");
		this[FiberFailureId] = FiberFailureId;
		this[FiberFailureCauseId] = cause;
		this.name = head ? `(FiberFailure) ${head.name}` : "FiberFailure";
		if (head?.stack) this.stack = head.stack;
	}
	toJSON() {
		return {
			_id: "FiberFailure",
			cause: this[FiberFailureCauseId].toJSON()
		};
	}
	toString() {
		return "(FiberFailure) " + pretty$1(this[FiberFailureCauseId], { renderErrorCause: true });
	}
	[NodeInspectSymbol]() {
		return this.toString();
	}
};
/** @internal */
const fiberFailure = (cause) => {
	const limit = Error.stackTraceLimit;
	Error.stackTraceLimit = 0;
	const error = new FiberFailureImpl(cause);
	Error.stackTraceLimit = limit;
	return error;
};
const fastPath = (effect) => {
	const op = effect;
	switch (op._op) {
		case "Failure":
		case "Success": return op;
		case "Left": return exitFail(op.left);
		case "Right": return exitSucceed$1(op.right);
		case "Some": return exitSucceed$1(op.value);
		case "None": return exitFail(new NoSuchElementException$1());
	}
};
/** @internal */
const unsafeRunSyncExit = /* @__PURE__ */ makeDual((runtime, effect) => {
	const op = fastPath(effect);
	if (op) return op;
	const scheduler = new SyncScheduler();
	const fiberRuntime = unsafeFork(runtime)(effect, { scheduler });
	scheduler.flush();
	const result = fiberRuntime.unsafePoll();
	if (result) return result;
	return exitDie$1(capture(asyncFiberException(fiberRuntime), currentSpanFromFiber(fiberRuntime)));
});
/** @internal */
var RuntimeImpl = class {
	context;
	runtimeFlags;
	fiberRefs;
	constructor(context, runtimeFlags, fiberRefs) {
		this.context = context;
		this.runtimeFlags = runtimeFlags;
		this.fiberRefs = fiberRefs;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
};
/** @internal */
const make$1 = (options) => new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs);
/** @internal */
const defaultRuntime = /* @__PURE__ */ make$1({
	context: /* @__PURE__ */ empty$12(),
	runtimeFlags: /* @__PURE__ */ make$11(1, 32, 4),
	fiberRefs: /* @__PURE__ */ empty$3()
});
/** @internal */
const unsafeForkEffect = /* @__PURE__ */ unsafeFork(defaultRuntime);
/** @internal */
const unsafeRunSyncEffect = /* @__PURE__ */ unsafeRunSync(defaultRuntime);
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/dateTime.js
/** @internal */
const TypeId$1 = /* @__PURE__ */ Symbol.for("effect/DateTime");
/** @internal */
const TimeZoneTypeId = /* @__PURE__ */ Symbol.for("effect/DateTime/TimeZone");
const Proto = {
	[TypeId$1]: TypeId$1,
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
	[symbol$1]() {
		return cached(this, number$1(this.epochMillis));
	},
	[symbol](that) {
		return isDateTime$1(that) && that._tag === "Utc" && this.epochMillis === that.epochMillis;
	},
	toString() {
		return `DateTime.Utc(${toDateUtc$1(this).toJSON()})`;
	}
};
const ProtoZoned = {
	...Proto,
	_tag: "Zoned",
	[symbol$1]() {
		return pipe(number$1(this.epochMillis), combine$5(hash(this.zone)), cached(this));
	},
	[symbol](that) {
		return isDateTime$1(that) && that._tag === "Zoned" && this.epochMillis === that.epochMillis && equals$2(this.zone, that.zone);
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
	[symbol$1]() {
		return cached(this, string(`Named:${this.id}`));
	},
	[symbol](that) {
		return isTimeZone(that) && that._tag === "Named" && this.id === that.id;
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
	[symbol$1]() {
		return cached(this, string(`Offset:${this.offset}`));
	},
	[symbol](that) {
		return isTimeZone(that) && that._tag === "Offset" && this.offset === that.offset;
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
const isDateTime$1 = (u) => hasProperty(u, TypeId$1);
/** @internal */
const isTimeZone = (u) => hasProperty(u, TimeZoneTypeId);
/** @internal */
const isTimeZoneOffset$1 = (u) => isTimeZone(u) && u._tag === "Offset";
/** @internal */
const isTimeZoneNamed$1 = (u) => isTimeZone(u) && u._tag === "Named";
/** @internal */
const isUtc$1 = (self) => self._tag === "Utc";
/** @internal */
const isZoned$1 = (self) => self._tag === "Zoned";
/** @internal */
const Equivalence$1 = /* @__PURE__ */ make$25((a, b) => a.epochMillis === b.epochMillis);
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
const unsafeFromDate$1 = (date) => {
	const epochMillis = date.getTime();
	if (Number.isNaN(epochMillis)) throw new IllegalArgumentException("Invalid date");
	return makeUtc(epochMillis);
};
/** @internal */
const unsafeMake$1 = (input) => {
	if (isDateTime$1(input)) return input;
	else if (input instanceof Date) return unsafeFromDate$1(input);
	else if (typeof input === "object") {
		const date = /* @__PURE__ */ new Date(0);
		setPartsDate(date, input);
		return unsafeFromDate$1(date);
	} else if (typeof input === "string" && !hasZone(input)) return unsafeFromDate$1(/* @__PURE__ */ new Date(input + "Z"));
	return unsafeFromDate$1(new Date(input));
};
const hasZone = (input) => /Z|[+-]\d{2}$|[+-]\d{2}:?\d{2}$|\]$/.test(input);
const minEpochMillis = -86399999568e5;
const maxEpochMillis = 864e13 - 840 * 60 * 1e3;
/** @internal */
const unsafeMakeZoned$1 = (input, options) => {
	if (options?.timeZone === void 0 && isDateTime$1(input) && isZoned$1(input)) return input;
	const self = unsafeMake$1(input);
	if (self.epochMillis < minEpochMillis || self.epochMillis > maxEpochMillis) throw new RangeError(`Epoch millis out of range: ${self.epochMillis}`);
	let zone;
	if (options?.timeZone === void 0) zone = zoneMakeOffset$1(new Date(self.epochMillis).getTimezoneOffset() * -60 * 1e3);
	else if (isTimeZone(options?.timeZone)) zone = options.timeZone;
	else if (typeof options?.timeZone === "number") zone = zoneMakeOffset$1(options.timeZone);
	else {
		const parsedZone = zoneFromString$1(options.timeZone);
		if (isNone(parsedZone)) throw new IllegalArgumentException(`Invalid time zone: ${options.timeZone}`);
		zone = parsedZone.value;
	}
	if (options?.adjustForTimeZone !== true) return makeZonedProto(self.epochMillis, zone, self.partsUtc);
	return makeZonedFromAdjusted(self.epochMillis, zone, options?.disambiguation ?? "compatible");
};
/** @internal */
const makeZoned = /* @__PURE__ */ liftThrowable(unsafeMakeZoned$1);
const zonedStringRegex = /^(.{17,35})\[(.+)\]$/;
/** @internal */
const makeZonedFromString$1 = (input) => {
	const match = zonedStringRegex.exec(input);
	if (match === null) {
		const offset = parseOffset(input);
		return offset !== null ? makeZoned(input, { timeZone: offset }) : none$4();
	}
	const [, isoString, timeZone] = match;
	return makeZoned(isoString, { timeZone });
};
const validZoneCache = /* @__PURE__ */ globalValue("effect/DateTime/validZoneCache", () => /* @__PURE__ */ new Map());
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
const zoneUnsafeMakeNamed$1 = (zoneId) => {
	if (validZoneCache.has(zoneId)) return validZoneCache.get(zoneId);
	try {
		return zoneMakeIntl(new Intl.DateTimeFormat("en-US", {
			...formatOptions,
			timeZone: zoneId
		}));
	} catch {
		throw new IllegalArgumentException(`Invalid time zone: ${zoneId}`);
	}
};
/** @internal */
const zoneMakeOffset$1 = (offset) => {
	const zone = Object.create(ProtoTimeZoneOffset);
	zone.offset = offset;
	return zone;
};
/** @internal */
const zoneMakeNamed = /* @__PURE__ */ liftThrowable(zoneUnsafeMakeNamed$1);
const offsetZoneRegex = /^(?:GMT|[+-])/;
/** @internal */
const zoneFromString$1 = (zone) => {
	if (offsetZoneRegex.test(zone)) {
		const offset = parseOffset(zone);
		return offset === null ? none$4() : some(zoneMakeOffset$1(offset));
	}
	return zoneMakeNamed(zone);
};
/** @internal */
const zoneToString$1 = (self) => {
	if (self._tag === "Offset") return offsetToString(self.offset);
	return self.id;
};
/** @internal */
const toDateUtc$1 = (self) => new Date(self.epochMillis);
/** @internal */
const toDate = (self) => {
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
const zonedOffset = (self) => {
	return toDate(self).getTime() - toEpochMillis$1(self);
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
const zonedOffsetIso = (self) => offsetToString(zonedOffset(self));
/** @internal */
const toEpochMillis$1 = (self) => self.epochMillis;
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
		if (adjustedMillis !== toDate(before).getTime()) switch (disambiguation) {
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
const offsetRegex = /([+-])(\d{2}):(\d{2})$/;
const parseOffset = (offset) => {
	const match = offsetRegex.exec(offset);
	if (match === null) return null;
	const [, sign, hours, minutes] = match;
	return (sign === "+" ? 1 : -1) * (Number(hours) * 60 + Number(minutes)) * 60 * 1e3;
};
const calculateNamedOffset = (utcMillis, adjustedMillis, zone) => {
	const offset = zone.format.formatToParts(utcMillis).find((_) => _.type === "timeZoneName")?.value ?? "";
	if (offset === "GMT") return 0;
	const result = parseOffset(offset);
	if (result === null) return zonedOffset(makeZonedProto(adjustedMillis, zone));
	return result;
};
/** @internal */
const formatIso$1 = (self) => toDateUtc$1(self).toISOString();
/** @internal */
const formatIsoOffset = (self) => {
	const date = toDate(self);
	return self._tag === "Utc" ? date.toISOString() : `${date.toISOString().slice(0, -1)}${zonedOffsetIso(self)}`;
};
/** @internal */
const formatIsoZoned$1 = (self) => self.zone._tag === "Offset" ? formatIsoOffset(self) : `${formatIsoOffset(self)}[${self.zone.id}]`;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/String.js
/**
* @example
* ```ts
* import * as assert from "node:assert"
* import { pipe, String } from "effect"
*
* assert.deepStrictEqual(pipe('a', String.toUpperCase), 'A')
* ```
*
* @since 2.0.0
*/
const toUpperCase = (self) => self.toUpperCase();
/**
* @example
* ```ts
* import * as assert from "node:assert"
* import { pipe, String } from "effect"
*
* assert.deepStrictEqual(pipe('A', String.toLowerCase), 'a')
* ```
*
* @since 2.0.0
*/
const toLowerCase = (self) => self.toLowerCase();
/**
* @example
* ```ts
* import * as assert from "node:assert"
* import { pipe, String } from "effect"
*
* assert.deepStrictEqual(pipe('abc', String.capitalize), 'Abc')
* ```
*
* @since 2.0.0
*/
const capitalize = (self) => {
	if (self.length === 0) return self;
	return toUpperCase(self[0]) + self.slice(1);
};
/**
* @example
* ```ts
* import * as assert from "node:assert"
* import { pipe, String } from "effect"
*
* assert.deepStrictEqual(pipe('ABC', String.uncapitalize), 'aBC')
* ```
*
* @since 2.0.0
*/
const uncapitalize = (self) => {
	if (self.length === 0) return self;
	return toLowerCase(self[0]) + self.slice(1);
};
/**
* Test whether a `string` is non empty.
*
* @since 2.0.0
*/
const isNonEmpty$1 = (self) => self.length > 0;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Effect.js
/**
* Checks if a given value is an `Effect` value.
*
* **When to Use**
*
* This function can be useful for checking the type of a value before
* attempting to operate on it as an `Effect` value. For example, you could use
* `Effect.isEffect` to check the type of a value before using it as an argument
* to a function that expects an `Effect` value.
*
* @since 2.0.0
* @category Guards
*/
const isEffect = isEffect$1;
/**
* Executes an effectful operation for each element in an `Iterable`.
*
* **Details**
*
* This function applies a provided operation to each element in the iterable,
* producing a new effect that returns an array of results.
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
* **Example** (Applying Effects to Iterable Elements)
*
* ```ts
* import { Effect, Console } from "effect"
*
* const result = Effect.forEach([1, 2, 3, 4, 5], (n, index) =>
*   Console.log(`Currently at index ${index}`).pipe(Effect.as(n * 2))
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
* **Example** (Discarding Results)
*
* ```ts
* import { Effect, Console } from "effect"
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
* ```
*
* @see {@link all} for combining multiple effects into one.
*
* @since 2.0.0
* @category Looping
*/
const forEach = forEach$1;
/**
* Delays the creation of an `Effect` until it is actually needed.
*
* **Details**
*
* The `Effect.suspend` function takes a thunk that represents the effect and
* wraps it in a suspended effect. This means the effect will not be created
* until it is explicitly needed, which is helpful in various scenarios:
* - **Lazy Evaluation**: Helps optimize performance by deferring computations,
*   especially when the effect might not be needed, or when its computation is
*   expensive. This also ensures that any side effects or scoped captures are
*   re-executed on each invocation.
* - **Handling Circular Dependencies**: Useful in managing circular
*   dependencies, such as recursive functions that need to avoid eager
*   evaluation to prevent stack overflow.
* - **Unifying Return Types**: Can help TypeScript unify return types in
*   situations where multiple branches of logic return different effects,
*   simplifying type inference.
*
* **When to Use**
*
* Use this function when you need to defer the evaluation of an effect until it
* is required. This is particularly useful for optimizing expensive
* computations, managing circular dependencies, or resolving type inference
* issues.
*
* **Example** (Lazy Evaluation with Side Effects)
*
* ```ts
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
* **Example** (Recursive Fibonacci)
*
* ```ts
* import { Effect } from "effect"
*
* const blowsUp = (n: number): Effect.Effect<number> =>
*   n < 2
*     ? Effect.succeed(1)
*     : Effect.zipWith(blowsUp(n - 1), blowsUp(n - 2), (a, b) => a + b)
*
* console.log(Effect.runSync(blowsUp(32)))
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
* ```
*
* **Example** (Using Effect.suspend to Help TypeScript Infer Types)
*
* ```ts
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
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const suspend$1 = suspend$2;
const _void = void_$1;
/**
* Handles all errors in an effect by providing a fallback effect.
*
* **Details**
*
* This function catches any errors that may occur during the execution of an
* effect and allows you to handle them by specifying a fallback effect. This
* ensures that the program continues without failing by recovering from errors
* using the provided fallback logic.
*
* **Note**: This function only handles recoverable errors. It will not recover
* from unrecoverable defects.
*
* **Example** (Providing Recovery Logic for Recoverable Errors)
*
* ```ts
* import { Effect, Random } from "effect"
*
* class HttpError {
*   readonly _tag = "HttpError"
* }
*
* class ValidationError {
*   readonly _tag = "ValidationError"
* }
*
* //      ┌─── Effect<string, HttpError | ValidationError, never>
* //      ▼
* const program = Effect.gen(function* () {
*   const n1 = yield* Random.next
*   const n2 = yield* Random.next
*   if (n1 < 0.5) {
*     yield* Effect.fail(new HttpError())
*   }
*   if (n2 < 0.5) {
*     yield* Effect.fail(new ValidationError())
*   }
*   return "some result"
* })
*
* //      ┌─── Effect<string, never, never>
* //      ▼
* const recovered = program.pipe(
*   Effect.catchAll((error) =>
*     Effect.succeed(`Recovering from ${error._tag}`)
*   )
* )
* ```
*
* @see {@link catchAllCause} for a version that can recover from both
* recoverable and unrecoverable errors.
*
* @since 2.0.0
* @category Error handling
*/
const catchAll = catchAll$1;
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
* **Example** (Adding a Service Charge)
*
* ```ts
* import { pipe, Effect } from "effect"
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
const map$1 = map$2;
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
* **Example**
*
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
const mapBoth$1 = mapBoth$2;
/**
* Transforms or modifies the error produced by an effect without affecting its
* success value.
*
* **When to Use**
*
* This function is helpful when you want to enhance the error with additional
* information, change the error type, or apply custom error handling while
* keeping the original behavior of the effect's success values intact. It only
* operates on the error channel and leaves the success channel unchanged.
*
* **Example**
*
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
* @see {@link map} for a version that operates on the success channel.
* @see {@link mapBoth} for a version that operates on both channels.
* @see {@link orElseFail} if you want to replace the error with a new one.
*
* @since 2.0.0
* @category Mapping
*/
const mapError$1 = mapError$2;
/**
* Encapsulates both success and failure of an `Effect` into an `Either` type.
*
* **Details**
*
* This function converts an effect that may fail into an effect that always
* succeeds, wrapping the outcome in an `Either` type. The result will be
* `Either.Left` if the effect fails, containing the recoverable error, or
* `Either.Right` if it succeeds, containing the result.
*
* Using this function, you can handle recoverable errors explicitly without
* causing the effect to fail. This is particularly useful in scenarios where
* you want to chain effects and manage both success and failure in the same
* logical flow.
*
* It's important to note that unrecoverable errors, often referred to as
* "defects," are still thrown and not captured within the `Either` type. Only
* failures that are explicitly represented as recoverable errors in the effect
* are encapsulated.
*
* The resulting effect cannot fail directly because all recoverable failures
* are represented inside the `Either` type.
*
* **Example**
*
* ```ts
* import { Effect, Either, Random } from "effect"
*
* class HttpError {
*   readonly _tag = "HttpError"
* }
*
* class ValidationError {
*   readonly _tag = "ValidationError"
* }
*
* //      ┌─── Effect<string, HttpError | ValidationError, never>
* //      ▼
* const program = Effect.gen(function* () {
*   const n1 = yield* Random.next
*   const n2 = yield* Random.next
*   if (n1 < 0.5) {
*     yield* Effect.fail(new HttpError())
*   }
*   if (n2 < 0.5) {
*     yield* Effect.fail(new ValidationError())
*   }
*   return "some result"
* })
*
* //      ┌─── Effect<string, never, never>
* //      ▼
* const recovered = Effect.gen(function* () {
*   //      ┌─── Either<string, HttpError | ValidationError>
*   //      ▼
*   const failureOrSuccess = yield* Effect.either(program)
*   return Either.match(failureOrSuccess, {
*     onLeft: (error) => `Recovering from ${error._tag}`,
*     onRight: (value) => value // Do nothing in case of success
*   })
* })
* ```
*
* @see {@link option} for a version that uses `Option` instead.
* @see {@link exit} for a version that encapsulates both recoverable errors and defects in an `Exit`.
*
* @since 2.0.0
* @category Outcome Encapsulation
*/
const either = either$1;
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
* **Example**
*
* ```ts
* import { pipe, Effect } from "effect"
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
const flatMap$1 = flatMap$3;
/**
* Runs an effect in the background, returning a fiber that can be observed or
* interrupted.
*
* Unless you specifically need a `Promise` or synchronous operation, `runFork`
* is a good default choice.
*
* **Details**
*
* This function is the foundational way to execute an effect in the background.
* It creates a "fiber," a lightweight, cooperative thread of execution that can
* be observed (to access its result), interrupted, or joined. Fibers are useful
* for concurrent programming and allow effects to run independently of the main
* program flow.
*
* Once the effect is running in a fiber, you can monitor its progress, cancel
* it if necessary, or retrieve its result when it completes. If the effect
* fails, the fiber will propagate the failure, which you can observe and
* handle.
*
* **When to Use**
*
* Use this function when you need to run an effect in the background,
* especially if the effect is long-running or performs periodic tasks. It's
* suitable for tasks that need to run independently but might still need
* observation or management, like logging, monitoring, or scheduled tasks.
*
* This function is ideal if you don't need the result immediately or if the
* effect is part of a larger concurrent workflow.
*
* **Example** (Running an Effect in the Background)
*
* ```ts
* import { Effect, Console, Schedule, Fiber } from "effect"
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
const runFork = unsafeForkEffect;
/**
* Executes an effect synchronously, running it immediately and returning the
* result.
*
* **Details**
*
* This function evaluates the provided effect synchronously, returning its
* result directly. It is ideal for effects that do not fail or include
* asynchronous operations. If the effect does fail or involves async tasks, it
* will throw an error. Execution stops at the point of failure or asynchronous
* operation, making it unsuitable for effects that require asynchronous
* handling.
*
* **Important**: Attempting to run effects that involve asynchronous operations
* or failures will result in exceptions being thrown, so use this function with
* care for purely synchronous and error-free effects.
*
* **When to Use**
*
* Use this function when:
* - You are sure that the effect will not fail or involve asynchronous
*   operations.
* - You need a direct, synchronous result from the effect.
* - You are working within a context where asynchronous effects are not
*   allowed.
*
* Avoid using this function for effects that can fail or require asynchronous
* handling. For such cases, consider using {@link runPromise} or
* {@link runSyncExit}.
*
* **Example** (Synchronous Logging)
*
* ```ts
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
* **Example** (Incorrect Usage with Failing or Async Effects)
*
* ```ts
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
* ```
*
* @see {@link runSyncExit} for a version that returns an `Exit` type instead of
* throwing an error.
*
* @since 2.0.0
* @category Running Effects
*/
const runSync = unsafeRunSyncEffect;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/DateTime.js
/**
* @since 3.6.0
* @category guards
*/
const isDateTime = isDateTime$1;
/**
* @since 3.6.0
* @category guards
*/
const isTimeZoneOffset = isTimeZoneOffset$1;
/**
* @since 3.6.0
* @category guards
*/
const isTimeZoneNamed = isTimeZoneNamed$1;
/**
* @since 3.6.0
* @category guards
*/
const isUtc = isUtc$1;
/**
* @since 3.6.0
* @category guards
*/
const isZoned = isZoned$1;
/**
* @since 3.6.0
* @category instances
*/
const Equivalence = Equivalence$1;
/**
* Create a `DateTime` from a `Date`.
*
* If the `Date` is invalid, an `IllegalArgumentException` will be thrown.
*
* @since 3.6.0
* @category constructors
*/
const unsafeFromDate = unsafeFromDate$1;
/**
* Create a `DateTime` from one of the following:
*
* - A `DateTime`
* - A `Date` instance (invalid dates will throw an `IllegalArgumentException`)
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
* DateTime.unsafeMake(new Date())
*
* // from parts
* DateTime.unsafeMake({ year: 2024 })
*
* // from string
* DateTime.unsafeMake("2024-01-01")
* ```
*/
const unsafeMake = unsafeMake$1;
/**
* Create a `DateTime.Zoned` using `DateTime.unsafeMake` and a time zone.
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
* DateTime.unsafeMakeZoned(new Date(), { timeZone: "Europe/London" })
* ```
*/
const unsafeMakeZoned = unsafeMakeZoned$1;
/**
* Create a `DateTime.Zoned` from a string.
*
* It uses the format: `YYYY-MM-DDTHH:mm:ss.sss+HH:MM[Time/Zone]`.
*
* @since 3.6.0
* @category constructors
*/
const makeZonedFromString = makeZonedFromString$1;
/**
* Attempt to create a named time zone from a IANA time zone identifier.
*
* If the time zone is invalid, an `IllegalArgumentException` will be thrown.
*
* @since 3.6.0
* @category time zones
*/
const zoneUnsafeMakeNamed = zoneUnsafeMakeNamed$1;
/**
* Create a fixed offset time zone.
*
* @since 3.6.0
* @category time zones
*/
const zoneMakeOffset = zoneMakeOffset$1;
/**
* Try parse a TimeZone from a string
*
* @since 3.6.0
* @category time zones
*/
const zoneFromString = zoneFromString$1;
/**
* Format a `TimeZone` as a string.
*
* @since 3.6.0
* @category time zones
* @example
* ```ts
* import { DateTime, Effect } from "effect"
*
* // Outputs "+03:00"
* DateTime.zoneToString(DateTime.zoneMakeOffset(3 * 60 * 60 * 1000))
*
* // Outputs "Europe/London"
* DateTime.zoneToString(DateTime.zoneUnsafeMakeNamed("Europe/London"))
* ```
*/
const zoneToString = zoneToString$1;
/**
* Get the UTC `Date` of a `DateTime`.
*
* @since 3.6.0
* @category conversions
*/
const toDateUtc = toDateUtc$1;
/**
* Get the milliseconds since the Unix epoch of a `DateTime`.
*
* @since 3.6.0
* @category conversions
*/
const toEpochMillis = toEpochMillis$1;
Tag("effect/DateTime/CurrentTimeZone")();
/**
* Format a `DateTime` as a UTC ISO string.
*
* @since 3.6.0
* @category formatting
*/
const formatIso = formatIso$1;
/**
* Format a `DateTime.Zoned` as a string.
*
* It uses the format: `YYYY-MM-DDTHH:mm:ss.sss+HH:MM[Time/Zone]`.
*
* @since 3.6.0
* @category formatting
*/
const formatIsoZoned = formatIsoZoned$1;
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/schema/util.js
/** @internal */
const getKeysForIndexSignature = (input, parameter) => {
	switch (parameter._tag) {
		case "StringKeyword":
		case "TemplateLiteral": return Object.keys(input);
		case "SymbolKeyword": return Object.getOwnPropertySymbols(input);
		case "Refinement": return getKeysForIndexSignature(input, parameter.from);
	}
};
/** @internal */
const memoizeThunk = (f) => {
	let done = false;
	let a;
	return () => {
		if (done) return a;
		a = f();
		done = true;
		return a;
	};
};
/** @internal */
const isNonEmpty = (x) => Array.isArray(x);
/** @internal */
const isSingle = (x) => !Array.isArray(x);
/** @internal */
const formatPathKey = (key) => `[${formatPropertyKey$1(key)}]`;
/** @internal */
const formatPath = (path) => isNonEmpty(path) ? path.map(formatPathKey).join("") : formatPathKey(path);
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/schema/errors.js
const getErrorMessage$1 = (reason, details, path, ast) => {
	let out = reason;
	if (path && isNonEmptyReadonlyArray(path)) out += `\nat path: ${formatPath(path)}`;
	if (details !== void 0) out += `\ndetails: ${details}`;
	if (ast) out += `\nschema (${ast._tag}): ${ast}`;
	return out;
};
/** @internal */
const getASTUnsupportedKeySchemaErrorMessage = (ast) => getErrorMessage$1("Unsupported key schema", void 0, void 0, ast);
/** @internal */
const getASTUnsupportedLiteralErrorMessage = (literal) => getErrorMessage$1("Unsupported literal", `literal value: ${formatUnknown(literal)}`);
/** @internal */
const getASTDuplicateIndexSignatureErrorMessage = (type) => getErrorMessage$1("Duplicate index signature", `${type} index signature`);
/** @internal */
const getASTIndexSignatureParameterErrorMessage = /* @__PURE__ */ getErrorMessage$1("Unsupported index signature parameter", "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types");
/** @internal */
const getASTRequiredElementFollowinAnOptionalElementErrorMessage = /* @__PURE__ */ getErrorMessage$1("Invalid element", "A required element cannot follow an optional element. ts(1257)");
/** @internal */
const getASTDuplicatePropertySignatureTransformationErrorMessage = (key) => getErrorMessage$1("Duplicate property signature transformation", `Duplicate key ${formatUnknown(key)}`);
/** @internal */
const getASTDuplicatePropertySignatureErrorMessage = (key) => getErrorMessage$1("Duplicate property signature", `Duplicate key ${formatUnknown(key)}`);
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/internal/schema/schemaId.js
/** @internal */
const DateFromSelfSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/DateFromSelf");
/** @internal */
const GreaterThanSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThan");
/** @internal */
const GreaterThanOrEqualToSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanOrEqualTo");
/** @internal */
const LessThanSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThan");
/** @internal */
const LessThanOrEqualToSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/LessThanOrEqualTo");
/** @internal */
const IntSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/Int");
/** @internal */
const NonNaNSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/NonNaN");
/** @internal */
const FiniteSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/Finite");
/** @internal */
const JsonNumberSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/JsonNumber");
/** @internal */
const BetweenSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/Between");
/** @internal */
const GreaterThanOrEqualToBigIntSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanOrEqualToBigint");
/** @internal */
const BetweenBigintSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/BetweenBigint");
/** @internal */
const MinLengthSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/MinLength");
/** @internal */
const MaxLengthSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/MaxLength");
/** @internal */
const LengthSchemaId$1 = /* @__PURE__ */ Symbol.for("effect/SchemaId/Length");
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/SchemaAST.js
/**
* @since 3.10.0
*/
/**
* @category annotations
* @since 3.19.0
* @experimental
*/
const TypeConstructorAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/TypeConstructor");
/**
* @category annotations
* @since 3.10.0
*/
const BrandAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Brand");
/**
* @category annotations
* @since 3.10.0
*/
const SchemaIdAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/SchemaId");
/**
* @category annotations
* @since 3.10.0
*/
const MessageAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Message");
/**
* @category annotations
* @since 3.10.0
*/
const MissingMessageAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/MissingMessage");
/**
* @category annotations
* @since 3.10.0
*/
const IdentifierAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Identifier");
/**
* @category annotations
* @since 3.10.0
*/
const TitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Title");
/** @internal */
const AutoTitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/AutoTitle");
/**
* @category annotations
* @since 3.10.0
*/
const DescriptionAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Description");
/**
* @category annotations
* @since 3.10.0
*/
const ExamplesAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Examples");
/**
* @category annotations
* @since 3.10.0
*/
const DefaultAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Default");
/**
* @category annotations
* @since 3.10.0
*/
const JSONSchemaAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/JSONSchema");
/**
* @category annotations
* @since 3.10.0
*/
const ArbitraryAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Arbitrary");
/**
* @category annotations
* @since 3.10.0
*/
const PrettyAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Pretty");
/**
* @category annotations
* @since 3.10.0
*/
const EquivalenceAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Equivalence");
/**
* @category annotations
* @since 3.10.0
*/
const DocumentationAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Documentation");
/**
* @category annotations
* @since 3.10.0
*/
const ConcurrencyAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Concurrency");
/**
* @category annotations
* @since 3.10.0
*/
const BatchingAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Batching");
/**
* @category annotations
* @since 3.10.0
*/
const ParseIssueTitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/ParseIssueTitle");
/**
* @category annotations
* @since 3.10.0
*/
const ParseOptionsAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/ParseOptions");
/**
* @category annotations
* @since 3.10.0
*/
const DecodingFallbackAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/DecodingFallback");
/**
* @category annotations
* @since 3.10.0
*/
const SurrogateAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Surrogate");
/** @internal */
const StableFilterAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/StableFilter");
/**
* @category annotations
* @since 3.10.0
*/
const getAnnotation = /* @__PURE__ */ dual(2, (annotated, key) => Object.prototype.hasOwnProperty.call(annotated.annotations, key) ? some(annotated.annotations[key]) : none$4());
/**
* @category annotations
* @since 3.10.0
*/
const getBrandAnnotation = /* @__PURE__ */ getAnnotation(BrandAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getMessageAnnotation = /* @__PURE__ */ getAnnotation(MessageAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getMissingMessageAnnotation = /* @__PURE__ */ getAnnotation(MissingMessageAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getTitleAnnotation = /* @__PURE__ */ getAnnotation(TitleAnnotationId);
/** @internal */
const getAutoTitleAnnotation = /* @__PURE__ */ getAnnotation(AutoTitleAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getIdentifierAnnotation = /* @__PURE__ */ getAnnotation(IdentifierAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getDescriptionAnnotation = /* @__PURE__ */ getAnnotation(DescriptionAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getConcurrencyAnnotation = /* @__PURE__ */ getAnnotation(ConcurrencyAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getBatchingAnnotation = /* @__PURE__ */ getAnnotation(BatchingAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getParseIssueTitleAnnotation$1 = /* @__PURE__ */ getAnnotation(ParseIssueTitleAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getParseOptionsAnnotation = /* @__PURE__ */ getAnnotation(ParseOptionsAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getDecodingFallbackAnnotation = /* @__PURE__ */ getAnnotation(DecodingFallbackAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getSurrogateAnnotation = /* @__PURE__ */ getAnnotation(SurrogateAnnotationId);
const getStableFilterAnnotation = /* @__PURE__ */ getAnnotation(StableFilterAnnotationId);
/** @internal */
const hasStableFilter = (annotated) => exists(getStableFilterAnnotation(annotated), (b) => b === true);
/**
* @category annotations
* @since 3.10.0
*/
const JSONIdentifierAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/JSONIdentifier");
/**
* @category annotations
* @since 3.10.0
*/
const getJSONIdentifierAnnotation = /* @__PURE__ */ getAnnotation(JSONIdentifierAnnotationId);
/**
* @category annotations
* @since 3.10.0
*/
const getJSONIdentifier = (annotated) => orElse$1(getJSONIdentifierAnnotation(annotated), () => getIdentifierAnnotation(annotated));
/**
* @category model
* @since 3.10.0
*/
var Declaration = class {
	typeParameters;
	decodeUnknown;
	encodeUnknown;
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "Declaration";
	constructor(typeParameters, decodeUnknown, encodeUnknown, annotations = {}) {
		this.typeParameters = typeParameters;
		this.decodeUnknown = decodeUnknown;
		this.encodeUnknown = encodeUnknown;
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getOrElse(getExpected(this), () => "<declaration schema>");
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			typeParameters: this.typeParameters.map((ast) => ast.toJSON()),
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
const createASTGuard = (tag) => (ast) => ast._tag === tag;
/**
* @category model
* @since 3.10.0
*/
var Literal$1 = class {
	literal;
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "Literal";
	constructor(literal, annotations = {}) {
		this.literal = literal;
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getOrElse(getExpected(this), () => formatUnknown(this.literal));
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			literal: isBigInt(this.literal) ? String(this.literal) : this.literal,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category guards
* @since 3.10.0
*/
const isLiteral = /* @__PURE__ */ createASTGuard("Literal");
const $null = /* @__PURE__ */ new Literal$1(null);
/**
* @category model
* @since 3.10.0
*/
var UniqueSymbol = class {
	symbol;
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "UniqueSymbol";
	constructor(symbol, annotations = {}) {
		this.symbol = symbol;
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getOrElse(getExpected(this), () => formatUnknown(this.symbol));
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			symbol: String(this.symbol),
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category model
* @since 3.10.0
*/
var UndefinedKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "UndefinedKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const undefinedKeyword = /* @__PURE__ */ new UndefinedKeyword({ [TitleAnnotationId]: "undefined" });
/**
* @category model
* @since 3.10.0
*/
var VoidKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "VoidKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const voidKeyword = /* @__PURE__ */ new VoidKeyword({ [TitleAnnotationId]: "void" });
/**
* @category model
* @since 3.10.0
*/
var NeverKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "NeverKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const neverKeyword = /* @__PURE__ */ new NeverKeyword({ [TitleAnnotationId]: "never" });
/**
* @category model
* @since 3.10.0
*/
var UnknownKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "UnknownKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const unknownKeyword = /* @__PURE__ */ new UnknownKeyword({ [TitleAnnotationId]: "unknown" });
/**
* @category model
* @since 3.10.0
*/
var AnyKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "AnyKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const anyKeyword = /* @__PURE__ */ new AnyKeyword({ [TitleAnnotationId]: "any" });
/**
* @category model
* @since 3.10.0
*/
var StringKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "StringKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const stringKeyword = /* @__PURE__ */ new StringKeyword({
	[TitleAnnotationId]: "string",
	[DescriptionAnnotationId]: "a string"
});
/**
* @category guards
* @since 3.10.0
*/
const isStringKeyword = /* @__PURE__ */ createASTGuard("StringKeyword");
/**
* @category model
* @since 3.10.0
*/
var NumberKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "NumberKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const numberKeyword = /* @__PURE__ */ new NumberKeyword({
	[TitleAnnotationId]: "number",
	[DescriptionAnnotationId]: "a number"
});
/**
* @category model
* @since 3.10.0
*/
var BooleanKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "BooleanKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const booleanKeyword = /* @__PURE__ */ new BooleanKeyword({
	[TitleAnnotationId]: "boolean",
	[DescriptionAnnotationId]: "a boolean"
});
/**
* @category model
* @since 3.10.0
*/
var BigIntKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "BigIntKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const bigIntKeyword = /* @__PURE__ */ new BigIntKeyword({
	[TitleAnnotationId]: "bigint",
	[DescriptionAnnotationId]: "a bigint"
});
/**
* @category model
* @since 3.10.0
*/
var SymbolKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "SymbolKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const symbolKeyword = /* @__PURE__ */ new SymbolKeyword({
	[TitleAnnotationId]: "symbol",
	[DescriptionAnnotationId]: "a symbol"
});
/**
* @category guards
* @since 3.10.0
*/
const isSymbolKeyword = /* @__PURE__ */ createASTGuard("SymbolKeyword");
/**
* @category model
* @since 3.10.0
*/
var ObjectKeyword = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "ObjectKeyword";
	constructor(annotations = {}) {
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return formatKeyword(this);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const objectKeyword = /* @__PURE__ */ new ObjectKeyword({
	[TitleAnnotationId]: "object",
	[DescriptionAnnotationId]: "an object in the TypeScript meaning, i.e. the `object` type"
});
/**
* @category model
* @since 3.10.0
*/
var Type$1 = class {
	type;
	annotations;
	constructor(type, annotations = {}) {
		this.type = type;
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			type: this.type.toJSON(),
			annotations: toJSONAnnotations(this.annotations)
		};
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return String(this.type);
	}
};
/**
* @category model
* @since 3.10.0
*/
var OptionalType = class extends Type$1 {
	isOptional;
	constructor(type, isOptional, annotations = {}) {
		super(type, annotations);
		this.isOptional = isOptional;
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			type: this.type.toJSON(),
			isOptional: this.isOptional,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return String(this.type) + (this.isOptional ? "?" : "");
	}
};
const getRestASTs = (rest) => rest.map((annotatedAST) => annotatedAST.type);
/**
* @category model
* @since 3.10.0
*/
var TupleType = class {
	elements;
	rest;
	isReadonly;
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "TupleType";
	constructor(elements, rest, isReadonly, annotations = {}) {
		this.elements = elements;
		this.rest = rest;
		this.isReadonly = isReadonly;
		this.annotations = annotations;
		let hasOptionalElement = false;
		let hasIllegalRequiredElement = false;
		for (const e of elements) if (e.isOptional) hasOptionalElement = true;
		else if (hasOptionalElement) {
			hasIllegalRequiredElement = true;
			break;
		}
		if (hasIllegalRequiredElement || hasOptionalElement && rest.length > 1) throw new Error(getASTRequiredElementFollowinAnOptionalElementErrorMessage);
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getOrElse(getExpected(this), () => formatTuple(this));
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			elements: this.elements.map((e) => e.toJSON()),
			rest: this.rest.map((ast) => ast.toJSON()),
			isReadonly: this.isReadonly,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
const formatTuple = (ast) => {
	const formattedElements = ast.elements.map(String).join(", ");
	return matchLeft(ast.rest, {
		onEmpty: () => `readonly [${formattedElements}]`,
		onNonEmpty: (head, tail) => {
			const formattedHead = String(head);
			const wrappedHead = formattedHead.includes(" | ") ? `(${formattedHead})` : formattedHead;
			if (tail.length > 0) {
				const formattedTail = tail.map(String).join(", ");
				if (ast.elements.length > 0) return `readonly [${formattedElements}, ...${wrappedHead}[], ${formattedTail}]`;
				else return `readonly [...${wrappedHead}[], ${formattedTail}]`;
			} else if (ast.elements.length > 0) return `readonly [${formattedElements}, ...${wrappedHead}[]]`;
			else return `ReadonlyArray<${formattedHead}>`;
		}
	});
};
/**
* @category model
* @since 3.10.0
*/
var PropertySignature = class extends OptionalType {
	name;
	isReadonly;
	constructor(name, type, isOptional, isReadonly, annotations) {
		super(type, isOptional, annotations);
		this.name = name;
		this.isReadonly = isReadonly;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return (this.isReadonly ? "readonly " : "") + String(this.name) + (this.isOptional ? "?" : "") + ": " + this.type;
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			name: String(this.name),
			type: this.type.toJSON(),
			isOptional: this.isOptional,
			isReadonly: this.isReadonly,
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @since 3.10.0
*/
const isParameter = (ast) => {
	switch (ast._tag) {
		case "StringKeyword":
		case "SymbolKeyword":
		case "TemplateLiteral": return true;
		case "Refinement": return isParameter(ast.from);
	}
	return false;
};
/**
* @category model
* @since 3.10.0
*/
var IndexSignature = class {
	type;
	isReadonly;
	/**
	* @since 3.10.0
	*/
	parameter;
	constructor(parameter, type, isReadonly) {
		this.type = type;
		this.isReadonly = isReadonly;
		if (isParameter(parameter)) this.parameter = parameter;
		else throw new Error(getASTIndexSignatureParameterErrorMessage);
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return (this.isReadonly ? "readonly " : "") + `[x: ${this.parameter}]: ${this.type}`;
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			parameter: this.parameter.toJSON(),
			type: this.type.toJSON(),
			isReadonly: this.isReadonly
		};
	}
};
/**
* @category model
* @since 3.10.0
*/
var TypeLiteral = class {
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "TypeLiteral";
	/**
	* @since 3.10.0
	*/
	propertySignatures;
	/**
	* @since 3.10.0
	*/
	indexSignatures;
	constructor(propertySignatures, indexSignatures, annotations = {}) {
		this.annotations = annotations;
		const keys = {};
		for (let i = 0; i < propertySignatures.length; i++) {
			const name = propertySignatures[i].name;
			if (Object.prototype.hasOwnProperty.call(keys, name)) throw new Error(getASTDuplicatePropertySignatureErrorMessage(name));
			keys[name] = null;
		}
		const parameters = {
			string: false,
			symbol: false
		};
		for (let i = 0; i < indexSignatures.length; i++) {
			const encodedParameter = getEncodedParameter(indexSignatures[i].parameter);
			if (isStringKeyword(encodedParameter)) {
				if (parameters.string) throw new Error(getASTDuplicateIndexSignatureErrorMessage("string"));
				parameters.string = true;
			} else if (isSymbolKeyword(encodedParameter)) {
				if (parameters.symbol) throw new Error(getASTDuplicateIndexSignatureErrorMessage("symbol"));
				parameters.symbol = true;
			}
		}
		this.propertySignatures = propertySignatures;
		this.indexSignatures = indexSignatures;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getOrElse(getExpected(this), () => formatTypeLiteral(this));
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			propertySignatures: this.propertySignatures.map((ps) => ps.toJSON()),
			indexSignatures: this.indexSignatures.map((ps) => ps.toJSON()),
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
const formatIndexSignatures = (iss) => iss.map(String).join("; ");
const formatTypeLiteral = (ast) => {
	if (ast.propertySignatures.length > 0) {
		const pss = ast.propertySignatures.map(String).join("; ");
		if (ast.indexSignatures.length > 0) return `{ ${pss}; ${formatIndexSignatures(ast.indexSignatures)} }`;
		else return `{ ${pss} }`;
	} else if (ast.indexSignatures.length > 0) return `{ ${formatIndexSignatures(ast.indexSignatures)} }`;
	else return "{}";
};
const sortCandidates = /* @__PURE__ */ sort(/* @__PURE__ */ mapInput(Order$1, (ast) => {
	switch (ast._tag) {
		case "AnyKeyword": return 0;
		case "UnknownKeyword": return 1;
		case "ObjectKeyword": return 2;
		case "StringKeyword":
		case "NumberKeyword":
		case "BooleanKeyword":
		case "BigIntKeyword":
		case "SymbolKeyword": return 3;
	}
	return 4;
}));
const literalMap = {
	string: "StringKeyword",
	number: "NumberKeyword",
	boolean: "BooleanKeyword",
	bigint: "BigIntKeyword"
};
/** @internal */
const flatten = (candidates) => flatMap$4(candidates, (ast) => isUnion(ast) ? flatten(ast.types) : [ast]);
/** @internal */
const unify = (candidates) => {
	const cs = sortCandidates(candidates);
	const out = [];
	const uniques = {};
	const literals = [];
	for (const ast of cs) switch (ast._tag) {
		case "NeverKeyword": break;
		case "AnyKeyword": return [anyKeyword];
		case "UnknownKeyword": return [unknownKeyword];
		case "ObjectKeyword":
		case "UndefinedKeyword":
		case "VoidKeyword":
		case "StringKeyword":
		case "NumberKeyword":
		case "BooleanKeyword":
		case "BigIntKeyword":
		case "SymbolKeyword":
			if (!uniques[ast._tag]) {
				uniques[ast._tag] = ast;
				out.push(ast);
			}
			break;
		case "Literal": {
			const type = typeof ast.literal;
			switch (type) {
				case "string":
				case "number":
				case "bigint":
				case "boolean":
					if (!uniques[literalMap[type]] && !literals.includes(ast.literal)) {
						literals.push(ast.literal);
						out.push(ast);
					}
					break;
				case "object":
					if (!literals.includes(ast.literal)) {
						literals.push(ast.literal);
						out.push(ast);
					}
					break;
			}
			break;
		}
		case "UniqueSymbol":
			if (!uniques["SymbolKeyword"] && !literals.includes(ast.symbol)) {
				literals.push(ast.symbol);
				out.push(ast);
			}
			break;
		case "TupleType":
			if (!uniques["ObjectKeyword"]) out.push(ast);
			break;
		case "TypeLiteral":
			if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
				if (!uniques["{}"]) {
					uniques["{}"] = ast;
					out.push(ast);
				}
			} else if (!uniques["ObjectKeyword"]) out.push(ast);
			break;
		default: out.push(ast);
	}
	return out;
};
/**
* @category model
* @since 3.10.0
*/
var Union$1 = class Union$1 {
	types;
	annotations;
	static make = (types, annotations) => {
		return isMembers(types) ? new Union$1(types, annotations) : types.length === 1 ? types[0] : neverKeyword;
	};
	/** @internal */
	static unify = (candidates, annotations) => {
		return Union$1.make(unify(flatten(candidates)), annotations);
	};
	/**
	* @since 3.10.0
	*/
	_tag = "Union";
	constructor(types, annotations = {}) {
		this.types = types;
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getOrElse(getExpected(this), () => this.types.map(String).join(" | "));
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			types: this.types.map((ast) => ast.toJSON()),
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/** @internal */
const mapMembers = (members, f) => members.map(f);
/** @internal */
const isMembers = (as) => as.length > 1;
/**
* @category guards
* @since 3.10.0
*/
const isUnion = /* @__PURE__ */ createASTGuard("Union");
const toJSONMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Schema/AST/toJSONMemoMap"), () => /* @__PURE__ */ new WeakMap());
/**
* @category model
* @since 3.10.0
*/
var Suspend = class {
	f;
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "Suspend";
	constructor(f, annotations = {}) {
		this.f = f;
		this.annotations = annotations;
		this.f = memoizeThunk(f);
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getExpected(this).pipe(orElse$1(() => flatMap$5(liftThrowable(this.f)(), (ast) => getExpected(ast))), getOrElse(() => "<suspended schema>"));
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		const ast = this.f();
		let out = toJSONMemoMap.get(ast);
		if (out) return out;
		toJSONMemoMap.set(ast, { _tag: this._tag });
		out = {
			_tag: this._tag,
			ast: ast.toJSON(),
			annotations: toJSONAnnotations(this.annotations)
		};
		toJSONMemoMap.set(ast, out);
		return out;
	}
};
/**
* @category model
* @since 3.10.0
*/
var Refinement$1 = class {
	from;
	filter;
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "Refinement";
	constructor(from, filter, annotations = {}) {
		this.from = from;
		this.filter = filter;
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getIdentifierAnnotation(this).pipe(getOrElse(() => match$3(getOrElseExpected(this), {
			onNone: () => `{ ${this.from} | filter }`,
			onSome: (expected) => isRefinement$1(this.from) ? String(this.from) + " & " + expected : expected
		})));
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			from: this.from.toJSON(),
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category guards
* @since 3.10.0
*/
const isRefinement$1 = /* @__PURE__ */ createASTGuard("Refinement");
/**
* @since 3.10.0
*/
const defaultParseOption = {};
/**
* @category model
* @since 3.10.0
*/
var Transformation$1 = class {
	from;
	to;
	transformation;
	annotations;
	/**
	* @since 3.10.0
	*/
	_tag = "Transformation";
	constructor(from, to, transformation, annotations = {}) {
		this.from = from;
		this.to = to;
		this.transformation = transformation;
		this.annotations = annotations;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return getOrElse(getExpected(this), () => `(${String(this.from)} <-> ${String(this.to)})`);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_tag: this._tag,
			from: this.from.toJSON(),
			to: this.to.toJSON(),
			annotations: toJSONAnnotations(this.annotations)
		};
	}
};
/**
* @category model
* @since 3.10.0
*/
var FinalTransformation = class {
	decode;
	encode;
	/**
	* @since 3.10.0
	*/
	_tag = "FinalTransformation";
	constructor(decode, encode) {
		this.decode = decode;
		this.encode = encode;
	}
};
/**
* Represents a `PropertySignature -> PropertySignature` transformation
*
* The semantic of `decode` is:
* - `none()` represents the absence of the key/value pair
* - `some(value)` represents the presence of the key/value pair
*
* The semantic of `encode` is:
* - `none()` you don't want to output the key/value pair
* - `some(value)` you want to output the key/value pair
*
* @category model
* @since 3.10.0
*/
var PropertySignatureTransformation$1 = class {
	from;
	to;
	decode;
	encode;
	constructor(from, to, decode, encode) {
		this.from = from;
		this.to = to;
		this.decode = decode;
		this.encode = encode;
	}
};
/**
* @category model
* @since 3.10.0
*/
var TypeLiteralTransformation = class {
	propertySignatureTransformations;
	/**
	* @since 3.10.0
	*/
	_tag = "TypeLiteralTransformation";
	constructor(propertySignatureTransformations) {
		this.propertySignatureTransformations = propertySignatureTransformations;
		const fromKeys = {};
		const toKeys = {};
		for (const pst of propertySignatureTransformations) {
			const from = pst.from;
			if (fromKeys[from]) throw new Error(getASTDuplicatePropertySignatureTransformationErrorMessage(from));
			fromKeys[from] = true;
			const to = pst.to;
			if (toKeys[to]) throw new Error(getASTDuplicatePropertySignatureTransformationErrorMessage(to));
			toKeys[to] = true;
		}
	}
};
/**
* Merges a set of new annotations with existing ones, potentially overwriting
* any duplicates.
*
* Any previously existing identifier annotations are deleted.
*
* @since 3.10.0
*/
const annotations = (ast, overrides) => {
	const d = Object.getOwnPropertyDescriptors(ast);
	const base = { ...ast.annotations };
	delete base[IdentifierAnnotationId];
	const value = {
		...base,
		...overrides
	};
	const surrogate = getSurrogateAnnotation(ast);
	if (isSome(surrogate)) value[SurrogateAnnotationId] = annotations(surrogate.value, overrides);
	d.annotations.value = value;
	return Object.create(Object.getPrototypeOf(ast), d);
};
const STRING_KEYWORD_PATTERN = "[\\s\\S]*?";
const NUMBER_KEYWORD_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
const getTemplateLiteralSpanTypePattern = (type, capture) => {
	switch (type._tag) {
		case "Literal": return escape(String(type.literal));
		case "StringKeyword": return STRING_KEYWORD_PATTERN;
		case "NumberKeyword": return NUMBER_KEYWORD_PATTERN;
		case "TemplateLiteral": return getTemplateLiteralPattern(type, capture, false);
		case "Union": return type.types.map((type) => getTemplateLiteralSpanTypePattern(type, capture)).join("|");
	}
};
const handleTemplateLiteralSpanTypeParens = (type, s, capture, top) => {
	if (isUnion(type)) {
		if (capture && !top) return `(?:${s})`;
	} else if (!capture || !top) return s;
	return `(${s})`;
};
const getTemplateLiteralPattern = (ast, capture, top) => {
	let pattern = ``;
	if (ast.head !== "") {
		const head = escape(ast.head);
		pattern += capture && top ? `(${head})` : head;
	}
	for (const span of ast.spans) {
		const spanPattern = getTemplateLiteralSpanTypePattern(span.type, capture);
		pattern += handleTemplateLiteralSpanTypeParens(span.type, spanPattern, capture, top);
		if (span.literal !== "") {
			const literal = escape(span.literal);
			pattern += capture && top ? `(${literal})` : literal;
		}
	}
	return pattern;
};
/**
* Generates a regular expression from a `TemplateLiteral` AST node.
*
* @see {@link getTemplateLiteralCapturingRegExp} for a variant that captures the pattern.
*
* @since 3.10.0
*/
const getTemplateLiteralRegExp = (ast) => new RegExp(`^${getTemplateLiteralPattern(ast, false, true)}$`);
/** @internal */
const record = (key, value) => {
	const propertySignatures = [];
	const indexSignatures = [];
	const go = (key) => {
		switch (key._tag) {
			case "NeverKeyword": break;
			case "StringKeyword":
			case "SymbolKeyword":
			case "TemplateLiteral":
			case "Refinement":
				indexSignatures.push(new IndexSignature(key, value, true));
				break;
			case "Literal":
				if (isString(key.literal) || isNumber(key.literal)) propertySignatures.push(new PropertySignature(key.literal, value, false, true));
				else throw new Error(getASTUnsupportedLiteralErrorMessage(key.literal));
				break;
			case "Enums":
				for (const [_, name] of key.enums) propertySignatures.push(new PropertySignature(name, value, false, true));
				break;
			case "UniqueSymbol":
				propertySignatures.push(new PropertySignature(key.symbol, value, false, true));
				break;
			case "Union":
				key.types.forEach(go);
				break;
			default: throw new Error(getASTUnsupportedKeySchemaErrorMessage(key));
		}
	};
	go(key);
	return {
		propertySignatures,
		indexSignatures
	};
};
/**
* Creates a new AST with shallow mutability applied to its properties.
*
* @since 3.10.0
*/
const mutable$1 = (ast) => {
	switch (ast._tag) {
		case "TupleType": return ast.isReadonly === false ? ast : new TupleType(ast.elements, ast.rest, false, ast.annotations);
		case "TypeLiteral": {
			const propertySignatures = changeMap(ast.propertySignatures, (ps) => ps.isReadonly === false ? ps : new PropertySignature(ps.name, ps.type, ps.isOptional, false, ps.annotations));
			const indexSignatures = changeMap(ast.indexSignatures, (is) => is.isReadonly === false ? is : new IndexSignature(is.parameter, is.type, false));
			return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures, ast.annotations);
		}
		case "Union": {
			const types = changeMap(ast.types, mutable$1);
			return types === ast.types ? ast : Union$1.make(types, ast.annotations);
		}
		case "Suspend": return new Suspend(() => mutable$1(ast.f()), ast.annotations);
		case "Refinement": {
			const from = mutable$1(ast.from);
			return from === ast.from ? ast : new Refinement$1(from, ast.filter, ast.annotations);
		}
		case "Transformation": {
			const from = mutable$1(ast.from);
			const to = mutable$1(ast.to);
			return from === ast.from && to === ast.to ? ast : new Transformation$1(from, to, ast.transformation, ast.annotations);
		}
	}
	return ast;
};
/** @internal */
const pickAnnotations = (annotationIds) => (annotated) => {
	let out = void 0;
	for (const id of annotationIds) if (Object.prototype.hasOwnProperty.call(annotated.annotations, id)) {
		if (out === void 0) out = {};
		out[id] = annotated.annotations[id];
	}
	return out;
};
const preserveTransformationAnnotations = /* @__PURE__ */ pickAnnotations([
	ExamplesAnnotationId,
	DefaultAnnotationId,
	JSONSchemaAnnotationId,
	ArbitraryAnnotationId,
	PrettyAnnotationId,
	EquivalenceAnnotationId
]);
/**
* @since 3.10.0
*/
const typeAST = (ast) => {
	switch (ast._tag) {
		case "Declaration": {
			const typeParameters = changeMap(ast.typeParameters, typeAST);
			return typeParameters === ast.typeParameters ? ast : new Declaration(typeParameters, ast.decodeUnknown, ast.encodeUnknown, ast.annotations);
		}
		case "TupleType": {
			const elements = changeMap(ast.elements, (e) => {
				const type = typeAST(e.type);
				return type === e.type ? e : new OptionalType(type, e.isOptional);
			});
			const restASTs = getRestASTs(ast.rest);
			const rest = changeMap(restASTs, typeAST);
			return elements === ast.elements && rest === restASTs ? ast : new TupleType(elements, rest.map((type) => new Type$1(type)), ast.isReadonly, ast.annotations);
		}
		case "TypeLiteral": {
			const propertySignatures = changeMap(ast.propertySignatures, (p) => {
				const type = typeAST(p.type);
				return type === p.type ? p : new PropertySignature(p.name, type, p.isOptional, p.isReadonly);
			});
			const indexSignatures = changeMap(ast.indexSignatures, (is) => {
				const type = typeAST(is.type);
				return type === is.type ? is : new IndexSignature(is.parameter, type, is.isReadonly);
			});
			return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures, ast.annotations);
		}
		case "Union": {
			const types = changeMap(ast.types, typeAST);
			return types === ast.types ? ast : Union$1.make(types, ast.annotations);
		}
		case "Suspend": return new Suspend(() => typeAST(ast.f()), ast.annotations);
		case "Refinement": {
			const from = typeAST(ast.from);
			return from === ast.from ? ast : new Refinement$1(from, ast.filter, ast.annotations);
		}
		case "Transformation": {
			const preserve = preserveTransformationAnnotations(ast);
			return typeAST(preserve !== void 0 ? annotations(ast.to, preserve) : ast.to);
		}
	}
	return ast;
};
function changeMap(as, f) {
	let changed = false;
	const out = allocate(as.length);
	for (let i = 0; i < as.length; i++) {
		const a = as[i];
		const fa = f(a);
		if (fa !== a) changed = true;
		out[i] = fa;
	}
	return changed ? out : as;
}
/**
* Returns the from part of a transformation if it exists
*
* @internal
*/
const getTransformationFrom = (ast) => {
	switch (ast._tag) {
		case "Transformation": return ast.from;
		case "Refinement": return getTransformationFrom(ast.from);
		case "Suspend": return getTransformationFrom(ast.f());
	}
};
const encodedAST_ = (ast, isBound) => {
	switch (ast._tag) {
		case "Declaration": {
			const typeParameters = changeMap(ast.typeParameters, (ast) => encodedAST_(ast, isBound));
			return typeParameters === ast.typeParameters ? ast : new Declaration(typeParameters, ast.decodeUnknown, ast.encodeUnknown);
		}
		case "TupleType": {
			const elements = changeMap(ast.elements, (e) => {
				const type = encodedAST_(e.type, isBound);
				return type === e.type ? e : new OptionalType(type, e.isOptional);
			});
			const restASTs = getRestASTs(ast.rest);
			const rest = changeMap(restASTs, (ast) => encodedAST_(ast, isBound));
			return elements === ast.elements && rest === restASTs ? ast : new TupleType(elements, rest.map((ast) => new Type$1(ast)), ast.isReadonly);
		}
		case "TypeLiteral": {
			const propertySignatures = changeMap(ast.propertySignatures, (ps) => {
				const type = encodedAST_(ps.type, isBound);
				return type === ps.type ? ps : new PropertySignature(ps.name, type, ps.isOptional, ps.isReadonly);
			});
			const indexSignatures = changeMap(ast.indexSignatures, (is) => {
				const type = encodedAST_(is.type, isBound);
				return type === is.type ? is : new IndexSignature(is.parameter, type, is.isReadonly);
			});
			return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures);
		}
		case "Union": {
			const types = changeMap(ast.types, (ast) => encodedAST_(ast, isBound));
			return types === ast.types ? ast : Union$1.make(types);
		}
		case "Suspend": {
			let borrowedAnnotations = void 0;
			const identifier = getJSONIdentifier(ast);
			if (isSome(identifier)) {
				const suffix = isBound ? "Bound" : "";
				borrowedAnnotations = { [JSONIdentifierAnnotationId]: `${identifier.value}Encoded${suffix}` };
			}
			return new Suspend(() => encodedAST_(ast.f(), isBound), borrowedAnnotations);
		}
		case "Refinement": {
			const from = encodedAST_(ast.from, isBound);
			if (isBound) {
				if (from === ast.from) return ast;
				if (getTransformationFrom(ast.from) === void 0 && hasStableFilter(ast)) return new Refinement$1(from, ast.filter, ast.annotations);
				return from;
			} else return from;
		}
		case "Transformation": return encodedAST_(ast.from, isBound);
	}
	return ast;
};
/**
* @since 3.10.0
*/
const encodedAST = (ast) => encodedAST_(ast, false);
const toJSONAnnotations = (annotations) => {
	const out = {};
	for (const k of Object.getOwnPropertySymbols(annotations)) out[String(k)] = annotations[k];
	return out;
};
/** @internal */
const getEncodedParameter = (ast) => {
	switch (ast._tag) {
		case "StringKeyword":
		case "SymbolKeyword":
		case "TemplateLiteral": return ast;
		case "Refinement": return getEncodedParameter(ast.from);
	}
};
const formatKeyword = (ast) => getOrElse(getExpected(ast), () => ast._tag);
function getBrands(ast) {
	return match$3(getBrandAnnotation(ast), {
		onNone: () => "",
		onSome: (brands) => brands.map((brand) => ` & Brand<${formatUnknown(brand)}>`).join("")
	});
}
const getOrElseExpected = (ast) => getTitleAnnotation(ast).pipe(orElse$1(() => getDescriptionAnnotation(ast)), orElse$1(() => getAutoTitleAnnotation(ast)), map$6((s) => s + getBrands(ast)));
const getExpected = (ast) => orElse$1(getIdentifierAnnotation(ast), () => getOrElseExpected(ast));
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/ParseResult.js
/**
* @since 3.10.0
*/
/**
* @category model
* @since 3.10.0
*/
var Pointer = class {
	path;
	actual;
	issue;
	/**
	* @since 3.10.0
	*/
	_tag = "Pointer";
	constructor(path, actual, issue) {
		this.path = path;
		this.actual = actual;
		this.issue = issue;
	}
};
/**
* Error that occurs when an unexpected key or index is present.
*
* @category model
* @since 3.10.0
*/
var Unexpected = class {
	actual;
	message;
	/**
	* @since 3.10.0
	*/
	_tag = "Unexpected";
	constructor(actual, message) {
		this.actual = actual;
		this.message = message;
	}
};
/**
* Error that occurs when a required key or index is missing.
*
* @category model
* @since 3.10.0
*/
var Missing = class {
	ast;
	message;
	/**
	* @since 3.10.0
	*/
	_tag = "Missing";
	/**
	* @since 3.10.0
	*/
	actual = void 0;
	constructor(ast, message) {
		this.ast = ast;
		this.message = message;
	}
};
/**
* Error that contains multiple issues.
*
* @category model
* @since 3.10.0
*/
var Composite = class {
	ast;
	actual;
	issues;
	output;
	/**
	* @since 3.10.0
	*/
	_tag = "Composite";
	constructor(ast, actual, issues, output) {
		this.ast = ast;
		this.actual = actual;
		this.issues = issues;
		this.output = output;
	}
};
/**
* Error that occurs when a refinement has an error.
*
* @category model
* @since 3.10.0
*/
var Refinement = class {
	ast;
	actual;
	kind;
	issue;
	/**
	* @since 3.10.0
	*/
	_tag = "Refinement";
	constructor(ast, actual, kind, issue) {
		this.ast = ast;
		this.actual = actual;
		this.kind = kind;
		this.issue = issue;
	}
};
/**
* Error that occurs when a transformation has an error.
*
* @category model
* @since 3.10.0
*/
var Transformation = class {
	ast;
	actual;
	kind;
	issue;
	/**
	* @since 3.10.0
	*/
	_tag = "Transformation";
	constructor(ast, actual, kind, issue) {
		this.ast = ast;
		this.actual = actual;
		this.kind = kind;
		this.issue = issue;
	}
};
/**
* The `Type` variant of the `ParseIssue` type represents an error that occurs when the `actual` value is not of the expected type.
* The `ast` field specifies the expected type, and the `actual` field contains the value that caused the error.
*
* @category model
* @since 3.10.0
*/
var Type = class {
	ast;
	actual;
	message;
	/**
	* @since 3.10.0
	*/
	_tag = "Type";
	constructor(ast, actual, message) {
		this.ast = ast;
		this.actual = actual;
		this.message = message;
	}
};
/**
* The `Forbidden` variant of the `ParseIssue` type represents a forbidden operation, such as when encountering an Effect that is not allowed to execute (e.g., using `runSync`).
*
* @category model
* @since 3.10.0
*/
var Forbidden = class {
	ast;
	actual;
	message;
	/**
	* @since 3.10.0
	*/
	_tag = "Forbidden";
	constructor(ast, actual, message) {
		this.ast = ast;
		this.actual = actual;
		this.message = message;
	}
};
/**
* @category type id
* @since 3.10.0
*/
const ParseErrorTypeId = /* @__PURE__ */ Symbol.for("effect/Schema/ParseErrorTypeId");
/**
* @since 3.10.0
*/
var ParseError = class extends TaggedError$1("ParseError") {
	/**
	* @since 3.10.0
	*/
	[ParseErrorTypeId] = ParseErrorTypeId;
	get message() {
		return this.toString();
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return TreeFormatter.formatIssueSync(this.issue);
	}
	/**
	* @since 3.10.0
	*/
	toJSON() {
		return {
			_id: "ParseError",
			message: this.toString()
		};
	}
	/**
	* @since 3.10.0
	*/
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
/**
* @category constructors
* @since 3.10.0
*/
const parseError = (issue) => new ParseError({ issue });
/**
* @category constructors
* @since 3.10.0
*/
const succeed = right;
/**
* @category constructors
* @since 3.10.0
*/
const fail = left;
const _try = try_;
/**
* @category constructors
* @since 3.10.0
*/
const fromOption = fromOption$1;
const isEither = isEither$1;
/**
* @category optimisation
* @since 3.10.0
*/
const flatMap = /* @__PURE__ */ dual(2, (self, f) => {
	return isEither(self) ? match$4(self, {
		onLeft: left,
		onRight: f
	}) : flatMap$1(self, f);
});
/**
* @category optimisation
* @since 3.10.0
*/
const map = /* @__PURE__ */ dual(2, (self, f) => {
	return isEither(self) ? map$7(self, f) : map$1(self, f);
});
/**
* @category optimisation
* @since 3.10.0
*/
const mapError = /* @__PURE__ */ dual(2, (self, f) => {
	return isEither(self) ? mapLeft(self, f) : mapError$1(self, f);
});
/**
* @category optimisation
* @since 3.10.0
*/
const mapBoth = /* @__PURE__ */ dual(2, (self, options) => {
	return isEither(self) ? mapBoth$3(self, {
		onLeft: options.onFailure,
		onRight: options.onSuccess
	}) : mapBoth$1(self, options);
});
/**
* @category optimisation
* @since 3.10.0
*/
const orElse = /* @__PURE__ */ dual(2, (self, f) => {
	return isEither(self) ? match$4(self, {
		onLeft: f,
		onRight: right
	}) : catchAll(self, f);
});
/** @internal */
const mergeInternalOptions = (options, overrideOptions) => {
	if (overrideOptions === void 0 || isNumber(overrideOptions)) return options;
	if (options === void 0) return overrideOptions;
	return {
		...options,
		...overrideOptions
	};
};
const getEither = (ast, isDecoding, options) => {
	const parser = goMemo(ast, isDecoding);
	return (u, overrideOptions) => parser(u, mergeInternalOptions(options, overrideOptions));
};
const getSync = (ast, isDecoding, options) => {
	const parser = getEither(ast, isDecoding, options);
	return (input, overrideOptions) => getOrThrowWith$1(parser(input, overrideOptions), parseError);
};
const getEffect = (ast, isDecoding, options) => {
	const parser = goMemo(ast, isDecoding);
	return (input, overrideOptions) => parser(input, {
		...mergeInternalOptions(options, overrideOptions),
		isEffectAllowed: true
	});
};
/**
* @category decoding
* @since 3.10.0
*/
const decodeUnknownEither$1 = (schema, options) => getEither(schema.ast, true, options);
/**
* @category decoding
* @since 3.10.0
*/
const decodeUnknown = (schema, options) => getEffect(schema.ast, true, options);
/**
* @category encoding
* @since 3.10.0
*/
const encodeUnknown = (schema, options) => getEffect(schema.ast, false, options);
/**
* @throws `ParseError`
* @category validation
* @since 3.10.0
*/
const validateSync = (schema, options) => getSync(typeAST(schema.ast), true, options);
const decodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/ParseResult/decodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
const encodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/ParseResult/encodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
const goMemo = (ast, isDecoding) => {
	const memoMap = isDecoding ? decodeMemoMap : encodeMemoMap;
	const memo = memoMap.get(ast);
	if (memo) return memo;
	const raw = go(ast, isDecoding);
	const parseOptionsAnnotation = getParseOptionsAnnotation(ast);
	const parserWithOptions = isSome(parseOptionsAnnotation) ? (i, options) => raw(i, mergeInternalOptions(options, parseOptionsAnnotation.value)) : raw;
	const decodingFallbackAnnotation = getDecodingFallbackAnnotation(ast);
	const parser = isDecoding && isSome(decodingFallbackAnnotation) ? (i, options) => handleForbidden(orElse(parserWithOptions(i, options), decodingFallbackAnnotation.value), ast, i, options) : parserWithOptions;
	memoMap.set(ast, parser);
	return parser;
};
const getConcurrency = (ast) => getOrUndefined(getConcurrencyAnnotation(ast));
const getBatching = (ast) => getOrUndefined(getBatchingAnnotation(ast));
const go = (ast, isDecoding) => {
	switch (ast._tag) {
		case "Refinement": if (isDecoding) {
			const from = goMemo(ast.from, true);
			return (i, options) => {
				options = options ?? defaultParseOption;
				const allErrors = options?.errors === "all";
				return handleForbidden(flatMap(orElse(from(i, options), (ef) => {
					const issue = new Refinement(ast, i, "From", ef);
					if (allErrors && hasStableFilter(ast) && isComposite(ef)) return match$3(ast.filter(i, options, ast), {
						onNone: () => left(issue),
						onSome: (ep) => left(new Composite(ast, i, [issue, new Refinement(ast, i, "Predicate", ep)]))
					});
					return left(issue);
				}), (a) => match$3(ast.filter(a, options, ast), {
					onNone: () => right(a),
					onSome: (ep) => left(new Refinement(ast, i, "Predicate", ep))
				})), ast, i, options);
			};
		} else {
			const from = goMemo(typeAST(ast), true);
			const to = goMemo(dropRightRefinement(ast.from), false);
			return (i, options) => handleForbidden(flatMap(from(i, options), (a) => to(a, options)), ast, i, options);
		}
		case "Transformation": {
			const transform = getFinalTransformation(ast.transformation, isDecoding);
			const from = isDecoding ? goMemo(ast.from, true) : goMemo(ast.to, false);
			const to = isDecoding ? goMemo(ast.to, true) : goMemo(ast.from, false);
			return (i, options) => handleForbidden(flatMap(mapError(from(i, options), (e) => new Transformation(ast, i, isDecoding ? "Encoded" : "Type", e)), (a) => flatMap(mapError(transform(a, options ?? defaultParseOption, ast, i), (e) => new Transformation(ast, i, "Transformation", e)), (i2) => mapError(to(i2, options), (e) => new Transformation(ast, i, isDecoding ? "Type" : "Encoded", e)))), ast, i, options);
		}
		case "Declaration": {
			const parse = isDecoding ? ast.decodeUnknown(...ast.typeParameters) : ast.encodeUnknown(...ast.typeParameters);
			return (i, options) => handleForbidden(parse(i, options ?? defaultParseOption, ast), ast, i, options);
		}
		case "Literal": return fromRefinement(ast, (u) => u === ast.literal);
		case "UniqueSymbol": return fromRefinement(ast, (u) => u === ast.symbol);
		case "UndefinedKeyword": return fromRefinement(ast, isUndefined);
		case "NeverKeyword": return fromRefinement(ast, isNever);
		case "UnknownKeyword":
		case "AnyKeyword":
		case "VoidKeyword": return right;
		case "StringKeyword": return fromRefinement(ast, isString);
		case "NumberKeyword": return fromRefinement(ast, isNumber);
		case "BooleanKeyword": return fromRefinement(ast, isBoolean);
		case "BigIntKeyword": return fromRefinement(ast, isBigInt);
		case "SymbolKeyword": return fromRefinement(ast, isSymbol);
		case "ObjectKeyword": return fromRefinement(ast, isObject);
		case "Enums": return fromRefinement(ast, (u) => ast.enums.some(([_, value]) => value === u));
		case "TemplateLiteral": {
			const regex = getTemplateLiteralRegExp(ast);
			return fromRefinement(ast, (u) => isString(u) && regex.test(u));
		}
		case "TupleType": {
			const elements = ast.elements.map((e) => goMemo(e.type, isDecoding));
			const rest = ast.rest.map((annotatedAST) => goMemo(annotatedAST.type, isDecoding));
			let requiredTypes = ast.elements.filter((e) => !e.isOptional);
			if (ast.rest.length > 0) requiredTypes = requiredTypes.concat(ast.rest.slice(1));
			const requiredLen = requiredTypes.length;
			const expectedIndexes = ast.elements.length > 0 ? ast.elements.map((_, i) => i).join(" | ") : "never";
			const concurrency = getConcurrency(ast);
			const batching = getBatching(ast);
			return (input, options) => {
				if (!isArray(input)) return left(new Type(ast, input));
				const allErrors = options?.errors === "all";
				const es = [];
				let stepKey = 0;
				const output = [];
				const len = input.length;
				for (let i = len; i <= requiredLen - 1; i++) {
					const e = new Pointer(i, input, new Missing(requiredTypes[i - len]));
					if (allErrors) {
						es.push([stepKey++, e]);
						continue;
					} else return left(new Composite(ast, input, e, output));
				}
				if (ast.rest.length === 0) for (let i = ast.elements.length; i <= len - 1; i++) {
					const e = new Pointer(i, input, new Unexpected(input[i], `is unexpected, expected: ${expectedIndexes}`));
					if (allErrors) {
						es.push([stepKey++, e]);
						continue;
					} else return left(new Composite(ast, input, e, output));
				}
				let i = 0;
				let queue = void 0;
				for (; i < elements.length; i++) if (len < i + 1) {
					if (ast.elements[i].isOptional) continue;
				} else {
					const parser = elements[i];
					const te = parser(input[i], options);
					if (isEither(te)) {
						if (isLeft(te)) {
							const e = new Pointer(i, input, te.left);
							if (allErrors) {
								es.push([stepKey++, e]);
								continue;
							} else return left(new Composite(ast, input, e, sortByIndex(output)));
						}
						output.push([stepKey++, te.right]);
					} else {
						const nk = stepKey++;
						const index = i;
						if (!queue) queue = [];
						queue.push(({ es, output }) => flatMap$1(either(te), (t) => {
							if (isLeft(t)) {
								const e = new Pointer(index, input, t.left);
								if (allErrors) {
									es.push([nk, e]);
									return _void;
								} else return left(new Composite(ast, input, e, sortByIndex(output)));
							}
							output.push([nk, t.right]);
							return _void;
						}));
					}
				}
				if (isNonEmptyReadonlyArray(rest)) {
					const [head, ...tail] = rest;
					for (; i < len - tail.length; i++) {
						const te = head(input[i], options);
						if (isEither(te)) if (isLeft(te)) {
							const e = new Pointer(i, input, te.left);
							if (allErrors) {
								es.push([stepKey++, e]);
								continue;
							} else return left(new Composite(ast, input, e, sortByIndex(output)));
						} else output.push([stepKey++, te.right]);
						else {
							const nk = stepKey++;
							const index = i;
							if (!queue) queue = [];
							queue.push(({ es, output }) => flatMap$1(either(te), (t) => {
								if (isLeft(t)) {
									const e = new Pointer(index, input, t.left);
									if (allErrors) {
										es.push([nk, e]);
										return _void;
									} else return left(new Composite(ast, input, e, sortByIndex(output)));
								} else {
									output.push([nk, t.right]);
									return _void;
								}
							}));
						}
					}
					for (let j = 0; j < tail.length; j++) {
						const index = i + j;
						if (len < index + 1) continue;
						else {
							const te = tail[j](input[index], options);
							if (isEither(te)) {
								if (isLeft(te)) {
									const e = new Pointer(index, input, te.left);
									if (allErrors) {
										es.push([stepKey++, e]);
										continue;
									} else return left(new Composite(ast, input, e, sortByIndex(output)));
								}
								output.push([stepKey++, te.right]);
							} else {
								const nk = stepKey++;
								if (!queue) queue = [];
								queue.push(({ es, output }) => flatMap$1(either(te), (t) => {
									if (isLeft(t)) {
										const e = new Pointer(index, input, t.left);
										if (allErrors) {
											es.push([nk, e]);
											return _void;
										} else return left(new Composite(ast, input, e, sortByIndex(output)));
									}
									output.push([nk, t.right]);
									return _void;
								}));
							}
						}
					}
				}
				const computeResult = ({ es, output }) => isNonEmptyArray(es) ? left(new Composite(ast, input, sortByIndex(es), sortByIndex(output))) : right(sortByIndex(output));
				if (queue && queue.length > 0) {
					const cqueue = queue;
					return suspend$1(() => {
						const state = {
							es: copy$1(es),
							output: copy$1(output)
						};
						return flatMap$1(forEach(cqueue, (f) => f(state), {
							concurrency,
							batching,
							discard: true
						}), () => computeResult(state));
					});
				}
				return computeResult({
					output,
					es
				});
			};
		}
		case "TypeLiteral": {
			if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) return fromRefinement(ast, isNotNullable);
			const propertySignatures = [];
			const expectedKeysMap = {};
			const expectedKeys = [];
			for (const ps of ast.propertySignatures) {
				propertySignatures.push([goMemo(ps.type, isDecoding), ps]);
				expectedKeysMap[ps.name] = null;
				expectedKeys.push(ps.name);
			}
			const indexSignatures = ast.indexSignatures.map((is) => [
				goMemo(is.parameter, isDecoding),
				goMemo(is.type, isDecoding),
				is.parameter
			]);
			const expectedAST = Union$1.make(ast.indexSignatures.map((is) => is.parameter).concat(expectedKeys.map((key) => isSymbol(key) ? new UniqueSymbol(key) : new Literal$1(key))));
			const expected = goMemo(expectedAST, isDecoding);
			const concurrency = getConcurrency(ast);
			const batching = getBatching(ast);
			return (input, options) => {
				if (!isRecord(input)) return left(new Type(ast, input));
				const allErrors = options?.errors === "all";
				const es = [];
				let stepKey = 0;
				const onExcessPropertyError = options?.onExcessProperty === "error";
				const onExcessPropertyPreserve = options?.onExcessProperty === "preserve";
				const output = {};
				let inputKeys;
				if (onExcessPropertyError || onExcessPropertyPreserve) {
					inputKeys = Reflect.ownKeys(input);
					for (const key of inputKeys) {
						const te = expected(key, options);
						if (isEither(te) && isLeft(te)) if (onExcessPropertyError) {
							const e = new Pointer(key, input, new Unexpected(input[key], `is unexpected, expected: ${String(expectedAST)}`));
							if (allErrors) {
								es.push([stepKey++, e]);
								continue;
							} else return left(new Composite(ast, input, e, output));
						} else output[key] = input[key];
					}
				}
				let queue = void 0;
				const isExact = options?.exact === true;
				for (let i = 0; i < propertySignatures.length; i++) {
					const ps = propertySignatures[i][1];
					const name = ps.name;
					const hasKey = Object.prototype.hasOwnProperty.call(input, name);
					if (!hasKey) {
						if (ps.isOptional) continue;
						else if (isExact) {
							const e = new Pointer(name, input, new Missing(ps));
							if (allErrors) {
								es.push([stepKey++, e]);
								continue;
							} else return left(new Composite(ast, input, e, output));
						}
					}
					const parser = propertySignatures[i][0];
					const te = parser(input[name], options);
					if (isEither(te)) {
						if (isLeft(te)) {
							const e = new Pointer(name, input, hasKey ? te.left : new Missing(ps));
							if (allErrors) {
								es.push([stepKey++, e]);
								continue;
							} else return left(new Composite(ast, input, e, output));
						}
						output[name] = te.right;
					} else {
						const nk = stepKey++;
						const index = name;
						if (!queue) queue = [];
						queue.push(({ es, output }) => flatMap$1(either(te), (t) => {
							if (isLeft(t)) {
								const e = new Pointer(index, input, hasKey ? t.left : new Missing(ps));
								if (allErrors) {
									es.push([nk, e]);
									return _void;
								} else return left(new Composite(ast, input, e, output));
							}
							output[index] = t.right;
							return _void;
						}));
					}
				}
				for (let i = 0; i < indexSignatures.length; i++) {
					const indexSignature = indexSignatures[i];
					const parameter = indexSignature[0];
					const type = indexSignature[1];
					const keys = getKeysForIndexSignature(input, indexSignature[2]);
					for (const key of keys) {
						const keu = parameter(key, options);
						if (isEither(keu) && isRight(keu)) {
							const vpr = type(input[key], options);
							if (isEither(vpr)) {
								if (isLeft(vpr)) {
									const e = new Pointer(key, input, vpr.left);
									if (allErrors) {
										es.push([stepKey++, e]);
										continue;
									} else return left(new Composite(ast, input, e, output));
								} else if (!Object.prototype.hasOwnProperty.call(expectedKeysMap, key)) output[key] = vpr.right;
							} else {
								const nk = stepKey++;
								const index = key;
								if (!queue) queue = [];
								queue.push(({ es, output }) => flatMap$1(either(vpr), (tv) => {
									if (isLeft(tv)) {
										const e = new Pointer(index, input, tv.left);
										if (allErrors) {
											es.push([nk, e]);
											return _void;
										} else return left(new Composite(ast, input, e, output));
									} else {
										if (!Object.prototype.hasOwnProperty.call(expectedKeysMap, key)) output[key] = tv.right;
										return _void;
									}
								}));
							}
						}
					}
				}
				const computeResult = ({ es, output }) => {
					if (isNonEmptyArray(es)) return left(new Composite(ast, input, sortByIndex(es), output));
					if (options?.propertyOrder === "original") {
						const keys = inputKeys || Reflect.ownKeys(input);
						for (const name of expectedKeys) if (keys.indexOf(name) === -1) keys.push(name);
						const out = {};
						for (const key of keys) if (Object.prototype.hasOwnProperty.call(output, key)) out[key] = output[key];
						return right(out);
					}
					return right(output);
				};
				if (queue && queue.length > 0) {
					const cqueue = queue;
					return suspend$1(() => {
						const state = {
							es: copy$1(es),
							output: Object.assign({}, output)
						};
						return flatMap$1(forEach(cqueue, (f) => f(state), {
							concurrency,
							batching,
							discard: true
						}), () => computeResult(state));
					});
				}
				return computeResult({
					es,
					output
				});
			};
		}
		case "Union": {
			const searchTree = getSearchTree(ast.types, isDecoding);
			const ownKeys = Reflect.ownKeys(searchTree.keys);
			const ownKeysLen = ownKeys.length;
			const astTypesLen = ast.types.length;
			const map = /* @__PURE__ */ new Map();
			for (let i = 0; i < astTypesLen; i++) map.set(ast.types[i], goMemo(ast.types[i], isDecoding));
			const concurrency = getConcurrency(ast) ?? 1;
			const batching = getBatching(ast);
			return (input, options) => {
				const es = [];
				let stepKey = 0;
				let candidates = [];
				if (ownKeysLen > 0) if (isRecordOrArray(input)) for (let i = 0; i < ownKeysLen; i++) {
					const name = ownKeys[i];
					const buckets = searchTree.keys[name].buckets;
					if (Object.prototype.hasOwnProperty.call(input, name)) {
						const literal = String(input[name]);
						if (Object.prototype.hasOwnProperty.call(buckets, literal)) candidates = candidates.concat(buckets[literal]);
						else {
							const { candidates, literals } = searchTree.keys[name];
							const literalsUnion = Union$1.make(literals);
							const errorAst = candidates.length === astTypesLen ? new TypeLiteral([new PropertySignature(name, literalsUnion, false, true)], []) : Union$1.make(candidates);
							es.push([stepKey++, new Composite(errorAst, input, new Pointer(name, input, new Type(literalsUnion, input[name])))]);
						}
					} else {
						const { candidates, literals } = searchTree.keys[name];
						const fakePropertySignature = new PropertySignature(name, Union$1.make(literals), false, true);
						const errorAst = candidates.length === astTypesLen ? new TypeLiteral([fakePropertySignature], []) : Union$1.make(candidates);
						es.push([stepKey++, new Composite(errorAst, input, new Pointer(name, input, new Missing(fakePropertySignature)))]);
					}
				}
				else {
					const errorAst = searchTree.candidates.length === astTypesLen ? ast : Union$1.make(searchTree.candidates);
					es.push([stepKey++, new Type(errorAst, input)]);
				}
				if (searchTree.otherwise.length > 0) candidates = candidates.concat(searchTree.otherwise);
				let queue = void 0;
				for (let i = 0; i < candidates.length; i++) {
					const candidate = candidates[i];
					const pr = map.get(candidate)(input, options);
					if (isEither(pr) && (!queue || queue.length === 0)) if (isRight(pr)) return pr;
					else es.push([stepKey++, pr.left]);
					else {
						const nk = stepKey++;
						if (!queue) queue = [];
						queue.push((state) => suspend$1(() => {
							if ("finalResult" in state) return _void;
							else return flatMap$1(either(pr), (t) => {
								if (isRight(t)) state.finalResult = t;
								else state.es.push([nk, t.left]);
								return _void;
							});
						}));
					}
				}
				const computeResult = (es) => isNonEmptyArray(es) ? es.length === 1 && es[0][1]._tag === "Type" ? left(es[0][1]) : left(new Composite(ast, input, sortByIndex(es))) : left(new Type(ast, input));
				if (queue && queue.length > 0) {
					const cqueue = queue;
					return suspend$1(() => {
						const state = { es: copy$1(es) };
						return flatMap$1(forEach(cqueue, (f) => f(state), {
							concurrency,
							batching,
							discard: true
						}), () => {
							if ("finalResult" in state) return state.finalResult;
							return computeResult(state.es);
						});
					});
				}
				return computeResult(es);
			};
		}
		case "Suspend": {
			const get = memoizeThunk(() => goMemo(ast.f(), isDecoding));
			return (a, options) => get()(a, options);
		}
	}
};
const fromRefinement = (ast, refinement) => (u) => refinement(u) ? right(u) : left(new Type(ast, u));
/** @internal */
const getLiterals = (ast, isDecoding) => {
	switch (ast._tag) {
		case "Declaration": {
			const annotation = getSurrogateAnnotation(ast);
			if (isSome(annotation)) return getLiterals(annotation.value, isDecoding);
			break;
		}
		case "TypeLiteral": {
			const out = [];
			for (let i = 0; i < ast.propertySignatures.length; i++) {
				const propertySignature = ast.propertySignatures[i];
				const type = isDecoding ? encodedAST(propertySignature.type) : typeAST(propertySignature.type);
				if (isLiteral(type) && !propertySignature.isOptional) out.push([propertySignature.name, type]);
			}
			return out;
		}
		case "TupleType": {
			const out = [];
			for (let i = 0; i < ast.elements.length; i++) {
				const element = ast.elements[i];
				const type = isDecoding ? encodedAST(element.type) : typeAST(element.type);
				if (isLiteral(type) && !element.isOptional) out.push([i, type]);
			}
			return out;
		}
		case "Refinement": return getLiterals(ast.from, isDecoding);
		case "Suspend": return getLiterals(ast.f(), isDecoding);
		case "Transformation": return getLiterals(isDecoding ? ast.from : ast.to, isDecoding);
	}
	return [];
};
/**
* The purpose of the algorithm is to narrow down the pool of possible
* candidates for decoding as much as possible.
*
* This function separates the schemas into two groups, `keys` and `otherwise`:
*
* - `keys`: the schema has at least one property with a literal value
* - `otherwise`: the schema has no properties with a literal value
*
* If a schema has at least one property with a literal value, so it ends up in
* `keys`, first a namespace is created for the name of the property containing
* the literal, and then within this namespace a "bucket" is created for the
* literal value in which to store all the schemas that have the same property
* and literal value.
*
* @internal
*/
const getSearchTree = (members, isDecoding) => {
	const keys = {};
	const otherwise = [];
	const candidates = [];
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		const tags = getLiterals(member, isDecoding);
		if (tags.length > 0) {
			candidates.push(member);
			for (let j = 0; j < tags.length; j++) {
				const [key, literal] = tags[j];
				const hash = String(literal.literal);
				keys[key] = keys[key] || {
					buckets: {},
					literals: [],
					candidates: []
				};
				const buckets = keys[key].buckets;
				if (Object.prototype.hasOwnProperty.call(buckets, hash)) {
					if (j < tags.length - 1) continue;
					buckets[hash].push(member);
					keys[key].literals.push(literal);
					keys[key].candidates.push(member);
				} else {
					buckets[hash] = [member];
					keys[key].literals.push(literal);
					keys[key].candidates.push(member);
					break;
				}
			}
		} else otherwise.push(member);
	}
	return {
		keys,
		otherwise,
		candidates
	};
};
const dropRightRefinement = (ast) => isRefinement$1(ast) ? dropRightRefinement(ast.from) : ast;
const handleForbidden = (effect, ast, actual, options) => {
	if (options?.isEffectAllowed === true) return effect;
	if (isEither(effect)) return effect;
	const scheduler = new SyncScheduler();
	const fiber = runFork(effect, { scheduler });
	scheduler.flush();
	const exit = fiber.unsafePoll();
	if (exit) {
		if (isSuccess(exit)) return right(exit.value);
		const cause = exit.cause;
		if (isFailType(cause)) return left(cause.error);
		return left(new Forbidden(ast, actual, pretty(cause)));
	}
	return left(new Forbidden(ast, actual, "cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work"));
};
const compare = ([a], [b]) => a > b ? 1 : a < b ? -1 : 0;
function sortByIndex(es) {
	return es.sort(compare).map((t) => t[1]);
}
/** @internal */
const getFinalTransformation = (transformation, isDecoding) => {
	switch (transformation._tag) {
		case "FinalTransformation": return isDecoding ? transformation.decode : transformation.encode;
		case "ComposeTransformation": return right;
		case "TypeLiteralTransformation": return (input) => {
			let out = right(input);
			for (const pst of transformation.propertySignatureTransformations) {
				const [from, to] = isDecoding ? [pst.from, pst.to] : [pst.to, pst.from];
				const transformation = isDecoding ? pst.decode : pst.encode;
				const f = (input) => {
					const o = transformation(Object.prototype.hasOwnProperty.call(input, from) ? some(input[from]) : none$4());
					delete input[from];
					if (isSome(o)) input[to] = o.value;
					return input;
				};
				out = map(out, f);
			}
			return out;
		};
	}
};
const makeTree = (value, forest = []) => ({
	value,
	forest
});
/**
* @category formatting
* @since 3.10.0
*/
const TreeFormatter = {
	formatIssue: (issue) => map(formatTree(issue), drawTree),
	formatIssueSync: (issue) => {
		const e = TreeFormatter.formatIssue(issue);
		return isEither(e) ? getOrThrow(e) : runSync(e);
	},
	formatError: (error) => TreeFormatter.formatIssue(error.issue),
	formatErrorSync: (error) => TreeFormatter.formatIssueSync(error.issue)
};
const drawTree = (tree) => tree.value + draw("\n", tree.forest);
const draw = (indentation, forest) => {
	let r = "";
	const len = forest.length;
	let tree;
	for (let i = 0; i < len; i++) {
		tree = forest[i];
		const isLast = i === len - 1;
		r += indentation + (isLast ? "└" : "├") + "─ " + tree.value;
		r += draw(indentation + (len > 1 && !isLast ? "│  " : "   "), tree.forest);
	}
	return r;
};
const formatTransformationKind = (kind) => {
	switch (kind) {
		case "Encoded": return "Encoded side transformation failure";
		case "Transformation": return "Transformation process failure";
		case "Type": return "Type side transformation failure";
	}
};
const formatRefinementKind = (kind) => {
	switch (kind) {
		case "From": return "From side refinement failure";
		case "Predicate": return "Predicate refinement failure";
	}
};
const getAnnotated = (issue) => "ast" in issue ? some(issue.ast) : none$4();
const Either_void = /* @__PURE__ */ right(void 0);
const getCurrentMessage = (issue) => getAnnotated(issue).pipe(flatMap$5(getMessageAnnotation), match$3({
	onNone: () => Either_void,
	onSome: (messageAnnotation) => {
		const union = messageAnnotation(issue);
		if (isString(union)) return right({
			message: union,
			override: false
		});
		if (isEffect(union)) return map$1(union, (message) => ({
			message,
			override: false
		}));
		if (isString(union.message)) return right({
			message: union.message,
			override: union.override
		});
		return map$1(union.message, (message) => ({
			message,
			override: union.override
		}));
	}
}));
const createParseIssueGuard = (tag) => (issue) => issue._tag === tag;
/**
* Returns `true` if the value is a `Composite`.
*
* @category guards
* @since 3.10.0
*/
const isComposite = /* @__PURE__ */ createParseIssueGuard("Composite");
const isRefinement = /* @__PURE__ */ createParseIssueGuard("Refinement");
const isTransformation = /* @__PURE__ */ createParseIssueGuard("Transformation");
const getMessage = (issue) => flatMap(getCurrentMessage(issue), (currentMessage) => {
	if (currentMessage !== void 0) return !currentMessage.override && (isComposite(issue) || isRefinement(issue) && issue.kind === "From" || isTransformation(issue) && issue.kind !== "Transformation") ? isTransformation(issue) || isRefinement(issue) ? getMessage(issue.issue) : Either_void : right(currentMessage.message);
	return Either_void;
});
const getParseIssueTitleAnnotation = (issue) => getAnnotated(issue).pipe(flatMap$5(getParseIssueTitleAnnotation$1), flatMapNullable((annotation) => annotation(issue)), getOrUndefined);
/** @internal */
function getRefinementExpected(ast) {
	return getDescriptionAnnotation(ast).pipe(orElse$1(() => getTitleAnnotation(ast)), orElse$1(() => getAutoTitleAnnotation(ast)), orElse$1(() => getIdentifierAnnotation(ast)), getOrElse(() => `{ ${ast.from} | filter }`));
}
function getDefaultTypeMessage(issue) {
	if (issue.message !== void 0) return issue.message;
	return `Expected ${isRefinement$1(issue.ast) ? getRefinementExpected(issue.ast) : String(issue.ast)}, actual ${formatUnknown(issue.actual)}`;
}
const formatTypeMessage = (issue) => map(getMessage(issue), (message) => message ?? getParseIssueTitleAnnotation(issue) ?? getDefaultTypeMessage(issue));
const getParseIssueTitle = (issue) => getParseIssueTitleAnnotation(issue) ?? String(issue.ast);
const formatForbiddenMessage = (issue) => issue.message ?? "is forbidden";
const formatUnexpectedMessage = (issue) => issue.message ?? "is unexpected";
const formatMissingMessage = (issue) => {
	const missingMessageAnnotation = getMissingMessageAnnotation(issue.ast);
	if (isSome(missingMessageAnnotation)) {
		const annotation = missingMessageAnnotation.value();
		return isString(annotation) ? right(annotation) : annotation;
	}
	return right(issue.message ?? "is missing");
};
const formatTree = (issue) => {
	switch (issue._tag) {
		case "Type": return map(formatTypeMessage(issue), makeTree);
		case "Forbidden": return right(makeTree(getParseIssueTitle(issue), [makeTree(formatForbiddenMessage(issue))]));
		case "Unexpected": return right(makeTree(formatUnexpectedMessage(issue)));
		case "Missing": return map(formatMissingMessage(issue), makeTree);
		case "Transformation": return flatMap(getMessage(issue), (message) => {
			if (message !== void 0) return right(makeTree(message));
			return map(formatTree(issue.issue), (tree) => makeTree(getParseIssueTitle(issue), [makeTree(formatTransformationKind(issue.kind), [tree])]));
		});
		case "Refinement": return flatMap(getMessage(issue), (message) => {
			if (message !== void 0) return right(makeTree(message));
			return map(formatTree(issue.issue), (tree) => makeTree(getParseIssueTitle(issue), [makeTree(formatRefinementKind(issue.kind), [tree])]));
		});
		case "Pointer": return map(formatTree(issue.issue), (tree) => makeTree(formatPath(issue.path), [tree]));
		case "Composite": return flatMap(getMessage(issue), (message) => {
			if (message !== void 0) return right(makeTree(message));
			const parseIssueTitle = getParseIssueTitle(issue);
			return isNonEmpty(issue.issues) ? map(forEach(issue.issues, formatTree), (forest) => makeTree(parseIssueTitle, forest)) : map(formatTree(issue.issues), (tree) => makeTree(parseIssueTitle, [tree]));
		});
	}
};
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Struct.js
/**
* Create a new object by picking properties of an existing object.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { pipe, Struct } from "effect"
*
* assert.deepStrictEqual(pipe({ a: "a", b: 1, c: true }, Struct.pick("a", "b")), { a: "a", b: 1 })
* assert.deepStrictEqual(Struct.pick({ a: "a", b: 1, c: true }, "a", "b"), { a: "a", b: 1 })
* ```
*
* @since 2.0.0
*/
const pick = /* @__PURE__ */ dual((args) => isObject(args[0]), (s, ...keys) => {
	const out = {};
	for (const k of keys) if (k in s) out[k] = s[k];
	return out;
});
/**
* Create a new object by omitting properties of an existing object.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { pipe, Struct } from "effect"
*
* assert.deepStrictEqual(pipe({ a: "a", b: 1, c: true }, Struct.omit("c")), { a: "a", b: 1 })
* assert.deepStrictEqual(Struct.omit({ a: "a", b: 1, c: true }, "c"), { a: "a", b: 1 })
* ```
*
* @since 2.0.0
*/
const omit = /* @__PURE__ */ dual((args) => isObject(args[0]), (s, ...keys) => {
	const out = { ...s };
	for (const k of keys) delete out[k];
	return out;
});
//#endregion
//#region ../node_modules/.pnpm/effect@3.21.1/node_modules/effect/dist/esm/Schema.js
/**
* @since 3.10.0
*/
/**
* @since 3.10.0
* @category symbol
*/
const TypeId = /* @__PURE__ */ Symbol.for("effect/Schema");
/**
* @category constructors
* @since 3.10.0
*/
function make(ast) {
	return class SchemaClass {
		[TypeId] = variance;
		static ast = ast;
		static annotations(annotations) {
			return make(mergeSchemaAnnotations(this.ast, annotations));
		}
		static pipe() {
			return pipeArguments(this, arguments);
		}
		static toString() {
			return String(ast);
		}
		static Type;
		static Encoded;
		static Context;
		static [TypeId] = variance;
	};
}
const variance = {
	_A: (_) => _,
	_I: (_) => _,
	_R: (_) => _
};
const builtInAnnotations = {
	typeConstructor: TypeConstructorAnnotationId,
	schemaId: SchemaIdAnnotationId,
	message: MessageAnnotationId,
	missingMessage: MissingMessageAnnotationId,
	identifier: IdentifierAnnotationId,
	title: TitleAnnotationId,
	description: DescriptionAnnotationId,
	examples: ExamplesAnnotationId,
	default: DefaultAnnotationId,
	documentation: DocumentationAnnotationId,
	jsonSchema: JSONSchemaAnnotationId,
	arbitrary: ArbitraryAnnotationId,
	pretty: PrettyAnnotationId,
	equivalence: EquivalenceAnnotationId,
	concurrency: ConcurrencyAnnotationId,
	batching: BatchingAnnotationId,
	parseIssueTitle: ParseIssueTitleAnnotationId,
	parseOptions: ParseOptionsAnnotationId,
	decodingFallback: DecodingFallbackAnnotationId
};
const toASTAnnotations = (annotations) => {
	if (!annotations) return {};
	const out = { ...annotations };
	for (const key in builtInAnnotations) if (key in annotations) {
		const id = builtInAnnotations[key];
		out[id] = annotations[key];
		delete out[key];
	}
	return out;
};
const mergeSchemaAnnotations = (ast, annotations$3) => annotations(ast, toASTAnnotations(annotations$3));
/**
* @category formatting
* @since 3.10.0
*/
const format = (schema) => String(schema.ast);
/**
* @category decoding
* @since 3.10.0
*/
const decodeUnknownEither = (schema, options) => {
	const decodeUnknownEither = decodeUnknownEither$1(schema, options);
	return (u, overrideOptions) => mapLeft(decodeUnknownEither(u, overrideOptions), parseError);
};
/**
* Tests if a value is a `Schema`.
*
* @category guards
* @since 3.10.0
*/
const isSchema = (u) => hasProperty(u, TypeId) && isObject(u[TypeId]);
function getDefaultLiteralAST(literals) {
	return isMembers(literals) ? Union$1.make(mapMembers(literals, (literal) => new Literal$1(literal))) : new Literal$1(literals[0]);
}
function makeLiteralClass(literals, ast = getDefaultLiteralAST(literals)) {
	return class LiteralClass extends make(ast) {
		static annotations(annotations) {
			return makeLiteralClass(this.literals, mergeSchemaAnnotations(this.ast, annotations));
		}
		static literals = [...literals];
	};
}
function Literal(...literals) {
	return isNonEmptyReadonlyArray(literals) ? makeLiteralClass(literals) : Never;
}
const declareConstructor = (typeParameters, options, annotations) => makeDeclareClass(typeParameters, new Declaration(typeParameters.map((tp) => tp.ast), (...typeParameters) => options.decode(...typeParameters.map(make)), (...typeParameters) => options.encode(...typeParameters.map(make)), toASTAnnotations(annotations)));
const declarePrimitive = (is, annotations) => {
	const decodeUnknown = () => (input, _, ast) => is(input) ? succeed(input) : fail(new Type(ast, input));
	return makeDeclareClass([], new Declaration([], decodeUnknown, decodeUnknown, toASTAnnotations(annotations)));
};
function makeDeclareClass(typeParameters, ast) {
	return class DeclareClass extends make(ast) {
		static annotations(annotations) {
			return makeDeclareClass(this.typeParameters, mergeSchemaAnnotations(this.ast, annotations));
		}
		static typeParameters = [...typeParameters];
	};
}
/**
* The constraint `R extends Schema.Context<P[number]>` enforces dependencies solely from `typeParameters`.
* This ensures that when you call `Schema.to` or `Schema.from`, you receive a schema with a `never` context.
*
* @category constructors
* @since 3.10.0
*/
const declare = function() {
	if (Array.isArray(arguments[0])) {
		const typeParameters = arguments[0];
		const options = arguments[1];
		const annotations = arguments[2];
		return declareConstructor(typeParameters, options, annotations);
	}
	const is = arguments[0];
	const annotations = arguments[1];
	return declarePrimitive(is, annotations);
};
/**
* @category schema id
* @since 3.10.0
*/
const InstanceOfSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/InstanceOf");
/**
* @category constructors
* @since 3.10.0
*/
const instanceOf = (constructor, annotations) => declare((u) => u instanceof constructor, {
	title: constructor.name,
	description: `an instance of ${constructor.name}`,
	pretty: () => String,
	schemaId: InstanceOfSchemaId,
	[InstanceOfSchemaId]: { constructor },
	...annotations
});
make(undefinedKeyword);
make(voidKeyword);
/**
* @category primitives
* @since 3.10.0
*/
var Null = class extends make($null) {};
/**
* @category primitives
* @since 3.10.0
*/
var Never = class extends make(neverKeyword) {};
/**
* @category primitives
* @since 3.10.0
*/
var Unknown = class extends make(unknownKeyword) {};
make(anyKeyword);
/**
* @category primitives
* @since 3.10.0
*/
var BigIntFromSelf = class extends make(bigIntKeyword) {};
/**
* @category primitives
* @since 3.10.0
*/
var SymbolFromSelf = class extends make(symbolKeyword) {};
/** @ignore */
var String$ = class extends make(stringKeyword) {};
/** @ignore */
var Number$ = class extends make(numberKeyword) {};
/** @ignore */
var Boolean$ = class extends make(booleanKeyword) {};
make(objectKeyword);
const getDefaultUnionAST = (members) => Union$1.make(members.map((m) => m.ast));
function makeUnionClass(members, ast = getDefaultUnionAST(members)) {
	return class UnionClass extends make(ast) {
		static annotations(annotations) {
			return makeUnionClass(this.members, mergeSchemaAnnotations(this.ast, annotations));
		}
		static members = [...members];
	};
}
function Union(...members) {
	return isMembers(members) ? makeUnionClass(members) : isNonEmptyReadonlyArray(members) ? members[0] : Never;
}
/**
* @category combinators
* @since 3.10.0
*/
const NullOr = (self) => Union(self, Null);
/**
* @since 3.10.0
*/
const element = (self) => new ElementImpl(new OptionalType(self.ast, false), self);
var ElementImpl = class ElementImpl {
	ast;
	from;
	[TypeId];
	_Token;
	constructor(ast, from) {
		this.ast = ast;
		this.from = from;
	}
	annotations(annotations) {
		return new ElementImpl(new OptionalType(this.ast.type, this.ast.isOptional, {
			...this.ast.annotations,
			...toASTAnnotations(annotations)
		}), this.from);
	}
	toString() {
		return `${this.ast.type}${this.ast.isOptional ? "?" : ""}`;
	}
};
const getDefaultTupleTypeAST = (elements, rest) => new TupleType(elements.map((el) => isSchema(el) ? new OptionalType(el.ast, false) : el.ast), rest.map((el) => isSchema(el) ? new Type$1(el.ast) : el.ast), true);
function makeTupleTypeClass(elements, rest, ast = getDefaultTupleTypeAST(elements, rest)) {
	return class TupleTypeClass extends make(ast) {
		static annotations(annotations) {
			return makeTupleTypeClass(this.elements, this.rest, mergeSchemaAnnotations(this.ast, annotations));
		}
		static elements = [...elements];
		static rest = [...rest];
	};
}
function Tuple(...args) {
	return Array.isArray(args[0]) ? makeTupleTypeClass(args[0], args.slice(1)) : makeTupleTypeClass(args, []);
}
function makeArrayClass(value, ast) {
	return class ArrayClass extends makeTupleTypeClass([], [value], ast) {
		static annotations(annotations) {
			return makeArrayClass(this.value, mergeSchemaAnnotations(this.ast, annotations));
		}
		static value = value;
	};
}
const Array$ = (value) => makeArrayClass(value);
const formatPropertySignatureToken = (isOptional) => isOptional ? "\"?:\"" : "\":\"";
/**
* @category PropertySignature
* @since 3.10.0
*/
var PropertySignatureDeclaration = class extends OptionalType {
	isReadonly;
	defaultValue;
	/**
	* @since 3.10.0
	*/
	_tag = "PropertySignatureDeclaration";
	constructor(type, isOptional, isReadonly, annotations, defaultValue) {
		super(type, isOptional, annotations);
		this.isReadonly = isReadonly;
		this.defaultValue = defaultValue;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		const token = formatPropertySignatureToken(this.isOptional);
		const type = String(this.type);
		return `PropertySignature<${token}, ${type}, never, ${token}, ${type}>`;
	}
};
/**
* @category PropertySignature
* @since 3.10.0
*/
var ToPropertySignature = class extends OptionalType {
	isReadonly;
	defaultValue;
	constructor(type, isOptional, isReadonly, annotations, defaultValue) {
		super(type, isOptional, annotations);
		this.isReadonly = isReadonly;
		this.defaultValue = defaultValue;
	}
};
const formatPropertyKey = (p) => {
	if (p === void 0) return "never";
	if (isString(p)) return JSON.stringify(p);
	return String(p);
};
/**
* @category PropertySignature
* @since 3.10.0
*/
var PropertySignatureTransformation = class {
	from;
	to;
	decode;
	encode;
	/**
	* @since 3.10.0
	*/
	_tag = "PropertySignatureTransformation";
	constructor(from, to, decode, encode) {
		this.from = from;
		this.to = to;
		this.decode = decode;
		this.encode = encode;
	}
	/**
	* @since 3.10.0
	*/
	toString() {
		return `PropertySignature<${formatPropertySignatureToken(this.to.isOptional)}, ${this.to.type}, ${formatPropertyKey(this.from.fromKey)}, ${formatPropertySignatureToken(this.from.isOptional)}, ${this.from.type}>`;
	}
};
const mergeSignatureAnnotations = (ast, annotations) => {
	switch (ast._tag) {
		case "PropertySignatureDeclaration": return new PropertySignatureDeclaration(ast.type, ast.isOptional, ast.isReadonly, {
			...ast.annotations,
			...annotations
		}, ast.defaultValue);
		case "PropertySignatureTransformation": return new PropertySignatureTransformation(ast.from, new ToPropertySignature(ast.to.type, ast.to.isOptional, ast.to.isReadonly, {
			...ast.to.annotations,
			...annotations
		}, ast.to.defaultValue), ast.decode, ast.encode);
	}
};
/**
* @since 3.10.0
* @category symbol
*/
const PropertySignatureTypeId = /* @__PURE__ */ Symbol.for("effect/PropertySignature");
/**
* @since 3.10.0
* @category guards
*/
const isPropertySignature = (u) => hasProperty(u, PropertySignatureTypeId);
var PropertySignatureImpl = class PropertySignatureImpl {
	ast;
	[TypeId];
	[PropertySignatureTypeId] = null;
	_TypeToken;
	_Key;
	_EncodedToken;
	_HasDefault;
	constructor(ast) {
		this.ast = ast;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	annotations(annotations) {
		return new PropertySignatureImpl(mergeSignatureAnnotations(this.ast, toASTAnnotations(annotations)));
	}
	toString() {
		return String(this.ast);
	}
};
/**
* @category PropertySignature
* @since 3.10.0
*/
const makePropertySignature = (ast) => new PropertySignatureImpl(ast);
var PropertySignatureWithFromImpl = class PropertySignatureWithFromImpl extends PropertySignatureImpl {
	from;
	constructor(ast, from) {
		super(ast);
		this.from = from;
	}
	annotations(annotations) {
		return new PropertySignatureWithFromImpl(mergeSignatureAnnotations(this.ast, toASTAnnotations(annotations)), this.from);
	}
};
/**
* Lifts a `Schema` into a `PropertySignature`.
*
* @category PropertySignature
* @since 3.10.0
*/
const propertySignature = (self) => new PropertySignatureWithFromImpl(new PropertySignatureDeclaration(self.ast, false, true, {}, void 0), self);
/**
* Enhances a property signature with a default constructor value.
*
* @category PropertySignature
* @since 3.10.0
*/
const withConstructorDefault = /* @__PURE__ */ dual(2, (self, defaultValue) => {
	const ast = self.ast;
	switch (ast._tag) {
		case "PropertySignatureDeclaration": return makePropertySignature(new PropertySignatureDeclaration(ast.type, ast.isOptional, ast.isReadonly, ast.annotations, defaultValue));
		case "PropertySignatureTransformation": return makePropertySignature(new PropertySignatureTransformation(ast.from, new ToPropertySignature(ast.to.type, ast.to.isOptional, ast.to.isReadonly, ast.to.annotations, defaultValue), ast.decode, ast.encode));
	}
});
const preserveMissingMessageAnnotation = /* @__PURE__ */ pickAnnotations([MissingMessageAnnotationId]);
const getDefaultTypeLiteralAST = (fields, records) => {
	const ownKeys = Reflect.ownKeys(fields);
	const pss = [];
	if (ownKeys.length > 0) {
		const from = [];
		const to = [];
		const transformations = [];
		for (let i = 0; i < ownKeys.length; i++) {
			const key = ownKeys[i];
			const field = fields[key];
			if (isPropertySignature(field)) {
				const ast = field.ast;
				switch (ast._tag) {
					case "PropertySignatureDeclaration": {
						const type = ast.type;
						const isOptional = ast.isOptional;
						const toAnnotations = ast.annotations;
						from.push(new PropertySignature(key, type, isOptional, true, preserveMissingMessageAnnotation(ast)));
						to.push(new PropertySignature(key, typeAST(type), isOptional, true, toAnnotations));
						pss.push(new PropertySignature(key, type, isOptional, true, toAnnotations));
						break;
					}
					case "PropertySignatureTransformation": {
						const fromKey = ast.from.fromKey ?? key;
						from.push(new PropertySignature(fromKey, ast.from.type, ast.from.isOptional, true, ast.from.annotations));
						to.push(new PropertySignature(key, ast.to.type, ast.to.isOptional, true, ast.to.annotations));
						transformations.push(new PropertySignatureTransformation$1(fromKey, key, ast.decode, ast.encode));
						break;
					}
				}
			} else {
				from.push(new PropertySignature(key, field.ast, false, true));
				to.push(new PropertySignature(key, typeAST(field.ast), false, true));
				pss.push(new PropertySignature(key, field.ast, false, true));
			}
		}
		if (isNonEmptyReadonlyArray(transformations)) {
			const issFrom = [];
			const issTo = [];
			for (const r of records) {
				const { indexSignatures, propertySignatures } = record(r.key.ast, r.value.ast);
				propertySignatures.forEach((ps) => {
					from.push(ps);
					to.push(new PropertySignature(ps.name, typeAST(ps.type), ps.isOptional, ps.isReadonly, ps.annotations));
				});
				indexSignatures.forEach((is) => {
					issFrom.push(is);
					issTo.push(new IndexSignature(is.parameter, typeAST(is.type), is.isReadonly));
				});
			}
			return new Transformation$1(new TypeLiteral(from, issFrom, { [AutoTitleAnnotationId]: "Struct (Encoded side)" }), new TypeLiteral(to, issTo, { [AutoTitleAnnotationId]: "Struct (Type side)" }), new TypeLiteralTransformation(transformations));
		}
	}
	const iss = [];
	for (const r of records) {
		const { indexSignatures, propertySignatures } = record(r.key.ast, r.value.ast);
		propertySignatures.forEach((ps) => pss.push(ps));
		indexSignatures.forEach((is) => iss.push(is));
	}
	return new TypeLiteral(pss, iss);
};
const lazilyMergeDefaults = (fields, out) => {
	const ownKeys = Reflect.ownKeys(fields);
	for (const key of ownKeys) {
		const field = fields[key];
		if (out[key] === void 0 && isPropertySignature(field)) {
			const ast = field.ast;
			const defaultValue = ast._tag === "PropertySignatureDeclaration" ? ast.defaultValue : ast.to.defaultValue;
			if (defaultValue !== void 0) out[key] = defaultValue();
		}
	}
	return out;
};
function makeTypeLiteralClass(fields, records, ast = getDefaultTypeLiteralAST(fields, records)) {
	return class TypeLiteralClass extends make(ast) {
		static annotations(annotations) {
			return makeTypeLiteralClass(this.fields, this.records, mergeSchemaAnnotations(this.ast, annotations));
		}
		static fields = { ...fields };
		static records = [...records];
		static make = (props, options) => {
			const propsWithDefaults = lazilyMergeDefaults(fields, { ...props });
			return getDisableValidationMakeOption(options) ? propsWithDefaults : validateSync(this)(propsWithDefaults);
		};
		static pick(...keys) {
			return Struct(pick(fields, ...keys));
		}
		static omit(...keys) {
			return Struct(omit(fields, ...keys));
		}
	};
}
function Struct(fields, ...records) {
	return makeTypeLiteralClass(fields, records);
}
/**
* Returns a property signature that represents a tag.
* A tag is a literal value that is used to distinguish between different types of objects.
* The tag is optional when using the `make` method.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Schema } from "effect"
*
* const User = Schema.Struct({
*   _tag: Schema.tag("User"),
*   name: Schema.String,
*   age: Schema.Number
* })
*
* assert.deepStrictEqual(User.make({ name: "John", age: 44 }), { _tag: "User", name: "John", age: 44 })
* ```
*
* @see {@link TaggedStruct}
*
* @since 3.10.0
*/
const tag = (tag) => Literal(tag).pipe(propertySignature, withConstructorDefault(() => tag));
/**
* A tagged struct is a struct that has a tag property that is used to distinguish between different types of objects.
*
* The tag is optional when using the `make` method.
*
* @example
* ```ts
* import * as assert from "node:assert"
* import { Schema } from "effect"
*
* const User = Schema.TaggedStruct("User", {
*   name: Schema.String,
*   age: Schema.Number
* })
*
* assert.deepStrictEqual(User.make({ name: "John", age: 44 }), { _tag: "User", name: "John", age: 44 })
* ```
*
* @category constructors
* @since 3.10.0
*/
const TaggedStruct = (value, fields) => Struct({
	_tag: tag(value),
	...fields
});
/**
* Creates a new schema with shallow mutability applied to its properties.
*
* @category combinators
* @since 3.10.0
*/
const mutable = (schema) => make(mutable$1(schema.ast));
/**
* @category constructors
* @since 3.10.0
*/
const suspend = (f) => make(new Suspend(() => f().ast));
/**
* @since 3.10.0
* @category symbol
*/
const RefineSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Refine");
function makeRefineClass(from, filter, ast) {
	return class RefineClass extends make(ast) {
		static annotations(annotations) {
			return makeRefineClass(this.from, this.filter, mergeSchemaAnnotations(this.ast, annotations));
		}
		static [RefineSchemaId] = from;
		static from = from;
		static filter = filter;
		static make = (a, options) => {
			return getDisableValidationMakeOption(options) ? a : validateSync(this)(a);
		};
	};
}
const fromFilterPredicateReturnTypeItem = (item, ast, input) => {
	if (isBoolean(item)) return item ? none$4() : some(new Type(ast, input));
	if (isString(item)) return some(new Type(ast, input, item));
	if (item !== void 0) {
		if ("_tag" in item) return some(item);
		const issue = new Type(ast, input, item.message);
		return some(isNonEmptyReadonlyArray(item.path) ? new Pointer(item.path, input, issue) : issue);
	}
	return none$4();
};
const toFilterParseIssue = (out, ast, input) => {
	if (isSingle(out)) return fromFilterPredicateReturnTypeItem(out, ast, input);
	if (isNonEmptyReadonlyArray(out)) {
		const issues = filterMap(out, (issue) => fromFilterPredicateReturnTypeItem(issue, ast, input));
		if (isNonEmptyReadonlyArray(issues)) return some(issues.length === 1 ? issues[0] : new Composite(ast, input, issues));
	}
	return none$4();
};
function filter(predicate, annotations) {
	return (self) => {
		function filter(input, options, ast) {
			return toFilterParseIssue(predicate(input, options, ast), ast, input);
		}
		return makeRefineClass(self, filter, new Refinement$1(self.ast, filter, toASTAnnotations(annotations)));
	};
}
function makeTransformationClass(from, to, ast) {
	return class TransformationClass extends make(ast) {
		static annotations(annotations) {
			return makeTransformationClass(this.from, this.to, mergeSchemaAnnotations(this.ast, annotations));
		}
		static from = from;
		static to = to;
	};
}
/**
* Create a new `Schema` by transforming the input and output of an existing `Schema`
* using the provided decoding functions.
*
* @category transformations
* @since 3.10.0
*/
const transformOrFail = /* @__PURE__ */ dual((args) => isSchema(args[0]) && isSchema(args[1]), (from, to, options) => makeTransformationClass(from, to, new Transformation$1(from.ast, to.ast, new FinalTransformation(options.decode, options.encode))));
/**
* Create a new `Schema` by transforming the input and output of an existing `Schema`
* using the provided mapping functions.
*
* @category transformations
* @since 3.10.0
*/
const transform = /* @__PURE__ */ dual((args) => isSchema(args[0]) && isSchema(args[1]), (from, to, options) => transformOrFail(from, to, {
	strict: true,
	decode: (fromA, _options, _ast, toA) => succeed(options.decode(fromA, toA)),
	encode: (toI, _options, _ast, toA) => succeed(options.encode(toI, toA))
}));
/**
* @category schema id
* @since 3.10.0
*/
const TrimmedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Trimmed");
/**
* Verifies that a string contains no leading or trailing whitespaces.
*
* Note. This combinator does not make any transformations, it only validates.
* If what you were looking for was a combinator to trim strings, then check out the `trim` combinator.
*
* @category string filters
* @since 3.10.0
*/
const trimmed = (annotations) => (self) => self.pipe(filter((a) => a === a.trim(), {
	schemaId: TrimmedSchemaId,
	title: "trimmed",
	description: "a string with no leading or trailing whitespace",
	jsonSchema: { pattern: "^\\S[\\s\\S]*\\S$|^\\S$|^$" },
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const MaxLengthSchemaId = MaxLengthSchemaId$1;
/**
* @category string filters
* @since 3.10.0
*/
const maxLength = (maxLength, annotations) => (self) => self.pipe(filter((a) => a.length <= maxLength, {
	schemaId: MaxLengthSchemaId,
	title: `maxLength(${maxLength})`,
	description: `a string at most ${maxLength} character(s) long`,
	jsonSchema: { maxLength },
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const MinLengthSchemaId = MinLengthSchemaId$1;
/**
* @category string filters
* @since 3.10.0
*/
const minLength = (minLength, annotations) => (self) => self.pipe(filter((a) => a.length >= minLength, {
	schemaId: MinLengthSchemaId,
	title: `minLength(${minLength})`,
	description: `a string at least ${minLength} character(s) long`,
	jsonSchema: { minLength },
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const LengthSchemaId = LengthSchemaId$1;
/**
* @category string filters
* @since 3.10.0
*/
const length = (length, annotations) => (self) => {
	const minLength = isObject(length) ? Math.max(0, Math.floor(length.min)) : Math.max(0, Math.floor(length));
	const maxLength = isObject(length) ? Math.max(minLength, Math.floor(length.max)) : minLength;
	if (minLength !== maxLength) return self.pipe(filter((a) => a.length >= minLength && a.length <= maxLength, {
		schemaId: LengthSchemaId,
		title: `length({ min: ${minLength}, max: ${maxLength})`,
		description: `a string at least ${minLength} character(s) and at most ${maxLength} character(s) long`,
		jsonSchema: {
			minLength,
			maxLength
		},
		...annotations
	}));
	return self.pipe(filter((a) => a.length === minLength, {
		schemaId: LengthSchemaId,
		title: `length(${minLength})`,
		description: minLength === 1 ? `a single character` : `a string ${minLength} character(s) long`,
		jsonSchema: {
			minLength,
			maxLength: minLength
		},
		...annotations
	}));
};
/**
* @category schema id
* @since 3.10.0
*/
const PatternSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Pattern");
/**
* @category string filters
* @since 3.10.0
*/
const pattern = (regex, annotations) => (self) => {
	const source = regex.source;
	return self.pipe(filter((a) => {
		regex.lastIndex = 0;
		return regex.test(a);
	}, {
		schemaId: PatternSchemaId,
		[PatternSchemaId]: { regex },
		description: `a string matching the pattern ${source}`,
		jsonSchema: { pattern: source },
		...annotations
	}));
};
/**
* @category schema id
* @since 3.10.0
*/
const LowercasedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Lowercased");
/**
* Verifies that a string is lowercased.
*
* @category string filters
* @since 3.10.0
*/
const lowercased = (annotations) => (self) => self.pipe(filter((a) => a === a.toLowerCase(), {
	schemaId: LowercasedSchemaId,
	title: "lowercased",
	description: "a lowercase string",
	jsonSchema: { pattern: "^[^A-Z]*$" },
	...annotations
}));
/**
* @category string constructors
* @since 3.10.0
*/
var Lowercased = class extends String$.pipe(/* @__PURE__ */ lowercased({ identifier: "Lowercased" })) {};
/**
* @category schema id
* @since 3.10.0
*/
const UppercasedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Uppercased");
/**
* Verifies that a string is uppercased.
*
* @category string filters
* @since 3.10.0
*/
const uppercased = (annotations) => (self) => self.pipe(filter((a) => a === a.toUpperCase(), {
	schemaId: UppercasedSchemaId,
	title: "uppercased",
	description: "an uppercase string",
	jsonSchema: { pattern: "^[^a-z]*$" },
	...annotations
}));
/**
* @category string constructors
* @since 3.10.0
*/
var Uppercased = class extends String$.pipe(/* @__PURE__ */ uppercased({ identifier: "Uppercased" })) {};
/**
* @category schema id
* @since 3.10.0
*/
const CapitalizedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Capitalized");
/**
* Verifies that a string is capitalized.
*
* @category string filters
* @since 3.10.0
*/
const capitalized = (annotations) => (self) => self.pipe(filter((a) => a[0]?.toUpperCase() === a[0], {
	schemaId: CapitalizedSchemaId,
	title: "capitalized",
	description: "a capitalized string",
	jsonSchema: { pattern: "^[^a-z]?.*$" },
	...annotations
}));
/**
* @category string constructors
* @since 3.10.0
*/
var Capitalized = class extends String$.pipe(/* @__PURE__ */ capitalized({ identifier: "Capitalized" })) {};
/**
* @category schema id
* @since 3.10.0
*/
const UncapitalizedSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Uncapitalized");
/**
* Verifies that a string is uncapitalized.
*
* @category string filters
* @since 3.10.0
*/
const uncapitalized = (annotations) => (self) => self.pipe(filter((a) => a[0]?.toLowerCase() === a[0], {
	schemaId: UncapitalizedSchemaId,
	title: "uncapitalized",
	description: "a uncapitalized string",
	jsonSchema: { pattern: "^[^A-Z]?.*$" },
	...annotations
}));
/**
* @category string constructors
* @since 3.10.0
*/
var Uncapitalized = class extends String$.pipe(/* @__PURE__ */ uncapitalized({ identifier: "Uncapitalized" })) {};
String$.pipe(/* @__PURE__ */ length(1, { identifier: "Char" }));
/**
* @category string filters
* @since 3.10.0
*/
const nonEmptyString = (annotations) => minLength(1, {
	title: "nonEmptyString",
	description: "a non empty string",
	...annotations
});
transform(String$.annotations({ description: "a string that will be converted to lowercase" }), Lowercased, {
	strict: true,
	decode: (i) => i.toLowerCase(),
	encode: identity
}).annotations({ identifier: "Lowercase" });
transform(String$.annotations({ description: "a string that will be converted to uppercase" }), Uppercased, {
	strict: true,
	decode: (i) => i.toUpperCase(),
	encode: identity
}).annotations({ identifier: "Uppercase" });
transform(String$.annotations({ description: "a string that will be converted to a capitalized format" }), Capitalized, {
	strict: true,
	decode: (i) => capitalize(i),
	encode: identity
}).annotations({ identifier: "Capitalize" });
transform(String$.annotations({ description: "a string that will be converted to an uncapitalized format" }), Uncapitalized, {
	strict: true,
	decode: (i) => uncapitalize(i),
	encode: identity
}).annotations({ identifier: "Uncapitalize" });
/**
* @category string constructors
* @since 3.10.0
*/
var Trimmed = class extends String$.pipe(/* @__PURE__ */ trimmed({ identifier: "Trimmed" })) {};
/**
* Useful for validating strings that must contain meaningful characters without
* leading or trailing whitespace.
*
* @example
* ```ts
* import { Schema } from "effect"
*
* console.log(Schema.decodeOption(Schema.NonEmptyTrimmedString)("")) // Option.none()
* console.log(Schema.decodeOption(Schema.NonEmptyTrimmedString)(" a ")) // Option.none()
* console.log(Schema.decodeOption(Schema.NonEmptyTrimmedString)("a")) // Option.some("a")
* ```
*
* @category string constructors
* @since 3.10.0
*/
var NonEmptyTrimmedString = class extends Trimmed.pipe(/* @__PURE__ */ nonEmptyString({ identifier: "NonEmptyTrimmedString" })) {};
transform(String$.annotations({ description: "a string that will be trimmed" }), Trimmed, {
	strict: true,
	decode: (i) => i.trim(),
	encode: identity
}).annotations({ identifier: "Trim" });
const getErrorMessage = (e) => e instanceof Error ? e.message : String(e);
String$.pipe(/* @__PURE__ */ nonEmptyString({ identifier: "NonEmptyString" }));
/**
* @category schema id
* @since 3.10.0
*/
const UUIDSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/UUID");
const uuidRegexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
String$.pipe(/* @__PURE__ */ pattern(uuidRegexp, {
	schemaId: UUIDSchemaId,
	identifier: "UUID",
	jsonSchema: {
		format: "uuid",
		pattern: uuidRegexp.source
	},
	description: "a Universally Unique Identifier",
	arbitrary: () => (fc) => fc.uuid()
}));
/**
* @category schema id
* @since 3.10.0
*/
const ULIDSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/ULID");
String$.pipe(/* @__PURE__ */ pattern(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i, {
	schemaId: ULIDSchemaId,
	identifier: "ULID",
	description: "a Universally Unique Lexicographically Sortable Identifier",
	arbitrary: () => (fc) => fc.ulid()
}));
/**
* Defines a schema that represents a `URL` object.
*
* @category URL constructors
* @since 3.11.0
*/
var URLFromSelf = class extends instanceOf(URL, {
	typeConstructor: { _tag: "URL" },
	identifier: "URLFromSelf",
	arbitrary: () => (fc) => fc.webUrl().map((s) => new URL(s)),
	pretty: () => (url) => url.toString()
}) {};
transformOrFail(String$.annotations({ description: "a string to be decoded into a URL" }), URLFromSelf, {
	strict: true,
	decode: (i, _, ast) => _try({
		try: () => new URL(i),
		catch: (e) => new Type(ast, i, `Unable to decode ${JSON.stringify(i)} into a URL. ${getErrorMessage(e)}`)
	}),
	encode: (a) => succeed(a.toString())
}).annotations({
	identifier: "URL",
	pretty: () => (url) => url.toString()
});
/**
* @category schema id
* @since 3.10.0
*/
const FiniteSchemaId = FiniteSchemaId$1;
/**
* Ensures that the provided value is a finite number (excluding NaN, +Infinity, and -Infinity).
*
* @category number filters
* @since 3.10.0
*/
const finite = (annotations) => (self) => self.pipe(filter(Number.isFinite, {
	schemaId: FiniteSchemaId,
	title: "finite",
	description: "a finite number",
	jsonSchema: {},
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const GreaterThanSchemaId = GreaterThanSchemaId$1;
/**
* This filter checks whether the provided number is greater than the specified minimum.
*
* @category number filters
* @since 3.10.0
*/
const greaterThan = (exclusiveMinimum, annotations) => (self) => self.pipe(filter((a) => a > exclusiveMinimum, {
	schemaId: GreaterThanSchemaId,
	title: `greaterThan(${exclusiveMinimum})`,
	description: exclusiveMinimum === 0 ? "a positive number" : `a number greater than ${exclusiveMinimum}`,
	jsonSchema: { exclusiveMinimum },
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const GreaterThanOrEqualToSchemaId = GreaterThanOrEqualToSchemaId$1;
/**
* This filter checks whether the provided number is greater than or equal to the specified minimum.
*
* @category number filters
* @since 3.10.0
*/
const greaterThanOrEqualTo = (minimum, annotations) => (self) => self.pipe(filter((a) => a >= minimum, {
	schemaId: GreaterThanOrEqualToSchemaId,
	title: `greaterThanOrEqualTo(${minimum})`,
	description: minimum === 0 ? "a non-negative number" : `a number greater than or equal to ${minimum}`,
	jsonSchema: { minimum },
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const IntSchemaId = IntSchemaId$1;
/**
* Ensures that the provided value is an integer number (excluding NaN, +Infinity, and -Infinity).
*
* @category number filters
* @since 3.10.0
*/
const int = (annotations) => (self) => self.pipe(filter((a) => Number.isSafeInteger(a), {
	schemaId: IntSchemaId,
	title: "int",
	description: "an integer",
	jsonSchema: { type: "integer" },
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const LessThanSchemaId = LessThanSchemaId$1;
/**
* This filter checks whether the provided number is less than the specified maximum.
*
* @category number filters
* @since 3.10.0
*/
const lessThan = (exclusiveMaximum, annotations) => (self) => self.pipe(filter((a) => a < exclusiveMaximum, {
	schemaId: LessThanSchemaId,
	title: `lessThan(${exclusiveMaximum})`,
	description: exclusiveMaximum === 0 ? "a negative number" : `a number less than ${exclusiveMaximum}`,
	jsonSchema: { exclusiveMaximum },
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const LessThanOrEqualToSchemaId = LessThanOrEqualToSchemaId$1;
/**
* This schema checks whether the provided number is less than or equal to the specified maximum.
*
* @category number filters
* @since 3.10.0
*/
const lessThanOrEqualTo = (maximum, annotations) => (self) => self.pipe(filter((a) => a <= maximum, {
	schemaId: LessThanOrEqualToSchemaId,
	title: `lessThanOrEqualTo(${maximum})`,
	description: maximum === 0 ? "a non-positive number" : `a number less than or equal to ${maximum}`,
	jsonSchema: { maximum },
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const BetweenSchemaId = BetweenSchemaId$1;
/**
* This filter checks whether the provided number falls within the specified minimum and maximum values.
*
* @category number filters
* @since 3.10.0
*/
const between = (minimum, maximum, annotations) => (self) => self.pipe(filter((a) => a >= minimum && a <= maximum, {
	schemaId: BetweenSchemaId,
	title: `between(${minimum}, ${maximum})`,
	description: `a number between ${minimum} and ${maximum}`,
	jsonSchema: {
		minimum,
		maximum
	},
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const NonNaNSchemaId = NonNaNSchemaId$1;
/**
* @category number filters
* @since 3.10.0
*/
const nonNaN = (annotations) => (self) => self.pipe(filter((a) => !Number.isNaN(a), {
	schemaId: NonNaNSchemaId,
	title: "nonNaN",
	description: "a number excluding NaN",
	...annotations
}));
/**
* @category number filters
* @since 3.10.0
*/
const positive = (annotations) => greaterThan(0, {
	title: "positive",
	...annotations
});
/**
* @category number filters
* @since 3.10.0
*/
const negative = (annotations) => lessThan(0, {
	title: "negative",
	...annotations
});
/**
* @category number filters
* @since 3.10.0
*/
const nonPositive = (annotations) => lessThanOrEqualTo(0, {
	title: "nonPositive",
	...annotations
});
/**
* @category number filters
* @since 3.10.0
*/
const nonNegative = (annotations) => greaterThanOrEqualTo(0, {
	title: "nonNegative",
	...annotations
});
/**
* Transforms a `string` into a `number` by parsing the string using the `parse`
* function of the `effect/Number` module.
*
* It returns an error if the value can't be converted (for example when
* non-numeric characters are provided).
*
* The following special string values are supported: "NaN", "Infinity",
* "-Infinity".
*
* @category number transformations
* @since 3.10.0
*/
function parseNumber(self) {
	return transformOrFail(self, Number$, {
		strict: false,
		decode: (i, _, ast) => fromOption(parse(i), () => new Type(ast, i, `Unable to decode ${JSON.stringify(i)} into a number`)),
		encode: (a) => succeed(String(a))
	});
}
parseNumber(String$.annotations({ description: "a string to be decoded into a number" })).annotations({ identifier: "NumberFromString" });
Number$.pipe(/* @__PURE__ */ finite({ identifier: "Finite" }));
/**
* @category number constructors
* @since 3.10.0
*/
var Int = class extends Number$.pipe(/* @__PURE__ */ int({ identifier: "Int" })) {};
Number$.pipe(/* @__PURE__ */ nonNaN({ identifier: "NonNaN" }));
Number$.pipe(/* @__PURE__ */ positive({ identifier: "Positive" }));
Number$.pipe(/* @__PURE__ */ negative({ identifier: "Negative" }));
Number$.pipe(/* @__PURE__ */ nonPositive({ identifier: "NonPositive" }));
/**
* @category number constructors
* @since 3.10.0
*/
var NonNegative = class extends Number$.pipe(/* @__PURE__ */ nonNegative({ identifier: "NonNegative" })) {};
/**
* @category schema id
* @since 3.10.0
*/
const JsonNumberSchemaId = JsonNumberSchemaId$1;
Number$.pipe(/* @__PURE__ */ finite({
	schemaId: JsonNumberSchemaId,
	identifier: "JsonNumber"
}));
transform(/* @__PURE__ */ Boolean$.annotations({ description: "a boolean that will be negated" }), Boolean$, {
	strict: true,
	decode: (i) => not(i),
	encode: (a) => not(a)
});
const encodeSymbol = (sym, ast) => {
	const key = Symbol.keyFor(sym);
	return key === void 0 ? fail(new Type(ast, sym, `Unable to encode a unique symbol ${String(sym)} into a string`)) : succeed(key);
};
const decodeSymbol = (s) => succeed(Symbol.for(s));
transformOrFail(String$.annotations({ description: "a string to be decoded into a globally shared symbol" }), SymbolFromSelf, {
	strict: false,
	decode: (i) => decodeSymbol(i),
	encode: (a, _, ast) => encodeSymbol(a, ast)
}).annotations({ identifier: "Symbol" });
/**
* @category schema id
* @since 3.10.0
*/
const GreaterThanOrEqualToBigIntSchemaId = GreaterThanOrEqualToBigIntSchemaId$1;
/**
* @category bigint filters
* @since 3.10.0
*/
const greaterThanOrEqualToBigInt = (min, annotations) => (self) => self.pipe(filter((a) => a >= min, {
	schemaId: GreaterThanOrEqualToBigIntSchemaId,
	[GreaterThanOrEqualToBigIntSchemaId]: { min },
	title: `greaterThanOrEqualToBigInt(${min})`,
	description: min === 0n ? "a non-negative bigint" : `a bigint greater than or equal to ${min}n`,
	...annotations
}));
/**
* @category schema id
* @since 3.10.0
*/
const BetweenBigIntSchemaId = BetweenBigintSchemaId;
/**
* @category bigint filters
* @since 3.10.0
*/
const betweenBigInt = (min, max, annotations) => (self) => self.pipe(filter((a) => a >= min && a <= max, {
	schemaId: BetweenBigIntSchemaId,
	[BetweenBigIntSchemaId]: {
		min,
		max
	},
	title: `betweenBigInt(${min}, ${max})`,
	description: `a bigint between ${min}n and ${max}n`,
	...annotations
}));
/**
* @category bigint filters
* @since 3.10.0
*/
const nonNegativeBigInt = (annotations) => greaterThanOrEqualToBigInt(0n, {
	title: "nonNegativeBigInt",
	...annotations
});
/** @ignore */
var BigInt$ = class extends transformOrFail(String$.annotations({ description: "a string to be decoded into a bigint" }), BigIntFromSelf, {
	strict: true,
	decode: (i, _, ast) => fromOption(fromString(i), () => new Type(ast, i, `Unable to decode ${JSON.stringify(i)} into a bigint`)),
	encode: (a) => succeed(String(a))
}).annotations({ identifier: "BigInt" }) {};
/**
* @category bigint constructors
* @since 3.10.0
*/
const NonNegativeBigIntFromSelf = /* @__PURE__ */ BigIntFromSelf.pipe(/* @__PURE__ */ nonNegativeBigInt({ identifier: "NonNegativeBigintFromSelf" }));
transformOrFail(Number$.annotations({ description: "a number to be decoded into a bigint" }), BigIntFromSelf.pipe(betweenBigInt(BigInt(Number.MIN_SAFE_INTEGER), BigInt(Number.MAX_SAFE_INTEGER))), {
	strict: true,
	decode: (i, _, ast) => fromOption(fromNumber(i), () => new Type(ast, i, `Unable to decode ${i} into a bigint`)),
	encode: (a, _, ast) => fromOption(toNumber(a), () => new Type(ast, a, `Unable to encode ${a}n into a number`))
}).annotations({ identifier: "BigIntFromNumber" });
const toComposite = (eff, onSuccess, ast, actual) => mapBoth(eff, {
	onFailure: (e) => new Composite(ast, actual, e),
	onSuccess
});
/**
* @category Duration constructors
* @since 3.10.0
*/
var DurationFromSelf = class extends declare(isDuration, {
	typeConstructor: { _tag: "effect/Duration" },
	identifier: "DurationFromSelf",
	pretty: () => String,
	arbitrary: () => (fc) => fc.oneof(fc.constant(infinity), fc.bigInt({ min: 0n }).map((_) => nanos(_)), fc.maxSafeNat().map((_) => millis(_))),
	equivalence: () => Equivalence$2
}) {};
transformOrFail(NonNegativeBigIntFromSelf.annotations({ description: "a bigint to be decoded into a Duration" }), DurationFromSelf.pipe(filter((duration) => isFinite(duration), { description: "a finite duration" })), {
	strict: true,
	decode: (i) => succeed(nanos(i)),
	encode: (a, _, ast) => match$3(toNanos(a), {
		onNone: () => fail(new Type(ast, a, `Unable to encode ${a} into a bigint`)),
		onSome: (nanos) => succeed(nanos)
	})
}).annotations({ identifier: "DurationFromNanos" });
/**
* A non-negative integer. +Infinity is excluded.
*
* @category number constructors
* @since 3.11.10
*/
const NonNegativeInt = /* @__PURE__ */ NonNegative.pipe(int()).annotations({ identifier: "NonNegativeInt" });
transform(NonNegative.annotations({ description: "a non-negative number to be decoded into a Duration" }), DurationFromSelf, {
	strict: true,
	decode: (i) => millis(i),
	encode: (a) => toMillis(a)
}).annotations({ identifier: "DurationFromMillis" });
const DurationValueMillis = /* @__PURE__ */ TaggedStruct("Millis", { millis: NonNegativeInt });
const DurationValueNanos = /* @__PURE__ */ TaggedStruct("Nanos", { nanos: BigInt$ });
const DurationValueInfinity = /* @__PURE__ */ TaggedStruct("Infinity", {});
const durationValueInfinity = /* @__PURE__ */ DurationValueInfinity.make({});
const DurationValue = /* @__PURE__ */ Union(DurationValueMillis, DurationValueNanos, DurationValueInfinity).annotations({
	identifier: "DurationValue",
	description: "an JSON-compatible tagged union to be decoded into a Duration"
});
const HRTime = /* @__PURE__ */ Union(/* @__PURE__ */ Tuple(element(NonNegativeInt).annotations({ title: "seconds" }), element(NonNegativeInt).annotations({ title: "nanos" })).annotations({ identifier: "FiniteHRTime" }), /* @__PURE__ */ Tuple(Literal(-1), Literal(0)).annotations({ identifier: "InfiniteHRTime" })).annotations({
	identifier: "HRTime",
	description: "a tuple of seconds and nanos to be decoded into a Duration"
});
const isDurationValue = (u) => typeof u === "object";
transform(Union(DurationValue, HRTime), DurationFromSelf, {
	strict: true,
	decode: (i) => {
		if (isDurationValue(i)) switch (i._tag) {
			case "Millis": return millis(i.millis);
			case "Nanos": return nanos(i.nanos);
			case "Infinity": return infinity;
		}
		const [seconds, nanos$1] = i;
		return seconds === -1 ? infinity : nanos(BigInt(seconds) * BigInt(1e9) + BigInt(nanos$1));
	},
	encode: (a) => {
		switch (a.value._tag) {
			case "Millis": return DurationValueMillis.make({ millis: a.value.millis });
			case "Nanos": return DurationValueNanos.make({ nanos: a.value.nanos });
			case "Infinity": return durationValueInfinity;
		}
	}
}).annotations({ identifier: "Duration" });
/**
* @category Uint8Array constructors
* @since 3.10.0
*/
var Uint8ArrayFromSelf = class extends declare(isUint8Array, {
	typeConstructor: { _tag: "Uint8Array" },
	identifier: "Uint8ArrayFromSelf",
	pretty: () => (u8arr) => `new Uint8Array(${JSON.stringify(Array.from(u8arr))})`,
	arbitrary: () => (fc) => fc.uint8Array(),
	equivalence: () => getEquivalence$2(equals$2)
}) {};
/**
* @category number constructors
* @since 3.11.10
*/
var Uint8 = class extends Number$.pipe(/* @__PURE__ */ between(0, 255, {
	identifier: "Uint8",
	description: "a 8-bit unsigned integer"
})) {};
transform(Array$(Uint8).annotations({ description: "an array of 8-bit unsigned integers to be decoded into a Uint8Array" }), Uint8ArrayFromSelf, {
	strict: true,
	decode: (i) => Uint8Array.from(i),
	encode: (a) => Array.from(a)
}).annotations({ identifier: "Uint8Array" });
/**
* @category schema id
* @since 3.10.0
*/
const ValidDateSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/ValidDate");
/**
* Defines a filter that specifically rejects invalid dates, such as `new
* Date("Invalid Date")`. This filter ensures that only properly formatted and
* valid date objects are accepted, enhancing data integrity by preventing
* erroneous date values from being processed.
*
* @category Date filters
* @since 3.10.0
*/
const validDate = (annotations) => (self) => self.pipe(filter((a) => !Number.isNaN(a.getTime()), {
	schemaId: ValidDateSchemaId,
	[ValidDateSchemaId]: { noInvalidDate: true },
	title: "validDate",
	description: "a valid Date",
	...annotations
}));
/**
* @category schema id
* @since 3.11.8
*/
const DateFromSelfSchemaId = DateFromSelfSchemaId$1;
/**
* Describes a schema that accommodates potentially invalid `Date` instances,
* such as `new Date("Invalid Date")`, without rejection.
*
* @category Date constructors
* @since 3.10.0
*/
var DateFromSelf = class extends declare(isDate, {
	typeConstructor: { _tag: "Date" },
	identifier: "DateFromSelf",
	schemaId: DateFromSelfSchemaId,
	[DateFromSelfSchemaId]: { noInvalidDate: false },
	description: "a potentially invalid Date instance",
	pretty: () => (date) => `new Date(${JSON.stringify(date)})`,
	arbitrary: () => (fc) => fc.date({ noInvalidDate: false }),
	equivalence: () => Date$1
}) {};
DateFromSelf.pipe(/* @__PURE__ */ validDate({
	identifier: "ValidDateFromSelf",
	description: "a valid Date instance"
}));
/**
* Defines a schema that attempts to convert a `string` to a `Date` object using
* the `new Date` constructor. This conversion is lenient, meaning it does not
* reject strings that do not form valid dates (e.g., using `new Date("Invalid
* Date")` results in a `Date` object, despite being invalid).
*
* @category Date transformations
* @since 3.10.0
*/
var DateFromString = class extends transform(String$.annotations({ description: "a string to be decoded into a Date" }), DateFromSelf, {
	strict: true,
	decode: (i) => new Date(i),
	encode: (a) => formatDate(a)
}).annotations({ identifier: "DateFromString" }) {};
DateFromString.pipe(/* @__PURE__ */ validDate({ identifier: "Date" }));
transform(Number$.annotations({ description: "a number to be decoded into a Date" }), DateFromSelf, {
	strict: true,
	decode: (i) => new Date(i),
	encode: (a) => a.getTime()
}).annotations({ identifier: "DateFromNumber" });
/**
* Describes a schema that represents a `DateTime.Utc` instance.
*
* @category DateTime.Utc constructors
* @since 3.10.0
*/
var DateTimeUtcFromSelf = class extends declare((u) => isDateTime(u) && isUtc(u), {
	typeConstructor: { _tag: "effect/DateTime.Utc" },
	identifier: "DateTimeUtcFromSelf",
	description: "a DateTime.Utc instance",
	pretty: () => (dateTime) => dateTime.toString(),
	arbitrary: () => (fc) => fc.date({ noInvalidDate: true }).map((date) => unsafeFromDate(date)),
	equivalence: () => Equivalence
}) {};
const decodeDateTimeUtc = (input, ast) => _try({
	try: () => unsafeMake(input),
	catch: () => new Type(ast, input, `Unable to decode ${formatUnknown(input)} into a DateTime.Utc`)
});
transformOrFail(Number$.annotations({ description: "a number to be decoded into a DateTime.Utc" }), DateTimeUtcFromSelf, {
	strict: true,
	decode: (i, _, ast) => decodeDateTimeUtc(i, ast),
	encode: (a) => succeed(toEpochMillis(a))
}).annotations({ identifier: "DateTimeUtcFromNumber" });
transformOrFail(DateFromSelf.annotations({ description: "a Date to be decoded into a DateTime.Utc" }), DateTimeUtcFromSelf, {
	strict: true,
	decode: (i, _, ast) => decodeDateTimeUtc(i, ast),
	encode: (a) => succeed(toDateUtc(a))
}).annotations({ identifier: "DateTimeUtcFromDate" });
transformOrFail(String$.annotations({ description: "a string to be decoded into a DateTime.Utc" }), DateTimeUtcFromSelf, {
	strict: true,
	decode: (i, _, ast) => decodeDateTimeUtc(i, ast),
	encode: (a) => succeed(formatIso(a))
}).annotations({ identifier: "DateTimeUtc" });
const timeZoneOffsetArbitrary = () => (fc) => fc.integer({
	min: -720 * 60 * 1e3,
	max: 840 * 60 * 1e3
}).map(zoneMakeOffset);
/**
* Describes a schema that represents a `TimeZone.Offset` instance.
*
* @category TimeZone constructors
* @since 3.10.0
*/
var TimeZoneOffsetFromSelf = class extends declare(isTimeZoneOffset, {
	typeConstructor: { _tag: "effect/DateTime.TimeZone.Offset" },
	identifier: "TimeZoneOffsetFromSelf",
	description: "a TimeZone.Offset instance",
	pretty: () => (zone) => zone.toString(),
	arbitrary: timeZoneOffsetArbitrary
}) {};
transform(Number$.annotations({ description: "a number to be decoded into a TimeZone.Offset" }), TimeZoneOffsetFromSelf, {
	strict: true,
	decode: (i) => zoneMakeOffset(i),
	encode: (a) => a.offset
}).annotations({ identifier: "TimeZoneOffset" });
const timeZoneNamedArbitrary = () => (fc) => fc.constantFrom(...Intl.supportedValuesOf("timeZone")).map(zoneUnsafeMakeNamed);
/**
* Describes a schema that represents a `TimeZone.Named` instance.
*
* @category TimeZone constructors
* @since 3.10.0
*/
var TimeZoneNamedFromSelf = class extends declare(isTimeZoneNamed, {
	typeConstructor: { _tag: "effect/DateTime.TimeZone.Named" },
	identifier: "TimeZoneNamedFromSelf",
	description: "a TimeZone.Named instance",
	pretty: () => (zone) => zone.toString(),
	arbitrary: timeZoneNamedArbitrary
}) {};
transformOrFail(String$.annotations({ description: "a string to be decoded into a TimeZone.Named" }), TimeZoneNamedFromSelf, {
	strict: true,
	decode: (i, _, ast) => _try({
		try: () => zoneUnsafeMakeNamed(i),
		catch: () => new Type(ast, i, `Unable to decode ${JSON.stringify(i)} into a TimeZone.Named`)
	}),
	encode: (a) => succeed(a.id)
}).annotations({ identifier: "TimeZoneNamed" });
/**
* @category TimeZone constructors
* @since 3.10.0
*/
var TimeZoneFromSelf = class extends Union(TimeZoneOffsetFromSelf, TimeZoneNamedFromSelf) {};
transformOrFail(String$.annotations({ description: "a string to be decoded into a TimeZone" }), TimeZoneFromSelf, {
	strict: true,
	decode: (i, _, ast) => match$3(zoneFromString(i), {
		onNone: () => fail(new Type(ast, i, `Unable to decode ${JSON.stringify(i)} into a TimeZone`)),
		onSome: succeed
	}),
	encode: (a) => succeed(zoneToString(a))
}).annotations({ identifier: "TimeZone" });
const timeZoneArbitrary = (fc) => fc.oneof(timeZoneOffsetArbitrary()(fc), timeZoneNamedArbitrary()(fc));
/**
* Describes a schema that represents a `DateTime.Zoned` instance.
*
* @category DateTime.Zoned constructors
* @since 3.10.0
*/
var DateTimeZonedFromSelf = class extends declare((u) => isDateTime(u) && isZoned(u), {
	typeConstructor: { _tag: "effect/DateTime.Zoned" },
	identifier: "DateTimeZonedFromSelf",
	description: "a DateTime.Zoned instance",
	pretty: () => (dateTime) => dateTime.toString(),
	arbitrary: () => (fc) => fc.tuple(fc.integer({
		min: -31536e9,
		max: 31536e9
	}), timeZoneArbitrary(fc)).map(([millis, timeZone]) => unsafeMakeZoned(millis, { timeZone })),
	equivalence: () => Equivalence
}) {};
transformOrFail(String$.annotations({ description: "a string to be decoded into a DateTime.Zoned" }), DateTimeZonedFromSelf, {
	strict: true,
	decode: (i, _, ast) => match$3(makeZonedFromString(i), {
		onNone: () => fail(new Type(ast, i, `Unable to decode ${JSON.stringify(i)} into a DateTime.Zoned`)),
		onSome: succeed
	}),
	encode: (a) => succeed(formatIsoZoned(a))
}).annotations({ identifier: "DateTimeZoned" });
const optionDecode = (input) => input._tag === "None" ? none$4() : some(input.value);
const optionArbitrary = (value, ctx) => (fc) => fc.oneof(ctx, fc.record({ _tag: fc.constant("None") }), fc.record({
	_tag: fc.constant("Some"),
	value: value(fc)
})).map(optionDecode);
const optionPretty = (value) => match$3({
	onNone: () => "none()",
	onSome: (a) => `some(${value(a)})`
});
const optionParse = (decodeUnknown) => (u, options, ast) => isOption(u) ? isNone(u) ? succeed(none$4()) : toComposite(decodeUnknown(u.value, options), some, ast, u) : fail(new Type(ast, u));
const OptionFromSelf_ = (value) => {
	return declare([value], {
		decode: (value) => optionParse(decodeUnknown(value)),
		encode: (value) => optionParse(encodeUnknown(value))
	}, {
		typeConstructor: { _tag: "effect/Option" },
		pretty: optionPretty,
		arbitrary: optionArbitrary,
		equivalence: getEquivalence$3
	});
};
/**
* @category Option transformations
* @since 3.10.0
*/
const OptionFromSelf = (value) => {
	return OptionFromSelf_(value).annotations({ description: `Option<${format(value)}>` });
};
transform(String$, /* @__PURE__ */ OptionFromSelf(NonEmptyTrimmedString), {
	strict: true,
	decode: (i) => filter$1(some(i.trim()), isNonEmpty$1),
	encode: (a) => getOrElse(a, () => "")
});
const bigDecimalPretty = () => (val) => `BigDecimal(${format$3(normalize(val))})`;
const bigDecimalArbitrary = () => (fc) => fc.tuple(fc.bigInt(), fc.integer({
	min: -18,
	max: 18
})).map(([value, scale]) => make$22(value, scale));
/**
* @category BigDecimal constructors
* @since 3.10.0
*/
var BigDecimalFromSelf = class extends declare(isBigDecimal, {
	typeConstructor: { _tag: "effect/BigDecimal" },
	identifier: "BigDecimalFromSelf",
	pretty: bigDecimalPretty,
	arbitrary: bigDecimalArbitrary,
	equivalence: () => Equivalence$3
}) {};
transformOrFail(String$.annotations({ description: "a string to be decoded into a BigDecimal" }), BigDecimalFromSelf, {
	strict: true,
	decode: (i, _, ast) => fromString$1(i).pipe(match$3({
		onNone: () => fail(new Type(ast, i, `Unable to decode ${JSON.stringify(i)} into a BigDecimal`)),
		onSome: (val) => succeed(normalize(val))
	})),
	encode: (a) => succeed(format$3(normalize(a)))
}).annotations({ identifier: "BigDecimal" });
transform(Number$.annotations({ description: "a number to be decoded into a BigDecimal" }), BigDecimalFromSelf, {
	strict: true,
	decode: (i) => unsafeFromNumber(i),
	encode: (a) => unsafeToNumber(a)
}).annotations({ identifier: "BigDecimalFromNumber" });
function getDisableValidationMakeOption(options) {
	return isBoolean(options) ? options : options?.disableValidation ?? false;
}
const FiberIdEncoded = /* @__PURE__ */ Union(/* @__PURE__ */ Struct({ _tag: Literal("None") }).annotations({ identifier: "FiberIdNoneEncoded" }), /* @__PURE__ */ Struct({
	_tag: Literal("Runtime"),
	id: Int,
	startTimeMillis: Int
}).annotations({ identifier: "FiberIdRuntimeEncoded" }), /* @__PURE__ */ Struct({
	_tag: Literal("Composite"),
	left: suspend(() => FiberIdEncoded),
	right: suspend(() => FiberIdEncoded)
}).annotations({ identifier: "FiberIdCompositeEncoded" })).annotations({ identifier: "FiberIdEncoded" });
const fiberIdArbitrary = (fc) => fc.letrec((tie) => ({
	None: fc.record({ _tag: fc.constant("None") }),
	Runtime: fc.record({
		_tag: fc.constant("Runtime"),
		id: fc.integer(),
		startTimeMillis: fc.integer()
	}),
	Composite: fc.record({
		_tag: fc.constant("Composite"),
		left: tie("FiberId"),
		right: tie("FiberId")
	}),
	FiberId: fc.oneof(tie("None"), tie("Runtime"), tie("Composite"))
})).FiberId.map(fiberIdDecode);
const fiberIdPretty = (fiberId) => {
	switch (fiberId._tag) {
		case "None": return "FiberId.none";
		case "Runtime": return `FiberId.runtime(${fiberId.id}, ${fiberId.startTimeMillis})`;
		case "Composite": return `FiberId.composite(${fiberIdPretty(fiberId.right)}, ${fiberIdPretty(fiberId.left)})`;
	}
};
/**
* @category FiberId constructors
* @since 3.10.0
*/
var FiberIdFromSelf = class extends declare(isFiberId, {
	typeConstructor: { _tag: "effect/FiberId" },
	identifier: "FiberIdFromSelf",
	pretty: () => fiberIdPretty,
	arbitrary: () => fiberIdArbitrary
}) {};
const fiberIdDecode = (input) => {
	switch (input._tag) {
		case "None": return none$2;
		case "Runtime": return runtime(input.id, input.startTimeMillis);
		case "Composite": return composite(fiberIdDecode(input.left), fiberIdDecode(input.right));
	}
};
const fiberIdEncode = (input) => {
	switch (input._tag) {
		case "None": return { _tag: "None" };
		case "Runtime": return {
			_tag: "Runtime",
			id: input.id,
			startTimeMillis: input.startTimeMillis
		};
		case "Composite": return {
			_tag: "Composite",
			left: fiberIdEncode(input.left),
			right: fiberIdEncode(input.right)
		};
	}
};
transform(FiberIdEncoded, FiberIdFromSelf, {
	strict: true,
	decode: (i) => fiberIdDecode(i),
	encode: (a) => fiberIdEncode(a)
}).annotations({ identifier: "FiberId" });
transform(Unknown, Unknown, {
	strict: true,
	decode: (i) => {
		if (isObject(i) && "message" in i && typeof i.message === "string") {
			const err = new Error(i.message, { cause: i });
			if ("name" in i && typeof i.name === "string") err.name = i.name;
			err.stack = "stack" in i && typeof i.stack === "string" ? i.stack : "";
			return err;
		}
		return prettyErrorMessage(i);
	},
	encode: (a) => {
		if (a instanceof Error) return {
			name: a.name,
			message: a.message
		};
		return prettyErrorMessage(a);
	}
}).annotations({ identifier: "Defect" });
transform(Unknown, Boolean$, {
	strict: true,
	decode: (i) => isTruthy(i),
	encode: identity
}).annotations({ identifier: "BooleanFromUnknown" });
transform(Literal("true", "false").annotations({ description: "a string to be decoded into a boolean" }), Boolean$, {
	strict: true,
	decode: (i) => i === "true",
	encode: (a) => a ? "true" : "false"
}).annotations({ identifier: "BooleanFromString" });
const SymbolStruct = /* @__PURE__ */ TaggedStruct("symbol", { key: String$ }).annotations({ description: "an object to be decoded into a globally shared symbol" });
const SymbolFromStruct = /* @__PURE__ */ transformOrFail(SymbolStruct, SymbolFromSelf, {
	strict: true,
	decode: (i) => decodeSymbol(i.key),
	encode: (a, _, ast) => map(encodeSymbol(a, ast), (key) => SymbolStruct.make({ key }))
});
/** @ignore */
var PropertyKey$ = class extends Union(String$, Number$, SymbolFromStruct).annotations({ identifier: "PropertyKey" }) {};
Struct({
	_tag: propertySignature(Literal("Pointer", "Unexpected", "Missing", "Composite", "Refinement", "Transformation", "Type", "Forbidden")).annotations({ description: "The tag identifying the type of parse issue" }),
	path: propertySignature(Array$(PropertyKey$)).annotations({ description: "The path to the property where the issue occurred" }),
	message: propertySignature(String$).annotations({ description: "A descriptive message explaining the issue" })
}).annotations({
	identifier: "ArrayFormatterIssue",
	description: "Represents an issue returned by the ArrayFormatter formatter"
});
//#endregion
//#region ../schemas/libraries/effect/download.ts
const Image = Struct({
	id: Number$,
	created: instanceOf(Date),
	title: String$.pipe(minLength(1), maxLength(100)),
	type: Literal("jpg", "png"),
	size: Number$,
	url: String$.pipe(filter((value) => URL.canParse(value)))
});
const Rating = Struct({
	id: Number$,
	stars: Number$.pipe(greaterThanOrEqualTo(0), lessThanOrEqualTo(5)),
	title: String$.pipe(minLength(1), maxLength(100)),
	text: String$.pipe(minLength(1), maxLength(1e3)),
	images: mutable(Array$(Image))
});
decodeUnknownEither(Struct({
	id: Number$,
	created: instanceOf(Date),
	title: String$.pipe(minLength(1), maxLength(100)),
	brand: String$.pipe(minLength(1), maxLength(30)),
	description: String$.pipe(minLength(1), maxLength(500)),
	price: Number$.pipe(greaterThanOrEqualTo(1), lessThanOrEqualTo(1e4)),
	discount: NullOr(Number$.pipe(greaterThanOrEqualTo(1), lessThanOrEqualTo(100))),
	quantity: Number$.pipe(greaterThanOrEqualTo(1), lessThanOrEqualTo(10)),
	tags: mutable(Array$(String$.pipe(minLength(1), maxLength(30)))),
	images: mutable(Array$(Image)),
	ratings: mutable(Array$(Rating))
}))({});
//#endregion
