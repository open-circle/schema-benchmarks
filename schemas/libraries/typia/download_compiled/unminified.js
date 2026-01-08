//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
//#region ../node_modules/.pnpm/typia@11.0.0_@types+node@24.10.1_typescript@5.9.3/node_modules/typia/lib/internal/_validateReport.js
var require__validateReport = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._validateReport = void 0;
	const _validateReport = (array) => {
		const reportable = (path) => {
			if (array.length === 0) return true;
			const last = array[array.length - 1].path;
			return path.length > last.length || last.substring(0, path.length) !== path;
		};
		return (exceptable, error) => {
			var _a;
			if (exceptable && reportable(error.path)) {
				if (error.value === void 0) (_a = error.description) !== null && _a !== void 0 || (error.description = [
					"The value at this path is `undefined`.",
					"",
					`Please fill the \`${error.expected}\` typed value next time.`
				].join("\n"));
				array.push(error);
			}
			return false;
		};
	};
	exports._validateReport = _validateReport;
}));

//#endregion
//#region ../schemas/libraries/typia/download.ts
var import__validateReport = /* @__PURE__ */ __toESM(require__validateReport(), 1);
(() => {
	const _io0 = (input) => "number" === typeof input.id && input.created instanceof Date && "string" === typeof input.title && 1 <= input.title.length && input.title.length <= 100 && "string" === typeof input.brand && 1 <= input.brand.length && input.brand.length <= 30 && "string" === typeof input.description && 1 <= input.description.length && input.description.length <= 500 && "number" === typeof input.price && 1 <= input.price && input.price <= 1e4 && (null === input.discount || "number" === typeof input.discount && 1 <= input.discount && input.discount <= 100) && "number" === typeof input.quantity && 1 <= input.quantity && input.quantity <= 10 && Array.isArray(input.tags) && 1 <= input.tags.length && input.tags.length <= 30 && input.tags.every((elem) => "string" === typeof elem) && Array.isArray(input.images) && input.images.every((elem) => "object" === typeof elem && null !== elem && _io1(elem)) && Array.isArray(input.ratings) && input.ratings.every((elem) => "object" === typeof elem && null !== elem && _io2(elem));
	const _io1 = (input) => "number" === typeof input.id && input.created instanceof Date && "string" === typeof input.title && 1 <= input.title.length && input.title.length <= 100 && ("jpg" === input.type || "png" === input.type) && "number" === typeof input.size && "string" === typeof input.url && /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu.test(input.url);
	const _io2 = (input) => "number" === typeof input.id && "number" === typeof input.stars && 1 <= input.stars && input.stars <= 5 && "string" === typeof input.title && 1 <= input.title.length && input.title.length <= 100 && "string" === typeof input.text && 1 <= input.text.length && input.text.length <= 1e3 && Array.isArray(input.images) && input.images.every((elem) => "object" === typeof elem && null !== elem && _io1(elem));
	const _vo0 = (input, _path, _exceptionable = true) => [
		"number" === typeof input.id || _report(_exceptionable, {
			path: _path + ".id",
			expected: "number",
			value: input.id
		}),
		input.created instanceof Date || _report(_exceptionable, {
			path: _path + ".created",
			expected: "Date",
			value: input.created
		}),
		"string" === typeof input.title && (1 <= input.title.length || _report(_exceptionable, {
			path: _path + ".title",
			expected: "string & MinLength<1>",
			value: input.title
		})) && (input.title.length <= 100 || _report(_exceptionable, {
			path: _path + ".title",
			expected: "string & MaxLength<100>",
			value: input.title
		})) || _report(_exceptionable, {
			path: _path + ".title",
			expected: "(string & MinLength<1> & MaxLength<100>)",
			value: input.title
		}),
		"string" === typeof input.brand && (1 <= input.brand.length || _report(_exceptionable, {
			path: _path + ".brand",
			expected: "string & MinLength<1>",
			value: input.brand
		})) && (input.brand.length <= 30 || _report(_exceptionable, {
			path: _path + ".brand",
			expected: "string & MaxLength<30>",
			value: input.brand
		})) || _report(_exceptionable, {
			path: _path + ".brand",
			expected: "(string & MinLength<1> & MaxLength<30>)",
			value: input.brand
		}),
		"string" === typeof input.description && (1 <= input.description.length || _report(_exceptionable, {
			path: _path + ".description",
			expected: "string & MinLength<1>",
			value: input.description
		})) && (input.description.length <= 500 || _report(_exceptionable, {
			path: _path + ".description",
			expected: "string & MaxLength<500>",
			value: input.description
		})) || _report(_exceptionable, {
			path: _path + ".description",
			expected: "(string & MinLength<1> & MaxLength<500>)",
			value: input.description
		}),
		"number" === typeof input.price && (1 <= input.price || _report(_exceptionable, {
			path: _path + ".price",
			expected: "number & Minimum<1>",
			value: input.price
		})) && (input.price <= 1e4 || _report(_exceptionable, {
			path: _path + ".price",
			expected: "number & Maximum<10000>",
			value: input.price
		})) || _report(_exceptionable, {
			path: _path + ".price",
			expected: "(number & Minimum<1> & Maximum<10000>)",
			value: input.price
		}),
		null === input.discount || "number" === typeof input.discount && (1 <= input.discount || _report(_exceptionable, {
			path: _path + ".discount",
			expected: "number & Minimum<1>",
			value: input.discount
		})) && (input.discount <= 100 || _report(_exceptionable, {
			path: _path + ".discount",
			expected: "number & Maximum<100>",
			value: input.discount
		})) || _report(_exceptionable, {
			path: _path + ".discount",
			expected: "((number & Minimum<1> & Maximum<100>) | null)",
			value: input.discount
		}),
		"number" === typeof input.quantity && (1 <= input.quantity || _report(_exceptionable, {
			path: _path + ".quantity",
			expected: "number & Minimum<1>",
			value: input.quantity
		})) && (input.quantity <= 10 || _report(_exceptionable, {
			path: _path + ".quantity",
			expected: "number & Maximum<10>",
			value: input.quantity
		})) || _report(_exceptionable, {
			path: _path + ".quantity",
			expected: "(number & Minimum<1> & Maximum<10>)",
			value: input.quantity
		}),
		(Array.isArray(input.tags) || _report(_exceptionable, {
			path: _path + ".tags",
			expected: "(Array<string> & MinItems<1> & MaxItems<30>)",
			value: input.tags
		})) && (1 <= input.tags.length || _report(_exceptionable, {
			path: _path + ".tags",
			expected: "Array<> & MinItems<1>",
			value: input.tags
		})) && (input.tags.length <= 30 || _report(_exceptionable, {
			path: _path + ".tags",
			expected: "Array<> & MaxItems<30>",
			value: input.tags
		})) && input.tags.map((elem, _index5) => "string" === typeof elem || _report(_exceptionable, {
			path: _path + ".tags[" + _index5 + "]",
			expected: "string",
			value: elem
		})).every((flag) => flag) || _report(_exceptionable, {
			path: _path + ".tags",
			expected: "(Array<string> & MinItems<1> & MaxItems<30>)",
			value: input.tags
		}),
		(Array.isArray(input.images) || _report(_exceptionable, {
			path: _path + ".images",
			expected: "Array<ImageSchema>",
			value: input.images
		})) && input.images.map((elem, _index6) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
			path: _path + ".images[" + _index6 + "]",
			expected: "ImageSchema",
			value: elem
		})) && _vo1(elem, _path + ".images[" + _index6 + "]", _exceptionable) || _report(_exceptionable, {
			path: _path + ".images[" + _index6 + "]",
			expected: "ImageSchema",
			value: elem
		})).every((flag) => flag) || _report(_exceptionable, {
			path: _path + ".images",
			expected: "Array<ImageSchema>",
			value: input.images
		}),
		(Array.isArray(input.ratings) || _report(_exceptionable, {
			path: _path + ".ratings",
			expected: "Array<RatingSchema>",
			value: input.ratings
		})) && input.ratings.map((elem, _index7) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
			path: _path + ".ratings[" + _index7 + "]",
			expected: "RatingSchema",
			value: elem
		})) && _vo2(elem, _path + ".ratings[" + _index7 + "]", _exceptionable) || _report(_exceptionable, {
			path: _path + ".ratings[" + _index7 + "]",
			expected: "RatingSchema",
			value: elem
		})).every((flag) => flag) || _report(_exceptionable, {
			path: _path + ".ratings",
			expected: "Array<RatingSchema>",
			value: input.ratings
		})
	].every((flag) => flag);
	const _vo1 = (input, _path, _exceptionable = true) => [
		"number" === typeof input.id || _report(_exceptionable, {
			path: _path + ".id",
			expected: "number",
			value: input.id
		}),
		input.created instanceof Date || _report(_exceptionable, {
			path: _path + ".created",
			expected: "Date",
			value: input.created
		}),
		"string" === typeof input.title && (1 <= input.title.length || _report(_exceptionable, {
			path: _path + ".title",
			expected: "string & MinLength<1>",
			value: input.title
		})) && (input.title.length <= 100 || _report(_exceptionable, {
			path: _path + ".title",
			expected: "string & MaxLength<100>",
			value: input.title
		})) || _report(_exceptionable, {
			path: _path + ".title",
			expected: "(string & MinLength<1> & MaxLength<100>)",
			value: input.title
		}),
		"jpg" === input.type || "png" === input.type || _report(_exceptionable, {
			path: _path + ".type",
			expected: "(\"jpg\" | \"png\")",
			value: input.type
		}),
		"number" === typeof input.size || _report(_exceptionable, {
			path: _path + ".size",
			expected: "number",
			value: input.size
		}),
		"string" === typeof input.url && (/^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu.test(input.url) || _report(_exceptionable, {
			path: _path + ".url",
			expected: "string & Format<\"url\">",
			value: input.url
		})) || _report(_exceptionable, {
			path: _path + ".url",
			expected: "(string & Format<\"url\">)",
			value: input.url
		})
	].every((flag) => flag);
	const _vo2 = (input, _path, _exceptionable = true) => [
		"number" === typeof input.id || _report(_exceptionable, {
			path: _path + ".id",
			expected: "number",
			value: input.id
		}),
		"number" === typeof input.stars && (1 <= input.stars || _report(_exceptionable, {
			path: _path + ".stars",
			expected: "number & Minimum<1>",
			value: input.stars
		})) && (input.stars <= 5 || _report(_exceptionable, {
			path: _path + ".stars",
			expected: "number & Maximum<5>",
			value: input.stars
		})) || _report(_exceptionable, {
			path: _path + ".stars",
			expected: "(number & Minimum<1> & Maximum<5>)",
			value: input.stars
		}),
		"string" === typeof input.title && (1 <= input.title.length || _report(_exceptionable, {
			path: _path + ".title",
			expected: "string & MinLength<1>",
			value: input.title
		})) && (input.title.length <= 100 || _report(_exceptionable, {
			path: _path + ".title",
			expected: "string & MaxLength<100>",
			value: input.title
		})) || _report(_exceptionable, {
			path: _path + ".title",
			expected: "(string & MinLength<1> & MaxLength<100>)",
			value: input.title
		}),
		"string" === typeof input.text && (1 <= input.text.length || _report(_exceptionable, {
			path: _path + ".text",
			expected: "string & MinLength<1>",
			value: input.text
		})) && (input.text.length <= 1e3 || _report(_exceptionable, {
			path: _path + ".text",
			expected: "string & MaxLength<1000>",
			value: input.text
		})) || _report(_exceptionable, {
			path: _path + ".text",
			expected: "(string & MinLength<1> & MaxLength<1000>)",
			value: input.text
		}),
		(Array.isArray(input.images) || _report(_exceptionable, {
			path: _path + ".images",
			expected: "Array<ImageSchema>",
			value: input.images
		})) && input.images.map((elem, _index8) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
			path: _path + ".images[" + _index8 + "]",
			expected: "ImageSchema",
			value: elem
		})) && _vo1(elem, _path + ".images[" + _index8 + "]", _exceptionable) || _report(_exceptionable, {
			path: _path + ".images[" + _index8 + "]",
			expected: "ImageSchema",
			value: elem
		})).every((flag) => flag) || _report(_exceptionable, {
			path: _path + ".images",
			expected: "Array<ImageSchema>",
			value: input.images
		})
	].every((flag) => flag);
	const __is = (input) => "object" === typeof input && null !== input && _io0(input);
	let errors;
	let _report;
	return (input) => {
		if (false === __is(input)) {
			errors = [];
			_report = import__validateReport._validateReport(errors);
			((input$1, _path, _exceptionable = true) => ("object" === typeof input$1 && null !== input$1 || _report(true, {
				path: _path + "",
				expected: "__type",
				value: input$1
			})) && _vo0(input$1, _path + "", true) || _report(true, {
				path: _path + "",
				expected: "__type",
				value: input$1
			}))(input, "$input", true);
			const success = 0 === errors.length;
			return success ? {
				success,
				data: input
			} : {
				success,
				errors,
				data: input
			};
		}
		return {
			success: true,
			data: input
		};
	};
})()({});

//#endregion