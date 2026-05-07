//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/memory/metrics.mjs
/** TypeBox instantiation metrics */
const Metrics = {
	assign: 0,
	create: 0,
	clone: 0,
	discard: 0,
	update: 0
};
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/memory/assign.mjs
/**
* Performs an Object assign using the Left and Right object types. We track this operation as it
* creates a new GC handle per assignment.
*/
function Assign(left, right) {
	Metrics.assign += 1;
	return {
		...left,
		...right
	};
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/guard/string.mjs
function IsBetween(value, min, max) {
	return value >= min && value <= max;
}
function IsRegionalIndicator(value) {
	return IsBetween(value, 127462, 127487);
}
function IsVariationSelector(value) {
	return IsBetween(value, 65024, 65039);
}
function IsCombiningMark$1(value) {
	return IsBetween(value, 768, 879) || IsBetween(value, 6832, 6911) || IsBetween(value, 7616, 7679) || IsBetween(value, 65056, 65071);
}
function CodePointLength(value) {
	return value > 65535 ? 2 : 1;
}
function ConsumeModifiers(value, index) {
	while (index < value.length) {
		const point = value.codePointAt(index);
		if (IsCombiningMark$1(point) || IsVariationSelector(point)) index += CodePointLength(point);
		else break;
	}
	return index;
}
function NextGraphemeClusterIndex(value, clusterStart) {
	const startCP = value.codePointAt(clusterStart);
	let clusterEnd = clusterStart + CodePointLength(startCP);
	clusterEnd = ConsumeModifiers(value, clusterEnd);
	while (clusterEnd < value.length - 1 && value[clusterEnd] === "‍") {
		const nextCP = value.codePointAt(clusterEnd + 1);
		clusterEnd += 1 + CodePointLength(nextCP);
		clusterEnd = ConsumeModifiers(value, clusterEnd);
	}
	if (IsRegionalIndicator(startCP) && clusterEnd < value.length && IsRegionalIndicator(value.codePointAt(clusterEnd))) clusterEnd += CodePointLength(value.codePointAt(clusterEnd));
	return clusterEnd;
}
function IsGraphemeCodePoint(value) {
	return IsBetween(value, 55296, 56319) || IsBetween(value, 768, 879) || value === 8205;
}
/** Checks if a string has at least a minimum number of grapheme clusters */
function IsMinLength$2(value, minLength) {
	if (minLength === 0) return true;
	let count = 0;
	let index = 0;
	while (index < value.length) {
		index = NextGraphemeClusterIndex(value, index);
		count++;
		if (count >= minLength) return true;
	}
	return false;
}
/** Checks if a string has at most a maximum number of grapheme clusters */
function IsMaxLength$2(value, maxLength) {
	let count = 0;
	let index = 0;
	while (index < value.length) {
		index = NextGraphemeClusterIndex(value, index);
		count++;
		if (count > maxLength) return false;
	}
	return true;
}
/** Fast check for minimum grapheme length, falls back to full check if needed */
function IsMinLengthFast(value, minLength) {
	if (minLength === 0) return true;
	let index = 0;
	while (index < value.length) {
		if (IsGraphemeCodePoint(value.charCodeAt(index))) return IsMinLength$2(value, minLength);
		index++;
		if (index >= minLength) return true;
	}
	return false;
}
/** Fast check for maximum grapheme length, falls back to full check if needed */
function IsMaxLengthFast(value, maxLength) {
	let index = 0;
	while (index < value.length) {
		if (IsGraphemeCodePoint(value.charCodeAt(index))) return IsMaxLength$2(value, maxLength);
		index++;
		if (index > maxLength) return false;
	}
	return true;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/guard/guard.mjs
/** Returns true if this value is an array */
function IsArray$1(value) {
	return Array.isArray(value);
}
/** Returns true if this value is an async iterator */
function IsAsyncIterator$1(value) {
	return IsObject$1(value) && Symbol.asyncIterator in value;
}
/** Returns true if this value is bigint */
function IsBigInt$1(value) {
	return IsEqual(typeof value, "bigint");
}
/** Returns true if this value is a boolean */
function IsBoolean$2(value) {
	return IsEqual(typeof value, "boolean");
}
/** Returns true if this value is a constructor */
function IsConstructor$1(value) {
	if (IsUndefined$1(value) || !IsFunction$1(value)) return false;
	const result = Function.prototype.toString.call(value);
	if (/^class\s/.test(result)) return true;
	if (/\[native code\]/.test(result)) return true;
	return false;
}
/** Returns true if this value is a function */
function IsFunction$1(value) {
	return IsEqual(typeof value, "function");
}
/** Returns true if this value is integer */
function IsInteger$1(value) {
	return Number.isInteger(value);
}
/** Returns true if this value is an iterator */
function IsIterator$1(value) {
	return IsObject$1(value) && Symbol.iterator in value;
}
/** Returns true if this value is null */
function IsNull$1(value) {
	return IsEqual(value, null);
}
/** Returns true if this value is number */
function IsNumber$2(value) {
	return Number.isFinite(value);
}
/** Returns true if this value is an object but not an array */
function IsObjectNotArray(value) {
	return IsObject$1(value) && !IsArray$1(value);
}
/** Returns true if this value is an object */
function IsObject$1(value) {
	return IsEqual(typeof value, "object") && !IsNull$1(value);
}
/** Returns true if this value is string */
function IsString$2(value) {
	return IsEqual(typeof value, "string");
}
/** Returns true if this value is symbol */
function IsSymbol$1(value) {
	return IsEqual(typeof value, "symbol");
}
/** Returns true if this value is undefined */
function IsUndefined$1(value) {
	return IsEqual(value, void 0);
}
function IsEqual(left, right) {
	return left === right;
}
function IsGreaterThan(left, right) {
	return left > right;
}
function IsLessThan(left, right) {
	return left < right;
}
function IsLessEqualThan(left, right) {
	return left <= right;
}
function IsGreaterEqualThan(left, right) {
	return left >= right;
}
function IsMultipleOf$1(dividend, divisor) {
	if (IsBigInt$1(dividend) || IsBigInt$1(divisor)) return BigInt(dividend) % BigInt(divisor) === 0n;
	const tolerance = 1e-10;
	if (!IsNumber$2(dividend)) return true;
	if (IsInteger$1(dividend) && 1 / divisor % 1 === 0) return true;
	const mod = dividend % divisor;
	return Math.min(Math.abs(mod), Math.abs(mod - divisor)) < tolerance;
}
function IsValueLike(value) {
	return IsBigInt$1(value) || IsBoolean$2(value) || IsNull$1(value) || IsNumber$2(value) || IsString$2(value) || IsUndefined$1(value);
}
/** Returns true if the string has at most the given number of graphemes */
function IsMaxLength$1(value, length) {
	return IsMaxLengthFast(value, length);
}
/** Returns true if the string has at least the given number of graphemes */
function IsMinLength$1(value, length) {
	return IsMinLengthFast(value, length);
}
/** Returns true if all elements from offset satisfy the callback, short-circuiting on the first failure */
function Every(value, offset, callback) {
	for (let index = offset; index < value.length; index++) if (!callback(value[index], index)) return false;
	return true;
}
/** Returns true if all elements from offset satisfy the callback, visiting every element regardless of failure */
function EveryAll(value, offset, callback) {
	let result = true;
	for (let index = offset; index < value.length; index++) if (!callback(value[index], index)) result = false;
	return result;
}
/** Takes the left-most element from an array and dispatches to the true arm, or the false arm if empty */
function TakeLeft(array, true_, false_) {
	return IsEqual(array.length, 0) ? false_() : true_(array[0], array.slice(1));
}
/** Returns true if the PropertyKey is Unsafe (ref: prototype-pollution). */
function IsUnsafePropertyKey(key) {
	return IsEqual(key, "__proto__") || IsEqual(key, "constructor") || IsEqual(key, "prototype");
}
/** Returns true if this value has this property key */
function HasPropertyKey(value, key) {
	return IsUnsafePropertyKey(key) ? Object.prototype.hasOwnProperty.call(value, key) : key in value;
}
/** Returns object entries as `[string, Value][]` */
function Entries(value) {
	return Object.entries(value);
}
/** Returns property keys for this object via `Object.getOwnPropertyKeys({ ... })` */
function Keys(value) {
	return Object.getOwnPropertyNames(value);
}
/** Returns the property values for the given object via `Object.values()` */
function Values(value) {
	return Object.values(value);
}
function DeepEqualObject(left, right) {
	if (!IsObject$1(right)) return false;
	const keys = Keys(left);
	return IsEqual(keys.length, Keys(right).length) && keys.every((key) => IsDeepEqual(left[key], right[key]));
}
function DeepEqualArray(left, right) {
	return IsArray$1(right) && IsEqual(left.length, right.length) && left.every((_, index) => IsDeepEqual(left[index], right[index]));
}
/** Tests values for deep equality */
function IsDeepEqual(left, right) {
	return IsArray$1(left) ? DeepEqualArray(left, right) : IsObject$1(left) ? DeepEqualObject(left, right) : IsEqual(left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/guard/globals.mjs
function IsBoolean$1(value) {
	return value instanceof Boolean;
}
function IsNumber$1(value) {
	return value instanceof Number;
}
function IsString$1(value) {
	return value instanceof String;
}
function IsTypeArray(value) {
	return globalThis.ArrayBuffer.isView(value);
}
/** Returns true if the value is a RegExp */
function IsRegExp(value) {
	return value instanceof globalThis.RegExp;
}
/** Returns true if the value is a Date */
function IsDate$1(value) {
	return value instanceof globalThis.Date;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/memory/clone.mjs
function IsGuard$1(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~guard");
}
function FromGuard(value) {
	return value;
}
function FromArray$5(value) {
	return value.map((value) => FromValue$2(value));
}
function FromObject$8(value) {
	const result = {};
	const descriptors = Object.getOwnPropertyDescriptors(value);
	for (const key of Object.keys(descriptors)) {
		const descriptor = descriptors[key];
		if (HasPropertyKey(descriptor, "value")) Object.defineProperty(result, key, {
			...descriptor,
			value: FromValue$2(descriptor.value)
		});
	}
	return result;
}
function FromRegExp$1(value) {
	return new RegExp(value.source, value.flags);
}
function FromUnknown(value) {
	return value;
}
function FromValue$2(value) {
	return value instanceof RegExp ? FromRegExp$1(value) : IsGuard$1(value) ? FromGuard(value) : IsArray$1(value) ? FromArray$5(value) : IsObject$1(value) ? FromObject$8(value) : FromUnknown(value);
}
/**
* Clones a value using the TypeBox type cloning strategy. This function preserves non-enumerable
* properties from the source value. This is to ensure cloned types retain discriminable
* hidden properties.
*/
function Clone(value) {
	Metrics.clone += 1;
	return FromValue$2(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/settings/settings.mjs
const settings = {
	immutableTypes: false,
	maxErrors: 8,
	useAcceleration: true,
	exactOptionalPropertyTypes: false,
	enumerableKind: false,
	correctiveParse: false
};
/** Gets current system settings */
function Get$2() {
	return settings;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/memory/create.mjs
function MergeHidden(left, right) {
	for (const key of Object.keys(right)) Object.defineProperty(left, key, {
		configurable: true,
		writable: true,
		enumerable: false,
		value: right[key]
	});
	return left;
}
function Merge(left, right) {
	return {
		...left,
		...right
	};
}
/**
* Creates an object with hidden, enumerable, and optional property sets. This function
* ensures types are instantiated according to configuration rules for enumerable and
* non-enumerable properties.
*/
function Create(hidden, enumerable, options = {}) {
	Metrics.create += 1;
	const settings = Get$2();
	const withOptions = Merge(enumerable, options);
	const withHidden = settings.enumerableKind ? Merge(withOptions, hidden) : MergeHidden(withOptions, hidden);
	return settings.immutableTypes ? Object.freeze(withHidden) : withHidden;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/memory/discard.mjs
/** Discards multiple property keys from the given object value */
function Discard(value, propertyKeys) {
	Metrics.discard += 1;
	const result = {};
	const descriptors = Object.getOwnPropertyDescriptors(Clone(value));
	const keysToDiscard = new Set(propertyKeys);
	for (const key of Object.keys(descriptors)) {
		if (keysToDiscard.has(key)) continue;
		Object.defineProperty(result, key, descriptors[key]);
	}
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/memory/update.mjs
/**
* Updates a value with new properties while preserving property enumerability. Use this function to modify
* existing types without altering their configuration.
*/
function Update(current, hidden, enumerable) {
	Metrics.update += 1;
	const settings = Get$2();
	const result = Clone(current);
	for (const key of Object.keys(hidden)) Object.defineProperty(result, key, {
		configurable: true,
		writable: true,
		enumerable: settings.enumerableKind,
		value: hidden[key]
	});
	for (const key of Object.keys(enumerable)) Object.defineProperty(result, key, {
		configurable: true,
		enumerable: true,
		writable: true,
		value: enumerable[key]
	});
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/schema.mjs
function IsKind(value, kind) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && IsEqual(value["~kind"], kind);
}
function IsSchema$1(value) {
	return IsObject$1(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/_optional.mjs
/** Creates an OptionalAddAction. */
function OptionalAddAction(type) {
	return Create({ ["~kind"]: "OptionalAddAction" }, { type }, {});
}
/** Returns true if this value is a OptionalAddAction. */
function IsOptionalAddAction(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && HasPropertyKey(value, "type") && IsEqual(value["~kind"], "OptionalAddAction") && IsSchema$1(value.type);
}
/** Creates a OptionalRemoveAction. */
function OptionalRemoveAction(type) {
	return Create({ ["~kind"]: "OptionalRemoveAction" }, { type }, {});
}
/** Returns true if this value is a OptionalRemoveAction. */
function IsOptionalRemoveAction(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && HasPropertyKey(value, "type") && IsEqual(value["~kind"], "OptionalRemoveAction") && IsSchema$1(value.type);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/_readonly.mjs
/** Creates a ReadonlyAddAction. */
function ReadonlyAddAction(type) {
	return Create({ ["~kind"]: "ReadonlyAddAction" }, { type }, {});
}
/** Returns true if this value is a ReadonlyAddAction. */
function IsReadonlyAddAction(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && HasPropertyKey(value, "type") && IsEqual(value["~kind"], "ReadonlyAddAction") && IsSchema$1(value.type);
}
/** Creates a ReadonlyRemoveAction. */
function ReadonlyRemoveAction(type) {
	return Create({ ["~kind"]: "ReadonlyRemoveAction" }, { type }, {});
}
/** Returns true if this value is a ReadonlyRemoveAction. */
function IsReadonlyRemoveAction(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && HasPropertyKey(value, "type") && IsEqual(value["~kind"], "ReadonlyRemoveAction") && IsSchema$1(value.type);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/deferred.mjs
/** Creates a Deferred action. */
function Deferred(action, parameters, options) {
	return Create({ "~kind": "Deferred" }, {
		action,
		parameters,
		options
	}, {});
}
/** Returns true if the given value is a TDeferred. */
function IsDeferred(value) {
	return IsKind(value, "Deferred");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/promise.mjs
/**
* Creates a Promise type.
*
* @deprecated This type is being removed in the next version of TypeBox. A fallback will be provided under examples.
*/
function _Promise_(item, options) {
	return Create({ ["~kind"]: "Promise" }, {
		type: "promise",
		item
	}, options);
}
/** Returns true if the given type is TPromise. */
function IsPromise(value) {
	return IsKind(value, "Promise");
}
/** Extracts options from a TPromise. */
function PromiseOptions(type) {
	return Discard(type, [
		"~kind",
		"type",
		"item"
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/_immutable.mjs
/** Adds Immutable to the given type. */
function ImmutableAdd(type) {
	return Update(type, { "~immutable": true }, {});
}
/** Applies an Immutable modifier to the given type. */
function Immutable(type) {
	return ImmutableAdd(type);
}
/** Returns true if the given value is a TImmutable */
function IsImmutable(value) {
	return IsSchema$1(value) && HasPropertyKey(value, "~immutable");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/_optional.mjs
/** Removes Optional from the given type. */
function OptionalRemove(type) {
	return Discard(type, ["~optional"]);
}
/** Adds Optional to the given type. */
function OptionalAdd(type) {
	return Update(type, { "~optional": true }, {});
}
/** Applies an Optional modifier to the given type. */
function Optional$2(type) {
	return OptionalAdd(type);
}
/** Returns true if the given value is TOptional */
function IsOptional(value) {
	return IsSchema$1(value) && HasPropertyKey(value, "~optional");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/_readonly.mjs
/** Removes a Readonly property modifier from the given type. */
function ReadonlyRemove(type) {
	return Discard(type, ["~readonly"]);
}
/** Adds a Readonly property modifier to the given type. */
function ReadonlyAdd(type) {
	return Update(type, { "~readonly": true }, {});
}
/** Applies an Readonly property modifier to the given type. */
function Readonly$1(type) {
	return ReadonlyAdd(type);
}
/** Returns true if the given value is a TReadonly */
function IsReadonly(value) {
	return IsSchema$1(value) && HasPropertyKey(value, "~readonly");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/base.mjs
/** Returns true if the given value is a Base type. */
function IsBase(value) {
	return IsKind(value, "Base");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/array.mjs
/** Creates an Array type. */
function _Array_(items, options) {
	return Create({ "~kind": "Array" }, {
		type: "array",
		items
	}, options);
}
/** Returns true if the given value is a TArray. */
function IsArray(value) {
	return IsKind(value, "Array");
}
/** Extracts options from a TArray. */
function ArrayOptions(type) {
	return Discard(type, [
		"~kind",
		"type",
		"items"
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/async_iterator.mjs
/**
* Creates a AsyncIterator type.
*
* @deprecated This type is being removed in the next version of TypeBox. A fallback will be provided under examples.
*/
function AsyncIterator(iteratorItems, options) {
	return Create({ "~kind": "AsyncIterator" }, {
		type: "asyncIterator",
		iteratorItems
	}, options);
}
/** Returns true if the given value is a TAsyncIterator */
function IsAsyncIterator(value) {
	return IsKind(value, "AsyncIterator");
}
/** Extracts options from a TAsyncIterator. */
function AsyncIteratorOptions(type) {
	return Discard(type, [
		"~kind",
		"type",
		"iteratorItems"
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/constructor.mjs
/** Creates a Constructor type. */
function Constructor$1(parameters, instanceType, options = {}) {
	return Create({ "~kind": "Constructor" }, {
		type: "constructor",
		parameters,
		instanceType
	}, options);
}
/** Returns true if the given value is a TConstructor. */
function IsConstructor(value) {
	return IsKind(value, "Constructor");
}
/** Extracts options from a TConstructor. */
function ConstructorOptions(type) {
	return Discard(type, [
		"~kind",
		"type",
		"parameters",
		"instanceType"
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/function.mjs
/** Creates a Function type. */
function _Function_$1(parameters, returnType, options = {}) {
	return Create({ ["~kind"]: "Function" }, {
		type: "function",
		parameters,
		returnType
	}, options);
}
/** Returns true if the given value is TFunction. */
function IsFunction(value) {
	return IsKind(value, "Function");
}
/** Extracts options from a TFunction. */
function FunctionOptions(type) {
	return Discard(type, [
		"~kind",
		"type",
		"parameters",
		"returnType"
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/ref.mjs
/** Creates a Ref type. */
function Ref$1(ref, options) {
	return Create({ ["~kind"]: "Ref" }, { $ref: ref }, options);
}
/** Returns true if the given value is TRef. */
function IsRef$1(value) {
	return IsKind(value, "Ref");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/generic.mjs
/** Creates a Generic type. */
function Generic(parameters, expression) {
	return Create({ "~kind": "Generic" }, {
		type: "generic",
		parameters,
		expression
	});
}
/** Returns true if the given value is a TGeneric. */
function IsGeneric(value) {
	return IsKind(value, "Generic");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/any.mjs
/** Creates a Any type. */
function Any(options) {
	return Create({ ["~kind"]: "Any" }, {}, options);
}
/** Returns true if the given value is a TAny. */
function IsAny(value) {
	return IsKind(value, "Any");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/never.mjs
const NeverPattern = "(?!)";
/** Creates a Never type. */
function Never(options) {
	return Create({ "~kind": "Never" }, { not: {} }, options);
}
/** Returns true if the given value is TNever. */
function IsNever(value) {
	return IsKind(value, "Never");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/properties.mjs
/** Creates a RequiredArray derived from the given TProperties value. */
function RequiredArray(properties) {
	return Keys(properties).filter((key) => !IsOptional(properties[key]));
}
/** Extracts a tuple of keys from a TProperties value. */
function PropertyKeys(properties) {
	return Keys(properties);
}
/** Extracts a tuple of property values from a TProperties value. */
function PropertyValues(properties) {
	return Values(properties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/object.mjs
/** Creates an Object type. */
function _Object_$1(properties, options = {}) {
	const requiredKeys = RequiredArray(properties);
	return Create({ "~kind": "Object" }, {
		type: "object",
		...requiredKeys.length > 0 ? { required: requiredKeys } : {},
		properties
	}, options);
}
/** Returns true if the given value is TObject. */
function IsObject(value) {
	return IsKind(value, "Object");
}
/** Extracts options from a TObject. */
function ObjectOptions(type) {
	return Discard(type, [
		"~kind",
		"type",
		"properties",
		"required"
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/union.mjs
/** Creates a Union type. */
function Union(anyOf, options = {}) {
	return Create({ "~kind": "Union" }, { anyOf }, options);
}
/** Returns true if the given value is TUnion. */
function IsUnion(value) {
	return IsKind(value, "Union");
}
/** Extracts options from a TUnion. */
function UnionOptions(type) {
	return Discard(type, ["~kind", "anyOf"]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/unknown.mjs
/** Creates an Unknown type. */
function Unknown(options) {
	return Create({ ["~kind"]: "Unknown" }, {}, options);
}
/** Returns true if the given value is TUnknown. */
function IsUnknown(value) {
	return IsKind(value, "Unknown");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/cyclic.mjs
/** Creates a Cyclic type. */
function Cyclic($defs, $ref, options) {
	const defs = Keys($defs).reduce((result, key) => {
		return {
			...result,
			[key]: Update($defs[key], {}, { $id: key })
		};
	}, {});
	return Create({ ["~kind"]: "Cyclic" }, {
		$defs: defs,
		$ref
	}, options);
}
/** Returns true if the given value is a TCyclic. */
function IsCyclic(value) {
	return IsKind(value, "Cyclic");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/unsafe.mjs
/** Creates a Unsafe type. */
function Unsafe(schema) {
	return Update(schema, { ["~unsafe"]: null }, {});
}
/** Returns true if the given value is TUnsafe. */
function IsUnsafe(value) {
	return IsObjectNotArray(value) && HasPropertyKey(value, "~unsafe") && IsNull$1(value["~unsafe"]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/arguments/arguments.mjs
/**
* Match arguments for overloaded functions that use the `...args: unknown[]` pattern. Arguments
* are parsed using argument length only.
*/
function Match$3(args, match) {
	return match[args.length]?.(...args) ?? (() => {
		throw Error("Invalid Arguments");
	})();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/infer.mjs
/** Creates an Infer instruction. */
function Infer(...args) {
	const [name, extends_] = Match$3(args, {
		2: (name, extends_) => [
			name,
			extends_,
			extends_
		],
		1: (name) => [
			name,
			Unknown(),
			Unknown()
		]
	});
	return Create({ ["~kind"]: "Infer" }, {
		type: "infer",
		name,
		extends: extends_
	}, {});
}
/** Returns true if the given value is TInfer. */
function IsInfer(value) {
	return IsKind(value, "Infer");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/enum.mjs
/** Returns true if the given value is a TEnum. */
function IsEnum$1(value) {
	return IsKind(value, "Enum");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/intersect.mjs
/** Creates a Intersect type. */
function Intersect(types, options = {}) {
	return Create({ "~kind": "Intersect" }, { allOf: types }, options);
}
/** Returns true if the given value is TIntersect. */
function IsIntersect(value) {
	return IsKind(value, "Intersect");
}
/** Extracts options from a TIntersect. */
function IntersectOptions(type) {
	return Discard(type, ["~kind", "allOf"]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/unreachable/unreachable.mjs
/** Used for unreachable logic */
function Unreachable$1() {
	throw new Error("Unreachable");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/hashing/hash.mjs
function InstanceKeys(value) {
	const propertyKeys = /* @__PURE__ */ new Set();
	let current = value;
	while (current && current !== Object.prototype) {
		for (const key of Reflect.ownKeys(current)) if (key !== "constructor" && typeof key !== "symbol") propertyKeys.add(key);
		current = Object.getPrototypeOf(current);
	}
	return [...propertyKeys];
}
function IsIEEE754(value) {
	return typeof value === "number";
}
var ByteMarker;
(function(ByteMarker) {
	ByteMarker[ByteMarker["Array"] = 0] = "Array";
	ByteMarker[ByteMarker["BigInt"] = 1] = "BigInt";
	ByteMarker[ByteMarker["Boolean"] = 2] = "Boolean";
	ByteMarker[ByteMarker["Date"] = 3] = "Date";
	ByteMarker[ByteMarker["Constructor"] = 4] = "Constructor";
	ByteMarker[ByteMarker["Function"] = 5] = "Function";
	ByteMarker[ByteMarker["Null"] = 6] = "Null";
	ByteMarker[ByteMarker["Number"] = 7] = "Number";
	ByteMarker[ByteMarker["Object"] = 8] = "Object";
	ByteMarker[ByteMarker["RegExp"] = 9] = "RegExp";
	ByteMarker[ByteMarker["String"] = 10] = "String";
	ByteMarker[ByteMarker["Symbol"] = 11] = "Symbol";
	ByteMarker[ByteMarker["TypeArray"] = 12] = "TypeArray";
	ByteMarker[ByteMarker["Undefined"] = 13] = "Undefined";
})(ByteMarker || (ByteMarker = {}));
let Accumulator = BigInt("14695981039346656037");
const [Prime, Size] = [BigInt("1099511628211"), BigInt("18446744073709551616")];
const Bytes = Array.from({ length: 256 }).map((_, i) => BigInt(i));
const F64 = new Float64Array(1);
const F64In = new DataView(F64.buffer);
const F64Out = new Uint8Array(F64.buffer);
function FNV1A64_OP(byte) {
	Accumulator = Accumulator ^ Bytes[byte];
	Accumulator = Accumulator * Prime % Size;
}
function FromArray$4(value) {
	FNV1A64_OP(ByteMarker.Array);
	for (const item of value) FromValue$1(item);
}
function FromBigInt(value) {
	FNV1A64_OP(ByteMarker.BigInt);
	F64In.setBigInt64(0, value);
	for (const byte of F64Out) FNV1A64_OP(byte);
}
function FromBoolean(value) {
	FNV1A64_OP(ByteMarker.Boolean);
	FNV1A64_OP(value ? 1 : 0);
}
function FromConstructor(value) {
	FNV1A64_OP(ByteMarker.Constructor);
	FromValue$1(value.toString());
}
function FromDate(value) {
	FNV1A64_OP(ByteMarker.Date);
	FromValue$1(value.getTime());
}
function FromFunction(value) {
	FNV1A64_OP(ByteMarker.Function);
	FromValue$1(value.toString());
}
function FromNull(_value) {
	FNV1A64_OP(ByteMarker.Null);
}
function FromNumber(value) {
	FNV1A64_OP(ByteMarker.Number);
	F64In.setFloat64(0, value, true);
	for (const byte of F64Out) FNV1A64_OP(byte);
}
function FromObject$7(value) {
	FNV1A64_OP(ByteMarker.Object);
	for (const key of InstanceKeys(value).sort()) {
		FromValue$1(key);
		FromValue$1(value[key]);
	}
}
function FromRegExp(value) {
	FNV1A64_OP(ByteMarker.RegExp);
	FromString(value.toString());
}
const encoder = new TextEncoder();
function FromString(value) {
	FNV1A64_OP(ByteMarker.String);
	for (const byte of encoder.encode(value)) FNV1A64_OP(byte);
}
function FromSymbol(value) {
	FNV1A64_OP(ByteMarker.Symbol);
	FromValue$1(value.toString());
}
function FromTypeArray(value) {
	FNV1A64_OP(ByteMarker.TypeArray);
	const buffer = new Uint8Array(value.buffer);
	for (let i = 0; i < buffer.length; i++) FNV1A64_OP(buffer[i]);
}
function FromUndefined(_value) {
	return FNV1A64_OP(ByteMarker.Undefined);
}
function FromValue$1(value) {
	return IsTypeArray(value) ? FromTypeArray(value) : IsDate$1(value) ? FromDate(value) : IsRegExp(value) ? FromRegExp(value) : IsBoolean$1(value) ? FromBoolean(value.valueOf()) : IsString$1(value) ? FromString(value.valueOf()) : IsNumber$1(value) ? FromNumber(value.valueOf()) : IsIEEE754(value) ? FromNumber(value) : IsArray$1(value) ? FromArray$4(value) : IsBoolean$2(value) ? FromBoolean(value) : IsBigInt$1(value) ? FromBigInt(value) : IsConstructor$1(value) ? FromConstructor(value) : IsNull$1(value) ? FromNull(value) : IsObject$1(value) ? FromObject$7(value) : IsString$2(value) ? FromString(value) : IsSymbol$1(value) ? FromSymbol(value) : IsUndefined$1(value) ? FromUndefined(value) : IsFunction$1(value) ? FromFunction(value) : Unreachable$1();
}
/** Generates a FNV1A-64 non cryptographic hash of the given value */
function HashCode(value) {
	Accumulator = BigInt("14695981039346656037");
	FromValue$1(value);
	return Accumulator;
}
/** Generates a FNV1A-64 non cryptographic hash of the given value */
function Hash(value) {
	return HashCode(value).toString(16).padStart(16, "0");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/locale/en_US.mjs
/** en_US: English (United States) - ISO 639-1 language code 'en' with ISO 3166-1 alpha-2 country code 'US' for United States. */
function en_US(error) {
	switch (error.keyword) {
		case "additionalProperties": return "must not have additional properties";
		case "anyOf": return "must match a schema in anyOf";
		case "boolean": return "schema is false";
		case "const": return "must be equal to constant";
		case "contains": return "must contain at least 1 valid item";
		case "dependencies": return `must have properties ${error.params.dependencies.join(", ")} when property ${error.params.property} is present`;
		case "dependentRequired": return `must have properties ${error.params.dependencies.join(", ")} when property ${error.params.property} is present`;
		case "enum": return "must be equal to one of the allowed values";
		case "exclusiveMaximum": return `must be ${error.params.comparison} ${error.params.limit}`;
		case "exclusiveMinimum": return `must be ${error.params.comparison} ${error.params.limit}`;
		case "format": return `must match format "${error.params.format}"`;
		case "if": return `must match "${error.params.failingKeyword}" schema`;
		case "maxItems": return `must not have more than ${error.params.limit} items`;
		case "maxLength": return `must not have more than ${error.params.limit} characters`;
		case "maxProperties": return `must not have more than ${error.params.limit} properties`;
		case "maximum": return `must be ${error.params.comparison} ${error.params.limit}`;
		case "minItems": return `must not have fewer than ${error.params.limit} items`;
		case "minLength": return `must not have fewer than ${error.params.limit} characters`;
		case "minProperties": return `must not have fewer than ${error.params.limit} properties`;
		case "minimum": return `must be ${error.params.comparison} ${error.params.limit}`;
		case "multipleOf": return `must be multiple of ${error.params.multipleOf}`;
		case "not": return "must not be valid";
		case "oneOf": return "must match exactly one schema in oneOf";
		case "pattern": return `must match pattern "${error.params.pattern}"`;
		case "propertyNames": return `property names ${error.params.propertyNames.join(", ")} are invalid`;
		case "required": return `must have required properties ${error.params.requiredProperties.join(", ")}`;
		case "type": return typeof error.params.type === "string" ? `must be ${error.params.type}` : `must be either ${error.params.type.join(" or ")}`;
		case "unevaluatedItems": return "must not have unevaluated items";
		case "unevaluatedProperties": return "must not have unevaluated properties";
		case "uniqueItems": return `must not have duplicate items`;
		case "~guard": return `must match check function`;
		case "~refine": return error.params.message;
		default: return "an unknown validation error occurred";
	}
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/system/locale/_config.mjs
let locale = en_US;
/** Gets the locale */
function Get$1() {
	return locale;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/_refine.mjs
/** Applies a Refine check to the given type. */
function RefineAdd(type, refinement) {
	return Update(type, { "~refine": IsRefine$1(type) ? [...type["~refine"], refinement] : [refinement] }, {});
}
/** Refines a type with an explicit check */
function Refine(...args) {
	const [type, check, error_or_message] = Match$3(args, {
		3: (type, check, error) => [
			type,
			check,
			error
		],
		2: (type, check) => [
			type,
			check,
			() => "Refine Error"
		]
	});
	return RefineAdd(type, {
		check,
		error: IsString$2(error_or_message) ? () => error_or_message : error_or_message
	});
}
/** Returns true if the given value is a TRefinement. */
function IsRefinement(value) {
	return IsObjectNotArray(value) && HasPropertyKey(value, "check") && HasPropertyKey(value, "error") && IsFunction$1(value.check) && IsFunction$1(value.error);
}
/** Returns true if the given value is a TRefine. */
function IsRefine$1(value) {
	return IsSchema$1(value) && HasPropertyKey(value, "~refine") && IsArray$1(value["~refine"]) && Every(value["~refine"], 0, (value) => IsRefinement(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/bigint.mjs
const BigIntPattern = "-?(?:0|[1-9][0-9]*)n";
/** Creates a BigInt type. */
function BigInt$2(options) {
	return Create({ "~kind": "BigInt" }, { type: "bigint" }, options);
}
/** Returns true if the given value is a TBigInt. */
function IsBigInt(value) {
	return IsKind(value, "BigInt");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/boolean.mjs
/** Creates a Boolean type. */
function Boolean$1(options) {
	return Create({ "~kind": "Boolean" }, { type: "boolean" }, options);
}
/** Returns true if the given value is a TBoolean. */
function IsBoolean(value) {
	return IsKind(value, "Boolean");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/identifier.mjs
/** Creates an Identifier. */
function Identifier(name) {
	return Create({ "~kind": "Identifier" }, { name });
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/integer.mjs
const IntegerPattern = "-?(?:0|[1-9][0-9]*)";
/** Creates a Integer type. */
function Integer$1(options) {
	return Create({ "~kind": "Integer" }, { type: "integer" }, options);
}
/** Returns true if the given value is TInteger. */
function IsInteger(value) {
	return IsKind(value, "Integer");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/iterator.mjs
/**
* Creates a Iterator type.
*
* @deprecated This type is being removed in the next version of TypeBox. A fallback will be provided under examples.
*/
function Iterator(iteratorItems, options) {
	return Create({ "~kind": "Iterator" }, {
		type: "iterator",
		iteratorItems
	}, options);
}
/** Returns true if the given value is TIterator. */
function IsIterator(value) {
	return IsKind(value, "Iterator");
}
/** Extracts options from a TIterator. */
function IteratorOptions(type) {
	return Discard(type, [
		"~kind",
		"type",
		"iteratorItems"
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/literal.mjs
var InvalidLiteralValue = class extends Error {
	constructor(value) {
		super(`Invalid Literal value`);
		Object.defineProperty(this, "cause", {
			value: { value },
			writable: false,
			configurable: false,
			enumerable: false
		});
	}
};
function LiteralTypeName(value) {
	return IsBigInt$1(value) ? "bigint" : IsBoolean$2(value) ? "boolean" : IsNumber$2(value) ? "number" : IsString$2(value) ? "string" : (() => {
		throw new InvalidLiteralValue(value);
	})();
}
/** Creates a Literal type. */
function Literal$1(value, options) {
	return Create({ "~kind": "Literal" }, {
		type: LiteralTypeName(value),
		const: value
	}, options);
}
/** Returns true if the given value is a TLiteralValue. */
function IsLiteralValue(value) {
	return IsBigInt$1(value) || IsBoolean$2(value) || IsNumber$2(value) || IsString$2(value);
}
/** Returns true if the given value is TLiteral<number>. */
function IsLiteralNumber(value) {
	return IsLiteral(value) && IsNumber$2(value.const);
}
/** Returns true if the given value is TLiteral<string>. */
function IsLiteralString(value) {
	return IsLiteral(value) && IsString$2(value.const);
}
/** Returns true if the given value is TLiteral. */
function IsLiteral(value) {
	return IsKind(value, "Literal");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/null.mjs
/** Creates a Null type. */
function Null(options) {
	return Create({ "~kind": "Null" }, { type: "null" }, options);
}
/** Returns true if the given value is TNull. */
function IsNull(value) {
	return IsKind(value, "Null");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/number.mjs
const NumberPattern = "-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?";
/** Creates a Number type. */
function Number$2(options) {
	return Create({ "~kind": "Number" }, { type: "number" }, options);
}
/** Returns true if the given value is a TNumber. */
function IsNumber(value) {
	return IsKind(value, "Number");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/symbol.mjs
/** Creates a Symbol type. */
function Symbol$1(options) {
	return Create({ "~kind": "Symbol" }, { type: "symbol" }, options);
}
/** Returns true if the given value is TSymbol. */
function IsSymbol(value) {
	return IsKind(value, "Symbol");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/parameter.mjs
/** Creates a Parameter type. */
function Parameter$1(...args) {
	const [name, extends_, equals] = Match$3(args, {
		3: (name, extends_, equals) => [
			name,
			extends_,
			equals
		],
		2: (name, extends_) => [
			name,
			extends_,
			extends_
		],
		1: (name) => [
			name,
			Unknown(),
			Unknown()
		]
	});
	return Create({ "~kind": "Parameter" }, {
		name,
		extends: extends_,
		equals
	}, {});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/string.mjs
/** Creates a String type. */
function String$2(options) {
	return Create({ "~kind": "String" }, { type: "string" }, options);
}
/** Returns true if the given value is TString. */
function IsString(value) {
	return IsKind(value, "String");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/patterns/pattern.mjs
/** Parses a Pattern into a sequence of TemplateLiteral types. A result of [] indicates failure to parse. */
function ParsePatternIntoTypes(pattern) {
	const parsed = Pattern(pattern);
	return IsEqual(parsed.length, 2) ? parsed[0] : [];
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/template_literal/is_finite.mjs
function FromLiteral$4(_value) {
	return true;
}
function FromTypesReduce(types) {
	return TakeLeft(types, (left, right) => FromType$17(left) ? FromTypesReduce(right) : false, () => true);
}
function FromTypes$4(types) {
	return IsEqual(types.length, 0) ? false : FromTypesReduce(types);
}
function FromType$17(type) {
	return IsUnion(type) ? FromTypes$4(type.anyOf) : IsLiteral(type) ? FromLiteral$4(type.const) : false;
}
/** Returns true if the given TemplateLiteral types yields a finite variant set */
function IsTemplateLiteralFinite(types) {
	return FromTypes$4(types);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/template_literal/create.mjs
function TemplateLiteralCreate(pattern) {
	return Create({ ["~kind"]: "TemplateLiteral" }, {
		type: "string",
		pattern
	}, {});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/template_literal/decode.mjs
function FromLiteralPush(variants, value, result = []) {
	return TakeLeft(variants, (left, right) => FromLiteralPush(right, value, [...result, `${left}${value}`]), () => result);
}
function FromLiteral$3(variants, value) {
	return IsEqual(variants.length, 0) ? [`${value}`] : FromLiteralPush(variants, value);
}
function FromUnion$7(variants, types, result = []) {
	return TakeLeft(types, (left, right) => FromUnion$7(variants, right, [...result, ...FromType$16(variants, left)]), () => result);
}
function FromType$16(variants, type) {
	return IsUnion(type) ? FromUnion$7(variants, type.anyOf) : IsLiteral(type) ? FromLiteral$3(variants, type.const) : Unreachable$1();
}
function DecodeFromSpan(variants, types) {
	return TakeLeft(types, (left, right) => DecodeFromSpan(FromType$16(variants, left), right), () => variants);
}
function VariantsToLiterals(variants) {
	return variants.map((variant) => Literal$1(variant));
}
function DecodeTypesAsUnion(types) {
	return Union(VariantsToLiterals(DecodeFromSpan([], types)));
}
function DecodeTypes(types) {
	return IsEqual(types.length, 0) ? Unreachable$1() : IsEqual(types.length, 1) && IsLiteral(types[0]) ? types[0] : DecodeTypesAsUnion(types);
}
/**
* (Internal) Decodes a TemplateLiteral pattern into a Type. This function is unsafe. Decoding a non-finite
* TemplateLiteral pattern may produce another TemplateLiteral pattern. During enumeration, this
* TemplateLiteral -> TemplateLiteral behavior can cause a StackOverflow. A better in-flight template-literal
* decoding algorithm is needed. (for review)
*/
function TemplateLiteralDecodeUnsafe(pattern) {
	const types = ParsePatternIntoTypes(pattern);
	return IsEqual(types.length, 0) ? String$2() : IsTemplateLiteralFinite(types) ? DecodeTypes(types) : TemplateLiteralCreate(pattern);
}
/** Decodes a TemplateLiteral pattern but returns TString if the pattern in non-finite. */
function TemplateLiteralDecode(pattern) {
	const decoded = TemplateLiteralDecodeUnsafe(pattern);
	return IsTemplateLiteral(decoded) ? String$2() : decoded;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/record_create.mjs
function CreateRecord(key, value) {
	const type = "object";
	const patternProperties = { [key]: value };
	return Create({ ["~kind"]: "Record" }, {
		type,
		patternProperties
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_any.mjs
function FromAnyKey(value) {
	return CreateRecord(StringKey, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_boolean.mjs
function FromBooleanKey(value) {
	return _Object_$1({
		true: value,
		false: value
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/enum/enum_to_union.mjs
function FromEnumValue(value) {
	return IsString$2(value) || IsNumber$2(value) ? Literal$1(value) : IsNull$1(value) ? Null() : Never();
}
function EnumValuesToVariants(values) {
	return values.map((value) => FromEnumValue(value));
}
function EnumValuesToUnion(values) {
	return Union(EnumValuesToVariants(values));
}
function EnumToUnion(type) {
	return EnumValuesToUnion(type.enum);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_enum.mjs
function FromEnumKey(values, value) {
	return FromKey(EnumValuesToUnion(values), value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_integer.mjs
function FromIntegerKey(_key, value) {
	return CreateRecord(IntegerKey, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/tuple.mjs
/** Creates a Tuple type. */
function Tuple$1(types, options = {}) {
	const [items, minItems, additionalItems] = [
		types,
		types.length,
		false
	];
	return Create({ ["~kind"]: "Tuple" }, {
		type: "array",
		additionalItems,
		items,
		minItems
	}, options);
}
/** Returns true if the given value is TTuple. */
function IsTuple(value) {
	return IsKind(value, "Tuple");
}
/** Extracts options from a TTuple. */
function TupleOptions(type) {
	return Discard(type, [
		"~kind",
		"type",
		"items",
		"minItems",
		"additionalItems"
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/tuple/to_object.mjs
function TupleElementsToProperties(types) {
	return types.reduceRight((result, right, index) => {
		return {
			[index]: right,
			...result
		};
	}, {});
}
function TupleToObject(type) {
	return _Object_$1(TupleElementsToProperties(type.items));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/evaluate/composite.mjs
function IsReadonlyProperty(left, right) {
	return IsReadonly(left) ? IsReadonly(right) ? true : false : false;
}
function IsOptionalProperty(left, right) {
	return IsOptional(left) ? IsOptional(right) ? true : false : false;
}
function CompositeProperty(left, right) {
	const isReadonly = IsReadonlyProperty(left, right);
	const isOptional = IsOptionalProperty(left, right);
	const property = ReadonlyRemove(OptionalRemove(EvaluateIntersect([left, right])));
	return isReadonly && isOptional ? ReadonlyAdd(OptionalAdd(property)) : isReadonly && !isOptional ? ReadonlyAdd(property) : !isReadonly && isOptional ? OptionalAdd(property) : property;
}
function CompositePropertyKey(left, right, key) {
	return key in left ? key in right ? CompositeProperty(left[key], right[key]) : left[key] : key in right ? right[key] : Never();
}
function CompositeProperties(left, right) {
	return [...new Set([...Keys(right), ...Keys(left)])].reduce((result, key) => {
		return {
			...result,
			[key]: CompositePropertyKey(left, right, key)
		};
	}, {});
}
function GetProperties(type) {
	return IsObject(type) ? type.properties : IsTuple(type) ? TupleElementsToProperties(type.items) : Unreachable$1();
}
function Composite(left, right) {
	return _Object_$1(CompositeProperties(GetProperties(left), GetProperties(right)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/evaluate/narrow.mjs
function Narrow(left, right) {
	const result = Compare(left, right);
	return IsEqual(result, "left-inside") ? left : IsEqual(result, "right-inside") ? right : IsEqual(result, "equal") ? right : Never();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/evaluate/distribute.mjs
function IsObjectLike(type) {
	return IsObject(type) || IsTuple(type);
}
function IsUnionOperand(left, right) {
	const isUnionLeft = IsUnion(left);
	const isUnionRight = IsUnion(right);
	return isUnionLeft || isUnionRight;
}
function DistributeOperation(left, right) {
	const evaluatedLeft = EvaluateType(left);
	const evaluatedRight = EvaluateType(right);
	const isUnionOperand = IsUnionOperand(evaluatedLeft, evaluatedRight);
	const isObjectLeft = IsObjectLike(evaluatedLeft);
	const IsObjectRight = IsObjectLike(evaluatedRight);
	return isUnionOperand ? EvaluateIntersect([evaluatedLeft, evaluatedRight]) : isObjectLeft && IsObjectRight ? Composite(evaluatedLeft, evaluatedRight) : isObjectLeft && !IsObjectRight ? evaluatedLeft : !isObjectLeft && IsObjectRight ? evaluatedRight : Narrow(evaluatedLeft, evaluatedRight);
}
function DistributeType(type, types, result = []) {
	return TakeLeft(types, (left, right) => DistributeType(type, right, [...result, DistributeOperation(type, left)]), () => IsEqual(result.length, 0) ? [type] : result);
}
function DistributeUnion(types, distribution, result = []) {
	return TakeLeft(types, (left, right) => DistributeUnion(right, distribution, [...result, ...Distribute$1([left], distribution)]), () => result);
}
function Distribute$1(types, result = []) {
	return TakeLeft(types, (left, right) => IsUnion(left) ? Distribute$1(right, DistributeUnion(left.anyOf, result)) : Distribute$1(right, DistributeType(left, result)), () => result);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/evaluate/evaluate.mjs
function EvaluateIntersect(types) {
	return Broaden(Distribute$1(types));
}
function EvaluateUnion(types) {
	return Broaden(types);
}
function EvaluateType(type) {
	return IsIntersect(type) ? EvaluateIntersect(type.allOf) : IsUnion(type) ? EvaluateUnion(type.anyOf) : type;
}
function EvaluateUnionFast(types) {
	return IsEqual(types.length, 1) ? types[0] : IsEqual(types.length, 0) ? Never() : Union(types);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_intersect.mjs
function FromIntersectKey(types, value) {
	return FromKey(EvaluateIntersect(types), value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_literal.mjs
function FromLiteralKey(key, value) {
	return IsString$2(key) || IsNumber$2(key) ? _Object_$1({ [key]: value }) : IsEqual(key, false) ? _Object_$1({ false: value }) : IsEqual(key, true) ? _Object_$1({ true: value }) : _Object_$1({});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_number.mjs
function FromNumberKey(_key, value) {
	return CreateRecord(NumberKey, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_string.mjs
function FromStringKey(key, value) {
	return HasPropertyKey(key, "pattern") && (IsString$2(key.pattern) || key.pattern instanceof RegExp) ? CreateRecord(key.pattern.toString(), value) : CreateRecord(StringKey, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_template_literal.mjs
function FromTemplateKey(pattern, value) {
	return IsTemplateLiteralFinite(ParsePatternIntoTypes(pattern)) ? FromKey(TemplateLiteralDecode(pattern), value) : CreateRecord(pattern, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/evaluate/flatten.mjs
function FlattenType(type) {
	return IsUnion(type) ? Flatten(type.anyOf) : [type];
}
function Flatten(types) {
	return types.reduce((result, type) => {
		return [...result, ...FlattenType(type)];
	}, []);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key_union.mjs
function StringOrNumberCheck(types) {
	return types.some((type) => IsString(type) || IsNumber(type) || IsInteger(type));
}
function TryBuildRecord(types, value) {
	return IsEqual(StringOrNumberCheck(types), true) ? CreateRecord(StringKey, value) : void 0;
}
function CreateProperties(types, value) {
	return types.reduce((result, left) => {
		return IsLiteral(left) && (IsString$2(left.const) || IsNumber$2(left.const)) ? {
			...result,
			[left.const]: value
		} : result;
	}, {});
}
function CreateObject(types, value) {
	return _Object_$1(CreateProperties(types, value));
}
function FromUnionKey(types, value) {
	const flattened = Flatten(types);
	const record = TryBuildRecord(flattened, value);
	return IsSchema$1(record) ? record : CreateObject(flattened, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/from_key.mjs
function FromKey(key, value) {
	return IsAny(key) ? FromAnyKey(value) : IsBoolean(key) ? FromBooleanKey(value) : IsEnum$1(key) ? FromEnumKey(key.enum, value) : IsInteger(key) ? FromIntegerKey(key, value) : IsIntersect(key) ? FromIntersectKey(key.allOf, value) : IsLiteral(key) ? FromLiteralKey(key.const, value) : IsNumber(key) ? FromNumberKey(key, value) : IsUnion(key) ? FromUnionKey(key.anyOf, value) : IsString(key) ? FromStringKey(key, value) : IsTemplateLiteral(key) ? FromTemplateKey(key.pattern, value) : _Object_$1({});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/record/instantiate.mjs
function RecordAction(key, value, options) {
	return CanInstantiate([key]) ? Update(FromKey(key, value), {}, options) : RecordDeferred(key, value, options);
}
function RecordInstantiate(context, state, key, value, options) {
	return RecordAction(InstantiateType(context, state, key), InstantiateType(context, state, value), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/record.mjs
const IntegerKey = `^${IntegerPattern}$`;
const NumberKey = `^${NumberPattern}$`;
const StringKey = `^.*$`;
/** Represents a deferred Record action. */
function RecordDeferred(key, value, options = {}) {
	return Deferred("Record", [key, value], options);
}
/** Creates a Record type. */
function Record(key, value, options = {}) {
	return RecordAction(key, value, options);
}
/** Creates a Record type from regular expression pattern. */
function RecordFromPattern(key, value) {
	return CreateRecord(key, value);
}
/** Returns the raw string pattern used for the Record key  */
function RecordPattern(type) {
	return Keys(type.patternProperties)[0];
}
/** Returns the Record key as a TypeBox type  */
function RecordKey(type) {
	const pattern = RecordPattern(type);
	return IsEqual(pattern, StringKey) ? String$2() : IsEqual(pattern, IntegerKey) ? Integer$1() : IsEqual(pattern, NumberKey) ? Number$2() : TemplateLiteralDecodeUnsafe(pattern);
}
function RecordValue(type) {
	return type.patternProperties[RecordPattern(type)];
}
function IsRecord(value) {
	return IsKind(value, "Record");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/rest.mjs
/** Creates a Rest instruction type. */
function Rest(type) {
	return Create({ "~kind": "Rest" }, {
		type: "rest",
		items: type
	}, {});
}
/** Returns true if the given value is TRest. */
function IsRest(value) {
	return IsKind(value, "Rest");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/this.mjs
/** Creates a This type. */
function This(options) {
	return Create({ ["~kind"]: "This" }, { $ref: "#" }, options);
}
/** Returns true if the given value is TThis. */
function IsThis(value) {
	return IsKind(value, "This");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/undefined.mjs
/** Creates a Undefined type. */
function Undefined(options) {
	return Create({ "~kind": "Undefined" }, { type: "undefined" }, options);
}
/** Returns true if the given value is TUndefined. */
function IsUndefined(value) {
	return IsKind(value, "Undefined");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/void.mjs
/** Creates a Void type. */
function Void(options) {
	return Create({ "~kind": "Void" }, { type: "void" }, options);
}
/** Returns true if the given value is TVoid. */
function IsVoid(value) {
	return IsKind(value, "Void");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/mapping.mjs
function IntrinsicOrCall(ref, parameters) {
	return IsEqual(ref, "Array") ? _Array_(parameters[0]) : IsEqual(ref, "AsyncIterator") ? AsyncIterator(parameters[0]) : IsEqual(ref, "Iterator") ? Iterator(parameters[0]) : IsEqual(ref, "Promise") ? _Promise_(parameters[0]) : IsEqual(ref, "Awaited") ? AwaitedDeferred(parameters[0]) : IsEqual(ref, "Capitalize") ? CapitalizeDeferred(parameters[0]) : IsEqual(ref, "ConstructorParameters") ? ConstructorParametersDeferred(parameters[0]) : IsEqual(ref, "Evaluate") ? EvaluateDeferred(parameters[0]) : IsEqual(ref, "Exclude") ? ExcludeDeferred(parameters[0], parameters[1]) : IsEqual(ref, "Extract") ? ExtractDeferred(parameters[0], parameters[1]) : IsEqual(ref, "Index") ? IndexDeferred(parameters[0], parameters[1]) : IsEqual(ref, "InstanceType") ? InstanceTypeDeferred(parameters[0]) : IsEqual(ref, "Lowercase") ? LowercaseDeferred(parameters[0]) : IsEqual(ref, "NonNullable") ? NonNullableDeferred(parameters[0]) : IsEqual(ref, "Omit") ? OmitDeferred(parameters[0], parameters[1]) : IsEqual(ref, "Options") ? OptionsDeferred(parameters[0], parameters[1]) : IsEqual(ref, "Parameters") ? ParametersDeferred(parameters[0]) : IsEqual(ref, "Partial") ? PartialDeferred(parameters[0]) : IsEqual(ref, "Pick") ? PickDeferred(parameters[0], parameters[1]) : IsEqual(ref, "Readonly") ? ReadonlyObjectDeferred(parameters[0]) : IsEqual(ref, "KeyOf") ? KeyOfDeferred(parameters[0]) : IsEqual(ref, "Record") ? RecordDeferred(parameters[0], parameters[1]) : IsEqual(ref, "Required") ? RequiredDeferred(parameters[0]) : IsEqual(ref, "ReturnType") ? ReturnTypeDeferred(parameters[0]) : IsEqual(ref, "Uncapitalize") ? UncapitalizeDeferred(parameters[0]) : IsEqual(ref, "Uppercase") ? UppercaseDeferred(parameters[0]) : CallConstruct(Ref$1(ref), parameters);
}
function Unreachable() {
	throw Error("Unreachable");
}
const DelimitedDecode = (input, result = []) => {
	return input.reduce((result, left) => {
		return IsArray$1(left) && IsEqual(left.length, 2) ? [...result, left[0]] : [...result, left];
	}, []);
};
const Delimited = (input) => {
	const [left, right] = input;
	return DelimitedDecode([...left, ...right]);
};
function GenericParameterExtendsEqualsMapping(input) {
	return Parameter$1(input[0], input[2], input[4]);
}
function GenericParameterExtendsMapping(input) {
	return Parameter$1(input[0], input[2], input[2]);
}
function GenericParameterEqualsMapping(input) {
	return Parameter$1(input[0], Unknown(), input[2]);
}
function GenericParameterIdentifierMapping(input) {
	return Parameter$1(input, Unknown(), Unknown());
}
function GenericParameterMapping(input) {
	return input;
}
function GenericParameterListMapping(input) {
	return Delimited(input);
}
function GenericParametersMapping(input) {
	return input[1];
}
function GenericCallArgumentListMapping(input) {
	return Delimited(input);
}
function GenericCallArgumentsMapping(input) {
	return input[1];
}
function GenericCallMapping(input) {
	return IntrinsicOrCall(input[0], input[1]);
}
function OptionalSemiColonMapping(input) {
	return null;
}
function KeywordStringMapping(input) {
	return String$2();
}
function KeywordNumberMapping(input) {
	return Number$2();
}
function KeywordBooleanMapping(input) {
	return Boolean$1();
}
function KeywordUndefinedMapping(input) {
	return Undefined();
}
function KeywordNullMapping(input) {
	return Null();
}
function KeywordIntegerMapping(input) {
	return Integer$1();
}
function KeywordBigIntMapping(input) {
	return BigInt$2();
}
function KeywordUnknownMapping(input) {
	return Unknown();
}
function KeywordAnyMapping(input) {
	return Any();
}
function KeywordObjectMapping(input) {
	return _Object_$1({});
}
function KeywordNeverMapping(input) {
	return Never();
}
function KeywordSymbolMapping(input) {
	return Symbol$1();
}
function KeywordVoidMapping(input) {
	return Void();
}
function KeywordThisMapping(input) {
	return This();
}
function KeywordMapping(input) {
	return input;
}
function TemplateInterpolateMapping(input) {
	return input[1];
}
function TemplateSpanMapping(input) {
	return Literal$1(input);
}
function TemplateBodyMapping(input) {
	return IsEqual(input.length, 3) ? [
		input[0],
		input[1],
		...input[2]
	] : [input[0]];
}
function TemplateLiteralTypesMapping(input) {
	return input[1];
}
function TemplateLiteralMapping(input) {
	return TemplateLiteralDeferred(input);
}
function LiteralBigIntMapping(input) {
	return Literal$1(BigInt(input));
}
function LiteralBooleanMapping(input) {
	return Literal$1(IsEqual(input, "true"));
}
function LiteralNumberMapping(input) {
	return Literal$1(parseFloat(input));
}
function LiteralStringMapping(input) {
	return Literal$1(input);
}
function LiteralMapping(input) {
	return input;
}
function KeyOfMapping(input) {
	return input.length > 0;
}
function IndexArrayMapping(input) {
	return input.reduce((result, current) => {
		return IsEqual(current.length, 3) ? [...result, [current[1]]] : [...result, []];
	}, []);
}
function ExtendsMapping(input) {
	return IsEqual(input.length, 6) ? [
		input[1],
		input[3],
		input[5]
	] : [];
}
function BaseMapping(input) {
	return IsArray$1(input) && IsEqual(input.length, 3) ? input[1] : input;
}
const FactorIndexArray = (Type, indexArray) => {
	return indexArray.reduce((result, left) => {
		const _left = left;
		return IsEqual(_left.length, 1) ? IndexDeferred(result, _left[0]) : IsEqual(_left.length, 0) ? _Array_(result) : Unreachable();
	}, Type);
};
const FactorExtends = (type, extend) => {
	return IsEqual(extend.length, 3) ? ConditionalDeferred(type, extend[0], extend[1], extend[2]) : type;
};
function FactorMapping(input) {
	const [keyOf, type, indexArray, extend] = input;
	return keyOf ? FactorExtends(KeyOfDeferred(FactorIndexArray(type, indexArray)), extend) : FactorExtends(FactorIndexArray(type, indexArray), extend);
}
function ExprBinaryMapping(left, rest) {
	return IsEqual(rest.length, 3) ? (() => {
		const [operator, right, next] = rest;
		const Schema = ExprBinaryMapping(right, next);
		if (IsEqual(operator, "&")) return IsIntersect(Schema) ? Intersect([left, ...Schema.allOf]) : Intersect([left, Schema]);
		if (IsEqual(operator, "|")) return IsUnion(Schema) ? Union([left, ...Schema.anyOf]) : Union([left, Schema]);
		Unreachable();
	})() : left;
}
function ExprTermTailMapping(input) {
	return input;
}
function ExprTermMapping(input) {
	const [left, rest] = input;
	return ExprBinaryMapping(left, rest);
}
function ExprTailMapping(input) {
	return input;
}
function ExprMapping(input) {
	const [left, rest] = input;
	return ExprBinaryMapping(left, rest);
}
function ExprReadonlyMapping(input) {
	return ImmutableAdd(input[1]);
}
function ExprPipeMapping(input) {
	return input[1];
}
function GenericTypeMapping(input) {
	return Generic(input[0], input[2]);
}
function InferTypeMapping(input) {
	return IsEqual(input.length, 4) ? Infer(input[1], input[3]) : IsEqual(input.length, 2) ? Infer(input[1], Unknown()) : Unreachable();
}
function TypeMapping(input) {
	return input;
}
function PropertyKeyNumberMapping(input) {
	return `${input}`;
}
function PropertyKeyIdentMapping(input) {
	return input;
}
function PropertyKeyQuotedMapping(input) {
	return input;
}
function PropertyKeyIndexMapping(input) {
	return IsInteger(input[3]) ? IntegerKey : IsNumber(input[3]) ? NumberKey : IsSymbol(input[3]) ? StringKey : IsString(input[3]) ? StringKey : Unreachable();
}
function PropertyKeyMapping(input) {
	return input;
}
function ReadonlyMapping(input) {
	return input.length > 0;
}
function OptionalMapping(input) {
	return input.length > 0;
}
function PropertyMapping(input) {
	const [isReadonly, key, isOptional, _colon, type] = input;
	return { [key]: isReadonly && isOptional ? ReadonlyAdd(OptionalAdd(type)) : isReadonly && !isOptional ? ReadonlyAdd(type) : !isReadonly && isOptional ? OptionalAdd(type) : type };
}
function PropertyDelimiterMapping(input) {
	return input;
}
function PropertyListMapping(input) {
	return Delimited(input);
}
function PropertiesReduce(propertyList) {
	return propertyList.reduce((result, left) => {
		return HasPropertyKey(left, IntegerKey) || HasPropertyKey(left, NumberKey) || HasPropertyKey(left, StringKey) ? [result[0], Assign(result[1], left)] : [Assign(result[0], left), result[1]];
	}, [{}, {}]);
}
function PropertiesMapping(input) {
	return PropertiesReduce(input[1]);
}
function _Object_Mapping(input) {
	const [properties, patternProperties] = input;
	return _Object_$1(properties, IsEqual(Keys(patternProperties).length, 0) ? {} : { patternProperties });
}
function ElementNamedMapping(input) {
	return IsEqual(input.length, 5) ? ReadonlyAdd(OptionalAdd(input[4])) : IsEqual(input.length, 3) ? input[2] : IsEqual(input.length, 4) ? IsEqual(input[2], "readonly") ? ReadonlyAdd(input[3]) : OptionalAdd(input[3]) : Unreachable();
}
function ElementReadonlyOptionalMapping(input) {
	return ReadonlyAdd(OptionalAdd(input[1]));
}
function ElementReadonlyMapping(input) {
	return ReadonlyAdd(input[1]);
}
function ElementOptionalMapping(input) {
	return OptionalAdd(input[0]);
}
function ElementBaseMapping(input) {
	return input;
}
function ElementMapping(input) {
	return IsEqual(input.length, 2) ? Rest(input[1]) : IsEqual(input.length, 1) ? input[0] : Unreachable();
}
function ElementListMapping(input) {
	return Delimited(input);
}
function TupleMapping(input) {
	return Tuple$1(input[1]);
}
function ParameterReadonlyOptionalMapping(input) {
	return ReadonlyAdd(OptionalAdd(input[4]));
}
function ParameterReadonlyMapping(input) {
	return ReadonlyAdd(input[3]);
}
function ParameterOptionalMapping(input) {
	return OptionalAdd(input[3]);
}
function ParameterTypeMapping(input) {
	return input[2];
}
function ParameterBaseMapping(input) {
	return input;
}
function ParameterMapping(input) {
	return IsEqual(input.length, 2) ? Rest(input[1]) : IsEqual(input.length, 1) ? input[0] : Unreachable();
}
function ParameterListMapping(input) {
	return Delimited(input);
}
function _Function_Mapping(input) {
	return _Function_$1(input[1], input[4]);
}
function ConstructorMapping(input) {
	return Constructor$1(input[2], input[5]);
}
function ApplyReadonly$1(state, type) {
	return IsEqual(state, "remove") ? ReadonlyRemoveAction(type) : IsEqual(state, "add") ? ReadonlyAddAction(type) : type;
}
function MappedReadonlyMapping(input) {
	return IsEqual(input.length, 2) && IsEqual(input[0], "-") ? "remove" : IsEqual(input.length, 2) && IsEqual(input[0], "+") ? "add" : IsEqual(input.length, 1) ? "add" : "none";
}
function ApplyOptional$1(state, type) {
	return IsEqual(state, "remove") ? OptionalRemoveAction(type) : IsEqual(state, "add") ? OptionalAddAction(type) : type;
}
function MappedOptionalMapping(input) {
	return IsEqual(input.length, 2) && IsEqual(input[0], "-") ? "remove" : IsEqual(input.length, 2) && IsEqual(input[0], "+") ? "add" : IsEqual(input.length, 1) ? "add" : "none";
}
function MappedAsMapping(input) {
	return IsEqual(input.length, 2) ? [input[1]] : [];
}
function MappedMapping(input) {
	return IsArray$1(input[6]) && IsEqual(input[6].length, 1) ? MappedDeferred(Identifier(input[3]), input[5], input[6][0], ApplyReadonly$1(input[1], ApplyOptional$1(input[8], input[10]))) : MappedDeferred(Identifier(input[3]), input[5], Ref$1(input[3]), ApplyReadonly$1(input[1], ApplyOptional$1(input[8], input[10])));
}
function ReferenceMapping(input) {
	return Ref$1(input);
}
function OptionsMapping(input) {
	return OptionsDeferred(input[2], input[4]);
}
function JsonNumberMapping(input) {
	return parseFloat(input);
}
function JsonBooleanMapping(input) {
	return IsEqual(input, "true");
}
function JsonStringMapping(input) {
	return input;
}
function JsonNullMapping(input) {
	return null;
}
function JsonPropertyMapping(input) {
	return { [input[0]]: input[2] };
}
function JsonPropertyListMapping(input) {
	return Delimited(input);
}
function JsonObjectMappingReduce(propertyList) {
	return propertyList.reduce((result, left) => {
		return Assign(result, left);
	}, {});
}
function JsonObjectMapping(input) {
	return JsonObjectMappingReduce(input[1]);
}
function JsonElementListMapping(input) {
	return Delimited(input);
}
function JsonArrayMapping(input) {
	return input[1];
}
function JsonMapping(input) {
	return input;
}
function PatternBigIntMapping(input) {
	return BigInt$2();
}
function PatternStringMapping(input) {
	return String$2();
}
function PatternNumberMapping(input) {
	return Number$2();
}
function PatternIntegerMapping(input) {
	return Integer$1();
}
function PatternNeverMapping(input) {
	return Never();
}
function PatternTextMapping(input) {
	return Literal$1(input);
}
function PatternBaseMapping(input) {
	return input;
}
function PatternGroupMapping(input) {
	return Union(input[1]);
}
function PatternUnionMapping(input) {
	return input.length === 3 ? [...input[0], ...input[2]] : input.length === 1 ? [...input[0]] : [];
}
function PatternTermMapping(input) {
	return [input[0], ...input[1]];
}
function PatternBodyMapping(input) {
	return input;
}
function PatternMapping(input) {
	return input[1];
}
function InterfaceDeclarationHeritageListMapping(input) {
	return Delimited(input);
}
function InterfaceDeclarationHeritageMapping(input) {
	return IsEqual(input.length, 2) ? input[1] : [];
}
function InterfaceDeclarationGenericMapping(input) {
	const parameters = input[2];
	const heritage = input[3];
	const [properties, patternProperties] = input[4];
	const options = IsEqual(Keys(patternProperties).length, 0) ? {} : { patternProperties };
	return { [input[1]]: Generic(parameters, InterfaceDeferred(heritage, properties, options)) };
}
function InterfaceDeclarationMapping(input) {
	const heritage = input[2];
	const [properties, patternProperties] = input[3];
	const options = IsEqual(Keys(patternProperties).length, 0) ? {} : { patternProperties };
	return { [input[1]]: InterfaceDeferred(heritage, properties, options) };
}
function TypeAliasDeclarationGenericMapping(input) {
	return { [input[1]]: Generic(input[2], input[4]) };
}
function TypeAliasDeclarationMapping(input) {
	return { [input[1]]: input[3] };
}
function ExportKeywordMapping(input) {
	return null;
}
function ModuleDeclarationDelimiterMapping(input) {
	return input;
}
function ModuleDeclarationListMapping(input) {
	return PropertiesReduce(Delimited(input));
}
function ModuleDeclarationMapping(input) {
	return input[1];
}
function ModuleMapping(input) {
	const moduleDeclaration = input[0];
	const moduleDeclarationList = input[1];
	return ModuleDeferred(Assign(moduleDeclaration, moduleDeclarationList[0]));
}
function ScriptMapping(input) {
	return input;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/internal/match.mjs
/** Checks the value is a Tuple-2 [string, string] result */
function IsMatch(value) {
	return IsEqual(value.length, 2);
}
/** Matches on a result and dispatches either left or right arm */
function Match$2(input, ok, fail) {
	return IsMatch(input) ? ok(input[0], input[1]) : fail();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/internal/take.mjs
function TakeVariant(variant, input) {
	return IsEqual(input.indexOf(variant), 0) ? [variant, input.slice(variant.length)] : [];
}
/** Takes one of the given variants or fail */
function Take(variants, input) {
	for (let i = 0; i < variants.length; i++) {
		const result = TakeVariant(variants[i], input);
		if (IsMatch(result)) return result;
	}
	return [];
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/internal/char.mjs
function Range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));
}
const Alpha = [...Range(97, 122), ...Range(65, 90)];
const NonZero = Range(49, 57);
const Digit = ["0", ...NonZero];
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/internal/trim.mjs
const LineComment = "//";
const OpenComment = "/*";
const CloseComment = "*/";
function DiscardMultilineComment(input) {
	const index = input.indexOf(CloseComment);
	return IsEqual(index, -1) ? "" : input.slice(index + 2);
}
function DiscardLineComment(input) {
	const index = input.indexOf("\n");
	return IsEqual(index, -1) ? "" : input.slice(index);
}
function TrimStartUntilNewline(input) {
	return input.replace(/^[ \t\r\f\v]+/, "");
}
function TrimWhitespace(input) {
	const trimmed = TrimStartUntilNewline(input);
	return trimmed.startsWith(OpenComment) ? TrimWhitespace(DiscardMultilineComment(trimmed.slice(2))) : trimmed.startsWith(LineComment) ? TrimWhitespace(DiscardLineComment(trimmed.slice(2))) : trimmed;
}
function Trim(input) {
	const trimmed = input.trimStart();
	return trimmed.startsWith(OpenComment) ? Trim(DiscardMultilineComment(trimmed.slice(2))) : trimmed.startsWith(LineComment) ? Trim(DiscardLineComment(trimmed.slice(2))) : trimmed;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/internal/optional.mjs
/** Matches the given Value or empty string if no match. This function never fails */
function Optional$1(value, input) {
	return Match$2(Take([value], input), (Optional, Rest) => [Optional, Rest], () => ["", input]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/internal/many.mjs
function IsDiscard(discard, input) {
	return discard.includes(input);
}
/** Takes characters from the Input until no-match. The Discard set is used to omit characters from the match */
function Many(allowed, discard, input, result = "") {
	return Match$2(Take(allowed, input), (Char, Rest) => IsDiscard(discard, Char) ? Many(allowed, discard, Rest, result) : Many(allowed, discard, Rest, `${result}${Char}`), () => [result, input]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/unsigned_integer.mjs
function TakeNonZero(input) {
	return Take(NonZero, input);
}
const AllowedDigits$1 = [...Digit, "_"];
function TakeDigits(input) {
	return Many(AllowedDigits$1, ["_"], input);
}
function TakeUnsignedInteger(input) {
	return Match$2(Take(["0"], input), (Zero, ZeroRest) => [Zero, ZeroRest], () => Match$2(TakeNonZero(input), (NonZero, NonZeroRest) => Match$2(TakeDigits(NonZeroRest), (Digits, DigitsRest) => [`${NonZero}${Digits}`, DigitsRest], () => []), () => []));
}
/** Matches if next is a UnsignedInteger */
function UnsignedInteger(input) {
	return TakeUnsignedInteger(Trim(input));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/integer.mjs
function TakeSign$1(input) {
	return Optional$1("-", input);
}
function TakeSignedInteger(input) {
	return Match$2(TakeSign$1(input), (Sign, SignRest) => Match$2(UnsignedInteger(SignRest), (UnsignedInteger, UnsignedIntegerRest) => [`${Sign}${UnsignedInteger}`, UnsignedIntegerRest], () => []), () => []);
}
/** Matches if next is a signed or unsigned Integer */
function Integer(input) {
	return TakeSignedInteger(Trim(input));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/bigint.mjs
function TakeBigInt(input) {
	return Match$2(Integer(input), (Integer, IntegerRest) => Match$2(Take(["n"], IntegerRest), (_N, NRest) => [`${Integer}`, NRest], () => []), () => []);
}
/** Matches if next is a Integer literal with trailing 'n'. Trailing 'n' is omitted in result. */
function BigInt$1(input) {
	return TakeBigInt(input);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/const.mjs
function TakeConst(const_, input) {
	return Take([const_], input);
}
/** Matches if next is the given Const value */
function Const(const_, input) {
	return IsEqual(const_, "") ? ["", input] : const_.startsWith("\n") ? TakeConst(const_, TrimWhitespace(input)) : const_.startsWith(" ") ? TakeConst(const_, input) : TakeConst(const_, Trim(input));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/ident.mjs
const Initial = [
	...Alpha,
	"_",
	"$"
];
function TakeInitial$1(input) {
	return Take(Initial, input);
}
const Remaining = [...Initial, ...Digit];
function TakeRemaining(input, result = "") {
	return Match$2(Take(Remaining, input), (Remaining, RemainingRest) => TakeRemaining(RemainingRest, `${result}${Remaining}`), () => [result, input]);
}
function TakeIdent(input) {
	return Match$2(TakeInitial$1(input), (Initial, InitialRest) => Match$2(TakeRemaining(InitialRest), (Remaining, RemainingRest) => [`${Initial}${Remaining}`, RemainingRest], () => []), () => []);
}
/** Matches if next is an Ident */
function Ident(input) {
	return TakeIdent(Trim(input));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/unsigned_number.mjs
const AllowedDigits = [...Digit, "_"];
function IsLeadingDot(input) {
	return IsMatch(Take(["."], input));
}
function TakeFractional(input) {
	return Match$2(Many(AllowedDigits, ["_"], input), (Digits, DigitsRest) => IsEqual(Digits, "") ? [] : [Digits, DigitsRest], () => []);
}
function LeadingDot(input) {
	return Match$2(Take(["."], input), (Dot, DotRest) => Match$2(TakeFractional(DotRest), (Fractional, FractionalRest) => [`0${Dot}${Fractional}`, FractionalRest], () => []), () => []);
}
function LeadingInteger(input) {
	return Match$2(UnsignedInteger(input), (Integer, IntegerRest) => Match$2(Take(["."], IntegerRest), (Dot, DotRest) => Match$2(TakeFractional(DotRest), (Fractional, FractionalRest) => [`${Integer}${Dot}${Fractional}`, FractionalRest], () => [`${Integer}`, DotRest]), () => [`${Integer}`, IntegerRest]), () => []);
}
function TakeUnsignedNumber(input) {
	return IsLeadingDot(input) ? LeadingDot(input) : LeadingInteger(input);
}
/** Matches if next is a UnsignedNumber */
function UnsignedNumber(input) {
	return TakeUnsignedNumber(Trim(input));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/number.mjs
function TakeSign(input) {
	return Optional$1("-", input);
}
function TakeSignedNumber(input) {
	return Match$2(TakeSign(input), (Sign, SignRest) => Match$2(UnsignedNumber(SignRest), (UnsignedInteger, UnsignedIntegerRest) => [`${Sign}${UnsignedInteger}`, UnsignedIntegerRest], () => []), () => []);
}
/** Matches if next is a signed or unsigned Number */
function Number$1(input) {
	return TakeSignedNumber(Trim(input));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/until.mjs
function TakeOne(input) {
	return IsEqual(input, "") ? [] : [input.slice(0, 1), input.slice(1)];
}
function IsInputMatchSentinal(end, input) {
	return TakeLeft(end, (left, right) => input.startsWith(left) ? true : IsInputMatchSentinal(right, input), () => false);
}
/** Match Input until but not including End. No match if End not found. */
function Until(end, input, result = "") {
	return Match$2(TakeOne(input), (One, Rest) => IsInputMatchSentinal(end, input) ? [result, input] : Until(end, Rest, `${result}${One}`), () => []);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/span.mjs
function MultiLine(start, end, input) {
	return Match$2(Take([start], input), (_, Rest) => Match$2(Until([end], Rest), (Until, UntilRest) => Match$2(Take([end], UntilRest), (_, Rest) => [`${Until}`, Rest], () => []), () => []), () => []);
}
function SingleLine(start, end, input) {
	return Match$2(Take([start], input), (_, Rest) => Match$2(Until(["\n", end], Rest), (Until, UntilRest) => Match$2(Take([end], UntilRest), (_, EndRest) => [`${Until}`, EndRest], () => []), () => []), () => []);
}
/** Matches from Start and End capturing everything in-between. Start and End are consumed. */
function Span(start, end, multiLine, input) {
	return multiLine ? MultiLine(start, end, Trim(input)) : SingleLine(start, end, Trim(input));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/string.mjs
function TakeInitial(quotes, input) {
	return Take(quotes, input);
}
function TakeSpan(quote, input) {
	return Span(quote, quote, false, input);
}
function TakeString(quotes, input) {
	return Match$2(TakeInitial(quotes, input), (Initial, InitialRest) => TakeSpan(Initial, `${Initial}${InitialRest}`), () => []);
}
/** Matches a literal String with the given quotes */
function String$1(quotes, input) {
	return TakeString(quotes, Trim(input));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/token/until_1.mjs
/** Match Input until but not including End. No match if End not found or match is zero-length. */
function Until_1(end, input) {
	return Match$2(Until(end, input), (Until, UntilRest) => IsEqual(Until, "") ? [] : [Until, UntilRest], () => []);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/parser.mjs
const If = (result, left, right = () => []) => result.length === 2 ? left(result) : right();
const GenericParameterExtendsEquals = (input) => If(If(Ident(input), ([_0, input]) => If(Const("extends", input), ([_1, input]) => If(Type(input), ([_2, input]) => If(Const("=", input), ([_3, input]) => If(Type(input), ([_4, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4
], input]))))), ([_0, input]) => [GenericParameterExtendsEqualsMapping(_0), input]);
const GenericParameterExtends = (input) => If(If(Ident(input), ([_0, input]) => If(Const("extends", input), ([_1, input]) => If(Type(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [GenericParameterExtendsMapping(_0), input]);
const GenericParameterEquals = (input) => If(If(Ident(input), ([_0, input]) => If(Const("=", input), ([_1, input]) => If(Type(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [GenericParameterEqualsMapping(_0), input]);
const GenericParameterIdentifier = (input) => If(Ident(input), ([_0, input]) => [GenericParameterIdentifierMapping(_0), input]);
const GenericParameter = (input) => If(If(GenericParameterExtendsEquals(input), ([_0, input]) => [_0, input], () => If(GenericParameterExtends(input), ([_0, input]) => [_0, input], () => If(GenericParameterEquals(input), ([_0, input]) => [_0, input], () => If(GenericParameterIdentifier(input), ([_0, input]) => [_0, input], () => [])))), ([_0, input]) => [GenericParameterMapping(_0), input]);
const GenericParameterList_0 = (input, result = []) => If(If(GenericParameter(input), ([_0, input]) => If(Const(",", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => GenericParameterList_0(input, [...result, _0]), () => [result, input]);
const GenericParameterList = (input) => If(If(GenericParameterList_0(input), ([_0, input]) => If(If(If(GenericParameter(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [GenericParameterListMapping(_0), input]);
const GenericParameters = (input) => If(If(Const("<", input), ([_0, input]) => If(GenericParameterList(input), ([_1, input]) => If(Const(">", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [GenericParametersMapping(_0), input]);
const GenericCallArgumentList_0 = (input, result = []) => If(If(Type(input), ([_0, input]) => If(Const(",", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => GenericCallArgumentList_0(input, [...result, _0]), () => [result, input]);
const GenericCallArgumentList = (input) => If(If(GenericCallArgumentList_0(input), ([_0, input]) => If(If(If(Type(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [GenericCallArgumentListMapping(_0), input]);
const GenericCallArguments = (input) => If(If(Const("<", input), ([_0, input]) => If(GenericCallArgumentList(input), ([_1, input]) => If(Const(">", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [GenericCallArgumentsMapping(_0), input]);
const GenericCall = (input) => If(If(Ident(input), ([_0, input]) => If(GenericCallArguments(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [GenericCallMapping(_0), input]);
const OptionalSemiColon = (input) => If(If(If(Const(";", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [OptionalSemiColonMapping(_0), input]);
const KeywordString = (input) => If(Const("string", input), ([_0, input]) => [KeywordStringMapping(_0), input]);
const KeywordNumber = (input) => If(Const("number", input), ([_0, input]) => [KeywordNumberMapping(_0), input]);
const KeywordBoolean = (input) => If(Const("boolean", input), ([_0, input]) => [KeywordBooleanMapping(_0), input]);
const KeywordUndefined = (input) => If(Const("undefined", input), ([_0, input]) => [KeywordUndefinedMapping(_0), input]);
const KeywordNull = (input) => If(Const("null", input), ([_0, input]) => [KeywordNullMapping(_0), input]);
const KeywordInteger = (input) => If(Const("integer", input), ([_0, input]) => [KeywordIntegerMapping(_0), input]);
const KeywordBigInt = (input) => If(Const("bigint", input), ([_0, input]) => [KeywordBigIntMapping(_0), input]);
const KeywordUnknown = (input) => If(Const("unknown", input), ([_0, input]) => [KeywordUnknownMapping(_0), input]);
const KeywordAny = (input) => If(Const("any", input), ([_0, input]) => [KeywordAnyMapping(_0), input]);
const KeywordObject = (input) => If(Const("object", input), ([_0, input]) => [KeywordObjectMapping(_0), input]);
const KeywordNever = (input) => If(Const("never", input), ([_0, input]) => [KeywordNeverMapping(_0), input]);
const KeywordSymbol = (input) => If(Const("symbol", input), ([_0, input]) => [KeywordSymbolMapping(_0), input]);
const KeywordVoid = (input) => If(Const("void", input), ([_0, input]) => [KeywordVoidMapping(_0), input]);
const KeywordThis = (input) => If(Const("this", input), ([_0, input]) => [KeywordThisMapping(_0), input]);
const Keyword = (input) => If(If(KeywordString(input), ([_0, input]) => [_0, input], () => If(KeywordNumber(input), ([_0, input]) => [_0, input], () => If(KeywordBoolean(input), ([_0, input]) => [_0, input], () => If(KeywordUndefined(input), ([_0, input]) => [_0, input], () => If(KeywordNull(input), ([_0, input]) => [_0, input], () => If(KeywordInteger(input), ([_0, input]) => [_0, input], () => If(KeywordBigInt(input), ([_0, input]) => [_0, input], () => If(KeywordUnknown(input), ([_0, input]) => [_0, input], () => If(KeywordAny(input), ([_0, input]) => [_0, input], () => If(KeywordObject(input), ([_0, input]) => [_0, input], () => If(KeywordNever(input), ([_0, input]) => [_0, input], () => If(KeywordSymbol(input), ([_0, input]) => [_0, input], () => If(KeywordVoid(input), ([_0, input]) => [_0, input], () => If(KeywordThis(input), ([_0, input]) => [_0, input], () => [])))))))))))))), ([_0, input]) => [KeywordMapping(_0), input]);
const TemplateInterpolate = (input) => If(If(Const("${", input), ([_0, input]) => If(Type(input), ([_1, input]) => If(Const("}", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [TemplateInterpolateMapping(_0), input]);
const TemplateSpan = (input) => If(Until(["${", "`"], input), ([_0, input]) => [TemplateSpanMapping(_0), input]);
const TemplateBody = (input) => If(If(If(TemplateSpan(input), ([_0, input]) => If(TemplateInterpolate(input), ([_1, input]) => If(TemplateBody(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [_0, input], () => If(If(TemplateSpan(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If(If(TemplateSpan(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => []))), ([_0, input]) => [TemplateBodyMapping(_0), input]);
const TemplateLiteralTypes = (input) => If(If(Const("`", input), ([_0, input]) => If(TemplateBody(input), ([_1, input]) => If(Const("`", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [TemplateLiteralTypesMapping(_0), input]);
const TemplateLiteral = (input) => If(TemplateLiteralTypes(input), ([_0, input]) => [TemplateLiteralMapping(_0), input]);
const LiteralBigInt = (input) => If(BigInt$1(input), ([_0, input]) => [LiteralBigIntMapping(_0), input]);
const LiteralBoolean = (input) => If(If(Const("true", input), ([_0, input]) => [_0, input], () => If(Const("false", input), ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [LiteralBooleanMapping(_0), input]);
const LiteralNumber = (input) => If(Number$1(input), ([_0, input]) => [LiteralNumberMapping(_0), input]);
const LiteralString = (input) => If(String$1(["'", "\""], input), ([_0, input]) => [LiteralStringMapping(_0), input]);
const Literal = (input) => If(If(LiteralBigInt(input), ([_0, input]) => [_0, input], () => If(LiteralBoolean(input), ([_0, input]) => [_0, input], () => If(LiteralNumber(input), ([_0, input]) => [_0, input], () => If(LiteralString(input), ([_0, input]) => [_0, input], () => [])))), ([_0, input]) => [LiteralMapping(_0), input]);
const KeyOf = (input) => If(If(If(Const("keyof", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [KeyOfMapping(_0), input]);
const IndexArray_0 = (input, result = []) => If(If(If(Const("[", input), ([_0, input]) => If(Type(input), ([_1, input]) => If(Const("]", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [_0, input], () => If(If(Const("[", input), ([_0, input]) => If(Const("]", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => [])), ([_0, input]) => IndexArray_0(input, [...result, _0]), () => [result, input]);
const IndexArray = (input) => If(IndexArray_0(input), ([_0, input]) => [IndexArrayMapping(_0), input]);
const Extends$1 = (input) => If(If(If(Const("extends", input), ([_0, input]) => If(Type(input), ([_1, input]) => If(Const("?", input), ([_2, input]) => If(Type(input), ([_3, input]) => If(Const(":", input), ([_4, input]) => If(Type(input), ([_5, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4,
	_5
], input])))))), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [ExtendsMapping(_0), input]);
const Base = (input) => If(If(If(Const("(", input), ([_0, input]) => If(Type(input), ([_1, input]) => If(Const(")", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [_0, input], () => If(Keyword(input), ([_0, input]) => [_0, input], () => If(_Object_(input), ([_0, input]) => [_0, input], () => If(Tuple(input), ([_0, input]) => [_0, input], () => If(TemplateLiteral(input), ([_0, input]) => [_0, input], () => If(Literal(input), ([_0, input]) => [_0, input], () => If(Constructor(input), ([_0, input]) => [_0, input], () => If(_Function_(input), ([_0, input]) => [_0, input], () => If(Mapped(input), ([_0, input]) => [_0, input], () => If(Options(input), ([_0, input]) => [_0, input], () => If(GenericCall(input), ([_0, input]) => [_0, input], () => If(Reference(input), ([_0, input]) => [_0, input], () => [])))))))))))), ([_0, input]) => [BaseMapping(_0), input]);
const Factor = (input) => If(If(KeyOf(input), ([_0, input]) => If(Base(input), ([_1, input]) => If(IndexArray(input), ([_2, input]) => If(Extends$1(input), ([_3, input]) => [[
	_0,
	_1,
	_2,
	_3
], input])))), ([_0, input]) => [FactorMapping(_0), input]);
const ExprTermTail = (input) => If(If(If(Const("&", input), ([_0, input]) => If(Factor(input), ([_1, input]) => If(ExprTermTail(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [ExprTermTailMapping(_0), input]);
const ExprTerm = (input) => If(If(Factor(input), ([_0, input]) => If(ExprTermTail(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ExprTermMapping(_0), input]);
const ExprTail = (input) => If(If(If(Const("|", input), ([_0, input]) => If(ExprTerm(input), ([_1, input]) => If(ExprTail(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [ExprTailMapping(_0), input]);
const Expr = (input) => If(If(ExprTerm(input), ([_0, input]) => If(ExprTail(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ExprMapping(_0), input]);
const ExprReadonly = (input) => If(If(Const("readonly", input), ([_0, input]) => If(Expr(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ExprReadonlyMapping(_0), input]);
const ExprPipe = (input) => If(If(Const("|", input), ([_0, input]) => If(Expr(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ExprPipeMapping(_0), input]);
const GenericType = (input) => If(If(GenericParameters(input), ([_0, input]) => If(Const("=", input), ([_1, input]) => If(Type(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [GenericTypeMapping(_0), input]);
const InferType = (input) => If(If(If(Const("infer", input), ([_0, input]) => If(Ident(input), ([_1, input]) => If(Const("extends", input), ([_2, input]) => If(Expr(input), ([_3, input]) => [[
	_0,
	_1,
	_2,
	_3
], input])))), ([_0, input]) => [_0, input], () => If(If(Const("infer", input), ([_0, input]) => If(Ident(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [InferTypeMapping(_0), input]);
const Type = (input) => If(If(InferType(input), ([_0, input]) => [_0, input], () => If(ExprPipe(input), ([_0, input]) => [_0, input], () => If(ExprReadonly(input), ([_0, input]) => [_0, input], () => If(Expr(input), ([_0, input]) => [_0, input], () => [])))), ([_0, input]) => [TypeMapping(_0), input]);
const PropertyKeyNumber = (input) => If(Number$1(input), ([_0, input]) => [PropertyKeyNumberMapping(_0), input]);
const PropertyKeyIdent = (input) => If(Ident(input), ([_0, input]) => [PropertyKeyIdentMapping(_0), input]);
const PropertyKeyQuoted = (input) => If(String$1(["'", "\""], input), ([_0, input]) => [PropertyKeyQuotedMapping(_0), input]);
const PropertyKeyIndex = (input) => If(If(Const("[", input), ([_0, input]) => If(Ident(input), ([_1, input]) => If(Const(":", input), ([_2, input]) => If(If(KeywordInteger(input), ([_0, input]) => [_0, input], () => If(KeywordNumber(input), ([_0, input]) => [_0, input], () => If(KeywordString(input), ([_0, input]) => [_0, input], () => If(KeywordSymbol(input), ([_0, input]) => [_0, input], () => [])))), ([_3, input]) => If(Const("]", input), ([_4, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4
], input]))))), ([_0, input]) => [PropertyKeyIndexMapping(_0), input]);
const PropertyKey = (input) => If(If(PropertyKeyNumber(input), ([_0, input]) => [_0, input], () => If(PropertyKeyIdent(input), ([_0, input]) => [_0, input], () => If(PropertyKeyQuoted(input), ([_0, input]) => [_0, input], () => If(PropertyKeyIndex(input), ([_0, input]) => [_0, input], () => [])))), ([_0, input]) => [PropertyKeyMapping(_0), input]);
const Readonly = (input) => If(If(If(Const("readonly", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [ReadonlyMapping(_0), input]);
const Optional = (input) => If(If(If(Const("?", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [OptionalMapping(_0), input]);
const Property = (input) => If(If(Readonly(input), ([_0, input]) => If(PropertyKey(input), ([_1, input]) => If(Optional(input), ([_2, input]) => If(Const(":", input), ([_3, input]) => If(Type(input), ([_4, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4
], input]))))), ([_0, input]) => [PropertyMapping(_0), input]);
const PropertyDelimiter = (input) => If(If(If(Const(",", input), ([_0, input]) => If(Const("\n", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(Const(";", input), ([_0, input]) => If(Const("\n", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(Const(",", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If(If(Const(";", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If(If(Const("\n", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => []))))), ([_0, input]) => [PropertyDelimiterMapping(_0), input]);
const PropertyList_0 = (input, result = []) => If(If(Property(input), ([_0, input]) => If(PropertyDelimiter(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => PropertyList_0(input, [...result, _0]), () => [result, input]);
const PropertyList = (input) => If(If(PropertyList_0(input), ([_0, input]) => If(If(If(Property(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [PropertyListMapping(_0), input]);
const Properties = (input) => If(If(Const("{", input), ([_0, input]) => If(PropertyList(input), ([_1, input]) => If(Const("}", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [PropertiesMapping(_0), input]);
const _Object_ = (input) => If(Properties(input), ([_0, input]) => [_Object_Mapping(_0), input]);
const ElementNamed = (input) => If(If(If(Ident(input), ([_0, input]) => If(Const("?", input), ([_1, input]) => If(Const(":", input), ([_2, input]) => If(Const("readonly", input), ([_3, input]) => If(Type(input), ([_4, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4
], input]))))), ([_0, input]) => [_0, input], () => If(If(Ident(input), ([_0, input]) => If(Const(":", input), ([_1, input]) => If(Const("readonly", input), ([_2, input]) => If(Type(input), ([_3, input]) => [[
	_0,
	_1,
	_2,
	_3
], input])))), ([_0, input]) => [_0, input], () => If(If(Ident(input), ([_0, input]) => If(Const("?", input), ([_1, input]) => If(Const(":", input), ([_2, input]) => If(Type(input), ([_3, input]) => [[
	_0,
	_1,
	_2,
	_3
], input])))), ([_0, input]) => [_0, input], () => If(If(Ident(input), ([_0, input]) => If(Const(":", input), ([_1, input]) => If(Type(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [_0, input], () => [])))), ([_0, input]) => [ElementNamedMapping(_0), input]);
const ElementReadonlyOptional = (input) => If(If(Const("readonly", input), ([_0, input]) => If(Type(input), ([_1, input]) => If(Const("?", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [ElementReadonlyOptionalMapping(_0), input]);
const ElementReadonly = (input) => If(If(Const("readonly", input), ([_0, input]) => If(Type(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ElementReadonlyMapping(_0), input]);
const ElementOptional = (input) => If(If(Type(input), ([_0, input]) => If(Const("?", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ElementOptionalMapping(_0), input]);
const ElementBase = (input) => If(If(ElementNamed(input), ([_0, input]) => [_0, input], () => If(ElementReadonlyOptional(input), ([_0, input]) => [_0, input], () => If(ElementReadonly(input), ([_0, input]) => [_0, input], () => If(ElementOptional(input), ([_0, input]) => [_0, input], () => If(Type(input), ([_0, input]) => [_0, input], () => []))))), ([_0, input]) => [ElementBaseMapping(_0), input]);
const Element = (input) => If(If(If(Const("...", input), ([_0, input]) => If(ElementBase(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(ElementBase(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [ElementMapping(_0), input]);
const ElementList_0 = (input, result = []) => If(If(Element(input), ([_0, input]) => If(Const(",", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => ElementList_0(input, [...result, _0]), () => [result, input]);
const ElementList = (input) => If(If(ElementList_0(input), ([_0, input]) => If(If(If(Element(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ElementListMapping(_0), input]);
const Tuple = (input) => If(If(Const("[", input), ([_0, input]) => If(ElementList(input), ([_1, input]) => If(Const("]", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [TupleMapping(_0), input]);
const ParameterReadonlyOptional = (input) => If(If(Ident(input), ([_0, input]) => If(Const("?", input), ([_1, input]) => If(Const(":", input), ([_2, input]) => If(Const("readonly", input), ([_3, input]) => If(Type(input), ([_4, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4
], input]))))), ([_0, input]) => [ParameterReadonlyOptionalMapping(_0), input]);
const ParameterReadonly = (input) => If(If(Ident(input), ([_0, input]) => If(Const(":", input), ([_1, input]) => If(Const("readonly", input), ([_2, input]) => If(Type(input), ([_3, input]) => [[
	_0,
	_1,
	_2,
	_3
], input])))), ([_0, input]) => [ParameterReadonlyMapping(_0), input]);
const ParameterOptional = (input) => If(If(Ident(input), ([_0, input]) => If(Const("?", input), ([_1, input]) => If(Const(":", input), ([_2, input]) => If(Type(input), ([_3, input]) => [[
	_0,
	_1,
	_2,
	_3
], input])))), ([_0, input]) => [ParameterOptionalMapping(_0), input]);
const ParameterType = (input) => If(If(Ident(input), ([_0, input]) => If(Const(":", input), ([_1, input]) => If(Type(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [ParameterTypeMapping(_0), input]);
const ParameterBase = (input) => If(If(ParameterReadonlyOptional(input), ([_0, input]) => [_0, input], () => If(ParameterReadonly(input), ([_0, input]) => [_0, input], () => If(ParameterOptional(input), ([_0, input]) => [_0, input], () => If(ParameterType(input), ([_0, input]) => [_0, input], () => [])))), ([_0, input]) => [ParameterBaseMapping(_0), input]);
const Parameter = (input) => If(If(If(Const("...", input), ([_0, input]) => If(ParameterBase(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(ParameterBase(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [ParameterMapping(_0), input]);
const ParameterList_0 = (input, result = []) => If(If(Parameter(input), ([_0, input]) => If(Const(",", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => ParameterList_0(input, [...result, _0]), () => [result, input]);
const ParameterList = (input) => If(If(ParameterList_0(input), ([_0, input]) => If(If(If(Parameter(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ParameterListMapping(_0), input]);
const _Function_ = (input) => If(If(Const("(", input), ([_0, input]) => If(ParameterList(input), ([_1, input]) => If(Const(")", input), ([_2, input]) => If(Const("=>", input), ([_3, input]) => If(Type(input), ([_4, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4
], input]))))), ([_0, input]) => [_Function_Mapping(_0), input]);
const Constructor = (input) => If(If(Const("new", input), ([_0, input]) => If(Const("(", input), ([_1, input]) => If(ParameterList(input), ([_2, input]) => If(Const(")", input), ([_3, input]) => If(Const("=>", input), ([_4, input]) => If(Type(input), ([_5, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4,
	_5
], input])))))), ([_0, input]) => [ConstructorMapping(_0), input]);
const MappedReadonly = (input) => If(If(If(Const("+", input), ([_0, input]) => If(Const("readonly", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(Const("-", input), ([_0, input]) => If(Const("readonly", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(Const("readonly", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])))), ([_0, input]) => [MappedReadonlyMapping(_0), input]);
const MappedOptional = (input) => If(If(If(Const("+", input), ([_0, input]) => If(Const("?", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(Const("-", input), ([_0, input]) => If(Const("?", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(Const("?", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])))), ([_0, input]) => [MappedOptionalMapping(_0), input]);
const MappedAs = (input) => If(If(If(Const("as", input), ([_0, input]) => If(Type(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [MappedAsMapping(_0), input]);
const Mapped = (input) => If(If(Const("{", input), ([_0, input]) => If(MappedReadonly(input), ([_1, input]) => If(Const("[", input), ([_2, input]) => If(Ident(input), ([_3, input]) => If(Const("in", input), ([_4, input]) => If(Type(input), ([_5, input]) => If(MappedAs(input), ([_6, input]) => If(Const("]", input), ([_7, input]) => If(MappedOptional(input), ([_8, input]) => If(Const(":", input), ([_9, input]) => If(Type(input), ([_10, input]) => If(OptionalSemiColon(input), ([_11, input]) => If(Const("}", input), ([_12, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4,
	_5,
	_6,
	_7,
	_8,
	_9,
	_10,
	_11,
	_12
], input]))))))))))))), ([_0, input]) => [MappedMapping(_0), input]);
const Reference = (input) => If(Ident(input), ([_0, input]) => [ReferenceMapping(_0), input]);
const Options = (input) => If(If(Const("Options", input), ([_0, input]) => If(Const("<", input), ([_1, input]) => If(Type(input), ([_2, input]) => If(Const(",", input), ([_3, input]) => If(JsonObject(input), ([_4, input]) => If(Const(">", input), ([_5, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4,
	_5
], input])))))), ([_0, input]) => [OptionsMapping(_0), input]);
const JsonNumber = (input) => If(Number$1(input), ([_0, input]) => [JsonNumberMapping(_0), input]);
const JsonBoolean = (input) => If(If(Const("true", input), ([_0, input]) => [_0, input], () => If(Const("false", input), ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [JsonBooleanMapping(_0), input]);
const JsonString = (input) => If(String$1(["\"", "'"], input), ([_0, input]) => [JsonStringMapping(_0), input]);
const JsonNull = (input) => If(Const("null", input), ([_0, input]) => [JsonNullMapping(_0), input]);
const JsonProperty = (input) => If(If(PropertyKey(input), ([_0, input]) => If(Const(":", input), ([_1, input]) => If(Json(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [JsonPropertyMapping(_0), input]);
const JsonPropertyList_0 = (input, result = []) => If(If(JsonProperty(input), ([_0, input]) => If(PropertyDelimiter(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => JsonPropertyList_0(input, [...result, _0]), () => [result, input]);
const JsonPropertyList = (input) => If(If(JsonPropertyList_0(input), ([_0, input]) => If(If(If(JsonProperty(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [JsonPropertyListMapping(_0), input]);
const JsonObject = (input) => If(If(Const("{", input), ([_0, input]) => If(JsonPropertyList(input), ([_1, input]) => If(Const("}", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [JsonObjectMapping(_0), input]);
const JsonElementList_0 = (input, result = []) => If(If(Json(input), ([_0, input]) => If(Const(",", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => JsonElementList_0(input, [...result, _0]), () => [result, input]);
const JsonElementList = (input) => If(If(JsonElementList_0(input), ([_0, input]) => If(If(If(Json(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [JsonElementListMapping(_0), input]);
const JsonArray = (input) => If(If(Const("[", input), ([_0, input]) => If(JsonElementList(input), ([_1, input]) => If(Const("]", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [JsonArrayMapping(_0), input]);
const Json = (input) => If(If(JsonNumber(input), ([_0, input]) => [_0, input], () => If(JsonBoolean(input), ([_0, input]) => [_0, input], () => If(JsonString(input), ([_0, input]) => [_0, input], () => If(JsonNull(input), ([_0, input]) => [_0, input], () => If(JsonObject(input), ([_0, input]) => [_0, input], () => If(JsonArray(input), ([_0, input]) => [_0, input], () => [])))))), ([_0, input]) => [JsonMapping(_0), input]);
const PatternBigInt = (input) => If(Const("-?(?:0|[1-9][0-9]*)n", input), ([_0, input]) => [PatternBigIntMapping(_0), input]);
const PatternString = (input) => If(Const(".*", input), ([_0, input]) => [PatternStringMapping(_0), input]);
const PatternNumber = (input) => If(Const("-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?", input), ([_0, input]) => [PatternNumberMapping(_0), input]);
const PatternInteger = (input) => If(Const("-?(?:0|[1-9][0-9]*)", input), ([_0, input]) => [PatternIntegerMapping(_0), input]);
const PatternNever = (input) => If(Const("(?!)", input), ([_0, input]) => [PatternNeverMapping(_0), input]);
const PatternText = (input) => If(Until_1([
	"-?(?:0|[1-9][0-9]*)n",
	".*",
	"-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?",
	"-?(?:0|[1-9][0-9]*)",
	"(?!)",
	"(",
	")",
	"$",
	"|"
], input), ([_0, input]) => [PatternTextMapping(_0), input]);
const PatternBase = (input) => If(If(PatternBigInt(input), ([_0, input]) => [_0, input], () => If(PatternString(input), ([_0, input]) => [_0, input], () => If(PatternNumber(input), ([_0, input]) => [_0, input], () => If(PatternInteger(input), ([_0, input]) => [_0, input], () => If(PatternNever(input), ([_0, input]) => [_0, input], () => If(PatternGroup(input), ([_0, input]) => [_0, input], () => If(PatternText(input), ([_0, input]) => [_0, input], () => []))))))), ([_0, input]) => [PatternBaseMapping(_0), input]);
const PatternGroup = (input) => If(If(Const("(", input), ([_0, input]) => If(PatternBody(input), ([_1, input]) => If(Const(")", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [PatternGroupMapping(_0), input]);
const PatternUnion = (input) => If(If(If(PatternTerm(input), ([_0, input]) => If(Const("|", input), ([_1, input]) => If(PatternUnion(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [_0, input], () => If(If(PatternTerm(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => []))), ([_0, input]) => [PatternUnionMapping(_0), input]);
const PatternTerm = (input) => If(If(PatternBase(input), ([_0, input]) => If(PatternBody(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [PatternTermMapping(_0), input]);
const PatternBody = (input) => If(If(PatternUnion(input), ([_0, input]) => [_0, input], () => If(PatternTerm(input), ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [PatternBodyMapping(_0), input]);
const Pattern = (input) => If(If(Const("^", input), ([_0, input]) => If(PatternBody(input), ([_1, input]) => If(Const("$", input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [PatternMapping(_0), input]);
const InterfaceDeclarationHeritageList_0 = (input, result = []) => If(If(Type(input), ([_0, input]) => If(Const(",", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => InterfaceDeclarationHeritageList_0(input, [...result, _0]), () => [result, input]);
const InterfaceDeclarationHeritageList = (input) => If(If(InterfaceDeclarationHeritageList_0(input), ([_0, input]) => If(If(If(Type(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [InterfaceDeclarationHeritageListMapping(_0), input]);
const InterfaceDeclarationHeritage = (input) => If(If(If(Const("extends", input), ([_0, input]) => If(InterfaceDeclarationHeritageList(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [InterfaceDeclarationHeritageMapping(_0), input]);
const InterfaceDeclarationGeneric = (input) => If(If(Const("interface", input), ([_0, input]) => If(Ident(input), ([_1, input]) => If(GenericParameters(input), ([_2, input]) => If(InterfaceDeclarationHeritage(input), ([_3, input]) => If(Properties(input), ([_4, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4
], input]))))), ([_0, input]) => [InterfaceDeclarationGenericMapping(_0), input]);
const InterfaceDeclaration = (input) => If(If(Const("interface", input), ([_0, input]) => If(Ident(input), ([_1, input]) => If(InterfaceDeclarationHeritage(input), ([_2, input]) => If(Properties(input), ([_3, input]) => [[
	_0,
	_1,
	_2,
	_3
], input])))), ([_0, input]) => [InterfaceDeclarationMapping(_0), input]);
const TypeAliasDeclarationGeneric = (input) => If(If(Const("type", input), ([_0, input]) => If(Ident(input), ([_1, input]) => If(GenericParameters(input), ([_2, input]) => If(Const("=", input), ([_3, input]) => If(Type(input), ([_4, input]) => [[
	_0,
	_1,
	_2,
	_3,
	_4
], input]))))), ([_0, input]) => [TypeAliasDeclarationGenericMapping(_0), input]);
const TypeAliasDeclaration = (input) => If(If(Const("type", input), ([_0, input]) => If(Ident(input), ([_1, input]) => If(Const("=", input), ([_2, input]) => If(Type(input), ([_3, input]) => [[
	_0,
	_1,
	_2,
	_3
], input])))), ([_0, input]) => [TypeAliasDeclarationMapping(_0), input]);
const ExportKeyword = (input) => If(If(If(Const("export", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_0, input]) => [ExportKeywordMapping(_0), input]);
const ModuleDeclarationDelimiter = (input) => If(If(If(Const(";", input), ([_0, input]) => If(Const("\n", input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [_0, input], () => If(If(Const(";", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If(If(Const("\n", input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => []))), ([_0, input]) => [ModuleDeclarationDelimiterMapping(_0), input]);
const ModuleDeclarationList_0 = (input, result = []) => If(If(ModuleDeclaration(input), ([_0, input]) => If(ModuleDeclarationDelimiter(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => ModuleDeclarationList_0(input, [...result, _0]), () => [result, input]);
const ModuleDeclarationList = (input) => If(If(ModuleDeclarationList_0(input), ([_0, input]) => If(If(If(ModuleDeclaration(input), ([_0, input]) => [[_0], input]), ([_0, input]) => [_0, input], () => If([[], input], ([_0, input]) => [_0, input], () => [])), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ModuleDeclarationListMapping(_0), input]);
const ModuleDeclaration = (input) => If(If(ExportKeyword(input), ([_0, input]) => If(If(InterfaceDeclarationGeneric(input), ([_0, input]) => [_0, input], () => If(InterfaceDeclaration(input), ([_0, input]) => [_0, input], () => If(TypeAliasDeclarationGeneric(input), ([_0, input]) => [_0, input], () => If(TypeAliasDeclaration(input), ([_0, input]) => [_0, input], () => [])))), ([_1, input]) => If(OptionalSemiColon(input), ([_2, input]) => [[
	_0,
	_1,
	_2
], input]))), ([_0, input]) => [ModuleDeclarationMapping(_0), input]);
const Module = (input) => If(If(ModuleDeclaration(input), ([_0, input]) => If(ModuleDeclarationList(input), ([_1, input]) => [[_0, _1], input])), ([_0, input]) => [ModuleMapping(_0), input]);
const Script$1 = (input) => If(If(Module(input), ([_0, input]) => [_0, input], () => If(GenericType(input), ([_0, input]) => [_0, input], () => If(Type(input), ([_0, input]) => [_0, input], () => []))), ([_0, input]) => [ScriptMapping(_0), input]);
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/template_literal/encode.mjs
function JoinString(input) {
	return input.join("|");
}
function UnwrapTemplateLiteralPattern(pattern) {
	return pattern.slice(1, pattern.length - 1);
}
function EncodeLiteral(value, right, pattern) {
	return EncodeTypes(right, `${pattern}${value}`);
}
function EncodeBigInt(right, pattern) {
	return EncodeTypes(right, `${pattern}${BigIntPattern}`);
}
function EncodeInteger(right, pattern) {
	return EncodeTypes(right, `${pattern}${IntegerPattern}`);
}
function EncodeNumber(right, pattern) {
	return EncodeTypes(right, `${pattern}${NumberPattern}`);
}
function EncodeBoolean(right, pattern) {
	return EncodeType(Union([Literal$1("false"), Literal$1("true")]), right, pattern);
}
function EncodeString(right, pattern) {
	return EncodeTypes(right, `${pattern}.*`);
}
function EncodeTemplateLiteral(templatePattern, right, pattern) {
	return EncodeTypes(right, `${pattern}${UnwrapTemplateLiteralPattern(templatePattern)}`);
}
function EncodeTemplateLiteralDeferred(types, right, pattern) {
	return EncodeType(TemplateLiteralAction(types, {}), right, pattern);
}
function EncodeEnum(types, right, pattern) {
	return EncodeUnion(EnumValuesToVariants(types), right, pattern);
}
function EncodeUnion(types, right, pattern, result = []) {
	return TakeLeft(types, (head, tail) => EncodeUnion(tail, right, pattern, [...result, EncodeType(head, [], "")]), () => EncodeTypes(right, `${pattern}(${JoinString(result)})`));
}
function EncodeType(type, right, pattern) {
	return IsEnum$1(type) ? EncodeEnum(type.enum, right, pattern) : IsInteger(type) ? EncodeInteger(right, pattern) : IsLiteral(type) ? EncodeLiteral(type.const, right, pattern) : IsBigInt(type) ? EncodeBigInt(right, pattern) : IsBoolean(type) ? EncodeBoolean(right, pattern) : IsNumber(type) ? EncodeNumber(right, pattern) : IsString(type) ? EncodeString(right, pattern) : IsTemplateLiteral(type) ? EncodeTemplateLiteral(type.pattern, right, pattern) : IsTemplateLiteralDeferred(type) ? EncodeTemplateLiteralDeferred(type.parameters[0], right, pattern) : IsUnion(type) ? EncodeUnion(type.anyOf, right, pattern) : NeverPattern;
}
function EncodeTypes(types, pattern) {
	return TakeLeft(types, (left, right) => EncodeType(left, right, pattern), () => pattern);
}
function EncodePattern(types) {
	return `^${EncodeTypes(types, "")}$`;
}
/** Encodes a TemplateLiteral type sequence into a TemplateLiteral */
function TemplateLiteralEncode(types) {
	return TemplateLiteralCreate(EncodePattern(types));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/template_literal/instantiate.mjs
function TemplateLiteralAction(types, options) {
	return CanInstantiate(types) ? Update(TemplateLiteralEncode(types), {}, options) : TemplateLiteralDeferred(types, options);
}
function TemplateLiteralInstantiate(context, state, types, options) {
	return TemplateLiteralAction(InstantiateTypes(context, state, types), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/template_literal.mjs
/** Creates a deferred TemplateLiteral action. */
function TemplateLiteralDeferred(types, options = {}) {
	return Deferred("TemplateLiteral", [types], options);
}
/** Returns true if this value is a deferred Interface action. */
function IsTemplateLiteralDeferred(value) {
	return IsSchema$1(value) && HasPropertyKey(value, "action") && IsEqual(value.action, "TemplateLiteral");
}
/** Returns true if the given value is TTemplateLiteral. */
function IsTemplateLiteral(value) {
	return IsKind(value, "TemplateLiteral");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/result.mjs
function ExtendsUnion$1(inferred) {
	return Create({ ["~kind"]: "ExtendsUnion" }, { inferred });
}
function IsExtendsUnion(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && HasPropertyKey(value, "inferred") && IsEqual(value["~kind"], "ExtendsUnion") && IsObject$1(value.inferred);
}
function ExtendsTrue(inferred) {
	return Create({ ["~kind"]: "ExtendsTrue" }, { inferred });
}
function IsExtendsTrue(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && HasPropertyKey(value, "inferred") && IsEqual(value["~kind"], "ExtendsTrue") && IsObject$1(value.inferred);
}
function ExtendsFalse() {
	return Create({ ["~kind"]: "ExtendsFalse" }, {});
}
function IsExtendsFalse(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && IsEqual(value["~kind"], "ExtendsFalse");
}
function IsExtendsTrueLike(value) {
	return IsExtendsUnion(value) || IsExtendsTrue(value);
}
function Match$1(result, true_, false_) {
	return IsExtendsTrueLike(result) ? true_(result.inferred) : false_();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/extends_right.mjs
function ExtendsRightInfer(inferred, name, left, right) {
	return Match$1(ExtendsLeft(inferred, left, right), (checkInferred) => ExtendsTrue(Assign(Assign(inferred, checkInferred), { [name]: left })), () => ExtendsFalse());
}
function ExtendsRightAny(inferred, _left) {
	return ExtendsTrue(inferred);
}
function ExtendsRightEnum(inferred, left, right) {
	return ExtendsLeft(inferred, left, EnumValuesToUnion(right));
}
function ExtendsRightIntersect(inferred, left, right) {
	return TakeLeft(right, (head, tail) => Match$1(ExtendsLeft(inferred, left, head), (inferred) => ExtendsRightIntersect(inferred, left, tail), () => ExtendsFalse()), () => ExtendsTrue(inferred));
}
function ExtendsRightTemplateLiteral(inferred, left, right) {
	return ExtendsLeft(inferred, left, TemplateLiteralDecode(right));
}
function ExtendsRightUnion(inferred, left, right) {
	return TakeLeft(right, (head, tail) => Match$1(ExtendsLeft(inferred, left, head), (inferred) => ExtendsTrue(inferred), () => ExtendsRightUnion(inferred, left, tail)), () => ExtendsFalse());
}
function ExtendsRight(inferred, left, right) {
	return IsAny(right) ? ExtendsRightAny(inferred, left) : IsEnum$1(right) ? ExtendsRightEnum(inferred, left, right.enum) : IsInfer(right) ? ExtendsRightInfer(inferred, right.name, left, right.extends) : IsIntersect(right) ? ExtendsRightIntersect(inferred, left, right.allOf) : IsTemplateLiteral(right) ? ExtendsRightTemplateLiteral(inferred, left, right.pattern) : IsUnion(right) ? ExtendsRightUnion(inferred, left, right.anyOf) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsFalse();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/any.mjs
function ExtendsAny(inferred, left, right) {
	return IsInfer(right) ? ExtendsRight(inferred, left, right) : IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsUnion$1(inferred);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/array.mjs
function ExtendsImmutable(left, right) {
	const isImmutableLeft = IsImmutable(left);
	const isImmutableRight = IsImmutable(right);
	return isImmutableLeft && isImmutableRight ? true : !isImmutableLeft && isImmutableRight ? true : isImmutableLeft && !isImmutableRight ? false : true;
}
function ExtendsArray(inferred, arrayLeft, left, right) {
	return IsArray(right) ? ExtendsImmutable(arrayLeft, right) ? ExtendsLeft(inferred, left, right.items) : ExtendsFalse() : ExtendsRight(inferred, arrayLeft, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/async_iterator.mjs
function ExtendsAsyncIterator(inferred, left, right) {
	return IsAsyncIterator(right) ? ExtendsLeft(inferred, left, right.iteratorItems) : ExtendsRight(inferred, AsyncIterator(left), right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/bigint.mjs
function ExtendsBigInt(inferred, left, right) {
	return IsBigInt(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/boolean.mjs
function ExtendsBoolean(inferred, left, right) {
	return IsBoolean(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/parameters.mjs
function ParameterCompare(inferred, left, leftRest, right, rightRest) {
	const checkLeft = IsInfer(right) ? left : right;
	const checkRight = IsInfer(right) ? right : left;
	const isLeftOptional = IsOptional(left);
	const isRightOptional = IsOptional(right);
	return !isLeftOptional && isRightOptional ? ExtendsFalse() : Match$1(ExtendsLeft(inferred, checkLeft, checkRight), (inferred) => ExtendsParameters(inferred, leftRest, rightRest), () => ExtendsFalse());
}
function ParameterRight(inferred, left, leftRest, rightRest) {
	return TakeLeft(rightRest, (head, tail) => ParameterCompare(inferred, left, leftRest, head, tail), () => IsOptional(left) ? ExtendsTrue(inferred) : ExtendsFalse());
}
function ParametersLeft(inferred, left, rightRest) {
	return TakeLeft(left, (head, tail) => ParameterRight(inferred, head, tail, rightRest), () => ExtendsTrue(inferred));
}
function ExtendsParameters(inferred, left, right) {
	return ParametersLeft(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/return_type.mjs
function ExtendsReturnType(inferred, left, right) {
	return IsVoid(right) ? ExtendsTrue(inferred) : ExtendsLeft(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/constructor.mjs
function ExtendsConstructor(inferred, parameters, returnType, right) {
	return IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : IsConstructor(right) ? Match$1(ExtendsParameters(inferred, parameters, right["parameters"]), (inferred) => ExtendsReturnType(inferred, returnType, right["instanceType"]), () => ExtendsFalse()) : ExtendsFalse();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/enum.mjs
function ExtendsEnum(inferred, left, right) {
	return ExtendsLeft(inferred, EnumToUnion(left), right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/function.mjs
function ExtendsFunction(inferred, parameters, returnType, right) {
	return IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : IsFunction(right) ? Match$1(ExtendsParameters(inferred, parameters, right["parameters"]), (inferred) => ExtendsReturnType(inferred, returnType, right["returnType"]), () => ExtendsFalse()) : ExtendsFalse();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/integer.mjs
function ExtendsInteger(inferred, left, right) {
	return IsInteger(right) ? ExtendsTrue(inferred) : IsNumber(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/intersect.mjs
function ExtendsIntersect(inferred, left, right) {
	return ExtendsLeft(inferred, EvaluateIntersect(left), right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/iterator.mjs
function ExtendsIterator(inferred, left, right) {
	return IsIterator(right) ? ExtendsLeft(inferred, left, right.iteratorItems) : ExtendsRight(inferred, Iterator(left), right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/literal.mjs
function ExtendsLiteralValue(inferred, left, right) {
	return left === right ? ExtendsTrue(inferred) : ExtendsFalse();
}
function ExtendsLiteralBigInt(inferred, left, right) {
	return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsBigInt(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal$1(left), right);
}
function ExtendsLiteralBoolean(inferred, left, right) {
	return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsBoolean(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal$1(left), right);
}
function ExtendsLiteralNumber(inferred, left, right) {
	return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsNumber(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal$1(left), right);
}
function ExtendsLiteralString(inferred, left, right) {
	return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsString(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal$1(left), right);
}
function ExtendsLiteral(inferred, left, right) {
	return IsBigInt$1(left.const) ? ExtendsLiteralBigInt(inferred, left.const, right) : IsBoolean$2(left.const) ? ExtendsLiteralBoolean(inferred, left.const, right) : IsNumber$2(left.const) ? ExtendsLiteralNumber(inferred, left.const, right) : IsString$2(left.const) ? ExtendsLiteralString(inferred, left.const, right) : Unreachable$1();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/never.mjs
function ExtendsNever(inferred, left, right) {
	return IsInfer(right) ? ExtendsRight(inferred, left, right) : ExtendsTrue(inferred);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/null.mjs
function ExtendsNull(inferred, left, right) {
	return IsNull(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/number.mjs
function ExtendsNumber(inferred, left, right) {
	return IsNumber(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/object.mjs
function ExtendsPropertyOptional(inferred, left, right) {
	return IsOptional(left) ? IsOptional(right) ? ExtendsTrue(inferred) : ExtendsFalse() : ExtendsTrue(inferred);
}
function ExtendsProperty(inferred, left, right) {
	return IsInfer(right) && IsNever(right.extends) ? ExtendsFalse() : Match$1(ExtendsLeft(inferred, left, right), (inferred) => ExtendsPropertyOptional(inferred, left, right), () => ExtendsFalse());
}
function ExtractInferredProperties(keys, properties) {
	return keys.reduce((result, key) => {
		return key in properties ? IsExtendsTrueLike(properties[key]) ? {
			...result,
			...properties[key].inferred
		} : Unreachable$1() : Unreachable$1();
	}, {});
}
function ExtendsPropertiesComparer(inferred, left, right) {
	const properties = {};
	for (const rightKey of Keys(right)) properties[rightKey] = rightKey in left ? ExtendsProperty({}, left[rightKey], right[rightKey]) : IsOptional(right[rightKey]) ? IsInfer(right[rightKey]) ? ExtendsTrue(Assign(inferred, { [right[rightKey].name]: right[rightKey].extends })) : ExtendsTrue(inferred) : ExtendsFalse();
	const checked = Values(properties).every((result) => IsExtendsTrueLike(result));
	const extracted = checked ? ExtractInferredProperties(Keys(properties), properties) : {};
	return checked ? ExtendsTrue(extracted) : ExtendsFalse();
}
function ExtendsProperties(inferred, left, right) {
	const compared = ExtendsPropertiesComparer(inferred, left, right);
	return IsExtendsTrueLike(compared) ? ExtendsTrue(Assign(inferred, compared.inferred)) : ExtendsFalse();
}
function ExtendsObjectToObject(inferred, left, right) {
	return ExtendsProperties(inferred, left, right);
}
function ExtendsObject(inferred, left, right) {
	return IsObject(right) ? ExtendsObjectToObject(inferred, left, right.properties) : ExtendsRight(inferred, _Object_$1(left), right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/promise.mjs
function ExtendsPromise(inferred, left, right) {
	return IsPromise(right) ? ExtendsLeft(inferred, left, right.item) : ExtendsRight(inferred, _Promise_(left), right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/string.mjs
function ExtendsString(inferred, left, right) {
	return IsString(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/symbol.mjs
function ExtendsSymbol(inferred, left, right) {
	return IsSymbol(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/template_literal.mjs
function ExtendsTemplateLiteral(inferred, left, right) {
	return ExtendsLeft(inferred, TemplateLiteralDecode(left), right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/inference.mjs
function Inferrable(name, type) {
	return Create({ "~kind": "Inferrable" }, {
		name,
		type
	}, {});
}
function IsInferable(value) {
	return IsObject$1(value) && HasPropertyKey(value, "~kind") && HasPropertyKey(value, "name") && HasPropertyKey(value, "type") && IsEqual(value["~kind"], "Inferrable") && IsString$2(value.name) && IsObject$1(value.type);
}
function TryRestInferable(type) {
	return IsRest(type) ? IsInfer(type.items) ? IsArray(type.items.extends) ? Inferrable(type.items.name, type.items.extends.items) : IsUnknown(type.items.extends) ? Inferrable(type.items.name, type.items.extends) : void 0 : Unreachable$1() : void 0;
}
function TryInferable(type) {
	return IsInfer(type) ? Inferrable(type.name, type.extends) : void 0;
}
function TryInferResults(rest, right, result = []) {
	return TakeLeft(rest, (head, tail) => Match$1(ExtendsLeft({}, head, right), () => TryInferResults(tail, right, [...result, head]), () => void 0), () => result);
}
function InferTupleResult(inferred, name, left, right) {
	const results = TryInferResults(left, right);
	return IsArray$1(results) ? ExtendsTrue(Assign(inferred, { [name]: Tuple$1(results) })) : ExtendsFalse();
}
function InferUnionResult(inferred, name, left, right) {
	const results = TryInferResults(left, right);
	return IsArray$1(results) ? ExtendsTrue(Assign(inferred, { [name]: Union(results) })) : ExtendsFalse();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/tuple.mjs
function Reverse(types) {
	return [...types].reverse();
}
function ApplyReverse(types, reversed) {
	return reversed ? Reverse(types) : types;
}
function Reversed(types) {
	const first = types.length > 0 ? types[0] : void 0;
	return IsSchema$1(IsSchema$1(first) ? TryRestInferable(first) : void 0);
}
function ElementsCompare(inferred, reversed, left, leftRest, right, rightRest) {
	return Match$1(ExtendsLeft(inferred, left, right), (checkInferred) => Elements(checkInferred, reversed, leftRest, rightRest), () => ExtendsFalse());
}
function ElementsLeft(inferred, reversed, leftRest, right, rightRest) {
	const inferable = TryRestInferable(right);
	return IsInferable(inferable) ? InferTupleResult(inferred, inferable["name"], ApplyReverse(leftRest, reversed), inferable["type"]) : TakeLeft(leftRest, (head, tail) => ElementsCompare(inferred, reversed, head, tail, right, rightRest), () => ExtendsFalse());
}
function ElementsRight(inferred, reversed, leftRest, rightRest) {
	return TakeLeft(rightRest, (head, tail) => ElementsLeft(inferred, reversed, leftRest, head, tail), () => IsEqual(leftRest.length, 0) ? ExtendsTrue(inferred) : ExtendsFalse());
}
function Elements(inferred, reversed, leftRest, rightRest) {
	return ElementsRight(inferred, reversed, leftRest, rightRest);
}
function ExtendsTupleToTuple(inferred, left, right) {
	const instantiatedRight = InstantiateElements(inferred, { callstack: [] }, right);
	const reversed = Reversed(instantiatedRight);
	return Elements(inferred, reversed, ApplyReverse(left, reversed), ApplyReverse(instantiatedRight, reversed));
}
function ExtendsTupleToArray(inferred, left, right) {
	const inferrable = TryInferable(right);
	return IsInferable(inferrable) ? InferUnionResult(inferred, inferrable["name"], left, inferrable["type"]) : TakeLeft(left, (head, tail) => Match$1(ExtendsLeft(inferred, head, right), (inferred) => ExtendsTupleToArray(inferred, tail, right), () => ExtendsFalse()), () => ExtendsTrue(inferred));
}
function ExtendsTuple(inferred, left, right) {
	const instantiatedLeft = InstantiateElements(inferred, { callstack: [] }, left);
	return IsTuple(right) ? ExtendsTupleToTuple(inferred, instantiatedLeft, right.items) : IsArray(right) ? ExtendsTupleToArray(inferred, instantiatedLeft, right.items) : ExtendsRight(inferred, Tuple$1(instantiatedLeft), right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/undefined.mjs
function ExtendsUndefined(inferred, left, right) {
	return IsVoid(right) ? ExtendsTrue(inferred) : IsUndefined(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/union.mjs
function ExtendsUnionSome(inferred, type, unionTypes) {
	return TakeLeft(unionTypes, (head, tail) => Match$1(ExtendsLeft(inferred, type, head), (inferred) => ExtendsTrue(inferred), () => ExtendsUnionSome(inferred, type, tail)), () => ExtendsFalse());
}
function ExtendsUnionLeft(inferred, left, right) {
	return TakeLeft(left, (head, tail) => Match$1(ExtendsUnionSome(inferred, head, right), (inferred) => ExtendsUnionLeft(inferred, tail, right), () => ExtendsFalse()), () => ExtendsTrue(inferred));
}
function ExtendsUnion(inferred, left, right) {
	const inferrable = TryInferable(right);
	return IsInferable(inferrable) ? InferUnionResult(inferred, inferrable.name, left, inferrable.type) : IsUnion(right) ? ExtendsUnionLeft(inferred, left, right.anyOf) : ExtendsUnionLeft(inferred, left, [right]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/unknown.mjs
function ExtendsUnknown(inferred, left, right) {
	return IsInfer(right) ? ExtendsRight(inferred, left, right) : IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsFalse();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/void.mjs
function ExtendsVoid(inferred, left, right) {
	return IsVoid(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/extends_left.mjs
function ExtendsLeft(inferred, left, right) {
	return IsAny(left) ? ExtendsAny(inferred, left, right) : IsArray(left) ? ExtendsArray(inferred, left, left.items, right) : IsAsyncIterator(left) ? ExtendsAsyncIterator(inferred, left.iteratorItems, right) : IsBigInt(left) ? ExtendsBigInt(inferred, left, right) : IsBoolean(left) ? ExtendsBoolean(inferred, left, right) : IsConstructor(left) ? ExtendsConstructor(inferred, left.parameters, left.instanceType, right) : IsEnum$1(left) ? ExtendsEnum(inferred, left, right) : IsFunction(left) ? ExtendsFunction(inferred, left.parameters, left.returnType, right) : IsInteger(left) ? ExtendsInteger(inferred, left, right) : IsIntersect(left) ? ExtendsIntersect(inferred, left.allOf, right) : IsIterator(left) ? ExtendsIterator(inferred, left.iteratorItems, right) : IsLiteral(left) ? ExtendsLiteral(inferred, left, right) : IsNever(left) ? ExtendsNever(inferred, left, right) : IsNull(left) ? ExtendsNull(inferred, left, right) : IsNumber(left) ? ExtendsNumber(inferred, left, right) : IsObject(left) ? ExtendsObject(inferred, left.properties, right) : IsPromise(left) ? ExtendsPromise(inferred, left.item, right) : IsString(left) ? ExtendsString(inferred, left, right) : IsSymbol(left) ? ExtendsSymbol(inferred, left, right) : IsTemplateLiteral(left) ? ExtendsTemplateLiteral(inferred, left.pattern, right) : IsTuple(left) ? ExtendsTuple(inferred, left.items, right) : IsUndefined(left) ? ExtendsUndefined(inferred, left, right) : IsUnion(left) ? ExtendsUnion(inferred, left.anyOf, right) : IsUnknown(left) ? ExtendsUnknown(inferred, left, right) : IsVoid(left) ? ExtendsVoid(inferred, left, right) : ExtendsFalse();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/interface/instantiate.mjs
function InterfaceOperation(heritage, properties) {
	return EvaluateIntersect([...heritage, _Object_$1(properties)]);
}
function InterfaceAction(heritage, properties, options) {
	return CanInstantiate(heritage) ? Update(InterfaceOperation(heritage, properties), {}, options) : InterfaceDeferred(heritage, properties, options);
}
function InterfaceInstantiate(context, state, heritage, properties, options) {
	return InterfaceAction(InstantiateTypes(context, state, heritage), InstantiateProperties(context, state, properties), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/interface.mjs
/** Creates a deferred Interface action. */
function InterfaceDeferred(heritage, properties, options = {}) {
	return Deferred("Interface", [heritage, properties], options);
}
/** Returns true if this value is a deferred Interface action. */
function IsInterfaceDeferred(value) {
	return IsSchema$1(value) && HasPropertyKey(value, "action") && IsEqual(value.action, "Interface");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/cyclic/check.mjs
function FromRef$3(stack, context, ref) {
	return stack.includes(ref) ? true : FromType$15([...stack, ref], context, context[ref]);
}
function FromProperties$2(stack, context, properties) {
	return FromTypes$3(stack, context, PropertyValues(properties));
}
function FromTypes$3(stack, context, types) {
	return TakeLeft(types, (left, right) => FromType$15(stack, context, left) ? true : FromTypes$3(stack, context, right), () => false);
}
function FromType$15(stack, context, type) {
	return IsRef$1(type) ? FromRef$3(stack, context, type.$ref) : IsArray(type) ? FromType$15(stack, context, type.items) : IsAsyncIterator(type) ? FromType$15(stack, context, type.iteratorItems) : IsConstructor(type) ? FromTypes$3(stack, context, [...type.parameters, type.instanceType]) : IsFunction(type) ? FromTypes$3(stack, context, [...type.parameters, type.returnType]) : IsInterfaceDeferred(type) ? FromProperties$2(stack, context, type.parameters[1]) : IsIntersect(type) ? FromTypes$3(stack, context, type.allOf) : IsIterator(type) ? FromType$15(stack, context, type.iteratorItems) : IsObject(type) ? FromProperties$2(stack, context, type.properties) : IsPromise(type) ? FromType$15(stack, context, type.item) : IsUnion(type) ? FromTypes$3(stack, context, type.anyOf) : IsTuple(type) ? FromTypes$3(stack, context, type.items) : IsRecord(type) ? FromType$15(stack, context, RecordValue(type)) : false;
}
/** Performs a cyclic check on the given type. Initial key stack can be empty, but faster if specified */
function CyclicCheck(stack, context, type) {
	return FromType$15(stack, context, type);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/cyclic/candidates.mjs
function ResolveCandidateKeys(context, keys) {
	return keys.reduce((result, left) => {
		return left in context ? CyclicCheck([left], context, context[left]) ? [...result, left] : result : Unreachable$1();
	}, []);
}
/** Returns keys for context types that need to be transformed to TCyclic. */
function CyclicCandidates(context) {
	return ResolveCandidateKeys(context, PropertyKeys(context));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/cyclic/dependencies.mjs
function FromRef$2(context, ref, result) {
	return result.includes(ref) ? result : ref in context ? FromType$14(context, context[ref], [...result, ref]) : Unreachable$1();
}
function FromProperties$1(context, properties, result) {
	return FromTypes$2(context, PropertyValues(properties), result);
}
function FromTypes$2(context, types, result) {
	return types.reduce((result, left) => {
		return FromType$14(context, left, result);
	}, result);
}
function FromType$14(context, type, result) {
	return IsRef$1(type) ? FromRef$2(context, type.$ref, result) : IsArray(type) ? FromType$14(context, type.items, result) : IsAsyncIterator(type) ? FromType$14(context, type.iteratorItems, result) : IsConstructor(type) ? FromTypes$2(context, [...type.parameters, type.instanceType], result) : IsFunction(type) ? FromTypes$2(context, [...type.parameters, type.returnType], result) : IsInterfaceDeferred(type) ? FromProperties$1(context, type.parameters[1], result) : IsIntersect(type) ? FromTypes$2(context, type.allOf, result) : IsIterator(type) ? FromType$14(context, type.iteratorItems, result) : IsObject(type) ? FromProperties$1(context, type.properties, result) : IsPromise(type) ? FromType$14(context, type.item, result) : IsUnion(type) ? FromTypes$2(context, type.anyOf, result) : IsTuple(type) ? FromTypes$2(context, type.items, result) : IsRecord(type) ? FromType$14(context, RecordValue(type), result) : result;
}
/** Returns dependent cyclic keys for the given type. This function is used to dead-type-eliminate (DTE) for initializing TCyclic types. */
function CyclicDependencies(context, key, type) {
	return FromType$14(context, type, [key]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/cyclic/extends.mjs
function FromRef$1(_ref) {
	return Any();
}
function FromProperties(properties) {
	return Keys(properties).reduce((result, key) => {
		return {
			...result,
			[key]: FromType$13(properties[key])
		};
	}, {});
}
function FromTypes$1(types) {
	return types.reduce((result, left) => {
		return [...result, FromType$13(left)];
	}, []);
}
function FromType$13(type) {
	return IsRef$1(type) ? FromRef$1(type.$ref) : IsArray(type) ? _Array_(FromType$13(type.items), ArrayOptions(type)) : IsAsyncIterator(type) ? AsyncIterator(FromType$13(type.iteratorItems)) : IsConstructor(type) ? Constructor$1(FromTypes$1(type.parameters), FromType$13(type.instanceType)) : IsFunction(type) ? _Function_$1(FromTypes$1(type.parameters), FromType$13(type.returnType)) : IsIntersect(type) ? Intersect(FromTypes$1(type.allOf)) : IsIterator(type) ? Iterator(FromType$13(type.iteratorItems)) : IsObject(type) ? _Object_$1(FromProperties(type.properties)) : IsPromise(type) ? _Promise_(FromType$13(type.item)) : IsRecord(type) ? Record(RecordKey(type), FromType$13(RecordValue(type))) : IsUnion(type) ? Union(FromTypes$1(type.anyOf)) : IsTuple(type) ? Tuple$1(FromTypes$1(type.items)) : type;
}
function CyclicAnyFromParameters(defs, ref) {
	return ref in defs ? FromType$13(defs[ref]) : Unknown();
}
/** Transforms TCyclic TRef's into TAny's. This function is used prior to TExtends checks to enable cyclics to be structurally checked and terminated (with TAny) at first point of recursion, what would otherwise be a recursive TRef.*/
function CyclicExtends(type) {
	return CyclicAnyFromParameters(type.$defs, type.$ref);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/cyclic/instantiate.mjs
function CyclicInterface(context, heritage, properties) {
	const instantiatedHeritage = InstantiateTypes(context, { callstack: [] }, heritage);
	const instantiatedProperties = InstantiateProperties({}, { callstack: [] }, properties);
	return EvaluateIntersect([...instantiatedHeritage, _Object_$1(instantiatedProperties)]);
}
function CyclicDefinitions(context, dependencies) {
	return Keys(context).filter((key) => dependencies.includes(key)).reduce((result, key) => {
		const type = context[key];
		const instantiatedType = IsInterfaceDeferred(type) ? CyclicInterface(context, type.parameters[0], type.parameters[1]) : type;
		return {
			...result,
			[key]: instantiatedType
		};
	}, {});
}
function InstantiateCyclic(context, ref, type) {
	return Cyclic(CyclicDefinitions(context, CyclicDependencies(context, ref, type)), ref);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/cyclic/target.mjs
function Resolve(defs, ref) {
	return ref in defs ? IsRef$1(defs[ref]) ? Resolve(defs, defs[ref].$ref) : defs[ref] : Never();
}
/** Returns the target Type from the Defs or Never if target is non-resolvable */
function CyclicTarget(defs, ref) {
	return Resolve(defs, ref);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/extends/extends.mjs
function Canonical(type) {
	return IsCyclic(type) ? CyclicExtends(type) : IsUnsafe(type) ? Unknown() : type;
}
/** Performs a structural extends check on left and right types and yields inferred types on right if specified. */
function Extends(inferred, left, right) {
	return ExtendsLeft(inferred, Canonical(left), Canonical(right));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/evaluate/compare.mjs
const ResultEqual = "equal";
const ResultDisjoint = "disjoint";
const ResultLeftInside = "left-inside";
const ResultRightInside = "right-inside";
/** Compares left and right types and determines their set relationship. */
function Compare(left, right) {
	const extendsCheck = [IsUnknown(left) ? ExtendsFalse() : Extends({}, left, right), IsUnknown(left) ? ExtendsTrue({}) : Extends({}, right, left)];
	return IsExtendsTrueLike(extendsCheck[0]) && IsExtendsTrueLike(extendsCheck[1]) ? ResultEqual : IsExtendsTrueLike(extendsCheck[0]) && IsExtendsFalse(extendsCheck[1]) ? ResultLeftInside : IsExtendsFalse(extendsCheck[0]) && IsExtendsTrueLike(extendsCheck[1]) ? ResultRightInside : ResultDisjoint;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/evaluate/broaden.mjs
function BroadFilter(type, types) {
	return types.filter((left) => {
		return Compare(type, left) === "right-inside" ? false : true;
	});
}
function IsBroadestType(type, types) {
	return IsEqual(types.some((left) => {
		const result = Compare(type, left);
		return IsEqual(result, "left-inside") || IsEqual(result, "equal");
	}), false);
}
function BroadenType(type, types) {
	const evaluated = EvaluateType(type);
	return IsAny(evaluated) ? [evaluated] : IsBroadestType(evaluated, types) ? [...BroadFilter(evaluated, types), evaluated] : types;
}
function BroadenTypes(types) {
	return types.reduce((result, left) => {
		return IsObject(left) ? [...result, left] : IsNever(left) ? result : BroadenType(left, result);
	}, []);
}
/** Broadens a set of types and returns either the most broad type, or union or disjoint types. */
function Broaden(types) {
	const flattened = Flatten(BroadenTypes(types));
	return flattened.length === 0 ? Never() : flattened.length === 1 ? flattened[0] : Union(flattened);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/evaluate/instantiate.mjs
function EvaluateAction(type, options) {
	return Update(EvaluateType(type), {}, options);
}
function EvaluateInstantiate(context, state, type, options) {
	return EvaluateAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/call/distribute_arguments.mjs
function CollectDistributionNames(expression, result = []) {
	return IsDeferred(expression) && IsEqual(expression.action, "Conditional") ? IsRef$1(expression.parameters[0]) ? CollectDistributionNames(expression.parameters[2], CollectDistributionNames(expression.parameters[3], [...result, expression.parameters[0]["$ref"]])) : CollectDistributionNames(expression.parameters[2], CollectDistributionNames(expression.parameters[3], result)) : IsDeferred(expression) && IsEqual(expression.action, "Mapped") ? IsDeferred(expression.parameters[1]) && IsEqual(expression.parameters[1].action, "KeyOf") && IsRef$1(expression.parameters[1].parameters[0]) ? [...result, expression.parameters[1].parameters[0]["$ref"]] : result : result;
}
function BuildDistributionArray(parameters, names) {
	return parameters.reduce((result, left) => [...result, names.includes(left.name)], []);
}
function ZipDistributionArray(arguments_, distributionArray, result = []) {
	return TakeLeft(arguments_, (argumentLeft, argumentRight) => TakeLeft(distributionArray, (booleanLeft, booleanRight) => ZipDistributionArray(argumentRight, booleanRight, [...result, [booleanLeft, argumentLeft]]), () => result), () => result);
}
function Expand(type) {
	return IsUnion(type) ? [...type.anyOf] : [type];
}
function Append(current, type) {
	return current.reduce((result, left) => [...result, [...left, type]], []);
}
function Cross(current, variants) {
	return variants.reduce((result, left) => {
		return [...result, ...Append(current, left)];
	}, []);
}
function Distribute(zipped) {
	return zipped.reduce((result, left) => {
		return IsEqual(left[0], true) ? Cross(result, Expand(left[1])) : Cross(result, [left[1]]);
	}, [[]]);
}
function DistributeArguments(parameters, arguments_, expression) {
	const zippedArguments = ZipDistributionArray(arguments_, BuildDistributionArray(parameters, CollectDistributionNames(expression)));
	return IsDeferred(expression) && IsEqual(expression.action, "Conditional") ? Distribute(zippedArguments) : IsDeferred(expression) && IsEqual(expression.action, "Mapped") ? Distribute(zippedArguments) : [arguments_];
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/call/resolve_target.mjs
function FromNotResolvable() {
	return ["(not-resolvable)", Never()];
}
function FromNotGeneric() {
	return ["(not-generic)", Never()];
}
function FromGeneric(name, parameters, expression) {
	return [name, Generic(parameters, expression)];
}
function FromRef(context, ref, arguments_) {
	return ref in context ? FromType$12(context, ref, context[ref], arguments_) : FromNotResolvable();
}
function FromType$12(context, name, target, arguments_) {
	return IsGeneric(target) ? FromGeneric(name, target.parameters, target.expression) : IsRef$1(target) ? FromRef(context, target.$ref, arguments_) : FromNotGeneric();
}
/** Resolves a named generic target from the context, or returns TNever if it cannot be resolved or is not generic. */
function ResolveTarget(context, target, arguments_) {
	return FromType$12(context, "(anonymous)", target, arguments_);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/call/resolve_arguments.mjs
function AssertArgumentExtends(name, type, extends_) {
	if (IsInfer(type) || IsCall(type) || IsExtendsTrueLike(Extends({}, type, extends_))) return;
	const cause = {
		parameter: name,
		expect: extends_,
		actual: type
	};
	throw new Error(`Argument for parameter ${name} does not satisfy constraint`, { cause });
}
function BindArgument(context, state, name, extends_, type) {
	const instantiatedArgument = InstantiateType(context, state, type);
	AssertArgumentExtends(name, instantiatedArgument, extends_);
	return Assign(context, { [name]: instantiatedArgument });
}
function BindArguments(context, state, parameterLeft, parameterRight, arguments_) {
	const instantiatedExtends = InstantiateType(context, state, parameterLeft.extends);
	const instantiatedEquals = InstantiateType(context, state, parameterLeft.equals);
	return TakeLeft(arguments_, (left, right) => BindParameters(BindArgument(context, state, parameterLeft["name"], instantiatedExtends, left), state, parameterRight, right), () => BindParameters(BindArgument(context, state, parameterLeft["name"], instantiatedExtends, instantiatedEquals), state, parameterRight, []));
}
function BindParameters(context, state, parameters, arguments_) {
	return TakeLeft(parameters, (left, right) => BindArguments(context, state, left, right, arguments_), () => context);
}
function ResolveArgumentsContext(context, state, parameters, arguments_) {
	return BindParameters(context, state, parameters, arguments_);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/call/instantiate.mjs
function Peek(state) {
	return IsGreaterThan(state.callstack.length, 0) ? state.callstack[state.callstack.length - 1] : "";
}
function IsTailCall(state, name) {
	return IsEqual(Peek(state), name);
}
function CallDispatch(context, state, target, parameters, expression, arguments_) {
	return InstantiateType(context, state, InstantiateType(ResolveArgumentsContext(context, state, parameters, arguments_), { callstack: [...state.callstack, target.$ref] }, expression));
}
function CallDistributed(context, state, target, parameters, expression, distributedArguments) {
	return distributedArguments.reduce((result, arguments_) => [...result, CallDispatch(context, state, target, parameters, expression, arguments_)], []);
}
function CallImmediate(context, state, target, parameters, expression, arguments_) {
	const returnTypes = CallDistributed(context, state, target, parameters, expression, DistributeArguments(parameters, arguments_, expression));
	return IsEqual(returnTypes.length, 1) ? returnTypes[0] : EvaluateUnion(returnTypes);
}
function CallInstantiate(context, state, target, arguments_) {
	const instantiatedArguments = InstantiateTypes(context, state, arguments_);
	const resolved = ResolveTarget(context, target, arguments_);
	const name = resolved[0];
	const type = resolved[1];
	return IsGeneric(type) ? IsTailCall(state, name) ? CallConstruct(Ref$1(name), instantiatedArguments) : CallImmediate(context, state, Ref$1(name), type.parameters, type.expression, instantiatedArguments) : CallConstruct(target, instantiatedArguments);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/types/call.mjs
function CallConstruct(target, arguments_) {
	return Create({ ["~kind"]: "Call" }, {
		target,
		arguments: arguments_
	}, {});
}
/** Returns true if the given type is a TCall. */
function IsCall(value) {
	return IsKind(value, "Call");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/intrinsics/mapping.mjs
function ApplyMapping(mapping, value) {
	return mapping(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/intrinsics/from_literal.mjs
function FromLiteral$2(mapping, value) {
	return IsString$2(value) ? Literal$1(ApplyMapping(mapping, value)) : Literal$1(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/intrinsics/from_template_literal.mjs
function FromTemplateLiteral$2(mapping, pattern) {
	return FromType$11(mapping, TemplateLiteralDecode(pattern));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/intrinsics/from_union.mjs
function FromUnion$6(mapping, types) {
	return Union(types.map((type) => FromType$11(mapping, type)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/intrinsics/from_type.mjs
function FromType$11(mapping, type) {
	return IsLiteral(type) ? FromLiteral$2(mapping, type.const) : IsTemplateLiteral(type) ? FromTemplateLiteral$2(mapping, type.pattern) : IsUnion(type) ? FromUnion$6(mapping, type.anyOf) : type;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/capitalize.mjs
/** Creates a deferred Capitalize action. */
function CapitalizeDeferred(type, options = {}) {
	return Deferred("Capitalize", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/lowercase.mjs
/** Creates a deferred Lowercase action. */
function LowercaseDeferred(type, options = {}) {
	return Deferred("Lowercase", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/uncapitalize.mjs
/** Creates a deferred Uncapitalize action. */
function UncapitalizeDeferred(type, options = {}) {
	return Deferred("Uncapitalize", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/uppercase.mjs
/** Creates a deferred Uppercase action. */
function UppercaseDeferred(type, options = {}) {
	return Deferred("Uppercase", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/intrinsics/instantiate.mjs
const CapitalizeMapping = (input) => input[0].toUpperCase() + input.slice(1);
const LowercaseMapping = (input) => input.toLowerCase();
const UncapitalizeMapping = (input) => input[0].toLowerCase() + input.slice(1);
const UppercaseMapping = (input) => input.toUpperCase();
function CapitalizeAction(type, options) {
	return CanInstantiate([type]) ? Update(FromType$11(CapitalizeMapping, type), {}, options) : CapitalizeDeferred(type, options);
}
function LowercaseAction(type, options) {
	return CanInstantiate([type]) ? Update(FromType$11(LowercaseMapping, type), {}, options) : LowercaseDeferred(type, options);
}
function UncapitalizeAction(type, options) {
	return CanInstantiate([type]) ? Update(FromType$11(UncapitalizeMapping, type), {}, options) : UncapitalizeDeferred(type, options);
}
function UppercaseAction(type, options) {
	return CanInstantiate([type]) ? Update(FromType$11(UppercaseMapping, type), {}, options) : UppercaseDeferred(type, options);
}
function CapitalizeInstantiate(context, state, type, options) {
	return CapitalizeAction(InstantiateType(context, state, type), options);
}
function LowercaseInstantiate(context, state, type, options) {
	return LowercaseAction(InstantiateType(context, state, type), options);
}
function UncapitalizeInstantiate(context, state, type, options) {
	return UncapitalizeAction(InstantiateType(context, state, type), options);
}
function UppercaseInstantiate(context, state, type, options) {
	return UppercaseAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/conditional.mjs
/** Creates a deferred Conditional action. */
function ConditionalDeferred(left, right, true_, false_, options = {}) {
	return Deferred("Conditional", [
		left,
		right,
		true_,
		false_
	], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/conditional/instantiate.mjs
function ConditionalOperation(context, state, left, right, true_, false_) {
	const extendsResult = Extends(context, left, right);
	return IsExtendsUnion(extendsResult) ? Union([InstantiateType(extendsResult.inferred, state, true_), InstantiateType(context, state, false_)]) : IsExtendsTrue(extendsResult) ? InstantiateType(extendsResult.inferred, state, true_) : InstantiateType(context, state, false_);
}
function ConditionalAction(context, state, left, right, true_, false_, options) {
	return CanInstantiate([left, right]) ? Update(ConditionalOperation(context, state, left, right, true_, false_), {}, options) : ConditionalDeferred(left, right, true_, false_, options);
}
function ConditionalInstantiate(context, state, left, right, true_, false_, options) {
	return ConditionalAction(context, state, InstantiateType(context, state, left), InstantiateType(context, state, right), true_, false_, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/constructor_parameters.mjs
/** Creates a deferred ConstructorParameters action. */
function ConstructorParametersDeferred(type, options = {}) {
	return Deferred("ConstructorParameters", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/constructor_parameters/instantiate.mjs
function ConstructorParametersOperation(type) {
	return Tuple$1(InstantiateElements({}, { callstack: [] }, IsConstructor(type) ? type["parameters"] : []));
}
function ConstructorParametersAction(type, options) {
	return CanInstantiate([type]) ? Update(ConstructorParametersOperation(type), {}, options) : ConstructorParametersDeferred(type, options);
}
function ConstructorParametersInstantiate(context, state, type, options) {
	return ConstructorParametersAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/exclude.mjs
/** Creates a deferred Exclude action. */
function ExcludeDeferred(left, right, options = {}) {
	return Deferred("Exclude", [left, right], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/exclude/operation.mjs
function ExcludeUnionLeft(types, right) {
	return types.reduce((result, head) => {
		return [...result, ...ExcludeTypeLeft(head, right)];
	}, []);
}
function ExcludeTypeLeft(left, right) {
	return IsExtendsTrueLike(Extends({}, left, right)) ? [] : [left];
}
function ExcludeOperation(left, right) {
	return EvaluateUnion(IsEnum$1(left) ? ExcludeUnionLeft(EnumValuesToVariants(left.enum), right) : IsUnion(left) ? ExcludeUnionLeft(Flatten(left.anyOf), right) : ExcludeTypeLeft(left, right));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/exclude/instantiate.mjs
function ExcludeAction(left, right, options) {
	return CanInstantiate([left, right]) ? Update(ExcludeOperation(left, right), {}, options) : ExcludeDeferred(left, right, options);
}
function ExcludeInstantiate(context, state, left, right, options) {
	return ExcludeAction(InstantiateType(context, state, left), InstantiateType(context, state, right), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/extract.mjs
/** Creates a deferred Extract action. */
function ExtractDeferred(left, right, options = {}) {
	return Deferred("Extract", [left, right], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/extract/operation.mjs
function ExtractUnionLeft(types, right) {
	return types.reduce((result, head) => {
		return [...result, ...ExtractTypeLeft(head, right)];
	}, []);
}
function ExtractTypeLeft(left, right) {
	return IsExtendsTrueLike(Extends({}, left, right)) ? [left] : [];
}
function ExtractOperation(left, right) {
	return EvaluateUnion(IsEnum$1(left) ? ExtractUnionLeft(EnumValuesToVariants(left.enum), right) : IsUnion(left) ? ExtractUnionLeft(Flatten(left.anyOf), right) : ExtractTypeLeft(left, right));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/extract/instantiate.mjs
function ExtractAction(left, right, options) {
	return CanInstantiate([left, right]) ? Update(ExtractOperation(left, right), {}, options) : ExtractDeferred(left, right, options);
}
function ExtractInstantiate(context, state, left, right, options) {
	return ExtractAction(InstantiateType(context, state, left), InstantiateType(context, state, right), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/indexed.mjs
/** Creates a deferred Index action. */
function IndexDeferred(type, indexer, options = {}) {
	return Deferred("Index", [type, indexer], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/object/from_cyclic.mjs
function FromCyclic$4(defs, ref) {
	return FromType$10(CyclicTarget(defs, ref));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/object/from_intersect.mjs
function CollapseIntersectProperties(left, right) {
	const leftKeys = Keys(left).filter((key) => !HasPropertyKey(right, key));
	const rightKeys = Keys(right).filter((key) => !HasPropertyKey(left, key));
	const sharedKeys = Keys(left).filter((key) => HasPropertyKey(right, key));
	const leftProperties = leftKeys.reduce((result, key) => ({
		...result,
		[key]: left[key]
	}), {});
	const rightProperties = rightKeys.reduce((result, key) => ({
		...result,
		[key]: right[key]
	}), {});
	const sharedProperties = sharedKeys.reduce((result, key) => ({
		...result,
		[key]: EvaluateIntersect([left[key], right[key]])
	}), {});
	return Assign(Assign(leftProperties, rightProperties), sharedProperties);
}
function FromIntersect$4(types) {
	return types.reduce((result, left) => {
		return CollapseIntersectProperties(result, FromType$10(left));
	}, {});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/object/from_object.mjs
function FromObject$6(properties) {
	return properties;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/object/from_tuple.mjs
function FromTuple$3(types) {
	return FromType$10(TupleToObject(Tuple$1(types)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/object/from_union.mjs
function CollapseUnionProperties(left, right) {
	return Keys(left).filter((key) => key in right).reduce((result, key) => {
		return {
			...result,
			[key]: EvaluateUnion([left[key], right[key]])
		};
	}, {});
}
function ReduceVariants(types, result) {
	return TakeLeft(types, (left, right) => ReduceVariants(right, CollapseUnionProperties(result, FromType$10(left))), () => result);
}
function FromUnion$5(types) {
	return TakeLeft(types, (left, right) => ReduceVariants(right, FromType$10(left)), () => Unreachable$1());
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/object/from_type.mjs
function FromType$10(type) {
	return IsCyclic(type) ? FromCyclic$4(type.$defs, type.$ref) : IsIntersect(type) ? FromIntersect$4(type.allOf) : IsUnion(type) ? FromUnion$5(type.anyOf) : IsTuple(type) ? FromTuple$3(type.items) : IsObject(type) ? FromObject$6(type.properties) : {};
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/object/collapse.mjs
/**
* Collapses a type into a TObject schema. This is a lossy fast path used to
* normalize arbitrary TSchema types into a TObject structure. This function is
* primarily used in indexing operations where a normalized object structure
* is required. If the type cannot be collapsed, an empty object schema is returned.
*/
function CollapseToObject(type) {
	return _Object_$1(FromType$10(type));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/helpers/keys.mjs
const integerKeyPattern = /* @__PURE__ */ new RegExp("^(?:0|[1-9][0-9]*)$");
function ConvertToIntegerKey(value) {
	const normal = `${value}`;
	return integerKeyPattern.test(normal) ? parseInt(normal) : value;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexed/from_array.mjs
function NormalizeLiteral(value) {
	return Literal$1(ConvertToIntegerKey(value));
}
function NormalizeIndexerTypes(types) {
	return types.map((type) => NormalizeIndexer(type));
}
function NormalizeIndexer(type) {
	return IsIntersect(type) ? Intersect(NormalizeIndexerTypes(type.allOf)) : IsUnion(type) ? Union(NormalizeIndexerTypes(type.anyOf)) : IsLiteral(type) ? NormalizeLiteral(type.const) : type;
}
function FromArray$3(type, indexer) {
	return IsExtendsTrueLike(Extends({}, NormalizeIndexer(indexer), Number$2())) ? type : IsLiteral(indexer) && IsEqual(indexer.const, "length") ? Number$2() : Never();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/from_cyclic.mjs
function FromCyclic$3(defs, ref) {
	return FromType$9(CyclicTarget(defs, ref));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/from_union.mjs
function FromUnion$4(types) {
	return types.reduce((result, left) => {
		return [...result, ...FromType$9(left)];
	}, []);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/from_enum.mjs
function FromEnum(values) {
	return FromUnion$4(EnumValuesToVariants(values));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/from_intersect.mjs
function FromIntersect$3(types) {
	return FromType$9(EvaluateIntersect(types));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/from_literal.mjs
function FromLiteral$1(value) {
	return [`${value}`];
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/from_template_literal.mjs
function FromTemplateLiteral$1(pattern) {
	return FromType$9(TemplateLiteralDecode(pattern));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/from_type.mjs
function FromType$9(type) {
	return IsCyclic(type) ? FromCyclic$3(type.$defs, type.$ref) : IsEnum$1(type) ? FromEnum(type.enum) : IsIntersect(type) ? FromIntersect$3(type.allOf) : IsLiteral(type) ? FromLiteral$1(type.const) : IsTemplateLiteral(type) ? FromTemplateLiteral$1(type.pattern) : IsUnion(type) ? FromUnion$4(type.anyOf) : [];
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/to_indexable_keys.mjs
/**
* Transforms a type meant as an Indexer into string[] array which is used by Indexable types
* like Index, Pick and Omit to select from property keys. This function should only be used
* for Object key selection, and not for Array / Tuple key selection as Array-Like structures
* require TNumber indexing support.
*/
function ToIndexableKeys(type) {
	return FromType$9(type);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/this/expand_this.mjs
function FromTypes(properties, types) {
	return types.map((type) => FromType$8(properties, type));
}
function FromType$8(properties, type) {
	return IsArray(type) ? _Array_(FromType$8(properties, type.items)) : IsAsyncIterator(type) ? AsyncIterator(FromType$8(properties, type.iteratorItems)) : IsConstructor(type) ? Constructor$1(FromTypes(properties, type.parameters), FromType$8(properties, type.instanceType)) : IsFunction(type) ? _Function_$1(FromTypes(properties, type.parameters), FromType$8(properties, type.returnType)) : IsIterator(type) ? Iterator(FromType$8(properties, type.iteratorItems)) : IsPromise(type) ? _Promise_(FromType$8(properties, type.item)) : IsTuple(type) ? Tuple$1(FromTypes(properties, type.items)) : IsUnion(type) ? Union(FromTypes(properties, type.anyOf)) : IsIntersect(type) ? Intersect(FromTypes(properties, type.allOf)) : IsThis(type) ? _Object_$1(properties) : type;
}
function ExpandThis(properties, type) {
	return FromType$8(properties, type);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexed/from_object.mjs
function IndexProperty(properties, key) {
	return ExpandThis(properties, key in properties ? properties[key] : Never());
}
function IndexProperties(properties, keys) {
	return keys.reduce((result, left) => {
		return [...result, IndexProperty(properties, left)];
	}, []);
}
function FromIndexer(properties, indexer) {
	return EvaluateUnion(IndexProperties(properties, ToIndexableKeys(indexer)));
}
const NumericKeyPattern = new RegExp(IntegerKey);
function NumericKeys(keys) {
	return keys.filter((key) => NumericKeyPattern.test(key));
}
function FromIndexerNumber(properties) {
	return EvaluateUnion(IndexProperties(properties, NumericKeys(PropertyKeys(properties))));
}
function FromObject$5(properties, indexer) {
	return IsNumber(indexer) ? FromIndexerNumber(properties) : FromIndexer(properties, indexer);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexed/array_indexer.mjs
function ConvertLiteral(value) {
	return Literal$1(ConvertToIntegerKey(value));
}
function ArrayIndexerTypes(types) {
	return types.map((type) => FormatArrayIndexer(type));
}
/** Formats embedded integer-like strings on an Indexer to be number values inline with TS indexing | coercion behaviors. */
function FormatArrayIndexer(type) {
	return IsIntersect(type) ? Intersect(ArrayIndexerTypes(type.allOf)) : IsUnion(type) ? Union(ArrayIndexerTypes(type.anyOf)) : IsLiteral(type) ? ConvertLiteral(type.const) : type;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexed/from_tuple.mjs
function IndexElementsWithIndexer(types, indexer) {
	return types.reduceRight((result, right, index) => {
		return IsExtendsTrueLike(Extends({}, Literal$1(index), indexer)) ? [right, ...result] : result;
	}, []);
}
function FromTupleWithIndexer(types, indexer) {
	return EvaluateUnionFast(IndexElementsWithIndexer(types, FormatArrayIndexer(indexer)));
}
function FromTupleWithoutIndexer(types) {
	return EvaluateUnionFast(types);
}
function FromTuple$2(types, indexer) {
	return IsLiteral(indexer) && IsEqual(indexer.const, "length") ? Literal$1(types.length) : IsNumber(indexer) || IsInteger(indexer) ? FromTupleWithoutIndexer(types) : FromTupleWithIndexer(types, indexer);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexed/from_type.mjs
function FromType$7(type, indexer) {
	return IsArray(type) ? FromArray$3(type.items, indexer) : IsObject(type) ? FromObject$5(type.properties, indexer) : IsTuple(type) ? FromTuple$2(type.items, indexer) : Never();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexed/instantiate.mjs
function NormalizeType$1(type) {
	return IsCyclic(type) || IsIntersect(type) || IsUnion(type) ? CollapseToObject(type) : type;
}
function IndexAction(type, indexer, options) {
	return CanInstantiate([type, indexer]) ? Update(FromType$7(NormalizeType$1(type), indexer), {}, options) : IndexDeferred(type, indexer, options);
}
function IndexInstantiate(context, state, type, indexer, options) {
	return IndexAction(InstantiateType(context, state, type), InstantiateType(context, state, indexer), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/instance_type.mjs
/** Creates a deferred InstanceType action. */
function InstanceTypeDeferred(type, options = {}) {
	return Deferred("InstanceType", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/instance_type/instantiate.mjs
function InstanceTypeOperation(type) {
	return IsConstructor(type) ? type["instanceType"] : Never();
}
function InstanceTypeAction(type, options) {
	return CanInstantiate([type]) ? Update(InstanceTypeOperation(type), {}, options) : InstanceTypeDeferred(type, options);
}
function InstanceTypeInstantiate(context, state, type, options = {}) {
	return InstanceTypeAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/keyof.mjs
/** Creates a deferred KeyOf action. */
function KeyOfDeferred(type, options = {}) {
	return Deferred("KeyOf", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/keyof/from_any.mjs
function FromAny() {
	return Union([
		Number$2(),
		String$2(),
		Symbol$1()
	]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/keyof/from_array.mjs
function FromArray$2(_type) {
	return Number$2();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/keyof/from_object.mjs
function FromPropertyKeys(keys) {
	return keys.reduce((result, left) => {
		return IsLiteralValue(left) ? [...result, Literal$1(ConvertToIntegerKey(left))] : Unreachable$1();
	}, []);
}
function FromObject$4(properties) {
	return EvaluateUnionFast(FromPropertyKeys(Keys(properties)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/keyof/from_record.mjs
function FromRecord(type) {
	return RecordKey(type);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/keyof/from_tuple.mjs
function FromTuple$1(types) {
	return EvaluateUnionFast(types.map((_, index) => Literal$1(index)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/keyof/from_type.mjs
function FromType$6(type) {
	return IsAny(type) ? FromAny() : IsArray(type) ? FromArray$2(type.items) : IsObject(type) ? FromObject$4(type.properties) : IsRecord(type) ? FromRecord(type) : IsTuple(type) ? FromTuple$1(type.items) : Never();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/keyof/instantiate.mjs
function NormalizeType(type) {
	return IsCyclic(type) || IsIntersect(type) || IsUnion(type) ? CollapseToObject(type) : type;
}
function KeyOfAction(type, options) {
	return CanInstantiate([type]) ? Update(FromType$6(NormalizeType(type)), {}, options) : KeyOfDeferred(type, options);
}
function KeyOfInstantiate(context, state, type, options) {
	return KeyOfAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/mapped.mjs
/** Creates a deferred Mapped action. */
function MappedDeferred(identifier, type, as, property, options = {}) {
	return Deferred("Mapped", [
		identifier,
		type,
		as,
		property
	], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/mapped/mapped_variants.mjs
function FromTemplateLiteral(pattern) {
	return FromType$5(TemplateLiteralDecode(pattern));
}
function FromUnion$3(types) {
	return types.reduce((result, left) => {
		return [...result, ...FromType$5(left)];
	}, []);
}
function FromLiteral(value) {
	return IsNumber$2(value) ? [Literal$1(`${value}`)] : [Literal$1(value)];
}
function FromType$5(type) {
	return IsEnum$1(type) ? FromUnion$3(EnumValuesToVariants(type.enum)) : IsLiteral(type) ? FromLiteral(type.const) : IsTemplateLiteral(type) ? FromTemplateLiteral(type.pattern) : IsUnion(type) ? FromUnion$3(type.anyOf) : [type];
}
function MappedVariants(type) {
	return FromType$5(type);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/mapped/mapped_operation.mjs
function CanonicalAs(instantiatedAs) {
	return IsTemplateLiteral(instantiatedAs) ? TemplateLiteralDecode(instantiatedAs.pattern) : instantiatedAs;
}
function MappedVariant(context, state, identifier, variant, as, property) {
	const variantContext = Assign(context, { [identifier["name"]]: variant });
	const canonicalAs = CanonicalAs(InstantiateType(variantContext, state, as));
	const instantiatedProperty = InstantiateType(variantContext, state, property);
	return IsLiteralNumber(canonicalAs) || IsLiteralString(canonicalAs) ? { [canonicalAs.const]: instantiatedProperty } : {};
}
function MappedProperties(context, state, identifier, variants, as, property) {
	return variants.reduce((result, left) => {
		return [...result, MappedVariant(context, state, identifier, left, as, property)];
	}, []);
}
function MappedObjects(properties) {
	return properties.reduce((result, left) => {
		return [...result, _Object_$1(left)];
	}, []);
}
function MappedOperation(context, state, identifier, type, as, property) {
	return EvaluateIntersect(MappedObjects(MappedProperties(context, state, identifier, MappedVariants(type), as, property)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/mapped/instantiate.mjs
function MappedAction(context, state, identifier, type, as, property, options) {
	return CanInstantiate([type]) ? Update(MappedOperation(context, state, identifier, type, as, property), {}, options) : MappedDeferred(identifier, type, as, property, options);
}
function MappedInstantiate(context, state, identifier, type, as, property, options) {
	return MappedAction(context, state, identifier, InstantiateType(context, state, type), as, property, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/module/instantiate.mjs
function InstantiateCyclics(context, cyclicKeys) {
	return Keys(context).filter((key) => cyclicKeys.includes(key)).reduce((result, key) => {
		return {
			...result,
			[key]: InstantiateCyclic(context, key, context[key])
		};
	}, {});
}
function InstantiateNonCyclics(context, cyclicKeys) {
	return Keys(context).filter((key) => !cyclicKeys.includes(key)).reduce((result, key) => {
		return {
			...result,
			[key]: InstantiateType(context, { callstack: [] }, context[key])
		};
	}, {});
}
function InstantiateModule(context, options) {
	const cyclicCandidates = CyclicCandidates(context);
	const instantiatedCyclics = InstantiateCyclics(context, cyclicCandidates);
	const instantiatedNonCyclics = InstantiateNonCyclics(context, cyclicCandidates);
	return Update({
		...instantiatedCyclics,
		...instantiatedNonCyclics
	}, {}, options);
}
function ModuleInstantiate(context, _state, properties, options) {
	return InstantiateModule(Assign(context, properties), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/non_nullable.mjs
/** Creates a deferred NonNullable action. */
function NonNullableDeferred(type, options = {}) {
	return Deferred("NonNullable", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/non_nullable/instantiate.mjs
function NonNullableOperation(type) {
	return ExcludeAction(type, Union([Null(), Undefined()]), {});
}
function NonNullableAction(type, options) {
	return CanInstantiate([type]) ? Update(NonNullableOperation(type), {}, options) : NonNullableDeferred(type, options);
}
function NonNullableInstantiate(context, state, type, options) {
	return NonNullableAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/omit.mjs
/** Creates a deferred Omit action. */
function OmitDeferred(type, indexer, options = {}) {
	return Deferred("Omit", [type, indexer], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/indexable/to_indexable.mjs
/** Transforms a type into a TProperties used for indexing operations */
function ToIndexable(type) {
	const collapsed = CollapseToObject(type);
	return IsObject(collapsed) ? collapsed.properties : Unreachable$1();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/omit/from_type.mjs
function FromKeys$1(properties, keys) {
	return Keys(properties).reduce((result, key) => {
		return keys.includes(key) ? result : {
			...result,
			[key]: properties[key]
		};
	}, {});
}
function FromType$4(type, indexer) {
	return _Object_$1(FromKeys$1(ToIndexable(type), ToIndexableKeys(indexer)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/omit/instantiate.mjs
function OmitAction(type, indexer, options) {
	return CanInstantiate([type, indexer]) ? Update(FromType$4(type, indexer), {}, options) : OmitDeferred(type, indexer, options);
}
function OmitInstantiate(context, state, type, indexer, options) {
	return OmitAction(InstantiateType(context, state, type), InstantiateType(context, state, indexer), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/options.mjs
/** Creates a deferred Options action. */
function OptionsDeferred(type, options) {
	return Deferred("Options", [type, options], {});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/options/instantiate.mjs
function OptionsAction(type, options) {
	return CanInstantiate([type]) ? Update(type, {}, options) : OptionsDeferred(type, options);
}
function OptionsInstantiate(context, state, type, options) {
	return OptionsAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/parameters.mjs
/** Creates a deferred Parameters action. */
function ParametersDeferred(type, options = {}) {
	return Deferred("Parameters", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/parameters/instantiate.mjs
function ParametersOperation(type) {
	return Tuple$1(InstantiateElements({}, { callstack: [] }, IsFunction(type) ? type["parameters"] : []));
}
function ParametersAction(type, options) {
	return CanInstantiate([type]) ? Update(ParametersOperation(type), {}, options) : ParametersDeferred(type, options);
}
function ParametersInstantiate(context, state, type, options) {
	return ParametersAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/partial.mjs
/** Creates a deferred Partial action. */
function PartialDeferred(type, options = {}) {
	return Deferred("Partial", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/partial/from_cyclic.mjs
function FromCyclic$2(defs, ref) {
	const partial = FromType$3(CyclicTarget(defs, ref));
	return Cyclic(Assign(defs, { [ref]: partial }), ref);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/partial/from_intersect.mjs
function FromIntersect$2(types) {
	return EvaluateIntersect(types.map((type) => FromType$3(type)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/partial/from_union.mjs
function FromUnion$2(types) {
	return Union(types.map((type) => FromType$3(type)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/partial/from_object.mjs
function FromObject$3(properties) {
	return _Object_$1(Keys(properties).reduce((result, left) => {
		return {
			...result,
			[left]: Optional$2(properties[left])
		};
	}, {}));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/partial/from_type.mjs
function FromType$3(type) {
	return IsCyclic(type) ? FromCyclic$2(type.$defs, type.$ref) : IsIntersect(type) ? FromIntersect$2(type.allOf) : IsUnion(type) ? FromUnion$2(type.anyOf) : IsObject(type) ? FromObject$3(type.properties) : _Object_$1({});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/partial/instantiate.mjs
function PartialAction(type, options) {
	return CanInstantiate([type]) ? Update(FromType$3(type), {}, options) : PartialDeferred(type, options);
}
function PartialInstantiate(context, state, type, options) {
	return PartialAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/pick.mjs
/** Creates a deferred Pick action. */
function PickDeferred(type, indexer, options = {}) {
	return Deferred("Pick", [type, indexer], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/pick/from_type.mjs
function FromKeys(properties, keys) {
	return Keys(properties).reduce((result, key) => {
		return keys.includes(key) ? Assign(result, { [key]: properties[key] }) : result;
	}, {});
}
function FromType$2(type, indexer) {
	return _Object_$1(FromKeys(ToIndexable(type), ToIndexableKeys(indexer)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/pick/instantiate.mjs
function PickAction(type, indexer, options) {
	return CanInstantiate([type, indexer]) ? Update(FromType$2(type, indexer), {}, options) : PickDeferred(type, indexer, options);
}
function PickInstantiate(context, state, type, indexer, options) {
	return PickAction(InstantiateType(context, state, type), InstantiateType(context, state, indexer), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/readonly_object.mjs
/** Creates a deferred ReadonlyType action. */
function ReadonlyObjectDeferred(type, options = {}) {
	return Deferred("ReadonlyObject", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/readonly_object/from_array.mjs
function FromArray$1(type) {
	return Immutable(_Array_(type));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/readonly_object/from_cyclic.mjs
function FromCyclic$1(defs, ref) {
	const partial = FromType$1(CyclicTarget(defs, ref));
	return Cyclic(Assign(defs, { [ref]: partial }), ref);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/readonly_object/from_intersect.mjs
function FromIntersect$1(types) {
	return EvaluateIntersect(types.map((type) => FromType$1(type)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/readonly_object/from_object.mjs
function FromObject$2(properties) {
	return _Object_$1(Keys(properties).reduce((result, left) => {
		return {
			...result,
			[left]: Readonly$1(properties[left])
		};
	}, {}));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/readonly_object/from_tuple.mjs
function FromTuple(types) {
	return Immutable(Tuple$1(types));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/readonly_object/from_union.mjs
function FromUnion$1(types) {
	return Union(types.map((type) => FromType$1(type)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/readonly_object/from_type.mjs
function FromType$1(type) {
	return IsArray(type) ? FromArray$1(type.items) : IsCyclic(type) ? FromCyclic$1(type.$defs, type.$ref) : IsIntersect(type) ? FromIntersect$1(type.allOf) : IsObject(type) ? FromObject$2(type.properties) : IsTuple(type) ? FromTuple(type.items) : IsUnion(type) ? FromUnion$1(type.anyOf) : type;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/readonly_object/instantiate.mjs
function ReadonlyObjectAction(type, options) {
	return CanInstantiate([type]) ? Update(FromType$1(type), {}, options) : ReadonlyObjectDeferred(type);
}
function ReadonlyObjectInstantiate(context, state, type, options) {
	return ReadonlyObjectAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/ref/instantiate.mjs
function RefInstantiate(context, state, type, ref) {
	return ref in context ? CyclicCheck([ref], context, context[ref]) ? type : InstantiateType(context, state, context[ref]) : type;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/required/from_cyclic.mjs
function FromCyclic(defs, ref) {
	const partial = FromType(CyclicTarget(defs, ref));
	return Cyclic(Assign(defs, { [ref]: partial }), ref);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/required/from_intersect.mjs
function FromIntersect(types) {
	return EvaluateIntersect(types.map((type) => FromType(type)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/required/from_union.mjs
function FromUnion(types) {
	return Union(types.map((type) => FromType(type)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/required/from_object.mjs
function FromObject$1(properties) {
	return _Object_$1(Keys(properties).reduce((result, left) => {
		return {
			...result,
			[left]: OptionalRemove(properties[left])
		};
	}, {}));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/required/from_type.mjs
function FromType(type) {
	return IsCyclic(type) ? FromCyclic(type.$defs, type.$ref) : IsIntersect(type) ? FromIntersect(type.allOf) : IsUnion(type) ? FromUnion(type.anyOf) : IsObject(type) ? FromObject$1(type.properties) : _Object_$1({});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/required.mjs
/** Creates a deferred Required action. */
function RequiredDeferred(type, options = {}) {
	return Deferred("Required", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/required/instantiate.mjs
function RequiredAction(type, options) {
	return CanInstantiate([type]) ? Update(FromType(type), {}, options) : RequiredDeferred(type, options);
}
function RequiredInstantiate(context, state, type, options) {
	return RequiredAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/return_type.mjs
/** Creates a deferred ReturnType action. */
function ReturnTypeDeferred(type, options = {}) {
	return Deferred("ReturnType", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/return_type/instantiate.mjs
function ReturnTypeOperation(type) {
	return IsFunction(type) ? type["returnType"] : Never();
}
function ReturnTypeAction(type, options) {
	return CanInstantiate([type]) ? Update(ReturnTypeOperation(type), {}, options) : ReturnTypeDeferred(type, options);
}
function ReturnTypeInstantiate(context, state, type, options = {}) {
	return ReturnTypeAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/rest/spread.mjs
function SpreadElement(type) {
	return IsRest(type) ? IsTuple(type.items) ? RestSpread(type.items.items) : IsInfer(type.items) ? [type] : IsRef$1(type.items) ? [type] : [Never()] : [type];
}
function RestSpread(types) {
	return types.reduce((result, left) => {
		return [...result, ...SpreadElement(left)];
	}, []);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/instantiate.mjs
function CanInstantiate(types) {
	return TakeLeft(types, (left, right) => IsRef$1(left) ? false : CanInstantiate(right), () => true);
}
function ModifierActions(type, readonly, optional) {
	return IsReadonlyRemoveAction(type) ? ModifierActions(type.type, "remove", optional) : IsOptionalRemoveAction(type) ? ModifierActions(type.type, readonly, "remove") : IsReadonlyAddAction(type) ? ModifierActions(type.type, "add", optional) : IsOptionalAddAction(type) ? ModifierActions(type.type, readonly, "add") : [
		type,
		readonly,
		optional
	];
}
function ApplyReadonly(action, type) {
	return IsEqual(action, "remove") ? ReadonlyRemove(type) : IsEqual(action, "add") ? ReadonlyAdd(type) : type;
}
function ApplyOptional(action, type) {
	return IsEqual(action, "remove") ? OptionalRemove(type) : IsEqual(action, "add") ? OptionalAdd(type) : type;
}
function InstantiateProperties(context, state, properties) {
	return Keys(properties).reduce((result, key) => {
		return {
			...result,
			[key]: InstantiateType(context, state, properties[key])
		};
	}, {});
}
function InstantiateElements(context, state, types) {
	return RestSpread(InstantiateTypes(context, state, types));
}
function InstantiateTypes(context, state, types) {
	return types.map((type) => InstantiateType(context, state, type));
}
function InstantiateDeferred(context, state, action, parameters, options) {
	return IsEqual(action, "Awaited") ? AwaitedInstantiate(context, state, parameters[0], options) : IsEqual(action, "Capitalize") ? CapitalizeInstantiate(context, state, parameters[0], options) : IsEqual(action, "Conditional") ? ConditionalInstantiate(context, state, parameters[0], parameters[1], parameters[2], parameters[3], options) : IsEqual(action, "ConstructorParameters") ? ConstructorParametersInstantiate(context, state, parameters[0], options) : IsEqual(action, "Evaluate") ? EvaluateInstantiate(context, state, parameters[0], options) : IsEqual(action, "Exclude") ? ExcludeInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual(action, "Extract") ? ExtractInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual(action, "Index") ? IndexInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual(action, "InstanceType") ? InstanceTypeInstantiate(context, state, parameters[0], options) : IsEqual(action, "Interface") ? InterfaceInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual(action, "KeyOf") ? KeyOfInstantiate(context, state, parameters[0], options) : IsEqual(action, "Lowercase") ? LowercaseInstantiate(context, state, parameters[0], options) : IsEqual(action, "Mapped") ? MappedInstantiate(context, state, parameters[0], parameters[1], parameters[2], parameters[3], options) : IsEqual(action, "Module") ? ModuleInstantiate(context, state, parameters[0], options) : IsEqual(action, "NonNullable") ? NonNullableInstantiate(context, state, parameters[0], options) : IsEqual(action, "Pick") ? PickInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual(action, "Options") ? OptionsInstantiate(context, state, parameters[0], parameters[1]) : IsEqual(action, "Parameters") ? ParametersInstantiate(context, state, parameters[0], options) : IsEqual(action, "Partial") ? PartialInstantiate(context, state, parameters[0], options) : IsEqual(action, "Omit") ? OmitInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual(action, "ReadonlyObject") ? ReadonlyObjectInstantiate(context, state, parameters[0], options) : IsEqual(action, "Record") ? RecordInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual(action, "Required") ? RequiredInstantiate(context, state, parameters[0], options) : IsEqual(action, "ReturnType") ? ReturnTypeInstantiate(context, state, parameters[0], options) : IsEqual(action, "TemplateLiteral") ? TemplateLiteralInstantiate(context, state, parameters[0], options) : IsEqual(action, "Uncapitalize") ? UncapitalizeInstantiate(context, state, parameters[0], options) : IsEqual(action, "Uppercase") ? UppercaseInstantiate(context, state, parameters[0], options) : Deferred(action, parameters, options);
}
function InstantiateType(context, state, input) {
	const immutable = IsImmutable(input);
	const modifiers = ModifierActions(input, IsReadonly(input) ? "add" : "none", IsOptional(input) ? "add" : "none");
	const type = IsBase(modifiers[0]) ? modifiers[0].Clone() : modifiers[0];
	const instantiated = IsRef$1(type) ? RefInstantiate(context, state, type, type.$ref) : IsArray(type) ? _Array_(InstantiateType(context, state, type.items), ArrayOptions(type)) : IsAsyncIterator(type) ? AsyncIterator(InstantiateType(context, state, type.iteratorItems), AsyncIteratorOptions(type)) : IsCall(type) ? CallInstantiate(context, state, type.target, type.arguments) : IsConstructor(type) ? Constructor$1(InstantiateTypes(context, state, type.parameters), InstantiateType(context, state, type.instanceType), ConstructorOptions(type)) : IsDeferred(type) ? InstantiateDeferred(context, state, type.action, type.parameters, type.options) : IsFunction(type) ? _Function_$1(InstantiateTypes(context, state, type.parameters), InstantiateType(context, state, type.returnType), FunctionOptions(type)) : IsIntersect(type) ? Intersect(InstantiateTypes(context, state, type.allOf), IntersectOptions(type)) : IsIterator(type) ? Iterator(InstantiateType(context, state, type.iteratorItems), IteratorOptions(type)) : IsObject(type) ? _Object_$1(InstantiateProperties(context, state, type.properties), ObjectOptions(type)) : IsPromise(type) ? _Promise_(InstantiateType(context, state, type.item), PromiseOptions(type)) : IsRecord(type) ? RecordFromPattern(RecordPattern(type), InstantiateType(context, state, RecordValue(type))) : IsRest(type) ? Rest(InstantiateType(context, state, type.items)) : IsTuple(type) ? Tuple$1(InstantiateElements(context, state, type.items), TupleOptions(type)) : IsUnion(type) ? Union(InstantiateTypes(context, state, type.anyOf), UnionOptions(type)) : type;
	const withImmutable = immutable ? Immutable(instantiated) : instantiated;
	return ApplyReadonly(modifiers[1], ApplyOptional(modifiers[2], withImmutable));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/engine/awaited/instantiate.mjs
function AwaitedOperation(type) {
	return IsPromise(type) ? AwaitedOperation(type.item) : type;
}
function AwaitedAction(type, options) {
	return CanInstantiate([type]) ? Update(AwaitedOperation(type), {}, options) : AwaitedDeferred(type, options);
}
function AwaitedInstantiate(context, state, type, options) {
	return AwaitedAction(InstantiateType(context, state, type), options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/awaited.mjs
/** Creates a deferred Awaited action. */
function AwaitedDeferred(type, options = {}) {
	return Deferred("Awaited", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/evaluate.mjs
/** Creates a deferred Evaluate action. */
function EvaluateDeferred(type, options = {}) {
	return Deferred("Evaluate", [type], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/action/module.mjs
/** Creates a deferred Module action. */
function ModuleDeferred(context, options = {}) {
	return Deferred("Module", [context], options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/type/script/script.mjs
/** Parses a type from a TypeScript type expression */
function Script(...args) {
	const [context, input, options] = Match$3(args, {
		2: (script, options) => IsString$2(script) ? [
			{},
			script,
			options
		] : [
			script,
			options,
			{}
		],
		3: (context, script, options) => [
			context,
			script,
			options
		],
		1: (script) => [
			{},
			script,
			{}
		]
	});
	const result = Script$1(input);
	return Update(IsArray$1(result) && IsEqual(result.length, 2) ? InstantiateType(context, { callstack: [] }, result[0]) : Never(), {}, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/_guard.mjs
function IsGuardInterface(value) {
	return IsObject$1(value) && HasPropertyKey(value, "check") && HasPropertyKey(value, "errors") && IsFunction$1(value.check) && IsFunction$1(value.errors);
}
function IsGuard(value) {
	return HasPropertyKey(value, "~guard") && IsGuardInterface(value["~guard"]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/_refine.mjs
/**
* Returns true if the schema contains an '~refine` keyword
* @specification None
*/
function IsRefine(value) {
	return HasPropertyKey(value, "~refine") && IsArray$1(value["~refine"]) && Every(value["~refine"], 0, (value) => IsObject$1(value) && HasPropertyKey(value, "check") && HasPropertyKey(value, "error") && IsFunction$1(value.check) && IsFunction$1(value.error));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/schema.mjs
/** Returns true if this value is object like */
function IsSchemaObject(value) {
	return IsObject$1(value) && !IsArray$1(value);
}
/** Returns true if this value is a boolean */
function IsBooleanSchema(value) {
	return IsBoolean$2(value);
}
/** Returns true if this value is schema like */
function IsSchema(value) {
	return IsSchemaObject(value) || IsBooleanSchema(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/additionalItems.mjs
/**
* Returns true if the schema contains a valid additionalItems property
* @specification Json Schema 7
*/
function IsAdditionalItems(schema) {
	return HasPropertyKey(schema, "additionalItems") && IsSchema(schema.additionalItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/additionalProperties.mjs
/**
* Returns true if the schema contains a valid additionalProperties property
* @specification Json Schema 7
*/
function IsAdditionalProperties(schema) {
	return HasPropertyKey(schema, "additionalProperties") && IsSchema(schema.additionalProperties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/allOf.mjs
/**
* Returns true if the schema contains a valid allOf property
* @specification Json Schema 7
*/
function IsAllOf(schema) {
	return HasPropertyKey(schema, "allOf") && IsArray$1(schema.allOf) && schema.allOf.every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/anchor.mjs
/**
* Returns true if the schema contains a valid $anchor property
*/
function IsAnchor(schema) {
	return HasPropertyKey(schema, "$anchor") && IsString$2(schema.$anchor);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/anyOf.mjs
/**
* Returns true if the schema contains a valid anyOf property
* @specification Json Schema 7
*/
function IsAnyOf(schema) {
	return HasPropertyKey(schema, "anyOf") && IsArray$1(schema.anyOf) && schema.anyOf.every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/const.mjs
/**
* Returns true if the schema contains a valid const property
* @specification Json Schema 7
*/
function IsConst(value) {
	return HasPropertyKey(value, "const");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/contains.mjs
/**
* Returns true if the schema contains a valid contains property
* @specification Json Schema 7
*/
function IsContains(schema) {
	return HasPropertyKey(schema, "contains") && IsSchema(schema.contains);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/dependencies.mjs
/**
* Returns true if the schema contains a valid dependencies property
* @specification Json Schema 7
*/
function IsDependencies(schema) {
	return HasPropertyKey(schema, "dependencies") && IsObject$1(schema.dependencies) && Object.values(schema.dependencies).every((value) => IsSchema(value) || IsArray$1(value) && value.every((value) => IsString$2(value)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/dependentRequired.mjs
/**
* Returns true if the schema contains a valid dependentRequired property
* @specification Json Schema 2019-09
*/
function IsDependentRequired(schema) {
	return HasPropertyKey(schema, "dependentRequired") && IsObject$1(schema.dependentRequired) && Object.values(schema.dependentRequired).every((value) => IsArray$1(value) && value.every((value) => IsString$2(value)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/dependentSchemas.mjs
/**
* Returns true if the schema contains a valid dependentRequired property
* @specification Json Schema 2019-09
*/
function IsDependentSchemas(schema) {
	return HasPropertyKey(schema, "dependentSchemas") && IsObject$1(schema.dependentSchemas) && Object.values(schema.dependentSchemas).every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/dynamicAnchor.mjs
/**
* Returns true if the schema contains a valid $dynamicAnchor property
*/
function IsDynamicAnchor(schema) {
	return HasPropertyKey(schema, "$dynamicAnchor") && IsString$2(schema.$dynamicAnchor);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/dynamicRef.mjs
/**
* Returns true if the schema contains a valid $dynamicRef property
*/
function IsDynamicRef(schema) {
	return HasPropertyKey(schema, "$dynamicRef") && IsString$2(schema.$dynamicRef);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/else.mjs
/**
* Returns true if the schema contains a valid else property
* @specification Json Schema 7
*/
function IsElse(schema) {
	return HasPropertyKey(schema, "else") && IsSchema(schema.else);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/enum.mjs
/**
* Returns true if the schema contains a valid enum property
* @specification Json Schema 7
*/
function IsEnum(schema) {
	return HasPropertyKey(schema, "enum") && IsArray$1(schema.enum);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/exclusiveMaximum.mjs
/**
* Returns true if the schema contains a valid exclusiveMaximum property
* @specification Json Schema 7
*/
function IsExclusiveMaximum(schema) {
	return HasPropertyKey(schema, "exclusiveMaximum") && (IsNumber$2(schema.exclusiveMaximum) || IsBigInt$1(schema.exclusiveMaximum));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/exclusiveMinimum.mjs
/**
* Returns true if the schema contains a valid exclusiveMinimum property
* @specification Json Schema 7
*/
function IsExclusiveMinimum(schema) {
	return HasPropertyKey(schema, "exclusiveMinimum") && (IsNumber$2(schema.exclusiveMinimum) || IsBigInt$1(schema.exclusiveMinimum));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/format.mjs
/**
* Returns true if the schema contains a valid format property
* @specification Json Schema 7
*/
function IsFormat(schema) {
	return HasPropertyKey(schema, "format") && IsString$2(schema.format);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/id.mjs
/**
* Returns true if the schema contains a valid $id property
* @specification Json Schema 7
*/
function IsId(schema) {
	return HasPropertyKey(schema, "$id") && IsString$2(schema.$id);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/if.mjs
/**
* Returns true if the schema contains a valid $id property
* @specification Json Schema 7
*/
function IsIf(schema) {
	return HasPropertyKey(schema, "if") && IsSchema(schema.if);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/items.mjs
/**
* Returns true if the schema contains a valid items property
* @specification Json Schema 7
*/
function IsItems(schema) {
	return HasPropertyKey(schema, "items") && (IsSchema(schema.items) || IsArray$1(schema.items) && schema.items.every((value) => {
		return IsSchema(value);
	}));
}
/** Returns true if this schema is a sized items variant */
function IsItemsSized(schema) {
	return IsItems(schema) && IsArray$1(schema.items);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/maximum.mjs
/**
* Returns true if the schema contains a valid maximum property
* @specification Json Schema 7
*/
function IsMaximum(schema) {
	return HasPropertyKey(schema, "maximum") && (IsNumber$2(schema.maximum) || IsBigInt$1(schema.maximum));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/maxContains.mjs
/**
* Returns true if the schema contains a valid maxContains property
* @specification Json Schema 2019-09
*/
function IsMaxContains(schema) {
	return HasPropertyKey(schema, "maxContains") && IsNumber$2(schema.maxContains);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/maxItems.mjs
/**
* Returns true if the schema contains a valid maxItems property
* @specification Json Schema 7
*/
function IsMaxItems(schema) {
	return HasPropertyKey(schema, "maxItems") && IsNumber$2(schema.maxItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/maxLength.mjs
/**
* Returns true if the schema contains a valid maxLength property
* @specification Json Schema 7
*/
function IsMaxLength(schema) {
	return HasPropertyKey(schema, "maxLength") && IsNumber$2(schema.maxLength);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/maxProperties.mjs
/**
* Returns true if the schema contains a valid maxProperties property
* @specification Json Schema 7
*/
function IsMaxProperties(schema) {
	return HasPropertyKey(schema, "maxProperties") && IsNumber$2(schema.maxProperties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/minimum.mjs
/**
* Returns true if the schema contains a valid minimum property
* @specification Json Schema 7
*/
function IsMinimum(schema) {
	return HasPropertyKey(schema, "minimum") && (IsNumber$2(schema.minimum) || IsBigInt$1(schema.minimum));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/minContains.mjs
/**
* Returns true if the schema contains a valid maxContains property
* @specification Json Schema 2019-09
*/
function IsMinContains(schema) {
	return HasPropertyKey(schema, "minContains") && IsNumber$2(schema.minContains);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/minItems.mjs
/**
* Returns true if the schema contains a valid minItems property
* @specification Json Schema 7
*/
function IsMinItems(schema) {
	return HasPropertyKey(schema, "minItems") && IsNumber$2(schema.minItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/minLength.mjs
/**
* Returns true if the schema contains a valid minLength property
* @specification Json Schema 7
*/
function IsMinLength(schema) {
	return HasPropertyKey(schema, "minLength") && IsNumber$2(schema.minLength);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/minProperties.mjs
/**
* Returns true if the schema contains a valid minProperties property
* @specification Json Schema 7
*/
function IsMinProperties(schema) {
	return HasPropertyKey(schema, "minProperties") && IsNumber$2(schema.minProperties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/multipleOf.mjs
/**
* Returns true if the schema contains a valid multipleOf property
* @specification Json Schema 7
*/
function IsMultipleOf(schema) {
	return HasPropertyKey(schema, "multipleOf") && (IsNumber$2(schema.multipleOf) || IsBigInt$1(schema.multipleOf));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/not.mjs
/**
* Returns true if the schema contains a valid not property
* @specification Json Schema 7
*/
function IsNot(schema) {
	return HasPropertyKey(schema, "not") && IsSchema(schema.not);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/oneOf.mjs
/**
* Returns true if the schema contains a valid oneOf property
* @specification Json Schema 7
*/
function IsOneOf(schema) {
	return HasPropertyKey(schema, "oneOf") && IsArray$1(schema.oneOf) && schema.oneOf.every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/pattern.mjs
/**
* Returns true if the schema contains a valid pattern property
* @specification Json Schema 7
*/
function IsPattern(schema) {
	return HasPropertyKey(schema, "pattern") && (IsString$2(schema.pattern) || schema.pattern instanceof RegExp);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/patternProperties.mjs
/**
* Returns true if the schema contains a valid patternProperties property
* @specification Json Schema 7
*/
function IsPatternProperties(schema) {
	return HasPropertyKey(schema, "patternProperties") && IsObject$1(schema.patternProperties) && Object.values(schema.patternProperties).every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/prefixItems.mjs
/**
* Returns true if the schema contains a valid prefixItems property
*/
function IsPrefixItems(schema) {
	return HasPropertyKey(schema, "prefixItems") && IsArray$1(schema.prefixItems) && schema.prefixItems.every((schema) => IsSchema(schema));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/properties.mjs
/**
* Returns true if the schema contains a valid properties property
* @specification Json Schema 7
*/
function IsProperties(schema) {
	return HasPropertyKey(schema, "properties") && IsObject$1(schema.properties) && Object.values(schema.properties).every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/propertyNames.mjs
/**
* Returns true if the schema contains a valid propertyNames property
* @specification Json Schema 7
*/
function IsPropertyNames(schema) {
	return HasPropertyKey(schema, "propertyNames") && (IsObject$1(schema.propertyNames) || IsSchema(schema.propertyNames));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/recursiveAnchor.mjs
/**
* Returns true if the schema contains a valid $recursiveAnchor property
*/
function IsRecursiveAnchor(schema) {
	return HasPropertyKey(schema, "$recursiveAnchor") && IsBoolean$2(schema.$recursiveAnchor);
}
/**
* Returns true if the schema contains a valid $recursiveAnchor property that is true
*/
function IsRecursiveAnchorTrue(schema) {
	return IsRecursiveAnchor(schema) && IsEqual(schema.$recursiveAnchor, true);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/recursiveRef.mjs
/**
* Returns true if the schema contains a valid $recursiveRef property
*/
function IsRecursiveRef(schema) {
	return HasPropertyKey(schema, "$recursiveRef") && IsString$2(schema.$recursiveRef);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/ref.mjs
/**
* Returns true if the schema contains a valid $ref property
* @specification Json Schema 7
*/
function IsRef(schema) {
	return HasPropertyKey(schema, "$ref") && IsString$2(schema.$ref);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/required.mjs
/**
* Returns true if the schema contains a valid required property
* @specification Json Schema 7
*/
function IsRequired(schema) {
	return HasPropertyKey(schema, "required") && IsArray$1(schema.required) && schema.required.every((value) => IsString$2(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/then.mjs
/**
* Returns true if the schema contains a valid then property
* @specification Json Schema 7
*/
function IsThen(schema) {
	return HasPropertyKey(schema, "then") && IsSchema(schema.then);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/type.mjs
/**
* Returns true if the schema contains a valid type property
* @specification Json Schema 7
*/
function IsType(schema) {
	return HasPropertyKey(schema, "type") && (IsString$2(schema.type) || IsArray$1(schema.type) && schema.type.every((value) => IsString$2(value)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/uniqueItems.mjs
/**
* Returns true if the schema contains a valid uniqueItems property
* @specification Json Schema 7
*/
function IsUniqueItems(schema) {
	return HasPropertyKey(schema, "uniqueItems") && IsBoolean$2(schema.uniqueItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/unevaluatedItems.mjs
/**
* Returns true if the schema contains a valid unevaluatedItems property
* @specification Json Schema 2019-09
*/
function IsUnevaluatedItems(schema) {
	return HasPropertyKey(schema, "unevaluatedItems") && IsSchema(schema.unevaluatedItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/types/unevaluatedProperties.mjs
/**
* Returns true if the schema contains a valid unevaluatedProperties property
* @specification Json Schema 2019-09
*/
function IsUnevaluatedProperties(schema) {
	return HasPropertyKey(schema, "unevaluatedProperties") && IsSchema(schema.unevaluatedProperties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/_context.mjs
var CheckContext = class {
	constructor() {
		const indices = /* @__PURE__ */ new Set();
		const keys = /* @__PURE__ */ new Set();
		this.stack = [{
			indices,
			keys
		}];
	}
	Push() {
		const indices = /* @__PURE__ */ new Set();
		const keys = /* @__PURE__ */ new Set();
		this.stack.push({
			indices,
			keys
		});
		return true;
	}
	Pop() {
		this.stack.pop();
		return true;
	}
	AddIndex(index) {
		this.GetIndices().add(index);
		return true;
	}
	AddKey(key) {
		this.GetKeys().add(key);
		return true;
	}
	GetIndices() {
		return this.stack[this.stack.length - 1].indices;
	}
	GetKeys() {
		return this.stack[this.stack.length - 1].keys;
	}
	Merge(results) {
		for (const context of results) {
			context.GetIndices().forEach((value) => this.GetIndices().add(value));
			context.GetKeys().forEach((value) => this.GetKeys().add(value));
		}
		return true;
	}
};
var ErrorContext = class extends CheckContext {
	constructor(callback) {
		super();
		this.callback = callback;
	}
	AddError(error) {
		this.callback(error);
		return false;
	}
};
var AccumulatedErrorContext = class extends ErrorContext {
	constructor() {
		super((error) => this.errors.push(error));
		this.errors = [];
	}
	AddError(error) {
		this.errors.push(error);
		return false;
	}
	GetErrors() {
		return this.errors;
	}
};
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/_guard.mjs
function CheckGuard(_stack, _context, schema, value) {
	return schema["~guard"].check(value);
}
function ErrorGuard(_stack, context, schemaPath, instancePath, schema, value) {
	return schema["~guard"].check(value) || context.AddError({
		keyword: "~guard",
		schemaPath,
		instancePath,
		params: { errors: schema["~guard"].errors(value) }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/_refine.mjs
function CheckRefine(_stack, _context, schema, value) {
	return Every(schema["~refine"], 0, (refinement, _) => refinement.check(value));
}
function ErrorRefine(_stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(schema["~refine"], 0, (refinement, index) => {
		return refinement.check(value) || context.AddError({
			keyword: "~refine",
			schemaPath,
			instancePath,
			params: {
				index,
				message: refinement.error(value)
			}
		});
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/additionalItems.mjs
function IsValid$4(schema) {
	return IsItems(schema) && IsArray$1(schema.items);
}
function CheckAdditionalItems(stack, context, schema, value) {
	if (!IsValid$4(schema)) return true;
	return value.every((item, index) => {
		return IsLessThan(index, schema.items.length) || CheckSchemaPushStack(stack, context, schema.additionalItems, item) && context.AddIndex(index);
	});
}
function ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value) {
	if (!IsValid$4(schema)) return true;
	return value.every((item, index) => {
		const nextSchemaPath = `${schemaPath}/additionalItems`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessThan(index, schema.items.length) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema.additionalItems, item) && context.AddIndex(index);
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/additionalProperties.mjs
function GetPropertyKeyAsPattern(key) {
	return `^${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`;
}
function GetPropertiesPattern(schema) {
	const patterns = [];
	if (IsPatternProperties(schema)) patterns.push(...Keys(schema.patternProperties));
	if (IsProperties(schema)) patterns.push(...Keys(schema.properties).map(GetPropertyKeyAsPattern));
	return IsEqual(patterns.length, 0) ? "(?!)" : `(${patterns.join("|")})`;
}
function CheckAdditionalProperties(stack, context, schema, value) {
	const regexp = new RegExp(GetPropertiesPattern(schema));
	return Every(Keys(value), 0, (key, _index) => {
		return regexp.test(key) || CheckSchemaPushStack(stack, context, schema.additionalProperties, value[key]) && context.AddKey(key);
	});
}
function ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value) {
	const regexp = new RegExp(GetPropertiesPattern(schema));
	const additionalProperties = [];
	return EveryAll(Keys(value), 0, (key, _index) => {
		const nextSchemaPath = `${schemaPath}/additionalProperties`;
		const nextInstancePath = `${instancePath}/${key}`;
		const nextContext = new AccumulatedErrorContext();
		const isAdditionalProperty = regexp.test(key) || ErrorSchemaPushStack(stack, nextContext, nextSchemaPath, nextInstancePath, schema.additionalProperties, value[key]) && context.AddKey(key);
		if (!isAdditionalProperty) additionalProperties.push(key);
		return isAdditionalProperty;
	}) || context.AddError({
		keyword: "additionalProperties",
		schemaPath,
		instancePath,
		params: { additionalProperties }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/allOf.mjs
function CheckAllOf(stack, context, schema, value) {
	const results = schema.allOf.reduce((result, schema) => {
		const nextContext = new CheckContext();
		return CheckSchema(stack, nextContext, schema, value) ? [...result, nextContext] : result;
	}, []);
	return IsEqual(results.length, schema.allOf.length) && context.Merge(results);
}
function ErrorAllOf(stack, context, schemaPath, instancePath, schema, value) {
	const failedContexts = [];
	const results = schema.allOf.reduce((result, schema, index) => {
		const nextSchemaPath = `${schemaPath}/allOf/${index}`;
		const nextContext = new AccumulatedErrorContext();
		const isSchema = ErrorSchema(stack, nextContext, nextSchemaPath, instancePath, schema, value);
		if (!isSchema) failedContexts.push(nextContext);
		return isSchema ? [...result, nextContext] : result;
	}, []);
	const isAllOf = IsEqual(results.length, schema.allOf.length) && context.Merge(results);
	if (!isAllOf) failedContexts.forEach((failed) => failed.GetErrors().forEach((error) => context.AddError(error)));
	return isAllOf;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/anyOf.mjs
function CheckAnyOf(stack, context, schema, value) {
	const results = schema.anyOf.reduce((result, schema) => {
		const nextContext = new CheckContext();
		return CheckSchema(stack, nextContext, schema, value) ? [...result, nextContext] : result;
	}, []);
	return IsGreaterThan(results.length, 0) && context.Merge(results);
}
function ErrorAnyOf(stack, context, schemaPath, instancePath, schema, value) {
	const failedContexts = [];
	const results = schema.anyOf.reduce((result, schema, index) => {
		const nextContext = new AccumulatedErrorContext();
		const isSchema = ErrorSchema(stack, nextContext, `${schemaPath}/anyOf/${index}`, instancePath, schema, value);
		if (!isSchema) failedContexts.push(nextContext);
		return isSchema ? [...result, nextContext] : result;
	}, []);
	const isAnyOf = IsGreaterThan(results.length, 0) && context.Merge(results);
	if (!isAnyOf) failedContexts.forEach((failed) => failed.GetErrors().forEach((error) => context.AddError(error)));
	return isAnyOf || context.AddError({
		keyword: "anyOf",
		schemaPath,
		instancePath,
		params: {}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/boolean.mjs
function CheckBooleanSchema(_stack, _context, schema, _value) {
	return schema;
}
function ErrorBooleanSchema(stack, context, schemaPath, instancePath, schema, value) {
	return CheckBooleanSchema(stack, context, schema, value) || context.AddError({
		keyword: "boolean",
		schemaPath,
		instancePath,
		params: {}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/const.mjs
function CheckConst(_stack, _context, schema, value) {
	return IsValueLike(schema.const) ? IsEqual(value, schema.const) : IsDeepEqual(value, schema.const);
}
function ErrorConst(stack, context, schemaPath, instancePath, schema, value) {
	return CheckConst(stack, context, schema, value) || context.AddError({
		keyword: "const",
		schemaPath,
		instancePath,
		params: { allowedValue: schema.const }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/contains.mjs
function IsValid$3(schema) {
	return !(IsMinContains(schema) && IsEqual(schema.minContains, 0));
}
function CheckContains(stack, context, schema, value) {
	if (!IsValid$3(schema)) return true;
	return !IsEqual(value.length, 0) && value.some((item) => CheckSchema(stack, context, schema.contains, item));
}
function ErrorContains(stack, context, schemaPath, instancePath, schema, value) {
	return CheckContains(stack, context, schema, value) || context.AddError({
		keyword: "contains",
		schemaPath,
		instancePath,
		params: { minContains: 1 }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/dependencies.mjs
function CheckDependencies(stack, context, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEvery = Every(Entries(schema.dependencies), 0, ([key, schema]) => {
		return !HasPropertyKey(value, key) || (IsArray$1(schema) ? schema.every((key) => HasPropertyKey(value, key)) : CheckSchema(stack, context, schema, value));
	});
	return isLength || isEvery;
}
function ErrorDependencies(stack, context, schemaPath, instancePath, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEvery = EveryAll(Entries(schema.dependencies), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/dependencies/${key}`;
		return !HasPropertyKey(value, key) || (IsArray$1(schema) ? schema.every((dependency) => HasPropertyKey(value, dependency) || context.AddError({
			keyword: "dependencies",
			schemaPath,
			instancePath,
			params: {
				property: key,
				dependencies: schema
			}
		})) : ErrorSchema(stack, context, nextSchemaPath, instancePath, schema, value));
	});
	return isLength || isEvery;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/dependentRequired.mjs
function CheckDependentRequired(_stack, _context, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEvery = Every(Entries(schema.dependentRequired), 0, ([key, keys]) => {
		return !HasPropertyKey(value, key) || keys.every((key) => HasPropertyKey(value, key));
	});
	return isLength || isEvery;
}
function ErrorDependentRequired(_stack, context, schemaPath, instancePath, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEveryEntry = EveryAll(Entries(schema.dependentRequired), 0, ([key, keys]) => {
		return !HasPropertyKey(value, key) || EveryAll(keys, 0, (dependency) => HasPropertyKey(value, dependency) || context.AddError({
			keyword: "dependentRequired",
			schemaPath,
			instancePath,
			params: {
				property: key,
				dependencies: keys
			}
		}));
	});
	return isLength || isEveryEntry;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/dependentSchemas.mjs
function CheckDependentSchemas(stack, context, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEvery = Every(Entries(schema.dependentSchemas), 0, ([key, schema]) => {
		return !HasPropertyKey(value, key) || CheckSchema(stack, context, schema, value);
	});
	return isLength || isEvery;
}
function ErrorDependentSchemas(stack, context, schemaPath, instancePath, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEvery = EveryAll(Entries(schema.dependentSchemas), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/dependentSchemas/${key}`;
		return !HasPropertyKey(value, key) || ErrorSchema(stack, context, nextSchemaPath, instancePath, schema, value);
	});
	return isLength || isEvery;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/dynamicRef.mjs
function CheckDynamicRef(stack, context, schema, value) {
	const target = stack.DynamicRef(schema) ?? false;
	return IsSchema(target) && CheckSchema(stack, context, target, value);
}
function ErrorDynamicRef(stack, context, _schemaPath, instancePath, schema, value) {
	const target = stack.DynamicRef(schema) ?? false;
	return IsSchema(target) && ErrorSchema(stack, context, "#", instancePath, target, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/enum.mjs
function CheckEnum(_stack, _context, schema, value) {
	return schema.enum.some((option) => IsValueLike(option) ? IsEqual(value, option) : IsDeepEqual(value, option));
}
function ErrorEnum(stack, context, schemaPath, instancePath, schema, value) {
	return CheckEnum(stack, context, schema, value) || context.AddError({
		keyword: "enum",
		schemaPath,
		instancePath,
		params: { allowedValues: schema.enum }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/exclusiveMaximum.mjs
function CheckExclusiveMaximum(_stack, _context, schema, value) {
	return IsLessThan(value, schema.exclusiveMaximum);
}
function ErrorExclusiveMaximum(stack, context, schemaPath, instancePath, schema, value) {
	return CheckExclusiveMaximum(stack, context, schema, value) || context.AddError({
		keyword: "exclusiveMaximum",
		schemaPath,
		instancePath,
		params: {
			comparison: "<",
			limit: schema.exclusiveMaximum
		}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/exclusiveMinimum.mjs
function CheckExclusiveMinimum(_stack, _context, schema, value) {
	return IsGreaterThan(value, schema.exclusiveMinimum);
}
function ErrorExclusiveMinimum(stack, context, schemaPath, instancePath, schema, value) {
	return CheckExclusiveMinimum(stack, context, schema, value) || context.AddError({
		keyword: "exclusiveMinimum",
		schemaPath,
		instancePath,
		params: {
			comparison: ">",
			limit: schema.exclusiveMinimum
		}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/date.mjs
const DAYS = [
	0,
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
function IsLeapYear(year) {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
/**
* Returns true if the value is a ISO8601 Date component string
* @source ajv-formats
* @example `2020-12-12`
*/
function IsDate(value) {
	const matches = DATE.exec(value);
	if (!matches) return false;
	const year = +matches[1];
	const month = +matches[2];
	const day = +matches[3];
	return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && IsLeapYear(year) ? 29 : DAYS[month]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/time.mjs
const TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(?:Z|([+-])(\d\d):(\d\d))?$/i;
/**
* Returns true if the value is a ISO time string
* @specification
*/
function IsTime(value, strictTimeZone = true) {
	const matches = TIME.exec(value);
	if (!matches) return false;
	const hr = +matches[1];
	const min = +matches[2];
	const sec = +matches[3];
	const tzSign = matches[4] === "-" ? -1 : 1;
	const tzH = +(matches[5] || 0);
	const tzM = +(matches[6] || 0);
	if (tzH > 23 || tzM > 59) return false;
	if (strictTimeZone && !matches[4] && value.toLowerCase().indexOf("z") === -1) return false;
	if (hr <= 23 && min <= 59 && sec < 60) return true;
	const utcMin = min - tzM * tzSign;
	const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
	return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/date_time.mjs
/**
* Returns true if the value is a ISO8601 DateTime string
* @source ajv-formats
* @example `2020-12-12T20:20:40+00:00`
*/
function IsDateTime(value, strictTimeZone = true) {
	const dateTime = value.split(/T/i);
	return dateTime.length === 2 && IsDate(dateTime[0]) && IsTime(dateTime[1], strictTimeZone);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/duration.mjs
const Duration = /^P((\d+Y(\d+M(\d+D)?)?|\d+M(\d+D)?|\d+D)(T(\d+H(\d+M(\d+S)?)?|\d+M(\d+S)?|\d+S))?|T(\d+H(\d+M(\d+S)?)?|\d+M(\d+S)?|\d+S)|\d+W)$/;
/**
* Returns true if the value is a valid ISO-8601 duration.
* @specification https://tools.ietf.org/html/rfc3339
*/
function IsDuration(value) {
	return Duration.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/email.mjs
const Email = /^(?!.*\.\.)[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/**
* Returns true if the value is an Email
* @specification ajv-formats
*/
function IsEmail(value) {
	return Email.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/_puny.mjs
const PUNYCODE_BASE = 36;
const PUNYCODE_TMIN = 1;
const PUNYCODE_TMAX = 26;
const PUNYCODE_SKEW = 38;
const PUNYCODE_DAMP = 700;
const PUNYCODE_INITIAL_BIAS = 72;
const PUNYCODE_INITIAL_N = 128;
function Adapt(delta, numPoints, firstTime) {
	delta = firstTime ? Math.floor(delta / PUNYCODE_DAMP) : delta >> 1;
	delta += Math.floor(delta / numPoints);
	let k = 0;
	while (delta > (PUNYCODE_BASE - PUNYCODE_TMIN) * PUNYCODE_TMAX >> 1) {
		delta = Math.floor(delta / (PUNYCODE_BASE - PUNYCODE_TMIN));
		k += PUNYCODE_BASE;
	}
	return k + Math.floor((PUNYCODE_BASE - PUNYCODE_TMIN + 1) * delta / (delta + PUNYCODE_SKEW));
}
function Decode(value) {
	const output = [];
	let n = PUNYCODE_INITIAL_N;
	let i = 0;
	let bias = PUNYCODE_INITIAL_BIAS;
	const delimIdx = value.lastIndexOf("-");
	if (delimIdx > 0) for (let j = 0; j < delimIdx; j++) {
		const cp = value.charCodeAt(j);
		if (cp >= 128) throw new Error("Invalid punycode: non-basic before delimiter");
		output.push(cp);
	}
	let inIdx = delimIdx < 0 ? 0 : delimIdx + 1;
	while (inIdx < value.length) {
		const oldi = i;
		let w = 1;
		let k = PUNYCODE_BASE;
		while (true) {
			if (inIdx >= value.length) throw new Error("Invalid punycode: unexpected end of input");
			const ch = value.charCodeAt(inIdx++);
			let digit;
			if (ch >= 97 && ch <= 122) digit = ch - 97;
			else if (ch >= 48 && ch <= 57) digit = ch - 48 + 26;
			else if (ch >= 65 && ch <= 90) digit = ch - 65;
			else throw new Error("Invalid punycode: bad digit character");
			i += digit * w;
			const t = k <= bias ? PUNYCODE_TMIN : k >= bias + PUNYCODE_TMAX ? PUNYCODE_TMAX : k - bias;
			if (digit < t) break;
			w *= PUNYCODE_BASE - t;
			k += PUNYCODE_BASE;
		}
		const outLen = output.length + 1;
		bias = Adapt(i - oldi, outLen, oldi === 0);
		n += Math.floor(i / outLen);
		i %= outLen;
		output.splice(i, 0, n);
		i++;
	}
	return globalThis.String.fromCodePoint(...output);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/_idna.mjs
function IsNonspacingMark(cp) {
	return /\p{Mn}/u.test(String.fromCodePoint(cp));
}
function IsSpacingCombiningMark(cp) {
	return /\p{Mc}/u.test(String.fromCodePoint(cp));
}
function IsEnclosingMark(cp) {
	return /\p{Me}/u.test(String.fromCodePoint(cp));
}
function IsCombiningMark(cp) {
	return IsNonspacingMark(cp) || IsSpacingCombiningMark(cp) || IsEnclosingMark(cp);
}
const RFC5892_DISALLOWED = new Set([
	1600,
	2042,
	12334,
	12335,
	12337,
	12338,
	12339,
	12340,
	12341,
	12347
]);
const VIRAMA_CPS = new Set([
	2381,
	2509,
	2637,
	2765,
	2893,
	3021,
	3149,
	3277,
	3387,
	3388,
	3405,
	3530,
	6980,
	7082,
	7083,
	43456,
	69702,
	69759,
	69817,
	69939,
	69940,
	70080,
	70197,
	70477,
	70722,
	70850,
	71103,
	71231,
	71350,
	72767,
	73028,
	73029
]);
function IsGreek(cp) {
	return /\p{Script=Greek}/u.test(String.fromCodePoint(cp));
}
function IsHebrew(cp) {
	return /\p{Script=Hebrew}/u.test(String.fromCodePoint(cp));
}
function IsHiragana(cp) {
	return /\p{Script=Hiragana}/u.test(String.fromCodePoint(cp));
}
function IsKatakana(cp) {
	return /\p{Script=Katakana}/u.test(String.fromCodePoint(cp));
}
function IsHan(cp) {
	return /\p{Script=Han}/u.test(String.fromCodePoint(cp));
}
function IsArabicIndicDigit(cp) {
	return cp >= 1632 && cp <= 1641;
}
function IsExtendedArabicIndicDigit(cp) {
	return cp >= 1776 && cp <= 1785;
}
function IsVirama(cp) {
	return VIRAMA_CPS.has(cp);
}
function IsUnicodeLabel(value) {
	if (value.length === 0) return false;
	const cps = [...value].map((c) => c.codePointAt(0));
	const len = cps.length;
	if (cps[0] === 45 || cps[len - 1] === 45) return false;
	if (len >= 4 && cps[2] === 45 && cps[3] === 45) return false;
	if (IsCombiningMark(cps[0])) return false;
	let hasJapanese = false;
	let hasArabicIndic = false;
	let hasExtendedArabicIndic = false;
	for (let i = 0; i < len; i++) {
		const cp = cps[i];
		if (RFC5892_DISALLOWED.has(cp)) return false;
		if (IsHiragana(cp) || IsKatakana(cp) || IsHan(cp)) hasJapanese = true;
		if (IsArabicIndicDigit(cp)) hasArabicIndic = true;
		if (IsExtendedArabicIndicDigit(cp)) hasExtendedArabicIndic = true;
		const prev = cps[i - 1], next = cps[i + 1];
		switch (cp) {
			case 183:
				if (prev !== 108 || next !== 108) return false;
				break;
			case 885:
				if (next === void 0 || !IsGreek(next)) return false;
				break;
			case 1523:
			case 1524:
				if (prev === void 0 || !IsHebrew(prev)) return false;
				break;
			case 8205:
				if (prev === void 0 || !IsVirama(prev)) return false;
				break;
			case 12539: break;
		}
	}
	if (value.includes("・") && !hasJapanese) return false;
	if (hasArabicIndic && hasExtendedArabicIndic) return false;
	return true;
}
function IsAsciiLabel(value) {
	if (value.charCodeAt(0) === 45 || value.charCodeAt(value.length - 1) === 45) return false;
	if (value.length >= 4 && value.charCodeAt(2) === 45 && value.charCodeAt(3) === 45) return false;
	for (let i = 0; i < value.length; i++) {
		const ch = value.charCodeAt(i);
		if (!(ch >= 97 && ch <= 122 || ch >= 65 && ch <= 90 || ch >= 48 && ch <= 57 || ch === 45)) return false;
	}
	return true;
}
function IsPuny(value) {
	return value.toLowerCase().startsWith("xn--");
}
function IsPunyLabel(value) {
	try {
		return IsUnicodeLabel(Decode(value.slice(4)));
	} catch {
		return false;
	}
}
function IsIdnLabel(value) {
	if (value.length === 0 || value.length > 63) return false;
	return IsPuny(value) ? IsPunyLabel(value) : IsUnicodeLabel(value);
}
function IsLabel(value) {
	if (value.length === 0 || value.length > 63) return false;
	return IsPuny(value) ? IsPunyLabel(value) : IsAsciiLabel(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/hostname.mjs
/**
* Returns true if the value is a valid hostname.
* @specification https://tools.ietf.org/html/rfc1123
* @specification https://tools.ietf.org/html/rfc5891
* @specification https://tools.ietf.org/html/rfc5892
*/
function IsHostname(value) {
	if (value.length === 0 || value.length > 253) return false;
	if (value.charCodeAt(value.length - 1) === 46) return false;
	for (const label of value.split(".")) if (!IsLabel(label)) return false;
	return true;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/idn_email.mjs
const IdnEmail = /^(?!.*\.\.)[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+(?:\.[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+)*@[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?(?:\.[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?)*$/iu;
/**
* Returns true if the value is an IdnEmail
* @specification ajv-formats (unicode-extension)
*/
function IsIdnEmail(value) {
	return IdnEmail.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/idn_hostname.mjs
/**
* Returns true if the value is a valid internationalized (IDN) hostname.
* @specification https://tools.ietf.org/html/rfc3490
* @specification https://tools.ietf.org/html/rfc5891
* @specification https://tools.ietf.org/html/rfc5892
*/
function IsIdnHostname(value) {
	if (value.length === 0 || value.includes(" ")) return false;
	const canonical = value.normalize("NFC").replace(/[\u002E\u3002\uFF0E\uFF61]/g, ".");
	if (canonical.length > 253) return false;
	for (const label of canonical.split(".")) if (!IsIdnLabel(label)) return false;
	return true;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/ipv4.mjs
function IsIPv4Internal(value, start, end) {
	let dots = 0;
	let num = 0;
	let digits = 0;
	let leading = 0;
	for (let i = start; i < end; i++) {
		const ch = value.charCodeAt(i);
		if (ch === 46) {
			if (digits === 0 || num > 255 || leading === 48 && digits > 1) return false;
			dots++;
			num = 0;
			digits = 0;
			leading = 0;
		} else if (ch >= 48 && ch <= 57) {
			if (digits === 0) leading = ch;
			num = num * 10 + (ch - 48);
			digits++;
		} else return false;
	}
	return dots === 3 && digits > 0 && num <= 255 && !(leading === 48 && digits > 1);
}
/**
* Returns true if the value is a IPV4 address
* @specification http://tools.ietf.org/html/rfc2673#section-3.2
*/
function IsIPv4(value) {
	return IsIPv4Internal(value, 0, value.length);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/ipv6.mjs
function InRange(ch) {
	return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
/**
* Returns true if the value is an IPv6 address
* @specification http://tools.ietf.org/html/rfc2373#section-2.2
*/
function IsIPv6(value) {
	const length = value.length;
	if (length === 0) return false;
	let groups = 0;
	let compressed = false;
	let i = 0;
	if (value.charCodeAt(0) === 58 && value.charCodeAt(1) === 58) {
		if (length === 2) return true;
		compressed = true;
		i = 2;
	}
	while (i < length) {
		let digits = 0;
		const start = i;
		while (i < length && InRange(value.charCodeAt(i))) {
			i++;
			digits++;
		}
		if (digits === 0) return false;
		const next = value.charCodeAt(i);
		if (next === 46) {
			if (!IsIPv4Internal(value, start, length)) return false;
			groups += 2;
			i = length;
			break;
		}
		if (digits > 4) return false;
		groups++;
		if (i === length) break;
		if (next !== 58) return false;
		i++;
		if (value.charCodeAt(i) === 58) {
			if (compressed) return false;
			if (value.charCodeAt(i + 1) === 58) return false;
			compressed = true;
			i++;
			if (i === length) break;
		}
	}
	return compressed ? groups <= 7 : groups === 8;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/iri_reference.mjs
function TryUrl(value) {
	try {
		new URL(value, "http://example.com");
		return true;
	} catch {
		return false;
	}
}
/**
* Returns true if the value is a Iri reference
* @specification
*/
function IsIriReference(value) {
	if (value.includes(" ")) return false;
	if (value.includes("\\")) return false;
	if (/[\x00-\x1F\x7F]/.test(value)) return false;
	if (/%(?![0-9a-fA-F]{2})/.test(value)) return false;
	if (value === "") return true;
	const colonIndex = value.indexOf(":");
	if (colonIndex > 0 && /^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(value.substring(0, colonIndex))) return TryUrl(value);
	else {
		if (value.match(/^([a-zA-Z][a-zA-Z0-9+\-.]*)(\/\/)/) && colonIndex === -1) return false;
		return TryUrl(value);
	}
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/iri.mjs
/**
* Returns true if the value is a Iri
* @specification
*/
function IsIri(value) {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/json_pointer_uri_fragment.mjs
const JsonPointerUriFragment = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i;
/**
* Returns true if the value is a json pointer uri fragment
* @specification
* @source ajv-formats
*/
function IsJsonPointerUriFragment(value) {
	return JsonPointerUriFragment.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/json_pointer.mjs
const JsonPointer = /^(?:\/(?:[^~/]|~0|~1)*)*$/;
/**
* Returns true if the value is a json pointer
* @specification
* @source ajv-formats
*/
function IsJsonPointer(value) {
	return JsonPointer.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/regex.mjs
/**
* Returns true if the value is a regular expression string pattern
* @specification
* @source ajv-formats
*/
function IsRegex(value) {
	if (value.length === 0) return false;
	try {
		new RegExp(value);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/relative_json_pointer.mjs
const RelativeJsonPointer = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
/**
* Returns true if the value is a relative json pointer
* @specification
* @source ajv-formats
*/
function IsRelativeJsonPointer(value) {
	return RelativeJsonPointer.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/uri_reference.mjs
const UriReference = /^(?!.*[^\x00-\x7F])(?!.*\\)(?:(?:[a-z][a-z0-9+\-.]*:)?(?:\/\/[^\s[\]{}<>^`|]*)?|[^\s[\]{}<>^`|]*)(?:\?[^\s[\]{}<>^`|]*)?(?:#[^\s[\]{}<>^`|]*)?$/i;
/**
* Returns true if the value is a valid URI Reference.
* @specification https://tools.ietf.org/html/rfc3986
*/
function IsUriReference(value) {
	return UriReference.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/uri_template.mjs
const UriTemplate = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
/**
* Returns true if the value is a uri template
* @specification
* @source ajv-formats
*/
function IsUriTemplate(value) {
	return UriTemplate.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/uri.mjs
function IsAlpha(ch) {
	return ch >= 97 && ch <= 122 || ch >= 65 && ch <= 90;
}
function IsAlphaNumeric(ch) {
	return IsAlpha(ch) || ch >= 48 && ch <= 57;
}
function IsHex(ch) {
	return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function IsSchemeChar(ch) {
	return IsAlphaNumeric(ch) || ch === 43 || ch === 45 || ch === 46;
}
function IsUnreserved(ch) {
	return IsAlphaNumeric(ch) || ch === 45 || ch === 46 || ch === 95 || ch === 126;
}
function IsSubDelim(ch) {
	return ch === 33 || ch === 36 || ch === 38 || ch === 39 || ch === 40 || ch === 41 || ch === 42 || ch === 43 || ch === 44 || ch === 59 || ch === 61;
}
function IsPchar(ch) {
	return IsUnreserved(ch) || IsSubDelim(ch) || ch === 58 || ch === 64;
}
/**
* Returns true if the value matches RFC 3986 URI syntax.
* @specification https://tools.ietf.org/html/rfc3986
*/
function IsUri(value) {
	const length = value.length;
	if (length === 0) return false;
	if (!IsAlpha(value.charCodeAt(0))) return false;
	let i = 1;
	while (i < length) {
		const ch = value.charCodeAt(i);
		if (ch === 58) break;
		if (!IsSchemeChar(ch)) return false;
		i++;
	}
	if (value.charCodeAt(i) !== 58) return false;
	i++;
	if (value.charCodeAt(i) === 47 && value.charCodeAt(i + 1) === 47) {
		i += 2;
		const authorityStart = i;
		let atPos = -1;
		for (let j = i; j < length; j++) {
			const ch = value.charCodeAt(j);
			if (ch === 64) {
				atPos = j;
				break;
			}
			if (ch === 47 || ch === 63 || ch === 35) break;
		}
		if (atPos !== -1) {
			for (let j = authorityStart; j < atPos; j++) {
				const ch = value.charCodeAt(j);
				if (ch === 91 || ch === 93) return false;
				if (ch === 37) {
					if (j + 2 >= atPos || !IsHex(value.charCodeAt(j + 1)) || !IsHex(value.charCodeAt(j + 2))) return false;
					j += 2;
				} else if (!IsUnreserved(ch) && !IsSubDelim(ch) && ch !== 58) return false;
			}
			i = atPos + 1;
		}
		if (value.charCodeAt(i) === 91) {
			i++;
			while (i < length && value.charCodeAt(i) !== 93) i++;
			if (value.charCodeAt(i) !== 93) return false;
			i++;
		} else while (i < length) {
			const ch = value.charCodeAt(i);
			if (ch === 47 || ch === 63 || ch === 35 || ch === 58) break;
			if (ch < 128 && !IsUnreserved(ch) && !IsSubDelim(ch)) return false;
			i++;
		}
		if (value.charCodeAt(i) === 58) {
			i++;
			while (i < length) {
				const ch = value.charCodeAt(i);
				if (ch === 47 || ch === 63 || ch === 35) break;
				if (ch < 48 || ch > 57) return false;
				i++;
			}
		}
	}
	while (i < length) {
		const ch = value.charCodeAt(i);
		if (ch === 37) {
			if (i + 2 >= length || !IsHex(value.charCodeAt(i + 1)) || !IsHex(value.charCodeAt(i + 2))) return false;
			i += 2;
		} else if (ch > 127) return false;
		else if (!(IsPchar(ch) || ch === 47 || ch === 63 || ch === 35)) return false;
		i++;
	}
	return true;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/url.mjs
const Url = /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
/**
* Returns true if the value is a Url
* @specification
* @source ajv-formats
*/
function IsUrl(value) {
	return Url.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/uuid.mjs
const Uuid = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
/**
* Returns true if the value is a uuid
* @specification
* @source ajv-formats
*/
function IsUuid(value) {
	return Uuid.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/format/_registry.mjs
const formats = /* @__PURE__ */ new Map();
/** Clears all entries */
function Clear() {
	formats.clear();
}
/** Tests a value against a format, if the format is not registered, true */
function Test(format, value) {
	return formats.get(format)?.(value) ?? true;
}
/** Resets all formats to defaults */
function Reset() {
	Clear();
	formats.set("date-time", IsDateTime);
	formats.set("date", IsDate);
	formats.set("duration", IsDuration);
	formats.set("email", IsEmail);
	formats.set("hostname", IsHostname);
	formats.set("idn-email", IsIdnEmail);
	formats.set("idn-hostname", IsIdnHostname);
	formats.set("ipv4", IsIPv4);
	formats.set("ipv6", IsIPv6);
	formats.set("iri-reference", IsIriReference);
	formats.set("iri", IsIri);
	formats.set("json-pointer-uri-fragment", IsJsonPointerUriFragment);
	formats.set("json-pointer", IsJsonPointer);
	formats.set("regex", IsRegex);
	formats.set("relative-json-pointer", IsRelativeJsonPointer);
	formats.set("time", IsTime);
	formats.set("uri-reference", IsUriReference);
	formats.set("uri-template", IsUriTemplate);
	formats.set("uri", IsUri);
	formats.set("url", IsUrl);
	formats.set("uuid", IsUuid);
}
Reset();
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/format.mjs
function CheckFormat(_stack, _context, schema, value) {
	return Test(schema.format, value);
}
function ErrorFormat(stack, context, schemaPath, instancePath, schema, value) {
	return CheckFormat(stack, context, schema, value) || context.AddError({
		keyword: "format",
		schemaPath,
		instancePath,
		params: { format: schema.format }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/if.mjs
function CheckIf(stack, context, schema, value) {
	const thenSchema = IsThen(schema) ? schema.then : true;
	const elseSchema = IsElse(schema) ? schema.else : true;
	return CheckSchema(stack, context, schema.if, value) ? CheckSchema(stack, context, thenSchema, value) : CheckSchema(stack, context, elseSchema, value);
}
function ErrorIf(stack, context, schemaPath, instancePath, schema, value) {
	const thenSchema = IsThen(schema) ? schema.then : true;
	const elseSchema = IsElse(schema) ? schema.else : true;
	const trueContext = new AccumulatedErrorContext();
	const isIf = ErrorSchema(stack, trueContext, `${schemaPath}/if`, instancePath, schema.if, value) ? ErrorSchema(stack, trueContext, `${schemaPath}/then`, instancePath, thenSchema, value) || context.AddError({
		keyword: "if",
		schemaPath,
		instancePath,
		params: { failingKeyword: "then" }
	}) : ErrorSchema(stack, context, `${schemaPath}/else`, instancePath, elseSchema, value) || context.AddError({
		keyword: "if",
		schemaPath,
		instancePath,
		params: { failingKeyword: "else" }
	});
	if (isIf) context.Merge([trueContext]);
	return isIf;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/items.mjs
function CheckItemsSized(stack, context, schema, value) {
	return Every(schema.items, 0, (schema, index) => {
		return IsLessEqualThan(value.length, index) || CheckSchemaPushStack(stack, context, schema, value[index]) && context.AddIndex(index);
	});
}
function ErrorItemsSized(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(schema.items, 0, (schema, index) => {
		const nextSchemaPath = `${schemaPath}/items/${index}`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessEqualThan(value.length, index) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index);
	});
}
function CheckItemsUnsized(stack, context, schema, value) {
	return Every(value, IsPrefixItems(schema) ? schema.prefixItems.length : 0, (element, index) => {
		return CheckSchemaPushStack(stack, context, schema.items, element) && context.AddIndex(index);
	});
}
function ErrorItemsUnsized(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(value, IsPrefixItems(schema) ? schema.prefixItems.length : 0, (element, index) => {
		return ErrorSchemaPushStack(stack, context, `${schemaPath}/items`, `${instancePath}/${index}`, schema.items, element) && context.AddIndex(index);
	});
}
function CheckItems(stack, context, schema, value) {
	return IsItemsSized(schema) ? CheckItemsSized(stack, context, schema, value) : CheckItemsUnsized(stack, context, schema, value);
}
function ErrorItems(stack, context, schemaPath, instancePath, schema, value) {
	return IsItemsSized(schema) ? ErrorItemsSized(stack, context, schemaPath, instancePath, schema, value) : ErrorItemsUnsized(stack, context, schemaPath, instancePath, schema, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/maxContains.mjs
function IsValid$2(schema) {
	return IsContains(schema);
}
function CheckMaxContains(stack, context, schema, value) {
	if (!IsValid$2(schema)) return true;
	return IsLessEqualThan(value.reduce((result, item) => CheckSchema(stack, context, schema.contains, item) ? ++result : result, 0), schema.maxContains);
}
function ErrorMaxContains(stack, context, schemaPath, instancePath, schema, value) {
	const minContains = IsMinContains(schema) ? schema.minContains : 1;
	return CheckMaxContains(stack, context, schema, value) || context.AddError({
		keyword: "contains",
		schemaPath,
		instancePath,
		params: {
			minContains,
			maxContains: schema.maxContains
		}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/maximum.mjs
function CheckMaximum(_stack, _context, schema, value) {
	return IsLessEqualThan(value, schema.maximum);
}
function ErrorMaximum(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMaximum(stack, context, schema, value) || context.AddError({
		keyword: "maximum",
		schemaPath,
		instancePath,
		params: {
			comparison: "<=",
			limit: schema.maximum
		}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/maxItems.mjs
function CheckMaxItems(_stack, _context, schema, value) {
	return IsLessEqualThan(value.length, schema.maxItems);
}
function ErrorMaxItems(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMaxItems(stack, context, schema, value) || context.AddError({
		keyword: "maxItems",
		schemaPath,
		instancePath,
		params: { limit: schema.maxItems }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/maxLength.mjs
function CheckMaxLength(_stack, _context, schema, value) {
	return IsMaxLength$1(value, schema.maxLength);
}
function ErrorMaxLength(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMaxLength(stack, context, schema, value) || context.AddError({
		keyword: "maxLength",
		schemaPath,
		instancePath,
		params: { limit: schema.maxLength }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/maxProperties.mjs
function CheckMaxProperties(_stack, _context, schema, value) {
	return IsLessEqualThan(Keys(value).length, schema.maxProperties);
}
function ErrorMaxProperties(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMaxProperties(stack, context, schema, value) || context.AddError({
		keyword: "maxProperties",
		schemaPath,
		instancePath,
		params: { limit: schema.maxProperties }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/minContains.mjs
function IsValid$1(schema) {
	return IsContains(schema);
}
function CheckMinContains(stack, context, schema, value) {
	if (!IsValid$1(schema)) return true;
	return IsGreaterEqualThan(value.reduce((result, item) => CheckSchema(stack, context, schema.contains, item) ? ++result : result, 0), schema.minContains);
}
function ErrorMinContains(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMinContains(stack, context, schema, value) || context.AddError({
		keyword: "contains",
		schemaPath,
		instancePath,
		params: { minContains: schema.minContains }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/minimum.mjs
function CheckMinimum(_stack, _context, schema, value) {
	return IsGreaterEqualThan(value, schema.minimum);
}
function ErrorMinimum(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMinimum(stack, context, schema, value) || context.AddError({
		keyword: "minimum",
		schemaPath,
		instancePath,
		params: {
			comparison: ">=",
			limit: schema.minimum
		}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/minItems.mjs
function CheckMinItems(_stack, _context, schema, value) {
	return IsGreaterEqualThan(value.length, schema.minItems);
}
function ErrorMinItems(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMinItems(stack, context, schema, value) || context.AddError({
		keyword: "minItems",
		schemaPath,
		instancePath,
		params: { limit: schema.minItems }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/minLength.mjs
function CheckMinLength(_stack, _context, schema, value) {
	return IsMinLength$1(value, schema.minLength);
}
function ErrorMinLength(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMinLength(stack, context, schema, value) || context.AddError({
		keyword: "minLength",
		schemaPath,
		instancePath,
		params: { limit: schema.minLength }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/minProperties.mjs
function CheckMinProperties(_stack, _context, schema, value) {
	return IsGreaterEqualThan(Keys(value).length, schema.minProperties);
}
function ErrorMinProperties(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMinProperties(stack, context, schema, value) || context.AddError({
		keyword: "minProperties",
		schemaPath,
		instancePath,
		params: { limit: schema.minProperties }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/multipleOf.mjs
function CheckMultipleOf(_stack, _context, schema, value) {
	return IsMultipleOf$1(value, schema.multipleOf);
}
function ErrorMultipleOf(stack, context, schemaPath, instancePath, schema, value) {
	return CheckMultipleOf(stack, context, schema, value) || context.AddError({
		keyword: "multipleOf",
		schemaPath,
		instancePath,
		params: { multipleOf: schema.multipleOf }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/not.mjs
function CheckNot(stack, context, schema, value) {
	const nextContext = new CheckContext();
	return !CheckSchema(stack, nextContext, schema.not, value) && context.Merge([nextContext]);
}
function ErrorNot(stack, context, schemaPath, instancePath, schema, value) {
	return CheckNot(stack, context, schema, value) || context.AddError({
		keyword: "not",
		schemaPath,
		instancePath,
		params: {}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/oneOf.mjs
function CheckOneOf(stack, context, schema, value) {
	const passedContexts = schema.oneOf.reduce((result, schema) => {
		const nextContext = new CheckContext();
		return CheckSchema(stack, nextContext, schema, value) ? [...result, nextContext] : result;
	}, []);
	return IsEqual(passedContexts.length, 1) && context.Merge(passedContexts);
}
function ErrorOneOf(stack, context, schemaPath, instancePath, schema, value) {
	const failedContexts = [];
	const passingSchemas = [];
	const passedContexts = schema.oneOf.reduce((result, schema, index) => {
		const nextContext = new AccumulatedErrorContext();
		const isSchema = ErrorSchema(stack, nextContext, `${schemaPath}/oneOf/${index}`, instancePath, schema, value);
		if (isSchema) passingSchemas.push(index);
		if (!isSchema) failedContexts.push(nextContext);
		return isSchema ? [...result, nextContext] : result;
	}, []);
	const isOneOf = IsEqual(passedContexts.length, 1) && context.Merge(passedContexts);
	if (!isOneOf && IsEqual(passingSchemas.length, 0)) failedContexts.forEach((failed) => failed.GetErrors().forEach((error) => context.AddError(error)));
	return isOneOf || context.AddError({
		keyword: "oneOf",
		schemaPath,
		instancePath,
		params: { passingSchemas }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/pattern.mjs
function CheckPattern(_stack, _context, schema, value) {
	return (IsString$2(schema.pattern) ? new RegExp(schema.pattern, "u") : schema.pattern).test(value);
}
function ErrorPattern(stack, context, schemaPath, instancePath, schema, value) {
	return CheckPattern(stack, context, schema, value) || context.AddError({
		keyword: "pattern",
		schemaPath,
		instancePath,
		params: { pattern: schema.pattern }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/patternProperties.mjs
function CheckPatternProperties(stack, context, schema, value) {
	return Every(Entries(schema.patternProperties), 0, ([pattern, schema]) => {
		const regexp = new RegExp(pattern, "u");
		return Every(Entries(value), 0, ([key, prop]) => {
			return !regexp.test(key) || CheckSchemaPushStack(stack, context, schema, prop) && context.AddKey(key);
		});
	});
}
function ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(Entries(schema.patternProperties), 0, ([pattern, schema]) => {
		const nextSchemaPath = `${schemaPath}/patternProperties/${pattern}`;
		const regexp = new RegExp(pattern, "u");
		return EveryAll(Entries(value), 0, ([key, value]) => {
			const nextInstancePath = `${instancePath}/${key}`;
			return !regexp.test(key) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema, value) && context.AddKey(key);
		});
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/prefixItems.mjs
function CheckPrefixItems(stack, context, schema, value) {
	return IsEqual(value.length, 0) || Every(schema.prefixItems, 0, (schema, index) => {
		return IsLessEqualThan(value.length, index) || CheckSchemaPushStack(stack, context, schema, value[index]) && context.AddIndex(index);
	});
}
function ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value) {
	return IsEqual(value.length, 0) || EveryAll(schema.prefixItems, 0, (schema, index) => {
		const nextSchemaPath = `${schemaPath}/prefixItems/${index}`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessEqualThan(value.length, index) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index);
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/_exact_optional.mjs
function IsExactOptional(required, key) {
	return required.includes(key) || Get$2().exactOptionalPropertyTypes;
}
function InexactOptionalCheck(value, key) {
	return IsUndefined$1(value[key]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/properties.mjs
function CheckProperties(stack, context, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return Every(Entries(schema.properties), 0, ([key, schema]) => {
		const isProperty = !HasPropertyKey(value, key) || CheckSchemaPushStack(stack, context, schema, value[key]) && context.AddKey(key);
		return IsExactOptional(required, key) ? isProperty : InexactOptionalCheck(value, key) || isProperty;
	});
}
function ErrorProperties(stack, context, schemaPath, instancePath, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return EveryAll(Entries(schema.properties), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/properties/${key}`;
		const nextInstancePath = `${instancePath}/${key}`;
		const isProperty = () => !HasPropertyKey(value, key) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema, value[key]) && context.AddKey(key);
		return IsExactOptional(required, key) ? isProperty() : InexactOptionalCheck(value, key) || isProperty();
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/propertyNames.mjs
function CheckPropertyNames(stack, context, schema, value) {
	return Every(Keys(value), 0, (key, _index) => CheckSchema(stack, context, schema.propertyNames, key));
}
function ErrorPropertyNames(stack, context, schemaPath, instancePath, schema, value) {
	const propertyNames = [];
	return EveryAll(Keys(value), 0, (key, _index) => {
		const nextInstancePath = `${instancePath}/${key}`;
		const nextSchemaPath = `${schemaPath}/propertyNames`;
		const isPropertyName = ErrorSchema(stack, new AccumulatedErrorContext(), nextSchemaPath, nextInstancePath, schema.propertyNames, key);
		if (!isPropertyName) propertyNames.push(key);
		return isPropertyName;
	}) || context.AddError({
		keyword: "propertyNames",
		schemaPath,
		instancePath,
		params: { propertyNames }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/recursiveRef.mjs
function CheckRecursiveRef(stack, context, schema, value) {
	const target = stack.RecursiveRef(schema) ?? false;
	return IsSchema(target) && CheckSchema(stack, context, target, value);
}
function ErrorRecursiveRef(stack, context, _schemaPath, instancePath, schema, value) {
	const target = stack.RecursiveRef(schema) ?? false;
	return IsSchema(target) && ErrorSchema(stack, context, "#", instancePath, target, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/ref.mjs
function CheckRef(stack, context, schema, value) {
	const target = stack.Ref(schema) ?? false;
	const nextContext = new CheckContext();
	const result = IsSchema(target) && CheckSchema(stack, nextContext, target, value);
	if (result) context.Merge([nextContext]);
	return result;
}
function ErrorRef(stack, context, _schemaPath, instancePath, schema, value) {
	const target = stack.Ref(schema) ?? false;
	const nextContext = new AccumulatedErrorContext();
	const result = IsSchema(target) && ErrorSchema(stack, nextContext, "#", instancePath, target, value);
	if (result) context.Merge([nextContext]);
	if (!result) nextContext.GetErrors().forEach((error) => context.AddError(error));
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/required.mjs
function CheckRequired(_stack, _context, schema, value) {
	return Every(schema.required, 0, (key) => HasPropertyKey(value, key));
}
function ErrorRequired(_stack, context, schemaPath, instancePath, schema, value) {
	const requiredProperties = [];
	return EveryAll(schema.required, 0, (key) => {
		const hasKey = HasPropertyKey(value, key);
		if (!hasKey) requiredProperties.push(key);
		return hasKey;
	}) || context.AddError({
		keyword: "required",
		schemaPath,
		instancePath,
		params: { requiredProperties }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/type.mjs
function CheckTypeName(_stack, _context, type, _schema, value) {
	return IsEqual(type, "object") ? IsObjectNotArray(value) : IsEqual(type, "array") ? IsArray$1(value) : IsEqual(type, "boolean") ? IsBoolean$2(value) : IsEqual(type, "integer") ? IsInteger$1(value) : IsEqual(type, "number") ? IsNumber$2(value) : IsEqual(type, "null") ? IsNull$1(value) : IsEqual(type, "string") ? IsString$2(value) : IsEqual(type, "asyncIterator") ? IsAsyncIterator$1(value) : IsEqual(type, "bigint") ? IsBigInt$1(value) : IsEqual(type, "constructor") ? IsConstructor$1(value) : IsEqual(type, "function") ? IsFunction$1(value) : IsEqual(type, "iterator") ? IsIterator$1(value) : IsEqual(type, "symbol") ? IsSymbol$1(value) : IsEqual(type, "undefined") ? IsUndefined$1(value) : IsEqual(type, "void") ? IsUndefined$1(value) : true;
}
function CheckTypeNames(stack, context, types, schema, value) {
	return types.some((type) => CheckTypeName(stack, context, type, schema, value));
}
function CheckType(stack, context, schema, value) {
	return IsArray$1(schema.type) ? CheckTypeNames(stack, context, schema.type, schema, value) : CheckTypeName(stack, context, schema.type, schema, value);
}
function ErrorType(stack, context, schemaPath, instancePath, schema, value) {
	return (IsArray$1(schema.type) ? CheckTypeNames(stack, context, schema.type, schema, value) : CheckTypeName(stack, context, schema.type, schema, value)) || context.AddError({
		keyword: "type",
		schemaPath,
		instancePath,
		params: { type: schema.type }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/unevaluatedItems.mjs
function CheckUnevaluatedItems(stack, context, schema, value) {
	const indices = context.GetIndices();
	return Every(value, 0, (item, index) => {
		return (indices.has(index) || CheckSchema(stack, context, schema.unevaluatedItems, item)) && context.AddIndex(index);
	});
}
function ErrorUnevaluatedItems(stack, context, schemaPath, instancePath, schema, value) {
	const indices = context.GetIndices();
	const unevaluatedItems = [];
	return EveryAll(value, 0, (item, index) => {
		const nextContext = new AccumulatedErrorContext();
		const isEvaluatedItem = (indices.has(index) || ErrorSchema(stack, nextContext, schemaPath, instancePath, schema.unevaluatedItems, item)) && context.AddIndex(index);
		if (!isEvaluatedItem) unevaluatedItems.push(index);
		return isEvaluatedItem;
	}) || context.AddError({
		keyword: "unevaluatedItems",
		schemaPath,
		instancePath,
		params: { unevaluatedItems }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/unevaluatedProperties.mjs
function CheckUnevaluatedProperties(stack, context, schema, value) {
	const keys = context.GetKeys();
	return Every(Entries(value), 0, ([key, prop]) => {
		return keys.has(key) || CheckSchema(stack, context, schema.unevaluatedProperties, prop) && context.AddKey(key);
	});
}
function ErrorUnevaluatedProperties(stack, context, schemaPath, instancePath, schema, value) {
	const keys = context.GetKeys();
	const unevaluatedProperties = [];
	return EveryAll(Entries(value), 0, ([key, prop]) => {
		const nextContext = new AccumulatedErrorContext();
		const isEvaluatedProperty = keys.has(key) || ErrorSchema(stack, nextContext, schemaPath, instancePath, schema.unevaluatedProperties, prop) && context.AddKey(key);
		if (!isEvaluatedProperty) unevaluatedProperties.push(key);
		return isEvaluatedProperty;
	}) || context.AddError({
		keyword: "unevaluatedProperties",
		schemaPath,
		instancePath,
		params: { unevaluatedProperties }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/uniqueItems.mjs
function IsValid(schema) {
	return !IsEqual(schema.uniqueItems, false);
}
function CheckUniqueItems(_stack, _context, schema, value) {
	if (!IsValid(schema)) return true;
	const set = new Set(value.map(Hash)).size;
	const isLength = value.length;
	return IsEqual(set, isLength);
}
function ErrorUniqueItems(_stack, context, schemaPath, instancePath, schema, value) {
	if (!IsValid(schema)) return true;
	const set = /* @__PURE__ */ new Set();
	const duplicateItems = value.reduce((result, value, index) => {
		const hash = Hash(value);
		if (set.has(hash)) return [...result, index];
		set.add(hash);
		return result;
	}, []);
	return IsEqual(duplicateItems.length, 0) || context.AddError({
		keyword: "uniqueItems",
		schemaPath,
		instancePath,
		params: { duplicateItems }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/schema.mjs
function CheckSchemaPushStack(stack, context, schema, value) {
	return context.Push() && CheckSchema(stack, context, schema, value) && context.Pop();
}
function CheckSchema(stack, context, schema, value) {
	stack.Push(schema);
	const result = IsBooleanSchema(schema) ? CheckBooleanSchema(stack, context, schema, value) : (!IsType(schema) || CheckType(stack, context, schema, value)) && (!(IsObject$1(value) && !IsArray$1(value)) || (!IsRequired(schema) || CheckRequired(stack, context, schema, value)) && (!IsAdditionalProperties(schema) || CheckAdditionalProperties(stack, context, schema, value)) && (!IsDependencies(schema) || CheckDependencies(stack, context, schema, value)) && (!IsDependentRequired(schema) || CheckDependentRequired(stack, context, schema, value)) && (!IsDependentSchemas(schema) || CheckDependentSchemas(stack, context, schema, value)) && (!IsPatternProperties(schema) || CheckPatternProperties(stack, context, schema, value)) && (!IsProperties(schema) || CheckProperties(stack, context, schema, value)) && (!IsPropertyNames(schema) || CheckPropertyNames(stack, context, schema, value)) && (!IsMinProperties(schema) || CheckMinProperties(stack, context, schema, value)) && (!IsMaxProperties(schema) || CheckMaxProperties(stack, context, schema, value))) && (!IsArray$1(value) || (!IsAdditionalItems(schema) || CheckAdditionalItems(stack, context, schema, value)) && (!IsContains(schema) || CheckContains(stack, context, schema, value)) && (!IsItems(schema) || CheckItems(stack, context, schema, value)) && (!IsMaxContains(schema) || CheckMaxContains(stack, context, schema, value)) && (!IsMaxItems(schema) || CheckMaxItems(stack, context, schema, value)) && (!IsMinContains(schema) || CheckMinContains(stack, context, schema, value)) && (!IsMinItems(schema) || CheckMinItems(stack, context, schema, value)) && (!IsPrefixItems(schema) || CheckPrefixItems(stack, context, schema, value)) && (!IsUniqueItems(schema) || CheckUniqueItems(stack, context, schema, value))) && (!IsString$2(value) || (!IsMaxLength(schema) || CheckMaxLength(stack, context, schema, value)) && (!IsMinLength(schema) || CheckMinLength(stack, context, schema, value)) && (!IsFormat(schema) || CheckFormat(stack, context, schema, value)) && (!IsPattern(schema) || CheckPattern(stack, context, schema, value))) && (!(IsNumber$2(value) || IsBigInt$1(value)) || (!IsExclusiveMaximum(schema) || CheckExclusiveMaximum(stack, context, schema, value)) && (!IsExclusiveMinimum(schema) || CheckExclusiveMinimum(stack, context, schema, value)) && (!IsMaximum(schema) || CheckMaximum(stack, context, schema, value)) && (!IsMinimum(schema) || CheckMinimum(stack, context, schema, value)) && (!IsMultipleOf(schema) || CheckMultipleOf(stack, context, schema, value))) && (!IsRef(schema) || CheckRef(stack, context, schema, value)) && (!IsRecursiveRef(schema) || CheckRecursiveRef(stack, context, schema, value)) && (!IsDynamicRef(schema) || CheckDynamicRef(stack, context, schema, value)) && (!IsGuard(schema) || CheckGuard(stack, context, schema, value)) && (!IsConst(schema) || CheckConst(stack, context, schema, value)) && (!IsEnum(schema) || CheckEnum(stack, context, schema, value)) && (!IsIf(schema) || CheckIf(stack, context, schema, value)) && (!IsNot(schema) || CheckNot(stack, context, schema, value)) && (!IsAllOf(schema) || CheckAllOf(stack, context, schema, value)) && (!IsAnyOf(schema) || CheckAnyOf(stack, context, schema, value)) && (!IsOneOf(schema) || CheckOneOf(stack, context, schema, value)) && (!IsUnevaluatedItems(schema) || !IsArray$1(value) || CheckUnevaluatedItems(stack, context, schema, value)) && (!IsUnevaluatedProperties(schema) || !IsObject$1(value) || CheckUnevaluatedProperties(stack, context, schema, value)) && (!IsRefine(schema) || CheckRefine(stack, context, schema, value));
	stack.Pop(schema);
	return result;
}
function ErrorSchemaPushStack(stack, context, schemaPath, instancePath, schema, value) {
	return context.Push() && ErrorSchema(stack, context, schemaPath, instancePath, schema, value) && context.Pop();
}
function ErrorSchema(stack, context, schemaPath, instancePath, schema, value) {
	stack.Push(schema);
	const result = IsBooleanSchema(schema) ? ErrorBooleanSchema(stack, context, schemaPath, instancePath, schema, value) : !!(+(!IsType(schema) || ErrorType(stack, context, schemaPath, instancePath, schema, value)) & +(!(IsObject$1(value) && !IsArray$1(value)) || !!(+(!IsRequired(schema) || ErrorRequired(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAdditionalProperties(schema) || ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependencies(schema) || ErrorDependencies(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependentRequired(schema) || ErrorDependentRequired(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependentSchemas(schema) || ErrorDependentSchemas(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPatternProperties(schema) || ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsProperties(schema) || ErrorProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPropertyNames(schema) || ErrorPropertyNames(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinProperties(schema) || ErrorMinProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxProperties(schema) || ErrorMaxProperties(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsArray$1(value) || !!(+(!IsAdditionalItems(schema) || ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsContains(schema) || ErrorContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsItems(schema) || ErrorItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxContains(schema) || ErrorMaxContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxItems(schema) || ErrorMaxItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinContains(schema) || ErrorMinContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinItems(schema) || ErrorMinItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPrefixItems(schema) || ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUniqueItems(schema) || ErrorUniqueItems(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsString$2(value) || !!(+(!IsMaxLength(schema) || ErrorMaxLength(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinLength(schema) || ErrorMinLength(stack, context, schemaPath, instancePath, schema, value)) & +(!IsFormat(schema) || ErrorFormat(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPattern(schema) || ErrorPattern(stack, context, schemaPath, instancePath, schema, value)))) & +(!(IsNumber$2(value) || IsBigInt$1(value)) || !!(+(!IsExclusiveMaximum(schema) || ErrorExclusiveMaximum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsExclusiveMinimum(schema) || ErrorExclusiveMinimum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaximum(schema) || ErrorMaximum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinimum(schema) || ErrorMinimum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMultipleOf(schema) || ErrorMultipleOf(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsRef(schema) || ErrorRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsRecursiveRef(schema) || ErrorRecursiveRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDynamicRef(schema) || ErrorDynamicRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsGuard(schema) || ErrorGuard(stack, context, schemaPath, instancePath, schema, value)) & +(!IsConst(schema) || ErrorConst(stack, context, schemaPath, instancePath, schema, value)) & +(!IsEnum(schema) || ErrorEnum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsIf(schema) || ErrorIf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsNot(schema) || ErrorNot(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAllOf(schema) || ErrorAllOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAnyOf(schema) || ErrorAnyOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsOneOf(schema) || ErrorOneOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUnevaluatedItems(schema) || !IsArray$1(value) || ErrorUnevaluatedItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUnevaluatedProperties(schema) || !IsObject$1(value) || ErrorUnevaluatedProperties(stack, context, schemaPath, instancePath, schema, value))) && (!IsRefine(schema) || ErrorRefine(stack, context, schemaPath, instancePath, schema, value));
	stack.Pop(schema);
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/pointer/pointer.mjs
function GetIndex(index, value) {
	return IsObject$1(value) && !IsUnsafePropertyKey(index) ? value[index] : void 0;
}
function GetIndices(indices, value) {
	return indices.reduce((value, index) => GetIndex(index, value), value);
}
/** Returns an array of path indices for the given pointer */
function Indices(pointer) {
	if (IsEqual(pointer.length, 0)) return [];
	const indices = pointer.split("/").map((index) => index.replace(/~1/g, "/").replace(/~0/g, "~"));
	return indices.length > 0 && indices[0] === "" ? indices.slice(1) : indices;
}
/** Gets a value at the pointer, or undefined if not exists */
function Get(value, pointer) {
	return GetIndices(Indices(pointer), value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/resolve/ref.mjs
function MatchId(schema, base, ref) {
	if (schema.$id === ref.hash) return schema;
	const absoluteId = new URL(schema.$id, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	if (IsEqual(absoluteId.pathname, absoluteRef.pathname)) return ref.hash.startsWith("#") ? MatchHash(schema, base, ref) : schema;
}
function MatchAnchor(schema, base, ref) {
	const absoluteAnchor = new URL(`#${schema.$anchor}`, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	return IsEqual(absoluteAnchor.href, absoluteRef.href) ? schema : void 0;
}
function MatchDynamicAnchor(schema, base, ref) {
	const absoluteAnchor = new URL(`#${schema.$dynamicAnchor}`, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	return IsEqual(absoluteAnchor.href, absoluteRef.href) ? schema : void 0;
}
function MatchHash(schema, _base, ref) {
	if (ref.href.endsWith("#")) return schema;
	if (!ref.hash.startsWith("#")) return void 0;
	const fragment = decodeURIComponent(ref.hash.slice(1));
	if (!fragment.startsWith("/")) return void 0;
	return Get(schema, fragment);
}
function Match(schema, base, ref) {
	if (IsId(schema)) {
		const result = MatchId(schema, base, ref);
		if (!IsUndefined$1(result)) return result;
	}
	if (IsAnchor(schema)) {
		const result = MatchAnchor(schema, base, ref);
		if (!IsUndefined$1(result)) return result;
	}
	if (IsDynamicAnchor(schema)) {
		const result = MatchDynamicAnchor(schema, base, ref);
		if (!IsUndefined$1(result)) return result;
	}
	return MatchHash(schema, base, ref);
}
function FromArray(schema, base, ref) {
	return schema.reduce((result, item) => {
		const match = FromValue(item, base, ref);
		return !IsUndefined$1(match) ? match : result;
	}, void 0);
}
function FromObject(schema, base, ref) {
	return Keys(schema).reduce((result, key) => {
		const match = FromValue(schema[key], base, ref);
		return !IsUndefined$1(match) ? match : result;
	}, void 0);
}
function FromValue(schema, base, ref) {
	const nextBase = IsSchemaObject(schema) && IsId(schema) ? new URL(schema.$id, base.href) : base;
	if (IsSchemaObject(schema)) {
		const result = Match(schema, nextBase, ref);
		if (!IsUndefined$1(result)) return result;
	}
	if (IsArray$1(schema)) return FromArray(schema, nextBase, ref);
	if (IsObject$1(schema)) return FromObject(schema, nextBase, ref);
}
function Ref(schema, ref) {
	const defaultBase = new URL("http://unknown/");
	const initialBase = IsId(schema) ? new URL(schema.$id, defaultBase.href) : defaultBase;
	return FromValue(schema, initialBase, new URL(ref, initialBase.href));
}
function DynamicRef(root, base, dynamicRef, dynamicAnchors) {
	const fragmentTarget = dynamicRef.$dynamicRef.startsWith("#") ? Ref(base, dynamicRef.$dynamicRef) : Ref(root, dynamicRef.$dynamicRef);
	if (IsUndefined$1(fragmentTarget)) return void 0;
	if (!IsSchemaObject(fragmentTarget) || !IsDynamicAnchor(fragmentTarget)) return fragmentTarget;
	if (new URL(dynamicRef.$dynamicRef, "http://unknown/").hash.startsWith("#/")) return fragmentTarget;
	return dynamicAnchors.find((anchor) => anchor.$dynamicAnchor === fragmentTarget.$dynamicAnchor) ?? fragmentTarget;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/engine/_stack.mjs
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Stack_instances, _Stack_PushResourceAnchors, _Stack_PopResourceAnchors, _Stack_FromContext, _Stack_FromRef;
var Stack = class {
	constructor(context, schema) {
		_Stack_instances.add(this);
		this.context = context;
		this.schema = schema;
		this.ids = [];
		this.anchors = [];
		this.recursiveAnchors = [];
		this.dynamicAnchors = [];
	}
	BaseURL() {
		return this.ids.reduce((result, schema) => new URL(schema.$id, result), new URL("http://unknown"));
	}
	Base() {
		return this.ids[this.ids.length - 1] ?? this.schema;
	}
	Push(schema) {
		if (!IsSchemaObject(schema)) return;
		if (IsId(schema)) {
			this.ids.push(schema);
			__classPrivateFieldGet(this, _Stack_instances, "m", _Stack_PushResourceAnchors).call(this, schema);
		}
		if (IsAnchor(schema)) this.anchors.push(schema);
		if (IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.push(schema);
		if (IsDynamicAnchor(schema)) this.dynamicAnchors.push(schema);
	}
	Pop(schema) {
		if (!IsSchemaObject(schema)) return;
		if (IsId(schema)) {
			this.ids.pop();
			__classPrivateFieldGet(this, _Stack_instances, "m", _Stack_PopResourceAnchors).call(this, schema);
		}
		if (IsAnchor(schema)) this.anchors.pop();
		if (IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.pop();
		if (IsDynamicAnchor(schema)) this.dynamicAnchors.pop();
	}
	Ref(ref) {
		return __classPrivateFieldGet(this, _Stack_instances, "m", _Stack_FromContext).call(this, ref) ?? __classPrivateFieldGet(this, _Stack_instances, "m", _Stack_FromRef).call(this, ref);
	}
	RecursiveRef(recursiveRef) {
		return IsRecursiveAnchorTrue(this.Base()) ? Ref(this.recursiveAnchors[0], recursiveRef.$recursiveRef) : Ref(this.Base(), recursiveRef.$recursiveRef);
	}
	DynamicRef(dynamicRef) {
		const root = this.schema;
		return DynamicRef(root, this.Base(), dynamicRef, this.dynamicAnchors);
	}
};
_Stack_instances = /* @__PURE__ */ new WeakSet(), _Stack_PushResourceAnchors = function _Stack_PushResourceAnchors(schema, isRoot = true) {
	if (!IsSchemaObject(schema)) return;
	const current = schema;
	if (!isRoot && IsId(current)) return;
	if (!isRoot && IsDynamicAnchor(current)) this.dynamicAnchors.push(current);
	for (const key of Keys(current)) __classPrivateFieldGet(this, _Stack_instances, "m", _Stack_PushResourceAnchors).call(this, current[key], false);
}, _Stack_PopResourceAnchors = function _Stack_PopResourceAnchors(schema, isRoot = true) {
	if (!IsSchemaObject(schema)) return;
	const current = schema;
	if (!isRoot && IsId(current)) return;
	if (!isRoot && IsDynamicAnchor(current)) this.dynamicAnchors.pop();
	for (const key of Keys(current)) __classPrivateFieldGet(this, _Stack_instances, "m", _Stack_PopResourceAnchors).call(this, current[key], false);
}, _Stack_FromContext = function _Stack_FromContext(ref) {
	return HasPropertyKey(this.context, ref.$ref) ? this.context[ref.$ref] : void 0;
}, _Stack_FromRef = function _Stack_FromRef(ref) {
	const root = this.schema;
	return !ref.$ref.startsWith("#") ? Ref(root, ref.$ref) : Ref(this.Base(), ref.$ref);
};
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/errors.mjs
/** Checks a value and returns validation errors */
function Errors(...args) {
	const [context, schema, value] = Match$3(args, {
		3: (context, schema, value) => [
			context,
			schema,
			value
		],
		2: (schema, value) => [
			{},
			schema,
			value
		]
	});
	const settings = Get$2();
	const locale = Get$1();
	const errors = [];
	return [ErrorSchema(new Stack(context, schema), new ErrorContext((error) => {
		if (IsGreaterEqualThan(errors.length, settings.maxErrors)) return;
		return errors.push({
			...error,
			message: locale(error)
		});
	}), "#", "", schema, value), errors];
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/check.mjs
/** Checks a value against the provided schema */
function Check(...args) {
	const [context, schema, value] = Match$3(args, {
		3: (context, schema, value) => [
			context,
			schema,
			value
		],
		2: (schema, value) => [
			{},
			schema,
			value
		]
	});
	return CheckSchema(new Stack(context, schema), new CheckContext(), schema, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.1.38/node_modules/typebox/build/schema/parse.mjs
var ParseError = class {
	constructor(schema, value, errors) {
		this.schema = schema;
		this.value = value;
		this.errors = errors;
	}
};
/** Parses a value against the provided schema */
function Parse(...args) {
	const [context, schema, value] = Match$3(args, {
		3: (context, schema, value) => [
			context,
			schema,
			value
		],
		2: (schema, value) => [
			{},
			schema,
			value
		]
	});
	if (!Check(context, schema, value)) {
		const [_result, errors] = Errors(context, schema, value);
		throw new ParseError(schema, value, errors);
	}
	return value;
}
const { Product } = Script({ Timestamp: Refine(Unsafe({}), (value) => value instanceof Date) }, `
    interface Image {
      id: number;
      created: Timestamp;
      title: Options<string, { minLength: 1, maxLength: 100 }>;
      type: "jpg" | "png";
      size: number;
      url: Options<string, { format: "url" }>;
    }
    interface Rating {
      id: number;
      stars: Options<number, { minimum: 1, maximum: 5 }>;
      title: Options<string, { minLength: 1, maxLength: 100 }>;
      text: Options<string, { minLength: 1, maxLength: 1000 }>;
      images: Array<Image>;
    }
    interface Product {
      id: number;
      created: Timestamp;
      title: Options<string, { minLength: 1, maxLength: 100 }>;
      brand: Options<string, { minLength: 1, maxLength: 30 }>;
      description: Options<string, { minLength: 1, maxLength: 500 }>;
      price: Options<number, { minimum: 1, maximum: 10000 }>;
      discount: Options<number | null, { minimum: 1, maximum: 100 }>;
      quantity: Options<number, { minimum: 1, maximum: 10 }>;
      tags: Array<Options<string, { minLength: 1, maxLength: 30 }>>;
      images: Array<Image>;
      ratings: Array<Rating>;
    }
    `);
Parse(Product, {});
//#endregion
