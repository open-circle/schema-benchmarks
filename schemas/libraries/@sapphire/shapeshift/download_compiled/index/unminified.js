import { inspect } from "node:util";
// \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isArray.js
var require_isArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Array.isArray;
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_freeGlobal.js
var require__freeGlobal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof global == "object" && global && global.Object === Object && global;
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_root.js
var require__root = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var freeGlobal = require__freeGlobal();
	/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	module.exports = freeGlobal || freeSelf || Function("return this")();
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_Symbol.js
var require__Symbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__root().Symbol;
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_getRawTag.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_objectToString.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseGetTag.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isObjectLike.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isSymbol.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_isKey.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isObject.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/isFunction.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_coreJsData.js
var require__coreJsData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__root()["__core-js_shared__"];
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_isMasked.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_toSource.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseIsNative.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_getValue.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_getNative.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_nativeCreate.js
var require__nativeCreate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(Object, "create");
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashClear.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashDelete.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashGet.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashHas.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_hashSet.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_Hash.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheClear.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/eq.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_assocIndexOf.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheDelete.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheGet.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheHas.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_listCacheSet.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_ListCache.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_Map.js
var require__Map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "Map");
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheClear.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_isKeyable.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_getMapData.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheDelete.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheGet.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheHas.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_mapCacheSet.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_MapCache.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/memoize.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_memoizeCapped.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_stringToPath.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_arrayMap.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseToString.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/toString.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_castPath.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_toKey.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseGet.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/get.js
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
// ../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/es6/index.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_setCacheAdd.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_setCacheHas.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_SetCache.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseFindIndex.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseIsNaN.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_strictIndexOf.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseIndexOf.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_arrayIncludes.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_arrayIncludesWith.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_cacheHas.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_Set.js
var require__Set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "Set");
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/noop.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_setToArray.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_createSet.js
var require__createSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Set = require__Set();
	var noop = require_noop();
	var setToArray = require__setToArray();
	module.exports = !(Set && 1 / setToArray(new Set([, -0]))[1] == 1 / 0) ? noop : function(values) {
		return new Set(values);
	};
}));
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/_baseUniq.js
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
// ../node_modules/.pnpm/lodash@4.18.1/node_modules/lodash/uniqWith.js
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
// ../node_modules/.pnpm/@sapphire+shapeshift@6.0.1/node_modules/@sapphire/shapeshift/dist/index.mjs
var import_get = /* @__PURE__ */ __toESM(require_get(), 1);
var import_es6 = /* @__PURE__ */ __toESM(require_es6(), 1);
var import_uniqWith = /* @__PURE__ */ __toESM(require_uniqWith(), 1);
const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
const customInspectSymbolStackLess = Symbol.for("nodejs.util.inspect.custom.stack-less");
var BaseError = class extends Error {
	toJSON() {
		return {
			name: this.name,
			message: this.message
		};
	}
	[customInspectSymbol](depth, options) {
		return `${this[customInspectSymbolStackLess](depth, options)}\n${this.stack.slice(this.stack.indexOf("\n"))}`;
	}
};
var BaseConstraintError = class extends BaseError {
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
var ExpectedConstraintError = class extends BaseConstraintError {
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
		const padding = `\n  ${options.stylize("|", "undefined")} `;
		const given = inspect(this.given, newOptions).replaceAll("\n", padding);
		return `${`${options.stylize("ExpectedConstraintError", "special")} > ${constraint}`}\n  ${options.stylize(this.message, "regexp")}\n${`\n  ${options.stylize("Expected: ", "string")}${options.stylize(this.expected, "boolean")}`}\n${`\n  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
var Result = class Result {
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
		return new Result(true, value);
	}
	static err(error) {
		return new Result(false, void 0, error);
	}
};
function whenConstraint(key, options, validator, validatorOptions) {
	return { run(input, parent) {
		if (!parent) return Result.err(new ExpectedConstraintError("s.object(T.when)", validatorOptions?.message ?? "Validator has no parent", parent, "Validator to have a parent"));
		const isKeyArray = Array.isArray(key);
		const predicate = resolveBooleanIs(options, isKeyArray ? key.map((propertyKey) => (0, import_get.default)(parent, propertyKey)) : (0, import_get.default)(parent, key), isKeyArray) ? options.then : options.otherwise;
		if (predicate) return predicate(validator).run(input);
		return Result.ok(input);
	} };
}
function resolveBooleanIs(options, value, isKeyArray) {
	if (options.is === void 0) return isKeyArray ? !value.some((val) => !val) : Boolean(value);
	if (typeof options.is === "function") return options.is(value);
	return value === options.is;
}
let validationEnabled = true;
/**
* @returns Whether validation is enabled
*/
function getGlobalValidationEnabled() {
	return validationEnabled;
}
function getValue(valueOrFn) {
	return typeof valueOrFn === "function" ? valueOrFn() : valueOrFn;
}
var BaseValidator = class {
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
		return this.addConstraint({ run: (input) => Result.ok(cb(input)) }, options);
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
	*
	* @param isValidationEnabled - Whether this validator should be enabled or disabled. You can pass boolean or a function returning boolean which will be called just before parsing.
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
function isUnique(input) {
	if (input.length < 2) return true;
	return (0, import_uniqWith.default)(input, import_es6.default).length === input.length;
}
function lessThan(a, b) {
	return a < b;
}
function lessThanOrEqual(a, b) {
	return a <= b;
}
function greaterThan(a, b) {
	return a > b;
}
function greaterThanOrEqual(a, b) {
	return a >= b;
}
function equal(a, b) {
	return a === b;
}
function notEqual(a, b) {
	return a !== b;
}
function arrayLengthComparator(comparator, name, expected, length, options) {
	return { run(input) {
		return comparator(input.length, length) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid Array length", input, expected));
	} };
}
function arrayLengthLessThan(value, options) {
	return arrayLengthComparator(lessThan, "s.array(T).lengthLessThan()", `expected.length < ${value}`, value, options);
}
function arrayLengthLessThanOrEqual(value, options) {
	return arrayLengthComparator(lessThanOrEqual, "s.array(T).lengthLessThanOrEqual()", `expected.length <= ${value}`, value, options);
}
function arrayLengthGreaterThan(value, options) {
	return arrayLengthComparator(greaterThan, "s.array(T).lengthGreaterThan()", `expected.length > ${value}`, value, options);
}
function arrayLengthGreaterThanOrEqual(value, options) {
	return arrayLengthComparator(greaterThanOrEqual, "s.array(T).lengthGreaterThanOrEqual()", `expected.length >= ${value}`, value, options);
}
function arrayLengthEqual(value, options) {
	return arrayLengthComparator(equal, "s.array(T).lengthEqual()", `expected.length === ${value}`, value, options);
}
function arrayLengthNotEqual(value, options) {
	return arrayLengthComparator(notEqual, "s.array(T).lengthNotEqual()", `expected.length !== ${value}`, value, options);
}
function arrayLengthRange(start, endBefore, options) {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return { run(input) {
		return input.length >= start && input.length < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.array(T).lengthRange()", options?.message ?? "Invalid Array length", input, expected));
	} };
}
function arrayLengthRangeInclusive(start, end, options) {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return { run(input) {
		return input.length >= start && input.length <= end ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.array(T).lengthRangeInclusive()", options?.message ?? "Invalid Array length", input, expected));
	} };
}
function arrayLengthRangeExclusive(startAfter, endBefore, options) {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return { run(input) {
		return input.length > startAfter && input.length < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.array(T).lengthRangeExclusive()", options?.message ?? "Invalid Array length", input, expected));
	} };
}
function uniqueArray(options) {
	return { run(input) {
		return isUnique(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.array(T).unique()", options?.message ?? "Array values are not unique", input, "Expected all values to be unique"));
	} };
}
var CombinedPropertyError = class CombinedPropertyError extends BaseError {
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
		const padding = `\n  ${options.stylize("|", "undefined")} `;
		return `${`${options.stylize("CombinedPropertyError", "special")} (${options.stylize(this.errors.length.toString(), "number")})`}\n  ${options.stylize(this.message, "regexp")}\n\n${this.errors.map(([key, error]) => {
			const property = CombinedPropertyError.formatProperty(key, options);
			const body = error[customInspectSymbolStackLess](depth - 1, newOptions).replaceAll("\n", padding);
			return `  input${property}${padding}${body}`;
		}).join("\n\n")}`;
	}
	static formatProperty(key, options) {
		if (typeof key === "string") return options.stylize(`.${key}`, "symbol");
		if (typeof key === "number") return `[${options.stylize(key.toString(), "number")}]`;
		return `[${options.stylize("Symbol", "symbol")}(${key.description})]`;
	}
};
var ValidationError = class extends BaseError {
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
		const padding = `\n  ${options.stylize("|", "undefined")} `;
		const given = inspect(this.given, newOptions).replaceAll("\n", padding);
		return `${`${options.stylize("ValidationError", "special")} > ${validator}`}\n  ${options.stylize(this.message, "regexp")}\n${`\n  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
var ArrayValidator = class extends BaseValidator {
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
		for (const [index, value] of values.entries()) {
			const result = this.validator.run(value);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([index, result.error]);
		}
		return errors.length === 0 ? Result.ok(transformed) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
};
function bigintComparator(comparator, name, expected, number, options) {
	return { run(input) {
		return comparator(input, number) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid bigint value", input, expected));
	} };
}
function bigintLessThan(value, options) {
	return bigintComparator(lessThan, "s.bigint().lessThan()", `expected < ${value}n`, value, options);
}
function bigintLessThanOrEqual(value, options) {
	return bigintComparator(lessThanOrEqual, "s.bigint().lessThanOrEqual()", `expected <= ${value}n`, value, options);
}
function bigintGreaterThan(value, options) {
	return bigintComparator(greaterThan, "s.bigint().greaterThan()", `expected > ${value}n`, value, options);
}
function bigintGreaterThanOrEqual(value, options) {
	return bigintComparator(greaterThanOrEqual, "s.bigint().greaterThanOrEqual()", `expected >= ${value}n`, value, options);
}
function bigintEqual(value, options) {
	return bigintComparator(equal, "s.bigint().equal()", `expected === ${value}n`, value, options);
}
function bigintNotEqual(value, options) {
	return bigintComparator(notEqual, "s.bigint().notEqual()", `expected !== ${value}n`, value, options);
}
function bigintDivisibleBy(divider, options) {
	const expected = `expected % ${divider}n === 0n`;
	return { run(input) {
		return input % divider === 0n ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.bigint().divisibleBy()", options?.message ?? "BigInt is not divisible", input, expected));
	} };
}
var BigIntValidator = class extends BaseValidator {
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
function booleanTrue(options) {
	return { run(input) {
		return input ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.boolean().true()", options?.message ?? "Invalid boolean value", input, "true"));
	} };
}
function booleanFalse(options) {
	return { run(input) {
		return input ? Result.err(new ExpectedConstraintError("s.boolean().false()", options?.message ?? "Invalid boolean value", input, "false")) : Result.ok(input);
	} };
}
var BooleanValidator = class extends BaseValidator {
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
function dateComparator(comparator, name, expected, number, options) {
	return { run(input) {
		return comparator(input.getTime(), number) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid Date value", input, expected));
	} };
}
function dateLessThan(value, options) {
	return dateComparator(lessThan, "s.date().lessThan()", `expected < ${value.toISOString()}`, value.getTime(), options);
}
function dateLessThanOrEqual(value, options) {
	return dateComparator(lessThanOrEqual, "s.date().lessThanOrEqual()", `expected <= ${value.toISOString()}`, value.getTime(), options);
}
function dateGreaterThan(value, options) {
	return dateComparator(greaterThan, "s.date().greaterThan()", `expected > ${value.toISOString()}`, value.getTime(), options);
}
function dateGreaterThanOrEqual(value, options) {
	return dateComparator(greaterThanOrEqual, "s.date().greaterThanOrEqual()", `expected >= ${value.toISOString()}`, value.getTime(), options);
}
function dateEqual(value, options) {
	return dateComparator(equal, "s.date().equal()", `expected === ${value.toISOString()}`, value.getTime(), options);
}
function dateNotEqual(value, options) {
	return dateComparator(notEqual, "s.date().notEqual()", `expected !== ${value.toISOString()}`, value.getTime(), options);
}
function dateInvalid(options) {
	return { run(input) {
		return Number.isNaN(input.getTime()) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.date().invalid()", options?.message ?? "Invalid Date value", input, "expected === NaN"));
	} };
}
function dateValid(options) {
	return { run(input) {
		return Number.isNaN(input.getTime()) ? Result.err(new ExpectedConstraintError("s.date().valid()", options?.message ?? "Invalid Date value", input, "expected !== NaN")) : Result.ok(input);
	} };
}
var DateValidator = class extends BaseValidator {
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
var ExpectedValidationError = class extends ValidationError {
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
		const padding = `\n  ${options.stylize("|", "undefined")} `;
		const expected = inspect(this.expected, newOptions).replaceAll("\n", padding);
		const given = inspect(this.given, newOptions).replaceAll("\n", padding);
		return `${`${options.stylize("ExpectedValidationError", "special")} > ${validator}`}\n  ${options.stylize(this.message, "regexp")}\n${`\n  ${options.stylize("Expected:", "string")}${padding}${expected}`}\n${`\n  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
var InstanceValidator = class extends BaseValidator {
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
var LiteralValidator = class extends BaseValidator {
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
var NeverValidator = class extends BaseValidator {
	handle(value) {
		return Result.err(new ValidationError("s.never()", this.validatorOptions.message ?? "Expected a value to not be passed", value));
	}
};
var NullishValidator = class extends BaseValidator {
	handle(value) {
		return value === void 0 || value === null ? Result.ok(value) : Result.err(new ValidationError("s.nullish()", this.validatorOptions.message ?? "Expected undefined or null", value));
	}
};
function numberComparator(comparator, name, expected, number, options) {
	return { run(input) {
		return comparator(input, number) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid number value", input, expected));
	} };
}
function numberLessThan(value, options) {
	return numberComparator(lessThan, "s.number().lessThan()", `expected < ${value}`, value, options);
}
function numberLessThanOrEqual(value, options) {
	return numberComparator(lessThanOrEqual, "s.number().lessThanOrEqual()", `expected <= ${value}`, value, options);
}
function numberGreaterThan(value, options) {
	return numberComparator(greaterThan, "s.number().greaterThan()", `expected > ${value}`, value, options);
}
function numberGreaterThanOrEqual(value, options) {
	return numberComparator(greaterThanOrEqual, "s.number().greaterThanOrEqual()", `expected >= ${value}`, value, options);
}
function numberEqual(value, options) {
	return numberComparator(equal, "s.number().equal()", `expected === ${value}`, value, options);
}
function numberNotEqual(value, options) {
	return numberComparator(notEqual, "s.number().notEqual()", `expected !== ${value}`, value, options);
}
function numberInt(options) {
	return { run(input) {
		return Number.isInteger(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().int()", options?.message ?? "Given value is not an integer", input, "Number.isInteger(expected) to be true"));
	} };
}
function numberSafeInt(options) {
	return { run(input) {
		return Number.isSafeInteger(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().safeInt()", options?.message ?? "Given value is not a safe integer", input, "Number.isSafeInteger(expected) to be true"));
	} };
}
function numberFinite(options) {
	return { run(input) {
		return Number.isFinite(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().finite()", options?.message ?? "Given value is not finite", input, "Number.isFinite(expected) to be true"));
	} };
}
function numberNaN(options) {
	return { run(input) {
		return Number.isNaN(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().equal(NaN)", options?.message ?? "Invalid number value", input, "expected === NaN"));
	} };
}
function numberNotNaN(options) {
	return { run(input) {
		return Number.isNaN(input) ? Result.err(new ExpectedConstraintError("s.number().notEqual(NaN)", options?.message ?? "Invalid number value", input, "expected !== NaN")) : Result.ok(input);
	} };
}
function numberDivisibleBy(divider, options) {
	const expected = `expected % ${divider} === 0`;
	return { run(input) {
		return input % divider === 0 ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.number().divisibleBy()", options?.message ?? "Number is not divisible", input, expected));
	} };
}
var NumberValidator = class extends BaseValidator {
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
var MissingPropertyError = class extends BaseError {
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
		return `${`${options.stylize("MissingPropertyError", "special")} > ${property}`}\n  ${options.stylize(this.message, "regexp")}`;
	}
};
var UnknownPropertyError = class extends BaseError {
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
		const padding = `\n  ${options.stylize("|", "undefined")} `;
		const given = inspect(this.value, newOptions).replaceAll("\n", padding);
		return `${`${options.stylize("UnknownPropertyError", "special")} > ${property}`}\n  ${options.stylize(this.message, "regexp")}\n${`\n  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
var DefaultValidator = class extends BaseValidator {
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
var CombinedError = class extends BaseError {
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
		const padding = `\n  ${options.stylize("|", "undefined")} `;
		return `${`${options.stylize("CombinedError", "special")} (${options.stylize(this.errors.length.toString(), "number")})`}\n  ${options.stylize(this.message, "regexp")}\n\n${this.errors.map((error, errorIndex) => {
			return `  ${options.stylize((errorIndex + 1).toString(), "number")} ${error[customInspectSymbolStackLess](depth - 1, newOptions).replaceAll("\n", padding)}`;
		}).join("\n\n")}`;
	}
};
var UnionValidator = class UnionValidator extends BaseValidator {
	constructor(validators, validatorOptions, constraints = []) {
		super(validatorOptions, constraints);
		this.validators = validators;
	}
	optional(options = this.validatorOptions) {
		if (this.validators.length === 0) return new UnionValidator([new LiteralValidator(void 0, options)], this.validatorOptions, this.constraints);
		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === void 0) return this.clone();
			if (validator.expected === null) return new UnionValidator([new NullishValidator(options), ...this.validators.slice(1)], this.validatorOptions, this.constraints);
		} else if (validator instanceof NullishValidator) return this.clone();
		return new UnionValidator([new LiteralValidator(void 0, options), ...this.validators], this.validatorOptions);
	}
	required(options = this.validatorOptions) {
		if (this.validators.length === 0) return this.clone();
		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === void 0) return new UnionValidator(this.validators.slice(1), this.validatorOptions, this.constraints);
		} else if (validator instanceof NullishValidator) return new UnionValidator([new LiteralValidator(null, options), ...this.validators.slice(1)], this.validatorOptions, this.constraints);
		return this.clone();
	}
	nullable(options = this.validatorOptions) {
		if (this.validators.length === 0) return new UnionValidator([new LiteralValidator(null, options)], this.validatorOptions, this.constraints);
		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === null) return this.clone();
			if (validator.expected === void 0) return new UnionValidator([new NullishValidator(options), ...this.validators.slice(1)], this.validatorOptions, this.constraints);
		} else if (validator instanceof NullishValidator) return this.clone();
		return new UnionValidator([new LiteralValidator(null, options), ...this.validators], this.validatorOptions);
	}
	nullish(options = this.validatorOptions) {
		if (this.validators.length === 0) return new UnionValidator([new NullishValidator(options)], options, this.constraints);
		const [validator] = this.validators;
		if (validator instanceof LiteralValidator) {
			if (validator.expected === null || validator.expected === void 0) return new UnionValidator([new NullishValidator(options), ...this.validators.slice(1)], options, this.constraints);
		} else if (validator instanceof NullishValidator) return this.clone();
		return new UnionValidator([new NullishValidator(options), ...this.validators], options);
	}
	or(...predicates) {
		return new UnionValidator([...this.validators, ...predicates], this.validatorOptions);
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
var ObjectValidator = class ObjectValidator extends BaseValidator {
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
			...schema instanceof ObjectValidator ? schema.shape : schema
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
		const runPredicate = (key, predicate) => {
			const result = predicate.run(value[key]);
			if (result.isOk()) finalObject[key] = result.value;
			else {
				const error = result.error;
				errors.push([key, error]);
			}
		};
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
		const runPredicate = (key, predicate) => {
			const result = predicate.run(value[key]);
			if (result.isOk()) finalResult[key] = result.value;
			else {
				const error = result.error;
				errors.push([key, error]);
			}
		};
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
		if (inputEntries.size !== 0) for (const [key, value] of inputEntries.entries()) errors.push([key, new UnknownPropertyError(key, value, this.validatorOptions)]);
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
var PassthroughValidator = class extends BaseValidator {
	handle(value) {
		return Result.ok(value);
	}
};
var RecordValidator = class extends BaseValidator {
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
var SetValidator = class extends BaseValidator {
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
/**
* license MIT
*
* copyright 2020 Colin McDonnell
*
* @see https://github.com/colinhacks/zod/blob/master/LICENSE
*/
const accountRegex = /^(?!\.)(?!.*\.\.)([\w+-.]*)[\w+-]$/i;
/**
* Validates an email address string based on various checks:
* - It must be a non nullish and non empty string
* - It must include at least an `@` symbol
* - The account name may not exceed 64 characters
* - The domain name may not exceed 255 characters
* - The domain must include at least one `.` symbol
* - Each part of the domain, split by `.` must not exceed 63 characters
* - The email address must be [RFC-5322](https://datatracker.ietf.org/doc/html/rfc5322) compliant
*
*  Based on the following sources:
* - `email-validator` by [manisharaan](https://github.com/manishsaraan) ([code](https://github.com/manishsaraan/email-validator/blob/master/index.js))
* - [Comparing E-mail Address Validating Regular Expressions](http://fightingforalostcause.net/misc/2006/compare-email-regex.php)
* - [Validating Email Addresses by Derrick Pallas](http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx)
* - [StackOverflow answer by bortzmeyer](http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378)
* - [The wikipedia page on Email addresses](https://en.wikipedia.org/wiki/Email_address)
*
* @param email - The email to validate
* @returns `true` if the email is valid, `false` otherwise
*/
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
function validateEmailDomain(domain) {
	try {
		return new URL(`http://${domain}`).hostname === domain;
	} catch {
		return false;
	}
}
/**
* Code ported from https://github.com/nodejs/node/blob/5fad0b93667ffc6e4def52996b9529ac99b26319/lib/internal/net.js
*/
const v4Seg = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
const v4Str = `(${v4Seg}[.]){3}${v4Seg}`;
const IPv4Reg = new RegExp(`^${v4Str}$`);
const v6Seg = "(?:[0-9a-fA-F]{1,4})";
const IPv6Reg = new RegExp(`^((?:${v6Seg}:){7}(?:${v6Seg}|:)|(?:${v6Seg}:){6}(?:${v4Str}|:${v6Seg}|:)|(?:${v6Seg}:){5}(?::${v4Str}|(:${v6Seg}){1,2}|:)|(?:${v6Seg}:){4}(?:(:${v6Seg}){0,1}:${v4Str}|(:${v6Seg}){1,3}|:)|(?:${v6Seg}:){3}(?:(:${v6Seg}){0,2}:${v4Str}|(:${v6Seg}){1,4}|:)|(?:${v6Seg}:){2}(?:(:${v6Seg}){0,3}:${v4Str}|(:${v6Seg}){1,5}|:)|(?:${v6Seg}:){1}(?:(:${v6Seg}){0,4}:${v4Str}|(:${v6Seg}){1,6}|:)|(?::((?::${v6Seg}){0,5}:${v4Str}|(?::${v6Seg}){1,7}|:)))(%[0-9a-zA-Z-.:]{1,})?\$`);
function isIPv4(input) {
	return IPv4Reg.test(input);
}
function isIPv6(input) {
	return IPv6Reg.test(input);
}
function isIP(input) {
	if (isIPv4(input)) return 4;
	if (isIPv6(input)) return 6;
	return 0;
}
const phoneNumberRegex = /^((?:\+|0{0,2})\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
function validatePhoneNumber(input) {
	return phoneNumberRegex.test(input);
}
var MultiplePossibilitiesConstraintError = class extends BaseConstraintError {
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
		const padding = `\n  ${verticalLine} `;
		const given = inspect(this.given, newOptions).replaceAll("\n", padding);
		const header = `${options.stylize("MultiplePossibilitiesConstraintError", "special")} > ${constraint}`;
		const message = options.stylize(this.message, "regexp");
		const expectedPadding = `\n  ${verticalLine} - `;
		return `${header}\n  ${message}\n${`\n  ${options.stylize("Expected any of the following:", "string")}${expectedPadding}${this.expected.map((possible) => options.stylize(possible, "boolean")).join(expectedPadding)}`}\n${`\n  ${options.stylize("Received:", "regexp")}${padding}${given}`}`;
	}
};
function combinedErrorFn(...fns) {
	switch (fns.length) {
		case 0: return () => null;
		case 1: return fns[0];
		case 2: {
			const [fn0, fn1] = fns;
			return (...params) => fn0(...params) ?? fn1(...params);
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
function createUrlValidators(options, validatorOptions) {
	const fns = [];
	if (options?.allowedProtocols?.length) fns.push(allowedProtocolsFn(options.allowedProtocols, validatorOptions));
	if (options?.allowedDomains?.length) fns.push(allowedDomainsFn(options.allowedDomains, validatorOptions));
	return combinedErrorFn(...fns);
}
function allowedProtocolsFn(allowedProtocols, options) {
	return (input, url) => allowedProtocols.includes(url.protocol) ? null : new MultiplePossibilitiesConstraintError("s.string().url()", options?.message ?? "Invalid URL protocol", input, allowedProtocols);
}
function allowedDomainsFn(allowedDomains, options) {
	return (input, url) => allowedDomains.includes(url.hostname) ? null : new MultiplePossibilitiesConstraintError("s.string().url()", options?.message ?? "Invalid URL domain", input, allowedDomains);
}
function stringLengthComparator(comparator, name, expected, length, options) {
	return { run(input) {
		return comparator(input.length, length) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid string length", input, expected));
	} };
}
function stringLengthLessThan(length, options) {
	return stringLengthComparator(lessThan, "s.string().lengthLessThan()", `expected.length < ${length}`, length, options);
}
function stringLengthLessThanOrEqual(length, options) {
	return stringLengthComparator(lessThanOrEqual, "s.string().lengthLessThanOrEqual()", `expected.length <= ${length}`, length, options);
}
function stringLengthGreaterThan(length, options) {
	return stringLengthComparator(greaterThan, "s.string().lengthGreaterThan()", `expected.length > ${length}`, length, options);
}
function stringLengthGreaterThanOrEqual(length, options) {
	return stringLengthComparator(greaterThanOrEqual, "s.string().lengthGreaterThanOrEqual()", `expected.length >= ${length}`, length, options);
}
function stringLengthEqual(length, options) {
	return stringLengthComparator(equal, "s.string().lengthEqual()", `expected.length === ${length}`, length, options);
}
function stringLengthNotEqual(length, options) {
	return stringLengthComparator(notEqual, "s.string().lengthNotEqual()", `expected.length !== ${length}`, length, options);
}
function stringEmail(options) {
	return { run(input) {
		return validateEmail(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.string().email()", options?.message ?? "Invalid email address", input, "expected to be an email address"));
	} };
}
function stringRegexValidator(type, expected, regex, options) {
	return { run(input) {
		return regex.test(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError(type, options?.message ?? "Invalid string format", input, expected));
	} };
}
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
function stringIp(version, options) {
	const ipVersion = version ? `v${version}` : "";
	const validatorFn = version === 4 ? isIPv4 : version === 6 ? isIPv6 : isIP;
	const name = `s.string().ip${ipVersion}()`;
	const message = `Invalid IP${ipVersion} address`;
	const expected = `expected to be an IP${ipVersion} address`;
	return { run(input) {
		return validatorFn(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? message, input, expected));
	} };
}
function stringRegex(regex, options) {
	return stringRegexValidator("s.string().regex()", `expected ${regex}.test(expected) to be true`, regex, options);
}
function stringUuid({ version = 4, nullable = false } = {}, options) {
	const uuidVersion = version ?? "1-5";
	const regex = new RegExp(`^(?:[0-9A-F]{8}-[0-9A-F]{4}-[${uuidVersion}][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}${nullable ? "|00000000-0000-0000-0000-000000000000" : ""})$`, "i");
	return stringRegexValidator("s.string().uuid()", `expected to match UUID${typeof uuidVersion === "number" ? `v${uuidVersion}` : ` in range of ${uuidVersion}`}`, regex, options);
}
function stringDate(options) {
	return { run(input) {
		const time = Date.parse(input);
		return Number.isNaN(time) ? Result.err(new ExpectedConstraintError("s.string().date()", options?.message ?? "Invalid date string", input, "expected to be a valid date string (in the ISO 8601 or ECMA-262 format)")) : Result.ok(input);
	} };
}
function stringPhone(options) {
	return { run(input) {
		return validatePhoneNumber(input) ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.string().phone()", options?.message ?? "Invalid phone number", input, "expected to be a phone number"));
	} };
}
var StringValidator = class extends BaseValidator {
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
	ip(version, options = this.validatorOptions) {
		return this.addConstraint(stringIp(version, options));
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
var TupleValidator = class extends BaseValidator {
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
		for (const [index, value] of values.entries()) {
			const result = this.validators[index].run(value);
			if (result.isOk()) transformed.push(result.value);
			else errors.push([index, result.error]);
		}
		return errors.length === 0 ? Result.ok(transformed) : Result.err(new CombinedPropertyError(errors, this.validatorOptions));
	}
};
var MapValidator = class extends BaseValidator {
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
var LazyValidator = class extends BaseValidator {
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
var UnknownEnumValueError = class extends BaseError {
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
		const padding = `\n  ${options.stylize("|", "undefined")} `;
		const pairs = this.enumKeys.map((key) => {
			const enumValue = this.enumMappings.get(key);
			return `${options.stylize(key, "string")} or ${options.stylize(enumValue.toString(), typeof enumValue === "number" ? "number" : "string")}`;
		}).join(padding);
		return `${`${options.stylize("UnknownEnumValueError", "special")} > ${value}`}\n  ${options.stylize(this.message, "regexp")}\n${`${padding}${pairs}`}`;
	}
};
var NativeEnumValidator = class extends BaseValidator {
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
function typedArrayByteLengthComparator(comparator, name, expected, length, options) {
	return { run(input) {
		return comparator(input.byteLength, length) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid Typed Array byte length", input, expected));
	} };
}
function typedArrayByteLengthLessThan(value, options) {
	return typedArrayByteLengthComparator(lessThan, "s.typedArray(T).byteLengthLessThan()", `expected.byteLength < ${value}`, value, options);
}
function typedArrayByteLengthLessThanOrEqual(value, options) {
	return typedArrayByteLengthComparator(lessThanOrEqual, "s.typedArray(T).byteLengthLessThanOrEqual()", `expected.byteLength <= ${value}`, value, options);
}
function typedArrayByteLengthGreaterThan(value, options) {
	return typedArrayByteLengthComparator(greaterThan, "s.typedArray(T).byteLengthGreaterThan()", `expected.byteLength > ${value}`, value, options);
}
function typedArrayByteLengthGreaterThanOrEqual(value, options) {
	return typedArrayByteLengthComparator(greaterThanOrEqual, "s.typedArray(T).byteLengthGreaterThanOrEqual()", `expected.byteLength >= ${value}`, value, options);
}
function typedArrayByteLengthEqual(value, options) {
	return typedArrayByteLengthComparator(equal, "s.typedArray(T).byteLengthEqual()", `expected.byteLength === ${value}`, value, options);
}
function typedArrayByteLengthNotEqual(value, options) {
	return typedArrayByteLengthComparator(notEqual, "s.typedArray(T).byteLengthNotEqual()", `expected.byteLength !== ${value}`, value, options);
}
function typedArrayByteLengthRange(start, endBefore, options) {
	const expected = `expected.byteLength >= ${start} && expected.byteLength < ${endBefore}`;
	return { run(input) {
		return input.byteLength >= start && input.byteLength < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).byteLengthRange()", options?.message ?? "Invalid Typed Array byte length", input, expected));
	} };
}
function typedArrayByteLengthRangeInclusive(start, end, options) {
	const expected = `expected.byteLength >= ${start} && expected.byteLength <= ${end}`;
	return { run(input) {
		return input.byteLength >= start && input.byteLength <= end ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).byteLengthRangeInclusive()", options?.message ?? "Invalid Typed Array byte length", input, expected));
	} };
}
function typedArrayByteLengthRangeExclusive(startAfter, endBefore, options) {
	const expected = `expected.byteLength > ${startAfter} && expected.byteLength < ${endBefore}`;
	return { run(input) {
		return input.byteLength > startAfter && input.byteLength < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).byteLengthRangeExclusive()", options?.message ?? "Invalid Typed Array byte length", input, expected));
	} };
}
function typedArrayLengthComparator(comparator, name, expected, length, options) {
	return { run(input) {
		return comparator(input.length, length) ? Result.ok(input) : Result.err(new ExpectedConstraintError(name, options?.message ?? "Invalid Typed Array length", input, expected));
	} };
}
function typedArrayLengthLessThan(value, options) {
	return typedArrayLengthComparator(lessThan, "s.typedArray(T).lengthLessThan()", `expected.length < ${value}`, value, options);
}
function typedArrayLengthLessThanOrEqual(value, options) {
	return typedArrayLengthComparator(lessThanOrEqual, "s.typedArray(T).lengthLessThanOrEqual()", `expected.length <= ${value}`, value, options);
}
function typedArrayLengthGreaterThan(value, options) {
	return typedArrayLengthComparator(greaterThan, "s.typedArray(T).lengthGreaterThan()", `expected.length > ${value}`, value, options);
}
function typedArrayLengthGreaterThanOrEqual(value, options) {
	return typedArrayLengthComparator(greaterThanOrEqual, "s.typedArray(T).lengthGreaterThanOrEqual()", `expected.length >= ${value}`, value, options);
}
function typedArrayLengthEqual(value, options) {
	return typedArrayLengthComparator(equal, "s.typedArray(T).lengthEqual()", `expected.length === ${value}`, value, options);
}
function typedArrayLengthNotEqual(value, options) {
	return typedArrayLengthComparator(notEqual, "s.typedArray(T).lengthNotEqual()", `expected.length !== ${value}`, value, options);
}
function typedArrayLengthRange(start, endBefore, options) {
	const expected = `expected.length >= ${start} && expected.length < ${endBefore}`;
	return { run(input) {
		return input.length >= start && input.length < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).lengthRange()", options?.message ?? "Invalid Typed Array length", input, expected));
	} };
}
function typedArrayLengthRangeInclusive(start, end, options) {
	const expected = `expected.length >= ${start} && expected.length <= ${end}`;
	return { run(input) {
		return input.length >= start && input.length <= end ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).lengthRangeInclusive()", options?.message ?? "Invalid Typed Array length", input, expected));
	} };
}
function typedArrayLengthRangeExclusive(startAfter, endBefore, options) {
	const expected = `expected.length > ${startAfter} && expected.length < ${endBefore}`;
	return { run(input) {
		return input.length > startAfter && input.length < endBefore ? Result.ok(input) : Result.err(new ExpectedConstraintError("s.typedArray(T).lengthRangeExclusive()", options?.message ?? "Invalid Typed Array length", input, expected));
	} };
}
const vowels = [
	"a",
	"e",
	"i",
	"o",
	"u"
];
const aOrAn = (word) => {
	return `${vowels.includes(word[0].toLowerCase()) ? "an" : "a"} ${word}`;
};
const TypedArrays = {
	Int8Array: (x) => x instanceof Int8Array,
	Uint8Array: (x) => x instanceof Uint8Array,
	Uint8ClampedArray: (x) => x instanceof Uint8ClampedArray,
	Int16Array: (x) => x instanceof Int16Array,
	Uint16Array: (x) => x instanceof Uint16Array,
	Int32Array: (x) => x instanceof Int32Array,
	Uint32Array: (x) => x instanceof Uint32Array,
	Float32Array: (x) => x instanceof Float32Array,
	Float64Array: (x) => x instanceof Float64Array,
	BigInt64Array: (x) => x instanceof BigInt64Array,
	BigUint64Array: (x) => x instanceof BigUint64Array,
	TypedArray: (x) => ArrayBuffer.isView(x) && !(x instanceof DataView)
};
var TypedArrayValidator = class extends BaseValidator {
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
var Shapes = class {
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
const s = new Shapes();
// ../schemas/libraries/@sapphire/shapeshift/download/index.ts
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
