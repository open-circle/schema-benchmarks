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
	stars: z.number().min(0).max(5),
	title: z.string().min(1).max(100),
	text: z.string().min(1).max(1e3),
	images: z.array(imageSchema)
});
const productSchema = z.object({
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
});
const compiledProductSchema = /* @__PURE__ */ (() => {
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
				received: "Infinity",
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
				if (__sv_7.length > 100) _e.push(__zcTB(100, "string", true, __sv_7, ["title"]));
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
				if (__sv_8.length > 30) _e.push(__zcTB(30, "string", true, __sv_8, ["brand"]));
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
				if (__sv_9.length > 500) _e.push(__zcTB(500, "string", true, __sv_9, ["description"]));
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
				received: "Infinity",
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
					received: "Infinity",
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
				received: "Infinity",
				input: __sv_12,
				path: ["quantity"]
			});
			else {
				if (__sv_12 < 0) _e.push(__zcTS(0, "number", true, __sv_12, ["quantity"]));
				if (__sv_12 > 10) _e.push(__zcTB(10, "number", true, __sv_12, ["quantity"]));
			}
			var __sv_13 = _d["tags"];
			if (!Array.isArray(__sv_13)) _e.push(__zcIT("array", __sv_13, ["tags"]));
			else for (var __i_14 = 0; __i_14 < __sv_13.length; __i_14++) if (typeof __sv_13[__i_14] !== "string") {
				_e.push(__zcIT("string", __sv_13[__i_14], ["tags", __i_14]));
				if (__sv_13[__i_14] !== void 0 && __sv_13[__i_14] !== null && __sv_13[__i_14].length !== void 0) {
					if (__sv_13[__i_14].length < 1) _e.push(__zcTS(1, __zcLo(__sv_13[__i_14]), true, __sv_13[__i_14], ["tags", __i_14]));
					if (__sv_13[__i_14].length > 30) _e.push(__zcTB(30, __zcLo(__sv_13[__i_14]), true, __sv_13[__i_14], ["tags", __i_14]));
				}
			} else {
				if (__sv_13[__i_14].length < 1) _e.push(__zcTS(1, "string", true, __sv_13[__i_14], ["tags", __i_14]));
				if (__sv_13[__i_14].length > 30) _e.push(__zcTB(30, "string", true, __sv_13[__i_14], ["tags", __i_14]));
			}
			var __sv_15 = _d["images"];
			if (!Array.isArray(__sv_15)) _e.push(__zcIT("array", __sv_15, ["images"]));
			else {
				__sv_15 = __sv_15.slice();
				for (var __i_16 = 0; __i_16 < __sv_15.length; __i_16++) if (typeof __sv_15[__i_16] !== "object" || __sv_15[__i_16] === null || Array.isArray(__sv_15[__i_16])) _e.push(__zcIT("object", __sv_15[__i_16], ["images", __i_16]));
				else {
					var __sv_18 = __sv_15[__i_16]["id"];
					if (typeof __sv_18 !== "number") _e.push(__zcIT("number", __sv_18, [
						"images",
						__i_16,
						"id"
					]));
					else if (Number.isNaN(__sv_18)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_18,
						path: [
							"images",
							__i_16,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_18)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "Infinity",
						input: __sv_18,
						path: [
							"images",
							__i_16,
							"id"
						]
					});
					var __sv_19 = __sv_15[__i_16]["created"];
					if (!(__sv_19 instanceof Date)) _e.push(__zcIT("date", __sv_19, [
						"images",
						__i_16,
						"created"
					]));
					else if (isNaN(__sv_19.getTime())) _e.push({
						expected: "date",
						code: "invalid_type",
						received: "Invalid Date",
						input: __sv_19,
						path: [
							"images",
							__i_16,
							"created"
						]
					});
					var __sv_20 = __sv_15[__i_16]["title"];
					if (typeof __sv_20 !== "string") {
						_e.push(__zcIT("string", __sv_20, [
							"images",
							__i_16,
							"title"
						]));
						if (__sv_20 !== void 0 && __sv_20 !== null && __sv_20.length !== void 0) {
							if (__sv_20.length < 1) _e.push(__zcTS(1, __zcLo(__sv_20), true, __sv_20, [
								"images",
								__i_16,
								"title"
							]));
							if (__sv_20.length > 100) _e.push(__zcTB(100, __zcLo(__sv_20), true, __sv_20, [
								"images",
								__i_16,
								"title"
							]));
						}
					} else {
						if (__sv_20.length < 1) _e.push(__zcTS(1, "string", true, __sv_20, [
							"images",
							__i_16,
							"title"
						]));
						if (__sv_20.length > 100) _e.push(__zcTB(100, "string", true, __sv_20, [
							"images",
							__i_16,
							"title"
						]));
					}
					var __sv_21 = __sv_15[__i_16]["type"];
					if (__sv_21 !== "jpg" && __sv_21 !== "png") _e.push(__zcIV(["jpg", "png"], __sv_21, [
						"images",
						__i_16,
						"type"
					]));
					var __sv_22 = __sv_15[__i_16]["size"];
					if (typeof __sv_22 !== "number") _e.push(__zcIT("number", __sv_22, [
						"images",
						__i_16,
						"size"
					]));
					else if (Number.isNaN(__sv_22)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_22,
						path: [
							"images",
							__i_16,
							"size"
						]
					});
					else if (!Number.isFinite(__sv_22)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "Infinity",
						input: __sv_22,
						path: [
							"images",
							__i_16,
							"size"
						]
					});
					var __sv_23 = __sv_15[__i_16]["url"];
					if (typeof __sv_23 !== "string") _e.push(__zcIT("string", __sv_23, [
						"images",
						__i_16,
						"url"
					]));
					else {
						var __ut_24 = __sv_23.trim();
						var __u_25 = null;
						try {
							__u_25 = new URL(__ut_24);
						} catch (_) {}
						if (__u_25 === null) _e.push(__zcIF(void 0, "url", __sv_23, [
							"images",
							__i_16,
							"url"
						]));
						else __sv_23 = __ut_24;
					}
					__sv_15[__i_16] = {
						"id": __sv_18,
						"created": __sv_19,
						"title": __sv_20,
						"type": __sv_21,
						"size": __sv_22,
						"url": __sv_23
					};
				}
			}
			var __sv_26 = _d["ratings"];
			if (!Array.isArray(__sv_26)) _e.push(__zcIT("array", __sv_26, ["ratings"]));
			else {
				__sv_26 = __sv_26.slice();
				for (var __i_27 = 0; __i_27 < __sv_26.length; __i_27++) if (typeof __sv_26[__i_27] !== "object" || __sv_26[__i_27] === null || Array.isArray(__sv_26[__i_27])) _e.push(__zcIT("object", __sv_26[__i_27], ["ratings", __i_27]));
				else {
					var __sv_29 = __sv_26[__i_27]["id"];
					if (typeof __sv_29 !== "number") _e.push(__zcIT("number", __sv_29, [
						"ratings",
						__i_27,
						"id"
					]));
					else if (Number.isNaN(__sv_29)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_29,
						path: [
							"ratings",
							__i_27,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_29)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "Infinity",
						input: __sv_29,
						path: [
							"ratings",
							__i_27,
							"id"
						]
					});
					var __sv_30 = __sv_26[__i_27]["stars"];
					if (typeof __sv_30 !== "number") _e.push(__zcIT("number", __sv_30, [
						"ratings",
						__i_27,
						"stars"
					]));
					else if (Number.isNaN(__sv_30)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_30,
						path: [
							"ratings",
							__i_27,
							"stars"
						]
					});
					else if (!Number.isFinite(__sv_30)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "Infinity",
						input: __sv_30,
						path: [
							"ratings",
							__i_27,
							"stars"
						]
					});
					else {
						if (__sv_30 < 0) _e.push(__zcTS(0, "number", true, __sv_30, [
							"ratings",
							__i_27,
							"stars"
						]));
						if (__sv_30 > 5) _e.push(__zcTB(5, "number", true, __sv_30, [
							"ratings",
							__i_27,
							"stars"
						]));
					}
					var __sv_31 = __sv_26[__i_27]["title"];
					if (typeof __sv_31 !== "string") {
						_e.push(__zcIT("string", __sv_31, [
							"ratings",
							__i_27,
							"title"
						]));
						if (__sv_31 !== void 0 && __sv_31 !== null && __sv_31.length !== void 0) {
							if (__sv_31.length < 1) _e.push(__zcTS(1, __zcLo(__sv_31), true, __sv_31, [
								"ratings",
								__i_27,
								"title"
							]));
							if (__sv_31.length > 100) _e.push(__zcTB(100, __zcLo(__sv_31), true, __sv_31, [
								"ratings",
								__i_27,
								"title"
							]));
						}
					} else {
						if (__sv_31.length < 1) _e.push(__zcTS(1, "string", true, __sv_31, [
							"ratings",
							__i_27,
							"title"
						]));
						if (__sv_31.length > 100) _e.push(__zcTB(100, "string", true, __sv_31, [
							"ratings",
							__i_27,
							"title"
						]));
					}
					var __sv_32 = __sv_26[__i_27]["text"];
					if (typeof __sv_32 !== "string") {
						_e.push(__zcIT("string", __sv_32, [
							"ratings",
							__i_27,
							"text"
						]));
						if (__sv_32 !== void 0 && __sv_32 !== null && __sv_32.length !== void 0) {
							if (__sv_32.length < 1) _e.push(__zcTS(1, __zcLo(__sv_32), true, __sv_32, [
								"ratings",
								__i_27,
								"text"
							]));
							if (__sv_32.length > 1e3) _e.push(__zcTB(1e3, __zcLo(__sv_32), true, __sv_32, [
								"ratings",
								__i_27,
								"text"
							]));
						}
					} else {
						if (__sv_32.length < 1) _e.push(__zcTS(1, "string", true, __sv_32, [
							"ratings",
							__i_27,
							"text"
						]));
						if (__sv_32.length > 1e3) _e.push(__zcTB(1e3, "string", true, __sv_32, [
							"ratings",
							__i_27,
							"text"
						]));
					}
					var __sv_33 = __sv_26[__i_27]["images"];
					if (!Array.isArray(__sv_33)) _e.push(__zcIT("array", __sv_33, [
						"ratings",
						__i_27,
						"images"
					]));
					else {
						__sv_33 = __sv_33.slice();
						for (var __i_34 = 0; __i_34 < __sv_33.length; __i_34++) if (typeof __sv_33[__i_34] !== "object" || __sv_33[__i_34] === null || Array.isArray(__sv_33[__i_34])) _e.push(__zcIT("object", __sv_33[__i_34], [
							"ratings",
							__i_27,
							"images",
							__i_34
						]));
						else {
							var __sv_36 = __sv_33[__i_34]["id"];
							if (typeof __sv_36 !== "number") _e.push(__zcIT("number", __sv_36, [
								"ratings",
								__i_27,
								"images",
								__i_34,
								"id"
							]));
							else if (Number.isNaN(__sv_36)) _e.push({
								expected: "number",
								code: "invalid_type",
								received: "NaN",
								input: __sv_36,
								path: [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"id"
								]
							});
							else if (!Number.isFinite(__sv_36)) _e.push({
								expected: "number",
								code: "invalid_type",
								received: "Infinity",
								input: __sv_36,
								path: [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"id"
								]
							});
							var __sv_37 = __sv_33[__i_34]["created"];
							if (!(__sv_37 instanceof Date)) _e.push(__zcIT("date", __sv_37, [
								"ratings",
								__i_27,
								"images",
								__i_34,
								"created"
							]));
							else if (isNaN(__sv_37.getTime())) _e.push({
								expected: "date",
								code: "invalid_type",
								received: "Invalid Date",
								input: __sv_37,
								path: [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"created"
								]
							});
							var __sv_38 = __sv_33[__i_34]["title"];
							if (typeof __sv_38 !== "string") {
								_e.push(__zcIT("string", __sv_38, [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"title"
								]));
								if (__sv_38 !== void 0 && __sv_38 !== null && __sv_38.length !== void 0) {
									if (__sv_38.length < 1) _e.push(__zcTS(1, __zcLo(__sv_38), true, __sv_38, [
										"ratings",
										__i_27,
										"images",
										__i_34,
										"title"
									]));
									if (__sv_38.length > 100) _e.push(__zcTB(100, __zcLo(__sv_38), true, __sv_38, [
										"ratings",
										__i_27,
										"images",
										__i_34,
										"title"
									]));
								}
							} else {
								if (__sv_38.length < 1) _e.push(__zcTS(1, "string", true, __sv_38, [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"title"
								]));
								if (__sv_38.length > 100) _e.push(__zcTB(100, "string", true, __sv_38, [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"title"
								]));
							}
							var __sv_39 = __sv_33[__i_34]["type"];
							if (__sv_39 !== "jpg" && __sv_39 !== "png") _e.push(__zcIV(["jpg", "png"], __sv_39, [
								"ratings",
								__i_27,
								"images",
								__i_34,
								"type"
							]));
							var __sv_40 = __sv_33[__i_34]["size"];
							if (typeof __sv_40 !== "number") _e.push(__zcIT("number", __sv_40, [
								"ratings",
								__i_27,
								"images",
								__i_34,
								"size"
							]));
							else if (Number.isNaN(__sv_40)) _e.push({
								expected: "number",
								code: "invalid_type",
								received: "NaN",
								input: __sv_40,
								path: [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"size"
								]
							});
							else if (!Number.isFinite(__sv_40)) _e.push({
								expected: "number",
								code: "invalid_type",
								received: "Infinity",
								input: __sv_40,
								path: [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"size"
								]
							});
							var __sv_41 = __sv_33[__i_34]["url"];
							if (typeof __sv_41 !== "string") _e.push(__zcIT("string", __sv_41, [
								"ratings",
								__i_27,
								"images",
								__i_34,
								"url"
							]));
							else {
								var __ut_42 = __sv_41.trim();
								var __u_43 = null;
								try {
									__u_43 = new URL(__ut_42);
								} catch (_) {}
								if (__u_43 === null) _e.push(__zcIF(void 0, "url", __sv_41, [
									"ratings",
									__i_27,
									"images",
									__i_34,
									"url"
								]));
								else __sv_41 = __ut_42;
							}
							__sv_33[__i_34] = {
								"id": __sv_36,
								"created": __sv_37,
								"title": __sv_38,
								"type": __sv_39,
								"size": __sv_40,
								"url": __sv_41
							};
						}
					}
					__sv_26[__i_27] = {
						"id": __sv_29,
						"stars": __sv_30,
						"title": __sv_31,
						"text": __sv_32,
						"images": __sv_33
					};
				}
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
				"images": __sv_15,
				"ratings": __sv_26
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