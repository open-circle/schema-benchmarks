// ../schemas/.mion/types/pf/_rt/Z2sc5xQPKB.js
const __rt_pf$2F_rt$2FZ2sc5xQPKB = [
	2,
	,
	,
	"_rt:Z2sc5xQPKB",
	[],
	,
	[],
	function() {
		const highSurrogateRegexp = /[\uD800-\uDBFF]/;
		return function _code_point_length(value) {
			const len = value.length;
			if (len > 24 && !highSurrogateRegexp.test(value)) return len;
			let count = len;
			for (let i = 0; i < len; i++) {
				const code = value.charCodeAt(i);
				if (code >= 55296 && code <= 56319 && i + 1 < len) {
					i++;
					count--;
				}
			}
			return count;
		};
	}
];
// ../schemas/.mion/types/WOvb_YYm3EVP.js
const __rt_WOvb_YYm3EVP = [
	"val",
	() => [__rt_pf$2F_rt$2FZ2sc5xQPKB],
	,
	"WOvb_YYm3EVP",
	"objectLiteral",
	,
	,
	,
	["_rt:Z2sc5xQPKB"],
	function g_WOvb_YYm3EVP(utl) {
		const Z2sc5xQPKB = utl.getPureFn("_rt:Z2sc5xQPKB");
		const ctxFn0 = function(v) {
			if (!Array.isArray(v.tags)) return false;
			for (let i0 = 0; i0 < v.tags.length; i0++) if (!(typeof v.tags[i0] === "string" && (v.tags[i0].length <= 30 || v.tags[i0].length <= 60 && Z2sc5xQPKB(v.tags[i0]) <= 30) && v.tags[i0].length >= 1 && (v.tags[i0].length >= 2 || Z2sc5xQPKB(v.tags[i0]) >= 1))) return false;
			return true;
		};
		const reFmt0 = /* @__PURE__ */ new RegExp("^(?:https?|ftps?|wss?):\\/\\/[^\\s/$.?#-][^\\s]*$", "i");
		const ctxFn1 = function(v) {
			if (!Array.isArray(v.images)) return false;
			for (let i1 = 0; i1 < v.images.length; i1++) if (!(typeof v.images[i1] === "object" && v.images[i1] !== null && typeof v.images[i1].id === "number" && v.images[i1].created instanceof Date && !isNaN(v.images[i1].created.getTime()) && typeof v.images[i1].title === "string" && (v.images[i1].title.length <= 100 || v.images[i1].title.length <= 200 && Z2sc5xQPKB(v.images[i1].title) <= 100) && v.images[i1].title.length >= 1 && (v.images[i1].title.length >= 2 || Z2sc5xQPKB(v.images[i1].title) >= 1) && (v.images[i1].type === "jpg" || v.images[i1].type === "png") && typeof v.images[i1].size === "number" && typeof v.images[i1].url === "string" && (v.images[i1].url.length <= 2048 || v.images[i1].url.length <= 4096 && Z2sc5xQPKB(v.images[i1].url) <= 2048) && reFmt0.test(v.images[i1].url))) return false;
			return true;
		};
		const reFmt1 = /* @__PURE__ */ new RegExp("^(?:https?|ftps?|wss?):\\/\\/[^\\s/$.?#-][^\\s]*$", "i");
		const ctxFn2 = function(v, i2) {
			if (!Array.isArray(v.ratings[i2].images)) return false;
			for (let i3 = 0; i3 < v.ratings[i2].images.length; i3++) if (!(typeof v.ratings[i2].images[i3] === "object" && v.ratings[i2].images[i3] !== null && typeof v.ratings[i2].images[i3].id === "number" && v.ratings[i2].images[i3].created instanceof Date && !isNaN(v.ratings[i2].images[i3].created.getTime()) && typeof v.ratings[i2].images[i3].title === "string" && (v.ratings[i2].images[i3].title.length <= 100 || v.ratings[i2].images[i3].title.length <= 200 && Z2sc5xQPKB(v.ratings[i2].images[i3].title) <= 100) && v.ratings[i2].images[i3].title.length >= 1 && (v.ratings[i2].images[i3].title.length >= 2 || Z2sc5xQPKB(v.ratings[i2].images[i3].title) >= 1) && (v.ratings[i2].images[i3].type === "jpg" || v.ratings[i2].images[i3].type === "png") && typeof v.ratings[i2].images[i3].size === "number" && typeof v.ratings[i2].images[i3].url === "string" && (v.ratings[i2].images[i3].url.length <= 2048 || v.ratings[i2].images[i3].url.length <= 4096 && Z2sc5xQPKB(v.ratings[i2].images[i3].url) <= 2048) && reFmt1.test(v.ratings[i2].images[i3].url))) return false;
			return true;
		};
		const ctxFn3 = function(v) {
			if (!Array.isArray(v.ratings)) return false;
			for (let i2 = 0; i2 < v.ratings.length; i2++) if (!(typeof v.ratings[i2] === "object" && v.ratings[i2] !== null && typeof v.ratings[i2].id === "number" && typeof v.ratings[i2].stars === "number" && v.ratings[i2].stars <= 5 && v.ratings[i2].stars >= 1 && typeof v.ratings[i2].title === "string" && (v.ratings[i2].title.length <= 100 || v.ratings[i2].title.length <= 200 && Z2sc5xQPKB(v.ratings[i2].title) <= 100) && v.ratings[i2].title.length >= 1 && (v.ratings[i2].title.length >= 2 || Z2sc5xQPKB(v.ratings[i2].title) >= 1) && typeof v.ratings[i2].text === "string" && (v.ratings[i2].text.length <= 1e3 || v.ratings[i2].text.length <= 2e3 && Z2sc5xQPKB(v.ratings[i2].text) <= 1e3) && v.ratings[i2].text.length >= 1 && (v.ratings[i2].text.length >= 2 || Z2sc5xQPKB(v.ratings[i2].text) >= 1) && ctxFn2(v, i2))) return false;
			return true;
		};
		function WOvb_YYm3EVP(v) {
			return typeof v === "object" && v !== null && typeof v.id === "number" && v.created instanceof Date && !isNaN(v.created.getTime()) && typeof v.title === "string" && (v.title.length <= 100 || v.title.length <= 200 && Z2sc5xQPKB(v.title) <= 100) && v.title.length >= 1 && (v.title.length >= 2 || Z2sc5xQPKB(v.title) >= 1) && typeof v.brand === "string" && (v.brand.length <= 30 || v.brand.length <= 60 && Z2sc5xQPKB(v.brand) <= 30) && v.brand.length >= 1 && (v.brand.length >= 2 || Z2sc5xQPKB(v.brand) >= 1) && typeof v.description === "string" && (v.description.length <= 500 || v.description.length <= 1e3 && Z2sc5xQPKB(v.description) <= 500) && v.description.length >= 1 && (v.description.length >= 2 || Z2sc5xQPKB(v.description) >= 1) && typeof v.price === "number" && v.price <= 1e4 && v.price >= 1 && (v.discount === null || typeof v.discount === "number" && v.discount <= 100 && v.discount >= 1) && typeof v.quantity === "number" && v.quantity <= 10 && v.quantity >= 0 && ctxFn0(v) && ctxFn1(v) && ctxFn3(v);
		}
		return WOvb_YYm3EVP;
	}
];
// ../schemas/.mion/types/WOvb_AmSAoGY.js
const __rt_WOvb_AmSAoGY = [
	"val",
	,
	,
	"WOvb_AmSAoGY",
	"union",
	,
	,
	,
	,
	function g_WOvb_AmSAoGY(utl) {
		function WOvb_AmSAoGY(v) {
			return v === null || typeof v === "number" && v <= 100 && v >= 1;
		}
		return WOvb_AmSAoGY;
	}
];
// ../schemas/.mion/types/WOvb_yXYPzAs.js
const __rt_WOvb_yXYPzAs = [
	"val",
	,
	,
	"WOvb_yXYPzAs",
	"union",
	,
	,
	,
	,
	function g_WOvb_yXYPzAs(utl) {
		function WOvb_yXYPzAs(v) {
			return v === "jpg" || v === "png";
		}
		return WOvb_yXYPzAs;
	}
];
// ../schemas/.mion/types/pf/_rt/_abcB3do2M.js
const __rt_pf$2F_rt$2F_abcB3do2M = [
	2,
	,
	,
	"_rt:_abcB3do2M",
	[],
	,
	[],
	function() {
		return function _err(pλth, εrr, expected, accessPath) {
			const runTypeErr = {
				expected,
				path: accessPath === void 0 ? pλth.slice() : pλth.length === 0 ? accessPath : pλth.concat(accessPath)
			};
			εrr.push(runTypeErr);
		};
	}
];
// ../schemas/.mion/types/aZak_YYm3EVP.js
const __rt_aZak_YYm3EVP = [
	"verr",
	() => [
		__rt_WOvb_AmSAoGY,
		__rt_WOvb_yXYPzAs,
		__rt_pf$2F_rt$2FZ2sc5xQPKB,
		__rt_pf$2F_rt$2F_abcB3do2M
	],
	,
	"aZak_YYm3EVP",
	"objectLiteral",
	,
	,
	,
	["_rt:_abcB3do2M", "_rt:Z2sc5xQPKB"],
	function g_aZak_YYm3EVP(utl) {
		const nRT = utl.getPureFn("_rt:_abcB3do2M");
		const Z2sc5xQPKB = utl.getPureFn("_rt:Z2sc5xQPKB");
		const WOvb_AmSAoGY = utl.getRT("WOvb_AmSAoGY");
		const WOvb_yXYPzAs = utl.getRT("WOvb_yXYPzAs");
		const reFmt0 = /* @__PURE__ */ new RegExp("^(?:https?|ftps?|wss?):\\/\\/[^\\s/$.?#-][^\\s]*$", "i");
		const reFmt1 = /* @__PURE__ */ new RegExp("^(?:https?|ftps?|wss?):\\/\\/[^\\s/$.?#-][^\\s]*$", "i");
		function aZak_YYm3EVP(v, pth = [], er = []) {
			if (!(typeof v === "object" && v !== null)) nRT(pth, er, "objectLiteral");
			else {
				if (!(typeof v.id === "number")) nRT(pth, er, "number", ["id"]);
				if (!(v.created instanceof Date) || isNaN(v.created.getTime())) nRT(pth, er, "date", ["created"]);
				if (typeof v.title !== "string") nRT(pth, er, "string", ["title"]);
				if (typeof v.title === "string") {
					pth.push("title");
					if (v.title.length > 100 && (v.title.length > 200 || Z2sc5xQPKB(v.title) > 100)) er.push({
						expected: "string",
						path: pth.slice(),
						format: {
							name: "stringFormat",
							formatPath: ["maxLength"],
							val: 100
						}
					});
					if (v.title.length < 1 || v.title.length < 2 && Z2sc5xQPKB(v.title) < 1) er.push({
						expected: "string",
						path: pth.slice(),
						format: {
							name: "stringFormat",
							formatPath: ["minLength"],
							val: 1
						}
					});
					pth.pop();
				}
				if (typeof v.brand !== "string") nRT(pth, er, "string", ["brand"]);
				if (typeof v.brand === "string") {
					pth.push("brand");
					if (v.brand.length > 30 && (v.brand.length > 60 || Z2sc5xQPKB(v.brand) > 30)) er.push({
						expected: "string",
						path: pth.slice(),
						format: {
							name: "stringFormat",
							formatPath: ["maxLength"],
							val: 30
						}
					});
					if (v.brand.length < 1 || v.brand.length < 2 && Z2sc5xQPKB(v.brand) < 1) er.push({
						expected: "string",
						path: pth.slice(),
						format: {
							name: "stringFormat",
							formatPath: ["minLength"],
							val: 1
						}
					});
					pth.pop();
				}
				if (typeof v.description !== "string") nRT(pth, er, "string", ["description"]);
				if (typeof v.description === "string") {
					pth.push("description");
					if (v.description.length > 500 && (v.description.length > 1e3 || Z2sc5xQPKB(v.description) > 500)) er.push({
						expected: "string",
						path: pth.slice(),
						format: {
							name: "stringFormat",
							formatPath: ["maxLength"],
							val: 500
						}
					});
					if (v.description.length < 1 || v.description.length < 2 && Z2sc5xQPKB(v.description) < 1) er.push({
						expected: "string",
						path: pth.slice(),
						format: {
							name: "stringFormat",
							formatPath: ["minLength"],
							val: 1
						}
					});
					pth.pop();
				}
				if (!(typeof v.price === "number")) nRT(pth, er, "number", ["price"]);
				if (typeof v.price === "number") {
					pth.push("price");
					if (v.price > 1e4) er.push({
						expected: "number",
						path: pth.slice(),
						format: {
							name: "numberFormat",
							formatPath: ["max"],
							val: 1e4
						}
					});
					if (v.price < 1) er.push({
						expected: "number",
						path: pth.slice(),
						format: {
							name: "numberFormat",
							formatPath: ["min"],
							val: 1
						}
					});
					pth.pop();
				}
				if (!WOvb_AmSAoGY.fn(v.discount)) nRT(pth, er, "union", ["discount"]);
				if (!(typeof v.quantity === "number")) nRT(pth, er, "number", ["quantity"]);
				if (typeof v.quantity === "number") {
					pth.push("quantity");
					if (v.quantity > 10) er.push({
						expected: "number",
						path: pth.slice(),
						format: {
							name: "numberFormat",
							formatPath: ["max"],
							val: 10
						}
					});
					if (v.quantity < 0) er.push({
						expected: "number",
						path: pth.slice(),
						format: {
							name: "numberFormat",
							formatPath: ["min"],
							val: 0
						}
					});
					pth.pop();
				}
				if (!Array.isArray(v.tags)) nRT(pth, er, "array", ["tags"]);
				else for (let i0 = 0; i0 < v.tags.length; i0++) {
					if (typeof v.tags[i0] !== "string") nRT(pth, er, "string", ["tags", i0]);
					if (typeof v.tags[i0] === "string") {
						pth.push("tags", i0);
						if (v.tags[i0].length > 30 && (v.tags[i0].length > 60 || Z2sc5xQPKB(v.tags[i0]) > 30)) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "stringFormat",
								formatPath: ["maxLength"],
								val: 30
							}
						});
						if (v.tags[i0].length < 1 || v.tags[i0].length < 2 && Z2sc5xQPKB(v.tags[i0]) < 1) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "stringFormat",
								formatPath: ["minLength"],
								val: 1
							}
						});
						pth.pop();
						pth.pop();
					}
				}
				if (!Array.isArray(v.images)) nRT(pth, er, "array", ["images"]);
				else for (let i1 = 0; i1 < v.images.length; i1++) if (!(typeof v.images[i1] === "object" && v.images[i1] !== null)) nRT(pth, er, "objectLiteral", ["images", i1]);
				else {
					if (!(typeof v.images[i1].id === "number")) nRT(pth, er, "number", [
						"images",
						i1,
						"id"
					]);
					if (!(v.images[i1].created instanceof Date) || isNaN(v.images[i1].created.getTime())) nRT(pth, er, "date", [
						"images",
						i1,
						"created"
					]);
					if (typeof v.images[i1].title !== "string") nRT(pth, er, "string", [
						"images",
						i1,
						"title"
					]);
					if (typeof v.images[i1].title === "string") {
						pth.push("images", i1, "title");
						if (v.images[i1].title.length > 100 && (v.images[i1].title.length > 200 || Z2sc5xQPKB(v.images[i1].title) > 100)) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "stringFormat",
								formatPath: ["maxLength"],
								val: 100
							}
						});
						if (v.images[i1].title.length < 1 || v.images[i1].title.length < 2 && Z2sc5xQPKB(v.images[i1].title) < 1) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "stringFormat",
								formatPath: ["minLength"],
								val: 1
							}
						});
						pth.pop();
						pth.pop();
						pth.pop();
					}
					if (!WOvb_yXYPzAs.fn(v.images[i1].type)) nRT(pth, er, "union", [
						"images",
						i1,
						"type"
					]);
					if (!(typeof v.images[i1].size === "number")) nRT(pth, er, "number", [
						"images",
						i1,
						"size"
					]);
					if (typeof v.images[i1].url !== "string") nRT(pth, er, "string", [
						"images",
						i1,
						"url"
					]);
					if (typeof v.images[i1].url === "string") {
						pth.push("images", i1, "url");
						if (v.images[i1].url.length > 2048 && (v.images[i1].url.length > 4096 || Z2sc5xQPKB(v.images[i1].url) > 2048)) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "url",
								formatPath: ["maxLength"],
								val: 2048
							}
						});
						if (!reFmt0.test(v.images[i1].url)) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "url",
								formatPath: ["pattern"],
								val: "pattern"
							}
						});
						pth.pop();
						pth.pop();
						pth.pop();
					}
				}
				if (!Array.isArray(v.ratings)) nRT(pth, er, "array", ["ratings"]);
				else for (let i2 = 0; i2 < v.ratings.length; i2++) if (!(typeof v.ratings[i2] === "object" && v.ratings[i2] !== null)) nRT(pth, er, "objectLiteral", ["ratings", i2]);
				else {
					if (!(typeof v.ratings[i2].id === "number")) nRT(pth, er, "number", [
						"ratings",
						i2,
						"id"
					]);
					if (!(typeof v.ratings[i2].stars === "number")) nRT(pth, er, "number", [
						"ratings",
						i2,
						"stars"
					]);
					if (typeof v.ratings[i2].stars === "number") {
						pth.push("ratings", i2, "stars");
						if (v.ratings[i2].stars > 5) er.push({
							expected: "number",
							path: pth.slice(),
							format: {
								name: "numberFormat",
								formatPath: ["max"],
								val: 5
							}
						});
						if (v.ratings[i2].stars < 1) er.push({
							expected: "number",
							path: pth.slice(),
							format: {
								name: "numberFormat",
								formatPath: ["min"],
								val: 1
							}
						});
						pth.pop();
						pth.pop();
						pth.pop();
					}
					if (typeof v.ratings[i2].title !== "string") nRT(pth, er, "string", [
						"ratings",
						i2,
						"title"
					]);
					if (typeof v.ratings[i2].title === "string") {
						pth.push("ratings", i2, "title");
						if (v.ratings[i2].title.length > 100 && (v.ratings[i2].title.length > 200 || Z2sc5xQPKB(v.ratings[i2].title) > 100)) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "stringFormat",
								formatPath: ["maxLength"],
								val: 100
							}
						});
						if (v.ratings[i2].title.length < 1 || v.ratings[i2].title.length < 2 && Z2sc5xQPKB(v.ratings[i2].title) < 1) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "stringFormat",
								formatPath: ["minLength"],
								val: 1
							}
						});
						pth.pop();
						pth.pop();
						pth.pop();
					}
					if (typeof v.ratings[i2].text !== "string") nRT(pth, er, "string", [
						"ratings",
						i2,
						"text"
					]);
					if (typeof v.ratings[i2].text === "string") {
						pth.push("ratings", i2, "text");
						if (v.ratings[i2].text.length > 1e3 && (v.ratings[i2].text.length > 2e3 || Z2sc5xQPKB(v.ratings[i2].text) > 1e3)) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "stringFormat",
								formatPath: ["maxLength"],
								val: 1e3
							}
						});
						if (v.ratings[i2].text.length < 1 || v.ratings[i2].text.length < 2 && Z2sc5xQPKB(v.ratings[i2].text) < 1) er.push({
							expected: "string",
							path: pth.slice(),
							format: {
								name: "stringFormat",
								formatPath: ["minLength"],
								val: 1
							}
						});
						pth.pop();
						pth.pop();
						pth.pop();
					}
					if (!Array.isArray(v.ratings[i2].images)) nRT(pth, er, "array", [
						"ratings",
						i2,
						"images"
					]);
					else for (let i3 = 0; i3 < v.ratings[i2].images.length; i3++) if (!(typeof v.ratings[i2].images[i3] === "object" && v.ratings[i2].images[i3] !== null)) nRT(pth, er, "objectLiteral", [
						"ratings",
						i2,
						"images",
						i3
					]);
					else {
						if (!(typeof v.ratings[i2].images[i3].id === "number")) nRT(pth, er, "number", [
							"ratings",
							i2,
							"images",
							i3,
							"id"
						]);
						if (!(v.ratings[i2].images[i3].created instanceof Date) || isNaN(v.ratings[i2].images[i3].created.getTime())) nRT(pth, er, "date", [
							"ratings",
							i2,
							"images",
							i3,
							"created"
						]);
						if (typeof v.ratings[i2].images[i3].title !== "string") nRT(pth, er, "string", [
							"ratings",
							i2,
							"images",
							i3,
							"title"
						]);
						if (typeof v.ratings[i2].images[i3].title === "string") {
							pth.push("ratings", i2, "images", i3, "title");
							if (v.ratings[i2].images[i3].title.length > 100 && (v.ratings[i2].images[i3].title.length > 200 || Z2sc5xQPKB(v.ratings[i2].images[i3].title) > 100)) er.push({
								expected: "string",
								path: pth.slice(),
								format: {
									name: "stringFormat",
									formatPath: ["maxLength"],
									val: 100
								}
							});
							if (v.ratings[i2].images[i3].title.length < 1 || v.ratings[i2].images[i3].title.length < 2 && Z2sc5xQPKB(v.ratings[i2].images[i3].title) < 1) er.push({
								expected: "string",
								path: pth.slice(),
								format: {
									name: "stringFormat",
									formatPath: ["minLength"],
									val: 1
								}
							});
							pth.pop();
							pth.pop();
							pth.pop();
							pth.pop();
							pth.pop();
						}
						if (!WOvb_yXYPzAs.fn(v.ratings[i2].images[i3].type)) nRT(pth, er, "union", [
							"ratings",
							i2,
							"images",
							i3,
							"type"
						]);
						if (!(typeof v.ratings[i2].images[i3].size === "number")) nRT(pth, er, "number", [
							"ratings",
							i2,
							"images",
							i3,
							"size"
						]);
						if (typeof v.ratings[i2].images[i3].url !== "string") nRT(pth, er, "string", [
							"ratings",
							i2,
							"images",
							i3,
							"url"
						]);
						if (typeof v.ratings[i2].images[i3].url === "string") {
							pth.push("ratings", i2, "images", i3, "url");
							if (v.ratings[i2].images[i3].url.length > 2048 && (v.ratings[i2].images[i3].url.length > 4096 || Z2sc5xQPKB(v.ratings[i2].images[i3].url) > 2048)) er.push({
								expected: "string",
								path: pth.slice(),
								format: {
									name: "url",
									formatPath: ["maxLength"],
									val: 2048
								}
							});
							if (!reFmt1.test(v.ratings[i2].images[i3].url)) er.push({
								expected: "string",
								path: pth.slice(),
								format: {
									name: "url",
									formatPath: ["pattern"],
									val: "pattern"
								}
							});
							pth.pop();
							pth.pop();
							pth.pop();
							pth.pop();
							pth.pop();
						}
					}
				}
			}
			return er;
		}
		return aZak_YYm3EVP;
	}
];
// ../node_modules/.pnpm/@mionjs+run-types@0.14.0/node_modules/@mionjs/run-types/dist/runtypes/classSerializerRegistry.js
const classSerializers = /* @__PURE__ */ new Map();
const classSerializersByName = /* @__PURE__ */ new Map();
let epoch = 0;
function classSerializerEpoch() {
	return epoch;
}
function getClassSerializer(typeId, className) {
	const exact = classSerializers.get(typeId);
	if (exact) return exact;
	if (!className) return void 0;
	const entries = classSerializersByName.get(className);
	if (!entries || entries.size !== 1) return void 0;
	return entries.values().next().value;
}
function deserializeClass(entry, data, keys) {
	if (entry.deserialize) return entry.deserialize(data);
	let instance;
	try {
		instance = new entry.cls();
	} catch (err) {
		const original = err instanceof Error ? err.message : String(err);
		const name = entry.cls.name || "<anonymous>";
		throw new Error(`[data-class-constructor-failed] Cannot reconstruct class "${name}": the automatic \`new ${name}()\` failed, so its constructor needs arguments. Register a \`deserialize\` handler: registerClassSerializer(${name}, {deserialize: (data) => new ${name}(/* … */)}). Original error: ${original}`);
	}
	const source = data;
	const target = instance;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = source[key];
		if (value !== void 0) target[key] = value;
	}
	return instance;
}
// ../node_modules/.pnpm/@mionjs+run-types@0.14.0/node_modules/@mionjs/run-types/dist/runtypes/circular.js
var CircularReferenceError = class extends Error {
	path;
	constructor(path) {
		super(`Circular reference detected at ${formatCircularPath(path)}`);
		this.name = "CircularReferenceError";
		this.path = path;
	}
};
function formatCircularPath(path) {
	if (path.length === 0) return "<root>";
	let out = "";
	for (const segment of path) if (typeof segment === "number") out += `[${segment}]`;
	else out += out ? `.${segment}` : segment;
	return out;
}
// ../node_modules/.pnpm/@mionjs+run-types@0.14.0/node_modules/@mionjs/run-types/dist/runtypes/rtUtils.js
function isRunTypeValue(val) {
	return typeof val === "object" && val !== null && typeof val.id === "string" && "kind" in val;
}
const rtFnsCache = {};
const pureFnsCache = {};
const runTypesCache = {};
const findRTForTypeMemo = /* @__PURE__ */ new Map();
const rtUtils = {
	addToRTCache(comp) {
		rtFnsCache[comp.rtFnHash] = comp;
		findRTForTypeMemo.clear();
	},
	removeFromRTCache(comp) {
		if (!rtFnsCache[comp.rtFnHash]) return;
		rtFnsCache[comp.rtFnHash] = void 0;
		findRTForTypeMemo.clear();
	},
	getRT(rtFnHash) {
		const entry = rtFnsCache[rtFnHash];
		if (!entry) return void 0;
		materializeRTFn(entry);
		return entry;
	},
	findRTForType(familyTag, typeId) {
		const memoKey = familyTag + "\0" + typeId;
		const hit = findRTForTypeMemo.get(memoKey);
		if (hit !== void 0) {
			if (hit === null) return void 0;
			materializeRTFn(hit);
			return hit;
		}
		const suffix = "_" + typeId;
		for (const key of Object.keys(rtFnsCache)) {
			if (!key.endsWith(suffix)) continue;
			const entry = rtFnsCache[key];
			if (!entry || entry.familyTag !== familyTag) continue;
			materializeRTFn(entry);
			findRTForTypeMemo.set(memoKey, entry);
			return entry;
		}
		findRTForTypeMemo.set(memoKey, null);
	},
	getRTFn(rtFnHash) {
		const entry = rtFnsCache[rtFnHash];
		if (!entry) throw new Error(`RT function not found for rtFnHash ${rtFnHash}`);
		materializeRTFn(entry);
		return entry.fn;
	},
	hasRTFn(rtFnHash) {
		return !!rtFnsCache[rtFnHash];
	},
	addPureFn(id, compiledFn) {
		if (!id) throw new Error("Pure function id must be a non-empty string");
		const key = id;
		const existing = pureFnsCache[key];
		if (existing) return existing;
		pureFnsCache[key] = compiledFn;
		return compiledFn;
	},
	usePureFn(key) {
		const compiled = pureFnsCache[key];
		if (!compiled) throw new Error(`Pure function not found for key "${key}"`);
		initPureFunction(compiled);
		return compiled.fn;
	},
	getPureFn(key) {
		const compiled = pureFnsCache[key];
		if (!compiled) return;
		initPureFunction(compiled);
		return compiled.fn;
	},
	getCompiledPureFn(key) {
		return pureFnsCache[key];
	},
	hasPureFn(key) {
		return !!pureFnsCache[key];
	},
	getPureFnByKey(key) {
		const compiled = pureFnsCache[key];
		if (!compiled) return;
		initPureFunction(compiled);
		return compiled.fn;
	},
	hasPureFnByKey(key) {
		return !!pureFnsCache[key];
	},
	getCompiledPureFnByKey(key) {
		return pureFnsCache[key];
	},
	addRunType(id, runType) {
		if (!id) throw new Error("Run-type id must be a non-empty string");
		runTypesCache[id] = runType;
		return runType;
	},
	removeRunType(id) {
		if (!runTypesCache[id]) return;
		runTypesCache[id] = void 0;
	},
	getRunType(id) {
		return runTypesCache[id];
	},
	useRunType(id) {
		const rt = runTypesCache[id];
		if (!rt) throw new Error(`Run-type not found for id "${id}"`);
		return rt;
	},
	hasRunType(id) {
		return !!runTypesCache[id];
	},
	knowsType(typeId) {
		if (runTypesCache[typeId]) return true;
		const suffix = "_" + typeId;
		for (const key of Object.keys(rtFnsCache)) if (key.endsWith(suffix) && rtFnsCache[key]) return true;
		return false;
	},
	alwaysThrowFactory(message) {
		return () => {
			throw new Error(message);
		};
	},
	circularError(path) {
		return new CircularReferenceError(path);
	},
	getClassSerializer(typeId, className) {
		return getClassSerializer(typeId, className);
	},
	csEpoch() {
		return classSerializerEpoch();
	},
	deserializeClass(entry, data, keys) {
		return deserializeClass(entry, data, keys);
	}
};
function getRTUtils() {
	return rtUtils;
}
function getRTFnCaches() {
	return {
		rtFnsCache,
		pureFnsCache
	};
}
function initPureFunction(compiled) {
	if (compiled.fn) return;
	let factory = compiled.createPureFn;
	if (!factory) {
		factory = buildOrNameEntry(() => buildPureFnFactoryFromCode(compiled.paramNames, compiled.code ?? ""), `pure fn "${compiled.id}"`);
		compiled.createPureFn = factory;
	}
	compiled.fn = factory(rtUtils);
}
function buildPureFnFactoryFromCode(paramNames, code) {
	return new Function(...paramNames, `'use strict'; ${code}`);
}
function buildOrNameEntry(build, label) {
	try {
		return build();
	} catch (error) {
		if (!(error instanceof EvalError)) throw error;
		throw new Error(`${error.message}: ${label} has no live function, only a code string. Generated modules built with emitMode 'code' (your app's or a dependency's) ship it that way: search the bundle for that id.`, { cause: error });
	}
}
function buildFactoryFromCode(code) {
	return new Function("utl", `'use strict'; ${code}`);
}
function entryCode(entry) {
	if (entry.code !== void 0) return entry.code;
	if (entry.createRTFn) {
		const src = entry.createRTFn.toString();
		const open = src.indexOf("{");
		const close = src.lastIndexOf("}");
		const derived = open >= 0 && close > open ? src.slice(open + 1, close) : "";
		entry.code = derived;
		return derived;
	}
	return "";
}
const materializing = /* @__PURE__ */ new Set();
function materializeRTFn(entry) {
	if (entry.fn) return;
	if (materializing.has(entry.rtFnHash)) return;
	if (!entry.createRTFn && !entry.code) return;
	materializing.add(entry.rtFnHash);
	try {
		if (!entry.createRTFn) entry.createRTFn = buildOrNameEntry(() => buildFactoryFromCode(entryCode(entry)), `compiled fn "${entry.rtFnHash}" (${entry.typeName})`);
		entry.fn = entry.createRTFn(rtUtils);
	} finally {
		materializing.delete(entry.rtFnHash);
	}
}
// ../node_modules/.pnpm/@mionjs+run-types@0.14.0/node_modules/@mionjs/run-types/dist/runtypes/entryTuple.js
const KIND_RUN_TYPE = 0;
const KIND_PURE_FN = 2;
const KIND_MISSING = 3;
const KIND_RUN_TYPE_BUNDLE = 4;
const KIND_RUN_TYPE_FACADE = 5;
const RUN_TYPE_FIELD_KEYS = [
	"id",
	"kind",
	"subKind",
	"typeName",
	"name",
	"literal",
	"optional",
	"readonly",
	"isAbstract",
	"isStatic",
	"visibility",
	"isSafeName",
	"position",
	"isCircular",
	"flags",
	"description",
	"defaultVal",
	"enumVal",
	"values",
	"notSupported",
	"nonEnumerable",
	"jsonMaxBytes"
];
const RUN_TYPE_REL_KEYS = [
	"child",
	"children",
	"index",
	"return",
	"indexType",
	"parameters",
	"safeUnionChildren",
	"unionDiscriminators",
	"typeMeta",
	"typeArguments",
	"arguments",
	"extendsArguments",
	"implements",
	"extends"
];
const RUN_TYPE_REL_IS_ARRAY = [
	false,
	true,
	false,
	false,
	false,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true,
	true
];
const ENTRY_HEAD_KEYS = [
	"entryKind",
	"deps",
	"ini"
];
const RUN_TYPE_TUPLE_KEYS = [...ENTRY_HEAD_KEYS, ...RUN_TYPE_FIELD_KEYS];
const RUN_TYPE_BUNDLE_TUPLE_KEYS = [
	...ENTRY_HEAD_KEYS,
	"key",
	"rows",
	"rels"
];
const RUN_TYPE_FACADE_TUPLE_KEYS = [...ENTRY_HEAD_KEYS, "key"];
const FN_TYPE_REQUIRED_KEYS = [
	"familyTag",
	"deps",
	"ini",
	"rtFnHash",
	"typeName"
];
const FN_TYPE_TRIMMED_KEYS = [
	"code",
	"isNoop",
	"rtDependencies",
	"pureFnDependencies",
	"createRTFn",
	"alwaysThrowMessage"
];
const FN_TYPE_TUPLE_KEYS = [...FN_TYPE_REQUIRED_KEYS, ...FN_TYPE_TRIMMED_KEYS];
const PURE_FN_REQUIRED_KEYS = [
	...ENTRY_HEAD_KEYS,
	"key",
	"paramNames",
	"code",
	"pureFnDependencies"
];
const PURE_FN_TRIMMED_KEYS = ["createPureFn"];
const PURE_FN_TUPLE_KEYS = [...PURE_FN_REQUIRED_KEYS, ...PURE_FN_TRIMMED_KEYS];
const MISSING_TUPLE_KEYS = [...ENTRY_HEAD_KEYS, "key"];
const SLOT_KIND = 0;
const SLOT_DEPS = 1;
const SLOT_KEY = 3;
const SLOT_ROWS = 4;
const SLOT_RELS = 5;
RUN_TYPE_BUNDLE_TUPLE_KEYS[SLOT_RELS];
RUN_TYPE_BUNDLE_TUPLE_KEYS[SLOT_KIND], RUN_TYPE_BUNDLE_TUPLE_KEYS[SLOT_DEPS], RUN_TYPE_BUNDLE_TUPLE_KEYS[2], RUN_TYPE_BUNDLE_TUPLE_KEYS[SLOT_KEY], RUN_TYPE_BUNDLE_TUPLE_KEYS[SLOT_ROWS];
RUN_TYPE_FACADE_TUPLE_KEYS[SLOT_KIND], RUN_TYPE_FACADE_TUPLE_KEYS[SLOT_DEPS], RUN_TYPE_FACADE_TUPLE_KEYS[2], RUN_TYPE_FACADE_TUPLE_KEYS[SLOT_KEY];
FN_TYPE_TUPLE_KEYS[SLOT_KIND], FN_TYPE_TUPLE_KEYS[SLOT_DEPS], FN_TYPE_TUPLE_KEYS[2], FN_TYPE_TUPLE_KEYS[SLOT_KEY];
PURE_FN_TUPLE_KEYS[SLOT_KIND], PURE_FN_TUPLE_KEYS[SLOT_DEPS], PURE_FN_TUPLE_KEYS[2], PURE_FN_TUPLE_KEYS[SLOT_KEY];
MISSING_TUPLE_KEYS[SLOT_KIND], MISSING_TUPLE_KEYS[SLOT_DEPS], MISSING_TUPLE_KEYS[2], MISSING_TUPLE_KEYS[SLOT_KEY];
function tupleToRecord(keys, tuple) {
	const record = {};
	for (let index = 0; index < keys.length; index++) record[keys[index]] = tuple[index];
	return record;
}
function isEntryTuple(value) {
	if (isMissingTuple(value)) return true;
	if (!Array.isArray(value) || value.length <= SLOT_KEY) return false;
	const deps = value[SLOT_DEPS];
	return (typeof deps === "function" || deps === void 0) && typeof value[SLOT_KEY] === "string";
}
function entryTupleKey(tuple) {
	return tuple[SLOT_KEY];
}
function isMissingTuple(value) {
	return Array.isArray(value) && value[SLOT_KIND] === KIND_MISSING;
}
const noopTrue = () => true;
const noopIdentity = (v) => v;
const noopErrors = (_v, _pth, er) => er || [];
const noopStringify = (v) => JSON.stringify(v);
const noopParse = (s) => JSON.parse(s);
const valueArgs = () => ({ vλl: "v" });
const valueDefaults = () => ({ vλl: "" });
const errorArgs = () => ({
	vλl: "v",
	pλth: "pth",
	εrr: "er"
});
const errorDefaults = () => ({
	vλl: "",
	pλth: "[]",
	εrr: "[]"
});
const valueShaped = (fnID, noop) => ({
	fnID,
	args: valueArgs,
	defaultParamValues: valueDefaults,
	noop
});
const errorShaped = (fnID) => ({
	fnID,
	args: errorArgs,
	defaultParamValues: errorDefaults,
	noop: noopErrors
});
const familyMeta = {
	val: valueShaped("val", noopTrue),
	verr: errorShaped("verr"),
	vst: valueShaped("vst", noopTrue),
	vest: errorShaped("vest"),
	vuk: valueShaped("vuk", noopTrue),
	veuk: errorShaped("veuk"),
	pj: valueShaped("pj", noopIdentity),
	rj: valueShaped("rj", noopIdentity),
	pjs: valueShaped("pjs", noopIdentity),
	cj: valueShaped("cj", noopIdentity),
	cjr: valueShaped("cjr", noopIdentity),
	rjs: valueShaped("rjs", noopIdentity),
	ruk: valueShaped("ruk", noopIdentity),
	ruks: valueShaped("ruks", noopIdentity),
	rukr: valueShaped("rukr", noopIdentity),
	csr: valueShaped("csr", noopIdentity),
	fmt: valueShaped("fmt", noopIdentity),
	jsc: valueShaped("jsc", () => ({})),
	jeCL: valueShaped("pj", noopStringify),
	jeMU: valueShaped("pj", noopStringify),
	jeCO: valueShaped("pj", noopStringify),
	jdCL: valueShaped("rj", noopParse),
	jdMU: valueShaped("rj", noopParse),
	jdCO: valueShaped("rj", noopParse)
};
const processedKeys = /* @__PURE__ */ new Set();
function initFromTuple(root) {
	if (isMissingTuple(root)) return;
	if (!isEntryTuple(root)) return;
	const utils = getRTUtils();
	const fresh = [];
	collectClosure(root, utils, fresh, /* @__PURE__ */ new Set());
	for (const tuple of fresh) {
		if (tuple[SLOT_KIND] === KIND_RUN_TYPE_BUNDLE) wireBundleRelations(utils, tuple);
		const ini = tuple[2];
		if (typeof ini === "function") ini(utils);
	}
}
function wireBundleRelations(utils, tuple) {
	const rows = tuple[SLOT_ROWS] ?? [];
	const rels = tuple[SLOT_RELS] ?? [];
	const added = addedRows.get(tuple);
	if (rels.length === 0 || !added) return;
	const byIndex = rows.map((row) => utils.getRunType(row[0]));
	const resolve = (rel) => typeof rel === "number" ? byIndex[rel] : typeof rel === "string" ? utils.getRunType(rel) : rel;
	for (const i of added) {
		const relRow = rels[i];
		if (!relRow) continue;
		const runType = byIndex[i];
		if (!runType) continue;
		const target = runType;
		for (let slot = 0; slot < RUN_TYPE_REL_KEYS.length; slot++) {
			const value = relRow[slot];
			if (value === void 0) continue;
			target[RUN_TYPE_REL_KEYS[slot]] = RUN_TYPE_REL_IS_ARRAY[slot] ? value.map(resolve) : resolve(value);
		}
	}
}
function collectClosure(tuple, utils, fresh, visiting) {
	if (!isEntryTuple(tuple) || isMissingTuple(tuple)) return;
	const key = entryTupleKey(tuple);
	if (visiting.has(key)) return;
	visiting.add(key);
	const deps = tuple[SLOT_DEPS];
	if (processedKeys.has(key) && isStillRegistered(utils, tuple)) {
		if (fillLiveFactory(utils, tuple, key) && deps) for (const dep of deps()) collectClosure(dep, utils, fresh, visiting);
		return;
	}
	processedKeys.add(key);
	if (deps) for (const dep of deps()) collectClosure(dep, utils, fresh, visiting);
	if (registerTuple(utils, tuple)) fresh.push(tuple);
	else fillLiveFactory(utils, tuple, key);
}
const CREATE_RT_FN_SLOT = FN_TYPE_TUPLE_KEYS.indexOf("createRTFn");
const CREATE_PURE_FN_SLOT = PURE_FN_TUPLE_KEYS.indexOf("createPureFn");
function fillLiveFactory(utils, tuple, key) {
	const slot0 = tuple[SLOT_KIND];
	if (typeof slot0 === "string") {
		const createRTFn = tuple[CREATE_RT_FN_SLOT];
		const existing = getRTFnCaches().rtFnsCache[key];
		if (!createRTFn || !existing || existing.fn || existing.createRTFn) return false;
		existing.createRTFn = createRTFn;
		return true;
	}
	if (slot0 !== KIND_PURE_FN) return false;
	const createPureFn = tuple[CREATE_PURE_FN_SLOT];
	const existing = utils.getCompiledPureFnByKey(key);
	if (!createPureFn || !existing || existing.fn || existing.createPureFn) return false;
	existing.createPureFn = createPureFn;
	return true;
}
function isStillRegistered(utils, tuple) {
	const slot0 = tuple[SLOT_KIND];
	const key = entryTupleKey(tuple);
	if (typeof slot0 === "string") return utils.hasRTFn(key);
	if (slot0 === KIND_RUN_TYPE) return utils.hasRunType(key);
	if (slot0 === KIND_PURE_FN) return utils.hasPureFnByKey(key);
	if (slot0 === KIND_RUN_TYPE_BUNDLE) {
		const rows = tuple[SLOT_ROWS] ?? [];
		return rows.length === 0 || utils.hasRunType(rows[0][0]);
	}
	return true;
}
function registerTuple(utils, tuple) {
	const slot0 = tuple[SLOT_KIND];
	if (typeof slot0 === "string") return registerTypeFnTuple(utils, tuple);
	if (slot0 === KIND_RUN_TYPE_BUNDLE) return registerRunTypeBundle(utils, tuple);
	if (slot0 === KIND_RUN_TYPE) return registerRunTypeTuple(utils, tuple);
	if (slot0 === KIND_PURE_FN) return registerPureFnTuple(utils, tuple);
	if (slot0 === KIND_RUN_TYPE_FACADE) return false;
	return false;
}
function runTypeEntryFromRecord(record) {
	return {
		...record,
		child: void 0,
		index: void 0,
		return: void 0,
		indexType: void 0,
		parameters: void 0,
		children: void 0,
		safeUnionChildren: void 0,
		unionDiscriminators: void 0,
		typeMeta: void 0,
		typeArguments: void 0,
		arguments: void 0,
		extendsArguments: void 0,
		implements: void 0,
		extends: void 0,
		classType: void 0
	};
}
function registerRunTypeTuple(utils, tuple) {
	const record = tupleToRecord(RUN_TYPE_TUPLE_KEYS, tuple);
	if (utils.hasRunType(record.id)) return false;
	utils.addRunType(record.id, runTypeEntryFromRecord(record));
	return true;
}
const addedRows = /* @__PURE__ */ new WeakMap();
function registerRunTypeBundle(utils, tuple) {
	const rows = tuple[SLOT_ROWS] ?? [];
	const added = [];
	rows.forEach((row, index) => {
		const record = tupleToRecord(RUN_TYPE_FIELD_KEYS, row);
		const existing = utils.getRunType(record.id);
		if (!existing) {
			utils.addRunType(record.id, runTypeEntryFromRecord(record));
			added.push(index);
		} else if (existing.jsonMaxBytes === void 0 && record.jsonMaxBytes !== void 0) existing.jsonMaxBytes = record.jsonMaxBytes;
	});
	if (added.length) addedRows.set(tuple, added);
	return added.length > 0;
}
function registerTypeFnTuple(utils, tuple) {
	const record = tupleToRecord(FN_TYPE_TUPLE_KEYS, tuple);
	if (utils.hasRTFn(record.rtFnHash)) return false;
	const meta = familyMeta[record.familyTag];
	if (!meta) return false;
	const isNoop = record.isNoop === true;
	const entry = {
		rtFnHash: record.rtFnHash,
		fnID: meta.fnID,
		familyTag: record.familyTag,
		typeName: record.typeName,
		args: meta.args(),
		defaultParamValues: meta.defaultParamValues(),
		code: record.code,
		isNoop,
		rtDependencies: record.rtDependencies,
		pureFnDependencies: record.pureFnDependencies,
		createRTFn: record.alwaysThrowMessage !== void 0 ? utils.alwaysThrowFactory(record.alwaysThrowMessage) : record.createRTFn,
		fn: isNoop ? meta.noop : void 0,
		alwaysThrowMessage: record.alwaysThrowMessage
	};
	utils.addToRTCache(entry);
	return true;
}
function registerPureFnTuple(utils, tuple) {
	const record = tupleToRecord(PURE_FN_TUPLE_KEYS, tuple);
	if (utils.hasPureFnByKey(record.key)) return false;
	const entry = {
		id: record.key,
		paramNames: record.paramNames,
		code: record.code,
		pureFnDependencies: record.pureFnDependencies,
		createPureFn: record.createPureFn,
		fn: void 0
	};
	utils.addPureFn(record.key, entry);
	return true;
}
function resolveEntryTupleFn(fnName, identityFn, runTypeId, injected) {
	const utils = getRTUtils();
	if (isMissingTuple(injected)) return identityFn;
	if (!isEntryTuple(injected)) {
		if (runTypeId === void 0) throw new Error(`${fnName}(): no id injected. @mionjs/devtools must be active for ${fnName} to dispatch to a precompiled factory.`);
		if (utils.knowsType(runTypeId)) return identityFn;
		throw new Error(`${fnName}(): no RTCompiledFn entry for run-type id "${runTypeId}" in rtUtils.`);
	}
	initFromTuple(injected);
	let key = entryTupleKey(injected);
	if (runTypeId !== void 0) key = key.slice(0, 4) + "_" + runTypeId;
	const typeId = key.slice(5);
	const entry = utils.getRT(key);
	if (entry) return entry.fn;
	if (utils.knowsType(typeId)) return identityFn;
	throw new Error(`${fnName}(): no RTCompiledFn entry for "${key}" in rtUtils. The build pipeline didn't emit a factory for that runtype.`);
}
// ../node_modules/.pnpm/@mionjs+run-types@0.14.0/node_modules/@mionjs/run-types/dist/createRTFunctions.js
function resolveTupleEntry(fnName, identityFn, val, args) {
	return resolveEntryTupleFn(fnName, identityFn, isRunTypeValue(val) ? val.id : void 0, args);
}
function createTypeFnArgsFunction(fnName, identityFn) {
	return (val, _options, args) => resolveTupleEntry(fnName, identityFn, val, args);
}
const getValidationErrorsIdentity = () => [];
const createValidateFn = createTypeFnArgsFunction("createValidateFn", (() => true));
const createGetValidationErrorsFn = createTypeFnArgsFunction("createGetValidationErrorsFn", getValidationErrorsIdentity);
// ../schemas/libraries/@mionjs/run-types/download/index.ts
const validate = createValidateFn(void 0, void 0, __rt_WOvb_YYm3EVP);
const getErrors = createGetValidationErrorsFn(void 0, void 0, __rt_aZak_YYm3EVP);
const data = {};
if (!validate(data)) getErrors(data);
