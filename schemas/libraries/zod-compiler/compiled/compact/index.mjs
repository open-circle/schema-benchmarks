import { a as __zcUrl, i as __zcPu, n as __zcFinZ, o as __zcVc, r as __zcMkv, s as __zcVr, t as __zcCpl } from "./_zod-compiler-runtime-BXrgtjjh.mjs";
import * as z from "zod";
// libraries/zod-compiler/index.ts
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
	var __rfm_z = __zs.safeParse;
	function safeParse_compiledProductSchema(input) {
		var __bd_67 = __vb_17(input);
		if (__bd_67 !== __bf_16) return {
			success: true,
			data: __bd_67
		};
		return __zcFinZ(__rfm_z, __zs, input);
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
	return __zcMkv(safeParse_compiledProductSchema, __zs, null, null, __zp, __zv);
})();
export { compiledProductSchema };

//# sourceMappingURL=index.mjs.map