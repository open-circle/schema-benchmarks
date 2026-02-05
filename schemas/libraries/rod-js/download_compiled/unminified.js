//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (!no_symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);

//#endregion
//#region ../node_modules/.pnpm/rod-js@0.2.1/node_modules/rod-js/wasm/web/rod_wasm.js
var rod_wasm_exports = /* @__PURE__ */ __exportAll({
	RodSchema: () => RodSchema,
	default: () => __wbg_init,
	initSync: () => initSync,
	main: () => main
});
function main() {
	wasm.main();
}
function __wbg_get_imports() {
	const import0 = {
		__proto__: null,
		__wbg_Error_8c4e43fe74559d73: function(arg0, arg1) {
			return Error(getStringFromWasm0(arg0, arg1));
		},
		__wbg_String_8f0eb39a4a4c2f66: function(arg0, arg1) {
			const ptr1 = passStringToWasm0(String(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4, len1, true);
			getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
		},
		__wbg___wbindgen_bigint_get_as_i64_8fcf4ce7f1ca72a2: function(arg0, arg1) {
			const v = arg1;
			const ret = typeof v === "bigint" ? v : void 0;
			getDataViewMemory0().setBigInt64(arg0 + 8, isLikeNone(ret) ? BigInt(0) : ret, true);
			getDataViewMemory0().setInt32(arg0 + 0, !isLikeNone(ret), true);
		},
		__wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(arg0) {
			const v = arg0;
			const ret = typeof v === "boolean" ? v : void 0;
			return isLikeNone(ret) ? 16777215 : ret ? 1 : 0;
		},
		__wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(arg0, arg1) {
			const ptr1 = passStringToWasm0(debugString(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4, len1, true);
			getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
		},
		__wbg___wbindgen_in_47fa6863be6f2f25: function(arg0, arg1) {
			return arg0 in arg1;
		},
		__wbg___wbindgen_is_bigint_31b12575b56f32fc: function(arg0) {
			return typeof arg0 === "bigint";
		},
		__wbg___wbindgen_is_function_0095a73b8b156f76: function(arg0) {
			return typeof arg0 === "function";
		},
		__wbg___wbindgen_is_null_ac34f5003991759a: function(arg0) {
			return arg0 === null;
		},
		__wbg___wbindgen_is_object_5ae8e5880f2c1fbd: function(arg0) {
			const val = arg0;
			return typeof val === "object" && val !== null;
		},
		__wbg___wbindgen_is_string_cd444516edc5b180: function(arg0) {
			return typeof arg0 === "string";
		},
		__wbg___wbindgen_is_undefined_9e4d92534c42d778: function(arg0) {
			return arg0 === void 0;
		},
		__wbg___wbindgen_jsval_eq_11888390b0186270: function(arg0, arg1) {
			return arg0 === arg1;
		},
		__wbg___wbindgen_jsval_loose_eq_9dd77d8cd6671811: function(arg0, arg1) {
			return arg0 == arg1;
		},
		__wbg___wbindgen_number_get_8ff4255516ccad3e: function(arg0, arg1) {
			const obj = arg1;
			const ret = typeof obj === "number" ? obj : void 0;
			getDataViewMemory0().setFloat64(arg0 + 8, isLikeNone(ret) ? 0 : ret, true);
			getDataViewMemory0().setInt32(arg0 + 0, !isLikeNone(ret), true);
		},
		__wbg___wbindgen_string_get_72fb696202c56729: function(arg0, arg1) {
			const obj = arg1;
			const ret = typeof obj === "string" ? obj : void 0;
			var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			var len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4, len1, true);
			getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
		},
		__wbg___wbindgen_throw_be289d5034ed271b: function(arg0, arg1) {
			throw new Error(getStringFromWasm0(arg0, arg1));
		},
		__wbg_call_389efe28435a9388: function() {
			return handleError(function(arg0, arg1) {
				return arg0.call(arg1);
			}, arguments);
		},
		__wbg_done_57b39ecd9addfe81: function(arg0) {
			return arg0.done;
		},
		__wbg_entries_58c7934c745daac7: function(arg0) {
			return Object.entries(arg0);
		},
		__wbg_error_7534b8e9a36f1ab4: function(arg0, arg1) {
			let deferred0_0;
			let deferred0_1;
			try {
				deferred0_0 = arg0;
				deferred0_1 = arg1;
				console.error(getStringFromWasm0(arg0, arg1));
			} finally {
				wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
			}
		},
		__wbg_from_bddd64e7d5ff6941: function(arg0) {
			return Array.from(arg0);
		},
		__wbg_get_0bdeda968867e10e: function() {
			return handleError(function(arg0, arg1) {
				return Reflect.get(arg0, arg1 >>> 0);
			}, arguments);
		},
		__wbg_get_9b94d73e6221f75c: function(arg0, arg1) {
			return arg0[arg1 >>> 0];
		},
		__wbg_get_b3ed3ad4be2bc8ac: function() {
			return handleError(function(arg0, arg1) {
				return Reflect.get(arg0, arg1);
			}, arguments);
		},
		__wbg_instanceof_ArrayBuffer_c367199e2fa2aa04: function(arg0) {
			let result;
			try {
				result = arg0 instanceof ArrayBuffer;
			} catch (_) {
				result = false;
			}
			return result;
		},
		__wbg_instanceof_Map_53af74335dec57f4: function(arg0) {
			let result;
			try {
				result = arg0 instanceof Map;
			} catch (_) {
				result = false;
			}
			return result;
		},
		__wbg_instanceof_Uint8Array_9b9075935c74707c: function(arg0) {
			let result;
			try {
				result = arg0 instanceof Uint8Array;
			} catch (_) {
				result = false;
			}
			return result;
		},
		__wbg_isArray_d314bb98fcf08331: function(arg0) {
			return Array.isArray(arg0);
		},
		__wbg_isSafeInteger_bfbc7332a9768d2a: function(arg0) {
			return Number.isSafeInteger(arg0);
		},
		__wbg_iterator_6ff6560ca1568e55: function() {
			return Symbol.iterator;
		},
		__wbg_keys_b50a709a76add04e: function(arg0) {
			return Object.keys(arg0);
		},
		__wbg_length_32ed9a279acd054c: function(arg0) {
			return arg0.length;
		},
		__wbg_length_35a7bace40f36eac: function(arg0) {
			return arg0.length;
		},
		__wbg_length_68dc7c5cf1b6d349: function(arg0) {
			return arg0.length;
		},
		__wbg_new_361308b2356cecd0: function() {
			return /* @__PURE__ */ new Object();
		},
		__wbg_new_3eb36ae241fe6f44: function() {
			return new Array();
		},
		__wbg_new_8a6f238a6ece86ea: function() {
			return /* @__PURE__ */ new Error();
		},
		__wbg_new_dca287b076112a51: function() {
			return /* @__PURE__ */ new Map();
		},
		__wbg_new_dd2b680c8bf6ae29: function(arg0) {
			return new Uint8Array(arg0);
		},
		__wbg_new_from_slice_a3d2629dc1826784: function(arg0, arg1) {
			return new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
		},
		__wbg_new_with_length_1763c527b2923202: function(arg0) {
			return new Array(arg0 >>> 0);
		},
		__wbg_next_3482f54c49e8af19: function() {
			return handleError(function(arg0) {
				return arg0.next();
			}, arguments);
		},
		__wbg_next_418f80d8f5303233: function(arg0) {
			return arg0.next;
		},
		__wbg_prototypesetcall_bdcdcc5842e4d77d: function(arg0, arg1, arg2) {
			Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
		},
		__wbg_push_8ffdcb2063340ba5: function(arg0, arg1) {
			return arg0.push(arg1);
		},
		__wbg_set_1eb0999cf5d27fc8: function(arg0, arg1, arg2) {
			return arg0.set(arg1, arg2);
		},
		__wbg_set_3f1d0b984ed272ed: function(arg0, arg1, arg2) {
			arg0[arg1] = arg2;
		},
		__wbg_set_6cb8631f80447a67: function() {
			return handleError(function(arg0, arg1, arg2) {
				return Reflect.set(arg0, arg1, arg2);
			}, arguments);
		},
		__wbg_set_f43e577aea94465b: function(arg0, arg1, arg2) {
			arg0[arg1 >>> 0] = arg2;
		},
		__wbg_stack_0ed75d68575b0f3c: function(arg0, arg1) {
			const ret = arg1.stack;
			const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
			const len1 = WASM_VECTOR_LEN;
			getDataViewMemory0().setInt32(arg0 + 4, len1, true);
			getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
		},
		__wbg_stringify_8d1cc6ff383e8bae: function() {
			return handleError(function(arg0) {
				return JSON.stringify(arg0);
			}, arguments);
		},
		__wbg_value_0546255b415e96c1: function(arg0) {
			return arg0.value;
		},
		__wbindgen_cast_0000000000000001: function(arg0) {
			return arg0;
		},
		__wbindgen_cast_0000000000000002: function(arg0) {
			return arg0;
		},
		__wbindgen_cast_0000000000000003: function(arg0, arg1) {
			return getStringFromWasm0(arg0, arg1);
		},
		__wbindgen_cast_0000000000000004: function(arg0) {
			return BigInt.asUintN(64, arg0);
		},
		__wbindgen_init_externref_table: function() {
			const table = wasm.__wbindgen_externrefs;
			const offset = table.grow(4);
			table.set(0, void 0);
			table.set(offset + 0, void 0);
			table.set(offset + 1, null);
			table.set(offset + 2, true);
			table.set(offset + 3, false);
		}
	};
	return {
		__proto__: null,
		"./rod_wasm_bg.js": import0
	};
}
function addToExternrefTable0(obj) {
	const idx = wasm.__externref_table_alloc();
	wasm.__wbindgen_externrefs.set(idx, obj);
	return idx;
}
function debugString(val) {
	const type = typeof val;
	if (type == "number" || type == "boolean" || val == null) return `${val}`;
	if (type == "string") return `"${val}"`;
	if (type == "symbol") {
		const description = val.description;
		if (description == null) return "Symbol";
		else return `Symbol(${description})`;
	}
	if (type == "function") {
		const name = val.name;
		if (typeof name == "string" && name.length > 0) return `Function(${name})`;
		else return "Function";
	}
	if (Array.isArray(val)) {
		const length = val.length;
		let debug = "[";
		if (length > 0) debug += debugString(val[0]);
		for (let i = 1; i < length; i++) debug += ", " + debugString(val[i]);
		debug += "]";
		return debug;
	}
	const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
	let className;
	if (builtInMatches && builtInMatches.length > 1) className = builtInMatches[1];
	else return toString.call(val);
	if (className == "Object") try {
		return "Object(" + JSON.stringify(val) + ")";
	} catch (_) {
		return "Object";
	}
	if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack}`;
	return className;
}
function getArrayU8FromWasm0(ptr, len) {
	ptr = ptr >>> 0;
	return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function getDataViewMemory0() {
	if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
	return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
	ptr = ptr >>> 0;
	return decodeText(ptr, len);
}
function getUint8ArrayMemory0() {
	if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
	return cachedUint8ArrayMemory0;
}
function handleError(f, args) {
	try {
		return f.apply(this, args);
	} catch (e) {
		const idx = addToExternrefTable0(e);
		wasm.__wbindgen_exn_store(idx);
	}
}
function isLikeNone(x) {
	return x === void 0 || x === null;
}
function passStringToWasm0(arg, malloc, realloc) {
	if (realloc === void 0) {
		const buf = cachedTextEncoder.encode(arg);
		const ptr = malloc(buf.length, 1) >>> 0;
		getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
		WASM_VECTOR_LEN = buf.length;
		return ptr;
	}
	let len = arg.length;
	let ptr = malloc(len, 1) >>> 0;
	const mem = getUint8ArrayMemory0();
	let offset = 0;
	for (; offset < len; offset++) {
		const code = arg.charCodeAt(offset);
		if (code > 127) break;
		mem[ptr + offset] = code;
	}
	if (offset !== len) {
		if (offset !== 0) arg = arg.slice(offset);
		ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
		const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
		const ret = cachedTextEncoder.encodeInto(arg, view);
		offset += ret.written;
		ptr = realloc(ptr, len, offset, 1) >>> 0;
	}
	WASM_VECTOR_LEN = offset;
	return ptr;
}
function takeFromExternrefTable0(idx) {
	const value = wasm.__wbindgen_externrefs.get(idx);
	wasm.__externref_table_dealloc(idx);
	return value;
}
function decodeText(ptr, len) {
	numBytesDecoded += len;
	if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
		cachedTextDecoder = new TextDecoder("utf-8", {
			ignoreBOM: true,
			fatal: true
		});
		cachedTextDecoder.decode();
		numBytesDecoded = len;
	}
	return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function __wbg_finalize_init(instance, module) {
	wasm = instance.exports;
	cachedDataViewMemory0 = null;
	cachedUint8ArrayMemory0 = null;
	wasm.__wbindgen_start();
	return wasm;
}
async function __wbg_load(module, imports) {
	if (typeof Response === "function" && module instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming === "function") try {
			return await WebAssembly.instantiateStreaming(module, imports);
		} catch (e) {
			if (module.ok && expectedResponseType(module.type) && module.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
			else throw e;
		}
		const bytes = await module.arrayBuffer();
		return await WebAssembly.instantiate(bytes, imports);
	} else {
		const instance = await WebAssembly.instantiate(module, imports);
		if (instance instanceof WebAssembly.Instance) return {
			instance,
			module
		};
		else return instance;
	}
	function expectedResponseType(type) {
		switch (type) {
			case "basic":
			case "cors":
			case "default": return true;
		}
		return false;
	}
}
function initSync(module) {
	if (wasm !== void 0) return wasm;
	if (module !== void 0) if (Object.getPrototypeOf(module) === Object.prototype) ({module} = module);
	else console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
	const imports = __wbg_get_imports();
	if (!(module instanceof WebAssembly.Module)) module = new WebAssembly.Module(module);
	return __wbg_finalize_init(new WebAssembly.Instance(module, imports), module);
}
async function __wbg_init(module_or_path) {
	if (wasm !== void 0) return wasm;
	if (module_or_path !== void 0) if (Object.getPrototypeOf(module_or_path) === Object.prototype) ({module_or_path} = module_or_path);
	else console.warn("using deprecated parameters for the initialization function; pass a single object instead");
	if (module_or_path === void 0) module_or_path = new URL("rod_wasm_bg.wasm", import.meta.url);
	const imports = __wbg_get_imports();
	if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) module_or_path = fetch(module_or_path);
	const { instance, module } = await __wbg_load(await module_or_path, imports);
	return __wbg_finalize_init(instance, module);
}
var RodSchema, RodSchemaFinalization, cachedDataViewMemory0, cachedUint8ArrayMemory0, cachedTextDecoder, MAX_SAFARI_DECODE_BYTES, numBytesDecoded, cachedTextEncoder, WASM_VECTOR_LEN, wasm;
var init_rod_wasm = __esmMin((() => {
	RodSchema = class {
		__destroy_into_raw() {
			const ptr = this.__wbg_ptr;
			this.__wbg_ptr = 0;
			RodSchemaFinalization.unregister(this);
			return ptr;
		}
		free() {
			const ptr = this.__destroy_into_raw();
			wasm.__wbg_rodschema_free(ptr, 0);
		}
		/**
		* @param {any} collection
		* @returns {Uint8Array}
		*/
		check_batch(collection) {
			const ret = wasm.rodschema_check_batch(this.__wbg_ptr, collection);
			if (ret[2]) throw takeFromExternrefTable0(ret[1]);
			return takeFromExternrefTable0(ret[0]);
		}
		/**
		* @param {any} collection
		* @returns {Uint8Array}
		*/
		check_batch_eager(collection) {
			const ret = wasm.rodschema_check_batch_eager(this.__wbg_ptr, collection);
			if (ret[2]) throw takeFromExternrefTable0(ret[1]);
			return takeFromExternrefTable0(ret[0]);
		}
		/**
		* @param {any} spec_json
		*/
		constructor(spec_json) {
			const ret = wasm.rodschema_new(spec_json);
			if (ret[2]) throw takeFromExternrefTable0(ret[1]);
			this.__wbg_ptr = ret[0] >>> 0;
			RodSchemaFinalization.register(this, this.__wbg_ptr, this);
			return this;
		}
		/**
		* @param {any} collection
		* @returns {any}
		*/
		validate_batch(collection) {
			const ret = wasm.rodschema_validate_batch(this.__wbg_ptr, collection);
			if (ret[2]) throw takeFromExternrefTable0(ret[1]);
			return takeFromExternrefTable0(ret[0]);
		}
		/**
		* @param {any} data
		* @returns {any}
		*/
		validate_eager(data) {
			const ret = wasm.rodschema_validate_eager(this.__wbg_ptr, data);
			if (ret[2]) throw takeFromExternrefTable0(ret[1]);
			return takeFromExternrefTable0(ret[0]);
		}
		/**
		* @param {any} data
		* @returns {any}
		*/
		validate_lazy(data) {
			const ret = wasm.rodschema_validate_lazy(this.__wbg_ptr, data);
			if (ret[2]) throw takeFromExternrefTable0(ret[1]);
			return takeFromExternrefTable0(ret[0]);
		}
	};
	if (Symbol.dispose) RodSchema.prototype[Symbol.dispose] = RodSchema.prototype.free;
	RodSchemaFinalization = typeof FinalizationRegistry === "undefined" ? {
		register: () => {},
		unregister: () => {}
	} : new FinalizationRegistry((ptr) => wasm.__wbg_rodschema_free(ptr >>> 0, 1));
	cachedDataViewMemory0 = null;
	cachedUint8ArrayMemory0 = null;
	cachedTextDecoder = new TextDecoder("utf-8", {
		ignoreBOM: true,
		fatal: true
	});
	cachedTextDecoder.decode();
	MAX_SAFARI_DECODE_BYTES = 2146435072;
	numBytesDecoded = 0;
	cachedTextEncoder = new TextEncoder();
	if (!("encodeInto" in cachedTextEncoder)) cachedTextEncoder.encodeInto = function(arg, view) {
		const buf = cachedTextEncoder.encode(arg);
		view.set(buf);
		return {
			read: arg.length,
			written: buf.length
		};
	};
	WASM_VECTOR_LEN = 0;
}));

//#endregion
//#region ../node_modules/.pnpm/rod-js@0.2.1/node_modules/rod-js/dist/bridge-browser.js
var require_bridge_browser = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.browserBridge = void 0;
	const rod_wasm_1 = __importStar((init_rod_wasm(), __toCommonJS(rod_wasm_exports)));
	const schemaCache = /* @__PURE__ */ new Map();
	let initialized = false;
	exports.browserBridge = {
		async init() {
			if (!initialized) {
				await (0, rod_wasm_1.default)();
				initialized = true;
			}
		},
		getSchema(spec) {
			if (!initialized) throw new Error("Rod not initialized. Call rod.init()");
			const key = JSON.stringify(spec);
			if (schemaCache.has(key)) return schemaCache.get(key);
			const schema = new rod_wasm_1.RodSchema(spec);
			schemaCache.set(key, schema);
			return schema;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/rod-js@0.2.1/node_modules/rod-js/dist/builders.js
var require_builders = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RodNever = exports.RodAny = exports.RodDiscriminatedUnion = exports.RodUnion = exports.RodSet = exports.RodMap = exports.RodRecord = exports.RodTuple = exports.RodObject = exports.RodArray = exports.RodEnum = exports.RodLiteral = exports.RodDate = exports.RodBoolean = exports.RodNumber = exports.RodString = exports.RodDynamic = exports.RodType = void 0;
	var RodType = class {
		bridge;
		def;
		_compiled = null;
		constructor(type, bridge) {
			this.bridge = bridge;
			this.def = { type };
		}
		getCompiled() {
			if (!this._compiled) this._compiled = this.bridge.getSchema(this.toSpec());
			return this._compiled;
		}
		toSpec() {
			return this.def;
		}
		parse(data, opts) {
			const schema = this.getCompiled();
			const result = (opts?.mode ?? "lazy") === "lazy" ? schema.validate_lazy(data) : schema.validate_eager(data);
			if (!result.success) throw new Error(JSON.stringify(result.error));
			return result.data;
		}
		safeParse(data, opts) {
			try {
				return {
					success: true,
					data: this.parse(data, opts)
				};
			} catch (e) {
				return {
					success: false,
					error: JSON.parse(e.message)
				};
			}
		}
		/**
		* The fastest possible batch validation.
		* Returns a Uint8Array bitmask (1 = valid, 0 = invalid).
		* Bypasses all JS object creation overhead.
		*/
		checkBatch(items) {
			return this.getCompiled().check_batch(items);
		}
		checkBatchEager(items) {
			return this.getCompiled().check_batch_eager(items);
		}
		parseBatch(items) {
			return this.getCompiled().validate_batch(items);
		}
	};
	exports.RodType = RodType;
	var RodDynamic = class extends RodType {
		constructor(spec, bridge) {
			super(spec.type || "unknown", bridge);
			this.def = spec;
		}
	};
	exports.RodDynamic = RodDynamic;
	var RodString = class extends RodType {
		constructor(bridge) {
			super("string", bridge);
		}
		min(val) {
			this.def.min = val;
			return this;
		}
		max(val) {
			this.def.max = val;
			return this;
		}
		length(val) {
			this.def.length = val;
			return this;
		}
		email() {
			this.def.email = true;
			return this;
		}
		url() {
			this.def.url = true;
			return this;
		}
		uuid() {
			this.def.uuid = true;
			return this;
		}
		cuid() {
			this.def.cuid = true;
			return this;
		}
		datetime() {
			this.def.datetime = true;
			return this;
		}
		ip() {
			this.def.ip = true;
			return this;
		}
		regex(pattern) {
			this.def.regex = pattern;
			return this;
		}
		startsWith(val) {
			this.def.starts_with = val;
			return this;
		}
		endsWith(val) {
			this.def.ends_with = val;
			return this;
		}
		includes(val) {
			this.def.includes = val;
			return this;
		}
		trim() {
			this.def.trim = true;
			return this;
		}
	};
	exports.RodString = RodString;
	var RodNumber = class extends RodType {
		constructor(bridge) {
			super("number", bridge);
		}
		min(val) {
			this.def.min = val;
			return this;
		}
		max(val) {
			this.def.max = val;
			return this;
		}
		int() {
			this.def.int = true;
			return this;
		}
	};
	exports.RodNumber = RodNumber;
	var RodBoolean = class extends RodType {
		constructor(bridge) {
			super("boolean", bridge);
		}
	};
	exports.RodBoolean = RodBoolean;
	var RodDate = class extends RodType {
		constructor(bridge) {
			super("date", bridge);
		}
		min(timestamp) {
			this.def.min = timestamp;
			return this;
		}
		max(timestamp) {
			this.def.max = timestamp;
			return this;
		}
	};
	exports.RodDate = RodDate;
	var RodLiteral = class extends RodType {
		constructor(value, bridge) {
			super("literal", bridge);
			this.def.value = value;
		}
	};
	exports.RodLiteral = RodLiteral;
	var RodEnum = class extends RodType {
		constructor(values, bridge) {
			super("enum", bridge);
			this.def.values = values;
		}
	};
	exports.RodEnum = RodEnum;
	var RodArray = class extends RodType {
		constructor(itemSchema, bridge) {
			super("array", bridge);
			this.def.items = itemSchema.toSpec();
		}
		min(val) {
			this.def.min = val;
			return this;
		}
		max(val) {
			this.def.max = val;
			return this;
		}
	};
	exports.RodArray = RodArray;
	var RodObject = class extends RodType {
		constructor(shape, bridge) {
			super("object", bridge);
			const props = {};
			for (const k in shape) props[k] = shape[k].toSpec();
			this.def.properties = props;
		}
		strict() {
			this.def.strict = true;
			return this;
		}
		passthrough() {
			return this;
		}
	};
	exports.RodObject = RodObject;
	var RodTuple = class extends RodType {
		constructor(items, bridge) {
			super("tuple", bridge);
			this.def.items = items.map((i) => i.toSpec());
		}
	};
	exports.RodTuple = RodTuple;
	var RodRecord = class extends RodType {
		constructor(keySchema, valueSchema, bridge) {
			super("record", bridge);
			this.def.key = keySchema.toSpec();
			this.def.value = valueSchema.toSpec();
		}
	};
	exports.RodRecord = RodRecord;
	var RodMap = class extends RodType {
		constructor(keySchema, valueSchema, bridge) {
			super("map", bridge);
			this.def.key = keySchema.toSpec();
			this.def.value = valueSchema.toSpec();
		}
	};
	exports.RodMap = RodMap;
	var RodSet = class extends RodType {
		constructor(valueSchema, bridge) {
			super("set", bridge);
			this.def.value = valueSchema.toSpec();
		}
		min(val) {
			this.def.min = val;
			return this;
		}
	};
	exports.RodSet = RodSet;
	var RodUnion = class extends RodType {
		constructor(options, bridge) {
			super("union", bridge);
			this.def.options = options.map((o) => o.toSpec());
		}
	};
	exports.RodUnion = RodUnion;
	var RodDiscriminatedUnion = class extends RodType {
		constructor(discriminator, options, bridge) {
			super("discriminatedUnion", bridge);
			this.def.discriminator = discriminator;
			this.def.options = options.map((o) => o.toSpec());
		}
	};
	exports.RodDiscriminatedUnion = RodDiscriminatedUnion;
	var RodAny = class extends RodType {
		constructor(bridge) {
			super("any", bridge);
		}
	};
	exports.RodAny = RodAny;
	var RodNever = class extends RodType {
		constructor(bridge) {
			super("never", bridge);
		}
	};
	exports.RodNever = RodNever;
}));

//#endregion
//#region ../node_modules/.pnpm/rod-js@0.2.1/node_modules/rod-js/dist/factory.js
var require_factory = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createRod = createRod;
	const b = __importStar(require_builders());
	function createRod(bridge) {
		return {
			init: () => bridge.init(),
			fromJSON: (spec) => {
				return new b.RodDynamic(spec, bridge);
			},
			string: () => new b.RodString(bridge),
			number: () => new b.RodNumber(bridge),
			boolean: () => new b.RodBoolean(bridge),
			date: () => new b.RodDate(bridge),
			literal: (val) => new b.RodLiteral(val, bridge),
			enum: (values) => new b.RodEnum(values, bridge),
			array: (schema) => new b.RodArray(schema, bridge),
			object: (shape) => new b.RodObject(shape, bridge),
			tuple: (items) => new b.RodTuple(items, bridge),
			record: (key, value) => new b.RodRecord(key, value, bridge),
			map: (key, value) => new b.RodMap(key, value, bridge),
			set: (value) => new b.RodSet(value, bridge),
			union: (options) => new b.RodUnion(options, bridge),
			discriminatedUnion: (disc, options) => new b.RodDiscriminatedUnion(disc, options, bridge),
			any: () => new b.RodAny(bridge),
			never: () => new b.RodNever(bridge)
		};
	}
}));

//#endregion
//#region ../node_modules/.pnpm/rod-js@0.2.1/node_modules/rod-js/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.rod = void 0;
	const bridge_browser_1 = require_bridge_browser();
	const factory_1 = require_factory();
	exports.rod = (0, factory_1.createRod)(bridge_browser_1.browserBridge);
	__exportStar(require_builders(), exports);
}));

//#endregion
//#region ../schemas/libraries/rod-js/download.ts
var import_dist = require_dist();
await import_dist.rod.init();
const imageSchema = import_dist.rod.object({
	id: import_dist.rod.number(),
	created: import_dist.rod.date(),
	title: import_dist.rod.string().min(1).max(100),
	type: import_dist.rod.enum(["jpg", "png"]),
	size: import_dist.rod.number(),
	url: import_dist.rod.string().url()
});
const ratingSchema = import_dist.rod.object({
	id: import_dist.rod.number(),
	stars: import_dist.rod.number().min(0).max(5),
	title: import_dist.rod.string().min(1).max(100),
	text: import_dist.rod.string().min(1).max(1e3),
	images: import_dist.rod.array(imageSchema)
});
import_dist.rod.object({
	id: import_dist.rod.number(),
	created: import_dist.rod.date(),
	title: import_dist.rod.string().min(1).max(100),
	brand: import_dist.rod.string().min(1).max(30),
	description: import_dist.rod.string().min(1).max(500),
	price: import_dist.rod.number().min(1).max(1e4),
	discount: import_dist.rod.union([import_dist.rod.number().min(1).max(100), import_dist.rod.literal(null)]),
	quantity: import_dist.rod.number().min(0).max(10),
	tags: import_dist.rod.array(import_dist.rod.string().min(1).max(30)),
	images: import_dist.rod.array(imageSchema),
	ratings: import_dist.rod.array(ratingSchema)
}).parse({});

//#endregion