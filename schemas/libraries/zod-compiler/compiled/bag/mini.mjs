import { a as __zcIT, c as __zcMkv, d as __zcTS, f as __zcUrl, i as __zcIF, l as __zcPa, o as __zcIV, r as __zcFinDC, s as __zcLo, t as __zcCpl, u as __zcTB } from "./_zod-compiler-runtime-CBF8CuJ8.mjs";
import * as z from "zod/mini";
// libraries/zod-compiler/mini.ts
var __re_tnl_10 = /* @__PURE__ */ new RegExp("[\\t\\n\\r]", "g");
function __zcSw_0(input, path, _e) {
	if (!Array.isArray(input)) _e.push(__zcIT("array", input, path));
	else {
		var __ar_0 = input;
		__ar_0 = __ar_0.slice();
		for (var __i_1 = 0; __i_1 < __ar_0.length; __i_1++) __ar_0[__i_1] = __zcSw_1(__ar_0[__i_1], __zcPa(path, __i_1), _e);
		input = __ar_0;
	}
	return input;
}
function __zcSw_1(input, path, _e) {
	if (typeof input !== "object" || input === null || Array.isArray(input)) _e.push(__zcIT("object", input, path));
	else {
		var __sv_3 = input["id"];
		if (typeof __sv_3 !== "number") _e.push(__zcIT("number", __sv_3, __zcPa(path, "id")));
		else if (Number.isNaN(__sv_3)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: "NaN",
			input: __sv_3,
			path: __zcPa(path, "id")
		});
		else if (!Number.isFinite(__sv_3)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: String(__sv_3),
			input: __sv_3,
			path: __zcPa(path, "id")
		});
		var __sv_4 = input["created"];
		if (!(__sv_4 instanceof Date)) _e.push(__zcIT("date", __sv_4, __zcPa(path, "created")));
		else if (isNaN(__sv_4.getTime())) _e.push({
			expected: "date",
			code: "invalid_type",
			received: "Invalid Date",
			input: __sv_4,
			path: __zcPa(path, "created")
		});
		var __sv_5 = input["title"];
		if (typeof __sv_5 !== "string") {
			_e.push(__zcIT("string", __sv_5, __zcPa(path, "title")));
			if (__sv_5 !== void 0 && __sv_5 !== null && __sv_5.length !== void 0) {
				if (__sv_5.length < 1) _e.push(__zcTS(1, __zcLo(__sv_5), true, __sv_5, __zcPa(path, "title")));
				if (__sv_5.length > 100) _e.push(__zcTB(100, __zcLo(__sv_5), true, __sv_5, __zcPa(path, "title")));
			}
		} else {
			if (__sv_5.length < 1) _e.push(__zcTS(1, "string", true, __sv_5, __zcPa(path, "title")));
			if (__sv_5.length > 100 && (__sv_5.length > 200 || __zcCpl(__sv_5) > 100)) _e.push(__zcTB(100, "string", true, __sv_5, __zcPa(path, "title")));
		}
		var __sv_6 = input["type"];
		if (__sv_6 !== "jpg" && __sv_6 !== "png") _e.push(__zcIV(["jpg", "png"], __sv_6, __zcPa(path, "type")));
		var __sv_7 = input["size"];
		if (typeof __sv_7 !== "number") _e.push(__zcIT("number", __sv_7, __zcPa(path, "size")));
		else if (Number.isNaN(__sv_7)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: "NaN",
			input: __sv_7,
			path: __zcPa(path, "size")
		});
		else if (!Number.isFinite(__sv_7)) _e.push({
			expected: "number",
			code: "invalid_type",
			received: String(__sv_7),
			input: __sv_7,
			path: __zcPa(path, "size")
		});
		var __sv_8 = input["url"];
		if (typeof __sv_8 !== "string") _e.push(__zcIT("string", __sv_8, __zcPa(path, "url")));
		else {
			var __ut_9 = __sv_8.trim();
			if (!__zcUrl(__ut_9)) _e.push(__zcIF(void 0, "url", __sv_8, __zcPa(path, "url")));
			else __sv_8 = __ut_9.replace(__re_tnl_10, "");
		}
		input = {
			"id": __sv_3,
			"created": __sv_4,
			"title": __sv_5,
			"type": __sv_6,
			"size": __sv_7,
			"url": __sv_8
		};
	}
	return input;
}
const imageSchema = z.object({
	id: z.number(),
	created: z.date(),
	title: z.string().check(z.minLength(1), z.maxLength(100)),
	type: z.enum(["jpg", "png"]),
	size: z.number(),
	url: z.url()
});
const ratingSchema = z.object({
	id: z.number(),
	stars: z.number().check(z.minimum(1), z.maximum(5)),
	title: z.string().check(z.minLength(1), z.maxLength(100)),
	text: z.string().check(z.minLength(1), z.maxLength(1e3)),
	images: z.array(imageSchema)
});
z.toZod()(z.object({
	id: z.number(),
	created: z.date(),
	title: z.string().check(z.minLength(1), z.maxLength(100)),
	brand: z.string().check(z.minLength(1), z.maxLength(30)),
	description: z.string().check(z.minLength(1), z.maxLength(500)),
	price: z.number().check(z.minimum(1), z.maximum(1e4)),
	discount: z.nullable(z.number().check(z.minimum(1), z.maximum(100))),
	quantity: z.number().check(z.minimum(0), z.maximum(10)),
	tags: z.array(z.string().check(z.minLength(1), z.maxLength(30))),
	images: z.array(imageSchema),
	ratings: z.array(ratingSchema)
}));
const compiledProductSchema = /* @__PURE__ */ (() => {
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
	function __sw_79(input) {
		var _e = [];
		var _d = input;
		if (typeof _d !== "object" || _d === null || Array.isArray(_d)) _e.push(__zcIT("object", _d, []));
		else {
			var __sv_55 = _d["id"];
			if (typeof __sv_55 !== "number") _e.push(__zcIT("number", __sv_55, ["id"]));
			else if (Number.isNaN(__sv_55)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_55,
				path: ["id"]
			});
			else if (!Number.isFinite(__sv_55)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_55),
				input: __sv_55,
				path: ["id"]
			});
			var __sv_56 = _d["created"];
			if (!(__sv_56 instanceof Date)) _e.push(__zcIT("date", __sv_56, ["created"]));
			else if (isNaN(__sv_56.getTime())) _e.push({
				expected: "date",
				code: "invalid_type",
				received: "Invalid Date",
				input: __sv_56,
				path: ["created"]
			});
			var __sv_57 = _d["title"];
			if (typeof __sv_57 !== "string") {
				_e.push(__zcIT("string", __sv_57, ["title"]));
				if (__sv_57 !== void 0 && __sv_57 !== null && __sv_57.length !== void 0) {
					if (__sv_57.length < 1) _e.push(__zcTS(1, __zcLo(__sv_57), true, __sv_57, ["title"]));
					if (__sv_57.length > 100) _e.push(__zcTB(100, __zcLo(__sv_57), true, __sv_57, ["title"]));
				}
			} else {
				if (__sv_57.length < 1) _e.push(__zcTS(1, "string", true, __sv_57, ["title"]));
				if (__sv_57.length > 100 && (__sv_57.length > 200 || __zcCpl(__sv_57) > 100)) _e.push(__zcTB(100, "string", true, __sv_57, ["title"]));
			}
			var __sv_58 = _d["brand"];
			if (typeof __sv_58 !== "string") {
				_e.push(__zcIT("string", __sv_58, ["brand"]));
				if (__sv_58 !== void 0 && __sv_58 !== null && __sv_58.length !== void 0) {
					if (__sv_58.length < 1) _e.push(__zcTS(1, __zcLo(__sv_58), true, __sv_58, ["brand"]));
					if (__sv_58.length > 30) _e.push(__zcTB(30, __zcLo(__sv_58), true, __sv_58, ["brand"]));
				}
			} else {
				if (__sv_58.length < 1) _e.push(__zcTS(1, "string", true, __sv_58, ["brand"]));
				if (__sv_58.length > 30 && (__sv_58.length > 60 || __zcCpl(__sv_58) > 30)) _e.push(__zcTB(30, "string", true, __sv_58, ["brand"]));
			}
			var __sv_59 = _d["description"];
			if (typeof __sv_59 !== "string") {
				_e.push(__zcIT("string", __sv_59, ["description"]));
				if (__sv_59 !== void 0 && __sv_59 !== null && __sv_59.length !== void 0) {
					if (__sv_59.length < 1) _e.push(__zcTS(1, __zcLo(__sv_59), true, __sv_59, ["description"]));
					if (__sv_59.length > 500) _e.push(__zcTB(500, __zcLo(__sv_59), true, __sv_59, ["description"]));
				}
			} else {
				if (__sv_59.length < 1) _e.push(__zcTS(1, "string", true, __sv_59, ["description"]));
				if (__sv_59.length > 500 && (__sv_59.length > 1e3 || __zcCpl(__sv_59) > 500)) _e.push(__zcTB(500, "string", true, __sv_59, ["description"]));
			}
			var __sv_60 = _d["price"];
			if (typeof __sv_60 !== "number") _e.push(__zcIT("number", __sv_60, ["price"]));
			else if (Number.isNaN(__sv_60)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_60,
				path: ["price"]
			});
			else if (!Number.isFinite(__sv_60)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_60),
				input: __sv_60,
				path: ["price"]
			});
			else {
				if (__sv_60 < 1) _e.push(__zcTS(1, "number", true, __sv_60, ["price"]));
				if (__sv_60 > 1e4) _e.push(__zcTB(1e4, "number", true, __sv_60, ["price"]));
			}
			var __sv_61 = _d["discount"];
			if (__sv_61 !== null) {
				if (typeof __sv_61 !== "number") _e.push(__zcIT("number", __sv_61, ["discount"]));
				else if (Number.isNaN(__sv_61)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: "NaN",
					input: __sv_61,
					path: ["discount"]
				});
				else if (!Number.isFinite(__sv_61)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: String(__sv_61),
					input: __sv_61,
					path: ["discount"]
				});
				else {
					if (__sv_61 < 1) _e.push(__zcTS(1, "number", true, __sv_61, ["discount"]));
					if (__sv_61 > 100) _e.push(__zcTB(100, "number", true, __sv_61, ["discount"]));
				}
			}
			var __sv_62 = _d["quantity"];
			if (typeof __sv_62 !== "number") _e.push(__zcIT("number", __sv_62, ["quantity"]));
			else if (Number.isNaN(__sv_62)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_62,
				path: ["quantity"]
			});
			else if (!Number.isFinite(__sv_62)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_62),
				input: __sv_62,
				path: ["quantity"]
			});
			else {
				if (__sv_62 < 0) _e.push(__zcTS(0, "number", true, __sv_62, ["quantity"]));
				if (__sv_62 > 10) _e.push(__zcTB(10, "number", true, __sv_62, ["quantity"]));
			}
			var __sv_63 = _d["tags"];
			if (!Array.isArray(__sv_63)) _e.push(__zcIT("array", __sv_63, ["tags"]));
			else {
				var __ar_64 = __sv_63;
				for (var __i_65 = 0; __i_65 < __ar_64.length; __i_65++) {
					var __mv_66 = __ar_64[__i_65];
					if (typeof __mv_66 !== "string") {
						_e.push(__zcIT("string", __mv_66, ["tags", __i_65]));
						if (__mv_66 !== void 0 && __mv_66 !== null && __mv_66.length !== void 0) {
							if (__mv_66.length < 1) _e.push(__zcTS(1, __zcLo(__mv_66), true, __mv_66, ["tags", __i_65]));
							if (__mv_66.length > 30) _e.push(__zcTB(30, __zcLo(__mv_66), true, __mv_66, ["tags", __i_65]));
						}
					} else {
						if (__mv_66.length < 1) _e.push(__zcTS(1, "string", true, __mv_66, ["tags", __i_65]));
						if (__mv_66.length > 30 && (__mv_66.length > 60 || __zcCpl(__mv_66) > 30)) _e.push(__zcTB(30, "string", true, __mv_66, ["tags", __i_65]));
					}
				}
				__sv_63 = __ar_64;
			}
			var __sv_68 = _d["images"];
			__sv_68 = __zcSw_0(__sv_68, ["images"], _e);
			var __sv_69 = _d["ratings"];
			if (!Array.isArray(__sv_69)) _e.push(__zcIT("array", __sv_69, ["ratings"]));
			else {
				var __ar_70 = __sv_69;
				__ar_70 = __ar_70.slice();
				for (var __i_71 = 0; __i_71 < __ar_70.length; __i_71++) if (typeof __ar_70[__i_71] !== "object" || __ar_70[__i_71] === null || Array.isArray(__ar_70[__i_71])) _e.push(__zcIT("object", __ar_70[__i_71], ["ratings", __i_71]));
				else {
					var __sv_73 = __ar_70[__i_71]["id"];
					if (typeof __sv_73 !== "number") _e.push(__zcIT("number", __sv_73, [
						"ratings",
						__i_71,
						"id"
					]));
					else if (Number.isNaN(__sv_73)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_73,
						path: [
							"ratings",
							__i_71,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_73)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_73),
						input: __sv_73,
						path: [
							"ratings",
							__i_71,
							"id"
						]
					});
					var __sv_74 = __ar_70[__i_71]["stars"];
					if (typeof __sv_74 !== "number") _e.push(__zcIT("number", __sv_74, [
						"ratings",
						__i_71,
						"stars"
					]));
					else if (Number.isNaN(__sv_74)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_74,
						path: [
							"ratings",
							__i_71,
							"stars"
						]
					});
					else if (!Number.isFinite(__sv_74)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_74),
						input: __sv_74,
						path: [
							"ratings",
							__i_71,
							"stars"
						]
					});
					else {
						if (__sv_74 < 1) _e.push(__zcTS(1, "number", true, __sv_74, [
							"ratings",
							__i_71,
							"stars"
						]));
						if (__sv_74 > 5) _e.push(__zcTB(5, "number", true, __sv_74, [
							"ratings",
							__i_71,
							"stars"
						]));
					}
					var __sv_75 = __ar_70[__i_71]["title"];
					if (typeof __sv_75 !== "string") {
						_e.push(__zcIT("string", __sv_75, [
							"ratings",
							__i_71,
							"title"
						]));
						if (__sv_75 !== void 0 && __sv_75 !== null && __sv_75.length !== void 0) {
							if (__sv_75.length < 1) _e.push(__zcTS(1, __zcLo(__sv_75), true, __sv_75, [
								"ratings",
								__i_71,
								"title"
							]));
							if (__sv_75.length > 100) _e.push(__zcTB(100, __zcLo(__sv_75), true, __sv_75, [
								"ratings",
								__i_71,
								"title"
							]));
						}
					} else {
						if (__sv_75.length < 1) _e.push(__zcTS(1, "string", true, __sv_75, [
							"ratings",
							__i_71,
							"title"
						]));
						if (__sv_75.length > 100 && (__sv_75.length > 200 || __zcCpl(__sv_75) > 100)) _e.push(__zcTB(100, "string", true, __sv_75, [
							"ratings",
							__i_71,
							"title"
						]));
					}
					var __sv_76 = __ar_70[__i_71]["text"];
					if (typeof __sv_76 !== "string") {
						_e.push(__zcIT("string", __sv_76, [
							"ratings",
							__i_71,
							"text"
						]));
						if (__sv_76 !== void 0 && __sv_76 !== null && __sv_76.length !== void 0) {
							if (__sv_76.length < 1) _e.push(__zcTS(1, __zcLo(__sv_76), true, __sv_76, [
								"ratings",
								__i_71,
								"text"
							]));
							if (__sv_76.length > 1e3) _e.push(__zcTB(1e3, __zcLo(__sv_76), true, __sv_76, [
								"ratings",
								__i_71,
								"text"
							]));
						}
					} else {
						if (__sv_76.length < 1) _e.push(__zcTS(1, "string", true, __sv_76, [
							"ratings",
							__i_71,
							"text"
						]));
						if (__sv_76.length > 1e3 && (__sv_76.length > 2e3 || __zcCpl(__sv_76) > 1e3)) _e.push(__zcTB(1e3, "string", true, __sv_76, [
							"ratings",
							__i_71,
							"text"
						]));
					}
					var __sv_77 = __ar_70[__i_71]["images"];
					__sv_77 = __zcSw_0(__sv_77, [
						"ratings",
						__i_71,
						"images"
					], _e);
					__ar_70[__i_71] = {
						"id": __sv_73,
						"stars": __sv_74,
						"title": __sv_75,
						"text": __sv_76,
						"images": __sv_77
					};
				}
				__sv_69 = __ar_70;
			}
			_d = {
				"id": __sv_55,
				"created": __sv_56,
				"title": __sv_57,
				"brand": __sv_58,
				"description": __sv_59,
				"price": __sv_60,
				"discount": __sv_61,
				"quantity": __sv_62,
				"tags": __sv_63,
				"images": __sv_68,
				"ratings": __sv_69
			};
		}
		return _e;
	}
	function safeParse_compiledProductSchema(input) {
		var __bd_78 = __vb_5(input);
		if (__bd_78 !== __bf_4) return {
			success: true,
			data: __bd_78
		};
		return __zcFinDC(__sw_79, input);
	}
	return __zcMkv(safeParse_compiledProductSchema, null, null, null);
})();
export { compiledProductSchema };

//# sourceMappingURL=mini.mjs.map