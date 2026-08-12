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
function __zcSw_0(input, path, _e) {
	if (!Array.isArray(input)) _e.push(__zcIT("array", input, path));
	else {
		input = input.slice();
		for (var __i_0 = 0; __i_0 < input.length; __i_0++) input[__i_0] = __zcSw_1(input[__i_0], path.concat(__i_0), _e);
	}
	return input;
}
function __zcSw_1(input, path, _e) {
	if (typeof input !== "object" || input === null || Array.isArray(input)) _e.push(__zcIT("object", input, path));
	else {
		var __sv_2 = input["id"];
		if (typeof __sv_2 !== "number") _e.push(__zcIT("number", __sv_2, path.concat("id")));
		else if (Number.isNaN(__sv_2)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: "NaN",
			input: __sv_2,
			path: path.concat("id")
		});
		else if (!Number.isFinite(__sv_2)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: "Infinity",
			input: __sv_2,
			path: path.concat("id")
		});
		var __sv_3 = input["created"];
		if (!(__sv_3 instanceof Date)) _e.push(__zcIT("date", __sv_3, path.concat("created")));
		else if (isNaN(__sv_3.getTime())) _e.push({
			expected: "date",
			code: "invalid_type",
			received: "Invalid Date",
			input: __sv_3,
			path: path.concat("created")
		});
		var __sv_4 = input["title"];
		if (typeof __sv_4 !== "string") {
			_e.push(__zcIT("string", __sv_4, path.concat("title")));
			if (__sv_4 !== void 0 && __sv_4 !== null && __sv_4.length !== void 0) {
				if (__sv_4.length < 1) _e.push(__zcTS(1, __zcLo(__sv_4), true, __sv_4, path.concat("title")));
				if (__sv_4.length > 100) _e.push(__zcTB(100, __zcLo(__sv_4), true, __sv_4, path.concat("title")));
			}
		} else {
			if (__sv_4.length < 1) _e.push(__zcTS(1, "string", true, __sv_4, path.concat("title")));
			if (__sv_4.length > 100) _e.push(__zcTB(100, "string", true, __sv_4, path.concat("title")));
		}
		var __sv_5 = input["type"];
		if (__sv_5 !== "jpg" && __sv_5 !== "png") _e.push(__zcIV(["jpg", "png"], __sv_5, path.concat("type")));
		var __sv_6 = input["size"];
		if (typeof __sv_6 !== "number") _e.push(__zcIT("number", __sv_6, path.concat("size")));
		else if (Number.isNaN(__sv_6)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: "NaN",
			input: __sv_6,
			path: path.concat("size")
		});
		else if (!Number.isFinite(__sv_6)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: "Infinity",
			input: __sv_6,
			path: path.concat("size")
		});
		var __sv_7 = input["url"];
		if (typeof __sv_7 !== "string") _e.push(__zcIT("string", __sv_7, path.concat("url")));
		else {
			var __ut_8 = __sv_7.trim();
			var __u_9 = null;
			try {
				__u_9 = new URL(__ut_8);
			} catch (_) {}
			if (__u_9 === null) _e.push(__zcIF(void 0, "url", __sv_7, path.concat("url")));
			else __sv_7 = __ut_8;
		}
		input = {
			"id": __sv_2,
			"created": __sv_3,
			"title": __sv_4,
			"type": __sv_5,
			"size": __sv_6,
			"url": __sv_7
		};
	}
	return input;
}
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
			__sv_15 = __zcSw_0(__sv_15, ["images"], _e);
			var __sv_16 = _d["ratings"];
			if (!Array.isArray(__sv_16)) _e.push(__zcIT("array", __sv_16, ["ratings"]));
			else {
				__sv_16 = __sv_16.slice();
				for (var __i_17 = 0; __i_17 < __sv_16.length; __i_17++) if (typeof __sv_16[__i_17] !== "object" || __sv_16[__i_17] === null || Array.isArray(__sv_16[__i_17])) _e.push(__zcIT("object", __sv_16[__i_17], ["ratings", __i_17]));
				else {
					var __sv_19 = __sv_16[__i_17]["id"];
					if (typeof __sv_19 !== "number") _e.push(__zcIT("number", __sv_19, [
						"ratings",
						__i_17,
						"id"
					]));
					else if (Number.isNaN(__sv_19)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_19,
						path: [
							"ratings",
							__i_17,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_19)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "Infinity",
						input: __sv_19,
						path: [
							"ratings",
							__i_17,
							"id"
						]
					});
					var __sv_20 = __sv_16[__i_17]["stars"];
					if (typeof __sv_20 !== "number") _e.push(__zcIT("number", __sv_20, [
						"ratings",
						__i_17,
						"stars"
					]));
					else if (Number.isNaN(__sv_20)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_20,
						path: [
							"ratings",
							__i_17,
							"stars"
						]
					});
					else if (!Number.isFinite(__sv_20)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "Infinity",
						input: __sv_20,
						path: [
							"ratings",
							__i_17,
							"stars"
						]
					});
					else {
						if (__sv_20 < 0) _e.push(__zcTS(0, "number", true, __sv_20, [
							"ratings",
							__i_17,
							"stars"
						]));
						if (__sv_20 > 5) _e.push(__zcTB(5, "number", true, __sv_20, [
							"ratings",
							__i_17,
							"stars"
						]));
					}
					var __sv_21 = __sv_16[__i_17]["title"];
					if (typeof __sv_21 !== "string") {
						_e.push(__zcIT("string", __sv_21, [
							"ratings",
							__i_17,
							"title"
						]));
						if (__sv_21 !== void 0 && __sv_21 !== null && __sv_21.length !== void 0) {
							if (__sv_21.length < 1) _e.push(__zcTS(1, __zcLo(__sv_21), true, __sv_21, [
								"ratings",
								__i_17,
								"title"
							]));
							if (__sv_21.length > 100) _e.push(__zcTB(100, __zcLo(__sv_21), true, __sv_21, [
								"ratings",
								__i_17,
								"title"
							]));
						}
					} else {
						if (__sv_21.length < 1) _e.push(__zcTS(1, "string", true, __sv_21, [
							"ratings",
							__i_17,
							"title"
						]));
						if (__sv_21.length > 100) _e.push(__zcTB(100, "string", true, __sv_21, [
							"ratings",
							__i_17,
							"title"
						]));
					}
					var __sv_22 = __sv_16[__i_17]["text"];
					if (typeof __sv_22 !== "string") {
						_e.push(__zcIT("string", __sv_22, [
							"ratings",
							__i_17,
							"text"
						]));
						if (__sv_22 !== void 0 && __sv_22 !== null && __sv_22.length !== void 0) {
							if (__sv_22.length < 1) _e.push(__zcTS(1, __zcLo(__sv_22), true, __sv_22, [
								"ratings",
								__i_17,
								"text"
							]));
							if (__sv_22.length > 1e3) _e.push(__zcTB(1e3, __zcLo(__sv_22), true, __sv_22, [
								"ratings",
								__i_17,
								"text"
							]));
						}
					} else {
						if (__sv_22.length < 1) _e.push(__zcTS(1, "string", true, __sv_22, [
							"ratings",
							__i_17,
							"text"
						]));
						if (__sv_22.length > 1e3) _e.push(__zcTB(1e3, "string", true, __sv_22, [
							"ratings",
							__i_17,
							"text"
						]));
					}
					var __sv_23 = __sv_16[__i_17]["images"];
					__sv_23 = __zcSw_0(__sv_23, [
						"ratings",
						__i_17,
						"images"
					], _e);
					__sv_16[__i_17] = {
						"id": __sv_19,
						"stars": __sv_20,
						"title": __sv_21,
						"text": __sv_22,
						"images": __sv_23
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
				"ratings": __sv_16
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