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
			var s = e[i], o = {}, k;
			if (s.message === void 0 && typeof __zcMsg === "function") s.message = __zcMsg(s);
			for (k in s) if (k !== "input" && k !== "continue" && Object.prototype.hasOwnProperty.call(s, k)) o[k] = s[k];
			e[i] = o;
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
function __zcFinZ(z, r, i) {
	return new __ZcFailZ(z, r, i);
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
function __zcUrl(s) {
	if (typeof URL === "function" && typeof URL.canParse === "function") return URL.canParse(s);
	try {
		new URL(s);
		return true;
	} catch (_) {
		return false;
	}
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
	var __zs = productSchema;
	var __bf_4 = {};
	function __af_16(a) {
		for (var __ae_15, i = 0; i < a.length; i++) {
			__ae_15 = a[i];
			if (!(typeof __ae_15 === "string" && __ae_15.length >= 1 && (__ae_15.length <= 30 || __ae_15.length <= 60 && __zcCpl(__ae_15) <= 30))) return false;
		}
		return true;
	}
	var __re_tnl_29 = /* @__PURE__ */ new RegExp("[\\t\\n\\r]", "g");
	function __vb_5(input) {
		var __bv_6, __bv_7, __bv_8, __bv_9, __bv_10, __bv_11, __bv_12, __bv_13, __bv_14, __bv_17, __ba_18, __bi_19, __be_20, __bv_21, __bv_22, __bv_23, __bv_24, __bv_25, __bv_26, __bs_27, __but_28, __bo_30, __bv_31, __ba_32, __bi_33, __be_34, __bv_35, __bv_36, __bv_37, __bv_38, __bv_39, __ba_40, __bi_41, __be_42, __bv_43, __bv_44, __bv_45, __bv_46, __bv_47, __bv_48, __bs_49, __but_50, __bo_51, __bo_52, __bo_53;
		if (typeof input !== "object" || input === null || Array.isArray(input)) return __bf_4;
		__bv_6 = input["id"];
		if (!Number.isFinite(__bv_6)) return __bf_4;
		__bv_7 = input["created"];
		if (!(__bv_7 instanceof Date && !Number.isNaN(__bv_7.getTime()))) return __bf_4;
		__bv_8 = input["title"];
		if (!(typeof __bv_8 === "string" && __bv_8.length >= 1 && (__bv_8.length <= 100 || __bv_8.length <= 200 && __zcCpl(__bv_8) <= 100))) return __bf_4;
		__bv_9 = input["brand"];
		if (!(typeof __bv_9 === "string" && __bv_9.length >= 1 && (__bv_9.length <= 30 || __bv_9.length <= 60 && __zcCpl(__bv_9) <= 30))) return __bf_4;
		__bv_10 = input["description"];
		if (!(typeof __bv_10 === "string" && __bv_10.length >= 1 && (__bv_10.length <= 500 || __bv_10.length <= 1e3 && __zcCpl(__bv_10) <= 500))) return __bf_4;
		__bv_11 = input["price"];
		if (!(Number.isFinite(__bv_11) && __bv_11 >= 1 && __bv_11 <= 1e4)) return __bf_4;
		__bv_12 = input["quantity"];
		if (!(Number.isFinite(__bv_12) && __bv_12 >= 0 && __bv_12 <= 10)) return __bf_4;
		__bv_13 = input["discount"];
		if (!(__bv_13 === null || Number.isFinite(__bv_13) && __bv_13 >= 1 && __bv_13 <= 100)) return __bf_4;
		__bv_14 = input["tags"];
		if (!(Array.isArray(__bv_14) && __af_16(__bv_14))) return __bf_4;
		__bv_17 = input["images"];
		if (!Array.isArray(__bv_17)) return __bf_4;
		__ba_18 = new Array(__bv_17.length);
		for (__bi_19 = 0; __bi_19 < __bv_17.length; __bi_19++) {
			__be_20 = __bv_17[__bi_19];
			if (typeof __be_20 !== "object" || __be_20 === null || Array.isArray(__be_20)) return __bf_4;
			__bv_21 = __be_20["id"];
			if (!Number.isFinite(__bv_21)) return __bf_4;
			__bv_22 = __be_20["size"];
			if (!Number.isFinite(__bv_22)) return __bf_4;
			__bv_23 = __be_20["created"];
			if (!(__bv_23 instanceof Date && !Number.isNaN(__bv_23.getTime()))) return __bf_4;
			__bv_24 = __be_20["type"];
			if (!(__bv_24 === "jpg" || __bv_24 === "png")) return __bf_4;
			__bv_25 = __be_20["title"];
			if (!(typeof __bv_25 === "string" && __bv_25.length >= 1 && (__bv_25.length <= 100 || __bv_25.length <= 200 && __zcCpl(__bv_25) <= 100))) return __bf_4;
			__bv_26 = __be_20["url"];
			if (typeof __bv_26 !== "string") return __bf_4;
			__bs_27 = __bv_26;
			__but_28 = __bs_27.trim();
			if (!__zcUrl(__but_28)) return __bf_4;
			__bs_27 = __but_28.replace(__re_tnl_29, "");
			__bo_30 = {
				"id": __bv_21,
				"created": __bv_23,
				"title": __bv_25,
				"type": __bv_24,
				"size": __bv_22,
				"url": __bs_27
			};
			__ba_18[__bi_19] = __bo_30;
		}
		__bv_31 = input["ratings"];
		if (!Array.isArray(__bv_31)) return __bf_4;
		__ba_32 = new Array(__bv_31.length);
		for (__bi_33 = 0; __bi_33 < __bv_31.length; __bi_33++) {
			__be_34 = __bv_31[__bi_33];
			if (typeof __be_34 !== "object" || __be_34 === null || Array.isArray(__be_34)) return __bf_4;
			__bv_35 = __be_34["id"];
			if (!Number.isFinite(__bv_35)) return __bf_4;
			__bv_36 = __be_34["stars"];
			if (!(Number.isFinite(__bv_36) && __bv_36 >= 1 && __bv_36 <= 5)) return __bf_4;
			__bv_37 = __be_34["title"];
			if (!(typeof __bv_37 === "string" && __bv_37.length >= 1 && (__bv_37.length <= 100 || __bv_37.length <= 200 && __zcCpl(__bv_37) <= 100))) return __bf_4;
			__bv_38 = __be_34["text"];
			if (!(typeof __bv_38 === "string" && __bv_38.length >= 1 && (__bv_38.length <= 1e3 || __bv_38.length <= 2e3 && __zcCpl(__bv_38) <= 1e3))) return __bf_4;
			__bv_39 = __be_34["images"];
			if (!Array.isArray(__bv_39)) return __bf_4;
			__ba_40 = new Array(__bv_39.length);
			for (__bi_41 = 0; __bi_41 < __bv_39.length; __bi_41++) {
				__be_42 = __bv_39[__bi_41];
				if (typeof __be_42 !== "object" || __be_42 === null || Array.isArray(__be_42)) return __bf_4;
				__bv_43 = __be_42["id"];
				if (!Number.isFinite(__bv_43)) return __bf_4;
				__bv_44 = __be_42["size"];
				if (!Number.isFinite(__bv_44)) return __bf_4;
				__bv_45 = __be_42["created"];
				if (!(__bv_45 instanceof Date && !Number.isNaN(__bv_45.getTime()))) return __bf_4;
				__bv_46 = __be_42["type"];
				if (!(__bv_46 === "jpg" || __bv_46 === "png")) return __bf_4;
				__bv_47 = __be_42["title"];
				if (!(typeof __bv_47 === "string" && __bv_47.length >= 1 && (__bv_47.length <= 100 || __bv_47.length <= 200 && __zcCpl(__bv_47) <= 100))) return __bf_4;
				__bv_48 = __be_42["url"];
				if (typeof __bv_48 !== "string") return __bf_4;
				__bs_49 = __bv_48;
				__but_50 = __bs_49.trim();
				if (!__zcUrl(__but_50)) return __bf_4;
				__bs_49 = __but_50.replace(__re_tnl_29, "");
				__bo_51 = {
					"id": __bv_43,
					"created": __bv_45,
					"title": __bv_47,
					"type": __bv_46,
					"size": __bv_44,
					"url": __bs_49
				};
				__ba_40[__bi_41] = __bo_51;
			}
			__bo_52 = {
				"id": __bv_35,
				"stars": __bv_36,
				"title": __bv_37,
				"text": __bv_38,
				"images": __ba_40
			};
			__ba_32[__bi_33] = __bo_52;
		}
		__bo_53 = {
			"id": __bv_6,
			"created": __bv_7,
			"title": __bv_8,
			"brand": __bv_9,
			"description": __bv_10,
			"price": __bv_11,
			"discount": __bv_13,
			"quantity": __bv_12,
			"tags": __bv_14,
			"images": __ba_18,
			"ratings": __ba_32
		};
		return __bo_53;
	}
	var __rfm_z = __zs.safeParse;
	function safeParse_compiledProductSchema(input) {
		var __bd_54 = __vb_5(input);
		if (__bd_54 !== __bf_4) return {
			success: true,
			data: __bd_54
		};
		return __zcFinZ(__rfm_z, __zs, input);
	}
	return __zcMkv(safeParse_compiledProductSchema, __zs, null, null);
})();
//#endregion
export { compiledProductSchema };

//# sourceMappingURL=index.mjs.map