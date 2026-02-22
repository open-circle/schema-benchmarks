/** TypeBox instantiation metrics */
const Metrics = {
	assign: 0,
	create: 0,
	clone: 0,
	discard: 0,
	update: 0
};
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
/** Returns true if this value is an array */
function IsArray(value) {
	return Array.isArray(value);
}
/** Returns true if this value is an async iterator */
function IsAsyncIterator(value) {
	return IsObject(value) && Symbol.asyncIterator in value;
}
/** Returns true if this value is bigint */
function IsBigInt(value) {
	return IsEqual(typeof value, "bigint");
}
/** Returns true if this value is a boolean */
function IsBoolean$1(value) {
	return IsEqual(typeof value, "boolean");
}
/** Returns true if this value is a constructor */
function IsConstructor(value) {
	if (IsUndefined(value) || !IsFunction(value)) return false;
	const result = Function.prototype.toString.call(value);
	if (/^class\s/.test(result)) return true;
	if (/\[native code\]/.test(result)) return true;
	return false;
}
/** Returns true if this value is a function */
function IsFunction(value) {
	return IsEqual(typeof value, "function");
}
/** Returns true if this value is integer */
function IsInteger(value) {
	return Number.isInteger(value);
}
/** Returns true if this value is an iterator */
function IsIterator(value) {
	return IsObject(value) && Symbol.iterator in value;
}
/** Returns true if this value is null */
function IsNull(value) {
	return IsEqual(value, null);
}
/** Returns true if this value is number */
function IsNumber$1(value) {
	return Number.isFinite(value);
}
/** Returns true if this value is an object but not an array */
function IsObjectNotArray(value) {
	return IsObject(value) && !IsArray(value);
}
/** Returns true if this value is an object */
function IsObject(value) {
	return IsEqual(typeof value, "object") && !IsNull(value);
}
/** Returns true if this value is string */
function IsString$1(value) {
	return IsEqual(typeof value, "string");
}
/** Returns true if this value is symbol */
function IsSymbol(value) {
	return IsEqual(typeof value, "symbol");
}
/** Returns true if this value is undefined */
function IsUndefined(value) {
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
	if (IsBigInt(dividend) || IsBigInt(divisor)) return BigInt(dividend) % BigInt(divisor) === 0n;
	const tolerance = 1e-10;
	if (!IsNumber$1(dividend)) return true;
	if (IsInteger(dividend) && 1 / divisor % 1 === 0) return true;
	const mod = dividend % divisor;
	return Math.min(Math.abs(mod), Math.abs(mod - divisor)) < tolerance;
}
function IsValueLike(value) {
	return IsBigInt(value) || IsBoolean$1(value) || IsNull(value) || IsNumber$1(value) || IsString$1(value) || IsUndefined(value);
}
/** Returns true if the string has at most the given number of graphemes */
function IsMaxLength$1(value, length) {
	return IsMaxLengthFast(value, length);
}
/** Returns true if the string has at least the given number of graphemes */
function IsMinLength$1(value, length) {
	return IsMinLengthFast(value, length);
}
function Every(value, offset, callback) {
	for (let index = offset; index < value.length; index++) if (!callback(value[index], index)) return false;
	return true;
}
function EveryAll(value, offset, callback) {
	let result = true;
	for (let index = offset; index < value.length; index++) if (!callback(value[index], index)) result = false;
	return result;
}
/** Returns true if this value has this property key */
function HasPropertyKey(value, key) {
	return IsEqual(key, "__proto__") || IsEqual(key, "constructor") ? Object.prototype.hasOwnProperty.call(value, key) : key in value;
}
/** Returns object entries as `[string, Value][]` */
function Entries(value) {
	return Object.entries(value);
}
/** Returns the property keys for this object via `Object.getOwnPropertyKeys({ ... })` */
function Keys(value) {
	return Object.getOwnPropertyNames(value);
}
function DeepEqualObject(left, right) {
	if (!IsObject(right)) return false;
	const keys = Keys(left);
	return IsEqual(keys.length, Keys(right).length) && keys.every((key) => IsDeepEqual(left[key], right[key]));
}
function DeepEqualArray(left, right) {
	return IsArray(right) && IsEqual(left.length, right.length) && left.every((_, index) => IsDeepEqual(left[index], right[index]));
}
/** Tests values for deep equality */
function IsDeepEqual(left, right) {
	return IsArray(left) ? DeepEqualArray(left, right) : IsObject(left) ? DeepEqualObject(left, right) : IsEqual(left, right);
}
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
function IsGuard$1(value) {
	return IsObject(value) && HasPropertyKey(value, "~guard");
}
function FromGuard(value) {
	return value;
}
function FromArray$2(value) {
	return value.map((value) => FromValue$2(value));
}
function FromObject$2(value) {
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
	return value instanceof RegExp ? FromRegExp$1(value) : IsGuard$1(value) ? FromGuard(value) : IsArray(value) ? FromArray$2(value) : IsObject(value) ? FromObject$2(value) : FromUnknown(value);
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
const settings = {
	immutableTypes: false,
	maxErrors: 8,
	useEval: true,
	exactOptionalPropertyTypes: false,
	enumerableKind: false,
	correctiveParse: false
};
/** Gets current system settings */
function Get$2() {
	return settings;
}
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
function Create(hidden, enumerable, options = {}) {
	Metrics.create += 1;
	const settings = Get$2();
	const withOptions = Merge(enumerable, options);
	const withHidden = settings.enumerableKind ? Merge(withOptions, hidden) : MergeHidden(withOptions, hidden);
	return settings.immutableTypes ? Object.freeze(withHidden) : withHidden;
}
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
function IsSchema$1(value) {
	return IsObject(value);
}
/** Returns true if the given value is TOptional */
function IsOptional(value) {
	return IsSchema$1(value) && HasPropertyKey(value, "~optional");
}
/** Creates an Array type. */
function Array$1(items, options) {
	return Create({ "~kind": "Array" }, {
		type: "array",
		items
	}, options);
}
/**
* Match arguments for overloaded functions that use the `...args: unknown[]` pattern. Arguments
* are parsed using argument length only.
*/
function Match$1(args, match) {
	return match[args.length]?.(...args) ?? (() => {
		throw Error("Invalid Arguments");
	})();
}
function IsTypeScriptEnumLike(value) {
	return IsObjectNotArray(value);
}
function TypeScriptEnumToEnumValues(type) {
	return Keys(type).filter((key) => isNaN(key)).reduce((result, key) => [...result, type[key]], []);
}
/** Creates an Enum type. */
function Enum(value, options) {
	const values = IsTypeScriptEnumLike(value) ? TypeScriptEnumToEnumValues(value) : value;
	return Create({ "~kind": "Enum" }, { enum: values }, options);
}
/** Used for unreachable logic */
function Unreachable() {
	throw new Error("Unreachable");
}
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
	return IsTypeArray(value) ? FromTypeArray(value) : IsDate$1(value) ? FromDate(value) : IsRegExp(value) ? FromRegExp(value) : IsBoolean(value) ? FromBoolean(value.valueOf()) : IsString(value) ? FromString(value.valueOf()) : IsNumber(value) ? FromNumber(value.valueOf()) : IsIEEE754(value) ? FromNumber(value) : IsArray(value) ? FromArray$1(value) : IsBoolean$1(value) ? FromBoolean(value) : IsBigInt(value) ? FromBigInt(value) : IsConstructor(value) ? FromConstructor(value) : IsNull(value) ? FromNull(value) : IsObject(value) ? FromObject$1(value) : IsString$1(value) ? FromString(value) : IsSymbol(value) ? FromSymbol(value) : IsUndefined(value) ? FromUndefined(value) : IsFunction(value) ? FromFunction(value) : Unreachable();
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
let locale = en_US;
/** Gets the locale */
function Get$1() {
	return locale;
}
/** Applies a Refine check to the given type. */
function RefineAdd(type, refinement) {
	const refinements = IsRefine$1(type) ? [...type["~refine"], refinement] : [refinement];
	return Update(type, { "~refine": refinements }, {});
}
/** Applies a Refine check to the given type. */
function Refine(type, refine, message = "error") {
	return RefineAdd(type, {
		refine,
		message
	});
}
/** Returns true if the given value is a TRefine. */
function IsRefine$1(value) {
	return IsSchema$1(value) && HasPropertyKey(value, "~refine");
}
const IntegerPattern = "-?(?:0|[1-9][0-9]*)";
/** Creates a Null type. */
function Null(options) {
	return Create({ "~kind": "Null" }, { type: "null" }, options);
}
const NumberPattern = "-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?";
/** Creates a Number type. */
function Number$1(options) {
	return Create({ "~kind": "Number" }, { type: "number" }, options);
}
/** Creates a RequiredArray derived from the given TProperties value. */
function RequiredArray(properties) {
	return Keys(properties).filter((key) => !IsOptional(properties[key]));
}
/** Creates an Object type. */
function _Object_(properties, options = {}) {
	const requiredKeys = RequiredArray(properties);
	const required = requiredKeys.length > 0 ? { required: requiredKeys } : {};
	return Create({ "~kind": "Object" }, {
		type: "object",
		...required,
		properties
	}, options);
}
const StringPattern = ".*";
/** Creates a String type. */
function String$1(options) {
	return Create({ "~kind": "String" }, { type: "string" }, options);
}
/** Creates a Union type. */
function Union(anyOf, options = {}) {
	return Create({ "~kind": "Union" }, { anyOf }, options);
}
`${IntegerPattern}`;
`${NumberPattern}`;
`${StringPattern}`;
/** Creates a Unsafe type. */
function Unsafe(schema) {
	return Create({ ["~kind"]: "Unsafe" }, {}, schema);
}
function Range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));
}
const Alpha = [...Range(97, 122), ...Range(65, 90)];
const Digit = ["0", ...Range(49, 57)];
const UnderScore = "_";
const DollarSign = "$";
[...Digit];
[...[
	...Alpha,
	UnderScore,
	DollarSign
], ...Digit];
[...Digit];
function IsGuardInterface(value) {
	return IsObject(value) && HasPropertyKey(value, "check") && HasPropertyKey(value, "errors") && IsFunction(value.check) && IsFunction(value.errors);
}
function IsGuard(value) {
	return HasPropertyKey(value, "~guard") && IsGuardInterface(value["~guard"]);
}
/**
* Returns true if the schema contains an '~refine` keyword
* @specification None
*/
function IsRefine(value) {
	return HasPropertyKey(value, "~refine") && IsArray(value["~refine"]) && Every(value["~refine"], 0, (value) => IsObject(value) && HasPropertyKey(value, "refine") && HasPropertyKey(value, "message") && IsFunction(value.refine) && IsString$1(value.message));
}
/** Returns true if this value is object like */
function IsSchemaObject(value) {
	return IsObject(value) && !IsArray(value);
}
/** Returns true if this value is a boolean */
function IsBooleanSchema(value) {
	return IsBoolean$1(value);
}
/** Returns true if this value is schema like */
function IsSchema(value) {
	return IsSchemaObject(value) || IsBooleanSchema(value);
}
/**
* Returns true if the schema contains a valid additionalItems property
* @specification Json Schema 7
*/
function IsAdditionalItems(schema) {
	return HasPropertyKey(schema, "additionalItems") && IsSchema(schema.additionalItems);
}
/**
* Returns true if the schema contains a valid additionalProperties property
* @specification Json Schema 7
*/
function IsAdditionalProperties(schema) {
	return HasPropertyKey(schema, "additionalProperties") && IsSchema(schema.additionalProperties);
}
/**
* Returns true if the schema contains a valid allOf property
* @specification Json Schema 7
*/
function IsAllOf(schema) {
	return HasPropertyKey(schema, "allOf") && IsArray(schema.allOf) && schema.allOf.every((value) => IsSchema(value));
}
/**
* Returns true if the schema contains a valid $anchor property
*/
function IsAnchor(schema) {
	return HasPropertyKey(schema, "$anchor") && IsString$1(schema.$anchor);
}
/**
* Returns true if the schema contains a valid anyOf property
* @specification Json Schema 7
*/
function IsAnyOf(schema) {
	return HasPropertyKey(schema, "anyOf") && IsArray(schema.anyOf) && schema.anyOf.every((value) => IsSchema(value));
}
/**
* Returns true if the schema contains a valid const property
* @specification Json Schema 7
*/
function IsConst(value) {
	return HasPropertyKey(value, "const");
}
/**
* Returns true if the schema contains a valid contains property
* @specification Json Schema 7
*/
function IsContains(schema) {
	return HasPropertyKey(schema, "contains") && IsSchema(schema.contains);
}
/**
* Returns true if the schema contains a valid dependencies property
* @specification Json Schema 7
*/
function IsDependencies(schema) {
	return HasPropertyKey(schema, "dependencies") && IsObject(schema.dependencies) && Object.values(schema.dependencies).every((value) => IsSchema(value) || IsArray(value) && value.every((value) => IsString$1(value)));
}
/**
* Returns true if the schema contains a valid dependentRequired property
* @specification Json Schema 2019-09
*/
function IsDependentRequired(schema) {
	return HasPropertyKey(schema, "dependentRequired") && IsObject(schema.dependentRequired) && Object.values(schema.dependentRequired).every((value) => IsArray(value) && value.every((value) => IsString$1(value)));
}
/**
* Returns true if the schema contains a valid dependentRequired property
* @specification Json Schema 2019-09
*/
function IsDependentSchemas(schema) {
	return HasPropertyKey(schema, "dependentSchemas") && IsObject(schema.dependentSchemas) && Object.values(schema.dependentSchemas).every((value) => IsSchema(value));
}
/**
* Returns true if the schema contains a valid $dynamicAnchor property
*/
function IsDynamicAnchor(schema) {
	return HasPropertyKey(schema, "$dynamicAnchor") && IsString$1(schema.$dynamicAnchor);
}
/**
* Returns true if the schema contains a valid else property
* @specification Json Schema 7
*/
function IsElse(schema) {
	return HasPropertyKey(schema, "else") && IsSchema(schema.else);
}
/**
* Returns true if the schema contains a valid enum property
* @specification Json Schema 7
*/
function IsEnum(schema) {
	return HasPropertyKey(schema, "enum") && IsArray(schema.enum);
}
/**
* Returns true if the schema contains a valid exclusiveMaximum property
* @specification Json Schema 7
*/
function IsExclusiveMaximum(schema) {
	return HasPropertyKey(schema, "exclusiveMaximum") && (IsNumber$1(schema.exclusiveMaximum) || IsBigInt(schema.exclusiveMaximum));
}
/**
* Returns true if the schema contains a valid exclusiveMinimum property
* @specification Json Schema 7
*/
function IsExclusiveMinimum(schema) {
	return HasPropertyKey(schema, "exclusiveMinimum") && (IsNumber$1(schema.exclusiveMinimum) || IsBigInt(schema.exclusiveMinimum));
}
/**
* Returns true if the schema contains a valid format property
* @specification Json Schema 7
*/
function IsFormat(schema) {
	return HasPropertyKey(schema, "format") && IsString$1(schema.format);
}
/**
* Returns true if the schema contains a valid $id property
* @specification Json Schema 7
*/
function IsId(schema) {
	return HasPropertyKey(schema, "$id") && IsString$1(schema.$id);
}
/**
* Returns true if the schema contains a valid $id property
* @specification Json Schema 7
*/
function IsIf(schema) {
	return HasPropertyKey(schema, "if") && IsSchema(schema.if);
}
/**
* Returns true if the schema contains a valid items property
* @specification Json Schema 7
*/
function IsItems(schema) {
	return HasPropertyKey(schema, "items") && (IsSchema(schema.items) || IsArray(schema.items) && schema.items.every((value) => {
		return IsSchema(value);
	}));
}
/** Returns true if this schema is a sized items variant */
function IsItemsSized(schema) {
	return IsItems(schema) && IsArray(schema.items);
}
/**
* Returns true if the schema contains a valid maximum property
* @specification Json Schema 7
*/
function IsMaximum(schema) {
	return HasPropertyKey(schema, "maximum") && (IsNumber$1(schema.maximum) || IsBigInt(schema.maximum));
}
/**
* Returns true if the schema contains a valid maxContains property
* @specification Json Schema 2019-09
*/
function IsMaxContains(schema) {
	return HasPropertyKey(schema, "maxContains") && IsNumber$1(schema.maxContains);
}
/**
* Returns true if the schema contains a valid maxItems property
* @specification Json Schema 7
*/
function IsMaxItems(schema) {
	return HasPropertyKey(schema, "maxItems") && IsNumber$1(schema.maxItems);
}
/**
* Returns true if the schema contains a valid maxLength property
* @specification Json Schema 7
*/
function IsMaxLength(schema) {
	return HasPropertyKey(schema, "maxLength") && IsNumber$1(schema.maxLength);
}
/**
* Returns true if the schema contains a valid maxProperties property
* @specification Json Schema 7
*/
function IsMaxProperties(schema) {
	return HasPropertyKey(schema, "maxProperties") && IsNumber$1(schema.maxProperties);
}
/**
* Returns true if the schema contains a valid minimum property
* @specification Json Schema 7
*/
function IsMinimum(schema) {
	return HasPropertyKey(schema, "minimum") && (IsNumber$1(schema.minimum) || IsBigInt(schema.minimum));
}
/**
* Returns true if the schema contains a valid maxContains property
* @specification Json Schema 2019-09
*/
function IsMinContains(schema) {
	return HasPropertyKey(schema, "minContains") && IsNumber$1(schema.minContains);
}
/**
* Returns true if the schema contains a valid minItems property
* @specification Json Schema 7
*/
function IsMinItems(schema) {
	return HasPropertyKey(schema, "minItems") && IsNumber$1(schema.minItems);
}
/**
* Returns true if the schema contains a valid minLength property
* @specification Json Schema 7
*/
function IsMinLength(schema) {
	return HasPropertyKey(schema, "minLength") && IsNumber$1(schema.minLength);
}
/**
* Returns true if the schema contains a valid minProperties property
* @specification Json Schema 7
*/
function IsMinProperties(schema) {
	return HasPropertyKey(schema, "minProperties") && IsNumber$1(schema.minProperties);
}
/**
* Returns true if the schema contains a valid multipleOf property
* @specification Json Schema 7
*/
function IsMultipleOf(schema) {
	return HasPropertyKey(schema, "multipleOf") && (IsNumber$1(schema.multipleOf) || IsBigInt(schema.multipleOf));
}
/**
* Returns true if the schema contains a valid not property
* @specification Json Schema 7
*/
function IsNot(schema) {
	return HasPropertyKey(schema, "not") && IsSchema(schema.not);
}
/**
* Returns true if the schema contains a valid oneOf property
* @specification Json Schema 7
*/
function IsOneOf(schema) {
	return HasPropertyKey(schema, "oneOf") && IsArray(schema.oneOf) && schema.oneOf.every((value) => IsSchema(value));
}
/**
* Returns true if the schema contains a valid pattern property
* @specification Json Schema 7
*/
function IsPattern(schema) {
	return HasPropertyKey(schema, "pattern") && (IsString$1(schema.pattern) || schema.pattern instanceof RegExp);
}
/**
* Returns true if the schema contains a valid patternProperties property
* @specification Json Schema 7
*/
function IsPatternProperties(schema) {
	return HasPropertyKey(schema, "patternProperties") && IsObject(schema.patternProperties) && Object.values(schema.patternProperties).every((value) => IsSchema(value));
}
/**
* Returns true if the schema contains a valid prefixItems property
*/
function IsPrefixItems(schema) {
	return HasPropertyKey(schema, "prefixItems") && IsArray(schema.prefixItems) && schema.prefixItems.every((schema) => IsSchema(schema));
}
/**
* Returns true if the schema contains a valid properties property
* @specification Json Schema 7
*/
function IsProperties(schema) {
	return HasPropertyKey(schema, "properties") && IsObject(schema.properties) && Object.values(schema.properties).every((value) => IsSchema(value));
}
/**
* Returns true if the schema contains a valid propertyNames property
* @specification Json Schema 7
*/
function IsPropertyNames(schema) {
	return HasPropertyKey(schema, "propertyNames") && (IsObject(schema.propertyNames) || IsSchema(schema.propertyNames));
}
/**
* Returns true if the schema contains a valid $recursiveAnchor property
*/
function IsRecursiveAnchor(schema) {
	return HasPropertyKey(schema, "$recursiveAnchor") && IsBoolean$1(schema.$recursiveAnchor);
}
/**
* Returns true if the schema contains a valid $recursiveAnchor property that is true
*/
function IsRecursiveAnchorTrue(schema) {
	return IsRecursiveAnchor(schema) && IsEqual(schema.$recursiveAnchor, true);
}
/**
* Returns true if the schema contains a valid $recursiveRef property
*/
function IsRecursiveRef(schema) {
	return HasPropertyKey(schema, "$recursiveRef") && IsString$1(schema.$recursiveRef);
}
/**
* Returns true if the schema contains a valid $ref property
* @specification Json Schema 7
*/
function IsRef(schema) {
	return HasPropertyKey(schema, "$ref") && IsString$1(schema.$ref);
}
/**
* Returns true if the schema contains a valid required property
* @specification Json Schema 7
*/
function IsRequired(schema) {
	return HasPropertyKey(schema, "required") && IsArray(schema.required) && schema.required.every((value) => IsString$1(value));
}
/**
* Returns true if the schema contains a valid then property
* @specification Json Schema 7
*/
function IsThen(schema) {
	return HasPropertyKey(schema, "then") && IsSchema(schema.then);
}
/**
* Returns true if the schema contains a valid type property
* @specification Json Schema 7
*/
function IsType(schema) {
	return HasPropertyKey(schema, "type") && (IsString$1(schema.type) || IsArray(schema.type) && schema.type.every((value) => IsString$1(value)));
}
/**
* Returns true if the schema contains a valid uniqueItems property
* @specification Json Schema 7
*/
function IsUniqueItems(schema) {
	return HasPropertyKey(schema, "uniqueItems") && IsBoolean$1(schema.uniqueItems);
}
/**
* Returns true if the schema contains a valid unevaluatedItems property
* @specification Json Schema 2019-09
*/
function IsUnevaluatedItems(schema) {
	return HasPropertyKey(schema, "unevaluatedItems") && IsSchema(schema.unevaluatedItems);
}
/**
* Returns true if the schema contains a valid unevaluatedProperties property
* @specification Json Schema 2019-09
*/
function IsUnevaluatedProperties(schema) {
	return HasPropertyKey(schema, "unevaluatedProperties") && IsSchema(schema.unevaluatedProperties);
}
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
function CheckRefine(stack, context, schema, value) {
	return Every(schema["~refine"], 0, (refinement, _) => refinement.refine(value));
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
function IsValid$4(schema) {
	return IsItems(schema) && IsArray(schema.items);
}
function CheckAdditionalItems(stack, context, schema, value) {
	if (!IsValid$4(schema)) return true;
	return value.every((item, index) => {
		return IsLessThan(index, schema.items.length) || CheckSchema(stack, context, schema.additionalItems, item) && context.AddIndex(index);
	});
}
function ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value) {
	if (!IsValid$4(schema)) return true;
	return value.every((item, index) => {
		const nextSchemaPath = `${schemaPath}/additionalItems`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessThan(index, schema.items.length) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema.additionalItems, item) && context.AddIndex(index);
	});
}
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
		return regexp.test(key) || CheckSchema(stack, context, schema.additionalProperties, value[key]) && context.AddKey(key);
	});
}
function ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value) {
	const regexp = new RegExp(GetPropertiesPattern(schema));
	const additionalProperties = [];
	return EveryAll(Keys(value), 0, (key, _index) => {
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
function CheckAnyOf(stack, context, schema, value) {
	const results = schema.anyOf.reduce((result, schema, index) => {
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
function CheckConst(stack, context, schema, value) {
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
function CheckDependencies(stack, context, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEvery = Every(Entries(schema.dependencies), 0, ([key, schema]) => {
		return !HasPropertyKey(value, key) || (IsArray(schema) ? schema.every((key) => HasPropertyKey(value, key)) : CheckSchema(stack, context, schema, value));
	});
	return isLength || isEvery;
}
function ErrorDependencies(stack, context, schemaPath, instancePath, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEvery = EveryAll(Entries(schema.dependencies), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/dependencies/${key}`;
		return !HasPropertyKey(value, key) || (IsArray(schema) ? schema.every((dependency) => HasPropertyKey(value, dependency) || context.AddError({
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
function CheckDependentRequired(stack, context, schema, value) {
	const isLength = IsEqual(Keys(value).length, 0);
	const isEvery = Every(Entries(schema.dependentRequired), 0, ([key, keys]) => {
		return !HasPropertyKey(value, key) || keys.every((key) => HasPropertyKey(value, key));
	});
	return isLength || isEvery;
}
function ErrorDependentRequired(stack, context, schemaPath, instancePath, schema, value) {
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
function CheckEnum(stack, context, schema, value) {
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
function CheckExclusiveMaximum(stack, context, schema, value) {
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
function CheckExclusiveMinimum(stack, context, schema, value) {
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
/**
* Returns true if the value is a ISO8601 DateTime string
* @source ajv-formats
* @example `2020-12-12T20:20:40+00:00`
*/
function IsDateTime(value, strictTimeZone = true) {
	const dateTime = value.split(/T/i);
	return dateTime.length === 2 && IsDate(dateTime[0]) && IsTime(dateTime[1], strictTimeZone);
}
const Duration = /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/;
/**
* Returns true if the value is a Duration string
* @source ajv-formats
*/
function IsDuration(value) {
	return Duration.test(value);
}
const Email = /^(?!.*\.\.)[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/** Returns true if the value is an Email */
function IsEmail(value) {
	return Email.test(value);
}
const Hostname = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i;
/** Returns true if the value is a Hostname */
function IsHostname(value) {
	return Hostname.test(value);
}
const IdnEmail = /^(?!.*\.\.)[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+(?:\.[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+)*@[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?(?:\.[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?)*$/iu;
/** Returns true if the value is a Idn Email */
function IsIdnEmail(value) {
	return IdnEmail.test(value);
}
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
const IPv4 = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
/**
* Returns true if the value is a IPV4 address
* @source ajv-formats
* @specification http://tools.ietf.org/html/rfc2673#section-3.2
*/
function IsIPv4(value) {
	return IPv4.test(value);
}
const IPv6 = /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i;
/**
* Returns true if the value is a IPV6 address
* @source ajv-formats
* @specification http://tools.ietf.org/html/rfc2373#section-2.2
*/
function IsIPv6(value) {
	return IPv6.test(value);
}
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
const JsonPointerUriFragment = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i;
/**
* Returns true if the value is a json pointer uri fragment
* @specification
* @source ajv-formats
*/
function IsJsonPointerUriFragment(value) {
	return JsonPointerUriFragment.test(value);
}
const JsonPointer = /^(?:\/(?:[^~/]|~0|~1)*)*$/;
/**
* Returns true if the value is a json pointer
* @specification
* @source ajv-formats
*/
function IsJsonPointer(value) {
	return JsonPointer.test(value);
}
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
const RelativeJsonPointer = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
/**
* Returns true if the value is a relative json pointer
* @specification
* @source ajv-formats
*/
function IsRelativeJsonPointer(value) {
	return RelativeJsonPointer.test(value);
}
const UriReference = /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i;
/**
* Returns true if the value is a uri reference
* @specification
* @source ajv-formats
*/
function IsUriReference(value) {
	return UriReference.test(value);
}
const UriTemplate = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
/**
* Returns true if the value is a uri template
* @specification
* @source ajv-formats
*/
function IsUriTemplate(value) {
	return UriTemplate.test(value);
}
const Uri = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i;
/**
* Returns true if the value is a uri
* @specification
* @source ajv-formats
*/
function IsUri(value) {
	return Uri.test(value);
}
const Url = /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
/**
* Returns true if the value is a Url
* @specification
* @source ajv-formats
*/
function IsUrl(value) {
	return Url.test(value);
}
const Uuid = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
/**
* Returns true if the value is a uuid
* @specification
* @source ajv-formats
*/
function IsUuid(value) {
	return Uuid.test(value);
}
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
function CheckItemsSized(stack, context, schema, value) {
	return Every(schema.items, 0, (schema, index) => {
		return IsLessEqualThan(value.length, index) || CheckSchema(stack, context, schema, value[index]) && context.AddIndex(index);
	});
}
function ErrorItemsSized(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(schema.items, 0, (schema, index) => {
		const nextSchemaPath = `${schemaPath}/items/${index}`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessEqualThan(value.length, index) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index);
	});
}
function CheckItemsUnsized(stack, context, schema, value) {
	return Every(value, IsPrefixItems(schema) ? schema.prefixItems.length : 0, (element, index) => {
		return CheckSchema(stack, context, schema.items, element) && context.AddIndex(index);
	});
}
function ErrorItemsUnsized(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(value, IsPrefixItems(schema) ? schema.prefixItems.length : 0, (element, index) => {
		return ErrorSchema(stack, context, `${schemaPath}/items`, `${instancePath}/${index}`, schema.items, element) && context.AddIndex(index);
	});
}
function CheckItems(stack, context, schema, value) {
	return IsItemsSized(schema) ? CheckItemsSized(stack, context, schema, value) : CheckItemsUnsized(stack, context, schema, value);
}
function ErrorItems(stack, context, schemaPath, instancePath, schema, value) {
	return IsItemsSized(schema) ? ErrorItemsSized(stack, context, schemaPath, instancePath, schema, value) : ErrorItemsUnsized(stack, context, schemaPath, instancePath, schema, value);
}
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
function CheckMaximum(stack, context, schema, value) {
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
function CheckMaxItems(stack, context, schema, value) {
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
function CheckMaxLength(stack, context, schema, value) {
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
function CheckMaxProperties(stack, context, schema, value) {
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
function CheckMinimum(stack, context, schema, value) {
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
function CheckMinItems(stack, context, schema, value) {
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
function CheckMinLength(stack, context, schema, value) {
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
function CheckMinProperties(stack, context, schema, value) {
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
function CheckPattern(stack, context, schema, value) {
	return (IsString$1(schema.pattern) ? new RegExp(schema.pattern) : schema.pattern).test(value);
}
function ErrorPattern(stack, context, schemaPath, instancePath, schema, value) {
	return CheckPattern(stack, context, schema, value) || context.AddError({
		keyword: "pattern",
		schemaPath,
		instancePath,
		params: { pattern: schema.pattern }
	});
}
function CheckPatternProperties(stack, context, schema, value) {
	return Every(Entries(schema.patternProperties), 0, ([pattern, schema]) => {
		const regexp = new RegExp(pattern);
		return Every(Entries(value), 0, ([key, prop]) => {
			return !regexp.test(key) || CheckSchema(stack, context, schema, prop) && context.AddKey(key);
		});
	});
}
function ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value) {
	return EveryAll(Entries(schema.patternProperties), 0, ([pattern, schema]) => {
		const nextSchemaPath = `${schemaPath}/patternProperties/${pattern}`;
		const regexp = new RegExp(pattern);
		return EveryAll(Entries(value), 0, ([key, value]) => {
			const nextInstancePath = `${instancePath}/${key}`;
			return !regexp.test(key) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value) && context.AddKey(key);
		});
	});
}
function CheckPrefixItems(stack, context, schema, value) {
	return IsEqual(value.length, 0) || Every(schema.prefixItems, 0, (schema, index) => {
		return IsLessEqualThan(value.length, index) || CheckSchema(stack, context, schema, value[index]) && context.AddIndex(index);
	});
}
function ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value) {
	return IsEqual(value.length, 0) || EveryAll(schema.prefixItems, 0, (schema, index) => {
		const nextSchemaPath = `${schemaPath}/prefixItems/${index}`;
		const nextInstancePath = `${instancePath}/${index}`;
		return IsLessEqualThan(value.length, index) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index);
	});
}
function IsExactOptional(required, key) {
	return required.includes(key) || Get$2().exactOptionalPropertyTypes;
}
function InexactOptionalCheck(value, key) {
	return IsUndefined(value[key]);
}
function CheckProperties(stack, context, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return Every(Entries(schema.properties), 0, ([key, schema]) => {
		const isProperty = !HasPropertyKey(value, key) || CheckSchema(stack, context, schema, value[key]) && context.AddKey(key);
		return IsExactOptional(required, key) ? isProperty : InexactOptionalCheck(value, key) || isProperty;
	});
}
function ErrorProperties(stack, context, schemaPath, instancePath, schema, value) {
	const required = IsRequired(schema) ? schema.required : [];
	return EveryAll(Entries(schema.properties), 0, ([key, schema]) => {
		const nextSchemaPath = `${schemaPath}/properties/${key}`;
		const nextInstancePath = `${instancePath}/${key}`;
		const isProperty = () => !HasPropertyKey(value, key) || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value[key]) && context.AddKey(key);
		return IsExactOptional(required, key) ? isProperty() : InexactOptionalCheck(value, key) || isProperty();
	});
}
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
function CheckRecursiveRef(stack, context, schema, value) {
	const target = stack.RecursiveRef(schema.$recursiveRef) ?? false;
	return IsSchema(target) && CheckSchema(stack, context, target, value);
}
function ErrorRecursiveRef(stack, context, schemaPath, instancePath, schema, value) {
	const target = stack.RecursiveRef(schema.$recursiveRef) ?? false;
	return IsSchema(target) && ErrorSchema(stack, context, "#", instancePath, target, value);
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
function CheckRequired(stack, context, schema, value) {
	return Every(schema.required, 0, (key) => HasPropertyKey(value, key));
}
function ErrorRequired(stack, context, schemaPath, instancePath, schema, value) {
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
function CheckTypeName(stack, context, type, schema, value) {
	return IsEqual(type, "object") ? IsObjectNotArray(value) : IsEqual(type, "array") ? IsArray(value) : IsEqual(type, "boolean") ? IsBoolean$1(value) : IsEqual(type, "integer") ? IsInteger(value) : IsEqual(type, "number") ? IsNumber$1(value) : IsEqual(type, "null") ? IsNull(value) : IsEqual(type, "string") ? IsString$1(value) : IsEqual(type, "asyncIterator") ? IsAsyncIterator(value) : IsEqual(type, "bigint") ? IsBigInt(value) : IsEqual(type, "constructor") ? IsConstructor(value) : IsEqual(type, "function") ? IsFunction(value) : IsEqual(type, "iterator") ? IsIterator(value) : IsEqual(type, "symbol") ? IsSymbol(value) : IsEqual(type, "undefined") ? IsUndefined(value) : IsEqual(type, "void") ? IsUndefined(value) : true;
}
function CheckTypeNames(stack, context, types, schema, value) {
	return types.some((type) => CheckTypeName(stack, context, type, schema, value));
}
function CheckType(stack, context, schema, value) {
	return IsArray(schema.type) ? CheckTypeNames(stack, context, schema.type, schema, value) : CheckTypeName(stack, context, schema.type, schema, value);
}
function ErrorType(stack, context, schemaPath, instancePath, schema, value) {
	return (IsArray(schema.type) ? CheckTypeNames(stack, context, schema.type, schema, value) : CheckTypeName(stack, context, schema.type, schema, value)) || context.AddError({
		keyword: "type",
		schemaPath,
		instancePath,
		params: { type: schema.type }
	});
}
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
function IsValid(schema) {
	return !IsEqual(schema.uniqueItems, false);
}
function CheckUniqueItems(stack, context, schema, value) {
	if (!IsValid(schema)) return true;
	const set = new Set(value.map(Hash)).size;
	const isLength = value.length;
	return IsEqual(set, isLength);
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
	return IsEqual(duplicateItems.length, 0) || context.AddError({
		keyword: "uniqueItems",
		schemaPath,
		instancePath,
		params: { duplicateItems }
	});
}
function CheckSchema(stack, context, schema, value) {
	stack.Push(schema);
	const result = IsBooleanSchema(schema) ? CheckBooleanSchema(stack, context, schema, value) : (!IsType(schema) || CheckType(stack, context, schema, value)) && (!(IsObject(value) && !IsArray(value)) || (!IsRequired(schema) || CheckRequired(stack, context, schema, value)) && (!IsAdditionalProperties(schema) || CheckAdditionalProperties(stack, context, schema, value)) && (!IsDependencies(schema) || CheckDependencies(stack, context, schema, value)) && (!IsDependentRequired(schema) || CheckDependentRequired(stack, context, schema, value)) && (!IsDependentSchemas(schema) || CheckDependentSchemas(stack, context, schema, value)) && (!IsPatternProperties(schema) || CheckPatternProperties(stack, context, schema, value)) && (!IsProperties(schema) || CheckProperties(stack, context, schema, value)) && (!IsPropertyNames(schema) || CheckPropertyNames(stack, context, schema, value)) && (!IsMinProperties(schema) || CheckMinProperties(stack, context, schema, value)) && (!IsMaxProperties(schema) || CheckMaxProperties(stack, context, schema, value))) && (!IsArray(value) || (!IsAdditionalItems(schema) || CheckAdditionalItems(stack, context, schema, value)) && (!IsContains(schema) || CheckContains(stack, context, schema, value)) && (!IsItems(schema) || CheckItems(stack, context, schema, value)) && (!IsMaxContains(schema) || CheckMaxContains(stack, context, schema, value)) && (!IsMaxItems(schema) || CheckMaxItems(stack, context, schema, value)) && (!IsMinContains(schema) || CheckMinContains(stack, context, schema, value)) && (!IsMinItems(schema) || CheckMinItems(stack, context, schema, value)) && (!IsPrefixItems(schema) || CheckPrefixItems(stack, context, schema, value)) && (!IsUniqueItems(schema) || CheckUniqueItems(stack, context, schema, value))) && (!IsString$1(value) || (!IsFormat(schema) || CheckFormat(stack, context, schema, value)) && (!IsMaxLength(schema) || CheckMaxLength(stack, context, schema, value)) && (!IsMinLength(schema) || CheckMinLength(stack, context, schema, value)) && (!IsPattern(schema) || CheckPattern(stack, context, schema, value))) && (!(IsNumber$1(value) || IsBigInt(value)) || (!IsExclusiveMaximum(schema) || CheckExclusiveMaximum(stack, context, schema, value)) && (!IsExclusiveMinimum(schema) || CheckExclusiveMinimum(stack, context, schema, value)) && (!IsMaximum(schema) || CheckMaximum(stack, context, schema, value)) && (!IsMinimum(schema) || CheckMinimum(stack, context, schema, value)) && (!IsMultipleOf(schema) || CheckMultipleOf(stack, context, schema, value))) && (!IsRecursiveRef(schema) || CheckRecursiveRef(stack, context, schema, value)) && (!IsRef(schema) || CheckRef(stack, context, schema, value)) && (!IsGuard(schema) || CheckGuard(stack, context, schema, value)) && (!IsConst(schema) || CheckConst(stack, context, schema, value)) && (!IsEnum(schema) || CheckEnum(stack, context, schema, value)) && (!IsIf(schema) || CheckIf(stack, context, schema, value)) && (!IsNot(schema) || CheckNot(stack, context, schema, value)) && (!IsAllOf(schema) || CheckAllOf(stack, context, schema, value)) && (!IsAnyOf(schema) || CheckAnyOf(stack, context, schema, value)) && (!IsOneOf(schema) || CheckOneOf(stack, context, schema, value)) && (!IsUnevaluatedItems(schema) || !IsArray(value) || CheckUnevaluatedItems(stack, context, schema, value)) && (!IsUnevaluatedProperties(schema) || !IsObject(value) || CheckUnevaluatedProperties(stack, context, schema, value)) && (!IsRefine(schema) || CheckRefine(stack, context, schema, value));
	stack.Pop(schema);
	return result;
}
function ErrorSchema(stack, context, schemaPath, instancePath, schema, value) {
	stack.Push(schema);
	const result = IsBooleanSchema(schema) ? ErrorBooleanSchema(stack, context, schemaPath, instancePath, schema, value) : !!(+(!IsType(schema) || ErrorType(stack, context, schemaPath, instancePath, schema, value)) & +(!(IsObject(value) && !IsArray(value)) || !!(+(!IsRequired(schema) || ErrorRequired(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAdditionalProperties(schema) || ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependencies(schema) || ErrorDependencies(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependentRequired(schema) || ErrorDependentRequired(stack, context, schemaPath, instancePath, schema, value)) & +(!IsDependentSchemas(schema) || ErrorDependentSchemas(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPatternProperties(schema) || ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsProperties(schema) || ErrorProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPropertyNames(schema) || ErrorPropertyNames(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinProperties(schema) || ErrorMinProperties(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxProperties(schema) || ErrorMaxProperties(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsArray(value) || !!(+(!IsAdditionalItems(schema) || ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsContains(schema) || ErrorContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsItems(schema) || ErrorItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxContains(schema) || ErrorMaxContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxItems(schema) || ErrorMaxItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinContains(schema) || ErrorMinContains(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinItems(schema) || ErrorMinItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPrefixItems(schema) || ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUniqueItems(schema) || ErrorUniqueItems(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsString$1(value) || !!(+(!IsFormat(schema) || ErrorFormat(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaxLength(schema) || ErrorMaxLength(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinLength(schema) || ErrorMinLength(stack, context, schemaPath, instancePath, schema, value)) & +(!IsPattern(schema) || ErrorPattern(stack, context, schemaPath, instancePath, schema, value)))) & +(!(IsNumber$1(value) || IsBigInt(value)) || !!(+(!IsExclusiveMaximum(schema) || ErrorExclusiveMaximum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsExclusiveMinimum(schema) || ErrorExclusiveMinimum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMaximum(schema) || ErrorMaximum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMinimum(schema) || ErrorMinimum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsMultipleOf(schema) || ErrorMultipleOf(stack, context, schemaPath, instancePath, schema, value)))) & +(!IsRecursiveRef(schema) || ErrorRecursiveRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsRef(schema) || ErrorRef(stack, context, schemaPath, instancePath, schema, value)) & +(!IsGuard(schema) || ErrorGuard(stack, context, schemaPath, instancePath, schema, value)) & +(!IsConst(schema) || ErrorConst(stack, context, schemaPath, instancePath, schema, value)) & +(!IsEnum(schema) || ErrorEnum(stack, context, schemaPath, instancePath, schema, value)) & +(!IsIf(schema) || ErrorIf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsNot(schema) || ErrorNot(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAllOf(schema) || ErrorAllOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsAnyOf(schema) || ErrorAnyOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsOneOf(schema) || ErrorOneOf(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUnevaluatedItems(schema) || !IsArray(value) || ErrorUnevaluatedItems(stack, context, schemaPath, instancePath, schema, value)) & +(!IsUnevaluatedProperties(schema) || !IsObject(value) || ErrorUnevaluatedProperties(stack, context, schemaPath, instancePath, schema, value))) && (!IsRefine(schema) || ErrorRefine(stack, context, schemaPath, instancePath, schema, value));
	stack.Pop(schema);
	return result;
}
function GetIndex(index, value) {
	return IsObject(value) ? value[index] : void 0;
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
function MatchId(schema, base, ref) {
	if (schema.$id === ref.hash) return schema;
	const absoluteId = new URL(schema.$id, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	if (IsEqual(absoluteId.pathname, absoluteRef.pathname)) return ref.hash.startsWith("#") ? MatchHash(schema, base, ref) : schema;
}
function MatchAnchor(schema, base, ref) {
	const absoluteAnchor = new URL(`#${schema.$anchor}`, base.href);
	const absoluteRef = new URL(ref.href, base.href);
	if (IsEqual(absoluteAnchor.href, absoluteRef.href)) return schema;
}
function MatchHash(schema, base, ref) {
	if (ref.href.endsWith("#")) return schema;
	return ref.hash.startsWith("#") ? Get(schema, decodeURIComponent(ref.hash.slice(1))) : void 0;
}
function Match(schema, base, ref) {
	if (IsId(schema)) {
		const result = MatchId(schema, base, ref);
		if (!IsUndefined(result)) return result;
	}
	if (IsAnchor(schema)) {
		const result = MatchAnchor(schema, base, ref);
		if (!IsUndefined(result)) return result;
	}
	return MatchHash(schema, base, ref);
}
function FromArray(schema, base, ref) {
	return schema.reduce((result, item) => {
		const match = FromValue(item, base, ref);
		return !IsUndefined(match) ? match : result;
	}, void 0);
}
function FromObject(schema, base, ref) {
	return Keys(schema).reduce((result, key) => {
		const match = FromValue(schema[key], base, ref);
		return !IsUndefined(match) ? match : result;
	}, void 0);
}
function FromValue(schema, base, ref) {
	base = IsSchemaObject(schema) && IsId(schema) ? new URL(schema.$id, base.href) : base;
	if (IsSchemaObject(schema)) {
		const result = Match(schema, base, ref);
		if (!IsUndefined(result)) return result;
	}
	if (IsArray(schema)) return FromArray(schema, base, ref);
	if (IsObject(schema)) return FromObject(schema, base, ref);
}
function Ref(schema, ref) {
	const defaultBase = new URL("http://unknown");
	const initialBase = IsId(schema) ? new URL(schema.$id, defaultBase.href) : defaultBase;
	return FromValue(schema, initialBase, new URL(ref, initialBase.href));
}
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
		return HasPropertyKey(this.context, ref) ? this.context[ref] : void 0;
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
/** Checks a value against the provided schema */
function Check(...args) {
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
	return CheckSchema(new Stack(context, schema), new CheckContext(), schema, value);
}
var ParseError = class {
	constructor(schema, value, errors) {
		this.schema = schema;
		this.value = value;
		this.errors = errors;
	}
};
/** Parses a value against the provided schema */
function Parse(...args) {
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
	if (!Check(context, schema, value)) {
		const [_result, errors] = Errors(context, schema, value);
		throw new ParseError(schema, value, errors);
	}
	return value;
}
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
	images: Array$1(Image)
});
Parse(_Object_({
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
}), {});
