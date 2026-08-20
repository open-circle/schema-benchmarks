//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp$1(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp$1(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isArray.js
var require_isArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Array.isArray;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_freeGlobal.js
var require__freeGlobal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof global == "object" && global && global.Object === Object && global;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_root.js
var require__root = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var freeGlobal = require__freeGlobal();
	/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	module.exports = freeGlobal || freeSelf || Function("return this")();
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_Symbol.js
var require__Symbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__root().Symbol;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_getRawTag.js
var require__getRawTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = objectProto.toString;
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	/**
	* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the raw `toStringTag`.
	*/
	function getRawTag(value) {
		var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
		try {
			value[symToStringTag] = void 0;
			var unmasked = true;
		} catch (e) {}
		var result = nativeObjectToString.call(value);
		if (unmasked) {
			if (isOwn) value[symToStringTag] = tag;
			else delete value[symToStringTag];
		}
		return result;
	}
	module.exports = getRawTag;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_objectToString.js
var require__objectToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = Object.prototype.toString;
	/**
	* Converts `value` to a string using `Object.prototype.toString`.
	*
	* @private
	* @param {*} value The value to convert.
	* @returns {string} Returns the converted string.
	*/
	function objectToString(value) {
		return nativeObjectToString.call(value);
	}
	module.exports = objectToString;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseGetTag.js
var require__baseGetTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	var getRawTag = require__getRawTag();
	var objectToString = require__objectToString();
	/** `Object#toString` result references. */
	var nullTag = "[object Null]";
	var undefinedTag = "[object Undefined]";
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	/**
	* The base implementation of `getTag` without fallbacks for buggy environments.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	function baseGetTag(value) {
		if (value == null) return value === void 0 ? undefinedTag : nullTag;
		return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
	}
	module.exports = baseGetTag;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isObjectLike.js
var require_isObjectLike = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is object-like. A value is object-like if it's not `null`
	* and has a `typeof` result of "object".
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	* @example
	*
	* _.isObjectLike({});
	* // => true
	*
	* _.isObjectLike([1, 2, 3]);
	* // => true
	*
	* _.isObjectLike(_.noop);
	* // => false
	*
	* _.isObjectLike(null);
	* // => false
	*/
	function isObjectLike(value) {
		return value != null && typeof value == "object";
	}
	module.exports = isObjectLike;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isSymbol.js
var require_isSymbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var symbolTag = "[object Symbol]";
	/**
	* Checks if `value` is classified as a `Symbol` primitive or object.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	* @example
	*
	* _.isSymbol(Symbol.iterator);
	* // => true
	*
	* _.isSymbol('abc');
	* // => false
	*/
	function isSymbol(value) {
		return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
	}
	module.exports = isSymbol;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_isKey.js
var require__isKey = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isArray = require_isArray();
	var isSymbol = require_isSymbol();
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
	var reIsPlainProp = /^\w*$/;
	/**
	* Checks if `value` is a property name and not a property path.
	*
	* @private
	* @param {*} value The value to check.
	* @param {Object} [object] The object to query keys on.
	* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	*/
	function isKey(value, object) {
		if (isArray(value)) return false;
		var type = typeof value;
		if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) return true;
		return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
	}
	module.exports = isKey;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isObject.js
var require_isObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is the
	* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an object, else `false`.
	* @example
	*
	* _.isObject({});
	* // => true
	*
	* _.isObject([1, 2, 3]);
	* // => true
	*
	* _.isObject(_.noop);
	* // => true
	*
	* _.isObject(null);
	* // => false
	*/
	function isObject(value) {
		var type = typeof value;
		return value != null && (type == "object" || type == "function");
	}
	module.exports = isObject;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isFunction.js
var require_isFunction = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isObject = require_isObject();
	/** `Object#toString` result references. */
	var asyncTag = "[object AsyncFunction]";
	var funcTag = "[object Function]";
	var genTag = "[object GeneratorFunction]";
	var proxyTag = "[object Proxy]";
	/**
	* Checks if `value` is classified as a `Function` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a function, else `false`.
	* @example
	*
	* _.isFunction(_);
	* // => true
	*
	* _.isFunction(/abc/);
	* // => false
	*/
	function isFunction(value) {
		if (!isObject(value)) return false;
		var tag = baseGetTag(value);
		return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	module.exports = isFunction;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_coreJsData.js
var require__coreJsData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__root()["__core-js_shared__"];
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_isMasked.js
var require__isMasked = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var coreJsData = require__coreJsData();
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = function() {
		var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
		return uid ? "Symbol(src)_1." + uid : "";
	}();
	/**
	* Checks if `func` has its source masked.
	*
	* @private
	* @param {Function} func The function to check.
	* @returns {boolean} Returns `true` if `func` is masked, else `false`.
	*/
	function isMasked(func) {
		return !!maskSrcKey && maskSrcKey in func;
	}
	module.exports = isMasked;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_toSource.js
var require__toSource = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;
	/**
	* Converts `func` to its source code.
	*
	* @private
	* @param {Function} func The function to convert.
	* @returns {string} Returns the source code.
	*/
	function toSource(func) {
		if (func != null) {
			try {
				return funcToString.call(func);
			} catch (e) {}
			try {
				return func + "";
			} catch (e) {}
		}
		return "";
	}
	module.exports = toSource;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseIsNative.js
var require__baseIsNative = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isFunction = require_isFunction();
	var isMasked = require__isMasked();
	var isObject = require_isObject();
	var toSource = require__toSource();
	/**
	* Used to match `RegExp`
	* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	*/
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	var objectProto = Object.prototype;
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/** Used to detect if a method is native. */
	var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
	/**
	* The base implementation of `_.isNative` without bad shim checks.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a native function,
	*  else `false`.
	*/
	function baseIsNative(value) {
		if (!isObject(value) || isMasked(value)) return false;
		return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
	}
	module.exports = baseIsNative;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_getValue.js
var require__getValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Gets the value at `key` of `object`.
	*
	* @private
	* @param {Object} [object] The object to query.
	* @param {string} key The key of the property to get.
	* @returns {*} Returns the property value.
	*/
	function getValue(object, key) {
		return object == null ? void 0 : object[key];
	}
	module.exports = getValue;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_getNative.js
var require__getNative = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsNative = require__baseIsNative();
	var getValue = require__getValue();
	/**
	* Gets the native function at `key` of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {string} key The key of the method to get.
	* @returns {*} Returns the function if it's native, else `undefined`.
	*/
	function getNative(object, key) {
		var value = getValue(object, key);
		return baseIsNative(value) ? value : void 0;
	}
	module.exports = getNative;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_nativeCreate.js
var require__nativeCreate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(Object, "create");
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashClear.js
var require__hashClear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCreate = require__nativeCreate();
	/**
	* Removes all key-value entries from the hash.
	*
	* @private
	* @name clear
	* @memberOf Hash
	*/
	function hashClear() {
		this.__data__ = nativeCreate ? nativeCreate(null) : {};
		this.size = 0;
	}
	module.exports = hashClear;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashDelete.js
var require__hashDelete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Removes `key` and its value from the hash.
	*
	* @private
	* @name delete
	* @memberOf Hash
	* @param {Object} hash The hash to modify.
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function hashDelete(key) {
		var result = this.has(key) && delete this.__data__[key];
		this.size -= result ? 1 : 0;
		return result;
	}
	module.exports = hashDelete;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashGet.js
var require__hashGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCreate = require__nativeCreate();
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Gets the hash value for `key`.
	*
	* @private
	* @name get
	* @memberOf Hash
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function hashGet(key) {
		var data = this.__data__;
		if (nativeCreate) {
			var result = data[key];
			return result === HASH_UNDEFINED ? void 0 : result;
		}
		return hasOwnProperty.call(data, key) ? data[key] : void 0;
	}
	module.exports = hashGet;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashHas.js
var require__hashHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCreate = require__nativeCreate();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Checks if a hash value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Hash
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function hashHas(key) {
		var data = this.__data__;
		return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
	}
	module.exports = hashHas;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashSet.js
var require__hashSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCreate = require__nativeCreate();
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/**
	* Sets the hash `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Hash
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the hash instance.
	*/
	function hashSet(key, value) {
		var data = this.__data__;
		this.size += this.has(key) ? 0 : 1;
		data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
		return this;
	}
	module.exports = hashSet;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_Hash.js
var require__Hash = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hashClear = require__hashClear();
	var hashDelete = require__hashDelete();
	var hashGet = require__hashGet();
	var hashHas = require__hashHas();
	var hashSet = require__hashSet();
	/**
	* Creates a hash object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Hash(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	Hash.prototype.clear = hashClear;
	Hash.prototype["delete"] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	module.exports = Hash;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheClear.js
var require__listCacheClear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Removes all key-value entries from the list cache.
	*
	* @private
	* @name clear
	* @memberOf ListCache
	*/
	function listCacheClear() {
		this.__data__ = [];
		this.size = 0;
	}
	module.exports = listCacheClear;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/eq.js
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Performs a
	* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* comparison between two values to determine if they are equivalent.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.eq(object, object);
	* // => true
	*
	* _.eq(object, other);
	* // => false
	*
	* _.eq('a', 'a');
	* // => true
	*
	* _.eq('a', Object('a'));
	* // => false
	*
	* _.eq(NaN, NaN);
	* // => true
	*/
	function eq(value, other) {
		return value === other || value !== value && other !== other;
	}
	module.exports = eq;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_assocIndexOf.js
var require__assocIndexOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var eq = require_eq();
	/**
	* Gets the index at which the `key` is found in `array` of key-value pairs.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} key The key to search for.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function assocIndexOf(array, key) {
		var length = array.length;
		while (length--) if (eq(array[length][0], key)) return length;
		return -1;
	}
	module.exports = assocIndexOf;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheDelete.js
var require__listCacheDelete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assocIndexOf = require__assocIndexOf();
	/** Built-in value references. */
	var splice = Array.prototype.splice;
	/**
	* Removes `key` and its value from the list cache.
	*
	* @private
	* @name delete
	* @memberOf ListCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function listCacheDelete(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) return false;
		if (index == data.length - 1) data.pop();
		else splice.call(data, index, 1);
		--this.size;
		return true;
	}
	module.exports = listCacheDelete;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheGet.js
var require__listCacheGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assocIndexOf = require__assocIndexOf();
	/**
	* Gets the list cache value for `key`.
	*
	* @private
	* @name get
	* @memberOf ListCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function listCacheGet(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		return index < 0 ? void 0 : data[index][1];
	}
	module.exports = listCacheGet;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheHas.js
var require__listCacheHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assocIndexOf = require__assocIndexOf();
	/**
	* Checks if a list cache value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf ListCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function listCacheHas(key) {
		return assocIndexOf(this.__data__, key) > -1;
	}
	module.exports = listCacheHas;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheSet.js
var require__listCacheSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assocIndexOf = require__assocIndexOf();
	/**
	* Sets the list cache `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf ListCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the list cache instance.
	*/
	function listCacheSet(key, value) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) {
			++this.size;
			data.push([key, value]);
		} else data[index][1] = value;
		return this;
	}
	module.exports = listCacheSet;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_ListCache.js
var require__ListCache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var listCacheClear = require__listCacheClear();
	var listCacheDelete = require__listCacheDelete();
	var listCacheGet = require__listCacheGet();
	var listCacheHas = require__listCacheHas();
	var listCacheSet = require__listCacheSet();
	/**
	* Creates an list cache object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function ListCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype["delete"] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	module.exports = ListCache;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_Map.js
var require__Map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "Map");
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheClear.js
var require__mapCacheClear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Hash = require__Hash();
	var ListCache = require__ListCache();
	var Map = require__Map();
	/**
	* Removes all key-value entries from the map.
	*
	* @private
	* @name clear
	* @memberOf MapCache
	*/
	function mapCacheClear() {
		this.size = 0;
		this.__data__ = {
			"hash": new Hash(),
			"map": new (Map || ListCache)(),
			"string": new Hash()
		};
	}
	module.exports = mapCacheClear;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_isKeyable.js
var require__isKeyable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is suitable for use as unique object key.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	*/
	function isKeyable(value) {
		var type = typeof value;
		return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
	}
	module.exports = isKeyable;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_getMapData.js
var require__getMapData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isKeyable = require__isKeyable();
	/**
	* Gets the data for `map`.
	*
	* @private
	* @param {Object} map The map to query.
	* @param {string} key The reference key.
	* @returns {*} Returns the map data.
	*/
	function getMapData(map, key) {
		var data = map.__data__;
		return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
	}
	module.exports = getMapData;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheDelete.js
var require__mapCacheDelete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getMapData = require__getMapData();
	/**
	* Removes `key` and its value from the map.
	*
	* @private
	* @name delete
	* @memberOf MapCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function mapCacheDelete(key) {
		var result = getMapData(this, key)["delete"](key);
		this.size -= result ? 1 : 0;
		return result;
	}
	module.exports = mapCacheDelete;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheGet.js
var require__mapCacheGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getMapData = require__getMapData();
	/**
	* Gets the map value for `key`.
	*
	* @private
	* @name get
	* @memberOf MapCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function mapCacheGet(key) {
		return getMapData(this, key).get(key);
	}
	module.exports = mapCacheGet;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheHas.js
var require__mapCacheHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getMapData = require__getMapData();
	/**
	* Checks if a map value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf MapCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function mapCacheHas(key) {
		return getMapData(this, key).has(key);
	}
	module.exports = mapCacheHas;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheSet.js
var require__mapCacheSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getMapData = require__getMapData();
	/**
	* Sets the map `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf MapCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the map cache instance.
	*/
	function mapCacheSet(key, value) {
		var data = getMapData(this, key), size = data.size;
		data.set(key, value);
		this.size += data.size == size ? 0 : 1;
		return this;
	}
	module.exports = mapCacheSet;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_MapCache.js
var require__MapCache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var mapCacheClear = require__mapCacheClear();
	var mapCacheDelete = require__mapCacheDelete();
	var mapCacheGet = require__mapCacheGet();
	var mapCacheHas = require__mapCacheHas();
	var mapCacheSet = require__mapCacheSet();
	/**
	* Creates a map cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function MapCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype["delete"] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	module.exports = MapCache;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/memoize.js
var require_memoize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MapCache = require__MapCache();
	/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
	/**
	* Creates a function that memoizes the result of `func`. If `resolver` is
	* provided, it determines the cache key for storing the result based on the
	* arguments provided to the memoized function. By default, the first argument
	* provided to the memoized function is used as the map cache key. The `func`
	* is invoked with the `this` binding of the memoized function.
	*
	* **Note:** The cache is exposed as the `cache` property on the memoized
	* function. Its creation may be customized by replacing the `_.memoize.Cache`
	* constructor with one whose instances implement the
	* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	* method interface of `clear`, `delete`, `get`, `has`, and `set`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Function
	* @param {Function} func The function to have its output memoized.
	* @param {Function} [resolver] The function to resolve the cache key.
	* @returns {Function} Returns the new memoized function.
	* @example
	*
	* var object = { 'a': 1, 'b': 2 };
	* var other = { 'c': 3, 'd': 4 };
	*
	* var values = _.memoize(_.values);
	* values(object);
	* // => [1, 2]
	*
	* values(other);
	* // => [3, 4]
	*
	* object.a = 2;
	* values(object);
	* // => [1, 2]
	*
	* // Modify the result cache.
	* values.cache.set(object, ['a', 'b']);
	* values(object);
	* // => ['a', 'b']
	*
	* // Replace `_.memoize.Cache`.
	* _.memoize.Cache = WeakMap;
	*/
	function memoize(func, resolver) {
		if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT);
		var memoized = function() {
			var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
			if (cache.has(key)) return cache.get(key);
			var result = func.apply(this, args);
			memoized.cache = cache.set(key, result) || cache;
			return result;
		};
		memoized.cache = new (memoize.Cache || MapCache)();
		return memoized;
	}
	memoize.Cache = MapCache;
	module.exports = memoize;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_memoizeCapped.js
var require__memoizeCapped = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var memoize = require_memoize();
	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;
	/**
	* A specialized version of `_.memoize` which clears the memoized function's
	* cache when it exceeds `MAX_MEMOIZE_SIZE`.
	*
	* @private
	* @param {Function} func The function to have its output memoized.
	* @returns {Function} Returns the new memoized function.
	*/
	function memoizeCapped(func) {
		var result = memoize(func, function(key) {
			if (cache.size === MAX_MEMOIZE_SIZE) cache.clear();
			return key;
		});
		var cache = result.cache;
		return result;
	}
	module.exports = memoizeCapped;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_stringToPath.js
var require__stringToPath = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var memoizeCapped = require__memoizeCapped();
	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	module.exports = memoizeCapped(function(string) {
		var result = [];
		if (string.charCodeAt(0) === 46) result.push("");
		string.replace(rePropName, function(match, number, quote, subString) {
			result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
		});
		return result;
	});
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_arrayMap.js
var require__arrayMap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `_.map` for arrays without support for iteratee
	* shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns the new mapped array.
	*/
	function arrayMap(array, iteratee) {
		var index = -1, length = array == null ? 0 : array.length, result = Array(length);
		while (++index < length) result[index] = iteratee(array[index], index, array);
		return result;
	}
	module.exports = arrayMap;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseToString.js
var require__baseToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	var arrayMap = require__arrayMap();
	var isArray = require_isArray();
	var isSymbol = require_isSymbol();
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : void 0;
	var symbolToString = symbolProto ? symbolProto.toString : void 0;
	/**
	* The base implementation of `_.toString` which doesn't convert nullish
	* values to empty strings.
	*
	* @private
	* @param {*} value The value to process.
	* @returns {string} Returns the string.
	*/
	function baseToString(value) {
		if (typeof value == "string") return value;
		if (isArray(value)) return arrayMap(value, baseToString) + "";
		if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
		var result = value + "";
		return result == "0" && 1 / value == -INFINITY ? "-0" : result;
	}
	module.exports = baseToString;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/toString.js
var require_toString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseToString = require__baseToString();
	/**
	* Converts `value` to a string. An empty string is returned for `null`
	* and `undefined` values. The sign of `-0` is preserved.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to convert.
	* @returns {string} Returns the converted string.
	* @example
	*
	* _.toString(null);
	* // => ''
	*
	* _.toString(-0);
	* // => '-0'
	*
	* _.toString([1, 2, 3]);
	* // => '1,2,3'
	*/
	function toString(value) {
		return value == null ? "" : baseToString(value);
	}
	module.exports = toString;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_castPath.js
var require__castPath = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isArray = require_isArray();
	var isKey = require__isKey();
	var stringToPath = require__stringToPath();
	var toString = require_toString();
	/**
	* Casts `value` to a path array if it's not one.
	*
	* @private
	* @param {*} value The value to inspect.
	* @param {Object} [object] The object to query keys on.
	* @returns {Array} Returns the cast property path array.
	*/
	function castPath(value, object) {
		if (isArray(value)) return value;
		return isKey(value, object) ? [value] : stringToPath(toString(value));
	}
	module.exports = castPath;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_toKey.js
var require__toKey = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isSymbol = require_isSymbol();
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	/**
	* Converts `value` to a string key if it's not a string or symbol.
	*
	* @private
	* @param {*} value The value to inspect.
	* @returns {string|symbol} Returns the key.
	*/
	function toKey(value) {
		if (typeof value == "string" || isSymbol(value)) return value;
		var result = value + "";
		return result == "0" && 1 / value == -INFINITY ? "-0" : result;
	}
	module.exports = toKey;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseGet.js
var require__baseGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var castPath = require__castPath();
	var toKey = require__toKey();
	/**
	* The base implementation of `_.get` without support for default values.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Array|string} path The path of the property to get.
	* @returns {*} Returns the resolved value.
	*/
	function baseGet(object, path) {
		path = castPath(path, object);
		var index = 0, length = path.length;
		while (object != null && index < length) object = object[toKey(path[index++])];
		return index && index == length ? object : void 0;
	}
	module.exports = baseGet;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/get.js
var require_get = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGet = require__baseGet();
	/**
	* Gets the value at `path` of `object`. If the resolved value is
	* `undefined`, the `defaultValue` is returned in its place.
	*
	* @static
	* @memberOf _
	* @since 3.7.0
	* @category Object
	* @param {Object} object The object to query.
	* @param {Array|string} path The path of the property to get.
	* @param {*} [defaultValue] The value returned for `undefined` resolved values.
	* @returns {*} Returns the resolved value.
	* @example
	*
	* var object = { 'a': [{ 'b': { 'c': 3 } }] };
	*
	* _.get(object, 'a[0].b.c');
	* // => 3
	*
	* _.get(object, ['a', '0', 'b', 'c']);
	* // => 3
	*
	* _.get(object, 'a.b.c', 'default');
	* // => 'default'
	*/
	function get(object, path, defaultValue) {
		var result = object == null ? void 0 : baseGet(object, path);
		return result === void 0 ? defaultValue : result;
	}
	module.exports = get;
}));
//#endregion
//#region ../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/es6/index.js
var require_es6 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a instanceof Map && b instanceof Map) {
				if (a.size !== b.size) return false;
				for (i of a.entries()) if (!b.has(i[0])) return false;
				for (i of a.entries()) if (!equal(i[1], b.get(i[0]))) return false;
				return true;
			}
			if (a instanceof Set && b instanceof Set) {
				if (a.size !== b.size) return false;
				for (i of a.entries()) if (!b.has(i[0])) return false;
				return true;
			}
			if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (a[i] !== b[i]) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_setCacheAdd.js
var require__setCacheAdd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/**
	* Adds `value` to the array cache.
	*
	* @private
	* @name add
	* @memberOf SetCache
	* @alias push
	* @param {*} value The value to cache.
	* @returns {Object} Returns the cache instance.
	*/
	function setCacheAdd(value) {
		this.__data__.set(value, HASH_UNDEFINED);
		return this;
	}
	module.exports = setCacheAdd;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_setCacheHas.js
var require__setCacheHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is in the array cache.
	*
	* @private
	* @name has
	* @memberOf SetCache
	* @param {*} value The value to search for.
	* @returns {boolean} Returns `true` if `value` is found, else `false`.
	*/
	function setCacheHas(value) {
		return this.__data__.has(value);
	}
	module.exports = setCacheHas;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_SetCache.js
var require__SetCache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MapCache = require__MapCache();
	var setCacheAdd = require__setCacheAdd();
	var setCacheHas = require__setCacheHas();
	/**
	*
	* Creates an array cache object to store unique values.
	*
	* @private
	* @constructor
	* @param {Array} [values] The values to cache.
	*/
	function SetCache(values) {
		var index = -1, length = values == null ? 0 : values.length;
		this.__data__ = new MapCache();
		while (++index < length) this.add(values[index]);
	}
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;
	module.exports = SetCache;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseFindIndex.js
var require__baseFindIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.findIndex` and `_.findLastIndex` without
	* support for iteratee shorthands.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {Function} predicate The function invoked per iteration.
	* @param {number} fromIndex The index to search from.
	* @param {boolean} [fromRight] Specify iterating from right to left.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
		var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
		while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
		return -1;
	}
	module.exports = baseFindIndex;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseIsNaN.js
var require__baseIsNaN = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.isNaN` without support for number objects.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	*/
	function baseIsNaN(value) {
		return value !== value;
	}
	module.exports = baseIsNaN;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_strictIndexOf.js
var require__strictIndexOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `_.indexOf` which performs strict equality
	* comparisons of values, i.e. `===`.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} value The value to search for.
	* @param {number} fromIndex The index to search from.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function strictIndexOf(array, value, fromIndex) {
		var index = fromIndex - 1, length = array.length;
		while (++index < length) if (array[index] === value) return index;
		return -1;
	}
	module.exports = strictIndexOf;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseIndexOf.js
var require__baseIndexOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseFindIndex = require__baseFindIndex();
	var baseIsNaN = require__baseIsNaN();
	var strictIndexOf = require__strictIndexOf();
	/**
	* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} value The value to search for.
	* @param {number} fromIndex The index to search from.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function baseIndexOf(array, value, fromIndex) {
		return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
	}
	module.exports = baseIndexOf;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_arrayIncludes.js
var require__arrayIncludes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIndexOf = require__baseIndexOf();
	/**
	* A specialized version of `_.includes` for arrays without support for
	* specifying an index to search from.
	*
	* @private
	* @param {Array} [array] The array to inspect.
	* @param {*} target The value to search for.
	* @returns {boolean} Returns `true` if `target` is found, else `false`.
	*/
	function arrayIncludes(array, value) {
		return !!(array == null ? 0 : array.length) && baseIndexOf(array, value, 0) > -1;
	}
	module.exports = arrayIncludes;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_arrayIncludesWith.js
var require__arrayIncludesWith = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This function is like `arrayIncludes` except that it accepts a comparator.
	*
	* @private
	* @param {Array} [array] The array to inspect.
	* @param {*} target The value to search for.
	* @param {Function} comparator The comparator invoked per element.
	* @returns {boolean} Returns `true` if `target` is found, else `false`.
	*/
	function arrayIncludesWith(array, value, comparator) {
		var index = -1, length = array == null ? 0 : array.length;
		while (++index < length) if (comparator(value, array[index])) return true;
		return false;
	}
	module.exports = arrayIncludesWith;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_cacheHas.js
var require__cacheHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if a `cache` value for `key` exists.
	*
	* @private
	* @param {Object} cache The cache to query.
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function cacheHas(cache, key) {
		return cache.has(key);
	}
	module.exports = cacheHas;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_Set.js
var require__Set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "Set");
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/noop.js
var require_noop = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This method returns `undefined`.
	*
	* @static
	* @memberOf _
	* @since 2.3.0
	* @category Util
	* @example
	*
	* _.times(2, _.noop);
	* // => [undefined, undefined]
	*/
	function noop() {}
	module.exports = noop;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_setToArray.js
var require__setToArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Converts `set` to an array of its values.
	*
	* @private
	* @param {Object} set The set to convert.
	* @returns {Array} Returns the values.
	*/
	function setToArray(set) {
		var index = -1, result = Array(set.size);
		set.forEach(function(value) {
			result[++index] = value;
		});
		return result;
	}
	module.exports = setToArray;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_createSet.js
var require__createSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Set = require__Set();
	var noop = require_noop();
	var setToArray = require__setToArray();
	module.exports = !(Set && 1 / setToArray(new Set([, -0]))[1] == 1 / 0) ? noop : function(values) {
		return new Set(values);
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseUniq.js
var require__baseUniq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SetCache = require__SetCache();
	var arrayIncludes = require__arrayIncludes();
	var arrayIncludesWith = require__arrayIncludesWith();
	var cacheHas = require__cacheHas();
	var createSet = require__createSet();
	var setToArray = require__setToArray();
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	/**
	* The base implementation of `_.uniqBy` without support for iteratee shorthands.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {Function} [iteratee] The iteratee invoked per element.
	* @param {Function} [comparator] The comparator invoked per element.
	* @returns {Array} Returns the new duplicate free array.
	*/
	function baseUniq(array, iteratee, comparator) {
		var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
		if (comparator) {
			isCommon = false;
			includes = arrayIncludesWith;
		} else if (length >= LARGE_ARRAY_SIZE) {
			var set = iteratee ? null : createSet(array);
			if (set) return setToArray(set);
			isCommon = false;
			includes = cacheHas;
			seen = new SetCache();
		} else seen = iteratee ? [] : result;
		outer: while (++index < length) {
			var value = array[index], computed = iteratee ? iteratee(value) : value;
			value = comparator || value !== 0 ? value : 0;
			if (isCommon && computed === computed) {
				var seenIndex = seen.length;
				while (seenIndex--) if (seen[seenIndex] === computed) continue outer;
				if (iteratee) seen.push(computed);
				result.push(value);
			} else if (!includes(seen, computed, comparator)) {
				if (seen !== result) seen.push(computed);
				result.push(value);
			}
		}
		return result;
	}
	module.exports = baseUniq;
}));
//#endregion
//#region ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/uniqWith.js
var require_uniqWith = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseUniq = require__baseUniq();
	/**
	* This method is like `_.uniq` except that it accepts `comparator` which
	* is invoked to compare elements of `array`. The order of result values is
	* determined by the order they occur in the array.The comparator is invoked
	* with two arguments: (arrVal, othVal).
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Array
	* @param {Array} array The array to inspect.
	* @param {Function} [comparator] The comparator invoked per element.
	* @returns {Array} Returns the new duplicate free array.
	* @example
	*
	* var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
	*
	* _.uniqWith(objects, _.isEqual);
	* // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
	*/
	function uniqWith(array, comparator) {
		comparator = typeof comparator == "function" ? comparator : void 0;
		return array && array.length ? baseUniq(array, void 0, comparator) : [];
	}
	module.exports = uniqWith;
}));
//#endregion
//#region ../node_modules/.pnpm/@sapphire+shapeshift@5.0.0/node_modules/@sapphire/shapeshift/dist/esm/index.mjs
var import_get = /* @__PURE__ */ __toESM(require_get(), 1);
var import_es6 = /* @__PURE__ */ __toESM(require_es6(), 1);
var import_uniqWith = /* @__PURE__ */ __toESM(require_uniqWith(), 1);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var exports$k = {};
var _dewExec$k = false;
function dew$k() {
	if (_dewExec$k) return exports$k;
	_dewExec$k = true;
	exports$k = /* @__PURE__ */ __name(function hasSymbols() {
		if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") return false;
		if (typeof Symbol.iterator === "symbol") return true;
		var obj = {};
		var sym = Symbol("test");
		var symObj = Object(sym);
		if (typeof sym === "string") return false;
		if (Object.prototype.toString.call(sym) !== "[object Symbol]") return false;
		if (Object.prototype.toString.call(symObj) !== "[object Symbol]") return false;
		var symVal = 42;
		obj[sym] = symVal;
		for (sym in obj) return false;
		if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) return false;
		if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) return false;
		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) return false;
		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) return false;
		if (typeof Object.getOwnPropertyDescriptor === "function") {
			var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
			if (descriptor.value !== symVal || descriptor.enumerable !== true) return false;
		}
		return true;
	}, "hasSymbols");
	return exports$k;
}
__name(dew$k, "dew$k");
var exports$j = {};
var _dewExec$j = false;
function dew$j() {
	if (_dewExec$j) return exports$j;
	_dewExec$j = true;
	exports$j = Error;
	return exports$j;
}
__name(dew$j, "dew$j");
var exports$i = {};
var _dewExec$i = false;
function dew$i() {
	if (_dewExec$i) return exports$i;
	_dewExec$i = true;
	exports$i = EvalError;
	return exports$i;
}
__name(dew$i, "dew$i");
var exports$h = {};
var _dewExec$h = false;
function dew$h() {
	if (_dewExec$h) return exports$h;
	_dewExec$h = true;
	exports$h = RangeError;
	return exports$h;
}
__name(dew$h, "dew$h");
var exports$g = {};
var _dewExec$g = false;
function dew$g() {
	if (_dewExec$g) return exports$g;
	_dewExec$g = true;
	exports$g = ReferenceError;
	return exports$g;
}
__name(dew$g, "dew$g");
var exports$f = {};
var _dewExec$f = false;
function dew$f() {
	if (_dewExec$f) return exports$f;
	_dewExec$f = true;
	exports$f = SyntaxError;
	return exports$f;
}
__name(dew$f, "dew$f");
var exports$e = {};
var _dewExec$e = false;
function dew$e() {
	if (_dewExec$e) return exports$e;
	_dewExec$e = true;
	exports$e = TypeError;
	return exports$e;
}
__name(dew$e, "dew$e");
var exports$d = {};
var _dewExec$d = false;
function dew$d() {
	if (_dewExec$d) return exports$d;
	_dewExec$d = true;
	exports$d = URIError;
	return exports$d;
}
__name(dew$d, "dew$d");
var exports$c = {};
var _dewExec$c = false;
function dew$c() {
	if (_dewExec$c) return exports$c;
	_dewExec$c = true;
	var origSymbol = typeof Symbol !== "undefined" && Symbol;
	var hasSymbolSham = dew$k();
	exports$c = /* @__PURE__ */ __name(function hasNativeSymbols() {
		if (typeof origSymbol !== "function") return false;
		if (typeof Symbol !== "function") return false;
		if (typeof origSymbol("foo") !== "symbol") return false;
		if (typeof Symbol("bar") !== "symbol") return false;
		return hasSymbolSham();
	}, "hasNativeSymbols");
	return exports$c;
}
__name(dew$c, "dew$c");
var exports$b = {};
var _dewExec$b = false;
function dew$b() {
	if (_dewExec$b) return exports$b;
	_dewExec$b = true;
	var test = {
		__proto__: null,
		foo: {}
	};
	var $Object = Object;
	exports$b = /* @__PURE__ */ __name(function hasProto() {
		return { __proto__: test }.foo === test.foo && !(test instanceof $Object);
	}, "hasProto");
	return exports$b;
}
__name(dew$b, "dew$b");
var exports$a = {};
var _dewExec$a = false;
function dew$a() {
	if (_dewExec$a) return exports$a;
	_dewExec$a = true;
	var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = "[object Function]";
	var concatty = /* @__PURE__ */ __name(function concatty2(a, b) {
		var arr = [];
		for (var i = 0; i < a.length; i += 1) arr[i] = a[i];
		for (var j = 0; j < b.length; j += 1) arr[j + a.length] = b[j];
		return arr;
	}, "concatty2");
	var slicy = /* @__PURE__ */ __name(function slicy2(arrLike, offset) {
		var arr = [];
		for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) arr[j] = arrLike[i];
		return arr;
	}, "slicy2");
	var joiny = /* @__PURE__ */ __name(function(arr, joiner) {
		var str = "";
		for (var i = 0; i < arr.length; i += 1) {
			str += arr[i];
			if (i + 1 < arr.length) str += joiner;
		}
		return str;
	}, "joiny");
	exports$a = /* @__PURE__ */ __name(function bind(that) {
		var target = this;
		if (typeof target !== "function" || toStr.apply(target) !== funcType) throw new TypeError(ERROR_MESSAGE + target);
		var args = slicy(arguments, 1);
		var bound;
		var binder = /* @__PURE__ */ __name(function() {
			if (this instanceof bound) {
				var result = target.apply(this, concatty(args, arguments));
				if (Object(result) === result) return result;
				return this;
			}
			return target.apply(that, concatty(args, arguments));
		}, "binder");
		var boundLength = max(0, target.length - args.length);
		var boundArgs = [];
		for (var i = 0; i < boundLength; i++) boundArgs[i] = "$" + i;
		bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
		if (target.prototype) {
			var Empty = /* @__PURE__ */ __name(function Empty2() {}, "Empty2");
			Empty.prototype = target.prototype;
			bound.prototype = new Empty();
			Empty.prototype = null;
		}
		return bound;
	}, "bind");
	return exports$a;
}
__name(dew$a, "dew$a");
var exports$9 = {};
var _dewExec$9 = false;
function dew$9() {
	if (_dewExec$9) return exports$9;
	_dewExec$9 = true;
	var implementation = dew$a();
	exports$9 = Function.prototype.bind || implementation;
	return exports$9;
}
__name(dew$9, "dew$9");
var exports$8 = {};
var _dewExec$8 = false;
function dew$8() {
	if (_dewExec$8) return exports$8;
	_dewExec$8 = true;
	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	exports$8 = dew$9().call(call, $hasOwn);
	return exports$8;
}
__name(dew$8, "dew$8");
var exports$7 = {};
var _dewExec$7 = false;
function dew$7() {
	if (_dewExec$7) return exports$7;
	_dewExec$7 = true;
	var undefined$1;
	var $Error = dew$j();
	var $EvalError = dew$i();
	var $RangeError = dew$h();
	var $ReferenceError = dew$g();
	var $SyntaxError = dew$f();
	var $TypeError = dew$e();
	var $URIError = dew$d();
	var $Function = Function;
	var getEvalledConstructor = /* @__PURE__ */ __name(function(expressionSyntax) {
		try {
			return $Function("\"use strict\"; return (" + expressionSyntax + ").constructor;")();
		} catch (e) {}
	}, "getEvalledConstructor");
	var $gOPD = Object.getOwnPropertyDescriptor;
	if ($gOPD) try {
		$gOPD({}, "");
	} catch (e) {
		$gOPD = null;
	}
	var throwTypeError = /* @__PURE__ */ __name(function() {
		throw new $TypeError();
	}, "throwTypeError");
	var ThrowTypeError = $gOPD ? (function() {
		try {
			arguments.callee;
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				return $gOPD(arguments, "callee").get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	})() : throwTypeError;
	var hasSymbols = dew$c()();
	var hasProto = dew$b()();
	var getProto = Object.getPrototypeOf || (hasProto ? function(x) {
		return x.__proto__;
	} : null);
	var needsEval = {};
	var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined$1 : getProto(Uint8Array);
	var INTRINSICS = {
		__proto__: null,
		"%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
		"%Array%": Array,
		"%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
		"%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined$1,
		"%AsyncFromSyncIteratorPrototype%": undefined$1,
		"%AsyncFunction%": needsEval,
		"%AsyncGenerator%": needsEval,
		"%AsyncGeneratorFunction%": needsEval,
		"%AsyncIteratorPrototype%": needsEval,
		"%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
		"%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
		"%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
		"%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
		"%Boolean%": Boolean,
		"%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
		"%Date%": Date,
		"%decodeURI%": decodeURI,
		"%decodeURIComponent%": decodeURIComponent,
		"%encodeURI%": encodeURI,
		"%encodeURIComponent%": encodeURIComponent,
		"%Error%": $Error,
		"%eval%": eval,
		"%EvalError%": $EvalError,
		"%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
		"%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
		"%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
		"%Function%": $Function,
		"%GeneratorFunction%": needsEval,
		"%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
		"%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
		"%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
		"%isFinite%": isFinite,
		"%isNaN%": isNaN,
		"%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
		"%JSON%": typeof JSON === "object" ? JSON : undefined$1,
		"%Map%": typeof Map === "undefined" ? undefined$1 : Map,
		"%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined$1 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
		"%Math%": Math,
		"%Number%": Number,
		"%Object%": Object,
		"%parseFloat%": parseFloat,
		"%parseInt%": parseInt,
		"%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
		"%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
		"%RangeError%": $RangeError,
		"%ReferenceError%": $ReferenceError,
		"%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
		"%RegExp%": RegExp,
		"%Set%": typeof Set === "undefined" ? undefined$1 : Set,
		"%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined$1 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
		"%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
		"%String%": String,
		"%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined$1,
		"%Symbol%": hasSymbols ? Symbol : undefined$1,
		"%SyntaxError%": $SyntaxError,
		"%ThrowTypeError%": ThrowTypeError,
		"%TypedArray%": TypedArray,
		"%TypeError%": $TypeError,
		"%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
		"%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
		"%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
		"%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
		"%URIError%": $URIError,
		"%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
		"%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
		"%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet
	};
	if (getProto) try {
		null.error;
	} catch (e) {
		INTRINSICS["%Error.prototype%"] = getProto(getProto(e));
	}
	var doEval = /* @__PURE__ */ __name(function doEval2(name) {
		var value;
		if (name === "%AsyncFunction%") value = getEvalledConstructor("async function () {}");
		else if (name === "%GeneratorFunction%") value = getEvalledConstructor("function* () {}");
		else if (name === "%AsyncGeneratorFunction%") value = getEvalledConstructor("async function* () {}");
		else if (name === "%AsyncGenerator%") {
			var fn = doEval2("%AsyncGeneratorFunction%");
			if (fn) value = fn.prototype;
		} else if (name === "%AsyncIteratorPrototype%") {
			var gen = doEval2("%AsyncGenerator%");
			if (gen && getProto) value = getProto(gen.prototype);
		}
		INTRINSICS[name] = value;
		return value;
	}, "doEval2");
	var LEGACY_ALIASES = {
		__proto__: null,
		"%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
		"%ArrayPrototype%": ["Array", "prototype"],
		"%ArrayProto_entries%": [
			"Array",
			"prototype",
			"entries"
		],
		"%ArrayProto_forEach%": [
			"Array",
			"prototype",
			"forEach"
		],
		"%ArrayProto_keys%": [
			"Array",
			"prototype",
			"keys"
		],
		"%ArrayProto_values%": [
			"Array",
			"prototype",
			"values"
		],
		"%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
		"%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
		"%AsyncGeneratorPrototype%": [
			"AsyncGeneratorFunction",
			"prototype",
			"prototype"
		],
		"%BooleanPrototype%": ["Boolean", "prototype"],
		"%DataViewPrototype%": ["DataView", "prototype"],
		"%DatePrototype%": ["Date", "prototype"],
		"%ErrorPrototype%": ["Error", "prototype"],
		"%EvalErrorPrototype%": ["EvalError", "prototype"],
		"%Float32ArrayPrototype%": ["Float32Array", "prototype"],
		"%Float64ArrayPrototype%": ["Float64Array", "prototype"],
		"%FunctionPrototype%": ["Function", "prototype"],
		"%Generator%": ["GeneratorFunction", "prototype"],
		"%GeneratorPrototype%": [
			"GeneratorFunction",
			"prototype",
			"prototype"
		],
		"%Int8ArrayPrototype%": ["Int8Array", "prototype"],
		"%Int16ArrayPrototype%": ["Int16Array", "prototype"],
		"%Int32ArrayPrototype%": ["Int32Array", "prototype"],
		"%JSONParse%": ["JSON", "parse"],
		"%JSONStringify%": ["JSON", "stringify"],
		"%MapPrototype%": ["Map", "prototype"],
		"%NumberPrototype%": ["Number", "prototype"],
		"%ObjectPrototype%": ["Object", "prototype"],
		"%ObjProto_toString%": [
			"Object",
			"prototype",
			"toString"
		],
		"%ObjProto_valueOf%": [
			"Object",
			"prototype",
			"valueOf"
		],
		"%PromisePrototype%": ["Promise", "prototype"],
		"%PromiseProto_then%": [
			"Promise",
			"prototype",
			"then"
		],
		"%Promise_all%": ["Promise", "all"],
		"%Promise_reject%": ["Promise", "reject"],
		"%Promise_resolve%": ["Promise", "resolve"],
		"%RangeErrorPrototype%": ["RangeError", "prototype"],
		"%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
		"%RegExpPrototype%": ["RegExp", "prototype"],
		"%SetPrototype%": ["Set", "prototype"],
		"%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
		"%StringPrototype%": ["String", "prototype"],
		"%SymbolPrototype%": ["Symbol", "prototype"],
		"%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
		"%TypedArrayPrototype%": ["TypedArray", "prototype"],
		"%TypeErrorPrototype%": ["TypeError", "prototype"],
		"%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
		"%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
		"%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
		"%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
		"%URIErrorPrototype%": ["URIError", "prototype"],
		"%WeakMapPrototype%": ["WeakMap", "prototype"],
		"%WeakSetPrototype%": ["WeakSet", "prototype"]
	};
	var bind = dew$9();
	var hasOwn = dew$8();
	var $concat = bind.call(Function.call, Array.prototype.concat);
	var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
	var $replace = bind.call(Function.call, String.prototype.replace);
	var $strSlice = bind.call(Function.call, String.prototype.slice);
	var $exec = bind.call(Function.call, RegExp.prototype.exec);
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g;
	var stringToPath = /* @__PURE__ */ __name(function stringToPath2(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === "%" && last !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
		else if (last === "%" && first !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
		var result = [];
		$replace(string, rePropName, function(match, number, quote, subString) {
			result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
		});
		return result;
	}, "stringToPath2");
	var getBaseIntrinsic = /* @__PURE__ */ __name(function getBaseIntrinsic2(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = "%" + alias[0] + "%";
		}
		if (hasOwn(INTRINSICS, intrinsicName)) {
			var value = INTRINSICS[intrinsicName];
			if (value === needsEval) value = doEval(intrinsicName);
			if (typeof value === "undefined" && !allowMissing) throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
			return {
				alias,
				name: intrinsicName,
				value
			};
		}
		throw new $SyntaxError("intrinsic " + name + " does not exist!");
	}, "getBaseIntrinsic2");
	exports$7 = /* @__PURE__ */ __name(function GetIntrinsic(name, allowMissing) {
		if (typeof name !== "string" || name.length === 0) throw new $TypeError("intrinsic name must be a non-empty string");
		if (arguments.length > 1 && typeof allowMissing !== "boolean") throw new $TypeError("\"allowMissing\" argument must be a boolean");
		if ($exec(/^%?[^%]*%?$/, name) === null) throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
		var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;
		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat([0, 1], alias));
		}
		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if ((first === "\"" || first === "'" || first === "`" || last === "\"" || last === "'" || last === "`") && first !== last) throw new $SyntaxError("property names with quotes must have matching quotes");
			if (part === "constructor" || !isOwn) skipFurtherCaching = true;
			intrinsicBaseName += "." + part;
			intrinsicRealName = "%" + intrinsicBaseName + "%";
			if (hasOwn(INTRINSICS, intrinsicRealName)) value = INTRINSICS[intrinsicRealName];
			else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
					return;
				}
				if ($gOPD && i + 1 >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;
					if (isOwn && "get" in desc && !("originalValue" in desc.get)) value = desc.get;
					else value = value[part];
				} else {
					isOwn = hasOwn(value, part);
					value = value[part];
				}
				if (isOwn && !skipFurtherCaching) INTRINSICS[intrinsicRealName] = value;
			}
		}
		return value;
	}, "GetIntrinsic");
	return exports$7;
}
__name(dew$7, "dew$7");
var exports$6 = {};
var _dewExec$6 = false;
function dew$6() {
	if (_dewExec$6) return exports$6;
	_dewExec$6 = true;
	var $defineProperty = dew$7()("%Object.defineProperty%", true) || false;
	if ($defineProperty) try {
		$defineProperty({}, "a", { value: 1 });
	} catch (e) {
		$defineProperty = false;
	}
	exports$6 = $defineProperty;
	return exports$6;
}
__name(dew$6, "dew$6");
var exports$5 = {};
var _dewExec$5 = false;
function dew$5() {
	if (_dewExec$5) return exports$5;
	_dewExec$5 = true;
	var $gOPD = dew$7()("%Object.getOwnPropertyDescriptor%", true);
	if ($gOPD) try {
		$gOPD([], "length");
	} catch (e) {
		$gOPD = null;
	}
	exports$5 = $gOPD;
	return exports$5;
}
__name(dew$5, "dew$5");
var exports$4 = {};
var _dewExec$4 = false;
function dew$4() {
	if (_dewExec$4) return exports$4;
	_dewExec$4 = true;
	var $defineProperty = dew$6();
	var $SyntaxError = dew$f();
	var $TypeError = dew$e();
	var gopd = dew$5();
	exports$4 = /* @__PURE__ */ __name(function defineDataProperty(obj, property, value) {
		if (!obj || typeof obj !== "object" && typeof obj !== "function") throw new $TypeError("`obj` must be an object or a function`");
		if (typeof property !== "string" && typeof property !== "symbol") throw new $TypeError("`property` must be a string or a symbol`");
		if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
		if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
		if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
		if (arguments.length > 6 && typeof arguments[6] !== "boolean") throw new $TypeError("`loose`, if provided, must be a boolean");
		var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
		var nonWritable = arguments.length > 4 ? arguments[4] : null;
		var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
		var loose = arguments.length > 6 ? arguments[6] : false;
		var desc = !!gopd && gopd(obj, property);
		if ($defineProperty) $defineProperty(obj, property, {
			configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
			enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
			value,
			writable: nonWritable === null && desc ? desc.writable : !nonWritable
		});
		else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) obj[property] = value;
		else throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
	}, "defineDataProperty");
	return exports$4;
}
__name(dew$4, "dew$4");
var exports$3 = {};
var _dewExec$3 = false;
function dew$3() {
	if (_dewExec$3) return exports$3;
	_dewExec$3 = true;
	var $defineProperty = dew$6();
	var hasPropertyDescriptors = /* @__PURE__ */ __name(function hasPropertyDescriptors2() {
		return !!$defineProperty;
	}, "hasPropertyDescriptors2");
	hasPropertyDescriptors.hasArrayLengthDefineBug = /* @__PURE__ */ __name(function hasArrayLengthDefineBug() {
		if (!$defineProperty) return null;
		try {
			return $defineProperty([], "length", { value: 1 }).length !== 1;
		} catch (e) {
			return true;
		}
	}, "hasArrayLengthDefineBug");
	exports$3 = hasPropertyDescriptors;
	return exports$3;
}
__name(dew$3, "dew$3");
var exports$2 = {};
var _dewExec$2 = false;
function dew$2() {
	if (_dewExec$2) return exports$2;
	_dewExec$2 = true;
	var GetIntrinsic = dew$7();
	var define = dew$4();
	var hasDescriptors = dew$3()();
	var gOPD = dew$5();
	var $TypeError = dew$e();
	var $floor = GetIntrinsic("%Math.floor%");
	exports$2 = /* @__PURE__ */ __name(function setFunctionLength(fn, length) {
		if (typeof fn !== "function") throw new $TypeError("`fn` is not a function");
		if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) throw new $TypeError("`length` must be a positive 32-bit integer");
		var loose = arguments.length > 2 && !!arguments[2];
		var functionLengthIsConfigurable = true;
		var functionLengthIsWritable = true;
		if ("length" in fn && gOPD) {
			var desc = gOPD(fn, "length");
			if (desc && !desc.configurable) functionLengthIsConfigurable = false;
			if (desc && !desc.writable) functionLengthIsWritable = false;
		}
		if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
			if (hasDescriptors) define(
				/** @type {Parameters<define>[0]} */
				fn,
				"length",
				length,
				true,
				true
			);
			else define(
				/** @type {Parameters<define>[0]} */
				fn,
				"length",
				length
			);
		}
		return fn;
	}, "setFunctionLength");
	return exports$2;
}
__name(dew$2, "dew$2");
var exports$1 = {};
var _dewExec$1 = false;
function dew$1() {
	if (_dewExec$1) return exports$1;
	_dewExec$1 = true;
	var bind = dew$9();
	var GetIntrinsic = dew$7();
	var setFunctionLength = dew$2();
	var $TypeError = dew$e();
	var $apply = GetIntrinsic("%Function.prototype.apply%");
	var $call = GetIntrinsic("%Function.prototype.call%");
	var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
	var $defineProperty = dew$6();
	var $max = GetIntrinsic("%Math.max%");
	exports$1 = /* @__PURE__ */ __name(function callBind(originalFunction) {
		if (typeof originalFunction !== "function") throw new $TypeError("a function is required");
		return setFunctionLength($reflectApply(bind, $call, arguments), 1 + $max(0, originalFunction.length - (arguments.length - 1)), true);
	}, "callBind");
	var applyBind = /* @__PURE__ */ __name(function applyBind2() {
		return $reflectApply(bind, $apply, arguments);
	}, "applyBind2");
	if ($defineProperty) $defineProperty(exports$1, "apply", { value: applyBind });
	else exports$1.apply = applyBind;
	return exports$1;
}
__name(dew$1, "dew$1");
var exports$l = {};
var _dewExec = false;
function dew() {
	if (_dewExec) return exports$l;
	_dewExec = true;
	var GetIntrinsic = dew$7();
	var callBind = dew$1();
	var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
	exports$l = /* @__PURE__ */ __name(function callBoundIntrinsic(name, allowMissing) {
		var intrinsic = GetIntrinsic(name, !!allowMissing);
		if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) return callBind(intrinsic);
		return intrinsic;
	}, "callBoundIntrinsic");
	return exports$l;
}
__name(dew, "dew");
var exports2 = {};
var _dewExec2 = false;
function dew2() {
	if (_dewExec2) return exports2;
	_dewExec2 = true;
	if (typeof Object.create === "function") exports2 = /* @__PURE__ */ __name(function inherits2(ctor, superCtor) {
		if (superCtor) {
			ctor.super_ = superCtor;
			ctor.prototype = Object.create(superCtor.prototype, { constructor: {
				value: ctor,
				enumerable: false,
				writable: true,
				configurable: true
			} });
		}
	}, "inherits2");
	else exports2 = /* @__PURE__ */ __name(function inherits2(ctor, superCtor) {
		if (superCtor) {
			ctor.super_ = superCtor;
			var TempCtor = /* @__PURE__ */ __name(function() {}, "TempCtor");
			TempCtor.prototype = superCtor.prototype;
			ctor.prototype = new TempCtor();
			ctor.prototype.constructor = ctor;
		}
	}, "inherits2");
	return exports2;
}
__name(dew2, "dew2");
function unimplemented(name) {
	throw new Error("Node.js process " + name + " is not supported by JSPM core outside of Node.js");
}
__name(unimplemented, "unimplemented");
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
	if (!draining || !currentQueue) return;
	draining = false;
	if (currentQueue.length) queue = currentQueue.concat(queue);
	else queueIndex = -1;
	if (queue.length) drainQueue();
}
__name(cleanUpNextTick, "cleanUpNextTick");
function drainQueue() {
	if (draining) return;
	var timeout = setTimeout(cleanUpNextTick, 0);
	draining = true;
	var len = queue.length;
	while (len) {
		currentQueue = queue;
		queue = [];
		while (++queueIndex < len) if (currentQueue) currentQueue[queueIndex].run();
		queueIndex = -1;
		len = queue.length;
	}
	currentQueue = null;
	draining = false;
	clearTimeout(timeout);
}
__name(drainQueue, "drainQueue");
function nextTick(fun) {
	var args = new Array(arguments.length - 1);
	if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
	queue.push(new Item(fun, args));
	if (queue.length === 1 && !draining) setTimeout(drainQueue, 0);
}
__name(nextTick, "nextTick");
function Item(fun, array) {
	this.fun = fun;
	this.array = array;
}
__name(Item, "Item");
Item.prototype.run = function() {
	this.fun.apply(null, this.array);
};
var title = "browser";
var arch = "x64";
var platform = "browser";
var env = {
	PATH: "/usr/bin",
	LANG: navigator.language + ".UTF-8",
	PWD: "/",
	HOME: "/home",
	TMP: "/tmp"
};
var argv = ["/usr/bin/node"];
var execArgv = [];
var version = "v16.8.0";
var versions = {};
var emitWarning = /* @__PURE__ */ __name(function(message, type) {
	console.warn((type ? type + ": " : "") + message);
}, "emitWarning");
var binding = /* @__PURE__ */ __name(function(name) {
	unimplemented("binding");
}, "binding");
var umask = /* @__PURE__ */ __name(function(mask) {
	return 0;
}, "umask");
var cwd = /* @__PURE__ */ __name(function() {
	return "/";
}, "cwd");
var chdir = /* @__PURE__ */ __name(function(dir) {}, "chdir");
var release = {
	name: "node",
	sourceUrl: "",
	headersUrl: "",
	libUrl: ""
};
function noop() {}
__name(noop, "noop");
var _rawDebug = noop;
var moduleLoadList = [];
function _linkedBinding(name) {
	unimplemented("_linkedBinding");
}
__name(_linkedBinding, "_linkedBinding");
var domain = {};
var _exiting = false;
var config = {};
function dlopen(name) {
	unimplemented("dlopen");
}
__name(dlopen, "dlopen");
function _getActiveRequests() {
	return [];
}
__name(_getActiveRequests, "_getActiveRequests");
function _getActiveHandles() {
	return [];
}
__name(_getActiveHandles, "_getActiveHandles");
var reallyExit = noop;
var _kill = noop;
var cpuUsage = /* @__PURE__ */ __name(function() {
	return {};
}, "cpuUsage");
var resourceUsage = cpuUsage;
var memoryUsage = cpuUsage;
var kill = noop;
var exit = noop;
var openStdin = noop;
var allowedNodeEnvironmentFlags = {};
function assert(condition, message) {
	if (!condition) throw new Error(message || "assertion error");
}
__name(assert, "assert");
var features = {
	inspector: false,
	debug: false,
	uv: false,
	ipv6: false,
	tls_alpn: false,
	tls_sni: false,
	tls_ocsp: false,
	tls: false,
	cached_builtins: true
};
var _fatalExceptions = noop;
var setUncaughtExceptionCaptureCallback = noop;
function hasUncaughtExceptionCaptureCallback() {
	return false;
}
__name(hasUncaughtExceptionCaptureCallback, "hasUncaughtExceptionCaptureCallback");
var _tickCallback = noop;
var _debugProcess = noop;
var _debugEnd = noop;
var _startProfilerIdleNotifier = noop;
var _stopProfilerIdleNotifier = noop;
var stdout = void 0;
var stderr = void 0;
var stdin = void 0;
var abort = noop;
var pid = 2;
var ppid = 1;
var execPath = "/bin/usr/node";
var debugPort = 9229;
var argv0 = "node";
var _preload_modules = [];
var setSourceMapsEnabled = noop;
var _performance = {
	now: typeof performance !== "undefined" ? performance.now.bind(performance) : void 0,
	timing: typeof performance !== "undefined" ? performance.timing : void 0
};
if (_performance.now === void 0) {
	nowOffset = Date.now();
	if (_performance.timing && _performance.timing.navigationStart) nowOffset = _performance.timing.navigationStart;
	_performance.now = () => Date.now() - nowOffset;
}
var nowOffset;
function uptime() {
	return _performance.now() / 1e3;
}
__name(uptime, "uptime");
var nanoPerSec = 1e9;
function hrtime(previousTimestamp) {
	var baseNow = Math.floor((Date.now() - _performance.now()) * .001);
	var clocktime = _performance.now() * .001;
	var seconds = Math.floor(clocktime) + baseNow;
	var nanoseconds = Math.floor(clocktime % 1 * 1e9);
	if (previousTimestamp) {
		seconds = seconds - previousTimestamp[0];
		nanoseconds = nanoseconds - previousTimestamp[1];
		if (nanoseconds < 0) {
			seconds--;
			nanoseconds += nanoPerSec;
		}
	}
	return [seconds, nanoseconds];
}
__name(hrtime, "hrtime");
hrtime.bigint = function(time) {
	var diff = hrtime(time);
	if (typeof BigInt === "undefined") return diff[0] * nanoPerSec + diff[1];
	return BigInt(diff[0] * nanoPerSec) + BigInt(diff[1]);
};
var _maxListeners = 10;
var _events = {};
var _eventsCount = 0;
function on() {
	return process;
}
__name(on, "on");
var addListener = on;
var once = on;
var off = on;
var removeListener = on;
var removeAllListeners = on;
var emit = noop;
var prependListener = on;
var prependOnceListener = on;
function listeners(name) {
	return [];
}
__name(listeners, "listeners");
var process = {
	version,
	versions,
	arch,
	platform,
	release,
	_rawDebug,
	moduleLoadList,
	binding,
	_linkedBinding,
	_events,
	_eventsCount,
	_maxListeners,
	on,
	addListener,
	once,
	off,
	removeListener,
	removeAllListeners,
	emit,
	prependListener,
	prependOnceListener,
	listeners,
	domain,
	_exiting,
	config,
	dlopen,
	uptime,
	_getActiveRequests,
	_getActiveHandles,
	reallyExit,
	_kill,
	cpuUsage,
	resourceUsage,
	memoryUsage,
	kill,
	exit,
	openStdin,
	allowedNodeEnvironmentFlags,
	assert,
	features,
	_fatalExceptions,
	setUncaughtExceptionCaptureCallback,
	hasUncaughtExceptionCaptureCallback,
	emitWarning,
	nextTick,
	_tickCallback,
	_debugProcess,
	_debugEnd,
	_startProfilerIdleNotifier,
	_stopProfilerIdleNotifier,
	stdout,
	stdin,
	stderr,
	abort,
	umask,
	chdir,
	cwd,
	env,
	title,
	argv,
	execArgv,
	pid,
	ppid,
	execPath,
	debugPort,
	hrtime,
	argv0,
	_preload_modules,
	setSourceMapsEnabled
};
var exports$c2 = {};
var _dewExec$b2 = false;
function dew$b2() {
	if (_dewExec$b2) return exports$c2;
	_dewExec$b2 = true;
	var hasSymbols = dew$k();
	exports$c2 = /* @__PURE__ */ __name(function hasToStringTagShams() {
		return hasSymbols() && !!Symbol.toStringTag;
	}, "hasToStringTagShams");
	return exports$c2;
}
__name(dew$b2, "dew$b2");
var exports$b2 = {};
var _dewExec$a2 = false;
function dew$a2() {
	if (_dewExec$a2) return exports$b2;
	_dewExec$a2 = true;
	var hasToStringTag = dew$b2()();
	var $toString = dew()("Object.prototype.toString");
	var isStandardArguments = /* @__PURE__ */ __name(function isArguments(value) {
		if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) return false;
		return $toString(value) === "[object Arguments]";
	}, "isArguments");
	var isLegacyArguments = /* @__PURE__ */ __name(function isArguments(value) {
		if (isStandardArguments(value)) return true;
		return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && $toString(value.callee) === "[object Function]";
	}, "isArguments");
	var supportsStandardArguments = (function() {
		return isStandardArguments(arguments);
	})();
	isStandardArguments.isLegacyArguments = isLegacyArguments;
	exports$b2 = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
	return exports$b2;
}
__name(dew$a2, "dew$a2");
var exports$a2 = {};
var _dewExec$92 = false;
function dew$92() {
	if (_dewExec$92) return exports$a2;
	_dewExec$92 = true;
	var toStr = Object.prototype.toString;
	var fnToStr = Function.prototype.toString;
	var isFnRegex = /^\s*(?:function)?\*/;
	var hasToStringTag = dew$b2()();
	var getProto = Object.getPrototypeOf;
	var getGeneratorFunc = /* @__PURE__ */ __name(function() {
		if (!hasToStringTag) return false;
		try {
			return Function("return function*() {}")();
		} catch (e) {}
	}, "getGeneratorFunc");
	var GeneratorFunction;
	exports$a2 = /* @__PURE__ */ __name(function isGeneratorFunction(fn) {
		if (typeof fn !== "function") return false;
		if (isFnRegex.test(fnToStr.call(fn))) return true;
		if (!hasToStringTag) return toStr.call(fn) === "[object GeneratorFunction]";
		if (!getProto) return false;
		if (typeof GeneratorFunction === "undefined") {
			var generatorFunc = getGeneratorFunc();
			GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
		}
		return getProto(fn) === GeneratorFunction;
	}, "isGeneratorFunction");
	return exports$a2;
}
__name(dew$92, "dew$92");
var exports$92 = {};
var _dewExec$82 = false;
function dew$82() {
	if (_dewExec$82) return exports$92;
	_dewExec$82 = true;
	var fnToStr = Function.prototype.toString;
	var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
	var badArrayLike;
	var isCallableMarker;
	if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") try {
		badArrayLike = Object.defineProperty({}, "length", { get: /* @__PURE__ */ __name(function() {
			throw isCallableMarker;
		}, "get") });
		isCallableMarker = {};
		reflectApply(function() {
			throw 42;
		}, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) reflectApply = null;
	}
	else reflectApply = null;
	var constructorRegex = /^\s*class\b/;
	var isES6ClassFn = /* @__PURE__ */ __name(function isES6ClassFunction(value) {
		try {
			var fnStr = fnToStr.call(value);
			return constructorRegex.test(fnStr);
		} catch (e) {
			return false;
		}
	}, "isES6ClassFunction");
	var tryFunctionObject = /* @__PURE__ */ __name(function tryFunctionToStr(value) {
		try {
			if (isES6ClassFn(value)) return false;
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	}, "tryFunctionToStr");
	var toStr = Object.prototype.toString;
	var objectClass = "[object Object]";
	var fnClass = "[object Function]";
	var genClass = "[object GeneratorFunction]";
	var ddaClass = "[object HTMLAllCollection]";
	var ddaClass2 = "[object HTML document.all class]";
	var ddaClass3 = "[object HTMLCollection]";
	var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
	var isIE68 = !(0 in [,]);
	var isDDA = /* @__PURE__ */ __name(function isDocumentDotAll() {
		return false;
	}, "isDocumentDotAll");
	if (typeof document === "object") {
		var all = document.all;
		if (toStr.call(all) === toStr.call(document.all)) isDDA = /* @__PURE__ */ __name(function isDocumentDotAll(value) {
			if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) try {
				var str = toStr.call(value);
				return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
			} catch (e) {}
			return false;
		}, "isDocumentDotAll");
	}
	exports$92 = reflectApply ? /* @__PURE__ */ __name(function isCallable(value) {
		if (isDDA(value)) return true;
		if (!value) return false;
		if (typeof value !== "function" && typeof value !== "object") return false;
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) return false;
		}
		return !isES6ClassFn(value) && tryFunctionObject(value);
	}, "isCallable") : /* @__PURE__ */ __name(function isCallable(value) {
		if (isDDA(value)) return true;
		if (!value) return false;
		if (typeof value !== "function" && typeof value !== "object") return false;
		if (hasToStringTag) return tryFunctionObject(value);
		if (isES6ClassFn(value)) return false;
		var strClass = toStr.call(value);
		if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) return false;
		return tryFunctionObject(value);
	}, "isCallable");
	return exports$92;
}
__name(dew$82, "dew$82");
var exports$82 = {};
var _dewExec$72 = false;
function dew$72() {
	if (_dewExec$72) return exports$82;
	_dewExec$72 = true;
	var isCallable = dew$82();
	var toStr = Object.prototype.toString;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var forEachArray = /* @__PURE__ */ __name(function forEachArray2(array, iterator, receiver) {
		for (var i = 0, len = array.length; i < len; i++) if (hasOwnProperty.call(array, i)) {
			if (receiver == null) iterator(array[i], i, array);
			else iterator.call(receiver, array[i], i, array);
		}
	}, "forEachArray2");
	var forEachString = /* @__PURE__ */ __name(function forEachString2(string, iterator, receiver) {
		for (var i = 0, len = string.length; i < len; i++) if (receiver == null) iterator(string.charAt(i), i, string);
		else iterator.call(receiver, string.charAt(i), i, string);
	}, "forEachString2");
	var forEachObject = /* @__PURE__ */ __name(function forEachObject2(object, iterator, receiver) {
		for (var k in object) if (hasOwnProperty.call(object, k)) {
			if (receiver == null) iterator(object[k], k, object);
			else iterator.call(receiver, object[k], k, object);
		}
	}, "forEachObject2");
	exports$82 = /* @__PURE__ */ __name(function forEach2(list, iterator, thisArg) {
		if (!isCallable(iterator)) throw new TypeError("iterator must be a function");
		var receiver;
		if (arguments.length >= 3) receiver = thisArg;
		if (toStr.call(list) === "[object Array]") forEachArray(list, iterator, receiver);
		else if (typeof list === "string") forEachString(list, iterator, receiver);
		else forEachObject(list, iterator, receiver);
	}, "forEach2");
	return exports$82;
}
__name(dew$72, "dew$72");
var exports$72 = {};
var _dewExec$62 = false;
function dew$62() {
	if (_dewExec$62) return exports$72;
	_dewExec$62 = true;
	exports$72 = [
		"Float32Array",
		"Float64Array",
		"Int8Array",
		"Int16Array",
		"Int32Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Uint16Array",
		"Uint32Array",
		"BigInt64Array",
		"BigUint64Array"
	];
	return exports$72;
}
__name(dew$62, "dew$62");
var exports$62 = {};
var _dewExec$52 = false;
var _global$2 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : globalThis;
function dew$52() {
	if (_dewExec$52) return exports$62;
	_dewExec$52 = true;
	var possibleNames = dew$62();
	var g = typeof globalThis === "undefined" ? _global$2 : globalThis;
	exports$62 = /* @__PURE__ */ __name(function availableTypedArrays() {
		var out = [];
		for (var i = 0; i < possibleNames.length; i++) if (typeof g[possibleNames[i]] === "function") out[out.length] = possibleNames[i];
		return out;
	}, "availableTypedArrays");
	return exports$62;
}
__name(dew$52, "dew$52");
var exports$52 = {};
var _dewExec$42 = false;
var _global$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : globalThis;
function dew$42() {
	if (_dewExec$42) return exports$52;
	_dewExec$42 = true;
	var forEach = dew$72();
	var availableTypedArrays = dew$52();
	var callBind = dew$1();
	var callBound = dew();
	var gOPD = dew$5();
	var $toString = callBound("Object.prototype.toString");
	var hasToStringTag = dew$b2()();
	var g = typeof globalThis === "undefined" ? _global$1 : globalThis;
	var typedArrays = availableTypedArrays();
	var $slice = callBound("String.prototype.slice");
	var getPrototypeOf = Object.getPrototypeOf;
	var $indexOf = callBound("Array.prototype.indexOf", true) || /* @__PURE__ */ __name(function indexOf(array, value) {
		for (var i = 0; i < array.length; i += 1) if (array[i] === value) return i;
		return -1;
	}, "indexOf");
	var cache = { __proto__: null };
	if (hasToStringTag && gOPD && getPrototypeOf) forEach(typedArrays, function(typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) descriptor = gOPD(getPrototypeOf(proto), Symbol.toStringTag);
			cache["$" + typedArray] = callBind(descriptor.get);
		}
	});
	else forEach(typedArrays, function(typedArray) {
		var arr = new g[typedArray]();
		var fn = arr.slice || arr.set;
		if (fn) cache["$" + typedArray] = callBind(fn);
	});
	var tryTypedArrays = /* @__PURE__ */ __name(function tryAllTypedArrays(value) {
		var found = false;
		forEach(
			/** @type {Record<`\$${TypedArrayName}`, Getter>} */
			/** @type {any} */
			cache,
			/** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
			function(getter, typedArray) {
				if (!found) try {
					if ("$" + getter(value) === typedArray) found = $slice(typedArray, 1);
				} catch (e) {}
			}
		);
		return found;
	}, "tryAllTypedArrays");
	var trySlices = /* @__PURE__ */ __name(function tryAllSlices(value) {
		var found = false;
		forEach(
			/** @type {Record<`\$${TypedArrayName}`, Getter>} */
			/** @type {any} */
			cache,
			/** @type {(getter: typeof cache, name: `\$${import('.').TypedArrayName}`) => void} */
			function(getter, name) {
				if (!found) try {
					getter(value);
					found = $slice(name, 1);
				} catch (e) {}
			}
		);
		return found;
	}, "tryAllSlices");
	exports$52 = /* @__PURE__ */ __name(function whichTypedArray(value) {
		if (!value || typeof value !== "object") return false;
		if (!hasToStringTag) {
			var tag = $slice($toString(value), 8, -1);
			if ($indexOf(typedArrays, tag) > -1) return tag;
			if (tag !== "Object") return false;
			return trySlices(value);
		}
		if (!gOPD) return null;
		return tryTypedArrays(value);
	}, "whichTypedArray");
	return exports$52;
}
__name(dew$42, "dew$42");
var exports$42 = {};
var _dewExec$32 = false;
function dew$32() {
	if (_dewExec$32) return exports$42;
	_dewExec$32 = true;
	var whichTypedArray = dew$42();
	exports$42 = /* @__PURE__ */ __name(function isTypedArray(value) {
		return !!whichTypedArray(value);
	}, "isTypedArray");
	return exports$42;
}
__name(dew$32, "dew$32");
var exports$32 = {};
var _dewExec$22 = false;
function dew$22() {
	if (_dewExec$22) return exports$32;
	_dewExec$22 = true;
	var isArgumentsObject = dew$a2();
	var isGeneratorFunction = dew$92();
	var whichTypedArray = dew$42();
	var isTypedArray = dew$32();
	function uncurryThis(f) {
		return f.call.bind(f);
	}
	__name(uncurryThis, "uncurryThis");
	var BigIntSupported = typeof BigInt !== "undefined";
	var SymbolSupported = typeof Symbol !== "undefined";
	var ObjectToString = uncurryThis(Object.prototype.toString);
	var numberValue = uncurryThis(Number.prototype.valueOf);
	var stringValue = uncurryThis(String.prototype.valueOf);
	var booleanValue = uncurryThis(Boolean.prototype.valueOf);
	if (BigIntSupported) var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
	if (SymbolSupported) var symbolValue = uncurryThis(Symbol.prototype.valueOf);
	function checkBoxedPrimitive(value, prototypeValueOf) {
		if (typeof value !== "object") return false;
		try {
			prototypeValueOf(value);
			return true;
		} catch (e) {
			return false;
		}
	}
	__name(checkBoxedPrimitive, "checkBoxedPrimitive");
	exports$32.isArgumentsObject = isArgumentsObject;
	exports$32.isGeneratorFunction = isGeneratorFunction;
	exports$32.isTypedArray = isTypedArray;
	function isPromise(input) {
		return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
	}
	__name(isPromise, "isPromise");
	exports$32.isPromise = isPromise;
	function isArrayBufferView(value) {
		if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) return ArrayBuffer.isView(value);
		return isTypedArray(value) || isDataView(value);
	}
	__name(isArrayBufferView, "isArrayBufferView");
	exports$32.isArrayBufferView = isArrayBufferView;
	function isUint8Array(value) {
		return whichTypedArray(value) === "Uint8Array";
	}
	__name(isUint8Array, "isUint8Array");
	exports$32.isUint8Array = isUint8Array;
	function isUint8ClampedArray(value) {
		return whichTypedArray(value) === "Uint8ClampedArray";
	}
	__name(isUint8ClampedArray, "isUint8ClampedArray");
	exports$32.isUint8ClampedArray = isUint8ClampedArray;
	function isUint16Array(value) {
		return whichTypedArray(value) === "Uint16Array";
	}
	__name(isUint16Array, "isUint16Array");
	exports$32.isUint16Array = isUint16Array;
	function isUint32Array(value) {
		return whichTypedArray(value) === "Uint32Array";
	}
	__name(isUint32Array, "isUint32Array");
	exports$32.isUint32Array = isUint32Array;
	function isInt8Array(value) {
		return whichTypedArray(value) === "Int8Array";
	}
	__name(isInt8Array, "isInt8Array");
	exports$32.isInt8Array = isInt8Array;
	function isInt16Array(value) {
		return whichTypedArray(value) === "Int16Array";
	}
	__name(isInt16Array, "isInt16Array");
	exports$32.isInt16Array = isInt16Array;
	function isInt32Array(value) {
		return whichTypedArray(value) === "Int32Array";
	}
	__name(isInt32Array, "isInt32Array");
	exports$32.isInt32Array = isInt32Array;
	function isFloat32Array(value) {
		return whichTypedArray(value) === "Float32Array";
	}
	__name(isFloat32Array, "isFloat32Array");
	exports$32.isFloat32Array = isFloat32Array;
	function isFloat64Array(value) {
		return whichTypedArray(value) === "Float64Array";
	}
	__name(isFloat64Array, "isFloat64Array");
	exports$32.isFloat64Array = isFloat64Array;
	function isBigInt64Array(value) {
		return whichTypedArray(value) === "BigInt64Array";
	}
	__name(isBigInt64Array, "isBigInt64Array");
	exports$32.isBigInt64Array = isBigInt64Array;
	function isBigUint64Array(value) {
		return whichTypedArray(value) === "BigUint64Array";
	}
	__name(isBigUint64Array, "isBigUint64Array");
	exports$32.isBigUint64Array = isBigUint64Array;
	function isMapToString(value) {
		return ObjectToString(value) === "[object Map]";
	}
	__name(isMapToString, "isMapToString");
	isMapToString.working = typeof Map !== "undefined" && isMapToString(/* @__PURE__ */ new Map());
	function isMap(value) {
		if (typeof Map === "undefined") return false;
		return isMapToString.working ? isMapToString(value) : value instanceof Map;
	}
	__name(isMap, "isMap");
	exports$32.isMap = isMap;
	function isSetToString(value) {
		return ObjectToString(value) === "[object Set]";
	}
	__name(isSetToString, "isSetToString");
	isSetToString.working = typeof Set !== "undefined" && isSetToString(/* @__PURE__ */ new Set());
	function isSet(value) {
		if (typeof Set === "undefined") return false;
		return isSetToString.working ? isSetToString(value) : value instanceof Set;
	}
	__name(isSet, "isSet");
	exports$32.isSet = isSet;
	function isWeakMapToString(value) {
		return ObjectToString(value) === "[object WeakMap]";
	}
	__name(isWeakMapToString, "isWeakMapToString");
	isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(/* @__PURE__ */ new WeakMap());
	function isWeakMap(value) {
		if (typeof WeakMap === "undefined") return false;
		return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
	}
	__name(isWeakMap, "isWeakMap");
	exports$32.isWeakMap = isWeakMap;
	function isWeakSetToString(value) {
		return ObjectToString(value) === "[object WeakSet]";
	}
	__name(isWeakSetToString, "isWeakSetToString");
	isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(/* @__PURE__ */ new WeakSet());
	function isWeakSet(value) {
		return isWeakSetToString(value);
	}
	__name(isWeakSet, "isWeakSet");
	exports$32.isWeakSet = isWeakSet;
	function isArrayBufferToString(value) {
		return ObjectToString(value) === "[object ArrayBuffer]";
	}
	__name(isArrayBufferToString, "isArrayBufferToString");
	isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(/* @__PURE__ */ new ArrayBuffer());
	function isArrayBuffer(value) {
		if (typeof ArrayBuffer === "undefined") return false;
		return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
	}
	__name(isArrayBuffer, "isArrayBuffer");
	exports$32.isArrayBuffer = isArrayBuffer;
	function isDataViewToString(value) {
		return ObjectToString(value) === "[object DataView]";
	}
	__name(isDataViewToString, "isDataViewToString");
	isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(/* @__PURE__ */ new ArrayBuffer(1), 0, 1));
	function isDataView(value) {
		if (typeof DataView === "undefined") return false;
		return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
	}
	__name(isDataView, "isDataView");
	exports$32.isDataView = isDataView;
	var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
	function isSharedArrayBufferToString(value) {
		return ObjectToString(value) === "[object SharedArrayBuffer]";
	}
	__name(isSharedArrayBufferToString, "isSharedArrayBufferToString");
	function isSharedArrayBuffer(value) {
		if (typeof SharedArrayBufferCopy === "undefined") return false;
		if (typeof isSharedArrayBufferToString.working === "undefined") isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
		return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
	}
	__name(isSharedArrayBuffer, "isSharedArrayBuffer");
	exports$32.isSharedArrayBuffer = isSharedArrayBuffer;
	function isAsyncFunction(value) {
		return ObjectToString(value) === "[object AsyncFunction]";
	}
	__name(isAsyncFunction, "isAsyncFunction");
	exports$32.isAsyncFunction = isAsyncFunction;
	function isMapIterator(value) {
		return ObjectToString(value) === "[object Map Iterator]";
	}
	__name(isMapIterator, "isMapIterator");
	exports$32.isMapIterator = isMapIterator;
	function isSetIterator(value) {
		return ObjectToString(value) === "[object Set Iterator]";
	}
	__name(isSetIterator, "isSetIterator");
	exports$32.isSetIterator = isSetIterator;
	function isGeneratorObject(value) {
		return ObjectToString(value) === "[object Generator]";
	}
	__name(isGeneratorObject, "isGeneratorObject");
	exports$32.isGeneratorObject = isGeneratorObject;
	function isWebAssemblyCompiledModule(value) {
		return ObjectToString(value) === "[object WebAssembly.Module]";
	}
	__name(isWebAssemblyCompiledModule, "isWebAssemblyCompiledModule");
	exports$32.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
	function isNumberObject(value) {
		return checkBoxedPrimitive(value, numberValue);
	}
	__name(isNumberObject, "isNumberObject");
	exports$32.isNumberObject = isNumberObject;
	function isStringObject(value) {
		return checkBoxedPrimitive(value, stringValue);
	}
	__name(isStringObject, "isStringObject");
	exports$32.isStringObject = isStringObject;
	function isBooleanObject(value) {
		return checkBoxedPrimitive(value, booleanValue);
	}
	__name(isBooleanObject, "isBooleanObject");
	exports$32.isBooleanObject = isBooleanObject;
	function isBigIntObject(value) {
		return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
	}
	__name(isBigIntObject, "isBigIntObject");
	exports$32.isBigIntObject = isBigIntObject;
	function isSymbolObject(value) {
		return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
	}
	__name(isSymbolObject, "isSymbolObject");
	exports$32.isSymbolObject = isSymbolObject;
	function isBoxedPrimitive(value) {
		return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
	}
	__name(isBoxedPrimitive, "isBoxedPrimitive");
	exports$32.isBoxedPrimitive = isBoxedPrimitive;
	function isAnyArrayBuffer(value) {
		return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
	}
	__name(isAnyArrayBuffer, "isAnyArrayBuffer");
	exports$32.isAnyArrayBuffer = isAnyArrayBuffer;
	[
		"isProxy",
		"isExternal",
		"isModuleNamespaceObject"
	].forEach(function(method) {
		Object.defineProperty(exports$32, method, {
			enumerable: false,
			value: /* @__PURE__ */ __name(function() {
				throw new Error(method + " is not supported in userland");
			}, "value")
		});
	});
	return exports$32;
}
__name(dew$22, "dew$22");
var exports$22 = {};
var _dewExec$12 = false;
function dew$12() {
	if (_dewExec$12) return exports$22;
	_dewExec$12 = true;
	exports$22 = /* @__PURE__ */ __name(function isBuffer2(arg) {
		return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
	}, "isBuffer2");
	return exports$22;
}
__name(dew$12, "dew$12");
var exports$12 = {};
var _dewExec3 = false;
var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : globalThis;
function dew3() {
	if (_dewExec3) return exports$12;
	_dewExec3 = true;
	var process$1 = process;
	var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || /* @__PURE__ */ __name(function getOwnPropertyDescriptors2(obj) {
		var keys = Object.keys(obj);
		var descriptors = {};
		for (var i = 0; i < keys.length; i++) descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
		return descriptors;
	}, "getOwnPropertyDescriptors2");
	var formatRegExp = /%[sdj%]/g;
	exports$12.format = function(f) {
		if (!isString2(f)) {
			var objects = [];
			for (var i = 0; i < arguments.length; i++) objects.push(inspect2(arguments[i]));
			return objects.join(" ");
		}
		var i = 1;
		var args = arguments;
		var len = args.length;
		var str = String(f).replace(formatRegExp, function(x2) {
			if (x2 === "%%") return "%";
			if (i >= len) return x2;
			switch (x2) {
				case "%s": return String(args[i++]);
				case "%d": return Number(args[i++]);
				case "%j": try {
					return JSON.stringify(args[i++]);
				} catch (_) {
					return "[Circular]";
				}
				default: return x2;
			}
		});
		for (var x = args[i]; i < len; x = args[++i]) if (isNull2(x) || !isObject2(x)) str += " " + x;
		else str += " " + inspect2(x);
		return str;
	};
	exports$12.deprecate = function(fn, msg) {
		if (typeof process$1 !== "undefined" && process$1.noDeprecation === true) return fn;
		if (typeof process$1 === "undefined") return function() {
			return exports$12.deprecate(fn, msg).apply(this || _global, arguments);
		};
		var warned = false;
		function deprecated() {
			if (!warned) {
				if (process$1.throwDeprecation) throw new Error(msg);
				else if (process$1.traceDeprecation) console.trace(msg);
				else console.error(msg);
				warned = true;
			}
			return fn.apply(this || _global, arguments);
		}
		__name(deprecated, "deprecated");
		return deprecated;
	};
	var debugs = {};
	var debugEnvRegex = /^$/;
	if (process$1.env.NODE_DEBUG) {
		var debugEnv = process$1.env.NODE_DEBUG;
		debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
		debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
	}
	exports$12.debuglog = function(set) {
		set = set.toUpperCase();
		if (!debugs[set]) {
			if (debugEnvRegex.test(set)) {
				var pid2 = process$1.pid;
				debugs[set] = function() {
					var msg = exports$12.format.apply(exports$12, arguments);
					console.error("%s %d: %s", set, pid2, msg);
				};
			} else debugs[set] = function() {};
		}
		return debugs[set];
	};
	function inspect2(obj, opts) {
		var ctx = {
			seen: [],
			stylize: stylizeNoColor
		};
		if (arguments.length >= 3) ctx.depth = arguments[2];
		if (arguments.length >= 4) ctx.colors = arguments[3];
		if (isBoolean2(opts)) ctx.showHidden = opts;
		else if (opts) exports$12._extend(ctx, opts);
		if (isUndefined2(ctx.showHidden)) ctx.showHidden = false;
		if (isUndefined2(ctx.depth)) ctx.depth = 2;
		if (isUndefined2(ctx.colors)) ctx.colors = false;
		if (isUndefined2(ctx.customInspect)) ctx.customInspect = true;
		if (ctx.colors) ctx.stylize = stylizeWithColor;
		return formatValue(ctx, obj, ctx.depth);
	}
	__name(inspect2, "inspect2");
	exports$12.inspect = inspect2;
	inspect2.colors = {
		"bold": [1, 22],
		"italic": [3, 23],
		"underline": [4, 24],
		"inverse": [7, 27],
		"white": [37, 39],
		"grey": [90, 39],
		"black": [30, 39],
		"blue": [34, 39],
		"cyan": [36, 39],
		"green": [32, 39],
		"magenta": [35, 39],
		"red": [31, 39],
		"yellow": [33, 39]
	};
	inspect2.styles = {
		"special": "cyan",
		"number": "yellow",
		"boolean": "yellow",
		"undefined": "grey",
		"null": "bold",
		"string": "green",
		"date": "magenta",
		"regexp": "red"
	};
	function stylizeWithColor(str, styleType) {
		var style = inspect2.styles[styleType];
		if (style) return "\x1B[" + inspect2.colors[style][0] + "m" + str + "\x1B[" + inspect2.colors[style][1] + "m";
		else return str;
	}
	__name(stylizeWithColor, "stylizeWithColor");
	function stylizeNoColor(str, styleType) {
		return str;
	}
	__name(stylizeNoColor, "stylizeNoColor");
	function arrayToHash(array) {
		var hash = {};
		array.forEach(function(val, idx) {
			hash[val] = true;
		});
		return hash;
	}
	__name(arrayToHash, "arrayToHash");
	function formatValue(ctx, value, recurseTimes) {
		if (ctx.customInspect && value && isFunction2(value.inspect) && value.inspect !== exports$12.inspect && !(value.constructor && value.constructor.prototype === value)) {
			var ret = value.inspect(recurseTimes, ctx);
			if (!isString2(ret)) ret = formatValue(ctx, ret, recurseTimes);
			return ret;
		}
		var primitive = formatPrimitive(ctx, value);
		if (primitive) return primitive;
		var keys = Object.keys(value);
		var visibleKeys = arrayToHash(keys);
		if (ctx.showHidden) keys = Object.getOwnPropertyNames(value);
		if (isError2(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) return formatError(value);
		if (keys.length === 0) {
			if (isFunction2(value)) {
				var name = value.name ? ": " + value.name : "";
				return ctx.stylize("[Function" + name + "]", "special");
			}
			if (isRegExp2(value)) return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
			if (isDate2(value)) return ctx.stylize(Date.prototype.toString.call(value), "date");
			if (isError2(value)) return formatError(value);
		}
		var base = "", array = false, braces = ["{", "}"];
		if (isArray2(value)) {
			array = true;
			braces = ["[", "]"];
		}
		if (isFunction2(value)) base = " [Function" + (value.name ? ": " + value.name : "") + "]";
		if (isRegExp2(value)) base = " " + RegExp.prototype.toString.call(value);
		if (isDate2(value)) base = " " + Date.prototype.toUTCString.call(value);
		if (isError2(value)) base = " " + formatError(value);
		if (keys.length === 0 && (!array || value.length == 0)) return braces[0] + base + braces[1];
		if (recurseTimes < 0) {
			if (isRegExp2(value)) return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
			else return ctx.stylize("[Object]", "special");
		}
		ctx.seen.push(value);
		var output;
		if (array) output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
		else output = keys.map(function(key) {
			return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
		});
		ctx.seen.pop();
		return reduceToSingleString(output, base, braces);
	}
	__name(formatValue, "formatValue");
	function formatPrimitive(ctx, value) {
		if (isUndefined2(value)) return ctx.stylize("undefined", "undefined");
		if (isString2(value)) {
			var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, "\"") + "'";
			return ctx.stylize(simple, "string");
		}
		if (isNumber2(value)) return ctx.stylize("" + value, "number");
		if (isBoolean2(value)) return ctx.stylize("" + value, "boolean");
		if (isNull2(value)) return ctx.stylize("null", "null");
	}
	__name(formatPrimitive, "formatPrimitive");
	function formatError(value) {
		return "[" + Error.prototype.toString.call(value) + "]";
	}
	__name(formatError, "formatError");
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
		var output = [];
		for (var i = 0, l = value.length; i < l; ++i) if (hasOwnProperty(value, String(i))) output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
		else output.push("");
		keys.forEach(function(key) {
			if (!key.match(/^\d+$/)) output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
		});
		return output;
	}
	__name(formatArray, "formatArray");
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
		var name, str, desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
		if (desc.get) {
			if (desc.set) str = ctx.stylize("[Getter/Setter]", "special");
			else str = ctx.stylize("[Getter]", "special");
		} else if (desc.set) str = ctx.stylize("[Setter]", "special");
		if (!hasOwnProperty(visibleKeys, key)) name = "[" + key + "]";
		if (!str) {
			if (ctx.seen.indexOf(desc.value) < 0) {
				if (isNull2(recurseTimes)) str = formatValue(ctx, desc.value, null);
				else str = formatValue(ctx, desc.value, recurseTimes - 1);
				if (str.indexOf("\n") > -1) {
					if (array) str = str.split("\n").map(function(line) {
						return "  " + line;
					}).join("\n").slice(2);
					else str = "\n" + str.split("\n").map(function(line) {
						return "   " + line;
					}).join("\n");
				}
			} else str = ctx.stylize("[Circular]", "special");
		}
		if (isUndefined2(name)) {
			if (array && key.match(/^\d+$/)) return str;
			name = JSON.stringify("" + key);
			if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
				name = name.slice(1, -1);
				name = ctx.stylize(name, "name");
			} else {
				name = name.replace(/'/g, "\\'").replace(/\\"/g, "\"").replace(/(^"|"$)/g, "'");
				name = ctx.stylize(name, "string");
			}
		}
		return name + ": " + str;
	}
	__name(formatProperty, "formatProperty");
	function reduceToSingleString(output, base, braces) {
		if (output.reduce(function(prev, cur) {
			if (cur.indexOf("\n") >= 0);
			return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
		}, 0) > 60) return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
		return braces[0] + base + " " + output.join(", ") + " " + braces[1];
	}
	__name(reduceToSingleString, "reduceToSingleString");
	exports$12.types = dew$22();
	function isArray2(ar) {
		return Array.isArray(ar);
	}
	__name(isArray2, "isArray2");
	exports$12.isArray = isArray2;
	function isBoolean2(arg) {
		return typeof arg === "boolean";
	}
	__name(isBoolean2, "isBoolean2");
	exports$12.isBoolean = isBoolean2;
	function isNull2(arg) {
		return arg === null;
	}
	__name(isNull2, "isNull2");
	exports$12.isNull = isNull2;
	function isNullOrUndefined2(arg) {
		return arg == null;
	}
	__name(isNullOrUndefined2, "isNullOrUndefined2");
	exports$12.isNullOrUndefined = isNullOrUndefined2;
	function isNumber2(arg) {
		return typeof arg === "number";
	}
	__name(isNumber2, "isNumber2");
	exports$12.isNumber = isNumber2;
	function isString2(arg) {
		return typeof arg === "string";
	}
	__name(isString2, "isString2");
	exports$12.isString = isString2;
	function isSymbol2(arg) {
		return typeof arg === "symbol";
	}
	__name(isSymbol2, "isSymbol2");
	exports$12.isSymbol = isSymbol2;
	function isUndefined2(arg) {
		return arg === void 0;
	}
	__name(isUndefined2, "isUndefined2");
	exports$12.isUndefined = isUndefined2;
	function isRegExp2(re) {
		return isObject2(re) && objectToString(re) === "[object RegExp]";
	}
	__name(isRegExp2, "isRegExp2");
	exports$12.isRegExp = isRegExp2;
	exports$12.types.isRegExp = isRegExp2;
	function isObject2(arg) {
		return typeof arg === "object" && arg !== null;
	}
	__name(isObject2, "isObject2");
	exports$12.isObject = isObject2;
	function isDate2(d) {
		return isObject2(d) && objectToString(d) === "[object Date]";
	}
	__name(isDate2, "isDate2");
	exports$12.isDate = isDate2;
	exports$12.types.isDate = isDate2;
	function isError2(e) {
		return isObject2(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
	}
	__name(isError2, "isError2");
	exports$12.isError = isError2;
	exports$12.types.isNativeError = isError2;
	function isFunction2(arg) {
		return typeof arg === "function";
	}
	__name(isFunction2, "isFunction2");
	exports$12.isFunction = isFunction2;
	function isPrimitive2(arg) {
		return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
	}
	__name(isPrimitive2, "isPrimitive2");
	exports$12.isPrimitive = isPrimitive2;
	exports$12.isBuffer = dew$12();
	function objectToString(o) {
		return Object.prototype.toString.call(o);
	}
	__name(objectToString, "objectToString");
	function pad(n) {
		return n < 10 ? "0" + n.toString(10) : n.toString(10);
	}
	__name(pad, "pad");
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	function timestamp() {
		var d = /* @__PURE__ */ new Date();
		var time = [
			pad(d.getHours()),
			pad(d.getMinutes()),
			pad(d.getSeconds())
		].join(":");
		return [
			d.getDate(),
			months[d.getMonth()],
			time
		].join(" ");
	}
	__name(timestamp, "timestamp");
	exports$12.log = function() {
		console.log("%s - %s", timestamp(), exports$12.format.apply(exports$12, arguments));
	};
	exports$12.inherits = dew2();
	exports$12._extend = function(origin, add) {
		if (!add || !isObject2(add)) return origin;
		var keys = Object.keys(add);
		var i = keys.length;
		while (i--) origin[keys[i]] = add[keys[i]];
		return origin;
	};
	function hasOwnProperty(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	__name(hasOwnProperty, "hasOwnProperty");
	var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
	exports$12.promisify = /* @__PURE__ */ __name(function promisify2(original) {
		if (typeof original !== "function") throw new TypeError("The \"original\" argument must be of type Function");
		if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
			fn = original[kCustomPromisifiedSymbol];
			if (typeof fn !== "function") throw new TypeError("The \"util.promisify.custom\" argument must be of type Function");
			Object.defineProperty(fn, kCustomPromisifiedSymbol, {
				value: fn,
				enumerable: false,
				writable: false,
				configurable: true
			});
			return fn;
		}
		function fn() {
			var promiseResolve, promiseReject;
			var promise = new Promise(function(resolve, reject) {
				promiseResolve = resolve;
				promiseReject = reject;
			});
			var args = [];
			for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
			args.push(function(err, value) {
				if (err) promiseReject(err);
				else promiseResolve(value);
			});
			try {
				original.apply(this || _global, args);
			} catch (err) {
				promiseReject(err);
			}
			return promise;
		}
		__name(fn, "fn");
		Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
		if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
			value: fn,
			enumerable: false,
			writable: false,
			configurable: true
		});
		return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
	}, "promisify2");
	exports$12.promisify.custom = kCustomPromisifiedSymbol;
	function callbackifyOnRejected(reason, cb) {
		if (!reason) {
			var newReason = /* @__PURE__ */ new Error("Promise was rejected with a falsy value");
			newReason.reason = reason;
			reason = newReason;
		}
		return cb(reason);
	}
	__name(callbackifyOnRejected, "callbackifyOnRejected");
	function callbackify2(original) {
		if (typeof original !== "function") throw new TypeError("The \"original\" argument must be of type Function");
		function callbackified() {
			var args = [];
			for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
			var maybeCb = args.pop();
			if (typeof maybeCb !== "function") throw new TypeError("The last argument must be of type Function");
			var self2 = this || _global;
			var cb = /* @__PURE__ */ __name(function() {
				return maybeCb.apply(self2, arguments);
			}, "cb");
			original.apply(this || _global, args).then(function(ret) {
				process$1.nextTick(cb.bind(null, null, ret));
			}, function(rej) {
				process$1.nextTick(callbackifyOnRejected.bind(null, rej, cb));
			});
		}
		__name(callbackified, "callbackified");
		Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
		Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
		return callbackified;
	}
	__name(callbackify2, "callbackify2");
	exports$12.callbackify = callbackify2;
	return exports$12;
}
__name(dew3, "dew3");
var exports3 = dew3();
exports3["format"];
exports3["deprecate"];
exports3["debuglog"];
exports3["inspect"];
exports3["types"];
exports3["isArray"];
exports3["isBoolean"];
exports3["isNull"];
exports3["isNullOrUndefined"];
exports3["isNumber"];
exports3["isString"];
exports3["isSymbol"];
exports3["isUndefined"];
exports3["isRegExp"];
exports3["isObject"];
exports3["isDate"];
exports3["isError"];
exports3["isFunction"];
exports3["isPrimitive"];
exports3["isBuffer"];
exports3["log"];
exports3["inherits"];
exports3["_extend"];
exports3["promisify"];
exports3["callbackify"];
exports3._extend;
exports3.callbackify;
exports3.debuglog;
exports3.deprecate;
exports3.format;
exports3.inherits;
var inspect = exports3.inspect;
exports3.isArray;
exports3.isBoolean;
exports3.isBuffer;
exports3.isDate;
exports3.isError;
exports3.isFunction;
exports3.isNull;
exports3.isNullOrUndefined;
exports3.isNumber;
exports3.isObject;
exports3.isPrimitive;
exports3.isRegExp;
exports3.isString;
exports3.isSymbol;
exports3.isUndefined;
exports3.log;
exports3.promisify;
exports3.types;
exports3.TextEncoder = globalThis.TextEncoder;
exports3.TextDecoder = globalThis.TextDecoder;
var customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
var customInspectSymbolStackLess = Symbol.for("nodejs.util.inspect.custom.stack-less");
var _BaseError = class _BaseError extends Error {
	toJSON() {
		return {
			name: this.name,
			message: this.message
		};
	}
	[customInspectSymbol](depth, options) {
		return `${this[customInspectSymbolStackLess](depth, options)}
${this.stack.slice(this.stack.indexOf("\n"))}`;
	}
};
__name(_BaseError, "BaseError");
var BaseError = _BaseError;
var _BaseConstraintError = class _BaseConstraintError extends BaseError {
	constructor(constraint, message, given) {
		super(message);
		this.constraint = constraint;
		this.given = given;
	}
	toJSON() {
		return {
			name: this.name,
			constraint: this.constraint,
			given: this.given,
			message: this.message
		};
	}
};
__name(_BaseConstraintError, "BaseConstraintError");
var BaseConstraintError = _BaseConstraintError;
var _ExpectedConstraintError = class _ExpectedConstraintError extends BaseConstraintError {
	constructor(constraint, message, given, expected) {
		super(constraint, message, given);
		this.expected = expected;
	}
	toJSON() {
		return {
			name: this.name,
			constraint: this.constraint,
			given: this.given,
			expected: this.expected,
			message: this.message
		};
	}
	[customInspectSymbolStackLess](depth, options) {
		const constraint = options.stylize(this.constraint, "string");
		if (depth < 0) return options.stylize(`[ExpectedConstraintError: ${constraint}]`, "special");
		const newOptions = {
			...options,
			depth: options.depth === null ? null : options.depth - 1
		};
		const padding = `
  ${options.stylize("|", "undefined")} `;
		const given = inspect(this.given, newOptions).replace(/\n/g, padding);
		return `${`${options.stylize("ExpectedConstraintError", "special")} > ${constraint}`}
  ${options.stylize(this.message, "regexp")}
${`
  ${options.stylize("Expected: ", "string")}${options.stylize(this.expected, "boolean")}`}
${`
  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
__name(_ExpectedConstraintError, "ExpectedConstraintError");
var ExpectedConstraintError = _ExpectedConstraintError;
var _Result = class _Result {
	constructor(success, value, error) {
		this.success = success;
		if (success) this.value = value;
		else this.error = error;
	}
	isOk() {
		return this.success;
	}
	isErr() {
		return !this.success;
	}
	unwrap() {
		if (this.isOk()) return this.value;
		throw this.error;
	}
	static ok(value) {
		return new _Result(true, value);
	}
	static err(error) {
		return new _Result(false, void 0, error);
	}
};
__name(_Result, "Result");
var Result = _Result;
function whenConstraint(key, options, validator, validatorOptions) {
	return { run(input, parent) {
		if (!parent) return Result.err(new ExpectedConstraintError("s.object(T.when)", validatorOptions?.message ?? "Validator has no parent", parent, "Validator to have a parent"));
		const isKeyArray = Array.isArray(key);
		const predicate = resolveBooleanIs(options, isKeyArray ? key.map((k) => (0, import_get.default)(parent, k)) : (0, import_get.default)(parent, key), isKeyArray) ? options.then : options.otherwise;
		if (predicate) return predicate(validator).run(input);
		return Result.ok(input);
	} };
}
__name(whenConstraint, "whenConstraint");
function resolveBooleanIs(options, value, isKeyArray) {
	if (options.is === void 0) return isKeyArray ? !value.some((val) => !val) : Boolean(value);
	if (typeof options.is === "function") return options.is(value);
	return value === options.is;
}
__name(resolveBooleanIs, "resolveBooleanIs");
var validationEnabled = true;
function setGlobalValidationEnabled(enabled) {
	validationEnabled = enabled;
}
__name(setGlobalValidationEnabled, "setGlobalValidationEnabled");
function getGlobalValidationEnabled() {
	return validationEnabled;
}
__name(getGlobalValidationEnabled, "getGlobalValidationEnabled");
function getValue(valueOrFn) {
	return typeof valueOrFn === "function" ? valueOrFn() : valueOrFn;
}
__name(getValue, "getValue");
var _BaseValidator = class _BaseValidator {
	constructor(validatorOptions = {}, constraints = []) {
		this.constraints = [];
		this.isValidationEnabled = null;
		this.constraints = constraints;
		this.validatorOptions = validatorOptions;
	}
	setParent(parent) {
		this.parent = parent;
		return this;
	}
	optional(options = this.validatorOptions) {
		return new UnionValidator([new LiteralValidator(void 0, options), this.clone()], options);
	}
	nullable(options = this.validatorOptions) {
		return new UnionValidator([new LiteralValidator(null, options), this.clone()], options);
	}
	nullish(options = this.validatorOptions) {
		return new UnionValidator([new NullishValidator(options), this.clone()], options);
	}
	array(options = this.validatorOptions) {
		return new ArrayValidator(this.clone(), options);
	}
	set(options = this.validatorOptions) {
		return new SetValidator(this.clone(), options);
	}
	or(...predicates) {
		return new UnionValidator([this.clone(), ...predicates], this.validatorOptions);
	}
	transform(cb, options = this.validatorOptions) {
		return this.addConstraint({ run: /* @__PURE__ */ __name((input) => Result.ok(cb(input)), "run") }, options);
	}
	reshape(cb, options = this.validatorOptions) {
		return this.addConstraint({ run: cb }, options);
	}
	default(value, options = this.validatorOptions) {
		return new DefaultValidator(this.clone(), value, options);
	}
	when(key, options, validatorOptions) {
		return this.addConstraint(whenConstraint(key, options, this, validatorOptions));
	}
	describe(description) {
		const clone = this.clone();
		clone.description = description;
		return clone;
	}
	run(value) {
		let result = this.handle(value);
		if (result.isErr()) return result;
		for (const constraint of this.constraints) {
			result = constraint.run(result.value, this.parent);
			if (result.isErr()) break;
		}
		return result;
	}
	parse(value) {
		if (!this.shouldRunConstraints) return this.handle(value).unwrap();
		return this.constraints.reduce((v, constraint) => constraint.run(v).unwrap(), this.handle(value).unwrap());
	}
	is(value) {
		return this.run(value).isOk();
	}
	/**
	* Sets if the validator should also run constraints or just do basic checks.
	* @param isValidationEnabled Whether this validator should be enabled or disabled. You can pass boolean or a function returning boolean which will be called just before parsing.
	* Set to `null` to go off of the global configuration.
	*/
	setValidationEnabled(isValidationEnabled) {
		const clone = this.clone();
		clone.isValidationEnabled = isValidationEnabled;
		return clone;
	}
	getValidationEnabled() {
		return getValue(this.isValidationEnabled);
	}
	get shouldRunConstraints() {
		return getValue(this.isValidationEnabled) ?? getGlobalValidationEnabled();
	}
	clone() {
		const clone = Reflect.construct(this.constructor, [this.validatorOptions, this.constraints]);
		clone.isValidationEnabled = this.isValidationEnabled;
		return clone;
	}
	addConstraint(constraint, validatorOptions = this.validatorOptions) {
		const clone = this.clone();
		clone.validatorOptions = validatorOptions;
		clone.constraints = clone.constraints.concat(constraint);
		return clone;
	}
};
__name(_BaseValidator, "BaseValidator");
var BaseValidator = _BaseValidator;
function isUnique(input) {
	if (input.length < 2) return true;
	return (0, import_uniqWith.default)(input, import_es6.default).length === input.length;
}
__name(isUnique, "isUnique");
function lessThan(a, b) {
	return a < b;
}
__name(lessThan, "lessThan");
function lessThanOrEqual(a, b) {
	return a <= b;
}
__name(lessThanOrEqual, "lessThanOrEqual");
function greaterThan(a, b) {
	return a > b;
}
__name(greaterThan, "greaterThan");
function greaterThanOrEqual(a, b) {
	return a >= b;
}
__name(greaterThanOrEqual, "greaterThanOrEqual");
function equal(a, b) {
	return a === b;
}
__name(equal, "equal");
function notEqual(a, b) {
	return a !== b;
}
__name(notEqual, "notEqual");
function arrayLengthComparator(comparator, name, expected, length, options) {
	return { run(input) {
		return comparator(input.length, length) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid Array length", input, expected));
	} };
}
__name(arrayLengthComparator, "arrayLengthComparator");
function arrayLengthLessThan(value, options) {
	return arrayLengthComparator(lessThan, "s.array(T).lengthLessThan()", `expected.length < ${value}`, value, options);
}
__name(arrayLengthLessThan, "arrayLengthLessThan");
function arrayLengthLessThanOrEqual(value, options) {
	return arrayLengthComparator(lessThanOrEqual, "s.array(T).lengthLessThanOrEqual()", `expected.length <= ${value}`, value, options);
}
__name(arrayLengthLessThanOrEqual, "arrayLengthLessThanOrEqual");
function arrayLengthGreaterThan(value, options) {
	return arrayLengthComparator(greaterThan, "s.array(T).lengthGreaterThan()", `expected.length > ${value}`, value, options);
}
__name(arrayLengthGreaterThan, "arrayLengthGreaterThan");
function arrayLengthGreaterThanOrEqual(value, options) {
	return arrayLengthComparator(greaterThanOrEqual, "s.array(T).lengthGreaterThanOrEqual()", `expected.length >= ${value}`, value, options);
}
__name(arrayLengthGreaterThanOrEqual, "arrayLengthGreaterThanOrEqual");
function arrayLengthEqual(value, options) {
	return arrayLengthComparator(equal, "s.array(T).lengthEqual()", `expected.length === ${value}`, value, options);
}
__name(arrayLengthEqual, "arrayLengthEqual");
function arrayLengthNotEqual(value, options) {
	return arrayLengthComparator(notEqual, "s.array(T).lengthNotEqual()", `expected.length !== ${value}`, value, options);
}
__name(arrayLengthNotEqual, "arrayLengthNotEqual");
function arrayLengthRange(start, endBefore, options) {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return { run(input) {
		return input.length >= start && input.length < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.array(T).lengthRange()", options?.message ?? "Invalid Array length", input, expected));
	} };
}
__name(arrayLengthRange, "arrayLengthRange");
function arrayLengthRangeInclusive(start, end, options) {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return { run(input) {
		return input.length >= start && input.length <= end ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.array(T).lengthRangeInclusive()", options?.message ?? "Invalid Array length", input, expected));
	} };
}
__name(arrayLengthRangeInclusive, "arrayLengthRangeInclusive");
function arrayLengthRangeExclusive(startAfter, endBefore, options) {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return { run(input) {
		return input.length > startAfter && input.length < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.array(T).lengthRangeExclusive()", options?.message ?? "Invalid Array length", input, expected));
	} };
}
__name(arrayLengthRangeExclusive, "arrayLengthRangeExclusive");
function uniqueArray(options) {
	return { run(input) {
		return isUnique(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.array(T).unique()", options?.message ?? "Array values are not unique", input, "Expected all values to be unique"));
	} };
}
__name(uniqueArray, "uniqueArray");
var _CombinedPropertyError = class _CombinedPropertyError extends BaseError {
	constructor(errors, validatorOptions) {
		super(validatorOptions?.message ?? "Received one or more errors");
		this.errors = errors;
	}
	[customInspectSymbolStackLess](depth, options) {
		if (depth < 0) return options.stylize("[CombinedPropertyError]", "special");
		const newOptions = {
			...options,
			depth: options.depth === null ? null : options.depth - 1,
			compact: true
		};
		const padding = `
  ${options.stylize("|", "undefined")} `;
		return `${`${options.stylize("CombinedPropertyError", "special")} (${options.stylize(this.errors.length.toString(), "number")})`}
  ${options.stylize(this.message, "regexp")}

${this.errors.map(([key, error]) => {
			const property = _CombinedPropertyError.formatProperty(key, options);
			const body = error[customInspectSymbolStackLess](depth - 1, newOptions).replace(/\n/g, padding);
			return `  input${property}${padding}${body}`;
		}).join("\n\n")}`;
	}
	static formatProperty(key, options) {
		if (typeof key === "string") return options.stylize(`.${key}`, "symbol");
		if (typeof key === "number") return `[${options.stylize(key.toString(), "number")}]`;
		return `[${options.stylize("Symbol", "symbol")}(${key.description})]`;
	}
};
__name(_CombinedPropertyError, "CombinedPropertyError");
var CombinedPropertyError = _CombinedPropertyError;
var _ValidationError = class _ValidationError extends BaseError {
	constructor(validator, message, given) {
		super(message);
		this.validator = validator;
		this.given = given;
	}
	toJSON() {
		return {
			name: this.name,
			message: "Unknown validation error occurred.",
			validator: this.validator,
			given: this.given
		};
	}
	[customInspectSymbolStackLess](depth, options) {
		const validator = options.stylize(this.validator, "string");
		if (depth < 0) return options.stylize(`[ValidationError: ${validator}]`, "special");
		const newOptions = {
			...options,
			depth: options.depth === null ? null : options.depth - 1,
			compact: true
		};
		const padding = `
  ${options.stylize("|", "undefined")} `;
		const given = inspect(this.given, newOptions).replace(/\n/g, padding);
		return `${`${options.stylize("ValidationError", "special")} > ${validator}`}
  ${options.stylize(this.message, "regexp")}
${`
  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
__name(_ValidationError, "ValidationError");
var ValidationError = _ValidationError;
var _ArrayValidator = class _ArrayValidator extends BaseValidator {
	constructor(validator, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.validator = validator;
	}
	lengthLessThan(length, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthLessThan(length, options));
	}
	lengthLessThanOrEqual(length, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthLessThanOrEqual(length, options));
	}
	lengthGreaterThan(length, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthGreaterThan(length, options));
	}
	lengthGreaterThanOrEqual(length, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthGreaterThanOrEqual(length, options));
	}
	lengthEqual(length, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthEqual(length, options));
	}
	lengthNotEqual(length, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthNotEqual(length, options));
	}
	lengthRange(start, endBefore, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthRange(start, endBefore, options));
	}
	lengthRangeInclusive(startAt, endAt, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthRangeInclusive(startAt, endAt, options));
	}
	lengthRangeExclusive(startAfter, endBefore, options = this.validatorOptions) {
		return this.addConstraint(arrayLengthRangeExclusive(startAfter, endBefore, options));
	}
	unique(options = this.validatorOptions) {
		return this.addConstraint(uniqueArray(options));
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.validator,
			this.validatorOptions,
			this.constraints
		]);
	}
	handle(values) {
		if (!Array.isArray(values)) return Result.err(new ValidationError("s.array(T)", this.validatorOptions.message ?? "Expected an array", values));
		if (!this.shouldRunConstraints) return Result.ok(values);
		const errors = [];
		const transformed = [];
		for (let i = 0; i < values.length; i++) {
			const result = this.validator.run(values[i]);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([i, result.error]);
		}
		return errors.length === 0 ? Result.ok(transformed) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
};
__name(_ArrayValidator, "ArrayValidator");
var ArrayValidator = _ArrayValidator;
function bigintComparator(comparator, name, expected, number, options) {
	return { run(input) {
		return comparator(input, number) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid bigint value", input, expected));
	} };
}
__name(bigintComparator, "bigintComparator");
function bigintLessThan(value, options) {
	return bigintComparator(lessThan, "s.bigint().lessThan()", `expected < ${value}n`, value, options);
}
__name(bigintLessThan, "bigintLessThan");
function bigintLessThanOrEqual(value, options) {
	return bigintComparator(lessThanOrEqual, "s.bigint().lessThanOrEqual()", `expected <= ${value}n`, value, options);
}
__name(bigintLessThanOrEqual, "bigintLessThanOrEqual");
function bigintGreaterThan(value, options) {
	return bigintComparator(greaterThan, "s.bigint().greaterThan()", `expected > ${value}n`, value, options);
}
__name(bigintGreaterThan, "bigintGreaterThan");
function bigintGreaterThanOrEqual(value, options) {
	return bigintComparator(greaterThanOrEqual, "s.bigint().greaterThanOrEqual()", `expected >= ${value}n`, value, options);
}
__name(bigintGreaterThanOrEqual, "bigintGreaterThanOrEqual");
function bigintEqual(value, options) {
	return bigintComparator(equal, "s.bigint().equal()", `expected === ${value}n`, value, options);
}
__name(bigintEqual, "bigintEqual");
function bigintNotEqual(value, options) {
	return bigintComparator(notEqual, "s.bigint().notEqual()", `expected !== ${value}n`, value, options);
}
__name(bigintNotEqual, "bigintNotEqual");
function bigintDivisibleBy(divider, options) {
	const expected = `expected % ${divider}n === 0n`;
	return { run(input) {
		return input % divider === 0n ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.bigint().divisibleBy()", options?.message ?? "BigInt is not divisible", input, expected));
	} };
}
__name(bigintDivisibleBy, "bigintDivisibleBy");
var _BigIntValidator = class _BigIntValidator extends BaseValidator {
	lessThan(number, options = this.validatorOptions) {
		return this.addConstraint(bigintLessThan(number, options));
	}
	lessThanOrEqual(number, options = this.validatorOptions) {
		return this.addConstraint(bigintLessThanOrEqual(number, options));
	}
	greaterThan(number, options = this.validatorOptions) {
		return this.addConstraint(bigintGreaterThan(number, options));
	}
	greaterThanOrEqual(number, options = this.validatorOptions) {
		return this.addConstraint(bigintGreaterThanOrEqual(number, options));
	}
	equal(number, options = this.validatorOptions) {
		return this.addConstraint(bigintEqual(number, options));
	}
	notEqual(number, options = this.validatorOptions) {
		return this.addConstraint(bigintNotEqual(number, options));
	}
	positive(options = this.validatorOptions) {
		return this.greaterThanOrEqual(0n, options);
	}
	negative(options = this.validatorOptions) {
		return this.lessThan(0n, options);
	}
	divisibleBy(number, options = this.validatorOptions) {
		return this.addConstraint(bigintDivisibleBy(number, options));
	}
	abs(options = this.validatorOptions) {
		return this.transform((value) => value < 0 ? -value : value, options);
	}
	intN(bits, options = this.validatorOptions) {
		return this.transform((value) => BigInt.asIntN(bits, value), options);
	}
	uintN(bits, options = this.validatorOptions) {
		return this.transform((value) => BigInt.asUintN(bits, value), options);
	}
	handle(value) {
		return typeof value === "bigint" ? Result.ok(value) : Result.err(new ValidationError("s.bigint()", this.validatorOptions.message ?? "Expected a bigint primitive", value));
	}
};
__name(_BigIntValidator, "BigIntValidator");
var BigIntValidator = _BigIntValidator;
function booleanTrue(options) {
	return { run(input) {
		return input ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.boolean().true()", options?.message ?? "Invalid boolean value", input, "true"));
	} };
}
__name(booleanTrue, "booleanTrue");
function booleanFalse(options) {
	return { run(input) {
		return input ? Result.err(new ExpectedConstraintError("s.boolean().false()", options?.message ?? "Invalid boolean value", input, "false")) : Result.ok(input);
	} };
}
__name(booleanFalse, "booleanFalse");
var _BooleanValidator = class _BooleanValidator extends BaseValidator {
	true(options = this.validatorOptions) {
		return this.addConstraint(booleanTrue(options));
	}
	false(options = this.validatorOptions) {
		return this.addConstraint(booleanFalse(options));
	}
	equal(value, options = this.validatorOptions) {
		return value ? this.true(options) : this.false(options);
	}
	notEqual(value, options = this.validatorOptions) {
		return value ? this.false(options) : this.true(options);
	}
	handle(value) {
		return typeof value === "boolean" ? Result.ok(value) : Result.err(new ValidationError("s.boolean()", this.validatorOptions.message ?? "Expected a boolean primitive", value));
	}
};
__name(_BooleanValidator, "BooleanValidator");
var BooleanValidator = _BooleanValidator;
function dateComparator(comparator, name, expected, number, options) {
	return { run(input) {
		return comparator(input.getTime(), number) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid Date value", input, expected));
	} };
}
__name(dateComparator, "dateComparator");
function dateLessThan(value, options) {
	return dateComparator(lessThan, "s.date().lessThan()", `expected < ${value.toISOString()}`, value.getTime(), options);
}
__name(dateLessThan, "dateLessThan");
function dateLessThanOrEqual(value, options) {
	return dateComparator(lessThanOrEqual, "s.date().lessThanOrEqual()", `expected <= ${value.toISOString()}`, value.getTime(), options);
}
__name(dateLessThanOrEqual, "dateLessThanOrEqual");
function dateGreaterThan(value, options) {
	return dateComparator(greaterThan, "s.date().greaterThan()", `expected > ${value.toISOString()}`, value.getTime(), options);
}
__name(dateGreaterThan, "dateGreaterThan");
function dateGreaterThanOrEqual(value, options) {
	return dateComparator(greaterThanOrEqual, "s.date().greaterThanOrEqual()", `expected >= ${value.toISOString()}`, value.getTime(), options);
}
__name(dateGreaterThanOrEqual, "dateGreaterThanOrEqual");
function dateEqual(value, options) {
	return dateComparator(equal, "s.date().equal()", `expected === ${value.toISOString()}`, value.getTime(), options);
}
__name(dateEqual, "dateEqual");
function dateNotEqual(value, options) {
	return dateComparator(notEqual, "s.date().notEqual()", `expected !== ${value.toISOString()}`, value.getTime(), options);
}
__name(dateNotEqual, "dateNotEqual");
function dateInvalid(options) {
	return { run(input) {
		return Number.isNaN(input.getTime()) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.date().invalid()", options?.message ?? "Invalid Date value", input, "expected === NaN"));
	} };
}
__name(dateInvalid, "dateInvalid");
function dateValid(options) {
	return { run(input) {
		return Number.isNaN(input.getTime()) ? Result.err(new ExpectedConstraintError("s.date().valid()", options?.message ?? "Invalid Date value", input, "expected !== NaN")) : Result.ok(input);
	} };
}
__name(dateValid, "dateValid");
var _DateValidator = class _DateValidator extends BaseValidator {
	lessThan(date, options = this.validatorOptions) {
		return this.addConstraint(dateLessThan(new Date(date), options));
	}
	lessThanOrEqual(date, options = this.validatorOptions) {
		return this.addConstraint(dateLessThanOrEqual(new Date(date), options));
	}
	greaterThan(date, options = this.validatorOptions) {
		return this.addConstraint(dateGreaterThan(new Date(date), options));
	}
	greaterThanOrEqual(date, options = this.validatorOptions) {
		return this.addConstraint(dateGreaterThanOrEqual(new Date(date), options));
	}
	equal(date, options = this.validatorOptions) {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) ? this.invalid(options) : this.addConstraint(dateEqual(resolved, options));
	}
	notEqual(date, options = this.validatorOptions) {
		const resolved = new Date(date);
		return Number.isNaN(resolved.getTime()) ? this.valid(options) : this.addConstraint(dateNotEqual(resolved, options));
	}
	valid(options = this.validatorOptions) {
		return this.addConstraint(dateValid(options));
	}
	invalid(options = this.validatorOptions) {
		return this.addConstraint(dateInvalid(options));
	}
	handle(value) {
		return value instanceof Date ? Result.ok(value) : Result.err(new ValidationError("s.date()", this.validatorOptions.message ?? "Expected a Date", value));
	}
};
__name(_DateValidator, "DateValidator");
var DateValidator = _DateValidator;
var _ExpectedValidationError = class _ExpectedValidationError extends ValidationError {
	constructor(validator, message, given, expected) {
		super(validator, message, given);
		this.expected = expected;
	}
	toJSON() {
		return {
			name: this.name,
			validator: this.validator,
			given: this.given,
			expected: this.expected,
			message: this.message
		};
	}
	[customInspectSymbolStackLess](depth, options) {
		const validator = options.stylize(this.validator, "string");
		if (depth < 0) return options.stylize(`[ExpectedValidationError: ${validator}]`, "special");
		const newOptions = {
			...options,
			depth: options.depth === null ? null : options.depth - 1
		};
		const padding = `
  ${options.stylize("|", "undefined")} `;
		const expected = inspect(this.expected, newOptions).replace(/\n/g, padding);
		const given = inspect(this.given, newOptions).replace(/\n/g, padding);
		return `${`${options.stylize("ExpectedValidationError", "special")} > ${validator}`}
  ${options.stylize(this.message, "regexp")}
${`
  ${options.stylize("Expected:", "string")}${padding}${expected}`}
${`
  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
__name(_ExpectedValidationError, "ExpectedValidationError");
var ExpectedValidationError = _ExpectedValidationError;
var _InstanceValidator = class _InstanceValidator extends BaseValidator {
	constructor(expected, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.expected = expected;
	}
	handle(value) {
		return value instanceof this.expected ? Result.ok(value) : Result.err(new ExpectedValidationError("s.instance(V)", this.validatorOptions.message ?? "Expected", value, this.expected));
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.expected,
			this.validatorOptions,
			this.constraints
		]);
	}
};
__name(_InstanceValidator, "InstanceValidator");
var InstanceValidator = _InstanceValidator;
var _LiteralValidator = class _LiteralValidator extends BaseValidator {
	constructor(literal, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.expected = literal;
	}
	handle(value) {
		return Object.is(value, this.expected) ? Result.ok(value) : Result.err(new ExpectedValidationError("s.literal(V)", this.validatorOptions.message ?? "Expected values to be equals", value, this.expected));
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.expected,
			this.validatorOptions,
			this.constraints
		]);
	}
};
__name(_LiteralValidator, "LiteralValidator");
var LiteralValidator = _LiteralValidator;
var _NeverValidator = class _NeverValidator extends BaseValidator {
	handle(value) {
		return Result.err(new ValidationError("s.never()", this.validatorOptions.message ?? "Expected a value to not be passed", value));
	}
};
__name(_NeverValidator, "NeverValidator");
var NeverValidator = _NeverValidator;
var _NullishValidator = class _NullishValidator extends BaseValidator {
	handle(value) {
		return value === void 0 || value === null ? Result.ok(value) : Result.err(new ValidationError("s.nullish()", this.validatorOptions.message ?? "Expected undefined or null", value));
	}
};
__name(_NullishValidator, "NullishValidator");
var NullishValidator = _NullishValidator;
function numberComparator(comparator, name, expected, number, options) {
	return { run(input) {
		return comparator(input, number) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid number value", input, expected));
	} };
}
__name(numberComparator, "numberComparator");
function numberLessThan(value, options) {
	return numberComparator(lessThan, "s.number().lessThan()", `expected < ${value}`, value, options);
}
__name(numberLessThan, "numberLessThan");
function numberLessThanOrEqual(value, options) {
	return numberComparator(lessThanOrEqual, "s.number().lessThanOrEqual()", `expected <= ${value}`, value, options);
}
__name(numberLessThanOrEqual, "numberLessThanOrEqual");
function numberGreaterThan(value, options) {
	return numberComparator(greaterThan, "s.number().greaterThan()", `expected > ${value}`, value, options);
}
__name(numberGreaterThan, "numberGreaterThan");
function numberGreaterThanOrEqual(value, options) {
	return numberComparator(greaterThanOrEqual, "s.number().greaterThanOrEqual()", `expected >= ${value}`, value, options);
}
__name(numberGreaterThanOrEqual, "numberGreaterThanOrEqual");
function numberEqual(value, options) {
	return numberComparator(equal, "s.number().equal()", `expected === ${value}`, value, options);
}
__name(numberEqual, "numberEqual");
function numberNotEqual(value, options) {
	return numberComparator(notEqual, "s.number().notEqual()", `expected !== ${value}`, value, options);
}
__name(numberNotEqual, "numberNotEqual");
function numberInt(options) {
	return { run(input) {
		return Number.isInteger(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().int()", options?.message ?? "Given value is not an integer", input, "Number.isInteger(expected) to be true"));
	} };
}
__name(numberInt, "numberInt");
function numberSafeInt(options) {
	return { run(input) {
		return Number.isSafeInteger(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().safeInt()", options?.message ?? "Given value is not a safe integer", input, "Number.isSafeInteger(expected) to be true"));
	} };
}
__name(numberSafeInt, "numberSafeInt");
function numberFinite(options) {
	return { run(input) {
		return Number.isFinite(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().finite()", options?.message ?? "Given value is not finite", input, "Number.isFinite(expected) to be true"));
	} };
}
__name(numberFinite, "numberFinite");
function numberNaN(options) {
	return { run(input) {
		return Number.isNaN(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().equal(NaN)", options?.message ?? "Invalid number value", input, "expected === NaN"));
	} };
}
__name(numberNaN, "numberNaN");
function numberNotNaN(options) {
	return { run(input) {
		return Number.isNaN(input) ? Result.err(new ExpectedConstraintError("s.number().notEqual(NaN)", options?.message ?? "Invalid number value", input, "expected !== NaN")) : Result.ok(input);
	} };
}
__name(numberNotNaN, "numberNotNaN");
function numberDivisibleBy(divider, options) {
	const expected = `expected % ${divider} === 0`;
	return { run(input) {
		return input % divider === 0 ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().divisibleBy()", options?.message ?? "Number is not divisible", input, expected));
	} };
}
__name(numberDivisibleBy, "numberDivisibleBy");
var _NumberValidator = class _NumberValidator extends BaseValidator {
	lessThan(number, options = this.validatorOptions) {
		return this.addConstraint(numberLessThan(number, options));
	}
	lessThanOrEqual(number, options = this.validatorOptions) {
		return this.addConstraint(numberLessThanOrEqual(number, options));
	}
	greaterThan(number, options = this.validatorOptions) {
		return this.addConstraint(numberGreaterThan(number, options));
	}
	greaterThanOrEqual(number, options = this.validatorOptions) {
		return this.addConstraint(numberGreaterThanOrEqual(number, options));
	}
	equal(number, options = this.validatorOptions) {
		return Number.isNaN(number) ? this.addConstraint(numberNaN(options)) : this.addConstraint(numberEqual(number, options));
	}
	notEqual(number, options = this.validatorOptions) {
		return Number.isNaN(number) ? this.addConstraint(numberNotNaN(options)) : this.addConstraint(numberNotEqual(number, options));
	}
	int(options = this.validatorOptions) {
		return this.addConstraint(numberInt(options));
	}
	safeInt(options = this.validatorOptions) {
		return this.addConstraint(numberSafeInt(options));
	}
	finite(options = this.validatorOptions) {
		return this.addConstraint(numberFinite(options));
	}
	positive(options = this.validatorOptions) {
		return this.greaterThanOrEqual(0, options);
	}
	negative(options = this.validatorOptions) {
		return this.lessThan(0, options);
	}
	divisibleBy(divider, options = this.validatorOptions) {
		return this.addConstraint(numberDivisibleBy(divider, options));
	}
	abs(options = this.validatorOptions) {
		return this.transform(Math.abs, options);
	}
	sign(options = this.validatorOptions) {
		return this.transform(Math.sign, options);
	}
	trunc(options = this.validatorOptions) {
		return this.transform(Math.trunc, options);
	}
	floor(options = this.validatorOptions) {
		return this.transform(Math.floor, options);
	}
	fround(options = this.validatorOptions) {
		return this.transform(Math.fround, options);
	}
	round(options = this.validatorOptions) {
		return this.transform(Math.round, options);
	}
	ceil(options = this.validatorOptions) {
		return this.transform(Math.ceil, options);
	}
	handle(value) {
		return typeof value === "number" ? Result.ok(value) : Result.err(new ValidationError("s.number()", this.validatorOptions.message ?? "Expected a number primitive", value));
	}
};
__name(_NumberValidator, "NumberValidator");
var NumberValidator = _NumberValidator;
var _MissingPropertyError = class _MissingPropertyError extends BaseError {
	constructor(property, validatorOptions) {
		super(validatorOptions?.message ?? "A required property is missing");
		this.property = property;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			property: this.property
		};
	}
	[customInspectSymbolStackLess](depth, options) {
		const property = options.stylize(this.property.toString(), "string");
		if (depth < 0) return options.stylize(`[MissingPropertyError: ${property}]`, "special");
		return `${`${options.stylize("MissingPropertyError", "special")} > ${property}`}
  ${options.stylize(this.message, "regexp")}`;
	}
};
__name(_MissingPropertyError, "MissingPropertyError");
var MissingPropertyError = _MissingPropertyError;
var _UnknownPropertyError = class _UnknownPropertyError extends BaseError {
	constructor(property, value, options) {
		super(options?.message ?? "Received unexpected property");
		this.property = property;
		this.value = value;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			property: this.property,
			value: this.value
		};
	}
	[customInspectSymbolStackLess](depth, options) {
		const property = options.stylize(this.property.toString(), "string");
		if (depth < 0) return options.stylize(`[UnknownPropertyError: ${property}]`, "special");
		const newOptions = {
			...options,
			depth: options.depth === null ? null : options.depth - 1,
			compact: true
		};
		const padding = `
  ${options.stylize("|", "undefined")} `;
		const given = inspect(this.value, newOptions).replace(/\n/g, padding);
		return `${`${options.stylize("UnknownPropertyError", "special")} > ${property}`}
  ${options.stylize(this.message, "regexp")}
${`
  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
__name(_UnknownPropertyError, "UnknownPropertyError");
var UnknownPropertyError = _UnknownPropertyError;
var _DefaultValidator = class _DefaultValidator extends BaseValidator {
	constructor(validator, value, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.validator = validator;
		this.defaultValue = value;
	}
	default(value, options = this.validatorOptions) {
		const clone = this.clone();
		clone.validatorOptions = options;
		clone.defaultValue = value;
		return clone;
	}
	handle(value) {
		return typeof value === "undefined" ? Result.ok(getValue(this.defaultValue)) : this.validator["handle"](value);
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.validator,
			this.defaultValue,
			this.validatorOptions,
			this.constraints
		]);
	}
};
__name(_DefaultValidator, "DefaultValidator");
var DefaultValidator = _DefaultValidator;
var _CombinedError = class _CombinedError extends BaseError {
	constructor(errors, validatorOptions) {
		super(validatorOptions?.message ?? "Received one or more errors");
		this.errors = errors;
	}
	[customInspectSymbolStackLess](depth, options) {
		if (depth < 0) return options.stylize("[CombinedError]", "special");
		const newOptions = {
			...options,
			depth: options.depth === null ? null : options.depth - 1,
			compact: true
		};
		const padding = `
  ${options.stylize("|", "undefined")} `;
		return `${`${options.stylize("CombinedError", "special")} (${options.stylize(this.errors.length.toString(), "number")})`}
  ${options.stylize(this.message, "regexp")}

${this.errors.map((error, i) => {
			return `  ${options.stylize((i + 1).toString(), "number")} ${error[customInspectSymbolStackLess](depth - 1, newOptions).replace(/\n/g, padding)}`;
		}).join("\n\n")}`;
	}
};
__name(_CombinedError, "CombinedError");
var CombinedError = _CombinedError;
var _UnionValidator = class _UnionValidator extends BaseValidator {
	constructor(validators, validatorOptions, constraints = []) {
		super(validatorOptions, constraints);
		this.validators = validators;
	}
	optional(options = this.validatorOptions) {
		if (this.validators.length === 0) return new _UnionValidator([new LiteralValidator(void 0, options)], this.validatorOptions, this.constraints);
		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === void 0) return this.clone();
			if (validator.expected === null) return new _UnionValidator([new NullishValidator(options), ...this.validators.slice(1)], this.validatorOptions, this.constraints);
		} else if (validator instanceof NullishValidator) return this.clone();
		return new _UnionValidator([new LiteralValidator(void 0, options), ...this.validators], this.validatorOptions);
	}
	required(options = this.validatorOptions) {
		if (this.validators.length === 0) return this.clone();
		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === void 0) return new _UnionValidator(this.validators.slice(1), this.validatorOptions, this.constraints);
		} else if (validator instanceof NullishValidator) return new _UnionValidator([new LiteralValidator(null, options), ...this.validators.slice(1)], this.validatorOptions, this.constraints);
		return this.clone();
	}
	nullable(options = this.validatorOptions) {
		if (this.validators.length === 0) return new _UnionValidator([new LiteralValidator(null, options)], this.validatorOptions, this.constraints);
		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === null) return this.clone();
			if (validator.expected === void 0) return new _UnionValidator([new NullishValidator(options), ...this.validators.slice(1)], this.validatorOptions, this.constraints);
		} else if (validator instanceof NullishValidator) return this.clone();
		return new _UnionValidator([new LiteralValidator(null, options), ...this.validators], this.validatorOptions);
	}
	nullish(options = this.validatorOptions) {
		if (this.validators.length === 0) return new _UnionValidator([new NullishValidator(options)], options, this.constraints);
		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === null || validator.expected === void 0) return new _UnionValidator([new NullishValidator(options), ...this.validators.slice(1)], options, this.constraints);
		} else if (validator instanceof NullishValidator) return this.clone();
		return new _UnionValidator([new NullishValidator(options), ...this.validators], options);
	}
	or(...predicates) {
		return new _UnionValidator([...this.validators, ...predicates], this.validatorOptions);
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.validators,
			this.validatorOptions,
			this.constraints
		]);
	}
	handle(value) {
		const errors = [];
		for (const validator of this.validators) {
			const result = validator.run(value);
			if (result.isOk()) return result;
			errors.push(result.error);
		}
		return Result.err(new CombinedError(errors, this.validatorOptions));
	}
};
__name(_UnionValidator, "UnionValidator");
var UnionValidator = _UnionValidator;
var _ObjectValidator = class _ObjectValidator extends BaseValidator {
	constructor(shape, strategy = 0, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.keys = [];
		this.requiredKeys = /* @__PURE__ */ new Map();
		this.possiblyUndefinedKeys = /* @__PURE__ */ new Map();
		this.possiblyUndefinedKeysWithDefaults = /* @__PURE__ */ new Map();
		this.shape = shape;
		this.strategy = strategy;
		switch (this.strategy) {
			case 0:
				this.handleStrategy = (value) => this.handleIgnoreStrategy(value);
				break;
			case 1:
				this.handleStrategy = (value) => this.handleStrictStrategy(value);
				break;
			case 2: this.handleStrategy = (value) => this.handlePassthroughStrategy(value);
		}
		const shapeEntries = Object.entries(shape);
		this.keys = shapeEntries.map(([key]) => key);
		for (const [key, validator] of shapeEntries) if (validator instanceof UnionValidator) {
			const [possiblyLiteralOrNullishPredicate] = validator["validators"];
			if (possiblyLiteralOrNullishPredicate instanceof NullishValidator) this.possiblyUndefinedKeys.set(key, validator);
			else if (possiblyLiteralOrNullishPredicate instanceof LiteralValidator) {
				if (possiblyLiteralOrNullishPredicate.expected === void 0) this.possiblyUndefinedKeys.set(key, validator);
				else this.requiredKeys.set(key, validator);
			} else if (validator instanceof DefaultValidator) this.possiblyUndefinedKeysWithDefaults.set(key, validator);
			else this.requiredKeys.set(key, validator);
		} else if (validator instanceof NullishValidator) this.possiblyUndefinedKeys.set(key, validator);
		else if (validator instanceof LiteralValidator) {
			if (validator.expected === void 0) this.possiblyUndefinedKeys.set(key, validator);
			else this.requiredKeys.set(key, validator);
		} else if (validator instanceof DefaultValidator) this.possiblyUndefinedKeysWithDefaults.set(key, validator);
		else this.requiredKeys.set(key, validator);
	}
	strict(options = this.validatorOptions) {
		return Reflect.construct(this.constructor, [
			this.shape,
			1,
			options,
			this.constraints
		]);
	}
	ignore(options = this.validatorOptions) {
		return Reflect.construct(this.constructor, [
			this.shape,
			0,
			options,
			this.constraints
		]);
	}
	passthrough(options = this.validatorOptions) {
		return Reflect.construct(this.constructor, [
			this.shape,
			2,
			options,
			this.constraints
		]);
	}
	partial(options = this.validatorOptions) {
		const shape = Object.fromEntries(this.keys.map((key) => [key, this.shape[key].optional(options)]));
		return Reflect.construct(this.constructor, [
			shape,
			this.strategy,
			options,
			this.constraints
		]);
	}
	required(options = this.validatorOptions) {
		const shape = Object.fromEntries(this.keys.map((key) => {
			let validator = this.shape[key];
			if (validator instanceof UnionValidator) validator = validator.required(options);
			return [key, validator];
		}));
		return Reflect.construct(this.constructor, [
			shape,
			this.strategy,
			options,
			this.constraints
		]);
	}
	extend(schema, options = this.validatorOptions) {
		const shape = {
			...this.shape,
			...schema instanceof _ObjectValidator ? schema.shape : schema
		};
		return Reflect.construct(this.constructor, [
			shape,
			this.strategy,
			options,
			this.constraints
		]);
	}
	pick(keys, options = this.validatorOptions) {
		const shape = Object.fromEntries(keys.filter((key) => this.keys.includes(key)).map((key) => [key, this.shape[key]]));
		return Reflect.construct(this.constructor, [
			shape,
			this.strategy,
			options,
			this.constraints
		]);
	}
	omit(keys, options = this.validatorOptions) {
		const shape = Object.fromEntries(this.keys.filter((key) => !keys.includes(key)).map((key) => [key, this.shape[key]]));
		return Reflect.construct(this.constructor, [
			shape,
			this.strategy,
			options,
			this.constraints
		]);
	}
	handle(value) {
		const typeOfValue = typeof value;
		if (typeOfValue !== "object") return Result.err(new ValidationError("s.object(T)", this.validatorOptions.message ?? `Expected the value to be an object, but received ${typeOfValue} instead`, value));
		if (value === null) return Result.err(new ValidationError("s.object(T)", this.validatorOptions.message ?? "Expected the value to not be null", value));
		if (Array.isArray(value)) return Result.err(new ValidationError("s.object(T)", this.validatorOptions.message ?? "Expected the value to not be an array", value));
		if (!this.shouldRunConstraints) return Result.ok(value);
		for (const predicate of Object.values(this.shape)) predicate.setParent(this.parent ?? value);
		return this.handleStrategy(value);
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.shape,
			this.strategy,
			this.validatorOptions,
			this.constraints
		]);
	}
	handleIgnoreStrategy(value) {
		const errors = [];
		const finalObject = {};
		const inputEntries = new Map(Object.entries(value));
		const runPredicate = /* @__PURE__ */ __name((key, predicate) => {
			const result = predicate.run(value[key]);
			if (result.isOk()) finalObject[key] = result.value;
			else {
				const error = result.error;
				errors.push([key, error]);
			}
		}, "runPredicate");
		for (const [key, predicate] of this.requiredKeys) if (inputEntries.delete(key)) runPredicate(key, predicate);
		else errors.push([key, new MissingPropertyError(key, this.validatorOptions)]);
		for (const [key, validator] of this.possiblyUndefinedKeysWithDefaults) {
			inputEntries.delete(key);
			runPredicate(key, validator);
		}
		if (inputEntries.size === 0) return errors.length === 0 ? Result.ok(finalObject) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
		if (this.possiblyUndefinedKeys.size > inputEntries.size) for (const [key] of inputEntries) {
			const predicate = this.possiblyUndefinedKeys.get(key);
			if (predicate) runPredicate(key, predicate);
		}
		else for (const [key, predicate] of this.possiblyUndefinedKeys) if (inputEntries.delete(key)) runPredicate(key, predicate);
		return errors.length === 0 ? Result.ok(finalObject) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
	handleStrictStrategy(value) {
		const errors = [];
		const finalResult = {};
		const inputEntries = new Map(Object.entries(value));
		const runPredicate = /* @__PURE__ */ __name((key, predicate) => {
			const result = predicate.run(value[key]);
			if (result.isOk()) finalResult[key] = result.value;
			else {
				const error = result.error;
				errors.push([key, error]);
			}
		}, "runPredicate");
		for (const [key, predicate] of this.requiredKeys) if (inputEntries.delete(key)) runPredicate(key, predicate);
		else errors.push([key, new MissingPropertyError(key, this.validatorOptions)]);
		for (const [key, validator] of this.possiblyUndefinedKeysWithDefaults) {
			inputEntries.delete(key);
			runPredicate(key, validator);
		}
		for (const [key, predicate] of this.possiblyUndefinedKeys) {
			if (inputEntries.size === 0) break;
			if (inputEntries.delete(key)) runPredicate(key, predicate);
		}
		if (inputEntries.size !== 0) for (const [key, value2] of inputEntries.entries()) errors.push([key, new UnknownPropertyError(key, value2, this.validatorOptions)]);
		return errors.length === 0 ? Result.ok(finalResult) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
	handlePassthroughStrategy(value) {
		const result = this.handleIgnoreStrategy(value);
		return result.isErr() ? result : Result.ok({
			...value,
			...result.value
		});
	}
};
__name(_ObjectValidator, "ObjectValidator");
var ObjectValidator = _ObjectValidator;
var _PassthroughValidator = class _PassthroughValidator extends BaseValidator {
	handle(value) {
		return Result.ok(value);
	}
};
__name(_PassthroughValidator, "PassthroughValidator");
var PassthroughValidator = _PassthroughValidator;
var _RecordValidator = class _RecordValidator extends BaseValidator {
	constructor(validator, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.validator = validator;
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.validator,
			this.validatorOptions,
			this.constraints
		]);
	}
	handle(value) {
		if (typeof value !== "object") return Result.err(new ValidationError("s.record(T)", this.validatorOptions.message ?? "Expected an object", value));
		if (value === null) return Result.err(new ValidationError("s.record(T)", this.validatorOptions.message ?? "Expected the value to not be null", value));
		if (Array.isArray(value)) return Result.err(new ValidationError("s.record(T)", this.validatorOptions.message ?? "Expected the value to not be an array", value));
		if (!this.shouldRunConstraints) return Result.ok(value);
		const errors = [];
		const transformed = {};
		for (const [key, val] of Object.entries(value)) {
			const result = this.validator.run(val);
			if (result.isOk()) transformed[key] = result.value;
			else errors.push([key, result.error]);
		}
		return errors.length === 0 ? Result.ok(transformed) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
};
__name(_RecordValidator, "RecordValidator");
var RecordValidator = _RecordValidator;
var _SetValidator = class _SetValidator extends BaseValidator {
	constructor(validator, validatorOptions, constraints = []) {
		super(validatorOptions, constraints);
		this.validator = validator;
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.validator,
			this.validatorOptions,
			this.constraints
		]);
	}
	handle(values) {
		if (!(values instanceof Set)) return Result.err(new ValidationError("s.set(T)", this.validatorOptions.message ?? "Expected a set", values));
		if (!this.shouldRunConstraints) return Result.ok(values);
		const errors = [];
		const transformed = /* @__PURE__ */ new Set();
		for (const value of values) {
			const result = this.validator.run(value);
			if (result.isOk()) transformed.add(result.value);
			else errors.push(result.error);
		}
		return errors.length === 0 ? Result.ok(transformed) : Result.err(new CombinedError(errors, this.validatorOptions));
	}
};
__name(_SetValidator, "SetValidator");
var SetValidator = _SetValidator;
var accountRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]$/i;
function validateEmail(email) {
	if (!email) return false;
	const atIndex = email.indexOf("@");
	if (atIndex === -1) return false;
	if (atIndex > 64) return false;
	const domainIndex = atIndex + 1;
	if (email.includes("@", domainIndex)) return false;
	if (email.length - domainIndex > 255) return false;
	let dotIndex = email.indexOf(".", domainIndex);
	if (dotIndex === -1) return false;
	let lastDotIndex = domainIndex;
	do {
		if (dotIndex - lastDotIndex > 63) return false;
		lastDotIndex = dotIndex + 1;
	} while ((dotIndex = email.indexOf(".", lastDotIndex)) !== -1);
	if (email.length - lastDotIndex > 63) return false;
	return accountRegex.test(email.slice(0, atIndex)) && validateEmailDomain(email.slice(domainIndex));
}
__name(validateEmail, "validateEmail");
function validateEmailDomain(domain2) {
	try {
		return new URL(`http://${domain2}`).hostname === domain2;
	} catch {
		return false;
	}
}
__name(validateEmailDomain, "validateEmailDomain");
var v4Seg = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
var v4Str = `(${v4Seg}[.]){3}${v4Seg}`;
var IPv4Reg = new RegExp(`^${v4Str}$`);
var v6Seg = "(?:[0-9a-fA-F]{1,4})";
var IPv6Reg = new RegExp(`^((?:${v6Seg}:){7}(?:${v6Seg}|:)|(?:${v6Seg}:){6}(?:${v4Str}|:${v6Seg}|:)|(?:${v6Seg}:){5}(?::${v4Str}|(:${v6Seg}){1,2}|:)|(?:${v6Seg}:){4}(?:(:${v6Seg}){0,1}:${v4Str}|(:${v6Seg}){1,3}|:)|(?:${v6Seg}:){3}(?:(:${v6Seg}){0,2}:${v4Str}|(:${v6Seg}){1,4}|:)|(?:${v6Seg}:){2}(?:(:${v6Seg}){0,3}:${v4Str}|(:${v6Seg}){1,5}|:)|(?:${v6Seg}:){1}(?:(:${v6Seg}){0,4}:${v4Str}|(:${v6Seg}){1,6}|:)|(?::((?::${v6Seg}){0,5}:${v4Str}|(?::${v6Seg}){1,7}|:)))(%[0-9a-zA-Z-.:]{1,})?$`);
function isIPv4(s2) {
	return IPv4Reg.test(s2);
}
__name(isIPv4, "isIPv4");
function isIPv6(s2) {
	return IPv6Reg.test(s2);
}
__name(isIPv6, "isIPv6");
function isIP(s2) {
	if (isIPv4(s2)) return 4;
	if (isIPv6(s2)) return 6;
	return 0;
}
__name(isIP, "isIP");
var phoneNumberRegex = /^((?:\+|0{0,2})\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
function validatePhoneNumber(input) {
	return phoneNumberRegex.test(input);
}
__name(validatePhoneNumber, "validatePhoneNumber");
var _MultiplePossibilitiesConstraintError = class _MultiplePossibilitiesConstraintError extends BaseConstraintError {
	constructor(constraint, message, given, expected) {
		super(constraint, message, given);
		this.expected = expected;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			constraint: this.constraint,
			given: this.given,
			expected: this.expected
		};
	}
	[customInspectSymbolStackLess](depth, options) {
		const constraint = options.stylize(this.constraint, "string");
		if (depth < 0) return options.stylize(`[MultiplePossibilitiesConstraintError: ${constraint}]`, "special");
		const newOptions = {
			...options,
			depth: options.depth === null ? null : options.depth - 1
		};
		const verticalLine = options.stylize("|", "undefined");
		const padding = `
  ${verticalLine} `;
		const given = inspect(this.given, newOptions).replace(/\n/g, padding);
		const header = `${options.stylize("MultiplePossibilitiesConstraintError", "special")} > ${constraint}`;
		const message = options.stylize(this.message, "regexp");
		const expectedPadding = `
  ${verticalLine} - `;
		return `${header}
  ${message}
${`
  ${options.stylize("Expected any of the following:", "string")}${expectedPadding}${this.expected.map((possible) => options.stylize(possible, "boolean")).join(expectedPadding)}`}
${`
  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
__name(_MultiplePossibilitiesConstraintError, "MultiplePossibilitiesConstraintError");
var MultiplePossibilitiesConstraintError = _MultiplePossibilitiesConstraintError;
function combinedErrorFn(...fns) {
	switch (fns.length) {
		case 0: return () => null;
		case 1: return fns[0];
		case 2: {
			const [fn0, fn1] = fns;
			return (...params) => fn0(...params) || fn1(...params);
		}
		default: return (...params) => {
			for (const fn of fns) {
				const result = fn(...params);
				if (result) return result;
			}
			return null;
		};
	}
}
__name(combinedErrorFn, "combinedErrorFn");
function createUrlValidators(options, validatorOptions) {
	const fns = [];
	if (options?.allowedProtocols?.length) fns.push(allowedProtocolsFn(options.allowedProtocols, validatorOptions));
	if (options?.allowedDomains?.length) fns.push(allowedDomainsFn(options.allowedDomains, validatorOptions));
	return combinedErrorFn(...fns);
}
__name(createUrlValidators, "createUrlValidators");
function allowedProtocolsFn(allowedProtocols, options) {
	return (input, url) => allowedProtocols.includes(url.protocol) ? null : new MultiplePossibilitiesConstraintError("s.string().url()", options?.message ?? "Invalid URL protocol", input, allowedProtocols);
}
__name(allowedProtocolsFn, "allowedProtocolsFn");
function allowedDomainsFn(allowedDomains, options) {
	return (input, url) => allowedDomains.includes(url.hostname) ? null : new MultiplePossibilitiesConstraintError("s.string().url()", options?.message ?? "Invalid URL domain", input, allowedDomains);
}
__name(allowedDomainsFn, "allowedDomainsFn");
function stringLengthComparator(comparator, name, expected, length, options) {
	return { run(input) {
		return comparator(input.length, length) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid string length", input, expected));
	} };
}
__name(stringLengthComparator, "stringLengthComparator");
function stringLengthLessThan(length, options) {
	return stringLengthComparator(lessThan, "s.string().lengthLessThan()", `expected.length < ${length}`, length, options);
}
__name(stringLengthLessThan, "stringLengthLessThan");
function stringLengthLessThanOrEqual(length, options) {
	return stringLengthComparator(lessThanOrEqual, "s.string().lengthLessThanOrEqual()", `expected.length <= ${length}`, length, options);
}
__name(stringLengthLessThanOrEqual, "stringLengthLessThanOrEqual");
function stringLengthGreaterThan(length, options) {
	return stringLengthComparator(greaterThan, "s.string().lengthGreaterThan()", `expected.length > ${length}`, length, options);
}
__name(stringLengthGreaterThan, "stringLengthGreaterThan");
function stringLengthGreaterThanOrEqual(length, options) {
	return stringLengthComparator(greaterThanOrEqual, "s.string().lengthGreaterThanOrEqual()", `expected.length >= ${length}`, length, options);
}
__name(stringLengthGreaterThanOrEqual, "stringLengthGreaterThanOrEqual");
function stringLengthEqual(length, options) {
	return stringLengthComparator(equal, "s.string().lengthEqual()", `expected.length === ${length}`, length, options);
}
__name(stringLengthEqual, "stringLengthEqual");
function stringLengthNotEqual(length, options) {
	return stringLengthComparator(notEqual, "s.string().lengthNotEqual()", `expected.length !== ${length}`, length, options);
}
__name(stringLengthNotEqual, "stringLengthNotEqual");
function stringEmail(options) {
	return { run(input) {
		return validateEmail(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.string().email()", options?.message ?? "Invalid email address", input, "expected to be an email address"));
	} };
}
__name(stringEmail, "stringEmail");
function stringRegexValidator(type, expected, regex, options) {
	return { run(input) {
		return regex.test(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError(type, options?.message ?? "Invalid string format", input, expected));
	} };
}
__name(stringRegexValidator, "stringRegexValidator");
function stringUrl(options, validatorOptions) {
	const validatorFn = createUrlValidators(options, validatorOptions);
	return { run(input) {
		let url;
		try {
			url = new URL(input);
		} catch {
			return Result.err(new ExpectedConstraintError("s.string().url()", validatorOptions?.message ?? "Invalid URL", input, "expected to match a URL"));
		}
		const validatorFnResult = validatorFn(input, url);
		if (validatorFnResult === null) return Result.ok(input);
		return Result.err(validatorFnResult);
	} };
}
__name(stringUrl, "stringUrl");
function stringIp(version2, options) {
	const ipVersion = version2 ? `v${version2}` : "";
	const validatorFn = version2 === 4 ? isIPv4 : version2 === 6 ? isIPv6 : isIP;
	const name = `s.string().ip${ipVersion}()`;
	const message = `Invalid IP${ipVersion} address`;
	const expected = `expected to be an IP${ipVersion} address`;
	return { run(input) {
		return validatorFn(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? message, input, expected));
	} };
}
__name(stringIp, "stringIp");
function stringRegex(regex, options) {
	return stringRegexValidator("s.string().regex()", `expected ${regex}.test(expected) to be true`, regex, options);
}
__name(stringRegex, "stringRegex");
function stringUuid({ version: version2 = 4, nullable = false } = {}, options) {
	version2 ?? (version2 = "1-5");
	const regex = new RegExp(`^(?:[0-9A-F]{8}-[0-9A-F]{4}-[${version2}][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}${nullable ? "|00000000-0000-0000-0000-000000000000" : ""})$`, "i");
	return stringRegexValidator("s.string().uuid()", `expected to match UUID${typeof version2 === "number" ? `v${version2}` : ` in range of ${version2}`}`, regex, options);
}
__name(stringUuid, "stringUuid");
function stringDate(options) {
	return { run(input) {
		const time = Date.parse(input);
		return Number.isNaN(time) ? Result.err(new ExpectedConstraintError("s.string().date()", options?.message ?? "Invalid date string", input, "expected to be a valid date string (in the ISO 8601 or ECMA-262 format)")) : Result.ok(input);
	} };
}
__name(stringDate, "stringDate");
function stringPhone(options) {
	return { run(input) {
		return validatePhoneNumber(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.string().phone()", options?.message ?? "Invalid phone number", input, "expected to be a phone number"));
	} };
}
__name(stringPhone, "stringPhone");
var _StringValidator = class _StringValidator extends BaseValidator {
	lengthLessThan(length, options = this.validatorOptions) {
		return this.addConstraint(stringLengthLessThan(length, options));
	}
	lengthLessThanOrEqual(length, options = this.validatorOptions) {
		return this.addConstraint(stringLengthLessThanOrEqual(length, options));
	}
	lengthGreaterThan(length, options = this.validatorOptions) {
		return this.addConstraint(stringLengthGreaterThan(length, options));
	}
	lengthGreaterThanOrEqual(length, options = this.validatorOptions) {
		return this.addConstraint(stringLengthGreaterThanOrEqual(length, options));
	}
	lengthEqual(length, options = this.validatorOptions) {
		return this.addConstraint(stringLengthEqual(length, options));
	}
	lengthNotEqual(length, options = this.validatorOptions) {
		return this.addConstraint(stringLengthNotEqual(length, options));
	}
	email(options = this.validatorOptions) {
		return this.addConstraint(stringEmail(options));
	}
	url(options, validatorOptions = this.validatorOptions) {
		if (this.isUrlOptions(options)) return this.addConstraint(stringUrl(options, validatorOptions));
		return this.addConstraint(stringUrl(void 0, validatorOptions));
	}
	uuid(options, validatorOptions = this.validatorOptions) {
		if (this.isStringUuidOptions(options)) return this.addConstraint(stringUuid(options, validatorOptions));
		return this.addConstraint(stringUuid(void 0, validatorOptions));
	}
	regex(regex, options = this.validatorOptions) {
		return this.addConstraint(stringRegex(regex, options));
	}
	date(options = this.validatorOptions) {
		return this.addConstraint(stringDate(options));
	}
	ipv4(options = this.validatorOptions) {
		return this.ip(4, options);
	}
	ipv6(options = this.validatorOptions) {
		return this.ip(6, options);
	}
	ip(version2, options = this.validatorOptions) {
		return this.addConstraint(stringIp(version2, options));
	}
	phone(options = this.validatorOptions) {
		return this.addConstraint(stringPhone(options));
	}
	handle(value) {
		return typeof value === "string" ? Result.ok(value) : Result.err(new ValidationError("s.string()", this.validatorOptions.message ?? "Expected a string primitive", value));
	}
	isUrlOptions(options) {
		return options?.message === void 0;
	}
	isStringUuidOptions(options) {
		return options?.message === void 0;
	}
};
__name(_StringValidator, "StringValidator");
var StringValidator = _StringValidator;
var _TupleValidator = class _TupleValidator extends BaseValidator {
	constructor(validators, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.validators = [];
		this.validators = validators;
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.validators,
			this.validatorOptions,
			this.constraints
		]);
	}
	handle(values) {
		if (!Array.isArray(values)) return Result.err(new ValidationError("s.tuple(T)", this.validatorOptions.message ?? "Expected an array", values));
		if (values.length !== this.validators.length) return Result.err(new ValidationError("s.tuple(T)", this.validatorOptions.message ?? `Expected an array of length ${this.validators.length}`, values));
		if (!this.shouldRunConstraints) return Result.ok(values);
		const errors = [];
		const transformed = [];
		for (let i = 0; i < values.length; i++) {
			const result = this.validators[i].run(values[i]);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([i, result.error]);
		}
		return errors.length === 0 ? Result.ok(transformed) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
};
__name(_TupleValidator, "TupleValidator");
var TupleValidator = _TupleValidator;
var _MapValidator = class _MapValidator extends BaseValidator {
	constructor(keyValidator, valueValidator, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.keyValidator = keyValidator;
		this.valueValidator = valueValidator;
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.keyValidator,
			this.valueValidator,
			this.validatorOptions,
			this.constraints
		]);
	}
	handle(value) {
		if (!(value instanceof Map)) return Result.err(new ValidationError("s.map(K, V)", this.validatorOptions.message ?? "Expected a map", value));
		if (!this.shouldRunConstraints) return Result.ok(value);
		const errors = [];
		const transformed = /* @__PURE__ */ new Map();
		for (const [key, val] of value.entries()) {
			const keyResult = this.keyValidator.run(key);
			const valueResult = this.valueValidator.run(val);
			const { length } = errors;
			if (keyResult.isErr()) errors.push([key, keyResult.error]);
			if (valueResult.isErr()) errors.push([key, valueResult.error]);
			if (errors.length === length) transformed.set(keyResult.value, valueResult.value);
		}
		return errors.length === 0 ? Result.ok(transformed) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
};
__name(_MapValidator, "MapValidator");
var MapValidator = _MapValidator;
var _LazyValidator = class _LazyValidator extends BaseValidator {
	constructor(validator, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.validator = validator;
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.validator,
			this.validatorOptions,
			this.constraints
		]);
	}
	handle(values) {
		return this.validator(values).run(values);
	}
};
__name(_LazyValidator, "LazyValidator");
var LazyValidator = _LazyValidator;
var _UnknownEnumValueError = class _UnknownEnumValueError extends BaseError {
	constructor(value, keys, enumMappings, validatorOptions) {
		super(validatorOptions?.message ?? "Expected the value to be one of the following enum values:");
		this.value = value;
		this.enumKeys = keys;
		this.enumMappings = enumMappings;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			value: this.value,
			enumKeys: this.enumKeys,
			enumMappings: [...this.enumMappings.entries()]
		};
	}
	[customInspectSymbolStackLess](depth, options) {
		const value = options.stylize(this.value.toString(), "string");
		if (depth < 0) return options.stylize(`[UnknownEnumValueError: ${value}]`, "special");
		const padding = `
  ${options.stylize("|", "undefined")} `;
		const pairs = this.enumKeys.map((key) => {
			const enumValue = this.enumMappings.get(key);
			return `${options.stylize(key, "string")} or ${options.stylize(enumValue.toString(), typeof enumValue === "number" ? "number" : "string")}`;
		}).join(padding);
		return `${`${options.stylize("UnknownEnumValueError", "special")} > ${value}`}
  ${options.stylize(this.message, "regexp")}
${`${padding}${pairs}`}`;
	}
};
__name(_UnknownEnumValueError, "UnknownEnumValueError");
var UnknownEnumValueError = _UnknownEnumValueError;
var _NativeEnumValidator = class _NativeEnumValidator extends BaseValidator {
	constructor(enumShape, validatorOptions = {}) {
		super(validatorOptions);
		this.hasNumericElements = false;
		this.enumMapping = /* @__PURE__ */ new Map();
		this.enumShape = enumShape;
		this.enumKeys = Object.keys(enumShape).filter((key) => {
			return typeof enumShape[enumShape[key]] !== "number";
		});
		for (const key of this.enumKeys) {
			const enumValue = enumShape[key];
			this.enumMapping.set(key, enumValue);
			this.enumMapping.set(enumValue, enumValue);
			if (typeof enumValue === "number") {
				this.hasNumericElements = true;
				this.enumMapping.set(`${enumValue}`, enumValue);
			}
		}
	}
	handle(value) {
		const typeOfValue = typeof value;
		if (typeOfValue === "number") {
			if (!this.hasNumericElements) return Result.err(new ValidationError("s.nativeEnum(T)", this.validatorOptions.message ?? "Expected the value to be a string", value));
		} else if (typeOfValue !== "string") return Result.err(new ValidationError("s.nativeEnum(T)", this.validatorOptions.message ?? "Expected the value to be a string or number", value));
		const casted = value;
		const possibleEnumValue = this.enumMapping.get(casted);
		return typeof possibleEnumValue === "undefined" ? Result.err(new UnknownEnumValueError(casted, this.enumKeys, this.enumMapping, this.validatorOptions)) : Result.ok(possibleEnumValue);
	}
	clone() {
		return Reflect.construct(this.constructor, [this.enumShape, this.validatorOptions]);
	}
};
__name(_NativeEnumValidator, "NativeEnumValidator");
var NativeEnumValidator = _NativeEnumValidator;
function typedArrayByteLengthComparator(comparator, name, expected, length, options) {
	return { run(input) {
		return comparator(input.byteLength, length) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid Typed Array byte length", input, expected));
	} };
}
__name(typedArrayByteLengthComparator, "typedArrayByteLengthComparator");
function typedArrayByteLengthLessThan(value, options) {
	return typedArrayByteLengthComparator(lessThan, "s.typedArray(T).byteLengthLessThan()", `expected.byteLength < ${value}`, value, options);
}
__name(typedArrayByteLengthLessThan, "typedArrayByteLengthLessThan");
function typedArrayByteLengthLessThanOrEqual(value, options) {
	return typedArrayByteLengthComparator(lessThanOrEqual, "s.typedArray(T).byteLengthLessThanOrEqual()", `expected.byteLength <= ${value}`, value, options);
}
__name(typedArrayByteLengthLessThanOrEqual, "typedArrayByteLengthLessThanOrEqual");
function typedArrayByteLengthGreaterThan(value, options) {
	return typedArrayByteLengthComparator(greaterThan, "s.typedArray(T).byteLengthGreaterThan()", `expected.byteLength > ${value}`, value, options);
}
__name(typedArrayByteLengthGreaterThan, "typedArrayByteLengthGreaterThan");
function typedArrayByteLengthGreaterThanOrEqual(value, options) {
	return typedArrayByteLengthComparator(greaterThanOrEqual, "s.typedArray(T).byteLengthGreaterThanOrEqual()", `expected.byteLength >= ${value}`, value, options);
}
__name(typedArrayByteLengthGreaterThanOrEqual, "typedArrayByteLengthGreaterThanOrEqual");
function typedArrayByteLengthEqual(value, options) {
	return typedArrayByteLengthComparator(equal, "s.typedArray(T).byteLengthEqual()", `expected.byteLength === ${value}`, value, options);
}
__name(typedArrayByteLengthEqual, "typedArrayByteLengthEqual");
function typedArrayByteLengthNotEqual(value, options) {
	return typedArrayByteLengthComparator(notEqual, "s.typedArray(T).byteLengthNotEqual()", `expected.byteLength !== ${value}`, value, options);
}
__name(typedArrayByteLengthNotEqual, "typedArrayByteLengthNotEqual");
function typedArrayByteLengthRange(start, endBefore, options) {
	const expected = `expected.byteLength >= ${start} && expected.byteLength < ${endBefore}`;
	return { run(input) {
		return input.byteLength >= start && input.byteLength < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).byteLengthRange()", options?.message ?? "Invalid Typed Array byte length", input, expected));
	} };
}
__name(typedArrayByteLengthRange, "typedArrayByteLengthRange");
function typedArrayByteLengthRangeInclusive(start, end, options) {
	const expected = `expected.byteLength >= ${start} && expected.byteLength <= ${end}`;
	return { run(input) {
		return input.byteLength >= start && input.byteLength <= end ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).byteLengthRangeInclusive()", options?.message ?? "Invalid Typed Array byte length", input, expected));
	} };
}
__name(typedArrayByteLengthRangeInclusive, "typedArrayByteLengthRangeInclusive");
function typedArrayByteLengthRangeExclusive(startAfter, endBefore, options) {
	const expected = `expected.byteLength > ${startAfter} && expected.byteLength < ${endBefore}`;
	return { run(input) {
		return input.byteLength > startAfter && input.byteLength < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).byteLengthRangeExclusive()", options?.message ?? "Invalid Typed Array byte length", input, expected));
	} };
}
__name(typedArrayByteLengthRangeExclusive, "typedArrayByteLengthRangeExclusive");
function typedArrayLengthComparator(comparator, name, expected, length, options) {
	return { run(input) {
		return comparator(input.length, length) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid Typed Array length", input, expected));
	} };
}
__name(typedArrayLengthComparator, "typedArrayLengthComparator");
function typedArrayLengthLessThan(value, options) {
	return typedArrayLengthComparator(lessThan, "s.typedArray(T).lengthLessThan()", `expected.length < ${value}`, value, options);
}
__name(typedArrayLengthLessThan, "typedArrayLengthLessThan");
function typedArrayLengthLessThanOrEqual(value, options) {
	return typedArrayLengthComparator(lessThanOrEqual, "s.typedArray(T).lengthLessThanOrEqual()", `expected.length <= ${value}`, value, options);
}
__name(typedArrayLengthLessThanOrEqual, "typedArrayLengthLessThanOrEqual");
function typedArrayLengthGreaterThan(value, options) {
	return typedArrayLengthComparator(greaterThan, "s.typedArray(T).lengthGreaterThan()", `expected.length > ${value}`, value, options);
}
__name(typedArrayLengthGreaterThan, "typedArrayLengthGreaterThan");
function typedArrayLengthGreaterThanOrEqual(value, options) {
	return typedArrayLengthComparator(greaterThanOrEqual, "s.typedArray(T).lengthGreaterThanOrEqual()", `expected.length >= ${value}`, value, options);
}
__name(typedArrayLengthGreaterThanOrEqual, "typedArrayLengthGreaterThanOrEqual");
function typedArrayLengthEqual(value, options) {
	return typedArrayLengthComparator(equal, "s.typedArray(T).lengthEqual()", `expected.length === ${value}`, value, options);
}
__name(typedArrayLengthEqual, "typedArrayLengthEqual");
function typedArrayLengthNotEqual(value, options) {
	return typedArrayLengthComparator(notEqual, "s.typedArray(T).lengthNotEqual()", `expected.length !== ${value}`, value, options);
}
__name(typedArrayLengthNotEqual, "typedArrayLengthNotEqual");
function typedArrayLengthRange(start, endBefore, options) {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return { run(input) {
		return input.length >= start && input.length < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).lengthRange()", options?.message ?? "Invalid Typed Array length", input, expected));
	} };
}
__name(typedArrayLengthRange, "typedArrayLengthRange");
function typedArrayLengthRangeInclusive(start, end, options) {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return { run(input) {
		return input.length >= start && input.length <= end ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).lengthRangeInclusive()", options?.message ?? "Invalid Typed Array length", input, expected));
	} };
}
__name(typedArrayLengthRangeInclusive, "typedArrayLengthRangeInclusive");
function typedArrayLengthRangeExclusive(startAfter, endBefore, options) {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return { run(input) {
		return input.length > startAfter && input.length < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).lengthRangeExclusive()", options?.message ?? "Invalid Typed Array length", input, expected));
	} };
}
__name(typedArrayLengthRangeExclusive, "typedArrayLengthRangeExclusive");
var vowels = [
	"a",
	"e",
	"i",
	"o",
	"u"
];
var aOrAn = /* @__PURE__ */ __name((word) => {
	return `${vowels.includes(word[0].toLowerCase()) ? "an" : "a"} ${word}`;
}, "aOrAn");
var TypedArrays = {
	Int8Array: /* @__PURE__ */ __name((x) => x instanceof Int8Array, "Int8Array"),
	Uint8Array: /* @__PURE__ */ __name((x) => x instanceof Uint8Array, "Uint8Array"),
	Uint8ClampedArray: /* @__PURE__ */ __name((x) => x instanceof Uint8ClampedArray, "Uint8ClampedArray"),
	Int16Array: /* @__PURE__ */ __name((x) => x instanceof Int16Array, "Int16Array"),
	Uint16Array: /* @__PURE__ */ __name((x) => x instanceof Uint16Array, "Uint16Array"),
	Int32Array: /* @__PURE__ */ __name((x) => x instanceof Int32Array, "Int32Array"),
	Uint32Array: /* @__PURE__ */ __name((x) => x instanceof Uint32Array, "Uint32Array"),
	Float32Array: /* @__PURE__ */ __name((x) => x instanceof Float32Array, "Float32Array"),
	Float64Array: /* @__PURE__ */ __name((x) => x instanceof Float64Array, "Float64Array"),
	BigInt64Array: /* @__PURE__ */ __name((x) => x instanceof BigInt64Array, "BigInt64Array"),
	BigUint64Array: /* @__PURE__ */ __name((x) => x instanceof BigUint64Array, "BigUint64Array"),
	TypedArray: /* @__PURE__ */ __name((x) => ArrayBuffer.isView(x) && !(x instanceof DataView), "TypedArray")
};
var _TypedArrayValidator = class _TypedArrayValidator extends BaseValidator {
	constructor(type, validatorOptions = {}, constraints = []) {
		super(validatorOptions, constraints);
		this.type = type;
	}
	byteLengthLessThan(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthLessThan(length, options));
	}
	byteLengthLessThanOrEqual(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthLessThanOrEqual(length, options));
	}
	byteLengthGreaterThan(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthGreaterThan(length, options));
	}
	byteLengthGreaterThanOrEqual(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthGreaterThanOrEqual(length, options));
	}
	byteLengthEqual(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthEqual(length, options));
	}
	byteLengthNotEqual(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthNotEqual(length, options));
	}
	byteLengthRange(start, endBefore, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthRange(start, endBefore, options));
	}
	byteLengthRangeInclusive(startAt, endAt, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthRangeInclusive(startAt, endAt, options));
	}
	byteLengthRangeExclusive(startAfter, endBefore, options = this.validatorOptions) {
		return this.addConstraint(typedArrayByteLengthRangeExclusive(startAfter, endBefore, options));
	}
	lengthLessThan(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthLessThan(length, options));
	}
	lengthLessThanOrEqual(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthLessThanOrEqual(length, options));
	}
	lengthGreaterThan(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthGreaterThan(length, options));
	}
	lengthGreaterThanOrEqual(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthGreaterThanOrEqual(length, options));
	}
	lengthEqual(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthEqual(length, options));
	}
	lengthNotEqual(length, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthNotEqual(length, options));
	}
	lengthRange(start, endBefore, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthRange(start, endBefore, options));
	}
	lengthRangeInclusive(startAt, endAt, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthRangeInclusive(startAt, endAt, options));
	}
	lengthRangeExclusive(startAfter, endBefore, options = this.validatorOptions) {
		return this.addConstraint(typedArrayLengthRangeExclusive(startAfter, endBefore, options));
	}
	clone() {
		return Reflect.construct(this.constructor, [
			this.type,
			this.validatorOptions,
			this.constraints
		]);
	}
	handle(value) {
		return TypedArrays[this.type](value) ? Result.ok(value) : Result.err(new ValidationError("s.typedArray()", this.validatorOptions.message ?? `Expected ${aOrAn(this.type)}`, value));
	}
};
__name(_TypedArrayValidator, "TypedArrayValidator");
var TypedArrayValidator = _TypedArrayValidator;
var _Shapes = class _Shapes {
	string(options) {
		return new StringValidator(options);
	}
	number(options) {
		return new NumberValidator(options);
	}
	bigint(options) {
		return new BigIntValidator(options);
	}
	boolean(options) {
		return new BooleanValidator(options);
	}
	date(options) {
		return new DateValidator(options);
	}
	object(shape, options) {
		return new ObjectValidator(shape, 0, options);
	}
	undefined(options) {
		return this.literal(void 0, { equalsOptions: options });
	}
	null(options) {
		return this.literal(null, { equalsOptions: options });
	}
	nullish(options) {
		return new NullishValidator(options);
	}
	any(options) {
		return new PassthroughValidator(options);
	}
	unknown(options) {
		return new PassthroughValidator(options);
	}
	never(options) {
		return new NeverValidator(options);
	}
	enum(values, options) {
		return this.union(values.map((value) => this.literal(value, { equalsOptions: options })), options);
	}
	nativeEnum(enumShape, options) {
		return new NativeEnumValidator(enumShape, options);
	}
	literal(value, options) {
		if (value instanceof Date) return this.date(options?.dateOptions).equal(value, options?.equalsOptions);
		return new LiteralValidator(value, options?.equalsOptions);
	}
	instance(expected, options) {
		return new InstanceValidator(expected, options);
	}
	union(validators, options) {
		return new UnionValidator(validators, options);
	}
	array(validator, options) {
		return new ArrayValidator(validator, options);
	}
	typedArray(type = "TypedArray", options) {
		return new TypedArrayValidator(type, options);
	}
	int8Array(options) {
		return this.typedArray("Int8Array", options);
	}
	uint8Array(options) {
		return this.typedArray("Uint8Array", options);
	}
	uint8ClampedArray(options) {
		return this.typedArray("Uint8ClampedArray", options);
	}
	int16Array(options) {
		return this.typedArray("Int16Array", options);
	}
	uint16Array(options) {
		return this.typedArray("Uint16Array", options);
	}
	int32Array(options) {
		return this.typedArray("Int32Array", options);
	}
	uint32Array(options) {
		return this.typedArray("Uint32Array", options);
	}
	float32Array(options) {
		return this.typedArray("Float32Array", options);
	}
	float64Array(options) {
		return this.typedArray("Float64Array", options);
	}
	bigInt64Array(options) {
		return this.typedArray("BigInt64Array", options);
	}
	bigUint64Array(options) {
		return this.typedArray("BigUint64Array", options);
	}
	tuple(validators, options) {
		return new TupleValidator(validators, options);
	}
	set(validator, options) {
		return new SetValidator(validator, options);
	}
	record(validator, options) {
		return new RecordValidator(validator, options);
	}
	map(keyValidator, valueValidator, options) {
		return new MapValidator(keyValidator, valueValidator, options);
	}
	lazy(validator, options) {
		return new LazyValidator(validator, options);
	}
};
__name(_Shapes, "Shapes");
var s = new _Shapes();
/**
* @license MIT
* @copyright 2020 Colin McDonnell
* @see https://github.com/colinhacks/zod/blob/master/LICENSE
*/
//#endregion
//#region ../schemas/libraries/@sapphire/shapeshift/download.ts
const imageSchema = s.object({
	id: s.number(),
	created: s.date(),
	title: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
	type: s.enum(["jpg", "png"]),
	size: s.number(),
	url: s.string().url()
});
const ratingSchema = s.object({
	id: s.number(),
	stars: s.number().greaterThanOrEqual(1).lessThanOrEqual(5),
	title: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
	text: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(1e3),
	images: s.array(imageSchema)
});
s.object({
	id: s.number(),
	created: s.date(),
	title: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
	brand: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(30),
	description: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(500),
	price: s.number().greaterThanOrEqual(1).lessThanOrEqual(1e4),
	discount: s.number().greaterThanOrEqual(1).lessThanOrEqual(100).nullable(),
	quantity: s.number().greaterThanOrEqual(0).lessThanOrEqual(10),
	tags: s.array(s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(30)),
	images: s.array(imageSchema),
	ratings: s.array(ratingSchema)
}).parse({});
//#endregion
