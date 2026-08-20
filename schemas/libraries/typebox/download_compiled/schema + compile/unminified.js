//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/memory/metrics.mjs
/** TypeBox instantiation metrics */
const Metrics = {
	assign: 0,
	create: 0,
	clone: 0,
	discard: 0,
	update: 0
};
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/guard/string.mjs
function IsBetween(value, min, max) {
	return value >= min && value <= max;
}
function IsZeroWidthJoiner(value) {
	return value === 8205;
}
function IsHighSurrogate(value) {
	return IsBetween(value, 55296, 56319);
}
function IsRegionalIndicator(value) {
	return IsBetween(value, 127462, 127487);
}
function IsVariationSelector(value) {
	return IsBetween(value, 65024, 65039);
}
function IsCombiningMark(value) {
	return IsBetween(value, 768, 879) || IsBetween(value, 6832, 6911) || IsBetween(value, 7616, 7679) || IsBetween(value, 65056, 65071);
}
function CodePointLength(value) {
	return value > 65535 ? 2 : 1;
}
function ConsumeModifiers(value, index) {
	while (index < value.length) {
		const point = value.codePointAt(index);
		if (IsCombiningMark(point) || IsVariationSelector(point)) index += CodePointLength(point);
		else break;
	}
	return index;
}
function NextGraphemeClusterIndex(value, clusterStart) {
	const startCP = value.codePointAt(clusterStart);
	let clusterEnd = clusterStart + CodePointLength(startCP);
	clusterEnd = ConsumeModifiers(value, clusterEnd);
	while (clusterEnd < value.length - 1 && IsZeroWidthJoiner(value.codePointAt(clusterEnd))) {
		const nextCP = value.codePointAt(clusterEnd + 1);
		clusterEnd += 1 + CodePointLength(nextCP);
		clusterEnd = ConsumeModifiers(value, clusterEnd);
	}
	if (IsRegionalIndicator(startCP) && clusterEnd < value.length && IsRegionalIndicator(value.codePointAt(clusterEnd))) clusterEnd += CodePointLength(value.codePointAt(clusterEnd));
	return clusterEnd;
}
function IsGraphemeCodePoint(value) {
	return IsHighSurrogate(value) || IsCombiningMark(value) || IsVariationSelector(value) || IsZeroWidthJoiner(value);
}
/** Returns the number of grapheme clusters in a string */
function GraphemeCount$1(value) {
	let count = 0;
	let index = 0;
	while (index < value.length) {
		index = NextGraphemeClusterIndex(value, index);
		count++;
	}
	return count;
}
/** Checks if a string has at least a minimum number of grapheme clusters */
function IsMinLengthSegmented(value, minLength) {
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
function IsMaxLengthSegmented(value, maxLength) {
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
function IsMinLength$3(value, minLength) {
	if (minLength === 0) return true;
	let index = 0;
	while (index < value.length) {
		if (IsGraphemeCodePoint(value.charCodeAt(index))) return IsMinLengthSegmented(value, minLength);
		index++;
		if (index >= minLength) return true;
	}
	return false;
}
/** Fast check for maximum grapheme length, falls back to full check if needed */
function IsMaxLength$3(value, maxLength) {
	let index = 0;
	while (index < value.length) {
		if (IsGraphemeCodePoint(value.charCodeAt(index))) return IsMaxLengthSegmented(value, maxLength);
		index++;
		if (index > maxLength) return false;
	}
	return true;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/guard/guard.mjs
var guard_exports = /* @__PURE__ */ __exportAll({
	Counted: () => Counted$1,
	Entries: () => Entries$2,
	EntriesRegExp: () => EntriesRegExp,
	Every: () => Every$1,
	EveryAll: () => EveryAll,
	GraphemeCount: () => GraphemeCount,
	HasPropertyKey: () => HasPropertyKey$1,
	IsArray: () => IsArray$1,
	IsBigInt: () => IsBigInt$1,
	IsBoolean: () => IsBoolean$2,
	IsClassInstance: () => IsClassInstance,
	IsConstructor: () => IsConstructor$1,
	IsDeepEqual: () => IsDeepEqual$1,
	IsEqual: () => IsEqual$1,
	IsFunction: () => IsFunction$1,
	IsGreaterEqualThan: () => IsGreaterEqualThan$1,
	IsGreaterThan: () => IsGreaterThan$1,
	IsInteger: () => IsInteger$1,
	IsLessEqualThan: () => IsLessEqualThan$1,
	IsLessThan: () => IsLessThan$1,
	IsMaxLength: () => IsMaxLength$2,
	IsMinLength: () => IsMinLength$2,
	IsMultipleOf: () => IsMultipleOf$1,
	IsNull: () => IsNull$1,
	IsNumber: () => IsNumber$2,
	IsObject: () => IsObject$1,
	IsObjectNotArray: () => IsObjectNotArray$1,
	IsString: () => IsString$2,
	IsSymbol: () => IsSymbol$1,
	IsUndefined: () => IsUndefined$1,
	IsUnsafePropertyKey: () => IsUnsafePropertyKey,
	IsValueLike: () => IsValueLike,
	Keys: () => Keys$1,
	ShiftLeft: () => ShiftLeft,
	Some: () => Some$1,
	SomeAll: () => SomeAll$1,
	Symbols: () => Symbols,
	Values: () => Values
});
/** Returns true if this value is an array */
function IsArray$1(value) {
	return Array.isArray(value);
}
/** Returns true if this value is bigint */
function IsBigInt$1(value) {
	return IsEqual$1(typeof value, "bigint");
}
/** Returns true if this value is a boolean */
function IsBoolean$2(value) {
	return IsEqual$1(typeof value, "boolean");
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
	return IsEqual$1(typeof value, "function");
}
/** Returns true if this value is integer */
function IsInteger$1(value) {
	return Number.isInteger(value);
}
/** Returns true if this value is null */
function IsNull$1(value) {
	return IsEqual$1(value, null);
}
/** Returns true if this value is number */
function IsNumber$2(value) {
	return Number.isFinite(value);
}
/** Returns true if this value is an object but not an array */
function IsObjectNotArray$1(value) {
	return IsObject$1(value) && !IsArray$1(value);
}
/** Returns true if this value is an object */
function IsObject$1(value) {
	return IsEqual$1(typeof value, "object") && !IsNull$1(value);
}
/** Returns true if this value is string */
function IsString$2(value) {
	return IsEqual$1(typeof value, "string");
}
/** Returns true if this value is symbol */
function IsSymbol$1(value) {
	return IsEqual$1(typeof value, "symbol");
}
/** Returns true if this value is undefined */
function IsUndefined$1(value) {
	return IsEqual$1(value, void 0);
}
function IsEqual$1(left, right) {
	return left === right;
}
function IsGreaterThan$1(left, right) {
	return left > right;
}
function IsLessThan$1(left, right) {
	return left < right;
}
function IsLessEqualThan$1(left, right) {
	return left <= right;
}
function IsGreaterEqualThan$1(left, right) {
	return left >= right;
}
function IsMultipleOf$1(dividend, divisor) {
	if (IsBigInt$1(dividend) || IsBigInt$1(divisor)) return BigInt(dividend) % BigInt(divisor) === 0n;
	const tolerance = 1e-10;
	if (!IsNumber$2(dividend)) return true;
	if (IsInteger$1(dividend) && 1 / divisor % 1 === 0) return true;
	const mod = dividend % divisor;
	return Math.min(Math.abs(mod), Math.abs(mod - divisor), Math.abs(mod + divisor)) < tolerance;
}
/** Returns true if the value appears to be an instance of a class. */
function IsClassInstance(value) {
	if (!IsObject$1(value)) return false;
	const proto = globalThis.Object.getPrototypeOf(value);
	if (IsNull$1(proto)) return false;
	return IsEqual$1(typeof proto.constructor, "function") && !(IsEqual$1(proto.constructor, globalThis.Object) || IsEqual$1(proto.constructor.name, "Object"));
}
function IsValueLike(value) {
	return IsBigInt$1(value) || IsBoolean$2(value) || IsNull$1(value) || IsNumber$2(value) || IsString$2(value) || IsUndefined$1(value);
}
/** Returns the number of grapheme clusters in the string */
function GraphemeCount(value) {
	return GraphemeCount$1(value);
}
/** Returns true if the string has at most the given number of graphemes */
function IsMaxLength$2(value, length) {
	return IsMaxLength$3(value, length);
}
/** Returns true if the string has at least the given number of graphemes */
function IsMinLength$2(value, length) {
	return IsMinLength$3(value, length);
}
/** Returns true if every element from offset satisfies the callback, short-circuiting on the first failure */
function Every$1(value, offset, callback) {
	for (let index = offset; index < value.length; index++) if (!callback(value[index], index)) return false;
	return true;
}
/** Returns true if every element from offset satisfies the callback, using exhaustive enumeration */
function EveryAll(value, offset, callback) {
	let result = true;
	for (let index = offset; index < value.length; index++) if (!callback(value[index], index)) result = false;
	return result;
}
/** Returns true if some element satisfies the callback, short-circuiting on the first success */
function Some$1(value, callback) {
	for (let index = 0; index < value.length; index++) if (callback(value[index], index)) return true;
	return false;
}
/** Returns true if some element satisfies the callback, using exhaustive enumeration */
function SomeAll$1(value, callback) {
	let result = false;
	for (let index = 0; index < value.length; index++) if (callback(value[index], index)) result = true;
	return result;
}
/** Returns the count of elements that satisfy the callback */
function Counted$1(value, callback) {
	return value.reduce((result, value, index) => callback(value, index) ? ++result : result, 0);
}
/** Shifts the left-most element from an array and dispatches to the true arm, or the false arm if empty */
function ShiftLeft(array, true_, false_) {
	return IsEqual$1(array.length, 0) ? false_() : true_(array[0], array.slice(1));
}
/** Returns true if the PropertyKey is Unsafe (ref: prototype-pollution). */
function IsUnsafePropertyKey(key) {
	return IsEqual$1(key, "__proto__") || IsEqual$1(key, "constructor") || IsEqual$1(key, "prototype");
}
/** Returns true if this value has this property key */
function HasPropertyKey$1(value, key) {
	return IsUnsafePropertyKey(key) ? Object.prototype.hasOwnProperty.call(value, key) : key in value;
}
/** Returns object entries as `[RegExp, Value][]` */
function EntriesRegExp(value) {
	return Keys$1(value).map((key) => [new RegExp(`^${key}$`), value[key]]);
}
/** Returns object entries as `[string, Value][]` */
function Entries$2(value) {
	return Object.entries(value);
}
/** Returns property keys for this object via `Object.getOwnPropertyNames({ ... })` */
function Keys$1(value) {
	return Object.getOwnPropertyNames(value);
}
/** Returns the property keys for this object via `Object.getOwnPropertySymbols({ ... })` */
function Symbols(value) {
	return Object.getOwnPropertySymbols(value);
}
/** Returns the property values for the given object via `Object.values()` */
function Values(value) {
	return Object.values(value);
}
function DeepEqualObject(left, right) {
	if (!IsObject$1(right)) return false;
	const keys = Keys$1(left);
	return IsEqual$1(keys.length, Keys$1(right).length) && keys.every((key) => IsDeepEqual$1(left[key], right[key]));
}
function DeepEqualArray(left, right) {
	return IsArray$1(right) && IsEqual$1(left.length, right.length) && left.every((_, index) => IsDeepEqual$1(left[index], right[index]));
}
/** Returns true if left and right values are structurally equal */
function IsDeepEqual$1(left, right) {
	return IsArray$1(left) ? DeepEqualArray(left, right) : IsObject$1(left) ? DeepEqualObject(left, right) : IsEqual$1(left, right);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/guard/emit.mjs
const identifierRegExp = /^[\p{ID_Start}_$][\p{ID_Continue}_$\u200C\u200D]*$/u;
/** Returns true if this value is a valid JavaScript identifier */
function IsIdentifier(value) {
	return identifierRegExp.test(value);
}
function And(left, right) {
	return `(${left} && ${right})`;
}
function Or(left, right) {
	return `(${left} || ${right})`;
}
function Not(expr) {
	return `!(${expr})`;
}
/** Returns true if this value is an array */
function IsArray(value) {
	return `Array.isArray(${value})`;
}
/** Returns true if this value is bigint */
function IsBigInt(value) {
	return `typeof ${value} === "bigint"`;
}
/** Returns true if this value is a boolean */
function IsBoolean$1(value) {
	return `typeof ${value} === "boolean"`;
}
/** Returns true if this value is integer */
function IsInteger(value) {
	return `Number.isInteger(${value})`;
}
/** Returns true if this value is null */
function IsNull(value) {
	return `${value} === null`;
}
/** Returns true if this value is number */
function IsNumber$1(value) {
	return `Number.isFinite(${value})`;
}
/** Returns true if this value is an object but not an array */
function IsObjectNotArray(value) {
	return And(IsObject(value), Not(IsArray(value)));
}
/** Returns true if this value is an object */
function IsObject(value) {
	return `typeof ${value} === "object" && ${value} !== null`;
}
/** Returns true if this value is string */
function IsString$1(value) {
	return `typeof ${value} === "string"`;
}
/** Returns true if this value is symbol */
function IsSymbol(value) {
	return `typeof ${value} === "symbol"`;
}
/** Returns true if this value is undefined */
function IsUndefined(value) {
	return `${value} === undefined`;
}
function IsFunction(value) {
	return `typeof ${value} === "function"`;
}
function IsConstructor(value) {
	return `Guard.IsConstructor(${value})`;
}
function IsEqual(left, right) {
	return `${left} === ${right}`;
}
function IsGreaterThan(left, right) {
	return `${left} > ${right}`;
}
function IsLessThan(left, right) {
	return `${left} < ${right}`;
}
function IsLessEqualThan(left, right) {
	return `${left} <= ${right}`;
}
function IsGreaterEqualThan(left, right) {
	return `${left} >= ${right}`;
}
function IsMinLength$1(value, length) {
	return `Guard.IsMinLength(${value}, ${length})`;
}
function IsMaxLength$1(value, length) {
	return `Guard.IsMaxLength(${value}, ${length})`;
}
function Every(value, offset, params, expression) {
	return IsEqual$1(offset, "0") ? `${value}.every((${params[0]}, ${params[1]}) => ${expression})` : `((value, callback) => { for(let index = ${offset}; index < value.length; index++) if (!callback(value[index], index)) return false; return true })(${value}, (${params[0]}, ${params[1]}) => ${expression})`;
}
function Some(value, params, expression) {
	return `${value}.some((${params[0]}, ${params[1]}) => ${expression})`;
}
function SomeAll(value, params, expression) {
	return `((value, callback) => { let result = false; for(let index = 0; index < value.length; index++) if (callback(value[index], index)) result = true; return result })(${value}, (${params[0]}, ${params[1]}) => ${expression})`;
}
function Counted(value, params, expression) {
	return `${value}.reduce((result, ${params[0]}, ${params[1]}) => (${expression}) ? ++result : result, 0)`;
}
function Entries$1(value) {
	return `Object.entries(${value})`;
}
function Keys(value) {
	return `Object.getOwnPropertyNames(${value})`;
}
function HasPropertyKey(value, key) {
	return IsEqual$1(key, "\"__proto__\"") || IsEqual$1(key, "\"constructor\"") ? `Object.prototype.hasOwnProperty.call(${value}, ${key})` : `${key} in ${value}`;
}
function IsDeepEqual(left, right) {
	return `Guard.IsDeepEqual(${left}, ${right})`;
}
function ArrayLiteral(elements) {
	return `[${elements.join(", ")}]`;
}
function ArrowFunction(parameters, body) {
	return `((${parameters.join(", ")}) => ${body})`;
}
function Call(value, arguments_) {
	return `${value}(${arguments_.join(", ")})`;
}
function New(value, arguments_) {
	return `new ${value}(${arguments_.join(", ")})`;
}
function Member(left, right) {
	return `${left}${IsIdentifier(right) ? `.${right}` : `[${Constant(right)}]`}`;
}
function Constant(value) {
	if (!IsValueLike(value)) throw Error("Unsupported Constant");
	return IsString$2(value) ? JSON.stringify(value) : `${value}`;
}
function Ternary(condition, true_, false_) {
	return `(${condition} ? ${true_} : ${false_})`;
}
function Statements(statements) {
	return `{ ${statements.join("; ")}; }`;
}
function ConstDeclaration(identifier, expression) {
	return `const ${identifier} = ${expression}`;
}
function If(condition, then) {
	return `if(${condition}) { ${then} }`;
}
function Return(expression) {
	return `return ${expression}`;
}
function ReduceAnd(operands) {
	return IsEqual$1(operands.length, 0) ? "true" : operands.reduce((left, right) => And(left, right));
}
function ReduceOr(operands) {
	return IsEqual$1(operands.length, 0) ? "false" : operands.reduce((left, right) => Or(left, right));
}
function MultipleOf(dividend, divisor) {
	return `Guard.IsMultipleOf(${dividend}, ${divisor})`;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/guard/globals.mjs
function IsBoolean(value) {
	return value instanceof Boolean;
}
function IsNumber(value) {
	return value instanceof Number;
}
function IsString(value) {
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
/** Returns true if the value is a Set */
function IsSet(value) {
	return value instanceof globalThis.Set;
}
/** Returns true if the value is a Map */
function IsMap(value) {
	return value instanceof globalThis.Map;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/memory/clone.mjs
function FromClassInstance(value) {
	return value;
}
function IsSchemaObject$1(value) {
	return HasPropertyKey$1(value, "~kind") || HasPropertyKey$1(value, "~unsafe");
}
function FromSchemaObject(value) {
	const result = {};
	for (const key of Keys$1(value)) {
		if (IsUnsafePropertyKey(key)) continue;
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		descriptor.value = FromValue$2(descriptor.value);
		if (IsEqual$1(descriptor.enumerable, true)) result[key] = descriptor.value;
		else Object.defineProperty(result, key, descriptor);
	}
	return result;
}
function FromPlainObject(value) {
	const result = {};
	for (const key of Keys$1(value)) {
		if (IsUnsafePropertyKey(key)) continue;
		result[key] = FromValue$2(value[key]);
	}
	for (const key of Symbols(value)) result[key] = FromValue$2(value[key]);
	return result;
}
function FromObject$2(value) {
	return IsClassInstance(value) ? FromClassInstance(value) : IsSchemaObject$1(value) ? FromSchemaObject(value) : FromPlainObject(value);
}
function FromArray$2(value) {
	return value.map((element) => FromValue$2(element));
}
function FromTypedArray(value) {
	return value.slice();
}
function FromRegExp$1(value) {
	return new RegExp(value.source, value.flags);
}
function FromMap(value) {
	return new Map(FromValue$2([...value.entries()]));
}
function FromSet(value) {
	return new Set(FromValue$2([...value.values()]));
}
function FromValue$2(value) {
	return IsTypeArray(value) ? FromTypedArray(value) : IsRegExp(value) ? FromRegExp$1(value) : IsMap(value) ? FromMap(value) : IsSet(value) ? FromSet(value) : IsArray$1(value) ? FromArray$2(value) : IsObject$1(value) ? FromObject$2(value) : value;
}
/**
* Returns a Clone of the given value. This function is similar to structuredClone()
* but also supports deep cloning instances of Map, Set and TypeArray.
*/
function Clone(value) {
	Metrics.clone += 1;
	return FromValue$2(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/settings/settings.mjs
const settings = {
	immutableTypes: false,
	maxErrors: 8,
	maxInstantiationCount: 128,
	useAcceleration: true,
	exactOptionalPropertyTypes: false,
	enumerableKind: false,
	correctiveParse: false,
	unionPrioritySort: true
};
/** Gets current system settings */
function Get$3() {
	return settings;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/memory/create.mjs
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
	const settings = Get$3();
	const withOptions = Merge(enumerable, options);
	const withHidden = settings.enumerableKind ? Merge(withOptions, hidden) : MergeHidden(withOptions, hidden);
	return settings.immutableTypes ? Object.freeze(withHidden) : withHidden;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/memory/update.mjs
/**
* Updates a value with new properties while preserving property enumerability. Use this function to modify
* existing types without altering their configuration.
*/
function Update(current, hidden, enumerable) {
	Metrics.update += 1;
	const settings = Get$3();
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/schema.mjs
function IsSchema$1(value) {
	return IsObject$1(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/array.mjs
/** Creates an Array type. */
function _Array_(items, options) {
	return Create({ "~kind": "Array" }, {
		type: "array",
		items
	}, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/_optional.mjs
/** Returns true if the given value is TOptional */
function IsOptional(value) {
	return IsSchema$1(value) && HasPropertyKey$1(value, "~optional");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/properties.mjs
/** Creates a RequiredArray derived from the given TProperties value. */
function RequiredArray(properties) {
	return Keys$1(properties).filter((key) => !IsOptional(properties[key]));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/object.mjs
/** Creates an Object type. */
function _Object_(properties, options = {}) {
	const requiredKeys = RequiredArray(properties);
	return Create({ "~kind": "Object" }, {
		type: "object",
		...requiredKeys.length > 0 ? { required: requiredKeys } : {},
		properties
	}, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/unsafe.mjs
/** Creates a Unsafe type. */
function Unsafe(schema) {
	return Update(schema, { ["~unsafe"]: null }, {});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/arguments/arguments.mjs
/**
* Match arguments for overloaded functions that use the `...args: unknown[]` pattern. Arguments
* are parsed using argument length only.
*/
function Match$1(args, match) {
	return match[args.length]?.(...args) ?? (() => {
		throw Error("Invalid Arguments");
	})();
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/engine/enum/typescript_enum_to_enum_values.mjs
function IsTypeScriptEnumLike(value) {
	return IsObjectNotArray$1(value);
}
function TypeScriptEnumToEnumValues(type) {
	return Keys$1(type).filter((key) => isNaN(key)).reduce((result, key) => [...result, type[key]], []);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/enum.mjs
/** Creates an Enum type. */
function Enum(value, options) {
	return Create({ "~kind": "Enum" }, { enum: IsTypeScriptEnumLike(value) ? TypeScriptEnumToEnumValues(value) : value }, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/environment/evaluate.mjs
let supported = void 0;
function TryEvaluate() {
	try {
		Evaluate("null")();
		return true;
	} catch {
		return false;
	}
}
/** Returns true if the environment supports dynamic JavaScript evaluation */
function CanEvaluate() {
	if (IsUndefined$1(supported)) supported = TryEvaluate();
	return supported && Get$3().useAcceleration;
}
/**
* Evaluates code in the current environment. This function will throw if the
* environment Content-Security-Policy does not support `unsafe-eval`. Use the
* Environment.CanEvaluate() to determine if the environment supports Evaluate
* before calling this function.
*/
function Evaluate(...args) {
	return new globalThis.Function(...args);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/unreachable/unreachable.mjs
/** Used for unreachable logic */
function Unreachable() {
	throw new Error("Unreachable");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/hashing/hash.mjs
var hash_exports = /* @__PURE__ */ __exportAll({
	Hash: () => Hash,
	HashCode: () => HashCode
});
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
const F64 = /* @__PURE__ */ new Float64Array(1);
const F64In = new DataView(F64.buffer);
const F64Out = new Uint8Array(F64.buffer);
function FNV1A64_OP(byte) {
	Accumulator = Accumulator ^ Bytes[byte];
	Accumulator = Accumulator * Prime % Size;
}
function FromArray$1(value) {
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
function FromObject$1(value) {
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
	return IsTypeArray(value) ? FromTypeArray(value) : IsDate$1(value) ? FromDate(value) : IsRegExp(value) ? FromRegExp(value) : IsBoolean(value) ? FromBoolean(value.valueOf()) : IsString(value) ? FromString(value.valueOf()) : IsNumber(value) ? FromNumber(value.valueOf()) : IsIEEE754(value) ? FromNumber(value) : IsArray$1(value) ? FromArray$1(value) : IsBoolean$2(value) ? FromBoolean(value) : IsBigInt$1(value) ? FromBigInt(value) : IsConstructor$1(value) ? FromConstructor(value) : IsNull$1(value) ? FromNull(value) : IsObject$1(value) ? FromObject$1(value) : IsString$2(value) ? FromString(value) : IsSymbol$1(value) ? FromSymbol(value) : IsUndefined$1(value) ? FromUndefined(value) : IsFunction$1(value) ? FromFunction(value) : Unreachable();
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/locale/en_US.mjs
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
		case "~refine": return error.params.message;
		default: return "an unknown validation error occurred";
	}
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/system/locale/_config.mjs
let locale = en_US;
/** Gets the locale */
function Get$2() {
	return locale;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/_refine.mjs
/** Applies a Refine check to the given type. */
function RefineAdd(type, refinement) {
	return Update(type, { "~refine": IsRefine$1(type) ? [...type["~refine"], refinement] : [refinement] }, {});
}
/** Refines a type with an explicit check */
function Refine(...args) {
	const [type, check, error] = Match$1(args, {
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
		error
	});
}
/** Returns true if the given value is a TRefinement. */
function IsRefinement(value) {
	return IsObjectNotArray$1(value) && HasPropertyKey$1(value, "check") && HasPropertyKey$1(value, "error") && IsFunction$1(value.check) && IsFunction$1(value.error);
}
/** Returns true if the given value is a TRefine. */
function IsRefine$1(value) {
	return IsSchema$1(value) && HasPropertyKey$1(value, "~refine") && IsArray$1(value["~refine"]) && Every$1(value["~refine"], 0, (value) => IsRefinement(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/integer.mjs
const IntegerPattern = "-?(?:0|[1-9][0-9]*)";
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/null.mjs
/** Creates a Null type. */
function Null(options) {
	return Create({ "~kind": "Null" }, { type: "null" }, options);
}
/** Creates a Number type. */
function Number$1(options) {
	return Create({ "~kind": "Number" }, { type: "number" }, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/string.mjs
/** Creates a String type. */
function String$1(options) {
	return Create({ "~kind": "String" }, { type: "string" }, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/union.mjs
/** Creates a Union type. */
function Union(anyOf, options = {}) {
	return Create({ "~kind": "Union" }, { anyOf }, options);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/types/record.mjs
const IntegerKey = `^${IntegerPattern}$`;
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/type/script/token/internal/char.mjs
function Range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));
}
const Alpha = [...Range(97, 122), ...Range(65, 90)];
const Digit = ["0", ...Range(49, 57)];
[...Digit];
[...[
	...Alpha,
	"_",
	"$"
], ...Digit];
[...Digit];
new RegExp(IntegerKey);
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/_refine.mjs
/**
* Returns true if the schema contains an '~refine` keyword
* @specification None
*/
function IsRefine(value) {
	return HasPropertyKey$1(value, "~refine") && IsArray$1(value["~refine"]) && Every$1(value["~refine"], 0, (value) => IsObject$1(value) && HasPropertyKey$1(value, "check") && HasPropertyKey$1(value, "error") && IsFunction$1(value.check) && IsFunction$1(value.error));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/schema.mjs
/** Returns true if this value is object like */
function IsSchemaObject(value) {
	return IsObject$1(value) && !IsArray$1(value);
}
/** Returns true if this value is a boolean */
function IsSchemaBoolean(value) {
	return IsBoolean$2(value);
}
/** Returns true if this value is schema like */
function IsSchema(value) {
	return IsSchemaObject(value) || IsSchemaBoolean(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/additionalItems.mjs
/**
* Returns true if the schema contains a valid additionalItems property
* @specification Json Schema 7
*/
function IsAdditionalItems(schema) {
	return HasPropertyKey$1(schema, "additionalItems") && IsSchema(schema.additionalItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/additionalProperties.mjs
/**
* Returns true if the schema contains a valid additionalProperties property
* @specification Json Schema 7
*/
function IsAdditionalProperties(schema) {
	return HasPropertyKey$1(schema, "additionalProperties") && IsSchema(schema.additionalProperties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/allOf.mjs
/**
* Returns true if the schema contains a valid allOf property
* @specification Json Schema 7
*/
function IsAllOf(schema) {
	return HasPropertyKey$1(schema, "allOf") && IsArray$1(schema.allOf) && schema.allOf.every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/anchor.mjs
/**
* Returns true if the schema contains a valid $anchor property
*/
function IsAnchor(schema) {
	return HasPropertyKey$1(schema, "$anchor") && IsString$2(schema.$anchor);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/anyOf.mjs
/**
* Returns true if the schema contains a valid anyOf property
* @specification Json Schema 7
*/
function IsAnyOf(schema) {
	return HasPropertyKey$1(schema, "anyOf") && IsArray$1(schema.anyOf) && schema.anyOf.every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/const.mjs
/**
* Returns true if the schema contains a valid const property
* @specification Json Schema 7
*/
function IsConst(value) {
	return HasPropertyKey$1(value, "const");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/contains.mjs
/**
* Returns true if the schema contains a valid contains property
* @specification Json Schema 7
*/
function IsContains(schema) {
	return HasPropertyKey$1(schema, "contains") && IsSchema(schema.contains);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/dependencies.mjs
/**
* Returns true if the schema contains a valid dependencies property
* @specification Json Schema 7
*/
function IsDependencies(schema) {
	return HasPropertyKey$1(schema, "dependencies") && IsObject$1(schema.dependencies) && Object.values(schema.dependencies).every((value) => IsSchema(value) || IsArray$1(value) && value.every((value) => IsString$2(value)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/dependentRequired.mjs
/**
* Returns true if the schema contains a valid dependentRequired property
* @specification Json Schema 2019-09
*/
function IsDependentRequired(schema) {
	return HasPropertyKey$1(schema, "dependentRequired") && IsObject$1(schema.dependentRequired) && Object.values(schema.dependentRequired).every((value) => IsArray$1(value) && value.every((value) => IsString$2(value)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/dependentSchemas.mjs
/**
* Returns true if the schema contains a valid dependentRequired property
* @specification Json Schema 2019-09
*/
function IsDependentSchemas(schema) {
	return HasPropertyKey$1(schema, "dependentSchemas") && IsObject$1(schema.dependentSchemas) && Object.values(schema.dependentSchemas).every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/dynamicAnchor.mjs
/**
* Returns true if the schema contains a valid $dynamicAnchor property
*/
function IsDynamicAnchor(schema) {
	return HasPropertyKey$1(schema, "$dynamicAnchor") && IsString$2(schema.$dynamicAnchor);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/dynamicRef.mjs
/**
* Returns true if the schema contains a valid $dynamicRef property
*/
function IsDynamicRef(schema) {
	return HasPropertyKey$1(schema, "$dynamicRef") && IsString$2(schema.$dynamicRef);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/else.mjs
/**
* Returns true if the schema contains a valid else property
* @specification Json Schema 7
*/
function IsElse(schema) {
	return HasPropertyKey$1(schema, "else") && IsSchema(schema.else);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/enum.mjs
/**
* Returns true if the schema contains a valid enum property
* @specification Json Schema 7
*/
function IsEnum(schema) {
	return HasPropertyKey$1(schema, "enum") && IsArray$1(schema.enum);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/exclusiveMaximum.mjs
/**
* Returns true if the schema contains a valid exclusiveMaximum property
* @specification Json Schema 7
*/
function IsExclusiveMaximum(schema) {
	return HasPropertyKey$1(schema, "exclusiveMaximum") && (IsNumber$2(schema.exclusiveMaximum) || IsBigInt$1(schema.exclusiveMaximum));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/exclusiveMinimum.mjs
/**
* Returns true if the schema contains a valid exclusiveMinimum property
* @specification Json Schema 7
*/
function IsExclusiveMinimum(schema) {
	return HasPropertyKey$1(schema, "exclusiveMinimum") && (IsNumber$2(schema.exclusiveMinimum) || IsBigInt$1(schema.exclusiveMinimum));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/format.mjs
/**
* Returns true if the schema contains a valid format property
* @specification Json Schema 7
*/
function IsFormat(schema) {
	return HasPropertyKey$1(schema, "format") && IsString$2(schema.format);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/id.mjs
/**
* Returns true if the schema contains a valid $id property
* @specification Json Schema 7
*/
function IsId(schema) {
	return HasPropertyKey$1(schema, "$id") && IsString$2(schema.$id);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/if.mjs
/**
* Returns true if the schema contains a valid $id property
* @specification Json Schema 7
*/
function IsIf(schema) {
	return HasPropertyKey$1(schema, "if") && IsSchema(schema.if);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/items.mjs
/**
* Returns true if the schema contains a valid items property
* @specification Json Schema 7
*/
function IsItems(schema) {
	return HasPropertyKey$1(schema, "items") && (IsSchema(schema.items) || IsArray$1(schema.items) && schema.items.every((value) => {
		return IsSchema(value);
	}));
}
/** Returns true if this schema is a sized items variant */
function IsItemsSized(schema) {
	return IsItems(schema) && IsArray$1(schema.items);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/maximum.mjs
/**
* Returns true if the schema contains a valid maximum property
* @specification Json Schema 7
*/
function IsMaximum(schema) {
	return HasPropertyKey$1(schema, "maximum") && (IsNumber$2(schema.maximum) || IsBigInt$1(schema.maximum));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/maxContains.mjs
/**
* Returns true if the schema contains a valid maxContains property
* @specification Json Schema 2019-09
*/
function IsMaxContains(schema) {
	return HasPropertyKey$1(schema, "maxContains") && IsNumber$2(schema.maxContains);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/maxItems.mjs
/**
* Returns true if the schema contains a valid maxItems property
* @specification Json Schema 7
*/
function IsMaxItems(schema) {
	return HasPropertyKey$1(schema, "maxItems") && IsNumber$2(schema.maxItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/maxLength.mjs
/**
* Returns true if the schema contains a valid maxLength property
* @specification Json Schema 7
*/
function IsMaxLength(schema) {
	return HasPropertyKey$1(schema, "maxLength") && IsNumber$2(schema.maxLength);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/maxProperties.mjs
/**
* Returns true if the schema contains a valid maxProperties property
* @specification Json Schema 7
*/
function IsMaxProperties(schema) {
	return HasPropertyKey$1(schema, "maxProperties") && IsNumber$2(schema.maxProperties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/minimum.mjs
/**
* Returns true if the schema contains a valid minimum property
* @specification Json Schema 7
*/
function IsMinimum(schema) {
	return HasPropertyKey$1(schema, "minimum") && (IsNumber$2(schema.minimum) || IsBigInt$1(schema.minimum));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/minContains.mjs
/**
* Returns true if the schema contains a valid maxContains property
* @specification Json Schema 2019-09
*/
function IsMinContains(schema) {
	return HasPropertyKey$1(schema, "minContains") && IsNumber$2(schema.minContains);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/minItems.mjs
/**
* Returns true if the schema contains a valid minItems property
* @specification Json Schema 7
*/
function IsMinItems(schema) {
	return HasPropertyKey$1(schema, "minItems") && IsNumber$2(schema.minItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/minLength.mjs
/**
* Returns true if the schema contains a valid minLength property
* @specification Json Schema 7
*/
function IsMinLength(schema) {
	return HasPropertyKey$1(schema, "minLength") && IsNumber$2(schema.minLength);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/minProperties.mjs
/**
* Returns true if the schema contains a valid minProperties property
* @specification Json Schema 7
*/
function IsMinProperties(schema) {
	return HasPropertyKey$1(schema, "minProperties") && IsNumber$2(schema.minProperties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/multipleOf.mjs
/**
* Returns true if the schema contains a valid multipleOf property
* @specification Json Schema 7
*/
function IsMultipleOf(schema) {
	return HasPropertyKey$1(schema, "multipleOf") && (IsNumber$2(schema.multipleOf) || IsBigInt$1(schema.multipleOf));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/not.mjs
/**
* Returns true if the schema contains a valid not property
* @specification Json Schema 7
*/
function IsNot(schema) {
	return HasPropertyKey$1(schema, "not") && IsSchema(schema.not);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/oneOf.mjs
/**
* Returns true if the schema contains a valid oneOf property
* @specification Json Schema 7
*/
function IsOneOf(schema) {
	return HasPropertyKey$1(schema, "oneOf") && IsArray$1(schema.oneOf) && schema.oneOf.every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/pattern.mjs
/**
* Returns true if the schema contains a valid pattern property
* @specification Json Schema 7
*/
function IsPattern(schema) {
	return HasPropertyKey$1(schema, "pattern") && (IsString$2(schema.pattern) || schema.pattern instanceof RegExp);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/patternProperties.mjs
/**
* Returns true if the schema contains a valid patternProperties property
* @specification Json Schema 7
*/
function IsPatternProperties(schema) {
	return HasPropertyKey$1(schema, "patternProperties") && IsObject$1(schema.patternProperties) && Object.values(schema.patternProperties).every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/prefixItems.mjs
/**
* Returns true if the schema contains a valid prefixItems property
*/
function IsPrefixItems(schema) {
	return HasPropertyKey$1(schema, "prefixItems") && IsArray$1(schema.prefixItems) && schema.prefixItems.every((schema) => IsSchema(schema));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/properties.mjs
/**
* Returns true if the schema contains a valid properties property
* @specification Json Schema 7
*/
function IsProperties(schema) {
	return HasPropertyKey$1(schema, "properties") && IsObject$1(schema.properties) && Object.values(schema.properties).every((value) => IsSchema(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/propertyNames.mjs
/**
* Returns true if the schema contains a valid propertyNames property
* @specification Json Schema 7
*/
function IsPropertyNames(schema) {
	return HasPropertyKey$1(schema, "propertyNames") && (IsObject$1(schema.propertyNames) || IsSchema(schema.propertyNames));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/recursiveAnchor.mjs
/**
* Returns true if the schema contains a valid $recursiveAnchor property
*/
function IsRecursiveAnchor(schema) {
	return HasPropertyKey$1(schema, "$recursiveAnchor") && IsBoolean$2(schema.$recursiveAnchor);
}
/**
* Returns true if the schema contains a valid $recursiveAnchor property that is true
*/
function IsRecursiveAnchorTrue(schema) {
	return IsRecursiveAnchor(schema) && IsEqual$1(schema.$recursiveAnchor, true);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/recursiveRef.mjs
/**
* Returns true if the schema contains a valid $recursiveRef property
*/
function IsRecursiveRef(schema) {
	return HasPropertyKey$1(schema, "$recursiveRef") && IsString$2(schema.$recursiveRef);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/ref.mjs
/**
* Returns true if the schema contains a valid $ref property
* @specification Json Schema 7
*/
function IsRef(schema) {
	return HasPropertyKey$1(schema, "$ref") && IsString$2(schema.$ref);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/required.mjs
/**
* Returns true if the schema contains a valid required property
* @specification Json Schema 7
*/
function IsRequired(schema) {
	return HasPropertyKey$1(schema, "required") && IsArray$1(schema.required) && schema.required.every((value) => IsString$2(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/then.mjs
/**
* Returns true if the schema contains a valid then property
* @specification Json Schema 7
*/
function IsThen(schema) {
	return HasPropertyKey$1(schema, "then") && IsSchema(schema.then);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/type.mjs
/**
* Returns true if the schema contains a valid type property
* @specification Json Schema 7
*/
function IsType(schema) {
	return HasPropertyKey$1(schema, "type") && (IsString$2(schema.type) || IsArray$1(schema.type) && schema.type.every((value) => IsString$2(value)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/uniqueItems.mjs
/**
* Returns true if the schema contains a valid uniqueItems property
* @specification Json Schema 7
*/
function IsUniqueItems(schema) {
	return HasPropertyKey$1(schema, "uniqueItems") && IsBoolean$2(schema.uniqueItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/unevaluatedItems.mjs
/**
* Returns true if the schema contains a valid unevaluatedItems property
* @specification Json Schema 2019-09
*/
function IsUnevaluatedItems(schema) {
	return HasPropertyKey$1(schema, "unevaluatedItems") && IsSchema(schema.unevaluatedItems);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/types/unevaluatedProperties.mjs
/**
* Returns true if the schema contains a valid unevaluatedProperties property
* @specification Json Schema 2019-09
*/
function IsUnevaluatedProperties(schema) {
	return HasPropertyKey$1(schema, "unevaluatedProperties") && IsSchema(schema.unevaluatedProperties);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_context.mjs
function HasUnevaluatedFromObject(value) {
	return IsUnevaluatedItems(value) || IsUnevaluatedProperties(value) || Some$1(Keys$1(value), (key) => HasUnevaluatedFromUnknown(value[key]));
}
function HasUnevaluatedFromArray(value) {
	return Some$1(value, (value) => HasUnevaluatedFromUnknown(value));
}
function HasUnevaluatedFromUnknown(value) {
	return IsArray$1(value) ? HasUnevaluatedFromArray(value) : IsObject$1(value) ? HasUnevaluatedFromObject(value) : false;
}
function HasUnevaluated(context, schema) {
	return HasUnevaluatedFromUnknown(schema) || Some$1(Keys$1(context), (key) => HasUnevaluatedFromUnknown(context[key]));
}
var BuildContext = class {
	constructor(hasUnevaluated) {
		this.hasUnevaluated = hasUnevaluated;
	}
	UseUnevaluated() {
		return this.hasUnevaluated;
	}
	Push() {
		return Call(Member("context", "Push"), []);
	}
	Pop() {
		return Call(Member("context", "Pop"), []);
	}
	AddIndex(index) {
		return Call(Member("context", "AddIndex"), [index]);
	}
	AddKey(key) {
		return Call(Member("context", "AddKey"), [key]);
	}
	Merge(results) {
		return Call(Member("context", "Merge"), [results]);
	}
};
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_externals.mjs
const state = {
	identifier: "External",
	variables: []
};
function CreateVariable(value) {
	const call = `External[${state.variables.length}]`;
	state.variables.push(value);
	return call;
}
function ResetExternal() {
	state.variables = [];
}
function GetExternal() {
	return { ...state };
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_refine.mjs
function BuildRefine(_stack, _context, schema, value) {
	return Every(CreateVariable(schema["~refine"].map((refinement) => refinement)), Constant(0), ["refinement", "_"], Call(Member("refinement", "check"), [value]));
}
function CheckRefine(_stack, _context, schema, value) {
	return Every$1(schema["~refine"], 0, (refinement, _) => refinement.check(value));
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_unique.mjs
let index$1 = 0;
/** Returns a Unique Variable Name */
function Unique() {
	return `var_${index$1++}`;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/additionalItems.mjs
function IsValid$4(schema) {
	return IsItems(schema) && IsArray$1(schema.items);
}
function BuildAdditionalItemsStandard(stack, context, schema, value) {
	const [item, index] = [Unique(), Unique()];
	const isSchema = BuildSchemaPushStack(stack, context, schema.additionalItems, item);
	const isLength = IsLessThan(index, Constant(schema.items.length));
	const addIndex = context.AddIndex(index);
	return Every(value, Constant(0), [item, index], Or(isLength, And(isSchema, addIndex)));
}
function BuildAdditionalItemsFast(stack, context, schema, value) {
	const [item, index] = [Unique(), Unique()];
	const isSchema = BuildSchemaPushStack(stack, context, schema.additionalItems, item);
	const isLength = IsLessThan(index, Constant(schema.items.length));
	return Every(value, Constant(0), [item, index], Or(isLength, isSchema));
}
function BuildAdditionalItems(stack, context, schema, value) {
	if (!IsValid$4(schema)) return Constant(true);
	return context.UseUnevaluated() ? BuildAdditionalItemsStandard(stack, context, schema, value) : BuildAdditionalItemsFast(stack, context, schema, value);
}
function CheckAdditionalItems(stack, context, schema, value) {
	if (!IsValid$4(schema)) return true;
	return Every$1(value, 0, (item, index) => {
		return IsLessThan$1(index, schema.items.length) || CheckSchemaPushStack(stack, context, schema.additionalItems, item) && context.AddIndex(index);
	});
}
function ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value) {
	if (!IsValid$4(schema)) return true;
	return Every$1(value, 0, (item, index) => {
		const nextSchemaPath = `${schemaPath}/additionalItems`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessThan$1(index, schema.items.length) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema.additionalItems, item) && context.AddIndex(index);
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_regexp.mjs
/** Standard RegExp with Unicode */
function UnicodeRegExp(pattern) {
	return new RegExp(pattern, "u");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/additionalProperties.mjs
function GetPropertyKeyAsPattern(key) {
	return `^${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`;
}
function GetPropertiesPattern(schema) {
	const patterns = [];
	if (IsPatternProperties(schema)) patterns.push(...Keys$1(schema.patternProperties));
	if (IsProperties(schema)) patterns.push(...Keys$1(schema.properties).map(GetPropertyKeyAsPattern));
	return IsEqual$1(patterns.length, 0) ? "(?!)" : `(${patterns.join("|")})`;
}
function CanAdditionalPropertiesFast(_context, schema, _value) {
	return IsRequired(schema) && IsProperties(schema) && !IsPatternProperties(schema) && IsEqual$1(schema.additionalProperties, false) && IsEqual$1(Keys$1(schema.properties).length, schema.required.length);
}
function BuildAdditionalPropertiesFast(_context, schema, value) {
	return IsEqual(Member(Call(Member("Object", "getOwnPropertyNames"), [value]), "length"), Constant(schema.required.length));
}
function BuildAdditionalPropertiesStandard(stack, context, schema, value) {
	const [key, _index] = [Unique(), Unique()];
	const regexp = CreateVariable(UnicodeRegExp(GetPropertiesPattern(schema)));
	const isSchema = BuildSchemaPushStack(stack, context, schema.additionalProperties, `${value}[${key}]`);
	const isKey = Call(Member(regexp, "test"), [key]);
	const addKey = context.AddKey(key);
	const guarded = context.UseUnevaluated() ? Or(isKey, And(isSchema, addKey)) : Or(isKey, isSchema);
	return Every(Keys(value), Constant(0), [key, _index], guarded);
}
function BuildAdditionalProperties(stack, context, schema, value) {
	return CanAdditionalPropertiesFast(context, schema, value) ? BuildAdditionalPropertiesFast(context, schema, value) : BuildAdditionalPropertiesStandard(stack, context, schema, value);
}
function CheckAdditionalProperties(stack, context, schema, value) {
	const regexp = UnicodeRegExp(GetPropertiesPattern(schema));
	return Every$1(Keys$1(value), 0, (key, _index) => {
		return regexp.test(key) || CheckSchemaPushStack(stack, context, schema.additionalProperties, value[key]) && context.AddKey(key);
	});
}
function ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value) {
	const regexp = UnicodeRegExp(GetPropertiesPattern(schema));
	const additionalProperties = [];
	return EveryAll(Keys$1(value), 0, (key, _index) => {
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_reducer.mjs
function Reducer(stack, context, schemas, value, check) {
	const results = ConstDeclaration("results", "[]");
	const context_n = schemas.map((_schema, index) => ConstDeclaration(`context_${index}`, New("CheckContext", [])));
	const condition_n = schemas.map((schema, index) => ConstDeclaration(`condition_${index}`, Call(ArrowFunction(["context"], BuildSchema(stack, context, schema, value)), [`context_${index}`])));
	const checks = schemas.map((_schema, index) => If(`condition_${index}`, Call(Member("results", "push"), [`context_${index}`])));
	const returns = Return(And(check, context.Merge("results")));
	return Call(ArrowFunction([], Statements([
		results,
		...context_n,
		...condition_n,
		...checks,
		returns
	])), []);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/allOf.mjs
function BuildAllOfStandard(stack, context, schema, value) {
	return Reducer(stack, context, schema.allOf, value, IsEqual(Member("results", "length"), Constant(schema.allOf.length)));
}
function BuildAllOfFast(stack, context, schema, value) {
	return ReduceAnd(schema.allOf.map((schema) => BuildSchema(stack, context, schema, value)));
}
function BuildAllOf(stack, context, schema, value) {
	return context.UseUnevaluated() ? BuildAllOfStandard(stack, context, schema, value) : BuildAllOfFast(stack, context, schema, value);
}
function CheckAllOf(stack, context, schema, value) {
	const results = schema.allOf.reduce((result, schema) => {
		const nextContext = new CheckContext();
		return CheckSchema(stack, nextContext, schema, value) ? [...result, nextContext] : result;
	}, []);
	return IsEqual$1(results.length, schema.allOf.length) && context.Merge(results);
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
	const isAllOf = IsEqual$1(results.length, schema.allOf.length) && context.Merge(results);
	if (!isAllOf) failedContexts.forEach((failed) => failed.GetErrors().forEach((error) => context.AddError(error)));
	return isAllOf;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/anyOf.mjs
function BuildAnyOfStandard(stack, context, schema, value) {
	return Reducer(stack, context, schema.anyOf, value, IsGreaterThan(Member("results", "length"), Constant(0)));
}
function BuildAnyOfFast(stack, context, schema, value) {
	return ReduceOr(schema.anyOf.map((schema) => BuildSchema(stack, context, schema, value)));
}
function BuildAnyOf(stack, context, schema, value) {
	return context.UseUnevaluated() ? BuildAnyOfStandard(stack, context, schema, value) : BuildAnyOfFast(stack, context, schema, value);
}
function CheckAnyOf(stack, context, schema, value) {
	const results = schema.anyOf.reduce((result, schema) => {
		const nextContext = new CheckContext();
		return CheckSchema(stack, nextContext, schema, value) ? [...result, nextContext] : result;
	}, []);
	return IsGreaterThan$1(results.length, 0) && context.Merge(results);
}
function ErrorAnyOf(stack, context, schemaPath, instancePath, schema, value) {
	const failedContexts = [];
	const results = schema.anyOf.reduce((result, schema, index) => {
		const nextContext = new AccumulatedErrorContext();
		const isSchema = ErrorSchema(stack, nextContext, `${schemaPath}/anyOf/${index}`, instancePath, schema, value);
		if (!isSchema) failedContexts.push(nextContext);
		return isSchema ? [...result, nextContext] : result;
	}, []);
	const isAnyOf = IsGreaterThan$1(results.length, 0) && context.Merge(results);
	if (!isAnyOf) failedContexts.forEach((failed) => failed.GetErrors().forEach((error) => context.AddError(error)));
	return isAnyOf || context.AddError({
		keyword: "anyOf",
		schemaPath,
		instancePath,
		params: {}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/boolean.mjs
function BuildSchemaBoolean(_stack, _context, schema, _value) {
	return schema ? Constant(true) : Constant(false);
}
function CheckSchemaBoolean(_stack, _context, schema, _value) {
	return schema;
}
function ErrorSchemaBoolean(stack, context, schemaPath, instancePath, schema, value) {
	return CheckSchemaBoolean(stack, context, schema, value) || context.AddError({
		keyword: "boolean",
		schemaPath,
		instancePath,
		params: {}
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/const.mjs
function BuildConst(_stack, _context, schema, value) {
	return IsValueLike(schema.const) ? IsEqual(value, Constant(schema.const)) : IsDeepEqual(value, CreateVariable(schema.const));
}
function CheckConst(_stack, _context, schema, value) {
	return IsValueLike(schema.const) ? IsEqual$1(value, schema.const) : IsDeepEqual$1(value, schema.const);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/contains.mjs
function IsValid$3(schema) {
	return !(IsMinContains(schema) && IsEqual$1(schema.minContains, 0));
}
function BuildContainsStandard(stack, context, schema, value) {
	const [item, index] = [Unique(), Unique()];
	return And(Not(IsEqual(Member(value, "length"), Constant(0))), SomeAll(value, [item, index], And(BuildSchema(stack, context, schema.contains, item), context.AddIndex(index))));
}
function BuildContainsFast(stack, context, schema, value) {
	const [item] = [Unique()];
	return And(Not(IsEqual(Member(value, "length"), Constant(0))), Some(value, [item, "_"], BuildSchema(stack, context, schema.contains, item)));
}
function BuildContains(stack, context, schema, value) {
	if (!IsValid$3(schema)) return Constant(true);
	return context.UseUnevaluated() ? BuildContainsStandard(stack, context, schema, value) : BuildContainsFast(stack, context, schema, value);
}
function CheckContains(stack, context, schema, value) {
	if (!IsValid$3(schema)) return true;
	return !IsEqual$1(value.length, 0) && SomeAll$1(value, (item, index) => {
		return CheckSchema(stack, context, schema.contains, item) && context.AddIndex(index);
	});
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/dependencies.mjs
function BuildDependencies(stack, context, schema, value) {
	return Or(IsEqual(Member(Keys(value), "length"), Constant(0)), ReduceAnd(Entries$2(schema.dependencies).map(([key, schema]) => {
		const notKey = Not(HasPropertyKey(value, Constant(key)));
		const isSchema = BuildSchema(stack, context, schema, value);
		const isEveryKey = (schema) => ReduceAnd(schema.map((key) => HasPropertyKey(value, Constant(key))));
		return Or(notKey, IsArray$1(schema) ? isEveryKey(schema) : isSchema);
	})));
}
function CheckDependencies(stack, context, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEvery = Every$1(Entries$2(schema.dependencies), 0, ([key, schema]) => {
		return !HasPropertyKey$1(value, key) || (IsArray$1(schema) ? schema.every((key) => HasPropertyKey$1(value, key)) : CheckSchema(stack, context, schema, value));
	});
	return isLength || isEvery;
}
function ErrorDependencies(stack, context, schemaPath, instancePath, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEvery = EveryAll(Entries$2(schema.dependencies), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/dependencies/${key}`;
		return !HasPropertyKey$1(value, key) || (IsArray$1(schema) ? schema.every((dependency) => HasPropertyKey$1(value, dependency) || context.AddError({
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/dependentRequired.mjs
function BuildDependentRequired(_stack, _context, schema, value) {
	return Or(IsEqual(Member(Keys(value), "length"), Constant(0)), ReduceAnd(Entries$2(schema.dependentRequired).map(([key, keys]) => {
		return Or(Not(HasPropertyKey(value, Constant(key))), ReduceAnd(keys.map((key) => HasPropertyKey(value, Constant(key)))));
	})));
}
function CheckDependentRequired(_stack, _context, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEvery = Every$1(Entries$2(schema.dependentRequired), 0, ([key, keys]) => {
		return !HasPropertyKey$1(value, key) || keys.every((key) => HasPropertyKey$1(value, key));
	});
	return isLength || isEvery;
}
function ErrorDependentRequired(_stack, context, schemaPath, instancePath, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEveryEntry = EveryAll(Entries$2(schema.dependentRequired), 0, ([key, keys]) => {
		return !HasPropertyKey$1(value, key) || EveryAll(keys, 0, (dependency) => HasPropertyKey$1(value, dependency) || context.AddError({
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/dependentSchemas.mjs
function BuildDependentSchemas(stack, context, schema, value) {
	return Or(IsEqual(Member(Keys(value), "length"), Constant(0)), ReduceAnd(Entries$2(schema.dependentSchemas).map(([key, schema]) => {
		return Or(Not(HasPropertyKey(value, Constant(key))), BuildSchema(stack, context, schema, value));
	})));
}
function CheckDependentSchemas(stack, context, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEvery = Every$1(Entries$2(schema.dependentSchemas), 0, ([key, schema]) => {
		return !HasPropertyKey$1(value, key) || CheckSchema(stack, context, schema, value);
	});
	return isLength || isEvery;
}
function ErrorDependentSchemas(stack, context, schemaPath, instancePath, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEvery = EveryAll(Entries$2(schema.dependentSchemas), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/dependentSchemas/${key}`;
		return !HasPropertyKey$1(value, key) || ErrorSchema(stack, context, nextSchemaPath, instancePath, schema, value);
	});
	return isLength || isEvery;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/dynamicRef.mjs
function BuildDynamicRef(stack, context, schema, value) {
	return CreateFunction(stack, context, stack.DynamicRef(schema) ?? false, value);
}
function CheckDynamicRef(stack, context, schema, value) {
	const target = stack.DynamicRef(schema) ?? false;
	return IsSchema(target) && CheckSchema(stack, context, target, value);
}
function ErrorDynamicRef(stack, context, _schemaPath, instancePath, schema, value) {
	const target = stack.DynamicRef(schema) ?? false;
	return IsSchema(target) && ErrorSchema(stack, context, "#", instancePath, target, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/enum.mjs
function BuildEnum(_stack, _context, schema, value) {
	return ReduceOr(schema.enum.map((option) => {
		if (IsValueLike(option)) return IsEqual(value, Constant(option));
		return IsDeepEqual(value, CreateVariable(option));
	}));
}
function CheckEnum(_stack, _context, schema, value) {
	return Some$1(schema.enum, (option) => IsValueLike(option) ? IsEqual$1(value, option) : IsDeepEqual$1(value, option));
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/exclusiveMaximum.mjs
function BuildExclusiveMaximum(_stack, _context, schema, value) {
	return IsLessThan(value, Constant(schema.exclusiveMaximum));
}
function CheckExclusiveMaximum(_stack, _context, schema, value) {
	return IsLessThan$1(value, schema.exclusiveMaximum);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/exclusiveMinimum.mjs
function BuildExclusiveMinimum(_stack, _context, schema, value) {
	return IsGreaterThan(value, Constant(schema.exclusiveMinimum));
}
function CheckExclusiveMinimum(_stack, _context, schema, value) {
	return IsGreaterThan$1(value, schema.exclusiveMinimum);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/date.mjs
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
* @description https://datatracker.ietf.org/doc/html/rfc3339
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/time.mjs
const TIME = /^(\d\d):(\d\d):(\d\d)(?:\.\d+)?(?:([Zz])|([+-])(\d\d):(\d\d))?$/;
/**
* Returns true if the value is an ISO time string
* @specification https://datatracker.ietf.org/doc/html/rfc3339
*/
function IsTime(value, strictTimeZone = true) {
	const matches = TIME.exec(value);
	if (!matches) return false;
	if (strictTimeZone && !matches[4] && !matches[5]) return false;
	const hr = +matches[1];
	const min = +matches[2];
	const sec = +matches[3];
	if (hr > 23 || min > 59 || sec > 60) return false;
	if (matches[5]) {
		const tzH = +matches[6];
		const tzM = +matches[7];
		if (tzH > 23 || tzM > 59) return false;
	}
	if (sec < 60) return true;
	const tzSign = matches[5] === "-" ? -1 : 1;
	const tzH = +(matches[6] || 0);
	const tzM = +(matches[7] || 0);
	return ((hr * 60 + min - tzSign * (tzH * 60 + tzM)) % 1440 + 1440) % 1440 === 1439;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/date_time.mjs
/**
* Returns true if the value is a ISO8601 DateTime string
* @specification https://datatracker.ietf.org/doc/html/rfc3339
* @example `2020-12-12T20:20:40+00:00`
*/
function IsDateTime(value) {
	const dateTime = value.split(/T/i);
	return dateTime.length === 2 && IsDate(dateTime[0]) && IsTime(dateTime[1]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/duration.mjs
const Duration = /^P((\d+Y(\d+M(\d+D)?)?|\d+M(\d+D)?|\d+D)(T(\d+H(\d+M(\d+S)?)?|\d+M(\d+S)?|\d+S))?|T(\d+H(\d+M(\d+S)?)?|\d+M(\d+S)?|\d+S)|\d+W)$/;
/**
* Returns true if the value is a valid ISO-8601 duration.
* @specification https://tools.ietf.org/html/rfc3339
*/
function IsDuration(value) {
	return Duration.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/email.mjs
const Email = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[^"\\]|\\.)*")@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*|\[(?:IPv6:[a-f0-9:]+|(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})\])$/i;
/**
* Returns true if the value is an Email
* @specification https://datatracker.ietf.org/doc/html/rfc5322
*/
function IsEmail(value) {
	return Email.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idna/pattern/pattern.mjs
const RE_RULE_HYPHEN_PLACEMENT = /^(?!-).*(?<!-)$/;
const RE_RULE_NOT_RESERVED_ACE = /^(?!..--)/;
const RE_ASCII_LDH = /^[a-zA-Z0-9-]*$/;
const RE_NON_ASCII = /[^\p{ASCII}]/u;
const RE_ASCII_DIGIT = /[0-9]/;
const RE_ARABIC_INDIC_DIGIT = /[\u{0660}-\u{0669}]/u;
const RE_EXT_ARABIC_INDIC_DIGIT = /[\u{06f0}-\u{06f9}]/u;
const RE_COMMON_SEPARATOR = /[\u{002e}\u{002c}\u{003a}\u{002f}]/u;
const RE_EUROPEAN_SEPARATOR = /[\u{002d}\u{002b}]/u;
const RE_MARK_NONSPACING = /\p{Mn}/u;
const RE_MARK_SPACING_COMBINING = /\p{Mc}/u;
const RE_COMBINING_MARK = /[\p{Mn}\p{Mc}\p{Me}]/u;
const RE_LETTER = /\p{L}/u;
const RE_NUMBER_DECIMAL = /\p{Nd}/u;
const RE_SCRIPT_GREEK = /\p{Script=Greek}/u;
const RE_SCRIPT_HEBREW = /\p{Script=Hebrew}/u;
const RE_SCRIPT_JAPANESE = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;
const RE_SCRIPT_ARABIC_LETTER = /[\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Mandaic}]/u;
const RE_VIRAMA = /[\u{094d}\u{09cd}\u{0a4d}\u{0acd}\u{0b4d}\u{0bcd}\u{0c4d}\u{0ccd}\u{0d3b}\u{0d3c}\u{0d4d}\u{0dca}\u{1b44}\u{1baa}\u{1bab}\u{a9c0}\u{11046}\u{1107f}\u{110b9}\u{11133}\u{11134}\u{111c0}\u{11235}\u{1134d}\u{11442}\u{114c2}\u{115bf}\u{1163f}\u{116b6}\u{11c3f}\u{11d44}\u{11d45}]/u;
const RE_RFC5892_DISALLOWED = /[\u{0640}\u{07fa}\u{302e}\u{302f}\u{3031}\u{3032}\u{3033}\u{3034}\u{3035}\u{303b}]/u;
const RE_CONTEXTO_EXCEPTIONS = /[\u{00b7}\u{0375}\u{05f3}\u{05f4}\u{200c}\u{200d}\u{30fb}]/u;
const RE_PVALID_EXCEPTIONS = /[\u{00df}\u{03c2}\u{06fd}\u{06fe}\u{0f0b}\u{3007}]/u;
const RE_EUROPEAN_NUMBER = new RegExp([RE_ASCII_DIGIT, RE_EXT_ARABIC_INDIC_DIGIT].map((regexp) => regexp.source).join("|"), "u");
const RE_PERMITTED_CATEGORY = new RegExp([
	RE_LETTER,
	RE_EUROPEAN_SEPARATOR,
	RE_COMMON_SEPARATOR,
	RE_NUMBER_DECIMAL,
	RE_MARK_NONSPACING,
	RE_MARK_SPACING_COMBINING,
	RE_CONTEXTO_EXCEPTIONS,
	RE_PVALID_EXCEPTIONS
].map((regexp) => regexp.source).join("|"), "u");
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idna/label/ascii.mjs
function IsAsciiLabel(value) {
	return RE_RULE_HYPHEN_PLACEMENT.test(value) && RE_RULE_NOT_RESERVED_ACE.test(value) && RE_ASCII_LDH.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idna/format/puny.mjs
const PUNYCODE_BASE = 36;
const PUNYCODE_TMIN = 1;
const PUNYCODE_TMAX = 26;
const PUNYCODE_SKEW = 38;
const PUNYCODE_DAMP = 700;
const PUNYCODE_INITIAL_BIAS = 72;
const PUNYCODE_INITIAL_N = 128;
function ThrowDontCare() {
	throw null;
}
function IsAcePrefixed(value) {
	return value.toLowerCase().startsWith("xn--");
}
function Adapt(delta, numPoints, firstTime) {
	delta = firstTime ? Math.floor(delta / PUNYCODE_DAMP) : delta >> 1;
	delta += Math.floor(delta / numPoints);
	let k = 0;
	while (delta > 455) {
		delta = Math.floor(delta / 35);
		k += PUNYCODE_BASE;
	}
	return k + Math.floor(36 * delta / (delta + PUNYCODE_SKEW));
}
function Decode(value) {
	const output = [];
	let n = PUNYCODE_INITIAL_N;
	let i = 0;
	let bias = PUNYCODE_INITIAL_BIAS;
	const delimIdx = value.lastIndexOf("-");
	if (delimIdx > 0) for (let j = 0; j < delimIdx; j++) {
		const cp = value.charCodeAt(j);
		if (cp >= 128) ThrowDontCare();
		output.push(cp);
	}
	let inIdx = delimIdx < 0 ? 0 : delimIdx + 1;
	while (inIdx < value.length) {
		const oldi = i;
		let w = 1;
		let k = PUNYCODE_BASE;
		while (true) {
			if (inIdx >= value.length) ThrowDontCare();
			const ch = value.charCodeAt(inIdx++);
			let digit;
			if (ch >= 97 && ch <= 122) digit = ch - 97;
			else if (ch >= 48 && ch <= 57) digit = ch - 48 + 26;
			else ThrowDontCare();
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
	return String.fromCodePoint(...output);
}
function DigitToChar(digit) {
	return digit < 26 ? String.fromCharCode(digit + 97) : String.fromCharCode(digit - 26 + 48);
}
const RE_REPLACE_NON_ASCII = new RegExp(RE_NON_ASCII.source, "gu");
function Encode(input) {
	const basic = input.replace(RE_REPLACE_NON_ASCII, "");
	const basicLength = basic.length;
	const result = basicLength > 0 ? [basic, "-"] : [];
	const codePoints = Array.from(input, (char) => char.codePointAt(0));
	let n = PUNYCODE_INITIAL_N;
	let delta = 0;
	let bias = PUNYCODE_INITIAL_BIAS;
	let handledCPCount = basicLength;
	while (handledCPCount < codePoints.length) {
		let m = Infinity;
		for (const cp of codePoints) if (cp >= n && cp < m) m = cp;
		delta += (m - n) * (handledCPCount + 1);
		n = m;
		for (const cp of codePoints) {
			if (cp < n) delta++;
			if (cp === n) {
				let q = delta;
				for (let k = PUNYCODE_BASE;; k += PUNYCODE_BASE) {
					const t = k <= bias ? PUNYCODE_TMIN : k >= bias + PUNYCODE_TMAX ? PUNYCODE_TMAX : k - bias;
					if (q < t) break;
					const digit = t + (q - t) % (PUNYCODE_BASE - t);
					result.push(DigitToChar(digit));
					q = Math.floor((q - t) / (PUNYCODE_BASE - t));
				}
				result.push(DigitToChar(q));
				bias = Adapt(delta, handledCPCount + 1, handledCPCount === basicLength);
				delta = 0;
				handledCPCount++;
			}
		}
		delta++;
		n++;
	}
	return result.join("");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idna/format/bidi.mjs
const RE_RTL_ALLOWED = /^(?:R|AL|AN|EN|ES|CS|ET|ON|BN|NSM)$/;
const RE_LTR_ALLOWED = /^(?:L|EN|ES|CS|ET|ON|BN|NSM)$/;
const RE_RTL_CLASSES = /^(?:R|AL|AN)$/;
function HasBidiChars(value) {
	if (IsAcePrefixed(value)) try {
		return HasRightToLeftCharacters(Decode(value.slice(4).toLowerCase()));
	} catch {
		return false;
	}
	return HasRightToLeftCharacters(value);
}
function GetBidiClass(codePoint) {
	const char = String.fromCodePoint(codePoint);
	return RE_EUROPEAN_NUMBER.test(char) ? "EN" : RE_ARABIC_INDIC_DIGIT.test(char) ? "AN" : RE_MARK_NONSPACING.test(char) ? "NSM" : RE_SCRIPT_HEBREW.test(char) ? "R" : RE_SCRIPT_ARABIC_LETTER.test(char) ? "AL" : RE_LETTER.test(char) ? "L" : "ON";
}
function HasRightToLeftCharacters(value) {
	for (const ch of value) if (RE_RTL_CLASSES.test(GetBidiClass(ch.codePointAt(0)))) return true;
	return false;
}
function SatisfiesBidiRule(value) {
	let isRtl = false;
	let allowed = RE_LTR_ALLOWED;
	let sawEN = false;
	let sawAN = false;
	let isFirst = true;
	for (const ch of value) {
		const bidiClass = GetBidiClass(ch.codePointAt(0));
		if (isFirst) {
			if (bidiClass !== "L" && bidiClass !== "R" && bidiClass !== "AL") return false;
			isRtl = bidiClass === "R" || bidiClass === "AL";
			allowed = isRtl ? RE_RTL_ALLOWED : RE_LTR_ALLOWED;
			isFirst = false;
		}
		if (!allowed.test(bidiClass)) return false;
		if (bidiClass === "EN") sawEN = true;
		else if (bidiClass === "AN") sawAN = true;
	}
	if (isRtl && sawEN && sawAN) return false;
	return true;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idna/label/unicode.mjs
function ExceedsMaxALabelLength(value) {
	return RE_NON_ASCII.test(value) && Encode(value).length + 4 > 63;
}
function HasInvalidHyphens(chars) {
	if (chars[0] === "-" || chars[chars.length - 1] === "-") return true;
	return chars.slice(2).join("").startsWith("--");
}
function IsUnicodeLabel(value) {
	if (ExceedsMaxALabelLength(value)) return false;
	if (HasRightToLeftCharacters(value) && !SatisfiesBidiRule(value)) return false;
	const chars = [...value];
	const codePoints = chars.map((c) => c.codePointAt(0));
	const length = codePoints.length;
	if (HasInvalidHyphens(chars)) return false;
	if (RE_COMBINING_MARK.test(chars[0])) return false;
	let hasJapanese = false;
	for (let i = 0; i < length; i++) {
		const codePoint = codePoints[i];
		const char = chars[i];
		if (RE_RFC5892_DISALLOWED.test(char)) return false;
		if (!RE_PERMITTED_CATEGORY.test(char)) return false;
		if (RE_SCRIPT_JAPANESE.test(char)) hasJapanese = true;
		const prev = codePoints[i - 1], next = codePoints[i + 1];
		switch (codePoint) {
			case 183:
				if (prev !== 108 || next !== 108) return false;
				break;
			case 885:
				if (!next || !RE_SCRIPT_GREEK.test(chars[i + 1])) return false;
				break;
			case 1523:
			case 1524:
				if (!prev || !RE_SCRIPT_HEBREW.test(chars[i - 1])) return false;
				break;
			case 8204:
				if (!prev || prev < 128 && !RE_VIRAMA.test(chars[i - 1])) return false;
				break;
			case 8205: if (!prev || !RE_VIRAMA.test(chars[i - 1])) return false;
		}
	}
	if (value.includes("・") && !hasJapanese) return false;
	return true;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idna/label/puny.mjs
function IsPunyLabel(value) {
	if (!IsAcePrefixed(value)) return false;
	try {
		const body = value.slice(4).toLowerCase();
		if (body.lastIndexOf("-") === 0) return false;
		const decoded = Decode(body);
		if (!RE_NON_ASCII.test(decoded)) return false;
		return IsUnicodeLabel(decoded);
	} catch {
		return false;
	}
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idna/hostname.mjs
function IsValidLabelLength$1(value) {
	return value.length > 0 && value.length <= 63;
}
function IsLabel$1(value) {
	return IsValidLabelLength$1(value) && (IsPunyLabel(value) || IsAsciiLabel(value));
}
function IsHostname$1(value) {
	if (value.length === 0 || value.length > 253) return false;
	if (value.charCodeAt(value.length - 1) === 46) return false;
	return value.split(".").every((label) => IsLabel$1(label));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idna/idn-hostname.mjs
function IsValidLabelLength(value) {
	return value.length > 0 && value.length <= 63;
}
function IsLabel(value) {
	return IsValidLabelLength(value) && (IsPunyLabel(value) || IsUnicodeLabel(value));
}
function NormalizeHostname(value) {
	return value.normalize("NFC").replace(/[\u002E\u3002\uFF0E\uFF61]/g, ".");
}
function IsIdnHostname$1(value) {
	if (value.length === 0 || value.includes(" ")) return false;
	const normalized = NormalizeHostname(value);
	if (normalized.length > 253) return false;
	const labels = normalized.split(".");
	const hasBidiChars = labels.some((label) => HasBidiChars(label));
	return labels.every((label) => IsLabel(label) && (!hasBidiChars || SatisfiesBidiRule(label)));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/hostname.mjs
/**
* Returns true if the value is a valid hostname.
* @specification https://tools.ietf.org/html/rfc1123
* @specification https://tools.ietf.org/html/rfc5891
* @specification https://tools.ietf.org/html/rfc5892
*/
function IsHostname(value) {
	return IsHostname$1(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idn_email.mjs
const IdnEmail = /^(?:[A-Za-z0-9!#$%&'*+\/=?^_`{|}~\u{0080}-\u{10FFFF}-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~\u{0080}-\u{10FFFF}-]+)*|"(?:[^"\\]|\\.)*")@[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,62})(?<!-)(?:\.[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,62})(?<!-))*$/iu;
/**
* Returns true if the value is an IdnEmail
* @specification https://datatracker.ietf.org/doc/html/rfc4952
*/
function IsIdnEmail(value) {
	return IdnEmail.test(value.normalize("NFC"));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/idn_hostname.mjs
/**
* Returns true if the value is a valid internationalized (IDN) hostname.
* @specification https://tools.ietf.org/html/rfc3490
* @specification https://tools.ietf.org/html/rfc5891
* @specification https://tools.ietf.org/html/rfc5892
* @specification https://tools.ietf.org/html/rfc5893
*/
function IsIdnHostname(value) {
	return IsIdnHostname$1(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/ipv4.mjs
const IPv4 = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
/**
* Returns true if the value is a IPV4 address
* @specification http://tools.ietf.org/html/rfc2673#section-3.2
*/
function IsIPv4(value) {
	return IPv4.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/ipv6.mjs
const IPv6 = /^(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:)?[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)$/i;
/**
* Returns true if the value is an IPv6 address
* @specification http://tools.ietf.org/html/rfc2373#section-2.2
*/
function IsIPv6(value) {
	return IPv6.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/iri_reference.mjs
const InvalidIriChars$1 = /[\x00-\x20\x7F\\]|%(?![0-9a-fA-F]{2})/;
const MalformedScheme = /^[a-zA-Z][a-zA-Z0-9+\-.]*\/\//;
/**
* Returns true if the value is an IRI reference
* @specification https://tools.ietf.org/html/rfc3987
*/
function IsIriReference(value) {
	return !InvalidIriChars$1.test(value) && !MalformedScheme.test(value) && URL.canParse(value, "http://example.com");
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/iri.mjs
const IpvFutureMatchMaxLength = 2048;
const IpvFutureMatch = /\[[vV][0-9a-fA-F]+\.[^\]]+\]/;
const InvalidIriChars = /[\x00-\x20<>\^`{|}\\]/;
function NarrowIpvFuture(value) {
	return value.length < IpvFutureMatchMaxLength ? value.replace(IpvFutureMatch, "[::1]") : value;
}
/**
* Returns true if the value is a valid Internationalized Resource Identifier.
* @specification https://datatracker.ietf.org/doc/html/rfc3987
*/
function IsIri(value) {
	if (InvalidIriChars.test(value)) return false;
	return URL.canParse(NarrowIpvFuture(value));
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/json_pointer_uri_fragment.mjs
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/json_pointer.mjs
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/regex.mjs
/**
* Returns true if the value is a regular expression string pattern
* @specification https://ecma-international.org/ecma-262
*/
function IsRegex(value) {
	try {
		new RegExp(value, "u");
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/relative_json_pointer.mjs
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/uri_reference.mjs
const UriReference = /^(?:[a-z][a-z0-9+\-.]*:(?:\/\/(?:(?:[-a-z0-9._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:[\da-f]{1,4}:){6}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|::(?:[\da-f]{1,4}:){5}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:[\da-f]{1,4})?::(?:[\da-f]{1,4}:){4}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,1}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){3}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,2}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){2}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,3}[\da-f]{1,4})?::[\da-f]{1,4}:(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,4}[\da-f]{1,4})?::(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,5}[\da-f]{1,4})?::[\da-f]{1,4}|(?:(?:[\da-f]{1,4}:){0,6}[\da-f]{1,4})?::)|v[0-9a-f]+\.[-a-z0-9._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[-a-z0-9._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:\/\/(?:(?:[-a-z0-9._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:[\da-f]{1,4}:){6}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|::(?:[\da-f]{1,4}:){5}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:[\da-f]{1,4})?::(?:[\da-f]{1,4}:){4}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,1}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){3}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,2}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){2}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,3}[\da-f]{1,4})?::[\da-f]{1,4}:(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,4}[\da-f]{1,4})?::(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,5}[\da-f]{1,4})?::[\da-f]{1,4}|(?:(?:[\da-f]{1,4}:){0,6}[\da-f]{1,4})?::)|v[0-9a-f]+\.[-a-z0-9._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[-a-z0-9._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[-a-z0-9._~!$&'()*+,;=@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\?(?:[-a-z0-9._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[-a-z0-9._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
/**
* Returns true if the value is a valid Uri Reference.
* @specification https://tools.ietf.org/html/rfc3986
*/
function IsUriReference(value) {
	return UriReference.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/uri_template.mjs
const UriTemplate = /^(?:(?:[^\x00-\x20"<>%\\^`{|}\x7f]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?:\.(?:[a-z0-9_]|%[0-9a-f]{2})+)*(?::[1-9]\d{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?:\.(?:[a-z0-9_]|%[0-9a-f]{2})+)*(?::[1-9]\d{0,3}|\*)?)*\})*$/i;
/**
* Returns true if the value is a valid Uri Template
* @specification https://datatracker.ietf.org/doc/html/rfc6570
*/
function IsUriTemplate(value) {
	return UriTemplate.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/uri.mjs
const Uri = /^[a-z][a-z0-9+\-.]*:(?:\/\/(?:(?:[-a-z0-9._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:[\da-f]{1,4}:){6}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|::(?:[\da-f]{1,4}:){5}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:[\da-f]{1,4})?::(?:[\da-f]{1,4}:){4}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,1}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){3}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,2}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){2}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,3}[\da-f]{1,4})?::[\da-f]{1,4}:(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,4}[\da-f]{1,4})?::(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,5}[\da-f]{1,4})?::[\da-f]{1,4}|(?:(?:[\da-f]{1,4}:){0,6}[\da-f]{1,4})?::)|v[0-9a-f]+\.[-a-z0-9._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[-a-z0-9._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[-a-z0-9._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[-a-z0-9._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
/**
* Returns true if the value is a valid Uniform Resource Identifier.
* @specification https://tools.ietf.org/html/rfc3986
*/
function IsUri(value) {
	return Uri.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/url.mjs
/**
* Returns true if the value is a valid Uniform Resource Locator
* @specification https://datatracker.ietf.org/doc/html/rfc3986
* @specification https://datatracker.ietf.org/doc/html/rfc3987
*/
function IsUrl(value) {
	return URL.canParse(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/uuid.mjs
const Uuid = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
/**
* Returns true if the value is a uuid
* @specification https://www.rfc-editor.org/info/rfc4122/
* @specification https://www.rfc-editor.org/info/rfc9562/
*/
function IsUuid(value) {
	return Uuid.test(value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/_registry.mjs
const formats = /* @__PURE__ */ new Map();
/** Clears all entries */
function Clear() {
	formats.clear();
}
/** Returns format entries in this registry */
function Entries() {
	return [...formats.entries()];
}
/** Sets a format */
function Set$1(format, check) {
	formats.set(format, check);
}
/** Returns true if the registry has this format */
function Has(format) {
	return formats.has(format);
}
/** Gets a format or undefined if not exists */
function Get$1(format) {
	return formats.get(format);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/format/format.mjs
var format_exports = /* @__PURE__ */ __exportAll({
	Clear: () => Clear,
	Entries: () => Entries,
	Get: () => Get$1,
	Has: () => Has,
	IsDate: () => IsDate,
	IsDateTime: () => IsDateTime,
	IsDuration: () => IsDuration,
	IsEmail: () => IsEmail,
	IsHostname: () => IsHostname,
	IsIPv4: () => IsIPv4,
	IsIPv6: () => IsIPv6,
	IsIdnEmail: () => IsIdnEmail,
	IsIdnHostname: () => IsIdnHostname,
	IsIri: () => IsIri,
	IsIriReference: () => IsIriReference,
	IsJsonPointer: () => IsJsonPointer,
	IsJsonPointerUriFragment: () => IsJsonPointerUriFragment,
	IsRegex: () => IsRegex,
	IsRelativeJsonPointer: () => IsRelativeJsonPointer,
	IsTime: () => IsTime,
	IsUri: () => IsUri,
	IsUriReference: () => IsUriReference,
	IsUriTemplate: () => IsUriTemplate,
	IsUrl: () => IsUrl,
	IsUuid: () => IsUuid,
	Reset: () => Reset,
	Set: () => Set$1,
	Test: () => Test
});
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/format.mjs
function BuildFormat(_stack, _context, schema, value) {
	return Call(Member("Format", "Test"), [Constant(schema.format), value]);
}
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/if.mjs
function BuildIf(stack, context, schema, value) {
	const thenSchema = IsThen(schema) ? schema.then : true;
	const elseSchema = IsElse(schema) ? schema.else : true;
	return Ternary(BuildSchema(stack, context, schema.if, value), BuildSchema(stack, context, thenSchema, value), BuildSchema(stack, context, elseSchema, value));
}
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/items.mjs
function BuildItemsSizedStandard(stack, context, schema, value) {
	return ReduceAnd(schema.items.map((schema, index) => {
		return Or(IsLessEqualThan(Member(value, "length"), Constant(index)), And(BuildSchemaPushStack(stack, context, schema, `${value}[${index}]`), context.AddIndex(Constant(index))));
	}));
}
function BuildItemsSizedFast(stack, context, schema, value) {
	return ReduceAnd(schema.items.map((schema, index) => {
		return Or(IsLessEqualThan(Member(value, "length"), Constant(index)), BuildSchemaPushStack(stack, context, schema, `${value}[${index}]`));
	}));
}
function BuildItemsSized(stack, context, schema, value) {
	return context.UseUnevaluated() ? BuildItemsSizedStandard(stack, context, schema, value) : BuildItemsSizedFast(stack, context, schema, value);
}
function CheckItemsSized(stack, context, schema, value) {
	return Every$1(schema.items, 0, (schema, index) => {
		return IsLessEqualThan$1(value.length, index) || CheckSchemaPushStack(stack, context, schema, value[index]) && context.AddIndex(index);
	});
}
function ErrorItemsSized(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(schema.items, 0, (schema, index) => {
		const nextSchemaPath = `${schemaPath}/items/${index}`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessEqualThan$1(value.length, index) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index);
	});
}
function BuildItemsUnsizedStandard(stack, context, schema, value) {
	const offset = IsPrefixItems(schema) ? schema.prefixItems.length : 0;
	const isSchema = BuildSchemaPushStack(stack, context, schema.items, "element");
	const addIndex = context.AddIndex("index");
	return Every(value, Constant(offset), ["element", "index"], And(isSchema, addIndex));
}
function BuildItemsUnsizedFast(stack, context, schema, value) {
	const offset = IsPrefixItems(schema) ? schema.prefixItems.length : 0;
	const isSchema = BuildSchemaPushStack(stack, context, schema.items, "element");
	return Every(value, Constant(offset), ["element", "index"], isSchema);
}
function BuildItemsUnsized(stack, context, schema, value) {
	return context.UseUnevaluated() ? BuildItemsUnsizedStandard(stack, context, schema, value) : BuildItemsUnsizedFast(stack, context, schema, value);
}
function CheckItemsUnsized(stack, context, schema, value) {
	return Every$1(value, IsPrefixItems(schema) ? schema.prefixItems.length : 0, (element, index) => {
		return CheckSchemaPushStack(stack, context, schema.items, element) && context.AddIndex(index);
	});
}
function ErrorItemsUnsized(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(value, IsPrefixItems(schema) ? schema.prefixItems.length : 0, (element, index) => {
		return ErrorSchemaPushStack(stack, context, `${schemaPath}/items`, `${instancePath}/${index}`, schema.items, element) && context.AddIndex(index);
	});
}
function BuildItems(stack, context, schema, value) {
	return IsItemsSized(schema) ? BuildItemsSized(stack, context, schema, value) : BuildItemsUnsized(stack, context, schema, value);
}
function CheckItems(stack, context, schema, value) {
	return IsItemsSized(schema) ? CheckItemsSized(stack, context, schema, value) : CheckItemsUnsized(stack, context, schema, value);
}
function ErrorItems(stack, context, schemaPath, instancePath, schema, value) {
	return IsItemsSized(schema) ? ErrorItemsSized(stack, context, schemaPath, instancePath, schema, value) : ErrorItemsUnsized(stack, context, schemaPath, instancePath, schema, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/maxContains.mjs
function IsValid$2(schema) {
	return IsContains(schema);
}
function BuildMaxContains(stack, context, schema, value) {
	if (!IsValid$2(schema)) return Constant(true);
	const [item] = [Unique()];
	return IsLessEqualThan(Counted(value, [item, "_"], BuildSchema(stack, context, schema.contains, item)), Constant(schema.maxContains));
}
function CheckMaxContains(stack, context, schema, value) {
	if (!IsValid$2(schema)) return true;
	return IsLessEqualThan$1(Counted$1(value, (item) => CheckSchema(stack, context, schema.contains, item)), schema.maxContains);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/maximum.mjs
function BuildMaximum(_stack, _context, schema, value) {
	return IsLessEqualThan(value, Constant(schema.maximum));
}
function CheckMaximum(_stack, _context, schema, value) {
	return IsLessEqualThan$1(value, schema.maximum);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/maxItems.mjs
function BuildMaxItems(_stack, _context, schema, value) {
	return IsLessEqualThan(Member(value, "length"), Constant(schema.maxItems));
}
function CheckMaxItems(_stack, _context, schema, value) {
	return IsLessEqualThan$1(value.length, schema.maxItems);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/maxLength.mjs
function BuildMaxLength(_stack, _context, schema, value) {
	return IsMaxLength$1(value, Constant(schema.maxLength));
}
function CheckMaxLength(_stack, _context, schema, value) {
	return IsMaxLength$2(value, schema.maxLength);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/maxProperties.mjs
function BuildMaxProperties(_stack, _context, schema, value) {
	return IsLessEqualThan(Member(Keys(value), "length"), Constant(schema.maxProperties));
}
function CheckMaxProperties(_stack, _context, schema, value) {
	return IsLessEqualThan$1(Keys$1(value).length, schema.maxProperties);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/minContains.mjs
function IsValid$1(schema) {
	return IsContains(schema);
}
function BuildMinContainsStandard(stack, context, schema, value) {
	const [item, index] = [Unique(), Unique()];
	return IsGreaterEqualThan(Counted(value, [item, index], And(BuildSchema(stack, context, schema.contains, item), context.AddIndex(index))), Constant(schema.minContains));
}
function BuildMinContainsFast(stack, context, schema, value) {
	const [item] = [Unique()];
	return IsGreaterEqualThan(Counted(value, [item, "_"], BuildSchema(stack, context, schema.contains, item)), Constant(schema.minContains));
}
function BuildMinContains(stack, context, schema, value) {
	if (!IsValid$1(schema)) return Constant(true);
	return context.UseUnevaluated() ? BuildMinContainsStandard(stack, context, schema, value) : BuildMinContainsFast(stack, context, schema, value);
}
function CheckMinContains(stack, context, schema, value) {
	if (!IsValid$1(schema)) return true;
	return IsGreaterEqualThan$1(Counted$1(value, (item, index) => CheckSchema(stack, context, schema.contains, item) && context.AddIndex(index)), schema.minContains);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/minimum.mjs
function BuildMinimum(_stack, _context, schema, value) {
	return IsGreaterEqualThan(value, Constant(schema.minimum));
}
function CheckMinimum(_stack, _context, schema, value) {
	return IsGreaterEqualThan$1(value, schema.minimum);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/minItems.mjs
function BuildMinItems(_stack, _context, schema, value) {
	return IsGreaterEqualThan(Member(value, "length"), Constant(schema.minItems));
}
function CheckMinItems(_stack, _context, schema, value) {
	return IsGreaterEqualThan$1(value.length, schema.minItems);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/minLength.mjs
function BuildMinLength(_stack, _context, schema, value) {
	return IsMinLength$1(value, Constant(schema.minLength));
}
function CheckMinLength(_stack, _context, schema, value) {
	return IsMinLength$2(value, schema.minLength);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/minProperties.mjs
function BuildMinProperties(_stack, _context, schema, value) {
	return IsGreaterEqualThan(Member(Keys(value), "length"), Constant(schema.minProperties));
}
function CheckMinProperties(_stack, _context, schema, value) {
	return IsGreaterEqualThan$1(Keys$1(value).length, schema.minProperties);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/multipleOf.mjs
function BuildMultipleOf(_stack, _context, schema, value) {
	return MultipleOf(value, Constant(schema.multipleOf));
}
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/not.mjs
function BuildNotStandard(stack, context, schema, value) {
	return Reducer(stack, context, [schema.not], value, Not(IsEqual(Member("results", "length"), Constant(1))));
}
function BuildNotFast(stack, context, schema, value) {
	return Not(BuildSchema(stack, context, schema.not, value));
}
function BuildNot(stack, context, schema, value) {
	return context.UseUnevaluated() ? BuildNotStandard(stack, context, schema, value) : BuildNotFast(stack, context, schema, value);
}
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/oneOf.mjs
function BuildOneOfStandard(stack, context, schema, value) {
	return Reducer(stack, context, schema.oneOf, value, IsEqual(Member("results", "length"), Constant(1)));
}
function BuildOneOfFast(stack, context, schema, value) {
	const [result] = [Unique()];
	return IsEqual(Counted(ArrayLiteral(schema.oneOf.map((schema) => BuildSchema(stack, context, schema, value))), [result, "_"], IsEqual(result, Constant(true))), Constant(1));
}
function BuildOneOf(stack, context, schema, value) {
	return context.UseUnevaluated() ? BuildOneOfStandard(stack, context, schema, value) : BuildOneOfFast(stack, context, schema, value);
}
function CheckOneOf(stack, context, schema, value) {
	const passedContexts = schema.oneOf.reduce((result, schema) => {
		const nextContext = new CheckContext();
		return CheckSchema(stack, nextContext, schema, value) ? [...result, nextContext] : result;
	}, []);
	return IsEqual$1(passedContexts.length, 1) && context.Merge(passedContexts);
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
	const isOneOf = IsEqual$1(passedContexts.length, 1) && context.Merge(passedContexts);
	if (!isOneOf && IsEqual$1(passingSchemas.length, 0)) failedContexts.forEach((failed) => failed.GetErrors().forEach((error) => context.AddError(error)));
	return isOneOf || context.AddError({
		keyword: "oneOf",
		schemaPath,
		instancePath,
		params: { passingSchemas }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/pattern.mjs
function BuildPattern(_stack, _context, schema, value) {
	return Call(Member(CreateVariable(IsString$2(schema.pattern) ? UnicodeRegExp(schema.pattern) : schema.pattern), "test"), [value]);
}
function CheckPattern(_stack, _context, schema, value) {
	return (IsString$2(schema.pattern) ? UnicodeRegExp(schema.pattern) : schema.pattern).test(value);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/patternProperties.mjs
function BuildPatternProperties(stack, context, schema, value) {
	return ReduceAnd(Entries$2(schema.patternProperties).map(([pattern, schema]) => {
		const [key, prop] = [Unique(), Unique()];
		const notKey = Not(Call(Member(CreateVariable(UnicodeRegExp(pattern)), "test"), [key]));
		const isSchema = BuildSchemaPushStack(stack, context, schema, prop);
		const addKey = context.AddKey(key);
		const guarded = context.UseUnevaluated() ? Or(notKey, And(isSchema, addKey)) : Or(notKey, isSchema);
		return Every(Entries$1(value), Constant(0), [`[${key}, ${prop}]`, "_"], guarded);
	}));
}
function CheckPatternProperties(stack, context, schema, value) {
	return Every$1(Entries$2(schema.patternProperties), 0, ([pattern, schema]) => {
		const regexp = UnicodeRegExp(pattern);
		return Every$1(Entries$2(value), 0, ([key, prop]) => {
			return !regexp.test(key) || CheckSchemaPushStack(stack, context, schema, prop) && context.AddKey(key);
		});
	});
}
function ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(Entries$2(schema.patternProperties), 0, ([pattern, schema]) => {
		const nextSchemaPath = `${schemaPath}/patternProperties/${pattern}`;
		const regexp = UnicodeRegExp(pattern);
		return EveryAll(Entries$2(value), 0, ([key, value]) => {
			const nextInstancePath = `${instancePath}/${key}`;
			return !regexp.test(key) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema, value) && context.AddKey(key);
		});
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/prefixItems.mjs
function BuildPrefixItems(stack, context, schema, value) {
	return ReduceAnd(schema.prefixItems.map((schema, index) => {
		const isLength = IsLessEqualThan(Member(value, "length"), Constant(index));
		const isSchema = BuildSchemaPushStack(stack, context, schema, `${value}[${index}]`);
		const addIndex = context.AddIndex(Constant(index));
		return Or(isLength, context.UseUnevaluated() ? And(isSchema, addIndex) : isSchema);
	}));
}
function CheckPrefixItems(stack, context, schema, value) {
	return IsEqual$1(value.length, 0) || Every$1(schema.prefixItems, 0, (schema, index) => {
		return IsLessEqualThan$1(value.length, index) || CheckSchemaPushStack(stack, context, schema, value[index]) && context.AddIndex(index);
	});
}
function ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value) {
	return IsEqual$1(value.length, 0) || EveryAll(schema.prefixItems, 0, (schema, index) => {
		const nextSchemaPath = `${schemaPath}/prefixItems/${index}`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessEqualThan$1(value.length, index) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index);
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_exact_optional.mjs
function IsExactOptional(required, key) {
	return required.includes(key) || Get$3().exactOptionalPropertyTypes;
}
function InexactOptionalBuild(value, key) {
	return IsUndefined(Member(value, key));
}
function InexactOptionalCheck(value, key) {
	return IsUndefined$1(value[key]);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/properties.mjs
function BuildProperties(stack, context, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return ReduceAnd(Entries$2(schema.properties).map(([key, schema]) => {
		const notKey = Not(HasPropertyKey(value, Constant(key)));
		const isSchema = BuildSchemaPushStack(stack, context, schema, Member(value, key));
		const addKey = context.AddKey(Constant(key));
		const guarded = context.UseUnevaluated() ? And(isSchema, addKey) : isSchema;
		const isProperty = required.includes(key) ? guarded : Or(notKey, guarded);
		return IsExactOptional(required, key) ? isProperty : Or(InexactOptionalBuild(value, key), isProperty);
	}));
}
function CheckProperties(stack, context, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return Every$1(Entries$2(schema.properties), 0, ([key, schema]) => {
		const isProperty = !HasPropertyKey$1(value, key) || CheckSchemaPushStack(stack, context, schema, value[key]) && context.AddKey(key);
		return IsExactOptional(required, key) ? isProperty : InexactOptionalCheck(value, key) || isProperty;
	});
}
function ErrorProperties(stack, context, schemaPath, instancePath, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return EveryAll(Entries$2(schema.properties), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/properties/${key}`;
		const nextInstancePath = `${instancePath}/${key}`;
		const isProperty = () => !HasPropertyKey$1(value, key) || ErrorSchemaPushStack(stack, context, nextSchemaPath, nextInstancePath, schema, value[key]) && context.AddKey(key);
		return IsExactOptional(required, key) ? isProperty() : InexactOptionalCheck(value, key) || isProperty();
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/propertyNames.mjs
function BuildPropertyNames(stack, context, schema, value) {
	const [key, _index] = [Unique(), Unique()];
	return Every(Keys(value), Constant(0), [key, _index], BuildSchema(stack, context, schema.propertyNames, key));
}
function CheckPropertyNames(stack, context, schema, value) {
	return Every$1(Keys$1(value), 0, (key, _index) => CheckSchema(stack, context, schema.propertyNames, key));
}
function ErrorPropertyNames(stack, context, schemaPath, instancePath, schema, value) {
	const propertyNames = [];
	return EveryAll(Keys$1(value), 0, (key, _index) => {
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/recursiveRef.mjs
function BuildRecursiveRef(stack, context, schema, value) {
	return CreateFunction(stack, context, stack.RecursiveRef(schema) ?? false, value);
}
function CheckRecursiveRef(stack, context, schema, value) {
	const target = stack.RecursiveRef(schema) ?? false;
	return IsSchema(target) && CheckSchema(stack, context, target, value);
}
function ErrorRecursiveRef(stack, context, _schemaPath, instancePath, schema, value) {
	const target = stack.RecursiveRef(schema) ?? false;
	return IsSchema(target) && ErrorSchema(stack, context, "#", instancePath, target, value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/ref.mjs
function BuildRefStandard(stack, context, target, value) {
	const interior = ArrowFunction(["context", "value"], CreateFunction(stack, context, target, "value"));
	return Call(ArrowFunction(["context", "value"], Statements([
		ConstDeclaration("nextContext", New("CheckContext", [])),
		ConstDeclaration("result", Call(interior, ["nextContext", "value"])),
		If("result", context.Merge("[nextContext]")),
		Return("result")
	])), ["context", value]);
}
function BuildRefFast(stack, context, target, value) {
	return CreateFunction(stack, context, target, value);
}
function BuildRef(stack, context, schema, value) {
	const target = stack.Ref(schema) ?? false;
	return context.UseUnevaluated() ? BuildRefStandard(stack, context, target, value) : BuildRefFast(stack, context, target, value);
}
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/required.mjs
function BuildRequired(_stack, _context, schema, value) {
	return ReduceAnd(schema.required.map((key) => HasPropertyKey(value, Constant(key))));
}
function CheckRequired(_stack, _context, schema, value) {
	return Every$1(schema.required, 0, (key) => HasPropertyKey$1(value, key));
}
function ErrorRequired(_stack, context, schemaPath, instancePath, schema, value) {
	const requiredProperties = [];
	return EveryAll(schema.required, 0, (key) => {
		const hasKey = HasPropertyKey$1(value, key);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/type.mjs
function BuildTypeName(_stack, _context, type, value) {
	return IsEqual$1(type, "object") ? IsObjectNotArray(value) : IsEqual$1(type, "array") ? IsArray(value) : IsEqual$1(type, "boolean") ? IsBoolean$1(value) : IsEqual$1(type, "integer") ? IsInteger(value) : IsEqual$1(type, "number") ? IsNumber$1(value) : IsEqual$1(type, "null") ? IsNull(value) : IsEqual$1(type, "string") ? IsString$1(value) : IsEqual$1(type, "bigint") ? IsBigInt(value) : IsEqual$1(type, "constructor") ? IsConstructor(value) : IsEqual$1(type, "function") ? IsFunction(value) : IsEqual$1(type, "symbol") ? IsSymbol(value) : IsEqual$1(type, "undefined") ? IsUndefined(value) : IsEqual$1(type, "void") ? IsUndefined(value) : Constant(true);
}
function CheckTypeName(_stack, _context, type, _schema, value) {
	return IsEqual$1(type, "object") ? IsObjectNotArray$1(value) : IsEqual$1(type, "array") ? IsArray$1(value) : IsEqual$1(type, "boolean") ? IsBoolean$2(value) : IsEqual$1(type, "integer") ? IsInteger$1(value) : IsEqual$1(type, "number") ? IsNumber$2(value) : IsEqual$1(type, "null") ? IsNull$1(value) : IsEqual$1(type, "string") ? IsString$2(value) : IsEqual$1(type, "bigint") ? IsBigInt$1(value) : IsEqual$1(type, "constructor") ? IsConstructor$1(value) : IsEqual$1(type, "function") ? IsFunction$1(value) : IsEqual$1(type, "symbol") ? IsSymbol$1(value) : IsEqual$1(type, "undefined") ? IsUndefined$1(value) : IsEqual$1(type, "void") ? IsUndefined$1(value) : true;
}
function BuildTypeNames(stack, context, typenames, value) {
	return ReduceOr(typenames.map((type) => BuildTypeName(stack, context, type, value)));
}
function CheckTypeNames(stack, context, types, schema, value) {
	return Some$1(types, (type) => CheckTypeName(stack, context, type, schema, value));
}
function BuildType(stack, context, schema, value) {
	return IsArray$1(schema.type) ? BuildTypeNames(stack, context, schema.type, value) : BuildTypeName(stack, context, schema.type, value);
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/unevaluatedItems.mjs
function BuildUnevaluatedItems(stack, context, schema, value) {
	const [index, item] = [Unique(), Unique()];
	const indices = Call(Member("context", "GetIndices"), []);
	const hasIndex = Call(Member("indices", "has"), [index]);
	const isSchema = BuildSchema(stack, context, schema.unevaluatedItems, item);
	const addIndex = Call(Member("context", "AddIndex"), [index]);
	const isEvery = Every(value, Constant(0), [item, index], And(Or(hasIndex, isSchema), addIndex));
	return Call(ArrowFunction(["context"], Statements([ConstDeclaration("indices", indices), Return(isEvery)])), ["context"]);
}
function CheckUnevaluatedItems(stack, context, schema, value) {
	const indices = context.GetIndices();
	return Every$1(value, 0, (item, index) => {
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/unevaluatedProperties.mjs
function BuildUnevaluatedProperties(stack, context, schema, value) {
	const [key, prop] = [Unique(), Unique()];
	const keys = Call(Member("context", "GetKeys"), []);
	const hasKey = Call(Member("keys", "has"), [key]);
	const addKey = Call(Member("context", "AddKey"), [key]);
	const isSchema = BuildSchema(stack, context, schema.unevaluatedProperties, prop);
	const isEvery = Every(Entries$1(value), Constant(0), [`[${key}, ${prop}]`, "_"], Or(hasKey, And(isSchema, addKey)));
	return Call(ArrowFunction(["context"], Statements([ConstDeclaration("keys", keys), Return(isEvery)])), ["context"]);
}
function CheckUnevaluatedProperties(stack, context, schema, value) {
	const keys = context.GetKeys();
	return Every$1(Entries$2(value), 0, ([key, prop]) => {
		return keys.has(key) || CheckSchema(stack, context, schema.unevaluatedProperties, prop) && context.AddKey(key);
	});
}
function ErrorUnevaluatedProperties(stack, context, schemaPath, instancePath, schema, value) {
	const keys = context.GetKeys();
	const unevaluatedProperties = [];
	return EveryAll(Entries$2(value), 0, ([key, prop]) => {
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
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/uniqueItems.mjs
function IsValid(schema) {
	return !IsEqual$1(schema.uniqueItems, false);
}
function BuildUniqueItems(_stack, _context, schema, value) {
	if (!IsValid(schema)) return Constant(true);
	return IsEqual(Member(New("Set", [Call(Member(value, "map"), [Member("Hashing", "Hash")])]), "size"), Member(value, "length"));
}
function CheckUniqueItems(_stack, _context, schema, value) {
	if (!IsValid(schema)) return true;
	const set = new Set(value.map(Hash)).size;
	const isLength = value.length;
	return IsEqual$1(set, isLength);
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
	return IsEqual$1(duplicateItems.length, 0) || context.AddError({
		keyword: "uniqueItems",
		schemaPath,
		instancePath,
		params: { duplicateItems }
	});
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/schema.mjs
function HasTypeName(schema, typename) {
	return IsType(schema) && (IsArray$1(schema.type) && IsGreaterThan$1(schema.type.length, 0) && Every$1(schema.type, 0, (type) => IsEqual$1(type, typename)) || IsEqual$1(schema.type, typename));
}
function HasObjectType(schema) {
	return HasTypeName(schema, "object");
}
function HasObjectKeywords(schema) {
	return IsSchemaObject(schema) && (IsAdditionalProperties(schema) || IsDependencies(schema) || IsDependentRequired(schema) || IsDependentSchemas(schema) || IsProperties(schema) || IsPatternProperties(schema) || IsPropertyNames(schema) || IsMinProperties(schema) || IsMaxProperties(schema) || IsRequired(schema) || IsUnevaluatedProperties(schema));
}
function HasArrayType(schema) {
	return HasTypeName(schema, "array");
}
function HasArrayKeywords(schema) {
	return IsSchemaObject(schema) && (IsAdditionalItems(schema) || IsItems(schema) || IsContains(schema) || IsMaxContains(schema) || IsMaxItems(schema) || IsMinContains(schema) || IsMinItems(schema) || IsPrefixItems(schema) || IsUnevaluatedItems(schema) || IsUniqueItems(schema));
}
function HasStringType(schema) {
	return HasTypeName(schema, "string");
}
function HasStringKeywords(schema) {
	return IsSchemaObject(schema) && (IsMinLength(schema) || IsMaxLength(schema) || IsFormat(schema) || IsPattern(schema));
}
function HasNumberType(schema) {
	return HasTypeName(schema, "number") || HasTypeName(schema, "bigint");
}
function HasNumberKeywords(schema) {
	return IsSchemaObject(schema) && (IsMinimum(schema) || IsMaximum(schema) || IsExclusiveMaximum(schema) || IsExclusiveMinimum(schema) || IsMultipleOf(schema));
}
function BuildSchemaPushStack(stack, context, schema, value) {
	return context.UseUnevaluated() ? And(And(context.Push(), BuildSchema(stack, context, schema, value)), context.Pop()) : BuildSchema(stack, context, schema, value);
}
function BuildSchema(stack, context, schema, value) {
	stack.Push(schema);
	const conditions = [];
	if (IsSchemaBoolean(schema)) return BuildSchemaBoolean(stack, context, schema, value);
	if (IsType(schema)) conditions.push(BuildType(stack, context, schema, value));
	if (HasObjectKeywords(schema)) {
		const constraints = [];
		if (IsRequired(schema)) constraints.push(BuildRequired(stack, context, schema, value));
		if (IsAdditionalProperties(schema)) constraints.push(BuildAdditionalProperties(stack, context, schema, value));
		if (IsDependencies(schema)) constraints.push(BuildDependencies(stack, context, schema, value));
		if (IsDependentRequired(schema)) constraints.push(BuildDependentRequired(stack, context, schema, value));
		if (IsDependentSchemas(schema)) constraints.push(BuildDependentSchemas(stack, context, schema, value));
		if (IsPatternProperties(schema)) constraints.push(BuildPatternProperties(stack, context, schema, value));
		if (IsProperties(schema)) constraints.push(BuildProperties(stack, context, schema, value));
		if (IsPropertyNames(schema)) constraints.push(BuildPropertyNames(stack, context, schema, value));
		if (IsMinProperties(schema)) constraints.push(BuildMinProperties(stack, context, schema, value));
		if (IsMaxProperties(schema)) constraints.push(BuildMaxProperties(stack, context, schema, value));
		const reduced = ReduceAnd(constraints);
		const guarded = Or(Not(IsObjectNotArray(value)), reduced);
		conditions.push(HasObjectType(schema) ? reduced : guarded);
	}
	if (HasArrayKeywords(schema)) {
		const constraints = [];
		if (IsAdditionalItems(schema)) constraints.push(BuildAdditionalItems(stack, context, schema, value));
		if (IsContains(schema)) constraints.push(BuildContains(stack, context, schema, value));
		if (IsItems(schema)) constraints.push(BuildItems(stack, context, schema, value));
		if (IsMaxContains(schema)) constraints.push(BuildMaxContains(stack, context, schema, value));
		if (IsMaxItems(schema)) constraints.push(BuildMaxItems(stack, context, schema, value));
		if (IsMinContains(schema)) constraints.push(BuildMinContains(stack, context, schema, value));
		if (IsMinItems(schema)) constraints.push(BuildMinItems(stack, context, schema, value));
		if (IsPrefixItems(schema)) constraints.push(BuildPrefixItems(stack, context, schema, value));
		if (IsUniqueItems(schema)) constraints.push(BuildUniqueItems(stack, context, schema, value));
		const reduced = ReduceAnd(constraints);
		const guarded = Or(Not(IsArray(value)), reduced);
		conditions.push(HasArrayType(schema) ? reduced : guarded);
	}
	if (HasStringKeywords(schema)) {
		const constraints = [];
		if (IsMaxLength(schema)) constraints.push(BuildMaxLength(stack, context, schema, value));
		if (IsMinLength(schema)) constraints.push(BuildMinLength(stack, context, schema, value));
		if (IsFormat(schema)) constraints.push(BuildFormat(stack, context, schema, value));
		if (IsPattern(schema)) constraints.push(BuildPattern(stack, context, schema, value));
		const reduced = ReduceAnd(constraints);
		const guarded = Or(Not(IsString$1(value)), reduced);
		conditions.push(HasStringType(schema) ? reduced : guarded);
	}
	if (HasNumberKeywords(schema)) {
		const constraints = [];
		if (IsExclusiveMaximum(schema)) constraints.push(BuildExclusiveMaximum(stack, context, schema, value));
		if (IsExclusiveMinimum(schema)) constraints.push(BuildExclusiveMinimum(stack, context, schema, value));
		if (IsMaximum(schema)) constraints.push(BuildMaximum(stack, context, schema, value));
		if (IsMinimum(schema)) constraints.push(BuildMinimum(stack, context, schema, value));
		if (IsMultipleOf(schema)) constraints.push(BuildMultipleOf(stack, context, schema, value));
		const reduced = ReduceAnd(constraints);
		const guarded = Or(Not(Or(IsNumber$1(value), IsBigInt(value))), reduced);
		conditions.push(HasNumberType(schema) ? reduced : guarded);
	}
	if (IsRef(schema)) conditions.push(BuildRef(stack, context, schema, value));
	if (IsRecursiveRef(schema)) conditions.push(BuildRecursiveRef(stack, context, schema, value));
	if (IsDynamicRef(schema)) conditions.push(BuildDynamicRef(stack, context, schema, value));
	if (IsConst(schema)) conditions.push(BuildConst(stack, context, schema, value));
	if (IsEnum(schema)) conditions.push(BuildEnum(stack, context, schema, value));
	if (IsIf(schema)) conditions.push(BuildIf(stack, context, schema, value));
	if (IsNot(schema)) conditions.push(BuildNot(stack, context, schema, value));
	if (IsAllOf(schema)) conditions.push(BuildAllOf(stack, context, schema, value));
	if (IsAnyOf(schema)) conditions.push(BuildAnyOf(stack, context, schema, value));
	if (IsOneOf(schema)) conditions.push(BuildOneOf(stack, context, schema, value));
	if (IsUnevaluatedItems(schema)) conditions.push(Or(Not(IsArray(value)), BuildUnevaluatedItems(stack, context, schema, value)));
	if (IsUnevaluatedProperties(schema)) conditions.push(Or(Not(IsObject(value)), BuildUnevaluatedProperties(stack, context, schema, value)));
	if (IsRefine(schema)) conditions.push(BuildRefine(stack, context, schema, value));
	const result = ReduceAnd(conditions);
	stack.Pop(schema);
	return result;
}
function CheckSchemaPushStack(stack, context, schema, value) {
	return context.Push() && CheckSchema(stack, context, schema, value) && context.Pop();
}
function CheckSchema(stack, context, schema, value) {
	stack.Push(schema);
	const result = IsSchemaBoolean(schema) ? CheckSchemaBoolean(stack, context, schema, value) : (!IsType(schema) || CheckType(stack, context, schema, value)) && (!(IsObject$1(value) && !IsArray$1(value)) || (!IsRequired(schema) || CheckRequired(stack, context, schema, value)) && (!IsAdditionalProperties(schema) || CheckAdditionalProperties(stack, context, schema, value)) && (!IsDependencies(schema) || CheckDependencies(stack, context, schema, value)) && (!IsDependentRequired(schema) || CheckDependentRequired(stack, context, schema, value)) && (!IsDependentSchemas(schema) || CheckDependentSchemas(stack, context, schema, value)) && (!IsPatternProperties(schema) || CheckPatternProperties(stack, context, schema, value)) && (!IsProperties(schema) || CheckProperties(stack, context, schema, value)) && (!IsPropertyNames(schema) || CheckPropertyNames(stack, context, schema, value)) && (!IsMinProperties(schema) || CheckMinProperties(stack, context, schema, value)) && (!IsMaxProperties(schema) || CheckMaxProperties(stack, context, schema, value))) && (!IsArray$1(value) || (!IsAdditionalItems(schema) || CheckAdditionalItems(stack, context, schema, value)) && (!IsContains(schema) || CheckContains(stack, context, schema, value)) && (!IsItems(schema) || CheckItems(stack, context, schema, value)) && (!IsMaxContains(schema) || CheckMaxContains(stack, context, schema, value)) && (!IsMaxItems(schema) || CheckMaxItems(stack, context, schema, value)) && (!IsMinContains(schema) || CheckMinContains(stack, context, schema, value)) && (!IsMinItems(schema) || CheckMinItems(stack, context, schema, value)) && (!IsPrefixItems(schema) || CheckPrefixItems(stack, context, schema, value)) && (!IsUniqueItems(schema) || CheckUniqueItems(stack, context, schema, value))) && (!IsString$2(value) || (!IsMaxLength(schema) || CheckMaxLength(stack, context, schema, value)) && (!IsMinLength(schema) || CheckMinLength(stack, context, schema, value)) && (!IsFormat(schema) || CheckFormat(stack, context, schema, value)) && (!IsPattern(schema) || CheckPattern(stack, context, schema, value))) && (!(IsNumber$2(value) || IsBigInt$1(value)) || (!IsExclusiveMaximum(schema) || CheckExclusiveMaximum(stack, context, schema, value)) && (!IsExclusiveMinimum(schema) || CheckExclusiveMinimum(stack, context, schema, value)) && (!IsMaximum(schema) || CheckMaximum(stack, context, schema, value)) && (!IsMinimum(schema) || CheckMinimum(stack, context, schema, value)) && (!IsMultipleOf(schema) || CheckMultipleOf(stack, context, schema, value))) && (!IsRef(schema) || CheckRef(stack, context, schema, value)) && (!IsRecursiveRef(schema) || CheckRecursiveRef(stack, context, schema, value)) && (!IsDynamicRef(schema) || CheckDynamicRef(stack, context, schema, value)) && (!IsConst(schema) || CheckConst(stack, context, schema, value)) && (!IsEnum(schema) || CheckEnum(stack, context, schema, value)) && (!IsIf(schema) || CheckIf(stack, context, schema, value)) && (!IsNot(schema) || CheckNot(stack, context, schema, value)) && (!IsAllOf(schema) || CheckAllOf(stack, context, schema, value)) && (!IsAnyOf(schema) || CheckAnyOf(stack, context, schema, value)) && (!IsOneOf(schema) || CheckOneOf(stack, context, schema, value)) && (!IsUnevaluatedItems(schema) || !IsArray$1(value) || CheckUnevaluatedItems(stack, context, schema, value)) && (!IsUnevaluatedProperties(schema) || !IsObject$1(value) || CheckUnevaluatedProperties(stack, context, schema, value)) && (!IsRefine(schema) || CheckRefine(stack, context, schema, value));
	stack.Pop(schema);
	return result;
}
function ErrorSchemaPushStack(stack, context, schemaPath, instancePath, schema, value) {
	return context.Push() && ErrorSchema(stack, context, schemaPath, instancePath, schema, value) && context.Pop();
}
function ErrorSchema(stack, context, schemaPath, instancePath, schema, value) {
	stack.Push(schema);
	const result = IsSchemaBoolean(schema) ? ErrorSchemaBoolean(stack, context, schemaPath, instancePath, schema, value) : !!(+(!IsType(schema) || ErrorType(stack, context, schemaPath, instancePath, schema, value)) & +(!(IsObject$1(value) && !IsArray$1(value)) || !!(+(!IsRequired(schema) || ErrorRequired(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAdditionalProperties(schema) || ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependencies(schema) || ErrorDependencies(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependentRequired(schema) || ErrorDependentRequired(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependentSchemas(schema) || ErrorDependentSchemas(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPatternProperties(schema) || ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsProperties(schema) || ErrorProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPropertyNames(schema) || ErrorPropertyNames(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinProperties(schema) || ErrorMinProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxProperties(schema) || ErrorMaxProperties(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsArray$1(value) || !!(+(!IsAdditionalItems(schema) || ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsContains(schema) || ErrorContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsItems(schema) || ErrorItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxContains(schema) || ErrorMaxContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxItems(schema) || ErrorMaxItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinContains(schema) || ErrorMinContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinItems(schema) || ErrorMinItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPrefixItems(schema) || ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUniqueItems(schema) || ErrorUniqueItems(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsString$2(value) || !!(+(!IsMaxLength(schema) || ErrorMaxLength(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinLength(schema) || ErrorMinLength(stack, context, schemaPath, instancePath, schema, value)) & +(!IsFormat(schema) || ErrorFormat(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPattern(schema) || ErrorPattern(stack, context, schemaPath, instancePath, schema, value)))) & +(!(IsNumber$2(value) || IsBigInt$1(value)) || !!(+(!IsExclusiveMaximum(schema) || ErrorExclusiveMaximum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsExclusiveMinimum(schema) || ErrorExclusiveMinimum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaximum(schema) || ErrorMaximum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinimum(schema) || ErrorMinimum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMultipleOf(schema) || ErrorMultipleOf(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsRef(schema) || ErrorRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsRecursiveRef(schema) || ErrorRecursiveRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDynamicRef(schema) || ErrorDynamicRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsConst(schema) || ErrorConst(stack, context, schemaPath, instancePath, schema, value)) & +(!IsEnum(schema) || ErrorEnum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsIf(schema) || ErrorIf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsNot(schema) || ErrorNot(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAllOf(schema) || ErrorAllOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAnyOf(schema) || ErrorAnyOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsOneOf(schema) || ErrorOneOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUnevaluatedItems(schema) || !IsArray$1(value) || ErrorUnevaluatedItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUnevaluatedProperties(schema) || !IsObject$1(value) || ErrorUnevaluatedProperties(stack, context, schemaPath, instancePath, schema, value))) && (!IsRefine(schema) || ErrorRefine(stack, context, schemaPath, instancePath, schema, value));
	stack.Pop(schema);
	return result;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_functions.mjs
const index = [0];
const names = /* @__PURE__ */ new Map();
const funcs = /* @__PURE__ */ new Map();
function NextName() {
	return `${index[0]++}`;
}
function CreateName(schema, href) {
	if (!names.has(schema)) names.set(schema, /* @__PURE__ */ new Map());
	const hrefs = names.get(schema);
	if (hrefs.has(href)) return hrefs.get(href);
	const name = NextName();
	hrefs.set(href, name);
	return name;
}
function CreateCallExpression(context, _schema, name, value) {
	return context.UseUnevaluated() ? Call(`check_${name}`, ["context", value]) : Call(`check_${name}`, [value]);
}
function CreateFunctionExpression(stack, context, schema, name) {
	const expression = BuildSchema(stack, context, schema, "value");
	return context.UseUnevaluated() ? ConstDeclaration(`check_${name}`, ArrowFunction(["context", "value"], expression)) : ConstDeclaration(`check_${name}`, ArrowFunction(["value"], expression));
}
function ResetFunctions() {
	index[0] = 0;
	names.clear();
	funcs.clear();
}
function GetFunctions() {
	return [...funcs.values()];
}
function CreateFunction(stack, context, schema, value) {
	const name = CreateName(schema, stack.BaseURL().href);
	const call = CreateCallExpression(context, schema, name, value);
	if (funcs.has(name)) return call;
	funcs.set(name, "");
	funcs.set(name, CreateFunctionExpression(stack, context, schema, name));
	return call;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/pointer/pointer.mjs
function GetIndex(index, value) {
	return IsObject$1(value) && !IsUnsafePropertyKey(index) ? value[index] : void 0;
}
function GetIndices(indices, value) {
	return indices.reduce((value, index) => GetIndex(index, value), value);
}
/** Returns an array of path indices for the given pointer */
function Indices(pointer) {
	if (IsEqual$1(pointer.length, 0)) return [];
	const indices = pointer.split("/").map((index) => index.replace(/~1/g, "/").replace(/~0/g, "~"));
	return indices.length > 0 && indices[0] === "" ? indices.slice(1) : indices;
}
/** Gets a value at the pointer, or undefined if not exists */
function Get(value, pointer) {
	return GetIndices(Indices(pointer), value);
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/resolve/resolve.mjs
const DefaultBase = new URL("https://json-schema.org");
function MatchId(schema, base, ref) {
	if (schema.$id === ref.hash) return schema;
	const absoluteId = new URL(schema.$id, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	if (IsEqual$1(absoluteId.pathname, absoluteRef.pathname)) return ref.hash.startsWith("#") ? MatchHash(schema, base, ref) : schema;
}
function MatchAnchor(schema, base, ref) {
	const absoluteAnchor = new URL(`#${schema.$anchor}`, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	return IsEqual$1(absoluteAnchor.href, absoluteRef.href) ? schema : void 0;
}
function MatchDynamicAnchor(schema, base, ref) {
	const absoluteAnchor = new URL(`#${schema.$dynamicAnchor}`, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	return IsEqual$1(absoluteAnchor.href, absoluteRef.href) ? schema : void 0;
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
function SkipProperty(key) {
	return IsEqual$1(key, "const") || IsEqual$1(key, "enum");
}
function FromObject(schema, base, ref) {
	return Keys$1(schema).reduce((result, key) => {
		if (SkipProperty(key)) return result;
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
function CanonicalHref(url) {
	return url.href.split("#")[0];
}
function RefContext(context, ref) {
	return HasPropertyKey$1(context, ref) ? context[ref] : void 0;
}
function RefLocal(schema, base, ref) {
	return FromValue(schema, base, ref);
}
function RefRemote(context, base, ref) {
	const targetDocumentHref = CanonicalHref(ref);
	if (IsEqual$1(targetDocumentHref, CanonicalHref(base))) return void 0;
	if (!HasPropertyKey$1(context, targetDocumentHref)) return void 0;
	const remoteSchema = context[targetDocumentHref];
	return FromValue(remoteSchema, IsSchemaObject(remoteSchema) && IsId(remoteSchema) ? new URL(remoteSchema.$id, DefaultBase.href) : new URL(targetDocumentHref), ref);
}
function Ref(context, schema, ref) {
	const initialBase = IsId(schema) ? new URL(schema.$id, DefaultBase.href) : DefaultBase;
	const initialRef = new URL(ref, initialBase.href);
	return RefContext(context, ref) ?? RefLocal(schema, initialBase, initialRef) ?? RefRemote(context, initialBase, initialRef);
}
function DynamicRef(context, root, base, dynamicRef, dynamicAnchors) {
	const fragmentTarget = dynamicRef.$dynamicRef.startsWith("#") ? Ref(context, base, dynamicRef.$dynamicRef) : Ref(context, root, dynamicRef.$dynamicRef);
	if (IsUndefined$1(fragmentTarget)) return void 0;
	if (!IsSchemaObject(fragmentTarget) || !IsDynamicAnchor(fragmentTarget)) return fragmentTarget;
	if (new URL(dynamicRef.$dynamicRef, DefaultBase).hash.startsWith("#/")) return fragmentTarget;
	return dynamicAnchors.find((anchor) => anchor.$dynamicAnchor === fragmentTarget.$dynamicAnchor) ?? fragmentTarget;
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/engine/_stack.mjs
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Stack_instances;
var _Stack_PushResourceAnchors;
var _Stack_PopResourceAnchors;
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
		return this.ids.reduce((result, schema) => new URL(schema.$id, result), DefaultBase);
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
		const root = this.schema;
		return !ref.$ref.startsWith("#") ? Ref(this.context, root, ref.$ref) : Ref(this.context, this.Base(), ref.$ref);
	}
	RecursiveRef(recursiveRef) {
		return IsRecursiveAnchorTrue(this.Base()) ? Ref(this.context, this.recursiveAnchors[0], recursiveRef.$recursiveRef) : Ref(this.context, this.Base(), recursiveRef.$recursiveRef);
	}
	DynamicRef(dynamicRef) {
		const root = this.schema;
		return DynamicRef(this.context, root, this.Base(), dynamicRef, this.dynamicAnchors);
	}
};
_Stack_instances = /* @__PURE__ */ new WeakSet(), _Stack_PushResourceAnchors = function _Stack_PushResourceAnchors(schema, isRoot = true) {
	if (!IsSchemaObject(schema)) return;
	const current = schema;
	if (!isRoot && IsId(current)) return;
	if (!isRoot && IsDynamicAnchor(current)) this.dynamicAnchors.push(current);
	for (const key of Keys$1(current)) __classPrivateFieldGet(this, _Stack_instances, "m", _Stack_PushResourceAnchors).call(this, current[key], false);
}, _Stack_PopResourceAnchors = function _Stack_PopResourceAnchors(schema, isRoot = true) {
	if (!IsSchemaObject(schema)) return;
	const current = schema;
	if (!isRoot && IsId(current)) return;
	if (!isRoot && IsDynamicAnchor(current)) this.dynamicAnchors.pop();
	for (const key of Keys$1(current)) __classPrivateFieldGet(this, _Stack_instances, "m", _Stack_PopResourceAnchors).call(this, current[key], false);
};
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/build.mjs
function CreateCode(build) {
	return `${build.Functions().join(";\n")}; return (value) => { ${(build.UseUnevaluated() ? ["const context = new CheckContext({}, {})", `return ${build.Entry()}`] : [`return ${build.Entry()}`]).join("; ")} }`;
}
function CreateEvaluatedCheck(build, code) {
	return Evaluate("CheckContext", "Guard", "Format", "Hashing", build.External().identifier, code)(CheckContext, guard_exports, format_exports, hash_exports, build.External().variables);
}
function CreateDynamicCheck(build) {
	const stack = new Stack(build.Context(), build.Schema());
	const context = new CheckContext();
	return (value) => CheckSchema(stack, context, build.Schema(), value);
}
function CreateCheck(build, code) {
	return CanEvaluate() ? CreateEvaluatedCheck(build, code) : CreateDynamicCheck(build);
}
var EvaluateResult = class {
	constructor(isAccelerated, code, check) {
		this.isAccelerated = isAccelerated;
		this.code = code;
		this.check = check;
	}
	IsAccelerated() {
		return this.isAccelerated;
	}
	Code() {
		return this.code;
	}
	Check(value) {
		return this.check(value);
	}
};
var BuildResult = class {
	constructor(context, schema, external, functions, entry, useUnevaluated) {
		this.context = context;
		this.schema = schema;
		this.external = external;
		this.functions = functions;
		this.entry = entry;
		this.useUnevaluated = useUnevaluated;
	}
	/** Returns the Context used for this build */
	Context() {
		return this.context;
	}
	/** Returns the Schema used for this build */
	Schema() {
		return this.schema;
	}
	/** Returns true if this build requires a Unevaluated context */
	UseUnevaluated() {
		return this.useUnevaluated;
	}
	/** Returns external variables */
	External() {
		return this.external;
	}
	/** Returns check functions */
	Functions() {
		return this.functions;
	}
	/** Return entry function call. */
	Entry() {
		return this.entry;
	}
	/** Evaluates the build into a validation function */
	Evaluate() {
		const code = CreateCode(this);
		const check = CreateCheck(this, code);
		return new EvaluateResult(CanEvaluate(), code, check);
	}
};
/** Builds a schema into a optimized runtime validator */
function Build(...args) {
	const [context, schema] = Match$1(args, {
		2: (context, schema) => [context, schema],
		1: (schema) => [{}, schema]
	});
	ResetExternal();
	ResetFunctions();
	const stack = new Stack(context, schema);
	const build = new BuildContext(HasUnevaluated(context, schema));
	const call = CreateFunction(stack, build, schema, "value");
	const functions = GetFunctions();
	return new BuildResult(context, schema, GetExternal(), functions, call, build.UseUnevaluated());
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/errors.mjs
/** Checks a value and returns validation errors */
function Errors(...args) {
	const [context, schema, value] = Match$1(args, {
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
	const settings = Get$3();
	const locale = Get$2();
	const errors = [];
	return [ErrorSchema(new Stack(context, schema), new ErrorContext((error) => {
		if (IsGreaterEqualThan$1(errors.length, settings.maxErrors)) return;
		return errors.push({
			...error,
			message: locale(error)
		});
	}), "#", "", schema, value), errors];
}
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/parse.mjs
var ParseError = class {
	constructor(schema, value, errors) {
		this.schema = schema;
		this.value = value;
		this.errors = errors;
	}
};
//#endregion
//#region ../node_modules/.pnpm/typebox@1.3.16/node_modules/typebox/build/schema/compile.mjs
var Validator = class {
	constructor(context, schema) {
		this.buildResult = Build(context, schema);
		this.evaluateResult = this.buildResult.Evaluate();
	}
	/** Returns true if this Validator is using JIT acceleration. */
	IsAccelerated() {
		return this.evaluateResult.IsAccelerated();
	}
	/** Returns the underlying Schema used to construct this Validator. */
	Schema() {
		return this.buildResult.Schema();
	}
	/** Performs a type-guard check on the provided value. */
	Check(value) {
		return this.evaluateResult.Check(value);
	}
	/** Validates a value and returns it. Will throw if invalid. */
	Parse(value) {
		if (this.evaluateResult.Check(value)) return value;
		const [_result, errors] = Errors(this.buildResult.Context(), this.buildResult.Schema(), value);
		throw new ParseError(this.buildResult.Schema(), value, errors);
	}
	/** Inspects a value and returns a detailed list of validation errors. */
	Errors(value) {
		return Errors(this.buildResult.Context(), this.buildResult.Schema(), value);
	}
};
/** Compiles this schema into a high performance Validator */
function Compile(...args) {
	const [context, schema] = Match$1(args, {
		2: (context, schema) => [context, schema],
		1: (schema) => [{}, schema]
	});
	return new Validator(context, schema);
}
//#endregion
//#region ../schemas/libraries/typebox/download/schema + compile.ts
const Timestamp = Refine(Unsafe({}), (value) => value instanceof Date);
const Image = _Object_({
	id: Number$1(),
	created: Timestamp,
	title: String$1({
		minLength: 1,
		maxLength: 100
	}),
	type: Enum(["jpg", "png"]),
	size: Number$1(),
	url: String$1({ format: "url" })
});
const Rating = _Object_({
	id: Number$1(),
	stars: Number$1({
		minimum: 1,
		maximum: 5
	}),
	title: String$1({
		minLength: 1,
		maxLength: 100
	}),
	text: String$1({
		minLength: 1,
		maxLength: 1e3
	}),
	images: _Array_(Image)
});
Compile(_Object_({
	id: Number$1(),
	created: Timestamp,
	title: String$1({
		minLength: 1,
		maxLength: 100
	}),
	brand: String$1({
		minLength: 1,
		maxLength: 30
	}),
	description: String$1({
		minLength: 1,
		maxLength: 500
	}),
	price: Number$1({
		minimum: 1,
		maximum: 1e4
	}),
	discount: Union([Number$1({
		minimum: 1,
		maximum: 100
	}), Null()]),
	quantity: Number$1({
		minimum: 1,
		maximum: 10
	}),
	tags: _Array_(String$1({
		minLength: 1,
		maxLength: 30
	})),
	images: _Array_(Image),
	ratings: _Array_(Rating)
})).Parse({});
//#endregion
