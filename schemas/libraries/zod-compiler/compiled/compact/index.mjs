import * as z from "zod";
import { ZodRealError, config } from "zod";
//#region \0zod-compiler-runtime
function __zcUw(m) {
	return typeof m === "string" ? m : m === void 0 || m === null ? void 0 : m.message;
}
var __zcMsg = function(iss) {
	var c = config(), m;
	if (c.customError) {
		m = __zcUw(c.customError(iss));
		if (m !== void 0 && m !== null) return m;
	}
	if (c.localeError) {
		m = __zcUw(c.localeError(iss));
		if (m !== void 0 && m !== null) return m;
	}
	return "Invalid input";
};
function __ZcFail(e, f, i) {
	this.success = false;
	this._e = e;
	this._f = f;
	this._i = i;
	this._c = void 0;
}
Object.defineProperty(__ZcFail.prototype, "error", {
	configurable: true,
	get: function() {
		if (this._c) return this._c;
		var e = this._f !== null ? this._f(this._i) : this._e;
		for (var i = 0; i < e.length; i++) {
			if (e[i].message === void 0 && typeof __zcMsg === "function") e[i].message = __zcMsg(e[i]);
			delete e[i].input;
			delete e[i].continue;
		}
		return this._c = new ZodRealError(e);
	}
});
function __ZcFailZ(z, r, i) {
	this.success = false;
	this._z = z;
	this._r = r;
	this._i = i;
	this._c = void 0;
}
Object.defineProperty(__ZcFailZ.prototype, "error", {
	configurable: true,
	get: function() {
		return this._c || (this._c = this._z.call(this._r, this._i).error);
	}
});
function __zcMkv(fn, schema, fc, is) {
	var w = schema || {};
	var zpa = w.parseAsync, zspa = w.safeParseAsync;
	w.parse = fc ? function(input) {
		if (fc(input)) return input;
		var r = fn(input);
		if (r.success) return r.data;
		throw r.error;
	} : function(input) {
		var r = fn(input);
		if (r.success) return r.data;
		throw r.error;
	};
	w.safeParse = fn;
	w.safeParseAsync = function(input) {
		try {
			return Promise.resolve(fn(input));
		} catch (e) {
			if (zspa) return zspa(input);
			throw e;
		}
	};
	w.parseAsync = fc ? function(input) {
		try {
			if (fc(input)) return Promise.resolve(input);
			var r = fn(input);
			if (r.success) return Promise.resolve(r.data);
			return Promise.reject(r.error);
		} catch (e) {
			if (zpa) return zpa(input);
			throw e;
		}
	} : function(input) {
		try {
			var r = fn(input);
			if (r.success) return Promise.resolve(r.data);
			return Promise.reject(r.error);
		} catch (e) {
			if (zpa) return zpa(input);
			throw e;
		}
	};
	w.is = is || function(input) {
		return fn(input).success;
	};
	Object.defineProperty(w, "~standard", {
		configurable: true,
		value: {
			version: 1,
			vendor: "zod",
			validate: function(input) {
				var r;
				try {
					if (fc && fc(input)) return { value: input };
					r = fn(input);
				} catch (e) {
					if (zspa) return zspa(input).then(function(q) {
						return q.success ? { value: q.data } : { issues: q.error.issues };
					});
					throw e;
				}
				return r.success ? { value: r.data } : { issues: r.error.issues };
			}
		}
	});
	return w;
}
function __zcFin(e, d) {
	if (!e.length) return {
		success: true,
		data: d
	};
	return new __ZcFail(e, null, null);
}
function __zcTS(m, o, i, inp, p, msg) {
	var r = {
		origin: o,
		code: "too_small",
		minimum: m,
		inclusive: i,
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcTB(m, o, i, inp, p, msg) {
	var r = {
		origin: o,
		code: "too_big",
		maximum: m,
		inclusive: i,
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIT(e, inp, p, msg) {
	var r = {
		expected: e,
		code: "invalid_type",
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIF(o, f, inp, p, extra, msg) {
	var r = o === void 0 ? {
		code: "invalid_format",
		format: f
	} : {
		origin: o,
		code: "invalid_format",
		format: f
	};
	if (extra) Object.assign(r, extra);
	r.input = inp;
	r.path = p;
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIV(values, inp, p, extra, msg) {
	var r = { code: "invalid_value" };
	if (extra) Object.assign(r, extra);
	r.values = values;
	r.input = inp;
	r.path = p;
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcLo(v) {
	return Array.isArray(v) ? "array" : typeof v === "string" ? "string" : "unknown";
}
function __zcCpl(s) {
	var n = s.length;
	if (!/[\uD800-\uDBFF]/.test(s)) return n;
	var c = n;
	for (var i = 0; i < n - 1; i++) if ((s.charCodeAt(i) & 64512) === 55296 && (s.charCodeAt(i + 1) & 64512) === 56320) {
		c--;
		i++;
	}
	return c;
}
//#endregion
//#region libraries/zod-compiler/index.ts
const imageSchema = z.object({
	id: z.number(),
	created: z.date(),
	title: z.string().min(1).max(100),
	type: z.enum(["jpg", "png"]),
	size: z.number(),
	url: z.url()
});
const ratingSchema = z.object({
	id: z.number(),
	stars: z.number().min(1).max(5),
	title: z.string().min(1).max(100),
	text: z.string().min(1).max(1e3),
	images: z.array(imageSchema)
});
const productSchema = z.toZod()(z.object({
	id: z.number(),
	created: z.date(),
	title: z.string().min(1).max(100),
	brand: z.string().min(1).max(30),
	description: z.string().min(1).max(500),
	price: z.number().min(1).max(1e4),
	discount: z.number().min(1).max(100).nullable(),
	quantity: z.number().min(0).max(10),
	tags: z.array(z.string().min(1).max(30)),
	images: z.array(imageSchema),
	ratings: z.array(ratingSchema)
}));
const compiledProductSchema = /* @__PURE__ */ (() => {
	var __re_tnl_30 = /* @__PURE__ */ new RegExp("[\\t\\n\\r]", "g");
	function safeParse_compiledProductSchema(input) {
		var _e = [];
		var _d = input;
		if (typeof _d !== "object" || _d === null || Array.isArray(_d)) _e.push(__zcIT("object", _d, []));
		else {
			var __sv_5 = _d["id"];
			if (typeof __sv_5 !== "number") _e.push(__zcIT("number", __sv_5, ["id"]));
			else if (Number.isNaN(__sv_5)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_5,
				path: ["id"]
			});
			else if (!Number.isFinite(__sv_5)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_5),
				input: __sv_5,
				path: ["id"]
			});
			var __sv_6 = _d["created"];
			if (!(__sv_6 instanceof Date)) _e.push(__zcIT("date", __sv_6, ["created"]));
			else if (isNaN(__sv_6.getTime())) _e.push({
				expected: "date",
				code: "invalid_type",
				received: "Invalid Date",
				input: __sv_6,
				path: ["created"]
			});
			var __sv_7 = _d["title"];
			if (typeof __sv_7 !== "string") {
				_e.push(__zcIT("string", __sv_7, ["title"]));
				if (__sv_7 !== void 0 && __sv_7 !== null && __sv_7.length !== void 0) {
					if (__sv_7.length < 1) _e.push(__zcTS(1, __zcLo(__sv_7), true, __sv_7, ["title"]));
					if (__sv_7.length > 100) _e.push(__zcTB(100, __zcLo(__sv_7), true, __sv_7, ["title"]));
				}
			} else {
				if (__sv_7.length < 1) _e.push(__zcTS(1, "string", true, __sv_7, ["title"]));
				if (__sv_7.length > 100 && (__sv_7.length > 200 || __zcCpl(__sv_7) > 100)) _e.push(__zcTB(100, "string", true, __sv_7, ["title"]));
			}
			var __sv_8 = _d["brand"];
			if (typeof __sv_8 !== "string") {
				_e.push(__zcIT("string", __sv_8, ["brand"]));
				if (__sv_8 !== void 0 && __sv_8 !== null && __sv_8.length !== void 0) {
					if (__sv_8.length < 1) _e.push(__zcTS(1, __zcLo(__sv_8), true, __sv_8, ["brand"]));
					if (__sv_8.length > 30) _e.push(__zcTB(30, __zcLo(__sv_8), true, __sv_8, ["brand"]));
				}
			} else {
				if (__sv_8.length < 1) _e.push(__zcTS(1, "string", true, __sv_8, ["brand"]));
				if (__sv_8.length > 30 && (__sv_8.length > 60 || __zcCpl(__sv_8) > 30)) _e.push(__zcTB(30, "string", true, __sv_8, ["brand"]));
			}
			var __sv_9 = _d["description"];
			if (typeof __sv_9 !== "string") {
				_e.push(__zcIT("string", __sv_9, ["description"]));
				if (__sv_9 !== void 0 && __sv_9 !== null && __sv_9.length !== void 0) {
					if (__sv_9.length < 1) _e.push(__zcTS(1, __zcLo(__sv_9), true, __sv_9, ["description"]));
					if (__sv_9.length > 500) _e.push(__zcTB(500, __zcLo(__sv_9), true, __sv_9, ["description"]));
				}
			} else {
				if (__sv_9.length < 1) _e.push(__zcTS(1, "string", true, __sv_9, ["description"]));
				if (__sv_9.length > 500 && (__sv_9.length > 1e3 || __zcCpl(__sv_9) > 500)) _e.push(__zcTB(500, "string", true, __sv_9, ["description"]));
			}
			var __sv_10 = _d["price"];
			if (typeof __sv_10 !== "number") _e.push(__zcIT("number", __sv_10, ["price"]));
			else if (Number.isNaN(__sv_10)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_10,
				path: ["price"]
			});
			else if (!Number.isFinite(__sv_10)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_10),
				input: __sv_10,
				path: ["price"]
			});
			else {
				if (__sv_10 < 1) _e.push(__zcTS(1, "number", true, __sv_10, ["price"]));
				if (__sv_10 > 1e4) _e.push(__zcTB(1e4, "number", true, __sv_10, ["price"]));
			}
			var __sv_11 = _d["discount"];
			if (__sv_11 !== null) {
				if (typeof __sv_11 !== "number") _e.push(__zcIT("number", __sv_11, ["discount"]));
				else if (Number.isNaN(__sv_11)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: "NaN",
					input: __sv_11,
					path: ["discount"]
				});
				else if (!Number.isFinite(__sv_11)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: String(__sv_11),
					input: __sv_11,
					path: ["discount"]
				});
				else {
					if (__sv_11 < 1) _e.push(__zcTS(1, "number", true, __sv_11, ["discount"]));
					if (__sv_11 > 100) _e.push(__zcTB(100, "number", true, __sv_11, ["discount"]));
				}
			}
			var __sv_12 = _d["quantity"];
			if (typeof __sv_12 !== "number") _e.push(__zcIT("number", __sv_12, ["quantity"]));
			else if (Number.isNaN(__sv_12)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_12,
				path: ["quantity"]
			});
			else if (!Number.isFinite(__sv_12)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_12),
				input: __sv_12,
				path: ["quantity"]
			});
			else {
				if (__sv_12 < 0) _e.push(__zcTS(0, "number", true, __sv_12, ["quantity"]));
				if (__sv_12 > 10) _e.push(__zcTB(10, "number", true, __sv_12, ["quantity"]));
			}
			var __sv_13 = _d["tags"];
			if (!Array.isArray(__sv_13)) _e.push(__zcIT("array", __sv_13, ["tags"]));
			else {
				var __ar_14 = __sv_13;
				for (var __i_15 = 0; __i_15 < __ar_14.length; __i_15++) {
					var __mv_16 = __ar_14[__i_15];
					if (typeof __mv_16 !== "string") {
						_e.push(__zcIT("string", __mv_16, ["tags", __i_15]));
						if (__mv_16 !== void 0 && __mv_16 !== null && __mv_16.length !== void 0) {
							if (__mv_16.length < 1) _e.push(__zcTS(1, __zcLo(__mv_16), true, __mv_16, ["tags", __i_15]));
							if (__mv_16.length > 30) _e.push(__zcTB(30, __zcLo(__mv_16), true, __mv_16, ["tags", __i_15]));
						}
					} else {
						if (__mv_16.length < 1) _e.push(__zcTS(1, "string", true, __mv_16, ["tags", __i_15]));
						if (__mv_16.length > 30 && (__mv_16.length > 60 || __zcCpl(__mv_16) > 30)) _e.push(__zcTB(30, "string", true, __mv_16, ["tags", __i_15]));
					}
				}
				__sv_13 = __ar_14;
			}
			var __sv_18 = _d["images"];
			if (!Array.isArray(__sv_18)) _e.push(__zcIT("array", __sv_18, ["images"]));
			else {
				var __ar_19 = __sv_18;
				__ar_19 = __ar_19.slice();
				for (var __i_20 = 0; __i_20 < __ar_19.length; __i_20++) if (typeof __ar_19[__i_20] !== "object" || __ar_19[__i_20] === null || Array.isArray(__ar_19[__i_20])) _e.push(__zcIT("object", __ar_19[__i_20], ["images", __i_20]));
				else {
					var __sv_22 = __ar_19[__i_20]["id"];
					if (typeof __sv_22 !== "number") _e.push(__zcIT("number", __sv_22, [
						"images",
						__i_20,
						"id"
					]));
					else if (Number.isNaN(__sv_22)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_22,
						path: [
							"images",
							__i_20,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_22)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_22),
						input: __sv_22,
						path: [
							"images",
							__i_20,
							"id"
						]
					});
					var __sv_23 = __ar_19[__i_20]["created"];
					if (!(__sv_23 instanceof Date)) _e.push(__zcIT("date", __sv_23, [
						"images",
						__i_20,
						"created"
					]));
					else if (isNaN(__sv_23.getTime())) _e.push({
						expected: "date",
						code: "invalid_type",
						received: "Invalid Date",
						input: __sv_23,
						path: [
							"images",
							__i_20,
							"created"
						]
					});
					var __sv_24 = __ar_19[__i_20]["title"];
					if (typeof __sv_24 !== "string") {
						_e.push(__zcIT("string", __sv_24, [
							"images",
							__i_20,
							"title"
						]));
						if (__sv_24 !== void 0 && __sv_24 !== null && __sv_24.length !== void 0) {
							if (__sv_24.length < 1) _e.push(__zcTS(1, __zcLo(__sv_24), true, __sv_24, [
								"images",
								__i_20,
								"title"
							]));
							if (__sv_24.length > 100) _e.push(__zcTB(100, __zcLo(__sv_24), true, __sv_24, [
								"images",
								__i_20,
								"title"
							]));
						}
					} else {
						if (__sv_24.length < 1) _e.push(__zcTS(1, "string", true, __sv_24, [
							"images",
							__i_20,
							"title"
						]));
						if (__sv_24.length > 100 && (__sv_24.length > 200 || __zcCpl(__sv_24) > 100)) _e.push(__zcTB(100, "string", true, __sv_24, [
							"images",
							__i_20,
							"title"
						]));
					}
					var __sv_25 = __ar_19[__i_20]["type"];
					if (__sv_25 !== "jpg" && __sv_25 !== "png") _e.push(__zcIV(["jpg", "png"], __sv_25, [
						"images",
						__i_20,
						"type"
					]));
					var __sv_26 = __ar_19[__i_20]["size"];
					if (typeof __sv_26 !== "number") _e.push(__zcIT("number", __sv_26, [
						"images",
						__i_20,
						"size"
					]));
					else if (Number.isNaN(__sv_26)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_26,
						path: [
							"images",
							__i_20,
							"size"
						]
					});
					else if (!Number.isFinite(__sv_26)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_26),
						input: __sv_26,
						path: [
							"images",
							__i_20,
							"size"
						]
					});
					var __sv_27 = __ar_19[__i_20]["url"];
					if (typeof __sv_27 !== "string") _e.push(__zcIT("string", __sv_27, [
						"images",
						__i_20,
						"url"
					]));
					else {
						var __ut_28 = __sv_27.trim();
						var __u_29 = null;
						try {
							__u_29 = new URL(__ut_28);
						} catch (_) {}
						if (__u_29 === null) _e.push(__zcIF(void 0, "url", __sv_27, [
							"images",
							__i_20,
							"url"
						]));
						else __sv_27 = __ut_28.replace(__re_tnl_30, "");
					}
					__ar_19[__i_20] = {
						"id": __sv_22,
						"created": __sv_23,
						"title": __sv_24,
						"type": __sv_25,
						"size": __sv_26,
						"url": __sv_27
					};
				}
				__sv_18 = __ar_19;
			}
			var __sv_31 = _d["ratings"];
			if (!Array.isArray(__sv_31)) _e.push(__zcIT("array", __sv_31, ["ratings"]));
			else {
				var __ar_32 = __sv_31;
				__ar_32 = __ar_32.slice();
				for (var __i_33 = 0; __i_33 < __ar_32.length; __i_33++) if (typeof __ar_32[__i_33] !== "object" || __ar_32[__i_33] === null || Array.isArray(__ar_32[__i_33])) _e.push(__zcIT("object", __ar_32[__i_33], ["ratings", __i_33]));
				else {
					var __sv_35 = __ar_32[__i_33]["id"];
					if (typeof __sv_35 !== "number") _e.push(__zcIT("number", __sv_35, [
						"ratings",
						__i_33,
						"id"
					]));
					else if (Number.isNaN(__sv_35)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_35,
						path: [
							"ratings",
							__i_33,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_35)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_35),
						input: __sv_35,
						path: [
							"ratings",
							__i_33,
							"id"
						]
					});
					var __sv_36 = __ar_32[__i_33]["stars"];
					if (typeof __sv_36 !== "number") _e.push(__zcIT("number", __sv_36, [
						"ratings",
						__i_33,
						"stars"
					]));
					else if (Number.isNaN(__sv_36)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_36,
						path: [
							"ratings",
							__i_33,
							"stars"
						]
					});
					else if (!Number.isFinite(__sv_36)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_36),
						input: __sv_36,
						path: [
							"ratings",
							__i_33,
							"stars"
						]
					});
					else {
						if (__sv_36 < 1) _e.push(__zcTS(1, "number", true, __sv_36, [
							"ratings",
							__i_33,
							"stars"
						]));
						if (__sv_36 > 5) _e.push(__zcTB(5, "number", true, __sv_36, [
							"ratings",
							__i_33,
							"stars"
						]));
					}
					var __sv_37 = __ar_32[__i_33]["title"];
					if (typeof __sv_37 !== "string") {
						_e.push(__zcIT("string", __sv_37, [
							"ratings",
							__i_33,
							"title"
						]));
						if (__sv_37 !== void 0 && __sv_37 !== null && __sv_37.length !== void 0) {
							if (__sv_37.length < 1) _e.push(__zcTS(1, __zcLo(__sv_37), true, __sv_37, [
								"ratings",
								__i_33,
								"title"
							]));
							if (__sv_37.length > 100) _e.push(__zcTB(100, __zcLo(__sv_37), true, __sv_37, [
								"ratings",
								__i_33,
								"title"
							]));
						}
					} else {
						if (__sv_37.length < 1) _e.push(__zcTS(1, "string", true, __sv_37, [
							"ratings",
							__i_33,
							"title"
						]));
						if (__sv_37.length > 100 && (__sv_37.length > 200 || __zcCpl(__sv_37) > 100)) _e.push(__zcTB(100, "string", true, __sv_37, [
							"ratings",
							__i_33,
							"title"
						]));
					}
					var __sv_38 = __ar_32[__i_33]["text"];
					if (typeof __sv_38 !== "string") {
						_e.push(__zcIT("string", __sv_38, [
							"ratings",
							__i_33,
							"text"
						]));
						if (__sv_38 !== void 0 && __sv_38 !== null && __sv_38.length !== void 0) {
							if (__sv_38.length < 1) _e.push(__zcTS(1, __zcLo(__sv_38), true, __sv_38, [
								"ratings",
								__i_33,
								"text"
							]));
							if (__sv_38.length > 1e3) _e.push(__zcTB(1e3, __zcLo(__sv_38), true, __sv_38, [
								"ratings",
								__i_33,
								"text"
							]));
						}
					} else {
						if (__sv_38.length < 1) _e.push(__zcTS(1, "string", true, __sv_38, [
							"ratings",
							__i_33,
							"text"
						]));
						if (__sv_38.length > 1e3 && (__sv_38.length > 2e3 || __zcCpl(__sv_38) > 1e3)) _e.push(__zcTB(1e3, "string", true, __sv_38, [
							"ratings",
							__i_33,
							"text"
						]));
					}
					var __sv_39 = __ar_32[__i_33]["images"];
					if (!Array.isArray(__sv_39)) _e.push(__zcIT("array", __sv_39, [
						"ratings",
						__i_33,
						"images"
					]));
					else {
						var __ar_40 = __sv_39;
						__ar_40 = __ar_40.slice();
						for (var __i_41 = 0; __i_41 < __ar_40.length; __i_41++) if (typeof __ar_40[__i_41] !== "object" || __ar_40[__i_41] === null || Array.isArray(__ar_40[__i_41])) _e.push(__zcIT("object", __ar_40[__i_41], [
							"ratings",
							__i_33,
							"images",
							__i_41
						]));
						else {
							var __sv_43 = __ar_40[__i_41]["id"];
							if (typeof __sv_43 !== "number") _e.push(__zcIT("number", __sv_43, [
								"ratings",
								__i_33,
								"images",
								__i_41,
								"id"
							]));
							else if (Number.isNaN(__sv_43)) _e.push({
								expected: "number",
								code: "invalid_type",
								received: "NaN",
								input: __sv_43,
								path: [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"id"
								]
							});
							else if (!Number.isFinite(__sv_43)) _e.push({
								expected: "number",
								code: "invalid_type",
								received: String(__sv_43),
								input: __sv_43,
								path: [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"id"
								]
							});
							var __sv_44 = __ar_40[__i_41]["created"];
							if (!(__sv_44 instanceof Date)) _e.push(__zcIT("date", __sv_44, [
								"ratings",
								__i_33,
								"images",
								__i_41,
								"created"
							]));
							else if (isNaN(__sv_44.getTime())) _e.push({
								expected: "date",
								code: "invalid_type",
								received: "Invalid Date",
								input: __sv_44,
								path: [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"created"
								]
							});
							var __sv_45 = __ar_40[__i_41]["title"];
							if (typeof __sv_45 !== "string") {
								_e.push(__zcIT("string", __sv_45, [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"title"
								]));
								if (__sv_45 !== void 0 && __sv_45 !== null && __sv_45.length !== void 0) {
									if (__sv_45.length < 1) _e.push(__zcTS(1, __zcLo(__sv_45), true, __sv_45, [
										"ratings",
										__i_33,
										"images",
										__i_41,
										"title"
									]));
									if (__sv_45.length > 100) _e.push(__zcTB(100, __zcLo(__sv_45), true, __sv_45, [
										"ratings",
										__i_33,
										"images",
										__i_41,
										"title"
									]));
								}
							} else {
								if (__sv_45.length < 1) _e.push(__zcTS(1, "string", true, __sv_45, [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"title"
								]));
								if (__sv_45.length > 100 && (__sv_45.length > 200 || __zcCpl(__sv_45) > 100)) _e.push(__zcTB(100, "string", true, __sv_45, [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"title"
								]));
							}
							var __sv_46 = __ar_40[__i_41]["type"];
							if (__sv_46 !== "jpg" && __sv_46 !== "png") _e.push(__zcIV(["jpg", "png"], __sv_46, [
								"ratings",
								__i_33,
								"images",
								__i_41,
								"type"
							]));
							var __sv_47 = __ar_40[__i_41]["size"];
							if (typeof __sv_47 !== "number") _e.push(__zcIT("number", __sv_47, [
								"ratings",
								__i_33,
								"images",
								__i_41,
								"size"
							]));
							else if (Number.isNaN(__sv_47)) _e.push({
								expected: "number",
								code: "invalid_type",
								received: "NaN",
								input: __sv_47,
								path: [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"size"
								]
							});
							else if (!Number.isFinite(__sv_47)) _e.push({
								expected: "number",
								code: "invalid_type",
								received: String(__sv_47),
								input: __sv_47,
								path: [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"size"
								]
							});
							var __sv_48 = __ar_40[__i_41]["url"];
							if (typeof __sv_48 !== "string") _e.push(__zcIT("string", __sv_48, [
								"ratings",
								__i_33,
								"images",
								__i_41,
								"url"
							]));
							else {
								var __ut_49 = __sv_48.trim();
								var __u_50 = null;
								try {
									__u_50 = new URL(__ut_49);
								} catch (_) {}
								if (__u_50 === null) _e.push(__zcIF(void 0, "url", __sv_48, [
									"ratings",
									__i_33,
									"images",
									__i_41,
									"url"
								]));
								else __sv_48 = __ut_49.replace(__re_tnl_30, "");
							}
							__ar_40[__i_41] = {
								"id": __sv_43,
								"created": __sv_44,
								"title": __sv_45,
								"type": __sv_46,
								"size": __sv_47,
								"url": __sv_48
							};
						}
						__sv_39 = __ar_40;
					}
					__ar_32[__i_33] = {
						"id": __sv_35,
						"stars": __sv_36,
						"title": __sv_37,
						"text": __sv_38,
						"images": __sv_39
					};
				}
				__sv_31 = __ar_32;
			}
			_d = {
				"id": __sv_5,
				"created": __sv_6,
				"title": __sv_7,
				"brand": __sv_8,
				"description": __sv_9,
				"price": __sv_10,
				"discount": __sv_11,
				"quantity": __sv_12,
				"tags": __sv_13,
				"images": __sv_18,
				"ratings": __sv_31
			};
		}
		if (_e.length === 0) return {
			success: true,
			data: _d
		};
		return __zcFin(_e, _d);
	}
	return __zcMkv(safeParse_compiledProductSchema, productSchema, null, null);
})();
//#endregion
export { compiledProductSchema };

//# sourceMappingURL=index.mjs.map