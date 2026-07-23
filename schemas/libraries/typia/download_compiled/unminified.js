//#region ../node_modules/.pnpm/typia@13.2.0_@types+node@24.0.0_ttsc@0.19.3/node_modules/typia/lib/internal/_isFormatUrl.mjs
const _isFormatUrl = (str) => PATTERN.test(str);
const PATTERN = /^(?:https?|ftp):\/\/(?:[^\s/?#@]+(?::[^\s/?#@]*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?=.{1,253}(?::\d{2,5})?(?:\/[^\s]*)?$)(?:[a-z0-9\u00a1-\uffff](?:[-a-z0-9\u00a1-\uffff]{0,61}[a-z0-9\u00a1-\uffff])?\.)+(?:[a-z\u00a1-\uffff](?:[-a-z0-9\u00a1-\uffff]{0,61}[a-z0-9\u00a1-\uffff])))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
//#endregion
//#region ../node_modules/.pnpm/typia@13.2.0_@types+node@24.0.0_ttsc@0.19.3/node_modules/typia/lib/internal/_stringLength.mjs
const _stringLength = (value) => {
	let count = 0;
	for (const _ch of value) ++count;
	return count;
};
//#endregion
//#region ../node_modules/.pnpm/typia@13.2.0_@types+node@24.0.0_ttsc@0.19.3/node_modules/typia/lib/internal/_validateReport.mjs
const _validateReport = (array) => {
	const isAncestor = (ancestor, descendant) => descendant === ancestor || descendant.startsWith(`${ancestor}.`) || descendant.startsWith(`${ancestor}[`);
	const reportable = (path) => {
		if (array.length === 0) return true;
		const last = array[array.length - 1].path;
		return isAncestor(path, last) === false && isAncestor(last, path) === false;
	};
	return (exceptable, error) => {
		if (exceptable && reportable(error.path)) {
			if (error.value === void 0) error.description ??= [
				"The value at this path is `undefined`.",
				"",
				`Please fill the \`${error.expected}\` typed value next time.`
			].join("\n");
			array.push(error);
		}
		return false;
	};
};
//#endregion
//#region ../schemas/libraries/typia/download.ts
(() => {
	const _ip0 = (input) => "number" === typeof input["id"];
	const _ip1 = (input) => input["created"] instanceof Date;
	const _ip2 = (input) => "string" === typeof input["title"] && 1 <= _stringLength(input["title"]) && _stringLength(input["title"]) <= 100;
	const _ip3 = (input) => Array.isArray(input["images"]) && input["images"].every((elem) => "object" === typeof elem && null !== elem && _io1(elem));
	const _ve0 = "{ id: number; created: Date; title: string & MinLength<1> & MaxLength<100>; brand: string & MinLength<1> & MaxLength<30>; description: string & ... 1 more ... & MaxLength<...>; ... 5 more ...; ratings: RatingSchema[]; }";
	const _vp0 = (input, _path, _exceptionable = true) => "number" === typeof input["id"] || _report(_exceptionable, {
		path: _path + ".id",
		expected: "number",
		value: input["id"]
	});
	const _vp1 = (input, _path, _exceptionable = true) => input["created"] instanceof Date || _report(_exceptionable, {
		path: _path + ".created",
		expected: "Date",
		value: input["created"]
	});
	const _vp2 = (input, _path, _exceptionable = true) => "string" === typeof input["title"] && (1 <= _stringLength(input["title"]) || _report(_exceptionable, {
		path: _path + ".title",
		expected: "string & MinLength<1>",
		value: input["title"]
	})) && (_stringLength(input["title"]) <= 100 || _report(_exceptionable, {
		path: _path + ".title",
		expected: "string & MaxLength<100>",
		value: input["title"]
	})) || _report(_exceptionable, {
		path: _path + ".title",
		expected: "(string & MinLength<1> & MaxLength<100>)",
		value: input["title"]
	});
	const _vp3 = (input, _path, _exceptionable = true) => (Array.isArray(input["images"]) || _report(_exceptionable, {
		path: _path + ".images",
		expected: "Array<ImageSchema>",
		value: input["images"]
	})) && input["images"].map((elem, _index5) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
		path: _path + ".images[" + _index5 + "]",
		expected: "ImageSchema",
		value: elem
	})) && _vo1(elem, _path + ".images[" + _index5 + "]", _exceptionable) || _report(_exceptionable, {
		path: _path + ".images[" + _index5 + "]",
		expected: "ImageSchema",
		value: elem
	})).every((flag) => flag) || _report(_exceptionable, {
		path: _path + ".images",
		expected: "Array<ImageSchema>",
		value: input["images"]
	});
	const _io0 = (input) => _ip0(input) && _ip1(input) && _ip2(input) && "string" === typeof input.brand && 1 <= _stringLength(input.brand) && _stringLength(input.brand) <= 30 && "string" === typeof input.description && 1 <= _stringLength(input.description) && _stringLength(input.description) <= 500 && "number" === typeof input.price && 1 <= input.price && input.price <= 1e4 && (null === input.discount || "number" === typeof input.discount && 1 <= input.discount && input.discount <= 100) && "number" === typeof input.quantity && 1 <= input.quantity && input.quantity <= 10 && Array.isArray(input.tags) && 1 <= input.tags.length && input.tags.length <= 30 && input.tags.every((elem) => "string" === typeof elem) && _ip3(input) && Array.isArray(input.ratings) && input.ratings.every((elem) => "object" === typeof elem && null !== elem && _io2(elem));
	const _io1 = (input) => _ip0(input) && _ip1(input) && _ip2(input) && ("jpg" === input.type || "png" === input.type) && "number" === typeof input.size && "string" === typeof input.url && _isFormatUrl(input.url);
	const _io2 = (input) => _ip0(input) && "number" === typeof input.stars && 1 <= input.stars && input.stars <= 5 && _ip2(input) && "string" === typeof input.text && 1 <= _stringLength(input.text) && _stringLength(input.text) <= 1e3 && _ip3(input);
	const _vo0 = (input, _path, _exceptionable = true) => [
		_vp0(input, _path, _exceptionable),
		_vp1(input, _path, _exceptionable),
		_vp2(input, _path, _exceptionable),
		"string" === typeof input.brand && (1 <= _stringLength(input.brand) || _report(_exceptionable, {
			path: _path + ".brand",
			expected: "string & MinLength<1>",
			value: input.brand
		})) && (_stringLength(input.brand) <= 30 || _report(_exceptionable, {
			path: _path + ".brand",
			expected: "string & MaxLength<30>",
			value: input.brand
		})) || _report(_exceptionable, {
			path: _path + ".brand",
			expected: "(string & MinLength<1> & MaxLength<30>)",
			value: input.brand
		}),
		"string" === typeof input.description && (1 <= _stringLength(input.description) || _report(_exceptionable, {
			path: _path + ".description",
			expected: "string & MinLength<1>",
			value: input.description
		})) && (_stringLength(input.description) <= 500 || _report(_exceptionable, {
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
		})) && input.tags.map((elem, _index4) => "string" === typeof elem || _report(_exceptionable, {
			path: _path + ".tags[" + _index4 + "]",
			expected: "string",
			value: elem
		})).every((flag) => flag) || _report(_exceptionable, {
			path: _path + ".tags",
			expected: "(Array<string> & MinItems<1> & MaxItems<30>)",
			value: input.tags
		}),
		_vp3(input, _path, _exceptionable),
		(Array.isArray(input.ratings) || _report(_exceptionable, {
			path: _path + ".ratings",
			expected: "Array<RatingSchema>",
			value: input.ratings
		})) && input.ratings.map((elem, _index6) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
			path: _path + ".ratings[" + _index6 + "]",
			expected: "RatingSchema",
			value: elem
		})) && _vo2(elem, _path + ".ratings[" + _index6 + "]", _exceptionable) || _report(_exceptionable, {
			path: _path + ".ratings[" + _index6 + "]",
			expected: "RatingSchema",
			value: elem
		})).every((flag) => flag) || _report(_exceptionable, {
			path: _path + ".ratings",
			expected: "Array<RatingSchema>",
			value: input.ratings
		})
	].every((flag) => flag);
	const _vo1 = (input, _path, _exceptionable = true) => [
		_vp0(input, _path, _exceptionable),
		_vp1(input, _path, _exceptionable),
		_vp2(input, _path, _exceptionable),
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
		"string" === typeof input.url && (_isFormatUrl(input.url) || _report(_exceptionable, {
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
		_vp0(input, _path, _exceptionable),
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
		_vp2(input, _path, _exceptionable),
		"string" === typeof input.text && (1 <= _stringLength(input.text) || _report(_exceptionable, {
			path: _path + ".text",
			expected: "string & MinLength<1>",
			value: input.text
		})) && (_stringLength(input.text) <= 1e3 || _report(_exceptionable, {
			path: _path + ".text",
			expected: "string & MaxLength<1000>",
			value: input.text
		})) || _report(_exceptionable, {
			path: _path + ".text",
			expected: "(string & MinLength<1> & MaxLength<1000>)",
			value: input.text
		}),
		_vp3(input, _path, _exceptionable)
	].every((flag) => flag);
	const __is = (input) => "object" === typeof input && null !== input && _io0(input);
	let errors;
	let _report;
	return (input) => {
		if (false === __is(input)) {
			errors = [];
			_report = _validateReport(errors);
			((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
				path: _path + "",
				expected: _ve0,
				value: input
			})) && _vo0(input, _path + "", true) || _report(true, {
				path: _path + "",
				expected: _ve0,
				value: input
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
