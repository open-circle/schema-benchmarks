//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/issue.js
const issueCodes = {
	INVALID_TYPE: "invalid_type",
	TOO_SHORT: "too_short",
	TOO_LONG: "too_long",
	DUPLICATE_KEY: "duplicate_key",
	TOO_DEEP: "too_deep",
	INVALID_EMAIL: "invalid_email",
	INVALID_EMOJI: "invalid_emoji",
	INVALID_UUID: "invalid_uuid",
	INVALID_NANOID: "invalid_nanoid",
	DOES_NOT_INCLUDE: "does_not_include",
	DOES_NOT_START_WITH: "does_not_start_with",
	DOES_NOT_END_WITH: "does_not_end_with",
	INVALID_DATE_STRING: "invalid_date_string",
	INVALID_TIME_STRING: "invalid_time_string",
	INVALID_DATE_TIME_STRING: "invalid_date_time_string",
	INVALID_IP_ADDRESS: "invalid_ip_address",
	INVALID_IP_ADDRESS_RANGE: "invalid_ip_address_range",
	INVALID_URL: "invalid_url",
	DOES_NOT_MATCH_REGEX: "does_not_match_regex",
	TOO_SMALL: "too_small",
	TOO_LARGE: "too_large",
	INVALID_INTEGER: "invalid_integer",
	INVALID_FINITE: "invalid_finite",
	INVALID_SAFE_INTEGER: "invalid_safe_integer",
	INVALID_VALUE: "invalid_value",
	INVALID_DISCRIMINATOR_VALUE: "invalid_discriminator_value",
	INVALID_ENUM_VALUE: "invalid_enum_value",
	UNRECOGNIZED_KEY: "unrecognized_key",
	MISSING_VALUE: "missing_value",
	INVALID_DATE: "invalid_date",
	TOO_RECENT: "too_recent",
	TOO_DATED: "too_dated"
};
function addIssue(node, newNode) {
	if (!node) return newNode;
	return {
		type: "join",
		left: node,
		right: newNode
	};
}
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/message.js
function messageList(node, locale) {
	const messages = [];
	const missingCodes = /* @__PURE__ */ new Set();
	const stack = [];
	let current = [node, []];
	while (current) {
		const [currentNode, currentPath] = current;
		switch (currentNode.type) {
			case "leaf": {
				let text;
				if (locale === void 0) text = currentNode.code;
				else {
					const formatter = locale[currentNode.code];
					if (formatter === void 0) {
						missingCodes.add(currentNode.code);
						break;
					}
					const { code, type, ...placeholders } = currentNode;
					text = formatter(placeholders);
				}
				messages.push({
					path: currentPath,
					message: text
				});
				break;
			}
			case "join":
				stack.push([currentNode.right, currentPath], [currentNode.left, currentPath]);
				break;
			case "nest":
				stack.push([currentNode.child, [...currentPath, currentNode.key]]);
				break;
		}
		current = stack.pop();
	}
	if (missingCodes.size > 0) {
		const sorted = [...missingCodes].sort();
		throw new Error(`No messages for codes: ${sorted.join(", ")}.`);
	}
	return messages;
}
//#endregion
//#region ../node_modules/.pnpm/@jsr+paseri__paseri@1.9.5/node_modules/@jsr/paseri__paseri/src/result.js
var ParseErrorResult = class {
	ok = false;
	_issue;
	constructor(issue) {
		this._issue = issue;
	}
	get issue() {
		return this._issue;
	}
	messages(locale) {
		return messageList(this._issue, locale);
	}
};
/**
* `PaseriError` is thrown from `parse` when the data being validated does not adhere to the expected schema.
*/ var PaseriError = class extends Error {
	_issue;
	constructor(issue) {
		super("Failed to parse. See `e.messages()` for details.");
		this._issue = issue;
	}
	/**
	* Retrieve the error messages for a parsing failure.
	* @param locale The locale to use for error messages.
	*/ messages(locale) {
		return messageList(this._issue, locale);
	}
};
function isParseSuccess(value) {
	return value.ok === true;
}
//#endregion
//#region ../schemas/libraries/@paseri/compiler/compiled.gen.ts
function isPlainObject(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	if (value.constructor === Object) return true;
	if (value.constructor === void 0) return Object.getPrototypeOf(value) === null;
	if (!Object.hasOwn(value, "constructor")) return false;
	return Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null;
}
const _enum20 = /* @__PURE__ */ new Set(["jpg", "png"]);
const _regex21 = /* @__PURE__ */ new RegExp("^(?:(?:(?:https?|ftp|wss?):\\/\\/(?:(?=[a-z\\d\\._\\-]*?[a-z_\\-])(?:(?=([a-z\\d\\._\\-]+))\\1))(?::(?:6553[0-5]|655[0-2]\\d|65[0-4]\\d\\d|6[0-4]\\d{3}|[1-5]\\d{4}|\\d{1,4}))?(?:(?:[\\/\\?\\#].*)?))|(?:(?!(?:(?:https?|ftp|wss?|file):))[a-z](?:(?=([a-z\\d\\+\\.\\-]*))\\2):(?!\\/\\/).*))$", "iv");
function _shapeArray15(_arr13) {
	for (let _i14 = 0; _i14 < _arr13.length; _i14++) {
		const _el10 = _arr13[_i14];
		if (!(typeof _el10 === "string" && _el10.length >= 1 && _el10.length <= 30)) return false;
	}
	return true;
}
function _extrasOk25(_obj22) {
	let _count23 = 0;
	for (const _k24 in _obj22) _count23++;
	return _count23 <= 6;
}
function _shapeArray28(_arr26) {
	for (let _i27 = 0; _i27 < _arr26.length; _i27++) {
		const _el17 = _arr26[_i27];
		if (!(isPlainObject(_el17) && typeof _el17["id"] === "number" && !Number.isNaN(_el17["id"]) && _el17["created"] instanceof Date && !Number.isNaN(_el17["created"].getTime()) && typeof _el17["title"] === "string" && _el17["title"].length >= 1 && _el17["title"].length <= 100 && _enum20.has(_el17["type"]) && typeof _el17["size"] === "number" && !Number.isNaN(_el17["size"]) && typeof _el17["url"] === "string" && (_regex21.test(_el17["url"]) || URL.canParse(_el17["url"])) && _extrasOk25(_el17))) return false;
	}
	return true;
}
function _extrasOk46(_obj43) {
	let _count44 = 0;
	for (const _k45 in _obj43) _count44++;
	return _count44 <= 5;
}
function _shapeArray49(_arr47) {
	for (let _i48 = 0; _i48 < _arr47.length; _i48++) {
		const _el30 = _arr47[_i48];
		if (!(isPlainObject(_el30) && typeof _el30["id"] === "number" && !Number.isNaN(_el30["id"]) && typeof _el30["stars"] === "number" && !Number.isNaN(_el30["stars"]) && _el30["stars"] >= 0 && _el30["stars"] <= 5 && typeof _el30["title"] === "string" && _el30["title"].length >= 1 && _el30["title"].length <= 100 && typeof _el30["text"] === "string" && _el30["text"].length >= 1 && _el30["text"].length <= 1e3 && Array.isArray(_el30["images"]) && _shapeArray28(_el30["images"]) && _extrasOk46(_el30))) return false;
	}
	return true;
}
function _objectIssues108(_val87) {
	let _issue88;
	if (!isPlainObject(_val87)) _issue88 = addIssue(_issue88, {
		type: "leaf",
		code: issueCodes.INVALID_TYPE,
		expected: "object"
	});
	else {
		let _issue89;
		let _value90;
		const _has91 = "id" in _val87;
		if (_has91) {
			_value90 = _val87["id"];
			if (!(typeof _value90 === "number" && !Number.isNaN(_value90))) _issue89 = addIssue(_issue89, {
				type: "nest",
				key: "id",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "number"
				}
			});
		}
		let _value92;
		const _has93 = "created" in _val87;
		if (_has93) {
			_value92 = _val87["created"];
			if (!(_value92 instanceof Date)) _issue89 = addIssue(_issue89, {
				type: "nest",
				key: "created",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "Date"
				}
			});
			else {
				const _time94 = _value92.getTime();
				if (Number.isNaN(_time94)) _issue89 = addIssue(_issue89, {
					type: "nest",
					key: "created",
					child: {
						type: "leaf",
						code: issueCodes.INVALID_DATE
					}
				});
			}
		}
		let _value95;
		const _has96 = "title" in _val87;
		if (_has96) {
			_value95 = _val87["title"];
			if (!(typeof _value95 === "string")) _issue89 = addIssue(_issue89, {
				type: "nest",
				key: "title",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "string"
				}
			});
			else _labelCheck97: {
				if (!(_value95.length >= 1)) {
					_issue89 = addIssue(_issue89, {
						type: "nest",
						key: "title",
						child: {
							type: "leaf",
							code: issueCodes.TOO_SHORT
						}
					});
					break _labelCheck97;
				}
				if (!(_value95.length <= 100)) {
					_issue89 = addIssue(_issue89, {
						type: "nest",
						key: "title",
						child: {
							type: "leaf",
							code: issueCodes.TOO_LONG
						}
					});
					break _labelCheck97;
				}
			}
		}
		let _value98;
		const _has99 = "type" in _val87;
		if (_has99) {
			_value98 = _val87["type"];
			if (!_enum20.has(_value98)) _issue89 = addIssue(_issue89, {
				type: "nest",
				key: "type",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_ENUM_VALUE,
					expected: ["'jpg'", "'png'"]
				}
			});
		}
		let _value100;
		const _has101 = "size" in _val87;
		if (_has101) {
			_value100 = _val87["size"];
			if (!(typeof _value100 === "number" && !Number.isNaN(_value100))) _issue89 = addIssue(_issue89, {
				type: "nest",
				key: "size",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "number"
				}
			});
		}
		let _value102;
		const _has103 = "url" in _val87;
		if (_has103) {
			_value102 = _val87["url"];
			if (!(typeof _value102 === "string")) _issue89 = addIssue(_issue89, {
				type: "nest",
				key: "url",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "string"
				}
			});
			else _labelCheck104: if (!(_regex21.test(_value102) || URL.canParse(_value102))) {
				_issue89 = addIssue(_issue89, {
					type: "nest",
					key: "url",
					child: {
						type: "leaf",
						code: issueCodes.INVALID_URL
					}
				});
				break _labelCheck104;
			}
		}
		if (!_has91) _issue89 = addIssue(_issue89, {
			type: "nest",
			key: "id",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has93) _issue89 = addIssue(_issue89, {
			type: "nest",
			key: "created",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has96) _issue89 = addIssue(_issue89, {
			type: "nest",
			key: "title",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has99) _issue89 = addIssue(_issue89, {
			type: "nest",
			key: "type",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has101) _issue89 = addIssue(_issue89, {
			type: "nest",
			key: "size",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has103) _issue89 = addIssue(_issue89, {
			type: "nest",
			key: "url",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		let _count106 = 0;
		for (const _k107 in _val87) _count106++;
		if (_count106 !== 6 || !_has91 || !_has93 || !_has96 || !_has99 || !_has101 || !_has103) {
			for (const _key105 in _val87) if (!(_key105 === "id" || _key105 === "created" || _key105 === "title" || _key105 === "type" || _key105 === "size" || _key105 === "url")) _issue89 = addIssue(_issue89, {
				type: "nest",
				key: _key105,
				child: {
					type: "leaf",
					code: issueCodes.UNRECOGNIZED_KEY
				}
			});
		}
		if (_issue89 !== void 0) _issue88 = addIssue(_issue88, _issue89);
	}
	return _issue88;
}
function _objectIssues160(_val115) {
	let _issue116;
	if (!isPlainObject(_val115)) _issue116 = addIssue(_issue116, {
		type: "leaf",
		code: issueCodes.INVALID_TYPE,
		expected: "object"
	});
	else {
		let _issue117;
		let _value118;
		const _has119 = "id" in _val115;
		if (_has119) {
			_value118 = _val115["id"];
			if (!(typeof _value118 === "number" && !Number.isNaN(_value118))) _issue117 = addIssue(_issue117, {
				type: "nest",
				key: "id",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "number"
				}
			});
		}
		let _value120;
		const _has121 = "stars" in _val115;
		if (_has121) {
			_value120 = _val115["stars"];
			if (!(typeof _value120 === "number" && !Number.isNaN(_value120))) _issue117 = addIssue(_issue117, {
				type: "nest",
				key: "stars",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "number"
				}
			});
			else _labelCheck122: {
				if (!(_value120 >= 0)) {
					_issue117 = addIssue(_issue117, {
						type: "nest",
						key: "stars",
						child: {
							type: "leaf",
							code: issueCodes.TOO_SMALL
						}
					});
					break _labelCheck122;
				}
				if (!(_value120 <= 5)) {
					_issue117 = addIssue(_issue117, {
						type: "nest",
						key: "stars",
						child: {
							type: "leaf",
							code: issueCodes.TOO_LARGE
						}
					});
					break _labelCheck122;
				}
			}
		}
		let _value123;
		const _has124 = "title" in _val115;
		if (_has124) {
			_value123 = _val115["title"];
			if (!(typeof _value123 === "string")) _issue117 = addIssue(_issue117, {
				type: "nest",
				key: "title",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "string"
				}
			});
			else _labelCheck125: {
				if (!(_value123.length >= 1)) {
					_issue117 = addIssue(_issue117, {
						type: "nest",
						key: "title",
						child: {
							type: "leaf",
							code: issueCodes.TOO_SHORT
						}
					});
					break _labelCheck125;
				}
				if (!(_value123.length <= 100)) {
					_issue117 = addIssue(_issue117, {
						type: "nest",
						key: "title",
						child: {
							type: "leaf",
							code: issueCodes.TOO_LONG
						}
					});
					break _labelCheck125;
				}
			}
		}
		let _value126;
		const _has127 = "text" in _val115;
		if (_has127) {
			_value126 = _val115["text"];
			if (!(typeof _value126 === "string")) _issue117 = addIssue(_issue117, {
				type: "nest",
				key: "text",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "string"
				}
			});
			else _labelCheck128: {
				if (!(_value126.length >= 1)) {
					_issue117 = addIssue(_issue117, {
						type: "nest",
						key: "text",
						child: {
							type: "leaf",
							code: issueCodes.TOO_SHORT
						}
					});
					break _labelCheck128;
				}
				if (!(_value126.length <= 1e3)) {
					_issue117 = addIssue(_issue117, {
						type: "nest",
						key: "text",
						child: {
							type: "leaf",
							code: issueCodes.TOO_LONG
						}
					});
					break _labelCheck128;
				}
			}
		}
		let _value129;
		const _has130 = "images" in _val115;
		if (_has130) {
			_value129 = _val115["images"];
			if (!Array.isArray(_value129)) _issue117 = addIssue(_issue117, {
				type: "nest",
				key: "images",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_TYPE,
					expected: "array"
				}
			});
			else {
				let _issue131;
				for (let _index132 = 0; _index132 < _value129.length; _index132++) {
					let _element133 = _value129[_index132];
					const _childIssue156 = _objectIssues108(_element133);
					if (_childIssue156 !== void 0) _issue131 = addIssue(_issue131, {
						type: "nest",
						key: _index132,
						child: _childIssue156
					});
				}
				if (_issue131 !== void 0) _issue117 = addIssue(_issue117, {
					type: "nest",
					key: "images",
					child: _issue131
				});
			}
		}
		if (!_has119) _issue117 = addIssue(_issue117, {
			type: "nest",
			key: "id",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has121) _issue117 = addIssue(_issue117, {
			type: "nest",
			key: "stars",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has124) _issue117 = addIssue(_issue117, {
			type: "nest",
			key: "title",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has127) _issue117 = addIssue(_issue117, {
			type: "nest",
			key: "text",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		if (!_has130) _issue117 = addIssue(_issue117, {
			type: "nest",
			key: "images",
			child: {
				type: "leaf",
				code: issueCodes.MISSING_VALUE
			}
		});
		let _count158 = 0;
		for (const _k159 in _val115) _count158++;
		if (_count158 !== 5 || !_has119 || !_has121 || !_has124 || !_has127 || !_has130) {
			for (const _key157 in _val115) if (!(_key157 === "id" || _key157 === "stars" || _key157 === "title" || _key157 === "text" || _key157 === "images")) _issue117 = addIssue(_issue117, {
				type: "nest",
				key: _key157,
				child: {
					type: "leaf",
					code: issueCodes.UNRECOGNIZED_KEY
				}
			});
		}
		if (_issue117 !== void 0) _issue116 = addIssue(_issue116, _issue117);
	}
	return _issue116;
}
function _slowProduct(value, options) {
	const maxDepth = options?.maxDepth ?? 1e3;
	if (!Number.isInteger(maxDepth) || maxDepth < 1) throw new Error("maxDepth must be a positive integer.");
	if (!isPlainObject(value)) return {
		type: "leaf",
		code: issueCodes.INVALID_TYPE,
		expected: "object"
	};
	let _issue52;
	let _value53;
	const _has54 = "id" in value;
	if (_has54) {
		_value53 = value["id"];
		if (!(typeof _value53 === "number" && !Number.isNaN(_value53))) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "id",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "number"
			}
		});
	}
	let _value55;
	const _has56 = "created" in value;
	if (_has56) {
		_value55 = value["created"];
		if (!(_value55 instanceof Date)) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "created",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "Date"
			}
		});
		else {
			const _time57 = _value55.getTime();
			if (Number.isNaN(_time57)) _issue52 = addIssue(_issue52, {
				type: "nest",
				key: "created",
				child: {
					type: "leaf",
					code: issueCodes.INVALID_DATE
				}
			});
		}
	}
	let _value58;
	const _has59 = "title" in value;
	if (_has59) {
		_value58 = value["title"];
		if (!(typeof _value58 === "string")) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "title",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "string"
			}
		});
		else _labelCheck60: {
			if (!(_value58.length >= 1)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "title",
					child: {
						type: "leaf",
						code: issueCodes.TOO_SHORT
					}
				});
				break _labelCheck60;
			}
			if (!(_value58.length <= 100)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "title",
					child: {
						type: "leaf",
						code: issueCodes.TOO_LONG
					}
				});
				break _labelCheck60;
			}
		}
	}
	let _value61;
	const _has62 = "brand" in value;
	if (_has62) {
		_value61 = value["brand"];
		if (!(typeof _value61 === "string")) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "brand",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "string"
			}
		});
		else _labelCheck63: {
			if (!(_value61.length >= 1)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "brand",
					child: {
						type: "leaf",
						code: issueCodes.TOO_SHORT
					}
				});
				break _labelCheck63;
			}
			if (!(_value61.length <= 30)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "brand",
					child: {
						type: "leaf",
						code: issueCodes.TOO_LONG
					}
				});
				break _labelCheck63;
			}
		}
	}
	let _value64;
	const _has65 = "description" in value;
	if (_has65) {
		_value64 = value["description"];
		if (!(typeof _value64 === "string")) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "description",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "string"
			}
		});
		else _labelCheck66: {
			if (!(_value64.length >= 1)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "description",
					child: {
						type: "leaf",
						code: issueCodes.TOO_SHORT
					}
				});
				break _labelCheck66;
			}
			if (!(_value64.length <= 500)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "description",
					child: {
						type: "leaf",
						code: issueCodes.TOO_LONG
					}
				});
				break _labelCheck66;
			}
		}
	}
	let _value67;
	const _has68 = "price" in value;
	if (_has68) {
		_value67 = value["price"];
		if (!(typeof _value67 === "number" && !Number.isNaN(_value67))) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "price",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "number"
			}
		});
		else _labelCheck69: {
			if (!(_value67 >= 1)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "price",
					child: {
						type: "leaf",
						code: issueCodes.TOO_SMALL
					}
				});
				break _labelCheck69;
			}
			if (!(_value67 <= 1e4)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "price",
					child: {
						type: "leaf",
						code: issueCodes.TOO_LARGE
					}
				});
				break _labelCheck69;
			}
		}
	}
	let _value70;
	const _has71 = "discount" in value;
	if (_has71) {
		_value70 = value["discount"];
		if (_value70 !== null) if (!(typeof _value70 === "number" && !Number.isNaN(_value70))) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "discount",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "number"
			}
		});
		else _labelCheck72: {
			if (!(_value70 >= 1)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "discount",
					child: {
						type: "leaf",
						code: issueCodes.TOO_SMALL
					}
				});
				break _labelCheck72;
			}
			if (!(_value70 <= 100)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "discount",
					child: {
						type: "leaf",
						code: issueCodes.TOO_LARGE
					}
				});
				break _labelCheck72;
			}
		}
	}
	let _value73;
	const _has74 = "quantity" in value;
	if (_has74) {
		_value73 = value["quantity"];
		if (!(typeof _value73 === "number" && !Number.isNaN(_value73))) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "quantity",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "number"
			}
		});
		else _labelCheck75: {
			if (!(_value73 >= 0)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "quantity",
					child: {
						type: "leaf",
						code: issueCodes.TOO_SMALL
					}
				});
				break _labelCheck75;
			}
			if (!(_value73 <= 10)) {
				_issue52 = addIssue(_issue52, {
					type: "nest",
					key: "quantity",
					child: {
						type: "leaf",
						code: issueCodes.TOO_LARGE
					}
				});
				break _labelCheck75;
			}
		}
	}
	let _value76;
	const _has77 = "tags" in value;
	if (_has77) {
		_value76 = value["tags"];
		if (!Array.isArray(_value76)) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "tags",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "array"
			}
		});
		else {
			let _issue78;
			for (let _index79 = 0; _index79 < _value76.length; _index79++) {
				let _element80 = _value76[_index79];
				if (!(typeof _element80 === "string")) _issue78 = addIssue(_issue78, {
					type: "nest",
					key: _index79,
					child: {
						type: "leaf",
						code: issueCodes.INVALID_TYPE,
						expected: "string"
					}
				});
				else _labelCheck81: {
					if (!(_element80.length >= 1)) {
						_issue78 = addIssue(_issue78, {
							type: "nest",
							key: _index79,
							child: {
								type: "leaf",
								code: issueCodes.TOO_SHORT
							}
						});
						break _labelCheck81;
					}
					if (!(_element80.length <= 30)) {
						_issue78 = addIssue(_issue78, {
							type: "nest",
							key: _index79,
							child: {
								type: "leaf",
								code: issueCodes.TOO_LONG
							}
						});
						break _labelCheck81;
					}
				}
			}
			if (_issue78 !== void 0) _issue52 = addIssue(_issue52, {
				type: "nest",
				key: "tags",
				child: _issue78
			});
		}
	}
	let _value82;
	const _has83 = "images" in value;
	if (_has83) {
		_value82 = value["images"];
		if (!Array.isArray(_value82)) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "images",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "array"
			}
		});
		else {
			let _issue84;
			for (let _index85 = 0; _index85 < _value82.length; _index85++) {
				let _element86 = _value82[_index85];
				const _childIssue109 = _objectIssues108(_element86);
				if (_childIssue109 !== void 0) _issue84 = addIssue(_issue84, {
					type: "nest",
					key: _index85,
					child: _childIssue109
				});
			}
			if (_issue84 !== void 0) _issue52 = addIssue(_issue52, {
				type: "nest",
				key: "images",
				child: _issue84
			});
		}
	}
	let _value110;
	const _has111 = "ratings" in value;
	if (_has111) {
		_value110 = value["ratings"];
		if (!Array.isArray(_value110)) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: "ratings",
			child: {
				type: "leaf",
				code: issueCodes.INVALID_TYPE,
				expected: "array"
			}
		});
		else {
			let _issue112;
			for (let _index113 = 0; _index113 < _value110.length; _index113++) {
				let _element114 = _value110[_index113];
				const _childIssue161 = _objectIssues160(_element114);
				if (_childIssue161 !== void 0) _issue112 = addIssue(_issue112, {
					type: "nest",
					key: _index113,
					child: _childIssue161
				});
			}
			if (_issue112 !== void 0) _issue52 = addIssue(_issue52, {
				type: "nest",
				key: "ratings",
				child: _issue112
			});
		}
	}
	if (!_has54) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "id",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has56) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "created",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has59) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "title",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has62) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "brand",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has65) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "description",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has68) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "price",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has71) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "discount",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has74) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "quantity",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has77) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "tags",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has83) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "images",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	if (!_has111) _issue52 = addIssue(_issue52, {
		type: "nest",
		key: "ratings",
		child: {
			type: "leaf",
			code: issueCodes.MISSING_VALUE
		}
	});
	let _count163 = 0;
	for (const _k164 in value) _count163++;
	if (_count163 !== 11 || !_has54 || !_has56 || !_has59 || !_has62 || !_has65 || !_has68 || !_has71 || !_has74 || !_has77 || !_has83 || !_has111) {
		for (const _key162 in value) if (!(_key162 === "id" || _key162 === "created" || _key162 === "title" || _key162 === "brand" || _key162 === "description" || _key162 === "price" || _key162 === "discount" || _key162 === "quantity" || _key162 === "tags" || _key162 === "images" || _key162 === "ratings")) _issue52 = addIssue(_issue52, {
			type: "nest",
			key: _key162,
			child: {
				type: "leaf",
				code: issueCodes.UNRECOGNIZED_KEY
			}
		});
	}
	if (_issue52 !== void 0) return _issue52;
}
function _validateProduct(value, options) {
	const maxDepth = options?.maxDepth ?? 1e3;
	if (!Number.isInteger(maxDepth) || maxDepth < 1) throw new Error("maxDepth must be a positive integer.");
	if (!isPlainObject(value)) return _slowProduct(value, options);
	const _field1 = value["id"];
	if (!(typeof _field1 === "number" && !Number.isNaN(_field1))) return _slowProduct(value, options);
	const _field2 = value["created"];
	if (!(_field2 instanceof Date && !Number.isNaN(_field2.getTime()))) return _slowProduct(value, options);
	const _field3 = value["title"];
	if (!(typeof _field3 === "string" && _field3.length >= 1 && _field3.length <= 100)) return _slowProduct(value, options);
	const _field4 = value["brand"];
	if (!(typeof _field4 === "string" && _field4.length >= 1 && _field4.length <= 30)) return _slowProduct(value, options);
	const _field5 = value["description"];
	if (!(typeof _field5 === "string" && _field5.length >= 1 && _field5.length <= 500)) return _slowProduct(value, options);
	const _field6 = value["price"];
	if (!(typeof _field6 === "number" && !Number.isNaN(_field6) && _field6 >= 1 && _field6 <= 1e4)) return _slowProduct(value, options);
	const _field7 = value["discount"];
	if (!(_field7 === null || typeof _field7 === "number" && !Number.isNaN(_field7) && _field7 >= 1 && _field7 <= 100)) return _slowProduct(value, options);
	const _field8 = value["quantity"];
	if (!(typeof _field8 === "number" && !Number.isNaN(_field8) && _field8 >= 0 && _field8 <= 10)) return _slowProduct(value, options);
	const _field9 = value["tags"];
	if (!(Array.isArray(_field9) && _shapeArray15(_field9))) return _slowProduct(value, options);
	const _field16 = value["images"];
	if (!(Array.isArray(_field16) && _shapeArray28(_field16))) return _slowProduct(value, options);
	const _field29 = value["ratings"];
	if (!(Array.isArray(_field29) && _shapeArray49(_field29))) return _slowProduct(value, options);
	let _count50 = 0;
	for (const _k51 in value) _count50++;
	if (_count50 > 11) return _slowProduct(value, options);
}
function safeParseProduct(value, options) {
	const result = _validateProduct(value, options);
	if (result === void 0) return {
		ok: true,
		value
	};
	if (isParseSuccess(result)) return result;
	return new ParseErrorResult(result);
}
function parseProduct(value, options) {
	const result = safeParseProduct(value, options);
	if (result.ok) return result.value;
	throw new PaseriError(result.issue);
}
//#endregion
//#region ../schemas/libraries/@paseri/compiler/download.ts
({
	"~standard": {
		version: 1,
		vendor: "paseri",
		validate(value, options) {
			const result = safeParseProduct(value);
			if (result.ok) return { value: result.value };
			return { issues: result.messages(options?.libraryOptions?.locale) };
		}
	},
	safeParse: safeParseProduct,
	parse: parseProduct
}).safeParse({});
//#endregion
