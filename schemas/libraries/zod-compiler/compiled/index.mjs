import { a as __zcIT, c as __zcMkv, d as __zcTB, f as __zcTS, g as __zcZr, h as __zcVr, i as __zcIF, l as __zcPa, m as __zcVc, n as __zcFinD, o as __zcIV, p as __zcUrl, s as __zcLo, t as __zcCpl, u as __zcPu } from "./_zod-compiler-runtime-CUbiWDtO.mjs";
import * as z from "zod";
// libraries/zod-compiler/index.ts
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
	var __bf_16 = {};
	function __af_28(a) {
		for (var __ae_27, i = 0; i < a.length; i++) {
			__ae_27 = a[i];
			if (!(typeof __ae_27 === "string" && __ae_27.length >= 1 && (__ae_27.length <= 30 || __ae_27.length <= 60 && __zcCpl(__ae_27) <= 30))) return false;
		}
		return true;
	}
	function __vc_33(__bp_29) {
		var __ba_30, __bi_31, __be_32;
		if (!Array.isArray(__bp_29)) return __bf_16;
		__ba_30 = new Array(__bp_29.length);
		for (__bi_31 = 0; __bi_31 < __bp_29.length; __bi_31++) {
			__be_32 = __bp_29[__bi_31];
			if (!(typeof __be_32 === "string" && __be_32.length >= 1 && (__be_32.length <= 30 || __be_32.length <= 60 && __zcCpl(__be_32) <= 30))) return __bf_16;
			__ba_30[__bi_31] = __be_32;
		}
		return __ba_30;
	}
	var __re_tnl_47 = /* @__PURE__ */ new RegExp("[\\t\\n\\r]", "g");
	var __re_urlOk_48 = /* @__PURE__ */ new RegExp("^https?:\\/\\/(?:(?!xn--)[a-z0-9-]+\\.)*(?!xn--)[a-z][a-z0-9-]*(?::[0-9]{1,4})?(?:[\\/?#][^\\t\\n\\r]*)?$");
	function __vb_17(input, __zf) {
		var __bv_18, __bv_19, __bv_20, __bv_21, __bv_22, __bv_23, __bv_24, __bv_25, __bv_26, __bz_34, __bv_35, __ba_36, __bi_37, __be_38, __bv_39, __bv_40, __bv_41, __bv_42, __bv_43, __bv_44, __bs_45, __but_46, __bo_49, __bv_50, __ba_51, __bi_52, __be_53, __bv_54, __bv_55, __bv_56, __bv_57, __bv_58, __ba_59, __bi_60, __be_61, __bv_62, __bv_63, __bv_64, __bv_65, __bv_66, __bv_67, __bs_68, __but_69, __bo_70, __bo_71, __bo_72;
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
		__bz_34 = __zf ? __vc_33(__bv_26) : Array.isArray(__bv_26) && __af_28(__bv_26) ? __bv_26 : __bf_16;
		if (__bz_34 === __bf_16) return __bf_16;
		__bv_35 = input["images"];
		if (!Array.isArray(__bv_35)) return __bf_16;
		__ba_36 = new Array(__bv_35.length);
		for (__bi_37 = 0; __bi_37 < __bv_35.length; __bi_37++) {
			__be_38 = __bv_35[__bi_37];
			if (typeof __be_38 !== "object" || __be_38 === null || Array.isArray(__be_38)) return __bf_16;
			__bv_39 = __be_38["id"];
			if (!Number.isFinite(__bv_39)) return __bf_16;
			__bv_40 = __be_38["size"];
			if (!Number.isFinite(__bv_40)) return __bf_16;
			__bv_41 = __be_38["created"];
			if (!(__bv_41 instanceof Date && !Number.isNaN(__bv_41.getTime()))) return __bf_16;
			__bv_42 = __be_38["type"];
			if (!(__bv_42 === "jpg" || __bv_42 === "png")) return __bf_16;
			__bv_43 = __be_38["title"];
			if (!(typeof __bv_43 === "string" && __bv_43.length >= 1 && (__bv_43.length <= 100 || __bv_43.length <= 200 && __zcCpl(__bv_43) <= 100))) return __bf_16;
			__bv_44 = __be_38["url"];
			if (typeof __bv_44 !== "string") return __bf_16;
			__bs_45 = __bv_44;
			__but_46 = __bs_45.trim();
			if (__re_urlOk_48.test(__but_46)) __bs_45 = __but_46;
			else {
				if (!__zcUrl(__but_46)) return __bf_16;
				__bs_45 = __but_46.replace(__re_tnl_47, "");
			}
			__bo_49 = {
				"id": __bv_39,
				"created": __bv_41,
				"title": __bv_43,
				"type": __bv_42,
				"size": __bv_40,
				"url": __bs_45
			};
			__ba_36[__bi_37] = __bo_49;
		}
		__bv_50 = input["ratings"];
		if (!Array.isArray(__bv_50)) return __bf_16;
		__ba_51 = new Array(__bv_50.length);
		for (__bi_52 = 0; __bi_52 < __bv_50.length; __bi_52++) {
			__be_53 = __bv_50[__bi_52];
			if (typeof __be_53 !== "object" || __be_53 === null || Array.isArray(__be_53)) return __bf_16;
			__bv_54 = __be_53["id"];
			if (!Number.isFinite(__bv_54)) return __bf_16;
			__bv_55 = __be_53["stars"];
			if (!(Number.isFinite(__bv_55) && __bv_55 >= 1 && __bv_55 <= 5)) return __bf_16;
			__bv_56 = __be_53["title"];
			if (!(typeof __bv_56 === "string" && __bv_56.length >= 1 && (__bv_56.length <= 100 || __bv_56.length <= 200 && __zcCpl(__bv_56) <= 100))) return __bf_16;
			__bv_57 = __be_53["text"];
			if (!(typeof __bv_57 === "string" && __bv_57.length >= 1 && (__bv_57.length <= 1e3 || __bv_57.length <= 2e3 && __zcCpl(__bv_57) <= 1e3))) return __bf_16;
			__bv_58 = __be_53["images"];
			if (!Array.isArray(__bv_58)) return __bf_16;
			__ba_59 = new Array(__bv_58.length);
			for (__bi_60 = 0; __bi_60 < __bv_58.length; __bi_60++) {
				__be_61 = __bv_58[__bi_60];
				if (typeof __be_61 !== "object" || __be_61 === null || Array.isArray(__be_61)) return __bf_16;
				__bv_62 = __be_61["id"];
				if (!Number.isFinite(__bv_62)) return __bf_16;
				__bv_63 = __be_61["size"];
				if (!Number.isFinite(__bv_63)) return __bf_16;
				__bv_64 = __be_61["created"];
				if (!(__bv_64 instanceof Date && !Number.isNaN(__bv_64.getTime()))) return __bf_16;
				__bv_65 = __be_61["type"];
				if (!(__bv_65 === "jpg" || __bv_65 === "png")) return __bf_16;
				__bv_66 = __be_61["title"];
				if (!(typeof __bv_66 === "string" && __bv_66.length >= 1 && (__bv_66.length <= 100 || __bv_66.length <= 200 && __zcCpl(__bv_66) <= 100))) return __bf_16;
				__bv_67 = __be_61["url"];
				if (typeof __bv_67 !== "string") return __bf_16;
				__bs_68 = __bv_67;
				__but_69 = __bs_68.trim();
				if (__re_urlOk_48.test(__but_69)) __bs_68 = __but_69;
				else {
					if (!__zcUrl(__but_69)) return __bf_16;
					__bs_68 = __but_69.replace(__re_tnl_47, "");
				}
				__bo_70 = {
					"id": __bv_62,
					"created": __bv_64,
					"title": __bv_66,
					"type": __bv_65,
					"size": __bv_63,
					"url": __bs_68
				};
				__ba_59[__bi_60] = __bo_70;
			}
			__bo_71 = {
				"id": __bv_54,
				"stars": __bv_55,
				"title": __bv_56,
				"text": __bv_57,
				"images": __ba_59
			};
			__ba_51[__bi_52] = __bo_71;
		}
		__bo_72 = {
			"id": __bv_18,
			"created": __bv_19,
			"title": __bv_20,
			"brand": __bv_21,
			"description": __bv_22,
			"price": __bv_23,
			"discount": __bv_25,
			"quantity": __bv_24,
			"tags": __bz_34,
			"images": __ba_36,
			"ratings": __ba_51
		};
		return __bo_72;
	}
	function __sw_98(input) {
		var _e = [];
		var _d = input;
		if (typeof _d !== "object" || _d === null || Array.isArray(_d)) _e.push(__zcIT("object", _d, []));
		else {
			var __sv_74 = _d["id"];
			if (typeof __sv_74 !== "number") _e.push(__zcIT("number", __sv_74, ["id"]));
			else if (Number.isNaN(__sv_74)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_74,
				path: ["id"]
			});
			else if (!Number.isFinite(__sv_74)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_74),
				input: __sv_74,
				path: ["id"]
			});
			var __sv_75 = _d["created"];
			if (!(__sv_75 instanceof Date)) _e.push(__zcIT("date", __sv_75, ["created"]));
			else if (isNaN(__sv_75.getTime())) _e.push({
				expected: "date",
				code: "invalid_type",
				received: "Invalid Date",
				input: __sv_75,
				path: ["created"]
			});
			var __sv_76 = _d["title"];
			if (typeof __sv_76 !== "string") {
				_e.push(__zcIT("string", __sv_76, ["title"]));
				if (__sv_76 !== void 0 && __sv_76 !== null && __sv_76.length !== void 0) {
					if (__sv_76.length < 1) _e.push(__zcTS(1, __zcLo(__sv_76), true, __sv_76, ["title"]));
					if (__sv_76.length > 100) _e.push(__zcTB(100, __zcLo(__sv_76), true, __sv_76, ["title"]));
				}
			} else {
				if (__sv_76.length < 1) _e.push(__zcTS(1, "string", true, __sv_76, ["title"]));
				if (__sv_76.length > 100 && (__sv_76.length > 200 || __zcCpl(__sv_76) > 100)) _e.push(__zcTB(100, "string", true, __sv_76, ["title"]));
			}
			var __sv_77 = _d["brand"];
			if (typeof __sv_77 !== "string") {
				_e.push(__zcIT("string", __sv_77, ["brand"]));
				if (__sv_77 !== void 0 && __sv_77 !== null && __sv_77.length !== void 0) {
					if (__sv_77.length < 1) _e.push(__zcTS(1, __zcLo(__sv_77), true, __sv_77, ["brand"]));
					if (__sv_77.length > 30) _e.push(__zcTB(30, __zcLo(__sv_77), true, __sv_77, ["brand"]));
				}
			} else {
				if (__sv_77.length < 1) _e.push(__zcTS(1, "string", true, __sv_77, ["brand"]));
				if (__sv_77.length > 30 && (__sv_77.length > 60 || __zcCpl(__sv_77) > 30)) _e.push(__zcTB(30, "string", true, __sv_77, ["brand"]));
			}
			var __sv_78 = _d["description"];
			if (typeof __sv_78 !== "string") {
				_e.push(__zcIT("string", __sv_78, ["description"]));
				if (__sv_78 !== void 0 && __sv_78 !== null && __sv_78.length !== void 0) {
					if (__sv_78.length < 1) _e.push(__zcTS(1, __zcLo(__sv_78), true, __sv_78, ["description"]));
					if (__sv_78.length > 500) _e.push(__zcTB(500, __zcLo(__sv_78), true, __sv_78, ["description"]));
				}
			} else {
				if (__sv_78.length < 1) _e.push(__zcTS(1, "string", true, __sv_78, ["description"]));
				if (__sv_78.length > 500 && (__sv_78.length > 1e3 || __zcCpl(__sv_78) > 500)) _e.push(__zcTB(500, "string", true, __sv_78, ["description"]));
			}
			var __sv_79 = _d["price"];
			if (typeof __sv_79 !== "number") _e.push(__zcIT("number", __sv_79, ["price"]));
			else if (Number.isNaN(__sv_79)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_79,
				path: ["price"]
			});
			else if (!Number.isFinite(__sv_79)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_79),
				input: __sv_79,
				path: ["price"]
			});
			else {
				if (__sv_79 < 1) _e.push(__zcTS(1, "number", true, __sv_79, ["price"]));
				if (__sv_79 > 1e4) _e.push(__zcTB(1e4, "number", true, __sv_79, ["price"]));
			}
			var __sv_80 = _d["discount"];
			if (__sv_80 !== null) {
				if (typeof __sv_80 !== "number") _e.push(__zcIT("number", __sv_80, ["discount"]));
				else if (Number.isNaN(__sv_80)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: "NaN",
					input: __sv_80,
					path: ["discount"]
				});
				else if (!Number.isFinite(__sv_80)) _e.push({
					expected: "number",
					code: "invalid_type",
					received: String(__sv_80),
					input: __sv_80,
					path: ["discount"]
				});
				else {
					if (__sv_80 < 1) _e.push(__zcTS(1, "number", true, __sv_80, ["discount"]));
					if (__sv_80 > 100) _e.push(__zcTB(100, "number", true, __sv_80, ["discount"]));
				}
			}
			var __sv_81 = _d["quantity"];
			if (typeof __sv_81 !== "number") _e.push(__zcIT("number", __sv_81, ["quantity"]));
			else if (Number.isNaN(__sv_81)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: "NaN",
				input: __sv_81,
				path: ["quantity"]
			});
			else if (!Number.isFinite(__sv_81)) _e.push({
				expected: "number",
				code: "invalid_type",
				received: String(__sv_81),
				input: __sv_81,
				path: ["quantity"]
			});
			else {
				if (__sv_81 < 0) _e.push(__zcTS(0, "number", true, __sv_81, ["quantity"]));
				if (__sv_81 > 10) _e.push(__zcTB(10, "number", true, __sv_81, ["quantity"]));
			}
			var __sv_82 = _d["tags"];
			if (!Array.isArray(__sv_82)) _e.push(__zcIT("array", __sv_82, ["tags"]));
			else {
				var __ar_83 = __sv_82;
				for (var __i_84 = 0; __i_84 < __ar_83.length; __i_84++) {
					var __mv_85 = __ar_83[__i_84];
					if (typeof __mv_85 !== "string") {
						_e.push(__zcIT("string", __mv_85, ["tags", __i_84]));
						if (__mv_85 !== void 0 && __mv_85 !== null && __mv_85.length !== void 0) {
							if (__mv_85.length < 1) _e.push(__zcTS(1, __zcLo(__mv_85), true, __mv_85, ["tags", __i_84]));
							if (__mv_85.length > 30) _e.push(__zcTB(30, __zcLo(__mv_85), true, __mv_85, ["tags", __i_84]));
						}
					} else {
						if (__mv_85.length < 1) _e.push(__zcTS(1, "string", true, __mv_85, ["tags", __i_84]));
						if (__mv_85.length > 30 && (__mv_85.length > 60 || __zcCpl(__mv_85) > 30)) _e.push(__zcTB(30, "string", true, __mv_85, ["tags", __i_84]));
					}
				}
				__sv_82 = __ar_83;
			}
			var __sv_87 = _d["images"];
			__sv_87 = __zcSw_0(__sv_87, ["images"], _e);
			var __sv_88 = _d["ratings"];
			if (!Array.isArray(__sv_88)) _e.push(__zcIT("array", __sv_88, ["ratings"]));
			else {
				var __ar_89 = __sv_88;
				__ar_89 = __ar_89.slice();
				for (var __i_90 = 0; __i_90 < __ar_89.length; __i_90++) if (typeof __ar_89[__i_90] !== "object" || __ar_89[__i_90] === null || Array.isArray(__ar_89[__i_90])) _e.push(__zcIT("object", __ar_89[__i_90], ["ratings", __i_90]));
				else {
					var __sv_92 = __ar_89[__i_90]["id"];
					if (typeof __sv_92 !== "number") _e.push(__zcIT("number", __sv_92, [
						"ratings",
						__i_90,
						"id"
					]));
					else if (Number.isNaN(__sv_92)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_92,
						path: [
							"ratings",
							__i_90,
							"id"
						]
					});
					else if (!Number.isFinite(__sv_92)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_92),
						input: __sv_92,
						path: [
							"ratings",
							__i_90,
							"id"
						]
					});
					var __sv_93 = __ar_89[__i_90]["stars"];
					if (typeof __sv_93 !== "number") _e.push(__zcIT("number", __sv_93, [
						"ratings",
						__i_90,
						"stars"
					]));
					else if (Number.isNaN(__sv_93)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: "NaN",
						input: __sv_93,
						path: [
							"ratings",
							__i_90,
							"stars"
						]
					});
					else if (!Number.isFinite(__sv_93)) _e.push({
						expected: "number",
						code: "invalid_type",
						received: String(__sv_93),
						input: __sv_93,
						path: [
							"ratings",
							__i_90,
							"stars"
						]
					});
					else {
						if (__sv_93 < 1) _e.push(__zcTS(1, "number", true, __sv_93, [
							"ratings",
							__i_90,
							"stars"
						]));
						if (__sv_93 > 5) _e.push(__zcTB(5, "number", true, __sv_93, [
							"ratings",
							__i_90,
							"stars"
						]));
					}
					var __sv_94 = __ar_89[__i_90]["title"];
					if (typeof __sv_94 !== "string") {
						_e.push(__zcIT("string", __sv_94, [
							"ratings",
							__i_90,
							"title"
						]));
						if (__sv_94 !== void 0 && __sv_94 !== null && __sv_94.length !== void 0) {
							if (__sv_94.length < 1) _e.push(__zcTS(1, __zcLo(__sv_94), true, __sv_94, [
								"ratings",
								__i_90,
								"title"
							]));
							if (__sv_94.length > 100) _e.push(__zcTB(100, __zcLo(__sv_94), true, __sv_94, [
								"ratings",
								__i_90,
								"title"
							]));
						}
					} else {
						if (__sv_94.length < 1) _e.push(__zcTS(1, "string", true, __sv_94, [
							"ratings",
							__i_90,
							"title"
						]));
						if (__sv_94.length > 100 && (__sv_94.length > 200 || __zcCpl(__sv_94) > 100)) _e.push(__zcTB(100, "string", true, __sv_94, [
							"ratings",
							__i_90,
							"title"
						]));
					}
					var __sv_95 = __ar_89[__i_90]["text"];
					if (typeof __sv_95 !== "string") {
						_e.push(__zcIT("string", __sv_95, [
							"ratings",
							__i_90,
							"text"
						]));
						if (__sv_95 !== void 0 && __sv_95 !== null && __sv_95.length !== void 0) {
							if (__sv_95.length < 1) _e.push(__zcTS(1, __zcLo(__sv_95), true, __sv_95, [
								"ratings",
								__i_90,
								"text"
							]));
							if (__sv_95.length > 1e3) _e.push(__zcTB(1e3, __zcLo(__sv_95), true, __sv_95, [
								"ratings",
								__i_90,
								"text"
							]));
						}
					} else {
						if (__sv_95.length < 1) _e.push(__zcTS(1, "string", true, __sv_95, [
							"ratings",
							__i_90,
							"text"
						]));
						if (__sv_95.length > 1e3 && (__sv_95.length > 2e3 || __zcCpl(__sv_95) > 1e3)) _e.push(__zcTB(1e3, "string", true, __sv_95, [
							"ratings",
							__i_90,
							"text"
						]));
					}
					var __sv_96 = __ar_89[__i_90]["images"];
					__sv_96 = __zcSw_0(__sv_96, [
						"ratings",
						__i_90,
						"images"
					], _e);
					__ar_89[__i_90] = {
						"id": __sv_92,
						"stars": __sv_93,
						"title": __sv_94,
						"text": __sv_95,
						"images": __sv_96
					};
				}
				__sv_88 = __ar_89;
			}
			_d = {
				"id": __sv_74,
				"created": __sv_75,
				"title": __sv_76,
				"brand": __sv_77,
				"description": __sv_78,
				"price": __sv_79,
				"discount": __sv_80,
				"quantity": __sv_81,
				"tags": __sv_82,
				"images": __sv_87,
				"ratings": __sv_88
			};
		}
		return _e;
	}
	function safeParse_compiledProductSchema(input) {
		var __bd_97 = __vb_17(input);
		if (__bd_97 !== __bf_16) return {
			success: true,
			data: __bd_97
		};
		return __zcFinD(__sw_98, input);
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
	return __zcZr(__zcMkv(safeParse_compiledProductSchema, productSchema, null, null, __zp, __zv), safeParse_compiledProductSchema, 1, __vb_17, __bf_16);
})();
export { compiledProductSchema };

//# sourceMappingURL=index.mjs.map