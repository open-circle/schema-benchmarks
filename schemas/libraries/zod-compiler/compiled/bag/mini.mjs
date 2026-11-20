import { a as __zcIT, c as __zcMkv, d as __zcTB, f as __zcTS, h as __zcVr, i as __zcIF, l as __zcPa, m as __zcVc, o as __zcIV, p as __zcUrl, r as __zcFinDC, s as __zcLo, t as __zcCpl, u as __zcPu } from "./_zod-compiler-runtime-ylV9G-MD.mjs";
import * as z from "zod/mini";
// libraries/zod-compiler/mini.ts
var __re_tnl_10 = /* @__PURE__ */ new RegExp("[\\t\\n\\r]", "g");
var __re_urlOk_11 = /* @__PURE__ */ new RegExp("^https?:\\/\\/(?:(?!xn--)[a-z0-9-]+\\.)*(?!xn--)[a-z][a-z0-9-]*(?::[0-9]{1,4})?(?:[\\/?#][^\\t\\n\\r]*)?$");
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
			if (__re_urlOk_11.test(__ut_9)) __sv_8 = __ut_9;
			else if (!__zcUrl(__ut_9)) _e.push(__zcIF(void 0, "url", __sv_8, __zcPa(path, "url")));
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
	var __bf_16 = {};
	function __af_28(a) {
		for (var __ae_27, i = 0; i < a.length; i++) {
			__ae_27 = a[i];
			if (!(typeof __ae_27 === "string" && __ae_27.length >= 1 && (__ae_27.length <= 30 || __ae_27.length <= 60 && __zcCpl(__ae_27) <= 30))) return false;
		}
		return true;
	}
	var __re_tnl_41 = /* @__PURE__ */ new RegExp("[\\t\\n\\r]", "g");
	var __re_urlOk_42 = /* @__PURE__ */ new RegExp("^https?:\\/\\/(?:(?!xn--)[a-z0-9-]+\\.)*(?!xn--)[a-z][a-z0-9-]*(?::[0-9]{1,4})?(?:[\\/?#][^\\t\\n\\r]*)?$");
	function __vb_17(input) {
		var __bv_18, __bv_19, __bv_20, __bv_21, __bv_22, __bv_23, __bv_24, __bv_25, __bv_26, __bv_29, __ba_30, __bi_31, __be_32, __bv_33, __bv_34, __bv_35, __bv_36, __bv_37, __bv_38, __bs_39, __but_40, __bo_43, __bv_44, __ba_45, __bi_46, __be_47, __bv_48, __bv_49, __bv_50, __bv_51, __bv_52, __ba_53, __bi_54, __be_55, __bv_56, __bv_57, __bv_58, __bv_59, __bv_60, __bv_61, __bs_62, __but_63, __bo_64, __bo_65, __bo_66;
		if (typeof input !== "object" || input === null || Array.isArray(input)) return __bf_16;
		__bv_18 = input["id"];
		if (!Number.isFinite(__bv_18)) return __bf_16;
		__bv_19 = input["created"];
		if (!(__bv_19 instanceof Date && !Number.isNaN(__bv_19.getTime()))) return __bf_16;
		__bv_20 = input["title"];
		if (!(typeof __bv_20 === "string" && __bv_20.length >= 1 && (__bv_20.length <= 100 || __bv_20.length <= 200 && __zcCpl(__bv_20) <= 100))) return __bf_16;
		__bv_21 = input["brand"];
		if (!(typeof __bv_21 === "string" && __bv_21.length >= 1 && (__bv_21.length <= 30 || __bv_21.length <= 60 && __zcCpl(__bv_21) <= 30))) return __bf_16;
		__bv_22 = input["description"];
		if (!(typeof __bv_22 === "string" && __bv_22.length >= 1 && (__bv_22.length <= 500 || __bv_22.length <= 1e3 && __zcCpl(__bv_22) <= 500))) return __bf_16;
		__bv_23 = input["price"];
		if (!(Number.isFinite(__bv_23) && __bv_23 >= 1 && __bv_23 <= 1e4)) return __bf_16;
		__bv_24 = input["quantity"];
		if (!(Number.isFinite(__bv_24) && __bv_24 >= 0 && __bv_24 <= 10)) return __bf_16;
		__bv_25 = input["discount"];
		if (!(__bv_25 === null || Number.isFinite(__bv_25) && __bv_25 >= 1 && __bv_25 <= 100)) return __bf_16;
		__bv_26 = input["tags"];
		if (!(Array.isArray(__bv_26) && __af_28(__bv_26))) return __bf_16;
		__bv_29 = input["images"];
		if (!Array.isArray(__bv_29)) return __bf_16;
		__ba_30 = new Array(__bv_29.length);
		for (__bi_31 = 0; __bi_31 < __bv_29.length; __bi_31++) {
			__be_32 = __bv_29[__bi_31];
			if (typeof __be_32 !== "object" || __be_32 === null || Array.isArray(__be_32)) return __bf_16;
			__bv_33 = __be_32["id"];
			if (!Number.isFinite(__bv_33)) return __bf_16;
			__bv_34 = __be_32["size"];
			if (!Number.isFinite(__bv_34)) return __bf_16;
			__bv_35 = __be_32["created"];
			if (!(__bv_35 instanceof Date && !Number.isNaN(__bv_35.getTime()))) return __bf_16;
			__bv_36 = __be_32["type"];
			if (!(__bv_36 === "jpg" || __bv_36 === "png")) return __bf_16;
			__bv_37 = __be_32["title"];
			if (!(typeof __bv_37 === "string" && __bv_37.length >= 1 && (__bv_37.length <= 100 || __bv_37.length <= 200 && __zcCpl(__bv_37) <= 100))) return __bf_16;
			__bv_38 = __be_32["url"];
			if (typeof __bv_38 !== "string") return __bf_16;
			__bs_39 = __bv_38;
			__but_40 = __bs_39.trim();
			if (__re_urlOk_42.test(__but_40)) __bs_39 = __but_40;
			else {
				if (!__zcUrl(__but_40)) return __bf_16;
				__bs_39 = __but_40.replace(__re_tnl_41, "");
			}
			__bo_43 = {
				"id": __bv_33,
				"created": __bv_35,
				"title": __bv_37,
				"type": __bv_36,
				"size": __bv_34,
				"url": __bs_39
			};
			__ba_30[__bi_31] = __bo_43;
		}
		__bv_44 = input["ratings"];
		if (!Array.isArray(__bv_44)) return __bf_16;
		__ba_45 = new Array(__bv_44.length);
		for (__bi_46 = 0; __bi_46 < __bv_44.length; __bi_46++) {
			__be_47 = __bv_44[__bi_46];
			if (typeof __be_47 !== "object" || __be_47 === null || Array.isArray(__be_47)) return __bf_16;
			__bv_48 = __be_47["id"];
			if (!Number.isFinite(__bv_48)) return __bf_16;
			__bv_49 = __be_47["stars"];
			if (!(Number.isFinite(__bv_49) && __bv_49 >= 1 && __bv_49 <= 5)) return __bf_16;
			__bv_50 = __be_47["title"];
			if (!(typeof __bv_50 === "string" && __bv_50.length >= 1 && (__bv_50.length <= 100 || __bv_50.length <= 200 && __zcCpl(__bv_50) <= 100))) return __bf_16;
			__bv_51 = __be_47["text"];
			if (!(typeof __bv_51 === "string" && __bv_51.length >= 1 && (__bv_51.length <= 1e3 || __bv_51.length <= 2e3 && __zcCpl(__bv_51) <= 1e3))) return __bf_16;
			__bv_52 = __be_47["images"];
			if (!Array.isArray(__bv_52)) return __bf_16;
			__ba_53 = new Array(__bv_52.length);
			for (__bi_54 = 0; __bi_54 < __bv_52.length; __bi_54++) {
				__be_55 = __bv_52[__bi_54];
				if (typeof __be_55 !== "object" || __be_55 === null || Array.isArray(__be_55)) return __bf_16;
				__bv_56 = __be_55["id"];
				if (!Number.isFinite(__bv_56)) return __bf_16;
				__bv_57 = __be_55["size"];
				if (!Number.isFinite(__bv_57)) return __bf_16;
				__bv_58 = __be_55["created"];
				if (!(__bv_58 instanceof Date && !Number.isNaN(__bv_58.getTime()))) return __bf_16;
				__bv_59 = __be_55["type"];
				if (!(__bv_59 === "jpg" || __bv_59 === "png")) return __bf_16;
				__bv_60 = __be_55["title"];
				if (!(typeof __bv_60 === "string" && __bv_60.length >= 1 && (__bv_60.length <= 100 || __bv_60.length <= 200 && __zcCpl(__bv_60) <= 100))) return __bf_16;
				__bv_61 = __be_55["url"];
				if (typeof __bv_61 !== "string") return __bf_16;
				__bs_62 = __bv_61;
				__but_63 = __bs_62.trim();
				if (__re_urlOk_42.test(__but_63)) __bs_62 = __but_63;
				else {
					if (!__zcUrl(__but_63)) return __bf_16;
					__bs_62 = __but_63.replace(__re_tnl_41, "");
				}
				__bo_64 = {
					"id": __bv_56,
					"created": __bv_58,
					"title": __bv_60,
					"type": __bv_59,
					"size": __bv_57,
					"url": __bs_62
				};
				__ba_53[__bi_54] = __bo_64;
			}
			__bo_65 = {
				"id": __bv_48,
				"stars": __bv_49,
				"title": __bv_50,
				"text": __bv_51,
				"images": __ba_53
			};
			__ba_45[__bi_46] = __bo_65;
		}
		__bo_66 = {
			"id": __bv_18,
			"created": __bv_19,
			"title": __bv_20,
			"brand": __bv_21,
			"description": __bv_22,
			"price": __bv_23,
			"discount": __bv_25,
			"quantity": __bv_24,
			"tags": __bv_26,
			"images": __ba_30,
			"ratings": __ba_45
		};
		return __bo_66;
	}
	function __sw_92(input) {
		var _e = [];
		var _d = input;
		if (typeof _d !== "object" || _d === null || Array.isArray(_d)) _e.push(__zcIT("object", _d, []));
		else {
			var __sv_68 = _d["id"];
			if (typeof __sv_68 !== "number") _e.push(__zcIT("number", __sv_68, ["id"]));
			else if (Number.isNaN(__sv_68)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_68,
				path: ["id"]
			});
			else if (!Number.isFinite(__sv_68)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_68),
				input: __sv_68,
				path: ["id"]
			});
			var __sv_69 = _d["created"];
			if (!(__sv_69 instanceof Date)) _e.push(__zcIT("date", __sv_69, ["created"]));
			else if (isNaN(__sv_69.getTime())) _e.push({
				expected: "date",
				code: "invalid_type",
				received: "Invalid Date",
				input: __sv_69,
				path: ["created"]
			});
			var __sv_70 = _d["title"];
			if (typeof __sv_70 !== "string") {
				_e.push(__zcIT("string", __sv_70, ["title"]));
				if (__sv_70 !== void 0 && __sv_70 !== null && __sv_70.length !== void 0) {
					if (__sv_70.length < 1) _e.push(__zcTS(1, __zcLo(__sv_70), true, __sv_70, ["title"]));
					if (__sv_70.length > 100) _e.push(__zcTB(100, __zcLo(__sv_70), true, __sv_70, ["title"]));
				}
			} else {
				if (__sv_70.length < 1) _e.push(__zcTS(1, "string", true, __sv_70, ["title"]));
				if (__sv_70.length > 100 && (__sv_70.length > 200 || __zcCpl(__sv_70) > 100)) _e.push(__zcTB(100, "string", true, __sv_70, ["title"]));
			}
			var __sv_71 = _d["brand"];
			if (typeof __sv_71 !== "string") {
				_e.push(__zcIT("string", __sv_71, ["brand"]));
				if (__sv_71 !== void 0 && __sv_71 !== null && __sv_71.length !== void 0) {
					if (__sv_71.length < 1) _e.push(__zcTS(1, __zcLo(__sv_71), true, __sv_71, ["brand"]));
					if (__sv_71.length > 30) _e.push(__zcTB(30, __zcLo(__sv_71), true, __sv_71, ["brand"]));
				}
			} else {
				if (__sv_71.length < 1) _e.push(__zcTS(1, "string", true, __sv_71, ["brand"]));
				if (__sv_71.length > 30 && (__sv_71.length > 60 || __zcCpl(__sv_71) > 30)) _e.push(__zcTB(30, "string", true, __sv_71, ["brand"]));
			}
			var __sv_72 = _d["description"];
			if (typeof __sv_72 !== "string") {
				_e.push(__zcIT("string", __sv_72, ["description"]));
				if (__sv_72 !== void 0 && __sv_72 !== null && __sv_72.length !== void 0) {
					if (__sv_72.length < 1) _e.push(__zcTS(1, __zcLo(__sv_72), true, __sv_72, ["description"]));
					if (__sv_72.length > 500) _e.push(__zcTB(500, __zcLo(__sv_72), true, __sv_72, ["description"]));
				}
			} else {
				if (__sv_72.length < 1) _e.push(__zcTS(1, "string", true, __sv_72, ["description"]));
				if (__sv_72.length > 500 && (__sv_72.length > 1e3 || __zcCpl(__sv_72) > 500)) _e.push(__zcTB(500, "string", true, __sv_72, ["description"]));
			}
			var __sv_73 = _d["price"];
			if (typeof __sv_73 !== "number") _e.push(__zcIT("number", __sv_73, ["price"]));
			else if (Number.isNaN(__sv_73)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_73,
				path: ["price"]
			});
			else if (!Number.isFinite(__sv_73)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_73),
				input: __sv_73,
				path: ["price"]
			});
			else {
				if (__sv_73 < 1) _e.push(__zcTS(1, "number", true, __sv_73, ["price"]));
				if (__sv_73 > 1e4) _e.push(__zcTB(1e4, "number", true, __sv_73, ["price"]));
			}
			var __sv_74 = _d["discount"];
			if (__sv_74 !== null) {
				if (typeof __sv_74 !== "number") _e.push(__zcIT("number", __sv_74, ["discount"]));
				else if (Number.isNaN(__sv_74)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: "NaN",
					input: __sv_74,
					path: ["discount"]
				});
				else if (!Number.isFinite(__sv_74)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: String(__sv_74),
					input: __sv_74,
					path: ["discount"]
				});
				else {
					if (__sv_74 < 1) _e.push(__zcTS(1, "number", true, __sv_74, ["discount"]));
					if (__sv_74 > 100) _e.push(__zcTB(100, "number", true, __sv_74, ["discount"]));
				}
			}
			var __sv_75 = _d["quantity"];
			if (typeof __sv_75 !== "number") _e.push(__zcIT("number", __sv_75, ["quantity"]));
			else if (Number.isNaN(__sv_75)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_75,
				path: ["quantity"]
			});
			else if (!Number.isFinite(__sv_75)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_75),
				input: __sv_75,
				path: ["quantity"]
			});
			else {
				if (__sv_75 < 0) _e.push(__zcTS(0, "number", true, __sv_75, ["quantity"]));
				if (__sv_75 > 10) _e.push(__zcTB(10, "number", true, __sv_75, ["quantity"]));
			}
			var __sv_76 = _d["tags"];
			if (!Array.isArray(__sv_76)) _e.push(__zcIT("array", __sv_76, ["tags"]));
			else {
				var __ar_77 = __sv_76;
				for (var __i_78 = 0; __i_78 < __ar_77.length; __i_78++) {
					var __mv_79 = __ar_77[__i_78];
					if (typeof __mv_79 !== "string") {
						_e.push(__zcIT("string", __mv_79, ["tags", __i_78]));
						if (__mv_79 !== void 0 && __mv_79 !== null && __mv_79.length !== void 0) {
							if (__mv_79.length < 1) _e.push(__zcTS(1, __zcLo(__mv_79), true, __mv_79, ["tags", __i_78]));
							if (__mv_79.length > 30) _e.push(__zcTB(30, __zcLo(__mv_79), true, __mv_79, ["tags", __i_78]));
						}
					} else {
						if (__mv_79.length < 1) _e.push(__zcTS(1, "string", true, __mv_79, ["tags", __i_78]));
						if (__mv_79.length > 30 && (__mv_79.length > 60 || __zcCpl(__mv_79) > 30)) _e.push(__zcTB(30, "string", true, __mv_79, ["tags", __i_78]));
					}
				}
				__sv_76 = __ar_77;
			}
			var __sv_81 = _d["images"];
			__sv_81 = __zcSw_0(__sv_81, ["images"], _e);
			var __sv_82 = _d["ratings"];
			if (!Array.isArray(__sv_82)) _e.push(__zcIT("array", __sv_82, ["ratings"]));
			else {
				var __ar_83 = __sv_82;
				__ar_83 = __ar_83.slice();
				for (var __i_84 = 0; __i_84 < __ar_83.length; __i_84++) if (typeof __ar_83[__i_84] !== "object" || __ar_83[__i_84] === null || Array.isArray(__ar_83[__i_84])) _e.push(__zcIT("object", __ar_83[__i_84], ["ratings", __i_84]));
				else {
					var __sv_86 = __ar_83[__i_84]["id"];
					if (typeof __sv_86 !== "number") _e.push(__zcIT("number", __sv_86, [
						"ratings",
						__i_84,
						"id"
					]));
					else if (Number.isNaN(__sv_86)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_86,
						path: [
							"ratings",
							__i_84,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_86)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_86),
						input: __sv_86,
						path: [
							"ratings",
							__i_84,
							"id"
						]
					});
					var __sv_87 = __ar_83[__i_84]["stars"];
					if (typeof __sv_87 !== "number") _e.push(__zcIT("number", __sv_87, [
						"ratings",
						__i_84,
						"stars"
					]));
					else if (Number.isNaN(__sv_87)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_87,
						path: [
							"ratings",
							__i_84,
							"stars"
						]
					});
					else if (!Number.isFinite(__sv_87)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_87),
						input: __sv_87,
						path: [
							"ratings",
							__i_84,
							"stars"
						]
					});
					else {
						if (__sv_87 < 1) _e.push(__zcTS(1, "number", true, __sv_87, [
							"ratings",
							__i_84,
							"stars"
						]));
						if (__sv_87 > 5) _e.push(__zcTB(5, "number", true, __sv_87, [
							"ratings",
							__i_84,
							"stars"
						]));
					}
					var __sv_88 = __ar_83[__i_84]["title"];
					if (typeof __sv_88 !== "string") {
						_e.push(__zcIT("string", __sv_88, [
							"ratings",
							__i_84,
							"title"
						]));
						if (__sv_88 !== void 0 && __sv_88 !== null && __sv_88.length !== void 0) {
							if (__sv_88.length < 1) _e.push(__zcTS(1, __zcLo(__sv_88), true, __sv_88, [
								"ratings",
								__i_84,
								"title"
							]));
							if (__sv_88.length > 100) _e.push(__zcTB(100, __zcLo(__sv_88), true, __sv_88, [
								"ratings",
								__i_84,
								"title"
							]));
						}
					} else {
						if (__sv_88.length < 1) _e.push(__zcTS(1, "string", true, __sv_88, [
							"ratings",
							__i_84,
							"title"
						]));
						if (__sv_88.length > 100 && (__sv_88.length > 200 || __zcCpl(__sv_88) > 100)) _e.push(__zcTB(100, "string", true, __sv_88, [
							"ratings",
							__i_84,
							"title"
						]));
					}
					var __sv_89 = __ar_83[__i_84]["text"];
					if (typeof __sv_89 !== "string") {
						_e.push(__zcIT("string", __sv_89, [
							"ratings",
							__i_84,
							"text"
						]));
						if (__sv_89 !== void 0 && __sv_89 !== null && __sv_89.length !== void 0) {
							if (__sv_89.length < 1) _e.push(__zcTS(1, __zcLo(__sv_89), true, __sv_89, [
								"ratings",
								__i_84,
								"text"
							]));
							if (__sv_89.length > 1e3) _e.push(__zcTB(1e3, __zcLo(__sv_89), true, __sv_89, [
								"ratings",
								__i_84,
								"text"
							]));
						}
					} else {
						if (__sv_89.length < 1) _e.push(__zcTS(1, "string", true, __sv_89, [
							"ratings",
							__i_84,
							"text"
						]));
						if (__sv_89.length > 1e3 && (__sv_89.length > 2e3 || __zcCpl(__sv_89) > 1e3)) _e.push(__zcTB(1e3, "string", true, __sv_89, [
							"ratings",
							__i_84,
							"text"
						]));
					}
					var __sv_90 = __ar_83[__i_84]["images"];
					__sv_90 = __zcSw_0(__sv_90, [
						"ratings",
						__i_84,
						"images"
					], _e);
					__ar_83[__i_84] = {
						"id": __sv_86,
						"stars": __sv_87,
						"title": __sv_88,
						"text": __sv_89,
						"images": __sv_90
					};
				}
				__sv_82 = __ar_83;
			}
			_d = {
				"id": __sv_68,
				"created": __sv_69,
				"title": __sv_70,
				"brand": __sv_71,
				"description": __sv_72,
				"price": __sv_73,
				"discount": __sv_74,
				"quantity": __sv_75,
				"tags": __sv_76,
				"images": __sv_81,
				"ratings": __sv_82
			};
		}
		return _e;
	}
	function safeParse_compiledProductSchema(input) {
		var __bd_91 = __vb_17(input);
		if (__bd_91 !== __bf_16) return {
			success: true,
			data: __bd_91
		};
		return __zcFinDC(__sw_92, input);
	}
	function __zp(input) {
		return __zcPu(safeParse_compiledProductSchema(input), __zp);
	}
	function __zv(input) {
		try {
			return __zcVr(safeParse_compiledProductSchema(input));
		} catch (e) {
			return __zcVc(e, input, __zv);
		}
	}
	return __zcMkv(safeParse_compiledProductSchema, null, null, null, __zp, __zv);
})();
export { compiledProductSchema };

//# sourceMappingURL=mini.mjs.map