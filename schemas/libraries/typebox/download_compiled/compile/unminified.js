//#region rolldown:runtime
var __defProp = Object.defineProperty;
var __exportAll = (all, symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/memory/metrics.mjs
/** TypeBox instantiation metrics */
const Metrics = {
	assign: 0,
	create: 0,
	clone: 0,
	discard: 0,
	update: 0
};

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/memory/assign.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/guard/string.mjs
function IsBetween(value, min, max) {
	return value >= min && value <= max;
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
function IsMinLength$3(value, minLength) {
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
function IsMaxLength$3(value, maxLength) {
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
		if (IsGraphemeCodePoint(value.charCodeAt(index))) return IsMinLength$3(value, minLength);
		index++;
		if (index >= minLength) return true;
	}
	return false;
}
/** Fast check for maximum grapheme length, falls back to full check if needed */
function IsMaxLengthFast(value, maxLength) {
	let index = 0;
	while (index < value.length) {
		if (IsGraphemeCodePoint(value.charCodeAt(index))) return IsMaxLength$3(value, maxLength);
		index++;
		if (index > maxLength) return false;
	}
	return true;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/guard/guard.mjs
var guard_exports = /* @__PURE__ */ __exportAll({
	Entries: () => Entries$2,
	EntriesRegExp: () => EntriesRegExp,
	Every: () => Every$1,
	EveryAll: () => EveryAll,
	GraphemeCount: () => GraphemeCount,
	HasPropertyKey: () => HasPropertyKey$1,
	IsArray: () => IsArray$2,
	IsAsyncIterator: () => IsAsyncIterator$2,
	IsBigInt: () => IsBigInt$2,
	IsBoolean: () => IsBoolean$3,
	IsClassInstance: () => IsClassInstance,
	IsConstructor: () => IsConstructor$2,
	IsDeepEqual: () => IsDeepEqual$1,
	IsEqual: () => IsEqual$1,
	IsFunction: () => IsFunction$2,
	IsGreaterEqualThan: () => IsGreaterEqualThan$1,
	IsGreaterThan: () => IsGreaterThan$1,
	IsInteger: () => IsInteger$2,
	IsIterator: () => IsIterator$2,
	IsLessEqualThan: () => IsLessEqualThan$1,
	IsLessThan: () => IsLessThan$1,
	IsMaxLength: () => IsMaxLength$2,
	IsMinLength: () => IsMinLength$2,
	IsMultipleOf: () => IsMultipleOf$1,
	IsNull: () => IsNull$2,
	IsNumber: () => IsNumber$3,
	IsObject: () => IsObject$2,
	IsObjectNotArray: () => IsObjectNotArray$1,
	IsString: () => IsString$3,
	IsSymbol: () => IsSymbol$2,
	IsUndefined: () => IsUndefined$2,
	IsValueLike: () => IsValueLike,
	Keys: () => Keys$1,
	Symbols: () => Symbols,
	Values: () => Values
});
/** Returns true if this value is an array */
function IsArray$2(value) {
	return Array.isArray(value);
}
/** Returns true if this value is an async iterator */
function IsAsyncIterator$2(value) {
	return IsObject$2(value) && Symbol.asyncIterator in value;
}
/** Returns true if this value is bigint */
function IsBigInt$2(value) {
	return IsEqual$1(typeof value, "bigint");
}
/** Returns true if this value is a boolean */
function IsBoolean$3(value) {
	return IsEqual$1(typeof value, "boolean");
}
/** Returns true if this value is a constructor */
function IsConstructor$2(value) {
	if (IsUndefined$2(value) || !IsFunction$2(value)) return false;
	const result = Function.prototype.toString.call(value);
	if (/^class\s/.test(result)) return true;
	if (/\[native code\]/.test(result)) return true;
	return false;
}
/** Returns true if this value is a function */
function IsFunction$2(value) {
	return IsEqual$1(typeof value, "function");
}
/** Returns true if this value is integer */
function IsInteger$2(value) {
	return Number.isInteger(value);
}
/** Returns true if this value is an iterator */
function IsIterator$2(value) {
	return IsObject$2(value) && Symbol.iterator in value;
}
/** Returns true if this value is null */
function IsNull$2(value) {
	return IsEqual$1(value, null);
}
/** Returns true if this value is number */
function IsNumber$3(value) {
	return Number.isFinite(value);
}
/** Returns true if this value is an object but not an array */
function IsObjectNotArray$1(value) {
	return IsObject$2(value) && !IsArray$2(value);
}
/** Returns true if this value is an object */
function IsObject$2(value) {
	return IsEqual$1(typeof value, "object") && !IsNull$2(value);
}
/** Returns true if this value is string */
function IsString$3(value) {
	return IsEqual$1(typeof value, "string");
}
/** Returns true if this value is symbol */
function IsSymbol$2(value) {
	return IsEqual$1(typeof value, "symbol");
}
/** Returns true if this value is undefined */
function IsUndefined$2(value) {
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
	if (IsBigInt$2(dividend) || IsBigInt$2(divisor)) return BigInt(dividend) % BigInt(divisor) === 0n;
	const tolerance = 1e-10;
	if (!IsNumber$3(dividend)) return true;
	if (IsInteger$2(dividend) && 1 / divisor % 1 === 0) return true;
	const mod = dividend % divisor;
	return Math.min(Math.abs(mod), Math.abs(mod - divisor)) < tolerance;
}
/** Returns true if the value appears to be an instance of a class. */
function IsClassInstance(value) {
	if (!IsObject$2(value)) return false;
	const proto = globalThis.Object.getPrototypeOf(value);
	if (IsNull$2(proto)) return false;
	return IsEqual$1(typeof proto.constructor, "function") && !(IsEqual$1(proto.constructor, globalThis.Object) || IsEqual$1(proto.constructor.name, "Object"));
}
function IsValueLike(value) {
	return IsBigInt$2(value) || IsBoolean$3(value) || IsNull$2(value) || IsNumber$3(value) || IsString$3(value) || IsUndefined$2(value);
}
/** Returns the number of grapheme clusters in the string */
function GraphemeCount(value) {
	return GraphemeCount$1(value);
}
/** Returns true if the string has at most the given number of graphemes */
function IsMaxLength$2(value, length) {
	return IsMaxLengthFast(value, length);
}
/** Returns true if the string has at least the given number of graphemes */
function IsMinLength$2(value, length) {
	return IsMinLengthFast(value, length);
}
function Every$1(value, offset, callback) {
	for (let index = offset; index < value.length; index++) if (!callback(value[index], index)) return false;
	return true;
}
function EveryAll(value, offset, callback) {
	let result = true;
	for (let index = offset; index < value.length; index++) if (!callback(value[index], index)) result = false;
	return result;
}
/** Returns true if this value has this property key */
function HasPropertyKey$1(value, key) {
	return IsEqual$1(key, "__proto__") || IsEqual$1(key, "constructor") ? Object.prototype.hasOwnProperty.call(value, key) : key in value;
}
/** Returns object entries as `[RegExp, Value][]` */
function EntriesRegExp(value) {
	return Keys$1(value).map((key) => [new RegExp(`^${key}$`), value[key]]);
}
/** Returns object entries as `[string, Value][]` */
function Entries$2(value) {
	return Object.entries(value);
}
/** Returns the property keys for this object via `Object.getOwnPropertyKeys({ ... })` */
function Keys$1(value) {
	return Object.getOwnPropertyNames(value);
}
/** Returns the property keys for this object via `Object.getOwnPropertyKeys({ ... })` */
function Symbols(value) {
	return Object.getOwnPropertySymbols(value);
}
/** Returns the property values for the given object via `Object.values()` */
function Values(value) {
	return Object.values(value);
}
function DeepEqualObject(left, right) {
	if (!IsObject$2(right)) return false;
	const keys = Keys$1(left);
	return IsEqual$1(keys.length, Keys$1(right).length) && keys.every((key) => IsDeepEqual$1(left[key], right[key]));
}
function DeepEqualArray(left, right) {
	return IsArray$2(right) && IsEqual$1(left.length, right.length) && left.every((_, index) => IsDeepEqual$1(left[index], right[index]));
}
/** Tests values for deep equality */
function IsDeepEqual$1(left, right) {
	return IsArray$2(left) ? DeepEqualArray(left, right) : IsObject$2(left) ? DeepEqualObject(left, right) : IsEqual$1(left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/guard/emit.mjs
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
function IsArray$1(value) {
	return `Array.isArray(${value})`;
}
/** Returns true if this value is an async iterator */
function IsAsyncIterator$1(value) {
	return `Guard.IsAsyncIterator(${value})`;
}
/** Returns true if this value is bigint */
function IsBigInt$1(value) {
	return `typeof ${value} === "bigint"`;
}
/** Returns true if this value is a boolean */
function IsBoolean$2(value) {
	return `typeof ${value} === "boolean"`;
}
/** Returns true if this value is integer */
function IsInteger$1(value) {
	return `Number.isInteger(${value})`;
}
/** Returns true if this value is an iterator */
function IsIterator$1(value) {
	return `Guard.IsIterator(${value})`;
}
/** Returns true if this value is null */
function IsNull$1(value) {
	return `${value} === null`;
}
/** Returns true if this value is number */
function IsNumber$2(value) {
	return `Number.isFinite(${value})`;
}
/** Returns true if this value is an object but not an array */
function IsObjectNotArray(value) {
	return And(IsObject$1(value), Not(IsArray$1(value)));
}
/** Returns true if this value is an object */
function IsObject$1(value) {
	return `typeof ${value} === "object" && ${value} !== null`;
}
/** Returns true if this value is string */
function IsString$2(value) {
	return `typeof ${value} === "string"`;
}
/** Returns true if this value is symbol */
function IsSymbol$1(value) {
	return `typeof ${value} === "symbol"`;
}
/** Returns true if this value is undefined */
function IsUndefined$1(value) {
	return `${value} === undefined`;
}
function IsFunction$1(value) {
	return `typeof ${value} === "function"`;
}
function IsConstructor$1(value) {
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
	return IsString$3(value) ? JSON.stringify(value) : `${value}`;
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
function If$1(condition, then) {
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
function PrefixIncrement(expression) {
	return `++${expression}`;
}
function MultipleOf(dividend, divisor) {
	return `Guard.IsMultipleOf(${dividend}, ${divisor})`;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/guard/globals.mjs
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
/** Returns true if the value is a Set */
function IsSet(value) {
	return value instanceof globalThis.Set;
}
/** Returns true if the value is a Map */
function IsMap(value) {
	return value instanceof globalThis.Map;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/memory/clone.mjs
function IsGuard$1(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~guard");
}
function FromGuard(value) {
	return value;
}
function FromArray$12(value) {
	return value.map((value) => FromValue$3(value));
}
function FromObject$15(value) {
	const result = {};
	const descriptors = Object.getOwnPropertyDescriptors(value);
	for (const key of Object.keys(descriptors)) {
		const descriptor = descriptors[key];
		if (HasPropertyKey$1(descriptor, "value")) Object.defineProperty(result, key, {
			...descriptor,
			value: FromValue$3(descriptor.value)
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
function FromValue$3(value) {
	return value instanceof RegExp ? FromRegExp$1(value) : IsGuard$1(value) ? FromGuard(value) : IsArray$2(value) ? FromArray$12(value) : IsObject$2(value) ? FromObject$15(value) : FromUnknown(value);
}
/**
* Clones a value using the TypeBox type cloning strategy. This function preserves non-enumerable
* properties from the source value. This is to ensure cloned types retain discriminable
* hidden properties.
*/
function Clone$1(value) {
	Metrics.clone += 1;
	return FromValue$3(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/settings/settings.mjs
const settings = {
	immutableTypes: false,
	maxErrors: 8,
	useEval: true,
	exactOptionalPropertyTypes: false,
	enumerableKind: false
};
/** Gets current system settings */
function Get$3() {
	return settings;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/memory/create.mjs
function MergeHidden(left, right, configuration = {}) {
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
function Create$1(hidden, enumerable, options = {}) {
	Metrics.create += 1;
	const settings = Get$3();
	const withOptions = Merge(enumerable, options);
	const withHidden = settings.enumerableKind ? Merge(withOptions, hidden) : MergeHidden(withOptions, hidden);
	return settings.immutableTypes ? Object.freeze(withHidden) : withHidden;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/memory/discard.mjs
/** Discards multiple property keys from the given object value */
function Discard(value, propertyKeys) {
	Metrics.discard += 1;
	const result = {};
	const descriptors = Object.getOwnPropertyDescriptors(Clone$1(value));
	const keysToDiscard = new Set(propertyKeys);
	for (const key of Object.keys(descriptors)) {
		if (keysToDiscard.has(key)) continue;
		Object.defineProperty(result, key, descriptors[key]);
	}
	return result;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/memory/update.mjs
/**
* Updates a value with new properties while preserving property enumerability. Use this function to modify
* existing types without altering their configuration.
*/
function Update$1(current, hidden, enumerable) {
	Metrics.update += 1;
	const settings = Get$3();
	const result = Clone$1(current);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/schema.mjs
function IsKind(value, kind) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && IsEqual$1(value["~kind"], kind);
}
function IsSchema$1(value) {
	return IsObject$2(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/_optional.mjs
/** Returns true if this value is a OptionalAddAction. */
function IsOptionalAddAction(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && HasPropertyKey$1(value, "type") && IsEqual$1(value["~kind"], "OptionalAddAction") && IsSchema$1(value.type);
}
/** Returns true if this value is a OptionalRemoveAction. */
function IsOptionalRemoveAction(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && HasPropertyKey$1(value, "type") && IsEqual$1(value["~kind"], "OptionalRemoveAction") && IsSchema$1(value.type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/_readonly.mjs
/** Returns true if this value is a ReadonlyAddAction. */
function IsReadonlyAddAction(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && HasPropertyKey$1(value, "type") && IsEqual$1(value["~kind"], "ReadonlyAddAction") && IsSchema$1(value.type);
}
/** Returns true if this value is a ReadonlyRemoveAction. */
function IsReadonlyRemoveAction(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && HasPropertyKey$1(value, "type") && IsEqual$1(value["~kind"], "ReadonlyRemoveAction") && IsSchema$1(value.type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/deferred.mjs
/** Creates a Deferred action. */
function Deferred(action, parameters, options) {
	return Create$1({ "~kind": "Deferred" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/_immutable.mjs
/** Adds Immutable to the given type. */
function ImmutableAdd(type) {
	return Update$1(type, { "~immutable": true }, {});
}
/** Applies an Immutable modifier to the given type. */
function Immutable(type) {
	return ImmutableAdd(type);
}
/** Returns true if the given value is a TImmutable */
function IsImmutable(value) {
	return IsSchema$1(value) && HasPropertyKey$1(value, "~immutable");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/_optional.mjs
/** Removes Optional from the given type. */
function OptionalRemove(type) {
	return Discard(type, ["~optional"]);
}
/** Adds Optional to the given type. */
function OptionalAdd(type) {
	return Update$1(type, { "~optional": true }, {});
}
/** Applies an Optional modifier to the given type. */
function Optional(type) {
	return OptionalAdd(type);
}
/** Returns true if the given value is TOptional */
function IsOptional(value) {
	return IsSchema$1(value) && HasPropertyKey$1(value, "~optional");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/_readonly.mjs
/** Removes a Readonly property modifier from the given type. */
function ReadonlyRemove(type) {
	return Discard(type, ["~readonly"]);
}
/** Adds a Readonly property modifier to the given type. */
function ReadonlyAdd(type) {
	return Update$1(type, { "~readonly": true }, {});
}
/** Applies an Readonly property modifier to the given type. */
function Readonly(type) {
	return ReadonlyAdd(type);
}
/** Returns true if the given value is a TReadonly */
function IsReadonly(value) {
	return IsSchema$1(value) && HasPropertyKey$1(value, "~readonly");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/array.mjs
/** Creates an Array type. */
function Array$1(items, options) {
	return Create$1({ "~kind": "Array" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/async-iterator.mjs
/** Creates a AsyncIterator type. */
function AsyncIterator(iteratorItems, options) {
	return Create$1({ "~kind": "AsyncIterator" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/base.mjs
function BaseProperty(value) {
	return {
		enumerable: Get$3().enumerableKind,
		writable: false,
		configurable: false,
		value
	};
}
/** Base class for creating extension types. */
var Base = class {
	constructor() {
		globalThis.Object.defineProperty(this, "~kind", BaseProperty("Base"));
		globalThis.Object.defineProperty(this, "~guard", BaseProperty({
			check: (value) => this.Check(value),
			errors: (value) => this.Errors(value)
		}));
	}
	/** Checks a value or returns false if invalid */
	Check(value) {
		return true;
	}
	/** Returns errors for a value. Return an empty array if valid.  */
	Errors(value) {
		return [];
	}
	/** Converts a value into this type */
	Convert(value) {
		return value;
	}
	/** Cleans a value according to this type */
	Clean(value) {
		return value;
	}
	/** Returns a default value for this type */
	Default(value) {
		return value;
	}
	/** Creates a new instance of this type */
	Create() {
		throw new Error("Create not implemented");
	}
	/** Clones this type  */
	Clone() {
		throw Error("Clone not implemented");
	}
};
/** Returns true if the given value is a Base type. */
function IsBase(value) {
	return IsKind(value, "Base");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/constructor.mjs
/** Creates a Constructor type. */
function Constructor(parameters, instanceType, options = {}) {
	return Create$1({ "~kind": "Constructor" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/function.mjs
/** Creates a Function type. */
function _Function_(parameters, returnType, options = {}) {
	return Create$1({ ["~kind"]: "Function" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/ref.mjs
/** Creates a Ref type. */
function Ref$1(ref, options) {
	return Create$1({ ["~kind"]: "Ref" }, { $ref: ref }, options);
}
/** Returns true if the given value is TRef. */
function IsRef$1(value) {
	return IsKind(value, "Ref");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/generic.mjs
/** Creates a Generic type. */
function Generic(parameters, expression) {
	return Create$1({ "~kind": "Generic" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/never.mjs
const NeverPattern = "(?!)";
/** Creates a Never type. */
function Never(options) {
	return Create$1({ "~kind": "Never" }, { not: {} }, options);
}
/** Returns true if the given value is TNever. */
function IsNever(value) {
	return IsKind(value, "Never");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/call/resolve-target.mjs
function FromNotResolvable() {
	return ["(not-resolvable)", Never()];
}
function FromNotGeneric() {
	return ["(not-generic)", Never()];
}
function FromGeneric(name, parameters, expression) {
	return [name, Generic(parameters, expression)];
}
function FromRef$9(context, ref, arguments_) {
	return ref in context ? FromType$18(context, ref, context[ref], arguments_) : FromNotResolvable();
}
function FromType$18(context, name, target, arguments_) {
	return IsGeneric(target) ? FromGeneric(name, target.parameters, target.expression) : IsRef$1(target) ? FromRef$9(context, target.$ref, arguments_) : FromNotGeneric();
}
/** Resolves a named generic target from the context, or returns TNever if it cannot be resolved or is not generic. */
function ResolveTarget(context, target, arguments_) {
	return FromType$18(context, "(anonymous)", target, arguments_);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/cyclic.mjs
/** Creates a Cyclic type. */
function Cyclic($defs, $ref, options) {
	const defs = Keys$1($defs).reduce((result, key) => {
		return {
			...result,
			[key]: Update$1($defs[key], {}, { $id: key })
		};
	}, {});
	return Create$1({ ["~kind"]: "Cyclic" }, {
		$defs: defs,
		$ref
	}, options);
}
/** Returns true if the given value is a TCyclic. */
function IsCyclic(value) {
	return IsKind(value, "Cyclic");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/arguments/arguments.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/unknown.mjs
/** Creates an Unknown type. */
function Unknown(options) {
	return Create$1({ ["~kind"]: "Unknown" }, {}, options);
}
/** Returns true if the given value is TUnknown. */
function IsUnknown(value) {
	return IsKind(value, "Unknown");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/infer.mjs
/** Returns true if the given value is TInfer. */
function IsInfer(value) {
	return IsKind(value, "Infer");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/any.mjs
/** Creates a Any type. */
function Any(options) {
	return Create$1({ ["~kind"]: "Any" }, {}, options);
}
/** Returns true if the given value is a TAny. */
function IsAny(value) {
	return IsKind(value, "Any");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/enum/typescript-enum-to-enum-values.mjs
function IsTypeScriptEnumLike(value) {
	return IsObjectNotArray$1(value);
}
function TypeScriptEnumToEnumValues(type) {
	return Keys$1(type).filter((key) => isNaN(key)).reduce((result, key) => [...result, type[key]], []);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/enum.mjs
/** Creates an Enum type. */
function Enum(value, options) {
	const values = IsTypeScriptEnumLike(value) ? TypeScriptEnumToEnumValues(value) : value;
	return Create$1({ "~kind": "Enum" }, { enum: values }, options);
}
/** Returns true if the given value is a TEnum. */
function IsEnum$1(value) {
	return IsKind(value, "Enum");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/intersect.mjs
/** Creates a Intersect type. */
function Intersect(types, options = {}) {
	return Create$1({ "~kind": "Intersect" }, { allOf: types }, options);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/unreachable/unreachable.mjs
/** Used for unreachable logic */
function Unreachable() {
	throw new Error("Unreachable");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/environment/can-evaluate.mjs
let supported = void 0;
function TryEval() {
	try {
		new globalThis.Function("null")();
		return true;
	} catch {
		return false;
	}
}
/** Returns true if the environment supports dynamic JavaScript evaluation */
function CanEvaluate() {
	if (IsUndefined$2(supported)) supported = TryEval();
	return supported && Get$3().useEval;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/hashing/hash.mjs
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
const F64 = new Float64Array(1);
const F64In = new DataView(F64.buffer);
const F64Out = new Uint8Array(F64.buffer);
function FNV1A64_OP(byte) {
	Accumulator = Accumulator ^ Bytes[byte];
	Accumulator = Accumulator * Prime % Size;
}
function FromArray$11(value) {
	FNV1A64_OP(ByteMarker.Array);
	for (const item of value) FromValue$2(item);
}
function FromBigInt$8(value) {
	FNV1A64_OP(ByteMarker.BigInt);
	F64In.setBigInt64(0, value);
	for (const byte of F64Out) FNV1A64_OP(byte);
}
function FromBoolean$8(value) {
	FNV1A64_OP(ByteMarker.Boolean);
	FNV1A64_OP(value ? 1 : 0);
}
function FromConstructor$1(value) {
	FNV1A64_OP(ByteMarker.Constructor);
	FromValue$2(value.toString());
}
function FromDate(value) {
	FNV1A64_OP(ByteMarker.Date);
	FromValue$2(value.getTime());
}
function FromFunction$1(value) {
	FNV1A64_OP(ByteMarker.Function);
	FromValue$2(value.toString());
}
function FromNull$8(_value) {
	FNV1A64_OP(ByteMarker.Null);
}
function FromNumber$8(value) {
	FNV1A64_OP(ByteMarker.Number);
	F64In.setFloat64(0, value, true);
	for (const byte of F64Out) FNV1A64_OP(byte);
}
function FromObject$14(value) {
	FNV1A64_OP(ByteMarker.Object);
	for (const key of InstanceKeys(value).sort()) {
		FromValue$2(key);
		FromValue$2(value[key]);
	}
}
function FromRegExp(value) {
	FNV1A64_OP(ByteMarker.RegExp);
	FromString$8(value.toString());
}
const encoder = new TextEncoder();
function FromString$8(value) {
	FNV1A64_OP(ByteMarker.String);
	for (const byte of encoder.encode(value)) FNV1A64_OP(byte);
}
function FromSymbol$1(value) {
	FNV1A64_OP(ByteMarker.Symbol);
	FromValue$2(value.toString());
}
function FromTypeArray(value) {
	FNV1A64_OP(ByteMarker.TypeArray);
	const buffer = new Uint8Array(value.buffer);
	for (let i = 0; i < buffer.length; i++) FNV1A64_OP(buffer[i]);
}
function FromUndefined$8(_value) {
	return FNV1A64_OP(ByteMarker.Undefined);
}
function FromValue$2(value) {
	return IsTypeArray(value) ? FromTypeArray(value) : IsDate$1(value) ? FromDate(value) : IsRegExp(value) ? FromRegExp(value) : IsBoolean$1(value) ? FromBoolean$8(value.valueOf()) : IsString$1(value) ? FromString$8(value.valueOf()) : IsNumber$1(value) ? FromNumber$8(value.valueOf()) : IsIEEE754(value) ? FromNumber$8(value) : IsArray$2(value) ? FromArray$11(value) : IsBoolean$3(value) ? FromBoolean$8(value) : IsBigInt$2(value) ? FromBigInt$8(value) : IsConstructor$2(value) ? FromConstructor$1(value) : IsNull$2(value) ? FromNull$8(value) : IsObject$2(value) ? FromObject$14(value) : IsString$3(value) ? FromString$8(value) : IsSymbol$2(value) ? FromSymbol$1(value) : IsUndefined$2(value) ? FromUndefined$8(value) : IsFunction$2(value) ? FromFunction$1(value) : Unreachable();
}
/** Generates a FNV1A-64 non cryptographic hash of the given value */
function HashCode(value) {
	Accumulator = BigInt("14695981039346656037");
	FromValue$2(value);
	return Accumulator;
}
/** Generates a FNV1A-64 non cryptographic hash of the given value */
function Hash(value) {
	return HashCode(value).toString(16).padStart(16, "0");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/locale/en_US.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/system/locale/_config.mjs
let locale = en_US;
/** Gets the locale */
function Get$2() {
	return locale;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/_codec.mjs
var EncodeBuilder = class {
	constructor(type, decode) {
		this.type = type;
		this.decode = decode;
	}
	Encode(callback) {
		const type = this.type;
		const codec = {
			decode: IsCodec(type) ? (value) => this.decode(type["~codec"].decode(value)) : this.decode,
			encode: IsCodec(type) ? (value) => type["~codec"].encode(callback(value)) : callback
		};
		return Update$1(this.type, { "~codec": codec }, {});
	}
};
var DecodeBuilder = class {
	constructor(type) {
		this.type = type;
	}
	Decode(callback) {
		return new EncodeBuilder(this.type, callback);
	}
};
/** Creates a bi-directional Codec. Codec functions are called on Value.Decode and Value.Encode. */
function Codec(type) {
	return new DecodeBuilder(type);
}
function IsCodec(value) {
	return IsSchema$1(value) && HasPropertyKey$1(value, "~codec") && IsObject$2(value["~codec"]) && HasPropertyKey$1(value["~codec"], "encode") && HasPropertyKey$1(value["~codec"], "decode");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/bigint.mjs
const BigIntPattern = "-?(?:0|[1-9][0-9]*)n";
/** Creates a BigInt type. */
function BigInt$1(options) {
	return Create$1({ "~kind": "BigInt" }, { type: "bigint" }, options);
}
/** Returns true if the given value is a TBigInt. */
function IsBigInt(value) {
	return IsKind(value, "BigInt");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/boolean.mjs
/** Returns true if the given value is a TBoolean. */
function IsBoolean(value) {
	return IsKind(value, "Boolean");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/integer.mjs
const IntegerPattern = "-?(?:0|[1-9][0-9]*)";
/** Creates a Integer type. */
function Integer(options) {
	return Create$1({ "~kind": "Integer" }, { type: "integer" }, options);
}
/** Returns true if the given value is TInteger. */
function IsInteger(value) {
	return IsKind(value, "Integer");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/iterator.mjs
/** Creates a Iterator type. */
function Iterator(iteratorItems, options) {
	return Create$1({ "~kind": "Iterator" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/literal.mjs
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
	return IsBigInt$2(value) ? "bigint" : IsBoolean$3(value) ? "boolean" : IsNumber$3(value) ? "number" : IsString$3(value) ? "string" : (() => {
		throw new InvalidLiteralValue(value);
	})();
}
/** Creates a Literal type. */
function Literal(value, options) {
	return Create$1({ "~kind": "Literal" }, {
		type: LiteralTypeName(value),
		const: value
	}, options);
}
/** Returns true if the given value is a TLiteralValue. */
function IsLiteralValue(value) {
	return IsBigInt$2(value) || IsBoolean$3(value) || IsNumber$3(value) || IsString$3(value);
}
/** Returns true if the given value is TLiteral<bigint>. */
function IsLiteralBigInt(value) {
	return IsLiteral(value) && IsBigInt$2(value.const);
}
/** Returns true if the given value is TLiteral<boolean>. */
function IsLiteralBoolean(value) {
	return IsLiteral(value) && IsBoolean$3(value.const);
}
/** Returns true if the given value is TLiteral<number>. */
function IsLiteralNumber(value) {
	return IsLiteral(value) && IsNumber$3(value.const);
}
/** Returns true if the given value is TLiteral<string>. */
function IsLiteralString(value) {
	return IsLiteral(value) && IsString$3(value.const);
}
/** Returns true if the given value is TLiteral. */
function IsLiteral(value) {
	return IsKind(value, "Literal");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/null.mjs
/** Creates a Null type. */
function Null(options) {
	return Create$1({ "~kind": "Null" }, { type: "null" }, options);
}
/** Returns true if the given value is TNull. */
function IsNull(value) {
	return IsKind(value, "Null");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/number.mjs
const NumberPattern = "-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?";
/** Creates a Number type. */
function Number$1(options) {
	return Create$1({ "~kind": "Number" }, { type: "number" }, options);
}
/** Returns true if the given value is a TNumber. */
function IsNumber(value) {
	return IsKind(value, "Number");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/symbol.mjs
/** Creates a Symbol type. */
function Symbol$1(options) {
	return Create$1({ "~kind": "Symbol" }, { type: "symbol" }, options);
}
/** Returns true if the given value is TSymbol. */
function IsSymbol(value) {
	return IsKind(value, "Symbol");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/properties.mjs
/** Creates a RequiredArray derived from the given TProperties value. */
function RequiredArray(properties) {
	return Keys$1(properties).filter((key) => !IsOptional(properties[key]));
}
/** Extracts a tuple of keys from a TProperties value. */
function PropertyKeys(properties) {
	return Keys$1(properties);
}
/** Extracts a tuple of property values from a TProperties value. */
function PropertyValues(properties) {
	return Values(properties);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/object.mjs
/** Creates an Object type. */
function _Object_(properties, options = {}) {
	const requiredKeys = RequiredArray(properties);
	const required = requiredKeys.length > 0 ? { required: requiredKeys } : {};
	return Create$1({ "~kind": "Object" }, {
		type: "object",
		...required,
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/promise.mjs
/** Creates a Promise type. */
function Promise$1(item, options) {
	return Create$1({ ["~kind"]: "Promise" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/string.mjs
const StringPattern = ".*";
/** Creates a String type. */
function String$1(options) {
	return Create$1({ "~kind": "String" }, { type: "string" }, options);
}
/** Returns true if the given value is TString. */
function IsString(value) {
	return IsKind(value, "String");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/union.mjs
/** Creates a Union type. */
function Union(anyOf, options = {}) {
	return Create$1({ "~kind": "Union" }, { anyOf }, options);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/patterns/pattern.mjs
/** Parses a Pattern into a sequence of TemplateLiteral types. A result of [] indicates failure to parse. */
function ParsePatternIntoTypes(pattern) {
	const parsed = Pattern(pattern);
	return IsEqual$1(parsed.length, 2) ? parsed[0] : [];
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/template-literal/is-finite.mjs
function FromLiteral$5(value) {
	return true;
}
function FromTypesReduce(types) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? FromType$17(left) ? FromTypesReduce(right) : false : true;
}
function FromTypes$3(types) {
	return IsEqual$1(types.length, 0) ? false : FromTypesReduce(types);
}
function FromType$17(type) {
	return IsUnion(type) ? FromTypes$3(type.anyOf) : IsLiteral(type) ? FromLiteral$5(type.const) : false;
}
/** Returns true if the given TemplateLiteral types yields a finite variant set */
function IsTemplateLiteralFinite(types) {
	return FromTypes$3(types);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/template-literal/create.mjs
function TemplateLiteralCreate(pattern) {
	return Create$1({ ["~kind"]: "TemplateLiteral" }, {
		type: "string",
		pattern
	}, {});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/template-literal/decode.mjs
function FromLiteralPush(variants, value, result = []) {
	const [left, ...right] = variants;
	return IsString$3(left) ? FromLiteralPush(right, value, [...result, `${left}${value}`]) : result;
}
function FromLiteral$4(variants, value) {
	return IsEqual$1(variants.length, 0) ? [`${value}`] : FromLiteralPush(variants, value);
}
function FromUnion$13(variants, types, result = []) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? FromUnion$13(variants, right, [...result, ...FromType$16(variants, left)]) : result;
}
function FromType$16(variants, type) {
	return IsUnion(type) ? FromUnion$13(variants, type.anyOf) : IsLiteral(type) ? FromLiteral$4(variants, type.const) : Unreachable();
}
function DecodeFromSpan(variants, types) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? DecodeFromSpan(FromType$16(variants, left), right) : variants;
}
function VariantsToLiterals(variants) {
	return variants.map((variant) => Literal(variant));
}
function DecodeTypesAsUnion(types) {
	return Union(VariantsToLiterals(DecodeFromSpan([], types)));
}
function DecodeTypes(types) {
	return IsEqual$1(types.length, 0) ? Unreachable() : IsEqual$1(types.length, 1) && IsLiteral(types[0]) ? types[0] : DecodeTypesAsUnion(types);
}
/**
* (Internal) Decodes a TemplateLiteral pattern into a Type. This function is unsafe. Decoding a non-finite
* TemplateLiteral pattern may produce another TemplateLiteral pattern. During enumeration, this
* TemplateLiteral -> TemplateLiteral behavior can cause a StackOverflow. A better in-flight template-literal
* decoding algorithm is needed. (for review)
*/
function TemplateLiteralDecodeUnsafe(pattern) {
	const types = ParsePatternIntoTypes(pattern);
	return IsEqual$1(types.length, 0) ? String$1() : IsTemplateLiteralFinite(types) ? DecodeTypes(types) : TemplateLiteralCreate(pattern);
}
/** Decodes a TemplateLiteral pattern but returns TString if the pattern in non-finite. */
function TemplateLiteralDecode(pattern) {
	const decoded = TemplateLiteralDecodeUnsafe(pattern);
	return IsTemplateLiteral(decoded) ? String$1() : decoded;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/record-create.mjs
function CreateRecord(key, value) {
	const type = "object";
	const patternProperties = { [key]: value };
	return Create$1({ ["~kind"]: "Record" }, {
		type,
		patternProperties
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/record.mjs
const IntegerKey = `^${IntegerPattern}$`;
const NumberKey = `^${NumberPattern}$`;
const StringKey = `^${StringPattern}$`;
/** Represents a deferred Record action. */
function RecordDeferred(key, value, options = {}) {
	return Deferred("Record", [key, value], options);
}
function RecordConstruct(key, value, options = {}) {
	return Instantiate({}, RecordDeferred(key, value, options));
}
/** Creates a Record type. */
function Record(key, value, options = {}) {
	return RecordConstruct(key, value, options);
}
/** Creates a Record type from regular expression pattern. */
function RecordFromPattern(key, value) {
	return CreateRecord(key, value);
}
/** Returns the raw string pattern used for the Record key  */
function RecordPattern(type) {
	return Keys$1(type.patternProperties)[0];
}
/** Returns the Record key as a TypeBox type  */
function RecordKey(type) {
	const pattern = RecordPattern(type);
	return IsEqual$1(pattern, StringKey) ? String$1() : IsEqual$1(pattern, IntegerKey) ? Integer() : IsEqual$1(pattern, NumberKey) ? Number$1() : TemplateLiteralDecodeUnsafe(pattern);
}
function RecordValue(type) {
	return type.patternProperties[RecordPattern(type)];
}
function IsRecord(value) {
	return IsKind(value, "Record");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/rest.mjs
/** Creates a Rest instruction type. */
function Rest(type) {
	return Create$1({ "~kind": "Rest" }, {
		type: "rest",
		items: type
	}, {});
}
/** Returns true if the given value is TRest. */
function IsRest(value) {
	return IsKind(value, "Rest");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/tuple.mjs
/** Creates a Tuple type. */
function Tuple(types, options = {}) {
	const [items, minItems, additionalItems] = [
		types,
		types.length,
		false
	];
	return Create$1({ ["~kind"]: "Tuple" }, {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/undefined.mjs
/** Creates a Undefined type. */
function Undefined(options) {
	return Create$1({ "~kind": "Undefined" }, { type: "undefined" }, options);
}
/** Returns true if the given value is TUndefined. */
function IsUndefined(value) {
	return IsKind(value, "Undefined");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/void.mjs
/** Returns true if the given value is TVoid. */
function IsVoid(value) {
	return IsKind(value, "Void");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/mapping.mjs
function PatternBigIntMapping(input) {
	return BigInt$1();
}
function PatternStringMapping(input) {
	return String$1();
}
function PatternNumberMapping(input) {
	return Number$1();
}
function PatternIntegerMapping(input) {
	return Integer();
}
function PatternNeverMapping(input) {
	return Never();
}
function PatternTextMapping(input) {
	return Literal(input);
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

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/internal/result.mjs
/** Checks the value is a Tuple-2 [string, string] result */
function IsResult(value) {
	return IsArray$2(value) && IsEqual$1(value.length, 2);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/internal/take.mjs
function TakeVariant(variant, input) {
	return IsEqual$1(input.indexOf(variant), 0) ? [variant, input.slice(variant.length)] : [];
}
/** Takes one of the given variants or fail */
function Take(variants, input) {
	const [left, ...right] = variants;
	return IsString$3(left) ? (() => {
		const result = TakeVariant(left, input);
		return IsEqual$1(result.length, 2) ? result : Take(right, input);
	})() : [];
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/internal/char.mjs
function Range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));
}
const Alpha = [...Range(97, 122), ...Range(65, 90)];
const Zero = "0";
const NonZero = Range(49, 57);
const Digit = [Zero, ...NonZero];
const WhiteSpace = " ";
const NewLine = "\n";
const UnderScore = "_";
const DollarSign = "$";

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/internal/trim.mjs
const LineComment = "//";
const OpenComment = "/*";
const CloseComment = "*/";
function DiscardMultilineComment(input) {
	const index = input.indexOf(CloseComment);
	return IsEqual$1(index, -1) ? "" : input.slice(index + 2);
}
function DiscardLineComment(input) {
	const index = input.indexOf(NewLine);
	return IsEqual$1(index, -1) ? "" : input.slice(index);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/integer.mjs
const AllowedDigits$1 = [...Digit, UnderScore];

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/const.mjs
function TakeConst(const_, input) {
	return Take([const_], input);
}
/** Matches if next is the given Const value */
function Const(const_, input) {
	return IsEqual$1(const_, "") ? ["", input] : const_.startsWith(NewLine) ? TakeConst(const_, TrimWhitespace(input)) : const_.startsWith(WhiteSpace) ? TakeConst(const_, input) : TakeConst(const_, Trim(input));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/ident.mjs
const Initial = [
	...Alpha,
	UnderScore,
	DollarSign
];
const Remaining = [...Initial, ...Digit];

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/number.mjs
const AllowedDigits = [...Digit, UnderScore];

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/until.mjs
function IsEnd(end, input) {
	const [left, ...right] = end;
	return IsString$3(left) ? input.startsWith(left) ? true : IsEnd(right, input) : false;
}
/** Match Input until but not including End. No match if End not found. */
function Until(end, input, result = "") {
	return IsEqual$1(input, "") ? [] : IsEnd(end, input) ? [result, input] : (() => {
		const [left, right] = [input.slice(0, 1), input.slice(1)];
		return Until(end, right, `${result}${left}`);
	})();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/token/until_1.mjs
/** Match Input until but not including End. No match if End not found or match is zero-length. */
function Until_1(end, input) {
	const until = Until(end, input);
	return IsResult(until) ? IsEqual$1(until[0], "") ? [] : until : [];
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/script/parser.mjs
const If = (result, left, right = () => []) => result.length === 2 ? left(result) : right();
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

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/template-literal.mjs
/** Creates a deferred TemplateLiteral action. */
function TemplateLiteralDeferred(types, options = {}) {
	return Deferred("TemplateLiteral", [types], options);
}
/** Returns true if the given value is TTemplateLiteral. */
function IsTemplateLiteral(value) {
	return IsKind(value, "TemplateLiteral");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/result.mjs
function ExtendsUnion$1(inferred) {
	return Create$1({ ["~kind"]: "ExtendsUnion" }, { inferred });
}
function IsExtendsUnion(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && HasPropertyKey$1(value, "inferred") && IsEqual$1(value["~kind"], "ExtendsUnion") && IsObject$2(value.inferred);
}
function ExtendsTrue(inferred) {
	return Create$1({ ["~kind"]: "ExtendsTrue" }, { inferred });
}
function IsExtendsTrue(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && HasPropertyKey$1(value, "inferred") && IsEqual$1(value["~kind"], "ExtendsTrue") && IsObject$2(value.inferred);
}
function ExtendsFalse() {
	return Create$1({ ["~kind"]: "ExtendsFalse" }, {});
}
function IsExtendsFalse(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && IsEqual$1(value["~kind"], "ExtendsFalse");
}
function IsExtendsTrueLike(value) {
	return IsExtendsUnion(value) || IsExtendsTrue(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/enum/enum-to-union.mjs
function FromEnumValue(value) {
	return IsString$3(value) || IsNumber$3(value) ? Literal(value) : IsNull$2(value) ? Null() : Never();
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/extends-right.mjs
function ExtendsRightInfer(inferred, name, left, right) {
	const check = ExtendsLeft(inferred, left, right);
	return IsExtendsTrueLike(check) ? ExtendsTrue(Assign(Assign(inferred, check.inferred), { [name]: left })) : ExtendsFalse();
}
function ExtendsRightAny(inferred, left) {
	return ExtendsTrue(inferred);
}
function ExtendsRightEnum(inferred, left, right) {
	return ExtendsLeft(inferred, left, EnumValuesToUnion(right));
}
function ExtendsRightIntersect(inferred, left, right) {
	const [head, ...tail] = right;
	return IsSchema$1(head) ? (() => {
		const check = ExtendsLeft(inferred, left, head);
		return IsExtendsTrueLike(check) ? ExtendsRightIntersect(check.inferred, left, tail) : ExtendsFalse();
	})() : ExtendsTrue(inferred);
}
function ExtendsRightTemplateLiteral(inferred, left, right) {
	return ExtendsLeft(inferred, left, TemplateLiteralDecode(right));
}
function ExtendsRightUnion(inferred, left, right) {
	const [head, ...tail] = right;
	return IsSchema$1(head) ? (() => {
		const check = ExtendsLeft(inferred, left, head);
		return IsExtendsTrueLike(check) ? ExtendsTrue(check.inferred) : ExtendsRightUnion(inferred, left, tail);
	})() : ExtendsFalse();
}
function ExtendsRight(inferred, left, right) {
	return IsAny(right) ? ExtendsRightAny(inferred, left) : IsEnum$1(right) ? ExtendsRightEnum(inferred, left, right.enum) : IsInfer(right) ? ExtendsRightInfer(inferred, right.name, left, right.extends) : IsIntersect(right) ? ExtendsRightIntersect(inferred, left, right.allOf) : IsTemplateLiteral(right) ? ExtendsRightTemplateLiteral(inferred, left, right.pattern) : IsUnion(right) ? ExtendsRightUnion(inferred, left, right.anyOf) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsFalse();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/any.mjs
function ExtendsAny(inferred, left, right) {
	return IsInfer(right) ? ExtendsRight(inferred, left, right) : IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsUnion$1(inferred);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/array.mjs
function ExtendsImmutable(left, right) {
	const isImmutableLeft = IsImmutable(left);
	const isImmutableRight = IsImmutable(right);
	return isImmutableLeft && isImmutableRight ? true : !isImmutableLeft && isImmutableRight ? true : isImmutableLeft && !isImmutableRight ? false : true;
}
function ExtendsArray(inferred, arrayLeft, left, right) {
	return IsArray(right) ? ExtendsImmutable(arrayLeft, right) ? ExtendsLeft(inferred, left, right.items) : ExtendsFalse() : ExtendsRight(inferred, arrayLeft, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/async-iterator.mjs
function ExtendsAsyncIterator(inferred, left, right) {
	return IsAsyncIterator(right) ? ExtendsLeft(inferred, left, right.iteratorItems) : ExtendsRight(inferred, AsyncIterator(left), right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/bigint.mjs
function ExtendsBigInt(inferred, left, right) {
	return IsBigInt(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/boolean.mjs
function ExtendsBoolean(inferred, left, right) {
	return IsBoolean(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/parameters.mjs
function ParameterCompare(inferred, left, leftRest, right, rightRest) {
	const checkLeft = IsInfer(right) ? left : right;
	const checkRight = IsInfer(right) ? right : left;
	const isLeftOptional = IsOptional(left);
	const isRightOptional = IsOptional(right);
	const check = ExtendsLeft(inferred, checkLeft, checkRight);
	return !isLeftOptional && isRightOptional ? ExtendsFalse() : IsExtendsTrueLike(check) ? ExtendsParameters(check.inferred, leftRest, rightRest) : ExtendsFalse();
}
function ParameterRight(inferred, left, leftRest, rightRest) {
	const [head, ...tail] = rightRest;
	return IsSchema$1(head) ? ParameterCompare(inferred, left, leftRest, head, tail) : IsOptional(left) ? ExtendsTrue(inferred) : ExtendsFalse();
}
function ParametersLeft(inferred, left, rightRest) {
	const [head, ...tail] = left;
	return IsSchema$1(head) ? ParameterRight(inferred, head, tail, rightRest) : ExtendsTrue(inferred);
}
function ExtendsParameters(inferred, left, right) {
	return ParametersLeft(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/return-type.mjs
function ExtendsReturnType(inferred, left, right) {
	return IsVoid(right) ? ExtendsTrue(inferred) : ExtendsLeft(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/constructor.mjs
function ExtendsConstructor(inferred, parameters, returnType, right) {
	return IsConstructor(right) ? (() => {
		const check = ExtendsParameters(inferred, parameters, right.parameters);
		return IsExtendsTrueLike(check) ? ExtendsReturnType(check.inferred, returnType, right.instanceType) : ExtendsFalse();
	})() : ExtendsFalse();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/enum.mjs
function ExtendsEnum(inferred, left, right) {
	return ExtendsLeft(inferred, EnumToUnion(left), right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/function.mjs
function ExtendsFunction(inferred, parameters, returnType, right) {
	return IsFunction(right) ? (() => {
		const check = ExtendsParameters(inferred, parameters, right.parameters);
		return IsExtendsTrueLike(check) ? ExtendsReturnType(check.inferred, returnType, right.returnType) : ExtendsFalse();
	})() : ExtendsFalse();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/integer.mjs
function ExtendsInteger(inferred, left, right) {
	return IsInteger(right) ? ExtendsTrue(inferred) : IsNumber(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/evaluate/compare.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/evaluate/flatten.mjs
function FlattenType(type) {
	return IsUnion(type) ? Flatten(type.anyOf) : [type];
}
function Flatten(types) {
	return types.reduce((result, type) => {
		return [...result, ...FlattenType(type)];
	}, []);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/tuple/to-object.mjs
function TupleElementsToProperties(types) {
	return types.reduceRight((result, right, index) => {
		return {
			[index]: right,
			...result
		};
	}, {});
}
function TupleToObject(type) {
	return _Object_(TupleElementsToProperties(type.items));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/evaluate/composite.mjs
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
	return [...new Set([...Keys$1(right), ...Keys$1(left)])].reduce((result, key) => {
		return {
			...result,
			[key]: CompositePropertyKey(left, right, key)
		};
	}, {});
}
function GetProperties(type) {
	return IsObject(type) ? type.properties : IsTuple(type) ? TupleElementsToProperties(type.items) : Unreachable();
}
function Composite(left, right) {
	return _Object_(CompositeProperties(GetProperties(left), GetProperties(right)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/evaluate/narrow.mjs
function Narrow(left, right) {
	const result = Compare(left, right);
	return IsEqual$1(result, ResultLeftInside) ? left : IsEqual$1(result, ResultRightInside) ? right : IsEqual$1(result, ResultEqual) ? right : Never();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/evaluate/distribute.mjs
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
	const [left, ...right] = types;
	return !IsUndefined$2(left) ? DistributeType(type, right, [...result, DistributeOperation(type, left)]) : result.length === 0 ? [type] : result;
}
function DistributeUnion(types, distribution, result = []) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? DistributeUnion(right, distribution, [...result, ...Distribute([left], distribution)]) : result;
}
function Distribute(types, result = []) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? IsUnion(left) ? Distribute(right, DistributeUnion(left.anyOf, result)) : Distribute(right, DistributeType(left, result)) : result;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/evaluate/evaluate.mjs
function EvaluateIntersect(types) {
	return Broaden(Distribute(types));
}
function EvaluateUnion(types) {
	return Broaden(types);
}
function EvaluateType(type) {
	return IsIntersect(type) ? EvaluateIntersect(type.allOf) : IsUnion(type) ? EvaluateUnion(type.anyOf) : type;
}
function EvaluateUnionFast(types) {
	return IsEqual$1(types.length, 1) ? types[0] : IsEqual$1(types.length, 0) ? Never() : Union(types);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/evaluate/broaden.mjs
function BroadFilter(type, types) {
	return types.filter((left) => {
		return Compare(type, left) === ResultRightInside ? false : true;
	});
}
function IsBroadestType(type, types) {
	const result = types.some((left) => {
		const result = Compare(type, left);
		return IsEqual$1(result, ResultLeftInside) || IsEqual$1(result, ResultEqual);
	});
	return IsEqual$1(result, false);
}
function BroadenType(type, types) {
	const evaluated = EvaluateType(type);
	return IsAny(evaluated) ? [evaluated] : IsBroadestType(evaluated, types) ? [...BroadFilter(evaluated, types), evaluated] : types;
}
function BroadenTypes(types, result = []) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? IsObject(left) ? BroadenTypes(right, [...result, left]) : BroadenTypes(right, BroadenType(left, result)) : result;
}
/** Broadens a set of types and returns either the most broad type, or union or disjoint types. */
function Broaden(types) {
	const flattened = Flatten(BroadenTypes(types));
	return flattened.length === 0 ? Never() : flattened.length === 1 ? flattened[0] : Union(flattened);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/evaluate/instantiate.mjs
function EvaluateImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(EvaluateType(instantiatedType), {}, options);
}
function EvaluateInstantiate(context, state, type, options) {
	return EvaluateImmediate(context, state, type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/intersect.mjs
function ExtendsIntersect(inferred, left, right) {
	return ExtendsLeft(inferred, EvaluateIntersect(left), right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/iterator.mjs
function ExtendsIterator(inferred, left, right) {
	return IsIterator(right) ? ExtendsLeft(inferred, left, right.iteratorItems) : ExtendsRight(inferred, Iterator(left), right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/literal.mjs
function ExtendsLiteralValue(inferred, left, right) {
	return left === right ? ExtendsTrue(inferred) : ExtendsFalse();
}
function ExtendsLiteralBigInt(inferred, left, right) {
	return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsBigInt(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal(left), right);
}
function ExtendsLiteralBoolean(inferred, left, right) {
	return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsBoolean(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal(left), right);
}
function ExtendsLiteralNumber(inferred, left, right) {
	return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsNumber(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal(left), right);
}
function ExtendsLiteralString(inferred, left, right) {
	return IsLiteral(right) ? ExtendsLiteralValue(inferred, left, right.const) : IsString(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, Literal(left), right);
}
function ExtendsLiteral(inferred, left, right) {
	return IsBigInt$2(left.const) ? ExtendsLiteralBigInt(inferred, left.const, right) : IsBoolean$3(left.const) ? ExtendsLiteralBoolean(inferred, left.const, right) : IsNumber$3(left.const) ? ExtendsLiteralNumber(inferred, left.const, right) : IsString$3(left.const) ? ExtendsLiteralString(inferred, left.const, right) : Unreachable();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/never.mjs
function ExtendsNever(inferred, left, right) {
	return IsInfer(right) ? ExtendsRight(inferred, left, right) : ExtendsTrue(inferred);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/null.mjs
function ExtendsNull(inferred, left, right) {
	return IsNull(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/number.mjs
function ExtendsNumber(inferred, left, right) {
	return IsNumber(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/object.mjs
function ExtendsPropertyOptional(inferred, left, right) {
	return IsOptional(left) ? IsOptional(right) ? ExtendsTrue(inferred) : ExtendsFalse() : ExtendsTrue(inferred);
}
function ExtendsProperty(inferred, left, right) {
	return IsInfer(right) && IsNever(right.extends) ? ExtendsFalse() : (() => {
		const check = ExtendsLeft(inferred, left, right);
		return IsExtendsTrueLike(check) ? ExtendsPropertyOptional(check.inferred, left, right) : ExtendsFalse();
	})();
}
function ExtractInferredProperties(keys, properties) {
	return keys.reduce((result, key) => {
		return key in properties ? IsExtendsTrueLike(properties[key]) ? {
			...result,
			...properties[key].inferred
		} : Unreachable() : Unreachable();
	}, {});
}
function ExtendsPropertiesComparer(inferred, left, right) {
	const properties = {};
	for (const rightKey of Keys$1(right)) properties[rightKey] = rightKey in left ? ExtendsProperty({}, left[rightKey], right[rightKey]) : IsOptional(right[rightKey]) ? IsInfer(right[rightKey]) ? ExtendsTrue(Assign(inferred, { [right[rightKey].name]: right[rightKey].extends })) : ExtendsTrue(inferred) : ExtendsFalse();
	const checked = Values(properties).every((result) => IsExtendsTrueLike(result));
	const extracted = checked ? ExtractInferredProperties(Keys$1(properties), properties) : {};
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
	return IsObject(right) ? ExtendsObjectToObject(inferred, left, right.properties) : ExtendsRight(inferred, _Object_(left), right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/promise.mjs
function ExtendsPromise(inferred, left, right) {
	return IsPromise(right) ? ExtendsLeft(inferred, left, right.item) : ExtendsRight(inferred, Promise$1(left), right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/string.mjs
function ExtendsString(inferred, left, right) {
	return IsString(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/symbol.mjs
function ExtendsSymbol(inferred, left, right) {
	return IsSymbol(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/template-literal.mjs
function ExtendsTemplateLiteral(inferred, left, right) {
	return ExtendsLeft(inferred, TemplateLiteralDecode(left), right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/inference.mjs
function Inferrable(name, type) {
	return Create$1({ "~kind": "Inferrable" }, {
		name,
		type
	}, {});
}
function IsInferable(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "~kind") && HasPropertyKey$1(value, "name") && HasPropertyKey$1(value, "type") && IsEqual$1(value["~kind"], "Inferrable") && IsString$3(value.name) && IsObject$2(value.type);
}
function TryRestInferable(type) {
	return IsRest(type) ? IsInfer(type.items) ? IsArray(type.items.extends) ? Inferrable(type.items.name, type.items.extends.items) : IsUnknown(type.items.extends) ? Inferrable(type.items.name, type.items.extends) : void 0 : Unreachable() : void 0;
}
function TryInferable(type) {
	return IsInfer(type) ? Inferrable(type.name, type.extends) : void 0;
}
function TryInferResults(rest, right, result = []) {
	const [head, ...tail] = rest;
	return IsSchema$1(head) ? (() => {
		const check = ExtendsLeft({}, head, right);
		return IsExtendsTrueLike(check) ? TryInferResults(tail, right, [...result, head]) : void 0;
	})() : result;
}
function InferTupleResult(inferred, name, left, right) {
	const results = TryInferResults(left, right);
	return IsArray$2(results) ? ExtendsTrue(Assign(inferred, { [name]: Tuple(results) })) : ExtendsFalse();
}
function InferUnionResult(inferred, name, left, right) {
	const results = TryInferResults(left, right);
	return IsArray$2(results) ? ExtendsTrue(Assign(inferred, { [name]: Union(results) })) : ExtendsFalse();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/tuple.mjs
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
	const check = ExtendsLeft(inferred, left, right);
	return IsExtendsTrueLike(check) ? Elements(check.inferred, reversed, leftRest, rightRest) : ExtendsFalse();
}
function ElementsLeft(inferred, reversed, leftRest, right, rightRest) {
	const inferable = TryRestInferable(right);
	return IsInferable(inferable) ? InferTupleResult(inferred, inferable.name, ApplyReverse(leftRest, reversed), inferable.type) : (() => {
		const [head, ...tail] = leftRest;
		return IsSchema$1(head) ? ElementsCompare(inferred, reversed, head, tail, right, rightRest) : ExtendsFalse();
	})();
}
function ElementsRight(inferred, reversed, leftRest, rightRest) {
	const [head, ...tail] = rightRest;
	return IsSchema$1(head) ? ElementsLeft(inferred, reversed, leftRest, head, tail) : IsEqual$1(leftRest.length, 0) ? ExtendsTrue(inferred) : ExtendsFalse();
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
	return IsInferable(inferrable) ? InferUnionResult(inferred, inferrable.name, left, inferrable.type) : (() => {
		const [head, ...tail] = left;
		return IsSchema$1(head) ? (() => {
			const check = ExtendsLeft(inferred, head, right);
			return IsExtendsTrueLike(check) ? ExtendsTupleToArray(check.inferred, tail, right) : ExtendsFalse();
		})() : ExtendsTrue(inferred);
	})();
}
function ExtendsTuple(inferred, left, right) {
	const instantiatedLeft = InstantiateElements(inferred, { callstack: [] }, left);
	return IsTuple(right) ? ExtendsTupleToTuple(inferred, instantiatedLeft, right.items) : IsArray(right) ? ExtendsTupleToArray(inferred, instantiatedLeft, right.items) : ExtendsRight(inferred, Tuple(instantiatedLeft), right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/undefined.mjs
function ExtendsUndefined(inferred, left, right) {
	return IsVoid(right) ? ExtendsTrue(inferred) : IsUndefined(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/union.mjs
function ExtendsUnionSome(inferred, type, unionTypes) {
	const [head, ...tail] = unionTypes;
	return IsSchema$1(head) ? (() => {
		const check = ExtendsLeft(inferred, type, head);
		return IsExtendsTrueLike(check) ? ExtendsTrue(check.inferred) : ExtendsUnionSome(inferred, type, tail);
	})() : ExtendsFalse();
}
function ExtendsUnionLeft(inferred, left, right) {
	const [head, ...tail] = left;
	return IsSchema$1(head) ? (() => {
		const check = ExtendsUnionSome(inferred, head, right);
		return IsExtendsTrueLike(check) ? ExtendsUnionLeft(check.inferred, tail, right) : ExtendsFalse();
	})() : ExtendsTrue(inferred);
}
function ExtendsUnion(inferred, left, right) {
	const inferrable = TryInferable(right);
	return IsInferable(inferrable) ? InferUnionResult(inferred, inferrable.name, left, inferrable.type) : IsUnion(right) ? ExtendsUnionLeft(inferred, left, right.anyOf) : ExtendsUnionLeft(inferred, left, [right]);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/unknown.mjs
function ExtendsUnknown(inferred, left, right) {
	return IsInfer(right) ? ExtendsRight(inferred, left, right) : IsAny(right) ? ExtendsTrue(inferred) : IsUnknown(right) ? ExtendsTrue(inferred) : ExtendsFalse();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/void.mjs
function ExtendsVoid(inferred, left, right) {
	return IsVoid(right) ? ExtendsTrue(inferred) : ExtendsRight(inferred, left, right);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/extends-left.mjs
function ExtendsLeft(inferred, left, right) {
	return IsAny(left) ? ExtendsAny(inferred, left, right) : IsArray(left) ? ExtendsArray(inferred, left, left.items, right) : IsAsyncIterator(left) ? ExtendsAsyncIterator(inferred, left.iteratorItems, right) : IsBigInt(left) ? ExtendsBigInt(inferred, left, right) : IsBoolean(left) ? ExtendsBoolean(inferred, left, right) : IsConstructor(left) ? ExtendsConstructor(inferred, left.parameters, left.instanceType, right) : IsEnum$1(left) ? ExtendsEnum(inferred, left, right) : IsFunction(left) ? ExtendsFunction(inferred, left.parameters, left.returnType, right) : IsInteger(left) ? ExtendsInteger(inferred, left, right) : IsIntersect(left) ? ExtendsIntersect(inferred, left.allOf, right) : IsIterator(left) ? ExtendsIterator(inferred, left.iteratorItems, right) : IsLiteral(left) ? ExtendsLiteral(inferred, left, right) : IsNever(left) ? ExtendsNever(inferred, left, right) : IsNull(left) ? ExtendsNull(inferred, left, right) : IsNumber(left) ? ExtendsNumber(inferred, left, right) : IsObject(left) ? ExtendsObject(inferred, left.properties, right) : IsPromise(left) ? ExtendsPromise(inferred, left.item, right) : IsString(left) ? ExtendsString(inferred, left, right) : IsSymbol(left) ? ExtendsSymbol(inferred, left, right) : IsTemplateLiteral(left) ? ExtendsTemplateLiteral(inferred, left.pattern, right) : IsTuple(left) ? ExtendsTuple(inferred, left.items, right) : IsUndefined(left) ? ExtendsUndefined(inferred, left, right) : IsUnion(left) ? ExtendsUnion(inferred, left.anyOf, right) : IsUnknown(left) ? ExtendsUnknown(inferred, left, right) : IsVoid(left) ? ExtendsVoid(inferred, left, right) : ExtendsFalse();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/interface.mjs
/** Creates a deferred Interface action. */
function InterfaceDeferred(heritage, properties, options = {}) {
	return Deferred("Interface", [heritage, properties], options);
}
/** Returns true if this value is a deferred Interface action. */
function IsInterfaceDeferred(value) {
	return IsSchema$1(value) && HasPropertyKey$1(value, "action") && IsEqual$1(value.action, "Interface");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/cyclic/check.mjs
function FromRef$8(stack, context, ref) {
	return stack.includes(ref) ? true : FromType$15([...stack, ref], context, context[ref]);
}
function FromProperties$3(stack, context, properties) {
	return FromTypes$2(stack, context, PropertyValues(properties));
}
function FromTypes$2(stack, context, types) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? FromType$15(stack, context, left) ? true : FromTypes$2(stack, context, right) : false;
}
function FromType$15(stack, context, type) {
	return IsRef$1(type) ? FromRef$8(stack, context, type.$ref) : IsArray(type) ? FromType$15(stack, context, type.items) : IsAsyncIterator(type) ? FromType$15(stack, context, type.iteratorItems) : IsConstructor(type) ? FromTypes$2(stack, context, [...type.parameters, type.instanceType]) : IsFunction(type) ? FromTypes$2(stack, context, [...type.parameters, type.returnType]) : IsInterfaceDeferred(type) ? FromProperties$3(stack, context, type.parameters[1]) : IsIntersect(type) ? FromTypes$2(stack, context, type.allOf) : IsIterator(type) ? FromType$15(stack, context, type.iteratorItems) : IsObject(type) ? FromProperties$3(stack, context, type.properties) : IsPromise(type) ? FromType$15(stack, context, type.item) : IsUnion(type) ? FromTypes$2(stack, context, type.anyOf) : IsTuple(type) ? FromTypes$2(stack, context, type.items) : IsRecord(type) ? FromType$15(stack, context, RecordValue(type)) : false;
}
/** Performs a cyclic check on the given type. Initial key stack can be empty, but faster if specified */
function CyclicCheck(stack, context, type) {
	return FromType$15(stack, context, type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/cyclic/candidates.mjs
function ResolveCandidateKeys(context, keys) {
	return keys.reduce((result, left) => {
		return left in context ? CyclicCheck([left], context, context[left]) ? [...result, left] : result : Unreachable();
	}, []);
}
/** Returns keys for context types that need to be transformed to TCyclic. */
function CyclicCandidates(context) {
	return ResolveCandidateKeys(context, PropertyKeys(context));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/cyclic/dependencies.mjs
function FromRef$7(context, ref, result) {
	return result.includes(ref) ? result : ref in context ? FromType$14(context, context[ref], [...result, ref]) : Unreachable();
}
function FromProperties$2(context, properties, result) {
	return FromTypes$1(context, PropertyValues(properties), result);
}
function FromTypes$1(context, types, result) {
	return types.reduce((result, left) => {
		return FromType$14(context, left, result);
	}, result);
}
function FromType$14(context, type, result) {
	return IsRef$1(type) ? FromRef$7(context, type.$ref, result) : IsArray(type) ? FromType$14(context, type.items, result) : IsAsyncIterator(type) ? FromType$14(context, type.iteratorItems, result) : IsConstructor(type) ? FromTypes$1(context, [...type.parameters, type.instanceType], result) : IsFunction(type) ? FromTypes$1(context, [...type.parameters, type.returnType], result) : IsInterfaceDeferred(type) ? FromProperties$2(context, type.parameters[1], result) : IsIntersect(type) ? FromTypes$1(context, type.allOf, result) : IsIterator(type) ? FromType$14(context, type.iteratorItems, result) : IsObject(type) ? FromProperties$2(context, type.properties, result) : IsPromise(type) ? FromType$14(context, type.item, result) : IsUnion(type) ? FromTypes$1(context, type.anyOf, result) : IsTuple(type) ? FromTypes$1(context, type.items, result) : IsRecord(type) ? FromType$14(context, RecordValue(type), result) : result;
}
/** Returns dependent cyclic keys for the given type. This function is used to dead-type-eliminate (DTE) for initializing TCyclic types. */
function CyclicDependencies(context, key, type) {
	return FromType$14(context, type, [key]);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/cyclic/extends.mjs
function FromRef$6(_ref) {
	return Any();
}
function FromProperties$1(properties) {
	return Keys$1(properties).reduce((result, key) => {
		return {
			...result,
			[key]: FromType$13(properties[key])
		};
	}, {});
}
function FromTypes(types) {
	return types.reduce((result, left) => {
		return [...result, FromType$13(left)];
	}, []);
}
function FromType$13(type) {
	return IsRef$1(type) ? FromRef$6(type.$ref) : IsArray(type) ? Array$1(FromType$13(type.items), ArrayOptions(type)) : IsAsyncIterator(type) ? AsyncIterator(FromType$13(type.iteratorItems)) : IsConstructor(type) ? Constructor(FromTypes(type.parameters), FromType$13(type.instanceType)) : IsFunction(type) ? _Function_(FromTypes(type.parameters), FromType$13(type.returnType)) : IsIntersect(type) ? Intersect(FromTypes(type.allOf)) : IsIterator(type) ? Iterator(FromType$13(type.iteratorItems)) : IsObject(type) ? _Object_(FromProperties$1(type.properties)) : IsPromise(type) ? Promise$1(FromType$13(type.item)) : IsRecord(type) ? Record(RecordKey(type), FromType$13(RecordValue(type))) : IsUnion(type) ? Union(FromTypes(type.anyOf)) : IsTuple(type) ? Tuple(FromTypes(type.items)) : type;
}
function CyclicAnyFromParameters(defs, ref) {
	return ref in defs ? FromType$13(defs[ref]) : Unknown();
}
/** Transforms TCyclic TRef's into TAny's. This function is used prior to TExtends checks to enable cyclics to be structurally checked and terminated (with TAny) at first point of recursion, what would otherwise be a recursive TRef.*/
function CyclicExtends(type) {
	return CyclicAnyFromParameters(type.$defs, type.$ref);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/cyclic/instantiate.mjs
function CyclicInterface(context, heritage, properties) {
	const instantiatedHeritage = InstantiateTypes(context, { callstack: [] }, heritage);
	const instantiatedProperties = InstantiateProperties({}, { callstack: [] }, properties);
	return EvaluateIntersect([...instantiatedHeritage, _Object_(instantiatedProperties)]);
}
function CyclicDefinitions(context, dependencies) {
	return Keys$1(context).filter((key) => dependencies.includes(key)).reduce((result, key) => {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/cyclic/target.mjs
function Resolve(defs, ref) {
	return ref in defs ? IsRef$1(defs[ref]) ? Resolve(defs, defs[ref].$ref) : defs[ref] : Never();
}
/** Returns the target Type from the Defs or Never if target is non-resolvable */
function CyclicTarget(defs, ref) {
	return Resolve(defs, ref);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/extends/extends.mjs
function Normal(type) {
	return IsCyclic(type) ? CyclicExtends(type) : type;
}
/** Performs a structural extends check on left and right types and yields inferred types on right if specified. */
function Extends(inferred, left, right) {
	return ExtendsLeft(inferred, Normal(left), Normal(right));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/call/resolve-arguments.mjs
function AssertArgumentExtends(name, type, extends_) {
	if (IsInfer(type) || IsCall(type) || IsExtendsTrueLike(Extends({}, type, extends_))) return;
	const cause = {
		parameter: name,
		extends: extends_,
		received: type
	};
	throw new Error("Generic argument does not satify constraint", { cause });
}
function BindArgument(context, state, name, extends_, type) {
	const instantiatedArgument = InstantiateType(context, state, type);
	AssertArgumentExtends(name, instantiatedArgument, extends_);
	return Assign(context, { [name]: instantiatedArgument });
}
function BindArguments(context, state, parameterLeft, parameterRight, arguments_) {
	const instantiatedExtends = InstantiateType(context, state, parameterLeft.extends);
	const instantiatedEquals = InstantiateType(context, state, parameterLeft.equals);
	const [left, ...right] = arguments_;
	return IsSchema$1(left) ? BindParameters(BindArgument(context, state, parameterLeft["name"], instantiatedExtends, left), state, parameterRight, right) : BindParameters(BindArgument(context, state, parameterLeft["name"], instantiatedExtends, instantiatedEquals), state, parameterRight, []);
}
function BindParameters(context, state, parameters, arguments_) {
	const [left, ...right] = parameters;
	return IsSchema$1(left) ? BindArguments(context, state, left, right, arguments_) : context;
}
function ResolveArgumentsContext(context, state, parameters, arguments_) {
	return BindParameters(context, state, parameters, arguments_);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/call/instantiate.mjs
function Peek(callstack) {
	return IsGreaterThan$1(callstack.length, 0) ? callstack[0] : "";
}
function DeferredCall(context, state, target, arguments_) {
	return CallConstruct(target, InstantiateTypes(context, state, arguments_));
}
function TailCall(context, state, name, arguments_) {
	return DeferredCall(context, state, Ref$1(name), arguments_);
}
function HeadCall(context, state, name, parameters, expression, arguments_) {
	return InstantiateType(context, state, InstantiateType(ResolveArgumentsContext(context, state, parameters, InstantiateTypes(context, state, arguments_)), { callstack: [...state.callstack, name] }, expression));
}
function CallInstantiate(context, state, target, arguments_) {
	const [name, type] = ResolveTarget(context, target, arguments_);
	return IsGeneric(type) ? IsEqual$1(Peek(state.callstack), name) ? TailCall(context, state, name, arguments_) : HeadCall(context, state, name, type.parameters, type.expression, arguments_) : DeferredCall(context, state, target, arguments_);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/types/call.mjs
function CallConstruct(target, arguments_) {
	return Create$1({ ["~kind"]: "Call" }, {
		target,
		arguments: arguments_
	}, {});
}
/** Returns true if the given type is a TCall. */
function IsCall(value) {
	return IsKind(value, "Call");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/awaited/instantiate.mjs
function AwaitedAction(type) {
	return IsPromise(type) ? AwaitedAction(type.item) : type;
}
function AwaitedImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(AwaitedAction(instantiatedType), {}, options);
}
function AwaitedInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? AwaitedImmediate(context, state, type, options) : AwaitedDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/intrinsics/mapping.mjs
function ApplyMapping(mapping, value) {
	return mapping(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/intrinsics/from-literal.mjs
function FromLiteral$3(mapping, value) {
	return IsString$3(value) ? Literal(ApplyMapping(mapping, value)) : Literal(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/intrinsics/from-template-literal.mjs
function FromTemplateLiteral$4(mapping, pattern) {
	return FromType$12(mapping, TemplateLiteralDecode(pattern));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/intrinsics/from-union.mjs
function FromUnion$12(mapping, types) {
	return Union(types.map((type) => FromType$12(mapping, type)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/intrinsics/from-type.mjs
function FromType$12(mapping, type) {
	return IsLiteral(type) ? FromLiteral$3(mapping, type.const) : IsTemplateLiteral(type) ? FromTemplateLiteral$4(mapping, type.pattern) : IsUnion(type) ? FromUnion$12(mapping, type.anyOf) : type;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/capitalize.mjs
/** Creates a deferred Capitalize action. */
function CapitalizeDeferred(type, options = {}) {
	return Deferred("Capitalize", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/lowercase.mjs
/** Creates a deferred Lowercase action. */
function LowercaseDeferred(type, options = {}) {
	return Deferred("Lowercase", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/uncapitalize.mjs
/** Creates a deferred Uncapitalize action. */
function UncapitalizeDeferred(type, options = {}) {
	return Deferred("Uncapitalize", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/uppercase.mjs
/** Creates a deferred Uppercase action. */
function UppercaseDeferred(type, options = {}) {
	return Deferred("Uppercase", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/intrinsics/instantiate.mjs
const CapitalizeMapping = (input) => input[0].toUpperCase() + input.slice(1);
const LowercaseMapping = (input) => input.toLowerCase();
const UncapitalizeMapping = (input) => input[0].toLowerCase() + input.slice(1);
const UppercaseMapping = (input) => input.toUpperCase();
function CapitalizeImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(FromType$12(CapitalizeMapping, instantiatedType), {}, options);
}
function CapitalizeInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? CapitalizeImmediate(context, state, type, options) : CapitalizeDeferred(type, options);
}
function LowercaseImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(FromType$12(LowercaseMapping, instantiatedType), {}, options);
}
function LowercaseInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? LowercaseImmediate(context, state, type, options) : LowercaseDeferred(type, options);
}
function UncapitalizeImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(FromType$12(UncapitalizeMapping, instantiatedType), {}, options);
}
function UncapitalizeInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? UncapitalizeImmediate(context, state, type, options) : UncapitalizeDeferred(type, options);
}
function UppercaseImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(FromType$12(UppercaseMapping, instantiatedType), {}, options);
}
function UppercaseInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? UppercaseImmediate(context, state, type, options) : UppercaseDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/conditional.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/conditional/instantiate.mjs
function ConditionalImmediate(context, state, left, right, true_, false_, options) {
	const extendsResult = Extends(context, InstantiateType(context, state, left), InstantiateType(context, state, right));
	return Update$1(IsExtendsUnion(extendsResult) ? Union([InstantiateType(extendsResult.inferred, state, true_), InstantiateType(context, state, false_)]) : IsExtendsTrue(extendsResult) ? InstantiateType(extendsResult.inferred, state, true_) : InstantiateType(context, state, false_), {}, options);
}
function ConditionalInstantiate(context, state, left, right, true_, false_, options) {
	return CanInstantiate(context, [left, right]) ? ConditionalImmediate(context, state, left, right, true_, false_, options) : ConditionalDeferred(left, right, true_, false_, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/constructor-parameters.mjs
/** Creates a deferred ConstructorParameters action. */
function ConstructorParametersDeferred(type, options = {}) {
	return Deferred("ConstructorParameters", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/constructor-parameters/instantiate.mjs
function ConstructorParametersAction(type) {
	return IsConstructor(type) ? InstantiateType({}, { callstack: [] }, Tuple(type.parameters)) : Never();
}
function ConstructorParametersImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(ConstructorParametersAction(instantiatedType), {}, options);
}
function ConstructorParametersInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? ConstructorParametersImmediate(context, state, type, options) : ConstructorParametersDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/exclude.mjs
/** Creates a deferred Exclude action. */
function ExcludeDeferred(left, right, options = {}) {
	return Deferred("Exclude", [left, right], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/exclude/instantiate.mjs
function ExcludeUnion(types, right) {
	return types.reduce((result, head) => {
		return [...result, ...ExcludeType(head, right)];
	}, []);
}
function ExcludeType(left, right) {
	const check = Extends({}, left, right);
	return IsExtendsTrueLike(check) ? [] : [left];
}
function ExcludeAction(left, right) {
	return EvaluateUnion(IsEnum$1(left) ? ExcludeUnion(EnumValuesToVariants(left.enum), right) : IsUnion(left) ? ExcludeUnion(Flatten(left.anyOf), right) : ExcludeType(left, right));
}
function ExcludeImmediate(context, state, left, right, options) {
	const instantiatedLeft = InstantiateType(context, state, left);
	const instantiatedRight = InstantiateType(context, state, right);
	return Update$1(ExcludeAction(instantiatedLeft, instantiatedRight), {}, options);
}
function ExcludeInstantiate(context, state, left, right, options) {
	return CanInstantiate(context, [left, right]) ? ExcludeImmediate(context, state, left, right, options) : ExcludeDeferred(left, right, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/extract.mjs
/** Creates a deferred Extract action. */
function ExtractDeferred(left, right, options = {}) {
	return Deferred("Extract", [left, right], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/extract/instantiate.mjs
function ExtractUnion(types, right) {
	return types.reduce((result, head) => {
		return [...result, ...ExtractType(head, right)];
	}, []);
}
function ExtractType(left, right) {
	const check = Extends({}, left, right);
	return IsExtendsTrueLike(check) ? [left] : [];
}
function ExtractAction(left, right) {
	return EvaluateUnion(IsEnum$1(left) ? ExtractUnion(EnumValuesToVariants(left.enum), right) : IsUnion(left) ? ExtractUnion(Flatten(left.anyOf), right) : ExtractType(left, right));
}
function ExtractImmediate(context, state, left, right, options) {
	const instantiatedLeft = InstantiateType(context, state, left);
	const instantiatedRight = InstantiateType(context, state, right);
	return Update$1(ExtractAction(instantiatedLeft, instantiatedRight), {}, options);
}
function ExtractInstantiate(context, state, left, right, options) {
	return CanInstantiate(context, [left, right]) ? ExtractImmediate(context, state, left, right, options) : ExtractDeferred(left, right, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/helpers/keys.mjs
const integerKeyPattern = /* @__PURE__ */ new RegExp("^(?:0|[1-9][0-9]*)$");
function ConvertToIntegerKey(value) {
	const normal = `${value}`;
	return integerKeyPattern.test(normal) ? parseInt(normal) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexed/from-array.mjs
function NormalizeLiteral(value) {
	return Literal(ConvertToIntegerKey(value));
}
function NormalizeIndexerTypes(types) {
	return types.map((type) => NormalizeIndexer(type));
}
function NormalizeIndexer(type) {
	return IsIntersect(type) ? Intersect(NormalizeIndexerTypes(type.allOf)) : IsUnion(type) ? Union(NormalizeIndexerTypes(type.anyOf)) : IsLiteral(type) ? NormalizeLiteral(type.const) : type;
}
function FromArray$10(type, indexer) {
	const check = Extends({}, NormalizeIndexer(indexer), Number$1());
	return IsExtendsTrueLike(check) ? type : Never();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/from-cyclic.mjs
function FromCyclic$10(defs, ref) {
	return FromType$11(CyclicTarget(defs, ref));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/from-union.mjs
function FromUnion$11(types) {
	return types.reduce((result, left) => {
		return [...result, ...FromType$11(left)];
	}, []);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/from-enum.mjs
function FromEnum$2(values) {
	return FromUnion$11(EnumValuesToVariants(values));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/from-intersect.mjs
function FromIntersect$10(types) {
	return FromType$11(EvaluateIntersect(types));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/from-literal.mjs
function FromLiteral$2(value) {
	return [`${value}`];
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/from-template-literal.mjs
function FromTemplateLiteral$3(pattern) {
	return FromType$11(TemplateLiteralDecode(pattern));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/from-type.mjs
function FromType$11(type) {
	return IsCyclic(type) ? FromCyclic$10(type.$defs, type.$ref) : IsEnum$1(type) ? FromEnum$2(type.enum) : IsIntersect(type) ? FromIntersect$10(type.allOf) : IsLiteral(type) ? FromLiteral$2(type.const) : IsTemplateLiteral(type) ? FromTemplateLiteral$3(type.pattern) : IsUnion(type) ? FromUnion$11(type.anyOf) : [];
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/to-indexable-keys.mjs
/**
* Transforms a type meant as an Indexer into string[] array which is used by Indexable types
* like Index, Pick and Omit to select from property keys. This function should only be used
* for Object key selection, and not for Array / Tuple key selection as Array-Like structures
* require TNumber indexing support.
*/
function ToIndexableKeys(type) {
	return FromType$11(type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexed/from-object.mjs
function SelectProperty(properties, indexer) {
	return indexer in properties ? [properties[indexer]] : [];
}
function SelectProperties(properties, indexer) {
	return indexer.reduce((result, left) => {
		return [...result, ...SelectProperty(properties, left)];
	}, []);
}
function FromObject$13(properties, indexer) {
	return EvaluateUnion(SelectProperties(properties, ToIndexableKeys(indexer)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexed/array-indexer.mjs
function ConvertLiteral(value) {
	return Literal(ConvertToIntegerKey(value));
}
function ArrayIndexerTypes(types) {
	return types.map((type) => FormatArrayIndexer(type));
}
/** Formats embedded integer-like strings on an Indexer to be number values inline with TS indexing | coercion behaviors. */
function FormatArrayIndexer(type) {
	return IsIntersect(type) ? Intersect(ArrayIndexerTypes(type.allOf)) : IsUnion(type) ? Union(ArrayIndexerTypes(type.anyOf)) : IsLiteral(type) ? ConvertLiteral(type.const) : type;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexed/from-tuple.mjs
function IndexElementsWithIndexer(types, indexer) {
	return types.reduceRight((result, right, index) => {
		const check = Extends({}, Literal(index), indexer);
		return IsExtendsTrueLike(check) ? [right, ...result] : result;
	}, []);
}
function FromTupleWithIndexer(types, indexer) {
	return EvaluateUnionFast(IndexElementsWithIndexer(types, FormatArrayIndexer(indexer)));
}
function FromTupleWithoutIndexer(types) {
	return EvaluateUnionFast(types);
}
function FromTuple$9(types, indexer) {
	return IsNumber(indexer) || IsInteger(indexer) ? FromTupleWithoutIndexer(types) : FromTupleWithIndexer(types, indexer);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/indexed.mjs
/** Creates a deferred Index action. */
function IndexDeferred(type, indexer, options = {}) {
	return Deferred("Index", [type, indexer], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/object/from-cyclic.mjs
function FromCyclic$9(defs, ref) {
	return FromType$10(CyclicTarget(defs, ref));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/object/from-intersect.mjs
function CollapseIntersectProperties(left, right) {
	const leftKeys = Keys$1(left).filter((key) => !HasPropertyKey$1(right, key));
	const rightKeys = Keys$1(right).filter((key) => !HasPropertyKey$1(left, key));
	const sharedKeys = Keys$1(left).filter((key) => HasPropertyKey$1(right, key));
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
	const unique = Assign(leftProperties, rightProperties);
	return Assign(unique, sharedProperties);
}
function FromIntersect$9(types) {
	return types.reduce((result, left) => {
		return CollapseIntersectProperties(result, FromType$10(left));
	}, {});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/object/from-object.mjs
function FromObject$12(properties) {
	return properties;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/object/from-tuple.mjs
function FromTuple$8(types) {
	return FromType$10(TupleToObject(Tuple(types)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/object/from-union.mjs
function CollapseUnionProperties(left, right) {
	return Keys$1(left).filter((key) => key in right).reduce((result, key) => {
		return {
			...result,
			[key]: EvaluateUnion([left[key], right[key]])
		};
	}, {});
}
function ReduceVariants(types, result) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? ReduceVariants(right, CollapseUnionProperties(result, FromType$10(left))) : result;
}
function FromUnion$10(types) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? ReduceVariants(right, FromType$10(left)) : Unreachable();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/object/from-type.mjs
function FromType$10(type) {
	return IsCyclic(type) ? FromCyclic$9(type.$defs, type.$ref) : IsIntersect(type) ? FromIntersect$9(type.allOf) : IsUnion(type) ? FromUnion$10(type.anyOf) : IsTuple(type) ? FromTuple$8(type.items) : IsObject(type) ? FromObject$12(type.properties) : {};
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/object/collapse.mjs
/**
* Collapses a type into a TObject schema. This is a lossy fast path used to
* normalize arbitrary TSchema types into a TObject structure. This function is
* primarily used in indexing operations where a normalized object structure
* is required. If the type cannot be collapsed, an empty object schema is returned.
*/
function CollapseToObject(type) {
	return _Object_(FromType$10(type));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexed/instantiate.mjs
function NormalizeType$1(type) {
	return IsCyclic(type) || IsIntersect(type) || IsUnion(type) ? CollapseToObject(type) : type;
}
function IndexAction(type, indexer) {
	const normal = NormalizeType$1(type);
	return IsArray(normal) ? FromArray$10(normal.items, indexer) : IsObject(normal) ? FromObject$13(normal.properties, indexer) : IsTuple(normal) ? FromTuple$9(normal.items, indexer) : Never();
}
function IndexImmediate(context, state, type, indexer, options) {
	const instantiatedType = InstantiateType(context, state, type);
	const instantiatedIndexer = InstantiateType(context, state, indexer);
	return Update$1(IndexAction(instantiatedType, instantiatedIndexer), {}, options);
}
function IndexInstantiate(context, state, type, indexer, options) {
	return CanInstantiate(context, [type, indexer]) ? IndexImmediate(context, state, type, indexer, options) : IndexDeferred(type, indexer, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/instance-type.mjs
/** Creates a deferred InstanceType action. */
function InstanceTypeDeferred(type, options = {}) {
	return Deferred("InstanceType", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/instance-type/instantiate.mjs
function InstanceTypeAction(type) {
	return IsConstructor(type) ? type.instanceType : Never();
}
function InstanceTypeImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(InstanceTypeAction(instantiatedType), {}, options);
}
function InstanceTypeInstantiate(context, state, type, options = {}) {
	return CanInstantiate(context, [type]) ? InstanceTypeImmediate(context, state, type, options) : InstanceTypeDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/interface/instantiate.mjs
function InterfaceImmediate(context, state, heritage, properties, options) {
	const instantiatedHeritage = InstantiateTypes(context, { callstack: [] }, heritage);
	const instantiatedProperties = InstantiateProperties(context, { callstack: [] }, properties);
	const evaluatedInterface = EvaluateIntersect([...instantiatedHeritage, _Object_(instantiatedProperties)]);
	return Update$1(evaluatedInterface, {}, options);
}
function InterfaceInstantiate(context, state, heritage, properties, options) {
	return CanInstantiate(context, heritage) ? InterfaceImmediate(context, state, heritage, properties, options) : InterfaceDeferred(heritage, properties, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/keyof.mjs
/** Creates a deferred KeyOf action. */
function KeyOfDeferred(type, options = {}) {
	return Deferred("KeyOf", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/keyof/from-any.mjs
function FromAny() {
	return Union([
		Number$1(),
		String$1(),
		Symbol$1()
	]);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/keyof/from-array.mjs
function FromArray$9(_type) {
	return Number$1();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/keyof/from-object.mjs
function FromPropertyKeys(keys) {
	return keys.reduce((result, left) => {
		return IsLiteralValue(left) ? [...result, Literal(ConvertToIntegerKey(left))] : Unreachable();
	}, []);
}
function FromObject$11(properties) {
	return EvaluateUnionFast(FromPropertyKeys(Keys$1(properties)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/keyof/from-record.mjs
function FromRecord$6(type) {
	return RecordKey(type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/keyof/from-tuple.mjs
function FromTuple$7(types) {
	return EvaluateUnionFast(types.map((_, index) => Literal(index)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/keyof/instantiate.mjs
function NormalizeType(type) {
	return IsCyclic(type) || IsIntersect(type) || IsUnion(type) ? CollapseToObject(type) : type;
}
function KeyOfAction(type) {
	const normal = NormalizeType(type);
	return IsAny(normal) ? FromAny() : IsArray(normal) ? FromArray$9(normal.items) : IsObject(normal) ? FromObject$11(normal.properties) : IsRecord(normal) ? FromRecord$6(normal) : IsTuple(normal) ? FromTuple$7(normal.items) : Never();
}
function KeyOfImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(KeyOfAction(instantiatedType), {}, options);
}
function KeyOfInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? KeyOfImmediate(context, state, type, options) : KeyOfDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/mapped/mapped-keys.mjs
function FromTemplateLiteral$2(pattern) {
	return FromType$9(TemplateLiteralDecode(pattern));
}
function FromUnion$9(types) {
	return types.reduce((result, left) => {
		return [...result, ...FromType$9(left)];
	}, []);
}
function FromType$9(type) {
	return IsEnum$1(type) ? FromUnion$9(EnumValuesToVariants(type.enum)) : IsLiteralString(type) || IsLiteralNumber(type) ? [type] : IsTemplateLiteral(type) ? FromTemplateLiteral$2(type.pattern) : IsUnion(type) ? FromUnion$9(type.anyOf) : [];
}
function MappedKeys(type) {
	return FromType$9(type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/mapped.mjs
/** Creates a deferred Mapped action. */
function MappedDeferred(identifier, key, as, property, options = {}) {
	return Deferred("Mapped", [
		identifier,
		key,
		as,
		property
	], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/mapped/instantiate.mjs
function InstantiateKeyAs(context, state, identifier, key, as) {
	const instantiatedKeyAs = InstantiateType(Assign(context, { [identifier["name"]]: key }), state, as);
	return IsTemplateLiteral(instantiatedKeyAs) ? TemplateLiteralDecode(instantiatedKeyAs.pattern) : instantiatedKeyAs;
}
function InstantiateProperty(context, state, identifier, key, property) {
	return InstantiateType(Assign(context, { [identifier["name"]]: key }), state, property);
}
function MappedProperty(context, state, identifier, key, as, property) {
	const instantiatedProperty = InstantiateProperty(context, state, identifier, key, property);
	const instantiatedKeyAs = InstantiateKeyAs(context, state, identifier, key, as);
	return IsLiteralString(instantiatedKeyAs) || IsLiteralNumber(instantiatedKeyAs) ? { [instantiatedKeyAs.const]: instantiatedProperty } : {};
}
function MappedProperties(context, state, identifier, keys, as, type) {
	return keys.reduce((result, left) => {
		return {
			...result,
			...MappedProperty(context, state, identifier, left, as, type)
		};
	}, {});
}
function MappedAction(context, state, identifier, key, as, type) {
	return _Object_(MappedProperties(context, state, identifier, MappedKeys(key), as, type));
}
function MappedImmediate(context, state, identifier, key, as, property, options) {
	const instantiatedKey = InstantiateType(context, state, key);
	return Update$1(MappedAction(context, state, identifier, instantiatedKey, as, property), {}, options);
}
function MappedInstantiate(context, state, identifier, key, as, property, options) {
	return CanInstantiate(context, [key]) ? MappedImmediate(context, state, identifier, key, as, property, options) : MappedDeferred(identifier, key, as, property, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/module/instantiate.mjs
function InstantiateCyclics(context, cyclicKeys) {
	return Keys$1(context).filter((key) => cyclicKeys.includes(key)).reduce((result, key) => {
		return {
			...result,
			[key]: InstantiateCyclic(context, key, context[key])
		};
	}, {});
}
function InstantiateNonCyclics(context, cyclicKeys) {
	return Keys$1(context).filter((key) => !cyclicKeys.includes(key)).reduce((result, key) => {
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
	const instantiatedModule = {
		...instantiatedCyclics,
		...instantiatedNonCyclics
	};
	return Update$1(instantiatedModule, {}, options);
}
function ModuleInstantiate(context, _state, properties, options) {
	return InstantiateModule(Assign(context, properties), options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/non-nullable.mjs
/** Creates a deferred NonNullable action. */
function NonNullableDeferred(type, options = {}) {
	return Deferred("NonNullable", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/non-nullable/instantiate.mjs
function NonNullableAction(type) {
	return ExcludeInstantiate({}, { callstack: [] }, type, Union([Null(), Undefined()]), {});
}
function NonNullableImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(NonNullableAction(instantiatedType), {}, options);
}
function NonNullableInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? NonNullableImmediate(context, state, type, options) : NonNullableDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/indexable/to-indexable.mjs
/** Transforms a type into a TProperties used for indexing operations */
function ToIndexable(type) {
	const collapsed = CollapseToObject(type);
	return IsObject(collapsed) ? collapsed.properties : Unreachable();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/omit.mjs
/** Creates a deferred Omit action. */
function OmitDeferred(type, indexer, options = {}) {
	return Deferred("Omit", [type, indexer], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/omit/instantiate.mjs
function FromKeys$1(properties, keys) {
	return Keys$1(properties).reduce((result, key) => {
		return keys.includes(key) ? result : {
			...result,
			[key]: properties[key]
		};
	}, {});
}
function OmitAction(type, indexer) {
	return _Object_(FromKeys$1(ToIndexable(type), ToIndexableKeys(indexer)));
}
function OmitImmediate(context, state, type, indexer, options) {
	const instantiatedType = InstantiateType(context, state, type);
	const instantiatedIndexer = InstantiateType(context, state, indexer);
	return Update$1(OmitAction(instantiatedType, instantiatedIndexer), {}, options);
}
function OmitInstantiate(context, state, type, indexer, options) {
	return CanInstantiate(context, [type, indexer]) ? OmitImmediate(context, state, type, indexer, options) : OmitDeferred(type, indexer, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/options.mjs
/** Creates a deferred Options action. */
function OptionsDeferred(type, options) {
	return Deferred("Options", [type, options], {});
}
/** Applies an Options action to the given type. */
function Options(type, options) {
	return Instantiate({}, OptionsDeferred(type, options));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/options/instantiate.mjs
function OptionsImmediate(context, state, type, options) {
	const instaniatedType = InstantiateType(context, state, type);
	return Update$1(instaniatedType, {}, options);
}
function OptionsInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? OptionsImmediate(context, state, type, options) : OptionsDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/parameters.mjs
/** Creates a deferred Parameters action. */
function ParametersDeferred(type, options = {}) {
	return Deferred("Parameters", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/parameters/instantiate.mjs
function ParametersAction(type) {
	return IsFunction(type) ? InstantiateType({}, { callstack: [] }, Tuple(type.parameters)) : Never();
}
function ParametersImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(ParametersAction(instantiatedType), {}, options);
}
function ParametersInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? ParametersImmediate(context, state, type, options) : ParametersDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/partial.mjs
/** Creates a deferred Partial action. */
function PartialDeferred(type, options = {}) {
	return Deferred("Partial", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/partial/from-cyclic.mjs
function FromCyclic$8(defs, ref) {
	const partial = FromType$8(CyclicTarget(defs, ref));
	return Cyclic(Assign(defs, { [ref]: partial }), ref);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/partial/from-intersect.mjs
function FromIntersect$8(types) {
	return EvaluateIntersect(types.map((type) => FromType$8(type)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/partial/from-union.mjs
function FromUnion$8(types) {
	return Union(types.map((type) => FromType$8(type)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/partial/from-object.mjs
function FromObject$10(properties) {
	return _Object_(Keys$1(properties).reduce((result, left) => {
		return {
			...result,
			[left]: Optional(properties[left])
		};
	}, {}));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/partial/from-type.mjs
function FromType$8(type) {
	return IsCyclic(type) ? FromCyclic$8(type.$defs, type.$ref) : IsIntersect(type) ? FromIntersect$8(type.allOf) : IsUnion(type) ? FromUnion$8(type.anyOf) : IsObject(type) ? FromObject$10(type.properties) : _Object_({});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/partial/instantiate.mjs
function PartialImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(FromType$8(instantiatedType), {}, options);
}
function PartialInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? PartialImmediate(context, state, type, options) : PartialDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/pick.mjs
/** Creates a deferred Pick action. */
function PickDeferred(type, indexer, options = {}) {
	return Deferred("Pick", [type, indexer], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/pick/instantiate.mjs
function FromKeys(properties, keys) {
	return Keys$1(properties).reduce((result, key) => {
		return keys.includes(key) ? Assign(result, { [key]: properties[key] }) : result;
	}, {});
}
function PickAction(type, indexer) {
	return _Object_(FromKeys(ToIndexable(type), ToIndexableKeys(indexer)));
}
function PickImmediate(context, state, type, indexer, options) {
	const instantiatedType = InstantiateType(context, state, type);
	const instantiatedIndexer = InstantiateType(context, state, indexer);
	return Update$1(PickAction(instantiatedType, instantiatedIndexer), {}, options);
}
function PickInstantiate(context, state, type, indexer, options) {
	return CanInstantiate(context, [type, indexer]) ? PickImmediate(context, state, type, indexer, options) : PickDeferred(type, indexer, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/readonly-type.mjs
/** Creates a deferred ReadonlyType action. */
function ReadonlyTypeDeferred(type, options = {}) {
	return Deferred("ReadonlyType", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/readonly-type/from-array.mjs
function FromArray$8(type) {
	return Immutable(Array$1(type));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/readonly-type/from-cyclic.mjs
function FromCyclic$7(defs, ref) {
	const partial = FromType$7(CyclicTarget(defs, ref));
	return Cyclic(Assign(defs, { [ref]: partial }), ref);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/readonly-type/from-intersect.mjs
function FromIntersect$7(types) {
	return EvaluateIntersect(types.map((type) => FromType$7(type)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/readonly-type/from-object.mjs
function FromObject$9(properties) {
	return _Object_(Keys$1(properties).reduce((result, left) => {
		return {
			...result,
			[left]: Readonly(properties[left])
		};
	}, {}));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/readonly-type/from-tuple.mjs
function FromTuple$6(types) {
	return Immutable(Tuple(types));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/readonly-type/from-union.mjs
function FromUnion$7(types) {
	return Union(types.map((type) => FromType$7(type)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/readonly-type/from-type.mjs
function FromType$7(type) {
	return IsArray(type) ? FromArray$8(type.items) : IsCyclic(type) ? FromCyclic$7(type.$defs, type.$ref) : IsIntersect(type) ? FromIntersect$7(type.allOf) : IsObject(type) ? FromObject$9(type.properties) : IsTuple(type) ? FromTuple$6(type.items) : IsUnion(type) ? FromUnion$7(type.anyOf) : type;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/readonly-type/instantiate.mjs
function ReadonlyTypeImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(FromType$7(instantiatedType), {}, options);
}
function ReadonlyTypeInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? ReadonlyTypeImmediate(context, state, type, options) : ReadonlyTypeDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-any.mjs
function FromAnyKey(value) {
	return CreateRecord(StringKey, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-boolean.mjs
function FromBooleanKey(value) {
	return _Object_({
		true: value,
		false: value
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-enum.mjs
function FromEnumKey(values, value) {
	return FromKey(EnumValuesToUnion(values), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-integer.mjs
function FromIntegerKey(key, value) {
	return CreateRecord(IntegerKey, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-intersect.mjs
function FromIntersectKey(types, value) {
	return FromKey(EvaluateIntersect(types), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-literal.mjs
function FromLiteralKey(key, value) {
	return IsString$3(key) || IsNumber$3(key) ? _Object_({ [key]: value }) : IsEqual$1(key, false) ? _Object_({ false: value }) : IsEqual$1(key, true) ? _Object_({ true: value }) : _Object_({});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-number.mjs
function FromNumberKey(key, value) {
	return CreateRecord(NumberKey, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-string.mjs
function FromStringKey(key, value) {
	return HasPropertyKey$1(key, "pattern") && (IsString$3(key.pattern) || key.pattern instanceof RegExp) ? CreateRecord(key.pattern.toString(), value) : CreateRecord(StringKey, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-template-literal.mjs
function FromTemplateKey(pattern, value) {
	return IsTemplateLiteralFinite(ParsePatternIntoTypes(pattern)) ? FromKey(TemplateLiteralDecode(pattern), value) : CreateRecord(pattern, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key-union.mjs
function StringOrNumberCheck(types) {
	return types.some((type) => IsString(type) || IsNumber(type) || IsInteger(type));
}
function TryBuildRecord(types, value) {
	return IsEqual$1(StringOrNumberCheck(types), true) ? CreateRecord(StringKey, value) : void 0;
}
function CreateProperties(types, value) {
	return types.reduce((result, left) => {
		return IsLiteral(left) && (IsString$3(left.const) || IsNumber$3(left.const)) ? {
			...result,
			[left.const]: value
		} : result;
	}, {});
}
function CreateObject(types, value) {
	return _Object_(CreateProperties(types, value));
}
function FromUnionKey(types, value) {
	const flattened = Flatten(types);
	const record = TryBuildRecord(flattened, value);
	return IsSchema$1(record) ? record : CreateObject(flattened, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/from-key.mjs
function FromKey(key, value) {
	return IsAny(key) ? FromAnyKey(value) : IsBoolean(key) ? FromBooleanKey(value) : IsEnum$1(key) ? FromEnumKey(key.enum, value) : IsInteger(key) ? FromIntegerKey(key, value) : IsIntersect(key) ? FromIntersectKey(key.allOf, value) : IsLiteral(key) ? FromLiteralKey(key.const, value) : IsNumber(key) ? FromNumberKey(key, value) : IsUnion(key) ? FromUnionKey(key.anyOf, value) : IsString(key) ? FromStringKey(key, value) : IsTemplateLiteral(key) ? FromTemplateKey(key.pattern, value) : _Object_({});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/record/instantiate.mjs
function RecordImmediate(context, state, key, value, options) {
	const instanstiatedKey = InstantiateType(context, state, key);
	const instantiatedValue = InstantiateType(context, state, value);
	return Update$1(FromKey(instanstiatedKey, instantiatedValue), {}, options);
}
function RecordInstantiate(context, state, key, value, options) {
	return CanInstantiate(context, [key]) ? RecordImmediate(context, state, key, value, options) : RecordDeferred(key, value, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/ref/instantiate.mjs
function RefInstantiate(context, state, type, ref) {
	return ref in context ? CyclicCheck([ref], context, context[ref]) ? type : InstantiateType(context, state, context[ref]) : type;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/required/from-cyclic.mjs
function FromCyclic$6(defs, ref) {
	const partial = FromType$6(CyclicTarget(defs, ref));
	return Cyclic(Assign(defs, { [ref]: partial }), ref);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/required/from-intersect.mjs
function FromIntersect$6(types) {
	return EvaluateIntersect(types.map((type) => FromType$6(type)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/required/from-union.mjs
function FromUnion$6(types) {
	return Union(types.map((type) => FromType$6(type)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/required/from-object.mjs
function FromObject$8(properties) {
	return _Object_(Keys$1(properties).reduce((result, left) => {
		return {
			...result,
			[left]: OptionalRemove(properties[left])
		};
	}, {}));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/required/from-type.mjs
function FromType$6(type) {
	return IsCyclic(type) ? FromCyclic$6(type.$defs, type.$ref) : IsIntersect(type) ? FromIntersect$6(type.allOf) : IsUnion(type) ? FromUnion$6(type.anyOf) : IsObject(type) ? FromObject$8(type.properties) : _Object_({});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/required.mjs
/** Creates a deferred Required action. */
function RequiredDeferred(type, options = {}) {
	return Deferred("Required", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/required/instantiate.mjs
function RequiredImmediate(context, state, type, options) {
	const instaniatedType = InstantiateType(context, state, type);
	return Update$1(FromType$6(instaniatedType), {}, options);
}
function RequiredInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? RequiredImmediate(context, state, type, options) : RequiredDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/return-type.mjs
/** Creates a deferred ReturnType action. */
function ReturnTypeDeferred(type, options = {}) {
	return Deferred("ReturnType", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/return-type/instantiate.mjs
function ReturnTypeAction(type) {
	return IsFunction(type) ? type.returnType : Never();
}
function ReturnTypeImmediate(context, state, type, options) {
	const instantiatedType = InstantiateType(context, state, type);
	return Update$1(ReturnTypeAction(instantiatedType), {}, options);
}
function ReturnTypeInstantiate(context, state, type, options) {
	return CanInstantiate(context, [type]) ? ReturnTypeImmediate(context, state, type, options) : ReturnTypeDeferred(type, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/template-literal/encode.mjs
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
	return EncodeType(Union([Literal("false"), Literal("true")]), right, pattern);
}
function EncodeString(right, pattern) {
	return EncodeTypes(right, `${pattern}${StringPattern}`);
}
function EncodeTemplateLiteral(templatePattern, right, pattern) {
	return EncodeTypes(right, `${pattern}${UnwrapTemplateLiteralPattern(templatePattern)}`);
}
function EncodeEnum(types, right, pattern, result = []) {
	return EncodeUnion(EnumValuesToVariants(types), right, pattern);
}
function EncodeUnion(types, right, pattern, result = []) {
	const [head, ...tail] = types;
	return IsSchema$1(head) ? EncodeUnion(tail, right, pattern, [...result, EncodeType(head, [], "")]) : EncodeTypes(right, `${pattern}(${JoinString(result)})`);
}
function EncodeType(type, right, pattern) {
	return IsEnum$1(type) ? EncodeEnum(type.enum, right, pattern) : IsInteger(type) ? EncodeInteger(right, pattern) : IsLiteral(type) ? EncodeLiteral(type.const, right, pattern) : IsBigInt(type) ? EncodeBigInt(right, pattern) : IsBoolean(type) ? EncodeBoolean(right, pattern) : IsNumber(type) ? EncodeNumber(right, pattern) : IsString(type) ? EncodeString(right, pattern) : IsTemplateLiteral(type) ? EncodeTemplateLiteral(type.pattern, right, pattern) : IsUnion(type) ? EncodeUnion(type.anyOf, right, pattern) : NeverPattern;
}
function EncodeTypes(types, pattern) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? EncodeType(left, right, pattern) : pattern;
}
function EncodePattern(types) {
	return `^${EncodeTypes(types, "")}$`;
}
/** Encodes a TemplateLiteral type sequence into a TemplateLiteral */
function TemplateLiteralEncode(types) {
	return TemplateLiteralCreate(EncodePattern(types));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/template-literal/instantiate.mjs
function TemplateLiteralImmediate(context, state, types, options) {
	const instaniatedTypes = InstantiateTypes(context, state, types);
	return Update$1(TemplateLiteralEncode(instaniatedTypes), {}, options);
}
function TemplateLiteralInstantiate(context, state, types, options) {
	return CanInstantiate(context, types) ? TemplateLiteralImmediate(context, state, types, options) : TemplateLiteralDeferred(types, options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/rest/spread.mjs
function SpreadElement(type) {
	return IsRest(type) ? IsTuple(type.items) ? RestSpread(type.items.items) : IsInfer(type.items) ? [type] : IsRef$1(type.items) ? [type] : [Never()] : [type];
}
function RestSpread(types) {
	return types.reduce((result, left) => {
		return [...result, ...SpreadElement(left)];
	}, []);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/engine/instantiate.mjs
function CanInstantiateRef(context, ref) {
	return ref in context;
}
function CanInstantiateType(context, type) {
	return IsIntersect(type) ? CanInstantiate(context, type.allOf) : IsUnion(type) ? CanInstantiate(context, type.anyOf) : IsRef$1(type) ? CanInstantiateRef(context, type.$ref) : true;
}
function CanInstantiate(context, types) {
	const [left, ...right] = types;
	return IsSchema$1(left) ? CanInstantiateType(context, left) ? CanInstantiate(context, right) : false : true;
}
function ModifierActions(type, readonly, optional) {
	return IsReadonlyRemoveAction(type) ? ModifierActions(type.type, "remove", optional) : IsOptionalRemoveAction(type) ? ModifierActions(type.type, readonly, "remove") : IsReadonlyAddAction(type) ? ModifierActions(type.type, "add", optional) : IsOptionalAddAction(type) ? ModifierActions(type.type, readonly, "add") : [
		type,
		readonly,
		optional
	];
}
function ApplyReadonly(action, type) {
	return IsEqual$1(action, "remove") ? ReadonlyRemove(type) : IsEqual$1(action, "add") ? ReadonlyAdd(type) : type;
}
function ApplyOptional(action, type) {
	return IsEqual$1(action, "remove") ? OptionalRemove(type) : IsEqual$1(action, "add") ? OptionalAdd(type) : type;
}
function InstantiateProperties(context, state, properties) {
	return Keys$1(properties).reduce((result, key) => {
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
	return IsEqual$1(action, "Awaited") ? AwaitedInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Capitalize") ? CapitalizeInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Conditional") ? ConditionalInstantiate(context, state, parameters[0], parameters[1], parameters[2], parameters[3], options) : IsEqual$1(action, "ConstructorParameters") ? ConstructorParametersInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Evaluate") ? EvaluateInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Exclude") ? ExcludeInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual$1(action, "Extract") ? ExtractInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual$1(action, "Index") ? IndexInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual$1(action, "InstanceType") ? InstanceTypeInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Interface") ? InterfaceInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual$1(action, "KeyOf") ? KeyOfInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Lowercase") ? LowercaseInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Mapped") ? MappedInstantiate(context, state, parameters[0], parameters[1], parameters[2], parameters[3], options) : IsEqual$1(action, "Module") ? ModuleInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "NonNullable") ? NonNullableInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Pick") ? PickInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual$1(action, "Options") ? OptionsInstantiate(context, state, parameters[0], parameters[1]) : IsEqual$1(action, "Parameters") ? ParametersInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Partial") ? PartialInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Omit") ? OmitInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual$1(action, "ReadonlyType") ? ReadonlyTypeInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Record") ? RecordInstantiate(context, state, parameters[0], parameters[1], options) : IsEqual$1(action, "Required") ? RequiredInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "ReturnType") ? ReturnTypeInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "TemplateLiteral") ? TemplateLiteralInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Uncapitalize") ? UncapitalizeInstantiate(context, state, parameters[0], options) : IsEqual$1(action, "Uppercase") ? UppercaseInstantiate(context, state, parameters[0], options) : Deferred(action, parameters, options);
}
function InstantiateType(context, state, input) {
	const immutable = IsImmutable(input);
	const modifiers = ModifierActions(input, IsReadonly(input) ? "add" : "none", IsOptional(input) ? "add" : "none");
	const type = IsBase(modifiers[0]) ? modifiers[0].Clone() : modifiers[0];
	const instantiated = IsRef$1(type) ? RefInstantiate(context, state, type, type.$ref) : IsArray(type) ? Array$1(InstantiateType(context, state, type.items), ArrayOptions(type)) : IsAsyncIterator(type) ? AsyncIterator(InstantiateType(context, state, type.iteratorItems), AsyncIteratorOptions(type)) : IsCall(type) ? CallInstantiate(context, state, type.target, type.arguments) : IsConstructor(type) ? Constructor(InstantiateTypes(context, state, type.parameters), InstantiateType(context, state, type.instanceType), ConstructorOptions(type)) : IsDeferred(type) ? InstantiateDeferred(context, state, type.action, type.parameters, type.options) : IsFunction(type) ? _Function_(InstantiateTypes(context, state, type.parameters), InstantiateType(context, state, type.returnType), FunctionOptions(type)) : IsIntersect(type) ? Intersect(InstantiateTypes(context, state, type.allOf), IntersectOptions(type)) : IsIterator(type) ? Iterator(InstantiateType(context, state, type.iteratorItems), IteratorOptions(type)) : IsObject(type) ? _Object_(InstantiateProperties(context, state, type.properties), ObjectOptions(type)) : IsPromise(type) ? Promise$1(InstantiateType(context, state, type.item), PromiseOptions(type)) : IsRecord(type) ? RecordFromPattern(RecordPattern(type), InstantiateType(context, state, RecordValue(type))) : IsRest(type) ? Rest(InstantiateType(context, state, type.items)) : IsTuple(type) ? Tuple(InstantiateElements(context, state, type.items), TupleOptions(type)) : IsUnion(type) ? Union(InstantiateTypes(context, state, type.anyOf), UnionOptions(type)) : type;
	const withImmutable = immutable ? Immutable(instantiated) : instantiated;
	return ApplyReadonly(modifiers[1], ApplyOptional(modifiers[2], withImmutable));
}
/** Instantiates computed schematics using the given context and type. */
function Instantiate(context, type) {
	return InstantiateType(context, { callstack: [] }, type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/awaited.mjs
/** Creates a deferred Awaited action. */
function AwaitedDeferred(type, options = {}) {
	return Deferred("Awaited", [type], options);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/type/action/evaluate.mjs
/** Creates a deferred Evaluate action. */
function EvaluateDeferred(type, options = {}) {
	return Deferred("Evaluate", [type], options);
}
/** Applies an Evaluate action to a type. */
function Evaluate(type, options = {}) {
	return Instantiate({}, EvaluateDeferred(type, options));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/_guard.mjs
function IsGuardInterface(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "check") && HasPropertyKey$1(value, "errors") && IsFunction$2(value.check) && IsFunction$2(value.errors);
}
function IsGuard(value) {
	return HasPropertyKey$1(value, "~guard") && IsGuardInterface(value["~guard"]);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/_refine.mjs
/**
* Returns true if the schema contains an '~refine` keyword
* @specification None
*/
function IsRefine(value) {
	return HasPropertyKey$1(value, "~refine") && IsArray$2(value["~refine"]) && Every$1(value["~refine"], 0, (value) => IsObject$2(value) && HasPropertyKey$1(value, "refine") && HasPropertyKey$1(value, "message") && IsFunction$2(value.refine) && IsString$3(value.message));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/schema.mjs
/** Returns true if this value is object like */
function IsSchemaObject(value) {
	return IsObject$2(value) && !IsArray$2(value);
}
/** Returns true if this value is a boolean */
function IsBooleanSchema(value) {
	return IsBoolean$3(value);
}
/** Returns true if this value is schema like */
function IsSchema(value) {
	return IsSchemaObject(value) || IsBooleanSchema(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/additionalItems.mjs
/**
* Returns true if the schema contains a valid additionalItems property
* @specification Json Schema 7
*/
function IsAdditionalItems(schema) {
	return HasPropertyKey$1(schema, "additionalItems") && IsSchema(schema.additionalItems);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/additionalProperties.mjs
/**
* Returns true if the schema contains a valid additionalProperties property
* @specification Json Schema 7
*/
function IsAdditionalProperties(schema) {
	return HasPropertyKey$1(schema, "additionalProperties") && IsSchema(schema.additionalProperties);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/allOf.mjs
/**
* Returns true if the schema contains a valid allOf property
* @specification Json Schema 7
*/
function IsAllOf(schema) {
	return HasPropertyKey$1(schema, "allOf") && IsArray$2(schema.allOf) && schema.allOf.every((value) => IsSchema(value));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/anchor.mjs
/**
* Returns true if the schema contains a valid $anchor property
*/
function IsAnchor(schema) {
	return HasPropertyKey$1(schema, "$anchor") && IsString$3(schema.$anchor);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/anyOf.mjs
/**
* Returns true if the schema contains a valid anyOf property
* @specification Json Schema 7
*/
function IsAnyOf(schema) {
	return HasPropertyKey$1(schema, "anyOf") && IsArray$2(schema.anyOf) && schema.anyOf.every((value) => IsSchema(value));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/const.mjs
/**
* Returns true if the schema contains a valid const property
* @specification Json Schema 7
*/
function IsConst(value) {
	return HasPropertyKey$1(value, "const");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/contains.mjs
/**
* Returns true if the schema contains a valid contains property
* @specification Json Schema 7
*/
function IsContains(schema) {
	return HasPropertyKey$1(schema, "contains") && IsSchema(schema.contains);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/default.mjs
/**
* Returns true if the schema contains a valid contentMediaType property
* @specification Json Schema 7
*/
function IsDefault(schema) {
	return HasPropertyKey$1(schema, "default");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/dependencies.mjs
/**
* Returns true if the schema contains a valid dependencies property
* @specification Json Schema 7
*/
function IsDependencies(schema) {
	return HasPropertyKey$1(schema, "dependencies") && IsObject$2(schema.dependencies) && Object.values(schema.dependencies).every((value) => IsSchema(value) || IsArray$2(value) && value.every((value) => IsString$3(value)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/dependentRequired.mjs
/**
* Returns true if the schema contains a valid dependentRequired property
* @specification Json Schema 2019-09
*/
function IsDependentRequired(schema) {
	return HasPropertyKey$1(schema, "dependentRequired") && IsObject$2(schema.dependentRequired) && Object.values(schema.dependentRequired).every((value) => IsArray$2(value) && value.every((value) => IsString$3(value)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/dependentSchemas.mjs
/**
* Returns true if the schema contains a valid dependentRequired property
* @specification Json Schema 2019-09
*/
function IsDependentSchemas(schema) {
	return HasPropertyKey$1(schema, "dependentSchemas") && IsObject$2(schema.dependentSchemas) && Object.values(schema.dependentSchemas).every((value) => IsSchema(value));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/dynamicAnchor.mjs
/**
* Returns true if the schema contains a valid $dynamicAnchor property
*/
function IsDynamicAnchor(schema) {
	return HasPropertyKey$1(schema, "$dynamicAnchor") && IsString$3(schema.$dynamicAnchor);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/else.mjs
/**
* Returns true if the schema contains a valid else property
* @specification Json Schema 7
*/
function IsElse(schema) {
	return HasPropertyKey$1(schema, "else") && IsSchema(schema.else);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/enum.mjs
/**
* Returns true if the schema contains a valid enum property
* @specification Json Schema 7
*/
function IsEnum(schema) {
	return HasPropertyKey$1(schema, "enum") && IsArray$2(schema.enum);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/exclusiveMaximum.mjs
/**
* Returns true if the schema contains a valid exclusiveMaximum property
* @specification Json Schema 7
*/
function IsExclusiveMaximum(schema) {
	return HasPropertyKey$1(schema, "exclusiveMaximum") && (IsNumber$3(schema.exclusiveMaximum) || IsBigInt$2(schema.exclusiveMaximum));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/exclusiveMinimum.mjs
/**
* Returns true if the schema contains a valid exclusiveMinimum property
* @specification Json Schema 7
*/
function IsExclusiveMinimum(schema) {
	return HasPropertyKey$1(schema, "exclusiveMinimum") && (IsNumber$3(schema.exclusiveMinimum) || IsBigInt$2(schema.exclusiveMinimum));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/format.mjs
/**
* Returns true if the schema contains a valid format property
* @specification Json Schema 7
*/
function IsFormat(schema) {
	return HasPropertyKey$1(schema, "format") && IsString$3(schema.format);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/id.mjs
/**
* Returns true if the schema contains a valid $id property
* @specification Json Schema 7
*/
function IsId(schema) {
	return HasPropertyKey$1(schema, "$id") && IsString$3(schema.$id);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/if.mjs
/**
* Returns true if the schema contains a valid $id property
* @specification Json Schema 7
*/
function IsIf(schema) {
	return HasPropertyKey$1(schema, "if") && IsSchema(schema.if);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/items.mjs
/**
* Returns true if the schema contains a valid items property
* @specification Json Schema 7
*/
function IsItems(schema) {
	return HasPropertyKey$1(schema, "items") && (IsSchema(schema.items) || IsArray$2(schema.items) && schema.items.every((value) => {
		return IsSchema(value);
	}));
}
/** Returns true if this schema is a sized items variant */
function IsItemsSized(schema) {
	return IsItems(schema) && IsArray$2(schema.items);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/maximum.mjs
/**
* Returns true if the schema contains a valid maximum property
* @specification Json Schema 7
*/
function IsMaximum(schema) {
	return HasPropertyKey$1(schema, "maximum") && (IsNumber$3(schema.maximum) || IsBigInt$2(schema.maximum));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/maxContains.mjs
/**
* Returns true if the schema contains a valid maxContains property
* @specification Json Schema 2019-09
*/
function IsMaxContains(schema) {
	return HasPropertyKey$1(schema, "maxContains") && IsNumber$3(schema.maxContains);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/maxItems.mjs
/**
* Returns true if the schema contains a valid maxItems property
* @specification Json Schema 7
*/
function IsMaxItems(schema) {
	return HasPropertyKey$1(schema, "maxItems") && IsNumber$3(schema.maxItems);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/maxLength.mjs
/**
* Returns true if the schema contains a valid maxLength property
* @specification Json Schema 7
*/
function IsMaxLength(schema) {
	return HasPropertyKey$1(schema, "maxLength") && IsNumber$3(schema.maxLength);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/maxProperties.mjs
/**
* Returns true if the schema contains a valid maxProperties property
* @specification Json Schema 7
*/
function IsMaxProperties(schema) {
	return HasPropertyKey$1(schema, "maxProperties") && IsNumber$3(schema.maxProperties);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/minimum.mjs
/**
* Returns true if the schema contains a valid minimum property
* @specification Json Schema 7
*/
function IsMinimum(schema) {
	return HasPropertyKey$1(schema, "minimum") && (IsNumber$3(schema.minimum) || IsBigInt$2(schema.minimum));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/minContains.mjs
/**
* Returns true if the schema contains a valid maxContains property
* @specification Json Schema 2019-09
*/
function IsMinContains(schema) {
	return HasPropertyKey$1(schema, "minContains") && IsNumber$3(schema.minContains);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/minItems.mjs
/**
* Returns true if the schema contains a valid minItems property
* @specification Json Schema 7
*/
function IsMinItems(schema) {
	return HasPropertyKey$1(schema, "minItems") && IsNumber$3(schema.minItems);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/minLength.mjs
/**
* Returns true if the schema contains a valid minLength property
* @specification Json Schema 7
*/
function IsMinLength(schema) {
	return HasPropertyKey$1(schema, "minLength") && IsNumber$3(schema.minLength);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/minProperties.mjs
/**
* Returns true if the schema contains a valid minProperties property
* @specification Json Schema 7
*/
function IsMinProperties(schema) {
	return HasPropertyKey$1(schema, "minProperties") && IsNumber$3(schema.minProperties);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/multipleOf.mjs
/**
* Returns true if the schema contains a valid multipleOf property
* @specification Json Schema 7
*/
function IsMultipleOf(schema) {
	return HasPropertyKey$1(schema, "multipleOf") && (IsNumber$3(schema.multipleOf) || IsBigInt$2(schema.multipleOf));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/not.mjs
/**
* Returns true if the schema contains a valid not property
* @specification Json Schema 7
*/
function IsNot(schema) {
	return HasPropertyKey$1(schema, "not") && IsSchema(schema.not);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/oneOf.mjs
/**
* Returns true if the schema contains a valid oneOf property
* @specification Json Schema 7
*/
function IsOneOf(schema) {
	return HasPropertyKey$1(schema, "oneOf") && IsArray$2(schema.oneOf) && schema.oneOf.every((value) => IsSchema(value));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/pattern.mjs
/**
* Returns true if the schema contains a valid pattern property
* @specification Json Schema 7
*/
function IsPattern(schema) {
	return HasPropertyKey$1(schema, "pattern") && (IsString$3(schema.pattern) || schema.pattern instanceof RegExp);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/patternProperties.mjs
/**
* Returns true if the schema contains a valid patternProperties property
* @specification Json Schema 7
*/
function IsPatternProperties(schema) {
	return HasPropertyKey$1(schema, "patternProperties") && IsObject$2(schema.patternProperties) && Object.values(schema.patternProperties).every((value) => IsSchema(value));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/prefixItems.mjs
/**
* Returns true if the schema contains a valid prefixItems property
*/
function IsPrefixItems(schema) {
	return HasPropertyKey$1(schema, "prefixItems") && IsArray$2(schema.prefixItems) && schema.prefixItems.every((schema) => IsSchema(schema));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/properties.mjs
/**
* Returns true if the schema contains a valid properties property
* @specification Json Schema 7
*/
function IsProperties(schema) {
	return HasPropertyKey$1(schema, "properties") && IsObject$2(schema.properties) && Object.values(schema.properties).every((value) => IsSchema(value));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/propertyNames.mjs
/**
* Returns true if the schema contains a valid propertyNames property
* @specification Json Schema 7
*/
function IsPropertyNames(schema) {
	return HasPropertyKey$1(schema, "propertyNames") && (IsObject$2(schema.propertyNames) || IsSchema(schema.propertyNames));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/recursiveAnchor.mjs
/**
* Returns true if the schema contains a valid $recursiveAnchor property
*/
function IsRecursiveAnchor(schema) {
	return HasPropertyKey$1(schema, "$recursiveAnchor") && IsBoolean$3(schema.$recursiveAnchor);
}
/**
* Returns true if the schema contains a valid $recursiveAnchor property that is true
*/
function IsRecursiveAnchorTrue(schema) {
	return IsRecursiveAnchor(schema) && IsEqual$1(schema.$recursiveAnchor, true);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/recursiveRef.mjs
/**
* Returns true if the schema contains a valid $recursiveRef property
*/
function IsRecursiveRef(schema) {
	return HasPropertyKey$1(schema, "$recursiveRef") && IsString$3(schema.$recursiveRef);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/ref.mjs
/**
* Returns true if the schema contains a valid $ref property
* @specification Json Schema 7
*/
function IsRef(schema) {
	return HasPropertyKey$1(schema, "$ref") && IsString$3(schema.$ref);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/required.mjs
/**
* Returns true if the schema contains a valid required property
* @specification Json Schema 7
*/
function IsRequired(schema) {
	return HasPropertyKey$1(schema, "required") && IsArray$2(schema.required) && schema.required.every((value) => IsString$3(value));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/then.mjs
/**
* Returns true if the schema contains a valid then property
* @specification Json Schema 7
*/
function IsThen(schema) {
	return HasPropertyKey$1(schema, "then") && IsSchema(schema.then);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/type.mjs
/**
* Returns true if the schema contains a valid type property
* @specification Json Schema 7
*/
function IsType(schema) {
	return HasPropertyKey$1(schema, "type") && (IsString$3(schema.type) || IsArray$2(schema.type) && schema.type.every((value) => IsString$3(value)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/uniqueItems.mjs
/**
* Returns true if the schema contains a valid uniqueItems property
* @specification Json Schema 7
*/
function IsUniqueItems(schema) {
	return HasPropertyKey$1(schema, "uniqueItems") && IsBoolean$3(schema.uniqueItems);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/unevaluatedItems.mjs
/**
* Returns true if the schema contains a valid unevaluatedItems property
* @specification Json Schema 2019-09
*/
function IsUnevaluatedItems(schema) {
	return HasPropertyKey$1(schema, "unevaluatedItems") && IsSchema(schema.unevaluatedItems);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/types/unevaluatedProperties.mjs
/**
* Returns true if the schema contains a valid unevaluatedProperties property
* @specification Json Schema 2019-09
*/
function IsUnevaluatedProperties(schema) {
	return HasPropertyKey$1(schema, "unevaluatedProperties") && IsSchema(schema.unevaluatedProperties);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_context.mjs
function HasUnevaluatedFromObject(value) {
	return IsUnevaluatedItems(value) || IsUnevaluatedProperties(value) || Keys$1(value).some((key) => HasUnevaluatedFromUnknown(value[key]));
}
function HasUnevaluatedFromArray(value) {
	return value.some((value) => HasUnevaluatedFromUnknown(value));
}
function HasUnevaluatedFromUnknown(value) {
	return IsArray$2(value) ? HasUnevaluatedFromArray(value) : IsObject$2(value) ? HasUnevaluatedFromObject(value) : false;
}
function HasUnevaluated(context, schema) {
	return HasUnevaluatedFromUnknown(schema) || Keys$1(context).some((key) => HasUnevaluatedFromUnknown(context[key]));
}
var BuildContext = class {
	constructor(hasUnevaluated) {
		this.hasUnevaluated = hasUnevaluated;
	}
	UseUnevaluated() {
		return this.hasUnevaluated;
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
		this.indices = /* @__PURE__ */ new Set();
		this.keys = /* @__PURE__ */ new Set();
	}
	AddIndex(index) {
		this.indices.add(index);
		return true;
	}
	AddKey(key) {
		this.keys.add(key);
		return true;
	}
	GetIndices() {
		return this.indices;
	}
	GetKeys() {
		return this.keys;
	}
	Merge(results) {
		for (const context of results) {
			context.indices.forEach((value) => this.indices.add(value));
			context.keys.forEach((value) => this.keys.add(value));
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_externals.mjs
const identifier = "external_";
let resetCount = 0;
const state = {
	identifier: `${identifier}${resetCount}`,
	variables: []
};
function ResetExternal() {
	state.identifier = `${identifier}${resetCount}`;
	state.variables = [];
	resetCount += 1;
}
function CreateVariable(value) {
	const call = `${state.identifier}[${state.variables.length}]`;
	state.variables.push(value);
	return call;
}
function GetExternal() {
	return state;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_guard.mjs
function BuildGuard(stack, context, schema, value) {
	return Call(Member(Member(CreateVariable(schema), "~guard"), "check"), [value]);
}
function CheckGuard(stack, context, schema, value) {
	return schema["~guard"].check(value);
}
function ErrorGuard(stack, context, schemaPath, instancePath, schema, value) {
	return schema["~guard"].check(value) || context.AddError({
		keyword: "~guard",
		schemaPath,
		instancePath,
		params: { errors: schema["~guard"].errors(value) }
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_refine.mjs
function BuildRefine(stack, context, schema, value) {
	const refinements = CreateVariable(schema["~refine"].map((refinement) => refinement));
	return Every(refinements, Constant(0), ["refinement", "_"], Call(Member("refinement", "refine"), [value]));
}
function CheckRefine(stack, context, schema, value) {
	return Every$1(schema["~refine"], 0, (refinement, _) => refinement.refine(value));
}
function ErrorRefine(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(schema["~refine"], 0, (refinement, index) => {
		return refinement.refine(value) || context.AddError({
			keyword: "~refine",
			schemaPath,
			instancePath,
			params: {
				index,
				message: refinement.message
			}
		});
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_unique.mjs
let index = 0;
/** Returns a Unique Variable Name */
function Unique() {
	return `var_${index++}`;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/additionalItems.mjs
function IsValid$4(schema) {
	return IsItems(schema) && IsArray$2(schema.items);
}
function BuildAdditionalItems(stack, context, schema, value) {
	if (!IsValid$4(schema)) return Constant(true);
	const [item, index] = [Unique(), Unique()];
	const isSchema = BuildSchema(stack, context, schema.additionalItems, item);
	const isLength = IsLessThan(index, Constant(schema.items.length));
	const addIndex = context.AddIndex(index);
	const guarded = context.UseUnevaluated() ? Or(isLength, And(isSchema, addIndex)) : Or(isLength, isSchema);
	return Call(Member(value, "every"), [ArrowFunction([item, index], guarded)]);
}
function CheckAdditionalItems(stack, context, schema, value) {
	if (!IsValid$4(schema)) return true;
	return value.every((item, index) => {
		return IsLessThan$1(index, schema.items.length) || CheckSchema(stack, context, schema.additionalItems, item) && context.AddIndex(index);
	});
}
function ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value) {
	if (!IsValid$4(schema)) return true;
	return value.every((item, index) => {
		const nextSchemaPath = `${schemaPath}/additionalItems`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessThan$1(index, schema.items.length) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema.additionalItems, item) && context.AddIndex(index);
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/additionalProperties.mjs
function GetPropertyKeyAsPattern(key) {
	return `^${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`;
}
function GetPropertiesPattern(schema) {
	const patterns = [];
	if (IsPatternProperties(schema)) patterns.push(...Keys$1(schema.patternProperties));
	if (IsProperties(schema)) patterns.push(...Keys$1(schema.properties).map(GetPropertyKeyAsPattern));
	return IsEqual$1(patterns.length, 0) ? "(?!)" : `(${patterns.join("|")})`;
}
function CanAdditionalPropertiesFast(context, schema, value) {
	return IsRequired(schema) && IsProperties(schema) && !IsPatternProperties(schema) && IsEqual$1(schema.additionalProperties, false) && IsEqual$1(Keys$1(schema.properties).length, schema.required.length);
}
function BuildAdditionalPropertiesFast(context, schema, value) {
	return IsEqual(Member(Call(Member("Object", "getOwnPropertyNames"), [value]), "length"), Constant(schema.required.length));
}
function BuildAdditionalPropertiesStandard(stack, context, schema, value) {
	const [key, _index] = [Unique(), Unique()];
	const regexp = CreateVariable(new RegExp(GetPropertiesPattern(schema)));
	const isSchema = BuildSchema(stack, context, schema.additionalProperties, `${value}[${key}]`);
	const isKey = Call(Member(regexp, "test"), [key]);
	const addKey = context.AddKey(key);
	const guarded = context.UseUnevaluated() ? Or(isKey, And(isSchema, addKey)) : Or(isKey, isSchema);
	return Every(Keys(value), Constant(0), [key, _index], guarded);
}
function BuildAdditionalProperties(stack, context, schema, value) {
	return CanAdditionalPropertiesFast(context, schema, value) ? BuildAdditionalPropertiesFast(context, schema, value) : BuildAdditionalPropertiesStandard(stack, context, schema, value);
}
function CheckAdditionalProperties(stack, context, schema, value) {
	const regexp = new RegExp(GetPropertiesPattern(schema));
	return Every$1(Keys$1(value), 0, (key, _index) => {
		return regexp.test(key) || CheckSchema(stack, context, schema.additionalProperties, value[key]) && context.AddKey(key);
	});
}
function ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value) {
	const regexp = new RegExp(GetPropertiesPattern(schema));
	const additionalProperties = [];
	return EveryAll(Keys$1(value), 0, (key, _index) => {
		const nextSchemaPath = `${schemaPath}/additionalProperties`;
		const nextInstancePath = `${instancePath}/${key}`;
		const nextContext = new AccumulatedErrorContext();
		const isAdditionalProperty = regexp.test(key) || ErrorSchema(stack, nextContext, nextSchemaPath, nextInstancePath, schema.additionalProperties, value[key]) && context.AddKey(key);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_reducer.mjs
function Reducer(stack, context, schemas, value, check) {
	const results = ConstDeclaration("results", "[]");
	const context_n = schemas.map((_schema, index) => ConstDeclaration(`context_${index}`, New("CheckContext", [])));
	const condition_n = schemas.map((schema, index) => ConstDeclaration(`condition_${index}`, Call(ArrowFunction(["context"], BuildSchema(stack, context, schema, value)), [`context_${index}`])));
	const checks = schemas.map((_schema, index) => If$1(`condition_${index}`, Call(Member("results", "push"), [`context_${index}`])));
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/allOf.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/anyOf.mjs
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
	const results = schema.anyOf.reduce((result, schema, index) => {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/boolean.mjs
function BuildBooleanSchema(stack, context, schema, value) {
	return schema ? Constant(true) : Constant(false);
}
function CheckBooleanSchema(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/const.mjs
function BuildConst(stack, context, schema, value) {
	return IsValueLike(schema.const) ? IsEqual(value, Constant(schema.const)) : IsDeepEqual(value, CreateVariable(schema.const));
}
function CheckConst(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/contains.mjs
function IsValid$3(schema) {
	return !(IsMinContains(schema) && IsEqual$1(schema.minContains, 0));
}
function BuildContains(stack, context, schema, value) {
	if (!IsValid$3(schema)) return Constant(true);
	const item = Unique();
	const isLength = Not(IsEqual(Member(value, "length"), Constant(0)));
	const isSome = Call(Member(value, "some"), [ArrowFunction([item], BuildSchema(stack, context, schema.contains, item))]);
	return And(isLength, isSome);
}
function CheckContains(stack, context, schema, value) {
	if (!IsValid$3(schema)) return true;
	return !IsEqual$1(value.length, 0) && value.some((item) => CheckSchema(stack, context, schema.contains, item));
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/dependencies.mjs
function BuildDependencies(stack, context, schema, value) {
	const isLength = IsEqual(Member(Keys(value), "length"), Constant(0));
	const isEveryDependency = ReduceAnd(Entries$2(schema.dependencies).map(([key, schema]) => {
		const notKey = Not(HasPropertyKey(value, Constant(key)));
		const isSchema = BuildSchema(stack, context, schema, value);
		const isEveryKey = (schema) => ReduceAnd(schema.map((key) => HasPropertyKey(value, Constant(key))));
		return Or(notKey, IsArray$2(schema) ? isEveryKey(schema) : isSchema);
	}));
	return Or(isLength, isEveryDependency);
}
function CheckDependencies(stack, context, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEvery = Every$1(Entries$2(schema.dependencies), 0, ([key, schema]) => {
		return !HasPropertyKey$1(value, key) || (IsArray$2(schema) ? schema.every((key) => HasPropertyKey$1(value, key)) : CheckSchema(stack, context, schema, value));
	});
	return isLength || isEvery;
}
function ErrorDependencies(stack, context, schemaPath, instancePath, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEvery = EveryAll(Entries$2(schema.dependencies), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/dependencies/${key}`;
		return !HasPropertyKey$1(value, key) || (IsArray$2(schema) ? schema.every((dependency) => HasPropertyKey$1(value, dependency) || context.AddError({
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/dependentRequired.mjs
function BuildDependentRequired(stack, context, schema, value) {
	const isLength = IsEqual(Member(Keys(value), "length"), Constant(0));
	const isEvery = ReduceAnd(Entries$2(schema.dependentRequired).map(([key, keys]) => {
		const notKey = Not(HasPropertyKey(value, Constant(key)));
		const everyKey = ReduceAnd(keys.map((key) => HasPropertyKey(value, Constant(key))));
		return Or(notKey, everyKey);
	}));
	return Or(isLength, isEvery);
}
function CheckDependentRequired(stack, context, schema, value) {
	const isLength = IsEqual$1(Keys$1(value).length, 0);
	const isEvery = Every$1(Entries$2(schema.dependentRequired), 0, ([key, keys]) => {
		return !HasPropertyKey$1(value, key) || keys.every((key) => HasPropertyKey$1(value, key));
	});
	return isLength || isEvery;
}
function ErrorDependentRequired(stack, context, schemaPath, instancePath, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/dependentSchemas.mjs
function BuildDependentSchemas(stack, context, schema, value) {
	const isLength = IsEqual(Member(Keys(value), "length"), Constant(0));
	const isEvery = ReduceAnd(Entries$2(schema.dependentSchemas).map(([key, schema]) => {
		const notKey = Not(HasPropertyKey(value, Constant(key)));
		const isSchema = BuildSchema(stack, context, schema, value);
		return Or(notKey, isSchema);
	}));
	return Or(isLength, isEvery);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/enum.mjs
function BuildEnum(stack, context, schema, value) {
	return ReduceOr(schema.enum.map((option) => {
		if (IsValueLike(option)) return IsEqual(value, Constant(option));
		const variable = CreateVariable(option);
		return IsDeepEqual(value, variable);
	}));
}
function CheckEnum(stack, context, schema, value) {
	return schema.enum.some((option) => IsValueLike(option) ? IsEqual$1(value, option) : IsDeepEqual$1(value, option));
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/exclusiveMaximum.mjs
function BuildExclusiveMaximum(stack, context, schema, value) {
	return IsLessThan(value, Constant(schema.exclusiveMaximum));
}
function CheckExclusiveMaximum(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/exclusiveMinimum.mjs
function BuildExclusiveMinimum(stack, context, schema, value) {
	return IsGreaterThan(value, Constant(schema.exclusiveMinimum));
}
function CheckExclusiveMinimum(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/date.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/time.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/date-time.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/duration.mjs
const Duration = /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/;
/**
* Returns true if the value is a Duration string
* @source ajv-formats
*/
function IsDuration(value) {
	return Duration.test(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/email.mjs
const Email = /^(?!.*\.\.)[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/** Returns true if the value is an Email */
function IsEmail(value) {
	return Email.test(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/hostname.mjs
const Hostname = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i;
/** Returns true if the value is a Hostname */
function IsHostname(value) {
	return Hostname.test(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/idn-email.mjs
const IdnEmail = /^(?!.*\.\.)[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+(?:\.[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+)*@[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?(?:\.[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?)*$/iu;
/** Returns true if the value is a Idn Email */
function IsIdnEmail(value) {
	return IdnEmail.test(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/idn-hostname.mjs
function IsValidAdjacentForKatakanaMiddleDot(char) {
	const codePoint = char.codePointAt(0);
	if (codePoint === void 0) return false;
	return codePoint >= 12352 && codePoint <= 12447 || codePoint >= 12448 && codePoint <= 12543 && codePoint !== 12539 || codePoint >= 19968 && codePoint <= 40959;
}
/**
* Returns true if the value is a Hostname
* @specification
*/
function IsIdnHostname(value) {
	if (value.length === 0) return false;
	if (value.includes(" ")) return false;
	const normalized = value.normalize("NFC").replace(/[\u002E\u3002\uFF0E\uFF61]/g, ".");
	if (normalized.length > 253) return false;
	const labels = normalized.split(".");
	if (labels.some((label) => label.length === 0)) return false;
	for (const label of labels) {
		if (label.length > 63) return false;
		if (label.startsWith("-") || label.endsWith("-")) return false;
		if (/^xn--/i.test(label)) {
			const punycodePart = label.slice(4);
			if (punycodePart.length < 2) return false;
			if (punycodePart.includes("---")) return false;
			continue;
		}
		if (/[\u302E\u302F\u3031\u3032\u3033\u3034\u3035\u303B\u0640\u07FA]/.test(label)) return false;
		const firstChar = label.charAt(0);
		if (/[\u0903\u0300\u0488]/.test(firstChar)) return false;
		for (let i = 0; i < label.length; i++) {
			const char = label.charAt(i);
			if (char === "·") {
				if (i === 0 || i === label.length - 1) return false;
				const prev = label.charAt(i - 1);
				const next = label.charAt(i + 1);
				if (!/^[lL]$/.test(prev) || !/^[lL]$/.test(next)) return false;
			}
			if (char === "・") {
				if (label.length === 1) return false;
				if (i === 0) {
					if (!IsValidAdjacentForKatakanaMiddleDot(label.charAt(i + 1))) return false;
				} else {
					const prev = label.charAt(i - 1);
					const next = label.charAt(i + 1);
					if (!IsValidAdjacentForKatakanaMiddleDot(prev) || !IsValidAdjacentForKatakanaMiddleDot(next)) return false;
				}
			}
			if (char === "͵") {
				if (i === label.length - 1) return false;
				const next = label.charAt(i + 1);
				if (!/[\u0370-\u03FF]/.test(next)) return false;
			}
			if (char === "׳" || char === "״") {
				if (i === 0) return false;
				const prev = label.charAt(i - 1);
				if (!/[\u05D0-\u05EA]/.test(prev)) return false;
			}
			if (char === "‍") {
				if (i === 0) return false;
				if (label.charAt(i - 1) !== "्") return false;
			}
		}
		let hasArabicIndic = false;
		let hasExtendedArabicIndic = false;
		for (let i = 0; i < label.length; i++) {
			const char = label.charAt(i);
			if (/[\u0660-\u0669]/.test(char)) hasArabicIndic = true;
			if (/[\u06F0-\u06F9]/.test(char)) hasExtendedArabicIndic = true;
		}
		if (hasArabicIndic && hasExtendedArabicIndic) return false;
	}
	return true;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/ipv4.mjs
const IPv4 = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
/**
* Returns true if the value is a IPV4 address
* @source ajv-formats
* @specification http://tools.ietf.org/html/rfc2673#section-3.2
*/
function IsIPv4(value) {
	return IPv4.test(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/ipv6.mjs
const IPv6 = /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i;
/**
* Returns true if the value is a IPV6 address
* @source ajv-formats
* @specification http://tools.ietf.org/html/rfc2373#section-2.2
*/
function IsIPv6(value) {
	return IPv6.test(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/iri-reference.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/iri.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/json-pointer-uri-fragment.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/json-pointer.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/regex.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/relative-json-pointer.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/uri-reference.mjs
const UriReference = /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i;
/**
* Returns true if the value is a uri reference
* @specification
* @source ajv-formats
*/
function IsUriReference(value) {
	return UriReference.test(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/uri-template.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/uri.mjs
const Uri = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i;
/**
* Returns true if the value is a uri
* @specification
* @source ajv-formats
*/
function IsUri(value) {
	return Uri.test(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/url.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/uuid.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/_registry.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/format/format.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/format.mjs
function BuildFormat(stack, context, schema, value) {
	return Call(Member("Format", "Test"), [Constant(schema.format), value]);
}
function CheckFormat(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/if.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/items.mjs
function BuildItemsSized(stack, context, schema, value) {
	return ReduceAnd(schema.items.map((schema, index) => {
		const isLength = IsLessEqualThan(Member(value, "length"), Constant(index));
		const isSchema = BuildSchema(stack, context, schema, `${value}[${index}]`);
		const addIndex = context.AddIndex(Constant(index));
		const guarded = context.UseUnevaluated() ? And(isSchema, addIndex) : isSchema;
		return Or(isLength, guarded);
	}));
}
function CheckItemsSized(stack, context, schema, value) {
	return Every$1(schema.items, 0, (schema, index) => {
		return IsLessEqualThan$1(value.length, index) || CheckSchema(stack, context, schema, value[index]) && context.AddIndex(index);
	});
}
function ErrorItemsSized(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(schema.items, 0, (schema, index) => {
		const nextSchemaPath = `${schemaPath}/items/${index}`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessEqualThan$1(value.length, index) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index);
	});
}
function BuildItemsUnsized(stack, context, schema, value) {
	const offset = IsPrefixItems(schema) ? schema.prefixItems.length : 0;
	const isSchema = BuildSchema(stack, context, schema.items, "element");
	const addIndex = context.AddIndex("index");
	const guarded = context.UseUnevaluated() ? And(isSchema, addIndex) : isSchema;
	return Every(value, Constant(offset), ["element", "index"], guarded);
}
function CheckItemsUnsized(stack, context, schema, value) {
	const offset = IsPrefixItems(schema) ? schema.prefixItems.length : 0;
	return Every$1(value, offset, (element, index) => {
		return CheckSchema(stack, context, schema.items, element) && context.AddIndex(index);
	});
}
function ErrorItemsUnsized(stack, context, schemaPath, instancePath, schema, value) {
	const offset = IsPrefixItems(schema) ? schema.prefixItems.length : 0;
	return EveryAll(value, offset, (element, index) => {
		return ErrorSchema(stack, context, `${schemaPath}/items`, `${instancePath}/${index}`, schema.items, element) && context.AddIndex(index);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/maxContains.mjs
function IsValid$2(schema) {
	return IsContains(schema);
}
function BuildMaxContains(stack, context, schema, value) {
	if (!IsValid$2(schema)) return Constant(true);
	const [result, item] = [Unique(), Unique()];
	const count = Call(Member(value, "reduce"), [ArrowFunction([result, item], Ternary(BuildSchema(stack, context, schema.contains, item), PrefixIncrement(result), result)), Constant(0)]);
	return IsLessEqualThan(count, Constant(schema.maxContains));
}
function CheckMaxContains(stack, context, schema, value) {
	if (!IsValid$2(schema)) return true;
	const count = value.reduce((result, item) => CheckSchema(stack, context, schema.contains, item) ? ++result : result, 0);
	return IsLessEqualThan$1(count, schema.maxContains);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/maximum.mjs
function BuildMaximum(stack, context, schema, value) {
	return IsLessEqualThan(value, Constant(schema.maximum));
}
function CheckMaximum(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/maxItems.mjs
function BuildMaxItems(stack, context, schema, value) {
	return IsLessEqualThan(Member(value, "length"), Constant(schema.maxItems));
}
function CheckMaxItems(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/maxLength.mjs
function BuildMaxLength(stack, context, schema, value) {
	return IsMaxLength$1(value, Constant(schema.maxLength));
}
function CheckMaxLength(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/maxProperties.mjs
function BuildMaxProperties(stack, context, schema, value) {
	return IsLessEqualThan(Member(Keys(value), "length"), Constant(schema.maxProperties));
}
function CheckMaxProperties(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/minContains.mjs
function IsValid$1(schema) {
	return IsContains(schema);
}
function BuildMinContains(stack, context, schema, value) {
	if (!IsValid$1(schema)) return Constant(true);
	const [result, item] = [Unique(), Unique()];
	const count = Call(Member(value, "reduce"), [ArrowFunction([result, item], Ternary(BuildSchema(stack, context, schema.contains, item), PrefixIncrement(result), result)), Constant(0)]);
	return IsGreaterEqualThan(count, Constant(schema.minContains));
}
function CheckMinContains(stack, context, schema, value) {
	if (!IsValid$1(schema)) return true;
	const count = value.reduce((result, item) => CheckSchema(stack, context, schema.contains, item) ? ++result : result, 0);
	return IsGreaterEqualThan$1(count, schema.minContains);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/minimum.mjs
function BuildMinimum(stack, context, schema, value) {
	return IsGreaterEqualThan(value, Constant(schema.minimum));
}
function CheckMinimum(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/minItems.mjs
function BuildMinItems(stack, context, schema, value) {
	return IsGreaterEqualThan(Member(value, "length"), Constant(schema.minItems));
}
function CheckMinItems(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/minLength.mjs
function BuildMinLength(stack, context, schema, value) {
	return IsMinLength$1(value, Constant(schema.minLength));
}
function CheckMinLength(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/minProperties.mjs
function BuildMinProperties(stack, context, schema, value) {
	return IsGreaterEqualThan(Member(Keys(value), "length"), Constant(schema.minProperties));
}
function CheckMinProperties(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/multipleOf.mjs
function BuildMultipleOf(stack, context, schema, value) {
	return MultipleOf(value, Constant(schema.multipleOf));
}
function CheckMultipleOf(stack, context, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/not.mjs
function BuildNotUnevaluated(stack, context, schema, value) {
	return Reducer(stack, context, [schema.not], value, Not(IsEqual(Member("results", "length"), Constant(1))));
}
function BuildNotFast(stack, context, schema, value) {
	return Not(BuildSchema(stack, context, schema.not, value));
}
function BuildNot(stack, context, schema, value) {
	return context.UseUnevaluated() ? BuildNotUnevaluated(stack, context, schema, value) : BuildNotFast(stack, context, schema, value);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/oneOf.mjs
function BuildOneOfUnevaluated(stack, context, schema, value) {
	return Reducer(stack, context, schema.oneOf, value, IsEqual(Member("results", "length"), Constant(1)));
}
function BuildOneOfFast(stack, context, schema, value) {
	const results = ArrayLiteral(schema.oneOf.map((schema) => BuildSchema(stack, context, schema, value)));
	const count = Call(Member(results, "reduce"), [ArrowFunction(["count", "result"], Ternary(IsEqual("result", Constant(true)), PrefixIncrement("count"), "count")), Constant(0)]);
	return IsEqual(count, Constant(1));
}
function BuildOneOf(stack, context, schema, value) {
	return context.UseUnevaluated() ? BuildOneOfUnevaluated(stack, context, schema, value) : BuildOneOfFast(stack, context, schema, value);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/pattern.mjs
function BuildPattern(stack, context, schema, value) {
	const regexp = CreateVariable(IsString$3(schema.pattern) ? new RegExp(schema.pattern) : schema.pattern);
	return Call(Member(regexp, "test"), [value]);
}
function CheckPattern(stack, context, schema, value) {
	return (IsString$3(schema.pattern) ? new RegExp(schema.pattern) : schema.pattern).test(value);
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/patternProperties.mjs
function BuildPatternProperties(stack, context, schema, value) {
	return ReduceAnd(Entries$2(schema.patternProperties).map(([pattern, schema]) => {
		const [key, prop] = [Unique(), Unique()];
		const regexp = CreateVariable(new RegExp(pattern));
		const notKey = Not(Call(Member(regexp, "test"), [key]));
		const isSchema = BuildSchema(stack, context, schema, prop);
		const addKey = context.AddKey(key);
		const guarded = context.UseUnevaluated() ? Or(notKey, And(isSchema, addKey)) : Or(notKey, isSchema);
		return Every(Entries$1(value), Constant(0), [`[${key}, ${prop}]`, "_"], guarded);
	}));
}
function CheckPatternProperties(stack, context, schema, value) {
	return Every$1(Entries$2(schema.patternProperties), 0, ([pattern, schema]) => {
		const regexp = new RegExp(pattern);
		return Every$1(Entries$2(value), 0, ([key, prop]) => {
			return !regexp.test(key) || CheckSchema(stack, context, schema, prop) && context.AddKey(key);
		});
	});
}
function ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(Entries$2(schema.patternProperties), 0, ([pattern, schema]) => {
		const nextSchemaPath = `${schemaPath}/patternProperties/${pattern}`;
		const regexp = new RegExp(pattern);
		return EveryAll(Entries$2(value), 0, ([key, value]) => {
			const nextInstancePath = `${instancePath}/${key}`;
			return !regexp.test(key) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value) && context.AddKey(key);
		});
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/prefixItems.mjs
function BuildPrefixItems(stack, context, schema, value) {
	return ReduceAnd(schema.prefixItems.map((schema, index) => {
		const isLength = IsLessEqualThan(Member(value, "length"), Constant(index));
		const isSchema = BuildSchema(stack, context, schema, `${value}[${index}]`);
		const addIndex = context.AddIndex(Constant(index));
		const guarded = context.UseUnevaluated() ? And(isSchema, addIndex) : isSchema;
		return Or(isLength, guarded);
	}));
}
function CheckPrefixItems(stack, context, schema, value) {
	return IsEqual$1(value.length, 0) || Every$1(schema.prefixItems, 0, (schema, index) => {
		return IsLessEqualThan$1(value.length, index) || CheckSchema(stack, context, schema, value[index]) && context.AddIndex(index);
	});
}
function ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value) {
	return IsEqual$1(value.length, 0) || EveryAll(schema.prefixItems, 0, (schema, index) => {
		const nextSchemaPath = `${schemaPath}/prefixItems/${index}`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessEqualThan$1(value.length, index) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index);
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_exact_optional.mjs
function IsExactOptional(required, key) {
	return required.includes(key) || Get$3().exactOptionalPropertyTypes;
}
function InexactOptionalBuild(value, key) {
	return IsUndefined$1(Member(value, key));
}
function InexactOptionalCheck(value, key) {
	return IsUndefined$2(value[key]);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/properties.mjs
function BuildProperties(stack, context, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	const everyKey = Entries$2(schema.properties).map(([key, schema]) => {
		const notKey = Not(HasPropertyKey(value, Constant(key)));
		const isSchema = BuildSchema(stack, context, schema, Member(value, key));
		const addKey = context.AddKey(Constant(key));
		const guarded = context.UseUnevaluated() ? And(isSchema, addKey) : isSchema;
		const isProperty = required.includes(key) ? guarded : Or(notKey, guarded);
		return IsExactOptional(required, key) ? isProperty : Or(InexactOptionalBuild(value, key), isProperty);
	});
	return ReduceAnd(everyKey);
}
function CheckProperties(stack, context, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return Every$1(Entries$2(schema.properties), 0, ([key, schema]) => {
		const isProperty = !HasPropertyKey$1(value, key) || CheckSchema(stack, context, schema, value[key]) && context.AddKey(key);
		return IsExactOptional(required, key) ? isProperty : InexactOptionalCheck(value, key) || isProperty;
	});
}
function ErrorProperties(stack, context, schemaPath, instancePath, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return EveryAll(Entries$2(schema.properties), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/properties/${key}`;
		const nextInstancePath = `${instancePath}/${key}`;
		const isProperty = () => !HasPropertyKey$1(value, key) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value[key]) && context.AddKey(key);
		return IsExactOptional(required, key) ? isProperty() : InexactOptionalCheck(value, key) || isProperty();
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/propertyNames.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/recursiveRef.mjs
function BuildRecursiveRef(stack, context, schema, value) {
	const target = stack.RecursiveRef(schema.$recursiveRef) ?? false;
	return CreateFunction(stack, context, target, value);
}
function CheckRecursiveRef(stack, context, schema, value) {
	const target = stack.RecursiveRef(schema.$recursiveRef) ?? false;
	return IsSchema(target) && CheckSchema(stack, context, target, value);
}
function ErrorRecursiveRef(stack, context, schemaPath, instancePath, schema, value) {
	const target = stack.RecursiveRef(schema.$recursiveRef) ?? false;
	return IsSchema(target) && ErrorSchema(stack, context, "#", instancePath, target, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/ref.mjs
function BuildRefStandard(stack, context, target, value) {
	const interior = ArrowFunction(["context", "value"], CreateFunction(stack, context, target, "value"));
	const exterior = ArrowFunction(["context", "value"], Statements([
		ConstDeclaration("nextContext", New("CheckContext", [])),
		ConstDeclaration("result", Call(interior, ["nextContext", "value"])),
		If$1("result", context.Merge("[nextContext]")),
		Return("result")
	]));
	return Call(exterior, ["context", value]);
}
function BuildRefFast(stack, context, target, value) {
	return CreateFunction(stack, context, target, value);
}
function BuildRef(stack, context, schema, value) {
	const target = stack.Ref(schema.$ref) ?? false;
	return context.UseUnevaluated() ? BuildRefStandard(stack, context, target, value) : BuildRefFast(stack, context, target, value);
}
function CheckRef(stack, context, schema, value) {
	const target = stack.Ref(schema.$ref) ?? false;
	const nextContext = new CheckContext();
	const result = IsSchema(target) && CheckSchema(stack, nextContext, target, value);
	if (result) context.Merge([nextContext]);
	return result;
}
function ErrorRef(stack, context, schemaPath, instancePath, schema, value) {
	const target = stack.Ref(schema.$ref) ?? false;
	const nextContext = new AccumulatedErrorContext();
	const result = IsSchema(target) && ErrorSchema(stack, nextContext, "#", instancePath, target, value);
	if (result) context.Merge([nextContext]);
	if (!result) nextContext.GetErrors().forEach((error) => context.AddError(error));
	return result;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/required.mjs
function BuildRequired(stack, context, schema, value) {
	return ReduceAnd(schema.required.map((key) => HasPropertyKey(value, Constant(key))));
}
function CheckRequired(stack, context, schema, value) {
	return Every$1(schema.required, 0, (key) => HasPropertyKey$1(value, key));
}
function ErrorRequired(stack, context, schemaPath, instancePath, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/type.mjs
function BuildTypeName(stack, context, type, value) {
	return IsEqual$1(type, "object") ? IsObjectNotArray(value) : IsEqual$1(type, "array") ? IsArray$1(value) : IsEqual$1(type, "boolean") ? IsBoolean$2(value) : IsEqual$1(type, "integer") ? IsInteger$1(value) : IsEqual$1(type, "number") ? IsNumber$2(value) : IsEqual$1(type, "null") ? IsNull$1(value) : IsEqual$1(type, "string") ? IsString$2(value) : IsEqual$1(type, "asyncIterator") ? IsAsyncIterator$1(value) : IsEqual$1(type, "bigint") ? IsBigInt$1(value) : IsEqual$1(type, "constructor") ? IsConstructor$1(value) : IsEqual$1(type, "function") ? IsFunction$1(value) : IsEqual$1(type, "iterator") ? IsIterator$1(value) : IsEqual$1(type, "symbol") ? IsSymbol$1(value) : IsEqual$1(type, "undefined") ? IsUndefined$1(value) : IsEqual$1(type, "void") ? IsUndefined$1(value) : Constant(true);
}
function CheckTypeName(stack, context, type, schema, value) {
	return IsEqual$1(type, "object") ? IsObjectNotArray$1(value) : IsEqual$1(type, "array") ? IsArray$2(value) : IsEqual$1(type, "boolean") ? IsBoolean$3(value) : IsEqual$1(type, "integer") ? IsInteger$2(value) : IsEqual$1(type, "number") ? IsNumber$3(value) : IsEqual$1(type, "null") ? IsNull$2(value) : IsEqual$1(type, "string") ? IsString$3(value) : IsEqual$1(type, "asyncIterator") ? IsAsyncIterator$2(value) : IsEqual$1(type, "bigint") ? IsBigInt$2(value) : IsEqual$1(type, "constructor") ? IsConstructor$2(value) : IsEqual$1(type, "function") ? IsFunction$2(value) : IsEqual$1(type, "iterator") ? IsIterator$2(value) : IsEqual$1(type, "symbol") ? IsSymbol$2(value) : IsEqual$1(type, "undefined") ? IsUndefined$2(value) : IsEqual$1(type, "void") ? IsUndefined$2(value) : true;
}
function BuildTypeNames(stack, context, typenames, value) {
	return ReduceOr(typenames.map((type) => BuildTypeName(stack, context, type, value)));
}
function CheckTypeNames(stack, context, types, schema, value) {
	return types.some((type) => CheckTypeName(stack, context, type, schema, value));
}
function BuildType(stack, context, schema, value) {
	return IsArray$2(schema.type) ? BuildTypeNames(stack, context, schema.type, value) : BuildTypeName(stack, context, schema.type, value);
}
function CheckType(stack, context, schema, value) {
	return IsArray$2(schema.type) ? CheckTypeNames(stack, context, schema.type, schema, value) : CheckTypeName(stack, context, schema.type, schema, value);
}
function ErrorType(stack, context, schemaPath, instancePath, schema, value) {
	return (IsArray$2(schema.type) ? CheckTypeNames(stack, context, schema.type, schema, value) : CheckTypeName(stack, context, schema.type, schema, value)) || context.AddError({
		keyword: "type",
		schemaPath,
		instancePath,
		params: { type: schema.type }
	});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/unevaluatedItems.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/unevaluatedProperties.mjs
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/uniqueItems.mjs
function IsValid(schema) {
	return !IsEqual$1(schema.uniqueItems, false);
}
function BuildUniqueItems(stack, context, schema, value) {
	if (!IsValid(schema)) return Constant(true);
	const set = Member(New("Set", [Call(Member(value, "map"), [Member("Hashing", "Hash")])]), "size");
	const isLength = Member(value, "length");
	return IsEqual(set, isLength);
}
function CheckUniqueItems(stack, context, schema, value) {
	if (!IsValid(schema)) return true;
	const set = new Set(value.map(Hash)).size;
	const isLength = value.length;
	return IsEqual$1(set, isLength);
}
function ErrorUniqueItems(stack, context, schemaPath, instancePath, schema, value) {
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/schema.mjs
function HasTypeName(schema, typename) {
	return IsType(schema) && (IsArray$2(schema.type) && schema.type.includes(typename) || IsEqual$1(schema.type, typename));
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
function BuildSchema(stack, context, schema, value) {
	stack.Push(schema);
	const conditions = [];
	if (IsBooleanSchema(schema)) return BuildBooleanSchema(stack, context, schema, value);
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
		const guarded = Or(Not(IsArray$1(value)), reduced);
		conditions.push(HasArrayType(schema) ? reduced : guarded);
	}
	if (HasStringKeywords(schema)) {
		const constraints = [];
		if (IsFormat(schema)) constraints.push(BuildFormat(stack, context, schema, value));
		if (IsMaxLength(schema)) constraints.push(BuildMaxLength(stack, context, schema, value));
		if (IsMinLength(schema)) constraints.push(BuildMinLength(stack, context, schema, value));
		if (IsPattern(schema)) constraints.push(BuildPattern(stack, context, schema, value));
		const reduced = ReduceAnd(constraints);
		const guarded = Or(Not(IsString$2(value)), reduced);
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
		const guarded = Or(Not(Or(IsNumber$2(value), IsBigInt$1(value))), reduced);
		conditions.push(HasNumberType(schema) ? reduced : guarded);
	}
	if (IsRecursiveRef(schema)) conditions.push(BuildRecursiveRef(stack, context, schema, value));
	if (IsRef(schema)) conditions.push(BuildRef(stack, context, schema, value));
	if (IsGuard(schema)) conditions.push(BuildGuard(stack, context, schema, value));
	if (IsConst(schema)) conditions.push(BuildConst(stack, context, schema, value));
	if (IsEnum(schema)) conditions.push(BuildEnum(stack, context, schema, value));
	if (IsIf(schema)) conditions.push(BuildIf(stack, context, schema, value));
	if (IsNot(schema)) conditions.push(BuildNot(stack, context, schema, value));
	if (IsAllOf(schema)) conditions.push(BuildAllOf(stack, context, schema, value));
	if (IsAnyOf(schema)) conditions.push(BuildAnyOf(stack, context, schema, value));
	if (IsOneOf(schema)) conditions.push(BuildOneOf(stack, context, schema, value));
	if (IsUnevaluatedItems(schema)) conditions.push(Or(Not(IsArray$1(value)), BuildUnevaluatedItems(stack, context, schema, value)));
	if (IsUnevaluatedProperties(schema)) conditions.push(Or(Not(IsObject$1(value)), BuildUnevaluatedProperties(stack, context, schema, value)));
	if (IsRefine(schema)) conditions.push(BuildRefine(stack, context, schema, value));
	const result = ReduceAnd(conditions);
	stack.Pop(schema);
	return result;
}
function CheckSchema(stack, context, schema, value) {
	stack.Push(schema);
	const result = IsBooleanSchema(schema) ? CheckBooleanSchema(stack, context, schema, value) : (!IsType(schema) || CheckType(stack, context, schema, value)) && (!(IsObject$2(value) && !IsArray$2(value)) || (!IsRequired(schema) || CheckRequired(stack, context, schema, value)) && (!IsAdditionalProperties(schema) || CheckAdditionalProperties(stack, context, schema, value)) && (!IsDependencies(schema) || CheckDependencies(stack, context, schema, value)) && (!IsDependentRequired(schema) || CheckDependentRequired(stack, context, schema, value)) && (!IsDependentSchemas(schema) || CheckDependentSchemas(stack, context, schema, value)) && (!IsPatternProperties(schema) || CheckPatternProperties(stack, context, schema, value)) && (!IsProperties(schema) || CheckProperties(stack, context, schema, value)) && (!IsPropertyNames(schema) || CheckPropertyNames(stack, context, schema, value)) && (!IsMinProperties(schema) || CheckMinProperties(stack, context, schema, value)) && (!IsMaxProperties(schema) || CheckMaxProperties(stack, context, schema, value))) && (!IsArray$2(value) || (!IsAdditionalItems(schema) || CheckAdditionalItems(stack, context, schema, value)) && (!IsContains(schema) || CheckContains(stack, context, schema, value)) && (!IsItems(schema) || CheckItems(stack, context, schema, value)) && (!IsMaxContains(schema) || CheckMaxContains(stack, context, schema, value)) && (!IsMaxItems(schema) || CheckMaxItems(stack, context, schema, value)) && (!IsMinContains(schema) || CheckMinContains(stack, context, schema, value)) && (!IsMinItems(schema) || CheckMinItems(stack, context, schema, value)) && (!IsPrefixItems(schema) || CheckPrefixItems(stack, context, schema, value)) && (!IsUniqueItems(schema) || CheckUniqueItems(stack, context, schema, value))) && (!IsString$3(value) || (!IsFormat(schema) || CheckFormat(stack, context, schema, value)) && (!IsMaxLength(schema) || CheckMaxLength(stack, context, schema, value)) && (!IsMinLength(schema) || CheckMinLength(stack, context, schema, value)) && (!IsPattern(schema) || CheckPattern(stack, context, schema, value))) && (!(IsNumber$3(value) || IsBigInt$2(value)) || (!IsExclusiveMaximum(schema) || CheckExclusiveMaximum(stack, context, schema, value)) && (!IsExclusiveMinimum(schema) || CheckExclusiveMinimum(stack, context, schema, value)) && (!IsMaximum(schema) || CheckMaximum(stack, context, schema, value)) && (!IsMinimum(schema) || CheckMinimum(stack, context, schema, value)) && (!IsMultipleOf(schema) || CheckMultipleOf(stack, context, schema, value))) && (!IsRecursiveRef(schema) || CheckRecursiveRef(stack, context, schema, value)) && (!IsRef(schema) || CheckRef(stack, context, schema, value)) && (!IsGuard(schema) || CheckGuard(stack, context, schema, value)) && (!IsConst(schema) || CheckConst(stack, context, schema, value)) && (!IsEnum(schema) || CheckEnum(stack, context, schema, value)) && (!IsIf(schema) || CheckIf(stack, context, schema, value)) && (!IsNot(schema) || CheckNot(stack, context, schema, value)) && (!IsAllOf(schema) || CheckAllOf(stack, context, schema, value)) && (!IsAnyOf(schema) || CheckAnyOf(stack, context, schema, value)) && (!IsOneOf(schema) || CheckOneOf(stack, context, schema, value)) && (!IsUnevaluatedItems(schema) || !IsArray$2(value) || CheckUnevaluatedItems(stack, context, schema, value)) && (!IsUnevaluatedProperties(schema) || !IsObject$2(value) || CheckUnevaluatedProperties(stack, context, schema, value)) && (!IsRefine(schema) || CheckRefine(stack, context, schema, value));
	stack.Pop(schema);
	return result;
}
function ErrorSchema(stack, context, schemaPath, instancePath, schema, value) {
	stack.Push(schema);
	const result = IsBooleanSchema(schema) ? ErrorBooleanSchema(stack, context, schemaPath, instancePath, schema, value) : !!(+(!IsType(schema) || ErrorType(stack, context, schemaPath, instancePath, schema, value)) & +(!(IsObject$2(value) && !IsArray$2(value)) || !!(+(!IsRequired(schema) || ErrorRequired(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAdditionalProperties(schema) || ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependencies(schema) || ErrorDependencies(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependentRequired(schema) || ErrorDependentRequired(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependentSchemas(schema) || ErrorDependentSchemas(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPatternProperties(schema) || ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsProperties(schema) || ErrorProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPropertyNames(schema) || ErrorPropertyNames(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinProperties(schema) || ErrorMinProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxProperties(schema) || ErrorMaxProperties(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsArray$2(value) || !!(+(!IsAdditionalItems(schema) || ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsContains(schema) || ErrorContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsItems(schema) || ErrorItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxContains(schema) || ErrorMaxContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxItems(schema) || ErrorMaxItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinContains(schema) || ErrorMinContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinItems(schema) || ErrorMinItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPrefixItems(schema) || ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUniqueItems(schema) || ErrorUniqueItems(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsString$3(value) || !!(+(!IsFormat(schema) || ErrorFormat(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxLength(schema) || ErrorMaxLength(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinLength(schema) || ErrorMinLength(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPattern(schema) || ErrorPattern(stack, context, schemaPath, instancePath, schema, value)))) & +(!(IsNumber$3(value) || IsBigInt$2(value)) || !!(+(!IsExclusiveMaximum(schema) || ErrorExclusiveMaximum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsExclusiveMinimum(schema) || ErrorExclusiveMinimum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaximum(schema) || ErrorMaximum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinimum(schema) || ErrorMinimum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMultipleOf(schema) || ErrorMultipleOf(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsRecursiveRef(schema) || ErrorRecursiveRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsRef(schema) || ErrorRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsGuard(schema) || ErrorGuard(stack, context, schemaPath, instancePath, schema, value)) & +(!IsConst(schema) || ErrorConst(stack, context, schemaPath, instancePath, schema, value)) & +(!IsEnum(schema) || ErrorEnum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsIf(schema) || ErrorIf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsNot(schema) || ErrorNot(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAllOf(schema) || ErrorAllOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAnyOf(schema) || ErrorAnyOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsOneOf(schema) || ErrorOneOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUnevaluatedItems(schema) || !IsArray$2(value) || ErrorUnevaluatedItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUnevaluatedProperties(schema) || !IsObject$2(value) || ErrorUnevaluatedProperties(stack, context, schemaPath, instancePath, schema, value))) && (!IsRefine(schema) || ErrorRefine(stack, context, schemaPath, instancePath, schema, value));
	stack.Pop(schema);
	return result;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_functions.mjs
const functions = /* @__PURE__ */ new Map();
function CreateCallExpression(context, schema, hash, value) {
	return context.UseUnevaluated() ? Call(`check_${hash}`, ["context", value]) : Call(`check_${hash}`, [value]);
}
function CreateFunctionExpression(stack, context, schema, hash) {
	const expression = BuildSchema(stack, context, schema, "value");
	return context.UseUnevaluated() ? ConstDeclaration(`check_${hash}`, ArrowFunction(["context", "value"], expression)) : ConstDeclaration(`check_${hash}`, ArrowFunction(["value"], expression));
}
function ResetFunctions() {
	functions.clear();
}
function GetFunctions() {
	return [...functions.values()];
}
function CreateFunction(stack, context, schema, value) {
	const hash = IsSchemaObject(schema) ? Hash({
		__baseURL: stack.BaseURL().href,
		...schema
	}) : Hash(schema);
	const call = CreateCallExpression(context, schema, hash, value);
	if (functions.has(hash)) return call;
	functions.set(hash, "");
	functions.set(hash, CreateFunctionExpression(stack, context, schema, hash));
	return call;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/pointer/pointer.mjs
function GetIndex(index, value) {
	return IsObject$2(value) ? value[index] : void 0;
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/resolve/ref.mjs
function MatchId(schema, base, ref) {
	if (schema.$id === ref.hash) return schema;
	const absoluteId = new URL(schema.$id, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	if (IsEqual$1(absoluteId.pathname, absoluteRef.pathname)) return ref.hash.startsWith("#") ? MatchHash(schema, base, ref) : schema;
}
function MatchAnchor(schema, base, ref) {
	const absoluteAnchor = new URL(`#${schema.$anchor}`, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	if (IsEqual$1(absoluteAnchor.href, absoluteRef.href)) return schema;
}
function MatchHash(schema, base, ref) {
	if (ref.href.endsWith("#")) return schema;
	return ref.hash.startsWith("#") ? Get(schema, decodeURIComponent(ref.hash.slice(1))) : void 0;
}
function Match(schema, base, ref) {
	if (IsId(schema)) {
		const result = MatchId(schema, base, ref);
		if (!IsUndefined$2(result)) return result;
	}
	if (IsAnchor(schema)) {
		const result = MatchAnchor(schema, base, ref);
		if (!IsUndefined$2(result)) return result;
	}
	return MatchHash(schema, base, ref);
}
function FromArray$7(schema, base, ref) {
	return schema.reduce((result, item) => {
		const match = FromValue$1(item, base, ref);
		return !IsUndefined$2(match) ? match : result;
	}, void 0);
}
function FromObject$7(schema, base, ref) {
	return Keys$1(schema).reduce((result, key) => {
		const match = FromValue$1(schema[key], base, ref);
		return !IsUndefined$2(match) ? match : result;
	}, void 0);
}
function FromValue$1(schema, base, ref) {
	base = IsSchemaObject(schema) && IsId(schema) ? new URL(schema.$id, base.href) : base;
	if (IsSchemaObject(schema)) {
		const result = Match(schema, base, ref);
		if (!IsUndefined$2(result)) return result;
	}
	if (IsArray$2(schema)) return FromArray$7(schema, base, ref);
	if (IsObject$2(schema)) return FromObject$7(schema, base, ref);
}
function Ref(schema, ref) {
	const defaultBase = new URL("http://unknown");
	const initialBase = IsId(schema) ? new URL(schema.$id, defaultBase.href) : defaultBase;
	return FromValue$1(schema, initialBase, new URL(ref, initialBase.href));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/engine/_stack.mjs
var Stack = class {
	constructor(context, schema) {
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
		if (IsId(schema)) this.ids.push(schema);
		if (IsAnchor(schema)) this.anchors.push(schema);
		if (IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.push(schema);
		if (IsDynamicAnchor(schema)) this.dynamicAnchors.push(schema);
	}
	Pop(schema) {
		if (!IsSchemaObject(schema)) return;
		if (IsId(schema)) this.ids.pop();
		if (IsAnchor(schema)) this.anchors.pop();
		if (IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.pop();
		if (IsDynamicAnchor(schema)) this.dynamicAnchors.pop();
	}
	FromContext(ref) {
		return HasPropertyKey$1(this.context, ref) ? this.context[ref] : void 0;
	}
	FromRef(ref) {
		return !ref.startsWith("#") ? Ref(this.schema, ref) : Ref(this.Base(), ref);
	}
	Ref(ref) {
		return this.FromContext(ref) ?? this.FromRef(ref);
	}
	RecursiveRef(recursiveRef) {
		if (IsRecursiveAnchorTrue(this.Base())) return Ref(this.recursiveAnchors[0], recursiveRef);
		return Ref(this.Base(), recursiveRef);
	}
};

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/build.mjs
function CreateCode(build) {
	return `${build.Functions().join(";\n")}; return (value) => { ${(build.UseUnevaluated() ? ["const context = new CheckContext({}, {})", `return ${build.Call()}`] : [`return ${build.Call()}`]).join("; ")} }`;
}
function CreateEvaluatedCheck(build, code) {
	return new globalThis.Function("CheckContext", "Guard", "Format", "Hashing", build.External().identifier, code)(CheckContext, guard_exports, format_exports, hash_exports, build.External().variables);
}
function CreateDynamicCheck(build) {
	const stack = new Stack(build.Context(), build.Schema());
	const context = new CheckContext();
	return (value) => CheckSchema(stack, context, build.Schema(), value);
}
function CreateCheck(build, code) {
	return CanEvaluate() ? CreateEvaluatedCheck(build, code) : CreateDynamicCheck(build);
}
var BuildResult = class {
	constructor(context, schema, external, functions, call, useUnevaluated) {
		this.context = context;
		this.schema = schema;
		this.external = external;
		this.functions = functions;
		this.call = call;
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
	Call() {
		return this.call;
	}
	/** Evaluates the build into a validation function */
	Evaluate() {
		const Code = CreateCode(this);
		const Check = CreateCheck(this, Code);
		return {
			IsEvaluated: CanEvaluate(),
			Code,
			Check
		};
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
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/check.mjs
/** Checks a value against the provided schema */
function Check$1(...args) {
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
	const stack = new Stack(context, schema);
	const checkContext = new CheckContext();
	return CheckSchema(stack, checkContext, schema, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/schema/errors.mjs
/** Checks a value and returns validation errors */
function Errors$1(...args) {
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
	const stack = new Stack(context, schema);
	const errorContext = new ErrorContext((error) => {
		if (IsGreaterEqualThan$1(errors.length, settings.maxErrors)) return;
		return errors.push({
			...error,
			message: locale(error)
		});
	});
	return [ErrorSchema(stack, errorContext, "#", "", schema, value), errors];
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/check/check.mjs
/** Checks a value matches the provided type. */
function Check(...args) {
	const [context, type, value] = Match$1(args, {
		3: (context, type, value) => [
			context,
			type,
			value
		],
		2: (type, value) => [
			{},
			type,
			value
		]
	});
	return Check$1(context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/errors/errors.mjs
/**
* Performs an exhaustive Check on the specified value and reports any errors found.
* If no errors are found, an empty array is returned. Unlike Check, this function
* does not terminate at the first occurance of an error. For best performance, call
* Check first and call Errors only if Check returns false.
*/
function Errors(...args) {
	const [context, type, value] = Match$1(args, {
		3: (context, type, value) => [
			context,
			type,
			value
		],
		2: (type, value) => [
			{},
			type,
			value
		]
	});
	const [_, errors] = Errors$1(context, type, value);
	return errors;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/assert/assert.mjs
var AssertError = class extends Error {
	constructor(source, value, errors) {
		super(source);
		Object.defineProperty(this, "cause", {
			value: {
				source,
				errors,
				value
			},
			writable: false,
			configurable: false,
			enumerable: false
		});
	}
};

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-array.mjs
function FromArray$6(context, type, value) {
	if (!IsArray$2(value)) return value;
	return value.map((value) => FromType$5(context, type.items, value));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-base.mjs
function FromBase$3(context, type, value) {
	return type.Clean(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-cyclic.mjs
function FromCyclic$5(context, type, value) {
	return FromType$5({
		...context,
		...type.$defs
	}, Ref$1(type.$ref), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-intersect.mjs
function EvaluateIntersection(context, type) {
	const additionalProperties = HasPropertyKey$1(type, "unevaluatedProperties") ? { additionalProperties: type.unevaluatedProperties } : {};
	const evaluated = Evaluate(Instantiate(context, type));
	return IsObject(evaluated) ? Options(evaluated, additionalProperties) : evaluated;
}
function FromIntersect$5(context, type, value) {
	return FromType$5(context, EvaluateIntersection(context, type), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/additional.mjs
function GetAdditionalProperties(type) {
	return HasPropertyKey$1(type, "additionalProperties") ? type.additionalProperties : void 0;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-object.mjs
function FromObject$6(context, type, value) {
	if (!IsObject$2(value) || IsArray$2(value)) return value;
	const additionalProperties = GetAdditionalProperties(type);
	for (const key of Keys$1(value)) {
		if (HasPropertyKey$1(type.properties, key)) {
			value[key] = FromType$5(context, type.properties[key], value[key]);
			continue;
		}
		if (IsBoolean$3(additionalProperties) && IsEqual$1(additionalProperties, true) || IsSchema$1(additionalProperties) && Check(context, additionalProperties, value[key])) {
			value[key] = FromType$5(context, additionalProperties, value[key]);
			continue;
		}
		delete value[key];
	}
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-record.mjs
function FromRecord$5(context, type, value) {
	if (!IsObject$2(value)) return value;
	const additionalProperties = GetAdditionalProperties(type);
	const [recordPattern, recordValue] = [new RegExp(RecordPattern(type)), RecordValue(type)];
	for (const key of Keys$1(value)) {
		if (recordPattern.test(key)) {
			value[key] = FromType$5(context, recordValue, value[key]);
			continue;
		}
		if (IsBoolean$3(additionalProperties) && IsEqual$1(additionalProperties, true) || IsSchema$1(additionalProperties) && Check(context, additionalProperties, value[key])) {
			value[key] = FromType$5(context, additionalProperties, value[key]);
			continue;
		}
		delete value[key];
	}
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-ref.mjs
function FromRef$5(context, type, value) {
	return HasPropertyKey$1(context, type.$ref) ? FromType$5(context, context[type.$ref], value) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-tuple.mjs
function FromTuple$5(context, schema, value) {
	if (!IsArray$2(value)) return value;
	const length = Math.min(value.length, schema.items.length);
	for (let index = 0; index < length; index++) value[index] = FromType$5(context, schema.items[index], value[index]);
	return IsGreaterThan$1(value.length, length) ? value.slice(0, length) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clone/clone.mjs
function FromClassInstance(value) {
	return value;
}
function FromObjectInstance(value) {
	const result = {};
	for (const key of Object.getOwnPropertyNames(value)) result[key] = Clone(value[key]);
	for (const key of Object.getOwnPropertySymbols(value)) result[key] = Clone(value[key]);
	return result;
}
function FromObject$5(value) {
	return IsClassInstance(value) ? FromClassInstance(value) : FromObjectInstance(value);
}
function FromArray$5(value) {
	return value.map((element) => Clone(element));
}
function FromTypedArray(value) {
	return value.slice();
}
function FromMap(value) {
	return new Map(Clone([...value.entries()]));
}
function FromSet(value) {
	return new Set(Clone([...value.values()]));
}
function FromValue(value) {
	return value;
}
/**
* Returns a Clone of the given value. This function is similar to structuredClone()
* but also supports deep cloning instances of Map, Set and TypeArray.
*/
function Clone(value) {
	return IsTypeArray(value) ? FromTypedArray(value) : IsMap(value) ? FromMap(value) : IsSet(value) ? FromSet(value) : IsArray$2(value) ? FromArray$5(value) : IsObject$2(value) ? FromObject$5(value) : FromValue(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-union.mjs
function FromUnion$5(context, type, value) {
	for (const schema of type.anyOf) {
		const clean = FromType$5(context, schema, Clone(value));
		if (Check(context, schema, clean)) return clean;
	}
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/from-type.mjs
function FromType$5(context, type, value) {
	return IsArray(type) ? FromArray$6(context, type, value) : IsBase(type) ? FromBase$3(context, type, value) : IsCyclic(type) ? FromCyclic$5(context, type, value) : IsIntersect(type) ? FromIntersect$5(context, type, value) : IsObject(type) ? FromObject$6(context, type, value) : IsRecord(type) ? FromRecord$5(context, type, value) : IsRef$1(type) ? FromRef$5(context, type, value) : IsTuple(type) ? FromTuple$5(context, type, value) : IsUnion(type) ? FromUnion$5(context, type, value) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/clean/clean.mjs
/**
* Cleans a value by removing non-evaluated properties and elements as derived from the provided type.
* This function returns unknown so callers should Check the return value before use. This function
* mutates the provided value. If mutation is not wanted, you should Clone the value before passing
* to this function.
*/
function Clean(...args) {
	const [context, type, value] = Match$1(args, {
		3: (context, type, value) => [
			context,
			type,
			value
		],
		2: (type, value) => [
			{},
			type,
			value
		]
	});
	return FromType$5(context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-array.mjs
function FromArray$4(context, type, value) {
	return IsArray$2(value) ? value.map((value) => FromType$4(context, type.items, value)) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-base.mjs
function FromBase$2(context, type, value) {
	return type.Convert(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/try/try-result.mjs
function IsOk(value) {
	return IsObject$2(value) && HasPropertyKey$1(value, "value");
}
function Ok(value) {
	return { value };
}
function Fail() {}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/try/try-bigint.mjs
function FromBigInt$7(value) {
	return Ok(value);
}
function FromBoolean$7(value) {
	return IsEqual$1(value, true) ? Ok(BigInt(1)) : Ok(BigInt(0));
}
function FromNumber$7(value) {
	return Ok(BigInt(Math.trunc(value)));
}
function FromNull$7(value) {
	return Ok(BigInt(0));
}
const bigintPattern = /^-?(0|[1-9]\d*)n$/;
const decimalPattern = /^-?(0|[1-9]\d*)\.\d+$/;
const integerPattern = /^-?(0|[1-9]\d*)$/;
function IsStringBigIntLike(value) {
	return bigintPattern.test(value);
}
function IsStringDecimalLike(value) {
	return decimalPattern.test(value);
}
function IsStringIntegerLike(value) {
	return integerPattern.test(value);
}
function FromString$7(value) {
	const lowercase = value.toLowerCase();
	return IsStringBigIntLike(value) ? Ok(BigInt(value.slice(0, value.length - 1))) : IsStringDecimalLike(value) ? Ok(BigInt(value.split(".")[0])) : IsStringIntegerLike(value) ? Ok(BigInt(value)) : IsEqual$1(lowercase, "false") ? Ok(BigInt(0)) : IsEqual$1(lowercase, "true") ? Ok(BigInt(1)) : /* @__PURE__ */ Fail();
}
function FromUndefined$7(value) {
	return Ok(BigInt(0));
}
function TryBigInt(value) {
	return IsBigInt$2(value) ? FromBigInt$7(value) : IsBoolean$3(value) ? FromBoolean$7(value) : IsNumber$3(value) ? FromNumber$7(value) : IsNull$2(value) ? FromNull$7(value) : IsString$3(value) ? FromString$7(value) : IsUndefined$2(value) ? FromUndefined$7(value) : /* @__PURE__ */ Fail();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/try/try-boolean.mjs
function FromBigInt$6(value) {
	return IsEqual$1(value, BigInt(0)) ? Ok(false) : IsEqual$1(value, BigInt(1)) ? Ok(true) : /* @__PURE__ */ Fail();
}
function FromBoolean$6(value) {
	return Ok(value);
}
function FromNumber$6(value) {
	return IsEqual$1(value, 0) ? Ok(false) : IsEqual$1(value, 1) ? Ok(true) : /* @__PURE__ */ Fail();
}
function FromNull$6(value) {
	return Ok(false);
}
function FromString$6(value) {
	return IsEqual$1(value.toLowerCase(), "false") ? Ok(false) : IsEqual$1(value.toLowerCase(), "true") ? Ok(true) : IsEqual$1(value, "0") ? Ok(false) : IsEqual$1(value, "1") ? Ok(true) : /* @__PURE__ */ Fail();
}
function FromUndefined$6(value) {
	return Ok(false);
}
function TryBoolean(value) {
	return IsBigInt$2(value) ? FromBigInt$6(value) : IsBoolean$3(value) ? FromBoolean$6(value) : IsNumber$3(value) ? FromNumber$6(value) : IsNull$2(value) ? FromNull$6(value) : IsString$3(value) ? FromString$6(value) : IsUndefined$2(value) ? FromUndefined$6(value) : /* @__PURE__ */ Fail();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/try/try-null.mjs
function FromBigInt$5(value) {
	return IsEqual$1(value, BigInt(0)) ? Ok(null) : /* @__PURE__ */ Fail();
}
function FromBoolean$5(value) {
	return IsEqual$1(value, false) ? Ok(null) : /* @__PURE__ */ Fail();
}
function FromNumber$5(value) {
	return IsEqual$1(value, 0) ? Ok(null) : /* @__PURE__ */ Fail();
}
function FromNull$5(value) {
	return Ok(null);
}
function FromString$5(value) {
	const lowercase = value.toLowerCase();
	return IsEqual$1(lowercase, "undefined") || IsEqual$1(lowercase, "null") || IsEqual$1(value, "") || IsEqual$1(value, "0") ? Ok(null) : /* @__PURE__ */ Fail();
}
function FromUndefined$5(value) {
	return Ok(null);
}
function TryNull(value) {
	return IsBigInt$2(value) ? FromBigInt$5(value) : IsBoolean$3(value) ? FromBoolean$5(value) : IsNumber$3(value) ? FromNumber$5(value) : IsNull$2(value) ? FromNull$5(value) : IsString$3(value) ? FromString$5(value) : IsUndefined$2(value) ? FromUndefined$5(value) : /* @__PURE__ */ Fail();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/try/try-number.mjs
const maxBigInt = BigInt(Number.MAX_SAFE_INTEGER);
const minBigInt = BigInt(Number.MIN_SAFE_INTEGER);
function CanBigIntDowncast(value) {
	return value <= maxBigInt && value >= minBigInt;
}
function FromBigInt$4(value) {
	return CanBigIntDowncast(value) ? Ok(Number(value)) : /* @__PURE__ */ Fail();
}
function FromBoolean$4(value) {
	return value ? Ok(1) : Ok(0);
}
function FromNumber$4(value) {
	return Ok(value);
}
function FromNull$4(value) {
	return Ok(0);
}
function FromString$4(value) {
	const coerced = +value;
	if (IsNumber$3(coerced)) return Ok(coerced);
	const lowercase = value.toLowerCase();
	if (IsEqual$1(lowercase, "false")) return Ok(0);
	if (IsEqual$1(lowercase, "true")) return Ok(1);
	const result = TryBigInt(value);
	if (IsOk(result)) return FromBigInt$4(result.value);
	return /* @__PURE__ */ Fail();
}
function FromUndefined$4(value) {
	return Ok(0);
}
function TryNumber(value) {
	return IsBigInt$2(value) ? FromBigInt$4(value) : IsBoolean$3(value) ? FromBoolean$4(value) : IsNumber$3(value) ? FromNumber$4(value) : IsNull$2(value) ? FromNull$4(value) : IsString$3(value) ? FromString$4(value) : IsUndefined$2(value) ? FromUndefined$4(value) : /* @__PURE__ */ Fail();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/try/try-string.mjs
function FromBigInt$3(value) {
	return Ok(value.toString());
}
function FromBoolean$3(value) {
	return Ok(value.toString());
}
function FromNumber$3(value) {
	return Ok(value.toString());
}
function FromNull$3(value) {
	return Ok("null");
}
function FromString$3(value) {
	return Ok(value);
}
function FromUndefined$3(value) {
	return Ok("");
}
function TryString(value) {
	return IsBigInt$2(value) ? FromBigInt$3(value) : IsBoolean$3(value) ? FromBoolean$3(value) : IsNumber$3(value) ? FromNumber$3(value) : IsNull$2(value) ? FromNull$3(value) : IsString$3(value) ? FromString$3(value) : IsUndefined$2(value) ? FromUndefined$3(value) : /* @__PURE__ */ Fail();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/try/try-undefined.mjs
function FromBigInt$2(value) {
	return IsEqual$1(value, BigInt(0)) ? Ok(void 0) : /* @__PURE__ */ Fail();
}
function FromBoolean$2(value) {
	return IsEqual$1(value, false) ? Ok(void 0) : /* @__PURE__ */ Fail();
}
function FromNumber$2(value) {
	return IsEqual$1(value, 0) ? Ok(void 0) : /* @__PURE__ */ Fail();
}
function FromNull$2(value) {
	return Ok(void 0);
}
function FromString$2(value) {
	const lowercase = value.toLowerCase();
	return IsEqual$1(lowercase, "undefined") || IsEqual$1(lowercase, "null") || IsEqual$1(value, "") || IsEqual$1(value, "0") ? Ok(void 0) : /* @__PURE__ */ Fail();
}
function FromUndefined$2(value) {
	return Ok(void 0);
}
function TryUndefined(value) {
	return IsBigInt$2(value) ? FromBigInt$2(value) : IsBoolean$3(value) ? FromBoolean$2(value) : IsNumber$3(value) ? FromNumber$2(value) : IsNull$2(value) ? FromNull$2(value) : IsString$3(value) ? FromString$2(value) : IsUndefined$2(value) ? FromUndefined$2(value) : /* @__PURE__ */ Fail();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-bigint.mjs
function FromBigInt$1(context, type, value) {
	if (IsBigInt$2(value)) return value;
	const result = TryBigInt(value);
	return IsOk(result) ? result.value : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-boolean.mjs
function FromBoolean$1(context, type, value) {
	if (IsBoolean$3(value)) return value;
	const result = TryBoolean(value);
	return IsOk(result) ? result.value : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-cyclic.mjs
function FromCyclic$4(context, type, value) {
	return FromType$4({
		...context,
		...type.$defs
	}, Ref$1(type.$ref), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-union.mjs
function FromUnion$4(context, type, value) {
	if (type.anyOf.some((type) => Check(context, type, value))) return value;
	const selected = type.anyOf.map((type) => FromType$4(context, type, Clone(value))).find((value) => Check(context, type, value));
	return IsUndefined$2(selected) ? value : selected;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-enum.mjs
function FromEnum$1(context, type, value) {
	return FromUnion$4(context, EnumToUnion(type), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-integer.mjs
function FromInteger$1(context, type, value) {
	if (IsInteger$2(value)) return value;
	const result = TryNumber(value);
	return IsOk(result) ? Math.trunc(result.value) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-intersect.mjs
function FromIntersect$4(context, type, value) {
	return FromType$4(context, Evaluate(Instantiate(context, type)), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-literal.mjs
function FromLiteralBigInt(context, type, value) {
	const result = TryBigInt(value);
	return IsOk(result) && IsEqual$1(type.const, result.value) ? result.value : value;
}
function FromLiteralBoolean(context, type, value) {
	const result = TryBoolean(value);
	return IsOk(result) && IsEqual$1(type.const, result.value) ? result.value : value;
}
function FromLiteralNumber(context, type, value) {
	const result = TryNumber(value);
	return IsOk(result) && IsEqual$1(type.const, result.value) ? result.value : value;
}
function FromLiteralString(context, type, value) {
	const result = TryString(value);
	return IsOk(result) && IsEqual$1(type.const, result.value) ? result.value : value;
}
function FromLiteral$1(context, type, value) {
	if (IsEqual$1(type.const, value)) return value;
	return IsLiteralBigInt(type) ? FromLiteralBigInt(context, type, value) : IsLiteralBoolean(type) ? FromLiteralBoolean(context, type, value) : IsLiteralNumber(type) ? FromLiteralNumber(context, type, value) : IsLiteralString(type) ? FromLiteralString(context, type, value) : Unreachable();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-null.mjs
function FromNull$1(context, type, value) {
	if (IsNull$2(value)) return value;
	const result = TryNull(value);
	return IsOk(result) ? result.value : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-number.mjs
function FromNumber$1(context, type, value) {
	if (IsNumber$3(value)) return value;
	const result = TryNumber(value);
	return IsOk(result) ? result.value : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-additional.mjs
/**
* Used by Object and Record Types. The entries are derived from the known
* properties obtained from 'properties' and 'patternProperties' respectively.
*/
function FromAdditionalProperties(context, entries, additionalProperties, value) {
	const keys = Keys$1(value);
	for (const [regexp, _] of entries) for (const key of keys) if (!regexp.test(key)) value[key] = FromType$4(context, additionalProperties, value[key]);
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/shared/optional-undefined.mjs
function IsOptionalUndefined(property, key, value) {
	return IsOptional(property) && IsUndefined$2(value[key]);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-object.mjs
function FromProperties(context, type, value) {
	const entries = EntriesRegExp(type.properties);
	const keys = Keys$1(value);
	for (const [regexp, property] of entries) for (const key of keys) {
		if (!regexp.test(key) || IsOptionalUndefined(property, key, value)) continue;
		value[key] = FromType$4(context, property, value[key]);
	}
	return HasPropertyKey$1(type, "additionalProperties") && IsObject$2(type.additionalProperties) ? FromAdditionalProperties(context, entries, type.additionalProperties, value) : value;
}
function FromObject$4(context, type, value) {
	return IsObjectNotArray$1(value) ? FromProperties(context, type, value) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-record.mjs
function FromPatternProperties(context, type, value) {
	const entries = EntriesRegExp(type.patternProperties);
	const keys = Keys$1(value);
	for (const [regexp, schema] of entries) for (const key of keys) if (regexp.test(key)) value[key] = FromType$4(context, schema, value[key]);
	return HasPropertyKey$1(type, "additionalProperties") && IsObject$2(type.additionalProperties) ? FromAdditionalProperties(context, entries, type.additionalProperties, value) : value;
}
function FromRecord$4(context, type, value) {
	return IsObjectNotArray$1(value) ? FromPatternProperties(context, type, value) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-ref.mjs
function FromRef$4(context, type, value) {
	return HasPropertyKey$1(context, type.$ref) ? FromType$4(context, context[type.$ref], value) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-string.mjs
function FromString$1(context, type, value) {
	if (IsString$3(value)) return value;
	const result = TryString(value);
	return IsOk(result) ? result.value : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-template-literal.mjs
function FromTemplateLiteral$1(context, type, value) {
	return FromType$4(context, TemplateLiteralDecode(type.pattern), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-tuple.mjs
function FromTuple$4(context, type, value) {
	if (!IsArray$2(value)) return value;
	for (let index = 0; index < Math.min(type.items.length, value.length); index++) value[index] = FromType$4(context, type.items[index], value[index]);
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-undefined.mjs
function FromUndefined$1(context, type, value) {
	if (IsUndefined$2(value)) return value;
	const result = TryUndefined(value);
	return IsOk(result) ? result.value : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-void.mjs
function FromVoid$1(context, type, value) {
	if (IsUndefined$2(value)) return value;
	const result = TryUndefined(value);
	return IsOk(result) ? void 0 : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/from-type.mjs
function FromType$4(context, type, value) {
	return IsArray(type) ? FromArray$4(context, type, value) : IsBase(type) ? FromBase$2(context, type, value) : IsBigInt(type) ? FromBigInt$1(context, type, value) : IsBoolean(type) ? FromBoolean$1(context, type, value) : IsCyclic(type) ? FromCyclic$4(context, type, value) : IsEnum$1(type) ? FromEnum$1(context, type, value) : IsInteger(type) ? FromInteger$1(context, type, value) : IsIntersect(type) ? FromIntersect$4(context, type, value) : IsLiteral(type) ? FromLiteral$1(context, type, value) : IsNull(type) ? FromNull$1(context, type, value) : IsNumber(type) ? FromNumber$1(context, type, value) : IsObject(type) ? FromObject$4(context, type, value) : IsRecord(type) ? FromRecord$4(context, type, value) : IsRef$1(type) ? FromRef$4(context, type, value) : IsString(type) ? FromString$1(context, type, value) : IsTemplateLiteral(type) ? FromTemplateLiteral$1(context, type, value) : IsTuple(type) ? FromTuple$4(context, type, value) : IsUndefined(type) ? FromUndefined$1(context, type, value) : IsUnion(type) ? FromUnion$4(context, type, value) : IsVoid(type) ? FromVoid$1(context, type, value) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/convert/convert.mjs
/**
* Converts a value to the given type, coercing interior values if a reasonable conversion is possible. This
* function returns unknown so callers should Check the return value before use. This function mutates the
* provided value. If mutation is not wanted, you should Clone the value before passing to this function.
*/
function Convert(...args) {
	const [context, type, value] = Match$1(args, {
		3: (context, type, value) => [
			context,
			type,
			value
		],
		2: (type, value) => [
			{},
			type,
			value
		]
	});
	return FromType$4(context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-array.mjs
function FromArray$3(context, type, value) {
	if (!IsArray$2(value)) return value;
	for (let i = 0; i < value.length; i++) value[i] = FromType$3(context, type.items, value[i]);
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-base.mjs
function FromBase$1(context, type, value) {
	return type.Default(value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-cyclic.mjs
function FromCyclic$3(context, type, value) {
	return FromType$3({
		...context,
		...type.$defs
	}, Ref$1(type.$ref), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-default.mjs
function FromDefault$1(type, value) {
	if (!IsUndefined$2(value)) return value;
	return IsFunction$2(type.default) ? type.default() : Clone(type.default);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-intersect.mjs
function FromIntersect$3(context, type, value) {
	return FromType$3(context, Evaluate(Instantiate(context, type)), value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-object.mjs
function FromObject$3(context, type, value) {
	if (!IsObject$2(value)) return value;
	const knownPropertyKeys = Keys$1(type.properties);
	for (const key of knownPropertyKeys) {
		const propertyValue = FromType$3(context, type.properties[key], value[key]);
		if (IsUndefined$2(propertyValue) && (IsOptional(type.properties[key]) || !HasPropertyKey$1(type.properties[key], "default"))) continue;
		value[key] = FromType$3(context, type.properties[key], value[key]);
	}
	if (!IsAdditionalProperties(type) || IsBoolean$3(type.additionalProperties)) return value;
	for (const key of Keys$1(value)) {
		if (knownPropertyKeys.includes(key)) continue;
		value[key] = FromType$3(context, type.additionalProperties, value[key]);
	}
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-record.mjs
function FromRecord$3(context, type, value) {
	if (!IsObject$2(value)) return value;
	const [recordKey, recordValue] = [new RegExp(RecordPattern(type)), RecordValue(type)];
	for (const key of Keys$1(value)) {
		if (!(recordKey.test(key) && IsDefault(recordValue))) continue;
		value[key] = FromType$3(context, recordValue, value[key]);
	}
	if (!IsAdditionalProperties(type)) return value;
	for (const key of Keys$1(value)) {
		if (recordKey.test(key)) continue;
		value[key] = FromType$3(context, type.additionalProperties, value[key]);
	}
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-ref.mjs
function FromRef$3(context, type, value) {
	return HasPropertyKey$1(context, type.$ref) ? FromType$3(context, context[type.$ref], value) : value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-tuple.mjs
function FromTuple$3(context, schema, value) {
	if (!IsArray$2(value)) return value;
	const [items, max] = [schema.items, Math.max(schema.items.length, value.length)];
	for (let i = 0; i < max; i++) if (i < items.length) value[i] = FromType$3(context, items[i], value[i]);
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-union.mjs
function FromUnion$3(context, schema, value) {
	for (const inner of schema.anyOf) {
		const result = FromType$3(context, inner, Clone(value));
		if (Check(context, inner, result)) return result;
	}
	return value;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/from-type.mjs
function FromType$3(context, type, value) {
	const defaulted = IsDefault(type) ? FromDefault$1(type, value) : value;
	return IsArray(type) ? FromArray$3(context, type, defaulted) : IsBase(type) ? FromBase$1(context, type, defaulted) : IsCyclic(type) ? FromCyclic$3(context, type, defaulted) : IsIntersect(type) ? FromIntersect$3(context, type, defaulted) : IsObject(type) ? FromObject$3(context, type, defaulted) : IsRecord(type) ? FromRecord$3(context, type, defaulted) : IsRef$1(type) ? FromRef$3(context, type, defaulted) : IsTuple(type) ? FromTuple$3(context, type, defaulted) : IsUnion(type) ? FromUnion$3(context, type, defaulted) : defaulted;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/default/default.mjs
/**
* Patches missing properties on the value using default annotations specified on the provided type. This
* function returns unknown so callers should Check the return value before use. This function mutates the
* provided value. If mutation is not wanted, you should Clone the value before passing to this function.
*/
function Default(...args) {
	const [context, type, value] = Match$1(args, {
		3: (context, type, value) => [
			context,
			type,
			value
		],
		2: (type, value) => [
			{},
			type,
			value
		]
	});
	return FromType$3(context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/pipeline/pipeline.mjs
/** Creates a value processing pipeline. */
function Pipeline(pipeline) {
	return (...args) => {
		const [context, type, value] = Match$1(args, {
			3: (context, type, value) => [
				context,
				type,
				value
			],
			2: (type, value) => [
				{},
				type,
				value
			]
		});
		return pipeline.reduce((result, func) => func(context, type, result), value);
	};
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/callback.mjs
function Decode$7(context, type, value) {
	return type["~codec"].decode(value);
}
function Encode$7(context, type, value) {
	return type["~codec"].encode(value);
}
function Callback(direction, context, type, value) {
	if (!IsCodec(type)) return value;
	return IsEqual$1(direction, "Decode") ? Decode$7(context, type, value) : Encode$7(context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-array.mjs
function Decode$6(direction, context, type, value) {
	if (!IsArray$2(value)) return Unreachable();
	for (let i = 0; i < value.length; i++) value[i] = FromType$2(direction, context, type.items, value[i]);
	return Callback(direction, context, type, value);
}
function Encode$6(direction, context, type, value) {
	const exterior = Callback(direction, context, type, value);
	if (!IsArray$2(exterior)) return exterior;
	for (let i = 0; i < exterior.length; i++) exterior[i] = FromType$2(direction, context, type.items, exterior[i]);
	return exterior;
}
function FromArray$2(direction, context, type, value) {
	return IsEqual$1(direction, "Decode") ? Decode$6(direction, context, type, value) : Encode$6(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-cyclic.mjs
function FromCyclic$2(direction, context, type, value) {
	value = FromType$2(direction, {
		...context,
		...type.$defs
	}, Ref$1(type.$ref), value);
	return Callback(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-intersect.mjs
function Decode$5(direction, context, type, value) {
	for (const schema of type.allOf) value = FromType$2(direction, context, schema, value);
	return Callback(direction, context, type, value);
}
function Encode$5(direction, context, type, value) {
	let exterior = Callback(direction, context, type, value);
	for (const schema of type.allOf) exterior = FromType$2(direction, context, schema, exterior);
	return exterior;
}
function FromIntersect$2(direction, context, type, value) {
	return IsEqual$1(direction, "Decode") ? Decode$5(direction, context, type, value) : Encode$5(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-object.mjs
function Decode$4(direction, context, type, value) {
	if (!IsObjectNotArray$1(value)) return Unreachable();
	for (const key of Keys$1(type.properties)) {
		if (!HasPropertyKey$1(value, key) || IsOptionalUndefined(type.properties[key], key, value)) continue;
		value[key] = FromType$2(direction, context, type.properties[key], value[key]);
	}
	return Callback(direction, context, type, value);
}
function Encode$4(direction, context, type, value) {
	const exterior = Callback(direction, context, type, value);
	if (!IsObjectNotArray$1(exterior)) return exterior;
	for (const key of Keys$1(type.properties)) {
		if (!HasPropertyKey$1(exterior, key) || IsOptionalUndefined(type.properties[key], key, exterior)) continue;
		exterior[key] = FromType$2(direction, context, type.properties[key], exterior[key]);
	}
	return exterior;
}
function FromObject$2(direction, context, type, value) {
	return IsEqual$1(direction, "Decode") ? Decode$4(direction, context, type, value) : Encode$4(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-record.mjs
function Decode$3(direction, context, type, value) {
	if (!IsObjectNotArray$1(value)) return Unreachable();
	const regexp = new RegExp(RecordPattern(type));
	for (const key of Keys$1(value)) {
		if (!regexp.test(key)) Unreachable();
		value[key] = FromType$2(direction, context, RecordValue(type), value[key]);
	}
	return Callback(direction, context, type, value);
}
function Encode$3(direction, context, type, value) {
	const exterior = Callback(direction, context, type, value);
	if (!IsObjectNotArray$1(exterior)) return exterior;
	const regexp = new RegExp(RecordPattern(type));
	for (const key of Keys$1(exterior)) {
		if (!regexp.test(key)) continue;
		exterior[key] = FromType$2(direction, context, RecordValue(type), exterior[key]);
	}
	return exterior;
}
function FromRecord$2(direction, context, type, value) {
	return IsEqual$1(direction, "Decode") ? Decode$3(direction, context, type, value) : Encode$3(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-ref.mjs
function FromRef$2(direction, context, type, value) {
	value = HasPropertyKey$1(context, type.$ref) ? FromType$2(direction, context, context[type.$ref], value) : value;
	return Callback(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-tuple.mjs
function Decode$2(direction, context, type, value) {
	if (!IsArray$2(value)) return Unreachable();
	for (let i = 0; i < Math.min(type.items.length, value.length); i++) value[i] = FromType$2(direction, context, type.items[i], value[i]);
	return Callback(direction, context, type, value);
}
function Encode$2(direction, context, type, value) {
	const exterior = Callback(direction, context, type, value);
	if (!IsArray$2(exterior)) return value;
	for (let i = 0; i < Math.min(type.items.length, exterior.length); i++) exterior[i] = FromType$2(direction, context, type.items[i], exterior[i]);
	return exterior;
}
function FromTuple$2(direction, context, type, value) {
	return IsEqual$1(direction, "Decode") ? Decode$2(direction, context, type, value) : Encode$2(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-union.mjs
function Decode$1(direction, context, type, value) {
	for (const schema of type.anyOf) {
		if (!Check(context, schema, value)) continue;
		return Callback(direction, context, type, FromType$2(direction, context, schema, value));
	}
	return Unreachable();
}
function Encode$1(direction, context, type, value) {
	let exterior = Callback(direction, context, type, value);
	for (const schema of type.anyOf) {
		const variant = FromType$2(direction, context, schema, Clone(exterior));
		if (!Check(context, schema, variant)) continue;
		return variant;
	}
	return exterior;
}
function FromUnion$2(direction, context, type, value) {
	return IsEqual$1(direction, "Decode") ? Decode$1(direction, context, type, value) : Encode$1(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/from-type.mjs
function FromType$2(direction, context, type, value) {
	return IsArray(type) ? FromArray$2(direction, context, type, value) : IsCyclic(type) ? FromCyclic$2(direction, context, type, value) : IsIntersect(type) ? FromIntersect$2(direction, context, type, value) : IsObject(type) ? FromObject$2(direction, context, type, value) : IsRecord(type) ? FromRecord$2(direction, context, type, value) : IsRef$1(type) ? FromRef$2(direction, context, type, value) : IsTuple(type) ? FromTuple$2(direction, context, type, value) : IsUnion(type) ? FromUnion$2(direction, context, type, value) : Callback(direction, context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/decode.mjs
var DecodeError = class extends AssertError {
	constructor(value, errors) {
		super("Decode", value, errors);
	}
};
function Assert$2(context, type, value) {
	if (!Check(context, type, value)) throw new DecodeError(value, Errors(context, type, value));
	return value;
}
/** Executes Decode callbacks only */
function DecodeUnsafe(context, type, value) {
	return FromType$2("Decode", context, type, value);
}
const Decoder = Pipeline([
	(_context, _type, value) => Clone(value),
	(context, type, value) => Default(context, type, value),
	(context, type, value) => Convert(context, type, value),
	(context, type, value) => Clean(context, type, value),
	(context, type, value) => Assert$2(context, type, value),
	(context, type, value) => DecodeUnsafe(context, type, value)
]);
/**
* Decodes a value against the given type by applying a sequence of Clone,
* Default, Convert, and Clone operations, then executing any embedded Decode
* callbacks. If the processing sequence fails to produce a value matching the
* provided type, a DecodeError is thrown.
*/
function Decode(...args) {
	const [context, type, value] = Match$1(args, {
		3: (context, type, value) => [
			context,
			type,
			value
		],
		2: (type, value) => [
			{},
			type,
			value
		]
	});
	return Decoder(context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/encode.mjs
var EncodeError = class extends AssertError {
	constructor(value, errors) {
		super("Encode", value, errors);
	}
};
function Assert$1(context, type, value) {
	if (!Check(context, type, value)) throw new EncodeError(value, Errors(context, type, value));
	return value;
}
/** Executes Encode callbacks only */
function EncodeUnsafe(context, type, value) {
	return FromType$2("Encode", context, type, value);
}
const Encoder = Pipeline([
	(_context, _type, value) => Clone(value),
	(context, type, value) => EncodeUnsafe(context, type, value),
	(context, type, value) => Default(context, type, value),
	(context, type, value) => Convert(context, type, value),
	(context, type, value) => Clean(context, type, value),
	(context, type, value) => Assert$1(context, type, value)
]);
/** Encodes a value. */
function Encode(...args) {
	const [context, type, value] = Match$1(args, {
		3: (context, type, value) => [
			context,
			type,
			value
		],
		2: (type, value) => [
			{},
			type,
			value
		]
	});
	return Encoder(context, type, value);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/codec/has.mjs
function FromArray$1(context, type) {
	return IsCodec(type) || FromType$1(context, type.items);
}
function FromCyclic$1(context, type) {
	return IsCodec(type) || FromRef$1({
		...context,
		...type.$defs
	}, Ref$1(type.$ref));
}
function FromIntersect$1(context, type) {
	return IsCodec(type) || type.allOf.some((type) => FromType$1(context, type));
}
function FromObject$1(context, type) {
	return IsCodec(type) || Keys$1(type.properties).some((key) => {
		return FromType$1(context, type.properties[key]);
	});
}
function FromRecord$1(context, type) {
	return IsCodec(type) || FromType$1(context, RecordValue(type));
}
function FromRef$1(context, type) {
	if (visited.has(type.$ref)) return false;
	visited.add(type.$ref);
	return IsCodec(type) || HasPropertyKey$1(context, type.$ref) && FromType$1(context, context[type.$ref]);
}
function FromTuple$1(context, type) {
	return IsCodec(type) || type.items.some((type) => FromType$1(context, type));
}
function FromUnion$1(context, type) {
	return IsCodec(type) || type.anyOf.some((type) => FromType$1(context, type));
}
function FromType$1(context, type) {
	return IsArray(type) ? FromArray$1(context, type) : IsCyclic(type) ? FromCyclic$1(context, type) : IsIntersect(type) ? FromIntersect$1(context, type) : IsObject(type) ? FromObject$1(context, type) : IsRecord(type) ? FromRecord$1(context, type) : IsRef$1(type) ? FromRef$1(context, type) : IsTuple(type) ? FromTuple$1(context, type) : IsUnion(type) ? FromUnion$1(context, type) : IsCodec(type);
}
const visited = /* @__PURE__ */ new Set();
/** Returns true if this type contains a Codec */
function HasCodec(...args) {
	const [context, type] = Match$1(args, {
		2: (context, type) => [context, type],
		1: (type) => [{}, type]
	});
	visited.clear();
	return FromType$1(context, type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/error.mjs
var CreateError = class extends Error {
	constructor(type, message) {
		super(message);
		this.type = type;
	}
};

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-default.mjs
function FromDefault(context, schema) {
	return IsFunction$2(schema.default) ? schema.default(schema) : IsObject$2(schema.default) ? Clone(schema.default) : schema.default;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-array.mjs
function FromArray(context, type) {
	if (IsUniqueItems(type) && !IsDefault(type)) throw new CreateError(type, "Arrays with uniqueItems constraints must specify a default annotation");
	const length = IsMinItems(type) ? type.minItems : 0;
	return Array.from({ length }, () => FromType(context, type.items));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-async-iterator.mjs
async function* CreateAsyncIterator() {}
function FromAsyncIterator(context, type) {
	return CreateAsyncIterator();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-base.mjs
function FromBase(context, type) {
	return type.Create();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-bigint.mjs
function FromBigInt(context, type) {
	return IsExclusiveMinimum(type) ? BigInt(type.exclusiveMinimum) + BigInt(1) : IsMinimum(type) ? BigInt(type.minimum) : BigInt(0);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-boolean.mjs
function FromBoolean(context, type) {
	return false;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-constructor.mjs
function FromConstructor(context, type) {
	const instanceType = FromType(context, type.instanceType);
	return class {
		constructor() {
			Object.assign(this, instanceType);
		}
	};
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-cyclic.mjs
function FromCyclic(context, type) {
	return FromType({
		...context,
		...type.$defs
	}, Ref$1(type.$ref));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-enum.mjs
function FromEnum(context, type) {
	return FromType(context, EnumToUnion(type));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-function.mjs
function FromFunction(context, type) {
	const returnType = FromType(context, type.returnType);
	return () => returnType;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-integer.mjs
function FromInteger(context, type) {
	return IsExclusiveMinimum(type) && IsNumber$3(type.exclusiveMinimum) ? type.exclusiveMinimum + 1 : IsMinimum(type) ? type.minimum : 0;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-intersect.mjs
function FromIntersect(context, type) {
	return FromType(context, Evaluate(Instantiate(context, type)));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-iterator.mjs
function* CreateIterator() {}
function FromIterator(context, type) {
	return CreateIterator();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-literal.mjs
function FromLiteral(context, type) {
	return type.const;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-never.mjs
function FromNever(context, type) {
	throw new CreateError(type, "Cannot create TNever types");
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-null.mjs
function FromNull(context, type) {
	return null;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-number.mjs
function FromNumber(context, type) {
	return IsExclusiveMinimum(type) && IsNumber$3(type.exclusiveMinimum) ? type.exclusiveMinimum + 1 : IsMinimum(type) ? type.minimum : 0;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-object.mjs
function FromObject(context, type) {
	return (IsUndefined$2(type.required) ? [] : type.required).reduce((result, key) => {
		return {
			...result,
			[key]: FromType(context, type.properties[key])
		};
	}, {});
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-promise.mjs
function FromPromise(context, type) {
	return Promise.resolve(FromType(context, type.item));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-record.mjs
function FromRecord(context, type) {
	if (IsMinProperties(type) && !IsDefault(type)) throw new CreateError(type, "Record with the minProperties constraint must have a default annotation");
	return {};
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-ref.mjs
function FromRef(context, type) {
	return HasPropertyKey$1(context, type.$ref) ? FromType(context, context[type.$ref]) : (() => {
		throw new CreateError(type, "Unable to deref Ref");
	})();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-string.mjs
function FromString(context, type) {
	if ((IsPattern(type) || IsFormat(type)) && !IsDefault(type)) throw Error("Strings with format or pattern constraints must specify default");
	const minLength = IsMinLength(type) ? type.minLength : 0;
	return "".padEnd(minLength);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-symbol.mjs
function FromSymbol(context, type) {
	return Symbol();
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-template-literal.mjs
function FromTemplateLiteral(context, type) {
	const decoded = TemplateLiteralDecode(type.pattern);
	if (IsString(decoded)) throw new CreateError(type, "Unable to create TemplateLiteral due to infinite type expansion");
	return FromType(context, decoded);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-tuple.mjs
function FromTuple(context, type) {
	return Array.from({ length: type.minItems }, (_, i) => FromType(context, type.items[i]));
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-undefined.mjs
function FromUndefined(context, type) {}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-union.mjs
function FromUnion(context, type) {
	if (IsEqual$1(type.anyOf.length, 0)) throw Error("Unable to create Union with no variants");
	return FromType(context, type.anyOf[0]);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-void.mjs
function FromVoid(context, type) {}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/from-type.mjs
function FromType(context, type) {
	return IsDefault(type) ? FromDefault(context, type) : IsArray(type) ? FromArray(context, type) : IsAsyncIterator(type) ? FromAsyncIterator(context, type) : IsBase(type) ? FromBase(context, type) : IsBigInt(type) ? FromBigInt(context, type) : IsBoolean(type) ? FromBoolean(context, type) : IsConstructor(type) ? FromConstructor(context, type) : IsCyclic(type) ? FromCyclic(context, type) : IsEnum$1(type) ? FromEnum(context, type) : IsFunction(type) ? FromFunction(context, type) : IsInteger(type) ? FromInteger(context, type) : IsIntersect(type) ? FromIntersect(context, type) : IsIterator(type) ? FromIterator(context, type) : IsLiteral(type) ? FromLiteral(context, type) : IsNever(type) ? FromNever(context, type) : IsNull(type) ? FromNull(context, type) : IsNumber(type) ? FromNumber(context, type) : IsObject(type) ? FromObject(context, type) : IsPromise(type) ? FromPromise(context, type) : IsRecord(type) ? FromRecord(context, type) : IsRef$1(type) ? FromRef(context, type) : IsString(type) ? FromString(context, type) : IsSymbol(type) ? FromSymbol(context, type) : IsTemplateLiteral(type) ? FromTemplateLiteral(context, type) : IsTuple(type) ? FromTuple(context, type) : IsUndefined(type) ? /* @__PURE__ */ FromUndefined(context, type) : IsUnion(type) ? FromUnion(context, type) : IsVoid(type) ? /* @__PURE__ */ FromVoid(context, type) : void 0;
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/create/create.mjs
/** Creates a value from the provided type. This function will use `default` annotations if present. */
function Create(...args) {
	const [context, type] = Match$1(args, {
		2: (context, type) => [context, type],
		1: (type) => [{}, type]
	});
	return FromType(context, type);
}

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/parse/parse.mjs
var ParseError = class extends AssertError {
	constructor(value, errors) {
		super("Parse", value, errors);
	}
};
function Assert(context, type, value) {
	if (!Check(context, type, value)) throw new ParseError(value, Errors(context, type, value));
	return value;
}
const Parser = Pipeline([
	(_context, _type, value) => Clone(value),
	(context, type, value) => Default(context, type, value),
	(context, type, value) => Convert(context, type, value),
	(context, type, value) => Clean(context, type, value),
	(context, type, value) => Assert(context, type, value)
]);

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/value/delta/edit.mjs
const Insert = _Object_({
	type: Literal("insert"),
	path: String$1(),
	value: Unknown()
});
const Update = Object({
	type: Literal("update"),
	path: String$1(),
	value: Unknown()
});
const Delete = _Object_({
	type: Literal("delete"),
	path: String$1()
});
const Edit = Union([
	Insert,
	Update,
	Delete
]);

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/compile/validator.mjs
var Validator = class Validator extends Base {
	/** Constructs a Validator. */
	constructor(...args) {
		super();
		const matched = Match$1(args, {
			6: (context, type, isEvalulated, hasCodec, code, check) => [
				context,
				type,
				isEvalulated,
				hasCodec,
				code,
				check
			],
			2: (context, type) => [context, type]
		});
		if (matched.length === 6) {
			const [context, type, isEvaluated, hasCodec, code, check] = matched;
			this.context = context;
			this.type = type;
			this.isEvaluated = isEvaluated;
			this.hasCodec = hasCodec;
			this.code = code;
			this.check = check;
		} else {
			const [context, type] = matched;
			const result = Build(context, type).Evaluate();
			this.hasCodec = HasCodec(context, type);
			this.context = context;
			this.type = type;
			this.isEvaluated = result.IsEvaluated;
			this.code = result.Code;
			this.check = result.Check;
		}
	}
	/** Returns true if this validator is using runtime eval optimizations. */
	IsEvaluated() {
		return this.isEvaluated;
	}
	/** Returns the Context for this validator. */
	Context() {
		return this.context;
	}
	/** Returns the Type for this validator. */
	Type() {
		return this.type;
	}
	/** Returns the generated code for this validator. */
	Code() {
		return this.code;
	}
	/** Checks a value matches the Validator type. */
	Check(value) {
		return this.check(value);
	}
	/** Returns errors for the given value. */
	Errors(value) {
		if (CanEvaluate() && this.check(value)) return [];
		return Errors(this.context, this.type, value);
	}
	/** Cleans a value using the Validator type. */
	Clean(value) {
		return Clean(this.context, this.type, value);
	}
	/** Converts a value using the Validator type. */
	Convert(value) {
		return Convert(this.context, this.type, value);
	}
	/** Creates a value using the Validator type. */
	Create() {
		return Create(this.context, this.type);
	}
	/** Creates defaults using the Validator type. */
	Default(value) {
		return Default(this.context, this.type, value);
	}
	/** Clones this validator. */
	Clone() {
		return new Validator(this.context, this.type, this.isEvaluated, this.hasCodec, this.code, this.check);
	}
	/** Parses a value */
	Parse(value) {
		return this.Check(value) ? value : Parser(this.context, this.type, value);
	}
	/** Decodes a value */
	Decode(value) {
		return this.hasCodec ? Decode(this.context, this.type, value) : this.Parse(value);
	}
	/** Encodes a value */
	Encode(value) {
		return this.hasCodec ? Encode(this.context, this.type, value) : this.Parse(value);
	}
};

//#endregion
//#region ../node_modules/.pnpm/typebox@1.0.81/node_modules/typebox/build/compile/compile.mjs
/** Compiles a type into a high performance Validator */
function Compile(...args) {
	const [context, type] = Match$1(args, {
		2: (context, type) => [context, type],
		1: (type) => [{}, type]
	});
	return new Validator(context, type);
}

//#endregion
//#region ../schemas/libraries/typebox/download/compile.ts
const Timestamp = Codec(Number$1()).Decode((value) => new Date(value)).Encode((value) => value.getTime());
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
	images: Array$1(Image)
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
	tags: Array$1(String$1({
		minLength: 1,
		maxLength: 30
	})),
	images: Array$1(Image),
	ratings: Array$1(Rating)
})).Parse({});

//#endregion