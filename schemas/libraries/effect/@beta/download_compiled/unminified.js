//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Pipeable.js
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
const Prototype = { pipe() {
	return pipeArguments(this, arguments);
} };
/**
* @since 4.0.0
* @category constructors
*/
const Class$1 = /* @__PURE__ */ function() {
	function PipeableBase() {}
	PipeableBase.prototype = Prototype;
	return PipeableBase;
}();
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Function.js
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
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/equal.js
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
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Predicate.js
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Hash.js
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
				else if (Array.isArray(self) || ArrayBuffer.isView(self)) return array(self);
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
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Equal.js
/**
* The unique string identifier for the {@link Equal} interface.
*
* Use this as a computed property key when implementing custom equality on a
* class or object literal.
*
* When to use:
* - As the method name when implementing the {@link Equal} interface.
* - To check manually whether an object carries an equality method (prefer
*   {@link isEqual} instead).
*
* Behavior:
* - Pure constant — no allocation or side effects.
*
* **Example** (implementing Equal on a class)
*
* ```ts
* import { Equal, Hash } from "effect"
*
* class UserId implements Equal.Equal {
*   constructor(readonly id: string) {}
*
*   [Equal.symbol](that: Equal.Equal): boolean {
*     return that instanceof UserId && this.id === that.id
*   }
*
*   [Hash.symbol](): number {
*     return Hash.string(this.id)
*   }
* }
* ```
*
* @see {@link Equal} — the interface that uses this symbol
* @see {@link isEqual} — type guard for `Equal` implementors
*
* @since 2.0.0
*/
const symbol$2 = "~effect/interfaces/Equal";
function equals$2() {
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
		} else if (ArrayBuffer.isView(self)) {
			if (!ArrayBuffer.isView(that) || self.byteLength !== that.byteLength) return false;
			return compareTypedArrays(self, that);
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
function compareTypedArrays(self, that) {
	if (self.length !== that.length) return false;
	for (let i = 0; i < self.length; i++) if (self[i] !== that[i]) return false;
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
* Checks whether a value implements the {@link Equal} interface.
*
* When to use:
* - To branch on whether a value supports custom equality before calling
*   its `[Equal.symbol]` method directly.
* - In generic utility code that needs to distinguish `Equal` implementors
*   from plain values.
*
* Behavior:
* - Pure function, no side effects.
* - Returns `true` if and only if `u` has a property keyed by
*   {@link symbol}.
* - Acts as a TypeScript type guard, narrowing the input to {@link Equal}.
*
* **Example** (type guard)
*
* ```ts
* import { Equal, Hash } from "effect"
*
* class Token implements Equal.Equal {
*   constructor(readonly value: string) {}
*   [Equal.symbol](that: Equal.Equal): boolean {
*     return that instanceof Token && this.value === that.value
*   }
*   [Hash.symbol](): number {
*     return Hash.string(this.value)
*   }
* }
*
* console.log(Equal.isEqual(new Token("abc"))) // true
* console.log(Equal.isEqual({ x: 1 }))         // false
* console.log(Equal.isEqual(42))                // false
* ```
*
* @see {@link Equal} — the interface being checked
* @see {@link symbol} — the property key that signals `Equal` support
*
* @category guards
* @since 2.0.0
*/
const isEqual = (u) => hasProperty(u, symbol$2);
/**
* Wraps {@link equals} as an `Equivalence<A>`.
*
* When to use:
* - When an API (e.g. `Array.dedupeWith`, `Equivalence.mapInput`) requires an
*   `Equivalence` and you want to reuse `Equal.equals`.
*
* Behavior:
* - Returns a function `(a: A, b: A) => boolean` that delegates to
*   {@link equals}.
* - Pure; allocates a thin wrapper on each call.
*
* **Example** (deduplicating with Equal semantics)
*
* ```ts
* import { Array, Equal } from "effect"
*
* const eq = Equal.asEquivalence<number>()
* const result = Array.dedupeWith([1, 2, 2, 3, 1], eq)
* console.log(result) // [1, 2, 3]
* ```
*
* @see {@link equals} — the underlying comparison function
*
* @category instances
* @since 2.0.0
*/
const asEquivalence = () => equals$2;
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Equivalence.js
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
const make$12 = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/array.js
/**
* @since 2.0.0
*/
/** @internal */
const isArrayNonEmpty$1 = (self) => self.length > 0;
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Redactable.js
/**
* Symbol used to identify objects that implement the {@link Redactable}
* protocol.
*
* Add a method under this key to make an object redactable. The method
* receives the current `Context` and must return the replacement value.
*
* - Use this symbol as the property key when implementing {@link Redactable}.
* - Registered globally via `Symbol.for("~effect/Redactable")`,
*   so it is identical across multiple copies of the library at runtime.
*
* **Example** (Masking an API key)
*
* ```ts
* import { Context, Redactable } from "effect"
*
* class ApiKey {
*   constructor(readonly raw: string) {}
*
*   [Redactable.symbolRedactable](_ctx: Context.Context<never>) {
*     return this.raw.slice(0, 4) + "..."
*   }
* }
* ```
*
* See also:
* - {@link Redactable} - the interface this symbol belongs to
* - {@link isRedactable} - check whether a value has this symbol
*
* @since 4.0.0
* @category symbol
*/
const symbolRedactable = /* @__PURE__ */ Symbol.for("~effect/Redactable");
/**
* Type guard that checks whether a value implements the {@link Redactable}
* interface.
*
* See also:
* - {@link Redactable} - the interface being checked
* - {@link redact} - applies redaction if the value is redactable
*
* @since 4.0.0
* @category guards
*/
const isRedactable = (u) => hasProperty(u, symbolRedactable);
/**
* Redacts a value if it implements {@link Redactable}, otherwise returns it
* unchanged.
*
* - Use this as the general-purpose entry point for redaction: it is safe to
*   call on any value.
* - Internally calls {@link isRedactable} and, if `true`, delegates to
*   {@link getRedacted}.
* - Not recursive: nested redactable values inside the returned object are not
*   automatically redacted.
* - Pure with respect to its argument (does not mutate the input).
*
* See also:
* - {@link isRedactable} - check before redacting
* - {@link getRedacted} - lower-level variant for known redactables
*
* @since 4.0.0
*/
function redact(u) {
	if (isRedactable(u)) return getRedacted(u);
	return u;
}
/**
* Calls `[symbolRedactable]` on a value that is already known to be
* {@link Redactable} and returns the result.
*
* - Use this when you have already verified the value is `Redactable` (e.g.,
*   via {@link isRedactable}) and want to avoid a second check.
* - Reads the current fiber's `Context` from the global fiber reference. If
*   no fiber is active, an empty `Context` is passed to the redaction
*   method.
* - Does not mutate the input.
*
* See also:
* - {@link redact} - higher-level variant that handles non-redactable values
* - {@link isRedactable} - type guard to verify before calling this
*
* @since 4.0.0
*/
function getRedacted(redactable) {
	return redactable[symbolRedactable](globalThis["~effect/Fiber/currentFiber"]?.context ?? emptyContext$1);
}
/** @internal */
const currentFiberTypeId = "~effect/Fiber/currentFiber";
const emptyContext$1 = {
	"~effect/Context": {},
	mapUnsafe: /* @__PURE__ */ new Map(),
	pipe() {
		return pipeArguments(this, arguments);
	}
};
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Formatter.js
/**
* Utilities for converting arbitrary JavaScript values into human-readable
* strings, with support for circular references, redaction, and common JS
* types that `JSON.stringify` handles poorly.
*
* Mental model:
* - A `Formatter<Value, Format>` is a callable `(value: Value) => Format`.
* - {@link format} is the general-purpose pretty-printer: it handles
*   primitives, arrays, objects, `BigInt`, `Symbol`, `Date`, `RegExp`,
*   `Set`, `Map`, class instances, and circular references.
* - {@link formatJson} is a safe `JSON.stringify` wrapper that silently
*   drops circular references and applies redaction.
* - Both functions accept a `space` option for indentation control.
*
* Common tasks:
* - Pretty-print any value for debugging / logging -> {@link format}
* - Serialize to JSON safely (no circular throws) -> {@link formatJson}
* - Format a single object property key -> {@link formatPropertyKey}
* - Format a property path like `["a"]["b"]` -> {@link formatPath}
* - Format a `Date` to ISO string safely -> {@link formatDate}
*
* Gotchas:
* - {@link format} output is **not** valid JSON; use {@link formatJson} when
*   you need parseable JSON.
* - {@link format} calls `toString()` on objects by default; pass
*   `ignoreToString: true` to disable.
* - {@link formatJson} silently omits circular references (the key is
*   dropped from the output).
* - Values implementing the `Redactable` protocol are automatically
*   redacted by both {@link format} and {@link formatJson}.
*
* **Example** (Pretty-print a value)
*
* ```ts
* import { Formatter } from "effect"
*
* const obj = { name: "Alice", scores: [100, 97] }
* console.log(Formatter.format(obj))
* // {"name":"Alice","scores":[100,97]}
*
* console.log(Formatter.format(obj, { space: 2 }))
* // {
* //   "name": "Alice",
* //   "scores": [
* //     100,
* //     97
* //   ]
* // }
* ```
*
* See also: {@link Formatter}, {@link format}, {@link formatJson}
*
* @since 4.0.0
*/
/**
* Converts any JavaScript value into a human-readable string.
*
* When to use:
* - Pretty-printing values for debugging, logging, or error messages.
* - You need to handle `BigInt`, `Symbol`, `Set`, `Map`, `Date`, `RegExp`,
*   or class instances that `JSON.stringify` cannot represent.
* - You want circular references shown as `"[Circular]"` instead of
*   throwing.
*
* Behavior:
* - Does not mutate input.
* - Output is **not** valid JSON; use {@link formatJson} when you need
*   parseable JSON.
* - Primitives: stringified naturally (`null`, `undefined`, `123`, `true`).
*   Strings are JSON-quoted.
* - Objects with a custom `toString` (not `Object.prototype.toString`):
*   `toString()` is called unless `ignoreToString` is `true`.
* - Errors with a `cause`: formatted as `"<message> (cause: <cause>)"`.
* - Iterables (`Set`, `Map`, etc.): formatted as
*   `ClassName([...elements])`.
* - Class instances: wrapped as `ClassName({...})`.
* - `Redactable` values are automatically redacted.
* - Arrays/objects with 0–1 entries are inline; larger ones are
*   pretty-printed when `space` is set.
* - Circular references are replaced with `"[Circular]"`.
*
* Options:
* - `space` — indentation unit (number of spaces, or a string like
*   `"\t"`). Defaults to `0` (compact).
* - `ignoreToString` — skip calling `toString()`. Defaults to `false`.
*
* **Example** (Compact output)
*
* ```ts
* import { Formatter } from "effect"
*
* console.log(Formatter.format({ a: 1, b: [2, 3] }))
* // {"a":1,"b":[2,3]}
* ```
*
* **Example** (Pretty-printed output)
*
* ```ts
* import { Formatter } from "effect"
*
* console.log(Formatter.format({ a: 1, b: [2, 3] }, { space: 2 }))
* // {
* //   "a": 1,
* //   "b": [
* //     2,
* //     3
* //   ]
* // }
* ```
*
* **Example** (Circular reference handling)
*
* ```ts
* import { Formatter } from "effect"
*
* const obj: any = { name: "loop" }
* obj.self = obj
* console.log(Formatter.format(obj))
* // {"name":"loop","self":[Circular]}
* ```
*
* See also: {@link formatJson}, {@link Formatter}
*
* @since 4.0.0
*/
function format$3(input, options) {
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
		if (typeof v === "object" || typeof v === "function") {
			if (seen.has(v)) return CIRCULAR;
			seen.add(v);
			if (symbolRedactable in v) return format$3(getRedacted(v));
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
* Formats a single property key for display.
*
* When to use:
* - You are building a custom formatter that needs to render object keys.
*
* Behavior:
* - String keys are JSON-quoted (e.g. `"foo"`).
* - Symbol and number keys are converted with `String()`.
* - Pure function; does not mutate input.
*
* **Example** (Format property keys)
*
* ```ts
* import { Formatter } from "effect"
*
* console.log(Formatter.formatPropertyKey("name"))
* // "name"
*
* console.log(Formatter.formatPropertyKey(Symbol.for("id")))
* // Symbol(id)
* ```
*
* See also: {@link formatPath}, {@link format}
*
* @internal
*/
function formatPropertyKey(name) {
	return typeof name === "string" ? JSON.stringify(name) : String(name);
}
/**
* Formats an array of property keys as a bracket-notation path string.
*
* When to use:
* - You need to display a path through a nested object (e.g. in error
*   messages or schema validation output).
*
* Behavior:
* - Each key is wrapped in brackets and formatted via
*   {@link formatPropertyKey}.
* - Returns an empty string for an empty path.
* - Pure function; does not mutate input.
*
* **Example** (Render a property path)
*
* ```ts
* import { Formatter } from "effect"
*
* console.log(Formatter.formatPath(["users", 0, "name"]))
* // ["users"][0]["name"]
* ```
*
* See also: {@link formatPropertyKey}, {@link format}
*
* @internal
*/
function formatPath(path) {
	return path.map((key) => `[${formatPropertyKey(key)}]`).join("");
}
/**
* Formats a `Date` as an ISO 8601 string, returning `"Invalid Date"` for
* invalid dates instead of throwing.
*
* When to use:
* - You want a safe `toISOString()` that never throws.
*
* Behavior:
* - Returns `date.toISOString()` on success.
* - Returns `"Invalid Date"` if `toISOString()` throws (e.g. for
*   `new Date(NaN)`).
* - Pure function; does not mutate input.
*
* **Example** (Safe date formatting)
*
* ```ts
* import { Formatter } from "effect"
*
* console.log(Formatter.formatDate(new Date("2024-01-15T10:30:00Z")))
* // 2024-01-15T10:30:00.000Z
*
* console.log(Formatter.formatDate(new Date("invalid")))
* // Invalid Date
* ```
*
* See also: {@link format}
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
* Safely stringifies a value to JSON, silently dropping circular references.
*
* When to use:
* - You need valid JSON output (unlike {@link format}).
* - The input may contain circular references and you want them silently
*   omitted rather than throwing a `TypeError`.
*
* Behavior:
* - Does not mutate input.
* - Uses `JSON.stringify` internally with a replacer that tracks seen
*   objects.
* - Circular references are replaced with `undefined` (omitted from
*   output).
* - `Redactable` values are automatically redacted before serialization.
* - Types not supported by JSON (`BigInt`, `Symbol`, `undefined`,
*   functions) follow standard `JSON.stringify` behavior (omitted or
*   `null` in arrays).
*
* Options:
* - `space` — indentation unit (number of spaces, or a string like
*   `"\t"`). Defaults to `0` (compact).
*
* **Example** (Compact JSON)
*
* ```ts
* import { Formatter } from "effect"
*
* console.log(Formatter.formatJson({ name: "Alice", age: 30 }))
* // {"name":"Alice","age":30}
* ```
*
* **Example** (Circular reference handling)
*
* ```ts
* import { Formatter } from "effect"
*
* const obj: any = { name: "test" }
* obj.self = obj
* console.log(Formatter.formatJson(obj))
* // {"name":"test"}
* ```
*
* **Example** (Pretty-printed JSON)
*
* ```ts
* import { Formatter } from "effect"
*
* console.log(Formatter.formatJson({ name: "Alice", age: 30 }, { space: 2 }))
* // {
* //   "name": "Alice",
* //   "age": 30
* // }
* ```
*
* See also: {@link format}, {@link Formatter}
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
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Inspectable.js
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Utils.js
/**
* An `IterableIterator` that yields its wrapped value exactly once.
*
* When to use:
*
* - Implement `[Symbol.iterator]()` on Effect-like types so they can be
*   `yield*`-ed inside generator functions (e.g. `Effect.gen`, `Option.gen`).
* - You almost never construct this directly — it is created internally by
*   yieldable types.
*
* Behavior:
*
* - The first call to `next()` returns `{ value: self, done: false }`.
* - Every subsequent call returns `{ value: a, done: true }` where `a` is
*   the argument passed to `next()`.
* - `[Symbol.iterator]()` returns a **new** `SingleShotGen` wrapping the same
*   value, so the outer type can be iterated multiple times.
* - Does not mutate the wrapped value.
*
* **Example** (Yielding a wrapped value in a generator)
*
* ```ts
* import { Utils } from "effect"
*
* const gen = new Utils.SingleShotGen<string, number>("hello")
*
* // First call yields the wrapped value
* console.log(gen.next(0))
* // { value: "hello", done: false }
*
* // Second call signals completion with the provided value
* console.log(gen.next(42))
* // { value: 42, done: true }
* ```
*
* @see {@link Gen} — the type-level signature that relies on `SingleShotGen`
*
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
const InternalTypeId = "~effect/Utils/internal";
const standard = { [InternalTypeId]: (body) => {
	return body();
} };
const forced = { [InternalTypeId]: (body) => {
	try {
		return body();
	} finally {}
} };
/** @internal */
const internalCall = /* @__PURE__ */ standard[InternalTypeId](() => (/* @__PURE__ */ new Error()).stack)?.includes(InternalTypeId) === true ? standard[InternalTypeId] : forced[InternalTypeId];
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/core.js
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
		return format$3(this.toJSON(), {
			ignoreToString: true,
			space: 2
		});
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
		for (let i = 0; i < selfKeys.length; i++) if (selfKeys[i] !== thatKeys[i] && !equals$2(this[selfKeys[i]], that[selfKeys[i]])) return false;
		return true;
	}
};
/** @internal */
const YieldableProto = { [Symbol.iterator]() {
	return new SingleShotGen(this);
} };
/** @internal */
const YieldableErrorProto = {
	...YieldableProto,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
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
		return `Cause(${format$3(this.reasons)})`;
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	[symbol$2](that) {
		return isCause$1(that) && this.reasons.length === that.reasons.length && this.reasons.every((e, i) => equals$2(e, that.reasons[i]));
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
		return format$3(this);
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
		return `Fail(${format$3(this.error)})`;
	}
	toJSON() {
		return {
			_tag: "Fail",
			error: this.error
		};
	}
	[symbol$2](that) {
		return isFailReason$1(that) && equals$2(this.error, that.error) && equals$2(this.annotations, that.annotations);
	}
	[symbol$3]() {
		return combine$1(string$2(this._tag))(combine$1(hash(this.error))(hash(this.annotations)));
	}
};
/** @internal */
const causeFromReasons = (reasons) => new CauseImpl(reasons);
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
		return `Die(${format$3(this.defect)})`;
	}
	toJSON() {
		return {
			_tag: "Die",
			defect: this.defect
		};
	}
	[symbol$2](that) {
		return isDieReason$1(that) && equals$2(this.defect, that.defect) && equals$2(this.annotations, that.annotations);
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
			return `${options.op}(${format$3(this[args])})`;
		},
		toJSON() {
			return {
				_id: "Exit",
				_tag: options.op,
				[options.prop]: this[args]
			};
		},
		[symbol$2](that) {
			return isExit$1(that) && that._tag === this._tag && equals$2(this[args], that[args]);
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
	Object.assign(YieldableError.prototype, YieldableErrorProto);
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
var NoSuchElementError$1 = class extends TaggedError$1("NoSuchElementError") {
	[NoSuchElementErrorTypeId$1] = NoSuchElementErrorTypeId$1;
	constructor(message) {
		super({ message });
	}
};
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/option.js
/**
* @since 2.0.0
*/
const TypeId$14 = "~effect/data/Option";
const CommonProto$1 = {
	[TypeId$14]: { _A: (_) => _ },
	...PipeInspectableProto,
	...YieldableProto
};
const SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$1), {
	_tag: "Some",
	_op: "Some",
	[symbol$2](that) {
		return isOption$1(that) && isSome$1(that) && equals$2(this.value, that.value);
	},
	[symbol$3]() {
		return combine$1(hash(this._tag))(hash(this.value));
	},
	toString() {
		return `some(${format$3(this.value)})`;
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
Object.defineProperty(SomeProto, "valueOrUndefined", { get() {
	return this.value;
} });
const NoneHash = /* @__PURE__ */ hash("None");
const NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$1), {
	_tag: "None",
	_op: "None",
	valueOrUndefined: void 0,
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
const isOption$1 = (input) => hasProperty(input, TypeId$14);
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
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/result.js
const TypeId$13 = "~effect/data/Result";
const CommonProto = {
	[TypeId$13]: {
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
		return isResult$1(that) && isSuccess$4(that) && equals$2(this.success, that.success);
	},
	[symbol$3]() {
		return combine$1(hash(this._tag))(hash(this.success));
	},
	toString() {
		return `success(${format$3(this.success)})`;
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
		return isResult$1(that) && isFailure$4(that) && equals$2(this.failure, that.failure);
	},
	[symbol$3]() {
		return combine$1(hash(this._tag))(hash(this.failure));
	},
	toString() {
		return `failure(${format$3(this.failure)})`;
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
const isResult$1 = (input) => hasProperty(input, TypeId$13);
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Order.js
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
function make$11(compare) {
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
const Number$4 = /* @__PURE__ */ make$11((self, that) => {
	if (globalThis.Number.isNaN(self) && globalThis.Number.isNaN(that)) return 0;
	if (globalThis.Number.isNaN(self)) return -1;
	if (globalThis.Number.isNaN(that)) return 1;
	return self < that ? -1 : 1;
});
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Option.js
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
* Extracts the value from a `Some`, or returns `undefined` for `None`.
*
* **When to use**
*
* - Interoping with APIs that use `undefined` for missing values
*
* **Behavior**
*
* - `Some` → the inner value
* - `None` → `undefined`
*
* **Example** (Unwrapping to undefined)
*
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
* @see {@link getOrNull} to return `null` instead
* @see {@link getOrElse} for a custom fallback
*
* @category Getters
* @since 2.0.0
*/
const getOrUndefined = /* @__PURE__ */ (/* @__PURE__ */ dual(2, (self, onNone) => isNone(self) ? onNone() : self.value))(constUndefined);
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Result.js
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Array.js
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
const Array$1 = globalThis.Array;
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
const fromIterable = (collection) => Array$1.isArray(collection) ? collection : Array$1.from(collection);
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
Array$1.isArray;
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
const headNonEmpty = /* @__PURE__ */ (/* @__PURE__ */ dual(2, (self, index) => {
	const i = Math.floor(index);
	if (isOutOfBounds(i, self)) throw new Error(`Index out of bounds: ${i}`);
	return self[i];
}))(0);
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
const TypeId$12 = "~effect/BigDecimal";
const BigDecimalProto = {
	[TypeId$12]: TypeId$12,
	[symbol$3]() {
		const normalized = normalize(this);
		return combine$1(hash(normalized.value), number$2(normalized.scale));
	},
	[symbol$2](that) {
		return isBigDecimal(that) && equals$1(this, that);
	},
	toString() {
		return `BigDecimal(${format$2(this)})`;
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
* @example
* ```ts
* import { BigDecimal } from "effect"
*
* const decimal = BigDecimal.fromNumber(123.45)
* console.log(BigDecimal.isBigDecimal(decimal)) // true
* console.log(BigDecimal.isBigDecimal(123.45)) // false
* console.log(BigDecimal.isBigDecimal("123.45")) // false
* ```
*
* @since 2.0.0
* @category guards
*/
const isBigDecimal = (u) => hasProperty(u, TypeId$12);
/**
* Creates a `BigDecimal` from a `bigint` value and a scale.
*
* @example
* ```ts
* import { BigDecimal } from "effect"
*
* // Create 123.45 (12345 with scale 2)
* const decimal = BigDecimal.make(12345n, 2)
* console.log(BigDecimal.format(decimal)) // "123.45"
*
* // Create 42 (42 with scale 0)
* const integer = BigDecimal.make(42n, 0)
* console.log(BigDecimal.format(integer)) // "42"
* ```
*
* @since 2.0.0
* @category constructors
*/
const make$10 = (value, scale) => {
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
const makeNormalizedUnsafe = (value, scale) => {
	if (value !== bigint0$2 && value % bigint10 === bigint0$2) throw new RangeError("Value must be normalized");
	const o = make$10(value, scale);
	o.normalized = o;
	return o;
};
const bigint0$2 = /* @__PURE__ */ BigInt(0);
const bigint10 = /* @__PURE__ */ BigInt(10);
const zero$1 = /* @__PURE__ */ makeNormalizedUnsafe(bigint0$2, 0);
/**
* Normalizes a given `BigDecimal` by removing trailing zeros.
*
* @example
* ```ts
* import { fromStringUnsafe, make, normalize } from "effect/BigDecimal"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(
*   normalize(fromStringUnsafe("123.00000")),
*   normalize(make(123n, 0))
* )
* assert.deepStrictEqual(
*   normalize(fromStringUnsafe("12300000")),
*   normalize(make(123n, -5))
* )
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
		self.normalized = makeNormalizedUnsafe(BigInt(digits.substring(0, digits.length - trail)), self.scale - trail);
	}
	return self.normalized;
};
/**
* Scales a given `BigDecimal` to the specified scale.
*
* If the given scale is smaller than the current scale, the value will be rounded down to
* the nearest integer.
*
* @example
* ```ts
* import { BigDecimal } from "effect"
*
* const decimal = BigDecimal.fromNumberUnsafe(123.45)
*
* // Increase scale (add more precision)
* const scaled = BigDecimal.scale(decimal, 4)
* console.log(BigDecimal.format(scaled)) // "123.4500"
*
* // Decrease scale (reduce precision, rounds down)
* const reduced = BigDecimal.scale(decimal, 1)
* console.log(BigDecimal.format(reduced)) // "123.4"
* ```
*
* @since 2.0.0
* @category scaling
*/
const scale = /* @__PURE__ */ dual(2, (self, scale) => {
	if (scale > self.scale) return make$10(self.value * bigint10 ** BigInt(scale - self.scale), scale);
	if (scale < self.scale) return make$10(self.value / bigint10 ** BigInt(self.scale - scale), scale);
	return self;
});
/**
* Determines the absolute value of a given `BigDecimal`.
*
* @example
* ```ts
* import { abs, fromStringUnsafe } from "effect/BigDecimal"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(abs(fromStringUnsafe("-5")), fromStringUnsafe("5"))
* assert.deepStrictEqual(abs(fromStringUnsafe("0")), fromStringUnsafe("0"))
* assert.deepStrictEqual(abs(fromStringUnsafe("5")), fromStringUnsafe("5"))
* ```
*
* @since 2.0.0
* @category math
*/
const abs = (n) => n.value < bigint0$2 ? make$10(-n.value, n.scale) : n;
/**
* Provides an `Equivalence` instance for `BigDecimal` that determines equality between BigDecimal values.
*
* @example
* ```ts
* import { BigDecimal } from "effect"
*
* const a = BigDecimal.fromNumberUnsafe(1.50)
* const b = BigDecimal.fromNumberUnsafe(1.5)
* const c = BigDecimal.fromNumberUnsafe(2.0)
*
* console.log(BigDecimal.Equivalence(a, b)) // true (1.50 === 1.5)
* console.log(BigDecimal.Equivalence(a, c)) // false (1.50 !== 2.0)
* ```
*
* @category instances
* @since 2.0.0
*/
const Equivalence$3 = /* @__PURE__ */ make$12((self, that) => {
	if (self.scale > that.scale) return scale(that, self.scale).value === self.value;
	if (self.scale < that.scale) return scale(self, that.scale).value === that.value;
	return self.value === that.value;
});
/**
* Checks if two `BigDecimal`s are equal.
*
* @example
* ```ts
* import { BigDecimal } from "effect"
*
* const a = BigDecimal.fromNumberUnsafe(1.5)
* const b = BigDecimal.fromNumberUnsafe(1.50)
* const c = BigDecimal.fromNumberUnsafe(2.0)
*
* console.log(BigDecimal.equals(a, b)) // true
* console.log(BigDecimal.equals(a, c)) // false
* ```
*
* @since 2.0.0
* @category predicates
*/
const equals$1 = /* @__PURE__ */ dual(2, (self, that) => Equivalence$3(self, that));
/**
* Formats a given `BigDecimal` as a `string`.
*
* If the scale of the `BigDecimal` is greater than or equal to 16, the `BigDecimal` will
* be formatted in scientific notation.
*
* @example
* ```ts
* import { format, fromStringUnsafe } from "effect/BigDecimal"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(format(fromStringUnsafe("-5")), "-5")
* assert.deepStrictEqual(format(fromStringUnsafe("123.456")), "123.456")
* assert.deepStrictEqual(format(fromStringUnsafe("-0.00000123")), "-0.00000123")
* ```
*
* @since 2.0.0
* @category conversions
*/
const format$2 = (n) => {
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
* import { make, toExponential } from "effect/BigDecimal"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(toExponential(make(123456n, -5)), "1.23456e+10")
* ```
*
* @since 4.0.0
* @category conversions
*/
const toExponential = (n) => {
	if (isZero(n)) return "0e+0";
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
* Checks if a given `BigDecimal` is `0`.
*
* @example
* ```ts
* import { fromStringUnsafe, isZero } from "effect/BigDecimal"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(isZero(fromStringUnsafe("0")), true)
* assert.deepStrictEqual(isZero(fromStringUnsafe("1")), false)
* ```
*
* @since 2.0.0
* @category predicates
*/
const isZero = (n) => n.value === bigint0$2;
/**
* Checks if a given `BigDecimal` is negative.
*
* @example
* ```ts
* import { fromStringUnsafe, isNegative } from "effect/BigDecimal"
* import * as assert from "node:assert"
*
* assert.deepStrictEqual(isNegative(fromStringUnsafe("-1")), true)
* assert.deepStrictEqual(isNegative(fromStringUnsafe("0")), false)
* assert.deepStrictEqual(isNegative(fromStringUnsafe("1")), false)
* ```
*
* @since 2.0.0
* @category predicates
*/
const isNegative = (n) => n.value < bigint0$2;
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Context.js
/**
* @since 4.0.0
* @category Type Identifiers
*/
const ServiceTypeId = "~effect/Context/Service";
/**
* @example
* ```ts
* import { Context } from "effect"
*
* // Create a simple service
* const Database = Context.Service<{
*   query: (sql: string) => string
* }>("Database")
*
* // Create a service class
* class Config extends Context.Service<Config, {
*   port: number
* }>()("Config") {}
*
* // Use the services to create contexts
* const db = Context.make(Database, {
*   query: (sql) => `Result: ${sql}`
* })
* const config = Context.make(Config, { port: 8080 })
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
	[ServiceTypeId]: ServiceTypeId,
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
		return (this.asEffect = constant(withFiber$1((fiber) => exitSucceed(get(fiber.context, this)))))();
	},
	of(self) {
		return self;
	},
	context(self) {
		return make$9(this, self);
	},
	use(f) {
		return withFiber$1((fiber) => f(get(fiber.context, this)));
	},
	useSync(f) {
		return withFiber$1((fiber) => exitSucceed(f(get(fiber.context, this))));
	}
};
const ReferenceTypeId = "~effect/Context/Reference";
const TypeId$11 = "~effect/Context";
/**
* @example
* ```ts
* import { Context } from "effect"
*
* // Create a context from a Map (unsafe)
* const map = new Map([
*   ["Logger", { log: (msg: string) => console.log(msg) }]
* ])
*
* const context = Context.makeUnsafe(map)
* ```
*
* @since 4.0.0
* @category Constructors
*/
const makeUnsafe$5 = (mapUnsafe) => {
	const self = Object.create(Proto$1);
	self.mapUnsafe = mapUnsafe;
	self.mutable = false;
	return self;
};
const Proto$1 = {
	...PipeInspectableProto,
	[TypeId$11]: { _Services: (_) => _ },
	toJSON() {
		return {
			_id: "Context",
			services: Array.from(this.mapUnsafe).map(([key, value]) => ({
				key,
				value
			}))
		};
	},
	[symbol$2](that) {
		if (!isContext(that) || this.mapUnsafe.size !== that.mapUnsafe.size) return false;
		for (const k of this.mapUnsafe.keys()) if (!that.mapUnsafe.has(k) || !equals$2(this.mapUnsafe.get(k), that.mapUnsafe.get(k))) return false;
		return true;
	},
	[symbol$3]() {
		return number$2(this.mapUnsafe.size);
	}
};
/**
* Checks if the provided argument is a `Context`.
*
* @example
* ```ts
* import { Context } from "effect"
* import * as assert from "node:assert"
*
* assert.strictEqual(Context.isContext(Context.empty()), true)
* ```
*
* @since 4.0.0
* @category Guards
*/
const isContext = (u) => hasProperty(u, TypeId$11);
/**
* Returns an empty `Context`.
*
* @example
* ```ts
* import { Context } from "effect"
* import * as assert from "node:assert"
*
* assert.strictEqual(Context.isContext(Context.empty()), true)
* ```
*
* @since 4.0.0
* @category Constructors
*/
const empty$1 = () => emptyContext;
const emptyContext = /* @__PURE__ */ makeUnsafe$5(/* @__PURE__ */ new Map());
/**
* Creates a new `Context` with a single service associated to the key.
*
* @example
* ```ts
* import { Context } from "effect"
* import * as assert from "node:assert"
*
* const Port = Context.Service<{ PORT: number }>("Port")
*
* const context = Context.make(Port, { PORT: 8080 })
*
* assert.deepStrictEqual(Context.get(context, Port), { PORT: 8080 })
* ```
*
* @since 4.0.0
* @category Constructors
*/
const make$9 = (key, service) => makeUnsafe$5(new Map([[key.key, service]]));
/**
* Adds a service to a given `Context`.
*
* @example
* ```ts
* import { pipe, Context } from "effect"
* import * as assert from "node:assert"
*
* const Port = Context.Service<{ PORT: number }>("Port")
* const Timeout = Context.Service<{ TIMEOUT: number }>("Timeout")
*
* const someContext = Context.make(Port, { PORT: 8080 })
*
* const context = pipe(
*   someContext,
*   Context.add(Timeout, { TIMEOUT: 5000 })
* )
*
* assert.deepStrictEqual(Context.get(context, Port), { PORT: 8080 })
* assert.deepStrictEqual(Context.get(context, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 4.0.0
* @category Adders
*/
const add$2 = /* @__PURE__ */ dual(3, (self, key, service) => withMapUnsafe(self, (map) => {
	map.set(key.key, service);
}));
/**
* Get a service from the context that corresponds to the given key.
*
* @param self - The `Context` to search for the service.
* @param service - The `Service` of the service to retrieve.
*
* @example
* ```ts
* import { pipe, Context } from "effect"
* import * as assert from "node:assert"
*
* const Port = Context.Service<{ PORT: number }>("Port")
* const Timeout = Context.Service<{ TIMEOUT: number }>("Timeout")
*
* const context = pipe(
*   Context.make(Port, { PORT: 8080 }),
*   Context.add(Timeout, { TIMEOUT: 5000 })
* )
*
* assert.deepStrictEqual(Context.get(context, Timeout), { TIMEOUT: 5000 })
* ```
*
* @since 4.0.0
* @category Getters
*/
const get = /* @__PURE__ */ dual(2, (self, service) => {
	if (!self.mapUnsafe.has(service.key)) {
		if (ReferenceTypeId in service) return getDefaultValue(service);
		throw serviceNotFoundError(service);
	}
	return self.mapUnsafe.get(service.key);
});
/**
* @example
* ```ts
* import { Context } from "effect"
* import * as assert from "node:assert"
*
* const LoggerRef = Context.Reference("Logger", {
*   defaultValue: () => ({ log: (msg: string) => console.log(msg) })
* })
*
* const context = Context.empty()
* const logger = Context.getReferenceUnsafe(context, LoggerRef)
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
const defaultValueCacheKey = "~effect/Context/defaultValue";
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
const withMapUnsafe = (self, f) => {
	if (self.mutable) {
		f(self.mapUnsafe);
		return self;
	}
	const map = new Map(self.mapUnsafe);
	f(map);
	return makeUnsafe$5(map);
};
/**
* Creates a context key with a default value.
*
* **Details**
*
* `Context.Reference` allows you to create a key that can hold a value. You
* can provide a default value for the service, which will automatically be used
* when the context is accessed, or override it with a custom implementation
* when needed.
*
* @example
* ```ts
* import { Context } from "effect"
*
* // Create a reference with a default value
* const LoggerRef = Context.Reference("Logger", {
*   defaultValue: () => ({ log: (msg: string) => console.log(msg) })
* })
*
* // The reference provides the default value when accessed from an empty context
* const context = Context.empty()
* const logger = Context.get(context, LoggerRef)
*
* // You can also override the default value
* const customContext = Context.make(LoggerRef, {
*   log: (msg: string) => `Custom: ${msg}`
* })
* const customLogger = Context.get(customContext, LoggerRef)
* ```
*
* @since 4.0.0
* @category References
*/
const Reference = Service;
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Duration.js
const TypeId$10 = "~effect/time/Duration";
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Scheduler.js
/**
* @since 2.0.0
*/
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
* @since 2.0.0
* @category schedulers
*/
var MixedScheduler = class {
	executionMode;
	setImmediate;
	constructor(executionMode = "async", setImmediateFn = setImmediate) {
		this.executionMode = executionMode;
		this.setImmediate = setImmediateFn;
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
	makeDispatcher() {
		return new MixedSchedulerDispatcher(this.setImmediate);
	}
};
var MixedSchedulerDispatcher = class {
	tasks = /* @__PURE__ */ new PriorityBuckets();
	running = void 0;
	setImmediate;
	constructor(setImmediateFn = setImmediate) {
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
* @since 4.0.0
* @category references
*/
const MaxOpsBeforeYield = /* @__PURE__ */ Reference("effect/Scheduler/MaxOpsBeforeYield", { defaultValue: () => 2048 });
/**
* A service reference that controls whether the runtime should bypass scheduler
* yield checks. When set to `true`, the fiber run loop won't call
* `Scheduler.shouldYield`.
*
* @since 4.0.0
* @category references
*/
const PreventSchedulerYield = /* @__PURE__ */ Reference("effect/Scheduler/PreventSchedulerYield", { defaultValue: () => false });
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Tracer.js
/**
* @since 2.0.0
*/
/**
* @since 2.0.0
* @category tags
* @example
* ```ts
* import { Tracer } from "effect"
*
* // The key used to identify parent spans in the context
* console.log(Tracer.ParentSpanKey) // "effect/Tracer/ParentSpan"
* ```
*/
const ParentSpanKey = "effect/Tracer/ParentSpan";
Service()(ParentSpanKey);
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
* @since 4.0.0
* @category references
*/
const TracerKey = "effect/Tracer";
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/metric.js
/** @internal */
const FiberRuntimeMetricsKey = "effect/observability/Metric/FiberRuntimeMetricsKey";
/** @internal */
const CurrentStackFrame = /* @__PURE__ */ Reference("effect/References/CurrentStackFrame", { defaultValue: constUndefined });
/** @internal */
const CurrentLogLevel = /* @__PURE__ */ Reference("effect/References/CurrentLogLevel", { defaultValue: () => "Info" });
/** @internal */
const MinimumLogLevel = /* @__PURE__ */ Reference("effect/References/MinimumLogLevel", { defaultValue: () => "Info" });
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/effect.js
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
const causeInterrupt = (fiberId) => new CauseImpl([new Interrupt(fiberId)]);
/** @internal */
const findError$2 = (self) => {
	for (let i = 0; i < self.reasons.length; i++) {
		const reason = self.reasons[i];
		if (reason._tag === "Fail") return succeed$3(reason.error);
	}
	return fail$4(self);
};
/** @internal */
const hasInterrupts$2 = (self) => self.reasons.some(isInterruptReason$1);
/** @internal */
const causeCombine = /* @__PURE__ */ dual(2, (self, that) => {
	if (self.reasons.length === 0) return that;
	else if (that.reasons.length === 0) return self;
	const newCause = new CauseImpl(union$1(self.reasons, that.reasons));
	return equals$2(self, newCause) ? self : newCause;
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
const renderErrorCause = (cause, prefix) => {
	const lines = cause.stack.split("\n");
	let stack = `${prefix}[cause]: ${lines[0]}`;
	for (let i = 1, len = lines.length; i < len; i++) stack += `\n${prefix}${lines[i]}`;
	if (cause.cause) stack += ` {\n${renderErrorCause(cause.cause, `${prefix}  `)}\n${prefix}}`;
	return stack;
};
/** @internal */
const FiberTypeId = `~effect/Fiber/dev`;
const fiberVariance = {
	_A: identity,
	_E: identity
};
const fiberIdStore = { id: 0 };
/** @internal */
const getCurrentFiber = () => globalThis[currentFiberTypeId];
/** @internal */
var FiberImpl = class {
	constructor(context, interruptible = true) {
		this[FiberTypeId] = fiberVariance;
		this.setContext(context);
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
	context;
	currentScheduler;
	currentTracerContext;
	currentSpan;
	currentLogLevel;
	minimumLogLevel;
	currentStackFrame;
	runtimeMetrics;
	maxOpsBeforeYield;
	currentPreventYield;
	_dispatcher = void 0;
	get currentDispatcher() {
		return this._dispatcher ??= this.currentScheduler.makeDispatcher();
	}
	getRef(ref) {
		return getReferenceUnsafe(this.context, ref);
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
		if (this.currentStackFrame) cause = causeAnnotate(cause, make$9(StackTraceKey, this.currentStackFrame));
		if (annotations) cause = causeAnnotate(cause, annotations);
		this._interruptedCause = this._interruptedCause ? causeCombine(this._interruptedCause, cause) : cause;
		if (this.interruptible) this.evaluate(failCause$2(this._interruptedCause));
	}
	pollUnsafe() {
		return this._exit;
	}
	evaluate(effect) {
		this.runtimeMetrics?.recordFiberStart(this.context);
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
		this.runtimeMetrics?.recordFiberEnd(this.context, this._exit);
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
				if (!yielding && !this.currentPreventYield && this.currentScheduler.shouldYield(this)) {
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
	setContext(context) {
		this.context = context;
		const scheduler = this.getRef(Scheduler);
		if (scheduler !== this.currentScheduler) {
			this.currentScheduler = scheduler;
			this._dispatcher = void 0;
		}
		this.currentSpan = context.mapUnsafe.get(ParentSpanKey);
		this.currentLogLevel = this.getRef(CurrentLogLevel);
		this.minimumLogLevel = this.getRef(MinimumLogLevel);
		this.currentStackFrame = context.mapUnsafe.get(CurrentStackFrame.key);
		this.maxOpsBeforeYield = this.getRef(MaxOpsBeforeYield);
		this.currentPreventYield = this.getRef(PreventSchedulerYield);
		this.runtimeMetrics = context.mapUnsafe.get(FiberRuntimeMetricsKey);
		const currentTracer = context.mapUnsafe.get(TracerKey);
		this.currentTracerContext = currentTracer ? currentTracer["context"] : void 0;
	}
	get currentSpanLocal() {
		return this.currentSpan?._tag === "Span" ? this.currentSpan : void 0;
	}
};
const fiberMiddleware = { interruptChildren: void 0 };
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
const yieldNow$1 = /* @__PURE__ */ (/* @__PURE__ */ makePrimitive({
	op: "Yield",
	[evaluate](fiber) {
		let resumed = false;
		fiber.currentDispatcher.scheduleTask(() => {
			if (resumed) return;
			fiber.evaluate(exitVoid);
		}, this[args] ?? 0);
		return fiber.yieldWith(() => {
			resumed = true;
		});
	}
}))(0);
/** @internal */
const succeedSome$1 = (a) => succeed$2(some(a));
/** @internal */
const succeedNone$1 = /* @__PURE__ */ succeed$2(/* @__PURE__ */ none());
/** @internal */
const die$3 = (defect) => exitDie(defect);
/** @internal */
const failSync$1 = (error) => suspend$1(() => fail$3(internalCall(error)));
/** @internal */
const void_$3 = /* @__PURE__ */ succeed$2(void 0);
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
		fiber._yielded = () => {
			resumed = true;
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
const fnUntraced$1 = (body, ...pipeables) => {
	const fn = pipeables.length === 0 ? function() {
		return suspend$1(() => fromIteratorUnsafe(body.apply(this, arguments)));
	} : function() {
		let effect = suspend$1(() => fromIteratorUnsafe(body.apply(this, arguments)));
		for (let i = 0; i < pipeables.length; i++) effect = pipeables[i](effect, ...arguments);
		return effect;
	};
	return defineFunctionLength(body.length, fn);
};
const defineFunctionLength = (length, fn) => Object.defineProperty(fn, "length", {
	value: length,
	configurable: true
});
/** @internal */
const fnUntracedEager$1 = (body, ...pipeables) => defineFunctionLength(body.length, pipeables.length === 0 ? function() {
	return fromIteratorEagerUnsafe(() => body.apply(this, arguments));
} : function() {
	let effect = fromIteratorEagerUnsafe(() => body.apply(this, arguments));
	for (const pipeable of pipeables) effect = pipeable(effect);
	return effect;
});
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
const effectIsExit = (effect) => ExitTypeId in effect;
/** @internal */
const flatMapEager$1 = /* @__PURE__ */ dual(2, (self, f) => {
	if (effectIsExit(self)) return self._tag === "Success" ? f(self.value) : self;
	return flatMap$1(self, f);
});
/** @internal */
const map$3 = /* @__PURE__ */ dual(2, (self, f) => flatMap$1(self, (a) => succeed$2(internalCall(() => f(a)))));
/** @internal */
const mapEager$1 = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMap(self, f) : map$3(self, f));
/** @internal */
const mapErrorEager$1 = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMapError(self, f) : mapError$2(self, f));
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
const exitIsSuccess = (self) => self._tag === "Success";
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
const exitAsVoidAll = (exits) => {
	const failures = [];
	for (const exit of exits) if (exit._tag === "Failure") failures.push(...exit.cause.reasons);
	return failures.length === 0 ? exitVoid : exitFailCause(causeFromReasons(failures));
};
/** @internal */
const exitGetSuccess = (self) => exitIsSuccess(self) ? some(self.value) : none();
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
const catchCauseFilter$1 = /* @__PURE__ */ dual(3, (self, filter, f) => catchCause$1(self, (cause) => {
	const eb = filter(cause);
	return isFailure$3(eb) ? failCause$2(eb.failure) : internalCall(() => f(eb.success, cause));
}));
/** @internal */
const catch_$1 = /* @__PURE__ */ dual(2, (self, f) => catchCauseFilter$1(self, findError$2, (e) => f(e)));
/** @internal */
const mapError$2 = /* @__PURE__ */ dual(2, (self, f) => catch_$1(self, (error) => failSync$1(() => f(error))));
/** @internal */
const eventually$1 = (self) => catch_$1(self, (_) => flatMap$1(yieldNow$1, () => eventually$1(self)));
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
const ScopeTypeId = "~effect/Scope";
/** @internal */
const ScopeCloseableTypeId = "~effect/Scope/Closeable";
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
const scopeAddFinalizerUnsafe = (scope, key, finalizer) => {
	if (scope.state._tag === "Empty") scope.state = {
		_tag: "Open",
		finalizers: new Map([[key, finalizer]])
	};
	else if (scope.state._tag === "Open") scope.state.finalizers.set(key, finalizer);
};
/** @internal */
const scopeMakeUnsafe = (finalizerStrategy = "sequential") => ({
	[ScopeCloseableTypeId]: ScopeCloseableTypeId,
	[ScopeTypeId]: ScopeTypeId,
	strategy: finalizerStrategy,
	state: constScopeEmpty
});
const constScopeEmpty = { _tag: "Empty" };
const setInterruptibleTrue = /* @__PURE__ */ (/* @__PURE__ */ makePrimitive({
	op: "SetInterruptible",
	[contAll](fiber) {
		fiber.interruptible = this[args];
		if (fiber._interruptedCause && fiber.interruptible) return () => failCause$2(fiber._interruptedCause);
	}
}))(true);
const findFirstLoop = (iterator, index, predicate, value) => flatMap$1(predicate(value, index), (keep) => {
	if (keep) return succeed$2(some(value));
	const next = iterator.next();
	if (!next.done) return findFirstLoop(iterator, index + 1, predicate, next.value);
	return succeed$2(none());
});
const findFirstFilterLoop = (iterator, index, filter, value) => flatMap$1(filter(value, index), (result) => {
	if (isSuccess$3(result)) return succeed$2(some(result.success));
	const next = iterator.next();
	if (!next.done) return findFirstFilterLoop(iterator, index + 1, filter, next.value);
	return succeed$2(none());
});
/** @internal */
const forkUnsafe$1 = (parent, effect, immediate = false, daemon = false, uninterruptible = false) => {
	const interruptible = uninterruptible === "inherit" ? parent.interruptible : !uninterruptible;
	const child = new FiberImpl(parent.context, interruptible);
	if (immediate) child.evaluate(effect);
	else parent.currentDispatcher.scheduleTask(() => child.evaluate(effect), 0);
	if (!daemon && !child._exit) {
		parent.children().add(child);
		child.addObserver(() => parent._children.delete(child));
	}
	return child;
};
/** @internal */
const runForkWith$1 = (context) => (effect, options) => {
	const fiber = new FiberImpl(options?.scheduler ? add$2(context, Scheduler, options.scheduler) : context, options?.uninterruptible !== true);
	fiber.evaluate(effect);
	if (fiber._exit) return fiber;
	if (options?.signal) if (options.signal.aborted) fiber.interruptUnsafe();
	else {
		const abort = () => fiber.interruptUnsafe();
		options.signal.addEventListener("abort", abort, { once: true });
		fiber.addObserver(() => options.signal.removeEventListener("abort", abort));
	}
	if (options?.onFiberStart) options.onFiberStart(fiber);
	return fiber;
};
/** @internal */
const runSyncExitWith$1 = (context) => {
	const runFork = runForkWith$1(context);
	return (effect) => {
		if (effectIsExit(effect)) return effect;
		const fiber = runFork(effect, { scheduler: new MixedScheduler("sync") });
		fiber.currentDispatcher?.flush();
		return fiber._exit ?? exitDie(new AsyncFiberError$1(fiber));
	};
};
/** @internal */
const runSyncExit$1 = /* @__PURE__ */ runSyncExitWith$1(/* @__PURE__ */ empty$1());
/** @internal */
const runSyncWith$1 = (context) => {
	const runSyncExit = runSyncExitWith$1(context);
	return (effect) => {
		const exit = runSyncExit(effect);
		if (exit._tag === "Failure") throw causeSquash(exit.cause);
		return exit.value;
	};
};
/** @internal */
const runSync$1 = /* @__PURE__ */ runSyncWith$1(/* @__PURE__ */ empty$1());
const filterDisablePropagation = (span) => {
	if (!span) return none();
	return get(span.annotations, DisablePropagation) ? span._tag === "Span" ? filterDisablePropagation(getOrUndefined(span.parent)) : none() : some(span);
};
TaggedError$1("TimeoutError");
/** @internal */
const IllegalArgumentErrorTypeId$1 = "~effect/Cause/IllegalArgumentError";
(class extends TaggedError$1("IllegalArgumentError") {
	[IllegalArgumentErrorTypeId$1] = IllegalArgumentErrorTypeId$1;
	constructor(message) {
		super({ message });
	}
});
TaggedError$1("ExceededCapacityError");
/** @internal */
const AsyncFiberErrorTypeId$1 = "~effect/Cause/AsyncFiberError";
/** @internal */
var AsyncFiberError$1 = class extends TaggedError$1("AsyncFiberError") {
	[AsyncFiberErrorTypeId$1] = AsyncFiberErrorTypeId$1;
	constructor(fiber) {
		super({
			message: "An asynchronous Effect was executed with Effect.runSync",
			fiber
		});
	}
};
TaggedError$1("UnknownError");
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
Service()("effect/Cause/StackTrace");
Service()("effect/Cause/InterruptorStackTrace");
/**
* Creates a tagged error class with a `_tag` discriminator.
*
* Like {@link Error}, but instances also carry a `readonly _tag` property,
* enabling `Effect.catchTag` and `Effect.catchTags` for tag-based recovery.
* The `_tag` is excluded from the constructor argument.
*
* - Use for domain errors in Effect applications where you want
*   discriminated-union error handling.
* - Yielding an instance inside `Effect.gen` fails the effect with this error.
*
* **Example** (tag-based error recovery)
*
* ```ts
* import { Data, Effect } from "effect"
*
* class NotFound extends Data.TaggedError("NotFound")<{
*   readonly resource: string
* }> {}
*
* class Forbidden extends Data.TaggedError("Forbidden")<{
*   readonly reason: string
* }> {}
*
* const program = Effect.gen(function*() {
*   return yield* new NotFound({ resource: "/users/42" })
* })
*
* const recovered = program.pipe(
*   Effect.catchTag("NotFound", (e) =>
*     Effect.succeed(`missing: ${e.resource}`))
* )
* ```
*
* @see {@link Error} — without a `_tag`
* @see {@link TaggedClass} — tagged class that is not an error
*
* @category constructors
* @since 2.0.0
*/
const TaggedError = TaggedError$1;
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/Deferred.js
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
Service()("effect/Layer/CurrentMemoMap");
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/dateTime.js
/** @internal */
const TypeId$7 = "~effect/time/DateTime";
/** @internal */
const TimeZoneTypeId = "~effect/time/DateTime/TimeZone";
const Proto = {
	[TypeId$7]: TypeId$7,
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
({ ...Proto });
({ ...Proto });
const ProtoTimeZone = {
	[TimeZoneTypeId]: TimeZoneTypeId,
	[NodeInspectSymbol]() {
		return this.toString();
	}
};
({
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
});
({ ...ProtoTimeZone });
/** @internal */
const isDateTime$1 = (u) => hasProperty(u, TypeId$7);
/** @internal */
const isTimeZone$1 = (u) => hasProperty(u, TimeZoneTypeId);
/** @internal */
const toDateUtc$1 = (self) => new Date(self.epochMilliseconds);
/** @internal */
const toDate$1 = (self) => {
	if (self._tag === "Utc") return new Date(self.epochMilliseconds);
	else if (self.zone._tag === "Offset") return new Date(self.epochMilliseconds + self.zone.offset);
	else if (self.adjustedEpochMilliseconds !== void 0) return new Date(self.adjustedEpochMilliseconds);
	const parts = self.zone.format.formatToParts(self.epochMilliseconds).filter((_) => _.type !== "literal");
	const date = /* @__PURE__ */ new Date(0);
	date.setUTCFullYear(Number(parts[2].value), Number(parts[0].value) - 1, Number(parts[1].value));
	date.setUTCHours(Number(parts[3].value), Number(parts[4].value), Number(parts[5].value), Number(parts[6].value));
	self.adjustedEpochMilliseconds = date.getTime();
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
const toEpochMillis$1 = (self) => self.epochMilliseconds;
/** @internal */
const formatIsoOffset$1 = (self) => {
	const date = toDate$1(self);
	return self._tag === "Utc" ? date.toISOString() : `${date.toISOString().slice(0, -1)}${zonedOffsetIso$1(self)}`;
};
/** @internal */
const formatIsoZoned$1 = (self) => self.zone._tag === "Offset" ? formatIsoOffset$1(self) : `${formatIsoOffset$1(self)}[${self.zone.id}]`;
({ ...StructuralProto });
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
* import { Data, Effect } from "effect"
*
* class OperationFailedError extends Data.TaggedError("OperationFailedError")<{}> {}
*
* //      ┌─── Effect<never, OperationFailedError, never>
* //      ▼
* const failure = Effect.fail(
*   new OperationFailedError()
* )
* ```
*
* @since 2.0.0
* @category Creating Effects
*/
const fail = fail$3;
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
Service()("effect/Effect/Transaction");
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
Service()("effect/DateTime/CurrentTimeZone");
TaggedError("EncodingError");
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/schema/annotations.js
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
const getExpected = /* @__PURE__ */ memoize((ast) => {
	const identifier = resolveIdentifier$1(ast);
	if (typeof identifier === "string") return identifier;
	return ast.getExpected(getExpected);
});
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/record.js
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
globalThis.RegExp;
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
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/SchemaIssue.js
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
		case "UnexpectedKey": return `Unexpected key with value ${format$3(issue.actual)}`;
		case "Forbidden": return "Forbidden operation";
		case "OneOf": return `Expected exactly one member to match the input ${format$3(issue.actual)}`;
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
					message: getExpectedMessage(formatCheck(issue.filter), format$3(issue.actual))
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
					message: getExpectedMessage(getExpected(issue.ast), format$3(issue.actual))
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
	return format$3(actual.value);
}
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/SchemaGetter.js
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
* - Encode/decode URI components → {@link encodeUriComponent}, {@link decodeUriComponent}
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/SchemaTransformation.js
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
* - Coerce string ↔ Date → {@link dateFromString}
* - Decode durations → {@link durationFromNanos}, {@link durationFromMillis}
* - Wrap nullable/optional as Option → {@link optionFromNullOr}, {@link optionFromOptionalKey}, {@link optionFromOptional}
* - Parse URLs → {@link urlFromString}
* - Base64 ↔ Uint8Array → {@link uint8ArrayFromBase64String}
* - Base64 ↔ string → {@link stringFromBase64String}
* - URI component ↔ string → {@link stringFromUriComponent}
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
//#endregion
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/SchemaAST.js
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
* Narrows an {@link AST} to {@link UniqueSymbol}.
*
* @category Guard
* @since 4.0.0
*/
const isUniqueSymbol = /* @__PURE__ */ makeGuard("UniqueSymbol");
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
		const expected = this.annotations?.expected;
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
		if (typeof literal === "number" && !globalThis.Number.isFinite(literal)) throw new Error(`A numeric literal must be finite, got ${format$3(literal)}`);
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
				const exit$6 = effectIsExit(eff) ? eff : yield* exit(eff);
				if (exit$6._tag === "Failure") {
					const issueElement = findError$1(exit$6.cause);
					if (isFailure$3(issueElement)) return yield* exit$6;
					const issue = new Pointer([i], issueElement.success);
					if (errorsAllOption) if (issues) issues.push(issue);
					else issues = [issue];
					else return yield* fail(new Composite(ast, oinput, [issue]));
				} else if (exit$6.value._tag === "Some") output[i] = exit$6.value.value;
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
					const exit$3 = effectIsExit(eff) ? eff : yield* exit(eff);
					if (exit$3._tag === "Failure") {
						const issueRest = findError$1(exit$3.cause);
						if (isFailure$3(issueRest)) return yield* exit$3;
						const issue = new Pointer([i], issueRest.success);
						if (errorsAllOption) if (issues) issues.push(issue);
						else issues = [issue];
						else return yield* fail(new Composite(ast, oinput, [issue]));
					} else if (exit$3.value._tag === "Some") output[i] = exit$3.value.value;
					else {
						const issue = new Pointer([i], new MissingKey(keyAnnotations));
						if (errorsAllOption) if (issues) issues.push(issue);
						else issues = [issue];
						else return yield* fail(new Composite(ast, oinput, [issue]));
					}
				}
				for (let j = 0; j < tail.length; j++) {
					const index = i + j;
					if (len < index) continue;
					else {
						const tailj = tail[j];
						const keyAnnotations = tailj.ast.context?.annotations;
						const eff = tailj.parser(some(input[index]), options);
						const exit$5 = effectIsExit(eff) ? eff : yield* exit(eff);
						if (exit$5._tag === "Failure") {
							const issueRest = findError$1(exit$5.cause);
							if (isFailure$3(issueRest)) return yield* exit$5;
							const issue = new Pointer([index], issueRest.success);
							if (errorsAllOption) if (issues) issues.push(issue);
							else issues = [issue];
							else return yield* fail(new Composite(ast, oinput, [issue]));
						} else if (exit$5.value._tag === "Some") output[index] = exit$5.value.value;
						else {
							const issue = new Pointer([index], new MissingKey(keyAnnotations));
							if (errorsAllOption) if (issues) issues.push(issue);
							else issues = [issue];
							else return yield* fail(new Composite(ast, oinput, [issue]));
						}
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
				const exit$4 = effectIsExit(eff) ? eff : yield* exit(eff);
				if (exit$4._tag === "Failure") {
					const issueProp = findError$1(exit$4.cause);
					if (isFailure$3(issueProp)) return yield* exit$4;
					const issue = new Pointer([p.name], issueProp.success);
					if (errorsAllOption) {
						if (issues) issues.push(issue);
						else issues = [issue];
						continue;
					} else return yield* fail(new Composite(ast, oinput, [issue]));
				} else if (exit$4.value._tag === "Some") set(out, p.name, exit$4.value.value);
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
		default: return [];
		case "Declaration": {
			const s = ast.annotations?.["~sentinels"];
			return Array.isArray(s) ? s : [];
		}
		case "Objects": return ast.propertySignatures.flatMap((ps) => {
			const type = ps.type;
			if (!isOptional(type)) {
				if (isLiteral(type)) return [{
					key: ps.name,
					literal: type.literal
				}];
				if (isUniqueSymbol(type)) return [{
					key: ps.name,
					literal: type.symbol
				}];
			}
			return [];
		});
		case "Arrays": return ast.elements.flatMap((e, i) => {
			return isLiteral(e) && !isOptional(e) ? [{
				key: i,
				literal: e.literal
			}] : [];
		});
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
		if (sentinels.length > 0) {
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
				const exit$2 = effectIsExit(eff) ? eff : yield* exit(eff);
				if (exit$2._tag === "Failure") {
					const issueResult = findError$1(exit$2.cause);
					if (isFailure$3(issueResult)) return yield* exit$2;
					if (issues) issues.push(issueResult.success);
					else issues = [issueResult.success];
					continue;
				} else {
					if (tracking.out && oneOf) {
						tracking.successes.push(candidate);
						return yield* fail(new OneOf(ast, input, tracking.successes));
					}
					tracking.out = exit$2.value;
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
`${BIGINT_PATTERN}`;
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
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/SchemaParser.js
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
		return parser(input, options?.disableChecks ? options?.parseOptions ? {
			...options.parseOptions,
			disableChecks: true
		} : { disableChecks: true } : options?.parseOptions);
	};
}
/**
* @category Constructing
* @since 4.0.0
*/
function makeOption(schema) {
	const parser = makeEffect(schema);
	return (input, options) => {
		return getSuccess(runSyncExit(parser(input, options)));
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
function decodeUnknownSync$1(schema) {
	return asSync(decodeUnknownEffect(schema));
}
/** @internal */
function run(ast) {
	const parser = recur(ast);
	return (input, options) => flatMapEager(parser(some(input), options ?? defaultParseOptions), (oa) => {
		if (oa._tag === "None") return fail(new InvalidValue(oa));
		return succeed(oa.value);
	});
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
		if (ast.checks && !options?.disableChecks) {
			const checks = ast.checks;
			if (options?.errors === "all" && isStructural && isSome(ou)) sroa = catchEager(sroa, (issue) => {
				const issues = [];
				collectIssues(checks.filter((check) => check.annotations?.[STRUCTURAL_ANNOTATION_KEY]), ou.value, issues, ast, options);
				return fail(isArrayNonEmpty(issues) ? issue._tag === "Composite" && issue.ast === ast ? new Composite(ast, issue.actual, [...issue.issues, ...issues]) : new Composite(ast, ou, [issue, ...issues]) : issue);
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
//#region ../node_modules/.pnpm/effect@4.0.0-beta.49/node_modules/effect/dist/internal/schema/schema.js
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
	self.makeEffect = flow(makeEffect(self), mapErrorEager((issue) => new SchemaError(issue)));
	self.make = makeUnsafe(self);
	self.makeOption = makeOption(self);
	return self;
}
/** @internal */
const SchemaErrorTypeId = "~effect/Schema/SchemaError";
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
* Creates a schema for a **parametric** type (a generic container such as
* `Array<A>`, `Option<A>`, etc.) by accepting a list of type-parameter schemas
* and a decoder factory.
*
* The outer call `declareConstructor<T, E, Iso>()` fixes the decoded type `T`,
* the encoded type `E`, and the optional iso type. The inner call receives:
* - `typeParameters` — the concrete schemas for each type variable
* - `run` — a factory that, given resolved codecs for each type parameter,
*   returns a parsing function `(u, ast, options) => Effect<T, Issue>`
* - `annotations` — optional metadata
*
* @see {@link declare} for creating schemas for non-parametric types.
*
* **Example** (Schema for a parametric `Box<A>` type)
*
* ```ts
* import { Effect, Schema } from "effect"
* import * as SchemaParser from "effect/SchemaParser"
* import * as Issue from "effect/SchemaIssue"
* import * as Option from "effect/Option"
*
* interface Box<A> {
*   readonly value: A
* }
*
* const isBox = (u: unknown): u is Box<unknown> =>
*   typeof u === "object" && u !== null && "value" in u
*
* const Box = <A extends Schema.Top>(item: A) =>
*   Schema.declareConstructor<Box<A["Type"]>, Box<A["Encoded"]>>()(
*     [item],
*     ([itemCodec]) =>
*       (u, ast, options) => {
*         if (!isBox(u)) {
*           return Effect.fail(new Issue.InvalidType(ast, Option.some(u)))
*         }
*         return Effect.map(
*           SchemaParser.decodeUnknownEffect(itemCodec)(u.value, options),
*           (value) => ({ value })
*         )
*       }
*   )
*
* const schema = Box(Schema.Number)
* ```
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
* Creates a schema for a **non-parametric** opaque type using a type-guard
* function. The schema accepts any unknown value and succeeds when `is` returns
* `true`, failing with an `InvalidType` issue otherwise.
*
* Use this when the type has no type parameters. For parametric types such as
* `Option<A>` or `Array<A>`, use {@link declareConstructor} instead.
*
* **Example** (Schema for a custom `UserId` branded type)
*
* ```ts
* import { Schema } from "effect"
*
* type UserId = string & { readonly _tag: "UserId" }
*
* const isUserId = (u: unknown): u is UserId =>
*   typeof u === "string" && u.startsWith("user_")
*
* const UserId = Schema.declare<UserId>(isUserId, {
*   title: "UserId",
*   description: "A user identifier starting with 'user_'"
* })
* ```
*
* @see {@link declareConstructor} for creating schemas for parametric types.
*
* @category Constructors
* @since 4.0.0
*/
function declare(is, annotations) {
	return declareConstructor()([], () => (input, ast) => is(input) ? succeed(input) : fail(new InvalidType(ast, some(input))), annotations);
}
/**
* Decodes an `unknown` input against a schema synchronously, throwing a
* {@link SchemaError} on failure. Use this when you want to validate data at a
* boundary and treat a schema mismatch as an unrecoverable error. For
* non-throwing alternatives see {@link decodeUnknownOption},
* {@link decodeUnknownExit}, or {@link decodeUnknownEffect}. For typed input
* use {@link decodeSync}.
*
* **Example** (Decoding with a transformation schema)
*
* ```ts
* import { Schema } from "effect"
*
* const NumberFromString = Schema.NumberFromString
*
* console.log(Schema.decodeUnknownSync(NumberFromString)("42"))
* // Output: 42
*
* Schema.decodeUnknownSync(NumberFromString)("not a number")
* // throws SchemaError: NumberFromString
* //   └─ Encoded side transformation failure
* //      └─ NumberFromString
* //         └─ Expected a numeric string, actual "not a number"
* ```
*
* @category Decoding
* @since 4.0.0
*/
const decodeUnknownSync = decodeUnknownSync$1;
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
* Creates a schema for a single literal value (string, number, bigint, boolean, or null).
*
* **Example** (String literal)
* ```ts
* import { Schema } from "effect"
*
* const schema = Schema.Literal("hello")
* // Type: Schema.Literal<"hello">
* ```
*
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
* Schema for the `null` literal. Validates that the input is strictly `null`.
*
* @see {@link NullOr} for a union with another schema.
* @since 4.0.0
*/
const Null = /* @__PURE__ */ make(null_);
/**
* Schema for `string` values. Validates that the input is `typeof` `"string"`.
*
* @since 4.0.0
*/
const String$1 = /* @__PURE__ */ make(string);
/**
* Schema for `number` values, including `NaN`, `Infinity`, and `-Infinity`.
*
* **Default Json Serializer**
*
* - Finite numbers are serialized as numbers.
* - Non-finite values are serialized as strings (`"NaN"`, `"Infinity"`, `"-Infinity"`).
*
* @see {@link Finite} for a schema that excludes non-finite values.
* @since 4.0.0
*/
const Number$1 = /* @__PURE__ */ make(number);
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
* Defines a struct schema from a map of field schemas.
*
* Each field value is a schema. Use {@link optionalKey} or {@link optional} to
* mark fields as optional, and {@link mutableKey} to mark them as mutable.
*
* The resulting schema's `Type` is a readonly object type with the fields'
* decoded types. The `Encoded` form mirrors the field schemas' encoded types.
*
* **Example** (Basic struct)
*
* ```ts
* import { Schema } from "effect"
*
* const Person = Schema.Struct({
*   name: Schema.String,
*   age: Schema.Number,
*   email: Schema.optionalKey(Schema.String)
* })
*
* // { readonly name: string; readonly age: number; readonly email?: string }
* type Person = typeof Person.Type
*
* const alice = Schema.decodeUnknownSync(Person)({ name: "Alice", age: 30 })
* console.log(alice)
* // { name: 'Alice', age: 30 }
* ```
*
* @category Constructors
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
const ArraySchema = /* @__PURE__ */ lambda((schema) => make(new Arrays(false, [], [schema.ast]), { schema }));
/**
* Makes an array or tuple schema mutable, removing the `readonly` modifier.
*
* **Example** (Mutable array)
*
* ```ts
* import { Schema } from "effect"
*
* const schema = Schema.mutable(Schema.Array(Schema.Number))
*
* // number[]   (mutable)
* type T = typeof schema.Type
* ```
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
* Creates a union schema from an array of member schemas. Members are tested in
* order; the first match is returned.
*
* Optionally, specify `mode`:
* - `"anyOf"` (default) — matches if any member matches.
* - `"oneOf"` — matches if exactly one member matches.
*
* **Example** (String or number union)
*
* ```ts
* import { Schema } from "effect"
*
* const schema = Schema.Union([Schema.String, Schema.Number])
*
* Schema.decodeUnknownSync(schema)("hello") // "hello"
* Schema.decodeUnknownSync(schema)(42)       // 42
* ```
*
* @category Constructors
* @since 4.0.0
*/
function Union(members, options) {
	return makeUnion(union(members, options?.mode ?? "anyOf", void 0), members);
}
/**
* Creates a union schema from an array of literal values.
*
* **Example** (Status codes)
* ```ts
* import { Schema } from "effect"
*
* const schema = Schema.Literals(["active", "inactive", "pending"])
* // accepts "active", "inactive", or "pending"
* ```
*
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
* Creates a union schema of `S | null`.
*
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
* Creates a schema that validates values using `instanceof`.
* Decoding and encoding pass the value through unchanged.
*
* **Example** (Schema for a built-in class)
*
* ```ts
* import { Schema } from "effect"
*
* const DateSchema = Schema.instanceOf(Date)
*
* const decoded = Schema.decodeUnknownSync(DateSchema)(new Date("2024-01-01"))
* // decoded: Date
* ```
*
* @category Constructors
* @since 4.0.0
*/
function instanceOf(constructor, annotations) {
	return declare((u) => u instanceof constructor, annotations);
}
/**
* Creates a custom filter check from a predicate function. The predicate
* receives the input value, the schema's AST, and parse options, and returns
* `true`/`undefined` on success or a failure description on error.
*
* **Example** (Custom filter check)
* ```ts
* import { Schema } from "effect"
*
* // Check that a number is even
* const isEven = Schema.makeFilter(
*   (n: number) => n % 2 === 0 || "expected an even number"
* )
*
* const EvenNumber = Schema.Number.check(isEven)
* ```
*
* @category Checks Constructors
* @since 4.0.0
*/
const makeFilter = makeFilter$1;
/**
* Generic factory for creating a ">=" check for any ordered type by supplying
* an {@link Order.Order} instance.
*
* @category Order checks
* @since 4.0.0
*/
function makeIsGreaterThanOrEqualTo(options) {
	const gte = isGreaterThanOrEqualTo$3(options.order);
	const formatter = options.formatter ?? format$3;
	return (minimum, annotations) => {
		return makeFilter((input) => gte(input, minimum), {
			expected: `a value greater than or equal to ${formatter(minimum)}`,
			...options.annotate?.(minimum),
			...annotations
		});
	};
}
/**
* Generic factory for creating a "<=" check for any ordered type by supplying
* an {@link Order.Order} instance.
*
* @category Order checks
* @since 4.0.0
*/
function makeIsLessThanOrEqualTo(options) {
	const lte = isLessThanOrEqualTo$3(options.order);
	const formatter = options.formatter ?? format$3;
	return (maximum, annotations) => {
		return makeFilter((input) => lte(input, maximum), {
			expected: `a value less than or equal to ${formatter(maximum)}`,
			...options.annotate?.(maximum),
			...annotations
		});
	};
}
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
* **Example** (Minimum length check)
* ```ts
* import { Schema } from "effect"
*
* const NonEmptyStringSchema = Schema.String.check(Schema.isMinLength(1))
* const NonEmptyArraySchema = Schema.Array(Schema.Number).check(Schema.isMinLength(1))
* ```
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
globalThis.Error;
globalThis.Error;
globalThis.RegExp;
globalThis.URL;
globalThis.File;
globalThis.FormData;
globalThis.URLSearchParams;
globalThis.Uint8Array;
//#endregion
//#region ../schemas/libraries/effect/@beta/download.ts
const Image = Struct({
	id: Number$1,
	created: instanceOf(Date),
	title: String$1.check(isMinLength(1), isMaxLength(100)),
	type: Literals(["jpg", "png"]),
	size: Number$1,
	url: String$1.check(makeFilter((value) => URL.canParse(value)))
});
const Rating = Struct({
	id: Number$1,
	stars: Number$1.check(isGreaterThanOrEqualTo(0), isLessThanOrEqualTo(5)),
	title: String$1.check(isMinLength(1), isMaxLength(100)),
	text: String$1.check(isMinLength(1), isMaxLength(1e3)),
	images: mutable(ArraySchema(Image))
});
decodeUnknownSync(Struct({
	id: Number$1,
	created: instanceOf(Date),
	title: String$1.check(isMinLength(1), isMaxLength(100)),
	brand: String$1.check(isMinLength(1), isMaxLength(30)),
	description: String$1.check(isMinLength(1), isMaxLength(500)),
	price: Number$1.check(isGreaterThanOrEqualTo(1), isLessThanOrEqualTo(1e4)),
	discount: NullOr(Number$1.check(isGreaterThanOrEqualTo(1), isLessThanOrEqualTo(100))),
	quantity: Number$1.check(isGreaterThanOrEqualTo(1), isLessThanOrEqualTo(10)),
	tags: mutable(ArraySchema(String$1.check(isMinLength(1), isMaxLength(30)))),
	images: mutable(ArraySchema(Image)),
	ratings: mutable(ArraySchema(Rating))
}))({});
//#endregion
